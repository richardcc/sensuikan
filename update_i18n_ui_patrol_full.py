with open('app/js/i18n_ui.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = "if (elPPatrolT) elPPatrolT.innerText = isEn ? \"REGULAR PATROL: CONTACT RESOLUTION (SHIP / AIRCRAFT)\" : \"PATRULLA ORDINARIA: GESTIÓN DE CONTACTOS (SHIP / AIRCRAFT)\";"

replacement = '''if (elPPatrolT) elPPatrolT.innerText = isEn ? "REGULAR PATROL: CONTACT RESOLUTION (SHIP / AIRCRAFT)" : "PATRULLA ORDINARIA: GESTIÓN DE CONTACTOS (SHIP / AIRCRAFT)";
      const elPPatrolBackTrack = document.getElementById('ppatrol-btn-back-track');
      if (elPPatrolBackTrack) elPPatrolBackTrack.innerText = isEn ? "View Transit Track" : "Ver Ruta Trayecto";
      const elPPatrolRules = document.getElementById('ppatrol-rules-pill');
      if (elPPatrolRules) elPPatrolRules.innerText = isEn ? "[Rules 8.1 - 8.2 • Charts A2, A3, A4, T1-T5]" : "[Reglas 8.1 - 8.2 • Tablas A2, A3, A4, T1-T5]";
      const elPPatrolLead = document.getElementById('ppatrol-banner-lead');
      if (elPPatrolLead) elPPatrolLead.innerText = isEn ? "Contact Resolution Center:" : "Centro de Resolución de Contactos:";
      const elPPatrolDesc = document.getElementById('ppatrol-banner-desc');
      if (elPPatrolDesc) elPPatrolDesc.innerText = isEn ? " Resolve box encounters according to their type with full official reference charts." : " Resuelve los encuentros de la casilla según su naturaleza con las tablas visuales completas.";
      const elPPatrolReroll = document.getElementById('ppatrol-btn-reroll-a3');
      if (elPPatrolReroll) elPPatrolReroll.innerText = isEn ? "Roll Contact [A3]" : "Tirar Contacto [A3]";

      // Left Branch: Naval Contact
      const elPPatrolShipT = document.getElementById('ppatrol-ship-title');
      if (elPPatrolShipT) elPPatrolShipT.innerHTML = isEn ? "<span>🚢</span> <span>1. Naval Contact (Ship / Warship / Capital Ship)</span>" : "<span>🚢</span> <span>1. Contacto Naval (Ship / Buque de Guerra / Buque Capital)</span>";
      const elPPatrolShipBadge = document.getElementById('ppatrol-ship-badge');
      if (elPPatrolShipBadge) elPPatrolShipBadge.innerText = isEn ? "Surface" : "Superficie";
      const elPPatrolShipDesc = document.getElementById('ppatrol-ship-desc');
      if (elPPatrolShipDesc) elPPatrolShipDesc.innerHTML = isEn
        ? "Upon rolling <strong>Ship</strong>, <strong>Warship</strong>, or <strong>Capital Ship</strong> on Chart [A3], generate the target vessel using official tables <strong>T1</strong> (Freighter), <strong>T2</strong> (Escorted/Tanker), or <strong>T3</strong> (Warship)."
        : "Al obtener <strong>Ship</strong>, <strong>Warship</strong> o <strong>Capital Ship</strong> en la Tabla [A3], se genera el buque blanco según las tablas oficiales <strong>T1</strong> (Mercante), <strong>T2</strong> (Escoltado/Petrolero) o <strong>T3</strong> (Buque de Guerra).";
      const elPPatrolTgtGenLbl = document.getElementById('ppatrol-target-gen-label');
      if (elPPatrolTgtGenLbl) elPPatrolTgtGenLbl.innerText = isEn ? "Roll Target Determination:" : "Tirar Determinación de Blanco:";
      const elPPatrolShipTypeBadge = document.getElementById('ppatrol-ship-type-badge');
      if (elPPatrolShipTypeBadge) elPPatrolShipTypeBadge.innerText = isEn ? "Official 1d100" : "1d100 Oficial";
      const elPPatrolBtnT1 = document.getElementById('ppatrol-btn-t1');
      if (elPPatrolBtnT1) elPPatrolBtnT1.innerText = isEn ? "Freighter T1" : "Mercante T1";
      const elPPatrolBtnT2 = document.getElementById('ppatrol-btn-t2');
      if (elPPatrolBtnT2) elPPatrolBtnT2.innerText = isEn ? "Escorted T2" : "Escoltado T2";
      const elPPatrolBtnT3 = document.getElementById('ppatrol-btn-t3');
      if (elPPatrolBtnT3) elPPatrolBtnT3.innerText = isEn ? "Warship T3" : "Guerra T3";

      const elPPatrolTgtTblT = document.getElementById('ppatrol-tgt-table-title');
      if (elPPatrolTgtTblT) elPPatrolTgtTblT.innerText = isEn ? "📋 TARGET DETERMINATION SUMMARY CHART" : "📋 TABLA RESUMEN DE DETERMINACIÓN DE BLANCOS";
      const elPPatrolThEnc = document.getElementById('ppatrol-th-tgt-enc');
      if (elPPatrolThEnc) elPPatrolThEnc.innerText = isEn ? "Encounter [A3]" : "Encuentro [A3]";
      const elPPatrolThDie = document.getElementById('ppatrol-th-tgt-die');
      if (elPPatrolThDie) elPPatrolThDie.innerText = isEn ? "1d6 Die" : "Dado 1d6";
      const elPPatrolThChart = document.getElementById('ppatrol-th-tgt-chart');
      if (elPPatrolThChart) elPPatrolThChart.innerText = isEn ? "Target Chart" : "Tabla Blanco";
      const elPPatrolThType = document.getElementById('ppatrol-th-tgt-type');
      if (elPPatrolThType) elPPatrolThType.innerText = isEn ? "Type & Escort" : "Tipo & Escolta";

      const elPPatrolT1Desc = document.getElementById('ppatrol-td-tgt-t1-desc');
      if (elPPatrolT1Desc) elPPatrolT1Desc.innerText = isEn ? "Small Freighter (Unescorted)" : "Mercante pequeño (Sin escolta)";
      const elPPatrolT2Desc = document.getElementById('ppatrol-td-tgt-t2-desc');
      if (elPPatrolT2Desc) elPPatrolT2Desc.innerText = isEn ? "Large Freighter / Tanker (Escorted)" : "Mercante grande / Petrolero (Con escolta)";
      const elPPatrolT3Desc = document.getElementById('ppatrol-td-tgt-t3-desc');
      if (elPPatrolT3Desc) elPPatrolT3Desc.innerText = isEn ? "Destroyer / Cruiser (Escorted)" : "Destructor / Crucero (Con escolta)";
      const elPPatrolT4Desc = document.getElementById('ppatrol-td-tgt-t4-desc');
      if (elPPatrolT4Desc) elPPatrolT4Desc.innerText = isEn ? "Battleship / Aircraft Carrier (Heavy Escort)" : "Acorazado / Portaaviones (Alta escolta)";

      const elPPatrolGoCombat = document.getElementById('ppatrol-lbl-go-combat');
      if (elPPatrolGoCombat) elPPatrolGoCombat.innerText = isEn ? "Engage Tactical Combat with this Target (Phase 3)! ➔" : "¡Entablar Combate Táctico con este Blanco (Fase 3)! ➔";

      // Right Branch: Air Threat
      const elPPatrolAirT = document.getElementById('ppatrol-air-title');
      if (elPPatrolAirT) elPPatrolAirT.innerHTML = isEn ? "<span>✈️</span> <span>2. Air Threat (Aircraft Encounter)</span>" : "<span>✈️</span> <span>2. Amenaza Aérea (Encuentro Aéreo)</span>";
      const elPPatrolAirBadge = document.getElementById('ppatrol-air-badge');
      if (elPPatrolAirBadge) elPPatrolAirBadge.innerText = isEn ? "Air" : "Aéreo";
      const elPPatrolAirDesc = document.getElementById('ppatrol-air-desc');
      if (elPPatrolAirDesc) elPPatrolAirDesc.innerHTML = isEn
        ? "Upon rolling <strong>Aircraft</strong> on Chart [A3], the submarine is spotted from the air. Choose immediately between <strong>Emergency Crash Dive</strong> (Chart A4) or defending on the surface with <strong>Anti-Aircraft Fire</strong> (Chart A2)."
        : "Al obtener <strong>Aircraft</strong> en la Tabla [A3], el submarino es sorprendido desde el aire. Elige de inmediato entre <strong>Inmersión de Emergencia</strong> (Tabla A4) o defenderte en superficie con <strong>Fuego Antiaéreo</strong> (Tabla A2).";

      // Table A4
      const elPPatrolA4T = document.getElementById('ppatrol-a4-table-title');
      if (elPPatrolA4T) elPPatrolA4T.innerText = isEn ? "CHART [A4]: AIRCRAFT ENCOUNTER & CRASH DIVE (2d6)" : "TABLA [A4]: ENCUENTRO AÉREO E INMERSIÓN DE EMERGENCIA (2d6)";
      const elPPatrolBtnA4 = document.getElementById('ppatrol-btn-a4-label');
      if (elPPatrolBtnA4) elPPatrolBtnA4.innerText = isEn ? "Roll [A4]" : "Tirar [A4]";
      const elPPatrolThA4Roll = document.getElementById('ppatrol-th-a4-roll');
      if (elPPatrolThA4Roll) elPPatrolThA4Roll.innerText = isEn ? "Final Roll" : "Tirada Final";
      const elPPatrolThA4Res = document.getElementById('ppatrol-th-a4-result');
      if (elPPatrolThA4Res) elPPatrolThA4Res.innerText = isEn ? "Result" : "Resultado";
      const elPPatrolThA4Eff = document.getElementById('ppatrol-th-a4-effect');
      if (elPPatrolThA4Eff) elPPatrolThA4Eff.innerText = isEn ? "Operational Effect" : "Efecto Operativo";

      const elPPatrolA4R1Res = document.getElementById('ppatrol-td-a4-r1-res');
      if (elPPatrolA4R1Res) elPPatrolA4R1Res.innerText = isEn ? "2 x Air Attacks" : "2 x Ataques Aéreos";
      const elPPatrolA4R1Eff = document.getElementById('ppatrol-td-a4-r1-eff');
      if (elPPatrolA4R1Eff) elPPatrolA4R1Eff.innerText = isEn ? "2 bomb runs + 1 automatic crew injury" : "2 pasadas con bombas + 1 herida automática de dotación";
      const elPPatrolA4R2Res = document.getElementById('ppatrol-td-a4-r2-res');
      if (elPPatrolA4R2Res) elPPatrolA4R2Res.innerText = isEn ? "1 x Air Attack" : "1 x Ataque Aéreo";
      const elPPatrolA4R2Eff = document.getElementById('ppatrol-td-a4-r2-eff');
      if (elPPatrolA4R2Eff) elPPatrolA4R2Eff.innerText = isEn ? "1 bomb run + 1 automatic crew injury" : "1 pasada con bombas + 1 herida automática de dotación";
      const elPPatrolA4R3Res = document.getElementById('ppatrol-td-a4-r3-res');
      if (elPPatrolA4R3Res) elPPatrolA4R3Res.innerText = isEn ? "Successful Crash Dive" : "Inmersión Exitosa";
      const elPPatrolA4R3Eff = document.getElementById('ppatrol-td-a4-r3-eff');
      if (elPPatrolA4R3Eff) elPPatrolA4R3Eff.innerText = isEn ? "Submarine submerged safely. No damage sustained." : "Submarino sumergido a salvo. Sin daños sufridos.";

      const elPPatrolA4DrmYr = document.getElementById('ppatrol-a4-drm-year');
      if (elPPatrolA4DrmYr) elPPatrolA4DrmYr.innerText = isEn ? "★ Year Modifiers (DRM): 1941: +2 | 1942: +1 | 1943: 0 | 1944+: -1" : "★ Modificadores por Año (DRM): 1941: +2 | 1942: +1 | 1943: 0 | 1944+: -1";
      const elPPatrolA4DrmCrewT = document.getElementById('ppatrol-a4-drm-crew-title');
      if (elPPatrolA4DrmCrewT) elPPatrolA4DrmCrewT.innerText = isEn ? "★ Crew & Submarine Modifiers:" : "★ Modificadores de Tripulación y Buque:";
      const elPPatrolA4DrmCrewP1 = document.getElementById('ppatrol-a4-drm-crew-p1');
      if (elPPatrolA4DrmCrewP1) elPPatrolA4DrmCrewP1.innerHTML = isEn
        ? "• Elite Crew: <strong style='color:#86efac;'>+1</strong> | Green Crew: <strong style='color:#f87171;'>-1</strong> | All Crew SW/KIA: <strong style='color:#f87171;'>-1</strong>"
        : "• Dotación Élite: <strong style='color:#86efac;'>+1</strong> | Dotación Novata: <strong style='color:#f87171;'>-1</strong> | Toda la tripulación herida/KIA: <strong style='color:#f87171;'>-1</strong>";
      const elPPatrolA4DrmCrewP2 = document.getElementById('ppatrol-a4-drm-crew-p2');
      if (elPPatrolA4DrmCrewP2) elPPatrolA4DrmCrewP2.innerHTML = isEn
        ? "• Dive planes damaged: <strong style='color:#f87171;'>-1</strong> | Radar equipped: <strong style='color:#86efac;'>+1</strong> | Night: <strong style='color:#86efac;'>+1</strong> | Minelaying/Special: <strong style='color:#f87171;'>-1</strong>"
        : "• Planos inmersión averiados: <strong style='color:#f87171;'>-1</strong> | Radar a bordo: <strong style='color:#86efac;'>+1</strong> | Noche: <strong style='color:#86efac;'>+1</strong> | Minado/Especial: <strong style='color:#f87171;'>-1</strong>";

      // Table A2
      const elPPatrolA2T = document.getElementById('ppatrol-a2-table-title');
      if (elPPatrolA2T) elPPatrolA2T.innerText = isEn ? "CHART [A2]: ANTI-AIRCRAFT DEFENSE (2d6)" : "TABLA [A2]: DEFENSA ANTIAÉREA (2d6)";
      const elPPatrolBtnA2 = document.getElementById('ppatrol-btn-a2-label');
      if (elPPatrolBtnA2) elPPatrolBtnA2.innerText = isEn ? "Roll AA [A2]" : "Tirar AA [A2]";
      const elPPatrolThA2Roll = document.getElementById('ppatrol-th-a2-roll');
      if (elPPatrolThA2Roll) elPPatrolThA2Roll.innerText = isEn ? "2d6 Roll" : "Tirada 2d6";
      const elPPatrolThA2Eff = document.getElementById('ppatrol-th-a2-effect');
      if (elPPatrolThA2Eff) elPPatrolThA2Eff.innerText = isEn ? "Effect against Aircraft" : "Efecto contra Avión";
      const elPPatrolThA2Con = document.getElementById('ppatrol-th-a2-conseq');
      if (elPPatrolThA2Con) elPPatrolThA2Con.innerText = isEn ? "Consequence" : "Consecuencia";

      const elPPatrolA2R1Eff = document.getElementById('ppatrol-td-a2-r1-eff');
      if (elPPatrolA2R1Eff) elPPatrolA2R1Eff.innerText = isEn ? "Aircraft Shot Down!" : "¡Avión Derribado!";
      const elPPatrolA2R1Con = document.getElementById('ppatrol-td-a2-r1-con');
      if (elPPatrolA2R1Con) elPPatrolA2R1Con.innerText = isEn ? "Aircraft destroyed before releasing bombs. Clean victory." : "Avión destruido antes de lanzar bombas. Victoria limpia.";
      const elPPatrolA2R2Eff = document.getElementById('ppatrol-td-a2-r2-eff');
      if (elPPatrolA2R2Eff) elPPatrolA2R2Eff.innerText = isEn ? "Aircraft Damaged" : "Avión Dañado";
      const elPPatrolA2R2Con = document.getElementById('ppatrol-td-a2-r2-con');
      if (elPPatrolA2R2Con) elPPatrolA2R2Con.innerText = isEn ? "Attack aborted. Aircraft retreats damaged." : "Ataque interrumpido. Avión se retira con averías.";
      const elPPatrolA2R3Eff = document.getElementById('ppatrol-td-a2-r3-eff');
      if (elPPatrolA2R3Eff) elPPatrolA2R3Eff.innerText = isEn ? "Miss" : "Fallo (Miss)";
      const elPPatrolA2R3Con = document.getElementById('ppatrol-td-a2-r3-con');
      if (elPPatrolA2R3Con) elPPatrolA2R3Con.innerText = isEn ? "Enemy aircraft bombs the submarine." : "El avión enemigo bombardea el submarino.";
      const elPPatrolA2Fn = document.getElementById('ppatrol-a2-footnote');
      if (elPPatrolA2Fn) elPPatrolA2Fn.innerText = isEn ? "★ Modifiers: 2x AA Guns: -1 | 3x AA Guns: -2 | Veteran/Elite Crew: -1" : "★ Modificadores: 2x Cañones AA: -1 | 3x Cañones AA: -2 | Dotación Veterana/Elite: -1";

      const elPPatrolAirEvaded = document.getElementById('ppatrol-btn-air-evaded');
      if (elPPatrolAirEvaded) elPPatrolAirEvaded.innerText = isEn ? "Aircraft Evaded: Advance Box" : "Avión Evadido: Avanzar Casilla";
      const elPPatrolAirDamaged = document.getElementById('ppatrol-btn-air-damaged');
      if (elPPatrolAirDamaged) elPPatrolAirDamaged.innerText = isEn ? "Damage Taken: Proceed to Damage (Phase 4) ➔" : "Daño Sufrido: Ir a Averías (Fase 4) ➔";

      const elPPatrolPrev = document.getElementById('ppatrol-btn-prev');
      if (elPPatrolPrev) elPPatrolPrev.innerText = isEn ? "Back to Phase 2: Transit" : "Volver a Fase 2: Trayecto";
      const elPPatrolNext = document.getElementById('ppatrol-btn-next');
      if (elPPatrolNext) elPPatrolNext.innerText = isEn ? "Proceed to Phase 3: Tactical Combat ➔" : "Pasar a Fase 3: Combate Táctico ➔";

      // Also update default result boxes if not rolled
      const resA4El = document.getElementById('res-interactive-a4');
      if (resA4El && (resA4El.innerText.includes('Sin tirada') || resA4El.innerText.includes('No crash dive') || resA4El.innerText.includes('Sin ROLL'))) {
        resA4El.innerHTML = `<span style="color:var(--slate-400);">${isEn ? "No crash dive roll in this box." : "Sin tirada de inmersión en esta casilla."}</span>`;
      }
      const resA2El = document.getElementById('res-interactive-a2');
      if (resA2El && (resA2El.innerText.includes('Sin fuego') || resA2El.innerText.includes('No anti-aircraft') || resA2El.innerText.includes('Sin FIRE'))) {
        resA2El.innerHTML = `<span style="color:var(--slate-400);">${isEn ? "No anti-aircraft fire in this box." : "Sin fuego antiaéreo en esta casilla."}</span>`;
      }

      if (typeof updatePatrolPhaseUI === 'function') {
        updatePatrolPhaseUI();
      }'''

if target in code:
    code = code.replace(target, replacement, 1)
    print("Replaced in app/js/i18n_ui.js successfully.")
    with open('app/js/i18n_ui.js', 'w', encoding='utf-8') as f:
        f.write(code)
else:
    print("ERROR: target not found in app/js/i18n_ui.js")
