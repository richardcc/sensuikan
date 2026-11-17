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

    function checkSubAircraft(sub) {
      if (!sub) return false;
      return Boolean(sub.has_aircraft === true || sub.aircraft_type || sub.plane === 1 || (sub.aircraft && sub.aircraft > 0));
    }

    function checkSubKaiten(sub) {
      if (!sub) return false;
      return Boolean(sub.has_kaiten === true || (sub.kaiten_note && sub.kaiten_note.toLowerCase().includes('kaiten')));
    }

    function syncF3ToK1() {
      const sub = getActiveSubmarine();
      const hasPlane = checkSubAircraft(sub);
      const chkWeap = document.getElementById('chk-f3-weap');
      const chkMaint = document.getElementById('chk-f3-maint');
      const chkAcm = document.getElementById('chk-f3-acm');
      const chkNav = document.getElementById('chk-f3-nav');
      if (typeof setK1Token === 'function') {
        setK1Token('air1-weap', Boolean(hasPlane && chkWeap && chkWeap.checked));
        setK1Token('air1-maint', Boolean(hasPlane && chkMaint && chkMaint.checked));
        setK1Token('air1-acm', Boolean(hasPlane && chkAcm && chkAcm.checked));
        setK1Token('air1-nav', Boolean(hasPlane && chkNav && chkNav.checked));
      }
      if (typeof renderTokens === 'function') renderTokens();
    }

    function validateF3Checkboxes(el) {
      const isEn = (window.currentLang === 'en');
      const sub = getActiveSubmarine();
      const hasPlane = checkSubAircraft(sub);
      if (!hasPlane) {
        if (el) el.checked = false;
        showToast(isEn ? "⚠️ Does not apply: submarine has no aircraft (Rule 4.8.3)." : "⚠️ No aplica: el buque no dispone de hidroavión (Regla 4.8.3).");
        return;
      }
      const chks = [
        document.getElementById('chk-f3-weap'),
        document.getElementById('chk-f3-maint'),
        document.getElementById('chk-f3-acm'),
        document.getElementById('chk-f3-nav')
      ];
      let checkedCount = chks.filter(c => c && c.checked).length;
      if (checkedCount > 2) {
        if (el) el.checked = false;
        showToast(isEn ? "⚠️ You can choose at most 2 skills for the air crew (Rule 4.8.3)." : "⚠️ Solo puedes elegir un máximo de 2 habilidades para la dotación aérea (Regla 4.8.3).");
      }
      syncF3ToK1();
      saveState();
    }

    function rollRandomF3Skills() {
      const isEn = (window.currentLang === 'en');
      const sub = getActiveSubmarine();
      const hasPlane = checkSubAircraft(sub);
      if (!hasPlane) {
        showToast(isEn ? "⚠️ Does not apply: submarine has no aircraft (Rule 4.8.3)." : "⚠️ No aplica: el buque no dispone de hidroavión (Regla 4.8.3).");
        return;
      }
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
      showToast(isEn ? "🎲 2 Air crew skills selected at random!" : "🎲 ¡2 Habilidades de dotación aérea seleccionadas al azar!");
      saveState();
    }

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
          if (f3BtnRoll) {
            f3BtnRoll.disabled = false;
            f3BtnRoll.style.opacity = "1";
            f3BtnRoll.style.cursor = "pointer";
          }
          if (f3OptsContainer) {
            f3OptsContainer.style.opacity = "1";
            f3OptsContainer.style.pointerEvents = "auto";
          }
          if (f3Notice) f3Notice.style.display = "none";
          ['chk-f3-weap', 'chk-f3-maint', 'chk-f3-acm', 'chk-f3-nav'].forEach(id => {
            const chk = document.getElementById(id);
            if (chk) chk.disabled = false;
          });
        } else {
          f3Badge.style.background = "#334155";
          f3Badge.style.color = "#cbd5e1";
          f3Badge.innerHTML = isEn ? `🔴 No Floatplane (Does Not Apply to Submarine)` : `🔴 Sin Hidroavión (No Aplica a tu Buque)`;
          if (f3BtnRoll) {
            f3BtnRoll.disabled = true;
            f3BtnRoll.style.opacity = "0.5";
            f3BtnRoll.style.cursor = "not-allowed";
          }
          if (f3OptsContainer) {
            f3OptsContainer.style.opacity = "0.45";
            f3OptsContainer.style.pointerEvents = "none";
          }
          if (f3Notice) f3Notice.style.display = "block";
          ['chk-f3-weap', 'chk-f3-maint', 'chk-f3-acm', 'chk-f3-nav'].forEach(id => {
            const chk = document.getElementById(id);
            if (chk) {
              chk.checked = false;
              chk.disabled = true;
            }
          });
          if (typeof setK1Token === 'function') {
            setK1Token('air1-weap', false);
            setK1Token('air1-maint', false);
            setK1Token('air1-acm', false);
            setK1Token('air1-nav', false);
          }
        }
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
          if (f4Notice) f4Notice.style.display = "none";
          for (let i = 1; i <= 6; i++) {
            const sel = document.getElementById(`sel-f4-pilot-${i}`);
            if (sel) sel.disabled = false;
          }
        } else {
          f4Badge.style.background = "#334155";
          f4Badge.style.color = "#cbd5e1";
          f4Badge.innerHTML = isEn ? `⚪ No Kaiten (Does Not Apply to Submarine)` : `⚪ Sin Kaiten (No Aplica a tu Buque)`;
          if (f4BtnRoll) {
            f4BtnRoll.disabled = true;
            f4BtnRoll.style.opacity = "0.5";
            f4BtnRoll.style.cursor = "not-allowed";
          }
          if (f4BtnPreset) {
            f4BtnPreset.disabled = true;
            f4BtnPreset.style.opacity = "0.5";
            f4BtnPreset.style.cursor = "not-allowed";
          }
          if (f4OptsContainer) {
            f4OptsContainer.style.opacity = "0.45";
            f4OptsContainer.style.pointerEvents = "none";
          }
          if (f4Notice) f4Notice.style.display = "block";
          for (let i = 1; i <= 6; i++) {
            const sel = document.getElementById(`sel-f4-pilot-${i}`);
            if (sel) sel.disabled = true;
          }
        }
      }
    }

    function syncF4ToK1() {
      const sub = getActiveSubmarine();
      const hasKaiten = checkSubKaiten(sub);
      if (!Array.isArray(campaignState.kaitenPilots)) campaignState.kaitenPilots = [];
      campaignState.kaitenPilots = [];
      for (let i = 1; i <= 6; i++) {
        const sel = document.getElementById(`sel-f4-pilot-${i}`);
        if (sel) {
          campaignState.kaitenPilots.push({ pilot: i, benefit: hasKaiten ? sel.value : '' });
        }
      }
      if (typeof renderTokens === 'function') renderTokens();
      saveState();
    }

    function rollRandomF4Benefits() {
      const isEn = (window.currentLang === 'en');
      const sub = getActiveSubmarine();
      const hasKaiten = checkSubKaiten(sub);
      if (!hasKaiten) {
        showToast(isEn ? "⚠️ Does not apply: submarine cannot carry Kaiten torpedoes (Rules 4.8.4 & 7.18)." : "⚠️ No aplica: este buque no admite torpedos Kaiten (Reglas 4.8.4 & 7.18).");
        return;
      }
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
      const sub = getActiveSubmarine();
      const hasKaiten = checkSubKaiten(sub);
      if (!hasKaiten) {
        showToast(isEn ? "⚠️ Does not apply: submarine cannot carry Kaiten torpedoes (Rules 4.8.4 & 7.18)." : "⚠️ No aplica: este buque no admite torpedos Kaiten (Reglas 4.8.4 & 7.18).");
        return;
      }
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
      setK1Token('air1-weap', Boolean(hasPlane && chkWeap && chkWeap.checked));
      setK1Token('air1-maint', Boolean(hasPlane && chkMaint && chkMaint.checked));
      setK1Token('air1-acm', Boolean(hasPlane && chkAcm && chkAcm.checked));
      setK1Token('air1-nav', Boolean(hasPlane && chkNav && chkNav.checked));

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
      campaignState.activeSubKey = selVal;
      selectSubmarine(selVal);
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
      saveState();
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

    function updateWorkflowSubmarineSpecs() {
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[campaignState.activeSubKey] || subs[Object.keys(subs)[0]];
      if (!sub) return;
      const isEn = window.currentLang === 'en';

      const setT = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || "--";
      };

      setT('wf-spec-class-name', sub.class_name || sub.full_title || campaignState.activeSubKey);
      const availableDate = sub.available_date || (isEn ? 'Available Dec 1941' : 'Disponible Dic-41');
      setT('wf-spec-entry-date', isEn
        ? availableDate.replace(/^Disponible:\s*/i, 'Available: ')
        : availableDate.replace(/^Available:?\s*/i, 'Disponible: '));
      
      const tubesStrong = document.querySelector('strong[data-i18n="p0Tubes"]');
      if (tubesStrong) tubesStrong.innerText = isEn ? "Torpedo Tubes:" : "Tubos Torpedo:";
      const torpLoadStrong = document.querySelector('strong[data-i18n="p0TorpedoLoad"]');
      if (torpLoadStrong) torpLoadStrong.innerText = isEn ? "Torpedo Load:" : "Carga Torpedos:";

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

    function onType92CountChange() {
      const sel = document.getElementById('wf-torp-type92-count');
      if (!sel) return;
      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.torpedoType92Count = parseInt(sel.value, 10);
      updateTorpedoDoctrineDisplay();
    }

    function updateTorpedoDoctrineDisplay() {
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[campaignState.activeSubKey] || subs[Object.keys(subs)[0]];
      if (!sub) return;
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

      // Update spec load line in #wf-sub-specs-box
      const specLoadEl = document.getElementById('wf-spec-torp-load');
      if (specLoadEl && specLoadText) {
        specLoadEl.innerHTML = `<span style="color:#a7f3d0; font-weight:bold;">${specLoadText}</span>`;
      }

      // Special notes: Ko-Hyoteki, Kaiten, Mines & Transport
      const notesEl = document.getElementById('wf-torp-special-notes');
      if (notesEl) {
        let notesHtml = [];
        const isTypeC = (campaignState.activeSubKey === 'Type_C_Class');
        const isMidget = (campaignState.activeSubKey === 'Type_A_Midget_Submarine___Ko_Hyoteki');
        if (isTypeC) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Carries 1 Type A Midget on aft deck armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Transporta 1 minisubmarino Tipo A en cubierta de popa armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        } else if (isMidget) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        }
        if (sub.has_kaiten) {
          notesHtml.push(isEn
            ? `<div>⚡ <strong>Manned Kaiten Suicide Torpedoes [4.8.4 & 7.18]:</strong> Carries 4–6 Type 1 Kaiten on deck clamps on Kaiten Special Missions (late 1944+).</div>`
            : `<div>⚡ <strong>Torpedos Suicidas Tripulados Kaiten [4.8.4 & 7.18]:</strong> Transporta de 4 a 6 Kaiten Tipo 1 en soportes de cubierta en Misiones Kaiten (1944+).</div>`);
        }
        if (campaignState.activeSubKey === 'Kirai_Sen_Class') {
          notesHtml.push(isEn
            ? `<div>💣 <strong>Minelaying Missions [4.5.8 & 7.10]:</strong> Dedicated minelayer carrying 42 naval mines in aft internal tubes (Chart E6 aft torpedo damage applies to mine doors). 4 bow torpedo tubes + 8 reloads carry standard torpedoes.</div>`
            : `<div>💣 <strong>Misiones de Minado [4.5.8 & 7.10]:</strong> Minador especializado que transporta 42 minas navales en tubos internos de popa (las averías de torpedos de popa en E6 van a compuertas de minas). Los 4 tubos de proa + 8 recargas llevan torpedos estándar.</div>`);
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

      showToast(`¡Submarino ${hull} comisionado al mando de ${rank} ${cmdr}! Procediendo a Escuela Naval.`);
      setWorkflowPhase('school');
      saveState();
    }

    function buildWorkflowSubClassSelect() {
      const sel = document.getElementById('wf-sub-class-select');
      if (!sel) return;
      sel.innerHTML = '';
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const keys = Object.keys(subs);
      
      keys.forEach(k => {
        const sub = subs[k];
        const opt = document.createElement('option');
        opt.value = k;
        opt.innerText = `${sub.class_name || k} (${sub.available_date || '1941'})`;
        opt.style.backgroundColor = '#071b2d';
        opt.style.color = '#f1f5f9';
        if (k === campaignState.activeSubKey || (!campaignState.activeSubKey && k === keys[0])) {
          opt.selected = true;
          campaignState.activeSubKey = k;
        }
        sel.appendChild(opt);
      });
      updateWorkflowSubmarineSpecs();
    }

        function buildWorkflowMonthSelect() {
      const sel = document.getElementById('wf-month-select');
      if (!sel) return;
      sel.innerHTML = '';
      const startMonth = getSubmarineStartMonth(campaignState.activeSubKey);
      const validMonths = MONTHS.filter(m => m.id >= startMonth);
      const isEn = window.currentLang === 'en';
      validMonths.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        const monthLabel = isEn ? `${m.short} (${m.id})` : m.label;
        opt.innerText = monthLabel + (m.milestone ? ' [' + m.milestone + ']' : '');
        sel.appendChild(opt);
      });

      if (!campaignState.workflow.selectedMonth || campaignState.workflow.selectedMonth < startMonth) {
        campaignState.workflow.selectedMonth = startMonth;
      }
      sel.value = campaignState.workflow.selectedMonth;

      const subObj = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines[campaignState.activeSubKey] : null;
      const subName = subObj ? subObj.class_name : campaignState.activeSubKey;
      const hintEl = document.getElementById('p1-sub-avail-hint');
      if (hintEl) {
        hintEl.innerHTML = isEn
          ? `⚓ <strong>${subName}:</strong> Available for patrols from <strong>${startMonth}</strong> (${validMonths.length} operational months).`
          : `⚓ <strong>${subName}:</strong> Disponible para patrullas a partir de <strong>${startMonth}</strong> (${validMonths.length} meses operacionales).`;
      }

      updatePhase1TableHighlight();
      updateBasesForDate(campaignState.workflow.selectedMonth);
      updateSpecialEventsForMonthArea(); renderMissionChits();
    }

    function onWorkflowMonthChange() {
      campaignState.workflow.selectedMonth = document.getElementById('wf-month-select').value;
      populateAreaDropdown();
      updatePhase1TableHighlight();
      updateBasesForDate(campaignState.workflow.selectedMonth);
      updateSpecialEventsForMonthArea(); renderMissionChits();
      recalculatePatrolTrack();
      syncCurrentPatrolToLog();
      if (typeof updateTorpedoDoctrineDisplay === 'function') updateTorpedoDoctrineDisplay();
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
