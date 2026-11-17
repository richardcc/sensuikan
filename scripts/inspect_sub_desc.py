with open('app/js/data.js', 'r', encoding='utf-8') as f:
    c = f.read()

import json, re

# Find SUB_DB
idx = c.find('SUB_DB =')
if idx != -1:
    print("Found SUB_DB at:", idx)
    # Let's inspect the keys and special_rules for each sub
    end_idx = c.find(';', idx)
    sub_json_str = c[idx + len('SUB_DB ='):end_idx].strip()
    try:
        sub_db = json.loads(sub_json_str)
        subs = sub_db.get('submarines', {})
        print(f"Total submarines in SUB_DB: {len(subs)}")
        for k, v in subs.items():
            print(f"--- {k} ---")
            print("  class_name:", v.get('class_name'))
            print("  full_title:", v.get('full_title'))
            print("  special_rules:", v.get('special_rules'))
            print("  special_rules_en:", v.get('special_rules_en'))
            print("  special_rules_es:", v.get('special_rules_es'))
    except Exception as e:
        print("JSON parse error:", e)
        # fallback regex
        matches = re.findall(r'"class_name":\s*"([^"]+)"', c)
        print("Classes found:", matches)
