import re
import shutil

print("Applying parameterization across all files...")

# =========================================================================
# 1. Update app/js/data.js
# =========================================================================
with open("app/js/data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

# Update getSubmarineStartMonth and insert registerSubmarine
old_start_month_block = """function getSubmarineStartMonth(subKey) {
  return SUB_START_MONTHS[subKey] || "1941-12";
}"""

new_start_month_block = """function getSubmarineStartMonth(subKey) {
  if (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey] && SUB_DB.submarines[subKey].start_month) {
    return SUB_DB.submarines[subKey].start_month;
  }
  return SUB_START_MONTHS[subKey] || "1941-12";
}

/**
 * Register a new submarine class dynamically into the database.
 * Allows adding new submarines without modifying core logic.
 * @param {string} subKey - Unique identifier (e.g., 'Custom_I99_Class')
 * @param {object} subConfig - Submarine configuration parameters
 */
function registerSubmarine(subKey, subConfig) {
  if (!subKey || typeof subKey !== 'string' || !subConfig) {
    console.warn("[SUB_DB] registerSubmarine: invalid subKey or subConfig", subKey);
    return false;
  }
  if (typeof SUB_DB === 'undefined' || !SUB_DB.submarines) {
    console.error("[SUB_DB] registerSubmarine: SUB_DB.submarines not available");
    return false;
  }

  const defaultPhases = ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"];
  const fullConfig = Object.assign({
    class_name: subKey.replace(/_/g, ' '),
    full_title: subConfig.class_name || subKey.replace(/_/g, ' '),
    available_date: subConfig.start_month ? `Available ${subConfig.start_month}` : "Available December 1941",
    start_month: "1941-12",
    patrol_length: "2 month patrols",
    has_aircraft: false,
    aircraft_type: null,
    torpedo_tubes: { fwd: 6, aft: 0, reloads_fwd: 6, reloads_aft: 0 },
    deck_guns: { main: "140mm Status", ammo: 5, aa: "25mm AA Status" },
    has_kaiten: false,
    systems_status: ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
    stats: { length: "300 Feet", displacement: "2,000 tons", speed: "18 knots", range: "12,000 nm", crew: 70, produced: 1 },
    special_rules: "",
    vassal_filename: `${subKey}.jpg`,
    vassal_image_path: `images/vassal/${subKey}.jpg`,
    profile_image_path: "",
    is_remastered: true,
    patrol_phases: defaultPhases,
    damage_capacity: { flooding: 7, hull: 7 },
    crew_counters: 4,
    commander_rank_required: "Lt. Commander",
    radar: { equipped: false, model: "None", model_es: "Ninguno" },
    chit_filename: "Submarine - Type B.jpg",
    is_midget_sub: false,
    has_midget_carrier: false,
    has_mines: false,
    mine_capacity: 0,
    has_daihatsu: false
  }, subConfig);

  SUB_DB.submarines[subKey] = fullConfig;
  SUB_START_MONTHS[subKey] = fullConfig.start_month;

  if (typeof SUB_CHITS_MAP !== 'undefined') {
    SUB_CHITS_MAP[subKey] = fullConfig.chit_filename;
  }
  if (typeof CARD_ARMAMENT_CFG !== 'undefined') {
    CARD_ARMAMENT_CFG[subKey] = {
      fwdTubes: fullConfig.torpedo_tubes.fwd || 0,
      aftTubes: fullConfig.torpedo_tubes.aft || 0,
      aftReloads: fullConfig.torpedo_tubes.reloads_aft || 0,
      fwdReloads: fullConfig.torpedo_tubes.reloads_fwd || fullConfig.reload_capacity || 0,
      hasAircraft: !!fullConfig.has_aircraft
    };
  }

  if (SUB_DB.metadata) {
    SUB_DB.metadata.total_classes = Object.keys(SUB_DB.submarines).length;
  }

  // Populate any active HTML select dropdowns
  if (typeof document !== 'undefined') {
    ['wf-sub-class-select', 'sub-profile-select', 'dock-sub-select'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.querySelector(`option[value="${subKey}"]`)) {
        const opt = document.createElement('option');
        opt.value = subKey;
        opt.textContent = fullConfig.class_name;
        el.appendChild(opt);
      }
    });
  }

  console.log(`[SUB_DB] Submarine "${subKey}" successfully registered.`);
  return true;
}
if (typeof window !== 'undefined') {
  window.registerSubmarine = registerSubmarine;
  window.getSubmarineStartMonth = getSubmarineStartMonth;
}"""

if old_start_month_block in data_content:
    data_content = data_content.replace(old_start_month_block, new_start_month_block)
    with open("app/js/data.js", "w", encoding="utf-8") as f:
        f.write(data_content)
    print("✓ app/js/data.js updated with registerSubmarine and dynamic getSubmarineStartMonth")
else:
    print("Warning: old_start_month_block not found in data.js")


# =========================================================================
# 2. Update app/js/sub_board.js
# =========================================================================
with open("app/js/sub_board.js", "r", encoding="utf-8") as f:
    sub_board_content = f.read()

# Refactor getSubmarineArmamentConfig
old_arm_fn = """function getSubmarineArmamentConfig(subKey) {
  if (subKey && CARD_ARMAMENT_CFG[subKey]) {
    return CARD_ARMAMENT_CFG[subKey];
  }
  if (!subKey) return { fwdTubes: 6, aftTubes: 2, aftReloads: 2, fwdReloads: 8, hasAircraft: false };
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;
  const fwdTubes = subData && subData.torpedo_tubes ? (subData.torpedo_tubes.fwd || 0) : 6;
  const aftTubes = subData && subData.torpedo_tubes ? (subData.torpedo_tubes.aft || 0) : 2;
  const fwdReloads = subData && (subData.reload_capacity || (subData.torpedo_tubes && subData.torpedo_tubes.reloads_fwd)) ? (subData.reload_capacity || subData.torpedo_tubes.reloads_fwd) : 8;
  const aftReloads = subData && subData.torpedo_tubes && subData.torpedo_tubes.reloads_aft ? subData.torpedo_tubes.reloads_aft : (aftTubes > 0 ? 2 : 0);
  const hasAircraft = subData ? !!subData.has_aircraft : false;
  return { fwdTubes, aftTubes, aftReloads, fwdReloads, hasAircraft };
}"""

new_arm_fn = """function getSubmarineArmamentConfig(subKey) {
  if (!subKey) return { fwdTubes: 6, aftTubes: 2, aftReloads: 2, fwdReloads: 8, hasAircraft: false };
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;
  if (subData) {
    const fwdTubes = subData.torpedo_tubes ? (typeof subData.torpedo_tubes.fwd === 'number' ? subData.torpedo_tubes.fwd : (subData.torpedo_tubes.bow || 0)) : (CARD_ARMAMENT_CFG[subKey]?.fwdTubes || 6);
    const aftTubes = subData.torpedo_tubes ? (typeof subData.torpedo_tubes.aft === 'number' ? subData.torpedo_tubes.aft : (subData.torpedo_tubes.stern || 0)) : (CARD_ARMAMENT_CFG[subKey]?.aftTubes || 0);
    const fwdReloads = (typeof subData.reload_capacity === 'number') ? subData.reload_capacity : ((subData.torpedo_tubes && typeof subData.torpedo_tubes.reloads_fwd === 'number') ? subData.torpedo_tubes.reloads_fwd : (CARD_ARMAMENT_CFG[subKey]?.fwdReloads || 0));
    const aftReloads = (subData.torpedo_tubes && typeof subData.torpedo_tubes.reloads_aft === 'number') ? subData.torpedo_tubes.reloads_aft : (CARD_ARMAMENT_CFG[subKey]?.aftReloads || (aftTubes > 0 ? 2 : 0));
    const hasAircraft = (typeof subData.has_aircraft === 'boolean') ? subData.has_aircraft : !!(CARD_ARMAMENT_CFG[subKey]?.hasAircraft);
    return { fwdTubes, aftTubes, aftReloads, fwdReloads, hasAircraft };
  }
  if (CARD_ARMAMENT_CFG[subKey]) {
    return CARD_ARMAMENT_CFG[subKey];
  }
  return { fwdTubes: 6, aftTubes: 2, aftReloads: 2, fwdReloads: 8, hasAircraft: false };
}"""

if old_arm_fn in sub_board_content:
    sub_board_content = sub_board_content.replace(old_arm_fn, new_arm_fn)
    print("✓ app/js/sub_board.js getSubmarineArmamentConfig parameterized")

# Refactor crew slot decoration
old_crew_code = """    const subObj = (SUB_DB.submarines && SUB_DB.submarines[currentBoardSubKey]) ? SUB_DB.submarines[currentBoardSubKey] : null;
    const crewCount = subObj ? (subObj.crew_counters ?? (currentBoardSubKey === 'Type_C3_Class' ? 5 : 4)) : (currentBoardSubKey === 'Type_C3_Class' ? 5 : 4);
    const hasAir = subObj ? !!subObj.has_aircraft : false;
    const isMidget = (currentBoardSubKey === 'Type_A_Midget_Submarine___Ko_Hyoteki');"""

new_crew_code = """    const subObj = (SUB_DB.submarines && SUB_DB.submarines[currentBoardSubKey]) ? SUB_DB.submarines[currentBoardSubKey] : null;
    const crewCount = (subObj && typeof subObj.crew_counters === 'number') ? subObj.crew_counters : 4;
    const hasAir = subObj ? !!subObj.has_aircraft : false;
    const isMidget = !!(subObj && subObj.is_midget_sub);"""

if old_crew_code in sub_board_content:
    sub_board_content = sub_board_content.replace(old_crew_code, new_crew_code)
    print("✓ app/js/sub_board.js crewCount and isMidget parameterized")

with open("app/js/sub_board.js", "w", encoding="utf-8") as f:
    f.write(sub_board_content)


# =========================================================================
# 3. Update app/js/gameflow_phase0.js
# =========================================================================
with open("app/js/gameflow_phase0.js", "r", encoding="utf-8") as f:
    p0_content = f.read()

# Update checkSubmarineRadarStatus
old_radar_fn_pattern = re.compile(r"function checkSubmarineRadarStatus\(\)\s*\{.*?\n    window\.checkSubmarineRadarStatus = checkSubmarineRadarStatus;", re.DOTALL)

new_radar_fn = """function checkSubmarineRadarStatus() {
      const subKey = campaignState.activeSubKey || "Type_B_Class";
      const monthStr = (campaignState.workflow && campaignState.workflow.selectedMonth) ? campaignState.workflow.selectedMonth : "1941-12";
      const isEn = window.currentLang === 'en';
      const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines) ? SUB_DB.submarines[subKey] : null;

      let isEquipped = false;
      let radarModel = "";

      // 1. Check parameterized radar object first
      if (subData && subData.radar) {
        if (subData.radar.equipped) {
          isEquipped = true;
          radarModel = isEn ? subData.radar.model : (subData.radar.model_es || subData.radar.model);
        } else if (subData.radar.retrofit_month) {
          const parts = monthStr.split('-');
          const y = parseInt(parts[0], 10) || 1941;
          const m = parseInt(parts[1], 10) || 12;
          const [reqY, reqM] = subData.radar.retrofit_month.split('-').map(v => parseInt(v, 10));
          if (y > reqY || (y === reqY && m >= reqM)) {
            isEquipped = true;
            radarModel = isEn ? subData.radar.model : (subData.radar.model_es || subData.radar.model);
          }
        }
      } else {
        // Fallback to legacy checks if radar property missing
        if (subKey === "Sen_Toku_Class") {
          isEquipped = true;
          radarModel = isEn ? "Mk 3 M1 Air / Mk 2 M2 Surface" : "Mk 3 M1 Aéreo / Mk 2 M2 Superficie";
        } else if (subKey === "Type_B3_Class" || subKey === "Type_B_3_Class" || subKey.includes("B3") || subKey.includes("B_3")) {
          isEquipped = true;
          radarModel = isEn ? "Type 22 Surface Radar" : "Radar Tipo 22 Superficie";
        } else if (subKey === "Type_A_Modified") {
          isEquipped = true;
          radarModel = isEn ? "Type 22 Surface Radar" : "Radar Tipo 22 Superficie";
        } else if (subKey === "Sen_Taka_Class") {
          isEquipped = true;
          radarModel = isEn ? "Advanced Air/Surface Radar" : "Radar Avanzado Aéreo/Superficie";
        }

        if (!isEquipped && (subKey === "Type_C_Class" || subKey === "Type_C3_Class" || subKey === "Type_C_3_Class")) {
          const parts = monthStr.split('-');
          const y = parseInt(parts[0], 10) || 1941;
          const m = parseInt(parts[1], 10) || 12;
          if (y > 1944 || (y === 1944 && m >= 12)) {
            isEquipped = true;
            radarModel = isEn ? "Type 22 AS/SS (Retrofit 12/44)" : "Radar Tipo 22 AS/SS (Refit 12/44)";
          }
        }
      }

      // 2. Check damage status
      const isDamaged = !!(campaignState.damage && campaignState.damage.radar);
      const isOperational = isEquipped && !isDamaged;

      campaignState.hasRadar = isOperational;
      campaignState.radarEquipped = isEquipped;
      campaignState.radarDamaged = isDamaged;
      campaignState.radarModel = radarModel;

      return {
        isEquipped,
        isOperational,
        isDamaged,
        radarModel
      };
    }
    window.checkSubmarineRadarStatus = checkSubmarineRadarStatus;"""

if old_radar_fn_pattern.search(p0_content):
    p0_content = old_radar_fn_pattern.sub(new_radar_fn, p0_content)
    print("✓ app/js/gameflow_phase0.js checkSubmarineRadarStatus parameterized")

# Update SUB_CHITS_MAP with Proxy
old_chits_map_pattern = re.compile(r"const SUB_CHITS_MAP = \{.*?\n    \};", re.DOTALL)
new_chits_map = """const SUB_CHITS_MAP = new Proxy({
      'Kaidai_KD3_Class': 'Submarine - KD.3.jpg',
      'Kaidai_KD4_Class': 'Submarine - KD.4.jpg',
      'Kaidai_KD5_Class': 'Submarine - KD.5.jpg',
      'Kaidai_KD6_Class': 'Submarine - KD.6.jpg',
      'Kaidai_KD7_Class': 'Submarine - KD.7.jpg',
      'Kirai_Sen_Class': 'Submarine - Kirai-Sen.jpg',
      'Junsen_J_IM_Class': 'Submarine - Junsen J1M.jpg',
      'Junsen_J2_Class': 'Submarine - Junsen J2.jpg',
      'Junsen_J3_Class': 'Submarine - Junsen J3.jpg',
      'Type_A_Class': 'Submarine - Type A.jpg',
      'Type_B_Class': 'Submarine - Type B.jpg',
      'Type_B_3_Class': 'Submarine - Type B.3.jpg',
      'Type_C_Class': 'Submarine - Type C.jpg',
      'Type_A_Modified': 'Submarine - Type A(M).jpg',
      'Sen_Toku_Class': 'Submarine - Sen-Toku.jpg',
      'Sen_Taka_Class': 'Submarine - Sen-Taka.jpg',
      'Type_C3_Class': 'Submarine - Type C.3.jpg',
      'Type_A_Midget_Submarine___Ko_Hyoteki': 'Submarine - Midget.jpg'
    }, {
      get: function(target, prop) {
        if (typeof prop === 'string' && prop in target) return target[prop];
        if (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[prop] && SUB_DB.submarines[prop].chit_filename) {
          return SUB_DB.submarines[prop].chit_filename;
        }
        return 'Submarine - Type B.jpg';
      }
    });"""

if old_chits_map_pattern.search(p0_content):
    p0_content = old_chits_map_pattern.sub(new_chits_map, p0_content)
    print("✓ app/js/gameflow_phase0.js SUB_CHITS_MAP parameterized with Proxy")

# Update special notes in phase 0
old_notes_block = """        let notesHtml = [];
        const isTypeC = (campaignState.activeSubKey === 'Type_C_Class');
        const isMidget = (campaignState.activeSubKey === 'Type_A_Midget_Submarine___Ko_Hyoteki');
        if (isTypeC) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Carries 1 Type A Midget on aft deck armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Transporta 1 minisubmarino Tipo A en cubierta de popa armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        } else if (isMidget) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        }
        if (sub.has_kaiten) {
          notesHtml.push(isEn
            ? `<div>⚡ <strong>Manned Kaiten Suicide Torpedoes [4.8.4 & 7.18]:</strong> Carries 4–6 Type 1 Kaiten on deck clamps on Kaiten Special Missions (late 1944+).</div>`
            : `<div>⚡ <strong>Torpedos Suicidas Tripulados Kaiten [4.8.4 & 7.18]:</strong> Transporta de 4 a 6 Kaiten Tipo 1 en soportes de cubierta en Misiones Kaiten (1944+).</div>`);
        }
        if (campaignState.activeSubKey === 'Kirai_Sen_Class') {
          notesHtml.push(isEn
            ? `<div>💣 <strong>Minelaying Missions [4.5.8 & 7.10]:</strong> Dedicated minelayer carrying 42 naval mines in aft internal tubes (Chart E6 aft torpedo damage applies to mine doors). 4 bow torpedo tubes + 8 reloads carry standard torpedoes.</div>`
            : `<div>💣 <strong>Misiones de Minado [4.5.8 & 7.10]:</strong> Minador especializado que transporta 42 minas navales en tubos internos de popa (las averías de torpedos de popa en E6 van a compuertas de minas). Los 4 tubos de proa + 8 recargas llevan torpedos estándar.</div>`);
        } else if (!isMidget) {
          notesHtml.push(isEn
            ? `<div>⚠️ <strong>Special Missions [4.5.8]:</strong> <em>Mine-laying [7.10]:</em> Mines loaded in tubes reduce initial torpedo load by tube count. <em>Transport/Evacuation [7.4/7.6]:</em> Tubes loaded, but carries <strong>0 reloads</strong> (stowage used for cargo/passengers).</div>`
            : `<div>⚠️ <strong>Misiones Especiales [4.5.8]:</strong> <em>Minado [7.10]:</em> Minas en tubos reducen la carga inicial de torpedos. <em>Transporte/Evacuación [7.4/7.6]:</em> Tubos armados, pero lleva <strong>0 recargas</strong> (bodega usada para suministros o evacuados).</div>`);
        }"""

new_notes_block = """        let notesHtml = [];
        const isTypeC = (sub && sub.has_midget_carrier) || (campaignState.activeSubKey === 'Type_C_Class');
        const isMidget = (sub && sub.is_midget_sub) || (campaignState.activeSubKey === 'Type_A_Midget_Submarine___Ko_Hyoteki');
        const isMinelayer = (sub && sub.has_mines) || (campaignState.activeSubKey === 'Kirai_Sen_Class');
        if (isTypeC) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Carries 1 Type A Midget on aft deck armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Transporta 1 minisubmarino Tipo A en cubierta de popa armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        } else if (isMidget) {
          notesHtml.push(isEn 
            ? `<div>⚓ <strong>Ko-Hyoteki Midget Submarine [4.5.11 & 7.16]:</strong> Armed with 2x Type 97 18" (45cm) torpedoes in bow tubes (no reloads).</div>`
            : `<div>⚓ <strong>Minisubmarino Ko-Hyoteki [4.5.11 & 7.16]:</strong> Armado con 2x torpedos Tipo 97 de 18" (45 cm) en proa (sin recargas).</div>`);
        }
        if (sub && sub.has_kaiten) {
          notesHtml.push(isEn
            ? `<div>⚡ <strong>Manned Kaiten Suicide Torpedoes [4.8.4 & 7.18]:</strong> Carries 4–6 Type 1 Kaiten on deck clamps on Kaiten Special Missions (late 1944+).</div>`
            : `<div>⚡ <strong>Torpedos Suicidas Tripulados Kaiten [4.8.4 & 7.18]:</strong> Transporta de 4 a 6 Kaiten Tipo 1 en soportes de cubierta en Misiones Kaiten (1944+).</div>`);
        }
        if (isMinelayer) {
          const mineCount = (sub && sub.mine_capacity) || 42;
          notesHtml.push(isEn
            ? `<div>💣 <strong>Minelaying Missions [4.5.8 & 7.10]:</strong> Dedicated minelayer carrying ${mineCount} naval mines in aft internal tubes (Chart E6 aft torpedo damage applies to mine doors). 4 bow torpedo tubes + 8 reloads carry standard torpedoes.</div>`
            : `<div>💣 <strong>Misiones de Minado [4.5.8 & 7.10]:</strong> Minador especializado que transporta ${mineCount} minas navales en tubos internos de popa (las averías de torpedos de popa en E6 van a compuertas de minas). Los 4 tubos de proa + 8 recargas llevan torpedos estándar.</div>`);
        } else if (!isMidget) {
          notesHtml.push(isEn
            ? `<div>⚠️ <strong>Special Missions [4.5.8]:</strong> <em>Mine-laying [7.10]:</em> Mines loaded in tubes reduce initial torpedo load by tube count. <em>Transport/Evacuation [7.4/7.6]:</em> Tubes loaded, but carries <strong>0 reloads</strong> (stowage used for cargo/passengers).</div>`
            : `<div>⚠️ <strong>Misiones Especiales [4.5.8]:</strong> <em>Minado [7.10]:</em> Minas en tubos reducen la carga inicial de torpedos. <em>Transporte/Evacuación [7.4/7.6]:</em> Tubos armados, pero lleva <strong>0 recargas</strong> (bodega usada para suministros o evacuados).</div>`);
        }"""

if old_notes_block in p0_content:
    p0_content = p0_content.replace(old_notes_block, new_notes_block)
    print("✓ app/js/gameflow_phase0.js special notes parameterized")

with open("app/js/gameflow_phase0.js", "w", encoding="utf-8") as f:
    f.write(p0_content)


# =========================================================================
# 4. Update app/js/gameflow_phase4_5.js
# =========================================================================
with open("app/js/gameflow_phase4_5.js", "r", encoding="utf-8") as f:
    p4_content = f.read()

old_rank_check = "const requiresCdr = (subKey === 'Sen_Toku_Class' || subKey === 'Type_A_Modified');"
new_rank_check = "const requiresCdr = (s && s.commander_rank_required === 'Commander') || (subKey === 'Sen_Toku_Class' || subKey === 'Type_A_Modified');"

if old_rank_check in p4_content:
    p4_content = p4_content.replace(old_rank_check, new_rank_check)
    with open("app/js/gameflow_phase4_5.js", "w", encoding="utf-8") as f:
        f.write(p4_content)
    print("✓ app/js/gameflow_phase4_5.js commander_rank_required parameterized")


# =========================================================================
# 5. Mirror to app/js/components/
# =========================================================================
for fn in ["data.js", "sub_board.js", "gameflow_phase0.js", "gameflow_phase4_5.js"]:
    shutil.copyfile(f"app/js/{fn}", f"app/js/components/{fn}")
    print(f"✓ Mirrored app/js/{fn} to app/js/components/{fn}")

print("All parameterization applied successfully!")
