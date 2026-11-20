// =========================================================================
// SENSUiKAN: CRONOLOGÍA DE MAYORES EVENTOS HISTÓRICOS [REGLA 7.14]
// Gestor de Fichas de Eventos Mayores y Asignación de Patrullas
// =========================================================================

let majorEventsFlipped = false;
let majorEventsYearFilter = 'all';
let majorEventsZoneFilter = 'all';
let majorEventsOnlyCurrentMonth = false;

function initMajorEventsTab() {
  renderMajorEventsGrid();
}

function renderMajorEventsGrid() {
  const isEn = (window.currentLang === 'en');
  const container = document.getElementById('major-events-cards-container');
  if (!container) return;

  if (typeof MISSION_CHITS === 'undefined' || !Array.isArray(MISSION_CHITS)) {
    container.innerHTML = `<div style="color:#ef4444; padding:20px;">Error: No se encontró la base de datos MISSION_CHITS.</div>`;
    return;
  }

  const subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : 'Type_B_Class';
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]) ? SUB_DB.submarines[subKey] : {};
  const currentMonth = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.selectedMonth) ? campaignState.workflow.selectedMonth : '1941-12';

  // Filter events
  let events = MISSION_CHITS.filter(c => c.cat === 'mission');

  // Filter by year
  if (majorEventsYearFilter !== 'all') {
    events = events.filter(c => {
      if (!c.validMonths) return false;
      return c.validMonths.some(m => m.startsWith(majorEventsYearFilter));
    });
  }

  // Filter by zone
  if (majorEventsZoneFilter !== 'all') {
    events = events.filter(c => {
      const t = (c.redTitle || '').toLowerCase();
      const z = majorEventsZoneFilter.toLowerCase();
      return t.includes(z);
    });
  }

  // Filter by current month
  if (majorEventsOnlyCurrentMonth) {
    events = events.filter(c => c.validMonths && c.validMonths.includes(currentMonth));
  }

  const countBadge = document.getElementById('major-events-count-badge');
  if (countBadge) {
    countBadge.innerText = `${events.length} ${isEn ? 'Markers' : 'Fichas'}`;
  }

  if (events.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px 20px; background:rgba(15,23,42,0.6); border:1px dashed #475569; border-radius:8px; color:#94a3b8;">
        ${isEn ? 'No Major Events match the selected filters.' : 'Ningún Mayor Evento coincide con los filtros seleccionados.'}
      </div>
    `;
    return;
  }

  container.innerHTML = events.map(c => {
    const isCurrentlyActive = c.validMonths && c.validMonths.includes(currentMonth);
    const assignedMission = determineMajorEventAssignedMission(c, subData);

    const imgSrc = majorEventsFlipped ? `assets/chits/${c.whiteImg}` : `assets/chits/${c.redImg}`;
    const altImgSrc = majorEventsFlipped ? `assets/chits/${c.redImg}` : `assets/chits/${c.whiteImg}`;

    // Priority missions HTML list
    const missionLines = c.whiteLines || [c.whiteImg.replace('.jpg', '')];
    const missionsHtml = missionLines.map((mLine, idx) => {
      const isAssigned = (mLine === assignedMission.missionName);
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; padding:3px 6px; border-radius:3px; margin-bottom:2px; background:${isAssigned ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.03)'}; border-left:3px solid ${isAssigned ? '#22c55e' : '#475569'};">
          <span style="color:${isAssigned ? '#86efac' : '#cbd5e1'}; font-weight:${isAssigned ? 'bold' : 'normal'};">
            ${idx + 1}.ª ${mLine}
          </span>
          ${isAssigned ? `<span style="color:#86efac; font-size:0.70rem; font-weight:bold;">★ ${isEn ? 'ASSIGNED' : 'ASIGNADA'}</span>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="flow-card" style="background:#0f172a; border:2px solid ${isCurrentlyActive ? '#ef4444' : '#334155'}; border-radius:8px; padding:12px; box-shadow:0 3px 12px rgba(0,0,0,0.3); display:flex; flex-direction:column; justify-content:space-between; position:relative;">
        ${isCurrentlyActive ? `<div style="position:absolute; top:-10px; right:10px; background:#ef4444; color:#fff; font-size:0.68rem; font-weight:bold; padding:1px 8px; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.4);">${isEn ? '⚡ ACTIVE THIS MONTH' : '⚡ ACTIVO ESTE MES'}</div>` : ''}

        <div>
          <!-- Header: Chit Image & Title -->
          <div style="display:flex; gap:12px; align-items:center; margin-bottom:10px; border-bottom:1px solid #1e293b; padding-bottom:8px;">
            <div style="width:68px; height:68px; min-width:68px; border-radius:6px; overflow:hidden; border:2px solid ${majorEventsFlipped ? '#e2e8f0' : '#ef4444'}; box-shadow:0 2px 8px rgba(0,0,0,0.5); background:#020617; cursor:pointer;" onclick="toggleSingleEventChit(this, '${c.redImg}', '${c.whiteImg}')" title="${isEn ? 'Click to flip chit' : 'Haz clic para voltear la ficha'}">
              <img src="${imgSrc}" data-red="${c.redImg}" data-white="${c.whiteImg}" alt="${c.redTitle}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            
            <div style="overflow:hidden;">
              <h4 style="margin:0 0 2px 0; color:#f8fafc; font-size:1.0rem; font-family:'Cinzel', serif; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">
                ${c.redTitle}
              </h4>
              <div style="font-size:0.76rem; color:var(--gold-400); font-weight:bold; margin-bottom:2px;">
                📅 ${c.redDate}
              </div>
              <div style="font-size:0.72rem; color:#94a3b8;">
                🗺️ ${c.redTitle}
              </div>
            </div>
          </div>

          <!-- Description -->
          <p style="font-size:0.77rem; color:#cbd5e1; line-height:1.35; margin:0 0 10px 0; min-height:42px;">
            ${c.desc || ''}
          </p>

          <!-- Rule 7.14 Priority Mission Order -->
          <div style="background:rgba(0,0,0,0.3); border:1px solid #334155; border-radius:6px; padding:6px 8px; margin-bottom:10px;">
            <div style="font-size:0.70rem; color:var(--gold-400); text-transform:uppercase; font-weight:bold; margin-bottom:4px; display:flex; justify-content:space-between;">
              <span>${isEn ? 'Rule 7.14 Mission Priority:' : 'Prioridad Regla 7.14:'}</span>
              <span style="color:#94a3b8; font-weight:normal;">(${isEn ? 'Top to bottom' : 'Arriba a abajo'})</span>
            </div>
            ${missionsHtml}
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="border-top:1px solid #1e293b; padding-top:8px; display:flex; justify-content:space-between; align-items:center; gap:6px;">
          <span style="font-size:0.70rem; color:#94a3b8;">
            ${isEn ? 'Valid:' : 'Meses:'} ${(c.validMonths || []).join(', ')}
          </span>
          <button type="button" class="action-btn" onclick="assignPatrolToMajorEvent('${c.id}')" style="font-size:0.75rem; padding:5px 10px; border-color:#ef4444; color:#fca5a5; background:rgba(239,68,68,0.15);" title="${isEn ? 'Set Game Flow destination to this Major Event' : 'Establecer destino del Game Flow en este Mayor Evento'}">
            ⚓ ${isEn ? 'Deploy Event' : 'Embarcar en Evento'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function determineMajorEventAssignedMission(chit, subData) {
  const isEn = (window.currentLang === 'en');
  const lines = chit.whiteLines || [];

  for (const line of lines) {
    const l = line.toLowerCase();
    if (l.includes('midget')) {
      if (subData.has_midget_carrier || subData.class_name?.includes("Type C") || subData.class_name?.includes("Type A")) {
        return { missionName: line, reason: isEn ? "Equipped with Ko-Hyoteki midget carrier" : "Equipado con soporte Ko-Hyoteki" };
      }
    } else if (l.includes('recon') || l.includes('bomb')) {
      if (subData.has_aircraft || subData.aircraft_type) {
        return { missionName: line, reason: isEn ? "Equipped with scout floatplane/hangar" : "Equipado con hidroavión y hangar" };
      }
    } else if (l.includes('kaiten')) {
      if (subData.has_kaiten || subData.kaiten_note) {
        return { missionName: line, reason: isEn ? "Equipped with Kaiten suicide torpedoes" : "Equipado con torpedos Kaiten" };
      }
    } else if (l.includes('minelay')) {
      if (subData.has_mines || subData.class_name?.includes("Kirai")) {
        return { missionName: line, reason: isEn ? "Equipped with internal minelaying tubes" : "Equipado con tubos minadores" };
      }
    } else if (l.includes('transport') || l.includes('picket') || l.includes('shore') || l.includes('patrol')) {
      // General fleet missions executable by all subs
      return { missionName: line, reason: isEn ? "Standard fleet submarine tasking" : "Misión operativa estándar" };
    }
  }

  // Fallback: If submarine cannot perform any of the listed special missions, it conducts a normal patrol that counts as Special Mission per Rule 7.14
  return { 
    missionName: lines[lines.length - 1] || 'Patrol', 
    reason: isEn ? "Perimeter Combat Patrol [Rule 7.14]" : "Patrulla de Combate Perimetral [Regla 7.14]" 
  };
}

function toggleMajorEventsFlip() {
  majorEventsFlipped = !majorEventsFlipped;
  const btn = document.getElementById('btn-toggle-event-chits-flip');
  const isEn = (window.currentLang === 'en');
  if (btn) {
    btn.innerText = majorEventsFlipped 
      ? (isEn ? "🔄 Flip Chits (Front Red Side)" : "🔄 Voltear Fichas (Cara Roja)") 
      : (isEn ? "🔄 Flip Chits (Back White Side)" : "🔄 Voltear Fichas (Cara Blanca)");
  }
  renderMajorEventsGrid();
}

function toggleSingleEventChit(el, redImg, whiteImg) {
  const img = el.querySelector('img');
  if (!img) return;
  const isCurrentlyWhite = img.src.includes(whiteImg);
  img.src = isCurrentlyWhite ? `assets/chits/${redImg}` : `assets/chits/${whiteImg}`;
}

function filterMajorEventsByYear(year, btnEl) {
  majorEventsYearFilter = year;
  document.querySelectorAll('.event-filter-year').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  renderMajorEventsGrid();
}

function filterMajorEventsByZone(zone) {
  majorEventsZoneFilter = zone;
  renderMajorEventsGrid();
}

function filterMajorEventsCurrentMonth() {
  majorEventsOnlyCurrentMonth = !majorEventsOnlyCurrentMonth;
  renderMajorEventsGrid();
  const isEn = (window.currentLang === 'en');
  showToast(majorEventsOnlyCurrentMonth 
    ? (isEn ? "Filtered: Active events for current month" : "Filtrado: Eventos activos en el mes actual") 
    : (isEn ? "Showing all historical events" : "Mostrando todos los eventos"));
}

function assignPatrolToMajorEvent(eventId) {
  const isEn = (window.currentLang === 'en');
  if (typeof MISSION_CHITS === 'undefined') return;
  const chit = MISSION_CHITS.find(c => c.id === eventId);
  if (!chit) return;

  if (typeof campaignState !== 'undefined') {
    if (!campaignState.workflow) campaignState.workflow = {};
    if (chit.validMonths && chit.validMonths.length > 0) {
      campaignState.workflow.selectedMonth = chit.validMonths[0];
    }
    campaignState.workflow.currentChit = chit;
    campaignState.workflow.assignedArea = chit.redTitle;
    if (typeof saveState === 'function') saveState();
  }

  showToast(isEn ? `⚓ Patrolling ${chit.redTitle} (${chit.redDate})!` : `⚓ ¡Patrullando en ${chit.redTitle} (${chit.redDate})!`);
  if (typeof switchTab === 'function') switchTab('workflow');
  if (typeof setWorkflowPhase === 'function') setWorkflowPhase(1);
}

// Attach to window
window.initMajorEventsTab = initMajorEventsTab;
window.renderMajorEventsGrid = renderMajorEventsGrid;
window.toggleMajorEventsFlip = toggleMajorEventsFlip;
window.toggleSingleEventChit = toggleSingleEventChit;
window.filterMajorEventsByYear = filterMajorEventsByYear;
window.filterMajorEventsByZone = filterMajorEventsByZone;
window.filterMajorEventsCurrentMonth = filterMajorEventsCurrentMonth;
window.assignPatrolToMajorEvent = assignPatrolToMajorEvent;

document.addEventListener('DOMContentLoaded', () => {
  initMajorEventsTab();
});
