// =========================================================================
// SENSUiKAN: SUBMARINES FLEET DOCK
// 18 Historical Imperial Japanese Navy submarine spec cards & commission selection.
// =========================================================================

    function buildSubmarineList() {
      const container = document.getElementById('sub-buttons-list');
      container.innerHTML = '';
      const subs = SUB_DB.submarines || {};
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');

      for (let k in subs) {
        const s = subs[k];
        const btn = document.createElement('button');
        btn.id = 'btn-sub-' + k;
        btn.className = 'sub-select-btn' + (k === campaignState.activeSubKey ? ' active' : '');
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

        btn.innerHTML = `
          <span style="font-weight:700; font-size:0.86rem; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-right:6px;">${s.class_name}</span>
          <span style="font-size:0.72rem; color:#94a3b8; background:rgba(0,0,0,0.35); border:1px solid #334155; padding:3px 8px; border-radius:4px; font-weight:600; white-space:nowrap; flex-shrink:0;">${dateBadge}</span>
        `;
        container.appendChild(btn);
      }
    }

    
    function updateRoguBukkuSubProfile() {
      const subKey = campaignState.activeSubKey || 'Type_B_Class';
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

function selectSubmarine(subKey) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const s = (SUB_DB.submarines || {})[subKey];
      if (!s) return;

      campaignState.activeSubKey = subKey;
      const selClass = document.getElementById('wf-sub-class-select');
      if (selClass && selClass.value !== subKey) {
        selClass.value = subKey;
      }

      document.querySelectorAll('.sub-select-btn').forEach(el => el.classList.remove('active'));
      const activeBtn = document.getElementById('btn-sub-' + subKey);
      if (activeBtn) activeBtn.classList.add('active');

      const titleEl = document.getElementById('sub-title');
      if (titleEl) titleEl.innerText = s.class_name;
      const subTitleEl = document.getElementById('sub-subtitle');
      if (subTitleEl) subTitleEl.innerText = s.full_title || s.class_name;
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

    function assignActiveSub() {
      const activeBtn = document.querySelector('.sub-select-btn.active');
      if (activeBtn) {
        const subKey = activeBtn.id.replace('btn-sub-', '');
        campaignState.activeSubKey = subKey;
        const subObj = (SUB_DB.submarines || {})[subKey];
        const subName = subObj ? subObj.class_name : subKey;
        document.getElementById('cdr-status-line').innerText = `Lt. Commander • Command: ${subName} • Kure Naval Base`;
        if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
        if (typeof renderSubmarinePatrolTrack === 'function') renderSubmarinePatrolTrack(subKey);
        saveState();
        showToast("Buque activo asignado: " + subName + " • Ruta de misión actualizada");
      }
    }

    // STATE & BACKUP
    // OCR DIGITAL TEMPLATES CACHE (100% DIGITAL TRANSCRIBED TABLES)
    // OCR_CHART_TEMPLATES loaded globally from data.js
