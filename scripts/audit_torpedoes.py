import json, re

with open('app/js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SUB_DB = (\{[\s\S]*?\});\s*(?:const|var|let|function|\/\/)', text)
if m:
    data = json.loads(m.group(1))
    for k, v in data['submarines'].items():
        tt = v.get('torpedo_tubes', {})
        rc = v.get('reload_capacity')
        fwd = tt.get('fwd', tt.get('forward', '?'))
        aft = tt.get('aft', '?')
        rld_fwd = tt.get('reloads_fwd', '?')
        rld_aft = tt.get('reloads_aft', '?')
        print(f"{k:35} | Tubes: {fwd} Fwd / {aft} Aft | Reloads: {rld_fwd} Fwd / {rld_aft} Aft | reload_capacity: {rc}")
