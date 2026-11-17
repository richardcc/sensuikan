with open('app/i18n.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = 'const TEXT_TRANSLATIONS = {'

entries = '''const TEXT_TRANSLATIONS = {
  "Centro de Resolución de Contactos:": "Contact Resolution Center:",
  "Resuelve los encuentros de la casilla según su naturaleza con las tablas visuales completas.": "Resolve box encounters according to their type with full official reference charts.",
  "1. Contacto Naval (Ship / Buque de Guerra / Buque Capital)": "1. Naval Contact (Ship / Warship / Capital Ship)",
  "Superficie": "Surface",
  "Al obtener Ship, Warship o Capital Ship en la Tabla [A3], se genera el buque blanco según las tablas oficiales T1 (Mercante), T2 (Escoltado/Petrolero) o T3 (Buque de Guerra).": "Upon rolling Ship, Warship, or Capital Ship on Chart [A3], generate the target vessel using official tables T1 (Freighter), T2 (Escorted/Tanker), or T3 (Warship).",
  "Tirar Determinación de Blanco:": "Roll Target Determination:",
  "1d100 Oficial": "Official 1d100",
  "Mercante T1": "Freighter T1",
  "Escoltado T2": "Escorted T2",
  "Guerra T3": "Warship T3",
  "Sin blanco asignado": "No target assigned",
  "Tira en T1, T2 o T3 para asignar el buque a la ranura táctica.": "Roll on T1, T2, or T3 to allocate the ship to the tactical slot.",
  "TABLA RESUMEN DE DETERMINACIÓN DE BLANCOS": "TARGET DETERMINATION SUMMARY CHART",
  "Tabla Resumen de Determinación de Blancos": "Target Determination Summary Chart",
  "Encuentro [A3]": "Encounter [A3]",
  "Dado 1d6": "1d6 Die",
  "Tabla Blanco": "Target Chart",
  "Tipo & Escolta": "Type & Escort",
  "Mercante pequeño (Sin escolta)": "Small Freighter (Unescorted)",
  "Mercante grande / Petrolero (Con escolta)": "Large Freighter / Tanker (Escorted)",
  "Destructor / Crucero (Con escolta)": "Destroyer / Cruiser (Escorted)",
  "Acorazado / Portaaviones (Alta escolta)": "Battleship / Aircraft Carrier (Heavy Escort)",
  "¡Entablar Combate Táctico con este Blanco (Fase 3)! ➔": "Engage Tactical Combat with this Target (Phase 3)! ➔",
  "2. Amenaza Aérea (Encuentro Aéreo)": "2. Air Threat (Aircraft Encounter)",
  "Aéreo": "Air",
  "Al obtener Aircraft en la Tabla [A3], el submarino es sorprendido desde el aire. Elige de inmediato entre Inmersión de Emergencia (Tabla A4) o defenderte en superficie con Fuego Antiaéreo (Tabla A2).": "Upon rolling Aircraft on Chart [A3], the submarine is spotted from the air. Choose immediately between Emergency Crash Dive (Chart A4) or defending on the surface with Anti-Aircraft Fire (Chart A2).",
  "TABLA [A4]: ENCUENTRO AÉREO E INMERSIÓN DE EMERGENCIA (2d6)": "CHART [A4]: AIRCRAFT ENCOUNTER & CRASH DIVE (2d6)",
  "Tirar [A4]": "Roll [A4]",
  "Tirada Final": "Final Roll",
  "Resultado": "Result",
  "Efecto Operativo": "Operational Effect",
  "2 x Ataques Aéreos": "2 x Air Attacks",
  "2 pasadas con bombas + 1 herida automática de dotación": "2 bomb runs + 1 automatic crew injury",
  "1 x Ataque Aéreo": "1 x Air Attack",
  "1 pasada con bombas + 1 herida automática de dotación": "1 bomb run + 1 automatic crew injury",
  "Inmersión Exitosa": "Successful Crash Dive",
  "Submarino sumergido a salvo. Sin daños sufridos.": "Submarine submerged safely. No damage sustained.",
  "★ Modificadores por Año (DRM): 1941: +2 | 1942: +1 | 1943: 0 | 1944+: -1": "★ Year Modifiers (DRM): 1941: +2 | 1942: +1 | 1943: 0 | 1944+: -1",
  "★ Modificadores de Tripulación y Buque:": "★ Crew & Submarine Modifiers:",
  "• Dotación Élite: +1 | Dotación Novata: -1 | Toda la tripulación herida/KIA: -1": "• Elite Crew: +1 | Green Crew: -1 | All Crew SW/KIA: -1",
  "• Planos inmersión averiados: -1 | Radar a bordo: +1 | Noche: +1 | Minado/Especial: -1": "• Dive planes damaged: -1 | Radar equipped: +1 | Night: +1 | Minelaying/Special: -1",
  "Sin tirada de inmersión en esta casilla.": "No crash dive roll in this box.",
  "TABLA [A2]: DEFENSA ANTIAÉREA (2d6)": "CHART [A2]: ANTI-AIRCRAFT DEFENSE (2d6)",
  "Tirar AA [A2]": "Roll AA [A2]",
  "Efecto contra Avión": "Effect against Aircraft",
  "Consecuencia": "Consequence",
  "¡Avión Derribado!": "Aircraft Shot Down!",
  "Avión destruido antes de lanzar bombas. Victoria limpia.": "Aircraft destroyed before releasing bombs. Clean victory.",
  "Avión Dañado": "Aircraft Damaged",
  "Ataque interrumpido. Avión se retira con averías.": "Attack aborted. Aircraft retreats damaged.",
  "Fallo (Miss)": "Miss",
  "El avión enemigo bombardea el submarino.": "Enemy aircraft bombs the submarine.",
  "★ Modificadores: 2x Cañones AA: -1 | 3x Cañones AA: -2 | Dotación Veterana/Elite: -1": "★ Modifiers: 2x AA Guns: -1 | 3x AA Guns: -2 | Veteran/Elite Crew: -1",
  "Sin fuego antiaéreo en esta casilla.": "No anti-aircraft fire in this box.",
  "Avión Evadido: Avanzar Casilla": "Aircraft Evaded: Advance Box",
  "Daño Sufrido: Ir a Averías (Fase 4) ➔": "Damage Taken: Proceed to Damage (Phase 4) ➔",
  "Volver a Fase 2: Trayecto": "Back to Phase 2: Transit",
  "Ver Ruta Trayecto": "View Transit Track",
  "Tirar Contacto [A3]": "Roll Contact [A3]",'''

code = code.replace(target, entries, 1)

with open('app/i18n.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated TEXT_TRANSLATIONS in app/i18n.js successfully.")
