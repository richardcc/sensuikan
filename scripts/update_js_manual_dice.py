# -*- coding: utf-8 -*-
"""
Update JS files to support manual tabletop dice and outcomes:
- app/js/gameflow_phase2.js
- app/js/tables.js
- app/js/gameflow_phase3.js
- app/js/gameflow_phase4_5.js
"""

def update_phase2_js():
    p = 'app/js/gameflow_phase2.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()
    
    old_code = '''    function rollBoxEncounter() {
      const idx = campaignState.workflow.currentBoxIndex || 0;
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");
      
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const targetZone = isTransit ? "Transit" : (isSpecialBox ? "Special Mission" : mapA1ToA3Zone(assignedArea));

      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      let sum = d1 + d2;'''

    new_code = '''    function rollBoxEncounter(manualRoll) {
      const idx = campaignState.workflow.currentBoxIndex || 0;
      const list = campaignState.workflow.boxList || [];
      const boxName = list[idx] || "Patrulla";
      const isTransit = boxName.includes("Transit") || boxName.includes("Tránsito") || boxName.includes("Return") || boxName.includes("Retorno");
      const isSpecialBox = boxName.includes("Mission") || boxName.includes("Misión");
      
      const assignedArea = campaignState.workflow.assignedArea || "Pearl Harbor";
      const targetZone = isTransit ? "Transit" : (isSpecialBox ? "Special Mission" : mapA1ToA3Zone(assignedArea));

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
      }'''

    if old_code in c:
        c = c.replace(old_code, new_code, 1)
        # Also update resEl text if needed
        old_res = 'resEl.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isEn ? "2d6 Roll" : "Tirada 2d6"}: [${d1} + ${d2} = ${sum}]</span> <span style="color:#94a3b8;">[${isEn ? "Zone" : "Zona"}: ${zoneLabel}]</span>`;'
        new_res = 'resEl.innerHTML = `<span style="color:#fde047; font-weight:800;">🎲 ${isManual ? (isEn ? "Tabletop 2d6" : "Mesa 2d6") : (isEn ? "2d6 Roll" : "Tirada 2d6")}: [${d1} + ${d2} = ${sum}]</span> <span style="color:#94a3b8;">[${isEn ? "Zone" : "Zona"}: ${zoneLabel}]</span>`;'
        if old_res in c:
            c = c.replace(old_res, new_res, 1)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print('gameflow_phase2.js updated successfully.')
    else:
        print('ERROR: target in gameflow_phase2.js not found!')

def update_tables_js():
    p = 'app/js/tables.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    old_row = 'const rowBg = isRolled ? \'background:#15803d; color:#fff;\' : (r % 2 === 0 ? \'background:rgba(255,255,255,0.02);\' : \'\');\n        html += `<tr style="border-bottom:1px solid #334155; ${rowBg}">`;'
    new_row = 'const rowBg = isRolled ? \'background:#15803d; color:#fff;\' : (r % 2 === 0 ? \'background:rgba(255,255,255,0.02);\' : \'\');\n        html += `<tr onclick="rollBoxEncounter(${r})" style="border-bottom:1px solid #334155; cursor:pointer; ${rowBg}" title="${isEn ? \'Click to apply 2d6 = \' + r : \'Clic para aplicar tirada 2d6 = \' + r}">`;'

    if old_row in c:
        c = c.replace(old_row, new_row, 1)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print('tables.js updated successfully.')
    else:
        print('ERROR: target in tables.js not found!')

def update_phase3_js():
    p = 'app/js/gameflow_phase3.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Update rollB4Detection
    old_b4 = '''    function rollB4Detection() {
      const isEn = (window.currentLang === 'en');
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;'''

    new_b4 = '''    function rollB4Detection(manualRoll) {
      const isEn = (window.currentLang === 'en');
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
      }'''

    # 2. Update rollEscortCounterAttack
    old_b5 = '''    function rollEscortCounterAttack() {
      const isEn = (window.currentLang === 'en');
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const sum = d1 + d2;'''

    new_b5 = '''    function rollEscortCounterAttack(manualRoll) {
      const isEn = (window.currentLang === 'en');
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
      }'''

    manual_torp_fn = '''
function applyManualTorpedoHits() {
  const isEn = (window.currentLang === 'en');
  const hits = parseInt(document.getElementById('wf-manual-hits-select').value) || 0;
  const duds = parseInt(document.getElementById('wf-manual-duds-select').value) || 0;
  let dmg = parseInt(document.getElementById('wf-manual-dmg-input').value);
  if (isNaN(dmg) || dmg < 0) dmg = hits * 3;
  const target = campaignState.workflow.currentTarget || { name: (isEn ? "Unknown Merchant" : "Mercante Desconocido"), tons: 4500, type: "Freighter" };

  let reqPts = 2;
  if (target.tons <= 1000) reqPts = 1;
  else if (target.tons <= 5000) reqPts = 2;
  else if (target.tons < 10000) reqPts = 3;
  else reqPts = 4;
  if (target.pts_to_sink) reqPts = target.pts_to_sink;
  if (target.type === 'Capital') reqPts = Math.max(reqPts, 5);

  const isSunk = (dmg >= reqPts);
  let status = '';
  if (isEn) {
    status = isSunk
      ? `WARSHIP SUNK! (${dmg}/${reqPts} pts accumulated - ${(target.tons || 3000).toLocaleString()} tons)`
      : (hits > 0 ? `SHIP DAMAGED (${dmg}/${reqPts} pts required to sink)` : `MISSED SALVO (0 hits)`);
  } else {
    status = isSunk
      ? `¡BUQUE HUNDIDO! (${dmg}/${reqPts} pts acumulados - ${(target.tons || 3000).toLocaleString()} tons)`
      : (hits > 0 ? `BUQUE DAÑADO (${dmg}/${reqPts} pts necesarios para hundir)` : `SALVA FALLIDA (0 impactos)`);
  }

  let roguCategory = 'miss';
  if (isSunk) {
    if (target.type === 'Capital' || reqPts >= 5) {
      roguCategory = 'capital_sunk';
    } else if (campaignState.workflow.isSpecialMission || target.isSpecial) {
      roguCategory = 'special_sunk';
    } else {
      roguCategory = 'sunk';
    }
  } else if (hits > 0) {
    roguCategory = 'damaged';
  }

  campaignState.workflow.lastCombatHits = hits;
  campaignState.workflow.lastCombatDamage = dmg;
  campaignState.workflow.lastCombatIsSunk = isSunk;
  campaignState.workflow.lastCombatStatus = roguCategory;

  const hitResEl = document.getElementById('wf-combat-hit-res');
  if (hitResEl) {
    hitResEl.innerText = isEn 
      ? `[TABLETOP] ${hits} EFFECTIVE HITS! (Duds: ${duds}) — ${dmg} damage pts`
      : `[MESA] ¡${hits} IMPACTOS EFECTIVOS! (Defectuosos: ${duds}) — ${dmg} pts de daño`;
  }
  const sinkStatusEl = document.getElementById('wf-combat-sink-status');
  if (sinkStatusEl) {
    sinkStatusEl.innerText = status;
  }

  const diceBox = document.getElementById('wf-torpedo-dice-details');
  if (diceBox) {
    diceBox.innerHTML = `
      <div style="background:rgba(6, 78, 59, 0.4); border:1px solid #059669; border-radius:5px; padding:6px 10px; font-size:0.75rem; color:#a7f3d0;">
        <strong>🎯 ${isEn ? 'Tabletop Salvo Applied:' : 'Salva de Mesa Aplicada:'}</strong>
        ${hits} ${isEn ? 'hits' : 'impactos'}, ${duds} ${isEn ? 'duds' : 'defectuosos'}, ${dmg} ${isEn ? 'damage points' : 'puntos de daño'}.
      </div>
    `;
  }

  if (hits > 0) {
    logCombatToRoguBukku(false);
  }
  showToast((isEn ? "Tabletop salvo applied: " : "Salva de mesa aplicada: ") + status);
}
'''

    if old_b4 in c and old_b5 in c:
        c = c.replace(old_b4, new_b4, 1)
        c = c.replace(old_b5, new_b5, 1)
        c += '\n' + manual_torp_fn
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print('gameflow_phase3.js updated successfully.')
    else:
        print('ERROR: targets in gameflow_phase3.js not found!')

def update_phase4_5_js():
    p = 'app/js/gameflow_phase4_5.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Update rollB7Flooding
    old_flood = '''    function rollB7Flooding() {
      const isEn = window.currentLang === 'en';
      const d = Math.floor(Math.random() * 6) + 1;'''

    new_flood = '''    function rollB7Flooding(manualRoll) {
      const isEn = window.currentLang === 'en';
      const d = (typeof manualRoll === 'number' && manualRoll >= 1 && manualRoll <= 6) ? manualRoll : (Math.floor(Math.random() * 6) + 1);'''

    # 2. Update rollB7SystemRepair
    old_rep = '''    function rollB7SystemRepair() {
      const isEn = window.currentLang === 'en';
      const sys = document.getElementById('wf-b7-system-select').value;
      const el = document.getElementById('wf-b7-repair-res');
      if (sys === 'hull') {
        el.style.color = '#f87171';
        el.innerText = isEn ? '❌ Hull damage cannot be repaired at sea. Drydock (Refit) is required.' : '❌ El daño de casco no se puede reparar en alta mar. Requiere dique seco (Refit).';
        return;
      }
      const d = Math.floor(Math.random() * 6) + 1;'''

    new_rep = '''    function rollB7SystemRepair(manualRoll) {
      const isEn = window.currentLang === 'en';
      const sys = document.getElementById('wf-b7-system-select').value;
      const el = document.getElementById('wf-b7-repair-res');
      if (sys === 'hull') {
        el.style.color = '#f87171';
        el.innerText = isEn ? '❌ Hull damage cannot be repaired at sea. Drydock (Refit) is required.' : '❌ El daño de casco no se puede reparar en alta mar. Requiere dique seco (Refit).';
        return;
      }
      const d = (typeof manualRoll === 'number' && manualRoll >= 1 && manualRoll <= 6) ? manualRoll : (Math.floor(Math.random() * 6) + 1);'''

    if old_flood in c and old_rep in c:
        c = c.replace(old_flood, new_flood, 1)
        c = c.replace(old_rep, new_rep, 1)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print('gameflow_phase4_5.js updated successfully.')
    else:
        print('ERROR: targets in gameflow_phase4_5.js not found!')

if __name__ == '__main__':
    update_phase2_js()
    update_tables_js()
    update_phase3_js()
    update_phase4_5_js()
