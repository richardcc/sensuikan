with open('app/js/gameflow_phase3.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'function\s+([A-Za-z0-9_]+)', text))
print("Functions in gameflow_phase3.js:")
for m in matches:
    print(f"  {m.group(1)} at {m.start():,}")

idx = text.find('function fireTorpedoes')
if idx == -1:
    idx = text.find('FIRE')
if idx == -1:
    idx = text.find('function resolve')
print(text[:1200])
