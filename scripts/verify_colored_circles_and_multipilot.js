const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function verifyAll() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9535;
  const brainDir = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17';

  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_multipilot',
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
            if (res.error) {
              console.error('CDP Error:', res.error);
              reject(res.error);
            } else if (res.result && res.result.exceptionDetails) {
              console.error('JS Exception:', res.result.exceptionDetails);
              resolve(res.result);
            } else {
              resolve(res.result);
            }
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Log.enable');

    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Log.entryAdded') {
        console.log('BROWSER LOG:', msg.params.entry.text);
      }
    });
    await new Promise(r => setTimeout(r, 1000));

    // 1. Remove security gate & setup Sen-Toku in School Phase
    console.log('--- Setting up Sen_Toku_Class in Flight School F3 ---');
    const initRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        
        window.campaignState = window.campaignState || {};
        window.campaignState.activeSubKey = 'Sen_Toku_Class';
        if (typeof selectSubmarineKey === 'function') selectSubmarineKey('Sen_Toku_Class');
        if (typeof navigateToPhase === 'function') navigateToPhase('school');
        if (typeof updateSchoolEquipDisplay === 'function') updateSchoolEquipDisplay();

        const pContainer = document.getElementById('f3-multi-pilot-container');
        const pTabs = document.getElementById('f3-pilot-tabs');
        const btnRollAll = document.getElementById('f3-btn-roll-all');
        return {
          containerVisible: pContainer ? pContainer.style.display : 'none',
          tabsHtml: pTabs ? pTabs.innerHTML : '',
          btnRollAllVisible: btnRollAll ? btnRollAll.style.display : 'none'
        };
      })()`,
      returnByValue: true
    });
    console.log('Sen-Toku F3 Initial:', initRes.result.value);

    // Roll all pilots
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof rollAllPilotsF3Skills === 'function') rollAllPilotsF3Skills();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const rolledRes = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          pilotSkills: window.campaignState.school.pilotSkills,
          f3Skills: window.campaignState.school.f3Skills
        };
      })()`,
      returnByValue: true
    });
    console.log('Sen-Toku Rolled Skills:', rolledRes.result.value);

    // Screenshot of Sen-Toku F3 School with 3 pilots
    const snapF3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_school_f3_sentoku_3pilots.png'), Buffer.from(snapF3.data, 'base64'));
    console.log('Saved verified_school_f3_sentoku_3pilots.png');

    // 2. Open Aircraft Display Mat Modal & Check Navigation Circles and Slot Switching
    console.log('--- Opening Aircraft Display Mat Modal (Tabla P) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof openAircraftDisplayMatModal === 'function') openAircraftDisplayMatModal();
        if (typeof switchAirPhaseTab === 'function') switchAirPhaseTab('map');
      })()`
    });
    await new Promise(r => setTimeout(r, 1200));

    const matInfo1 = await send('Runtime.evaluate', {
      expression: `(() => {
        const pillsContainer = document.getElementById('air-slots-pills');
        const buttons = pillsContainer ? Array.from(pillsContainer.querySelectorAll('button')).map(b => b.innerText) : [];
        const skillsTitle = document.getElementById('air-skills-title');
        const overlay = document.getElementById('air-map-interactive-overlay');
        const circles = overlay ? overlay.querySelectorAll('div[onclick*="selectFlightCircle"]') : [];
        const circleData = Array.from(circles).map(c => ({
          text: c.innerText.trim().replace(/\\n/g, ' '),
          width: c.style.width,
          height: c.style.height,
          background: c.style.background
        }));
        return {
          buttons,
          skillsTitle: skillsTitle ? skillsTitle.innerText : '',
          activeSlot: window.aircraftState.activeSlot,
          circles: circleData
        };
      })()`,
      returnByValue: true
    });
    console.log('Mat Slot 1 Info & Circles:', matInfo1.result.value);

    // Screenshot of Pearl Harbor map with vibrant colored circles
    const snapP7 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_colored_circles_pearl_harbor.png'), Buffer.from(snapP7.data, 'base64'));
    console.log('Saved verified_colored_circles_pearl_harbor.png');

    // Switch to Slot 2 (#2: SEIRAN)
    console.log('--- Switching to Slot 3 (Seiran #2) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof selectAircraftSlot === 'function') selectAircraftSlot(3);
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const matInfo2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const skillsTitle = document.getElementById('air-skills-title');
        return {
          activeSlot: window.aircraftState.activeSlot,
          skillsTitle: skillsTitle ? skillsTitle.innerText : '',
          pilot2Skills: window.campaignState.school.pilotSkills[1]
        };
      })()`,
      returnByValue: true
    });
    console.log('Mat Slot 2 (Pilot 2) Info:', matInfo2.result.value);

    // Switch to Panama Canal map
    console.log('--- Switching to Panama Canal Map ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof selectAircraftMap === 'function') selectAircraftMap('map_p11_panama_canal.jpg');
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const snapP11 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_colored_circles_panama_canal.png'), Buffer.from(snapP11.data, 'base64'));
    console.log('Saved verified_colored_circles_panama_canal.png');

    // 3. Test Type_A_Modified (2 pilots)
    console.log('--- Testing Type_A_Modified (2 Glen) ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        if (typeof closeAircraftDisplayMatModal === 'function') closeAircraftDisplayMatModal();
        window.campaignState.activeSubKey = 'Type_A_Modified';
        if (typeof selectSubmarineKey === 'function') selectSubmarineKey('Type_A_Modified');
        if (typeof navigateToPhase === 'function') navigateToPhase('school');
        if (typeof updateSchoolEquipDisplay === 'function') updateSchoolEquipDisplay();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const typeAInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const pTabs = document.getElementById('f3-pilot-tabs');
        return {
          tabsHtml: pTabs ? pTabs.innerHTML : '',
          activeSubKey: window.campaignState.activeSubKey
        };
      })()`,
      returnByValue: true
    });
    console.log('Type A Mod F3 Tabs:', typeAInfo.result.value);

    const snapTypeA = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(brainDir, 'verified_school_f3_type_a_mod.png'), Buffer.from(snapTypeA.data, 'base64'));
    console.log('Saved verified_school_f3_type_a_mod.png');

    ws.close();
    console.log('All verifications finished successfully!');
  } catch(e) {
    console.error('Error during test:', e);
  } finally {
    proc.kill();
  }
}

verifyAll();
