import json

with open('data/submarines_database.json', encoding='utf-8') as f:
    subs = json.load(f)['submarines']

for k, s in subs.items():
    tubes = s.get('torpedo_tubes', {})
    guns = s.get('deck_guns', {})
    reloads = s.get('reload_capacity', 0)
    print(f"Key: {k}")
    print(f"  Class: {s.get('class_name')} ({s.get('full_title')})")
    print(f"  Tubes: Bow={tubes.get('fwd')}, Stern={tubes.get('aft')}, FwdReloads={tubes.get('reloads_fwd')}, AftReloads={tubes.get('reloads_aft')}")
    print(f"  Bay Capacity: {reloads}")
    print(f"  Deck Guns: Main={guns.get('main')}, Ammo={guns.get('ammo')}, AA={guns.get('aa')}")
    print()
