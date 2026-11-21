const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testEscapeModalStacking() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9392;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_esc_stacking_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1680,1020',
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
    const appTab = tabs.find(t => t.url && t.url.includes('index.html')) || tabs[0];
    console.log('Connected to Edge tab:', appTab.title);

    const ws = new WebSocket(appTab.webSocketDebuggerUrl);
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

    // Remove security gate & select sub with plane
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
    await new Promise(r => setTimeout(r, 500));

    // STEP 1: Open Aircraft Display Mat Modal
    console.log('\n--- STEP 1: Open Aircraft Display Mat Modal ---');
    await send('Runtime.evaluate', {
      expression: `openAircraftDisplayMatModal(); switchAirPhaseTab('map');`
    });
    await new Promise(r => setTimeout(r, 500));

    const checkMat1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const mat = document.getElementById('modal-aircraft-display-mat');
        return JSON.stringify({ matVisible: mat && window.getComputedStyle(mat).display !== 'none' });
      })()`
    });
    console.log('Aircraft Mat visible:', JSON.parse(checkMat1.result.result.value).matVisible);

    // STEP 2: Open Table P3 from within the Aircraft Display Mat
    console.log('\n--- STEP 2: Open Table P3 from inside the Aircraft Mat ---');
    await send('Runtime.evaluate', {
      expression: `openModalViewer('Tabla P3: Encuentros del Hidroavión', '', 'P3');`
    });
    await new Promise(r => setTimeout(r, 500));

    const checkBoth = await send('Runtime.evaluate', {
      expression: `(() => {
        const mat = document.getElementById('modal-aircraft-display-mat');
        const mv = document.getElementById('modal-viewer');
        return JSON.stringify({
          matVisible: mat && window.getComputedStyle(mat).display !== 'none',
          viewerVisible: mv && window.getComputedStyle(mv).display !== 'none'
        });
      })()`
    });
    const stateBoth = JSON.parse(checkBoth.result.result.value);
    console.log('Both visible (Mat & Table P3):', stateBoth);

    // STEP 3: Press Escape 1st time (Simulating dispatching Escape key event on active element / document)
    console.log('\n--- STEP 3: Press Escape (1st time) to close Table P3 ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const evt = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true });
        document.dispatchEvent(evt);
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkAfterEsc1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const mat = document.getElementById('modal-aircraft-display-mat');
        const mv = document.getElementById('modal-viewer');
        return JSON.stringify({
          matVisible: mat && window.getComputedStyle(mat).display !== 'none',
          viewerVisible: mv && window.getComputedStyle(mv).display !== 'none'
        });
      })()`
    });
    const stateAfterEsc1 = JSON.parse(checkAfterEsc1.result.result.value);
    console.log('State after 1st Escape:', stateAfterEsc1);

    if (stateAfterEsc1.viewerVisible === false && stateAfterEsc1.matVisible === true) {
      console.log('>>> SUCCESS: Table P3 closed, but Aircraft Mat REMAINS OPEN as expected! <<<');
    } else {
      console.error('>>> FAILURE: Aircraft Mat also closed unexpectedly! <<<');
    }

    // Capture screenshot proving mat is still open
    const scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/verified_esc_stacking_fixed.png', Buffer.from(scr.result.data, 'base64'));
    console.log('Saved proof screenshot: verified_esc_stacking_fixed.png');

    // STEP 4: Press Escape 2nd time (Now the Aircraft Mat itself should close)
    console.log('\n--- STEP 4: Press Escape (2nd time) to close Aircraft Mat ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const evt = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true, cancelable: true });
        document.dispatchEvent(evt);
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkAfterEsc2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const mat = document.getElementById('modal-aircraft-display-mat');
        return JSON.stringify({
          matVisible: mat && window.getComputedStyle(mat).display !== 'none'
        });
      })()`
    });
    const stateAfterEsc2 = JSON.parse(checkAfterEsc2.result.result.value);
    console.log('State after 2nd Escape (Mat should be closed):', stateAfterEsc2);

    if (stateAfterEsc2.matVisible === false) {
      console.log('>>> SUCCESS: Aircraft Mat cleanly closed on 2nd Escape! <<<');
    }

    ws.close();
    proc.kill();
    console.log('\n=== ESC MODAL STACKING VERIFICATION COMPLETE ===');
  } catch (err) {
    console.error('Verification failed:', err);
    proc.kill();
  }
}

testEscapeModalStacking();
