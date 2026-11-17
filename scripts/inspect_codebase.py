import os
import re
import json

print("=== CHECKING APP/INDEX.HTML SECTIONS ===")
with open('app/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print(f"Total index.html size: {len(html):,} chars ({len(html.encode('utf-8')):,} bytes)")
tabs = re.findall(r'<div[^>]*id=["\'](tab-[^"\']+)["\']', html)
print(f"Main tabs found: {tabs}")

# Measure size of each tab
tab_matches = list(re.finditer(r'<div[^>]*id=["\']tab-([^"\']+)["\']', html))
for i in range(len(tab_matches)):
    start = tab_matches[i].start()
    name = tab_matches[i].group(1)
    end = tab_matches[i+1].start() if i+1 < len(tab_matches) else len(html)
    section_len = end - start
    print(f"  - tab-{name}: {section_len:,} chars ({section_len/len(html)*100:.1f}%)")

print("\n=== CHECKING JS FILES SIZES ===")
js_dir = 'app/js'
for f in os.listdir(js_dir):
    p = os.path.join(js_dir, f)
    if os.path.isfile(p):
        print(f"  {f:25}: {os.path.getsize(p):,} bytes")

if os.path.exists('app/i18n.js'):
    print(f"  {'app/i18n.js':25}: {os.path.getsize('app/i18n.js'):,} bytes")

print("\n=== CHECKING ASSETS DUPLICATION ===")
asset_sizes = {}
dup_assets = []
for root, dirs, files in os.walk('app/assets'):
    for file in files:
        full_p = os.path.join(root, file)
        sz = os.path.getsize(full_p)
        if sz in asset_sizes:
            dup_assets.append((full_p, asset_sizes[sz]))
        else:
            asset_sizes[sz] = full_p

print(f"Potential duplicate files by size in app/assets: {len(dup_assets)}")
for p1, p2 in dup_assets[:10]:
    print(f"  {p1} == {p2}")
