import json
import re
import shutil

# 1. Clean Spanish HTML
es_html = """<div id="comp-sec-floatplane" class="compendium-section" data-comp-sec="floatplane" data-i18n-managed="true" style="margin-bottom:28px;">
        <div style="border-bottom:2px solid #0284c7; padding-bottom:6px; margin-bottom:16px;">
          <div>
            <h3 style="margin:0; color:#38bdf8; font-family:'Cinzel', serif; font-size:1.15rem; display:flex; align-items:center; gap:8px;">
              <span>✈️</span> <span>8. OPERACIONES DE HIDROAVIÓN EMBARCADO (TABLAS P3 A P6 &amp; REGLA 7.17)</span>
            </h3>
            <div style="font-size:0.86rem; color:#94a3b8; margin-top:4px;">
              Misiones de Reconocimiento Aéreo y Bombardeo (Canal de Panamá) para submarinos equipados con hangar y catapulta (Tipos A, B y Junsen).
            </div>
          </div>
        </div>

        <!-- FILA 1: TABLA P3 & TABLA P6 -->
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px; margin-bottom:16px;">
          
          <!-- TABLA P3: ENCUENTROS DE HIDROAVIÓN -->
          <div style="background:#0f172a; border:2px solid #0284c7; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #0369a1; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="color:#7dd3fc; font-size:0.90rem;">TABLA P3: ENCUENTROS DEL HIDROAVIÓN (2d6)</strong>
                  <span style="font-size:0.84rem; color:#38bdf8; margin-left:6px; background:rgba(2,132,199,0.2); padding:2px 6px; border-radius:3px;">Regla Oficial 7.17</span>
                </div>
              </div>

              <!-- Tabla oficial P3 -->
              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
                  <thead>
                    <tr style="background:#0369a1; color:#f8fafc;">
                      <th style="padding:4px 6px; border:1px solid #0284c7; width:45px;">2d6</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7;">Tránsito</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7;">Reconocimiento</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7; background:#0284c7; color:#fde047;">Objetivo (Recon)</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7;">Objetivo (Bombardeo)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="p3-row-2" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">2</td><td style="color:#64748b;">--</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fde047; font-weight:bold;">Buque Capital</td><td style="color:#fda4af; font-weight:bold;">Avión</td></tr>
                    <tr id="p3-row-3" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">3</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd; font-weight:bold;">Buque de Guerra</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-4" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">4</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Destructor (DD)</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-5" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">5</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd;">Crucero Pesado (CA)</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-6" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">6</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-7" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">7</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-8" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">8</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">Sin Encuentro</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-9" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">9</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Buque</td><td style="color:#93c5fd;">Crucero Pesado (CA)</td><td style="color:#f87171; font-weight:bold;">Antiaéreo (AA)*</td></tr>
                    <tr id="p3-row-10" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">10</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Crucero Ligero (CL)</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-11" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">11</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Grupo de Buques</td><td style="color:#93c5fd; font-weight:bold;">Grupo de Buques</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-12" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">12</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fda4af; font-weight:bold;">Avión</td><td style="color:#fde047; font-weight:bold;">Buque Capital</td><td style="color:#fda4af; font-weight:bold;">Avión*</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style="font-size:0.82rem; color:#94a3b8; margin-top:8px; line-height:1.3; border-top:1px solid #1e293b; padding-top:6px;">
              • <em>Los avistamientos de buques durante misiones de reconocimiento no causan combate naval para el hidroavión, pero aportan valor narrativo y de inteligencia.</em><br>
              • <strong>* Se aplica exclusivamente en misiones de bombardeo en el Canal de Panamá.</strong>
            </div>
          </div>

          <!-- TABLA P6: BOMBARDEO -->
          <div style="background:#0f172a; border:2px solid #ca8a04; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="margin-bottom:8px; border-bottom:1px solid #854d0e; padding-bottom:6px;">
                <strong style="color:#fde047; font-size:0.90rem;">TABLA P6: BOMBARDEO (1d6)</strong>
              </div>

              <div style="font-size:0.84rem; color:#fde68a; margin-bottom:8px;">
                Lanzamiento en el Círculo de Objetivo tras resolver los encuentros:
              </div>

              <!-- Tabla oficial P6 -->
              <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
                <thead>
                  <tr style="background:#854d0e; color:#f8fafc;">
                    <th style="padding:4px 8px; border:1px solid #ca8a04; width:55px; text-align:center;">1d6</th>
                    <th style="padding:4px 8px; border:1px solid #ca8a04;">Resultado (Efecto de Bombardeo)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="p6-row-1-2" class="p6-row" style="border-bottom:1px solid #1e293b;">
                    <td style="padding:6px 8px; text-align:center; font-weight:bold; color:var(--gold-400);">1 - 2</td>
                    <td style="padding:6px 8px; color:#94a3b8; font-weight:bold;">Fallo</td>
                  </tr>
                  <tr id="p6-row-3-5" class="p6-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);">
                    <td style="padding:6px 8px; text-align:center; font-weight:bold; color:var(--gold-400);">3 - 5</td>
                    <td style="padding:6px 8px; color:#fde047; font-weight:bold;">Daño Moderado</td>
                  </tr>
                  <tr id="p6-row-6" class="p6-row" style="border-bottom:1px solid #1e293b;">
                    <td style="padding:6px 8px; text-align:center; font-weight:bold; color:var(--gold-400);">6</td>
                    <td style="padding:6px 8px; color:#4ade80; font-weight:bold;">Daño Severo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="font-size:0.82rem; color:#94a3b8; margin-top:8px; line-height:1.3; border-top:1px solid #1e293b; padding-top:6px;">
              🎯 En el Canal de Panamá, infligir daño moderado o severo completa la misión con honores navales.
            </div>
          </div>

        </div>

        <!-- FILA 2: TABLA P4 (COMBATE AÉREO) & TABLA P5 (FUEGO AA) -->
        <div style="display:grid; grid-template-columns: 3fr 2fr; gap:16px;">
          
          <!-- TABLA P4: COMBATE AÉREO -->
          <div style="background:#0f172a; border:2px solid #ef4444; border-radius:8px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #991b1b; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
              <div>
                <strong style="color:#fca5a5; font-size:0.90rem;">TABLA P4: COMBATE AÉREO DEFENSIVO</strong>
              </div>
              <div style="font-size:0.84rem; color:#fca5a5; background:rgba(239,68,68,0.2); padding:2px 6px; border-radius:3px;">
                1. El caza ataca primero • 2. El hidroavión responde con ametralladora
              </div>
            </div>

            <div style="font-size:0.84rem; color:#cbd5e1; margin-bottom:12px; line-height:1.3;">
              <strong>Reglas de Combate Aéreo:</strong> El combate no es simultáneo y dura un máximo de <strong>3 rondas</strong>. 3 puntos de daño a cualquiera de los aviones lo destruye. Si sigue volando al término de la 3.ª ronda, el hidroavión evade y escapa.
            </div>

            <!-- Matriz de Combate P4 -->
            <div style="overflow-x:auto; margin-bottom:8px;">
              <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
                <thead>
                  <tr>
                    <th rowspan="2" style="background:#1e293b; color:#94a3b8; border:1px solid #475569; padding:4px; font-size:0.82rem; vertical-align:middle;">
                      El hidroavión<br>elige #
                    </th>
                    <th colspan="6" style="background:#991b1b; color:#f8fafc; border:1px solid #ef4444; padding:3px;">
                      ...el caza enemigo tira 1d6:
                    </th>
                  </tr>
                  <tr style="background:#7f1d1d; color:#fde047;">
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">1</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">2</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">3</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">4</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">5</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">6</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="p4-matrix-row-1" style="border-bottom:1px solid #1e293b;">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">1</td>
                    <td id="p4-cell-1-1" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-1-2" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-1-3" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-1-4" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-1-5" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-1-6" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                  </tr>
                  <tr id="p4-matrix-row-2" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">2</td>
                    <td id="p4-cell-2-1" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-2-2" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-2-3" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-2-4" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-2-5" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-2-6" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                  </tr>
                  <tr id="p4-matrix-row-3" style="border-bottom:1px solid #1e293b;">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">3</td>
                    <td id="p4-cell-3-1" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-3-2" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-3-3" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-3-4" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-3-5" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-3-6" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                  </tr>
                  <tr id="p4-matrix-row-4" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">4</td>
                    <td id="p4-cell-4-1" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-4-2" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-4-3" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-4-4" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-4-5" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-4-6" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                  </tr>
                  <tr id="p4-matrix-row-5" style="border-bottom:1px solid #1e293b;">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">5</td>
                    <td id="p4-cell-5-1" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-5-2" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-5-3" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-5-4" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-5-5" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-5-6" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                  </tr>
                  <tr id="p4-matrix-row-6" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">6</td>
                    <td id="p4-cell-6-1" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-6-2" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-6-3" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-6-4" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-6-5" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-6-6" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="font-size:0.80rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
              <div><strong>#</strong> = Impactos al hidroavión | <strong style="color:#4ade80;">E</strong> = ¡Evasión exitosa! Termina el encuentro.</div>
              <div style="color:#7dd3fc;">Ametralladora trasera: <strong>2</strong>=3 impactos (DE) | <strong>3-4</strong>=2 impactos | <strong>5-6</strong>=1 impacto | <strong>7-12</strong>=Fallo</div>
            </div>
          </div>

          <!-- TABLA P5: FUEGO ANTIAÉREO -->
          <div style="background:#0f172a; border:2px solid #f97316; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="margin-bottom:8px; border-bottom:1px solid #c2410c; padding-bottom:6px;">
                <strong style="color:#fdba74; font-size:0.90rem;">TABLA P5: FUEGO ANTIAÉREO (2d6)</strong>
              </div>

              <!-- Tabla oficial P5 -->
              <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
                <thead>
                  <tr style="background:#c2410c; color:#f8fafc;">
                    <th style="padding:4px 6px; border:1px solid #ea580c; width:45px; text-align:center;">Tirada</th>
                    <th style="padding:4px 6px; border:1px solid #ea580c; width:95px; text-align:center;">Resultado</th>
                    <th style="padding:4px 6px; border:1px solid #ea580c;">Efecto y Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="p5-row-2" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">2 - 7</td><td style="padding:3px; text-align:center; color:#94a3b8;">Inefectivo</td><td style="padding:3px; color:#64748b;">Fuego disperso, sin daños al aparato.</td></tr>
                  <tr id="p5-row-8" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">8</td><td style="padding:3px; text-align:center; color:#fde047; font-weight:bold;">1 pt. de Daño</td><td style="padding:3px; color:#fde68a;">Impacto cercano (metralla o roce leve).</td></tr>
                  <tr id="p5-row-9" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">9</td><td style="padding:3px; text-align:center; color:#fb923c; font-weight:bold;">1 pt. de Daño</td><td style="padding:3px; color:#fdba74;">Tira herida en dotación (Tabla B8): 1-3 piloto, 4-6 observador.</td></tr>
                  <tr id="p5-row-10" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">10</td><td style="padding:3px; text-align:center; color:#f87171; font-weight:bold;">2 pts. de Daño</td><td style="padding:3px; color:#fca5a5;">Daño estructural severo en fuselaje o alas.</td></tr>
                  <tr id="p5-row-11" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">11</td><td style="padding:3px; text-align:center; color:#f87171; font-weight:bold;">2 pts. de Daño</td><td style="padding:3px; color:#fdba74;">Tira herida en dotación (Tabla B8): 1-3 piloto, 4-6 observador.</td></tr>
                  <tr id="p5-row-12" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">12</td><td style="padding:3px; text-align:center; color:#b91c1c; font-weight:900; background:rgba(185,28,28,0.25);">3 pts. de Daño</td><td style="padding:3px; color:#fca5a5; font-weight:bold;">¡Impacto directo! ¡Hidroavión destruido en el aire!</td></tr>
                </tbody>
              </table>
            </div>

            <div style="font-size:0.82rem; color:#94a3b8; margin-top:8px; line-height:1.3; border-top:1px solid #1e293b; padding-top:6px;">
              💥 Un hidroavión con 3 puntos de daño acumulados se estrella en el mar.
            </div>
          </div>

        </div>

      </div>"""

# 2. Clean English HTML (100% English, zero Spanish, zero interactive buttons)
en_html = """<div id="comp-sec-floatplane" class="compendium-section" data-comp-sec="floatplane" data-i18n-managed="true" style="margin-bottom:28px;">
        <div style="border-bottom:2px solid #0284c7; padding-bottom:6px; margin-bottom:16px;">
          <div>
            <h3 style="margin:0; color:#38bdf8; font-family:'Cinzel', serif; font-size:1.15rem; display:flex; align-items:center; gap:8px;">
              <span>✈️</span> <span>8. EMBARKED FLOATPLANE OPERATIONS (CHARTS P3 TO P6 &amp; RULE 7.17)</span>
            </h3>
            <div style="font-size:0.86rem; color:#94a3b8; margin-top:4px;">
              Aerial Reconnaissance and Bombing (Panama Canal) missions for catapult-equipped submarines (Types A, B, and Junsen).
            </div>
          </div>
        </div>

        <!-- ROW 1: CHART P3 & CHART P6 -->
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:16px; margin-bottom:16px;">
          
          <!-- CHART P3: FLOATPLANE ENCOUNTERS -->
          <div style="background:#0f172a; border:2px solid #0284c7; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #0369a1; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="color:#7dd3fc; font-size:0.90rem;">CHART P3: FLOATPLANE ENCOUNTERS (2d6)</strong>
                  <span style="font-size:0.84rem; color:#38bdf8; margin-left:6px; background:rgba(2,132,199,0.2); padding:2px 6px; border-radius:3px;">Official Rule 7.17</span>
                </div>
              </div>

              <!-- Official Table P3 -->
              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
                  <thead>
                    <tr style="background:#0369a1; color:#f8fafc;">
                      <th style="padding:4px 6px; border:1px solid #0284c7; width:45px;">2d6</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7;">Transit</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7;">Reconnaissance</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7; background:#0284c7; color:#fde047;">Target (Recon)</th>
                      <th style="padding:4px 6px; border:1px solid #0284c7;">Target (Bombing)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="p3-row-2" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">2</td><td style="color:#64748b;">--</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fde047; font-weight:bold;">Capital Ship</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td></tr>
                    <tr id="p3-row-3" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">3</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd; font-weight:bold;">Warship</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-4" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">4</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Destroyer (DD)</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-5" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">5</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd;">Heavy Cruiser (CA)</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-6" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">6</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-7" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">7</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-8" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">8</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#64748b;">No Encounter</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-9" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">9</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship</td><td style="color:#93c5fd;">Heavy Cruiser (CA)</td><td style="color:#f87171; font-weight:bold;">Anti-Aircraft (AA)*</td></tr>
                    <tr id="p3-row-10" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">10</td><td style="color:#64748b;">--</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Light Cruiser (CL)</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-11" class="p3-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">11</td><td style="color:#64748b;">--</td><td style="color:#93c5fd;">Ship Group</td><td style="color:#93c5fd; font-weight:bold;">Ship Group</td><td style="color:#64748b;">--</td></tr>
                    <tr id="p3-row-12" class="p3-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; font-weight:bold; color:var(--gold-400);">12</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fda4af; font-weight:bold;">Aircraft</td><td style="color:#fde047; font-weight:bold;">Capital Ship</td><td style="color:#fda4af; font-weight:bold;">Aircraft*</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style="font-size:0.82rem; color:#94a3b8; margin-top:8px; line-height:1.3; border-top:1px solid #1e293b; padding-top:6px;">
              • <em>Sightings of ships during reconnaissance missions do not cause naval combat for the floatplane, but provide narrative and intelligence value.</em><br>
              • <strong>* Applies exclusively to bombing missions in the Panama Canal.</strong>
            </div>
          </div>

          <!-- CHART P6: BOMBING -->
          <div style="background:#0f172a; border:2px solid #ca8a04; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="margin-bottom:8px; border-bottom:1px solid #854d0e; padding-bottom:6px;">
                <strong style="color:#fde047; font-size:0.90rem;">CHART P6: BOMBING (1d6)</strong>
              </div>

              <div style="font-size:0.84rem; color:#fde68a; margin-bottom:8px;">
                Drop in Target Circle after resolving encounters:
              </div>

              <!-- Official Table P6 -->
              <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
                <thead>
                  <tr style="background:#854d0e; color:#f8fafc;">
                    <th style="padding:4px 8px; border:1px solid #ca8a04; width:55px; text-align:center;">1d6</th>
                    <th style="padding:4px 8px; border:1px solid #ca8a04;">Result (Bombing Effect)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="p6-row-1-2" class="p6-row" style="border-bottom:1px solid #1e293b;">
                    <td style="padding:6px 8px; text-align:center; font-weight:bold; color:var(--gold-400);">1 - 2</td>
                    <td style="padding:6px 8px; color:#94a3b8; font-weight:bold;">Miss</td>
                  </tr>
                  <tr id="p6-row-3-5" class="p6-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);">
                    <td style="padding:6px 8px; text-align:center; font-weight:bold; color:var(--gold-400);">3 - 5</td>
                    <td style="padding:6px 8px; color:#fde047; font-weight:bold;">Moderate Damage</td>
                  </tr>
                  <tr id="p6-row-6" class="p6-row" style="border-bottom:1px solid #1e293b;">
                    <td style="padding:6px 8px; text-align:center; font-weight:bold; color:var(--gold-400);">6</td>
                    <td style="padding:6px 8px; color:#4ade80; font-weight:bold;">Heavy Damage</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="font-size:0.82rem; color:#94a3b8; margin-top:8px; line-height:1.3; border-top:1px solid #1e293b; padding-top:6px;">
              🎯 In the Panama Canal, inflicting moderate or severe damage completes the mission with naval honors.
            </div>
          </div>

        </div>

        <!-- ROW 2: CHART P4 (AIR COMBAT) & CHART P5 (AA FIRE) -->
        <div style="display:grid; grid-template-columns: 3fr 2fr; gap:16px;">
          
          <!-- CHART P4: AIR COMBAT -->
          <div style="background:#0f172a; border:2px solid #ef4444; border-radius:8px; padding:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid #991b1b; padding-bottom:6px; flex-wrap:wrap; gap:8px;">
              <div>
                <strong style="color:#fca5a5; font-size:0.90rem;">CHART P4: DEFENSIVE AIR COMBAT</strong>
              </div>
              <div style="font-size:0.84rem; color:#fca5a5; background:rgba(239,68,68,0.2); padding:2px 6px; border-radius:3px;">
                1. Fighter attacks first • 2. Floatplane returns fire with machine gun
              </div>
            </div>

            <div style="font-size:0.84rem; color:#cbd5e1; margin-bottom:12px; line-height:1.3;">
              <strong>Air Combat Rules:</strong> Combat is non-simultaneous and lasts up to <strong>3 rounds</strong>. 3 damage points destroys either aircraft. If still flying after round 3, the floatplane evades and escapes.
            </div>

            <!-- Combat Matrix P4 -->
            <div style="overflow-x:auto; margin-bottom:8px;">
              <table style="width:100%; border-collapse:collapse; font-size:0.86rem; text-align:center;">
                <thead>
                  <tr>
                    <th rowspan="2" style="background:#1e293b; color:#94a3b8; border:1px solid #475569; padding:4px; font-size:0.82rem; vertical-align:middle;">
                      Floatplane<br>chooses #
                    </th>
                    <th colspan="6" style="background:#991b1b; color:#f8fafc; border:1px solid #ef4444; padding:3px;">
                      ...enemy fighter rolls 1d6:
                    </th>
                  </tr>
                  <tr style="background:#7f1d1d; color:#fde047;">
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">1</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">2</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">3</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">4</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">5</th>
                    <th style="padding:3px; border:1px solid #ef4444; width:14%;">6</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="p4-matrix-row-1" style="border-bottom:1px solid #1e293b;">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">1</td>
                    <td id="p4-cell-1-1" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-1-2" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-1-3" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-1-4" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-1-5" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-1-6" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                  </tr>
                  <tr id="p4-matrix-row-2" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">2</td>
                    <td id="p4-cell-2-1" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-2-2" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-2-3" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-2-4" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-2-5" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-2-6" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                  </tr>
                  <tr id="p4-matrix-row-3" style="border-bottom:1px solid #1e293b;">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">3</td>
                    <td id="p4-cell-3-1" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-3-2" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-3-3" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-3-4" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-3-5" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-3-6" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                  </tr>
                  <tr id="p4-matrix-row-4" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">4</td>
                    <td id="p4-cell-4-1" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-4-2" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-4-3" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-4-4" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-4-5" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-4-6" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                  </tr>
                  <tr id="p4-matrix-row-5" style="border-bottom:1px solid #1e293b;">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">5</td>
                    <td id="p4-cell-5-1" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-5-2" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-5-3" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-5-4" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-5-5" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                    <td id="p4-cell-5-6" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                  </tr>
                  <tr id="p4-matrix-row-6" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.2);">
                    <td style="background:#1e293b; font-weight:bold; color:var(--gold-400); border:1px solid #475569;">6</td>
                    <td id="p4-cell-6-1" style="padding:4px; border:1px solid #334155; color:#fb923c; font-weight:bold;">2</td>
                    <td id="p4-cell-6-2" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-6-3" style="padding:4px; border:1px solid #334155; color:#4ade80; font-weight:900;">E</td>
                    <td id="p4-cell-6-4" style="padding:4px; border:1px solid #334155; color:#fde047;">1</td>
                    <td id="p4-cell-6-5" style="padding:4px; border:1px solid #334155; color:#94a3b8;">0</td>
                    <td id="p4-cell-6-6" style="padding:4px; border:1px solid #334155; color:#f87171; font-weight:bold;">3</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="font-size:0.80rem; color:#94a3b8; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
              <div><strong>#</strong> = Hits to floatplane | <strong style="color:#4ade80;">E</strong> = Successful evasion! Encounter ends.</div>
              <div style="color:#7dd3fc;">Rear machine gun: <strong>2</strong>=3 hits (DE) | <strong>3-4</strong>=2 hits | <strong>5-6</strong>=1 hit | <strong>7-12</strong>=Miss</div>
            </div>
          </div>

          <!-- CHART P5: ANTI-AIRCRAFT FIRE -->
          <div style="background:#0f172a; border:2px solid #f97316; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="margin-bottom:8px; border-bottom:1px solid #c2410c; padding-bottom:6px;">
                <strong style="color:#fdba74; font-size:0.90rem;">CHART P5: ANTI-AIRCRAFT FIRE (2d6)</strong>
              </div>

              <!-- Official Table P5 -->
              <table style="width:100%; border-collapse:collapse; font-size:0.86rem;">
                <thead>
                  <tr style="background:#c2410c; color:#f8fafc;">
                    <th style="padding:4px 6px; border:1px solid #ea580c; width:45px; text-align:center;">Roll</th>
                    <th style="padding:4px 6px; border:1px solid #ea580c; width:95px; text-align:center;">Result</th>
                    <th style="padding:4px 6px; border:1px solid #ea580c;">Effect and Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr id="p5-row-2" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">2 - 7</td><td style="padding:3px; text-align:center; color:#94a3b8;">Ineffective</td><td style="padding:3px; color:#64748b;">Scattered fire, no damage to aircraft.</td></tr>
                  <tr id="p5-row-8" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">8</td><td style="padding:3px; text-align:center; color:#fde047; font-weight:bold;">1 Damage Point</td><td style="padding:3px; color:#fde68a;">Near miss (shrapnel or light graze).</td></tr>
                  <tr id="p5-row-9" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">9</td><td style="padding:3px; text-align:center; color:#fb923c; font-weight:bold;">1 Damage Point</td><td style="padding:3px; color:#fdba74;">Roll crew casualty (Chart B8): 1-3 pilot, 4-6 observer.</td></tr>
                  <tr id="p5-row-10" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">10</td><td style="padding:3px; text-align:center; color:#f87171; font-weight:bold;">2 Damage Points</td><td style="padding:3px; color:#fca5a5;">Severe structural damage to fuselage or wings.</td></tr>
                  <tr id="p5-row-11" class="p5-row" style="border-bottom:1px solid #1e293b;"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">11</td><td style="padding:3px; text-align:center; color:#f87171; font-weight:bold;">2 Damage Points</td><td style="padding:3px; color:#fdba74;">Roll crew casualty (Chart B8): 1-3 pilot, 4-6 observer.</td></tr>
                  <tr id="p5-row-12" class="p5-row" style="border-bottom:1px solid #1e293b; background:rgba(30,41,59,0.3);"><td style="padding:3px; text-align:center; font-weight:bold; color:var(--gold-400);">12</td><td style="padding:3px; text-align:center; color:#b91c1c; font-weight:900; background:rgba(185,28,28,0.25);">3 Damage Points</td><td style="padding:3px; color:#fca5a5; font-weight:bold;">Direct hit! Floatplane destroyed in the air!</td></tr>
                </tbody>
              </table>
            </div>

            <div style="font-size:0.82rem; color:#94a3b8; margin-top:8px; line-height:1.3; border-top:1px solid #1e293b; padding-top:6px;">
              💥 A floatplane with 3 cumulative damage points crashes into the sea.
            </div>
          </div>

        </div>

      </div>"""

# 3. Update app/partials/06_tab_compendium.html with the clean es_html
with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    tab_comp = f.read()

start_kw = 'id="comp-sec-floatplane"'
start = tab_comp.find(start_kw)
start = tab_comp.rfind('<div', 0, start)
end_kw = 'id="comp-sec-optional"'
end = tab_comp.find(end_kw)
end = tab_comp.rfind('<div', 0, end)

new_tab_comp = tab_comp[:start] + es_html + "\n\n      " + tab_comp[end:]
with open('app/partials/06_tab_compendium.html', 'w', encoding='utf-8') as f:
    f.write(new_tab_comp)
print("✓ Updated app/partials/06_tab_compendium.html with clean es_html (data-i18n-managed=true)")

# 4. Update app/js/compendium_floatplane_i18n.js
es_json = json.dumps(es_html, ensure_ascii=False)
en_json = json.dumps(en_html, ensure_ascii=False)

comp_js_content = f"""// Compendium Bilingual Data for Section 7 (Floatplane Charts P3-P6)
window.COMP_FLOATPLANE_HTML = {{
  es: {es_json},
  en: {en_json}
}};
"""

with open('app/js/compendium_floatplane_i18n.js', 'w', encoding='utf-8') as f:
    f.write(comp_js_content)
print("✓ Updated app/js/compendium_floatplane_i18n.js with 100% clean ES and EN")

# 5. Mirror to app/js/components/compendium_floatplane_i18n.js
shutil.copyfile('app/js/compendium_floatplane_i18n.js', 'app/js/components/compendium_floatplane_i18n.js')
print("✓ Mirrored to app/js/components/compendium_floatplane_i18n.js")
