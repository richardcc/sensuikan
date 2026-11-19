const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = 'C:/repos/python/stl/Sensuikan/Sensuikan_App_UltraCompact.html';
const port = 9399;
const proc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=' + port,
  '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_air_b7_view2',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu',
  '--window-size=1400,1100',
  'file:///' + htmlPath
]);

setTimeout(async () => {
  const getJson = () => new Promise(res => http.get('http://localhost:' + port + '/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const tabs = await getJson();
  const pageTab = tabs.find(t => t.url && t.url.toLowerCase().includes('sensuikan'));
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === reqId) {
        ws.removeEventListener('message', handler);
        resolve(msg);
      }
    };
    const reqId = id++;
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });
  await send('Runtime.enable');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        setWorkflowPhase('patrol');
        // Roll Station only: Comandante
        rollPatrolAirCrewPosOnly(2);
        // Roll Severity only: 1d6 = 2 (HL)
        rollPatrolAirCrewSevOnly(2);
        const el = document.getElementById('ppatrol-air-attack-panel');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `
  });
  await new Promise(r => setTimeout(r, 600));
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\air_crew_b7_steps_verified.png';
  fs.writeFileSync(outPath, Buffer.from(ss.result.data, 'base64'));
  console.log('Saved screenshot successfully to:', outPath);
  proc.kill();
  process.exit(0);
}, 2000);
