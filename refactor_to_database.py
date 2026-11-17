import os
import json

with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_block_start = 'def get_icon_for_slot(label, sublabel):'
old_block_end = 'def draw_card_slot(ax, cx, cy, label="", sublabel="", bg=\'#F8FAFC\', border=\'#334155\','

idx_start = text.find(old_block_start)
idx_end = text.find(old_block_end)

assert idx_start != -1, 'old_block_start not found'
assert idx_end != -1, 'old_block_end not found'

new_block = '''_COUNTERS_DB = None
def get_counters_db():
    global _COUNTERS_DB
    if _COUNTERS_DB is None:
        db_path = 'data/counters_database.json'
        if os.path.exists(db_path):
            with open(db_path, 'r', encoding='utf-8') as f:
                _COUNTERS_DB = json.load(f)
        else:
            _COUNTERS_DB = {'counters': {}}
    return _COUNTERS_DB

def match_counter_spec(label, sublabel):
    lbl = (label or '').strip()
    sub = (sublabel or '').strip()
    norm = (lbl + ' ' + sub).replace('\\n', ' ').strip().lower()
    lbl_clean = lbl.replace('\\n', ' ').strip().lower()
    
    db = get_counters_db()
    counters = db.get('counters', {})
    
    # 1. Torpedo tube digits
    if lbl.strip().isdigit() and 1 <= int(lbl.strip()) <= 8:
        return counters.get('torpedo_tube')
    if lbl_clean.startswith('t-'):
        return counters.get('torpedo_tube')
        
    # 2. Match via parameterized keywords
    for cid, spec in counters.items():
        if cid == 'torpedo_tube':
            continue
        for kw in spec.get('keywords', []):
            if kw.lower() in norm:
                return spec
    return None

def get_icon_for_slot(label, sublabel):
    lbl = (label or '').strip()
    if lbl in ['N/A', '• N/A •']:
        return None, None, None
    spec = match_counter_spec(label, sublabel)
    if spec:
        return spec.get('icon'), spec.get('icon_tint', '#3E4A56'), 0.32
    return None, None, None

_REALISTIC_COUNTER_IMGS = {}

def get_realistic_counter_img(label, sublabel):
    spec = match_counter_spec(label, sublabel)
    if not spec:
        return None
    target_file = spec.get('image_file')
    if not target_file:
        return None
        
    if target_file not in _REALISTIC_COUNTER_IMGS:
        base_name = os.path.splitext(target_file)[0]
        # Prioritize preprocessed AI realistic artwork so subject sits 100% above bottom text plaque
        ai_candidates = [
            os.path.join('images/counters/ai/preprocessed', base_name + '.jpg'),
            os.path.join('images/counters/ai/preprocessed', base_name + '.png'),
            os.path.join('images/counters/ai', base_name + '.jpg'),
            os.path.join('images/counters/ai', base_name + '.png'),
            os.path.join('images/counters/realistic', target_file),
            os.path.join('images/counters/realistic', base_name + '.jpg')
        ]
        chosen_path = next((c for c in ai_candidates if os.path.exists(c)), None)
        if chosen_path:
            _REALISTIC_COUNTER_IMGS[target_file] = np.array(Image.open(chosen_path).convert('RGBA'))
        else:
            _REALISTIC_COUNTER_IMGS[target_file] = None
    return _REALISTIC_COUNTER_IMGS[target_file]

'''

text = text[:idx_start] + new_block + text[idx_end:]

text = text.replace(
    'meta = SHIPYARD_METADATA.get(key, {',
    'meta = sub.get("shipyard_metadata") or SHIPYARD_METADATA.get(key, {'
)
text = text.replace(
    'arm_cfg = SUBMARINE_ARMAMENT_MAP.get(key, {})',
    'arm_cfg = sub.get("armament_layout") or SUBMARINE_ARMAMENT_MAP.get(key, {})'
)
text = text.replace(
    'capacity = RELOAD_CAPACITIES.get(key, 0)',
    'capacity = sub.get("reload_capacity", RELOAD_CAPACITIES.get(key, 0))'
)

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('generate_canonical_player_cards.py successfully refactored to use data/counters_database.json and data/submarines_database.json!')
