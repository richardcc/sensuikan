const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function verifyEngineerCard() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9390;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_eng_card',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1400,2000',
    `file://${htmlPath}`
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
    const pageTab = tabs.find(t => (t.url && t.url.includes('Sensuikan')) || (t.title && t.title.includes('Sensuikan'))) || tabs[0];
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

    // Remove gate and switch to school phase
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        setWorkflowPhase('school');
      })()`
    });

    await new Promise(r => setTimeout(r, 500));

    // Get bounding box of the engineer card
    const clipRes = await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo(0, 0);
        const el = document.getElementById('f1-eng-title').parentElement;
        const cr = el.getBoundingClientRect();
        return { x: cr.x - 5, y: cr.y - 5, width: cr.width + 10, height: cr.height + 10 };
      })()`,
      returnByValue: true
    });

    const cr = clipRes.result.result.value;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: cr.x,
        y: cr.y,
        width: cr.width,
        height: cr.height,
        scale: 1
      }
    });

    const buffer = Buffer.from(screenshot.result.data, 'base64');
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\engineer_f1_fixed.png';
    fs.writeFileSync(outPath, buffer);
    console.log('Saved screenshot to:', outPath);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Test error:', err);
    proc.kill();
    process.exit(1);
  }
}

verifyEngineerCard();
