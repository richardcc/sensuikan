import os

print("Updating gameflow_phase2.js for Port start...")

with open('app/js/gameflow_phase2.js', 'r', encoding='utf-8') as f:
    text = f.read()

norm_text = text.replace('\r\n', '\n')

old_block = """    function updateBoxDisplay() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      const idx = campaignState.workflow.currentBoxIndex || 0;
      if (typeof window.onSensuikanPatrolMoved === 'function') {
        window.onSensuikanPatrolMoved(idx);
      }
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || (isEn ? "Box " + (idx + 1) : "Casilla " + (idx + 1));
      const boxLblEl = document.getElementById('wf-current-box-lbl');
      if (boxLblEl) boxLblEl.innerText = `${boxName} (${idx + 1}/${list.length})`;
      
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const base = campaignState.workflow.startingBase || "Yokosuka";

      let desc = isEn ? `(On active patrol in ${assignedArea})` : `(En patrulla activa en ${assignedArea})`;
      if (boxName.includes("Transit") || boxName.includes("Tránsito")) {
        desc = isEn ? `(Naval transit approach towards ${assignedArea})` : `(Aproximación naval hacia ${assignedArea})`;
      } else if (boxName.includes("Return") || boxName.includes("Retorno")) {
        desc = isEn ? `(Return journey to base at ${base})` : `(Regreso a base en ${base})`;
      } else if (boxName.includes("Mission") || boxName.includes("Misión")) {
        desc = isEn ? `(⭐ Special Mission box in ${assignedArea})` : `(⭐ Casilla de Misión Especial en ${assignedArea})`;
      }
      
      const descEl = document.getElementById('wf-box-type-desc');
      if (descEl) descEl.innerText = desc;
      renderRouteBreadcrumbs();
    }

    function nextPatrolBox() {
      const max = campaignState.workflow.boxList.length - 1;
      if (campaignState.workflow.currentBoxIndex < max) {
        campaignState.workflow.currentBoxIndex++;
        if (campaignState.workflow.currentBoxIndex === max) {
          campaignState.workflow.patrolBoxesCompleted = true;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = campaignState.workflow.currentBoxIndex;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        document.getElementById('wf-encounter-roll-res').innerText = "Sin Tirar";
        document.getElementById('btn-engage-combat').style.display = "none";
        document.getElementById('wf-enc-status-text').innerText = "Listo para tirar en esta casilla.";
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
      } else {
        campaignState.workflow.patrolBoxesCompleted = true;
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        showToast("¡Ha completado todas las casillas de trayecto! Retorno a base.");
        setWorkflowPhase(4);
      }
    }

    function prevPatrolBox() {
      if (campaignState.workflow.currentBoxIndex > 0) {
        campaignState.workflow.currentBoxIndex--;
        const max = (campaignState.workflow.boxList.length - 1);
        if (campaignState.workflow.currentBoxIndex < max) {
          campaignState.workflow.patrolBoxesCompleted = false;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = campaignState.workflow.currentBoxIndex;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
      }
    }"""

new_block = """    function updateBoxDisplay() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (typeof window.onSensuikanPatrolMoved === 'function') {
        window.onSensuikanPatrolMoved(idx);
      }
      const list = campaignState.workflow.boxList || [];
      const base = campaignState.workflow.startingBase || "Yokosuka";
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";

      const boxLblEl = document.getElementById('wf-current-box-lbl');
      const descEl = document.getElementById('wf-box-type-desc');
      const rollResEl = document.getElementById('wf-encounter-roll-res');
      const encStatusEl = document.getElementById('wf-enc-status-text');
      const btnCombat = document.getElementById('btn-engage-combat');

      if (idx === -1) {
        if (boxLblEl) boxLblEl.innerText = isEn ? `⚓ In Port: ${base} (Departure Station)` : `⚓ En Puerto: ${base} (Estación de Salida)`;
        if (descEl) descEl.innerText = isEn ? `(Moored at naval base ${base}. Ready to depart on patrol towards ${assignedArea} [Rule 6.0])` : `(Amarrado en la base naval de ${base}. Listo para zarpar en patrulla hacia ${assignedArea} [Regla 6.0])`;
        if (rollResEl) rollResEl.innerHTML = `<span style="color:#38bdf8; font-weight:800;">⚓ ${isEn ? "In Port (Departure)" : "En Puerto (Salida)"}</span>`;
        if (encStatusEl) encStatusEl.innerText = isEn ? "Submarine is moored in port. Click 'Advance' to set sail on Box 1 (Transit)." : "El submarino está amarrado en puerto. Pulsa 'Avanzar' para zarpar hacia la Casilla 1 (Tránsito).";
        if (btnCombat) btnCombat.style.display = "none";
        renderRouteBreadcrumbs();
        return;
      }

      const boxName = list[idx] || (isEn ? "Box " + (idx + 1) : "Casilla " + (idx + 1));
      if (boxLblEl) boxLblEl.innerText = `${boxName} (${idx + 1}/${list.length})`;
      
      let desc = isEn ? `(On active patrol in ${assignedArea})` : `(En patrulla activa en ${assignedArea})`;
      if (boxName.includes("Transit") || boxName.includes("Tránsito")) {
        desc = isEn ? `(Naval transit approach towards ${assignedArea})` : `(Aproximación naval hacia ${assignedArea})`;
      } else if (boxName.includes("Return") || boxName.includes("Retorno")) {
        desc = isEn ? `(Return journey to base at ${base})` : `(Regreso a base en ${base})`;
      } else if (boxName.includes("Mission") || boxName.includes("Misión")) {
        desc = isEn ? `(⭐ Special Mission box in ${assignedArea})` : `(⭐ Casilla de Misión Especial en ${assignedArea})`;
      }
      
      if (descEl) descEl.innerText = desc;
      renderRouteBreadcrumbs();
    }

    function nextPatrolBox() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const max = campaignState.workflow.boxList.length - 1;
      const cur = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (cur < max) {
        campaignState.workflow.currentBoxIndex = cur + 1;
        if (campaignState.workflow.currentBoxIndex === max) {
          campaignState.workflow.patrolBoxesCompleted = true;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = campaignState.workflow.currentBoxIndex;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        document.getElementById('wf-encounter-roll-res').innerText = isEn ? "Unrolled" : "Sin Tirar";
        document.getElementById('btn-engage-combat').style.display = "none";
        document.getElementById('wf-enc-status-text').innerText = isEn ? "Ready to roll on this box." : "Listo para tirar en esta casilla.";
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
      } else {
        campaignState.workflow.patrolBoxesCompleted = true;
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        showToast(isEn ? "All patrol boxes completed! Return to base." : "¡Ha completado todas las casillas de trayecto! Retorno a base.");
        setWorkflowPhase(4);
      }
    }

    function prevPatrolBox() {
      const cur = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (cur > -1) {
        campaignState.workflow.currentBoxIndex = cur - 1;
        const max = (campaignState.workflow.boxList.length - 1);
        if (campaignState.workflow.currentBoxIndex < max) {
          campaignState.workflow.patrolBoxesCompleted = false;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = campaignState.workflow.currentBoxIndex;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
      }
    }"""

if old_block in norm_text:
    norm_text = norm_text.replace(old_block, new_block)
    print("✓ Replaced updateBoxDisplay block")
else:
    print("Error: old_block not found!")

old_roll = """    function rollBoxEncounter(manualRoll) {
      const idx = campaignState.workflow.currentBoxIndex || 0;"""

new_roll = """    function rollBoxEncounter(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (idx === -1) {
        showToast(isEn ? "The submarine is moored in port. Click 'Advance' to set sail on Box 1!" : "El submarino está amarrado en puerto. ¡Pulsa 'Avanzar' para zarpar hacia la Casilla 1!");
        return;
      }"""

if old_roll in norm_text:
    norm_text = norm_text.replace(old_roll, new_roll)
    print("✓ Replaced rollBoxEncounter check")
else:
    print("Error: old_roll not found!")

with open('app/js/gameflow_phase2.js', 'w', encoding='utf-8') as f:
    f.write(norm_text)
with open('app/js/components/gameflow_phase2.js', 'w', encoding='utf-8') as f:
    f.write(norm_text)

print("Saved app/js/gameflow_phase2.js and components successfully!")
