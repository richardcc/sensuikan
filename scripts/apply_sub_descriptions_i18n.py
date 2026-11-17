# scripts/apply_sub_descriptions_i18n.py
import json
import re

SUB_DESCS = {
    "Kaidai_KD3_Class": {
        "es": "Submarino de ataque de flota de alta velocidad sin hidroavión. Cuenta con 8 tubos lanzatorpedos en total (6 a proa y 2 a popa).",
        "en": "Fast fleet attack submarine without aircraft. 8 total torpedo tubes (6 forward, 2 aft)."
    },
    "Kaidai_KD4_Class": {
        "es": "Variante Kaidai compacta y maniobrable. Cuenta con 6 tubos lanzatorpedos en total (4 a proa y 2 a popa).",
        "en": "Compact Kaidai variant. 6 torpedo tubes total (4 forward, 2 aft)."
    },
    "Kaidai_KD5_Class": {
        "es": "Profundidad de inmersión mejorada (75 m). Submarino de ataque de flota de alta velocidad.",
        "en": "Improved diving depth (75m). High speed fleet attack boat."
    },
    "Kaidai_KD6_Class": {
        "es": "Los submarinos más rápidos de la IJN antes de la guerra (23 nudos en superficie). Gran reserva de torpedos.\\nConversión a Transporte: En 1/43 puede convertirse en submarino de carga transportando una barcaza de desembarco Daihatsu. De ser así, se retira el cañón de cubierta.",
        "en": "Fastest pre-war IJN submarines (23 knots surface). High torpedo endurance.\\nCargo Conversion: In 1/43, conversion to a cargo submarine may occur and a Daihatsu landing craft carried. If so, remove the deck gun."
    },
    "Kaidai_KD7_Class": {
        "es": "Clase de ataque estandarizada en tiempo de guerra. Los 6 tubos lanzatorpedos a proa y potente artillería antiaérea de 25 mm.",
        "en": "Wartime standardized attack class. All 6 torpedo tubes forward, powerful 25mm AA guns."
    },
    "Kirai_Sen_Class": {
        "es": "Minador especializado (I-121 a I-124). Transporta 42 minas navales en tubos internos de popa. Cada patrulla es automáticamente una misión de minado.\\nAsignación Especial de Averías: El daño a 'Compuertas de Torpedos de Popa' en la Tabla [E6] se aplica a las Compuertas de Minas de Popa.",
        "en": "Specialized minelayer (I-121..I-124). Carries 42 naval mines in aft internal tubes. Every patrol is automatically a minelaying mission.\\nSpecial Damage Routing: Damage to 'Aft Torpedo Doors' on Chart [E6] instead causes damage to the Aft Mine Doors."
    },
    "Junsen_J_IM_Class": {
        "es": "Junsen I modificado con hangar para hidroavión de exploración. 6 tubos lanzatorpedos a proa y sin tubos a popa. Cañón doble de cubierta de 140 mm.",
        "en": "Junsen I modified with seaplane hangar. 6 forward torpedo tubes, no aft tubes. Twin 140mm deck guns."
    },
    "Junsen_J2_Class": {
        "es": "Equipado con hangar de hidroavión a proa de la vela. Recargas dedicadas de popa en los tubos 3 y 4. Cañón de cubierta de doble propósito de 127 mm.",
        "en": "Equipped with aircraft hangar forward of conning tower. Dedicated aft reloads on tubes 3 & 4. 127mm dual-purpose deck gun."
    },
    "Junsen_J3_Class": {
        "es": "Equipado con hangar de hidroavión a proa de la vela. El estado de sistemas incluye casilla de avería para Compuertas de Torpedos de Popa.",
        "en": "Equipped with aircraft hangar forward of conning tower. Systems Status includes Aft Torpedo Doors damage box."
    },
    "Type_A_Class": {
        "es": "Buque insignia de escuadrilla con amplias instalaciones de mando, hidroavión de reconocimiento y cañón de cubierta de 140 mm.",
        "en": "Squadron flagship with extended command facilities, scout seaplane, and 140mm deck gun."
    },
    "Type_B_Class": {
        "es": "La clase de submarino de crucero más numerosa y exitosa de Japón. Transporta 1 hidroavión de exploración Yokosuka E14Y1.",
        "en": "Most numerous and successful Japanese cruiser submarine class. Carries 1 Yokosuka E14Y1 scout seaplane."
    },
    "Type_B_3_Class": {
        "es": "Portador de Kaiten de finales de la guerra. Famoso por hundir al USS Indianapolis (I-58). Equipado con Radar Tipo 22.",
        "en": "Late-war Kaiten carrier. Famous for sinking USS Indianapolis (I-58). Equipped with Type 22 Radar."
    },
    "Type_C_Class": {
        "es": "Submarino pesado de ataque con torpedos: 8 tubos lanzatorpedos a proa y 20 torpedos Tipo 95. Transporta 1 minisubmarino Tipo A (Ko-Hyoteki) con 2 torpedos Tipo 97 en cubierta de popa.\\nRadar: Radar AS/SS Tipo 22 disponible a partir de diciembre de 1944.",
        "en": "Heavy torpedo attack boat: 8 forward torpedo tubes and 20 Type 95 torpedoes. Carries 1 Type A Midget Submarine (Ko-Hyoteki) with 2 Type 97 midget torpedoes on aft deck.\\nRadar: Type 22 AS/SS Radar available Dec. 1944 onwards."
    },
    "Type_A_Modified": {
        "es": "Submarino de crucero de alcance extendido con mayor autonomía diésel, hidroavión de reconocimiento y montajes antiaéreos de 25 mm. Equipado con Radar Tipo 22.",
        "en": "Extended long-range cruiser submarine with improved diesel endurance, scout seaplane, and 25mm AA suites. Type 22 Radar equipped."
    },
    "Sen_Toku_Class": {
        "es": "Disponible en diciembre de 1944. Submarino portaaviones colosal capaz de transportar 3 bombarderos de ataque Aichi M6A1 Seiran.\\nArmamento: Los 8 tubos lanzatorpedos están a proa; cualquier impacto a tubos de popa en la Tabla [E6] se considera Sin Efecto. Potente artillería con Munición x6, 4 montajes triples AA de 25 mm, y Radares de búsqueda aérea Mk 3 M1 y de superficie Mk 2 M2.",
        "en": "Availability December 1944. Massive aircraft carrier submarine carrying 3 Aichi M6A1 Seiran bombers.\\nArmament: All 8 torpedo tubes are Forward; any aft torpedo tube damage hits on Chart [E6] are treated as No Effect. Heavy gun armament with Ammo x6, 4x 25mm Triple AA guns, Mk 3 M1 Air Search and Mk 2 M2 Sea Search Radar."
    },
    "Sen_Taka_Class": {
        "es": "Submarino revolucionario de muy alta velocidad bajo el agua (19 nudos en inmersión). Casco hidrodinámico, esnórquel y baterías de gran capacidad.\\n• Gran Velocidad Submarina: Nunca recibe penalizador de +1 por detección previa.\\n• Impactos en Motores Eléctricos: El segundo impacto en Motor 1 pasa al Motor 3; el segundo en Motor 2 pasa al Motor 4. Todas las penalizaciones de motores en la Tabla [E3] se reducen en 1.\\n• Avería de Baterías: No sufre el modificador de +1 hasta que las tres baterías estén dañadas.",
        "en": "Revolutionary high-speed submarine (19 knots submerged). Streamlined hull, snorkel, high capacity batteries.\\n• High Speed Underwater: Due to very high underwater speed, this class never gets a +1 modifier for previous detection.\\n• Electric Motor Hits: Second Electric Motor 1 hit goes against Electric Motor 3; second Electric Motor 2 hit goes against Electric Motor 4. All penalties for electric motor hits on Chart [E3] are reduced by 1.\\n• Battery Damage: Does not suffer a +1 drm for battery damage until all three have been damaged."
    },
    "Type_C3_Class": {
        "es": "Submarino de carga de alcance ultralargo (misiones Yanagi hacia Alemania). Cañones dobles de cubierta de 140 mm.\\nRadar: Radar AS/SS Tipo 22 disponible a partir de diciembre de 1944.",
        "en": "Extra long-range cargo submarine (Yanagi missions to Germany). Twin 140mm deck guns.\\nRadar: Type 22 AS/SS Radar available Dec. 1944 onwards."
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "es": "Minisubmarino de 2 tripulantes transportado por un submarino nodriza para incursiones de penetración en puertos enemigos [7.16]. Propulsión eléctrica especializada de 600 CV con bancos de baterías a proa y popa, girocompás y cortacables de casco. Armado con dos torpedos Tipo 97 de 45 cm.",
        "en": "Two-man midget submarine carried by fleet submarine mothership for harbour penetration missions [7.16]. Specialized 600 hp electric drive with forward and aft battery banks, gyro compass, and hull wire cutters. Carries two 45cm Type 97 torpedoes."
    }
}

# 1. Update app/js/data.js
with open('app/js/data.js', 'r', encoding='utf-8') as f:
    data_js = f.read()

# We can append a lookup dictionary to SUB_DB or inject special_rules_es directly
dict_js = "\n// SUBMARINES BILINGUAL DESCRIPTIONS DICTIONARY\nconst SUB_DESCRIPTIONS = " + json.dumps(SUB_DESCS, indent=2, ensure_ascii=False) + ";\n"

if "const SUB_DESCRIPTIONS =" not in data_js:
    data_js += dict_js

with open('app/js/data.js', 'w', encoding='utf-8') as f:
    f.write(data_js)

print("Updated app/js/data.js with SUB_DESCRIPTIONS!")

# 2. Update app/js/dock.js to read from SUB_DESCRIPTIONS
with open('app/js/dock.js', 'r', encoding='utf-8') as f:
    dock_js = f.read()

old_desc_line = 'descEl.innerText = isEn ? (s.special_rules_en || s.special_rules || "Imperial Japanese Navy fleet submarine.") : (s.special_rules || "Submarino de flota de la Armada Imperial Japonesa.");'
new_desc_line = '''const subDescEntry = (typeof SUB_DESCRIPTIONS !== 'undefined' && SUB_DESCRIPTIONS[subKey]) ? SUB_DESCRIPTIONS[subKey] : null;
      if (descEl) {
        if (subDescEntry) {
          descEl.innerText = isEn ? (subDescEntry.en || s.special_rules) : (subDescEntry.es || s.special_rules);
        } else {
          descEl.innerText = isEn ? (s.special_rules_en || s.special_rules || "Imperial Japanese Navy fleet submarine.") : (s.special_rules_es || s.special_rules || "Submarino de flota de la Armada Imperial Japonesa.");
        }
      }'''

if old_desc_line in dock_js:
    dock_js = dock_js.replace(old_desc_line, new_desc_line)
    with open('app/js/dock.js', 'w', encoding='utf-8') as f:
        f.write(dock_js)
    print("Updated app/js/dock.js with bilingual description lookup!")
else:
    print("old_desc_line not found in dock_js, checking alternative...")

