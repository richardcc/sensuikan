// =========================================================================
// SENSUiKAN: CENTRO DE MISIONES ESPECIALES [REGLAS 7.1 - 7.13]
// Gestor de Operaciones Estratégicas y Misiones Históricas de la Armada Imperial
// =========================================================================

const SPECIAL_MISSIONS_CONFIG = [
  {
    key: "recon",
    rule: "7.1 / 7.17",
    icon: "✈️",
    title_es: "Reconocimiento Aéreo con Hidroavión",
    title_en: "Aerial Reconnaissance with Floatplane",
    req_es: "Requiere submarino equipado con hidroavión (solamente) y hangar (Yokosuka E14Y Glen o Aichi M6A1 Seiran). Solo ciertas clases como Tipo B, Tipo AM o Sen-Toku pueden realizarla.",
    req_en: "Requires an aircraft-equipped submarine only (Yokosuka E14Y Glen or Aichi M6A1 Seiran) with hangar. Limited to aviation-capable classes (Type B, Type AM, Sen-Toku).",
    zone_es: "Pearl Harbor, Sydney, Ceilán, Madagascar o fondeaderos navales asignados por Fichas de Mayor Evento [7.14].",
    zone_en: "Pearl Harbor, Sydney, Ceylon, Madagascar, or naval anchorages assigned by Major Event chits [7.14].",
    procedure_es: "Navega hasta la primera casilla de patrulla que no sea de tránsito (la casilla de 'Misión'). Al llegar, acude al Módulo de Aeronaves (Tablas P1 a P6). Lanza el hidroavión para ejecutar la exploración diurna o nocturna sobre el fondeadero u objetivo enemigo asignado.",
    procedure_en: "Travel to the first non-transit patrol box (the 'Mission' box). Upon arrival, consult the Aircraft Module (Charts P1 to P6). Launch the floatplane to conduct a day or night scout flight over the designated enemy anchorage or objective.",
    restrictions_es: "El submarino nodriza no realiza ataques de torpedos durante la exploración aérea. Debe aguardar en la zona para la maniobra de recuperación del avión con la grúa de cubierta.",
    restrictions_en: "The parent submarine conducts no torpedo attacks during the scout flight. It remains on station awaiting floatplane recovery via deck crane.",
    success_es: "CONDICIÓN DE ÉXITO: La misión es un éxito si uno o más de tus aviones sobreviven (tanto si se recuperan a bordo mediante tirada como si deben amerizar tras transmitir el informe). FRACASO: Fracasa si el avión es derribado o destruido antes de cumplir la exploración.",
    success_en: "SUCCESS CONDITION: The mission is a success if one or more of your aircraft survives (whether recovered aboard or lost after reporting). FAILURE: Fails if the aircraft is shot down or destroyed before completing reconnaissance.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos de dotación, condecoraciones y adquisición de habilidades K1.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward crew promotions, decorations, and K1 skills.",
    checkCompatibility: (sub) => !!(sub && (sub.has_aircraft || sub.aircraft_type)),
    rollHandler: "rollSpecRecon"
  },
  {
    key: "picket",
    rule: "7.2",
    icon: "📡",
    title_es: "Línea de Piquete de Flota",
    title_en: "Fleet Picket Line",
    req_es: "Apto para cualquier submarino de flota comisionado. El buque se despliega en cordón perimetral de alerta temprana.",
    req_en: "Suitable for any commissioned fleet submarine. The boat deploys in a perimeter early-warning screen.",
    zone_es: "Rutas de aproximación enemigas antes de batallas decisivas (Midway, Guadalcanal, Mar de Filipinas).",
    zone_en: "Hostile approach routes before decisive fleet actions (Midway, Guadalcanal, Philippine Sea).",
    procedure_es: "La misión exige que el submarino forme parte de una línea de piquete para interceptar agrupaciones enemigas que se dirigen hacia o desde una zona de combate. El sumergible permanece esencialmente estacionario esperando un blanco de guerra.",
    procedure_en: "The mission requires the boat to form part of a picket screen to intercept enemy forces heading toward or from a combat area. The submarine remains essentially stationary waiting for a warship target.",
    restrictions_es: "RESTRICCIÓN ESTRICTA DE COMBATE [7.2]: El submarino NO TIENE PERMITIDO atacar ni seguir a ningún buque mercante (cargueros, petroleros) que encuentre en su patrulla. Debe ignorarlos y dejarlos pasar sin entablar combate.",
    restrictions_en: "STRICT COMBAT RESTRICTION [7.2]: The submarine is NOT PERMITTED to engage or follow any merchant shipping (freighters, tankers) encountered during patrol. They must be allowed to pass unmolested.",
    success_es: "CONDICIÓN DE ÉXITO: Requiere haber entablado combate con al menos UN Buque de Guerra (Destructor, Crucero Ligero, Crucero Pesado) o Buque Capital (Acorazado, Portaaviones). No es obligatorio hundirlo: entablar combate cumple la misión.",
    success_en: "SUCCESS CONDITION: Requires at least ONE enemy Warship (Destroyer, Light Cruiser, Heavy Cruiser) or Capital Ship (Battleship, Aircraft Carrier) to have been engaged. Sinking it is not required; engaging satisfies the condition.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward promotions and decorations.",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    rollHandler: "rollSpecPicket"
  },
  {
    key: "midget",
    rule: "7.3 / 7.16",
    icon: "🚀",
    title_es: "Ataque de Minisumergibles Ko-Hyoteki",
    title_en: "Ko-Hyoteki Midget Submarine Attack",
    req_es: "Requiere submarino nodriza equipado con calzos/rieles de fijación de cubierta para minisubmarino Tipo A (I-16 a I-24 / Tipo C / Tipo A).",
    req_en: "Requires mother submarine equipped with deck clamps for Type A Midget Submersible (I-16 through I-24 / Type C / Type A hulls).",
    zone_es: "Fondeaderos navales fortificados aliados (Pearl Harbor M1, Sydney M2, Diego Suárez M3, Guadalcanal M4).",
    zone_en: "Fortified Allied naval anchorages (Pearl Harbor M1, Sydney M2, Diego Suarez M3, Guadalcanal M4).",
    procedure_es: "Aproximarse furtivamente a la entrada del fondeadero fortificado enemigo en la casilla de Misión. Soltar el minisubmarino biplaza Ko-Hyoteki para que penetre las defensas portuarias y ataque los buques de guerra fondeados. Se resuelve consultando el Módulo de Minisubmarinos (Tablas M1 a M7).",
    procedure_en: "Infiltrate stealthily to the outer harbor entrance in the Mission box. Release the 46-ton two-man Ko-Hyoteki to penetrate anti-submarine defenses and attack anchored warships. Resolved via Midget Submarine Module (Charts M1 to M7).",
    restrictions_es: "El minisubmarino opera de forma independiente. El submarino nodriza no dispara torpedos en la casilla de misión mientras el minisubmarino está desplegado.",
    restrictions_en: "The midget submersible operates autonomously. The mother submarine launches no main torpedoes in the mission box while the midget is deployed.",
    success_es: "CONDICIÓN DE ÉXITO: Se considera un éxito si el minisubmarino es soltado y ATACA AL MENOS A UN BUQUE. Cualquier daño que inflija o no es indiferente para el éxito de la misión. No necesita sobrevivir. FRACASO: Fracasa si no puede desplegarse (por averías en el minisub o muerte/heridas graves de su dotación antes de llegar a la casilla de misión).",
    success_en: "SUCCESS CONDITION: Considered a success if the midget sub is dropped off and at least ATTACKS ONE SHIP—any damage it may or may not inflict is immaterial for success. It does not need to survive. FAILURE: Fails if unable to deploy (due to midget damage or crew casualty before arrival).",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas. Además, cualquier tonelaje que el minisubmarino hunda SÍ se añade al total del submarino para puntos de victoria y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols. Furthermore, any tonnage sunk by the midget sub IS added to the submarine's total for victory points and medals.",
    checkCompatibility: (sub) => !!(sub && (sub.has_midget_carrier || sub.class_name?.includes("Type C") || sub.class_name?.includes("Type A"))),
    rollHandler: "rollSpecMidget"
  },
  {
    key: "transport",
    rule: "7.4",
    icon: "📦",
    title_es: "Transporte Logístico / Tokyo Express",
    title_en: "Supply Transport / Tokyo Express",
    req_es: "Apto para cruceros con cubierta o capacidad de carga (Tipo D1, Tipo C3, o buques adaptados con tambores estancos).",
    req_en: "Suitable for cruiser hulls with deck cargo or transport subs (Type D1, Type C3, or fleet boats with sealed drums).",
    zone_es: "Guarniciones aisladas en islas asediadas (Guadalcanal, Nueva Guinea, Rabaul).",
    zone_en: "Isolated garrisons on besieged islands (Guadalcanal, New Guinea, Rabaul).",
    procedure_es: "Entrega furtiva de munición, víveres y suministros médicos. Al llegar a la primera casilla de patrulla que no sea de tránsito (casilla de Misión), tira en la columna de Misión Especial de la Tabla [A3].",
    procedure_en: "Covert delivery of ammunition, rations, and medical supplies. Upon arrival at the first non-transit patrol box (Mission box), roll on the Special Mission column of Chart [A3].",
    restrictions_es: "RESTRICCIÓN DE ARMAMENTO [7.4]: El submarino tiene sus tubos lanzatorpedos cargados, pero NO LLEVA RECARGAS en el pañol interno (el espacio está ocupado por suministros). Coloca el marcador 'Supplies' en la zona de recargas.",
    restrictions_en: "WEAPON RESTRICTION [7.4]: The submarine has its torpedo tubes loaded, but CARRIES ZERO RELOADS (the reload area is filled with supplies). Place the 'Supplies' marker in the reload space.",
    success_es: "CONDICIÓN DE ÉXITO: Si la tirada en Tabla [A3] no genera encuentro (o mar despejado), los suministros se entregan y la misión es un éxito. Si ocurre un encuentro, se combate y luego se vuelve a tirar hasta que esté despejado y se complete la descarga.",
    success_en: "SUCCESS CONDITION: If Chart [A3] roll results in no encounter, supplies are delivered and mission succeeds. If an encounter occurs, fight then re-roll until clear and offload is complete.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward promotions and medals.",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    rollHandler: "rollSpecTransport"
  },
  {
    key: "yanagi",
    rule: "7.5",
    icon: "🌐",
    title_es: "Transporte Estratégico a Europa (Misión Yanagi)",
    title_en: "Strategic Transport to Europe (Yanagi Mission)",
    req_es: "EXCLUSIVO para submarinos Tipo A y Tipo B (gran autonomía transoceánica). Todos los demás buques deben relanzar si se les asigna.",
    req_en: "EXCLUSIVE to Type A and Type B submarines (transoceanic endurance). All other classes must re-roll if assigned.",
    zone_es: "Océano Índico y Atlántico rumbo a Francia bajo control alemán (bases de Lorient o Burdeos).",
    zone_en: "Indian Ocean and Atlantic heading to German-controlled France (Lorient or Bordeaux bases).",
    procedure_es: "Misión transoceánica con nombre en código 'Yanagi' (Sauce). Entrega de minerales estratégicos (caucho, estaño, wolframio, quinina) a Alemania a cambio de radares, tecnología avanzada y planos de reactores. Navega hacia las casillas de tránsito del Océano Índico con rumbo a Europa. Tira una vez por casilla en la sección de Misión Especial / Ronda Adicional de la Tabla [A3]. Al llegar a Europa, invierte el proceso para regresar a Japón. Dura 3 meses de ida y 3 meses de vuelta (6 meses en total, anotando 'P' en el Rogu Bukku).",
    procedure_en: "Transoceanic mission codenamed 'Yanagi' (Willow). Delivery of strategic minerals (rubber, tin, tungsten, quinine) to Germany in exchange for radar, advanced tech, and jet plans. Sail to Indian Ocean Transit Boxes heading toward Europe. Roll once per box on Chart [A3] Special Mission / Additional Round section. Reverse process to return. Lasts 3 months each direction (6 months total, logging 'P' on Log Sheet).",
    restrictions_es: "Travesía prolongada de 6 meses expuesta a patrullas aeronavales británicas en el Atlántico y el Golfo de Vizcaya.",
    restrictions_en: "Prolonged 6-month voyage exposed to British ASW patrols in the Atlantic and Bay of Biscay.",
    success_es: "CONDICIÓN DE ÉXITO: La patrulla se considera un éxito si los suministros estratégicos son entregados en Europa y el submarino regresa a su base naval.",
    success_en: "SUCCESS CONDITION: The patrol is considered an official success if strategic supplies are delivered to Europe and the submarine returns to base.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas y prestigio tecnológico de la Flota Imperial.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols and Imperial Fleet technological prestige.",
    checkCompatibility: (sub) => !!(sub && (sub.class_name?.includes("Type A") || sub.class_name?.includes("Type B"))),
    rollHandler: "rollSpecYanagi"
  },
  {
    key: "evacuation",
    rule: "7.6",
    icon: "🛟",
    title_es: "Evacuación de Tropas (Kiska / Aleutianas)",
    title_en: "Troop Evacuation (Kiska / Aleutians)",
    req_es: "Apto para submarinos de flota comisionados. Rescate y evacuación de tropas asediadas en las Islas Aleutianas.",
    req_en: "Suitable for commissioned fleet submarines. Covert rescue and evacuation of besieged troops from the Aleutian Islands.",
    zone_es: "Isla de Kiska (Islas Aleutianas, Pacífico Norte).",
    zone_en: "Kiska Island (Aleutian Islands, North Pacific).",
    procedure_es: "Viaja a la casilla de las Aleutianas sorteando nieblas árticas y radares enemigos. Al llegar, tira en la sección de Misión Especial de la Tabla [A3] (el submarino es altamente vulnerable durante la maniobra de embarque). Si no hay encuentro, los soldados son embarcados; si hay encuentro, resuélvelo y vuelve a tirar hasta despejar la zona.",
    procedure_en: "Travel to the Aleutians box navigating dense arctic fog and enemy radar. Roll on Chart [A3] Special Mission section upon arrival (highly vulnerable during troop boarding). If no encounter, soldiers are embarked; if an encounter occurs, resolve combat and re-roll until clear.",
    restrictions_es: "RESTRICCIÓN DE ARMAMENTO: Tubos cargados, pero SIN RECARGAS de reserva internas (espacio destinado a alojar a las tropas evacuadas). El Pasajero cuenta como un 'Piloto' en la Tabla de Heridas de la Tripulación.",
    restrictions_en: "WEAPON RESTRICTION: Torpedo tubes loaded, but ZERO SPARE RELOADS carried (hull space allotted to soldiers). The Passenger counts as a 'Pilot' on the Crew Injury Chart.",
    success_es: "CONDICIÓN DE ÉXITO: La patrulla es un éxito siempre que regreses a la base naval con los pasajeros en estado NO HERIDO (unwounded status). FRACASO: Si resultan muertos o heridos graves antes de llegar, la misión fracasa.",
    success_en: "SUCCESS CONDITION: The patrol is a success assuming you return to base with the passengers in an UNWOUNDED status. FAILURE: If killed or seriously wounded before arrival, the mission fails.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward promotions and decorations.",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    rollHandler: "rollSpecEvacuation"
  },
  {
    key: "bombing",
    rule: "7.7",
    icon: "💣",
    title_es: "Misión de Bombardeo Aéreo Estratégico",
    title_en: "Strategic Aerial Bombing Mission",
    req_es: "Requiere hidroavión equipado con bombas (E14Y Glen o bombardero M6A1 Seiran). Solo las clases Tipo A (modificado) y Sen-Toku (I-400) pueden ser asignadas al Canal de Panamá.",
    req_en: "Requires floatplane equipped with bombs (E14Y Glen or M6A1 Seiran bomber). Only Type A (modified) and Sen-Toku (I-400) classes can ever be assigned to bomb the Panama Canal.",
    zone_es: "Costa Oeste de EE.UU. (Oregón / Monte Emily) o Esclusas del Canal de Panamá.",
    zone_en: "US West Coast (Oregon / Mount Emily) or Panama Canal Locks.",
    procedure_es: "Viaja a la casilla de la Costa Oeste de EE.UU. o a la casilla del Canal de Panamá según corresponda. Lanza el hidroavión y efectúa el bombardeo según las reglas del Módulo de Aeronaves.",
    procedure_en: "Travel to either the US West Coast or Panama Canal box as appropriate. Launch floatplane and conduct bombing run per the Aircraft Module.",
    restrictions_es: "El bombardeo es el objetivo prioritario absoluto sobre la caza de tráfico mercante.",
    restrictions_en: "The aerial bombing strike is the paramount mission objective, prioritized above merchant hunting.",
    success_es: "CONDICIÓN DE ÉXITO: La misión es un éxito SI EL BOMBARDEO SE LLEVA A CABO, incluso si no se hundieron buques en el resto de la patrulla e incluso si el avión se pierde tras soltar las bombas. FRACASO: Si no se efectúa el bombardeo, la misión es un fracaso aunque se hayan hundido otros buques.",
    success_en: "SUCCESS CONDITION: The mission is a success IF BOMBING OCCURS, even if no ships were sunk on the rest of the patrol and even if aircraft are lost. FAILURE: If no bombing occurs, the mission is a failure even if other ships were sunk.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward promotions and decorations.",
    checkCompatibility: (sub) => !!(sub && (sub.has_aircraft || sub.aircraft_type)),
    rollHandler: "rollSpecBombing"
  },
  {
    key: "kaiten",
    rule: "7.8 / 7.18",
    icon: "💥",
    title_es: "Ataque de Torpedos Suicidas Kaiten",
    title_en: "Kaiten Human Torpedo Attack",
    req_es: "Requiere submarino comisionado con afustes de cubierta para torpedos tripulados suicidas Kaiten (a partir de otoño de 1944). Clases Tipo B, Tipo C o Kaidai convertidas.",
    req_en: "Requires a submarine commissioned with deck clamps for Kaiten manned suicide torpedoes (from late 1944 onward). Converted Type B, Type C, or Kaidai hulls.",
    zone_es: "Fondeaderos y rutas enemigas asignadas por Eventos Mayores (Ulithi, Iwo Jima, Okinawa).",
    zone_en: "Hostile anchorages and routes assigned by Major Events (Ulithi, Iwo Jima, Okinawa).",
    procedure_es: "Aproximarse en inmersión al fondeadero o zona de combate enemiga asignada por la ficha de Mayor Evento. Lanzar los torpedos tripulados Kaiten sumergido según las reglas del Módulo Kaiten.",
    procedure_en: "Infiltrate submerged close to the enemy anchorage or combat area designated by the Major Event marker. Release Kaitens submerged per the Kaiten Module.",
    restrictions_es: "Los torpedos Kaiten y sus pilotos son armas suicidas y se consideran perdidos siempre, impacten o fallen.",
    restrictions_en: "Kaiten human torpedoes and their pilots are suicide weapons and are considered expended and lost regardless of hit or miss.",
    success_es: "CONDICIÓN DE ÉXITO ESTRICTA: Se considera un éxito si los Kaiten son lanzados SIN QUE el submarino del jugador haya sido detectado previamente. Cualquier daño que inflijan o no es indiferente para el éxito de la misión. FRACASO: Fracasa si ningún Kaiten puede desplegarse (por averías en los Kaiten o bajas en sus pilotos antes de llegar).",
    success_en: "STRICT SUCCESS CONDITION: Considered a success if Kaitens are dropped off WITHOUT the player's submarine having been detected. Any damage they may or may not inflict is immaterial for mission success. FAILURE: Fails if no Kaiten can deploy (due to damage or casualties before arrival).",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas. Además, cualquier tonelaje hundido por los Kaiten SÍ se añade al total del submarino para puntos de victoria y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols. Furthermore, any tonnage sunk by Kaiten IS added to the submarine's total for victory points and awards.",
    checkCompatibility: (sub) => !!(sub && (sub.has_kaiten || sub.kaiten_note || (sub.kaiten_capacity > 0))),
    rollHandler: "rollSpecKaiten"
  },
  {
    key: "shore_bombardment",
    rule: "7.9",
    icon: "💥",
    title_es: "Bombardeo Costero con Cañón",
    title_en: "Shore Bombardment with Deck Gun",
    req_es: "Requiere cañón de cubierta principal de 140 mm operativo con munición.",
    req_en: "Requires operational 140mm main deck gun with ammunition.",
    zone_es: "Costa Oeste de EE.UU. (Santa Bárbara / Refinería de Ellwood, CA, o Fort Stevens, OR).",
    zone_en: "US West Coast (Santa Barbara / Ellwood Oil Refinery, CA, or Fort Stevens, OR).",
    procedure_es: "Navegar hasta la Costa Oeste de EE.UU. (casilla de Misión). Al llegar, tira en la sección de Misión Especial de la Tabla [A3]. Cualquier encuentro debe ser superado antes del cañoneo. Si hay encuentro, resuélvelo y vuelve a tirar hasta que esté despejado.",
    procedure_en: "Sail to the US West Coast (Mission box). Roll on Chart [A3] Special Mission section before the attempt; any encounter must be survived before shelling. If an encounter occurs, resolve it and re-roll until clear.",
    restrictions_es: "GASTO TOTAL DE MUNICIÓN: Debes emerger y gastar TODA la munición del cañón de cubierta (retirando todos los marcadores de munición de la ficha del submarino).",
    restrictions_en: "EXPEND ALL AMMUNITION: The submarine must surface within deck gun distance and expend ALL deck gun ammunition (removing all deck gun ammunition markers).",
    success_es: "CONDICIÓN DE ÉXITO: Tiene éxito si se dispara toda la munición de cubierta y el submarino regresa sano y salvo a su base naval.",
    success_en: "SUCCESS CONDITION: Successful if all deck gun ammunition is expended and the submarine returns safely to base.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward promotions and decorations.",
    checkCompatibility: (sub) => !!(sub && sub.deck_guns && sub.deck_guns.main),
    rollHandler: "rollSpecShore"
  },
  {
    key: "minelaying",
    rule: "7.10",
    icon: "⚓",
    title_es: "Minado Ofensivo Naval",
    title_en: "Offensive Naval Minelaying",
    req_es: "Submarino de flota cargado con minas en los tubos lanzatorpedos, O submarino minador especializado Kirai-Sen (I-121 a I-124) equipado con compartimento de popa para 42 minas.",
    req_en: "Fleet submarine carrying naval mines loaded in torpedo tubes, OR dedicated Kirai-Sen minelayer (I-121 to I-124) with aft dispenser for 42 mines.",
    zone_es: "Estrechos y accesos marítimos vitales (Singapur, Estrecho de Malaca, Golfo de Lingayen, Australia).",
    zone_en: "Strategic waterways and choke points (Singapore, Malacca Strait, Lingayen Gulf, Australia).",
    procedure_es: "Viaja a la primera casilla en estación (casilla de Misión). Al llegar, tira en la sección de Misión Especial de la Tabla [A3]. Si no aparece aviación enemiga (o mar despejado), se siembran las minas en los estrechos o accesos navales. Si ocurre un encuentro, se combate y se vuelve a tirar hasta que esté despejado. Tras el minado, el resto de la patrulla se conduce normalmente.",
    procedure_en: "Travel to the first on-station travel box (Mission box). Roll on Chart [A3] Special Mission section upon arrival. If no aircraft arrives, mines are laid. If an encounter occurs, conduct combat and re-roll until clear. Once mines are sown, remainder of patrol is conducted normally.",
    restrictions_es: "Para submarinos de flota normales: Las minas se cargan en los tubos lanzatorpedos, reduciendo la carga de torpedos en tantos tubos como posea el buque. Una vez sembradas, los tubos pueden recargarse con torpedos de reserva.",
    restrictions_en: "For standard fleet submarines: Mines are loaded into torpedo tubes, reducing torpedo load by the number of tubes. Once delivered, tubes may be reloaded with spare torpedoes.",
    success_es: "CONDICIÓN DE ÉXITO: La misión es un éxito si las minas son sembradas en la zona asignada, se hunda o no tonelaje enemigo durante la patrulla.",
    success_en: "SUCCESS CONDITION: The mission is a success once mines are laid, whether or not any tonnage is sunk during the patrol.",
    reward_es: "⭐ SUBMARINOS DE FLOTA: Otorga 2 Patrullas Exitosas (Regla 7.13). ⚠️ SALVEDAD KIRAI-SEN: La clase Kirai-Sen mina en CADA patrulla de forma rutinaria y NO recibe el crédito de dos patrullas (Regla 7.10 / 7.13).",
    reward_en: "⭐ FLEET SUBMARINES: Awards 2 Successful Patrols (Rule 7.13). ⚠️ KIRAI-SEN EXCEPTION: Kirai-Sen class conducts minelaying automatically every patrol and does NOT receive double patrol credit (Rule 7.10 / 7.13).",
    checkCompatibility: (sub) => !!(sub && (sub.has_mines || sub.class_name?.includes("Kirai") || sub.is_minelayer || (sub.torpedo_tubes && (sub.torpedo_tubes.bow > 0 || sub.torpedo_tubes.total > 0)))),
    rollHandler: "rollSpecMinelaying"
  },
  {
    key: "passenger",
    rule: "7.11",
    icon: "🕵️",
    title_es: "Entrega de Pasajeros VIP / Agentes Secretos",
    title_en: "VIP Passenger / Agent Delivery",
    req_es: "Apto para cualquier submarino de crucero o flota comisionado. Transporte encubierto de dignatarios (ej. líder nacionalista indio Subhas Chandra Bose hacia la India o agentes en Nueva Guinea).",
    req_en: "Suitable for any fleet or cruiser submarine. Covert transport of dignitaries (e.g., Indian nationalist leader Subhas Chandra Bose toward India or intelligence agents to New Guinea).",
    zone_es: "Costas enemigas de Nueva Guinea o la India.",
    zone_en: "Hostile shores of New Guinea or India.",
    procedure_es: "Viaja a la primera casilla de estación (casilla de Misión). Al llegar, tira en la sección de Misión Especial de la Tabla [A3]. Si no aparece aviación enemiga (o mar despejado), el pasajero es desembarcado en la costa mediante lancha neumática. Si ocurre un encuentro, combátelo y relanza hasta que el área quede despejada. Tras el desembarco, la patrulla continúa normalmente.",
    procedure_en: "Travel to the first on-station travel box (Mission box). Roll on Chart [A3] Special Mission section upon arrival. If no aircraft arrives, the passenger is dropped off via rubber boat. If an encounter occurs, fight and re-roll until clear. Remainder of patrol continues normally.",
    restrictions_es: "El Pasajero cuenta como un 'Piloto' en la Tabla de Heridas de la Tripulación (Crew Injury Chart).",
    restrictions_en: "The Passenger counts as a 'Pilot' on the Crew Injury Chart.",
    success_es: "CONDICIÓN DE ÉXITO: La misión es un éxito una vez desembarcado el pasajero en la costa. FRACASO: Si por mala suerte el pasajero resulta muerto o herido de gravedad antes del desembarco, la misión es un fracaso.",
    success_en: "SUCCESS CONDITION: The mission is a success once the passenger is landed. FAILURE: If by bad luck the passenger is killed or seriously wounded before drop-off, the mission is a failure.",
    reward_es: "⭐ Regla 7.13: Otorga 2 Patrullas Exitosas en el Rogu Bukku para ascensos y condecoraciones.",
    reward_en: "⭐ Rule 7.13: Awards 2 Successful Patrols in the Rogu Bukku toward promotions and decorations.",
    checkCompatibility: (sub) => !sub.is_midget_sub,
    rollHandler: "rollSpecPassenger"
  }
];

let specialMissionsFilter = 'all'; // 'all', 'compatible', 'current'
let activeResolverMission = null;

function getCurrentAssignedMissionKey() {
  if (typeof campaignState === 'undefined' || !campaignState.workflow) return null;
  const wf = campaignState.workflow;
  
  // 1. Explicit assigned key
  if (wf.assignedSpecialMissionKey) return wf.assignedSpecialMissionKey;
  
  // 2. Check specialMissionAssigned, assignedMissionLine, or assignedMissionType
  const str = (wf.specialMissionAssigned || wf.assignedMissionLine || wf.assignedMissionType || '').toLowerCase();
  if (str) {
    for (const m of SPECIAL_MISSIONS_CONFIG) {
      if (str.includes(m.key)) return m.key;
    }
    if (str.includes('recon') || str.includes('aéreo') || str.includes('glen') || str.includes('seiran') || str.includes('exploración')) return 'recon';
    if (str.includes('picket') || str.includes('piquete')) return 'picket';
    if (str.includes('midget') || str.includes('ko-hyoteki') || str.includes('mini')) return 'midget';
    if (str.includes('transport') || str.includes('tokyo') || str.includes('supply') || str.includes('suministro')) return 'transport';
    if (str.includes('yanagi') || str.includes('europe') || str.includes('europa')) return 'yanagi';
    if (str.includes('evac') || str.includes('kiska')) return 'evacuation';
    if (str.includes('bomb') || str.includes('panama') || str.includes('oregon')) return 'bombing';
    if (str.includes('kaiten')) return 'kaiten';
    if (str.includes('shore') || str.includes('bombard') || str.includes('costero')) return 'shore_bombardment';
    if (str.includes('mine') || str.includes('mina') || str.includes('minador')) return 'minelaying';
    if (str.includes('pass') || str.includes('vip') || str.includes('agente') || str.includes('pasajero')) return 'passenger';
  }
  
  // 3. Fallback: match by currentChit / majorEventChit / active area + month
  let chit = wf.currentChit || wf.majorEventChit;
  if (!chit && typeof MISSION_CHITS !== 'undefined' && Array.isArray(MISSION_CHITS)) {
    const curMonth = wf.selectedMonth || '1941-12';
    const area = (wf.assignedArea || wf.patrolArea || '').toLowerCase();
    chit = MISSION_CHITS.find(c => c.validMonths && c.validMonths.includes(curMonth) && (
      (c.redTitle && area.includes(c.redTitle.toLowerCase())) ||
      (c.redSub && area.includes(c.redSub.toLowerCase()))
    ));
  }

  if (chit && chit.whiteLines) {
    const subKey = campaignState.activeSubKey || 'Type_B_Class';
    const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]) ? SUB_DB.submarines[subKey] : {};
    
    // Evaluate line compatibility
    for (const line of chit.whiteLines) {
      const l = line.toLowerCase();
      if (l.includes('midget') && (subData.has_midget_carrier || subData.class_name?.includes("Type C") || subData.class_name?.includes("Type A"))) return 'midget';
      if ((l.includes('recon') || l.includes('bomb')) && (subData.has_aircraft || subData.aircraft_type)) return 'recon';
      if (l.includes('kaiten') && (subData.has_kaiten || subData.kaiten_note)) return 'kaiten';
      if (l.includes('minelay') && (subData.has_mines || subData.class_name?.includes("Kirai"))) return 'minelaying';
      if (l.includes('transport')) return 'transport';
      if (l.includes('picket')) return 'picket';
      if (l.includes('pass')) return 'passenger';
      if (l.includes('evac')) return 'evacuation';
      if (l.includes('shore')) return 'shore_bombardment';
    }
  }

  // 4. Check Kirai-Sen minelayer
  const subKey = campaignState.activeSubKey || '';
  if (subKey.includes('Kirai') || (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]?.is_minelayer)) {
    return 'minelaying';
  }

  return null;
}

function setSpecialMissionsFilter(filterKey) {
  specialMissionsFilter = filterKey;

  // Update button active states
  ['all', 'compatible', 'current'].forEach(k => {
    const btn = document.getElementById(`btn-filter-spec-${k}`);
    if (btn) {
      if (k === filterKey) {
        btn.classList.add('active');
        btn.style.boxShadow = '0 0 10px rgba(234, 179, 8, 0.6)';
        btn.style.borderWidth = '2px';
      } else {
        btn.classList.remove('active');
        btn.style.boxShadow = 'none';
        btn.style.borderWidth = '1px';
      }
    }
  });

  renderSpecialMissionsGrid();

  const isEn = (window.currentLang === 'en');
  if (typeof showToast === 'function') {
    if (filterKey === 'current') {
      showToast(isEn ? "🎯 Filtered by: Current Assigned Special Mission" : "🎯 Filtrado por: Misión Especial Actual Asignada");
    } else if (filterKey === 'compatible') {
      showToast(isEn ? "✅ Filtered by: Compatible Missions (Active Submarine)" : "✅ Filtrado por: Misiones Aptas (Submarino Activo)");
    } else {
      showToast(isEn ? "📚 Showing all 11 Special Missions [Rules 7.1 - 7.11]" : "📚 Mostrando las 11 Misiones Especiales [Reglas 7.1 - 7.11]");
    }
  }
}

function setMissionAsCurrent(key) {
  const isEn = (window.currentLang === 'en');
  if (typeof campaignState !== 'undefined') {
    if (!campaignState.workflow) campaignState.workflow = {};
    campaignState.workflow.assignedSpecialMissionKey = key;
    const m = SPECIAL_MISSIONS_CONFIG.find(x => x.key === key);
    if (m) {
      campaignState.workflow.specialMissionAssigned = isEn ? m.title_en : m.title_es;
      campaignState.workflow.isSpecialMission = true;
    }
    if (typeof saveState === 'function') saveState();
  }

  renderSpecialMissionsGrid();

  if (typeof showToast === 'function') {
    const m = SPECIAL_MISSIONS_CONFIG.find(x => x.key === key);
    const title = m ? (isEn ? m.title_en : m.title_es) : key;
    showToast(isEn 
      ? `🎯 Assigned: ${title} as your Current Special Mission!` 
      : `🎯 ¡Asignada: ${title} como tu Misión Especial Actual!`);
  }
}

function initSpecialMissionsTab() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : 'Type_B_Class';
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]) ? SUB_DB.submarines[subKey] : {};

  // Auto-detect assigned mission key
  const currentAssignedKey = getCurrentAssignedMissionKey();

  // If a mission is assigned, set filter to 'current' so player sees their assigned mission card!
  // If NO mission is assigned, default to 'compatible' so player sees all missions their sub can do!
  if (currentAssignedKey) {
    specialMissionsFilter = 'current';
  } else if (specialMissionsFilter === 'current') {
    specialMissionsFilter = 'compatible';
  }

  // Update button active states
  ['all', 'compatible', 'current'].forEach(k => {
    const btn = document.getElementById(`btn-filter-spec-${k}`);
    if (btn) {
      const isActive = (k === specialMissionsFilter);
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.style.boxShadow = '0 0 10px rgba(234, 179, 8, 0.6)';
        btn.style.borderWidth = '2px';
      } else {
        btn.style.boxShadow = 'none';
        btn.style.borderWidth = '1px';
      }
    }
  });

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

  renderSpecialMissionsGrid();
}

function renderSpecialMissionsGrid() {
  const isEn = (window.currentLang === 'en');
  const subKey = (typeof campaignState !== 'undefined' && campaignState.activeSubKey) ? campaignState.activeSubKey : 'Type_B_Class';
  const subData = (typeof SUB_DB !== 'undefined' && SUB_DB.submarines && SUB_DB.submarines[subKey]) ? SUB_DB.submarines[subKey] : {};
  const currentAssignedKey = getCurrentAssignedMissionKey();

  // Filter list
  let list = SPECIAL_MISSIONS_CONFIG;
  if (specialMissionsFilter === 'compatible') {
    list = list.filter(m => m.checkCompatibility(subData));
  } else if (specialMissionsFilter === 'current') {
    if (currentAssignedKey) {
      list = list.filter(m => m.key === currentAssignedKey);
    } else {
      list = [];
    }
  }

  // Update Alert Banner for Current Mission
  const alertEl = document.getElementById('spec-current-mission-alert');
  const alertMsgEl = document.getElementById('spec-current-alert-msg');
  if (alertEl && alertMsgEl) {
    if (currentAssignedKey) {
      const curM = SPECIAL_MISSIONS_CONFIG.find(x => x.key === currentAssignedKey);
      const curTitle = curM ? (isEn ? curM.title_en : curM.title_es) : currentAssignedKey;
      alertEl.style.display = 'block';
      alertEl.style.background = 'rgba(34,197,94,0.12)';
      alertEl.style.borderColor = '#22c55e';
      alertMsgEl.innerHTML = isEn 
        ? `⭐ <strong>Active Special Mission:</strong> ${curTitle} [Rule ${curM ? curM.rule : ''}]. Ready to execute on your patrol route!`
        : `⭐ <strong>Misión Especial Asignada:</strong> ${curTitle} [Regla ${curM ? curM.rule : ''}]. ¡Lista para ejecutarse en tu ruta de navegación!`;
    } else if (specialMissionsFilter === 'current') {
      alertEl.style.display = 'block';
      alertEl.style.background = 'rgba(234,179,8,0.12)';
      alertEl.style.borderColor = 'var(--gold-500)';
      alertMsgEl.innerHTML = isEn
        ? "⚠️ No Special Mission is currently assigned to this patrol. You may assign any compatible mission below or deploy from Major Events [7.14]."
        : "⚠️ Actualmente tu patrulla no tiene ninguna Misión Especial asignada. Puedes asignar una misión apta abajo o embarcar desde Mayores Eventos [7.14].";
    } else {
      alertEl.style.display = 'none';
    }
  }

  // Update Filter Counter
  const counterEl = document.getElementById('spec-missions-filter-counter');
  if (counterEl) {
    counterEl.innerText = `${isEn ? 'Showing:' : 'Mostrando:'} ${list.length} / ${SPECIAL_MISSIONS_CONFIG.length} ${isEn ? 'Missions' : 'Misiones'}`;
  }

  // Render Mission Cards
  const gridEl = document.getElementById('spec-missions-grid');
  if (!gridEl) return;

  if (list.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:30px 20px; background:rgba(15,23,42,0.6); border:1px dashed #475569; border-radius:8px; color:#cbd5e1;">
        <span style="font-size:2rem; display:block; margin-bottom:8px;">🎯</span>
        <h4 style="margin:0 0 8px 0; color:var(--gold-400);">${isEn ? 'No Mission Matches Active Filter' : 'Ninguna Misión Coincide con el Filtro Activo'}</h4>
        <p style="font-size:0.84rem; color:#94a3b8; margin:0 0 12px 0;">
          ${isEn 
            ? 'Select "Eligible Missions" or "All Missions" above to view available special operations for your submarine.' 
            : 'Selecciona "Misiones Aptas" o "Todas las Misiones" arriba para consultar las operaciones disponibles para tu sumergible.'}
        </p>
        <button type="button" class="action-btn" onclick="setSpecialMissionsFilter('all')" style="padding:6px 14px; font-size:0.82rem; border-color:#38bdf8; color:#7dd3fc;">
          📚 ${isEn ? 'View All Missions [7.1 - 7.11]' : 'Ver Todas las Misiones [7.1 - 7.11]'}
        </button>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = list.map(m => {
    const isCompat = m.checkCompatibility(subData);
    const isCurrent = (m.key === currentAssignedKey);
    const title = isEn ? m.title_en : m.title_es;
    const req = isEn ? m.req_en : m.req_es;
    const zone = isEn ? m.zone_en : m.zone_es;
    const procedure = isEn ? m.procedure_en : m.procedure_es;
    const restrictions = isEn ? m.restrictions_en : m.restrictions_es;
    const success = isEn ? m.success_en : m.success_es;
    const reward = isEn ? m.reward_en : m.reward_es;

    const badgeCompat = isCompat 
      ? `<span style="background:rgba(34,197,94,0.2); border:1px solid #22c55e; color:#86efac; font-size:0.72rem; font-weight:bold; padding:2px 8px; border-radius:4px;">${isEn ? '✅ ELIGIBLE SUB' : '✅ BUQUE APTO'}</span>`
      : `<span style="background:rgba(239,68,68,0.15); border:1px solid #ef4444; color:#fca5a5; font-size:0.72rem; font-weight:bold; padding:2px 8px; border-radius:4px;">${isEn ? '⚠️ REQUIRES SPECIFIC SUB' : '⚠️ REQUIERE BUQUE ESPECÍFICO'}</span>`;

    const badgeCurrent = isCurrent
      ? `<span style="background:rgba(234,179,8,0.25); border:1px solid var(--gold-500); color:var(--gold-300); font-size:0.72rem; font-weight:bold; padding:2px 8px; border-radius:4px; box-shadow:0 0 6px rgba(234,179,8,0.5);">⭐ ${isEn ? 'CURRENT ASSIGNED' : 'MISIÓN ACTUAL'}</span>`
      : '';

    const borderStyle = isCurrent 
      ? 'border:2px solid var(--gold-500); box-shadow:0 0 14px rgba(234,179,8,0.3);'
      : (isCompat ? 'border:1px solid #3b82f6;' : 'border:1px solid #334155;');

    return `
      <div class="flow-card" style="background:#0f172a; ${borderStyle} border-radius:8px; padding:14px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 10px rgba(0,0,0,0.3); position:relative;">
        <div>
          <!-- Header: Icon, Title, Rule, Badges -->
          <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:10px; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.35rem;">${m.icon}</span>
              <div>
                <h4 style="margin:0; color:#f8fafc; font-size:0.98rem; font-family:'Cinzel', serif;">${title}</h4>
                <span style="font-size:0.74rem; color:var(--gold-400); font-weight:bold;">[${isEn ? 'Rule' : 'Regla'} ${m.rule}]</span>
              </div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
              ${badgeCurrent}
              ${badgeCompat}
            </div>
          </div>
          
          <!-- Requisitos y Ubicación -->
          <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:8px; line-height:1.35; background:rgba(0,0,0,0.25); padding:6px 8px; border-radius:4px; border-left:2px solid ${isCompat ? '#3b82f6' : '#64748b'};">
            <strong>${isEn ? 'Requirements & Hulls:' : 'Requisitos y Buques:'}</strong> ${req}<br>
            <strong>${isEn ? 'Theaters / Zones:' : 'Teatros / Zonas:'}</strong> ${zone}
          </div>

          <!-- Procedimiento Oficial según el Manual -->
          <div style="font-size:0.78rem; color:#cbd5e1; margin-bottom:8px; line-height:1.4; background:rgba(30,41,59,0.4); padding:8px; border-radius:4px;">
            <strong style="color:var(--gold-400); display:block; margin-bottom:2px;">${isEn ? 'Official Operating Procedure:' : 'Procedimiento Operativo Oficial:'}</strong>
            ${procedure}
          </div>

          <!-- Restricciones de Combate y Armamento -->
          <div style="font-size:0.76rem; color:#fca5a5; margin-bottom:8px; line-height:1.35; background:rgba(239,68,68,0.08); border-left:2px solid #ef4444; padding:6px 8px; border-radius:4px;">
            <strong style="color:#f87171;">${isEn ? 'Combat & Weapon Restrictions:' : 'Restricciones de Combate y Armamento:'}</strong>
            ${restrictions}
          </div>

          <!-- Condición Oficial de Éxito -->
          <div style="font-size:0.76rem; color:#86efac; margin-bottom:10px; line-height:1.35; background:rgba(34,197,94,0.08); border-left:2px solid #22c55e; padding:6px 8px; border-radius:4px;">
            <strong style="color:#4ade80;">${isEn ? 'Victory Condition (Rulebook):' : 'Condición de Éxito según el Manual:'}</strong>
            ${success}
          </div>
        </div>

        <!-- Footer: Recompensa y Botones de Acción -->
        <div style="border-top:1px solid #1e293b; padding-top:10px; margin-top:8px;">
          <div style="font-size:0.73rem; color:var(--gold-400); font-weight:bold; margin-bottom:8px;">
            ${reward}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; flex-wrap:wrap;">
            ${!isCurrent && isCompat ? `
              <button type="button" class="action-btn" onclick="setMissionAsCurrent('${m.key}')" style="font-size:0.75rem; padding:4px 10px; border-color:var(--gold-500); color:var(--gold-300); background:rgba(234,179,8,0.12);" title="${isEn ? 'Set as current special mission for active patrol' : 'Asignar como misión especial actual para la patrulla'}">
                🎯 ${isEn ? 'Set as Current' : 'Asignar como Actual'}
              </button>
            ` : ''}
            ${(m.key === 'recon' || m.key === 'bombing') ? `
              <button type="button" class="action-btn" onclick="openAircraftDisplayMatModal()" style="font-size:0.75rem; padding:4px 8px; border-color:#38bdf8; color:#7dd3fc; background:rgba(2,132,199,0.18);">
                ✈️ ${isEn ? 'Mat P' : 'Tablero P'}
              </button>
            ` : ''}
            <button type="button" class="action-btn" onclick="openSpecialMissionResolver('${m.key}')" style="font-size:0.78rem; padding:5px 12px; margin-left:auto; border-color:${isCompat ? 'var(--gold-500)' : '#64748b'}; color:${isCompat ? 'var(--gold-300)' : '#94a3b8'}; background:${isCompat ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)'};">
              🎲 ${isEn ? 'Rules & Resolver ➔' : 'Ver Reglas y Resolver ➔'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
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
  
  // Detailed Briefing with official rules text
  const briefingHtml = `
    <div style="margin-bottom:8px;">
      <strong style="color:var(--gold-400);">${isEn ? 'Requirements:' : 'Requisitos:'}</strong> ${isEn ? m.req_en : m.req_es}
    </div>
    <div style="margin-bottom:8px;">
      <strong style="color:var(--gold-400);">${isEn ? 'Procedure:' : 'Procedimiento:'}</strong> ${isEn ? m.procedure_en : m.procedure_es}
    </div>
    <div style="margin-bottom:8px; color:#fca5a5;">
      <strong>${isEn ? 'Restrictions:' : 'Restricciones:'}</strong> ${isEn ? m.restrictions_en : m.restrictions_es}
    </div>
    <div style="color:#86efac;">
      <strong>${isEn ? 'Success Condition:' : 'Condición de Éxito:'}</strong> ${isEn ? m.success_en : m.success_es}
    </div>
  `;
  document.getElementById('spec-res-briefing').innerHTML = briefingHtml;

  // Setup controls
  const controlsEl = document.getElementById('spec-res-controls');
  if (m.key === 'picket') {
    controlsEl.innerHTML = `
      <div style="background:rgba(30,41,59,0.7); border:1px solid #0284c7; border-radius:6px; padding:10px; margin-bottom:10px; font-size:0.82rem; line-height:1.45;">
        <strong style="color:#38bdf8; display:block; margin-bottom:4px;">${isEn ? 'Official Rule [7.2] Instructions:' : 'Procedimiento Oficial de la Regla [7.2]:'}</strong>
        ${isEn 
          ? '1. Sail your patrol in <strong>Phase 2: Transit & Station</strong>.<br>2. <strong>RESTRICTION:</strong> You are strictly forbidden from engaging or following any Merchant Shipping (Freighters/Tankers).<br>3. <strong>SUCCESS:</strong> You must engage at least ONE enemy Warship or Capital Ship (sinking it is not required).<br>4. When returning to port, confirm below if you engaged a warship.' 
          : '1. Navega tu patrulla normalmente en la <strong>Fase 2: Trayecto y Estación</strong>.<br>2. <strong>RESTRICCIÓN:</strong> Está estrictamente prohibido atacar o seguir a buques mercantes (Cargueros/Petroleros).<br>3. <strong>CONDICIÓN DE ÉXITO:</strong> Debes entablar combate al menos con UN buque de guerra o buque capital (no es obligatorio hundirlo).<br>4. Al regresar a base, confirma abajo si entablaste combate con un buque de guerra.'}
      </div>
      <button type="button" class="btn-dice" onclick="executeSpecialMissionRoll('picket')" style="width:100%; padding:10px; font-size:0.92rem; font-weight:bold; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
        ✅ ${isEn ? 'Confirm: Engaged Enemy Warship [Rule 7.2]' : 'Confirmar: He entablado combate con un Buque de Guerra [Regla 7.2]'}
      </button>
      <button type="button" class="action-btn" onclick="setWorkflowPhase(2)" style="width:100%; margin-top:6px; padding:8px; font-size:0.82rem; border-color:#38bdf8; color:#7dd3fc; text-align:center;">
        🚢 ${isEn ? 'Go to Phase 2: Transit (Encounter Rolls)' : 'Ir a Fase 2: Trayecto (Tiradas de Encuentro)'}
      </button>
    `;
    document.getElementById('spec-res-output').innerHTML = isEn 
      ? 'Under Rule 7.2, no separate dice roll is rolled here. The mission is carried out during patrol in Phase 2 & Phase 3. If you engaged a warship, click the button above to confirm and claim credit for 2 successful patrols.' 
      : 'Bajo la Regla 7.2, no se tira un dado aislado aquí. La misión se cumple durante la patrulla en la Fase 2 y Fase 3. Si entablaste combate con un buque de guerra, pulsa el botón superior para confirmar y reclamar las 2 patrullas exitosas.';
  } else if (m.key === 'recon' || m.key === 'bombing') {
    controlsEl.innerHTML = `
      <button type="button" class="btn-dice" onclick="openAircraftDisplayMatModal()" style="width:100%; padding:10px; font-size:0.92rem; font-weight:bold; background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%); box-shadow:0 0 15px rgba(2,132,199,0.4);">
        ✈️ ${isEn ? 'Open Aircraft Display Mat [Chart P / Rule 7.17]' : 'Abrir Tablero de Hidroavión [Chart P / Regla 7.17]'}
      </button>
      <button type="button" class="action-btn" onclick="executeSpecialMissionRoll('${m.key}')" style="width:100%; margin-top:6px; padding:6px; font-size:0.78rem; border-color:#38bdf8; color:#7dd3fc; text-align:center;">
        🎲 ${isEn ? 'Alternative: Quick Dice Roll' : 'Alternativa: Tirada Rápida de Misión'}
      </button>
      <div style="font-size:0.75rem; color:#94a3b8; text-align:center; margin-top:4px;">
        ${isEn ? 'Interactive aircraft mat: Catapult Launch (P1), Encounters (P3-P5), Bombing (P6), and Recovery (P2).' : 'Tablero interactivo: Despegue (P1), Encuentros (P3-P5), Bombardeo (P6) y Amerizaje (P2).'}
      </div>
    `;
    document.getElementById('spec-res-output').innerHTML = isEn 
      ? 'Resort to the Aircraft Module [Rule 7.17]. Use the button above to launch your floatplane, check for catapult mishaps, fly through approach circles, and execute recovery with the submarine crane.' 
      : 'Acude al Módulo de Hidroavión [Regla Oficial 7.17]. Pulsa el botón superior para despegar el hidroavión en catapulta, comprobar percances en P1, explorar los círculos de aproximación y ejecutar la recuperación con la grúa.';
  } else {
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
  }
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
  } else if (key === 'picket') {
    // Picket line: directly confirm engagement with enemy warship per rule 7.2
    success = true;
    html = `
      <div style="font-size:0.95rem; font-weight:bold; color:#38bdf8; margin-bottom:4px;">
        📡 ${isEn ? 'Rule 7.2: Fleet Picket Line Successfully Fulfilled!' : 'Regla 7.2: ¡Línea de Piquete de Flota Cumplida con Éxito!'}
      </div>
      <div>${isEn 
        ? '✅ <strong>WARSHIP ENGAGED!</strong> Your boat held the perimeter picket line, refrained from attacking merchant traffic, and engaged enemy fleet warships. Mission is an official success!' 
        : '✅ <strong>¡BUQUE DE GUERRA ENTABLADO!</strong> Tu buque mantuvo el cordón de alerta, respetó la prohibición de atacar mercantes y entabló combate con buques de guerra enemigos. ¡Misión cumplida según la Regla 7.2!'}
      </div>
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
  
  if (typeof showToast === 'function') {
    showToast(isEn ? "⭐ Rule 7.13 Applied: 2 Successful Patrols Credited!" : "⭐ ¡Regla 7.13 Aplicada: 2 Patrullas Exitosas Acreditadas!");
  }
  const rewardBox = document.getElementById('spec-res-reward-box');
  if (rewardBox) {
    rewardBox.innerHTML = `<strong style="color:#22c55e;">✅ ${isEn ? '2 SUCCESSFUL PATROLS LOGGED TO SERVICE RECORD!' : '¡2 PATRULLAS EXITOSAS REGISTRADAS EN TU EXPEDIENTE!'}</strong>`;
  }
}

// Attach functions to window
window.initSpecialMissionsTab = initSpecialMissionsTab;
window.renderSpecialMissionsGrid = renderSpecialMissionsGrid;
window.setSpecialMissionsFilter = setSpecialMissionsFilter;
window.setMissionAsCurrent = setMissionAsCurrent;
window.getCurrentAssignedMissionKey = getCurrentAssignedMissionKey;
window.openSpecialMissionResolver = openSpecialMissionResolver;
window.closeSpecialMissionResolver = closeSpecialMissionResolver;
window.executeSpecialMissionRoll = executeSpecialMissionRoll;
window.claimSpecialMissionReward = claimSpecialMissionReward;

// Auto-init on DOM or tab switch
document.addEventListener('DOMContentLoaded', () => {
  initSpecialMissionsTab();
});
