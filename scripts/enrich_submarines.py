import json
import re

with open("app/js/data.js", "r", encoding="utf-8") as f:
    content = f.read()

# Locate SUB_DB = { ... };
prefix_match = re.search(r"const\s+SUB_DB\s*=\s*", content)
if not prefix_match:
    print("Error: SUB_DB not found")
    exit(1)

start_idx = prefix_match.end()

# Parse JSON object by brace counting
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

if end_idx == -1:
    print("Error: Could not balance braces for SUB_DB")
    exit(1)

sub_db_json_str = content[start_idx:end_idx]
sub_db = json.loads(sub_db_json_str)

SUB_START_MONTHS = {
  "Kaidai_KD3_Class": "1941-12",
  "Kaidai_KD4_Class": "1941-12",
  "Kaidai_KD5_Class": "1941-12",
  "Kaidai_KD6_Class": "1941-12",
  "Kaidai_KD7_Class": "1942-09",
  "Kirai_Sen_Class": "1941-12",
  "Junsen_J_IM_Class": "1941-12",
  "Junsen_J2_Class": "1941-12",
  "Junsen_J3_Class": "1941-12",
  "Type_A_Class": "1941-12",
  "Type_B_Class": "1941-12",
  "Type_B_3_Class": "1944-06",
  "Type_C_Class": "1941-12",
  "Type_C3_Class": "1944-05",
  "Type_A_Modified": "1945-05",
  "Sen_Toku_Class": "1944-12",
  "Sen_Taka_Class": "1945-07",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "1941-12"
}

SUB_CHITS_MAP = {
  'Kaidai_KD3_Class': 'Submarine - KD.3.jpg',
  'Kaidai_KD4_Class': 'Submarine - KD.4.jpg',
  'Kaidai_KD5_Class': 'Submarine - KD.5.jpg',
  'Kaidai_KD6_Class': 'Submarine - KD.6.jpg',
  'Kaidai_KD7_Class': 'Submarine - KD.7.jpg',
  'Kirai_Sen_Class': 'Submarine - Kirai-Sen.jpg',
  'Junsen_J_IM_Class': 'Submarine - Junsen J1M.jpg',
  'Junsen_J2_Class': 'Submarine - Junsen J2.jpg',
  'Junsen_J3_Class': 'Submarine - Junsen J3.jpg',
  'Type_A_Class': 'Submarine - Type A.jpg',
  'Type_B_Class': 'Submarine - Type B.jpg',
  'Type_B_3_Class': 'Submarine - Type B.3.jpg',
  'Type_C_Class': 'Submarine - Type C.jpg',
  'Type_A_Modified': 'Submarine - Type A(M).jpg',
  'Sen_Toku_Class': 'Submarine - Sen-Toku.jpg',
  'Sen_Taka_Class': 'Submarine - Sen-Taka.jpg',
  'Type_C3_Class': 'Submarine - Type C.3.jpg',
  'Type_A_Midget_Submarine___Ko_Hyoteki': 'Submarine - Midget.jpg'
}

for sub_key, sub in sub_db["submarines"].items():
    # 1. Start month
    sub["start_month"] = SUB_START_MONTHS.get(sub_key, "1941-12")
    
    # 2. Commander rank
    if sub_key in ["Sen_Toku_Class", "Type_A_Modified"]:
        sub["commander_rank_required"] = "Commander"
    else:
        sub["commander_rank_required"] = "Lt. Commander"
        
    # 3. Radar
    if sub_key == "Sen_Toku_Class":
        sub["radar"] = {
            "equipped": True,
            "model": "Mk 3 M1 Air / Mk 2 M2 Surface",
            "model_es": "Mk 3 M1 Aéreo / Mk 2 M2 Superficie",
            "available_month": "1944-12"
        }
    elif sub_key in ["Type_B_3_Class", "Type_B3_Class"]:
        sub["radar"] = {
            "equipped": True,
            "model": "Type 22 Surface Radar",
            "model_es": "Radar Tipo 22 Superficie",
            "available_month": "1944-06"
        }
    elif sub_key == "Type_A_Modified":
        sub["radar"] = {
            "equipped": True,
            "model": "Type 22 Surface Radar",
            "model_es": "Radar Tipo 22 Superficie",
            "available_month": "1945-05"
        }
    elif sub_key == "Sen_Taka_Class":
        sub["radar"] = {
            "equipped": True,
            "model": "Advanced Air/Surface Radar",
            "model_es": "Radar Avanzado Aéreo/Superficie",
            "available_month": "1945-07"
        }
    elif sub_key in ["Type_C_Class", "Type_C3_Class"]:
        sub["radar"] = {
            "equipped": False,
            "retrofit_month": "1944-12",
            "model": "Type 22 AS/SS (Retrofit 12/44)",
            "model_es": "Radar Tipo 22 AS/SS (Refit 12/44)"
        }
    else:
        sub["radar"] = {
            "equipped": False,
            "model": "None",
            "model_es": "Ninguno"
        }
        
    # 4. Chit filename
    sub["chit_filename"] = SUB_CHITS_MAP.get(sub_key, "Submarine - Type B.jpg")
    
    # 5. Midget properties
    sub["is_midget_sub"] = (sub_key == "Type_A_Midget_Submarine___Ko_Hyoteki")
    sub["has_midget_carrier"] = (sub_key == "Type_C_Class")
    
    # 6. Minelayer properties
    sub["has_mines"] = (sub_key == "Kirai_Sen_Class")
    sub["mine_capacity"] = 42 if sub_key == "Kirai_Sen_Class" else 0
    
    # 7. Daihatsu landing craft
    sub["has_daihatsu"] = sub_key in ["Type_B_3_Class", "Type_C3_Class"]

print(f"Successfully processed {len(sub_db['submarines'])} submarines.")

# Format as pretty JSON with 2-space indentation
new_sub_db_str = json.dumps(sub_db, ensure_ascii=False, indent=2)

# Also ensure registerSubmarine helper and updated getSubmarineStartMonth are added
new_content = content[:start_idx] + new_sub_db_str + content[end_idx:]

with open("app/js/data.js", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Saved enriched SUB_DB into app/js/data.js")
