import re

path = 'app/partials/06_tab_compendium.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Marker 1: Start of targets
t1_marker = '        <!-- CHART T1: SMALL FREIGHTER TARGETS (1d100) -->'
# Marker 2: End of targets / Start of schools
schools_marker = '      <!-- SECTION 3: COMMANDER, CREW & RANDOM EVENTS (CHARTS H2, K1, B11) -->\n              <!-- CHARTS F1, F2, F3: SUBMARINE SCHOOLS COMPENDIUM -->'
# Marker 3: Start of B8-B12
b8_marker = '        <!-- CHARTS B8, B9, B10, B12: OPTIONAL COMBAT RULES -->'
# Marker 4: End of comp-sec-combat
end_combat_marker = '      </div><!-- /#comp-sec-combat -->'
# Marker 5: Start of comp-sec-commander
commander_marker = '      <div id="comp-sec-commander" class="compendium-section" data-comp-sec="commander" style="margin-bottom:28px;">'

pos_t1 = text.find(t1_marker)
pos_schools = text.find(schools_marker)
pos_b8 = text.find(b8_marker)
pos_end_combat = text.find(end_combat_marker)
pos_commander = text.find(commander_marker)

print("All markers found:", all(p != -1 for p in [pos_t1, pos_schools, pos_b8, pos_end_combat, pos_commander]))

# Blocks:
# 1. Combat before T1: text[:pos_t1]
# 2. Targets block: text[pos_t1:pos_schools]
# 3. Schools block: text[pos_schools:pos_b8]
# 4. B8-B12 block: text[pos_b8:pos_end_combat]
# 5. Rest of file from pos_commander onwards: text[pos_commander:]

targets_block = text[pos_t1:pos_schools].strip()
schools_block = text[pos_schools:pos_b8].strip()
b8_block = text[pos_b8:pos_end_combat].strip()

# Clean up schools_block from duplicate header comment
schools_block = re.sub(r'^\s*<!-- SECTION 3:.*?-->\s*', '', schools_block)

print("Targets block len:", len(targets_block))
print("Schools block len:", len(schools_block))
print("B8-B12 block len:", len(b8_block))
