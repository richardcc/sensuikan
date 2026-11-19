with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    text = f.read()

sub = text[141658:158254]
import re
for m in re.finditer(r'<!--.*?-->', sub, re.DOTALL):
    print(m.group(0)[:80])
