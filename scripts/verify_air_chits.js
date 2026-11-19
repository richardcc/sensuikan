const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runTest() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9412;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_air_chits',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1450,1200',
    `file:///${htmlPath.replace(/\\/g, '/')}`
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
    const pageTab = tabs.find(t => t.url && t.url.includes('Sensuikan'));
    if (!pageTab) throw new Error('Sensuikan tab not found');

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

    const evalJs = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return res.result && res.result.result ? res.result.result.value : null;
    };

    console.log('Switching to Patrol tab...');
    await evalJs("window.setWorkflowPhase('patrol');");
    await new Promise(r => setTimeout(r, 600));

    // Scroll to Air Encounter sequence
    await evalJs("document.getElementById('ppatrol-fido-panel')?.scrollIntoView({behavior:'instant', block:'start'});");
    await new Promise(r => setTimeout(r, 400));

    const chitsInfo = await evalJs(`
      ({
        fidoChit: document.querySelector('#ppatrol-fido-chit-box img')?.src ? true : false,
        aaTrackChit: document.getElementById('ppatrol-aircraft-damage-chit')?.src ? true : false,
        bombsChit: document.querySelector('img[src*="Bombs.jpg"]')?.src ? true : false
      })
    `);
    console.log('Air chits verified:', chitsInfo);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\air_encounter_chits_verified.png';
    fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
    console.log('Air screenshot written to:', shotPath);

    ws.close();
  } finally {
    proc.kill();
  }
}

runTest().catch(console.error);
