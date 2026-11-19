const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testAllocation() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const url = 'http://localhost:8000/index.html';
  const port = 9411;
  const userDataDir = 'c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_torp';

  fs.mkdirSync(userDataDir, { recursive: true });

  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1600,1600',
    url
  ]);

  await new Promise(r => setTimeout(r, 2500));

  const getJson = () => new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json`, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const tabs = await getJson();
  const pageTab = tabs.find(t => t.url && t.url.includes('index.html')) || tabs[0];
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const reqId = msgId++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === reqId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: reqId, method, params }));
  });

  const evalJs = async (expr) => {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result ? res.result.value : null;
  };

  console.log('Page loaded. Checking torpedo panel...');

  // 1. Initial State in Pre-42
  const initialData = await evalJs(`
    (() => {
      const panel = document.getElementById('wf-torp-allocation-panel');
      const bTotal = document.getElementById('wf-torp-budget-total')?.textContent;
      const bAssigned = document.getElementById('wf-torp-budget-assigned')?.textContent;
      const bRemaining = document.getElementById('wf-torp-budget-remaining')?.textContent;
      const fwdT = document.getElementById('wf-torp-alloc-fwd-tubes')?.value;
      const aftT = document.getElementById('wf-torp-alloc-aft-tubes')?.value;
      const fwdR = document.getElementById('wf-torp-alloc-fwd-reloads')?.value;
      const aftR = document.getElementById('wf-torp-alloc-aft-reloads')?.value;
      return {
        panelVisible: panel && panel.style.display !== 'none',
        budget: bTotal,
        assigned: bAssigned,
        remaining: bRemaining,
        fwdTubes: fwdT,
        aftTubes: aftT,
        fwdReloads: fwdR,
        aftReloads: aftR
      };
    })()
  `);
  console.log('Initial Allocation (KD3 Pre-42):', initialData);

  // 2. Test Presets
  await evalJs(`setTorpedoAllocationPreset('all-fwd')`);
  const allFwdData = await evalJs(`
    (() => ({
      fwdT: document.getElementById('wf-torp-alloc-fwd-tubes')?.value,
      aftT: document.getElementById('wf-torp-alloc-aft-tubes')?.value,
      fwdR: document.getElementById('wf-torp-alloc-fwd-reloads')?.value,
      aftR: document.getElementById('wf-torp-alloc-aft-reloads')?.value,
      assigned: document.getElementById('wf-torp-budget-assigned')?.textContent
    }))()
  `);
  console.log('Preset All-Fwd:', allFwdData);

  // 3. Test Balanced Preset
  await evalJs(`setTorpedoAllocationPreset('balanced')`);
  const balData = await evalJs(`
    (() => ({
      fwdT: document.getElementById('wf-torp-alloc-fwd-tubes')?.value,
      aftT: document.getElementById('wf-torp-alloc-aft-tubes')?.value,
      fwdR: document.getElementById('wf-torp-alloc-fwd-reloads')?.value,
      aftR: document.getElementById('wf-torp-alloc-aft-reloads')?.value,
      assigned: document.getElementById('wf-torp-budget-assigned')?.textContent
    }))()
  `);
  console.log('Preset Balanced:', balData);

  // 4. Test Manual Stepper
  await evalJs(`stepTorpedoAllocation('fwdReloads', 1)`); // attempts to add 1 reload (should be clamped or adjust)
  const stepData = await evalJs(`
    (() => ({
      fwdT: document.getElementById('wf-torp-alloc-fwd-tubes')?.value,
      aftT: document.getElementById('wf-torp-alloc-aft-tubes')?.value,
      fwdR: document.getElementById('wf-torp-alloc-fwd-reloads')?.value,
      aftR: document.getElementById('wf-torp-alloc-aft-reloads')?.value,
      remaining: document.getElementById('wf-torp-budget-remaining')?.textContent
    }))()
  `);
  console.log('After Stepping Reloads:', stepData);

  // 5. Check Submarine Board slots sync
  const boardSlots = await evalJs(`
    (() => {
      return {
        tube1: subBoardState.tubeTypes[1],
        tube6: subBoardState.tubeTypes[6],
        tube7_aft: subBoardState.tubeTypes[7],
        tube8_aft: subBoardState.tubeTypes[8],
        reload1: subBoardState.reloadTypes[1],
        reloadAft1: subBoardState.reloadTypes['aft_1']
      };
    })()
  `);
  console.log('Submarine Board synchronized slots:', boardSlots);

  // 6. Screenshot of the allocation card
  const clip = await evalJs(`
    (() => {
      const el = document.getElementById('wf-torpedo-doctrine-box');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, scale: 1 };
    })()
  `);

  if (clip) {
    const shot = await send('Page.captureScreenshot', { clip, format: 'png' });
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\torpedo_allocation_preview.png';
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to:', outPath);
  }

  ws.close();
  proc.kill();
  console.log('Verification finished successfully!');
}

testAllocation().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
