const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function verifyTabLabel() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9392;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_tab_label',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,800',
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

    // Remove security gate
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
      })()`
    });

    await new Promise(r => setTimeout(r, 400));

    // Get bounding box of the tabs bar
    const clipRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('tab-nav-workflow');
        const cr = el.parentElement.getBoundingClientRect();
        return {
          text: el.innerText,
          x: cr.x - 10,
          y: cr.y - 6,
          width: cr.width + 120,
          height: cr.height + 12
        };
      })()`,
      returnByValue: true
    });

    const val = clipRes.result.result.value;
    console.log('Tab Label Text:', val.text);

    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: val.x,
        y: val.y,
        width: val.width,
        height: val.height,
        scale: 1
      }
    });

    const buffer = Buffer.from(screenshot.result.data, 'base64');
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\gameflow_tab_clean.png';
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

verifyTabLabel();
