import json
with open('data/submarines_database.json', encoding='utf-8') as f:
    subs = json.load(f)['submarines']
for k, s in subs.items():
    print(f"{k:32} | Tubes: {s.get('torpedo_tubes')} | Reloads: {s.get('reload_capacity')} | Deck Guns: {s.get('deck_guns')}")
