import re

path = 'app/partials/06_tab_compendium.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update filter buttons bar
old_filters = '''          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="action-btn comp-filter-btn active" data-filter="all" data-glow="rgba(234,179,8,0.5)" data-active-bg="rgba(202,138,4,0.35)" onclick="filterCompendium('all')" style="border-color:var(--gold-500); color:var(--gold-300); font-weight:bold; background:rgba(202,138,4,0.35); box-shadow:0 0 12px rgba(234,179,8,0.5); transform:scale(1.04); cursor:pointer;">Todas</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="patrol" data-glow="rgba(59,130,246,0.5)" data-active-bg="rgba(37,99,235,0.35)" onclick="filterCompendium('patrol')" style="border-color:var(--blue-500); color:var(--blue-400); background:transparent; cursor:pointer;">Patrulla (A1-A4)</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="combat" data-glow="rgba(239,68,68,0.5)" data-active-bg="rgba(220,38,38,0.35)" onclick="filterCompendium('combat')" style="border-color:#ef4444; color:#fca5a5; background:transparent; cursor:pointer;">Combate (B1-B7, H1)</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="commander" data-glow="rgba(16,185,129,0.5)" data-active-bg="rgba(5,150,105,0.35)" onclick="filterCompendium('commander')" style="border-color:#10b981; color:#6ee7b7; background:transparent; cursor:pointer;">Comandante (H2, K1)</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="campaign" data-glow="rgba(139,92,246,0.5)" data-active-bg="rgba(124,58,237,0.35)" onclick="filterCompendium('campaign')" style="border-color:#8b5cf6; color:#c4b5fd; background:transparent; cursor:pointer;">Campaña y Refit</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="midget" data-glow="rgba(56,189,248,0.5)" data-active-bg="rgba(2,132,199,0.35)" onclick="filterCompendium('midget')" style="border-color:#38bdf8; color:#38bdf8; background:transparent; cursor:pointer;">Minisubmarinos [M5-M9]</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="kaiten" data-glow="rgba(244,63,94,0.5)" data-active-bg="rgba(225,29,72,0.35)" onclick="filterCompendium('kaiten')" style="border-color:#f43f5e; color:#fda4af; background:transparent; cursor:pointer;">Kaiten [F4, K5, K6]</button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="floatplane" data-glow="rgba(14,165,233,0.5)" data-active-bg="rgba(2,132,199,0.35)" onclick="filterCompendium('floatplane')" style="border-color:#0ea5e9; color:#7dd3fc; background:transparent; cursor:pointer;">Hidroavión [P3-P6]</button>
          </div>'''

new_filters = '''          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="action-btn comp-filter-btn active" data-filter="all" data-glow="rgba(234,179,8,0.5)" data-active-bg="rgba(202,138,4,0.35)" onclick="filterCompendium('all')" style="border-color:var(--gold-500); color:var(--gold-300); font-weight:bold; background:rgba(202,138,4,0.35); box-shadow:0 0 12px rgba(234,179,8,0.5); transform:scale(1.04); cursor:pointer;"><span id="comp-btn-filter-all">Todas</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="patrol" data-glow="rgba(59,130,246,0.5)" data-active-bg="rgba(37,99,235,0.35)" onclick="filterCompendium('patrol')" style="border-color:var(--blue-500); color:var(--blue-400); background:transparent; cursor:pointer;"><span id="comp-btn-filter-patrol">Patrulla (A1-A4)</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="combat" data-glow="rgba(239,68,68,0.5)" data-active-bg="rgba(220,38,38,0.35)" onclick="filterCompendium('combat')" style="border-color:#ef4444; color:#fca5a5; background:transparent; cursor:pointer;"><span id="comp-btn-filter-combat">Combate (B1-B12)</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="targets" data-glow="rgba(168,85,247,0.5)" data-active-bg="rgba(147,51,234,0.35)" onclick="filterCompendium('targets')" style="border-color:#a855f7; color:#d8b4fe; background:transparent; cursor:pointer;"><span id="comp-btn-filter-targets">🎯 Blancos (T1-T5)</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="commander" data-glow="rgba(16,185,129,0.5)" data-active-bg="rgba(5,150,105,0.35)" onclick="filterCompendium('commander')" style="border-color:#10b981; color:#6ee7b7; background:transparent; cursor:pointer;"><span id="comp-btn-filter-commander">Comandante (H2, K1, F1-F3)</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="campaign" data-glow="rgba(139,92,246,0.5)" data-active-bg="rgba(124,58,237,0.35)" onclick="filterCompendium('campaign')" style="border-color:#8b5cf6; color:#c4b5fd; background:transparent; cursor:pointer;"><span id="comp-btn-filter-campaign">Campaña y Refit</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="midget" data-glow="rgba(56,189,248,0.5)" data-active-bg="rgba(2,132,199,0.35)" onclick="filterCompendium('midget')" style="border-color:#38bdf8; color:#38bdf8; background:transparent; cursor:pointer;"><span id="comp-btn-filter-midget">Minisubmarinos [M5-M9]</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="kaiten" data-glow="rgba(244,63,94,0.5)" data-active-bg="rgba(225,29,72,0.35)" onclick="filterCompendium('kaiten')" style="border-color:#f43f5e; color:#fda4af; background:transparent; cursor:pointer;"><span id="comp-btn-filter-kaiten">Kaiten [F4, K5, K6]</span></button>
            <button type="button" class="action-btn comp-filter-btn" data-filter="floatplane" data-glow="rgba(14,165,233,0.5)" data-active-bg="rgba(2,132,199,0.35)" onclick="filterCompendium('floatplane')" style="border-color:#0ea5e9; color:#7dd3fc; background:transparent; cursor:pointer;"><span id="comp-btn-filter-floatplane">Hidroavión [P3-P6]</span></button>
          </div>'''

assert old_filters in text, "old_filters not found!"
text = text.replace(old_filters, new_filters, 1)

# Markers for sections
t1_marker = '        <!-- CHART T1: SMALL FREIGHTER TARGETS (1d100) -->'
schools_marker = '      <!-- SECTION 3: COMMANDER, CREW & RANDOM EVENTS (CHARTS H2, K1, B11) -->\n              <!-- CHARTS F1, F2, F3: SUBMARINE SCHOOLS COMPENDIUM -->'
b8_marker = '        <!-- CHARTS B8, B9, B10, B12: OPTIONAL COMBAT RULES -->'
end_combat_marker = '      </div><!-- /#comp-sec-combat -->'
commander_h3_marker = '        <h3 id="comp-sec3-main-title" style="border-bottom:2px solid #10b981; padding-bottom:6px; color:#34d399; font-family:\'Cinzel\', serif;">👤 3. COMANDANTE, TRIPULACIÓN Y EVENTOS HISTÓRICOS (TABLAS H2, K1, B11)</h3>'

pos_t1 = text.find(t1_marker)
pos_schools = text.find(schools_marker)
pos_b8 = text.find(b8_marker)
pos_end_combat = text.find(end_combat_marker)
pos_comm_h3 = text.find(commander_h3_marker)

assert all(p != -1 for p in [pos_t1, pos_schools, pos_b8, pos_end_combat, pos_comm_h3]), "Missing marker!"

# Extract blocks
combat_part1 = text[:pos_t1]
targets_block = text[pos_t1:pos_schools].strip()
schools_block = text[pos_schools:pos_b8].strip()
schools_block = re.sub(r'^\s*<!-- SECTION 3:.*?-->\s*', '', schools_block)
b8_block = text[pos_b8:pos_end_combat].strip()

after_combat_to_comm_h3 = text[pos_end_combat:pos_comm_h3 + len(commander_h3_marker)]
rest_of_file = text[pos_comm_h3 + len(commander_h3_marker):]

# Construct new content
new_combat_sec = combat_part1 + '        ' + b8_block + '\n      </div><!-- /#comp-sec-combat -->\n\n'

new_targets_sec = '''      <!-- SECTION 3: TARGET DETERMINATION CHARTS (T1 - T5) -->
      <div id="comp-sec-targets" class="compendium-section" data-comp-sec="targets" style="margin-bottom:28px;">
        <h3 id="comp-sec-targets-title" style="border-bottom:2px solid #a855f7; padding-bottom:6px; color:#d8b4fe; font-family:'Cinzel', serif;">🎯 3. TABLAS DE DETERMINACIÓN DE BLANCOS Y BUQUES (CHARTS T1 - T5)</h3>
        
        ''' + targets_block + '''
      </div><!-- /#comp-sec-targets -->\n\n'''

new_commander_h3 = '        <h3 id="comp-sec3-main-title" style="border-bottom:2px solid #10b981; padding-bottom:6px; color:#34d399; font-family:\'Cinzel\', serif;">👤 4. COMANDANTE, TRIPULACIÓN Y ESCUELAS NAVALES (TABLAS H2, K1, F1-F3)</h3>\n\n        ' + schools_block + '\n'

new_commander_sec = '      <div id="comp-sec-commander" class="compendium-section" data-comp-sec="commander" style="margin-bottom:28px;">\n' + new_commander_h3 + rest_of_file

final_text = new_combat_sec + new_targets_sec + new_commander_sec

with open(path, 'w', encoding='utf-8') as f:
    f.write(final_text)

print("Successfully reorganized app/partials/06_tab_compendium.html!")
