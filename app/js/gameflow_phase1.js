// =========================================================================
// SENSUiKAN: GAME FLOW - PHASE 1: SORTIE & OPERATIONAL BASING
// Rule 4.7 Home ports, Chart A1 destination roll, Rule 7.14 Special Mission dynamic evaluation table.
// =========================================================================

function normalizeBaseName(b) {
      if (!b) return "Yokosuka";
      const s = String(b).trim().toLowerCase();
      if (s.includes("paramushiro") || s.includes("parama")) return "Paramushiro";
      if (s.includes("truk")) return "Truk";
      if (s.includes("guinea") || s.includes("rabaul") || s.includes("shortland")) return "New Guinea";
      if (s.includes("dutch") || s.includes("dei") || s.includes("penang") || s.includes("singapor") || s.includes("sabang")) return "Dutch East Indies";
      return "Yokosuka";
    }

    function updateBasesForDate(monthId) {
      const m = monthId || campaignState.workflow.selectedMonth || "1941-12";
      const baseSelect = document.getElementById('wf-base-select');
      if (!baseSelect) return;

      campaignState.workflow.startingBase = normalizeBaseName(campaignState.workflow.startingBase || "Yokosuka");
      let currentBase = campaignState.workflow.startingBase;

      // Regla 4.7.2: Submarinos en Paramushiro son reasignados a Truk en 7/43
      if (currentBase === 'Paramushiro' && m >= '1943-07') {
        currentBase = 'Truk';
        campaignState.workflow.startingBase = 'Truk';
        showToast("⚓ Regla 4.7.2: Fecha es " + m + " (≥ 7/43). Submarinos destacados en Paramushiro son reasignados automáticamente a Truk.");
      }

      // Regla 4.7.3: Truk cesa como base en 3/44 y los buques deben rebasarse a Yokosuka
      if (currentBase === 'Truk' && m >= '1944-03') {
        currentBase = 'Yokosuka';
        campaignState.workflow.startingBase = 'Yokosuka';
        showToast("⚠️ Regla 4.7.3: Truk cesó de ser base naval en marzo de 1944 (3/44). Submarino reubicado en Yokosuka.");
      }

      let htmlOpts = '';
      for (const [key, bData] of Object.entries(CANONICAL_BASES)) {
        const status = bData.activeCheck(m);
        if (status.active) {
          htmlOpts += `<option value="${key}">${(window.currentLang === 'en' ? (bData.labelEn || bData.label) : bData.label)}</option>`;
        } else {
          htmlOpts += `<option value="${key}" disabled style="color:#64748b;">${(window.currentLang === 'en' ? (bData.labelEn || bData.label) : bData.label)} [${status.reason}]</option>`;
        }
      }
      
      baseSelect.innerHTML = htmlOpts;
      let isBaseValid = false;
      for (const opt of baseSelect.options) {
        if (opt.value === currentBase && !opt.disabled) {
          isBaseValid = true;
          break;
        }
      }
      if (!isBaseValid) {
        currentBase = 'Yokosuka';
        campaignState.workflow.startingBase = 'Yokosuka';
      }
      baseSelect.value = currentBase;

      const base0 = document.getElementById('wf-starting-base');
      if (base0 && base0.value !== currentBase) base0.value = currentBase;

      updateBaseDescriptionPill(currentBase);
      if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
      if (typeof renderSubBoard === 'function') renderSubBoard();
    }

    function updateBaseDescriptionPill(base) {
      const norm = normalizeBaseName(base);
      const data = CANONICAL_BASES[norm] || CANONICAL_BASES["Yokosuka"];

      const chitImg1 = document.getElementById('wf-base-chit-img');
      if (chitImg1) {
        const rawSrc = data.chit;
        chitImg1.src = (typeof resolveAsset === 'function') ? resolveAsset(rawSrc) : rawSrc;
        chitImg1.alt = data.name;
      }

      const chitImg0 = document.getElementById('wf-starting-base-chit');
      if (chitImg0) {
        const rawSrc = data.chit;
        chitImg0.src = (typeof resolveAsset === 'function') ? resolveAsset(rawSrc) : rawSrc;
        chitImg0.alt = data.name;
      }

      const pill = document.getElementById('wf-base-desc-pill');
      if (pill) {
        pill.innerHTML = `
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="color:var(--gold-400); font-weight:800;">[${window.currentLang === 'en' ? 'Rule' : 'Regla'} ${data.rule}] ${data.name.toUpperCase()}</span>
          </div>
          <div style="font-size:0.75rem; color:#e2e8f0; margin-top:3px; line-height:1.4;">${window.currentLang === 'en' ? (data.descEn || data.desc) : data.desc}</div>
        `;
      }
    }

    function updateSpecialEventsForMonthArea() {
      const m = campaignState.workflow.selectedMonth || "1941-12";
      const area = (campaignState.workflow.assignedArea || "").toLowerCase();
      const subKey = campaignState.activeSubKey || "Type_B_Class";
      const meSelect = document.getElementById('wf-me-select');
      if (!meSelect) return;

      const events = [];

      // Determine valid events based on month and assigned area:
      if (m === "1941-12") {
        if (area.includes("pearl") || area.includes("hawaii")) {
          events.push({ val: "yes_pearl", label: "Sí: Ataque a Pearl Harbor (Dic-41) [Midget 1 / Recon 7 / Patrol]", isDefault: true });
        } else if (area.includes("malaya")) {
          events.push({ val: "yes_malaya", label: "Sí: Invasión de Malasia (Dic-41) [Minelay / Picket / Recon 12]", isDefault: true });
        } else if (area.includes("philippines")) {
          events.push({ val: "yes_philippines", label: "Sí: Invasión de Filipinas (Dic-41) [Minelay]", isDefault: true });
        } else if (area.includes("dutch") || area.includes("indies") || area.includes("java")) {
          events.push({ val: "yes_dutch", label: "Sí: Indias Orientales Holandesas (Dic-41 a Mar-42) [Patrol / Misión Especial]", isDefault: true });
        }
      } else if (m >= "1942-01" && m <= "1942-03" && (area.includes("dutch") || area.includes("indies") || area.includes("java"))) {
        events.push({ val: "yes_dutch", label: "Sí: Indias Orientales Holandesas (Dic-41 a Mar-42) [Patrol / Misión Especial]", isDefault: true });
      } else if (m === "1942-05") {
        if (area.includes("australia") || area.includes("sydney")) {
          events.push({ val: "yes_sydney", label: "Sí: Incursión en Puerto de Sydney (May-42) [Midget 2]", isDefault: true });
        } else if (area.includes("indian ocean") || area.includes("madagascar")) {
          events.push({ val: "yes_diego", label: "Sí: Ataque a Diego Suárez / Madagascar (May-42) [Midget 3]", isDefault: true });
        }
      } else if (m === "1942-06") {
        if (area.includes("midway")) {
          events.push({ val: "yes_midway", label: "Sí: Batalla de Midway (Jun-42) [Línea de Vigilancia]", isDefault: true });
        } else if (area.includes("aleutians")) {
          events.push({ val: "yes_aleutians", label: "Sí: Operación AL / Aleutianas (Jun-42) [Invasión Kiska/Attu]", isDefault: true });
        }
      } else if (m >= "1942-08" && m <= "1943-03") {
        if (area.includes("guadalcanal") || area.includes("solomons")) {
          events.push({ val: "yes_guadalcanal", label: "Sí: Campaña de Guadalcanal y Salomón [Vigilancia y Tokyo Express]", isDefault: true });
        }
      } else if (m >= "1944-10" && m <= "1944-12") {
        if (area.includes("leyte") || area.includes("philippines")) {
          events.push({ val: "yes_leyte", label: "Sí: Batalla del Golfo de Leyte / Operación Shō-1 (Oct-Dic 44) [Ataque a Flota USN]", isDefault: true });
          if (m >= "1944-11") {
            events.push({ val: "yes_kaiten", label: "Sí: Misión Kaiten Grupo Kikusui (Nov-44) [Torpedos Suicidas]", isDefault: false });
          }
        } else if (m >= "1944-11" && (area.includes("marianas") || area.includes("ulithi") || area.includes("palau"))) {
          events.push({ val: "yes_kaiten", label: "Sí: Misión Kaiten Grupo Kikusui (Nov-44) [Torpedos Suicidas]", isDefault: true });
        }
      } else if (m >= "1945-01") {
        if (area.includes("okinawa")) {
          events.push({ val: "yes_okinawa", label: "Sí: Operación Ten-Gō / Defensa de Okinawa (Abr-Jun 45)", isDefault: true });
        } else if (area.includes("iwo")) {
          events.push({ val: "yes_iwo", label: "Sí: Batalla de Iwo Jima (Feb-Mar 45)", isDefault: true });
        } else if (subKey === "Sen_Toku_Class") {
          events.push({ val: "yes_arashi", label: "Sí: Operación Arashi / Ataque a Ulithi con M6A1 Seiran (Jul-45)", isDefault: true });
        }
        events.push({ val: "yes_kaiten", label: "Sí: Misión Kaiten (Grupos Kongō, Chihaya, Tembu)", isDefault: (events.length === 0) });
      }

      // Standard patrol is always an option
      events.push({ val: "no", label: "No: Patrulla Estándar de Interdicción Mercante", isDefault: (events.length === 0) });

      meSelect.innerHTML = '';
      
      // Categorizar: Disponibles (isDefault o en lista) y No Disponibles (Resto)
      const allowedEvents = events.filter(e => e.val !== 'no');
      
      let html = '';
      
      // 1. Grupo Disponibles
      html += `<optgroup label="${window.currentLang === 'en' ? 'Available Special Missions' : 'Misiones Especiales Disponibles'}">`;
      allowedEvents.forEach(ev => {
          html += `<option value="${ev.val}">${window.currentLang === 'en' ? ev.label.replace(/^Sí:/, 'Yes:').replace(/Ataque/g, 'Attack').replace(/Invasión/g, 'Invasion').replace(/Misión/g, 'Mission').replace(/Patrulla Estándar de Interdicción Mercante/g, 'Standard Merchant Interdiction Patrol').replace(/Dic-/g, 'Dec-').replace(/May-/g, 'May-').replace(/Ago-/g, 'Aug-').replace(/Nov-/g, 'Nov-').replace(/Abr-Jun/g, 'Apr-Jun') : ev.label}</option>`;
      });
      html += `</optgroup>`;

      // 2. Grupo Patrulla Estándar (La opción "no")
      html += `<optgroup label="${window.currentLang === 'en' ? 'Standard Missions' : 'Misiones Estándar'}">`;
      html += `<option value="no">${window.currentLang === 'en' ? 'Standard Merchant Interdiction Patrol' : 'Patrulla Estándar de Interdicción Mercante'}</option>`;
      html += `</optgroup>`;

      meSelect.innerHTML = html;

      // Intentar mantener selección previa o por defecto
      let chosenVal = allowedEvents.length > 0 ? allowedEvents[0].val : "no";
      meSelect.value = chosenVal;
      updateSpecialMissionCheck();
    }

    
    // =========================================================================
    // EVALUACIÓN DINÁMICA DE MISIONES ESPECIALES [REGLA 7.14]
    // =========================================================================
    function evaluateMissionLine(line, subKey) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[subKey] || {};
      const l = (line || '').trim();
      const subName = sub.class_name || subKey;

      if (l.startsWith('Midget')) {
        const isMidgetCarrier = subKey.includes('Type_C') && !subKey.includes('Type_C3');
        return {
          line: l,
          type: isEn ? "Ko-Hyoteki Midget Submarine Attack" : "Ataque con Minisubmarinos Ko-Hyoteki",
          rule: "[7.3, 7.16]",
          req: isEn ? "Type C Submarine Mother Ship with Ko-Hyoteki" : "Submarino nodriza Tipo C con Ko-Hyoteki",
          moduleMap: isEn ? "Midget Sub Module (Maps M1-M4)" : "Módulo Ko-Hyoteki (Mapas M1-M4)",
          applies: isMidgetCarrier,
          whyTrue: isEn ? "Your boat is a Type C submarine cruiser equipped with clamps and Ko-Hyoteki midget submarines." : "Tu buque es un crucero submarino Tipo C equipado con abrazaderas y minisubmarinos Ko-Hyoteki.",
          whyFalse: isEn ? "Your boat (" + subName + ") does not carry Ko-Hyoteki midget submarines (Type C exclusive)." : "Tu buque (" + subName + ") no porta minisubmarinos Ko-Hyoteki (exclusivo de la clase Tipo C)."
        };
      }

      if (l.startsWith('Recon')) {
        const hasAir = !!sub.has_aircraft;
        return {
          line: l,
          type: isEn ? "Aerial Float-plane Reconnaissance" : "Reconocimiento Aéreo con Hidroavión",
          rule: "[7.1, 7.15, 7.17]",
          req: isEn ? "Watertight hangar, catapult & recon float-plane" : "Hangar, catapulta e hidroavión de reconocimiento",
          moduleMap: isEn ? "Aerial Module (Charts P1-P6)" : "Módulo Aéreo (Mapas P1-P6)",
          applies: hasAir,
          whyTrue: isEn ? "Equipped with hangar and catapult carrying recon aircraft (" + (sub.aircraft_type || 'E14Y Glen') + ")." : "Dispone de hangar estanco y catapulta con hidroavión (" + (sub.aircraft_type || 'E14Y Glen') + ").",
          whyFalse: isEn ? "Your boat (" + subName + ") does not carry an embarked aircraft." : "Tu buque (" + subName + ") no dispone de hangar ni hidroavión embarcado."
        };
      }

      if (l.startsWith('Bomb')) {
        const hasAir = !!sub.has_aircraft;
        return {
          line: l,
          type: isEn ? "Precision Aerial Bombing" : "Bombardeo Aéreo de Precisión",
          rule: "[7.7, 7.15, 7.17]",
          req: isEn ? "Embarked float-plane armed with bombs" : "Hidroavión armado con bombas",
          moduleMap: isEn ? "Aerial Module (Charts P7-P12)" : "Módulo Aéreo (Mapas P7-P12)",
          applies: hasAir,
          whyTrue: isEn ? "Equipped with embarked aviation ready for bombing sortie." : "Cuenta con aviación embarcada para realizar incursión de bombardeo.",
          whyFalse: isEn ? "Your boat (" + subName + ") has no embarked aircraft." : "Tu buque (" + subName + ") no dispone de aviación embarcada."
        };
      }

      if (l.startsWith('Kaiten')) {
        const hasK = !!sub.has_kaiten || (sub.kaiten_note && sub.kaiten_note.includes('Kaiten'));
        return {
          line: l,
          type: isEn ? "Kaiten Suicide Torpedo Attack" : "Ataque Suicida con Torpedos Kaiten",
          rule: "[7.8, 7.12, 7.18]",
          req: isEn ? "Submarine fitted with deck Kaiten fittings (1944+)" : "Cubierta adaptada para torpedos suicidas Kaiten (1944+)",
          moduleMap: isEn ? "Kaiten Module (Maps K2-K3)" : "Módulo Kaiten (Mapas K2-K3)",
          applies: hasK,
          whyTrue: isEn ? "Submarine enabled to carry manned suicide Kaiten torpedoes." : "Buque habilitado para transportar torpedos tripulados suicidas Kaiten.",
          whyFalse: isEn ? "Your boat (" + subName + ") is not configured to carry Kaiten torpedoes." : "Tu buque (" + subName + ") no está configurado para transportar torpedos Kaiten."
        };
      }

      if (l.startsWith('Minelay')) {
        const isKirai = subKey.includes('Kirai_Sen');
        return {
          line: l,
          type: isEn ? "Offensive Minelaying Mission" : "Sembrado Ofensivo de Minas",
          rule: "[7.10]",
          req: isEn ? "Kirai-Sen minelayer or tubes fitted with mines" : "Minador especializado (Kirai-Sen) o tubos cargados con minas",
          moduleMap: isEn ? "Operations Map [A3 Special]" : "Mapa de Operaciones [A3 Especial]",
          applies: true,
          whyTrue: isKirai 
            ? (isEn ? "Specialized Kirai-Sen minelayer! Lays mines automatically." : "¡Minador especializado Kirai-Sen! Siembra minas automáticamente.")
            : (isEn ? "Any fleet submarine can lay mines from torpedo tubes (reduces reloads per rule 7.10)." : "Cualquier submarino puede sembrar minas en tubos de torpedo (reduce recargas por regla 7.10)."),
          whyFalse: ""
        };
      }

      if (l.startsWith('Shore')) {
        const hasGun = !sub.deck_guns || (sub.deck_guns.main && sub.deck_guns.main !== 'None');
        return {
          line: l,
          type: isEn ? "Shore Bombardment with Deck Gun" : "Bombardeo Costero con Cañón",
          rule: "[7.9]",
          req: isEn ? "Operational 140mm deck gun" : "Cañón de cubierta de 140 mm operativo",
          moduleMap: isEn ? "Enemy Coast [A3 Special]" : "Costa Enemiga [A3 Especial]",
          applies: hasGun,
          whyTrue: isEn ? "Equipped with operational 140mm deck gun to shell shore installations." : "Dispone de cañón de cubierta de 140 mm para batir instalaciones costeras.",
          whyFalse: isEn ? "Your boat (" + subName + ") does not have an operational deck gun (or was removed)." : "Tu buque (" + subName + ") no dispone de cañón de cubierta operativo (o fue retirado)."
        };
      }

      if (l.startsWith('Picket')) {
        return {
          line: l,
          type: isEn ? "Picket Line & Fleet Watch Patrol" : "Línea de Piquete y Vigilancia de Flota",
          rule: "[7.2]",
          req: isEn ? "Any submarine (prohibited to attack freighters; seek warships)" : "Cualquier submarino (prohibido atacar mercantes; buscar buques de guerra)",
          moduleMap: isEn ? "Picket Line [A3]" : "Línea de Piquete [A3]",
          applies: true,
          whyTrue: isEn ? "Applies to all submarines. Requires ignoring freighters and hunting warships." : "Aplica a cualquier submarino. Obliga a ignorar mercantes y buscar buques de guerra.",
          whyFalse: ""
        };
      }

      if (l.startsWith('Transport')) {
        return {
          line: l,
          type: isEn ? "Supply Transport (Tokyo Express)" : "Transporte de Suministros (Tokyo Express)",
          rule: "[7.4]",
          req: isEn ? "Any fleet submarine (tubes loaded, no reloads)" : "Cualquier submarino de flota (tubos cargados, sin recargas)",
          moduleMap: isEn ? "Mission Box [A3 Special]" : "Casilla de Misión [A3 Especial]",
          applies: true,
          whyTrue: isEn ? "Carries essential supplies on deck and holds to forward garrisons." : "Transporta suministros esenciales en cubierta y bodegas a guarniciones de vanguardia.",
          whyFalse: ""
        };
      }

      if (l.startsWith('Strat')) {
        return {
          line: l,
          type: isEn ? "Strategic Transport (Yanagi Mission)" : "Transporte Estratégico (Misión Yanagi)",
          rule: "[7.5]",
          req: isEn ? "Long oceanic range and cargo space" : "Gran autonomía oceánica y bodegas de carga",
          moduleMap: isEn ? "Route to Europe (Atlantic)" : "Ruta a Europa (Atlántico)",
          applies: true,
          whyTrue: isEn ? "Transoceanic mission to Europe transporting rubber and critical tech." : "Misión transoceánica a Europa transportando caucho y tecnología.",
          whyFalse: ""
        };
      }

      if (l.startsWith('Evac')) {
        return {
          line: l,
          type: isEn ? "Evacuation of Isolated Garrison" : "Evacuación de Guarniciones Aisladas",
          rule: "[7.6]",
          req: isEn ? "Any fleet submarine" : "Cualquier submarino de flota",
          moduleMap: isEn ? "Mission Box [A3 Special]" : "Casilla de Misión [A3 Especial]",
          applies: true,
          whyTrue: isEn ? "Stealth evacuation of imperial troops trapped under siege or fog." : "Evacuación sigilosa de tropas imperiales atrapadas bajo niebla o asedio.",
          whyFalse: ""
        };
      }

      if (l.startsWith('Pass')) {
        return {
          line: l,
          type: isEn ? "Passenger / VIP Infiltration" : "Transporte e Inserción de Pasajeros / V.I.P.",
          rule: "[7.11]",
          req: isEn ? "Any fleet submarine" : "Cualquier submarino de flota",
          moduleMap: isEn ? "Mission Box [A3 Special]" : "Casilla de Misión [A3 Especial]",
          applies: true,
          whyTrue: isEn ? "Stealth landing of agents or officers in rubber rafts to the shore." : "Desembarco sigiloso de agentes o mandos en botes de goma hacia la costa.",
          whyFalse: ""
        };
      }

      if (l.startsWith('Patrol')) {
        return {
          line: l,
          type: isEn ? "Perimeter Fleet Combat Patrol (Patrol)" : "Patrulla de Combate Perimetral de Gran Evento",
          rule: "[7.14]",
          req: isEn ? "Any active fleet submarine" : "Cualquier submarino de flota",
          moduleMap: isEn ? "Operations Area [A3 Standard]" : "Área de Operaciones [A3 Estándar]",
          applies: true,
          whyTrue: isEn ? "Applies to ALL submarines. Officially counts as Special Mission and awards 2 successful patrols!" : "Aplica a TODOS los submarinos. ¡Cuenta oficialmente como Misión Especial y otorga 2 patrullas exitosas!",
          whyFalse: ""
        };
      }

      return {
        line: l,
        type: isEn ? "Operational Special Mission" : "Misión Especial Operativa",
        rule: "[7.0]",
        req: isEn ? "Fleet submarine" : "Submarino de flota",
        moduleMap: isEn ? "Operations Area" : "Área de Operaciones",
        applies: true,
        whyTrue: isEn ? "Special mission as designated by historical chit." : "Misión especial según ficha histórica.",
        whyFalse: ""
      };
    }

    function renderSpecialMissionsEvaluationTable(chit, subKey, containerId) {
      const targetId = containerId || 'wf-special-mission-eval-container';
      const container = document.getElementById(targetId);
      if (!container) return;

      if (!chit || !chit.whiteLines || chit.whiteLines.length === 0) {
        container.innerHTML = '';
        return;
      }

      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[subKey] || {};
      const subName = sub.class_name || subKey;

      // Evaluate lines from top to bottom (Rule 7.14)
      const evals = chit.whiteLines.map(line => evaluateMissionLine(line, subKey));
      let assignedIndex = -1;
      for (let i = 0; i < evals.length; i++) {
        if (evals[i].applies) {
          assignedIndex = i;
          break;
        }
      }

      let cardsHtml = '';
      evals.forEach((ev, idx) => {
        const isAssigned = (idx === assignedIndex);
        let cardBg = 'rgba(15, 23, 42, 0.6)';
        let cardBorder = '1px solid rgba(225, 29, 72, 0.22)';
        let cardShadow = 'none';
        let cardOpacity = '0.85';
        let statusBadge = '';
        let conciseReason = '';

        if (isAssigned) {
          cardBg = 'linear-gradient(90deg, rgba(6, 78, 59, 0.5) 0%, rgba(15, 23, 42, 0.95) 100%)';
          cardBorder = '1.5px solid #10b981';
          cardShadow = '0 0 10px rgba(16, 185, 129, 0.25)';
          cardOpacity = '1';
          statusBadge = `<span style="background:#059669; color:#fff; font-weight:800; font-size:0.68rem; padding:2px 7px; border-radius:4px; box-shadow:0 0 6px rgba(16,185,129,0.4); display:inline-flex; align-items:center; gap:3px;"><span>⭐</span> <span>${isEn ? 'ASSIGNED' : 'ASIGNADA'}</span></span>`;
          conciseReason = `<span style="color:#6ee7b7; font-weight:600;">${isEn ? '✓ Compatible with your boat' : '✓ Compatible con tu buque'}</span>`;
        } else if (ev.applies) {
          cardBg = 'rgba(15, 23, 42, 0.45)';
          cardBorder = '1px solid rgba(100, 116, 139, 0.25)';
          cardOpacity = '0.7';
          statusBadge = `<span style="background:rgba(51,65,85,0.5); color:#94a3b8; font-size:0.66rem; padding:2px 6px; border-radius:4px; border:1px solid #475569;">⚪ ${isEn ? 'Lower Priority' : 'Prioridad Menor'}</span>`;
          conciseReason = `<span style="color:#94a3b8;">${isEn ? 'Higher option takes priority' : 'Opción superior tiene prioridad'}</span>`;
        } else {
          statusBadge = `<span style="background:rgba(225,29,72,0.15); color:#fda4af; font-size:0.66rem; padding:2px 6px; border-radius:4px; border:1px solid rgba(225,29,72,0.3); font-weight:600;">✕ ${isEn ? 'Incompatible' : 'No Compatible'}</span>`;
          if (ev.line.startsWith('Midget')) conciseReason = `<span style="color:#f87171;">${isEn ? 'No midget sub (Type C exclusive)' : 'Sin minisubmarino (exclusivo Tipo C)'}</span>`;
          else if (ev.line.startsWith('Recon') || ev.line.startsWith('Bomb')) conciseReason = `<span style="color:#f87171;">${isEn ? 'No hangar or float-plane' : 'Sin hangar ni hidroavión'}</span>`;
          else if (ev.line.startsWith('Kaiten')) conciseReason = `<span style="color:#f87171;">${isEn ? 'No Kaiten torpedoes' : 'Sin torpedos Kaiten'}</span>`;
          else conciseReason = `<span style="color:#f87171;">${isEn ? 'Requirements not met' : 'Requisitos no cumplidos'}</span>`;
        }

        cardsHtml += `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:6px 10px; margin-bottom:4px; border-radius:6px; background:${cardBg}; border:${cardBorder}; box-shadow:${cardShadow}; opacity:${cardOpacity};">
            <div style="display:flex; align-items:center; gap:6px; min-width:0;">
              <span style="font-size:0.65rem; font-weight:800; color:var(--gold-400); background:#1e293b; border:1px solid #334155; border-radius:3px; padding:1px 4px; text-align:center;">#${idx + 1}</span>
              <span style="background:#f8fafc; color:#0f172a; font-family:'Segoe UI', sans-serif; font-weight:900; font-size:0.72rem; padding:1px 6px; border-radius:3px; border:1.5px solid #cbd5e1; box-shadow:0 1px 2px rgba(0,0,0,0.3); letter-spacing:0.5px; white-space:nowrap;">${ev.line}</span>
              <div style="min-width:0;">
                <div style="font-size:0.76rem; font-weight:bold; color:${isAssigned ? '#fde047' : '#e2e8f0'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${ev.type}</div>
                <div style="font-size:0.64rem; color:#94a3b8; line-height:1.1;">
                  <span style="color:#64748b;">${isEn ? 'Req:' : 'Req:'}</span> ${ev.req} <span style="color:#475569;">• [${ev.rule}]</span>
                </div>
              </div>
            </div>

            <div style="text-align:right; white-space:nowrap; flex-shrink:0;">
              <div>${statusBadge}</div>
              <div style="font-size:0.65rem; line-height:1.1; margin-top:2px;">
                ${conciseReason}
              </div>
            </div>
          </div>
        `;
      });

      const assignedEv = evals[assignedIndex] || { type: isEn ? "Combat Patrol" : "Patrulla de Combate", line: "Patrol" };
      const area = (campaignState.workflow && campaignState.workflow.patrolArea) ? campaignState.workflow.patrolArea : (isEn ? "Assigned Area" : "Área Asignada");

      container.innerHTML = `
        <div style="background:#0a0f1d; border:1.5px solid #0284c7; border-radius:8px; padding:10px 12px; margin-top:10px; box-shadow:0 4px 14px rgba(0,0,0,0.4);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #1e293b; padding-bottom:6px; flex-wrap:wrap; gap:6px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="background:#0284c7; color:#fff; font-weight:800; font-size:0.68rem; padding:2px 6px; border-radius:3px; letter-spacing:0.5px;">${isEn ? 'RULE 7.14' : 'REGLA 7.14'}</span>
              <strong style="color:#f8fafc; font-size:0.8rem; letter-spacing:0.3px;">${isEn ? 'CHIT MISSION EVALUATION' : 'EVALUACIÓN DE MISIONES DE LA FICHA'} (${area})</strong>
            </div>
            <div style="font-size:0.72rem; color:#94a3b8;">
              ${isEn ? 'Active Boat:' : 'Buque Activo:'} <strong style="color:#38bdf8;">${subName}</strong>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:2px;">
            ${cardsHtml}
          </div>

          <div style="margin-top:8px; padding:8px 10px; background:rgba(6, 78, 59, 0.35); border:1px solid #059669; border-radius:6px; font-size:0.73rem; color:#d1fae5; line-height:1.35;">
            <div style="display:flex; align-items:center; gap:6px; font-weight:bold; color:#fde047; margin-bottom:2px;">
              <span>🎯</span>
              <span>${isEn ? 'Special Mission Assigned under Official Rule 7.14:' : 'Misión Especial Asignada por Regla Oficial 7.14:'} ${assignedEv.type} (${assignedEv.line}).</span>
            </div>
            <div>
              ${isEn ? 'Your boat <strong>' + subName + '</strong> will execute this mission in its special mission box.' : 'Tu submarino <strong>' + subName + '</strong> ejecutará esta operación en su casilla de misión especial.'}
            </div>
            <div style="font-size:0.68rem; color:#6ee7b7; margin-top:2px;">
              ${isEn ? '★ If successfully completed, awards the official benefit of TWO (2) successful patrols towards promotions and decorations (Rules 7.13 & 7.14)!' : '★ ¡Si se completa con éxito, otorga el beneficio oficial de DOS (2) patrullas exitosas para ascensos y condecoraciones (Reglas 7.13 y 7.14)!'}
            </div>
          </div>
        </div>
      `;

      if (assignedEv) {
        campaignState.workflow.assignedMissionType = assignedEv.type;
        campaignState.workflow.assignedMissionLine = assignedEv.line;
        campaignState.workflow.isSpecialMission = (assignedEv.line !== 'Patrol');
      }
    }

    function openAllMissionsGuideModal() {
      const subKey = campaignState.activeSubKey || "Type_B_Class";
      const subs = (SUB_DB && SUB_DB.submarines) ? SUB_DB.submarines : {};
      const sub = subs[subKey] || {};
      const subName = sub.class_name || subKey;

      const allMissionDefs = [
        { key: "Midget 1", name: "Ataque con Minisubmarinos Ko-Hyoteki (Pearl Harbor)", rule: "[7.3, 7.16]", req: "Submarino nodriza Tipo C con Ko-Hyoteki", map: "Mapa M1 (Pearl Harbor)", isKo: true },
        { key: "Midget 2", name: "Ataque con Minisubmarinos Ko-Hyoteki (Sydney)", rule: "[7.3, 7.16]", req: "Submarino nodriza Tipo C con Ko-Hyoteki", map: "Mapa M2 (Sydney)", isKo: true },
        { key: "Midget 3", name: "Ataque con Minisubmarinos Ko-Hyoteki (Diego Suárez)", rule: "[7.3, 7.16]", req: "Submarino nodriza Tipo C con Ko-Hyoteki", map: "Mapa M3 (Madagascar)", isKo: true },
        { key: "Midget 4", name: "Ataque con Minisubmarinos Ko-Hyoteki (Guadalcanal)", rule: "[7.3, 7.16]", req: "Submarino nodriza Tipo C con Ko-Hyoteki", map: "Mapa M4 (Guadalcanal)", isKo: true },
        { key: "Recon 7", name: "Reconocimiento Aéreo Glen de Largo Alcance (Oahu / Pearl Harbor)", rule: "[7.1, 7.17]", req: "Hangar e hidroavión E14Y Glen", map: "Módulo Aéreo (P1 / Oahu)", isAir: true },
        { key: "Recon 8", name: "Reconocimiento Aéreo Glen (Australia / Sydney)", rule: "[7.1, 7.17]", req: "Hangar e hidroavión E14Y Glen", map: "Módulo Aéreo (P2 / Sydney)", isAir: true },
        { key: "Recon 9", name: "Reconocimiento Aéreo Glen (Océano Índico / Colombo)", rule: "[7.1, 7.17]", req: "Hangar e hidroavión E14Y Glen", map: "Módulo Aéreo (P3 / Ceilán)", isAir: true },
        { key: "Recon 12", name: "Reconocimiento Aéreo Glen (Malaya / Aleutianas)", rule: "[7.1, 7.17]", req: "Hangar e hidroavión E14Y Glen", map: "Módulo Aéreo (P4-P6)", isAir: true },
        { key: "Bomb 10", name: "Bombardeo Aéreo de Bosques de Oregón (Ataque Lookout)", rule: "[7.7, 7.17]", req: "Hidroavión armado con bombas incendiarias", map: "Módulo Aéreo (P7-P9)", isAir: true },
        { key: "Bomb 11", name: "Bombardeo Aéreo Estratégico (Esclusas del Canal de Panamá)", rule: "[7.7, 7.17]", req: "Super-submarino Sen-Toku con Seiran", map: "Módulo Aéreo (P10-P12)", isAir: true },
        { key: "Kaiten 2", name: "Ataque Suicida con Torpedos Kaiten (Fondeadero de Ulithi)", rule: "[7.8, 7.18]", req: "Submarino adaptado para Kaiten (1944+)", map: "Mapa K2 (Ulithi)", isKai: true },
        { key: "Kaiten 3", name: "Ataque Suicida con Torpedos Kaiten (Iwo Jima / Okinawa)", rule: "[7.8, 7.18]", req: "Submarino adaptado para Kaiten (1944+)", map: "Mapa K3 (Aguas Abiertas)", isKai: true },
        { key: "Minelay.", name: "Sembrado Ofensivo de Campos de Minas", rule: "[7.10]", req: "Minador Kirai-Sen o tubos cargados con minas", map: "Mapa Operaciones [A3 Especial]", isAll: true },
        { key: "Shore-Bombard.", name: "Bombardeo Costero con Cañón de Cubierta (Ellwood / Fort Stevens)", rule: "[7.9]", req: "Cañón de 140 mm operativo", map: "Costa Enemiga [A3 Especial]", isGun: true },
        { key: "Picket", name: "Línea de Piquete de Flota (Midway, Malaya, Salomón, Marianas)", rule: "[7.2]", req: "Cualquier submarino de flota (ignorar mercantes)", map: "Área de Patrulla [A3]", isAll: true },
        { key: "Transport", name: "Transporte de Suministros (Tokyo Express / Nueva Guinea / Salomón)", rule: "[7.4]", req: "Cualquier submarino (tubos cargados, sin recargas)", map: "Casilla de Misión [A3 Especial]", isAll: true },
        { key: "Strat. Supplies", name: "Transporte Estratégico Interoceánico (Misión Yanagi a Europa)", rule: "[7.5]", req: "Gran autonomía oceánica y bodegas de carga", map: "Ruta Transatlántica", isAll: true },
        { key: "Evac.", name: "Evacuación de Guarnición Aislada (Operación Kiska)", rule: "[7.6]", req: "Cualquier submarino de flota", map: "Casilla de Misión [A3 Especial]", isAll: true },
        { key: "Passngr.", name: "Transporte e Inserción de Pasajeros / Agentes / V.I.P.", rule: "[7.11]", req: "Cualquier submarino de flota", map: "Casilla de Misión [A3 Especial]", isAll: true },
        { key: "Patrol", name: "Patrulla de Combate Perimetral de Gran Evento", rule: "[7.14]", req: "Cualquier submarino de flota (¡Doble crédito!)", map: "Área de Patrulla [A3]", isAll: true }
      ];

      let guideRows = '';
      allMissionDefs.forEach((m, idx) => {
        let applies = false;
        let why = '';
        if (m.isKo) {
          applies = subKey.includes('Type_C') && !subKey.includes('Type_C3');
          why = applies ? '✅ Buque nodriza Ko-Hyoteki' : '❌ No porta minisubmarinos';
        } else if (m.isAir) {
          applies = !!sub.has_aircraft;
          why = applies ? '✅ Dispone de hangar e hidroavión' : '❌ Carece de aviación';
        } else if (m.isKai) {
          applies = !!sub.has_kaiten || (sub.kaiten_note && sub.kaiten_note.includes('Kaiten'));
          why = applies ? '✅ Habilitado para Kaiten' : '❌ No adaptado para Kaiten';
        } else if (m.isGun) {
          applies = !sub.deck_guns || (sub.deck_guns.main && sub.deck_guns.main !== 'None');
          why = applies ? '✅ Cañón de 140 mm operativo' : '❌ Sin cañón de cubierta';
        } else {
          applies = true;
          why = '✅ Apto para cualquier submarino';
        }

        const badge = applies 
          ? '<span style="background:#065f46; color:#a7f3d0; padding:2px 6px; border-radius:3px; font-weight:bold;">🟢 APTO</span>'
          : '<span style="background:#881337; color:#fecdd3; padding:2px 6px; border-radius:3px;">❌ NO APTO</span>';

        guideRows += `
          <tr style="border-bottom:1px solid #334155;">
            <td style="padding:6px; font-weight:bold; color:#fff; font-family:monospace;">${m.key}</td>
            <td style="padding:6px; color:#93c5fd; font-weight:600;">${m.name}</td>
            <td style="padding:6px; color:#cbd5e1; font-size:0.72rem;">${m.req}</td>
            <td style="padding:6px; color:var(--gold-400); font-size:0.71rem;">${m.map}</td>
            <td style="padding:6px; text-align:center;">${badge}</td>
            <td style="padding:6px; font-size:0.71rem; color:${applies ? '#a7f3d0' : '#fda4af'};">${why}</td>
          </tr>
        `;
      });

      const modalHtml = `
        <div id="missions-guide-modal-overlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.85); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px;">
          <div style="background:#071220; border:2px solid #38bdf8; border-radius:10px; max-width:980px; width:100%; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.8);">
            <div style="background:linear-gradient(90deg, #1e3a8a, #0b2545); padding:12px 16px; border-bottom:2px solid #38bdf8; display:flex; justify-content:space-between; align-items:center;">
              <h3 style="margin:0; color:#38bdf8; font-family:'Cinzel', serif; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                <span>📖</span> <span>GUÍA OFICIAL: LAS 20 MISIONES ESPECIALES EN SENSUiKAN [REGLAS 7.1 A 7.18]</span>
              </h3>
              <button type="button" onclick="document.getElementById('missions-guide-modal-overlay').remove()" class="action-btn" style="border-color:#ef4444; color:#fca5a5; font-size:0.85rem; padding:2px 8px;">✕ Cerrar</button>
            </div>
            
            <div style="padding:12px 16px; background:#0f172a; border-bottom:1px solid #334155; font-size:0.75rem; color:#cbd5e1; line-height:1.45;">
              <strong>Regla 7.14 (Mecanismo Oficial de Asignación):</strong>
              El jugador consulta en orden las misiones listadas en el reverso de la ficha de Gran Evento (de arriba a abajo) y ejecuta la <strong>primera que su submarino sea capaz de realizar</strong>.
              Si ninguna aplica, realiza Patrulla Estándar Normal. Si se completa con éxito, ¡otorga <strong>DOS (2) patrullas exitosas</strong> (Regla 7.13)!
              <div style="margin-top:4px; color:var(--gold-300);">Estado evaluado actualmente para: <strong>${subName}</strong>.</div>
            </div>

            <div style="overflow-y:auto; padding:12px 16px; flex:1;">
              <table style="width:100%; border-collapse:collapse; font-size:0.72rem; text-align:left;">
                <thead>
                  <tr style="background:#1e293b; color:#94a3b8; border-bottom:2px solid #334155;">
                    <th style="padding:6px; width:100px;">Misión Ficha</th>
                    <th style="padding:6px; width:220px;">Operación Histórica &amp; Regla</th>
                    <th style="padding:6px; width:180px;">Requisito de Buque</th>
                    <th style="padding:6px; width:140px;">Módulo / Escenario</th>
                    <th style="padding:6px; width:80px; text-align:center;">¿Tu Buque?</th>
                    <th style="padding:6px;">Evaluación Actual</th>
                  </tr>
                </thead>
                <tbody>
                  ${guideRows}
                </tbody>
              </table>
            </div>

            <div style="background:#0f172a; border-top:1px solid #334155; padding:10px 16px; text-align:right;">
              <button type="button" onclick="document.getElementById('missions-guide-modal-overlay').remove()" class="action-btn" style="background:#1e293b; border-color:#38bdf8; color:#38bdf8; padding:5px 14px; font-weight:bold;">
                Entendido • Volver al Panel
              </button>
            </div>
          </div>
        </div>
      `;

      const existing = document.getElementById('missions-guide-modal-overlay');
      if (existing) existing.remove();
      document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function updateSpecialMissionCheck() {
      const meSelect = document.getElementById('wf-me-select');
      const isEn = window.currentLang === 'en';
      const val = meSelect ? meSelect.value : 'no';
      const nameEl = document.getElementById('wf-mission-name');
      const descEl = document.getElementById('wf-mission-desc');
      const transitEl = document.getElementById('wf-extra-transit-val');

      let isSpecial = (val !== 'no');
      let missionName = "Patrulla Estándar de Interdicción";
      let missionDesc = "Búsqueda y ataque a convoyes mercantes y buques de guerra en el área de operaciones.";

      if (val === 'yes_pearl') {
        missionName = "Ataque a Pearl Harbor [Midget 1 / Recon 7 / Patrol]";
        missionDesc = "Operación Z: Mini-submarinos Ko-hyoteki (Type C), vuelo nocturno Glen (Type B) o patrulla de vigilancia. ¡Cuenta como DOS patrullas exitosas (7.13)!";
      } else if (val === 'yes_malaya') {
        missionName = "Invasión de Malasia [Picket / Recon 12 / Minelay]";
        missionDesc = "Línea de piquete contra la Force Z británica, reconocimiento aéreo o sembrado de minas. Cuenta como DOS patrullas exitosas (7.13).";
      } else if (val === 'yes_philippines') {
        missionName = "Invasión de Filipinas [Minelay]";
        missionDesc = "Sembrado de campos de minas en accesos navales. Si el submarino no lleva minas, efectúa patrulla estándar por Regla 6.0.1.C.";
      } else if (val === 'yes_dutch') {
        missionName = "Patrulla Ofensiva en Indias Holandesas [Patrol]";
        missionDesc = "Ficha de Gran Evento 'Dutch E. Indies (12/41 - 3/42)' con reverso 'Patrol'. Por Reglas 7.0 y 7.14, cualquier submarino puede realizarla y cuenta oficialmente como MISIÓN ESPECIAL (otorga doble crédito: 2 patrullas exitosas).";
      } else if (val === 'yes_sydney') {
        missionName = "Midget 2 (Incursión en Puerto de Sydney)";
        missionDesc = "Infiltración de minisubmarinos en Port Jackson (Australia). Cuenta doble para condecoraciones.";
      } else if (val === 'yes_diego') {
        missionName = "Midget 3 (Ataque a Diego Suárez / Madagascar)";
        missionDesc = "Ataque a larga distancia en el Océano Índico contra buques capitales británicos.";
      } else if (val === 'yes_midway') {
        missionName = "Línea de Vigilancia de la Batalla de Midway";
        missionDesc = "Patrulla de intercepción contra portaaviones enemigos de la US Navy.";
      } else if (val === 'yes_aleutians') {
        missionName = "Operación AL (Invasión de las Islas Aleutianas)";
        missionDesc = "Reconocimiento y apoyo de desembarco en Kiska y Attu en aguas del Pacífico Norte.";
      } else if (val === 'yes_guadalcanal') {
        missionName = "Campaña de Guadalcanal y Salomón (Tokyo Express)";
        missionDesc = "Misiones de interdicción y transporte de suministros a la guarnición imperial.";
      } else if (val === 'yes_leyte') {
        missionName = "Batalla del Golfo de Leyte / Operación Shō-1";
        missionDesc = "Despliegue ofensivo masivo contra la 7ª y 3ª Flota de la US Navy en aguas de Filipinas.";
      } else if (val === 'yes_kaiten') {
        missionName = "Misión de Torpedos Suicidas Tripulados Kaiten";
        missionDesc = "Lanzamiento de Kaiten Tipo 1 contra fondeaderos y flotas enemigas.";
      } else if (val === 'yes_arashi') {
        missionName = "Operación Arashi (Ataque a Ulithi con M6A1 Seiran)";
        missionDesc = "Incursión de bombardeo aéreo de precisión con aviones Seiran lanzados desde el Sen-Toku.";
      } else if (val === 'yes_okinawa') {
        missionName = "Operación Ten-Gō / Defensa de Aguas de Okinawa";
        missionDesc = "Línea de contención submarina ante la flota de invasión aliada.";
      }

      if (isEn) {
        const englishMissions = {
          no: [window.currentLang === 'en' ? "Standard Merchant Interdiction Patrol" : "Patrulla Estándar de Interdicción Mercante", window.currentLang === 'en' ? "Search for and attack merchant convoys and warships in the operational area." : "Buscar y atacar convoyes mercantes y buques de guerra en el área de operaciones."],
          yes_pearl: [window.currentLang === 'en' ? "Attack on Pearl Harbor [Midget 1 / Recon 7 / Patrol]" : "Ataque a Pearl Harbor [Midget 1 / Recon 7 / Patrulla]", window.currentLang === 'en' ? "Operation Z: Ko-hyoteki midget submarines (Type C), night Glen flight (Type B), or surveillance patrol. Counts as TWO successful patrols (7.13)." : "Operación Z: minisubmarinos Ko-hyoteki (Tipo C), vuelo nocturno Glen (Tipo B) o patrulla de vigilancia. Cuenta como DOS patrullas exitosas (7.13)."],
          yes_malaya: [window.currentLang === 'en' ? "Invasion of Malaya [Picket / Recon 12 / Minelay]" : "Invasión de Malaya [Piquete / Recon 12 / Minado]", window.currentLang === 'en' ? "Picket line against the British Force Z, aerial reconnaissance, or minelaying. Counts as TWO successful patrols (7.13)." : "Línea de piquete contra la Fuerza Z británica, reconocimiento aéreo o minado. Cuenta como DOS patrullas exitosas (7.13)."],
          yes_philippines: [window.currentLang === 'en' ? "Invasion of the Philippines [Minelay]" : "Invasión de Filipinas [Minado]", window.currentLang === 'en' ? "Lay naval approach minefields. If the submarine carries no mines, conduct a standard patrol under Rule 6.0.1.C." : "Sembrar campos de minas en aproximaciones navales. Si el submarino no lleva minas, realiza una patrulla estándar según la Regla 6.0.1.C."],
          yes_dutch: [window.currentLang === 'en' ? "Offensive Patrol in the Dutch East Indies [Patrol]" : "Patrulla Ofensiva en las Indias Orientales Neerlandesas [Patrulla]", window.currentLang === 'en' ? "Great Event chit 'Dutch E. Indies (12/41 - 3/42)' with 'Patrol' reverse. Any submarine may conduct it and it counts as a Special Mission." : "Ficha de Gran Evento 'Indias Orientales Holandesas (12/41 - 3/42)' con reverso 'Patrulla'. Cualquier submarino puede realizarla y cuenta como Misión Especial."],
          yes_sydney: [window.currentLang === 'en' ? "Midget 2 (Sydney Harbor Raid)" : "Midget 2 (Incursión en el Puerto de Sídney)", window.currentLang === 'en' ? "Midget submarine infiltration into Port Jackson (Australia). Counts double for decorations." : "Infiltración de minisubmarinos en Port Jackson (Australia). Cuenta doble para condecoraciones."],
          yes_diego: [window.currentLang === 'en' ? "Midget 3 (Attack on Diego Suarez / Madagascar)" : "Midget 3 (Ataque a Diego Suárez / Madagascar)", window.currentLang === 'en' ? "Long-range attack in the Indian Ocean against capital ships." : "Ataque de largo alcance en el Océano Índico contra buques capitales."],
          yes_midway: [window.currentLang === 'en' ? "Midway Battle Patrol Line" : "Línea de Patrulla en la Batalla de Midway", window.currentLang === 'en' ? "Interception patrol against enemy U.S. Navy carriers." : "Patrulla de intercepción contra portaaviones enemigos de la Marina de EE.UU."],
          yes_aleutians: [window.currentLang === 'en' ? "Operation AL (Aleutian Islands Invasion)" : "Operación AL (Invasión de las Islas Aleutianas)", window.currentLang === 'en' ? "Reconnaissance and landing support around Kiska and Attu in the North Pacific." : "Apoyo de reconocimiento y desembarco alrededor de Kiska y Attu en el Pacífico Norte."],
          yes_guadalcanal: [window.currentLang === 'en' ? "Guadalcanal and Solomon Islands Campaign (Tokyo Express)" : "Campaña de Guadalcanal y las Islas Salomón (Tokyo Express)", window.currentLang === 'en' ? "Interdiction and supply missions for the Imperial garrison." : "Misiones de interdicción y suministros para la guarnición imperial."],
          yes_leyte: [window.currentLang === 'en' ? "Battle of Leyte Gulf / Operation Shō-1" : "Batalla del Golfo de Leyte / Operación Shō-1", window.currentLang === 'en' ? "Massive offensive deployment against the U.S. 7th and 3rd Fleets in Philippine waters." : "Despliegue ofensivo masivo contra la 7.ª y 3.ª Flotas de EE.UU. en aguas filipinas."],
          yes_kaiten: [window.currentLang === 'en' ? "Manned Kaiten Suicide Torpedo Mission" : "Misión de Torpedo Suicida Tripulado Kaiten", window.currentLang === 'en' ? "Launch Type 1 Kaiten against anchorages and enemy fleets." : "Lanzar Kaiten Tipo 1 contra fondeaderos y flotas enemigas."],
          yes_arashi: [window.currentLang === 'en' ? "Operation Arashi (Ulithi Attack with M6A1 Seiran)" : "Operación Arashi (Ataque a Ulithi con M6A1 Seiran)", window.currentLang === 'en' ? "Precision air-bombing raid using Seiran aircraft launched from the Sen-Toku." : "Incursión de bombardeo aéreo de precisión usando aviones Seiran lanzados desde el Sen-Toku."],
          yes_okinawa: [window.currentLang === 'en' ? "Operation Ten-Gō / Okinawa Waters Defense" : "Operación Ten-Gō / Defensa de las aguas de Okinawa", window.currentLang === 'en' ? "Submarine containment line against the Allied invasion fleet." : "Línea de contención submarina contra la flota de invasión aliada."]
        };
        if (englishMissions[val]) [missionName, missionDesc] = englishMissions[val];
      }

      if (nameEl) nameEl.innerText = missionName;
      if (descEl) descEl.innerText = missionDesc;

      campaignState.workflow.isSpecialMission = isSpecial;
      
      // Update Special Missions Evaluation Table for Box 2 (Rule 7.14)
      const currentMonth = campaignState.workflow.selectedMonth || '1941-12';
      const assignedArea = (campaignState.workflow.assignedArea || '').toLowerCase();
      const subKey = campaignState.activeSubKey || "Type_B_Class";
      
      // Match active chit based on selected event value or month/area
      let activeChit = null;
      if (val === 'yes_pearl') activeChit = MISSION_CHITS.find(c => c.id === 'pearl_1241');
      else if (val === 'yes_malaya') activeChit = MISSION_CHITS.find(c => c.id === 'malaya_1241');
      else if (val === 'yes_philippines') activeChit = MISSION_CHITS.find(c => c.id === 'philippines_1241');
      else if (val === 'yes_dutch') activeChit = MISSION_CHITS.find(c => c.id === 'dutch_1241_0342');
      else if (val === 'yes_sydney') activeChit = MISSION_CHITS.find(c => c.id === 'australia_0542');
      else if (val === 'yes_diego') activeChit = MISSION_CHITS.find(c => c.id === 'indianocean_0542');
      else if (val === 'yes_midway') activeChit = MISSION_CHITS.find(c => c.id === 'midway_0642');
      else if (val === 'yes_aleutians') activeChit = MISSION_CHITS.find(c => c.id === 'aleutians_0542_0642');
      else if (val === 'yes_guadalcanal') activeChit = MISSION_CHITS.find(c => c.id === 'guadalcanal_0842_1242');
      else if (val === 'yes_leyte') activeChit = MISSION_CHITS.find(c => c.id === 'leyte_1044');
      else if (val === 'yes_kaiten') activeChit = MISSION_CHITS.find(c => c.id === 'marianas_1144_0445' || c.id === 'iwojima_0245');
      else if (val === 'yes_arashi') activeChit = MISSION_CHITS.find(c => c.id === 'panama_0145_0745');
      else if (val === 'yes_okinawa') activeChit = MISSION_CHITS.find(c => c.id === 'okinawa_0445_0545');

      if (!activeChit && val !== 'no') {
        // Fallback search by month & area match
        activeChit = MISSION_CHITS.find(c => c.validMonths && c.validMonths.includes(currentMonth) && (
          (c.redTitle && assignedArea.includes(c.redTitle.toLowerCase())) ||
          (c.redSub && assignedArea.includes(c.redSub.toLowerCase()))
        ));
      }

      renderSpecialMissionsEvaluationTable(activeChit, subKey, 'wf-special-mission-eval-container');

      if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
    }

    // Phase 2: Navigation & Box tracker
        // =========================================================================
    // OFFICIAL SUBMARINE MAT: PATROL TRACK & DAMAGE TRACKS RENDERER
