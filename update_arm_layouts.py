import json

with open('data/submarines_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for sname, sdata in db['submarines'].items():
    arm = sdata.get('armament_layout', {})
    cap = sdata.get('reload_capacity', 0)
    if cap > 0:
        r3 = list(arm.get('r3', [None]*4))
        r5 = list(arm.get('r5', [None]*4))
        # Move items from r5 cols 2,3 to r3 cols 2,3 if r3 has empty slots
        if r5[2] is not None and r3[2] is None:
            r3[2] = r5[2]
            r5[2] = None
        if r5[3] is not None and r3[3] is None:
            r3[3] = r5[3]
            r5[3] = None
        arm['r3'] = r3
        arm['r5'] = r5

with open('data/submarines_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print('Updated data/submarines_database.json armament layouts!')
