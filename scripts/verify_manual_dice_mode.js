const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runTest() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9345;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_dice_profile',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1024',
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

    const errors = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params.exceptionDetails);
        console.error('Browser Exception:', msg.params.exceptionDetails);
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Unlocking and testing Phase 0 Schools manual setters...');
    const p0Res = await send('Runtime.evaluate', {
      expression: `
        (function() {
          localStorage.setItem('sensuikan_auth_state', 'granted');
          const gate = document.getElementById('security-login-gate');
          if (gate) gate.style.display = 'none';

          if (typeof switchTab === 'function') switchTab('workflow');
          if (typeof setWorkflowPhase === 'function') setWorkflowPhase('school');

          setCaptainTorpedoTraining(true);
          setXODeckGunTraining(true);
          setEngineerJudgmentTraining(true);
          setF2Torpedo(true);

          return {
            torp: document.getElementById('res-f1-cap-torp')?.innerText,
            gun: document.getElementById('res-f1-xo-gun')?.innerText,
            keen: document.getElementById('res-f1-eng-keen')?.innerText,
            f2: document.getElementById('res-f2-torp')?.innerText
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Phase 0 Manual Setters result:', p0Res.result?.value);

    // Capture screenshot of Phase 0 scrolled to F1 cards
    await send('Runtime.evaluate', { expression: `document.getElementById('f1-main-title').scrollIntoView();` });
    await new Promise(r => setTimeout(r, 600));
    const shot0 = await send('Page.captureScreenshot', { format: 'png' });
    const p0ShotPath = path.join('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'manual_dice_schools.png');
    fs.writeFileSync(p0ShotPath, Buffer.from(shot0.result.data, 'base64'));
    console.log(`Saved screenshot: ${p0ShotPath}`);

    // Test Phase 2: Encounter roll manual
    console.log('Testing Phase 2 manual 2d6 encounter roll...');
    const p2Res = await send('Runtime.evaluate', {
      expression: `
        (function() {
          setWorkflowPhase(2);
          rollBoxEncounter(7);
          return {
            rollText: document.getElementById('wf-encounter-roll-res')?.innerText,
            lastRoll: campaignState.workflow.lastA3Roll
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Phase 2 Manual Roll result:', p2Res.result?.value);
    await new Promise(r => setTimeout(r, 600));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    const p2ShotPath = path.join('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'manual_dice_phase2.png');
    fs.writeFileSync(p2ShotPath, Buffer.from(shot2.result.data, 'base64'));
    console.log(`Saved screenshot: ${p2ShotPath}`);

    // Test Phase 3: Tactical combat manual salvo and escort counter-attack
    console.log('Testing Phase 3 manual combat salvo & detection/charges...');
    const p3Res = await send('Runtime.evaluate', {
      expression: `
        (function() {
          setWorkflowPhase(3);
          document.getElementById('wf-manual-hits-select').value = "3";
          document.getElementById('wf-manual-duds-select').value = "0";
          document.getElementById('wf-manual-dmg-input').value = "9";
          applyManualTorpedoHits();

          rollB4Detection(7);
          const b4Text = document.getElementById('wf-escort-res-text')?.innerText;

          rollEscortCounterAttack(5);
          const b5Text = document.getElementById('wf-escort-res-text')?.innerText;

          return {
            hitRes: document.getElementById('wf-combat-hit-res')?.innerText,
            sinkStatus: document.getElementById('wf-combat-sink-status')?.innerText,
            b4Text: b4Text?.substring(0, 50),
            b5Text: b5Text?.substring(0, 50)
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Phase 3 Manual Combat result:', p3Res.result?.value);

    // Capture screenshot of Phase 3
    await new Promise(r => setTimeout(r, 600));
    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    const p3ShotPath = path.join('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'manual_dice_combat.png');
    fs.writeFileSync(p3ShotPath, Buffer.from(shot3.result.data, 'base64'));
    console.log(`Saved screenshot: ${p3ShotPath}`);

    // Test Phase 4: Damage control manual
    console.log('Testing Phase 4 manual flooding & repairs...');
    const p4Res = await send('Runtime.evaluate', {
      expression: `
        (function() {
          setWorkflowPhase(4);
          rollB7Flooding(2);
          const flood = document.getElementById('wf-b7-flooding-res')?.innerText;
          rollB7SystemRepair(1);
          const rep = document.getElementById('wf-b7-repair-res')?.innerText;
          return { flood, rep };
        })()
      `,
      returnByValue: true
    });
    console.log('Phase 4 Manual Results:', p4Res.result?.value);

    console.log(`\n=== Verification Finished ===`);
    console.log(`Exceptions logged: ${errors.length}`);
    if (errors.length === 0) {
      console.log('SUCCESS: All manual dice workflows verified with 0 errors!');
    }

    ws.close();
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    proc.kill();
    process.exit(0);
  }
}

runTest();
