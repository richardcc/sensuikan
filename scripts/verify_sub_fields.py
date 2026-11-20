import json
import re

with open('app/js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract SUB_DB
idx_start = text.find('const SUB_DB =')
idx_end = text.find('const IJN_COMMANDERS =', idx_start)
sub_db_str = text[idx_start + len('const SUB_DB ='):idx_end].strip()
if sub_db_str.endswith(';'):
    sub_db_str = sub_db_str[:-1]

sub_db = json.loads(sub_db_str)
subs = sub_db['submarines']
print(f"Total submarines in SUB_DB: {len(subs)}")

required_fields = ['class_name', 'full_title', 'available_date', 'patrol_length', 'torpedo_tubes', 'reload_capacity', 'deck_guns', 'stats', 'special_rules']

for k, s in subs.items():
    missing = [f for f in required_fields if f not in s]
    if missing:
        print(f"Sub {k} missing: {missing}")

print("Check completed successfully!")
