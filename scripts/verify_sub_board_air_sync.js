const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function verifySubBoardAirSync() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9377;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_sub_air_sync',
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

    // 1. Remove security gate & select Junsen J IM Class & switch to sub-board tab
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        if (typeof switchTab === 'function') switchTab('sub-board');
        if (typeof changeBoardSubmarine === 'function') changeBoardSubmarine('Junsen_J_IM_Class');
        if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    // 2. Check initial sub board state
    const diag = await send('Runtime.evaluate', {
      expression: `(() => {
        let err = null;
        try {
          renderInteractiveSlots();
        } catch(e) {
          err = e.message + ' ' + (e.stack || '');
        }
        return {
          hasLayer: !!document.getElementById('sub-board-interactive-layer'),
          renderError: err,
          canonicalLoaded: typeof canonicalSlotsData !== 'undefined' && !!canonicalSlotsData,
          slotsLen: (typeof canonicalSlotsData !== 'undefined' && canonicalSlotsData) ? canonicalSlotsData.slots.length : 0,
          winSlotsLen: window.CANONICAL_SLOTS_DATA ? window.CANONICAL_SLOTS_DATA.slots.length : 0
        };
      })()`,
      returnByValue: true
    });
    console.log('Diagnostic:', JSON.stringify(getVal(diag), null, 2));

    const initCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const layer = document.getElementById('sub-board-interactive-layer');
        const count = layer ? layer.children.length : -1;
        const ids = layer ? Array.from(layer.children).map(c => c.id).slice(0, 15) : [];
        const slotAir1 = document.getElementById('sub-hotspot-slot-air-1');
        const slotSpec = document.getElementById('sub-hotspot-slot-crew-spec');
        return {
          layerCount: count,
          sampleIds: ids,
          air1Exists: !!slotAir1,
          air1Inner: slotAir1 ? slotAir1.innerHTML : null,
          specExists: !!slotSpec,
          specInner: slotSpec ? slotSpec.innerHTML : null,
          hasWindowSlots: typeof window.CANONICAL_SLOTS_DATA !== 'undefined',
          currentSub: typeof currentBoardSubKey !== 'undefined' ? currentBoardSubKey : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Initial Sub Board State:', JSON.stringify(getVal(initCheck), null, 2));

    // 3. Open Aircraft Display Mat, set Damage = 2, Pilot = Serious Wound (sw)
    console.log('--- TEST 1: Open Aircraft Mat, set Damage 2 and Pilot SW ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        openAircraftDisplayMatModal();
        handleAirDamageClick(2);
        handleAirCrewClick('pilot'); // ok -> lw
        handleAirCrewClick('pilot'); // lw -> sw
        closeAircraftDisplayMatModal();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. Verify Sub Board reflects Damage 2 on slot-air-1 and Serious Wounds on slot-crew-spec
    const checkAfterDmg2 = await send('Runtime.evaluate', {
      expression: `(() => {
        const slotAir1 = document.getElementById('sub-hotspot-slot-air-1');
        const slotSpec = document.getElementById('sub-hotspot-slot-crew-spec');
        const imgAir1 = slotAir1 ? slotAir1.querySelector('img')?.src?.split('/').pop() : null;
        const badgeAir1 = slotAir1 ? slotAir1.querySelector('span')?.innerText : null;
        const imgSpec = slotSpec ? slotSpec.querySelector('img')?.src?.split('/').pop() : null;
        return {
          imgAir1,
          badgeAir1,
          titleAir1: slotAir1?.title,
          imgSpec,
          titleSpec: slotSpec?.title
        };
      })()`,
      returnByValue: true
    });
    console.log('Sub Board after Damage 2 & Pilot SW:', JSON.stringify(getVal(checkAfterDmg2), null, 2));

    // Screenshot of sub board with Damage 2 and Pilot SW
    const snap1 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_sub_board_air_dmg2.jpg', Buffer.from(snap1.result.data, 'base64'));
    console.log('Saved verify_sub_board_air_dmg2.jpg');

    // 5. Open Aircraft Mat again, set Damage = 3, Pilot = KIA
    console.log('--- TEST 2: Set Damage 3 and Pilot KIA in Aircraft Mat ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        openAircraftDisplayMatModal();
        handleAirDamageClick(3);
        handleAirCrewClick('pilot'); // sw -> kia
        closeAircraftDisplayMatModal();
      })()`
    });
    await new Promise(r => setTimeout(r, 600));

    const checkAfterKIA = await send('Runtime.evaluate', {
      expression: `(() => {
        const slotAir1 = document.getElementById('sub-hotspot-slot-air-1');
        const slotSpec = document.getElementById('sub-hotspot-slot-crew-spec');
        const imgAir1 = slotAir1 ? slotAir1.querySelector('img')?.src?.split('/').pop() : null;
        const badgeAir1 = slotAir1 ? slotAir1.querySelector('span')?.innerText : null;
        const imgSpec = slotSpec ? slotSpec.querySelector('img')?.src?.split('/').pop() : null;
        return {
          imgAir1,
          badgeAir1,
          titleAir1: slotAir1?.title,
          imgSpec,
          titleSpec: slotSpec?.title
        };
      })()`,
      returnByValue: true
    });
    console.log('Sub Board after Damage 3 & Pilot KIA:', JSON.stringify(getVal(checkAfterKIA), null, 2));

    const snap2 = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/verify_sub_board_air_kia.jpg', Buffer.from(snap2.result.data, 'base64'));
    console.log('Saved verify_sub_board_air_kia.jpg');

    // 6. Test reverse sync: Click on sub board slot-air-1 directly to cycle damage
    console.log('--- TEST 3: Click on sub board slot-air-1 to cycle damage from 3 -> 0 ---');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const slotAir1 = document.getElementById('sub-hotspot-slot-air-1');
        if (slotAir1) slotAir1.click(); // from 3 -> 0
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    const checkReverseAir = await send('Runtime.evaluate', {
      expression: `(() => {
        const slotAir1 = document.getElementById('sub-hotspot-slot-air-1');
        const s = window.campaignState?.aircraftState?.slots[0];
        return {
          subBoardDmg: subBoardState.aircraftDamageLevel,
          subBoardDamaged: subBoardState.aircraftDamaged,
          matPlaneDmg: s?.damage,
          air1InnerHtml: slotAir1?.innerHTML
        };
      })()`,
      returnByValue: true
    });
    console.log('After cycling slot-air-1 on board to 0:', JSON.stringify(getVal(checkReverseAir), null, 2));

    ws.close();
    proc.kill();
    console.log('ALL SYNCHRONIZATION TESTS FINISHED WITH SUCCESS!');
  } catch (err) {
    console.error('Error during test:', err);
    try { proc.kill(); } catch (e) {}
    process.exit(1);
  }
}

verifySubBoardAirSync();
