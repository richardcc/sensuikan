with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'rollF2[A-Za-z0-9_]*', text)
for m in matches:
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 200)
    print(f"Match: {text[start:end]}\n---")
