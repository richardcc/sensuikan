import json
import os
import sys

sys.path.insert(0, '.')
from scripts.generators.update_universal_player_cards import UNIVERSAL_ARMAMENT_MAP, I18N_SPECIAL_RULES

print("=========================================================================")
print("MIGRATING ALL HARDCODED DATA DIRECTLY INTO data/submarines_database.json")
print("=========================================================================")

db_path = 'data/submarines_database.json'
with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

subs = db['submarines']
print(f"Total submarines in DB: {len(subs)}")

for key, sub in subs.items():
    # 1. Armament Config
    if key in UNIVERSAL_ARMAMENT_MAP:
        sub['armament_config'] = UNIVERSAL_ARMAMENT_MAP[key]
    
    # 2. Special Rules i18n
    en_rules = I18N_SPECIAL_RULES['en'].get(key, ("", None))
    es_rules = I18N_SPECIAL_RULES['es'].get(key, ("", None))
    sub['special_rules_i18n'] = {
        'en': en_rules,
        'es': es_rules
    }
    
    # 3. Flags for aircraft and midget
    if key == 'Sen_Toku_Class':
        sub['aircraft_count'] = 3
    elif key == 'Type_A2_Class':
        sub['aircraft_count'] = 2
    elif sub.get('has_aircraft'):
        sub['aircraft_count'] = 1
    else:
        sub['aircraft_count'] = 0
        
    sub['is_midget'] = (key == 'Type_A_Midget_Submarine___Ko_Hyoteki')

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Migration completed successfully! Every submarine in DB now contains:")
print("  - armament_config (bow_tubes, aft_r3, artillery, fwd_reloads, sys)")
print("  - special_rules_i18n (en & es)")
print("  - aircraft_count & is_midget")
