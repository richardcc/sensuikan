import json

# Inspect current SUBMARINE_ARMAMENT_MAP from generate_canonical_player_cards.py
with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Find SUBMARINE_ARMAMENT_MAP
start = code.find('SUBMARINE_ARMAMENT_MAP = {')
end = code.find('\n}\n', start) + 2
sub_code = code[start:end]
namespace = {}
exec(sub_code, namespace)
arm_map = namespace['SUBMARINE_ARMAMENT_MAP']

print(f"Total submarines in ARMAMENT_MAP: {len(arm_map)}")
for k, v in arm_map.items():
    print(f"\n--- {k} ---")
    for r in ['r1', 'r2', 'r3', 'r4', 'r5']:
        print(f"  {r}: {v.get(r)}")
    print(f"  sys: {len(v.get('sys', []))} items")
