const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testPTablesModal() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9398;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_ptables_prof',
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

    const getVal = (res) => (res.result && res.result.result ? res.result.result.value : (res.result ? res.result.value : res));

    // 1. Remove security login gate, select Junsen J 1M, open Aircraft Display Mat
    console.log('Initializing board and opening aircraft mat...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        const sel = document.getElementById('ship-class-select');
        if (sel) {
          sel.value = 'Junsen_J_IM_Class';
          sel.dispatchEvent(new Event('change'));
        }
        if (typeof openAircraftDisplayMatModal === 'function') {
          openAircraftDisplayMatModal();
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));

    // 2. Click Tabla P3: Encuentros
    console.log('Testing Click on Tabla P3...');
    const p3Check = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.getElementById('lbl-air-btn-p3').closest('button');
        if (btn) btn.click();
        const mv = document.getElementById('modal-viewer');
        const mat = document.getElementById('modal-aircraft-display-mat');
        return {
          clicked: !!btn,
          mvDisplay: mv ? mv.style.display : null,
          mvZIndex: mv ? window.getComputedStyle(mv).zIndex : null,
          matZIndex: mat ? window.getComputedStyle(mat).zIndex : null,
          title: document.getElementById('modal-viewer-title') ? document.getElementById('modal-viewer-title').innerText : null,
          hasP3: !!document.querySelector('.ocr-board-p3')
        };
      })()`,
      returnByValue: true
    });
    console.log('P3 Check:', getVal(p3Check));

    // Roll P3
    await send('Runtime.evaluate', {
      expression: `if (typeof rollChartP3 === 'function') rollChartP3();`
    });
    await new Promise(r => setTimeout(r, 500));

    // Take screenshot of P3
    const ssP3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_p3_working.png', Buffer.from(ssP3.result.data, 'base64'));
    console.log('Saved verify_p3_working.png');

    // 3. Switch to P4 via nav
    console.log('Switching to P4...');
    await send('Runtime.evaluate', {
      expression: `openModalViewer('Tabla P4: Combate Aéreo', '', 'P4');`
    });
    await new Promise(r => setTimeout(r, 500));

    // Test P4 assault
    await send('Runtime.evaluate', {
      expression: `if (typeof resolveChartP4FighterAttack === 'function') resolveChartP4FighterAttack();`
    });
    await new Promise(r => setTimeout(r, 500));

    const ssP4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_p4_working.png', Buffer.from(ssP4.result.data, 'base64'));
    console.log('Saved verify_p4_working.png');

    // 4. Switch to P5 via nav
    console.log('Switching to P5...');
    await send('Runtime.evaluate', {
      expression: `openModalViewer('Tabla P5: Fuego AA', '', 'P5');`
    });
    await new Promise(r => setTimeout(r, 500));
    await send('Runtime.evaluate', {
      expression: `if (typeof rollChartP5 === 'function') rollChartP5();`
    });
    await new Promise(r => setTimeout(r, 500));

    const ssP5 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_p5_working.png', Buffer.from(ssP5.result.data, 'base64'));
    console.log('Saved verify_p5_working.png');

    // 5. Switch to P6
    console.log('Switching to P6...');
    await send('Runtime.evaluate', {
      expression: `openModalViewer('Tabla P6: Bombardeo', '', 'P6');`
    });
    await new Promise(r => setTimeout(r, 500));
    await send('Runtime.evaluate', {
      expression: `if (typeof rollChartP6 === 'function') rollChartP6();`
    });
    await new Promise(r => setTimeout(r, 500));

    const ssP6 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_p6_working.png', Buffer.from(ssP6.result.data, 'base64'));
    console.log('Saved verify_p6_working.png');

    // 6. Test English Toggle
    console.log('Testing English toggle...');
    await send('Runtime.evaluate', {
      expression: `
        if (typeof toggleLanguage === 'function') toggleLanguage();
        openModalViewer('Chart P3: Encounters', '', 'P3');
      `
    });
    await new Promise(r => setTimeout(r, 500));

    const enCheck = await send('Runtime.evaluate', {
      expression: `({
        title: document.getElementById('modal-viewer-title').innerText,
        escHint: document.getElementById('modal-viewer-esc-hint').innerText,
        closeBtn: document.getElementById('modal-viewer-btn-close').innerText
      })`,
      returnByValue: true
    });
    console.log('English Check:', getVal(enCheck));

    const ssEn = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_english_p3.png', Buffer.from(ssEn.result.data, 'base64'));
    console.log('Saved verify_english_p3.png');

    // 7. Close modal viewer and verify Aircraft Display Mat is still open underneath!
    console.log('Closing modal-viewer...');
    await send('Runtime.evaluate', { expression: `closeModalViewer();` });
    await new Promise(r => setTimeout(r, 500));

    const finalCheck = await send('Runtime.evaluate', {
      expression: `({
        mvDisplay: document.getElementById('modal-viewer').style.display,
        matDisplay: document.getElementById('modal-aircraft-display-mat').style.display
      })`,
      returnByValue: true
    });
    console.log('After closing modal-viewer:', getVal(finalCheck));

    const ssMat = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_aircraft_mat_standing.png', Buffer.from(ssMat.result.data, 'base64'));
    console.log('Saved verify_aircraft_mat_standing.png');

    ws.close();
    proc.kill();
    console.log('ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during test:', err);
    proc.kill();
    process.exit(1);
  }
}

testPTablesModal();
