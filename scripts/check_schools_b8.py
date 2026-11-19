with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    text = f.read()

schools_marker = '              <!-- CHARTS F1, F2, F3: SUBMARINE SCHOOLS COMPENDIUM -->'
b8_marker = '        <!-- TABLAS B8 A B12: CALIDAD VARIABLE, GIRO CIRCULAR Y EVASIÓN -->'
end_combat_marker = '      </div><!-- /#comp-sec-combat -->'

idx_sch = text.find(schools_marker)
idx_b8 = text.find(b8_marker)
idx_end = text.find(end_combat_marker)

print(f"idx_sch: {idx_sch}")
print(f"idx_b8: {idx_b8}")
print(f"idx_end: {idx_end}")

if idx_sch != -1 and idx_b8 != -1 and idx_end != -1:
    schools_block = text[idx_sch:idx_b8]
    b8_block = text[idx_b8:idx_end]
    print(f"schools_block len: {len(schools_block)}")
    print(f"b8_block len: {len(b8_block)}")
    print("schools_block end:", repr(schools_block[-60:]))
    print("b8_block end:", repr(b8_block[-60:]))
