import json
import re

print("Adding 6 real historical fanmade submarines to SUB_DB...")

with open("app/js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

# Locate SUB_DB JSON
prefix_match = re.search(r"const\s+SUB_DB\s*=\s*", content)
if not prefix_match:
    print("Error: SUB_DB not found")
    exit(1)

start_idx = prefix_match.end()

# Balance braces
brace_count = 0
end_idx = -1
for i in range(start_idx, len(content)):
    c = content[i]
    if c == '{':
        brace_count += 1
    elif c == '}':
        brace_count -= 1
        if brace_count == 0:
            end_idx = i + 1
            break

sub_db = json.loads(content[start_idx:end_idx])

# Define the 6 real historical submarines
fanmade_subs = {
    "Type_B2_Class": {
        "class_name": "Type B2 Class",
        "full_title": "Type B2 (I-40 Series) Cruiser Submarine",
        "available_date": "Available July 1943",
        "start_month": "1943-07",
        "patrol_length": "2 month patrols",
        "has_aircraft": True,
        "aircraft_type": "1x Yokosuka E14Y Glen",
        "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 11, "reloads_aft": 0},
        "reload_capacity": 11,
        "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm AA Status (x2)"},
        "has_kaiten": True,
        "kaiten_note": "Carries 4 Type 1 Kaiten from 1945 onwards (I-44 conversion).",
        "systems_status": ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
        "stats": {"length": "356 Feet (108.7m)", "displacement": "2,230 tons", "speed": "23.6 knots", "range": "14,000 nm", "crew": 94, "produced": 6},
        "special_rules": "Real IJN class (I-40 to I-45). Fast cruiser submarine with reconnaissance floatplane. 6 forward torpedo tubes, 11 reloads (17 total). Simplified wartime construction.",
        "vassal_filename": "Type B Class.jpg",
        "vassal_image_path": "images/vassal/Type B Class.jpg",
        "profile_image_path": "images/subs/remastered/11_Type_B.jpg",
        "is_remastered": True,
        "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"],
        "damage_capacity": {"flooding": 8, "hull": 8},
        "crew_counters": 4,
        "commander_rank_required": "Lt. Commander",
        "radar": {"equipped": False, "retrofit_month": "1944-12", "model": "Type 22 Surface Radar", "model_es": "Radar Tipo 22 Superficie"},
        "chit_filename": "Submarine - Type B.jpg",
        "is_midget_sub": False,
        "has_midget_carrier": False,
        "has_mines": False,
        "mine_capacity": 0,
        "has_daihatsu": False,
        "is_fanmade": True
    },
    "Type_C2_Class": {
        "class_name": "Type C2 Class",
        "full_title": "Type C2 (I-46 Series) Heavy Attack Submarine",
        "available_date": "Available February 1944",
        "start_month": "1944-02",
        "patrol_length": "2 month patrols",
        "has_aircraft": False,
        "aircraft_type": None,
        "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 13, "reloads_aft": 0},
        "reload_capacity": 13,
        "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm AA Status (x2)"},
        "has_kaiten": True,
        "kaiten_note": "Carries 4–6 Type 1 Kaiten on deck clamps (I-47 sank USS Mississinewa at Ulithi).",
        "systems_status": ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
        "stats": {"length": "358 Feet (109.3m)", "displacement": "2,564 tons", "speed": "23.6 knots", "range": "14,000 nm", "crew": 94, "produced": 3},
        "special_rules": "Real IJN class (I-46 to I-48). Heavy attack submarine without midget sub clamp: maximized endurance and torpedo loadout (6 tubes, 13 reloads = 19 total). Historic Kaiten carrier.",
        "vassal_filename": "Type C Class.jpg",
        "vassal_image_path": "images/vassal/Type C Class.jpg",
        "profile_image_path": "images/subs/remastered/12_Type_C.jpg",
        "is_remastered": True,
        "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"],
        "damage_capacity": {"flooding": 8, "hull": 8},
        "crew_counters": 4,
        "commander_rank_required": "Lt. Commander",
        "radar": {"equipped": False, "retrofit_month": "1944-12", "model": "Type 22 AS/SS (Retrofit 12/44)", "model_es": "Radar Tipo 22 AS/SS (Refit 12/44)"},
        "chit_filename": "Submarine - Type C.jpg",
        "is_midget_sub": False,
        "has_midget_carrier": False,
        "has_mines": False,
        "mine_capacity": 0,
        "has_daihatsu": False,
        "is_fanmade": True
    },
    "Type_A2_Class": {
        "class_name": "Type A2 Class",
        "full_title": "Type A2 (I-13 Series) Seiran Aircraft Carrier Submarine",
        "available_date": "Available December 1944",
        "start_month": "1944-12",
        "patrol_length": "3 month patrols",
        "has_aircraft": True,
        "aircraft_type": "2x Aichi M6A1 Seiran Attack Bombers",
        "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 6, "reloads_aft": 0},
        "reload_capacity": 6,
        "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm AA Status (x7)"},
        "has_kaiten": False,
        "kaiten_note": "Does not carry Kaiten; enlarged hangar houses 2 Seiran strike bombers.",
        "systems_status": ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
        "stats": {"length": "373 Feet (113.7m)", "displacement": "4,762 tons", "speed": "16.7 knots", "range": "21,000 nm", "crew": 108, "produced": 2},
        "special_rules": "Real IJN class (I-13, I-14). Attack aircraft carrier submarine sister to Sen-Toku. Enlarged hangar carries 2 Aichi M6A1 Seiran bombers. Equipped with radar. Requires Commander rank.",
        "vassal_filename": "Type A Class.jpg",
        "vassal_image_path": "images/vassal/Type A Class.jpg",
        "profile_image_path": "images/subs/remastered/10_Type_A.jpg",
        "is_remastered": True,
        "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit", "N/A"],
        "damage_capacity": {"flooding": 8, "hull": 8},
        "crew_counters": 4,
        "commander_rank_required": "Commander",
        "radar": {"equipped": True, "available_month": "1944-12", "model": "Type 22 & Type 13 Radar", "model_es": "Radar Tipo 22 y Tipo 13 Superficie/Aéreo"},
        "chit_filename": "Submarine - Type A(M).jpg",
        "is_midget_sub": False,
        "has_midget_carrier": False,
        "has_mines": False,
        "mine_capacity": 0,
        "has_daihatsu": False,
        "is_fanmade": True
    },
    "Type_D1_Class": {
        "class_name": "Type D1 Class",
        "full_title": "Type D1 (I-361 Series) Transport & Kaiten Submarine",
        "available_date": "Available May 1944",
        "start_month": "1944-05",
        "patrol_length": "2 month patrols",
        "has_aircraft": False,
        "aircraft_type": None,
        "torpedo_tubes": {"fwd": 2, "aft": 0, "reloads_fwd": 0, "reloads_aft": 0},
        "reload_capacity": 0,
        "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm AA Status (x2)"},
        "has_kaiten": True,
        "kaiten_note": "Carries 5 Type 1 Kaiten in late-war Kaiten Special Missions (deck gun removed).",
        "systems_status": ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
        "stats": {"length": "241 Feet (73.5m)", "displacement": "2,215 tons", "speed": "13 knots", "range": "15,000 nm", "crew": 60, "produced": 12},
        "special_rules": "Real IJN class (I-361 to I-372). Dedicated supply submarine carrying 1 Daihatsu 14m landing craft and 82t cargo. 2 bow torpedoes (0 reloads). Converted to 5 Kaiten in late 1944.",
        "vassal_filename": "Type C.3 Class.jpg",
        "vassal_image_path": "images/vassal/Type C.3 Class.jpg",
        "profile_image_path": "images/subs/remastered/17_Type_C3.jpg",
        "is_remastered": True,
        "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"],
        "damage_capacity": {"flooding": 7, "hull": 7},
        "crew_counters": 4,
        "commander_rank_required": "Lt. Commander",
        "radar": {"equipped": False, "retrofit_month": "1944-12", "model": "Type 22 AS/SS (Retrofit 12/44)", "model_es": "Radar Tipo 22 AS/SS (Refit 12/44)"},
        "chit_filename": "Submarine - Type C.3.jpg",
        "is_midget_sub": False,
        "has_midget_carrier": False,
        "has_mines": False,
        "mine_capacity": 0,
        "has_daihatsu": True,
        "is_fanmade": True
    },
    "Kaichu_VII_Class": {
        "class_name": "Kaichu VII Class",
        "full_title": "Kaichu VII (Ro-35 Series) Medium Fleet Submarine",
        "available_date": "Available March 1943",
        "start_month": "1943-03",
        "patrol_length": "2 month patrols",
        "has_aircraft": False,
        "aircraft_type": None,
        "torpedo_tubes": {"fwd": 4, "aft": 0, "reloads_fwd": 6, "reloads_aft": 0},
        "reload_capacity": 6,
        "deck_guns": {"main": "76.2mm Status", "ammo": 5, "aa": "25mm AA Status (x2)"},
        "has_kaiten": False,
        "kaiten_note": "Does not carry Kaiten; medium coastal hull.",
        "systems_status": ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
        "stats": {"length": "264 Feet (80.5m)", "displacement": "1,447 tons", "speed": "19.8 knots", "range": "5,000 nm", "crew": 61, "produced": 18},
        "special_rules": "Real IJN class (Ro-35 to Ro-56). Medium coastal fleet submarine (Ro-gata). Fast diving time, high maneuverability in island waters. 4 bow tubes, 6 reloads (10 total). 1x 76.2mm gun.",
        "vassal_filename": "Kaidai KD6 Class.jpg",
        "vassal_image_path": "images/vassal/Kaidai KD6 Class.jpg",
        "profile_image_path": "images/subs/remastered/04_Kaidai_KD6.jpg",
        "is_remastered": True,
        "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"],
        "damage_capacity": {"flooding": 6, "hull": 6},
        "crew_counters": 3,
        "commander_rank_required": "Lt. Commander",
        "radar": {"equipped": False, "model": "None", "model_es": "Ninguno"},
        "chit_filename": "Submarine - KD.6.jpg",
        "is_midget_sub": False,
        "has_midget_carrier": False,
        "has_mines": False,
        "mine_capacity": 0,
        "has_daihatsu": False,
        "is_fanmade": True
    },
    "Junsen_J1_Class": {
        "class_name": "Junsen J1 Class",
        "full_title": "Junsen J1 (I-1 Series) Twin Deck Gun Cruiser Submarine",
        "available_date": "Available December 1941",
        "start_month": "1941-12",
        "patrol_length": "3 month patrols",
        "has_aircraft": False,
        "aircraft_type": None,
        "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 14, "reloads_aft": 0},
        "reload_capacity": 14,
        "deck_guns": {"main": "2x 140mm Status", "ammo": 8, "aa": "13.2mm AA Status"},
        "has_kaiten": False,
        "kaiten_note": "Does not carry Kaiten.",
        "systems_status": ["F.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"],
        "stats": {"length": "320 Feet (97.5m)", "displacement": "2,791 tons", "speed": "18 knots", "range": "24,400 nm", "crew": 92, "produced": 4},
        "special_rules": "Real IJN class (I-1 to I-4). Original cruiser submarine without aircraft hangar. Heavily armed with twin 140mm (5.5\") deck guns (fore and aft) and 20 torpedoes. Massive 24,400 nm range.",
        "vassal_filename": "Junsen J IM Class.jpg",
        "vassal_image_path": "images/vassal/Junsen J IM Class.jpg",
        "profile_image_path": "images/subs/remastered/07_Junsen_J1M.jpg",
        "is_remastered": True,
        "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit", "N/A"],
        "damage_capacity": {"flooding": 8, "hull": 8},
        "crew_counters": 4,
        "commander_rank_required": "Lt. Commander",
        "radar": {"equipped": False, "model": "None", "model_es": "Ninguno"},
        "chit_filename": "Submarine - Junsen J1M.jpg",
        "is_midget_sub": False,
        "has_midget_carrier": False,
        "has_mines": False,
        "mine_capacity": 0,
        "has_daihatsu": False,
        "is_fanmade": True
    }
}

for k, v in fanmade_subs.items():
    sub_db["submarines"][k] = v

sub_db["metadata"]["total_classes"] = len(sub_db["submarines"])
sub_db["metadata"]["official_classes"] = 18
sub_db["metadata"]["fanmade_classes"] = len(fanmade_subs)

print(f"Total submarines now: {len(sub_db['submarines'])} (18 Official + 6 Real Fanmade)")

new_sub_db_str = json.dumps(sub_db, ensure_ascii=False, indent=2)
new_content = content[:start_idx] + new_sub_db_str + content[end_idx:]

# Also ensure SUB_START_MONTHS dictionary includes the 6 fanmade classes
start_months_pattern = re.compile(r"const\s+SUB_START_MONTHS\s*=\s*\{([^}]+)\};")
sm_match = start_months_pattern.search(new_content)
if sm_match:
    old_sm_text = sm_match.group(1)
    new_entries = """
  "Type_B2_Class": "1943-07",
  "Type_C2_Class": "1944-02",
  "Type_A2_Class": "1944-12",
  "Type_D1_Class": "1944-05",
  "Kaichu_VII_Class": "1943-03",
  "Junsen_J1_Class": "1941-12","""
    if "Type_B2_Class" not in old_sm_text:
        updated_sm_text = old_sm_text + new_entries
        new_content = new_content.replace(old_sm_text, updated_sm_text)

with open("app/js/data.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Saved updated app/js/data.js successfully!")
