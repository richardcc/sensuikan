// =========================================================================
// SENSUiKAN: GAME FLOW - PHASE 0: COMMISSIONING & TRAINING SCHOOLS
// Submarine selection, historical ace setup, and Training Schools F1, F2, F3 & F4 Otsujima Kaiten.
// =========================================================================

    function rollCaptainTorpedoTraining() {
      // Regla Oficial Tabla B1: Larga Distancia (Long Range) = 2 a 6 es IMPACTO (Tirada Baja Impacta)
      const isEn = (window.currentLang === 'en');
      let hits = 0;
      let rolls = [];
      for (let i = 0; i < 3; i++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        const isHit = (sum <= 6);
        rolls.push(`${sum} [${d1}+${d2}]${isHit ? '🎯' : '❌'}`);
        if (isHit) hits++;
      }
      campaignState.school.capTorpEarned = (hits >= 2);
      const el = document.getElementById('res-f1-cap-torp');
      if (el) el.dataset.rolled = 'true';
      if (campaignState.school.capTorpEarned) {
        el.innerHTML = isEn
          ? `🎲 2d6 Rolls [B1 Long Range]: [${rolls.join(', ')}] ➔ <span style="color:#22c55e; font-weight:800;">SUCCESS! (${hits}/3 hits &le; 6). Torpedo Gunnery skill GAINED.</span>`
          : `🎲 Tiradas 2d6 [B1 Larga]: [${rolls.join(', ')}] ➔ <span style="color:#22c55e; font-weight:800;">¡ÉXITO! (${hits}/3 impactos &le; 6). Habilidad Torpedo Gunnery GANADA.</span>`;
        showToast(isEn ? "Captain gains Torpedo Gunnery!" : "¡Capitán gana Torpedo Gunnery!");
        setK1Token('cap-torp', true);
        highlightSchoolBox('sch-row-b1-long', 'green');
      } else {
        el.innerHTML = isEn
          ? `🎲 2d6 Rolls [B1 Long Range]: [${rolls.join(', ')}] ➔ <span style="color:#ef4444; font-weight:800;">Failed (${hits}/3 hits &le; 6). No skill gained.</span>`
          : `🎲 Tiradas 2d6 [B1 Larga]: [${rolls.join(', ')}] ➔ <span style="color:#ef4444; font-weight:800;">Fallo (${hits}/3 impactos &le; 6). No obtiene habilidad.</span>`;
        showToast(isEn ? "Captain failed torpedo training." : "Capitán falló el entrenamiento de torpedos.");
        setK1Token('cap-torp', false);
        highlightSchoolBox('sch-row-b1-long', 'red');
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollXODeckGunTraining() {
      // Regla Oficial Tabla B1: Larga Distancia = 2 a 6 es IMPACTO
      const isEn = (window.currentLang === 'en');
      let hits = 0;
      let rolls = [];
      for (let i = 0; i < 3; i++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        const isHit = (sum <= 6);
        rolls.push(`${sum} [${d1}+${d2}]${isHit ? '🎯' : '❌'}`);
        if (isHit) hits++;
      }
      campaignState.school.xoDeckGunEarned = (hits >= 2);
      const el = document.getElementById('res-f1-xo-gun');
      if (el) el.dataset.rolled = 'true';
      if (campaignState.school.xoDeckGunEarned) {
        el.innerHTML = isEn
          ? `🎲 2d6 Rolls [B1 Long Range]: [${rolls.join(', ')}] ➔ <span style="color:#22c55e; font-weight:800;">SUCCESS! (${hits}/3 hits &le; 6). Deck Gun Expert skill GAINED.</span>`
          : `🎲 Tiradas 2d6 [B1 Larga]: [${rolls.join(', ')}] ➔ <span style="color:#22c55e; font-weight:800;">¡ÉXITO! (${hits}/3 impactos &le; 6). Habilidad Deck Gun Expert GANADA.</span>`;
        showToast(isEn ? "XO gains Deck Gun Expert!" : "¡XO gana Deck Gun Expert!");
        setK1Token('xo-deckgun', true);
        highlightSchoolBox('sch-row-b1-long', 'green');
      } else {
        el.innerHTML = isEn
          ? `🎲 2d6 Rolls [B1 Long Range]: [${rolls.join(', ')}] ➔ <span style="color:#ef4444; font-weight:800;">Failed (${hits}/3 hits &le; 6). No skill gained.</span>`
          : `🎲 Tiradas 2d6 [B1 Larga]: [${rolls.join(', ')}] ➔ <span style="color:#ef4444; font-weight:800;">Fallo (${hits}/3 impactos &le; 6). No obtiene habilidad.</span>`;
        showToast(isEn ? "XO failed deck gun training." : "XO falló el adiestramiento de cañón.");
        setK1Token('xo-deckgun', false);
        highlightSchoolBox('sch-row-b1-long', 'red');
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollEngineerJudgmentTraining() {
      // Regla Oficial 8.2.6 y 4.8.1 (Chart F1):
      // Exceder profundidad de prueba (Exceeding Test Depth):
      // Con daño acumulado D (simulado 3, 4 y 5):
      // Tira 2d6. Si 2d6 < D -> Implosión y hundimiento. Si 2d6 >= D -> Superado sin daño.
      const isEn = (window.currentLang === 'en');
      let implosion = false;
      let rolls = [];
      for (let notionalDmg = 3; notionalDmg <= 5; notionalDmg++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const diceSum = d1 + d2;
        if (diceSum < notionalDmg) {
          rolls.push(isEn ? `T.${notionalDmg-2} (Dmg ${notionalDmg}): 2d6=[${d1}+${d2}=${diceSum}] < ${notionalDmg} (Implosion!)` : `P.${notionalDmg-2} (Daño ${notionalDmg}): 2d6=[${d1}+${d2}=${diceSum}] < ${notionalDmg} (¡Implosión!)`);
          implosion = true;
          break;
        } else {
          rolls.push(isEn ? `T.${notionalDmg-2} (Dmg ${notionalDmg}): 2d6=[${d1}+${d2}=${diceSum}] &ge; ${notionalDmg} (OK)` : `P.${notionalDmg-2} (Daño ${notionalDmg}): 2d6=[${d1}+${d2}=${diceSum}] &ge; ${notionalDmg} (OK)`);
        }
      }
      campaignState.school.engJudgmentEarned = !implosion;
      const el = document.getElementById('res-f1-eng-keen');
      if (el) el.dataset.rolled = 'true';
      if (campaignState.school.engJudgmentEarned) {
        el.innerHTML = isEn
          ? `⚡ Test Depth [Rule 8.2.6]: [${rolls.join(' | ')}] ➔ <span style="color:#22c55e; font-weight:800;">SUCCESS! Passed all 3 tests (2d6 &ge; damage). Keen Judgment skill GAINED.</span>`
          : `⚡ Profundidad Límite [Regla 8.2.6]: [${rolls.join(' | ')}] ➔ <span style="color:#22c55e; font-weight:800;">¡ÉXITO! Superó las 3 pruebas (2d6 &ge; daño). Habilidad Keen Judgment GANADA.</span>`;
        showToast(isEn ? "Chief Engineer gains Keen Judgment!" : "¡Jefe de Máquinas obtiene Keen Judgment!");
        setK1Token('eng-keen', true);
        highlightSchoolBox('sch-box-depth-pass', 'green');
      } else {
        el.innerHTML = isEn
          ? `⚡ Test Depth [Rule 8.2.6]: [${rolls.join(' | ')}] ➔ <span style="color:#ef4444; font-weight:800;">Failed (2d6 < damage: simulated implosion). No skill gained.</span>`
          : `⚡ Profundidad Límite [Regla 8.2.6]: [${rolls.join(' | ')}] ➔ <span style="color:#ef4444; font-weight:800;">Fallo (2d6 < daño: Implosión simulada). No obtiene habilidad.</span>`;
        showToast(isEn ? "Simulated implosion on depth test." : "Implosión simulada en prueba de profundidad.");
        setK1Token('eng-keen', false);
        highlightSchoolBox('sch-box-depth-fail', 'red');
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function onSpareTimeChange() {
      const radios = document.getElementsByName('f1-spare-time');
      for (let r of radios) {
        if (r.checked) {
          campaignState.school.spareTime = r.value;
          if (typeof setK1Token === 'function') {
            setK1Token('cap-shibumi', r.value === 'martial');
            setK1Token('sub-upgrades', r.value === 'study');
            setK1Token('penalty-promo', r.value === 'study');
            setK1Token('maneki-neko', r.value === 'gosei');
          }
          campaignState.manekiNeko = (r.value === 'gosei');
          break;
        }
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollF2Torpedo() {
      // 3 rolls on Chart B1 long range: Roll Low system (2-6 is hit / <= 6)
      const isEn = (window.currentLang === 'en');
      let hits = 0;
      let rolls = [];
      for (let i = 0; i < 3; i++) {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        rolls.push(`${sum} [${d1}+${d2}]`);
        if (sum <= 6) hits++;
      }
      campaignState.school.f2TorpEarned = (hits >= 2);
      if (typeof setK1Token === 'function') setK1Token('midget-torp', hits >= 2);
      const el = document.getElementById('res-f2-torp');
      if (el) el.dataset.rolled = 'true';
      if (isEn) {
        el.innerHTML = `🎲 Rolls: [${rolls.join(', ')}] ➔ ` + ((hits >= 2) ? `<span style="color:#22c55e; font-weight:800;">Passed (${hits}/3 &le; 6)</span>` : `<span style="color:#ef4444; font-weight:800;">Failed (${hits}/3)</span>`);
        showToast(`F2 Torpedoes: ${hits >= 2 ? 'Passed!' : 'Failed'}`);
      } else {
        el.innerHTML = `🎲 Tiradas: [${rolls.join(', ')}] ➔ ` + ((hits >= 2) ? `<span style="color:#22c55e; font-weight:800;">Ganado (${hits}/3 &le; 6)</span>` : `<span style="color:#ef4444; font-weight:800;">Fallo (${hits}/3)</span>`);
        showToast(`F2 Torpedos: ${hits >= 2 ? '¡Ganado!' : 'Fallo'}`);
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollF2Comms() {
      // Roll twice on Sub Recovery M7. 1d6: 1-3 failure, 4-6 success
      const isEn = (window.currentLang === 'en');
      const r1 = Math.floor(Math.random() * 6) + 1;
      const r2 = Math.floor(Math.random() * 6) + 1;
      const pass = (r1 >= 4 && r2 >= 4);
      campaignState.school.f2CommsEarned = pass;
      if (typeof setK1Token === 'function') setK1Token('midget-comms', pass);
      const el = document.getElementById('res-f2-comms');
      if (el) el.dataset.rolled = 'true';
      if (isEn) {
        el.innerHTML = `🎲 1d6: [${r1}, ${r2}] ➔ ` + (pass ? `<span style="color:#22c55e; font-weight:800;">Passed (both &ge; 4)</span>` : `<span style="color:#ef4444; font-weight:800;">Failed (requires 4-6)</span>`);
        showToast(`F2 Comms: ${pass ? 'Passed!' : 'Failed'}`);
      } else {
        el.innerHTML = `🎲 1d6: [${r1}, ${r2}] ➔ ` + (pass ? `<span style="color:#22c55e; font-weight:800;">Ganado (ambos &ge; 4)</span>` : `<span style="color:#ef4444; font-weight:800;">Fallo (requiere 4-6)</span>`);
        showToast(`F2 Comunicaciones: ${pass ? '¡Ganado!' : 'Fallo'}`);
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollF2Net() {
      // Roll 3 times on Net M5. 1d6. If none are 2-4 -> pass
      const isEn = (window.currentLang === 'en');
      const r1 = Math.floor(Math.random() * 6) + 1;
      const r2 = Math.floor(Math.random() * 6) + 1;
      const r3 = Math.floor(Math.random() * 6) + 1;
      const fail = ([r1, r2, r3].some(r => r >= 2 && r <= 4));
      campaignState.school.f2NetEarned = !fail;
      if (typeof setK1Token === 'function') setK1Token('midget-boat', !fail);
      const el = document.getElementById('res-f2-net');
      if (el) el.dataset.rolled = 'true';
      if (isEn) {
        el.innerHTML = `🎲 1d6: [${r1}, ${r2}, ${r3}] ➔ ` + (!fail ? `<span style="color:#22c55e; font-weight:800;">Passed (none 2-4)</span>` : `<span style="color:#ef4444; font-weight:800;">Failed (trapped on 2-4)</span>`);
        showToast(`F2 Nets: ${!fail ? 'Passed!' : 'Failed'}`);
      } else {
        el.innerHTML = `🎲 1d6: [${r1}, ${r2}, ${r3}] ➔ ` + (!fail ? `<span style="color:#22c55e; font-weight:800;">Ganado (ninguno 2-4)</span>` : `<span style="color:#ef4444; font-weight:800;">Fallo (atrapado en 2-4)</span>`);
        showToast(`F2 Redes: ${!fail ? '¡Ganado!' : 'Fallo'}`);
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function getActiveSubmarine() {
      const key = campaignState && campaignState.activeSubKey;
      if (!key) return null;
      if (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines && SUB_DB.submarines[key]) {
        return SUB_DB.submarines[key];
      }
      if (typeof SUBMARINES_DB !== 'undefined' && SUBMARINES_DB && SUBMARINES_DB[key]) {
        return SUBMARINES_DB[key];
      }
      return null;
    }

    let f3ActivePilotIndex = 0;

    function getSubmarineAircraftCount(subKey) {
      if (!subKey) return 0;
      if (subKey === 'Sen_Toku_Class') return 3;
      if (subKey === 'Type_A_Modified' || subKey === 'Type_A2_Class' || subKey === 'Type_AM_Class') return 2;
      if (['Junsen_J_IM_Class', 'Junsen_J2_Class', 'Junsen_J3_Class', 'Type_A_Class', 'Type_B_Class', 'Type_B_3_Class', 'Type_B2_Class'].includes(subKey)) return 1;
      const sub = getActiveSubmarine();
      if (sub && (sub.aircraft_count !== undefined || sub.aircraftCount !== undefined || sub.aircraft !== undefined)) {
        return sub.aircraft_count || sub.aircraftCount || sub.aircraft || (sub.has_aircraft ? 1 : 0);
      }
      return (sub && sub.has_aircraft) ? 1 : 0;
    }

    function getPilotAircraftName(subKey, pIdx) {
      if (subKey === 'Sen_Toku_Class') return `Aichi M6A1 Seiran #${pIdx + 1}`;
      if (subKey === 'Type_A_Modified') return `Yokosuka E14Y1 Glen #${pIdx + 1}`;
      if (subKey === 'Type_A2_Class' || subKey === 'Type_AM_Class') return `Aichi M6A1 Seiran #${pIdx + 1}`;
      if (subKey === 'Junsen_J2_Class') return 'Watanabe E9W1 Slim';
      return 'Yokosuka E14Y1 Glen';
    }

    function selectF3PilotTab(pIdx) {
      f3ActivePilotIndex = pIdx;
      updateSchoolEquipDisplay();
    }
    window.selectF3PilotTab = selectF3PilotTab;

    function checkSubAircraft(sub) {
      if (!sub) return false;
      const key = campaignState && campaignState.activeSubKey;
      if (['Sen_Toku_Class', 'Type_A_Modified', 'Type_A2_Class', 'Type_AM_Class', 'Type_A_Class', 'Type_B_Class', 'Type_B_3_Class', 'Type_B2_Class', 'Junsen_J_IM_Class', 'Junsen_J2_Class', 'Junsen_J3_Class'].includes(key)) {
        return true;
      }
      return Boolean(sub.has_aircraft === true || sub.aircraft_type || sub.plane === 1 || (sub.aircraft && sub.aircraft > 0));
    }

    function checkSubKaiten(sub) {
      if (!sub) return false;
      return Boolean(sub.has_kaiten === true || (sub.kaiten_note && sub.kaiten_note.toLowerCase().includes('kaiten')));
    }

    function syncF3ToK1() {
      const chkWeap = document.getElementById('chk-f3-weap');
      const chkMaint = document.getElementById('chk-f3-maint');
      const chkAcm = document.getElementById('chk-f3-acm');
      const chkNav = document.getElementById('chk-f3-nav');

      const skills = [];
      if (chkWeap && chkWeap.checked) skills.push("Weapons Expert");
      if (chkMaint && chkMaint.checked) skills.push("Flawless Maintenance");
      if (chkAcm && chkAcm.checked) skills.push("Air Combat Maneuvering");
      if (chkNav && chkNav.checked) skills.push("Aerial Navigation");

      if (window.campaignState) {
        window.campaignState.school = window.campaignState.school || {};
        window.campaignState.school.pilotSkills = window.campaignState.school.pilotSkills || { 0: [], 1: [], 2: [] };
        window.campaignState.school.pilotSkills[f3ActivePilotIndex] = [...skills];
        if (f3ActivePilotIndex === 0) {
          window.campaignState.school.f3Skills = [...skills];
        }
        if (window.campaignState.aircraftState && window.campaignState.aircraftState.skills) {
          window.campaignState.aircraftState.skills = {
            weapons: skills.includes("Weapons Expert"),
            maintenance: skills.includes("Flawless Maintenance"),
            acm: skills.includes("Air Combat Maneuvering"),
            nav: skills.includes("Aerial Navigation")
          };
        }
      }

      if (typeof setK1Token === 'function') {
        setK1Token('air1-weap', Boolean(chkWeap && chkWeap.checked));
        setK1Token('air1-maint', Boolean(chkMaint && chkMaint.checked));
        setK1Token('air1-acm', Boolean(chkAcm && chkAcm.checked));
        setK1Token('air1-nav', Boolean(chkNav && chkNav.checked));
      }
      if (typeof renderTokens === 'function') renderTokens();
      if (typeof syncSchoolSkillsToAircraftState === 'function') {
        syncSchoolSkillsToAircraftState();
      }
      if (typeof renderAircraftMatUI === 'function') {
        renderAircraftMatUI();
      }
    }

    function validateF3Checkboxes(el) {
      const isEn = (window.currentLang === 'en');
      const chks = [
        document.getElementById('chk-f3-weap'),
        document.getElementById('chk-f3-maint'),
        document.getElementById('chk-f3-acm'),
        document.getElementById('chk-f3-nav')
      ];
      let checkedCount = chks.filter(c => c && c.checked).length;
      if (checkedCount > 2) {
        if (el) el.checked = false;
        showToast(isEn ? `⚠️ You can choose at most 2 skills for Pilot #${f3ActivePilotIndex + 1} (Rule 4.8.3).` : `⚠️ Solo puedes elegir un máximo de 2 habilidades para el Piloto #${f3ActivePilotIndex + 1} (Regla 4.8.3).`);
      }
      syncF3ToK1();
      saveState();
    }

    function rollRandomF3Skills() {
      const isEn = (window.currentLang === 'en');
      const ids = ['chk-f3-weap', 'chk-f3-maint', 'chk-f3-acm', 'chk-f3-nav'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = false;
      });
      // Pick 2 distinct at random
      const shuffled = [...ids].sort(() => 0.5 - Math.random());
      const chosen = shuffled.slice(0, 2);
      chosen.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.checked = true;
      });
      syncF3ToK1();
      const subKey = (window.campaignState && window.campaignState.activeSubKey) || '';
      const airCount = getSubmarineAircraftCount(subKey);
      const pilotMsg = (airCount > 1) ? (isEn ? ` for Pilot #${f3ActivePilotIndex + 1}` : ` para el Piloto #${f3ActivePilotIndex + 1}`) : '';
      showToast(isEn ? `🎲 2 Air crew skills selected at random${pilotMsg}!` : `🎲 ¡2 Habilidades aéreas seleccionadas al azar${pilotMsg}!`);
      saveState();
    }
    window.rollRandomF3Skills = rollRandomF3Skills;

    function rollAllPilotsF3Skills() {
      const isEn = (window.currentLang === 'en');
      const subKey = (window.campaignState && window.campaignState.activeSubKey) || '';
      const airCount = Math.max(1, getSubmarineAircraftCount(subKey));
      const allSkillNames = ["Weapons Expert", "Flawless Maintenance", "Air Combat Maneuvering", "Aerial Navigation"];
      
      window.campaignState = window.campaignState || {};
      window.campaignState.school = window.campaignState.school || {};
      window.campaignState.school.pilotSkills = window.campaignState.school.pilotSkills || { 0: [], 1: [], 2: [] };

      for (let p = 0; p < airCount; p++) {
        const shuffled = [...allSkillNames].sort(() => 0.5 - Math.random());
        window.campaignState.school.pilotSkills[p] = shuffled.slice(0, 2);
      }
      if (window.campaignState.school.pilotSkills[0]) {
        window.campaignState.school.f3Skills = [...window.campaignState.school.pilotSkills[0]];
      }
      updateSchoolEquipDisplay();
      if (typeof syncSchoolSkillsToAircraftState === 'function') syncSchoolSkillsToAircraftState();
      if (typeof renderAircraftMatUI === 'function') renderAircraftMatUI();
      showToast(isEn ? `🎲 Flight School completed for all ${airCount} pilots [Rule 7.17]!` : `🎲 ¡Escuela F3 completada para los ${airCount} pilotos del submarino [Regla 7.17]!`);
      saveState();
    }
    window.rollAllPilotsF3Skills = rollAllPilotsF3Skills;

    function updateSchoolEquipDisplay() {
      const isEn = (window.currentLang === 'en');
      const sub = getActiveSubmarine();

      // Chart F3: Kasumigaura Air School Status
      const f3Card = document.getElementById('card-school-f3');
      const f3Badge = document.getElementById('f3-avail-badge');
      const f3BtnRoll = document.getElementById('f3-btn-roll');
      const f3OptsContainer = document.getElementById('f3-options-container');
      const f3Notice = document.getElementById('f3-no-plane-notice');
      const hasPlane = checkSubAircraft(sub);
      const planeName = sub ? (sub.aircraft_type || sub.plane_class || 'Yokosuka E14Y Glen') : 'E14Y Glen';
      if (f3Card && f3Badge) {
        f3Card.style.opacity = "1";
        if (hasPlane) {
          f3Badge.style.background = "#059669";
          f3Badge.style.color = "#ffffff";
          f3Badge.innerHTML = isEn ? `🟢 Air Crew Active (${planeName})` : `🟢 Dotación Aérea Operativa (${planeName})`;
          if (f3Notice) f3Notice.style.display = "none";
        } else {
          f3Badge.style.background = "#334155";
          f3Badge.style.color = "#cbd5e1";
          f3Badge.innerHTML = isEn ? `⚪ No Floatplane (Inactive • Manual Mode)` : `⚪ Sin Hidroavión (Inactivo • Modo Libre)`;
          if (f3Notice) f3Notice.style.display = "block";
        }
        if (f3BtnRoll) {
          f3BtnRoll.disabled = false;
          f3BtnRoll.style.opacity = "1";
          f3BtnRoll.style.cursor = "pointer";
        }
        if (f3OptsContainer) {
          f3OptsContainer.style.opacity = "1";
          f3OptsContainer.style.pointerEvents = "auto";
        }
        const subKey = (window.campaignState && window.campaignState.activeSubKey) || '';
        const airCount = getSubmarineAircraftCount(subKey);

        // Ensure pilotSkills object exists
        window.campaignState = window.campaignState || {};
        window.campaignState.school = window.campaignState.school || {};
        window.campaignState.school.pilotSkills = window.campaignState.school.pilotSkills || { 0: [], 1: [], 2: [] };
        if ((!window.campaignState.school.pilotSkills[0] || window.campaignState.school.pilotSkills[0].length === 0) &&
            (window.campaignState.school.f3Skills && window.campaignState.school.f3Skills.length > 0)) {
          window.campaignState.school.pilotSkills[0] = [...window.campaignState.school.f3Skills];
        }

        const pilotContainer = document.getElementById('f3-multi-pilot-container');
        const pilotTabs = document.getElementById('f3-pilot-tabs');
        const btnRollAll = document.getElementById('f3-btn-roll-all');
        const pilotHeading = document.getElementById('f3-pilot-heading');
        const pilotNote = document.getElementById('f3-pilot-rule-note');

        if (hasPlane && airCount > 1) {
          if (pilotContainer) pilotContainer.style.display = 'block';
          if (btnRollAll) btnRollAll.style.display = 'inline-block';
          if (pilotHeading) {
            pilotHeading.innerText = isEn ? `Multi-Aircraft Submarine (${airCount} Pilots) [Rule 7.17]:` : `Submarino Multiavión (${airCount} Pilotos) [Regla Oficial 7.17]:`;
          }
          if (pilotNote) {
            pilotNote.innerText = isEn 
              ? `Submarines with multiple aircraft conduct Flight School separately for each pilot (${airCount} pilots total). Each pilot receives up to 2 distinct skills.`
              : `Los submarinos con múltiples aeronaves realizan la Escuela F3 independientemente para cada piloto (${airCount} pilotos en total). Cada piloto adquiere hasta 2 habilidades independientes.`;
          }
          if (pilotTabs) {
            let tabsHtml = '';
            for (let p = 0; p < airCount; p++) {
              const isSelected = (p === f3ActivePilotIndex);
              const pSkills = (window.campaignState.school.pilotSkills && window.campaignState.school.pilotSkills[p]) || [];
              const pCount = pSkills.length;
              const countBadge = (pCount === 2) ? '🟢 2/2' : (pCount === 1 ? '🟡 1/2' : '⚪ 0/2');
              tabsHtml += `
                <button type="button" onclick="window.selectF3PilotTab(${p})" style="padding:4px 10px; font-size:0.75rem; font-weight:bold; border-radius:4px; border:1.5px solid ${isSelected ? '#38bdf8' : '#334155'}; background:${isSelected ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#1e293b'}; color:${isSelected ? '#ffffff' : '#94a3b8'}; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:${isSelected ? '0 0 10px rgba(56,189,248,0.5)' : 'none'}; transition:all 0.2s ease;">
                  <span>✈️ ${isEn ? 'Pilot' : 'Piloto'} #${p + 1} (${countBadge})</span>
                </button>
              `;
            }
            pilotTabs.innerHTML = tabsHtml;
          }
        } else {
          if (pilotContainer) pilotContainer.style.display = 'none';
          if (btnRollAll) btnRollAll.style.display = 'none';
          f3ActivePilotIndex = 0;
        }

        const chooseText = document.getElementById('f3-choose-text');
        if (chooseText) {
          if (airCount > 1) {
            const pName = getPilotAircraftName(subKey, f3ActivePilotIndex);
            chooseText.innerHTML = isEn 
              ? `Choose up to 2 skills for <strong style="color:var(--gold-300);">Pilot #${f3ActivePilotIndex + 1} (${pName})</strong>:`
              : `Elige hasta 2 habilidades para el <strong style="color:var(--gold-300);">Piloto #${f3ActivePilotIndex + 1} (${pName})</strong>:`;
          } else {
            chooseText.innerText = isEn ? "Choose exactly 2 skills for your air crew:" : "Elige exactamente 2 habilidades para tu dotación aérea:";
          }
        }

        ['chk-f3-weap', 'chk-f3-maint', 'chk-f3-acm', 'chk-f3-nav'].forEach(id => {
          const chk = document.getElementById(id);
          if (chk) chk.disabled = false;
        });
        const currentSkills = (window.campaignState && window.campaignState.school && window.campaignState.school.pilotSkills && window.campaignState.school.pilotSkills[f3ActivePilotIndex]) || (window.campaignState && window.campaignState.school && window.campaignState.school.f3Skills) || [];
        const chkWeap = document.getElementById('chk-f3-weap');
        const chkMaint = document.getElementById('chk-f3-maint');
        const chkAcm = document.getElementById('chk-f3-acm');
        const chkNav = document.getElementById('chk-f3-nav');
        if (chkWeap) chkWeap.checked = currentSkills.some(s => s.toLowerCase().includes('weapon'));
        if (chkMaint) chkMaint.checked = currentSkills.some(s => s.toLowerCase().includes('maint'));
        if (chkAcm) chkAcm.checked = currentSkills.some(s => s.toLowerCase().includes('acm') || s.toLowerCase().includes('maneuver'));
        if (chkNav) chkNav.checked = currentSkills.some(s => s.toLowerCase().includes('nav'));
      }

      // Chart F2: Ko-hyoteki Midget Sub Status
      const f2Card = document.getElementById('card-school-f2');
      const f2Badge = document.getElementById('f2-avail-badge');
      const isTypeC = sub && sub.class_name && sub.class_name.includes("Type C") && !sub.class_name.includes("Type C3");
      if (f2Card && f2Badge) {
        f2Card.style.opacity = "1";
        if (isTypeC) {
          f2Badge.style.background = "#059669";
          f2Badge.style.color = "#ffffff";
          f2Badge.innerHTML = isEn ? `🟢 Ko-Hyoteki Midget Submarines onboard` : `🟢 Minisubmarinos Ko-Hyoteki a bordo`;
        } else {
          f2Badge.style.background = "#334155";
          f2Badge.style.color = "#cbd5e1";
          f2Badge.innerHTML = isEn ? `⚪ Optional Training (No Midget Sub)` : `⚪ Adiestramiento Opcional (Sin Ko-Hyoteki)`;
        }
      }

      // Chart F4: Otsujima Kaiten School Status
      const f4Card = document.getElementById('card-school-f4');
      const f4Badge = document.getElementById('f4-avail-badge');
      const f4BtnRoll = document.getElementById('f4-btn-roll');
      const f4BtnPreset = document.getElementById('f4-btn-preset');
      const f4OptsContainer = document.getElementById('f4-options-container');
      const f4Notice = document.getElementById('f4-no-kaiten-notice');
      const hasKaiten = checkSubKaiten(sub);
      if (f4Card && f4Badge) {
        f4Card.style.opacity = "1";
        if (hasKaiten) {
          f4Badge.style.background = "#059669";
          f4Badge.style.color = "#ffffff";
          f4Badge.innerHTML = isEn ? `🟢 Kaiten Capable (4–6 Pilots onboard) [Rule 4.8.4]` : `🟢 Capacidad Kaiten (4–6 Pilotos a bordo) [Regla 4.8.4]`;
          if (f4Notice) f4Notice.style.display = "none";
        } else {
          f4Badge.style.background = "#334155";
          f4Badge.style.color = "#cbd5e1";
          f4Badge.innerHTML = isEn ? `⚪ No Kaiten (Inactive • Manual Mode)` : `⚪ Sin Kaiten (Inactivo • Modo Libre)`;
          if (f4Notice) f4Notice.style.display = "block";
        }
        if (f4BtnRoll) {
          f4BtnRoll.disabled = false;
          f4BtnRoll.style.opacity = "1";
          f4BtnRoll.style.cursor = "pointer";
        }
        if (f4BtnPreset) {
          f4BtnPreset.disabled = false;
          f4BtnPreset.style.opacity = "1";
          f4BtnPreset.style.cursor = "pointer";
        }
        if (f4OptsContainer) {
          f4OptsContainer.style.opacity = "1";
          f4OptsContainer.style.pointerEvents = "auto";
        }
        for (let i = 1; i <= 6; i++) {
          const sel = document.getElementById(`sel-f4-pilot-${i}`);
          if (sel) sel.disabled = false;
        }
      }
    }

    function syncF4ToK1() {
      if (!Array.isArray(campaignState.kaitenPilots)) campaignState.kaitenPilots = [];
      campaignState.kaitenPilots = [];
      for (let i = 1; i <= 6; i++) {
        const sel = document.getElementById(`sel-f4-pilot-${i}`);
        if (sel) {
          campaignState.kaitenPilots.push({ pilot: i, benefit: sel.value || '' });
        }
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollRandomF4Benefits() {
      const isEn = (window.currentLang === 'en');
      const opts = ['senninbari', 'hachimaki', 'ashes'];
      for (let i = 1; i <= 6; i++) {
        const sel = document.getElementById(`sel-f4-pilot-${i}`);
        if (sel) {
          const roll = Math.floor(Math.random() * 3);
          sel.value = opts[roll];
        }
      }
      syncF4ToK1();
      showToast(isEn ? "🎲 Otsujima benefits randomly assigned (1d3) for all 6 Kaiten pilots!" : "🎲 ¡Beneficios de Otsujima asignados al azar (1d3) para los 6 pilotos Kaiten!");
    }

    function setPresetF4Benefits() {
      const isEn = (window.currentLang === 'en');
      const preset = ['senninbari', 'hachimaki', 'ashes', 'senninbari', 'hachimaki', 'ashes'];
      for (let i = 1; i <= 6; i++) {
        const sel = document.getElementById(`sel-f4-pilot-${i}`);
        if (sel) {
          sel.value = preset[i-1];
        }
      }
      syncF4ToK1();
      showToast(isEn ? "⚖️ Balanced preset assigned for Kaiten pilots (2 Senninbari, 2 Hachimaki, 2 Ashes)." : "⚖️ Asignado preset equilibrado para los pilotos Kaiten (2 Senninbari, 2 Hachimaki, 2 Ashes).");
    }

    function completeTrainingAndProceedToPatrol() {
      const isEn = (window.currentLang === 'en');
      // 1. Captain Torpedo Gunnery
      setK1Token('cap-torp', Boolean(campaignState.school && campaignState.school.capTorpEarned));

      // 2. XO Deck Gun Expert
      setK1Token('xo-deckgun', Boolean(campaignState.school && campaignState.school.xoDeckGunEarned));

      // 3. Engineer Keen Judgment
      setK1Token('eng-keen', Boolean(campaignState.school && campaignState.school.engJudgmentEarned));

      // 4. Spare Time Activity
      const radios = document.getElementsByName('f1-spare-time');
      let st = "martial";
      for (let r of radios) { if (r.checked) st = r.value; }
      setK1Token('cap-shibumi', st === 'martial');
      setK1Token('sub-upgrades', st === 'study');
      setK1Token('penalty-promo', st === 'study');
      setK1Token('maneki-neko', st === 'gosei');
      campaignState.manekiNeko = (st === 'gosei');

      // 5. Graduation: Sub Badge awarded on uniform!
      setK1Token('medal-sub', true);

      // 6. Kasumigaura Air School: apply selected options (only if sub has aircraft)
      const sub = getActiveSubmarine();
      const hasPlane = checkSubAircraft(sub);
      const chkWeap = document.getElementById('chk-f3-weap');
      const chkMaint = document.getElementById('chk-f3-maint');
      const chkAcm = document.getElementById('chk-f3-acm');
      const chkNav = document.getElementById('chk-f3-nav');
      setK1Token('air1-weap', Boolean(chkWeap && chkWeap.checked));
      setK1Token('air1-maint', Boolean(chkMaint && chkMaint.checked));
      setK1Token('air1-acm', Boolean(chkAcm && chkAcm.checked));
      setK1Token('air1-nav', Boolean(chkNav && chkNav.checked));

      // 7. Midget Sub School: apply earned skills
      setK1Token('midget-torp', Boolean(campaignState.school && campaignState.school.f2TorpEarned));
      setK1Token('midget-comms', Boolean(campaignState.school && campaignState.school.f2CommsEarned));
      setK1Token('midget-boat', Boolean(campaignState.school && campaignState.school.f2NetEarned));

      // 8. Otsujima Kaiten School: save benefits for active pilots
      syncF4ToK1();

      // Render tokens immediately and save
      renderTokens();
      showToast(isEn ? "Kure Graduation completed! Sub Badge and medals awarded on Chart K1." : "¡Graduación en Kure completada! Sub Badge e insignias colocadas en Chart K1.");
      setWorkflowPhase(1);
      saveState();
    }

    function onWorkflowSubClassChange() {
      const selVal = document.getElementById('wf-sub-class-select').value;
      if (!selVal) {
        campaignState.activeSubKey = null;
        if (campaignState.workflow) {
          campaignState.workflow.hullNumber = "";
          delete campaignState.workflow.torpedoPeriodOverride;
        }
        const hullInput = document.getElementById('wf-sub-hull-number');
        if (hullInput) {
          hullInput.value = "";
          hullInput.placeholder = (window.currentLang === 'en') ? "e.g. I-19" : "ej. I-19";
        }
        if (typeof changeBoardSubmarine === 'function') {
          changeBoardSubmarine('');
        }
        updateWorkflowSubmarineSpecs();
        updateTorpedoDoctrineDisplay();
        buildWorkflowMonthSelect();
        saveState();
        return;
      }
      campaignState.activeSubKey = selVal;
      const defHull = (typeof getDefaultHullForSubmarine === 'function') ? getDefaultHullForSubmarine(selVal) : 'I-19';
      const hullInput = document.getElementById('wf-sub-hull-number');
      if (hullInput) hullInput.value = defHull;
      if (campaignState.workflow) campaignState.workflow.hullNumber = defHull;

      selectSubmarine(selVal);
      if (typeof changeBoardSubmarine === 'function') {
        changeBoardSubmarine(selVal);
      }
      if (campaignState.workflow) {
        delete campaignState.workflow.torpedoPeriodOverride;
      }
      updateSchoolEquipDisplay();
      buildWorkflowMonthSelect();
      updateWorkflowSubmarineSpecs();
      updateBasesForDate(campaignState.workflow.selectedMonth || "1941-12");
      updateSpecialEventsForMonthArea(); renderMissionChits();
      recalculatePatrolTrack();
      saveState();
    }

    function onWorkflowHullNumberChange() {
      campaignState.workflow.hullNumber = document.getElementById('wf-sub-hull-number').value;
      saveState();
    }

    function onWorkflowCommanderChange() {
      const val = document.getElementById('wf-commander-name').value;
      campaignState.workflow.commanderName = val;
      if (typeof regenerateCommanderBio === 'function') regenerateCommanderBio(false);
      else if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      saveState();
    }

    function onWorkflowRankChange() {
      const r = document.getElementById('wf-commander-rank').value;
      campaignState.workflow.commanderRank = r;
      if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      saveState();
    }

    function onWorkflowStartingBaseChange() {
      const val = normalizeBaseName(document.getElementById('wf-starting-base').value);
      campaignState.workflow.startingBase = val;
      updateBaseDescriptionPill(val);
      const base1 = document.getElementById('wf-base-select');
      if (base1 && base1.value !== val) base1.value = val;
      if (typeof window.onSensuikanBaseChanged === 'function') window.onSensuikanBaseChanged(val);
      saveState();
      if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
      if (typeof renderSubBoard === 'function') renderSubBoard();
    }

    function loadHistoricalAce(name, boat, subClass) {
      document.getElementById('wf-commander-name').value = name;
      document.getElementById('wf-sub-hull-number').value = boat;
      
      const subSel = document.getElementById('wf-sub-class-select');
      for (let i = 0; i < subSel.options.length; i++) {
        if (subSel.options[i].text.includes(subClass) || subSel.options[i].value.includes(boat)) {
          subSel.selectedIndex = i;
          break;
        }
      }
      onWorkflowSubClassChange();
      campaignState.workflow.commanderName = name;
      campaignState.workflow.hullNumber = boat;
      if (typeof regenerateCommanderBio === 'function') regenerateCommanderBio(true);
      else if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      showToast(`As histórico cargado: ${name} (${boat})`);
      saveState();
    }

    
    function checkSubmarineRadarStatus() {
      const subKey = campaignState.activeSubKey || "Type_B_Class";
      const monthStr = (campaignState.workflow && campaignState.workflow.selectedMonth) ? campaignState.workflow.selectedMonth : "1941-12";
      const isEn = window.currentLang === 'en';
      const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;

      let isEquipped = false;
      let radarModel = "";

      // 1. Check parameterized radar object first
      if (subData && subData.radar) {
        if (subData.radar.equipped) {
          isEquipped = true;
          radarModel = isEn ? subData.radar.model : (subData.radar.model_es || subData.radar.model);
        } else if (subData.radar.retrofit_month) {
          const parts = monthStr.split('-');
          const y = parseInt(parts[0], 10) || 1941;
          const m = parseInt(parts[1], 10) || 12;
          const [reqY, reqM] = subData.radar.retrofit_month.split('-').map(v => parseInt(v, 10));
          if (y > reqY || (y === reqY && m >= reqM)) {
            isEquipped = true;
            radarModel = isEn ? subData.radar.model : (subData.radar.model_es || subData.radar.model);
          }
        }
      } else {
        // Fallback to legacy checks if radar property missing
        if (subKey === "Sen_Toku_Class") {
          isEquipped = true;
          radarModel = isEn ? "Mk 3 M1 Air / Mk 2 M2 Surface" : "Mk 3 M1 Aéreo / Mk 2 M2 Superficie";
        } else if (subKey === "Type_B3_Class" || subKey === "Type_B_3_Class" || subKey.includes("B3") || subKey.includes("B_3")) {
          isEquipped = true;
          radarModel = isEn ? "Type 22 Surface Radar" : "Radar Tipo 22 Superficie";
        } else if (subKey === "Type_A_Modified") {
          isEquipped = true;
          radarModel = isEn ? "Type 22 Surface Radar" : "Radar Tipo 22 Superficie";
        } else if (subKey === "Sen_Taka_Class") {
          isEquipped = true;
          radarModel = isEn ? "Advanced Air/Surface Radar" : "Radar Avanzado Aéreo/Superficie";
        }

        if (!isEquipped && (subKey === "Type_C_Class" || subKey === "Type_C3_Class" || subKey === "Type_C_3_Class")) {
          const parts = monthStr.split('-');
          const y = parseInt(parts[0], 10) || 1941;
          const m = parseInt(parts[1], 10) || 12;
          if (y > 1944 || (y === 1944 && m >= 12)) {
            isEquipped = true;
            radarModel = isEn ? "Type 22 AS/SS (Retrofit 12/44)" : "Radar Tipo 22 AS/SS (Refit 12/44)";
          }
        }
      }

      // 2. Check damage status
      const isDamaged = !!(campaignState.damage && campaignState.damage.radar);
      const isOperational = isEquipped && !isDamaged;

      campaignState.hasRadar = isOperational;
      campaignState.radarEquipped = isEquipped;
      campaignState.radarDamaged = isDamaged;
      campaignState.radarModel = radarModel;

      return {
        isEquipped,
        isOperational,
        isDamaged,
        radarModel
      };
    }
    window.checkSubmarineRadarStatus = checkSubmarineRadarStatus;

    const SUB_CHITS_MAP = new Proxy({
      'Kaidai_KD3_Class': 'Submarine - KD.3.jpg',
      'Kaidai_KD4_Class': 'Submarine - KD.4.jpg',
      'Kaidai_KD5_Class': 'Submarine - KD.5.jpg',
      'Kaidai_KD6_Class': 'Submarine - KD.6.jpg',
      'Kaidai_KD7_Class': 'Submarine - KD.7.jpg',
      'Kirai_Sen_Class': 'Submarine - Kirai-Sen.jpg',
      'Junsen_J_IM_Class': 'Submarine - Junsen J1M.jpg',
      'Junsen_J2_Class': 'Submarine - Junsen J2.jpg',
      'Junsen_J3_Class': 'Submarine - Junsen J3.jpg',
      'Type_A_Class': 'Submarine - Type A.jpg',
      'Type_B_Class': 'Submarine - Type B.jpg',
      'Type_B_3_Class': 'Submarine - Type B.3.jpg',
      'Type_C_Class': 'Submarine - Type C.jpg',
      'Type_A_Modified': 'Submarine - Type A(M).jpg',
      'Sen_Toku_Class': 'Submarine - Sen-Toku.jpg',
      'Sen_Taka_Class': 'Submarine - Sen-Taka.jpg',
      'Type_C3_Class': 'Submarine - Type C.3.jpg',
      'Type_A_Midget_Submarine___Ko_Hyoteki': 'Submarine - Midget.jpg'
    }, {
      get: function(target, prop) {
        if (typeof prop === 'string' && prop in target) return target[prop];
        if (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[prop] && SUB_DB.submarines[prop].chit_filename) {
          return SUB_DB.submarines[prop].chit_filename;
        }
        return 'Submarine - Type B.jpg';
      }
    });
    window.SUB_CHITS_MAP = SUB_CHITS_MAP;

    function updateWorkflowSubmarineSpecs() {
      const isEn = window.currentLang === 'en';
      const setT = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "--";
      };

      const selEl = document.getElementById('wf-sub-class-select');
      const activeKey = campaignState.activeSubKey || (selEl ? selEl.value : null);
      const specsBox = document.getElementById('wf-sub-specs-box');
      const torpBox = document.getElementById('wf-torpedo-doctrine-box');
      const emptyPrompt = document.getElementById('wf-sub-empty-prompt');
      const hullInput = document.getElementById('wf-sub-hull-number');

      if (!activeKey) {
        if (specsBox) specsBox.style.display = 'none';
        if (torpBox) torpBox.style.display = 'none';
        if (emptyPrompt) {
          emptyPrompt.style.display = 'block';
          const promptSpan = emptyPrompt.querySelector('span');
          if (promptSpan) {
            promptSpan.innerText = isEn
              ? "⚓ Select an Imperial submarine class above to view specifications and regulatory torpedo loadout."
              : "⚓ Selecciona una clase de submarino imperial arriba para ver sus especificaciones y dotación reglamentaria de torpedos.";
          }
        }
        if (hullInput && (!campaignState.workflow || !campaignState.workflow.hullNumber)) {
          hullInput.value = "";
          hullInput.placeholder = isEn ? "e.g. I-19" : "ej. I-19";
        }
        setT('wf-spec-class-name', isEn ? "-- Select Submarine --" : "-- Selecciona Submarino --");
        setT('wf-spec-entry-date', "--");
        setT('wf-spec-tubes', "--");
        setT('wf-spec-torp-load', "--");
        setT('wf-spec-aircraft', "--");
        setT('wf-spec-kaiten', "--");
        setT('wf-spec-deckgun', "--");
        setT('wf-spec-aa', "--");
        setT('wf-spec-hull', "--");
        setT('wf-spec-depth', "--");
        setT('wf-spec-radar', isEn ? "None" : "Ninguno");
        const chitImg = document.getElementById('wf-spec-sub-chit');
        if (chitImg) chitImg.style.display = 'none';
        return;
      }

      if (emptyPrompt) emptyPrompt.style.display = 'none';
      if (specsBox) specsBox.style.display = 'block';
      if (torpBox) torpBox.style.display = 'block';

      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[activeKey];
      if (!sub) return;

      // Update submarine counter chit
      const chitImg = document.getElementById('wf-spec-sub-chit');
      if (chitImg) {
        const fname = SUB_CHITS_MAP[activeKey] || 'Submarine - Type B.jpg';
        const rawSrc = `assets/chits/${fname}`;
        chitImg.src = (typeof resolveAsset === 'function') ? resolveAsset(rawSrc) : rawSrc;
        chitImg.alt = sub.class_name || 'Submarine Counter Chit';
        chitImg.style.display = 'block';
      }

      const chitLbl = document.getElementById('wf-spec-chit-label');
      if (chitLbl) {
        chitLbl.innerText = isEn ? "Compass Games Official Counter Chit" : "Ficha Oficial de Contadores Compass Games";
      }

      setT('wf-spec-class-name', sub.class_name || sub.full_title || activeKey);
      const availableDate = sub.available_date || (isEn ? 'Available Dec 1941' : 'Disponible Dic-41');
      setT('wf-spec-entry-date', isEn
        ? availableDate.replace(/^Disponible:\s*/i, 'Available: ')
        : availableDate.replace(/^Available:?\s*/i, 'Disponible: '));
      
      const tubesStrong = document.querySelector('strong[data-i18n="p0Tubes"]');
      if (tubesStrong) tubesStrong.innerText = isEn ? "Torpedo Tubes:" : "Tubos Torpedo:";
      const torpLoadStrong = document.querySelector('strong[data-i18n="p0TorpedoLoad"]');
      if (torpLoadStrong) torpLoadStrong.innerText = isEn ? "Torpedo Load:" : "Carga Torpedos:";
      const radarStrong = document.querySelector('strong[data-i18n="p0Radar"]');
      if (radarStrong) radarStrong.innerText = isEn ? "Radar:" : "Radar:";

      const tt = sub.torpedo_tubes || {};
      const bow = tt.fwd !== undefined ? tt.fwd : (tt.forward !== undefined ? tt.forward : (tt.bow !== undefined ? tt.bow : 6));
      const aft = tt.aft !== undefined ? tt.aft : (tt.stern !== undefined ? tt.stern : 0);
      setT('wf-spec-tubes', isEn ? `${bow} Bow / ${aft} Stern` : `${bow} Proa / ${aft} Popa`);
      
      const totalTubes = bow + aft;
      const reloadsFwd = tt.reloads_fwd !== undefined ? tt.reloads_fwd : 0;
      const reloadsAft = tt.reloads_aft !== undefined ? tt.reloads_aft : 0;
      const reloads = (sub.reload_capacity !== undefined) ? sub.reload_capacity : (reloadsFwd + reloadsAft);
      const totalCapacity = totalTubes + reloads;
      setT('wf-spec-torp-load', isEn ? `${totalCapacity} torpedoes (${totalTubes} tubes + ${reloads} reloads)` : `${totalCapacity} torpedos (${totalTubes} tubos + ${reloads} recargas)`);
      
      const plane = sub.has_aircraft ? (sub.aircraft_type || '1x Yokosuka E14Y Glen (Hangar)') : (isEn ? 'No floatplane' : 'Sin Hidroavión');
      setT('wf-spec-aircraft', plane);
      
      const kaiten = sub.has_kaiten ? (sub.kaiten_note || (isEn ? 'Up to 6 Kaiten (from late 1944)' : 'Hasta 6 Kaiten (desde finales 1944)')) : (isEn ? 'Not equipped' : 'No capacitado');
      setT('wf-spec-kaiten', kaiten);
      
      let dg = "1x 140mm L/40";
      if (sub.deck_guns) {
        if (typeof sub.deck_guns === 'string') dg = sub.deck_guns;
        else if (typeof sub.deck_guns === 'object') dg = (sub.deck_guns.main || '1x 140mm').replace(' Status', '');
      }
      setT('wf-spec-deckgun', dg);

      let aa = isEn ? "2x 25mm Type 96" : "2x 25mm Tipo 96";
      if (sub.deck_guns && typeof sub.deck_guns === 'object' && sub.deck_guns.aa) {
        aa = sub.deck_guns.aa.replace(' Status', '');
      }
      setT('wf-spec-aa', aa);

      let hullBoxes = 8;
      if (sub.damage_capacity) {
        if (typeof sub.damage_capacity === 'number') hullBoxes = sub.damage_capacity;
        else if (typeof sub.damage_capacity === 'object' && sub.damage_capacity.hull !== undefined) hullBoxes = sub.damage_capacity.hull;
      }
      setT('wf-spec-hull', isEn ? `${hullBoxes} Damage Boxes` : `${hullBoxes} Casillas de Daño`);
      setT('wf-spec-depth', isEn ? '100 meters (Test Depth)' : '100 metros (Profundidad Test)');

      // Radar status determination [Rules 8.1.7, 8.3 & Chart A3/A4]
      const radarInfo = checkSubmarineRadarStatus();
      const radarEl = document.getElementById('wf-spec-radar');
      if (radarEl) {
        if (radarInfo.isEquipped) {
          if (radarInfo.isOperational) {
            radarEl.innerHTML = `<span style="color:#4ade80; font-weight:700;">📡 ${radarInfo.radarModel} [${isEn ? 'Operational' : 'Operativo'}]</span>`;
          } else {
            radarEl.innerHTML = `<span style="color:#ef4444; font-weight:700;">📡 ${radarInfo.radarModel} [${isEn ? 'DAMAGED / INOP' : 'AVERIADO / INOP'}]</span>`;
          }
        } else {
          radarEl.innerHTML = `<span style="color:#94a3b8;">${isEn ? 'Not equipped' : 'No instalado'}</span>`;
        }
      }

      // Update dynamic torpedo loadout [Rule 4.5]
      updateTorpedoDoctrineDisplay();
    }

    function isKaidaiOrTypeB(subKey, sub) {
      const k = (subKey || '').toLowerCase();
      const name = (sub && sub.class_name ? sub.class_name : '').toLowerCase();
      return k.includes('kaidai') || k.includes('kd') || k.includes('type_b') || name.includes('kaidai') || name.includes('kd') || name.includes('type b');
    }

    function setTorpedoDoctrinePeriod(period) {
      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoPeriodOverride = period;
      updateTorpedoDoctrineDisplay();
    }

    function rollInitialTorpedoMix() {
      const roll = Math.floor(Math.random() * 6) + 1;
      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoRollInitial = roll;
      updateTorpedoDoctrineDisplay();
      const isEn = window.currentLang === 'en';
      showToast(isEn ? `Torpedo Loadout Roll: 1d6 = ${roll}` : `Tirada Carga Torpedos: 1d6 = ${roll}`);
    }

    function setInitialTorpedoMixPreset(val) {
      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoRollInitial = val;
      updateTorpedoDoctrineDisplay();
    }

    function getTorpedoArmamentConfig(subKey) {
      if (typeof getSubmarineArmamentConfig === 'function') {
        return getSubmarineArmamentConfig(subKey);
      }
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[subKey] || subs[Object.keys(subs)[0]];
      const tt = sub ? (sub.torpedo_tubes || {}) : {};
      const fwdTubes = tt.fwd !== undefined ? tt.fwd : (tt.forward || 6);
      const aftTubes = tt.aft !== undefined ? tt.aft : (tt.stern || 0);
      const fwdReloads = tt.reloads_fwd !== undefined ? tt.reloads_fwd : (sub ? (sub.reload_capacity || 0) : 8);
      const aftReloads = tt.reloads_aft !== undefined ? tt.reloads_aft : (aftTubes > 0 ? 2 : 0);
      return { fwdTubes, aftTubes, fwdReloads, aftReloads };
    }

    function getTorpedoBudgetAndTypes() {
      const isEn = (window.currentLang === 'en');
      const subKey = (campaignState && campaignState.activeSubKey) || 'Kaidai_KD3_Class';
      const cfg = getTorpedoArmamentConfig(subKey);
      const totalCapacity = cfg.fwdTubes + cfg.aftTubes + cfg.fwdReloads + cfg.aftReloads;

      const curMonth = (campaignState && campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
      let activePeriod = campaignState && campaignState.workflow && campaignState.workflow.torpedoPeriodOverride;
      if (!activePeriod) {
        activePeriod = (curMonth < "1942-07") ? 'pre' : 'post';
      }
      const isPre = (activePeriod === 'pre');
      const isKDorB = (typeof isKaidaiOrTypeB === 'function') ? isKaidaiOrTypeB(subKey) : (subKey.includes('KD') || subKey.includes('Type_B'));

      let specialType = 'type95';
      let baseType = 'type6';
      let specialLabel = isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
      let baseLabel = isEn ? 'Type 6 (Steam)' : 'Tipo 6 (Vapor)';
      let specialBudget = 0;
      let baseCount = 0;

      if (isPre) {
        if (isKDorB) {
          baseType = 'type6';
          baseLabel = isEn ? 'Type 6 (Steam)' : 'Tipo 6 (Vapor)';
          baseCount = Math.min(12, totalCapacity);
          specialBudget = Math.max(0, totalCapacity - baseCount);
          specialType = 'type95';
          specialLabel = isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
        } else {
          const rollVal = (campaignState && campaignState.workflow && campaignState.workflow.torpedoRollInitial) ? campaignState.workflow.torpedoRollInitial : 1;
          if (rollVal <= 3) {
            baseType = 'type89';
            baseLabel = isEn ? 'Type 89 (Steam)' : 'Tipo 89 (Vapor)';
            baseCount = Math.min(12, totalCapacity);
            specialBudget = Math.max(0, totalCapacity - baseCount);
            specialType = 'type95';
            specialLabel = isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
          } else {
            baseType = 'type95';
            baseLabel = isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
            baseCount = 0;
            specialBudget = totalCapacity;
            specialType = 'type95';
            specialLabel = isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
          }
        }
      } else {
        // >= July 1942
        const t92Count = (campaignState && campaignState.workflow && campaignState.workflow.torpedoType92Count !== undefined)
          ? campaignState.workflow.torpedoType92Count
          : 6;
        specialBudget = Math.min(t92Count, totalCapacity);
        baseCount = totalCapacity - specialBudget;
        specialType = 'type92';
        specialLabel = isEn ? 'Type 92 (Electric)' : 'Tipo 92 (Eléctrico)';
        baseType = 'type95';
        baseLabel = isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
      }

      return {
        isPre,
        isKDorB,
        specialType,
        baseType,
        specialLabel,
        baseLabel,
        specialBudget,
        baseCount,
        totalCapacity,
        cfg
      };
    }

    function getNormalizedTorpedoAllocation(budgetInfo) {
      if (!budgetInfo) budgetInfo = getTorpedoBudgetAndTypes();
      const { cfg, specialBudget } = budgetInfo;
      let alloc = (campaignState && campaignState.workflow && campaignState.workflow.torpedoAllocation) || null;

      if (!alloc || (alloc.fwdTubes === undefined && alloc.fwdT92 === undefined)) {
        let fwdT = Math.min(cfg.fwdTubes, specialBudget);
        let rem = specialBudget - fwdT;
        let aftT = Math.min(cfg.aftTubes, rem);
        rem -= aftT;
        let fwdR = Math.min(cfg.fwdReloads, rem);
        rem -= fwdR;
        let aftR = Math.min(cfg.aftReloads, rem);

        if (cfg.aftTubes > 0 && specialBudget >= 2) {
          aftT = Math.min(cfg.aftTubes, 2);
          fwdT = Math.min(cfg.fwdTubes, specialBudget - aftT);
          rem = specialBudget - fwdT - aftT;
          fwdR = Math.min(cfg.fwdReloads, rem);
          rem -= fwdR;
          aftR = Math.min(cfg.aftReloads, rem);
        }

        alloc = {
          fwdTubes: fwdT,
          aftTubes: aftT,
          fwdReloads: fwdR,
          aftReloads: aftR,
          fwdT92: fwdT + fwdR,
          aftT92: aftT + aftR
        };
      } else if (alloc.fwdTubes === undefined && alloc.fwdT92 !== undefined) {
        let fRem = Number(alloc.fwdT92) || 0;
        let fwdT = Math.min(cfg.fwdTubes, fRem);
        let fwdR = Math.min(cfg.fwdReloads, fRem - fwdT);
        let aRem = Number(alloc.aftT92) || 0;
        let aftT = Math.min(cfg.aftTubes, aRem);
        let aftR = Math.min(cfg.aftReloads, aRem - aftT);
        alloc = {
          fwdTubes: fwdT,
          aftTubes: aftT,
          fwdReloads: fwdR,
          aftReloads: aftR,
          fwdT92: fwdT + fwdR,
          aftT92: aftT + aftR
        };
      }

      alloc.fwdTubes = Math.max(0, Math.min(cfg.fwdTubes, Number(alloc.fwdTubes) || 0));
      alloc.aftTubes = Math.max(0, Math.min(cfg.aftTubes, Number(alloc.aftTubes) || 0));
      alloc.fwdReloads = Math.max(0, Math.min(cfg.fwdReloads, Number(alloc.fwdReloads) || 0));
      alloc.aftReloads = Math.max(0, Math.min(cfg.aftReloads, Number(alloc.aftReloads) || 0));

      let sum = alloc.fwdTubes + alloc.aftTubes + alloc.fwdReloads + alloc.aftReloads;
      if (sum > specialBudget) {
        let excess = sum - specialBudget;
        if (alloc.aftReloads > 0) {
          let s = Math.min(alloc.aftReloads, excess);
          alloc.aftReloads -= s;
          excess -= s;
        }
        if (excess > 0 && alloc.fwdReloads > 0) {
          let s = Math.min(alloc.fwdReloads, excess);
          alloc.fwdReloads -= s;
          excess -= s;
        }
        if (excess > 0 && alloc.aftTubes > 0) {
          let s = Math.min(alloc.aftTubes, excess);
          alloc.aftTubes -= s;
          excess -= s;
        }
        if (excess > 0 && alloc.fwdTubes > 0) {
          let s = Math.min(alloc.fwdTubes, excess);
          alloc.fwdTubes -= s;
          excess -= s;
        }
      }

      alloc.fwdT92 = alloc.fwdTubes + alloc.fwdReloads;
      alloc.aftT92 = alloc.aftTubes + alloc.aftReloads;

      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoAllocation = alloc;
      return alloc;
    }

    function onType92CountChange() {
      const sel = document.getElementById('wf-torp-type92-count');
      if (!sel) return;
      if (!campaignState.workflow) campaignState.workflow = {};
      const tCount = parseInt(sel.value, 10);
      campaignState.workflow.torpedoType92Count = tCount;

      setTorpedoAllocationPreset('balanced');
    }
    window.onType92CountChange = onType92CountChange;

    function setTorpedoAllocationPreset(preset) {
      const budgetInfo = getTorpedoBudgetAndTypes();
      const { cfg, specialBudget } = budgetInfo;

      let fwdT = 0, aftT = 0, fwdR = 0, aftR = 0;
      if (preset === 'standard') {
        fwdT = Math.min(cfg.fwdTubes, specialBudget);
        let rem = specialBudget - fwdT;
        aftT = Math.min(cfg.aftTubes, rem);
        rem -= aftT;
        fwdR = Math.min(cfg.fwdReloads, rem);
        rem -= fwdR;
        aftR = Math.min(cfg.aftReloads, rem);
      } else if (preset === 'balanced') {
        if (cfg.aftTubes > 0) {
          aftT = Math.min(cfg.aftTubes, Math.min(2, specialBudget));
          fwdT = Math.min(cfg.fwdTubes, specialBudget - aftT);
          let rem = specialBudget - fwdT - aftT;
          aftR = Math.min(cfg.aftReloads, Math.min(2, rem));
          rem -= aftR;
          fwdR = Math.min(cfg.fwdReloads, rem);
        } else {
          fwdT = Math.min(cfg.fwdTubes, specialBudget);
          fwdR = Math.min(cfg.fwdReloads, specialBudget - fwdT);
        }
      } else if (preset === 'all-fwd') {
        fwdT = Math.min(cfg.fwdTubes, specialBudget);
        fwdR = Math.min(cfg.fwdReloads, specialBudget - fwdT);
        aftT = 0;
        aftR = 0;
      } else if (preset === 'reloads') {
        fwdR = Math.min(cfg.fwdReloads, specialBudget);
        let rem = specialBudget - fwdR;
        aftR = Math.min(cfg.aftReloads, rem);
        rem -= aftR;
        fwdT = Math.min(cfg.fwdTubes, rem);
        rem -= fwdT;
        aftT = Math.min(cfg.aftTubes, rem);
      }

      const alloc = {
        fwdTubes: fwdT,
        aftTubes: aftT,
        fwdReloads: fwdR,
        aftReloads: aftR,
        fwdT92: fwdT + fwdR,
        aftT92: aftT + aftR
      };

      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoAllocation = alloc;

      if (typeof applyTorpedoAllocation === 'function') {
        applyTorpedoAllocation(alloc);
      }
      updateTorpedoDoctrineDisplay();
      if (typeof saveState === 'function') saveState();
    }
    window.setTorpedoAllocationPreset = setTorpedoAllocationPreset;

    function onTorpedoAllocationInputChange(changedField) {
      const budgetInfo = getTorpedoBudgetAndTypes();
      const { cfg, specialBudget } = budgetInfo;

      const inpFwdT = document.getElementById('wf-torp-alloc-fwd-tubes');
      const inpAftT = document.getElementById('wf-torp-alloc-aft-tubes');
      const inpFwdR = document.getElementById('wf-torp-alloc-fwd-reloads');
      const inpAftR = document.getElementById('wf-torp-alloc-aft-reloads');

      let fwdT = inpFwdT ? (parseInt(inpFwdT.value, 10) || 0) : 0;
      let aftT = inpAftT ? (parseInt(inpAftT.value, 10) || 0) : 0;
      let fwdR = inpFwdR ? (parseInt(inpFwdR.value, 10) || 0) : 0;
      let aftR = inpAftR ? (parseInt(inpAftR.value, 10) || 0) : 0;

      fwdT = Math.max(0, Math.min(cfg.fwdTubes, fwdT));
      aftT = Math.max(0, Math.min(cfg.aftTubes, aftT));
      fwdR = Math.max(0, Math.min(cfg.fwdReloads, fwdR));
      aftR = Math.max(0, Math.min(cfg.aftReloads, aftR));

      let sum = fwdT + aftT + fwdR + aftR;
      if (sum > specialBudget) {
        const diff = sum - specialBudget;
        if (changedField === 'fwdTubes') fwdT = Math.max(0, fwdT - diff);
        else if (changedField === 'aftTubes') aftT = Math.max(0, aftT - diff);
        else if (changedField === 'fwdReloads') fwdR = Math.max(0, fwdR - diff);
        else if (changedField === 'aftReloads') aftR = Math.max(0, aftR - diff);
        else fwdT = Math.max(0, fwdT - diff);
      }

      const alloc = {
        fwdTubes: fwdT,
        aftTubes: aftT,
        fwdReloads: fwdR,
        aftReloads: aftR,
        fwdT92: fwdT + fwdR,
        aftT92: aftT + aftR
      };

      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoAllocation = alloc;

      if (typeof applyTorpedoAllocation === 'function') {
        applyTorpedoAllocation(alloc);
      }
      updateTorpedoDoctrineDisplay();
      if (typeof saveState === 'function') saveState();
    }
    window.onTorpedoAllocationInputChange = onTorpedoAllocationInputChange;

    function stepTorpedoAllocation(field, delta) {
      const inpMap = {
        fwdTubes: 'wf-torp-alloc-fwd-tubes',
        aftTubes: 'wf-torp-alloc-aft-tubes',
        fwdReloads: 'wf-torp-alloc-fwd-reloads',
        aftReloads: 'wf-torp-alloc-aft-reloads'
      };
      const inp = document.getElementById(inpMap[field]);
      if (!inp) return;
      const currentVal = parseInt(inp.value, 10) || 0;
      inp.value = Math.max(0, currentVal + delta);
      onTorpedoAllocationInputChange(field);
    }
    window.stepTorpedoAllocation = stepTorpedoAllocation;

    function autoFillRemainingTorpedoes() {
      const budgetInfo = getTorpedoBudgetAndTypes();
      const { cfg, specialBudget } = budgetInfo;
      const alloc = getNormalizedTorpedoAllocation(budgetInfo);

      let currentSum = alloc.fwdTubes + alloc.aftTubes + alloc.fwdReloads + alloc.aftReloads;
      let remaining = specialBudget - currentSum;
      if (remaining <= 0) return;

      const fwdTSpace = cfg.fwdTubes - alloc.fwdTubes;
      const addFwdT = Math.min(fwdTSpace, remaining);
      alloc.fwdTubes += addFwdT;
      remaining -= addFwdT;

      if (remaining > 0) {
        const aftTSpace = cfg.aftTubes - alloc.aftTubes;
        const addAftT = Math.min(aftTSpace, remaining);
        alloc.aftTubes += addAftT;
        remaining -= addAftT;
      }

      if (remaining > 0) {
        const fwdRSpace = cfg.fwdReloads - alloc.fwdReloads;
        const addFwdR = Math.min(fwdRSpace, remaining);
        alloc.fwdReloads += addFwdR;
        remaining -= addFwdR;
      }

      if (remaining > 0) {
        const aftRSpace = cfg.aftReloads - alloc.aftReloads;
        const addAftR = Math.min(aftRSpace, remaining);
        alloc.aftReloads += addAftR;
        remaining -= addAftR;
      }

      alloc.fwdT92 = alloc.fwdTubes + alloc.fwdReloads;
      alloc.aftT92 = alloc.aftTubes + alloc.aftReloads;

      campaignState.workflow.torpedoAllocation = alloc;
      if (typeof applyTorpedoAllocation === 'function') {
        applyTorpedoAllocation(alloc);
      }
      updateTorpedoDoctrineDisplay();
      if (typeof saveState === 'function') saveState();
    }
    window.autoFillRemainingTorpedoes = autoFillRemainingTorpedoes;

    function syncTorpedoAllocationToSubBoard() {
      const budgetInfo = getTorpedoBudgetAndTypes();
      const alloc = getNormalizedTorpedoAllocation(budgetInfo);
      if (typeof applyTorpedoAllocation === 'function') {
        applyTorpedoAllocation(alloc);
      }
    }
    window.syncTorpedoAllocationToSubBoard = syncTorpedoAllocationToSubBoard;

    function updateTorpedoDoctrineDisplay() {
      const torpBox = document.getElementById('wf-torpedo-doctrine-box');
      if (!campaignState.activeSubKey) {
        if (torpBox) torpBox.style.display = 'none';
        return;
      }
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[campaignState.activeSubKey];
      if (!sub) {
        if (torpBox) torpBox.style.display = 'none';
        return;
      }
      if (torpBox) torpBox.style.display = 'block';
      const isEn = window.currentLang === 'en';

      const tt = sub.torpedo_tubes || {};
      const bow = tt.fwd !== undefined ? tt.fwd : (tt.forward !== undefined ? tt.forward : (tt.bow !== undefined ? tt.bow : 6));
      const aft = tt.aft !== undefined ? tt.aft : (tt.stern !== undefined ? tt.stern : 0);
      const totalTubes = bow + aft;
      const reloadsFwd = tt.reloads_fwd !== undefined ? tt.reloads_fwd : 0;
      const reloadsAft = tt.reloads_aft !== undefined ? tt.reloads_aft : 0;
      const reloads = (sub.reload_capacity !== undefined) ? sub.reload_capacity : (reloadsFwd + reloadsAft);
      const totalCapacity = totalTubes + reloads;
      const reloadBreakdown = reloadsAft > 0 
        ? (isEn ? ` [${reloadsFwd} Bow / ${reloadsAft} Stern]` : ` [${reloadsFwd} Proa / ${reloadsAft} Popa]`) 
        : "";

      const isKDorB = isKaidaiOrTypeB(campaignState.activeSubKey, sub);
      const curMonth = (campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
      
      // Determine active period
      let activePeriod = campaignState.workflow && campaignState.workflow.torpedoPeriodOverride;
      if (!activePeriod) {
        activePeriod = (curMonth < "1942-07") ? 'pre' : 'post';
      }
      const isPre = (activePeriod === 'pre');

      // Update period buttons
      const btnPre = document.getElementById('wf-torp-btn-pre42');
      const btnPost = document.getElementById('wf-torp-btn-post42');
      if (btnPre && btnPost) {
        if (isPre) {
          btnPre.style.borderColor = '#38bdf8';
          btnPre.style.color = '#38bdf8';
          btnPre.style.background = 'rgba(56, 189, 248, 0.15)';
          btnPost.style.borderColor = '#64748b';
          btnPost.style.color = '#94a3b8';
          btnPost.style.background = 'transparent';
        } else {
          btnPost.style.borderColor = '#38bdf8';
          btnPost.style.color = '#38bdf8';
          btnPost.style.background = 'rgba(56, 189, 248, 0.15)';
          btnPre.style.borderColor = '#64748b';
          btnPre.style.color = '#94a3b8';
          btnPre.style.background = 'transparent';
        }
      }

      // Rule Badge & Header Labels
      const titleEl = document.getElementById('wf-torp-title');
      if (titleEl) titleEl.innerText = isEn ? "🚀 Official Torpedo Loadout" : "🚀 Carga Reglamentaria de Torpedos";
      const ruleTagEl = document.getElementById('wf-torp-rule-tag');
      if (ruleTagEl) ruleTagEl.innerText = isEn ? "Rule 4.5" : "Regla 4.5";

      const badgeEl = document.getElementById('wf-torp-rule-badge');
      if (badgeEl) {
        if (isPre) {
          badgeEl.innerText = isKDorB 
            ? (isEn ? "Kaidai / Type B (< 7/42): Rule 4.5.3" : "Kaidai / Tipo B (< 7/42): Regla 4.5.3")
            : (isEn ? "Other Classes (< 7/42): Rule 4.5.4" : "Otras Clases (< 7/42): Regla 4.5.4");
          badgeEl.style.color = isKDorB ? '#fde047' : '#fbbf24';
        } else {
          badgeEl.innerText = isEn ? "All Classes (≥ 7/42): Rule 4.5.5" : "Todas las Clases (≥ 7/42): Regla 4.5.5";
          badgeEl.style.color = '#38bdf8';
        }
      }

      // Roller Labels & Buttons
      const rollerLabelEl = document.getElementById('wf-torp-roller-label');
      if (rollerLabelEl) rollerLabelEl.innerText = isEn ? "🎲 Initial Loadout Roll [Rule 4.5.4]:" : "🎲 Tirada de Dotación Inicial [Regla 4.5.4]:";
      const rollBtnEl = document.getElementById('wf-torp-roll-btn');
      if (rollBtnEl) rollBtnEl.innerText = isEn ? "🎲 Roll 1d6" : "🎲 Tirar 1d6";

      // Post-42 Controls (Rule 4.5.5)
      const t92LabelEl = document.getElementById('wf-torp-t92-label');
      if (t92LabelEl) t92LabelEl.innerText = isEn ? "⚡ Type 92 Electric Torpedoes [Rule 4.5.5]:" : "⚡ Torpedos Eléctricos Tipo 92 [Regla 4.5.5]:";
      const t92QtyLabelEl = document.getElementById('wf-torp-t92-qty-label');
      if (t92QtyLabelEl) t92QtyLabelEl.innerText = isEn ? "Quantity (0–6):" : "Cantidad (0–6):";

      const rollerEl = document.getElementById('wf-torp-other-roller');
      const postSelEl = document.getElementById('wf-torp-post42-selector');
      const summaryEl = document.getElementById('wf-torp-loadout-summary');

      let specLoadText = "";

      if (isPre) {
        if (postSelEl) postSelEl.style.display = 'none';

        if (isKDorB) {
          if (rollerEl) rollerEl.style.display = 'none';
          const type6 = Math.min(12, totalCapacity);
          const type95 = Math.max(0, totalCapacity - type6);
          specLoadText = isEn 
            ? `${totalCapacity} torp. (${type6}x Type 6 Steam + ${type95}x Type 95 Oxygen)` 
            : `${totalCapacity} torp. (${type6}x Tipo 6 Vapor + ${type95}x Tipo 95 Oxígeno)`;

          if (summaryEl) {
            summaryEl.innerHTML = isEn
              ? `<div style="margin-bottom:4px;"><strong>Total Torpedo Capacity:</strong> <span style="color:#fde047; font-weight:bold;">${totalCapacity} torpedoes</span> (${totalTubes} in tubes [${bow} Bow / ${aft} Stern] + ${reloads} reloads${reloadBreakdown}).</div>
                 <div style="background:rgba(239, 68, 68, 0.12); border-left:3px solid #ef4444; padding:6px 8px; border-radius:4px; margin-bottom:4px;">
                   <strong style="color:#f87171;">🔴 Mandatory Pre-7/42 Loadout:</strong> 
                   <span style="color:#fff; font-weight:bold;">${type6} x Type 6 (Steam)</span> + <span style="color:#38bdf8; font-weight:bold;">${type95} x Type 95 (Oxygen)</span>.
                 </div>
                 <div style="font-size:0.77rem; color:#94a3b8;">
                   <strong>Historical/Tactical rule:</strong> Older pre-war stocks of Type 6 steam torpedoes must be expended first. They leave a visible white wake of bubbles (+1 to enemy escort detection during day). <em>Stowage tip [4.5.6/7]:</em> Place the superior Type 95 oxygen torpedoes in forward/aft tubes ready to fire, with Type 6 steam in reload racks.
                 </div>`
              : `<div style="margin-bottom:4px;"><strong>Capacidad Total de Torpedos:</strong> <span style="color:#fde047; font-weight:bold;">${totalCapacity} torpedos</span> (${totalTubes} en tubos [${bow} Proa / ${aft} Popa] + ${reloads} en pañoles de recarga${reloadBreakdown}).</div>
                 <div style="background:rgba(239, 68, 68, 0.12); border-left:3px solid #ef4444; padding:6px 8px; border-radius:4px; margin-bottom:4px;">
                   <strong style="color:#f87171;">🔴 Carga Obligatoria antes de Julio 1942:</strong> 
                   <span style="color:#fff; font-weight:bold;">${type6} x Tipo 6 (Vapor)</span> + <span style="color:#38bdf8; font-weight:bold;">${type95} x Tipo 95 (Oxígeno)</span>.
                 </div>
                 <div style="font-size:0.77rem; color:#94a3b8;">
                   <strong>Reglamento y Doctrina:</strong> Deben consumirse las reservas de preguerra de torpedos de vapor Tipo 6. Dejan estela visible de burbujas (+1 a detección de escoltas de día). <em>Consejo de estiba [4.5.6/7]:</em> Cargar los mejores torpedos Tipo 95 en los tubos listos para disparar, y los Tipo 6 en la recarga.
                 </div>`;
          }
        } else {
          // Other classes before 7/42: roll 1d6
          if (rollerEl) rollerEl.style.display = 'block';
          const rollVal = (campaignState.workflow && campaignState.workflow.torpedoRollInitial) ? campaignState.workflow.torpedoRollInitial : 1;
          const isRollSteam = (rollVal <= 3);
          const type89 = isRollSteam ? Math.min(12, totalCapacity) : 0;
          const type95 = totalCapacity - type89;

          const rollResEl = document.getElementById('wf-torp-roll-result');
          if (rollResEl) {
            rollResEl.innerHTML = isEn
              ? `Current 1d6 Roll: <strong style="color:#fde047; font-size:0.92rem;">${rollVal}</strong> ➔ ` +
                (isRollSteam 
                  ? `<span style="color:#f87171; font-weight:bold;">(Roll 1–3) Loads ${type89}x Type 89 (Steam) + ${type95}x Type 95 (Oxygen)</span>` 
                  : `<span style="color:#4ade80; font-weight:bold;">(Roll 4–6) Loads 100% Type 95 Oxygen (${totalCapacity}x Type 95)</span>`)
              : `Tirada actual 1d6: <strong style="color:#fde047; font-size:0.92rem;">${rollVal}</strong> ➔ ` +
                (isRollSteam 
                  ? `<span style="color:#f87171; font-weight:bold;">(Tirada 1–3) Carga ${type89}x Tipo 89 (Vapor) + ${type95}x Tipo 95 (Oxígeno)</span>` 
                  : `<span style="color:#4ade80; font-weight:bold;">(Tirada 4–6) Carga 100% Tipo 95 Oxígeno (${totalCapacity}x Tipo 95)</span>`);
          }

          specLoadText = isRollSteam
            ? (isEn ? `${totalCapacity} torp. (${type89}x Type 89 Steam + ${type95}x Type 95 Oxygen)` : `${totalCapacity} torp. (${type89}x Tipo 89 Vapor + ${type95}x Tipo 95 Oxígeno)`)
            : (isEn ? `${totalCapacity} torp. (100% Type 95 Oxygen)` : `${totalCapacity} torp. (100% Tipo 95 Oxígeno)`);

          if (summaryEl) {
            summaryEl.innerHTML = isEn
              ? `<div style="margin-bottom:4px;"><strong>Total Torpedo Capacity:</strong> <span style="color:#fde047; font-weight:bold;">${totalCapacity} torpedoes</span> (${totalTubes} tubes [${bow} Bow / ${aft} Stern] + ${reloads} reloads${reloadBreakdown}).</div>
                 <div style="background:rgba(245, 158, 11, 0.12); border-left:3px solid #f59e0b; padding:6px 8px; border-radius:4px; margin-bottom:4px;">
                   <strong style="color:#fbbf24;">🎲 Rule 4.5.4 Initial Mix (Roll 1d6):</strong> ` +
                   (isRollSteam
                     ? `<span style="color:#fff; font-weight:bold;">${type89} x Type 89 (Steam)</span> + <span style="color:#38bdf8; font-weight:bold;">${type95} x Type 95 (Oxygen)</span>.`
                     : `<span style="color:#4ade80; font-weight:bold;">100% Type 95 Oxygen (${totalCapacity} torpedoes)</span>.`) +
                 `</div>
                 <div style="font-size:0.77rem; color:#94a3b8;">
                   Classes other than Kaidai and Type B roll 1d6 prior to July 1942. On 1–3, stocks of older Type 89 steam torpedoes are loaded (12x). On 4–6, a full load of Type 95 oxygen torpedoes is granted.
                 </div>`
              : `<div style="margin-bottom:4px;"><strong>Capacidad Total de Torpedos:</strong> <span style="color:#fde047; font-weight:bold;">${totalCapacity} torpedos</span> (${totalTubes} tubos [${bow} Proa / ${aft} Popa] + ${reloads} en recarga${reloadBreakdown}).</div>
                 <div style="background:rgba(245, 158, 11, 0.12); border-left:3px solid #f59e0b; padding:6px 8px; border-radius:4px; margin-bottom:4px;">
                   <strong style="color:#fbbf24;">🎲 Regla 4.5.4 Carga Inicial (Tirada 1d6):</strong> ` +
                   (isRollSteam
                     ? `<span style="color:#fff; font-weight:bold;">${type89} x Tipo 89 (Vapor)</span> + <span style="color:#38bdf8; font-weight:bold;">${type95} x Tipo 95 (Oxígeno)</span>.`
                     : `<span style="color:#4ade80; font-weight:bold;">100% Tipo 95 Oxígeno (${totalCapacity} torpedos)</span>.`) +
                 `</div>
                 <div style="font-size:0.77rem; color:#94a3b8;">
                   Las clases distintas a Kaidai y Tipo B tiran 1d6 antes de 7/42. Con 1–3 se cargan 12 torpedos de vapor Tipo 89. Con 4–6 se carga dotación completa de Tipo 95 de oxígeno.
                 </div>`;
          }
        }
      } else {
        // >= July 1942: Type 92 Electrics available for all classes
        if (rollerEl) rollerEl.style.display = 'none';
        if (postSelEl) postSelEl.style.display = 'block';

        const t92Count = (campaignState.workflow && campaignState.workflow.torpedoType92Count !== undefined) 
          ? campaignState.workflow.torpedoType92Count 
          : 6;
        const selEl = document.getElementById('wf-torp-type92-count');
        if (selEl) {
          selEl.innerHTML = `
            <option value="0">${isEn ? '0 (Type 95 Only)' : '0 (Solo Tipo 95)'}</option>
            <option value="1">1x ${isEn ? 'Type 92' : 'Tipo 92'}</option>
            <option value="2">2x ${isEn ? 'Type 92' : 'Tipo 92'}</option>
            <option value="3">3x ${isEn ? 'Type 92' : 'Tipo 92'}</option>
            <option value="4">4x ${isEn ? 'Type 92' : 'Tipo 92'}</option>
            <option value="5">5x ${isEn ? 'Type 92' : 'Tipo 92'}</option>
            <option value="6">${isEn ? '6x Type 92 (Recommended)' : '6x Tipo 92 (Recomendado)'}</option>
          `;
          selEl.value = String(t92Count);
        }

        const type92 = Math.min(t92Count, totalCapacity);
        const type95 = totalCapacity - type92;

        specLoadText = isEn
          ? `${totalCapacity} torp. (${type92}x Type 92 Electric + ${type95}x Type 95 Oxygen)`
          : `${totalCapacity} torp. (${type92}x Tipo 92 Eléctrico + ${type95}x Tipo 95 Oxígeno)`;

        if (summaryEl) {
          summaryEl.innerHTML = isEn
            ? `<div style="margin-bottom:4px;"><strong>Total Torpedo Capacity:</strong> <span style="color:#fde047; font-weight:bold;">${totalCapacity} torpedoes</span> (${totalTubes} in tubes [${bow} Bow / ${aft} Stern] + ${reloads} reloads${reloadBreakdown}).</div>
               <div style="background:rgba(2, 132, 199, 0.15); border-left:3px solid #0284c7; padding:6px 8px; border-radius:4px; margin-bottom:4px;">
                 <strong style="color:#38bdf8;">⚡ Wartime Composition (from July 1942):</strong> 
                 <span style="color:#7dd3fc; font-weight:bold;">${type92} x Type 92 (Electric)</span> + <span style="color:#4ade80; font-weight:bold;">${type95} x Type 95 (Oxygen)</span>.
               </div>
               <div style="font-size:0.77rem; color:#94a3b8;">
                 From 7/42 onwards, stocks of steam torpedoes are expended. Up to 6 electric Type 92 torpedoes may be chosen by the player. Electric torpedoes leave zero bubble wake, greatly reducing daytime detection by escorts.
               </div>`
            : `<div style="margin-bottom:4px;"><strong>Capacidad Total de Torpedos:</strong> <span style="color:#fde047; font-weight:bold;">${totalCapacity} torpedos</span> (${totalTubes} en tubos [${bow} Proa / ${aft} Popa] + ${reloads} en recarga${reloadBreakdown}).</div>
               <div style="background:rgba(2, 132, 199, 0.15); border-left:3px solid #0284c7; padding:6px 8px; border-radius:4px; margin-bottom:4px;">
                 <strong style="color:#38bdf8;">⚡ Composición Operacional (desde Julio 1942):</strong> 
                 <span style="color:#7dd3fc; font-weight:bold;">${type92} x Tipo 92 (Eléctrico)</span> + <span style="color:#4ade80; font-weight:bold;">${type95} x Tipo 95 (Oxígeno)</span>.
               </div>
               <div style="font-size:0.77rem; color:#94a3b8;">
                 A partir de julio de 1942 se agotan los torpedos de vapor. El jugador puede elegir hasta 6 torpedos eléctricos Tipo 92. Al no dejar estela de burbujas, reducen drásticamente la probabilidad de contragolpe de escoltas de día.
               </div>`;
        }
      }

      // Unified 4-Compartment Allocation Panel Update (Pre-42 and Post-42)
      const allocPanel = document.getElementById('wf-torp-allocation-panel');
      if (allocPanel) {
        allocPanel.style.display = 'block';

        const budgetInfo = getTorpedoBudgetAndTypes();
        const { specialType, baseType, specialLabel, baseLabel, specialBudget, baseCount, cfg } = budgetInfo;
        const bannerBaseLabel = baseType === 'type6' ? (isEn ? 'Type 6' : 'Tipo 6')
          : baseType === 'type89' ? (isEn ? 'Type 89' : 'Tipo 89')
          : baseType === 'type92' ? (isEn ? 'Type 92' : 'Tipo 92')
          : (isEn ? 'Type 95' : 'Tipo 95');
        const alloc = getNormalizedTorpedoAllocation(budgetInfo);

        const assignedCount = alloc.fwdTubes + alloc.aftTubes + alloc.fwdReloads + alloc.aftReloads;
        const remainingCount = Math.max(0, specialBudget - assignedCount);

        // Budget Banner
        const bannerCapEl = document.getElementById('wf-torp-banner-total-cap');
        if (bannerCapEl) bannerCapEl.textContent = `${totalCapacity} ${isEn ? "Torpedoes LOADED" : "Torpedos CARGADOS"}`;

        const baseSummaryEl = document.getElementById('wf-torp-banner-base-summary');
        const baseCountEl = document.getElementById('wf-torp-banner-base-count');
        if (baseCountEl) baseCountEl.textContent = `${baseCount}x ${bannerBaseLabel}`;
        if (baseSummaryEl) baseSummaryEl.innerHTML = `${isEn ? "Remaining filled with" : "Resto"}: <strong id="wf-torp-banner-base-count" style="color:#cbd5e1;">${baseCount}x ${bannerBaseLabel}</strong>`;

        const nameEl = document.getElementById('wf-torp-budget-name');
        if (nameEl) nameEl.textContent = specialLabel;
        const totalEl = document.getElementById('wf-torp-budget-total');
        if (totalEl) totalEl.textContent = specialBudget;
        const assignedEl = document.getElementById('wf-torp-budget-assigned');
        if (assignedEl) assignedEl.textContent = assignedCount;
        const remEl = document.getElementById('wf-torp-budget-remaining');
        if (remEl) {
          remEl.textContent = remainingCount;
          remEl.style.color = (remainingCount === 0) ? '#4ade80' : '#f59e0b';
        }

        const statusEl = document.getElementById('wf-torp-budget-status');
        const autofillBtn = document.getElementById('wf-torp-autofill-btn');
        if (statusEl) {
          if (remainingCount === 0) {
            statusEl.innerHTML = `<span style="color:#4ade80;">✓ ${totalCapacity}/${totalCapacity} ${isEn ? "Loaded" : "Cargados"}</span>`;
            if (autofillBtn) autofillBtn.style.display = 'none';
          } else {
            statusEl.innerHTML = `<span style="color:#f59e0b;">⚠️ ${isEn ? `Remaining: ${remainingCount}` : `Faltan: ${remainingCount}`}</span>`;
            if (autofillBtn) autofillBtn.style.display = 'inline-block';
          }
        }

        const specShort = (specialType === 'type95') ? 'T95' : 'T92';
        const baseShort = (baseType === 'type6') ? 'T6' : ((baseType === 'type89') ? 'T89' : 'T95');

        // 1. Bow Tubes
        const inpFwdT = document.getElementById('wf-torp-alloc-fwd-tubes');
        const capFwdT = document.getElementById('wf-torp-cap-fwd-tubes');
        const descFwdT = document.getElementById('wf-torp-desc-fwd-tubes');
        if (inpFwdT) {
          inpFwdT.value = alloc.fwdTubes;
          inpFwdT.max = cfg.fwdTubes;
          inpFwdT.disabled = (cfg.fwdTubes === 0);
        }
        if (capFwdT) capFwdT.innerHTML = `<span style="color:#4ade80; font-weight:bold;">${cfg.fwdTubes}/${cfg.fwdTubes} ${isEn ? "Loaded ✓" : "Cargados ✓"}</span>`;
        if (descFwdT) {
          const baseFwdT = Math.max(0, cfg.fwdTubes - alloc.fwdTubes);
          descFwdT.innerHTML = `<span style="color:#38bdf8; font-weight:bold;">${alloc.fwdTubes}x ${specShort}</span> + <span style="color:#cbd5e1; font-weight:bold;">${baseFwdT}x ${baseShort}</span>`;
        }

        // 2. Stern Tubes
        const inpAftT = document.getElementById('wf-torp-alloc-aft-tubes');
        const capAftT = document.getElementById('wf-torp-cap-aft-tubes');
        const descAftT = document.getElementById('wf-torp-desc-aft-tubes');
        const cardAftT = document.getElementById('wf-torp-card-aft-tubes');
        const btnMinusAftT = document.getElementById('wf-torp-btn-minus-aft-tubes');
        const btnPlusAftT = document.getElementById('wf-torp-btn-plus-aft-tubes');
        if (cfg.aftTubes === 0) {
          if (inpAftT) { inpAftT.value = 0; inpAftT.disabled = true; }
          if (capAftT) capAftT.textContent = isEn ? "(No Aft Tubes)" : "(Sin tubos)";
          if (descAftT) descAftT.textContent = "--";
          if (cardAftT) cardAftT.style.opacity = '0.45';
          if (btnMinusAftT) btnMinusAftT.disabled = true;
          if (btnPlusAftT) btnPlusAftT.disabled = true;
        } else {
          if (cardAftT) cardAftT.style.opacity = '1';
          if (btnMinusAftT) btnMinusAftT.disabled = false;
          if (btnPlusAftT) btnPlusAftT.disabled = false;
          if (inpAftT) {
            inpAftT.value = alloc.aftTubes;
            inpAftT.max = cfg.aftTubes;
            inpAftT.disabled = false;
          }
          if (capAftT) capAftT.innerHTML = `<span style="color:#4ade80; font-weight:bold;">${cfg.aftTubes}/${cfg.aftTubes} ${isEn ? "Loaded ✓" : "Cargados ✓"}</span>`;
          if (descAftT) {
            const baseAftT = Math.max(0, cfg.aftTubes - alloc.aftTubes);
            descAftT.innerHTML = `<span style="color:#f87171; font-weight:bold;">${alloc.aftTubes}x ${specShort}</span> + <span style="color:#cbd5e1; font-weight:bold;">${baseAftT}x ${baseShort}</span>`;
          }
        }

        // 3. Bow Reloads
        const inpFwdR = document.getElementById('wf-torp-alloc-fwd-reloads');
        const capFwdR = document.getElementById('wf-torp-cap-fwd-reloads');
        const descFwdR = document.getElementById('wf-torp-desc-fwd-reloads');
        const cardFwdR = document.getElementById('wf-torp-card-fwd-reloads');
        const btnMinusFwdR = document.getElementById('wf-torp-btn-minus-fwd-reloads');
        const btnPlusFwdR = document.getElementById('wf-torp-btn-plus-fwd-reloads');
        if (cfg.fwdReloads === 0) {
          if (inpFwdR) { inpFwdR.value = 0; inpFwdR.disabled = true; }
          if (capFwdR) capFwdR.textContent = isEn ? "(No Reloads)" : "(Sin recargas)";
          if (descFwdR) descFwdR.textContent = "--";
          if (cardFwdR) cardFwdR.style.opacity = '0.45';
          if (btnMinusFwdR) btnMinusFwdR.disabled = true;
          if (btnPlusFwdR) btnPlusFwdR.disabled = true;
        } else {
          if (cardFwdR) cardFwdR.style.opacity = '1';
          if (btnMinusFwdR) btnMinusFwdR.disabled = false;
          if (btnPlusFwdR) btnPlusFwdR.disabled = false;
          if (inpFwdR) {
            inpFwdR.value = alloc.fwdReloads;
            inpFwdR.max = cfg.fwdReloads;
            inpFwdR.disabled = false;
          }
          if (capFwdR) capFwdR.innerHTML = `<span style="color:#4ade80; font-weight:bold;">${cfg.fwdReloads}/${cfg.fwdReloads} ${isEn ? "Loaded ✓" : "Cargadas ✓"}</span>`;
          if (descFwdR) {
            const baseFwdR = Math.max(0, cfg.fwdReloads - alloc.fwdReloads);
            descFwdR.innerHTML = `<span style="color:#38bdf8; font-weight:bold;">${alloc.fwdReloads}x ${specShort}</span> + <span style="color:#cbd5e1; font-weight:bold;">${baseFwdR}x ${baseShort}</span>`;
          }
        }

        // 4. Stern Reloads
        const inpAftR = document.getElementById('wf-torp-alloc-aft-reloads');
        const capAftR = document.getElementById('wf-torp-cap-aft-reloads');
        const descAftR = document.getElementById('wf-torp-desc-aft-reloads');
        const cardAftR = document.getElementById('wf-torp-card-aft-reloads');
        const btnMinusAftR = document.getElementById('wf-torp-btn-minus-aft-reloads');
        const btnPlusAftR = document.getElementById('wf-torp-btn-plus-aft-reloads');
        if (cfg.aftReloads === 0) {
          if (inpAftR) { inpAftR.value = 0; inpAftR.disabled = true; }
          if (capAftR) capAftR.textContent = isEn ? "(No Reloads)" : "(Sin recargas)";
          if (descAftR) descAftR.textContent = "--";
          if (cardAftR) cardAftR.style.opacity = '0.45';
          if (btnMinusAftR) btnMinusAftR.disabled = true;
          if (btnPlusAftR) btnPlusAftR.disabled = true;
        } else {
          if (cardAftR) cardAftR.style.opacity = '1';
          if (btnMinusAftR) btnMinusAftR.disabled = false;
          if (btnPlusAftR) btnPlusAftR.disabled = false;
          if (inpAftR) {
            inpAftR.value = alloc.aftReloads;
            inpAftR.max = cfg.aftReloads;
            inpAftR.disabled = false;
          }
          if (capAftR) capAftR.innerHTML = `<span style="color:#4ade80; font-weight:bold;">${cfg.aftReloads}/${cfg.aftReloads} ${isEn ? "Loaded ✓" : "Cargadas ✓"}</span>`;
          if (descAftR) {
            const baseAftR = Math.max(0, cfg.aftReloads - alloc.aftReloads);
            descAftR.innerHTML = `<span style="color:#f87171; font-weight:bold;">${alloc.aftReloads}x ${specShort}</span> + <span style="color:#cbd5e1; font-weight:bold;">${baseAftR}x ${baseShort}</span>`;
          }
        }
      }

      // Update spec load line in #wf-sub-specs-box
      const specLoadEl = document.getElementById('wf-spec-torp-load');
      if (specLoadEl && specLoadText) {
        specLoadEl.innerHTML = `<span style="color:#a7f3d0; font-weight:bold;">${specLoadText}</span>`;
      }

      // Special notes: Ko-Hyoteki, Kaiten, Mines & Transport
      const notesEl = document.getElementById('wf-torp-special-notes');
      if (notesEl) {
        let notesHtml = [];
        const isTypeC = (sub && sub.has_midget_carrier) || (campaignState.activeSubKey === 'Type_C_Class');
        const isMidget = (sub && sub.is_midget_sub) || (campaignState.activeSubKey === 'Type_A_Midget_Submarine___Ko_Hyoteki');
        const isMinelayer = (sub && sub.has_mines) || (campaignState.activeSubKey === 'Kirai_Sen_Class');
        if (isTypeC) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Carries 1 Type A Midget on aft deck armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Transporta 1 minisubmarino Tipo A en cubierta de popa armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        } else if (isMidget) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        }
        if (sub && sub.has_kaiten) {
          notesHtml.push(isEn
            ? `<div>⚡ <strong>Manned Kaiten Suicide Torpedoes [4.8.4 & 7.18]:</strong> Carries 4–6 Type 1 Kaiten on deck clamps on Kaiten Special Missions (late 1944+).</div>`
            : `<div>⚡ <strong>Torpedos Suicidas Tripulados Kaiten [4.8.4 & 7.18]:</strong> Transporta de 4 a 6 Kaiten Tipo 1 en soportes de cubierta en Misiones Kaiten (1944+).</div>`);
        }
        if (isMinelayer) {
          const mineCount = (sub && sub.mine_capacity) || 42;
          notesHtml.push(isEn
            ? `<div>💣 <strong>Minelaying Missions [4.5.8 & 7.10]:</strong> Dedicated minelayer carrying ${mineCount} naval mines in aft internal tubes (Chart E6 aft torpedo damage applies to mine doors). 4 bow torpedo tubes + 8 reloads carry standard torpedoes.</div>`
            : `<div>💣 <strong>Misiones de Minado [4.5.8 & 7.10]:</strong> Minador especializado que transporta ${mineCount} minas navales en tubos internos de popa (las averías de torpedos de popa en E6 van a compuertas de minas). Los 4 tubos de proa + 8 recargas llevan torpedos estándar.</div>`);
        } else if (!isMidget) {
          notesHtml.push(isEn
            ? `<div>⚠️ <strong>Special Missions [4.5.8]:</strong> <em>Mine-laying [7.10]:</em> Mines loaded in tubes reduce initial torpedo load by tube count. <em>Transport/Evacuation [7.4/7.6]:</em> Tubes loaded, but carries <strong>0 reloads</strong> (stowage used for cargo/passengers).</div>`
            : `<div>⚠️ <strong>Misiones Especiales [4.5.8]:</strong> <em>Minado [7.10]:</em> Minas en tubos reducen la carga inicial de torpedos. <em>Transporte/Evacuación [7.4/7.6]:</em> Tubos armados, pero lleva <strong>0 recargas</strong> (bodega usada para suministros o evacuados).</div>`);
        }
        
        notesEl.innerHTML = notesHtml.join('');
      }

      // Tactical Guide Summary & Body
      const guideSummaryEl = document.getElementById('wf-torp-guide-summary');
      if (guideSummaryEl) {
        guideSummaryEl.innerText = isEn 
          ? "📖 Rulebook Tactical Guide: IJN 5 Torpedo Types Comparison" 
          : "📖 Guía Táctica del Manual: Comparativa de los 5 Torpedos IJN";
      }
      const guideBodyEl = document.getElementById('wf-torp-guide-body');
      if (guideBodyEl) {
        guideBodyEl.innerHTML = isEn
          ? `<div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #22c55e; border-radius:4px;">
               <strong style="color:#4ade80;">Type 95 (Pure Oxygen, 21" / 533mm):</strong> Submarine version of the "Long Lance". Maximum speed and devastating lethality (+1 damage / B1), minimal bubble wake.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #f97316; border-radius:4px;">
               <strong style="color:#fb923c;">Type 6 (Steam / 6th Year, 21" / 533mm):</strong> Older prewar model. Leaves visible white steam/bubble wake, facilitating daylight detection by escort destroyers (+1 escort detection). Mandatory 12 on Kaidai/Type B until 7/42.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #f59e0b; border-radius:4px;">
               <strong style="color:#fcd34d;">Type 89 (Steam, 21" / 533mm):</strong> Prewar steam standard. Same performance as Type 6 with visible bubble wake. On other classes until 7/42 based on 1d6 roll.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #38bdf8; border-radius:4px;">
               <strong style="color:#38bdf8;">Type 92 (Electric, 21" / 533mm, avail. 7/42):</strong> Slower at long range, but <strong>leaves NO bubble wake</strong>. Drastically reduces daylight escort counterattack detection. Up to 6 may be loaded per patrol.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #a855f7; border-radius:4px;">
               <strong style="color:#c084fc;">Type 97 (18" / 450mm):</strong> Compact torpedo exclusive to <em>Ko-Hyoteki</em> midget submarines (2 in bow, no reloads).
             </div>`
          : `<div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #22c55e; border-radius:4px;">
               <strong style="color:#4ade80;">Tipo 95 (Oxígeno puro, 21" / 533mm):</strong> Versión submarina del "Long Lance". Máxima velocidad y letalidad devastadora (+1 daño / B1), estela de burbujas mínima.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #f97316; border-radius:4px;">
               <strong style="color:#fb923c;">Tipo 6 (Vapor / 6th Year, 21" / 533mm):</strong> Modelo antiguo preguerra. Deja estela blanca visible de vapor y burbujas, facilitando la detección diurna por destructores (+1 detección escoltas). Obligatorio 12 en Kaidai/Tipo B hasta 7/42.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #f59e0b; border-radius:4px;">
               <strong style="color:#fcd34d;">Tipo 89 (Vapor, 21" / 533mm):</strong> Estándar preguerra a vapor. Mismo rendimiento que Tipo 6 con estela visible de burbujas. En otras clases hasta 7/42 según tirada 1d6.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #38bdf8; border-radius:4px;">
               <strong style="color:#38bdf8;">Tipo 92 (Eléctrico, 21" / 533mm, disp. 7/42):</strong> Más lento a larga distancia, pero <strong>no deja ninguna estela de burbujas</strong>. Reduce drásticamente la detección por escoltas de día. Se pueden cargar hasta 6 por patrulla.
             </div>
             <div style="padding:4px 6px; background:rgba(30,41,59,0.5); border-left:3px solid #a855f7; border-radius:4px;">
               <strong style="color:#c084fc;">Tipo 97 (18" / 450mm):</strong> Torpedo compacto exclusivo para minisubmarinos <em>Ko-Hyoteki</em> (2 en proa, sin recargas).
             </div>`;
      }
    }

    function commissionSubmarineAndProceed() {
      if (!campaignState.activeSubKey) {
        const isEn = window.currentLang === 'en';
        showToast(isEn ? "Please select a submarine class before commissioning." : "Por favor, selecciona una clase de submarino antes de comisionar.");
        return;
      }
      const hull = document.getElementById('wf-sub-hull-number').value || "I-19";
      const cmdr = document.getElementById('wf-commander-name').value || "Hashimoto Mochitsura";
      const rank = document.getElementById('wf-commander-rank').value || "Lt Cdr";
      const base = normalizeBaseName(document.getElementById('wf-starting-base').value || "Yokosuka");

      campaignState.workflow.hullNumber = hull;
      campaignState.workflow.commanderName = cmdr;
      campaignState.workflow.commanderRank = rank;
      campaignState.workflow.startingBase = base;

      // Update Chart K1 rank display
      const k1RankEl = document.getElementById('k1-rank-badge');
      if (k1RankEl) k1RankEl.innerText = rank;

      if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
      if (typeof renderSubBoard === 'function') renderSubBoard();

      showToast(`¡Submarino ${hull} comisionado al mando de ${rank} ${cmdr}! Procediendo a Escuela Naval.`);
      setWorkflowPhase('school');
      saveState();
    }

    function buildWorkflowSubClassSelect() {
      const select = document.getElementById('wf-sub-class-select');
      if (!select) return;
      
      const isEn = window.currentLang === 'en';
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const keys = Object.keys(subs);
      const targetSub = campaignState.activeSubKey || (typeof currentBoardSubKey !== 'undefined' ? currentBoardSubKey : null);

      select.innerHTML = `<option value="">${isEn ? "-- Select Submarine --" : "-- Selecciona Submarino --"}</option>`;
      
      const officialGroup = document.createElement('optgroup');
      officialGroup.label = isEn ? "⚓ Official Submarines (Compass Games)" : "⚓ Submarinos Oficiales (Compass Games)";
      
      const fanmadeGroup = document.createElement('optgroup');
      fanmadeGroup.label = isEn ? "⭐ Real Historical Variants [Fanmade]" : "⭐ Variantes Históricas Reales [Fanmade]";

      keys.forEach((k) => {
        const sub = subs[k];
        const dateMatch = sub.available_date || '1941';
        const isFan = !!sub.is_fanmade;
        const option = document.createElement('option');
        option.value = k;
        option.textContent = isFan 
          ? `${sub.class_name || k} [Fanmade] (${dateMatch})`
          : `${sub.class_name || k} (${dateMatch})`;
        
        if (isFan) {
          option.style.color = '#fbbf24';
          fanmadeGroup.appendChild(option);
        } else {
          officialGroup.appendChild(option);
        }

        if (k === targetSub) option.selected = true;
      });

      if (officialGroup.children.length > 0) select.appendChild(officialGroup);
      if (fanmadeGroup.children.length > 0) select.appendChild(fanmadeGroup);

      if (targetSub) {
        select.value = targetSub;
        const hullInput = document.getElementById('wf-sub-hull-number');
        if (hullInput && (!hullInput.value || (campaignState.workflow && !campaignState.workflow.hullNumber))) {
          const defHull = (typeof getDefaultHullForSubmarine === 'function') ? getDefaultHullForSubmarine(targetSub) : 'I-19';
          hullInput.value = defHull;
          if (campaignState.workflow) campaignState.workflow.hullNumber = defHull;
        }
      } else {
        select.value = "";
        const hullInput = document.getElementById('wf-sub-hull-number');
        if (hullInput && (!campaignState.workflow || !campaignState.workflow.hullNumber)) {
          hullInput.value = "";
          hullInput.placeholder = isEn ? "e.g. I-19" : "ej. I-19";
        }
      }
      
      updateWorkflowSubmarineSpecs();
      updateTorpedoDoctrineDisplay();
    }



    function formatSensuikanMonth(monthId, isEn) {
      if (!monthId) return isEn ? "Dec-41 (1941-12)" : "Dic-41 (1941-12)";
      const parts = monthId.split('-');
      const year = parts[0] || '1941';
      const yr2 = year.slice(-2);
      const m = parseInt(parts[1] || '12', 10);
      const esMonths = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const enMonths = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const prefix = isEn ? (enMonths[m] || 'Dec') : (esMonths[m] || 'Dic');
      return `${prefix}-${yr2} (${monthId})`;
    }

    function buildWorkflowMonthSelect() {
      const dropdown = document.getElementById('wf-month-dropdown');
      const display = document.getElementById('wf-month-display');
      const hiddenInput = document.getElementById('wf-month-select');
      if (!dropdown || !display) return;
      
      const isEn = window.currentLang === 'en';
      const startMonth = getSubmarineStartMonth(campaignState.activeSubKey) || "1941-12";
      const allMonths = (MONTHS || []);
      
      if (!campaignState.workflow.selectedMonth) {
        campaignState.workflow.selectedMonth = startMonth;
      }
      const targetMonth = campaignState.workflow.selectedMonth;

      if (hiddenInput) hiddenInput.value = targetMonth;
      display.innerText = formatSensuikanMonth(targetMonth, isEn);

      dropdown.innerHTML = '';
      
      // Header 1: Disponibles
      const headerAvailable = document.createElement('div');
      headerAvailable.className = 'custom-option-header';
      headerAvailable.innerHTML = isEn ? '📌 <b>Available Months for this Submarine</b>' : '📌 <b>Meses Disponibles para este Buque</b>';
      dropdown.appendChild(headerAvailable);

      const available = allMonths.filter(m => m.id >= startMonth).sort((a, b) => a.id.localeCompare(b.id));
      available.forEach(m => {
          const opt = document.createElement('div');
          opt.className = 'custom-option';
          opt.innerHTML = `<span style="color:#fbbf24;">★</span> ${formatSensuikanMonth(m.id, isEn)}`;
          opt.onclick = () => {
              if (hiddenInput) hiddenInput.value = m.id;
              campaignState.workflow.selectedMonth = m.id;
              display.innerText = opt.innerText.replace('★ ', '');
              dropdown.style.display = 'none';
              onWorkflowMonthChange();
          };
          dropdown.appendChild(opt);
      });

      const headerAll = document.createElement('div');
      headerAll.className = 'custom-option-header';
      headerAll.innerHTML = isEn ? '<br>🌐 <b>All Historical Months</b>' : '<br>🌐 <b>Todos los Meses Históricos</b>';
      dropdown.appendChild(headerAll);

      const all = [...allMonths].sort((a, b) => a.id.localeCompare(b.id));
      all.forEach(m => {
          const opt = document.createElement('div');
          opt.className = 'custom-option';
          opt.style.paddingLeft = '20px';
          opt.innerText = formatSensuikanMonth(m.id, isEn);
          opt.onclick = () => {
              if (hiddenInput) hiddenInput.value = m.id;
              campaignState.workflow.selectedMonth = m.id;
              display.innerText = opt.innerText;
              dropdown.style.display = 'none';
              onWorkflowMonthChange();
          };
          dropdown.appendChild(opt);
      });

      updatePhase1TableHighlight();
      updateBasesForDate(targetMonth);
      updateSpecialEventsForMonthArea(); renderMissionChits();
      renderTokens();
    }

    window.addEventListener('click', (e) => {
        const dropdown = document.getElementById('wf-month-dropdown');
        const display = document.getElementById('wf-month-display');
        if (dropdown && dropdown.style.display === 'block' && !dropdown.contains(e.target) && e.target !== display) {
            dropdown.style.display = 'none';
        }
    });

    window.toggleMonthDropdown = function() {
        const d = document.getElementById('wf-month-dropdown');
        d.style.display = d.style.display === 'block' ? 'none' : 'block';
    };

    window.selectMonth = function(monthId) {
        campaignState.workflow.selectedMonth = monthId;
        const hiddenInput = document.getElementById('wf-month-select');
        if (hiddenInput) hiddenInput.value = monthId;
        const display = document.getElementById('wf-month-display');
        if (display) display.innerText = formatSensuikanMonth(monthId, (window.currentLang === 'en'));
        const d = document.getElementById('wf-month-dropdown');
        if (d) d.style.display = 'none';
        onWorkflowMonthChange();
    };

    function onWorkflowMonthChange() {
      const hiddenInput = document.getElementById('wf-month-select');
      if (hiddenInput && hiddenInput.value) {
        campaignState.workflow.selectedMonth = hiddenInput.value;
      }
      const selectedMonth = campaignState.workflow.selectedMonth || "1941-12";
      populateAreaDropdown();
      updatePhase1TableHighlight();
      updateBasesForDate(selectedMonth);
      updateSpecialEventsForMonthArea(); 
      renderMissionChits();
      recalculatePatrolTrack();
      syncCurrentPatrolToLog();
      if (typeof updateWorkflowSubmarineSpecs === 'function') updateWorkflowSubmarineSpecs();
      if (typeof updateTorpedoDoctrineDisplay === 'function') updateTorpedoDoctrineDisplay();
      if (typeof updateFidoStatus === 'function') updateFidoStatus();
      saveState();
    }

    // OFFICIAL COMPASS GAMES CHARTS DATA

    // =========================================================================
    // MANUAL PHYSICAL DICE / TABLETOP OVERRIDES FOR TRAINING SCHOOLS (RULE 4.8)
    // =========================================================================

    function setCaptainTorpedoTraining(success) {
      const isEn = (window.currentLang === 'en');
      campaignState.school.capTorpEarned = Boolean(success);
      const el = document.getElementById('res-f1-cap-torp');
      if (el) el.dataset.rolled = 'true';
      if (success) {
        el.innerHTML = isEn
          ? `🎲 Tabletop / Manual ➔ <span style="color:#22c55e; font-weight:800;">SUCCESS (Granted). Torpedo Gunnery GAINED.</span>`
          : `🎲 Dados Propios / Manual ➔ <span style="color:#22c55e; font-weight:800;">¡ÉXITO (Conseguido)! Habilidad Torpedo Gunnery GANADA.</span>`;
        showToast(isEn ? "Captain gains Torpedo Gunnery!" : "¡Capitán gana Torpedo Gunnery!");
        setK1Token('cap-torp', true);
        highlightSchoolBox('sch-row-b1-long', 'green');
      } else {
        el.innerHTML = isEn
          ? `🎲 Tabletop / Manual ➔ <span style="color:#ef4444; font-weight:800;">Failed (Not Earned). No skill gained.</span>`
          : `🎲 Dados Propios / Manual ➔ <span style="color:#ef4444; font-weight:800;">Fallo (No conseguido). Sin habilidad.</span>`;
        showToast(isEn ? "Captain failed torpedo training." : "Capitán no obtuvo Torpedo Gunnery.");
        setK1Token('cap-torp', false);
        highlightSchoolBox('sch-row-b1-long', 'red');
      }
      saveState();
    }

    function setXODeckGunTraining(success) {
      const isEn = (window.currentLang === 'en');
      campaignState.school.xoDeckGunEarned = Boolean(success);
      const el = document.getElementById('res-f1-xo-gun');
      if (el) el.dataset.rolled = 'true';
      if (success) {
        el.innerHTML = isEn
          ? `🎲 Tabletop / Manual ➔ <span style="color:#22c55e; font-weight:800;">SUCCESS (Granted). Deck Gun Expert GAINED.</span>`
          : `🎲 Dados Propios / Manual ➔ <span style="color:#22c55e; font-weight:800;">¡ÉXITO (Conseguido)! Habilidad Deck Gun Expert GANADA.</span>`;
        showToast(isEn ? "XO gains Deck Gun Expert!" : "¡XO gana Deck Gun Expert!");
        setK1Token('xo-deckgun', true);
        highlightSchoolBox('sch-row-b1-long', 'green');
      } else {
        el.innerHTML = isEn
          ? `🎲 Tabletop / Manual ➔ <span style="color:#ef4444; font-weight:800;">Failed (Not Earned). No skill gained.</span>`
          : `🎲 Dados Propios / Manual ➔ <span style="color:#ef4444; font-weight:800;">Fallo (No conseguido). Sin habilidad.</span>`;
        showToast(isEn ? "XO failed deck gun training." : "XO no obtuvo Deck Gun Expert.");
        setK1Token('xo-deckgun', false);
        highlightSchoolBox('sch-row-b1-long', 'red');
      }
      saveState();
    }

    function setEngineerJudgmentTraining(success) {
      const isEn = (window.currentLang === 'en');
      campaignState.school.engJudgmentEarned = Boolean(success);
      const el = document.getElementById('res-f1-eng-keen');
      if (el) el.dataset.rolled = 'true';
      if (success) {
        el.innerHTML = isEn
          ? `⚡ Tabletop / Manual ➔ <span style="color:#22c55e; font-weight:800;">SUCCESS (Depth Test Passed). Keen Judgment GAINED.</span>`
          : `⚡ Dados Propios / Manual ➔ <span style="color:#22c55e; font-weight:800;">¡ÉXITO (Prueba Superada)! Habilidad Keen Judgment GANADA.</span>`;
        showToast(isEn ? "Chief Engineer gains Keen Judgment!" : "¡Jefe de Máquinas obtiene Keen Judgment!");
        setK1Token('eng-keen', true);
        highlightSchoolBox('sch-box-depth-pass', 'green');
      } else {
        el.innerHTML = isEn
          ? `⚡ Tabletop / Manual ➔ <span style="color:#ef4444; font-weight:800;">Failed (Simulated Implosion). No skill gained.</span>`
          : `⚡ Dados Propios / Manual ➔ <span style="color:#ef4444; font-weight:800;">Fallo (Implosión simulada). Sin habilidad.</span>`;
        showToast(isEn ? "Simulated implosion on depth test." : "Implosión simulada en prueba de profundidad.");
        setK1Token('eng-keen', false);
        highlightSchoolBox('sch-box-depth-fail', 'red');
      }
      saveState();
    }

    function setF2Torpedo(success) {
      const isEn = (window.currentLang === 'en');
      campaignState.school.f2TorpEarned = Boolean(success);
      const el = document.getElementById('res-f2-torp');
      if (el) el.dataset.rolled = 'true';
      el.innerHTML = isEn
        ? `🎲 Tabletop / Manual ➔ ` + (success ? `<span style="color:#22c55e; font-weight:800;">Passed (Granted)</span>` : `<span style="color:#ef4444; font-weight:800;">Failed</span>`)
        : `🎲 Dados Propios / Manual ➔ ` + (success ? `<span style="color:#22c55e; font-weight:800;">Ganado (Conseguido)</span>` : `<span style="color:#ef4444; font-weight:800;">Fallo</span>`);
      showToast(isEn ? `F2 Torpedoes: ${success ? 'Passed!' : 'Failed'}` : `F2 Torpedos: ${success ? '¡Ganado!' : 'Fallo'}`);
      if (typeof setK1Token === 'function') setK1Token('midget-torp', success);
      saveState();
    }

    function setF2Comms(success) {
      const isEn = (window.currentLang === 'en');
      campaignState.school.f2CommsEarned = Boolean(success);
      const el = document.getElementById('res-f2-comms');
      if (el) el.dataset.rolled = 'true';
      el.innerHTML = isEn
        ? `🎲 Tabletop / Manual ➔ ` + (success ? `<span style="color:#22c55e; font-weight:800;">Passed (Granted)</span>` : `<span style="color:#ef4444; font-weight:800;">Failed</span>`)
        : `🎲 Dados Propios / Manual ➔ ` + (success ? `<span style="color:#22c55e; font-weight:800;">Ganado (Conseguido)</span>` : `<span style="color:#ef4444; font-weight:800;">Fallo</span>`);
      showToast(isEn ? `F2 Comms: ${success ? 'Passed!' : 'Failed'}` : `F2 Comunicaciones: ${success ? '¡Ganado!' : 'Fallo'}`);
      if (typeof setK1Token === 'function') setK1Token('midget-comms', success);
      saveState();
    }

    function setF2Net(success) {
      const isEn = (window.currentLang === 'en');
      campaignState.school.f2NetEarned = Boolean(success);
      const el = document.getElementById('res-f2-net');
      if (el) el.dataset.rolled = 'true';
      el.innerHTML = isEn
        ? `🎲 Tabletop / Manual ➔ ` + (success ? `<span style="color:#22c55e; font-weight:800;">Passed (Granted)</span>` : `<span style="color:#ef4444; font-weight:800;">Failed</span>`)
        : `🎲 Dados Propios / Manual ➔ ` + (success ? `<span style="color:#22c55e; font-weight:800;">Ganado (Conseguido)</span>` : `<span style="color:#ef4444; font-weight:800;">Fallo</span>`);
      showToast(isEn ? `F2 Nets: ${success ? 'Passed!' : 'Failed'}` : `F2 Redes: ${success ? '¡Ganado!' : 'Fallo'}`);
      if (typeof setK1Token === 'function') setK1Token('midget-boat', success);
      saveState();
    }

    if (typeof window !== 'undefined') {
      window.setCaptainTorpedoTraining = setCaptainTorpedoTraining;
      window.setXODeckGunTraining = setXODeckGunTraining;
      window.setEngineerJudgmentTraining = setEngineerJudgmentTraining;
      window.setF2Torpedo = setF2Torpedo;
      window.setF2Comms = setF2Comms;
      window.setF2Net = setF2Net;
      window.syncF4ToK1 = syncF4ToK1;
      window.syncF3ToK1 = syncF3ToK1;
      window.isKaidaiOrTypeB = isKaidaiOrTypeB;
      window.setTorpedoDoctrinePeriod = setTorpedoDoctrinePeriod;
      window.rollInitialTorpedoMix = rollInitialTorpedoMix;
      window.setInitialTorpedoMixPreset = setInitialTorpedoMixPreset;
      window.onType92CountChange = onType92CountChange;
      window.updateTorpedoDoctrineDisplay = updateTorpedoDoctrineDisplay;
    }
