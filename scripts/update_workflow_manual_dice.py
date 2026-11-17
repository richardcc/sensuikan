# -*- coding: utf-8 -*-
"""
Script to inject manual tabletop dice selectors and direct outcome buttons into:
1. app/partials/02_tab_workflow.html (F1, F2, Phase 2, Phase 3, Phase 4)
2. app/js/gameflow_phase2.js (accept manualRoll in rollBoxEncounter)
3. app/js/tables.js (make Chart A3 table rows clickable)
4. app/js/gameflow_phase3.js (applyManualTorpedoHits, accept manualRoll in B4 and B5)
5. app/js/gameflow_phase4_5.js (accept manualRoll in rollB7Flooding and rollB7SystemRepair)
"""

def update_workflow_html():
    with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. F1 Captain
    old_f1_cap = '''                <button type="button" id="f1-cap-btn" onclick="rollCaptainTorpedoTraining()" class="action-btn" style="width:100%; border-color:#ef4444; color:#fca5a5; font-size:0.84rem; padding:4px 6px;">
                  🎲 Tirar Prueba de Torpedos (3x)
                </button>'''
    new_f1_cap = '''                <button type="button" id="f1-cap-btn" onclick="rollCaptainTorpedoTraining()" class="action-btn" style="width:100%; border-color:#ef4444; color:#fca5a5; font-size:0.84rem; padding:4px 6px;">
                  🎲 Tirar Prueba de Torpedos (3x)
                </button>
                <div style="display:flex; gap:4px; margin-top:4px;">
                  <button type="button" onclick="setCaptainTorpedoTraining(true)" class="btn-xs" style="flex:1; background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px; font-size:0.75rem; cursor:pointer; font-weight:bold;" title="Superado con dados de mesa">✅ Superado (Mesa)</button>
                  <button type="button" onclick="setCaptainTorpedoTraining(false)" class="btn-xs" style="flex:1; background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px; font-size:0.75rem; cursor:pointer;" title="Fallo con dados de mesa">❌ Fallo</button>
                </div>'''

    # 2. F1 XO
    old_f1_xo = '''                <button type="button" id="f1-xo-btn" onclick="rollXODeckGunTraining()" class="action-btn" style="width:100%; border-color:#ef4444; color:#fca5a5; font-size:0.84rem; padding:4px 6px;">
                  🎲 Tirar Prueba de Cañón (3x)
                </button>'''
    new_f1_xo = '''                <button type="button" id="f1-xo-btn" onclick="rollXODeckGunTraining()" class="action-btn" style="width:100%; border-color:#ef4444; color:#fca5a5; font-size:0.84rem; padding:4px 6px;">
                  🎲 Tirar Prueba de Cañón (3x)
                </button>
                <div style="display:flex; gap:4px; margin-top:4px;">
                  <button type="button" onclick="setXODeckGunTraining(true)" class="btn-xs" style="flex:1; background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px; font-size:0.75rem; cursor:pointer; font-weight:bold;" title="Superado con dados de mesa">✅ Superado (Mesa)</button>
                  <button type="button" onclick="setXODeckGunTraining(false)" class="btn-xs" style="flex:1; background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px; font-size:0.75rem; cursor:pointer;" title="Fallo con dados de mesa">❌ Fallo</button>
                </div>'''

    # 3. F1 Engineer
    old_f1_eng = '''                <button type="button" id="f1-eng-btn" onclick="rollEngineerJudgmentTraining()" class="action-btn" style="width:100%; border-color:var(--gold-500); color:var(--gold-300); font-size:0.84rem; padding:4px 6px;">
                  🎲 Tirar Prueba de Profundidad (3x)
                </button>'''
    new_f1_eng = '''                <button type="button" id="f1-eng-btn" onclick="rollEngineerJudgmentTraining()" class="action-btn" style="width:100%; border-color:var(--gold-500); color:var(--gold-300); font-size:0.84rem; padding:4px 6px;">
                  🎲 Tirar Prueba de Profundidad (3x)
                </button>
                <div style="display:flex; gap:4px; margin-top:4px;">
                  <button type="button" onclick="setEngineerJudgmentTraining(true)" class="btn-xs" style="flex:1; background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px; font-size:0.75rem; cursor:pointer; font-weight:bold;" title="Superado con dados de mesa">✅ Superado (Mesa)</button>
                  <button type="button" onclick="setEngineerJudgmentTraining(false)" class="btn-xs" style="flex:1; background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px; font-size:0.75rem; cursor:pointer;" title="Fallo con dados de mesa">❌ Implosión</button>
                </div>'''

    # 4. F2 Midget School Torp, Comms, Net
    old_f2_torp = '<button type="button" id="f2-btn-torp" onclick="rollF2Torpedo()" class="action-btn" style="padding:3px 10px; font-size:0.84rem; border-color:#ef4444; color:#fca5a5;">🎲 Tirar</button>'
    new_f2_torp = '''<div style="display:flex; gap:4px; align-items:center;">
                    <button type="button" id="f2-btn-torp" onclick="rollF2Torpedo()" class="action-btn" style="padding:3px 8px; font-size:0.84rem; border-color:#ef4444; color:#fca5a5;">🎲 Tirar</button>
                    <button type="button" onclick="setF2Torpedo(true)" class="btn-xs" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Superado con dados de mesa">✅</button>
                    <button type="button" onclick="setF2Torpedo(false)" class="btn-xs" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Fallo con dados de mesa">❌</button>
                  </div>'''

    old_f2_comms = '<button type="button" id="f2-btn-comms" onclick="rollF2Comms()" class="action-btn" style="padding:3px 10px; font-size:0.84rem; border-color:#38bdf8; color:#38bdf8;">🎲 Tirar</button>'
    new_f2_comms = '''<div style="display:flex; gap:4px; align-items:center;">
                    <button type="button" id="f2-btn-comms" onclick="rollF2Comms()" class="action-btn" style="padding:3px 8px; font-size:0.84rem; border-color:#38bdf8; color:#38bdf8;">🎲 Tirar</button>
                    <button type="button" onclick="setF2Comms(true)" class="btn-xs" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Superado con dados de mesa">✅</button>
                    <button type="button" onclick="setF2Comms(false)" class="btn-xs" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Fallo con dados de mesa">❌</button>
                  </div>'''

    old_f2_net = '<button type="button" id="f2-btn-net" onclick="rollF2Net()" class="action-btn" style="padding:3px 10px; font-size:0.84rem; border-color:#10b981; color:#a7f3d0;">🎲 Tirar</button>'
    new_f2_net = '''<div style="display:flex; gap:4px; align-items:center;">
                    <button type="button" id="f2-btn-net" onclick="rollF2Net()" class="action-btn" style="padding:3px 8px; font-size:0.84rem; border-color:#10b981; color:#a7f3d0;">🎲 Tirar</button>
                    <button type="button" onclick="setF2Net(true)" class="btn-xs" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Superado con dados de mesa">✅</button>
                    <button type="button" onclick="setF2Net(false)" class="btn-xs" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Fallo con dados de mesa">❌</button>
                  </div>'''

    # 5. Phase 2: Encounter 2d6 Tabletop input
    old_p2_dice = '''              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--navy-900); padding:10px; border-radius:6px;">
                <div>
                  <div id="p2-roll-result-label" style="font-size:0.84rem; color:var(--slate-400);">Resultado 2d6:</div>
                  <div id="wf-encounter-roll-res" style="font-size:1.15rem; font-weight:800; color:var(--gold-300);">Sin Tirar</div>
                </div>
                <button id="p2-roll-btn" class="btn-dice" onclick="rollBoxEncounter()">🎲 Tirar 2d6 [A3]</button>
              </div>'''
    new_p2_dice = '''              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--navy-900); padding:10px; border-radius:6px; flex-wrap:wrap; gap:8px;">
                <div>
                  <div id="p2-roll-result-label" style="font-size:0.84rem; color:var(--slate-400);">Resultado 2d6:</div>
                  <div id="wf-encounter-roll-res" style="font-size:1.15rem; font-weight:800; color:var(--gold-300);">Sin Tirar</div>
                </div>
                <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
                  <button id="p2-roll-btn" class="btn-dice" onclick="rollBoxEncounter()">🎲 Tirar 2d6 [A3]</button>
                  <div style="display:flex; align-items:center; gap:4px; background:var(--slate-800); border:1px solid var(--slate-600); border-radius:4px; padding:2px 6px;">
                    <span style="font-size:0.74rem; color:var(--gold-300); font-weight:bold;">Mesa:</span>
                    <select id="sel-manual-a3-dice" style="background:#0f172a; color:#fff; border:1px solid #475569; font-size:0.82rem; padding:2px 4px; border-radius:3px;">
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7" selected>7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                    <button type="button" onclick="rollBoxEncounter(parseInt(document.getElementById('sel-manual-a3-dice').value))" class="btn-xs" style="background:#1e40af; color:#dbeafe; border:1px solid #3b82f6; border-radius:3px; padding:3px 6px; font-size:0.75rem; cursor:pointer;" title="Aplicar tirada física de mesa">Aplicar</button>
                  </div>
                </div>
              </div>'''

    # 6. Phase 3: Paso 4 Torpedos Manual Results Input
    old_p3_torps = '''              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--navy-900); padding:10px; border-radius:6px; margin-top:6px;">
                <div>
                  <div id="p3-hits-calc-lbl" style="font-size:0.84rem; color:var(--slate-400);">Impactos y Daño Calculado:</div>
                  <div id="wf-combat-hit-res" style="font-size:1.15rem; font-weight:800; color:var(--emerald-500);">¡2 IMPACTOS! (Defectuosos: 0)</div>
                  <div id="wf-combat-sink-status" style="font-size:0.80rem; font-weight:700; color:#fde047;">¡BUQUE HUNDIDO! (5,700 tons)</div>
                </div>
                <button id="p3-btn-fire" class="btn-dice" onclick="resolveTorpedoSalvo()">🚀 ¡FUEGO! (Disparar)</button>
              </div>'''
    new_p3_torps = '''              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--navy-900); padding:10px; border-radius:6px; margin-top:6px; flex-wrap:wrap; gap:8px;">
                <div>
                  <div id="p3-hits-calc-lbl" style="font-size:0.84rem; color:var(--slate-400);">Impactos y Daño Calculado:</div>
                  <div id="wf-combat-hit-res" style="font-size:1.15rem; font-weight:800; color:var(--emerald-500);">¡2 IMPACTOS! (Defectuosos: 0)</div>
                  <div id="wf-combat-sink-status" style="font-size:0.80rem; font-weight:700; color:#fde047;">¡BUQUE HUNDIDO! (5,700 tons)</div>
                </div>
                <button id="p3-btn-fire" class="btn-dice" onclick="resolveTorpedoSalvo()">🚀 ¡FUEGO! (Virtual)</button>
              </div>

              <!-- Entrada Manual de Impactos de Mesa -->
              <div style="background:rgba(15,23,42,0.6); border:1px solid var(--slate-700); border-radius:6px; padding:6px 10px; margin-top:6px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <div style="font-size:0.75rem; color:var(--gold-300); font-weight:bold;">🎲 Dados Físicos de Mesa:</div>
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <label style="font-size:0.74rem; color:var(--slate-300);">Impactos:
                    <select id="wf-manual-hits-select" style="background:#0f172a; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:2px 4px; font-weight:bold; font-size:0.80rem;">
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2" selected>2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                    </select>
                  </label>
                  <label style="font-size:0.74rem; color:var(--slate-300);">Defectuosos:
                    <select id="wf-manual-duds-select" style="background:#0f172a; color:#fde68a; border:1px solid #d97706; border-radius:3px; padding:2px 4px; font-size:0.80rem;">
                      <option value="0" selected>0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </label>
                  <label style="font-size:0.74rem; color:var(--slate-300);">Pts Daño:
                    <input type="number" id="wf-manual-dmg-input" value="6" min="0" max="24" style="background:#0f172a; color:#38bdf8; border:1px solid #38bdf8; border-radius:3px; padding:2px 4px; width:44px; font-weight:bold; font-size:0.80rem;" />
                  </label>
                  <button type="button" onclick="applyManualTorpedoHits()" class="btn-xs" style="background:#047857; color:#fff; border:1px solid #10b981; border-radius:4px; padding:4px 8px; font-size:0.76rem; font-weight:bold; cursor:pointer;" title="Aplicar impactos tirados en mesa">🎯 Aplicar Mesa</button>
                </div>
              </div>'''

    # 7. Phase 3: Paso 5 Detección & Cargas B4/B5 Quick Buttons
    old_p3_escort = '''                <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
                  <button id="p3-btn-b4" type="button" class="btn-dice" onclick="rollB4Detection()" style="font-size:0.86rem; flex:1; justify-content:center;">
                    🎲 1. Detección (Chart B4 - 2d6)
                  </button>
                  <button id="p3-btn-b5" type="button" class="btn-dice" onclick="rollEscortCounterAttack()" style="font-size:0.86rem; flex:1; justify-content:center; background:linear-gradient(135deg,#991b1b,#b91c1c);">
                    💣 2. Cargas y Averías (B5/B6)
                  </button>
                  <button id="p3-btn-deep" type="button" class="action-btn" onclick="testDepthDive()" style="font-size:0.84rem; border-color:#38bdf8; color:#38bdf8;">
                    ⚓ Inmersión Profunda
                  </button>
                </div>'''
    new_p3_escort = '''                <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
                  <button id="p3-btn-b4" type="button" class="btn-dice" onclick="rollB4Detection()" style="font-size:0.84rem; flex:1; justify-content:center;">
                    🎲 1. Detección (B4)
                  </button>
                  <button id="p3-btn-b5" type="button" class="btn-dice" onclick="rollEscortCounterAttack()" style="font-size:0.84rem; flex:1; justify-content:center; background:linear-gradient(135deg,#991b1b,#b91c1c);">
                    💣 2. Cargas (B5/B6)
                  </button>
                  <button id="p3-btn-deep" type="button" class="action-btn" onclick="testDepthDive()" style="font-size:0.84rem; border-color:#38bdf8; color:#38bdf8;">
                    ⚓ Inmersión Profunda
                  </button>
                </div>
                <!-- Botones Rápidos / Mesa para B4 y B5 -->
                <div style="display:flex; flex-direction:column; gap:4px; margin-top:6px; background:rgba(0,0,0,0.3); padding:6px 8px; border-radius:4px; border:1px solid #334155;">
                  <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; font-size:0.72rem;">
                    <span style="color:var(--gold-400); font-weight:bold;">Mesa B4 (Detección):</span>
                    <div style="display:flex; gap:3px;">
                      <button type="button" onclick="rollB4Detection(7)" class="btn-xs" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:2px 6px; font-size:0.72rem; cursor:pointer;" title="Evadido (tirada ≤8)">✅ No Detectado</button>
                      <button type="button" onclick="rollB4Detection(9)" class="btn-xs" style="background:#b45309; color:#fde68a; border:1px solid #f59e0b; border-radius:3px; padding:2px 6px; font-size:0.72rem; cursor:pointer;" title="Detectado (tirada 9-10)">⚠️ Detectado</button>
                      <button type="button" onclick="rollB4Detection(11)" class="btn-xs" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:2px 6px; font-size:0.72rem; cursor:pointer;" title="Detectado con +1 ataque (tirada ≥11)">🚨 Detectado +1</button>
                    </div>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; font-size:0.72rem;">
                    <span style="color:#f87171; font-weight:bold;">Mesa B5 (Cargas):</span>
                    <div style="display:flex; gap:3px; flex-wrap:wrap;">
                      <button type="button" onclick="rollEscortCounterAttack(3)" class="btn-xs" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:2px 5px; font-size:0.70rem; cursor:pointer;" title="Ineficaz (tirada ≤3)">🌊 Ineficaz</button>
                      <button type="button" onclick="rollEscortCounterAttack(5)" class="btn-xs" style="background:#1e3a8a; color:#bfdbfe; border:1px solid #3b82f6; border-radius:3px; padding:2px 5px; font-size:0.70rem; cursor:pointer;" title="1 impacto de carga (4-6)">1 Daño</button>
                      <button type="button" onclick="rollEscortCounterAttack(7)" class="btn-xs" style="background:#854d0e; color:#fef08a; border:1px solid #eab308; border-radius:3px; padding:2px 5px; font-size:0.70rem; cursor:pointer;" title="2 impactos (7-8)">2 Daños</button>
                      <button type="button" onclick="rollEscortCounterAttack(9)" class="btn-xs" style="background:#c2410c; color:#fed7aa; border:1px solid #f97316; border-radius:3px; padding:2px 5px; font-size:0.70rem; cursor:pointer;" title="3 impactos (9-10)">3 Daños</button>
                      <button type="button" onclick="rollEscortCounterAttack(11)" class="btn-xs" style="background:#991b1b; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:2px 5px; font-size:0.70rem; cursor:pointer;" title="4 impactos (11)">4 Daños</button>
                      <button type="button" onclick="rollEscortCounterAttack(12)" class="btn-xs" style="background:#581c87; color:#f5d0fe; border:1px solid #a855f7; border-radius:3px; padding:2px 5px; font-size:0.70rem; cursor:pointer;" title="5 impactos (12)">5 Daños</button>
                    </div>
                  </div>
                </div>'''

    # 8. Phase 4: Inundación & Reparación Quick Buttons
    old_p4_flood = '''                <button type="button" class="btn-dice" onclick="rollB7Flooding()" style="width:100%; justify-content:center;">
                  <span id="p4-flooding-button-label">🎲 Tirar Contención de Inundación (1d6)</span>
                </button>'''
    new_p4_flood = '''                <button type="button" class="btn-dice" onclick="rollB7Flooding()" style="width:100%; justify-content:center;">
                  <span id="p4-flooding-button-label">🎲 Tirar Contención de Inundación (1d6)</span>
                </button>
                <div style="display:flex; gap:4px; margin-top:4px;">
                  <button type="button" onclick="rollB7Flooding(2)" class="btn-xs" style="flex:1; background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px; font-size:0.74rem; cursor:pointer; font-weight:bold;" title="Inundación contenida (1-4 en mesa)">✅ Contenida (Mesa 1-4)</button>
                  <button type="button" onclick="rollB7Flooding(5)" class="btn-xs" style="flex:1; background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px; font-size:0.74rem; cursor:pointer; font-weight:bold;" title="Inundación adicional (5-6 en mesa)">⚠️ +1 Inundación (5-6)</button>
                </div>'''

    old_p4_repair = '''                <button type="button" class="btn-dice" onclick="rollB7SystemRepair()" style="width:100%; justify-content:center;">
                  <span id="p4-repair-button-label">🎲 Tirar Reparación del Sistema (1d6)</span>
                </button>'''
    new_p4_repair = '''                <button type="button" class="btn-dice" onclick="rollB7SystemRepair()" style="width:100%; justify-content:center;">
                  <span id="p4-repair-button-label">🎲 Tirar Reparación del Sistema (1d6)</span>
                </button>
                <div style="display:flex; gap:4px; margin-top:4px;">
                  <button type="button" onclick="rollB7SystemRepair(1)" class="btn-xs" style="flex:1; background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px; font-size:0.74rem; cursor:pointer; font-weight:bold;" title="Reparado con éxito en mesa">✅ Reparado (Mesa)</button>
                  <button type="button" onclick="rollB7SystemRepair(6)" class="btn-xs" style="flex:1; background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px; font-size:0.74rem; cursor:pointer; font-weight:bold;" title="Fallo de reparación en mesa">❌ No Reparable (INOP)</button>
                </div>'''

    replacements = [
        ('f1_cap', old_f1_cap, new_f1_cap),
        ('f1_xo', old_f1_xo, new_f1_xo),
        ('f1_eng', old_f1_eng, new_f1_eng),
        ('f2_torp', old_f2_torp, new_f2_torp),
        ('f2_comms', old_f2_comms, new_f2_comms),
        ('f2_net', old_f2_net, new_f2_net),
        ('p2_dice', old_p2_dice, new_p2_dice),
        ('p3_torps', old_p3_torps, new_p3_torps),
        ('p3_escort', old_p3_escort, new_p3_escort),
        ('p4_flood', old_p4_flood, new_p4_flood),
        ('p4_repair', old_p4_repair, new_p4_repair),
    ]

    for name, old, new in replacements:
        if old not in c:
            print(f'ERROR: {name} not found in HTML!')
        else:
            c = c.replace(old, new)
            print(f'OK: {name} updated.')

    with open('app/partials/02_tab_workflow.html', 'w', encoding='utf-8') as f:
        f.write(c)
    print('Finished writing app/partials/02_tab_workflow.html')

if __name__ == '__main__':
    update_workflow_html()
