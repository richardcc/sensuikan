// =========================================================================
// SENSUiKAN: GAME FLOW - PHASE 2: NAVIGATION & PATROL STEPPER
// Adaptive operational route stepper, box encounters A1-A4 & Ko-Hyoteki ops.
// =========================================================================

function recalculatePatrolTrack() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      const area = ((typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.assignedArea)
        ? campaignState.workflow.assignedArea
        : ((typeof subBoardState !== 'undefined' && subBoardState.assignedArea) ? subBoardState.assignedArea : "Pearl Harbor")).toLowerCase();
      const base = ((typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.startingBase)
        ? campaignState.workflow.startingBase
        : ((typeof subBoardState !== 'undefined' && subBoardState.startingBase) ? subBoardState.startingBase : "Yokosuka")).toLowerCase();
      const subKey = (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ? currentBoardSubKey : (campaignState.activeSubKey || "Type_B_Class");
      const sub = (SUB_DB.submarines || {})[subKey] || {};
      const subName = sub.class_name || "Type B";

      const meSelect = document.getElementById('wf-me-select');
      const meVal = meSelect ? meSelect.value : 'no';
      const isSpecial = (meVal && meVal !== 'no') || !!campaignState.workflow.isSpecialMission;

      // 1. CANONICAL PHASES FROM SUBMARINE MAT
      const canonicalPhases = (sub.patrol_phases || []).filter(p => p && p !== 'N/A');
      const totalCanonical = canonicalPhases.length || 7;
      const canonicalStationPhases = canonicalPhases.filter(p => p.startsWith('Stat'));
      const nCanonicalStat = canonicalStationPhases.length || (totalCanonical - 2);

      // 2. Extra transit calculation based on theater distance & base [Rule 2.A]
      let extraTransitOutbound = 0;
      let extraTransitReturn = 0;
      let distDesc = isEn ? "Standard Distance (~2,500 nm)" : "Distancia Normal (~2,500 nm)";

      // Rule 2.A: Distant areas require additional transit boxes shown on Operations Map.
      if (area.includes("west coast")) {
        extraTransitOutbound = 2;
        extraTransitReturn = 1;
        distDesc = isEn ? "US West Coast (+3 Transits [2 Outbound / 1 Inbound])" : "Costa Oeste EE.UU. (+3 Tránsitos [2 ida / 1 vuelta])";
      } else if (area.includes("pearl") || area.includes("hawaii") || meVal === 'yes_pearl') {
        extraTransitOutbound = 1;
        extraTransitReturn = 1;
        distDesc = isEn ? "Pearl Harbor (+2 Transits [1 Outbound / 1 Inbound])" : "Pearl Harbor (+2 Tránsitos [1 ida / 1 vuelta])";
      } else if (area.includes("australia") || area.includes("sydney") || meVal === 'yes_sydney') {
        extraTransitOutbound = 1;
        extraTransitReturn = 1;
        distDesc = isEn ? "Australia / Sydney (+2 Transits [1 Outbound / 1 Inbound])" : "Australia / Sídney (+2 Tránsitos [1 ida / 1 vuelta])";
      } else if (area.includes("panama")) {
        extraTransitOutbound = 2;
        extraTransitReturn = 1;
        distDesc = isEn ? "Panama Canal (+3 Transits [2 Outbound / 1 Inbound])" : "Canal de Panamá (+3 Tránsitos [2 ida / 1 vuelta])";
      } else if (area.includes("europe") || area.includes("atlantic") || area.includes("madagascar") || meVal === 'yes_diego') {
        extraTransitOutbound = 2;
        extraTransitReturn = 2;
        distDesc = isEn ? "Europe / Yanagi (+4 Transits [2 Outbound / 2 Inbound])" : "Europa / Yanagi (+4 Tránsitos [2 ida / 2 vuelta])";
      } else if (area.includes("home waters") || area.includes("japan") || area.includes("bonin") || area.includes("kuriles")) {
        distDesc = isEn ? "Home Waters (0 extra transits)" : "Aguas Metropolitanas (0 tránsitos extras)";
      }

      // Base adjustments [Rule 4.7]
      let baseAdj = "";
      if (base.includes("truk") && (area.includes("solomons") || area.includes("marshalls") || area.includes("marianas") || area.includes("coral sea"))) {
        extraTransitOutbound = 0;
        extraTransitReturn = 0;
        baseAdj = isEn ? " [Truk Advanced Base (4.7.3): No extra transits]" : " [Base Avanzada Truk (4.7.3): Sin tránsitos extras]";
      } else if ((base.includes("dutch") || base.includes("dei") || base.includes("penang")) && (area.includes("indian ocean") || area.includes("malaya") || area.includes("dutch east indies") || area.includes("bay of bengal"))) {
        extraTransitOutbound = 0;
        extraTransitReturn = 0;
        baseAdj = isEn ? " [DEI / Penang Base (4.7.5): No extra transits]" : " [Base DEI / Penang (4.7.5): Sin tránsitos extras]";
      } else if ((base.includes("guinea") || base.includes("rabaul")) && (area.includes("solomons") || area.includes("coral sea") || area.includes("guadalcanal") || area.includes("new guinea"))) {
        extraTransitOutbound = 0;
        extraTransitReturn = 0;
        baseAdj = isEn ? " [Rabaul Base (4.7.4): No extra transits]" : " [Base Rabaul (4.7.4): Sin tránsitos extras]";
      } else if (base.includes("paramushiro") && (area.includes("aleutians") || area.includes("kuriles"))) {
        extraTransitOutbound = 0;
        extraTransitReturn = 0;
        baseAdj = isEn ? " [Paramushiro Base (4.7.2): No extra transits]" : " [Base Paramushiro (4.7.2): Sin tránsitos extras]";
      } else if (base.includes("yokosuka")) {
        baseAdj = isEn ? " [Yokosuka Base (4.7.1)]" : " [Base Yokosuka (4.7.1)]";
      }

      // 3. BUILD BOXES STRICTLY MATCHING CANONICAL COUNT [Rule 2.A]
      const boxes = [];
      let activeStatCount = nCanonicalStat;

      // If Ko-Hyoteki special operations:
      if (subKey === 'Type_A_Midget_Submarine___Ko_Hyoteki') {
        boxes.push(isEn ? "Approach Transit" : "Tránsito de Aproximación");
        boxes.push(isEn ? "Harbor Penetration (Penetrate)" : "Penetración de Puerto (Penetrate)");
        boxes.push(isEn ? "Torpedo Attack (Attack)" : "Ataque con Torpedos (Attack)");
        boxes.push(isEn ? "Escape & Evasion (Egress)" : "Escape y Evasión (Egress)");
        boxes.push(isEn ? "Rendezvous & Recovery (Recover)" : "Cita de Rescate (Recover)");
      } else {
        // Standard Fleet Submarines:
        let totalExtra = extraTransitOutbound + extraTransitReturn;
        activeStatCount = nCanonicalStat - totalExtra;
        if (activeStatCount < 1) {
          activeStatCount = 1;
          const allowedExtra = totalCanonical - 2 - activeStatCount;
          extraTransitOutbound = Math.ceil(allowedExtra / 2);
          extraTransitReturn = Math.floor(allowedExtra / 2);
        }

        // Outbound Transits (1 normal + extraOutbound):
        boxes.push(isEn ? "Transit 1 (Outbound)" : "Tránsito 1 (Ida)");
        for (let t = 1; t <= extraTransitOutbound; t++) {
          boxes.push(isEn ? `Transit ${t + 1} (Approach)` : `Tránsito ${t + 1} (Aproximación)`);
        }

        // On-Station boxes
        for (let s = 0; s < activeStatCount; s++) {
          const statNum = s + 1;
          const origPhase = canonicalStationPhases[s] || `Stat ${statNum}`;
          if (s === 0 && isSpecial) {
            boxes.push(isEn ? `Special Mission (On Station 1)` : `Misión Especial (En Estación 1)`);
          } else {
            boxes.push(isEn ? `On Station ${statNum} (${origPhase})` : `En Estación ${statNum} (${origPhase})`);
          }
        }

        // Inbound Return Transits:
        for (let t = extraTransitReturn; t >= 1; t--) {
          boxes.push(isEn ? `Return ${t + 1} (Cruising)` : `Retorno ${t + 1} (Travesía)`);
        }
        boxes.push(isEn ? "Return to Base" : "Retorno a Base");

        // Failsafe sanity check
        while (boxes.length < totalCanonical) {
          const insertIdx = boxes.length - 1;
          boxes.splice(insertIdx, 0, isEn ? `On Station ${boxes.length - 1}` : `En Estación ${boxes.length - 1}`);
        }
        while (boxes.length > totalCanonical) {
          const removeIdx = 1 + extraTransitOutbound + activeStatCount - 1;
          boxes.splice(removeIdx, 1);
        }
      }

      campaignState.workflow.boxList = boxes;
      if (!campaignState.workflow.currentBoxIndex || campaignState.workflow.currentBoxIndex >= boxes.length) {
        campaignState.workflow.currentBoxIndex = 0;
      }

      // 4. Update Phase 1 & Phase 2 Displays
      const transitInfoEl = document.getElementById('wf-extra-transit-val');
      if (transitInfoEl) {
        const totalTransit = 1 + extraTransitOutbound;
        transitInfoEl.innerText = isEn
          ? `Route: ${totalCanonical} Total Boxes (${activeStatCount} On Station) • Transits: ${totalTransit} Outbound / ${1 + extraTransitReturn} Inbound\n${subName}: ${distDesc}${baseAdj}`
          : `Ruta: ${totalCanonical} Casillas Totales (${activeStatCount} en Estación) • Tránsitos: ${totalTransit} ida / ${1 + extraTransitReturn} vuelta\n${subName}: ${distDesc}${baseAdj}`;
      }

      const routeBadgeEl = document.getElementById('wf-route-badge-info');
      if (routeBadgeEl) {
        routeBadgeEl.innerText = isEn
          ? `Route: ${activeStatCount} Stations (${boxes.length} Boxes)`
          : `Ruta: ${activeStatCount} Estaciones (${boxes.length} Casillas)`;
      }

      renderRouteBreadcrumbs();
      updateBoxDisplay();
      if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
    }

    function renderRouteBreadcrumbs() {
      const stepper = document.getElementById('wf-route-stepper');
      if (!stepper) return;
      stepper.innerHTML = '';

      const isEn = (typeof currentLang !== "undefined" && currentLang === "en") || (typeof window !== "undefined" && window.currentLang === "en");
      const list = campaignState.workflow.boxList || [];
      const curIdx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      const startingBase = campaignState.workflow.startingBase || "Yokosuka";

      stepper.style.display = 'flex';
      stepper.style.flexWrap = 'nowrap';
      stepper.style.overflowX = 'auto';
      stepper.style.gap = '8px';
      stepper.style.padding = '4px 2px 8px 2px';

      // 0. PUERTO DE SALIDA / DEPARTURE PORT (Casilla de Puerto inicial [Regla 6.0])
      const isPortActive = (curIdx === -1);
      const isPortDone = (curIdx >= 0);

      const portCard = document.createElement('div');
      portCard.style.cssText = `
        flex: 0 0 98px;
        min-width: 92px;
        max-width: 105px;
        height: 136px;
        background: #0f172a;
        border: 2px solid ${isPortActive ? '#facc15' : (isPortDone ? '#10b981' : '#38bdf8')};
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px;
        box-shadow: ${isPortActive ? '0 0 14px rgba(250, 204, 21, 0.9), 0 4px 10px rgba(0,0,0,0.6)' : '0 3px 8px rgba(0,0,0,0.4)'};
        box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        position: relative;
        ${isPortDone ? 'opacity: 0.72; filter: saturate(0.85);' : ''}
        ${isPortActive ? 'transform: translateY(-2px); z-index: 2;' : ''}
      `;
      portCard.title = `${isEn ? 'Port of Departure' : 'Puerto de Salida'}: ${startingBase} (${isEn ? 'Click to stay in port' : 'Clic para situar en puerto'})`;
      portCard.onclick = () => jumpToPatrolBox(-1);

      let portBadgeHtml = '';
      if (isPortActive) {
        portBadgeHtml = `<div style="position:absolute; top:3px; left:3px; background:#facc15; color:#0f172a; font-size:0.6rem; font-weight:900; border-radius:3px; padding:1px 4px; line-height:1; z-index:3; box-shadow:0 1px 3px rgba(0,0,0,0.5);">▶ ACT</div>`;
      } else if (isPortDone) {
        portBadgeHtml = `<div style="position:absolute; top:3px; left:3px; background:#10b981; color:#ffffff; font-size:0.6rem; font-weight:900; border-radius:3px; padding:1px 4px; line-height:1; z-index:3; box-shadow:0 1px 3px rgba(0,0,0,0.5);">✓</div>`;
      }

      const portImgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_transit.jpg') : 'assets/tracks/track_transit.jpg');

      portCard.innerHTML = `
        ${portBadgeHtml}
        <div style="height:84px; position:relative; border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); background:#1e293b; display:flex; align-items:center; justify-content:center;">
          <img src="${portImgSrc}" onerror="this.style.display='none'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; display:block; filter:hue-rotate(180deg) brightness(0.85);" alt="Port">
          <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(15,23,42,0.65);">
            <span style="font-size:1.6rem; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.9));">⚓</span>
            <span style="font-size:0.68rem; font-weight:800; color:#38bdf8; text-transform:uppercase; text-shadow:0 1px 2px #000; margin-top:2px;">${startingBase}</span>
          </div>
          <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(14,116,144,0.9); font-size:0.6rem; color:#e0f2fe; font-weight:800; text-align:center; padding:2px 0; letter-spacing:0.5px; z-index:2; text-shadow:0 1px 2px #000;">
            ${isEn ? 'DEPARTURE' : 'SALIDA'}
          </div>
        </div>
        <div style="background:${isPortActive ? '#1e293b' : '#0b1320'}; border:1px solid ${isPortActive ? '#facc15' : '#0284c7'}; border-radius:4px; padding:3px 2px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.6); margin-top:3px;">
          <span style="font-family:'Cinzel', serif; font-size:0.68rem; font-weight:800; color:${isPortActive ? '#fde047' : '#bae6fd'}; text-transform:uppercase; letter-spacing:0.3px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${isEn ? 'At Port' : 'En Puerto'}
          </span>
        </div>
      `;
      stepper.appendChild(portCard);

      list.forEach((boxName, i) => {
        const isActive = (i === curIdx);
        const isDone = (i < curIdx);

        // Determine type of box
        const isMission = boxName.includes("Misión") || boxName.includes("Mission");
        const isStation = boxName.includes("Estación") || boxName.includes("Station") || isMission;
        const isReturn = boxName.includes("Retorno") || boxName.includes("Return");

        let borderCol = '#2563eb';
        let badgeBg = 'rgba(12,26,46,0.85)';
        let badgeTextCol = '#93c5fd';
        let upperBadge = isEn ? 'OPEN SEAS' : 'ALTA MAR';
        let lowerDesc = isEn ? 'Transit' : 'Tránsito';
        let imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_transit.jpg') : 'assets/tracks/track_transit.jpg');

        if (isMission) {
          borderCol = '#ea580c';
          badgeBg = 'rgba(69,26,3,0.85)';
          badgeTextCol = '#fed7aa';
          upperBadge = isEn ? 'SPECIAL OPS' : 'MISIÓN ESP.';
          lowerDesc = isEn ? 'Mission' : 'Misión';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_station.jpg') : 'assets/tracks/track_station.jpg');
        } else if (isStation) {
          borderCol = '#059669';
          badgeBg = 'rgba(2,44,34,0.85)';
          badgeTextCol = '#6ee7b7';
          const statMatch = boxName.match(/(\d+)/);
          const statNum = statMatch ? statMatch[1] : (i + 1);
          upperBadge = `${isEn ? 'STAT ' : 'ESTACIÓN '}${statNum}`;
          lowerDesc = isEn ? 'On Station' : 'En Estación';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_station.jpg') : 'assets/tracks/track_station.jpg');
        } else if (isReturn) {
          borderCol = '#2563eb';
          badgeBg = 'rgba(12,26,46,0.85)';
          badgeTextCol = '#93c5fd';
          upperBadge = isEn ? 'RETURN' : 'REGRESO';
          lowerDesc = isEn ? 'Transit' : 'Tránsito';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_transit.jpg') : 'assets/tracks/track_transit.jpg');
        }

        // Sub-midget special operation tags
        if (boxName.includes("Penetrate") || boxName.includes("Penetración")) {
          borderCol = '#ea580c';
          badgeBg = 'rgba(69,26,3,0.85)';
          badgeTextCol = '#fed7aa';
          upperBadge = 'PENETRATE';
          lowerDesc = 'Special Ops';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_penetrate.jpg') : 'assets/tracks/track_penetrate.jpg');
        } else if (boxName.includes("Attack") || boxName.includes("Ataque")) {
          borderCol = '#ea580c';
          badgeBg = 'rgba(69,26,3,0.85)';
          badgeTextCol = '#fed7aa';
          upperBadge = 'ATTACK';
          lowerDesc = 'Special Ops';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_attack.jpg') : 'assets/tracks/track_attack.jpg');
        } else if (boxName.includes("Egress") || boxName.includes("Escape")) {
          borderCol = '#ea580c';
          badgeBg = 'rgba(69,26,3,0.85)';
          badgeTextCol = '#fed7aa';
          upperBadge = 'EGRESS';
          lowerDesc = 'Special Ops';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_egress.jpg') : 'assets/tracks/track_egress.jpg');
        } else if (boxName.includes("Recover") || boxName.includes("Rescate")) {
          borderCol = '#ea580c';
          badgeBg = 'rgba(69,26,3,0.85)';
          badgeTextCol = '#fed7aa';
          upperBadge = 'RECOVER';
          lowerDesc = 'Special Ops';
          imgSrc = (typeof resolveAsset === 'function' ? resolveAsset('assets/tracks/track_recover.jpg') : 'assets/tracks/track_recover.jpg');
        }

        const card = document.createElement('div');
        card.style.cssText = `
          flex: 0 0 98px;
          min-width: 92px;
          max-width: 105px;
          height: 136px;
          background: #0f172a;
          border: 2px solid ${isActive ? '#facc15' : borderCol};
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 4px;
          box-shadow: ${isActive ? '0 0 14px rgba(250, 204, 21, 0.9), 0 4px 10px rgba(0,0,0,0.6)' : '0 3px 8px rgba(0,0,0,0.4)'};
          box-sizing: border-box;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          position: relative;
          ${isDone ? 'opacity: 0.72; filter: saturate(0.85);' : ''}
          ${isActive ? 'transform: translateY(-2px); z-index: 2;' : ''}
        `;
        card.title = `${isEn ? 'Click to jump to' : 'Clic para saltar a'}: ${boxName}`;
        card.onclick = () => jumpToPatrolBox(i);

        // Status indicator badge (active / completed checkmark)
        let statusBadgeHtml = '';
        if (isActive) {
          statusBadgeHtml = `<div style="position:absolute; top:3px; left:3px; background:#facc15; color:#0f172a; font-size:0.6rem; font-weight:900; border-radius:3px; padding:1px 4px; line-height:1; z-index:3; box-shadow:0 1px 3px rgba(0,0,0,0.5);">▶ ACT</div>`;
        } else if (isDone) {
          statusBadgeHtml = `<div style="position:absolute; top:3px; left:3px; background:#10b981; color:#ffffff; font-size:0.6rem; font-weight:900; border-radius:3px; padding:1px 4px; line-height:1; z-index:3; box-shadow:0 1px 3px rgba(0,0,0,0.5);">✓</div>`;
        }

        card.innerHTML = `
          ${statusBadgeHtml}
          <div style="height:84px; position:relative; border-radius:4px; overflow:hidden; border:1px solid rgba(255,255,255,0.1); background:#1e293b; display:flex; align-items:center; justify-content:center;">
            <img src="${imgSrc}" onerror="this.style.display='none'" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; display:block;" alt="${upperBadge}">
            <div style="position:absolute; bottom:0; left:0; right:0; background:${badgeBg}; font-size:0.6rem; color:${badgeTextCol}; font-weight:800; text-align:center; padding:2px 0; letter-spacing:0.5px; z-index:2; text-shadow:0 1px 2px #000;">${upperBadge}</div>
          </div>
          <div style="background:${isActive ? '#1e293b' : '#0b1320'}; border:1px solid ${isActive ? '#facc15' : '#d4af37'}; border-radius:4px; padding:3px 2px; text-align:center; box-shadow:0 1px 3px rgba(0,0,0,0.6); margin-top:3px;">
            <span style="font-family:'Cinzel', serif; font-size:0.68rem; font-weight:800; color:${isActive ? '#fde047' : '#e2e8f0'}; text-transform:uppercase; letter-spacing:0.3px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${lowerDesc}</span>
          </div>
        `;
        stepper.appendChild(card);
      });
    }

    function jumpToPatrolBox(idx) {
      const isEn = (typeof currentLang !== "undefined" && currentLang === "en") || (typeof window !== "undefined" && window.currentLang === "en");
      const list = campaignState.workflow.boxList || [];
      const base = campaignState.workflow.startingBase || "Yokosuka";

      if (idx === -1) {
        campaignState.workflow.currentBoxIndex = -1;
        campaignState.workflow.patrolBoxesCompleted = false;
        updateBoxDisplay();
        updatePhase2TableDisplay();
        renderRouteBreadcrumbs();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = -1;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
        showToast(isEn ? `Station: In Port (${base})` : `Estación: En Puerto (${base})`);
        return;
      }

      if (idx >= 0 && idx < list.length) {
        campaignState.workflow.currentBoxIndex = idx;
        if (idx === list.length - 1) {
          campaignState.workflow.patrolBoxesCompleted = true;
        } else {
          campaignState.workflow.patrolBoxesCompleted = false;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        renderRouteBreadcrumbs();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = idx;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
        showToast((isEn ? "Navigating to: " : "Navegando a: ") + list[idx]);
      }
    }

        function rollStartingBase() {
      const m = campaignState.workflow.selectedMonth || "1941-12";
      const area = (campaignState.workflow.assignedArea || "").toLowerCase();
      const d = Math.floor(Math.random() * 6) + 1;

      const trukAvailable = (m <= "1944-03");
      const penangAvailable = (m >= "1942-02" && m <= "1944-10");
      const rabaulAvailable = (m >= "1942-03" && m <= "1943-12");

      let chosenBase = "Yokosuka";
      let reason = "";

      // Smart historical base determination by assigned theater & date
      if (area.includes("indian ocean") || area.includes("madagascar") || area.includes("bay of bengal")) {
        if (penangAvailable && d >= 2) {
          chosenBase = "Penang";
          reason = "8ª Flotilla Submarina desplegada en el Océano Índico";
        } else {
          chosenBase = (d % 2 === 0) ? "Kure" : "Yokosuka";
          reason = "Salida desde Base Metropolitana";
        }
      } else if (area.includes("aleutians") || area.includes("kuriles")) {
        if (d >= 3) {
          chosenBase = "Paramushiro";
          reason = "Base Avanzada de las Kuriles (Pacífico Norte)";
        } else {
          chosenBase = "Yokosuka";
          reason = "Base de la Flota del Norte";
        }
      } else if (area.includes("solomons") || area.includes("guadalcanal") || area.includes("coral sea") || area.includes("new guinea")) {
        if (rabaulAvailable && d === 6) {
          chosenBase = "Rabaul";
          reason = "Avanzada de Nueva Bretaña / Salomón";
        } else if (trukAvailable && d >= 2) {
          chosenBase = "Truk";
          reason = "6ª Flota en el Fondeadero de Truk Lagoon";
        } else {
          chosenBase = (d % 2 === 0) ? "Kure" : "Yokosuka";
          reason = "Salida desde Aguas Metropolitanas";
        }
      } else if (area.includes("marshalls") || area.includes("tarawa") || area.includes("marianas") || area.includes("midway")) {
        if (trukAvailable && d >= 3) {
          chosenBase = "Truk";
          reason = "Base de Operaciones del Pacífico Central";
        } else {
          chosenBase = (d % 2 === 0) ? "Kure" : "Yokosuka";
          reason = "Base Principal de la Flota Combinada";
        }
      } else {
        // Standard home bases
        if (d <= 3) {
          chosenBase = "Kure";
          reason = "Astillero y Base Principal de la Armada";
        } else if (d <= 5) {
          chosenBase = "Yokosuka";
          reason = "Base Central de la Bahía de Tokio";
        } else {
          chosenBase = "Sasebo";
          reason = "Base Naval de Kyushu";
        }
      }

      campaignState.workflow.startingBase = chosenBase;
      const baseSel = document.getElementById('wf-base-select');
      if (baseSel) baseSel.value = chosenBase;

      handleBaseChange(chosenBase);
      saveState();

      showToast(`🎲 Dado 1d6: [${d}] ➔ Base Asignada: ${chosenBase} (${reason})`);
    }

    function handleBaseChange(val) {
      const norm = normalizeBaseName(val);
      campaignState.workflow.startingBase = norm;
      const base0 = document.getElementById('wf-starting-base');
      if (base0 && base0.value !== norm) base0.value = norm;
      const base1 = document.getElementById('wf-base-select');
      if (base1 && base1.value !== norm) base1.value = norm;
      updateBaseDescriptionPill(norm);
      recalculatePatrolTrack();
      if (typeof updateOperationsMap === 'function') updateOperationsMap();
      if (typeof window.onSensuikanBaseChanged === 'function') window.onSensuikanBaseChanged(norm);
      if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
      if (typeof renderSubBoard === 'function') renderSubBoard();
      saveState();
      showToast("Base naval de operaciones: " + norm);
    }

    
    function getAssignedSpecialMissionKeySafe() {
      if (typeof getCurrentAssignedMissionKey === 'function') {
        const k = getCurrentAssignedMissionKey();
        if (k) return k;
      }
      if (typeof campaignState !== 'undefined' && campaignState.workflow) {
        const wf = campaignState.workflow;
        if (wf.assignedSpecialMissionKey) return wf.assignedSpecialMissionKey;
        const str = ((wf.specialMissionAssigned || '') + ' ' + (wf.assignedMissionLine || '') + ' ' + (wf.assignedMissionType || '')).toLowerCase();
        if (str.includes('recon') || str.includes('aéreo') || str.includes('glen') || str.includes('seiran')) return 'recon';
        if (str.includes('midget') || str.includes('ko-hyoteki') || str.includes('mini')) return 'midget';
        if (str.includes('bomb') || str.includes('panama') || str.includes('oregon')) return 'bombing';
        if (str.includes('kaiten')) return 'kaiten';
        if (str.includes('transport') || str.includes('tokyo') || str.includes('supply') || str.includes('suministro')) return 'transport';
        if (str.includes('yanagi') || str.includes('europe') || str.includes('europa')) return 'yanagi';
        if (str.includes('evac') || str.includes('kiska')) return 'evacuation';
        if (str.includes('shore') || str.includes('bombard') || str.includes('costero')) return 'shore_bombardment';
        if (str.includes('mine') || str.includes('mina')) return 'minelaying';
        if (str.includes('pass') || str.includes('vip') || str.includes('agente')) return 'passenger';
        if (str.includes('picket') || str.includes('piquete')) return 'picket';
      }
      return null;
    }

    function updateBoxDisplay() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (typeof window.onSensuikanPatrolMoved === 'function') {
        window.onSensuikanPatrolMoved(idx);
      }
      const list = campaignState.workflow.boxList || [];
      const base = campaignState.workflow.startingBase || "Yokosuka";
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";

      const boxLblEl = document.getElementById('wf-current-box-lbl');
      const descEl = document.getElementById('wf-box-type-desc');
      const rollResEl = document.getElementById('wf-encounter-roll-res');
      const encStatusEl = document.getElementById('wf-enc-status-text');
      const btnCombat = document.getElementById('btn-engage-combat');

      const a3Wrapper = document.getElementById('p2-a3-controls-wrapper');
      const portWrapper = document.getElementById('p2-port-controls-wrapper');
      const c2Title = document.getElementById('p2-c2-title');
      const c2Help = document.getElementById('p2-encounter-help');
      const btnBack = document.getElementById('p2-btn-back');
      const btnNextText = document.getElementById('p2-btn-next');
      const btnPrevText = document.getElementById('p2-btn-prev');

      if (idx === -1) {
        if (boxLblEl) boxLblEl.innerText = isEn ? `⚓ In Port: ${base} (Departure Station)` : `⚓ En Puerto: ${base} (Estación de Salida)`;
        if (descEl) descEl.innerText = isEn ? `(Moored at naval base ${base}. Ready to depart on patrol towards ${assignedArea} [Rule 6.0])` : `(Amarrado en la base naval de ${base}. Listo para zarpar en patrulla hacia ${assignedArea} [Regla 6.0])`;
        if (rollResEl) rollResEl.innerHTML = `<span style="color:#38bdf8; font-weight:800;">⚓ ${isEn ? "In Port (Departure)" : "En Puerto (Salida)"}</span>`;
        if (encStatusEl) encStatusEl.innerText = isEn ? "Submarine is moored in port. Click 'Depart on Patrol' to begin transit." : "El submarino está amarrado en puerto. Pulsa 'Zarpar a la Mar' para iniciar el tránsito.";
        if (btnCombat) btnCombat.style.display = "none";

        if (a3Wrapper) a3Wrapper.style.display = 'none';
        if (portWrapper) portWrapper.style.display = 'block';
        const a3MainContainer = document.getElementById('p2-a3-main-container');
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        if (c2Title) c2Title.innerText = isEn ? "2. Naval Base Status [Rule 4.7.6]" : "2. Estado en Base Naval [Regla 4.7.6]";
        if (c2Help) c2Help.innerText = isEn ? "Submarine is moored in port. Chart [A3] does not apply in port." : "El submarino está amarrado en puerto. La Tabla [A3] no se aplica en puerto.";

        if (btnBack) {
          btnBack.disabled = true;
          btnBack.style.opacity = '0.4';
          btnBack.style.cursor = 'not-allowed';
        }
        if (btnNextText) btnNextText.innerText = isEn ? "Depart on Patrol" : "Zarpar a la Mar";
        if (btnPrevText) btnPrevText.innerText = isEn ? "Moored" : "Amarrado";

        renderRouteBreadcrumbs();
        return;
      }

      const specWrapper = document.getElementById('p2-spec-module-controls-wrapper');
      const boxNameCheck = list[idx] || "";
      const isSpecBoxCheck = boxNameCheck.includes("Mission") || boxNameCheck.includes("Misión");
      const specKeyCheck = getAssignedSpecialMissionKeySafe();
      const noA3NeededCheck = isSpecBoxCheck && (specKeyCheck === 'recon' || specKeyCheck === 'midget' || specKeyCheck === 'bombing' || specKeyCheck === 'kaiten');

      const a3MainContainer = document.getElementById('p2-a3-main-container');

      if (noA3NeededCheck) {
        if (a3MainContainer) a3MainContainer.style.display = 'none';
        if (a3Wrapper) a3Wrapper.style.display = 'none';
        if (portWrapper) portWrapper.style.display = 'none';
        if (specWrapper) {
          specWrapper.style.display = 'block';
          const iconEl = document.getElementById('p2-spec-module-icon');
          const titleEl = document.getElementById('p2-spec-module-title');
          const descElM = document.getElementById('p2-spec-module-desc');
          const btnCont = document.getElementById('p2-spec-module-btn-container');

          if (specKeyCheck === 'recon') {
            if (iconEl) iconEl.innerText = '✈️';
            if (titleEl) titleEl.innerText = isEn ? 'Aerial Reconnaissance [Rule 7.1 / 7.17]' : 'Reconocimiento Aéreo con Hidroavión [Regla 7.1 / 7.17]';
            if (descElM) descElM.innerText = isEn 
              ? 'In this box, the submarine deploys its onboard floatplane to conduct aerial reconnaissance over enemy anchorages. Table [A3] does not apply.' 
              : 'En esta casilla el buque despliega su hidroavión embarcado para explorar el fondeadero enemigo. No aplica tirada en Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openAircraftDisplayMatModal()" style="width:100%; justify-content:center; background:linear-gradient(135deg, #0284c7, #0369a1); border-color:#38bdf8; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">✈️ ${isEn ? 'Open Aircraft Mat [Chart P] / Resolve Flight' : 'Abrir Tablero de Hidroavión [Chart P] / Resolver Vuelo'}</button>`;
          } else if (specKeyCheck === 'midget') {
            if (iconEl) iconEl.innerText = '🚀';
            if (titleEl) titleEl.innerText = isEn ? 'Ko-Hyoteki Midget Sub Attack [Rule 7.3]' : 'Ataque Minisumergibles Ko-Hyoteki [Regla 7.3]';
            if (descElM) descElM.innerText = isEn 
              ? 'The mother submarine covertly releases its 46-ton Ko-Hyoteki midget submarine outside the harbor entrance. Resolved on Charts M1–M7. Table [A3] does not apply.' 
              : 'El submarino nodriza suelta su minisubmarino Ko-Hyoteki ante el puerto enemigo. Se resuelve en las Tablas M1–M7. No aplica Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openSpecialMissionResolver('midget')" style="width:100%; justify-content:center; background:linear-gradient(135deg, #7c3aed, #6d28d9); border-color:#a855f7; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">🚀 ${isEn ? 'Resolve Ko-Hyoteki Strike [Charts M1-M7]' : 'Resolver Ataque Ko-Hyoteki [Tablas M1-M7]'}</button>`;
          } else if (specKeyCheck === 'kaiten') {
            if (iconEl) iconEl.innerText = '💥';
            if (titleEl) titleEl.innerText = isEn ? 'Kaiten Suicide Torpedo Strike [Rule 7.8]' : 'Ataque de Torpedos Suicidas Kaiten [Regla 7.8]';
            if (descElM) descElM.innerText = isEn 
              ? 'Submerged approach and release of Kaiten manned torpedoes against enemy fleet vessels. Resolved via Kaiten Module. Table [A3] does not apply.' 
              : 'Aproximación en inmersión y lanzamiento de torpedos tripulados Kaiten. Resuelto en el Módulo Kaiten. No aplica Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openSpecialMissionResolver('kaiten')" style="width:100%; justify-content:center; background:linear-gradient(135deg, #b91c1c, #991b1b); border-color:#ef4444; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">💥 ${isEn ? 'Resolve Kaiten Strike [Rule 7.8]' : 'Resolver Ataque Kaiten [Regla 7.8]'}</button>`;
          } else if (specKeyCheck === 'bombing') {
            if (iconEl) iconEl.innerText = '💣';
            if (titleEl) titleEl.innerText = isEn ? 'Strategic Aerial Bombing [Rule 7.7]' : 'Bombardeo Aéreo Estratégico [Regla 7.7]';
            if (descElM) descElM.innerText = isEn 
              ? 'Catapult floatplane loaded with bombs against strategic targets. Table [A3] does not apply.' 
              : 'Catapulta el hidroavión cargado con bombas contra el objetivo estratégico. No aplica Tabla [A3].';
            if (btnCont) btnCont.innerHTML = `<button type="button" class="action-btn" onclick="openAircraftDisplayMatModal()" style="width:100%; justify-content:center; background:linear-gradient(135deg, #b45309, #92400e); border-color:#f59e0b; color:#fff; font-weight:800; padding:8px 12px; font-size:0.86rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">💣 ${isEn ? 'Open Aircraft Mat / Execute Bombing Run' : 'Abrir Tablero de Hidroavión / Ejecutar Bombardeo'}</button>`;
          }
        }
        if (c2Title) c2Title.innerText = isEn ? "2. Special Mission Operation [Rule 7.0]" : "2. Operación de Misión Especial [Regla 7.0]";
        if (c2Help) c2Help.innerText = isEn ? "Dedicated tactical module active. Table [A3] is not used in this box." : "Módulo táctico dedicado activo. La Tabla [A3] no se utiliza en esta casilla.";
      } else {
        if (a3Wrapper) a3Wrapper.style.display = 'block';
        if (portWrapper) portWrapper.style.display = 'none';
        if (specWrapper) specWrapper.style.display = 'none';
        if (a3MainContainer) a3MainContainer.style.display = 'block';

        if (isSpecBoxCheck && (specKeyCheck === 'transport' || specKeyCheck === 'minelaying' || specKeyCheck === 'passenger' || specKeyCheck === 'evacuation' || specKeyCheck === 'shore_bombardment' || specKeyCheck === 'yanagi')) {
          campaignState.workflow.useA3SpecialMissionColumn = true;
          if (c2Title) c2Title.innerText = isEn ? "2. Special Mission Detection Check [Chart A3]" : "2. Comprobación en Columna Misión Especial [Tabla A3]";
          if (c2Help) c2Help.innerText = isEn ? "Roll 2d6 in Special Mission column (4-11: Clear/Objective Accomplished):" : "Lanza 2d6 en la columna de Misión Especial (4-11: Despejado/Objetivo Cumplido):";
        } else {
          campaignState.workflow.useA3SpecialMissionColumn = false;
          if (c2Title) c2Title.innerText = isEn ? "2. Encounter Roll on Chart [A3]" : "2. Tirada de Encuentros en Tabla [A3]";
          if (c2Help) c2Help.innerText = isEn ? "Roll 2d6 in each patrol station or transit box:" : "Lanza 2d6 en cada casilla de estación o tránsito:";
        }
      }
      if (btnBack) {
        btnBack.disabled = false;
        btnBack.style.opacity = '1';
        btnBack.style.cursor = 'pointer';
      }
      if (btnNextText) btnNextText.innerText = isEn ? "Advance Box" : "Avanzar Casilla";
      if (btnPrevText) btnPrevText.innerText = (idx === 0) ? (isEn ? "Back to Port" : "Volver a Puerto") : (isEn ? "Previous Box" : "Retroceder");

      const boxName = list[idx] || (isEn ? "Box " + (idx + 1) : "Casilla " + (idx + 1));
      if (boxLblEl) boxLblEl.innerText = `${boxName} (${idx + 1}/${list.length})`;
      
      let desc = isEn ? `(On active patrol in ${assignedArea})` : `(En patrulla activa en ${assignedArea})`;
      if (boxName.includes("Transit") || boxName.includes("Tránsito")) {
        desc = isEn ? `(Naval transit approach towards ${assignedArea})` : `(Aproximación naval hacia ${assignedArea})`;
      } else if (boxName.includes("Return") || boxName.includes("Retorno")) {
        desc = isEn ? `(Return journey to base at ${base})` : `(Regreso a base en ${base})`;
      } else if (boxName.includes("Mission") || boxName.includes("Misión")) {
        desc = isEn ? `(⭐ Special Mission box in ${assignedArea})` : `(⭐ Casilla de Misión Especial en ${assignedArea})`;
      }
      
      if (descEl) descEl.innerText = desc;

      const c3Dynamic = document.getElementById('p2-c3-dynamic-content');
      if (c3Dynamic) {
        if (boxName.includes("Mission") || boxName.includes("Misión")) {
          const missionName = (campaignState.workflow && campaignState.workflow.assignedMissionType) 
            || (isEn ? "Major Fleet Operation" : "Operación Mayor de Flota");
          const missionLine = (campaignState.workflow && campaignState.workflow.assignedMissionLine) || "Patrol";
          const isDone = !!(campaignState.workflow && campaignState.workflow.specialMissionCompleted);
          
          c3Dynamic.innerHTML = `
            <div style="background:#0a0f1d; border:1px solid #38bdf8; border-radius:6px; padding:10px; margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:4px;">
                <span style="color:#fde047; font-weight:bold; font-size:0.86rem;">🎯 ${isEn ? 'ACTIVE SPECIAL MISSION' : 'MISIÓN ESPECIAL ACTIVA'}</span>
                <span style="font-size:0.70rem; background:#0284c7; color:#fff; padding:2px 6px; border-radius:3px; font-weight:800;">${isEn ? 'RULE 7.0 - 7.14' : 'REGLA 7.0 - 7.14'}</span>
              </div>
              <div style="font-size:0.82rem; color:#f8fafc; font-weight:bold; margin-bottom:4px;">
                ${missionName} (${missionLine})
              </div>
              <p style="font-size:0.76rem; color:#cbd5e1; margin:0 0 8px 0; line-height:1.4;">
                ${isEn 
                  ? 'Your boat executes this operation in the first On-Station box. Use the Area Chart [A3] for fleet contacts or launch specialized modules (Ko-Hyoteki, Floatplane Glen, Kaiten). Grants 2 successful patrols on completion!'
                  : 'Tu buque ejecuta esta operación en la primera casilla de estación. Usa la Tabla de Área [A3] para contactos de flota o lanza módulos especializados (Ko-Hyoteki, Hidroavión Glen, Kaiten). ¡Otorga 2 patrullas exitosas al completarse!'}
              </p>
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" onclick="triggerSpecialMissionAction()" class="action-btn" style="background:${isDone ? '#15803d' : '#0284c7'}; color:#fff; font-size:0.78rem; padding:5px 12px; font-weight:bold; flex:1; justify-content:center; border:none; cursor:pointer;">
                  ${isDone ? (isEn ? '✓ Mission Completed [Rule 7.13]' : '✓ Misión Completada [Regla 7.13]') : (isEn ? '🎯 Resolve Special Mission ➔' : '🎯 Resolver Misión Especial ➔')}
                </button>
                <button type="button" onclick="setWorkflowPhase('special-missions')" class="action-btn" style="border-color:#38bdf8; background:rgba(2,132,199,0.2); color:#7dd3fc; font-size:0.75rem; padding:4px 10px; cursor:pointer; font-weight:bold;" title="${isEn ? 'Open Special Missions Center' : 'Abrir Centro de Misiones Especiales'}">
                  🎯 ${isEn ? 'Missions' : 'Misiones'}
                </button>
              </div>
            </div>
          `;
        } else {
          c3Dynamic.innerHTML = `
            <p><strong id="p2-mission-box-label">${isEn ? 'Mission Box:' : 'Casilla de Misión:'}</strong> <span id="p2-mission-box-help">${isEn ? 'The first non-transit box activates the Special Mission:' : 'La primera casilla que no es de tránsito activa la Misión Especial:'}</span></p>
            <ul style="margin-left:16px; margin-top:4px; font-size:0.86rem; color:var(--slate-400);">
              <li id="p2-mission-midget">${isEn ? 'Midget Submarines (Maps M1-M7)' : 'Mini-Submarinos (Mapas M1-M7)'}</li>
              <li id="p2-mission-air">${isEn ? 'Air Reconnaissance (Charts P1-P6)' : 'Reconocimiento Aéreo (Tablas P1-P6)'}</li>
              <li id="p2-mission-kaiten">${isEn ? 'Kaiten Launch (Maps K2-K3)' : 'Lanzamiento Kaiten (Mapas K2-K3)'}</li>
              <li id="p2-mission-mine">${isEn ? 'Mining or Tokyo Express Transport' : 'Minado o Transporte Tokio Express'}</li>
            </ul>
          `;
        }
      }

      renderRouteBreadcrumbs();
    }

    function nextPatrolBox() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const max = campaignState.workflow.boxList.length - 1;
      const cur = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (cur < max) {
        campaignState.workflow.currentBoxIndex = cur + 1;
        if (campaignState.workflow.currentBoxIndex === max) {
          campaignState.workflow.patrolBoxesCompleted = true;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = campaignState.workflow.currentBoxIndex;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        document.getElementById('wf-encounter-roll-res').innerText = isEn ? "Unrolled" : "Sin Tirar";
        document.getElementById('btn-engage-combat').style.display = "none";
        document.getElementById('wf-enc-status-text').innerText = isEn ? "Ready to roll on this box." : "Listo para tirar en esta casilla.";
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
      } else {
        campaignState.workflow.patrolBoxesCompleted = true;
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        showToast(isEn ? "All patrol boxes completed! Return to base." : "¡Ha completado todas las casillas de trayecto! Retorno a base.");
        setWorkflowPhase(4);
      }
    }

    function prevPatrolBox() {
      const cur = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (cur > -1) {
        campaignState.workflow.currentBoxIndex = cur - 1;
        const max = (campaignState.workflow.boxList.length - 1);
        if (campaignState.workflow.currentBoxIndex < max) {
          campaignState.workflow.patrolBoxesCompleted = false;
        }
        updateBoxDisplay();
        updatePhase2TableDisplay();
        if (typeof subBoardState !== 'undefined') {
          subBoardState.patrolIndex = campaignState.workflow.currentBoxIndex;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
          if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        }
        if (typeof updateTrayectoCompletionStatus === 'function') updateTrayectoCompletionStatus();
        saveState();
      }
    }

    function rollBoxEncounter(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (typeof campaignState.workflow.currentBoxIndex === 'number') ? campaignState.workflow.currentBoxIndex : -1;
      if (idx === -1) {
        showToast(isEn ? "The submarine is moored in port. Click 'Advance' to set sail on Box 1!" : "El submarino está amarrado en puerto. ¡Pulsa 'Avanzar' para zarpar hacia la Casilla 1!");
        return;
      }
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");

      const specKeyRoll = getAssignedSpecialMissionKeySafe();
      const noA3NeededRoll = isSpecialBox && (specKeyRoll === 'recon' || specKeyRoll === 'midget' || specKeyRoll === 'bombing' || specKeyRoll === 'kaiten');
      if (noA3NeededRoll) {
        showToast(isEn ? "Table [A3] is not used in this box. Please resolve the dedicated tactical mission above." : "En esta casilla no aplica la Tabla [A3]. Resuelve la misión táctica arriba.");
        return;
      }
      
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const mappedAreaZone = (typeof mapA1ToA3Zone === 'function') ? mapA1ToA3Zone(assignedArea) : "Pearl Harbor";
      const useSpecialCol = !!(isSpecialBox && campaignState.workflow.useA3SpecialMissionColumn);
      const targetZone = isTransit ? "Transit" : (useSpecialCol ? "Special Mission" : mappedAreaZone);

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

      campaignState.workflow.lastA3Roll = sum;
      updatePhase2TableDisplay();

      const resEl = document.getElementById('wf-encounter-roll-res');
      const detEl = document.getElementById('wf-enc-status-text');
      const btnCombat = document.getElementById('btn-engage-combat');
      const ppatrolRollEl = document.getElementById('ppatrol-last-roll-display');

      const zoneLabel = isEn ? targetZone : (targetZone === "Transit" ? "Tránsito" : targetZone === "Special Mission" ? "Misión Especial" : targetZone);

      if (resEl) {
        resEl.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isManual ? (isEn ? "Tabletop 2d6" : "Mesa 2d6") : (isEn ? "2d6 Roll" : "Tirada 2d6")}: [${d1} + ${d2} = ${sum}]</span> <span style="color:#94a3b8;">[${isEn ? "Zone" : "Zona"}: ${zoneLabel}]</span>`;
      }
      if (ppatrolRollEl) {
        ppatrolRollEl.innerHTML = `🎲 2d6: [${d1}+${d2} = <strong>${sum}</strong>]`;
      }

      // Check first 12 rule
      if (sum === 12 && !campaignState.workflow.firstTwelveRolled) {
        campaignState.workflow.firstTwelveRolled = true;
        campaignState.workflow.encounterType = "Event";
        campaignState.workflow.encounterDetails = isEn ? "Random Event [Chart B11]" : "Suceso Aleatorio [Tabla B11]";
        if (detEl) {
          detEl.innerHTML = isEn
            ? `<span style="color:var(--gold-400); font-weight:bold;">★ RANDOM EVENT [Chart B11]!</span> (Rule 8.1.8: The first 12 of each patrol triggers a historical random event).`
            : `<span style="color:var(--gold-400); font-weight:bold;">★ ¡SUCESO ALEATORIO (Tabla B11)!</span> (Regla 8.1.8: El primer 12 de cada patrulla activa un suceso aleatorio histórico).`;
        }
        if (btnCombat) btnCombat.style.display = "none";
        showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ ★ RANDOM EVENT [Chart B11]!` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ ★ ¡SUCESO ALEATORIO [Tabla B11]!`);
        updatePatrolPhaseUI();
        saveState();
        return;
      }

      const zoneRow = CHART_A3_DATA[targetZone] || CHART_A3_DATA["Transit"];
      let encounter = zoneRow[sum] || "--";

      // Check date for * before 7/42
      const monthStr = campaignState.workflow.selectedMonth || "1941-12";
      const isBeforeJuly42 = monthStr < "1942-07";

      if (encounter.includes("*") && isBeforeJuly42) {
        campaignState.workflow.encounterType = "None";
        campaignState.workflow.encounterDetails = isEn ? "Clear sea (* treated as No Encounter before 07/42)" : "Sin contacto (* tratado como Sin Encuentro antes de 07/42)";
        if (detEl) {
          detEl.innerHTML = isEn
            ? `<span style="color:var(--slate-400);">${encounter} -> <em>Treated as 'No Encounter' before 07/42 (Rule A3)</em></span>`
            : `<span style="color:var(--slate-400);">${encounter} -> <em>Tratado como 'Sin Encuentro' antes de 07/42 (Regla A3)</em></span>`;
        }
        if (btnCombat) btnCombat.style.display = "none";
        showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ No Encounter (Pre-07/42)` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ Sin Contacto (Previo a 07/42)`);
        updatePatrolPhaseUI();
        saveState();
        return;
      }

      // Check (R) radar re-roll rule [Official Chart A3]
      if (encounter.includes("(R)")) {
        const radarInfo = (typeof checkSubmarineRadarStatus === 'function') 
          ? checkSubmarineRadarStatus() 
          : { isOperational: !!campaignState.hasRadar, isEquipped: !!campaignState.hasRadar };

        campaignState.workflow.encounterType = "None";

        if (radarInfo.isOperational) {
          // Operational Radar present -> Eligible for Radar Re-roll
          campaignState.workflow.encounterDetails = isEn ? "No Encounter (Radar re-roll available)" : "Sin Encuentro (Repetición radar disponible)";
          if (detEl) {
            detEl.innerHTML = `<span style="color:var(--slate-400);">-- ${isEn ? "No Visual Encounter" : "Sin Contacto Visual"}.</span> <button onclick="triggerRadarReroll('${targetZone}')" class="action-btn" style="border-color:#38bdf8; background:rgba(2,132,199,0.25); color:#7dd3fc; font-size:0.75rem; padding:3px 10px; margin-left:8px; font-weight:700;">📡 ${isEn ? "Radar Sweep Re-roll (R)" : "Barrido Radar: Repetir Tirada (R)"}</button>`;
          }
          if (btnCombat) btnCombat.style.display = "none";
          showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ (R) Contact eligible for Radar Sweep!` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ ¡(R) Casilla con opción a barrido de Radar!`);
        } else if (radarInfo.isEquipped && radarInfo.isDamaged) {
          // Radar equipped but inoperative/damaged
          campaignState.workflow.encounterDetails = isEn ? "No Encounter ((R) slot, but radar is INOP/damaged)" : "Sin Encuentro (Casilla (R), pero radar AVERIADO)";
          if (detEl) {
            detEl.innerHTML = `<span style="color:var(--slate-400);">-- ${isEn ? "No Encounter" : "Sin Encuentro"}.</span> <span style="color:#ef4444; font-size:0.75rem; margin-left:8px;">⚠️ ${isEn ? "(R) Radar slot missed: Radar is DAMAGED" : "Oportunidad (R) perdida: Radar AVERIADO"}</span>`;
          }
          if (btnCombat) btnCombat.style.display = "none";
          showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ (R) No contact (Radar damaged)` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ (R) Sin contacto (Radar averiado)`);
        } else {
          // No radar equipped on this submarine/date
          campaignState.workflow.encounterDetails = isEn ? "No Encounter ((R) requires radar)" : "Sin Encuentro (Casilla (R) requiere radar a bordo)";
          if (detEl) {
            detEl.innerHTML = `<span style="color:var(--slate-400);">-- ${isEn ? "No Encounter" : "Sin Encuentro"}.</span> <span style="color:#94a3b8; font-size:0.75rem; margin-left:8px;">ℹ️ ${isEn ? "Slot (R) only grants re-roll with radar" : "Casilla (R) requiere radar para re-tirada"}</span>`;
          }
          if (btnCombat) btnCombat.style.display = "none";
          showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ No Encounter (No radar equipped)` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ Sin Contacto (Submarino sin radar)`);
        }
        updatePatrolPhaseUI();
        saveState();
        return;
      }

      if (encounter === "--") {
        campaignState.workflow.encounterType = "None";
        campaignState.workflow.encounterDetails = isEn ? "Clear sea. No contacts in this sector." : "Mar despejado. Sin contactos en este sector.";
        if (detEl) {
          if (isSpecialBox) {
            detEl.innerHTML = isEn
              ? `<div style="background:rgba(2,132,199,0.15); border:1px solid #0284c7; border-radius:6px; padding:10px; margin-top:6px;">
                  <div style="color:#38bdf8; font-weight:800; font-size:0.90rem;">
                    🎯 Clear approach! No enemy naval interception in this sector.
                  </div>
                  <p style="margin:4px 0 8px 0; font-size:0.80rem; color:#cbd5e1;">
                    Your submarine has reached the target area. Execute your Special Mission using its dedicated tactical tables or claim Rule 7.14 combat patrol credit:
                  </p>
                  <button type="button" onclick="triggerSpecialMissionAction()" class="action-btn" style="background:#0284c7; color:#fff; font-weight:bold; border:none; padding:6px 12px; font-size:0.82rem; cursor:pointer;">
                    🎯 Resolve Special Mission [Rule 7.0 - 7.14] ➔
                  </button>
                </div>`
              : `<div style="background:rgba(2,132,199,0.15); border:1px solid #0284c7; border-radius:6px; padding:10px; margin-top:6px;">
                  <div style="color:#38bdf8; font-weight:800; font-size:0.90rem;">
                    🎯 ¡Aproximación limpia! Sin intercepción naval hostil en este sector.
                  </div>
                  <p style="margin:4px 0 8px 0; font-size:0.80rem; color:#cbd5e1;">
                    El submarino ha alcanzado el objetivo. Ejecuta ahora tu Misión Especial en sus tablas tácticas correspondientes o registra el crédito de combate [Regla 7.14]:
                  </p>
                  <button type="button" onclick="triggerSpecialMissionAction()" class="action-btn" style="background:#0284c7; color:#fff; font-weight:bold; border:none; padding:6px 12px; font-size:0.82rem; cursor:pointer;">
                    🎯 Resolver Misión Especial [Reglas 7.0 - 7.14] ➔
                  </button>
                </div>`;
          } else {
            detEl.innerHTML = isEn
              ? `<span style="color:#94a3b8;">🌊 Clear sea. No contacts in this sector. Use <strong>Advance Box ▶</strong> to continue transit.</span>`
              : `<span style="color:#94a3b8;">🌊 Mar despejado. Sin contactos en este sector. Usa <strong>Avanzar Casilla ▶</strong> para continuar.</span>`;
          }
        }
        if (btnCombat) btnCombat.style.display = "none";
        showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ No Contact (Clear Sea)` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ Mar Despejado (Sin Contacto)`);
        updatePatrolPhaseUI();
        saveState();
      } else if (encounter.includes("Aircraft")) {
        campaignState.workflow.encounterType = "Aircraft";
        campaignState.workflow.encounterDetails = isEn ? "Enemy Aircraft Sighted" : "Avión Enemigo Avistado";
        if (detEl) {
          detEl.innerHTML = isEn
            ? `<div style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; border-radius:6px; padding:10px; margin-top:6px;">
                <div style="color:#f87171; font-weight:800; font-size:0.92rem; display:flex; align-items:center; gap:6px;">
                  <span>✈️</span> <span>ENEMY AIRCRAFT DETECTED! (Aircraft)</span>
                </div>
                <p style="margin:6px 0 10px 0; font-size:0.82rem; color:var(--slate-300);">
                  An enemy aircraft has spotted your position. Crash Dive [Chart A4] or AA Defense [Chart A2] resolution is handled in the Patrol tab.
                </p>
                <button onclick="setWorkflowPhase('patrol')" class="action-btn" style="background:#dc2626; color:#fff; font-weight:bold; border:1px solid #f87171; font-size:0.84rem; padding:6px 12px; cursor:pointer; width:100%; justify-content:center;">
                  ✈️ Proceed to Patrol: Resolve Air Threat ➔
                </button>
              </div>`
            : `<div style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; border-radius:6px; padding:10px; margin-top:6px;">
                <div style="color:#f87171; font-weight:800; font-size:0.92rem; display:flex; align-items:center; gap:6px;">
                  <span>✈️</span> <span>¡AMENAZA AÉREA DETECTADA! (Aircraft)</span>
                </div>
                <p style="margin:6px 0 10px 0; font-size:0.82rem; color:var(--slate-300);">
                  Un avión enemigo ha localizado tu posición. La resolución de Inmersión de Emergencia [Tabla A4] o Fuego AA [Tabla A2] se gestiona en la pestaña de Patrulla.
                </p>
                <button onclick="setWorkflowPhase('patrol')" class="action-btn" style="background:#dc2626; color:#fff; font-weight:bold; border:1px solid #f87171; font-size:0.84rem; padding:6px 12px; cursor:pointer; width:100%; justify-content:center;">
                  ✈️ Ir a Patrulla: Resolver Amenaza Aérea ➔
                </button>
              </div>`;
        }
        if (btnCombat) btnCombat.style.display = "none";
        showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ ⚠️ ENEMY AIRCRAFT SIGHTED!` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ ⚠️ ¡AVIÓN ENEMIGO AVISTADO!`);
        updatePatrolPhaseUI();
        saveState();
      } else if (encounter.includes("Minefield")) {
        campaignState.workflow.encounterType = "Minefield";
        campaignState.workflow.encounterDetails = isEn ? "Minefield Danger" : "Peligro Campo de Minas";
        if (detEl) {
          detEl.innerHTML = `<span style="color:#ef4444; font-weight:bold;">${isEn ? "💣 DANGER: MINEFIELD!" : "💣 ¡PELIGRO: CAMPO DE MINAS!"}</span><br>
          <button onclick="resolveMinefieldCrossing()" class="action-btn" style="border-color:#ef4444; color:#fca5a5; font-size:0.75rem; margin-top:6px;">☠️ ${isEn ? "Cross Minefield (2-5 Submarine Sunk)" : "Cruzar Campo de Minas (2-5 Submarino Hundido)"}</button>`;
        }
        if (btnCombat) btnCombat.style.display = "none";
        showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ 💣 DANGER: MINEFIELD!` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ 💣 ¡PELIGRO: CAMPO DE MINAS!`);
        updatePatrolPhaseUI();
        saveState();
      } else {
        let details = encounter;
        if (encounter === "Ship" || encounter === "Ship*") {
          const dShip = Math.floor(Math.random() * 6) + 1;
          details = isEn
            ? (dShip <= 4 ? "Small Ship (1d6: " + dShip + ")" : "Large Ship / Tanker (1d6: " + dShip + ")")
            : (dShip <= 4 ? "Buque Pequeño (1d6: " + dShip + ")" : "Petrolero / Buque Grande (1d6: " + dShip + ")");
        }
        campaignState.workflow.encounterType = encounter;
        campaignState.workflow.encounterDetails = details;
        if (detEl) {
          const displayDetails = isEn ? details : translatePhase2Encounter(details, false);
          detEl.innerHTML = isEn
            ? `<div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:10px; margin-top:6px;">
                <div style="color:#34d399; font-weight:800; font-size:0.92rem; display:flex; align-items:center; gap:6px;">
                  <span>🚢</span> <span>NAVAL CONTACT DETECTED! (${displayDetails})</span>
                </div>
                <p style="margin:6px 0 10px 0; font-size:0.82rem; color:var(--slate-300);">
                  Vessels spotted on the horizon. Proceed directly to the Ship Encounter tab (Phase 3) to identify the vessel (Charts T1–T5), select range, and conduct attack.
                </p>
                <button onclick="setWorkflowPhase(3)" class="action-btn" style="background:#059669; color:#fff; font-weight:bold; border:1px solid #34d399; font-size:0.84rem; padding:6px 12px; cursor:pointer; width:100%; justify-content:center; box-shadow:0 2px 8px rgba(16,185,129,0.3);">
                  🚢 Proceed to Ship Encounter (Phase 3) ➔
                </button>
              </div>`
            : `<div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:10px; margin-top:6px;">
                <div style="color:#34d399; font-weight:800; font-size:0.92rem; display:flex; align-items:center; gap:6px;">
                  <span>🚢</span> <span>¡CONTACTO NAVAL DETECTADO! (${displayDetails})</span>
                </div>
                <p style="margin:6px 0 10px 0; font-size:0.82rem; color:var(--slate-300);">
                  Se han avistado buques en la zona. Pasa directamente a la pestaña de Encuentro con Barcos (Fase 3) para identificar el buque (Tablas T1–T5), elegir distancia y combatir.
                </p>
                <button onclick="setWorkflowPhase(3)" class="action-btn" style="background:#059669; color:#fff; font-weight:bold; border:1px solid #34d399; font-size:0.84rem; padding:6px 12px; cursor:pointer; width:100%; justify-content:center; box-shadow:0 2px 8px rgba(16,185,129,0.3);">
                  🚢 Ir a Encuentro con Barcos (Fase 3) ➔
                </button>
              </div>`;
        }
        if (btnCombat) btnCombat.style.display = "none";
        showToast(isEn ? `🎲 Chart [A3]: 2d6 = ${sum} ➔ 🚢 NAVAL CONTACT: ${details}!` : `🎲 Tabla [A3]: 2d6 = ${sum} ➔ 🚢 ¡CONTACTO NAVAL: ${details}!`);
        updatePatrolPhaseUI();
        saveState();
      }
    }

    function triggerRadarReroll(targetZone) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const zoneRow = CHART_A3_DATA[targetZone] || CHART_A3_DATA["Transit"];
      let encounter = zoneRow[sum] || "--";
      if (encounter.includes("(R)")) encounter = isEn ? "-- (No contact on 2nd roll)" : "-- (Sin contacto en 2.ª tirada)";
      
      const detEl = document.getElementById('wf-enc-status-text');
      if (encounter !== "--" && !encounter.includes("Sin") && !encounter.includes("No contact")) {
        detEl.innerHTML = `<div style="background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:6px; padding:10px; margin-top:6px;">
          <div style="color:#34d399; font-weight:800; font-size:0.92rem;">📡 ${isEn ? "Radar Re-roll Result (2d6: " + sum + "): " + encounter : "Resultado Re-tirada Radar (2d6: " + sum + "): " + encounter}</div>
          <p style="margin:6px 0 10px 0; font-size:0.82rem; color:var(--slate-300);">${isEn ? "Contact confirmed by radar! Proceed directly to Ship Encounter tab (Phase 3)." : "¡Contacto confirmado por radar! Pasa a la pestaña de Encuentro con Barcos (Fase 3) para resolverlo."}</p>
          <button onclick="setWorkflowPhase(3)" class="action-btn" style="background:#059669; color:#fff; font-weight:bold; border:1px solid #34d399; font-size:0.84rem; padding:6px 12px; cursor:pointer; width:100%; justify-content:center; box-shadow:0 2px 8px rgba(16,185,129,0.3);">
            ${isEn ? "Proceed to Ship Encounter (Phase 3) ➔" : "Ir a Encuentro con Barcos (Fase 3) ➔"}
          </button>
        </div>`;
      } else {
        detEl.innerHTML = `📡 <strong>${isEn ? "Radar Re-roll Result (2d6: " + sum + "):" : "Resultado Re-tirada Radar (2d6: " + sum + "):"}</strong> <span style="color:var(--slate-400);">${encounter}</span>`;
      }
      showToast(isEn ? `Radar: Result ${sum}` : `Radar: Resultado ${sum}`);
    }

    function resolveMinefieldCrossing() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const detEl = document.getElementById('wf-enc-status-text');
      if (sum >= 2 && sum <= 5) {
        detEl.innerHTML = `<span style="color:#ef4444; font-weight:bold; font-size:1.1rem;">💀 ¡CATÁSTROFE! Mina impactada (2d6: ${sum}). Submarino Hundido (Sub Lost). Fin de campaña.</span>`;
        alert("¡Tu submarino ha chocado contra una mina naval y se ha hundido! (KIA / Sub Lost)");
      } else {
        detEl.innerHTML = `<span style="color:#22c55e; font-weight:bold;">✅ Campo de minas evadido con éxito (2d6: ${sum}). Submarino a salvo.</span>`;
      }
    }

    function highlightA2Row(tierIndex) {
      for (let i = 1; i <= 3; i++) {
        const row = document.getElementById('ppatrol-a2-row-' + i);
        if (row) {
          row.classList.remove('row-selected-danger', 'row-selected-warning', 'row-selected-success');
          if (i === tierIndex) {
            if (i === 1) row.classList.add('row-selected-success');
            else if (i === 2) row.classList.add('row-selected-warning');
            else if (i === 3) row.classList.add('row-selected-danger');
          }
        }
      }
    }

    function selectA2Row(tierIndex) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      highlightA2Row(tierIndex);

      const damageChit = document.getElementById('ppatrol-aircraft-damage-chit');
      if (damageChit) {
        if (tierIndex === 1) {
          damageChit.src = 'assets/chits/Aircraft Damage3.jpg';
        } else if (tierIndex === 2) {
          damageChit.src = 'assets/chits/Aircraft Damage2.jpg';
        } else {
          damageChit.src = 'assets/chits/Aircraft Damage.jpg';
        }
      }

      let outcome = "", col = "", rollText = "";
      if (tierIndex === 1) {
        outcome = isEn ? "💥 AIRCRAFT SHOT DOWN! Clean Victory!" : "💥 ¡AVIÓN DERRIBADO! Victoria limpia.";
        col = "#86efac";
        rollText = "2 - 3";
      } else if (tierIndex === 2) {
        outcome = isEn ? "⚠️ Aircraft Damaged (Attack aborted, retreats)" : "⚠️ Avión Dañado (Ataque interrumpido, se retira)";
        col = "#fbbf24";
        rollText = "4 - 5";
      } else {
        outcome = isEn ? "❌ Miss! Enemy aircraft bombs the submarine!" : "❌ Fallo. El avión enemigo bombardea el submarino.";
        col = "#f87171";
        rollText = "6 - 12";
      }

      const msg = isEn
        ? `Anti-Aircraft Defense [Chart A2 Selected]: 2d6 = ${rollText} ➔ ${outcome}`
        : `Defensa Antiaérea [Tabla A2 Seleccionada]: 2d6 = ${rollText} ➔ ${outcome}`;

      showToast(msg);
      const el = document.getElementById('res-interactive-a2');
      if (el) el.innerHTML = `<span style="color:${col}; font-weight:700;">${msg}</span>`;
      if (typeof updatePatrolAirAttackState === 'function') {
        updatePatrolAirAttackState(tierIndex === 3, 1);
      }
      saveState();
      return msg;
    }

    function rollInteractiveA2(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
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

      // Check DRM: AA guns and crew
      let drm = 0;
      const aaGuns = (campaignState.subSpecs && campaignState.subSpecs.aa) ? campaignState.subSpecs.aa : 1;
      if (aaGuns >= 3) drm -= 2;
      else if (aaGuns >= 2) drm -= 1;
      
      const crewQual = campaignState.crewQuality || "Trained";
      if (crewQual === "Elite" || crewQual === "Veteran") drm -= 1;

      const finalRoll = Math.max(2, sum + drm);

      let outcome = isEn ? "Miss" : "Fallo (Miss)";
      let col = "#94a3b8";
      if (finalRoll <= 3) {
        highlightA2Row(1);
        outcome = isEn ? "💥 AIRCRAFT SHOT DOWN! Clean Victory!" : "💥 ¡AVIÓN DERRIBADO! Victoria limpia.";
        col = "#86efac";
      } else if (finalRoll <= 5) {
        highlightA2Row(2);
        outcome = isEn ? "⚠️ Aircraft Damaged (Attack aborted, retreats)" : "⚠️ Avión Dañado (Ataque interrumpido, se retira)";
        col = "#fbbf24";
      } else {
        highlightA2Row(3);
        outcome = isEn ? "❌ Miss! Enemy aircraft bombs the submarine!" : "❌ Fallo. El avión enemigo bombardea el submarino.";
        col = "#f87171";
      }

      const drmSign = drm !== 0 ? (drm > 0 ? ` +${drm}` : ` ${drm}`) : '';
      const rollType = isManual ? (isEn ? "Tabletop 2d6" : "Mesa 2d6") : "2d6";
      const msg = isEn
        ? `Anti-Aircraft Defense [Chart A2]: ${rollType} = ${sum} (${d1}+${d2})${drmSign} ➔ Final: ${finalRoll} ➔ ${outcome}`
        : `Defensa Antiaérea [Tabla A2]: ${rollType} = ${sum} (${d1}+${d2})${drmSign} ➔ Final: ${finalRoll} ➔ ${outcome}`;

      showToast(msg);
      const el = document.getElementById('res-interactive-a2');
      if (el) el.innerHTML = `<span style="color:${col}; font-weight:700;">${msg}</span>`;
      if (typeof updatePatrolAirAttackState === 'function') {
        updatePatrolAirAttackState(finalRoll >= 6, 1);
      }
      saveState();
      return msg;
    }

    function highlightA4Row(tierIndex) {
      for (let i = 1; i <= 3; i++) {
        const row = document.getElementById('ppatrol-a4-row-' + i);
        if (row) {
          row.classList.remove('row-selected-danger', 'row-selected-warning', 'row-selected-success');
          if (i === tierIndex) {
            if (i === 1) row.classList.add('row-selected-danger');
            else if (i === 2) row.classList.add('row-selected-warning');
            else if (i === 3) row.classList.add('row-selected-success');
          }
        }
      }
    }

    function selectA4Row(tierIndex) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      highlightA4Row(tierIndex);

      let outcome = "", col = "", rollText = "";
      if (tierIndex === 1) {
        outcome = isEn ? "💥 2 x ENEMY AIR ATTACKS! (2 bomb runs + 1 automatic crew injury)" : "💥 ¡2 x ATAQUES AÉREOS ENEMIGOS! (2 pasadas bombas + 1 herida automática)";
        col = "#ef4444";
        rollText = isEn ? "Final ≤ 1" : "Final ≤ 1";
      } else if (tierIndex === 2) {
        outcome = isEn ? "⚠️ 1 x ENEMY AIR ATTACK! (1 bomb run + 1 automatic crew injury)" : "⚠️ 1 x ATAQUE AÉREO ENEMIGO (1 pasada bombas + 1 herida automática)";
        col = "#f59e0b";
        rollText = isEn ? "Final 2 - 5" : "Final 2 - 5";
      } else {
        outcome = isEn ? "🛡️ Emergency Crash Dive Successful! (Submerged safely)" : "🛡️ Inmersión de Emergencia con Éxito (Sumergido a salvo)";
        col = "#22c55e";
        rollText = isEn ? "Final 6 - 12" : "Final 6 - 12";
      }

      const msg = isEn
        ? `Aircraft Encounter [Chart A4 Selected]: ${rollText} ➔ ${outcome}`
        : `Encuentro Aéreo [Tabla A4 Seleccionada]: ${rollText} ➔ ${outcome}`;

      showToast(msg);
      const el = document.getElementById('res-interactive-a4');
      if (el) el.innerHTML = `<span style="color:${col}; font-weight:700;">${msg}</span>`;
      if (typeof updatePatrolAirAttackState === 'function') {
        updatePatrolAirAttackState(tierIndex <= 2, tierIndex === 1 ? 2 : 1);
      }
      saveState();
      return msg;
    }

    function rollInteractiveA4(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const monthStr = campaignState.workflow.selectedMonth || "1941-12";
      
      // 1. Modificador por Año
      let yearDrm = 0;
      if (monthStr.startsWith("1941")) yearDrm = 2;
      else if (monthStr.startsWith("1942")) yearDrm = 1;
      else if (monthStr.startsWith("1943")) yearDrm = 0;
      else yearDrm = -1;

      // 2. Modificadores de Tripulación y Buque
      let crewDrm = 0;
      const crewQual = campaignState.crewQuality || "Trained";
      if (crewQual === "Elite") crewDrm += 1;
      else if (crewQual === "Green") crewDrm -= 1;

      if (campaignState.crewAllInjured) crewDrm -= 1;
      if (campaignState.damage && campaignState.damage.divePlanes) crewDrm -= 1;
      const radarInfo = (typeof checkSubmarineRadarStatus === 'function') 
        ? checkSubmarineRadarStatus() 
        : { isOperational: !!campaignState.hasRadar };
      if (radarInfo.isOperational) crewDrm += 1;
      if (campaignState.tactical && campaignState.tactical.isNight) crewDrm += 1;

      const totalDrm = yearDrm + crewDrm;

      let d1, d2, roll, isManual = false;
      if (typeof manualRoll === 'number' && manualRoll >= 2 && manualRoll <= 12) {
        roll = manualRoll;
        d1 = Math.floor(roll / 2);
        d2 = roll - d1;
        isManual = true;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        roll = d1 + d2;
      }
      const finalRoll = roll + totalDrm;

      let outcome = isEn ? "Emergency Crash Dive Successful! (Submerged safely)" : "Inmersión de Emergencia con Éxito (Sumergido a salvo)";
      let col = "#22c55e";
      if (finalRoll <= 1) {
        highlightA4Row(1);
        outcome = isEn ? "💥 2 x ENEMY AIR ATTACKS! (2 bomb runs + 1 automatic crew injury)" : "💥 ¡2 x ATAQUES AÉREOS ENEMIGOS! (2 pasadas bombas + 1 herida automática)";
        col = "#ef4444";
      } else if (finalRoll <= 5) {
        highlightA4Row(2);
        outcome = isEn ? "⚠️ 1 x ENEMY AIR ATTACK! (1 bomb run + 1 automatic crew injury)" : "⚠️ 1 x ATAQUE AÉREO ENEMIGO (1 pasada bombas + 1 herida automática)";
        col = "#f59e0b";
      } else {
        highlightA4Row(3);
      }

      const drmSign = totalDrm >= 0 ? '+' : '';
      const rollType = isManual ? (isEn ? "Tabletop 2d6" : "Mesa 2d6") : "2d6";
      const msg = isEn
        ? `Aircraft Encounter [Chart A4]: ${rollType} = ${roll} (${d1}+${d2}) [Year DRM: ${yearDrm>=0?'+':''}${yearDrm}, Crew/Ship DRM: ${crewDrm>=0?'+':''}${crewDrm} = ${drmSign}${totalDrm}] ➔ Final: ${finalRoll} ➔ ${outcome}`
        : `Encuentro Aéreo [Tabla A4]: ${rollType} = ${roll} (${d1}+${d2}) [DRM Año: ${yearDrm>=0?'+':''}${yearDrm}, DRM Dotación/Buque: ${crewDrm>=0?'+':''}${crewDrm} = ${drmSign}${totalDrm}] ➔ Final: ${finalRoll} ➔ ${outcome}`;

      showToast(msg);
      const el = document.getElementById('res-interactive-a4');
      if (el) el.innerHTML = `<span style="color:${col}; font-weight:700;">${msg}</span>`;
      if (typeof updatePatrolAirAttackState === 'function') {
        updatePatrolAirAttackState(finalRoll <= 5, finalRoll <= 1 ? 2 : 1);
      }
      saveState();
      return msg;
    }

    function updatePatrolAirAttackState(isAttack, bombRuns = 1) {
      const panel = document.getElementById('ppatrol-air-attack-panel');
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      if (!panel) return;
      panel.style.display = 'block';
      const sumEl = document.getElementById('ppatrol-air-attack-summary');
      if (isAttack) {
        if (sumEl) {
          sumEl.innerHTML = isEn
            ? `⚠️ <strong>Active Air Attack (${bombRuns} Bomb Run${bombRuns > 1 ? 's' : ''} + 1 Crew Casualty):</strong> Resolve crew casualty (Step 4A.1) and bomb damage (Step 4A.2) or FIDO impact (Step 4B) below:`
            : `⚠️ <strong>Ataque Aéreo Activo (${bombRuns} Pasada${bombRuns > 1 ? 's' : ''} de Bombas + 1 Baja de Tripulación):</strong> Resuelve a continuación la baja en dotación (Paso 4A.1) y los impactos de bombas (Paso 4A.2) o impacto FIDO (Paso 4B):`;
          sumEl.style.borderColor = '#ef4444';
          sumEl.style.color = '#fde047';
        }
        const monthStr = (campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
        const fidoBox = document.getElementById('ppatrol-air-fido-box');
        if (fidoBox) {
          fidoBox.style.display = (monthStr >= '1944-05') ? 'block' : 'none';
        }
      } else {
        if (sumEl) {
          sumEl.innerHTML = isEn
            ? `🛡️ <strong>Crash Dive Successful (Result ≥ 6):</strong> Submarine submerged safely. No bomb or torpedo damage sustained in this box.`
            : `🛡️ <strong>Inmersión Exitosa (Resultado ≥ 6):</strong> Submarino sumergido a salvo. No sufre impactos de bombas ni torpedos en esta casilla.`;
          sumEl.style.borderColor = '#22c55e';
          sumEl.style.color = '#86efac';
        }
      }
    }

    let currentB7SelectedPos = 7;
    let currentB7SelectedPosRoll = null;

    function getB7RoleInfo(sum, isEn) {
      let role = isEn ? "Crew (Generic)" : "Dotación genérica";
      let roleKey = "crew";
      let subSlotKey = "crew-1";
      let penalty = isEn ? "If all generic crew boxes are SW/KIA: +1 torpedo To-Hit." : "Si todas las casillas genéricas quedan SW/KIA: +1 a impactar con torpedos.";

      if (sum === 2) {
        role = isEn ? "Captain" : "Comandante (Capitán)";
        roleKey = "captain";
        subSlotKey = "capt";
        penalty = isEn ? "XO takes command. Detection +1, To-Hit +1." : "El Oficial Ejecutivo toma el mando (+1 detección, +1 impactar).";
      } else if (sum === 3) {
        role = isEn ? "Chief Engineer" : "Jefe de Máquinas (Ingeniero)";
        roleKey = "engineer";
        subSlotKey = "eng";
        penalty = isEn ? "All repair and flooding rolls receive +1 DRM." : "Todas las reparaciones y achique reciben +1 DRM.";
      } else if (sum === 4) {
        role = isEn ? "Executive Officer (XO)" : "Segundo Oficial (XO)";
        roleKey = "xo";
        subSlotKey = "xo";
        penalty = isEn ? "If XO was in command, 3rd officer takes command." : "Si el XO mandaba, el 3.er oficial asume el mando (+1/+1).";
      } else if (sum === 5) {
        role = isEn ? "Medical Officer" : "Oficial Médico";
        roleKey = "medic";
        subSlotKey = "med";
        penalty = isEn ? "All crew with SW become KIA upon zone change on 1d6 >= 4." : "Heridos graves (SW) mueren (KIA) en cada cambio de zona con 1d6 >= 4.";
      } else if (sum >= 6 && sum <= 10) {
        const cNum = sum - 5;
        role = isEn ? `Generic Crew (#${cNum})` : `Dotación genérica (#${cNum})`;
        roleKey = "crew";
        subSlotKey = `crew-${cNum}`;
        penalty = isEn ? "All generic SW/KIA: +1 torpedo To-Hit and -1 crash dive." : "Toda dotación SW/KIA: +1 To-Hit torpedos y -1 inmersión de emergencia.";
      } else if (sum === 11) {
        role = isEn ? "Navigator" : "Navegante";
        roleKey = "navigator";
        subSlotKey = "nav";
        penalty = isEn ? "Submarine must abort if Navigator was acting as Captain." : "Submarino debe abortar si el navegante estaba de capitán.";
      } else if (sum === 12) {
        role = isEn ? "Pilot / Special Crew" : "Piloto / Dotación Especial";
        roleKey = "pilot";
        subSlotKey = "spec";
        penalty = isEn ? "Special mission fails automatically if all SW or KIA." : "Misión especial fracasa automáticamente si quedan SW o KIA.";
      }
      return { role, roleKey, subSlotKey, penalty };
    }

    function rollPatrolAirCrewPosOnly(manualPos) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      let d1, d2, sum;
      if (typeof manualPos === 'number' && manualPos >= 2 && manualPos <= 12) {
        sum = manualPos;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }
      currentB7SelectedPos = sum;
      const { role, roleKey, subSlotKey, penalty } = getB7RoleInfo(sum, isEn);
      currentB7SelectedPosRoll = { sum, d1, d2, role, roleKey, subSlotKey, penalty };

      const sel = document.getElementById('ppatrol-sel-air-crew-pos');
      if (sel) sel.value = String(sum);
      highlightB7PosRow(sum);

      // Check current health status of this crew member on the submarine board
      const curStatus = (typeof subBoardState !== 'undefined' && subBoardState.crew && subBoardState.crew[subSlotKey]) || 'active';
      let curStatusDesc = isEn ? 'Active (Healthy)' : 'Activo (Sin heridas previas)';
      let curStatusColor = '#4ade80';
      if (curStatus === 'wounded') {
        curStatusDesc = isEn ? '⚠️ Light Wound (LW) previously sustained — another LW will accumulate to Serious Wound (SW)!' : '⚠️ Tiene 1 Herida Leve (HL) previa — ¡otra herida leve se acumulará a Herida Grave (HG)!';
        curStatusColor = '#38bdf8';
      } else if (curStatus === 'serious') {
        curStatusDesc = isEn ? '🚨 Serious Wound (SW) previously sustained — any additional injury will result in KIA!' : '🚨 Ya tiene Herida Grave (HG) previa — ¡cualquier nueva herida causará baja definitiva (KIA)!';
        curStatusColor = '#fbbf24';
      } else if (curStatus === 'kia') {
        curStatusDesc = isEn ? '💀 Already KIA (Killed in Action)' : '💀 Ya es baja definitiva (KIA)';
        curStatusColor = '#f87171';
      }

      const resEl = document.getElementById('ppatrol-air-crew-res');
      if (resEl) {
        resEl.innerHTML = `
          <div style="background:rgba(15,23,42,0.85); border:1px solid #38bdf8; border-radius:6px; padding:10px 12px; margin-top:4px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
              <span style="font-size:0.84rem; font-weight:800; color:#fde047;">
                🎲 1. Puesto Afectado: 2d6 = [${d1}+${d2} = ${sum}] ➔ <span style="color:#ffffff;">${role}</span>
              </span>
              <span style="font-size:0.72rem; color:${curStatusColor}; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:4px; border:1px solid ${curStatusColor}; font-weight:bold;">
                ${curStatusDesc}
              </span>
            </div>
            <div style="margin-top:8px; font-size:0.78rem; color:#bae6fd; display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.1rem;">👉</span>
              <span><strong>Paso 2:</strong> Pulsa el botón rojo <strong>«🎲 2. Tirar Tipo de Baja (1d6)»</strong> o haz clic en la tabla de Gravedad para ver qué daño sufre.</span>
            </div>
          </div>
        `;
      }

      const sevBtn = document.getElementById('ppatrol-btn-air-crew-sev-roll');
      if (sevBtn) {
        sevBtn.style.boxShadow = '0 0 12px #ef4444';
      }

      showToast(isEn ? `Step 1: Crew station hit: ${role}. Now roll 1d6 for Severity.` : `Paso 1: Puesto alcanzado: ${role}. Ahora tira 1d6 para determinar la gravedad.`);
    }

    function rollPatrolAirCrewSevOnly(manualSev) {
      const pos = currentB7SelectedPos || parseInt(document.getElementById('ppatrol-sel-air-crew-pos')?.value || '7', 10);
      let sev = (typeof manualSev === 'number' && manualSev >= 1 && manualSev <= 6)
        ? manualSev
        : (Math.floor(Math.random() * 6) + 1);

      const sevBtn = document.getElementById('ppatrol-btn-air-crew-sev-roll');
      if (sevBtn) sevBtn.style.boxShadow = 'none';

      rollPatrolAirCrewInjury(pos, sev);
    }

    function rollPatrolAirCrewInjury(manualPos, manualSev) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      let d1, d2, sum;
      if (typeof manualPos === 'number' && manualPos >= 2 && manualPos <= 12) {
        sum = manualPos;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }
      currentB7SelectedPos = sum;
      const sevRoll = (typeof manualSev === 'number' && manualSev >= 1 && manualSev <= 6) ? manualSev : (Math.floor(Math.random() * 6) + 1);

      const { role, roleKey, subSlotKey, penalty } = getB7RoleInfo(sum, isEn);

      let sev = isEn ? "LW (Light Wound)" : "LW (Herida Leve)";
      let sevDesc = isEn ? "No adverse combat effect." : "Sin efecto negativo en combate.";
      let sevKey = "LW";
      if (sevRoll >= 4 && sevRoll <= 5) {
        sev = isEn ? "SW (Serious Wound)" : "SW (Herida Grave)";
        sevDesc = isEn ? "Incapacitated for service." : "Incapacitado para el servicio.";
        sevKey = "SW";
      } else if (sevRoll === 6) {
        sev = isEn ? "KIA (Killed in Action)" : "KIA (Muerto en Combate)";
        sevDesc = isEn ? "Permanent combat casualty." : "Baja definitiva en combate.";
        sevKey = "KIA";
      }

      // Record in campaignState
      campaignState.crewInjuries = campaignState.crewInjuries || {};
      if (sevKey === 'SW' || sevKey === 'KIA') {
        campaignState.crewInjuries[roleKey] = true;
      }

      let dmgPayload = {
        crewInjury: { roleKey: subSlotKey, severity: sevKey },
        source: 'air',
        reason: `${role} (${sevKey})`
      };

      if (typeof window.applySubmarineDamage === 'function') {
        window.applySubmarineDamage(dmgPayload);
      }

      if (typeof highlightB7PosRow === 'function') highlightB7PosRow(sum);
      if (typeof highlightB7SevRow === 'function') highlightB7SevRow(sevRoll);

      const resEl = document.getElementById('ppatrol-air-crew-res');
      if (resEl) {
        resEl.innerHTML = renderB7CasualtyTableHtml(sum, d1, d2, role, sevRoll, sevKey, sev, sevDesc, penalty, isEn, dmgPayload.injuryResult);
      }

      // Also sync to Phase 4
      const p4ResEl = document.getElementById('wf-b7-crew-res');
      if (p4ResEl) {
        p4ResEl.innerHTML = renderB7CasualtyTableHtml(sum, d1, d2, role, sevRoll, sevKey, sev, sevDesc, penalty, isEn, dmgPayload.injuryResult);
      }

      const toastExtra = (dmgPayload.injuryResult && dmgPayload.injuryResult.isAccumulated) ? ` ➔ ${dmgPayload.injuryResult.accumMsg}` : '';
      showToast(isEn ? `Casualty recorded: ${role} (${sev})${toastExtra}` : `Baja registrada: ${role} (${sev})${toastExtra}`);
      saveState();
    }

    function renderB7CasualtyTableHtml(sum, d1, d2, role, sevRoll, sevKey, sev, sevDesc, penalty, isEn, injuryResult = null) {
      let sevBg = 'rgba(56, 189, 248, 0.2)';
      let sevColor = '#38bdf8';
      let sevBorder = 'rgba(56, 189, 248, 0.4)';
      if (sevKey === 'SW') {
        sevBg = 'rgba(245, 158, 11, 0.25)';
        sevColor = '#fbbf24';
        sevBorder = 'rgba(245, 158, 11, 0.5)';
      } else if (sevKey === 'KIA') {
        sevBg = 'rgba(239, 68, 68, 0.25)';
        sevColor = '#f87171';
        sevBorder = 'rgba(239, 68, 68, 0.5)';
      }

      let accumBadgeHtml = '';
      if (injuryResult && injuryResult.isAccumulated) {
        accumBadgeHtml = `
          <div style="margin-top:5px; background:rgba(239,68,68,0.22); border:1px solid #ef4444; border-radius:4px; padding:3px 6px;">
            <div style="font-weight:bold; color:#fca5a5; font-size:0.72rem;">⚠️ ${injuryResult.accumMsg}</div>
            <div style="font-size:0.68rem; color:#fed7aa; margin-top:2px;">
              ${isEn 
                ? `Previous on board: <strong>${injuryResult.prevStatus.toUpperCase()}</strong> ➔ Final: <strong style="color:#ef4444;">${injuryResult.newStatus.toUpperCase()}</strong>`
                : `Estado previo en buque: <strong>${injuryResult.prevStatus.toUpperCase()}</strong> ➔ Estado final: <strong style="color:#ef4444;">${injuryResult.newStatus.toUpperCase()}</strong>`}
            </div>
          </div>
        `;
      } else {
        accumBadgeHtml = `
          <div style="margin-top:4px; font-size:0.68rem; color:#94a3b8;">
            ${isEn ? 'Fitted on Submarine Sheet' : 'Marcador actualizado en la Hoja del Submarino'}
          </div>
        `;
      }

      return `
        <table class="table-sub-data" style="width:100%; border-collapse:collapse; margin-top:6px; font-size:0.75rem; text-align:left; background:rgba(15,23,42,0.85); border:1px solid rgba(239,68,68,0.4); border-radius:6px; overflow:hidden;">
          <thead>
            <tr style="background:rgba(239,68,68,0.22); color:#fca5a5; font-size:0.72rem; text-transform:uppercase;">
              <th style="padding:5px 8px; border:1px solid rgba(239,68,68,0.3); width:32%;">${isEn ? 'Station (2d6)' : 'Puesto Afectado (2d6)'}</th>
              <th style="padding:5px 8px; border:1px solid rgba(239,68,68,0.3); width:34%;">${isEn ? 'Severity & Accumulation (1d6)' : 'Gravedad y Acumulación (1d6)'}</th>
              <th style="padding:5px 8px; border:1px solid rgba(239,68,68,0.3); width:34%;">${isEn ? 'Operational Effect' : 'Efecto Operativo'}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); font-weight:bold; color:var(--gold-300); vertical-align:top;">
                <div style="font-size:0.72rem; color:#94a3b8;">2d6 = ${sum} [${d1}+${d2}]</div>
                <div style="color:#ffffff; font-size:0.80rem; margin-top:2px;">${role}</div>
              </td>
              <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); vertical-align:top;">
                <div style="font-size:0.72rem; color:#94a3b8;">1d6 = ${sevRoll}</div>
                <span style="display:inline-block; padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem; background:${sevBg}; color:${sevColor}; border:1px solid ${sevBorder}; margin-top:2px;">${sev}</span>
                <div style="font-size:0.70rem; color:#cbd5e1; margin-top:3px;">${sevDesc}</div>
                ${accumBadgeHtml}
              </td>
              <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); color:#e2e8f0; font-size:0.73rem; line-height:1.4; vertical-align:top;">
                ${penalty}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }
    window.renderB7CasualtyTableHtml = renderB7CasualtyTableHtml;

    function getB6DamageMeta(d66, desc, isEn) {
      if ([12, 21, 31, 43, 44, 51].includes(d66)) {
        return {
          badge: `<span style="background:rgba(56,189,248,0.22); color:#38bdf8; border:1px solid rgba(56,189,248,0.4); padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem;">💧 ${isEn ? '+1 Flooding' : '+1 Inundación'}</span>`,
          effect: isEn ? "Advance Flooding Track by 1" : "Avanza 1 casilla en Track de Inundación"
        };
      }
      if (d66 === 54) {
        return {
          badge: `<span style="background:rgba(56,189,248,0.3); color:#38bdf8; border:1px solid #0284c7; padding:2px 6px; border-radius:4px; font-weight:900; font-size:0.72rem;">💧💧 ${isEn ? '+2 Floods' : '+2 Inundación Doble'}</span>`,
          effect: isEn ? "Advance Flooding Track by 2" : "Avanza 2 casillas en Track de Inundación"
        };
      }
      if ([33, 35, 41, 45, 52, 55].includes(d66)) {
        return {
          badge: `<span style="background:rgba(239,68,68,0.22); color:#f87171; border:1px solid rgba(239,68,68,0.4); padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem;">💥 ${isEn ? '+1 Hull Damage' : '+1 Daño de Casco'}</span>`,
          effect: isEn ? "Advance Hull Damage Track by 1" : "Avanza 1 casilla en Track de Daño de Casco"
        };
      }
      if (d66 === 65) {
        return {
          badge: `<span style="background:rgba(239,68,68,0.35); color:#fca5a5; border:1px solid #ef4444; padding:2px 6px; border-radius:4px; font-weight:900; font-size:0.72rem;">💥💥 ${isEn ? '+2 Hull Damage' : '+2 Casco Doble'}</span>`,
          effect: isEn ? "Advance Hull Damage Track by 2" : "Avanza 2 casillas en Track de Daño de Casco"
        };
      }
      if (d66 === 34) {
        return {
          badge: `<span style="background:rgba(245,158,11,0.25); color:#fbbf24; border:1px solid rgba(245,158,11,0.4); padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem;">🩺 ${isEn ? 'Crew Casualty' : 'Baja Dotación'}</span>`,
          effect: isEn ? "Roll 1 casualty on Chart B7" : "Tirar 1 baja en Tabla B7"
        };
      }
      if (d66 === 53) {
        return {
          badge: `<span style="background:rgba(245,158,11,0.35); color:#fcd34d; border:1px solid #f59e0b; padding:2px 6px; border-radius:4px; font-weight:900; font-size:0.72rem;">🩺🩺 ${isEn ? '2x Crew Casualties' : 'Bajas Dotación x2'}</span>`,
          effect: isEn ? "Roll 2 casualties on Chart B7" : "Tirar 2 bajas en Tabla B7"
        };
      }
      if (d66 === 15) {
        return {
          badge: `<span style="background:rgba(168,85,247,0.22); color:#c084fc; border:1px solid rgba(168,85,247,0.4); padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem;">🛠️ ${isEn ? 'System Inop' : 'Avería Sistema'}</span>`,
          effect: isEn ? "-1 to Crash Dive / Inop" : "-1 a Inmersión de Emergencia / Inop"
        };
      }
      if (d66 === 66) {
        return {
          badge: `<span style="background:rgba(251,146,60,0.25); color:#fdba74; border:1px solid rgba(251,146,60,0.4); padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem;">⛽ ${isEn ? 'Fuel Leak' : 'Fuga Combustible'}</span>`,
          effect: isEn ? "Oil slick visible (+1 ASW)" : "Rastro visible (+1 detección ASW)"
        };
      }
      return {
        badge: `<span style="background:rgba(168,85,247,0.22); color:#c084fc; border:1px solid rgba(168,85,247,0.4); padding:2px 6px; border-radius:4px; font-weight:bold; font-size:0.72rem;">🛠️ ${isEn ? 'System Damaged' : 'Avería Sistema'}</span>`,
        effect: isEn ? "Mark damaged until repaired (B7)" : "Marcar avería en tablero / Inop"
      };
    }
    window.getB6DamageMeta = getB6DamageMeta;

    function renderB6DamageTableHtml(hits, d1, d2, sum, total, isAir, damageDetails, isEn) {
      const attackLabel = isAir 
        ? (isEn ? 'Bomb Hit' : 'Bomba')
        : (isEn ? 'Depth Charge' : 'Carga de Prof.');
      const icon = isAir ? '💣' : '⚓';

      const rowsHtml = damageDetails.map(item => {
        return `
          <tr>
            <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); text-align:center; font-weight:bold; color:#f87171; white-space:nowrap; vertical-align:middle;">
              ${icon} ${attackLabel} #${item.h}
            </td>
            <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); text-align:center; font-weight:bold; color:var(--gold-300); white-space:nowrap; vertical-align:middle;">
              <div style="font-size:0.70rem; color:#94a3b8;">[${item.red}, ${item.white}]</div>
              <div style="font-size:0.82rem; font-weight:900; color:var(--gold-400);">d66 = ${item.d66}</div>
            </td>
            <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); font-weight:bold; color:#ffffff; font-size:0.78rem; vertical-align:middle;">
              ${item.desc}
            </td>
            <td style="padding:6px 8px; border:1px solid rgba(239,68,68,0.25); vertical-align:middle;">
              <div>${item.meta.badge}</div>
              <div style="font-size:0.70rem; color:#cbd5e1; margin-top:3px; line-height:1.25;">${item.meta.effect}</div>
            </td>
          </tr>
        `;
      }).join('');

      return `
        <div style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; border-radius:6px; padding:6px 10px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
          <span style="color:#f87171; font-weight:900; font-size:0.82rem;">
            ⚠️ 🎲 2d6 = [${d1}+${d2} = ${sum}]${isAir ? ' (+2 DRM Aéreo = ' + total + ')' : ''} ➔ <strong>${hits} ${isEn ? (isAir ? 'BOMB HIT(S) SUFFERED!' : 'DEPTH CHARGE HIT(S)!') : (isAir ? 'IMPACTO(S) DE BOMBAS SUFRIDO(S)!' : 'IMPACTO(S) DE CARGAS SUFRIDO(S)!')}</strong>
          </span>
          <span style="font-size:0.70rem; color:#fca5a5; font-weight:bold; background:rgba(0,0,0,0.4); padding:2px 6px; border-radius:3px;">
            Tabla B6 (d66)
          </span>
        </div>

        <table class="table-sub-data" style="width:100%; border-collapse:collapse; margin-top:4px; font-size:0.75rem; text-align:left; background:rgba(15,23,42,0.85); border:1px solid rgba(239,68,68,0.4); border-radius:6px; overflow:hidden;">
          <thead>
            <tr style="background:rgba(239,68,68,0.25); color:#fca5a5; font-size:0.72rem; text-transform:uppercase;">
              <th style="padding:6px 8px; border:1px solid rgba(239,68,68,0.3); width:18%; text-align:center;">${isEn ? 'Hit / Run' : 'Impacto'}</th>
              <th style="padding:6px 8px; border:1px solid rgba(239,68,68,0.3); width:20%; text-align:center;">${isEn ? 'd66 Roll' : 'Tirada (d66)'}</th>
              <th style="padding:6px 8px; border:1px solid rgba(239,68,68,0.3); width:34%;">${isEn ? 'Affected System / Area' : 'Sistema / Sección Afectada'}</th>
              <th style="padding:6px 8px; border:1px solid rgba(239,68,68,0.3); width:28%;">${isEn ? 'Operational Effect' : 'Efecto Operativo'}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;
    }
    window.renderB6DamageTableHtml = renderB6DamageTableHtml;

    function rollPatrolAirBombRun(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      let d1, d2, sum;
      if (typeof manualRoll === 'number' && manualRoll >= 2 && manualRoll <= 12) {
        sum = manualRoll;
        d1 = Math.floor(sum / 2);
        d2 = sum - d1;
      } else {
        d1 = Math.floor(Math.random() * 6) + 1;
        d2 = Math.floor(Math.random() * 6) + 1;
        sum = d1 + d2;
      }
      
      // Rule 8.3: Aircraft bomb attack on Chart B5 has +2 DRM!
      const total = sum + 2;
      let hits = 0;
      let tier = 1;
      if (total <= 3) { hits = 0; tier = 1; }
      else if (total <= 6) { hits = 1; tier = 2; }
      else if (total <= 8) { hits = 2; tier = 3; }
      else if (total <= 10) { hits = 3; tier = 4; }
      else if (total === 11) { hits = 4; tier = 5; }
      else if (total === 12) { hits = 5; tier = 6; }
      else { hits = 99; tier = 7; } // Catastrophic

      if (typeof highlightB5Row === 'function') highlightB5Row(tier);

      const resEl = document.getElementById('ppatrol-air-bomb-res');
      if (hits === 0) {
        if (resEl) {
          resEl.innerHTML = `
            <div style="background:rgba(34,197,94,0.15); border:1px solid #22c55e; border-radius:6px; padding:8px 12px; color:#86efac; font-size:0.78rem;">
              🎲 2d6 = [${d1}+${d2} = ${sum}] (+2 DRM Aéreo = ${total}) ➔ <strong>${isEn ? 'INEFFECTIVE! Bombs exploded off target with no damage.' : '¡INEFICAZ! Las bombas explotaron lejos sin causar daños.'}</strong>
            </div>
          `;
        }
        showToast(isEn ? "Air attack ineffective! No damage." : "¡Ataque aéreo ineficaz! Sin daños.");
        return;
      } else if (hits === 99) {
        if (typeof window.applySubmarineDamage === 'function') {
          window.applySubmarineDamage({ isSunk: true, source: 'air', reason: 'Direct catastrophic bomb hit' });
        }
        if (resEl) {
          resEl.innerHTML = `
            <div style="background:rgba(239,68,68,0.25); border:1px solid #ef4444; border-radius:6px; padding:10px 12px; color:#fca5a5; font-size:0.85rem; font-weight:bold;">
              💥 🎲 2d6 = [${d1}+${d2} = ${sum}] (+2 DRM Aéreo = ${total}) ➔ <strong>${isEn ? 'DIRECT HIT! SUBMARINE SUNK!' : '¡IMPACTO DIRECTO! ¡SUBMARINO HUNDIDO!'}</strong>
            </div>
          `;
        }
        showToast(isEn ? "DISASTER! Submarine destroyed by aerial bombs." : "¡DESASTRE! Submarino destruido por bombas aéreas.");
        return;
      }

      // Roll Chart B6 (d66) for each hit
      const damageDetails = [];
      for (let h = 1; h <= hits; h++) {
        const red = Math.floor(Math.random() * 6) + 1;
        const white = Math.floor(Math.random() * 6) + 1;
        const d66 = red * 10 + white;
        let desc = (typeof CHART_B6_TABLE !== 'undefined' && CHART_B6_TABLE[d66]) 
          ? (typeof CHART_B6_TABLE[d66] === 'function' ? CHART_B6_TABLE[d66](isEn) : CHART_B6_TABLE[d66])
          : (isEn ? "Minor Damage" : "Avería Menor");
        if (isEn && window.I18N_PHASE3_B6_EN && window.I18N_PHASE3_B6_EN[d66]) {
          desc = window.I18N_PHASE3_B6_EN[d66];
        }
        const meta = getB6DamageMeta(d66, desc, isEn);
        damageDetails.push({ h, red, white, d66, desc, meta });
      }

      // Centralized Submarine State Update for each bomb hit
      damageDetails.forEach(item => {
        const d66 = item.d66;
        const desc = item.desc;
        if ([12, 21, 31, 43, 44, 51].includes(d66)) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ flooding: 1, source: 'air', reason: desc });
          }
        } else if (d66 === 54) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ flooding: 2, source: 'air', reason: desc });
          }
        } else if ([33, 35, 41, 45, 52, 55].includes(d66)) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ hullDamage: 1, source: 'air', reason: desc });
          }
        } else if (d66 === 65) {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ hullDamage: 2, source: 'air', reason: desc });
          }
        } else if (d66 === 34) {
          if (typeof rollPatrolAirCrewInjury === 'function') rollPatrolAirCrewInjury();
        } else if (d66 === 53) {
          if (typeof rollPatrolAirCrewInjury === 'function') {
            rollPatrolAirCrewInjury();
            rollPatrolAirCrewInjury();
          }
        } else {
          if (typeof window.applySubmarineDamage === 'function') {
            window.applySubmarineDamage({ systemsDamaged: desc, source: 'air', reason: desc });
          }
        }
      });

      if (resEl) {
        resEl.innerHTML = renderB6DamageTableHtml(hits, d1, d2, sum, total, true, damageDetails, isEn);
      }
      showToast(isEn ? `Air attack! ${hits} bomb hits sustained.` : `¡Ataque aéreo! ${hits} impactos de bombas sufridos.`);
      saveState();
    }

    function highlightB7PosRow(pos) {
      const posIds = [2, 3, 4, 5, 6, 11, 12];
      posIds.forEach(id => {
        const row = document.getElementById('b7-pos-row-' + id);
        if (row) {
          const isMatch = (id === 6) ? (pos >= 6 && pos <= 10) : (id === pos);
          row.classList.toggle('row-selected-warning', isMatch);
        }
      });
    }

    function highlightB7SevRow(sev) {
      const sevMap = { 1: 1, 2: 1, 3: 1, 4: 4, 5: 4, 6: 6 };
      [1, 4, 6].forEach(id => {
        const row = document.getElementById('b7-sev-row-' + id);
        if (row) {
          const isMatch = (sevMap[sev] === id);
          row.classList.remove('row-selected-danger', 'row-selected-warning', 'row-selected-info');
          if (isMatch) {
            if (id === 6) row.classList.add('row-selected-danger');
            else if (id === 4) row.classList.add('row-selected-warning');
            else row.classList.add('row-selected-info');
          }
        }
      });
    }

    function selectB7Pos(pos) {
      currentB7SelectedPos = pos;
      const sel = document.getElementById('ppatrol-sel-air-crew-pos');
      if (sel) sel.value = String(pos);
      highlightB7PosRow(pos);
      rollPatrolAirCrewPosOnly(pos);
    }

    function selectB7Sev(sev) {
      const sevSel = document.getElementById('ppatrol-sel-air-crew-sev');
      if (sevSel) sevSel.value = String(sev);
      highlightB7SevRow(sev);
      rollPatrolAirCrewSevOnly(sev);
    }

    function highlightB5Row(tier) {
      for (let i = 1; i <= 7; i++) {
        const row = document.getElementById('b5-row-' + i);
        if (row) {
          row.classList.remove('row-selected-danger', 'row-selected-warning', 'row-selected-success');
          if (i === tier) {
            if (i === 1) row.classList.add('row-selected-success');
            else if (i <= 3) row.classList.add('row-selected-warning');
            else row.classList.add('row-selected-danger');
          }
        }
      }
    }

    function selectB5Row(tier) {
      highlightB5Row(tier);
      const tierToSum = { 1: 2, 2: 4, 3: 6, 4: 8, 5: 9, 6: 10, 7: 12 };
      const chosenSum = tierToSum[tier] || 7;
      const sel = document.getElementById('ppatrol-sel-air-bomb-roll');
      if (sel) sel.value = String(chosenSum);
      rollPatrolAirBombRun(chosenSum);
    }

    // ====================================================================
    // INTERACTIVE FUNCTIONS FOR CHARTS B8, B9, B10, B11, B12, K5, K6
    // ====================================================================

// KO-HYOTEKI SPECIAL OPERATIONS DICE HELPERS [M5-M8]
    function rollM5Net() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const hasBoatHandling = !!campaignState.tokens['midget-boat'];
      const el = document.getElementById('m5-net-res');

      if (sum === 2) {
        el.style.color = '#ef4444';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Redes M5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ ¡ATRAPADO SIN ESPERANZA! Da un Banzai al Emperador y comete Seppuku. Misión perdida.`;
        showToast("¡Minisubmarino atrapado sin remedio!");
      } else if (sum === 3) {
        el.style.color = '#f59e0b';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Redes M5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ Atrapado: Detectado por ASV. Tira de nuevo con -1 DRM.`;
        showToast("Atrapado: ASV detecta al minisub.");
      } else if (sum === 4 && !hasBoatHandling) {
        el.style.color = '#38bdf8';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Redes M5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ Atraviesa las redes, pero tira detección por ASV.`;
        showToast("Redes superadas con detección posible.");
      } else {
        el.style.color = '#34d399';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Redes M5: 2d6 = [${d1} + ${d2} = ${sum}]</span> ➔ ¡REDES SUPERADAS LIMPIAMENTE! El minisub se infiltra en la rada interior.`;
        showToast("¡Redes superadas limpiamente!");
      }
    }

    function rollM6Event() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;
      const evt = CHART_M6_EVENTS[sum] || "Sin novedad especial.";
      const el = document.getElementById('m6-event-res');
      el.innerHTML = `<strong>Tirada 2d6 = ${sum} [${d1}+${d2}]:</strong> ${evt}`;
      showToast(`Evento M6: 2d6 = ${sum}`);
    }

    function rollM7Recovery() {
      const d = Math.floor(Math.random() * 6) + 1;
      const hasComms = !!campaignState.tokens['midget-comms'];
      const drm = hasComms ? 1 : 0;
      const total = d + drm;
      const el = document.getElementById('m7-recovery-res');

      if (total >= 4) {
        el.style.color = '#34d399';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Recuperación M7: 1d6 = [${d}]${drm ? ' (+1 Superior Comms)' : ''} = ${total}</span> ➔ ¡RECUPERADO POR EL SUBMARINO NODRIZA! Dotación salvada a salvo.`;
        showToast("¡Minisubmarino recuperado con éxito!");
      } else {
        el.style.color = '#ef4444';
        el.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 Recuperación M7: 1d6 = [${d}]${drm ? ' (+1 Superior Comms)' : ''} = ${total}</span> ➔ PERDIDO EN EL MAR (Lost). La tripulación no logra conectar con el nodriza.`;
        showToast("Minisubmarino perdido en el mar.");
      }
    }

    function rollM8Damage() {
      const red = Math.floor(Math.random() * 6) + 1;
      const white = Math.floor(Math.random() * 6) + 1;
      const d66 = red * 10 + white;
      const desc = CHART_M8_TABLE[d66] || "Avería Menor";
      const el = document.getElementById('m8-damage-res');
      el.innerHTML = `<strong>🎲 d66 = ${d66} [Rojo ${red}, Blanco ${white}]:</strong> ${desc}`;
      showToast(`Avería Ko-Hyoteki: ${desc}`);
    }

    function triggerSpecialMissionAction() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const subKey = (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ? currentBoardSubKey : (campaignState.activeSubKey || "Type_B_Class");
      const sub = ((typeof SUB_DB !== 'undefined' && SUB_DB.submarines) || {})[subKey] || {};
      const missionLine = (campaignState.workflow && campaignState.workflow.assignedMissionLine) || "";
      const area = (campaignState.workflow && campaignState.workflow.assignedArea) || "Pearl Harbor";

      const isMidget = missionLine.includes("Midget") || (sub.special_rules && sub.special_rules.includes("Ko-Hyoteki"));
      const isRecon = missionLine.includes("Recon") || (sub.aircraft && sub.aircraft > 0);
      const isKaiten = missionLine.includes("Kaiten") || (sub.special_rules && sub.special_rules.includes("Kaiten"));

      if (isMidget) {
        if (typeof switchTab === 'function') {
          switchTab('special-missions');
          setTimeout(() => {
            if (typeof openSpecialMissionResolver === 'function') openSpecialMissionResolver('midget1');
          }, 150);
          showToast(isEn ? "Opening Ko-Hyoteki Midget Submarine Module [Charts M5, M6, M7]" : "Abriendo Módulo de Mini-Submarinos Ko-Hyoteki [Tablas M5, M6, M7]");
        }
      } else if (isRecon) {
        if (typeof openAircraftDisplayMatModal === 'function') {
          openAircraftDisplayMatModal();
          showToast(isEn ? "Opening Aircraft Display Mat [Chart P / Rule 7.17]" : "Abriendo Tablero de Hidroavión [Chart P / Regla 7.17]");
        } else if (typeof switchTab === 'function') {
          switchTab('special-missions');
          setTimeout(() => {
            if (typeof openSpecialMissionResolver === 'function') openSpecialMissionResolver('recon7');
          }, 150);
          showToast(isEn ? "Opening Aerial Reconnaissance Module [Charts P1-P6]" : "Abriendo Módulo de Reconocimiento Aéreo [Tablas P1-P6]");
        }
      } else if (isKaiten) {
        if (typeof switchTab === 'function') {
          switchTab('special-missions');
          setTimeout(() => {
            if (typeof openSpecialMissionResolver === 'function') openSpecialMissionResolver('kaiten');
          }, 150);
          showToast(isEn ? "Opening Kaiten Tactical Attack Module [Charts K2, K3]" : "Abriendo Módulo de Torpedos Suicidas Kaiten [Tablas K2, K3]");
        }
      } else {
        if (!campaignState.workflow.specialMissionCompleted) {
          campaignState.workflow.specialMissionCompleted = true;
          if (typeof recordPatrolInRoguBukku === 'function') {
            recordPatrolInRoguBukku(2, isEn ? `Major Event Special Mission (${area})` : `Misión Especial Gran Evento (${area})`);
          }
        }
        const msg = isEn
          ? `⭐ FLEET SPECIAL MISSION COMPLETED!\nSubmarine conducted perimeter combat operations in ${area} [Rule 7.14].\nOfficial Reward: Two (2) successful patrols awarded towards promotions and decorations [Rule 7.13]!`
          : `⭐ ¡MISIÓN ESPECIAL DE FLOTA COMPLETADA!\nEl submarino ha ejecutado la patrulla de combate perimetral en ${area} [Regla 7.14].\n¡Recompensa Oficial: Dos (2) patrullas exitosas otorgadas para ascensos y condecoraciones [Regla 7.13]!`;
        alert(msg);
        showToast(isEn ? "⭐ Rule 7.13: 2 Successful Patrols Awarded!" : "⭐ Regla 7.13: ¡2 Patrullas Exitosas Otorgadas!");
        if (typeof updateBoxDisplay === 'function') updateBoxDisplay();
        if (typeof saveState === 'function') saveState();
      }
    }
    window.triggerSpecialMissionAction = triggerSpecialMissionAction;


window.addEventListener('DOMContentLoaded', () => {
  if (typeof updateBoxDisplay === 'function') updateBoxDisplay();
  if (typeof updatePhase2TableDisplay === 'function') updatePhase2TableDisplay();
});

    function updatePatrolPhaseUI() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (campaignState.workflow && campaignState.workflow.currentBoxIndex !== undefined) ? campaignState.workflow.currentBoxIndex : 0;
      const list = (campaignState.workflow && campaignState.workflow.boxList) ? campaignState.workflow.boxList : [];
      const boxName = list[idx] || (isEn ? "Patrol Station" : "Casilla de Patrulla");
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");
      const assignedArea = campaignState.workflow.assignedArea || "Yokosuka / Kure";
      const mappedAreaZone = (typeof mapA1ToA3Zone === 'function') ? mapA1ToA3Zone(assignedArea) : "Yokosuka / Kure";
      const useSpecialCol = !!(isSpecialBox && campaignState.workflow.useA3SpecialMissionColumn);
      const targetZone = isTransit ? "Transit" : (useSpecialCol ? "Special Mission" : mappedAreaZone);
      const zoneLabel = isEn
        ? (targetZone === "Special Mission" ? "Special Mission" : (targetZone === "Transit" ? "Transit" : targetZone))
        : (targetZone === "Transit" ? "Tránsito" : targetZone === "Special Mission" ? "Misión Especial" : targetZone);

      let displayBoxName = boxName;
      if (isEn) {
        displayBoxName = displayBoxName
          .replace(/Casilla de Patrulla/gi, 'Patrol Station')
          .replace(/Casilla de Misión/gi, 'Special Mission Box')
          .replace(/Tránsito/gi, 'Transit')
          .replace(/Retorno/gi, 'Return')
          .replace(/En Estación/gi, 'On Station')
          .replace(/Alta Mar/gi, 'Open Ocean')
          .replace(/Ida/gi, 'Outbound')
          .replace(/Vuelta/gi, 'Inbound');
      }

      const badgeZone = document.getElementById('ppatrol-badge-zone');
      if (badgeZone) {
        badgeZone.innerText = `${isEn ? 'Zone' : 'Zona'}: ${displayBoxName} (${zoneLabel})`;
      }

      const lastRoll = campaignState.workflow.lastA3Roll;
      const rollEl = document.getElementById('ppatrol-last-roll-display');
      if (rollEl) {
        if (lastRoll) {
          rollEl.innerHTML = `🎲 2d6: [<strong>${lastRoll}</strong>]`;
        } else {
          rollEl.innerText = isEn ? "🎲 2d6: Not Rolled" : "🎲 2d6: Sin Tirar";
        }
      }

      const encType = campaignState.workflow.encounterType || "--";
      let displayEncType = encType;
      const pill = document.getElementById('ppatrol-current-contact-pill');
      if (pill) {
        if (encType === "None") {
          displayEncType = isEn ? "Clear Sea (No Contact)" : "Mar Despejado (Sin Contacto)";
          pill.style.borderColor = "#64748b";
          pill.style.color = "#94a3b8";
        } else if (encType === "Event") {
          displayEncType = isEn ? "★ Random Event [B11]" : "★ Suceso Aleatorio [B11]";
          pill.style.borderColor = "var(--gold-500)";
          pill.style.color = "var(--gold-300)";
        } else if (encType === "Minefield") {
          displayEncType = isEn ? "💣 Minefield!" : "💣 ¡Campo de Minas!";
          pill.style.borderColor = "#ef4444";
          pill.style.color = "#fca5a5";
        } else if (encType.includes("Aircraft")) {
          displayEncType = isEn ? "✈️ Aircraft Sighted!" : "✈️ ¡Avión Avistado!";
          pill.style.borderColor = "#ef4444";
          pill.style.color = "#fca5a5";
        } else if (encType === "--" || !encType) {
          displayEncType = isEn ? "Pending" : "Pendiente";
          pill.style.borderColor = "var(--gold-600)";
          pill.style.color = "var(--gold-300)";
        } else {
          const details = campaignState.workflow.encounterDetails || encType;
          displayEncType = `🚢 ${isEn ? details : translatePhase2Encounter(details, false)}`;
          pill.style.borderColor = "#10b981";
          pill.style.color = "#6ee7b7";
        }
        pill.innerText = `${isEn ? 'Contact' : 'Contacto'}: ${displayEncType}`;
      }

      // Update Patrol Ship Contact routing card
      const shipContactEl = document.getElementById('ppatrol-ship-contact-desc');
      if (shipContactEl) {
        if (encType && encType !== "--" && encType !== "None" && !encType.includes("Aircraft") && !encType.includes("Minefield") && encType !== "Event") {
          shipContactEl.innerHTML = `<strong style="color:#34d399;">${isEn ? "🚢 Active Contact:" : "🚢 Contacto Activo:"}</strong> ${displayEncType}.<br>${isEn ? "Proceed to <strong>Phase 3: Ship Encounter</strong> to identify the ship, select range, and launch torpedoes." : "Pasa a la pestaña <strong>3: Encuentro con Barcos</strong> para identificar el buque, elegir distancia y disparar torpedos."}`;
        } else {
          shipContactEl.innerHTML = isEn
            ? "When a surface ship contact is rolled on Chart [A3], target identification and naval combat are resolved in <strong>Phase 3: Ship Encounter</strong>."
            : "Al obtener contacto naval en la Tabla [A3], la identificación de buques y el combate se resuelven en <strong>Fase 3: Encuentro con Barcos</strong>.";
        }
      }

      // If active target exists in target slot
      const curTgt = (campaignState.tactical && campaignState.tactical.target) ? campaignState.tactical.target : (campaignState.workflow && campaignState.workflow.currentTarget ? campaignState.workflow.currentTarget : null);
      const nameEl = document.getElementById('ppatrol-current-tgt-name');
      const tonEl = document.getElementById('ppatrol-current-tgt-tonnage');
      const detEl = document.getElementById('ppatrol-current-tgt-details');

      if (curTgt && nameEl) {
        nameEl.innerText = curTgt.name || (isEn ? "Target Ship" : "Buque Blanco");
        if (tonEl) tonEl.innerText = (curTgt.tons ? curTgt.tons.toLocaleString() : "--") + " tons";
        if (detEl) detEl.innerText = `${curTgt.chart ? '[' + curTgt.chart + '] ' : ''}${curTgt.type || 'Ship'} • ${curTgt.escort ? (isEn ? 'Escorted' : 'Escoltado') : (isEn ? 'Unescorted' : 'Sin escolta')}`;
      } else if (nameEl) {
        nameEl.innerText = isEn ? "No target assigned" : "Sin blanco asignado";
        if (tonEl) tonEl.innerText = "-- tons";
        if (detEl) detEl.innerText = isEn ? "Roll on T1, T2, or T3 to allocate the ship to the tactical slot." : "Tira en T1, T2 o T3 para asignar el buque a la ranura táctica.";
      }

      if (typeof updateFidoStatus === 'function') {
        updateFidoStatus();
      }
    }

    function updateFidoStatus() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const monthStr = (campaignState && campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
      const isFidoActive = monthStr >= "1944-05";
      const badge = document.getElementById('ppatrol-fido-status-badge');
      const note = document.getElementById('ppatrol-fido-status-note');

      if (badge) {
        if (isFidoActive) {
          badge.style.background = "rgba(22, 163, 74, 0.25)";
          badge.style.borderColor = "#22c55e";
          badge.style.color = "#86efac";
          badge.innerHTML = isEn
            ? `🟢 ACTIVE (Current Period: ${monthStr} ≥ 05/1944)`
            : `🟢 ACTIVA (Periodo actual: ${monthStr} ≥ 05/1944)`;
        } else {
          badge.style.background = "rgba(100, 116, 139, 0.2)";
          badge.style.borderColor = "#64748b";
          badge.style.color = "#cbd5e1";
          badge.innerHTML = isEn
            ? `⚪ INACTIVE (Current Period: ${monthStr} &lt; 05/1944 • Unlocked May 1944)`
            : `⚪ INACTIVA (Periodo actual: ${monthStr} &lt; 05/1944 • Desbloqueo histórico Mayo 1944)`;
        }
      }

      if (note) {
        if (isFidoActive) {
          note.innerHTML = isEn
            ? `⚠️ <strong>Active Historical Period:</strong> Campaign date is post-May 1944 (5/44+). When under air attack, roll 1d6: on a roll of <strong>6</strong>, the aircraft drops a <strong>FIDO Mark 24 Acoustic Homing Torpedo</strong> instead of conventional charges. <em>(You can roll/test at any time)</em>.`
            : `⚠️ <strong>Periodo Histórico Activo:</strong> La fecha histórica actual es posterior a Mayo de 1944 (5/44+). Al sufrir ataque aéreo se tira 1d6: con resultado <strong>6</strong>, el avión lanza un <strong>Torpedo Acústico Guiado Mark 24 «FIDO»</strong> en lugar de cargas convencionales. <em>(Puedes tirar la comprobación en cualquier momento)</em>.`;
        } else {
          note.innerHTML = isEn
            ? `Históricamente los aliados introdujeron el torpedo acústico guiado Mark 24 «FIDO» en Mayo de 1944 (5/44+). <em>(Puedes tirar la comprobación y simular en cualquier momento aunque el periodo sea anterior)</em>.`
            : `Históricamente los aliados comenzaron a desplegar el torpedo acústico guiado Mark 24 «FIDO» a partir de Mayo de 1944 (5/44+). <em>(Puedes tirar la comprobación y simular en cualquier momento aunque el periodo sea anterior)</em>.`;
        }
      }
    }

    function rollPatrolFidoCheck(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      let roll;
      let isManual = false;
      if (typeof manualRoll === 'number' && manualRoll >= 1 && manualRoll <= 6) {
        roll = manualRoll;
        isManual = true;
      } else {
        roll = Math.floor(Math.random() * 6) + 1;
      }

      const rowNormal = document.getElementById('ppatrol-fido-row-normal');
      const rowSpecial = document.getElementById('ppatrol-fido-row-special');
      const resEl = document.getElementById('ppatrol-fido-check-res');
      const rollType = isManual ? (isEn ? "Tabletop 1d6" : "Mesa 1d6") : "1d6";

      if (rowNormal) rowNormal.style.outline = (roll <= 5) ? "2px solid #38bdf8" : "none";
      if (rowSpecial) rowSpecial.style.outline = (roll === 6) ? "2px solid #ef4444" : "none";

      let msg;
      if (roll <= 5) {
        msg = isEn
          ? `🎲 FIDO Check [${rollType} = ${roll}]: Conventional Attack (Bombs/Depth Charges on Chart [B5] with +2 DRM + 1 crew casualty on [B7]). No FIDO deployed.`
          : `🎲 Comprobación FIDO [${rollType} = ${roll}]: Ataque Convencional Normal (Bombas/cargas en Tabla [B5] con +2 DRM + 1 baja de dotación en [B7]). No despliega FIDO.`;
        if (resEl) {
          resEl.innerHTML = `<span style="color:#93c5fd; font-weight:700;">${msg}</span>`;
        }
      } else {
        msg = isEn
          ? `🚨 ALERT! FIDO Check [${rollType} = 6]: SPECIAL ATTACK! Aircraft drops Mark 24 "FIDO" Acoustic Homing Torpedo! Roll for FIDO Impact below.`
          : `🚨 ¡ALERTA! Comprobación FIDO [${rollType} = 6]: ¡ATAQUE ESPECIAL! El avión lanza un Torpedo Acústico Teledirigido Mark 24 "FIDO". Tira el impacto a continuación.`;
        if (resEl) {
          resEl.innerHTML = `<span style="color:#f87171; font-weight:800;">${msg}</span>`;
        }
      }
      showToast(msg);
      saveState();
      return msg;
    }

    function rollPatrolFidoImpact(manualRoll) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      let roll;
      let isManual = false;
      if (typeof manualRoll === 'number' && manualRoll >= 1 && manualRoll <= 6) {
        roll = manualRoll;
        isManual = true;
      } else {
        roll = Math.floor(Math.random() * 6) + 1;
      }

      const b1 = document.getElementById('ppatrol-fido-imp-box-1');
      const b2 = document.getElementById('ppatrol-fido-imp-box-2');
      const b3 = document.getElementById('ppatrol-fido-imp-box-3');
      if (b1) b1.style.outline = (roll === 1) ? "2px solid #ef4444" : "none";
      if (b2) b2.style.outline = (roll === 2) ? "2px solid #f59e0b" : "none";
      if (b3) b3.style.outline = (roll >= 3) ? "2px solid #22c55e" : "none";

      const resEl = document.getElementById('ppatrol-fido-impact-res');
      const rollType = isManual ? (isEn ? "Tabletop 1d6" : "Mesa 1d6") : "1d6";
      let msg;

      if (roll === 1) {
        if (typeof window.applySubmarineDamage === 'function') {
          window.applySubmarineDamage({ isSunk: true, source: 'fido', reason: 'FIDO direct strike' });
        }
        msg = isEn
          ? `💥 FIDO Impact [${rollType} = 1]: 💀 SUNK! Acoustic homing torpedo strikes pressure hull. Submarine lost!`
          : `💥 Impacto FIDO [${rollType} = 1]: 💀 ¡SUBMARINO HUNDIDO! El torpedo acústico impacta en el casco de presión. Pérdida catastrófica.`;
        if (resEl) resEl.innerHTML = `<span style="color:#ef4444; font-weight:800;">${msg}</span>`;
      } else if (roll === 2) {
        if (typeof window.applySubmarineDamage === 'function') {
          window.applySubmarineDamage({ hullDamage: 7, source: 'fido', reason: 'FIDO 7 hull hits' });
        }
        msg = isEn
          ? `💥 FIDO Impact [${rollType} = 2]: ⚠️ 7 HITS OF DAMAGE! Detonation inflicts 7 hull/system hits.`
          : `💥 Impacto FIDO [${rollType} = 2]: ⚠️ ¡7 IMPACTOS DE DAÑO! Detonación masiva provoca 7 puntos de daño en casco y sistemas.`;
        if (resEl) resEl.innerHTML = `<span style="color:#fbbf24; font-weight:800;">${msg}</span>`;
      } else {
        msg = isEn
          ? `🛡️ FIDO Impact [${rollType} = ${roll}]: ✅ MISS / DUD! Homing torpedo lost target or detonator failed. No damage!`
          : `🛡️ Impacto FIDO [${rollType} = ${roll}]: ✅ ¡FALLO / INERTE! El torpedo pierde la señal acústica o el detonador falla. Sin daños.`;
        if (resEl) resEl.innerHTML = `<span style="color:#4ade80; font-weight:800;">${msg}</span>`;
      }
      showToast(msg);
      saveState();
      return msg;
    }

    window.updateFidoStatus = updateFidoStatus;
    window.rollPatrolFidoCheck = rollPatrolFidoCheck;
    window.rollPatrolFidoImpact = rollPatrolFidoImpact;
    window.selectA4Row = selectA4Row;
    window.selectA2Row = selectA2Row;
    window.highlightA4Row = highlightA4Row;
    window.highlightA2Row = highlightA2Row;
    window.rollPatrolAirCrewPosOnly = rollPatrolAirCrewPosOnly;
    window.rollPatrolAirCrewSevOnly = rollPatrolAirCrewSevOnly;
    window.rollPatrolAirCrewInjury = rollPatrolAirCrewInjury;
    window.rollPatrolAirBombRun = rollPatrolAirBombRun;
    window.updatePatrolAirAttackState = updatePatrolAirAttackState;
    window.selectB7Pos = selectB7Pos;
    window.selectB7Sev = selectB7Sev;
    window.selectB5Row = selectB5Row;
    window.highlightB7PosRow = highlightB7PosRow;
    window.highlightB7SevRow = highlightB7SevRow;
    window.highlightB5Row = highlightB5Row;
