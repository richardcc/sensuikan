// =========================================================================
// SENSUiKAN: GAME FLOW - ORCHESTRATOR & MISSION CHITS
// Main Game Flow coordinator, Mission Chits gallery, initApp & Phase switcher aliases.
// =========================================================================

// =========================================================================
// SENSUiKAN: 5-PHASE PATROL WORKFLOW, SUBMAT, SCHOOLS & ROGU BUKKU
// =========================================================================
function renderMissionChits() {
      const grid = document.getElementById('mission-chits-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const currentMonth = campaignState.workflow.selectedMonth || '1941-12';
      const assignedArea = (campaignState.workflow.assignedArea || '').toLowerCase();

      let chitsToShow = [];
      if (currentChitsFilter === 'month') {
        // STRICTLY show only mission chits active in this historical month (Rule 7.14)
        chitsToShow = MISSION_CHITS.filter(c => c.cat === 'mission' && c.validMonths && c.validMonths.includes(currentMonth));
      } else if (currentChitsFilter === 'ports') {
        chitsToShow = MISSION_CHITS.filter(c => c.cat === 'port');
      } else {
        chitsToShow = MISSION_CHITS.filter(c => c.cat === 'mission');
      }

      if (chitsToShow.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; padding: 1.25rem; text-align: center; color: #94a3b8; font-size: 0.85rem; background: rgba(15, 23, 42, 0.45); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15);">
            <i class="fas fa-info-circle" style="margin-right: 0.5rem; color: #38bdf8;"></i>
            Este mes histórico no cuenta con fichas rojas de Gran Evento Histórico. La misión asignada en Tabla [A1] es <strong>Patrulla Estándar de Interdicción</strong> (caza de convoyes mercantes y buques de guerra).
          </div>
        `;
        return;
      }

      chitsToShow.forEach(c => {
        const isAreaMatch = assignedArea && (
          (c.redTitle && assignedArea.includes(c.redTitle.toLowerCase())) ||
          (c.redSub && assignedArea.includes(c.redSub.toLowerCase()))
        );

        const card = document.createElement('div');
        card.className = `chit-card ${allChitsFlipped ? 'flipped' : ''} ${isAreaMatch ? 'highlighted' : ''}`;
        card.id = `chit-el-${c.id}`;
        card.title = 'Haz clic para voltear ficha (ver misión especial)';
        card.onclick = () => {
          card.classList.toggle('flipped');
          showChitDetail(c);
        };

        const redSrc = (typeof resolveAsset === 'function') ? resolveAsset(`assets/chits/${c.redImg}`) : `assets/chits/${c.redImg}`;
        const whiteSrc = (typeof resolveAsset === 'function') ? resolveAsset(`assets/chits/${c.whiteImg}`) : `assets/chits/${c.whiteImg}`;

        const frontHtml = c.redImg ? `
          <div class="chit-front" style="padding:0; overflow:hidden; border:2px solid #b91c1c;">
            <img src="${redSrc}" alt="${c.redTitle}" style="width:100%; height:100%; object-fit:cover; border-radius:6px; display:block;" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='block';" />
            <span style="font-weight:900; color:#fff; font-size:0.84rem; display:none; padding:4px; text-align:center;">${c.redTitle}</span>
          </div>
        ` : `
          <div class="chit-front">
            <span style="font-size:0.84rem; font-weight:900;">${c.redTitle}</span>
          </div>
        `;

        const backHtml = c.whiteImg ? `
          <div class="chit-back" style="padding:0; overflow:hidden; border:2px solid #cbd5e1;">
            <img src="${whiteSrc}" alt="${c.whiteLines.join(' ')}" style="width:100%; height:100%; object-fit:cover; border-radius:6px; display:block;" onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='block';" />
            <span style="font-weight:900; color:#0f172a; font-size:0.84rem; display:none; padding:4px; text-align:center;">${c.whiteLines.join(' ')}</span>
          </div>
        ` : `
          <div class="chit-back">
            <span style="font-size:0.84rem; font-weight:900;">${c.whiteLines.join(' ')}</span>
          </div>
        `;

        card.innerHTML = `
          <div class="chit-inner">
            ${frontHtml}
            ${backHtml}
          </div>
        `;
        grid.appendChild(card);
      });
    }

    function toggleAllChitsFlip() {
      allChitsFlipped = !allChitsFlipped;
      document.querySelectorAll('.chit-card').forEach(c => {
        if (allChitsFlipped) c.classList.add('flipped');
        else c.classList.remove('flipped');
      });
    }

    function setChitsFilter(filterType) {
      currentChitsFilter = filterType;
      const bMonth = document.getElementById('btn-chits-filtered');
      const bAll = document.getElementById('btn-chits-all');
      if (bMonth) bMonth.classList.toggle('active', filterType === 'month');
      if (bAll) bAll.classList.toggle('active', filterType === 'all');
      renderMissionChits();
    }

    function showChitDetail(chit) {
      if (!chit) return;
      const subKey = campaignState.activeSubKey || "Type_B_Class";
      renderSpecialMissionsEvaluationTable(chit, subKey, 'wf-special-mission-eval-container');
    }


    // TARGET SHIPS DATABASES (CHARTS T1, T2, T3, T4, T5)
    

function initApp() {
      currentLang = (typeof detectInitialLanguage === 'function') ? detectInitialLanguage() : 'es';
      window.currentLang = currentLang;
      applyLanguage(currentLang);
      loadSavedState();
      if (typeof updateRoguBukkuSubProfile === "function") updateRoguBukkuSubProfile();
      buildWorkflowSubClassSelect();
      buildWorkflowMonthSelect();
      populateAreaDropdown();
      updateBasesForDate(campaignState.workflow.selectedMonth || "1941-12");
      updateSpecialEventsForMonthArea(); renderMissionChits();
      buildPatrolTable();
      buildSubmarineList();
      populateMasterCompendiumTables();
      selectSubmarine(campaignState.activeSubKey);
      renderTokens();
      recalculateTotals();
      recalculatePatrolTrack();
      const phaseToSet = (campaignState.workflow && campaignState.workflow.currentPhase !== undefined) ? campaignState.workflow.currentPhase : 0;
      setWorkflowPhase(phaseToSet);
    }

window.addEventListener('DOMContentLoaded', initApp);

    

campaignState.school = campaignState.school || {
      capTorpEarned: false,
      xoDeckGunEarned: false,
      engKeenEarned: false,
      spareTime: "martial",
      f2TorpEarned: false,
      f2CommsEarned: false,
      f2NetEarned: false,
      f3Skills: ["Weapons Expert", "Flawless Maintenance"]
    };


// Backward compatibility & convenience aliases
window.setGameFlowPhase = setWorkflowPhase;
window.switchGameFlowPhase = setWorkflowPhase;

    function onSubmarineChange() {
        if (typeof updateBasesForDate === 'function') updateBasesForDate(campaignState.workflow.selectedMonth || "1941-12");
        if (typeof buildWorkflowMonthSelect === 'function') buildWorkflowMonthSelect();
        if (typeof renderSubBoard === 'function') renderSubBoard();
        saveState();
    }
