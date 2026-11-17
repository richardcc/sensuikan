import os
import re

card_script_path = 'scripts/generators/generate_canonical_player_cards.py'
with open(card_script_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update SUBMARINE_ARMAMENT_MAP with authentic original Vassal labels:
new_armament_map = """SUBMARINE_ARMAMENT_MAP = {
    "Kaidai_KD3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld"), ("Forward\\nReload (8)", "", "rld"), ("Supplies", "", "sup")],
        "r4": [("120mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD4_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("Forward\\nReload (6)", "", "rld"), ("Supplies", "", "sup"), None, None],
        "r4": [("120mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD5_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("Forward\\nReload (6)", "", "rld"), ("Supplies", "", "sup"), None, None],
        "r4": [("100mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD6_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("Forward\\nReload (6)", "", "rld"), ("Supplies", "", "sup"), ("Daihatsu", "Landing", "cargo"), None],
        "r4": [("100mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("13.1mm\\nStatus", "", "aa"), None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD7_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (6)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("120mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm AA\\nStatus #1", "", "aa"), ("25mm AA\\nStatus #2", "", "aa"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Kirai_Sen_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("Aft Mine\\nDoors", "", "mine_door"), ("Mines\\nx42", "", "mines"), ("Forward\\nReload (8)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes", "Radio",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Junsen_J_IM_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (12)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm Status\\n#1", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("140mm Status\\n#2", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Junsen_J2_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("Forward\\nReload (9)", "", "rld"), ("Supplies", "", "sup"), ("13.1mm\\nStatus", "", "aa"), None],
        "r4": [("127mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r5": [None, None, None, None],
        "sys": ["Crane", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Hydrophones", "Batteries", "Periscope", None]
    },
    "Junsen_J3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (15)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r4": [("13.1mm\\nStatus #1", "", "aa"), ("13.1mm\\nStatus #2", "", "aa"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r5": [None, None, None, None],
        "sys": ["Crane", "Aft Torp Doors", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_A_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (12)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), None, None],
        "r5": [None, None, None, None],
        "sys": ["Crane", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_B_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (11)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r4": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_B_3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (13)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r4": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "sys": ["Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
                "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Hydrophones", "Batteries", "Periscope", None]
    },
    "Type_C_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("Forward\\nReload (12)", "", "rld"), ("Supplies", "", "sup"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r4": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r5": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "sys": ["Type 22 Radar", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_C3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (13)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm Status\\n#1", "", "gun"), ("Ammo\\nx5", "", "ammo"), ("140mm Status\\n#2", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r4": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "sys": ["Type 22 Radar", "Cargo", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_A_Modified": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Forward\\nReload (12)", "", "rld"), ("Supplies", "", "sup")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm Triple\\nStatus #1", "", "aa"), ("25mm Triple\\nStatus #2", "", "aa"), ("25mm Single\\nStatus", "", "aa"), None],
        "r5": [None, None, None, None],
        "sys": ["Type 22 Radar", "Crane", "Hangar", "F. Torp. Doors (Odd)",
                "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Hydrophones", "Batteries", "Periscope", None]
    },
    "Sen_Toku_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("Forward\\nReload (12)", "", "rld"), ("Supplies", "", "sup"), ("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r4": [("25mm Triple\\nStatus #1", "", "aa"), ("25mm Triple\\nStatus #2", "", "aa"), ("25mm Triple\\nStatus #3", "", "aa"), ("25mm Single\\nStatus", "", "aa")],
        "r5": [("Mk 3 M1\\nAir Srch Radar", "", "radar"), ("Mk 2 M2\\nSea Srch Radar", "", "radar"), None, None],
        "sys": ["Crane", "Hangar", "Radio", "Periscope",
                "Hydrophones", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes",
                "Batteries", "Fuel Tanks", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Diesel Engine 3", "Diesel Engine 4"]
    },
    "Sen_Taka_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("Forward\\nReload (6)", "", "rld"), ("Supplies", "", "sup"), None, None],
        "r3": [("25mm Single\\nStatus", "", "aa"), None, None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Electric Motor 3", "Electric Motor 4",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries 1", "Batteries 2", "Batteries 3", "Periscope"]
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), None, None],
        "r2": [None, None, None, None],
        "r3": [None, None, None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Fwd Battery", "Aft Battery", "Wire Cutters", "Gyro Compass",
                "Propeller", "Electric Motor", "Horiz. Rudder", "Vertical Rudder",
                "Radio", "Hydrophones", "Periscope", None,
                None, None, None, None]
    }
}"""

s_idx = code.find('SUBMARINE_ARMAMENT_MAP = {')
e_idx = code.find('def draw_armament_slot', s_idx)
code = code[:s_idx] + new_armament_map + '\n\n' + code[e_idx:]

with open(card_script_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated SUBMARINE_ARMAMENT_MAP successfully!")
