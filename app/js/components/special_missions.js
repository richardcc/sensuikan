// =========================================================================
// SENSUiKAN: CENTRO DE MISIONES ESPECIALES [REGLAS 7.1 - 7.13]
// Gestor de Operaciones Especiales y Misiones Históricas de la AIJ
// =========================================================================

const SPECIAL_MISSIONS_CONFIG = [
  {
    key: "recon",
    rule: "7.1 / 7.17",
    icon: "✈️",
    title_es: "Reconocimiento Aéreo con Hidroavión",
    title_en: "Aerial Reconnaissance with Floatplane",
    req_es: "Requiere Hidroavión embarcado (Yokosuka E14Y Glen o Aichi M6A1 Seiran)",
    req_en: "Requires onboard Floatplane (Yokosuka E14Y Glen or Aichi M6A1 Seiran)",
    checkCompatibility: (sub) => !!(sub && (sub.has_aircraft || sub.aircraft_type)),
    desc_es: "Vuelos de exploración diurna o nocturna para fotografiar fondeaderos y bases navales enemigas (Pearl Harbor, Sydney, Ceilán, Madagascar). Resuelto en las Tablas P1 a P6.",
    desc_en: "Day or night scout flight to photograph enemy anchorages and naval bases (Pearl Harbor, Sydney, Ceylon, Madagascar). Resolved on Charts P1 through P6.",
    rollHandler: "rollSpecRecon"
  },
  {
    key: "picket",
    rule: "7.2",
    icon: "📡",
    title_es: "Línea de Piquete de Flota",
    title_en: "Fleet Picket Line",
    req_es: "Apto para cualquier submarino de flota comisionado",
    req_en: "Suitable for any commissioned fleet submarine",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    desc_es: "Despliegue en cordón perimetral de alerta temprana y vigilancia en rutas de aproximación enemigas antes de batallas decisivas (Midway, Guadalcanal, Mar de Filipinas).",
    desc_en: "Perimeter early warning screen and reconnaissance in enemy approach routes before major fleet actions (Midway, Guadalcanal, Philippine Sea).",
    rollHandler: "rollSpecPicket"
  },
  {
    key: "midget",
    rule: "7.3 / 7.16",
    icon: "🚀",
    title_es: "Ataque de Minisumergibles Ko-Hyoteki",
    title_en: "Ko-Hyoteki Midget Submarine Attack",
    req_es: "Requiere rieles de cubierta para minisubmarino Tipo A (I-16..I-24 / Tipo C / Tipo A)",
    req_en: "Requires deck clamps for Type A Midget Submersible (I-16..I-24 / Type C / Type A)",
    checkCompatibility: (sub) => !!(sub && (sub.has_midget_carrier || sub.class_name?.includes("Type C") || sub.class_name?.includes("Type A"))),
    desc_es: "Lanzamiento furtivo de minisubmarinos biplaza Ko-Hyoteki de 46 toneladas a la entrada de puertos fortificados (Pearl Harbor M1, Sydney M2, Diego Suárez M3, Guadalcanal M4).",
    desc_en: "Covert release of 46-ton two-man Ko-Hyoteki midget submarines outside fortified enemy harbors (Pearl Harbor M1, Sydney M2, Diego Suarez M3, Guadalcanal M4).",
    rollHandler: "rollSpecMidget"
  },
  {
    key: "transport",
    rule: "7.4",
    icon: "📦",
    title_es: "Transporte Logístico / Tokyo Express",
    title_en: "Supply Transport / Tokyo Express",
    req_es: "Apto para cruceros con cubierta o buques de carga (Tipo D1, Tipo C3, tambores estancos)",
    req_en: "Suitable for cruiser hulls with deck stowage or cargo subs (Type D1, Type C3, freight drums)",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    desc_es: "Entrega furtiva de munición, víveres y medicinas a guarniciones aisladas en islas asediadas (Guadalcanal, Nueva Guinea, Rabaul) utilizando tambores flotantes o barcazas Daihatsu.",
    desc_en: "Covert nocturnal delivery of ammunition, rations and medical supplies to bypassed island garrisons (Guadalcanal, New Guinea, Rabaul) via floating drums or Daihatsu barges.",
    rollHandler: "rollSpecTransport"
  },
  {
    key: "yanagi",
    rule: "7.5",
    icon: "🌐",
    title_es: "Transporte Estratégico a Europa (Misión Yanagi)",
    title_en: "Strategic Transport to Europe (Yanagi Mission)",
    req_es: "Requiere crucero de gran autonomía Tipo A o Tipo B (autonomía transoceánica)",
    req_en: "Requires long-range cruiser Type A or Type B (transoceanic endurance)",
    checkCompatibility: (sub) => !!(sub && (sub.class_name?.includes("Type A") || sub.class_name?.includes("Type B"))),
    desc_es: "Travesía transoceánica de 6 meses (Océano Índico a Francia: Lorient/Burdeos). Intercambio de caucho, estaño, wolframio, quinina y tecnología radar / planos de reactores Me-262 y uranio.",
    desc_en: "Transoceanic 6-month round trip (Indian Ocean to France: Lorient/Bordeaux). Exchanges raw rubber, tin, tungsten and quinine for German radar suites, jet plans and uranium oxide.",
    rollHandler: "rollSpecYanagi"
  },
  {
    key: "evacuation",
    rule: "7.6",
    icon: "🛟",
    title_es: "Evacuación de Tropas",
    title_en: "Troop Evacuation",
    req_es: "Tubos cargados, pero sin recargas internas (espacio destinado a soldados)",
    req_en: "Tubes loaded, but zero spare torpedo reloads (hull space allotted to soldiers)",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    desc_es: "Misión de rescate de tropas asediadas en Kiska (Islas Aleutianas) sorteando densa niebla, patrullas de radar de superficie y campos de minas aliados.",
    desc_en: "Covert rescue of besieged troops from Kiska (Aleutian Islands), navigating dense arctic fogs, Allied surface radar patrols and defensive minefields.",
    rollHandler: "rollSpecEvacuation"
  },
  {
    key: "bombing",
    rule: "7.7",
    icon: "💣",
    title_es: "Misión de Bombardeo Aéreo",
    title_en: "Aerial Bombing Mission",
    req_es: "Requiere hidroavión equipado con bombas (E14Y Glen o bombardero M6A1 Seiran)",
    req_en: "Requires floatplane equipped with bombs (E14Y Glen or M6A1 Seiran bomber)",
    checkCompatibility: (sub) => !!(sub && (sub.has_aircraft || sub.aircraft_type)),
    desc_es: "Bombardeo aéreo estratégico: Incursión del I-25 en Oregón (Monte Emily) provocando incendios forestales, o la planeada Operación Arashi contra las esclusas del Canal de Panamá con el I-400 / I-13.",
    desc_en: "Strategic air strike: I-25 incendiary bombing of Oregon coastal forests (Mount Emily), or the planned Operation Arashi strike against Panama Canal locks by I-400 / I-13.",
    rollHandler: "rollSpecBombing"
  },
  {
    key: "kaiten",
    rule: "7.8 / 7.18",
    icon: "💥",
    title_es: "Ataque de Torpedos Suicidas Kaiten",
    title_en: "Kaiten Human Torpedo Attack",
    req_es: "Requiere adaptación Kaiten comisionada (a partir de octubre de 1944)",
    req_en: "Requires commissioned Kaiten retrofit (available from October 1944 onward)",
    checkCompatibility: (sub) => !!(sub && (sub.has_kaiten || sub.kaiten_note)),
    desc_es: "Despliegue y lanzamiento sumergido de 4 a 6 torpedos pilotados Tipo 1 (Grupos Kikusui, Kongo, Chihaya, Tenbu, Shimbu, Todoroki). Cada impacto causa devastación total.",
    desc_en: "Submerged launch of 4 to 6 Type 1 human-steered suicide torpedoes (Kikusui, Kongo, Chihaya, Tenbu, Shimbu, Todoroki groups). Direct hits inflict catastrophic target destruction.",
    rollHandler: "rollSpecKaiten"
  },
  {
    key: "shore_bombardment",
    rule: "7.9",
    icon: "💥",
    title_es: "Bombardeo Costero con Cañón",
    title_en: "Shore Bombardment with Deck Gun",
    req_es: "Requiere cañón de cubierta principal de 140 mm operativo",
    req_en: "Requires operational 140mm main deck gun",
    checkCompatibility: (sub) => !!(sub && sub.deck_guns && sub.deck_guns.main),
    desc_es: "Fuego nocturno en superficie con el cañón de 140 mm contra instalaciones industriales aliadas (refinería de Ellwood en Santa Bárbara, CA, o Fort Stevens en Oregón).",
    desc_en: "Night surface bombardment with the 140mm deck gun against Allied industrial assets (Ellwood Oil Refinery in Santa Barbara, CA, or Fort Stevens in Oregon).",
    rollHandler: "rollSpecShore"
  },
  {
    key: "minelaying",
    rule: "7.10",
    icon: "⚓",
    title_es: "Minado Ofensivo Naval",
    title_en: "Offensive Naval Minelaying",
    req_es: "Exclusivo para submarino minador de flotilla Kirai-Sen (I-121 a I-124)",
    req_en: "Exclusive to Kirai-Sen fleet minelayer submarine (I-121 to I-124)",
    checkCompatibility: (sub) => !!(sub && (sub.has_mines || sub.class_name?.includes("Kirai"))),
    desc_es: "Siembra de campos de minas ofensivos en estrechos navales estratégicos (Singapur, Estrecho de Malaca, Golfo de Lingayen, Australia). Lleva 42 minas en tubos de popa.",
    desc_en: "Planting of offensive naval minefields in strategic Allied waterways (Singapore, Malacca Strait, Lingayen Gulf, Australia). Carries 42 naval mines in aft internal tubes.",
    rollHandler: "rollSpecMinelaying"
  },
  {
    key: "passenger",
    rule: "7.11",
    icon: "🕵️",
    title_es: "Entrega de Pasajeros VIP / Agentes",
    title_en: "VIP Passenger / Agent Delivery",
    req_es: "Apto para cualquier submarino de crucero o flota",
    req_en: "Suitable for any fleet or cruiser submarine",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    desc_es: "Infiltración encubierta y desembarco de líderes nacionalistas (Subhas Chandra Bose hacia la India), oficiales de enlace del Eje o agentes de inteligencia en costas enemigas.",
    desc_en: "Covert infiltration and landing of nationalist leaders (Subhas Chandra Bose toward India), Axis liaison officers or intelligence operatives on hostile shores.",
    rollHandler: "rollSpecPassenger"
  }
];

let activeResolverMission = null;

function initSpecialMissionsTab() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : 'Type_B_Class';
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]) ? SUB_DB.submarines[subKey] : {};

  // Render Submarine header
  const nameEl = document.getElementById('spec-active-sub-name');
  if (nameEl) {
    nameEl.innerText = subData.full_title || subData.class_name || subKey;
  }

  const badgesEl = document.getElementById('spec-active-sub-badges');
  if (badgesEl) {
    let bHtml = '';
    if (subData.has_aircraft) {
      bHtml += `<span style="background:rgba(2,132,199,0.25); border:1px solid #0284c7; color:#7dd3fc; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">✈️ ${subData.aircraft_type || 'Hidroavión'}</span>`;
    }
    if (subData.has_midget_carrier || subData.class_name?.includes("Type C") || subData.class_name?.includes("Type A")) {
      bHtml += `<span style="background:rgba(168,85,247,0.25); border:1px solid #a855f7; color:#e9d5ff; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">🚀 Ko-Hyoteki</span>`;
    }
    if (subData.has_kaiten) {
      bHtml += `<span style="background:rgba(239,68,68,0.25); border:1px solid #ef4444; color:#fca5a5; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">💥 Kaiten</span>`;
    }
    if (subData.has_mines || subData.class_name?.includes("Kirai")) {
      bHtml += `<span style="background:rgba(234,179,8,0.25); border:1px solid #eab308; color:#fde047; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">⚓ 42 Minas</span>`;
    }
    if (subData.class_name?.includes("Type A") || subData.class_name?.includes("Type B")) {
      bHtml += `<span style="background:rgba(16,185,129,0.25); border:1px solid #10b981; color:#a7f3d0; font-size:0.75rem; padding:2px 8px; border-radius:4px; font-weight:bold;">🌐 Yanagi (Europa)</span>`;
    }
    badgesEl.innerHTML = bHtml;
  }

  // Render Mission Cards
  const gridEl = document.getElementById('spec-missions-grid');
  if (gridEl) {
    gridEl.innerHTML = SPECIAL_MISSIONS_CONFIG.map(m => {
      const isCompat = m.checkCompatibility(subData);
      const title = isEn ? m.title_en : m.title_es;
      const req = isEn ? m.req_en : m.req_es;
      const desc = isEn ? m.desc_en : m.desc_es;
      const badgeCompat = isCompat 
        ? `<span style="background:rgba(34,197,94,0.2); border:1px solid #22c55e; color:#86efac; font-size:0.72rem; font-weight:bold; padding:2px 8px; border-radius:4px;">${isEn ? '✅ COMPATIBLE' : '✅ BUQUE APTO'}</span>`
        : `<span style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#fca5a5; font-size:0.72rem; font-weight:bold; padding:2px 8px; border-radius:4px;">${isEn ? '⚠️ REQUIRES SPECIFIC SUB' : '⚠️ REQUIERE BUQUE ESPECÍFICO'}</span>`;

      return `
        <div class="flow-card" style="background:#0f172a; border:1px solid ${isCompat ? '#3b82f6' : '#334155'}; border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 10px rgba(0,0,0,0.3); position:relative;">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.3rem;">${m.icon}</span>
                <div>
                  <h4 style="margin:0; color:#f8fafc; font-size:0.95rem; font-family:'Cinzel', serif;">${title}</h4>
                  <span style="font-size:0.74rem; color:var(--gold-400); font-weight:bold;">[${isEn ? 'Rule' : 'Regla'} ${m.rule}]</span>
                </div>
              </div>
              ${badgeCompat}
            </div>
            
            <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:8px; line-height:1.35; background:rgba(0,0,0,0.25); padding:6px 8px; border-radius:4px; border-left:2px solid ${isCompat ? '#3b82f6' : '#64748b'};">
              <strong>${isEn ? 'Requirements:' : 'Requisitos:'}</strong> ${req}
            </div>

            <p style="font-size:0.80rem; color:#cbd5e1; line-height:1.4; margin:0 0 12px 0;">
              ${desc}
            </p>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1e293b; padding-top:10px; margin-top:8px;">
            <span style="font-size:0.72rem; color:var(--gold-400); font-weight:bold;">⭐ +2 ${isEn ? 'Successful Patrols' : 'Patrullas [7.13]'}</span>
            <button type="button" class="action-btn" onclick="openSpecialMissionResolver('${m.key}')" style="font-size:0.78rem; padding:5px 12px; border-color:${isCompat ? 'var(--gold-500)' : '#64748b'}; color:${isCompat ? 'var(--gold-300)' : '#94a3b8'}; background:${isCompat ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)'};">
              🎲 ${isEn ? 'Resolve Mission ➔' : 'Resolver Misión ➔'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
}

function openSpecialMissionResolver(missionKey) {
  const isEn = (window.currentLang === 'en');
  const m = SPECIAL_MISSIONS_CONFIG.find(x => x.key === missionKey);
  if (!m) return;
  activeResolverMission = m;

  const panel = document.getElementById('spec-mission-resolver-panel');
  if (!panel) return;
  panel.style.display = 'block';

  document.getElementById('spec-res-icon').innerText = m.icon;
  document.getElementById('spec-res-title').innerText = (isEn ? m.title_en : m.title_es).toUpperCase();
  document.getElementById('spec-res-rule').innerText = (isEn ? `Official Sensuikan Rule [${m.rule}]` : `Regla Oficial Sensuikan [${m.rule}]`);
  document.getElementById('spec-res-briefing').innerText = isEn ? m.desc_en : m.desc_es;

  // Setup controls
  const controlsEl = document.getElementById('spec-res-controls');
  controlsEl.innerHTML = `
    <button type="button" class="btn-dice" onclick="executeSpecialMissionRoll('${m.key}')" style="width:100%; padding:10px; font-size:0.92rem; font-weight:bold;">
      🎲 ${isEn ? 'Execute Mission Dice Roll' : 'Lanzar Tirada de Misión Especial'}
    </button>
    <div style="font-size:0.75rem; color:#94a3b8; text-align:center;">
      ${isEn ? 'Simulates official combat/encounter table roll according to Sensuikan rules.' : 'Simula la tirada en tablas de encuentro y combate según las reglas de Sensuikan.'}
    </div>
  `;

  document.getElementById('spec-res-output').innerHTML = isEn 
    ? 'Ready to execute mission roll. Press the button above.' 
    : 'Listo para ejecutar la tirada de misión. Pulsa el botón superior.';
  document.getElementById('spec-res-reward-box').style.display = 'none';

  panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeSpecialMissionResolver() {
  const panel = document.getElementById('spec-mission-resolver-panel');
  if (panel) panel.style.display = 'none';
  activeResolverMission = null;
}

function executeSpecialMissionRoll(key) {
  const isEn = (window.currentLang === 'en');
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const sum = d1 + d2;
  const outputEl = document.getElementById('spec-res-output');
  const rewardBox = document.getElementById('spec-res-reward-box');

  let success = false;
  let html = '';

  if (key === 'recon' || key === 'bombing') {
    // Air Recon / Bombing on P1-P6: roll 2d6
    success = (sum >= 5);
    html = `
      <div style="font-size:0.95rem; font-weight:bold; color:var(--gold-300); margin-bottom:4px;">
        🎲 ${isEn ? 'Floatplane Mission Roll' : 'Tirada de Operaciones de Hidroavión'}: [${d1} + ${d2} = <strong>${sum}</strong>]
      </div>
      <div>${success 
        ? (isEn ? '✅ <strong>SUCCESSFUL FLIGHT!</strong> Target successfully scouted/bombed. Floatplane recovered safely aboard conning tower.' : '✅ <strong>¡VUELO EXITOSO!</strong> Objetivo fotografiado/bombardeado con éxito. Hidroavión recuperado a bordo con grúa.')
        : (isEn ? '⚠️ <strong>INTERCEPTED / BAD WEATHER:</strong> Heavy anti-aircraft fire or squall forced early abort. Boat dives to evade.' : '⚠️ <strong>INTERCEPTADO / MAL TIEMPO:</strong> Fuerte fuego antiaéreo o chubascos fuerzan abortar. El submarino se sumerge.')
      }</div>
    `;
  } else if (key === 'midget') {
    // Ko-Hyoteki: roll 1d6 for penetration + 2d6 attack
    const dNet = Math.floor(Math.random() * 6) + 1;
    success = (dNet >= 3 && sum >= 6);
    html = `
      <div style="font-size:0.95rem; font-weight:bold; color:var(--gold-300); margin-bottom:4px;">
        🚀 ${isEn ? 'Ko-Hyoteki Penetration' : 'Infiltración Ko-Hyoteki'}: 1d6 = [${dNet}] • ${isEn ? 'Attack Salvo' : 'Salva de Torpedos'}: 2d6 = [${d1}+${d2}=${sum}]
      </div>
      <div>${success
        ? (isEn ? '💥 <strong>DEVASTATING HARBOR STRIKE!</strong> Midget submarine penetrated anti-submarine nets and detonated torpedoes against capital ship anchorage!' : '💥 <strong>¡IMPACTO DEVASTADOR EN PUERTO!</strong> ¡El minisubmarino superó las redes de protección y torpedeó buques enemigos en su fondeadero!')
        : (isEn ? '⚠️ <strong>HARBOR DEFENSES ALERTED:</strong> Patrol craft or net obstacle engaged the midget sub. Attack aborted.' : '⚠️ <strong>DEFENSAS ALERTADAS:</strong> Patrulleros o redes obstaculizaron al minisubmarino. Ataque frustrado.')
      }</div>
    `;
  } else if (key === 'kaiten') {
    // Kaiten: roll 2d6
    success = (sum >= 6);
    html = `
      <div style="font-size:0.95rem; font-weight:bold; color:#ef4444; margin-bottom:4px;">
        💥 ${isEn ? 'Kaiten Suicide Salvo' : 'Salva de Torpedos Humanos Kaiten'}: 2d6 = [${d1} + ${d2} = <strong>${sum}</strong>]
      </div>
      <div>${success
        ? (isEn ? '💥 <strong>CATASTROPHIC DETONATION!</strong> Kaiten pilots achieved direct hits on enemy fleet vessels. Enormous explosion observed through periscope!' : '💥 <strong>¡DETONACIÓN CATASTRÓFICA!</strong> ¡Los pilotos Kaiten impactaron en el blanco! Enorme columna de fuego avistada por el periscopio.')
        : (isEn ? '⚠️ <strong>DEFENSIVE DEPTH CHARGES:</strong> Escorts detected incoming Kaiten wakes and engaged with hedgehog/depth charges.' : '⚠️ <strong>RESPUESTA DE ESCOLTAS:</strong> Las escoltas detectaron la estela de los Kaiten y lanzaron cargas preventivas.')
      }</div>
    `;
  } else {
    // General special mission roll on A3
    success = (sum >= 4);
    html = `
      <div style="font-size:0.95rem; font-weight:bold; color:var(--gold-300); margin-bottom:4px;">
        🎲 ${isEn ? 'Special Mission A3 Encounter' : 'Tirada en Tabla A3 de Misión Especial'}: [${d1} + ${d2} = <strong>${sum}</strong>]
      </div>
      <div>${success
        ? (isEn ? '✅ <strong>MISSION OBJECTIVE ACCOMPLISHED!</strong> Supplies discharged / minefield sown / VIP passenger delivered safely without detection.' : '✅ <strong>¡OBJETIVO DE MISIÓN CUMPLIDO!</strong> Suministros desembarcados / campo de minas sembrado / dignatario entregado a salvo sin detección.')
        : (isEn ? '⚠️ <strong>ENEMY RESISTANCE ENCOUNTERED:</strong> Escorts or air patrols delayed mission execution. Repositioning required.' : '⚠️ <strong>RESISTENCIA ENEMIGA ENCONTRADA:</strong> Patrullas de escoltas o aviones dificultaron el operativo.')
      }</div>
    `;
  }

  outputEl.innerHTML = html;

  if (success && rewardBox) {
    rewardBox.style.display = 'block';
  } else if (rewardBox) {
    rewardBox.style.display = 'none';
  }
}

function claimSpecialMissionReward() {
  const isEn = (window.currentLang === 'en');
  if (typeof campaignState !== 'undefined') {
    if (!campaignState.stats) campaignState.stats = {};
    // Rule 7.13: Special Mission counts as two Successful Patrols!
    campaignState.stats.successfulPatrols = (campaignState.stats.successfulPatrols || 0) + 2;
    campaignState.stats.specialMissionsCompleted = (campaignState.stats.specialMissionsCompleted || 0) + 1;
    if (typeof saveState === 'function') saveState();
  }
  
  showToast(isEn ? "⭐ Rule 7.13 Applied: 2 Successful Patrols Credited!" : "⭐ ¡Regla 7.13 Aplicada: 2 Patrullas Exitosas Acreditadas!");
  const rewardBox = document.getElementById('spec-res-reward-box');
  if (rewardBox) {
    rewardBox.innerHTML = `<strong style="color:#22c55e;">✅ ${isEn ? '2 SUCCESSFUL PATROLS LOGGED TO SERVICE RECORD!' : '¡2 PATRULLAS EXITOSAS REGISTRADAS EN TU EXPEDIENTE!'}</strong>`;
  }
}

// Attach functions to window
window.initSpecialMissionsTab = initSpecialMissionsTab;
window.openSpecialMissionResolver = openSpecialMissionResolver;
window.closeSpecialMissionResolver = closeSpecialMissionResolver;
window.executeSpecialMissionRoll = executeSpecialMissionRoll;
window.claimSpecialMissionReward = claimSpecialMissionReward;

// Auto-init on DOM or tab switch
document.addEventListener('DOMContentLoaded', () => {
  initSpecialMissionsTab();
});
