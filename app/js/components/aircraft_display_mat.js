// =========================================================================
// SENSUiKAN: AIRCRAFT DISPLAY MAT [CHART P & REGLA 7.17]
// Estación Táctica de Hidroavión Embarcado + Fichas Interactivas + Tablas OCR
// Compatible 100% Bilingüe (ES / EN) y Paridad Total con Reglas Oficiales IJN
// =========================================================================

(function() {
  // Base de datos de información e ilustraciones generadas de aeronaves
  const AIRCRAFT_INFO_DATABASE = {
    0: {
      key: 'glen',
      name_es: 'Yokosuka E14Y1 "Glen" (Tipo 0 Modelo 11)',
      name_en: 'Yokosuka E14Y1 "Glen" (Type 0 Model 11)',
      jp_title: '零式小型水上偵察機 (E14Y1)',
      img: 'assets/chits/aircraft_yokosuka_e14y_glen.jpg',
      role_es: 'Hidroavión biplaza de reconocimiento naval embarcado.',
      role_en: 'Two-seat submarine-borne reconnaissance floatplane.',
      specs: {
        motor: 'Hitachi Tempu 12 radial (340 hp)',
        speed: '246 km/h (133 nudos)',
        range: '870 km (autonomía 5.5 horas)',
        armament: '1× Ametralladora Tipo 92 de 7.7mm trasera',
        bombs: '2× 30 kg o 1× 60 kg bombas incendiarias / HE'
      },
      note_es: 'Único avión enemigo que bombardeó EE.UU. continental en la IGM (Operación Lookout, Oregón, sept-1942 por Nobuo Fujita desde el submarino I-25).',
      note_en: 'Only enemy aircraft to bomb mainland USA during WWII (Lookout Air Raids, Oregon, Sept 1942 by Nobuo Fujita from sub I-25).'
    },
    1: {
      key: 'slim',
      name_es: 'Watanabe E9W1 "Slim" (Tipo 96 Modelo 1)',
      name_en: 'Watanabe E9W1 "Slim" (Type 96 Model 1)',
      jp_title: '九六式小型水上機 (E9W1)',
      img: 'assets/chits/aircraft_watanabe_e9w_slim.jpg',
      role_es: 'Biplano de reconocimiento naval para submarinos de primera generación.',
      role_en: 'Biplane naval reconnaissance floatplane for early-war submarines.',
      specs: {
        motor: 'Hitachi Tempu 11 radial (300 hp)',
        speed: '232 km/h (125 nudos)',
        range: '590 km',
        armament: '1× Ametralladora Tipo 92 de 7.7mm trasera',
        bombs: 'Sin capacidad de carga pesada'
      },
      note_es: 'Operó activamente en submarinos Junsen J2 e I-7/I-8 en misiones de exploración previa a Pearl Harbor en 1941 y en el Océano Índico.',
      note_en: 'Operated from Junsen J2 and I-7/I-8 submarines scouting Pearl Harbor prior to the Dec 1941 raid and in the Indian Ocean.'
    },
    2: {
      key: 'seiran_1',
      name_es: 'Aichi M6A1 "Seiran" #1 (Tormenta en Cielo Despejado)',
      name_en: 'Aichi M6A1 "Seiran" #1 (Clear Sky Storm)',
      jp_title: '特殊攻撃機 晴嵐 (M6A1)',
      img: 'assets/chits/aircraft_aichi_m6a_seiran.jpg',
      role_es: 'Hidroavión biplaza de ataque rápido y bombardeo en picado.',
      role_en: 'Fast special attack and dive-bombing submarine-launched floatplane.',
      specs: {
        motor: 'Aichi Atsuta 32 V12 refrigerado por líquido (1,400 hp)',
        speed: '474 km/h (256 nudos)',
        range: '1,190 km',
        armament: '1× Ametralladora Tipo 2 de 13mm flexible en cabina trasera',
        bombs: '1× Torpedo Tipo 91 (850 kg) o 1× Bomba de 800 kg / 250 kg'
      },
      note_es: 'Diseñado en secreto para el megasubmarino portaaviones clase Sen-Toku (I-400), con alas plegables montadas en 10 min para atacar el Canal de Panamá.',
      note_en: 'Built in secret for the giant Sen-Toku (I-400) submarine aircraft carrier, with folding wings deployed in 10 minutes to strike the Panama Canal.'
    },
    3: {
      key: 'seiran_2',
      name_es: 'Aichi M6A1 "Seiran" #2',
      name_en: 'Aichi M6A1 "Seiran" #2',
      jp_title: '特殊攻撃機 晴嵐 二号機',
      img: 'assets/chits/aircraft_aichi_m6a_seiran.jpg',
      role_es: 'Segundo aparato del ala aérea de la clase Sen-Toku (I-400).',
      role_en: 'Second aircraft of the Sen-Toku class embarked air wing.',
      specs: {
        motor: 'Aichi Atsuta 32 V12 (1,400 hp)',
        speed: '474 km/h',
        range: '1,190 km',
        armament: '1× 13mm MG trasera',
        bombs: '1× 800 kg / 250 kg Bomba'
      },
      note_es: 'Componía junto al #1 y #3 la escuadrilla de ataque embarcada.',
      note_en: 'Formed alongside #1 and #3 the embarked strike squadron.'
    },
    4: {
      key: 'seiran_3',
      name_es: 'Aichi M6A1 "Seiran" #3',
      name_en: 'Aichi M6A1 "Seiran" #3',
      jp_title: '特殊攻撃機 晴嵐 三号機',
      img: 'assets/chits/aircraft_aichi_m6a_seiran.jpg',
      role_es: 'Tercer aparato del hangar tubular estanco del I-400.',
      role_en: 'Third aircraft in the I-400 cylindrical watertight hangar.',
      specs: {
        motor: 'Aichi Atsuta 32 V12 (1,400 hp)',
        speed: '474 km/h',
        range: '1,190 km',
        armament: '1× 13mm MG trasera',
        bombs: '1× 800 kg / 250 kg Bomba'
      },
      note_es: 'Estibado desmontado en el extremo de popa del hangar tubular de 35 metros.',
      note_en: 'Stowed disassembled in the aft section of the 35-meter cylindrical hangar.'
    },
    5: {
      key: 'glen_2',
      name_es: 'Yokosuka E14Y1 "Glen" #2 (Tipo 0 Modelo 11)',
      name_en: 'Yokosuka E14Y1 "Glen" #2 (Type 0 Model 11)',
      jp_title: '零式小型水上偵察機 二号機',
      img: 'assets/chits/aircraft_yokosuka_e14y_glen.jpg',
      role_es: 'Segundo hidroavión biplaza embarcado en submarinos Tipo A Modificado.',
      role_en: 'Second embarked floatplane on Type A Modified submarines.',
      specs: {
        motor: 'Hitachi Tempu 12 radial (340 hp)',
        speed: '246 km/h (133 nudos)',
        range: '870 km (autonomía 5.5 horas)',
        armament: '1× Ametralladora Tipo 92 de 7.7mm trasera',
        bombs: '2× 30 kg o 1× 60 kg bombas incendiarias / HE'
      },
      note_es: 'Estibado en el hangar extendido para misiones consecutivas de reconocimiento o bombardeo.',
      note_en: 'Stowed in the enlarged hangar for consecutive reconnaissance or bombing sorties.'
    }
  };

  // Estado del tapete de hidroaviones
  let aircraftState = {
    activeSlot: 0,
    hangarDamaged: false,
    craneDamaged: false,
    flawlessUsed: false,
    skills: {
      weapons: false,
      maintenance: false,
      acm: false,
      nav: false
    },
    slots: [
      { bombs: false, damage: 0, pilot: 'ok', gunner: 'ok', radioInop: false, launchStatus: null, missionDone: false, flightCircle: 1, flightLogs: [] },
      { bombs: false, damage: 0, pilot: 'ok', gunner: 'ok', radioInop: false, launchStatus: null, missionDone: false, flightCircle: 1, flightLogs: [] },
      { bombs: false, damage: 0, pilot: 'ok', gunner: 'ok', radioInop: false, launchStatus: null, missionDone: false, flightCircle: 1, flightLogs: [] },
      { bombs: false, damage: 0, pilot: 'ok', gunner: 'ok', radioInop: false, launchStatus: null, missionDone: false, flightCircle: 1, flightLogs: [] },
      { bombs: false, damage: 0, pilot: 'ok', gunner: 'ok', radioInop: false, launchStatus: null, missionDone: false, flightCircle: 1, flightLogs: [] },
      { bombs: false, damage: 0, pilot: 'ok', gunner: 'ok', radioInop: false, launchStatus: null, missionDone: false, flightCircle: 1, flightLogs: [] }
    ]
  };

  function getActiveSlotData() {
    return aircraftState.slots[aircraftState.activeSlot] || aircraftState.slots[0];
  }

  // Detectar y seleccionar automáticamente el hidroavión según el submarino activo
  function autoSelectAircraftForSub() {
    const subKey = (window.campaignState && window.campaignState.activeSubKey) || 'Junsen_J_IM_Class';
    if (subKey === 'Sen_Toku_Class') {
      aircraftState.activeSlot = 2; // Primer Aichi M6A1
    } else if (subKey === 'Type_A2_Class' || subKey === 'Type_AM_Class') {
      aircraftState.activeSlot = 2; // Primer Aichi M6A1
    } else if (subKey === 'Type_A_Modified') {
      aircraftState.activeSlot = 0; // Primer Yokosuka E14Y1 Glen
    } else if (subKey === 'Junsen_J2_Class') {
      aircraftState.activeSlot = 1; // Watanabe E9W1 Slim
    } else {
      aircraftState.activeSlot = 0; // Yokosuka E14Y1 Glen
    }
  }

  // Mapeo de ranura de aeronave a índice de piloto (Regla Oficial 7.17)
  function getPilotIndexForSlot(slotNum, subKey) {
    if (subKey === 'Sen_Toku_Class') {
      if (slotNum === 3) return 1;
      if (slotNum === 4) return 2;
      return 0;
    }
    if (subKey === 'Type_A_Modified') {
      if (slotNum === 5) return 1;
      return 0;
    }
    if (subKey === 'Type_A2_Class' || subKey === 'Type_AM_Class') {
      if (slotNum === 3) return 1;
      return 0;
    }
    return 0;
  }

  function getPilotSkills(pilotIdx) {
    pilotIdx = pilotIdx || 0;
    if (!window.campaignState) return [];
    if (!window.campaignState.school) window.campaignState.school = {};
    if (!window.campaignState.school.pilotSkills) {
      window.campaignState.school.pilotSkills = {
        0: [...(window.campaignState.school.f3Skills || [])],
        1: [],
        2: []
      };
    }
    if ((!window.campaignState.school.pilotSkills[0] || window.campaignState.school.pilotSkills[0].length === 0) &&
        (window.campaignState.school.f3Skills && window.campaignState.school.f3Skills.length > 0)) {
      window.campaignState.school.pilotSkills[0] = [...window.campaignState.school.f3Skills];
    }
    return window.campaignState.school.pilotSkills[pilotIdx] || [];
  }

  function setPilotSkills(pilotIdx, skills) {
    pilotIdx = pilotIdx || 0;
    if (!window.campaignState) window.campaignState = {};
    if (!window.campaignState.school) window.campaignState.school = {};
    if (!window.campaignState.school.pilotSkills) {
      window.campaignState.school.pilotSkills = { 0: [], 1: [], 2: [] };
    }
    window.campaignState.school.pilotSkills[pilotIdx] = [...skills];
    if (pilotIdx === 0) {
      window.campaignState.school.f3Skills = [...skills];
    }
  }

  function getActivePilotSkills() {
    const subKey = (window.campaignState && window.campaignState.activeSubKey) || 'Junsen_J_IM_Class';
    const pilotIdx = getPilotIndexForSlot(aircraftState.activeSlot, subKey);
    return getPilotSkills(pilotIdx);
  }

  // Comprobar habilidades adquiridas en Escuela F3 para la aeronave/piloto actual
  function hasSchoolSkill(skillName) {
    const f3 = getActivePilotSkills();
    const norm = (skillName || '').toLowerCase();
    if (norm === 'weapons' || norm === 'weap') return f3.some(s => s.toLowerCase().includes('weapon'));
    if (norm === 'maintenance' || norm === 'maint') return f3.some(s => s.toLowerCase().includes('maint'));
    if (norm === 'acm') return f3.some(s => s.toLowerCase().includes('acm') || s.toLowerCase().includes('maneuver'));
    if (norm === 'nav' || norm === 'navigation') return f3.some(s => s.toLowerCase().includes('nav'));
    return f3.some(s => s.toLowerCase().includes(norm));
  }

  function syncSchoolSkillsToAircraftState() {
    const f3 = getActivePilotSkills();
    aircraftState.skills = {
      weapons: f3.some(s => s.toLowerCase().includes('weapon')),
      maintenance: f3.some(s => s.toLowerCase().includes('maint')),
      acm: f3.some(s => s.toLowerCase().includes('acm') || s.toLowerCase().includes('maneuver')),
      nav: f3.some(s => s.toLowerCase().includes('nav'))
    };
    if (window.campaignState && window.campaignState.aircraftState) {
      window.campaignState.aircraftState.skills = Object.assign({}, aircraftState.skills);
    }
  }

  // =========================================================================
  // GESTIÓN DE ACCIONES INTERACTIVAS EN LOS COUNTERS
  // =========================================================================
  // =========================================================================
  // SINCRONIZACIÓN BIDIRECCIONAL CON EL TABLERO DEL SUBMARINO (REGISTRO & PILOTO)
  // =========================================================================
  function syncAircraftStateToSubBoard() {
    if (typeof subBoardState === 'undefined' || !subBoardState) return;
    const s = getActiveSlotData();
    const cfg = (typeof getSubmarineArmamentConfig === 'function' && typeof currentBoardSubKey !== 'undefined')
      ? getSubmarineArmamentConfig(currentBoardSubKey)
      : { hasAircraft: true, aircraftCount: 1 };
    const airCount = (typeof cfg.aircraftCount === 'number') ? cfg.aircraftCount : (cfg.hasAircraft ? 1 : 0);
    const isPlane2 = (aircraftState.activeSlot === 1 && airCount >= 2);

    // 1. Sincronizar Daño y Estado de Vuelo del Hidroavión
    if (isPlane2) {
      subBoardState.aircraftDamageLevel2 = s.damage;
      subBoardState.aircraftDamaged2 = (s.damage > 0 || s.launchStatus === 'crashed' || s.launchStatus === 'lost');
      subBoardState.aircraftFlightStatus2 = s.launchStatus;
    } else {
      subBoardState.aircraftDamageLevel = s.damage;
      subBoardState.aircraftDamaged = (s.damage > 0 || s.launchStatus === 'crashed' || s.launchStatus === 'lost');
      subBoardState.aircraftFlightStatus = s.launchStatus;
    }

    // 2. Sincronizar Estado del Piloto con slot-crew-spec
    if (subBoardState.crew) {
      if (s.pilot === 'lw') {
        subBoardState.crew['spec'] = 'wounded';
      } else if (s.pilot === 'sw') {
        subBoardState.crew['spec'] = 'serious';
      } else if (s.pilot === 'kia') {
        subBoardState.crew['spec'] = 'kia';
      } else {
        subBoardState.crew['spec'] = 'active';
      }
    }

    // 3. Sincronizar Hangar y Grúa
    subBoardState.systems = subBoardState.systems || {};
    if (aircraftState.hangarDamaged) {
      subBoardState.systems['hangar'] = 'dmg';
    } else if (subBoardState.systems['hangar'] === 'dmg') {
      delete subBoardState.systems['hangar'];
    }

    if (aircraftState.craneDamaged) {
      subBoardState.systems['crane'] = 'dmg';
    } else if (subBoardState.systems['crane'] === 'dmg') {
      delete subBoardState.systems['crane'];
    }

    if (typeof saveSubBoardState === 'function') saveSubBoardState();
    if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
  }

  function syncSubBoardToAircraftState() {
    if (typeof subBoardState === 'undefined' || !subBoardState) return;
    const s = getActiveSlotData();
    const cfg = (typeof getSubmarineArmamentConfig === 'function' && typeof currentBoardSubKey !== 'undefined')
      ? getSubmarineArmamentConfig(currentBoardSubKey)
      : { hasAircraft: true, aircraftCount: 1 };
    const airCount = (typeof cfg.aircraftCount === 'number') ? cfg.aircraftCount : (cfg.hasAircraft ? 1 : 0);
    const isPlane2 = (aircraftState.activeSlot === 1 && airCount >= 2);

    // Piloto desde subBoardState.crew['spec']
    if (subBoardState.crew && subBoardState.crew['spec']) {
      const specStat = subBoardState.crew['spec'];
      if (specStat === 'wounded') s.pilot = 'lw';
      else if (specStat === 'serious' || specStat === 'ill') s.pilot = 'sw';
      else if (specStat === 'kia') s.pilot = 'kia';
      else s.pilot = 'ok';
    }

    // Daño desde subBoardState
    const dmg = isPlane2 
      ? (typeof subBoardState.aircraftDamageLevel2 === 'number' ? subBoardState.aircraftDamageLevel2 : (subBoardState.aircraftDamaged2 ? 1 : 0))
      : (typeof subBoardState.aircraftDamageLevel === 'number' ? subBoardState.aircraftDamageLevel : (subBoardState.aircraftDamaged ? 1 : 0));
    s.damage = dmg;

    // Estado de vuelo
    const flStat = isPlane2 ? subBoardState.aircraftFlightStatus2 : subBoardState.aircraftFlightStatus;
    if (flStat) s.launchStatus = flStat;

    // Hangar y Grúa
    if (subBoardState.systems) {
      aircraftState.hangarDamaged = (subBoardState.systems['hangar'] === 'dmg' || subBoardState.systems['hangar'] === 'inop');
      aircraftState.craneDamaged = (subBoardState.systems['crane'] === 'dmg' || subBoardState.systems['crane'] === 'inop');
    }
  }

  function handleAirSlotClick(slotType) {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();

    switch(slotType) {
      case 'hangar':
        aircraftState.hangarDamaged = !aircraftState.hangarDamaged;
        if (typeof showToast === 'function') {
          showToast(aircraftState.hangarDamaged 
            ? (isEn ? "Sub Hangar Damaged! Launch blocked [Rule 7.15]." : "¡Hangar Dañado! Despegue de hidroavión bloqueado [Regla 7.15].")
            : (isEn ? "Sub Hangar Repaired & Operative." : "Hangar de cubierta reparado y operativo."));
        }
        break;

      case 'crane':
        aircraftState.craneDamaged = !aircraftState.craneDamaged;
        if (typeof showToast === 'function') {
          showToast(aircraftState.craneDamaged 
            ? (isEn ? "Deck Crane Damaged! Cannot hoist plane aboard [Rule 7.17.4]." : "¡Grúa Averiada! No se podrá izar el hidroavión amerizado [Regla 7.17.4].")
            : (isEn ? "Deck Crane Repaired & Operative." : "Grúa de popa reparada y operativa."));
        }
        break;

      case 'bombs':
        s.bombs = !s.bombs;
        if (typeof showToast === 'function') {
          showToast(s.bombs 
            ? (isEn ? "Bombs loaded for strike mission [Rule 7.7]!" : "¡Bombas armadas para misión de bombardeo [Regla 7.7]!")
            : (isEn ? "Clean Reconnaissance Configuration (No Bombs)." : "Configuración de exploración limpia (Sin Bombas)."));
        }
        break;
    }

    syncAircraftStateToSubBoard();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    if (typeof saveState === 'function') saveState();
  }

  function handleAirDamageClick(dmgVal) {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    s.damage = (s.damage === dmgVal) ? 0 : dmgVal;
    syncAircraftStateToSubBoard();
    
    if (typeof showToast === 'function') {
      const lbl = (s.damage === 0) 
        ? (isEn ? "Hull / Structure Intact (0 Damage)" : "Casco / Fuselaje intacto (0 Daños)")
        : (isEn ? `Structural Damage: ${s.damage} / 3` : `Daño Estructural: ${s.damage} / 3`);
      showToast(lbl);
    }

    syncAircraftStateToSubBoard();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    if (typeof saveState === 'function') saveState();
  }

  function handleAirCrewClick(member) {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    const cur = s[member] || 'ok';
    const next = (cur === 'ok') ? 'lw' : (cur === 'lw') ? 'sw' : (cur === 'sw') ? 'kia' : 'ok';
    s[member] = next;
    syncAircraftStateToSubBoard();

    if (typeof showToast === 'function') {
      const roleName = (member === 'pilot') ? (isEn ? 'Pilot' : 'Piloto') : (isEn ? 'Gunner/Obs.' : 'Artillero/Obs.');
      const statName = (next === 'ok') ? (isEn ? 'Healthy (OK)' : 'Sano (OK)')
        : (next === 'lw') ? (isEn ? 'Light Wound (LW)' : 'Herida Leve (LW)')
        : (next === 'sw') ? (isEn ? 'Serious Wound (SW - Unfit to fly)' : 'Herida Grave (SW - No apto)')
        : (isEn ? 'K.I.A. (Casualty)' : 'K.I.A. (Baja mortal)');
      showToast(`${roleName}: ${statName}`);
    }

    syncAircraftStateToSubBoard();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    if (typeof saveState === 'function') saveState();
  }

  function handleAirSkillClick(skillKey) {
    const isEn = (window.currentLang === 'en');
    const subKey = (window.campaignState && window.campaignState.activeSubKey) || 'Junsen_J_IM_Class';
    const pilotIdx = getPilotIndexForSlot(aircraftState.activeSlot, subKey);
    let skills = [...getPilotSkills(pilotIdx)];

    const skillMap = {
      weapons: "Weapons Expert",
      maintenance: "Flawless Maintenance",
      acm: "Air Combat Maneuvering",
      nav: "Aerial Navigation"
    };
    const sName = skillMap[skillKey] || skillKey;
    const isCurrentlyActive = hasSchoolSkill(skillKey);

    if (isCurrentlyActive) {
      skills = skills.filter(s => {
        const str = s.toLowerCase();
        if (skillKey === 'weapons') return !str.includes('weapon');
        if (skillKey === 'maintenance') return !str.includes('maint');
        if (skillKey === 'acm') return !str.includes('acm') && !str.includes('maneuver');
        if (skillKey === 'nav') return !str.includes('nav');
        return !str.includes(skillKey.toLowerCase());
      });
      setPilotSkills(pilotIdx, skills);
      if (typeof showToast === 'function') {
        showToast(isEn ? `Pilot #${pilotIdx + 1}: Skill Removed: ${sName}` : `Piloto #${pilotIdx + 1}: Habilidad desactivada: ${sName}`);
      }
    } else {
      if (skills.length >= 2) {
        if (typeof showToast === 'function') {
          showToast(isEn ? `⚠️ Max 2 Air skills allowed for Pilot #${pilotIdx + 1} [Rule 4.8.3].` : `⚠️ Solo se permiten 2 habilidades para el Piloto #${pilotIdx + 1} [Regla 4.8.3].`);
        }
        return;
      }
      skills.push(sName);
      setPilotSkills(pilotIdx, skills);
      if (typeof showToast === 'function') {
        showToast(isEn ? `Pilot #${pilotIdx + 1}: Skill Active: ${sName}` : `Piloto #${pilotIdx + 1}: Habilidad activada: ${sName}`);
      }
    }

    if (typeof updateSchoolEquipDisplay === 'function') updateSchoolEquipDisplay();
    if (typeof syncF3ToK1 === 'function') syncF3ToK1();
    syncSchoolSkillsToAircraftState();
    renderAircraftMatUI();
    if (typeof saveState === 'function') saveState();
  }

  function selectAircraftSlot(slotIdx) {
    aircraftState.activeSlot = slotIdx;
    const isEn = (window.currentLang === 'en');
    const info = AIRCRAFT_INFO_DATABASE[slotIdx] || AIRCRAFT_INFO_DATABASE[0];
    if (typeof showToast === 'function') {
      showToast(`✈️ ${isEn ? info.name_en : info.name_es}`);
    }
    syncAircraftStateToSubBoard();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    if (typeof saveState === 'function') saveState();
  }

  // =========================================================================
  // SELECCIÓN Y RESOLUCIÓN TÁCTICA DE TABLAS P1 Y P2 (PASADAS POR OCR)
  // =========================================================================
  function clearP1RowHighlights() {
    ['air-p1-row-2', 'air-p1-row-3', 'air-p1-row-norm', 'air-p1-row-nominal', 'air-p1-row-12'].forEach(id => {
      const row = document.getElementById(id);
      if (row) row.classList.remove('air-row-highlight');
    });
  }

  function clearP2RowHighlights() {
    ['air-p2-row-lost', 'air-p2-row-rec', 'air-p2-row-recovered'].forEach(id => {
      const row = document.getElementById(id);
      if (row) row.classList.remove('air-row-highlight');
    });
  }

  function selectP1LaunchOutcome(outcomeKey, rollInfo = null) {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    clearP1RowHighlights();

    // Reset radioInop unless explicitly 12 / radio_inop
    s.radioInop = (outcomeKey === 12 || outcomeKey === 'radio_inop');

    const outEl = document.getElementById('air-p1-result-box');
    const flBtn = document.getElementById('air-p1-flawless-btn');

    let msg = "";
    let statusClass = "text-emerald-400";
    let isMishap = false;
    const prefix = rollInfo 
      ? (isEn ? `[2d6 Roll: ${rollInfo.roll} (${rollInfo.d1}+${rollInfo.d2})] ` : `[Tirada 2d6: ${rollInfo.roll} (${rollInfo.d1}+${rollInfo.d2})] `)
      : (isEn ? `[Manual Selection] ` : `[Selección Manual] `);

    if (outcomeKey === 2 || outcomeKey === 'engine_misses') {
      isMishap = true;
      const targetRow = document.getElementById('air-p1-row-2');
      if (targetRow) targetRow.classList.add('air-row-highlight');

      if (rollInfo && rollInfo.mRoll !== undefined) {
        if (rollInfo.mRoll >= 10) {
          s.damage = 3;
          s[rollInfo.crewMember] = rollInfo.wType;
          statusClass = "text-rose-400";
          msg = prefix + (isEn 
            ? `<strong>ENGINE SEIZURE:</strong> 2d6 check = ${rollInfo.mRoll} (≥10): Catastrophic failure! Plane crashed into sea. Crew casualty (1d6=${rollInfo.wRoll}): ${rollInfo.crewMember.toUpperCase()} suffered ${rollInfo.wType.toUpperCase()}.`
            : `<strong>¡FALLO CRÍTICO DE MOTOR!</strong> Chequeo 2d6 = ${rollInfo.mRoll} (≥10): ¡El motor se gripa y el hidroavión se estrella en el mar! Baja (1d6=${rollInfo.wRoll}): ${rollInfo.crewMember === 'pilot' ? 'Piloto' : 'Artillero'} sufre ${rollInfo.wType === 'lw' ? 'Herida Leve' : rollInfo.wType === 'sw' ? 'Herida Grave' : 'KIA (Baja Mortal)'}.`);
        } else {
          msg = prefix + (isEn
            ? `<strong>ENGINE SPUTTERS:</strong> 2d6 check = ${rollInfo.mRoll} (<10). Engine coughed violently but caught power in time! Clean takeoff achieved.`
            : `<strong>FALLO DE MOTOR LEVE:</strong> Chequeo 2d6 = ${rollInfo.mRoll} (<10). El motor tose y ratea pero recupera potencia a tiempo. ¡Despegue completado!`);
        }
      } else {
        statusClass = "text-amber-400";
        msg = prefix + (isEn
          ? `<strong>ENGINE CRITICAL ISSUE:</strong> Motor sputtering or seizure [Rule 7.17.2]. Click Launch (2d6) to execute full 2d6 engine check.`
          : `<strong>FALLO CRÍTICO DE MOTOR:</strong> Motor rateando o gripado [Regla 7.17.2]. Lanza los dados o fija daños si se produjo fallo catastrófico.`);
      }
      s.launchStatus = (s.damage >= 3) ? 'crashed' : 'airborne';
    } else if (outcomeKey === 3 || outcomeKey === 'assembly') {
      isMishap = true;
      s.launchStatus = 'assembly';
      const targetRow = document.getElementById('air-p1-row-3');
      if (targetRow) targetRow.classList.add('air-row-highlight');

      statusClass = "text-amber-400";
      msg = prefix + (isEn
        ? `<strong>ASSEMBLY PROBLEM:</strong> Wings misaligned during topside assembly. Abort mission or roll an additional round of combat, then attempt launch again [Rule 7.17.2].`
        : `<strong>PROBLEMA DE ENSAMBLAJE:</strong> Desajuste al montar alas en cubierta. Abortar misión O tirar 1 ronda adicional de combate marítimo antes de reintentar el despegue [Regla 7.17.2].`);
    } else if (outcomeKey === 12 || outcomeKey === 'radio_inop') {
      isMishap = true;
      s.radioInop = true;
      s.launchStatus = 'airborne';
      const targetRow = document.getElementById('air-p1-row-12');
      if (targetRow) targetRow.classList.add('air-row-highlight');

      statusClass = "text-amber-400";
      msg = prefix + (isEn
        ? `<strong>RADIO INOPERATIVE:</strong> Antenna connection severed! Airborne successfully, but suffers <strong>-1 DRM to Recovery Roll [P2]</strong>.`
        : `<strong>RADIO INOPERATIVA:</strong> ¡Antena de a bordo averiada! El hidroavión despega con éxito, pero recibe <strong>-1 DRM a la tirada de Recuperación [P2]</strong>.`);
    } else {
      // Nominal (4-11)
      s.radioInop = false;
      s.launchStatus = 'airborne';
      const targetRow = document.getElementById('air-p1-row-norm') || document.getElementById('air-p1-row-nominal');
      if (targetRow) targetRow.classList.add('air-row-highlight');

      msg = prefix + (isEn
        ? `<strong>PERFECT TAKEOFF:</strong> Catapult acceleration nominal! Floatplane climbs smoothly towards cruising altitude.`
        : `<strong>DESPEGUE IMPECABLE:</strong> ¡Presión de catapulta nominal! El hidroavión asciende suavemente hacia su altitud de crucero.`);
    }

    if (outEl) {
      outEl.innerHTML = `<div style="font-size:0.86rem; line-height:1.4;" class="${statusClass}">${msg}</div>`;
    }

    // Actualizar badge de dados P1
    if (rollInfo) {
      s.p1DiceVal = `${rollInfo.d1} + ${rollInfo.d2} = ${rollInfo.roll}`;
      s.p1DiceSummary = (outcomeKey === 2) ? (isEn ? "Engine Seizure" : "Fallo Motor")
        : (outcomeKey === 3) ? (isEn ? "Assembly Issue" : "Problema Montaje")
        : (outcomeKey === 12) ? (isEn ? "Radio INOP" : "Radio INOP")
        : (isEn ? "Nominal Takeoff" : "Despegue Nominal");
    } else {
      const valStr = (outcomeKey === 2) ? "2" : (outcomeKey === 3) ? "3" : (outcomeKey === 12) ? "12" : "7";
      s.p1DiceVal = `${valStr} (Manual)`;
      s.p1DiceSummary = (outcomeKey === 2) ? (isEn ? "Engine Seizure" : "Fallo Motor")
        : (outcomeKey === 3) ? (isEn ? "Assembly Issue" : "Problema Montaje")
        : (outcomeKey === 12) ? (isEn ? "Radio INOP" : "Radio INOP")
        : (isEn ? "Nominal Takeoff" : "Despegue Nominal");
    }

    if (isMishap && hasSchoolSkill('maintenance') && !aircraftState.flawlessUsed) {
      if (flBtn) flBtn.style.display = 'inline-block';
    } else {
      if (flBtn) flBtn.style.display = 'none';
    }

    syncAircraftStateToSubBoard();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    if (typeof saveState === 'function') saveState();
  }

  function rollAircraftCatapultLaunch() {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();

    if (aircraftState.hangarDamaged) {
      const msg = isEn ? "CANNOT LAUNCH: Submarine hangar is damaged [Rule 7.15]!" : "NO SE PUEDE DESPEGAR: El hangar del submarino está averiado [Regla 7.15].";
      if (typeof showToast === 'function') showToast("⚠️ " + msg);
      const outEl = document.getElementById('air-p1-result-box');
      if (outEl) outEl.innerHTML = `<span class="text-rose-400 font-bold">⚠️ ${msg}</span>`;
      return;
    }
    if (s.pilot === 'sw' || s.pilot === 'kia') {
      const msg = isEn ? "CANNOT LAUNCH: Pilot is seriously wounded or KIA [Rule 7.15]!" : "NO SE PUEDE DESPEGAR: El piloto está gravemente herido o muerto [Regla 7.15].";
      if (typeof showToast === 'function') showToast("⚠️ " + msg);
      const outEl = document.getElementById('air-p1-result-box');
      if (outEl) outEl.innerHTML = `<span class="text-rose-400 font-bold">⚠️ ${msg}</span>`;
      return;
    }
    if (s.damage >= 2) {
      const msg = isEn ? "CANNOT LAUNCH: Floatplane has 2+ damage points and cannot fly!" : "NO SE PUEDE DESPEGAR: El hidroavión tiene 2 o más puntos de daño acumulados.";
      if (typeof showToast === 'function') showToast("⚠️ " + msg);
      const outEl = document.getElementById('air-p1-result-box');
      if (outEl) outEl.innerHTML = `<span class="text-rose-400 font-bold">⚠️ ${msg}</span>`;
      return;
    }

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const roll = d1 + d2;

    let rollInfo = { roll, d1, d2 };
    if (roll === 2) {
      const m1 = Math.floor(Math.random() * 6) + 1;
      const m2 = Math.floor(Math.random() * 6) + 1;
      rollInfo.mRoll = m1 + m2;
      const wRoll = Math.floor(Math.random() * 6) + 1;
      rollInfo.wRoll = wRoll;
      rollInfo.wType = (wRoll <= 3) ? 'lw' : (wRoll <= 5) ? 'sw' : 'kia';
      rollInfo.crewMember = (Math.random() < 0.5) ? 'pilot' : 'gunner';
    }

    selectP1LaunchOutcome(roll === 2 ? 2 : roll === 3 ? 3 : roll === 12 ? 12 : 'nominal', rollInfo);
  }

  function rerollLaunchWithFlawlessMaint() {
    const isEn = (window.currentLang === 'en');
    aircraftState.flawlessUsed = true;
    const s = getActiveSlotData();
    s.damage = 0;
    s.radioInop = false;
    s.launchStatus = null;
    const flBtn = document.getElementById('air-p1-flawless-btn');
    if (flBtn) flBtn.style.display = 'none';
    
    if (typeof showToast === 'function') {
      showToast(isEn ? "Flawless Maintenance skill used! Rerolling launch..." : "¡Habilidad Flawless Maintenance usada! Repitiendo despegue...");
    }
    rollAircraftCatapultLaunch();
  }

  function selectP2RecoveryOutcome(outcomeKey, rollInfo = null) {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    clearP2RowHighlights();

    const outEl = document.getElementById('air-p2-result-box');
    const claimBtn = document.getElementById('air-claim-reward-btn');

    let msg = "";
    let isSuccess = false;
    const prefix = rollInfo 
      ? (isEn ? `[1d6 Roll: ${rollInfo.die}${rollInfo.drmsStr} = ${rollInfo.finalRoll}] ` : `[Tirada 1d6: ${rollInfo.die}${rollInfo.drmsStr} = ${rollInfo.finalRoll}] `)
      : (isEn ? `[Manual Selection] ` : `[Selección Manual] `);

    if (outcomeKey === 'recovered' || outcomeKey >= 3) {
      isSuccess = true;
      s.launchStatus = 'recovered';
      s.missionDone = true;

      const targetRow = document.getElementById('air-p2-row-rec') || document.getElementById('air-p2-row-recovered');
      if (targetRow) targetRow.classList.add('air-row-highlight');

      if (aircraftState.craneDamaged) {
        s.damage = 3;
        msg = prefix + (isEn
          ? `<strong>CREW RESCUED, PLANE LOST:</strong> Successful sea touchdown! Because the deck crane is inoperative, the floatplane could not be hoisted aboard and was scuttled, but the crew was safely retrieved [Rule 7.17.4]!`
          : `<strong>DOTACIÓN RESCATADA, AVIÓN ABANDONADO:</strong> ¡Amerizaje exitoso! Dado que la grúa de cubierta está inoperativa, el hidroavión no pudo ser izado a bordo y se barrenó, pero la dotación fue rescatada sana y salva [Regla 7.17.4].`);
      } else {
        msg = prefix + (isEn
          ? `<strong>AIRCRAFT RECOVERED:</strong> Smooth landing on calm swells! Deck crane hoisted the floatplane safely back onto the catapult track for hangar stowage.`
          : `<strong>¡HIDROAVIÓN RECUPERADO CON ÉXITO!</strong> ¡Amerizaje suave! La grúa de popa iza el hidroavión y la tripulación lo desmonta para guardarlo en el hangar estanco.`);
      }

      if (typeof showToast === 'function') {
        showToast(isEn ? "Aircraft Recovered (Chart P2)" : "Hidroavión Recuperado con Éxito (Tabla P2)");
      }
    } else {
      // Lost
      isSuccess = false;
      s.launchStatus = 'lost';
      s.damage = 3;
      s.pilot = 'kia';
      s.gunner = 'kia';

      const targetRow = document.getElementById('air-p2-row-lost');
      if (targetRow) targetRow.classList.add('air-row-highlight');

      msg = prefix + (isEn
        ? `<strong>PLANE AND CREW LOST:</strong> Floatplane overturned during swell landing or ran out of fuel. Search efforts failed; aircraft and aircrew declared MIA/KIA [Rule 7.17.4].`
        : `<strong>HIDROAVIÓN Y DOTACIÓN PERDIDOS:</strong> El aparato capotó por el oleaje o agotó combustible sin hallar al submarino. Declarados perdidos / KIA [Regla 7.17.4].`);

      if (typeof showToast === 'function') {
        showToast(isEn ? "Floatplane and Aircrew Lost (Chart P2)" : "Hidroavión y Dotación Perdidos (Tabla P2)");
      }
    }

    if (outEl) {
      outEl.innerHTML = `
        <div style="font-size:0.86rem; line-height:1.4;" class="${isSuccess ? 'text-emerald-400' : 'text-rose-400'}">
          ${msg}
          ${(rollInfo && rollInfo.drmNotes && rollInfo.drmNotes.length) ? `<div style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">DRMs: ${rollInfo.drmNotes.join(', ')}</div>` : ''}
        </div>
      `;
    }

    // Actualizar badge de dados P2
    if (rollInfo) {
      s.p2DiceVal = `${rollInfo.die}${rollInfo.drmsStr} = ${rollInfo.finalRoll}`;
      s.p2DiceSummary = isSuccess ? (isEn ? "Recovered" : "Recuperado") : (isEn ? "Lost (KIA)" : "Perdido (KIA)");
    } else {
      const valStr = (outcomeKey === 'recovered' || outcomeKey >= 3) ? "4" : "1";
      s.p2DiceVal = `${valStr} (Manual)`;
      s.p2DiceSummary = (outcomeKey === 'recovered' || outcomeKey >= 3) ? (isEn ? "Recovered" : "Recuperado") : (isEn ? "Lost (KIA)" : "Perdido (KIA)");
    }

    if (claimBtn) {
      claimBtn.style.display = isSuccess ? 'inline-block' : 'none';
    }

    syncAircraftStateToSubBoard();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    if (typeof saveState === 'function') saveState();
  }

  function rollAircraftRecovery() {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();

    // If plane not yet airborne, mark as airborne for tabletop convenience
    if (s.launchStatus !== 'airborne') {
      s.launchStatus = 'airborne';
    }

    const d1 = Math.floor(Math.random() * 6) + 1;
    let drms = 0;
    let drmNotes = [];

    if (s.radioInop) {
      drms -= 1;
      drmNotes.push(isEn ? "-1 Plane Radio INOP" : "-1 Radio Avión Inop");
    }
    const subRadioDamaged = (window.campaignState && window.campaignState.workflow && window.campaignState.workflow.subRadioDamaged);
    if (subRadioDamaged) {
      drms -= 1;
      drmNotes.push(isEn ? "-1 Sub Radio INOP" : "-1 Radio Submarino Inop");
    }
    if (window.campaignState && window.campaignState.school && window.campaignState.school.f2CommsEarned) {
      drms += 1;
      drmNotes.push(isEn ? "+1 Superior Comms" : "+1 Comunicaciones Superiores");
    }
    if (hasSchoolSkill('nav')) {
      drms += 1;
      drmNotes.push(isEn ? "+1 Aerial Navigation" : "+1 Navegación Aérea");
    }

    const finalRoll = Math.max(1, d1 + drms);
    const drmsStr = drms !== 0 ? ` [DRM ${drms >= 0 ? '+' : ''}${drms}]` : '';

    selectP2RecoveryOutcome(finalRoll >= 3 ? 'recovered' : 'lost', {
      die: d1,
      drms,
      drmsStr,
      finalRoll,
      drmNotes
    });
  }

  function claimAirSpecialMissionReward() {
    const isEn = (window.currentLang === 'en');
    if (window.campaignState && window.campaignState.workflow && !window.campaignState.workflow.specialMissionCompleted) {
      window.campaignState.workflow.specialMissionCompleted = true;
      if (typeof recordPatrolInRoguBukku === 'function') {
        const area = (window.campaignState.workflow && window.campaignState.workflow.assignedArea) || 'Patrol Area';
        recordPatrolInRoguBukku(2, isEn ? `Aerial Special Mission Success (${area})` : `Éxito Misión Especial Aérea (${area})`);
      }
    }

    const claimBtn = document.getElementById('air-claim-reward-btn');
    if (claimBtn) {
      claimBtn.innerText = isEn ? "✅ SPECIAL MISSION REGISTERED (+2 PATROLS)" : "✅ MISIÓN ESPECIAL REGISTRADA (+2 PATRULLAS)";
      claimBtn.disabled = true;
      claimBtn.style.opacity = '0.7';
    }

    if (typeof showToast === 'function') {
      showToast(isEn ? "⭐ Special Mission Completed! Awarded credit for 2 successful patrols [Rule 7.13]." : "⭐ ¡Misión Especial Completada! Se otorgan 2 patrullas exitosas para ascensos y condecoraciones [Regla 7.13].");
    }
  }

  // =========================================================================
  // RENDERIZADO GENERAL Y TRADUCCIONES BILINGÜES 1:1
  // =========================================================================
  function renderAircraftMatUI() {
    const isEn = (window.currentLang === 'en');
    const curIdx = aircraftState.activeSlot;
    const info = AIRCRAFT_INFO_DATABASE[curIdx] || AIRCRAFT_INFO_DATABASE[0];
    const s = getActiveSlotData();
    const subKey = (window.campaignState && window.campaignState.activeSubKey) || 'Junsen_J_IM_Class';

    // 1. Selector de pestañas / pills de aeronaves
    const pillsContainer = document.getElementById('air-slots-pills');
    if (pillsContainer) {
      pillsContainer.innerHTML = '';
      let availableSlots = [0]; // Glen por defecto
      if (subKey === 'Sen_Toku_Class') {
        availableSlots = [2, 3, 4]; // 3 Seiran
      } else if (subKey === 'Type_A_Modified') {
        availableSlots = [0, 5]; // 2 Glen
      } else if (subKey === 'Type_A2_Class' || subKey === 'Type_AM_Class') {
        availableSlots = [2, 3]; // 2 Seiran
      } else if (subKey === 'Junsen_J2_Class') {
        availableSlots = [1]; // Slim
      }

      availableSlots.forEach((slotNum, idx) => {
        const aInfo = AIRCRAFT_INFO_DATABASE[slotNum] || AIRCRAFT_INFO_DATABASE[0];
        const btn = document.createElement('button');
        btn.type = 'button';
        const isCurrent = (aircraftState.activeSlot === slotNum);
        btn.style.cssText = `padding:4px 12px; font-size:0.75rem; font-weight:bold; border-radius:4px; border:1.5px solid ${isCurrent ? '#38bdf8' : '#334155'}; background:${isCurrent ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#1e293b'}; color:${isCurrent ? '#fff' : '#94a3b8'}; cursor:pointer; box-shadow:${isCurrent ? '0 0 10px rgba(56,189,248,0.5)' : 'none'}; transition:all 0.2s ease;`;
        let label = '';
        if (availableSlots.length > 1) {
          const typeTag = aInfo.key.startsWith('glen') ? 'GLEN' : (aInfo.key.startsWith('seiran') ? 'SEIRAN' : aInfo.key.toUpperCase());
          label = `#${idx + 1}: ${typeTag}`;
        } else {
          label = aInfo.name_en.split(' ')[0] + ' ' + (aInfo.name_en.split(' ')[1] || '');
        }
        btn.innerText = label;
        btn.onclick = () => selectAircraftSlot(slotNum);
        pillsContainer.appendChild(btn);
      });
    }

    // 2. Submarino nodriza activo badge
    const subTitleEl = document.getElementById('air-mat-active-sub');
    if (subTitleEl) subTitleEl.innerText = `${subKey.replace(/_/g, ' ')}`;

    // 3. Encabezados de aeronave
    const jpJpn = document.getElementById('air-inspector-jp');
    if (jpJpn) jpJpn.innerText = info.jp_title;
    const titleEl = document.getElementById('air-inspector-title');
    if (titleEl) titleEl.innerText = isEn ? info.name_en : info.name_es;
    const roleEl = document.getElementById('air-inspector-role');
    if (roleEl) roleEl.innerText = isEn ? info.role_en : info.role_es;

    const resolve = (p) => (typeof resolveAsset === 'function' ? resolveAsset(p) : p);

    // 4. Ilustración Técnica de la aeronave
    const artImg = document.getElementById('air-ai-art-image');
    if (artImg) {
      artImg.src = resolve(info.img);
      artImg.alt = info.name_en;
    }

    // 5. Badge de estado general
    const badgeEl = document.getElementById('air-inspector-status-badge');
    if (badgeEl) {
      const dmgStr = (s.damage === 0) ? (isEn ? 'INSPECTED: OK' : 'ESTADO: INTACTO')
        : (s.damage === 1) ? (isEn ? 'DAMAGE 1 (LIGHT)' : 'DAÑO 1 LEVE')
        : (s.damage === 2) ? (isEn ? 'DAMAGE 2 (HEAVY - ABORT)' : 'DAÑO 2 GRAVE (ABORTAR)')
        : (isEn ? 'DESTROYED (KIA)' : 'DESTRUIDO (KIA)');
      const bombStr = s.bombs ? (isEn ? 'BOMBS ARMED' : 'BOMBAS CARGADAS') : (isEn ? 'NO BOMBS (RECON)' : 'SIN BOMBAS (RECON)');
      badgeEl.innerText = `${dmgStr} • ${bombStr}`;
      badgeEl.style.color = (s.damage === 0) ? '#4ade80' : (s.damage === 1) ? '#fde047' : '#ef4444';
      badgeEl.style.borderColor = (s.damage === 0) ? '#10b981' : (s.damage === 1) ? '#eab308' : '#ef4444';
      badgeEl.style.background = (s.damage === 0) ? 'rgba(16,185,129,0.15)' : (s.damage === 1) ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.2)';
    }

    // 6. Slots de contadores tácticos con Chits auténticos de Vassal:
    // Hangar
    const hangarBox = document.getElementById('slot-air-hangar-box');
    const hangarStat = document.getElementById('slot-air-hangar-status');
    if (hangarBox) {
      hangarBox.innerHTML = aircraftState.hangarDamaged
        ? `<img src="${resolve('assets/chits/Inop - Aircraft.jpg')}" class="air-chit-token" title="${isEn ? 'Hangar Damaged [Rule 7.15]' : 'Hangar Dañado [Regla 7.15]'}" />`
        : `<span style="font-size:0.72rem; font-weight:800; letter-spacing:0.5px; color:#4ade80; border:1px solid rgba(74,222,128,0.3); padding:2px 6px; border-radius:3px; background:rgba(74,222,128,0.1);">[${isEn ? 'OPERATIVE' : 'OPERATIVO'}]</span>`;
    }
    if (hangarStat) {
      hangarStat.innerText = aircraftState.hangarDamaged ? (isEn ? "Damaged (Inop)" : "Averiado (Inop)") : (isEn ? "Operative" : "Operativo");
      hangarStat.style.color = aircraftState.hangarDamaged ? "#ef4444" : "#4ade80";
    }

    // Grúa
    const craneBox = document.getElementById('slot-air-crane-box');
    const craneStat = document.getElementById('slot-air-crane-status');
    if (craneBox) {
      craneBox.innerHTML = aircraftState.craneDamaged
        ? `<img src="${resolve('assets/chits/Inop - Aircraft.jpg')}" class="air-chit-token" title="${isEn ? 'Crane Damaged [Rule 7.17.4]' : 'Grúa Averiada [Regla 7.17.4]'}" />`
        : `<span style="font-size:0.72rem; font-weight:800; letter-spacing:0.5px; color:#4ade80; border:1px solid rgba(74,222,128,0.3); padding:2px 6px; border-radius:3px; background:rgba(74,222,128,0.1);">[${isEn ? 'OPERATIVE' : 'OPERATIVA'}]</span>`;
    }
    if (craneStat) {
      craneStat.innerText = aircraftState.craneDamaged ? (isEn ? "Damaged (Inop)" : "Averiada (Inop)") : (isEn ? "Operative" : "Operativa");
      craneStat.style.color = aircraftState.craneDamaged ? "#ef4444" : "#4ade80";
    }

    // Bombas
    const bombsBox = document.getElementById('slot-air-bombs-box');
    const bombsStat = document.getElementById('slot-air-bombs-status');
    if (bombsBox) {
      bombsBox.innerHTML = s.bombs
        ? `<img src="${resolve('assets/chits/Bombs.jpg')}" class="air-chit-token" title="${isEn ? 'Bombs Armed' : 'Bombas Armadas'}" />`
        : `<span style="font-size:0.75rem; color:#64748b; font-weight:bold; letter-spacing:0.5px;">[--]</span>`;
    }
    if (bombsStat) {
      bombsStat.innerText = s.bombs ? (isEn ? "Bombs Armed" : "Bombas Armadas") : (isEn ? "No Bombs (Recon)" : "Sin Bombas");
      bombsStat.style.color = s.bombs ? "var(--gold-400)" : "#94a3b8";
    }

    // Registro de Daños (3 casillas con chits Damage - Aircraft.jpg)
    const dmg1Box = document.getElementById('air-dmg-chit-1');
    const dmg2Box = document.getElementById('air-dmg-chit-2');
    const dmg3Box = document.getElementById('air-dmg-chit-3');
    if (dmg1Box) dmg1Box.innerHTML = (s.damage >= 1) ? `<img src="${resolve('assets/chits/Damage - Aircraft.jpg')}" class="air-chit-token" title="${isEn ? 'Damage 1' : 'Daño 1'}" />` : '';
    if (dmg2Box) dmg2Box.innerHTML = (s.damage >= 2) ? `<img src="${resolve('assets/chits/Damage - Aircraft.jpg')}" class="air-chit-token" title="${isEn ? 'Damage 2 (Abort)' : 'Daño 2 (Abortar)'}" />` : '';
    if (dmg3Box) dmg3Box.innerHTML = (s.damage >= 3) ? `<img src="${resolve('assets/chits/Damage - Aircraft.jpg')}" class="air-chit-token" title="${isEn ? 'Destroyed (KIA)' : 'Destruido (KIA)'}" />` : '';

    // Dotación (Piloto y Artillero con chits de dotación Vassal)
    const pilotBox = document.getElementById('slot-air-pilot-box');
    const pilotStat = document.getElementById('slot-air-pilot-status');
    if (pilotBox) {
      if (s.pilot === 'lw') pilotBox.innerHTML = `<img src="${resolve('assets/chits/Light Wounds.jpg')}" class="air-chit-token" title="${isEn ? 'Light Wound' : 'Herida Leve'}" />`;
      else if (s.pilot === 'sw') pilotBox.innerHTML = `<img src="${resolve('assets/chits/Serious Wounds.jpg')}" class="air-chit-token" title="${isEn ? 'Serious Wound' : 'Herida Grave'}" />`;
      else if (s.pilot === 'kia') pilotBox.innerHTML = `<img src="${resolve('assets/chits/KIA.jpg')}" class="air-chit-token" title="${isEn ? 'K.I.A.' : 'Baja Mortal (KIA)'}" />`;
      else pilotBox.innerHTML = `<img src="${resolve('assets/chits/Crew Veteran.jpg')}" class="air-chit-token" title="${isEn ? 'Pilot Healthy (Veteran Aviator)' : 'Piloto Sano (Veterano Aviador)'}" />`;
    }
    if (pilotStat) {
      pilotStat.innerText = (s.pilot === 'ok') ? (isEn ? 'Healthy (OK)' : 'Sano (OK)')
        : (s.pilot === 'lw') ? (isEn ? 'Light Wound (LW)' : 'Herida Leve (LW)')
        : (s.pilot === 'sw') ? (isEn ? 'Serious Wound (SW)' : 'Herida Grave (SW)')
        : (isEn ? 'K.I.A. (Lost)' : 'KIA (Baja Mortal)');
      pilotStat.style.color = (s.pilot === 'ok') ? '#4ade80' : (s.pilot === 'lw') ? '#fde047' : '#ef4444';
    }

    const gunnerBox = document.getElementById('slot-air-gunner-box');
    const gunnerStat = document.getElementById('slot-air-gunner-status');
    if (gunnerBox) {
      if (s.gunner === 'lw') gunnerBox.innerHTML = `<img src="${resolve('assets/chits/Light Wounds.jpg')}" class="air-chit-token" title="${isEn ? 'Light Wound' : 'Herida Leve'}" />`;
      else if (s.gunner === 'sw') gunnerBox.innerHTML = `<img src="${resolve('assets/chits/Serious Wounds.jpg')}" class="air-chit-token" title="${isEn ? 'Serious Wound' : 'Herida Grave'}" />`;
      else if (s.gunner === 'kia') gunnerBox.innerHTML = `<img src="${resolve('assets/chits/KIA.jpg')}" class="air-chit-token" title="${isEn ? 'K.I.A.' : 'Baja Mortal (KIA)'}" />`;
      else gunnerBox.innerHTML = `<img src="${resolve('assets/chits/Crew Trained.jpg')}" class="air-chit-token" title="${isEn ? 'Gunner Healthy (Trained Aircrew)' : 'Artillero Sano (Instruido Dotación)'}" />`;
    }
    if (gunnerStat) {
      gunnerStat.innerText = (s.gunner === 'ok') ? (isEn ? 'Healthy (OK)' : 'Sano (OK)')
        : (s.gunner === 'lw') ? (isEn ? 'Light Wound (LW)' : 'Herida Leve (LW)')
        : (s.gunner === 'sw') ? (isEn ? 'Serious Wound (SW)' : 'Herida Grave (SW)')
        : (isEn ? 'K.I.A. (Lost)' : 'KIA (Baja Mortal)');
      gunnerStat.style.color = (s.gunner === 'ok') ? '#4ade80' : (s.gunner === 'lw') ? '#fde047' : '#ef4444';
    }

    // Habilidades F3
    syncSchoolSkillsToAircraftState();
    const pilotIdx = getPilotIndexForSlot(aircraftState.activeSlot, subKey);
    const airSkillsTitle = document.getElementById('air-skills-title');
    const airSkillsSub = document.getElementById('air-skills-sub');
    if (airSkillsTitle) {
      airSkillsTitle.innerText = isEn ? `PILOT #${pilotIdx + 1} SKILLS [F3]` : `HABILIDADES PILOTO #${pilotIdx + 1} [ESCUELA F3]`;
    }
    if (airSkillsSub) {
      airSkillsSub.innerText = isEn ? `Active for this aircraft` : `Activas para esta aeronave`;
    }

    const skTokens = {
      weapons: { id: 'air-skill-token-weapons', wrap: 'air-skill-weapons', img: resolve('assets/tokens/Weapons Expert.jpg') },
      maintenance: { id: 'air-skill-token-maintenance', wrap: 'air-skill-maintenance', img: resolve('assets/tokens/Aircraft Maint.jpg') },
      acm: { id: 'air-skill-token-acm', wrap: 'air-skill-acm', img: resolve('assets/tokens/ACM.jpg') },
      nav: { id: 'air-skill-token-nav', wrap: 'air-skill-nav', img: resolve('assets/tokens/Aerial Navigation.jpg') }
    };
    Object.entries(skTokens).forEach(([k, item]) => {
      const el = document.getElementById(item.id);
      const wrap = document.getElementById(item.wrap);
      const active = hasSchoolSkill(k);
      if (el) el.innerHTML = `<img src="${item.img}" class="air-chit-token" style="${active ? 'filter:drop-shadow(0 0 5px rgba(234,179,8,0.8));' : 'opacity:0.35;'}" />`;
      if (wrap) {
        wrap.style.borderColor = active ? 'var(--gold-400)' : '#334155';
        wrap.style.background = active ? 'rgba(234,179,8,0.15)' : 'rgba(15,23,42,0.8)';
      }
    });

    // 7. Especificaciones técnicas
    const specsEl = document.getElementById('air-inspector-specs');
    if (specsEl) {
      specsEl.innerHTML = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.74rem;">
          <div><strong style="color:var(--gold-400);">${isEn ? 'Engine:' : 'Motor:'}</strong> <span style="color:#cbd5e1;">${info.specs.motor}</span></div>
          <div><strong style="color:var(--gold-400);">${isEn ? 'Max Speed:' : 'Velocidad:'}</strong> <span style="color:#cbd5e1;">${info.specs.speed}</span></div>
          <div><strong style="color:var(--gold-400);">${isEn ? 'Range:' : 'Alcance:'}</strong> <span style="color:#cbd5e1;">${info.specs.range}</span></div>
          <div><strong style="color:var(--gold-400);">${isEn ? 'Def. Armament:' : 'Defensa:'}</strong> <span style="color:#cbd5e1;">${info.specs.armament}</span></div>
          <div style="grid-column: span 2;"><strong style="color:var(--gold-400);">${isEn ? 'Payload:' : 'Armamento:'}</strong> <span style="color:#cbd5e1;">${info.specs.bombs}</span></div>
        </div>
        <div style="font-size:0.72rem; color:#94a3b8; margin-top:6px; line-height:1.35; border-top:1px solid #1e293b; padding-top:4px;">
          <em>📜 ${isEn ? info.note_en : info.note_es}</em>
        </div>
      `;
    }

    // Persistencia visual de la fila seleccionada en Tablas P1 y P2
    clearP1RowHighlights();
    clearP2RowHighlights();
    if (s.launchStatus === 'recovered') {
      const rowRec = document.getElementById('air-p2-row-rec') || document.getElementById('air-p2-row-recovered');
      if (rowRec) rowRec.classList.add('air-row-highlight');
    } else if (s.launchStatus === 'lost') {
      const rowLost = document.getElementById('air-p2-row-lost');
      if (rowLost) rowLost.classList.add('air-row-highlight');
    }

    if (s.launchStatus === 'airborne') {
      const p1Nom = s.radioInop
        ? document.getElementById('air-p1-row-12')
        : (document.getElementById('air-p1-row-norm') || document.getElementById('air-p1-row-nominal'));
      if (p1Nom) p1Nom.classList.add('air-row-highlight');
    } else if (s.launchStatus === 'assembly') {
      const p1Ass = document.getElementById('air-p1-row-3');
      if (p1Ass) p1Ass.classList.add('air-row-highlight');
    } else if (s.launchStatus === 'crashed') {
      const p1Cr = document.getElementById('air-p1-row-2');
      if (p1Cr) p1Cr.classList.add('air-row-highlight');
    }

    // Badges permanentes de dados P1 y P2
    const p1ValEl = document.getElementById('air-p1-dice-val');
    const p1SumEl = document.getElementById('air-p1-dice-summary');
    if (p1ValEl) p1ValEl.innerText = s.p1DiceVal || '--';
    if (p1SumEl) p1SumEl.innerText = s.p1DiceSummary || (isEn ? 'No Roll' : 'Sin Tirada');

    const p2ValEl = document.getElementById('air-p2-dice-val');
    const p2SumEl = document.getElementById('air-p2-dice-summary');
    if (p2ValEl) p2ValEl.innerText = s.p2DiceVal || '--';
    if (p2SumEl) p2SumEl.innerText = s.p2DiceSummary || (isEn ? 'No Roll' : 'Sin Tirada');

    // 8. Textos y encabezados bilingües de las Tablas OCR
    const hTitle = document.getElementById('air-mat-header-title');
    if (hTitle) hTitle.innerText = isEn ? "CHART P: AIRCRAFT DISPLAY MAT" : "TABLA P: AIRCRAFT DISPLAY MAT";
    const hSub = document.getElementById('air-mat-header-sub');
    if (hSub) hSub.innerText = isEn 
      ? "Tactical floatplane management • Launch (P1), Flight (P3-P5), Bombing (P6) and Recovery (P2)"
      : "Gestión táctica de hidroaviones de reconocimiento y ataque • Despegue (P1), Vuelo (P3-P5), Bombardeo (P6) y Amerizaje (P2)";

    // Table P1 headers and labels
    const p1Title = document.getElementById('air-p1-title');
    if (p1Title) p1Title.innerText = isEn ? "CHART P1: CATAPULT LAUNCH & MISHAPS" : "CHART P1: DESPEGUE DE CATAPULTA Y PERCANCES";
    const p1Desc = document.getElementById('air-p1-desc');
    if (p1Desc) p1Desc.innerText = isEn ? "Roll 2d6 • Click row to set manual outcome" : "Tirada con 2d6 • Clic en fila para fijar valor manualmente";
    const thP1Dice = document.getElementById('th-p1-dice');
    if (thP1Dice) thP1Dice.innerText = "2d6";
    const thP1Res = document.getElementById('th-p1-res');
    if (thP1Res) thP1Res.innerText = isEn ? "Result" : "Resultado";
    const thP1Eff = document.getElementById('th-p1-eff');
    if (thP1Eff) thP1Eff.innerText = isEn ? "Official Rule Effect" : "Efecto Reglamentario Oficial";
    const p1RollBtn = document.getElementById('air-p1-roll-btn');
    if (p1RollBtn) p1RollBtn.innerText = isEn ? "🎲 Launch (2d6)" : "🎲 Despegar (2d6)";

    const p1Res2 = document.getElementById('p1-res-2');
    if (p1Res2) p1Res2.innerHTML = isEn ? "Engine Seizure<br><small style='color:#94a3b8;'>(Engine Misses)</small>" : "Fallo Crítico de Motor<br><small style='color:#94a3b8;'>(Engine Misses)</small>";
    const p1Desc2 = document.getElementById('p1-desc-2');
    if (p1Desc2) p1Desc2.innerText = isEn ? "Roll 2d6: on 10+ engine seizes, plane crashes (Destroyed). Roll wound (1d6: 1-3 LW, 4-5 SW, 6 KIA). If <10: engine sputters but launches." : "Tira 2d6: con 10+ el motor se gripa y el avión se estrella en el mar (Destruido). Tira herida de dotación (1d6: 1-3 LW, 4-5 SW, 6 KIA). Si <10: el motor ratea pero despega.";

    const p1Res3 = document.getElementById('p1-res-3');
    if (p1Res3) p1Res3.innerHTML = isEn ? "Assembly Problem<br><small style='color:#94a3b8;'>(Assembly Problem)</small>" : "Problema de Montaje<br><small style='color:#94a3b8;'>(Assembly Problem)</small>";
    const p1Desc3 = document.getElementById('p1-desc-3');
    if (p1Desc3) p1Desc3.innerText = isEn ? "Wings misaligned during topside assembly. Abort mission OR roll an additional naval combat round before attempting launch again [Rule 7.17.2]." : "Desajuste al ensamblar alas en cubierta. Abortar misión O tirar 1 ronda adicional de combate marítimo antes de reintentar despegue [Regla 7.17.2].";

    const p1ResNom = document.getElementById('p1-res-nom');
    if (p1ResNom) p1ResNom.innerHTML = isEn ? "Nominal Takeoff<br><small style='color:#94a3b8;'>(Clean Launch)</small>" : "Despegue Nominal<br><small style='color:#94a3b8;'>(Clean Takeoff)</small>";
    const p1DescNom = document.getElementById('p1-desc-nom');
    if (p1DescNom) p1DescNom.innerText = isEn ? "Catapult acceleration nominal! Floatplane climbs smoothly towards cruising altitude without incident." : "Aceleración de catapulta impecable. El hidroavión despega e inicia su vuelo de crucero sin contratiempos.";

    const p1Res12 = document.getElementById('p1-res-12');
    if (p1Res12) p1Res12.innerHTML = isEn ? "Radio INOP<br><small style='color:#94a3b8;'>(Radio INOP)</small>" : "Radio Inoperativa<br><small style='color:#94a3b8;'>(Radio INOP)</small>";
    const p1Desc12 = document.getElementById('p1-desc-12');
    if (p1Desc12) p1Desc12.innerHTML = isEn ? "Antenna connection severed. Airborne successfully, but suffers <strong>-1 DRM to Recovery Roll [P2]</strong>." : "Fallo eléctrico o rotura de antena. Despega con éxito, pero sufre <strong>-1 DRM a la tirada de Recuperación [Tabla P2]</strong>.";

    // Table P2 headers and labels
    const p2Title = document.getElementById('air-p2-title');
    if (p2Title) p2Title.innerText = isEn ? "CHART P2: AIRCRAFT RECOVERY & CRANE" : "CHART P2: AMERIZAJE Y RECUPERACIÓN CON GRÚA";
    const p2Desc = document.getElementById('air-p2-desc');
    if (p2Desc) p2Desc.innerText = isEn ? "Roll 1d6 (Apply DRMs) • Click row to set manual outcome" : "Tirada 1d6 (Aplica DRMs) • Clic en fila para fijar valor manualmente";
    const thP2Dice = document.getElementById('th-p2-dice');
    if (thP2Dice) thP2Dice.innerText = isEn ? "1d6 mod." : "1d6 mod.";
    const thP2Res = document.getElementById('th-p2-res');
    if (thP2Res) thP2Res.innerText = isEn ? "Result" : "Resultado";
    const thP2Eff = document.getElementById('th-p2-eff');
    if (thP2Eff) thP2Eff.innerText = isEn ? "Official Consequence [Rule 7.17.4]" : "Consecuencia Oficial [Regla 7.17.4]";
    const p2RollBtn = document.getElementById('air-p2-roll-btn');
    if (p2RollBtn) p2RollBtn.innerText = isEn ? "⚓ Touchdown (1d6)" : "⚓ Amerizar (1d6)";

    const p2ResLost = document.getElementById('p2-res-lost');
    if (p2ResLost) p2ResLost.innerHTML = isEn ? "Plane & Crew Lost<br><small style='color:#94a3b8;'>(Plane & Crew Lost)</small>" : "Avión y Dotación Perdidos<br><small style='color:#94a3b8;'>(Plane & Crew Lost)</small>";
    const p2DescLost = document.getElementById('p2-desc-lost');
    if (p2DescLost) p2DescLost.innerText = isEn ? "Floatplane overturned during swell landing or ran out of fuel searching for sub. Declared MIA/KIA [Rule 7.17.4]." : "El hidroavión capota por fuerte oleaje o agota el combustible sin hallar al buque nodriza. Declarados MIA/KIA.";

    const p2ResRec = document.getElementById('p2-res-rec');
    if (p2ResRec) p2ResRec.innerHTML = isEn ? "Aircraft Recovered<br><small style='color:#94a3b8;'>(Aircraft Recovered)</small>" : "Recuperado con Éxito<br><small style='color:#94a3b8;'>(Aircraft Recovered)</small>";
    const p2DescRec = document.getElementById('p2-desc-rec');
    if (p2DescRec) p2DescRec.innerText = isEn ? "Smooth landing on swells. Deck crane hoists aircraft safely aboard for hangar stowage.*" : "Amerizaje suave junto a la aleta del submarino. La grúa de cubierta iza el aparato y se desmonta para estiba.*";

    const p2NoteCrane = document.getElementById('p2-note-crane');
    if (p2NoteCrane) p2NoteCrane.innerText = isEn ? "* If Deck Crane is damaged [Inop]: Crew is retrieved safely from water, but aircraft must be scuttled." : "* Si la Grúa de cubierta está averiada [Inop]: la dotación es rescatada pero el hidroavión debe ser barrenado/hundido.";
    const p2NoteDrms = document.getElementById('p2-note-drms');
    if (p2NoteDrms) p2NoteDrms.innerHTML = isEn ? "DRMs: <strong>-1</strong> Plane Radio INOP • <strong>-1</strong> Sub Radio INOP • <strong>+1</strong> Superior Comms (F2)" : "DRMs: <strong>-1</strong> Radio Avión INOP • <strong>-1</strong> Radio Submarino INOP • <strong>+1</strong> Comunicaciones Superiores (F2)";

    // Section 3 Flight phase
    const fpTitle = document.getElementById('air-flight-phase-title');
    if (fpTitle) fpTitle.innerText = isEn ? "FLIGHT PHASE & AERIAL COMBAT (CHARTS P3 - P6)" : "FASE DE VUELO Y COMBATE AÉREO (TABLAS P3 A P6)";
    const fpSub = document.getElementById('air-flight-phase-sub');
    if (fpSub) fpSub.innerText = isEn ? "Navigate target approach rings for assigned patrol mission" : "Navega por los círculos de aproximación del objetivo asignado";

    // Buttons P3 - P6
    const btnP3 = document.getElementById('lbl-air-btn-p3');
    if (btnP3) btnP3.innerText = isEn ? "Chart P3:" : "Tabla P3:";
    const subP3 = document.getElementById('lbl-air-p3-sub');
    if (subP3) subP3.innerText = isEn ? "Encounters" : "Encuentros";

    const btnP4 = document.getElementById('lbl-air-btn-p4');
    if (btnP4) btnP4.innerText = isEn ? "Chart P4:" : "Tabla P4:";
    const subP4 = document.getElementById('lbl-air-p4-sub');
    if (subP4) subP4.innerText = isEn ? "Enemy Fighters" : "Cazas Enemigos";

    const btnP5 = document.getElementById('lbl-air-btn-p5');
    if (btnP5) btnP5.innerText = isEn ? "Chart P5:" : "Tabla P5:";
    const subP5 = document.getElementById('lbl-air-p5-sub');
    if (subP5) subP5.innerText = isEn ? "AA Flak Fire" : "Fuego Antiaéreo";

    const btnP6 = document.getElementById('lbl-air-btn-p6');
    if (btnP6) btnP6.innerText = isEn ? "Chart P6:" : "Tabla P6:";
    const subP6 = document.getElementById('lbl-air-p6-sub');
    if (subP6) subP6.innerText = isEn ? "Bombing" : "Bombardeo";

    // Slot labels (clean wargame text without emojis)
    const lblHangar = document.getElementById('lbl-air-slot-hangar');
    if (lblHangar) lblHangar.innerText = isEn ? "Deck Hangar" : "Hangar de Cubierta";
    const lblCrane = document.getElementById('lbl-air-slot-crane');
    if (lblCrane) lblCrane.innerText = isEn ? "Aft Crane" : "Grúa de Popa";
    const lblBombs = document.getElementById('lbl-air-slot-bombs');
    if (lblBombs) lblBombs.innerText = isEn ? "Bomb Payload" : "Carga de Bombas";

    const lblDmgTrack = document.getElementById('air-dmg-track-title');
    if (lblDmgTrack) lblDmgTrack.innerText = isEn ? "DAMAGE TRACK [RULE 7.17]" : "REGISTRO DE DAÑOS [REGLA 7.17]";
    const lblDmgHint = document.getElementById('air-dmg-track-hint');
    if (lblDmgHint) lblDmgHint.innerText = isEn ? "Click box to set or clear damage" : "Clic en casilla para fijar o quitar daño";
    const lblDmg1 = document.getElementById('lbl-air-dmg-1');
    if (lblDmg1) lblDmg1.innerText = isEn ? "1: Light Damage" : "1: Daño Leve";
    const lblDmg2 = document.getElementById('lbl-air-dmg-2');
    if (lblDmg2) lblDmg2.innerText = isEn ? "2: Heavy (Abort)" : "2: Daño Grave (Abortar)";
    const lblDmg3 = document.getElementById('lbl-air-dmg-3');
    if (lblDmg3) lblDmg3.innerText = isEn ? "3: Destroyed (KIA)" : "3: Destruido (KIA)";

    const lblPilot = document.getElementById('lbl-air-crew-pilot');
    if (lblPilot) lblPilot.innerText = isEn ? "Aircrew Pilot" : "Piloto Oficial";
    const lblGunner = document.getElementById('lbl-air-crew-gunner');
    if (lblGunner) lblGunner.innerText = isEn ? "Gunner / Obs." : "Artillero / Obs.";
    const lblPilotHint = document.getElementById('lbl-air-crew-pilot-hint');
    if (lblPilotHint) lblPilotHint.innerText = isEn ? "Click to cycle health" : "Clic para alternar estado";
    const lblGunnerHint = document.getElementById('lbl-air-crew-gunner-hint');
    if (lblGunnerHint) lblGunnerHint.innerText = isEn ? "Click to cycle health" : "Clic para alternar estado";

    const lblSkillsTitle = document.getElementById('air-skills-title');
    if (lblSkillsTitle) lblSkillsTitle.innerText = isEn ? `PILOT #${pilotIdx + 1} SKILLS [F3]` : `HABILIDADES PILOTO #${pilotIdx + 1} [ESCUELA F3]`;
    const lblSkillsSub = document.getElementById('air-skills-sub');
    if (lblSkillsSub) lblSkillsSub.innerText = isEn ? "Active for this aircraft" : "Activas para esta aeronave";

    // Header & Footer additional elements
    const hBadge = document.getElementById('air-mat-header-badge');
    if (hBadge) hBadge.innerText = isEn ? "OFFICIAL RULE 7.17 • EMBARKED FLOATPLANE" : "REGLA OFICIAL 7.17 • MÓDULO AERONAVAL";
    const lblTabTakeoff = document.getElementById('lbl-tab-takeoff');
    if (lblTabTakeoff) lblTabTakeoff.innerText = isEn ? "1. Takeoff (P1)" : "1. Despegue (P1)";
    const lblTabMap = document.getElementById('lbl-tab-map');
    if (lblTabMap) lblTabMap.innerText = isEn ? "2. Tactical Flight Map (P3-P6)" : "2. Mapa Táctico de Vuelo (P3-P6)";
    const lblTabRecovery = document.getElementById('lbl-tab-recovery');
    if (lblTabRecovery) lblTabRecovery.innerText = isEn ? "3. Recovery (P2)" : "3. Amerizaje (P2)";

    const lblAirPrev = document.getElementById('lbl-air-prev-circle');
    if (lblAirPrev) lblAirPrev.innerText = isEn ? "Previous" : "Anterior";
    const lblAirNext = document.getElementById('lbl-air-next-circle');
    if (lblAirNext) lblAirNext.innerText = isEn ? "Next Circle" : "Avanzar Círculo";
    const lblAirRollEnc = document.getElementById('lbl-air-roll-encounter');
    if (lblAirRollEnc) lblAirRollEnc.innerText = isEn ? "Roll Encounter (2d6)" : "Tirar Encuentro (2d6)";
    const lblAirBomb = document.getElementById('lbl-air-bomb-target');
    if (lblAirBomb) lblAirBomb.innerText = isEn ? "Bomb Target (1d6)" : "Bombardear Objetivo (1d6)";
    const lblAirFinish = document.getElementById('lbl-air-finish-flight');
    if (lblAirFinish) lblAirFinish.innerText = isEn ? "Land (Chart P2) ➔" : "Amerizar (Tabla P2) ➔";

    const lblP3Btn = document.getElementById('lbl-p3-btn');
    if (lblP3Btn) lblP3Btn.innerText = isEn ? "Encounters" : "Encuentros";
    const lblP4Btn = document.getElementById('lbl-p4-btn');
    if (lblP4Btn) lblP4Btn.innerText = isEn ? "Combat" : "Combate";
    const lblP5Btn = document.getElementById('lbl-p5-btn');
    if (lblP5Btn) lblP5Btn.innerText = isEn ? "Flak AA" : "Antiaéreo";
    const lblP6Btn = document.getElementById('lbl-p6-btn');
    if (lblP6Btn) lblP6Btn.innerText = isEn ? "Bombing" : "Bombardeo";

    const btnCloseTop = document.getElementById('air-mat-btn-close-top');
    if (btnCloseTop) btnCloseTop.innerHTML = `<span>${isEn ? "✕ Close (Esc)" : "✕ Cerrar (Esc)"}</span>`;
    const fNote = document.getElementById('air-mat-footer-note');
    if (fNote) fNote.innerText = isEn 
      ? "Official Rules 7.1 (Reconnaissance), 7.7 (Bombing), 7.15 (Launch/Recovery) and 7.17 (Air Module)."
      : "Reglas Oficiales 7.1 (Reconocimiento), 7.7 (Bombardeo), 7.15 (Lanzamiento/Recuperación) y 7.17 (Módulo Aéreo).";

    const p1DefHint = document.getElementById('air-p1-default-hint');
    if (p1DefHint) p1DefHint.innerText = isEn ? "Click \"🎲 Launch (2d6)\" or click a table row above to set outcome manually." : "Haz clic en «🎲 Despegar (2d6)» o selecciona una fila superior para fijar el resultado manualmente.";
    const p2DefHint = document.getElementById('air-p2-default-hint');
    if (p2DefHint) p2DefHint.innerText = isEn ? "Click \"⚓ Touchdown (1d6)\" or click a table row above to set outcome manually." : "Haz clic en «⚓ Amerizar (1d6)» o selecciona una fila superior para fijar el resultado manualmente.";

    // Tactical Map UI & Auto-Selection
    const mapFile = aircraftState.activeMap || autoSelectMapForMission();
    selectAircraftMap(mapFile);
    const lblMapSelect = document.getElementById('lbl-air-map-select');
    if (lblMapSelect) lblMapSelect.innerText = isEn ? "MAP:" : "MAPA:";
    const lblMapExpand = document.getElementById('lbl-air-map-expand');
    if (lblMapExpand) lblMapExpand.innerText = isEn ? "🔍 Enlarge Map" : "🔍 Ampliar Carta";
    const phaseTitle = document.getElementById('air-flight-phase-title');
    if (phaseTitle) phaseTitle.innerText = isEn ? "FLIGHT PHASE & TACTICAL MAP (CHARTS P3 TO P6)" : "FASE DE VUELO Y MAPA TÁCTICO (TABLAS P3 A P6)";
    const phaseSub = document.getElementById('air-flight-phase-sub');
    if (phaseSub) phaseSub.innerText = isEn ? "Navigate along approach circles towards assigned target zone" : "Navega por los círculos de aproximación del objetivo asignado";

    // Guide buttons translations
    const btnGuideTop = document.getElementById('lbl-air-btn-guide');
    if (btnGuideTop) btnGuideTop.innerText = isEn ? "Rule 7.17 Guide" : "Guía Regla 7.17";
    const btnGuideQuick = document.getElementById('lbl-air-quick-guide-btn');
    if (btnGuideQuick) btnGuideQuick.innerText = isEn ? "Manual & Tactical Guide (Rule 7.17)" : "Manual y Guía Táctica (Regla Oficial 7.17)";
    const btnGuideFooter = document.getElementById('lbl-air-footer-guide-btn');
    if (btnGuideFooter) btnGuideFooter.innerText = isEn ? "Operations Guide (Rule 7.17)" : "Guía y Manual Operativo (7.17)";

    const guideTitle = document.getElementById('air-guide-header-title');
    if (guideTitle) guideTitle.innerText = isEn ? "OPERATIONS MANUAL: AIRCRAFT MODULE (RULE 7.17)" : "MANUAL OPERATIVO: MÓDULO DE AERONAVES (REGLA 7.17)";
    const guideSub = document.getElementById('air-guide-header-sub');
    if (guideSub) guideSub.innerText = isEn 
      ? "Step-by-step tactical guide for catapult launch, flight navigation, air combat, and crane recovery"
      : "Guía táctica paso a paso para lanzamiento de catapulta, navegación aérea, combate y amerizaje con grúa";
    const guideCloseBtn = document.getElementById('lbl-air-guide-close-btn');
    if (guideCloseBtn) guideCloseBtn.innerText = isEn ? "Understood / Return to Module" : "Entendido / Volver al Módulo";
    const guideFooter = document.getElementById('air-guide-footer-text');
    if (guideFooter) guideFooter.innerText = isEn 
      ? "Sensuikan: Japanese Fleet Submarines in WWII • Official Rule 7.17 (Aircraft Display Mat)"
      : "Sensuikan: Japanese Fleet Submarines in WWII • Módulo Oficial 7.17 (Aircraft Display Mat)";

    const gTabOverview = document.getElementById('lbl-guide-tab-overview');
    if (gTabOverview) gTabOverview.innerText = isEn ? "1. Overview & Requirements" : "1. Visión General & Requisitos";
    const gTabTakeoff = document.getElementById('lbl-guide-tab-takeoff');
    if (gTabTakeoff) gTabTakeoff.innerText = isEn ? "2. Launch (Catapult P1)" : "2. Despegue (Catapulta P1)";
    const gTabFlight = document.getElementById('lbl-guide-tab-flight');
    if (gTabFlight) gTabFlight.innerText = isEn ? "3. Flight & Charts P3-P6" : "3. Navegación & Tablas P3-P6";
    const gTabRecovery = document.getElementById('lbl-guide-tab-recovery');
    if (gTabRecovery) gTabRecovery.innerText = isEn ? "4. Recovery & Crane (P2)" : "4. Amerizaje & Grúa (P2)";
    const gTabFaq = document.getElementById('lbl-guide-tab-faq');
    if (gTabFaq) gTabFaq.innerText = isEn ? "5. Rewards & FAQ" : "5. Recompensas & FAQ";

    const guideModal = document.getElementById('modal-aircraft-guide');
    if (guideModal && guideModal.style.display !== 'none' && window.getComputedStyle(guideModal).display !== 'none') {
      switchAirGuideTab(activeGuideTab);
    }
  }

  const AIRCRAFT_MAPS = {
    'map_p7_pearl_harbor.jpg': {
      title_es: 'MAP P7 • PEARL HARBOR (RECON / ATAQUE)',
      title_en: 'MAP P7 • PEARL HARBOR (RECON / STRIKE)'
    },
    'map_p8_sydney_harbor.jpg': {
      title_es: 'MAP P8 • SYDNEY HARBOR (RECONOCIMIENTO)',
      title_en: 'MAP P8 • SYDNEY HARBOR (RECONNAISSANCE)'
    },
    'map_p9_diego_suarez.jpg': {
      title_es: 'MAP P9 • DIEGO SUAREZ (RECONOCIMIENTO)',
      title_en: 'MAP P9 • DIEGO SUAREZ (RECONNAISSANCE)'
    },
    'map_p10_oregon.jpg': {
      title_es: 'MAP P10 • OREGON (BOMBARDEO CONTINENTAL)',
      title_en: 'MAP P10 • OREGON (MAINLAND BOMBING)'
    },
    'map_p11_panama_canal.jpg': {
      title_es: 'MAP P11 • PANAMA CANAL (ESCLUSAS DE MIRAFLORES)',
      title_en: 'MAP P11 • PANAMA CANAL (MIRAFLORES LOCKS)'
    },
    'map_p12_aleutians.jpg': {
      title_es: 'MAP P12 • ALEUTIANAS / MALAYA (EXPLORACIÓN NAVAL)',
      title_en: 'MAP P12 • ALEUTIANS / MALAYA (NAVAL RECON)'
    }
  };

  function autoSelectMapForMission() {
    if (aircraftState.activeMap) return aircraftState.activeMap;
    const area = (window.campaignState?.workflow?.assignedArea || '').toLowerCase();
    const dest = (window.campaignState?.workflow?.assignedDestination || '').toLowerCase();
    const targetStr = area + ' ' + dest;
    if (targetStr.includes('sydney') || targetStr.includes('australia')) return 'map_p8_sydney_harbor.jpg';
    if (targetStr.includes('diego') || targetStr.includes('suarez') || targetStr.includes('madagascar')) return 'map_p9_diego_suarez.jpg';
    if (targetStr.includes('oregon') || targetStr.includes('west coast') || targetStr.includes('costa oeste')) return 'map_p10_oregon.jpg';
    if (targetStr.includes('panama') || targetStr.includes('panamá')) return 'map_p11_panama_canal.jpg';
    if (targetStr.includes('aleutian') || targetStr.includes('aleutianas') || targetStr.includes('malaya') || targetStr.includes('malasia')) return 'map_p12_aleutians.jpg';
    return 'map_p7_pearl_harbor.jpg';
  }


  const AIRCRAFT_MAP_CIRCLES = {
    'map_p7_pearl_harbor.jpg': [
      { num: 1, type: 'transit', label_es: 'Tránsito 1 (Entrada de Pearl Harbor)', label_en: 'Transit 1 (Pearl Harbor Entrance)', col: 'transit', x: 49.0, y: 86.0 },
      { num: 2, type: 'recon',   label_es: 'Reconocimiento 2 (Canal Principal)', label_en: 'Recon 2 (Main Channel)', col: 'recon', x: 50.0, y: 62.0 },
      { num: 3, type: 'target',  label_es: 'Objetivo 3 (Fondeadero West Lock / Ford Island)', label_en: 'Target 3 (West Lock / Ford Island Anchorage)', col: 'target', x: 45.0, y: 44.0 },
      { num: 4, type: 'recon',   label_es: 'Reconocimiento 4 (Middle Lock / Escape)', label_en: 'Recon 4 (Middle Lock / Egress)', col: 'recon', x: 38.0, y: 28.0 }
    ],
    'map_p8_sydney_harbor.jpg': [
      { num: 1, type: 'transit', label_es: 'Tránsito 1 (Aproximación Pacífico / Heads)', label_en: 'Transit 1 (Pacific Approach / Heads)', col: 'transit', x: 80.0, y: 42.0 },
      { num: 2, type: 'recon',   label_es: 'Reconocimiento 2 (Barrera Boom Net)', label_en: 'Recon 2 (Boom Net Barrier)', col: 'recon', x: 60.0, y: 43.0 },
      { num: 3, type: 'target',  label_es: 'Objetivo 3 (Fondeadero de la Flota / Garden Is.)', label_en: 'Target 3 (Fleet Anchorage / Garden Is.)', col: 'target', x: 33.0, y: 51.0 },
      { num: 4, type: 'recon',   label_es: 'Reconocimiento 4 (Rose Bay / Escape)', label_en: 'Recon 4 (Rose Bay / Egress)', col: 'recon', x: 52.0, y: 64.0 }
    ],
    'map_p9_diego_suarez.jpg': [
      { num: 1, type: 'transit', label_es: 'Tránsito 1 (Océano Índico)', label_en: 'Transit 1 (Indian Ocean)', col: 'transit', x: 78.0, y: 66.0 },
      { num: 2, type: 'recon',   label_es: 'Reconocimiento 2 (Canal de Orangea)', label_en: 'Recon 2 (Orangea Pass)', col: 'recon', x: 50.5, y: 70.0 },
      { num: 3, type: 'target',  label_es: 'Objetivo 3 (Bahía Diego Suárez)', label_en: 'Target 3 (Diego Suarez Bay)', col: 'target', x: 44.0, y: 63.0 },
      { num: 4, type: 'recon',   label_es: 'Reconocimiento 4 (Rade de Diego / Fondeadero)', label_en: 'Recon 4 (Rade de Diego / Anchorage)', col: 'recon', x: 42.0, y: 69.0 },
      { num: 5, type: 'transit', label_es: 'Tránsito 5 (Escape Cape d\'Ambre)', label_en: 'Transit 5 (Cape d\'Ambre Egress)', col: 'transit', x: 46.0, y: 39.0 }
    ],
    'map_p10_oregon.jpg': [
      { num: 1, type: 'transit', label_es: 'Tránsito 1 (Llegada desde el Pacífico)', label_en: 'Transit 1 (Pacific Ocean Arrival)', col: 'transit', x: 18.0, y: 72.0 },
      { num: 2, type: 'transit', label_es: 'Tránsito 2 (Costa de Brookings)', label_en: 'Transit 2 (Brookings Coast)', col: 'transit', x: 38.0, y: 48.0 },
      { num: 3, type: 'target',  label_es: 'Objetivo 3 (Bosque Mt. Emily / Bombardeo)', label_en: 'Target 3 (Mt. Emily Forest / Bombing)', col: 'target', x: 74.0, y: 28.0 },
      { num: 4, type: 'transit', label_es: 'Tránsito 4 (Retorno al Mar)', label_en: 'Transit 4 (Return to Sea)', col: 'transit', x: 30.0, y: 86.0 }
    ],
    'map_p11_panama_canal.jpg': [
      { num: 1, type: 'transit', label_es: 'Tránsito 1 (Golfo de Panamá)', label_en: 'Transit 1 (Gulf of Panama)', col: 'transit', x: 70.0, y: 68.0 },
      { num: 2, type: 'transit', label_es: 'Tránsito 2 (Aproximación al Canal / Balboa)', label_en: 'Transit 2 (Canal Approach / Balboa)', col: 'transit', x: 50.0, y: 52.0 },
      { num: 3, type: 'target',  label_es: 'Objetivo 3 (Esclusas de Miraflores)', label_en: 'Target 3 (Miraflores Locks / Bombing)', col: 'target', x: 36.0, y: 27.0 },
      { num: 4, type: 'transit', label_es: 'Tránsito 4 (Escape al Pacífico)', label_en: 'Transit 4 (Pacific Egress)', col: 'transit', x: 42.0, y: 78.0 }
    ],
    'map_p12_aleutians.jpg': [
      { num: 1, type: 'transit', label_es: 'Tránsito 1 (Aguas Profundas / Océano)', label_en: 'Transit 1 (Deep Water / Subarctic Ocean)', col: 'transit', x: 25.0, y: 22.0 },
      { num: 2, type: 'recon',   label_es: 'Reconocimiento 2 (Línea de Costa)', label_en: 'Recon 2 (Coastline)', col: 'recon', x: 38.0, y: 46.0 },
      { num: 3, type: 'recon',   label_es: 'Reconocimiento 3 (Dutch Harbor Naval Base)', label_en: 'Recon 3 (Dutch Harbor Naval Base)', col: 'recon', x: 53.0, y: 42.0 },
      { num: 4, type: 'transit', label_es: 'Tránsito 4 (Retorno al Buque)', label_en: 'Transit 4 (Return to Sub)', col: 'transit', x: 75.0, y: 24.0 }
    ]
  };

  function getActiveAircraftChit() {
    const sKey = (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ? currentBoardSubKey : ((window.campaignState && window.campaignState.activeSubKey) ? window.campaignState.activeSubKey : 'Junsen_J_IM_Class');
    if (sKey === 'Sen_Toku_Class' || sKey === 'Type_AM_Class' || sKey === 'Type_A_Modified') {
      return 'assets/chits/Seiran Floatplane.jpg';
    } else if (sKey === 'Junsen_J2_Class') {
      return 'assets/chits/aircraft_watanabe_e9w_slim.jpg';
    }
    return 'assets/chits/aircraft_yokosuka_e14y_glen.jpg';
  }

  function switchAirPhaseTab(tabKey) {
    if (!['takeoff', 'map', 'recovery'].includes(tabKey)) tabKey = 'map';
    aircraftState.activePhaseTab = tabKey;

    const tabTakeoff = document.getElementById('air-tab-btn-takeoff');
    const tabMap = document.getElementById('air-tab-btn-map');
    const tabRecovery = document.getElementById('air-tab-btn-recovery');

    const panelTakeoff = document.getElementById('air-tab-panel-takeoff');
    const panelMap = document.getElementById('air-tab-panel-map');
    const panelRecovery = document.getElementById('air-tab-panel-recovery');

    const isTakeoff = (tabKey === 'takeoff');
    const isMap = (tabKey === 'map');
    const isRecovery = (tabKey === 'recovery');

    if (panelTakeoff) panelTakeoff.style.display = isTakeoff ? 'block' : 'none';
    if (panelMap) panelMap.style.display = isMap ? 'block' : 'none';
    if (panelRecovery) panelRecovery.style.display = isRecovery ? 'block' : 'none';

    if (tabTakeoff) {
      tabTakeoff.style.background = isTakeoff ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(15, 23, 42, 0.7)';
      tabTakeoff.style.color = isTakeoff ? '#ffffff' : '#94a3b8';
      tabTakeoff.style.borderColor = isTakeoff ? '#38bdf8' : '#334155';
    }
    if (tabMap) {
      tabMap.style.background = isMap ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(15, 23, 42, 0.7)';
      tabMap.style.color = isMap ? '#ffffff' : '#94a3b8';
      tabMap.style.borderColor = isMap ? '#38bdf8' : '#334155';
    }
    if (tabRecovery) {
      tabRecovery.style.background = isRecovery ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : 'rgba(15, 23, 42, 0.7)';
      tabRecovery.style.color = isRecovery ? '#ffffff' : '#94a3b8';
      tabRecovery.style.borderColor = isRecovery ? '#10b981' : '#334155';
    }

    if (isMap) {
      renderTacticalMapWithChits();
    }
  }

  function renderTacticalMapWithChits() {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    const mapFile = aircraftState.activeMap || 'map_p7_pearl_harbor.jpg';
    const circles = AIRCRAFT_MAP_CIRCLES[mapFile] || AIRCRAFT_MAP_CIRCLES['map_p7_pearl_harbor.jpg'];
    const curCircleNum = Math.max(1, Math.min(circles.length, s.flightCircle || 1));
    s.flightCircle = curCircleNum;

    const overlay = document.getElementById('air-map-interactive-overlay');
    if (!overlay) return;

    const planeChit = getActiveAircraftChit();
    const resolve = (typeof resolveAsset === 'function') ? resolveAsset : (x => x);

    const activeCircleObj = circles.find(c => c.num === curCircleNum) || circles[0];

    // Stepper Pills in Map Top Bar
    const stepperBox = document.getElementById('air-map-stepper-pills');
    if (stepperBox) {
      let stepHtml = '';
      circles.forEach(c => {
        const isAct = (c.num === curCircleNum);
        const isPast = (c.num < curCircleNum);
        const circleCol = (c.type === 'target') ? '#ef4444' : ((c.type === 'recon') ? '#0284c7' : '#10b981');
        const bg = isAct ? '#facc15' : (isPast ? circleCol : '#334155');
        const col = isAct ? '#0f172a' : '#ffffff';
        const borderCol = isAct ? '#ffffff' : circleCol;
        const cTitle = `${isEn ? c.label_en : c.label_es}`;
        stepHtml += `<button type="button" onclick="window.selectFlightCircle(${c.num})" title="${cTitle}" style="width:26px; height:26px; border-radius:50%; border:2px solid ${borderCol}; background:${bg}; color:${col}; font-size:0.75rem; font-weight:bold; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; padding:0; transition:all 0.2s ease; box-shadow:${isAct ? '0 0 10px rgba(250,204,21,0.8)' : 'none'};">${c.num}</button>`;
      });
      stepperBox.innerHTML = stepHtml;
    }

    // Threat badge in console
    const threatBadge = document.getElementById('air-console-threat-badge');
    if (threatBadge) {
      if (activeCircleObj.type === 'target') {
        threatBadge.style.background = 'rgba(239,68,68,0.2)';
        threatBadge.style.borderColor = '#ef4444';
        threatBadge.style.color = '#fca5a5';
        threatBadge.innerHTML = isEn ? '🔴 High Threat (Target & Heavy Flak)' : '🔴 Amenaza Máxima (Objetivo y Flak Intenso)';
      } else if (activeCircleObj.type === 'recon') {
        threatBadge.style.background = 'rgba(234,179,8,0.2)';
        threatBadge.style.borderColor = '#eab308';
        threatBadge.style.color = '#fde047';
        threatBadge.innerHTML = isEn ? '🟡 Medium Threat (Coastal Patrols)' : '🟡 Amenaza Media (Patrullas Costeras)';
      } else {
        threatBadge.style.background = 'rgba(16,185,129,0.2)';
        threatBadge.style.borderColor = '#10b981';
        threatBadge.style.color = '#86efac';
        threatBadge.innerHTML = isEn ? '🟢 Low Threat (Transit Sea)' : '🟢 Amenaza Baja (Tránsito Marítimo)';
      }
    }

    // Quick Health Bar in console
    const healthPill = document.getElementById('air-console-quick-health');
    if (healthPill) {
      const dmgLabel = (s.damage === 0) ? (isEn ? "Intact" : "Intacto") : (s.damage === 1) ? (isEn ? "Minor Dmg (1)" : "Daño Leve (1)") : (s.damage === 2) ? (isEn ? "Heavy Dmg (2)" : "Daño Grave (2)") : (isEn ? "Destroyed (3)" : "Destruido (3)");
      const dmgColor = (s.damage === 0) ? "#4ade80" : (s.damage === 1) ? "#fde047" : "#ef4444";
      const bombsLabel = s.bombsLoaded ? (isEn ? "Bombs: Loaded" : "Bombas: Cargadas") : (isEn ? "Recon (No Bombs)" : "Reconocimiento");
      healthPill.innerHTML = `<span style="color:${dmgColor}; font-weight:bold;">● ${dmgLabel}</span> • <span>${bombsLabel}</span> • <span>${isEn ? 'Pilot' : 'Piloto'}: ${(s.pilot || 'OK').toUpperCase()}</span>`;
    }

    // Status pill
    const pillText = document.getElementById('air-map-circle-text');
    if (pillText) {
      pillText.innerText = `${isEn ? 'Circle' : 'Círculo'} ${curCircleNum}/${circles.length}: ${isEn ? activeCircleObj.label_en : activeCircleObj.label_es}`;
    }

    // Buttons
    const btnPrev = document.getElementById('air-btn-prev-circle');
    const btnNext = document.getElementById('air-btn-next-circle');
    const btnBomb = document.getElementById('air-btn-bomb-target');
    const btnFinish = document.getElementById('air-btn-finish-flight');
    const btnEncounter = document.getElementById('air-btn-roll-encounter');

    if (btnPrev) btnPrev.style.display = (curCircleNum > 1) ? 'inline-block' : 'none';
    if (btnNext) btnNext.style.display = (curCircleNum < circles.length) ? 'inline-block' : 'none';
    if (btnFinish) btnFinish.style.display = (curCircleNum === circles.length) ? 'inline-block' : 'none';
    if (btnBomb) btnBomb.style.display = (activeCircleObj.type === 'target') ? 'inline-block' : 'none';

    if (btnEncounter) {
      const colLabel = (activeCircleObj.type === 'target') ? (isEn ? 'Target' : 'Objetivo') : ((activeCircleObj.type === 'recon') ? (isEn ? 'Recon' : 'Recon') : (isEn ? 'Transit' : 'Tránsito'));
      btnEncounter.innerHTML = `🎲 <span>${isEn ? `Roll Encounter (${colLabel} 2d6)` : `Tirar Encuentro (${colLabel} 2d6)`}</span>`;
    }

    // SVG Flight Corridor / Route connecting circles
    let svgLines = '';
    for (let i = 0; i < circles.length - 1; i++) {
      const c1 = circles[i];
      const c2 = circles[i + 1];
      svgLines += `<line x1="${c1.x}" y1="${c1.y}" x2="${c2.x}" y2="${c2.y}" stroke="#38bdf8" stroke-width="0.8" stroke-dasharray="2,1.2" stroke-linecap="round" style="filter:drop-shadow(0 0 3px rgba(2,132,199,0.9));" />`;
    }
    const svgRoute = `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:2;">
        ${svgLines}
      </svg>
    `;

    let html = svgRoute;
    circles.forEach(c => {
      const isActive = (c.num === curCircleNum);
      const isTarget = (c.type === 'target');
      const isRecon = (c.type === 'recon');
      
      // Color palette per circle type: Vibrant, opaque colored discs
      const mainCol = isTarget ? '#ef4444' : (isRecon ? '#0284c7' : '#10b981');
      const borderCol = isTarget ? '#fecaca' : (isRecon ? '#bae6fd' : '#a7f3d0');
      const bgGrad = isTarget 
        ? 'radial-gradient(circle at 35% 35%, #ef4444 0%, #dc2626 65%, #991b1b 100%)'
        : (isRecon 
            ? 'radial-gradient(circle at 35% 35%, #38bdf8 0%, #0284c7 65%, #0369a1 100%)' 
            : 'radial-gradient(circle at 35% 35%, #10b981 0%, #059669 65%, #047857 100%)');
      const glowCol = isTarget ? 'rgba(239, 68, 68, 0.95)' : (isRecon ? 'rgba(56, 189, 248, 0.95)' : 'rgba(16, 185, 129, 0.95)');
      const icon = isTarget ? '🎯' : (isRecon ? '🔭' : '🧭');
      const shortTag = isTarget ? (isEn ? 'Target' : 'Objetivo') : (isRecon ? (isEn ? 'Recon' : 'Recon') : (isEn ? 'Transit' : 'Tránsito'));
      const cTitle = `${isEn ? c.label_en : c.label_es} (${isEn ? 'Click to move plane here' : 'Clic para mover el avión aquí'})`;

      // Tag positioning: place on top if circle is near bottom of map (y > 78)
      const tagStyle = (c.y > 78) 
        ? 'top:-25px;' 
        : 'bottom:-25px;';

      // Circle disc: Solid, saturated, luminous wargame counter token
      const activePulse = isActive 
        ? 'outline:4px solid #facc15; outline-offset:3px; box-shadow:0 0 0 6px rgba(250,204,21,0.65), 0 0 32px rgba(250,204,21,1), 0 6px 14px rgba(0,0,0,0.9); z-index:15;' 
        : `box-shadow:0 0 20px ${glowCol}, inset 0 2px 4px rgba(255,255,255,0.45), 0 5px 12px rgba(0,0,0,0.85); z-index:6;`;

      html += `
        <div onclick="window.selectFlightCircle(${c.num})" title="${cTitle}" style="position:absolute; left:${c.x}%; top:${c.y}%; transform:translate(-50%, -50%); width:54px; height:54px; border-radius:50%; cursor:pointer; border:3.5px solid ${borderCol}; background:${bgGrad}; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:all 0.25s ease; ${activePulse}">
          <span style="font-size:1.35rem; font-weight:900; line-height:1; color:#ffffff; text-shadow:0 2px 6px rgba(0,0,0,0.95); font-family:'Segoe UI', system-ui, sans-serif;">${c.num}</span>
          <span style="position:absolute; ${tagStyle} background:rgba(7,13,27,0.95); border:1.8px solid ${mainCol}; color:#ffffff; font-size:0.68rem; font-weight:900; padding:2px 8px; border-radius:4px; white-space:nowrap; box-shadow:0 3px 10px rgba(0,0,0,0.9); pointer-events:none; letter-spacing:0.3px;">
            ${icon} ${shortTag} ${c.num}
          </span>
        </div>
      `;

      if (isActive) {
        let xShift = '35%';
        let yShift = '-85%';
        if (c.x > 75) xShift = '-135%';
        if (c.y < 25) yShift = '25%';
        html += `
          <div class="air-active-plane-counter" style="position:absolute; left:${c.x}%; top:${c.y}%; transform:translate(${xShift}, ${yShift}); width:52px; height:52px; z-index:10; pointer-events:none; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.95)); transition:all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);">
            <div style="position:relative; width:100%; height:100%;">
              <img src="${resolve(planeChit)}" alt="Aircraft Chit" style="width:100%; height:100%; object-fit:cover; border-radius:6px; border:2px solid #eab308; box-shadow:0 0 20px rgba(234, 179, 8, 0.95);" />
              <span style="position:absolute; top:-7px; right:-7px; background:#ef4444; color:#ffffff; font-size:0.68rem; font-weight:bold; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; border:1.5px solid #ffffff; box-shadow:0 2px 4px rgba(0,0,0,0.8);">✈</span>
              <span style="position:absolute; bottom:-6px; left:-6px; background:#0284c7; color:#f0f9ff; font-size:0.60rem; font-weight:900; border-radius:4px; padding:1px 4px; border:1px solid #38bdf8; box-shadow:0 2px 4px rgba(0,0,0,0.8);">${isEn ? 'AIR' : 'VUELO'}</span>
            </div>
          </div>
        `;
      }
    });

    overlay.innerHTML = html;
    updateFlightLogDisplay();
  }

  function selectFlightCircle(num) {
    const s = getActiveSlotData();
    s.flightCircle = num;
    renderTacticalMapWithChits();
    if (typeof saveState === 'function') saveState();
  }

  function nextFlightCircle() {
    const s = getActiveSlotData();
    const mapFile = aircraftState.activeMap || 'map_p7_pearl_harbor.jpg';
    const circles = AIRCRAFT_MAP_CIRCLES[mapFile] || AIRCRAFT_MAP_CIRCLES['map_p7_pearl_harbor.jpg'];
    if (s.flightCircle < circles.length) {
      s.flightCircle++;
      renderTacticalMapWithChits();
    } else {
      switchAirPhaseTab('recovery');
    }
    if (typeof saveState === 'function') saveState();
  }

  function prevFlightCircle() {
    const s = getActiveSlotData();
    if (s.flightCircle > 1) {
      s.flightCircle--;
      renderTacticalMapWithChits();
    }
    if (typeof saveState === 'function') saveState();
  }

  function updateFlightLogDisplay() {
    const s = getActiveSlotData();
    const logBox = document.getElementById('air-flight-log-box');
    if (!logBox) return;
    const isEn = (window.currentLang === 'en');
    if (!s.flightLogs || s.flightLogs.length === 0) {
      logBox.innerHTML = `<span style="color:#64748b; font-style:italic;" id="air-flight-log-empty">${isEn ? "Floatplane is ready for navigation. Click a circle on map or hit '🎲 Roll Encounter'." : "El hidroavión está listo para iniciar la navegación. Selecciona un círculo en el mapa o pulsa «🎲 Tirar Encuentro»."}</span>`;
      return;
    }
    let html = '';
    s.flightLogs.forEach(entry => {
      html += `<div style="margin-bottom:4px; border-bottom:1px solid #1e293b; padding-bottom:3px; display:flex; align-items:flex-start; gap:6px;">
        <span style="color:#38bdf8;">📍</span>
        <div><strong style="color:var(--gold-400);">${entry.circle}:</strong> ${entry.text}</div>
      </div>`;
    });
    logBox.innerHTML = html;
    logBox.scrollTop = logBox.scrollHeight;
  }

  function rollAirCircleEncounter() {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    const mapFile = aircraftState.activeMap || 'map_p7_pearl_harbor.jpg';
    const circles = AIRCRAFT_MAP_CIRCLES[mapFile] || AIRCRAFT_MAP_CIRCLES['map_p7_pearl_harbor.jpg'];
    const curCircleNum = Math.max(1, Math.min(circles.length, s.flightCircle || 1));
    const activeCircleObj = circles.find(c => c.num === curCircleNum) || circles[0];

    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;

    let resText = '';
    let isTrouble = false;

    if (activeCircleObj.type === 'transit') {
      if (sum <= 5) {
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ No Encounter (Clean flight).` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Sin Encuentro (Vuelo despejado).`;
      } else if (sum <= 7) {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Patrol Plane Encounter [Check Table P4]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Avión de Patrulla Enemigo [Consultar Tabla P4]!`;
      } else if (sum <= 9) {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Anti-Aircraft Fire (Flak) [Check Table P5]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Fuego Antiaéreo (Flak) [Consultar Tabla P5]!`;
      } else {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Enemy Fighter Intercept [Check Table P4]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Caza Enemigo Intercepta [Consultar Tabla P4]!`;
      }
    } else if (activeCircleObj.type === 'recon') {
      if (sum <= 4) {
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Recon Flight Clear (Valuable intel gathered).` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Reconocimiento Exitoso (Inteligencia valiosa obtenida).`;
      } else if (sum <= 6) {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Harbor Patrol Escort / Plane Spotted [Check Table P4]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Patrullero / Avión del Puerto [Consultar Tabla P4]!`;
      } else if (sum <= 8) {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Coastal AA Battery Fire [Check Table P5]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Fuego de Batería Antiaérea Costera [Consultar Tabla P5]!`;
      } else {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Base Fighter Interceptors Scrambled [Check Table P4]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Cazas de la Base Despegan [Consultar Tabla P4]!`;
      }
    } else { // target
      if (sum <= 3) {
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Target Zone Clear! Full surprise achieved.` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Zona de Objetivo Despejada! Sorpresa total conseguida.`;
      } else if (sum <= 5) {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Fleet Air Patrol Intercept [Check Table P4]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Patrulla Aérea de la Flota [Consultar Tabla P4]!`;
      } else if (sum <= 8) {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Heavy Harbor AA Flak Barrage [Check Table P5]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Intenso Fuego Antiaéreo del Puerto [Consultar Tabla P5]!`;
      } else {
        isTrouble = true;
        resText = isEn ? `Roll 2d6 = ${sum} (${d1}+${d2}) ➔ Elite Interceptor Defense [Check Table P4]!` : `Tirada 2d6 = ${sum} (${d1}+${d2}) ➔ Interceptores de Élite [Consultar Tabla P4]!`;
      }
    }

    const cLabel = isEn ? activeCircleObj.label_en : activeCircleObj.label_es;
    s.flightLogs.push({ circle: cLabel, text: resText });
    updateFlightLogDisplay();

    if (typeof showToast === 'function') {
      showToast(`${isTrouble ? '⚠️' : '✅'} ${cLabel}: ${resText}`);
    }

    if (typeof saveState === 'function') saveState();
  }

  function rollAirBombing() {
    const isEn = (window.currentLang === 'en');
    const s = getActiveSlotData();
    const d = Math.floor(Math.random() * 6) + 1;
    let drm = 0;
    if (aircraftState.skills && aircraftState.skills.weapons) drm += 1;
    const total = d + drm;

    let resText = '';
    if (total >= 4) {
      resText = isEn ? `Bombing 1d6 = ${d}${drm ? ` (+${drm} Weapons Exp)` : ''} = ${total} ➔ DIRECT HIT! Target heavily bombed (+1 VP)!` : `Bombardeo 1d6 = ${d}${drm ? ` (+${drm} Exp. Armas)` : ''} = ${total} ➔ ¡IMPACTO DIRECTO! Objetivo bombardeado con éxito (+1 VP)!`;
      s.missionDone = true;
      const claimBtn = document.getElementById('air-claim-reward-btn');
      if (claimBtn) claimBtn.style.display = 'block';
    } else {
      resText = isEn ? `Bombing 1d6 = ${d}${drm ? ` (+${drm})` : ''} = ${total} ➔ Near Miss / Off Target.` : `Bombardeo 1d6 = ${d}${drm ? ` (+${drm})` : ''} = ${total} ➔ Bombas desviadas / Sin impacto directo.`;
    }

    s.flightLogs.push({ circle: isEn ? "Target Bombing Run" : "Ataque de Bombardeo", text: resText });
    updateFlightLogDisplay();

    if (typeof showToast === 'function') {
      showToast(`${total >= 4 ? '💣💥' : '⚠️'} ${resText}`);
    }

    if (typeof saveState === 'function') saveState();
  }


  function selectAircraftMap(mapFile) {
    if (!AIRCRAFT_MAPS[mapFile]) mapFile = 'map_p7_pearl_harbor.jpg';
    aircraftState.activeMap = mapFile;
    const isEn = (window.currentLang === 'en');
    const imgEl = document.getElementById('air-tactical-map-img');
    const selectorEl = document.getElementById('air-map-selector');
    if (imgEl) imgEl.src = (typeof resolveAsset === 'function' ? resolveAsset('assets/maps/' + mapFile) : 'assets/maps/' + mapFile);
    if (selectorEl && selectorEl.value !== mapFile) {
      selectorEl.value = mapFile;
    }
    renderTacticalMapWithChits();
    if (typeof saveState === 'function') saveState();
  }

  let airMapZoomLevel = 1.0;
  let airInspectorCollapsed = false;

  function zoomAircraftMap(delta) {
    airMapZoomLevel = Math.max(0.7, Math.min(2.5, +(airMapZoomLevel + delta).toFixed(2)));
    applyAirMapZoom();
  }

  function resetAircraftMapZoom() {
    airMapZoomLevel = 1.0;
    applyAirMapZoom();
  }

  function applyAirMapZoom() {
    const wrapper = document.getElementById('air-map-wrapper');
    const stage = document.getElementById('air-map-stage');
    const zoomLbl = document.getElementById('air-zoom-val');
    if (wrapper) {
      wrapper.style.transform = `scale(${airMapZoomLevel})`;
    }
    if (stage) {
      stage.style.overflow = (airMapZoomLevel > 1.0) ? 'auto' : 'hidden';
    }
    if (zoomLbl) {
      zoomLbl.innerText = `${Math.round(airMapZoomLevel * 100)}%`;
    }
  }

  function toggleAircraftInspectorCollapse() {
    airInspectorCollapsed = !airInspectorCollapsed;
    applyAircraftInspectorState();
  }

  function toggleAirTheaterMode() {
    airInspectorCollapsed = !airInspectorCollapsed;
    applyAircraftInspectorState();
  }

  function applyAircraftInspectorState() {
    const colInsp = document.getElementById('air-mat-col-inspector');
    const btnTog = document.getElementById('air-btn-toggle-inspector');
    const theaterIcon = document.getElementById('air-theater-icon');
    const theaterText = document.getElementById('air-theater-text');
    const workspace = document.getElementById('air-map-tactical-workspace');
    const isEn = (window.currentLang === 'en');

    if (colInsp) {
      colInsp.style.display = airInspectorCollapsed ? 'none' : 'flex';
    }

    if (workspace) {
      if (airInspectorCollapsed) {
        workspace.style.gridTemplateColumns = 'minmax(0, 1.85fr) minmax(320px, 0.9fr)';
      } else {
        workspace.style.gridTemplateColumns = 'minmax(0, 1.45fr) minmax(320px, 0.9fr)';
      }
    }

    if (btnTog) {
      btnTog.innerHTML = airInspectorCollapsed 
        ? `<span>▶ ${isEn ? "Show Aircraft Sheet" : "Mostrar Ficha Avión"}</span>` 
        : `<span>◀ ${isEn ? "Hide Aircraft Sheet" : "Ocultar Ficha Avión"}</span>`;
    }

    if (theaterIcon && theaterText) {
      theaterIcon.innerText = airInspectorCollapsed ? '🗗' : '⛶';
      theaterText.innerText = airInspectorCollapsed 
        ? (isEn ? "Split View" : "Vista Dividida") 
        : (isEn ? "Expanded View" : "Modo Expandido");
    }
  }

  function clearAirFlightLog() {
    const s = getActiveSlotData();
    s.flightLogs = [];
    updateFlightLogDisplay();
    if (typeof saveState === 'function') saveState();
  }

  function openAirMapFullscreen() {
    const curMap = aircraftState.activeMap || 'map_p7_pearl_harbor.jpg';
    const isEn = (window.currentLang === 'en');
    const title = AIRCRAFT_MAPS[curMap] ? (isEn ? AIRCRAFT_MAPS[curMap].title_en : AIRCRAFT_MAPS[curMap].title_es) : 'Tactical Map';
    const src = (typeof resolveAsset === 'function' ? resolveAsset('assets/maps/' + curMap) : 'assets/maps/' + curMap);
    if (typeof openModalViewer === 'function') {
      openModalViewer(title, src);
    }
  }

  function openAircraftDisplayMatModal() {
    const modal = document.getElementById('modal-aircraft-display-mat');
    if (!modal) return;
    
    if (!window.campaignState.aircraftState) {
      autoSelectAircraftForSub();
      window.campaignState.aircraftState = aircraftState;
    } else {
      aircraftState = window.campaignState.aircraftState;
    }

    syncSchoolSkillsToAircraftState();
    syncSubBoardToAircraftState();
    renderAircraftMatUI();
    switchAirPhaseTab(aircraftState.activePhaseTab || 'map');
    modal.style.display = 'flex';
  }

  function closeAircraftDisplayMatModal() {
    const modal = document.getElementById('modal-aircraft-display-mat');
    if (modal) modal.style.display = 'none';
    syncAircraftStateToSubBoard();
    if (typeof saveState === 'function') saveState();
  }

  // Alternar vista en Tab 5c (Submarino / Hidroavión)
  function toggleBoardSubOrAir(mode) {
    if (mode === 'aircraft') {
      openAircraftDisplayMatModal();
      return;
    }
    const subContainer = document.getElementById('sub-board-main-container');
    const airContainer = document.getElementById('aircraft-board-tab-container');
    const btnSub = document.getElementById('btn-toggle-board-sub');
    const btnAir = document.getElementById('btn-toggle-board-air');

    if (airContainer) airContainer.style.display = 'none';
    if (subContainer) subContainer.style.display = 'block';
    if (btnAir) { btnAir.style.background = 'transparent'; btnAir.style.color = '#94a3b8'; }
    if (btnSub) { btnSub.style.background = 'linear-gradient(135deg, #c5a059 0%, #b45309 100%)'; btnSub.style.color = '#fff'; }
  }

  // =========================================================================
  // GUÍA OFICIAL DEL MÓDULO AERONAVAL (REGLA 7.17)
  // =========================================================================
  let activeGuideTab = 'overview';

  function openAirModuleGuideModal(tabKey) {
    if (tabKey) activeGuideTab = tabKey;
    const modal = document.getElementById('modal-aircraft-guide');
    if (!modal) return;
    modal.style.display = 'flex';
    modal.style.zIndex = '100020';
    switchAirGuideTab(activeGuideTab);
  }

  function closeAirModuleGuideModal() {
    const modal = document.getElementById('modal-aircraft-guide');
    if (modal) modal.style.display = 'none';
  }

  function switchAirGuideTab(tabKey) {
    if (!['overview', 'takeoff', 'flight', 'recovery', 'faq'].includes(tabKey)) tabKey = 'overview';
    activeGuideTab = tabKey;
    const isEn = (window.currentLang === 'en');

    // Actualizar estilos de los botones de pestañas
    const tabs = ['overview', 'takeoff', 'flight', 'recovery', 'faq'];
    tabs.forEach(t => {
      const btn = document.getElementById(`air-guide-tab-btn-${t}`);
      if (btn) {
        const isAct = (t === tabKey);
        btn.style.background = isAct ? 'linear-gradient(135deg, #c5a059 0%, #b45309 100%)' : 'rgba(15, 23, 42, 0.7)';
        btn.style.color = isAct ? '#0f172a' : '#cbd5e1';
        btn.style.borderColor = isAct ? '#fde047' : '#334155';
        btn.style.boxShadow = isAct ? '0 0 12px rgba(234, 179, 8, 0.4)' : 'none';
      }
    });

    const bodyEl = document.getElementById('air-guide-modal-body');
    if (!bodyEl) return;

    if (tabKey === 'overview') {
      bodyEl.innerHTML = renderGuideOverview(isEn);
    } else if (tabKey === 'takeoff') {
      bodyEl.innerHTML = renderGuideTakeoff(isEn);
    } else if (tabKey === 'flight') {
      bodyEl.innerHTML = renderGuideFlight(isEn);
    } else if (tabKey === 'recovery') {
      bodyEl.innerHTML = renderGuideRecovery(isEn);
    } else if (tabKey === 'faq') {
      bodyEl.innerHTML = renderGuideFaq(isEn);
    }
  }

  function renderGuideOverview(isEn) {
    if (isEn) {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(2,132,199,0.1); border-left:4px solid #38bdf8; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:1.02rem;">✈️ Official Rule 7.17: Embarked Aircraft Module</h4>
            <p style="margin:0; font-size:0.86rem; color:#e0f2fe;">
              During World War II, the Imperial Japanese Navy (IJN) was the only naval power in the world to successfully engineer and deploy large fleet submarines equipped with aircraft hangars, compressed-air catapults, and collapsible floatplanes. These aircraft served as long-range reconnaissance assets and strategic strike platforms capable of hitting enemy mainland targets and fortified harbors.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">📅 When Does the Air Mission Occur?</h4>
            <p style="margin:0 0 8px 0;">
              The air mission is conducted upon arriving at the <strong>first patrol box of the assigned operational zone</strong> (the designated <em>Mission</em> box, not transit sea boxes). In Sensuikan, this triggers the opportunity to launch the embarked floatplane to execute strategic aerial reconnaissance or bombing.
            </p>
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.4); padding:4px 10px; border-radius:4px; border:1px solid #475569; font-size:0.78rem;">
              <span>💡</span> <span>Official Rules Reference: <strong>7.1 (Reconnaissance)</strong>, <strong>7.7 (Air Bombing)</strong>, <strong>7.13 (Mission Rewards)</strong>, and <strong>7.17 (Air Module)</strong>.</span>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">⚓ Submarine Carrier Classes &amp; Aircraft Complement</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:10px;">
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <div style="font-weight:bold; color:var(--gold-300); font-size:0.84rem;">Junsen J 1M / Type B (B1, B2) / Type A / Type A2</div>
                <div style="font-size:0.78rem; color:#94a3b8; margin:2px 0 6px 0;">Equipped with forward deck catapult &amp; cylindrical hangar</div>
                <div style="font-size:0.82rem; color:#cbd5e1;"><strong>Aircraft:</strong> 1× Yokosuka E14Y1 "Glen" (Type A2 carries 2× Glen). Biplace reconnaissance floatplane, 870 km range, 7.7mm defensive rear MG.</div>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <div style="font-weight:bold; color:var(--gold-300); font-size:0.84rem;">Junsen J2 Class (I-6)</div>
                <div style="font-size:0.78rem; color:#94a3b8; margin:2px 0 6px 0;">Early prototype aircraft submarine</div>
                <div style="font-size:0.82rem; color:#cbd5e1;"><strong>Aircraft:</strong> 1× Watanabe E9W1 "Slim" biplane floatplane. Light, agile reconnaissance spotter with 7.7mm defensive gun.</div>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <div style="font-weight:bold; color:var(--gold-300); font-size:0.84rem;">Sen-Toku Class (I-400) &amp; Type AM Class</div>
                <div style="font-size:0.78rem; color:#94a3b8; margin:2px 0 6px 0;">Giant underwater aircraft carriers</div>
                <div style="font-size:0.82rem; color:#cbd5e1;"><strong>Aircraft:</strong> 3× (Sen-Toku) or 2× (Type AM) Aichi M6A1 "Seiran" attack floatplanes. High-speed torpedo/dive bombers carrying 1× Type 91 torpedo or up to 800 kg bombs.</div>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">💣 Mission Configuration: Recon vs Strike [Rule 7.7]</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="border:1px solid #10b981; background:rgba(16,185,129,0.08); border-radius:6px; padding:10px;">
                <strong style="color:#4ade80; font-size:0.84rem;">🔭 Reconnaissance Configuration (No Bombs)</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Optimized for speed, endurance, and safe water landing. No bomb load is carried, ensuring higher agility during approach.
                </p>
              </div>
              <div style="border:1px solid #eab308; background:rgba(234,179,8,0.08); border-radius:6px; padding:10px;">
                <strong style="color:#fde047; font-size:0.84rem;">💣 Bombing Strike Configuration (Armed Bombs)</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Carries 2× 30 kg or 1× 60 kg HE/incendiary bombs (up to 800 kg on the Seiran). Unlocks <strong>Chart P6 (Air Bombing)</strong> against target locks, bases, or anchorages.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(2,132,199,0.1); border-left:4px solid #38bdf8; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:1.02rem;">✈️ Regla Oficial 7.17: Módulo de Aeronaves Embarcadas</h4>
            <p style="margin:0; font-size:0.86rem; color:#e0f2fe;">
              Durante la Segunda Guerra Mundial, la Armada Imperial Japonesa (IJN) fue la única armada del mundo en diseñar, construir y desplegar en combate grandes submarinos oceánicos dotados de hangar estanco, catapulta neumática e hidroaviones desmontables. Estas aeronaves cumplían funciones vitales de exploración estratégica y ataques aéreos por sorpresa contra objetivos continentales y fondeaderos fortificados.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">📅 ¿Cuándo se Ejecuta la Misión Aérea?</h4>
            <p style="margin:0 0 8px 0;">
              La misión aérea se lleva a cabo al llegar a la <strong>primera casilla de patrulla de la zona asignada</strong> (la casilla designada de <em>Misión</em> u objetivo, no en las casillas de tránsito oceánico). En Sensuikan, esto abre el Módulo Aeronaval para lanzar el hidroavión sobre el área asignada.
            </p>
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.4); padding:4px 10px; border-radius:4px; border:1px solid #475569; font-size:0.78rem;">
              <span>💡</span> <span>Referencias Reglamentarias: <strong>7.1 (Reconocimiento)</strong>, <strong>7.7 (Bombardeo Aéreo)</strong>, <strong>7.13 (Recompensas de Misión)</strong> y <strong>7.17 (Módulo Aéreo)</strong>.</span>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">⚓ Clases de Submarinos Portaviones y Dotación Aérea</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:10px;">
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <div style="font-weight:bold; color:var(--gold-300); font-size:0.84rem;">Junsen J 1M / Tipo B (B1, B2) / Tipo A / Tipo A2</div>
                <div style="font-size:0.78rem; color:#94a3b8; margin:2px 0 6px 0;">Catapulta neumática en cubierta de proa y hangar cilíndrico</div>
                <div style="font-size:0.82rem; color:#cbd5e1;"><strong>Aeronave:</strong> 1× Yokosuka E14Y1 "Glen" (el Tipo A2 transporta 2× Glen). Hidroavión biplaza de reconocimiento, 870 km de alcance y ametralladora defensiva trasera de 7.7mm.</div>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <div style="font-weight:bold; color:var(--gold-300); font-size:0.84rem;">Junsen J2 Class (I-6)</div>
                <div style="font-size:0.78rem; color:#94a3b8; margin:2px 0 6px 0;">Submarino prototipo de aviación embarcada</div>
                <div style="font-size:0.82rem; color:#cbd5e1;"><strong>Aeronave:</strong> 1× Watanabe E9W1 "Slim" biplano. Aparato ligero de observación visual con ametralladora defensiva de 7.7mm.</div>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <div style="font-weight:bold; color:var(--gold-300); font-size:0.84rem;">Sen-Toku Class (I-400) y Tipo AM Class</div>
                <div style="font-size:0.78rem; color:#94a3b8; margin:2px 0 6px 0;">Gigantescos submarinos nodriza de ataque</div>
                <div style="font-size:0.82rem; color:#cbd5e1;"><strong>Aeronave:</strong> 3× (Sen-Toku) o 2× (Tipo AM) bombarderos navales Aichi M6A1 "Seiran". Aparatos de ataque de alta velocidad capaces de portar 1 torpedo Tipo 91 o hasta 800 kg de bombas.</div>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">💣 Configuración Bélica: Reconocimiento vs Ataque [Regla 7.7]</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="border:1px solid #10b981; background:rgba(16,185,129,0.08); border-radius:6px; padding:10px;">
                <strong style="color:#4ade80; font-size:0.84rem;">🔭 Configuración de Reconocimiento (Sin Bombas)</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Optimizado para alcance, maniobrabilidad y seguridad al amerizar. No porta bombas, garantizando agilidad en la exploración.
                </p>
              </div>
              <div style="border:1px solid #eab308; background:rgba(234,179,8,0.08); border-radius:6px; padding:10px;">
                <strong style="color:#fde047; font-size:0.84rem;">💣 Configuración de Bombardeo (Bombas Cargadas)</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Armado con 2× 30 kg o 1× 60 kg de bombas incendiarias/HE (hasta 800 kg en el Seiran). Habilita el uso de la <strong>Tabla P6 (Bombardeo Aéreo)</strong> sobre objetivos terrestres o navales.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function renderGuideTakeoff(isEn) {
    if (isEn) {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(2,132,199,0.1); border-left:4px solid #38bdf8; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:1.02rem;">🛫 Phase 1: Catapult Launch &amp; Mishaps [Chart P1]</h4>
            <p style="margin:0; font-size:0.86rem; color:#e0f2fe;">
              Launching an aircraft from a surfaced submarine requires assembly of wings on the narrow wooden deck, crane positioning onto the compressed-air catapult, and pressurized acceleration [Rule 7.15 &amp; 7.17.2].
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">⚠️ Pre-Flight Launch Prerequisites [Rule 7.15]</h4>
            <ul style="margin:0; padding-left:20px; font-size:0.84rem; color:#cbd5e1; display:flex; flex-direction:column; gap:6px;">
              <li><strong>Deck Hangar Operative:</strong> If the hangar is marked [Damaged / Inop], launching is completely blocked.</li>
              <li><strong>Pilot Fit for Duty:</strong> The official pilot cannot be Seriously Wounded (SW) or KIA.</li>
              <li><strong>Structural Integrity:</strong> The floatplane cannot launch if it has accumulated 2 or more damage points.</li>
            </ul>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">🎲 Chart P1 Resolution (2d6 Roll)</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fca5a5; font-size:0.86rem;">Dice Result: 2 • Engine Critical Failure (Engine Misses / Seizure)</strong>
                  <span style="background:#ef4444; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">CRITICAL</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Immediately roll 2d6. On a result of <strong>10+</strong>, the engine catastrophically seizes and the aircraft crashes into the sea (<strong>Destroyed / KIA</strong>). Roll 1d6 for crew casualties (1-3 Light Wound, 4-5 Serious Wound, 6 KIA). If result is 2-9, the motor sputters but the aircraft climbs away at minimum airspeed.
                </p>
              </div>

              <div style="background:rgba(249,115,22,0.1); border:1px solid #f97316; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fdba74; font-size:0.86rem;">Dice Result: 3 • Deck Assembly Problem (Assembly Issue)</strong>
                  <span style="background:#f97316; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">DELAY / ABORT</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Wing locking pins misaligned during hurried topside assembly. The commander must decide: <strong>Abort mission</strong> immediately OR engage in <strong>1 additional round of naval combat</strong> by the submarine before re-attempting catapult launch [Rule 7.17.2].
                </p>
              </div>

              <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#86efac; font-size:0.86rem;">Dice Result: 4 – 11 • Clean Nominal Takeoff</strong>
                  <span style="background:#10b981; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">NOMINAL</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Optimal catapult acceleration. The floatplane climbs smoothly into the sky and initiates approach navigation towards the target sector without delay.
                </p>
              </div>

              <div style="background:rgba(234,179,8,0.1); border:1px solid #eab308; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fde047; font-size:0.86rem;">Dice Result: 12 • Radio Inoperative (Radio INOP)</strong>
                  <span style="background:#eab308; color:#000; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">PENALTY</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Electrical malfunction or antenna wire severed during launch. The aircraft is airborne successfully, but suffers an official penalty of <strong>-1 DRM to Recovery Roll [Chart P2]</strong> upon touchdown.
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">🔧 Aircrew Special Skill: Flawless Maintenance [School F3]</h4>
            <p style="margin:0; font-size:0.82rem; color:#cbd5e1;">
              If your submarine crew possesses the <strong>Flawless Maintenance</strong> skill acquired at Submarine School [Chart F3], you may cancel and <strong>reroll 1 mishap result</strong> (2, 3, or 12).
            </p>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(2,132,199,0.1); border-left:4px solid #38bdf8; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:1.02rem;">🛫 Fase 1: Despegue de Catapulta y Percances [Tabla P1]</h4>
            <p style="margin:0; font-size:0.86rem; color:#e0f2fe;">
              Lanzar un hidroavión desde un submarino en superficie requiere el ensamblaje de alas en la estrecha cubierta de madera, izado con grúa sobre la catapulta de aire comprimido y aceleración neumática [Reglas 7.15 y 7.17.2].
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">⚠️ Requisitos Previos para el Despegue [Regla 7.15]</h4>
            <ul style="margin:0; padding-left:20px; font-size:0.84rem; color:#cbd5e1; display:flex; flex-direction:column; gap:6px;">
              <li><strong>Hangar de Cubierta Operativo:</strong> Si el hangar está marcado como [Averiado / Inop], el despegue queda bloqueado.</li>
              <li><strong>Piloto Apto para el Vuelo:</strong> El piloto oficial no puede estar Gravemente Herido (SW) ni fallecido (KIA).</li>
              <li><strong>Integridad Estructural:</strong> El hidroavión no puede despegar si ha acumulado 2 o más puntos de daño.</li>
            </ul>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">🎲 Resolución de la Tabla P1 (Tirada con 2d6)</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fca5a5; font-size:0.86rem;">Resultado de Dados: 2 • Fallo Crítico de Motor (Engine Seizure)</strong>
                  <span style="background:#ef4444; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">CRÍTICO</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Tira inmediatamente 2d6. Con un resultado de <strong>10+</strong>, el motor se gripa catastróficamente y el avión se estrella en el mar (<strong>Destruido / KIA</strong>). Tira 1d6 por bajas de la dotación (1-3 Herida Leve LW, 4-5 Herida Grave SW, 6 KIA). Si el resultado es 2-9, el motor ratea pero logra elevarse a velocidad de pérdida.
                </p>
              </div>

              <div style="background:rgba(249,115,22,0.1); border:1px solid #f97316; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fdba74; font-size:0.86rem;">Resultado de Dados: 3 • Problema de Ensamblaje en Cubierta (Assembly Issue)</strong>
                  <span style="background:#f97316; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">RETRASO / ABORTAR</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Desajuste de los pasadores de fijación de alas al montar en cubierta. El comandante debe decidir: o <strong>Abortar la misión</strong> de inmediato O librar <strong>1 ronda adicional de combate marítimo del submarino</strong> antes de reintentar el despegue [Regla 7.17.2].
                </p>
              </div>

              <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#86efac; font-size:0.86rem;">Resultado de Dados: 4 – 11 • Despegue Nominal Impecable</strong>
                  <span style="background:#10b981; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">NOMINAL</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Aceleración de catapulta impecable por pistón neumático. El hidroavión asciende suavemente e inicia la navegación hacia su sector de aproximación.
                </p>
              </div>

              <div style="background:rgba(234,179,8,0.1); border:1px solid #eab308; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fde047; font-size:0.86rem;">Resultado de Dados: 12 • Radio Inoperativa (Radio INOP)</strong>
                  <span style="background:#eab308; color:#000; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">PENALIZADOR</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Avería del transmisor o antena cortada durante el disparo. Despega con éxito, pero sufre un penalizador reglamentario de <strong>-1 DRM a la tirada de Recuperación en amerizaje [Tabla P2]</strong>.
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">🔧 Habilidad Especial: Flawless Maintenance [Escuela F3]</h4>
            <p style="margin:0; font-size:0.82rem; color:#cbd5e1;">
              Si la dotación del submarino cuenta con la habilidad <strong>Flawless Maintenance</strong> adquirida en la Escuela Naval [Tabla F3], el jugador puede cancelar y <strong>relanzar 1 tirada de percance</strong> (resultados 2, 3 o 12).
            </p>
          </div>
        </div>
      `;
    }
  }

  function renderGuideFlight(isEn) {
    if (isEn) {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(2,132,199,0.1); border-left:4px solid #38bdf8; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:1.02rem;">🗺️ Phase 2: Tactical Flight &amp; Charts P3 to P6 [Rule 7.17.3]</h4>
            <p style="margin:0; font-size:0.86rem; color:#e0f2fe;">
              Once airborne, the floatplane proceeds along tactical approach sectors (circles) towards its reconnaissance or strike objective. Each circle represents an operational airspace waypoint with distinct threat levels.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">📍 Circle Types &amp; Threat Visual Codes</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:10px;">
              <div style="border:1.5px solid #10b981; background:rgba(16,185,129,0.08); border-radius:6px; padding:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.2rem;">🧭</span>
                  <strong style="color:#34d399; font-size:0.86rem;">Transit Circles (Green)</strong>
                </div>
                <p style="margin:6px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Low threat open-sea approach. Roll 2d6 under the <strong>Transit Column</strong> of Chart P3. Minimal chance of hostile air activity.
                </p>
              </div>

              <div style="border:1.5px solid #38bdf8; background:rgba(56,189,248,0.08); border-radius:6px; padding:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.2rem;">🔭</span>
                  <strong style="color:#7dd3fc; font-size:0.86rem;">Recon Circles (Sky Blue)</strong>
                </div>
                <p style="margin:6px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Medium threat coastal channels, boom defenses, and inner bays. Roll 2d6 under the <strong>Recon Column</strong> of Chart P3. Possibility of patrol craft or CAP fighters.
                </p>
              </div>

              <div style="border:1.5px solid #ef4444; background:rgba(239,68,68,0.08); border-radius:6px; padding:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.2rem;">🎯</span>
                  <strong style="color:#fca5a5; font-size:0.86rem;">Target Circle (Crimson)</strong>
                </div>
                <p style="margin:6px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  High threat objective sector (Pearl Harbor Battleship Row, Sydney fleet anchorage, Miraflores locks). Extreme Flak and fighter intercept risk. If carrying bombs, unlocks <strong>Chart P6 (Bombing)</strong>!
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">⚡ Fast Resolution Combat &amp; Hazard Charts</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <strong style="color:#7dd3fc; font-size:0.84rem;">🔭 Chart P3: Air &amp; Surface Encounters</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  2d6 roll determines weather (clear/fog), merchant or warship sightings, or incoming enemy fighter interception.
                </p>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #f43f5e; border-radius:6px; padding:10px;">
                <strong style="color:#fda4af; font-size:0.84rem;">⚔️ Chart P4: Aerial Dogfight &amp; Rear MG</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Resolved when intercepted by enemy fighters (Wildcat, P-40, Hurricane). The observer fires the Type 92 7.7mm MG while executing evasive maneuvers.
                </p>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #f97316; border-radius:6px; padding:10px;">
                <strong style="color:#fdba74; font-size:0.84rem;">💥 Chart P5: Flak &amp; Anti-Aircraft Fire</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Harbor batteries and warships unleash AA artillery fire. Damage can range from slight shrapnel to heavy damage or direct shoot-down.
                </p>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #eab308; border-radius:6px; padding:10px;">
                <strong style="color:#fde047; font-size:0.84rem;">💣 Chart P6: Precision Air Bombing</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Executed exclusively over the Target circle if bombs are loaded. 1d6 roll determines direct hit damage to strategic infrastructure or anchored warships.
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">🚨 Damage Track &amp; Mandatory Abort Rule [Rule 7.17]</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px;">
              <div style="background:rgba(234,179,8,0.1); border:1px solid #eab308; border-radius:6px; padding:8px; text-align:center;">
                <strong style="color:#fde047; font-size:0.82rem;">1: Light Damage</strong>
                <p style="margin:4px 0 0 0; font-size:0.75rem; color:#cbd5e1;">Minor shrapnel or superficial punctures. Aircraft remains airworthy and may continue.</p>
              </div>
              <div style="background:rgba(249,115,22,0.1); border:1px solid #f97316; border-radius:6px; padding:8px; text-align:center;">
                <strong style="color:#fdba74; font-size:0.82rem;">2: Heavy Damage</strong>
                <p style="margin:4px 0 0 0; font-size:0.75rem; color:#fdba74; font-weight:bold;">MANDATORY ABORT! Aircraft must immediately break off mission and fly directly to recovery.</p>
              </div>
              <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; padding:8px; text-align:center;">
                <strong style="color:#fca5a5; font-size:0.82rem;">3: Destroyed (KIA)</strong>
                <p style="margin:4px 0 0 0; font-size:0.75rem; color:#cbd5e1;">Shot down by fighters or Flak. Aircraft lost; aircrew casualties resolved.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(2,132,199,0.1); border-left:4px solid #38bdf8; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#38bdf8; font-size:1.02rem;">🗺️ Fase 2: Navegación Táctica de Vuelo y Tablas P3 a P6 [Regla 7.17.3]</h4>
            <p style="margin:0; font-size:0.86rem; color:#e0f2fe;">
              Una vez en el aire, el hidroavión avanza a través de los sectores de aproximación (círculos) hacia su objetivo de exploración o bombardeo. Cada círculo representa un punto de paso operacional con distintos niveles de riesgo.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">📍 Tipos de Círculos y Códigos Visuales de Amenaza</h4>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:10px;">
              <div style="border:1.5px solid #10b981; background:rgba(16,185,129,0.08); border-radius:6px; padding:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.2rem;">🧭</span>
                  <strong style="color:#34d399; font-size:0.86rem;">Círculos de Tránsito (Verdes)</strong>
                </div>
                <p style="margin:6px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Aproximación sobre mar abierto con amenaza baja. Tira 2d6 en la <strong>columna Tránsito</strong> de la Tabla P3. Mínimo riesgo de actividad aérea hostil.
                </p>
              </div>

              <div style="border:1.5px solid #38bdf8; background:rgba(56,189,248,0.08); border-radius:6px; padding:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.2rem;">🔭</span>
                  <strong style="color:#7dd3fc; font-size:0.86rem;">Círculos de Reconocimiento (Azul Cian)</strong>
                </div>
                <p style="margin:6px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Amenaza media sobre canales costeros, barreras de redes y bahías interiores. Tira 2d6 en la <strong>columna Recon</strong> de la Tabla P3. Posibilidad de patrulleras o cazas enemigos.
                </p>
              </div>

              <div style="border:1.5px solid #ef4444; background:rgba(239,68,68,0.08); border-radius:6px; padding:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.2rem;">🎯</span>
                  <strong style="color:#fca5a5; font-size:0.86rem;">Círculo de Objetivo (Carmesí)</strong>
                </div>
                <p style="margin:6px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Espacio aéreo sobre el objetivo principal (Battleship Row en Pearl Harbor, fondeadero de Sydney, esclusas de Miraflores). Máxima amenaza de fuego antiaéreo y cazas. Si porta bombas, habilita la <strong>Tabla P6 (Bombardeo)</strong>.
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">⚡ Tablas Tácticas de Resolución Rápida</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:rgba(30,41,59,0.5); border:1px solid #0284c7; border-radius:6px; padding:10px;">
                <strong style="color:#7dd3fc; font-size:0.84rem;">🔭 Tabla P3: Encuentros Aéreos y Marítimos</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Tirada 2d6 para determinar meteorología, avistamiento de buques de guerra o mercantes enemigos, o intercepción por cazas hostiles.
                </p>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #f43f5e; border-radius:6px; padding:10px;">
                <strong style="color:#fda4af; font-size:0.84rem;">⚔️ Tabla P4: Combate Aéreo y Ametralladora</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Se resuelve si el avión es interceptado por cazas enemigos (Wildcat, P-40, Hurricane). El artillero abre fuego con la ametralladora Tipo 92 de 7.7mm mientras se realizan maniobras evasivas.
                </p>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #f97316; border-radius:6px; padding:10px;">
                <strong style="color:#fdba74; font-size:0.84rem;">💥 Tabla P5: Fuego Antiaéreo (Flak)</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Baterías costeras y artillería antiaérea naval disparan sobre el hidroavión. Puede causar desde metralla leve hasta daños graves o derribo directo.
                </p>
              </div>
              <div style="background:rgba(30,41,59,0.5); border:1px solid #eab308; border-radius:6px; padding:10px;">
                <strong style="color:#fde047; font-size:0.84rem;">💣 Tabla P6: Bombardeo Aéreo de Precisión</strong>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Disponible únicamente en el Círculo de Objetivo si se cargaron bombas. Tirada 1d6 para determinar impactos directos en instalaciones o buques enemigos.
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">🚨 Registro de Daños y Regla de Aborto Obligatorio [Regla 7.17]</h4>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:8px;">
              <div style="background:rgba(234,179,8,0.1); border:1px solid #eab308; border-radius:6px; padding:8px; text-align:center;">
                <strong style="color:#fde047; font-size:0.82rem;">1: Daño Leve</strong>
                <p style="margin:4px 0 0 0; font-size:0.75rem; color:#cbd5e1;">Impactos de metralla o perforaciones leves. El hidroavión mantiene sustentación y puede continuar.</p>
              </div>
              <div style="background:rgba(249,115,22,0.1); border:1px solid #f97316; border-radius:6px; padding:8px; text-align:center;">
                <strong style="color:#fdba74; font-size:0.82rem;">2: Daño Grave</strong>
                <p style="margin:4px 0 0 0; font-size:0.75rem; color:#fdba74; font-weight:bold;">¡ABORTO OBLIGATORIO! El avión debe romper contacto de inmediato y volar directo al amerizaje.</p>
              </div>
              <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; padding:8px; text-align:center;">
                <strong style="color:#fca5a5; font-size:0.82rem;">3: Destruido (KIA)</strong>
                <p style="margin:4px 0 0 0; font-size:0.75rem; color:#cbd5e1;">Derribado por cazas o fuego antiaéreo. Aparato perdido; se resuelven bajas de tripulación.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function renderGuideRecovery(isEn) {
    if (isEn) {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(16,185,129,0.1); border-left:4px solid #10b981; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#34d399; font-size:1.02rem;">⚓ Phase 3: Touchdown &amp; Crane Recovery [Chart P2]</h4>
            <p style="margin:0; font-size:0.86rem; color:#ecfdf5;">
              Following completion of the final approach waypoint, the floatplane heads to the oceanic rendezvous point where the mother submarine idles on the surface awaiting recovery [Rule 7.15 &amp; 7.17.4].
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">🎲 Chart P2 Recovery Resolution (Modified 1d6 Roll)</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fca5a5; font-size:0.86rem;">Modified Roll: 1 – 2 • Aircraft and Crew Lost (MIA / KIA)</strong>
                  <span style="background:#ef4444; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">LOST AT SEA</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Severe ocean swells overturn the floatplane during landing, or fuel exhaustion forces ditching in fog without locating the submarine. Aircraft and crew declared lost.
                </p>
              </div>

              <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#86efac; font-size:0.86rem;">Modified Roll: 3 – 6 • Clean Successful Recovery</strong>
                  <span style="background:#10b981; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">RECOVERED</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Smooth touchdown along the submarine's aft quarter. The deck recovery crane hooks the lifting sling, hoisting the aircraft aboard where it is dismantled and stowed into the hangar.*
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(234,179,8,0.1); border:1px solid var(--gold-400); border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">⚠️ CRITICAL OFFICIAL RULE: INOPERATIVE DECK CRANE</h4>
            <p style="margin:0; font-size:0.84rem; color:#fef08a; line-height:1.5;">
              <strong>* If the Submarine Deck Crane is damaged [Inop]:</strong> The aircrew is safely rescued by rubber dinghy or swimmers, but the floatplane <strong>MUST BE SCUTTLED AND SUNK</strong> in the sea due to technical inability to hoist it aboard before crash-diving!
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">📊 Official Dice Roll Modifiers (DRMs)</h4>
            <ul style="margin:0; padding-left:20px; font-size:0.82rem; color:#cbd5e1; display:flex; flex-direction:column; gap:4px;">
              <li><strong>-1 DRM:</strong> Aircraft Radio Inoperative (mishap on launch with 12).</li>
              <li><strong>-1 DRM:</strong> Submarine Main Radio Transmitter Damaged by prior depth-charging.</li>
              <li><strong>+1 DRM:</strong> Submarine Communications Officer possesses <em>Superior Communications</em> skill [School F2].</li>
            </ul>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(16,185,129,0.1); border-left:4px solid #10b981; padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:#34d399; font-size:1.02rem;">⚓ Fase 3: Amerizaje y Recuperación con Grúa [Tabla P2]</h4>
            <p style="margin:0; font-size:0.86rem; color:#ecfdf5;">
              Al culminar el último sector de aproximación, el hidroavión vuela al punto de encuentro en alta mar donde el submarino nodriza aguarda en superficie con motores al ralentí [Reglas 7.15 y 7.17.4].
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">🎲 Resolución de la Tabla P2 (Tirada 1d6 Modificada)</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#fca5a5; font-size:0.86rem;">Tirada Modificada: 1 – 2 • Avión y Dotación Perdidos (MIA / KIA)</strong>
                  <span style="background:#ef4444; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">PERDIDO EN EL MAR</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Fuerte oleaje hace capotar el hidroavión al tocar el agua, o se agota el combustible en la niebla sin localizar al buque nodriza. Aparato y tripulantes se declaran perdidos en acción.
                </p>
              </div>

              <div style="background:rgba(16,185,129,0.1); border:1px solid #10b981; border-radius:6px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <strong style="color:#86efac; font-size:0.86rem;">Tirada Modificada: 3 – 6 • Recuperación Exitosa Impecable</strong>
                  <span style="background:#10b981; color:#fff; font-size:0.70rem; font-weight:bold; padding:2px 6px; border-radius:3px;">RECUPERADO</span>
                </div>
                <p style="margin:4px 0 0 0; font-size:0.80rem; color:#e2e8f0;">
                  Amerizaje suave junto a la aleta de popa. La grúa de cubierta engancha el arnés de izado, sube el avión a cubierta y los marineros lo desmontan rápidamente para estiba en el hangar cilíndrico.*
                </p>
              </div>
            </div>
          </div>

          <div style="background:rgba(234,179,8,0.1); border:1px solid var(--gold-400); border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">⚠️ REGLA OFICIAL CRÍTICA: GRÚA DE POPA AVERIADA</h4>
            <p style="margin:0; font-size:0.84rem; color:#fef08a; line-height:1.5;">
              <strong>* Si la Grúa de Cubierta está averiada [Inop]:</strong> La dotación aérea es rescatada sana y salva mediante bote o nadadores, pero el hidroavión <strong>DEBE SER BARRENADO Y HUNDIDO</strong> en el mar por imposibilidad técnica de izarlo a bordo antes de sumergirse.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">📊 Modificadores Oficiales de la Tirada (DRMs)</h4>
            <ul style="margin:0; padding-left:20px; font-size:0.82rem; color:#cbd5e1; display:flex; flex-direction:column; gap:4px;">
              <li><strong>-1 DRM:</strong> Radio del Hidroavión Inoperativa (despegue con 12).</li>
              <li><strong>-1 DRM:</strong> Radio Principal del Submarino Averiada por cargas de profundidad previas.</li>
              <li><strong>+1 DRM:</strong> Oficial de Comunicaciones posee Habilidad <em>Comunicaciones Superiores</em> [Escuela F2].</li>
            </ul>
          </div>
        </div>
      `;
    }
  }

  function renderGuideFaq(isEn) {
    if (isEn) {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(234,179,8,0.1); border-left:4px solid var(--gold-400); padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-300); font-size:1.02rem;">⭐ Campaign Rewards &amp; Tactical FAQ [Rule 7.13]</h4>
            <p style="margin:0; font-size:0.86rem; color:#fef08a;">
              Successfully executing an aerial reconnaissance or bombing mission provides major campaign credit towards victory point tallies.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">🎖️ Special Mission Success Bonus (+2 Patrols) [Rule 7.13]</h4>
            <p style="margin:0 0 10px 0; font-size:0.84rem; color:#cbd5e1;">
              When the floatplane completes its target reconnaissance or bombing mission and the crew returns with intelligence data aboard the submarine:
            </p>
            <div style="background:rgba(30,41,59,0.6); border:1px solid var(--gold-400); border-radius:6px; padding:10px; display:flex; align-items:center; gap:12px;">
              <span style="font-size:1.8rem;">⭐</span>
              <div style="font-size:0.86rem; color:#fde047; font-weight:bold;">
                You are awarded an official bonus of +2 Completed Patrols towards campaign victory requirements!
              </div>
            </div>
            <p style="margin:8px 0 0 0; font-size:0.80rem; color:#94a3b8;">
              In the UI, click the golden button <em>«⭐ Claim Special Mission Reward (+2 Patrols Rule 7.13)»</em> to automatically record this bonus in your logbook (*Rogu Bukku*).
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">❓ Frequently Asked Tactical Questions (FAQ)</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">Q: Can I launch the floatplane during a surface naval battle?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  No. Topside wing assembly and catapult warm-up require calm, unmolested surface conditions upon entering the patrol area before combat commences.
                </p>
              </div>
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">Q: What happens if the pilot is Seriously Wounded (SW)?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  The navigator/gunner assumes emergency flight controls, but suffers an additional -2 DRM to the Chart P2 touchdown recovery roll.
                </p>
              </div>
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">Q: Can I replace a lost or scuttled floatplane?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Yes, replacement aircraft and newly trained aircrew can be requested during refit at naval bases in Kure or Yokosuka [Phase 5 Refit].
                </p>
              </div>
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">Q: How do the School F3 air skills work?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  You can equip up to 2 active skills: <em>Weapons Expert</em> (+1 to bombing damage P6), <em>Flawless Maintenance</em> (reroll catapult mishap), <em>A.C.M.</em> (+1 to air combat evasions P4), and <em>Aerial Navigation</em> (+1 to P2 recovery).
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(234,179,8,0.1); border-left:4px solid var(--gold-400); padding:12px 14px; border-radius:4px;">
            <h4 style="margin:0 0 6px 0; color:var(--gold-300); font-size:1.02rem;">⭐ Recompensas de Campaña y FAQ Táctica [Regla 7.13]</h4>
            <p style="margin:0; font-size:0.86rem; color:#fef08a;">
              Completar con éxito una misión de reconocimiento aéreo o bombardeo estratégico otorga un importante cómputo para la victoria en la campaña.
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 8px 0; color:#38bdf8; font-size:0.95rem; text-transform:uppercase;">🎖️ Bonificación por Éxito de Misión Especial (+2 Patrullas) [Regla 7.13]</h4>
            <p style="margin:0 0 10px 0; font-size:0.84rem; color:#cbd5e1;">
              Cuando el hidroavión completa su misión de reconocimiento u objetivo de bombardeo y la tripulación regresa con la información de inteligencia a bordo del submarino:
            </p>
            <div style="background:rgba(30,41,59,0.6); border:1px solid var(--gold-400); border-radius:6px; padding:10px; display:flex; align-items:center; gap:12px;">
              <span style="font-size:1.8rem;">⭐</span>
              <div style="font-size:0.86rem; color:#fde047; font-weight:bold;">
                ¡Se otorga una bonificación oficial de +2 Patrullas cumplidas para el cómputo final de la campaña naval!
              </div>
            </div>
            <p style="margin:8px 0 0 0; font-size:0.80rem; color:#94a3b8;">
              En la aplicación, pulsa el botón dorado <em>«⭐ RECLAMAR ÉXITO DE MISIÓN ESPECIAL (+2 PATRULLAS REGLA 7.13)»</em> para registrar automáticamente este crédito en el cuaderno de bitácora (*Rogu Bukku*).
            </p>
          </div>

          <div style="background:rgba(15,23,42,0.8); border:1px solid #334155; border-radius:8px; padding:14px;">
            <h4 style="margin:0 0 10px 0; color:var(--gold-400); font-size:0.95rem; text-transform:uppercase;">❓ Preguntas Frecuentes Tácticas (FAQ)</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">P: ¿Puedo lanzar el hidroavión durante un combate de superficie en curso?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  No. El ensamblaje de alas en cubierta y la presurización de la catapulta exigen condiciones de mar en calma y ausencia de hostigamiento al entrar en la casilla de Misión.
                </p>
              </div>
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">P: ¿Qué ocurre si el piloto resulta Gravemente Herido (SW)?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  El artillero/observador asume los mandos de emergencia, pero sufre un penalizador adicional de -2 DRM a la tirada de amerizaje en la Tabla P2.
                </p>
              </div>
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">P: ¿Se puede reponer un hidroavión destruido o barrenado?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Sí, durante el reacondicionamiento en bases navales metropolitanas (Kure o Yokosuka) en la Fase 5 Refit se puede asignar un aparato de reemplazo y dotación de refresco.
                </p>
              </div>
              <div>
                <strong style="color:#7dd3fc; font-size:0.84rem;">P: ¿Cómo funcionan las habilidades F3 de dotación aérea?</strong>
                <p style="margin:2px 0 0 0; font-size:0.80rem; color:#cbd5e1;">
                  Se pueden equipar hasta 2 habilidades activas: <em>Weapons Expert</em> (+1 a daños de bombardeo P6), <em>Flawless Maintenance</em> (repetir percance en catapulta), <em>A.C.M.</em> (+1 en combate aéreo P4) y <em>Aerial Navigation</em> (+1 en amerizaje P2).
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Exportar al objeto global
  
  // Dedicated capture keydown listener for Escape on Aircraft Display Mat
  document.addEventListener('keydown', function(e) {
    if (e.defaultPrevented) return; // If topmost viewer or another modal already consumed Esc, do not close mat
    if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27 || e.which === 27) {
      // If a sub-modal was closed within 400ms, do NOT close parent aircraft mat
      if (Date.now() - (window._lastSubModalClosedTime || 0) < 400) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }
      const guideModal = document.getElementById('modal-aircraft-guide');
      if (guideModal && guideModal.style.display !== 'none' && window.getComputedStyle(guideModal).display !== 'none') {
        window._lastSubModalClosedTime = Date.now();
        closeAirModuleGuideModal();
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }
      const mv = document.getElementById('modal-viewer');
      if (mv && mv.style.display !== 'none' && window.getComputedStyle(mv).display !== 'none') {
        window._lastSubModalClosedTime = Date.now();
        return;
      }
      const modal = document.getElementById('modal-aircraft-display-mat');
      if (modal && modal.style.display !== 'none' && window.getComputedStyle(modal).display !== 'none') {
        closeAircraftDisplayMatModal();
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }, true);

  window.openAirModuleGuideModal = openAirModuleGuideModal;
  window.closeAirModuleGuideModal = closeAirModuleGuideModal;
  window.switchAirGuideTab = switchAirGuideTab;

  window.AIRCRAFT_INFO_DATABASE = AIRCRAFT_INFO_DATABASE;
  window.aircraftState = aircraftState;
  window.handleAirSlotClick = handleAirSlotClick;
  window.handleAirDamageClick = handleAirDamageClick;
  window.handleAirCrewClick = handleAirCrewClick;
  window.handleAirSkillClick = handleAirSkillClick;
  window.selectAircraftSlot = selectAircraftSlot;
  window.openAircraftDisplayMatModal = openAircraftDisplayMatModal;
  window.closeAircraftDisplayMatModal = closeAircraftDisplayMatModal;
  window.rollAircraftCatapultLaunch = rollAircraftCatapultLaunch;
  window.selectP1LaunchOutcome = selectP1LaunchOutcome;
  window.rerollLaunchWithFlawlessMaint = rerollLaunchWithFlawlessMaint;
  window.rollAircraftRecovery = rollAircraftRecovery;
  window.selectP2RecoveryOutcome = selectP2RecoveryOutcome;
  window.claimAirSpecialMissionReward = claimAirSpecialMissionReward;
  window.renderAircraftMatUI = renderAircraftMatUI;
  window.toggleBoardSubOrAir = toggleBoardSubOrAir;
  window.selectAircraftMap = selectAircraftMap;
  window.openAirMapFullscreen = openAirMapFullscreen;
  window.switchAirPhaseTab = switchAirPhaseTab;
  window.selectFlightCircle = selectFlightCircle;
  window.nextFlightCircle = nextFlightCircle;
  window.prevFlightCircle = prevFlightCircle;
  window.rollAirCircleEncounter = rollAirCircleEncounter;
  window.rollAirBombing = rollAirBombing;
  window.syncAircraftStateToSubBoard = syncAircraftStateToSubBoard;
  window.syncSubBoardToAircraftState = syncSubBoardToAircraftState;
  window.zoomAircraftMap = zoomAircraftMap;
  window.resetAircraftMapZoom = resetAircraftMapZoom;
  window.toggleAircraftInspectorCollapse = toggleAircraftInspectorCollapse;
  window.toggleAirTheaterMode = toggleAirTheaterMode;
  window.clearAirFlightLog = clearAirFlightLog;

  document.addEventListener('DOMContentLoaded', () => {
    if (window.campaignState && window.campaignState.aircraftState) {
      aircraftState = window.campaignState.aircraftState;
    }
  });

})();
