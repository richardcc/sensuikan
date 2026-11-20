import json
import re
import shutil

print("Updating chit filenames in data.js, dock.js, and gameflow_phase0.js...")

# 1. Update data.js
with open("app/js/data.js", "r", encoding="utf-8") as f:
    data_content = f.read()

chit_updates = {
    '"chit_filename": "Submarine - Type B.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true':
    '"chit_filename": "Submarine - Type B.2.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true',
    
    '"chit_filename": "Submarine - Type C.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true':
    '"chit_filename": "Submarine - Type C.2.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true',

    '"chit_filename": "Submarine - Type A(M).jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true':
    '"chit_filename": "Submarine - Type A.2.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true',

    '"chit_filename": "Submarine - Type C.3.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": true,\n      "is_fanmade": true':
    '"chit_filename": "Submarine - Type D.1.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": true,\n      "is_fanmade": true',

    '"chit_filename": "Submarine - KD.6.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true':
    '"chit_filename": "Submarine - Kaichu VII.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true',

    '"chit_filename": "Submarine - Junsen J1M.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true':
    '"chit_filename": "Submarine - Junsen J1.jpg",\n      "is_midget_sub": false,\n      "has_midget_carrier": false,\n      "has_mines": false,\n      "mine_capacity": 0,\n      "has_daihatsu": false,\n      "is_fanmade": true'
}

for old_val, new_val in chit_updates.items():
    if old_val in data_content:
        data_content = data_content.replace(old_val, new_val)
        print("✓ Replaced chit in data.js")
    else:
        print("Note: pattern not matched directly in data.js")

with open("app/js/data.js", "w", encoding="utf-8") as f:
    f.write(data_content)

# 2. Update dock.js chitMap
with open("app/js/dock.js", "r", encoding="utf-8") as f:
    dock_content = f.read()

old_dock_chitmap = """          'Type_C3_Class': 'Submarine - Type C.3.jpg',
          'Type_A_Midget_Submarine___Ko_Hyoteki': 'Submarine - Midget.jpg'"""

new_dock_chitmap = """          'Type_C3_Class': 'Submarine - Type C.3.jpg',
          'Type_A_Midget_Submarine___Ko_Hyoteki': 'Submarine - Midget.jpg',
          'Type_B2_Class': 'Submarine - Type B.2.jpg',
          'Type_C2_Class': 'Submarine - Type C.2.jpg',
          'Type_A2_Class': 'Submarine - Type A.2.jpg',
          'Type_D1_Class': 'Submarine - Type D.1.jpg',
          'Kaichu_VII_Class': 'Submarine - Kaichu VII.jpg',
          'Junsen_J1_Class': 'Submarine - Junsen J1.jpg'"""

if old_dock_chitmap in dock_content:
    dock_content = dock_content.replace(old_dock_chitmap, new_dock_chitmap)
    with open("app/js/dock.js", "w", encoding="utf-8") as f:
        f.write(dock_content)
    print("✓ dock.js chitMap updated with fanmade chits")

# 3. Update gameflow_phase0.js SUB_CHITS_MAP
with open("app/js/gameflow_phase0.js", "r", encoding="utf-8") as f:
    p0_content = f.read()

if old_dock_chitmap in p0_content:
    p0_content = p0_content.replace(old_dock_chitmap, new_dock_chitmap)
    with open("app/js/gameflow_phase0.js", "w", encoding="utf-8") as f:
        f.write(p0_content)
    print("✓ gameflow_phase0.js SUB_CHITS_MAP updated with fanmade chits")

# 4. Mirror files
for fn in ["data.js", "dock.js", "gameflow_phase0.js"]:
    shutil.copyfile(f"app/js/{fn}", f"app/js/components/{fn}")
    print(f"✓ Mirrored {fn} to components/")

print("Chit filenames updated successfully!")
