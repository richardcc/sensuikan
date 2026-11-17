const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testSchoolToK1() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_Tablet_Offline.html');
  const port = 9405;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_k1_test',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1024',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const getJson = () => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json`, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const tabs = await getJson();
  const pageTab = tabs.find(t => t.url && t.url.includes('Sensuikan')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const gate = document.getElementById('security-login-gate');
      if (gate) gate.remove();
      
      // 1. In schools, set F2 torpedo won
      setF2Torpedo(true);
      
      // 2. In F3, check weapons expert and ACM
      const chk1 = document.getElementById('chk-f3-weap');
      if (chk1) chk1.checked = true;
      const chk2 = document.getElementById('chk-f3-acm');
      if (chk2) chk2.checked = true;

      // 3. Click complete training
      completeTrainingAndProceedToPatrol();

      // 4. Switch to Chart K1
      switchTab('chart-k1');

      // Check token states in DOM
      const torpEl = document.getElementById('token-midget-torp');
      const weapEl = document.getElementById('token-air1-weap');
      const acmEl = document.getElementById('token-air1-acm');
      const maintEl = document.getElementById('token-air1-maint');

      return {
        midgetTorpActive: torpEl ? torpEl.classList.contains('active') : false,
        airWeapActive: weapEl ? weapEl.classList.contains('active') : false,
        airAcmActive: acmEl ? acmEl.classList.contains('active') : false,
        airMaintInactive: maintEl ? maintEl.classList.contains('inactive') : false,
        tokensObj: campaignState.tokens,
        kaitenPilots: campaignState.kaitenPilots
      };
    })()`,
    returnByValue: true
  });

  const res = evalRes.result && evalRes.result.result ? evalRes.result.result.value : evalRes.result.value;
  console.log('Test Result:', res);

  ws.close();
  proc.kill();
}
testSchoolToK1();
