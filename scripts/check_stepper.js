const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function checkStepper() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9346;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_stepper_profile',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,800',
    'file://' + htmlPath
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const getJson = () => new Promise((resolve, reject) => {
      http.get('http://localhost:' + port + '/json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const tabs = await getJson();
    const pageTab = tabs.find(t => (t.url && t.url.includes('Sensuikan')) || (t.title && t.title.includes('Sensuikan'))) || tabs[tabs.length - 1];
    const wsUrl = pageTab.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
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

    await send('Runtime.enable');
    await send('Page.enable');

    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (function() {
          localStorage.setItem('sensuikan_auth_state', 'granted');
          const gate = document.getElementById('security-login-gate');
          if (gate) gate.style.display = 'none';

          if (typeof setWorkflowPhase === 'function') setWorkflowPhase(2);

          const items = Array.from(document.querySelectorAll('.phase-stepper .step-item')).map(el => el.innerText.trim().replace(/\\s+/g, ' '));
          return items;
        })()
      `,
      returnByValue: true
    });
    console.log('Stepper items:', evalRes.result?.value);

    await new Promise(r => setTimeout(r, 500));
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1280, height: 260, scale: 1 }
    });
    const shotPath = path.join('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'stepper_fixed.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
    console.log('Saved screenshot to:', shotPath);

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    proc.kill();
    process.exit(0);
  }
}
checkStepper();
