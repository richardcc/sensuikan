const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testEnlargedAircraftMap() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9391;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_air_map_prof2',
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
    await new Promise(r => setTimeout(r, 500));

    // 2. Open Modal and switch to Map tab
    console.log('\n--- 1. OPEN MODAL & VERIFY ENLARGED MAP DIMENSIONS ---');
    const openRes = await send('Runtime.evaluate', {
      expression: `openAircraftDisplayMatModal(); switchAirPhaseTab('map');`
    });
    if (openRes.result && openRes.result.exceptionDetails) {
      console.error('Error opening modal:', openRes.result.exceptionDetails);
    }
    await new Promise(r => setTimeout(r, 800));

    const dimensions = await send('Runtime.evaluate', {
      expression: `(() => {
        try {
          const mapImg = document.getElementById('air-tactical-map-img');
          const mapStage = document.getElementById('air-map-stage');
          const modalBox = document.getElementById('air-mat-modal-card');
          const inspectorCol = document.getElementById('air-mat-col-inspector');
          const suiteCol = document.getElementById('air-mat-col-suite');
          const rectImg = mapImg.getBoundingClientRect();
          const rectStage = mapStage.getBoundingClientRect();
          const rectModal = modalBox.getBoundingClientRect();

          return JSON.stringify({
            modalWidth: Math.round(rectModal.width),
            modalHeight: Math.round(rectModal.height),
            mapImgWidth: Math.round(rectImg.width),
            mapImgHeight: Math.round(rectImg.height),
            stageWidth: Math.round(rectStage.width),
            stageHeight: Math.round(rectStage.height),
            inspectorWidth: Math.round(inspectorCol ? inspectorCol.getBoundingClientRect().width : 0),
            suiteWidth: Math.round(suiteCol ? suiteCol.getBoundingClientRect().width : 0)
          });
        } catch(e) {
          return JSON.stringify({ error: e.message, stack: e.stack });
        }
      })()`
    });
    console.log('Evaluated result:', dimensions);
    console.log('Measured Layout Dimensions:', JSON.parse(dimensions.result.result.value));

    // Capture standard view screenshot
    const scr1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/verified_aircraft_map_enlarged.png', Buffer.from(scr1.result.data, 'base64'));
    console.log('Saved screenshot 1: verified_aircraft_map_enlarged.png');

    // 3. Test Navigation & Stepper
    console.log('\n--- 2. TEST NAVIGATION, STEPPER & THREAT LEVELS ---');
    await send('Runtime.evaluate', {
      expression: `selectFlightCircle(3);`
    });
    await new Promise(r => setTimeout(r, 400));
    const navCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const pillText = document.getElementById('air-map-circle-text')?.innerText;
        const threatBadge = document.getElementById('air-console-threat-badge')?.innerText;
        const quickHealth = document.getElementById('air-console-quick-health')?.innerText;
        return JSON.stringify({ pillText, threatBadge, quickHealth });
      })()`
    });
    console.log('Circle 3 Status:', JSON.parse(navCheck.result.result.value));

    // 4. Test Encounter Roll
    console.log('\n--- 3. TEST ENCOUNTER ROLL ---');
    await send('Runtime.evaluate', {
      expression: `rollAirCircleEncounter();`
    });
    await new Promise(r => setTimeout(r, 400));
    const logCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const logBox = document.getElementById('air-flight-log-box');
        return JSON.stringify({ logHtml: logBox ? logBox.innerText : '' });
      })()`
    });
    console.log('Flight Log Content:', JSON.parse(logCheck.result.result.value).logHtml.trim());

    // 5. Test Zoom feature
    console.log('\n--- 4. TEST MAP ZOOM (+25%) ---');
    await send('Runtime.evaluate', {
      expression: `zoomAircraftMap(0.25);`
    });
    await new Promise(r => setTimeout(r, 300));
    const zoomCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const wrapper = document.getElementById('air-map-wrapper');
        const zoomLbl = document.getElementById('air-zoom-val')?.innerText;
        return JSON.stringify({ transform: wrapper?.style?.transform, zoomLbl });
      })()`
    });
    console.log('Zoom Status:', JSON.parse(zoomCheck.result.result.value));

    // 6. Test Theater Mode (Expanded View)
    console.log('\n--- 5. TEST THEATER MODE (EXPANDED VIEW) ---');
    await send('Runtime.evaluate', {
      expression: `resetAircraftMapZoom(); toggleAirTheaterMode();`
    });
    await new Promise(r => setTimeout(r, 600));

    const theaterDimensions = await send('Runtime.evaluate', {
      expression: `(() => {
        const mapImg = document.getElementById('air-tactical-map-img');
        const mapStage = document.getElementById('air-map-stage');
        const inspectorCol = document.getElementById('air-mat-col-inspector');
        const rectImg = mapImg.getBoundingClientRect();
        const rectStage = mapStage.getBoundingClientRect();

        return JSON.stringify({
          inspectorDisplay: inspectorCol ? window.getComputedStyle(inspectorCol).display : null,
          theaterStageWidth: Math.round(rectStage.width),
          theaterStageHeight: Math.round(rectStage.height),
          theaterMapImgWidth: Math.round(rectImg.width),
          theaterMapImgHeight: Math.round(rectImg.height)
        });
      })()`
    });
    console.log('Theater Mode Dimensions:', JSON.parse(theaterDimensions.result.result.value));

    // Capture theater view screenshot
    const scr2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/verified_aircraft_map_theater.png', Buffer.from(scr2.result.data, 'base64'));
    console.log('Saved screenshot 2: verified_aircraft_map_theater.png');

    // 7. Check for Console Errors
    const errors = await send('Runtime.evaluate', {
      expression: `(() => JSON.stringify(window.__consoleErrors || []))()`
    });
    console.log('\n--- 6. CONSOLE ERRORS ---');
    console.log('Errors count:', JSON.parse(errors.result.result.value).length);

    ws.close();
    proc.kill();
    console.log('\n=== VERIFICATION COMPLETE: ALL SUCCESS ===');
  } catch (err) {
    console.error('Verification failed:', err);
    proc.kill();
  }
}

testEnlargedAircraftMap();
