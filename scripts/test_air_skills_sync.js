const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

async function testAirSkillsSync() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const htmlPath = path.resolve(__dirname, '..', 'app', 'index.html');
  const port = 9544;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_skills_prof',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-sync',
    '--disable-features=msFirstRunExperience,msEdgeSync',
    '--disable-gpu',
    '--window-size=1600,1050',
    `file://${htmlPath}`
  ]);

  await new Promise(r => setTimeout(r, 2500));

  try {
    const targets = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.url.includes('index.html')) || targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target found');

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    await new Promise(r => setTimeout(r, 1000));

    // Remove security gate & clear any skills to simulate 0 skills
    await send('Runtime.evaluate', {
      expression: `(() => {
        const gate = document.getElementById('security-login-gate');
        if (gate) gate.remove();
        window.campaignState.school.f3Skills = [];
        window.campaignState.aircraftState = null;
        if (typeof syncSchoolSkillsToAircraftState === 'function') syncSchoolSkillsToAircraftState();
      })()`
    });

    // Open Aircraft Display Mat modal with 0 skills
    await send('Runtime.evaluate', { expression: `openAircraftDisplayMatModal();` });
    await new Promise(r => setTimeout(r, 500));

    // Scroll inspector down
    await send('Runtime.evaluate', {
      expression: `document.getElementById('air-mat-col-inspector').scrollTop = 380;`
    });
    await new Promise(r => setTimeout(r, 200));

    const checkZeroSkills = await send('Runtime.evaluate', {
      expression: `(() => {
        const wep = document.getElementById('air-skill-token-weapons')?.querySelector('img')?.style.opacity;
        const mnt = document.getElementById('air-skill-token-maintenance')?.querySelector('img')?.style.opacity;
        const acm = document.getElementById('air-skill-token-acm')?.querySelector('img')?.style.opacity;
        const nav = document.getElementById('air-skill-token-nav')?.querySelector('img')?.style.opacity;
        return {
          f3Skills: window.campaignState.school.f3Skills,
          wepOpacity: wep,
          mntOpacity: mnt,
          acmOpacity: acm,
          navOpacity: nav
        };
      })()`,
      returnByValue: true
    });
    console.log('TEST 1 (0 skills):', checkZeroSkills.result.value);

    // Take screenshot of 0 skills
    const snapZero = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'verified_air_skills_zero.png'), Buffer.from(snapZero.data, 'base64'));

    // TEST 2: Add 2 skills via handleAirSkillClick ('acm' and 'nav')
    await send('Runtime.evaluate', {
      expression: `(() => {
        window.handleAirSkillClick('acm');
        window.handleAirSkillClick('nav');
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Scroll inspector down again
    await send('Runtime.evaluate', {
      expression: `document.getElementById('air-mat-col-inspector').scrollTop = 380;`
    });
    await new Promise(r => setTimeout(r, 200));

    const checkTwoSkills = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          f3Skills: window.campaignState.school.f3Skills,
          chkAcm: document.getElementById('chk-f3-acm')?.checked,
          chkNav: document.getElementById('chk-f3-nav')?.checked,
          chkWep: document.getElementById('chk-f3-weap')?.checked
        };
      })()`,
      returnByValue: true
    });
    console.log('TEST 2 (Added ACM & Nav):', checkTwoSkills.result.value);

    // Take screenshot with ACM & Nav active
    const snapTwo = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.resolve('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17', 'verified_air_skills_acm_nav.png'), Buffer.from(snapTwo.data, 'base64'));

    // TEST 3: Try to add a 3rd skill (weapons) -> must be blocked by rule 4.8.3 (max 2)
    await send('Runtime.evaluate', {
      expression: `window.handleAirSkillClick('weapons');`
    });
    await new Promise(r => setTimeout(r, 300));

    const checkMaxTwo = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          f3Skills: window.campaignState.school.f3Skills,
          len: window.campaignState.school.f3Skills.length
        };
      })()`,
      returnByValue: true
    });
    console.log('TEST 3 (Attempt 3rd skill blocked):', checkMaxTwo.result.value);

    // TEST 4: Toggle off ACM
    await send('Runtime.evaluate', {
      expression: `window.handleAirSkillClick('acm');`
    });
    await new Promise(r => setTimeout(r, 300));

    const checkToggleOff = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          f3Skills: window.campaignState.school.f3Skills,
          chkAcm: document.getElementById('chk-f3-acm')?.checked
        };
      })()`,
      returnByValue: true
    });
    console.log('TEST 4 (Toggled off ACM):', checkToggleOff.result.value);

    ws.close();
  } finally {
    proc.kill();
  }
}

testAirSkillsSync().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
