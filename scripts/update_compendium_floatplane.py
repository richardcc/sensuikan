import json
import re
import shutil

# 1. Read app/partials/06_tab_compendium.html to get clean es_html
with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_kw = 'id="comp-sec-floatplane"'
start = text.find(start_kw)
start = text.rfind('<div', 0, start)
end_kw = 'id="comp-sec-optional"'
end = text.find(end_kw)
end = text.rfind('<div', 0, end)

es_html = text[start:end].strip()

# Check that es_html does not have the buttons
for item in ['openAircraftDisplayMatModal', 'rollChartP3', 'rollChartP6', 'rollChartP4RearGun', 'resolveChartP4FighterAttack', 'rollChartP5', 'res-interactive-p3', 'res-interactive-p6', 'res-interactive-p4', 'res-interactive-p5']:
    assert item not in es_html, f"Found {item} in es_html!"
print("✓ Verified es_html is completely free of dice and modal buttons.")

# 2. Read app/js/compendium_floatplane_i18n.js to get existing en_html
with open('app/js/compendium_floatplane_i18n.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Extract en string literal
en_match = re.search(r'en:\s*("(?:[^"\\]|\\.)*")', js_content)
if not en_match:
    raise ValueError("Could not find en string in compendium_floatplane_i18n.js")

en_html = json.loads(en_match.group(1))
print(f"Loaded existing en_html ({len(en_html)} chars)")

# Clean en_html:
# A) Remove openAircraftDisplayMatModal if present
en_html = re.sub(r'<button\s+type="button"\s+class="btn-dice"\s+onclick="openAircraftDisplayMatModal\(\)"[^>]*>[\s\S]*?</button>', '', en_html)

# Also check header in EN
# Update title if needed to "8. EMBARKED FLOATPLANE OPERATIONS (CHARTS P3, P4, P5, P6 & RULE 7.17)"
en_html = en_html.replace('7. EMBARKED FLOATPLANE OPERATIONS', '8. EMBARKED FLOATPLANE OPERATIONS')

# B) In Table P3: remove the select, roll button, and res-interactive-p3
en_p3_old = re.search(r'<div style="display:flex; align-items:center; gap:8px;">\s*<select id="p3-mission-phase"[\s\S]*?</button>\s*</div>', en_html)
if en_p3_old:
    en_html = en_html.replace(en_p3_old.group(0), '')
    print("✓ Removed P3 flight phase select & roll button from en_html")

en_res_p3 = re.search(r'<!-- Interactive result P3 -->\s*<div id="res-interactive-p3"[\s\S]*?</div>', en_html)
if en_res_p3:
    en_html = en_html.replace(en_res_p3.group(0), '')
    print("✓ Removed res-interactive-p3 from en_html")

# C) In Table P6: remove roll button and res-interactive-p6
en_p6_btn = re.search(r'<button\s+type="button"\s+class="btn-dice"\s+onclick="rollChartP6\(\)">[\s\S]*?</button>', en_html)
if en_p6_btn:
    en_html = en_html.replace(en_p6_btn.group(0), '')
    print("✓ Removed P6 roll button from en_html")

en_res_p6 = re.search(r'<!-- Interactive result P6 -->\s*<div id="res-interactive-p6"[\s\S]*?</div>', en_html)
if en_res_p6:
    en_html = en_html.replace(en_res_p6.group(0), '')
    print("✓ Removed res-interactive-p6 from en_html")

# D) In Table P4: remove Assault Simulator P4
# The block starts with <!-- Assault Simulator P4 --> or contains id="p4-recon-choice" and ends before <!-- Combat Matrix P4 -->
p4_sim_start = en_html.find('<!-- Assault Simulator P4 -->')
if p4_sim_start == -1:
    p4_sim_start = en_html.find('<div style="background:rgba(30,41,59,0.8);')
p4_matrix_start = en_html.find('<!-- Combat Matrix P4 -->')
if p4_sim_start != -1 and p4_matrix_start != -1:
    en_html = en_html[:p4_sim_start] + en_html[p4_matrix_start:]
    print("✓ Sliced out P4 assault simulator completely from en_html")


# E) In Table P5: remove roll button and res-interactive-p5
en_p5_btn = re.search(r'<button\s+type="button"\s+class="btn-dice"\s+onclick="rollChartP5\(\)">[\s\S]*?</button>', en_html)
if en_p5_btn:
    en_html = en_html.replace(en_p5_btn.group(0), '')
    print("✓ Removed P5 roll button from en_html")

en_res_p5 = re.search(r'<!-- Interactive result P5 -->\s*<div id="res-interactive-p5"[\s\S]*?</div>', en_html)
if en_res_p5:
    en_html = en_html.replace(en_res_p5.group(0), '')
    print("✓ Removed res-interactive-p5 from en_html")

# Verify en_html has no remaining dice or modal buttons
for item in ['openAircraftDisplayMatModal', 'rollChartP3', 'rollChartP6', 'rollChartP4RearGun', 'resolveChartP4FighterAttack', 'rollChartP5', 'res-interactive-p3', 'res-interactive-p6', 'res-interactive-p4', 'res-interactive-p5']:
    assert item not in en_html, f"Found {item} remaining in en_html!"
print("✓ Verified en_html is completely free of dice and modal buttons.")

# Write updated app/js/compendium_floatplane_i18n.js
es_json = json.dumps(es_html, ensure_ascii=False)
en_json = json.dumps(en_html, ensure_ascii=False)

new_js = f"""// Compendium Bilingual Data for Section 7 (Floatplane Charts P3-P6)
window.COMP_FLOATPLANE_HTML = {{
  es: {es_json},
  en: {en_json}
}};
"""

with open('app/js/compendium_floatplane_i18n.js', 'w', encoding='utf-8') as f:
    f.write(new_js)
print("✓ Updated app/js/compendium_floatplane_i18n.js")

# Mirror to app/js/components/compendium_floatplane_i18n.js
shutil.copyfile('app/js/compendium_floatplane_i18n.js', 'app/js/components/compendium_floatplane_i18n.js')
print("✓ Mirrored to app/js/components/compendium_floatplane_i18n.js")
