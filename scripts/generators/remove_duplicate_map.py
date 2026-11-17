with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines before: {len(lines)}")
# Find second SUBMARINE_ARMAMENT_MAP
dup_start = -1
dup_end = -1
count = 0
for i, l in enumerate(lines):
    if "SUBMARINE_ARMAMENT_MAP = {" in l:
        count += 1
        if count == 2:
            dup_start = i
    if dup_start != -1 and "RELOAD_CAPACITIES = {" in l:
        dup_end = i
        break

if dup_start != -1 and dup_end != -1:
    print(f"Removing duplicate map from line {dup_start} to {dup_end}")
    new_lines = lines[:dup_start] + lines[dup_end:]
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Total lines after: {len(new_lines)}")
    print("SUCCESS: Duplicate map removed!")
else:
    print(f"ERROR: Could not find duplicate map bounds ({dup_start}, {dup_end})")
