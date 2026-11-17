const { spawn } = require('child_process');
const http = require('http');

async function testLanguageSwitch() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const proc = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9333',
        '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_torp_profile',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-gpu',
        '--window-size=1280,1200',
        'c:\\repos\\python\\stl\\Sensuikan\\Sensuikan_App_UltraCompact.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    try {
        const getJson = () => new Promise((resolve, reject) => {
            http.get('http://localhost:9333/json', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            }).on('error', reject);
        });

        const tabs = await getJson();
        const pageTab = tabs.find(t => (t.url && t.url.includes('Sensuikan')) || (t.title && t.title.includes('Sensuikan'))) || tabs[0];
        const wsUrl = pageTab.webSocketDebuggerUrl;

        const ws = new WebSocket(wsUrl);
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

        const codeToEval = `
            (function() {
                localStorage.setItem('sensuikan_auth_state', 'granted');
                const before = {
                    langLabel: document.getElementById('lang-label').innerText,
                    navWorkflow: document.getElementById('tab-nav-workflow').innerText,
                    navDock: document.getElementById('tab-nav-dock').innerText,
                    p1Title: document.getElementById('p1-title') ? document.getElementById('p1-title').innerText : '',
                    p1BtnNext: document.getElementById('p1-btn-next') ? document.getElementById('p1-btn-next').innerText : '',
                    wfSchoolTitle: document.querySelector('#wf-phase-school h4') ? document.querySelector('#wf-phase-school h4').innerText : '',
                    phase2Title: document.querySelector('#wf-phase-2 h3') ? document.querySelector('#wf-phase-2 h3').innerText : '',
                    phase3Title: document.querySelector('#wf-phase-3 h3') ? document.querySelector('#wf-phase-3 h3').innerText : '',
                    compFilterPatrol: document.querySelector('.comp-filter-btn[data-filter="patrol"]') ? document.querySelector('.comp-filter-btn[data-filter="patrol"]').innerText : ''
                };
                
                toggleLanguage();
                
                const after = {
                    langLabel: document.getElementById('lang-label').innerText,
                    navWorkflow: document.getElementById('tab-nav-workflow').innerText,
                    navDock: document.getElementById('tab-nav-dock').innerText,
                    p1Title: document.getElementById('p1-title') ? document.getElementById('p1-title').innerText : '',
                    p1BtnNext: document.getElementById('p1-btn-next') ? document.getElementById('p1-btn-next').innerText : '',
                    wfSchoolTitle: document.querySelector('#wf-phase-school h4') ? document.querySelector('#wf-phase-school h4').innerText : '',
                    phase2Title: document.querySelector('#wf-phase-2 h3') ? document.querySelector('#wf-phase-2 h3').innerText : '',
                    phase3Title: document.querySelector('#wf-phase-3 h3') ? document.querySelector('#wf-phase-3 h3').innerText : '',
                    compFilterPatrol: document.querySelector('.comp-filter-btn[data-filter="patrol"]') ? document.querySelector('.comp-filter-btn[data-filter="patrol"]').innerText : ''
                };

                return { before, after, currentLang: window.currentLang };
            })()
        `;

        const res = await send('Runtime.evaluate', { expression: codeToEval, returnByValue: true });
        console.log('Test Result:\n', JSON.stringify(res.result ? res.result.result : res, null, 2));

        ws.close();
    } finally {
        proc.kill();
    }
}

testLanguageSwitch().catch(console.error);
