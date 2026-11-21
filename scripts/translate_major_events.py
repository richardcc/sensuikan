import re
import shutil

MAJOR_EVENTS_TRANSLATIONS = {
    "pearl_1241": {
        "title_es": "Pearl Harbor",
        "title_en": "Pearl Harbor",
        "es": "Operación Z (Dic-41): Ataque de 5 mini-submarinos Ko-hyoteki Ha-19 (Mapa M1) y vuelo nocturno de reconocimiento con hidroavión Glen (Tabla P1).",
        "en": "Operation Z (Dec-41): Attack by 5 Ko-Hyoteki midget submarines Ha-19 (Map M1) and night reconnaissance flight with Glen floatplane (Chart P1)."
    },
    "malaya_1241": {
        "title_es": "Malasia",
        "title_en": "Malaya",
        "es": "Invasión de Malasia (Dic-41): Minado de accesos a Singapur, línea de piquete contra la 'Force Z' británica o reconocimiento aéreo.",
        "en": "Invasion of Malaya (Dec-41): Offensive minelaying off Singapore approaches, submarine picket line against British 'Force Z', or aerial reconnaissance."
    },
    "philippines_1241": {
        "title_es": "Filipinas",
        "title_en": "Philippines",
        "es": "Invasión de Filipinas (Dic-41): Minado ofensivo de los estrechos de San Bernardino y accesos a Manila y Lingayen.",
        "en": "Invasion of the Philippines (Dec-41): Offensive minelaying of San Bernardino Strait and maritime approaches to Manila and Lingayen Gulf."
    },
    "dutch_1241_0342": {
        "title_es": "Indias Orientales Holandesas",
        "title_en": "Dutch East Indies",
        "es": "Campaña de las Indias Orientales Holandesas: Caza del convoy aliado ABDACOM en el Mar de Java y estrecho de Sunda.",
        "en": "Dutch East Indies Campaign (Dec-41 to Mar-42): Hunting Allied ABDACOM convoys and warships across the Java Sea and Sunda Strait."
    },
    "uswest_0142": {
        "title_es": "Costa Oeste EE. UU.",
        "title_en": "US West Coast",
        "es": "Ataque a la Costa Oeste de EE. UU. (Ene-42): Bombardeo nocturno con cañón de 140 mm contra la refinería de petróleo de Ellwood (Santa Bárbara, CA) o Fort Stevens.",
        "en": "US West Coast Attack (Jan-42): Night deck gun bombardment (140mm) against the Ellwood Oil Refinery (Santa Barbara, CA) or Fort Stevens."
    },
    "indianocean_0342_0442": {
        "title_es": "Océano Índico",
        "title_en": "Indian Ocean",
        "es": "Incursión del Océano Índico: Reconocimiento aéreo previo con hidroavión sobre Colombo y Trincomalee (Ceilán), apoyando la incursión de Nagumo.",
        "en": "Indian Ocean Raid (Mar-Apr 42): Pre-strike aerial reconnaissance by Glen floatplane over Colombo and Trincomalee (Ceylon) in support of Nagumo's carrier fleet."
    },
    "indianocean_0542": {
        "title_es": "Océano Índico (Madagascar)",
        "title_en": "Indian Ocean (Madagascar)",
        "es": "Ataque a Madagascar / Diego Suárez (May-42): Los submarinos I-16 e I-20 lanzan mini-submarinos Ko-hyoteki, torpedeando al acorazado HMS Ramillies (Mapa M3).",
        "en": "Madagascar / Diego Suarez Attack (May-42): Submarines I-16 and I-20 launch Ko-Hyoteki midget submarines, torpedoing the battleship HMS Ramillies (Map M3)."
    },
    "australia_0542": {
        "title_es": "Australia (Sydney)",
        "title_en": "Australia (Sydney)",
        "es": "Ataque a la Bahía de Sydney (May-42): Vuelo de reconocimiento aéreo con hidroavión sobre Sydney y penetración de 3 mini-submarinos Ko-hyoteki (Mapa M2).",
        "en": "Sydney Harbour Attack (May-42): Aerial reconnaissance flight over Sydney Harbour followed by penetration attack by 3 Ko-Hyoteki midget submarines (Map M2)."
    },
    "aleutians_0542_0642": {
        "title_es": "Islas Aleutianas",
        "title_en": "Aleutian Islands",
        "es": "Operación AL (Islas Aleutianas): Reconocimiento y patrulla de apoyo a la invasión y ocupación de Attu y Kiska.",
        "en": "Operation AL (Aleutian Islands, May-Jun 42): Reconnaissance and screening patrol in support of the amphibious invasion and occupation of Attu and Kiska."
    },
    "midway_0642": {
        "title_es": "Midway",
        "title_en": "Midway",
        "es": "Batalla de Midway (Jun-42): Línea de piquete submarino de vigilancia. El I-168 localiza y hunde al portaaviones USS Yorktown y al destructor Hammann.",
        "en": "Battle of Midway (Jun-42): Submarine picket patrol cordon. Submarine I-168 tracks and sinks the fleet carrier USS Yorktown and destroyer Hammann."
    },
    "uswest_0642_0742": {
        "title_es": "Costa Oeste EE. UU. (Lookout)",
        "title_en": "US West Coast (Lookout)",
        "es": "Ataque Lookout (Jun/Jul-42): El hidroavión Glen del I-25 lanza bombas incendiarias sobre los bosques de Oregón, provocando incendios forestales.",
        "en": "Lookout Air Raids (Jun-Jul 42): Submarine I-25 launches its Glen floatplane to drop incendiary bombs on Oregon coastal forests, igniting forest fires."
    },
    "guadalcanal_0842_1242": {
        "title_es": "Guadalcanal",
        "title_en": "Guadalcanal",
        "es": "Campaña de Guadalcanal: Midget 4 en cabo Esperanza (Mapa M4), piquete de portaaviones (I-19 hunde al USS Wasp) o misiones Tokio Express.",
        "en": "Guadalcanal Campaign (Aug-Dec 42): Midget 4 attack off Cape Esperance (Map M4), carrier interception picket (I-19 sinks USS Wasp), or Tokyo Express runs."
    },
    "indianocean_0842_1142": {
        "title_es": "Océano Índico",
        "title_en": "Indian Ocean",
        "es": "Guerra de corso en el Océano Índico: Interdicción del tráfico comercial británico y petroleros en el Golfo de Adén y costa de África.",
        "en": "Indian Ocean Commerce Raiding (Aug-Nov 42): Interdicting Allied merchant shipping and tankers across the Gulf of Aden and East African sea lanes."
    },
    "australia_0343": {
        "title_es": "Australia Oriental",
        "title_en": "Eastern Australia",
        "es": "Operaciones en costa oriental de Australia (Mar-43): Reconocimiento, sembrado de minas en rutas mercantes de Sydney a Brisbane o patrulla.",
        "en": "East Coast Australia Operations (Mar-43): Coastal reconnaissance, offensive minelaying across Sydney-to-Brisbane merchant lanes, or combat patrol."
    },
    "nguinea_0343": {
        "title_es": "Nueva Guinea (Estado Mayor)",
        "title_en": "New Guinea (Staff Transport)",
        "es": "Transporte de Pasajeros / Estado Mayor a Nueva Guinea tras la batalla del Mar de Bismarck (inserción de oficiales clave y pilotos).",
        "en": "Staff / VIP Passenger Transport to New Guinea following the Battle of the Bismarck Sea (insertion of key army officers, staff, and naval aviators)."
    },
    "nguinea_0343_0643": {
        "title_es": "Nueva Guinea (Tokio Express)",
        "title_en": "New Guinea (Tokyo Express)",
        "es": "Misión de Transporte Submarino Tokio Express: Suministro nocturno de arroz, munición y barcazas Daihatsu a las tropas aisladas en Lae.",
        "en": "Tokyo Express Submarine Transport (Mar-Jun 43): Night supply delivery of rations, ammunition, and Daihatsu supply barges to isolated troops at Lae."
    },
    "guadalcanal_0443_0643": {
        "title_es": "Salomón Centrales",
        "title_en": "Central Solomons",
        "es": "Patrulla de interdicción en las Salomón Centrales (estrechos de Nueva Georgia y Bougainville).",
        "en": "Interdiction Patrol in Central Solomons (Apr-Jun 43): Ambush patrol in the straits of New Georgia, the Slot, and southern Bougainville."
    },
    "aleutians_0643": {
        "title_es": "Aleutianas (Evacuación Kiska)",
        "title_en": "Aleutians (Kiska Evac)",
        "es": "Operación de Evacuación de Kiska (Jun-43): Rescate submarino de la guarnición imperial aislada en las Aleutianas bajo densa niebla.",
        "en": "Kiska Evacuation Operation (Jun-43): Submarine covert rescue and extraction of the isolated imperial garrison in the Aleutians under heavy fog."
    },
    "pearl_1043_1143": {
        "title_es": "Pearl Harbor (Recon Aéreo)",
        "title_en": "Pearl Harbor (Air Recon)",
        "es": "Reconocimiento Aéreo Glen de largo alcance sobre Oahu para espiar las concentraciones de la Flota del Pacífico de Nimitz.",
        "en": "Long-Range Glen Aerial Reconnaissance over Oahu (Oct-Nov 43) to spy on carrier and battleship fleet concentrations at Pearl Harbor."
    },
    "tarawa_1143_1243": {
        "title_es": "Tarawa",
        "title_en": "Tarawa",
        "es": "Operación Galvánic (Islas Gilbert): Despliegue de piquetes defensivos de intercepción durante la invasión de Tarawa y Makin.",
        "en": "Operation Galvanic (Gilbert Islands, Nov-Dec 43): Deployment of defensive interception pickets during the US amphibious invasion of Tarawa and Makin."
    },
    "indianocean_1243": {
        "title_es": "Océano Índico (Pasajeros)",
        "title_en": "Indian Ocean (Passengers)",
        "es": "Transporte de Pasajeros Especiales: Enlace con agentes y líderes nacionalistas (como Subhas Chandra Bose) entre Penang y Sabang.",
        "en": "Special Passenger Transport (Dec-43): Covert insertion and transit of intelligence agents and nationalist leaders between Penang and Sabang."
    },
    "europe_0444": {
        "title_es": "Europa (Misión Yanagi)",
        "title_en": "Europe (Yanagi Mission)",
        "es": "Misión Yanagi (Alemania / Lorient): Misión transoceánica con el Type C-3 (I-52) transportando caucho, opio y wolframio; retorno con radar y tecnología.",
        "en": "Yanagi Exchange Mission to Germany / Lorient (Apr-44): Transoceanic voyage carrying rubber, tungsten, and gold bullion; returning with German radar technology."
    },
    "marianas_0644": {
        "title_es": "Islas Marianas (Operación A-Go)",
        "title_en": "Mariana Islands (Op A-Go)",
        "es": "Operación A-Go (Batalla del Mar de Filipinas): Cordón de submarinos de vigilancia NA. Desastre táctico ante las fuerzas antisubmarinas aliadas.",
        "en": "Operation A-Go (Battle of the Philippine Sea, Jun-44): Submarine advance scout line 'NA' deployed against the US Fifth Fleet carrier task forces."
    },
    "leyte_1044": {
        "title_es": "Golfo de Leyte (Shō-Gō 1)",
        "title_en": "Leyte Gulf (Shō-Gō 1)",
        "es": "Operación Shō-Gō 1 (Batalla del Golfo de Leyte): Cordón de choque contra la flota de invasión del general MacArthur.",
        "en": "Operation Shō-Gō 1 (Battle of Leyte Gulf, Oct-44): Attack and screening picket cordon against General MacArthur's Philippine invasion fleet."
    },
    "marianas_1144_0445": {
        "title_es": "Marianas / Ulithi (Kaiten)",
        "title_en": "Marianas / Ulithi (Kaiten)",
        "es": "Grupo de Ataque Especial Kaiten (Kikusui / Kongō): Ataques con torpedos tripulados suicidas en Ulithi y Kossol Passage.",
        "en": "Kaiten Special Attack Group (Kikusui / Kongō, Nov-44 to Apr-45): Human suicide torpedo strikes against Allied fleet anchorages at Ulithi and Kossol Passage."
    },
    "panama_0145_0745": {
        "title_es": "Canal de Panamá (Seiran)",
        "title_en": "Panama Canal (Seiran)",
        "es": "Operación secreta con los super-submarinos I-400 e I-401 armados con hidroaviones Seiran para bombardear las esclusas del Canal de Panamá.",
        "en": "Top-secret strike with super-submarines I-400 and I-401 armed with Seiran attack floatplanes to bomb the locks of the Panama Canal."
    },
    "iwojima_0245": {
        "title_es": "Iwo Jima",
        "title_en": "Iwo Jima",
        "es": "Batalla de Iwo Jima: Ataques suicidas Kaiten y patrulla de hostigamiento contra la fuerza expedicionaria de marines y acorazados.",
        "en": "Battle of Iwo Jima (Feb-45): Kaiten suicide torpedo strikes and harassing combat patrol against the US amphibious invasion armada and support battleships."
    },
    "okinawa_0445_0545": {
        "title_es": "Okinawa (Operación Ten-Go)",
        "title_en": "Okinawa (Op Ten-Go)",
        "es": "Operación Ten-Go (Batalla de Okinawa): Misiones de choque Kaiten contra la armada de invasión de Kerama Retto.",
        "en": "Operation Ten-Go (Battle of Okinawa, Apr-May 45): Kaiten suicide torpedo missions and perimeter interdiction against the invasion armada off Kerama Retto."
    }
}

# 1. Update app/js/data.js and app/js/components/data.js
for data_path in ['app/js/data.js', 'app/js/components/data.js']:
    with open(data_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for chit_id, trans in MAJOR_EVENTS_TRANSLATIONS.items():
        # Match pattern: { id: "chit_id", ... desc: "..." }
        pattern = re.compile(rf'(\{{\s*id:\s*"{re.escape(chit_id)}"[^}}]*?)(desc:\s*"[^"]*")([^}}]*\}})', re.MULTILINE)
        
        def repl(m):
            prefix = m.group(1)
            suffix = m.group(3)
            # Remove existing desc_en, desc_es, title_en, title_es if present in prefix/suffix
            new_fields = f'desc: "{trans["es"]}", desc_es: "{trans["es"]}", desc_en: "{trans["en"]}", title_es: "{trans["title_es"]}", title_en: "{trans["title_en"]}"'
            return f'{prefix}{new_fields}{suffix}'

        content, count = pattern.subn(repl, content)
        if count == 0:
            print(f"Warning: Could not match {chit_id} in {data_path}")

    with open(data_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✓ Updated {data_path} with bilingual descriptions and titles")

# 2. Update app/js/major_events.js and app/js/components/major_events.js
for me_path in ['app/js/major_events.js', 'app/js/components/major_events.js']:
    with open(me_path, 'r', encoding='utf-8') as f:
        me_content = f.read()

    # A) Inactive campaign banner translation (line ~78)
    old_inactive = r'activeMsgEl\.innerHTML = isEn\s*\?\s*`Comprueba si el mes y año de tu salida[^`]+`\s*:\s*`Comprueba si el mes y año de tu salida[^`]+`;'
    new_inactive = """activeMsgEl.innerHTML = isEn
        ? `Check whether your sortie month and year match any of the designated events. On date <strong>${currentMonth}</strong>, standard patrol orders apply.`
        : `Comprueba si el mes y año de tu salida coincide con alguno de los eventos señalados. En la fecha <strong>${currentMonth}</strong> aplican órdenes de patrulla estándar.`;"""
    me_content = re.sub(old_inactive, new_inactive, me_content)

    # B) Ordinal indicator in priority list
    me_content = me_content.replace('${idx + 1}.ª ${mLine}', '${idx + 1}${isEn ? "." : ".ª"} ${mLine}')

    # C) Chit card title
    old_title = r'\$\{c\.redTitle\}'
    # In header:
    # <h4 ...>${c.redTitle}</h4>
    # <div ...>🗺️ ${c.redTitle}</div>
    me_content = re.sub(r'<h4([^>]*)>\s*\$\{c\.redTitle\}\s*</h4>', r'<h4\1>${isEn ? (c.title_en || c.redTitle) : (c.title_es || c.redTitle)}</h4>', me_content)
    me_content = re.sub(r'🗺️ \$\{c\.redTitle\}', r'🗺️ ${isEn ? (c.title_en || c.redTitle) : (c.title_es || c.redTitle)}', me_content)

    # D) Description paragraph
    old_desc = r'<p style="font-size:0.77rem; color:#cbd5e1; line-height:1.35; margin:0 0 10px 0; min-height:42px;">\s*\$\{c\.desc \|\| \'\'\}\s*</p>'
    new_desc = """<p style="font-size:0.77rem; color:#cbd5e1; line-height:1.35; margin:0 0 10px 0; min-height:42px;">
            ${isEn ? (c.desc_en || c.desc || '') : (c.desc_es || c.desc || '')}
          </p>"""
    me_content = re.sub(old_desc, new_desc, me_content)

    with open(me_path, 'w', encoding='utf-8') as f:
        f.write(me_content)
    print(f"✓ Updated {me_path} with dynamic language selection for descriptions and headers")
