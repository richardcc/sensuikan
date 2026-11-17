const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function runComprehensiveVerification() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const proc = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9343',
        '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_full_profile',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-gpu',
        '--window-size=1280,1024',
        'file:///c:/repos/python/stl/Sensuikan/Sensuikan_App_UltraCompact.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    try {
        const getJson = () => new Promise((resolve, reject) => {
            http.get('http://localhost:9343/json', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });

        const tabs = await getJson();
        const targetTab = tabs.find(t => t.url && t.url.includes('Sensuikan'));
        if (!targetTab) throw new Error('Sensuikan tab not found');

        const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
        await new Promise(r => ws.onopen = r);

        let id = 1;
        const send = (method, params = {}) => new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout ' + method)), 6000);
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

        const errors = [];
        ws.addEventListener('message', (evt) => {
            const msg = JSON.parse(evt.data);
            if (msg.method === 'Runtime.exceptionThrown') {
                errors.push(msg.params.exceptionDetails);
            }
        });
        await send('Runtime.enable');

        const testScript = `
            (function() {
                localStorage.setItem('sensuikan_auth_state', 'granted');
                const gate = document.getElementById('security-login-gate');
                if (gate) gate.style.display = 'none';

                // Check computed font sizes
                const tabBtn = document.querySelector('.tab-btn');
                const actionBtn = document.querySelector('.action-btn');
                const langBtn = document.getElementById('lang-toggle-btn');
                
                // Switch to dock tab
                switchTab('dock');
                selectSubmarine('Kaidai_KD7_Class');
                const subDesc = document.getElementById('sub-desc');
                const specCardLbl = document.querySelector('.spec-card .lbl') || document.getElementById('lbl-dock-disp');
                const patrolTitle = document.getElementById('lbl-dock-patrol-title');

                // Check tracks rendering
                const patrolBoxes = document.querySelectorAll('#sub-mat-patrol-track-row > div');
                const floodBoxes = document.querySelectorAll('#sub-mat-damage-track-row img');

                // Test toggle language
                toggleLanguage(); // to EN
                const subDescEN = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';
                toggleLanguage(); // back to ES
                const subDescES = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                // Switch to workflow tab
                switchTab('workflow');
                const wfStep = document.querySelector('.step-item');

                return {
                    tabBtnFontSize: tabBtn ? window.getComputedStyle(tabBtn).fontSize : null,
                    actionBtnFontSize: actionBtn ? window.getComputedStyle(actionBtn).fontSize : null,
                    langBtnFontSize: langBtn ? window.getComputedStyle(langBtn).fontSize : null,
                    subDescFontSize: subDesc ? window.getComputedStyle(subDesc).fontSize : null,
                    specCardLblFontSize: specCardLbl ? window.getComputedStyle(specCardLbl).fontSize : null,
                    patrolTitleFontSize: patrolTitle ? window.getComputedStyle(patrolTitle).fontSize : null,
                    wfStepFontSize: wfStep ? window.getComputedStyle(wfStep).fontSize : null,
                    patrolBoxesCount: patrolBoxes.length,
                    floodBoxesCount: floodBoxes.length,
                    subDescEN: subDescEN.slice(0, 50),
                    subDescES: subDescES.slice(0, 50)
                };
            })()
        `;

        const evalRes = await send('Runtime.evaluate', {
            expression: testScript,
            returnByValue: true
        });

        const testResults = evalRes.result?.result?.value;
        console.log('COMPREHENSIVE TEST RESULTS:\n', JSON.stringify(testResults, null, 2));

        // Screenshot 1: Dock Tab with Submarines & Tracks
        await send('Runtime.evaluate', {
            expression: `(function(){ switchTab('dock'); selectSubmarine('Kaidai_KD7_Class'); })()`
        });
        await new Promise(r => setTimeout(r, 600));

        const scrDock = await send('Page.captureScreenshot', { format: 'png' });
        const dockPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\dock_boosted_typography.png';
        fs.writeFileSync(dockPath, Buffer.from(scrDock.result.data, 'base64'));
        console.log('Saved screenshot to:', dockPath);

        // Screenshot 2: Workflow Tab with Phase 2 Navigation
        await send('Runtime.evaluate', {
            expression: `(function(){ switchTab('workflow'); if (typeof jumpToPhase === 'function') jumpToPhase(2); })()`
        });
        await new Promise(r => setTimeout(r, 600));

        const scrWf = await send('Page.captureScreenshot', { format: 'png' });
        const wfPath = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\workflow_boosted_typography.png';
        fs.writeFileSync(wfPath, Buffer.from(scrWf.result.data, 'base64'));
        console.log('Saved screenshot to:', wfPath);

        // Screenshot 3: Chart K1 Skills Tab
        await send('Runtime.evaluate', {
            expression: `(function(){ switchTab('chart-k1'); })()`
        });
        await new Promise(r => setTimeout(r, 600));

        const scrK1 = await send('Page.captureScreenshot', { format: 'png' });
        const k1Path = 'C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\chart_k1_boosted_typography.png';
        fs.writeFileSync(k1Path, Buffer.from(scrK1.result.data, 'base64'));
        console.log('Saved screenshot to:', k1Path);

        console.log('Console Errors count on page:', errors.length);
        if (errors.length > 0) {
            console.error('Page errors:', errors);
        }

        ws.close();
    } finally {
        proc.kill();
    }
}

runComprehensiveVerification().catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
});
