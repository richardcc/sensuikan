with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_match_def = '''def match_counter_spec(label, sublabel):
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
    return None'''

new_match_def = '''def match_counter_spec(label, sublabel):
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
        
    # 2. Check flood level stages 1..8 specifically before generic substrings
    for i in range(1, 9):
        if f'flood {i}' in norm or f'fld {i}' in norm or f'nivel {i}' in norm:
            return counters.get(f'flood_level_{i}')
            
    # 3. Match other counters via keywords sorted by length descending
    for cid, spec in counters.items():
        if cid.startswith('flood_level_') or cid == 'torpedo_tube':
            continue
        for kw in sorted(spec.get('keywords', []), key=len, reverse=True):
            if kw.lower() in norm:
                return spec
    return None'''

assert old_match_def in text, 'old_match_def not found'
text = text.replace(old_match_def, new_match_def)

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated match_counter_spec in generate_canonical_player_cards.py!')
