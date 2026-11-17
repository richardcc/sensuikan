with open('app/js/gameflow_phase0.js', 'r', encoding='utf-8') as f:
    text = f.read()

manual_training_code = '''
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
    }
'''

new_text = text.strip() + '\n' + manual_training_code

with open('app/js/gameflow_phase0.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Appended manual training functions successfully.")
