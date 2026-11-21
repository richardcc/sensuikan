const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testNoDiceInTables() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9330;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_no_dice_prof',
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

    // Check each chart in modal-viewer
    const charts = ['P3', 'P4', 'P5', 'P6', 'P3_P6'];
    const results = {};

    for (const c of charts) {
      const res = await send('Runtime.evaluate', {
        expression: `(() => {
          openModalViewer('Tabla ${c}', '', '${c}');
          const modal = document.getElementById('modal-viewer');
          const diceBtns = modal ? modal.querySelectorAll('button.btn-dice') : [];
          const allBtns = modal ? Array.from(modal.querySelectorAll('button')).map(b => b.innerText.trim()) : [];
          return {
            diceBtnCount: diceBtns.length,
            buttons: allBtns
          };
        })()`,
        returnByValue: true
      });
      results[c] = res.result.value;
    }

    console.log('Results for all charts:', JSON.stringify(results, null, 2));

    // Take screenshot of opened P3
    await send('Runtime.evaluate', { expression: `openModalViewer('Tabla P3', '', 'P3');` });
    await new Promise(r => setTimeout(r, 400));
    const snapP3 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\3fd05165-b487-4b4e-a070-ebf400d9cb87\\verify_p3_no_dice_button.jpg', Buffer.from(snapP3.data, 'base64'));

    // Take screenshot of opened P6
    await send('Runtime.evaluate', { expression: `openModalViewer('Tabla P6', '', 'P6');` });
    await new Promise(r => setTimeout(r, 400));
    const snapP6 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\3fd05165-b487-4b4e-a070-ebf400d9cb87\\verify_p6_no_dice_button.jpg', Buffer.from(snapP6.data, 'base64'));

    ws.close();
  } finally {
    proc.kill();
  }
}

testNoDiceInTables().catch(err => {
  console.error('Error in testNoDiceInTables:', err);
  process.exit(1);
});
