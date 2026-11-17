const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

async function verifyCompendium() {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    const proc = spawn(edgePath, [
        '--headless=new',
        '--remote-debugging-port=9444',
        '--user-data-dir=c:\\repos\\python\\stl\\Sensuikan\\scratch\\edge_comp_profile',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-gpu',
        '--window-size=1280,1400',
        'c:\\repos\\python\\stl\\Sensuikan\\Sensuikan_App_UltraCompact.html'
    ]);

    await new Promise(r => setTimeout(r, 2500));

    try {
        const getJson = () => new Promise((resolve, reject) => {
            http.get('http://localhost:9444/json', (res) => {
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

        await send('Page.enable');

        // Dismiss gatekeeper if present, navigate to Compendium tab, verify ES
        const evalEs = `
            (function() {
                localStorage.setItem('sensuikan_auth_state', 'granted');
                const gk = document.getElementById('gatekeeper-overlay');
                if (gk) gk.style.display = 'none';

                if (typeof switchTab === 'function') switchTab('compendium');
                if (window.currentLang !== 'es' && typeof applyLanguage === 'function') applyLanguage('es');

                const a3Title = document.getElementById('comp-a3-main-title') ? document.getElementById('comp-a3-main-title').innerText : '';
                const a3Transit = document.getElementById('comp-a3-th-transit') ? document.getElementById('comp-a3-th-transit').innerText : '';
                const a3WCoast = document.getElementById('comp-a3-th-wcoast') ? document.getElementById('comp-a3-th-wcoast').innerText : '';
                const a3FirstRowCells = Array.from(document.querySelectorAll('#table-comp-a3-body tr:first-child td')).map(td => td.innerText);

                const optTitle = document.getElementById('comp-opt-title-text') ? document.getElementById('comp-opt-title-text').innerText : '';
                const opt111H4 = document.getElementById('comp-opt-h4-111') ? document.getElementById('comp-opt-h4-111').innerText : '';
                const opt113H4 = document.getElementById('comp-opt-h4-113') ? document.getElementById('comp-opt-h4-113').innerText : '';
                const opt114H4 = document.getElementById('comp-opt-h4-114') ? document.getElementById('comp-opt-h4-114').innerText : '';
                const optThGreen = document.getElementById('comp-opt-th-green') ? document.getElementById('comp-opt-th-green').innerText : '';
                const optAbility1 = document.getElementById('comp-opt-ability-1') ? document.getElementById('comp-opt-ability-1').innerText : '';
                const optAbility3 = document.getElementById('comp-opt-ability-3') ? document.getElementById('comp-opt-ability-3').innerText : '';

                return {
                    lang: window.currentLang,
                    a3Title,
                    a3Transit,
                    a3WCoast,
                    a3FirstRowCells,
                    optTitle,
                    opt111H4,
                    opt113H4,
                    opt114H4,
                    optThGreen,
                    optAbility1,
                    optAbility3
                };
            })()
        `;

        const resEs = await send('Runtime.evaluate', { expression: evalEs, returnByValue: true });
        console.log('SPANISH STATE:\n', JSON.stringify(resEs.result.result ? resEs.result.result.value : resEs, null, 2));

        // Scroll to Chart A3 and take screenshot ES
        await send('Runtime.evaluate', { expression: `document.getElementById('comp-a3-main-title').scrollIntoView();` });
        await new Promise(r => setTimeout(r, 600));
        const shotA3Es = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/compendium_a3_es.png', Buffer.from(shotA3Es.result.data, 'base64'));

        // Scroll to Section 8 and take screenshot ES
        await send('Runtime.evaluate', { expression: `document.getElementById('comp-sec-optional').scrollIntoView();` });
        await new Promise(r => setTimeout(r, 600));
        const shotOptEs = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/compendium_section8_es.png', Buffer.from(shotOptEs.result.data, 'base64'));

        // Now toggle to English
        const evalEn = `
            (function() {
                if (typeof applyLanguage === 'function') applyLanguage('en');

                const a3Title = document.getElementById('comp-a3-main-title') ? document.getElementById('comp-a3-main-title').innerText : '';
                const a3Transit = document.getElementById('comp-a3-th-transit') ? document.getElementById('comp-a3-th-transit').innerText : '';
                const a3WCoast = document.getElementById('comp-a3-th-wcoast') ? document.getElementById('comp-a3-th-wcoast').innerText : '';
                const a3FirstRowCells = Array.from(document.querySelectorAll('#table-comp-a3-body tr:first-child td')).map(td => td.innerText);

                const optTitle = document.getElementById('comp-opt-title-text') ? document.getElementById('comp-opt-title-text').innerText : '';
                const opt111H4 = document.getElementById('comp-opt-h4-111') ? document.getElementById('comp-opt-h4-111').innerText : '';
                const opt113H4 = document.getElementById('comp-opt-h4-113') ? document.getElementById('comp-opt-h4-113').innerText : '';
                const opt114H4 = document.getElementById('comp-opt-h4-114') ? document.getElementById('comp-opt-h4-114').innerText : '';
                const optThGreen = document.getElementById('comp-opt-th-green') ? document.getElementById('comp-opt-th-green').innerText : '';
                const optAbility1 = document.getElementById('comp-opt-ability-1') ? document.getElementById('comp-opt-ability-1').innerText : '';
                const optAbility3 = document.getElementById('comp-opt-ability-3') ? document.getElementById('comp-opt-ability-3').innerText : '';

                return {
                    lang: window.currentLang,
                    a3Title,
                    a3Transit,
                    a3WCoast,
                    a3FirstRowCells,
                    optTitle,
                    opt111H4,
                    opt113H4,
                    opt114H4,
                    optThGreen,
                    optAbility1,
                    optAbility3
                };
            })()
        `;

        const resEn = await send('Runtime.evaluate', { expression: evalEn, returnByValue: true });
        console.log('ENGLISH STATE:\n', JSON.stringify(resEn.result.result ? resEn.result.result.value : resEn, null, 2));

        // Scroll to Chart A3 and take screenshot EN
        await send('Runtime.evaluate', { expression: `document.getElementById('comp-a3-main-title').scrollIntoView();` });
        await new Promise(r => setTimeout(r, 600));
        const shotA3En = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/compendium_a3_en.png', Buffer.from(shotA3En.result.data, 'base64'));

        // Scroll to Section 8 and take screenshot EN
        await send('Runtime.evaluate', { expression: `document.getElementById('comp-sec-optional').scrollIntoView();` });
        await new Promise(r => setTimeout(r, 600));
        const shotOptEn = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync('C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/compendium_section8_en.png', Buffer.from(shotOptEn.result.data, 'base64'));

        ws.close();
        console.log('Verification completed successfully! All screenshots saved.');
    } finally {
        proc.kill();
    }
}

verifyCompendium().catch(console.error);
