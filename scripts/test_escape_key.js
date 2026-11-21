const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testEscapeKey() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9399;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_esc_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1400,1050',
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
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
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

    const getVal = (res) => (res.result && res.result.result ? res.result.result.value : (res.result ? res.result.value : res));

    // Initialize: remove gate and select submarine
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

    // TEST 1: Open Aircraft Display Mat, press Escape
    console.log('--- TEST 1: Escape on Aircraft Display Mat ---');
    await send('Runtime.evaluate', {
      expression: `openAircraftDisplayMatModal();`
    });
    await new Promise(r => setTimeout(r, 400));

    let state1 = await send('Runtime.evaluate', {
      expression: `document.getElementById('modal-aircraft-display-mat').style.display`,
      returnByValue: true
    });
    console.log('Mat display before Escape:', getVal(state1));

    // Dispatch real KeyboardEvent Escape
    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));`
    });
    await new Promise(r => setTimeout(r, 400));

    let state1After = await send('Runtime.evaluate', {
      expression: `document.getElementById('modal-aircraft-display-mat').style.display`,
      returnByValue: true
    });
    console.log('Mat display AFTER Escape:', getVal(state1After));

    // TEST 2: Open Aircraft Mat, then click Tabla P3 (opening modal-viewer), press Escape
    console.log('--- TEST 2: Escape when both Mat and Viewer are open ---');
    await send('Runtime.evaluate', {
      expression: `
        openAircraftDisplayMatModal();
        openModalViewer('Tabla P3: Encuentros', '', 'P3');
      `
    });
    await new Promise(r => setTimeout(r, 400));

    let state2 = await send('Runtime.evaluate', {
      expression: `({
        mv: document.getElementById('modal-viewer').style.display,
        mat: document.getElementById('modal-aircraft-display-mat').style.display
      })`,
      returnByValue: true
    });
    console.log('Before Escape 1:', getVal(state2));

    // First Escape: should close modal-viewer
    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));`
    });
    await new Promise(r => setTimeout(r, 400));

    let state2After1 = await send('Runtime.evaluate', {
      expression: `({
        mv: document.getElementById('modal-viewer').style.display,
        mat: document.getElementById('modal-aircraft-display-mat').style.display
      })`,
      returnByValue: true
    });
    console.log('After Escape 1 (should close mv, keep mat):', getVal(state2After1));

    // Second Escape: should close modal-aircraft-display-mat!
    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));`
    });
    await new Promise(r => setTimeout(r, 400));

    let state2After2 = await send('Runtime.evaluate', {
      expression: `({
        mv: document.getElementById('modal-viewer').style.display,
        mat: document.getElementById('modal-aircraft-display-mat').style.display
      })`,
      returnByValue: true
    });
    console.log('After Escape 2 (should close mat too):', getVal(state2After2));

    // TEST 3: What if an element inside modal-viewer has focus (like select or button)?
    console.log('--- TEST 3: Escape when a focused element inside modal-viewer ---');
    await send('Runtime.evaluate', {
      expression: `
        openAircraftDisplayMatModal();
        openModalViewer('Tabla P3: Encuentros', '', 'P3');
        const sel = document.getElementById('p3-mission-phase');
        if (sel) sel.focus();
      `
    });
    await new Promise(r => setTimeout(r, 400));

    let focusedTag = await send('Runtime.evaluate', {
      expression: `document.activeElement.tagName`,
      returnByValue: true
    });
    console.log('Focused element tag:', getVal(focusedTag));

    await send('Runtime.evaluate', {
      expression: `document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));`
    });
    await new Promise(r => setTimeout(r, 400));

    let state3After = await send('Runtime.evaluate', {
      expression: `({
        mv: document.getElementById('modal-viewer').style.display,
        mat: document.getElementById('modal-aircraft-display-mat').style.display
      })`,
      returnByValue: true
    });
    console.log('After Escape when select focused:', getVal(state3After));

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
  }
}

testEscapeKey();
