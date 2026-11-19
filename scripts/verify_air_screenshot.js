const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9394;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_air_verify',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1400,1200',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));
  try {
    const tabs = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const pageTab = tabs.find(t => (t.url && t.url.includes('Sensuikan')) || (t.title && t.title.includes('Sensuikan'))) || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 8000);
      const reqId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === reqId) {
          clearTimeout(timer);
          ws.removeEventListener('message', handler);
          resolve(msg);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof bypassGate === 'function') bypassGate();
        if (typeof setWorkflowPhase === 'function') setWorkflowPhase('patrol');
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // Full page screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\air_encounter_5steps.png';
    fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
    console.log('Saved to:', shotPath);

    // Also scroll down to capture Paso 2 and Paso 3
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 550);`
    });
    await new Promise(r => setTimeout(r, 400));
    const shotMid = await send('Page.captureScreenshot', { format: 'png' });
    const shotPathMid = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\air_encounter_paso2_3.png';
    fs.writeFileSync(shotPathMid, Buffer.from(shotMid.result.data, 'base64'));
    console.log('Saved paso 2 and 3 to:', shotPathMid);

    // Also scroll down to capture Paso 5
    await send('Runtime.evaluate', {
      expression: `window.scrollBy(0, 1200);`
    });
    await new Promise(r => setTimeout(r, 400));
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath3 = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\air_encounter_paso5.png';
    fs.writeFileSync(shotPath3, Buffer.from(shot3.result.data, 'base64'));
    console.log('Saved paso 5 to:', shotPath3);

    ws.close();
  } finally {
    proc.kill();
  }
}
run().catch(console.error);
