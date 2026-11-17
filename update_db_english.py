import json

FAMILY_MAP_EN = {
    "Kaidai (Inicios)": "Early Kaidai Fleet Submarines",
    "Kaidai (Evolución)": "Evolved Kaidai Fleet Submarines",
    "Kaidai (Evoluci\u00f3n)": "Evolved Kaidai Fleet Submarines",
    "Kaidai Final & Especial": "Late Kaidai & Minelayer Class",
    "Junsen (Cruceros I)": "Junsen Cruiser Submarines I",
    "Junsen II & Mando": "Junsen II & Command Submarines",
    "Familia Type B": "Type B Fleet Submarines",
    "Ataque Pesado (Nodrizas)": "Heavy Attack & Carrier Submarines",
    "Supertecnología 44-45": "Advanced Naval Technology (1944–1945)",
    "Supertecnolog\u00eda 44-45": "Advanced Naval Technology (1944–1945)",
    "Operaciones Especiales": "Special Operations Submersibles"
}

SIDE_MAP_EN = {
    "Cara A (Anverso)": "Side A (Front)",
    "Cara B (Reverso)": "Side B (Reverse)"
}

with open('data/submarines_database.json', 'r', encoding='utf-8') as f:
    db = json.load(f)

for sname, sdata in db['submarines'].items():
    dp = sdata.get('duplex_print')
    if dp:
        old_fam = dp.get('family', '')
        old_side = dp.get('side', '')
        dp['family'] = FAMILY_MAP_EN.get(old_fam, old_fam)
        dp['side'] = SIDE_MAP_EN.get(old_side, old_side)

with open('data/submarines_database.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print('Updated data/submarines_database.json duplex_print fields to English!')
