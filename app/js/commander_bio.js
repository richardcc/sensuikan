// =========================================================================
// SENSUiKAN: DYNAMIC COMMANDER BIOGRAPHY & PORTRAIT BANK GENERATOR
// Authentic WWII IJN lore, paragraph combinatorial banks and portrait gallery.
// =========================================================================

(function() {
  const COMMANDER_PORTRAITS = [
    { id: "cmdr_1", src: "assets/commanders/cmdr_1.jpg", title: "Capitán Severo (Conning Tower)", titleEn: "Stern Captain (Conning Tower)" },
    { id: "cmdr_2", src: "assets/commanders/cmdr_2.jpg", title: "Veterano con Bigote (Luz Roja)", titleEn: "Mustachioed Veteran (Red Battle Light)" },
    { id: "cmdr_3", src: "assets/commanders/cmdr_3.jpg", title: "Oficial Joven Shōsa (Mesa de Derrota)", titleEn: "Young Shōsa Officer (Chart Table)" },
    { id: "cmdr_4", src: "assets/commanders/cmdr_4.jpg", title: "Comandante Clásico IJN (Binoculares)", titleEn: "Classic IJN Commander (Binoculars)" },
    { id: "cmdr_5", src: "assets/commanders/cmdr_5.jpg", title: "Oficial Ejecutivo (Bitácora)", titleEn: "Executive Officer (Logbook)" },
    { id: "cmdr_6", src: "assets/commanders/cmdr_6.jpg", title: "Navegante Táctico (Sextante)", titleEn: "Tactical Navigator (Sextant)" }
  ];

  // Specific portrait mapping for historical aces
  const ACE_PORTRAITS = {
    "Hashimoto Mochitsura": "cmdr_4",
    "Kinashi Takakazu": "cmdr_2",
    "Matsumura Kenji": "cmdr_1",
    "Tonozuka Kinzo": "cmdr_3"
  };

  // Curated historical biographies for real aces
  const HISTORICAL_ACE_BIOS = {
    "Hashimoto Mochitsura": {
      es: {
        p1: "Nacido en Kioto en una distinguida familia sacerdotal sintoísta, Mochitsura Hashimoto ingresó en la prestigiosa Academia Naval de Etajima (Promoción 59) guiado por una inquebrantable vocación de servicio naval y disciplina espiritual.",
        p2: "Tras graduarse en la Escuela de Torpedos y Submarinos de Kure, adquirió experiencia en combate en patrullas frente a las costas de China y al mando del RO-31 y del I-158. Con el estallido de la Guerra del Pacífico, asumió el mando de unidades de primera línea, destacándose por su riguroso cálculo balístico, meticulosidad y sigilo táctico.",
        p3: "Legendario comandante del I-58 (Tipo B-3), su calma imperturbable y dominio de las salvas de torpedos de oxígeno Tipo 95 y operaciones Kaiten lo consagraron como uno de los marinos más respetados de la Armada Imperial, culminando en el histórico hundimiento del crucero pesado USS Indianapolis."
      },
      en: {
        p1: "Born in Kyoto into an esteemed hereditary Shinto priestly family, Mochitsura Hashimoto entered the prestigious Etajima Imperial Naval Academy (Class 59) guided by steadfast naval vocation and spiritual discipline.",
        p2: "Graduating from the Kure Torpedo & Submarine School, he gained seasoned operational experience patrolling Chinese waters and captaining RO-31 and I-158. With the outbreak of the Pacific War, he assumed fleet command, distinguished by surgical ballistic calculation and tactical stealth.",
        p3: "Legendary captain of I-58 (Type B-3), his unshakeable composure and mastery of Type 95 oxygen torpedo spreads and Kaiten special missions cemented his legacy as one of the IJN's finest commanders, culminating in the sinking of the heavy cruiser USS Indianapolis."
      }
    },
    "Kinashi Takakazu": {
      es: {
        p1: "Nacido en la prefectura de Oita en el seno de una respetada estirpe samurái del clan Bungo, Takakazu Kinashi se graduó en la Academia Naval de Etajima (Promoción 51), demostrando desde sus años de cadete un arrojo táctico y un instinto combativo excepcionales.",
        p2: "Especializado tempranamente en guerra submarina, perfeccionó la agresiva doctrina de ataque nocturno en superficie y aproximación en cota periscópica en mares tempestuosos. Al mando del célebre I-19 (Tipo B), lideró patrullas en el Pacífico Sur con una determinación implacable.",
        p3: "Autor de la salva de torpedos más destructiva y letal de toda la historia naval: el 15 de septiembre de 1942 disparó una salva de 6 torpedos que hundió al portaaviones USS Wasp e impactó simultáneamente al acorazado USS North Carolina y al destructor USS O'Brien."
      },
      en: {
        p1: "Born in Oita Prefecture into a venerable samurai family of the Bungo clan, Takakazu Kinashi graduated from the Etajima Imperial Naval Academy (Class 51), exhibiting extraordinary tactical audacity and combat instinct from his earliest cadet days.",
        p2: "Specializing early in submarine warfare, he pioneered aggressive night-surface approaches and periscope runs in stormy seas. In command of the famed I-19 (Type B), he spearheaded South Pacific patrols with relentless combat drive.",
        p3: "Author of the single deadliest torpedo spread in world naval history: on 15 September 1942, his 6-torpedo spread sank aircraft carrier USS Wasp while simultaneously damaging battleship USS North Carolina and fatalizing destroyer USS O'Brien."
      }
    },
    "Matsumura Kenji": {
      es: {
        p1: "Oriundo de Hiroshima y forjado en las centenarias tradiciones marineras del Mar Interior de Seto, Kenji Matsumura ingresó en la Academia de Etajima impulsado por una profunda pasión por la navegación astronómica y el mando naval.",
        p2: "Oficial veterano del servicio submarino imperial desde la década de 1930, asumió el mando del I-21 (Tipo B). Durante las primeras campañas en el Pacífico Suroccidental, sembró el desconcierto en las rutas logísticas aliadas y en las costas australianas mediante audaces misiones de hostigamiento.",
        p3: "Apodado por su tripulación 'El Halcón de las Profundidades' por su extraordinaria destreza para infiltrarse entre las pantallas de destructores enemigos, maniobrar bajo termoclinas y evadir el sonar sin emitir el más mínimo ruido de cavitación."
      },
      en: {
        p1: "Hailing from Hiroshima and forged in the seafaring heritage of the Seto Inland Sea, Kenji Matsumura entered Etajima driven by an innate gift for celestial navigation and fleet tactical command.",
        p2: "A veteran submariner since the early 1930s, he took command of the long-range cruiser sub I-21 (Type B). In the early campaigns, he wrought havoc across Allied shipping lanes off Australia through daring coastal bombardments and interdiction raids.",
        p3: "Known among his crew as 'The Deep Sea Falcon' for his uncanny knack for slipping through destroyer sonar screens, riding cold thermoclines, and executing zero-cavitation deep evasions under fire."
      }
    },
    "Tonozuka Kinzo": {
      es: {
        p1: "Nacido en Niigata frente al indómito Mar de Japón, Kinzo Tonozuka destacó en Etajima por su brillantez técnica en hidrodinámica submarina, control de trimado y motores diésel de alta potencia.",
        p2: "Ascendió rápidamente al mando del submarino de flota Kaidai KD6 I-168. Durante la crucial Batalla de Midway (junio de 1942), demostró una sangre fría sobrehumana al atravesar una muralla de escoltas y destructores para aproximarse al gigantesco portaaviones averiado.",
        p3: "Bajo una abrumadora lluvia de cargas de profundidad enemigas, Tonozuka mantuvo su buque a tiro y disparó la salva mortal que hundió definitivamente al portaaviones USS Yorktown y al destructor USS Hammann, hazaña cumbre del arma submarina japonesa."
      },
      en: {
        p1: "Born in Niigata on the rugged coast of the Sea of Japan, Kinzo Tonozuka distinguished himself at Etajima for technical brilliance in submarine hydrodynamics, trim control, and high-output diesels.",
        p2: "Rising rapidly to captain the fast fleet submarine Kaidai KD6 I-168, he exhibited superhuman poise during the pivotal Battle of Midway (June 1942), penetrating heavy destroyer screens to track a damaged American carrier.",
        p3: "Under crushing counter-depth-charging, Tonozuka coolly maintained periscope depth and unleashed the fatal torpedo spread that sent aircraft carrier USS Yorktown and destroyer USS Hammann to the ocean floor."
      }
    }
  };

  // Combinatorial paragraph banks for any custom or generated IJN commander
  const BANK_A_ORIGIN = [
    {
      es: "Nacido en Maizuru en el seno de una respetada estirpe de marinos y pescadores de altura, ingresó en la Academia Naval de Etajima fascinado por el sigilo y la potencia de los sumergibles.",
      en: "Born in Maizuru into a respected lineage of seafaring navigators, he entered the Etajima Imperial Naval Academy fascinated by the stealth and lethal striking power of submarines."
    },
    {
      es: "Oriundo de Kure, forjado bajo la sombra de los grandes arsenales y dársenas del Imperio, aprobó con honores su ingreso en la Academia de Etajima guiado por una férrea devoción a la Armada Imperial.",
      en: "Native to Kure, raised in the shadows of the Empire's premier drydocks and naval arsenals, he graduated with distinction from Etajima guided by an iron devotion to the Imperial Navy."
    },
    {
      es: "Procedente de una familia samurái de la prefectura de Kagoshima (antiguo feudo de Satsuma), heredó la indomable tradición guerrera de sus antepasados antes de comisionarse en el arma submarina en Etajima.",
      en: "Hailing from a proud samurai family in Kagoshima (ancient domain of Satsuma), he inherited the warrior ethos of his ancestors before volunteering for the elite submarine service at Etajima."
    },
    {
      es: "Nacido en Yokosuka en una familia de armadores y oficiales de marina, destacó desde su juventud por su brillantez en cálculo trigonométrico y balística marina en las aulas de Etajima.",
      en: "Born in Yokosuka to a family of shipbuilders and naval officers, he demonstrated early brilliance in marine trigonometry and torpedo ballistics during his cadet years at Etajima."
    },
    {
      es: "Criado en las escarpadas costas de Niigata frente al tempestuoso Mar de Japón, forjó un carácter imperturbable que le valió los mayores elogios de sus instructores de navegación en Etajima.",
      en: "Raised along the storm-battered coasts of Niigata on the Sea of Japan, he forged a stoic character that earned high accolades from his navigation instructors at Etajima."
    },
    {
      es: "Hijo de un maestro carpintero de ribera de Sasebo, creció respirando el aire salino de los diques secos imperiales antes de graduarse con altas calificaciones en la Academia Naval de Etajima.",
      en: "Son of a master shipwright from Sasebo, he grew up surrounded by the saltwater berths of the Imperial fleet before graduating with top honors from the Etajima Naval Academy."
    },
    {
      es: "Nacido en Hiroshima en el seno de una tradicional familia vinculada a los santuarios marítimos de Seto, ingresó en Etajima impulsado por un agudo sentido del deber y la disciplina.",
      en: "Born in Hiroshima into a family steeped in the maritime Shinto traditions of Seto, he entered Etajima propelled by a profound sense of duty and spiritual discipline."
    },
    {
      es: "Oriundo de la prefectura de Oita, nieto de navegantes de bajura de Bungo, mostró desde temprana edad un instinto natural para predecir las corrientes oceánicas y la climatología marina en Etajima.",
      en: "Hailing from Oita Prefecture and grandson of coastal Bungo navigators, he displayed a natural instinct for reading ocean swells and marine weather patterns at Etajima."
    }
  ];

  const BANK_B_CAREER = [
    {
      es: "Se especializó en la Escuela de Submarinos de Kure [F1] a fines de los años 30. Durante las operaciones costeras en China perfeccionó el disparo de torpedos de oxígeno Tipo 95 y las maniobras de acecho nocturno en superficie.",
      en: "He specialized at the Kure Submarine School [F1] in the late 1930s. Patrolling Chinese coastal waters, he honed deadly Type 95 oxygen torpedo gunnery and night surface-stalking tactics."
    },
    {
      es: "Tras servir como oficial de torpedos en cruceros pesados, solicitó el traslado a la Sexta Flota de Submarinos. Su doctrina de combate prioriza la aproximación a distancia corta (Close Range) y el escape silencioso bajo la termoclina.",
      en: "After serving as torpedo officer on heavy cruisers, he transferred to the 6th Fleet Submarine Service. His combat doctrine emphasizes audacious close-range attacks followed by silent thermocline evasions."
    },
    {
      es: "Veterano de patrullas de largo alcance en el Pacífico y el Índico, se forjó como oficial ejecutivo (XO) demostrando un dominio absoluto del trimado rápido de inmersión y la resistencia psicológica ante ataques prolongados de cargas de profundidad.",
      en: "A veteran of long-distance Pacific and Indian Ocean patrols, he served as executive officer (XO) mastering crash-dive trim control and psychological resilience under prolonged depth-charge attacks."
    },
    {
      es: "Condecorado en múltiples ocasiones por su audacia táctica, sus superiores lo consideran un maestro de la paciencia ofensiva: capaz de permanecer horas inmóvil a profundidad de periscopio hasta lograr el ángulo de dispersión óptimo.",
      en: "Decorated for tactical audacity, his superiors praise his predatory patience: capable of holding periscope depth for hours until attaining the perfect gyro-angle torpedo spread."
    },
    {
      es: "Desarrolló una innovadora técnica de cálculo visual para estimar la velocidad y rumbo de convoyes enemigos a través del periscopio, reduciendo al mínimo el tiempo de exposición y la posibilidad de contraataque de escoltas.",
      en: "He developed an innovative visual stadimeter technique to plot enemy convoy speed and heading in seconds, drastically cutting periscope exposure time against hostile escorts."
    },
    {
      es: "Formado en las tácticas de interdicción oceánica, destaca por su temple en superficie para emplear el cañón de cubierta de 140mm en condiciones nocturnas, reservando sus valiosos torpedos para buques capitales enemigos.",
      en: "Trained in oceanic interdiction, he is renowned for aggressive night surface deck-gun engagements, preserving precious torpedoes for high-value enemy capital warships."
    }
  ];

  const BANK_C_PERSONAL = [
    {
      es: "Heredó de su abuelo una antigua hoja samurái forjada en Bizen que custodia en la sala de mando como recordatorio del honor imperial. Su dotación lo respeta por su calma granítica cuando el casco cruje bajo la presión del abismo.",
      en: "He carries his grandfather's antique Bizen-forged katana in the control room as an anchor of Imperial honor. His crew reveres his stone-cold composure when the hull groans under crushing deep-sea pressure."
    },
    {
      es: "Profundamente influenciado por la devoción sintoísta de su familia, porta a bordo un amuleto consagrado del Santuario de Kompira. Su liderazgo combina una disciplina inquebrantable con una sincera preocupación por el bienestar de sus marineros.",
      en: "Steeped in Shinto maritime spirituality, he carries an omamori charm from Kompira Shrine. His command style blends uncompromising martial discipline with paternal care for his sailors."
    },
    {
      es: "Lector apasionado de los clásicos tácticos de Sun Tzu y Miyamoto Musashi, transmite a sus oficiales la máxima: 'En la guerra submarina, la precipitación engendra el desastre; la serenidad forja la victoria'.",
      en: "An avid scholar of Sun Tzu and Miyamoto Musashi, he instills in his wardroom the maxim: 'In submarine warfare, haste invites doom; stillness delivers victory.'"
    },
    {
      es: "Conocido por su trato mesurado pero implacable en el puente, su mirada decidida infunde una confianza absoluta en los hombres encargados de los tubos lanzatorpedos y las compuertas de inmersión rápida.",
      en: "Known for measured speech and an iron gaze on the bridge, he inspires absolute faith among the torpedo tube crews and ballast men when entering combat stations."
    },
    {
      es: "Su padre, veterano ingeniero de máquinas navales, le transmitió un respeto sagrado por los motores diésel y la acústica del buque: 'Trata a tu submarino como a un ser vivo y te traerá de regreso a puerto'.",
      en: "His father, a veteran naval machinist, bequeathed him sacred respect for diesel engines and hull acoustics: 'Treat your boat as a living soul, and she will bring you home safely.'"
    }
  ];

  // Simple string hash for deterministic generation when not rolling new
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function generateCommanderBiography(fullName, forceNew = false) {
    if (!fullName) fullName = "Hashimoto Mochitsura";
    fullName = fullName.trim();

    // Check if ace biography exists
    for (const [aceName, bioObj] of Object.entries(HISTORICAL_ACE_BIOS)) {
      if (fullName.toLowerCase().includes(aceName.toLowerCase()) || aceName.toLowerCase().includes(fullName.toLowerCase())) {
        if (!campaignState.workflow.commanderPortraitId || forceNew) {
          campaignState.workflow.commanderPortraitId = ACE_PORTRAITS[aceName] || "cmdr_4";
        }
        campaignState.workflow.commanderBio = bioObj.es;
        campaignState.workflow.commanderBioEn = bioObj.en;
        return { bioEs: bioObj.es, bioEn: bioObj.en, portraitId: campaignState.workflow.commanderPortraitId };
      }
    }

    // Check existing stored bio
    if (!forceNew && campaignState.workflow.commanderBio && campaignState.workflow.commanderBioFor === fullName) {
      return {
        bioEs: campaignState.workflow.commanderBio,
        bioEn: campaignState.workflow.commanderBioEn || campaignState.workflow.commanderBio,
        portraitId: campaignState.workflow.commanderPortraitId || "cmdr_1"
      };
    }

    // Generate combinatorial bio
    const seed = forceNew ? Math.floor(Math.random() * 10000) : hashString(fullName);
    const idxA = seed % BANK_A_ORIGIN.length;
    const idxB = (seed * 3 + 1) % BANK_B_CAREER.length;
    const idxC = (seed * 7 + 3) % BANK_C_PERSONAL.length;
    const portIdx = (seed % COMMANDER_PORTRAITS.length);
    const portId = COMMANDER_PORTRAITS[portIdx].id;

    const parts = fullName.split(/\s+/);
    const surname = parts[0] || "Hashimoto";
    const firstName = parts.slice(1).join(" ") || "Kenji";

    // Build ES bio with customized name
    const p1Es = BANK_A_ORIGIN[idxA].es.replace(/ingresó en la Academia/i, `el Comandante ${surname} ingresó en la Academia`);
    const p2Es = BANK_B_CAREER[idxB].es;
    const p3Es = BANK_C_PERSONAL[idxC].es.replace(/Su padre/i, `Su padre, señor ${surname}`);

    // Build EN bio with customized name
    const p1En = BANK_A_ORIGIN[idxA].en.replace(/entered the Etajima/i, `Commander ${surname} entered the Etajima`);
    const p2En = BANK_B_CAREER[idxB].en;
    const p3En = BANK_C_PERSONAL[idxC].en.replace(/His father/i, `His father, elder ${surname}`);

    const bioEs = { p1: p1Es, p2: p2Es, p3: p3Es };
    const bioEn = { p1: p1En, p2: p2En, p3: p3En };

    campaignState.workflow.commanderBio = bioEs;
    campaignState.workflow.commanderBioEn = bioEn;
    campaignState.workflow.commanderBioFor = fullName;
    if (!campaignState.workflow.commanderPortraitId || forceNew) {
      campaignState.workflow.commanderPortraitId = portId;
    }

    return { bioEs, bioEn, portraitId: campaignState.workflow.commanderPortraitId };
  }

  function cycleCommanderPortrait(direction = 1) {
    const curId = campaignState.workflow.commanderPortraitId || "cmdr_1";
    let curIdx = COMMANDER_PORTRAITS.findIndex(p => p.id === curId);
    if (curIdx < 0) curIdx = 0;
    const nextIdx = (curIdx + direction + COMMANDER_PORTRAITS.length) % COMMANDER_PORTRAITS.length;
    campaignState.workflow.commanderPortraitId = COMMANDER_PORTRAITS[nextIdx].id;
    renderCommanderDossier();
    saveState();
    showToast(`Retrato actualizado: ${COMMANDER_PORTRAITS[nextIdx].title}`);
  }

  function regenerateCommanderBio(forceRandom = true) {
    const name = (campaignState.workflow && campaignState.workflow.commanderName) || 
                 (document.getElementById('wf-commander-name') ? document.getElementById('wf-commander-name').value : "Hashimoto Mochitsura");
    generateCommanderBiography(name, forceRandom);
    renderCommanderDossier();
    saveState();
    showToast("¡Nueva biografía del comandante generada!");
  }

  function renderCommanderDossier() {
    const isEn = window.currentLang === 'en';
    const fullName = (campaignState.workflow && campaignState.workflow.commanderName) || "Hashimoto Mochitsura";
    const rank = (campaignState.workflow && campaignState.workflow.commanderRank) || "Lt Cdr";
    const { bioEs, bioEn, portraitId } = generateCommanderBiography(fullName, false);
    const bio = isEn ? (bioEn || bioEs) : bioEs;
    const portraitObj = COMMANDER_PORTRAITS.find(p => p.id === portraitId) || COMMANDER_PORTRAITS[0];
    const resolvedSrc = (typeof window.resolveAsset === 'function') ? window.resolveAsset(portraitObj.src) : portraitObj.src;

    // 1. Render in Rogu Bukku Dossier (user uploaded section)
    const elBioP1 = document.getElementById('dossier-bio-p1');
    const elBioP2 = document.getElementById('dossier-bio-p2');
    const elBioP3 = document.getElementById('dossier-bio-p3');
    if (elBioP1 && bio.p1) elBioP1.innerHTML = bio.p1;
    if (elBioP2 && bio.p2) elBioP2.innerHTML = bio.p2;
    if (elBioP3 && bio.p3) elBioP3.innerHTML = bio.p3;

    const elRoguImg = document.getElementById('dossier-commander-img');
    if (elRoguImg) elRoguImg.src = resolvedSrc;

    const elRankPill = document.getElementById('dossier-rank-pill');
    if (elRankPill) elRankPill.innerText = `⚓ ${isEn ? 'Rank:' : 'Rango:'} ${rank}`;

    // 2. Render in Phase 0 (Comisionado)
    const elP0Title = document.getElementById('p0-dossier-title');
    if (elP0Title) elP0Title.innerText = isEn ? "COMMANDER DOSSIER & SERVICE RECORD" : "EXPEDIENTE Y BIOGRAFÍA DEL COMANDANTE";
    const elBtnCycle = document.getElementById('p0-btn-cycle-face');
    if (elBtnCycle) elBtnCycle.innerText = isEn ? "Cycle Portrait" : "Cambiar Rostro";
    const elBtnBio = document.getElementById('p0-btn-regen-bio');
    if (elBtnBio) elBtnBio.innerText = isEn ? "New Biography" : "Nueva Biografía";

    const elP0Img = document.getElementById('p0-commander-img');
    if (elP0Img) elP0Img.src = resolvedSrc;

    const portIdx = COMMANDER_PORTRAITS.findIndex(p => p.id === portraitObj.id) + 1;
    const elP0Badge = document.getElementById('p0-portrait-badge');
    if (elP0Badge) elP0Badge.innerText = `${isEn ? 'Portrait' : 'Retrato'} ${portIdx}/6`;

    const elP0Name = document.getElementById('p0-bio-cmdr-name');
    if (elP0Name) elP0Name.innerText = fullName;

    const elP0Rank = document.getElementById('p0-bio-rank-badge');
    if (elP0Rank) elP0Rank.innerText = rank;

    const elP0P1 = document.getElementById('p0-bio-p1');
    const elP0P2 = document.getElementById('p0-bio-p2');
    const elP0P3 = document.getElementById('p0-bio-p3');
    if (elP0P1 && bio.p1) elP0P1.innerHTML = bio.p1;
    if (elP0P2 && bio.p2) elP0P2.innerHTML = bio.p2;
    if (elP0P3 && bio.p3) elP0P3.innerHTML = bio.p3;

    // 3. Render in Chart K1 (Tabla K1 - Habilidades del Capitán y Tripulación)
    const elK1Img = document.getElementById('k1-captain-img') || document.querySelector('.portrait-wrap img');
    if (elK1Img) elK1Img.src = resolvedSrc;
  }

  // Window exports
  window.COMMANDER_PORTRAITS = COMMANDER_PORTRAITS;
  window.generateCommanderBiography = generateCommanderBiography;
  window.cycleCommanderPortrait = cycleCommanderPortrait;
  window.regenerateCommanderBio = regenerateCommanderBio;
  window.renderCommanderDossier = renderCommanderDossier;

  // Auto-render when DOM is loaded or language changes
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(renderCommanderDossier, 300);
  });
})();
