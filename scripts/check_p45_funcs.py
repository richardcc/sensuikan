with open('app/js/gameflow_phase4_5.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'function\s+([A-Za-z0-9_]+)', text))
print("Functions in gameflow_phase4_5.js:")
for m in matches:
    print(f"  {m.group(1)} at {m.start():,}")
