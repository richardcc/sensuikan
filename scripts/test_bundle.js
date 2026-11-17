const { execSync, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Test if Edge is available for headless execution
const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];
let edgePath = edgePaths.find(p => fs.existsSync(p));

if (!edgePath) {
  console.log("Edge not found at standard paths, checking chrome...");
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (fs.existsSync(chromePath)) edgePath = chromePath;
}

if (!edgePath) {
  console.error("Neither Edge nor Chrome found for headless test.");
  process.exit(1);
}

console.log("Using browser at:", edgePath);

// Start a tiny local HTTP server
const PORT = 8991;
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
});

server.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);

  // Launch browser with remote debugging
  const browserProc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    `http://localhost:${PORT}`
  ]);

  // Give browser a moment to start
  setTimeout(async () => {
    try {
      const fetch = (await import('node-fetch')).default || globalThis.fetch;
      
      // Fetch CDP targets
      const targetsRes = await fetch('http://127.0.0.1:9222/json');
      const targets = await targetsRes.json();
      console.log("CDP Targets count:", targets.length);

      const pageTarget = targets.find(t => t.type === 'page');
      if (!pageTarget) {
        throw new Error("No page target found");
      }

      const WebSocket = (await import('ws')).default;
      const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

      ws.on('open', () => {
        console.log("Connected to WebSocket CDP");
        let id = 1;

        function send(method, params = {}) {
          return new Promise(resolve => {
            const currentId = id++;
            const handler = (msg) => {
              const res = JSON.parse(msg);
              if (res.id === currentId) {
                ws.off('message', handler);
                resolve(res.result);
              }
            };
            ws.on('message', handler);
            ws.send(JSON.stringify({ id: currentId, method, params }));
          });
        }

        async function runTests() {
          await send('Console.enable');
          await send('Runtime.enable');

          // Evaluate language toggle and UI checks
          const evalRes = await send('Runtime.evaluate', {
            expression: `
              (function() {
                const results = {};
                
                // 1. Initial language check
                results.initialLang = window.currentLang;
                results.initialLabel = document.getElementById('lang-label') ? document.getElementById('lang-label').innerText : null;
                results.initialP1Btn = document.getElementById('p1-btn-next') ? document.getElementById('p1-btn-next').innerText : null;

                // 2. Toggle to EN
                toggleLanguage();
                results.toggledLang = window.currentLang;
                results.toggledLabel = document.getElementById('lang-label') ? document.getElementById('lang-label').innerText : null;
                results.toggledP1Btn = document.getElementById('p1-btn-next') ? document.getElementById('p1-btn-next').innerText : null;
                results.toggledStep0 = document.getElementById('lbl-step0') ? document.getElementById('lbl-step0').innerText : null;
                results.toggledStepCombat = document.getElementById('lbl-step3') ? document.getElementById('lbl-step3').innerText : null;

                // Check Compendium Filter button
                const allFilter = document.querySelector('.comp-filter-btn[data-filter=\"all\"]');
                results.toggledCompAll = allFilter ? allFilter.innerText : null;

                const floatFilter = document.querySelector('.comp-filter-btn[data-filter=\"floatplane\"]');
                results.toggledCompFloat = floatFilter ? floatFilter.innerText : null;

                // 3. Toggle back to ES
                toggleLanguage();
                results.restoredLang = window.currentLang;
                results.restoredLabel = document.getElementById('lang-label') ? document.getElementById('lang-label').innerText : null;
                results.restoredP1Btn = document.getElementById('p1-btn-next') ? document.getElementById('p1-btn-next').innerText : null;
                results.restoredCompAll = allFilter ? allFilter.innerText : null;

                return results;
              })()
            `,
            returnByValue: true
          });

          console.log("Evaluation Results:", JSON.stringify(evalRes, null, 2));

          ws.close();
          browserProc.kill();
          server.close();
          process.exit(0);
        }

        runTests().catch(err => {
          console.error("Test error:", err);
          ws.close();
          browserProc.kill();
          server.close();
          process.exit(1);
        });
      });

    } catch (e) {
      console.error("CDP setup error:", e);
      browserProc.kill();
      server.close();
      process.exit(1);
    }
  }, 2500);
});
