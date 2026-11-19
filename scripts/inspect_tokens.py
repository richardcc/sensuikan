import re

with open('app/partials/03_tab_chart_k1.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Match each token div
tokens = re.findall(r'<div id="(token-[^"]+)" class="([^"]+)"([^>]*)>(.*?)</div>', text, re.DOTALL)
print(f"Total tokens matched: {len(tokens)}")
for tid, tclass, tattrs, content in tokens:
    clean_c = ' '.join(content.strip().split())
    print(f"ID: {tid:22} | Class: {tclass:35} | Content: {clean_c}")
