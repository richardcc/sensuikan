const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testEscBug() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9335;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_esc_bug_prof',
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
    await new Promise(r => setTimeout(r, 400));

    // Open P3 in modal-viewer
    await send('Runtime.evaluate', { expression: `openModalViewer('Tabla P3', '', 'P3');` });
    await new Promise(r => setTimeout(r, 400));

    // Check states before ESC
    const before = await send('Runtime.evaluate', {
      expression: `(() => {
        const mv = document.getElementById('modal-viewer');
        const mat = document.getElementById('modal-aircraft-display-mat');
        return {
          mv: mv ? mv.style.display : null,
          mat: mat ? mat.style.display : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Before ESC:', before.result.value);

    // Dispatch KeyboardEvent ESC
    const after = await send('Runtime.evaluate', {
      expression: `(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
        const mv = document.getElementById('modal-viewer');
        const mat = document.getElementById('modal-aircraft-display-mat');
        return {
          mv: mv ? mv.style.display : null,
          mat: mat ? mat.style.display : null
        };
      })()`,
      returnByValue: true
    });
    console.log('After 1st ESC:', after.result.value);

    ws.close();
  } finally {
    proc.kill();
  }
}

testEscBug().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
