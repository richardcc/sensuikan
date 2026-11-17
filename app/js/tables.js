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
      for (let opt of select.options) {
        if (opt.value === currentArea || opt.value.toLowerCase() === currentArea.toLowerCase() || currentArea.toLowerCase().includes(opt.value.toLowerCase())) {
          select.value = opt.value;
          break;
        }
      }
    }

    function onManualAreaSelected(area) {
      if (!area) return;

      campaignState.workflow.assignedArea = area;
      const isEn = window.currentLang === 'en';

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
      saveState();
      showToast(isEn ? "Area set manually: " + area : "Área establecida manualmente: " + area);
    }

    function rollPatrolAssignment() {
      const selectedMonth = campaignState.workflow.selectedMonth || "1941-12";
      const isEn = window.currentLang === 'en';
      const period = getA1PeriodForDate(selectedMonth);
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;

      const colData = CHART_A1_DATA[period] || CHART_A1_DATA["1941"];
      let area = colData[sum] || "Pearl Harbor";

      // Regla 4.7.2: Con base en Paramushiro, todas las patrullas subsiguientes están asignadas a las Aleutianas hasta 7/43
      const curBase = normalizeBaseName(campaignState.workflow.startingBase || "Yokosuka");
      let note = "";
      if (curBase === "Paramushiro" && selectedMonth < "1943-07") {
        area = "Aleutians";
        note = isEn
          ? " [⚓ Rule 4.7.2: Based at Paramushiro - Patrol fixed to Aleutians until 7/43]"
          : " [⚓ Regla 4.7.2: Estacionado en Paramushiro - Patrulla fijada a Aleutianas hasta 7/43]";
      } else {
        if (area.includes("Europe*")) note = isEn ? " (★ Type A and B submarines only; others reroll)" : " (★ Tipos A y B únicamente; otros vuelven a tirar)";
        if (area.includes("Panama**")) note = isEn ? " (★★ Floatplane submarines only; others reroll)" : " (★★ Solo subs con hidroavión; otros vuelven a tirar)";
      }

      campaignState.workflow.assignedArea = area;
      campaignState.workflow.firstTwelveRolled = false;

      // Sincronizar el desplegable de área manual
      const areaSelect = document.getElementById('wf-area-select');
      if (areaSelect) {
        for (let opt of areaSelect.options) {
          if (opt.value === area || opt.value.toLowerCase() === area.toLowerCase() || area.toLowerCase().includes(opt.value.toLowerCase())) {
            areaSelect.value = opt.value;
            break;
          }
        }
      }

      document.getElementById('wf-patrol-area-res').innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? '2d6 Roll' : 'Dados 2d6'}: [${d1} + ${d2} = ${sum}]</span> ➔ <strong>${area}${note}</strong> <span style="font-size:0.75rem; color:#94a3b8;">[${isEn ? 'Chart A1' : 'Tabla A1'} (${period})]</span>`;

      // Regla 4.7.2: Si es asignado a las Aleutianas y no está en Paramushiro, se traslada automáticamente la base
      if (area.toLowerCase().includes("aleutians") && campaignState.workflow.startingBase !== "Paramushiro") {
        handleBaseChange("Paramushiro");
        showToast("⚓ Regla 4.7.2: Misión a las Aleutianas. Submarino trasladado automáticamente a Paramushiro.");
      }

      syncCurrentPatrolToLog();
      buildPatrolTable();
      updateSpecialEventsForMonthArea(); renderMissionChits();
      recalculatePatrolTrack();
      if (typeof updateOperationsMap === 'function') updateOperationsMap();
      showToast(isEn ? "Area assigned (Chart A1): " + area : "Área asignada (Tabla A1): " + area);
      saveState();
    }

    function selectA1AreaManual(area, roll) {
      const isEn = window.currentLang === 'en';
      campaignState.workflow.assignedArea = area;
      campaignState.workflow.lastA1Roll = roll;
      const period = getA1PeriodForDate(campaignState.workflow.selectedMonth || "1941-12");
      document.getElementById('wf-patrol-area-res').innerText = `${area} [${isEn ? 'Chart A1' : 'Tabla A1'} (${period}) - ${isEn ? 'Selected' : 'Seleccionada'} (2d6=${roll})]`;

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
      saveState();
      showToast("Área seleccionada (Tabla A1): " + area);
    }


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
      const secs = ['patrol', 'combat', 'commander', 'campaign', 'midget', 'kaiten', 'floatplane', 'optional'];
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
      const idx = campaignState.workflow.currentBoxIndex || 0;
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");
      
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const targetZone = isTransit ? "Transit" : (isSpecialBox ? "Special Mission" : mapA1ToA3Zone(assignedArea));
      const zoneLabel = isEn
        ? (targetZone === "Special Mission" ? "Special Mission" : targetZone)
        : (targetZone === "Transit" ? "Tránsito" : targetZone === "Special Mission" ? "Misión Especial" : targetZone);

      const badge = document.getElementById('p2-current-zone-badge');
      if (badge) badge.innerText = (isEn ? "Current Zone: " : "Zona Actual: ") + zoneLabel;
      const thZone = document.getElementById('th-p2-zone-name');
      if (thZone) thZone.innerText = (isEn ? "Encounter in " : "Encuentro en ") + zoneLabel;

      const tb = document.getElementById('phase2-a3-tbody');
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

        const fastBadge = item.fast 
          ? '<span style="color:#38bdf8; font-weight:bold; font-size:0.68rem;" title="Fast Capital Ship">➡ Fast</span>' 
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

      return `
        <div id="t4-block-${key}" class="t4-era-block" style="background:#0f172a; border:1px solid #4c1d95; border-radius:6px; overflow:hidden; margin-bottom:12px;">
          <div style="background:linear-gradient(90deg, #581c87, #3b0764); padding:5px 10px; font-weight:bold; color:#e9d5ff; font-size:0.75rem; display:flex; justify-content:space-between; align-items:center;">
            <span>⚓ ${title}</span>
            <span style="font-size:0.68rem; color:#d8b4fe;">${keys.length} Buques Oficiales</span>
          </div>
          <table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">
            <thead>
              <tr style="background:#1e293b; color:#94a3b8; font-size:0.67rem; border-bottom:2px solid #334155;">
                <th style="padding:4px 6px; text-align:center; width:30px;">Dado</th>
                <th style="padding:4px 6px; text-align:center; width:48px;">Tipo</th>
                <th style="padding:4px 6px;">Buque Capital</th>
                <th style="padding:4px 6px; text-align:right; width:75px;">Tonelaje</th>
                <th style="padding:4px 6px; text-align:center; width:55px;">Hundir</th>
                <th style="padding:4px 6px; text-align:center; width:55px;">Veloc.</th>
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

    function rollTargetGeneration() {
      const enc = campaignState.workflow.currentEncounter || "";
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

    function applyTargetToWorkflow(t) {
      const isEn = (window.currentLang === 'en');
      campaignState.workflow.currentTarget = t;
      if (typeof checkSubVsSubTarget === 'function') checkSubVsSubTarget(t);
      if (typeof updatePatrolPhaseUI === 'function') updatePatrolPhaseUI();
      const nameEl = document.getElementById('wf-target-name');
      const subEl = document.getElementById('wf-target-sub');
      if (nameEl) nameEl.innerHTML = `<span style="color:var(--gold-400);">[${t.chart}]</span> ${t.name} <span style="font-size:0.75rem; color:#94a3b8;">(#${t.roll100})</span>`;
      if (subEl) {
        const tankerBadge = t.isTanker ? (isEn ? ' <span class="badge" style="background:#dc2626; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:3px;">TANKER (T)</span>' : ' <span class="badge" style="background:#dc2626; color:#fff; font-size:0.65rem; padding:1px 5px; border-radius:3px;">PETROLERO (T)</span>') : '';
        const escortLabel = t.escort ? (isEn ? 'Escort Present' : 'Escolta presente') : (isEn ? 'No Escort' : 'Sin escolta');
        const rollLabel = t.d6 ? ` • ${isEn ? 'Contact roll 1d6' : 'Tirada de contacto 1d6'}: [${t.d6}]` : (t.roll ? ` • ${isEn ? `${t.chart} roll` : `Tirada ${t.chart}`}: [${t.roll}]` : '');
        subEl.innerHTML = `${t.tons.toLocaleString()} tons • ${t.type}${tankerBadge} • ${escortLabel}${rollLabel}`;
      }
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

    function onRangeChange() {
      const r = document.getElementById('wf-range-select').value;
      document.getElementById('wf-infilt-res').style.display = (r === 'close') ? 'block' : 'none';
    }

    // CHART B6 DAMAGE TABLE (d66)
    

function rollB7Flooding() {
      const d = Math.floor(Math.random() * 6) + 1;
      const engSW = !!campaignState.crewInjuries && campaignState.crewInjuries.engineer;
      const mod = engSW ? 1 : 0;
      const total = d + mod;
      const el = document.getElementById('wf-b7-flooding-res');
      if (total <= 4) {
        el.style.color = '#34d399';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Tirada 1d6: [${d}]${mod ? ' (+1 MTD)' : ''} = ${total}</span> ➔ ¡Inundación Contenida! (Flooding Halted). No se marcan casillas adicionales.`;
        showToast("Inundación contenida con éxito.");
      } else {
        el.style.color = '#ef4444';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Tirada 1d6: [${d}]${mod ? ' (+1 MTD)' : ''} = ${total}</span> ➔ Inundación Descontrolada (+1 Casilla). Marca 1 casilla adicional en el tapiz.`;
        showToast("¡Alerta! Inundación adicional en el submarino.");
      }
    }

    function rollB7SystemRepair() {
      const sys = document.getElementById('wf-b7-system-select').value;
      const el = document.getElementById('wf-b7-repair-res');
      if (sys === 'hull') {
        el.style.color = '#f87171';
        el.innerText = "❌ El daño de casco (Hull) NO se puede reparar en alta mar. Requiere dique seco (Refit).";
        return;
      }
      const d = Math.floor(Math.random() * 6) + 1;
      const engSW = !!campaignState.crewInjuries && campaignState.crewInjuries.engineer;
      const mod = engSW ? 1 : 0;
      const total = d + mod;
      
      let reqMax = 2; // Default for most systems: 1-2 fixed
      if (sys === 'fuel' || sys === 'radar') reqMax = 3;
      if (sys === 'engines' || sys === 'batteries') reqMax = 4;

      if (total <= reqMax) {
        el.style.color = '#34d399';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Tirada 1d6: [${d}]${mod ? ' (+1 MTD)' : ''} = ${total} (requería &le;${reqMax})</span> ➔ ¡REPARADO CON ÉXITO! El sistema vuelve a estar operativo.`;
        showToast("¡Sistema reparado con éxito!");
      } else {
        el.style.color = '#ef4444';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Tirada 1d6: [${d}]${mod ? ' (+1 MTD)' : ''} = ${total} (requería &le;${reqMax})</span> ➔ NO REPARABLE EN EL MAR (INOP). Requiere dique seco (Refit).`;
        showToast("Sistema no reparable en el mar.");
      }
    }

    function rollB7CrewInjury() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const sevRoll = Math.floor(Math.random() * 6) + 1;

      let role = "Crew (Dotación genérica)";
      let roleKey = "crew";
      let penalty = "Si todas las casillas genéricas quedan SW/KIA: +1 To-Hit de torpedos.";

      if (sum === 2) {
        role = "Captain (Capitán)";
        roleKey = "captain";
        penalty = "El Primer Oficial (Exec) toma el mando. Penalizaciones: Detección +1, To-Hit +1.";
      } else if (sum === 3) {
        role = "Engineer (Jefe de Máquinas)";
        roleKey = "engineer";
        penalty = "Todas las tiradas de reparación y contención de inundación reciben +1 MTD.";
      } else if (sum === 4) {
        role = "Executive Officer (Primer Oficial / XO)";
        roleKey = "exec";
        penalty = "Si el XO estaba al mando, el 3er Oficial toma el mando: Detección +1, To-Hit +1.";
      } else if (sum === 5) {
        role = "Medic (Oficial Médico)";
        roleKey = "medic";
        penalty = "Todos los tripulantes con Herida Grave (SW) fallecen (KIA) tras cada zona con 1d6 >= 4.";
      } else if (sum >= 6 && sum <= 10) {
        role = `Crew (Dotación genérica, casilla #${sum - 5})`;
        roleKey = "crew";
        penalty = "Si todas las casillas genéricas quedan SW o KIA: To-Hit de torpedos empeora en +1.";
      } else if (sum === 11) {
        role = "Navigator (Navegante)";
        roleKey = "navigator";
        penalty = "Submarino debe abortar si el navegante estaba ejerciendo de Capitán.";
      } else if (sum === 12) {
        role = "Pilot / Midget / Kaiten Crew (Dotación Aérea o Minisubmarino)";
        roleKey = "pilot";
        penalty = "Misión especial falla automáticamente si todos caen SW o KIA.";
      }

      let sev = "LW (Light Wound - Herida Leve)";
      let sevDesc = "Sin efecto negativo en combate.";
      if (sevRoll >= 4 && sevRoll <= 5) {
        sev = "SW (Serious Wound - Herida Grave)";
        sevDesc = "Incapacitado para el servicio.";
      } else if (sevRoll === 6) {
        sev = "KIA (Killed In Action - Muerto en Combate)";
        sevDesc = "Baja definitiva en combate.";
      }

      const el = document.getElementById('wf-b7-crew-res');
      el.innerHTML = `<strong>Puesto (2d6 = ${sum} [${d1}+${d2}]):</strong> ${role}<br><strong>Gravedad (1d6 = ${sevRoll}):</strong> <span style="color:#fbbf24;">${sev}</span> (${sevDesc})<br><strong>Efecto en Campaña:</strong> ${penalty}`;
      showToast(`Baja registrada: ${role} (${sev})`);
    }

    // CHARTS M5 - M8: MIDGET SUBMARINE (KO-HYOTEKI) LOGIC
    





// ====================================================================
// INTERACTIVE FUNCTIONS FOR FLOAT-PLANE CHARTS (P3, P4, P5, P6) [RULE 7.17]
// ====================================================================
function rollChartP3() {
  const phase = document.getElementById('p3-mission-phase') ? document.getElementById('p3-mission-phase').value : 'targetRecon';
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const entry = CHART_P3_DATA[sum] || { transit: "--", recon: "--", targetRecon: "--", targetBombing: "--" };

  let val = entry[phase] || "--";
  let col = '#94a3b8';
  let badgeText = val;

  if (val.includes('Aircraft')) {
    col = '#f87171';
    badgeText = '✈️ ¡ALERTA AÉREA! (' + val + ')';
  } else if (val.includes('Capital Ship')) {
    col = '#fde047';
    badgeText = '⚓ ¡BUQUE CAPITAL! (' + val + ')';
  } else if (val.includes('Ship') || val.includes('CA') || val.includes('CL') || val.includes('DD') || val.includes('Tanker')) {
    col = '#93c5fd';
    badgeText = '🚢 Contacto Naval: ' + val;
  } else if (val.includes('AA')) {
    col = '#ef4444';
    badgeText = '💥 Fuego Antiaéreo (' + val + ')';
  } else if (val === '--') {
    col = '#64748b';
    badgeText = 'Sin Encuentro (Despejado)';
  }

  const phaseNames = {
    transit: 'Tránsito (Transit)',
    recon: 'Reconocimiento (Recon)',
    targetRecon: 'Objetivo - Reconocimiento (Target Recon)',
    targetBombing: 'Objetivo - Bombardeo Canal (Target Bombing)'
  };

  const resEl = document.getElementById('res-interactive-p3');
  if (resEl) {
    resEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span style="color:var(--gold-400); font-weight:bold;">Tirada 2d6:</span> 
          <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d1}+${d2} = ${sum}]</span>
          <span style="color:#94a3b8; font-size:0.75rem; margin-left:6px;">(${phaseNames[phase] || phase})</span>
        </div>
        <div style="font-weight:bold; color:${col}; background:rgba(15,23,42,0.8); border:1px solid ${col}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
          ${badgeText}
        </div>
      </div>
    `;
  }

  document.querySelectorAll('.p3-row').forEach(r => r.style.backgroundColor = '');
  const activeRow = document.getElementById('p3-row-' + sum);
  if (activeRow) {
    activeRow.style.backgroundColor = 'rgba(2, 132, 199, 0.35)';
  }

  showToast(`P3 Encuentro [${sum}]: ${val}`);
}

function rollChartP6() {
  const d = Math.floor(Math.random() * 6) + 1;
  let key = (d <= 2) ? "1-2" : (d <= 5 ? "3-5" : "6");
  const data = CHART_P6_DATA[key];

  const resEl = document.getElementById('res-interactive-p6');
  if (resEl) {
    resEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span style="color:var(--gold-400); font-weight:bold;">Tirada 1d6:</span> 
          <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d}]</span>
        </div>
        <div style="font-weight:bold; color:${data.color}; background:rgba(15,23,42,0.8); border:1px solid ${data.color}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
          🎯 ${data.result}
        </div>
      </div>
      <div style="font-size:0.72rem; color:#94a3b8; margin-top:4px;">${data.desc}</div>
    `;
  }

  document.querySelectorAll('.p6-row').forEach(r => r.style.backgroundColor = '');
  const activeRow = document.getElementById('p6-row-' + key);
  if (activeRow) activeRow.style.backgroundColor = 'rgba(234, 179, 8, 0.3)';

  showToast(`P6 Bombardeo [${d}]: ${data.result}`);
}

function resolveChartP4FighterAttack() {
  const choice = parseInt(document.getElementById('p4-recon-choice') ? document.getElementById('p4-recon-choice').value : '1') || 1;
  const fighterDie = Math.floor(Math.random() * 6) + 1;
  const outcome = CHART_P4_AIR_COMBAT.matrix[choice][fighterDie];

  let outcomeHtml = '';
  let outcomeText = '';
  if (outcome === 'E') {
    outcomeHtml = `<span style="background:rgba(16,185,129,0.25); color:#6ee7b7; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-weight:bold;">✈️ ¡EVASIÓN EXITOSA (E)! El encuentro termina.</span>`;
    outcomeText = '¡Evasión exitosa!';
  } else if (outcome === 0) {
    outcomeHtml = `<span style="background:rgba(59,130,246,0.2); color:#93c5fd; border:1px solid #3b82f6; padding:2px 8px; border-radius:4px; font-weight:bold;">🛡️ 0 Daños - La ráfaga del caza pasa de largo.</span>`;
    outcomeText = '0 daños';
  } else {
    outcomeHtml = `<span style="background:rgba(239,68,68,0.25); color:#fca5a5; border:1px solid #ef4444; padding:2px 8px; border-radius:4px; font-weight:bold;">💥 ¡${outcome} IMPACTO(S) AL HIDROAVIÓN!</span>`;
    outcomeText = `${outcome} impacto(s) recibido(s)`;
  }

  const resEl = document.getElementById('res-interactive-p4');
  if (resEl) {
    resEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span style="color:#94a3b8;">Tu Maniobra:</span> <strong style="color:var(--gold-400);">#${choice}</strong> | 
          <span style="color:#94a3b8;">Dado Caza (1d6):</span> <strong style="color:#fde047;">[${fighterDie}]</strong>
        </div>
        <div>${outcomeHtml}</div>
      </div>
    `;
  }

  document.querySelectorAll('.p4-cell').forEach(c => c.style.outline = '');
  const cell = document.getElementById(`p4-cell-${choice}-${fighterDie}`);
  if (cell) cell.style.outline = '2px solid #fde047';

  showToast(`Combate P4: Caza sacó ${fighterDie} -> ${outcomeText}`);
}

function rollChartP4RearGun() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const gun = CHART_P4_AIR_COMBAT.rearGun[sum] || { hits: 0, desc: "Miss", color: "#94a3b8" };

  const resEl = document.getElementById('res-interactive-p4-reargun');
  if (resEl) {
    resEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span style="color:var(--gold-400); font-weight:bold;">Ametralladora Trasera (2d6):</span> 
          <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d1}+${d2} = ${sum}]</span>
        </div>
        <div style="font-weight:bold; color:${gun.color}; background:rgba(15,23,42,0.8); border:1px solid ${gun.color}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
          🔫 ${gun.desc}
        </div>
      </div>
    `;
  }

  showToast(`Ametralladora Trasera [${sum}]: ${gun.desc}`);
}

function rollChartP5() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const entry = CHART_P5_DATA[sum] || { result: "Ineffective", desc: "--", dmg: 0, color: "#94a3b8" };

  let extraNote = '';
  if (entry.crewCheck) {
    const crewDie = Math.floor(Math.random() * 6) + 1;
    const victim = (crewDie <= 3) ? "Piloto (1-3)" : "Observador (4-6)";
    const b8d1 = Math.floor(Math.random() * 6) + 1;
    const b8d2 = Math.floor(Math.random() * 6) + 1;
    const b8sum = b8d1 + b8d2;
    extraNote = `<div style="margin-top:4px; font-size:0.72rem; color:#fda4af; background:rgba(180,83,9,0.3); padding:3px 8px; border-radius:3px; border:1px solid #d97706;">
      ⚠️ Herida en tripulación: 🎲 1d6=[${crewDie}] &rarr; <strong>${victim}</strong> | Gravedad [B8 2d6: ${b8d1}+${b8d2}=${b8sum}]
    </div>`;
  }

  const resEl = document.getElementById('res-interactive-p5');
  if (resEl) {
    resEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <span style="color:var(--gold-400); font-weight:bold;">Tirada AA (2d6):</span> 
          <span style="background:#0f172a; padding:2px 7px; border-radius:4px; border:1px solid #334155; color:#fde047; font-weight:bold;">[${d1}+${d2} = ${sum}]</span>
        </div>
        <div style="font-weight:bold; color:${entry.color}; background:rgba(15,23,42,0.8); border:1px solid ${entry.color}; padding:3px 10px; border-radius:4px; font-size:0.8rem;">
          💥 ${entry.result}
        </div>
      </div>
      <div style="font-size:0.72rem; color:#94a3b8; margin-top:4px;">${entry.desc}</div>
      ${extraNote}
    `;
  }

  document.querySelectorAll('.p5-row').forEach(r => r.style.backgroundColor = '');
  const activeRow = document.getElementById('p5-row-' + sum);
  if (activeRow) activeRow.style.backgroundColor = 'rgba(239, 68, 68, 0.35)';

  showToast(`P5 Antiaéreo [${sum}]: ${entry.result}`);
}
