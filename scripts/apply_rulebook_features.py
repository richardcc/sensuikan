# -*- coding: utf-8 -*-
"""
Script to implement remaining features from Sensuikan KS Rules:
1. Rule 5.2: Official Career Victory Tiers (Compendium & Rogu Bukku).
2. Rule 8.2.9: Submarine vs Submarine Combat & 1d10 Initiative Procedure (Phase 3).
3. Rule 8.4: Following a Convoy or Damaged Ship (Phase 3 Step 5).
4. Rule 8.8: Complete Imperial Awards (Golden Kite 5th Class, Wound Badge, Greater East Asia Medal in Phase 5).
5. Rule 11.0: Optional & Tournament Rules in Compendium (11.1 to 11.8).
"""

def update_workflow_html():
    p = 'app/partials/02_tab_workflow.html'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Add Sub vs Sub Card in Phase 3 Step 1 right below #wf-combat-target-card
    target_card_end = '''              <div id="wf-combat-target-card" style="background:var(--navy-900); padding:10px; border-radius:6px; margin-bottom:8px; border-left:4px solid #ef4444;">
                <div style="font-size:0.75rem; color:var(--slate-400);">Buque / Contacto Generado:</div>
                <div id="wf-target-name" style="font-size:1.1rem; font-weight:800; color:#fff;">SS Steel Seafarer (Freighter)</div>
                <div id="wf-target-sub" style="font-size:0.78rem; color:#94a3b8;">5,700 tons • USA • Small Escort Present</div>
              </div>'''

    sub_card_html = '''              <div id="wf-combat-target-card" style="background:var(--navy-900); padding:10px; border-radius:6px; margin-bottom:8px; border-left:4px solid #ef4444;">
                <div style="font-size:0.75rem; color:var(--slate-400);">Buque / Contacto Generado:</div>
                <div id="wf-target-name" style="font-size:1.1rem; font-weight:800; color:#fff;">SS Steel Seafarer (Freighter)</div>
                <div id="wf-target-sub" style="font-size:0.78rem; color:#94a3b8;">5,700 tons • USA • Small Escort Present</div>
              </div>

              <!-- Rule 8.2.9: Submarine vs Submarine Special Procedure -->
              <div id="wf-sub-vs-sub-card" style="display:none; background:rgba(239,68,68,0.12); border:1px solid #ef4444; border-radius:6px; padding:8px 10px; margin-bottom:8px;">
                <div style="font-weight:bold; color:#fca5a5; font-size:0.80rem; display:flex; align-items:center; gap:6px;">
                  <span>⚡</span> <span>REGLA [8.2.9]: COMBATE SUBMARINO VS SUBMARINO</span>
                </div>
                <p style="font-size:0.74rem; color:#cbd5e1; margin:4px 0 6px 0; line-height:1.35;">
                  Tira 1d10 para iniciativa: <strong>1–3:</strong> Iniciativa tuya (ataca o evita contacto). <strong>4–10:</strong> ¡El submarino enemigo ataca primero con 4 torpedos a media distancia! <em>(Cañón prohibido).</em>
                </p>
                <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap;">
                  <button type="button" class="btn-dice" onclick="rollSubVsSubInitiative()" style="font-size:0.76rem; padding:3px 8px;">🎲 Tirar 1d10</button>
                  <button type="button" class="btn-xs" onclick="setSubVsSubInitiative(true)" style="background:#065f46; color:#a7f3d0; border:1px solid #10b981; border-radius:3px; padding:3px 6px; font-size:0.72rem; cursor:pointer;" title="1-3 en mesa">✅ Iniciativa IJN</button>
                  <button type="button" class="btn-xs" onclick="setSubVsSubInitiative(false)" style="background:#7f1d1d; color:#fecaca; border:1px solid #ef4444; border-radius:3px; padding:3px 6px; font-size:0.72rem; cursor:pointer;" title="4-10 en mesa">⚠️ Sorpresa Enemiga</button>
                </div>
                <div id="wf-sub-initiative-res" style="font-size:0.76rem; font-weight:bold; margin-top:4px;"></div>
              </div>'''

    if target_card_end in c:
        c = c.replace(target_card_end, sub_card_html, 1)
        print("Sub vs Sub card added to 02_tab_workflow.html")

    # 2. Add Rule 8.4 Follow Convoy Button in Step 5 right before Rogu Bukku sync
    old_p3_buttons = '''              <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
                <button id="p3-btn-sync-rogu" type="button" class="action-btn" onclick="logCombatToRoguBukku(true)" style="background:var(--gold-500); color:#0f172a; font-weight:800; border:none; width:100%; justify-content:center;">
                  📋 Registrar / Sincronizar en Rogu Bukku
                </button>'''

    new_p3_buttons = '''              <!-- Rule 8.4: Following a Convoy or Ship -->
              <div style="margin-top:8px; display:flex; gap:6px;">
                <button type="button" id="btn-follow-convoy" onclick="followConvoyNextRound()" class="action-btn" style="flex:1; justify-content:center; border-color:#38bdf8; color:#38bdf8; font-size:0.78rem; padding:5px 8px; font-weight:bold;" title="Regla 8.4: Permanecer en la misma casilla y realizar una segunda ronda de combate contra buques dañados o el convoy">
                  🔄 Seguir Convoy / Buque Dañado [Regla 8.4]
                </button>
              </div>

              <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
                <button id="p3-btn-sync-rogu" type="button" class="action-btn" onclick="logCombatToRoguBukku(true)" style="background:var(--gold-500); color:#0f172a; font-weight:800; border:none; width:100%; justify-content:center;">
                  📋 Registrar / Sincronizar en Rogu Bukku
                </button>'''

    if old_p3_buttons in c:
        c = c.replace(old_p3_buttons, new_p3_buttons, 1)
        print("Rule 8.4 Follow Convoy button added to 02_tab_workflow.html")

    # 3. Add complete Rule 8.8 awards to Phase 5
    old_awards_tbody = '''                    <tr style="border-bottom:1px solid #334155;">
                      <td id="p5-award-golden-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:var(--gold-300);">Orden del Milano Dorado<br><span style="font-size:0.82rem; color:var(--slate-400);">(Kinshi Kunsho - 4.ª clase)</span></td>
                      <td id="p5-award-golden-criteria" style="padding:4px; border:1px solid #334155;">Hundir un Buque Capital o lograr &gt;20,000 t en una sola patrulla.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td id="p5-award-rising-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:#f59e0b;">Orden del Sol Naciente<br><span style="font-size:0.82rem; color:var(--slate-400);">(Kyokujitsu-sho)</span></td>
                      <td id="p5-award-rising-criteria" style="padding:4px; border:1px solid #334155;">Acumular ≥ 20,000 toneladas totales de buques enemigos hundidos.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td id="p5-award-sacred-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:#a7f3d0;">Orden del Tesoro Sagrado<br><span style="font-size:0.82rem; color:var(--slate-400);">(Zuiho-sho)</span></td>
                      <td id="p5-award-sacred-criteria" style="padding:4px; border:1px solid #334155;">Acumular ≥ 15,000 toneladas o completar 3 patrullas exitosas.</td>
                    </tr>
                    <tr>
                      <td id="p5-award-sub-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:#38bdf8;">Insignia de Submarinos<br><span style="font-size:0.82rem; color:var(--slate-400);">(Sensuikan Kisho)</span></td>
                      <td id="p5-award-sub-criteria" style="padding:4px; border:1px solid #334155;">Graduarse en la Escuela de Kure [F1] o 1 patrulla exitosa.</td>
                    </tr>'''

    new_awards_tbody = '''                    <tr style="border-bottom:1px solid #334155;">
                      <td id="p5-award-golden-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:var(--gold-300);">Orden del Milano Dorado (4.ª clase)<br><span style="font-size:0.78rem; color:var(--slate-400);">(Kinshi Kunsho) [8.8.1]</span></td>
                      <td id="p5-award-golden-criteria" style="padding:4px; border:1px solid #334155;">Hundir un Buque Capital o lograr &gt;20.000 t en una sola patrulla. Concede 1 Upgrade.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td style="padding:4px; border:1px solid #334155; font-weight:bold; color:#fde047;">Orden del Milano Dorado (5.ª clase)<br><span style="font-size:0.78rem; color:var(--slate-400);">(Kinshi Kunsho) [8.8.2]</span></td>
                      <td style="padding:4px; border:1px solid #334155;">Hundir un Buque Capital o lograr &gt;15.000 t en una sola patrulla. Concede 1 Upgrade.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td id="p5-award-rising-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:#f59e0b;">Orden del Sol Naciente (8.ª clase)<br><span style="font-size:0.78rem; color:var(--slate-400);">(Kyokujitsu-sho) [8.8.3]</span></td>
                      <td id="p5-award-rising-criteria" style="padding:4px; border:1px solid #334155;">Acumular ≥ 20.000 toneladas totales de buques enemigos hundidos.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td id="p5-award-sacred-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:#a7f3d0;">Orden del Tesoro Sagrado (8.ª clase)<br><span style="font-size:0.78rem; color:var(--slate-400);">(Zuiho-sho) [8.8.4]</span></td>
                      <td id="p5-award-sacred-criteria" style="padding:4px; border:1px solid #334155;">Acumular ≥ 15.000 toneladas o completar 3 patrullas exitosas.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td style="padding:4px; border:1px solid #334155; font-weight:bold; color:#f87171;">Medalla de Herido en Combate<br><span style="font-size:0.78rem; color:var(--slate-400);">(Sensho Kisho) [8.8.5]</span></td>
                      <td style="padding:4px; border:1px solid #334155;">Otorgada al Capitán o dotación al recibir heridas graves (SW) en combate.</td>
                    </tr>
                    <tr style="border-bottom:1px solid #334155;">
                      <td style="padding:4px; border:1px solid #334155; font-weight:bold; color:#e2e8f0;">Medalla Guerra Gran Asia Oriental<br><span style="font-size:0.78rem; color:var(--slate-400);">(Daitoa Senso Jugun Kisho) [8.8.6]</span></td>
                      <td style="padding:4px; border:1px solid #334155;">Completar con éxito al menos 1 patrulla de combate en Dic-1941 o Ene-1942.</td>
                    </tr>
                    <tr>
                      <td id="p5-award-sub-name" style="padding:4px; border:1px solid #334155; font-weight:bold; color:#38bdf8;">Insignia de Submarinos<br><span style="font-size:0.78rem; color:var(--slate-400);">(Sensuikan Kisho) [8.8.7]</span></td>
                      <td id="p5-award-sub-criteria" style="padding:4px; border:1px solid #334155;">Graduarse en la Escuela de Kure [F1] o completar 1 patrulla exitosa.</td>
                    </tr>'''

    if old_awards_tbody in c:
        c = c.replace(old_awards_tbody, new_awards_tbody, 1)
        print("Awards table updated with full 8.8 set in 02_tab_workflow.html")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def update_compendium_html():
    p = 'app/partials/06_tab_compendium.html'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # 1. Align Rule 5.2 table
    old_vic_table = '''              <tr><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">100.000+ t</td><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">AS LEGENDARIO DE LA FLOTA (LEGENDARY FLEET ACE)</td><td style="border:1px solid #334155;">Gran Cordón de la Orden del Sol Naciente</td></tr>
              <tr><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">60.000 – 99.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">VICTORIA DECISIVA (DECISIVE VICTORY)</td><td style="border:1px solid #334155;">Orden del Milano Dorado, 2.ª Clase</td></tr>
              <tr><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">35.000 – 59.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">VICTORIA SUSTANCIAL (SUBSTANTIAL VICTORY)</td><td style="border:1px solid #334155;">Orden del Milano Dorado, 3.ª Clase</td></tr>
              <tr><td style="border:1px solid #334155;">20.000 – 34.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#fde047;">PROMEDIO HISTÓRICO (HISTORICAL AVERAGE)</td><td style="border:1px solid #334155;">Orden del Tesoro Sagrado</td></tr>
              <tr><td style="border:1px solid #334155;">5.000 – 19.999 t</td><td style="border:1px solid #334155; color:#cbd5e1;">RENDIMIENTO MARGINAL (MARGINAL PERFORMANCE)</td><td style="border:1px solid #334155;">Cinta de Mención Naval</td></tr>
              <tr><td style="border:1px solid #334155; color:#94a3b8;">&lt; 5.000 t (Sobrevivió)</td><td style="border:1px solid #334155; color:#94a3b8;">SUPERVIVIENTE (SURVIVOR)</td><td style="border:1px solid #334155;">Cinta de Defensa Naval</td></tr>
              <tr><td style="border:1px solid #334155; color:#f87171;">Hundido en Acción</td><td style="border:1px solid #334155; color:#ef4444; font-weight:bold;">DESAPARECIDO EN COMBATE (LOST IN ACTION)</td><td style="border:1px solid #334155; color:#fca5a5;">Doble Ascenso Póstumo de Rango</td></tr>'''

    new_vic_table = '''              <tr><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">100.000+ t</td><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">VICTORIA DECISIVA (DECISIVE VICTORY) [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Milano Dorado / Élite Legendaria</td></tr>
              <tr><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">50.000 – 99.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">VICTORIA SUSTANCIAL (SUBSTANTIAL VICTORY) [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Milano Dorado, 4.ª Clase</td></tr>
              <tr><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">20.000 – 49.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">VICTORIA MARGINAL (MARGINAL VICTORY) [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Sol Naciente</td></tr>
              <tr><td style="border:1px solid #334155;">10.000 – 19.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#fde047;">EMPATE (DRAW) [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Tesoro Sagrado</td></tr>
              <tr><td style="border:1px solid #334155; color:#f87171;">0 – 9.999 t o Capturado</td><td style="border:1px solid #334155; color:#ef4444; font-weight:bold;">DERROTA (DEFEAT) [Regla 5.2]</td><td style="border:1px solid #334155; color:#94a3b8;">Deshonor y Ruina</td></tr>'''

    if old_vic_table in c:
        c = c.replace(old_vic_table, new_vic_table, 1)
        print("Victory tiers updated in 06_tab_compendium.html")

    # 2. Add Section 7: Reglas Opcionales y Avanzadas [11.0] right before </main>
    optional_rules_section = '''
      <!-- SECTION 7: REGLAS OPCIONALES Y AVANZADAS [REGLA 11.0] -->
      <div id="comp-sec-optional" class="compendium-section" style="margin-bottom:28px;">
        <h3 style="border-bottom:2px solid #eab308; padding-bottom:6px; color:#fde047; font-family:'Cinzel', serif; font-size:1.15rem; display:flex; align-items:center; gap:8px;">
          <span>🎲</span> <span>7. REGLAS OPCIONALES Y AVANZADAS DE CAMPAÑA [REGLAS 11.0 & 8.2.9]</span>
        </h3>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:12px; margin-top:12px;">
          
          <!-- 11.1 & 11.2 -->
          <div style="background:var(--slate-800); border:1px solid #334155; border-radius:8px; padding:12px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-300); font-size:0.92rem;">[11.1] TONELAJE ESTÁNDAR &amp; [11.2] BLANCOS HISTÓRICOS</h4>
            <div style="font-size:0.80rem; color:var(--slate-300); line-height:1.4;">
              <p>• <strong>[11.1] Tonelaje Estándar:</strong> En lugar de tirar en las tablas T1/T2, puedes asignar tonelajes fijos para acelerar la partida: <em>Mercante Pequeño: 3,500 t</em> | <em>Mercante Grande: 7,000 t</em> | <em>Petrolero: 9,000 t</em> (Los buques de guerra y capitales siempre se tiran).</p>
              <p style="margin-top:4px;">• <strong>[11.2] Blancos Históricos Únicos:</strong> Los buques hundidos quedan registrados. Si en una patrulla posterior se obtiene el mismo buque, se repite la tirada: ningún buque puede hundirse dos veces en una carrera.</p>
            </div>
          </div>

          <!-- 11.3 Evasive Maneuvers -->
          <div style="background:var(--slate-800); border:1px solid #334155; border-radius:8px; padding:12px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:0.92rem;">[11.3] MANIOBRAS EVASIVAS</h4>
            <div style="font-size:0.80rem; color:var(--slate-300); line-height:1.4;">
              <p>Al ser detectado por escoltas, el comandante elige en secreto una dirección (1 a 6):<br>
              <strong>1-2:</strong> Izquierda | <strong>3-4:</strong> Derecha | <strong>5-6:</strong> Recto.<br>
              Luego tira 1d6 para la dirección de la escolta:</p>
              <ul style="margin:4px 0 0 16px; padding:0;">
                <li><strong>Dirección distinta:</strong> -1 impacto sufrido en Tabla B5.</li>
                <li><strong>Misma dirección (número distinto):</strong> +1 impacto en Tabla B5.</li>
                <li><strong>Número EXACTO igual:</strong> +3 impactos sufridos.</li>
              </ul>
            </div>
          </div>

          <!-- 11.4 & 11.5 Escort & Air Quality -->
          <div style="background:var(--slate-800); border:1px solid #334155; border-radius:8px; padding:12px;">
            <h4 style="margin:0 0 6px 0; color:#f87171; font-size:0.92rem;">[11.4] CALIDAD DE ESCOLTAS Y [11.5] DE AVIONES</h4>
            <div style="font-size:0.78rem; color:var(--slate-300); line-height:1.35;">
              <table style="width:100%; border-collapse:collapse; margin-top:4px; text-align:center;">
                <tr style="background:#1e293b; color:#fff;"><th style="padding:2px;">Año</th><th style="padding:2px; color:#4ade80;">Green (-1 Hit)</th><th style="padding:2px;">Trained</th><th style="padding:2px; color:#fde047;">Veteran (+1 Hit)</th><th style="padding:2px; color:#f87171;">Elite (+1 Det / +1 Hit)</th></tr>
                <tr><td style="border:1px solid #334155;">1941-42</td><td style="border:1px solid #334155;">1</td><td style="border:1px solid #334155;">2-5</td><td style="border:1px solid #334155;">6</td><td style="border:1px solid #334155;">--</td></tr>
                <tr><td style="border:1px solid #334155;">1943-44</td><td style="border:1px solid #334155;">1</td><td style="border:1px solid #334155;">2-4</td><td style="border:1px solid #334155;">5</td><td style="border:1px solid #334155;">6</td></tr>
                <tr><td style="border:1px solid #334155;">1945</td><td style="border:1px solid #334155;">1</td><td style="border:1px solid #334155;">2-3</td><td style="border:1px solid #334155;">4-5</td><td style="border:1px solid #334155;">6</td></tr>
              </table>
              <p style="margin-top:4px; font-size:0.75rem; color:#94a3b8;">* Los aviones Élite causan 2 bajas automáticas a la tripulación en lugar de 1.</p>
            </div>
          </div>

          <!-- 11.7 Special Abilities Table -->
          <div style="background:var(--slate-800); border:1px solid #334155; border-radius:8px; padding:12px; grid-column:1 / -1;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-400); font-size:0.92rem;">[11.7] TABLA DE HABILIDADES INICIALES DEL CAPITÁN (1d20)</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:6px; font-size:0.76rem; color:#cbd5e1; line-height:1.3;">
              <div><strong>1. Lucky:</strong> Inicia con amuleto "Maneki Neko".</div>
              <div><strong>2. Tracker:</strong> No tira para mantener contacto con convoy.</div>
              <div><strong>3. Capital Ship Killer:</strong> -1 To-Hit contra Buques Capitales.</div>
              <div><strong>4. Teamwork:</strong> Dotación inicia en nivel "Veteran".</div>
              <div><strong>5. Carrier Killer:</strong> -1 To-Hit contra CV y CVE.</div>
              <div><strong>6. Aggressive:</strong> Obligado a atacar buques y reintentar rondas.</div>
              <div><strong>7. Bold:</strong> Pasa a distancia corta con detección en 12.</div>
              <div><strong>8. Skilled:</strong> Dispara proa y popa sin penalización.</div>
              <div><strong>9. Vigilant (XO):</strong> +1 DRM a inmersión de emergencia [A4].</div>
              <div><strong>10. AA Expert:</strong> Artillería AA a -1 DRM permanente.</div>
              <div><strong>11. Leadership:</strong> Tira promoción cada 2 patrullas con éxito.</div>
              <div><strong>12. Tanker Killer:</strong> -1 To-Hit contra Petroleros (T).</div>
              <div><strong>13. Convoy Killer:</strong> -1 To-Hit en encuentros de convoy.</div>
              <div><strong>14. Deck Gun Expert (XO):</strong> -1 DRM a cañón de cubierta.</div>
              <div><strong>15. Straggler Killer:</strong> Puede convertir convoy en blanco aislado 1x.</div>
              <div><strong>16. Political:</strong> Elige su área de patrulla con 1-3 en 1d6.</div>
              <div><strong>17. Midget Sub Expert:</strong> Piloto Ko-Hyoteki inicia con todas las habilidades.</div>
              <div><strong>18. Scrounger:</strong> Elige tipo y mezcla libre de torpedos al zarpar.</div>
              <div><strong>19. Keen Judgment:</strong> Inmune al 1.er daño por exceder Test Depth.</div>
              <div><strong>20. Charismatic:</strong> Reemplazos de oficiales llegan como "Expert".</div>
            </div>
          </div>

        </div>
      </div>
'''

    if '<!-- SECTION 7: REGLAS OPCIONALES' not in c:
        c = c.replace('</div><!-- /#tab-compendium -->', optional_rules_section + '\n    </div><!-- /#tab-compendium -->')
        print("Section 7 Optional Rules added to 06_tab_compendium.html")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def update_phase3_js():
    p = 'app/js/gameflow_phase3.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    sub_functions = '''
// =========================================================================
// RULE 8.2.9: SUBMARINE VS SUBMARINE COMBAT
// =========================================================================
function checkSubVsSubTarget(target) {
  const card = document.getElementById('wf-sub-vs-sub-card');
  if (!card) return;
  const isSub = !!(target && (target.is_sub || target.isSub || (target.name && target.name.startsWith('SS '))));
  card.style.display = isSub ? 'block' : 'none';
  if (isSub) {
    const resEl = document.getElementById('wf-sub-initiative-res');
    if (resEl) resEl.innerHTML = '';
  }
}

function rollSubVsSubInitiative() {
  const isEn = (window.currentLang === 'en');
  const d10 = Math.floor(Math.random() * 10) + 1; // 1 to 10 (10 is 0)
  const playerWins = (d10 <= 3);
  setSubVsSubInitiative(playerWins, d10);
}

function setSubVsSubInitiative(playerWins, rollVal) {
  const isEn = (window.currentLang === 'en');
  const resEl = document.getElementById('wf-sub-initiative-res');
  if (!resEl) return;
  const rollStr = rollVal ? `(🎲 1d10 = [${rollVal}]) ` : '';
  if (playerWins) {
    resEl.style.color = '#34d399';
    resEl.innerHTML = `✅ ${rollStr}<strong>${isEn ? 'IJN INITIATIVE!' : '¡INICIATIVA IJN!'}</strong> ${isEn ? 'You may attack first from medium range, or decline combat safely.' : 'Tienes la iniciativa: puedes atacar primero a media distancia o evitar el contacto.'}`;
    showToast(isEn ? "Sub vs Sub: You hold the initiative!" : "¡Sub vs Sub: Tienes la iniciativa!");
  } else {
    resEl.style.color = '#f87171';
    resEl.innerHTML = `⚠️ ${rollStr}<strong>${isEn ? 'ENEMY ATTACKS FIRST!' : '¡EL ENEMIGO ATACA PRIMERO!'}</strong> ${isEn ? 'US submarine fires a 4-torpedo salvo from medium range at your submarine.' : 'El submarino estadounidense detecta y lanza 4 torpedos contra tu buque a media distancia.'}`;
    showToast(isEn ? "Warning! Enemy submarine fires first salvo!" : "¡Alerta! Submarino enemigo dispara primero.");
  }
}

// =========================================================================
// RULE 8.4: FOLLOWING A CONVOY OR DAMAGED SHIP
// =========================================================================
function followConvoyNextRound() {
  const isEn = (window.currentLang === 'en');
  const target = campaignState.workflow.currentTarget || {};
  const isDamaged = (campaignState.workflow.lastCombatDamage > 0 && !campaignState.workflow.lastCombatIsSunk);

  let success = false;
  let msg = '';

  if (target.type === 'Capital') {
    // Capital ship: Roll 1d6, modified 1 means caught
    const d = Math.floor(Math.random() * 6) + 1;
    success = (d === 1);
    msg = isEn 
      ? `Capital Ship Pursuit (Rule 8.4.2): 🎲 1d6 = [${d}] ➔ ${success ? 'CAUGHT! Additional combat round.' : 'Escaped! Too fast to catch.'}`
      : `Persecución de Buque Capital [8.4.2]: 🎲 1d6 = [${d}] ➔ ${success ? '¡ALCANZADO! 2.ª ronda de combate.' : '¡Escapó! Demasiado rápido.'}`;
  } else {
    // Damaged freighter / escort or convoy: automatic follow
    const d = Math.floor(Math.random() * 6) + 1;
    const isEscorted = (d <= 4);
    success = true;
    msg = isEn
      ? `Convoy Followed [8.4]: 🎲 1d6=[${d}] ➔ Target is ${isEscorted ? 'still escorted' : 'now a STRAGGLER (unescorted)!'}`
      : `Convoy Seguido [8.4]: 🎲 1d6=[${d}] ➔ El blanco está ${isEscorted ? 'aún escoltado' : '¡REZAGADO (sin escolta)!'}`;
  }

  showToast(msg);
  const statusEl = document.getElementById('wf-combat-hit-res');
  if (statusEl) {
    statusEl.innerText = isEn ? "Ready for 2nd Combat Round [Rule 8.4]" : "Listo para 2.ª Ronda de Combate [Regla 8.4]";
  }
  const sinkEl = document.getElementById('wf-combat-sink-status');
  if (sinkEl) {
    sinkEl.innerText = msg;
  }
}
'''

    if 'function checkSubVsSubTarget' not in c:
        c += '\n' + sub_functions
        print("Sub vs Sub and Follow Convoy functions added to gameflow_phase3.js")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def update_tables_js():
    p = 'app/js/tables.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # Hook checkSubVsSubTarget into applyTargetToWorkflow
    old_apply = 'campaignState.workflow.currentTarget = t;\n      const nameEl = document.getElementById(\'wf-target-name\');'
    new_apply = 'campaignState.workflow.currentTarget = t;\n      if (typeof checkSubVsSubTarget === \'function\') checkSubVsSubTarget(t);\n      const nameEl = document.getElementById(\'wf-target-name\');'

    if old_apply in c and 'checkSubVsSubTarget(t)' not in c:
        c = c.replace(old_apply, new_apply, 1)
        print("checkSubVsSubTarget hooked into tables.js")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def update_rogubukku_js():
    p = 'app/js/rogubukku.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    old_tiers = '''      // Career Tier (Bilingual i18n)
      let tier = (typeof t === 'function' ? t('tierCadet') : 'CADET');
      if (totalTonnage >= 100000) tier = (typeof t === 'function' ? t('tierLegendaryAce') : 'LEGENDARY ACE (100k+)');
      else if (totalTonnage >= 60000) tier = (typeof t === 'function' ? t('tierDecisiveAce') : 'DECISIVE ACE (60k+)');
      else if (totalTonnage >= 35000) tier = (typeof t === 'function' ? t('tierFleetAce') : 'FLEET ACE (35k+)');
      else if (totalTonnage >= 20000) tier = (typeof t === 'function' ? t('tierVeteran') : 'VETERAN (20k+)');
      else if (totalTonnage >= 5000) tier = (typeof t === 'function' ? t('tierCombatant') : 'COMBATANT (5k+)');'''

    new_tiers = '''      // Career Victory Tier according to Official Rule [5.2] Determining Victory:
      let tier = (typeof t === 'function' ? t('tierDefeat') : 'DERROTA (0-9k)');
      if (totalTonnage >= 100000) tier = (typeof t === 'function' ? t('tierDecisiveVictory') : 'VICTORIA DECISIVA (100k+)');
      else if (totalTonnage >= 50000) tier = (typeof t === 'function' ? t('tierSubstantialVictory') : 'VICTORIA SUSTANCIAL (50k-99k)');
      else if (totalTonnage >= 20000) tier = (typeof t === 'function' ? t('tierMarginalVictory') : 'VICTORIA MARGINAL (20k-49k)');
      else if (totalTonnage >= 10000) tier = (typeof t === 'function' ? t('tierDraw') : 'EMPATE HISTÓRICO (10k-19k)');'''

    if old_tiers in c:
        c = c.replace(old_tiers, new_tiers, 1)
        print("Official Rule 5.2 victory tiers updated in rogubukku.js")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

def update_i18n_js():
    p = 'app/i18n.js'
    with open(p, 'r', encoding='utf-8') as f:
        c = f.read()

    # Spanish victory tiers
    old_es_tiers = '''    tierLegendaryAce: "AS LEGENDARIO (100k+)",
    tierDecisiveAce: "AS DECISIVO (60k+)",
    tierFleetAce: "AS DE LA FLOTA (35k+)",
    tierVeteran: "VETERANO DE COMBATE (20k+)",
    tierCombatant: "COMBATIENTE (5k+)",
    tierCadet: "CADETE (< 5k)",'''

    new_es_tiers = '''    tierDecisiveVictory: "VICTORIA DECISIVA (100k+) [5.2]",
    tierSubstantialVictory: "VICTORIA SUSTANCIAL (50k-99k) [5.2]",
    tierMarginalVictory: "VICTORIA MARGINAL (20k-49k) [5.2]",
    tierDraw: "EMPATE HISTÓRICO (10k-19k) [5.2]",
    tierDefeat: "DERROTA (0-9.9k) [5.2]",
    tierLegendaryAce: "AS LEGENDARIO (100k+)",
    tierDecisiveAce: "VICTORIA DECISIVA (100k+)",
    tierFleetAce: "VICTORIA SUSTANCIAL (50k+)",
    tierVeteran: "VICTORIA MARGINAL (20k+)",
    tierCombatant: "EMPATE (10k+)",
    tierCadet: "DERROTA (< 10k)",'''

    # English victory tiers
    old_en_tiers = '''    tierLegendaryAce: "LEGENDARY ACE (100k+)",
    tierDecisiveAce: "DECISIVE ACE (60k+)",
    tierFleetAce: "FLEET ACE (35k+)",
    tierVeteran: "VETERAN (20k+)",
    tierCombatant: "COMBATANT (5k+)",
    tierCadet: "CADET (< 5k)",'''

    new_en_tiers = '''    tierDecisiveVictory: "DECISIVE VICTORY (100k+) [5.2]",
    tierSubstantialVictory: "SUBSTANTIAL VICTORY (50k-99k) [5.2]",
    tierMarginalVictory: "MARGINAL VICTORY (20k-49k) [5.2]",
    tierDraw: "DRAW (10k-19k) [5.2]",
    tierDefeat: "DEFEAT (0-9.9k) [5.2]",
    tierLegendaryAce: "LEGENDARY ACE (100k+)",
    tierDecisiveAce: "DECISIVE VICTORY (100k+)",
    tierFleetAce: "SUBSTANTIAL VICTORY (50k+)",
    tierVeteran: "MARGINAL VICTORY (20k+)",
    tierCombatant: "DRAW (10k+)",
    tierCadet: "DEFEAT (< 10k)",'''

    if old_es_tiers in c:
        c = c.replace(old_es_tiers, new_es_tiers, 1)
        print("Spanish victory tier strings updated in i18n.js")
    if old_en_tiers in c:
        c = c.replace(old_en_tiers, new_en_tiers, 1)
        print("English victory tier strings updated in i18n.js")

    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)

if __name__ == '__main__':
    update_workflow_html()
    update_compendium_html()
    update_phase3_js()
    update_tables_js()
    update_rogubukku_js()
    update_i18n_js()
    print("All rulebook features applied successfully.")
