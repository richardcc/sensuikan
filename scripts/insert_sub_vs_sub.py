# -*- coding: utf-8 -*-
p = 'app/partials/02_tab_workflow.html'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

bad = '''              <!-- Rule 8.2.9: Submarine vs Submarine Special Procedure -->
              <div id="wf-sub-vs-sub-card" style="display:none; background:rgba(239,68,68,0.12); border:1px solid #ef4444; border-radius:6px; padding:8px 10px; margin-bottom:8px;">
                <div style="font-weight:bold; color:#fca5a5; font-size:0.80rem; display:flex; align-items:center; gap:6px;">
                  <span>⚡</span> <span>REGLA [8.2.9]: COMBATE SUBMARINO VS SUBMARINO</span>
                </div>
                <p style="font-size:0.74rem; color:#cbd5e1; margin:4px 0 6px 0; line-height:1.35;">
                  Tira 1d10 para iniciativa: <strong>1–3:</strong> Iniciativa tuya (ataca o evita contacto). <strong>4–10:</strong> ¡El submarino enemigo ataca primero con 4 torpedos a media distancia! <em>(Cañón prohibido).</em>
                </p>
                <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
                  <button type="button" class="btn-dice" onclick="rollSubVsSubInitiative()" style="font-size:0.76rem; padding:3px 8px;">🎲 Tirar 1d10</button>
                  <button type="button" class="btn-xs" onclick="setSubVsSubInitiative(true)" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px 6px; font-size:0.72rem; cursor:pointer;" title="1-3 en mesa">✅ Iniciativa IJN</button>
                  <button type="button" class="btn-xs" onclick="setSubVsSubInitiative(false)" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px 6px; font-size:0.72rem; cursor:pointer;" title="4-10 en mesa">⚠️ Sorpresa Enemiga</button>
                </div>
                <div id="wf-sub-initiative-res" style="font-size:0.76rem; font-weight:bold; margin-top:4px;"></div>
              </div>
              </div>'''

good = '''              </div>

              <!-- Rule 8.2.9: Submarine vs Submarine Special Procedure -->
              <div id="wf-sub-vs-sub-card" style="display:none; background:rgba(239,68,68,0.12); border:1px solid #ef4444; border-radius:6px; padding:8px 10px; margin-bottom:8px;">
                <div style="font-weight:bold; color:#fca5a5; font-size:0.80rem; display:flex; align-items:center; gap:6px;">
                  <span>⚡</span> <span>REGLA [8.2.9]: COMBATE SUBMARINO VS SUBMARINO</span>
                </div>
                <p style="font-size:0.74rem; color:#cbd5e1; margin:4px 0 6px 0; line-height:1.35;">
                  Tira 1d10 para iniciativa: <strong>1–3:</strong> Iniciativa tuya (ataca o evita contacto). <strong>4–10:</strong> ¡El submarino enemigo ataca primero con 4 torpedos a media distancia! <em>(Cañón prohibido).</em>
                </p>
                <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
                  <button type="button" class="btn-dice" onclick="rollSubVsSubInitiative()" style="font-size:0.76rem; padding:3px 8px;">🎲 Tirar 1d10</button>
                  <button type="button" class="btn-xs" onclick="setSubVsSubInitiative(true)" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px 6px; font-size:0.72rem; cursor:pointer;" title="1-3 en mesa">✅ Iniciativa IJN</button>
                  <button type="button" class="btn-xs" onclick="setSubVsSubInitiative(false)" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px 6px; font-size:0.72rem; cursor:pointer;" title="4-10 en mesa">⚠️ Sorpresa Enemiga</button>
                </div>
                <div id="wf-sub-initiative-res" style="font-size:0.76rem; font-weight:bold; margin-top:4px;"></div>
              </div>'''

if bad in c:
    c = c.replace(bad, good, 1)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Adjusted placement successfully')
else:
    print('Pattern not matched')
