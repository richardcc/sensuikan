// =========================================================================
// SENSUiKAN: SUBMARINES FLEET DOCK
// 18 Historical Imperial Japanese Navy submarine spec cards & commission selection.
// =========================================================================

    let currentPreviewSubKey = null;
    window.currentPreviewSubKey = currentPreviewSubKey;

    function buildSubmarineList() {
      const container = document.getElementById('sub-buttons-list');
      if (!container) return;
      const subs = SUB_DB.submarines || {};
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      const fragment = document.createDocumentFragment();

      const activeSubKey = (typeof campaignState !== 'undefined') ? campaignState.activeSubKey : null;
      const selectedPreviewKey = (typeof currentPreviewSubKey !== 'undefined' && currentPreviewSubKey) 
        ? currentPreviewSubKey 
        : (activeSubKey || 'Type_B_Class');

      for (let k in subs) {
        const s = subs[k];
        const btn = document.createElement('button');
        btn.id = 'btn-sub-' + k;
        const isSelected = (k === selectedPreviewKey);
        const isCommissioned = (k === activeSubKey);
        btn.className = 'sub-select-btn' + (isSelected ? ' active' : '');
        btn.onclick = () => selectSubmarine(k);

        // Format clean compact date badge to guarantee perfect single-line alignment
        let rawDate = s.available_date || '';
        let dateBadge = rawDate.replace(/^Available\s+/i, '');
        if (!isEn) {
          dateBadge = dateBadge
            .replace(/December/i, 'Dic')
            .replace(/November/i, 'Nov')
            .replace(/July/i, 'Jul')
            .replace(/June/i, 'Jun');
        } else {
          dateBadge = dateBadge
            .replace(/December/i, 'Dec')
            .replace(/November/i, 'Nov')
            .replace(/July/i, 'Jul')
            .replace(/June/i, 'Jun');
        }
        if (!dateBadge) dateBadge = '1941';

        const activeTag = isCommissioned
          ? `<span class="badge-sub-active" style="font-size:0.65rem; color:#86efac; background:rgba(22,163,74,0.35); border:1px solid #16a34a; padding:1px 5px; border-radius:3px; font-weight:800; margin-left:4px; flex-shrink:0;">⚓ ${isEn ? 'ACTIVE' : 'ACTIVO'}</span>`
          : '';

        btn.innerHTML = `
          <div style="display:flex; align-items:center; gap:4px; overflow:hidden; padding-right:6px;">
            <span style="font-weight:700; font-size:0.86rem; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.class_name}</span>
            ${activeTag}
          </div>
          <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.35); border:1px solid #334155; padding:3px 8px; border-radius:4px; font-weight:600; white-space:nowrap; flex-shrink:0;">${dateBadge}</span>
        `;
        fragment.appendChild(btn);
      }
      container.innerHTML = '';
      container.appendChild(fragment);
    }

    
    function updateRoguBukkuSubProfile() {
      const subKey = campaignState.activeSubKey;
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      if (!subKey) {
        const profImg = document.getElementById('rogu-sub-profile-img');
        const defSvg = document.getElementById('rogu-sub-default-svg');
        if (profImg) profImg.style.display = 'none';
        if (defSvg) defSvg.style.display = 'block';
        const nameBadge = document.getElementById('rogu-sub-name-badge');
        if (nameBadge) nameBadge.innerText = isEn ? "Unassigned" : "Sin Asignar";
        const hullBadge = document.getElementById('rogu-sub-hull-badge');
        if (hullBadge) hullBadge.innerText = isEn ? "No Submarine Active" : "Sin Submarino Activo";
        return;
      }
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const s = subs[subKey] || {};

      const profImg = document.getElementById('rogu-sub-profile-img');
      const defSvg = document.getElementById('rogu-sub-default-svg');
      if (profImg) {
        const rawSrc = `assets/submarines_profiles/${subKey}.png`;
        profImg.src = (typeof resolveAsset === 'function') ? resolveAsset(rawSrc) : rawSrc;
        profImg.style.display = 'block';
        if (defSvg) defSvg.style.display = 'none';
      }

      const nameBadge = document.getElementById('rogu-sub-name-badge');
      if (nameBadge) {
        nameBadge.innerText = s.class_name || subKey;
      }

      const hullBadge = document.getElementById('rogu-sub-hull-badge');
      if (hullBadge) {
        const hullCode = (campaignState.commander && campaignState.commander.subHull) ? campaignState.commander.subHull : (s.hulls ? s.hulls[0] : 'I-15');
        hullBadge.innerText = `${hullCode} • ${s.available_date || '1941'}`;
      const subActiveText = (typeof t === 'function') ? t('subActiveBadge') : 'Submarino Activo';
      const elSubDescBadge = document.getElementById('rogu-sub-hull-badge');
      if (elSubDescBadge) elSubDescBadge.innerText = `${hullCode} • ${subActiveText}`;
      }
    }

function selectSubmarine(subKey, autoAssign = false) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};

      // If no subKey provided, fallback to activeSubKey or preview or default
      if (!subKey) {
        subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey)
          ? campaignState.activeSubKey
          : ((typeof currentPreviewSubKey !== 'undefined' && currentPreviewSubKey) ? currentPreviewSubKey : 'Type_B_Class');
        if (!subs[subKey]) {
          subKey = Object.keys(subs)[0] || 'Type_B_Class';
        }
      }

      currentPreviewSubKey = subKey;
      window.currentPreviewSubKey = currentPreviewSubKey;

      if (autoAssign) {
        assignActiveSub(subKey);
        return;
      }

      const s = subs[subKey];
      if (!s) return;

      document.querySelectorAll('.sub-select-btn').forEach(el => el.classList.remove('active'));
      const activeBtn = document.getElementById('btn-sub-' + subKey);
      if (activeBtn) activeBtn.classList.add('active');

      const isCurrentlyActive = (typeof campaignState !== 'undefined' && campaignState.activeSubKey === subKey);

      const titleEl = document.getElementById('sub-title');
      if (titleEl) titleEl.innerText = s.class_name;
      
      const subTitleEl = document.getElementById('sub-subtitle');
      if (subTitleEl) {
        if (isCurrentlyActive) {
          subTitleEl.innerText = isEn 
            ? `${s.full_title || s.class_name} • [Active Commissioned Boat]`
            : `${s.full_title || s.class_name} • [Buque Activo Comisionado]`;
          subTitleEl.style.color = '#86efac';
        } else {
          subTitleEl.innerText = isEn
            ? `${s.full_title || s.class_name} • [Class Preview - Click to Assign]`
            : `${s.full_title || s.class_name} • [Vista Previa - Clic para Asignar]`;
          subTitleEl.style.color = 'var(--gold-400)';
        }
      }

      // Update Assign Button appearance
      const assignBtn = document.getElementById('btn-dock-assign-active');
      const assignLbl = document.getElementById('lbl-dock-assign-active');
      if (assignBtn && assignLbl) {
        if (isCurrentlyActive) {
          assignLbl.innerText = isEn ? "✅ Active Boat Commissioned" : "✅ Buque Activo Comisionado";
          assignBtn.style.background = "#16a34a";
          assignBtn.style.borderColor = "#22c55e";
          assignBtn.style.color = "#ffffff";
          assignBtn.style.boxShadow = "0 0 12px rgba(34, 197, 94, 0.4)";
          assignBtn.title = isEn ? "This submarine is currently commissioned in your campaign." : "Este submarino está actualmente comisionado en tu campaña.";
        } else {
          assignLbl.innerText = isEn ? "⚓ Assign as Active Boat" : "⚓ Asignar como Buque Activo";
          assignBtn.style.background = "linear-gradient(135deg, var(--gold-500) 0%, #b45309 100%)";
          assignBtn.style.borderColor = "var(--gold-400)";
          assignBtn.style.color = "#0f172a";
          assignBtn.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.4)";
          assignBtn.title = isEn ? "Click to commission this submarine class for your campaign." : "Haz clic para comisionar esta clase de submarino para tu campaña.";
        }
      }

      const descEl = document.getElementById('sub-desc');
      const subDescEntry = (typeof SUB_DESCRIPTIONS !== 'undefined' && SUB_DESCRIPTIONS[subKey]) ? SUB_DESCRIPTIONS[subKey] : null;
      if (descEl) {
        if (subDescEntry) {
          descEl.innerText = isEn ? (subDescEntry.en || s.special_rules) : (subDescEntry.es || s.special_rules);
        } else {
          descEl.innerText = isEn ? (s.special_rules_en || s.special_rules || "Imperial Japanese Navy fleet submarine.") : (s.special_rules_es || s.special_rules || "Submarino de flota de la Armada Imperial Japonesa.");
        }
      }

      const stats = s.stats || {};
      const dispEl = document.getElementById('spec-disp');
      if (dispEl) dispEl.innerText = stats.displacement || '—';
      const speedEl = document.getElementById('spec-speed');
      if (speedEl) speedEl.innerText = (stats.speed || '—') + ' / ' + (stats.range || '—');
      const crewEl = document.getElementById('spec-crew');
      if (crewEl) crewEl.innerText = (stats.crew || '—') + ' / ' + (stats.produced || '—');

      const tt = s.torpedo_tubes || {};
      const tubesEl = document.getElementById('spec-tubes');
      if (tubesEl) {
        const fwd = tt.fwd !== undefined ? tt.fwd : (tt.forward !== undefined ? tt.forward : 0);
        const aft = tt.aft !== undefined ? tt.aft : (tt.stern !== undefined ? tt.stern : 0);
        const rfwd = tt.reloads_fwd !== undefined ? tt.reloads_fwd : 0;
        const raft = tt.reloads_aft !== undefined ? tt.reloads_aft : 0;
        const totalReloads = s.reload_capacity !== undefined ? s.reload_capacity : (rfwd + raft);
        const rldStr = raft > 0
          ? (isEn ? `(+${rfwd}F/${raft}A R)` : `(+${rfwd}P/${raft}P R)`)
          : `(+${totalReloads}R)`;
        tubesEl.innerText = isEn
          ? `${fwd} Fwd / ${aft} Aft ${rldStr}`
          : `${fwd} Proa / ${aft} Popa ${rldStr}`;
      }

      const dg = s.deck_guns || {};
      const noneLabel = isEn ? 'None' : 'Ninguno';
      const gunsEl = document.getElementById('spec-guns');
      if (gunsEl) gunsEl.innerText = `${dg.main || noneLabel} (${dg.ammo || 0}r) | ${dg.aa || noneLabel}`;

      const planeEl = document.getElementById('spec-plane');
      if (planeEl) {
        planeEl.innerText = s.has_aircraft
          ? (isEn ? 'Yes (Yokosuka E14Y Glen)' : 'Sí (Yokosuka E14Y Glen)')
          : (isEn ? 'No Hangar' : 'Sin Hangar');
      }
      
      const dmg = s.damage_capacity || {};
      const hullEl = document.getElementById('spec-hull');
      if (hullEl) hullEl.innerText = `${dmg.hull || 8} ${isEn ? 'Hits' : 'Impactos'}`;
      const floodEl = document.getElementById('spec-flood');
      if (floodEl) floodEl.innerText = `${dmg.flooding || 8} ${isEn ? 'Levels' : 'Niveles'}`;
      const kaitenEl = document.getElementById('spec-kaiten');
      if (kaitenEl) kaitenEl.innerText = s.has_kaiten ? (isEn ? 'Yes (1944+)' : 'Sí (1944+)') : (isEn ? 'No' : 'No');

      if (typeof updateRoguBukkuSubProfile === 'function') updateRoguBukkuSubProfile();

      const dockChitImg = document.getElementById('dock-sub-chit');
      if (dockChitImg) {
        const chitMap = (typeof window !== 'undefined' && window.SUB_CHITS_MAP) ? window.SUB_CHITS_MAP : {
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
        };
        const fname = chitMap[subKey] || 'Submarine - Type B.jpg';
        const rawSrc = `assets/chits/${fname}`;
        dockChitImg.src = (typeof resolveAsset === 'function') ? resolveAsset(rawSrc) : rawSrc;
        dockChitImg.alt = s.class_name || 'Submarine Counter Chit';
        dockChitImg.style.display = 'block';
      }

      const profImg = document.getElementById('sub-profile-img');
      if (profImg) {
        const rawSrc = `assets/submarines_profiles/${subKey}.png`;
        profImg.src = (typeof resolveAsset === 'function') ? resolveAsset(rawSrc) : rawSrc;
        profImg.style.display = 'block';
        const lbl = document.getElementById('sub-profile-label');
        if (lbl) lbl.innerText = s.class_name + (isEn ? ' • Print with Imperial Seal' : ' • Lámina con Sello Imperial');
      }

      // CRITICAL: Always render tracks FIRST & UNCONDITIONALLY
      try {
        if (typeof renderSubmarinePatrolTrack === 'function') {
          renderSubmarinePatrolTrack(subKey);
        }
      } catch (err) {
        console.warn("renderSubmarinePatrolTrack error:", err);
      }

      // Safely run secondary workflow helpers
      try {
        if (typeof buildWorkflowMonthSelect === 'function') buildWorkflowMonthSelect();
      } catch (e) {}
      try {
        if (typeof updateSpecialMissionCheck === 'function') updateSpecialMissionCheck();
      } catch (e) {}
      try {
        if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
      } catch (e) {}
      try {
        if (typeof updateOperationsMap === 'function') updateOperationsMap();
      } catch (e) {}
    }

    function assignActiveSub(explicitKey) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const activeBtn = document.querySelector('.sub-select-btn.active');
      const activeBtnKey = activeBtn ? activeBtn.id.replace('btn-sub-', '') : null;
      const targetKey = explicitKey || currentPreviewSubKey || activeBtnKey || (campaignState && campaignState.activeSubKey) || 'Type_B_Class';
      
      const subs = (typeof SUB_DB !== 'undefined' && SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const subObj = subs[targetKey];
      if (!subObj) return;

      campaignState.activeSubKey = targetKey;
      currentPreviewSubKey = targetKey;
      window.currentPreviewSubKey = targetKey;

      const subName = subObj.class_name || targetKey;

      // 1. Sync Phase 0 selector & workflow specs
      const selClass = document.getElementById('wf-sub-class-select');
      if (selClass && selClass.value !== targetKey) {
        selClass.value = targetKey;
      }
      try {
        if (typeof onWorkflowSubClassChange === 'function') {
          // Keep activeSubKey intact
          campaignState.activeSubKey = targetKey;
        }
        if (typeof updateWorkflowSubmarineSpecs === 'function') updateWorkflowSubmarineSpecs();
        if (typeof buildWorkflowMonthSelect === 'function') buildWorkflowMonthSelect();
      } catch (e) {}

      // 2. Sync Sub Board (16 systems & slots)
      try {
        if (typeof changeBoardSubmarine === 'function') changeBoardSubmarine(targetKey);
      } catch (e) {}

      // 3. Sync Rogu Bukku profile & tracks
      try {
        if (typeof updateRoguBukkuSubProfile === 'function') updateRoguBukkuSubProfile();
        if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
        if (typeof renderSubmarinePatrolTrack === 'function') renderSubmarinePatrolTrack(targetKey);
      } catch (e) {}

      // 4. Update Commander Dossier & Header Status
      const cdrEl = document.getElementById('cdr-status-line');
      if (cdrEl) {
        cdrEl.innerText = isEn
          ? `Lt. Commander • Command: ${subName} • Kure Naval Base`
          : `Capitán de Corbeta • Mando: ${subName} • Base Naval de Kure`;
      }
      try {
        if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      } catch (e) {}

      // 5. Rebuild sidebar list & update button state
      buildSubmarineList();
      selectSubmarine(targetKey);
      saveState();

      const msg = isEn
        ? `Submarine ${subName} successfully assigned as Active Vessel!`
        : `¡Submarino ${subName} asignado con éxito como Buque Activo!`;
      showToast(msg);
    }

    // STATE & BACKUP
    // OCR DIGITAL TEMPLATES CACHE (100% DIGITAL TRANSCRIBED TABLES)
    // OCR_CHART_TEMPLATES loaded globally from data.js
