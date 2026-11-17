with open('app/js/gameflow_phase2.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('function updatePatrolPhaseUI()')

new_update_patrol_fn = '''function updatePatrolPhaseUI() {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      const idx = (campaignState.workflow && campaignState.workflow.currentBoxIndex !== undefined) ? campaignState.workflow.currentBoxIndex : 0;
      const list = (campaignState.workflow && campaignState.workflow.boxList) ? campaignState.workflow.boxList : [];
      const boxName = list[idx] || (isEn ? "Patrol Station" : "Casilla de Patrulla");
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");
      const assignedArea = campaignState.workflow.assignedArea || "Yokosuka / Kure";
      const targetZone = isTransit ? "Transit" : (isSpecialBox ? "Special Mission" : mapA1ToA3Zone(assignedArea));
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

      const encType = campaignState.workflow.encounterType || "--";
      let displayEncType = encType;
      if (encType === "--" || !encType) {
        displayEncType = isEn ? "Pending" : "Pendiente";
      } else if (typeof translatePhase2Encounter === 'function') {
        displayEncType = translatePhase2Encounter(encType, isEn);
      }

      const pill = document.getElementById('ppatrol-current-contact-pill');
      if (pill) {
        pill.innerText = `${isEn ? 'Contact' : 'Contacto'}: ${displayEncType}`;
        if (encType.includes("Aircraft")) {
          pill.style.borderColor = "#ef4444";
          pill.style.color = "#fca5a5";
        } else if (encType.includes("Ship") || encType.includes("Warship")) {
          pill.style.borderColor = "#10b981";
          pill.style.color = "#6ee7b7";
        } else {
          pill.style.borderColor = "var(--gold-600)";
          pill.style.color = "var(--gold-300)";
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
    }'''

code = code[:idx] + new_update_patrol_fn + '\n'

with open('app/js/gameflow_phase2.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated updatePatrolPhaseUI in app/js/gameflow_phase2.js successfully.")
