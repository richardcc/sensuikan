import os

print("Applying Port vs A3 updates...")

# 1. Update tables.js
with open('app/js/tables.js', 'r', encoding='utf-8') as f:
    text_tab = f.read()

target_tab = """    function updatePhase2TableDisplay() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = campaignState.workflow.currentBoxIndex || 0;"""

replacement_tab = """    function updatePhase2TableDisplay() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      const base = campaignState.workflow.startingBase || "Yokosuka";

      const badge = document.getElementById('p2-current-zone-badge');
      const thZone = document.getElementById('th-p2-zone-name');
      const tb = document.getElementById('phase2-a3-tbody');

      if (idx === -1) {
        if (badge) {
          badge.style.background = '#0369a1';
          badge.style.borderColor = '#38bdf8';
          badge.style.color = '#e0f2fe';
          badge.innerText = isEn ? `Naval Base: ${base} (In Port)` : `Base Naval: ${base} (En Puerto)`;
        }
        if (thZone) thZone.innerText = isEn ? "Status: In Port (No A3 Encounters)" : "Estado: En Puerto (Sin Tabla A3)";
        if (tb) {
          tb.innerHTML = `
            <tr>
              <td colspan="3" style="text-align:center; padding:18px; color:#cbd5e1; font-size:0.84rem; line-height:1.6; background:rgba(15,23,42,0.6);">
                ⚓ <strong style="color:#38bdf8; font-size:0.95rem;">${isEn ? 'Submarine moored in port at ' + base : 'Submarino amarrado en base naval: ' + base}</strong><br>
                <span style="color:#94a3b8;">${isEn 
                  ? 'The Encounter Chart [A3] is inactive while moored in port. In port, the only operational rule is <strong>Air Raids on Ports [Rule 4.7.6]</strong> (evaluated during Refit starting in Jan 1944). Chart A3 encounters will automatically activate when you depart into Box 1 (Transit).'
                  : 'La Tabla de Encuentros [A3] no se aplica durante la estancia en puerto. En puerto, la única regla operativa contemplada son las <strong>Incursiones Aéreas [Regla 4.7.6]</strong> (evaluadas durante el Refit a partir de enero de 1944). La Tabla A3 se activará automáticamente al zarpar a la Casilla 1 (Tránsito).'}</span>
              </td>
            </tr>
          `;
        }
        return;
      }"""

norm_tab = text_tab.replace('\r\n', '\n')
norm_target_tab = target_tab.replace('\r\n', '\n')
norm_repl_tab = replacement_tab.replace('\r\n', '\n')

assert norm_target_tab in norm_tab, 'Target in tables.js not found'
norm_tab = norm_tab.replace(norm_target_tab, norm_repl_tab)

with open('app/js/tables.js', 'w', encoding='utf-8') as f:
    f.write(norm_tab)
with open('app/js/components/tables.js', 'w', encoding='utf-8') as f:
    f.write(norm_tab)
print("✓ Updated tables.js and components/tables.js")


# 2. Update gameflow_phase2.js
with open('app/js/gameflow_phase2.js', 'r', encoding='utf-8') as f:
    text_gf = f.read()

target_gf = """      if (idx === -1) {
        if (boxLblEl) boxLblEl.innerText = isEn ? `⚓ In Port: ${base} (Departure Station)` : `⚓ En Puerto: ${base} (Estación de Salida)`;
        if (descEl) descEl.innerText = isEn ? `(Moored at naval base ${base}. Ready to depart on patrol towards ${assignedArea} [Rule 6.0])` : `(Amarrado en la base naval de ${base}. Listo para zarpar en patrulla hacia ${assignedArea} [Regla 6.0])`;
        if (rollResEl) rollResEl.innerHTML = `<span style="color:#38bdf8; font-weight:800;">⚓ ${isEn ? "In Port (Departure)" : "En Puerto (Salida)"}</span>`;
        if (encStatusEl) encStatusEl.innerText = isEn ? "Submarine is moored in port. Click 'Advance' to set sail on Box 1 (Transit)." : "El submarino está amarrado en puerto. Pulsa 'Avanzar' para zarpar hacia la Casilla 1 (Tránsito).";
        if (btnCombat) btnCombat.style.display = "none";
        renderRouteBreadcrumbs();
        return;
      }"""

replacement_gf = """      const a3Wrapper = document.getElementById('p2-a3-controls-wrapper');
      const portWrapper = document.getElementById('p2-port-controls-wrapper');
      const c2Title = document.getElementById('p2-c2-title');
      const c2Help = document.getElementById('p2-encounter-help');
      const btnBack = document.getElementById('p2-btn-back');
      const btnNextText = document.getElementById('p2-btn-next');
      const btnPrevText = document.getElementById('p2-btn-prev');

      if (idx === -1) {
        if (boxLblEl) boxLblEl.innerText = isEn ? `⚓ In Port: ${base} (Departure Station)` : `⚓ En Puerto: ${base} (Estación de Salida)`;
        if (descEl) descEl.innerText = isEn ? `(Moored at naval base ${base}. Ready to depart on patrol towards ${assignedArea} [Rule 6.0])` : `(Amarrado en la base naval de ${base}. Listo para zarpar en patrulla hacia ${assignedArea} [Regla 6.0])`;
        if (rollResEl) rollResEl.innerHTML = `<span style="color:#38bdf8; font-weight:800;">⚓ ${isEn ? "In Port (Departure)" : "En Puerto (Salida)"}</span>`;
        if (encStatusEl) encStatusEl.innerText = isEn ? "Submarine is moored in port. Click 'Depart on Patrol' to begin transit." : "El submarino está amarrado en puerto. Pulsa 'Zarpar a la Mar' para iniciar el tránsito.";
        if (btnCombat) btnCombat.style.display = "none";

        if (a3Wrapper) a3Wrapper.style.display = 'none';
        if (portWrapper) portWrapper.style.display = 'block';
        if (c2Title) c2Title.innerText = isEn ? "2. Naval Base Status [Rule 4.7.6]" : "2. Estado en Base Naval [Regla 4.7.6]";
        if (c2Help) c2Help.innerText = isEn ? "Submarine is moored in port. Chart [A3] does not apply in port." : "El submarino está amarrado en puerto. La Tabla [A3] no se aplica en puerto.";

        if (btnBack) {
          btnBack.disabled = true;
          btnBack.style.opacity = '0.4';
          btnBack.style.cursor = 'not-allowed';
        }
        if (btnNextText) btnNextText.innerText = isEn ? "Depart on Patrol" : "Zarpar a la Mar";
        if (btnPrevText) btnPrevText.innerText = isEn ? "Moored" : "Amarrado";

        renderRouteBreadcrumbs();
        return;
      }

      if (a3Wrapper) a3Wrapper.style.display = 'block';
      if (portWrapper) portWrapper.style.display = 'none';
      if (c2Title) c2Title.innerText = isEn ? "2. Encounter Roll on Chart [A3]" : "2. Tirada de Encuentros en Tabla [A3]";
      if (c2Help) c2Help.innerText = isEn ? "Roll 2d6 in each patrol station or transit box:" : "Lanza 2d6 en cada casilla de estación o tránsito:";
      if (btnBack) {
        btnBack.disabled = false;
        btnBack.style.opacity = '1';
        btnBack.style.cursor = 'pointer';
      }
      if (btnNextText) btnNextText.innerText = isEn ? "Advance Box" : "Avanzar Casilla";
      if (btnPrevText) btnPrevText.innerText = (idx === 0) ? (isEn ? "Back to Port" : "Volver a Puerto") : (isEn ? "Previous Box" : "Retroceder");"""

norm_gf = text_gf.replace('\r\n', '\n')
norm_target_gf = target_gf.replace('\r\n', '\n')
norm_repl_gf = replacement_gf.replace('\r\n', '\n')

assert norm_target_gf in norm_gf, 'Target in gameflow_phase2.js not found'
norm_gf = norm_gf.replace(norm_target_gf, norm_repl_gf)

with open('app/js/gameflow_phase2.js', 'w', encoding='utf-8') as f:
    f.write(norm_gf)
with open('app/js/components/gameflow_phase2.js', 'w', encoding='utf-8') as f:
    f.write(norm_gf)
print("✓ Updated gameflow_phase2.js and components/gameflow_phase2.js")
