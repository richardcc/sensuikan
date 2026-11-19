import re

with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    text = f.read()

sub = text[141000:158260]
headings = re.findall(r'<h[3-5][^>]*>(.*?)</h[3-5]>', sub, re.DOTALL)
for h in headings:
    # clean tags
    clean = re.sub(r'<[^>]+>', '', h).strip()
    print(clean)
