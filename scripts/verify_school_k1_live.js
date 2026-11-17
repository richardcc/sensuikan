const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testSchoolK1Live() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9388;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_k1_live',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1400',
    `file://${htmlPath}`
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
    const pageTab = tabs.find(t => (t.url && t.url.includes('Sensuikan')) || (t.title && t.title.includes('Sensuikan'))) || tabs[0];
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

    // 1. Setup in Phase 0: Escuelas
    const testResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate') || document.getElementById('security-gate-overlay');
        if (gate) gate.remove();

        // 1. Set submarine to Type B (has plane + kaiten capability)
        const subSelect = document.getElementById('wf-sub-class-select');
        if (subSelect) {
          subSelect.value = 'Type_B_Class';
          onWorkflowSubClassChange();
        }

        // Switch to school phase
        setWorkflowPhase('school');

        // Roll or set F2 Minisubmarines
        setF2Torpedo(true);
        setF2Comms(true);
        setF2Net(false);

        // Select 2 skills in F3 Kasumigaura Air Crew
        const chkWeap = document.getElementById('chk-f3-weap');
        const chkAcm = document.getElementById('chk-f3-acm');
        const chkMaint = document.getElementById('chk-f3-maint');
        if (chkWeap) chkWeap.checked = true;
        if (chkAcm) chkAcm.checked = true;
        if (chkMaint) chkMaint.checked = false;
        validateF3Checkboxes();

        // Set Kaiten Pilots F4 Otsujima
        const p1 = document.getElementById('sel-f4-pilot-1');
        const p2 = document.getElementById('sel-f4-pilot-2');
        const p3 = document.getElementById('sel-f4-pilot-3');
        if (p1) p1.value = 'senninbari';
        if (p2) p2.value = 'hachimaki';
        if (p3) p3.value = 'ashes';
        syncF4ToK1();

        // Also check captain skills
        setCaptainTorpedoTraining(true);
        setXODeckGunTraining(true);

        // Switch directly to Chart K1
        switchTab('k1');

        // Verify tokens on Chart K1
        const tokMidgetTorp = document.getElementById('token-midget-torp');
        const tokMidgetComms = document.getElementById('token-midget-comms');
        const tokMidgetBoat = document.getElementById('token-midget-boat');
        const tokAirWeap = document.getElementById('token-air1-weap');
        const tokAirAcm = document.getElementById('token-air1-acm');
        const tokAirMaint = document.getElementById('token-air1-maint');

        const tokKaiten1 = document.getElementById('token-kaiten-1');
        const tokKaiten2 = document.getElementById('token-kaiten-2');
        const tokKaiten3 = document.getElementById('token-kaiten-3');

        return {
          midgetTorpActive: tokMidgetTorp ? tokMidgetTorp.classList.contains('active') : false,
          midgetCommsActive: tokMidgetComms ? tokMidgetComms.classList.contains('active') : false,
          midgetBoatInactive: tokMidgetBoat ? tokMidgetBoat.classList.contains('inactive') : false,
          airWeapActive: tokAirWeap ? tokAirWeap.classList.contains('active') : false,
          airAcmActive: tokAirAcm ? tokAirAcm.classList.contains('active') : false,
          airMaintInactive: tokAirMaint ? tokAirMaint.classList.contains('inactive') : false,
          kaiten1Active: tokKaiten1 ? tokKaiten1.classList.contains('active') : false,
          kaiten2Active: tokKaiten2 ? tokKaiten2.classList.contains('active') : false,
          kaiten3Active: tokKaiten3 ? tokKaiten3.classList.contains('active') : false,
          kaitenStripVisible: !!document.getElementById('k1-kaiten-strip')
        };
      })()`,
      returnByValue: true
    });

    console.log('Live School to K1 Test Result:', testResult.result.result.value);

    // Capture Chart K1 screenshot
    await new Promise(r => setTimeout(r, 600));
    const clipRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const k1 = document.getElementById('tab-chart-k1');
        const cr = k1.getBoundingClientRect();
        return { x: cr.x, y: cr.y, width: cr.width, height: cr.height };
      })()`,
      returnByValue: true
    });

    const cr = clipRes.result.result.value;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: cr.x,
        y: cr.y,
        width: Math.min(cr.width, 1260),
        height: Math.min(cr.height, 1350),
        scale: 1
      }
    });

    const buffer = Buffer.from(screenshot.result.data, 'base64');
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\k1_skills_and_kaiten_verified.png';
    fs.writeFileSync(outPath, buffer);
    console.log('Saved screenshot to:', outPath);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Test error:', err);
    proc.kill();
    process.exit(1);
  }
}

testSchoolK1Live();
