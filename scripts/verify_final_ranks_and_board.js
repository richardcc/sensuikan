const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve('Sensuikan_App_UltraCompact.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  const port = 9340;
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1400,900',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2500));

  function getJson(urlPath) {
    return new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: urlPath }, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  try {
    const targets = await getJson('/json');
    const wsUrl = targets.find(t => t.type === 'page').webSocketDebuggerUrl;
    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    function sendCdp(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        function listener(event) {
          const msg = JSON.parse(event.data);
          if (msg.id === id) {
            ws.removeEventListener('message', listener);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        }
        ws.addEventListener('message', listener);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function captureScreen(fileName) {
      const snap = await sendCdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, fileName), Buffer.from(snap.data, 'base64'));
      console.log(`Saved screenshot: ${fileName}`);
    }

    await sendCdp('Runtime.enable');
    await sendCdp('Page.enable');

    // 1. Verify Tab K1 ranks
    console.log("--- Testing Tab K1 Commander Ranks ---");
    await sendCdp('Runtime.evaluate', { expression: "switchTab('chart-k1');" });
    await new Promise(r => setTimeout(r, 800));

    const rankChecks = [];
    for (let r = 0; r <= 5; r++) {
      await sendCdp('Runtime.evaluate', {
        expression: `(() => {
          campaignState.currentRankIdx = ${r};
          document.getElementById('rank-text').innerText = RANKS[${r}];
          const rankImg = document.getElementById('k1-rank-chit-img');
          if (rankImg) rankImg.src = getRankChitImage(${r});
        })()`
      });
      await new Promise(r => setTimeout(r, 200));

      const rInfo = await sendCdp('Runtime.evaluate', {
        expression: `JSON.stringify({
          idx: ${r},
          label: document.getElementById('rank-text').innerText,
          src: document.getElementById('k1-rank-chit-img').src.substring(0, 40),
          natW: document.getElementById('k1-rank-chit-img').naturalWidth,
          natH: document.getElementById('k1-rank-chit-img').naturalHeight
        })`,
        returnByValue: true
      });
      const parsed = JSON.parse(rInfo.result.value);
      rankChecks.push(parsed);

      if (r === 0) await captureScreen('verify_rank_0_sublt.png');
      if (r === 3) await captureScreen('verify_rank_3_commander.png');
      if (r === 5) await captureScreen('verify_rank_5_rearadmiral.png');
    }
    console.log("Rank checks:", rankChecks);

    // 2. Verify Tab 5 (Sub Board)
    console.log("--- Testing Tab 5 Sub Board ---");
    await sendCdp('Runtime.evaluate', { expression: "switchTab('sub-board');" });
    await new Promise(r => setTimeout(r, 800));

    // Check empty state
    const emptyCheck = await sendCdp('Runtime.evaluate', {
      expression: `JSON.stringify({
        subKey: currentBoardSubKey,
        bgDisplay: document.getElementById('sub-board-bg-img').style.display,
        placeholderDisplay: document.getElementById('sub-board-empty-placeholder') ? document.getElementById('sub-board-empty-placeholder').style.display : null
      })`,
      returnByValue: true
    });
    console.log("Sub Board pristine empty state:", JSON.parse(emptyCheck.result.value));

    // Select fanmade sub Type_B2_Class
    await sendCdp('Runtime.evaluate', { expression: "changeBoardSubmarine('Type_B2_Class');" });
    await new Promise(r => setTimeout(r, 1000));

    const b2Check = await sendCdp('Runtime.evaluate', {
      expression: `JSON.stringify({
        subKey: currentBoardSubKey,
        selectVal: document.getElementById('board-sub-select').value,
        bgDisplay: document.getElementById('sub-board-bg-img').style.display,
        natW: document.getElementById('sub-board-bg-img').naturalWidth,
        natH: document.getElementById('sub-board-bg-img').naturalHeight
      })`,
      returnByValue: true
    });
    console.log("Sub Board Type_B2_Class state:", JSON.parse(b2Check.result.value));
    await captureScreen('verify_sub_board_b2_loaded.png');

    // Select official sub Kaidai_KD4_Class
    await sendCdp('Runtime.evaluate', { expression: "changeBoardSubmarine('Kaidai_KD4_Class');" });
    await new Promise(r => setTimeout(r, 1000));

    const kd4Check = await sendCdp('Runtime.evaluate', {
      expression: `JSON.stringify({
        subKey: currentBoardSubKey,
        selectVal: document.getElementById('board-sub-select').value,
        bgDisplay: document.getElementById('sub-board-bg-img').style.display,
        natW: document.getElementById('sub-board-bg-img').naturalWidth,
        natH: document.getElementById('sub-board-bg-img').naturalHeight
      })`,
      returnByValue: true
    });
    console.log("Sub Board Kaidai_KD4_Class state:", JSON.parse(kd4Check.result.value));
    await captureScreen('verify_sub_board_kd4_loaded.png');

    ws.close();
  } catch(e) {
    console.error("Test error:", e);
  } finally {
    edgeProcess.kill();
  }
}

main();
