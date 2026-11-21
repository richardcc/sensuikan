const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testEscCooldown() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9340;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_esc_cooldown_prof',
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
    await new Promise(r => setTimeout(r, 600));

    // Remove gate and select sub
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

    // Open aircraft modal
    await send('Runtime.evaluate', { expression: `openAircraftDisplayMatModal();` });
    await new Promise(r => setTimeout(r, 300));

    // Open P3 in modal-viewer
    await send('Runtime.evaluate', { expression: `openModalViewer('Tabla P3', '', 'P3');` });
    await new Promise(r => setTimeout(r, 300));

    // Simulate 3 rapid ESC events in 100ms
    const rapidEscResult = await send('Runtime.evaluate', {
      expression: `(async () => {
        const dispatchEsc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
        
        // 1st press
        dispatchEsc();
        // 2nd press 50ms later (key repeat)
        await new Promise(r => setTimeout(r, 50));
        dispatchEsc();
        // 3rd press 50ms later
        await new Promise(r => setTimeout(r, 50));
        dispatchEsc();

        const mv = document.getElementById('modal-viewer');
        const mat = document.getElementById('modal-aircraft-display-mat');
        return {
          mvDisplay: mv ? mv.style.display : null,
          matDisplay: mat ? mat.style.display : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('After rapid ESC (during table open):', rapidEscResult.result.value);

    // Now wait 500ms and press ESC again (to close aircraft mat)
    const secondEscResult = await send('Runtime.evaluate', {
      expression: `(async () => {
        await new Promise(r => setTimeout(r, 500));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
        const mv = document.getElementById('modal-viewer');
        const mat = document.getElementById('modal-aircraft-display-mat');
        return {
          mvDisplay: mv ? mv.style.display : null,
          matDisplay: mat ? mat.style.display : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('After second deliberate ESC (500ms later):', secondEscResult.result.value);

    ws.close();
  } finally {
    proc.kill();
  }
}

testEscCooldown().catch(err => {
  console.error('Error in testEscCooldown:', err);
  process.exit(1);
});
