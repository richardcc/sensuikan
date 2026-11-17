import json

with open('data/counters_database.json', 'r', encoding='utf-8') as f:
    cdb = json.load(f)

for i in range(1, 9):
    cid = f'flood_level_{i}'
    cdb['counters'][cid] = {
        'id': cid,
        'name': f'Flooding Stage {i} (Nivel {i})',
        'category': 'damage',
        'keywords': [f'flood {i}', f'fld {i}', f'inundacion {i}', f'nivel {i}'],
        'image_file': f'counter_flood_level_{i}.png',
        'icon': 'naval_pressure_gauge',
        'icon_tint': '#2A5B86',
        'plaque_style': 'badge_top_left',
        'default_label': f'Flood {i}',
        'default_sublabel': '',
        'badge_number': str(i),
        'shift_pct': 0.0,
        'extra_crop': 0
    }

with open('data/counters_database.json', 'w', encoding='utf-8') as f:
    json.dump(cdb, f, indent=2, ensure_ascii=False)

print('Added flood_level_1..8 to counters_database.json!')
