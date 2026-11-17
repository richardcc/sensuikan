with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    wf = f.read()

idx1 = wf.find('<div id="phase-content-patrol"')
idx2 = wf.find('<!-- PHASE 3: COMBATE TÁCTICO')

new_patrol_block = '''<div id="phase-content-patrol" class="phase-body">
          <div class="phase-header-banner" style="background:linear-gradient(90deg, #1e293b 0%, #0369a1 100%); border-left:4px solid #38bdf8;">
            <h2>
              <span>🔭</span>
              <span id="ppatrol-title">PATRULLA ORDINARIA: GESTIÓN DE CONTACTOS (SHIP / AIRCRAFT)</span>
            </h2>
            <div style="margin-left:auto; display:flex; gap:8px; align-items:center;">
              <span id="ppatrol-badge-zone" style="background:rgba(0,0,0,0.4); border:1px solid #38bdf8; color:#7dd3fc; padding:4px 10px; border-radius:6px; font-weight:700; font-size:0.84rem;">Zona: Casilla de Patrulla</span>
              <button type="button" onclick="setWorkflowPhase(2)" class="action-btn" style="padding:4px 10px; font-size:0.84rem; border-color:#94a3b8; color:#e2e8f0; display:flex; align-items:center; gap:6px;">
                <span>🗺️</span> <span id="ppatrol-btn-back-track">Ver Ruta Trayecto</span>
              </button>
            </div>
            <span id="ppatrol-rules-pill" class="rules-ref-pill">[Reglas 8.1 - 8.2 • Tablas A2, A3, A4, T1-T5]</span>
          </div>

          <!-- Info banner con tirada rápida de contacto -->
          <div style="background:var(--slate-800); border:1px solid var(--slate-700); border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div style="font-size:0.88rem; color:var(--slate-200);">
              <strong id="ppatrol-banner-lead" style="color:#38bdf8;">Centro de Resolución de Contactos:</strong>
              <span id="ppatrol-banner-desc"> Resuelve los encuentros de la casilla según su naturaleza con las tablas visuales completas.</span>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              <button type="button" onclick="rollBoxEncounter()" class="btn-dice" style="padding:6px 12px; font-size:0.82rem;">
                🎲 <span id="ppatrol-btn-reroll-a3">Tirar Contacto [A3]</span>
              </button>
              <div id="ppatrol-current-contact-pill" style="background:#0f172a; border:1px solid var(--gold-600); color:var(--gold-300); padding:4px 12px; border-radius:6px; font-size:0.86rem; font-weight:800;">
                Contacto: Pendiente
              </div>
            </div>
          </div>

          <!-- Dos ramas operativas: SHIP vs AIRCRAFT con sus tablas visuales exactas -->
          <div class="workflow-grid-2">
            
            <!-- RAMA 1: CONTACTO NAVAL / SHIP (CON TABLA T1/T2/T3 VISUAL) -->
            <div class="flow-card" style="border-top:4px solid #10b981; background:linear-gradient(180deg, rgba(16,185,129,0.06) 0%, var(--slate-850) 100%);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h4 id="ppatrol-ship-title" style="color:#34d399; margin:0; display:flex; align-items:center; gap:8px;">
                  <span>🚢</span> <span>1. Contacto Naval (Ship / Buque de Guerra / Buque Capital)</span>
                </h4>
                <span id="ppatrol-ship-badge" class="badge-ship-category" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:700;">Superficie</span>
              </div>
              
              <p id="ppatrol-ship-desc" style="font-size:0.84rem; color:var(--slate-300); line-height:1.45;">
                Al obtener <strong>Ship</strong>, <strong>Warship</strong> o <strong>Capital Ship</strong> en la Tabla [A3], se genera el buque blanco según las tablas oficiales <strong>T1</strong> (Mercante), <strong>T2</strong> (Escoltado/Petrolero) o <strong>T3</strong> (Buque de Guerra).
              </p>

              <!-- Selector de tirada rápida de Blanco -->
              <div style="background:var(--navy-900); border:1px solid #065f46; border-radius:8px; padding:10px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                  <span id="ppatrol-target-gen-label" style="font-size:0.82rem; font-weight:700; color:#6ee7b7;">Tirar Determinación de Blanco:</span>
                  <span id="ppatrol-ship-type-badge" style="font-size:0.74rem; background:#047857; color:#fff; padding:2px 6px; border-radius:3px;">1d100 Oficial</span>
                </div>

                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
                  <button type="button" class="btn-dice" onclick="rollChartT1()" style="flex:1; min-width:110px; font-size:0.78rem; padding:5px 8px; justify-content:center;">
                    🎲 <span id="ppatrol-btn-t1">Mercante T1</span>
                  </button>
                  <button type="button" class="btn-dice" onclick="rollChartT2()" style="flex:1; min-width:110px; font-size:0.78rem; padding:5px 8px; justify-content:center;">
                    🎲 <span id="ppatrol-btn-t2">Escoltado T2</span>
                  </button>
                  <button type="button" class="btn-dice" onclick="rollChartT3()" style="flex:1; min-width:110px; font-size:0.78rem; padding:5px 8px; justify-content:center;">
                    🎲 <span id="ppatrol-btn-t3">Guerra T3</span>
                  </button>
                </div>

                <!-- Tarjeta del Blanco Generado -->
                <div id="ppatrol-ship-result-box" style="background:rgba(0,0,0,0.35); border-left:3px solid #10b981; border-radius:4px; padding:8px 10px; font-size:0.84rem; color:var(--slate-200);">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <strong id="ppatrol-current-tgt-name" style="color:var(--gold-300); font-size:1rem;">Sin blanco asignado</strong>
                    <span id="ppatrol-current-tgt-tonnage" style="font-weight:700; color:#38bdf8;">-- tons</span>
                  </div>
                  <div id="ppatrol-current-tgt-details" style="font-size:0.78rem; color:var(--slate-400); margin-top:2px;">
                    Tira en T1, T2 o T3 para asignar el buque a la ranura táctica.
                  </div>
                </div>
              </div>

              <!-- Tabla de Referencia de Clasificación de Blancos (T1-T5) -->
              <div style="background:var(--navy-900); border:1px solid var(--slate-700); border-radius:8px; padding:10px; margin-bottom:12px;">
                <div id="ppatrol-tgt-table-title" style="font-size:0.80rem; font-weight:700; color:var(--gold-400); margin-bottom:6px; text-transform:uppercase;">
                  📋 Tabla Resumen de Determinación de Blancos
                </div>
                <table style="width:100%; border-collapse:collapse; font-size:0.78rem; text-align:center;">
                  <thead>
                    <tr style="background:#1e293b; color:var(--slate-300);">
                      <th id="ppatrol-th-tgt-enc" style="padding:4px; border:1px solid #334155;">Encuentro [A3]</th>
                      <th id="ppatrol-th-tgt-die" style="padding:4px; border:1px solid #334155;">Dado 1d6</th>
                      <th id="ppatrol-th-tgt-chart" style="padding:4px; border:1px solid #334155;">Tabla Blanco</th>
                      <th id="ppatrol-th-tgt-type" style="padding:4px; border:1px solid #334155;">Tipo & Escolta</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#38bdf8;">Ship / Ship*</td>
                      <td style="border:1px solid #334155;">1 - 4</td>
                      <td style="border:1px solid #334155; font-weight:bold; color:#a7f3d0;">Chart T1</td>
                      <td id="ppatrol-td-tgt-t1-desc" style="border:1px solid #334155; text-align:left; padding-left:6px;">Mercante pequeño (Sin escolta)</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#38bdf8;">Ship / Ship*</td>
                      <td style="border:1px solid #334155;">5 - 6</td>
                      <td style="border:1px solid #334155; font-weight:bold; color:#fde047;">Chart T2</td>
                      <td id="ppatrol-td-tgt-t2-desc" style="border:1px solid #334155; text-align:left; padding-left:6px;">Mercante grande / Petrolero (Con escolta)</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#f87171;">Warship</td>
                      <td style="border:1px solid #334155;">1 - 6</td>
                      <td style="border:1px solid #334155; font-weight:bold; color:#fca5a5;">Chart T3</td>
                      <td id="ppatrol-td-tgt-t3-desc" style="border:1px solid #334155; text-align:left; padding-left:6px;">Destructor / Crucero (Con escolta)</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#eab308;">Capital Ship</td>
                      <td style="border:1px solid #334155;">1 - 6</td>
                      <td style="border:1px solid #334155; font-weight:bold; color:#fde047;">Chart T4 / T5</td>
                      <td id="ppatrol-td-tgt-t4-desc" style="border:1px solid #334155; text-align:left; padding-left:6px;">Acorazado / Portaaviones (Alta escolta)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Botón Entablar Combate -->
              <div style="display:flex; gap:8px;">
                <button type="button" class="action-btn" onclick="triggerEncounterToCombat()" id="ppatrol-btn-go-combat" style="flex:1; justify-content:center; background:#10b981; color:#064e3b; font-weight:800; border:none; padding:10px; font-size:0.92rem; box-shadow:0 4px 12px rgba(16,185,129,0.3);">
                  ⚔️ <span id="ppatrol-lbl-go-combat">¡Entablar Combate Táctico con este Blanco (Fase 3)! ➔</span>
                </button>
              </div>
            </div>

            <!-- RAMA 2: AMENAZA AÉREA / AIRCRAFT (CON TABLAS VISUALES EXACTAS A4 Y A2) -->
            <div class="flow-card" style="border-top:4px solid #ef4444; background:linear-gradient(180deg, rgba(239,68,68,0.06) 0%, var(--slate-850) 100%);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h4 id="ppatrol-air-title" style="color:#f87171; margin:0; display:flex; align-items:center; gap:8px;">
                  <span>✈️</span> <span>2. Amenaza Aérea (Encuentro Aéreo)</span>
                </h4>
                <span id="ppatrol-air-badge" class="badge-air-category" style="background:#7f1d1d; color:#fca5a5; border:1px solid #ef4444; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:700;">Aéreo</span>
              </div>

              <p id="ppatrol-air-desc" style="font-size:0.84rem; color:var(--slate-300); line-height:1.45;">
                Al obtener <strong>Aircraft</strong> en la Tabla [A3], el submarino es sorprendido desde el aire. Elige de inmediato entre <strong>Inmersión de Emergencia</strong> (Tabla A4) o defenderte en superficie con <strong>Fuego Antiaéreo</strong> (Tabla A2).
              </p>

              <!-- TABLA A4 VISUAL: INMERSIÓN DE EMERGENCIA -->
              <div style="background:var(--navy-900); border:1px solid #2563eb; border-radius:8px; padding:10px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <strong style="color:#93c5fd; font-size:0.86rem; display:flex; align-items:center; gap:6px;">
                    <span>🌊</span> <span id="ppatrol-a4-table-title">TABLA [A4]: ENCUENTRO AÉREO E INMERSIÓN DE EMERGENCIA (2d6)</span>
                  </strong>
                  <button type="button" class="btn-dice" onclick="rollInteractiveA4()" style="background:#1e40af; border-color:#3b82f6; font-size:0.76rem; padding:4px 8px;">
                    🎲 <span id="ppatrol-btn-a4-label">Tirar [A4]</span>
                  </button>
                </div>
                
                <table style="width:100%; border-collapse:collapse; font-size:0.76rem; text-align:center; margin-bottom:6px;">
                  <thead>
                    <tr style="background:#1e293b; color:var(--slate-300);">
                      <th id="ppatrol-th-a4-roll" style="padding:4px; border:1px solid #334155; width:90px;">Tirada Final</th>
                      <th id="ppatrol-th-a4-result" style="padding:4px; border:1px solid #334155; width:140px;">Resultado</th>
                      <th id="ppatrol-th-a4-effect" style="padding:4px; border:1px solid #334155; text-align:left;">Efecto Operativo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#ef4444;">&le; 1</td>
                      <td id="ppatrol-td-a4-r1-res" style="border:1px solid #334155; font-weight:bold; color:#ef4444;">2 x Ataques Aéreos</td>
                      <td id="ppatrol-td-a4-r1-eff" style="border:1px solid #334155; text-align:left; padding-left:6px; color:#fca5a5;">2 pasadas con bombas + 1 herida automática de dotación</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#f59e0b;">2 - 5</td>
                      <td id="ppatrol-td-a4-r2-res" style="border:1px solid #334155; font-weight:bold; color:#f59e0b;">1 x Ataque Aéreo</td>
                      <td id="ppatrol-td-a4-r2-eff" style="border:1px solid #334155; text-align:left; padding-left:6px; color:#fde047;">1 pasada con bombas + 1 herida automática de dotación</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#22c55e;">6 - 12</td>
                      <td id="ppatrol-td-a4-r3-res" style="border:1px solid #334155; font-weight:bold; color:#22c55e;">Inmersión Exitosa</td>
                      <td id="ppatrol-td-a4-r3-eff" style="border:1px solid #334155; text-align:left; padding-left:6px; color:#86efac;">Submarino sumergido a salvo. Sin daños sufridos.</td>
                    </tr>
                  </tbody>
                </table>
                <div style="font-size:0.74rem; color:var(--slate-300); margin-top:6px; line-height:1.4;">
                  <div id="ppatrol-a4-drm-year" style="color:#7dd3fc; font-weight:bold;">★ Modificadores por Año (DRM): 1941: +2 | 1942: +1 | 1943: 0 | 1944+: -1</div>
                  <div id="ppatrol-a4-drm-crew-title" style="color:#fde047; font-weight:bold; margin-top:2px;">★ Modificadores de Tripulación y Buque:</div>
                  <span id="ppatrol-a4-drm-crew-p1" style="color:#cbd5e1;">• Dotación Élite: <strong style="color:#86efac;">+1</strong> | Dotación Novata: <strong style="color:#f87171;">-1</strong> | Toda la tripulación herida/KIA: <strong style="color:#f87171;">-1</strong></span><br>
                  <span id="ppatrol-a4-drm-crew-p2" style="color:#cbd5e1;">• Planos inmersión averiados: <strong style="color:#f87171;">-1</strong> | Radar a bordo: <strong style="color:#86efac;">+1</strong> | Noche: <strong style="color:#86efac;">+1</strong> | Minado/Especial: <strong style="color:#f87171;">-1</strong></span>
                </div>
                <div id="res-interactive-a4" style="margin-top:6px; padding:6px 8px; background:rgba(0,0,0,0.3); border-radius:4px; font-size:0.80rem; min-height:22px;">
                  <span style="color:var(--slate-400);">Sin tirada de inmersión en esta casilla.</span>
                </div>
              </div>

              <!-- TABLA A2 VISUAL: FUEGO ANTIAÉREO -->
              <div style="background:var(--navy-900); border:1px solid #7f1d1d; border-radius:8px; padding:10px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <strong style="color:#fca5a5; font-size:0.86rem; display:flex; align-items:center; gap:6px;">
                    <span>💥</span> <span id="ppatrol-a2-table-title">TABLA [A2]: DEFENSA ANTIAÉREA (2d6)</span>
                  </strong>
                  <button type="button" class="btn-dice" onclick="rollInteractiveA2()" style="background:#b91c1c; border-color:#ef4444; font-size:0.76rem; padding:4px 8px;">
                    🎲 <span id="ppatrol-btn-a2-label">Tirar AA [A2]</span>
                  </button>
                </div>
                
                <table style="width:100%; border-collapse:collapse; font-size:0.76rem; text-align:center; margin-bottom:6px;">
                  <thead>
                    <tr style="background:#1e293b; color:var(--slate-300);">
                      <th id="ppatrol-th-a2-roll" style="padding:4px; border:1px solid #334155; width:90px;">Tirada 2d6</th>
                      <th id="ppatrol-th-a2-effect" style="padding:4px; border:1px solid #334155; width:140px;">Efecto contra Avión</th>
                      <th id="ppatrol-th-a2-conseq" style="padding:4px; border:1px solid #334155; text-align:left;">Consecuencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#f87171;">2 - 3</td>
                      <td id="ppatrol-td-a2-r1-eff" style="border:1px solid #334155; font-weight:bold; color:#f87171;">¡Avión Derribado!</td>
                      <td id="ppatrol-td-a2-r1-con" style="border:1px solid #334155; text-align:left; padding-left:6px; color:#86efac;">Avión destruido antes de lanzar bombas. Victoria limpia.</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; font-weight:bold; color:#fbbf24;">4 - 5</td>
                      <td id="ppatrol-td-a2-r2-eff" style="border:1px solid #334155; font-weight:bold; color:#fbbf24;">Avión Dañado</td>
                      <td id="ppatrol-td-a2-r2-con" style="border:1px solid #334155; text-align:left; padding-left:6px; color:#fde047;">Ataque interrumpido. Avión se retira con averías.</td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #334155; color:#94a3b8;">6 - 12</td>
                      <td id="ppatrol-td-a2-r3-eff" style="border:1px solid #334155; color:#94a3b8;">Fallo (Miss)</td>
                      <td id="ppatrol-td-a2-r3-con" style="border:1px solid #334155; text-align:left; padding-left:6px; color:#fca5a5;">El avión enemigo bombardea el submarino.</td>
                    </tr>
                  </tbody>
                </table>
                <div id="ppatrol-a2-footnote" style="font-size:0.72rem; color:var(--slate-400); font-style:italic;">
                  ★ Modificadores: 2x Cañones AA: -1 | 3x Cañones AA: -2 | Dotación Veterana/Elite: -1
                </div>
                <div id="res-interactive-a2" style="margin-top:6px; padding:6px 8px; background:rgba(0,0,0,0.3); border-radius:4px; font-size:0.80rem; min-height:22px;">
                  <span style="color:var(--slate-400);">Sin fuego antiaéreo en esta casilla.</span>
                </div>
              </div>

              <!-- Botones de resolución post-aérea -->
              <div style="display:flex; gap:8px;">
                <button type="button" class="action-btn" onclick="nextPatrolBox(); setWorkflowPhase(2);" style="flex:1; justify-content:center; background:#1e293b; border-color:#64748b; color:#cbd5e1; font-size:0.84rem; padding:8px;">
                  ◀ <span id="ppatrol-btn-air-evaded">Avión Evadido: Avanzar Casilla</span>
                </button>
                <button type="button" class="action-btn" onclick="setWorkflowPhase(4)" style="flex:1; justify-content:center; background:#7f1d1d; border-color:#ef4444; color:#fee2e2; font-size:0.84rem; padding:8px;">
                  💥 <span id="ppatrol-btn-air-damaged">Daño Sufrido: Ir a Averías (Fase 4) ➔</span>
                </button>
              </div>

            </div>

          </div>

          <!-- Quick Navigation Actions Bar -->
          <div class="action-bar-nav" style="margin-top:16px;">
            <button class="btn-step-prev" onclick="setWorkflowPhase(2)">
              ◀ <span id="ppatrol-btn-prev">Volver a Fase 2: Trayecto</span>
            </button>
            <button class="btn-step-next" onclick="setWorkflowPhase(3)">
              <span id="ppatrol-btn-next">Pasar a Fase 3: Combate Táctico ➔</span>
            </button>
          </div>
        </div>'''

wf = wf[:idx1] + new_patrol_block + '\n        ' + wf[idx2:]

with open('app/partials/02_tab_workflow.html', 'w', encoding='utf-8') as f:
    f.write(wf)

print("Saved clean 02_tab_workflow.html with all IDs")
