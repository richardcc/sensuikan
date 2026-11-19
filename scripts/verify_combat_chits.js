const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runTest() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9411;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_combat_chits',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1450,1100',
    `file:///${htmlPath.replace(/\\/g, '/')}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const getJson = () => new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const tabs = await getJson();
    const pageTab = tabs.find(t => t.url && t.url.includes('Sensuikan'));
    if (!pageTab) throw new Error('Sensuikan tab not found');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 8000);
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === reqId) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          resolve(msg);
        }
      };
      const reqId = id++;
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const evalJs = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return res.result && res.result.result ? res.result.result.value : null;
    };

    console.log('Switching to Phase 3...');
    await evalJs("window.setWorkflowPhase(3);");
    await new Promise(r => setTimeout(r, 600));

    // Roll Day/Night to Night (4)
    console.log('Rolling Night (4)...');
    await evalJs("window.rollTimeOfDayD6(4);");

    // Select Close Range
    console.log('Selecting Close Range...');
    await evalJs(`
      const rSel = document.getElementById('wf-range-select');
      if (rSel) {
        rSel.value = 'close';
        rSel.dispatchEvent(new Event('change'));
      }
    `);

    // Generate BB USS Arizona
    console.log('Generating BB USS Arizona target...');
    await evalJs(`
      const target = {
        chart: "T4",
        roll100: 6,
        name: "BB USS Arizona",
        tons: 29200,
        type: "Battleship",
        pts_to_sink: 5,
        isSub: false,
        isTanker: false,
        escort: true
      };
      window.applyTargetToWorkflow(target);
    `);
    await new Promise(r => setTimeout(r, 600));

    const res = await evalJs(`
      ({
        todSrc: document.getElementById('wf-tod-chit-img')?.src,
        rangeSrc: document.getElementById('wf-range-chit-img')?.src,
        modeSrc: document.getElementById('wf-mode-chit-img')?.src,
        targetSrc: document.getElementById('wf-target-chit-img')?.src,
        targetDisplay: document.getElementById('wf-target-chit-img')?.style.display,
        targetName: document.getElementById('wf-target-name')?.innerText,
        escortDisplay: document.getElementById('wf-escort-chit-box')?.style.opacity
      })
    `);
    console.log('Phase 3 Combat Chits state:', res);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\phase3_combat_chits_verified.png';
    fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
    console.log('Screenshot written to:', shotPath);

    await evalJs("window.scrollBy(0, 450);");
    await new Promise(r => setTimeout(r, 400));

    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath2 = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\phase3_combat_chits_range_mode_verified.png';
    fs.writeFileSync(shotPath2, Buffer.from(shot2.result.data, 'base64'));
    console.log('Second screenshot written to:', shotPath2);

    ws.close();
  } finally {
    proc.kill();
  }
}

runTest().catch(console.error);
