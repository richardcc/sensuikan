const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testGuideModal() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9530;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_guide',
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

    // Open modal and show button
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        if (typeof openAircraftDisplayMatModal === 'function') {
          openAircraftDisplayMatModal();
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 1000));

    // Screenshot 1: Aircraft Display Mat with the new Guide button in header and ops console
    const brainDir = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17';
    const res1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_guide_button_in_mat.png'), Buffer.from(res1.data, 'base64'));
    console.log('Saved verified_guide_button_in_mat.png');

    // Click Guide button (open Guide Modal)
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof openAirModuleGuideModal === 'function') {
          openAirModuleGuideModal('overview');
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 800));

    // Screenshot 2: Guide Modal - Tab 1 Overview
    const res2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_guide_modal_overview.png'), Buffer.from(res2.data, 'base64'));
    console.log('Saved verified_guide_modal_overview.png');

    // Switch to Tab 2: Takeoff
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof switchAirGuideTab === 'function') {
          switchAirGuideTab('takeoff');
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Screenshot 3: Guide Modal - Tab 2 Takeoff
    const res3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_guide_modal_takeoff.png'), Buffer.from(res3.data, 'base64'));
    console.log('Saved verified_guide_modal_takeoff.png');

    // Switch to Tab 3: Flight
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof switchAirGuideTab === 'function') {
          switchAirGuideTab('flight');
        }
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    // Screenshot 4: Guide Modal - Tab 3 Flight
    const res4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_guide_modal_flight.png'), Buffer.from(res4.data, 'base64'));
    console.log('Saved verified_guide_modal_flight.png');

    // Test Escape key press on Guide Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const ev = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true });
        document.dispatchEvent(ev);
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const checkEsc = await send('Runtime.evaluate', {
      expression: `(() => {
        const gm = document.getElementById('modal-aircraft-guide');
        const mat = document.getElementById('modal-aircraft-display-mat');
        return {
          guideHidden: !gm || gm.style.display === 'none',
          matVisible: mat && mat.style.display !== 'none'
        };
      })()`,
      returnByValue: true
    });

    console.log('Escape Stacking Check:', checkEsc.result.value);

    ws.close();
  } catch(err) {
    console.error('Test error:', err);
  } finally {
    proc.kill();
  }
}

testGuideModal();
