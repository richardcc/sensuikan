const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve('app/index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  const port = 9352;
  const edge = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const targets = await new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:${port}/json`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      function onMsg(e) {
        const m = JSON.parse(e.data);
        if (m.id === id) {
          ws.removeEventListener('message', onMsg);
          resolve(m.result);
        }
      }
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const consoleErrors = [];
  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
    }
  });

  await send('Runtime.enable');
  await send('Page.enable');

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text + ': ' + (res.exceptionDetails.exception?.description || ''));
    }
    return res.result.value;
  }

  console.log('=== TEST 1: Functions defined on window ===');
  const funcs = await evalJs(`({
    filterMajorEventsToCurrentCampaign: typeof window.filterMajorEventsToCurrentCampaign,
    assignActiveCampaignEventMission: typeof window.assignActiveCampaignEventMission,
    renderMajorEventsGrid: typeof window.renderMajorEventsGrid,
    toggleMajorEventsFlip: typeof window.toggleMajorEventsFlip
  })`);
  console.log('Functions:', funcs);

  console.log('=== TEST 2: Activate Major Events Phase ===');
  await evalJs(`setWorkflowPhase('major-events')`);
  await new Promise(r => setTimeout(r, 400));

  const count28 = await evalJs(`document.querySelectorAll('#major-events-chits-grid .flow-card').length`);
  console.log('28 Chits rendered:', count28);

  console.log('=== TEST 3: Filter by Current Month ===');
  await evalJs(`filterMajorEventsToCurrentCampaign()`);
  await new Promise(r => setTimeout(r, 300));
  const countCur = await evalJs(`document.querySelectorAll('#major-events-chits-grid .flow-card').length`);
  console.log('Filtered chits for 1941-12:', countCur);

  console.log('=== TEST 4: Assign Active Event to Patrol ===');
  await evalJs(`assignActiveCampaignEventMission()`);
  await new Promise(r => setTimeout(r, 300));
  const assignment = await evalJs(`({
    area: campaignState.workflow.assignedArea,
    month: campaignState.workflow.selectedMonth,
    mission: campaignState.workflow.specialMissionAssigned,
    majorEventActive: campaignState.workflow.majorEventActive
  })`);
  console.log('Campaign Assignment:', assignment);

  console.log('=== TEST 5: Return to Major Events & Flip Chits ===');
  await evalJs(`setWorkflowPhase('major-events')`);
  await evalJs(`filterMajorEventsToCurrentCampaign()`); // toggle filter back to all
  await evalJs(`toggleMajorEventsFlip()`);
  await new Promise(r => setTimeout(r, 300));
  const flipped = await evalJs(`majorEventsFlipped`);
  console.log('Chits flipped state:', flipped);

  console.log('=== TEST 6: Check for any Eventoos typo ===');
  const typos = await evalJs(`(() => {
    const list = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.children.length === 0 && el.innerText && el.innerText.includes('Eventoos')) {
        list.push(el.innerText);
      }
    });
    return list;
  })()`);
  console.log('Typo matches:', typos);

  console.log('=== TEST 7: Bilingual Toggle Test ===');
  await evalJs(`toggleLanguage()`);
  await new Promise(r => setTimeout(r, 400));
  const langEnData = await evalJs(`({
    title: document.getElementById('lbl-major-events-title')?.innerText,
    btnFlip: document.getElementById('lbl-major-events-flip-btn')?.innerText,
    btnCurMonth: document.getElementById('lbl-filter-campaign-btn')?.innerText,
    stepperLabel: document.getElementById('lbl-stepmajorevents')?.innerText
  })`);
  console.log('EN Localization:', langEnData);

  // Switch back to ES
  await evalJs(`toggleLanguage()`);
  await new Promise(r => setTimeout(r, 400));
  const langEsData = await evalJs(`({
    title: document.getElementById('lbl-major-events-title')?.innerText,
    btnFlip: document.getElementById('lbl-major-events-flip-btn')?.innerText,
    btnCurMonth: document.getElementById('lbl-filter-campaign-btn')?.innerText,
    stepperLabel: document.getElementById('lbl-stepmajorevents')?.innerText
  })`);
  console.log('ES Localization:', langEsData);

  console.log('=== TEST 8: Screenshot Capture ===');
  const artifactDir = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17';
  const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'verified_major_events_fixed.png'), Buffer.from(screenshotData.data, 'base64'));
  console.log('Screenshot saved to verified_major_events_fixed.png');

  console.log('Console errors captured during test:', consoleErrors);

  ws.close();
  edge.kill();

  if (consoleErrors.length > 0) {
    throw new Error('FAIL: Console errors detected');
  }
  if (count28 !== 28) {
    throw new Error(`FAIL: Expected 28 cards, found ${count28}`);
  }
  if (typos.length > 0) {
    throw new Error('FAIL: Typo Eventoos found');
  }
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
