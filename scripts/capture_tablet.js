const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_Tablet_Offline.html');
  const port = 9385;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_tablet_prof2',
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
  const pageTab = tabs[0];
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
      const modal = document.getElementById('modal-about');
      if (modal) modal.style.display = 'none';
      switchTab('workflow');
      setWorkflowPhase(5);
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const info = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelector('.workflow-engine-card');
      const st = document.querySelector('.phase-stepper');
      const cr = card.getBoundingClientRect();
      const sr = st.getBoundingClientRect();
      return {
        cardTop: cr.top,
        cardLeft: cr.left,
        cardWidth: cr.width,
        cardHeight: cr.height,
        stepperTop: sr.top,
        stepperLeft: sr.left,
        stepperWidth: sr.width,
        stepperHeight: sr.height
      };
    })()`,
    returnByValue: true
  });
  console.log('info:', JSON.stringify(info));
  const d = info.result && info.result.result ? info.result.result.value : (info.result ? info.result.value : null);
  console.log('DOM info:', d);

  // Capture from cardTop to stepperTop + stepperHeight + 10
  const screenshot = await send('Page.captureScreenshot', {
    format: 'png'
  });

  const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\header_not_tachado.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.result.data, 'base64'));
  console.log('Captured cleanly!');

  ws.close();
  proc.kill();
}
test();
