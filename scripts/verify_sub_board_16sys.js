const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const url = 'http://localhost:8000/index.html';
  const port = 9399;
  const userDataDir = 'c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_prof';

  fs.mkdirSync(userDataDir, { recursive: true });

  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1600,1200',
    url
  ]);

  await new Promise(r => setTimeout(r, 2000));

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
  await new Promise(r => setTimeout(r, 1000));

  // Bypass gate & Switch to sub-board tab
  console.log("Unlocking gate & switching to Sub Board...");
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const u = document.getElementById('gate-user-input');
        const p = document.getElementById('gate-pwd-input');
        if (u) u.value = 'admin';
        if (p) p.value = 'sensuikan';
        if (typeof executeLoginGate === 'function') executeLoginGate();
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        
        if (typeof switchTab === 'function') switchTab('sub-board');
        
        // Select Kaidai KD3
        const sel = document.getElementById('board-sub-select');
        if (sel) {
          sel.value = 'Kaidai_KD3_Class';
          sel.dispatchEvent(new Event('change'));
        }
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1500));

  // Inspect system slots
  const inspectRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const slots = Array.from(document.querySelectorAll('[id^="slot-sys-"]'));
        return {
          totalSlots: slots.length,
          slotsInfo: slots.map(s => ({
            id: s.id,
            pointerEvents: s.style.pointerEvents,
            title: s.title,
            innerHtml: s.innerHTML.substring(0, 50)
          }))
        };
      })()
    `,
    returnByValue: true
  });
  console.log("Total system slots found:", inspectRes.result?.value?.totalSlots);
  const activeSlots = (inspectRes.result?.value?.slotsInfo || []).filter(s => s.pointerEvents !== 'none');
  console.log("Active system slots on Kaidai KD3:", activeSlots.length);
  activeSlots.forEach(s => console.log(`  ${s.id}: ${s.title}`));

  // Click on slot-sys-0, slot-sys-1 (twice), slot-sys-7
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const s0 = document.getElementById('slot-sys-0'); // F. Torp Doors Odd
        if (s0) s0.click();
        const s1 = document.getElementById('slot-sys-1'); // F. Torp Doors Even
        if (s1) { s1.click(); s1.click(); }
        const s7 = document.getElementById('slot-sys-7'); // Diesel 1
        if (s7) s7.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 800));

  // Scroll to sub-board container and screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\0975d495-1000-4c1e-ba39-9c738d974976\\verified_sub_board_16sys_kd3.png';
  fs.writeFileSync(outPath, Buffer.from(screenshot.result.data, 'base64'));
  console.log("Kaidai KD3 screenshot saved:", outPath);

  // Switch to Sen Toku Class (has 16 active systems including 4 diesels, crane, hangar, radar)
  console.log("Switching to Sen Toku Class...");
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const sel = document.getElementById('board-sub-select');
        if (sel) {
          sel.value = 'Sen_Toku_Class';
          sel.dispatchEvent(new Event('change'));
        }
      })()
    `
  });
  await new Promise(r => setTimeout(r, 1200));

  const inspectSenToku = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const slots = Array.from(document.querySelectorAll('[id^="slot-sys-"]'));
        const active = slots.filter(s => s.style.pointerEvents !== 'none');
        return {
          total: slots.length,
          activeCount: active.length,
          activeList: active.map(s => ({ id: s.id, title: s.title }))
        };
      })()
    `,
    returnByValue: true
  });
  console.log("Sen Toku Active System Slots:", inspectSenToku.result?.value?.activeCount);
  (inspectSenToku.result?.value?.activeList || []).forEach(s => console.log(`  ${s.id}: ${s.title}`));

  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  const outPath2 = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\0975d495-1000-4c1e-ba39-9c738d974976\\verified_sub_board_16sys_sentoku.png';
  fs.writeFileSync(outPath2, Buffer.from(ss2.result.data, 'base64'));
  console.log("Sen Toku screenshot saved:", outPath2);

  await send('Browser.close').catch(() => {});
  proc.kill();
  process.exit(0);
}

run().catch(err => {
  console.error("Verification error:", err);
  process.exit(1);
});
