const http = require('http');
const fs = require('fs');

function getWsUrl() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page');
          if (page && page.webSocketDebuggerUrl) {
            resolve(page.webSocketDebuggerUrl);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const wsUrl = await getWsUrl();
  if (!wsUrl) {
    console.log("No CDP active, skipping browser visual check.");
    return;
  }
  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);

  ws.on('open', async () => {
    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (data) => {
          const res = JSON.parse(data);
          if (res.id === msgId) {
            ws.removeListener('message', handler);
            resolve(res.result);
          }
        };
        ws.on('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    console.log("Navigating to app...");
    await send('Page.navigate', { url: 'http://localhost:8000/app/index.html' });
    await new Promise(r => setTimeout(r, 1500));

    console.log("Activating Phase 4...");
    await send('Runtime.evaluate', { expression: `
      if (typeof switchTab === 'function') switchTab('workflow');
      if (typeof setWorkflowPhase === 'function') setWorkflowPhase(4);
      if (typeof rollB7CrewInjury === 'function') rollB7CrewInjury(8, 3);
    `});
    await new Promise(r => setTimeout(r, 600));

    const evalRes = await send('Runtime.evaluate', { expression: `
      document.getElementById('wf-b7-crew-res')?.innerHTML
    `});
    console.log("Rendered #wf-b7-crew-res HTML snippet:\n", evalRes.result?.value?.substring(0, 300));

    const snap = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    if (snap && snap.data) {
      fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/3fd05165-b487-4b4e-a070-ebf400d9cb87/scratch/phase4_tables_verified.jpg', Buffer.from(snap.data, 'base64'));
      console.log("Screenshot saved to scratch/phase4_tables_verified.jpg");
    }

    ws.close();
  });
}

run();
