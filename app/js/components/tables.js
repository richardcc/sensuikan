// =========================================================================
// SENSUiKAN: OFFICIAL CHARTS, DICE ROLLS & TACTICAL RESOLUTION
// =========================================================================
function highlightH2Cells(surKey, firstKey) {
      // Remove previous active highlights in Phase 0
      document.querySelectorAll('.h2-cell').forEach(el => {
        el.style.backgroundColor = '';
        el.style.boxShadow = '';
        el.style.borderColor = '#334155';
        el.style.color = '#f1f5f9';
      });

      // Highlight Surname
      if (surKey) {
        const surCell = document.getElementById(`p0-h2-sur-${surKey}`);
        if (surCell) {
          surCell.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
          surCell.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.6)';
          surCell.style.borderColor = 'var(--gold-400)';
          surCell.style.color = 'var(--gold-300)';
        }
      }

      // Highlight First Name
      if (firstKey) {
        const firstCell = document.getElementById(`p0-h2-first-${firstKey}`);
        if (firstCell) {
          firstCell.style.backgroundColor = 'rgba(16, 185, 129, 0.45)';
          firstCell.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.6)';
          firstCell.style.borderColor = '#34d399';
          firstCell.style.color = '#a7f3d0';
        }
      }
    }

    function pickH2Surname(key, name) {
      const currentFull = document.getElementById('wf-commander-name').value.trim();
      const parts = currentFull.split(' ');
      const firstName = parts.length > 1 ? parts.slice(1).join(' ') : "Mochitsura";
      const newFull = `${name} ${firstName}`;
      document.getElementById('wf-commander-name').value = newFull;
      campaignState.workflow.commanderName = newFull;
      campaignState.workflow.h2SurKey = key;
      const detailEl = document.getElementById('wf-h2-roll-details');
      if (detailEl) {
        detailEl.innerHTML = `★ Seleccionado: Apellido [${key}]: <strong>${name}</strong> | Nombre: <strong>${firstName}</strong>`;
      }
      highlightH2Cells(key, campaignState.workflow.h2FirstKey);
      showToast(`Apellido seleccionado: ${name}`);
      if (typeof regenerateCommanderBio === 'function') regenerateCommanderBio(false);
      else if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      saveState();
    }

    function pickH2FirstName(key, name) {
      const currentFull = document.getElementById('wf-commander-name').value.trim();
      const parts = currentFull.split(' ');
      const surname = parts.length > 0 && parts[0] ? parts[0] : "Hashimoto";
      const newFull = `${surname} ${name}`;
      document.getElementById('wf-commander-name').value = newFull;
      campaignState.workflow.commanderName = newFull;
      campaignState.workflow.h2FirstKey = key;
      const detailEl = document.getElementById('wf-h2-roll-details');
      if (detailEl) {
        detailEl.innerHTML = `★ Seleccionado: Apellido: <strong>${surname}</strong> | Nombre [${key}]: <strong>${name}</strong>`;
      }
      highlightH2Cells(campaignState.workflow.h2SurKey, key);
      showToast(`Nombre seleccionado: ${name}`);
      if (typeof regenerateCommanderBio === 'function') regenerateCommanderBio(false);
      else if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      saveState();
    }

    function rollCommanderNameH2() {
      const d1_sur = Math.floor(Math.random() * 6) + 1;
      const d2_sur = Math.floor(Math.random() * 6) + 1;
      const surKey = `${d1_sur}-${d2_sur}`;
      const surname = CHART_H2_SURNAMES[surKey] || "Hashimoto";

      const d1_first = Math.floor(Math.random() * 6) + 1;
      const d2_first = Math.floor(Math.random() * 6) + 1;
      const firstKey = `${d1_first}-${d2_first}`;
      const firstname = CHART_H2_FIRSTNAMES[firstKey] || "Mochitsura";

      const fullName = `${surname} ${firstname}`;
      document.getElementById('wf-commander-name').value = fullName;
      campaignState.workflow.commanderName = fullName;
      campaignState.workflow.h2SurKey = surKey;
      campaignState.workflow.h2FirstKey = firstKey;

      const detailEl = document.getElementById('wf-h2-roll-details');
      if (detailEl) {
        detailEl.innerHTML = `★ Tirada Tabla H2: Apellido [${surKey}]: <strong>${surname}</strong> | Nombre [${firstKey}]: <strong>${firstname}</strong>`;
      }
      highlightH2Cells(surKey, firstKey);
      showToast(`🎲 Comandante generado: ${fullName} ([${surKey}] / [${firstKey}])`);
      if (typeof regenerateCommanderBio === 'function') regenerateCommanderBio(true);
      else if (typeof renderCommanderDossier === 'function') renderCommanderDossier();
      saveState();
      return fullName;
    }

    

function getA1PeriodForDate(monthStr) {
      if (!monthStr || monthStr.startsWith("1941")) return "1941";
      if (monthStr.startsWith("1942")) {
        const m = parseInt(monthStr.split("-")[1], 10);
        return m <= 6 ? "1942 Jan-Jun" : "1942 Jul-Dec";
      }
      if (monthStr.startsWith("1943")) {
        const m = parseInt(monthStr.split("-")[1], 10);
        return m <= 6 ? "1943 Jan-Jun" : "1943 Jul-Dec";
      }
      if (monthStr.startsWith("1944")) {
        const m = parseInt(monthStr.split("-")[1], 10);
        return m <= 6 ? "1944 Jan-Jun" : "1944 Jul-Dec";
      }
      return "1945 Jan-Jul";
    }

    function mapA1ToA3Zone(area) {
      if (!area) return "Transit";
      const a = area.toLowerCase();
      if (a.includes("transit") || a.includes("tránsito") || a.includes("retorno")) return "Transit";
      if (a.includes("pearl")) return "Pearl Harbor";
      if (a.includes("west coast") || a.includes("indian ocean")) return "W. Coast/Indian Ocean";
      if (a.includes("philippines") || a.includes("aleutians") || a.includes("leyte")) return "Philippines/Aleutians";
      if (a.includes("midway")) return "Midway";
      if (a.includes("marianas") || a.includes("australia")) return "Marianas / Australia";
      if (a.includes("new guinea") || a.includes("guadalcanal")) return "New Guinea/Guadalcanal";
      if (a.includes("okinawa") || a.includes("iwo")) return "Okinawa/Iwo Jima";
      if (a.includes("tarawa")) return "Tarawa (Marshalls)";
      if (a.includes("dutch") || a.includes("malaya")) return "Dutch East Indies/Malaya";
      if (a.includes("europe") || a.includes("panama") || a.includes("misión")) return "Special Mission";
      return "W. Coast/Indian Ocean";
    }

    function populateAreaDropdown() {
      const select = document.getElementById('wf-area-select');
      if (!select) return;

      const currentMonth = campaignState.workflow.selectedMonth || "1941-12";
      const period = getA1PeriodForDate(currentMonth);
      const periodData = (CHART_A1_DATA && CHART_A1_DATA[period]) ? CHART_A1_DATA[period] : (CHART_A1_DATA["1941"] || {});

      // Agrupar áreas del periodo actual por tiradas de 2d6
      const periodAreas = {};
      for (let r = 2; r <= 12; r++) {
        const a = periodData[r];
        if (a) {
          if (!periodAreas[a]) periodAreas[a] = [];
          periodAreas[a].push(r);
        }
      }

      // 18 Áreas canónicas históricas de Sensuikan
      const allCanonicalAreas = [
        "Pearl Harbor", "Philippines", "Dutch East Indies", "Malaya", "US West Coast",
        "Australia", "Aleutians", "Midway", "Indian Ocean", "Guadalcanal",
        "New Guinea", "Marianas", "Tarawa", "Europe*", "Leyte Gulf",
        "Iwo Jima", "Okinawa", "Panama Canal**"
      ];

      const isEn = window.currentLang === 'en';
      const areaNames = {
        'Dutch East Indies': 'Dutch East Indies', 'US West Coast': 'US West Coast',
        'Indian Ocean': 'Indian Ocean', 'New Guinea': 'New Guinea',
        'Guadalcanal': 'Guadalcanal', 'Aleutians': 'Aleutians',
        'Philippines': 'Philippines', 'Pearl Harbor': 'Pearl Harbor',
        'Midway': 'Midway', 'Australia': 'Australia', 'Marianas': 'Marianas',
        'Tarawa': 'Tarawa', 'Leyte Gulf': 'Leyte Gulf', 'Iwo Jima': 'Iwo Jima',
        'Okinawa': 'Okinawa', 'Malaya': 'Malaya', 'Europe*': 'Europe*',
        'Panama Canal**': 'Panama Canal**'
      };
      let html = `<optgroup label="${isEn ? '📋 Assignable Areas for this Period' : '📋 Áreas Asignables en este Periodo'} [${isEn ? 'Chart A1' : 'Tabla A1'} (${period})]">`;
      Object.keys(periodAreas).forEach(a => {
        const rolls = periodAreas[a].join(", ");
        html += `<option value="${a}">⭐ ${areaNames[a] || a} (${isEn ? '2d6 roll' : 'Dados 2d6'}: ${rolls})</option>`;
      });
      html += `</optgroup>`;

      html += `<optgroup label="${isEn ? '🌐 All Sensuikan Theaters and Destinations' : '🌐 Todos los Teatros y Destinos de Sensuikan'}">`;
      allCanonicalAreas.forEach(a => {
        html += `<option value="${a}">${a}</option>`;
      });
      html += `</optgroup>`;

      select.innerHTML = html;

      // Ajustar al área actualmente asignada
      const currentArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      syncAreaSelectDropdown(currentArea);
    }

    function syncAreaSelectDropdown(area) {
      const areaSelect = document.getElementById('wf-area-select');
      if (!areaSelect || !area) return;
      const cleanTarget = String(area).toLowerCase().replace(/[*]/g, '').trim();
      
      // Pass 1: Exact matches
      for (let i = 0; i < areaSelect.options.length; i++) {
        const opt = areaSelect.options[i];
        const cleanOpt = opt.value.toLowerCase().replace(/[*]/g, '').trim();
        if (opt.value === area || cleanOpt === cleanTarget) {
          opt.selected = true;
          areaSelect.selectedIndex = i;
          areaSelect.value = opt.value;
          return;
        }
      }
      // Pass 2: Word/inclusion match
      for (let i = 0; i < areaSelect.options.length; i++) {
        const opt = areaSelect.options[i];
        const cleanOpt = opt.value.toLowerCase().replace(/[*]/g, '').trim();
        if (cleanOpt.includes(cleanTarget) || cleanTarget.includes(cleanOpt)) {
          opt.selected = true;
          areaSelect.selectedIndex = i;
          areaSelect.value = opt.value;
          return;
        }
      }
    }
    window.syncAreaSelectDropdown = syncAreaSelectDropdown;

    function onManualAreaSelected(area) {
      if (!area) return;

      campaignState.workflow.assignedArea = area;
      if (typeof subBoardState !== 'undefined') {
        subBoardState.assignedArea = area;
        if (typeof saveSubBoardState === 'function') saveSubBoardState();
      }
      const isEn = window.currentLang === 'en';

      syncAreaSelectDropdown(area);

      const period = getA1PeriodForDate(campaignState.workflow.selectedMonth || "1941-12");

      // Regla 4.7.2: Con base en Paramushiro, todas las patrullas subsiguientes están asignadas a las Aleutianas hasta 7/43
      const curBase = normalizeBaseName(campaignState.workflow.startingBase || "Yokosuka");
      let note = "";
      if (curBase === "Paramushiro" && (campaignState.workflow.selectedMonth || "") < "1943-07") {
        note = isEn
          ? " [⚓ Rule 4.7.2: Based at Paramushiro - Patrol fixed to Aleutians]"
          : " [⚓ Regla 4.7.2: Estacionado en Paramushiro - Patrulla fijada a Aleutianas]";
      } else {
        if (area.includes("Europe*")) note = isEn ? " (★ Type A and B submarines only; others reroll)" : " (★ Tipos A y B únicamente; otros vuelven a tirar)";
        if (area.includes("Panama**")) note = isEn ? " (★★ Floatplane submarines only; others reroll)" : " (★★ Solo subs con hidroavión; otros vuelven a tirar)";
      }

      // Regla 4.7.2: Si es asignado a las Aleutianas y no está en Paramushiro, se traslada automáticamente la base
      if (area.toLowerCase().includes("aleutians") && campaignState.workflow.startingBase !== "Paramushiro") {
        handleBaseChange("Paramushiro");
        showToast("⚓ Regla 4.7.2: Misión a las Aleutianas. Submarino trasladado automáticamente a Paramushiro.");
      }

      const resEl = document.getElementById('wf-patrol-area-res');
      if (resEl) {
        resEl.innerHTML = `<span style="background:rgba(30, 58, 138, 0.5); color:#93c5fd; padding:1px 6px; border-radius:3px; font-weight:bold; border:1px solid #1e40af;">📍 ${isEn ? 'MANUAL SELECTION' : 'ELECCIÓN MANUAL'}</span> ➔ <strong style="color:#fde047;">${area}${note}</strong> <span style="font-size:0.72rem; color:#94a3b8;">[${isEn ? 'Assigned Area' : 'Área Asignada'}]</span>`;
      }

      syncCurrentPatrolToLog();
      buildPatrolTable();
      updateSpecialEventsForMonthArea();
      renderMissionChits();
      recalculatePatrolTrack();
      if (typeof updateOperationsMap === 'function') updateOperationsMap();
      if (typeof window.onSensuikanDestinationChanged === 'function') window.onSensuikanDestinationChanged(area);
      saveState();
      showToast(isEn ? "Area set manually: " + area : "Área establecida manualmente: " + area);
    }
    window.onManualAreaSelected = onManualAreaSelected;

    function rollPatrolAssignment(manualRoll) {
      const selectedMonth = campaignState.workflow.selectedMonth || "1941-12";
      const isEn = window.currentLang === 'en';
      const period = getA1PeriodForDate(selectedMonth);
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

      const colData = CHART_A1_DATA[period] || CHART_A1_DATA["1941"];
      let area = colData[sum] || "Pearl Harbor";
      campaignState.workflow.lastA1Roll = sum;

      let note = "";
      if (area.includes("Europe*")) note = isEn ? " (★ Type A and B submarines only; others reroll)" : " (★ Tipos A y B únicamente; otros vuelven a tirar)";
      if (area.includes("Panama**")) note = isEn ? " (★★ Floatplane submarines only; others reroll)" : " (★★ Solo subs con hidroavión; otros vuelven a tirar)";

      campaignState.workflow.assignedArea = area;
      campaignState.workflow.firstTwelveRolled = false;

      // Sincronizar el desplegable de área manual
      syncAreaSelectDropdown(area);

      document.getElementById('wf-patrol-area-res').innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? '2d6 Roll' : 'Dados 2d6'}: [${d1} + ${d2} = ${sum}]</span> ➔ <strong>${area}${note}</strong> <span style="font-size:0.75rem; color:#94a3b8;">[${isEn ? 'Chart A1' : 'Tabla A1'} (${period})]</span>`;

      // Regla 4.7.2: Si es asignado a las Aleutianas y no está en Paramushiro, se traslada automáticamente la base
      if (area.toLowerCase().includes("aleutians") && campaignState.workflow.startingBase !== "Paramushiro") {
        handleBaseChange("Paramushiro");
        showToast("⚓ Regla 4.7.2: Misión a las Aleutianas. Submarino trasladado automáticamente a Paramushiro.");
      }

      syncCurrentPatrolToLog();
      buildPatrolTable();
      updatePhase1TableHighlight();
      updateSpecialEventsForMonthArea(); renderMissionChits();
      recalculatePatrolTrack();
      if (typeof updateOperationsMap === 'function') updateOperationsMap();
      if (typeof window.onSensuikanDestinationChanged === 'function') window.onSensuikanDestinationChanged(area);
      showToast(isEn ? "Area assigned (Chart A1): " + area : "Área asignada (Tabla A1): " + area);
      saveState();
    }

    function selectA1AreaManual(area, roll) {
      const isEn = window.currentLang === 'en';
      campaignState.workflow.assignedArea = area;
      campaignState.workflow.lastA1Roll = roll;
      const period = getA1PeriodForDate(campaignState.workflow.selectedMonth || "1941-12");
      document.getElementById('wf-patrol-area-res').innerText = `${area} [${isEn ? 'Chart A1' : 'Tabla A1'} (${period}) - ${isEn ? 'Selected' : 'Seleccionada'} (2d6=${roll})]`;

      syncAreaSelectDropdown(area);

      // Regla 4.7.2: Si es asignado a las Aleutianas y no está en Paramushiro, se traslada automáticamente la base
      if (area.toLowerCase().includes("aleutians") && campaignState.workflow.startingBase !== "Paramushiro") {
        handleBaseChange("Paramushiro");
        showToast("⚓ Regla 4.7.2: Misión a las Aleutianas. Submarino trasladado automáticamente a Paramushiro.");
      }

      syncCurrentPatrolToLog();
      buildPatrolTable();
      updatePhase1TableHighlight();
      updateSpecialEventsForMonthArea(); renderMissionChits();
      recalculatePatrolTrack();
      if (typeof updateOperationsMap === 'function') updateOperationsMap();
      if (typeof window.onSensuikanDestinationChanged === 'function') window.onSensuikanDestinationChanged(area);
      saveState();
      showToast("Área seleccionada (Tabla A1): " + area);
    }
    window.selectA1AreaManual = selectA1AreaManual;


        // =========================================================================
    // NAVAL BASES & HISTORICAL MAJOR EVENTS (SMART DYNAMIC SYNCHRONIZATION)
    // =========================================================================

    // CANONICAL BASES DEFINITION ACCORDING TO RULE [4.7]
    

function rollChartB8Interactive() {
      const yearStr = (campaignState.workflow && campaignState.workflow.selectedMonth) ? campaignState.workflow.selectedMonth.substring(0, 4) : "1942";
      let rowId = "b8-row-41-42";
      if (yearStr >= "1945") rowId = "b8-row-45";
      else if (yearStr >= "1943") rowId = "b8-row-43-44";

      const d = Math.floor(Math.random() * 6) + 1;
      let quality = "Trained";
      let desc = "Normal según tablas.";

      if (rowId === "b8-row-41-42") {
        if (d === 1) { quality = "Green"; desc = "-1 impacto de cargas en [B5]."; }
        else if (d === 6) { quality = "Veteran"; desc = "+1 impacto de cargas en [B5]."; }
      } else if (rowId === "b8-row-43-44") {
        if (d === 1) { quality = "Green"; desc = "-1 impacto en [B5]."; }
        else if (d <= 4) { quality = "Trained"; desc = "Normal."; }
        else if (d === 5) { quality = "Veteran"; desc = "+1 impacto en [B5]."; }
        else { quality = "Elite"; desc = "+1 a detección [B4] y +1 impacto en [B5]."; }
      } else {
        if (d === 1) { quality = "Green"; desc = "-1 impacto en [B5]."; }
        else if (d <= 3) { quality = "Trained"; desc = "Normal."; }
        else if (d <= 5) { quality = "Veteran"; desc = "+1 impacto en [B5]."; }
        else { quality = "Elite"; desc = "+1 a detección [B4] y +1 impacto en [B5]."; }
      }

      document.querySelectorAll('#b8-row-41-42, #b8-row-43-44, #b8-row-45').forEach(r => {
        r.style.backgroundColor = '';
        r.style.boxShadow = '';
      });
      const targetRow = document.getElementById(rowId);
      if (targetRow) {
        targetRow.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        targetRow.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.7)';
      }

      const box = document.getElementById('b8-res-box');
      if (box) {
        box.innerHTML = `🎲 <strong>1d6 = ${d}</strong> [Año ${yearStr}] ➔ Escolta: <span style="color:#fde047; font-weight:bold;">${quality}</span> (${desc})`;
      }
      showToast(`Escolta [B8]: ${quality}`);
    }

    function rollChartB9Interactive() {
      const yearStr = (campaignState.workflow && campaignState.workflow.selectedMonth) ? campaignState.workflow.selectedMonth.substring(0, 4) : "1942";
      let rowId = "b9-row-41-42";
      if (yearStr >= "1945") rowId = "b9-row-45";
      else if (yearStr >= "1943") rowId = "b9-row-43-44";

      const d = Math.floor(Math.random() * 6) + 1;
      let quality = "Trained";
      let desc = "Normal según tablas.";

      if (rowId === "b9-row-41-42") {
        if (d === 1) { quality = "Green"; desc = "-1 impacto en [B5]."; }
        else if (d === 6) { quality = "Veteran"; desc = "+1 impacto en [B5]."; }
      } else if (rowId === "b9-row-43-44") {
        if (d === 1) { quality = "Green"; desc = "-1 impacto en [B5]."; }
        else if (d <= 4) { quality = "Trained"; desc = "Normal."; }
        else if (d === 5) { quality = "Veteran"; desc = "+1 impacto en [B5]."; }
        else { quality = "Elite"; desc = "+1 impacto y 2 bajas automáticas en dotación."; }
      } else {
        if (d === 1) { quality = "Green"; desc = "-1 impacto en [B5]."; }
        else if (d <= 3) { quality = "Trained"; desc = "Normal."; }
        else if (d <= 5) { quality = "Veteran"; desc = "+1 impacto en [B5]."; }
        else { quality = "Elite"; desc = "+1 impacto y 2 bajas automáticas en dotación."; }
      }

      document.querySelectorAll('#b9-row-41-42, #b9-row-43-44, #b9-row-45').forEach(r => {
        r.style.backgroundColor = '';
        r.style.boxShadow = '';
      });
      const targetRow = document.getElementById(rowId);
      if (targetRow) {
        targetRow.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        targetRow.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.7)';
      }

      const box = document.getElementById('b9-res-box');
      if (box) {
        box.innerHTML = `🎲 <strong>1d6 = ${d}</strong> [Año ${yearStr}] ➔ Avión: <span style="color:#fde047; font-weight:bold;">${quality}</span> (${desc})`;
      }
      showToast(`Aviación [B9]: ${quality}`);
    }

    function rollChartB10Interactive() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      const rSafe = document.getElementById('b10-row-safe');
      const rDanger = document.getElementById('b10-row-danger');
      const box = document.getElementById('b10-res-box');

      if (rSafe) { rSafe.style.backgroundColor = ''; rSafe.style.boxShadow = ''; }
      if (rDanger) { rDanger.style.backgroundColor = ''; rDanger.style.boxShadow = ''; }

      if (sum <= 11) {
        if (rSafe) {
          rSafe.style.backgroundColor = 'rgba(16, 185, 129, 0.45)';
          rSafe.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.7)';
        }
        if (box) box.innerHTML = `<span style="color:#34d399;">🎲 2d6 = [${d1}+${d2} = ${sum}] ➔ ¡Fallo normal! El torpedo sigue de largo sin peligro.</span>`;
        showToast("Chart B10: Fallo normal.");
      } else {
        if (rDanger) {
          rDanger.style.backgroundColor = 'rgba(239, 68, 68, 0.55)';
          rDanger.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.9)';
        }
        const c1 = Math.floor(Math.random() * 6) + 1;
        const c2 = Math.floor(Math.random() * 6) + 1;
        const cSum = c1 + c2;
        const hit = (cSum >= 2 && cSum <= 5);
        if (box) {
          box.innerHTML = `<span style="color:#ef4444; font-weight:800;">💥 ¡GIRO CIRCULAR! [2d6 = 12]. Tirada impacto: [${c1}+${c2} = ${cSum}] ➔ ${hit ? '¡IMPACTO CONTRA PROPIO SUBMARINO! (Hundido si no es inerte)' : 'Pasa rozando sin detonar.'}</span>`;
        }
        showToast(hit ? "¡ALERTA MÁXIMA! ¡Torpedo impacta contra propio submarino!" : "Torpedo en giro pasa rozando.");
      }
    }

    function resolveEvasiveManeuversInteractive() {
      const subChoiceEl = document.getElementById('b12-sub-choice');
      if (!subChoiceEl) return;
      const subVal = parseInt(subChoiceEl.value || "1");
      const escVal = Math.floor(Math.random() * 6) + 1;

      const subDir = subVal <= 2 ? "Left" : (subVal <= 4 ? "Right" : "Straight");
      const escDir = escVal <= 2 ? "Left" : (escVal <= 4 ? "Right" : "Straight");

      const diffEl = document.getElementById('b12-rule-diff');
      const sameDirEl = document.getElementById('b12-rule-same-dir');
      const exactEl = document.getElementById('b12-rule-exact');
      const box = document.getElementById('b12-res-box');

      [diffEl, sameDirEl, exactEl].forEach(el => {
        if (el) { el.style.backgroundColor = ''; el.style.boxShadow = ''; }
      });

      let resText = "";
      if (subDir !== escDir) {
        if (diffEl) {
          diffEl.style.backgroundColor = 'rgba(16, 185, 129, 0.45)';
          diffEl.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.7)';
        }
        resText = `<span style="color:#34d399;">Rumbos distintos (Sub: ${subDir} [${subVal}], Escolta: ${escDir} [${escVal}]) ➔ ¡-1 Impacto en [B5]!</span>`;
        showToast("Evasión eficaz (-1 impacto)");
      } else if (subVal === escVal) {
        if (exactEl) {
          exactEl.style.backgroundColor = 'rgba(239, 68, 68, 0.55)';
          exactEl.style.boxShadow = '0 0 16px rgba(239, 68, 68, 0.9)';
        }
        resText = `<span style="color:#ef4444; font-weight:800;">💥 ¡COINCIDENCIA EXACTA! (Ambos ${subVal}) ➔ ¡+3 Impactos adicionales en [B5]!</span>`;
        showToast("¡Patrón exacto! +3 impactos de cargas");
      } else {
        if (sameDirEl) {
          sameDirEl.style.backgroundColor = 'rgba(245, 158, 11, 0.45)';
          sameDirEl.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.7)';
        }
        resText = `<span style="color:#fde047;">Mismo rumbo (Sub: ${subVal}, Escolta: ${escVal}) ➔ +1 Impacto adicional en [B5].</span>`;
        showToast("Mismo rumbo (+1 impacto)");
      }
      if (box) box.innerHTML = resText;
    }

    function rollChartB11Interactive() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      for (let r = 2; r <= 12; r++) {
        const row = document.getElementById('b11-row-' + r);
        if (row) {
          row.style.backgroundColor = '';
          row.style.boxShadow = '';
        }
      }

      const activeRow = document.getElementById('b11-row-' + sum);
      if (activeRow) {
        activeRow.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        activeRow.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.8)';
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const box = document.getElementById('b11-interactive-res');
      if (box) {
        box.style.display = 'block';
        box.innerHTML = `🎲 <strong>Tirada 2d6 = [${d1} + ${d2} = ${sum}]</strong> ➔ Fila ${sum} seleccionada en Tabla B11.`;
      }
      showToast(`Evento B11: Fila ${sum}`);
    }

    function rollChartK5TransitInteractive() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      const ids = ['k5-tr-2', 'k5-tr-3', 'k5-tr-4', 'k5-tr-5-6', 'k5-tr-7', 'k5-tr-8-9', 'k5-tr-10', 'k5-tr-11', 'k5-tr-12'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.backgroundColor = ''; el.style.boxShadow = ''; }
      });

      let targetId = 'k5-tr-3';
      let resDesc = "-- Sin encuentro";
      if (sum === 2) { targetId = 'k5-tr-2'; resDesc = "⚠️ ¡Avión (Aircraft) avistado!"; }
      else if (sum === 4) { targetId = 'k5-tr-4'; resDesc = "📜 Evento Kaiten (Chart K6)"; }
      else if (sum === 5 || sum === 6) { targetId = 'k5-tr-5-6'; resDesc = "-- Sin encuentro"; }
      else if (sum === 7) { targetId = 'k5-tr-7'; resDesc = "📜 Evento Kaiten (Chart K6)"; }
      else if (sum === 8 || sum === 9) { targetId = 'k5-tr-8-9'; resDesc = "-- Sin encuentro"; }
      else if (sum === 10) { targetId = 'k5-tr-10'; resDesc = "📜 Evento Kaiten (Chart K6)"; }
      else if (sum === 11) { targetId = 'k5-tr-11'; resDesc = "-- Sin encuentro"; }
      else if (sum === 12) { targetId = 'k5-tr-12'; resDesc = "📜 Evento Kaiten (Chart K6)"; }

      const row = document.getElementById(targetId);
      if (row) {
        row.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        row.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.8)';
      }

      const box = document.getElementById('k5-res-box');
      if (box) {
        box.innerHTML = `🎲 <strong>Tránsito (2d6 = [${d1}+${d2} = ${sum}]):</strong> ${resDesc}`;
      }
      showToast(`Kaiten Tránsito: 2d6=${sum}`);
    }

    function rollChartK5TargetInteractive() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      const ids = ['k5-tg-2-5', 'k5-tg-6-7', 'k5-tg-8', 'k5-tg-9', 'k5-tg-10', 'k5-tg-11', 'k5-tg-12'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.backgroundColor = ''; el.style.boxShadow = ''; }
      });

      let targetId = 'k5-tg-2-5';
      let resDesc = "1x Ship (Mercante)";
      if (sum >= 2 && sum <= 5) { targetId = 'k5-tg-2-5'; resDesc = "1x Ship (Mercante)"; }
      else if (sum === 6 || sum === 7) { targetId = 'k5-tg-6-7'; resDesc = "2x Ships (2 Mercantes)"; }
      else if (sum === 8) { targetId = 'k5-tg-8'; resDesc = "3x Ships (3 Mercantes)"; }
      else if (sum === 9) { targetId = 'k5-tg-9'; resDesc = "4x Ships (4 Mercantes)"; }
      else if (sum === 10) { targetId = 'k5-tg-10'; resDesc = "⚔️ Warship (Buque de Guerra)"; }
      else if (sum === 11) { targetId = 'k5-tg-11'; resDesc = "⚔️ 2x Warships (2 Buques de Guerra)"; }
      else if (sum === 12) { targetId = 'k5-tg-12'; resDesc = "👑 Capital Ship (Acorazado / Portaaviones)"; }

      const row = document.getElementById(targetId);
      if (row) {
        row.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        row.style.boxShadow = '0 0 12px rgba(245, 158, 11, 0.8)';
      }

      const box = document.getElementById('k5-res-box');
      if (box) {
        box.innerHTML = `🎯 <strong>Blanco (2d6 = [${d1}+${d2} = ${sum}]):</strong> ${resDesc}`;
      }
      showToast(`Kaiten Blanco: ${resDesc}`);
    }

    function rollChartK6Interactive() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      for (let r = 2; r <= 12; r++) {
        let id = 'k6-row-' + r;
        if (r === 6 || r === 8) id = 'k6-row-6-8';
        const el = document.getElementById(id);
        if (el) { el.style.backgroundColor = ''; el.style.boxShadow = ''; }
      }

      let targetId = 'k6-row-' + sum;
      if (sum === 6 || sum === 8) targetId = 'k6-row-6-8';
      const row = document.getElementById(targetId);
      if (row) {
        row.style.backgroundColor = 'rgba(217, 119, 6, 0.45)';
        row.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.8)';
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const box = document.getElementById('k6-res-box');
      if (box) {
        box.innerHTML = `🎲 <strong>Evento Kaiten K6: 2d6 = [${d1}+${d2} = ${sum}]</strong>`;
      }
      showToast(`Kaiten Evento K6: 2d6=${sum}`);
    }

    // COMPENDIUM & PHASE-SPECIFIC TABLES LOGIC
    function filterCompendium(category) {
      const secs = ['patrol', 'combat', 'targets', 'commander', 'campaign', 'midget', 'kaiten', 'floatplane', 'optional'];
      secs.forEach(s => {
        const el = document.getElementById('comp-sec-' + s);
        if (el) {
          if (category === 'all') {
            el.style.display = 'block';
          } else if (category === 'campaign') {
            el.style.display = (s === 'campaign' || s === 'optional') ? 'block' : 'none';
          } else {
            el.style.display = (category === s) ? 'block' : 'none';
          }
        }
      });

      // Actualizar estado visual de los botones de filtro
      const filterBtns = document.querySelectorAll('.comp-filter-btn');
      filterBtns.forEach(btn => {
        const f = btn.getAttribute('data-filter');
        if (f === category) {
          btn.classList.add('active');
          btn.style.filter = 'brightness(1.3)';
          btn.style.boxShadow = '0 0 12px ' + (btn.getAttribute('data-glow') || 'rgba(255,255,255,0.4)');
          btn.style.fontWeight = 'bold';
          btn.style.transform = 'scale(1.04)';
          btn.style.background = btn.getAttribute('data-active-bg') || 'var(--slate-700)';
        } else {
          btn.classList.remove('active');
          btn.style.filter = 'none';
          btn.style.boxShadow = 'none';
          btn.style.fontWeight = 'normal';
          btn.style.transform = 'scale(1)';
          btn.style.background = 'transparent';
        }
      });
    }

    function updatePhase1TableHighlight() {
      const m = campaignState.workflow.selectedMonth || "1941-12";
      const period = getA1PeriodForDate(m);
      const badge = document.getElementById('p1-active-period-badge');
      if (badge) badge.innerText = (window.currentLang === 'en' ? "Active Period: " : "Período Activo: ") + period;

      const tb = document.getElementById('phase1-a1-tbody');
      if (!tb) return;
      let html = '';
      const periods = ["1941", "1942 Jan-Jun", "1942 Jul-Dec", "1943 Jan-Jun", "1943 Jul-Dec", "1944 Jan-Jun", "1944 Jul-Dec", "1945 Jan-Jul"];
      const lastRoll = campaignState.workflow.lastA1Roll || 0;
      
      for (let r = 2; r <= 12; r++) {
        const isRolledRow = (lastRoll === r);
        const rowBg = isRolledRow ? 'background:rgba(21, 128, 61, 0.25);' : (r % 2 === 0 ? 'background:rgba(255,255,255,0.02);' : '');
        html += `<tr style="border-bottom:1px solid #334155; ${rowBg}">`;
        html += `<td style="padding:4px; font-weight:bold; color:${isRolledRow ? '#fde047' : 'var(--gold-400)'}; border:1px solid #334155; width:50px;">${r}</td>`;
        periods.forEach(p => {
          const isAct = (p === period);
          const val = CHART_A1_DATA[p][r];
          let bg = '';
          if (isAct && isRolledRow) {
            bg = 'background:#15803d; font-weight:800; color:#fff; border:2px solid #86efac; box-shadow:0 0 10px rgba(74,222,128,0.5);';
          } else if (isAct) {
            bg = 'background:rgba(30, 58, 138, 0.45); font-weight:bold; color:#fef08a;';
          } else if (isRolledRow) {
            bg = 'background:rgba(255,255,255,0.04);';
          }
          const clickFn = isAct ? `onclick="selectA1AreaManual('${val}', ${r})"` : '';
          const cursor = isAct ? 'cursor:pointer;' : '';
          html += `<td ${clickFn} class="${isAct ? 'a1-clickable-cell' : ''}" style="padding:5px 4px; border:1px solid #334155; font-size:0.72rem; ${cursor} ${bg}" title="${isAct ? 'Clic para seleccionar ésta área (Regla 7.14)' : 'Período inactivo'}">${val}</td>`;
        });
        html += `</tr>`;
      }
      tb.innerHTML = html;
    }

    function updatePhase2TableDisplay() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      const base = campaignState.workflow.startingBase || "Yokosuka";

      const badge = document.getElementById('p2-current-zone-badge');
      const thZone = document.getElementById('th-p2-zone-name');
      const tb = document.getElementById('phase2-a3-tbody');

      const a3MainContainer = document.getElementById('p2-a3-main-container');
      if (idx === -1) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        return;
      }

      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");

      const specKey = (typeof getAssignedSpecialMissionKeySafe === 'function') 
        ? getAssignedSpecialMissionKeySafe() 
        : ((typeof getCurrentAssignedMissionKey === 'function') ? getCurrentAssignedMissionKey() : null);

      const noA3Needed = isSpecialBox && (specKey === 'recon' || specKey === 'midget' || specKey === 'bombing' || specKey === 'kaiten');
      if (noA3Needed) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        return;
      }

      if (a3MainContainer) a3MainContainer.style.display = 'block';

      if (isSpecialBox && (specKey === 'transport' || specKey === 'minelaying' || specKey === 'passenger' || specKey === 'evacuation' || specKey === 'shore_bombardment' || specKey === 'yanagi')) {
        campaignState.workflow.useA3SpecialMissionColumn = true;
      }

      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const mappedAreaZone = mapA1ToA3Zone(assignedArea);
      const useSpecialCol = !!(isSpecialBox && campaignState.workflow.useA3SpecialMissionColumn);
      const targetZone = isTransit ? "Transit" : (useSpecialCol ? "Special Mission" : mappedAreaZone);
      const zoneLabel = isEn
        ? (targetZone === "Special Mission" ? "Special Mission" : targetZone)
        : (targetZone === "Transit" ? "Tránsito" : targetZone === "Special Mission" ? "Misión Especial" : targetZone);

      if (badge) {
        if (isSpecialBox) {
          badge.innerHTML = `${isEn ? "Zone: " : "Zona: "}<strong>${zoneLabel}</strong> <span style="font-size:0.72rem; color:#fde047; margin-left:4px;">(⭐ ${isEn ? 'Special Mission' : 'Misión Especial'})</span>`;
        } else {
          badge.innerText = (isEn ? "Current Zone: " : "Zona Actual: ") + zoneLabel;
        }
      }
      if (thZone) thZone.innerText = (isEn ? "Encounter in " : "Encuentro en ") + zoneLabel;

      const toggleContainer = document.getElementById('p2-zone-toggle-btn-container');
      if (toggleContainer) {
        if (isSpecialBox) {
          const btnText = useSpecialCol
            ? (isEn ? `⚓ View Area Chart (${mappedAreaZone})` : `⚓ Ver Tabla de Área (${mappedAreaZone})`)
            : (isEn ? `🎯 View Special Mission Col [A3]` : `🎯 Ver Columna Misión Especial [A3]`);
          toggleContainer.innerHTML = `<button type="button" onclick="toggleSpecialMissionA3View()" class="action-btn" style="padding:4px 8px; font-size:0.75rem; border-color:#38bdf8; background:rgba(2,132,199,0.25); color:#7dd3fc; cursor:pointer;" title="${isEn ? 'Toggle between Area chart and Special Mission column' : 'Alternar entre Tabla del Área y Columna de Misión Especial'}">${btnText}</button>`;
        } else {
          toggleContainer.innerHTML = '';
        }
      }

      if (!tb) return;
      const zoneRow = CHART_A3_DATA[targetZone] || CHART_A3_DATA["Transit"];
      const lastRoll = campaignState.workflow.lastA3Roll || 0;
      let html = '';
      for (let r = 2; r <= 12; r++) {
        const val = zoneRow[r] || "--";
        const displayVal = translatePhase2Encounter(val, isEn);
        const isRolled = (lastRoll === r);
        let effect = isEn ? "No contact in this sector." : "Sin contacto en este sector.";
        let c = "#94a3b8";
        if (r === 12) effect = isEn ? "★ 1st 12: Random Event [B11] | 2nd 12: " + displayVal : "★ 1.er 12: Suceso Aleatorio [B11] | 2.º 12: " + displayVal;
        else if (val.includes("Aircraft")) { effect = isEn ? "✈️ Enemy aircraft. Crash Dive [A4] or AA [A2]." : "✈️ Avión enemigo. Inmersión [A4] o AA [A2]."; c = "#f87171"; }
        else if (val.includes("Minefield")) { effect = isEn ? "💥 Danger: submarine sunk on 2-5." : "💥 Peligro: 2-5 Submarino Hundido."; c = "#f87171"; }
        else if (val.includes("(R)")) { effect = isEn ? "📡 If equipped with radar, roll again!" : "📡 Si equipas radar, ¡tira de nuevo!"; c = "var(--gold-300)"; }
        else if (val !== "--") { effect = isEn ? "🎯 Naval contact. Proceed to Combat (Phase 3)." : "🎯 Contacto Naval. Pasa a Combate (Fase 3)."; c = "#93c5fd"; }

        const rowBg = isRolled ? 'background:#15803d; color:#fff;' : (r % 2 === 0 ? 'background:rgba(255,255,255,0.02);' : '');
        html += `<tr onclick="rollBoxEncounter(${r})" style="border-bottom:1px solid #334155; cursor:pointer; ${rowBg}" title="${isEn ? 'Click to apply 2d6 = ' + r : 'Clic para aplicar tirada 2d6 = ' + r}">`;
        html += `<td style="padding:5px 4px; font-weight:bold; color:${isRolled ? '#fde047' : 'var(--gold-400)'}; border:1px solid #334155; width:80px;">2d6 = ${r}</td>`;
        html += `<td style="padding:5px 4px; border:1px solid #334155; font-weight:bold; color:${isRolled ? '#fff' : c};">${displayVal}</td>`;
        html += `<td style="padding:5px 4px; border:1px solid #334155; font-size:0.72rem; color:${isRolled ? '#f1f5f9' : 'var(--slate-300)'}; text-align:left;">${effect}</td>`;
        html += `</tr>`;
      }
      tb.innerHTML = html;
    }

    function translatePhase2Encounter(value, isEn) {
      const translations = {
        'Minefield': 'Campo de Minas',
        'Warship': 'Buque de Guerra',
        'Ship': 'Buque',
        'Ship+Escort': 'Buque + Escolta',
        'Convoy': 'Convoy',
        'Aircraft': 'Aeronave',
        'Special Mission': 'Misión Especial'
      };
      if (isEn) return value;
      return Object.keys(translations).reduce((text, key) => text.split(key).join(translations[key]), value);
    }

    const A3_CELL_TRANSLATIONS = {
      "Aircraft *": { en: "Aircraft *", es: "Avión *" },
      "Aircraft": { en: "Aircraft", es: "Avión" },
      "Capital Ship": { en: "Capital Ship", es: "Buque Capital" },
      "Ship + Escort *": { en: "Ship + Escort *", es: "Mercante + Escolta *" },
      "Ship + Escort": { en: "Ship + Escort", es: "Mercante + Escolta" },
      "Ship+Escort": { en: "Ship + Escort", es: "Mercante + Escolta" },
      "Two Ships + Escort": { en: "Two Ships + Escort", es: "2 Mercantes + Escolta" },
      "Warship *": { en: "Warship *", es: "Buque de Guerra *" },
      "Warship": { en: "Warship", es: "Buque de Guerra" },
      "Ship *": { en: "Ship *", es: "Mercante *" },
      "Ship*": { en: "Ship *", es: "Mercante *" },
      "Ship": { en: "Ship", es: "Mercante" },
      "Convoy": { en: "Convoy", es: "Convoy" },
      "Sub Lost": { en: "Sub Lost", es: "Submarino Perdido" },
      "Minefield *": { en: "Minefield *", es: "Campo de Minas *" },
      "Minefield": { en: "Minefield", es: "Campo de Minas" },
      "Escort": { en: "Escort", es: "Escolta" },
      "-- (R)": { en: "-- (R)", es: "-- (R)" },
      "--": { en: "--", es: "--" }
    };

    const A3_COL_HEADERS = {
      'comp-a3-th-transit': { en: "Transit", es: "Tránsito" },
      'comp-a3-th-wcoast': { en: "W. Coast /<br>Ind. Ocean", es: "Costa O. /<br>Índico" },
      'comp-a3-th-phil': { en: "Phil. /<br>Aleutians", es: "Filip. /<br>Aleutianas" },
      'comp-a3-th-midway': { en: "Midway", es: "Midway" },
      'comp-a3-th-marianas': { en: "Marianas /<br>Australia", es: "Marianas /<br>Australia" },
      'comp-a3-th-pearl': { en: "Pearl<br>Harbor", es: "Pearl<br>Harbor" },
      'comp-a3-th-guinea': { en: "New Guinea /<br>Guadalcanal", es: "N. Guinea /<br>Guadalcanal" },
      'comp-a3-th-okinawa': { en: "Okinawa /<br>Iwo Jima", es: "Okinawa /<br>Iwo Jima" },
      'comp-a3-th-tarawa': { en: "Tarawa<br>(Marshalls)", es: "Tarawa<br>(Marshall)" },
      'comp-a3-th-dei': { en: "DEI /<br>Malaya", es: "Indias Or. /<br>Malasia" },
      'comp-a3-th-spec': { en: "Special<br>Mission", es: "Misión<br>Especial" },
      'comp-a3-th-mine': { en: "Minefield", es: "Campo de<br>Minas" }
    };

    function renderCompendiumA3Table(isEn) {
      if (typeof isEn === 'undefined') isEn = (window.currentLang === 'en');
      const titleEl = document.getElementById('comp-a3-main-title');
      if (titleEl) {
        titleEl.innerText = isEn ? "CHART A3: ENCOUNTER CHART (2d6 - 10 ZONES, TRANSIT, SPECIAL MISSION & MINEFIELD)" : "TABLA A3: TABLA DE ENCUENTROS (2d6 - 10 ZONAS, TRÁNSITO, MISIÓN ESPECIAL Y MINAS)";
      }
      Object.entries(A3_COL_HEADERS).forEach(([id, labels]) => {
        const th = document.getElementById(id);
        if (th) th.innerHTML = isEn ? labels.en : labels.es;
      });

      const tbA3 = document.getElementById('table-comp-a3-body');
      if (!tbA3) return;
      const zones = ["Transit", "W. Coast/Indian Ocean", "Philippines/Aleutians", "Midway", "Marianas / Australia", "Pearl Harbor", "New Guinea/Guadalcanal", "Okinawa/Iwo Jima", "Tarawa (Marshalls)", "Dutch East Indies/Malaya", "Special Mission", "Minefield"];
      let html = '';
      for (let r = 2; r <= 12; r++) {
        html += `<tr style="border-bottom:1px solid #334155; ${r%2===0?'background:rgba(255,255,255,0.02);':''}">`;
        html += `<td style="padding:4px; font-weight:bold; color:var(--gold-400); border:1px solid #334155;">${r}</td>`;
        zones.forEach(z => {
          const rawVal = (CHART_A3_DATA[z] && CHART_A3_DATA[z][r]) ? CHART_A3_DATA[z][r] : "--";
          const val = (A3_CELL_TRANSLATIONS[rawVal] && A3_CELL_TRANSLATIONS[rawVal][isEn ? 'en' : 'es']) || rawVal;
          let c = "#94a3b8";
          if (rawVal.includes("Capital") || rawVal.includes("Convoy")) c = "var(--gold-300); font-weight:bold";
          else if (rawVal.includes("Aircraft") || rawVal.includes("Minefield") || rawVal.includes("Lost")) c = "#f87171; font-weight:bold";
          else if (rawVal.includes("Ship") || rawVal.includes("Warship")) c = "#93c5fd; font-weight:bold";
          html += `<td style="padding:4px; border:1px solid #334155; font-size:0.68rem; color:${c};">${val}</td>`;
        });
        html += `</tr>`;
      }
      tbA3.innerHTML = html;
    }
    window.renderCompendiumA3Table = renderCompendiumA3Table;

    function toggleSpecialMissionA3View() {
      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.useA3SpecialMissionColumn = !campaignState.workflow.useA3SpecialMissionColumn;
      if (typeof updatePhase2TableDisplay === 'function') updatePhase2TableDisplay();
      if (typeof updateBoxDisplay === 'function') updateBoxDisplay();
      if (typeof saveState === 'function') saveState();
    }
    window.toggleSpecialMissionA3View = toggleSpecialMissionA3View;

    function populateMasterCompendiumTables() {
      // Populate A1 in Compendium
      const tbA1 = document.getElementById('table-comp-a1-body');
      if (tbA1) {
        let html = '';
        const periods = ["1941", "1942 Jan-Jun", "1942 Jul-Dec", "1943 Jan-Jun", "1943 Jul-Dec", "1944 Jan-Jun", "1944 Jul-Dec", "1945 Jan-Jul"];
        for (let r = 2; r <= 12; r++) {
          html += `<tr style="border-bottom:1px solid #334155; ${r%2===0?'background:rgba(255,255,255,0.02);':''}">`;
          html += `<td style="padding:4px; font-weight:bold; color:var(--gold-400); border:1px solid #334155;">${r}</td>`;
          periods.forEach(p => {
            html += `<td style="padding:4px; border:1px solid #334155; font-size:0.72rem;">${CHART_A1_DATA[p][r]}</td>`;
          });
          html += `</tr>`;
        }
        tbA1.innerHTML = html;
      }

      // Populate A3 in Compendium
      renderCompendiumA3Table(window.currentLang === 'en');

      // Populate H2 Surnames in Phase 0 & Compendium
      const renderH2SurTable = (tbodyId, isP0) => {
        const tb = document.getElementById(tbodyId);
        if (!tb) return;
        let html = '';
        for (let r = 1; r <= 6; r++) {
          html += '<tr style="border-bottom:1px solid #334155;">';
          for (let c = 1; c <= 6; c++) {
            const k = `${c}-${r}`;
            const name = CHART_H2_SURNAMES[k] || '--';
            const cellId = isP0 ? `p0-h2-sur-${k}` : `comp-h2-sur-${k}`;
            const clickAttr = isP0 ? `onclick="pickH2Surname('${k}', '${name}')" title="Clic para elegir este apellido"` : '';
            const cursor = isP0 ? 'cursor:pointer;' : '';
            html += `<td id="${cellId}" class="h2-cell" ${clickAttr} style="padding:4px 6px; border:1px solid #334155; ${cursor} transition:all 0.2s;"><span style="color:var(--slate-400); font-size:0.68rem; font-weight:bold;">${k}</span> <strong>${name}</strong></td>`;
          }
          html += '</tr>';
        }
        tb.innerHTML = html;
      };

      const renderH2FirstTable = (tbodyId, isP0) => {
        const tb = document.getElementById(tbodyId);
        if (!tb) return;
        let html = '';
        for (let r = 1; r <= 6; r++) {
          html += '<tr style="border-bottom:1px solid #334155;">';
          for (let c = 1; c <= 6; c++) {
            const k = `${c}-${r}`;
            const name = CHART_H2_FIRSTNAMES[k] || '--';
            const cellId = isP0 ? `p0-h2-first-${k}` : `comp-h2-first-${k}`;
            const clickAttr = isP0 ? `onclick="pickH2FirstName('${k}', '${name}')" title="Clic para elegir este nombre"` : '';
            const cursor = isP0 ? 'cursor:pointer;' : '';
            html += `<td id="${cellId}" class="h2-cell" ${clickAttr} style="padding:4px 6px; border:1px solid #334155; ${cursor} transition:all 0.2s;"><span style="color:var(--slate-400); font-size:0.68rem; font-weight:bold;">${k}</span> <strong>${name}</strong></td>`;
          }
          html += '</tr>';
        }
        tb.innerHTML = html;
      };

      renderH2SurTable('table-p0-h2-sur-body', true);
      renderH2SurTable('table-comp-h2-sur-body', false);
      renderH2FirstTable('table-p0-h2-first-body', true);
      renderH2FirstTable('table-comp-h2-first-body', false);

      // Restore active highlights if present
      if (campaignState.workflow.h2SurKey || campaignState.workflow.h2FirstKey) {
        highlightH2Cells(campaignState.workflow.h2SurKey, campaignState.workflow.h2FirstKey);
      }

      // Populate Charts T1, T2, T3, T5 dynamically from data tables (reduces ~1,300 lines of repetitive HTML)
      const renderTargetGrid = (gridId, data, chartId) => {
        const el = document.getElementById(gridId);
        if (!el || !data) return;
        const keys = Object.keys(data).sort((a,b) => parseInt(a) - parseInt(b));
        let html = '';
        keys.forEach(k => {
          const item = data[k];
          const numStr = String(k).padStart(2, '0');
          let extra = '';
          if (item.is_tanker) extra = ' <span class="badge" style="background:#dc2626; color:#fff; font-size:0.6rem; padding:1px 3px; border-radius:2px;">T</span>';
          if (item.is_sub) extra = ' <span class="badge" style="background:#0284c7; color:#fff; font-size:0.6rem; padding:1px 3px; border-radius:2px;">SUB</span>';
          if (item.escort) extra = ' <span style="color:#f87171; font-size:0.65rem;">+Escort</span>';
          
          let numColor = "var(--gold-400)";
          if (chartId === 't3') numColor = "#f87171";
          if (chartId === 't5') numColor = "#2dd4bf";

          html += `<div id="comp-t-row-${chartId}-${k}" class="comp-t-row-${chartId}" style="display:flex; justify-content:space-between; align-items:center; padding:3px 8px; border-radius:4px; font-size:0.75rem; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02);">
            <span><strong style="color:${numColor};">${numStr}</strong>. ${item.name}${extra}</span>
            <span style="color:var(--slate-400); font-family:monospace;">${item.tonnage ? item.tonnage.toLocaleString() + ' t' : ''}</span>
          </div>`;
        });
        el.innerHTML = html;
      };

      if (typeof CHART_T1_DATA !== 'undefined') renderTargetGrid('comp-grid-t1', CHART_T1_DATA, 't1');
      if (typeof CHART_T2_DATA !== 'undefined') renderTargetGrid('comp-grid-t2', CHART_T2_DATA, 't2');
      if (typeof CHART_T3_DATA !== 'undefined') renderTargetGrid('comp-grid-t3', CHART_T3_DATA, 't3');
      if (typeof CHART_T5_DATA !== 'undefined') renderTargetGrid('comp-grid-t5', CHART_T5_DATA, 't5');
      if (typeof CHART_T4_DATA !== 'undefined') renderAllChartT4Tables('all');

      updatePhase1TableHighlight();
      updatePhase2TableDisplay();
    }

    function rollInteractiveA3Direct() {
      const z = document.getElementById('select-test-a3-zone').value;
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const res = (CHART_A3_DATA[z] && CHART_A3_DATA[z][sum]) || "--";
      const el = document.getElementById('test-a3-direct-res');
      el.style.display = "block";
      el.innerHTML = `Zona: <strong>${z}</strong> | Tirada 2d6: <strong>${sum}</strong> (${d1}+${d2}) -> Contacto: <span style="color:var(--gold-300);">${res}</span>`;
    }

    function testA1RollModal() {
      rollPatrolAssignment();
      switchTab('workflow');
    }

    function showTargetChartTab(code) {
      const isEn = (window.currentLang === 'en');
      const el = document.getElementById('p3-target-chart-viewer');
      if (!el) return;
      let html = '';
      if (code === 'T1') {
        html = isEn 
          ? '<div style="margin-bottom:6px; color:var(--gold-300); font-weight:bold;">CHART T1: SMALL FREIGHTERS (1d100) — Click to select target:</div>'
          : '<div style="margin-bottom:6px; color:var(--gold-300); font-weight:bold;">CHART T1: CARGUEROS PEQUEÑOS (1d100) — Clic para fijar blanco:</div>';
        html += '<table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">';
        html += isEn
          ? '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d100</th><th style="padding:3px;">Ship Name</th><th style="padding:3px; width:80px; text-align:right;">Tonnage</th></tr>'
          : '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d100</th><th style="padding:3px;">Nombre del Buque</th><th style="padding:3px; width:80px; text-align:right;">Tonelaje</th></tr>';
        for (let i = 1; i <= 100; i++) {
          const item = CHART_T1_DATA[String(i)];
          if (item) {
            html += `<tr onclick="selectCombatTargetFromChart('T1', '${item.name}', ${item.tonnage}, 'Freighter', false, 2, false)" style="cursor:pointer; border-bottom:1px solid #334155;" class="target-row-hover"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">${i}</td><td style="padding:3px;">${item.name}</td><td style="padding:3px; text-align:right;">${item.tonnage.toLocaleString()} t</td></tr>`;
          }
        }
        html += '</table>';
      } else if (code === 'T2') {
        html = isEn
          ? '<div style="margin-bottom:6px; color:var(--gold-300); font-weight:bold;">CHART T2: TANKERS & LARGE FREIGHTERS (1d100) — Click to select target:</div>'
          : '<div style="margin-bottom:6px; color:var(--gold-300); font-weight:bold;">CHART T2: PETROLEROS Y GRANDES CARGUEROS (1d100) — Clic para fijar blanco:</div>';
        html += '<table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">';
        html += isEn
          ? '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d100</th><th style="padding:3px;">Ship Name</th><th style="padding:3px; width:80px; text-align:right;">Tonnage</th></tr>'
          : '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d100</th><th style="padding:3px;">Nombre del Buque</th><th style="padding:3px; width:80px; text-align:right;">Tonelaje</th></tr>';
        for (let i = 1; i <= 100; i++) {
          const item = CHART_T2_DATA[String(i)];
          if (item) {
            html += `<tr onclick="selectCombatTargetFromChart('T2', '${item.name}', ${item.tonnage}, 'Large Freighter/Tanker', false, 3, false)" style="cursor:pointer; border-bottom:1px solid #334155;" class="target-row-hover"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">${i}</td><td style="padding:3px;">${item.name}</td><td style="padding:3px; text-align:right;">${item.tonnage.toLocaleString()} t</td></tr>`;
          }
        }
        html += '</table>';
      } else if (code === 'T3') {
        html = isEn
          ? '<div style="margin-bottom:6px; color:#fca5a5; font-weight:bold;">CHART T3: U.S. WARSHIP TARGETS (1d100) — Click to select target:</div>'
          : '<div style="margin-bottom:6px; color:#fca5a5; font-weight:bold;">CHART T3: BUQUES DE GUERRA EE.UU. (1d100) — Clic para fijar:</div>';
        html += '<table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">';
        html += isEn
          ? '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d100</th><th style="padding:3px;">Name</th><th style="padding:3px; width:80px; text-align:right;">Tonnage</th><th style="padding:3px; width:70px; text-align:center;">Type</th></tr>'
          : '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d100</th><th style="padding:3px;">Nombre</th><th style="padding:3px; width:80px; text-align:right;">Tonelaje</th><th style="padding:3px; width:70px; text-align:center;">Tipo</th></tr>';
        for (let i = 1; i <= 100; i++) {
          const item = CHART_T3_DATA[String(i)];
          if (item) {
            const subBadge = item.is_sub ? '<span style="color:#f87171; font-weight:bold;">Submarino</span>' : '<span style="color:#94a3b8;">Superficie</span>';
            html += `<tr onclick="selectCombatTargetFromChart('T3', '${item.name}', ${item.tonnage}, 'Warship', ${item.is_sub}, 2, false)" style="cursor:pointer; border-bottom:1px solid #334155;" class="target-row-hover"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">${i}</td><td style="padding:3px; color:#f1f5f9;">${item.name}</td><td style="padding:3px; text-align:right;">${item.tonnage.toLocaleString()} t</td><td style="padding:3px; text-align:center;">${subBadge}</td></tr>`;
          }
        }
        html += '</table>';
      } else if (code === 'T4') {
        html = isEn
          ? '<div style="margin-bottom:6px; color:#f3e8ff; font-weight:bold;">CHART T4: CAPITAL SHIPS (BATTLESHIPS & CARRIERS) — Click to select:</div>'
          : '<div style="margin-bottom:6px; color:#f3e8ff; font-weight:bold;">CHART T4: BUQUES CAPITALES (ACORAZADOS Y PORTAAVIONES) — Clic para fijar:</div>';
        html += isEn
          ? '<div style="font-size:0.7rem; color:var(--slate-400); margin-bottom:6px;">Legend: No dots = 5 pts to sink | 1 dot = 6 pts | 2 dots = 7 pts | Arrow = Fast Capital Ship (+1 To-Hit).</div>'
          : '<div style="font-size:0.7rem; color:var(--slate-400); margin-bottom:6px;">Leyenda: Sin puntos = 5 pts para hundir | 1 punto = 6 pts | 2 puntos = 7 pts | Flecha = Buque Capital Rápido (+1 To-Hit).</div>';
        const subCats = [
          { key: "1941_US", label: "1941 U.S. Ships (1d10)" },
          { key: "1941_UK", label: "1941 U.K. Ships (1d6)" },
          { key: "1942_US", label: "1942 U.S. Ships (1d10)" },
          { key: "1942_UK", label: "1942 U.K. Ships (1d6)" },
          { key: "1943_45_US", label: "1943-45 U.S. Ships (1d20)" }
        ];
        subCats.forEach(sc => {
          html += `<div style="background:rgba(124,58,237,0.2); padding:4px 8px; border-radius:4px; font-weight:bold; color:#c084fc; margin-top:6px;">${sc.label}</div>`;
          html += '<table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left; margin-bottom:6px;">';
          html += '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:2px; width:30px;">#</th><th style="padding:2px;">Nombre</th><th style="padding:2px; width:70px; text-align:right;">Tonelaje</th><th style="padding:2px; width:65px; text-align:center;">Pts Casco</th><th style="padding:2px; width:60px; text-align:center;">Rápido</th></tr>';
          const items = CHART_T4_DATA[sc.key] || {};
          Object.keys(items).forEach(k => {
            const ship = items[k];
            const fastTxt = ship.fast ? '<span style="color:#fde047; font-weight:bold;">⚡ Fast</span>' : '<span style="color:#64748b;">No</span>';
            html += `<tr onclick="selectCombatTargetFromChart('T4', '${ship.name}', ${ship.tonnage}, 'Capital Ship', false, ${ship.pts_to_sink}, ${ship.fast})" style="cursor:pointer; border-bottom:1px solid #334155;" class="target-row-hover"><td style="padding:2px; font-weight:bold; color:var(--gold-400);">${k}</td><td style="padding:2px; color:#f1f5f9;">${ship.name}</td><td style="padding:2px; text-align:right;">${ship.tonnage.toLocaleString()} t</td><td style="padding:2px; text-align:center; color:#f87171; font-weight:bold;">${ship.pts_to_sink} pts</td><td style="padding:2px; text-align:center;">${fastTxt}</td></tr>`;
          });
          html += '</table>';
        });
      } else if (code === 'T5') {
        html = isEn
          ? '<div style="margin-bottom:6px; color:#99f6e4; font-weight:bold;">CHART T5: COMMONWEALTH WARSHIPS (1d20) — Click to select target:</div>'
          : '<div style="margin-bottom:6px; color:#99f6e4; font-weight:bold;">CHART T5: BUQUES DE GUERRA COMMONWEALTH (1d20) — Clic para fijar blanco:</div>';
        html += '<table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">';
        html += isEn
          ? '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d20</th><th style="padding:3px;">Name</th><th style="padding:3px; width:80px; text-align:right;">Tonnage</th><th style="padding:3px; width:70px; text-align:center;">Type</th></tr>'
          : '<tr style="background:var(--navy-900); color:var(--gold-400);"><th style="padding:3px; width:45px;">1d20</th><th style="padding:3px;">Nombre</th><th style="padding:3px; width:80px; text-align:right;">Tonelaje</th><th style="padding:3px; width:70px; text-align:center;">Tipo</th></tr>';
        for (let i = 1; i <= 20; i++) {
          const item = CHART_T5_DATA[String(i)];
          if (item) {
            const subBadge = item.is_sub ? '<span style="color:#f87171; font-weight:bold;">Submarino</span>' : '<span style="color:#94a3b8;">Superficie</span>';
            html += `<tr onclick="selectCombatTargetFromChart('T5', '${item.name}', ${item.tonnage}, 'CW Warship', ${item.is_sub}, 2, false)" style="cursor:pointer; border-bottom:1px solid #334155;" class="target-row-hover"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">${i}</td><td style="padding:3px; color:#f1f5f9;">${item.name}</td><td style="padding:3px; text-align:right;">${item.tonnage.toLocaleString()} t</td><td style="padding:3px; text-align:center;">${subBadge}</td></tr>`;
          }
        }
        html += '</table>';
      }
      el.innerHTML = html;
    }

    function selectCombatTargetFromChart(chart, name, tonnage, type, isSub, ptsToSink, isFast) {
      const isEn = (window.currentLang === 'en');
      campaignState.workflow.currentTarget = {
        name: name,
        tons: tonnage,
        type: type,
        is_sub: isSub,
        pts_to_sink: ptsToSink,
        fast: isFast,
        chart: chart
      };
      document.getElementById('wf-target-name').innerText = `${name} (${type})`;
      const fastBadge = isFast ? (isEn ? " • ⚡ Fast Capital Ship" : " • ⚡ Buque Capital Rápido") : "";
      const subBadge = isSub ? (isEn ? " • Submarine" : " • Submarino") : "";
      const ptsLabel = isEn ? "Hull Pts" : "Pts Casco";
      document.getElementById('wf-target-sub').innerText = `${tonnage.toLocaleString()} tons • ${ptsLabel}: ${ptsToSink}${fastBadge}${subBadge} • Chart ${chart}`;
      saveState();
      showToast(isEn ? `Target selected from ${chart}: ${name} (${tonnage.toLocaleString()} t)` : `Blanco asignado desde ${chart}: ${name} (${tonnage.toLocaleString()} t)`);
    }


    function testA3RollModal() {
      rollInteractiveA3Direct();
    }

    function triggerEncounterToCombat() {
      rollTargetGeneration();
      setWorkflowPhase(3);
    }

    // Phase 3: Tactical Combat functions
    // =========================================================================
    // OFFICIAL CHARTS T1 & T2: TARGET SHIP DATABASES (1d100)
    // =========================================================================
        
    function rollChartT1(manualVal) {
      const d100 = (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 100)
        ? manualVal
        : (Math.floor(Math.random() * 100) + 1);
      const target = CHART_T1_DATA[d100] || CHART_T1_DATA[String(d100)] || { name: "Merchant", tonnage: 4500 };
      const res = {
        chart: "T1",
        roll: d100,
        roll100: d100,
        name: target.name,
        tons: target.tonnage,
        type: "Freighter",
        isSub: false,
        isTanker: false,
        escort: false
      };
      applyTargetToWorkflow(res);
      highlightCompendiumTarget('t1', d100);
      showToast(`🎲 Chart T1: 1d100 = [${d100}] ➔ ${target.name} (${target.tonnage.toLocaleString()} t)`);
      return res;
    }

    function rollChartT2(manualVal) {
      const d100 = (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 100)
        ? manualVal
        : (Math.floor(Math.random() * 100) + 1);
      const target = CHART_T2_DATA[d100] || CHART_T2_DATA[String(d100)] || { name: "Escorted Freighter", tonnage: 6000, is_tanker: false };
      const res = {
        chart: "T2",
        roll: d100,
        roll100: d100,
        name: target.name,
        tons: target.tonnage,
        type: target.is_tanker ? "Tanker" : "Freighter",
        isSub: false,
        isTanker: target.is_tanker,
        escort: true
      };
      applyTargetToWorkflow(res);
      highlightCompendiumTarget('t2', d100);
      showToast(`🎲 Chart T2: 1d100 = [${d100}] ➔ ${target.name} (${target.tonnage.toLocaleString()} t)`);
      return res;
    }

            
    function rollChartT3(manualVal) {
      const d100 = (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 100)
        ? manualVal
        : (Math.floor(Math.random() * 100) + 1);
      const target = CHART_T3_DATA[d100] || CHART_T3_DATA[String(d100)] || { name: "Destroyer", tonnage: 1800, is_sub: false };
      const res = {
        chart: "T3",
        roll: d100,
        roll100: d100,
        name: target.name,
        tons: target.tonnage,
        type: target.is_sub ? "Submarine" : "Warship",
        isSub: target.is_sub,
        isTanker: false,
        escort: true
      };
      applyTargetToWorkflow(res);
      highlightCompendiumTarget('t3', d100);
      showToast(`🎲 Chart T3: 1d100 = [${d100}] ➔ ${target.name} (${target.tonnage.toLocaleString()} t)`);
      return res;
    }

    
    // =========================================================================
    // CHART T4: CAPITAL SHIPS TABLES RENDERER (CON TONELAJE Y PUNTOS DE DAÑO)
    // =========================================================================
    let currentT4Tab = 'all';

    function renderChartT4TableBlock(key, title, dataDict) {
      const keys = Object.keys(dataDict).sort((a,b) => parseInt(a) - parseInt(b));
      let rowsHtml = '';
      keys.forEach(k => {
        const item = dataDict[k];
        const name = item.name || '';
        const parts = name.split(' ');
        const stype = parts[0] || 'BB';
        const sname = parts.slice(1).join(' ') || name;

        let typeBadge = '<span style="background:#1e3a8a; color:#93c5fd; font-weight:bold; padding:1px 5px; border-radius:3px; font-size:0.65rem;">BB</span>';
        if (stype === 'CV') {
          typeBadge = '<span style="background:#701a75; color:#f5d0fe; font-weight:bold; padding:1px 5px; border-radius:3px; font-size:0.65rem;">CV</span>';
        } else if (stype === 'CVL') {
          typeBadge = '<span style="background:#4c1d95; color:#ddd6fe; font-weight:bold; padding:1px 5px; border-radius:3px; font-size:0.65rem;">CVL</span>';
        } else if (stype === 'CVE') {
          typeBadge = '<span style="background:#312e81; color:#c7d2fe; font-weight:bold; padding:1px 5px; border-radius:3px; font-size:0.65rem;">CVE</span>';
        }

        const isEn = (window.currentLang === 'en');
        const fastBadge = item.fast 
          ? `<span style="color:#38bdf8; font-weight:bold; font-size:0.68rem;" title="${isEn ? 'Fast Capital Ship' : 'Buque Capital Rápido'}">➡ ${isEn ? 'Fast' : 'Rápido'}</span>` 
          : '<span style="color:#64748b; font-size:0.65rem;">—</span>';

        const pts = item.pts_to_sink || 6;
        const ptsBadge = `<span style="background:#1e293b; color:#cbd5e1; padding:1px 5px; border-radius:3px; font-size:0.68rem; border:1px solid #475569;">${pts} pts</span>`;

        const tonStr = (item.tonnage || 0).toLocaleString() + ' t';

        rowsHtml += `
          <tr id="t4-row-${key}-${k}" class="t4-table-row" style="border-bottom:1px solid #334155; transition:background 0.3s ease;">
            <td style="padding:4px 6px; font-weight:bold; color:var(--gold-400); text-align:center; width:30px;">${k}</td>
            <td style="padding:4px 6px; width:48px; text-align:center;">${typeBadge}</td>
            <td style="padding:4px 6px; font-weight:600; color:#f8fafc;">${sname}</td>
            <td style="padding:4px 6px; font-weight:bold; color:#fde047; text-align:right; width:75px;">${tonStr}</td>
            <td style="padding:4px 6px; text-align:center; width:55px;">${ptsBadge}</td>
            <td style="padding:4px 6px; text-align:center; width:55px;">${fastBadge}</td>
          </tr>
        `;
      });

      const isEn = (window.currentLang === 'en');
      return `
        <div id="t4-block-${key}" class="t4-era-block" style="background:#0f172a; border:1px solid #4c1d95; border-radius:6px; overflow:hidden; margin-bottom:12px;">
          <div style="background:linear-gradient(90deg, #581c87, #3b0764); padding:5px 10px; font-weight:bold; color:#e9d5ff; font-size:0.75rem; display:flex; justify-content:space-between; align-items:center;">
            <span>⚓ ${title}</span>
            <span style="font-size:0.68rem; color:#d8b4fe;">${keys.length} ${isEn ? 'Official Ships' : 'Buques Oficiales'}</span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">
            <thead>
              <tr style="background:#1e293b; color:#94a3b8; font-size:0.67rem; border-bottom:2px solid #334155;">
                <th style="padding:4px 6px; text-align:center; width:30px;">${isEn ? 'Die' : 'Dado'}</th>
                <th style="padding:4px 6px; text-align:center; width:48px;">${isEn ? 'Type' : 'Tipo'}</th>
                <th style="padding:4px 6px;">${isEn ? 'Capital Ship' : 'Buque Capital'}</th>
                <th style="padding:4px 6px; text-align:right; width:75px;">${isEn ? 'Tonnage' : 'Tonelaje'}</th>
                <th style="padding:4px 6px; text-align:center; width:55px;">${isEn ? 'Sink' : 'Hundir'}</th>
                <th style="padding:4px 6px; text-align:center; width:55px;">${isEn ? 'Speed' : 'Veloc.'}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      `;
    }

    function renderAllChartT4Tables(filter) {
      const container = document.getElementById('comp-t4-tables-container');
      if (!container || typeof CHART_T4_DATA === 'undefined') return;

      const titles = {
        "1941_US": "1941 U.S. Navy Capital Ships (1d10)",
        "1941_UK": "1941 Royal Navy Capital Ships (1d6)",
        "1942_US": "1942 U.S. Navy Capital Ships (1d10)",
        "1942_UK": "1942 Royal Navy Capital Ships (1d6)",
        "1943_45_US": "1943–1945 U.S. Navy Capital Ships (1d20)"
      };

      if (!filter || filter === 'all') {
        let allHtml = '<div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:12px;">';
        ['1941_US', '1941_UK', '1942_US', '1942_UK', '1943_45_US'].forEach(k => {
          if (CHART_T4_DATA[k]) {
            allHtml += renderChartT4TableBlock(k, titles[k], CHART_T4_DATA[k]);
          }
        });
        allHtml += '</div>';
        container.innerHTML = allHtml;
      } else {
        if (CHART_T4_DATA[filter]) {
          container.innerHTML = renderChartT4TableBlock(filter, titles[filter], CHART_T4_DATA[filter]);
        }
      }
    }

    function switchT4Tab(tabKey, btn) {
      currentT4Tab = tabKey;
      document.querySelectorAll('.t4-tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.borderColor = '';
        b.style.color = '';
      });
      if (btn) {
        btn.classList.add('active');
        btn.style.borderColor = '#c084fc';
        btn.style.color = '#f3e8ff';
      }
      renderAllChartT4Tables(tabKey);
    }

    function rollChartT4(forcedKey) {
      let key = forcedKey;
      if (!key) {
        const yr = campaignState.currentYear || 1941;
        const area = campaignState.workflow.assignedArea || "";
        const isUK = area.includes("Indian Ocean") || area.includes("Malaya") || area.includes("Australia");
        if (yr === 1941) key = isUK ? "1941_UK" : "1941_US";
        else if (yr === 1942) key = isUK ? "1942_UK" : "1942_US";
        else key = "1943_45_US";
      }

      const subTable = CHART_T4_DATA[key];
      const maxRoll = Object.keys(subTable).length;
      const roll = Math.floor(Math.random() * maxRoll) + 1;
      const target = subTable[roll] || subTable[1];

      // Switch to table tab if not showing all and highlight row
      if (currentT4Tab !== 'all' && currentT4Tab !== key) {
        const btn = document.querySelector(`.t4-tab-btn[onclick*="${key}"]`);
        switchT4Tab(key, btn);
      }
      setTimeout(() => {
        document.querySelectorAll('.t4-table-row').forEach(r => {
          r.style.background = '';
          r.style.boxShadow = '';
        });
        const row = document.getElementById(`t4-row-${key}-${roll}`);
        if (row) {
          row.style.background = 'rgba(234, 179, 8, 0.35)';
          row.style.boxShadow = 'inset 0 0 10px rgba(234, 179, 8, 0.5)';
          row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 50);

      const res = {
        chart: `T4 (${key})`,
        roll: roll,
        name: target.name,
        tons: target.tonnage,
        type: "Capital",
        pts_to_sink: target.pts_to_sink || 6,
        isFast: target.fast,
        escort: true
      };
      applyTargetToWorkflow(res);
      showToast(`⚔️ 🎲 Chart T4 [${key}]: 1d${maxRoll} = [${roll}] ➔ ${target.name} (${target.tonnage.toLocaleString()} t)!`);
      return res;
    }

    function rollChartT5() {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const target = CHART_T5_DATA[d20];
      const res = {
        chart: "T5",
        roll: d20,
        name: target.name,
        tons: target.tonnage,
        type: target.is_sub ? "Commonwealth Submarine" : "Commonwealth Warship",
        isSub: target.is_sub,
        isTanker: false,
        escort: true
      };
      applyTargetToWorkflow(res);
      highlightCompendiumTarget('t5', d20);
      showToast(`🎲 Chart T5: 1d20 = [${d20}] ➔ ${target.name} (${target.tonnage.toLocaleString()} t)`);
      return res;
    }

    function onEncounterTypeChange(encType, triggerGen) {
      if (!encType) encType = "Ship";
      const isEn = (window.currentLang === 'en');
      campaignState.workflow.currentEncounter = encType;
      campaignState.workflow.encounterType = encType;

      const selEl = document.getElementById('p3-encounter-type-select');
      if (selEl && selEl.value !== encType) {
        selEl.value = encType;
      }

      const banner = document.getElementById('p3-encounter-type-banner');
      const textEl = document.getElementById('p3-encounter-desc-text');
      const actionBtn = document.getElementById('p3-encounter-action-btn');

      if (banner && textEl) {
        if (encType === "Ship*") {
          banner.style.background = "rgba(2, 132, 199, 0.25)";
          banner.style.borderColor = "#38bdf8";
          banner.style.color = "#bae6fd";
          textEl.innerHTML = isEn
            ? "🚢* <strong>Ship*:</strong> Single escorted freighter detected. Close escort screen present. Roll 1d6 for size: 1–4 Small [T1] or 5–6 Large [T2]."
            : "🚢* <strong>Ship*:</strong> 1 Mercante detectado con escolta cercana garantizada. Tira 1d6 para determinar tamaño: 1–4 Mercante Pequeño [Tabla T1] o 5–6 Mercante Grande [Tabla T2].";
          if (actionBtn) actionBtn.style.display = "none";
        } else if (encType === "Two Ships") {
          banner.style.background = "rgba(30, 58, 138, 0.35)";
          banner.style.borderColor = "#3b82f6";
          banner.style.color = "#dbeafe";
          textEl.innerHTML = isEn
            ? "🚢🚢 <strong>Two Ships:</strong> 2 Freighters detected in formation. Escort present. Roll for both targets and choose your primary target."
            : "🚢🚢 <strong>Two Ships:</strong> 2 Mercantes detectados navegando juntos. Escolta presente. Tira para ambos blancos y elige tu objetivo principal.";
          if (actionBtn) actionBtn.style.display = "none";
        } else if (encType === "Ship Group") {
          banner.style.background = "rgba(180, 83, 9, 0.3)";
          banner.style.borderColor = "#f59e0b";
          banner.style.color = "#fef08a";
          textEl.innerHTML = isEn
            ? "🚢🚢🚢 <strong>Ship Group:</strong> Merchant convoy formation. Multiple escorted targets [T1/T2] with active ASW screen."
            : "🚢🚢🚢 <strong>Ship Group:</strong> Formación / Convoy de mercantes. Múltiples blancos potenciales escoltados [T1/T2] con pantalla ASW.";
          if (actionBtn) actionBtn.style.display = "none";
        } else if (encType === "Warship") {
          banner.style.background = "rgba(220, 38, 38, 0.25)";
          banner.style.borderColor = "#ef4444";
          banner.style.color = "#fecaca";
          textEl.innerHTML = isEn
            ? "⚔️ <strong>Warship:</strong> Enemy combatant vessel [Chart T3: Destroyer / Cruiser]. Armed and equipped with depth charges and sonar."
            : "⚔️ <strong>Warship:</strong> Buque de combate enemigo [Tabla T3: Destructor / Crucero]. Armado y equipado con cargas de profundidad y sonar.";
          if (actionBtn) actionBtn.style.display = "none";
        } else if (encType === "Capital Ship") {
          banner.style.background = "rgba(124, 58, 237, 0.25)";
          banner.style.borderColor = "#c084fc";
          banner.style.color = "#f3e8ff";
          textEl.innerHTML = isEn
            ? "⚓ <strong>Capital Ship:</strong> Capital warship [Chart T4/T5: Battleship / Carrier]. Prime strategic target protected by heavy escort screen."
            : "⚓ <strong>Capital Ship:</strong> Buque capital de combate [Tabla T4/T5: Acorazado / Portaaviones]. Blanco de máximo valor con fuerte escolta.";
          if (actionBtn) actionBtn.style.display = "none";
        } else {
          // Default: Ship
          banner.style.background = "rgba(2, 132, 199, 0.2)";
          banner.style.borderColor = "#0284c7";
          banner.style.color = "#bae6fd";
          textEl.innerHTML = isEn
            ? "🚢 <strong>Ship:</strong> Single freighter detected. Roll 1d6 for size: 1–4 Small Freighter [Chart T1, no escort] or 5–6 Large Freighter [Chart T2, escorted]."
            : "🚢 <strong>Ship:</strong> 1 Mercante en solitario. Tira 1d6 para determinar tamaño: 1–4 Mercante Pequeño [Tabla T1, sin escolta] o 5–6 Mercante Grande [Tabla T2, escoltado].";
          if (actionBtn) actionBtn.style.display = "none";
        }
      }

      if (triggerGen === 'manual_change') {
        campaignState.workflow.currentTarget = null;
        renderTargetUI(null);
      } else if (triggerGen === true) {
        if (encType.includes("Capital Ship")) {
          rollChartT4();
        } else if (encType.includes("Warship")) {
          rollChartT3();
        } else if (encType === "Ship" || encType === "Ship*") {
          rollShipSizeD6();
        } else if (encType === "Two Ships" || encType === "Ship Group") {
          rollChartT2();
        }
      }
      saveState();
    }

    function setEncounterTypeQuick(encType) {
      onEncounterTypeChange(encType, true);
      const isEn = (window.currentLang === 'en');
      showToast(isEn ? `Encounter Type set to: ${encType}` : `Tipo de encuentro cambiado a: ${encType}`);
    }

    function rollTableA3Encounter(manualVal) {
      const isEn = (window.currentLang === 'en');
      let d1, d2, sum;
      if (typeof manualVal === 'number' && manualVal >= 2 && manualVal <= 12) {
        sum = manualVal;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }
      
      const assignedArea = (campaignState.workflow && campaignState.workflow.assignedArea) ? campaignState.workflow.assignedArea : "Pearl Harbor";
      const targetZone = (typeof mapA1ToA3Zone === 'function') ? mapA1ToA3Zone(assignedArea) : "Transit";
      const zoneRow = (typeof CHART_A3_DATA !== 'undefined' && CHART_A3_DATA[targetZone]) ? CHART_A3_DATA[targetZone] : (typeof CHART_A3_DATA !== 'undefined' ? CHART_A3_DATA["Transit"] : {});
      let rawEncounter = zoneRow[sum] || "Ship";
      
      let normalized = "Ship";
      if (rawEncounter.includes("Capital Ship")) normalized = "Capital Ship";
      else if (rawEncounter.includes("Warship")) normalized = "Warship";
      else if (rawEncounter.includes("Two Ships")) normalized = "Two Ships";
      else if (rawEncounter.includes("Convoy") || rawEncounter.includes("Ship Group")) normalized = "Ship Group";
      else if (rawEncounter.includes("Ship*")) normalized = "Ship*";
      else if (rawEncounter.includes("Aircraft")) {
        showToast(isEn ? `🎲 Table [A3]: [${sum}] = Aircraft! Resolved in Air tab.` : `🎲 Tabla [A3]: [${sum}] = ¡Avión! Se resuelve en pestaña de Aviones.`);
        normalized = "Ship";
      } else if (rawEncounter === "--" || rawEncounter.includes("None")) {
        showToast(isEn ? `🎲 Table [A3]: [${sum}] = No Contact. Defaulting to Ship.` : `🎲 Tabla [A3]: [${sum}] = Sin Contacto. Seleccionando Ship.`);
        normalized = "Ship";
      } else {
        normalized = "Ship";
      }

      onEncounterTypeChange(normalized, true);

      // Update visible die result badge and tabletop input
      const a3Badge = document.getElementById('p3-a3-dice-result');
      if (a3Badge) {
        a3Badge.style.display = 'inline-flex';
        a3Badge.innerHTML = `🎲 <strong>2d6: [${d1}+${d2} = ${sum}]</strong>`;
      }
      const a3Input = document.getElementById('p3-manual-a3-val');
      if (a3Input) {
        a3Input.value = sum;
      }

      showToast(isEn ? `🎲 Table [A3]: 2d6 = [${d1}+${d2} = ${sum}] ➔ ${normalized}` : `🎲 Tabla [A3]: 2d6 = [${d1}+${d2} = ${sum}] ➔ ${normalized}`);
    }

    function rollEncounterFromPhase3() {
      rollTableA3Encounter();
    }

    function updatePhase3EncounterUI() {
      if (campaignState.workflow && campaignState.workflow.currentTarget) {
        if (campaignState.workflow.currentTarget.name === "SS Steel Seafarer" && !campaignState.workflow.currentTarget.chart) {
          campaignState.workflow.currentTarget = null;
        }
      }
      const current = (campaignState.workflow && (campaignState.workflow.currentEncounter || campaignState.workflow.encounterType)) || "Ship";
      onEncounterTypeChange(current, false);
      if (typeof renderTargetUI === 'function') {
        renderTargetUI(campaignState.workflow && campaignState.workflow.currentTarget);
      }
      if (typeof syncPhase3TorpedoOptions === 'function') {
        syncPhase3TorpedoOptions();
      }
      if (typeof updateCombatChits === 'function') {
        updateCombatChits();
      }
    }

    function rollTargetGeneration() {
      const enc = (campaignState.workflow && (campaignState.workflow.currentEncounter || campaignState.workflow.encounterType)) || "";
      const area = campaignState.workflow.assignedArea || "";
      const isUKArea = area.includes("Indian Ocean") || area.includes("Malaya") || area.includes("Australia");

      if (enc.includes("Capital Ship")) {
        return rollChartT4();
      } else if (enc.includes("Warship")) {
        if (isUKArea && Math.random() < 0.35) {
          return rollChartT5();
        }
        return rollChartT3();
      } else {
        // Ship encounter: 1d6 per Chart A3
        const d6 = Math.floor(Math.random() * 6) + 1;
        const res = (d6 <= 4) ? rollChartT1() : rollChartT2();
        res.d6 = d6;
        return res;
      }
    }

    function isCommonwealthTheater(area) {
      if (!area && typeof campaignState !== 'undefined' && campaignState.workflow) {
        area = campaignState.workflow.assignedArea || "";
      }
      const s = (area || "").toLowerCase();
      return s.includes("indian") || s.includes("malaya") || s.includes("australia") || s.includes("ceylon") || s.includes("colombo") || s.includes("trincomalee") || s.includes("fremantle") || s.includes("singapore") || s.includes("bay of bengal") || s.includes("uk");
    }

    function getTheaterEscortTableInfo() {
      const isEn = (window.currentLang === 'en');
      const area = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.assignedArea) ? campaignState.workflow.assignedArea : "Pearl Harbor";
      const isCW = isCommonwealthTheater(area);
      const chart = isCW ? "T5" : "T3";
      const navy = isCW ? (isEn ? "Royal Navy / Commonwealth (1d20)" : "Royal Navy / Commonwealth (1d20)") : (isEn ? "U.S. Navy (1d100)" : "U.S. Navy (1d100)");
      return { area, isCW, chart, navy };
    }

    // PASO 1.1: TIRADA INDEPENDIENTE DE TAMAÑO (1d6) - NO TIRA EL BUQUE AÚN
    function rollShipSizeD6(manualVal) {
      const isEn = (window.currentLang === 'en');
      let d6;
      if (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 6) {
        d6 = manualVal;
      } else {
        d6 = Math.floor(Math.random() * 6) + 1;
      }

      const isT1 = (d6 <= 4);
      const chartKey = isT1 ? "T1" : "T2";

      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.shipSizeD6 = d6;
      campaignState.workflow.determinedSize = chartKey;

      // Update banner
      const banner = document.getElementById('p3-size-d6-result-banner');
      if (banner) {
        banner.style.display = 'block';
        banner.style.background = isT1 ? 'rgba(30, 58, 138, 0.45)' : 'rgba(180, 83, 9, 0.45)';
        banner.style.border = isT1 ? '1px solid #38bdf8' : '1px solid #f59e0b';
        banner.style.color = isT1 ? '#bae6fd' : '#fef08a';
        const typeDesc = isT1
          ? (isEn ? "Tabla T1: Mercante Pequeño (Sin Escolta)" : "Tabla T1: Mercante Pequeño (Sin Escolta)")
          : (isEn ? "Tabla T2: Mercante Grande / Petrolero (¡Escoltado!)" : "Tabla T2: Mercante Grande / Petrolero (¡Escoltado!)");
        banner.innerHTML = `🎲 <strong>${isEn ? 'Size Roll 1d6' : 'Tirada de Tamaño 1d6'}: [${d6}]</strong> ➔ <span style="font-weight:700;">${typeDesc}</span> &bull; <em>${isEn ? 'Now roll 1d100 in Step 2' : 'Ahora tira el dado para el barco en el Paso 2'}</em>`;
      }

      // Update merchant button text
      const btnMerchant = document.getElementById('p3-btn-roll-merchant');
      if (btnMerchant) {
        btnMerchant.innerText = isT1
          ? (isEn ? "🚢 2. Roll Merchant [Chart T1 (1d100)]" : "🚢 2. Tirar Buque [Tabla T1 (1d100)]")
          : (isEn ? "🚢 2. Roll Merchant [Chart T2 (1d100)]" : "🚢 2. Tirar Buque [Tabla T2 (1d100)]");
      }

      // Sync select dropdown if it exists
      const selEl = document.getElementById('p3-manual-size-d6');
      if (selEl) selEl.value = String(d6);

      // Update theater tag in Step 3
      const escortTag = document.getElementById('p3-escort-theater-tag');
      if (escortTag) {
        const info = getTheaterEscortTableInfo();
        escortTag.innerText = `${isEn ? 'Site' : 'Sitio'}: ${info.area} ➔ Tabla ${info.chart} (${info.navy})`;
      }

      const toastMsg = isEn
        ? `🎲 Size 1d6 = [${d6}] ➔ ${chartKey}: ${isT1 ? 'Small Freighter (Chart T1)' : 'Large Freighter / Tanker (Chart T2)'}`
        : `🎲 Tamaño 1d6 = [${d6}] ➔ ${chartKey}: ${isT1 ? 'Mercante Pequeño (Tabla T1)' : 'Mercante Grande / Petrolero (Tabla T2)'}`;
      showToast(toastMsg);
      saveState();
      return { d6, chart: chartKey };
    }

    // PASO 1.2: TIRADA INDEPENDIENTE DEL BUQUE MERCANTE EN T1 O T2 (1d100)
    function rollMerchantShip(manualD100, forcedChart) {
      const isEn = (window.currentLang === 'en');
      let chartKey = forcedChart || (campaignState.workflow && campaignState.workflow.determinedSize) || "T1";
      
      let res;
      if (chartKey === "T2") {
        res = rollChartT2(manualD100);
      } else {
        res = rollChartT1(manualD100);
      }

      if (campaignState.workflow && campaignState.workflow.shipSizeD6) {
        res.d6 = campaignState.workflow.shipSizeD6;
      }

      // Update Escort Tag in Step 3
      const escortTag = document.getElementById('p3-escort-theater-tag');
      if (escortTag) {
        const info = getTheaterEscortTableInfo();
        escortTag.innerText = `${isEn ? 'Site' : 'Sitio'}: ${info.area} ➔ Tabla ${info.chart} (${info.navy})`;
      }

      saveState();
      return res;
    }

    // PASO 1.3: TIRADA INDEPENDIENTE DE ESCOLTA EN T3 O T5 SEGÚN EL SITIO
    function rollEscortShip(manualVal, forcedChart) {
      const isEn = (window.currentLang === 'en');
      const info = getTheaterEscortTableInfo();
      const chartKey = forcedChart || info.chart;

      let escortObj;
      if (chartKey === "T5") {
        const d20 = (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 20)
          ? manualVal
          : (Math.floor(Math.random() * 20) + 1);
        const target = CHART_T5_DATA[d20] || CHART_T5_DATA[1];
        escortObj = {
          chart: "T5",
          roll: d20,
          name: target.name,
          tons: target.tonnage,
          type: target.is_sub ? (isEn ? "Commonwealth Submarine" : "Submarino Commonwealth") : (isEn ? "Commonwealth Destroyer / Escort" : "Destructor / Escolta Commonwealth"),
          isSub: target.is_sub,
          theater: info.area
        };
      } else {
        // T3: US Warships / Escorts
        const d100 = (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 100)
          ? manualVal
          : (Math.floor(Math.random() * 100) + 1);
        const target = CHART_T3_DATA[d100] || CHART_T3_DATA[String(d100)] || { name: "Destroyer", tonnage: 1800, is_sub: false };
        escortObj = {
          chart: "T3",
          roll: d100,
          roll100: d100,
          name: target.name,
          tons: target.tonnage,
          type: target.is_sub ? (isEn ? "U.S. Submarine" : "Submarino EE.UU.") : (isEn ? "U.S. Destroyer / Escort" : "Destructor / Escolta EE.UU."),
          isSub: target.is_sub,
          theater: info.area
        };
      }

      if (!campaignState.workflow) campaignState.workflow = {};
      campaignState.workflow.currentEscort = escortObj;
      if (campaignState.workflow.currentTarget) {
        campaignState.workflow.currentTarget.escortShip = escortObj;
        campaignState.workflow.currentTarget.escort = true;
        renderTargetUI(campaignState.workflow.currentTarget);
      }

      // Update Escort Result Banner
      const escortBanner = document.getElementById('p3-escort-result-banner');
      if (escortBanner) {
        escortBanner.style.display = 'block';
        const numStr = (escortObj.roll100 || escortObj.roll) ? `(#${escortObj.roll100 || escortObj.roll})` : '';
        escortBanner.innerHTML = `🛡️ <strong>${isEn ? 'Escort Ship Identified' : 'Buque Escolta Identificado'}:</strong> [${escortObj.chart}] <strong>${escortObj.name}</strong> ${numStr} &bull; ${(escortObj.tons || 0).toLocaleString()} t &bull; ${escortObj.type} &bull; <em>${isEn ? 'Site' : 'Sitio'}: ${info.area}</em>`;
      }

      // Update Paso 5 Escort description if present
      const escortDesc = document.getElementById('p3-escort-desc');
      if (escortDesc) {
        escortDesc.innerHTML = isEn
          ? `Contact is protected by escort <strong>[${escortObj.chart}] ${escortObj.name}</strong> (${(escortObj.tons || 0).toLocaleString()} t). Resolve acoustic detection (Chart B4) and depth charge counterattack (Charts B5 & B6):`
          : `El blanco está protegido por la escolta <strong>[${escortObj.chart}] ${escortObj.name}</strong> (${(escortObj.tons || 0).toLocaleString()} t). Resuelve la detección acústica (Tabla B4) y el contraataque de cargas de profundidad (Tablas B5 & B6):`;
      }

      saveState();
      showToast(isEn ? `Escort generated: [${escortObj.chart}] ${escortObj.name}` : `Escolta generada: [${escortObj.chart}] ${escortObj.name}`);
      return escortObj;
    }

    // HELPER: Map target ship to authentic counter chit
    function getTargetChitPath(t) {
      if (!t || !t.name) return null;
      const name = t.name.toLowerCase();

      // 1. Battleships (BB)
      if (name.includes('california')) return 'assets/chits/California BB.jpg';
      if (name.includes('maryland')) return 'assets/chits/Maryland BB.jpg';
      if (name.includes('oklahoma') || name.includes('oaklahoma')) return 'assets/chits/Oaklahoma BB.jpg';
      if (name.includes('tennessee')) return 'assets/chits/Tennessee BB.jpg';
      if (name.includes('west virginia') || name.includes('w virginia')) return 'assets/chits/W Virginia BB.jpg';
      if (name.includes('arizona')) return 'assets/chits/Arizona BB.jpg';
      if (name.includes('nevada')) return 'assets/chits/Nevada BB.jpg';
      if (name.includes('pennsylvania')) return 'assets/chits/Pennsylvania BB.jpg';
      if (name.includes('colorado') || name.includes('colorodo')) return 'assets/chits/Colorodo BB.jpg';
      if (name.includes('north carolina') || name.includes('n carolina')) return 'assets/chits/N Carolina BB.jpg';
      if (name.includes('washington')) return 'assets/chits/Washington BB.jpg';
      if (name.includes('south dakota') || name.includes('s dakota')) return 'assets/chits/S Dakota BB.jpg';
      if (name.includes('indiana')) return 'assets/chits/Indiana BB.jpg';
      if (name.includes('massachusetts')) return 'assets/chits/Massachusetts BB.jpg';
      if (name.includes('alabama')) return 'assets/chits/Alabama BB.jpg';
      if (name.includes('iowa')) return 'assets/chits/Iowa BB.jpg';
      if (name.includes('new jersey')) return 'assets/chits/New Jersey BB.jpg';
      if (name.includes('missouri')) return 'assets/chits/Missouri BB.jpg';
      if (name.includes('new mexico')) return 'assets/chits/New Mexico BB.jpg';
      if (name.includes('prince of wales')) return 'assets/chits/Prince of Wales BB.jpg';
      if (name.includes('warspite')) return 'assets/chits/Warspite BB.jpg';
      if (name.includes('ramillies')) return 'assets/chits/Ramillies BB.jpg';
      if (name.includes('resolution')) return 'assets/chits/Resolution BB.jpg';
      if (name.includes('revenge')) return 'assets/chits/Revenge BB.jpg';
      if (name.includes('royal sovereign')) return 'assets/chits/Royal Sovereign BB.jpg';

      // 2. Aircraft Carriers (CV / CVL / CVE)
      if (name.includes('enterprise')) return 'assets/chits/Enterprise CV.jpg';
      if (name.includes('yorktown')) return 'assets/chits/Yorktown CV.jpg';
      if (name.includes('hornet')) return 'assets/chits/Hornet CV.jpg';
      if (name.includes('lexington')) return 'assets/chits/Lexington CV.jpg';
      if (name.includes('saratoga')) return 'assets/chits/Saratoga CV.jpg';
      if (name.includes('wasp')) return 'assets/chits/Wasp CV.jpg';
      if (name.includes('essex')) return 'assets/chits/Essex CV.jpg';
      if (name.includes('independence')) return 'assets/chits/Independence CVL.jpg';
      if (name.includes('princeton')) return 'assets/chits/Princeton CVL.jpg';
      if (name.includes('liscome bay')) return 'assets/chits/Liscome Bay CVE.jpg';
      if (name.includes('santee')) return 'assets/chits/Santee CVE.jpg';
      if (name.includes('hermes')) return 'assets/chits/Hermes CV.jpg';

      // 3. Merged types / Generics
      if (t.isTanker || (t.type && t.type.toLowerCase().includes('tanker')) || name.includes('tanker')) {
        return 'assets/chits/Tanker.jpg';
      }
      if ((t.type && (t.type.toLowerCase().includes('transport') || t.type.toLowerCase().includes('troop'))) || name.includes('transport')) {
        return 'assets/chits/Transport.jpg';
      }
      if (t.chart === 'T1' || (t.type && t.type.toLowerCase().includes('small'))) {
        return 'assets/chits/Small Freighter.jpg';
      }
      if (t.chart === 'T2' || (t.type && t.type.toLowerCase().includes('large'))) {
        return 'assets/chits/Large Freighter.jpg';
      }
      if (t.chart === 'T3' || t.chart === 'T5' || (t.type && (t.type.toLowerCase().includes('destroyer') || t.type.toLowerCase().includes('escort') || t.type.toLowerCase().includes('cruiser') || t.type.toLowerCase().includes('warship')))) {
        return 'assets/chits/Escort.jpg';
      }

      return 'assets/chits/Large Freighter.jpg';
    }

    function updateCombatChits() {
      // 1. Momento del Día (Day / Night)
      const todSel = document.getElementById('wf-tod-select');
      const todImg = document.getElementById('wf-tod-chit-img');
      if (todSel && todImg) {
        todImg.src = (todSel.value === 'night') ? 'assets/chits/Night.jpg' : 'assets/chits/Day.jpg';
      }

      // 2. Alcance (Range: Close / Medium / Long)
      const rangeSel = document.getElementById('wf-range-select');
      const rangeImg = document.getElementById('wf-range-chit-img');
      if (rangeSel && rangeImg) {
        if (rangeSel.value === 'close') {
          rangeImg.src = 'assets/chits/Range Close.jpg';
        } else if (rangeSel.value === 'long') {
          rangeImg.src = 'assets/chits/Range Long.jpg';
        } else {
          rangeImg.src = 'assets/chits/Range Medium.jpg';
        }
      }

      // 3. Modalidad (Submerged / Surfaced)
      const modeSel = document.getElementById('wf-attack-mode-select');
      const modeImg = document.getElementById('wf-mode-chit-img');
      if (modeSel && modeImg) {
        modeImg.src = (modeSel.value === 'submerged') ? 'assets/chits/Submerged.jpg' : 'assets/chits/Surfaced.jpg';
      }

      // 4. Escolta
      const target = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.currentTarget) ? campaignState.workflow.currentTarget : null;
      const escortBox = document.getElementById('wf-escort-chit-box');
      if (escortBox) {
        const hasEscort = !!(target && target.escort);
        escortBox.style.opacity = hasEscort ? '1.0' : '0.35';
        escortBox.style.filter = hasEscort ? 'none' : 'grayscale(100%)';
        escortBox.title = hasEscort ? 'Escolta Enemiga ACTIVA' : 'Sin Escolta Detectada';
      }
    }

    function renderTargetUI(t) {
      const isEn = (window.currentLang === 'en');
      const nameEl = document.getElementById('wf-target-name');
      const subEl = document.getElementById('wf-target-sub');
      const banner = document.getElementById('p3-size-d6-result-banner');
      const escortBanner = document.getElementById('p3-escort-result-banner');
      const chitImg = document.getElementById('wf-target-chit-img');
      const chitPlaceholder = document.getElementById('wf-target-chit-placeholder');
      if (!nameEl || !subEl) return;

      if (t && t.name && (t.chart || t.roll100 || t.roll || t.d6 || t.pts_to_sink)) {
        nameEl.style.color = '#fff';
        nameEl.style.fontStyle = 'normal';
        nameEl.style.fontWeight = '800';
        const rollNum = (t.roll100 != null && !isNaN(t.roll100)) ? t.roll100 : ((t.roll != null && !isNaN(t.roll)) ? t.roll : '');
        const numStr = rollNum ? `(#${rollNum})` : '';
        nameEl.innerHTML = `<span style="color:var(--gold-400);">[${t.chart || 'T'}]</span> ${t.name} ${numStr ? `<span style="font-size:0.75rem; color:#94a3b8;">${numStr}</span>` : ''}`;
        const tankerBadge = t.isTanker ? (isEn ? ' <span class="badge" style="background:#dc2626; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:3px;">TANKER (T)</span>' : ' <span class="badge" style="background:#dc2626; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:3px;">PETROLERO (T)</span>') : '';
        
        const escortObj = t.escortShip || (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.currentEscort);
        let escortLabel = '';
        if (escortObj) {
          escortLabel = `<span style="color:#fde047; font-weight:bold;">🛡️ ${isEn ? 'Escort:' : 'Escolta:'} [${escortObj.chart}] ${escortObj.name}</span>`;
        } else if (t.escort) {
          escortLabel = `<span style="color:#f87171; font-weight:bold;">🛡️ ${isEn ? 'Escort Required (Step 3)' : 'Escolta Requerida (Paso 1.3)'}</span>`;
        } else {
          escortLabel = isEn ? 'No Escort' : 'Sin escolta';
        }

        const rollLabel = t.d6
          ? ` • 🎲 ${isEn ? 'Size 1d6' : 'Tamaño 1d6'}: [${t.d6}] (➔ ${t.chart}) • Tirada ${t.chart}: [${rollNum}]`
          : (rollNum ? ` • Tirada ${t.chart}: [${rollNum}]` : '');
        subEl.style.color = 'var(--gold-400)';
        subEl.innerHTML = `${(t.tons || 0).toLocaleString()} tons • ${t.type || 'Vessel'}${tankerBadge} • ${escortLabel}${rollLabel}`;

        if (escortBanner) {
          if (escortObj) {
            escortBanner.style.display = 'block';
            const escortRoll = (escortObj.roll100 || escortObj.roll) ? `(#${escortObj.roll100 || escortObj.roll})` : '';
            escortBanner.innerHTML = `🛡️ <strong>${isEn ? 'Escort Ship Identified' : 'Buque Escolta Identificado'}:</strong> [${escortObj.chart}] <strong>${escortObj.name}</strong> ${escortRoll} &bull; ${(escortObj.tons || 0).toLocaleString()} t &bull; ${escortObj.type}`;
          } else {
            escortBanner.style.display = 'none';
          }
        }

        if (chitImg) {
          const chitPath = getTargetChitPath(t);
          if (chitPath) {
            chitImg.src = chitPath;
            chitImg.style.display = 'block';
            if (chitPlaceholder) chitPlaceholder.style.display = 'none';
          } else {
            chitImg.style.display = 'none';
            if (chitPlaceholder) chitPlaceholder.style.display = 'block';
          }
        }
      } else {
        nameEl.style.color = '#94a3b8';
        nameEl.style.fontStyle = 'italic';
        nameEl.style.fontWeight = 'normal';
        nameEl.innerHTML = isEn ? '-- No target generated yet --' : '-- Ningún buque generado aún --';
        subEl.style.color = '#64748b';
        subEl.innerHTML = isEn ? 'Roll size in Step 1, then merchant in Step 2, and escort in Step 3.' : 'Tira tamaño en Paso 1, buque en Paso 2 y escolta en Paso 3.';
        if (banner) banner.style.display = 'none';
        if (escortBanner) escortBanner.style.display = 'none';
        if (chitImg) chitImg.style.display = 'none';
        if (chitPlaceholder) chitPlaceholder.style.display = 'block';
      }
      updateCombatChits();
    }

    function applyTargetToWorkflow(t) {
      campaignState.workflow.currentTarget = t;
      campaignState.workflow.salvoHistory = [];
      campaignState.workflow.lastCombatHits = 0;
      campaignState.workflow.lastCombatDamage = 0;
      campaignState.workflow.lastCombatIsSunk = false;
      campaignState.workflow.lastCombatStatus = 'miss';
      const diceBox = document.getElementById('wf-torpedo-dice-details');
      if (diceBox) diceBox.innerHTML = '';
      const hitRes = document.getElementById('wf-combat-hit-res');
      if (hitRes) hitRes.innerText = (window.currentLang === 'en') ? 'Awaiting Firing Solution...' : 'Esperando Solución de Disparo...';
      const sinkStatus = document.getElementById('wf-combat-sink-status');
      if (sinkStatus) sinkStatus.innerText = '';

      if (typeof checkSubVsSubTarget === 'function') checkSubVsSubTarget(t);
      if (typeof updatePatrolPhaseUI === 'function') updatePatrolPhaseUI();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      renderTargetUI(t);
      saveState();
    }

    function highlightCompendiumTarget(chartId, num) {
      const rows = document.querySelectorAll(`.comp-t-row-${chartId}`);
      rows.forEach(r => r.style.backgroundColor = '');
      const targetRow = document.getElementById(`comp-t-row-${chartId}-${num}`);
      if (targetRow) {
        targetRow.style.backgroundColor = 'rgba(217, 119, 6, 0.4)';
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    function checkCommanderHasGoldenKite() {
      if (typeof campaignState === 'undefined') return false;
      if (campaignState.tokens) {
        if (campaignState.tokens['token-medal-gk4'] || campaignState.tokens['token-medal-gk5'] || campaignState.tokens['golden_kite'] || campaignState.tokens['gk4'] || campaignState.tokens['gk5']) {
          return true;
        }
      }
      if (campaignState.commander) {
        if (campaignState.commander.hasGoldenKite || campaignState.commander.goldenKite) return true;
        if (Array.isArray(campaignState.commander.medals) && campaignState.commander.medals.some(m => String(m).toLowerCase().includes('kite') || String(m).toLowerCase().includes('milano'))) return true;
        if (Array.isArray(campaignState.commander.awards) && campaignState.commander.awards.some(m => String(m).toLowerCase().includes('kite') || String(m).toLowerCase().includes('milano'))) return true;
      }
      if (campaignState.hasGoldenKite) return true;
      return false;
    }

    function onRangeChange() {
      const r = document.getElementById('wf-range-select') ? document.getElementById('wf-range-select').value : 'medium';
      const infiltEl = document.getElementById('wf-infilt-res');
      if (infiltEl) infiltEl.style.display = (r === 'close') ? 'block' : 'none';
      
      const gBadge = document.getElementById('p3-golden-kite-badge');
      if (gBadge) {
        const hasGk = checkCommanderHasGoldenKite();
        gBadge.style.display = (r === 'close' && hasGk) ? 'inline-block' : 'none';
      }

      if (typeof updateCombatChits === 'function') updateCombatChits();
    }

    // CHART B6 DAMAGE TABLE (d66)
    

// CHART B7 (Repairs, Flooding & Injuries) is canonically handled with full i18n and manual roll in gameflow_phase4_5.js
    
    // CHARTS M5 - M8: MIDGET SUBMARINE (KO-HYOTEKI) LOGIC
    





// ====================================================================
// INTERACTIVE FUNCTIONS FOR FLOAT-PLANE CHARTS (P3, P4, P5, P6) [RULE 7.17]
// ====================================================================
function rollChartP3() {
  const isEn = (typeof window !== 'undefined' && window.currentLang === 'en');
  const phaseSelect = document.querySelector('#modal-viewer #p3-mission-phase') || document.getElementById('p3-mission-phase');
  const phase = phaseSelect ? phaseSelect.value : 'targetRecon';
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const entry = CHART_P3_DATA[sum] || { transit: "--", recon: "--", targetRecon: "--", targetBombing: "--" };

  let val = entry[phase] || "--";
  let col = '#94a3b8';
  let badgeText = val;

  if (val.includes('Aircraft')) {
    col = '#f87171';
    badgeText = isEn ? ('✈️ AIR ALERT! (' + val + ')') : ('✈️ ¡ALERTA AÉREA! (' + val + ')');
  } else if (val.includes('Capital Ship')) {
    col = '#fde047';
    badgeText = isEn ? ('⚓ CAPITAL SHIP! (' + val + ')') : ('⚓ ¡BUQUE CAPITAL! (' + val + ')');
  } else if (val.includes('Ship') || val.includes('CA') || val.includes('CL') || val.includes('DD') || val.includes('Tanker')) {
    col = '#93c5fd';
    badgeText = isEn ? ('🚢 Naval Contact: ' + val) : ('🚢 Contacto Naval: ' + val);
  } else if (val.includes('AA')) {
    col = '#ef4444';
    badgeText = isEn ? ('💥 AA Flak Fire (' + val + ')') : ('💥 Fuego Antiaéreo (' + val + ')');
  } else if (val === '--') {
    col = '#64748b';
    badgeText = isEn ? 'No Encounter (Clear)' : 'Sin Encuentro (Despejado)';
  }

  const phaseNames = isEn ? {
    transit: 'Transit',
    recon: 'Reconnaissance',
    targetRecon: 'Target - Reconnaissance',
    targetBombing: 'Target - Bombing Panama'
  } : {
    transit: 'Tránsito (Transit)',
    recon: 'Reconocimiento (Recon)',
    targetRecon: 'Objetivo - Reconocimiento (Target Recon)',
    targetBombing: 'Objetivo - Bombardeo Canal (Target Bombing)'
  };

  const html = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="color:var(--gold-400); font-weight:bold;">${isEn ? "Roll 2d6:" : "Tirada 2d6:"}</span> 
        <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d1}+${d2} = ${sum}]</span>
        <span style="color:#94a3b8; font-size:0.75rem; margin-left:6px;">(${phaseNames[phase] || phase})</span>
      </div>
      <div style="font-weight:bold; color:${col}; background:rgba(15,23,42,0.8); border:1px solid ${col}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
        ${badgeText}
      </div>
    </div>
  `;

  document.querySelectorAll('#res-interactive-p3').forEach(el => el.innerHTML = html);
  document.querySelectorAll('.p3-row').forEach(r => r.style.backgroundColor = '');
  document.querySelectorAll('#p3-row-' + sum).forEach(r => r.style.backgroundColor = 'rgba(2, 132, 199, 0.35)');

  showToast(`${isEn ? "P3 Encounter" : "P3 Encuentro"} [${sum}]: ${val}`);
}

function rollChartP6() {
  const isEn = (typeof window !== 'undefined' && window.currentLang === 'en');
  const d = Math.floor(Math.random() * 6) + 1;
  let key = (d <= 2) ? "1-2" : (d <= 5 ? "3-5" : "6");
  const data = CHART_P6_DATA[key];

  const resText = isEn ? (key === "1-2" ? "Miss" : (key === "3-5" ? "Moderate Damage" : "Heavy Damage")) : data.result;
  const descText = isEn ? (key === "1-2" ? "Bombs miss target completely." : (key === "3-5" ? "Direct hit causing notable structural damage." : "Devastating hit causing severe destruction.")) : data.desc;

  const html = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="color:var(--gold-400); font-weight:bold;">${isEn ? "Roll 1d6:" : "Tirada 1d6:"}</span> 
        <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d}]</span>
      </div>
      <div style="font-weight:bold; color:${data.color}; background:rgba(15,23,42,0.8); border:1px solid ${data.color}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
        🎯 ${resText}
      </div>
    </div>
    <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">${descText}</div>
  `;

  document.querySelectorAll('#res-interactive-p6').forEach(el => el.innerHTML = html);
  document.querySelectorAll('.p6-row').forEach(r => r.style.backgroundColor = '');
  document.querySelectorAll('#p6-row-' + key).forEach(r => r.style.backgroundColor = 'rgba(234, 179, 8, 0.3)');

  showToast(`${isEn ? "P6 Bombing" : "P6 Bombardeo"} [${d}]: ${resText}`);
}

function resolveChartP4FighterAttack() {
  const isEn = (typeof window !== 'undefined' && window.currentLang === 'en');
  const choiceSelect = document.querySelector('#modal-viewer #p4-recon-choice') || document.getElementById('p4-recon-choice');
  const choice = parseInt(choiceSelect ? choiceSelect.value : '1') || 1;
  const fighterDie = Math.floor(Math.random() * 6) + 1;
  const outcome = CHART_P4_AIR_COMBAT.matrix[choice][fighterDie];

  let outcomeHtml = '';
  let outcomeText = '';
  if (outcome === 'E') {
    outcomeHtml = `<span style="background:rgba(16,185,129,0.25); color:#6ee7b7; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-weight:bold;">✈️ ${isEn ? "SUCCESSFUL EVASION (E)! Encounter ends." : "¡EVASIÓN EXITOSA (E)! El encuentro termina."}</span>`;
    outcomeText = isEn ? "Successful Evasion!" : "¡Evasión exitosa!";
  } else if (outcome === 0) {
    outcomeHtml = `<span style="background:rgba(59,130,246,0.2); color:#93c5fd; border:1px solid #3b82f6; padding:2px 8px; border-radius:4px; font-weight:bold;">🛡️ ${isEn ? "0 Damage - Fighter burst misses clean." : "0 Daños - La ráfaga del caza pasa de largo."}</span>`;
    outcomeText = isEn ? "0 damage" : "0 daños";
  } else {
    outcomeHtml = `<span style="background:rgba(239,68,68,0.25); color:#fca5a5; border:1px solid #ef4444; padding:2px 8px; border-radius:4px; font-weight:bold;">💥 ${isEn ? (outcome + " HIT(S) ON FLOATPLANE!") : ("¡" + outcome + " IMPACTO(S) AL HIDROAVIÓN!")}</span>`;
    outcomeText = isEn ? `${outcome} hit(s) taken` : `${outcome} impacto(s) recibido(s)`;
  }

  const html = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="color:#94a3b8;">${isEn ? "Maneuver:" : "Tu Maniobra:"}</span> <strong style="color:var(--gold-400);">#${choice}</strong> | 
        <span style="color:#94a3b8;">${isEn ? "Fighter Die (1d6):" : "Dado Caza (1d6):"}</span> <strong style="color:#fde047;">[${fighterDie}]</strong>
      </div>
      <div>${outcomeHtml}</div>
    </div>
  `;

  document.querySelectorAll('#res-interactive-p4').forEach(el => el.innerHTML = html);
  document.querySelectorAll('.p4-cell').forEach(c => c.style.outline = '');
  document.querySelectorAll(`#p4-cell-${choice}-${fighterDie}`).forEach(c => c.style.outline = '2px solid #fde047');

  showToast(`${isEn ? "P4 Air Combat: Fighter rolled" : "Combate P4: Caza sacó"} ${fighterDie} -> ${outcomeText}`);
}

function rollChartP4RearGun() {
  const isEn = (typeof window !== 'undefined' && window.currentLang === 'en');
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const gun = CHART_P4_AIR_COMBAT.rearGun[sum] || { hits: 0, desc: "Miss", color: "#94a3b8" };

  const descText = isEn ? (sum === 2 ? "3 hits (Enemy destroyed!)" : (sum <= 4 ? "2 hits" : (sum <= 6 ? "1 hit" : "Miss"))) : gun.desc;

  const html = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="color:var(--gold-400); font-weight:bold;">${isEn ? "Rear Machine Gun (2d6):" : "Ametralladora Trasera (2d6):"}</span> 
        <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d1}+${d2} = ${sum}]</span>
      </div>
      <div style="font-weight:bold; color:${gun.color}; background:rgba(15,23,42,0.8); border:1px solid ${gun.color}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
        🔫 ${descText}
      </div>
    </div>
  `;

  document.querySelectorAll('#res-interactive-p4-reargun').forEach(el => el.innerHTML = html);
  showToast(`${isEn ? "Rear Gun" : "Ametralladora Trasera"} [${sum}]: ${descText}`);
}

function rollChartP5() {
  const isEn = (typeof window !== 'undefined' && window.currentLang === 'en');
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const entry = CHART_P5_DATA[sum] || { result: "Ineffective", desc: "--", dmg: 0, color: "#94a3b8" };

  let extraNote = '';
  if (entry.crewCheck) {
    const crewDie = Math.floor(Math.random() * 6) + 1;
    const victim = (crewDie <= 3) ? (isEn ? "Pilot (1-3)" : "Piloto (1-3)") : (isEn ? "Observer (4-6)" : "Observador (4-6)");
    const b8d1 = Math.floor(Math.random() * 6) + 1;
    const b8d2 = Math.floor(Math.random() * 6) + 1;
    const b8sum = b8d1 + b8d2;
    extraNote = `<div style="margin-top:4px; font-size:0.72rem; color:#fda4af; background:rgba(180,83,9,0.3); padding:3px 8px; border-radius:3px; border:1px solid #d97706;">
      ⚠️ ${isEn ? "Crew Wound Check:" : "Herida en tripulación:"} 🎲 1d6=[${crewDie}] &rarr; <strong>${victim}</strong> | ${isEn ? "Severity" : "Gravedad"} [B8 2d6: ${b8d1}+${b8d2}=${b8sum}]
    </div>`;
  }

  const resText = isEn ? (sum <= 7 ? "Ineffective" : (sum <= 9 ? "1 pt. Damage" : (sum <= 11 ? "2 pts. Damage" : "3 pts. Damage (Destroyed)"))) : entry.result;
  const descText = isEn ? (sum <= 7 ? "Scattered flak, no hits." : (sum === 8 ? "Close call (light shrapnel)." : (sum === 9 ? "Crew injury check (Chart B8)." : (sum === 10 ? "Severe fuselage / wing damage." : (sum === 11 ? "Severe damage & crew injury check." : "Direct hit; blown out of the sky!"))))) : entry.desc;

  const html = `
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
      <div>
        <span style="color:var(--gold-400); font-weight:bold;">${isEn ? "AA Flak Roll (2d6):" : "Tirada AA (2d6):"}</span> 
        <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d1}+${d2} = ${sum}]</span>
      </div>
      <div style="font-weight:bold; color:${entry.color}; background:rgba(15,23,42,0.8); border:1px solid ${entry.color}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
        💥 ${resText}
      </div>
    </div>
    <div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">${descText}</div>
    ${extraNote}
  `;

  document.querySelectorAll('#res-interactive-p5').forEach(el => el.innerHTML = html);
  document.querySelectorAll('.p5-row').forEach(r => r.style.backgroundColor = '');
  document.querySelectorAll('#p5-row-' + (sum <= 7 ? '2' : sum)).forEach(r => r.style.backgroundColor = 'rgba(239, 68, 68, 0.35)');

  showToast(`${isEn ? "P5 Flak" : "P5 Antiaéreo"} [${sum}]: ${resText}`);
}

function rollTimeOfDayD6(manualVal) {
  const isEn = (window.currentLang === 'en');
  let d;
  if (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 6) {
    d = manualVal;
  } else {
    d = Math.floor(Math.random() * 6) + 1;
  }
  const isDay = (d <= 3);
  const todSelect = document.getElementById('wf-tod-select');
  if (todSelect) {
    todSelect.value = isDay ? 'day' : 'night';
  }
  if (typeof onRangeChange === 'function') onRangeChange();

  // Show visual die result badge
  const resBadge = document.getElementById('p3-tod-dice-result');
  if (resBadge) {
    resBadge.style.display = 'inline-flex';
    resBadge.style.alignItems = 'center';
    resBadge.style.gap = '4px';
    resBadge.style.background = isDay ? 'rgba(234, 179, 8, 0.25)' : 'rgba(59, 130, 246, 0.25)';
    resBadge.style.borderColor = isDay ? '#eab308' : '#3b82f6';
    resBadge.style.color = isDay ? '#fef08a' : '#bfdbfe';
    resBadge.innerHTML = `🎲 <strong>1d6: [${d}]</strong> ➔ ${isDay ? (isEn ? '☀️ DÍA' : '☀️ DÍA') : (isEn ? '🌙 NOCHE' : '🌙 NOCHE')}`;
  }

  // Also sync manual selector if exists
  const manualSel = document.getElementById('p3-manual-tod-d6');
  if (manualSel) manualSel.value = String(d);

  const text = isDay
    ? (isEn ? `🎲 1d6 = [${d}] ➔ DAY (Submerged attack recommended)` : `🎲 1d6 = [${d}] ➔ DÍA (Ataque sumergido recomendado)`)
    : (isEn ? `🎲 1d6 = [${d}] ➔ NIGHT (Surface attack permitted, -1 DRM to escorts without radar)` : `🎲 1d6 = [${d}] ➔ NOCHE (Ataque en superficie permitido, -1 DRM escoltas)`);
  showToast(text);
  return isDay ? 'day' : 'night';
}

function syncTodBadgeManual() {
  const todSelect = document.getElementById('wf-tod-select');
  const resBadge = document.getElementById('p3-tod-dice-result');
  if (todSelect && resBadge) {
    const isDay = (todSelect.value === 'day');
    const isEn = (window.currentLang === 'en');
    resBadge.style.display = 'inline-flex';
    resBadge.style.alignItems = 'center';
    resBadge.style.gap = '4px';
    resBadge.style.background = isDay ? 'rgba(234, 179, 8, 0.25)' : 'rgba(59, 130, 246, 0.25)';
    resBadge.style.borderColor = isDay ? '#eab308' : '#3b82f6';
    resBadge.style.color = isDay ? '#fef08a' : '#bfdbfe';
    resBadge.innerHTML = isDay ? (isEn ? '☀️ DAY (Manual)' : '☀️ DÍA (Manual)') : (isEn ? '🌙 NIGHT (Manual)' : '🌙 NOCHE (Manual)');
  }
}

function executeRule8110SwitchTimeOfDay(manualD6) {
  const isEn = (window.currentLang === 'en');
  
  // 1. Check if current target is a Capital Ship (Rule 8.1.10 explicitly forbids switching against Capital Ships)
  let isCapital = false;
  if (typeof campaignState !== 'undefined' && campaignState.combat && campaignState.combat.target) {
    const tgt = campaignState.combat.target;
    if (tgt.table === 'T4' || tgt.isCapital) isCapital = true;
    if (tgt.type && (tgt.type.toLowerCase().includes('capital') || tgt.type.toLowerCase().includes('carrier') || tgt.type.toLowerCase().includes('battleship') || tgt.type.toLowerCase().includes('acorazado') || tgt.type.toLowerCase().includes('portaaviones'))) isCapital = true;
  }
  const encSel = document.getElementById('wf-encounter-select');
  if (encSel && encSel.value === 'capital') isCapital = true;

  if (isCapital) {
    const msg = isEn
      ? "Rule [8.1.10]: Switching between Day and Night is NOT permitted against Capital Ships (they are simply too fast to maintain contact)."
      : "Regla [8.1.10]: Prohibido cambiar entre Día y Noche contra Buques Capitales (son demasiado veloces para mantener el contacto).";
    showToast(msg);
    alert(msg);
    return;
  }

  // 2. Determine current and target time of day
  const todSel = document.getElementById('wf-tod-select');
  const currentTod = todSel ? todSel.value : 'day';
  const nextTod = (currentTod === 'day') ? 'night' : 'day';
  const nextTodLabel = nextTod === 'night' ? (isEn ? 'NIGHT' : 'NOCHE') : (isEn ? 'DAY' : 'DÍA');

  // 3. Check radar operational status (-1 DRM)
  let hasRadar = false;
  if (typeof checkSubmarineRadarStatus === 'function') {
    const rInfo = checkSubmarineRadarStatus();
    hasRadar = !!(rInfo && rInfo.isOperational);
  } else if (typeof campaignState !== 'undefined') {
    hasRadar = !!(campaignState.hasRadar && !campaignState.radarDamaged);
  }
  const drm = hasRadar ? -1 : 0;

  // 4. Roll 1d6
  let d;
  if (typeof manualD6 === 'number' && manualD6 >= 1 && manualD6 <= 6) {
    d = manualD6;
  } else {
    d = Math.floor(Math.random() * 6) + 1;
  }
  const modified = Math.max(1, d + drm);
  const success = (modified <= 4);

  const resBadge = document.getElementById('p3-tod-switch-result');
  const lostBanner = document.getElementById('p3-contact-lost-banner');

  if (success) {
    // Successfully switched
    if (todSel) todSel.value = nextTod;
    if (typeof onRangeChange === 'function') onRangeChange();
    if (typeof syncTodBadgeManual === 'function') syncTodBadgeManual();
    if (typeof updateCombatChits === 'function') updateCombatChits();

    if (resBadge) {
      resBadge.style.display = 'inline-flex';
      resBadge.style.background = 'rgba(16,185,129,0.25)';
      resBadge.style.border = '1px solid #10b981';
      resBadge.style.color = '#6ee7b7';
      resBadge.innerHTML = `✅ 1d6: [${d}]${hasRadar ? ' -1 (Radar)' : ''} = <strong>${modified}</strong> ➔ ${isEn ? 'SUCCESS! Switched to ' : '¡ÉXITO! Cambiado a '}${nextTodLabel}`;
    }
    if (lostBanner) lostBanner.style.display = 'none';

    showToast(isEn
      ? `Rule [8.1.10]: Contact maintained! Time of day switched to ${nextTodLabel}.`
      : `Regla [8.1.10]: ¡Contacto mantenido! Momento cambiado a ${nextTodLabel}.`);
  } else {
    // Contact lost (5 or 6)
    if (resBadge) {
      resBadge.style.display = 'inline-flex';
      resBadge.style.background = 'rgba(239,68,68,0.25)';
      resBadge.style.border = '1px solid #ef4444';
      resBadge.style.color = '#fca5a5';
      resBadge.innerHTML = `❌ 1d6: [${d}]${hasRadar ? ' -1 (Radar)' : ''} = <strong>${modified}</strong> ➔ ${isEn ? 'CONTACT LOST!' : '¡CONTACTO PERDIDO!'}`;
    }
    if (lostBanner) lostBanner.style.display = 'block';

    if (typeof campaignState !== 'undefined' && campaignState.combat) {
      campaignState.combat.contactLost = true;
    }

    showToast(isEn
      ? `Rule [8.1.10]: 1d6 = [${d}]! Contact lost during transition. Target escaped!`
      : `Regla [8.1.10]: 1d6 = [${d}]! Contacto perdido durante la transición. ¡El blanco escapó!`);
  }
}

function finishEncounterContactLost() {
  const isEn = (window.currentLang === 'en');
  if (typeof logPatrolEvent === 'function') {
    logPatrolEvent(isEn ? "Target contact lost during Day/Night transition [Rule 8.1.10]." : "Contacto con el blanco perdido durante la transición Día/Noche [Regla 8.1.10].");
  }
  const lostBanner = document.getElementById('p3-contact-lost-banner');
  if (lostBanner) lostBanner.style.display = 'none';
  const resBadge = document.getElementById('p3-tod-switch-result');
  if (resBadge) resBadge.style.display = 'none';

  showToast(isEn ? "Encounter concluded. Returning to patrol track." : "Encuentro finalizado. Retornando al avance de patrulla.");
  if (typeof switchTab === 'function') {
    switchTab('tab-workflow');
  }
}

function rollInfiltration2d6(manualSuccess) {
  const isEn = (window.currentLang === 'en');
  
  // Rule [8.2.1]: Check if target is unescorted
  let isUnescorted = false;
  if (typeof campaignState !== 'undefined' && campaignState.combat && campaignState.combat.target) {
    const tgt = campaignState.combat.target;
    if (tgt.escort === false || tgt.escort === 'Sin Escolta' || tgt.escort === 'None' || (tgt.type && tgt.type.toLowerCase().includes('sin escolta'))) {
      isUnescorted = true;
    }
  }
  const encSel = document.getElementById('wf-encounter-select');
  if (encSel && encSel.value === 'ship') {
    const tgtTitle = document.getElementById('wf-target-title');
    if (tgtTitle && tgtTitle.innerText.includes('T1')) isUnescorted = true;
  }

  const resEl = document.getElementById('wf-infilt-res');

  if (isUnescorted && typeof manualSuccess !== 'boolean') {
    if (resEl) {
      resEl.style.display = 'block';
      resEl.style.color = '#34d399';
      resEl.innerHTML = isEn
        ? `★ Rule [8.2.1]: <strong>Unescorted Vessel!</strong> No detection roll needed. Close range (+1 to-hit) achieved automatically without risk!`
        : `★ Regla [8.2.1]: <strong>¡Buque Sin Escolta!</strong> No se realiza tirada de detección. Corta distancia (+1 a impactar) lograda automáticamente sin riesgo.`;
      showToast(isEn ? "Unescorted vessel: Close range achieved automatically!" : "¡Buque sin escolta: Corta distancia lograda automáticamente!");
    }
    return;
  }

  // Rule [8.2.1]: Check Order of the Golden Kite (-1 DRM to Detection roll)
  const hasGoldenKite = (typeof checkCommanderHasGoldenKite === 'function') ? checkCommanderHasGoldenKite() : false;
  const drm = hasGoldenKite ? -1 : 0;

  let d1, d2, sum, success;
  if (typeof manualSuccess === 'boolean') {
    success = manualSuccess;
    sum = success ? 7 : 11;
    d1 = Math.floor(sum / 2);
    d2 = sum - d1;
  } else {
    d1 = Math.floor(Math.random() * 6) + 1;
    d2 = Math.floor(Math.random() * 6) + 1;
    sum = d1 + d2;
    const modified = sum + drm;
    success = (modified <= 9);
  }

  const modifiedTotal = sum + drm;
  const drmStr = hasGoldenKite ? ` - 1 (🦅 ${isEn ? 'Golden Kite' : 'Milano de Oro'}) = <strong>${modifiedTotal}</strong>` : ` = <strong>${sum}</strong>`;

  if (resEl) {
    resEl.style.display = 'block';
    if (success) {
      resEl.style.color = '#34d399';
      resEl.innerHTML = isEn
        ? `★ Infiltration [Rule 8.2.1]: 🎲 2d6 = [${d1}+${d2}=${sum}]${drmStr} &le; 9 ➔ <strong>SUCCESSFUL INFILTRATION!</strong> Close range (+1 to-hit in B1) achieved safely.`
        : `★ Infiltración [Regla 8.2.1]: 🎲 2d6 = [${d1}+${d2}=${sum}]${drmStr} &le; 9 ➔ <strong>¡INFILTRACIÓN LOGRADA!</strong> Corta distancia (+1 a impactar en B1) alcanzada con éxito.`;
      showToast(isEn ? "Infiltration succeeded!" : "¡Infiltración lograda con éxito!");
    } else {
      resEl.style.color = '#ef4444';
      resEl.innerHTML = isEn
        ? `⚠️ Infiltration [Rule 8.2.1]: 🎲 2d6 = [${d1}+${d2}=${sum}]${drmStr} > 9 ➔ <strong>INFILTRATION FAILED!</strong> Escorts detect submarine and counter-attack before you can fire!`
        : `⚠️ Infiltración [Regla 8.2.1]: 🎲 2d6 = [${d1}+${d2}=${sum}]${drmStr} > 9 ➔ <strong>¡FALLO DE INFILTRACIÓN!</strong> ¡Las escoltas te detectan y atacan antes de que puedas disparar!`;
      showToast(isEn ? "Infiltration failed! Escorts alerted!" : "¡Infiltración fallida! ¡Escoltas alertadas!");
    }
  }
}

function testDepthDive(manualVal) {
  const isEn = (window.currentLang === 'en');
  let d;
  if (typeof manualVal === 'number' && manualVal >= 1 && manualVal <= 6) d = manualVal;
  else d = Math.floor(Math.random() * 6) + 1;
  const success = (d >= 3);
  const resText = success
    ? (isEn ? `⚓ Deep Dive: 🎲 1d6 = [${d}] ➔ SUCCESS! Reached deep test depth (-1 DRM to escort depth charges).` : `⚓ Inmersión Profunda: 🎲 1d6 = [${d}] ➔ ¡ÉXITO! Cota profunda alcanzada (-1 DRM a cargas de escolta).`)
    : (isEn ? `⚠️ Deep Dive: 🎲 1d6 = [${d}] ➔ FAILED. Hull creaks under pressure, no modifier.` : `⚠️ Inmersión Profunda: 🎲 1d6 = [${d}] ➔ FALLO. El casco cruje bajo presión, sin modificador.`);
  showToast(resText);
  const escortRes = document.getElementById('wf-escort-res-text');
  if (escortRes) {
    escortRes.innerHTML = `<span style="color:#38bdf8;">${resText}</span><br>` + escortRes.innerHTML;
  }
}

function rollB6DamageManual(manualD66) {
  const isEn = (window.currentLang === 'en');
  let red, white, d66;
  if (typeof manualD66 === 'number' && manualD66 >= 11 && manualD66 <= 66) {
    d66 = manualD66;
    red = Math.floor(d66 / 10);
    white = d66 % 10;
  } else {
    red = Math.floor(Math.random() * 6) + 1;
    white = Math.floor(Math.random() * 6) + 1;
    d66 = red * 10 + white;
  }
  let desc = (typeof CHART_B6_TABLE !== 'undefined' && CHART_B6_TABLE[d66]) ? CHART_B6_TABLE[d66] : (isEn ? "Minor Damage" : "Avería Menor");
  if (typeof desc === 'function') {
    desc = desc(isEn);
  }
  if (isEn && window.I18N_PHASE3_B6_EN && window.I18N_PHASE3_B6_EN[d66]) {
    desc = window.I18N_PHASE3_B6_EN[d66];
  }
  if ([12, 21, 31, 43, 44, 51].includes(d66)) {
    if (typeof window.applySubmarineDamage === 'function') window.applySubmarineDamage({ flooding: 1, source: 'escort', reason: desc });
  } else if (d66 === 54) {
    if (typeof window.applySubmarineDamage === 'function') window.applySubmarineDamage({ flooding: 2, source: 'escort', reason: desc });
  } else if ([33, 35, 41, 45, 52, 55].includes(d66)) {
    if (typeof window.applySubmarineDamage === 'function') window.applySubmarineDamage({ hullDamage: 1, source: 'escort', reason: desc });
  } else if (d66 === 65) {
    if (typeof window.applySubmarineDamage === 'function') window.applySubmarineDamage({ hullDamage: 2, source: 'escort', reason: desc });
  } else if (d66 === 34) {
    if (typeof rollB7CrewInjury === 'function') rollB7CrewInjury();
  } else if (d66 === 53) {
    if (typeof rollB7CrewInjury === 'function') { rollB7CrewInjury(); rollB7CrewInjury(); }
  } else {
    if (typeof window.applySubmarineDamage === 'function') window.applySubmarineDamage({ systemsDamaged: desc, source: 'escort', reason: desc });
  }

  const escortRes = document.getElementById('wf-escort-res-text');
  if (escortRes) {
    escortRes.innerHTML = `<span style="color:#f87171; font-weight:bold;">🛠️ Chart B6: 🎲 d66 = [${red}, ${white} ➔ ${d66}]: ${desc}</span><br>` + escortRes.innerHTML;
  }
  showToast(isEn ? `Damage [B6]: d66=[${d66}] ➔ ${desc}` : `Avería [B6]: d66=[${d66}] ➔ ${desc}`);
}

window.rollShipSizeD6 = rollShipSizeD6;
window.rollMerchantShip = rollMerchantShip;
window.rollEscortShip = rollEscortShip;
window.rollTargetGeneration = rollTargetGeneration;
window.rollChartT1 = rollChartT1;
window.rollChartT2 = rollChartT2;
window.rollChartT3 = rollChartT3;
window.rollChartT4 = rollChartT4;
window.rollChartT5 = rollChartT5;
window.onEncounterTypeChange = onEncounterTypeChange;
window.setEncounterTypeQuick = setEncounterTypeQuick;
window.rollTableA3Encounter = rollTableA3Encounter;
window.rollEncounterFromPhase3 = rollEncounterFromPhase3;
window.updatePhase3EncounterUI = updatePhase3EncounterUI;
window.rollTimeOfDayD6 = rollTimeOfDayD6;
window.syncTodBadgeManual = syncTodBadgeManual;
window.renderTargetUI = renderTargetUI;
window.rollInfiltration2d6 = rollInfiltration2d6;
window.testDepthDive = testDepthDive;
window.rollB6DamageManual = rollB6DamageManual;
