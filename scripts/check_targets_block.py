with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    text = f.read()

t1_marker = '        <!-- CHART T1: SMALL FREIGHTER TARGETS (1d100) -->'
schools_marker = '      <!-- SECTION 3: COMMANDER, CREW & RANDOM EVENTS (CHARTS H2, K1, B11) -->\n              <!-- CHARTS F1, F2, F3: SUBMARINE SCHOOLS COMPENDIUM -->'

idx_t1 = text.find(t1_marker)
idx_schools = text.find(schools_marker)

print(f"idx_t1: {idx_t1}")
print(f"idx_schools: {idx_schools}")
if idx_t1 != -1 and idx_schools != -1:
    targets_block = text[idx_t1:idx_schools]
    print(f"targets_block length: {len(targets_block)}")
    print("starts with:", repr(targets_block[:60]))
    print("ends with:", repr(targets_block[-60:]))
