import json

with open('data/submarines_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for k, s in db['submarines'].items():
    if s.get('has_kaiten') or 'kaiten' in s.get('special_rules', '').lower() or s.get('kaiten_note'):
        print(f"{k:30s}: has_kaiten={s.get('has_kaiten')}, kaiten_note={s.get('kaiten_note')}")
