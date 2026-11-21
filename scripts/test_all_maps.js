const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testAllMaps() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9522;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_all_maps_prof',
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

    await send('Runtime.evaluate', { expression: `openAircraftDisplayMatModal();` });
    await new Promise(r => setTimeout(r, 600));

    const mapList = [
      'map_p8_sydney_harbor.jpg',
      'map_p9_diego_suarez.jpg',
      'map_p10_oregon.jpg',
      'map_p12_aleutians.jpg'
    ];

    for (const m of mapList) {
      await send('Runtime.evaluate', { expression: `selectAircraftMap('${m}');` });
      await new Promise(r => setTimeout(r, 600));
      const snap = await send('Page.captureScreenshot', { format: 'png' });
      const outPath = path.resolve('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', `verified_${m.replace('.jpg', '')}.png`);
      fs.writeFileSync(outPath, Buffer.from(snap.data, 'base64'));
      console.log('Saved:', outPath);
    }

    ws.close();
  } finally {
    proc.kill();
  }
}

testAllMaps().catch(err => {
  console.error('Error in testAllMaps:', err);
  process.exit(1);
});
