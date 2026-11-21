const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testP1HighlightFix() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9325;
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_p1_highlight_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1680,1050',
    'file:///' + htmlPath.replace(/\\/g, '/')
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get('http://localhost:' + port + '/json', res => {
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

    await new Promise(r => setTimeout(r, 800));

    // Remove security gate & select sub with aircraft
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

    await new Promise(r => setTimeout(r, 400));

    // Open aircraft modal & switch to takeoff tab
    await send('Runtime.evaluate', { expression: `openAircraftDisplayMatModal(); switchAirPhaseTab('takeoff');` });
    await new Promise(r => setTimeout(r, 400));

    // First simulate roll 12 (radio inop)
    await send('Runtime.evaluate', {
      expression: `selectP1LaunchOutcome(12, { roll: 12, d1: 6, d2: 6 });`
    });
    await new Promise(r => setTimeout(r, 200));

    // Now roll 9 (3+6), exactly like the user's screenshot
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        selectP1LaunchOutcome(7, { roll: 9, d1: 3, d2: 6 });
        renderAircraftMatUI();
        const rNorm = document.getElementById('air-p1-row-norm');
        const r12 = document.getElementById('air-p1-row-12');
        const s = window.campaignState.aircraftState.slots[window.campaignState.aircraftState.activeSlot || 0];
        return {
          rNormHasHighlight: rNorm ? rNorm.classList.contains('air-row-highlight') : false,
          r12HasHighlight: r12 ? r12.classList.contains('air-row-highlight') : false,
          radioInop: s.radioInop,
          launchStatus: s.launchStatus,
          diceVal: s.p1DiceVal
        };
      })()`,
      returnByValue: true
    });
    console.log('evalRes:', JSON.stringify(evalRes, null, 2));

    // Capture screenshot of the modal with row 4-11 highlighted
    const snap = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\3fd05165-b487-4b4e-a070-ebf400d9cb87\\verify_p1_row9_highlight_fixed.jpg', Buffer.from(snap.data, 'base64'));

    ws.close();
  } finally {
    proc.kill();
  }
}

testP1HighlightFix().catch(err => {
  console.error('Error in testP1HighlightFix:', err);
  process.exit(1);
});
