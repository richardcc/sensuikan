const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runTest() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9348;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_rule_profile',
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
      if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        errors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception ? msg.params.exceptionDetails.exception.description : ''));
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('1. Checking Rule 8.2.9: Sub vs Sub Initiative...');
    const testSubVsSub = await send('Runtime.evaluate', {
      expression: `(() => {
        setWorkflowPhase(3);
        const subTarget = { name: "USS Corvina (SS-226)", type: "Warship", tons: 1525, is_sub: true, escort_type: "None" };
        applyTargetToWorkflow(subTarget);
        const card = document.getElementById('wf-sub-vs-sub-card');
        const cardVisible = card && card.style.display !== 'none';
        
        rollSubVsSubInitiative();
        const resEl = document.getElementById('wf-sub-initiative-res');
        const hasRes = resEl && resEl.innerText.length > 5;

        return { cardVisible, hasRes, resText: resEl ? resEl.innerText : '' };
      })()`,
      returnByValue: true
    });
    console.log('Sub vs Sub result:', testSubVsSub.result.result.value);

    console.log('2. Checking Rule 8.4: Follow Convoy / Damaged Ship...');
    const testFollow = await send('Runtime.evaluate', {
      expression: `(() => {
        campaignState.workflow.currentContact = { name: "USS Corvina", tons: 1525, is_sub: true };
        followConvoyNextRound();
        const btn = document.getElementById('btn-follow-convoy');
        return { btnPresent: !!btn, round: campaignState.workflow.combatRound };
      })()`,
      returnByValue: true
    });
    console.log('Follow Convoy result:', testFollow.result.result.value);

    console.log('3. Checking Rule 8.8: Awards Table in Phase 5...');
    const testAwards = await send('Runtime.evaluate', {
      expression: `(() => {
        setWorkflowPhase(5);
        const golden5 = document.body.innerText.includes('Milano Dorado (5.ª clase)') || document.body.innerText.includes('Golden Kite');
        const wound = document.body.innerText.includes('Insignia de Herido') || document.body.innerText.includes('Sensho Kisho');
        const daitoa = document.body.innerText.includes('Gran Asia Oriental') || document.body.innerText.includes('Daitoa');
        return { golden5, wound, daitoa };
      })()`,
      returnByValue: true
    });
    console.log('Awards result:', testAwards.result.result.value);

    console.log('4. Checking Rule 11.0: Optional Rules in Compendium...');
    const testCompendium = await send('Runtime.evaluate', {
      expression: `(() => {
        const has11 = document.body.innerText.includes('11.0') || document.body.innerText.includes('REGLAS OPCIONALES');
        const has11_1 = document.body.innerText.includes('11.1') || document.body.innerText.includes('Standard Tonnage');
        const has11_7 = document.body.innerText.includes('11.7') || document.body.innerText.includes('Capitán');
        return { has11, has11_1, has11_7 };
      })()`,
      returnByValue: true
    });
    console.log('Compendium Optional Rules result:', testCompendium.result.result.value);

    console.log('5. Checking Rule 5.2: Victory Tiers...');
    const testVictory = await send('Runtime.evaluate', {
      expression: `(() => {
        const def = document.body.innerText.includes('0 – 9.999 t');
        const dec = document.body.innerText.includes('≥ 100.000 t') || document.body.innerText.includes('100.000+');
        return { def, dec };
      })()`,
      returnByValue: true
    });
    console.log('Victory Tiers result:', testVictory.result.result.value);

    console.log('Console Errors:', errors);

    ws.close();
    proc.kill();
    process.exit(errors.length > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test error:', err);
    proc.kill();
    process.exit(1);
  }
}

runTest();
