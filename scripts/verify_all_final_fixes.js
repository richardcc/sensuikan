const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function verifyAll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9322;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_all_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1680,1050',
    'file:///' + htmlPath.replace(/\\/g, '/')
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:' + port + '/json', res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.url.includes('index.html')) || targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    await new Promise(r => setTimeout(r, 800));

    // Remove security gate & select sub with aircraft
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        const sel = document.getElementById('ship-class-select');
        if (sel) {
          sel.value = 'Junsen_J_IM_Class';
          sel.dispatchEvent(new Event('change'));
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 400));

    // Open aircraft modal
    await send('Runtime.evaluate', { expression: `openAircraftDisplayMatModal();` });
    await new Promise(r => setTimeout(r, 400));

    // Capture screenshot of Map P8 (Sydney) at 896x1200
    await send('Runtime.evaluate', { expression: `selectAircraftMap('map_p8_sydney_harbor.jpg'); selectFlightCircle(2);` });
    await new Promise(r => setTimeout(r, 400));
    const snapP8 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\3fd05165-b487-4b4e-a070-ebf400d9cb87\\verify_p8_sydney_896x1200.jpg', Buffer.from(snapP8.data, 'base64'));

    // Capture screenshot of Map P12 (Aleutians) at 896x1200
    await send('Runtime.evaluate', { expression: `selectAircraftMap('map_p12_aleutians.jpg'); selectFlightCircle(3);` });
    await new Promise(r => setTimeout(r, 400));
    const snapP12 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\3fd05165-b487-4b4e-a070-ebf400d9cb87\\verify_p12_aleutians_896x1200.jpg', Buffer.from(snapP12.data, 'base64'));

    // Capture screenshot of Map P10 (Oregon)
    await send('Runtime.evaluate', { expression: `selectAircraftMap('map_p10_oregon.jpg'); selectFlightCircle(3);` });
    await new Promise(r => setTimeout(r, 400));
    const snapP10 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\3fd05165-b487-4b4e-a070-ebf400d9cb87\\verify_p10_oregon_independent.jpg', Buffer.from(snapP10.data, 'base64'));

    // Test Esc key
    const evalEsc = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('modal-aircraft-display-mat');
        const before = modal.style.display;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
        const after = modal.style.display;
        return { before, after };
      })()`,
      returnByValue: true
    });
    console.log('ESC test:', evalEsc.result.value);

    ws.close();
  } finally {
    proc.kill();
  }
}

verifyAll().catch(err => {
  console.error('Error in verifyAll:', err);
  process.exit(1);
});
