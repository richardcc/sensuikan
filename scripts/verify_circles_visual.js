const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function verifyVisual() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9520;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_circles',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--disable-features=msFirstRunExperience,msEdgeSync',
    '--disable-gpu',
    '--window-size=1600,1050',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, res => {
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

    await new Promise(r => setTimeout(r, 1000));

    // Remove security gate, select sub, open modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        const sel = document.getElementById('ship-class-select');
        if (sel) {
          sel.value = 'Junsen_J_IM_Class';
          sel.dispatchEvent(new Event('change'));
        }
        if (typeof openAircraftDisplayMatModal === 'function') {
          openAircraftDisplayMatModal();
        }
        if (typeof switchAirPhaseTab === 'function') {
          switchAirPhaseTab('map');
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 1200));

    // Map P7 screenshot
    const resP7 = await send('Page.captureScreenshot', { format: 'png' });
    const p7Path = path.resolve(__dirname, '..', 'app', 'assets', 'screenshots', 'verified_circles_pearl_harbor.png');
    fs.mkdirSync(path.dirname(p7Path), { recursive: true });
    fs.writeFileSync(p7Path, Buffer.from(resP7.data, 'base64'));
    console.log('Saved P7 screenshot to:', p7Path);

    // Also copy to artifact directory
    const brainDir = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17';
    fs.writeFileSync(path.join(brainDir, 'verified_circles_pearl_harbor.png'), Buffer.from(resP7.data, 'base64'));

    // Switch to Map P11 (Panama Canal)
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof selectAircraftMap === 'function') {
          selectAircraftMap('map_p11_panama_canal.jpg');
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));

    const resP11 = await send('Page.captureScreenshot', { format: 'png' });
    const p11Path = path.resolve(__dirname, '..', 'app', 'assets', 'screenshots', 'verified_circles_panama_canal.png');
    fs.writeFileSync(p11Path, Buffer.from(resP11.data, 'base64'));
    fs.writeFileSync(path.join(brainDir, 'verified_circles_panama_canal.png'), Buffer.from(resP11.data, 'base64'));
    console.log('Saved P11 screenshot to:', p11Path);

    ws.close();
  } catch(err) {
    console.error('Error during test:', err);
  } finally {
    proc.kill();
  }
}

verifyVisual();
