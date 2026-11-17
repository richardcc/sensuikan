const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testDock() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_Tablet_Offline.html');
  const port = 9390;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_dock_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1024',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const getJson = () => new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const tabs = await getJson();
    const pageTab = tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const reqId = id++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === reqId) {
          ws.removeEventListener('message', handler);
          resolve(msg);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        const modal = document.getElementById('modal-about');
        if (modal) modal.style.display = 'none';

        // Switch to dock
        switchTab('dock');
        selectSubmarine('Junsen_J2_Class');

        const profImg = document.getElementById('sub-profile-img');
        const profSrc = profImg ? profImg.src : '';
        const profVisible = profImg && profImg.style.display !== 'none' && !profSrc.startsWith('assets/');

        // Check damage tracks
        const floodImgs = Array.from(document.querySelectorAll('#sub-mat-damage-track-row img[alt^="Flood"]'));
        const hullImgs = Array.from(document.querySelectorAll('#sub-mat-damage-track-row img[alt^="Hull"]'));

        const allFloodData = floodImgs.length > 0 && floodImgs.every(img => img.src.startsWith('data:') && img.style.display !== 'none');
        const allHullData = hullImgs.length > 0 && hullImgs.every(img => img.src.startsWith('data:') && img.style.display !== 'none');

        // Check markers
        const floodMarker = document.querySelector('#sub-mat-damage-track-row img[alt="Flooding Marker"]');
        const hullMarker = document.querySelector('#sub-mat-damage-track-row img[alt="Hull Damage Marker"]');
        const markersData = floodMarker && hullMarker && floodMarker.src.startsWith('data:') && hullMarker.src.startsWith('data:');

        return {
          profSrcPrefix: profSrc.substring(0, 30),
          profVisible,
          floodCount: floodImgs.length,
          allFloodData,
          hullCount: hullImgs.length,
          allHullData,
          markersData
        };
      })()`,
      returnByValue: true
    });

    console.log('Full result:', JSON.stringify(result));
    const val = result.result && result.result.result ? result.result.result.value : (result.result ? result.result.value : result);
    console.log('Dock Verification Result:', val);

    // Capture screenshot of damage tracks area
    const clipInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('sub-mat-tracks-wrapper');
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    const clip = clipInfo.result && clipInfo.result.result ? clipInfo.result.result.value : clipInfo.result.value;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height,
        scale: 1
      }
    });

    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\dock_tracks_verified.png';
    fs.writeFileSync(outPath, Buffer.from(screenshot.result.data, 'base64'));
    console.log('Saved damage tracks screenshot to:', outPath);

    // Capture screenshot of submarine profile illustration
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('sub-profile-container');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const profClipInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('sub-profile-container');
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      })()`,
      returnByValue: true
    });

    const profClip = profClipInfo.result && profClipInfo.result.result ? profClipInfo.result.result.value : profClipInfo.result.value;
    const profScreenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: profClip.x,
        y: profClip.y,
        width: profClip.width,
        height: profClip.height,
        scale: 1
      }
    });

    const outProfPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\dock_profile_verified.png';
    fs.writeFileSync(outProfPath, Buffer.from(profScreenshot.result.data, 'base64'));
    console.log('Saved profile screenshot to:', outProfPath);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}

testDock();
