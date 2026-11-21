const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testOverlay() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9540;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_debug_overlay',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
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

    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        openAircraftDisplayMatModal();
        const ov = document.getElementById('air-map-interactive-overlay');
        const stage = document.getElementById('air-map-stage');
        const wrap = document.getElementById('air-map-wrapper');
        const img = document.getElementById('air-tactical-map-img');
        return {
          overlayHtmlLen: ov ? ov.innerHTML.length : 0,
          overlayChildren: ov ? ov.children.length : 0,
          overlayDisplay: ov ? window.getComputedStyle(ov).display : 'none',
          stageW: stage ? stage.offsetWidth : 0,
          stageH: stage ? stage.offsetHeight : 0,
          wrapW: wrap ? wrap.offsetWidth : 0,
          wrapH: wrap ? wrap.offsetHeight : 0,
          imgW: img ? img.offsetWidth : 0,
          imgH: img ? img.offsetHeight : 0,
          imgSrc: img ? img.src : '',
          activeTab: window.aircraftState ? window.aircraftState.activePhaseTab : 'none'
        };
      })()`,
      returnByValue: true
    });

    console.log('Overlay debug info:', evalRes.result.value);

    // Let's also capture screenshot of just the map stage
    const snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/debug_stage_snap.png', Buffer.from(snap.data, 'base64'));

    ws.close();
  } catch(e) {
    console.error(e);
  } finally {
    proc.kill();
  }
}

testOverlay();
