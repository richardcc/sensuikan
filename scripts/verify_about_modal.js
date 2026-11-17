const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testAboutModal() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_Tablet_Offline.html');
  const port = 9395;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_about_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1280,1024',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const getJson = () => new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const tabs = await getJson();
    const pageTab = tabs[0];
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

    // Open About Modal
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        openAboutModal();
      })()`
    });

    await new Promise(r => setTimeout(r, 600));

    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.getElementById('modal-about');
        const text = modal ? modal.innerText : '';
        const matches = text.match(/Fan[- ]made/gi) || [];
        const copyrightCount = (text.match(/©\s*Sensuikan Companion/gi) || []).length;
        return {
          matchesCount: matches.length,
          copyrightCount,
          modalVisible: modal && modal.style.display !== 'none'
        };
      })()`,
      returnByValue: true
    });

    const checkVal = check.result && check.result.result ? check.result.result.value : (check.result ? check.result.value : check);
    console.log('About Modal Check:', checkVal);

    // Capture screenshot of bottom of modal-about dialog
    const clipInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const modalBox = document.querySelector('#modal-about > div');
        const r = modalBox.getBoundingClientRect();
        // Capture bottom 200px of the modal box
        return {
          x: r.x,
          y: r.y + r.height - 200,
          width: r.width,
          height: 200
        };
      })()`,
      returnByValue: true
    });

    const clip = clipInfo.result && clipInfo.result.result ? clipInfo.result.result.value : clipInfo.result.value;
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: clip.x,
        y: clip.y,
        width: clip.width,
        height: clip.height,
        scale: 1
      }
    });

    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\about_modal_fixed.png';
    fs.writeFileSync(outPath, Buffer.from(screenshot.result.data, 'base64'));
    console.log('Saved about modal screenshot to:', outPath);

    ws.close();
    proc.kill();
  } catch (err) {
    console.error('Error:', err);
    proc.kill();
    process.exit(1);
  }
}

testAboutModal();
