// =========================================================================
// SENSUiKAN: ROGU BUKKU (PATROL LOG SHEET & TARGET EDITOR)
// Official IJN patrol log, automated tonnage calculation & target modal editor.
// =========================================================================

    function updateRoguBoat(val) {
      campaignState.workflow.hullNumber = val;
      const subHullEl = document.getElementById('wf-sub-hull-input');
      if (subHullEl) subHullEl.value = val;
      saveState();
    }

    function updateRoguCaptain(val) {
      campaignState.workflow.commanderName = val;
      const cmdrEl = document.getElementById('wf-commander-name-input');
      if (cmdrEl) cmdrEl.value = val;
      saveState();
    }

    function syncCurrentPatrolToLog() {
      const mId = campaignState.workflow.selectedMonth || "1941-12";
      const pNum = campaignState.workflow.patrolNumber || 1;
      const area = campaignState.workflow.assignedArea || "Pearl Harbor";
      const isSpecial = campaignState.workflow.isSpecialMission || false;

      const defaultPatrolName = area ? `#${pNum} ${area}` : `Patrulla #${pNum}`;

      if (!campaignState.patrols[mId]) {
        campaignState.patrols[mId] = {
          patrolNum: String(pNum),
          patrolName: defaultPatrolName,
          area: area,
          isSpecial: isSpecial,
          targets: [],
          tons: 0,
          notes: ''
        };
      } else {
        if (!campaignState.patrols[mId].patrolNum) {
          campaignState.patrols[mId].patrolNum = String(pNum);
        }
        if (area) {
          campaignState.patrols[mId].area = area;
          if (!campaignState.patrols[mId].patrolName || campaignState.patrols[mId].patrolName.trim() === '' || campaignState.patrols[mId].patrolName === '—') {
            campaignState.patrols[mId].patrolName = defaultPatrolName;
          }
        }
        campaignState.patrols[mId].isSpecial = isSpecial;
        if (!campaignState.patrols[mId].targets) {
          campaignState.patrols[mId].targets = [];
        }
      }
    }

    function buildPatrolTable() {
      if (typeof updateRoguBukkuSubProfile === "function") updateRoguBukkuSubProfile();
      const tbody = document.getElementById('patrol-log-tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');

      const activeMonth = campaignState.workflow.selectedMonth || "1941-12";
      const boatInput = document.getElementById('rogu-boat-input');
      if (boatInput && campaignState.workflow.hullNumber) {
        boatInput.value = campaignState.workflow.hullNumber;
      }
      const captainInput = document.getElementById('rogu-captain-input');
      if (captainInput && campaignState.workflow.commanderName) {
        captainInput.value = campaignState.workflow.commanderName;
      }

      MONTHS.forEach((m, idx) => {
        const row = document.createElement('tr');
        const isEven = (idx % 2 === 0);
        const isActive = (m.id === activeMonth);
        row.className = (isEven ? 'row-even' : 'row-odd') + (isActive ? ' row-active' : '') + (m.divider ? ' row-divider' : '');

        const patData = campaignState.patrols[m.id] || { patrolNum: '', patrolName: '', area: '', isSpecial: false, targets: [], tons: 0, notes: '' };
        let pNum = patData.patrolNum || patData.num || '';
        let pName = patData.patrolName || '';

        // Auto-generate meaningful patrol name if empty
        if (!pName) {
          if (patData.area) {
            pName = pNum ? `#${pNum} ${patData.area}` : patData.area;
          } else if (pNum) {
            pName = (String(pNum).trim().toUpperCase() === 'R') ? (isEn ? 'Refit (Dry Dock)' : 'Refit (Dique Seco)') : (isEn ? `Patrol #${pNum}` : `Patrulla #${pNum}`);
          }
        }

        const isRefit = (String(pNum).trim().toUpperCase() === 'R' || String(pName).toUpperCase().includes('REFIT') || String(pName).trim().toUpperCase() === 'R');
        const targets = Array.isArray(patData.targets) ? patData.targets : [];

        // Calculate month tonnage
        let monthTons = 0;
        targets.forEach(t => {
          if (t && t.sunk && t.tons) monthTons += parseInt(t.tons) || 0;
        });
        if (monthTons === 0 && patData.tons) {
          monthTons = parseInt(patData.tons) || 0;
        }

        // Build 8 target slot TDs
        let slotsHtml = '';
        for (let s = 0; s < 8; s++) {
          const t = targets[s];
          if (t) {
            const chipClass = t.status === 'capital_sunk' ? 'chip-capital'
              : (t.status === 'damaged' ? 'chip-damaged'
              : (t.status === 'special_sunk' ? 'chip-special' : 'chip-sunk'));

            const shortName = t.name ? (t.name.length > 9 ? t.name.substring(0, 8) + '…' : t.name) : (isEn ? 'Ship' : 'Buque');
            const tonsDisplay = t.status === 'damaged' ? '(dmg)' : ((parseInt(t.tons) || 0) >= 1000 ? Math.round((parseInt(t.tons)||0)/1000) + 'k t' : (t.tons || '0t'));

            slotsHtml += `
              <td class="target-slot-cell">
                <div class="target-chip ${chipClass}" onclick="openTargetEditor('${m.id}', ${s})" title="${t.name || (isEn ? 'Ship' : 'Buque')} (${t.type || (isEn ? 'Ship' : 'Buque')}): ${t.tons || 0} t [${t.status}] - ${isEn ? 'Click to view/edit' : 'Clic para ver/editar'}">
                  <span class="chip-name">${shortName}</span>
                  <span class="chip-tons">${tonsDisplay}</span>
                </div>
              </td>
            `;
          } else {
            slotsHtml += `
              <td class="target-slot-cell">
                <div class="empty-slot" onclick="openTargetEditor('${m.id}', ${s})" title="${isEn ? 'Slot #' + (s + 1) + ' empty - Click to add target' : 'Slot #' + (s + 1) + ' vacío - Clic para añadir blanco'}">
                  ${s + 1}
                </div>
              </td>
            `;
          }
        }

        // Milestone pill
        let milestoneHtml = '';
        if (m.milestone) {
          milestoneHtml = `<span class="rogu-milestone-pill">${m.milestone}</span>`;
        }
        if (patData.isSpecial) {
          milestoneHtml += `<span class="rogu-milestone-pill" style="border-color:#ea580c; color:#fed7aa; background:rgba(234,88,12,0.2);">${isEn ? '⭐ Mission' : '⭐ Misión'}</span>`;
        }

        row.innerHTML = `
          <td>
            <span class="rogu-date-badge">
              ${isActive ? `<span class="rogu-active-indicator" title="${isEn ? 'Active patrol in progress' : 'Patrulla activa en curso'}"></span>` : ''}
              ${m.short || m.id}
            </span>
          </td>
          <td style="padding:3px 6px;">
            <input type="text" class="patrol-input-cell ${isRefit ? 'is-refit' : ''}" 
              value="${pName}" placeholder="${isEn ? 'Name / Area...' : 'Nombre / Destino...'}" 
              onchange="updatePatrol('${m.id}', 'patrolName', this.value)"
              title="${isEn ? 'Patrol Name & Area (e.g. #1 Pearl Harbor, #2 Indian Ocean, or Refit)' : 'Nombre y Asignación de Patrulla (ej. #1 Pearl Harbor, #2 Indian Ocean, o Refit)'}">
          </td>
          ${slotsHtml}
          <td class="tonnage-val" id="tons-${m.id}">
            ${monthTons > 0 ? monthTons.toLocaleString() + ' t' : (isRefit ? '<span style="color:#ef4444; font-size:0.7rem; font-weight:bold;">Refit</span>' : '—')}
          </td>
          <td style="text-align:left;">
            <div style="display:flex; align-items:center; gap:6px;">
              ${milestoneHtml}
              <input type="text" class="notes-input-cell" value="${patData.notes || ''}" 
                placeholder="${isEn ? 'Patrol notes & milestones...' : 'Anotaciones de patrulla...'}" 
                onchange="updatePatrol('${m.id}', 'notes', this.value)">
            </div>
          </td>
        `;
        tbody.appendChild(row);
      });

      recalculateTotals();
    }

    function updatePatrol(monthId, field, val) {
      if (!campaignState.patrols[monthId]) {
        campaignState.patrols[monthId] = { patrolNum: '', patrolName: '', area: '', isSpecial: false, targets: [], tons: 0, notes: '' };
      }
      campaignState.patrols[monthId][field] = val;

      if (field === 'patrolName') {
        const trimmed = String(val).trim();
        if (trimmed.toUpperCase() === 'R' || trimmed.toUpperCase().startsWith('REFIT')) {
          campaignState.patrols[monthId].patrolNum = 'R';
          campaignState.patrols[monthId].area = 'Dique Seco / Refit';
        } else {
          // Parse potential #1 Pearl Harbor
          const match = trimmed.match(/^#?(\d+)\s*[:\-]?\s*(.*)$/);
          if (match) {
            campaignState.patrols[monthId].patrolNum = match[1];
            if (match[2]) campaignState.patrols[monthId].area = match[2];
          } else if (trimmed) {
            campaignState.patrols[monthId].area = trimmed;
          }
        }
      }

      saveState();
      buildPatrolTable();
    }

    function recalculateTotals() {
      let totalPatrols = 0;
      let spclMissions = 0;
      let shipsSunk = 0;
      let totalTonnage = 0;

      MONTHS.forEach(m => {
        const p = campaignState.patrols[m.id];
        if (p) {
          const pNum = String(p.patrolNum || p.num || '').trim();
          const pName = String(p.patrolName || '').trim();
          const isR = pNum.toUpperCase() === 'R' || pName.toUpperCase().includes('REFIT') || pName.toUpperCase().startsWith('R');
          if ((pNum && !isR) || (pName && !isR)) {
            totalPatrols++;
          }
          if (p.isSpecial) spclMissions++;

          const targets = Array.isArray(p.targets) ? p.targets : [];
          targets.forEach(t => {
            if (t) {
              if (t.status === 'capital_sunk' || t.status === 'sunk' || t.status === 'special_sunk' || t.sunk) {
                shipsSunk++;
                totalTonnage += (parseInt(t.tons) || 0);
              }
              if (t.status === 'special_sunk' && !p.isSpecial) {
                spclMissions++;
              }
            }
          });
        }
      });

      const elPatrols = document.getElementById('kpi-total-patrols');
      if (elPatrols) elPatrols.innerText = totalPatrols;

      const elSpcl = document.getElementById('kpi-spcl-missions');
      if (elSpcl) elSpcl.innerText = spclMissions;

      const elSunk = document.getElementById('kpi-ships-sunk');
      if (elSunk) elSunk.innerText = shipsSunk;

      const elTons = document.getElementById('kpi-total-tonnage');
      if (elTons) elTons.innerText = totalTonnage.toLocaleString() + ' t';

      // Career Victory Tier according to Official Rule [5.2] Determining Victory:
      let tier = (typeof t === 'function' ? t('tierDefeat') : 'DERROTA (0-9k)');
      if (totalTonnage >= 100000) tier = (typeof t === 'function' ? t('tierDecisiveVictory') : 'VICTORIA DECISIVA (100k+)');
      else if (totalTonnage >= 50000) tier = (typeof t === 'function' ? t('tierSubstantialVictory') : 'VICTORIA SUSTANCIAL (50k-99k)');
      else if (totalTonnage >= 20000) tier = (typeof t === 'function' ? t('tierMarginalVictory') : 'VICTORIA MARGINAL (20k-49k)');
      else if (totalTonnage >= 10000) tier = (typeof t === 'function' ? t('tierDraw') : 'EMPATE HISTÓRICO (10k-19k)');

      const elTier = document.getElementById('kpi-victory-tier');
      if (elTier) elTier.innerText = tier;
    }

    // Target Editor Modal Handlers
    function openTargetEditor(monthId, slotIdx) {
      const targetMonth = monthId || campaignState.workflow.selectedMonth || "1941-12";
      document.getElementById('tedit-month-id').value = targetMonth;
      
      const selMonth = document.getElementById('tedit-month-select');
      selMonth.innerHTML = '';
      MONTHS.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.text = `${m.short || m.id} (${m.label})`;
        if (m.id === targetMonth) opt.selected = true;
        selMonth.appendChild(opt);
      });

      const slotSelect = document.getElementById('tedit-slot-select');
      const patData = campaignState.patrols[targetMonth] || { targets: [] };
      const targets = Array.isArray(patData.targets) ? patData.targets : [];

      let actualSlot = slotIdx;
      if (actualSlot === null || actualSlot === undefined) {
        actualSlot = Math.min(targets.length, 7);
      }
      slotSelect.value = String(actualSlot);
      document.getElementById('tedit-slot-idx').value = String(actualSlot);

      const existingTarget = targets[actualSlot];
      const btnDel = document.getElementById('tedit-btn-delete');

      if (existingTarget) {
        document.getElementById('target-editor-title').innerHTML = `🎯 ${typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Edit Target' : 'Editar Blanco'} (${typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Month' : 'Mes'}: ${targetMonth} • Slot #${actualSlot + 1})`;
        document.getElementById('tedit-name').value = existingTarget.name || '';
        document.getElementById('tedit-tons').value = existingTarget.tons || '';
        document.getElementById('tedit-type').value = existingTarget.type || 'Freighter';
        document.getElementById('tedit-status').value = existingTarget.status || 'sunk';
        document.getElementById('tedit-notes').value = existingTarget.notes || '';
        if (btnDel) btnDel.style.display = 'inline-block';
      } else {
        document.getElementById('target-editor-title').innerHTML = `🎯 ${typeof currentLang !== 'undefined' && currentLang === 'en' ? 'New Target' : 'Nuevo Blanco'} (${typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Month' : 'Mes'}: ${targetMonth} • Slot #${actualSlot + 1})`;
        document.getElementById('tedit-name').value = '';
        document.getElementById('tedit-tons').value = '';
        document.getElementById('tedit-type').value = 'Freighter';
        document.getElementById('tedit-status').value = 'sunk';
        document.getElementById('tedit-notes').value = '';
        if (btnDel) btnDel.style.display = 'none';
      }

      const modal = document.getElementById('modal-target-editor');
      if (modal) modal.style.display = 'flex';
    }

    function closeTargetEditor() {
      const modal = document.getElementById('modal-target-editor');
      if (modal) modal.style.display = 'none';
    }

    function saveTargetFromEditor() {
      const mId = document.getElementById('tedit-month-select').value;
      const sIdx = parseInt(document.getElementById('tedit-slot-select').value) || 0;
      const name = document.getElementById('tedit-name').value.trim() || 'Buque Sin Nombre';
      const tons = parseInt(document.getElementById('tedit-tons').value) || 0;
      const type = document.getElementById('tedit-type').value;
      const status = document.getElementById('tedit-status').value;
      const notes = document.getElementById('tedit-notes').value.trim();

      if (!campaignState.patrols[mId]) {
        campaignState.patrols[mId] = {
          patrolNum: '1',
          area: 'Operaciones',
          isSpecial: (status === 'special_sunk'),
          targets: [],
          tons: 0,
          notes: ''
        };
      }
      if (!Array.isArray(campaignState.patrols[mId].targets)) {
        campaignState.patrols[mId].targets = [];
      }

      const targetObj = {
        name: name,
        tons: tons,
        type: type,
        status: status,
        sunk: (status !== 'damaged'),
        notes: notes,
        date: mId
      };

      campaignState.patrols[mId].targets[sIdx] = targetObj;

      // Recalculate month tonnage
      campaignState.patrols[mId].tons = campaignState.patrols[mId].targets
        .filter(x => x && x.sunk)
        .reduce((sum, x) => sum + (parseInt(x.tons) || 0), 0);

      closeTargetEditor();
      buildPatrolTable();
      saveState();
      showToast(`¡Blanco guardado en ${mId} (Slot #${sIdx + 1}): ${name}!`);
    }

    function deleteTargetFromEditor() {
      const mId = document.getElementById('tedit-month-select').value;
      const sIdx = parseInt(document.getElementById('tedit-slot-select').value) || 0;

      if (campaignState.patrols[mId] && Array.isArray(campaignState.patrols[mId].targets)) {
        campaignState.patrols[mId].targets.splice(sIdx, 1);
        campaignState.patrols[mId].tons = campaignState.patrols[mId].targets
          .filter(x => x && x.sunk)
          .reduce((sum, x) => sum + (parseInt(x.tons) || 0), 0);
      }

      closeTargetEditor();
      buildPatrolTable();
      saveState();
      showToast(`Blanco eliminado del slot #${sIdx + 1}`);
    }

    // SUBMARINES DOCK
