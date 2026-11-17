const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function captureK1() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_Tablet_Offline.html');
  const port = 9398;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_k1_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1024',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const getJson = () => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json`, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const tabs = await getJson();
  const pageTab = tabs.find(t => t.url && t.url.includes('Sensuikan')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === reqId) {
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
      const gate = document.getElementById('security-login-gate');
      if (gate) gate.remove();
      switchTab('chart-k1');
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\k1_full_tab.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.result.data, 'base64'));
  console.log('Saved k1 screenshot to:', outPath);
  ws.close();
  proc.kill();
}
captureK1();
