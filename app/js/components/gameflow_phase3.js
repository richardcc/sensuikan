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
  const tubesFwdSelect = document.getElementById('wf-tubes-fired');
  const tubesAftSelect = document.getElementById('wf-tubes-aft-second-salvo');
  const secondSalvoContainer = document.getElementById('p3-second-salvo-container');
  const secondSalvoBadge = document.getElementById('p3-second-salvo-badge');
  const fireBtn = document.getElementById('p3-btn-fire');
  const tubesFwdLbl = document.getElementById('p3-tubes-fwd-lbl');
  const fwdHint = document.getElementById('p3-fwd-salvo-hint');
  const aftHint = document.getElementById('p3-aft-salvo-hint');
  const nightBanner = document.getElementById('p3-night-salvo-banner');
  const step4ModeBadge = document.getElementById('p3-step4-mode-badge');

  if (attackMode === 'gun') {
    if (nightBanner) nightBanner.style.display = 'none';
    if (step4ModeBadge) step4ModeBadge.style.display = 'none';
    if (tubesFwdLbl) tubesFwdLbl.innerText = isEn ? "Deck Gun Shots:" : "Disparos de Cañón:";
    if (fwdHint) fwdHint.innerText = isEn ? "Deck Gun (1 shell per action)" : "Cañón de cubierta (1 disparo por acción)";
    if (secondSalvoContainer) secondSalvoContainer.style.display = 'none';

    if (tubesFwdSelect) {
      tubesFwdSelect.innerHTML = `<option value="1">1 ${isEn ? "Shot (Deck Gun)" : "Disparo (Cañón de Cubierta)"}</option>`;
      tubesFwdSelect.disabled = deckGunDmg || ammoCount <= 0;
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

  // Torpedo modes (submerged / surface_night)
  const isNightSurface = (attackMode === 'surface_night');

  if (nightBanner) {
    nightBanner.style.display = isNightSurface ? 'block' : 'none';
  }
  if (step4ModeBadge) {
    step4ModeBadge.style.display = isNightSurface ? 'inline-block' : 'none';
    step4ModeBadge.innerText = isEn ? "🌙 Night Surface (2 Salvos)" : "🌙 Superficie Nocturna (2 Salvas)";
  }

  if (tubesFwdLbl) tubesFwdLbl.innerText = isEn ? "▲ 1st Salvo (Bow Tubes):" : "▲ 1.ª Salva (Tubos de Proa):";
  if (fwdHint) {
    fwdHint.innerText = isNightSurface
      ? (isEn ? "Optics bonus: -1 To-Hit DRM applied on Chart B1" : "Óptica de superficie: -1 DRM a impactar en Tabla B1")
      : (isEn ? "Standard targeting on Chart B1" : "Puntería estándar en Tabla B1");
  }

  // 1. Bow Salvo options (0..operFwd)
  if (tubesFwdSelect) {
    const curVal = parseInt(tubesFwdSelect.value) || 4;
    let optsHtml = '';
    if (operFwd === 0) {
      optsHtml = `<option value="0">0 ${isEn ? "Bow Torpedoes (None loaded/operative)" : "Torpedos de Proa (Ninguno disponible)"}</option>`;
    } else {
      optsHtml = `<option value="0">0 ${isEn ? "(Do not fire bow)" : "(No disparar proa)"}</option>`;
      for (let n = 1; n <= operFwd; n++) {
        let tag = '';
        if (n === 2) tag = isEn ? " (Reduced Salvo)" : " (Salva Reducida)";
        else if (n === 4) tag = isEn ? " (Standard Salvo)" : " (Salva Estándar)";
        else if (n === 6) tag = isEn ? " (Full Bow Salvo)" : " (Salva Completa Proa)";
        else if (n === 8) tag = isEn ? " (Maximum Bow Salvo)" : " (Salva Máxima Proa)";
        optsHtml += `<option value="${n}">${n} ${isEn ? "Torpedoes" : "Torpedos"}${tag}</option>`;
      }
    }
    tubesFwdSelect.innerHTML = optsHtml;
    tubesFwdSelect.disabled = (operFwd === 0);

    if (operFwd > 0) {
      if (curVal >= 1 && curVal <= operFwd) {
        tubesFwdSelect.value = String(curVal);
      } else if (operFwd >= 4) {
        tubesFwdSelect.value = "4";
      } else if (operFwd >= 2) {
        tubesFwdSelect.value = "2";
      } else {
        tubesFwdSelect.value = String(operFwd);
      }
    } else {
      tubesFwdSelect.value = "0";
    }
  }

  // 2. Stern Second Salvo options (0..operAft) [Regla 8.2.2 / 8.2.3]
  if (secondSalvoContainer) {
    if (cfg.aftTubes > 0) {
      secondSalvoContainer.style.display = 'block';
      if (isNightSurface) {
        secondSalvoContainer.style.border = '1px solid #facc15';
        secondSalvoContainer.style.boxShadow = '0 0 10px rgba(234, 179, 8, 0.3)';
        secondSalvoContainer.style.background = 'rgba(30, 27, 75, 0.45)';
      } else {
        secondSalvoContainer.style.border = '1px solid #eab308';
        secondSalvoContainer.style.boxShadow = 'none';
        secondSalvoContainer.style.background = 'rgba(0, 0, 0, 0.25)';
      }
    } else {
      secondSalvoContainer.style.display = 'none';
    }
  }

  if (secondSalvoBadge) {
    if (isNightSurface) {
      secondSalvoBadge.innerText = isEn ? "🌙 Night 2nd Salvo (+1 DRM)" : "🌙 2.ª Salva Nocturna (+1 DRM)";
      secondSalvoBadge.style.background = 'rgba(234, 179, 8, 0.3)';
      secondSalvoBadge.style.color = '#fef08a';
    } else {
      secondSalvoBadge.innerText = isEn ? "+1 To-Hit DRM" : "+1 MTD Impacto";
      secondSalvoBadge.style.background = 'rgba(234, 179, 8, 0.2)';
      secondSalvoBadge.style.color = '#fde047';
    }
  }

  if (aftHint) {
    if (isNightSurface) {
      aftHint.innerHTML = isEn
        ? "🌙 <strong>Night Mode Active:</strong> Simultaneous stern salvo. Suffers +1 opposite-end DRM and gains -1 surface DRM (Net 0 DRM vs target)."
        : "🌙 <strong>Modo Nocturno Activo:</strong> Disparo simultáneo desde popa. Recibe +1 DRM por extremo opuesto y -1 DRM de superficie (DRM neto 0).";
    } else {
      aftHint.innerText = isEn
        ? "Fired from opposite end at +1 DRM (Rule 8.2.2). Permitted whenever stern tubes are loaded."
        : "Disparada desde el extremo opuesto a +1 DRM (Regla 8.2.2). Se permite siempre que haya tubos de popa cargados.";
    }
  }

  if (tubesAftSelect) {
    const curAftVal = parseInt(tubesAftSelect.value) || 0;
    let aftOpts = '';
    aftOpts += `<option value="0">0 ${isEn ? "(No 2nd Stern Salvo)" : "(Sin 2.ª Salva de Popa)"}</option>`;
    if (operAft > 0) {
      for (let a = 1; a <= operAft; a++) {
        aftOpts += `<option value="${a}">${a} ${isEn ? (a === 1 ? "Stern Torpedo (+1 DRM)" : "Stern Torpedoes (+1 DRM)") : (a === 1 ? "Torpedo de Popa (+1 DRM)" : "Torpedos de Popa (+1 DRM)")}</option>`;
      }
      tubesAftSelect.disabled = false;
    } else {
      tubesAftSelect.disabled = true;
    }
    tubesAftSelect.innerHTML = aftOpts;

    if (operAft > 0) {
      if (curAftVal >= 1 && curAftVal <= operAft) {
        tubesAftSelect.value = String(curAftVal);
      } else if (isNightSurface && curAftVal === 0) {
        // Auto-select stern tubes on Night Surface attack so player sees 2nd salvo engaged!
        tubesAftSelect.value = String(Math.min(operAft, 2));
      } else if (curAftVal === 0) {
        tubesAftSelect.value = "0";
      } else {
        tubesAftSelect.value = "0";
      }
    } else {
      tubesAftSelect.value = "0";
    }
  }

  onSalvoConfigChanged();
}
window.syncPhase3TorpedoOptions = syncPhase3TorpedoOptions;

function onSalvoConfigChanged() {
  const isEn = (window.currentLang === 'en');
  const attackModeSelect = document.getElementById('wf-attack-mode-select');
  const attackMode = attackModeSelect ? attackModeSelect.value : 'submerged';
  const fireBtn = document.getElementById('p3-btn-fire');
  if (!fireBtn) return;

  if (attackMode === 'gun') return;

  const fwdCount = parseInt(document.getElementById('wf-tubes-fired')?.value) || 0;
  const aftCount = parseInt(document.getElementById('wf-tubes-aft-second-salvo')?.value) || 0;
  const total = fwdCount + aftCount;

  const priorSalvoCount = (typeof campaignState !== 'undefined' && campaignState.workflow && Array.isArray(campaignState.workflow.salvoHistory))
    ? campaignState.workflow.salvoHistory.length
    : 0;

  if (total === 0) {
    fireBtn.disabled = true;
    fireBtn.style.background = '#475569';
    fireBtn.style.borderColor = '#64748b';
    fireBtn.innerText = isEn ? '⚠️ No Torpedoes Selected' : '⚠️ Ningún Torpedo Seleccionado';
  } else {
    fireBtn.disabled = false;
    fireBtn.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
    fireBtn.style.borderColor = '#10b981';

    if (priorSalvoCount > 0) {
      // 2.ª Salva (o Salva Adicional)
      if (aftCount > 0 && fwdCount > 0) {
        fireBtn.innerText = isEn 
          ? `🚀 FIRE 2nd SALVO! (${fwdCount} Bow + ${aftCount} Stern [+1 DRM])`
          : `🚀 ¡FUEGO 2.ª SALVA! (${fwdCount} Proa + ${aftCount} Popa [+1 DRM])`;
      } else if (aftCount > 0) {
        fireBtn.innerText = isEn 
          ? `🚀 FIRE 2nd SALVO! (${aftCount} Stern [+1 DRM])`
          : `🚀 ¡FUEGO 2.ª SALVA! (${aftCount} Popa [+1 DRM])`;
      } else {
        fireBtn.innerText = isEn 
          ? `🚀 FIRE 2nd SALVO! (${fwdCount} Bow Torpedo${fwdCount > 1 ? 'es' : ''})`
          : `🚀 ¡FUEGO 2.ª SALVA! (${fwdCount} Torpedo${fwdCount > 1 ? 's' : ''} de Proa)`;
      }
    } else {
      // 1.ª Salva
      if (aftCount > 0 && fwdCount > 0) {
        fireBtn.innerText = isEn 
          ? `🚀 FIRE! (1st: ${fwdCount} Bow + 2nd: ${aftCount} Stern [+1 DRM])`
          : `🚀 ¡FUEGO! (1.ª: ${fwdCount} Proa + 2.ª: ${aftCount} Popa [+1 DRM])`;
      } else if (aftCount > 0) {
        fireBtn.innerText = isEn 
          ? `🚀 FIRE 2nd SALVO! (${aftCount} Stern [+1 DRM])`
          : `🚀 ¡FUEGO 2.ª SALVA! (${aftCount} Popa [+1 DRM])`;
      } else {
        fireBtn.innerText = isEn 
          ? `🚀 FIRE 1st SALVO! (${fwdCount} Bow Torpedo${fwdCount > 1 ? 'es' : ''})`
          : `🚀 ¡FUEGO 1.ª SALVA! (${fwdCount} Torpedo${fwdCount > 1 ? 's' : ''} de Proa)`;
      }
    }
  }
}
window.onSalvoConfigChanged = onSalvoConfigChanged;

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
    // GUN ATTACK MODE [REGLA 8.2.4] (CAÑÓN DE CUBIERTA)
    // ----------------------------------------------------
    // Rule 8.2.4: Strictly against unescorted ships
    const isEscorted = !!(target.escort || target.is_escort || target.escortShip || target.type === 'Warship' || target.type === 'Capital');
    if (isEscorted) {
      showToast(isEn ? "⚠️ Rule 8.2.4: Deck Gun firing is strictly forbidden against escorted targets!" : "⚠️ Regla 8.2.4: ¡El cañón de cubierta está estrictamente prohibido contra buques escoltados!");
      return;
    }

    if (subBoardState.deckGunDamaged) {
      showToast(isEn ? "⚠️ Deck Gun is damaged and cannot fire!" : "⚠️ ¡El cañón de cubierta está averiado y no puede disparar!");
      return;
    }
    const currentAmmo = (subBoardState.ammo !== undefined) ? subBoardState.ammo : 5;
    if (currentAmmo <= 0) {
      showToast(isEn ? "⚠️ Out of Deck Gun ammunition!" : "⚠️ ¡Sin munición para el cañón de cubierta!");
      return;
    }

    if (!campaignState.workflow) campaignState.workflow = {};
    if (!Array.isArray(campaignState.workflow.salvoHistory)) campaignState.workflow.salvoHistory = [];
    
    // Count prior gun shots in this combat (Rule 8.2.4: max 2 shots per deck gun)
    const priorGunShots = campaignState.workflow.salvoHistory.filter(s => s.isGun).length;
    const maxGunShots = 2;
    if (priorGunShots >= maxGunShots) {
      showToast(isEn ? `⚠️ Rule 8.2.4: Maximum ${maxGunShots} deck gun shots per combat reached!` : `⚠️ Regla 8.2.4: ¡Alcanzado el máximo de ${maxGunShots} disparos de cañón en este combate!`);
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

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const roll = d1 + d2;
    const modRoll = roll + drm;
    const isHit = (modRoll <= maxHitRoll || roll === 2);
    let thisDamage = 0;
    let hitText = '';

    if (isHit) {
      // Table B3 Cañón column: 1=3, 2-3=2, 4=1, 5-7=1
      const dmgDie = Math.floor(Math.random() * 6) + 1;
      let pts = (dmgDie === 1) ? 3 : (dmgDie <= 3 ? 2 : 1);
      if (roll === 2) pts += 2; // Critical
      thisDamage = pts;
      hitText = `<span style="color:#4ade80; font-weight:bold;">¡IMPACTO DIRECTO!</span> (🎲 1d6=[${dmgDie}] ➔ +${pts} pts de daño)`;
    } else {
      hitText = `<span style="color:#94a3b8;">${isEn ? 'Miss' : 'Fallo'} (${modRoll} vs &le;${maxHitRoll})</span>`;
    }

    const gunShotNum = priorGunShots + 1;
    const gunDiceHtml = `
      <div style="background:rgba(180, 83, 9, 0.25); border:1px solid #d97706; border-radius:5px; padding:6px 10px; font-size:0.75rem; margin-top:6px;">
        <div style="font-weight:bold; color:#fde047; margin-bottom:4px; display:flex; justify-content:space-between;">
          <span>💥 ${isEn ? `Deck Gun Action #${gunShotNum} [Rule 8.2.4] (Charts B1 & B3):` : `Disparo de Cañón #${gunShotNum} [Regla 8.2.4] (Tablas B1 y B3):`}</span>
          <span style="color:#cbd5e1; font-weight:normal;">📦 ${isEn ? `Shells left: ${subBoardState.ammo} / 5` : `Proyectiles restantes: ${subBoardState.ammo} / 5`}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>🎲 2d6 = [${d1}+${d2} = ${roll}]${drm ? ' (DRM ' + (drm>0?'+'+drm:drm) + ' = ' + modRoll + ')' : ''} ➔ ${hitText}</span>
          <span style="font-size:0.72rem; color:${isHit ? '#6ee7b7' : '#94a3b8'}; font-weight:bold; background:${isHit ? '#065f46' : '#1e293b'}; padding:1px 6px; border-radius:3px;">
            ${isHit ? `+${thisDamage} ${isEn ? 'Damage' : 'Daño'}` : (isEn ? 'Miss' : 'Fallo')}
          </span>
        </div>
      </div>
    `;

    campaignState.workflow.salvoHistory.push({
      salvoIndex: `Gun #${gunShotNum}`,
      isGun: true,
      hits: isHit ? 1 : 0,
      duds: 0,
      damage: thisDamage,
      html: gunDiceHtml,
      tubesFired: []
    });

    let accumHits = 0;
    let accumDuds = 0;
    let accumDamage = 0;
    let combinedSalvoHtml = '';
    for (let s of campaignState.workflow.salvoHistory) {
      accumHits += s.hits;
      accumDuds += s.duds;
      accumDamage += s.damage;
      combinedSalvoHtml += s.html;
    }

    const isSunk = (accumDamage >= reqPts);
    let roguCategory = isSunk ? 'sunk' : (accumHits > 0 ? 'damaged' : 'miss');
    campaignState.workflow.lastCombatHits = accumHits;
    campaignState.workflow.lastCombatDamage = accumDamage;
    campaignState.workflow.lastCombatIsSunk = isSunk;
    campaignState.workflow.lastCombatStatus = roguCategory;

    const hitResEl = document.getElementById('wf-combat-hit-res');
    if (hitResEl) {
      hitResEl.innerText = isHit
        ? (isEn ? `💥 GUN HIT! — ${accumDamage} accumulated damage pts (Ammo left: ${subBoardState.ammo})` : `💥 ¡IMPACTO DE CAÑÓN! — ${accumDamage} pts de daño acumulados (Munición restante: ${subBoardState.ammo})`)
        : (isEn ? `💨 GUN MISSED (Ammo left: ${subBoardState.ammo} • Accumulated damage: ${accumDamage} pts)` : `💨 DISPARO DE CAÑÓN FALLIDO (Munición restante: ${subBoardState.ammo} • Daño acumulado: ${accumDamage} pts)`);
    }
    const sinkStatusEl = document.getElementById('wf-combat-sink-status');
    if (sinkStatusEl) {
      sinkStatusEl.innerText = isSunk
        ? (isEn ? `WARSHIP SUNK! (${accumDamage}/${reqPts} pts - ${(target.tons || 3000).toLocaleString()} tons)` : `¡BUQUE HUNDIDO! (${accumDamage}/${reqPts} pts - ${(target.tons || 3000).toLocaleString()} tons)`)
        : (accumHits > 0 ? (isEn ? `SHIP DAMAGED (${accumDamage}/${reqPts} pts required)` : `BUQUE DAÑADO (${accumDamage}/${reqPts} pts necesarios)`) : (isEn ? 'MISSED SHOT' : 'DISPARO FALLIDO'));
    }

    const diceBox = document.getElementById('wf-torpedo-dice-details');
    if (diceBox) {
      diceBox.innerHTML = `
        <div style="font-size:0.7rem; font-weight:bold; color:var(--slate-400); margin-top:4px; margin-bottom:2px; display:flex; justify-content:space-between;">
          <span>🎯 ${isEn ? 'Combat Action History (Charts B1 & B3):' : 'Historial de Acciones de Combate (Tablas B1 y B3):'}</span>
          <span style="color:#fde047;">${isEn ? 'Deck Gun [Rule 8.2.4]' : 'Cañón de Cubierta [Regla 8.2.4]'}</span>
        </div>
        ${combinedSalvoHtml}
      `;
    }

    if (isHit) logCombatToRoguBukku(false);
    showToast(isEn ? `Deck Gun fired! ${isSunk ? "Ship sunk!" : (isHit ? "Hit scored!" : "Missed.")}` : `¡Cañón disparado! ${isSunk ? "¡Buque hundido!" : (isHit ? "¡Impacto!" : "Fallo.")}`);
    return;
  }

  // ----------------------------------------------------
  // TORPEDO ATTACK MODE (1.ª Salva Proa + 2.ª Salva Popa [Regla 8.2.2])
  // ----------------------------------------------------
  if (!campaignState.workflow) campaignState.workflow = {};
  if (!Array.isArray(campaignState.workflow.salvoHistory)) {
    campaignState.workflow.salvoHistory = [];
  }
  const priorSalvoCount = campaignState.workflow.salvoHistory.length;

  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2 };

  const fwdCount = parseInt(document.getElementById('wf-tubes-fired')?.value) || 0;
  const aftCount = parseInt(document.getElementById('wf-tubes-aft-second-salvo')?.value) || 0;
  const totalTubes = fwdCount + aftCount;

  if (totalTubes <= 0) {
    showToast(isEn ? "⚠️ No torpedoes selected to fire!" : "⚠️ ¡No hay torpedos seleccionados para disparar!");
    return;
  }
  const torpType = document.getElementById('wf-torp-type-select') ? document.getElementById('wf-torp-type-select').value : 'type95';

  // Fire tubes and deduct from subBoardState!
  let fireRes = { fwdFired: [], aftFired: [], allFired: [] };
  if (typeof window.onSensuikanTorpedoFired === 'function') {
    fireRes = window.onSensuikanTorpedoFired(totalTubes, { fwdCount, aftCount, mode: attackMode, torpType }) || fireRes;
  }
  const fwdFired = (fireRes && Array.isArray(fireRes.fwdFired)) ? fireRes.fwdFired : [];
  const aftFired = (fireRes && Array.isArray(fireRes.aftFired)) ? fireRes.aftFired : [];
  const allFired = (fireRes && Array.isArray(fireRes.allFired)) ? fireRes.allFired : [...fwdFired, ...aftFired];

  // Base DRM calculations
  let maxHitRoll = (range === 'close') ? 8 : (range === 'medium' ? 7 : 6);
  let baseDrm = 0;
  if (attackMode.includes('surf')) baseDrm -= 1; // Surface Torpedo -1 DRM
  if (campaignState.crewInjuries && campaignState.crewInjuries.captain) baseDrm += 1; // Cmdte herido +1
  if (subBoardState.systems && subBoardState.systems['periscope'] === 'dmg' && attackMode.includes('sub')) baseDrm += 1; // Periscopio averiado +1
  if (torpType === 'type92' && range !== 'close') baseDrm += 2; // Type 92 Electric +2 DRM at medium/long
  if (target.is_escort || target.type === 'Warship') baseDrm += 2; // Escort / DD / DE +2

  let thisHits = 0;
  let thisDuds = 0;
  let thisDamage = 0;

  // Single torpedo roller
  function rollTorpedoShot(tubeId, isSecondSalvo) {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const roll = d1 + d2;
    // Rule 8.2.2: Second salvo suffers +1 DRM
    const drm = baseDrm + (isSecondSalvo ? 1 : 0);
    const modRoll = roll + drm;
    const isCrit = (roll === 2);

    let itemBg = isSecondSalvo ? 'rgba(30, 27, 75, 0.4)' : 'rgba(15, 23, 42, 0.6)';
    let itemBorder = isSecondSalvo ? '#ca8a04' : '#334155';
    let hitBadge = '';
    let dudBadge = '';
    let damageBadge = '';
    let outcomeText = isEn ? 'Miss' : 'Fallo';
    let outcomeBg = '#1e293b';
    let outcomeColor = '#94a3b8';

    const salvoBadge = isSecondSalvo
      ? `<span style="font-size:0.67rem; background:rgba(234,179,8,0.2); color:#fde047; border:1px solid #ca8a04; padding:0 4px; border-radius:3px;">${isEn ? '2nd Salvo [+1 DRM]' : '2.ª Salva [+1 DRM]'}</span>`
      : `<span style="font-size:0.67rem; background:rgba(59,130,246,0.15); color:#93c5fd; border:1px solid #3b82f6; padding:0 4px; border-radius:3px;">${isEn ? '1st Salvo' : '1.ª Salva'}</span>`;

    let drmBadge = drm !== 0 ? `<span style="font-size:0.67rem; color:${drm < 0 ? '#4ade80' : '#f87171'};">DRM(${drm > 0 ? '+'+drm : drm})=${modRoll}</span>` : '';

    if (modRoll <= maxHitRoll || isCrit) {
      // Dud roll (1d6 == 1)
      const dudDie = Math.floor(Math.random() * 6) + 1;
      if (dudDie === 1) {
        thisDuds++;
        itemBg = 'rgba(180, 83, 9, 0.25)';
        itemBorder = '#d97706';
        hitBadge = `<span style="color:#fde047; font-weight:bold;">${isEn ? 'Hit!' : '¡Impacto!'}</span>`;
        dudBadge = `<span style="background:rgba(225,29,72,0.25); color:#fda4af; border:1px solid #e11d48; padding:1px 5px; border-radius:3px; font-weight:bold; font-size:0.68rem;">Dud [B2]: 🎲 1d6=[1] ❌ ${isEn ? 'Defective' : 'Defectuoso'}</span>`;
        outcomeText = isEn ? '0 Damage (Dud)' : '0 Daño (Dud)';
        outcomeBg = 'rgba(120, 53, 15, 0.6)';
        outcomeColor = '#fde68a';
      } else {
        thisHits++;
        // Damage roll (1d6)
        const dmgDie = Math.floor(Math.random() * 6) + 1;
        let pts = (dmgDie === 1) ? 4 : (dmgDie <= 3 ? 3 : (dmgDie === 4 ? 2 : 1));
        if (isCrit) pts += 3; // Crit natural 2
        thisDamage += pts;

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

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; background:${itemBg}; border:1px solid ${itemBorder}; border-radius:5px; padding:4px 8px; font-size:0.73rem; gap:6px; margin-bottom:3px;">
        <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
          <span style="font-weight:bold; color:var(--gold-400); font-size:0.74rem;">🚀 ${isEn ? 'Tube' : 'Tubo'} #${tubeId}:</span>
          ${salvoBadge}
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

  // 1. Roll Bow Salvo
  const fwdRows = [];
  const isBowSecondSalvo = (priorSalvoCount > 0);
  const actualFwdList = (fwdFired.length > 0) ? fwdFired : Array.from({length: fwdCount}, (_, i) => i + 1);
  for (let tubeId of actualFwdList) {
    fwdRows.push(rollTorpedoShot(tubeId, isBowSecondSalvo));
  }

  // 2. Roll Stern Salvo (always second salvo [Regla 8.2.2])
  const aftRows = [];
  const actualAftList = (aftFired.length > 0) ? aftFired : Array.from({length: aftCount}, (_, i) => cfg.fwdTubes + i + 1);
  for (let tubeId of actualAftList) {
    aftRows.push(rollTorpedoShot(tubeId, true));
  }

  let executionHtml = '';
  if (fwdRows.length > 0) {
    const salvoTitle = isBowSecondSalvo
      ? (isEn ? '▼ 2nd Salvo (Bow Tubes)' : '▼ 2.ª Salva (Tubos de Proa)')
      : (isEn ? '▲ 1st Salvo (Bow Tubes)' : '▲ 1.ª Salva (Tubos de Proa)');
    const salvoColor = isBowSecondSalvo ? '#fde047' : '#93c5fd';
    const effectiveDrm = baseDrm + (isBowSecondSalvo ? 1 : 0);
    executionHtml += `
      <div style="margin-top:6px; margin-bottom:3px; font-weight:bold; color:${salvoColor}; font-size:0.73rem;">
        ${salvoTitle} [${fwdRows.length} ${isEn ? 'torpedoes' : 'torpedos'} • DRM ${effectiveDrm >= 0 ? '+'+effectiveDrm : effectiveDrm}]:
      </div>
      ${fwdRows.join('')}
    `;
  }
  if (aftRows.length > 0) {
    const aftDrmVal = baseDrm + 1;
    executionHtml += `
      <div style="margin-top:6px; margin-bottom:3px; font-weight:bold; color:#fde047; font-size:0.73rem;">
        ▼ ${isEn ? '2nd Salvo [Rule 8.2.2] (Stern Tubes)' : '2.ª Salva [Regla 8.2.2] (Tubos de Popa)'} [${aftRows.length} ${isEn ? 'torpedoes' : 'torpedos'} • +1 To-Hit DRM ➔ Total DRM ${aftDrmVal >= 0 ? '+'+aftDrmVal : aftDrmVal}]:
      </div>
      ${aftRows.join('')}
    `;
  }

  // Record this salvo into history (DO NOT ERASE PREVIOUS SALVOS!)
  campaignState.workflow.salvoHistory.push({
    salvoIndex: priorSalvoCount + 1,
    isSecondSalvo: (priorSalvoCount > 0 || (fwdCount === 0 && aftCount > 0)),
    fwdCount,
    aftCount,
    allFired,
    hits: thisHits,
    duds: thisDuds,
    damage: thisDamage,
    html: executionHtml
  });

  // Calculate cumulative hits, duds, and damage across ALL salvos in current encounter
  let accumHits = 0;
  let accumDuds = 0;
  let accumDamage = 0;
  let combinedSalvoHtml = '';
  let allFiredTubesList = [];

  for (let s of campaignState.workflow.salvoHistory) {
    accumHits += s.hits;
    accumDuds += s.duds;
    accumDamage += s.damage;
    combinedSalvoHtml += s.html;
    if (Array.isArray(s.allFired)) {
      allFiredTubesList.push(...s.allFired);
    }
  }

  const isSunk = (accumDamage >= reqPts);
  let status = isSunk
    ? (isEn ? `WARSHIP SUNK! (${accumDamage}/${reqPts} pts accumulated - ${(target.tons || 3000).toLocaleString()} tons)` : `¡BUQUE HUNDIDO! (${accumDamage}/${reqPts} pts acumulados - ${(target.tons || 3000).toLocaleString()} tons)`)
    : (accumHits > 0 ? (isEn ? `SHIP DAMAGED (${accumDamage}/${reqPts} pts required to sink)` : `BUQUE DAÑADO (${accumDamage}/${reqPts} pts necesarios para hundir)`) : (isEn ? `MISSED SALVO (0 hits)` : `SALVA FALLIDA (0 impactos)`));

  let roguCategory = 'miss';
  if (isSunk) {
    if (target.type === 'Capital' || reqPts >= 5) roguCategory = 'capital_sunk';
    else if (campaignState.workflow.isSpecialMission || target.isSpecial) roguCategory = 'special_sunk';
    else roguCategory = 'sunk';
  } else if (accumHits > 0) {
    roguCategory = 'damaged';
  }

  campaignState.workflow.lastCombatHits = accumHits;
  campaignState.workflow.lastCombatDamage = accumDamage;
  campaignState.workflow.lastCombatIsSunk = isSunk;
  campaignState.workflow.lastCombatStatus = roguCategory;

  const hitResEl = document.getElementById('wf-combat-hit-res');
  if (hitResEl) {
    const salvoTag = campaignState.workflow.salvoHistory.length > 1 
      ? (isEn ? ` [Across ${campaignState.workflow.salvoHistory.length} Salvos]` : ` [En ${campaignState.workflow.salvoHistory.length} Salvas]`) 
      : '';
    hitResEl.innerText = isEn 
      ? `${accumHits} EFFECTIVE HITS! (Duds: ${accumDuds}) — ${accumDamage} damage pts${salvoTag}`
      : `¡${accumHits} IMPACTOS EFECTIVOS! (Defectuosos: ${accumDuds}) — ${accumDamage} pts de daño${salvoTag}`;
  }
  const sinkStatusEl = document.getElementById('wf-combat-sink-status');
  if (sinkStatusEl) {
    sinkStatusEl.innerText = status;
  }

  // Display ALL cumulative salvo details in diceBox (never overwrite prior salvo!)
  const diceBox = document.getElementById('wf-torpedo-dice-details');
  if (diceBox) {
    const summaryList = allFiredTubesList.length > 0 ? allFiredTubesList.map(t => 'T#'+t).join(', ') : `${totalTubes} tubes`;
    const tubesSummary = `• Tubos: ${summaryList}`;
    diceBox.innerHTML = `
      <div style="font-size:0.7rem; font-weight:bold; color:var(--slate-400); margin-top:4px; margin-bottom:2px; display:flex; justify-content:space-between;">
        <span>🎯 ${isEn ? 'Torpedo Tube Dice Breakdown (Charts B1, B2, B3):' : 'Desglose de Tiradas por Tubo (Charts B1, B2, B3):'} <span style="color:#a7f3d0;">${tubesSummary}</span></span>
        <span style="color:#93c5fd;">${isEn ? 'LOW roll hits' : 'Tirada BAJA impacta'} (&le; ${maxHitRoll})</span>
      </div>
      ${combinedSalvoHtml}
    `;
  }

  if (thisHits > 0) {
    logCombatToRoguBukku(false);
  }

  showToast((isEn ? "Salvo resolved: " : "Salva resuelta: ") + status);

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

      // =========================================================================
      // RULE 8.2.7: AUTOMATIC ESCAPE (SNAKE EYES)
      // Regardless of how bad the die roll modifiers get for the detection cycle,
      // a roll of a natural "2" (snake eyes) results automatically in a result
      // of "not detected" and the Submarine escapes.
      // =========================================================================
      if (sum === 2) {
        el.style.color = '#34d399';
        el.innerHTML = isEn
          ? `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [1 + 1 = 2 (Snake Eyes!)]</span> ➔ <strong style="color:#22c55e;">★ AUTOMATIC ESCAPE [RULE 8.2.7]!</strong> Submarine evades unconditionally regardless of DRMs.`
          : `<span style="color:#fde047; font-weight:800;">🎲 Chart B4: 2d6 = [1 + 1 = 2 (¡Ojos de Serpiente!)]</span> ➔ <strong style="color:#22c55e;">★ ¡ESCAPE AUTOMÁTICO [REGLA 8.2.7]!</strong> El submarino escapa incondicionalmente sin importar los modificadores.`;
        showToast(isEn ? "★ Rule 8.2.7: Automatic Escape! (Natural 2)" : "★ ¡Regla 8.2.7: Escape Automático! (2 Natural)");
        return;
      }

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
    const fwdTubes = parseInt(document.getElementById('wf-tubes-fired')?.value) || 0;
    const aftTubes = parseInt(document.getElementById('wf-tubes-aft-second-salvo')?.value) || 0;
    const totalTubes = fwdTubes + aftTubes;
    if (totalTubes > 0 && typeof window.onSensuikanTorpedoFired === 'function') {
      const fireRes = window.onSensuikanTorpedoFired(totalTubes, { fwdCount: fwdTubes, aftCount: aftTubes, mode: attackMode, torpType });
      const firedList = (fireRes && Array.isArray(fireRes.allFired)) ? fireRes.allFired : (Array.isArray(fireRes) ? fireRes : []);
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

// =========================================================================
// RULE 8.2.8: ADDITIONAL ROUNDS OF COMBAT (UNESCORTED SHIPS)
// =========================================================================
function rollAdditionalRound828() {
  const isEn = (window.currentLang === 'en');
  const target = (campaignState && campaignState.workflow && campaignState.workflow.currentTarget) || {};
  const resEl = document.getElementById('wf-additional-round-res');

  // Rule 8.2.8: Additional Rounds of Combat are not allowed vs escorted ships!
  // Instead, the player must use the "Following" game mechanic [Rule 8.4].
  const isEscorted = !!(target.escort || target.is_escort || target.escortShip || target.type === 'Warship' || target.type === 'Capital');
  if (isEscorted) {
    const warn = isEn
      ? "⚠️ Rule 8.2.8: Additional Rounds of Combat are forbidden against escorted targets! Use 'Follow Convoy' [Rule 8.4] instead."
      : "⚠️ Regla 8.2.8: ¡Las Rondas Adicionales de Combate no están permitidas contra buques escoltados! Usa 'Seguir Convoy' [Regla 8.4].";
    showToast(warn);
    if (resEl) {
      resEl.style.display = 'block';
      resEl.style.background = 'rgba(239,68,68,0.15)';
      resEl.style.border = '1px solid #ef4444';
      resEl.style.color = '#fca5a5';
      resEl.innerText = warn;
    }
    return;
  }

  // Track additional rounds in the current travel box (maximum 2 additional rounds allowed per Rule 8.2.8)
  if (!campaignState.workflow) campaignState.workflow = {};
  if (!campaignState.workflow.additionalRoundsCount) {
    campaignState.workflow.additionalRoundsCount = 0;
  }
  if (campaignState.workflow.additionalRoundsCount >= 2) {
    const limitMsg = isEn
      ? "⚠️ Rule 8.2.8 Limit: Maximum 2 Additional Rounds of Combat permitted in the same travel box! You must advance the travel box to continue."
      : "⚠️ Límite Regla 8.2.8: ¡Máximo 2 Rondas Adicionales permitidas en la misma casilla! Debes avanzar de casilla para continuar.";
    showToast(limitMsg);
    if (resEl) {
      resEl.style.display = 'block';
      resEl.style.background = 'rgba(245,158,11,0.15)';
      resEl.style.border = '1px solid #f59e0b';
      resEl.style.color = '#fde047';
      resEl.innerText = limitMsg;
    }
    return;
  }

  campaignState.workflow.additionalRoundsCount++;

  // Roll 2d6 on Chart A3 under "Additional Round of Combat" / Special Mission column
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;

  let msg = '';
  if (sum === 2) {
    // 2: Escort arrives! Roll detection on B4
    target.escort = true;
    target.is_escort_arrived = true;
    msg = isEn
      ? `🚨 Chart A3 [Additional Round: 2d6 = ${d1}+${d2}=2]: <strong>AN ESCORT ARRIVES!</strong> Target is now escorted. Roll acoustic detection on Chart B4 immediately [Rule 8.2.8]!`
      : `🚨 Tabla A3 [Ronda Adicional: 2d6 = ${d1}+${d2}=2]: <strong>¡LLEGA UNA ESCOLTA!</strong> El blanco está ahora escoltado. ¡Tira detección en Tabla B4 inmediatamente [Regla 8.2.8]!`;
    showToast(isEn ? "Alert! Escort arrives on scene [Rule 8.2.8]!" : "¡Alerta! Llega una escolta al sector [Regla 8.2.8]!");
    if (resEl) {
      resEl.style.display = 'block';
      resEl.style.background = 'rgba(239,68,68,0.18)';
      resEl.style.border = '1px solid #ef4444';
      resEl.style.color = '#fca5a5';
      resEl.innerHTML = msg;
    }
  } else if (sum === 3) {
    // 3: Aircraft arrives! Abort attack and crash dive
    msg = isEn
      ? `🚨 Chart A3 [Additional Round: 2d6 = ${d1}+${d2}=3]: <strong>ENEMY AIRCRAFT ARRIVES!</strong> You must abort attack, dive immediately, and resolve air attack [Rule 8.3 / Chart A4].`
      : `🚨 Tabla A3 [Ronda Adicional: 2d6 = ${d1}+${d2}=3]: <strong>¡AVIÓN ENEMIGO EN APROXIMACIÓN!</strong> Debes abortar el ataque, iniciar inmersión de emergencia y resolver ataque aéreo [Regla 8.3 / Tabla A4].`;
    showToast(isEn ? "Aircraft incoming! Crash dive [Rule 8.2.8]!" : "¡Avión aproximándose! Inmersión rápida [Regla 8.2.8]!");
    if (resEl) {
      resEl.style.display = 'block';
      resEl.style.background = 'rgba(239,68,68,0.18)';
      resEl.style.border = '1px solid #ef4444';
      resEl.style.color = '#fca5a5';
      resEl.innerHTML = msg;
    }
  } else {
    // 4-12: Clear waters!
    // Player may again fire torpedoes and/or up to 2x deck gun shots from close range per normal combat procedure.
    const rangeSelect = document.getElementById('wf-range-select');
    if (rangeSelect) rangeSelect.value = 'close';
    msg = isEn
      ? `🌊 Chart A3 [Additional Round: 2d6 = ${d1}+${d2}=${sum}]: <strong>CLEAR WATERS!</strong> No escorts or aircraft arrived. Initiating <strong>2nd Combat Round at CLOSE RANGE (+1 To-Hit)</strong>! You may fire reloaded torpedoes or up to 2 Deck Gun shots [Rule 8.2.8] (Round ${campaignState.workflow.additionalRoundsCount}/2 in this box).`
      : `🌊 Tabla A3 [Ronda Adicional: 2d6 = ${d1}+${d2}=${sum}]: <strong>¡AGUAS DESPEJADAS!</strong> No llegan escoltas ni aviones. ¡Iniciando <strong>2.ª Ronda de Combate a CORTA DISTANCIA (+1 Puntería)</strong>! Puedes disparar torpedos recargados o hasta 2 cañonazos de cubierta [Regla 8.2.8] (Ronda ${campaignState.workflow.additionalRoundsCount}/2 en esta casilla).`;
    showToast(isEn ? "Clear waters! 2nd Round at Close Range granted." : "¡Aguas despejadas! Concedida 2.ª Ronda a Corta Distancia.");
    if (resEl) {
      resEl.style.display = 'block';
      resEl.style.background = 'rgba(34,197,94,0.18)';
      resEl.style.border = '1px solid #22c55e';
      resEl.style.color = '#86efac';
      resEl.innerHTML = msg;
    }
  }

  const hitRes = document.getElementById('wf-combat-hit-res');
  if (hitRes) hitRes.innerHTML = msg;
}
window.rollAdditionalRound828 = rollAdditionalRound828;

