// =========================================================================
// SENSUiKAN: GAME FLOW - PHASE 3: TACTICAL COMBAT SEQUENCE
// Target generation T1-T5, Torpedo Salvo calculation B1-B3, Escort counter-attack B4-B6 & combat sync.
// =========================================================================

function resolveTorpedoSalvo() {
      const isEn = (window.currentLang === 'en');
      const tubes = parseInt(document.getElementById('wf-tubes-fired').value) || 4;
      const range = document.getElementById('wf-range-select').value || 'medium';
      const attackMode = document.getElementById('wf-attack-mode-select').value || 'day_sub';
      const target = campaignState.workflow.currentTarget || { name: (isEn ? "Unknown Merchant" : "Mercante Desconocido"), tons: 4500, type: "Freighter" };

      // Threshold to hit by range (low roll hits!)
      let maxHitRoll = (range === 'close') ? 8 : (range === 'medium' ? 7 : 6);
      let drm = 0;
      if (attackMode.includes('surf')) drm -= 1; // Surface Torpedo -1 DRM
      if (campaignState.crewInjuries && campaignState.crewInjuries.captain) drm += 1; // Cmdte herido +1
      if (target.is_escort || target.type === 'Warship') drm += 2; // Escort / DD / DE +2

      let hits = 0;
      let duds = 0;
      let totalDamage = 0;
      let diceRowsHtml = '';

      for (let i = 1; i <= tubes; i++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const roll = d1 + d2;
        const modRoll = roll + drm;
        const isCrit = (roll === 2);

        let itemBg = 'rgba(15, 23, 42, 0.6)';
        let itemBorder = '#334155';
        let hitBadge = '';
        let dudBadge = '';
        let damageBadge = '';
        let outcomeText = isEn ? 'Miss' : 'Fallo';
        let outcomeBg = '#1e293b';
        let outcomeColor = '#94a3b8';
        let drmBadge = drm !== 0 ? `<span style="font-size:0.67rem; color:${drm < 0 ? '#4ade80' : '#f87171'};">DRM(${drm > 0 ? '+'+drm : drm})=${modRoll}</span>` : '';

        if (modRoll <= maxHitRoll || isCrit) {
          // Hit! Now check Chart B2 Dud (1d6 == 1)
          const dudDie = Math.floor(Math.random() * 6) + 1;
          if (dudDie === 1) {
            duds++;
            itemBg = 'rgba(180, 83, 9, 0.25)';
            itemBorder = '#d97706';
            hitBadge = `<span style="color:#fde047; font-weight:bold;">${isEn ? 'Hit!' : '¡Impacto!'}</span>`;
            dudBadge = `<span style="background:rgba(225,29,72,0.25); color:#fda4af; border:1px solid #e11d48; padding:1px 5px; border-radius:3px; font-weight:bold; font-size:0.68rem;">Dud [B2]: 🎲 1d6=[1] ❌ ${isEn ? 'Defective' : 'Defectuoso'}</span>`;
            outcomeText = isEn ? '0 Damage (Dud)' : '0 Daño (Dud)';
            outcomeBg = 'rgba(120, 53, 15, 0.6)';
            outcomeColor = '#fde68a';
          } else {
            hits++;
            // Chart B3 Attack Damage (1d6)
            const dmgDie = Math.floor(Math.random() * 6) + 1;
            let pts = (dmgDie === 1) ? 4 : (dmgDie <= 3 ? 3 : (dmgDie === 4 ? 2 : 1));
            if (isCrit) pts += 3; // Natural 2 is critical +3 damage
            totalDamage += pts;

            itemBg = 'rgba(6, 78, 59, 0.4)';
            itemBorder = '#059669';
            hitBadge = isCrit 
              ? `<span style="color:#fde047; font-weight:900;">⭐ ${isEn ? 'CRITICAL (Natural 2)!' : '¡CRÍTICO (2 Natural)!'}</span>`
              : `<span style="color:#4ade80; font-weight:bold;">${isEn ? 'HIT!' : '¡IMPACTO!'}</span>`;
            dudBadge = `<span style="color:#94a3b8; font-size:0.68rem;">Dud [B2]: 🎲 1d6=[${dudDie}] (OK)</span>`;
            damageBadge = `<span style="background:#0f172a; border:1px solid #059669; color:#fde047; padding:1px 5px; border-radius:3px; font-size:0.68rem; font-weight:bold;">${isEn ? 'Damage' : 'Daño'} [B3]: 🎲 1d6=[${dmgDie}]</span>`;
            outcomeText = `+${pts} ${isEn ? 'Damage' : 'Daño'}${isCrit ? (isEn ? ' (+3 Crit)' : ' (+3 Crítico)') : ''}`;
            outcomeBg = '#065f46';
            outcomeColor = '#6ee7b7';
          }
        } else {
          hitBadge = `<span style="color:#94a3b8;">${isEn ? 'Miss' : 'Fallo'} (${modRoll} vs &le;${maxHitRoll})</span>`;
        }

        diceRowsHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; background:${itemBg}; border:1px solid ${itemBorder}; border-radius:5px; padding:4px 8px; font-size:0.73rem; gap:6px;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span style="font-weight:bold; color:var(--gold-400); font-size:0.74rem;">🚀 ${isEn ? 'Tube' : 'Tubo'} #${i}:</span>
              <span style="background:#0f172a; padding:1px 5px; border-radius:3px; border:1px solid #334155; color:#fde047; font-weight:bold;">🎲 2d6: [${d1}+${d2}=${roll}]</span>
              ${drmBadge}
              ${hitBadge}
            </div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              ${dudBadge}
              ${damageBadge}
              <span style="font-weight:bold; font-size:0.72rem; color:${outcomeColor}; padding:1px 6px; border-radius:3px; background:${outcomeBg}; white-space:nowrap;">
                ${outcomeText}
              </span>
            </div>
          </div>
        `;
      }

      // Sinking requirement according to Chart B3:
      let reqPts = 2;
      if (target.tons <= 1000) reqPts = 1;
      else if (target.tons <= 5000) reqPts = 2;
      else if (target.tons < 10000) reqPts = 3;
      else reqPts = 4;
      if (target.pts_to_sink) reqPts = target.pts_to_sink;
      if (target.type === 'Capital') reqPts = Math.max(reqPts, 5);

      const isSunk = (totalDamage >= reqPts);
      let status = '';
      if (isEn) {
        status = isSunk
          ? `WARSHIP SUNK! (${totalDamage}/${reqPts} pts accumulated - ${(target.tons || 3000).toLocaleString()} tons)`
          : (hits > 0 ? `SHIP DAMAGED (${totalDamage}/${reqPts} pts required to sink)` : `MISSED SALVO (0 hits)`);
      } else {
        status = isSunk
          ? `¡BUQUE HUNDIDO! (${totalDamage}/${reqPts} pts acumulados - ${(target.tons || 3000).toLocaleString()} tons)`
          : (hits > 0 ? `BUQUE DAÑADO (${totalDamage}/${reqPts} pts necesarios para hundir)` : `SALVA FALLIDA (0 impactos)`);
      }

      let roguCategory = 'miss';
      if (isSunk) {
        if (target.type === 'Capital' || reqPts >= 5) {
          roguCategory = 'capital_sunk';
        } else if (campaignState.workflow.isSpecialMission || target.isSpecial) {
          roguCategory = 'special_sunk';
        } else {
          roguCategory = 'sunk';
        }
      } else if (hits > 0) {
        roguCategory = 'damaged';
      }

      campaignState.workflow.lastCombatHits = hits;
      campaignState.workflow.lastCombatDamage = totalDamage;
      campaignState.workflow.lastCombatIsSunk = isSunk;
      campaignState.workflow.lastCombatStatus = roguCategory;

      const hitResEl = document.getElementById('wf-combat-hit-res');
      if (hitResEl) {
        hitResEl.innerText = isEn 
          ? `${hits} EFFECTIVE HITS! (Duds: ${duds}) — ${totalDamage} damage pts`
          : `¡${hits} IMPACTOS EFECTIVOS! (Defectuosos: ${duds}) — ${totalDamage} pts de daño`;
      }
      const sinkStatusEl = document.getElementById('wf-combat-sink-status');
      if (sinkStatusEl) {
        sinkStatusEl.innerText = status;
      }

      // Update dice details container in DOM
      const diceBox = document.getElementById('wf-torpedo-dice-details');
      if (diceBox) {
        diceBox.innerHTML = `
          <div style="font-size:0.7rem; font-weight:bold; color:var(--slate-400); margin-top:4px; margin-bottom:2px; display:flex; justify-content:space-between;">
            <span>🎯 ${isEn ? 'Torpedo Tube Dice Breakdown (Charts B1, B2, B3):' : 'Desglose de Tiradas por Tubo (Charts B1, B2, B3):'}</span>
            <span style="color:#93c5fd;">${isEn ? 'LOW roll hits' : 'Tirada BAJA impacta'} (&le; ${maxHitRoll})</span>
          </div>
          ${diceRowsHtml}
        `;
      }

      // Auto-log to Rogu Bukku on effective hits
      if (hits > 0) {
        logCombatToRoguBukku(false);
      }

      showToast((isEn ? "Salvo resolved: " : "Salva resuelta: ") + status);
    }

    function rollB4Detection(manualRoll) {
      const isEn = (window.currentLang === 'en');
      let d1, d2, sum, isManual = false;
      if (typeof manualRoll === 'number' && manualRoll >= 2 && manualRoll <= 12) {
        sum = manualRoll;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
        isManual = true;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }
      const range = document.getElementById('wf-range-select').value || 'medium';
      let drm = (range === 'close') ? 1 : (range === 'long' ? -1 : 0);
      const total = sum + drm;
      const el = document.getElementById('wf-escort-res-text');

      if (total <= 8) {
        el.style.color = '#34d399';
        el.innerHTML = isEn
          ? `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [${d1} + ${d2} = ${sum}]${drm ? (drm > 0 ? ' +' + drm : ' ' + drm) : ''} = ${total}</span> ➔ <strong>UNDETECTED!</strong> Submarine evades safely without counter-attack.`
          : `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [${d1} + ${d2} = ${sum}]${drm ? (drm > 0 ? ' +' + drm : ' ' + drm) : ''} = ${total}</span> ➔ <strong>¡NO DETECTADO!</strong> El submarino escapa a salvo sin contraataque.`;
        showToast(isEn ? "Escorts evaded! No detection." : "¡Escoltas evadidas! No hay detección.");
      } else if (total <= 10) {
        el.style.color = '#f59e0b';
        el.innerHTML = isEn
          ? `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [${d1} + ${d2} = ${sum}]${drm ? (drm > 0 ? ' +' + drm : ' ' + drm) : ''} = ${total}</span> ➔ <strong>DETECTED!</strong> Escorts initiate depth charge attack (Chart B5).`
          : `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [${d1} + ${d2} = ${sum}]${drm ? (drm > 0 ? ' +' + drm : ' ' + drm) : ''} = ${total}</span> ➔ <strong>¡DETECTADO!</strong> Las escoltas inician ataque con cargas de profundidad (Chart B5).`;
        showToast(isEn ? "Warning! Submarine detected by escort." : "¡Alerta! Submarino detectado por la escolta.");
      } else {
        el.style.color = '#ef4444';
        el.innerHTML = isEn
          ? `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [${d1} + ${d2} = ${sum}]${drm ? (drm > 0 ? ' +' + drm : ' ' + drm) : ''} = ${total}</span> ➔ <strong>DETECTED (+1 ATTACK)!</strong> Escorts conduct 1 additional depth charge attack.`
          : `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [${d1} + ${d2} = ${sum}]${drm ? (drm > 0 ? ' +' + drm : ' ' + drm) : ''} = ${total}</span> ➔ <strong>¡DETECTADO (+1 ATAQUE)!</strong> Las escoltas realizan 1 ataque adicional.`;
        showToast(isEn ? "Firm contact! Escort detects with bonus attack." : "¡Contacto firme! Escolta detecta con ataque reforzado.");
      }
    }

    // ESCORT COUNTER-ATTACK & SUB DAMAGE (CHARTS B5 & B6)
    function rollEscortCounterAttack(manualRoll) {
      const isEn = (window.currentLang === 'en');
      let d1, d2, sum, isManual = false;
      if (typeof manualRoll === 'number' && manualRoll >= 2 && manualRoll <= 12) {
        sum = manualRoll;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
        isManual = true;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }
      const el = document.getElementById('wf-escort-res-text');

      let hits = 0;
      if (sum <= 3) hits = 0;
      else if (sum <= 6) hits = 1;
      else if (sum <= 8) hits = 2;
      else if (sum <= 10) hits = 3;
      else if (sum === 11) hits = 4;
      else if (sum === 12) hits = 5;
      else hits = 99; // Sunk

      if (hits === 0) {
        el.style.color = '#34d399';
        el.innerHTML = isEn
          ? `<span style="color:#fde047; font-weight:800;">🎲 Chart B5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ <strong>Ineffective</strong>. Depth charges explode far off without damage.`
          : `<span style="color:#fde047; font-weight:800;">🎲 Chart B5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ <strong>Ineficaz</strong>. Las cargas explotan lejos sin causar averías.`;
        showToast(isEn ? "Escort attack ineffective." : "Ataque de escolta ineficaz.");
        return;
      } else if (hits === 99) {
        el.style.color = '#ef4444';
        el.innerHTML = isEn
          ? `💥 <span style="color:#fde047; font-weight:800;">Chart B5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ <strong>SUBMARINE SUNK!</strong> Direct hits rupture pressure hull. Campaign ends.`
          : `💥 <span style="color:#fde047; font-weight:800;">Chart B5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ <strong>¡SUBMARINO HUNDIDO!</strong> Cargas directas quiebran el casco. Fin de campaña.`;
        showToast(isEn ? "DISASTER! Submarine destroyed by depth charges." : "¡DESASTRE! Submarino destruido por cargas de profundidad.");
        return;
      }

      // Roll Chart B6 (d66) for each hit
      const dmgList = [];
      for (let h = 1; h <= hits; h++) {
        const red = Math.floor(Math.random() * 6) + 1;
        const white = Math.floor(Math.random() * 6) + 1;
        const d66 = red * 10 + white;
        let desc = CHART_B6_TABLE[d66] || (isEn ? "Minor Damage" : "Avería Menor");
        if (isEn && window.I18N_PHASE3_B6_EN && window.I18N_PHASE3_B6_EN[d66]) {
          desc = window.I18N_PHASE3_B6_EN[d66];
        }
        dmgList.push(isEn 
          ? `Hit #${h}: 🎲 d66 = [Red: ${red}, White: ${white} ➔ ${d66}]: <strong>${desc}</strong>`
          : `Impacto #${h}: 🎲 d66 = [Rojo: ${red}, Blanco: ${white} ➔ ${d66}]: <strong>${desc}</strong>`);
      }

      el.style.color = '#fca5a5';
      el.innerHTML = isEn
        ? `⚠️ <strong>Chart B5: 2d6 = [${d1} + ${d2} = ${sum}] ➔ ${hits} DEPTH CHARGE HITS!</strong><br>` + dmgList.join('<br>')
        : `⚠️ <strong>Chart B5: 2d6 = [${d1} + ${d2} = ${sum}] ➔ ¡${hits} IMPACTOS DE CARGAS!</strong><br>` + dmgList.join('<br>');
      showToast(isEn ? `Damage taken! ${hits} depth charge hits.` : `¡Averías sufridas! ${hits} impactos de cargas de profundidad.`);
    }

    function logCombatToRoguBukku(manualClick = true) {
      const isEn = (window.currentLang === 'en');
      const t = campaignState.workflow.currentTarget || { name: (isEn ? "Unknown Merchant" : "Mercante Desconocido"), tons: 4500, type: "Freighter" };
      const mId = campaignState.workflow.selectedMonth || "1941-12";
      syncCurrentPatrolToLog();

      const status = campaignState.workflow.lastCombatStatus || (campaignState.workflow.lastCombatIsSunk ? 'sunk' : 'damaged');
      if (status === 'miss') {
        if (manualClick) showToast(isEn ? "Salvo missed; no entry logged." : "La salva no obtuvo impactos; no se anota en el registro.");
        return;
      }

      const patrol = campaignState.patrols[mId];
      if (!Array.isArray(patrol.targets)) patrol.targets = [];

      const targetObj = {
        name: t.name || (isEn ? "Enemy Ship" : "Buque Enemigo"),
        type: t.type || "Freighter",
        tons: parseInt(t.tons) || 0,
        status: status, // 'capital_sunk', 'damaged', 'sunk', 'special_sunk'
        hits: campaignState.workflow.lastCombatHits || 1,
        damage: campaignState.workflow.lastCombatDamage || 1,
        sunk: (status !== 'damaged'),
        date: mId,
        notes: isEn
          ? `${campaignState.workflow.lastCombatHits || 1} hits, ${campaignState.workflow.lastCombatDamage || 1} dmg pts`
          : `${campaignState.workflow.lastCombatHits || 1} impactos, ${campaignState.workflow.lastCombatDamage || 1} pts daño`
      };

      let slotNum = 1;
      const loggedIdx = campaignState.workflow.lastCombatLoggedTargetIndex;

      if (loggedIdx !== undefined && loggedIdx !== null && patrol.targets[loggedIdx]) {
        // Update existing slot
        patrol.targets[loggedIdx] = targetObj;
        slotNum = loggedIdx + 1;
      } else {
        if (patrol.targets.length >= 8) {
          showToast(isEn ? "⚠️ Max capacity reached in Rogu Bukku (8 targets per patrol)." : "⚠️ Capacidad máxima alcanzada en el Rogu Bukku (8 blancos por patrulla).");
          return;
        }
        patrol.targets.push(targetObj);
        slotNum = patrol.targets.length;
        campaignState.workflow.lastCombatLoggedTargetIndex = slotNum - 1;
      }

      // Recalculate month tonnage
      patrol.tons = patrol.targets.filter(x => x && x.sunk).reduce((acc, x) => acc + (parseInt(x.tons) || 0), 0);

      buildPatrolTable();
      saveState();

      const chipBadge = status === 'capital_sunk' ? (isEn ? '🟩 Capital Ship Sunk' : '🟩 Buque Capital Hundido')
        : (status === 'damaged' ? (isEn ? '🟦 Damaged - Not Sunk' : '🟦 Dañado - No Hundido')
        : (status === 'special_sunk' ? (isEn ? '🟧 Special Mission - Sunk' : '🟧 Misión Especial - Hundido') : (isEn ? '🟥 Sunk' : '🟥 Hundido')));

      const statusEl = document.getElementById('wf-rogu-log-status');
      if (statusEl) {
        statusEl.innerHTML = isEn
          ? `<span style="color:#22c55e; font-weight:800;">✅ Logged to Rogu Bukku:</span> Slot <strong>#${slotNum}</strong> (${chipBadge}) • <strong>+${targetObj.tons.toLocaleString()} t</strong>`
          : `<span style="color:#22c55e; font-weight:800;">✅ Registrado en Rogu Bukku:</span> Casilla <strong>#${slotNum}</strong> (${chipBadge}) • <strong>+${targetObj.tons.toLocaleString()} t</strong>`;
      }
      if (manualClick) {
        showToast(isEn
          ? `Target logged to Rogu Bukku! Slot #${slotNum}: ${targetObj.name} (${chipBadge})`
          : `¡Blanco registrado en Rogu Bukku! Casilla #${slotNum}: ${targetObj.name} (${chipBadge})`);
      }
    }

    // Phase 4: Repairs


function applyManualTorpedoHits() {
  const isEn = (window.currentLang === 'en');
  const hits = parseInt(document.getElementById('wf-manual-hits-select').value) || 0;
  const duds = parseInt(document.getElementById('wf-manual-duds-select').value) || 0;
  let dmg = parseInt(document.getElementById('wf-manual-dmg-input').value);
  if (isNaN(dmg) || dmg < 0) dmg = hits * 3;
  const target = campaignState.workflow.currentTarget || { name: (isEn ? "Unknown Merchant" : "Mercante Desconocido"), tons: 4500, type: "Freighter" };

  let reqPts = 2;
  if (target.tons <= 1000) reqPts = 1;
  else if (target.tons <= 5000) reqPts = 2;
  else if (target.tons < 10000) reqPts = 3;
  else reqPts = 4;
  if (target.pts_to_sink) reqPts = target.pts_to_sink;
  if (target.type === 'Capital') reqPts = Math.max(reqPts, 5);

  const isSunk = (dmg >= reqPts);
  let status = '';
  if (isEn) {
    status = isSunk
      ? `WARSHIP SUNK! (${dmg}/${reqPts} pts accumulated - ${(target.tons || 3000).toLocaleString()} tons)`
      : (hits > 0 ? `SHIP DAMAGED (${dmg}/${reqPts} pts required to sink)` : `MISSED SALVO (0 hits)`);
  } else {
    status = isSunk
      ? `¡BUQUE HUNDIDO! (${dmg}/${reqPts} pts acumulados - ${(target.tons || 3000).toLocaleString()} tons)`
      : (hits > 0 ? `BUQUE DAÑADO (${dmg}/${reqPts} pts necesarios para hundir)` : `SALVA FALLIDA (0 impactos)`);
  }

  let roguCategory = 'miss';
  if (isSunk) {
    if (target.type === 'Capital' || reqPts >= 5) {
      roguCategory = 'capital_sunk';
    } else if (campaignState.workflow.isSpecialMission || target.isSpecial) {
      roguCategory = 'special_sunk';
    } else {
      roguCategory = 'sunk';
    }
  } else if (hits > 0) {
    roguCategory = 'damaged';
  }

  campaignState.workflow.lastCombatHits = hits;
  campaignState.workflow.lastCombatDamage = dmg;
  campaignState.workflow.lastCombatIsSunk = isSunk;
  campaignState.workflow.lastCombatStatus = roguCategory;

  const hitResEl = document.getElementById('wf-combat-hit-res');
  if (hitResEl) {
    hitResEl.innerText = isEn 
      ? `[TABLETOP] ${hits} EFFECTIVE HITS! (Duds: ${duds}) — ${dmg} damage pts`
      : `[MESA] ¡${hits} IMPACTOS EFECTIVOS! (Defectuosos: ${duds}) — ${dmg} pts de daño`;
  }
  const sinkStatusEl = document.getElementById('wf-combat-sink-status');
  if (sinkStatusEl) {
    sinkStatusEl.innerText = status;
  }

  const diceBox = document.getElementById('wf-torpedo-dice-details');
  if (diceBox) {
    diceBox.innerHTML = `
      <div style="background:rgba(6, 78, 59, 0.4); border:1px solid #059669; border-radius:5px; padding:6px 10px; font-size:0.75rem; color:#a7f3d0;">
        <strong>🎯 ${isEn ? 'Tabletop Salvo Applied:' : 'Salva de Mesa Aplicada:'}</strong>
        ${hits} ${isEn ? 'hits' : 'impactos'}, ${duds} ${isEn ? 'duds' : 'defectuosos'}, ${dmg} ${isEn ? 'damage points' : 'puntos de daño'}.
      </div>
    `;
  }

  if (hits > 0) {
    logCombatToRoguBukku(false);
  }
  showToast((isEn ? "Tabletop salvo applied: " : "Salva de mesa aplicada: ") + status);
}


// =========================================================================
// RULE 8.2.9: SUBMARINE VS SUBMARINE COMBAT
// =========================================================================
function checkSubVsSubTarget(target) {
  const card = document.getElementById('wf-sub-vs-sub-card');
  if (!card) return;
  const isSub = !!(target && (target.is_sub || target.isSub || (target.name && target.name.startsWith('SS '))));
  card.style.display = isSub ? 'block' : 'none';
  if (isSub) {
    const resEl = document.getElementById('wf-sub-initiative-res');
    if (resEl) resEl.innerHTML = '';
  }
}

function rollSubVsSubInitiative() {
  const isEn = (window.currentLang === 'en');
  const d10 = Math.floor(Math.random() * 10) + 1; // 1 to 10 (10 is 0)
  const playerWins = (d10 <= 3);
  setSubVsSubInitiative(playerWins, d10);
}

function setSubVsSubInitiative(playerWins, rollVal) {
  const isEn = (window.currentLang === 'en');
  const resEl = document.getElementById('wf-sub-initiative-res');
  if (!resEl) return;
  const rollStr = rollVal ? `(🎲 1d10 = [${rollVal}]) ` : '';
  if (playerWins) {
    resEl.style.color = '#34d399';
    resEl.innerHTML = `✅ ${rollStr}<strong>${isEn ? 'IJN INITIATIVE!' : '¡INICIATIVA IJN!'}</strong> ${isEn ? 'You may attack first from medium range, or decline combat safely.' : 'Tienes la iniciativa: puedes atacar primero a media distancia o evitar el contacto.'}`;
    showToast(isEn ? "Sub vs Sub: You hold the initiative!" : "¡Sub vs Sub: Tienes la iniciativa!");
  } else {
    resEl.style.color = '#f87171';
    resEl.innerHTML = `⚠️ ${rollStr}<strong>${isEn ? 'ENEMY ATTACKS FIRST!' : '¡EL ENEMIGO ATACA PRIMERO!'}</strong> ${isEn ? 'US submarine fires a 4-torpedo salvo from medium range at your submarine.' : 'El submarino estadounidense detecta y lanza 4 torpedos contra tu buque a media distancia.'}`;
    showToast(isEn ? "Warning! Enemy submarine fires first salvo!" : "¡Alerta! Submarino enemigo dispara primero.");
  }
}

// =========================================================================
// RULE 8.4: FOLLOWING A CONVOY OR DAMAGED SHIP
// =========================================================================
function followConvoyNextRound() {
  const isEn = (window.currentLang === 'en');
  const target = campaignState.workflow.currentTarget || {};
  const isDamaged = (campaignState.workflow.lastCombatDamage > 0 && !campaignState.workflow.lastCombatIsSunk);

  let success = false;
  let msg = '';

  if (target.type === 'Capital') {
    // Capital ship: Roll 1d6, modified 1 means caught
    const d = Math.floor(Math.random() * 6) + 1;
    success = (d === 1);
    msg = isEn 
      ? `Capital Ship Pursuit (Rule 8.4.2): 🎲 1d6 = [${d}] ➔ ${success ? 'CAUGHT! Additional combat round.' : 'Escaped! Too fast to catch.'}`
      : `Persecución de Buque Capital [8.4.2]: 🎲 1d6 = [${d}] ➔ ${success ? '¡ALCANZADO! 2.ª ronda de combate.' : '¡Escapó! Demasiado rápido.'}`;
  } else {
    // Damaged freighter / escort or convoy: automatic follow
    const d = Math.floor(Math.random() * 6) + 1;
    const isEscorted = (d <= 4);
    success = true;
    msg = isEn
      ? `Convoy Followed [8.4]: 🎲 1d6=[${d}] ➔ Target is ${isEscorted ? 'still escorted' : 'now a STRAGGLER (unescorted)!'}`
      : `Convoy Seguido [8.4]: 🎲 1d6=[${d}] ➔ El blanco está ${isEscorted ? 'aún escoltado' : '¡REZAGADO (sin escolta)!'}`;
  }

  showToast(msg);
  const statusEl = document.getElementById('wf-combat-hit-res');
  if (statusEl) {
    statusEl.innerText = isEn ? "Ready for 2nd Combat Round [Rule 8.4]" : "Listo para 2.ª Ronda de Combate [Regla 8.4]";
  }
  const sinkEl = document.getElementById('wf-combat-sink-status');
  if (sinkEl) {
    sinkEl.innerText = msg;
  }
}
