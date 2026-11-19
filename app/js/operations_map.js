// =========================================================================
// SENSUiKAN: OPERATIONS MAP INTERACTIVE CONTROLLER
// Handles rendering, counter positioning, and interactive zone clicks
// =========================================================================

const OPMAP_COORDS = {
  // Bases Navales (Coordenadas en imagen 1267 x 992)
  "Paramushiro": { x: 738, y: 187, nameEs: "Paramushiro", nameEn: "Paramushiro", type: "base" },
  "Yokosuka": { x: 608, y: 340, nameEs: "Yokosuka", nameEn: "Yokosuka", type: "base" },
  "Truk": { x: 702, y: 598, nameEs: "Truk", nameEn: "Truk", type: "base" },
  "New Guinea": { x: 636, y: 686, nameEs: "Nueva Guinea", nameEn: "New Guinea", type: "base" },
  "Dutch East Indies": { x: 339, y: 764, nameEs: "Indias Orientales Holandesas / Penang", nameEn: "Dutch East Indies / Penang", type: "base" },

  // Zonas Operativas de Misión y Destinos (Chart A1)
  "Aleutians": { x: 1041, y: 174, nameEs: "Aleutianas", nameEn: "Aleutians", type: "dest" },
  "West Coast US": { x: 1195, y: 298, nameEs: "Costa Oeste EE. UU.", nameEn: "West Coast US", type: "dest" },
  "Iwo Jima": { x: 625, y: 422, nameEs: "Iwo Jima", nameEn: "Iwo Jima", type: "dest" },
  "Okinawa": { x: 492, y: 426, nameEs: "Okinawa", nameEn: "Okinawa", type: "dest" },
  "Midway": { x: 935, y: 438, nameEs: "Midway", nameEn: "Midway", type: "dest" },
  "Pearl Harbor": { x: 1134, y: 521, nameEs: "Pearl Harbor", nameEn: "Pearl Harbor", type: "dest" },
  "Philippines": { x: 404, y: 510, nameEs: "Filipinas", nameEn: "Philippines", type: "dest" },
  "Marianas": { x: 572, y: 512, nameEs: "Marianas", nameEn: "Marianas", type: "dest" },
  "Leyte Gulf": { x: 442, y: 581, nameEs: "Golfo de Leyte", nameEn: "Leyte Gulf", type: "dest" },
  "Indian Ocean": { x: 72, y: 574, nameEs: "Océano Índico", nameEn: "Indian Ocean", type: "dest" },
  "Malaya": { x: 150, y: 628, nameEs: "Malasia", nameEn: "Malaya", type: "dest" },
  "Tarawa": { x: 950, y: 698, nameEs: "Tarawa", nameEn: "Tarawa", type: "dest" },
  "Guadalcanal": { x: 801, y: 799, nameEs: "Guadalcanal", nameEn: "Guadalcanal", type: "dest" },
  "Australia": { x: 712, y: 929, nameEs: "Australia (Sydney)", nameEn: "Australia (Sydney)", type: "dest" },
  "Panama Canal": { x: 1195, y: 880, nameEs: "Canal de Panamá", nameEn: "Panama Canal", type: "dest" },
  "Europe": { x: 79, y: 907, nameEs: "Europa (Yanagi)", nameEn: "Europe (Yanagi)", type: "dest" }
};

const OPMAP_CANONICAL_DEST = {
  "West Coast US": "US West Coast",
  "Panama Canal": "Panama Canal**",
  "Europe": "Europe*"
};

// Mapeo canónico de clases de submarino a sus fichas de barco oficiales (18 clases)
const SUBMARINE_CHIT_MAP = {
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
  "Type_A_Midget_Submarine___Ko_Hyoteki": "Submarine - Midget.jpg"
};

// Fallback por defecto de fichas de misión por destino
const DEFAULT_DESTINATION_CHITS = {
  "Pearl Harbor": "Pearl Harbor 12-41.jpg",
  "Philippines": "Philippenes 12-41.jpg",
  "Malaya": "Malaya 12-41.jpg",
  "Dutch East Indies": "Dutch E Indies 12-41 - 3-42.jpg",
  "West Coast US": "US West Coast 1-42.jpg",
  "Indian Ocean": "Indian Ocean 5-42.jpg",
  "Australia": "Australia 5-42.jpg",
  "Aleutians": "Aleutians 5-42 - 6-42.jpg",
  "Midway": "Midway 6-42.jpg",
  "Guadalcanal": "Guadalcanal 8-42 - 12-42.jpg",
  "New Guinea": "New Guinea 3-43 - 6-43.jpg",
  "Tarawa": "Tarawa 11-43 - 12-43.jpg",
  "Europe": "Europe 4-44.jpg",
  "Marianas": "Marianas 6-44.jpg",
  "Leyte Gulf": "Leyte Gulf 10-44.jpg",
  "Panama Canal": "Panama Canal 1-7 - 45.jpg",
  "Iwo Jima": "Iwo Jima 2-45.jpg",
  "Okinawa": "Okinawa 4-45 - 5-45.jpg"
};

const MAP_ORIGINAL_W = 1267;
const MAP_ORIGINAL_H = 992;

function resolveMapDestinationCoords(destName) {
  if (!destName) return OPMAP_COORDS["Pearl Harbor"];
  const clean = destName.toLowerCase().replace(/[*]/g, '').trim();

  for (let key in OPMAP_COORDS) {
    if (OPMAP_COORDS[key].type !== 'dest') continue;
    const kClean = key.toLowerCase();
    if (clean === kClean || clean.includes(kClean) || kClean.includes(clean)) {
      return OPMAP_COORDS[key];
    }
  }

  // Casos especiales y sinónimos
  if (clean.includes("hawaii") || clean.includes("oahu")) return OPMAP_COORDS["Pearl Harbor"];
  if (clean.includes("us west") || clean.includes("west coast")) return OPMAP_COORDS["West Coast US"];
  if (clean.includes("dutch") || clean.includes("indies") || clean.includes("java")) return OPMAP_COORDS["Dutch East Indies"];
  if (clean.includes("sydney")) return OPMAP_COORDS["Australia"];
  if (clean.includes("solomon")) return OPMAP_COORDS["Guadalcanal"];
  if (clean.includes("panama")) return OPMAP_COORDS["Panama Canal"];
  if (clean.includes("yanagi")) return OPMAP_COORDS["Europe"];

  return OPMAP_COORDS["Pearl Harbor"];
}

function resolveMapBaseCoords(baseName) {
  if (!baseName) return OPMAP_COORDS["Yokosuka"];
  const clean = baseName.toLowerCase().trim();

  for (let key in OPMAP_COORDS) {
    if (OPMAP_COORDS[key].type !== 'base') continue;
    const kClean = key.toLowerCase();
    if (clean === kClean || clean.includes(kClean) || kClean.includes(clean)) {
      return OPMAP_COORDS[key];
    }
  }

  if (clean.includes("paramu")) return OPMAP_COORDS["Paramushiro"];
  if (clean.includes("penang") || clean.includes("singapore") || clean.includes("sabang") || clean.includes("dutch")) {
    return OPMAP_COORDS["Dutch East Indies"];
  }
  if (clean.includes("rabaul") || clean.includes("shortland") || clean.includes("guinea")) {
    return OPMAP_COORDS["New Guinea"];
  }
  if (clean.includes("truk")) return OPMAP_COORDS["Truk"];

  return OPMAP_COORDS["Yokosuka"];
}

/**
 * Obtiene la ruta del chit oficial del submarino activo (barco).
 */
function resolveCurrentSubmarineChit() {
  const subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : "Type_B_Class";
  const filename = SUBMARINE_CHIT_MAP[subKey] || "Submarine - Type B.jpg";
  const path = `assets/submarines_chits/${filename}`;
  return (typeof resolveAsset === 'function') ? resolveAsset(path) : path;
}

/**
 * Obtiene la ruta del chit oficial de la misión asignada al destino.
 * Si hay un mes seleccionado, busca preferentemente el chit histórico de ese mes.
 */
function resolveCurrentDestinationChit(destName) {
  const clean = (destName || "").toLowerCase().replace(/[*]/g, '').trim();
  const currentMonth = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.selectedMonth) ? campaignState.workflow.selectedMonth : "1941-12";

  // 1. Intentar encontrar chit en MISSION_CHITS para este mes y área
  if (typeof MISSION_CHITS !== 'undefined' && Array.isArray(MISSION_CHITS)) {
    // Coincidencia exacta de mes + área
    const monthMatch = MISSION_CHITS.find(c => {
      if (c.cat !== 'mission') return false;
      const title = (c.redTitle || "").toLowerCase();
      const areaMatches = clean.includes(title) || title.includes(clean);
      const monthMatches = c.validMonths && c.validMonths.includes(currentMonth);
      return areaMatches && monthMatches;
    });
    if (monthMatch && monthMatch.redImg) {
      const p = `assets/chits/${monthMatch.redImg}`;
      return (typeof resolveAsset === 'function') ? resolveAsset(p) : p;
    }

    // Coincidencia de área en general en MISSION_CHITS
    const anyMatch = MISSION_CHITS.find(c => {
      if (c.cat !== 'mission') return false;
      const title = (c.redTitle || "").toLowerCase();
      return clean.includes(title) || title.includes(clean);
    });
    if (anyMatch && anyMatch.redImg) {
      const p = `assets/chits/${anyMatch.redImg}`;
      return (typeof resolveAsset === 'function') ? resolveAsset(p) : p;
    }
  }

  // 2. Mapeo por defecto según destino
  for (let key in DEFAULT_DESTINATION_CHITS) {
    if (clean.includes(key.toLowerCase()) || key.toLowerCase().includes(clean)) {
      const p = `assets/chits/${DEFAULT_DESTINATION_CHITS[key]}`;
      return (typeof resolveAsset === 'function') ? resolveAsset(p) : p;
    }
  }

  const p = `assets/chits/Pearl Harbor 12-41.jpg`;
  return (typeof resolveAsset === 'function') ? resolveAsset(p) : p;
}

function initOperationsMapHotspots() {
  const container = document.getElementById('opmap-hotspots');
  if (!container || container.dataset.initialized === 'true') return;

  const boxW = (68 / MAP_ORIGINAL_W) * 100;
  const boxH = (68 / MAP_ORIGINAL_H) * 100;
  const fragment = document.createDocumentFragment();

  for (let key in OPMAP_COORDS) {
    const data = OPMAP_COORDS[key];
    const spot = document.createElement('div');
    spot.className = 'opmap-hotspot';
    spot.dataset.key = key;
    spot.dataset.type = data.type;
    spot.style.position = 'absolute';
    spot.style.left = ((data.x / MAP_ORIGINAL_W) * 100 - boxW / 2) + '%';
    spot.style.top = ((data.y / MAP_ORIGINAL_H) * 100 - boxH / 2) + '%';
    spot.style.width = boxW + '%';
    spot.style.height = boxH + '%';
    spot.style.cursor = 'pointer';
    spot.style.borderRadius = '4px';
    spot.style.border = '2px solid transparent';
    spot.style.transition = 'all 0.2s ease';
    spot.title = `${data.nameEs} (${data.type === 'base' ? 'Base Naval' : 'Zona de Operaciones'})`;

    spot.addEventListener('mouseenter', () => {
      spot.style.border = data.type === 'base' ? '2px solid #38bdf8' : '2px solid #fde047';
      spot.style.background = 'rgba(253, 224, 71, 0.15)';
    });
    spot.addEventListener('mouseleave', () => {
      spot.style.border = '2px solid transparent';
      spot.style.background = 'transparent';
    });

    spot.addEventListener('click', () => {
      const isEn = (window.currentLang === 'en');
      if (data.type === 'base') {
        if (typeof handleBaseChange === 'function') handleBaseChange(key);
        showToast(isEn ? `⚓ Base assigned: ${data.nameEn || key}` : `⚓ Base establecida: ${data.nameEs || key}`);
      } else {
        const canonicalKey = (OPMAP_CANONICAL_DEST && OPMAP_CANONICAL_DEST[key]) ? OPMAP_CANONICAL_DEST[key] : key;
        if (typeof campaignState !== 'undefined' && campaignState.workflow) {
          campaignState.workflow.assignedArea = canonicalKey;
        }
        if (typeof subBoardState !== 'undefined') {
          subBoardState.assignedArea = canonicalKey;
          if (typeof saveSubBoardState === 'function') saveSubBoardState();
        }
        if (typeof onManualAreaSelected === 'function') {
          onManualAreaSelected(canonicalKey);
        } else if (typeof window.onSensuikanDestinationChanged === 'function') {
          window.onSensuikanDestinationChanged(canonicalKey);
        }
        if (typeof syncAreaSelectDropdown === 'function') {
          syncAreaSelectDropdown(canonicalKey);
        }
        if (typeof recalculatePatrolTrack === 'function') recalculatePatrolTrack();
        if (typeof renderInteractiveSlots === 'function') renderInteractiveSlots();
        showToast(isEn ? `🎯 Destination assigned: ${data.nameEn || key}` : `🎯 Destino fijado: ${data.nameEs || key}`);
      }
      updateOperationsMap();
    });

    fragment.appendChild(spot);
  }

  container.innerHTML = '';
  container.appendChild(fragment);
  container.dataset.initialized = 'true';
}

function updateOperationsMap() {
  const isEn = (window.currentLang === 'en');
  
  // 1. Current State
  const curBase = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.startingBase) ? campaignState.workflow.startingBase : 'Yokosuka';
  const curDest = (typeof campaignState !== 'undefined' && campaignState.workflow && campaignState.workflow.assignedArea) ? campaignState.workflow.assignedArea : 'Pearl Harbor';

  // 2. Status text
  const baseEl = document.getElementById('opmap-status-base');
  const destEl = document.getElementById('opmap-status-dest');
  if (baseEl) baseEl.innerText = curBase;
  if (destEl) destEl.innerText = curDest;

  // 3. Resolve Coordinates
  const baseCoords = resolveMapBaseCoords(curBase);
  const destCoords = resolveMapDestinationCoords(curDest);

  const baseXPercent = (baseCoords.x / MAP_ORIGINAL_W) * 100;
  const baseYPercent = (baseCoords.y / MAP_ORIGINAL_H) * 100;

  const destXPercent = (destCoords.x / MAP_ORIGINAL_W) * 100;
  const destYPercent = (destCoords.y / MAP_ORIGINAL_H) * 100;

  // 4. Update Destination Chit (Chit oficial de misión en el destino)
  const counterDest = document.getElementById('opmap-counter-dest');
  const destImg = document.getElementById('opmap-counter-img');
  if (counterDest) {
    counterDest.style.left = destXPercent + '%';
    counterDest.style.top = destYPercent + '%';
  }
  if (destImg) {
    const destChitUrl = resolveCurrentDestinationChit(curDest);
    destImg.src = destChitUrl;
    destImg.alt = `Chit Misión: ${curDest}`;
  }

  // 5. Update Base Chit (Chit oficial del barco en la base)
  const counterBase = document.getElementById('opmap-counter-base');
  const baseImg = document.getElementById('opmap-base-img');
  if (counterBase) {
    counterBase.style.left = baseXPercent + '%';
    counterBase.style.top = baseYPercent + '%';
  }
  if (baseImg) {
    const subChitUrl = resolveCurrentSubmarineChit();
    baseImg.src = subChitUrl;
    const subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : "Type_B_Class";
    baseImg.alt = `Submarino: ${subKey}`;
  }

  // 6. Update Route Line in SVG
  const routeLine = document.getElementById('opmap-route-line');
  if (routeLine) {
    routeLine.setAttribute('x1', baseXPercent + '%');
    routeLine.setAttribute('y1', baseYPercent + '%');
    routeLine.setAttribute('x2', destXPercent + '%');
    routeLine.setAttribute('y2', destYPercent + '%');
  }

  // 7. Labels in active language
  const lblDest = document.getElementById('opmap-counter-label');
  if (lblDest) lblDest.innerText = isEn ? 'DESTINATION' : 'DESTINO';
  const lblBase = document.getElementById('opmap-base-label');
  if (lblBase) lblBase.innerText = isEn ? 'SUBMARINE' : 'SUBMARINO';
}

function applyOperationsMapLanguage(isEn) {
  const t = document.getElementById('opmap-title');
  if (t) t.innerHTML = isEn ? 'SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Pacific Operations Map 1941–45)</span>' : 'SENSUIKAN <span style="font-size:0.85rem; color:#94a3b8; font-weight:normal;">(Mapa Operativo del Pacífico 1941–45)</span>';
  
  const subT = document.getElementById('opmap-subtitle');
  if (subT) subT.innerText = isEn ? 'OFFICIAL PATROL & MISSION DESTINATIONS MAP (CHART A1)' : 'MAPA OFICIAL DE PATRULLAS Y DESTINOS DE MISIÓN (CHART A1)';
  
  const lblB = document.getElementById('opmap-lbl-base');
  if (lblB) lblB.innerText = isEn ? 'Current Base:' : 'Base Actual:';
  
  const lblD = document.getElementById('opmap-lbl-dest');
  if (lblD) lblD.innerText = isEn ? 'Assigned Destination:' : 'Destino Asignado:';
  
  const btnA1 = document.getElementById('opmap-btn-goto-a1');
  if (btnA1) btnA1.innerText = isEn ? 'Change / Roll Destination [A1]' : 'Cambiar / Tirar Destino [A1]';
  
  const legB = document.getElementById('opmap-legend-base');
  if (legB) legB.innerText = isEn ? 'Submarine (⚓ At Base)' : 'Submarino (⚓ En Base Naval)';
  
  const legD = document.getElementById('opmap-legend-dest');
  if (legD) legD.innerText = isEn ? 'Mission Chit (Target Destination)' : 'Ficha de Misión (Destino)';
  
  const legR = document.getElementById('opmap-legend-route');
  if (legR) legR.innerText = isEn ? 'Strategic Transit Route' : 'Ruta Estratégica de Tránsito';
  
  const tip = document.getElementById('opmap-tip');
  if (tip) tip.innerHTML = isEn ? '💡 <em>Click on any box on the map to manually reassign destination immediately.</em>' : '💡 <em>Haz clic sobre cualquier casilla del mapa para reasignar el destino manualmente de inmediato.</em>';

  updateOperationsMap();
}

window.addEventListener('DOMContentLoaded', () => {
  initOperationsMapHotspots();
  updateOperationsMap();
});

if (typeof window !== 'undefined') {
  window.updateOperationsMap = updateOperationsMap;
  window.initOperationsMapHotspots = initOperationsMapHotspots;
  window.applyOperationsMapLanguage = applyOperationsMapLanguage;
  window.resolveCurrentSubmarineChit = resolveCurrentSubmarineChit;
  window.resolveCurrentDestinationChit = resolveCurrentDestinationChit;
}
