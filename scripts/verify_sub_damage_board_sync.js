const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runTest() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9394;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_sub_sync',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1500,1100',
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
    const pageTab = tabs.find(t => t.url && t.url.includes('Sensuikan'));
    if (!pageTab) throw new Error('Sensuikan tab not found among tabs: ' + JSON.stringify(tabs.map(t => t.url)));
    const wsUrl = pageTab.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
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

    await send('Runtime.enable');
    await send('DOM.enable');

    console.log('Testing Submarine Damage Centralized State Synchronization...');

    // 1. Select submarine and switch tab
    const evalRes1 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          if (typeof changeBoardSubmarine === 'function') {
            changeBoardSubmarine('Type_B_Class');
          }
          if (typeof switchTab === 'function') {
            switchTab('sub-board');
          }
          
          // Apply Air Crew Injury: Commander (sum=2), Serious Wound (sev=4)
          rollPatrolAirCrewInjury(2, 4);

          // Apply Hull Damage + Flooding + Deck Gun Damage via applySubmarineDamage
          window.applySubmarineDamage({
            hullDamage: 2,
            flooding: 1,
            systemsDamaged: 'deck_gun',
            source: 'air_combat_test'
          });

          return {
            subKey: currentBoardSubKey,
            captCrew: subBoardState.crew ? subBoardState.crew['capt'] : null,
            hull: subBoardState.hullDamage,
            flood: subBoardState.flooding,
            deckGunDamaged: subBoardState.deckGunDamaged,
            commanderIncap: campaignState.commanderIncapacitated
          };
        })()
      `,
      returnByValue: true
    });

    console.log('State evaluation after air damage:', evalRes1.result?.result?.value);

    // 2. Switch tab to Submarine Board (tab-sub-board) to render and visually inspect
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          if (typeof showTab === 'function') {
            showTab('sub-board');
          } else if (typeof setWorkflowPhase === 'function') {
            setWorkflowPhase('sub_board');
          }
          if (typeof renderSubBoard === 'function') renderSubBoard();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        })()
      `
    });

    await new Promise(r => setTimeout(r, 1200));

    // 3. Inspect DOM chits on the Submarine Board before repair
    const domInspection1 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const captSlot = document.getElementById('sub-hotspot-slot-crew-capt');
          const captImg = captSlot ? captSlot.querySelector('img')?.src : null;
          
          const floodSlot1 = document.getElementById('sub-hotspot-slot-flood-1');
          const floodImg = floodSlot1 ? floodSlot1.querySelector('img')?.src : null;
          
          const hullSlot2 = document.getElementById('sub-hotspot-slot-hull-2');
          const hullImg = hullSlot2 ? hullSlot2.querySelector('img')?.src : null;

          const deckGunSlot = document.getElementById('sub-hotspot-slot-artillery-1');
          const deckGunImg = deckGunSlot ? deckGunSlot.querySelector('img')?.src : null;

          return {
            captSlotHasContent: !!(captSlot && captSlot.innerHTML.length > 0),
            captHasImg: !!captImg,
            floodHasImg: !!floodImg,
            hullHasImg: !!hullImg,
            deckGunHasImg: !!deckGunImg
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DOM inspection BEFORE repair:', domInspection1.result?.result?.value);

    // 4. Test repair of deck gun
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.applySubmarineRepair({ systemRepaired: 'deck_gun' });
        })()
      `
    });

    const domInspection2 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const deckGunSlot = document.getElementById('sub-hotspot-slot-artillery-1');
          const deckGunImg = deckGunSlot ? deckGunSlot.querySelector('img')?.src : null;
          return {
            deckGunDamagedState: subBoardState.deckGunDamaged,
            deckGunSlotHasChit: !!deckGunImg
          };
        })()
      `,
      returnByValue: true
    });

    console.log('DOM inspection AFTER deck gun repair:', domInspection2.result?.result?.value);

    // 4. Capture screenshot of Submarine Board
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\sub_board_damage_sync_verified.png';
    fs.writeFileSync(outPath, Buffer.from(ss.result.data, 'base64'));
    console.log(`Saved screenshot to: ${outPath}`);

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    proc.kill();
  }
}

runTest();
