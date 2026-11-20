const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve('app/index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  const port = 9336;
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getJson(urlPath) {
    return new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: urlPath }, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const targets = await getJson('/json');
  const pageTarget = targets.find(t => t.type === 'page');
  const wsUrl = pageTarget.webSocketDebuggerUrl;

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

  await sendCdp('Runtime.enable');
  await sendCdp('Page.enable');

  // Switch to subboard tab and select Type_B2_Class
  const evalRes = await sendCdp('Runtime.evaluate', {
    expression: `
      (() => {
        switchTab('subboard');
        if (typeof changeBoardSubmarine === 'function') {
          changeBoardSubmarine('Type_B2_Class');
        }
        const bgImg = document.getElementById('sub-board-bg-img');
        return {
          currentBoardSubKey,
          src: bgImg?.src || '',
          naturalWidth: bgImg?.naturalWidth || 0,
          naturalHeight: bgImg?.naturalHeight || 0,
          display: bgImg?.style.display || '',
          isLoaded: (bgImg && bgImg.naturalWidth > 0)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('SubBoard Evaluation Result:', JSON.stringify(evalRes.result.value, null, 2));

  await new Promise(r => setTimeout(r, 600));

  const ss = await sendCdp('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\sub_board_fanmade_fixed.png';
  fs.writeFileSync(outPath, Buffer.from(ss.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
  edgeProcess.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
