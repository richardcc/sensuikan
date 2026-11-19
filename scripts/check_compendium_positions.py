import os

path = 'app/partials/06_tab_compendium.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Check positions
t1_marker = '<!-- CHART T1: SMALL FREIGHTER TARGETS (1d100) -->'
schools_marker = '<!-- CHARTS F1, F2, F3: SUBMARINE SCHOOLS COMPENDIUM -->'
b12_marker = '<!-- CHART B12: EVASIVE MANEUVERS -->'
end_combat_marker = '</div><!-- /#comp-sec-combat -->'
commander_marker = '<div id="comp-sec-commander" class="compendium-section" data-comp-sec="commander"'

pos_t1 = text.find(t1_marker)
pos_schools = text.find(schools_marker)
pos_b12 = text.find(b12_marker)
pos_end_combat = text.find(end_combat_marker)
pos_commander = text.find(commander_marker)

print(f"pos_t1: {pos_t1}")
print(f"pos_schools: {pos_schools}")
print(f"pos_b12: {pos_b12}")
print(f"pos_end_combat: {pos_end_combat}")
print(f"pos_commander: {pos_commander}")
