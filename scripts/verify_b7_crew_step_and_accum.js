const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function runTest() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'Sensuikan_App_UltraCompact.html');
  const port = 9399;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_verify_b7_accum',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--window-size=1450,1100',
    `file:///${htmlPath.replace(/\\/g, '/')}`
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
    const pageTab = tabs.find(t => t.url && t.url.includes('Sensuikan'));
    if (!pageTab) throw new Error('Sensuikan tab not found');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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

    await send('Runtime.enable');

    console.log('--- 1. Testing Step 1: Roll Station (2d6) Only ---');
    const step1Res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          if (typeof changeBoardSubmarine === 'function') changeBoardSubmarine('Type_B_Class');
          // Reset capt to active
          subBoardState.crew['capt'] = 'active';
          
          // Roll Station only: Comandante (sum=2)
          rollPatrolAirCrewPosOnly(2);

          const captStatus = subBoardState.crew['capt'];
          const resElText = document.getElementById('ppatrol-air-crew-res')?.innerText;
          const posVal = document.getElementById('ppatrol-sel-air-crew-pos')?.value;

          return {
            captStatus, // Should remain 'active' (not modified yet!)
            posVal,
            hasPromptForStep2: resElText.includes('Paso 2')
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Step 1 evaluation:', step1Res.result?.result?.value);

    console.log('--- 2. Testing Step 2: Roll Severity (1d6) -> First Light Wound ---');
    const step2Res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Roll Severity: 1d6 = 2 (LW)
          rollPatrolAirCrewSevOnly(2);
          return {
            captStatus: subBoardState.crew['capt'], // Should be 'wounded'
            resText: document.getElementById('ppatrol-air-crew-res')?.innerText
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Step 2 evaluation (First LW):', step2Res.result?.result?.value);

    console.log('--- 3. Testing Accumulation: Second Light Wound on same crew member (2x HL = HG / SW) ---');
    const accumRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Step 1 again on Captain
          rollPatrolAirCrewPosOnly(2);
          // Step 2 again with LW (1d6 = 3)
          rollPatrolAirCrewSevOnly(3);
          return {
            captStatus: subBoardState.crew['capt'], // Should escalate to 'serious'!
            resHtml: document.getElementById('ppatrol-air-crew-res')?.innerHTML
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Accumulation evaluation (2x LW -> SW):', {
      captStatus: accumRes.result?.result?.value?.captStatus,
      hasAccumWarning: accumRes.result?.result?.value?.resHtml?.includes('Acumulativa')
    });

    console.log('--- 4. Testing Further Accumulation (SW + LW -> KIA) ---');
    const accumKiaRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Step 1 on Captain
          rollPatrolAirCrewPosOnly(2);
          // Step 2 with another LW
          rollPatrolAirCrewSevOnly(1);
          return {
            captStatus: subBoardState.crew['capt'] // Should escalate to 'kia'!
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Accumulation to KIA evaluation:', accumKiaRes.result?.result?.value);

    // Capture screenshot of the 4A.1 panel
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Roll a fresh clean casualty for visual screenshot
          rollPatrolAirCrewPosOnly(6); // Generic crew 1
          rollPatrolAirCrewSevOnly(4); // Serious wound
          const el = document.getElementById('ppatrol-air-attack-panel');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
        })()
      `
    });

    await new Promise(r => setTimeout(r, 600));

    const ss = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\b7_crew_2step_and_accum_verified.png';
    fs.writeFileSync(outPath, Buffer.from(ss.result.data, 'base64'));
    console.log(`Saved screenshot to: ${outPath}`);

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    proc.kill();
  }
}

runTest();
