// =========================================================================
// SENSUiKAN: CANONICAL SUBMARINE PLAYER BOARD (HOJA COMPLETA DE SUBMARINO)
// Interactive 2-Layer Board: Full Card + 3D Double-Layer Overlay + Active Tokens
// =========================================================================

let canonicalSlotsData = (typeof CANONICAL_SLOTS_DATA !== 'undefined') ? CANONICAL_SLOTS_DATA : ((typeof window !== 'undefined' && window.CANONICAL_SLOTS_DATA) ? window.CANONICAL_SLOTS_DATA : null);
let currentBoardSubKey = null;
let boardDisplayMode = "paper"; // "paper" or "3d"

let subBoardState = {
  activeSubKey: null,
  patrolIndex: -1, // -1 = Moored in Port (En Puerto [slot-base-port])
  flooding: 0,
  hullDamage: 0,
  crew: {
    "capt": "active",
    "eng": "active",
    "xo": "active",
    "nav": "active",
    "med": "active",
    "spec": "active",
    "crew-1": "active",
    "crew-2": "active",
    "crew-3": "active",
    "crew-4": "active",
    "crew-5": "active"
  },
  crewQuality: "trained", // "green", "trained", "veteran", "elite"
  systems: {
    "f-doors": false,
    "aft-doors": false,
    "periscope": false,
    "radio": false,
    "diesel": false,
    "elec": false,
    "fuel": false,
    "batteries": false
  },
  tubes: {
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true
  },
  tubeTypes: {
    1: 'type92', 2: 'type92', 3: 'type92', 4: 'type92', 5: 'type92', 6: 'type92', 7: 'type95', 8: 'type95'
  },
  reloads: {
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true, 8: true,
    9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true, 16: true
  },
  reloadTypes: {
    1: 'type95', 2: 'type95', 3: 'type95', 4: 'type95', 5: 'type95', 6: 'type95', 7: 'type95', 8: 'type95',
    9: 'type95', 10: 'type95', 11: 'type95', 12: 'type95', 13: 'type95', 14: 'type95', 15: 'type95', 16: 'type95',
    'aft_1': 'type95', 'aft_2': 'type95'
  },
  torpedoAllocation: {
    fwdT92: 4,
    aftT92: 2
  },
  deckGunDamaged: false,
  aaGunDamaged: false,
  ammo: 5,
  aircraftDamaged: false,
  aircraftDamaged2: false,
  events: {
    1: false,
    2: false
  }
};
if (typeof window !== 'undefined') {
  window.subBoardState = subBoardState;
  window.currentBoardSubKey = currentBoardSubKey;
}

function getLocalizedCrewRole(key, isEn) {
  switch (key) {
    case 'capt': return isEn ? 'Captain' : 'Comandante';
    case 'eng': return isEn ? 'Chief Engineer' : 'Jefe de Máquinas';
    case 'xo': return isEn ? 'Executive Officer (XO)' : 'Segundo Oficial (XO)';
    case 'med': return isEn ? 'Medical Officer' : 'Oficial Médico';
    case 'nav': return isEn ? 'Navigator' : 'Navegante';
    case 'spec': return isEn ? 'Special Pilot / Crew' : 'Piloto / Dotación Especial';
    case 'crew-1': return isEn ? 'Crew #1' : 'Dotación #1';
    case 'crew-2': return isEn ? 'Crew #2' : 'Dotación #2';
    case 'crew-3': return isEn ? 'Crew #3' : 'Dotación #3';
    case 'crew-4': return isEn ? 'Crew #4' : 'Dotación #4';
    case 'crew-5': return isEn ? 'Crew #5' : 'Dotación #5';
    default: return key;
  }
}
window.getLocalizedCrewRole = getLocalizedCrewRole;

function applySubmarineDamage(payload = {}) {
  if (typeof subBoardState === 'undefined') return [];

  const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
  const reports = [];

  // 1. Hull Damage
  if (typeof payload.hullDamage === 'number' && payload.hullDamage > 0) {
    const prevHull = subBoardState.hullDamage || 0;
    const dmgCap = (typeof getSubmarineDamageCapacity === 'function') 
      ? getSubmarineDamageCapacity(currentBoardSubKey) 
      : { hull: 7 };
    subBoardState.hullDamage = Math.min(dmgCap.hull, prevHull + payload.hullDamage);
    reports.push(isEn 
      ? `💥 +${payload.hullDamage} Hull Damage (Total: ${subBoardState.hullDamage}/${dmgCap.hull})`
      : `💥 +${payload.hullDamage} Daño de Casco (Total: ${subBoardState.hullDamage}/${dmgCap.hull})`);

    if (subBoardState.hullDamage >= dmgCap.hull) {
      reports.push(isEn ? `💀 Hull Breached! SUBMARINE SUNK!` : `💀 ¡Casco quebrado! ¡SUBMARINO HUNDIDO!`);
      if (typeof campaignState !== 'undefined') campaignState.isGameOver = true;
    }
  }

  // 2. Flooding
  if (typeof payload.flooding === 'number' && payload.flooding > 0) {
    const prevFlood = subBoardState.flooding || 0;
    subBoardState.flooding = Math.min(8, prevFlood + payload.flooding);
    reports.push(isEn 
      ? `💧 +${payload.flooding} Flooding (Total: ${subBoardState.flooding}/8)`
      : `💧 +${payload.flooding} Inundación (Total: ${subBoardState.flooding}/8)`);
    if (subBoardState.flooding >= 8) {
      reports.push(isEn ? `🌊 Catastrophic Flooding! Submarine lost or forced to scuttle.` : `🌊 ¡Inundación catastrófica! Submarino inundado o forzado a barrenar.`);
    }
  }

  // 3. Crew Injury
  if (payload.crewInjury) {
    const { roleKey, severity } = payload.crewInjury;
    let slotKey = roleKey;
    if (roleKey === 'captain' || roleKey === 'capt') slotKey = 'capt';
    else if (roleKey === 'engineer' || roleKey === 'eng') slotKey = 'eng';
    else if (roleKey === 'exec' || roleKey === 'xo') slotKey = 'xo';
    else if (roleKey === 'medic' || roleKey === 'med') slotKey = 'med';
    else if (roleKey === 'navigator' || roleKey === 'nav') slotKey = 'nav';
    else if (roleKey === 'pilot' || roleKey === 'spec') slotKey = 'spec';
    else if (roleKey === 'crew') {
      const genSlots = ['crew-1', 'crew-2', 'crew-3', 'crew-4', 'crew-5'];
      slotKey = genSlots.find(k => subBoardState.crew && subBoardState.crew[k] !== 'kia') || 'crew-1';
    }
    
    if (slotKey && subBoardState.crew && subBoardState.crew[slotKey] !== undefined) {
      const prevStatus = subBoardState.crew[slotKey] || 'active';
      let newStatus = 'active';
      let isAccumulated = false;
      let accumMsg = '';

      if (severity === 'KIA') {
        newStatus = 'kia';
      } else if (severity === 'SW') {
        if (prevStatus === 'serious') {
          newStatus = 'kia';
          isAccumulated = true;
          accumMsg = isEn ? 'Rule 8.6 Cumulative: 2x SW = KIA!' : '¡Regla 8.6 Acumulativa: 2x HG = KIA (Baja Mortal)!';
        } else if (prevStatus === 'wounded') {
          newStatus = 'serious';
          isAccumulated = true;
          accumMsg = isEn ? 'Rule 8.6 Cumulative: LW + SW = SW (Incapacitated)' : '¡Regla 8.6 Acumulativa: HL + HG = HG (Herida Grave)!';
        } else {
          newStatus = 'serious';
        }
      } else { // LW
        if (prevStatus === 'wounded') {
          newStatus = 'serious';
          isAccumulated = true;
          accumMsg = isEn ? 'Rule 8.6 Cumulative: 2x LW = SW (Incapacitated)!' : '¡Regla 8.6 Acumulativa: 2x HL = HG (Herida Grave)!';
        } else if (prevStatus === 'serious') {
          newStatus = 'kia';
          isAccumulated = true;
          accumMsg = isEn ? 'Rule 8.6 Cumulative: SW + LW = KIA!' : '¡Regla 8.6 Acumulativa: HG + HL = KIA (Baja Mortal)!';
        } else {
          newStatus = 'wounded';
        }
      }

      subBoardState.crew[slotKey] = newStatus;
      const roleLabel = getLocalizedCrewRole(slotKey, isEn);
      const sevLabel = (newStatus === 'kia') ? (isEn ? 'KIA (Dead)' : 'KIA (Baja)') : (newStatus === 'serious' ? (isEn ? 'SW (Serious)' : 'SW (Grave)') : (isEn ? 'LW (Wounded)' : 'LW (Leve)'));
      
      const fullReport = isAccumulated ? `🩺 ${roleLabel}: ${sevLabel} (${accumMsg})` : `🩺 ${roleLabel}: ${sevLabel}`;
      reports.push(fullReport);

      payload.injuryResult = {
        slotKey,
        roleLabel,
        prevStatus,
        newStatus,
        isAccumulated,
        accumMsg,
        sevLabel
      };

      if (typeof campaignState !== 'undefined') {
        campaignState.crewInjuries = campaignState.crewInjuries || {};
        if (newStatus === 'serious' || newStatus === 'kia') {
          campaignState.crewInjuries[slotKey] = true;
          if (slotKey === 'capt') campaignState.commanderIncapacitated = true;
          if (slotKey === 'eng') campaignState.engineerIncapacitated = true;
        }
        const allGenericSW = ['crew-1', 'crew-2', 'crew-3', 'crew-4', 'crew-5'].every(k => 
          subBoardState.crew[k] === 'serious' || subBoardState.crew[k] === 'kia'
        );
        campaignState.crewAllInjured = allGenericSW;
      }
    }
  }

  // 4. Systems Damaged
  if (payload.systemsDamaged) {
    const list = Array.isArray(payload.systemsDamaged) ? payload.systemsDamaged : [payload.systemsDamaged];
    subBoardState.systems = subBoardState.systems || {};
    list.forEach(item => {
      if (!item) return;
      const str = String(item);
      if (str === 'deck_gun' || str === 'deck-gun' || str.includes('Deck Gun') || str.includes('Cañón')) {
        subBoardState.deckGunDamaged = true;
        reports.push(isEn ? '🛠️ Deck Gun: Damaged' : '🛠️ Cañón Principal: Averiado');
      } else if (str === 'aa_guns' || str === 'aa' || str === 'aa-guns' || str.includes('AA Gun') || str.includes('Antiaéreo')) {
        subBoardState.aaGunDamaged = true;
        reports.push(isEn ? '🛠️ AA Gun: Damaged' : '🛠️ Antiaéreo: Averiado');
      } else if (str === 'floatplane' || str === 'aircraft' || str === 'hangar' || str.includes('Hangar') || str.includes('Crane') || str.includes('Grúa')) {
        subBoardState.aircraftDamaged = true;
        subBoardState.systems['hangar'] = 'dmg';
        reports.push(isEn ? '🛠️ Floatplane Hangar: Damaged' : '🛠️ Hangar Hidroavión: Averiado');
      } else {
        const sysKey = (typeof getSystemKey === 'function') ? getSystemKey(str) : str;
        if (sysKey) {
          subBoardState.systems[sysKey] = 'dmg';
          reports.push(isEn ? `🛠️ System Damaged: ${sysKey}` : `🛠️ Sistema Averiado: ${sysKey}`);
        }
      }
    });
  }

  // 5. Direct Sinking
  if (payload.isSunk) {
    const dmgCap = (typeof getSubmarineDamageCapacity === 'function') 
      ? getSubmarineDamageCapacity(currentBoardSubKey) 
      : { hull: 7 };
    subBoardState.hullDamage = dmgCap.hull;
    reports.push(isEn ? '💀 Catastrophic Loss: SUBMARINE SUNK!' : '💀 Pérdida Catastrófica: ¡SUBMARINO HUNDIDO!');
    if (typeof campaignState !== 'undefined') campaignState.isGameOver = true;
  }

  // 6. Centralized Save
  saveSubBoardState();
  if (typeof saveState === 'function') saveState();

  // 7. Clean Re-render of Sub Board & Slots
  if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();

  // 8. Toast Feedback
  if (reports.length > 0 && !payload.silent && typeof showToast === 'function') {
    showToast(reports.join(' • '));
  }

  return reports;
}
window.applySubmarineDamage = applySubmarineDamage;

function applySubmarineRepair(payload = {}) {
  if (typeof subBoardState === 'undefined') return [];
  const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
  const reports = [];

  if (payload.systemRepaired) {
    const sys = payload.systemRepaired;
    if (sys === 'deck_gun') {
      subBoardState.deckGunDamaged = false;
      reports.push(isEn ? '✅ Deck Gun: Repaired (Operational)' : '✅ Cañón principal: Reparado (Operativo)');
    } else if (sys === 'aa_guns') {
      subBoardState.aaGunDamaged = false;
      reports.push(isEn ? '✅ AA Guns: Repaired (Operational)' : '✅ Antiaéreo: Reparado (Operativo)');
    } else if (sys === 'hangar' || sys === 'crane') {
      subBoardState.aircraftDamaged = false;
      subBoardState.aircraftDamaged2 = false;
      if (subBoardState.systems) subBoardState.systems[sys] = false;
      reports.push(isEn ? '✅ Hangar/Crane: Repaired' : '✅ Hangar/Grúa: Reparado');
    } else {
      const key = (typeof getSystemKey === 'function') ? getSystemKey(sys) : sys;
      if (subBoardState.systems) {
        subBoardState.systems[key] = false;
        reports.push(isEn ? `✅ System Repaired: ${key}` : `✅ Sistema Reparado: ${key}`);
      }
    }
  }

  if (payload.systemInop) {
    const sys = payload.systemInop;
    if (sys === 'deck_gun') {
      reports.push(isEn ? '❌ Deck Gun: INOP' : '❌ Cañón principal: INOP');
    } else if (sys === 'aa_guns') {
      reports.push(isEn ? '❌ AA Guns: INOP' : '❌ Antiaéreo: INOP');
    } else {
      const key = (typeof getSystemKey === 'function') ? getSystemKey(sys) : sys;
      if (subBoardState.systems) {
        subBoardState.systems[key] = 'inop';
        reports.push(isEn ? `❌ System INOP: ${key}` : `❌ Sistema marcado INOP: ${key}`);
      }
    }
  }

  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();

  if (reports.length > 0 && typeof showToast === 'function') {
    showToast(reports.join(' • '));
  }
  return reports;
}
window.applySubmarineRepair = applySubmarineRepair;

const SUB_COUNTER_CHITS = {
  "Kaidai_KD3_Class": "Submarine - KD.3.jpg",
  "Kaidai_KD4_Class": "Submarine - KD.4.jpg",
  "Kaidai_KD5_Class": "Submarine - KD.5.jpg",
  "Kaidai_KD6_Class": "Submarine - KD.6.jpg",
  "Kaidai_KD7_Class": "Submarine - KD.7.jpg",
  "Kirai_Sen_Class": "Submarine - Kirai-Sen.jpg",
  "Junsen_J_IM_Class": "Submarine - Junsen J1M.jpg",
  "Junsen_J2_Class": "Submarine - Junsen J2.jpg",
  "Junsen_J3_Class": "Submarine - Junsen J3.jpg",
  "Type_A_Class": "Submarine - Type A.jpg",
  "Type_B_Class": "Submarine - Type B.jpg",
  "Type_B_3_Class": "Submarine - Type B.3.jpg",
  "Type_C_Class": "Submarine - Type C.jpg",
  "Type_A_Modified": "Submarine - Type A(M).jpg",
  "Sen_Toku_Class": "Submarine - Sen-Toku.jpg",
  "Sen_Taka_Class": "Submarine - Sen-Taka.jpg",
  "Type_C3_Class": "Submarine - Type C.3.jpg",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Submarine - Midget.jpg",
  "Type_B2_Class": "Submarine - Type B.2.jpg",
  "Type_C2_Class": "Submarine - Type C.2.jpg",
  "Type_A2_Class": "Submarine - Type A.2.jpg",
  "Type_D1_Class": "Submarine - Type D.1.jpg",
  "Kaichu_VII_Class": "Submarine - Kaichu VII.jpg",
  "Junsen_J1_Class": "Submarine - Junsen J1.jpg"
};

const TORPEDO_CHIT_MAP = {
  "type95": "Type 95 - Oxygen.jpg",
  "type92": "Type 92 - Electric.jpg",
  "type6": "Type 6 - Steam.jpg",
  "type89": "Type 89 - Steam.jpg",
  "type97": "Type 97 - Oxygen.jpg",
  "mine": "Type 88 Mine.jpg",
  "lance": "Torpedo Tube.jpg"
};

function getTorpedoTypeLabel(typeKey, isEn) {
  switch (typeKey) {
    case 'type92': return isEn ? 'Type 92 (Electric)' : 'Tipo 92 (Eléctrico)';
    case 'type6': return isEn ? 'Type 6 (Steam)' : 'Tipo 6 (Vapor)';
    case 'type89': return isEn ? 'Type 89 (Steam)' : 'Tipo 89 (Vapor)';
    case 'type97': return isEn ? 'Type 97 (Midget Oxygen)' : 'Tipo 97 (Oxígeno)';
    case 'mine': return isEn ? 'Type 88 Naval Mine' : 'Mina Naval Tipo 88';
    case 'type95':
    default:
      return isEn ? 'Type 95 (Oxygen)' : 'Tipo 95 (Oxígeno)';
  }
}

function getTorpedoChit(typeKey, isReload = false) {
  if (typeKey === 'type92') return 'Type 92 - Electric.jpg';
  if (typeKey === 'type6') return 'Type 6 - Steam.jpg';
  if (typeKey === 'type89') return 'Type 89 - Steam.jpg';
  if (typeKey === 'type97') return 'Type 97 - Oxygen.jpg';
  if (typeKey === 'mine') return 'Type 88 Mine.jpg';
  return 'Type 95 - Oxygen.jpg';
}

const SUB_SYSTEMS_MAP = {
  "Kaidai_KD3_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
    "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
    "Periscope", null, null, null
  ],
  "Kaidai_KD4_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
    "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
    "Periscope", null, null, null
  ],
  "Kaidai_KD5_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
    "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
    "Periscope", null, null, null
  ],
  "Kaidai_KD6_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
    "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
    "Periscope", null, null, null
  ],
  "Kaidai_KD7_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
    "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
    null, null, null, null
  ],
  "Kirai_Sen_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes", "Radio",
    "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
    "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
    null, null, null, null
  ],
  "Junsen_J_IM_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
    "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
    "Periscope", null, null, null
  ],
  "Junsen_J2_Class": [
    "Crane", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1",
    "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
    "Hydrophones", "Batteries", "Periscope", null
  ],
  "Junsen_J3_Class": [
    "Crane", "Aft Torp Doors", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_A_Class": [
    "Crane", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_B_Class": [
    "Radio", "Dive Planes", "Hangar", "Crane",
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_B_3_Class": [
    "Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
    "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
    "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
    "Hydrophones", "Batteries", "Periscope", null
  ],
  "Type_C_Class": [
    "Type 22 Radar", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_C3_Class": [
    "Type 22 Radar", "Cargo", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_A_Modified": [
    "Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
    "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
    "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
    "Hydrophones", "Batteries", "Periscope", null
  ],
  "Sen_Toku_Class": [
    "Crane", "Hangar", "Radio", "Periscope",
    "Hydrophones", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes",
    "Batteries", "Fuel Tanks", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Diesel Engine 3", "Diesel Engine 4"
  ],
  "Sen_Taka_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Electric Motor 1", "Electric Motor 2", "Electric Motor 3", "Electric Motor 4",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries 1", "Batteries 2", "Batteries 3", "Periscope"
  ],
  "Type_A_Midget_Submarine___Ko_Hyoteki": [
    "Fwd Battery", "Aft Battery", "Wire Cutters", "Gyro Compass",
    "Propeller", "Electric Motor", "Horiz. Rudder", "Vertical Rudder",
    "Radio", "Hydrophones", "Periscope", null,
    null, null, null, null
  ],
  "Type_B2_Class": [
    "Radio", "Dive Planes", "Hangar", "Crane",
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_C2_Class": [
    "Type 22 Radar", null, "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Type_A2_Class": [
    "Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
    "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
    "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
    "Hydrophones", "Batteries", "Periscope", null
  ],
  "Type_D1_Class": [
    "Cargo", null, "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
    "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
    "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
    "Batteries", "Periscope", null, null
  ],
  "Kaichu_VII_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
    "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
    null, null, null, null
  ],
  "Junsen_J1_Class": [
    "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
    "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
    "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
    "Periscope", null, null, null
  ]
};

function getSystemKey(sysName) {
  if (!sysName) return null;
  const s = sysName.toLowerCase();
  if (s.includes('odd') || s.includes('impar')) return 'f-doors-odd';
  if (s.includes('even') || s.includes('par')) return 'f-doors-even';
  if ((s.includes('aft') && s.includes('door')) || (s.includes('popa') && (s.includes('compuerta') || s.includes('torpedo')))) return 'aft-doors';
  if (s.includes('f. torp') || s.includes('fwd door') || s.includes('f. door') || (s.includes('proa') && (s.includes('compuerta') || s.includes('torpedo')))) return 'f-doors';
  if (s.includes('radio')) return 'radio';
  if (s.includes('dive plane') || s.includes('inmersi') || s.includes('profundidad')) return 'dive-planes';
  if (s.includes('hydrophone') || s.includes('hidr')) return 'hydrophones';
  if (s.includes('periscope') || s.includes('periscop')) return 'periscope';
  if (s.includes('fuel') || s.includes('combustible')) return 'fuel';
  if (s.includes('radar')) return 'radar';
  if (s.includes('hangar')) return 'hangar';
  if (s.includes('crane') || s.includes('grúa') || s.includes('grua')) return 'crane';
  if (s.includes('cargo') || s.includes('bodega')) return 'cargo';
  if (s.includes('wire cutter') || s.includes('cortacables')) return 'wire-cutters';
  if (s.includes('gyro') || s.includes('giroscop')) return 'gyro-compass';
  if (s.includes('propeller') || s.includes('hélice') || s.includes('helice')) return 'propeller';
  if (s.includes('horiz') && (s.includes('rudder') || s.includes('timon') || s.includes('timón'))) return 'horiz-rudder';
  if (s.includes('vert') && (s.includes('rudder') || s.includes('timon') || s.includes('timón'))) return 'vert-rudder';
  if (s.includes('fwd battery') || s.includes('batería de proa')) return 'fwd-battery';
  if (s.includes('aft battery') || s.includes('batería de popa')) return 'aft-battery';
  if (s.includes('batteries 1') || s.includes('baterías 1') || s.includes('batería 1')) return 'batteries-1';
  if (s.includes('batteries 2') || s.includes('baterías 2') || s.includes('batería 2')) return 'batteries-2';
  if (s.includes('batteries 3') || s.includes('baterías 3') || s.includes('batería 3')) return 'batteries-3';
  if (s.includes('batter') || s.includes('baterí')) return 'batteries';
  if ((s.includes('diesel') || s.includes('diésel')) && s.includes('1')) return 'diesel-1';
  if ((s.includes('diesel') || s.includes('diésel')) && s.includes('2')) return 'diesel-2';
  if ((s.includes('diesel') || s.includes('diésel')) && s.includes('3')) return 'diesel-3';
  if ((s.includes('diesel') || s.includes('diésel')) && s.includes('4')) return 'diesel-4';
  if (s.includes('diesel') || s.includes('diésel')) return 'diesel';
  if ((s.includes('electric') || s.includes('eléctric') || s.includes('electrico')) && s.includes('1')) return 'elec-1';
  if ((s.includes('electric') || s.includes('eléctric') || s.includes('electrico')) && s.includes('2')) return 'elec-2';
  if ((s.includes('electric') || s.includes('eléctric') || s.includes('electrico')) && s.includes('3')) return 'elec-3';
  if ((s.includes('electric') || s.includes('eléctric') || s.includes('electrico')) && s.includes('4')) return 'elec-4';
  if (s.includes('electric') || s.includes('eléctric') || s.includes('electrico')) return 'elec';
  return s.replace(/[^a-z0-9]+/g, '-');
}

function getLocalizedSystemName(sysName, lang) {
  if (!sysName) return "";
  const isEn = (lang === 'en');
  const translations = {
    "F. Torp. Doors (Odd)": { es: "Compuertas Proa (Impares)", en: "Fwd Torp Doors (Odd)" },
    "F. Torp. Doors (Even)": { es: "Compuertas Proa (Pares)", en: "Fwd Torp Doors (Even)" },
    "Aft Torp Doors": { es: "Compuertas Popa", en: "Aft Torp Doors" },
    "Radio": { es: "Radio", en: "Radio" },
    "Dive Planes": { es: "Timones de Profundidad", en: "Dive Planes" },
    "Electric Motor 1": { es: "Motor Eléctrico #1", en: "Electric Motor #1" },
    "Electric Motor 2": { es: "Motor Eléctrico #2", en: "Electric Motor #2" },
    "Electric Motor 3": { es: "Motor Eléctrico #3", en: "Electric Motor #3" },
    "Electric Motor 4": { es: "Motor Eléctrico #4", en: "Electric Motor #4" },
    "Diesel Engine 1": { es: "Motor Diésel #1", en: "Diesel Engine #1" },
    "Diesel Engine 2": { es: "Motor Diésel #2", en: "Diesel Engine #2" },
    "Diesel Engine 3": { es: "Motor Diésel #3", en: "Diesel Engine #3" },
    "Diesel Engine 4": { es: "Motor Diésel #4", en: "Diesel Engine #4" },
    "Fuel Tanks": { es: "Tanques de Combustible", en: "Fuel Tanks" },
    "Hydrophones": { es: "Hidrófonos", en: "Hydrophones" },
    "Batteries": { es: "Baterías", en: "Batteries" },
    "Batteries 1": { es: "Baterías #1", en: "Batteries #1" },
    "Batteries 2": { es: "Baterías #2", en: "Batteries #2" },
    "Batteries 3": { es: "Baterías #3", en: "Batteries #3" },
    "Periscope": { es: "Periscopio", en: "Periscope" },
    "Hangar": { es: "Hangar de Hidroavión", en: "Aircraft Hangar" },
    "Crane": { es: "Grúa de Hidroavión", en: "Aircraft Crane" },
    "Type 22 Radar": { es: "Radar Tipo 22", en: "Type 22 Radar" },
    "Cargo": { es: "Bodega de Carga", en: "Cargo Hold" },
    "Fwd Battery": { es: "Batería de Proa", en: "Fwd Battery" },
    "Aft Battery": { es: "Batería de Popa", en: "Aft Battery" },
    "Wire Cutters": { es: "Cortacables", en: "Wire Cutters" },
    "Gyro Compass": { es: "Girocompás", en: "Gyro Compass" },
    "Propeller": { es: "Hélice", en: "Propeller" },
    "Electric Motor": { es: "Motor Eléctrico", en: "Electric Motor" },
    "Horiz. Rudder": { es: "Timón Horizontal", en: "Horiz. Rudder" },
    "Vertical Rudder": { es: "Timón Vertical", en: "Vertical Rudder" }
  };
  const match = translations[sysName];
  if (match) return isEn ? match.en : match.es;
  return sysName;
}

const SYSTEM_CHIT_MAP = {
  "f-doors-odd": { dmg: "Damage - Fwd Torp.jpg", inop: "Inop - Fwd Torp.jpg" },
  "f-doors-even": { dmg: "Damage - Fwd Torp.jpg", inop: "Inop - Fwd Torp.jpg" },
  "f-doors": { dmg: "Damage - Fwd Torp.jpg", inop: "Inop - Fwd Torp.jpg" },
  "aft-doors": { dmg: "Damage - Aft Torp.jpg", inop: "Inop - Aft Torp.jpg" },
  "periscope": { dmg: "Damage - Periscope.jpg", inop: "Inop - Periscope.jpg" },
  "radio": { dmg: "Damage - Radio.jpg", inop: "Inop - Radio.jpg" },
  "dive-planes": { dmg: "Damage - Dive Plane.jpg", inop: "Inop - Dive Plane.jpg" },
  "hydrophones": { dmg: "Damage.jpg", inop: "Inop.jpg" },
  "radar": { dmg: "Damage.jpg", inop: "Inop.jpg" },
  "diesel-1": { dmg: "Damage - Diesel.jpg", inop: "Inop - Diesel.jpg" },
  "diesel-2": { dmg: "Damage - Diesel.jpg", inop: "Inop - Diesel.jpg" },
  "diesel-3": { dmg: "Damage - Diesel.jpg", inop: "Inop - Diesel.jpg" },
  "diesel-4": { dmg: "Damage - Diesel.jpg", inop: "Inop - Diesel.jpg" },
  "diesel": { dmg: "Damage - Diesel.jpg", inop: "Inop - Diesel.jpg" },
  "elec-1": { dmg: "Damage - Electric.jpg", inop: "Inop - Electric.jpg" },
  "elec-2": { dmg: "Damage - Electric.jpg", inop: "Inop - Electric.jpg" },
  "elec-3": { dmg: "Damage - Electric.jpg", inop: "Inop - Electric.jpg" },
  "elec-4": { dmg: "Damage - Electric.jpg", inop: "Inop - Electric.jpg" },
  "elec": { dmg: "Damage - Electric.jpg", inop: "Inop - Electric.jpg" },
  "fuel": { dmg: "Damage - Fuel Tanks.jpg", inop: "Inop - Fuel Tanks.jpg" },
  "batteries": { dmg: "Damage - Batteries.jpg", inop: "Inop - Batteries.jpg" },
  "batteries-1": { dmg: "Damage - Batteries.jpg", inop: "Inop - Batteries.jpg" },
  "batteries-2": { dmg: "Damage - Batteries.jpg", inop: "Inop - Batteries.jpg" },
  "batteries-3": { dmg: "Damage - Batteries.jpg", inop: "Inop - Batteries.jpg" },
  "hangar": { dmg: "Damage - Aircraft.jpg", inop: "Inop - Aircraft.jpg" },
  "crane": { dmg: "Damage - Aircraft.jpg", inop: "Inop - Aircraft.jpg" },
  "cargo": { dmg: "Damage.jpg", inop: "Inop.jpg" },
  "fwd-battery": { dmg: "Damage - Batteries.jpg", inop: "Inop - Batteries.jpg" },
  "aft-battery": { dmg: "Damage - Batteries.jpg", inop: "Inop - Batteries.jpg" },
  "wire-cutters": { dmg: "Damage.jpg", inop: "Inop.jpg" },
  "gyro-compass": { dmg: "Damage.jpg", inop: "Inop.jpg" },
  "propeller": { dmg: "Damage.jpg", inop: "Inop.jpg" },
  "horiz-rudder": { dmg: "Damage - Dive Plane.jpg", inop: "Inop - Dive Plane.jpg" },
  "vert-rudder": { dmg: "Damage - Dive Plane.jpg", inop: "Inop - Dive Plane.jpg" }
};

const BASE_PORT_CHITS = {
  "Yokosuka": "Port Yokosuka.jpg",
  "Kure": "Port Yokosuka.jpg",
  "Truk": "Port Truk.jpg",
  "Paramushiro": "Port Parama-Shiro.jpg",
  "Parama-Shiro": "Port Parama-Shiro.jpg",
  "Rabaul": "Port N Guinea.jpg",
  "New Guinea": "Port N Guinea.jpg",
  "Shortland": "Port N Guinea.jpg",
  "Penang": "Port Dutch E Indies.jpg",
  "Surabaya": "Port Dutch E Indies.jpg",
  "Dutch East Indies": "Port Dutch E Indies.jpg",
  "Dutch E Indies": "Port Dutch E Indies.jpg",
  "DEI": "Port Dutch E Indies.jpg",
  "Singapur": "Port Dutch E Indies.jpg",
  "Singapore": "Port Dutch E Indies.jpg",
  "Sabang": "Port Dutch E Indies.jpg"
};

function getPortChit(baseName) {
  if (!baseName) return "Port Yokosuka.jpg";
  if (BASE_PORT_CHITS[baseName]) return BASE_PORT_CHITS[baseName];
  const norm = (typeof normalizeBaseName === 'function') ? normalizeBaseName(baseName) : baseName;
  if (BASE_PORT_CHITS[norm]) return BASE_PORT_CHITS[norm];
  const s = String(baseName).toLowerCase();
  if (s.includes('dutch') || s.includes('dei') || s.includes('penang') || s.includes('indies') || s.includes('surabaya') || s.includes('singapor') || s.includes('sabang')) return "Port Dutch E Indies.jpg";
  if (s.includes('guinea') || s.includes('rabaul') || s.includes('shortland')) return "Port N Guinea.jpg";
  if (s.includes('paramushiro') || s.includes('parama')) return "Port Parama-Shiro.jpg";
  if (s.includes('truk')) return "Port Truk.jpg";
  return "Port Yokosuka.jpg";
}

const SUB_BOARD_MISSION_CHITS = {
  "Pearl Harbor": "Pearl Harbor 12-41.jpg",
  "Midway": "Midway 6-42.jpg",
  "Aleutians": "Aleutians 5-42 - 6-42.jpg",
  "Australia": "Australia 5-42.jpg",
  "Indian Ocean": "Indian Ocean 3-42 - 4-42.jpg",
  "Guadalcanal": "Guadalcanal 8-42 - 12-42.jpg",
  "Marianas": "Marianas 6-44.jpg",
  "Leyte": "Leyte Gulf 10-44.jpg",
  "Leyte Gulf": "Leyte Gulf 10-44.jpg",
  "Iwo Jima": "Iwo Jima 2-45.jpg",
  "Okinawa": "Okinawa 4-45 - 5-45.jpg",
  "Panama": "Panama Canal 1-7 - 45.jpg",
  "Panama Canal": "Panama Canal 1-7 - 45.jpg",
  "Malaya": "Malaya 12-41.jpg",
  "Dutch East Indies": "Dutch E Indies 12-41 - 3-42.jpg",
  "Dutch E Indies": "Dutch E Indies 12-41 - 3-42.jpg",
  "DEI": "Dutch E Indies 12-41 - 3-42.jpg",
  "Philippines": "Philippenes 12-41.jpg",
  "Tarawa": "Tarawa 11-43 - 12-43.jpg",
  "New Guinea": "New Guinea 3-43 - 6-43.jpg",
  "Europe": "Europe 4-44.jpg",
  "US West Coast": "US West Coast 1-42.jpg"
};

function getMissionChit(areaName, monthStr) {
  if (!areaName) return "Pearl Harbor 12-41.jpg";
  if (SUB_BOARD_MISSION_CHITS[areaName]) return SUB_BOARD_MISSION_CHITS[areaName];
  const s = String(areaName).toLowerCase();
  const m = monthStr || (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
  
  if (s.includes("philippin")) return "Philippenes 12-41.jpg";
  if (s.includes("dutch") || s.includes("indies") || s.includes("dei") || s.includes("indias")) return "Dutch E Indies 12-41 - 3-42.jpg";
  if (s.includes("malaya")) return "Malaya 12-41.jpg";
  if (s.includes("midway")) return "Midway 6-42.jpg";
  if (s.includes("tarawa") || s.includes("marshall")) return "Tarawa 11-43 - 12-43.jpg";
  if (s.includes("leyte")) return "Leyte Gulf 10-44.jpg";
  if (s.includes("iwo")) return "Iwo Jima 2-45.jpg";
  if (s.includes("okinawa")) return "Okinawa 4-45 - 5-45.jpg";
  if (s.includes("panama")) return "Panama Canal 1-7 - 45.jpg";
  if (s.includes("europe") || s.includes("europa") || s.includes("yanagi")) return "Europe 4-44.jpg";

  if (s.includes("west coast") || s.includes("costa oeste")) {
    return (m < "1942-05") ? "US West Coast 1-42.jpg" : "US West Coast 6-42 - 7-42.jpg";
  }
  if (s.includes("pearl") || s.includes("hawaii")) {
    return (m < "1943-01") ? "Pearl Harbor 12-41.jpg" : "Pearl Harbor 10-43 - 11-43.jpg";
  }
  if (s.includes("australia") || s.includes("sydney")) {
    return (m < "1943-01") ? "Australia 5-42.jpg" : "Australia 3-43.jpg";
  }
  if (s.includes("aleutian")) {
    return (m < "1943-01") ? "Aleutians 5-42 - 6-42.jpg" : "Aleutians 6-43.jpg";
  }
  if (s.includes("guadalcanal") || s.includes("solomon") || s.includes("salom")) {
    return (m < "1943-01") ? "Guadalcanal 8-42 - 12-42.jpg" : "Guadalcanal 4-43 - 6-43.jpg";
  }
  if (s.includes("guinea") || s.includes("rabaul")) {
    return (m < "1943-05") ? "New Guinea 3-43.jpg" : "New Guinea 3-43 - 6-43.jpg";
  }
  if (s.includes("marianas") || s.includes("saipan") || s.includes("guam")) {
    return (m < "1944-10") ? "Marianas 6-44.jpg" : "Marianas 11-44 - 4-45.jpg";
  }
  if (s.includes("indian") || s.includes("índico") || s.includes("indico")) {
    if (m < "1942-05") return "Indian Ocean 3-42 - 4-42.jpg";
    if (m < "1942-07") return "Indian Ocean 5-42.jpg";
    if (m < "1943-01") return "Indian Ocean 8-42 - 11-42.jpg";
    return "Indian Ocean 12-43.jpg";
  }
  return "Pearl Harbor 12-41.jpg";
}

const CREW_QUALITY_CHITS = {
  "green": "Crew Green.jpg",
  "trained": "Crew Trained.jpg",
  "veteran": "Crew Veteran.jpg",
  "elite": "Crew Elite.jpg"
};

const SUB_CLASS_NAMES_ES = {
  "Kaidai_KD3_Class": "Clase Kaidai KD.3 (Submarino de Flota)",
  "Kaidai_KD4_Class": "Clase Kaidai KD.4 (Submarino de Flota)",
  "Kaidai_KD5_Class": "Clase Kaidai KD.5 (Submarino de Flota)",
  "Kaidai_KD6_Class": "Clase Kaidai KD.6 (Submarino de Flota)",
  "Kaidai_KD7_Class": "Clase Kaidai KD.7 (Submarino de Ataque Final)",
  "Kirai_Sen_Class": "Clase Kirai-Sen (Submarino Minador I-121)",
  "Junsen_J_IM_Class": "Clase Junsen J.1M (Submarino Crucero I-5)",
  "Junsen_J2_Class": "Clase Junsen J.2 (Submarino Crucero con Hangar I-6)",
  "Junsen_J3_Class": "Clase Junsen J.3 (Crucero Submarino I-7, I-8)",
  "Type_A_Class": "Clase Tipo A / Kou-Gata (Submarino de Mando I-9)",
  "Type_B_Class": "Clase Tipo B / Otsu-Gata (Submarino Crucero con Catapulta I-15)",
  "Type_B_3_Class": "Clase Tipo B-3 (Crucero Submarino Tardío I-54)",
  "Type_C_Class": "Clase Tipo C / Hei-Gata (Submarino de Ataque Pesado I-16)",
  "Type_A_Modified": "Clase Tipo A Modificado (Submarino Insignia I-12)",
  "Sen_Toku_Class": "Clase Sen-Toku I-400 (Submarino Portaaviones Gigante)",
  "Sen_Taka_Class": "Clase Sen-Taka I-201 (Submarino de Alta Velocidad)",
  "Type_C3_Class": "Clase Tipo C-3 (Submarino de Transporte de Carga I-52)",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Tipo A Midget / Ko-Hyoteki (Sumergible Especial)",
  "Type_B2_Class": "Clase Type B2 (Crucero Submarino Serie I-40)",
  "Type_C2_Class": "Clase Type C2 (Submarino Ataque Pesado Serie I-46)",
  "Type_A2_Class": "Clase Type A2 (Submarino Portaaviones Seiran Serie I-13)",
  "Type_D1_Class": "Clase Type D1 (Submarino Transporte y Kaiten Serie I-361)",
  "Kaichu_VII_Class": "Clase Kaichu VII (Submarino Medio Flotilla Serie Ro-35)",
  "Junsen_J1_Class": "Clase Junsen J1 (Crucero Doble Cañón 140mm Serie I-1)"
};

const SUB_CLASS_NAMES_EN = {
  "Kaidai_KD3_Class": "Kaidai KD.3 Class (Fleet Submarine)",
  "Kaidai_KD4_Class": "Kaidai KD.4 Class (Fleet Submarine)",
  "Kaidai_KD5_Class": "Kaidai KD.5 Class (Fleet Submarine)",
  "Kaidai_KD6_Class": "Kaidai KD.6 Class (Fleet Submarine)",
  "Kaidai_KD7_Class": "Kaidai KD.7 Class (Final Attack Fleet Submarine)",
  "Kirai_Sen_Class": "Kirai-Sen Class (Fleet Minelayer Submarine I-121)",
  "Junsen_J_IM_Class": "Junsen J.1M Class (Cruiser Submarine I-5)",
  "Junsen_J2_Class": "Junsen J.2 Class (Cruiser Submarine with Hangar I-6)",
  "Junsen_J3_Class": "Junsen J.3 Class (Cruiser Submarine I-7, I-8)",
  "Type_A_Class": "Type A / Kou-Gata Class (Command Cruiser Submarine I-9)",
  "Type_B_Class": "Type B / Otsu-Gata Class (Cruiser Submarine with Catapult I-15)",
  "Type_B_3_Class": "Type B-3 Class (Late Cruiser Submarine I-54)",
  "Type_C_Class": "Type C / Hei-Gata Class (Heavy Attack Submarine I-16)",
  "Type_A_Modified": "Type A Modified Class (Flagship Cruiser Submarine I-12)",
  "Sen_Toku_Class": "Sen-Toku I-400 Class (Giant Carrier Submarine)",
  "Sen_Taka_Class": "Sen-Taka I-201 Class (High-Speed Submarine)",
  "Type_C3_Class": "Type C-3 Class (Long-Range Cargo Submarine I-52)",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Type A Midget / Ko-Hyoteki (Special Attack Submersible)",
  "Type_B2_Class": "Type B2 Class (Cruiser Submarine I-40 Series)",
  "Type_C2_Class": "Type C2 Class (Heavy Attack Submarine I-46 Series)",
  "Type_A2_Class": "Type A2 Class (Seiran Carrier Submarine I-13 Series)",
  "Type_D1_Class": "Type D1 Class (Transport & Kaiten Submarine I-361 Series)",
  "Kaichu_VII_Class": "Kaichu VII Class (Medium Fleet Submarine Ro-35 Series)",
  "Junsen_J1_Class": "Junsen J1 Class (Twin 140mm Guns Cruiser Submarine I-1 Series)"
};

function initSubBoard() {
  loadSavedSubBoardState();
  if (!subBoardState.tubes || Object.keys(subBoardState.tubes).length === 0) {
    subBoardState.tubes = {};
    for (let i = 1; i <= 8; i++) subBoardState.tubes[i] = true;
  }
  if (!subBoardState.reloads || Object.keys(subBoardState.reloads).length === 0) {
    subBoardState.reloads = {};
    for (let i = 1; i <= 16; i++) subBoardState.reloads[i] = true;
    subBoardState.reloads['aft_1'] = true;
    subBoardState.reloads['aft_2'] = true;
  }
  if (!subBoardState.tubeTypes || Object.keys(subBoardState.tubeTypes).length === 0) {
    const alloc = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.torpedoAllocation)
      ? campaignState.workflow.torpedoAllocation
      : (subBoardState.torpedoAllocation || { fwdT92: 4, aftT92: 2 });
    applyTorpedoAllocation(alloc.fwdT92 !== undefined ? alloc.fwdT92 : 4, alloc.aftT92 !== undefined ? alloc.aftT92 : 2);
  }
  if (typeof campaignState !== 'undefined' && campaignState.activeSubKey) {
    currentBoardSubKey = campaignState.activeSubKey;
    subBoardState.activeSubKey = currentBoardSubKey;
  } else if (subBoardState.activeSubKey) {
    currentBoardSubKey = subBoardState.activeSubKey;
  }

  // Always sync latest base and assigned mission destination from campaign
  if (typeof campaignState !== 'undefined' && campaignState.workflow) {
    if (campaignState.workflow.assignedArea) {
      subBoardState.assignedArea = campaignState.workflow.assignedArea;
    }
    if (campaignState.workflow.startingBase) {
      subBoardState.startingBase = campaignState.workflow.startingBase;
    }
  }

  if (currentBoardSubKey) {
    const maxPatrolBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
    if (subBoardState.patrolIndex >= maxPatrolBoxes) {
      subBoardState.patrolIndex = Math.max(-1, maxPatrolBoxes - 1);
    }
  }
  if (typeof window !== 'undefined') window.currentBoardSubKey = currentBoardSubKey;
  populateBoardSubSelect();

  if (!canonicalSlotsData) {
    canonicalSlotsData = (typeof CANONICAL_SLOTS_DATA !== 'undefined') ? CANONICAL_SLOTS_DATA : ((typeof window !== 'undefined' && window.CANONICAL_SLOTS_DATA) ? window.CANONICAL_SLOTS_DATA : null);
  }

  if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();

  if (canonicalSlotsData) {
    if (currentBoardSubKey) syncBoardFromCampaignState(false);
    renderSubBoard();
  } else {
    // Fallback asynchronous load if needed
    fetch('js/submarines_canonical_slots.json')
      .then(res => res.json())
      .then(data => {
        canonicalSlotsData = data;
        if (currentBoardSubKey) syncBoardFromCampaignState(false);
        renderSubBoard();
      })
      .catch(err => {
        console.warn("Could not fetch submarines_canonical_slots.json:", err);
        if (currentBoardSubKey) syncBoardFromCampaignState(false);
        renderSubBoard();
      });
  }
}

function populateBoardSubSelect() {
  const sel = document.getElementById('board-sub-select');
  if (!sel) return;
  const isEn = (window.currentLang === 'en');
  const subs = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines : {};

  sel.innerHTML = '';
  const placeholderOpt = document.createElement('option');
  placeholderOpt.value = "";
  placeholderOpt.textContent = isEn ? "-- Select Submarine --" : "-- Selecciona Submarino --";
  if (!currentBoardSubKey) placeholderOpt.selected = true;
  sel.appendChild(placeholderOpt);

  const officialGroup = document.createElement('optgroup');
  officialGroup.label = isEn ? "⚓ Official Submarines (Compass Games)" : "⚓ Submarinos Oficiales (Compass Games)";

  const fanmadeGroup = document.createElement('optgroup');
  fanmadeGroup.label = isEn ? "⭐ Real Historical Variants [Fanmade]" : "⭐ Variantes Históricas Reales [Fanmade]";

  for (const [k, sub] of Object.entries(subs)) {
    const opt = document.createElement('option');
    opt.value = k;
    const isFan = !!sub.is_fanmade;
    
    let label = isEn 
      ? (SUB_CLASS_NAMES_EN[k] || sub.full_title || sub.class_name)
      : (SUB_CLASS_NAMES_ES[k] || sub.full_title || sub.class_name);
    
    if (isFan && !label.includes('[Fanmade]')) {
      label += " [Fanmade]";
    }
    opt.textContent = label;
    if (isFan) opt.style.color = '#fbbf24';
    if (k === currentBoardSubKey) opt.selected = true;

    if (isFan) {
      fanmadeGroup.appendChild(opt);
    } else {
      officialGroup.appendChild(opt);
    }
  }

  if (officialGroup.children.length > 0) sel.appendChild(officialGroup);
  if (fanmadeGroup.children.length > 0) sel.appendChild(fanmadeGroup);
  sel.value = currentBoardSubKey || "";
}

function changeBoardSubmarine(subKey) {
  const isEn = (window.currentLang === 'en');
  if (!subKey) {
    currentBoardSubKey = null;
    if (typeof window !== 'undefined') window.currentBoardSubKey = null;
    subBoardState.activeSubKey = null;
    saveSubBoardState();
    populateBoardSubSelect();
    renderSubBoard();
    return;
  }

  currentBoardSubKey = subKey;
  const subChanged = (subBoardState.activeSubKey !== subKey);
  if (typeof window !== 'undefined') window.currentBoardSubKey = subKey;
  subBoardState.activeSubKey = subKey;

  // Clamp patrolIndex strictly to submarine's max boxes
  const maxPatrolBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
  if (subBoardState.patrolIndex >= maxPatrolBoxes) {
    subBoardState.patrolIndex = Math.max(-1, maxPatrolBoxes - 1);
  }

  // Ensure aircraftDamaged2 is strictly reset if submarine does not have 2+ aircraft
  const airArmCfg = (typeof getSubmarineArmamentConfig === 'function') ? getSubmarineArmamentConfig(currentBoardSubKey) : null;
  const currentAirCount = airArmCfg ? ((typeof airArmCfg.aircraftCount === 'number') ? airArmCfg.aircraftCount : (airArmCfg.hasAircraft ? 1 : 0)) : 0;
  if (currentAirCount < 2 && subBoardState.aircraftDamaged2) {
    subBoardState.aircraftDamaged2 = false;
  }

  // Ensure tubes and reloads exist (initialize fresh ONLY if sub changed or uninitialized)
  if (!subBoardState.tubes || Object.keys(subBoardState.tubes).length === 0 || subChanged) {
    subBoardState.tubes = {};
    const cfg = getSubmarineArmamentConfig(subKey);
    for (let i = 1; i <= 8; i++) subBoardState.tubes[i] = (i <= (cfg.fwdTubes + cfg.aftTubes));
  }
  if (!subBoardState.reloads || Object.keys(subBoardState.reloads).length === 0 || subChanged) {
    subBoardState.reloads = {};
    for (let i = 1; i <= 16; i++) subBoardState.reloads[i] = true;
    subBoardState.reloads['aft_1'] = true;
    subBoardState.reloads['aft_2'] = true;
  }

  const alloc = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.torpedoAllocation)
    ? campaignState.workflow.torpedoAllocation
    : (subBoardState.torpedoAllocation || { fwdT92: 4, aftT92: 2 });
  applyTorpedoAllocation(alloc.fwdT92 !== undefined ? alloc.fwdT92 : 4, alloc.aftT92 !== undefined ? alloc.aftT92 : 2);

  const defHull = (typeof getDefaultHullForSubmarine === 'function')
    ? getDefaultHullForSubmarine(subKey)
    : 'I-19';

  // Sync to campaignState and dock if needed
  if (typeof campaignState !== 'undefined') {
    campaignState.activeSubKey = subKey;
    if (campaignState.workflow) {
      campaignState.workflow.hullNumber = defHull;
    }
    if (typeof saveState === 'function') saveState();
  }

  // Sync dock and phase 0 UI controls if active
  const selClass = document.getElementById('wf-sub-class-select');
  if (selClass && selClass.value !== subKey) selClass.value = subKey;

  const hullInput = document.getElementById('wf-sub-hull-number');
  if (hullInput) hullInput.value = defHull;

  // Sync Phase 0 specs & views immediately
  if (typeof updateWorkflowSubmarineSpecs === 'function') updateWorkflowSubmarineSpecs();
  if (typeof buildWorkflowMonthSelect === 'function') buildWorkflowMonthSelect();
  if (typeof updateSchoolEquipDisplay === 'function') updateSchoolEquipDisplay();
  if (typeof updateBasesForDate === 'function') {
    const m = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.selectedMonth)
      ? campaignState.workflow.selectedMonth
      : "1941-12";
    updateBasesForDate(m);
  }
  if (typeof updateSpecialEventsForMonthArea === 'function') updateSpecialEventsForMonthArea();
  if (typeof renderMissionChits === 'function') renderMissionChits();

  // Sync Rogu Bukku & Commander Dossier & Dock preview
  if (typeof updateRoguBukkuSubProfile === 'function') updateRoguBukkuSubProfile();
  if (typeof renderSubmarinePatrolTrack === 'function') renderSubmarinePatrolTrack(subKey);
  if (typeof renderCommanderDossier === 'function') renderCommanderDossier();

  document.querySelectorAll('.sub-select-btn').forEach(el => el.classList.remove('active'));
  const activeBtn = document.getElementById('btn-sub-' + subKey);
  if (activeBtn) activeBtn.classList.add('active');

  if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
  saveSubBoardState();
  populateBoardSubSelect();
  renderSubBoard();
  showToast(isEn ? `Submarine sheet loaded: ${currentBoardSubKey}` : `Hoja de submarino cargada: ${currentBoardSubKey}`);
}

function loadActiveCampaignSubmarine() {
  const isEn = (window.currentLang === 'en');
  if (typeof campaignState !== 'undefined' && campaignState.activeSubKey) {
    changeBoardSubmarine(campaignState.activeSubKey);
    syncBoardFromCampaignState(true);
  } else {
    showToast(isEn ? "No commissioned submarine in campaign. Select one in Phase 0." : "No hay submarino comisionado en campaña. Selecciona uno en la Fase 0.");
  }
}

function setBoardDisplayMode(mode) {
  boardDisplayMode = mode;
  const overlayEl = document.getElementById('sub-board-3d-overlay');
  const btnPaper = document.getElementById('btn-mode-paper');
  const btn3D = document.getElementById('btn-mode-3d');

  if (overlayEl) {
    overlayEl.style.display = (mode === '3d') ? 'block' : 'none';
  }
  if (btnPaper && btn3D) {
    if (mode === '3d') {
      btn3D.classList.add('active');
      btnPaper.classList.remove('active');
    } else {
      btnPaper.classList.add('active');
      btn3D.classList.remove('active');
    }
  }
}

function renderSubBoard() {
  const isEn = (window.currentLang === 'en');
  const langSuffix = isEn ? 'en' : 'es';

  const bgImg = document.getElementById('sub-board-bg-img');
  const overlayImg = document.getElementById('sub-board-3d-overlay');
  const interactiveLayer = document.getElementById('sub-board-interactive-layer');
  const viewport = document.getElementById('sub-board-viewport');

  let placeholder = document.getElementById('sub-board-empty-placeholder');

  // If no submarine is commissioned/selected, show pristine empty state
  if (!currentBoardSubKey) {
    if (bgImg) bgImg.style.display = 'none';
    if (overlayImg) overlayImg.style.display = 'none';
    if (interactiveLayer) interactiveLayer.innerHTML = '';

    if (!placeholder && viewport) {
      placeholder = document.createElement('div');
      placeholder.id = 'sub-board-empty-placeholder';
      placeholder.style.cssText = `
        position:absolute; top:0; left:0; width:100%; height:100%;
        display:flex; flex-direction:column; align-items:center; justify-content:center;
        background: radial-gradient(circle at center, #1e293b 0%, #090d16 100%);
        border: 2px dashed #475569; border-radius: 8px; z-index: 20; color: #cbd5e1; text-align: center; padding: 24px; box-sizing: border-box;
      `;
      viewport.appendChild(placeholder);
    }
    if (placeholder) {
      placeholder.style.display = 'flex';
      placeholder.innerHTML = `
        <div style="font-size:3.5rem; margin-bottom:12px; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.6));">⚓</div>
        <h2 style="font-family:'Cinzel', serif; color:#fde047; font-size:1.5rem; margin:0 0 8px 0; letter-spacing:1.5px;">
          ${isEn ? "NO COMMISSIONED SUBMARINE" : "NINGÚN SUBMARINO ASIGNADO"}
        </h2>
        <p style="max-width:560px; font-size:0.95rem; color:#94a3b8; line-height:1.5; margin:0 0 20px 0;">
          ${isEn 
            ? "Your command is currently unassigned. Commission a submarine class in <strong>Phase 0 (Prepare to Play)</strong> or select one from the menu above to deploy its authentic double-layer sheet."
            : "No hay ningún buque comisionado actualmente. Elige una clase de submarino en la <strong>Fase 0 (Preparación)</strong> o selecciónalo en el menú superior para desplegar su hoja canónica oficial."}
        </p>
        <button type="button" class="action-btn" onclick="if(typeof switchTab==='function')switchTab('workflow');" style="padding:10px 22px; font-size:0.92rem; background:linear-gradient(135deg, #c5a059 0%, #b45309 100%); color:#fff; border:none; font-weight:bold; border-radius:6px; cursor:pointer; box-shadow:0 4px 14px rgba(0,0,0,0.5);">
          <span>🧭 ${isEn ? "Go to Phase 0 (Commission Ship)" : "Ir a Fase 0 (Comisionar Submarino)"}</span>
        </button>
      `;
    }
    return;
  }

  // Active submarine is selected: hide placeholder
  if (placeholder) {
    placeholder.style.display = 'none';
  }

  // 1. Update Card Image with asset resolution & resilient fallback
  if (bgImg) {
    bgImg.style.display = 'block';
    const subObj = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[currentBoardSubKey] : null;
    const baseKey = (subObj && subObj.base_card_key) ? subObj.base_card_key : currentBoardSubKey;
    const primaryRaw = `assets/submarines_cards/${currentBoardSubKey}_${langSuffix}.webp`;
    const fallbackRaw = `assets/submarines_cards/${baseKey}_${langSuffix}.webp`;
    const primarySrc = (typeof resolveAsset === 'function') ? resolveAsset(primaryRaw) : primaryRaw;
    const fallbackSrc = (typeof resolveAsset === 'function') ? resolveAsset(fallbackRaw) : fallbackRaw;

    bgImg.onerror = function() {
      if (this.src !== fallbackSrc) {
        console.warn(`[SubBoard] Failed to load card for ${currentBoardSubKey}, falling back to ${baseKey}`);
        this.src = fallbackSrc;
      }
    };
    bgImg.src = primarySrc;
  }

  // Ensure patrolIndex does not exceed submarine's active patrol track
  const maxPatrolBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
  if (subBoardState.patrolIndex >= maxPatrolBoxes) {
    subBoardState.patrolIndex = Math.max(-1, maxPatrolBoxes - 1);
  }

  // 2. Update 3D Overlay Image
  if (overlayImg) {
    overlayImg.src = `assets/submarines_cards/overlay_3d_${langSuffix}.webp`;
    overlayImg.style.display = (boardDisplayMode === '3d') ? 'block' : 'none';
  }

  // 3. Render Interactive Slot Hotspots & Counters
  renderInteractiveSlots();
}

function renderInteractiveSlots() {
  const container = document.getElementById('sub-board-interactive-layer');
  if (!container) return;

  const isEn = (window.currentLang === 'en');

  // Clamp patrolIndex strictly to submarine's max boxes
  const maxPatrolBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
  if (subBoardState.patrolIndex >= maxPatrolBoxes) {
    subBoardState.patrolIndex = Math.max(-1, maxPatrolBoxes - 1);
  }

  // Ensure aircraftDamaged2 is strictly reset if submarine does not have 2+ aircraft
  const airArmCfg = (typeof getSubmarineArmamentConfig === 'function') ? getSubmarineArmamentConfig(currentBoardSubKey) : null;
  const currentAirCount = airArmCfg ? ((typeof airArmCfg.aircraftCount === 'number') ? airArmCfg.aircraftCount : (airArmCfg.hasAircraft ? 1 : 0)) : 0;
  if (currentAirCount < 2 && subBoardState.aircraftDamaged2) {
    subBoardState.aircraftDamaged2 = false;
  }

  // If canonical slots data is loaded, render each slot into a DocumentFragment
  // to avoid dozens of separate DOM layout recalculations
  if (!canonicalSlotsData && typeof window !== 'undefined' && window.CANONICAL_SLOTS_DATA) canonicalSlotsData = window.CANONICAL_SLOTS_DATA;
  if (canonicalSlotsData && canonicalSlotsData.slots) {
    const sw = canonicalSlotsData.slot_w_pct;
    const sh = canonicalSlotsData.slot_h_pct;
    const fragment = document.createDocumentFragment();

    canonicalSlotsData.slots.forEach(slot => {
      const slotEl = document.createElement('div');
      slotEl.className = `board-slot-hotspot board-slot-${slot.category}`;
      slotEl.id = `sub-hotspot-${slot.id}`;
      slotEl.style.position = 'absolute';
      slotEl.style.left = `${slot.x_pct}%`;
      slotEl.style.top = `${slot.y_pct}%`;
      slotEl.style.width = `${sw}%`;
      slotEl.style.height = `${sh}%`;
      slotEl.title = isEn ? slot.label_en : slot.label_es;

      // Attach Category specific status and click behavior
      decorateAndBindSlot(slotEl, slot);

      fragment.appendChild(slotEl);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
    if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
  } else {
    container.innerHTML = '';
  }
}

const CARD_ARMAMENT_CFG = {
  "Kaidai_KD3_Class": { fwdTubes: 6, aftTubes: 2, aftReloads: 2, fwdReloads: 8, hasAircraft: false, aircraftCount: 0 },
  "Kaidai_KD4_Class": { fwdTubes: 4, aftTubes: 2, aftReloads: 2, fwdReloads: 6, hasAircraft: false, aircraftCount: 0 },
  "Kaidai_KD5_Class": { fwdTubes: 4, aftTubes: 2, aftReloads: 2, fwdReloads: 6, hasAircraft: false, aircraftCount: 0 },
  "Kaidai_KD6_Class": { fwdTubes: 4, aftTubes: 2, aftReloads: 2, fwdReloads: 6, hasAircraft: false, aircraftCount: 0 },
  "Kaidai_KD7_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 6, hasAircraft: false, aircraftCount: 0 },
  "Kirai_Sen_Class": { fwdTubes: 4, aftTubes: 0, aftReloads: 0, fwdReloads: 8, hasAircraft: false, aircraftCount: 0 },
  "Junsen_J_IM_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 12, hasAircraft: true, aircraftCount: 1 },
  "Junsen_J2_Class": { fwdTubes: 4, aftTubes: 2, aftReloads: 2, fwdReloads: 9, hasAircraft: true, aircraftCount: 1 },
  "Junsen_J3_Class": { fwdTubes: 4, aftTubes: 2, aftReloads: 2, fwdReloads: 15, hasAircraft: true, aircraftCount: 1 },
  "Type_A_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 12, hasAircraft: true, aircraftCount: 1 },
  "Type_B_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 11, hasAircraft: true, aircraftCount: 1 },
  "Type_B_3_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 13, hasAircraft: true, aircraftCount: 1 },
  "Type_C_Class": { fwdTubes: 8, aftTubes: 0, aftReloads: 0, fwdReloads: 12, hasAircraft: false, aircraftCount: 0 },
  "Type_A_Modified": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 12, hasAircraft: true, aircraftCount: 2 },
  "Sen_Toku_Class": { fwdTubes: 8, aftTubes: 0, aftReloads: 0, fwdReloads: 12, hasAircraft: true, aircraftCount: 3 },
  "Sen_Taka_Class": { fwdTubes: 4, aftTubes: 0, aftReloads: 0, fwdReloads: 6, hasAircraft: false, aircraftCount: 0 },
  "Type_C3_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 13, hasAircraft: false, aircraftCount: 0 },
  "Type_A_Midget_Submarine___Ko_Hyoteki": { fwdTubes: 2, aftTubes: 0, aftReloads: 0, fwdReloads: 0, hasAircraft: false, aircraftCount: 0 },
  "Type_B2_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 11, hasAircraft: true, aircraftCount: 1 },
  "Type_C2_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 13, hasAircraft: false, aircraftCount: 0 },
  "Type_A2_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 6, hasAircraft: true, aircraftCount: 2 },
  "Type_D1_Class": { fwdTubes: 2, aftTubes: 0, aftReloads: 0, fwdReloads: 0, hasAircraft: false, aircraftCount: 0 },
  "Kaichu_VII_Class": { fwdTubes: 4, aftTubes: 0, aftReloads: 0, fwdReloads: 6, hasAircraft: false, aircraftCount: 0 },
  "Junsen_J1_Class": { fwdTubes: 6, aftTubes: 0, aftReloads: 0, fwdReloads: 14, hasAircraft: false, aircraftCount: 0 }
};

function getSubmarineArmamentConfig(subKey) {
  if (!subKey) return { fwdTubes: 6, aftTubes: 2, aftReloads: 2, fwdReloads: 8, hasAircraft: false, aircraftCount: 0 };
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;
  if (subData) {
    const fwdTubes = subData.torpedo_tubes ? (typeof subData.torpedo_tubes.fwd === 'number' ? subData.torpedo_tubes.fwd : (subData.torpedo_tubes.bow || 0)) : (CARD_ARMAMENT_CFG[subKey]?.fwdTubes || 6);
    const aftTubes = subData.torpedo_tubes ? (typeof subData.torpedo_tubes.aft === 'number' ? subData.torpedo_tubes.aft : (subData.torpedo_tubes.stern || 0)) : (CARD_ARMAMENT_CFG[subKey]?.aftTubes || 0);
    const fwdReloads = (typeof subData.reload_capacity === 'number') ? subData.reload_capacity : ((subData.torpedo_tubes && typeof subData.torpedo_tubes.reloads_fwd === 'number') ? subData.torpedo_tubes.reloads_fwd : (CARD_ARMAMENT_CFG[subKey]?.fwdReloads || 0));
    const aftReloads = (subData.torpedo_tubes && typeof subData.torpedo_tubes.reloads_aft === 'number') ? subData.torpedo_tubes.reloads_aft : (CARD_ARMAMENT_CFG[subKey]?.aftReloads || (aftTubes > 0 ? 2 : 0));
    const hasAircraft = (typeof subData.has_aircraft === 'boolean') ? subData.has_aircraft : !!(CARD_ARMAMENT_CFG[subKey]?.hasAircraft);
    const aircraftCount = (typeof subData.aircraft_count === 'number') ? subData.aircraft_count : (CARD_ARMAMENT_CFG[subKey]?.aircraftCount ?? (hasAircraft ? 1 : 0));
    return { fwdTubes, aftTubes, aftReloads, fwdReloads, hasAircraft, aircraftCount };
  }
  if (CARD_ARMAMENT_CFG[subKey]) {
    const fallback = CARD_ARMAMENT_CFG[subKey];
    return { ...fallback, aircraftCount: fallback.aircraftCount ?? (fallback.hasAircraft ? 1 : 0) };
  }
  return { fwdTubes: 6, aftTubes: 2, aftReloads: 2, fwdReloads: 8, hasAircraft: false, aircraftCount: 0 };
}

function getSubmarinePatrolBoxCount(subKey) {
  if (!subKey) return 6;
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;
  if (subData && subData.patrol_phases && Array.isArray(subData.patrol_phases)) {
    const activePhases = subData.patrol_phases.filter(p => p && p !== 'N/A');
    if (activePhases.length > 0) return activePhases.length;
  }
  const classBoxCounts = {
    "Kaidai_KD3_Class": 6,
    "Kaidai_KD4_Class": 6,
    "Kaidai_KD5_Class": 6,
    "Kaidai_KD6_Class": 6,
    "Kaidai_KD7_Class": 6,
    "Kirai_Sen_Class": 6,
    "Junsen_J_IM_Class": 8,
    "Junsen_J2_Class": 8,
    "Junsen_J3_Class": 7,
    "Type_A_Class": 7,
    "Type_B_Class": 7,
    "Type_B_3_Class": 7,
    "Type_C_Class": 7,
    "Type_A_Modified": 8,
    "Sen_Toku_Class": 9,
    "Sen_Taka_Class": 6,
    "Type_C3_Class": 7,
    "Type_A_Midget_Submarine___Ko_Hyoteki": 5,
    "Type_B2_Class": 6,
    "Type_C2_Class": 6,
    "Type_A2_Class": 8,
    "Type_D1_Class": 6,
    "Kaichu_VII_Class": 6,
    "Junsen_J1_Class": 8
  };
  return classBoxCounts[subKey] || 6;
}

function getSubmarineDamageCapacity(subKey) {
  if (!subKey) return { flooding: 7, hull: 7 };
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;
  if (subData && subData.damage_capacity) {
    return {
      flooding: subData.damage_capacity.flooding || 7,
      hull: subData.damage_capacity.hull || 7
    };
  }
  const capacities = {
    "Kaidai_KD3_Class": { flooding: 7, hull: 7 },
    "Kaidai_KD4_Class": { flooding: 7, hull: 7 },
    "Kaidai_KD5_Class": { flooding: 7, hull: 7 },
    "Kaidai_KD6_Class": { flooding: 7, hull: 7 },
    "Kaidai_KD7_Class": { flooding: 7, hull: 7 },
    "Kirai_Sen_Class": { flooding: 8, hull: 8 },
    "Junsen_J_IM_Class": { flooding: 8, hull: 8 },
    "Junsen_J2_Class": { flooding: 8, hull: 8 },
    "Junsen_J3_Class": { flooding: 8, hull: 8 },
    "Type_A_Class": { flooding: 8, hull: 8 },
    "Type_B_Class": { flooding: 8, hull: 8 },
    "Type_B_3_Class": { flooding: 8, hull: 8 },
    "Type_C_Class": { flooding: 8, hull: 8 },
    "Type_A_Modified": { flooding: 8, hull: 8 },
    "Sen_Toku_Class": { flooding: 8, hull: 8 },
    "Sen_Taka_Class": { flooding: 6, hull: 6 },
    "Type_C3_Class": { flooding: 8, hull: 8 },
    "Type_A_Midget_Submarine___Ko_Hyoteki": { flooding: 2, hull: 2 },
    "Type_B2_Class": { flooding: 8, hull: 8 },
    "Type_C2_Class": { flooding: 8, hull: 8 },
    "Type_A2_Class": { flooding: 8, hull: 8 },
    "Type_D1_Class": { flooding: 7, hull: 7 },
    "Kaichu_VII_Class": { flooding: 6, hull: 6 },
    "Junsen_J1_Class": { flooding: 8, hull: 8 }
  };
  return capacities[subKey] || { flooding: 7, hull: 7 };
}

function decorateAndBindSlot(el, slot) {
  const id = slot.id;
  const isEn = (window.currentLang === 'en');

  // --- 0. BASE & MISSION SLOTS ---
  if (id === 'slot-base-current') {
    const currentBase = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.startingBase) ? campaignState.workflow.startingBase : (subBoardState.startingBase || "Yokosuka");
    subBoardState.startingBase = currentBase;
    const portChit = getPortChit(currentBase);
    el.innerHTML = `
      <div class="active-counter-marker base-port-marker" title="Base: ${currentBase} [${isEn ? 'Click to cycle home port' : 'Clic para alternar puerto base'}]">
        <img src="assets/chits/${portChit}" alt="Port Chit" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.85));">
      </div>
    `;
    el.onclick = () => {
      const canonicalBases = ["Yokosuka", "Paramushiro", "Truk", "New Guinea", "Dutch East Indies"];
      const normCur = (typeof normalizeBaseName === 'function') ? normalizeBaseName(currentBase) : currentBase;
      let curIdx = canonicalBases.indexOf(normCur);
      if (curIdx < 0) curIdx = 0;
      let nextBase = canonicalBases[(curIdx + 1) % canonicalBases.length];
      subBoardState.startingBase = nextBase;
      if (typeof handleBaseChange === 'function') {
        handleBaseChange(nextBase);
      } else {
        if (typeof campaignState !== 'undefined' && campaignState.workflow) {
          campaignState.workflow.startingBase = nextBase;
        }
        const b0 = document.getElementById('wf-starting-base');
        if (b0) b0.value = nextBase;
        const b1 = document.getElementById('wf-base-select');
        if (b1) b1.value = nextBase;
        if (typeof updateBaseDescriptionPill === 'function') updateBaseDescriptionPill(nextBase);
        if (typeof saveState === 'function') saveState();
      }
      saveSubBoardState();
      renderInteractiveSlots();
      showToast(isEn ? `Naval Base: ${nextBase}` : `Base naval: ${nextBase}`);
    };
    return;
  }

  if (id === 'slot-base-port') {
    const isAtPort = (subBoardState.patrolIndex === -1);
    if (isAtPort) {
      const subChitName = SUB_COUNTER_CHITS[currentBoardSubKey] || "Submarine - KD.4.jpg";
      el.innerHTML = `
        <div class="active-counter-marker patrol-boat-marker" title="${isEn ? 'Submarine in Port (Click to depart on patrol)' : 'Submarino en Puerto (Clic para salir a patrulla)'}">
          <img src="assets/chits/${subChitName}" alt="Submarine Counter" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else {
      el.innerHTML = '';
    }
    el.onclick = () => {
      subBoardState.patrolIndex = (subBoardState.patrolIndex === -1) ? 0 : -1;
      if (typeof campaignState !== 'undefined' && campaignState.workflow) {
        campaignState.workflow.currentBoxIndex = subBoardState.patrolIndex;
      }
      saveSubBoardState();
      renderInteractiveSlots();
      showToast(isEn ? `Station: ${subBoardState.patrolIndex === -1 ? 'At Port' : 'Patrol Box 1'}` : `Estación: ${subBoardState.patrolIndex === -1 ? 'En Puerto' : 'Casilla 1'}`);
    };
    return;
  }
  
  if (id === 'slot-base-mission') {
    const currentArea = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.assignedArea) ? campaignState.workflow.assignedArea : (subBoardState.assignedArea || "Pearl Harbor");
    const currentMonth = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.selectedMonth) || "1941-12";
    subBoardState.assignedArea = currentArea;
    const missionChit = getMissionChit(currentArea, currentMonth);
    el.innerHTML = `
      <div class="active-counter-marker base-mission-marker" title="Misión: ${currentArea} [${isEn ? 'Click to cycle destination' : 'Clic para alternar destino'}]">
        <img src="assets/chits/${missionChit}" alt="${currentArea}" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.85));">
      </div>
    `;
    el.onclick = () => {
      const canonicalAreas = [
        "Pearl Harbor", "Philippines", "Dutch East Indies", "Malaya", "Midway", "Aleutians",
        "Australia", "Indian Ocean", "Guadalcanal", "New Guinea", "Tarawa", "Europe*",
        "Marianas", "Leyte Gulf", "Iwo Jima", "Okinawa", "Panama Canal**", "US West Coast"
      ];
      let curIdx = canonicalAreas.findIndex(a => a.toLowerCase().includes(currentArea.toLowerCase()) || currentArea.toLowerCase().includes(a.toLowerCase()));
      if (curIdx < 0) curIdx = 0;
      let nextArea = canonicalAreas[(curIdx + 1) % canonicalAreas.length];
      if (typeof campaignState !== 'undefined' && campaignState.workflow) {
        campaignState.workflow.assignedArea = nextArea;
      }
      subBoardState.assignedArea = nextArea;
      if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
      if (typeof updateOperationsMap === 'function') updateOperationsMap();
      if (typeof renderMissionChits === 'function') renderMissionChits();
      const areaSelect = document.getElementById('wf-area-select');
      if (areaSelect) {
        for (let opt of areaSelect.options) {
          if (opt.value === nextArea || nextArea.includes(opt.value)) {
            areaSelect.value = opt.value;
            break;
          }
        }
      }
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      showToast(isEn ? `Patrol Destination: ${nextArea}` : `Zona de misión: ${nextArea}`);
    };
    return;
  }

  // --- 1. PATROL TRACK SLOTS ---
  if (slot.category === 'patrol') {
    const match = id.match(/slot-patrol-(\d+)/);
    if (match) {
      const pIdx = parseInt(match[1]) - 1;
      const maxBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
      if (pIdx >= maxBoxes) {
        // Outside the authentic patrol track for this submarine! Transparent & non-interactive
        el.innerHTML = '';
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.pointerEvents = 'auto';

      // Dynamic track box from current campaign workflow
      const boxList = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.boxList) 
        ? campaignState.workflow.boxList 
        : null;
      const boxName = (boxList && boxList[pIdx]) ? boxList[pIdx] : null;

      let trackImg = "track_transit.jpg";
      let badgeText = isEn ? "TRANSIT" : "TRÁNSITO";

      if (boxName) {
        const isMission = boxName.includes("Misión") || boxName.includes("Mission");
        const isStation = boxName.includes("Estación") || boxName.includes("Station") || isMission;
        const isReturn = boxName.includes("Retorno") || boxName.includes("Return");

        if (boxName.includes("Penetrate") || boxName.includes("Penetración")) {
          trackImg = "track_penetrate.jpg";
          badgeText = "PENETRATE";
        } else if (boxName.includes("Attack") || boxName.includes("Ataque")) {
          trackImg = "track_attack.jpg";
          badgeText = "ATTACK";
        } else if (boxName.includes("Egress") || boxName.includes("Escape")) {
          trackImg = "track_egress.jpg";
          badgeText = "EGRESS";
        } else if (boxName.includes("Recover") || boxName.includes("Rescate")) {
          trackImg = "track_recover.jpg";
          badgeText = "RECOVER";
        } else if (isMission) {
          trackImg = "track_station.jpg";
          badgeText = isEn ? "SPECIAL OPS" : "MISIÓN ESP.";
        } else if (isStation) {
          trackImg = "track_station.jpg";
          const statMatch = boxName.match(/(\d+)/);
          const statNum = statMatch ? statMatch[1] : (pIdx + 1);
          badgeText = isEn ? `STAT ${statNum}` : `ESTACIÓN ${statNum}`;
        } else if (isReturn) {
          trackImg = "track_transit.jpg";
          badgeText = isEn ? "RETURN" : "RETORNO";
        } else {
          trackImg = "track_transit.jpg";
          badgeText = isEn ? "TRANSIT" : "TRÁNSITO";
        }
      } else {
        const phases = (SUB_DB.submarines && SUB_DB.submarines[currentBoardSubKey] && SUB_DB.submarines[currentBoardSubKey].patrol_phases) || [];
        const ph = phases[pIdx] || (pIdx === 0 ? "Transit" : (pIdx === maxBoxes - 1 ? "Transit" : "Stat 1"));
        if (ph.startsWith("Stat")) {
          trackImg = "track_station.jpg";
          badgeText = isEn ? `STAT ${ph.replace('Stat', '').trim()}` : `ESTACIÓN ${ph.replace('Stat', '').trim()}`;
        } else if (ph === "Transit") {
          trackImg = "track_transit.jpg";
          badgeText = (pIdx > 1) ? (isEn ? "RETURN" : "RETORNO") : (isEn ? "TRANSIT" : "TRÁNSITO");
        }
      }

      if (subBoardState.patrolIndex === pIdx) {
        const subChitName = SUB_COUNTER_CHITS[currentBoardSubKey] || "Submarine - KD.4.jpg";
        el.innerHTML = `
          <div class="active-counter-marker patrol-boat-marker" title="${isEn ? 'Submarine on Station' : 'Submarino en esta estación'}: ${boxName || badgeText} [${pIdx+1}/${maxBoxes}]">
            <img src="assets/chits/${subChitName}" alt="Submarine Counter" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = `
          <div class="patrol-track-chit" style="position:absolute; inset:0; border-radius:3px; overflow:hidden; border:1px solid #d4af37; box-shadow:0 1px 4px rgba(0,0,0,0.6); pointer-events:none;" title="${boxName || badgeText} [${pIdx+1}/${maxBoxes}]">
            <img src="assets/tracks/${trackImg}" alt="${badgeText}" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block;">
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(11,19,32,0.88); border-top:1px solid rgba(212,175,55,0.7); font-family:'Cinzel', serif; font-size:0.55rem; font-weight:800; color:#fde047; text-align:center; padding:1px 0; text-transform:uppercase; letter-spacing:0.3px; line-height:1.1;">
              ${badgeText}
            </div>
          </div>
        `;
      }

      el.onclick = () => {
        if (pIdx >= maxBoxes) return;
        subBoardState.patrolIndex = pIdx;
        if (typeof campaignState !== 'undefined' && campaignState.workflow) {
          campaignState.workflow.currentBoxIndex = pIdx;
        }
        if (typeof updateBoxDisplay === 'function') updateBoxDisplay();
        if (typeof updatePhase2TableDisplay === 'function') updatePhase2TableDisplay();
        if (typeof renderRouteBreadcrumbs === 'function') renderRouteBreadcrumbs();
        saveSubBoardState();
        if (typeof saveState === 'function') saveState();
        renderInteractiveSlots();
        showToast(isEn ? `Patrol station set to Box ${pIdx+1} (${badgeText})` : `Estación de patrulla fijada en Casilla ${pIdx+1} (${badgeText})`);
      };
    }
    return;
  }

  // --- 2. DAMAGE FLOODING SLOTS ---
  else if (slot.category === 'damage-flood') {
    if (id === 'slot-flood-marker') {
      if (!subBoardState.flooding || subBoardState.flooding === 0) {
        el.innerHTML = `
          <div class="active-counter-marker flood-level-marker" title="${isEn ? 'Flooding: 0 (Normal)' : 'Inundación: 0 (Normal)'}">
            <img src="assets/chits/Flooding.jpg" alt="Flooding Chit" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = '';
      }
      el.onclick = () => {
        subBoardState.flooding = 0;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(isEn ? 'Flooding set to 0 (Normal)' : 'Inundación fijada en 0 (Normal)');
      };
      return;
    }
    const match = id.match(/slot-flood-(\d+)/);
    if (match) {
      const fLevel = parseInt(match[1]);
      const dmgCap = getSubmarineDamageCapacity(currentBoardSubKey);
      const maxFloodSlot = (dmgCap.flooding >= 8) ? 9 : 8; // Slot 8 is Surface on 7-cap, slot 9 inactive
      if (fLevel > maxFloodSlot || fLevel > dmgCap.flooding + 1) {
        el.innerHTML = '';
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.pointerEvents = 'auto';
      if (subBoardState.flooding === fLevel) {
        el.innerHTML = `
          <div class="active-counter-marker flood-level-marker" title="Nivel de Inundación: ${fLevel}">
            <img src="assets/chits/Flooding.jpg" alt="Flooding Chit" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = '';
      }
      el.onclick = () => {
        subBoardState.flooding = (subBoardState.flooding === fLevel) ? 0 : fLevel;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(isEn ? `Flooding set to Level ${subBoardState.flooding}` : `Inundación fijada en Nivel ${subBoardState.flooding}`);
      };
    }
    return;
  }

  // --- 3. DAMAGE HULL SLOTS ---
  else if (slot.category === 'damage-hull') {
    if (id === 'slot-hull-marker') {
      if (!subBoardState.hullDamage || subBoardState.hullDamage === 0) {
        el.innerHTML = `
          <div class="active-counter-marker hull-damage-marker" title="${isEn ? 'Hull Damage: 0 (Normal)' : 'Daño de Casco: 0 (Normal)'}">
            <img src="assets/chits/Hull Damage.jpg" alt="Hull Damage Chit" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = '';
      }
      el.onclick = () => {
        subBoardState.hullDamage = 0;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(isEn ? 'Hull Damage set to 0 (Normal)' : 'Daño de casco fijado en 0 (Normal)');
      };
      return;
    }
    const match = id.match(/slot-hull-(\d+)/);
    if (match) {
      const hLevel = parseInt(match[1]);
      const dmgCap = getSubmarineDamageCapacity(currentBoardSubKey);
      const maxHullSlot = (dmgCap.hull >= 8) ? 9 : 8; // Slot 8 is Sunk on 7-cap, slot 9 inactive
      if (hLevel > maxHullSlot || hLevel > dmgCap.hull + 1) {
        el.innerHTML = '';
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.pointerEvents = 'auto';
      if (subBoardState.hullDamage === hLevel) {
        el.innerHTML = `
          <div class="active-counter-marker hull-damage-marker" title="Impactos de Casco: ${hLevel}">
            <img src="assets/chits/Hull Damage.jpg" alt="Hull Damage Chit" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = '';
      }
      el.onclick = () => {
        subBoardState.hullDamage = (subBoardState.hullDamage === hLevel) ? 0 : hLevel;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(isEn ? `Hull Damage set to ${subBoardState.hullDamage}` : `Daño de casco fijado en ${subBoardState.hullDamage}`);
      };
    }
    return;
  }

  // --- 4. CREW STATUS & CREW QUALITY SLOTS ---
  else if (slot.category === 'crew') {
    const crewId = id.replace('slot-crew-', '');
    const subObj = (SUB_DB.submarines && SUB_DB.submarines[currentBoardSubKey]) ? SUB_DB.submarines[currentBoardSubKey] : null;
    const crewCount = (subObj && typeof subObj.crew_counters === 'number') ? subObj.crew_counters : 4;
    const hasAir = subObj ? !!subObj.has_aircraft : false;
    const isMidget = !!(subObj && subObj.is_midget_sub);

    if (crewId === 'quality') {
      const q = subBoardState.crewQuality || 'trained';
      const qChit = CREW_QUALITY_CHITS[q] || 'Crew Trained.jpg';
      el.style.display = 'block';
      el.style.pointerEvents = 'auto';
      el.innerHTML = `
        <div class="slot-badge-overlay badge-crew-quality" title="Calidad: ${q.toUpperCase()}">
          <img src="assets/chits/${qChit}" alt="${q}" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));">
        </div>
      `;
      el.onclick = () => {
        const qList = ['green', 'trained', 'veteran', 'elite'];
        let idx = qList.indexOf(subBoardState.crewQuality || 'trained');
        subBoardState.crewQuality = qList[(idx + 1) % qList.length];
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(`Calidad de Tripulación: ${subBoardState.crewQuality.toUpperCase()}`);
      };
      return;
    }

    // Inactive / Disabled slot checks
    if (crewId === 'spec') {
      if (isMidget || (!hasAir && currentBoardSubKey !== 'Type_C_Class')) {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
        el.innerHTML = '';
        return;
      }
    } else if (crewId === 'crew-5') {
      if (isMidget || crewCount < 5) {
        el.style.display = 'none';
        el.style.pointerEvents = 'none';
        el.innerHTML = '';
        return;
      }
    } else if (isMidget && crewId.startsWith('crew-')) {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
      el.innerHTML = '';
      return;
    }

    el.style.display = 'block';
    el.style.pointerEvents = 'auto';

    const status = subBoardState.crew[crewId] || 'active';
    if (status === 'wounded') {
      el.innerHTML = `
        <div class="slot-badge-overlay badge-wounded" title="Herida Leve">
          <img src="assets/chits/Light Wounds.jpg" alt="Herido" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else if (status === 'serious') {
      el.innerHTML = `
        <div class="slot-badge-overlay badge-serious-wounded" title="Herida Grave (SW)">
          <img src="assets/chits/Serious Wounds.jpg" alt="Herida Grave" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else if (status === 'ill') {
      el.innerHTML = `
        <div class="slot-badge-overlay badge-ill" title="Enfermo">
          <img src="assets/chits/Crew ill.jpg" alt="Enfermo" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else if (status === 'kia') {
      el.innerHTML = `
        <div class="slot-badge-overlay badge-kia" title="Baja / KIA">
          <img src="assets/chits/KIA.jpg" alt="KIA" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else {
      el.innerHTML = '';
    }

    // Dynamic tooltip for pilot / specialist
    if (crewId === 'spec' && hasAir) {
      const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
      let pilotTitle = '';
      if (status === 'wounded') pilotTitle = isEn ? "Floatplane Pilot: Light Wound (LW)" : "Piloto del Hidroavión: Herida Leve (LW)";
      else if (status === 'serious') pilotTitle = isEn ? "Floatplane Pilot: Serious Wound (SW - Unfit to fly)" : "Piloto del Hidroavión: Herida Grave (SW - No apto para vuelo)";
      else if (status === 'ill') pilotTitle = isEn ? "Floatplane Pilot: Ill (Unfit to fly)" : "Piloto del Hidroavión: Enfermo (No apto para vuelo)";
      else if (status === 'kia') pilotTitle = isEn ? "Floatplane Pilot: K.I.A. (Casualty)" : "Piloto del Hidroavión: Baja en Combate (KIA)";
      else pilotTitle = isEn ? "Floatplane Pilot: Healthy (Flight Ready)" : "Piloto del Hidroavión: Sano (Apto para vuelo)";

      if (subBoardState.aircraftFlightStatus === 'airborne') {
        pilotTitle += isEn ? " [IN FLIGHT ✈️]" : " [EN VUELO ✈️]";
      }
      el.title = pilotTitle;
    }

    el.onclick = () => {
      // Cycle: active -> wounded -> serious -> ill -> kia -> active
      const cycle = ['active', 'wounded', 'serious', 'ill', 'kia'];
      let curIdx = cycle.indexOf(status);
      const nextStatus = cycle[(curIdx + 1) % cycle.length];
      subBoardState.crew[crewId] = nextStatus;
      
      // Sync to aircraftState pilot if this is the floatplane pilot!
      if (crewId === 'spec' && hasAir) {
        if (window.campaignState && window.campaignState.aircraftState) {
          const activeIdx = window.campaignState.aircraftState.activeSlot || 0;
          const s = window.campaignState.aircraftState.slots[activeIdx];
          if (s) {
            if (nextStatus === 'wounded') s.pilot = 'lw';
            else if (nextStatus === 'serious' || nextStatus === 'ill') s.pilot = 'sw';
            else if (nextStatus === 'kia') s.pilot = 'kia';
            else s.pilot = 'ok';
          }
        }
      }

      // Also sync officer injuries to campaignState
      if (typeof campaignState !== 'undefined' && campaignState.crewInjuries) {
        if (crewId === 'capt') campaignState.crewInjuries.captain = (nextStatus === 'serious' || nextStatus === 'kia' || nextStatus === 'wounded');
        if (crewId === 'xo') campaignState.crewInjuries.xo = (nextStatus === 'serious' || nextStatus === 'kia' || nextStatus === 'wounded');
        if (crewId === 'eng') campaignState.crewInjuries.engineer = (nextStatus === 'serious' || nextStatus === 'kia' || nextStatus === 'wounded');
        if (crewId === 'nav') campaignState.crewInjuries.navigator = (nextStatus === 'serious' || nextStatus === 'kia' || nextStatus === 'wounded');
        if (typeof saveState === 'function') saveState();
      }

      saveSubBoardState();
      renderInteractiveSlots();
      const slotLbl = (window.currentLang === 'en' ? slot.label_en : slot.label_es) || slot.id;
      showToast(`${slotLbl}: ${nextStatus.toUpperCase()}`);
    };
  }

  // --- 5. SYSTEMS STATUS SLOTS ---
  else if (slot.category === 'system') {
    const matchIdx = id.match(/slot-sys-(\d+)/);
    let sysName = null;
    let sysId = null;
    let labelEs = slot.label_es;
    let labelEn = slot.label_en;

    if (matchIdx) {
      const idx = parseInt(matchIdx[1]);
      const subSystems = SUB_SYSTEMS_MAP[currentBoardSubKey] || [];
      if (idx < subSystems.length && subSystems[idx] && subSystems[idx] !== 'N/A') {
        sysName = subSystems[idx];
        sysId = getSystemKey(sysName);
        labelEs = getLocalizedSystemName(sysName, 'es');
        labelEn = getLocalizedSystemName(sysName, 'en');
      } else {
        // Inactive slot on this submarine: hide completely and disable pointer
        el.innerHTML = '';
        el.style.pointerEvents = 'none';
        return;
      }
    } else {
      sysId = id.replace('slot-sys-', '');
    }

    el.style.pointerEvents = 'auto';
    const activeLabel = isEn ? labelEn : labelEs;

    // Check state (support both indexed and key-based, with legacy fallbacks)
    let stateVal = subBoardState.systems[sysId];
    if (stateVal === undefined && matchIdx) {
      stateVal = subBoardState.systems[`sys-${matchIdx[1]}`];
    }
    if (!stateVal) {
      if (sysId.startsWith('diesel-') && subBoardState.systems['diesel']) stateVal = subBoardState.systems['diesel'];
      if (sysId.startsWith('elec-') && subBoardState.systems['elec']) stateVal = subBoardState.systems['elec'];
      if (sysId.startsWith('f-doors') && subBoardState.systems['f-doors']) stateVal = subBoardState.systems['f-doors'];
    }

    if (stateVal === 'dmg' || stateVal === true) {
      const chitInfo = SYSTEM_CHIT_MAP[sysId] || { dmg: "Damage.jpg" };
      el.innerHTML = `
        <div class="slot-badge-overlay badge-system-damaged" title="${activeLabel}: ${isEn ? 'Damaged' : 'Avería (Dañado)'}">
          <img src="assets/chits/${chitInfo.dmg}" alt="Avería" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else if (stateVal === 'inop') {
      const chitInfo = SYSTEM_CHIT_MAP[sysId] || { inop: "Inop.jpg" };
      el.innerHTML = `
        <div class="slot-badge-overlay badge-system-inop" title="${activeLabel}: ${isEn ? 'Inoperable (INOP)' : 'Sistema Inoperativo (INOP)'}">
          <img src="assets/chits/${chitInfo.inop}" alt="Inoperativo" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
    } else {
      el.innerHTML = '';
    }

    el.onclick = () => {
      // Cycle: false (ok) -> 'dmg' -> 'inop' -> false
      let nextState = false;
      if (!stateVal) nextState = 'dmg';
      else if (stateVal === 'dmg' || stateVal === true) nextState = 'inop';
      else nextState = false;

      subBoardState.systems[sysId] = nextState;
      if (matchIdx) subBoardState.systems[`sys-${matchIdx[1]}`] = nextState;
      saveSubBoardState();
      renderInteractiveSlots();
      showToast(`${activeLabel}: ${nextState ? nextState.toUpperCase() : (isEn ? "OPERATIONAL" : "OPERATIVO")}`);
    };
  }

  // --- 6. TORPEDO TUBES SLOTS ---
  else if (slot.category === 'tube-fwd') {
    const match = id.match(/slot-tube-(\d+)/);
    if (match) {
      const tubeNum = parseInt(match[1]);
      const cfg = getSubmarineArmamentConfig(currentBoardSubKey);
      if (tubeNum > cfg.fwdTubes) {
        // Inactive forward tube on this submarine!
        el.innerHTML = '';
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.pointerEvents = 'auto';
      const isLoaded = (subBoardState.tubes && subBoardState.tubes[tubeNum] !== false);
      const torpType = (subBoardState.tubeTypes && subBoardState.tubeTypes[tubeNum]) || 'type95';
      const typeLabel = getTorpedoTypeLabel(torpType, isEn);
      const chitName = getTorpedoChit(torpType, false);
      const typeShort = (torpType === 'type95') ? 'T-95 Oxíg' : ((torpType === 'type92') ? 'T-92 Eléc' : ((torpType === 'type6') ? 'T-6 Vapor' : 'T-89'));

      if (!isLoaded) {
        el.innerHTML = `
          <div class="slot-badge-overlay badge-tube-discharged" style="position:absolute; inset:0; background:rgba(15,23,42,0.94); border:2px solid #ef4444; border-radius:4px; box-shadow:0 0 10px rgba(239,68,68,0.85); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fca5a5; cursor:pointer;" title="${isEn ? 'Bow Tube' : 'Tubo Proa'} ${tubeNum}: ${isEn ? 'DISCHARGED / EMPTY (Click to reload from reserve)' : 'DISPARADO / VACÍO (Clic para recargar desde reserva)'}">
            <div style="position:absolute; top:0; left:0; right:0; background:rgba(153,27,27,0.95); border-bottom:1px solid #ef4444; color:#fecaca; font-family:'Cinzel', serif; font-size:0.58rem; font-weight:800; text-align:center; padding:1px 0; text-shadow:0 1px 2px #000; letter-spacing:0.4px; line-height:1.1;">
              T${tubeNum} • ${isEn ? "EMPTY" : "VACÍO"}
            </div>
            <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
              <span style="font-size:1.15rem; line-height:1;">💥</span>
              <span style="font-size:0.56rem; font-weight:bold; color:#f87171; letter-spacing:0.4px;">${isEn ? "DISCHARGED" : "DISPARADO"}</span>
              <span style="font-size:0.50rem; color:#a7f3d0; margin-top:1px; background:rgba(6,95,70,0.7); padding:1px 4px; border-radius:2px; font-weight:bold;">${isEn ? "Click: Reload" : "Clic: Recargar"}</span>
            </div>
          </div>
        `;
      } else {
        el.innerHTML = `
          <div class="active-counter-marker torpedo-tube-marker" style="position:relative; width:100%; height:100%; border:2px solid #10b981; border-radius:4px; box-shadow:0 0 8px rgba(16,185,129,0.8), inset 0 0 6px rgba(16,185,129,0.4); overflow:hidden; cursor:pointer;" title="${isEn ? 'Bow Tube' : 'Tubo Proa'} ${tubeNum}: ${typeLabel} [${isEn ? 'Click: Fire | Shift+Click: Cycle type' : 'Clic: Disparar | Shift+Clic: Cambiar tipo'}]">
            <img src="assets/chits/${chitName}" alt="${typeLabel}" style="width:100%; height:100%; object-fit:cover; display:block;">
            <div style="position:absolute; top:0; left:0; right:0; background:rgba(6,95,70,0.95); border-bottom:1px solid #10b981; color:#a7f3d0; font-family:'Cinzel', serif; font-size:0.58rem; font-weight:800; text-align:center; padding:1px 0; text-shadow:0 1px 2px #000; letter-spacing:0.4px; line-height:1.1;">
              T${tubeNum} • ${isEn ? "READY" : "CARGADO"}
            </div>
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(15,23,42,0.85); font-size:0.50rem; color:#fde047; font-weight:bold; text-align:center; padding:0 1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${typeShort}
            </div>
          </div>
        `;
      }
      el.onclick = (e) => {
        if (e.shiftKey) {
          cycleTubeTorpedoType(tubeNum);
          return;
        }
        if (isLoaded) {
          fireSingleTube(tubeNum);
        } else {
          reloadSingleTube(tubeNum);
        }
      };
      el.oncontextmenu = (e) => {
        e.preventDefault();
        cycleTubeTorpedoType(tubeNum);
      };
    }
  }
  else if (slot.category === 'tube-aft') {
    const match = id.match(/slot-aft-(\d+)/);
    if (match) {
      const aftIdx = parseInt(match[1]); // 1..4
      const cfg = getSubmarineArmamentConfig(currentBoardSubKey);
      const tubeNum = cfg.fwdTubes + aftIdx;
      if (aftIdx <= cfg.aftTubes) {
        el.style.pointerEvents = 'auto';
        const isLoaded = (subBoardState.tubes && subBoardState.tubes[tubeNum] !== false);
        const torpType = (subBoardState.tubeTypes && subBoardState.tubeTypes[tubeNum]) || 'type95';
        const typeLabel = getTorpedoTypeLabel(torpType, isEn);
        const chitName = getTorpedoChit(torpType, false);
        const typeShort = (torpType === 'type95') ? 'T-95 Oxíg' : ((torpType === 'type92') ? 'T-92 Eléc' : ((torpType === 'type6') ? 'T-6 Vapor' : 'T-89'));

        if (!isLoaded) {
          el.innerHTML = `
            <div class="slot-badge-overlay badge-tube-discharged" style="position:absolute; inset:0; background:rgba(15,23,42,0.94); border:2px solid #ef4444; border-radius:4px; box-shadow:0 0 10px rgba(239,68,68,0.85); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fca5a5; cursor:pointer;" title="${isEn ? 'Aft Tube' : 'Tubo Popa'} ${tubeNum}: ${isEn ? 'DISCHARGED / EMPTY (Click to reload from reserve)' : 'DISPARADO / VACÍO (Clic para recargar desde reserva)'}">
              <div style="position:absolute; top:0; left:0; right:0; background:rgba(153,27,27,0.95); border-bottom:1px solid #ef4444; color:#fecaca; font-family:'Cinzel', serif; font-size:0.58rem; font-weight:800; text-align:center; padding:1px 0; text-shadow:0 1px 2px #000; letter-spacing:0.3px; line-height:1.1;">
                T${tubeNum} POPA • ${isEn ? "EMPTY" : "VACÍO"}
              </div>
              <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                <span style="font-size:1.15rem; line-height:1;">💥</span>
                <span style="font-size:0.56rem; font-weight:bold; color:#f87171; letter-spacing:0.4px;">${isEn ? "DISCHARGED" : "DISPARADO"}</span>
                <span style="font-size:0.50rem; color:#a7f3d0; margin-top:1px; background:rgba(6,95,70,0.7); padding:1px 4px; border-radius:2px; font-weight:bold;">${isEn ? "Click: Reload" : "Clic: Recargar"}</span>
              </div>
            </div>
          `;
        } else {
          el.innerHTML = `
            <div class="active-counter-marker torpedo-tube-marker" style="position:relative; width:100%; height:100%; border:2px solid #10b981; border-radius:4px; box-shadow:0 0 8px rgba(16,185,129,0.8), inset 0 0 6px rgba(16,185,129,0.4); overflow:hidden; cursor:pointer;" title="${isEn ? 'Aft Tube' : 'Tubo Popa'} ${tubeNum}: ${typeLabel} [${isEn ? 'Click: Fire | Shift+Click: Cycle type' : 'Clic: Disparar | Shift+Clic: Cambiar tipo'}]">
              <img src="assets/chits/${chitName}" alt="${typeLabel}" style="width:100%; height:100%; object-fit:cover; display:block;">
              <div style="position:absolute; top:0; left:0; right:0; background:rgba(6,95,70,0.95); border-bottom:1px solid #10b981; color:#a7f3d0; font-family:'Cinzel', serif; font-size:0.58rem; font-weight:800; text-align:center; padding:1px 0; text-shadow:0 1px 2px #000; letter-spacing:0.3px; line-height:1.1;">
                T${tubeNum} POPA • ${isEn ? "READY" : "CARGADO"}
              </div>
              <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(15,23,42,0.85); font-size:0.50rem; color:#fde047; font-weight:bold; text-align:center; padding:0 1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                ${typeShort}
              </div>
            </div>
          `;
        }
        el.onclick = (e) => {
          if (e.shiftKey) {
            cycleTubeTorpedoType(tubeNum);
            return;
          }
          if (isLoaded) {
            fireSingleTube(tubeNum);
          } else {
            reloadSingleTube(tubeNum);
          }
        };
        el.oncontextmenu = (e) => {
          e.preventDefault();
          cycleTubeTorpedoType(tubeNum);
        };
      } else {
        // Aft reloads (e.g. Kaidai KD4 has 2 aft reloads on slots 3 & 4)
        const aftRldIdx = aftIdx - cfg.aftTubes;
        const hasAftRld = (cfg.aftReloads > 0);
        if (hasAftRld && aftRldIdx <= cfg.aftReloads) {
          el.style.pointerEvents = 'auto';
          const rKey = `aft_${aftRldIdx}`;
          const isAvail = (subBoardState.reloads && subBoardState.reloads[rKey] !== false);
          const torpType = (subBoardState.reloadTypes && subBoardState.reloadTypes[rKey]) || 'type95';
          const typeLabel = getTorpedoTypeLabel(torpType, isEn);
          const chitName = getTorpedoChit(torpType, true);
          const typeShort = (torpType === 'type95') ? 'T-95 Oxíg' : ((torpType === 'type92') ? 'T-92 Eléc' : ((torpType === 'type6') ? 'T-6 Vapor' : 'T-89'));

          if (!isAvail) {
            el.innerHTML = `
              <div class="slot-badge-overlay badge-reload-spent" style="position:absolute; inset:0; background:rgba(15,23,42,0.92); border:1.5px dashed #64748b; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; cursor:pointer;" title="${isEn ? 'Aft Reload' : 'Recarga Popa'} ${aftRldIdx}: ${isEn ? 'SPENT' : 'GASTADA / CONSUMIDA'}">
                <div style="position:absolute; top:0; left:0; right:0; background:rgba(30,41,59,0.95); border-bottom:1px solid #475569; color:#94a3b8; font-family:'Cinzel', serif; font-size:0.56rem; font-weight:800; text-align:center; padding:1px 0; letter-spacing:0.3px; line-height:1.1;">
                  R-POPA ${aftRldIdx} • ${isEn ? "SPENT" : "GASTADA"}
                </div>
                <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                  <span style="font-size:1.0rem; line-height:1; color:#94a3b8;">✖</span>
                  <span style="font-size:0.52rem; font-weight:bold; color:#64748b;">${isEn ? "CONSUMED" : "CONSUMIDA"}</span>
                </div>
              </div>
            `;
          } else {
            el.innerHTML = `
              <div class="active-counter-marker torpedo-reload-marker" style="position:relative; width:100%; height:100%; border:1.5px solid #0284c7; border-radius:4px; box-shadow:0 0 6px rgba(2,132,199,0.5); overflow:hidden; cursor:pointer;" title="${isEn ? 'Aft Reload' : 'Recarga Popa'} ${aftRldIdx}: ${typeLabel} [${isEn ? 'Click: Load into empty aft tube | Shift+Click: Cycle type' : 'Clic: Cargar en tubo de popa vacío | Shift+Clic: Cambiar tipo'}]">
                <img src="assets/chits/${chitName}" alt="${typeLabel}" style="width:100%; height:100%; object-fit:cover; display:block;">
                <div style="position:absolute; top:0; left:0; right:0; background:rgba(12,74,110,0.95); border-bottom:1px solid #38bdf8; color:#bae6fd; font-family:'Cinzel', serif; font-size:0.56rem; font-weight:800; text-align:center; padding:1px 0; text-shadow:0 1px 2px #000; letter-spacing:0.3px; line-height:1.1;">
                  R-POPA ${aftRldIdx} • ${isEn ? "READY" : "RESERVA"}
                </div>
                <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(15,23,42,0.85); font-size:0.50rem; color:#7dd3fc; font-weight:bold; text-align:center; padding:0 1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                  ${typeShort}
                </div>
              </div>
            `;
          }
          el.onclick = (e) => {
            if (e.shiftKey) {
              cycleReloadTorpedoType(rKey);
              return;
            }
            useAftReserveReload(rKey, aftRldIdx);
          };
          el.oncontextmenu = (e) => {
            e.preventDefault();
            cycleReloadTorpedoType(rKey);
          };
        } else {
          el.innerHTML = '';
          el.style.pointerEvents = 'none';
        }
      }
    }
  }

  // --- 7. TORPEDO RELOADS SLOTS ---
  else if (slot.category === 'reload') {
    const match = id.match(/slot-reload-(\d+)/);
    if (match) {
      const rNum = parseInt(match[1]);
      const cfg = getSubmarineArmamentConfig(currentBoardSubKey);
      if (rNum > cfg.fwdReloads) {
        // Inactive reload slot on this submarine!
        el.innerHTML = '';
        el.style.pointerEvents = 'none';
        return;
      }
      el.style.pointerEvents = 'auto';
      const isAvailable = (subBoardState.reloads && subBoardState.reloads[rNum] !== false);
      const torpType = (subBoardState.reloadTypes && subBoardState.reloadTypes[rNum]) || 'type95';
      const typeLabel = getTorpedoTypeLabel(torpType, isEn);
      const chitName = getTorpedoChit(torpType, true);
      const typeShort = (torpType === 'type95') ? 'T-95 Oxíg' : ((torpType === 'type92') ? 'T-92 Eléc' : ((torpType === 'type6') ? 'T-6 Vapor' : 'T-89'));

      if (!isAvailable) {
        el.innerHTML = `
          <div class="slot-badge-overlay badge-reload-spent" style="position:absolute; inset:0; background:rgba(15,23,42,0.92); border:1.5px dashed #64748b; border-radius:4px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; cursor:pointer;" title="${isEn ? 'Bow Reload' : 'Recarga Proa'} ${rNum}: ${isEn ? 'SPENT' : 'GASTADA / CONSUMIDA'}">
            <div style="position:absolute; top:0; left:0; right:0; background:rgba(30,41,59,0.95); border-bottom:1px solid #475569; color:#94a3b8; font-family:'Cinzel', serif; font-size:0.56rem; font-weight:800; text-align:center; padding:1px 0; letter-spacing:0.3px; line-height:1.1;">
              R${rNum} • ${isEn ? "SPENT" : "GASTADA"}
            </div>
            <div style="margin-top:10px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
              <span style="font-size:1.0rem; line-height:1; color:#94a3b8;">✖</span>
              <span style="font-size:0.52rem; font-weight:bold; color:#64748b;">${isEn ? "CONSUMED" : "CONSUMIDA"}</span>
            </div>
          </div>
        `;
      } else {
        el.innerHTML = `
          <div class="active-counter-marker torpedo-reload-marker" style="position:relative; width:100%; height:100%; border:1.5px solid #0284c7; border-radius:4px; box-shadow:0 0 6px rgba(2,132,199,0.5); overflow:hidden; cursor:pointer;" title="${isEn ? 'Bow Reload' : 'Recarga Proa'} ${rNum}: ${typeLabel} [${isEn ? 'Click: Load into empty bow tube | Shift+Click: Cycle type' : 'Clic: Cargar en tubo de proa vacío | Shift+Clic: Cambiar tipo'}]">
            <img src="assets/chits/${chitName}" alt="${typeLabel}" style="width:100%; height:100%; object-fit:cover; display:block;">
            <div style="position:absolute; top:0; left:0; right:0; background:rgba(12,74,110,0.95); border-bottom:1px solid #38bdf8; color:#bae6fd; font-family:'Cinzel', serif; font-size:0.56rem; font-weight:800; text-align:center; padding:1px 0; text-shadow:0 1px 2px #000; letter-spacing:0.3px; line-height:1.1;">
              R${rNum} • ${isEn ? "READY" : "RESERVA"}
            </div>
            <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(15,23,42,0.85); font-size:0.50rem; color:#7dd3fc; font-weight:bold; text-align:center; padding:0 1px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${typeShort}
            </div>
          </div>
        `;
      }
      el.onclick = (e) => {
        if (e.shiftKey) {
          cycleReloadTorpedoType(rNum);
          return;
        }
        useReserveReload(rNum);
      };
      el.oncontextmenu = (e) => {
        e.preventDefault();
        cycleReloadTorpedoType(rNum);
      };
    }
  }

  // --- 8. ARTILLERY & AMMO SLOTS ---
  else if (slot.category === 'artillery') {
    if (id === 'slot-artillery-1') { // Main Deck Gun
      if (subBoardState.deckGunDamaged) {
        el.innerHTML = `
          <div class="slot-badge-overlay badge-gun-damaged" title="Cañón Principal Averiado">
            <img src="assets/chits/Damage - Deck Gun.jpg" alt="Deck Gun Damage" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = '';
      }
      el.onclick = () => {
        subBoardState.deckGunDamaged = !subBoardState.deckGunDamaged;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(`Cañón Principal: ${subBoardState.deckGunDamaged ? "AVERIADO" : "OPERATIVO"}`);
      };
    } else if (id === 'slot-artillery-2') { // Ammo x5
      const ammoCount = (typeof subBoardState.ammo === 'number') ? subBoardState.ammo : 5;
      const ammoChit = `Ammo ${Math.max(0, Math.min(6, ammoCount))}.jpg`;
      el.innerHTML = `
        <div class="active-counter-marker ammo-counter-marker" title="Munición Restante: ${ammoCount}">
          <img src="assets/chits/${ammoChit}" alt="Ammo ${ammoCount}" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
        </div>
      `;
      el.onclick = () => {
        // Cycle ammo 5 -> 4 -> 3 -> 2 -> 1 -> 0 -> 5
        let cur = subBoardState.ammo !== undefined ? subBoardState.ammo : 5;
        cur = (cur <= 0) ? 5 : cur - 1;
        subBoardState.ammo = cur;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(`Munición de Cañón: ${cur} restantes`);
      };
    } else if (id === 'slot-artillery-3') { // AA Guns
      if (subBoardState.aaGunDamaged) {
        el.innerHTML = `
          <div class="slot-badge-overlay badge-aa-damaged" title="Antiaéreo Averiado">
            <img src="assets/chits/Damage - AA Gun.jpg" alt="AA Gun Damage" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          </div>
        `;
      } else {
        el.innerHTML = '';
      }
      el.onclick = () => {
        subBoardState.aaGunDamaged = !subBoardState.aaGunDamaged;
        saveSubBoardState();
        renderInteractiveSlots();
        showToast(`Antiaéreo: ${subBoardState.aaGunDamaged ? "AVERIADO" : "OPERATIVO"}`);
      };
    } else if (id === 'slot-artillery-4') {
      // Inactive 4th slot on universal layout
      el.innerHTML = '';
      el.style.pointerEvents = 'none';
    }
  }

  // --- 9. AIRCRAFT & TACTICAL EVENT SLOTS ---
  else if (slot.category === 'aircraft') {
    const cfg = getSubmarineArmamentConfig(currentBoardSubKey);
    const airCount = (typeof cfg.aircraftCount === 'number') ? cfg.aircraftCount : (cfg.hasAircraft ? 1 : 0);

    if (!cfg.hasAircraft || airCount === 0) {
      // Inactive aircraft slot on this submarine! 100% clean, let PDF card show through!
      el.innerHTML = '';
      el.style.pointerEvents = 'none';
      return;
    }

    // slot-air-2 is ONLY active if submarine carries 2 or more aircraft (e.g. Type A2 or Sen-Toku)
    if (slot.id === 'slot-air-2' && airCount < 2) {
      el.innerHTML = '';
      el.style.pointerEvents = 'none';
      return;
    }

    const isPlane2 = (slot.id === 'slot-air-2');
    const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en') || (typeof window !== 'undefined' && window.currentLang === 'en');
    
    // Retrieve damage and flight status
    const dmg = isPlane2 
      ? (typeof subBoardState.aircraftDamageLevel2 === 'number' ? subBoardState.aircraftDamageLevel2 : (subBoardState.aircraftDamaged2 ? 1 : 0))
      : (typeof subBoardState.aircraftDamageLevel === 'number' ? subBoardState.aircraftDamageLevel : (subBoardState.aircraftDamaged ? 1 : 0));
    const flightStatus = isPlane2 ? subBoardState.aircraftFlightStatus2 : subBoardState.aircraftFlightStatus;
    const isAirborne = (flightStatus === 'airborne');
    const isLost = (flightStatus === 'lost' || flightStatus === 'crashed' || dmg >= 3);

    el.style.pointerEvents = 'auto';

    let overlayHtml = '';
    let titleStr = '';

    if (isLost) {
      titleStr = isPlane2 
        ? (isEn ? "Floatplane #2: DESTROYED / LOST (Click to cycle / Shift-click for Chart P)" : "Hidroavión #2: DESTRUIDO / PERDIDO (Clic para alternar / Shift+clic para Chart P)")
        : (isEn ? "Floatplane: DESTROYED / LOST (Click to cycle / Shift-click for Chart P)" : "Hidroavión: DESTRUIDO / PERDIDO (Clic para alternar / Shift+clic para Chart P)");
      overlayHtml = `
        <div class="slot-badge-overlay badge-aircraft-damaged" style="position:relative; width:100%; height:100%;">
          <img src="assets/chits/Damage - Aircraft.jpg" alt="Destroyed" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          <span style="position:absolute; bottom:1px; right:1px; background:#ef4444; color:#fff; font-size:0.55rem; font-weight:900; padding:1px 3px; border-radius:2px; border:1px solid #7f1d1d; line-height:1;">KIA</span>
        </div>
      `;
    } else if (dmg === 2) {
      titleStr = isPlane2 
        ? (isEn ? "Floatplane #2: HEAVY DAMAGE (Abort) (Click to cycle / Shift-click for Chart P)" : "Hidroavión #2: DAÑO GRAVE (Abortar) (Clic para alternar / Shift+clic para Chart P)")
        : (isEn ? "Floatplane: HEAVY DAMAGE (Abort) (Click to cycle / Shift-click for Chart P)" : "Hidroavión: DAÑO GRAVE (Abortar) (Clic para alternar / Shift+clic para Chart P)");
      overlayHtml = `
        <div class="slot-badge-overlay badge-aircraft-damaged" style="position:relative; width:100%; height:100%;">
          <img src="assets/chits/Damage - Aircraft.jpg" alt="Damage 2" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          <span style="position:absolute; bottom:1px; right:1px; background:#f97316; color:#fff; font-size:0.55rem; font-weight:900; padding:1px 3px; border-radius:2px; border:1px solid #9a3412; line-height:1;">2</span>
        </div>
      `;
    } else if (dmg === 1) {
      titleStr = isPlane2 
        ? (isEn ? "Floatplane #2: LIGHT DAMAGE (Click to cycle / Shift-click for Chart P)" : "Hidroavión #2: DAÑO LEVE (Clic para alternar / Shift+clic para Chart P)")
        : (isEn ? "Floatplane: LIGHT DAMAGE (Click to cycle / Shift-click for Chart P)" : "Hidroavión: DAÑO LEVE (Clic para alternar / Shift+clic para Chart P)");
      overlayHtml = `
        <div class="slot-badge-overlay badge-aircraft-damaged" style="position:relative; width:100%; height:100%;">
          <img src="assets/chits/Damage - Aircraft.jpg" alt="Damage 1" style="width:100%; height:100%; object-fit:cover; border-radius:3px; filter:drop-shadow(0 2px 5px rgba(0,0,0,0.85));">
          <span style="position:absolute; bottom:1px; right:1px; background:#eab308; color:#000; font-size:0.55rem; font-weight:900; padding:1px 3px; border-radius:2px; border:1px solid #854d0e; line-height:1;">1</span>
        </div>
      `;
    } else if (isAirborne) {
      const planeChit = (typeof getActiveAircraftChit === 'function') ? getActiveAircraftChit() : 'assets/chits/aircraft_yokosuka_e14y_glen.jpg';
      titleStr = isPlane2 
        ? (isEn ? "Floatplane #2: IN FLIGHT (Airborne)" : "Hidroavión #2: EN VUELO")
        : (isEn ? "Floatplane: IN FLIGHT (Airborne)" : "Hidroavión: EN VUELO");
      overlayHtml = `
        <div class="slot-badge-overlay" style="position:relative; width:100%; height:100%;">
          <img src="${planeChit}" alt="Airborne" style="width:100%; height:100%; object-fit:cover; border-radius:3px; border:2px solid #38bdf8; box-shadow:0 0 8px rgba(56,189,248,0.9);">
          <span style="position:absolute; top:-3px; right:-3px; background:#0284c7; color:#fff; font-size:0.55rem; font-weight:bold; border-radius:50%; width:14px; height:14px; display:flex; align-items:center; justify-content:center; border:1px solid #fff;">✈</span>
        </div>
      `;
    } else {
      titleStr = isPlane2 
        ? (isEn ? "Floatplane #2: OPERATIONAL (In Hangar - Click to cycle / Shift-click for Chart P)" : "Hidroavión #2: OPERATIVO (En Hangar - Clic para alternar / Shift+clic para Chart P)")
        : (isEn ? "Floatplane: OPERATIONAL (In Hangar - Click to cycle / Shift-click for Chart P)" : "Hidroavión: OPERATIVO (En Hangar - Clic para alternar / Shift+clic para Chart P)");
      overlayHtml = ''; // Shows underlying pristine card graphic!
    }

    el.innerHTML = overlayHtml;
    el.title = titleStr;

    el.onclick = (e) => {
      // If user holds Shift, open the full Aircraft Display Mat directly
      if (e && e.shiftKey) {
        if (typeof openAircraftDisplayMatModal === 'function') {
          openAircraftDisplayMatModal();
          return;
        }
      }

      // Cycle damage: 0 -> 1 -> 2 -> 3 -> 0
      const nextDmg = (dmg >= 3) ? 0 : (dmg + 1);
      if (isPlane2) {
        subBoardState.aircraftDamageLevel2 = nextDmg;
        subBoardState.aircraftDamaged2 = (nextDmg > 0);
        if (nextDmg === 0 && subBoardState.aircraftFlightStatus2 === 'lost') {
          subBoardState.aircraftFlightStatus2 = null;
        }
      } else {
        subBoardState.aircraftDamageLevel = nextDmg;
        subBoardState.aircraftDamaged = (nextDmg > 0);
        if (nextDmg === 0 && subBoardState.aircraftFlightStatus === 'lost') {
          subBoardState.aircraftFlightStatus = null;
        }
      }

      // Sync to aircraftState if loaded
      if (window.campaignState && window.campaignState.aircraftState) {
        const targetSlotIdx = isPlane2 ? 1 : (window.campaignState.aircraftState.activeSlot || 0);
        const s = window.campaignState.aircraftState.slots[targetSlotIdx];
        if (s) {
          s.damage = nextDmg;
          if (nextDmg === 3) s.launchStatus = 'crashed';
          else if (nextDmg === 0 && (s.launchStatus === 'crashed' || s.launchStatus === 'lost')) s.launchStatus = null;
        }
      }

      saveSubBoardState();
      renderInteractiveSlots();

      const dmgMsg = (nextDmg === 0) 
        ? (isEn ? "OPERATIONAL (0 Damage)" : "OPERATIVO (0 Daños)")
        : (nextDmg === 1) ? (isEn ? "LIGHT DAMAGE (1/3)" : "DAÑO LEVE (1/3)")
        : (nextDmg === 2) ? (isEn ? "HEAVY DAMAGE (2/3 - Abort)" : "DAÑO GRAVE (2/3 - Abortar)")
        : (isEn ? "DESTROYED / LOST (3/3)" : "DESTRUIDO / PERDIDO (3/3)");
      const planeLabel = isPlane2 ? (isEn ? "Floatplane #2" : "Hidroavión #2") : (isEn ? "Floatplane" : "Hidroavión");
      showToast(`${planeLabel}: ${dmgMsg}`);
    };
  }
  if (typeof syncPhase3TorpedoOptions === 'function') {
    syncPhase3TorpedoOptions();
  }
}

// -------------------------------------------------------------------------
// SYNCHRONIZATION WITH CAMPAIGN STATE & EVENTS
// -------------------------------------------------------------------------

function syncBoardFromCampaignState(showToastMsg = false) {
  if (typeof campaignState === 'undefined') return;

  // 1. Submarine Identity
  if (campaignState.activeSubKey) {
    currentBoardSubKey = campaignState.activeSubKey;
    subBoardState.activeSubKey = currentBoardSubKey;
  }

  // 2. Base & Destination Sync
  if (campaignState.workflow) {
    if (campaignState.workflow.startingBase) {
      subBoardState.startingBase = campaignState.workflow.startingBase;
    }
    if (campaignState.workflow.assignedArea) {
      subBoardState.assignedArea = campaignState.workflow.assignedArea;
    }
  }

  // 3. Patrol Location & Box
  if (campaignState.workflow && typeof campaignState.workflow.currentBoxIndex === 'number') {
    const maxPatrolBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
    let boxIdx = campaignState.workflow.currentBoxIndex;
    if (boxIdx >= maxPatrolBoxes) boxIdx = Math.max(-1, maxPatrolBoxes - 1);
    subBoardState.patrolIndex = boxIdx;
  } else {
    subBoardState.patrolIndex = -1;
  }

  // 4. Officer Casualties from Campaign State
  if (campaignState.crewInjuries) {
    if (campaignState.crewInjuries.captain) subBoardState.crew['capt'] = 'wounded';
    if (campaignState.crewInjuries.xo) subBoardState.crew['xo'] = 'wounded';
    if (campaignState.crewInjuries.engineer) subBoardState.crew['eng'] = 'wounded';
    if (campaignState.crewInjuries.navigator) subBoardState.crew['nav'] = 'wounded';
  }

  // 5. Torpedo Allocation & Loading from Campaign State
  if (campaignState.workflow && campaignState.workflow.torpedoAllocation) {
    const alloc = campaignState.workflow.torpedoAllocation;
    applyTorpedoAllocation(alloc.fwdT92 !== undefined ? alloc.fwdT92 : 4, alloc.aftT92 !== undefined ? alloc.aftT92 : 2);
  }

  saveSubBoardState();
  if (showToastMsg) {
    renderSubBoard();
    showToast("Tablero de submarino sincronizado con el progreso de campaña.");
  }
}

// Dynamic gameflow event listener hooks
window.onSensuikanPatrolMoved = function(newBoxIndex) {
  const maxPatrolBoxes = getSubmarinePatrolBoxCount(currentBoardSubKey);
  if (newBoxIndex >= maxPatrolBoxes) newBoxIndex = Math.max(-1, maxPatrolBoxes - 1);
  subBoardState.patrolIndex = newBoxIndex;
  saveSubBoardState();
  renderInteractiveSlots();
};

window.onSensuikanDestinationChanged = function(newArea) {
  if (typeof campaignState !== 'undefined' && campaignState.workflow) {
    campaignState.workflow.assignedArea = newArea;
  }
  subBoardState.assignedArea = newArea;
  if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  renderInteractiveSlots();
};

window.onSensuikanBaseChanged = function(newBase) {
  if (typeof campaignState !== 'undefined' && campaignState.workflow) {
    campaignState.workflow.startingBase = newBase;
  }
  subBoardState.startingBase = newBase;
  if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  renderInteractiveSlots();
};

window.onSensuikanTorpedoFired = function(tubesFiredCount = 1, options = {}) {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2 };

  let fwdCountReq = 0;
  let aftCountReq = 0;
  if (typeof options.fwdCount === 'number' || typeof options.aftCount === 'number') {
    fwdCountReq = options.fwdCount || 0;
    aftCountReq = options.aftCount || 0;
  } else {
    fwdCountReq = tubesFiredCount;
  }

  const torpTypePref = options.torpType || (document.getElementById('wf-torp-type-select') ? document.getElementById('wf-torp-type-select').value : null);

  if (!subBoardState.tubes) subBoardState.tubes = {};

  const fwdDoorDmg = subBoardState.systems && (subBoardState.systems['f-doors'] === 'dmg' || subBoardState.systems['fwd_torp'] === 'dmg');
  const fwdOddDmg = subBoardState.systems && subBoardState.systems['f-doors-odd'] === 'dmg';
  const fwdEvenDmg = subBoardState.systems && subBoardState.systems['f-doors-even'] === 'dmg';
  const aftDoorDmg = subBoardState.systems && subBoardState.systems['aft-doors'] === 'dmg';

  let eligibleFwd = [];
  if (!fwdDoorDmg) {
    for (let i = 1; i <= cfg.fwdTubes; i++) {
      if (i % 2 !== 0 && fwdOddDmg) continue;
      if (i % 2 === 0 && fwdEvenDmg) continue;
      if (subBoardState.tubes[i] === true) {
        eligibleFwd.push({ idx: i, isAft: false, type: (subBoardState.tubeTypes && subBoardState.tubeTypes[i]) || 'type95' });
      }
    }
  }

  let eligibleAft = [];
  if (!aftDoorDmg && cfg.aftTubes > 0) {
    for (let a = 1; a <= cfg.aftTubes; a++) {
      const idx = cfg.fwdTubes + a;
      if (subBoardState.tubes[idx] === true) {
        eligibleAft.push({ idx: idx, isAft: true, type: (subBoardState.tubeTypes && subBoardState.tubeTypes[idx]) || 'type95' });
      }
    }
  }

  if (torpTypePref) {
    eligibleFwd.sort((a, b) => ((b.type === torpTypePref ? 1 : 0) - (a.type === torpTypePref ? 1 : 0)));
    eligibleAft.sort((a, b) => ((b.type === torpTypePref ? 1 : 0) - (a.type === torpTypePref ? 1 : 0)));
  }

  let fwdFired = [];
  for (let t of eligibleFwd) {
    if (fwdFired.length >= fwdCountReq) break;
    subBoardState.tubes[t.idx] = false;
    fwdFired.push(t.idx);
  }

  let aftFired = [];
  for (let t of eligibleAft) {
    if (aftFired.length >= aftCountReq) break;
    subBoardState.tubes[t.idx] = false;
    aftFired.push(t.idx);
  }

  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
  if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();

  return {
    fwdFired,
    aftFired,
    allFired: [...fwdFired, ...aftFired]
  };
};

// =========================================================================
// TORPEDO TRACKING, CONSUMPTION & RELOAD ACTIONS (HOJA DE SUBMARINO)
// =========================================================================

function fireSingleTube(tubeNum) {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2 };

  if (!subBoardState.tubes) subBoardState.tubes = {};
  subBoardState.tubes[tubeNum] = false;

  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  renderInteractiveSlots();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
  if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();

  const isAft = (tubeNum > cfg.fwdTubes);
  showToast(isEn ? `💥 ${isAft ? 'Aft' : 'Bow'} Tube ${tubeNum} fired / empty. Click to reload from reserves.` : `💥 Tubo ${isAft ? 'de Popa' : 'de Proa'} ${tubeNum} disparado (vacío). Haz clic para recargar desde reservas.`);
}
window.fireSingleTube = fireSingleTube;

function reloadSingleTube(tubeNum) {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8, aftReloads: 2 };

  if (!subBoardState.tubes) subBoardState.tubes = {};
  if (!subBoardState.reloads) subBoardState.reloads = {};
  if (!subBoardState.tubeTypes) subBoardState.tubeTypes = {};
  if (!subBoardState.reloadTypes) subBoardState.reloadTypes = {};

  const isAft = (tubeNum > cfg.fwdTubes);

  if (!isAft) {
    // Forward tube: find first available forward reload
    let foundR = null;
    for (let r = 1; r <= (cfg.fwdReloads || 16); r++) {
      if (subBoardState.reloads[r] === true) {
        foundR = r;
        break;
      }
    }
    if (foundR !== null) {
      subBoardState.reloads[foundR] = false;
      subBoardState.tubes[tubeNum] = true;
      subBoardState.tubeTypes[tubeNum] = subBoardState.reloadTypes[foundR] || 'type95';
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
      showToast(isEn ? `✅ Bow Tube ${tubeNum} reloaded (Reserve #${foundR} consumed)` : `✅ Tubo Proa ${tubeNum} recargado (Consumida Recarga #${foundR})`);
      return true;
    } else {
      showToast(isEn ? `⚠️ No forward reserves available to reload Tube ${tubeNum}!` : `⚠️ ¡No quedan reservas de proa para recargar el Tubo ${tubeNum}!`);
      return false;
    }
  } else {
    // Aft tube: find first available aft reload
    let foundAft = null;
    if (subBoardState.reloads['aft_1'] === true) foundAft = 'aft_1';
    else if (subBoardState.reloads['aft_2'] === true) foundAft = 'aft_2';

    if (foundAft !== null) {
      subBoardState.reloads[foundAft] = false;
      subBoardState.tubes[tubeNum] = true;
      subBoardState.tubeTypes[tubeNum] = subBoardState.reloadTypes[foundAft] || 'type95';
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
      showToast(isEn ? `✅ Aft Tube ${tubeNum} reloaded (Reserve ${foundAft} consumed)` : `✅ Tubo Popa ${tubeNum} recargado (Consumida Recarga de Popa ${foundAft.replace('aft_', '#')})`);
      return true;
    } else {
      showToast(isEn ? `⚠️ No aft reserves available to reload Aft Tube ${tubeNum}!` : `⚠️ ¡No quedan reservas de popa para recargar el Tubo de Popa ${tubeNum}!`);
      return false;
    }
  }
}
window.reloadSingleTube = reloadSingleTube;

function useReserveReload(rNum) {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8 };

  if (!subBoardState.reloads) subBoardState.reloads = {};
  if (!subBoardState.tubes) subBoardState.tubes = {};

  const isAvail = (subBoardState.reloads[rNum] !== false);

  if (isAvail) {
    let emptyTube = null;
    for (let i = 1; i <= cfg.fwdTubes; i++) {
      if (subBoardState.tubes[i] === false) {
        emptyTube = i;
        break;
      }
    }
    if (emptyTube !== null) {
      subBoardState.reloads[rNum] = false;
      subBoardState.tubes[emptyTube] = true;
      subBoardState.tubeTypes[emptyTube] = (subBoardState.reloadTypes && subBoardState.reloadTypes[rNum]) || 'type95';
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
      showToast(isEn ? `✅ Reserve #${rNum} loaded into Bow Tube #${emptyTube}!` : `✅ ¡Recarga #${rNum} introducida en Tubo de Proa #${emptyTube}!`);
    } else {
      subBoardState.reloads[rNum] = false;
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
      showToast(isEn ? `Reserve #${rNum} marked as spent (all tubes already loaded).` : `Recarga #${rNum} marcada como gastada (todos los tubos de proa ya estaban llenos).`);
    }
  } else {
    subBoardState.reloads[rNum] = true;
    saveSubBoardState();
    if (typeof saveState === 'function') saveState();
    renderInteractiveSlots();
    if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
    if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
    showToast(isEn ? `Reserve #${rNum} replenished (available).` : `Recarga #${rNum} repuesta (disponible de nuevo).`);
  }
}
window.useReserveReload = useReserveReload;

function useAftReserveReload(rKey, aftRldIdx) {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2 };

  if (!subBoardState.reloads) subBoardState.reloads = {};
  if (!subBoardState.tubes) subBoardState.tubes = {};

  const isAvail = (subBoardState.reloads[rKey] !== false);

  if (isAvail) {
    let emptyAft = null;
    for (let a = 1; a <= cfg.aftTubes; a++) {
      const tNum = cfg.fwdTubes + a;
      if (subBoardState.tubes[tNum] === false) {
        emptyAft = tNum;
        break;
      }
    }
    if (emptyAft !== null) {
      subBoardState.reloads[rKey] = false;
      subBoardState.tubes[emptyAft] = true;
      subBoardState.tubeTypes[emptyAft] = (subBoardState.reloadTypes && subBoardState.reloadTypes[rKey]) || 'type95';
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
      showToast(isEn ? `✅ Aft Reserve #${aftRldIdx} loaded into Aft Tube #${emptyAft}!` : `✅ ¡Recarga de Popa #${aftRldIdx} introducida en Tubo de Popa #${emptyAft}!`);
    } else {
      subBoardState.reloads[rKey] = false;
      saveSubBoardState();
      if (typeof saveState === 'function') saveState();
      renderInteractiveSlots();
      if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
      if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
      showToast(isEn ? `Aft Reserve #${aftRldIdx} marked as spent (all aft tubes loaded).` : `Recarga de Popa #${aftRldIdx} marcada como gastada (todos los tubos de popa ya estaban llenos).`);
    }
  } else {
    subBoardState.reloads[rKey] = true;
    saveSubBoardState();
    if (typeof saveState === 'function') saveState();
    renderInteractiveSlots();
    if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
    if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
    showToast(isEn ? `Aft Reserve #${aftRldIdx} replenished (available).` : `Recarga de Popa #${aftRldIdx} repuesta (disponible de nuevo).`);
  }
}
window.useAftReserveReload = useAftReserveReload;

function updateSubBoardTorpedoSummary() {
  const summaryEl = document.getElementById('subboard-torpedo-summary-badge');
  if (!summaryEl) return;
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8, aftReloads: 2 };

  let fwdLoaded = 0;
  for (let i = 1; i <= cfg.fwdTubes; i++) {
    if (subBoardState.tubes && subBoardState.tubes[i] !== false) fwdLoaded++;
  }
  let aftLoaded = 0;
  for (let a = 1; a <= cfg.aftTubes; a++) {
    const tNum = cfg.fwdTubes + a;
    if (subBoardState.tubes && subBoardState.tubes[tNum] !== false) aftLoaded++;
  }

  let fwdReloadsAvail = 0;
  for (let r = 1; r <= (cfg.fwdReloads || 0); r++) {
    if (subBoardState.reloads && subBoardState.reloads[r] !== false) fwdReloadsAvail++;
  }
  let aftReloadsAvail = 0;
  if (cfg.aftReloads >= 1 && subBoardState.reloads && subBoardState.reloads['aft_1'] !== false) aftReloadsAvail++;
  if (cfg.aftReloads >= 2 && subBoardState.reloads && subBoardState.reloads['aft_2'] !== false) aftReloadsAvail++;

  const totalLoaded = fwdLoaded + aftLoaded;
  const totalTubes = cfg.fwdTubes + cfg.aftTubes;
  const totalReloadsAvail = fwdReloadsAvail + aftReloadsAvail;
  const totalReloads = (cfg.fwdReloads || 0) + (cfg.aftReloads || 0);

  summaryEl.innerHTML = isEn
    ? `🚀 <strong>Tubes:</strong> ${totalLoaded}/${totalTubes} (${fwdLoaded} Fwd${cfg.aftTubes > 0 ? ` • ${aftLoaded} Aft` : ''}) &nbsp;|&nbsp; 📦 <strong>Reserves:</strong> ${totalReloadsAvail}/${totalReloads}`
    : `🚀 <strong>Tubos:</strong> ${totalLoaded}/${totalTubes} (${fwdLoaded} Proa${cfg.aftTubes > 0 ? ` • ${aftLoaded} Popa` : ''}) &nbsp;|&nbsp; 📦 <strong>Reservas:</strong> ${totalReloadsAvail}/${totalReloads}`;
}
window.updateSubBoardTorpedoSummary = updateSubBoardTorpedoSummary;

window.reloadAllEmptyTubesFromReserves = function() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8, aftReloads: 2 };

  if (!subBoardState.tubes) subBoardState.tubes = {};
  if (!subBoardState.reloads) subBoardState.reloads = {};
  if (!subBoardState.tubeTypes) subBoardState.tubeTypes = {};
  if (!subBoardState.reloadTypes) subBoardState.reloadTypes = {};

  let reloadedCount = 0;

  // 1. Forward tubes
  for (let i = 1; i <= cfg.fwdTubes; i++) {
    if (subBoardState.tubes[i] === false) {
      let foundReloadIdx = null;
      for (let r = 1; r <= (cfg.fwdReloads || 16); r++) {
        if (subBoardState.reloads[r] === true) {
          foundReloadIdx = r;
          break;
        }
      }
      if (foundReloadIdx !== null) {
        subBoardState.reloads[foundReloadIdx] = false;
        subBoardState.tubes[i] = true;
        subBoardState.tubeTypes[i] = subBoardState.reloadTypes[foundReloadIdx] || 'type95';
        reloadedCount++;
      }
    }
  }

  // 2. Aft tubes
  for (let a = 1; a <= cfg.aftTubes; a++) {
    const tNum = cfg.fwdTubes + a;
    if (subBoardState.tubes[tNum] === false) {
      let foundAftKey = null;
      if (subBoardState.reloads['aft_1'] === true) foundAftKey = 'aft_1';
      else if (subBoardState.reloads['aft_2'] === true) foundAftKey = 'aft_2';

      if (foundAftKey) {
        subBoardState.reloads[foundAftKey] = false;
        subBoardState.tubes[tNum] = true;
        subBoardState.tubeTypes[tNum] = subBoardState.reloadTypes[foundAftKey] || 'type95';
        reloadedCount++;
      }
    }
  }

  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
  if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();

  if (reloadedCount > 0) {
    showToast(isEn ? `✅ ${reloadedCount} torpedo tubes reloaded from reserves!` : `✅ ¡${reloadedCount} tubos recargados desde las reservas!`);
  } else {
    showToast(isEn ? `⚠️ No empty tubes or no reserves available.` : `⚠️ Todos los tubos ya están cargados o no quedan reservas.`);
  }
};

window.switchToSubmarineSheet = function() {
  if (typeof switchTab === 'function') {
    switchTab('sub-board');
    showToast(window.currentLang === 'en' ? 'Showing Submarine Card' : 'Mostrando Ficha de Submarino');
  }
};

window.onSensuikanDamageTaken = function(dmgType, count = 1) {
  if (dmgType === 'flood') {
    subBoardState.flooding = Math.min(8, (subBoardState.flooding || 0) + count);
  } else if (dmgType === 'hull') {
    subBoardState.hullDamage = Math.min(8, (subBoardState.hullDamage || 0) + count);
  } else if (SYSTEM_CHIT_MAP[dmgType]) {
    subBoardState.systems[dmgType] = 'dmg';
  }
  saveSubBoardState();
  renderInteractiveSlots();
};

window.onSensuikanRepaired = function(sysKey) {
  if (sysKey === 'flood') {
    subBoardState.flooding = Math.max(0, (subBoardState.flooding || 0) - 1);
  } else if (subBoardState.systems[sysKey]) {
    subBoardState.systems[sysKey] = false;
  }
  saveSubBoardState();
  renderInteractiveSlots();
};

function loadAllTorpedoes() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8, aftReloads: 2 };

  if (!subBoardState.tubes) subBoardState.tubes = {};
  if (!subBoardState.reloads) subBoardState.reloads = {};
  for (let i = 1; i <= cfg.fwdTubes; i++) subBoardState.tubes[i] = true;
  for (let a = 1; a <= cfg.aftTubes; a++) subBoardState.tubes[cfg.fwdTubes + a] = true;
  for (let i = 1; i <= (cfg.fwdReloads || 16); i++) subBoardState.reloads[i] = true;
  subBoardState.reloads['aft_1'] = true;
  subBoardState.reloads['aft_2'] = true;

  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
  if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
  showToast(isEn ? "All torpedo tubes and reloads fully replenished." : "Todos los tubos y recargas de torpedos reabastecidos al 100%.");
}
window.loadAllTorpedoes = loadAllTorpedoes;

function unloadAllTorpedoes() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) ||
                 (typeof currentBoardSubKey !== 'undefined' && currentBoardSubKey) ||
                 (typeof campaignState !== 'undefined' && campaignState.submarine) || 'Type_B_Class';
  const cfg = (typeof getSubmarineArmamentConfig === 'function') 
    ? getSubmarineArmamentConfig(subKey) 
    : { fwdTubes: 6, aftTubes: 2, fwdReloads: 8, aftReloads: 2 };

  if (!subBoardState.tubes) subBoardState.tubes = {};
  if (!subBoardState.reloads) subBoardState.reloads = {};
  for (let i = 1; i <= cfg.fwdTubes; i++) subBoardState.tubes[i] = false;
  for (let a = 1; a <= cfg.aftTubes; a++) subBoardState.tubes[cfg.fwdTubes + a] = false;
  for (let i = 1; i <= (cfg.fwdReloads || 16); i++) subBoardState.reloads[i] = false;
  subBoardState.reloads['aft_1'] = false;
  subBoardState.reloads['aft_2'] = false;

  saveSubBoardState();
  if (typeof saveState === 'function') saveState();
  renderInteractiveSlots();
  if (typeof renderSubBoard === 'function') renderSubBoard();
  if (typeof syncPhase3TorpedoOptions === 'function') syncPhase3TorpedoOptions();
  if (typeof updateSubBoardTorpedoSummary === 'function') updateSubBoardTorpedoSummary();
  showToast(isEn ? "All torpedo tubes and reloads emptied." : "Todos los tubos y recargas de torpedos vaciados.");
}
window.unloadAllTorpedoes = unloadAllTorpedoes;

function cycleTubeTorpedoType(tubeNum) {
  const isEn = (window.currentLang === 'en');
  if (!subBoardState.tubeTypes) subBoardState.tubeTypes = {};
  const cur = subBoardState.tubeTypes[tubeNum] || 'type95';
  const cycle = ['type95', 'type92', 'type6', 'type89'];
  let idx = cycle.indexOf(cur);
  const next = cycle[(idx + 1) % cycle.length];
  subBoardState.tubeTypes[tubeNum] = next;
  subBoardState.tubes[tubeNum] = true;
  saveSubBoardState();
  renderInteractiveSlots();
  showToast(isEn ? `Tube ${tubeNum}: ${getTorpedoTypeLabel(next, isEn)}` : `Tubo ${tubeNum}: ${getTorpedoTypeLabel(next, isEn)}`);
}
window.cycleTubeTorpedoType = cycleTubeTorpedoType;

function cycleReloadTorpedoType(rKey) {
  const isEn = (window.currentLang === 'en');
  if (!subBoardState.reloadTypes) subBoardState.reloadTypes = {};
  const cur = subBoardState.reloadTypes[rKey] || 'type95';
  const cycle = ['type95', 'type92', 'type6', 'type89'];
  let idx = cycle.indexOf(cur);
  const next = cycle[(idx + 1) % cycle.length];
  subBoardState.reloadTypes[rKey] = next;
  subBoardState.reloads[rKey] = true;
  saveSubBoardState();
  renderInteractiveSlots();
  showToast(isEn ? `Reload ${rKey}: ${getTorpedoTypeLabel(next, isEn)}` : `Recarga ${rKey}: ${getTorpedoTypeLabel(next, isEn)}`);
}
window.cycleReloadTorpedoType = cycleReloadTorpedoType;

function applyTorpedoAllocation(arg1 = 4, arg2 = 2, arg3 = 0, arg4 = 0) {
  if (!currentBoardSubKey) {
    currentBoardSubKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) || (typeof subBoardState !== 'undefined' && subBoardState.activeSubKey) || null;
  }
  if (!currentBoardSubKey) return;
  const cfg = getSubmarineArmamentConfig(currentBoardSubKey);
  if (!subBoardState.tubeTypes) subBoardState.tubeTypes = {};
  if (!subBoardState.reloadTypes) subBoardState.reloadTypes = {};
  if (!subBoardState.tubes) subBoardState.tubes = {};
  if (!subBoardState.reloads) subBoardState.reloads = {};

  const curMonth = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.selectedMonth) || (typeof campaignState !== 'undefined' && campaignState.selectedMonth) || "1941-12";
  const override = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.torpedoPeriodOverride);
  const isPre = override ? (override === 'pre') : (curMonth < "1942-07");

  // Determine special and base torpedo types
  let specialType = 'type92';
  let baseType = 'type95';
  if (isPre) {
    const isKDorB = (currentBoardSubKey.includes('KD') || currentBoardSubKey.includes('Type_B'));
    const rollVal = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.torpedoRollInitial) ? campaignState.workflow.torpedoRollInitial : 1;
    const steamType = isKDorB ? 'type6' : (rollVal <= 3 ? 'type89' : 'type95');
    specialType = 'type95';
    baseType = steamType;
  }

  // Parse allocation parameters
  let fwdTubesSpec = 0;
  let aftTubesSpec = 0;
  let fwdRldSpec = 0;
  let aftRldSpec = 0;

  if (typeof arg1 === 'object' && arg1 !== null) {
    if (arg1.fwdTubes !== undefined || arg1.fwdReloads !== undefined) {
      fwdTubesSpec = Number(arg1.fwdTubes) || 0;
      aftTubesSpec = Number(arg1.aftTubes) || 0;
      fwdRldSpec = Number(arg1.fwdReloads) || 0;
      aftRldSpec = Number(arg1.aftReloads) || 0;
    } else if (arg1.fwdT92 !== undefined || arg1.aftT92 !== undefined) {
      let fRem = Number(arg1.fwdT92) || 0;
      fwdTubesSpec = Math.min(cfg.fwdTubes, fRem);
      fwdRldSpec = Math.min(cfg.fwdReloads, fRem - fwdTubesSpec);
      let aRem = Number(arg1.aftT92) || 0;
      aftTubesSpec = Math.min(cfg.aftTubes, aRem);
      aftRldSpec = Math.min(cfg.aftReloads, aRem - aftTubesSpec);
    }
  } else if ((arg3 !== undefined && arg3 !== 0) || (arg4 !== undefined && arg4 !== 0)) {
    fwdTubesSpec = Number(arg1) || 0;
    aftTubesSpec = Number(arg2) || 0;
    fwdRldSpec = Number(arg3) || 0;
    aftRldSpec = Number(arg4) || 0;
  } else if (arg1 !== undefined && arg2 !== undefined) {
    // Legacy 2-argument call: (fwdTotal, aftTotal)
    let fRem = Number(arg1) || 0;
    fwdTubesSpec = Math.min(cfg.fwdTubes, fRem);
    fwdRldSpec = Math.min(cfg.fwdReloads, fRem - fwdTubesSpec);
    let aRem = Number(arg2) || 0;
    aftTubesSpec = Math.min(cfg.aftTubes, aRem);
    aftRldSpec = Math.min(cfg.aftReloads, aRem - aftTubesSpec);
  }

  // Clamp to actual submarine slots
  fwdTubesSpec = Math.max(0, Math.min(cfg.fwdTubes, fwdTubesSpec));
  aftTubesSpec = Math.max(0, Math.min(cfg.aftTubes, aftTubesSpec));
  fwdRldSpec = Math.max(0, Math.min(cfg.fwdReloads, fwdRldSpec));
  aftRldSpec = Math.max(0, Math.min(cfg.aftReloads, aftRldSpec));

  // 1. Forward Tubes
  for (let i = 1; i <= cfg.fwdTubes; i++) {
    subBoardState.tubeTypes[i] = (i <= fwdTubesSpec) ? specialType : baseType;
    if (subBoardState.tubes[i] === undefined) subBoardState.tubes[i] = true;
  }

  // 2. Aft Tubes
  for (let a = 1; a <= cfg.aftTubes; a++) {
    const tNum = cfg.fwdTubes + a;
    subBoardState.tubeTypes[tNum] = (a <= aftTubesSpec) ? specialType : baseType;
    if (subBoardState.tubes[tNum] === undefined) subBoardState.tubes[tNum] = true;
  }

  // 3. Forward Reloads
  for (let r = 1; r <= cfg.fwdReloads; r++) {
    subBoardState.reloadTypes[r] = (r <= fwdRldSpec) ? specialType : baseType;
    if (subBoardState.reloads[r] === undefined) subBoardState.reloads[r] = true;
  }

  // 4. Aft Reloads
  for (let ar = 1; ar <= cfg.aftReloads; ar++) {
    const rKey = `aft_${ar}`;
    subBoardState.reloadTypes[rKey] = (ar <= aftRldSpec) ? specialType : baseType;
    if (subBoardState.reloads[rKey] === undefined) subBoardState.reloads[rKey] = true;
  }

  const allocObj = {
    fwdTubes: fwdTubesSpec,
    aftTubes: aftTubesSpec,
    fwdReloads: fwdRldSpec,
    aftReloads: aftRldSpec,
    fwdT92: fwdTubesSpec + fwdRldSpec,
    aftT92: aftTubesSpec + aftRldSpec
  };

  subBoardState.torpedoAllocation = allocObj;
  if (typeof campaignState !== 'undefined' && campaignState.workflow) {
    campaignState.workflow.torpedoAllocation = allocObj;
    if (typeof saveState === 'function') saveState();
  }

  saveSubBoardState();
  renderInteractiveSlots();

  const isEn = (window.currentLang === 'en');
  const specName = isPre ? (isEn ? "Type 95 Oxygen" : "Tipo 95 Oxígeno") : (isEn ? "Type 92 Electric" : "Tipo 92 Eléctrico");
  showToast(isEn 
    ? `${specName}: ${fwdTubesSpec} Fwd Tubes, ${aftTubesSpec} Aft Tubes, ${fwdRldSpec} Fwd Rld, ${aftRldSpec} Aft Rld` 
    : `${specName}: ${fwdTubesSpec} Tubos Proa, ${aftTubesSpec} Tubos Popa, ${fwdRldSpec} Rec. Proa, ${aftRldSpec} Rec. Popa`);
}
window.applyTorpedoAllocation = applyTorpedoAllocation;

function openTorpedoDistributionDialog() {
  const isEn = (window.currentLang === 'en');
  if (!currentBoardSubKey) {
    showToast(isEn ? "No active submarine sheet." : "No hay ninguna hoja de submarino activa.");
    return;
  }
  const old = document.getElementById('torpedo-dist-modal');
  if (old) old.remove();

  const cfg = getSubmarineArmamentConfig(currentBoardSubKey);
  const subTitle = (isEn ? SUB_CLASS_NAMES_EN[currentBoardSubKey] : SUB_CLASS_NAMES_ES[currentBoardSubKey]) || currentBoardSubKey;
  const curAlloc = (subBoardState.torpedoAllocation) || { fwdT92: 4, aftT92: 2 };

  const modal = document.createElement('div');
  modal.id = 'torpedo-dist-modal';
  modal.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.78); z-index:99999; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px); padding:16px; box-sizing:border-box;';

  modal.innerHTML = `
    <div style="background:#0f172a; border:2px solid #c5a059; border-radius:10px; padding:20px; max-width:540px; width:100%; color:#f8fafc; box-shadow:0 12px 35px rgba(0,0,0,0.9); font-family:system-ui, sans-serif;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:14px;">
        <h3 style="font-family:'Cinzel', serif; color:#fde047; margin:0; font-size:1.15rem; display:flex; align-items:center; gap:8px;">
          <span>⚡</span> ${isEn ? "Torpedo Allocation (Bow / Stern)" : "Reparto de Torpedos (Proa / Popa)"}
        </h3>
        <button onclick="document.getElementById('torpedo-dist-modal').remove()" style="background:none; border:none; color:#94a3b8; font-size:1.4rem; cursor:pointer; line-height:1;">&times;</button>
      </div>

      <div style="background:#1e293b; padding:10px 14px; border-radius:6px; margin-bottom:14px; font-size:0.84rem; line-height:1.5;">
        <div><strong>${isEn ? "Submarine:" : "Submarino:"}</strong> <span style="color:#fde047;">${subTitle}</span></div>
        <div style="color:#94a3b8; margin-top:2px;">
          ${isEn ? "Armament:" : "Armamento:"} <strong>${cfg.fwdTubes}</strong> ${isEn ? "Bow Tubes" : "Tubos Proa"} / <strong>${cfg.aftTubes}</strong> ${isEn ? "Stern Tubes" : "Tubos Popa"} • <strong>${cfg.fwdReloads}</strong> ${isEn ? "Bow Reloads" : "Recargas Proa"} / <strong>${cfg.aftReloads}</strong> ${isEn ? "Stern Reloads" : "Recargas Popa"}
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-size:0.80rem; color:#cbd5e1; font-weight:bold; margin-bottom:8px;">
          ${isEn ? "⚡ Quick Tactical Presets (Type 92 Electric Allocation):" : "⚡ Distribuciones Tácticas Rápidas (Torpedos Tipo 92 Eléctricos):"}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <button type="button" onclick="applyTorpedoAllocation(4, 2); document.getElementById('torpedo-dist-modal').remove();" class="action-btn" style="padding:8px 10px; text-align:left; font-size:0.80rem; background:#1e293b; border:1px solid #38bdf8; color:#38bdf8; border-radius:6px; font-weight:bold; cursor:pointer;">
            🎯 4 ${isEn ? "Bow" : "Proa"} / 2 ${isEn ? "Stern" : "Popa"}<br>
            <span style="font-size:0.72rem; color:#94a3b8; font-weight:normal;">${isEn ? "Balanced in all firing tubes" : "Equilibrado en todos los tubos"}</span>
          </button>
          <button type="button" onclick="applyTorpedoAllocation(6, 0); document.getElementById('torpedo-dist-modal').remove();" class="action-btn" style="padding:8px 10px; text-align:left; font-size:0.80rem; background:#1e293b; border:1px solid #64748b; color:#cbd5e1; border-radius:6px; font-weight:bold; cursor:pointer;">
            🎯 6 ${isEn ? "Bow" : "Proa"} / 0 ${isEn ? "Stern" : "Popa"}<br>
            <span style="font-size:0.72rem; color:#94a3b8; font-weight:normal;">${isEn ? "All forward (tubes & reloads)" : "Todo a proa (tubos y recargas)"}</span>
          </button>
          <button type="button" onclick="applyTorpedoAllocation(2, 4); document.getElementById('torpedo-dist-modal').remove();" class="action-btn" style="padding:8px 10px; text-align:left; font-size:0.80rem; background:#1e293b; border:1px solid #64748b; color:#cbd5e1; border-radius:6px; font-weight:bold; cursor:pointer;">
            🎯 2 ${isEn ? "Bow" : "Proa"} / 4 ${isEn ? "Stern" : "Popa"}<br>
            <span style="font-size:0.72rem; color:#94a3b8; font-weight:normal;">${isEn ? "Reinforce stern (tubes & reloads)" : "Refuerzo a popa (tubos y recargas)"}</span>
          </button>
          <button type="button" onclick="applyTorpedoAllocation(0, 0); document.getElementById('torpedo-dist-modal').remove();" class="action-btn" style="padding:8px 10px; text-align:left; font-size:0.80rem; background:#1e293b; border:1px solid #4ade80; color:#4ade80; border-radius:6px; font-weight:bold; cursor:pointer;">
            🎯 100% ${isEn ? "Type 95 Oxygen" : "Tipo 95 Oxígeno"}<br>
            <span style="font-size:0.72rem; color:#94a3b8; font-weight:normal;">${isEn ? "Maximum range & punch" : "Máximo alcance y potencia"}</span>
          </button>
        </div>
      </div>

      <div style="background:#1e293b; padding:12px 14px; border-radius:6px; margin-bottom:14px; font-size:0.82rem;">
        <div style="font-weight:bold; margin-bottom:8px; color:#cbd5e1;">
          ${isEn ? "Custom Quantity (Type 92 Electric Torpedoes):" : "Ajuste Personalizado (Torpedos Tipo 92 Eléctricos):"}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="color:#93c5fd; font-weight:600;">▲ ${isEn ? "Bow (Front):" : "Proa (Delante):"}</label>
            <input id="modal-alloc-fwd" type="number" min="0" max="${cfg.fwdTubes + cfg.fwdReloads}" value="${curAlloc.fwdT92 || 4}" style="width:52px; padding:4px; background:#0f172a; color:#fff; border:1px solid #3b82f6; border-radius:4px; text-align:center; font-weight:bold;">
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <label style="color:#fca5a5; font-weight:600;">▼ ${isEn ? "Stern (Back):" : "Popa (Detrás):"}</label>
            <input id="modal-alloc-aft" type="number" min="0" max="${cfg.aftTubes + cfg.aftReloads}" value="${curAlloc.aftT92 || 2}" style="width:52px; padding:4px; background:#0f172a; color:#fff; border:1px solid #ef4444; border-radius:4px; text-align:center; font-weight:bold;">
          </div>
          <button type="button" onclick="applyCustomTorpedoAllocationModal();" class="action-btn" style="padding:6px 14px; background:linear-gradient(135deg, #c5a059 0%, #b45309 100%); color:#fff; border:none; font-weight:bold; border-radius:5px; cursor:pointer;">
            ${isEn ? "Apply" : "Aplicar"}
          </button>
        </div>
      </div>

      <div style="font-size:0.75rem; color:#94a3b8; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span>💡 <em>Tip:</em> ${isEn ? "You can also <strong>Shift+Click</strong> or <strong>Right-Click</strong> any individual tube to cycle its torpedo type." : "También puedes hacer <strong>Shift+Clic</strong> o <strong>Clic Derecho</strong> en cualquier tubo para alternar su tipo individualmente."}</span>
        <button type="button" onclick="document.getElementById('torpedo-dist-modal').remove()" class="action-btn" style="padding:4px 12px; font-size:0.78rem; background:#334155; color:#cbd5e1; border:none; border-radius:4px; cursor:pointer;">${isEn ? "Close" : "Cerrar"}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
window.openTorpedoDistributionDialog = openTorpedoDistributionDialog;

function applyCustomTorpedoAllocationModal() {
  const fInp = document.getElementById('modal-alloc-fwd');
  const aInp = document.getElementById('modal-alloc-aft');
  const f = fInp ? (parseInt(fInp.value, 10) || 0) : 4;
  const a = aInp ? (parseInt(aInp.value, 10) || 0) : 2;
  applyTorpedoAllocation(f, a);
  const modal = document.getElementById('torpedo-dist-modal');
  if (modal) modal.remove();
}
window.applyCustomTorpedoAllocationModal = applyCustomTorpedoAllocationModal;

function resetSubBoardToEmpty() {
  currentBoardSubKey = null;
  if (typeof window !== 'undefined') window.currentBoardSubKey = null;
  subBoardState.activeSubKey = null;
  subBoardState.patrolIndex = 0;
  subBoardState.flooding = 0;
  subBoardState.hullDamage = 0;
  for (const k in subBoardState.crew) subBoardState.crew[k] = 'active';
  subBoardState.crewQuality = 'trained';
  for (const k in subBoardState.systems) subBoardState.systems[k] = false;
  subBoardState.tubes = {};
  for (let i = 1; i <= 8; i++) subBoardState.tubes[i] = true;
  subBoardState.reloads = {};
  for (let i = 1; i <= 16; i++) subBoardState.reloads[i] = true;
  subBoardState.deckGunDamaged = false;
  subBoardState.aaGunDamaged = false;
  subBoardState.ammo = 5;
  subBoardState.aircraftDamaged = false;
  subBoardState.aircraftDamaged2 = false;
  subBoardState.events = { 1: false, 2: false };

  try {
    localStorage.removeItem('sensuikan_sub_board_state');
  } catch(e) {}

  populateBoardSubSelect();
  renderSubBoard();
}
window.resetSubBoardToEmpty = resetSubBoardToEmpty;

function resetBoardCounters() {
  const isEn = (window.currentLang === 'en');
  if (!currentBoardSubKey) {
    showToast(isEn ? "No active submarine sheet to reset." : "No hay ninguna hoja de submarino activa para resetear.");
    return;
  }
  const confirmMsg = isEn
    ? "¿Reset all counters and torpedoes for this submarine back to initial empty state?"
    : "¿Resetear todos los marcadores y torpedos de este submarino a estado inicial vacío?";
  if (!confirm(confirmMsg)) return;

  subBoardState.patrolIndex = 0;
  subBoardState.flooding = 0;
  subBoardState.hullDamage = 0;
  for (const k in subBoardState.crew) subBoardState.crew[k] = 'active';
  subBoardState.crewQuality = 'trained';
  for (const k in subBoardState.systems) subBoardState.systems[k] = false;
  for (let i = 1; i <= 8; i++) subBoardState.tubes[i] = false;
  for (let i = 1; i <= 16; i++) subBoardState.reloads[i] = false;
  subBoardState.deckGunDamaged = false;
  subBoardState.aaGunDamaged = false;
  subBoardState.ammo = 5;
  subBoardState.aircraftDamaged = false;
  subBoardState.aircraftDamaged2 = false;
  subBoardState.events = { 1: false, 2: false };

  // Reset dropdowns to their default state
  const selectors = ['wf-sub-class-select', 'wf-base-select', 'wf-area-select'];
  selectors.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });

  // Clear workflow state if it exists
  if (typeof campaignState !== 'undefined' && campaignState.workflow) {
      campaignState.workflow.assignedArea = null;
      campaignState.workflow.startingBase = null;
      // Reset month to a sensible default (e.g., beginning of war)
      campaignState.workflow.selectedMonth = '1941-12';
      
      // Trigger base/area updates if the functions exist
      if (typeof updateBasesForDate === 'function') updateBasesForDate();
      if (typeof updateAreaForDate === 'function') updateAreaForDate();
      // Try to trigger a global refresh or re-render
      if (typeof renderPhase1 === 'function') renderPhase1(); 
  }

  saveSubBoardState();
  renderSubBoard();
  showToast(isEn ? "Board counters reset (torpedoes empty)." : "Ficha reseteada (torpedos vacíos).");
}

function saveSubBoardState() {
  try {
    localStorage.setItem('sensuikan_sub_board_state', JSON.stringify(subBoardState));
  } catch (e) {
    console.error("Error saving sub board state", e);
  }
}

function loadSavedSubBoardState() {
  try {
    const raw = localStorage.getItem('sensuikan_sub_board_state');
    if (raw) {
      const parsed = JSON.parse(raw);
      subBoardState = Object.assign(subBoardState, parsed);
      if (subBoardState.activeSubKey) currentBoardSubKey = subBoardState.activeSubKey;
      else currentBoardSubKey = null;
    }
  } catch (e) {
    console.error("Error loading sub board state", e);
  }
}

// Global hook for language changes
if (typeof window !== 'undefined') {
  window.onSubBoardLanguageChanged = function(lang) {
    populateBoardSubSelect();
    renderSubBoard();
  };
}
