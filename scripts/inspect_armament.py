import json, re

with open('app/js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'const SUB_DB = (\{[\s\S]*?\});\s*(?:const|var|let|function|\/\/)', text)
if m:
    data = json.loads(m.group(1))
    for k, v in data['submarines'].items():
        al = v.get('armament_layout', {})
        print(f"=== {k} ===")
        print("  torpedo_tubes:", v.get('torpedo_tubes'))
        print("  reload_capacity:", v.get('reload_capacity'))
        for rk in sorted(al.keys()):
            row = [item[0].replace('\n', ' ') if item else '---' for item in al[rk]]
            print(f"  {rk}: {row}")
