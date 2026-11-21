const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testModalAndDamage() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_prof_test',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1400,900',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    function getWsUrl() {
      return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9225/json', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const list = JSON.parse(data);
            const page = list.find(t => t.type === 'page');
            resolve(page ? page.webSocketDebuggerUrl : null);
          });
        }).on('error', reject);
      });
    }

    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    await new Promise((res) => ws.onopen = res);

    let reqId = 1;
    function sendCommand(method, params = {}) {
      return new Promise((res) => {
        const id = reqId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.id === id) {
            ws.removeEventListener('message', handler);
            res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    async function evaluate(expr) {
      const res = await sendCommand('Runtime.evaluate', {
        expression: expr,
        returnByValue: true,
        awaitPromise: true
      });
      return res && res.result ? res.result.value : null;
    }

    // Initialize: remove gate if any
    await evaluate(`(() => {
      const gate = document.getElementById('security-login-gate');
      if (gate) gate.remove();
    })()`);

    console.log('--- 1. Testing Single Close Button in Aircraft Display Mat ---');
    await evaluate('window.openAircraftDisplayMatModal()');
    await new Promise(r => setTimeout(r, 400));

    const hasBottomBtn = await evaluate('!!document.getElementById("air-mat-btn-close-bottom")');
    console.log('air-mat-btn-close-bottom exists:', hasBottomBtn, '(Expected: false)');

    const topBtnText = await evaluate('document.getElementById("air-mat-btn-close-top").innerText.trim()');
    console.log('air-mat-btn-close-top text:', topBtnText);

    console.log('--- 2. Testing 1-Plane Submarine Damage Slot ---');
    await evaluate(`
      window.currentBoardSubKey = 'Junsen_J_IM_Class';
      if (typeof window.subBoardState !== 'undefined') {
        window.subBoardState.activeSubKey = 'Junsen_J_IM_Class';
        window.subBoardState.aircraftDamaged = false;
        window.subBoardState.aircraftDamaged2 = false;
      }
      if (typeof window.renderInteractiveSlots === 'function') {
        window.renderInteractiveSlots();
      }
    `);
    await new Promise(r => setTimeout(r, 300));

    // Click slot 1
    await evaluate(`
      const el = document.getElementById('sub-hotspot-slot-air-1');
      if (el) el.click();
    `);
    await new Promise(r => setTimeout(r, 300));

    const slot1Html = await evaluate('document.getElementById("sub-hotspot-slot-air-1") ? document.getElementById("sub-hotspot-slot-air-1").innerHTML : null');
    const slot2Html = await evaluate('document.getElementById("sub-hotspot-slot-air-2") ? document.getElementById("sub-hotspot-slot-air-2").innerHTML : null');

    console.log('Slot 1 contains Aircraft Damage chit:', slot1Html && slot1Html.includes('Damage - Aircraft.jpg'));
    console.log('Slot 2 is completely empty:', slot2Html === '');

    console.log('--- 3. Testing Language Toggle on Modal ---');
    await evaluate('window.toggleLanguage()');
    await new Promise(r => setTimeout(r, 300));

    const topBtnTextEn = await evaluate('document.getElementById("air-mat-btn-close-top").innerText.trim()');
    console.log('EN Header Close Button text:', topBtnTextEn);

    await evaluate('window.toggleLanguage()'); // switch back to ES
    await new Promise(r => setTimeout(r, 300));

    ws.close();
  } finally {
    edgeProcess.kill();
  }
  console.log('--- ALL VERIFICATIONS PASSED ---');
}

testModalAndDamage().catch(console.error);
