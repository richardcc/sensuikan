import json
import os

print("Enriching data/submarines_database.json with all 24 submarines...")

db_path = 'data/submarines_database.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

subs = db['submarines']

fanmade_subs = {
    "Junsen_J1_Class": {
        "class_name": "Junsen J1 Class",
        "full_title": "Junsen J1 (I-1 Series) Long-Range Cruiser Submarine",
        "available_date": "Available December 1941",
        "patrol_length": "2 month patrols",
        "has_aircraft": False,
        "aircraft_type": "None",
        "torpedo_tubes": {
            "fwd": 6,
            "aft": 0,
            "reloads_fwd": 14,
            "reloads_aft": 0
        },
        "deck_guns": {
            "main": "Twin 140mm Status",
            "ammo": 5,
            "aa": "13.2mm AA Status"
        },
        "has_kaiten": False,
        "kaiten_note": "",
        "systems_status": [
            "F.Doors", "Planes", "Radio", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2",
            "Fuel", "Hydro", "Batt", "Perisc", "Aft Torp Doors"
        ],
        "stats": {
            "length": "320 Feet (97.5m)",
            "displacement": "2,791 tons",
            "speed": "18 knots",
            "range": "24,400 nm",
            "crew": 92,
            "produced": 4
        },
        "special_rules": "Cruiser submarine without aircraft hangar. Heavily armed with twin 140mm (5.5\") deck guns (fore and aft). 6 forward torpedo tubes (14 reloads = 20 torpedoes). Massive 24,400 nm operational range.",
        "profile_image_path": "images/subs/remastered/19_Junsen_J1.jpg",
        "is_remastered": True,
        "is_fanmade": True,
        "patrol_phases": [
            "Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit", "N/A"
        ],
        "damage_capacity": {
            "flooding": 8,
            "hull": 8
        },
        "crew_counters": 4,
        "reload_capacity": 14,
        "shipyard_metadata": {
            "title": "JUNSEN  J1  CLASS  (I-1)",
            "subtitle": "LONG-RANGE CRUISER SUBMARINE  |  TWIN 140MM GUNS",
            "badges": [
                "AVAILABLE: DEC 1941",
                "PATROLS: 2 MONTHS",
                "HULLS: I-1..I-4 (4 BUILT)"
            ]
        }
    },
    "Kaichu_VII_Class": {
        "class_name": "Kaichu VII Class",
        "full_title": "Kaichu VII (Ro-35 Series) Medium Fleet Submarine",
        "available_date": "Available March 1943",
        "patrol_length": "1 month patrols",
        "has_aircraft": False,
        "aircraft_type": "None",
        "torpedo_tubes": {
            "fwd": 4,
            "aft": 0,
            "reloads_fwd": 6,
            "reloads_aft": 0
        },
        "deck_guns": {
            "main": "76.2mm Status",
            "ammo": 5,
            "aa": "25mm Twin AA Status"
        },
        "has_kaiten": False,
        "kaiten_note": "",
        "systems_status": [
            "F.Doors", "Planes", "Radio", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2",
            "Fuel", "Hydro", "Batt", "Perisc"
        ],
        "stats": {
            "length": "264 Feet (80.5m)",
            "displacement": "1,447 tons",
            "speed": "19.8 knots",
            "range": "5,000 nm",
            "crew": 61,
            "produced": 18
        },
        "special_rules": "Medium coastal fleet submarine (Ro-gata). Fast diving time, high maneuverability in island waters. 4 bow tubes, 6 reloads (10 total). Armed with 1x 76.2mm gun and twin 25mm AA.",
        "profile_image_path": "images/subs/remastered/20_Kaichu_VII.jpg",
        "is_remastered": True,
        "is_fanmade": True,
        "patrol_phases": [
            "Transit", "Stat 1", "Stat 2", "Transit", "N/A", "N/A", "N/A", "N/A", "N/A"
        ],
        "damage_capacity": {
            "flooding": 7,
            "hull": 7
        },
        "crew_counters": 3,
        "reload_capacity": 6,
        "shipyard_metadata": {
            "title": "KAICHU  VII  CLASS  (RO-35)",
            "subtitle": "MEDIUM COASTAL FLEET SUBMARINE  |  RO-GATA TYPE",
            "badges": [
                "AVAILABLE: MAR 1943",
                "PATROLS: 1 MONTH",
                "HULLS: RO-35..56 (18 BUILT)"
            ]
        }
    },
    "Type_B2_Class": {
        "class_name": "Type B2 Class",
        "full_title": "Type B2 (Otsu-gata Kai-1) Cruiser Submarine (I-40 Series)",
        "available_date": "Available July 1943",
        "patrol_length": "2 month patrols",
        "has_aircraft": True,
        "aircraft_type": "Yokosuka E14Y1 Glen",
        "torpedo_tubes": {
            "fwd": 6,
            "aft": 0,
            "reloads_fwd": 11,
            "reloads_aft": 0
        },
        "deck_guns": {
            "main": "140mm Status",
            "ammo": 5,
            "aa": "25mm Twin AA Status (x2)"
        },
        "has_kaiten": True,
        "kaiten_note": "In 12/44 Kaiten may be installed with 2nd 25mm Twin AA. If so, remove Deck Gun and aircraft. Carried ONLY on Kaiten missions.",
        "systems_status": [
            "F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1",
            "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"
        ],
        "stats": {
            "length": "356 Feet (108.7m)",
            "displacement": "2,230 tons",
            "speed": "23.6 knots",
            "range": "14,000 nm",
            "crew": 94,
            "produced": 6
        },
        "special_rules": "Fast cruiser submarine with reconnaissance floatplane. 6 forward torpedo tubes, 11 reloads (17 total). 140mm deck gun. Simplified wartime construction. Carries 4 Kaiten from 1945 (I-44).",
        "profile_image_path": "images/subs/remastered/21_Type_B2.jpg",
        "is_remastered": True,
        "is_fanmade": True,
        "patrol_phases": [
            "Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"
        ],
        "damage_capacity": {
            "flooding": 8,
            "hull": 8
        },
        "crew_counters": 5,
        "reload_capacity": 11,
        "shipyard_metadata": {
            "title": "TYPE  B2  CLASS  (I-40)",
            "subtitle": "RECONNAISSANCE CRUISER SUBMARINE  |  OTSU-GATA TYPE",
            "badges": [
                "AVAILABLE: JUL 1943",
                "PATROLS: 2 MONTHS",
                "HULLS: I-40..I-45 (6 BUILT)"
            ]
        }
    },
    "Type_C2_Class": {
        "class_name": "Type C2 Class",
        "full_title": "Type C2 (Hei-gata Kai) Heavy Attack Submarine (I-46 Series)",
        "available_date": "Available February 1944",
        "patrol_length": "2 month patrols",
        "has_aircraft": False,
        "aircraft_type": "None",
        "torpedo_tubes": {
            "fwd": 6,
            "aft": 0,
            "reloads_fwd": 13,
            "reloads_aft": 0
        },
        "deck_guns": {
            "main": "140mm Status",
            "ammo": 5,
            "aa": "25mm AA Status (x2)"
        },
        "has_kaiten": True,
        "kaiten_note": "Fitted with clamps for 4 Kaiten human torpedoes. Historic Kaiten carrier: I-47 launched Kaitens sinking USS Mississinewa.",
        "systems_status": [
            "F.Doors", "Planes", "Radio", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2",
            "Fuel", "Hydro", "Batt", "Perisc"
        ],
        "stats": {
            "length": "358 Feet (109.3m)",
            "displacement": "2,564 tons",
            "speed": "23.6 knots",
            "range": "14,000 nm",
            "crew": 94,
            "produced": 3
        },
        "special_rules": "Heavy attack submarine: maximized endurance and torpedo loadout (6 tubes, 13 reloads = 19 total). Historic Kaiten carrier (I-47 sank USS Mississinewa at Ulithi). No midget submarine clamp.",
        "profile_image_path": "images/subs/remastered/22_Type_C2.jpg",
        "is_remastered": True,
        "is_fanmade": True,
        "patrol_phases": [
            "Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"
        ],
        "damage_capacity": {
            "flooding": 8,
            "hull": 8
        },
        "crew_counters": 5,
        "reload_capacity": 13,
        "shipyard_metadata": {
            "title": "TYPE  C2  CLASS  (I-46)",
            "subtitle": "HEAVY ATTACK SUBMARINE  |  HEI-GATA TYPE",
            "badges": [
                "AVAILABLE: FEB 1944",
                "PATROLS: 2 MONTHS",
                "HULLS: I-46..I-48 (3 BUILT)"
            ]
        }
    },
    "Type_D1_Class": {
        "class_name": "Type D1 Class",
        "full_title": "Type D1 (Sen-Yu-Sho) Supply Transport Submarine (I-361 Series)",
        "available_date": "Available May 1944",
        "patrol_length": "2 month patrols",
        "has_aircraft": False,
        "aircraft_type": "None",
        "torpedo_tubes": {
            "fwd": 2,
            "aft": 0,
            "reloads_fwd": 0,
            "reloads_aft": 0
        },
        "deck_guns": {
            "main": "140mm Status",
            "ammo": 5,
            "aa": "25mm Twin AA Status"
        },
        "has_kaiten": True,
        "kaiten_note": "Converted from late 1944 to carry 5 Kaiten human torpedoes for Special Attack missions. When fitted with Kaitens, Daihatsu is removed.",
        "systems_status": [
            "F.Doors", "Planes", "Radio", "Supply Cargo", "Mtr 1", "Mtr 2", "Eng 1",
            "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"
        ],
        "stats": {
            "length": "241 Feet (73.5m)",
            "displacement": "2,215 tons",
            "speed": "13 knots",
            "range": "15,000 nm",
            "crew": 60,
            "produced": 12
        },
        "special_rules": "Dedicated supply submarine carrying 1 Daihatsu 14m landing craft and 82t cargo. 2 bow torpedoes (0 reloads). Converted to carry 5 Type 1 Kaiten in late 1944 for Special Attack missions.",
        "profile_image_path": "images/subs/remastered/23_Type_D1.jpg",
        "is_remastered": True,
        "is_fanmade": True,
        "patrol_phases": [
            "Transit", "Stat 1", "Stat 2", "Stat 3", "Transit", "N/A", "N/A", "N/A", "N/A"
        ],
        "damage_capacity": {
            "flooding": 7,
            "hull": 7
        },
        "crew_counters": 3,
        "reload_capacity": 0,
        "shipyard_metadata": {
            "title": "TYPE  D1  CLASS  (I-361)",
            "subtitle": "SEN-YU-SHO SUPPLY TRANSPORT  |  TEI-GATA TYPE",
            "badges": [
                "AVAILABLE: MAY 1944",
                "PATROLS: 2 MONTHS",
                "HULLS: I-361..372 (12 BUILT)"
            ]
        }
    },
    "Type_A2_Class": {
        "class_name": "Type A2 Class",
        "full_title": "Type A2 (Ko-gata Kai-2) Attack Carrier Submarine (I-13 Series)",
        "available_date": "Available December 1944",
        "patrol_length": "3 month patrols",
        "has_aircraft": True,
        "aircraft_type": "Aichi M6A1 Seiran (x2)",
        "torpedo_tubes": {
            "fwd": 6,
            "aft": 0,
            "reloads_fwd": 12,
            "reloads_aft": 0
        },
        "deck_guns": {
            "main": "140mm Status",
            "ammo": 5,
            "aa": "25mm Triple AA Status (x2)"
        },
        "has_kaiten": False,
        "kaiten_note": "",
        "systems_status": [
            "F.Doors", "Planes", "Radio", "Hangar", "Crane", "Mtr 1", "Mtr 2",
            "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"
        ],
        "stats": {
            "length": "372 Feet (113.7m)",
            "displacement": "4,762 tons",
            "speed": "16.7 knots",
            "range": "21,000 nm",
            "crew": 108,
            "produced": 2
        },
        "special_rules": "Attack aircraft carrier submarine sister to Sen-Toku. Enlarged hangar carries 2 Aichi M6A1 Seiran bombers. Equipped with radar and 7x 25mm AA guns. Requires Commander rank.",
        "profile_image_path": "images/subs/remastered/24_Type_A2.jpg",
        "is_remastered": True,
        "is_fanmade": True,
        "patrol_phases": [
            "Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"
        ],
        "damage_capacity": {
            "flooding": 8,
            "hull": 8
        },
        "crew_counters": 5,
        "reload_capacity": 12,
        "shipyard_metadata": {
            "title": "TYPE  A2  CLASS  (I-13)",
            "subtitle": "ATTACK CARRIER SUBMARINE  |  KO-GATA TYPE",
            "badges": [
                "AVAILABLE: DEC 1944",
                "PATROLS: 3 MONTHS",
                "HULLS: I-13, I-14 (2 BUILT)"
            ]
        }
    }
}

for k, v in fanmade_subs.items():
    subs[k] = v
    print(f"+ Added {k} to database")

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"\nDone! Database now contains {len(subs)} submarines in total.")
