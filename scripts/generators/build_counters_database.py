#!/usr/bin/env python3
"""
Build Master Counters Database (data/counters_database.json)
and synchronize data/submarines_database.json with all parameterized metadata.
"""

import json
import os

COUNTERS_DB = {
    "metadata": {
        "project": "Sensuikan Canonical Master Cards",
        "version": "2.0",
        "description": "Base de datos parametrizada de counters, armamento y sistemas navales",
        "slot_dimension_mm": 15.0,
        "art_canvas_size_px": 1024,
        "art_preprocessed_dir": "images/counters/ai/preprocessed",
        "art_ai_dir": "images/counters/ai",
        "art_realistic_dir": "images/counters/realistic"
    },
    "plaque_styles": {
        "bottom_plaque": {
            "description": "Cartela rectangular inferior azul marino (#0D1520) con reborde dorado (#C5A059) y 4 micro-remaches (#E2B765)",
            "bg": "#0D1520",
            "border": "#C5A059",
            "rivet": "#E2B765",
            "text_color": "#FAF6ED",
            "subtext_color": "#E2B765",
            "h_1line_mm": 3.8,
            "h_2lines_mm": 4.8,
            "h_3lines_mm": 5.8
        },
        "badge_top_left": {
            "description": "Distintivo circular naval en esquina superior izquierda para tubos de torpedo",
            "bg": "#0D1520",
            "border": "#C5A059",
            "text_color": "#FFE082",
            "radius_mm": 2.3
        },
        "damage_gauge": {
            "description": "Marcador de inundacion, superficie de emergencia o fatiga de casco",
            "bg": "#0D1520",
            "border": "#7A1818"
        }
    },
    "counters": {
        # --- 1. COMANDO Y TRIPULACIÓN (CREW) ---
        "captain": {
            "id": "captain",
            "name": "Captain (Comandante)",
            "category": "crew",
            "keywords": ["captain", "comandante", "officer", "superior"],
            "image_file": "counter_captain_portrait.png",
            "icon": "anchor_sakura",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "Captain",
            "default_sublabel": "",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "xo": {
            "id": "xo",
            "name": "Executive Officer (XO)",
            "category": "crew",
            "keywords": ["xo", "1st off", "first officer", "segundo"],
            "image_file": "counter_xo_portrait.png",
            "icon": "ship_wheel",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "XO",
            "default_sublabel": "1st Off.",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "engineer": {
            "id": "engineer",
            "name": "Chief Engineer",
            "category": "crew",
            "keywords": ["engineer", "chief eng", "maquinista"],
            "image_file": "counter_engineer_portrait.png",
            "icon": "gear_wrench",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "Engineer",
            "default_sublabel": "Chief",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "navigator": {
            "id": "navigator",
            "name": "Navigator",
            "category": "crew",
            "keywords": ["nav.", "navigator", "navegante"],
            "image_file": "counter_navigator_portrait.png",
            "icon": "sextant",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "Nav.",
            "default_sublabel": "",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "medic": {
            "id": "medic",
            "name": "Medical Doctor",
            "category": "crew",
            "keywords": ["medic", "doctor", "cirujano"],
            "image_file": "counter_medic_portrait.png",
            "icon": "medical_cross_anchor",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "Medic",
            "default_sublabel": "",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "crew_sailors": {
            "id": "crew_sailors",
            "name": "Crew / Petty Officers",
            "category": "crew",
            "keywords": ["crew", "sailor", "petty off", "marineros"],
            "image_file": "counter_sailors_crew.png",
            "icon": "sailors_trio",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "Crew",
            "default_sublabel": "#1",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "crew_quality": {
            "id": "crew_quality",
            "name": "Order of the Golden Kite (Quality)",
            "category": "crew",
            "keywords": ["quality", "golden kite", "veteran", "elite"],
            "image_file": "counter_order_golden_kite.png",
            "icon": "chevrons",
            "icon_tint": "#B07D1E",
            "plaque_style": "bottom_plaque",
            "default_label": "Crew",
            "default_sublabel": "Quality",
            "shift_pct": 0.12,
            "extra_crop": 0
        },
        "pilot": {
            "id": "pilot",
            "name": "Seiran Floatplane Pilot",
            "category": "crew",
            "keywords": ["pilot", "piloto", "aviador"],
            "image_file": "counter_seiran_floatplane.png",
            "icon": "pilot_wings",
            "icon_tint": "#8C6D37",
            "plaque_style": "bottom_plaque",
            "default_label": "Pilot",
            "default_sublabel": "",
            "shift_pct": 0.16,
            "extra_crop": 0
        },

        # --- 2. ARMAMENTO Y TORPEDOS (WEAPONS) ---
        "torpedo_tube": {
            "id": "torpedo_tube",
            "name": "Type 95 Long Lance Torpedo Tube",
            "category": "weapons",
            "keywords": ["1", "2", "3", "4", "5", "6", "7", "8", "tube", "t-1", "t-2", "t-3", "t-4", "t-5", "t-6", "t-7", "t-8"],
            "image_file": "counter_long_lance_torpedo.png",
            "icon": "torpedo_long_lance",
            "icon_tint": "#2B4C6F",
            "plaque_style": "badge_top_left",
            "default_label": "1",
            "default_sublabel": "",
            "shift_pct": 0.0,
            "extra_crop": 0
        },
        "torpedo_reloads": {
            "id": "torpedo_reloads",
            "name": "Forward / Aft Torpedo Reloads Rack",
            "category": "weapons",
            "keywords": ["reload", "rld", "recarga"],
            "image_file": "counter_twin_torpedoes_rack.png",
            "icon": "twin_torpedoes_rack",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "Reload",
            "default_sublabel": "",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "kaiten": {
            "id": "kaiten",
            "name": "Kaiten Suicide Torpedo Submersible",
            "category": "weapons",
            "keywords": ["kaiten", "k-1", "k-2", "k-3", "k-4", "k-5", "k-6"],
            "image_file": "counter_kaiten_sub.png",
            "icon": "torpedo_long_lance",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "Kaiten",
            "default_sublabel": "Suicide Torpedo",
            "shift_pct": 0.17,
            "extra_crop": 30
        },
        "deck_gun": {
            "id": "deck_gun",
            "name": "Naval Deck Gun (140mm / 120mm / 100mm)",
            "category": "weapons",
            "keywords": ["140mm", "120mm", "100mm", "127mm", "gun", "canon", "artillery"],
            "image_file": "counter_deck_gun_140mm.png",
            "icon": "deck_gun_140mm",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "140mm",
            "default_sublabel": "Status",
            "shift_pct": 0.18,
            "extra_crop": 30
        },
        "artillery_ammo": {
            "id": "artillery_ammo",
            "name": "Artillery Shell & Ammo",
            "category": "weapons",
            "keywords": ["ammo", "shell", "municion", "x5", "x10", "x15"],
            "image_file": "counter_artillery_shell.png",
            "icon": "artillery_shell",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "Ammo",
            "default_sublabel": "x5",
            "shift_pct": 0.14,
            "extra_crop": 30
        },
        "aa_gun": {
            "id": "aa_gun",
            "name": "Type 96 25mm Twin AA Gun",
            "category": "weapons",
            "keywords": ["25mm", "13.1mm", "aa", "mg", "antiaereo", "twin", "triple", "radar"],
            "image_file": "counter_aa_gun_25mm.png",
            "icon": "aa_gun_25mm",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "25mm Twin",
            "default_sublabel": "Status #1",
            "shift_pct": 0.18,
            "extra_crop": 30
        },
        "contact_mine": {
            "id": "contact_mine",
            "name": "IJN Naval Contact Mine",
            "category": "weapons",
            "keywords": ["mine", "minas", "contact mine"],
            "image_file": "counter_contact_mine.png",
            "icon": "contact_mine",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "Mines",
            "default_sublabel": "x42",
            "shift_pct": 0.15,
            "extra_crop": 0
        },
        "midget_sub": {
            "id": "midget_sub",
            "name": "Type A Ko-Hyoteki Midget Submarine",
            "category": "weapons",
            "keywords": ["midget", "ko-hyoteki", "ha-19"],
            "image_file": "counter_midget_sub.png",
            "icon": "submarine_wake",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "Midget",
            "default_sublabel": "Submarine",
            "shift_pct": 0.16,
            "extra_crop": 0
        },
        "seiran_plane": {
            "id": "seiran_plane",
            "name": "Aichi M6A1 Seiran Floatplane",
            "category": "weapons",
            "keywords": ["seiran", "m6a1", "floatplane", "avion", "aero", "e14y1"],
            "image_file": "counter_seiran_floatplane.png",
            "icon": "floatplane_topview",
            "icon_tint": "#2B4C6F",
            "plaque_style": "bottom_plaque",
            "default_label": "Seiran",
            "default_sublabel": "M6A1",
            "shift_pct": 0.16,
            "extra_crop": 0
        },

        # --- 3. SISTEMAS MECÁNICOS Y MAMPAROS (SYSTEMS) ---
        "watertight_door": {
            "id": "watertight_door",
            "name": "Armored Watertight Torpedo / Mine Door",
            "category": "systems",
            "keywords": ["door", "doors", "puerta", "compuerta", "f.doors", "aft doors", "mine door"],
            "image_file": "counter_watertight_door.png",
            "icon": "watertight_hatch",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "F. Torp.",
            "default_sublabel": "Doors (Odd)",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "radio": {
            "id": "radio",
            "name": "Naval Radio Transmitter & Morse Telegraph",
            "category": "systems",
            "keywords": ["radio", "telegrafo", "transmitter"],
            "image_file": "counter_radio_transmitter.png",
            "icon": "radio_antenna_waves",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Radio",
            "default_sublabel": "",
            "shift_pct": 0.16,
            "extra_crop": 0
        },
        "dive_planes": {
            "id": "dive_planes",
            "name": "Hydrodynamic Dive Planes & Rudder",
            "category": "systems",
            "keywords": ["dive planes", "planes", "timones", "horiz rudder", "vert rudder"],
            "image_file": "counter_dive_planes.png",
            "icon": "dive_planes_arrows",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Dive",
            "default_sublabel": "Planes",
            "shift_pct": 0.15,
            "extra_crop": 0
        },
        "crane_hangar": {
            "id": "crane_hangar",
            "name": "Aircraft Recovery Crane & Catapult Hangar",
            "category": "systems",
            "keywords": ["crane", "hangar", "grua", "catapulta"],
            "image_file": "counter_aircraft_crane.png",
            "icon": "floatplane_topview",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Crane",
            "default_sublabel": "",
            "shift_pct": 0.18,
            "extra_crop": 0
        },
        "electric_motor": {
            "id": "electric_motor",
            "name": "Electric Propulsion Dynamo Motor",
            "category": "systems",
            "keywords": ["motor", "mtr", "electric motor", "motor electrico"],
            "image_file": "counter_electric_motor.png",
            "icon": "electric_motor_rotor",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Electric",
            "default_sublabel": "Motor 1",
            "shift_pct": 0.12,
            "extra_crop": 0
        },
        "diesel_engine": {
            "id": "diesel_engine",
            "name": "Heavy IJN Diesel Engine",
            "category": "systems",
            "keywords": ["diesel", "engine", "eng", "motor diesel"],
            "image_file": "counter_diesel_engine.png",
            "icon": "diesel_engine_pistons",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Diesel",
            "default_sublabel": "Engine 1",
            "shift_pct": 0.14,
            "extra_crop": 0
        },
        "battery_cells": {
            "id": "battery_cells",
            "name": "Submarine Lead-Acid Battery Bank",
            "category": "systems",
            "keywords": ["batt", "battery", "bateria", "acumulador"],
            "image_file": "counter_battery_cells.png",
            "icon": "battery_cells",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Battery",
            "default_sublabel": "Bank 1",
            "shift_pct": 0.12,
            "extra_crop": 0
        },
        "fuel_tank": {
            "id": "fuel_tank",
            "name": "Heavy Fuel Oil Tanks",
            "category": "systems",
            "keywords": ["fuel", "combustible", "petroleo", "tanks"],
            "image_file": "counter_fuel_tank.png",
            "icon": "fuel_drop_tank",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Fuel",
            "default_sublabel": "Tanks",
            "shift_pct": 0.14,
            "extra_crop": 0
        },
        "hydrophone_sonar": {
            "id": "hydrophone_sonar",
            "name": "Type 93 Acoustic Hydrophones & Sonar",
            "category": "systems",
            "keywords": ["hydro", "hydrophones", "sonar", "hidrofonos"],
            "image_file": "counter_hydrophone_sonar.png",
            "icon": "hydrophone_sonar_cone",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Hydrophones",
            "default_sublabel": "Sonar",
            "shift_pct": 0.14,
            "extra_crop": 0
        },
        "periscope_optics": {
            "id": "periscope_optics",
            "name": "Attack & Navigation Periscope Optics",
            "category": "systems",
            "keywords": ["perisc", "periscope", "periscopio"],
            "image_file": "counter_periscope_optics.png",
            "icon": "periscope_crosshair",
            "icon_tint": "#3E4A56",
            "plaque_style": "bottom_plaque",
            "default_label": "Periscope",
            "default_sublabel": "#1",
            "shift_pct": 0.12,
            "extra_crop": 0
        },

        # --- 4. MARCADORES DE DAÑO Y SUPERFICIE (DAMAGE) ---
        "flooding_marker": {
            "id": "flooding_marker",
            "name": "Compartment Flooding Breach Marker",
            "category": "damage",
            "keywords": ["flood", "flooding", "inundacion", "vía de agua"],
            "image_file": "counter_flooding_marker.png",
            "icon": "naval_pressure_gauge",
            "icon_tint": "#2A5B86",
            "plaque_style": "bottom_plaque",
            "default_label": "Flooding",
            "default_sublabel": "",
            "shift_pct": 0.08,
            "extra_crop": 0
        },
        "emergency_surface": {
            "id": "emergency_surface",
            "name": "Emergency Surface Ballast Blow",
            "category": "damage",
            "keywords": ["surface", "emergency surface", "superficie", "soplar lastre"],
            "image_file": "counter_emergency_surface.png",
            "icon": "submarine_wake",
            "icon_tint": "#2A5B86",
            "plaque_style": "bottom_plaque",
            "default_label": "Surface",
            "default_sublabel": "",
            "shift_pct": 0.08,
            "extra_crop": 0
        },
        "hull_stress_dial": {
            "id": "hull_stress_dial",
            "name": "Hull Stress / Structural Deformation Dial",
            "category": "damage",
            "keywords": ["hull", "hull stress", "danio casco", "deformacion"],
            "image_file": "counter_hull_stress_dial.png",
            "icon": "hull_stress_dial",
            "icon_tint": "#8C2E24",
            "plaque_style": "bottom_plaque",
            "default_label": "Hull",
            "default_sublabel": "Damage",
            "shift_pct": 0.10,
            "extra_crop": 0
        },

        # --- 5. LOGÍSTICA, PATRULLA Y EVENTOS (LOGISTICS & PATROL) ---
        "supply_crates": {
            "id": "supply_crates",
            "name": "IJN Wooden Supply Crates & Cargo",
            "category": "logistics",
            "keywords": ["supplies", "cargo", "suministros", "daihatsu"],
            "image_file": "counter_supply_crates.png",
            "icon": "supply_crates",
            "icon_tint": "#A06820",
            "plaque_style": "bottom_plaque",
            "default_label": "Supplies",
            "default_sublabel": "",
            "shift_pct": 0.10,
            "extra_crop": 0
        },
        "naval_base": {
            "id": "naval_base",
            "name": "Kure / Yokosuka Imperial Naval Base",
            "category": "logistics",
            "keywords": ["base", "port", "puerto", "kure", "yokosuka", "truck"],
            "image_file": "counter_naval_base.png",
            "icon": "anchored_anchor",
            "icon_tint": "#A06820",
            "plaque_style": "bottom_plaque",
            "default_label": "Base",
            "default_sublabel": "Port",
            "shift_pct": 0.14,
            "extra_crop": 0
        },
        "tactical_mission": {
            "id": "tactical_mission",
            "name": "Secret Tactical Mission",
            "category": "logistics",
            "keywords": ["mission", "mision"],
            "image_file": "counter_tactical_mission.png",
            "icon": "tactical_target_grid",
            "icon_tint": "#A06820",
            "plaque_style": "bottom_plaque",
            "default_label": "Mission",
            "default_sublabel": "",
            "shift_pct": 0.14,
            "extra_crop": 0
        },
        "tactical_event": {
            "id": "tactical_event",
            "name": "Random Tactical Combat Event",
            "category": "logistics",
            "keywords": ["event", "evt", "evento"],
            "image_file": "counter_tactical_event.png",
            "icon": "tactical_question_shield",
            "icon_tint": "#A06820",
            "plaque_style": "bottom_plaque",
            "default_label": "Event",
            "default_sublabel": "",
            "shift_pct": 0.14,
            "extra_crop": 0
        },
        "transit_patrol": {
            "id": "transit_patrol",
            "name": "Transit / On Station Patrol Wake",
            "category": "logistics",
            "keywords": ["transit", "station", "on stat", "patrol", "patrulla", "penetrate", "attack", "egress", "recover"],
            "image_file": "counter_transit_patrol.png",
            "icon": "submarine_wake",
            "icon_tint": "#A06820",
            "plaque_style": "bottom_plaque",
            "default_label": "Transit",
            "default_sublabel": "Patrol",
            "shift_pct": 0.14,
            "extra_crop": 0
        }
    }
}

def main():
    os.makedirs('data', exist_ok=True)
    out_path = os.path.join('data', 'counters_database.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(COUNTERS_DB, f, indent=2, ensure_ascii=False)
    print(f'Successfully built {out_path} with {len(COUNTERS_DB["counters"])} parameterized counters!')

if __name__ == '__main__':
    main()
