const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function testSubmarineDescriptions() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const proc = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9337',
        '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_desc_profile',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-gpu',
        '--window-size=1280,1000',
        'c:\\repos\\python\\stl\\Sensuikan\\Sensuikan_App_UltraCompact.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    try {
        const getJson = () => new Promise((resolve, reject) => {
            http.get('http://localhost:9337/json', (res) => {
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
                // Ensure gate is cleared
                localStorage.setItem('sensuikan_auth_state', 'granted');
                const gate = document.getElementById('security-login-gate');
                if (gate) gate.style.display = 'none';

                // Switch to dock tab
                if (typeof switchTab === 'function') switchTab('dock');

                // 1. In default Spanish, select KD7
                if (typeof setLanguage === 'function') setLanguage('es');
                if (typeof selectSubmarine === 'function') selectSubmarine('Kaidai_KD7_Class');
                const kd7_es = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                // Select Type B in ES
                selectSubmarine('Type_B_Class');
                const typeB_es = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                // Select Sen-Toku in ES
                selectSubmarine('Sen_Toku_Class');
                const senToku_es = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                // 2. Switch to English
                toggleLanguage();
                const kd7_en_toggle = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                // Re-select KD7 in EN
                selectSubmarine('Kaidai_KD7_Class');
                const kd7_en = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                // 3. Switch back to ES
                toggleLanguage();
                const kd7_es_toggle = document.getElementById('sub-desc') ? document.getElementById('sub-desc').innerText : '';

                return {
                    kd7_es,
                    typeB_es,
                    senToku_es,
                    kd7_en,
                    kd7_en_toggle,
                    kd7_es_toggle
                };
            })()
        `;

        const evalRes = await send('Runtime.evaluate', {
            expression: codeToEval,
            returnByValue: true
        });

        console.log('EVAL RAW:', JSON.stringify(evalRes, null, 2));


        // Take screenshot of the dock with KD7 in Spanish
        await send('Runtime.evaluate', {
            expression: `(function(){ selectSubmarine('Kaidai_KD7_Class'); })()`
        });
        await new Promise(r => setTimeout(r, 500));

        const scr = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:\\Users\\Richard\\.gemini\\antigravity\\brain\\c08a1950-d03a-4ae3-aef2-f14946ddab17\\dock_sub_desc_spanish.png', Buffer.from(scr.result.data, 'base64'));
        console.log('Screenshot saved to dock_sub_desc_spanish.png');

        ws.close();
    } finally {
        proc.kill();
    }
}

testSubmarineDescriptions().catch(err => {
    console.error('Test error:', err);
    process.exit(1);
});
