import os
import sys
import json
import textwrap
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.path.insert(0, os.path.abspath('.'))
from scripts.generators.generate_canonical_player_cards import (
    BROTHER_COMP, PAGE_W_MM, PAGE_H_MM, VERTICAL_OFFSET_MM,
    SLOT_SIZE, draw_card_slot, draw_nautical_chart_border, draw_print_calibration_and_crop_marks,
    draw_confidential_stamp, draw_imperial_hanko, draw_section_header_plaque, SHIPYARD_METADATA
)

# =========================================================================
# COMPACT UNIVERSAL DIMENSIONS - BALANCED 2.5mm MARGIN ON ALL 4 SIDES
# =========================================================================
CARD_W_MM = 238.0
CARD_H_MM = 180.4  # Content ends at Y=177.9mm + 2.5mm bottom margin = 180.4mm (Equal 2.5mm on all 4 sides!)

# Universal Horizontal Grid (Spacious 1.6mm / 1.7mm inter-counter gaps!)
COLS_9_X = [27.5, 44.1, 60.7, 77.3, 93.9, 110.5, 127.1, 143.7, 160.3]
RIGHT_COLS_X = [177.9, 194.6, 211.3, 228.0]

# =========================================================================
# UNIVERSAL ARMAMENT CONFIGURATION FOR ALL 18 SUBMARINES
# =========================================================================
UNIVERSAL_ARMAMENT_MAP = {
    "Kaidai_KD3_Class": {
        "bow_tubes": 6,
        "aft_r3": [("7", "stern", "tube"), ("8", "stern", "tube"), ("Aft\nReload", "stern", "rld"), ("Aft\nReload", "stern", "rld")],
        "artillery": [("120mm", "gun"), ("Ammo\nx5", "ammo"), ("13.1mm", "aa"), None],
        "fwd_reloads": 8,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD4_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "stern", "tube"), ("6", "stern", "tube"), ("Aft\nReload", "stern", "rld"), ("Aft\nReload", "stern", "rld")],
        "artillery": [("120mm", "gun"), ("Ammo\nx5", "ammo"), ("13.1mm", "aa"), None],
        "fwd_reloads": 6,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD5_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "stern", "tube"), ("6", "stern", "tube"), ("Aft\nReload", "stern", "rld"), ("Aft\nReload", "stern", "rld")],
        "artillery": [("100mm", "gun"), ("Ammo\nx5", "ammo"), ("13.1mm", "aa"), ("Kaiten", "kai")],
        "fwd_reloads": 6,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD6_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "stern", "tube"), ("6", "stern", "tube"), ("Aft\nReload", "stern", "rld"), ("Aft\nReload", "stern", "rld")],
        "artillery": [("100mm", "gun"), ("Ammo\nx5", "ammo"), ("13.1mm", "aa"), ("Daihatsu", "cargo")],
        "fwd_reloads": 6,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD7_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("120mm", "gun"), ("Ammo\nx5", "ammo"), ("25mm AA\n#1", "aa"), ("25mm AA\n#2", "aa")],
        "fwd_reloads": 6,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Kirai_Sen_Class": {
        "bow_tubes": 4,
        "aft_r3": [("Aft Mine\nDoors", "stern", "mine_door"), ("Mines\nx42", "cargo", "mines"), None, None],
        "artillery": [("140mm", "gun"), ("Ammo\nx5", "ammo"), None, None],
        "fwd_reloads": 8,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes", "Radio",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Junsen_J_IM_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "stern", "tube"), ("6", "stern", "tube"), ("140mm\n#2", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("140mm\n#1", "gun"), ("Ammo\nx5", "ammo"), None, None],
        "fwd_reloads": 12,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Junsen_J2_Class": {
        "bow_tubes": 6,
        "aft_r3": [("7", "stern", "tube"), ("8", "stern", "tube"), ("Aft\nReload", "stern", "rld"), ("Aft\nReload", "stern", "rld")],
        "artillery": [("127mm", "gun"), ("Ammo\nx5", "ammo"), ("13.1mm", "aa"), None],
        "fwd_reloads": 10,
        "sys": ["Crane", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Hydrophones", "Batteries", "Periscope", None]
    },
    "Junsen_J3_Class": {
        "bow_tubes": 6,
        "aft_r3": [("7", "stern", "tube"), ("8", "stern", "tube"), ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("13.1mm\n#1", "aa"), ("13.1mm\n#2", "aa"), ("Kaiten", "kai"), ("Kaiten", "kai")],
        "fwd_reloads": 11,
        "sys": ["Crane", "Aft Torp Doors", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_A_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("25mm Twin\n#1", "aa"), ("25mm Twin\n#2", "aa"), None, None],
        "fwd_reloads": 12,
        "sys": ["Crane", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_B_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("25mm Twin\n#1", "aa"), ("25mm Twin\n#2", "aa"), ("Kaiten", "kai"), ("Kaiten", "kai")],
        "fwd_reloads": 11,
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_B_3_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("25mm Triple\n#1", "aa"), ("25mm Triple\n#2", "aa"), ("Kaiten", "kai"), ("Kaiten", "kai")],
        "fwd_reloads": 11,
        "sys": ["Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
                "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Hydrophones", "Batteries", "Periscope", None]
    },
    "Type_C_Class": {
        "bow_tubes": 8,
        "aft_r3": [None, None, ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("25mm Twin\n#1", "aa"), ("25mm Twin\n#2", "aa"), ("Kaiten", "kai"), ("Kaiten", "kai")],
        "fwd_reloads": 12,
        "sys": ["Type 22 Radar", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_C3_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, ("140mm\n#1", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("140mm\n#2", "gun"), ("Ammo\nx5", "ammo"), ("25mm Twin\n#1", "aa"), ("25mm Twin\n#2", "aa")],
        "fwd_reloads": 13,
        "sys": ["Type 22 Radar", "Cargo", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_A_Modified": {
        "bow_tubes": 6,
        "aft_r3": [None, None, ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("25mm Triple\n#1", "aa"), ("25mm Triple\n#2", "aa"), ("25mm Single", "aa"), None],
        "fwd_reloads": 12,
        "sys": ["Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
                "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Hydrophones", "Batteries", "Periscope", None]
    },
    "Sen_Toku_Class": {
        "bow_tubes": 8,
        "aft_r3": [None, None, ("140mm", "gun"), ("Ammo\nx5", "ammo")],
        "artillery": [("25mm Triple\n#1", "aa"), ("25mm Triple\n#2", "aa"), ("25mm Triple\n#3", "aa"), ("25mm Single", "aa")],
        "fwd_reloads": 12,
        "sys": ["Crane", "Hangar", "Radio", "Periscope",
                "Hydrophones", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes",
                "Batteries", "Fuel Tanks", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Diesel Engine 3", "Diesel Engine 4"]
    },
    "Sen_Taka_Class": {
        "bow_tubes": 4,
        "aft_r3": [None, None, ("25mm Single", "aa"), None],
        "artillery": [None, None, None, None],
        "fwd_reloads": 6,
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Electric Motor 3", "Electric Motor 4",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries 1", "Batteries 2", "Batteries 3", "Periscope"]
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "bow_tubes": 2,
        "aft_r3": [None, None, None, None],
        "artillery": [None, None, None, None],
        "fwd_reloads": 0,
        "sys": ["Fwd Battery", "Aft Battery", "Wire Cutters", "Gyro Compass",
                "Propeller", "Electric Motor", "Horiz. Rudder", "Vertical Rudder",
                "Radio", "Hydrophones", "Periscope", None,
                None, None, None, None]
    }
}

I18N_SYSTEMS = {
    'es': {
        "F. Torp. Doors (Odd)": "C. Proa\n(Imp)",
        "F. Torp. Doors (Even)": "C. Proa\n(Par)",
        "Aft Torp Doors": "Compuertas\nPopa",
        "Aft.Doors": "Compuertas\nPopa",
        "Radio": "Radio",
        "Dive Planes": "Timón de\nProfund.",
        "Electric Motor 1": "Motor Eléc.\n#1",
        "Electric Motor 2": "Motor Eléc.\n#2",
        "Electric Motor 3": "Motor Eléc.\n#3",
        "Electric Motor 4": "Motor Eléc.\n#4",
        "Diesel Engine 1": "Motor Diésel\n#1",
        "Diesel Engine 2": "Motor Diésel\n#2",
        "Diesel Engine 3": "Motor Diésel\n#3",
        "Diesel Engine 4": "Motor Diésel\n#4",
        "Fuel Tanks": "Tanques\nCombust.",
        "Hydrophones": "Hidró-\nfonos",
        "Batteries": "Baterías",
        "Batteries 1": "Baterías\n#1",
        "Batteries 2": "Baterías\n#2",
        "Batteries 3": "Baterías\n#3",
        "Periscope": "Peri-\ncopio",
        "Hangar": "Hangar\nAvión",
        "Crane": "Grúa\nAvión",
        "Type 22 Radar": "Radar\nTipo 22",
        "Cargo": "Bodega\nCarga",
        "Fwd Battery": "Batería\nProa",
        "Aft Battery": "Batería\nPopa",
        "Wire Cutters": "Corta-\ncables",
        "Gyro Compass": "Giro-\ncompás",
        "Propeller": "Hélice",
        "Electric Motor": "Motor\nEléctrico",
        "Horiz. Rudder": "Timón\nHoriz.",
        "Vertical Rudder": "Timón\nVertical",
        "Mine Doors": "Compt.\nMinas",
        "Mine Handling": "Manej.\nMinas",
        "Kaiten": "Kaiten"
    },
    'en': {
        "F. Torp. Doors (Odd)": "F. Doors\n(Odd)",
        "F. Torp. Doors (Even)": "F. Doors\n(Even)",
        "Aft Torp Doors": "Aft Torp\nDoors",
        "Aft.Doors": "Aft Torp\nDoors",
        "Radio": "Radio",
        "Dive Planes": "Dive\nPlanes",
        "Electric Motor 1": "Elec. Mtr\n#1",
        "Electric Motor 2": "Elec. Mtr\n#2",
        "Electric Motor 3": "Elec. Mtr\n#3",
        "Electric Motor 4": "Elec. Mtr\n#4",
        "Diesel Engine 1": "Diesel Eng.\n#1",
        "Diesel Engine 2": "Diesel Eng.\n#2",
        "Diesel Engine 3": "Diesel Eng.\n#3",
        "Diesel Engine 4": "Diesel Eng.\n#4",
        "Fuel Tanks": "Fuel\nTanks",
        "Hydrophones": "Hydro-\nphones",
        "Batteries": "Batteries",
        "Batteries 1": "Batteries\n#1",
        "Batteries 2": "Batteries\n#2",
        "Batteries 3": "Batteries\n#3",
        "Periscope": "Peri-\nscope",
        "Hangar": "Aircraft\nHangar",
        "Crane": "Aircraft\nCrane",
        "Type 22 Radar": "Type 22\nRadar",
        "Cargo": "Cargo\nHold",
        "Fwd Battery": "Fwd\nBattery",
        "Aft Battery": "Aft\nBattery",
        "Wire Cutters": "Wire\nCutters",
        "Gyro Compass": "Gyro\nCompass",
        "Propeller": "Propeller",
        "Electric Motor": "Electric\nMotor",
        "Horiz. Rudder": "Horiz.\nRudder",
        "Vertical Rudder": "Vertical\nRudder",
        "Mine Doors": "Mine\nDoors",
        "Mine Handling": "Mine\nHandling",
        "Kaiten": "Kaiten"
    }
}

I18N_UI = {
    'es': {
        'specs_title': 'CARACTERÍSTICAS Y ESPECIFICACIONES',
        'len': 'ESL:', 'spd': 'VEL:', 'disp': 'DESP:', 'rng': 'ALC:', 'crew': 'DOT:', 'hulls': 'CASCOS:',
        'men': 'hombres',
        'current_base': 'Base\nActual', 'mission': 'Misión', 'at_port': 'En\nPuerto',
        'patrol_header': 'TRACK DE PATRULLA (TRÁNSITO Y ESTACIÓN)',
        'damage_header': 'TRACKS DE DAÑO (INUNDACIÓN Y CASCO)',
        'flood_marker': 'Marcador\nInundación', 'hull_marker': 'Marcador\nDaño Casco',
        'flood': 'Inund.', 'surface': 'Superficie', 'hull': 'Casco', 'sunk': 'Hundido',
        'crew_header': 'ESTADO DE TRIPULACIÓN Y CALIDAD',
        'captain': 'Capitán', 'engineer': 'Jefe Máq.', 'xo': '2.º Cmdte.', 'nav': 'Navegante', 'medic': 'Médico',
        'crew_label': 'Dotación', 'crew_quality': 'Calidad\nTripul.',
        'pilot': 'Piloto', 'midget_crew': 'Tripul. Sub\nEnano',
        'systems_header': '⚙ ESTADO DE SISTEMAS',
        'rules_header': 'REGLAS ESPECIALES Y NOTAS HISTÓRICAS:',
        'aircraft_header': '✈ REGISTRO DE HIDROAVIÓN Y EVENTOS TÁCTICOS',
        'fwd_tubes_header': '▲ TUBOS DE TORPEDO DE PROA (1–8)',
        'aft_tubes_header': '▼ TUBOS DE POPA Y RECARGAS',
        'artillery_header': '⚔ ARTILLERÍA Y ARMAS DE CUBIERTA',
        'reloads_header': '▲ RECARGAS DE TORPEDO DE PROA (1–16)',
        'transit': 'Tránsito', 'station': 'En\nEstación', 'penetrate': 'Penetración', 'attack': 'Ataque', 'egress': 'Salida', 'recover': 'Recuperación',
        'bow_sub': 'Proa', 'stern_sub': 'Popa', 'reload_lbl': 'Recarga', 'reload_sub': 'Proa / T-95',
        'aft_reload_lbl': 'Recarga\nPopa', 'aft_reload_sub': 'Popa / T-95',
        'deck_gun_sub': 'Cañón', 'ammo_sub': 'Munición', 'aa_gun_sub': 'Antiaéreo', 'special_sub': 'Especial', 'cargo_sub': 'Carga',
        'random_event': 'Evento\nAleatorio', 'status_sfx': 'Estado',
        'sheet_str': 'Hoja', 'side_a': 'Cara A (Anverso)', 'side_b': 'Cara B (Reverso)',
        'footer': 'Tablero Canónico Sensuikan • Hoja {sheet}/9 • {side} (Página {page:02d}/18) • {family} • Reverso: {paired} • Impresión Doble Cara (Voltear en Borde Largo) • Escala 100%'
    },
    'en': {
        'specs_title': 'VESSEL PARTICULARS & SPECIFICATIONS',
        'len': 'LEN:', 'spd': 'SPD:', 'disp': 'DISP:', 'rng': 'RNG:', 'crew': 'CREW:', 'hulls': 'HULLS:',
        'men': 'men',
        'current_base': 'Current\nBase', 'mission': 'Mission', 'at_port': 'At\nPort',
        'patrol_header': 'PATROL TRACK (TRANSIT & ON-STATION PHASES)',
        'damage_header': 'DAMAGE TRACKS (FLOODING & HULL DAMAGE)',
        'flood_marker': 'Flooding\nMarker', 'hull_marker': 'Hull Damage\nMarker',
        'flood': 'Flood', 'surface': 'Surface', 'hull': 'Hull', 'sunk': 'Sunk',
        'crew_header': 'CREW STATUS & QUALITY',
        'captain': 'Captain', 'engineer': 'Engineer', 'xo': 'XO', 'nav': 'Nav.', 'medic': 'Medic',
        'crew_label': 'Crew', 'crew_quality': 'Crew\nQuality',
        'pilot': 'Pilot', 'midget_crew': 'Midget Sub\nCrew',
        'systems_header': '⚙ SYSTEMS STATUS',
        'rules_header': 'SPECIAL RULES & HISTORICAL NOTES:',
        'aircraft_header': '✈ AIRCRAFT & TACTICAL EVENT RECORD',
        'fwd_tubes_header': '▲ FORWARD TORPEDO TUBES (1–8)',
        'aft_tubes_header': '▼ AFT TUBES & STERN RELOADS',
        'artillery_header': '⚔ ARTILLERY & DECK WEAPONS',
        'reloads_header': '▲ FORWARD TORPEDO RELOADS (1–16)',
        'transit': 'Transit', 'station': 'On\nStation', 'penetrate': 'Penetrate', 'attack': 'Attack', 'egress': 'Egress', 'recover': 'Recover',
        'bow_sub': 'Bow', 'stern_sub': 'Stern', 'reload_lbl': 'Reload', 'reload_sub': 'Bow / T-95',
        'aft_reload_lbl': 'Aft\nReload', 'aft_reload_sub': 'Stern / T-95',
        'deck_gun_sub': 'Deck Gun', 'ammo_sub': 'Munition', 'aa_gun_sub': 'AA Gun', 'special_sub': 'Special', 'cargo_sub': 'Cargo',
        'random_event': 'Random\nEvent', 'status_sfx': 'Status',
        'sheet_str': 'Sheet', 'side_a': 'Side A (Front)', 'side_b': 'Side B (Reverse)',
        'footer': 'Sensuikan Canonical Board • Sheet {sheet}/9 • {side} (Page {page:02d}/18) • {family} • Reverse: {paired} • Double-Sided Print (Flip on Long Edge) • 100% Scale'
    }
}

I18N_SPECIAL_RULES = {
    'en': {
        'Kaidai_KD3_Class': ("Fast fleet attack submarine without aircraft. 8 total torpedo tubes (6 forward, 2 aft).", None),
        'Kaidai_KD4_Class': ("Compact Kaidai variant. 6 torpedo tubes total (4 forward, 2 aft).", None),
        'Kaidai_KD5_Class': ("Improved diving depth (75m). High speed fleet attack boat.", "In 4/45 Kaiten may be installed. If so, remove deck gun. Kaiten carried ONLY on Kaiten missions."),
        'Kaidai_KD6_Class': ("Fastest pre-war IJN submarines (23 knots surface). High torpedo endurance.\nCargo: In 1/43, conversion to cargo submarine may occur (carries Daihatsu craft; remove deck gun).", "In 1945 may convert to Kaiten carrier (removes deck gun). Carried ONLY on Kaiten missions."),
        'Kaidai_KD7_Class': ("Wartime standardized attack class. All 6 torpedo tubes forward, powerful 25mm AA guns.", None),
        'Kirai_Sen_Class': ("Specialized minelayer (I-121..I-124). Carries 42 naval mines in aft internal tubes. Every patrol is automatically a minelaying mission.\nSpecial Damage: Damage to 'Aft Torpedo Doors' on Chart [E6] instead affects Aft Mine Doors.", None),
        'Junsen_J_IM_Class': ("Junsen I modified with seaplane hangar. 6 forward torpedo tubes, no aft tubes. Twin 140mm deck guns.", None),
        'Junsen_J2_Class': ("Equipped with aircraft hangar forward of conning tower. Dedicated aft reloads on tubes 3 & 4. 127mm dual-purpose deck gun.", None),
        'Junsen_J3_Class': ("Equipped with aircraft hangar forward of conning tower. Systems Status includes Aft Torpedo Doors damage box.", "In 10/44 Kaiten may be installed. If so, remove aircraft. Carried ONLY on Kaiten missions."),
        'Type_A_Class': ("Squadron flagship with extended command facilities, scout seaplane, and 140mm deck gun.", None),
        'Type_B_Class': ("Most numerous and successful Japanese cruiser submarine class. Carries 1 Yokosuka E14Y1 scout seaplane.", "In 12/44 Kaiten may be installed with 2nd 25mm Twin AA. If so, remove Deck Gun and aircraft. Carried ONLY on Kaiten missions."),
        'Type_B_3_Class': ("Late-war Kaiten carrier. Sunk USS Indianapolis (I-58). Equipped with Type 22 Radar.", "In 12/44 Kaiten may be installed with 2nd 25mm Twin AA. If so, remove Deck Gun and aircraft. Carried ONLY on Kaiten missions."),
        'Type_C_Class': ("Heavy torpedo attack boat: 8 bow tubes, 20 Type 95 torpedoes. Carries 1 Type A Midget Submarine (Ko-Hyoteki) on aft deck.\nRadar: Type 22 Radar available from Dec. 1944.", None),
        'Type_A_Modified': ("Extended long-range cruiser sub with improved diesel endurance, scout plane, and 25mm AA suites. Type 22 Radar equipped.", None),
        'Sen_Toku_Class': ("Available Dec 1944. Massive carrier sub carrying 3 Aichi M6A1 Seiran bombers.\nArmament: All 8 tubes are Forward; Chart [E6] aft tube hits treat as No Effect. Heavy gun armament (Ammo x6), 4x 25mm Triple AA, Mk 3 M1 / Mk 2 M2 Radar.", None),
        'Sen_Taka_Class': ("High-speed sub (19 kt submerged). Streamlined hull, snorkel, high capacity batteries.\n• High Speed: Never suffers +1 DRM for previous detection.\n• Motors: 2nd hit on Motor 1 -> Motor 3; 2nd on Motor 2 -> Motor 4. [E3] motor penalties reduced by 1.\n• Batteries: Suffers +1 DRM only when all 3 banks are damaged.", None),
        'Type_C3_Class': ("Extra long-range cargo submarine (Yanagi missions to Germany). Twin 140mm deck guns.\nRadar: Type 22 Radar available from Dec. 1944.", "In 12/44 Kaiten are installed. Remove 2nd Deck Gun & ammo. Carried ONLY on Kaiten missions."),
        'Type_A_Midget_Submarine___Ko_Hyoteki': ("Two-man midget submarine launched from mothership for harbour penetration [7.16]. 600 hp electric drive, forward/aft battery banks, gyro compass, wire cutters. 2x 45cm Type 97 torpedoes.", None)
    },
    'es': {
        'Kaidai_KD3_Class': ("Submarino de ataque de escuadra rápido sin hidroavión. 8 tubos lanzatorpedos en total (6 a proa, 2 a popa).", None),
        'Kaidai_KD4_Class': ("Variante Kaidai compacta. 6 tubos lanzatorpedos en total (4 a proa, 2 a popa).", None),
        'Kaidai_KD5_Class': ("Profundidad de inmersión mejorada (75 m). Alta velocidad en superficie.", "En 4/45 puede instalar Kaiten (elimina el cañón de cubierta). Embarcados SOLO en misiones Kaiten."),
        'Kaidai_KD6_Class': ("Submarinos más veloces de preguerra (23 nudos). Gran autonomía de torpedos.\nCarga: En 1/43 puede convertirse en transporte (lleva lancha Daihatsu; retira cañón de cubierta).", "En 1945 puede convertirse en portador Kaiten (retira cañón). Solo en misiones Kaiten."),
        'Kaidai_KD7_Class': ("Clase de ataque estandarizada de guerra. Los 6 tubos a proa, potente artillería AA de 25 mm.", None),
        'Kirai_Sen_Class': ("Minador especializado (I-121..I-124). Lleva 42 minas navales en tubos de popa. Cada patrulla es misión de minado.\nDaño Especial: Daño en 'Compuertas Popa' en Tabla [E6] afecta a Compuertas de Minas de Popa.", None),
        'Junsen_J_IM_Class': ("Junsen I modificado con hangar para hidroavión. 6 tubos a proa, sin tubos a popa. Dos cañones de 140 mm.", None),
        'Junsen_J2_Class': ("Equipado con hangar para hidroavión a proa de la torre. Recargas dedicadas para tubos 3 y 4. Cañón de 127 mm.", None),
        'Junsen_J3_Class': ("Equipado con hangar para hidroavión a proa de la torre. El estado de sistemas incluye casilla de compuertas de popa.", "En 10/44 puede instalar Kaiten (retira el avión). Embarcados SOLO en misiones Kaiten."),
        'Type_A_Class': ("Buque insignia de flotilla con puesto de mando ampliado, hidroavión de exploración y cañón de 140 mm.", None),
        'Type_B_Class': ("La clase de crucero submarino más numerosa y exitosa de la AIJ. Lleva 1 hidroavión Yokosuka E14Y1.", "En 12/44 puede instalar Kaiten y segundo AA doble de 25 mm (retira cañón y avión). Solo misiones Kaiten."),
        'Type_B_3_Class': ("Portador Kaiten de final de guerra. Famoso por hundir el USS Indianapolis (I-58). Equipado con Radar Tipo 22.", "En 12/44 puede instalar Kaiten y segundo AA doble de 25 mm (retira cañón y avión). Solo misiones Kaiten."),
        'Type_C_Class': ("Submarino de ataque pesado: 8 tubos a proa, 20 torpedos Tipo 95. Transporta 1 submarino enano Tipo A en cubierta de popa.\nRadar: Radar Tipo 22 disponible desde dic. 1944.", None),
        'Type_A_Modified': ("Crucero submarino de muy largo alcance con autonomía diésel mejorada, hidroavión y baterías AA de 25 mm. Con Radar Tipo 22.", None),
        'Sen_Toku_Class': ("Disponible en dic. 1944. Submarino portaviones gigante con 3 bombarderos Aichi M6A1 Seiran.\nArmamento: Los 8 tubos están a proa; impactos a tubos de popa en [E6] sin efecto. Cañón con munición x6, 4x AA triples de 25 mm, Radares Mk 3 M1 y Mk 2 M2.", None),
        'Sen_Taka_Class': ("Submarino rápido revolucionario (19 nudos en inmersión). Casco hidrodinámico, esnórquel y baterías de gran capacidad.\n• Alta Velocidad: Nunca sufre penalización +1 DRM por detección previa.\n• Motores: 2.º impacto en Motor 1 -> Motor 3; 2.º en Motor 2 -> Motor 4. Penalizaciones en [E3] reducidas en 1.\n• Baterías: Sufre +1 DRM solo si los 3 bancos están dañados.", None),
        'Type_C3_Class': ("Submarino de transporte de alcance oceánico extremo (misiones Yanagi a Alemania). Dos cañones de 140 mm.\nRadar: Radar Tipo 22 disponible desde dic. 1944.", "En 12/44 instala Kaiten (retira segundo cañón y munición). Embarcados SOLO en misiones Kaiten."),
        'Type_A_Midget_Submarine___Ko_Hyoteki': ("Submarino enano biplaza lanzado desde submarino nodriza para incursiones en puertos [7.16]. Motor eléctrico de 600 hp, bancos de baterías proa/popa, girocompás y cortacables. 2x torpedos Tipo 97 de 45 cm.", None)
    }
}

def draw_localized_armament_slot(ax, cx, cy, item, lang='es'):
    ui = I18N_UI[lang]
    if item is None:
        draw_card_slot(ax, cx, cy, is_inactive=True)
        return
    
    lbl, itype = item[0], item[-1]
    sublbl = item[1] if len(item) == 3 else ""

    if itype == "tube":
        tube_sub = ui['stern_sub'] if sublbl == 'stern' else ui['bow_sub']
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=tube_sub, bg='#F0F4F8', border='#1F3A60', text_color='#132644')
    elif itype == "rld":
        draw_card_slot(ax, cx, cy, label=ui['aft_reload_lbl'], sublabel=ui['aft_reload_sub'], bg='#F4F7FA', border='#3A5675', text_color='#1B3654')
    elif itype == "mine_door":
        m_lbl = "Compt. Minas\nPopa" if lang == 'es' else "Aft Mine\nDoors"
        draw_card_slot(ax, cx, cy, label=m_lbl, sublabel=ui['stern_sub'], bg='#FAF0EC', border='#943825', text_color='#662012')
    elif itype == "mines":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=ui['cargo_sub'], bg='#F0F4F8', border='#28486E', text_color='#132644')
    elif itype == "gun":
        g_lbl = f"{lbl}\n{ui['status_sfx']}"
        draw_card_slot(ax, cx, cy, label=g_lbl, sublabel=ui['deck_gun_sub'], bg='#F9F8F5', border='#3E4C59', text_color='#1E252D')
    elif itype == "ammo":
        a_lbl = lbl if lang == 'en' else lbl.replace('Ammo', 'Munición')
        draw_card_slot(ax, cx, cy, label=a_lbl, sublabel=ui['ammo_sub'], bg='#F9F8F5', border='#3E4C59', text_color='#1E252D')
    elif itype == "aa":
        aa_lbl = f"{lbl}\n{ui['status_sfx']}"
        draw_card_slot(ax, cx, cy, label=aa_lbl, sublabel=ui['aa_gun_sub'], bg='#F9F8F5', border='#3E4C59', text_color='#1E252D')
    elif itype == "kai":
        k_lbl = "Transporte\nKaiten" if lang == 'es' else "Kaiten\nCarrier"
        draw_card_slot(ax, cx, cy, label=k_lbl, sublabel=ui['special_sub'], bg='#FDF2F0', border='#881A1A', text_color='#6D1212')
    elif itype == "cargo":
        c_lbl = "Lancha\nDaihatsu" if lang == 'es' else "Daihatsu\nLanding"
        draw_card_slot(ax, cx, cy, label=c_lbl, sublabel=ui['cargo_sub'], bg='#F8F2E2', border='#9E7B34', text_color='#5E4413')
    else:
        draw_card_slot(ax, cx, cy, label=lbl, sublabel="", bg='#F4F5F7', border='#475569', text_color='#1E293B')

def render_overlay_on_image(img_paper, lang='es'):
    ui = I18N_UI[lang]
    pw_mm, ph_mm = PAGE_W_MM, PAGE_H_MM
    scale_x = img_paper.width / pw_mm
    scale_y = img_paper.height / ph_mm

    card_w = CARD_W_MM
    card_h = CARD_H_MM
    ox_mm = (pw_mm - card_w) / 2.0
    oy_mm = (ph_mm - card_h) / 2.0 + VERTICAL_OFFSET_MM

    overlay_w = card_w - 0.4
    overlay_h = card_h - 0.4
    overlay_x0 = ox_mm + 0.2
    overlay_y0 = oy_mm + 0.2

    mask_holes = Image.new('L', (img_paper.width, img_paper.height), 0)
    draw_holes = ImageDraw.Draw(mask_holes)

    def mm_to_px(x_mm, y_top_mm):
        return (overlay_x0 + x_mm) * scale_x, (overlay_y0 + y_top_mm) * scale_y

    def add_hole_rect(x_mm, y_top_mm, w_mm, h_mm):
        x0, y0 = mm_to_px(x_mm, y_top_mm)
        x1, y1 = mm_to_px(x_mm + w_mm, y_top_mm + h_mm)
        draw_holes.rectangle([x0, y0, x1, y1], fill=255)

    def add_slot(cx_mm, cy_top_mm, size=15.0):
        add_hole_rect(cx_mm - size/2.0, cy_top_mm - size/2.0, size, size)

    # 1. Base slots (left column: Y = 28.5, 46.5, 66.9)
    for y_top in [28.5, 46.5, 66.9]:
        add_slot(10.0, y_top)

    # 2. Patrol track (9 slots: Y = 66.9)
    for x in COLS_9_X:
        add_slot(x, 66.9)

    # 3. Damage tracks (Flooding Y = 88.5, Hull Y = 105.9)
    add_slot(10.0, 88.5)
    add_slot(10.0, 105.9)
    for x in COLS_9_X:
        add_slot(x, 88.5)
        add_slot(x, 105.9)

    # 4. Middle band: Crew Status (X=10.0 + COLS_9_X[:5]) & Systems Status (COLS_9_X[5:])
    # Row 1: Y = 122.5, Row 2: Y = 139.5
    for x in [10.0] + list(COLS_9_X[:5]):
        add_slot(x, 122.5)
        add_slot(x, 139.5)

    for sy in [122.5, 139.5, 156.5, 173.0]:
        for x in COLS_9_X[5:]:
            add_slot(x, sy)

    # 5. Right block: Rows 0..8 (Spaced with robust 2.4mm inter-token bands & 1.7mm horizontal gaps!)
    r_centers = [14.4, 36.0, 53.4, 75.0, 96.6, 118.2, 135.6, 153.0, 170.4]
    for ry in r_centers:
        for x in RIGHT_COLS_X:
            add_slot(x, ry)

    # 3 Large Technical Observation Windows
    add_hole_rect(2.5, 2.5, 165.3, 16.0)      # Title block
    add_hole_rect(20.0, 21.0, 147.8, 31.0)    # Submarine dossier & specs
    add_hole_rect(8.0, 154.6, 159.8, 23.3)    # Special rules & historical notes (Aligned with Row 8 at Y=177.9)

    # 3D plastic overlay layer
    plate_color = (26, 32, 44)
    plastic_layer = Image.new('RGBA', (img_paper.width, img_paper.height), (0, 0, 0, 0))
    ox0_px = overlay_x0 * scale_x
    oy0_px = overlay_y0 * scale_y
    ox1_px = (overlay_x0 + overlay_w) * scale_x
    oy1_px = (overlay_y0 + overlay_h) * scale_y

    draw_plastic = ImageDraw.Draw(plastic_layer)
    draw_plastic.rectangle([ox0_px, oy0_px, ox1_px, oy1_px], fill=(*plate_color, 248))

    plastic_arr = np.array(plastic_layer)
    holes_arr = np.array(mask_holes)
    plastic_arr[holes_arr > 0, 3] = 0

    # Bevel shadow
    shadow_mask = mask_holes.filter(ImageFilter.GaussianBlur(radius=scale_y * 0.35))
    shadow_arr = np.array(shadow_mask)
    bevel_layer = Image.new('RGBA', (img_paper.width, img_paper.height), (0, 0, 0, 0))
    bevel_arr = np.array(bevel_layer)
    edge_shadow = np.clip((shadow_arr.astype(float) - holes_arr.astype(float) * 0.4), 0, 255).astype(np.uint8)
    bevel_arr[..., 3] = (edge_shadow * 0.6).astype(np.uint8)

    comp = Image.alpha_composite(img_paper.convert('RGBA'), Image.fromarray(bevel_arr))
    comp = Image.alpha_composite(comp, Image.fromarray(plastic_arr))
    draw_comp = ImageDraw.Draw(comp)

    try:
        font_sec = ImageFont.truetype('arialbd.ttf', int(scale_y * 2.2))
    except:
        font_sec = ImageFont.load_default()

    gold_col = (250, 204, 21, 255)
    cyan_col = (56, 189, 248, 255)

    def draw_engraved_text(x_mm, y_top_mm, text, font, color=gold_col, align='center'):
        px, py = mm_to_px(x_mm, y_top_mm)
        bbox = font.getbbox(text)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        tx = px - tw/2.0 if align == 'center' else px
        ty = py - th/2.0
        draw_comp.text((tx+1, ty+1), text, font=font, fill=(10, 15, 20, 220))
        draw_comp.text((tx, ty), text, font=font, fill=color)

    # Engraved text centered on each plaque with generous clearance from slot openings
    draw_engraved_text(93.9, 56.4, ui['patrol_header'], font_sec, gold_col)
    draw_engraved_text(93.9, 78.0, ui['damage_header'], font_sec, gold_col)
    draw_engraved_text(43.65, 117.0, ui['crew_header'], font_sec, gold_col)
    draw_engraved_text(135.4, 114.2, ui['systems_header'], font_sec, cyan_col)

    draw_engraved_text(203.0, 3.9, ui['aircraft_header'], font_sec, gold_col)
    draw_engraved_text(203.0, 25.5, ui['fwd_tubes_header'], font_sec, gold_col)
    draw_engraved_text(203.0, 64.5, ui['aft_tubes_header'], font_sec, gold_col)
    draw_engraved_text(203.0, 86.1, ui['artillery_header'], font_sec, gold_col)
    draw_engraved_text(203.0, 107.7, ui['reloads_header'], font_sec, gold_col)
    return comp

def draw_single_card(ax, key, sub, lang='es'):
    ui = I18N_UI[lang]
    ox = (PAGE_W_MM - CARD_W_MM) / 2.0
    oy = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM

    card_bg = patches.Rectangle((ox, oy), CARD_W_MM, CARD_H_MM, facecolor='#FAF7F0', edgecolor='none', zorder=1)
    ax.add_patch(card_bg)

    bg_img_path = 'images/mats/real_antique_parchment_bg.png'
    if os.path.exists(bg_img_path):
        parchment_bgr = cv2.imread(bg_img_path)
        if parchment_bgr is not None:
            parchment_rgb = cv2.cvtColor(parchment_bgr, cv2.COLOR_BGR2RGB)
            ax.imshow(parchment_rgb, extent=(ox, ox + CARD_W_MM, oy, oy + CARD_H_MM), zorder=1.1, aspect='auto')

    draw_nautical_chart_border(ax, ox, oy, CARD_W_MM, CARD_H_MM)
    draw_print_calibration_and_crop_marks(ax, ox, oy, CARD_W_MM, CARD_H_MM)

    def to_y(y_top_mm):
        return oy + CARD_H_MM - (y_top_mm * BROTHER_COMP)

    def to_x(x_mm):
        return ox + (x_mm * BROTHER_COMP)

    arm_cfg = UNIVERSAL_ARMAMENT_MAP.get(key, {})

    # 1. SHIPYARD TITLE BLOCK (Y: 2.5 to 18.5 mm)
    tb_x0 = to_x(2.5)
    tb_y0 = to_y(18.5)
    tb_w = 165.3 * BROTHER_COMP
    tb_h = 16.0 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((tb_x0, tb_y0), tb_w, tb_h, linewidth=0.8*BROTHER_COMP,
                                   edgecolor='#1E293B', facecolor='#FAF8F3', zorder=2))
    tb_d = 0.5 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((tb_x0 + tb_d, tb_y0 + tb_d), tb_w - 2*tb_d, tb_h - 2*tb_d,
                                   linewidth=0.3*BROTHER_COMP, edgecolor='#475569', facecolor='none', zorder=2.1))

    div_x1 = to_x(46.2)
    div_x2 = to_x(116.3)
    ax.plot([div_x1, div_x1], [tb_y0, tb_y0 + tb_h], color='#94A3B8', lw=0.4*BROTHER_COMP, zorder=2.2)
    ax.plot([div_x2, div_x2], [tb_y0, tb_y0 + tb_h], color='#94A3B8', lw=0.4*BROTHER_COMP, zorder=2.2)

    logo_path = 'images/sensuikan_logo_hires.png'
    if os.path.exists(logo_path):
        logo_bgr = cv2.imread(logo_path)
        if logo_bgr is not None:
            logo_gray = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2GRAY)
            logo_rgba = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2RGBA)
            alpha = np.ones_like(logo_gray, dtype=np.uint8) * 255
            white_mask = logo_gray > 235
            alpha[white_mask] = np.clip((255 - logo_gray[white_mask]) * (255.0 / 20.0), 0, 255).astype(np.uint8)
            logo_rgba[:, :, 3] = alpha
            logo_w_box = 40.0
            logo_h_box = logo_w_box / 3.437
            lx0 = to_x(2.5 + (43.7 - logo_w_box) / 2.0)
            ly_center = 10.5
            ly0 = to_y(ly_center + logo_h_box / 2.0)
            ly1 = to_y(ly_center - logo_h_box / 2.0)
            ax.imshow(logo_rgba, extent=(lx0, lx0 + logo_w_box * BROTHER_COMP, ly0, ly1), zorder=2.3)

    meta = sub.get("shipyard_metadata") or SHIPYARD_METADATA.get(key, {
        "title": sub['class_name'].upper(),
        "subtitle": f"{sub['full_title'].upper()}  |  IJN SUBMARINE",
        "badges": [f"AVAILABLE: {sub['available_date'].replace('Available ', '').upper()}",
                   f"PATROLS: {sub['patrol_length'].upper()}",
                   f"HULLS: {sub['stats'].get('produced', 'N/A')} BUILT"]
    })
    title_txt = meta['title']
    ax.text(to_x(48.5), to_y(7.0), title_txt,
            fontsize=9.2 if len(title_txt) > 24 else 10.8,
            weight='bold', color='#0F172A', va='center', zorder=2.5)

    ax.text(to_x(48.5), to_y(10.8), meta['subtitle'],
            fontsize=4.4, weight='bold', color='#475569', va='center', zorder=2.5)

    badge_y = to_y(16.5)
    badge_h = 3.6 * BROTHER_COMP
    badge_w = 31.0 * BROTHER_COMP
    badge_xs = [to_x(48.5), to_x(82.5)]
    for b_idx, badge_txt in enumerate(meta['badges'][:2]):
        bx = badge_xs[b_idx]
        b_rect = patches.Rectangle((bx, badge_y), badge_w, badge_h, linewidth=0.35*BROTHER_COMP,
                                   edgecolor='#94A3B8', facecolor='#F1EFEA', zorder=2.5)
        ax.add_patch(b_rect)
        ax.text(bx + badge_w / 2.0, badge_y + badge_h / 2.0, badge_txt,
                fontsize=3.2, weight='bold', color='#1E293B', ha='center', va='center', zorder=3)

    # Specs Plaque
    px0 = to_x(116.3)
    py0 = to_y(17.5)
    pw = 49.0 * BROTHER_COMP
    ph = 14.0 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((px0, py0), pw, ph, linewidth=0.5*BROTHER_COMP,
                                   edgecolor='#A8A29E', facecolor='#F4F1EA', zorder=2.3))
    p_strip_h = 3.2 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((px0, py0 + ph - p_strip_h), pw, p_strip_h, linewidth=0.4*BROTHER_COMP,
                                   edgecolor='#A8A29E', facecolor='#E7E2D8', zorder=2.4))
    ax.text(px0 + pw / 2.0, py0 + ph - p_strip_h / 2.0, ui['specs_title'],
            fontsize=3.2, weight='bold', color='#292524', ha='center', va='center', zorder=2.6)

    stats = sub['stats']
    hulls_raw = meta['badges'][2] if len(meta['badges']) > 2 else ""
    hulls_str = hulls_raw.replace('HULLS: ', '').replace('CASCOS: ', '')
    col1_lbl_x = px0 + 1.8 * BROTHER_COMP
    col1_val_x = px0 + 9.2 * BROTHER_COMP
    col2_lbl_x = px0 + 23.2 * BROTHER_COMP
    col2_val_x = px0 + 30.2 * BROTHER_COMP

    ax.text(col1_lbl_x, to_y(9.1), ui['len'], fontsize=3.2, weight='bold', color='#78716C', zorder=3)
    ax.text(col1_val_x, to_y(9.1), stats['length'], fontsize=3.2, weight='bold', color='#0F172A', zorder=3)
    ax.text(col2_lbl_x, to_y(9.1), ui['spd'], fontsize=3.2, weight='bold', color='#78716C', zorder=3)
    spd_txt = stats['speed']
    spd_fs = 2.7 if len(spd_txt) > 16 else 3.2
    ax.text(col2_val_x, to_y(9.1), spd_txt, fontsize=spd_fs, weight='bold', color='#0F172A', zorder=3)

    ax.text(col1_lbl_x, to_y(12.2), ui['disp'], fontsize=3.2, weight='bold', color='#78716C', zorder=3)
    ax.text(col1_val_x, to_y(12.2), stats['displacement'], fontsize=3.2, weight='bold', color='#0F172A', zorder=3)
    ax.text(col2_lbl_x, to_y(12.2), ui['rng'], fontsize=3.2, weight='bold', color='#78716C', zorder=3)
    ax.text(col2_val_x, to_y(12.2), stats['range'], fontsize=3.2, weight='bold', color='#0F172A', zorder=3)

    crew_val = f"{stats['crew']} {ui['men']}"
    ax.text(col1_lbl_x, to_y(15.3), ui['crew'], fontsize=3.2, weight='bold', color='#78716C', zorder=3)
    ax.text(col1_val_x, to_y(15.3), crew_val, fontsize=3.2, weight='bold', color='#0F172A', zorder=3)
    ax.text(col2_lbl_x, to_y(15.3), ui['hulls'], fontsize=3.2, weight='bold', color='#78716C', zorder=3)
    hulls_fs = 2.8 if len(hulls_str) > 12 else 3.2
    ax.text(col2_val_x, to_y(15.3), hulls_str, fontsize=hulls_fs, weight='bold', color='#0F172A', zorder=3)

    # 2. LEFT COLUMN: BASE SLOTS (Base 1 Y=26.0, Base 2 Y=44.0, Base 3 Y=62.5)
    base_xs = to_x(10.0)
    draw_card_slot(ax, base_xs, to_y(26.0), label=ui['current_base'], bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
    draw_card_slot(ax, base_xs, to_y(44.0), label=ui['mission'], bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
    draw_card_slot(ax, base_xs, to_y(62.5), label=ui['at_port'], bg='#EBF1F5', border='#3B5670', text_color='#1C344A')

    # 3. SUB PROFILE (Y: 20.0 to 48.5 mm, Width 147.8 mm)
    win_x0 = to_x(20.0)
    win_w = 147.8 * BROTHER_COMP
    win_h = 28.5 * BROTHER_COMP
    win_y0 = to_y(48.5)
    draw_confidential_stamp(ax, to_x(157.0), to_y(28.5), size_mm=16.0*BROTHER_COMP)

    prof_path = sub.get('profile_image_path', '')
    if os.path.exists(prof_path):
        raw_img = cv2.imread(prof_path)
        if raw_img is not None:
            gray = cv2.cvtColor(raw_img, cv2.COLOR_BGR2GRAY)
            dark_rows = np.where((gray < 185).any(axis=1))[0]
            dark_cols = np.where((gray < 185).any(axis=0))[0]
            if len(dark_rows) > 0 and len(dark_cols) > 0:
                y_min, y_max = dark_rows.min(), dark_rows.max()
                y0 = max(0, y_min - 16)
                y1 = min(raw_img.shape[0], y_max + 16)
                h = y1 - y0
                w_target = int(h * (147.8 / 28.5))
                sub_crop = raw_img[y0:y1, :]
                if w_target > sub_crop.shape[1]:
                    diff = w_target - sub_crop.shape[1]
                    prof_img = cv2.copyMakeBorder(sub_crop, 0, 0, diff // 2, diff - diff // 2, cv2.BORDER_REPLICATE)
                else:
                    start_x = (sub_crop.shape[1] - w_target) // 2
                    prof_img = sub_crop[:, start_x:start_x + w_target]
            else:
                prof_img = raw_img
            bg_bgr = prof_img[0, 0]
            bg_color_hex = '#{:02x}{:02x}{:02x}'.format(bg_bgr[2], bg_bgr[1], bg_bgr[0])
            outer_win = patches.Rectangle((win_x0, win_y0), win_w, win_h, linewidth=0.8*BROTHER_COMP,
                                          edgecolor='#1E293B', facecolor=bg_color_hex, zorder=2)
            ax.add_patch(outer_win)
            win_d = 0.5 * BROTHER_COMP
            inner_win = patches.Rectangle((win_x0 + win_d, win_y0 + win_d), win_w - 2*win_d, win_h - 2*win_d,
                                          linewidth=0.3*BROTHER_COMP, edgecolor='#64748B', facecolor='none', zorder=2.4)
            ax.add_patch(inner_win)
            prof_rgb = cv2.cvtColor(prof_img, cv2.COLOR_BGR2RGB)
            ax.imshow(prof_rgb, extent=(win_x0 + win_d, win_x0 + win_w - win_d, win_y0 + win_d, win_y0 + win_h - win_d), zorder=2.3)

            # Technical Armament Strip (100% pure translated)
            art_cfg = arm_cfg.get("artillery", [None]*4)
            dg_item = art_cfg[0]
            main_gun_str = dg_item[0] if dg_item else ("Ninguno" if lang == 'es' else "None")
            aa_item = art_cfg[2] if (len(art_cfg) > 2 and art_cfg[2] and art_cfg[2][1] == "aa") else None
            aa_str = aa_item[0].replace('\n', ' ') if aa_item else ("Ninguno" if lang == 'es' else "None")
            fwd_tubes = arm_cfg.get("bow_tubes", 6)
            aft_tubes = sum(1 for it in arm_cfg.get("aft_r3", []) if it and it[-1] == "tube")
            fwd_rld_count = arm_cfg.get("fwd_reloads", 0)

            if key == "Type_A_Midget_Submarine___Ko_Hyoteki":
                if lang == 'es':
                    arm_badge_txt = "ARMAMENTO: 2 Tubos Torpedo Proa 45cm (18\") (Sin Cañón / Sin AA / 0 Recargas)"
                else:
                    arm_badge_txt = "ARMAMENT: 2x 45cm (18\") Bow Torpedo Tubes (No Deck Gun / No AA / 0 Reloads)"
            else:
                if lang == 'es':
                    arm_badge_txt = f"ARMAMENTO: Cañón: {main_gun_str} • AA: {aa_str} • Tubos: {fwd_tubes} Proa / {aft_tubes} Popa • Recargas: {fwd_rld_count}"
                else:
                    arm_badge_txt = f"ARMAMENT: Deck Gun: {main_gun_str} • AA: {aa_str} • Tubes: {fwd_tubes} Bow / {aft_tubes} Stern • Reloads: {fwd_rld_count}"

            ax.text(win_x0 + 3.0 * BROTHER_COMP, to_y(24.0), arm_badge_txt,
                    fontsize=5.6, weight='bold', color='#F8FAFC', zorder=2.7, va='center',
                    bbox=dict(boxstyle='square,pad=0.35', facecolor='#0F172A', edgecolor='#D97706', lw=0.7, alpha=0.92))

    # 4. PATROL TRACK (Header Y=51.0 to 53.5, Slots Y=62.5)
    draw_section_header_plaque(ax, to_x(20.0), to_y(51.0), ui['patrol_header'], width=147.8*BROTHER_COMP, h=2.5*BROTHER_COMP)
    patrol_centers = COLS_9_X
    phases = sub.get("patrol_phases", ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"])
    pat_y = to_y(62.5)
    for i, p_center in enumerate(patrol_centers):
        p_name = phases[i] if i < len(phases) else "N/A"
        if p_name == "Transit":
            draw_card_slot(ax, to_x(p_center), pat_y, label=ui['transit'], bg='#E2EAF0', border='#3B5B75', text_color='#1E3547')
        elif p_name.startswith("Stat"):
            draw_card_slot(ax, to_x(p_center), pat_y, label=ui['station'], bg='#F4F2EB', border='#64748B', text_color='#2A3A4A')
        elif p_name == "Penetrate":
            draw_card_slot(ax, to_x(p_center), pat_y, label=ui['penetrate'], bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
        elif p_name == "Attack":
            draw_card_slot(ax, to_x(p_center), pat_y, label=ui['attack'], bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
        elif p_name == "Egress":
            draw_card_slot(ax, to_x(p_center), pat_y, label=ui['egress'], bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
        elif p_name == "Recover":
            draw_card_slot(ax, to_x(p_center), pat_y, label=ui['recover'], bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
        else:
            draw_card_slot(ax, to_x(p_center), pat_y, is_inactive=True)

    # 5. DAMAGE TRACKS (Header Y=72.5 to 75.0, Flood Y=83.5, Hull Y=100.5)
    draw_section_header_plaque(ax, to_x(20.0), to_y(72.5), ui['damage_header'], width=147.8*BROTHER_COMP, h=2.5*BROTHER_COMP)
    dmg_y_flood = to_y(83.5)
    dmg_y_hull = to_y(100.5)
    draw_card_slot(ax, base_xs, dmg_y_flood, label=ui['flood_marker'], bg='#EBF1F5', border='#385C7E', text_color='#1B3654')
    draw_card_slot(ax, base_xs, dmg_y_hull, label=ui['hull_marker'], bg='#F5EDE7', border='#8C4332', text_color='#5C1E12')

    dmg_centers = COLS_9_X
    dmg_cap = sub.get("damage_capacity", {"flooding": 8, "hull": 8})
    max_fld = dmg_cap.get("flooding", 8)
    max_hull = dmg_cap.get("hull", 8)

    for i in range(9):
        if i < max_fld:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, label=f"{ui['flood']} {i+1}", bg='#0D1520', border='#385C7E', text_color='#68B2DF')
        elif i == max_fld:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, label=ui['surface'], bg='#0D1520', border='#C5A059', text_color='#FFE082')
        else:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)

    for i in range(9):
        if i < max_hull:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, label=f"{ui['hull']} {i+1}", bg='#0D1520', border='#8C4332', text_color='#F28B82')
        elif i == max_hull:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, label=ui['sunk'], is_sunk=True, bg='#0D1520', border='#E11D48', text_color='#EF4444')
        else:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, is_inactive=True)

    # 6. CREW STATUS & CREW QUALITY (6 Columns: 10.0 + COLS_9_X[:5])
    # Header Y=110.5 to 113.0, Row 1 Y=122.5, Row 2 Y=139.5
    crew_centers = [10.0] + list(COLS_9_X[:5])  # [10.0, 27.5, 44.1, 60.7, 77.3, 93.9]
    crew_y1 = to_y(122.5)
    crew_y2 = to_y(139.5)

    draw_section_header_plaque(ax, to_x(2.5), to_y(110.5), ui['crew_header'], width=98.9*BROTHER_COMP, h=2.5*BROTHER_COMP)

    is_midget = (key == "Type_A_Midget_Submarine___Ko_Hyoteki")

    if is_midget:
        draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Oficial" if lang == 'es' else "Officer", bg='#F8F9FA', border='#334155', text_color='#0F172A')
        draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Suboficial" if lang == 'es' else "Petty Officer", bg='#F8F9FA', border='#334155', text_color='#0F172A')
        draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="Artillero\nEnano" if lang == 'es' else "Midget\nGunnery", bg='#EEF4FA', border='#2A5682', text_color='#183758')
        draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Comms\nSuperiores" if lang == 'es' else "Superior\nComms", bg='#EEF4FA', border='#2A5682', text_color='#183758')
        draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Maniobra" if lang == 'es' else "Boat\nHandling", bg='#EEF4FA', border='#2A5682', text_color='#183758')
        draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)

        for ci in range(5):
            draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
        draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, label=ui['crew_quality'], bg='#FAF2E1', border='#C08420', text_color='#784B05')
    else:
        draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label=ui['captain'], bg='#F8F9FA', border='#334155', text_color='#0F172A')
        draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label=ui['engineer'], bg='#F8F9FA', border='#334155', text_color='#0F172A')
        draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label=ui['xo'], bg='#F8F9FA', border='#334155', text_color='#0F172A')
        draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label=ui['nav'], bg='#F8F9FA', border='#334155', text_color='#0F172A')
        draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label=ui['medic'], bg='#F8F9FA', border='#334155', text_color='#0F172A')

        if sub.get('has_aircraft'):
            draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label=ui['pilot'], bg='#EEF4FA', border='#2A5682', text_color='#183758')
        elif key == "Type_C_Class":
            draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label=ui['midget_crew'], bg='#EEF4FA', border='#2A5682', text_color='#183758')
        else:
            draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)

        crew_count = sub.get("crew_counters", 5 if key == "Type_C3_Class" else 4)
        for ci in range(5):
            if ci < crew_count:
                draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label=ui['crew_label'], bg='#F8F9FA', border='#334155', text_color='#0F172A')
            else:
                draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
        draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, label=ui['crew_quality'], bg='#FAF2E1', border='#C08420', text_color='#784B05')

    # 7. SYSTEMS STATUS (Columns 5..8: 110.5, 127.1, 143.7, 160.3; 4 Rows x 4 Cols = 16 Slots)
    sys_centers = COLS_9_X[5:]
    sys_y_rows = [122.5, 139.5, 156.5, 173.0]
    draw_section_header_plaque(ax, to_x(103.0), to_y(110.5), ui['systems_header'], width=64.8*BROTHER_COMP, h=2.5*BROTHER_COMP)

    sys_list = arm_cfg.get('sys', [None]*16)

    for idx in range(16):
        c_i = idx % 4
        r_i = idx // 4
        cx = to_x(sys_centers[c_i])
        cy = to_y(sys_y_rows[r_i])
        raw_sys = sys_list[idx] if idx < len(sys_list) else None
        if raw_sys and raw_sys != "None" and raw_sys != "N/A":
            item_lbl = I18N_SYSTEMS[lang].get(raw_sys, raw_sys)
            draw_card_slot(ax, cx, cy, label=item_lbl, sublabel="", bg='#F1F5F9', border='#334155', text_color='#0F172A', raw_key=raw_sys)
        else:
            draw_card_slot(ax, cx, cy, is_inactive=True)

    # 8. SPECIAL RULES & HISTORICAL NOTES (Compacted and placed to the left under Crew Status)
    box_x0 = to_x(3.5)
    box_w = 95.0 * BROTHER_COMP
    box_h = 28.5 * BROTHER_COMP
    box_y0 = to_y(178.5)

    panel_bg = patches.Rectangle((box_x0, box_y0), box_w, box_h, linewidth=0.8*BROTHER_COMP,
                                 edgecolor='#5A6B7C', facecolor='#FAF8F2', zorder=2)
    ax.add_patch(panel_bg)
    ax.add_patch(patches.Rectangle((box_x0 + 0.5*BROTHER_COMP, box_y0 + 0.5*BROTHER_COMP),
                                   box_w - 1.0*BROTHER_COMP, box_h - 1.0*BROTHER_COMP,
                                   linewidth=0.3*BROTHER_COMP, edgecolor='#94A3B8', facecolor='none', zorder=2.1))
    ax.text(box_x0 + 2.5*BROTHER_COMP, to_y(151.8), ui['rules_header'], fontsize=5.2, weight='bold', color='#1E293B', zorder=3)
    ax.plot([box_x0 + 2.5*BROTHER_COMP, box_x0 + box_w - 2.5*BROTHER_COMP], [to_y(153.2), to_y(153.2)],
            color='#C08420', lw=0.5*BROTHER_COMP, zorder=2.5)

    draw_imperial_hanko(ax, box_x0 + box_w - 6.5*BROTHER_COMP, to_y(169.5), r_mm=3.5*BROTHER_COMP, angle=3.5)

    rules_tuple = I18N_SPECIAL_RULES[lang].get(key, ("", None))
    rules_raw = rules_tuple[0].strip()
    kaiten_raw = rules_tuple[1].strip() if rules_tuple[1] else None

    font_s, line_h_mm, wrap_w = 3.8, 1.65, 66
    curr_y_mm = 155.0
    for para in rules_raw.splitlines():
        para = para.strip()
        if not para:
            continue
        wrapped = textwrap.fill(para, width=wrap_w)
        for line in wrapped.splitlines():
            if curr_y_mm > 177.0: break
            is_bold_lead = (line.startswith('•') or line.startswith('Cargo') or line.startswith('Radar') or line.startswith('Armament') or line.startswith('Daño') or line.startswith('Special'))
            ax.text(box_x0 + 2.5*BROTHER_COMP, to_y(curr_y_mm), line,
                    fontsize=font_s, weight='bold' if is_bold_lead else 'normal',
                    color='#1E293B', va='top', zorder=3)
            curr_y_mm += line_h_mm
        curr_y_mm += 0.2

    if kaiten_raw and curr_y_mm < 176.5:
        curr_y_mm += 0.2
        prefix = "Conversión Kaiten: " if lang == 'es' else "Kaiten Conversion: "
        wrapped_k = textwrap.fill(f"{prefix}{kaiten_raw}", width=wrap_w)
        for line in wrapped_k.splitlines():
            if curr_y_mm > 177.0: break
            ax.text(box_x0 + 2.5*BROTHER_COMP, to_y(curr_y_mm), line,
                    fontsize=font_s, weight='bold', color='#881A1A', va='top', zorder=3)
            curr_y_mm += line_h_mm

    # 9. RIGHT BLOCK (UNIVERSAL - Robust 2.4mm inter-token bands!)
    col_x = [to_x(x) for x in RIGHT_COLS_X]

    # 9.1 Aircraft & Tactical Event Record (Header Y=2.5 to 5.3, Row 0 Y=14.4)
    draw_section_header_plaque(ax, to_x(170.4), to_y(2.5), ui['aircraft_header'], width=65.1*BROTHER_COMP, h=2.8*BROTHER_COMP)
    y_r0 = to_y(14.4)
    is_sentoku = (key == "Sen_Toku_Class")
    if is_sentoku:
        draw_card_slot(ax, col_x[0], y_r0, label=f"Aichi M6A1\n{ui['status_sfx']} #1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
        draw_card_slot(ax, col_x[1], y_r0, label=f"Aichi M6A1\n{ui['status_sfx']} #2", bg='#EEF4FA', border='#2A5682', text_color='#183758')
        draw_card_slot(ax, col_x[2], y_r0, label=f"Aichi M6A1\n{ui['status_sfx']} #3", bg='#EEF4FA', border='#2A5682', text_color='#183758')
        draw_card_slot(ax, col_x[3], y_r0, label=ui['random_event'], bg='#FAF2E1', border='#C08420', text_color='#784B05')
    else:
        if sub['has_aircraft']:
            air_name = f"Yokosuka\nE14Y1 {ui['status_sfx']}" if ("Glen" in str(sub.get('aircraft_type', '')) or "E14Y1" in str(sub.get('aircraft_type', ''))) else f"Hidroavión\n{ui['status_sfx']}" if lang == 'es' else f"Aircraft\n{ui['status_sfx']}"
            draw_card_slot(ax, col_x[0], y_r0, label=air_name, bg='#EEF4FA', border='#2A5682', text_color='#183758')
        else:
            draw_card_slot(ax, col_x[0], y_r0, is_inactive=True)
        draw_card_slot(ax, col_x[1], y_r0, is_inactive=True)
        draw_card_slot(ax, col_x[2], y_r0, label=ui['random_event'], bg='#FAF2E1', border='#C08420', text_color='#784B05')
        draw_card_slot(ax, col_x[3], y_r0, label=ui['random_event'], bg='#FAF2E1', border='#C08420', text_color='#784B05')

    # 9.2 Forward Torpedo Tubes (1–8) (Header Y=24.1 to 26.9, Row 1 Y=36.0, Row 2 Y=53.4)
    draw_section_header_plaque(ax, to_x(170.4), to_y(24.1), ui['fwd_tubes_header'], width=65.1*BROTHER_COMP, h=2.8*BROTHER_COMP)
    y_r1 = to_y(36.0)
    y_r2 = to_y(53.4)
    n_bow = arm_cfg.get("bow_tubes", 6)

    for i in range(4):
        if i < n_bow:
            draw_card_slot(ax, col_x[i], y_r1, label=str(i+1), sublabel=ui['bow_sub'], bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
        else:
            draw_card_slot(ax, col_x[i], y_r1, is_inactive=True)

    for i in range(4):
        tube_idx = i + 5
        if tube_idx <= n_bow:
            draw_card_slot(ax, col_x[i], y_r2, label=str(tube_idx), sublabel=ui['bow_sub'], bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
        else:
            draw_card_slot(ax, col_x[i], y_r2, is_inactive=True)

    # 9.3 Aft Torpedo Tubes & Stern Reloads (Header Y=63.1 to 65.9, Row 3 Y=75.0)
    draw_section_header_plaque(ax, to_x(170.4), to_y(63.1), ui['aft_tubes_header'], width=65.1*BROTHER_COMP, h=2.8*BROTHER_COMP)
    y_r3 = to_y(75.0)
    aft_items = arm_cfg.get("aft_r3", [None]*4)
    for i in range(4):
        draw_localized_armament_slot(ax, col_x[i], y_r3, aft_items[i], lang=lang)

    # 9.4 Artillery & Deck Weapons (Header Y=84.7 to 87.5, Row 4 Y=96.6)
    draw_section_header_plaque(ax, to_x(170.4), to_y(84.7), ui['artillery_header'], width=65.1*BROTHER_COMP, h=2.8*BROTHER_COMP)
    y_r4 = to_y(96.6)
    art_items = arm_cfg.get("artillery", [None]*4)
    for i in range(4):
        draw_localized_armament_slot(ax, col_x[i], y_r4, art_items[i], lang=lang)

    # 9.5 Forward Torpedo Reloads (Header Y=106.3 to 109.1, Rows 5..8 Y=[118.2, 135.6, 153.0, 170.4])
    draw_section_header_plaque(ax, to_x(170.4), to_y(106.3), ui['reloads_header'], width=65.1*BROTHER_COMP, h=2.8*BROTHER_COMP)
    rld_y_rows = [to_y(118.2), to_y(135.6), to_y(153.0), to_y(170.4)]
    fwd_rld_total = arm_cfg.get("fwd_reloads", 0)

    for idx in range(16):
        r_i = idx // 4
        c_i = idx % 4
        cy = rld_y_rows[r_i]
        cx = col_x[c_i]
        rld_num = idx + 1
        if rld_num <= fwd_rld_total:
            draw_card_slot(ax, cx, cy, label=f"{ui['reload_lbl']} {rld_num}", sublabel=ui['reload_sub'],
                           bg='#F4F7FA', border='#2A5682', text_color='#102A45')
        else:
            draw_card_slot(ax, cx, cy, is_inactive=True)

    # Duplex Footer
    dp = sub.get('duplex_print')
    if dp:
        side_txt = ui['side_a'] if 'Side A' in dp['side'] else ui['side_b']
        family_txt = dp['family']
        paired_txt = dp['paired_with']
        if lang == 'es':
            family_txt = family_txt.replace('Early Fleet', 'Flota Inicial').replace('Mid-War Fleet', 'Flota Intermedia').replace('Cruiser Submarines', 'Submarinos de Crucero')
            paired_txt = paired_txt.replace('Class', 'Clase')

        ax.text(to_x(235.0), to_y(-1.5), f"{ui['sheet_str']} {dp['sheet_number']}/9 • {side_txt}",
                fontsize=3.2, ha='right', va='bottom', color='#64748B', zorder=4)
        footer_full = ui['footer'].format(
            sheet=dp['sheet_number'],
            side=side_txt,
            page=dp['page_number'],
            family=family_txt,
            paired=paired_txt
        )
        ax.text(PAGE_W_MM / 2.0, oy - 4.5, footer_full, fontsize=3.5, ha='center', va='center', color='#64748B')

def generate_all_canonical_cards():
    db_path = 'data/submarines_database.json'
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)

    subs = db['submarines']
    print(f"Generating Compact Canonical Player Cards for all {len(subs)} submarines...")
    print(f"Card Dimensions: {CARD_W_MM} x {CARD_H_MM} mm (Equal 2.5mm Margin on all 4 sides)")
    print("Vertical Structure: Generous inter-token bands (2.4mm) + Clear title clearances (1.6mm)")

    # Target PDF files with robust file lock handling
    def get_safe_pdf_path(target_path):
        try:
            with open(target_path, 'ab'):
                pass
            return target_path
        except PermissionError:
            base, ext = os.path.splitext(target_path)
            alt = f"{base}_v2{ext}"
            print(f"Notice: '{target_path}' is currently open in a PDF viewer; saving to alternate path '{alt}'.")
            return alt

    pdf_combined = get_safe_pdf_path('pdf/sensuikan_canonical_player_cards_universal_18subs.pdf')
    pdf_es_only = get_safe_pdf_path('pdf/sensuikan_canonical_player_cards_universal_ES_18subs.pdf')
    pdf_en_only = get_safe_pdf_path('pdf/sensuikan_canonical_player_cards_universal_EN_18subs.pdf')
    os.makedirs('pdf', exist_ok=True)

    # Pre-render Kaidai KD.3 for the 3D STL overlay simulation
    sim_kd3_es = None
    sim_kd3_en = None

    fig_kd3_es = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax_kd3_es = fig_kd3_es.add_axes([0, 0, 1, 1])
    ax_kd3_es.set_xlim(0, PAGE_W_MM)
    ax_kd3_es.set_ylim(0, PAGE_H_MM)
    ax_kd3_es.axis('off')
    draw_single_card(ax_kd3_es, "Kaidai_KD3_Class", subs["Kaidai_KD3_Class"], lang='es')
    fig_kd3_es.canvas.draw()
    rgba_buf_es = np.asarray(fig_kd3_es.canvas.buffer_rgba())
    sim_kd3_es = Image.fromarray(rgba_buf_es).convert('RGB')
    current_brain = os.environ.get('AGY_BRAIN_DIR', 'C:/Users/Richard/.gemini/antigravity/brain/0975d495-1000-4c1e-ba39-9c738d974976')
    try:
        os.makedirs(current_brain, exist_ok=True)
        fig_kd3_es.savefig(os.path.join(current_brain, 'preview_kd3_es.png'), dpi=150)
    except Exception:
        pass
    plt.close(fig_kd3_es)

    fig_kd3_en = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax_kd3_en = fig_kd3_en.add_axes([0, 0, 1, 1])
    ax_kd3_en.set_xlim(0, PAGE_W_MM)
    ax_kd3_en.set_ylim(0, PAGE_H_MM)
    ax_kd3_en.axis('off')
    draw_single_card(ax_kd3_en, "Kaidai_KD3_Class", subs["Kaidai_KD3_Class"], lang='en')
    fig_kd3_en.canvas.draw()
    rgba_buf_en = np.asarray(fig_kd3_en.canvas.buffer_rgba())
    sim_kd3_en = Image.fromarray(rgba_buf_en).convert('RGB')
    try:
        fig_kd3_en.savefig(os.path.join(current_brain, 'preview_kd3_en.png'), dpi=150)
    except Exception:
        pass
    plt.close(fig_kd3_en)

    # Save verification preview for Sen-Taka (I-201) Class
    fig_st_en = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax_st_en = fig_st_en.add_axes([0, 0, 1, 1])
    ax_st_en.set_xlim(0, PAGE_W_MM)
    ax_st_en.set_ylim(0, PAGE_H_MM)
    ax_st_en.axis('off')
    draw_single_card(ax_st_en, "Sen_Taka_Class", subs["Sen_Taka_Class"], lang='en')
    try:
        fig_st_en.savefig(os.path.join(current_brain, 'preview_sentaka_en.png'), dpi=150)
    except Exception:
        pass
    plt.close(fig_st_en)

    fig_st_es = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax_st_es = fig_st_es.add_axes([0, 0, 1, 1])
    ax_st_es.set_xlim(0, PAGE_W_MM)
    ax_st_es.set_ylim(0, PAGE_H_MM)
    ax_st_es.axis('off')
    draw_single_card(ax_st_es, "Sen_Taka_Class", subs["Sen_Taka_Class"], lang='es')
    try:
        fig_st_es.savefig(os.path.join(current_brain, 'preview_sentaka_es.png'), dpi=150)
    except Exception:
        pass
    plt.close(fig_st_es)

    # Render Realistic 3D STL Overlay Simulation Pages
    print("Rendering Realistic 3D STL Overlay Simulation Pages...")
    sim_img_es = render_overlay_on_image(sim_kd3_es, lang='es')
    sim_img_en = render_overlay_on_image(sim_kd3_en, lang='en')
    try:
        sim_img_es.save(os.path.join(current_brain, 'simulation_superimposed_board_kd3_es.png'), quality=95)
        sim_img_en.save(os.path.join(current_brain, 'simulation_superimposed_board_kd3_en.png'), quality=95)
    except Exception:
        pass

    # 1. WRITE COMBINED UNIVERSAL PDF (18 ES + 18 EN + 1 Sim ES + 1 Sim EN = 38 Pages)
    print(f"Writing Combined Universal PDF to '{pdf_combined}'...")
    with PdfPages(pdf_combined) as pdf_comb:
        # Block 1: 18 Spanish Cards
        for key, sub in subs.items():
            fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(0, PAGE_W_MM)
            ax.set_ylim(0, PAGE_H_MM)
            ax.axis('off')
            draw_single_card(ax, key, sub, lang='es')
            pdf_comb.savefig(fig, dpi=150)
            plt.close(fig)

        # Block 2: 18 English Cards
        for key, sub in subs.items():
            fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(0, PAGE_W_MM)
            ax.set_ylim(0, PAGE_H_MM)
            ax.axis('off')
            draw_single_card(ax, key, sub, lang='en')
            pdf_comb.savefig(fig, dpi=150)
            plt.close(fig)

        # Block 3: Simulation Page ES
        fig_sim_es = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
        ax_sim_es = fig_sim_es.add_axes([0, 0, 1, 1])
        ax_sim_es.imshow(sim_img_es)
        ax_sim_es.axis('off')
        pdf_comb.savefig(fig_sim_es, dpi=150)
        plt.close(fig_sim_es)

        # Block 3: Simulation Page EN
        fig_sim_en = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
        ax_sim_en = fig_sim_en.add_axes([0, 0, 1, 1])
        ax_sim_en.imshow(sim_img_en)
        ax_sim_en.axis('off')
        pdf_comb.savefig(fig_sim_en, dpi=150)
        plt.close(fig_sim_en)

    print("Combined PDF written successfully (38 pages).")

    # 2. WRITE STANDALONE ES PDF (18 ES + 1 Sim ES = 19 Pages)
    print(f"Writing Standalone ES PDF to '{pdf_es_only}'...")
    with PdfPages(pdf_es_only) as pdf_es:
        for key, sub in subs.items():
            fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(0, PAGE_W_MM)
            ax.set_ylim(0, PAGE_H_MM)
            ax.axis('off')
            draw_single_card(ax, key, sub, lang='es')
            pdf_es.savefig(fig, dpi=150)
            plt.close(fig)

        fig_sim_es = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
        ax_sim_es = fig_sim_es.add_axes([0, 0, 1, 1])
        ax_sim_es.imshow(sim_img_es)
        ax_sim_es.axis('off')
        pdf_es.savefig(fig_sim_es, dpi=150)
        plt.close(fig_sim_es)

    print("Standalone ES PDF written successfully (19 pages).")

    # 3. WRITE STANDALONE EN PDF (18 EN + 1 Sim EN = 19 Pages)
    print(f"Writing Standalone EN PDF to '{pdf_en_only}'...")
    with PdfPages(pdf_en_only) as pdf_en:
        for key, sub in subs.items():
            fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(0, PAGE_W_MM)
            ax.set_ylim(0, PAGE_H_MM)
            ax.axis('off')
            draw_single_card(ax, key, sub, lang='en')
            pdf_en.savefig(fig, dpi=150)
            plt.close(fig)

        fig_sim_en = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
        ax_sim_en = fig_sim_en.add_axes([0, 0, 1, 1])
        ax_sim_en.imshow(sim_img_en)
        ax_sim_en.axis('off')
        pdf_en.savefig(fig_sim_en, dpi=150)
        plt.close(fig_sim_en)

    print("Standalone EN PDF written successfully (19 pages).")
    print("ALL UNIVERSAL COMPACT PLAYER CARDS GENERATED SUCCESSFULLY!")

if __name__ == '__main__':
    generate_all_canonical_cards()
