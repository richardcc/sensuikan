with open('app/js/ui.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = list(re.finditer(r'function\s+roll[A-Za-z0-9_]*Training[A-Za-z0-9_]*', text))
print("Training functions in ui.js:")
for m in matches:
    print(f"  {m.group(0)} at char {m.start():,}")

idx = text.find('rollCaptainTorpedoTraining')
print(text[idx:idx+1500])
