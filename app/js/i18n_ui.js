// =========================================================================
// SENSUiKAN: DYNAMIC UI DOM LOCALIZATION ENGINE (ES <-> EN)
// Bidirectional UI text replacement for gameflow, chits, and table interfaces.
// =========================================================================

// =========================================================================
    // BIDIRECTIONAL UI TRANSLATION MAP (ES <-> EN)
    // =========================================================================

    function applyLanguage(lang) {
      currentLang = lang || 'es';
      window.currentLang = currentLang;
      localStorage.setItem('sensuikan_user_lang', currentLang);
      document.documentElement.lang = currentLang;

      if (typeof I18N === 'undefined') return;
      const d = I18N[currentLang] || I18N['es'];
      const isEn = (currentLang === 'en');
      

      if (typeof applyKeyedTranslations === 'function') {
        applyKeyedTranslations(document);
      }

      // 1. Header & Navigation IDs
      const elTag = document.getElementById('app-tagline');
      if (elTag && d.appTagline) elTag.innerText = d.appTagline;
      const elFanmade = document.getElementById('app-fanmade-badge');
      if (elFanmade) elFanmade.innerText = isEn ? "UNOFFICIAL FAN-MADE" : "FANMADE NO OFICIAL";
      const elNavWf = document.getElementById('tab-nav-workflow');
      if (elNavWf && d.navWorkflow) elNavWf.innerText = d.navWorkflow;
      const elNavK1 = document.getElementById('tab-nav-chartk1');
      if (elNavK1 && d.navChartK1) elNavK1.innerText = d.navChartK1;
      const elNavRogu = document.getElementById('tab-nav-rogubukku');
      if (elNavRogu && d.navRoguBukku) elNavRogu.innerText = d.navRoguBukku;
      const elNavDock = document.getElementById('tab-nav-dock');
      if (elNavDock && d.navDock) elNavDock.innerText = d.navDock;
      const elSubBoard = document.getElementById('tab-nav-subboard');
      if (elSubBoard) elSubBoard.innerText = isEn ? "📋 Submarine Board" : "📋 Hoja de Submarino";
      if (typeof onSubBoardLanguageChanged === 'function') onSubBoardLanguageChanged(isEn ? 'en' : 'es');
      const elComp = document.getElementById('tab-nav-compendium');
      if (elComp && d.navCompendium) elComp.innerText = d.navCompendium;
      const elNavOpMap = document.getElementById('tab-nav-opmap');
      if (elNavOpMap) elNavOpMap.innerText = isEn ? "🗺️ Operations Map" : "🗺️ Mapa de Operaciones";
      if (typeof applyOperationsMapLanguage === 'function') applyOperationsMapLanguage(isEn);
      const elLang = document.getElementById('lang-label');
      if (elLang) elLang.innerText = isEn ? "🌐 LANG: EN" : "🌐 IDIOMA: ES";
      const aboutLabel = document.getElementById('about-btn-label');
      if (aboutLabel) aboutLabel.innerText = isEn ? "ℹ️ About" : "ℹ️ Acerca de";
      const aboutTitle = document.getElementById('about-modal-title');
      if (aboutTitle) aboutTitle.innerText = isEn ? "ℹ️ About Sensuikan Companion" : "ℹ️ Acerca de Sensuikan Companion";
      const aboutKicker = document.getElementById('about-modal-kicker');
      if (aboutKicker) aboutKicker.innerText = isEn ? "Companion app • Fan-made • Unofficial" : "Companion app • Fan-made • No oficial";
      const aboutCopyright = document.getElementById('about-modal-copyright');
      if (aboutCopyright) aboutCopyright.innerText = isEn ? "© Sensuikan Companion • Fan-made, unofficial" : "© Sensuikan Companion • Fan-made, no oficial";
      const aboutManufacturer = document.getElementById('about-manufacturer-link');
      if (aboutManufacturer) aboutManufacturer.innerText = isEn ? "🌐 Compass Games LLC Official Site ↗" : "🌐 Web Oficial Compass Games ↗";
      const aboutContent = document.getElementById('about-modal-content');
      if (aboutContent) {
        aboutContent.innerHTML = isEn
          ? '<p><strong style="color:#fde047;">Sensuikan Companion</strong> is a fan-made, unofficial companion app for organising and consulting game sessions.</p><p>It is not affiliated with, sponsored by, or endorsed by the game rights holders. It does not replace the original board game, its rules, components, or published materials.</p><p>The original game, rules, artwork, names, trademarks, and other protected materials belong to their respective rights holders. <strong>Compass Games LLC</strong> is the manufacturer/publisher of the original game; visit <a href="https://www.compassgames.com/" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;">compassgames.com</a>.</p><p>This application does not claim ownership of those elements. Always consult the original game and its licensed materials for the complete experience and the authoritative rules.</p>'
          : '<p><strong style="color:#fde047;">Sensuikan Companion</strong> es una companion app fan-made y no oficial para ayudar a organizar y consultar partidas.</p><p>No está afiliada, patrocinada ni respaldada por los titulares del juego. No sustituye el juego de mesa original, sus reglas, componentes ni materiales publicados.</p><p>El juego original, sus reglas, ilustraciones, nombres, marcas y demás materiales protegidos pertenecen a sus respectivos titulares de derechos. <strong>Compass Games LLC</strong> es el fabricante/editor del juego original; visita <a href="https://www.compassgames.com/" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;">compassgames.com</a>.</p><p>Esta aplicación no reclama propiedad sobre esos elementos. Consulta siempre el juego original y sus materiales licenciados para la experiencia completa y la versión válida de las reglas.</p>';
      }
      const elBackup = document.getElementById('lbl-backup');
      if (elBackup && d.backupBtn) elBackup.innerText = d.backupBtn;
      const elLoad = document.getElementById('lbl-load');
      if (elLoad && d.loadBtn) elLoad.innerText = d.loadBtn;
      const elReset = document.getElementById('lbl-reset');
      if (elReset && d.resetBtn) elReset.innerText = d.resetBtn;
      const elLock = document.getElementById('lbl-lock');
      if (elLock && d.lockBtn) elLock.innerText = d.lockBtn;
      const roguLabels = {
        'rogu-btn-add-target-label': isEn ? '➕ Add Target' : '➕ Añadir Blanco',
        'rogu-btn-recalc-label': isEn ? '🔄 Recalculate' : '🔄 Recalcular',
        'rogu-btn-print-label': isEn ? '🖨️ Print' : '🖨️ Imprimir'
      };
      Object.entries(roguLabels).forEach(([id, label]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = label;
      });
      const roguActions = {
        'rogu-btn-add-target': isEn ? 'Register target manually' : 'Registrar blanco manualmente',
        'rogu-btn-recalc': isEn ? 'Recalculate' : 'Recalcular',
        'rogu-btn-print': isEn ? 'Print sheet' : 'Imprimir hoja'
      };
      Object.entries(roguActions).forEach(([id, title]) => {
        const el = document.getElementById(id);
        if (el) el.title = title;
      });

      // 2. Phase step pills
      const elStep0 = document.getElementById('lbl-step0');
      if (elStep0 && d.step0) elStep0.innerText = d.step0;
      const elStepSchool = document.getElementById('lbl-stepschool');
      if (elStepSchool && d.stepSchool) elStepSchool.innerText = d.stepSchool;
      const elStep1 = document.getElementById('lbl-step1');
      if (elStep1 && d.step1) elStep1.innerText = d.step1;
      const elStep2 = document.getElementById('lbl-step2');
      if (elStep2 && d.step2) elStep2.innerText = d.step2;
      const elStepPatrol = document.getElementById('lbl-steppatrol');
      if (elStepPatrol && d.stepPatrol) elStepPatrol.innerText = d.stepPatrol;
      if (typeof applyPatrolLanguage === 'function') applyPatrolLanguage(isEn);
      if (typeof updatePatrolPhaseUI === 'function') updatePatrolPhaseUI();
      const elStep3 = document.getElementById('lbl-step3');
      if (elStep3 && d.step3) elStep3.innerText = d.step3;
      const elStep4 = document.getElementById('lbl-step4');
      if (elStep4 && d.step4) elStep4.innerText = d.step4;
      const elStep5 = document.getElementById('lbl-step5');
      if (elStep5 && d.step5) elStep5.innerText = d.step5;

      // 3. Phase Main Titles
      const elP0T = document.getElementById('p0-title');
      if (elP0T && d.p0Title) elP0T.innerText = d.p0Title;
      const elPSchoolT = document.getElementById('pschool-title');
      if (elPSchoolT && d.pSchoolTitle) elPSchoolT.innerText = d.pSchoolTitle;
      const elP1T = document.getElementById('p1-title');
      if (elP1T && d.p1Title) elP1T.innerText = d.p1Title;
      const elP2T = document.getElementById('p2-title');
      if (elP2T && d.p2Title) elP2T.innerText = d.p2Title;
      const elP3T = document.getElementById('p3-title');
      if (elP3T && d.p3Title) elP3T.innerText = d.p3Title;
      const elP4T = document.getElementById('p4-title');
      if (elP4T && d.p4Title) elP4T.innerText = d.p4Title;
      const elP5T = document.getElementById('p5-title');
      if (elP5T && d.p5Title) elP5T.innerText = d.p5Title;
      const flowLabels = {
        'game-flow-cards-title': isEn ? '🗺️ Operational Sequence Cards' : '🗺️ Cartas de Secuencia Operativa',
        'game-flow-cards-subtitle': isEn ? 'Consult the historical card for each step without leaving Game Flow.' : 'Consulta la carta histórica de cada paso sin salir del Game Flow.',
        'game-flow-cards-all': isEn ? '📚 View in All Charts' : '📚 Ver en Todas las Tablas',
        'game-flow-card-0': isEn ? 'Prepare to Play' : 'Preparar la partida',
        'game-flow-card-1': isEn ? 'Mission Start' : 'Inicio de misión',
        'game-flow-card-2': isEn ? 'Patrol Transit' : 'Tránsito de patrulla',
        'game-flow-card-3': isEn ? 'Encounters' : 'Encuentros',
        'game-flow-card-4': isEn ? 'Patrol Return & Damage' : 'Regreso y averías',
        'game-flow-card-5': isEn ? 'Post-Mission & Refit' : 'Post-misión y Refit',
        'game-flow-copy-0': isEn ? 'Choose submarine and commander. Assign hull number, rank and home base.' : 'Elegir submarino y comandante. Asignar casco, rango y base.',
        'game-flow-copy-1': isEn ? 'Select month and base. Roll A1 to assign the patrol area.' : 'Seleccionar mes y base. Tirar A1 para asignar el área de patrulla.',
        'game-flow-copy-2': isEn ? 'Advance along the track and resolve transit and patrol encounters.' : 'Avanzar por el track y resolver encuentros de tránsito y patrulla.',
        'game-flow-copy-3': isEn ? 'Generate a target, resolve tactical combat and escort reaction.' : 'Generar blanco, resolver combate táctico y reacción de la escolta.',
        'game-flow-copy-4': isEn ? 'Resolve damage, flooding, crew casualties and return to port criteria.' : 'Resolver daños, inundación, bajas y criterios de regreso a base.',
        'game-flow-copy-5': isEn ? 'Record results, calculate refit, promotions and decorations.' : 'Registrar resultados, calcular refit, ascensos y condecoraciones.',
        'comp-flow-card-0': isEn ? 'Prepare to Play' : 'Preparar la partida',
        'comp-flow-card-1': isEn ? 'Mission Start' : 'Inicio de misión',
        'comp-flow-card-2': isEn ? 'Patrol Transit' : 'Tránsito de patrulla',
        'comp-flow-card-3': isEn ? 'Encounters' : 'Encuentros',
        'comp-flow-card-4': isEn ? 'Patrol Return & Damage' : 'Regreso y averías',
        'comp-flow-card-5': isEn ? 'Post-Mission & Refit' : 'Post-misión y Refit',
        'comp-flow-copy-0': isEn ? 'Choose submarine and commander. Assign hull number, rank and home base.' : 'Elegir submarino y comandante. Asignar casco, rango y base.',
        'comp-flow-copy-1': isEn ? 'Select month and base. Roll A1 to assign the patrol area.' : 'Seleccionar mes y base. Tirar A1 para asignar el área de patrulla.',
        'comp-flow-copy-2': isEn ? 'Advance along the track and resolve transit and patrol encounters.' : 'Avanzar por el track y resolver encuentros de tránsito y patrulla.',
        'comp-flow-copy-3': isEn ? 'Generate a target, resolve tactical combat and escort reaction.' : 'Generar blanco, resolver combate táctico y reacción de la escolta.',
        'comp-flow-copy-4': isEn ? 'Resolve damage, flooding, crew casualties and return to port criteria.' : 'Resolver daños, inundación, bajas y criterios de regreso a base.',
        'comp-flow-copy-5': isEn ? 'Record results, calculate refit, promotions and decorations.' : 'Registrar resultados, calcular refit, ascensos y condecoraciones.'
      };
      Object.entries(flowLabels).forEach(([id, label]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = label;
      });

      // 4. Stepper Navigation Action Buttons (Next & Prev)
      const navButtons = {
        'p0-btn-next': isEn ? "🚀 Commission Submarine & Proceed to Naval Schools (Rule 4.8) ➔" : "🚀 Comisionar Submarino y Enviar a Escuelas (Regla 4.8) ➔",
        'pschool-btn-prev': isEn ? "Back to Submarine" : "Volver a Submarino",
        'pschool-btn-next': isEn ? "Complete Training & Proceed to Sortie (Phase 1) ➔" : "Completar Adiestramiento y Pasar a Zarpe (Fase 1) ➔",
        'p1-btn-prev': isEn ? "Back to Naval Schools" : "Volver a Escuelas",
        'p1-btn-next': isEn ? "Sortie towards Phase 2: Navigation ➔" : "Zarpar hacia la Fase 2: Navegación ➔",
        'p2-btn-prev': isEn ? "Back to Phase 1: Sortie" : "Volver a Fase 1: Zarpe",
        'p2-btn-next': isEn ? "Proceed to Patrol: Contact Management ➔" : "Pasar a Patrulla: Gestión de Contactos ➔",
        'ppatrol-btn-prev': isEn ? "Back to Phase 2: Transit" : "Volver a Fase 2: Trayecto",
        'ppatrol-btn-next': isEn ? "Proceed to Phase 3: Tactical Combat ➔" : "Pasar a Fase 3: Combate Táctico ➔",
        'p3-btn-prev-lbl': isEn ? "Back to Patrol" : "Volver a Patrulla",
        'p4-btn-prev': isEn ? "Back to Phase 3: Combat" : "Volver a Fase 3: Combate",
        'p4-btn-next': isEn ? "Return to Base: Phase 5 (Refit) ➔" : "Retornar a Base: Fase 5 (Refit) ➔",
        'p5-btn-prev': isEn ? "Back to Phase 4: Damage" : "Volver a Fase 4: Averías",
        'p5-btn-next': isEn ? "🔄 Start Next Patrol (Phase 1) ➔" : "🔄 Iniciar Siguiente Patrulla (Fase 1) ➔"
      };
      Object.entries(navButtons).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
      });

      if (typeof updateTrayectoCompletionStatus === 'function') {
        updateTrayectoCompletionStatus();
      } else {
        const elP3Btn = document.getElementById('p3-btn-next');
        if (elP3Btn) elP3Btn.innerText = isEn ? "Proceed to Phase 4: Damage Control ➔" : "Pasar a Fase 4: Control de Averías ➔";
      }

      // 5. Compendium Filter Buttons
      const filterKeys = {
        all: isEn ? "All" : "Todas",
        patrol: isEn ? "Patrol (A1-A4)" : "Patrulla (A1-A4)",
        combat: isEn ? "Combat (B1-B12)" : "Combate (B1-B12)",
        targets: isEn ? "🎯 Targets (T1-T5)" : "🎯 Blancos (T1-T5)",
        commander: isEn ? "Commander (H2, K1, F1-F3)" : "Comandante (H2, K1, F1-F3)",
        campaign: isEn ? "Campaign & Refit" : "Campaña y Refit",
        midget: isEn ? "Midget Subs [M5-M9]" : "Minisubmarinos [M5-M9]",
        kaiten: isEn ? "Kaiten [F4, K5, K6]" : "Kaiten [F4, K5, K6]",
        floatplane: isEn ? "Floatplane [P3-P6]" : "Hidroavión [P3-P6]",
        flow: isEn ? "Game Flow cards" : "Cartas de flujo"
      };
      document.querySelectorAll('.comp-filter-btn').forEach(btn => {
        const f = btn.getAttribute('data-filter');
        if (filterKeys[f]) btn.innerText = filterKeys[f];
      });

      // 6. Compendium Section Titles
      const secTitles = {
        'comp-sec-patrol': isEn ? "1. PATROL & ENCOUNTER CHARTS (CHARTS A1 - A4)" : "1. TABLAS DE PATRULLA Y ENCUENTROS (CHARTS A1 - A4)",
        'comp-sec-combat': isEn ? "2. TACTICAL COMBAT CHARTS (CHARTS B1 - B12, H1)" : "2. TABLAS TÁCTICAS DE COMBATE (CHARTS B1 - B12, H1)",
        'comp-sec-targets': isEn ? "3. TARGET SHIP DETERMINATION (CHARTS T1 - T5)" : "3. TABLAS DE DETERMINACIÓN DE BLANCOS (CHARTS T1 - T5)",
        'comp-sec-commander': isEn ? "4. COMMANDER, CREW & TRAINING (CHARTS H2, K1, F1-F3)" : "4. COMANDANTE, TRIPULACIÓN Y ESCUELAS (CHARTS H2, K1, F1-F3)",
        'comp-sec-campaign': isEn ? "5. PORT REFIT & CAMPAIGN VICTORY LEVELS" : "5. REFIT EN PUERTO Y ESCALA DE VICTORIA DE CAMPAÑA",
        'comp-sec-midget': isEn ? "6. KO-HYOTEKI MIDGET SUBMARINE SPECIAL OPERATIONS (CHARTS M5 TO M9)" : "6. OPERACIONES ESPECIALES DE MINISUBMARINOS KO-HYOTEKI (CHARTS M5 A M9)",
        'comp-sec-kaiten': isEn ? "7. KAITEN SUICIDE TORPEDO SPECIAL OPERATIONS (CHARTS F4, K5, K6 & COMBAT)" : "7. OPERACIONES ESPECIALES KAITEN (CHARTS F4, K5, K6 & COMBATE)",
        'comp-sec-floatplane': isEn ? "8. FLOAT-PLANE EMBARKED OPERATIONS (CHARTS P3, P4, P5, P6 & RULE 7.17)" : "8. OPERACIONES DE HIDROAVIÓN EMBARCADO (CHARTS P3, P4, P5, P6 & REGLA 7.17)",
        'comp-sec-optional': isEn ? "9. OPTIONAL & ADVANCED CAMPAIGN RULES [RULES 11.0 & 8.2.9]" : "9. REGLAS OPCIONALES Y AVANZADAS DE CAMPAÑA [REGLAS 11.0 & 8.2.9]",
        'comp-flow-title': isEn ? "🗺️ GAME FLOW SEQUENCE CARDS" : "🗺️ CARTAS DE SECUENCIA DEL GAME FLOW",
        'comp-flow-subtitle': isEn ? "These cards explain the historical game flow. Select one to enlarge it and open its related phase." : "Las cartas explican el flujo histórico de la partida. Pulsa una para ampliarla y abrir directamente la fase relacionada."
      };
      for (const [secId, titleText] of Object.entries(secTitles)) {
        const secEl = document.getElementById(secId);
        if (secEl) {
          const h3 = secEl.querySelector('h3 span:last-child') || secEl.querySelector('h3');
          if (h3) h3.innerText = titleText;
        }
      }

      if (typeof updateWorkflowSubmarineSpecs === 'function') {
        updateWorkflowSubmarineSpecs();
      }

      // 8. Re-render dynamic components
      if (typeof renderSpecialMissionsEvaluationTable === 'function' && typeof campaignState !== 'undefined' && campaignState.workflow) {
        const chit = campaignState.workflow.currentChit || (typeof MISSION_CHITS !== 'undefined' && MISSION_CHITS.length ? MISSION_CHITS[0] : null);
        if (chit) {
          const subKey = campaignState.activeSubKey || 'Type_B_Class';
          renderSpecialMissionsEvaluationTable(chit, subKey, 'wf-special-mission-eval-container');
        }
      }

      if (typeof renderMissionChits === 'function') renderMissionChits();
      if (typeof buildPatrolTable === 'function') buildPatrolTable();
      if (typeof recalculateTotals === 'function') recalculateTotals();
      if (typeof buildSubmarineList === 'function') buildSubmarineList();
      if (typeof selectSubmarine === 'function' && typeof campaignState !== 'undefined' && campaignState.activeSubKey) {
        selectSubmarine(campaignState.activeSubKey);
      }
      if (typeof updateRoguBukkuSubProfile === 'function') updateRoguBukkuSubProfile();
      if (typeof updateBaseDescriptionPill === 'function' && typeof campaignState !== 'undefined') {
        updateBaseDescriptionPill(campaignState.workflow.startingBase || 'Yokosuka');
      }
      
      // 9. Rogu Bukku Footer KPIs & Career Dossier Explicit Updates
      const elFtPatrols = document.getElementById('rogu-ft-total-patrols');
      if (elFtPatrols) elFtPatrols.innerText = isEn ? "TOTAL PATROLS:" : "TOTAL PATRULLAS:";
      const elFtSpcl = document.getElementById('rogu-ft-spcl-missions');
      if (elFtSpcl) elFtSpcl.innerText = isEn ? "SPCL MISSIONS:" : "MISIONES ESPECIALES:";
      const elFtSunk = document.getElementById('rogu-ft-ships-sunk');
      if (elFtSunk) elFtSunk.innerText = isEn ? "SHIPS SUNK:" : "BUQUES HUNDIDOS:";
      const elFtTons = document.getElementById('rogu-ft-total-tonnage');
      if (elFtTons) elFtTons.innerText = isEn ? "TOTAL TONNAGE:" : "TONELAJE TOTAL:";

      const elSubProfTitle = document.getElementById('sub-profile-header-title');
      if (elSubProfTitle) elSubProfTitle.innerText = isEn ? "⚓ IJN PROFILE" : "⚓ PERFIL IJN";

      const elDosTitle = document.getElementById('dossier-main-title');
      if (elDosTitle) elDosTitle.innerText = isEn ? "COMMANDER SERVICE RECORD (職歴・軍歴) • IJN DOSSIER" : "EXPEDIENTE DE SERVICIO DEL COMANDANTE (職歴・軍歴) • IJN DOSSIER";
      const elDosSub = document.getElementById('dossier-sub-title');
      if (elDosSub) elDosSub.innerText = isEn ? "Official Rules 8.8 (Decorations) & 8.9 (Rank Promotions & Command Benefits)" : "Reglas Oficiales 8.8 (Condecoraciones) y 8.9 (Ascensos de Rango y Beneficios de Mando)";
      const elDosRank = document.getElementById('dossier-rank-pill');
      if (elDosRank) elDosRank.innerText = isEn ? "⚓ Rank: Lt. Cdr (少佐)" : "⚓ Rango: Lt. Cdr (少佐)";
      const elDosSch = document.getElementById('dossier-school-pill');
      if (elDosSch) elDosSch.innerText = isEn ? "🎓 Kure School Graduate [F1]" : "🎓 Graduado Escuela Kure [F1]";

      const elBioTitle = document.getElementById('dossier-bio-title');
      if (elBioTitle) elBioTitle.innerHTML = isEn ? "<span>⚓</span> <span>Biography & Command History</span>" : "<span>⚓</span> <span>Biografía e Historial de Mando</span>";
      if (typeof renderCommanderDossier === 'function') {
        renderCommanderDossier();
      }

      const elRanksTitle = document.getElementById('dossier-ranks-title');
      if (elRanksTitle) elRanksTitle.innerHTML = isEn ? "<span>⭐</span> <span>Command Hierarchy & Promotions (Rule 8.9)</span>" : "<span>⭐</span> <span>Jerarquía de Mando y Ascensos (Regla 8.9)</span>";
      const elRanksTh1 = document.getElementById('dossier-ranks-th1');
      if (elRanksTh1) elRanksTh1.innerText = isEn ? "Military Rank (階級)" : "Rango Militar (階級)";
      const elRanksTh2 = document.getElementById('dossier-ranks-th2');
      if (elRanksTh2) elRanksTh2.innerText = isEn ? "Command Benefit & Rules" : "Beneficio de Mando y Reglas";
      const elR1Sub = document.getElementById('dossier-ranks-r1-sub');
      if (elR1Sub) elR1Sub.innerText = isEn ? "Initial Rank (12/41)" : "Rango Inicial (12/41)";
      const elR1Desc = document.getElementById('dossier-ranks-r1-desc');
      if (elR1Desc) elR1Desc.innerText = isEn ? "Standard initial rank without special command abilities." : "Rango inicial estándar sin habilidades especiales de mando.";
      const elR2Sub = document.getElementById('dossier-ranks-r2-sub');
      if (elR2Sub) elR2Sub.innerText = isEn ? "Roll after 12 Months" : "Tirada tras 12 meses";
      const elR2Desc = document.getElementById('dossier-ranks-r2-desc');
      if (elR2Desc) elR2Desc.innerHTML = isEn ? "<strong>Request Destination:</strong> On <code>1</code> on 1d6 at start of patrol, freely choose active patrol area on Chart [A1]." : "<strong>Solicitar Destino:</strong> Con <code>1</code> en 1d6 al inicio de patrulla, elige libremente su área de destino activa en Tabla [A1].";
      const elR3Sub = document.getElementById('dossier-ranks-r3-sub');
      if (elR3Sub) elR3Sub.innerText = isEn ? "Roll after 24 Months" : "Tirada tras 24 meses";
      const elR3Desc = document.getElementById('dossier-ranks-r3-desc');
      if (elR3Desc) elR3Desc.innerHTML = isEn ? "<strong>Request on 1–2 on 1d6</strong> on Chart [A1], and <strong>reduce port repairs by -1 Month</strong> if ≥ 3 Months." : "<strong>Solicitar con 1–2 en 1d6</strong> en Tabla [A1], y <strong>reduce en -1 mes las reparaciones</strong> en puerto si son ≥ 3 meses.";
      const elRanksFoot = document.getElementById('dossier-ranks-footnote');
      if (elRanksFoot) elRanksFoot.innerHTML = isEn ? "🎲 <em>Promotion Roll (8.9.2):</em> Roll 1d6 every 12 months of service. Promotion on <strong>1–4</strong> (Modifiers: -1 if awarded Golden Kite, -1 if sunk ≥5 ships in the year, +1 for each failed patrol). Each promotion awards 1 <strong>Sub Upgrade</strong> improvement." : "🎲 <em>Tirada de Ascenso (8.9.2):</em> Se tira 1d6 cada 12 meses de servicio. Ascenso con <strong>1–4</strong> (Modificadores: -1 si ganó el Milano de Oro, -1 si hundió ≥5 buques en el año, +1 por cada patrulla fallida). Cada ascenso otorga 1 mejora <strong>Sub Upgrade</strong>.";

      const elMedTitle = document.getElementById('dossier-medals-title');
      if (elMedTitle) elMedTitle.innerHTML = isEn ? "<span>🏅</span> <span>Imperial Navy Official Decorations & Medals (Rule 8.8)</span>" : "<span>🏅</span> <span>Condecoraciones y Medallas Oficiales de la Armada Imperial (Regla 8.8)</span>";
      const elMedTh1 = document.getElementById('dossier-medals-th1');
      if (elMedTh1) elMedTh1.innerText = isEn ? "Decoration (勲章)" : "Condecoración (勲章)";
      const elMedTh2 = document.getElementById('dossier-medals-th2');
      if (elMedTh2) elMedTh2.innerText = isEn ? "Official Award Requirement (Rule 8.8)" : "Requisito Oficial de Concesión (Regla 8.8)";
      const elMedTh3 = document.getElementById('dossier-medals-th3');
      if (elMedTh3) elMedTh3.innerText = isEn ? "In-Game Effect" : "Efecto en Juego";
      const elMedTh4 = document.getElementById('dossier-medals-th4');
      if (elMedTh4) elMedTh4.innerText = isEn ? "Status" : "Estado";

      const elMReq1 = document.getElementById('medal-req-1');
      if (elMReq1) elMReq1.innerText = isEn ? "Graduation from Kure Submarine School [F1]." : "Graduación en la Escuela de Submarinos de Kure [F1].";
      const elMEff1 = document.getElementById('medal-eff-1');
      if (elMEff1) elMEff1.innerText = isEn ? "Official submarine commander qualification." : "Acreditación oficial de comandante de sumergible.";
      const elMSt1 = document.getElementById('medal-st-1');
      if (elMSt1) elMSt1.innerHTML = isEn ? '<span style="color:#10b981; font-weight:bold;">✔ Awarded</span>' : '<span style="color:#10b981; font-weight:bold;">✔ Otorgada</span>';

      const elMReq2 = document.getElementById('medal-req-2');
      if (elMReq2) elMReq2.innerText = isEn ? "Complete first war patrol (success or failure)." : "Completar la primera patrulla de guerra (éxito o fracaso).";
      const elMEff2 = document.getElementById('medal-eff-2');
      if (elMEff2) elMEff2.innerText = isEn ? "Campaign war veteran distinction." : "Distinción de veterano de guerra de campaña.";
      const elMSt2 = document.getElementById('medal-st-2');
      if (elMSt2) elMSt2.innerHTML = isEn ? '<span style="color:#94a3b8;">1st Patrol</span>' : '<span style="color:#94a3b8;">1.ª Patrulla</span>';

      const elMReq3 = document.getElementById('medal-req-3');
      if (elMReq3) elMReq3.innerText = isEn ? "Sink 1 Capital Ship or achieve >50,000 t on 1 patrol (Lt. Cdr)." : "Hundir 1 Buque Capital o lograr >50.000 t en 1 patrulla (Lt. Cdr).";
      const elMEff3 = document.getElementById('medal-eff-3');
      if (elMEff3) elMEff3.innerText = isEn ? "-1 permanent to all enemy detection rolls [B4]." : "-1 permanente a todas las tiradas de detección enemiga [B4].";
      const elMSt3 = document.getElementById('medal-st-3');
      if (elMSt3) elMSt3.innerHTML = isEn ? '<span style="color:#94a3b8;">Pending</span>' : '<span style="color:#94a3b8;">Pendiente</span>';

      const elMReq4 = document.getElementById('medal-req-4');
      if (elMReq4) elMReq4.innerText = isEn ? "Sink 1 Capital Ship or 100,000 t accumulated (Commander / Captain)." : "Hundir 1 Buque Capital o 100.000 t acumuladas (Commander / Captain).";
      const elMEff4 = document.getElementById('medal-eff-4');
      if (elMEff4) elMEff4.innerText = isEn ? "-1 permanent to enemy detection [B4] (not cumulative with 5th)." : "-1 permanente a detección enemiga [B4] (no acumulable con 5.ª).";
      const elMSt4 = document.getElementById('medal-st-4');
      if (elMSt4) elMSt4.innerHTML = isEn ? '<span style="color:#94a3b8;">Pending</span>' : '<span style="color:#94a3b8;">Pendiente</span>';

      const elMReq5 = document.getElementById('medal-req-5');
      if (elMReq5) elMReq5.innerText = isEn ? "Reach 12 months active service in campaign (Rule 8.8.4)." : "Alcanzar 12 meses de servicio activo en campaña (Regla 8.8.4).";
      const elMEff5 = document.getElementById('medal-eff-5');
      if (elMEff5) elMEff5.innerText = isEn ? "Merit for prolonged combat service." : "Mérito por servicio prolongado de combate.";
      const elMSt5 = document.getElementById('medal-st-5');
      if (elMSt5) elMSt5.innerHTML = isEn ? '<span style="color:#94a3b8;">12 Months</span>' : '<span style="color:#94a3b8;">12 Meses</span>';

      const elMReq6 = document.getElementById('medal-req-6');
      if (elMReq6) elMReq6.innerText = isEn ? "Reach 24 months active service in campaign (Rule 8.8.3)." : "Alcanzar 24 meses de servicio activo en campaña (Regla 8.8.3).";
      const elMEff6 = document.getElementById('medal-eff-6');
      if (elMEff6) elMEff6.innerText = isEn ? "Distinguished military merit to the Emperor." : "Mérito militar distinguido al Emperador.";
      const elMSt6 = document.getElementById('medal-st-6');
      if (elMSt6) elMSt6.innerHTML = isEn ? '<span style="color:#94a3b8;">24 Months</span>' : '<span style="color:#94a3b8;">24 Meses</span>';

      const elMReq7 = document.getElementById('medal-req-7');
      if (elMReq7) elMReq7.innerText = isEn ? "Suffer serious wound (SW) in combat during a patrol." : "Resultar herido grave (SW) en combate durante una patrulla.";
      const elMEff7 = document.getElementById('medal-eff-7');
      if (elMEff7) elMEff7.innerText = isEn ? "Wounded in action war distinction." : "Distinción de herido de guerra en acto de servicio.";
      const elMSt7 = document.getElementById('medal-st-7');
      if (elMSt7) elMSt7.innerHTML = isEn ? '<span style="color:#94a3b8;">In Combat</span>' : '<span style="color:#94a3b8;">En Combate</span>';

            const elMatFoot = document.getElementById('sub-mat-footnote-desc');
      if (elMatFoot) elMatFoot.style.display = 'none';

      const elCompTitle = document.getElementById('comp-main-title');
      if (elCompTitle) elCompTitle.innerText = isEn ? "📚 MASTER COMPENDIUM OF ALL OFFICIAL CHARTS" : "📚 COMPENDIO GENERAL DE TODAS LAS TABLAS OFICIALES";
      const elCompSub = document.getElementById('comp-main-subtitle');
      if (elCompSub) elCompSub.innerText = isEn ? "All tactical, operational, and campaign charts of Sensuikan (Compass Games)" : "Todas las tablas tácticas, operacionales y de campaña de Sensuikan (Compass Games)";

      const elCompA1Europe = document.getElementById('comp-a1-europe-desc');
      if (elCompA1Europe) {
        elCompA1Europe.innerText = isEn
          ? " Exclusive to long-range cruisers (Types A and B only). Any other submarine class assigned to this box must reroll 2d6 on the table."
          : " Exclusivo para submarinos de gran autonomía (Tipos A y B únicamente). Cualquier otra clase de submarino asignada a esta casilla debe volver a tirar 2d6 en la tabla.";
      }
      const elCompA1Panama = document.getElementById('comp-a1-panama-desc');
      if (elCompA1Panama) {
        elCompA1Panama.innerText = isEn
          ? " Exclusive to floatplane-equipped submarines (I-400 Sen-Toku or Type AM). Submarines without hangar and embarked aircraft must reroll 2d6."
          : " Exclusivo para submarinos equipados con hidroavión de reconocimiento/ataque (I-400 Sen-Toku o Tipo AM). Los submarinos sin hangar e hidroavión embarcado deben volver a tirar 2d6.";
      }

      const elCompA2ColRoll = document.getElementById('comp-a2-col-roll');
      if (elCompA2ColRoll) elCompA2ColRoll.innerText = isEn ? "2d6 Roll" : "Tirada 2d6";
      const elCompA2ColEffect = document.getElementById('comp-a2-col-effect');
      if (elCompA2ColEffect) elCompA2ColEffect.innerText = isEn ? "Effect vs. Aircraft" : "Efecto contra Avión";
      const elCompA2R1 = document.getElementById('comp-a2-r1');
      if (elCompA2R1) elCompA2R1.innerText = isEn ? "Shot Down" : "Derribado";
      const elCompA2R2 = document.getElementById('comp-a2-r2');
      if (elCompA2R2) elCompA2R2.innerText = isEn ? "Damaged" : "Dañado";
      const elCompA2R3 = document.getElementById('comp-a2-r3');
      if (elCompA2R3) elCompA2R3.innerText = isEn ? "Miss" : "Fallo";
      const elCompA2Mod2x = document.getElementById('comp-a2-mod-2x');
      if (elCompA2Mod2x) elCompA2Mod2x.innerText = isEn ? "2x AA Guns" : "2x Cañones AA";
      const elCompA2Mod3x = document.getElementById('comp-a2-mod-3x');
      if (elCompA2Mod3x) elCompA2Mod3x.innerText = isEn ? "3x AA Guns" : "3x Cañones AA";
      const elCompA2ModElite = document.getElementById('comp-a2-mod-elite');
      if (elCompA2ModElite) elCompA2ModElite.innerText = isEn ? "Veteran / Elite Crew" : "Dotación Veterana / Élite";
      const elCompA2ModExpert = document.getElementById('comp-a2-mod-expert');
      if (elCompA2ModExpert) elCompA2ModExpert.innerText = isEn ? "AA Gun Expert" : "Experto en Artillería AA";

      const elCompA4ColTitle = document.getElementById('comp-a4-col-title');
      if (elCompA4ColTitle) elCompA4ColTitle.innerText = isEn ? "AA Attack v. Aircraft" : "Ataque AA vs Avión";
      const elCompA4R1 = document.getElementById('comp-a4-r1');
      if (elCompA4R1) elCompA4R1.innerText = isEn ? "2 x Air Attack" : "2 x Ataque Aéreo";
      const elCompA4R2 = document.getElementById('comp-a4-r2');
      if (elCompA4R2) elCompA4R2.innerText = isEn ? "1 x Air Attack" : "1 x Ataque Aéreo";
      const elCompA4R3 = document.getElementById('comp-a4-r3');
      if (elCompA4R3) elCompA4R3.innerText = isEn ? "Crash Dive" : "Inmersión de Emergencia";
      const elCompA4YrTitle = document.getElementById('comp-a4-year-title');
      if (elCompA4YrTitle) elCompA4YrTitle.innerText = isEn ? "Year Modifiers (DRM)" : "Modificadores por Año (DRM)";
      const elCompA4Inj = document.getElementById('comp-a4-injury-banner');
      if (elCompA4Inj) elCompA4Inj.innerText = isEn ? "Air Attacks automatically result in 1 x Crew Injury" : "Los Ataques Aéreos causan automáticamente 1 Herida de Tripulación";
      const elModGreen = document.getElementById('comp-a4-mod-green');
      if (elModGreen) elModGreen.innerText = isEn ? "Green Crew" : "Dotación Novata";
      const elModElite = document.getElementById('comp-a4-mod-elite');
      if (elModElite) elModElite.innerText = isEn ? "Elite Crew" : "Dotación Élite";
      const elModKiasw = document.getElementById('comp-a4-mod-kiasw');
      if (elModKiasw) elModKiasw.innerText = isEn ? "All Crew KIA/SW" : "Toda la Dotación KIA / SW";
      const elModDive = document.getElementById('comp-a4-mod-diveplane');
      if (elModDive) elModDive.innerText = isEn ? "Dive-plane DMG" : "Timón Inmersión Dañado";
      const elModSpec = document.getElementById('comp-a4-mod-special');
      if (elModSpec) elModSpec.innerText = isEn ? "Minelay / Special Mission" : "Minado / Misión Especial";
      const elModRadar = document.getElementById('comp-a4-mod-radar');
      if (elModRadar) elModRadar.innerText = isEn ? "Radar present" : "Radar presente";

      const elH2Sur = document.getElementById('comp-h2-title-surnames');
      if (elH2Sur) elH2Sur.innerText = isEn ? "SURNAMES" : "APELLIDOS";
      const elH2First = document.getElementById('comp-h2-title-firstnames');
      if (elH2First) elH2First.innerText = isEn ? "FIRST NAMES" : "NOMBRES DE PILA";

      if (typeof renderSubmarinePatrolTrack === 'function' && typeof campaignState !== 'undefined' && campaignState.activeSubKey) {
        renderSubmarinePatrolTrack(campaignState.activeSubKey);
      }

      if (typeof updateBoxDisplay === 'function') updateBoxDisplay();

      // 10. Chart K1 Captain & Crew Skills Mat Bilingual Updates
      applyChartK1Language(isEn);

      // 11. Workflow Phase 3 Tactical Combat Bilingual Updates
      applyPhase3Language(isEn);
      applyCompendiumSection2Language(isEn);
      if (typeof updateAirRaidUI === 'function') updateAirRaidUI();
      if (typeof recalculateRefitTime === 'function') recalculateRefitTime();
      // 12. Workflow Training Schools (Phase 0 / School Tab) Bilingual Updates
      if (typeof buildWorkflowSubClassSelect === 'function') buildWorkflowSubClassSelect();
      if (typeof buildWorkflowMonthSelect === 'function') buildWorkflowMonthSelect();
      applySchoolLanguage(isEn);
      applyPhase1Language(isEn);
      // Apply the shared text catalog after dynamic chart sections have been refreshed.
      if (typeof applyTextTranslations === 'function') {
        applyTextTranslations(currentLang);
      }
      if (typeof updateWorkflowSubmarineSpecs === 'function') updateWorkflowSubmarineSpecs();
      if (typeof updateTorpedoDoctrineDisplay === 'function') updateTorpedoDoctrineDisplay();
      //
      // 13. Submarines Fleet Dock Bilingual Updates
      applyDockLanguage(isEn);
      applyCompendiumLanguage(isEn);
      // Ensure specific phase labels reflect exact authentic wargame terminology
      applyPhase2Language(isEn);
      applyPhase5AwardsLanguage(isEn);
      applyPhase4DamageLanguage(isEn);
      if (typeof applyPatrolLanguage === 'function') applyPatrolLanguage(isEn);
      if (typeof updatePatrolPhaseUI === 'function') updatePatrolPhaseUI();

      function applyPhase2Language(isEn) {
        const labels = {
          'p2-title': isEn ? 'PHASE 2: TRANSIT & ON-STATION NAVIGATION' : 'FASE 2: TRÁNSITO Y NAVEGACIÓN EN ESTACIÓN',
          'p2-guide-label': isEn ? '📋 Phase Guide' : '📋 Guía de Fase',
          'p2-rules-pill': isEn ? '[Rules 6.0 Step 2, 8.1 • Chart A3 / B11]' : '[Reglas 6.0 Paso 2, 8.1 • Tabla A3 / B11]',
          'p2-route-title': isEn ? 'Adaptive Operational Route by Destination and Submarine' : 'Ruta Operativa Adaptativa según Destino y Submarino',
          'p2-c1-title': isEn ? '1. Navigation Box Progress' : '1. Progreso de Casillas de Navegación',
          'p2-current-box-label': isEn ? 'Current Box:' : 'Casilla Actual:',
          'p2-btn-back': isEn ? '◀ Go Back' : '◀ Retroceder',
          'p2-btn-advance': isEn ? 'Advance Box ▶' : 'Avanzar Casilla ▶',
          'p2-transit-rule-hint': isEn ? '★ Until July 1942: No ordinary encounters occur in Transit Boxes (only a natural 12 triggers a Random Event). From August 1942 onward, ordinary encounters apply.' : '★ Hasta julio de 1942: No hay encuentros ordinarios en casillas de tránsito (solo un 12 natural activa un Suceso Aleatorio). Desde agosto de 1942 se aplican encuentros ordinarios.',
          'p2-c2-title': isEn ? '2. Encounter Roll on Chart [A3]' : '2. Tirada de Encuentros en Tabla [A3]',
          'p2-encounter-help': isEn ? 'Roll 2d6 in each On-Station or Transit Box:' : 'Lanza 2d6 en cada casilla de estación o tránsito:',
          'p2-roll-result-label': isEn ? '2d6 Result:' : 'Resultado 2d6:',
          'p2-roll-btn': isEn ? '🎲 Roll 2d6 [A3]' : '🎲 Tirar 2d6 [A3]',
          'p2-status-label': isEn ? 'Status:' : 'Estado:',
          'p2-c3-title': isEn ? '3. Mission Box and Events' : '3. Casilla de Misión y Eventos',
          'p2-mission-box-label': isEn ? 'Mission Box:' : 'Casilla de Misión:',
          'p2-mission-box-help': isEn ? 'The first Box that is not Transit activates the Special Mission:' : 'La primera casilla que no es de tránsito activa la Misión Especial:',
          'p2-mission-midget': isEn ? 'Midget Submarines (Maps M1-M7)' : 'Mini-Submarinos (Mapas M1-M7)',
          'p2-mission-air': isEn ? 'Air Reconnaissance (Charts P1-P6)' : 'Reconocimiento Aéreo (Tablas P1-P6)',
          'p2-mission-kaiten': isEn ? 'Kaiten Launch (Maps K2-K3)' : 'Lanzamiento Kaiten (Mapas K2-K3)',
          'p2-mission-mine': isEn ? 'Mining or Tokyo Express Transport' : 'Minado o Transporte Tokio Express',
          'p2-rule-818-label': isEn ? 'Rule 8.1.8:' : 'Regla 8.1.8:',
          'p2-rule-818-text': isEn ? 'A natural 12 triggers a <em>Random Event [Chart B11]</em> (maximum 1 per patrol).' : 'Un 12 natural activa un <em>Suceso Aleatorio [Tabla B11]</em> (máximo 1 por patrulla).',
          'p2-a3-roll-header': isEn ? '2d6 Roll' : 'Tirada 2d6',
          'p2-a3-effect-header': isEn ? 'Tactical Effect / Procedure' : 'Efecto Táctico / Procedimiento',
          'p2-a2-title': isEn ? 'Chart A2: Transit Rule (Transit Encounters):' : 'Tabla A2: Regla Operativa de Tránsito (Encuentros de Tránsito):',
          'p2-a2-text': isEn ? 'Until July 1942: Transit Boxes have no ordinary encounters (only a natural 12 triggers Event B11). From August 1942 onward, use the ordinary encounters in the Transit column. Any detected contact is resolved in the Patrol tab.' : 'Hasta julio de 1942: Las casillas de tránsito no tienen encuentros ordinarios (solo un 12 natural activa el Suceso B11). Desde agosto de 1942 se aplican los encuentros ordinarios de la columna de Tránsito. Cualquier contacto detectado se resuelve en la pestaña Patrulla.',
          'p2-btn-next': isEn ? 'Proceed to Patrol: Contact Management ➔' : 'Pasar a Patrulla: Gestión de Contactos ➔',
          'p2-a3-title': isEn ? 'CHART A3: PATROL AREA ENCOUNTERS (2d6)' : 'TABLA A3: ENCUENTROS EN EL ÁREA DE PATRULLA (2d6)',
          'p2-a3-subtitle': isEn ? 'Contact chart by operational area. Roll 2d6 when entering each Patrol or Transit Box.' : 'Tabla de contactos por zona de operaciones. Lanza 2d6 al entrar en cada casilla de patrulla o tránsito.'
        };
        Object.keys(labels).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = labels[id];
        });
        const guide = document.querySelector('#tab-phase2 .action-btn');
        if (guide) {
          const label = guide.querySelector('span:last-child');
          if (label) label.innerText = isEn ? 'Phase Guide' : 'Guía de Fase';
        }

        const combat = document.getElementById('btn-engage-combat');
        if (combat && !combat.dataset.dynamicLabel) combat.dataset.dynamicLabel = 'true';
        if (typeof updatePhase2TableDisplay === 'function') updatePhase2TableDisplay();
      }

      function applyPatrolLanguage(isEn) {
        if (typeof window !== 'undefined') window.applyPatrolLanguage = applyPatrolLanguage;
        const labels = {
          'lbl-steppatrol': isEn ? "Aircraft Encounter" : "Encuentro con Aviones",
          'ppatrol-title': isEn ? "AIRCRAFT ENCOUNTER [RULE 8.3]" : "ENCUENTRO CON AVIONES [REGLA 8.3]",
          'ppatrol-btn-back-track': isEn ? "View Transit Track" : "Ver Ruta Trayecto",
          'ppatrol-rules-pill': isEn ? "[Rules 8.1 - 8.2 • Charts A2, A3, A4, T1-T5]" : "[Reglas 8.1 - 8.2 • Tablas A2, A3, A4, T1-T5]",
          'ppatrol-active-contact-label': isEn ? "Active Box Contact:" : "Contacto Detectado en Casilla:",
          'ppatrol-ship-badge': isEn ? "Surface" : "Superficie",
          'ppatrol-target-gen-label': isEn ? "Target Determination Roll:" : "Tirar Determinación de Blanco:",
          'ppatrol-lbl-manual-t': isEn ? "Tabletop (1d100):" : "Mesa (1d100):",
          'ppatrol-ship-type-badge': isEn ? "Official 1d100" : "1d100 Oficial",
          'ppatrol-btn-t1': isEn ? "Freighter T1" : "Mercante T1",
          'ppatrol-btn-t2': isEn ? "Escorted T2" : "Escoltado T2",
          'ppatrol-btn-t3': isEn ? "Warship T3" : "Guerra T3",
          'ppatrol-tgt-table-title': isEn ? "📋 TARGET DETERMINATION SUMMARY CHART" : "📋 TABLA RESUMEN DE DETERMINACIÓN DE BLANCOS",
          'ppatrol-th-tgt-enc': isEn ? "Encounter [A3]" : "Encuentro [A3]",
          'ppatrol-th-tgt-die': isEn ? "1d6 Die" : "Dado 1d6",
          'ppatrol-th-tgt-chart': isEn ? "Target Chart" : "Tabla Blanco",
          'ppatrol-th-tgt-type': isEn ? "Type & Escort" : "Tipo & Escolta",
          'ppatrol-td-tgt-t1-chart': isEn ? "Chart T1" : "Tabla T1",
          'ppatrol-td-tgt-t1-desc': isEn ? "Small Freighter (Unescorted)" : "Mercante pequeño (Sin escolta)",
          'ppatrol-td-tgt-t2-chart': isEn ? "Chart T2" : "Tabla T2",
          'ppatrol-td-tgt-t2-desc': isEn ? "Large Freighter / Tanker (Escorted)" : "Mercante grande / Petrolero (Con escolta)",
          'ppatrol-td-tgt-t3-enc': isEn ? "Warship" : "Buque de Guerra",
          'ppatrol-td-tgt-t3-chart': isEn ? "Chart T3" : "Tabla T3",
          'ppatrol-td-tgt-t3-desc': isEn ? "Destroyer / Cruiser (Escorted)" : "Destructor / Crucero (Con escolta)",
          'ppatrol-td-tgt-t4-enc': isEn ? "Capital Ship" : "Buque Capital",
          'ppatrol-td-tgt-t4-chart': isEn ? "Chart T4 / T5" : "Tabla T4 / T5",
          'ppatrol-td-tgt-t4-desc': isEn ? "Battleship / Aircraft Carrier (Heavy Escort)" : "Acorazado / Portaaviones (Alta escolta)",
          'ppatrol-lbl-go-combat': isEn ? "Proceed to Phase 3: Ship Encounter! ➔" : "¡Ir a Fase 3: Encuentro con Barcos! ➔",
          'ppatrol-ship-status-lbl': isEn ? "Active Surface Contact Status:" : "Estado del Contacto de Superficie:",
          'ppatrol-btn-ship-workflow': isEn ? "Tactical Guide: Ship Attack [8.1 - 8.2]" : "Guía Táctica: Ataque Naval [8.1 - 8.2]",
          'ppatrol-top-btn-ship-workflow': isEn ? "Tactical Guide: Ship Attack [8.1 - 8.2]" : "Guía Táctica: Ataque Naval [8.1 - 8.2]",
          'ppatrol-btn-next': isEn ? "Proceed to Phase 3: Ship Encounter ➔" : "Pasar a Fase 3: Encuentro con Barcos ➔",
          'ppatrol-btn-prev': isEn ? "Return to Phase 2: Transit Track" : "Volver a Fase 2: Trayecto",
          'modal-ship-title': isEn ? "TACTICAL PROCEDURE: NAVAL ATTACK ON PATROL" : "PROCEDIMIENTO TÁCTICO: ATAQUE NAVAL EN PATRULLA",
          'modal-ship-rule-badge': isEn ? "OFFICIAL RULES 8.1 - 8.2" : "REGLAS OFICIALES 8.1 - 8.2",
          'modal-ship-subtitle': isEn
            ? "Full surface & submerged engagement protocol: Target Detection [A3/T1-T5], Mode & Range [8.1.3-8.1.10], Torpedo Solution [B1/B2/B3], Damage Resolution [B4] and Escort Counter-Attack [B5]."
            : "Protocolo completo de combate de superficie y submarino: Detección [A3/T1-T5], Modo y Distancia [8.1.3-8.1.10], Solución de Torpedos [B1/B2/B3], Daño al Objetivo [B4] y Contraataque de Escoltas [B5].",
          'ppatrol-air-badge': isEn ? "Air" : "Aéreo",
          'ppatrol-a4-table-title': isEn ? "Step 1: Mandatory Emergency Crash Dive Roll [Rule 8.3.1 & Chart A4]" : "Paso 1: Tirada Obligatoria de Inmersión de Emergencia [Regla 8.3.1 & Tabla A4]",
          'ppatrol-btn-a4-label': isEn ? "Roll [A4]" : "Tirar [A4]",
          'ppatrol-lbl-manual-a4': isEn ? "Tabletop:" : "Mesa:",
          'ppatrol-btn-apply-a4': isEn ? "Apply" : "Aplicar",
          'ppatrol-th-a4-roll': isEn ? "Final Roll" : "Tirada Final",
          'ppatrol-th-a4-result': isEn ? "Result" : "Resultado",
          'ppatrol-th-a4-effect': isEn ? "Operational Effect" : "Efecto Operativo",
          'ppatrol-td-a4-r1-res': isEn ? "2 x Air Attacks" : "2 x Ataques Aéreos",
          'ppatrol-td-a4-r1-eff': isEn ? "2 bomb runs + 1 automatic crew injury" : "2 pasadas con bombas + 1 herida automática de dotación",
          'ppatrol-td-a4-r2-res': isEn ? "1 x Air Attack" : "1 x Ataque Aéreo",
          'ppatrol-td-a4-r2-eff': isEn ? "1 bomb run + 1 automatic crew injury" : "1 pasada con bombas + 1 herida automática de dotación",
          'ppatrol-td-a4-r3-res': isEn ? "Successful Crash Dive" : "Inmersión Exitosa",
          'ppatrol-td-a4-r3-eff': isEn ? "Submarine submerged safely. No damage sustained." : "Submarino sumergido a salvo. Sin daños sufridos.",
          'ppatrol-lbl-a4-year-drm': isEn ? "Official Year Modifiers (DRM):" : "Modificadores Oficiales por Año (DRM):",
          'ppatrol-lbl-a4-sit-drm': isEn ? "Crew & Vessel Modifiers:" : "Modificadores de Tripulación y Buque:",
          'ppatrol-a4-m-elite': isEn ? "Elite Crew:" : "Dotación Élite:",
          'ppatrol-a4-m-planes': isEn ? "Damaged dive planes:" : "Planos inmersión averiados:",
          'ppatrol-a4-m-green': isEn ? "Green Crew:" : "Dotación Novata (Green):",
          'ppatrol-a4-m-radar': isEn ? "Radar equipped & operational:" : "Radar instalado y operativo:",
          'ppatrol-a4-m-kiasw': isEn ? "All Crew SW/KIA:" : "Toda tripulación herida (SW/KIA):",
          'ppatrol-a4-m-night': isEn ? "Night / Special Mission:" : "Noche / Minado Especial:",
          'ppatrol-fido-title': isEn ? "Step 2: Special Weapon Check: \"FIDO\" Acoustic Homing Torpedo [Rules 8.3.2 & 8.3.3]" : "Paso 2: Comprobación de Arma Especial: Torpedo Acústico \"FIDO\" [Regla 8.3.2 & 8.3.3]",
          'ppatrol-a2-table-title': isEn ? "Step 3: Simultaneous Defensive Anti-Aircraft Fire [Rules 8.3.2, 8.3.5 & Chart A2]" : "Paso 3: Fuego Antiaéreo Defensivo Simultáneo [Reglas 8.3.2, 8.3.5 & Tabla A2]",
          'ppatrol-btn-a2-label': isEn ? "Roll AA [A2]" : "Tirar AA [A2]",
          'ppatrol-lbl-manual-a2': isEn ? "Tabletop:" : "Mesa:",
          'ppatrol-btn-apply-a2': isEn ? "Apply" : "Aplicar",
          'ppatrol-air-panel-title': isEn ? "Step 4: Air Attack Damage Resolution (Conventional or FIDO)" : "Paso 4: Resolución de Daños del Ataque Aéreo (Convencional o FIDO)",
          'ppatrol-lbl-step-crew': isEn ? "4A.1 — Mandatory Crew Casualty (Chart B7 • 2d6 + 1d6)" : "4A.1 — Herida de Dotación Obligatoria (Tabla B7 • 2d6 Puesto + 1d6 Gravedad)",
          'ppatrol-btn-air-crew-pos': isEn ? "1. Roll Station (2d6)" : "1. Tirar Puesto (2d6)",
          'ppatrol-btn-air-crew-sev': isEn ? "2. Roll Severity (1d6)" : "2. Tirar Tipo de Baja (1d6)",
          'ppatrol-btn-air-crew-roll-all': isEn ? "Roll Both" : "Tirar Ambos",
          'ppatrol-btn-air-crew-roll': isEn ? "Roll Casualty (B7)" : "Tirar Baja (B7)",
          'ppatrol-lbl-step-bombs': isEn ? "4A.2 — Bomb & Depth Charge Hits (Chart B5 with +2 Air DRM)" : "4A.2 — Impactos de Bombas y Cargas (Tabla B5 con +2 DRM Aéreo)",
          'ppatrol-btn-air-bomb-roll': isEn ? "Roll Bombs (B5)" : "Tirar Bombas (B5)",
          'ppatrol-hunted-title': isEn ? "Step 5: Air Harassment & Scuttling (\"Hunted to Exhaustion\") [Rule 8.3.4]" : "Paso 5: Acoso Aéreo y Barrenado (\"Hunted to Exhaustion\") [Regla 8.3.4]",
          'ppatrol-btn-air-evaded': isEn ? "Aircraft Evaded: Advance Box" : "Avión Evadido: Avanzar Casilla",
          'ppatrol-btn-air-damaged': isEn ? "Damage Sustained: Proceed to Repairs (Phase 4) ➔" : "Daño Sufrido: Ir a Averías (Fase 4) ➔",
          'ppatrol-btn-air-evaded-inner': isEn ? "Continue Patrol Track" : "Continuar Patrulla",
          'ppatrol-btn-air-damage-inner': isEn ? "Proceed to Damage Control (Phase 4) ➔" : "Ir a Control de Averías (Fase 4) ➔",
          'ppatrol-btn-a2-label': isEn ? "Roll AA [A2]" : "Tirar AA [A2]",
          'ppatrol-lbl-manual-a2': isEn ? "Tabletop:" : "Mesa:",
          'ppatrol-btn-apply-a2': isEn ? "Apply" : "Aplicar",
          'ppatrol-th-a2-roll': isEn ? "2d6 Roll" : "Tirada 2d6",
          'ppatrol-th-a2-effect': isEn ? "Effect against Aircraft" : "Efecto contra Avión",
          'ppatrol-th-a2-conseq': isEn ? "Consequence" : "Consecuencia",
          'ppatrol-td-a2-r1-eff': isEn ? "Aircraft Shot Down!" : "¡Avión Derribado!",
          'ppatrol-td-a2-r1-con': isEn ? "Aircraft destroyed before releasing bombs. Clean victory." : "Avión destruido antes de lanzar bombas. Victoria limpia.",
          'ppatrol-td-a2-r2-eff': isEn ? "Aircraft Damaged" : "Avión Dañado",
          'ppatrol-td-a2-r2-con': isEn ? "Attack aborted. Aircraft retreats damaged." : "Ataque interrumpido. Avión se retira con averías.",
          'ppatrol-td-a2-r3-eff': isEn ? "Miss" : "Fallo (Miss)",
          'ppatrol-td-a2-r3-con': isEn ? "Enemy aircraft bombs the submarine." : "El avión enemigo bombardea el submarino.",
          'ppatrol-a2-footnote': isEn ? "★ Modifiers: 2x AA Guns: -1 | 3x AA Guns: -2 | Veteran/Elite Crew: -1" : "★ Modificadores: 2x Cañones AA: -1 | 3x Cañones AA: -2 | Dotación Veterana/Élite: -1",
          'ppatrol-btn-air-evaded': isEn ? "Aircraft Evaded: Advance Box" : "Avión Evadido: Avanzar Casilla",
          'ppatrol-btn-air-damaged': isEn ? "Damage Sustained: Proceed to Damage (Phase 4) ➔" : "Daño Sufrido: Ir a Averías (Fase 4) ➔",
          'ppatrol-btn-prev': isEn ? "Back to Phase 2: Transit" : "Volver a Fase 2: Trayecto",
          'ppatrol-btn-next': isEn ? "Proceed to Phase 3: Tactical Combat ➔" : "Pasar a Fase 3: Combate Táctico ➔"
        };
        Object.keys(labels).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerText = labels[id];
        });

        const elPPatrolShipT = document.getElementById('ppatrol-ship-title');
        if (elPPatrolShipT) elPPatrolShipT.innerHTML = isEn ? "<span>🚢</span> <span>1. Naval Contact (Ship / Warship / Capital Ship)</span>" : "<span>🚢</span> <span>1. Contacto Naval (Ship / Buque de Guerra / Buque Capital)</span>";
        const elPPatrolShipDesc = document.getElementById('ppatrol-ship-desc');
        if (elPPatrolShipDesc) elPPatrolShipDesc.innerHTML = isEn
          ? "Upon rolling <strong>Ship</strong>, <strong>Warship</strong>, or <strong>Capital Ship</strong> on Chart [A3], generate the target vessel using official tables <strong>T1</strong> (Freighter), <strong>T2</strong> (Escorted/Tanker), or <strong>T3</strong> (Warship)."
          : "Al obtener <strong>Ship</strong>, <strong>Warship</strong> o <strong>Capital Ship</strong> en la Tabla [A3], se genera el buque blanco según las tablas oficiales <strong>T1</strong> (Mercante), <strong>T2</strong> (Escoltado/Petrolero) o <strong>T3</strong> (Buque de Guerra).";

        const elPPatrolAirT = document.getElementById('ppatrol-air-title');
        if (elPPatrolAirT) elPPatrolAirT.innerHTML = isEn ? "<span>✈️</span> <span>Tactical Sequence: Air Encounter [Official Rule 8.3]</span>" : "<span>✈️</span> <span>Secuencia Táctica de Encuentro Aéreo [Regla Oficial 8.3]</span>";
        const elPPatrolAirDesc = document.getElementById('ppatrol-air-desc');
        if (elPPatrolAirDesc) elPPatrolAirDesc.innerHTML = isEn
          ? "Upon rolling <strong>Aircraft</strong> on Chart [A3], an enemy patrol aircraft surprises the submarine. Follow the official 5-step tactical sequence:"
          : "Al obtener <strong>Aircraft</strong> en la Tabla [A3], un avión enemigo en patrulla antisubmarina sorprende al buque. Sigue la secuencia reglamentaria en los siguientes 5 pasos:";

        const elPPatrolA4DrmCrewP1 = document.getElementById('ppatrol-a4-drm-crew-p1');
        if (elPPatrolA4DrmCrewP1) elPPatrolA4DrmCrewP1.innerHTML = isEn
          ? "• Elite Crew: <strong style='color:#86efac;'>+1</strong> | Green Crew: <strong style='color:#f87171;'>-1</strong> | All Crew SW/KIA: <strong style='color:#f87171;'>-1</strong>"
          : "• Dotación Élite: <strong style='color:#86efac;'>+1</strong> | Dotación Novata: <strong style='color:#f87171;'>-1</strong> | Toda la tripulación herida/KIA: <strong style='color:#f87171;'>-1</strong>";
        const elPPatrolA4DrmCrewP2 = document.getElementById('ppatrol-a4-drm-crew-p2');
        if (elPPatrolA4DrmCrewP2) elPPatrolA4DrmCrewP2.innerHTML = isEn
          ? "• Dive planes damaged: <strong style='color:#f87171;'>-1</strong> | Radar equipped: <strong style='color:#86efac;'>+1</strong> | Night: <strong style='color:#86efac;'>+1</strong> | Minelaying/Special: <strong style='color:#f87171;'>-1</strong>"
          : "• Planos inmersión averiados: <strong style='color:#f87171;'>-1</strong> | Radar a bordo: <strong style='color:#86efac;'>+1</strong> | Noche: <strong style='color:#86efac;'>+1</strong> | Minado/Especial: <strong style='color:#f87171;'>-1</strong>";

        const resA4El = document.getElementById('res-interactive-a4');
        if (resA4El && (resA4El.innerText.includes('Sin tirada') || resA4El.innerText.includes('No crash dive') || resA4El.innerText.includes('Sin ROLL'))) {
          resA4El.innerHTML = `<span style="color:var(--slate-400);">${isEn ? "No crash dive roll in this box." : "Sin tirada de inmersión en esta casilla."}</span>`;
        }
        const resA2El = document.getElementById('res-interactive-a2');
        if (resA2El && (resA2El.innerText.includes('Sin fuego') || resA2El.innerText.includes('No anti-aircraft') || resA2El.innerText.includes('Sin FIRE'))) {
          resA2El.innerHTML = `<span style="color:var(--slate-400);">${isEn ? "No anti-aircraft fire in this box." : "Sin fuego antiaéreo en esta casilla."}</span>`;
        }
      }



      function applyPhase5AwardsLanguage(isEn) {
        const values = {
          'p5-awards-title': isEn ? 'PROMOTIONS & IMPERIAL DECORATIONS [8.7 - 8.9]' : 'ASCENSOS Y CONDECORACIONES IMPERIALES [8.7 - 8.9]',
          'p5-award-header': isEn ? 'Decoration' : 'Condecoración',
          'p5-award-criteria-header': isEn ? 'Award Criteria' : 'Criterio de Concesión',
          'p5-award-golden-name': isEn ? 'Order of the Golden Kite<br><span style="font-size:0.68rem; color:var(--slate-400);">(Kinshi Kunsho - 4th Class)</span>' : 'Orden del Milano Dorado<br><span style="font-size:0.68rem; color:var(--slate-400);">(Kinshi Kunsho - 4.ª clase)</span>',
          'p5-award-golden-criteria': isEn ? 'Sink a Capital Ship or achieve &gt;20,000 tons in a single patrol.' : 'Hundir un Buque Capital o lograr &gt;20,000 t en una sola patrulla.',
          'p5-award-rising-name': isEn ? 'Order of the Rising Sun<br><span style="font-size:0.68rem; color:var(--slate-400);">(Kyokujitsu-sho)</span>' : 'Orden del Sol Naciente<br><span style="font-size:0.68rem; color:var(--slate-400);">(Kyokujitsu-sho)</span>',
          'p5-award-rising-criteria': isEn ? 'Accumulate ≥ 20,000 total tons of enemy ships sunk.' : 'Acumular ≥ 20,000 toneladas totales de buques enemigos hundidos.',
          'p5-award-sacred-name': isEn ? 'Order of the Sacred Treasure<br><span style="font-size:0.68rem; color:var(--slate-400);">(Zuiho-sho)</span>' : 'Orden del Tesoro Sagrado<br><span style="font-size:0.68rem; color:var(--slate-400);">(Zuiho-sho)</span>',
          'p5-award-sacred-criteria': isEn ? 'Accumulate ≥ 15,000 tons or complete 3 successful patrols.' : 'Acumular ≥ 15,000 toneladas o completar 3 patrullas exitosas.',
          'p5-award-sub-name': isEn ? 'Submarine Badge<br><span style="font-size:0.68rem; color:var(--slate-400);">(Sensuikan Kisho)</span>' : 'Insignia de Submarinos<br><span style="font-size:0.68rem; color:var(--slate-400);">(Sensuikan Kisho)</span>',
          'p5-award-sub-criteria': isEn ? 'Graduate from Kure Submarine School [F1] or complete 1 successful patrol.' : 'Graduarse en la Escuela de Kure [F1] o 1 patrulla exitosa.',
          'p5-promotion-label': isEn ? 'Promotion to Captain (Kaigun Taisa):' : 'Ascenso a Capitán (Kaigun Taisa):',
          'p5-promotion-text': isEn ? 'In December each year, with ≥3 patrols or distinguished tonnage, roll 1d6: on 1-3 the Commander is promoted to Captain.' : 'En diciembre de cada año, con ≥3 patrullas o tonelaje distinguido, tira 1d6: con 1-3 el Comandante asciende a Capitán de Navío.',
          'p5-go-k1': isEn ? '🎴 Go to Chart K1 Board' : '🎴 Ir al Tablero Chart K1',
          'p5-go-rogu': isEn ? '📜 Go to Rogu Bukku' : '📜 Ir al Rogu Bukku',
          'p5-btn-sub-upgrade': isEn ? 'Redeem Submarine Upgrade (Sub Upgrade) [Rule 9.3]' : 'Canjear Mejora de Submarino (Sub Upgrade) [Regla 9.3]',
          'wf-refit-alert-title': isEn ? 'MANDATORY SUB REASSIGNMENT (REFIT ≥ 5 MONTHS) [RULE 9.2]' : '¡REASIGNACIÓN OBLIGATORIA POR REFIT PROLONGADO [REGLA 9.2]!',
          'wf-refit-alert-btn': isEn ? '⚓ Select Replacement Submarine [Rule 9.2]' : '⚓ Seleccionar Buque de Reemplazo [Regla 9.2]'
        };
        Object.keys(values).forEach(id => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = values[id];
        });
      }

      function applyPhase4DamageLanguage(isEn) {
        const values = {
          'p4-chart-btn-label': isEn ? '📊 Open Digital Chart B7' : '📊 Consultar Tabla Digital B7',
          'p4-sequence-btn-label': isEn ? 'Sequence Card' : 'Carta de Secuencia',
          'p4-damage-section-title': isEn ? '1. Damage Control & Flooding (Chart B7) [8.5.2]' : '1. Control de Daños e Inundación (Tabla B7) [8.5.2]',
          'p4-damage-section-help': isEn ? 'At the end of combat or during each flooding round, resolve rolls using Chart B7:' : 'Al concluir el combate o en cada ronda de inundación, resuelve las tiradas según la Tabla B7:',
          'p4-flooding-title': isEn ? '🌊 Flooding (1d6):' : '🌊 Inundación (1d6):',
          'p4-flooding-button-label': isEn ? '🎲 Roll Flood Containment (1d6)' : '🎲 Tirar Contención de Inundación (1d6)',
          'p4-repair-title': isEn ? '🔧 Damaged System Repair (1d6):' : '🔧 Reparación de Sistema Averiado (1d6):',
          'p4-system-label': isEn ? 'Affected System:' : 'Sistema afectado:',
          'p4-repair-button-label': isEn ? '🎲 Roll System Repair (1d6)' : '🎲 Tirar Reparación del Sistema (1d6)',
          'p4-engineer-note': isEn ? '★ If the Engineer is SW or KIA, repair and flooding rolls receive +1 DRM. Unrepaired damage becomes INOP.' : '★ Si el ingeniero es SW o KIA, las tiradas de reparación e inundación reciben +1 DRM. Los daños no reparados pasan a «INOP».',
          'p4-crew-section-title': isEn ? '2. Crew Injuries & Return to Port' : '2. Bajas de Tripulación y Retirada',
          'p4-crew-section-help': isEn ? 'If the crew is hit during combat, roll on the Chart B7 casualty table:' : 'Si la tripulación recibe un impacto durante el combate, tira en la tabla de bajas B7:',
          'p4-crew-roll-title': isEn ? '🩺 Casualty Determination (2d6 Station + 1d6 Severity):' : '🩺 Determinación de baja (2d6 puesto + 1d6 gravedad):',
          'p4-crew-button-label': isEn ? '🎲 Roll Crew Casualty (2d6 + 1d6)' : '🎲 Tirar Baja de Tripulación (2d6 + 1d6)',
          'p4-abort-title': isEn ? 'Mandatory Return to Port Criteria [Rule 8.6]:' : 'Criterios de regreso obligatorio a base [Regla 8.6]:',
          'p4-th-abort-cond': isEn ? 'Condition / System' : 'Condición / Sistema',
          'p4-th-abort-effect': isEn ? 'Operational Effect & Mandate [8.6]' : 'Efecto Operativo y Obligación [8.6]',
          'p4-abort-fuel-title': isEn ? '⛽ Fuel Tanks' : '⛽ Tanques de Combustible',
          'p4-abort-fuel-desc': isEn ? 'INOP or unrepaired leaks: mission must be aborted, return immediately to port.' : 'INOP o con fugas no reparadas: abortar misión y regresar inmediatamente a base.',
          'p4-abort-diesel-title': isEn ? '⚙️ Diesel Engines' : '⚙️ Motores Diésel',
          'p4-abort-diesel-desc': isEn ? '1 diesel fails: mandatory return to port (2 encounter rolls per zone). Both diesels fail: towed if 1 zone from base; scuttle if 2+ zones.' : 'Fallo de 1 motor: regreso obligatorio con 2 tiradas de encuentro por casilla. Fallo de ambos motores: remolcado si dista 1 zona; si está a 2+ zonas, barrenar el submarino.',
          'p4-abort-officer-title': isEn ? '🎖️ Command / Navigator' : '🎖️ Mando / Navegante',
          'p4-abort-officer-desc': isEn ? 'If Captain and XO are lost and Navigator assumes command: mandatory return to port.' : 'Si el Comandante y el Oficial Ejecutivo son baja y el Navegante asume como Capitán: regreso forzoso a base.',
          'p4-abort-hull-title': isEn ? '💥 Structural Hull' : '💥 Casco Estructural',
          'p4-abort-hull-desc': isEn ? 'If all hull damage boxes are filled: catastrophic loss, submarine sinks.' : 'Si se marcan todas las casillas de casco: pérdida estructural catastrófica, el submarino se hunde.',
          'p4-abort-scuttle-title': isEn ? '🆘 Scuttle & Rescue [8.6.3]' : '🆘 Barrenar y Rescate [8.6.3]',
          'p4-abort-scuttle-desc': isEn ? 'Rescue roll 2d6 (+4 DRM if radio is INOP): <strong>2–10</strong> Crew saved | <strong>11–12</strong> Crew lost.' : 'Tirada de rescate 2d6 (2-10 salvados, 11-12 perdidos; +4 DRM si la radio está rota / INOP).',
          'p4-rescue-title': isEn ? 'Scuttling & Rescue [8.6.3]:' : 'Barrenar y rescate [8.6.3]:',
          'p4-b7-title': isEn ? 'CHART B7: SUBMARINE DAMAGE LISTINGS & CREW INJURY (OFFICIAL B7 TABLE)' : 'TABLA B7: AVERÍAS DEL SUBMARINO Y BAJAS DE TRIPULACIÓN (TABLA OFICIAL B7)',
          'p4-b7-subtitle': isEn ? 'Tactical damage effects, at-sea repair chances (1d6), and the complete crew casualty table.' : 'Efectos tácticos de las averías, probabilidades de reparación en el mar (1d6) y tabla completa de bajas de tripulación.',
          'p4-b7-view-btn': isEn ? '📷 View Chart B7' : '📷 Ver Tabla B7',
          'p4-crew-table-title': isEn ? 'CREW CASUALTY TABLE (2d6 + 1d6 SEVERITY)' : 'TABLA DE BAJAS DE TRIPULACIÓN (2d6 + 1d6 DE GRAVEDAD)',
          'p4-crew-role-header': isEn ? 'Affected Station' : 'Puesto afectado',
          'p4-crew-severity-header': isEn ? '1d6 Severity' : 'Gravedad 1d6',
          'p4-role-2': isEn ? 'Captain' : 'Comandante',
          'p4-role-3': isEn ? 'Engineer' : 'Ingeniero',
          'p4-role-4': isEn ? 'Executive Officer' : 'Oficial ejecutivo',
          'p4-role-5': isEn ? 'Medic' : 'Médico',
          'p4-role-6-10': isEn ? 'Generic Crew' : 'Dotación',
          'p4-role-11': isEn ? 'Navigator' : 'Navegante',
          'p4-role-12': isEn ? 'Pilot / Midget / Kaiten' : 'Piloto / Midget / Kaiten',
          'p4-crew-penalty-title': isEn ? 'Key Station Casualty Penalties (SW or KIA):' : 'Penalizaciones por bajas en puestos clave (SW o KIA):',
          'p4-th-pen-post': isEn ? 'Key Station' : 'Puesto Clave',
          'p4-th-pen-eff': isEn ? 'Combat & Campaign Penalty' : 'Efecto en Combate y Campaña',
          'p4-pen-title-captain': isEn ? 'Captain' : 'Comandante',
          'p4-pen-title-exec': isEn ? 'Executive Officer' : 'Oficial ejecutivo',
          'p4-pen-title-engineer': isEn ? 'Engineer' : 'Ingeniero',
          'p4-pen-title-navigator': isEn ? 'Navigator' : 'Navegante',
          'p4-pen-title-medic': isEn ? 'Medic' : 'Médico',
          'p4-pen-title-crew': isEn ? 'Crew' : 'Dotación',
          'p4-pen-title-pilot': isEn ? 'Pilot / Midget / Kaiten' : 'Piloto / Midget / Kaiten',
          'p4-penalty-captain': isEn ? 'The Executive Officer takes command. +1 Detection, +1 To-Hit.' : 'El segundo toma el mando. +1 a detección, +1 a impactar.',
          'p4-penalty-exec': isEn ? 'If already in command, the 3rd Officer takes command: +1 Detection, +1 To-Hit.' : 'Si ya mandaba, el tercer oficial asume: +1 a detección, +1 a impactar.',
          'p4-penalty-engineer': isEn ? 'Repair rolls receive <strong>+1 DRM</strong>, including flooding containment.' : 'Tiradas de reparación a <strong>+1 DRM</strong> (más difícil), incluida la contención de inundación.',
          'p4-penalty-navigator': isEn ? 'The submarine must return to port if the Captain is already a casualty.' : 'El submarino debe regresar a base si el capitán ya era baja.',
          'p4-penalty-medic': isEn ? 'All crew with SW become KIA when crossing each zone on a 4-6 on 1d6.' : 'Todos los tripulantes con SW mueren (KIA) al cruzar cada zona con 4-6 en 1d6.',
          'p4-penalty-crew': isEn ? 'If all generic crew boxes are SW/KIA: +1 To-Hit with torpedoes.' : 'Si todas las casillas genéricas están SW/KIA: +1 a impactar con torpedos.',
          'p4-penalty-pilot': isEn ? 'The special mission fails immediately.' : 'La misión especial fracasa de inmediato.'
        };
        Object.entries(values).forEach(([id, text]) => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = text;
        });

        const options = {
          periscope: isEn ? 'Periscope [1-2 Fixed / 3-6 INOP]' : 'Periscopio [1-2 Reparado / 3-6 INOP]',
          engines: isEn ? 'Diesel / Electric Engines [1-4 Fixed / 5-6 INOP]' : 'Motores diésel / eléctricos [1-4 Reparados / 5-6 INOP]',
          batteries: isEn ? 'Batteries [1-4 Fixed / 5-6 INOP]' : 'Baterías [1-4 Reparadas / 5-6 INOP]',
          fuel: isEn ? 'Fuel Tanks [1-3 Fixed / 4-6 INOP]' : 'Tanques de combustible [1-3 Reparados / 4-6 INOP]',
          radar: isEn ? 'Radar [1-3 Fixed / 4-6 INOP]' : 'Radar [1-3 Reparado / 4-6 INOP]',
          dive_planes: isEn ? 'Dive Planes [1-2 Fixed / 3-6 INOP]' : 'Planos de inmersión [1-2 Reparados / 3-6 INOP]',
          torpedo_doors: isEn ? 'Torpedo Doors [1-2 Fixed / 3-6 INOP]' : 'Compuertas de torpedos [1-2 Reparadas / 3-6 INOP]',
          deck_gun: isEn ? 'Deck Gun [1-2 Fixed / 3-6 INOP]' : 'Cañón de cubierta [1-2 Reparado / 3-6 INOP]',
          aa_guns: isEn ? 'AA Guns [1-2 Fixed / 3-6 INOP]' : 'Artillería AA [1-2 Reparada / 3-6 INOP]',
          hydrophones: isEn ? 'Hydrophones [1-2 Fixed / 3-6 INOP]' : 'Hidrófonos [1-2 Reparados / 3-6 INOP]',
          radio: isEn ? 'Radio [1-2 Fixed / 3-6 INOP]' : 'Radio [1-2 Reparada / 3-6 INOP]',
          crane: isEn ? 'Floatplane Crane [1-2 Fixed / 3-6 INOP]' : 'Grúa de hidroavión [1-2 Reparada / 3-6 INOP]',
          hangar: isEn ? 'Floatplane Hangar [1-2 Fixed / 3-6 INOP]' : 'Hangar de hidroavión [1-2 Reparado / 3-6 INOP]',
          hull: isEn ? 'Hull [Not repairable at sea]' : 'Casco [No reparable en el mar]'
        };
        const select = document.getElementById('wf-b7-system-select');
        if (select) {
          Object.entries(options).forEach(([value, label]) => {
            const option = select.querySelector(`option[value="${value}"]`);
            if (option) option.textContent = label;
          });
        }
      }

      function applyCompendiumSection2Language(isEn) {
        const sec2Map = {
          // Main Section Header
          'comp-sec2-main-title': isEn 
            ? "🎯 2. TACTICAL COMBAT, TORPEDOES & ESCORTS (CHARTS B2, B4, B5, B6, B7, H1)" 
            : "🎯 2. COMBATE TÁCTICO, TORPEDOS Y ESCOLTAS (CHARTS B2, B4, B5, B6, B7, H1)",
          'comp-sec2-badge-ijn': isEn ? "IJN TACTICAL AID" : "AYUDA TÁCTICA IJN",
          'comp-sec2-game-title': isEn 
            ? 'SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Japanese Fleet Submarines 1941–45)</span>' 
            : 'SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Submarinos de Flota Japoneses 1941–45)</span>',
          'comp-sec2-sub-title': isEn 
            ? "COMBAT & DAMAGE TABLES: B1 TO B6 (OFFICIAL DIGITAL TRANSCRIPTION)" 
            : "TABLAS DE COMBATE Y DAÑOS: B1 A B6 (TRANSCRIPCIÓN DIGITAL OFICIAL)",
          'comp-sec2-compass-badge': isEn ? "Official Compass Games" : "Oficial Compass Games",

          // Chart B1
          'comp-b1-title': isEn 
            ? "<span>CHART [B1]</span> <span>TORPEDO & DECK GUN ATTACK (TO-HIT)</span>" 
            : "<span>TABLA [B1]</span> <span>DISPARO DE TORPEDOS Y CAÑÓN DE CUBIERTA (IMPACTO)</span>",
          'comp-b1-dice': isEn ? "🎲 2d6 (Low Roll)" : "🎲 2d6 (Tirada Baja)",
          'comp-b1-range-close': isEn 
            ? `<div style="font-size:0.86rem; color:#7dd3fc; font-weight:bold;">Close</div>
               <div style="font-size:0.82rem; color:#94a3b8;">0 – 1,500 m</div>
               <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–8 <span style="font-size:0.86rem; color:#a7f3d0;">Hit</span></div>
               <div style="font-size:0.84rem; color:#f87171;">9–12 Miss</div>`
            : `<div style="font-size:0.86rem; color:#7dd3fc; font-weight:bold;">Corta</div>
               <div style="font-size:0.82rem; color:#94a3b8;">0 – 1,500 m</div>
               <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–8 <span style="font-size:0.86rem; color:#a7f3d0;">Impacto</span></div>
               <div style="font-size:0.84rem; color:#f87171;">9–12 Fallo</div>`,
          'comp-b1-range-med': isEn 
            ? `<div style="font-size:0.86rem; color:#7dd3fc; font-weight:bold;">Medium</div>
               <div style="font-size:0.82rem; color:#94a3b8;">1,500 – 3,000 m</div>
               <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–7 <span style="font-size:0.86rem; color:#a7f3d0;">Hit</span></div>
               <div style="font-size:0.84rem; color:#f87171;">8–12 Miss</div>`
            : `<div style="font-size:0.86rem; color:#7dd3fc; font-weight:bold;">Media</div>
               <div style="font-size:0.82rem; color:#94a3b8;">1,500 – 3,000 m</div>
               <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–7 <span style="font-size:0.86rem; color:#a7f3d0;">Impacto</span></div>
               <div style="font-size:0.84rem; color:#f87171;">8–12 Fallo</div>`,
          'comp-b1-range-long': isEn 
            ? `<div style="font-size:0.86rem; color:#7dd3fc; font-weight:bold;">Long ★</div>
               <div style="font-size:0.82rem; color:#94a3b8;">&gt; 3,000 m</div>
               <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–6 <span style="font-size:0.86rem; color:#a7f3d0;">Hit</span></div>
               <div style="font-size:0.84rem; color:#f87171;">7–12 Miss</div>`
            : `<div style="font-size:0.86rem; color:#7dd3fc; font-weight:bold;">Larga ★</div>
               <div style="font-size:0.82rem; color:#94a3b8;">&gt; 3,000 m</div>
               <div style="font-size:1.1rem; color:#4ade80; font-weight:900; margin:2px 0;">2–6 <span style="font-size:0.86rem; color:#a7f3d0;">Impacto</span></div>
               <div style="font-size:0.84rem; color:#f87171;">7–12 Fallo</div>`,
          'comp-b1-mods-title': isEn 
            ? "To-Hit Die Roll Modifiers (DRM):" 
            : "Modificadores a la Tirada de Impacto (DRM):",
          'comp-b1-mods-grid': isEn 
            ? `<div><strong style="color:#4ade80;">-1</strong> Night surface torpedo attack</div>
               <div><strong style="color:#f87171;">+1</strong> Type 92 Torpedo at Medium Range</div>
               <div><strong style="color:#f87171;">+1</strong> Commander Dead (KIA) or Seriously Wounded (SW)</div>
               <div><strong style="color:#f87171;">+2</strong> Type 92 Torpedo at Long Range</div>
               <div><strong style="color:#4ade80;">-1</strong> Midget submarine torpedo</div>
               <div><strong style="color:#f87171;">+1</strong> Fast Capital Ship</div>
               <div><strong style="color:#f87171;">+1</strong> Green Crew</div>
               <div><strong style="color:#f87171;">+2</strong> Attack against Escort / Destroyer / DE</div>`
            : `<div><strong style="color:#4ade80;">-1</strong> Torpedo en superficie nocturno</div>
               <div><strong style="color:#f87171;">+1</strong> Torpedo Tipo 92 a Media Distancia</div>
               <div><strong style="color:#f87171;">+1</strong> Comandante Muerto (KIA) o Grave (SW)</div>
               <div><strong style="color:#f87171;">+2</strong> Torpedo Tipo 92 a Larga Distancia</div>
               <div><strong style="color:#4ade80;">-1</strong> Torpedo de Minisubmarino</div>
               <div><strong style="color:#f87171;">+1</strong> Buque Capital Rápido (Fast Capital)</div>
               <div><strong style="color:#f87171;">+1</strong> Dotación Novata (Green Crew)</div>
               <div><strong style="color:#f87171;">+2</strong> Disparo a Escolta / Destructor / DE</div>`,
          'comp-b1-crit-note': isEn 
            ? "★ Natural roll of \"2\" with torpedoes = Critical Hit (if not a dud): +3 additional Damage." 
            : "★ Tirada natural de \"2\" con torpedos = Impacto Crítico (si no es inerte): +3 daños adicionales.",

          // Chart B2
          'comp-b2-title': isEn 
            ? "<span>CHART [B2]</span> <span>TORPEDO DUDS</span>" 
            : "<span>TABLA [B2]</span> <span>TORPEDOS INERTES (DUDS)</span>",
          'comp-b2-desc': isEn 
            ? "All torpedo types fail or are duds on a roll of <strong style=\"color:#ef4444; font-size:0.95rem;\">\"1\"</strong> on 1d6. On 2 to 6 they detonate normally." 
            : "Todos los modelos fallan o resultan inertes con una tirada de <strong style=\"color:#ef4444; font-size:0.95rem;\">\"1\"</strong> en 1d6. De 2 a 6 detonan con normalidad.",
          'comp-b2-fido-title': isEn 
            ? "Special FIDO Air Attack (from 5/44)" 
            : "Ataque Aéreo Especial FIDO (desde 5/44)",
          'comp-b2-fido-desc': isEn 
            ? "Enemy aircraft drops FIDO homing torpedo. Roll 1d6:" 
            : "Avión enemigo lanza torpedo acústico guiado FIDO. Tirar 1d6:",
          'comp-b2-fido-res': isEn 
            ? `<span style="background:#450a0a; color:#f87171; padding:2px 6px; border-radius:4px;"><strong>1</strong> = Sunk</span>
               <span style="background:#451a03; color:#fdba74; padding:2px 6px; border-radius:4px;"><strong>2</strong> = 7 Hits</span>
               <span style="background:#0f172a; color:#94a3b8; padding:2px 6px; border-radius:4px; border:1px solid #334155;"><strong>3–6</strong> = Miss / Dud</span>`
            : `<span style="background:#450a0a; color:#f87171; padding:2px 6px; border-radius:4px;"><strong>1</strong> = Hundido</span>
               <span style="background:#451a03; color:#fdba74; padding:2px 6px; border-radius:4px;"><strong>2</strong> = 7 impactos</span>
               <span style="background:#0f172a; color:#94a3b8; padding:2px 6px; border-radius:4px; border:1px solid #334155;"><strong>3–6</strong> = Fallo / Inerte</span>`,

          // Chart B3
          'comp-b3-title': isEn ? "CHART [B3]: TARGET DAMAGE" : "TABLA [B3]: DAÑOS AL BLANCO",
          'comp-b3-headers': isEn 
            ? `<th style="padding:4px; border:1px solid #334155;">1d6</th>
               <th style="padding:4px; border:1px solid #334155;">Torpedo</th>
               <th style="padding:4px; border:1px solid #334155;">Deck Gun</th>`
            : `<th style="padding:4px; border:1px solid #334155;">1d6</th>
               <th style="padding:4px; border:1px solid #334155;">Torpedo</th>
               <th style="padding:4px; border:1px solid #334155;">Cañón Cubierta</th>`,
          'comp-b3-tbody': isEn 
            ? `<tr style="border-bottom:1px solid #334155;"><td><strong>1</strong></td><td style="color:#f87171; font-weight:bold;">4 Damage</td><td style="color:#fdba74; font-weight:bold;">3 Damage</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>2</strong></td><td style="color:#fdba74; font-weight:bold;">3 Damage</td><td style="color:#fde047;">2 Damage</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>3</strong></td><td style="color:#fdba74; font-weight:bold;">3 Damage</td><td style="color:#fde047;">2 Damage</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>4</strong></td><td style="color:#fde047;">2 Damage</td><td>1 Damage</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>5</strong></td><td>1 Damage</td><td>1 Damage</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>6</strong></td><td>1 Damage</td><td>1 Damage</td></tr>
               <tr><td><strong>7+</strong></td><td>1 Damage</td><td>1 Damage</td></tr>`
            : `<tr style="border-bottom:1px solid #334155;"><td><strong>1</strong></td><td style="color:#f87171; font-weight:bold;">4 Daños</td><td style="color:#fdba74; font-weight:bold;">3 Daños</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>2</strong></td><td style="color:#fdba74; font-weight:bold;">3 Daños</td><td style="color:#fde047;">2 Daños</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>3</strong></td><td style="color:#fdba74; font-weight:bold;">3 Daños</td><td style="color:#fde047;">2 Daños</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>4</strong></td><td style="color:#fde047;">2 Daños</td><td>1 Daño</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>5</strong></td><td>1 Daño</td><td>1 Daño</td></tr>
               <tr style="border-bottom:1px solid #334155;"><td><strong>6</strong></td><td>1 Daño</td><td>1 Daño</td></tr>
               <tr><td><strong>7+</strong></td><td>1 Daño</td><td>1 Daño</td></tr>`,
          'comp-b3-mods-title': isEn ? "Damage Modifiers (DRM):" : "Modificadores de Daño (DRM):",
          'comp-b3-mods-list': isEn 
            ? `• <strong style="color:#4ade80;">+1</strong> 127mm Deck Gun<br>
               • <strong style="color:#4ade80;">+1</strong> Type 89, Type 92 or Type 6 Torpedoes<br>
               • <strong style="color:#f87171;">-1</strong> Type 97 Torpedo of Midget Submarine`
            : `• <strong style="color:#4ade80;">+1</strong> Cañón de cubierta de 127 mm<br>
               • <strong style="color:#4ade80;">+1</strong> Torpedos Tipo 89, Tipo 92 o Tipo 6<br>
               • <strong style="color:#f87171;">-1</strong> Torpedo Tipo 97 de Minisubmarino`,
          'comp-b3-sink-title': isEn ? "Damage required to SINK:" : "Daño necesario para HUNDIR:",
          'comp-b3-sink-list': isEn 
            ? `<strong>5–7 Damage:</strong> Capital Ship (Battleship / CV)<br>
               <strong>4 Damage:</strong> Ships 10,000+ t<br>
               <strong>3 Damage:</strong> Ships 5,001–9,999 t<br>
               <strong>2 Damage:</strong> Ships 1,001–5,000 t<br>
               <strong>1 Damage:</strong> Ships 1,000 t or less`
            : `<strong>5–7 Daños:</strong> Buque Capital (Acorazado / CV)<br>
               <strong>4 Daños:</strong> Buques de 10,000+ t<br>
               <strong>3 Daños:</strong> Buques de 5,001–9,999 t<br>
               <strong>2 Daños:</strong> Buques de 1,001–5,000 t<br>
               <strong>1 Daño:</strong> Buques de 1,000 t o menos`,

          // Chart B4
          'comp-b4-title': isEn ? "CHART [B4]: ESCORT DETECTION" : "TABLA [B4]: DETECCIÓN POR ESCOLTAS",
          'comp-b4-res-grid': isEn 
            ? `<div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
                 <div style="font-size:0.95rem; color:#4ade80; font-weight:bold;">2–8</div>
                 <div style="font-size:0.80rem; color:#94a3b8;">Not Detected</div>
               </div>
               <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
                 <div style="font-size:0.95rem; color:#fbbf24; font-weight:bold;">9–10</div>
                 <div style="font-size:0.80rem; color:#94a3b8;">Detected</div>
               </div>
               <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
                 <div style="font-size:0.95rem; color:#f87171; font-weight:bold;">11+</div>
                 <div style="font-size:0.80rem; color:#fca5a5;">Detected (+1 Attack)</div>
               </div>`
            : `<div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
                 <div style="font-size:0.95rem; color:#4ade80; font-weight:bold;">2–8</div>
                 <div style="font-size:0.80rem; color:#94a3b8;">No Detectado</div>
               </div>
               <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
                 <div style="font-size:0.95rem; color:#fbbf24; font-weight:bold;">9–10</div>
                 <div style="font-size:0.80rem; color:#94a3b8;">Detectado</div>
               </div>
               <div style="background:#0f172a; border:1px solid #334155; border-radius:4px; padding:4px;">
                 <div style="font-size:0.95rem; color:#f87171; font-weight:bold;">11+</div>
                 <div style="font-size:0.80rem; color:#fca5a5;">Detectado (+1 Ataque)</div>
               </div>`,
          'comp-b4-mods-title': isEn ? "Detection Modifiers (DRM):" : "Modificadores a la Detección (DRM):",
          'comp-b4-mods-list': isEn 
            ? `<strong style="color:#f87171;">+1</strong> Fuel tanks damaged<br>
               <strong style="color:#f87171;">+1</strong> Dive planes damaged<br>
               <strong style="color:#f87171;">+1</strong> Capital ship present<br>
               <strong style="color:#f87171;">+1</strong> Daylight / Steam submarine<br>
               <strong style="color:#f87171;">+1</strong> Daytime Type 95 at Close Range<br>
               <strong style="color:#f87171;">+1</strong> Previous detection in round<br>
               <strong style="color:#f87171;">+1</strong> Close Range<br>
               <strong style="color:#4ade80;">-1</strong> Long Range<br>
               <strong style="color:#f87171;">+1</strong> Night surface attack<br>
               <strong style="color:#f87171;">+1</strong> Simultaneous Bow + Stern firing (1st round)<br>
               <strong style="color:#4ade80;">-1</strong> Exceeding test depth (Test Depth)<br>
               <strong style="color:#4ade80;">-1</strong> In the Indian Ocean<br>
               <strong style="color:#f87171;">+1 / +2 / +3</strong> in years 1943 / 1944 / 1945`
            : `<strong style="color:#f87171;">+1</strong> Tanques de combustible dañados<br>
               <strong style="color:#f87171;">+1</strong> Planos de inmersión averiados<br>
               <strong style="color:#f87171;">+1</strong> Presencia de Buque Capital<br>
               <strong style="color:#f87171;">+1</strong> Submarino a vapor / de día<br>
               <strong style="color:#f87171;">+1</strong> Torpedo T.95 de día a corta distancia<br>
               <strong style="color:#f87171;">+1</strong> Detección previa en el turno<br>
               <strong style="color:#f87171;">+1</strong> A corta distancia<br>
               <strong style="color:#4ade80;">-1</strong> A larga distancia<br>
               <strong style="color:#f87171;">+1</strong> Ataque nocturno en superficie<br>
               <strong style="color:#f87171;">+1</strong> Disparo simultáneo proa + popa (1.er turno)<br>
               <strong style="color:#4ade80;">-1</strong> Exceder profundidad de test (Test Depth)<br>
               <strong style="color:#4ade80;">-1</strong> En el Océano Índico<br>
               <strong style="color:#f87171;">+1 / +2 / +3</strong> en los años 1943 / 1944 / 1945`,
          'comp-b4-note': isEn 
            ? "Standard attacks with 1d6 (1–5); Special with 6 starting 5/44." 
            : "Ataques normales con 1d6 (1–5); Especial con 6 a partir de 5/44.",

          // Chart B5
          'comp-b5-title': isEn ? "CHART [B5]: ESCORT ATTACK" : "TABLA [B5]: ATAQUE DE ESCOLTAS",
          'comp-b5-table': isEn 
            ? `<tr style="border-bottom:1px solid #1e293b;"><td>2–3</td><td style="color:#4ade80;">No Effect</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>4–6</td><td style="color:#fde047;">1 Hit</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>7–8</td><td style="color:#fdba74;">2 Hits</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>9–10</td><td style="color:#f87171;">3 Hits</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>11</td><td style="color:#ef4444; font-weight:bold;">4 Hits</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>12</td><td style="color:#dc2626; font-weight:bold;">5 Hits</td></tr>
               <tr><td>13+</td><td style="background:#450a0a; color:#f87171; font-weight:bold;">Sunk</td></tr>`
            : `<tr style="border-bottom:1px solid #1e293b;"><td>2–3</td><td style="color:#4ade80;">Ineficaz</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>4–6</td><td style="color:#fde047;">1 impacto</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>7–8</td><td style="color:#fdba74;">2 impactos</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>9–10</td><td style="color:#f87171;">3 impactos</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>11</td><td style="color:#ef4444; font-weight:bold;">4 impactos</td></tr>
               <tr style="border-bottom:1px solid #1e293b;"><td>12</td><td style="color:#dc2626; font-weight:bold;">5 impactos</td></tr>
               <tr><td>13+</td><td style="background:#450a0a; color:#f87171; font-weight:bold;">Hundido</td></tr>`,
          'comp-b5-mods-title': isEn ? "Attack Modifiers (DRM):" : "Modificadores al Ataque (DRM):",
          'comp-b5-mods-list': isEn 
            ? `<strong style="color:#f87171;">+1</strong> Fuel tanks damaged<br>
               <strong style="color:#f87171;">+1</strong> Hydrophones damaged<br>
               <strong style="color:#f87171;">+1</strong> Batteries damaged<br>
               <strong style="color:#f87171;">+1/+2</strong> Electric motors damaged<br>
               <strong style="color:#f87171;">+1</strong> Night surface attack (1st round)<br>
               <strong style="color:#f87171;">+1</strong> Detection on 11+<br>
               <strong style="color:#f87171;">+2</strong> Aviation attack`
            : `<strong style="color:#f87171;">+1</strong> Tanques combustible dañados<br>
               <strong style="color:#f87171;">+1</strong> Hidrófonos averiados<br>
               <strong style="color:#f87171;">+1</strong> Baterías dañadas<br>
               <strong style="color:#f87171;">+1/+2</strong> Motores eléctricos averiados<br>
               <strong style="color:#f87171;">+1</strong> Ataque nocturno en superficie (1.er turno)<br>
               <strong style="color:#f87171;">+1</strong> Por detección con 11+<br>
               <strong style="color:#f87171;">+2</strong> Ataque de aviación`,
          'comp-b5-hedge-title': isEn 
            ? "Special: HEDGEHOG Projector (from 5/44)" 
            : "Especial: Lanzador HEDGEHOG (desde 5/44)",
          'comp-b5-hedge-desc': isEn 
            ? `<strong>1–2 = Hit, 3–6 = Miss</strong><br>
               If hit, roll 1d6 again:<br>
               <span style="color:#fdba74;">1 = 5 Hits</span> | <span style="color:#f87171;">2 = 7 Hits</span> | <span style="color:#ef4444; font-weight:bold;">3–6 = Sunk</span>`
            : `<strong>1–2 = Impacto, 3–6 = Fallo</strong><br>
               Si impacta, tirar 1d6 de nuevo:<br>
               <span style="color:#fdba74;">1 = 5 impactos</span> | <span style="color:#f87171;">2 = 7 impactos</span> | <span style="color:#ef4444; font-weight:bold;">3–6 = Hundido</span>`,

          // Chart B7
          'comp-b7-flood-title': isEn ? "Flooding: 1d6" : "Inundación: 1d6",
          'comp-b7-flood-desc': isEn
            ? "Mark 1 box. If all boxes fill, emergency surface and check for scuttling. In each flooding round, roll 1d6 for Engineer:<br><strong>1-4:</strong> Contained | <strong>5-6:</strong> Additional flooding.<br><em>After combat, flooding is completely pumped out.</em>"
            : "Marcar 1 casilla. Si se llenan todas, emerger de emergencia y comprobar si se barrena. En cada ronda de inundación, tirar 1d6 por el Ingeniero:<br><strong>1-4:</strong> Contenida | <strong>5-6:</strong> Inundación adicional.<br><em>Tras el combate, la inundación se achica por completo.</em>",
          'comp-b7-hull-title': isEn ? "Hull Integrity" : "Casco Estructural",
          'comp-b7-hull-desc': isEn
            ? "Mark 1 box. If all hull integrity boxes are marked, submarine sinks.<br><strong>Hull damage is NOT repairable at sea!</strong>"
            : "Marcar 1 casilla. Si se marcan todas las casillas de integridad de casco, el submarino se hunde.<br><strong>¡El daño de casco no es reparable en alta mar!</strong>",
          'comp-b7-engines-title': isEn ? "Diesel & Electric Engines: 1d6" : "Motores Diésel y Eléctricos: 1d6",
          'comp-b7-engines-desc': isEn
            ? "<strong>1 Diesel KO:</strong> Mandatory return to base. Double encounter rolls per zone. <strong>2 Diesels KO:</strong> Scuttled if >1 zone from base, or towed if 1 zone away.<br><strong>1 Electric KO:</strong> +1 on B5 immediately. <strong>2 Electrics KO:</strong> +2 on B5.<br>Repair after combat (1d6 per engine): <strong>1-4:</strong> Repaired | <strong>5-6:</strong> INOP."
            : "<strong>1 Diésel KO:</strong> Regreso obligatorio a base. Doble tirada de encuentros por zona. <strong>2 Diésel KO:</strong> Barrenado si >1 zona de base, o remolcado si dista 1 zona.<br><strong>1 Eléctrico KO:</strong> +1 en B5 de inmediato. <strong>2 Eléctricos KO:</strong> +2 en B5.<br>Reparación tras combate (1d6 por motor): <strong>1-4:</strong> Reparado | <strong>5-6:</strong> INOP.",
          'comp-b7-fuel-title': isEn ? "Fuel Tanks: 1d6" : "Tanques de Combustible: 1d6",
          'comp-b7-fuel-desc': isEn
            ? "Fuel leak. During combat: +1 Detection AND +1 on Chart B5. If unrepaired, mandatory return to base.<br>Repair after combat (1d6): <strong>1-3:</strong> Repaired | <strong>4-6:</strong> INOP."
            : "Fuga de combustible. Durante combate: +1 Detección Y +1 en Tabla B5. Si no se repara, regreso obligatorio a base.<br>Reparación tras combate (1d6): <strong>1-3:</strong> Reparado | <strong>4-6:</strong> INOP.",
          'comp-b7-batteries-title': isEn ? "Batteries: 1d6" : "Baterías: 1d6",
          'comp-b7-batteries-desc': isEn
            ? "No immediate effect. Starting next combat round: +1 on Chart B5.<br>Repair after combat (1d6): <strong>1-4:</strong> Repaired | <strong>5-6:</strong> INOP."
            : "Sin efecto inmediato. A partir de la siguiente ronda de combate: +1 en Tabla B5.<br>Reparación tras combate (1d6): <strong>1-4:</strong> Reparado | <strong>5-6:</strong> INOP.",
          'comp-b7-periscope-title': isEn ? "Periscope: 1d6" : "Periscopio: 1d6",
          'comp-b7-periscope-desc': isEn
            ? "No submerged attacks allowed.<br>Repair after combat (1d6): <strong>1-2:</strong> Repaired | <strong>3-6:</strong> INOP."
            : "No se pueden realizar ataques sumergidos.<br>Reparación tras combate (1d6): <strong>1-2:</strong> Reparado | <strong>3-6:</strong> INOP.",
          'comp-b7-diveplanes-title': isEn ? "Dive Planes: 1d6" : "Planos de Inmersión: 1d6",
          'comp-b7-diveplanes-desc': isEn
            ? "+1 on escort detection rolls. Also -1 to rolls on Chart A4.<br>Repair after combat (1d6): <strong>1-2:</strong> Repaired | <strong>3-6:</strong> INOP."
            : "+1 en tiradas de detección de escoltas. También -1 a tiradas en Tabla A4.<br>Reparación tras combate (1d6): <strong>1-2:</strong> Reparado | <strong>3-6:</strong> INOP.",
          'comp-b7-doors-title': isEn ? "Torpedo Doors: 1d6" : "Compuertas de Torpedos: 1d6",
          'comp-b7-doors-desc': isEn
            ? "Jammed doors; affected tubes cannot fire.<br>Repair after combat (1d6): <strong>1-2:</strong> Repaired | <strong>3-6:</strong> INOP."
            : "Compuertas atascadas; los tubos afectados no pueden disparar.<br>Reparación tras combate (1d6): <strong>1-2:</strong> Reparado | <strong>3-6:</strong> INOP.",
          'comp-b7-radar-title': isEn ? "Radar: 1d6" : "Radar: 1d6",
          'comp-b7-radar-desc': isEn
            ? "Air Search: loses +1 on Chart A4. Surface Search: no 2nd roll on Chart A3.<br>Repair after combat (1d6): <strong>1-3:</strong> Repaired | <strong>4-6:</strong> INOP."
            : "Búsqueda Aérea: pierde el +1 en Tabla A4. Búsqueda Superficie: no hay 2ª tirada en Tabla A3.<br>Reparación tras combate (1d6): <strong>1-3:</strong> Reparado | <strong>4-6:</strong> INOP.",
          'comp-b7-guns-title': isEn ? "Hydrophones, Deck Gun & AA: 1d6" : "Hidrófonos, Cañón y AA: 1d6",
          'comp-b7-guns-desc': isEn
            ? "<strong>Hydrophones:</strong> Cannot take evasive action (+1 on B5).<br><strong>Deck Gun / AA:</strong> Disabled.<br>Repair (1d6): <strong>1-2:</strong> Repaired | <strong>3-6:</strong> INOP."
            : "<strong>Hidrófonos:</strong> No puede maniobrar evasivamente (+1 en B5).<br><strong>Cañón / AA:</strong> Inutilizados.<br>Reparación (1d6): <strong>1-2:</strong> Reparado | <strong>3-6:</strong> INOP.",
          'comp-b7-hangar-title': isEn ? "Radio, Crane & Hangar: 1d6" : "Radio, Grúa y Hangar: 1d6",
          'comp-b7-hangar-desc': isEn
            ? "<strong>Radio:</strong> +4 to rescue if scuttled. -1 to Ko-Hyoteki recovery.<br><strong>Crane:</strong> Cannot recover floatplane.<br><strong>Hangar:</strong> Floatplane destroyed.<br>Repair (1d6): <strong>1-2:</strong> Repaired | <strong>3-6:</strong> INOP."
            : "<strong>Radio:</strong> +4 al rescate si se barrena. -1 a recuperación de Ko-Hyoteki.<br><strong>Grúa:</strong> No puede recuperar hidroavión.<br><strong>Hangar:</strong> Hidroavión destruido.<br>Reparación (1d6): <strong>1-2:</strong> Reparado | <strong>3-6:</strong> INOP.",
          'comp-b7-crew-injury-title': isEn
            ? "Crew Casualties (2d6 Station, 1d6 Severity) [Rule 8.6]"
            : "Bajas en la Dotación (2d6 Puesto, 1d6 Gravedad) [Regla 8.6]",
          'comp-b7-crew-station': isEn
            ? `<div style="border:1px solid rgba(239,68,68,0.3); border-radius:6px; overflow:hidden; background:rgba(15,23,42,0.7);">
  <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
    <thead>
      <tr style="background:rgba(239,68,68,0.25); color:#fca5a5; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px;">
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:45px; text-align:center;">2d6</th>
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:155px;">Station Affected</th>
        <th style="padding:5px 8px;">Operational Effects (SW / KIA)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">2</td>
        <td style="padding:4px 8px; font-weight:bold; color:#fca5a5; border-right:1px solid rgba(239,68,68,0.2);">Captain (Commander)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">XO takes command; <strong style="color:#f87171;">Detection +1</strong>, <strong style="color:#f87171;">Torpedo To-Hit +1</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(30,41,59,0.35);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">3</td>
        <td style="padding:4px 8px; font-weight:bold; color:#93c5fd; border-right:1px solid rgba(239,68,68,0.2);">Chief Engineer</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Repair and flooding recovery rolls receive <strong style="color:#f87171;">+1 DRM</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">4</td>
        <td style="padding:4px 8px; font-weight:bold; color:#93c5fd; border-right:1px solid rgba(239,68,68,0.2);">Executive Officer (XO)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">If acting as commander, next officer assumes command.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(30,41,59,0.35);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">5</td>
        <td style="padding:4px 8px; font-weight:bold; color:#f472b6; border-right:1px solid rgba(239,68,68,0.2);">Medical Officer</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Seriously Wounded (SW) die (KIA) after each transit box on <strong style="color:#f87171;">1d6 &ge; 4</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">6–10</td>
        <td style="padding:4px 8px; font-weight:bold; color:#e2e8f0; border-right:1px solid rgba(239,68,68,0.2);">Generic Crew (#1 to #5)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">If all generic crew boxes are SW/KIA: <strong style="color:#f87171;">Torpedo To-Hit +1</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(30,41,59,0.35);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">11</td>
        <td style="padding:4px 8px; font-weight:bold; color:#67e8f9; border-right:1px solid rgba(239,68,68,0.2);">Navigator</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Mandatory abort and return to base if acting as commander.</td>
      </tr>
      <tr>
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">12</td>
        <td style="padding:4px 8px; font-weight:bold; color:#c084fc; border-right:1px solid rgba(239,68,68,0.2);">Pilot (Plane/Midget/Kaiten)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Special craft or mission inoperable if all pilots become casualties.</td>
      </tr>
    </tbody>
  </table>
</div>`
            : `<div style="border:1px solid rgba(239,68,68,0.3); border-radius:6px; overflow:hidden; background:rgba(15,23,42,0.7);">
  <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
    <thead>
      <tr style="background:rgba(239,68,68,0.25); color:#fca5a5; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px;">
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:45px; text-align:center;">2d6</th>
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:155px;">Puesto Afectado</th>
        <th style="padding:5px 8px;">Efectos Operativos (HG / KIA)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">2</td>
        <td style="padding:4px 8px; font-weight:bold; color:#fca5a5; border-right:1px solid rgba(239,68,68,0.2);">Comandante (Capitán)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Primer Oficial asume mando; <strong style="color:#f87171;">Detección +1</strong>, <strong style="color:#f87171;">Impacto torpedo +1</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(30,41,59,0.35);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">3</td>
        <td style="padding:4px 8px; font-weight:bold; color:#93c5fd; border-right:1px solid rgba(239,68,68,0.2);">Jefe Máquinas (Ingeniero)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Tiradas de reparación e inundación reciben <strong style="color:#f87171;">+1 MTD</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">4</td>
        <td style="padding:4px 8px; font-weight:bold; color:#93c5fd; border-right:1px solid rgba(239,68,68,0.2);">Primer Oficial (Segundo)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Si ejercía el mando, el 3.er oficial asume la jefatura.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(30,41,59,0.35);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">5</td>
        <td style="padding:4px 8px; font-weight:bold; color:#f472b6; border-right:1px solid rgba(239,68,68,0.2);">Oficial Médico</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Heridos graves mueren (KIA) tras cada casilla de viaje con <strong style="color:#f87171;">1d6 &ge; 4</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">6–10</td>
        <td style="padding:4px 8px; font-weight:bold; color:#e2e8f0; border-right:1px solid rgba(239,68,68,0.2);">Dotación General (#1 a #5)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Si todas las casillas son HG/KIA: <strong style="color:#f87171;">Impacto torpedo +1</strong>.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(30,41,59,0.35);">
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">11</td>
        <td style="padding:4px 8px; font-weight:bold; color:#67e8f9; border-right:1px solid rgba(239,68,68,0.2);">Navegante</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Aborto obligatorio y regreso a base si ejercía de capitán.</td>
      </tr>
      <tr>
        <td style="padding:4px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">12</td>
        <td style="padding:4px 8px; font-weight:bold; color:#c084fc; border-right:1px solid rgba(239,68,68,0.2);">Piloto (Avión/Minisub/Kaiten)</td>
        <td style="padding:4px 8px; color:#cbd5e1;">Misión especial o vehículo inutilizado si todos son baja.</td>
      </tr>
    </tbody>
  </table>
</div>`,
          'comp-b7-crew-severity': isEn
            ? `<div style="border:1px solid rgba(239,68,68,0.3); border-radius:6px; overflow:hidden; background:rgba(15,23,42,0.7); display:flex; flex-direction:column; justify-content:space-between; height:100%;">
  <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
    <thead>
      <tr style="background:rgba(239,68,68,0.25); color:#fca5a5; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px;">
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:40px; text-align:center;">1d6</th>
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:135px;">Severity</th>
        <th style="padding:5px 8px;">Operational Effect</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(56,189,248,0.08);">
        <td style="padding:5px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">1–3</td>
        <td style="padding:5px 8px; font-weight:bold; color:#38bdf8; border-right:1px solid rgba(239,68,68,0.2);">LW (Light Wound)</td>
        <td style="padding:5px 8px; color:#93c5fd;">No operational combat penalty.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(245,158,11,0.10);">
        <td style="padding:5px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">4–5</td>
        <td style="padding:5px 8px; font-weight:bold; color:#fbbf24; border-right:1px solid rgba(239,68,68,0.2);">SW (Serious Wound)</td>
        <td style="padding:5px 8px; color:#fde047;">Incapacitated for duty.</td>
      </tr>
      <tr style="background:rgba(239,68,68,0.15);">
        <td style="padding:5px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">6</td>
        <td style="padding:5px 8px; font-weight:bold; color:#ef4444; border-right:1px solid rgba(239,68,68,0.2);">KIA (Killed)</td>
        <td style="padding:5px 8px; color:#fca5a5;">Permanent combat casualty.</td>
      </tr>
    </tbody>
  </table>
  <div style="padding:8px 10px; font-size:0.73rem; color:#fecaca; background:rgba(239,68,68,0.18); border-top:1px solid rgba(239,68,68,0.3); line-height:1.4;">
    ⚠️ <strong>Cumulative rule:</strong> 2x LW = SW &bull; 2x SW = KIA
  </div>
</div>`
            : `<div style="border:1px solid rgba(239,68,68,0.3); border-radius:6px; overflow:hidden; background:rgba(15,23,42,0.7); display:flex; flex-direction:column; justify-content:space-between; height:100%;">
  <table style="width:100%; border-collapse:collapse; font-size:0.75rem; text-align:left;">
    <thead>
      <tr style="background:rgba(239,68,68,0.25); color:#fca5a5; font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px;">
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:40px; text-align:center;">1d6</th>
        <th style="padding:5px 8px; border-right:1px solid rgba(239,68,68,0.3); width:135px;">Gravedad</th>
        <th style="padding:5px 8px;">Efecto Operativo</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(56,189,248,0.08);">
        <td style="padding:5px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">1–3</td>
        <td style="padding:5px 8px; font-weight:bold; color:#38bdf8; border-right:1px solid rgba(239,68,68,0.2);">HL (Herida Leve)</td>
        <td style="padding:5px 8px; color:#93c5fd;">Sin efecto operativo de combate.</td>
      </tr>
      <tr style="border-bottom:1px solid rgba(239,68,68,0.15); background:rgba(245,158,11,0.10);">
        <td style="padding:5px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">4–5</td>
        <td style="padding:5px 8px; font-weight:bold; color:#fbbf24; border-right:1px solid rgba(239,68,68,0.2);">HG (Herida Grave)</td>
        <td style="padding:5px 8px; color:#fde047;">Incapacitado para el servicio.</td>
      </tr>
      <tr style="background:rgba(239,68,68,0.15);">
        <td style="padding:5px 8px; text-align:center; font-weight:bold; color:var(--gold-400); border-right:1px solid rgba(239,68,68,0.2);">6</td>
        <td style="padding:5px 8px; font-weight:bold; color:#ef4444; border-right:1px solid rgba(239,68,68,0.2);">KIA (Muerto)</td>
        <td style="padding:5px 8px; color:#fca5a5;">Baja mortal permanente definitiva.</td>
      </tr>
    </tbody>
  </table>
  <div style="padding:8px 10px; font-size:0.73rem; color:#fecaca; background:rgba(239,68,68,0.18); border-top:1px solid rgba(239,68,68,0.3); line-height:1.4;">
    ⚠️ <strong>Regla acumulativa:</strong> 2x HL = HG &bull; 2x HG = KIA
  </div>
</div>`,
          'comp-b7-crew-effects': '',

          // Target Charts T1 - T3
          'comp-t1-title': isEn ? "CHART [T1]: SMALL FREIGHTER TARGETS (1d100)" : "TABLA [T1]: OBJETIVOS MERCANTES PEQUEÑOS (1d100)",
          'comp-t1-subtitle': isEn ? "Small Freighters (1–100) • 1–4 on target roll in Chart [A3]" : "Mercantes Pequeños (1–100) • 1–4 en tirada de buque en Tabla [A3]",
          'comp-t1-btn': isEn ? "🎲 Roll 1d100 [T1]" : "🎲 Tirar 1d100 [T1]",
          'comp-t2-title': isEn ? "CHART [T2]: LARGE FREIGHTER & TANKER TARGETS (1d100)" : "TABLA [T2]: OBJETIVOS MERCANTES GRANDES Y PETROLEROS (1d100)",
          'comp-t2-subtitle': isEn ? "Large Freighters & Tankers (T) (1–100) • 5–6 on target roll in Chart [A3]" : "Mercantes Grandes y Petroleros (T) (1–100) • 5–6 en tirada de buque en Tabla [A3]",
          'comp-t2-btn': isEn ? "🎲 Roll 1d100 [T2]" : "🎲 Tirar 1d100 [T2]",
          'comp-t3-title': isEn ? "CHART [T3]: WARSHIP TARGETS (1d100)" : "TABLA [T3]: OBJETIVOS BUQUES DE GUERRA (1d100)",
          'comp-t3-subtitle': isEn ? "Destroyers (DD), Frigates (DE), Corvettes & Allied Submarines (1–100)" : "Destructores (DD), Fragatas (DE), Corbetas y Submarinos Aliados (1–100)",
          'comp-t3-btn': isEn ? "🎲 Roll 1d100 [T3]" : "🎲 Tirar 1d100 [T3]",

          // Target Charts T4 - T5
          'comp-t4-title': isEn ? "CHART [T4]: CAPITAL SHIP TARGETS" : "TABLA [T4]: OBJETIVOS BUQUES CAPITALES",
          'comp-t4-subtitle': isEn 
            ? "Battleships (BB), Fleet Aircraft Carriers (CV), CVL & CVE by year" 
            : "Acorazados (BB), Portaaviones de Flota (CV), CVL y CVE por año",
          'comp-t4-leg-nopoint': isEn 
            ? "● No dot: <strong>5 pts to sink</strong>" 
            : "● Sin puntos: <strong>5 pts para hundir</strong>",
          'comp-t4-leg-1point': isEn 
            ? "● 1 dot: <strong>6 pts to sink</strong>" 
            : "● 1 punto: <strong>6 pts para hundir</strong>",
          'comp-t4-leg-2point': isEn 
            ? "● 2 dots: <strong>7 pts to sink</strong>" 
            : "● 2 puntos: <strong>7 pts para hundir</strong>",
          'comp-t4-leg-arrow': isEn 
            ? "➡ White Arrow: <strong>Fast Capital Ship</strong>" 
            : "➡ Flecha Blanca: <strong>Buque Capital Rápido</strong>",
          'comp-t4-tab-all': isEn ? "📋 View All" : "📋 Ver Todas",
          'comp-t5-title': isEn ? "CHART [T5]: CW WARSHIPS" : "TABLA [T5]: BUQUES DE LA COMMONWEALTH",
          'comp-t5-subtitle': isEn ? "Commonwealth (1d20)" : "Commonwealth (1d20)"
        };

        Object.entries(sec2Map).forEach(([id, text]) => {
          const el = document.getElementById(id);
          if (el) el.innerHTML = text;
        });

        // Update Chart T4 Table column headers across all eras
        document.querySelectorAll('#comp-t4-tables-container table thead tr').forEach(tr => {
          tr.innerHTML = isEn
            ? `<th style="padding:4px 6px; text-align:center; width:30px;">Die</th>
               <th style="padding:4px 6px; text-align:center; width:48px;">Type</th>
               <th style="padding:4px 6px;">Capital Ship</th>
               <th style="padding:4px 6px; text-align:right; width:75px;">Tonnage</th>
               <th style="padding:4px 6px; text-align:center; width:55px;">Sink</th>
               <th style="padding:4px 6px; text-align:center; width:55px;">Speed</th>`
            : `<th style="padding:4px 6px; text-align:center; width:30px;">Dado</th>
               <th style="padding:4px 6px; text-align:center; width:48px;">Tipo</th>
               <th style="padding:4px 6px;">Buque Capital</th>
               <th style="padding:4px 6px; text-align:right; width:75px;">Tonelaje</th>
               <th style="padding:4px 6px; text-align:center; width:55px;">Hundir</th>
               <th style="padding:4px 6px; text-align:center; width:55px;">Veloc.</th>`;
        });

        // Update Chart T4 era block titles and ship counts
        const t4Titles = {
          't4-block-1941_US': { title: '⚓ 1941 U.S. Navy Capital Ships (1d10)', count: isEn ? '10 Official Ships' : '10 Buques Oficiales' },
          't4-block-1941_UK': { title: '⚓ 1941 Royal Navy Capital Ships (1d6)', count: isEn ? '6 Official Ships' : '6 Buques Oficiales' },
          't4-block-1942_US': { title: '⚓ 1942 U.S. Navy Capital Ships (1d10)', count: isEn ? '10 Official Ships' : '10 Buques Oficiales' },
          't4-block-1942_UK': { title: '⚓ 1942 Royal Navy Capital Ships (1d6)', count: isEn ? '6 Official Ships' : '6 Buques Oficiales' },
          't4-block-1943_45_US': { title: '⚓ 1943–45 U.S. Navy Capital Ships (1d20)', count: isEn ? '20 Official Ships' : '20 Buques Oficiales' }
        };
        Object.entries(t4Titles).forEach(([blockId, info]) => {
          const block = document.getElementById(blockId);
          if (block) {
            const headerDiv = block.querySelector('div:first-child');
            if (headerDiv) {
              const spans = headerDiv.querySelectorAll('span');
              if (spans.length >= 2) {
                spans[0].innerText = info.title;
                spans[1].innerText = info.count;
              }
            }
          }
        });
      }

      function applyPhase1Language(isEn) {
        const labels = {
          'p1-guide-label': isEn ? '📋 Phase Guide' : '📋 Guía de Fase',
          'p1-rules-pill': isEn ? '[Rules 4.0, 6.0 Step 1, 7.14 • Chart A1]' : '[Reglas 4.0, 6.0 Paso 1, 7.14 • Tabla A1]',
          'p1-c1-title': isEn ? '1. Operational Area Assignment' : '1. Asignación del Área de Operaciones',
          'p1-lbl-month': isEn ? 'Historical Month:' : 'Mes Histórico:',
          'p1-lbl-base': isEn ? 'Departure Naval Base (Home Port):' : 'Base Naval de Salida (Puerto de Atraque):',
          'p1-lbl-roll': isEn ? 'Patrol Area Assignment [Chart A1]:' : 'Asignación de Área de Patrulla [Tabla A1]:',
          'p1-roll-help': isEn ? 'Roll 2d6 or select your destination from the dropdown:' : 'Tira 2d6 o selecciona tu destino en el desplegable:',
          'p1-roll-btn-label': isEn ? 'Roll [A1]' : 'Tirar [A1]',
          'p1-lbl-manual-a1': isEn ? 'Tabletop:' : 'Mesa:',
          'p1-btn-apply-a1': isEn ? 'Apply' : 'Aplicar',
          'p1-help-request': isEn ? '★ Rule 7.14: A Commander (中佐) may request an area on 1 on 1d6. A Captain (大佐) on 1–2 on 1d6. Select an area from the dropdown or roll on Chart A1.' : '★ Regla 7.14: Un Comandante (中佐) puede solicitar su área con 1 en 1d6. Un Capitán (大佐) con 1–2 en 1d6. Puedes elegir el área en el desplegable o tirar en la Tabla A1.',
          'p1-c2-title': isEn ? '2. Major Historical Event & Special Mission [7.0]' : '2. Gran Evento Histórico y Misión Especial [7.0]',
          'p1-lbl-me': isEn ? 'Major Event in the Area?' : '¿Gran Evento en el Área?',
          'p1-mission-label': isEn ? 'Operational Mission:' : 'Misión Operativa:',
          'p1-lbl-transits': isEn ? 'Additional Transit Boxes:' : 'Casillas de Tránsito Adicionales:',
          'p1-a1-europe-note': isEn ? '* <strong>Europe (Yanagi Mission):</strong> Requires a long-range submarine (Types A/B).' : '* <strong>Europa (Misión Yanagi):</strong> Requiere submarino con gran autonomía (Tipos A/B).',
          'p1-a1-panama-note': isEn ? '** <strong>Panama Canal:</strong> Historical Sen-Toku mission (I-400 / AM).' : '** <strong>Canal de Panamá:</strong> Misión histórica Sen-Toku (I-400 / AM).',
          'p1-a1-click-note': isEn ? '💡 Click any cell in the active column to request or assign that area (Rule 7.14).' : '💡 Clic en cualquier celda de la columna activa para solicitar o fijar esa área (Regla 7.14).'
        };
        Object.entries(labels).forEach(([id, text]) => {
          const el = document.getElementById(id);
          if (el) {
            if (id.startsWith('p1-a1-')) el.innerHTML = text;
            else el.innerText = text;
          }
        });

        if (typeof buildWorkflowMonthSelect === 'function') buildWorkflowMonthSelect();
        if (typeof populateAreaDropdown === 'function') populateAreaDropdown();
        if (typeof updateBasesForDate === 'function') updateBasesForDate(campaignState.workflow.selectedMonth);
        if (typeof updateSpecialEventsForMonthArea === 'function') updateSpecialEventsForMonthArea();
        if (typeof updateSpecialMissionCheck === 'function') updateSpecialMissionCheck();
      }
    }

    function applyChartK1Language(isEn) {
      // Mat Header
      const titleEl = document.getElementById('k1-mat-title');
      if (titleEl) {
        titleEl.innerText = isEn ? "CHART K1: CAPTAIN & CREW SKILL STATUS" : "TABLA K1: ESTADO DE HABILIDADES DEL CAPITÁN Y TRIPULACIÓN";
      }

      // Section Labels
      const secMap = {
        'k1-sec-command': isEn ? "Command Ability" : "Habilidad de Mando",
        'k1-sec-midget': isEn ? "Midget Sub Skills" : "Habilidades de Minisubmarinos",
        'k1-sec-air1': isEn ? "Air Crew (Seiran #1)" : "Dotación Aérea (Seiran #1)",
        'k1-sec-captain': isEn ? "Captain Core Skills" : "Habilidades Clave del Capitán",
        'k1-sec-status': isEn ? "Sub & Status Markers" : "Marcadores de Sumergible y Estado",
        'k1-sec-air2': isEn ? "Air Crew (Aichi #2)" : "Dotación Aérea (Aichi #2)",
        'k1-sec-air3': isEn ? "Air Crew (Aichi #3)" : "Dotación Aérea (Aichi #3)",
        'k1-sec-subcrew': isEn ? "Submarine Crew Skills" : "Habilidades de la Tripulación"
      };
      for (const [id, val] of Object.entries(secMap)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
      }

      // Uniform Chest Labels
      const rankLbl = document.getElementById('k1-lbl-rank');
      if (rankLbl) rankLbl.innerText = isEn ? "RANK:" : "RANGO:";
      const cycleLbl = document.getElementById('k1-lbl-cycle');
      if (cycleLbl) cycleLbl.innerText = isEn ? "[Click to Cycle]" : "[Clic para Cambiar]";

      // Crew Roles
      const roleMap = {
        'k1-role-xo': isEn ? "XO (Executive Officer)" : "Segundo Oficial (XO)",
        'k1-role-eng': isEn ? "Engineer" : "Jefe de Máquinas",
        'k1-role-nav': isEn ? "Navigator" : "Navegante",
        'k1-role-med': isEn ? "Medic" : "Médico"
      };
      for (const [id, val] of Object.entries(roleMap)) {
        const el = document.getElementById(id);
        if (el) el.innerText = val;
      }

      // Tokens with dual spans
      const dualTokens = {
        'token-cap-shibumi': {
          title: "Shibumi",
          sub: isEn ? "(Stealth)" : "(Sigilo)"
        },
        'token-cap-leadership': {
          title: isEn ? "Leadership" : "Liderazgo",
          sub: isEn ? "(Morale)" : "(Moral)"
        },
        'token-cap-torp': {
          title: isEn ? "Torpedo Gunnery" : "Tácticas Torpedos",
          sub: isEn ? "(+1 Hit)" : "(+1 Impacto)"
        }
      };
      for (const [id, data] of Object.entries(dualTokens)) {
        const el = document.getElementById(id);
        if (el) {
          const spans = el.querySelectorAll('span');
          if (spans.length >= 2) {
            spans[0].innerText = data.title;
            spans[1].innerText = data.sub;
          }
        }
      }

      // Optional ability token with star badge
      const optEl = document.getElementById('token-optional');
      if (optEl) {
        const spans = optEl.querySelectorAll('span');
        if (spans.length >= 2) {
          spans[1].innerText = isEn ? "Optional Ability" : "Habilidad Opcional";
        }
      }

      // Single span tokens
      const tokenMap = {
        'token-midget-torp': isEn ? "Midget Torpedo Gunnery" : "Tiro Torpedero Minisub",
        'token-midget-boat': isEn ? "Boat Handling" : "Maniobra Redes / Barca",
        'token-midget-comms': isEn ? "Superior Comms" : "Comunicaciones Superiores",
        'token-air1-weap': isEn ? "Weapons Expert" : "Experto en Armas",
        'token-air1-maint': isEn ? "Aircraft Maint." : "Mantenimiento Avión",
        'token-air1-acm': isEn ? "A.C.M." : "Maniobra Aérea (ACM)",
        'token-air1-nav': isEn ? "Aerial Nav." : "Navegación Aérea",
        'token-medal-gk4': isEn ? "Golden Kite (4th)" : "Milano de Oro (4.ª)",
        'token-medal-rising': isEn ? "Rising Sun" : "Sol Naciente",
        'token-medal-wound': isEn ? "Wound Badge" : "Insignia de Herido",
        'token-medal-gea': isEn ? "GEA War Medal" : "Medalla Gran Asia",
        'token-medal-gk5': isEn ? "Golden Kite (5th)" : "Milano de Oro (5.ª)",
        'token-medal-sub': isEn ? "Sub Badge" : "Insignia de Sumergible",
        'token-medal-sacred': isEn ? "Sacred Treasure" : "Tesoro Sagrado",
        'token-sub-upgrades': isEn ? "Sub Upgrade Markers" : "Mejoras de Sumergible",
        'token-penalty-promo': isEn ? "-2 Promotion" : "-2 a la Promoción",
        'token-maneki-neko': isEn ? "🐱 Maneki Neko (Lucky Charm)" : "🐱 Maneki Neko (Amuleto)",
        'token-at-port': isEn ? "At Port" : "En Puerto",
        'token-air2-weap': isEn ? "Weapons Expert" : "Experto en Armas",
        'token-air2-maint': isEn ? "Aircraft Maint." : "Mantenimiento Avión",
        'token-air2-acm': isEn ? "A.C.M." : "Maniobra Aérea (ACM)",
        'token-air2-nav': isEn ? "Aerial Nav." : "Navegación Aérea",
        'token-air3-weap': isEn ? "Weapons Expert" : "Experto en Armas",
        'token-air3-maint': isEn ? "Aircraft Maint." : "Mantenimiento Avión",
        'token-air3-acm': isEn ? "A.C.M." : "Maniobra Aérea (ACM)",
        'token-air3-nav': isEn ? "Aerial Nav." : "Navegación Aérea",
        'token-xo-expert': isEn ? "Expert" : "Experto",
        'token-xo-vigilant': isEn ? "Vigilant" : "Vigilante",
        'token-xo-deckgun': isEn ? "Deck Gun Expert" : "Experto Cañón Cubierta",
        'token-xo-aagun': isEn ? "AA Gun Expert" : "Experto Artillería AA",
        'token-eng-expert': isEn ? "Expert" : "Experto",
        'token-eng-mech': isEn ? "Mech. Genius" : "Genio Mecánico",
        'token-eng-keen': isEn ? "Keen Judgment" : "Juicio Certero",
        'token-nav-expert': isEn ? "Expert" : "Experto",
        'token-med-expert': isEn ? "Expert" : "Experto"
      };

      for (const [id, val] of Object.entries(tokenMap)) {
        const el = document.getElementById(id);
        if (el) {
          const span = el.querySelector('span');
          if (span) span.innerText = val;
        }
      }
    }

    function applyPhase3Language(isEn) {
      // Header banner
      const elP3T = document.getElementById('p3-title');
      if (elP3T) elP3T.innerText = isEn ? "PHASE 3: SHIP ENCOUNTER & NAVAL COMBAT [RULES 8.1 - 8.2]" : "FASE 3: ENCUENTRO CON BARCOS Y COMBATE NAVAL [REGLAS 8.1 - 8.2]";
      const elTopBtnShip = document.getElementById('p3-top-btn-ship-workflow');
      if (elTopBtnShip) elTopBtnShip.innerText = isEn ? "View Ship Combat Workflow [8.1 - 8.2]" : "Ver Workflow Completo de Barcos [8.1 - 8.2]";
      const elCardBtnShip = document.getElementById('p3-card-btn-ship-workflow');
      if (elCardBtnShip) elCardBtnShip.innerText = isEn ? "View Ship Combat Workflow [8.1 - 8.2]" : "Ver Workflow Completo de Barcos [8.1 - 8.2]";
      const elQuickBarT = document.getElementById('p3-quickbar-title');
      if (elQuickBarT) elQuickBarT.innerText = isEn ? "Official Naval Combat Sequence [Rules 8.1 - 8.2]" : "Secuencia Oficial de Combate Naval [Reglas 8.1 - 8.2]";
      const elQuickBarSub = document.getElementById('p3-quickbar-sub');
      if (elQuickBarSub) elQuickBarSub.innerText = isEn ? "Step-by-step protocol: Targets T1-T5, Attack B1-B3, Hits B4, and Escorts B5" : "Protocolo paso a paso: Blancos T1-T5, Ataque B1-B3, Impactos B4 y Escoltas B5";
      const elP3B1B6 = document.getElementById('p3-btn-b1b6');
      if (elP3B1B6) elP3B1B6.innerText = isEn ? "View B1-B6 Charts" : "Ver Tablas B1-B6 Oficiales";
      const elP3Seq = document.getElementById('p3-btn-seq');
      if (elP3Seq) elP3Seq.innerText = isEn ? "Sequence of Play Card" : "Carta de Secuencia";
      const elP3Rules = document.getElementById('p3-rules-pill');
      if (elP3Rules) elP3Rules.innerText = isEn ? "[Rules 8.1 - 8.2 • Sheet H1 • Charts T1-T5, B1-B6]" : "[Reglas 8.1 - 8.2 • Hoja H1 • Tablas T1-T5, B1-B6]";

      // Step 0: Encounter Type
      const elS0T = document.getElementById('p3-step0-title');
      if (elS0T) elS0T.innerText = isEn ? "Step 0: Encounter Type Rolled [Rule 8.1.1 & Chart A3]" : "Paso 0: Tipo de Encuentro Ocurrido [Regla 8.1.1 & Tabla A3]";
      const elEncLbl = document.getElementById('p3-lbl-enc-type');
      if (elEncLbl) elEncLbl.innerText = isEn ? "Contact in Sector:" : "Contacto en Casilla:";
      const elChgLbl = document.getElementById('p3-lbl-change-to');
      if (elChgLbl) elChgLbl.innerText = isEn ? "Change to:" : "Cambiar a:";
      if (typeof updatePhase3EncounterUI === 'function') updatePhase3EncounterUI();

      // Step 1: Target Identification
      const elS1T = document.getElementById('p3-step1-title');
      if (elS1T) elS1T.innerText = isEn ? "Step 1: Target Identification & Time of Day [8.1.3 - 8.1.10]" : "Paso 1: Identificación y Momento del Día [8.1.3 - 8.1.10]";
      const elTgtLbl = document.getElementById('p3-target-lbl');
      if (elTgtLbl) elTgtLbl.innerText = isEn ? "Ship / Contact Generated:" : "Buque / Contacto Generado:";
      const elBtnGen = document.getElementById('p3-btn-gen-target');
      if (elBtnGen) elBtnGen.innerText = isEn ? "🎯 Generate Target by Contact [T1-T5]" : "🎯 Generar Blanco Según Contacto [T1-T5]";
      const elBtnRollSize = document.getElementById('p3-btn-roll-size-lbl');
      if (elBtnRollSize) elBtnRollSize.innerText = isEn ? "Roll 1d6 Ship Size [1-4: T1 • 5-6: T2]" : "Tirar 1d6 Tamaño [1-4: T1 • 5-6: T2]";
      const elManSizeLbl = document.getElementById('p3-lbl-manual-size');
      if (elManSizeLbl) elManSizeLbl.innerText = isEn ? "Tabletop (1d6 Size):" : "Mesa (1d6 Tamaño):";

      const elQk1 = document.getElementById('p3-quick-t1');
      if (elQk1) { elQk1.innerText = isEn ? "T1 Small" : "T1 Peq"; elQk1.title = isEn ? "Small Freighters (1d100)" : "Cargueros Pequeños (1d100)"; }
      const elQk2 = document.getElementById('p3-quick-t2');
      if (elQk2) { elQk2.innerText = isEn ? "T2 Large" : "T2 Gde"; elQk2.title = isEn ? "Large Freighters / Tankers (1d100)" : "Cargueros Grandes / Petroleros (1d100)"; }
      const elQk3 = document.getElementById('p3-quick-t3');
      if (elQk3) { elQk3.innerText = isEn ? "T3 Warship" : "T3 Guerra"; elQk3.title = isEn ? "US Warships (1d100)" : "Buques de Guerra EE.UU. (1d100)"; }
      const elQk4 = document.getElementById('p3-quick-t4');
      if (elQk4) { elQk4.innerText = isEn ? "T4 Capital" : "T4 Capital"; elQk4.title = isEn ? "Capital Ships (Battleships / Carriers)" : "Buques Capitales (Acorazados / Portaaviones)"; }
      const elQk5 = document.getElementById('p3-quick-t5');
      if (elQk5) { elQk5.innerText = isEn ? "T5 CW" : "T5 CW"; elQk5.title = isEn ? "Commonwealth Ships (1d20)" : "Buques Commonwealth (1d20)"; }

      const elP3ManLbl = document.getElementById('p3-lbl-manual-t');
      if (elP3ManLbl) elP3ManLbl.innerText = isEn ? "Tabletop (1d100):" : "Mesa (1d100):";
      const elP3TgtTblTitle = document.getElementById('p3-tgt-table-title');
      if (elP3TgtTblTitle) elP3TgtTblTitle.innerText = isEn ? "📋 TARGET DETERMINATION SUMMARY (RULE 8.1.2)" : "📋 RESUMEN DE DETERMINACIÓN DE BLANCOS (REGLA 8.1.2)";
      const elP3ThEnc = document.getElementById('p3-th-tgt-enc');
      if (elP3ThEnc) elP3ThEnc.innerText = isEn ? "Encounter [A3]" : "Encuentro [A3]";
      const elP3ThDie = document.getElementById('p3-th-tgt-die');
      if (elP3ThDie) elP3ThDie.innerText = isEn ? "1d6 Die" : "1d6";
      const elP3ThChart = document.getElementById('p3-th-tgt-chart');
      if (elP3ThChart) elP3ThChart.innerText = isEn ? "Chart" : "Tabla";
      const elP3ThType = document.getElementById('p3-th-tgt-type');
      if (elP3ThType) elP3ThType.innerText = isEn ? "Type & Escort" : "Tipo & Escolta";

      const elTodLbl = document.getElementById('p3-tod-lbl');
      if (elTodLbl) elTodLbl.innerText = isEn ? "Time of Day (1-3 Day, 4-6 Night):" : "Momento del Día (1-3 Día, 4-6 Noche):";
      const elTodDay = document.getElementById('p3-tod-opt-day');
      if (elTodDay) elTodDay.innerText = isEn ? "Day [Roll 1-3]" : "Día [Tirada 1-3]";
      const elTodNight = document.getElementById('p3-tod-opt-night');
      if (elTodNight) elTodNight.innerText = isEn ? "Night [Roll 4-6]" : "Noche [Tirada 4-6]";

      // Step 2: Range Selection
      const elS2T = document.getElementById('p3-step2-title');
      if (elS2T) elS2T.innerText = isEn ? "Step 2: Range Selection [8.2.1]" : "Paso 2: Selección de Alcance [8.2.1]";
      const elRngLbl = document.getElementById('p3-range-lbl');
      if (elRngLbl) elRngLbl.innerText = isEn ? "Firing Range:" : "Alcance de Fuego:";
      const elRngMed = document.getElementById('p3-range-opt-med');
      if (elRngMed) elRngMed.innerText = isEn ? "Medium Range (Safe, no prior escort fire)" : "Alcance Medio (Seguro, sin tiro previo escolta)";
      const elRngClose = document.getElementById('p3-range-opt-close');
      if (elRngClose) elRngClose.innerText = isEn ? "Close Range (Requires infiltration 2d6 ≤ 9)" : "Corta Distancia (Requiere infiltración 2d6 ≤ 9)";
      const elRngLong = document.getElementById('p3-range-opt-long');
      if (elRngLong) elRngLong.innerText = isEn ? "Long Range (-2 To-Hit penalty)" : "Larga Distancia (-2 a la puntería)";
      const elInfilt = document.getElementById('wf-infilt-res');
      if (elInfilt) elInfilt.innerText = isEn ? "★ Close Range Infiltration: 2d6 ≤ 9 on [B4]. If failed, escorts attack immediately without firing salvo!" : "★ Infiltración a Corta Distancia: 2d6 ≤ 9 en [B4]. Si falla, ¡las escoltas atacan de inmediato sin disparar!";

      // Step 3: Attack Mode
      const elS3T = document.getElementById('p3-step3-title');
      if (elS3T) elS3T.innerText = isEn ? "Step 3: Attack Mode [8.2.2]" : "Paso 3: Modalidad de Ataque [8.2.2]";
      const elModeLbl = document.getElementById('p3-mode-lbl');
      if (elModeLbl) elModeLbl.innerText = isEn ? "Attack Mode:" : "Modalidad:";
      const elModeSub = document.getElementById('p3-mode-opt-sub');
      if (elModeSub) elModeSub.innerText = isEn ? "Submerged Torpedo Attack" : "Ataque en Inmersión (Torpedos)";
      const elModeSurf = document.getElementById('p3-mode-opt-surf');
      if (elModeSurf) elModeSurf.innerText = isEn ? "Night Surface Attack (Allows stern salvo at +1)" : "Superficie Nocturna (Permite salva popa a +1)";
      const elModeGun = document.getElementById('p3-mode-opt-gun');
      if (elModeGun) elModeGun.innerText = isEn ? "Surfaced Deck Gun Action (No escorts present)" : "Cañón de Cubierta (En superficie - Sin escoltas)";

      // Step 4: Torpedo Salvo
      const elS4T = document.getElementById('p3-step4-title');
      if (elS4T) elS4T.innerText = isEn ? "Step 4: Torpedo Allocation & Attack [8.2.3 - 8.2.7]" : "Paso 4: Asignación y Disparo de Torpedos [8.2.3 - 8.2.7]";
      const elTubesLbl = document.getElementById('p3-tubes-lbl');
      if (elTubesLbl) elTubesLbl.innerText = isEn ? "Tubes Fired:" : "Tubos Disparados:";
      const elTubes2 = document.getElementById('p3-tubes-opt-2');
      if (elTubes2) elTubes2.innerText = isEn ? "2 Torpedoes (Reduced Salvo)" : "2 Torpedos (Salva Reducida)";
      const elTubes4 = document.getElementById('p3-tubes-opt-4');
      if (elTubes4) elTubes4.innerText = isEn ? "4 Torpedoes (Standard Salvo)" : "4 Torpedos (Salva Estándar)";
      const elTubes6 = document.getElementById('p3-tubes-opt-6');
      if (elTubes6) elTubes6.innerText = isEn ? "6 Torpedoes (Full Bow Salvo)" : "6 Torpedos (Salva Completa Proa)";

      const elTorpTypeLbl = document.getElementById('p3-torp-type-lbl');
      if (elTorpTypeLbl) elTorpTypeLbl.innerText = isEn ? "Torpedo Type:" : "Tipo de Torpedo:";
      const elTorp95 = document.getElementById('p3-torp-opt-95');
      if (elTorp95) elTorp95.innerText = isEn ? "Type 95 Oxygen (Wake-less, lethal)" : "Type 95 Oxygen (Sin estela visible, letal)";
      const elTorp89 = document.getElementById('p3-torp-opt-89');
      if (elTorp89) elTorp89.innerText = isEn ? "Type 89 Steam (Steam wake, evasion penalty)" : "Type 89 Steam (Estela de vapor, penaliza evasión)";

      const elHitsCalc = document.getElementById('p3-hits-calc-lbl');
      if (elHitsCalc) elHitsCalc.innerText = isEn ? "Hits & Calculated Damage:" : "Impactos y Daño Calculado:";
      const elBtnFire = document.getElementById('p3-btn-fire');
      if (elBtnFire) elBtnFire.innerText = isEn ? "🚀 FIRE! (Launch)" : "🚀 ¡FUEGO! (Disparar)";

      // Update default combat hit res and sink status if present
      const elCombatHit = document.getElementById('wf-combat-hit-res');
      if (elCombatHit && (elCombatHit.innerText.includes("IMPACTOS") || elCombatHit.innerText.includes("HITS"))) {
        const m = elCombatHit.innerText.match(/\d+/g);
        if (m && m.length >= 2) {
          const hits = m[0];
          const duds = m[1];
          const dmg = m[2] || (hits * 2);
          elCombatHit.innerText = isEn ? `${hits} EFFECTIVE HITS! (Duds: ${duds}) — ${dmg} damage pts` : `¡${hits} IMPACTOS EFECTIVOS! (Defectuosos: ${duds}) — ${dmg} pts de daño`;
        }
      }
      const elSinkStatus = document.getElementById('wf-combat-sink-status');
      if (elSinkStatus) {
        if (elSinkStatus.innerText.includes("HUNDIDO") || elSinkStatus.innerText.includes("SUNK")) {
          const m = elSinkStatus.innerText.match(/[\d,\.]+/g);
          const tons = m && m.length ? m[m.length - 1] : "5,700";
          elSinkStatus.innerText = isEn ? `SHIP SUNK! (${tons} tons)` : `¡BUQUE HUNDIDO! (${tons} tons)`;
        } else if (elSinkStatus.innerText.includes("DAÑADO") || elSinkStatus.innerText.includes("DAMAGED")) {
          elSinkStatus.innerText = isEn ? "SHIP DAMAGED" : "BUQUE DAÑADO";
        }
      }

      // Step 5: Escorts
      const elS5T = document.getElementById('p3-step5-title');
      if (elS5T) elS5T.innerText = isEn ? "Step 5: Escort Detection & Attack (Charts B4, B5, B6) [8.2.8, 8.4]" : "Paso 5: Detección y Ataque de Escoltas (Tablas B4, B5, B6) [8.2.8, 8.4]";
      const elEscDesc = document.getElementById('p3-escort-desc');
      if (elEscDesc) elEscDesc.innerText = isEn ? "Assess acoustic escort detection (Chart B4) and resolve depth charges & damage (B5 & B6):" : "Evalúa si la escolta te detecta acústicamente (Chart B4) y resuelve las cargas de profundidad (B5 & B6):";
      const elBtnB4 = document.getElementById('p3-btn-b4');
      if (elBtnB4) elBtnB4.innerText = isEn ? "🎲 1. Detection (Chart B4 - 2d6)" : "🎲 1. Detección (Chart B4 - 2d6)";
      const elBtnB5 = document.getElementById('p3-btn-b5');
      if (elBtnB5) elBtnB5.innerText = isEn ? "💣 2. Depth Charges & Damage (B5/B6)" : "💣 2. Cargas y Averías (B5/B6)";
      const elBtnDeep = document.getElementById('p3-btn-deep');
      if (elBtnDeep) elBtnDeep.innerText = isEn ? "⚓ Deep Dive" : "⚓ Inmersión Profunda";
      const elEscTxt = document.getElementById('wf-escort-res-text');
      if (elEscTxt && (elEscTxt.innerText.includes("Escoltas no han atacado") || elEscTxt.innerText.includes("Escorts have not attacked"))) {
        elEscTxt.innerText = isEn ? "Escorts have not attacked yet." : "Escoltas no han atacado todavía.";
      }
      const elBtnSync = document.getElementById('p3-btn-sync-rogu');
      if (elBtnSync) elBtnSync.innerText = isEn ? "📋 Log / Sync into Rogu Bukku" : "📋 Registrar / Sincronizar en Rogu Bukku";

      // Embedded Charts B1-B6
      const elB1B6SecT = document.getElementById('p3-b1b6-sec-title');
      if (elB1B6SecT) elB1B6SecT.innerText = isEn ? "TACTICAL COMBAT CHARTS [CHARTS B1 - B6]" : "TABLAS DE COMBATE TÁCTICO [CHARTS B1 - B6]";
      const elB1B6SecS = document.getElementById('p3-b1b6-sec-sub');
      if (elB1B6SecS) elB1B6SecS.innerText = isEn ? "Hits, torpedo duds, damage points, escort detection, depth charge attacks and submarine damage." : "Impactos, torpedos inertes, daño, detección por escoltas, contraataque de cargas y averías de submarino.";
      const elScanBtn = document.getElementById('p3-b1b6-scan-btn');
      if (elScanBtn) elScanBtn.innerText = isEn ? "📷 View Chart B1-B6" : "📷 Ver Tabla B1-B6";

      // Chart B1
      const elB1T = document.getElementById('p3-b1-title');
      if (elB1T) elB1T.innerText = isEn ? "CHART B1: TORPEDO / DECK GUN TO HIT (2d6)" : "CHART B1: TORPEDO / CAÑÓN DE CUBIERTA TO-HIT (2d6)";
      const elB1S = document.getElementById('p3-b1-sub');
      if (elB1S) elB1S.innerText = isEn ? "LOW roll hits" : "Tirada BAJA impacta";
      const elB1Th1 = document.getElementById('p3-b1-th1');
      if (elB1Th1) elB1Th1.innerText = isEn ? "Close Range" : "Corta Distancia (Close)";
      const elB1Th2 = document.getElementById('p3-b1-th2');
      if (elB1Th2) elB1Th2.innerText = isEn ? "Medium Range" : "Alcance Medio (Medium)";
      const elB1Th3 = document.getElementById('p3-b1-th3');
      if (elB1Th3) elB1Th3.innerText = isEn ? "Long Range" : "Larga Distancia (Long)";
      const elB1Drms = document.getElementById('p3-b1-drms');
      if (elB1Drms) elB1Drms.innerHTML = isEn 
        ? '<strong>DRMs To-Hit:</strong> -1 Surface, +1 Cdr KIA/SW, -1 Midget torpedo, +1/+2 Type 92 at Med/Long, +1 Fast Capital Ship, +1 Green Crew, +2 Escort/DD/DE.<br><em style="color:var(--gold-400);">★ Natural "2" = Critical Hit (+3 damage if not dud).</em>'
        : '<strong>DRMs a la Puntería:</strong> -1 Superficie, +1 Cmdte KIA/SW, -1 Minisub torpedo, +1/+2 Tipo 92 a Media/Larga, +1 Buque Capital Rápido, +1 Novatos, +2 Escolta/DD/DE.<br><em style="color:var(--gold-400);">★ Tirada de "2" = Impacto Crítico (+3 daño si no es inerte).</em>';

      // Chart B2
      const elB2T = document.getElementById('p3-b2-title');
      if (elB2T) elB2T.innerText = isEn ? "CHART B2: TORPEDO DUDS (1d6)" : "CHART B2: TORPEDOS INERTES (DUDS - 1d6)";
      const elB2Txt = document.getElementById('p3-b2-text');
      if (elB2Txt) elB2Txt.innerHTML = isEn 
        ? 'Roll 1d6 per hit: <strong>1 = Dud</strong> (no damage). 2-6 = Explodes normally.<br><span style="color:#fca5a5;">★ FIDO Special Attack (5/44+): Aircraft drops homing torpedo: 1=Sunk, 2=7 hits, 3-6=Miss/dud.</span>'
        : 'Tirar 1d6 por impacto: <strong>1 = Dud / Inerte</strong> (sin daño). 2-6 = Explota normal.<br><span style="color:#fca5a5;">★ Ataque Especial FIDO (5/44+): Avión lanza torpedo guiado: 1=Hundido, 2=7 impactos, 3-6=fallo/dud.</span>';

      // Chart B3
      const elB3T = document.getElementById('p3-b3-title');
      if (elB3T) elB3T.innerText = isEn ? "CHART B3: ATTACK DAMAGE & POINTS TO SINK" : "TABLA B3: DAÑO DE ATAQUE Y PUNTOS PARA HUNDIR";
      const elB3Th1 = document.getElementById('p3-b3-th1');
      if (elB3Th1) elB3Th1.innerText = isEn ? "1d6 Roll" : "Tirada 1d6";
      const elB3Th2 = document.getElementById('p3-b3-th2');
      if (elB3Th2) elB3Th2.innerText = isEn ? "Torpedo" : "Torpedo";
      const elB3Th3 = document.getElementById('p3-b3-th3');
      if (elB3Th3) elB3Th3.innerText = isEn ? "Deck Gun" : "Cañón de Cubierta";

      const b3Map = {
        'p3-b3-r1-t': isEn ? "4 Damage" : "4 Daños",
        'p3-b3-r1-g': isEn ? "3 Damage" : "3 Daños",
        'p3-b3-r2-t': isEn ? "3 Damage" : "3 Daños",
        'p3-b3-r2-g': isEn ? "2 Damage" : "2 Daños",
        'p3-b3-r3-t': isEn ? "2 Damage" : "2 Daños",
        'p3-b3-r3-g': isEn ? "1 Damage" : "1 Daño",
        'p3-b3-r4-t': isEn ? "1 Damage" : "1 Daño",
        'p3-b3-r4-g': isEn ? "1 Damage" : "1 Daño"
      };
      for (const [id, txt] of Object.entries(b3Map)) {
        const el = document.getElementById(id);
        if (el) el.innerText = txt;
      }
      const elB3Notes = document.getElementById('p3-b3-notes');
      if (elB3Notes) elB3Notes.innerHTML = isEn 
        ? "<strong>Points to Sink Ships:</strong><br>• Battleship / Aircraft Carrier (Capital Ship): <strong>5 - 7 points</strong> (See Chart T4)<br>• 10,000+ t: <strong>4 points</strong> | 5,001 - 9,999 t: <strong>3 points</strong><br>• 1,001 - 5,000 t: <strong>2 points</strong> | ≤1,000 t: <strong>1 point</strong>"
        : "<strong>Puntos para Hundir Buques:</strong><br>• Acorazado / Portaaviones (Buque Capital): <strong>5 - 7 puntos</strong> (Ver Chart T4)<br>• 10.000+ t: <strong>4 puntos</strong> | 5.001 - 9.999 t: <strong>3 puntos</strong><br>• 1.001 - 5.000 t: <strong>2 puntos</strong> | ≤1.000 t: <strong>1 punto</strong>";

      // Chart B4
      const elB4T = document.getElementById('p3-b4-title');
      if (elB4T) elB4T.innerText = isEn ? "CHART B4: ESCORT DETECTION (2d6)" : "TABLA B4: DETECCIÓN DE ESCOLTAS (2d6)";
      const elB4Txt = document.getElementById('p3-b4-text');
      if (elB4Txt) elB4Txt.innerHTML = isEn 
        ? "2-8: <strong>Undetected</strong> | 9-10: <strong>Detected</strong> | 11+: <strong>Detected (+1 escort attack)</strong><br>DRMs: +1 Damaged Fuel Tanks, +1 Damaged Planes, +1 Capital Ship, +1 Day w/ Steam, +1 Prior Detection, +1 Close Range, -1 Long Range, -1 Test Depth, +1 in 1943, +2 in 1944, +3 in 1945."
        : "2-8: <strong>No detectado</strong> | 9-10: <strong>Detectado</strong> | 11+: <strong>Detectado (+1 ataque escolta)</strong><br>DRMs: +1 Tanques rotos, +1 Planos rotos, +1 Buque Capital, +1 Día con vapor, +1 Detección previa, +1 Corta Dist., -1 Larga Dist., -1 Profundidad límite, +1 en 1943, +2 en 1944, +3 en 1945.";

      // Chart B5
      const elB5T = document.getElementById('p3-b5-title');
      if (elB5T) elB5T.innerText = isEn ? "CHART B5: ESCORT OR AIRCRAFT ATTACK (2d6)" : "TABLA B5: ATAQUE DE ESCOLTA O AVIACIÓN (2d6)";
      const elB5Th1 = document.getElementById('p3-b5-th1');
      if (elB5Th1) elB5Th1.innerText = isEn ? "2d6 Roll" : "Tirada 2d6";
      const elB5Th2 = document.getElementById('p3-b5-th2');
      if (elB5Th2) elB5Th2.innerText = isEn ? "Hits Sustained" : "Impactos Sufridos";

      const b5Map = {
        'p3-b5-r1': isEn ? "Ineffective (0 Hits)" : "Ineficaz (0 impactos)",
        'p3-b5-r2': isEn ? "1 Hit" : "1 Impacto",
        'p3-b5-r3': isEn ? "2 Hits" : "2 Impactos",
        'p3-b5-r4': isEn ? "3 Hits" : "3 Impactos",
        'p3-b5-r5': isEn ? "4 Hits" : "4 Impactos",
        'p3-b5-r6': isEn ? "5 Hits" : "5 Impactos",
        'p3-b5-r7': isEn ? "SUBMARINE SUNK" : "SUBMARINO HUNDIDO"
      };
      for (const [id, txt] of Object.entries(b5Map)) {
        const el = document.getElementById(id);
        if (el) el.innerText = txt;
      }
      const elB5Notes = document.getElementById('p3-b5-notes');
      if (elB5Notes) elB5Notes.innerHTML = isEn 
        ? 'DRMs: +1 Damaged Fuel Tanks, +1 Damaged Hydrophones, +1 Batteries, +1/+2 Electric Motors, +1 Night surface 1st round, +1 for 11+ on detection, +2 Air Attack.<br><span style="color:#fca5a5;">★ Hedgehog (5/44+): 1-2 hits, if hits: 1=5 hits, 2=7 hits, 3-6=sunk.</span>'
        : 'DRMs: +1 Tanques combustible rotos, +1 Hidrófonos rotos, +1 Baterías, +1/+2 Motores eléc., +1 Ataque nocturno superficie 1.er turno, +1 por tirada 11+ en detección, +2 Ataque aéreo.<br><span style="color:#fca5a5;">★ Erizo (Hedgehog 5/44+): 1-2 impacto, si acierta: 1=5 hits, 2=7 hits, 3-6=hundido.</span>';

      // Chart B6 Damage Table
      const elB6T = document.getElementById('p3-b6-title');
      if (elB6T) elB6T.innerText = isEn ? "CHART B6: DAMAGE TABLE (d66 = 1d6 Red + 1d6 White)" : "TABLA B6: TABLA DE AVERÍAS (d66 = 1d6 Rojo + 1d6 Blanco)";

      const b6SysMap = {
        'b6-sys-11': isEn ? "Batteries" : "Baterías",
        'b6-sys-12': isEn ? "Flooding" : "Inundación",
        'b6-sys-13': isEn ? "Radar" : "Radar",
        'b6-sys-14': isEn ? "Periscope" : "Periscopio",
        'b6-sys-15': isEn ? "Dive Planes" : "Planos de Inmersión",
        'b6-sys-16': isEn ? "Electric Motor 1" : "Motor Eléctrico 1",
        'b6-sys-21': isEn ? "Flooding" : "Inundación",
        'b6-sys-22': isEn ? "Electric Motor 2" : "Motor Eléctrico 2",
        'b6-sys-23': isEn ? "Diesel Engine 1/2" : "Motor Diésel 1/2",
        'b6-sys-24': isEn ? "Hangar / Crane" : "Hangar / Grúa",
        'b6-sys-31': isEn ? "Flooding" : "Inundación",
        'b6-sys-32': isEn ? "Midget Sub / Daihatsu" : "Mini-Submarino / Daihatsu",
        'b6-sys-33': isEn ? "Hull" : "Casco",
        'b6-sys-34': isEn ? "Crew Casualty" : "Baja Tripulación",
        'b6-sys-36': isEn ? "Deck Gun / Kaiten" : "Cañón Cubierta / Kaiten",
        'b6-sys-41': isEn ? "Hull" : "Casco",
        'b6-sys-42': isEn ? "Radio" : "Radio",
        'b6-sys-43': isEn ? "Flooding" : "Inundación",
        'b6-sys-45': isEn ? "Hull" : "Casco",
        'b6-sys-46': isEn ? "AA Gun" : "Cañón AA",
        'b6-sys-51': isEn ? "Flooding" : "Inundación",
        'b6-sys-52': isEn ? "Hull" : "Casco",
        'b6-sys-53': isEn ? "Crew Casualty x2" : "Baja Tripulación x2",
        'b6-sys-54': isEn ? "Flooding x2" : "Inundación x2",
        'b6-sys-55': isEn ? "Hull" : "Casco",
        'b6-sys-56': isEn ? "Deck Gun" : "Cañón de Cubierta",
        'b6-sys-61': isEn ? "Hydrophones" : "Hidrófonos",
        'b6-sys-62': isEn ? "Aft Torpedo Doors" : "Compuertas Torpedo Popa",
        'b6-sys-63': isEn ? "Bow Torpedo Doors (odd/even)" : "Compuertas Proa (impar/par)",
        'b6-sys-65': isEn ? "Hull x2" : "Casco x2",
        'b6-sys-66': isEn ? "Fuel Tanks" : "Tanques de Combustible"
      };
      for (const [id, txt] of Object.entries(b6SysMap)) {
        const el = document.getElementById(id);
        if (el) el.innerText = txt;
      }

      // Target Charts T1-T5 Tabs
      const elT1T5T = document.getElementById('p3-t1t5-sec-title');
      if (elT1T5T) elT1T5T.innerText = isEn ? "TARGET CHARTS [CHARTS T1 - T5]" : "TABLAS DE BLANCOS [CHARTS T1 - T5]";
      const elT1Btn = document.getElementById('p3-t1-btn');
      if (elT1Btn) elT1Btn.innerText = isEn ? "T1: Small Freighters" : "T1: Cargueros Peq.";
      const elT2Btn = document.getElementById('p3-t2-btn');
      if (elT2Btn) elT2Btn.innerText = isEn ? "T2: Tankers/Large" : "T2: Petroleros/Gdes.";
      const elT3Btn = document.getElementById('p3-t3-btn');
      if (elT3Btn) elT3Btn.innerText = isEn ? "T3: US Warships" : "T3: Buques Guerra EE.UU.";
      const elT4Btn = document.getElementById('p3-t4-btn');
      if (elT4Btn) elT4Btn.innerText = isEn ? "T4: Capital Ships" : "T4: Buques Capitales";
      const elT5Btn = document.getElementById('p3-t5-btn');
      if (elT5Btn) elT5Btn.innerText = isEn ? "T5: Commonwealth Ships" : "T5: Buques Commonwealth";

      // Navigation
      const elPrevLbl = document.getElementById('p3-btn-prev-lbl');
      if (elPrevLbl) {
        elPrevLbl.innerText = isEn ? "Back to Patrol" : "Volver a Patrulla";
      } else {
        const elPrev = document.getElementById('p3-btn-prev');
        if (elPrev) elPrev.innerText = isEn ? "◀ Back to Patrol" : "◀ Volver a Patrulla";
      }
      if (typeof updateTrayectoCompletionStatus === 'function') {
        updateTrayectoCompletionStatus();
      } else {
        const elNext = document.getElementById('p3-btn-next');
        if (elNext) elNext.innerText = isEn ? "Proceed to Phase 4: Damage Control ➔" : "Pasar a Fase 4: Control de Averías ➔";
      }
    }


    function applySchoolLanguage(isEn) {
      // 1. Header Banner & Quick Table Access
      const elTitle = document.getElementById('pschool-title');
      if (elTitle) elTitle.innerText = isEn ? "CHART [F1]: KURE SUBMARINE SCHOOL & SPECIALTIES (RULE 4.8)" : "TABLA [F1]: ESCUELA DE SUBMARINOS DE KURE Y ESPECIALIDADES (REGLA 4.8)";

      const elSubDesc = document.getElementById('pschool-sub-desc');
      if (elSubDesc) elSubDesc.innerText = isEn ? "Kure School [F1] • Midget Submarines [F2] • Kasumigaura Air School [F3] • Otsujima Kaiten School [F4] • Active Charts: [B1], [B6], [M5], [M7], [K5], [K6]" : "Escuela de Kure [F1] • Minisubmarinos [F2] • Escuela Aérea Kasumigaura [F3] • Escuela Kaiten Otsujima [F4] • Tablas Activas: [B1], [B6], [M5], [M7], [K5], [K6]";

      const btnToggle = document.getElementById('btn-toggle-school-tables');
      if (btnToggle) {
        const isVisible = document.getElementById('school-tables-drawer') && document.getElementById('school-tables-drawer').style.display !== 'none';
        if (isEn) {
          btnToggle.innerText = isVisible ? "👁️ Hide Charts on Screen ▲" : "👁️ View Charts on Screen ▼";
        } else {
          btnToggle.innerText = isVisible ? "👁️ Ocultar Tablas ▲" : "👁️ Ver Tablas en Pantalla ▼";
        }
      }

      // 2. Rules Drawer Cards
      const elDrwPill = document.getElementById('sch-drawer-pill');
      if (elDrwPill) elDrwPill.innerText = isEn ? "RULES & ACTIVE CHARTS" : "REGLAS & TABLAS ACTIVAS";

      const elDrwTitle = document.getElementById('sch-drawer-title');
      if (elDrwTitle) elDrwTitle.innerText = isEn ? "CHARTS USED DURING TRAINING (SENSUIKAN)" : "CHARTS QUE PARTICIPAN EN EL ADIESTRAMIENTO (SENSUIKAN)";

      const elDrwSub = document.getElementById('sch-drawer-sub');
      if (elDrwSub) elDrwSub.innerText = isEn ? "Quick reference during training rolls" : "Consulta directa durante las Rolls de adiestramiento";

      // Card B1
      const elB1T = document.getElementById('sch-b1-title');
      if (elB1T) elB1T.innerText = isEn ? "CHART [B1]: FIRING RANGE" : "CHART [B1]: FIRING RANGE";
      const elB1D = document.getElementById('sch-b1-desc');
      if (elB1D) elB1D.innerText = isEn ? "Used for Captain (torpedoes), XO (Deck gun), and Midget Submarines [F2]:" : "Utilizada en Captain (torpedos), XO (Deck gun) and Midget Submarines [F2]:";
      const elB1ThRoll = document.getElementById('sch-b1-th-roll');
      if (elB1ThRoll) elB1ThRoll.innerText = isEn ? "Required 2d6 Roll" : "Required 2d6 Roll";
      const elB1R1L = document.getElementById('sch-b1-r1-lbl');
      if (elB1R1L) elB1R1L.innerText = isEn ? "Close" : "Corta (Close)";
      const elB1R1V = document.getElementById('sch-b1-r1-val');
      if (elB1R1V) elB1R1V.innerText = isEn ? "2–8 (Roll ≤ 8)" : "2–8 (Tirada ≤ 8)";
      const elB1R2L = document.getElementById('sch-b1-r2-lbl');
      if (elB1R2L) elB1R2L.innerText = isEn ? "Medium" : "Media (Medium)";
      const elB1R2V = document.getElementById('sch-b1-r2-val');
      if (elB1R2V) elB1R2V.innerText = isEn ? "2–7 (Roll ≤ 7)" : "2–7 (Tirada ≤ 7)";
      const elB1R3L = document.getElementById('sch-b1-r3-lbl');
      if (elB1R3L) elB1R3L.innerText = isEn ? "Long ★" : "Larga (Long) ★";
      const elB1R3V = document.getElementById('sch-b1-r3-val');
      if (elB1R3V) elB1R3V.innerText = isEn ? "2–6 (Roll ≤ 6)" : "2–6 (Tirada ≤ 6)";
      const elB1Note = document.getElementById('sch-b1-note');
      if (elB1Note) elB1Note.innerText = isEn ? "★ School Rule: In Sensuikan, low rolls hit. At Long Range, a roll of 2 to 6 is required (≤ 6 on 2d6). Score at least 2 Hits out of 3 rolls to gain the skill." : "★ Rule Escuela: En Sensuikan la Low Roll impacta (Roll Low). A Larga Distancia se necesita una tirada de 2 a 6 (≤ 6 en 2d6). Obtener al menos 2 Hits de 3 Rolls para ganar la habilidad.";

      // Card Test Depth
      const elTdT = document.getElementById('sch-td-title');
      if (elTdT) elTdT.innerText = isEn ? "EXCEED TEST DEPTH" : "PROFUNDIDAD LÍMITE (EXCEED TEST DEPTH)";
      const elTdD = document.getElementById('sch-td-desc');
      if (elTdD) elTdD.innerText = isEn ? "Used during Chief Engineer training:" : "Utilizada en el adiestramiento del Jefe de Máquinas (Engineer):";
      const elTdR = document.getElementById('sch-td-rules');
      if (elTdR) elTdR.innerHTML = isEn ? "• Simulated damage D = 3, 4, and 5 [Official Rule 8.2.6].<br>• Roll 2d6 on each successive test:<br>• If 2d6 &lt; Damage (D) ➔ Implosion and sunk!<br>• If 2d6 &ge; Damage (D) ➔ Passed with no damage!" : "• Daño simulado D = 3, 4 y 5 [Regla Oficial 8.2.6].<br>• Tira 2d6 en cada prueba sucesiva:<br>• Si 2d6 &lt; Daño (D) ➔ ¡Implosión y hundimiento!<br>• Si 2d6 &ge; Daño (D) ➔ ¡Superado sin daño!";
      const elTdPass = document.getElementById('sch-box-depth-pass');
      if (elTdPass) elTdPass.innerHTML = isEn ? "2d6 &ge; Damage:<br><strong>Passed!</strong>" : "2d6 &ge; Daño:<br><strong>¡Superado!</strong>";
      const elTdFail = document.getElementById('sch-box-depth-fail');
      if (elTdFail) elTdFail.innerHTML = isEn ? "2d6 &lt; Damage:<br><strong>Implosion!</strong>" : "2d6 &lt; Daño:<br><strong>¡Implosión!</strong>";
      const elTdN = document.getElementById('sch-td-note');
      if (elTdN) elTdN.innerText = isEn ? "★ If all 3 tests pass without implosion ➔ Gains Keen Judgment (immune to 1st depth damage on patrol)." : "★ Si supera las 3 pruebas sin implosión ➔ Gana Keen Judgment (inmune al 1.er daño de profundidad en patrulla).";

      // Card M5 & M7
      const elM5M7T = document.getElementById('sch-m5m7-title');
      if (elM5M7T) elM5M7T.innerText = isEn ? "CHARTS [M5] & [M7]: MIDGET SUBMARINES" : "TABLAS [M5] & [M7]: MINISUBMARINOS";
      const elM5M7D = document.getElementById('sch-m5m7-desc');
      if (elM5M7D) elM5M7D.innerText = isEn ? "Used in Chart F2 (Midget Submarine School):" : "Utilizadas en Chart F2 (Midget Submarine School):";
      const elM5C = document.getElementById('sch-m5-content');
      if (elM5C) elM5C.innerHTML = isEn ? "<strong>Chart [M5] Harbor Net (2d6):</strong><br>• 2–4: Trapped in Net (Failure)<br>• 5–9: Stealth Crossing (Passed)<br>• 10–12: Bypasses Harbor Defenses" : "<strong>Chart [M5] Redes Portuarias (2d6):</strong><br>• 2–4: Atrapado en red (Fallo)<br>• 5–9: Cruce con sigilo (Aprobado)<br>• 10–12: Evita la barrera defensiva";
      const elM7C = document.getElementById('sch-m7-content');
      if (elM7C) elM7C.innerHTML = isEn
        ? "<strong>Chart [M7] Midget Sub Recovery (1d6):</strong><br>• Roll 1d6 on [M7]. Results of <strong>4–6</strong> succeed (Midget Sub recovered). Results of <strong>1–3</strong> mean Midget Sub is lost.<br>• <em>Training connection:</em> During Chart [F2] officer training, roll two 1d6 on [M7]. If both rolls are 4–6 (no failure), gain the <strong>Superior Comms</strong> chit (+1 permanent recovery DRM)."
        : "<strong>Tabla [M7] Recuperación de Minisubmarino (1d6):</strong><br>• Tira 1d6 en [M7]. Un resultado de <strong>4–6</strong> es un rescate exitoso (Minisubmarino recuperado). Con <strong>1–3</strong> el minisubmarino se pierde.<br>• <em>Conexión con Escuela:</em> Durante el adiestramiento de oficiales de Chart [F2], tira dos dados 1d6 en [M7]. Si ambos obtienen 4–6 (ninguno falla), se gana la ficha <strong>Superior Comms</strong> (+1 DRM permanente a la recuperación).";

      // F1 Course Action Buttons & Table Result Labels
      const bTorp = document.getElementById('lbl-f1-torp-btn');
      if (bTorp) bTorp.innerText = isEn ? "🎲 Roll Torpedo Test (3x)" : "🎲 Tirar Prueba de Torpedos (3x)";
      const bTorpPass = document.getElementById('lbl-f1-torp-pass');
      if (bTorpPass) bTorpPass.innerText = isEn ? "✅ Passed (Tabletop)" : "✅ Superado (Mesa)";
      const bTorpFail = document.getElementById('lbl-f1-torp-fail');
      if (bTorpFail) bTorpFail.innerText = isEn ? "❌ Miss" : "❌ Fallo";

      const bGun = document.getElementById('lbl-f1-gun-btn');
      if (bGun) bGun.innerText = isEn ? "🎲 Roll Deck Gun Test (3x)" : "🎲 Tirar Prueba de Cañón (3x)";
      const bGunPass = document.getElementById('lbl-f1-gun-pass');
      if (bGunPass) bGunPass.innerText = isEn ? "✅ Passed (Tabletop)" : "✅ Superado (Mesa)";
      const bGunFail = document.getElementById('lbl-f1-gun-fail');
      if (bGunFail) bGunFail.innerText = isEn ? "❌ Miss" : "❌ Fallo";

      const bDepth = document.getElementById('lbl-f1-depth-btn');
      if (bDepth) bDepth.innerText = isEn ? "🎲 Roll Depth Test (3x)" : "🎲 Tirar Prueba de Profundidad (3x)";
      const bDepthPass = document.getElementById('lbl-f1-depth-pass');
      if (bDepthPass) bDepthPass.innerText = isEn ? "✅ Passed (Tabletop)" : "✅ Superado (Mesa)";
      const bDepthFail = document.getElementById('lbl-f1-depth-fail');
      if (bDepthFail) bDepthFail.innerText = isEn ? "❌ Implosion" : "❌ Implosión";

      // Card F4
      const elF4T = document.getElementById('sch-f4-title');
      if (elF4T) elF4T.innerText = isEn ? "CHART [F4]: KAITEN SCHOOL (OTSUJIMA)" : "CHART [F4]: KAITEN SCHOOL (OTSUJIMA)";
      const elF4D = document.getElementById('sch-f4-desc');
      if (elF4D) elF4D.innerText = isEn ? "Benefits for each Kaiten suicide pilot [Rules 4.8.4 & 7.18]:" : "Ventajas para cada piloto suicida Kaiten [Reglas 4.8.4 & 7.18]:";
      const elF4B1 = document.getElementById('sch-f4-b1');
      if (elF4B1) elF4B1.innerHTML = isEn ? "<strong>1. Senninbari:</strong> -3 Reef DRM or -1 Escort Detection." : "<strong>1. Senninbari:</strong> -3 DRM Arrecifes o -1 Detección de escoltas.";
      const elF4B2 = document.getElementById('sch-f4-b2');
      if (elF4B2) elF4B2.innerHTML = isEn ? "<strong>2. Hachimaki:</strong> Reroll any single die roll on [K5] or [K6]." : "<strong>2. Hachimaki:</strong> Permite repetir cualquier tirada en [K5] o [K6].";
      const elF4B3 = document.getElementById('sch-f4-b3');
      if (elF4B3) elF4B3.innerHTML = isEn ? "<strong>3. Ashes of Classmate:</strong> Attack automatically hits target (no die roll)." : "<strong>3. Ashes of Classmate:</strong> Ataque impacta automáticamente (sin tirar dado).";

      // 3. Chart F1 Submarine School (Kure)
      const elF1MainT = document.getElementById('f1-main-title');
      if (elF1MainT) elF1MainT.innerText = isEn ? "CHART F1: SUBMARINE SCHOOL (KURE)" : "CHART F1: SUBMARINE SCHOOL (KURE)";
      const elF1Navy = document.getElementById('f1-navy-label');
      if (elF1Navy) elF1Navy.innerText = isEn ? "Imperial Japanese Navy • WWII" : "Armada Imperial Japonesa • WW2";

      // Captain
      const elF1CapTitle = document.getElementById('f1-cap-title');
      if (elF1CapTitle) elF1CapTitle.innerText = isEn ? "Captain (Koshu gakusei)" : "Capitán (Koshu gakusei)";
      const elF1CapSub = document.getElementById('f1-cap-sub');
      if (elF1CapSub) elF1CapSub.innerText = isEn ? "Tactics, Strategy, Torpedo Attacks, Navigation..." : "Tácticas, Estrategia, Ataques con Torpedos, Navegación...";
      const elF1CapD = document.getElementById('f1-cap-desc');
      if (elF1CapD) elF1CapD.innerHTML = isEn
        ? "<strong>Torpedo Training:</strong> Roll 3 times on Chart [B1] at Long Range (2 to 6 on 2d6 / &le; 6). <a href=\"javascript:void(0)\" onclick=\"openModalViewer('Chart [B1]: Torpedo Attack', '', 'B1_B6')\" style=\"color:var(--gold-400); text-decoration:underline;\">👁️ View Chart [B1]</a>. If you score at least 2 hits, you gain <em>Torpedo Gunnery</em> (reroll 1 missed torpedo attack per patrol)."
        : "<strong>Entrenamiento de Torpedos:</strong> Tirar 3 veces en Tabla [B1] a Larga Distancia (2 a 6 en 2d6 / &le; 6). <a href=\"javascript:void(0)\" onclick=\"openModalViewer('Tabla [B1]: Ataque de Torpedos', '', 'B1_B6')\" style=\"color:var(--gold-400); text-decoration:underline;\">👁️ Ver Tabla [B1]</a>. Si logras al menos 2 impactos, ganas <em>Torpedo Gunnery</em> (repite 1 fallo por patrulla).";
      const elF1CapBtn = document.getElementById('f1-cap-btn');
      if (elF1CapBtn) elF1CapBtn.innerText = isEn ? "🎲 Roll Torpedo Test (3x)" : "🎲 Tirar Prueba de Torpedos (3x)";

      // XO
      const elF1XOTitle = document.getElementById('f1-xo-title');
      if (elF1XOTitle) elF1XOTitle.innerText = isEn ? "Executive Officer (XO Otsushu)" : "Segundo Oficial XO (Otsushu)";
      const elF1XOSub = document.getElementById('f1-xo-sub');
      if (elF1XOSub) elF1XOSub.innerText = isEn ? "Tactics, Submarine Operations, Diving..." : "Tácticas, Operaciones de Submarinos, Inmersión...";
      const elF1XOD = document.getElementById('f1-xo-desc');
      if (elF1XOD) elF1XOD.innerHTML = isEn
        ? "<strong>Deck Gun Training:</strong> Roll 3 times on Chart [B1] at Long Range (2 to 6 on 2d6 / &le; 6). <a href=\"javascript:void(0)\" onclick=\"openModalViewer('Chart [B1]: Deck Gun Attack', '', 'B1_B6')\" style=\"color:var(--gold-400); text-decoration:underline;\">👁️ View Chart [B1]</a>. If you score at least 2 hits, you gain <em>Deck Gun Expert</em> (deck gun attacks get permanent -1 DRM)."
        : "<strong>Entrenamiento de Cañón de Cubierta:</strong> Tirar 3 veces en Tabla [B1] a Larga Distancia (2 a 6 en 2d6 / &le; 6). <a href=\"javascript:void(0)\" onclick=\"openModalViewer('Tabla [B1]: Cañón de Cubierta', '', 'B1_B6')\" style=\"color:var(--gold-400); text-decoration:underline;\">👁️ Ver Tabla [B1]</a>. Si logras al menos 2 impactos, ganas <em>Deck Gun Expert</em> (tiradas cañón a -1 DRM permanente).";
      const elF1XOBtn = document.getElementById('f1-xo-btn');
      if (elF1XOBtn) elF1XOBtn.innerText = isEn ? "🎲 Roll Deck Gun Test (3x)" : "🎲 Tirar Prueba de Cañón (3x)";
      const elF1XOResult = document.getElementById('res-f1-xo-gun');
      if (elF1XOResult && !elF1XOResult.dataset.rolled) elF1XOResult.innerText = isEn ? "Not rolled" : "Sin tirar";

      // Engineer
      const elF1EngT = document.getElementById('f1-eng-title');
      if (elF1EngT) elF1EngT.innerText = isEn ? "Chief Engineer (Kikan gakusei)" : "Jefe de Máquinas (Kikan gakusei)";
      const elF1EngSub = document.getElementById('f1-eng-sub');
      if (elF1EngSub) elF1EngSub.innerText = isEn ? "Engineering, Construction, Trimming & Tactics" : "Ingeniería, Construcción, Trimado y Tácticas";
      const elF1EngD = document.getElementById('f1-eng-desc');
      if (elF1EngD) elF1EngD.innerHTML = isEn
        ? "<strong>Judgment Training:</strong> Starting with 3 hull damage, exceed Test Depth 3 times. <a href=\"javascript:void(0)\" onclick=\"openModalViewer('Chart [F1]: Kure Submarine School • Rules [4.8.1] & [8.2.6]', '', 'F1')\" style=\"color:var(--gold-400); text-decoration:underline;\">👁️ View Chart [F1] / Rule [8.2.6]</a>. If none results in 'implosion', you gain <em>Keen Judgment</em> (immune to 1st depth damage)."
        : "<strong>Entrenamiento de Juicio:</strong> Iniciando con 3 daños de casco, excede Test Depth 3 veces. <a href=\"javascript:void(0)\" onclick=\"openModalViewer('Tabla [F1]: Escuela de Submarinos de Kure • Reglas [4.8.1] y [8.2.6]', '', 'F1')\" style=\"color:var(--gold-400); text-decoration:underline;\">👁️ Ver Tabla [F1] / Regla [8.2.6]</a>. Si ninguna resulta en \"implosión\", ganas <em>Keen Judgment</em> (inmune al 1.er daño de profundidad).";
      const elF1EngBtn = document.getElementById('f1-eng-btn');
      if (elF1EngBtn) elF1EngBtn.innerText = isEn ? "🎲 Roll Depth Test (3x)" : "🎲 Tirar Prueba de Profundidad (3x)";
      const resultLabels = [
        'res-f1-cap-torp', 'res-f1-eng-keen',
        'res-f2-torp', 'res-f2-comms', 'res-f2-net'
      ];
      resultLabels.forEach((id) => {
        const result = document.getElementById(id);
        if (result && !result.dataset.rolled) result.innerText = isEn ? "Not rolled" : "Sin tirar";
      });

      // Spare Time Activities
      const elSpareT = document.getElementById('f1-spare-title');
      if (elSpareT) elSpareT.innerText = isEn ? "✨ Spare Time Activities (Choose 1 of the Captain's 3 spare time activities):" : "✨ Spare Time Activities (Elige 1 de las 3 actividades de tiempo libre del Capitán):";
      const elSpareOpt1 = document.getElementById('f1-spare-opt1');
      if (elSpareOpt1) elSpareOpt1.innerHTML = isEn ? "<strong>🥋 1. Martial Arts Training</strong><br><span style=\"color:#94a3b8;\">Gain <strong>'Shibumi'</strong> marker on Chart [K1]. Allows automatically passing 1 die roll per patrol.</span>" : "<strong>🥋 1. Martial Arts Training</strong><br><span style=\"color:#94a3b8;\">Ganas el marcador <strong>\"Shibumi\"</strong> en Chart [K1]. Permite superar automáticamente 1 tirada de dados por patrulla.</span>";
      const elSpareOpt2 = document.getElementById('f1-spare-opt2');
      if (elSpareOpt2) elSpareOpt2.innerHTML = isEn ? "<strong>📚 2. Extra Study Time</strong><br><span style=\"color:#94a3b8;\">Graduated with honors: Start with <strong>1 free 'Sub Upgrade'</strong> and <strong>-2 to your first Promotion roll</strong>.</span>" : "<strong>📚 2. Extra Study Time</strong><br><span style=\"color:#94a3b8;\">Graduado con honores: Inicias con <strong>1 \"Sub Upgrade\" gratis</strong> y <strong>-2 a tu primer Intento de Promotion</strong>.</span>";
      const elSpareOpt3 = document.getElementById('f1-spare-opt3');
      if (elSpareOpt3) elSpareOpt3.innerHTML = isEn ? "<strong>⛩️ 3. Gosei (Meditation)</strong><br><span style=\"color:#94a3b8;\">Start campaign with <strong>'Maneki Neko'</strong> lucky charm on your submarine. Allows rerolling any die roll (1d6 or 2d6).</span>" : "<strong>⛩️ 3. Gosei (Meditación)</strong><br><span style=\"color:#94a3b8;\">Inicias la partida con el amuleto de la buena suerte <strong>\"Maneki Neko\"</strong> en tu submarino. Permite repetir cualquier tirada de dados (1d6 o 2d6).</span>";

      // Graduation banner
      const elGrad = document.getElementById('f1-grad-text');
      if (elGrad) elGrad.innerHTML = isEn ? "<strong>Graduation:</strong> Congratulations! You and your crew have graduated from Kure Submarine School. The <strong>Submarine Badge</strong> is awarded to your uniform on Chart [K1]." : "<strong>Graduation:</strong> ¡Felicidades! Tú y tu tripulación os habéis graduado en la Escuela de Submarinos de Kure. Se otorga la insignia <strong>Sub Badge</strong> en tu uniforme en Chart [K1].";

      // 4. Chart F2 Midget Submarine School
      const elF2MainT = document.getElementById('f2-main-title');
      if (elF2MainT) elF2MainT.innerText = isEn ? "CHART [F2]: KO-HYOTEKI MIDGET SUBMARINE SCHOOL" : "CHART [F2]: KO-HYOTEKI MIDGET SUBMARINE SCHOOL";
      const elF2D1 = document.getElementById('f2-item1-desc');
      if (elF2D1) elF2D1.innerHTML = isEn ? "<strong>1. Torpedo Training:</strong> 3 long range rolls on Chart [B1]. <span style=\"color:var(--gold-400);\">👁️ View [B1]</span>. If &ge; 2 hits ➔ <em>Midget Torpedo Gunnery</em>." : "<strong>1. Adiestramiento de Torpedos:</strong> 3 tiradas a larga distancia en [B1]. <span style=\"color:var(--gold-400);\">👁️ View [B1]</span>. Si &ge; 2 impactos ➔ <em>Midget Torpedo Gunnery</em>.";
      const elF2D2 = document.getElementById('f2-item2-desc');
      if (elF2D2) elF2D2.innerHTML = isEn ? "<strong>2. Communications:</strong> 2 rolls on Sub Recovery [M7]. If no failures ➔ <em>Superior Comms (+1 drm)</em>." : "<strong>2. Comunicaciones:</strong> 2 tiradas en Sub Recovery [M7]. Si no hay fallo ➔ <em>Superior Comms (+1 drm)</em>.";
      const elF2D3 = document.getElementById('f2-item3-desc');
      if (elF2D3) elF2D3.innerHTML = isEn ? "<strong>3. Net & Boat Handling:</strong> 3 rolls on Harbor Net [M5]. If none is 2–4 ➔ <em>Boat Handling (4 = Through Net)</em>." : "<strong>3. Maniobra en Redes y Embarcación:</strong> 3 tiradas en Redes [M5]. Si ninguna es 2–4 ➔ <em>Boat Handling (4 = Through Net)</em>.";

      // 5. Chart F3 Kasumigaura Air School
      const elF3MainT = document.getElementById('f3-main-title');
      if (elF3MainT) elF3MainT.innerText = isEn ? "CHART [F3]: KASUMIGAURA NAVAL AVIATION SCHOOL" : "TABLA [F3]: ESCUELA NAVAL DE AVIACIÓN DE KASUMIGAURA";
      const elF3BtnRoll = document.getElementById('f3-btn-roll');
      if (elF3BtnRoll) elF3BtnRoll.innerText = isEn ? "🎲 Roll Random (2 Skills)" : "🎲 Tirar al Azar (2 Opciones)";
      const elF3Choose = document.getElementById('f3-choose-text');
      if (elF3Choose) elF3Choose.innerText = isEn ? "Choose exactly 2 skills for your air crew:" : "Elige exactamente 2 habilidades para tu dotación aérea:";
      const elF3Dw = document.getElementById('f3-desc-weap');
      if (elF3Dw) elF3Dw.innerText = isEn ? "Bombing at +1. Rear machine gun at -1 to-hit." : "Bombardeo a +1. Ametralladora trasera a -1 to-hit.";
      const elF3Dm = document.getElementById('f3-desc-maint');
      if (elF3Dm) elF3Dm.innerText = isEn ? "Reroll any Mishap/Malfunction Miss once per Mission." : "Repite cualquier fallo de avería (Mishap/Malfunction) 1 vez por misión.";
      const elF3Da = document.getElementById('f3-desc-acm');
      if (elF3Da) elF3Da.innerText = isEn ? "First combat damage sustained is reduced by 1 point." : "El primer daño recibido en combate aéreo se reduce en 1 punto.";
      const elF3Dn = document.getElementById('f3-desc-nav');
      if (elF3Dn) elF3Dn.innerText = isEn ? "Submarine recovery roll gains +1 drm." : "La tirada de recuperación con el submarino nodriza recibe +1 drm.";
      const elF3NoPlaneMsg = document.getElementById('f3-no-plane-msg');
      if (elF3NoPlaneMsg) {
        elF3NoPlaneMsg.innerHTML = isEn
          ? "<strong>Does Not Apply [Rule 4.8.3]:</strong> Your current submarine is not equipped with a floatplane or hangar. This school only applies to aircraft-equipped submarines (e.g. Type B, I-9, I-400)."
          : "<strong>No Aplica [Regla 4.8.3]:</strong> Tu buque actual no dispone de hidroavión ni hangar embarcado. Esta escuela sólo aplica a submarinos dotados de aviación (p. ej. Tipo B, I-9, I-400).";
      }

      // 6. Chart F4 Otsujima Kaiten School
      const elF4MainTitle = document.getElementById('f4-main-title');
      if (elF4MainTitle) elF4MainTitle.innerText = isEn ? "CHART [F4]: OTSUJIMA KAITEN TRAINING SCHOOL" : "TABLA [F4]: ESCUELA DE ADIESTRAMIENTO KAITEN (OTSUJIMA)";
      const elF4BtnRoll = document.getElementById('f4-btn-roll');
      if (elF4BtnRoll) elF4BtnRoll.innerText = isEn ? "🎲 Roll Random (1d3)" : "🎲 Tirar al Azar (1d3)";
      const elF4BtnPreset = document.getElementById('f4-btn-preset');
      if (elF4BtnPreset) elF4BtnPreset.innerText = isEn ? "⚡ Balanced Preset" : "⚡ Preset Equilibrado";
      const elF4When = document.getElementById('f4-when-title');
      if (elF4When) elF4When.innerText = isEn ? "WHEN DOES THIS SCHOOL APPLY? [Rules 4.8.4 & 7.18]:" : "¿CUÁNDO APLICA ESTA ESCUELA? [Reglas 4.8.4 & 7.18]:";
      const elF4Req = document.getElementById('f4-req-text');
      if (elF4Req) elF4Req.innerHTML = isEn ? "• <strong>Submarine Requirement:</strong> Applies only when your submarine is configured to carry Kaiten suicide torpedoes (available late 1944 / 1945 on converted Type B, Type C, or Kaidai submarines, and assigned to a Kaiten Special Mission against Ulithi, Iwo Jima, or Okinawa)." : "• <strong>Requisito de Buque:</strong> Aplica únicamente cuando tu submarino esté configurado para transportar torpedos suicidas Kaiten (disponibles desde finales de 1944 / 1945 en submarinos convertidos como Tipo B, Tipo C o Kaidai, y asignado a una Misión Especial Kaiten contra Ulithi, Iwo Jima u Okinawa).";
      const elF4Note = document.getElementById('f4-pilot-note');
      if (elF4Note) elF4Note.innerHTML = isEn ? "• <strong>Single-Use Suicide Pilots:</strong> As kamikaze missions with no return, all pilots perish upon attacking. Therefore, new benefits are chosen or rolled prior to each Kaiten Patrol." : "• <strong>Pilotos Suicidas de Misión Única:</strong> Al ser misiones kamikaze sin retorno, todos los operadores perecen tras el ataque. Por ello, se eligen o tiran nuevos beneficios antes de cada Patrulla con Kaiten.";
      const elF4SlotsH = document.getElementById('f4-slots-header');
      if (elF4SlotsH) elF4SlotsH.innerText = isEn ? "KAITEN PILOT BENEFIT ASSIGNMENT ONBOARD:" : "ASIGNACIÓN DE BENEFICIOS POR CADA PILOTO KAITEN A BORDO:";
      const elF4NoKaitenMsg = document.getElementById('f4-no-kaiten-msg');
      if (elF4NoKaitenMsg) {
        elF4NoKaitenMsg.innerHTML = isEn
          ? "<strong>Does Not Apply [Rules 4.8.4 & 7.18]:</strong> This submarine cannot carry Kaiten manned torpedoes. This school only applies to Kaiten-capable submarines (e.g. Kaidai KD6/KD7, Type B, Type C, Junsen J3)."
          : "<strong>No Aplica [Reglas 4.8.4 & 7.18]:</strong> Tu buque no admite instalación de torpedos Kaiten. Esta escuela sólo aplica a buques con capacidad Kaiten (ej. Kaidai KD6/KD7, Tipo B, Tipo C, Junsen J3).";
      }

      // Pilots labels and options
      for (let i = 1; i <= 6; i++) {
        const lbl = document.getElementById(`f4-p${i}-lbl`);
        if (lbl) lbl.innerText = isEn ? `Pilot ${i} (Slot #${i}):` : `Piloto ${i} (Slot #${i}):`;
        const sel = document.getElementById(`sel-f4-pilot-${i}`);
        if (sel && sel.options && sel.options.length >= 3) {
          sel.options[0].text = isEn ? "Benefit 1: Senninbari (-3 Reefs / -1 Escort Detection)" : "Beneficio 1: Senninbari (-3 Arrecifes / -1 Detección Escolta)";
          sel.options[1].text = isEn ? "Benefit 2: Hachimaki (Reroll on K5 / K6)" : "Beneficio 2: Hachimaki (Repetir tirada en K5 / K6)";
          sel.options[2].text = isEn ? "Benefit 3: Ashes of Classmate (Automatic Hit without rolling)" : "Beneficio 3: Ashes of Classmate (Impacto Automático sin tirar)";
        }
      }

      // 7. Complete Button
      const elBtnComp = document.getElementById('btn-school-complete');
      if (elBtnComp) elBtnComp.innerText = isEn ? "🎖️ COMPLETE TRAINING & SORTIE TO PATROL 1 ➔" : "🎖️ COMPLETAR ADIESTRAMIENTO Y APLICAR A CHART K1 ➔ (Pasar a Fase 1: Zarpe)";

      // Update dynamic badges based on submarine equipment
      if (typeof updateSchoolEquipDisplay === 'function') {
        updateSchoolEquipDisplay();
      }
    }


    function applyDockLanguage(isEn) {
      // Sidebar Title
      const elSideT = document.getElementById('lbl-dock-sidebar-title');
      if (elSideT) elSideT.innerText = isEn ? "SELECT SUBMARINE CLASS" : "SELECCIONAR CLASE DE SUBMARINO";

      // Assign active button
      const elAssign = document.getElementById('lbl-dock-assign-active');
      if (elAssign) elAssign.innerText = isEn ? "⚓ Assign as Active Boat" : "⚓ Asignar como Buque Activo";

      // 9 Specification card labels
      const specLabels = {
        'lbl-dock-disp': isEn ? "Displacement" : "Desplazamiento",
        'lbl-dock-speed': isEn ? "Speed / Range" : "Velocidad / Alcance",
        'lbl-dock-crew': isEn ? "Crew / Units" : "Tripulación / Unidades",
        'lbl-dock-tubes': isEn ? "Torpedo Tubes" : "Tubos Lanzatorpedos",
        'lbl-dock-guns': isEn ? "Deck Gun & AA" : "Cañón de Cubierta y AA",
        'lbl-dock-plane': isEn ? "Aircraft Fitted" : "Hidroavión Equipado",
        'lbl-dock-hull': isEn ? "Hull Hits Capacity" : "Capacidad de Casco",
        'lbl-dock-flood': isEn ? "Flooding Capacity" : "Capacidad de Inundación",
        'lbl-dock-kaiten': isEn ? "Kaiten Capability" : "Capacidad Kaiten"
      };
      for (let id in specLabels) {
        const el = document.getElementById(id);
        if (el) el.innerText = specLabels[id];
      }

      // Track Headers & Footnotes
      const elPatrolT = document.getElementById('lbl-dock-patrol-title');
      if (elPatrolT) elPatrolT.innerText = isEn ? "PATROL TRACK (TRANSIT & ON-STATION PHASES)" : "RUTA DE PATRULLA (FASES DE TRÁNSITO Y ESTACIÓN)";
      const elDmgT = document.getElementById('lbl-dock-damage-title');
      if (elDmgT) elDmgT.innerText = isEn ? "DAMAGE TRACKS (FLOODING & HULL DAMAGE)" : "REGISTROS DE DAÑO (INUNDACIÓN Y CASCO)";
      const elFoot = document.getElementById('sub-mat-footnote-desc');
      if (elFoot) elFoot.style.display = 'none';
      const elProfT = document.getElementById('sub-profile-header-title');
      if (elProfT) elProfT.innerText = isEn ? "⚓ IJN PROFILE" : "⚓ PERFIL IJN";

      // Submarine historical description
      const activeKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : null;
      const descEl = document.getElementById('sub-desc');
      if (descEl && activeKey && typeof SUB_DESCRIPTIONS !== 'undefined' && SUB_DESCRIPTIONS[activeKey]) {
        descEl.innerText = isEn ? SUB_DESCRIPTIONS[activeKey].en : SUB_DESCRIPTIONS[activeKey].es;
      }

      // Re-render submarine list buttons date badges
      if (typeof buildSubmarineList === 'function') buildSubmarineList();

      // Re-render active submarine details and tracks in target language
      const subToSelect = activeKey || (typeof currentPreviewSubKey !== 'undefined' && currentPreviewSubKey ? currentPreviewSubKey : 'Type_B_Class');
      if (typeof selectSubmarine === 'function') {
        selectSubmarine(subToSelect);
      } else if (subToSelect && typeof renderSubmarinePatrolTrack === 'function') {
        renderSubmarinePatrolTrack(subToSelect);
      }
    }


    function applyCompendiumOptionalLanguage(isEn) {
      const optTitle = document.getElementById('comp-opt-title-text');
      if (optTitle) {
        optTitle.innerText = isEn ? "8. OPTIONAL & ADVANCED CAMPAIGN RULES [RULES 11.0 & 8.2.9]" : "8. REGLAS OPCIONALES Y AVANZADAS DE CAMPAÑA [REGLAS 11.0 & 8.2.9]";
      }
      const h4_111 = document.getElementById('comp-opt-h4-111');
      if (h4_111) {
        h4_111.innerText = isEn ? "[11.1] STANDARD TONNAGE & [11.2] HISTORICAL TARGETS" : "[11.1] TONELAJE ESTÁNDAR & [11.2] BLANCOS HISTÓRICOS";
      }
      const body_111 = document.getElementById('comp-opt-body-111');
      if (body_111) {
        body_111.innerHTML = isEn
          ? `<p>• <strong>[11.1] Standard Tonnage:</strong> Instead of rolling on charts T1/T2, you may assign fixed tonnage to speed play: <em>Small Freighter: 3,500 t</em> | <em>Large Freighter: 7,000 t</em> | <em>Tanker: 9,000 t</em> (Warships and Capital Ships are always rolled).</p><p style="margin-top:4px;">• <strong>[11.2] Unique Historical Targets:</strong> Sunk ships are recorded. If the same ship is rolled on a later patrol, reroll: no ship may be sunk twice in a career.</p>`
          : `<p>• <strong>[11.1] Tonelaje Estándar:</strong> En lugar de tirar en las tablas T1/T2, puedes asignar tonelajes fijos para acelerar la partida: <em>Mercante Pequeño: 3,500 t</em> | <em>Mercante Grande: 7,000 t</em> | <em>Petrolero: 9,000 t</em> (Los buques de guerra y capitales siempre se tiran).</p><p style="margin-top:4px;">• <strong>[11.2] Blancos Históricos Únicos:</strong> Los buques hundidos quedan registrados. Si en una patrulla posterior se obtiene el mismo buque, se repite la tirada: ningún buque puede hundirse dos veces en una carrera.</p>`;
      }
      const h4_113 = document.getElementById('comp-opt-h4-113');
      if (h4_113) {
        h4_113.innerText = isEn ? "[11.3] EVASIVE MANEUVERS" : "[11.3] MANIOBRAS EVASIVAS";
      }
      const body_113 = document.getElementById('comp-opt-body-113');
      if (body_113) {
        body_113.innerHTML = isEn
          ? `<p>When detected by escorts, the commander secretly selects an evasion heading (1 to 6):<br><strong>1-2:</strong> Port (Left) | <strong>3-4:</strong> Starboard (Right) | <strong>5-6:</strong> Straight Ahead.<br>Then roll 1d6 for the escort's search heading:</p><ul style="margin:4px 0 0 16px; padding:0;"><li><strong>Different heading:</strong> -1 hit suffered on Chart B5.</li><li><strong>Same heading (different number):</strong> +1 hit on Chart B5.</li><li><strong>EXACT same number:</strong> +3 hits suffered.</li></ul>`
          : `<p>Al ser detectado por escoltas, el comandante elige en secreto una dirección (1 a 6):<br><strong>1-2:</strong> Izquierda | <strong>3-4:</strong> Derecha | <strong>5-6:</strong> Recto.<br>Luego tira 1d6 para la dirección de la escolta:</p><ul style="margin:4px 0 0 16px; padding:0;"><li><strong>Dirección distinta:</strong> -1 impacto sufrido en Tabla B5.</li><li><strong>Misma dirección (número distinto):</strong> +1 impacto en Tabla B5.</li><li><strong>Número EXACTO igual:</strong> +3 impactos sufridos.</li></ul>`;
      }
      const h4_114 = document.getElementById('comp-opt-h4-114');
      if (h4_114) {
        h4_114.innerText = isEn ? "[11.4] ESCORT QUALITY & [11.5] AIR QUALITY" : "[11.4] CALIDAD DE ESCOLTAS Y [11.5] DE AVIONES";
      }
      const thYear = document.getElementById('comp-opt-th-year');
      if (thYear) thYear.innerText = isEn ? "Year" : "Año";
      const thGreen = document.getElementById('comp-opt-th-green');
      if (thGreen) thGreen.innerText = isEn ? "Green (-1 Hit)" : "Novato (-1 Imp.)";
      const thTrained = document.getElementById('comp-opt-th-trained');
      if (thTrained) thTrained.innerText = isEn ? "Trained" : "Entrenado";
      const thVet = document.getElementById('comp-opt-th-vet');
      if (thVet) thVet.innerText = isEn ? "Veteran (+1 Hit)" : "Veterano (+1 Imp.)";
      const thElite = document.getElementById('comp-opt-th-elite');
      if (thElite) thElite.innerText = isEn ? "Elite (+1 Det / +1 Hit)" : "Élite (+1 Det / +1 Imp.)";
      const fn114 = document.getElementById('comp-opt-fn-114');
      if (fn114) {
        fn114.innerText = isEn
          ? "* Elite aircraft inflict 2 automatic crew casualties instead of 1."
          : "* Los aviones Élite causan 2 bajas automáticas a la tripulación en lugar de 1.";
      }
      const h4_117 = document.getElementById('comp-opt-h4-117');
      if (h4_117) {
        h4_117.innerText = isEn ? "[11.7] CAPTAIN INITIAL ABILITIES TABLE (1d20)" : "[11.7] TABLA DE HABILIDADES INICIALES DEL CAPITÁN (1d20)";
      }

      const abilities = isEn ? [
        '<strong>1. Lucky:</strong> Begins with "Maneki Neko" good luck charm.',
        '<strong>2. Tracker:</strong> No roll required to maintain convoy contact.',
        '<strong>3. Capital Ship Killer:</strong> -1 To-Hit against Capital Ships.',
        '<strong>4. Teamwork:</strong> Crew starts at "Veteran" level.',
        '<strong>5. Carrier Killer:</strong> -1 To-Hit against CV and CVE.',
        '<strong>6. Aggressive:</strong> Obligated to engage warships and re-engage.',
        '<strong>7. Bold:</strong> Close range engagement on detection roll of 12.',
        '<strong>8. Skilled:</strong> Fire bow and aft torpedoes without penalty.',
        '<strong>9. Vigilant (XO):</strong> +1 DRM to crash dive [A4].',
        '<strong>10. AA Expert:</strong> AA gunnery permanent -1 DRM.',
        '<strong>11. Leadership:</strong> Promotion check every 2 successful patrols.',
        '<strong>12. Tanker Killer:</strong> -1 To-Hit against Tankers (T).',
        '<strong>13. Convoy Killer:</strong> -1 To-Hit during convoy engagements.',
        '<strong>14. Deck Gun Expert (XO):</strong> -1 DRM to deck gun attacks.',
        '<strong>15. Straggler Killer:</strong> May isolate 1 ship from convoy once per patrol.',
        '<strong>16. Political:</strong> Choose patrol zone on 1-3 on 1d6.',
        '<strong>17. Midget Sub Expert:</strong> Ko-Hyoteki pilot begins with all skills.',
        '<strong>18. Scrounger:</strong> Freely choose torpedo loadout mix at departure.',
        '<strong>19. Keen Judgment:</strong> Immune to 1st damage from exceeding Test Depth.',
        '<strong>20. Charismatic:</strong> Officer replacements arrive as "Expert".'
      ] : [
        '<strong>1. Lucky:</strong> Inicia con amuleto "Maneki Neko".',
        '<strong>2. Tracker:</strong> No tira para mantener contacto con convoy.',
        '<strong>3. Capital Ship Killer:</strong> -1 a Impacto contra Buques Capitales.',
        '<strong>4. Teamwork:</strong> Dotación inicia en nivel "Veterano".',
        '<strong>5. Carrier Killer:</strong> -1 a Impacto contra CV y CVE.',
        '<strong>6. Aggressive:</strong> Obligado a atacar buques y reintentar rondas.',
        '<strong>7. Bold:</strong> Pasa a distancia corta con detección en 12.',
        '<strong>8. Skilled:</strong> Dispara proa y popa sin penalización.',
        '<strong>9. Vigilant (XO):</strong> +1 DRM a inmersión de emergencia [A4].',
        '<strong>10. AA Expert:</strong> Artillería AA a -1 DRM permanente.',
        '<strong>11. Leadership:</strong> Tira promoción cada 2 patrullas con éxito.',
        '<strong>12. Tanker Killer:</strong> -1 a Impacto contra Petroleros (T).',
        '<strong>13. Convoy Killer:</strong> -1 a Impacto en encuentros de convoy.',
        '<strong>14. Deck Gun Expert (XO):</strong> -1 DRM a cañón de cubierta.',
        '<strong>15. Straggler Killer:</strong> Puede convertir convoy en blanco aislado 1x.',
        '<strong>16. Political:</strong> Elige su área de patrulla con 1-3 en 1d6.',
        '<strong>17. Midget Sub Expert:</strong> Piloto Ko-Hyoteki inicia con todas las habilidades.',
        '<strong>18. Scrounger:</strong> Elige tipo y mezcla libre de torpedos al zarpar.',
        '<strong>19. Juicio Certero:</strong> Inmune al 1.er daño por exceder Profundidad de Prueba.',
        '<strong>20. Charismatic:</strong> Reemplazos de oficiales llegan como "Experto".'
      ];

      abilities.forEach((html, idx) => {
        const el = document.getElementById(`comp-opt-ability-${idx + 1}`);
        if (el) el.innerHTML = html;
      });
    }

    function applyCompendiumLanguage(isEn) {
      if (typeof renderCompendiumA3Table === 'function') {
        renderCompendiumA3Table(isEn);
      }
      applyCompendiumOptionalLanguage(isEn);
      applyCompendiumSchoolsLanguage(isEn);
      applyCompendiumOptionalCombatLanguage(isEn);
      applyCompendiumCommanderLanguage(isEn);
      applyCompendiumB11Language(isEn);
      applyCompendiumCampaignLanguage(isEn);

      // Toggle Midget Submarine Section (Charts M5 to M9) dynamically
      const mSec = document.querySelector('[data-comp-sec="midget"]');
      if (mSec && typeof COMP_MIDGET_HTML !== 'undefined') {
        const targetHtml = isEn ? COMP_MIDGET_HTML.en : COMP_MIDGET_HTML.es;
        if (targetHtml) {
          mSec.outerHTML = targetHtml;
        }
      }

      // Toggle Kaiten Section 6 (Charts F4, K5, K6) dynamically
      const kSec = document.querySelector('[data-comp-sec="kaiten"]');
      if (kSec && typeof COMP_KAITEN_HTML !== 'undefined') {
        const targetKaitenHtml = isEn ? COMP_KAITEN_HTML.en : COMP_KAITEN_HTML.es;
        if (targetKaitenHtml) {
          kSec.outerHTML = targetKaitenHtml;
        }
      }

      // Toggle Floatplane Section 7 (Charts P3 to P6) dynamically
      const fpSec = document.querySelector('[data-comp-sec="floatplane"]');
      if (fpSec && typeof COMP_FLOATPLANE_HTML !== 'undefined') {
        const targetFpHtml = isEn ? COMP_FLOATPLANE_HTML.en : COMP_FLOATPLANE_HTML.es;
        if (targetFpHtml) {
          fpSec.outerHTML = targetFpHtml;
        }
      }
    }

    function applyCompendiumCommanderLanguage(isEn) {
      const sec3T = document.getElementById('comp-sec3-main-title');
      if (sec3T) sec3T.innerText = isEn ? "👤 3. COMMANDER, CREW & RANDOM EVENTS (CHARTS H2, K1, B11)" : "👤 3. COMANDANTE, TRIPULACIÓN Y EVENTOS HISTÓRICOS (TABLAS H2, K1, B11)";

      const h2T = document.getElementById('comp-h2-main-title');
      if (h2T) h2T.innerText = isEn ? "CHART H2: JAPANESE SUB COMMANDER NAMES (1d6 + 1d6)" : "TABLA H2: NOMBRES DE COMANDANTES DE SUBMARINOS JAPONESES (1d6 + 1d6)";

      const h2Sur = document.getElementById('comp-h2-title-surnames');
      if (h2Sur) h2Sur.innerText = isEn ? "SURNAMES" : "APELLIDOS";

      const h2First = document.getElementById('comp-h2-title-firstnames');
      if (h2First) h2First.innerText = isEn ? "FIRST NAMES" : "NOMBRES DE PILA";
    }

    function applyCompendiumB11Language(isEn) {
      const t = document.getElementById('comp-b11-title');
      if (t) t.innerText = isEn ? "CHART B11: RANDOM HISTORICAL EVENTS (OFFICIAL 2d6)" : "TABLA B11: EVENTOS HISTÓRICOS ALEATORIOS (OFICIAL 2d6)";

      const ref = document.getElementById('comp-b11-rule-ref');
      if (ref) ref.innerText = isEn ? "Official Rule 8.1.8: Triggers on 1st natural 12 rolled during encounter rolls" : "Regla Oficial 8.1.8: Se activa con el 1.er resultado de 12 natural obtenido en tirada de encuentro";

      const thEv = document.getElementById('comp-b11-th-event');
      if (thEv) thEv.innerText = isEn ? "Event Name" : "Nombre del Evento";

      const thEf = document.getElementById('comp-b11-th-effect');
      if (thEf) thEf.innerText = isEn ? "Official Campaign Effect" : "Efecto Oficial en Campaña";

      const tbody = document.getElementById('comp-b11-tbody');
      if (!tbody) return;

      const eventsEn = [
        { roll: "2", name: "Man Overboard!", color: "#f87171", desc: "Watch officer washed overboard. Roll 1d6: 1= Captain (career ends), 2= Executive Officer (XO), 3= Chief Engineer, 4–6= Navigator." },
        { roll: "3", name: "Typhoon!", color: "#38bdf8", desc: "Severe typhoon forces submarine to remain submerged. No action taken in this box or the next box." },
        { roll: "4", name: "Ultra Intercept", color: "#c084fc", desc: "Allied radio intercept diverts targets. Next encounter with a Capital Ship is treated as 'No Contact' (--)." },
        { roll: "5", name: "Superior Torpedoes", color: "#34d399", desc: "Batch of superior-quality torpedo exploders. All dud checks on Chart [B2] receive +1 for remainder of patrol." },
        { roll: "6", name: "Appendicitis", color: "#fbbf24", desc: "Emergency surgery at sea. Roll 1d6: 1–3= Success (Doctor gains Expert rating), 4–5= Survives, 6= Dies (loses Doctor Expert if possessed)." },
        { roll: "7", name: "Maneki Neko", color: "#fde047", desc: "Lucky cat talisman. Gain the <em>Maneki Neko</em> chit: reroll any single die roll (1d6 or 2d6). May be banked between patrols." },
        { roll: "8", name: "Re-based", color: "#38bdf8", desc: "Naval base transfer orders. At end of patrol, randomly reassign submarine to another active operational base." },
        { roll: "9", name: "Pooped", color: "#f97316", desc: "Rogue wave sweeps through open hatch flooding bridge and conning tower. Radar damaged (if fitted, roll repair). Roll 1x crew casualty on Chart [B7]." },
        { roll: "10", name: "Blessings of the Emperor", color: "#34d399", desc: "Imperial blessing: For remainder of this patrol and the next, you may use any one skill not yet earned." },
        { roll: "11", name: "Crew Illness", color: "#f87171", desc: "Severe food or water contamination. All attack rolls (torpedo, deck gun, AA) suffer a +1 penalty for remainder of patrol." },
        { roll: "12", name: "Run Aground!", color: "#ef4444", desc: "Aground on uncharted reef. Suffers 3 hull damage. If sunk, boat is scuttled and crew rolls for rescue. (Ignored if Navigator is Expert)." }
      ];

      const eventsEs = [
        { roll: "2", name: "¡Hombre al Agua! (Man Overboard)", color: "#f87171", desc: "Oficial de guardia caído al mar. Tira 1d6: 1= Capitán (termina carrera), 2= Segundo Oficial (XO), 3= Jefe de Máquinas, 4–6= Navegante." },
        { roll: "3", name: "¡Tifón! (Typhoon)", color: "#38bdf8", desc: "Un tifón violento obliga al submarino a permanecer sumergido. No se realiza ninguna acción en esta casilla ni en la siguiente." },
        { roll: "4", name: "Intercepción Ultra", color: "#c084fc", desc: "Interceptación aliada por radio desvía a los blancos. Tu próximo encuentro con Buque Capital se considera 'Sin Contacto' (--)." },
        { roll: "5", name: "Torpedos Superiores", color: "#34d399", desc: "Lote de espoletas de torpedos de calidad superior. Todas las tiradas de torpedo inerte en Tabla [B2] reciben +1 por el resto de la patrulla." },
        { roll: "6", name: "Apendicitis", color: "#fbbf24", desc: "Cirugía de urgencia a bordo. Tira 1d6: 1–3= Éxito (Médico se vuelve Experto), 4–5= Sobrevive, 6= Fallece (pierde rango Experto si lo poseía)." },
        { roll: "7", name: "Maneki Neko", color: "#fde047", desc: "Amuleto del gato de la suerte. Ganas la ficha <em>Maneki Neko</em>: repite cualquier tirada (1d6 o 2d6). Se puede acumular entre patrullas." },
        { roll: "8", name: "Reasignación de Base", color: "#38bdf8", desc: "Orden de traslado de base naval. Al finalizar la patrulla, reubica aleatoriamente el submarino en otra base activa disponible." },
        { roll: "9", name: "Golpe de Mar (Pooped)", color: "#f97316", desc: "Ola gigante entra por la escotilla inundando la torre. Radar dañado (si equipado, tira reparación). Tira 1x baja en tripulación en Tabla [B7]." },
        { roll: "10", name: "Bendición del Emperador", color: "#34d399", desc: "Bendición imperial: Durante el resto de esta patrulla y la siguiente, puedes utilizar cualquier habilidad que aún no hayas ganado." },
        { roll: "11", name: "Enfermedad de la Tripulación", color: "#f87171", desc: "Intoxicación masiva de comida o agua. Todas las tiradas de ataque (torpedo, cañón, AA) sufren penalización de +1 durante la patrulla." },
        { roll: "12", name: "¡Encallado! (Run Aground)", color: "#ef4444", desc: "Encallado en arrecife desconocido. Sufre 3 daños en el casco. Si esto hunde el buque, se barrena y tira rescate. (Ignorado si Navegante es Experto)." }
      ];

      const list = isEn ? eventsEn : eventsEs;
      tbody.innerHTML = list.map(ev => {
        const bg = ev.roll === "7" ? "background:rgba(234,179,8,0.1);" : "";
        return `<tr style="border-bottom:1px solid #334155; ${bg}">
          <td style="padding:4px; font-weight:bold; color:var(--gold-400); text-align:center; border:1px solid #334155;">${ev.roll}</td>
          <td style="padding:4px 8px; font-weight:bold; color:${ev.color}; border:1px solid #334155;">${ev.name}</td>
          <td style="padding:4px 8px; border:1px solid #334155;">${ev.desc}</td>
        </tr>`;
      }).join('');
    }

    function applyCompendiumCampaignLanguage(isEn) {
      const sec4T = document.getElementById('comp-sec4-main-title');
      if (sec4T) sec4T.innerText = isEn ? "🛠️ 4. PORT REFIT & CAMPAIGN VICTORY LEVELS" : "🛠️ 4. REFIT EN PUERTO Y ESCALA DE VICTORIA DE CAMPAÑA";

      const refitH4 = document.getElementById('comp-refit-h4');
      if (refitH4) refitH4.innerText = isEn ? "NAVAL BASES [4.7], REFIT [8.5.11] & PORT AIR RAIDS [4.7.6]" : "BASES NAVALES [4.7], REFIT [8.5.11] E INCURSIONES AÉREAS [4.7.6]";

      const refitBody = document.getElementById('comp-refit-body');
      if (refitBody) {
        refitBody.innerHTML = isEn
          ? `<p>• <strong>The 5 Official Bases of Sensuikan [Rule 4.7]:</strong>
              <br>⚓ <strong>Yokosuka [4.7.1]:</strong> Major naval base. All starting submarines begin here.
              <br>⚓ <strong>Paramushiro [4.7.2]:</strong> Northern base for Aleutian patrols. Once assigned here, all subsequent patrols are to the Aleutians until 7/43 (when re-assigned to Truk). Immune to air raids [4.7.6].
              <br>⚓ <strong>Truk [4.7.3]:</strong> Key forward base of the 6th Fleet. Ceases operations in 3/44 (rebase to Yokosuka; if in Refit in 3/44 boat is lost).
              <br>⚓ <strong>New Guinea [4.7.4]:</strong> Rabaul and Shortland. Active throughout the war.
              <br>⚓ <strong>Dutch East Indies (DEI) [4.7.5]:</strong> Singapore, Penang, and Sabang for Indian Ocean patrols.
            </p>
            <p>• <strong>Calculation of Refit Months ('R') [Chart H3]:</strong>
              <br>Base: 1 mandatory month of rest and refit.
              <br>+1 month if 3 or more systems are INOP.
              <br>+1 month for 1–3 hull damage boxes | +2 months for 4–6 boxes | +3 months for 7–8 boxes.
            </p>
            <p>• <strong>[4.7.6] Port Air Raids (from January 1944 / 1/44 - 2d6):</strong>
              <br>During Refit at any port except Paramushiro:
              <br>- <strong>2:</strong> Submarine destroyed in air raid. 1 month transit to Yokosuka to commission a new boat.
              <br>- <strong>3:</strong> Severe air raid damage. Add <strong>+2 months</strong> to current refit.
              <br>- <strong>4:</strong> Air raid damage. Add <strong>+1 month</strong> to current refit.
              <br>- <strong>5–12:</strong> No effect.
            </p>`
          : `<p>• <strong>Las 5 Bases Oficiales de Sensuikan [Regla 4.7]:</strong>
              <br>⚓ <strong>Yokosuka [4.7.1]:</strong> Base naval principal. Todos los submarinos de inicio comienzan aquí.
              <br>⚓ <strong>Paramushiro [4.7.2]:</strong> Base septentrional para patrullas en Aleutianas. Una vez asignado aquí, todas las patrullas subsiguientes serán a Aleutianas hasta 7/43 (momento en que es reasignado a Truk). Inmune a bombardeos [4.7.6].
              <br>⚓ <strong>Truk [4.7.3]:</strong> Base avanzada clave de la 6ª Flota. Cesa de operar en 3/44 (traslado a Yokosuka; si está en Refit en 3/44 el buque se considera perdido).
              <br>⚓ <strong>Nueva Guinea [4.7.4]:</strong> Rabaul y Shortland. Activas durante toda la contienda.
              <br>⚓ <strong>Indias Orientales Holandesas (DEI) [4.7.5]:</strong> Singapur, Penang y Sabang para patrullas en el Océano Índico.
            </p>
            <p>• <strong>Cálculo de Meses de Refit ('R') [Tabla H3]:</strong>
              <br>Base: 1 mes obligatorio de descanso y mantenimiento.
              <br>+1 mes si hay 3 o más sistemas fuera de servicio (INOP).
              <br>+1 mes por 1–3 casillas de daño en casco | +2 meses por 4–6 casillas | +3 meses por 7–8 casillas.
            </p>
            <p>• <strong>[4.7.6] Incursiones Aéreas en Puerto (desde enero de 1944 / 1/44 - 2d6):</strong>
              <br>Durante Refit en cualquier puerto excepto Paramushiro:
              <br>- <strong>2:</strong> Submarino destruido en incursión aérea. 1 mes de viaje a Yokosuka para recibir nuevo submarino.
              <br>- <strong>3:</strong> Daño severo en ataque aéreo. Añadir <strong>+2 meses</strong> al refit actual.
              <br>- <strong>4:</strong> Daño en ataque aéreo. Añadir <strong>+1 mes</strong> al refit actual.
              <br>- <strong>5–12:</strong> Sin efecto.
            </p>`;
      }

      const vicH4 = document.getElementById('comp-victory-h4');
      if (vicH4) vicH4.innerText = isEn ? "CAMPAIGN VICTORY LEVELS (GRT SUNK)" : "NIVELES DE VICTORIA DE CAMPAÑA (TRB HUNDIDO)";

      const thTon = document.getElementById('comp-vic-th-tonnage');
      if (thTon) thTon.innerText = isEn ? "Sunk Tonnage (GRT)" : "Tonelaje Hundido (TRB)";

      const thLvl = document.getElementById('comp-vic-th-level');
      if (thLvl) thLvl.innerText = isEn ? "Campaign Victory Level" : "Nivel de Victoria de Campaña";

      const thAwd = document.getElementById('comp-vic-th-award');
      if (thAwd) thAwd.innerText = isEn ? "Highest Imperial Decoration" : "Condecoración Imperial Máxima";

      const tbody = document.getElementById('comp-victory-tbody');
      if (!tbody) return;

      if (isEn) {
        tbody.innerHTML = `
          <tr><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">100,000+ tons</td><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">DECISIVE VICTORY [Rule 5.2]</td><td style="border:1px solid #334155;">Order of the Golden Kite / Legendary Elite</td></tr>
          <tr><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">50,000 – 99,999 tons</td><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">SUBSTANTIAL VICTORY [Rule 5.2]</td><td style="border:1px solid #334155;">Order of the Golden Kite, 4th Class</td></tr>
          <tr><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">20,000 – 49,999 tons</td><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">MARGINAL VICTORY [Rule 5.2]</td><td style="border:1px solid #334155;">Order of the Rising Sun</td></tr>
          <tr><td style="border:1px solid #334155;">10,000 – 19,999 tons</td><td style="border:1px solid #334155; font-weight:bold; color:#fde047;">DRAW [Rule 5.2]</td><td style="border:1px solid #334155;">Order of the Sacred Treasure</td></tr>
          <tr><td style="border:1px solid #334155; color:#f87171;">0 – 9,999 tons or Captured</td><td style="border:1px solid #334155; color:#ef4444; font-weight:bold;">DEFEAT [Rule 5.2]</td><td style="border:1px solid #334155; color:#94a3b8;">Dishonor & Ruin</td></tr>`;
      } else {
        tbody.innerHTML = `
          <tr><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">100.000+ t</td><td style="border:1px solid #334155; font-weight:bold; color:var(--gold-300);">VICTORIA DECISIVA [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Milano Dorado / Élite Legendaria</td></tr>
          <tr><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">50.000 – 99.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#6ee7b7;">VICTORIA SUSTANCIAL [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Milano Dorado, 4.ª Clase</td></tr>
          <tr><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">20.000 – 49.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#93c5fd;">VICTORIA MARGINAL [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Sol Naciente</td></tr>
          <tr><td style="border:1px solid #334155;">10.000 – 19.999 t</td><td style="border:1px solid #334155; font-weight:bold; color:#fde047;">EMPATE [Regla 5.2]</td><td style="border:1px solid #334155;">Orden del Tesoro Sagrado</td></tr>
          <tr><td style="border:1px solid #334155; color:#f87171;">0 – 9.999 t o Capturado</td><td style="border:1px solid #334155; color:#ef4444; font-weight:bold;">DERROTA [Regla 5.2]</td><td style="border:1px solid #334155; color:#94a3b8;">Deshonor y Ruina</td></tr>`;
      }
    }

    function applyCompendiumSchoolsLanguage(isEn) {
      const mainT = document.getElementById('comp-schools-main-title');
      if (mainT) mainT.innerText = isEn ? "CHARTS F1, F2 & F3: NAVAL SCHOOLS & TRAINING (OFFICIAL COMPASS GAMES)" : "TABLAS F1, F2 Y F3: ESCUELAS NAVALES Y ADIESTRAMIENTO (OFICIAL COMPASS GAMES)";
      const ref = document.getElementById('comp-schools-rule-ref');
      if (ref) ref.innerText = isEn ? "Official Rule 4.8" : "Regla Oficial 4.8";

      const f1T = document.getElementById('comp-f1-title');
      if (f1T) f1T.innerText = isEn ? "CHART [F1]: KURE SUBMARINE SCHOOL (MANDATORY)" : "TABLA [F1]: ESCUELA DE SUBMARINOS DE KURE (OBLIGATORIA)";
      const f1B = document.getElementById('comp-f1-body');
      if (f1B) {
        f1B.innerHTML = isEn
          ? `<p style="margin:0 0 6px 0;">• <strong>Captain (Torpedo Training):</strong> 3 rolls on Chart [B1] at Long Range (&le; 6 / 2 to 6). If &ge; 2 Hits ➔ gains the skill <em>Torpedo Gunnery</em> (reroll 1 torpedo miss per patrol).</p>
             <p style="margin:0 0 6px 0;">• <strong>Second Officer / XO (Deck Gun Training):</strong> 3 rolls on Chart [B1] at Long Range. If &ge; 2 Hits ➔ gains <em>Deck Gun Expert</em> (-1 DRM to all deck gun rolls).</p>
             <p style="margin:0 0 6px 0;">• <strong>Chief Engineer (Judgment Training):</strong> Exceed test depth 3 consecutive times starting with 3 hull damage. If no implosion ➔ gains <em>Keen Judgment</em> (avoids hull damage on 1st depth excursion per patrol).</p>
             <p style="margin:0 0 6px 0;">• <strong>Leisure & Tradition Activities (Choose 1 perk):</strong>
               <br>1. <em>Martial Arts (Budo):</em> Gains the counter <strong>Shibumi</strong> (automatically succeeds on 1 die roll per patrol).
               <br>2. <em>Extra Technical Study:</em> 1 free submarine upgrade (<strong>Sub Upgrade</strong>) and <strong>-2 to 1st Promotion Roll</strong>.
               <br>3. <em>Gosei Meditation:</em> Begins campaign with protective talisman <strong>Maneki Neko</strong> (lucky ship cat aboard).
             </p>
             <p style="margin:0;">• <strong>Graduation at Kure:</strong> The official submariner <strong>Sub Badge</strong> is pinned to the uniform on Chart [K1].</p>`
          : `<p style="margin:0 0 6px 0;">• <strong>Capitán (Torpedo Training):</strong> 3 tiradas en Tabla [B1] a Larga Distancia (&le; 6 / 2 a 6). Si logra &ge; 2 impactos ➔ gana la habilidad <em>Torpedo Gunnery</em> (repite 1 fallo de torpedo por patrulla).</p>
             <p style="margin:0 0 6px 0;">• <strong>Segundo Oficial / XO (Deck Gun Training):</strong> 3 tiradas en Tabla [B1] a Larga Distancia. Si logra &ge; 2 impactos ➔ gana <em>Deck Gun Expert</em> (-1 DRM a todas las tiradas de cañón de cubierta).</p>
             <p style="margin:0 0 6px 0;">• <strong>Jefe de Máquinas / Engineer (Judgment Training):</strong> Superar profundidad de prueba 3 veces consecutivas comenzando con 3 daños de casco. Si no hay implosión ➔ gana <em>Keen Judgment</em> (evita el daño de casco en la 1.ª superación de profundidad por patrulla).</p>
             <p style="margin:0 0 6px 0;">• <strong>Actividades de Ocio y Tradición (Elegir 1 beneficio):</strong>
               <br>1. <em>Artes Marciales (Budo):</em> Gana la ficha <strong>Shibumi</strong> (supera con éxito automático 1 tirada de dado por patrulla).
               <br>2. <em>Estudio Técnico Extra:</em> 1 mejora gratis de submarino (<strong>Sub Upgrade</strong>) y <strong>-2 a la 1.ª tirada de Ascenso</strong>.
               <br>3. <em>Meditación Gosei:</em> Inicia la campaña con el amuleto protector <strong>Maneki Neko</strong> (gato de la suerte a bordo).
             </p>
             <p style="margin:0;">• <strong>Graduación en Kure:</strong> Se coloca la insignia oficial de submarinista <strong>Sub Badge</strong> en el uniforme en Chart [K1].</p>`;
      }

      const f2T = document.getElementById('comp-f2-title');
      if (f2T) f2T.innerText = isEn ? "CHART [F2]: KO-HYOTEKI MIDGET SUBMARINE SCHOOL" : "TABLA [F2]: ESCUELA DE MINISUBMARINOS KO-HYOTEKI";
      const f2B = document.getElementById('comp-f2-body');
      if (f2B) {
        f2B.innerHTML = isEn
          ? `<p style="margin:0 0 6px 0;">• <strong>Torpedo Training:</strong> 3 rolls on [B1] at Long Range. If &ge; 2 Hits ➔ gains the counter <em>Midget Torpedo Gunnery</em>.</p>
             <p style="margin:0 0 6px 0;">• <strong>Naval Communications:</strong> 2 rolls on Recovery [M7]. If no failure ➔ gains <em>Superior Comms (+1 drm on recovery)</em>.</p>
             <p style="margin:0;">• <strong>Boat Handling & Nets:</strong> 3 rolls on Nets Table [M5]. If none are 2–4 ➔ gains <em>Boat Handling (result 4 = Penetrates Net safely)</em>.</p>`
          : `<p style="margin:0 0 6px 0;">• <strong>Adiestramiento de Torpedos (Torpedo Training):</strong> 3 tiradas en [B1] a Larga Distancia. Si &ge; 2 impactos ➔ gana la ficha <em>Midget Torpedo Gunnery</em>.</p>
             <p style="margin:0 0 6px 0;">• <strong>Comunicaciones Navales (Communications):</strong> 2 tiradas en Recuperación [M7]. Si no hay fallo ➔ gana <em>Superior Comms (+1 drm en recuperación)</em>.</p>
             <p style="margin:0;">• <strong>Maniobra y Redes (Boat Handling):</strong> 3 tiradas en Tabla de Redes [M5]. Si ninguna es 2–4 ➔ gana <em>Boat Handling (resultado 4 = Atraviesa la Red)</em>.</p>`;
      }

      const f3T = document.getElementById('comp-f3-title');
      if (f3T) f3T.innerText = isEn ? "CHART [F3]: KASUMIGAURA NAVAL AIR SCHOOL (Choose 2)" : "TABLA [F3]: ESCUELA NAVAL DE AVIACIÓN DE KASUMIGAURA (Elegir 2)";
      const f3B = document.getElementById('comp-f3-body');
      if (f3B) {
        f3B.innerHTML = isEn
          ? `<p style="margin:0 0 6px 0;">• <strong>Weapons Expert:</strong> Air bombing rolls receive +1 drm. Rear machine gun defensive fire receives -1 drm to hit.</p>
             <p style="margin:0 0 6px 0;">• <strong>Flawless Maintenance:</strong> Once per mission may reroll a floatplane mishap or malfunction roll.</p>
             <p style="margin:0 0 6px 0;">• <strong>Air Combat Maneuvering (ACM):</strong> Reduces the first damage received in defensive air combat by 1 point.</p>
             <p style="margin:0;">• <strong>Aerial Navigation:</strong> Floatplane receives +1 drm on recovery roll by mothership submarine.</p>`
          : `<p style="margin:0 0 6px 0;">• <strong>Experto en Armamento (Weapons Expert):</strong> Bombardeo aéreo con +1. Ametralladora defensiva trasera a -1 para impactar.</p>
             <p style="margin:0 0 6px 0;">• <strong>Mantenimiento Impecable (Flawless Maintenance):</strong> Permite repetir 1 tirada de avería o percance del hidroavión por misión.</p>
             <p style="margin:0 0 6px 0;">• <strong>Maniobras de Combate Aéreo (ACM):</strong> Reduce en 1 el primer daño recibido en combate aéreo defensivo.</p>
             <p style="margin:0;">• <strong>Navegación Aérea (Aerial Navigation):</strong> Suma +1 drm a la tirada de recuperación del hidroavión por el submarino nodriza.</p>`;
      }
    }

    function applyCompendiumOptionalCombatLanguage(isEn) {
      const badge = document.getElementById('comp-b8-badge');
      if (badge) badge.innerText = isEn ? "OPTIONAL RULES" : "REGLAS OPCIONALES";
      const mainT = document.getElementById('comp-b8-main-title');
      if (mainT) mainT.innerText = isEn ? "CHARTS B8 TO B12: VARIABLE QUALITY, CIRCULAR RUN & EVASION" : "TABLAS B8 A B12: CALIDAD VARIABLE, GIRO CIRCULAR Y EVASIÓN";

      const b8T = document.getElementById('comp-b8-title');
      if (b8T) b8T.innerText = isEn ? "CHART [B8]: VARIABLE ESCORT QUALITY (1d6)" : "TABLA [B8]: CALIDAD VARIABLE DE ESCOLTAS (1d6)";
      const b8Y = document.getElementById('comp-b8-th-year');
      if (b8Y) b8Y.innerText = isEn ? "Year" : "Año";
      const b8G = document.getElementById('comp-b8-th-green');
      if (b8G) b8G.innerText = isEn ? "Green (Novice)" : "Green (Novata)";
      const b8Tr = document.getElementById('comp-b8-th-trained');
      if (b8Tr) b8Tr.innerText = isEn ? "Trained" : "Trained (Entrenada)";
      const b8V = document.getElementById('comp-b8-th-vet');
      if (b8V) b8V.innerText = isEn ? "Veteran" : "Veteran (Veterana)";
      const b8E = document.getElementById('comp-b8-th-elite');
      if (b8E) b8E.innerText = isEn ? "Elite" : "Elite (Élite)";
      const b8Res = document.getElementById('b8-res-box');
      if (b8Res) {
        b8Res.innerHTML = isEn
          ? `• <strong>Green:</strong> Inflicts 1 LESS hit than rolled on [B5].<br>
             • <strong>Trained:</strong> Normal per tables.<br>
             • <strong>Veteran:</strong> Inflicts +1 additional hit on [B5].<br>
             • <strong>Elite:</strong> +1 to Detection on [B4] and +1 hit on [B5].`
          : `• <strong>Green:</strong> Causa 1 impacto MENOS de lo obtenido en [B5].<br>
             • <strong>Trained:</strong> Normal según tablas.<br>
             • <strong>Veteran:</strong> Causa +1 impacto adicional en [B5].<br>
             • <strong>Elite:</strong> +1 a Detección en [B4] y +1 impacto en [B5].`;
      }

      const b9T = document.getElementById('comp-b9-title');
      if (b9T) b9T.innerText = isEn ? "CHART [B9]: VARIABLE AIRCRAFT QUALITY (1d6)" : "TABLA [B9]: CALIDAD VARIABLE DE AVIACIÓN (1d6)";
      const b9Y = document.getElementById('comp-b9-th-year');
      if (b9Y) b9Y.innerText = isEn ? "Year" : "Año";
      const b9G = document.getElementById('comp-b9-th-green');
      if (b9G) b9G.innerText = isEn ? "Green" : "Green";
      const b9Tr = document.getElementById('comp-b9-th-trained');
      if (b9Tr) b9Tr.innerText = isEn ? "Trained" : "Trained";
      const b9V = document.getElementById('comp-b9-th-vet');
      if (b9V) b9V.innerText = isEn ? "Veteran" : "Veteran";
      const b9E = document.getElementById('comp-b9-th-elite');
      if (b9E) b9E.innerText = isEn ? "Elite" : "Elite";
      const b9Res = document.getElementById('b9-res-box');
      if (b9Res) {
        b9Res.innerHTML = isEn
          ? `• <strong>Green:</strong> Inflicts 1 LESS hit on [B5].<br>
             • <strong>Trained:</strong> Normal.<br>
             • <strong>Veteran:</strong> +1 hit on [B5].<br>
             • <strong>Elite:</strong> +1 hit on [B5] and <strong>2 automatic crew casualties</strong> (instead of 1).`
          : `• <strong>Green:</strong> Causa 1 impacto MENOS en [B5].<br>
             • <strong>Trained:</strong> Normal.<br>
             • <strong>Veteran:</strong> +1 impacto en [B5].<br>
             • <strong>Elite:</strong> +1 impacto en [B5] y <strong>2 bajas automáticas en dotación</strong> (en vez de 1).`;
      }

      const b10T = document.getElementById('comp-b10-title');
      if (b10T) b10T.innerText = isEn ? "CHART [B10]: TORPEDO CIRCULAR RUN" : "TABLA [B10]: RETORNO CIRCULAR DE TORPEDO (CIRCULAR RUN)";
      const b10D = document.getElementById('comp-b10-desc');
      if (b10D) {
        b10D.innerHTML = isEn
          ? `If a modified or natural <strong>12</strong> is rolled when firing a torpedo on [B1], there is a danger it circles back against your submarine:`
          : `Si obtienes una tirada de <strong>12</strong> al disparar un torpedo en [B1], existe riesgo de que describa un círculo y regrese contra tu submarino:`;
      }
      const b10Roll = document.getElementById('comp-b10-th-roll');
      if (b10Roll) b10Roll.innerText = isEn ? "2d6 Roll" : "Tirada 2d6";
      const b10Res = document.getElementById('comp-b10-th-res');
      if (b10Res) b10Res.innerText = isEn ? "Result" : "Resultado";
      const b10Safe = document.getElementById('comp-b10-safe-desc');
      if (b10Safe) b10Safe.innerText = isEn ? "Normal Miss. Torpedo runs past safely." : "Fallo normal (Normal Miss). Pasa de largo.";
      const b10Danger = document.getElementById('comp-b10-danger-desc');
      if (b10Danger) b10Danger.innerText = isEn ? "Circular Run! Roll 2d6: 2-5 Hit, Sunk if non-dud!" : "¡Giro Circular! Tira 2d6: 2-5 Impacto, ¡Hundido si no es inerte!";

      const b12T = document.getElementById('comp-b12-title');
      if (b12T) b12T.innerText = isEn ? "CHART [B12]: COMBAT EVASIVE MANEUVERS (1d6 vs 1d6)" : "TABLA [B12]: MANIOBRAS EVASIVAS EN COMBATE (1d6 vs 1d6)";
      const b12Sub = document.getElementById('comp-b12-sub');
      if (b12Sub) b12Sub.innerText = isEn ? "Sub vs Escort" : "Sub vs Escolta";
      const b12D = document.getElementById('comp-b12-desc');
      if (b12D) {
        b12D.innerText = isEn
          ? "The player secretly chooses or rolls an evasion heading (1d6) before the escort rolls its attack direction (1d6):"
          : "El jugador elige o tira su rumbo evasivo (1d6) antes de que la escolta lance su contraataque (1d6):";
      }
      const b12Die = document.getElementById('comp-b12-th-die');
      if (b12Die) b12Die.innerText = isEn ? "Die (1d6)" : "Dado (1d6)";
      const b12Head = document.getElementById('comp-b12-th-heading');
      if (b12Head) b12Head.innerText = isEn ? "Chosen Heading / Maneuver" : "Rumbo Elegido / Maniobra";
      const b12R1 = document.getElementById('comp-b12-r1');
      if (b12R1) b12R1.innerText = isEn ? "Port (Left)" : "Izquierda (Port / Left)";
      const b12R2 = document.getElementById('comp-b12-r2');
      if (b12R2) b12R2.innerText = isEn ? "Starboard (Right)" : "Derecha (Starboard / Right)";
      const b12R3 = document.getElementById('comp-b12-r3');
      if (b12R3) b12R3.innerText = isEn ? "Straight Ahead" : "Recto (Straight Ahead)";
      const b12Rules = document.getElementById('comp-b12-rules');
      if (b12Rules) {
        b12Rules.innerHTML = isEn
          ? `<div style="padding:2px 4px;">• <strong>Different heading:</strong> Submarine suffers <strong>1 LESS hit</strong> on [B5].</div>
             <div style="padding:2px 4px;">• <strong>Same heading (different number):</strong> Suffers <strong>+1 additional hit</strong> on [B5].</div>
             <div style="padding:2px 4px;">• <strong>EXACT same number:</strong> Suffers <strong>+3 additional hits</strong> on [B5].</div>`
          : `<div style="padding:2px 4px;">• <strong>Rumbos distintos:</strong> El submarino sufre <strong>1 impacto MENOS</strong> en [B5].</div>
             <div style="padding:2px 4px;">• <strong>Mismo rumbo pero distinto número:</strong> Sufre <strong>+1 impacto adicional</strong> en [B5].</div>
             <div style="padding:2px 4px;">• <strong>Mismo rumbo y NÚMERO EXACTO:</strong> Sufre <strong>+3 impactos adicionales</strong> en [B5].</div>`;
      }
    }

if (typeof window !== 'undefined') {
  window.applyLanguage = applyLanguage;
  if (typeof applyPatrolLanguage !== 'undefined') window.applyPatrolLanguage = applyPatrolLanguage;
  if (typeof applyCompendiumLanguage !== 'undefined') window.applyCompendiumLanguage = applyCompendiumLanguage;
  if (typeof applyCompendiumOptionalLanguage !== 'undefined') window.applyCompendiumOptionalLanguage = applyCompendiumOptionalLanguage;
}
