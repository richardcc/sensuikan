const http = require('http');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function run() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve('app/index.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

  const port = 9334;
  const edgeProcess = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--disable-gpu',
    '--no-sandbox',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  function getJson(urlPath) {
    return new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: urlPath }, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  const targets = await getJson('/json');
  const pageTarget = targets.find(t => t.type === 'page');
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new globalThis.WebSocket(wsUrl);
  await new Promise(r => ws.onopen = r);

  let msgId = 1;
  function sendCdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      function listener(event) {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', listener);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      }
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCdp('Runtime.enable');
  await sendCdp('Page.enable');

  // Verify Phase 0 dropdown
  const checkRes = await sendCdp('Runtime.evaluate', {
    expression: `
      (() => {
        const select = document.getElementById('wf-sub-class-select');
        const optgroups = Array.from(select.querySelectorAll('optgroup')).map(og => ({
          label: og.label,
          count: og.children.length,
          options: Array.from(og.children).map(o => o.textContent)
        }));
        
        // Also check dock buttons
        const dockBtns = Array.from(document.querySelectorAll('.sub-select-btn')).map(b => ({
          id: b.id,
          text: b.innerText.replace(/\\n/g, ' '),
          isFanmade: !!b.querySelector('.badge-sub-fanmade')
        }));

        // Switch to dock and select Type_B2_Class
        if (typeof selectSubmarine === 'function') {
          selectSubmarine('Type_B2_Class');
        }

        const subtitle = document.getElementById('sub-subtitle')?.innerText || '';
        const desc = document.getElementById('sub-desc')?.innerText || '';

        return {
          totalSubsInDB: Object.keys(SUB_DB.submarines).length,
          optgroups,
          dockBtnsCount: dockBtns.length,
          fanmadeDockBtns: dockBtns.filter(b => b.isFanmade).length,
          b2Subtitle: subtitle,
          b2Desc: desc.slice(0, 100)
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Edge Verification Data:', JSON.stringify(checkRes.result.value, null, 2));

  // Switch tab to Dock to take screenshot
  await sendCdp('Runtime.evaluate', {
    expression: `switchTab('dock');`
  });
  await new Promise(r => setTimeout(r, 600));

  const ssDock = await sendCdp('Page.captureScreenshot', { format: 'png' });
  const outDock = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\fanmade_dock_verified.png';
  fs.writeFileSync(outDock, Buffer.from(ssDock.data, 'base64'));
  console.log('Saved dock screenshot to:', outDock);

  // Switch tab to workflow (Phase 0) to take screenshot
  await sendCdp('Runtime.evaluate', {
    expression: `switchTab('workflow');`
  });
  await new Promise(r => setTimeout(r, 600));

  const ssWf = await sendCdp('Page.captureScreenshot', { format: 'png' });
  const outWf = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\fanmade_phase0_verified.png';
  fs.writeFileSync(outWf, Buffer.from(ssWf.data, 'base64'));
  console.log('Saved workflow screenshot to:', outWf);

  ws.close();
  edgeProcess.kill();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
