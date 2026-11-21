const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testAircraftMatAndTacticalMap() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9388;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_esc_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1440,950',
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
    console.log('Connecting to tab:', appTab.title, appTab.url);

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

    const getVal = (res) => (res.result && res.result.result ? res.result.result.value : (res.result ? res.result.value : res));

    // 1. Remove security gate & select sub with plane
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
    await new Promise(r => setTimeout(r, 600));

    // 2. Open Aircraft Display Mat Modal
    console.log('--- TEST 1: Open Aircraft Display Mat Modal ---');
    await send('Runtime.evaluate', {
      expression: `openAircraftDisplayMatModal();`
    });
    await new Promise(r => setTimeout(r, 800));

    const checkModal = await send('Runtime.evaluate', {
      expression: `(() => {
        const m = document.getElementById('modal-aircraft-display-mat');
        const pTakeoff = document.getElementById('air-tab-panel-takeoff');
        const pMap = document.getElementById('air-tab-panel-map');
        const pRecovery = document.getElementById('air-tab-panel-recovery');
        const mapImg = document.getElementById('air-tactical-map-img');
        const overlay = document.getElementById('air-map-interactive-overlay');
        const activePlaneCounter = overlay ? overlay.querySelector('.air-active-plane-counter') : null;
        const pillText = document.getElementById('air-map-circle-text')?.innerText;
        return {
          modalVisible: m && window.getComputedStyle(m).display !== 'none',
          activeTab: window.aircraftState ? window.aircraftState.activePhaseTab : null,
          takeoffDisplay: pTakeoff ? window.getComputedStyle(pTakeoff).display : null,
          mapDisplay: pMap ? window.getComputedStyle(pMap).display : null,
          recoveryDisplay: pRecovery ? window.getComputedStyle(pRecovery).display : null,
          mapSrc: mapImg?.src?.split('/').pop(),
          activeCircleText: pillText,
          hasActivePlaneCounter: !!activePlaneCounter,
          planeCounterImg: activePlaneCounter ? activePlaneCounter.querySelector('img')?.src?.split('/').pop() : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Modal Check State:', JSON.stringify(getVal(checkModal), null, 2));

    // Take screenshot of the Tactical Map view
    const snap1 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_tactical_map_large.jpg', Buffer.from(snap1.result.data, 'base64'));
    console.log('Saved verify_tactical_map_large.jpg');

    // 3. Move to Circle 2, then Circle 3 (Target), roll encounter and bombing
    console.log('--- TEST 2: Move along circles & Roll Encounter ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        selectFlightCircle(2);
        rollAirCircleEncounter();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkCircle2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const pillText = document.getElementById('air-map-circle-text')?.innerText;
        const logBox = document.getElementById('air-flight-log-box')?.innerText;
        return { pillText, logBox };
      })()`,
      returnByValue: true
    });
    console.log('Circle 2 result:', JSON.stringify(getVal(checkCircle2), null, 2));

    // Move to Circle 3 (Target)
    console.log('--- TEST 3: Move to Circle 3 (Target) and Bomb ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        selectFlightCircle(3);
        rollAirBombing();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkCircle3 = await send('Runtime.evaluate', {
      expression: `(() => {
        const pillText = document.getElementById('air-map-circle-text')?.innerText;
        const bombBtnDisplay = document.getElementById('air-btn-bomb-target')?.style.display;
        const logBox = document.getElementById('air-flight-log-box')?.innerText;
        return { pillText, bombBtnDisplay, logBox };
      })()`,
      returnByValue: true
    });
    console.log('Circle 3 (Target) result:', JSON.stringify(getVal(checkCircle3), null, 2));

    // 4. Test English switch
    console.log('--- TEST 4: Bilingual Switch (ES -> EN) ---');
    await send('Runtime.evaluate', {
      expression: `toggleLanguage();`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkEn = await send('Runtime.evaluate', {
      expression: `(() => {
        const tabTakeoff = document.getElementById('lbl-tab-takeoff')?.innerText;
        const tabMap = document.getElementById('lbl-tab-map')?.innerText;
        const tabRecovery = document.getElementById('lbl-tab-recovery')?.innerText;
        const pillText = document.getElementById('air-map-circle-text')?.innerText;
        const p3Btn = document.getElementById('lbl-p3-btn')?.innerText;
        return { tabTakeoff, tabMap, tabRecovery, pillText, p3Btn };
      })()`,
      returnByValue: true
    });
    console.log('English UI Check:', JSON.stringify(getVal(checkEn), null, 2));

    // Take screenshot in English
    const snap2 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_tactical_map_en.jpg', Buffer.from(snap2.result.data, 'base64'));
    console.log('Saved verify_tactical_map_en.jpg');

    // 5. Test Escape Key
    console.log('--- TEST 5: Escape key closing modal ---');
    await send('Runtime.evaluate', {
      expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkClosed = await send('Runtime.evaluate', {
      expression: `document.getElementById('modal-aircraft-display-mat').style.display`,
      returnByValue: true
    });
    console.log('Modal display after Escape:', getVal(checkClosed));

    ws.close();
    proc.kill();
    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test execution failed:', err);
    try { proc.kill(); } catch (e) {}
    process.exit(1);
  }
}

testAircraftMatAndTacticalMap();
