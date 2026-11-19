// =========================================================================
// SENSUiKAN: GAME FLOW - PHASE 3: TACTICAL COMBAT SEQUENCE
// Target generation T1-T5, Torpedo Salvo calculation B1-B3, Escort counter-attack B4-B6 & combat sync.
// =========================================================================

function syncPhase3TorpedoOptions() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8, aftReloads: 2 };

  const attackModeSelect = document.getElementById('wf-attack-mode-select');
  const attackMode = attackModeSelect ? attackModeSelect.value : 'submerged';

  if (typeof subBoardState === 'undefined') return;

  // Check system damage
  const fwdDoorDmg = subBoardState.systems && (subBoardState.systems['f-doors'] === 'dmg' || subBoardState.systems['fwd_torp'] === 'dmg');
  const fwdOddDmg = subBoardState.systems && subBoardState.systems['f-doors-odd'] === 'dmg';
  const fwdEvenDmg = subBoardState.systems && subBoardState.systems['f-doors-even'] === 'dmg';
  const aftDoorDmg = subBoardState.systems && subBoardState.systems['aft-doors'] === 'dmg';
  const periscopeDmg = subBoardState.systems && subBoardState.systems['periscope'] === 'dmg';
  const deckGunDmg = !!subBoardState.deckGunDamaged;
  const ammoCount = (subBoardState.ammo !== undefined) ? subBoardState.ammo : 5;

  // Count loaded tubes
  let loadedFwd = 0;
  let operFwd = 0;
  let fwdTubesHtml = '';
  for (let i = 1; i <= cfg.fwdTubes; i++) {
    const isLoaded = (subBoardState.tubes && subBoardState.tubes[i] === true);
    const torpType = (subBoardState.tubeTypes && subBoardState.tubeTypes[i]) || 'type95';
    const isInop = fwdDoorDmg || (i % 2 !== 0 && fwdOddDmg) || (i % 2 === 0 && fwdEvenDmg);
    if (isLoaded) loadedFwd++;
    if (isLoaded && !isInop) operFwd++;

    const badgeBg = isInop ? '#7f1d1d' : (isLoaded ? '#065f46' : '#1e293b');
    const badgeColor = isInop ? '#fca5a5' : (isLoaded ? '#6ee7b7' : '#94a3b8');
    const border = isInop ? '#ef4444' : (isLoaded ? '#10b981' : '#475569');
    const icon = isInop ? '⚠️' : (isLoaded ? '🟢' : '💥');
    const typeShort = torpType === 'type95' ? 'T95' : (torpType === 'type92' ? 'T92' : 'T89');
    const label = isInop ? `${icon} T${i} [Inop]` : (isLoaded ? `${icon} T${i} [${typeShort}]` : `${icon} T${i} [Vacío]`);
    fwdTubesHtml += `<span style="background:${badgeBg}; color:${badgeColor}; border:1px solid ${border}; border-radius:4px; padding:2px 5px; font-size:0.70rem; font-weight:bold; white-space:nowrap;">${label}</span>`;
  }

  let loadedAft = 0;
  let operAft = 0;
  let aftTubesHtml = '';
  if (cfg.aftTubes > 0) {
    for (let a = 1; a <= cfg.aftTubes; a++) {
      const idx = cfg.fwdTubes + a;
      const isLoaded = (subBoardState.tubes && subBoardState.tubes[idx] === true);
      const torpType = (subBoardState.tubeTypes && subBoardState.tubeTypes[idx]) || 'type95';
      const isInop = aftDoorDmg;
      if (isLoaded) loadedAft++;
      if (isLoaded && !isInop) operAft++;

      const badgeBg = isInop ? '#7f1d1d' : (isLoaded ? '#065f46' : '#1e293b');
      const badgeColor = isInop ? '#fca5a5' : (isLoaded ? '#6ee7b7' : '#94a3b8');
      const border = isInop ? '#ef4444' : (isLoaded ? '#10b981' : '#475569');
      const icon = isInop ? '⚠️' : (isLoaded ? '🟢' : '💥');
      const typeShort = torpType === 'type95' ? 'T95' : (torpType === 'type92' ? 'T92' : 'T89');
      const label = isInop ? `${icon} T${idx} [Inop]` : (isLoaded ? `${icon} T${idx} [${typeShort}]` : `${icon} T${idx} [Vacío]`);
      aftTubesHtml += `<span style="background:${badgeBg}; color:${badgeColor}; border:1px solid ${border}; border-radius:4px; padding:2px 5px; font-size:0.70rem; font-weight:bold; white-space:nowrap;">${label}</span>`;
    }
  }

  // Count reloads
  let availReloads = 0;
  if (subBoardState.reloads) {
    for (let r = 1; r <= (cfg.fwdReloads || 16); r++) {
      if (subBoardState.reloads[r] === true) availReloads++;
    }
    if (subBoardState.reloads['aft_1'] === true) availReloads++;
    if (subBoardState.reloads['aft_2'] === true) availReloads++;
  }

  // Update HUD elements in DOM
  const subNameEl = document.getElementById('p3-hud-sub-name');
  if (subNameEl) {
    let subDisplay = subKey.replace(/_/g, ' ');
    if (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]) {
      subDisplay = SUB_DB.submarines[subKey].name || subDisplay;
    }
    subNameEl.innerText = subDisplay;
  }
  const subClassEl = document.getElementById('p3-hud-sub-class');
  if (subClassEl) {
    subClassEl.innerText = `${cfg.fwdTubes} ${isEn ? "Bow" : "Proa"} • ${cfg.aftTubes} ${isEn ? "Stern" : "Popa"} • ${cfg.fwdReloads + cfg.aftReloads} ${isEn ? "Max Reloads" : "Recargas Máx."}`;
  }

  const fwdCountEl = document.getElementById('p3-hud-fwd-count');
  if (fwdCountEl) {
    fwdCountEl.innerText = `${loadedFwd} / ${cfg.fwdTubes} ${isEn ? "Loaded" : "Cargados"}${fwdDoorDmg ? (isEn ? " (DOORS INOP)" : " (PUERTAS INOP)") : ""}`;
    fwdCountEl.style.color = (operFwd > 0) ? '#a7f3d0' : '#f87171';
  }
  const fwdBadgesEl = document.getElementById('p3-hud-fwd-tubes-badges');
  if (fwdBadgesEl) fwdBadgesEl.innerHTML = fwdTubesHtml;

  const aftContainer = document.getElementById('p3-hud-aft-container');
  if (aftContainer) {
    if (cfg.aftTubes > 0) {
      aftContainer.style.display = 'block';
      const aftCountEl = document.getElementById('p3-hud-aft-count');
      if (aftCountEl) {
        aftCountEl.innerText = `${loadedAft} / ${cfg.aftTubes} ${isEn ? "Loaded" : "Cargados"}${aftDoorDmg ? (isEn ? " (DOORS INOP)" : " (PUERTAS INOP)") : ""}`;
        aftCountEl.style.color = (operAft > 0) ? '#a7f3d0' : '#f87171';
      }
      const aftBadgesEl = document.getElementById('p3-hud-aft-tubes-badges');
      if (aftBadgesEl) aftBadgesEl.innerHTML = aftTubesHtml;
    } else {
      aftContainer.style.display = 'none';
    }
  }

  const reloadsCountEl = document.getElementById('p3-hud-reloads-count');
  if (reloadsCountEl) {
    reloadsCountEl.innerText = `${availReloads} ${isEn ? "torpedoes available" : "torpedos disponibles"}`;
  }
  const ammoCountEl = document.getElementById('p3-hud-ammo-count');
  if (ammoCountEl) {
    ammoCountEl.innerHTML = deckGunDmg 
      ? `<span style="color:#ef4444; font-weight:bold;">⚠️ ${isEn ? "DAMAGED" : "AVERIADO"} (${ammoCount} shells)</span>`
      : `${ammoCount} / 5 ${isEn ? "shells" : "proyectiles"}`;
  }

  const warningsEl = document.getElementById('p3-hud-damage-warnings');
  if (warningsEl) {
    let warnList = [];
    if (fwdDoorDmg) warnList.push(isEn ? '⚠️ Fwd Torpedo Doors Damaged (Cannot fire bow)' : '⚠️ Compuertas de Proa averiadas (No puede disparar proa)');
    if (fwdOddDmg) warnList.push(isEn ? '⚠️ Fwd Odd Doors Damaged (Tubes 1,3,5,7 INOP)' : '⚠️ Compuertas Impares averiadas (Tubos 1,3,5,7 INOP)');
    if (fwdEvenDmg) warnList.push(isEn ? '⚠️ Fwd Even Doors Damaged (Tubes 2,4,6,8 INOP)' : '⚠️ Compuertas Pares averiadas (Tubos 2,4,6,8 INOP)');
    if (aftDoorDmg && cfg.aftTubes > 0) warnList.push(isEn ? '⚠️ Aft Torpedo Doors Damaged (Cannot fire stern)' : '⚠️ Compuertas de Popa averiadas (No puede disparar popa)');
    if (periscopeDmg) warnList.push(isEn ? '⚠️ Periscope Damaged (+1 DRM submerged attacks)' : '⚠️ Periscopio averiado (+1 DRM en inmersión)');
    if (deckGunDmg) warnList.push(isEn ? '⚠️ Deck Gun Damaged (Inoperable)' : '⚠️ Cañón de cubierta averiado (Inoperativo)');
    warningsEl.innerHTML = warnList.join('<br>');
  }

  // Update tubes fired dropdown and fire button
  const tubesSelect = document.getElementById('wf-tubes-fired');
  const fireBtn = document.getElementById('p3-btn-fire');
  const tubesLbl = document.getElementById('p3-tubes-lbl');

  if (attackMode === 'gun') {
    if (tubesLbl) tubesLbl.innerText = isEn ? "Gun Shots:" : "Disparos de Cañón:";
    if (tubesSelect) {
      tubesSelect.innerHTML = `<option value="1">1 ${isEn ? "Shot (Deck Gun)" : "Disparo (Cañón de Cubierta)"}</option>`;
      tubesSelect.disabled = deckGunDmg || ammoCount <= 0;
    }
    if (fireBtn) {
      if (deckGunDmg) {
        fireBtn.disabled = true;
        fireBtn.style.background = '#475569';
        fireBtn.style.borderColor = '#64748b';
        fireBtn.innerText = isEn ? '⚠️ Deck Gun Damaged' : '⚠️ Cañón de Cubierta Averiado';
      } else if (ammoCount <= 0) {
        fireBtn.disabled = true;
        fireBtn.style.background = '#475569';
        fireBtn.style.borderColor = '#64748b';
        fireBtn.innerText = isEn ? '⚠️ Out of Ammo (0)' : '⚠️ Sin Munición de Cañón (0)';
      } else {
        fireBtn.disabled = false;
        fireBtn.style.background = 'linear-gradient(135deg, #d97706 0%, #b45309 100%)';
        fireBtn.style.borderColor = '#f59e0b';
        fireBtn.innerText = isEn ? '💥 FIRE DECK GUN!' : '💥 ¡FUEGO DE CAÑÓN!';
      }
    }
    return;
  }

  // Torpedo modes: submerged vs surface_night
  if (tubesLbl) tubesLbl.innerText = isEn ? "Tubes Fired:" : "Tubos Disparados:";
  const maxAvailable = (attackMode === 'surface_night') ? (operFwd + operAft) : operFwd;

  if (tubesSelect) {
    const curVal = parseInt(tubesSelect.value) || 4;
    let optsHtml = '';
    if (maxAvailable === 0) {
      optsHtml = `<option value="0">0 ${isEn ? "Torpedoes (No tubes available)" : "Torpedos (Sin tubos operativos)"}</option>`;
    } else {
      for (let n = 1; n <= maxAvailable; n++) {
        let tag = '';
        if (n === 2) tag = isEn ? " (Reduced Salvo)" : " (Salva Reducida)";
        else if (n === 4) tag = isEn ? " (Standard Salvo)" : " (Salva Estándar)";
        else if (n === 6) tag = isEn ? " (Full Bow Salvo)" : " (Salva Completa Proa)";
        else if (n === 8) tag = isEn ? " (Maximum Salvo)" : " (Salva Máxima)";
        optsHtml += `<option value="${n}">${n} ${isEn ? "Torpedoes" : "Torpedos"}${tag}</option>`;
      }
    }
    tubesSelect.innerHTML = optsHtml;
    tubesSelect.disabled = (maxAvailable === 0);

    // Try to preserve previous choice or pick nearest valid
    if (maxAvailable > 0) {
      if (curVal >= 1 && curVal <= maxAvailable) {
        tubesSelect.value = String(curVal);
      } else if (maxAvailable >= 4) {
        tubesSelect.value = "4";
      } else if (maxAvailable >= 2) {
        tubesSelect.value = "2";
      } else {
        tubesSelect.value = String(maxAvailable);
      }
    }
  }

  if (fireBtn) {
    if (maxAvailable === 0) {
      fireBtn.disabled = true;
      fireBtn.style.background = '#475569';
      fireBtn.style.borderColor = '#64748b';
      fireBtn.innerText = isEn ? '⚠️ No Loaded Operative Tubes' : '⚠️ Sin Torpedos Cargados en Tubos Operativos';
    } else {
      fireBtn.disabled = false;
      fireBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      fireBtn.style.borderColor = '#10b981';
      fireBtn.innerText = isEn ? '🚀 FIRE! (Launch Virtual Salvo)' : '🚀 ¡FUEGO! (Lanzar Salva Virtual)';
    }
  }
}
window.syncPhase3TorpedoOptions = syncPhase3TorpedoOptions;

function resolveTorpedoSalvo() {
  const isEn = (window.currentLang === 'en');
  const attackMode = document.getElementById('wf-attack-mode-select') ? document.getElementById('wf-attack-mode-select').value : 'submerged';
  const target = campaignState.workflow.currentTarget || { name: (isEn ? "Unknown Merchant" : "Mercante Desconocido"), tons: 4500, type: "Freighter" };
  const range = document.getElementById('wf-range-select') ? document.getElementById('wf-range-select').value : 'medium';

  // Sinking requirement according to Chart B3:
  let reqPts = 2;
  if (target.tons <= 1000) reqPts = 1;
  else if (target.tons <= 5000) reqPts = 2;
  else if (target.tons < 10000) reqPts = 3;
  else reqPts = 4;
  if (target.pts_to_sink) reqPts = target.pts_to_sink;
  if (target.type === 'Capital') reqPts = Math.max(reqPts, 5);

  if (attackMode === 'gun') {
    // ----------------------------------------------------
    // GUN ATTACK MODE (CAÑÓN DE CUBIERTA)
    // ----------------------------------------------------
    if (subBoardState.deckGunDamaged) {
      showToast(isEn ? "⚠️ Deck Gun is damaged and cannot fire!" : "⚠️ ¡El cañón de cubierta está averiado y no puede disparar!");
      return;
    }
    const currentAmmo = (subBoardState.ammo !== undefined) ? subBoardState.ammo : 5;
    if (currentAmmo <= 0) {
      showToast(isEn ? "⚠️ Out of Deck Gun ammunition!" : "⚠️ ¡Sin munición para el cañón de cubierta!");
      return;
    }

    // Deduct 1 ammo
    subBoardState.ammo = Math.max(0, currentAmmo - 1);
    saveSubBoardState();
    if (typeof saveState === 'function') saveState();
    if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
    if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();

    // Table B1 Gun column: Close 2-8, Medium 2-7, Long 2-6
    let maxHitRoll = (range === 'close') ? 8 : (range === 'medium' ? 7 : 6);
    let drm = 0;
    if (campaignState.crewInjuries && campaignState.crewInjuries.captain) drm += 1;
    if (target.is_escort || target.type === 'Warship') drm += 2;

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const roll = d1 + d2;
    const modRoll = roll + drm;
    const isHit = (modRoll <= maxHitRoll || roll === 2);
    let totalDamage = 0;
    let hitText = '';

    if (isHit) {
      // Table B3 Cañón column: 1=3, 2-3=2, 4=1, 5-7=1
      const dmgDie = Math.floor(Math.random() * 6) + 1;
      let pts = (dmgDie === 1) ? 3 : (dmgDie <= 3 ? 2 : 1);
      if (roll === 2) pts += 2; // Critical
      totalDamage = pts;
      hitText = `<span style="color:#4ade80; font-weight:bold;">¡IMPACTO DIRECTO!</span> (🎲 1d6=[${dmgDie}] ➔ +${pts} pts de daño)`;
    } else {
      hitText = `<span style="color:#94a3b8;">${isEn ? 'Miss' : 'Fallo'} (${modRoll} vs &le;${maxHitRoll})</span>`;
    }

    const isSunk = (totalDamage >= reqPts);
    let roguCategory = isSunk ? 'sunk' : (isHit ? 'damaged' : 'miss');
    campaignState.workflow.lastCombatHits = isHit ? 1 : 0;
    campaignState.workflow.lastCombatDamage = totalDamage;
    campaignState.workflow.lastCombatIsSunk = isSunk;
    campaignState.workflow.lastCombatStatus = roguCategory;

    const hitResEl = document.getElementById('wf-combat-hit-res');
    if (hitResEl) {
      hitResEl.innerText = isHit
        ? (isEn ? `💥 GUN HIT! — ${totalDamage} damage pts (Ammo left: ${subBoardState.ammo})` : `💥 ¡IMPACTO DE CAÑÓN! — ${totalDamage} pts de daño (Munición restante: ${subBoardState.ammo})`)
        : (isEn ? `💨 GUN MISSED (Ammo left: ${subBoardState.ammo})` : `💨 DISPARO DE CAÑÓN FALLIDO (Munición restante: ${subBoardState.ammo})`);
    }
    const sinkStatusEl = document.getElementById('wf-combat-sink-status');
    if (sinkStatusEl) {
      sinkStatusEl.innerText = isSunk
        ? (isEn ? `WARSHIP SUNK! (${totalDamage}/${reqPts} pts - ${(target.tons || 3000).toLocaleString()} tons)` : `¡BUQUE HUNDIDO! (${totalDamage}/${reqPts} pts - ${(target.tons || 3000).toLocaleString()} tons)`)
        : (isHit ? (isEn ? `SHIP DAMAGED (${totalDamage}/${reqPts} pts required)` : `BUQUE DAÑADO (${totalDamage}/${reqPts} pts necesarios)`) : (isEn ? 'MISSED SHOT' : 'DISPARO FALLIDO'));
    }

    const diceBox = document.getElementById('wf-torpedo-dice-details');
    if (diceBox) {
      diceBox.innerHTML = `
        <div style="background:rgba(180, 83, 9, 0.25); border:1px solid #d97706; border-radius:5px; padding:6px 10px; font-size:0.75rem;">
          <div style="font-weight:bold; color:#fde047; margin-bottom:4px;">💥 ${isEn ? "Deck Gun Action (Chart B1 & B3):" : "Disparo de Cañón de Cubierta (Tablas B1 y B3):"}</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>🎲 2d6 = [${d1}+${d2} = ${roll}]${drm ? ' (DRM ' + (drm>0?'+'+drm:drm) + ' = ' + modRoll + ')' : ''} ➔ ${hitText}</span>
            <span style="color:#cbd5e1; font-weight:bold;">📦 Proyectiles restantes: ${subBoardState.ammo} / 5</span>
          </div>
        </div>
      `;
    }

    if (isHit) logCombatToRoguBukku(false);
    showToast(isEn ? `Deck Gun fired! ${isSunk ? "Ship sunk!" : (isHit ? "Hit scored!" : "Missed.")}` : `¡Cañón disparado! ${isSunk ? "¡Buque hundido!" : (isHit ? "¡Impacto!" : "Fallo.")}`);
    return;
  }

  // ----------------------------------------------------
  // TORPEDO ATTACK MODE
  // ----------------------------------------------------
  const tubesToFire = parseInt(document.getElementById('wf-tubes-fired').value) || 0;
  if (tubesToFire <= 0) {
    showToast(isEn ? "⚠️ No torpedoes available to fire!" : "⚠️ ¡No hay torpedos disponibles para disparar!");
    return;
  }
  const torpType = document.getElementById('wf-torp-type-select') ? document.getElementById('wf-torp-type-select').value : 'type95';

  // Fire tubes and deduct from subBoardState!
  let firedTubes = [];
  if (typeof window.onSensuikanTorpedoFired === 'function') {
    firedTubes = window.onSensuikanTorpedoFired(tubesToFire, { mode: attackMode, torpType });
  }

  // DRM calculations
  let maxHitRoll = (range === 'close') ? 8 : (range === 'medium' ? 7 : 6);
  let drm = 0;
  if (attackMode.includes('surf')) drm -= 1; // Surface Torpedo -1 DRM
  if (campaignState.crewInjuries && campaignState.crewInjuries.captain) drm += 1; // Cmdte herido +1
  if (subBoardState.systems && subBoardState.systems['periscope'] === 'dmg' && attackMode.includes('sub')) drm += 1; // Periscopio averiado +1
  if (torpType === 'type92' && range !== 'close') drm += 2; // Type 92 Electric +2 DRM at medium/long
  if (target.is_escort || target.type === 'Warship') drm += 2; // Escort / DD / DE +2

  let hits = 0;
  let duds = 0;
  let totalDamage = 0;
  let diceRowsHtml = '';

  const tubesActualCount = firedTubes.length > 0 ? firedTubes.length : tubesToFire;

  for (let idx = 0; idx < tubesActualCount; idx++) {
    const tubeId = firedTubes[idx] !== undefined ? firedTubes[idx] : (idx + 1);
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
      // Dud roll (1d6 == 1)
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
        // Damage roll (1d6)
        const dmgDie = Math.floor(Math.random() * 6) + 1;
        let pts = (dmgDie === 1) ? 4 : (dmgDie <= 3 ? 3 : (dmgDie === 4 ? 2 : 1));
        if (isCrit) pts += 3; // Crit natural 2
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
          <span style="font-weight:bold; color:var(--gold-400); font-size:0.74rem;">🚀 ${isEn ? 'Tube' : 'Tubo'} #${tubeId}:</span>
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

  const isSunk = (totalDamage >= reqPts);
  let status = isSunk
    ? (isEn ? `WARSHIP SUNK! (${totalDamage}/${reqPts} pts accumulated - ${(target.tons || 3000).toLocaleString()} tons)` : `¡BUQUE HUNDIDO! (${totalDamage}/${reqPts} pts acumulados - ${(target.tons || 3000).toLocaleString()} tons)`)
    : (hits > 0 ? (isEn ? `SHIP DAMAGED (${totalDamage}/${reqPts} pts required to sink)` : `BUQUE DAÑADO (${totalDamage}/${reqPts} pts necesarios para hundir)`) : (isEn ? `MISSED SALVO (0 hits)` : `SALVA FALLIDA (0 impactos)`));

  let roguCategory = 'miss';
  if (isSunk) {
    if (target.type === 'Capital' || reqPts >= 5) roguCategory = 'capital_sunk';
    else if (campaignState.workflow.isSpecialMission || target.isSpecial) roguCategory = 'special_sunk';
    else roguCategory = 'sunk';
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

  const diceBox = document.getElementById('wf-torpedo-dice-details');
  if (diceBox) {
    const tubesSummary = firedTubes.length > 0 ? `• Tubos: ${firedTubes.map(t => 'T#'+t).join(', ')}` : '';
    diceBox.innerHTML = `
      <div style="font-size:0.7rem; font-weight:bold; color:var(--slate-400); margin-top:4px; margin-bottom:2px; display:flex; justify-content:space-between;">
        <span>🎯 ${isEn ? 'Torpedo Tube Dice Breakdown (Charts B1, B2, B3):' : 'Desglose de Tiradas por Tubo (Charts B1, B2, B3):'} <span style="color:#a7f3d0;">${tubesSummary}</span></span>
        <span style="color:#93c5fd;">${isEn ? 'LOW roll hits' : 'Tirada BAJA impacta'} (&le; ${maxHitRoll})</span>
      </div>
      ${diceRowsHtml}
    `;
  }

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
        if (typeof window.applySubmarineDamage === 'function') {
          window.applySubmarineDamage({ isSunk: true, source: 'escort', reason: 'Depth charge catastrophic hull breach' });
        }
        el.style.color = '#ef4444';
        el.innerHTML = isEn
          ? `💥 <span style="color:#fde047; font-weight:800;">Chart B5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ <strong>SUBMARINE SUNK!</strong> Direct hits rupture pressure hull. Campaign ends.`
          : `💥 <span style="color:#fde047; font-weight:800;">Chart B5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ <strong>¡SUBMARINO HUNDIDO!</strong> Cargas directas quiebran el casco. Fin de campaña.`;
        showToast(isEn ? "DISASTER! Submarine destroyed by depth charges." : "¡DESASTRE! Submarino destruido por cargas de profundidad.");
        return;
      }

      // Roll Chart B6 (d66) for each hit
      const damageDetails = [];
      for (let h = 1; h <= hits; h++) {
        const red = Math.floor(Math.random() * 6) + 1;
        const white = Math.floor(Math.random() * 6) + 1;
        const d66 = red * 10 + white;
        let desc = (typeof CHART_B6_TABLE !== 'undefined' && CHART_B6_TABLE[d66]) ? CHART_B6_TABLE[d66] : (isEn ? "Minor Damage" : "Avería Menor");
        if (typeof desc === 'function') {
          desc = desc(isEn);
        }
        if (isEn && window.I18N_PHASE3_B6_EN && window.I18N_PHASE3_B6_EN[d66]) {
          desc = window.I18N_PHASE3_B6_EN[d66];
        }
        const meta = (typeof window.getB6DamageMeta === 'function') 
          ? window.getB6DamageMeta(d66, desc, isEn) 
          : { badge: '<span style="color:#c084fc;">🛠️ Avería</span>', effect: desc };
        damageDetails.push({ h, red, white, d66, desc, meta });
      }

      // Centralized Submarine State Update for each depth charge hit
      damageDetails.forEach(item => {
        const d66 = item.d66;
        const desc = item.desc;
        if ([12, 21, 31, 43, 44, 51].includes(d66)) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ flooding: 1, source: 'escort', reason: desc });
          }
        } else if (d66 === 54) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ flooding: 2, source: 'escort', reason: desc });
          }
        } else if ([33, 35, 41, 45, 52, 55].includes(d66)) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ hullDamage: 1, source: 'escort', reason: desc });
          }
        } else if (d66 === 65) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ hullDamage: 2, source: 'escort', reason: desc });
          }
        } else if (d66 === 34) {
          if (typeof rollB7CrewInjury === 'function') rollB7CrewInjury();
        } else if (d66 === 53) {
          if (typeof rollB7CrewInjury === 'function') {
            rollB7CrewInjury();
            rollB7CrewInjury();
          }
        } else {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ systemsDamaged: desc, source: 'escort', reason: desc });
          }
        }
      });

      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();

      if (typeof window.renderB6DamageTableHtml === 'function') {
        el.innerHTML = window.renderB6DamageTableHtml(hits, d1, d2, sum, sum, false, damageDetails, isEn);
      } else {
        el.style.color = '#fca5a5';
        el.innerHTML = isEn
          ? `⚠️ <strong>Chart B5: 2d6 = [${d1} + ${d2} = ${sum}] ➔ ${hits} DEPTH CHARGE HITS!</strong><br>` + damageDetails.map(d => `Hit #${d.h}: 🎲 d66 = [${d.red}, ${d.white} ➔ ${d.d66}]: <strong>${d.desc}</strong>`).join('<br>')
          : `⚠️ <strong>Chart B5: 2d6 = [${d1} + ${d2} = ${sum}] ➔ ¡${hits} IMPACTOS DE CARGAS!</strong><br>` + damageDetails.map(d => `Impacto #${d.h}: 🎲 d66 = [${d.red}, ${d.white} ➔ ${d.d66}]: <strong>${d.desc}</strong>`).join('<br>');
      }
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
  const attackMode = document.getElementById('wf-attack-mode-select') ? document.getElementById('wf-attack-mode-select').value : 'submerged';
  const torpType = document.getElementById('wf-torp-type-select') ? document.getElementById('wf-torp-type-select').value : 'type95';

  // Sinking requirement:
  let reqPts = 2;
  if (target.tons <= 1000) reqPts = 1;
  else if (target.tons <= 5000) reqPts = 2;
  else if (target.tons < 10000) reqPts = 3;
  else reqPts = 4;
  if (target.pts_to_sink) reqPts = target.pts_to_sink;
  if (target.type === 'Capital') reqPts = Math.max(reqPts, 5);

  let firedInfo = '';
  if (attackMode === 'gun') {
    if (typeof subBoardState !== 'undefined' && subBoardState.ammo !== undefined && subBoardState.ammo > 0) {
      subBoardState.ammo = Math.max(0, subBoardState.ammo - 1);
      firedInfo = isEn ? `(1 Deck gun shell spent • Remaining: ${subBoardState.ammo})` : `(1 Proyectil de cañón gastado • Restan: ${subBoardState.ammo})`;
    }
  } else {
    // Deduct selected tubes from subBoardState!
    const tubesToFire = parseInt(document.getElementById('wf-tubes-fired').value) || 0;
    if (tubesToFire > 0 && typeof window.onSensuikanTorpedoFired === 'function') {
      const firedList = window.onSensuikanTorpedoFired(tubesToFire, { mode: attackMode, torpType });
      if (firedList && firedList.length > 0) {
        firedInfo = isEn ? `(${firedList.length} torpedoes spent on sub card: ${firedList.map(t=>'T#'+t).join(', ')})` : `(${firedList.length} torpedos gastados y marcados en la ficha: ${firedList.map(t=>'T#'+t).join(', ')})`;
      }
    }
  }

  if (typeof saveSubBoardState === 'function') saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();

  const isSunk = (dmg >= reqPts);
  let status = isSunk
    ? (isEn ? `WARSHIP SUNK! (${dmg}/${reqPts} pts accumulated - ${(target.tons || 3000).toLocaleString()} tons)` : `¡BUQUE HUNDIDO! (${dmg}/${reqPts} pts acumulados - ${(target.tons || 3000).toLocaleString()} tons)`)
    : (hits > 0 ? (isEn ? `SHIP DAMAGED (${dmg}/${reqPts} pts required to sink)` : `BUQUE DAÑADO (${dmg}/${reqPts} pts necesarios para hundir)`) : (isEn ? `MISSED SALVO (0 hits)` : `SALVA FALLIDA (0 impactos)`));

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
        <div style="color:#fde047; font-weight:bold; margin-top:3px;">${firedInfo}</div>
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
