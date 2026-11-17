// =========================================================================
// SENSUiKAN: GAME FLOW - PHASES 4 & 5: DAMAGE CONTROL & REFIT
// Damage repairs B7, Flooding containment, Crew casualties, Port air raids 4.7.6, Refit duration & patrol reset.
// =========================================================================

    function rollDamageRepairs() {
      const count = parseInt(document.getElementById('wf-dmg-systems-count').value) || 0;
      let details = [];
      for (let i = 1; i <= count; i++) {
        const die = Math.floor(Math.random() * 6) + 1;
        details.push(`Sistema #${i}: 🎲 1d6 = [${die}]`);
      }
      const detailStr = details.length ? ` (${details.join(', ')})` : '';
      document.getElementById('wf-repair-results-txt').innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Control de Averías:</span> ${count} sistema(s) inspeccionado(s)${detailStr}. Cero averías críticas pendientes.`;
      showToast("Control de averías completado con éxito.");
    }

    // =========================================================================
    // AIR RAIDS ON PORTS [RULE 4.7.6] & REFIT DURATION
    // =========================================================================

    function rollAirRaidOnPort() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      campaignState.workflow.airRaidRoll = sum;

      let extraMonths = 0;
      let text = "";

      if (sum === 2) {
        extraMonths = 1;
        text = isEn
          ? `💥 <strong>Submarine destroyed in air raid!</strong> (Roll: ${d1}+${d2}=2). The submarine was destroyed in the port bombing. The commander must spend 1 month travelling to Yokosuka to receive a new submarine of their choice [Rule 4.7.6].`
          : `💥 <strong>¡Submarino destruido en ataque aéreo!</strong> (Tirada: ${d1}+${d2}=2). El submarino ha quedado destruido en el bombardeo del puerto. El comandante debe emplear 1 mes viajando a Yokosuka para recibir un nuevo submarino de su elección [Regla 4.7.6].`;
        campaignState.workflow.airRaidRefitMonths = 1;
        campaignState.workflow.airRaidResult = { sum, text, destroyed: true };
        showToast("💥 Incursión Aérea: ¡Submarino destruido! Reasignación a Yokosuka.");
      } else if (sum === 3) {
        extraMonths = 2;
        text = isEn
          ? `🔥 <strong>Severe air-raid damage (+2 refit months).</strong> (Roll: ${d1}+${d2}=3). The submarine or dock suffers major damage; 2 additional drydock months are added.`
          : `🔥 <strong>Daño severo en ataque aéreo (+2 meses de refit).</strong> (Tirada: ${d1}+${d2}=3). El buque o dársena sufre daños mayores; se añaden 2 meses adicionales al dique seco.`;
        campaignState.workflow.airRaidRefitMonths = 2;
        campaignState.workflow.airRaidResult = { sum, text, extraMonths: 2 };
        showToast("🔥 Incursión Aérea: Daño severo (+2 meses de refit).");
      } else if (sum === 4) {
        extraMonths = 1;
        text = isEn
          ? `⚠️ <strong>Air-raid damage (+1 refit month).</strong> (Roll: ${d1}+${d2}=4). Shrapnel and port damage require 1 additional month of repairs.`
          : `⚠️ <strong>Daño en ataque aéreo (+1 mes de refit).</strong> (Tirada: ${d1}+${d2}=4). La metralla y daños de puerto obligan a añadir 1 mes extra de reparaciones.`;
        campaignState.workflow.airRaidRefitMonths = 1;
        campaignState.workflow.airRaidResult = { sum, text, extraMonths: 1 };
        showToast("⚠️ Incursión Aérea: Daño moderado (+1 mes de refit).");
      } else {
        extraMonths = 0;
        text = isEn
          ? `✅ <strong>No effect.</strong> (Roll: ${d1}+${d2}=${sum}). The bombs fell outside the anchorage or were repelled by anti-aircraft batteries. No damage.`
          : `✅ <strong>Sin efecto.</strong> (Tirada: ${d1}+${d2}=${sum}). Las bombas cayeron fuera del fondeadero o fueron repelidas por las baterías antiaéreas. No hay daños.`;
        campaignState.workflow.airRaidRefitMonths = 0;
        campaignState.workflow.airRaidResult = { sum, text, extraMonths: 0 };
        showToast(`✅ Incursión Aérea: Sin efecto (${sum}).`);
      }

      recalculateRefitTime();
      updateAirRaidUI();
      saveState();
    }

    function resetAirRaidRoll() {
      campaignState.workflow.airRaidRoll = null;
      campaignState.workflow.airRaidResult = null;
      campaignState.workflow.airRaidRefitMonths = 0;
      recalculateRefitTime();
      updateAirRaidUI();
      saveState();
      showToast("Tirada de incursión aérea reiniciada.");
    }

    function handleAirRaidDestructionNewBoat() {
      campaignState.workflow.startingBase = "Yokosuka";
      const base0 = document.getElementById('wf-starting-base');
      if (base0) base0.value = "Yokosuka";
      const base1 = document.getElementById('wf-base-select');
      if (base1) base1.value = "Yokosuka";
      updateBaseDescriptionPill("Yokosuka");
      setWorkflowPhase(0);
      saveState();
      showToast("⚓ Comandante trasladado a Yokosuka. Selecciona tu nuevo submarino de reemplazo.");
    }

    function updateAirRaidUI() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const container = document.getElementById('wf-air-raid-container');
      if (!container) return;
      const m = campaignState.workflow.selectedMonth || "1941-12";
      const base = normalizeBaseName(campaignState.workflow.startingBase || "Yokosuka");
      const isPost1944 = (m >= "1944-01");
      const isParamushiro = (base === "Paramushiro");

      if (!isPost1944) {
        container.innerHTML = `
          <div style="background:rgba(15,23,42,0.6); border:1px solid #334155; border-radius:8px; padding:10px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
              <div style="font-weight:700; color:#94a3b8; font-size:0.8rem; display:flex; align-items:center; gap:6px;">
                <span>🛡️</span> <span>${isEn ? 'PORT AIR RAIDS [RULE 4.7.6]' : 'INCURSIONES AÉREAS EN PUERTO [REGLA 4.7.6]'}</span>
              </div>
              <span style="font-size:0.68rem; color:#10b981; background:rgba(16,185,129,0.15); padding:2px 6px; border-radius:4px; border:1px solid #10b981;">${isEn ? 'Inactive (&lt; Jan 1944)' : 'Inactivas (&lt; Jan 1944)'}</span>
            </div>
            <div style="font-size:0.73rem; color:var(--slate-400); line-height:1.4;">
              ${isEn ? 'Enemy air raids begin in <strong>January 1944 (1/44)</strong>. Current month: <strong>' + m + '</strong>. No air-raid roll is required.' : 'Las incursiones aéreas enemigas entran en vigor a partir de <strong>enero de 1944 (1/44)</strong>. Mes actual: <strong>' + m + '</strong>. No se requiere tirada de ataque aéreo.'}
            </div>
          </div>
        `;
        return;
      }

      if (isParamushiro) {
        container.innerHTML = `
          <div style="background:rgba(15,23,42,0.6); border:1px solid #0284c7; border-radius:8px; padding:10px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
              <div style="font-weight:700; color:#38bdf8; font-size:0.8rem; display:flex; align-items:center; gap:6px;">
                <span>🛡️</span> <span>${isEn ? 'PORT AIR RAIDS [RULE 4.7.6]' : 'INCURSIONES AÉREAS EN PUERTO [REGLA 4.7.6]'}</span>
              </div>
              <span style="font-size:0.68rem; color:#38bdf8; background:rgba(56,189,248,0.15); padding:2px 6px; border-radius:4px; border:1px solid #38bdf8;">${isEn ? 'Paramushiro Base Exempt' : 'Base Paramushiro Exenta'}</span>
            </div>
            <div style="font-size:0.73rem; color:#bae6fd; line-height:1.4;">
              ${isEn ? '⚓ <strong>Exemption [4.7.6]:</strong> <em>"while in any port except Paramushiro"</em>. Paramushiro anchorage is exempt from air raids. No damage applies.' : '⚓ <strong>Exención [4.7.6]:</strong> <em>"while in any port except Paramushiro"</em>. El fondeadero septentrional de Paramushiro está exento de incursiones aéreas. No se aplica daño.'}
            </div>
          </div>
        `;
        return;
      }

      const roll = campaignState.workflow.airRaidRoll;
      const res = campaignState.workflow.airRaidResult;

      let resultHtml = '';
      if (roll !== null && roll !== undefined && res) {
        let color = '#10b981';
        let icon = '✅';
        if (roll === 2) { color = '#ef4444'; icon = '💥'; }
        else if (roll === 3) { color = '#f97316'; icon = '🔥'; }
        else if (roll === 4) { color = '#f59e0b'; icon = '⚠️'; }

        resultHtml = `
          <div style="margin-top:8px; background:rgba(0,0,0,0.4); border:1px solid ${color}; border-radius:6px; padding:8px 10px;">
            <div style="font-size:0.8rem; font-weight:800; color:${color}; display:flex; align-items:center; gap:6px;">
              <span>${icon}</span> <span>Resultado 2d6: [${roll}]</span>
            </div>
            <div style="font-size:0.74rem; color:#f8fafc; margin-top:3px; line-height:1.4;">
              ${res.text}
            </div>
            ${roll === 2 ? `
              <button type="button" onclick="handleAirRaidDestructionNewBoat()" class="action-btn" style="margin-top:6px; background:#b91c1c; border-color:#ef4444; color:#fff; font-size:0.73rem; font-weight:700; padding:5px 8px;">
                🔄 Seleccionar Nuevo Submarino en Yokosuka (+1 Mes)
              </button>
            ` : ''}
          </div>
        `;
      }

      container.innerHTML = `
        <div style="background:rgba(15,23,42,0.6); border:1px solid #ef4444; border-radius:8px; padding:10px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
            <div style="font-weight:700; color:var(--gold-300); font-size:0.8rem; display:flex; align-items:center; gap:6px;">
              <span>✈️</span> <span>INCURSIONES AÉREAS EN PUERTO [REGLA 4.7.6]</span>
            </div>
            <span style="font-size:0.68rem; color:#f87171; background:rgba(239,68,68,0.15); padding:2px 6px; border-radius:4px; border:1px solid #ef4444;">Obligatorio (1944+)</span>
          </div>
          <div style="font-size:0.73rem; color:var(--slate-300); line-height:1.35; margin-bottom:6px;">
            En cada mes de Refit a partir de enero de 1944, tira 2d6 para determinar posibles daños aéreos en puerto:
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.71rem; margin-bottom:8px; background:rgba(0,0,0,0.25); border-radius:4px;">
            <tbody>
              <tr style="border-bottom:1px solid #1e293b; ${roll === 2 ? 'background:rgba(239,68,68,0.25); font-weight:bold;' : ''}">
                <td style="padding:2px 5px; text-align:center; color:#ef4444; font-weight:700; width:35px;">2</td>
                <td style="padding:2px 5px; color:#fca5a5;">Submarino destruido. Pasar 1 mes viajando a Yokosuka para nuevo submarino.</td>
              </tr>
              <tr style="border-bottom:1px solid #1e293b; ${roll === 3 ? 'background:rgba(249,115,22,0.25); font-weight:bold;' : ''}">
                <td style="padding:2px 5px; text-align:center; color:#f97316; font-weight:700;">3</td>
                <td style="padding:2px 5px; color:#fdba74;">Daño severo en ataque aéreo. Añadir <strong>+2 meses</strong> al refit actual.</td>
              </tr>
              <tr style="border-bottom:1px solid #1e293b; ${roll === 4 ? 'background:rgba(245,158,11,0.25); font-weight:bold;' : ''}">
                <td style="padding:2px 5px; text-align:center; color:#f59e0b; font-weight:700;">4</td>
                <td style="padding:2px 5px; color:#fde047;">Daño en ataque aéreo. Añadir <strong>+1 mes</strong> al refit actual.</td>
              </tr>
              <tr style="${roll >= 5 ? 'background:rgba(16,185,129,0.25); font-weight:bold;' : ''}">
                <td style="padding:2px 5px; text-align:center; color:#10b981; font-weight:700;">5-12</td>
                <td style="padding:2px 5px; color:#86efac;">Sin efecto (No effect).</td>
              </tr>
            </tbody>
          </table>
          <div style="display:flex; align-items:center; gap:6px;">
            <button type="button" onclick="rollAirRaidOnPort()" class="action-btn" style="flex:1; justify-content:center; background:linear-gradient(135deg, #7f1d1d, #991b1b); border-color:#ef4444; color:#fff; font-weight:700; padding:5px 10px; font-size:0.75rem;">
              🎲 Tirar Incursión Aérea (2d6) [4.7.6]
            </button>
            ${roll !== null && roll !== undefined ? `
              <button type="button" onclick="resetAirRaidRoll()" class="action-btn" style="padding:5px 8px; font-size:0.7rem; color:var(--slate-400);">
                ↺ Re-tirar
              </button>
            ` : ''}
          </div>
          ${resultHtml}
        </div>
      `;
    }

    // Phase 5: Refit Calculation
    function recalculateRefitTime() {
      const inop = parseInt(document.getElementById('wf-inop-select').value) || 0;
      const hull = parseInt(document.getElementById('wf-hull-dmg-select').value) || 0;
      const airRaidExtra = campaignState.workflow.airRaidRefitMonths || 0;
      const total = 1 + inop + hull + airRaidExtra;
      const extraLabel = airRaidExtra > 0 ? ` (incluye +${airRaidExtra}m por incursión aérea [4.7.6])` : '';
      const totalEl = document.getElementById('wf-total-refit-months');
      if (totalEl) totalEl.innerText = `${total} Mes(es) ("R")${extraLabel}`;

      // Regla 9.2: Sustitución de submarino si Refit >= 5 meses
      const alertEl = document.getElementById('wf-refit-replacement-alert');
      const alertMonthsEl = document.getElementById('wf-refit-alert-months');
      if (alertEl) {
        if (total >= 5) {
          alertEl.style.display = 'block';
          if (alertMonthsEl) alertMonthsEl.innerText = total;
        } else {
          alertEl.style.display = 'none';
        }
      }
    }

    function resetWorkflowForNextPatrol() {
      const inop = parseInt(document.getElementById('wf-inop-select').value) || 0;
      const hull = parseInt(document.getElementById('wf-hull-dmg-select').value) || 0;
      const airRaidExtra = campaignState.workflow.airRaidRefitMonths || 0;
      const refitMonths = 1 + inop + hull + airRaidExtra;

      const curMonthId = campaignState.workflow.selectedMonth || "1941-12";
      const curIdx = MONTHS.findIndex(m => m.id === curMonthId);

      if (curIdx < 0) {
        showToast("Mes no reconocido.");
        return;
      }

      const currentBase = normalizeBaseName(campaignState.workflow.startingBase || "Yokosuka");

      // Regla 4.7.3: Si está en refit en Truk cuando ocurre 3/44, el submarino se considera perdido en Op. Hailstone
      let lostInTruk344 = false;
      for (let i = 1; i <= refitMonths; i++) {
        const rIdx = curIdx + i;
        if (rIdx < MONTHS.length) {
          const rId = MONTHS[rIdx].id;
          if (currentBase === 'Truk' && rId === '1944-03') {
            lostInTruk344 = true;
          }
          campaignState.patrols[rId] = {
            patrolNum: "R",
            area: `Refit / ${currentBase}`,
            isSpecial: false,
            targets: [],
            tons: 0,
            notes: `Refit (${i}/${refitMonths}) - Puesta a punto y mantenimiento`
          };
        }
      }

      // Next active patrol starts after refit months
      const nextActiveIdx = curIdx + refitMonths + 1;
      let nextMonthId = curMonthId;
      if (nextActiveIdx < MONTHS.length) {
        nextMonthId = MONTHS[nextActiveIdx].id;
      } else if (curIdx + refitMonths < MONTHS.length) {
        nextMonthId = MONTHS[curIdx + refitMonths].id;
      }

      // Regla 4.7.3: Si se perdió en Truk en 3/44, pierde 1 mes viajando a Yokosuka para recibir nuevo buque
      if (lostInTruk344) {
        campaignState.workflow.startingBase = "Yokosuka";
        campaignState.patrols["1944-03"] = {
          patrolNum: "R",
          area: "Truk (Destruido)",
          isSpecial: false,
          targets: [],
          tons: 0,
          notes: "💥 Submarino destruido en Truk durante Op. Hailstone (Regla 4.7.3). 1 mes de viaje a Yokosuka."
        };
        showToast("💥 Regla 4.7.3: El submarino fue destruido durante el bombardeo de Truk en marzo de 1944. Reasignado a Yokosuka.");
        setWorkflowPhase(0);
        saveState();
        return;
      }

      // Regla 4.7.2: Si estaba en Paramushiro y la nueva patrulla es >= 7/43, reasignar a Truk
      if (currentBase === 'Paramushiro' && nextMonthId >= '1943-07') {
        campaignState.workflow.startingBase = 'Truk';
        showToast("⚓ Regla 4.7.2: Fecha es " + nextMonthId + " (≥ 7/43). Submarinos destacados en Paramushiro son reasignados automáticamente a Truk.");
      } else if (currentBase === 'Truk' && nextMonthId >= '1944-03') {
        // Regla 4.7.3: Truk cesa como base en 3/44; re-base a Yokosuka
        campaignState.workflow.startingBase = 'Yokosuka';
        showToast("⚠️ Regla 4.7.3: Truk cesó de ser base naval en 3/44. Submarino reubicado en Yokosuka.");
      }

      // Regla 4.7.2: Si sigue en Paramushiro (< 7/43), todas las patrullas subsiguientes están asignadas a las Aleutianas
      let lockedAleutians = false;
      if (campaignState.workflow.startingBase === 'Paramushiro' && nextMonthId < '1943-07') {
        campaignState.workflow.assignedArea = 'Aleutians';
        lockedAleutians = true;
      } else {
        campaignState.workflow.assignedArea = "";
      }

      // Reset air raid state for next patrol
      campaignState.workflow.airRaidRoll = null;
      campaignState.workflow.airRaidResult = null;
      campaignState.workflow.airRaidRefitMonths = 0;

      // Increment patrol number
      campaignState.workflow.patrolNumber = (campaignState.workflow.patrolNumber || 1) + 1;
      campaignState.workflow.selectedMonth = nextMonthId;

      // Initialize new active patrol month in Rogu Bukku
      campaignState.patrols[nextMonthId] = {
        patrolNum: String(campaignState.workflow.patrolNumber),
        area: lockedAleutians ? "Aleutians" : "",
        isSpecial: false,
        targets: [],
        tons: 0,
        notes: lockedAleutians ? "Patrulla obligatoria en Aleutianas desde Paramushiro [Regla 4.7.2]" : ""
      };

      // Reset workflow tracking for next patrol
      campaignState.workflow.currentPhase = 1;
      campaignState.workflow.currentBoxIndex = 0;
      campaignState.workflow.patrolBoxesCompleted = false;
      campaignState.workflow.currentTarget = null;
      campaignState.workflow.encounterStatus = "none";
      campaignState.workflow.lastCombatHits = 0;
      campaignState.workflow.lastCombatDamage = 0;
      campaignState.workflow.lastCombatLoggedTargetIndex = null;

      // Update month select dropdown
      buildWorkflowMonthSelect();
      const monthSel = document.getElementById('wf-month-select');
      if (monthSel) monthSel.value = nextMonthId;

      updateBasesForDate(nextMonthId);
      buildPatrolTable();
      setWorkflowPhase(1);
      updateBoxDisplay();
      recalculatePatrolTrack();
      updatePhase2TableDisplay();
      saveState();

      const nextLabel = (MONTHS.find(m => m.id === nextMonthId) || {}).label || nextMonthId;
      showToast(`¡Refit de ${refitMonths} mes(es) completado! Preparando Patrulla #${campaignState.workflow.patrolNumber} en ${nextLabel}`);
    }

    // CHART K1 TOKENS

// CHART B7 DAMAGE CONTROL DICE ROLLS
    function rollB7Flooding(manualRoll) {
      const isEn = window.currentLang === 'en';
      const d = (typeof manualRoll === 'number' && manualRoll >= 1 && manualRoll <= 6) ? manualRoll : (Math.floor(Math.random() * 6) + 1);
      const engSW = !!campaignState.crewInjuries && campaignState.crewInjuries.engineer;
      const mod = engSW ? 1 : 0;
      const total = d + mod;
      const el = document.getElementById('wf-b7-flooding-res');
      if (total <= 4) {
        el.style.color = '#34d399';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? '1d6 Roll' : 'Tirada 1d6'}: [${d}]${mod ? ' (+1 DRM)' : ''} = ${total}</span> ➔ ${isEn ? 'Flooding contained. No additional boxes marked.' : '¡Inundación contenida! No se marcan casillas adicionales.'}`;
        showToast(isEn ? 'Flooding contained successfully.' : 'Inundación contenida con éxito.');
      } else {
        el.style.color = '#ef4444';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? '1d6 Roll' : 'Tirada 1d6'}: [${d}]${mod ? ' (+1 DRM)' : ''} = ${total}</span> ➔ ${isEn ? 'Uncontrolled flooding (+1 box). Mark 1 additional box.' : '¡Inundación adicional! Marca 1 casilla más.'}`;
        showToast(isEn ? 'Warning! Additional flooding.' : '¡Alerta! Inundación adicional en el submarino.');
      }
    }

    function rollB7SystemRepair(manualRoll) {
      const isEn = window.currentLang === 'en';
      const sys = document.getElementById('wf-b7-system-select').value;
      const el = document.getElementById('wf-b7-repair-res');
      if (sys === 'hull') {
        el.style.color = '#f87171';
        el.innerText = isEn ? '❌ Hull damage cannot be repaired at sea. Drydock (Refit) is required.' : '❌ El daño de casco no se puede reparar en alta mar. Requiere dique seco (Refit).';
        return;
      }
      const d = (typeof manualRoll === 'number' && manualRoll >= 1 && manualRoll <= 6) ? manualRoll : (Math.floor(Math.random() * 6) + 1);
      const engSW = !!campaignState.crewInjuries && campaignState.crewInjuries.engineer;
      const mod = engSW ? 1 : 0;
      const total = d + mod;
      
      let reqMax = 2; // Default for most systems: 1-2 fixed
      if (sys === 'fuel' || sys === 'radar') reqMax = 3;
      if (sys === 'engines' || sys === 'batteries') reqMax = 4;

      if (total <= reqMax) {
        el.style.color = '#34d399';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? '1d6 Roll' : 'Tirada 1d6'}: [${d}]${mod ? ' (+1 DRM)' : ''} = ${total} (≤${reqMax})</span> ➔ ${isEn ? 'REPAIRED SUCCESSFULLY! The system is operational again.' : '¡REPARADO CON ÉXITO! El sistema vuelve a estar operativo.'}`;
        showToast(isEn ? 'System repaired successfully!' : '¡Sistema reparado con éxito!');
      } else {
        el.style.color = '#ef4444';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? '1d6 Roll' : 'Tirada 1d6'}: [${d}]${mod ? ' (+1 DRM)' : ''} = ${total} (≤${reqMax})</span> ➔ ${isEn ? 'NOT REPAIRABLE AT SEA (INOP). Drydock (Refit) is required.' : 'NO REPARABLE EN EL MAR (INOP). Requiere dique seco (Refit).'}`;
        showToast(isEn ? 'System cannot be repaired at sea.' : 'Sistema no reparable en el mar.');
      }
    }

    function rollB7CrewInjury() {
      const isEn = window.currentLang === 'en';
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const sevRoll = Math.floor(Math.random() * 6) + 1;

      let role = isEn ? "Crew (Generic)" : "Dotación genérica";
      let roleKey = "crew";
      let penalty = isEn ? "If all generic crew boxes are SW/KIA: +1 torpedo To-Hit." : "Si todas las casillas genéricas quedan SW/KIA: +1 a impactar con torpedos.";

      if (sum === 2) {
        role = isEn ? "Captain" : "Comandante";
        roleKey = "captain";
        penalty = isEn ? "The Executive Officer takes command. Penalties: Detection +1, To-Hit +1." : "El oficial ejecutivo toma el mando. Penalizaciones: detección +1, impactar +1.";
      } else if (sum === 3) {
        role = isEn ? "Engineer" : "Ingeniero";
        roleKey = "engineer";
        penalty = isEn ? "All repair and flooding containment rolls receive +1 DRM." : "Todas las tiradas de reparación y contención de inundación reciben +1 DRM.";
      } else if (sum === 4) {
        role = isEn ? "Executive Officer (XO)" : "Oficial ejecutivo (XO)";
        roleKey = "exec";
        penalty = isEn ? "If the XO was in command, the 3rd Officer takes command: Detection +1, To-Hit +1." : "Si el XO estaba al mando, el tercer oficial toma el mando: detección +1, impactar +1.";
      } else if (sum === 5) {
        role = isEn ? "Medic" : "Médico";
        roleKey = "medic";
        penalty = isEn ? "All crew with Serious Wounds (SW) become KIA after each zone on 1d6 >= 4." : "Todos los tripulantes con herida grave (SW) mueren (KIA) tras cada zona con 1d6 >= 4.";
      } else if (sum >= 6 && sum <= 10) {
        role = isEn ? `Crew (generic, box #${sum - 5})` : `Dotación genérica (casilla #${sum - 5})`;
        roleKey = "crew";
        penalty = isEn ? "If all generic crew boxes are SW or KIA: torpedo To-Hit worsens by +1." : "Si todas las casillas genéricas quedan SW o KIA: impactar con torpedos empeora en +1.";
      } else if (sum === 11) {
        role = isEn ? "Navigator" : "Navegante";
        roleKey = "navigator";
        penalty = isEn ? "The submarine must abort if the Navigator was acting as Captain." : "El submarino debe abortar si el navegante estaba ejerciendo de capitán.";
      } else if (sum === 12) {
        role = isEn ? "Pilot / Midget / Kaiten crew" : "Dotación de piloto / Midget / Kaiten";
        roleKey = "pilot";
        penalty = isEn ? "The special mission fails automatically if all are SW or KIA." : "La misión especial fracasa automáticamente si todos quedan SW o KIA.";
      }

      let sev = isEn ? "LW (Light Wound)" : "LW (Herida leve)";
      let sevDesc = isEn ? "No adverse combat effect." : "Sin efecto negativo en combate.";
      if (sevRoll >= 4 && sevRoll <= 5) {
        sev = isEn ? "SW (Serious Wound)" : "SW (Herida grave)";
        sevDesc = isEn ? "Incapacitated for service." : "Incapacitado para el servicio.";
      } else if (sevRoll === 6) {
        sev = isEn ? "KIA (Killed in Action)" : "KIA (Muerto en combate)";
        sevDesc = isEn ? "Permanent combat casualty." : "Baja definitiva en combate.";
      }

      const el = document.getElementById('wf-b7-crew-res');
      el.innerHTML = `<strong>${isEn ? 'Station' : 'Puesto'} (2d6 = ${sum} [${d1}+${d2}]):</strong> ${role}<br><strong>${isEn ? 'Severity' : 'Gravedad'} (1d6 = ${sevRoll}):</strong> <span style="color:#fbbf24;">${sev}</span> (${sevDesc})<br><strong>${isEn ? 'Campaign Effect' : 'Efecto en campaña'}:</strong> ${penalty}`;
      showToast(isEn ? `Casualty recorded: ${role} (${sev})` : `Baja registrada: ${role} (${sev})`);
    }

    // CHARTS M5 - M8: MIDGET SUBMARINE (KO-HYOTEKI) LOGIC
    // CHART_M6_EVENTS loaded globally from data.js

    // CHART_M8_TABLE loaded globally from data.js

    // =========================================================================
    // SUBMARINE UPGRADE & REPLACEMENT [RULES 9.2 & 9.3]
    // =========================================================================

    let currentSubUpgradeMode = 'upgrade'; // 'upgrade' or 'replacement'

    const HISTORIC_HULLS = {
      "Kaidai_KD3_Class": ["I-53", "I-54", "I-55", "I-58"],
      "Kaidai_KD4_Class": ["I-61", "I-62", "I-64"],
      "Kaidai_KD5_Class": ["I-65", "I-66", "I-67"],
      "Kaidai_KD6_Class": ["I-168", "I-169", "I-171", "I-172"],
      "Kaidai_KD7_Class": ["I-176", "I-177", "I-178", "I-180"],
      "Kirai_Sen_Class": ["I-121", "I-122", "I-123", "I-124"],
      "Junsen_J_IM_Class": ["I-1", "I-2", "I-3", "I-4"],
      "Junsen_J2_Class": ["I-6"],
      "Junsen_J3_Class": ["I-7", "I-8"],
      "Type_A_Class": ["I-9", "I-10", "I-11"],
      "Type_B_Class": ["I-15", "I-19", "I-21", "I-26"],
      "Type_B_3_Class": ["I-54", "I-56", "I-58"],
      "Type_C_Class": ["I-16", "I-18", "I-20", "I-22", "I-24"],
      "Type_C3_Class": ["I-52", "I-53", "I-55"],
      "Type_A_Modified": ["I-12", "I-13", "I-14"],
      "Sen_Toku_Class": ["I-400", "I-401", "I-402"],
      "Sen_Taka_Class": ["I-201", "I-202", "I-203"],
      "Type_A_Midget_Submarine___Ko_Hyoteki": ["HA-19", "HA-20", "HA-21"]
    };

    function isCommanderOrHigher() {
      if (typeof campaignState.currentRankIdx === 'number' && campaignState.currentRankIdx >= 3) return true;
      const rank = (campaignState.workflow && campaignState.workflow.commanderRank) || "";
      if (/Commander|Chusa|Captain|Taisa|Admiral|Shojo/i.test(rank) && !/Lt.*Cdr|Shosa/i.test(rank)) {
        return true;
      }
      return false;
    }

    function openSubUpgradeModal(mode = 'upgrade') {
      currentSubUpgradeMode = mode;
      const isEn = window.currentLang === 'en';
      const modal = document.getElementById('modal-sub-upgrade');
      if (!modal) return;

      const curMonth = (campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
      const activeSubKey = campaignState.activeSubKey || "Type_B_Class";
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const currentSubObj = subs[activeSubKey] || {};
      const rank = (campaignState.workflow && campaignState.workflow.commanderRank) || (RANKS[campaignState.currentRankIdx] || "Lt Cdr");
      const hasUpgradeToken = !!(campaignState.tokens && (campaignState.tokens['sub-upgrades'] || campaignState.tokens['token-sub-upgrades']));
      const isCdrPlus = isCommanderOrHigher();

      const titleEl = document.getElementById('sub-upgrade-modal-title');
      const bannerEl = document.getElementById('sub-upgrade-reason-banner');

      if (mode === 'replacement') {
        if (titleEl) titleEl.innerText = isEn ? "REASSIGNMENT TO REPLACEMENT SUBMARINE [RULE 9.2]" : "REASIGNACIÓN A SUBMARINO DE REEMPLAZO [REGLA 9.2]";
        if (bannerEl) {
          bannerEl.style.borderColor = '#ef4444';
          bannerEl.style.background = 'rgba(239, 68, 68, 0.15)';
          bannerEl.innerHTML = isEn
            ? `<strong>🚨 Reassignment due to Extended Refit (≥ 5 Months) [Rule 9.2]:</strong><br>Your boat requires prolonged repairs. The Commander is transferred to a new available submarine as of <strong>${curMonth}</strong>. This does not consume a Sub Upgrade token.`
            : `<strong>🚨 Reasignación por Refit Prolongado (≥ 5 Meses) [Regla 9.2]:</strong><br>Tu buque actual entra en gran carena por daños severos. El Comandante es transferido a un nuevo buque disponible en la fecha actual (<strong>${curMonth}</strong>). Esta sustitución oficial no consume ficha de mejora.`;
        }
      } else {
        if (titleEl) titleEl.innerText = isEn ? "REDEEM SUBMARINE UPGRADE (SUB UPGRADE) [RULE 9.3]" : "CANJEAR MEJORA DE SUBMARINO (SUB UPGRADE) [REGLA 9.3]";
        if (bannerEl) {
          bannerEl.style.borderColor = '#10b981';
          bannerEl.style.background = 'rgba(16, 185, 129, 0.15)';
          bannerEl.innerHTML = isEn
            ? `<strong>⭐ Voluntary Submarine Upgrade [Rule 9.3]:</strong><br>You may spend 1 "Sub Upgrade" chit/honor to transfer to any submarine commissioned on or before <strong>${curMonth}</strong>.<br><em style="color:#fde047;">★ Requirement: Sen-Toku (I-400) and Type A Modified require rank of Commander (Cdr) or higher.</em>`
            : `<strong>⭐ Canjear Mejora de Submarino [Regla 9.3]:</strong><br>Puedes canjear 1 ficha de "Sub Upgrade" (obtenida por condecoraciones, ascensos o graduación de honor) para comisionar cualquier submarino disponible en o antes de <strong>${curMonth}</strong>.<br><em style="color:#fde047;">★ Requisito Especial: El Sen-Toku (I-400) y el Tipo A Modificado exigen rango de Comandante (Commander / 中佐) o superior.</em>`;
        }
      }

      const dateEl = document.getElementById('sub-upgrade-current-date');
      if (dateEl) dateEl.innerText = curMonth;

      const curSubEl = document.getElementById('sub-upgrade-current-sub');
      if (curSubEl) curSubEl.innerText = (currentSubObj.class_name || activeSubKey) + (campaignState.workflow.hullNumber ? ` (${campaignState.workflow.hullNumber})` : '');

      const rankEl = document.getElementById('sub-upgrade-current-rank');
      if (rankEl) rankEl.innerText = rank + (isCdrPlus ? " (✓ Cdr+)" : "");

      const tokenEl = document.getElementById('sub-upgrade-token-status');
      if (tokenEl) {
        if (hasUpgradeToken) {
          tokenEl.innerText = isEn ? "✓ 1 Available" : "✓ 1 Disponible";
          tokenEl.style.color = "#a7f3d0";
        } else {
          tokenEl.innerText = isEn ? "0 Available" : "0 Disponibles";
          tokenEl.style.color = mode === 'replacement' ? "#94a3b8" : "#fca5a5";
        }
      }

      const selectEl = document.getElementById('sub-upgrade-select');
      if (selectEl) {
        selectEl.innerHTML = '';
        const keys = Object.keys(subs);
        let firstValidKey = null;

        keys.forEach(k => {
          const sub = subs[k];
          const startMonth = getSubmarineStartMonth(k);
          const isDateValid = (startMonth <= curMonth);
          const requiresCdr = (k === 'Sen_Toku_Class' || k === 'Type_A_Modified');
          const isRankBlocked = requiresCdr && !isCdrPlus;

          const opt = document.createElement('option');
          opt.value = k;

          if (!isDateValid) {
            opt.disabled = true;
            opt.innerText = isEn
              ? `⏳ ${sub.class_name || k} (Not available until ${startMonth})`
              : `⏳ ${sub.class_name || k} (Disponible a partir de ${startMonth})`;
            opt.style.color = '#64748b';
            opt.style.backgroundColor = '#071220';
          } else if (isRankBlocked) {
            opt.disabled = true;
            opt.innerText = isEn
              ? `🔒 ${sub.class_name || k} (Requires Commander / Cdr rank) [${startMonth}]`
              : `🔒 ${sub.class_name || k} (Requiere rango Commander / 中佐) [${startMonth}]`;
            opt.style.color = '#ef4444';
            opt.style.backgroundColor = '#071220';
          } else {
            opt.disabled = false;
            opt.innerText = isEn
              ? `🟢 ${sub.class_name || k} (Available ${sub.available_date || startMonth})`
              : `🟢 ${sub.class_name || k} (Disponible ${sub.available_date || startMonth})`;
            opt.style.color = '#a7f3d0';
            opt.style.backgroundColor = '#071b2d';
            if (!firstValidKey) firstValidKey = k;
          }

          if (k === activeSubKey) {
            opt.selected = true;
          }
          selectEl.appendChild(opt);
        });

        if (selectEl.selectedOptions[0] && selectEl.selectedOptions[0].disabled && firstValidKey) {
          selectEl.value = firstValidKey;
        }
      }

      onSubUpgradeSelectChange();
      modal.style.display = 'flex';
    }

    function closeSubUpgradeModal() {
      const modal = document.getElementById('modal-sub-upgrade');
      if (modal) modal.style.display = 'none';
    }

    function onSubUpgradeSelectChange() {
      const selectEl = document.getElementById('sub-upgrade-select');
      if (!selectEl) return;
      const subKey = selectEl.value;
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const s = subs[subKey];
      const isEn = window.currentLang === 'en';
      const isCdrPlus = isCommanderOrHigher();
      const requiresCdr = (subKey === 'Sen_Toku_Class' || subKey === 'Type_A_Modified');
      const isRankBlocked = requiresCdr && !isCdrPlus;
      const curMonth = (campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
      const startMonth = getSubmarineStartMonth(subKey);
      const isDateValid = (startMonth <= curMonth);

      const confirmBtn = document.getElementById('sub-upgrade-confirm-btn');
      const warningEl = document.getElementById('sub-upgrade-rank-warning');

      if (!isDateValid) {
        if (warningEl) {
          warningEl.style.display = 'block';
          warningEl.innerText = isEn ? `⏳ This submarine is not historically commissioned until ${startMonth}.` : `⏳ Este submarino no entra en servicio histórico hasta ${startMonth}.`;
        }
        if (confirmBtn) confirmBtn.disabled = true;
      } else if (isRankBlocked) {
        if (warningEl) {
          warningEl.style.display = 'block';
          warningEl.innerText = isEn ? "🔒 Requires rank of Commander (Cdr) or higher to commission this submarine [Rule 9.3]." : "🔒 Requiere rango de Commander (Cdr / 中佐) o superior para comisionar este submarino [Regla 9.3].";
        }
        if (confirmBtn) confirmBtn.disabled = true;
      } else {
        if (warningEl) warningEl.style.display = 'none';
        if (confirmBtn) confirmBtn.disabled = false;
      }

      const previewEl = document.getElementById('sub-upgrade-preview');
      if (previewEl && s) {
        const stats = s.stats || {};
        const tt = s.torpedo_tubes || {};
        const fwd = tt.fwd !== undefined ? tt.fwd : (tt.forward !== undefined ? tt.forward : 6);
        const aft = tt.aft !== undefined ? tt.aft : (tt.stern !== undefined ? tt.stern : 0);
        const rfwd = tt.reloads_fwd !== undefined ? tt.reloads_fwd : 0;
        const raft = tt.reloads_aft !== undefined ? tt.reloads_aft : 0;
        const reload = s.reload_capacity !== undefined ? s.reload_capacity : (rfwd + raft);
        const rldStr = raft > 0
          ? (isEn ? `(+${rfwd}F/${raft}A R)` : `(+${rfwd}P/${raft}P R)`)
          : `(+${reload}R)`;
        const tubeText = isEn ? `${fwd} Bow / ${aft} Stern ${rldStr}` : `${fwd} Proa / ${aft} Popa ${rldStr}`;
        const plane = s.has_aircraft ? (s.aircraft_type || 'Yokosuka E14Y Glen') : (isEn ? 'None' : 'Sin Hidroavión');
        const kaiten = s.has_kaiten ? (s.kaiten_note || (isEn ? '4–6 Kaiten' : '4–6 Kaiten')) : (isEn ? 'None' : 'Sin Kaiten');

        let dg = "1x 140mm";
        if (s.deck_guns && typeof s.deck_guns === 'object') dg = s.deck_guns.main || dg;
        let aa = "25mm AA";
        if (s.deck_guns && typeof s.deck_guns === 'object' && s.deck_guns.aa) aa = s.deck_guns.aa;

        let hullBoxes = 8;
        if (s.damage_capacity) {
          if (typeof s.damage_capacity === 'number') hullBoxes = s.damage_capacity;
          else if (s.damage_capacity.hull !== undefined) hullBoxes = s.damage_capacity.hull;
        }

        previewEl.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:6px; margin-bottom:8px;">
            <span style="font-weight:bold; color:var(--gold-300); font-size:1.02rem;">${s.full_title || s.class_name}</span>
            <span style="background:#071b2d; border:1px solid #0284c7; color:#38bdf8; font-size:0.75rem; padding:2px 8px; border-radius:4px;">${s.available_date || startMonth}</span>
          </div>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:8px; font-size:0.80rem;">
            <div><strong>${isEn ? 'Torp. Tubes' : 'Tubos Torpedo'}:</strong> <span style="color:#a7f3d0;">${tubeText}</span></div>
            <div><strong>${isEn ? 'Deck Gun' : 'Cañón de Cubierta'}:</strong> <span style="color:#fde047;">${dg}</span></div>
            <div><strong>${isEn ? 'AA Guns' : 'Artillería AA'}:</strong> <span style="color:#cbd5e1;">${aa}</span></div>
            <div><strong>${isEn ? 'Hull Damage' : 'Integridad Casco'}:</strong> <span style="color:#fca5a5;">${hullBoxes} ${isEn ? 'Boxes' : 'Casillas'}</span></div>
            <div><strong>${isEn ? 'Floatplane' : 'Hidroavión'}:</strong> <span style="color:#60a5fa;">${plane}</span></div>
            <div><strong>${isEn ? 'Kaiten' : 'Kaiten'}:</strong> <span style="color:#f472b6;">${kaiten}</span></div>
          </div>
          <div style="font-size:0.76rem; color:var(--slate-400); margin-top:8px; line-height:1.3;">
            ${s.special_rules || ''}
          </div>
        `;
      }

      const suggestions = HISTORIC_HULLS[subKey] || ["I-??"];
      const sugBox = document.getElementById('sub-upgrade-hull-suggestions');
      const hullInput = document.getElementById('sub-upgrade-hull-input');
      if (sugBox) {
        sugBox.innerHTML = '';
        suggestions.forEach(h => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'btn-xs';
          b.innerText = h;
          b.style.cssText = 'background:#1e293b; color:#38bdf8; border:1px solid #334155; padding:2px 6px; font-size:0.75rem; border-radius:4px; cursor:pointer;';
          b.onclick = () => { if (hullInput) hullInput.value = h; };
          sugBox.appendChild(b);
        });
      }

      if (hullInput && (!hullInput.value || hullInput.value.startsWith('I-') || hullInput.value.startsWith('HA-'))) {
        hullInput.value = suggestions[0];
      }
    }

    function confirmSubUpgrade() {
      const selectEl = document.getElementById('sub-upgrade-select');
      if (!selectEl) return;
      const newSubKey = selectEl.value;
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const s = subs[newSubKey];
      if (!s) return;

      const isEn = window.currentLang === 'en';
      const curMonth = (campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
      const startMonth = getSubmarineStartMonth(newSubKey);
      if (startMonth > curMonth) {
        showToast(isEn ? "Cannot select submarine prior to historical entry date." : "No se puede seleccionar este buque antes de su fecha histórica de comisionado.");
        return;
      }

      const isCdrPlus = isCommanderOrHigher();
      if ((newSubKey === 'Sen_Toku_Class' || newSubKey === 'Type_A_Modified') && !isCdrPlus) {
        showToast(isEn ? "Requires rank of Commander (Cdr) or higher." : "Requiere rango de Commander (Cdr / 中佐) o superior [Regla 9.3].");
        return;
      }

      const hullInput = document.getElementById('sub-upgrade-hull-input');
      const newHull = (hullInput && hullInput.value.trim()) ? hullInput.value.trim() : (HISTORIC_HULLS[newSubKey] ? HISTORIC_HULLS[newSubKey][0] : "I-??");

      if (currentSubUpgradeMode === 'upgrade') {
        const hasUpgradeToken = !!(campaignState.tokens && (campaignState.tokens['sub-upgrades'] || campaignState.tokens['token-sub-upgrades']));
        if (hasUpgradeToken) {
          if (typeof setK1Token === 'function') {
            setK1Token('sub-upgrades', false);
          }
          if (typeof renderTokens === 'function') {
            renderTokens();
          }
        }
      }

      campaignState.activeSubKey = newSubKey;
      campaignState.workflow.activeSubmarine = newSubKey;
      campaignState.workflow.hullNumber = newHull;

      const p0HullInput = document.getElementById('wf-sub-hull-number');
      if (p0HullInput) p0HullInput.value = newHull;

      const p0SubSelect = document.getElementById('wf-sub-class-select');
      if (p0SubSelect) p0SubSelect.value = newSubKey;

      if (typeof selectSubmarine === 'function') {
        selectSubmarine(newSubKey);
      }
      if (typeof updateWorkflowSubmarineSpecs === 'function') {
        updateWorkflowSubmarineSpecs();
      }
      if (typeof updateSchoolEquipDisplay === 'function') {
        updateSchoolEquipDisplay();
      }
      if (typeof recalculatePatrolTrack === 'function') {
        recalculatePatrolTrack();
      }

      const alertEl = document.getElementById('wf-refit-replacement-alert');
      if (alertEl && currentSubUpgradeMode === 'replacement') {
        alertEl.style.display = 'none';
      }

      if (campaignState.patrols && campaignState.patrols[curMonth]) {
        const p = campaignState.patrols[curMonth];
        const logNote = currentSubUpgradeMode === 'replacement'
          ? `Reasignado a nuevo buque de reemplazo ${s.class_name || newSubKey} (${newHull}) por refit ≥5 meses [Regla 9.2].`
          : `Mejora de submarino comisionada: ${s.class_name || newSubKey} (${newHull}) [Regla 9.3].`;
        p.notes = p.notes ? `${p.notes} • ${logNote}` : logNote;
      }

      closeSubUpgradeModal();
      saveState();

      const msg = currentSubUpgradeMode === 'replacement'
        ? (isEn ? `⚓ Reassigned to replacement submarine ${newHull} (${s.class_name}) [Rule 9.2]` : `⚓ Reasignado a nuevo buque de reemplazo: ${newHull} (${s.class_name}) [Regla 9.2]`)
        : (isEn ? `⚓ Submarine Upgrade redeemed! Commissioned: ${newHull} (${s.class_name}) [Rule 9.3]` : `⚓ ¡Mejora canjeada! Comisionado nuevo buque: ${newHull} (${s.class_name}) [Regla 9.3]`);

      showToast(msg);
    }

    window.openSubUpgradeModal = openSubUpgradeModal;
    window.closeSubUpgradeModal = closeSubUpgradeModal;
    window.onSubUpgradeSelectChange = onSubUpgradeSelectChange;
    window.confirmSubUpgrade = confirmSubUpgrade;
    window.isCommanderOrHigher = isCommanderOrHigher;
