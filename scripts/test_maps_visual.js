const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testMaps() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9488;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_maps_prof',
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

    console.log('Targets:', targets.map(t => ({ url: t.url, title: t.title, type: t.type })));
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

    // Wait for DOM
    await new Promise(r => setTimeout(r, 1000));

    // Remove security gate & select sub
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

    // Open Aircraft Display Mat modal
    await send('Runtime.evaluate', {
      expression: `
        openAircraftDisplayMatModal();
      `
    });

    await new Promise(r => setTimeout(r, 800));

    // Select Panama Canal map
    await send('Runtime.evaluate', {
      expression: `
        selectAircraftMap('map_p11_panama_canal.jpg');
      `
    });

    await new Promise(r => setTimeout(r, 800));

    // Take screenshot of Panama Canal map
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    const outPanama = path.resolve('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'verified_map_p11_panama_canal.png');
    fs.writeFileSync(outPanama, Buffer.from(snap1.data, 'base64'));
    console.log('Saved Panama screenshot:', outPanama);

    // Select Pearl Harbor map
    await send('Runtime.evaluate', {
      expression: `
        selectAircraftMap('map_p7_pearl_harbor.jpg');
      `
    });

    await new Promise(r => setTimeout(r, 800));

    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    const outPearl = path.resolve('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'verified_map_p7_pearl_harbor.png');
    fs.writeFileSync(outPearl, Buffer.from(snap2.data, 'base64'));
    console.log('Saved Pearl Harbor screenshot:', outPearl);

    // Check for any JS console errors
    const errEval = await send('Runtime.evaluate', {
      expression: `
        ({
          isModalVisible: !!document.getElementById('modal-aircraft-display-mat') && document.getElementById('modal-aircraft-display-mat').style.display !== 'none',
          activeMap: aircraftState ? aircraftState.activeMap : null,
          slot: aircraftState ? aircraftState.activeSlot : null
        })
      `,
      returnByValue: true
    });
    console.log('Modal state check:', errEval.result.value);

    ws.close();
  } finally {
    proc.kill();
  }
}

testMaps().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
