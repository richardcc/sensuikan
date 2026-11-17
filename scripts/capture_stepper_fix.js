const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runScreenshot() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9370;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_screenshot_profile8',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1024',
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

    await send('Page.enable');
    await send('Runtime.enable');

    // Bypass login gate
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-gate-overlay');
        if (gate) gate.remove();
        switchTab('workflow');
        setWorkflowPhase(5);
      })()`
    });

    await new Promise(r => setTimeout(r, 800));

    // Capture the top part of .workflow-engine-card
    const clipRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const card = document.querySelector('.workflow-engine-card');
        const cr = card.getBoundingClientRect();
        return { x: cr.x, y: cr.y, width: cr.width, height: 160 };
      })()`,
      returnByValue: true
    });

    const cr = clipRes.result.result.value;
    console.log('Clip:', cr);

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
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\header_not_tachado.png';
    fs.writeFileSync(outPath, buffer);
    console.log('Saved screenshot to:', outPath);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}

runScreenshot();
