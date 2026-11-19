import os

src_file = os.path.join('app', 'partials', '02_tab_workflow.html')
with open(src_file, 'r', encoding='utf-8') as f:
    text = f.read()
    lines = text.splitlines(keepends=True)

def find_line_idx(pattern, start=0):
    for i in range(start, len(lines)):
        if pattern in lines[i]:
            return i
    raise ValueError(f"Pattern '{pattern}' not found!")

# Slices:
idx_0 = 0
idx_p0 = find_line_idx('id="phase-content-0"')
idx_school = find_line_idx('id="phase-content-school"')
idx_p1 = find_line_idx('id="phase-content-1"')
idx_p2 = find_line_idx('id="phase-content-2"')
idx_patrol = find_line_idx('id="phase-content-patrol"')
idx_p3 = find_line_idx('id="phase-content-3"')
idx_p4 = find_line_idx('id="phase-content-4"')
idx_p5 = find_line_idx('id="phase-content-5"')
idx_modals_div = find_line_idx('id="modal-sub-upgrade"')

# Note: right before modal-sub-upgrade, lines close .workflow-engine-card and #tab-workflow:
# Let's find where phase-content-5 ends:
# Look backwards from idx_modals_div for the closing </div> of phase-content-5
idx_p5_end = -1
for j in range(idx_modals_div - 1, idx_p5, -1):
    if '</div>' in lines[j] and 'btn-step-next' in lines[j-3]:
        # line j is </div> of action-bar-nav, line j+1 is </div> of phase-content-5
        idx_p5_end = j + 2
        break

if idx_p5_end == -1:
    # fallback
    idx_p5_end = idx_modals_div - 8

print(f"p5_end: line {idx_p5_end+1}: {repr(lines[idx_p5_end-1])}")

# 1. 02_workflow_00_header_stepper.html
part0_text = "".join(lines[idx_0:idx_p0])
# Update stepper item:
old_patrol_step = """          <div id="step-nav-patrol" class="step-item" onclick="setWorkflowPhase('patrol')" title="Atajo: [P] • Encuentros Ordinarios">
            <span class="badge-num">⚓</span>
            <span id="lbl-steppatrol">Patrulla</span>
          </div>"""
new_patrol_step = """          <div id="step-nav-patrol" class="step-item" onclick="setWorkflowPhase('patrol')" title="Atajo: [P] • Encuentro con Aviones [Regla 8.3]">
            <span class="badge-num">✈️</span>
            <span id="lbl-steppatrol">Encuentro con Aviones</span>
          </div>"""
if old_patrol_step in part0_text:
    part0_text = part0_text.replace(old_patrol_step, new_patrol_step)
else:
    # fallback regex / line replacement
    part0_lines = part0_text.splitlines(keepends=True)
    for k, pl in enumerate(part0_lines):
        if 'id="step-nav-patrol"' in pl:
            part0_lines[k+1] = '            <span class="badge-num">✈️</span>\n'
            part0_lines[k+2] = '            <span id="lbl-steppatrol">Encuentro con Aviones</span>\n'
    part0_text = "".join(part0_lines)

# 2. 02_workflow_01_phase0_commission.html
part1_p0 = "".join(lines[idx_p0:idx_school])

# 3. 02_workflow_02_phase_school.html
part2_school = "".join(lines[idx_school:idx_p1])

# 4. 02_workflow_03_phase1_departure.html
part3_p1 = "".join(lines[idx_p1:idx_p2])

# 5. 02_workflow_04_phase2_transit.html
part4_p2 = "".join(lines[idx_p2:idx_patrol])

# 6. 02_workflow_05_phase_air_encounter.html
# Clean patrol section: remove ships branch (Rama 1) and workflow-grid-2
part5_patrol_raw = "".join(lines[idx_patrol:idx_p3])

# In banner:
# Replace title and icon:
part5_patrol_clean = part5_patrol_raw.replace(
    '<span>🔭</span>\n              <span id="ppatrol-title">PATRULLA ORDINARIA (SHIP / AIRCRAFT)</span>',
    '<span>✈️</span>\n              <span id="ppatrol-title">ENCUENTRO CON AVIONES [REGLA 8.3]</span>'
)
# Remove the ship tactical guide button from patrol banner
ship_guide_btn = """              <button type="button" onclick="openShipEncounterWorkflowModal()" class="action-btn" style="padding:4px 12px; font-size:0.82rem; border-color:#10b981; color:#a7f3d0; background:rgba(16,185,129,0.22); display:flex; align-items:center; gap:6px; font-weight:700; cursor:pointer; box-shadow:0 2px 8px rgba(16,185,129,0.3);">
                <span>🚢</span> <span id="ppatrol-top-btn-ship-workflow">Guía Táctica: Ataque Naval [8.1 - 8.2]</span>
              </button>\n"""
part5_patrol_clean = part5_patrol_clean.replace(ship_guide_btn, "")

# Update rules pill:
part5_patrol_clean = part5_patrol_clean.replace(
    '<span id="ppatrol-rules-pill" class="rules-ref-pill">[Reglas 8.1 - 8.3 • Tablas A2, A3, A4, B5, T1-T5]</span>',
    '<span id="ppatrol-rules-pill" class="rules-ref-pill">[Regla 8.3 • Tablas A2, A4, B5, B7, FIDO]</span>'
)

# Remove Rama 1 and workflow-grid-2 wrapper:
# Find start of workflow-grid-2
grid_start = part5_patrol_clean.find('<div class="workflow-grid-2">')
air_branch_start = part5_patrol_clean.find('<!-- RAMA 2: AMENAZA AÉREA')

if grid_start != -1 and air_branch_start != -1:
    # Everything between grid_start and air_branch_start is the grid container and Rama 1!
    # Also find the closing </div> of workflow-grid-2 just before quick navigation actions bar:
    nav_actions_marker = '<!-- Quick Navigation Actions Bar -->'
    nav_pos = part5_patrol_clean.find(nav_actions_marker)
    # The </div> of workflow-grid-2 is right before nav_actions_marker
    grid_end = part5_patrol_clean.rfind('</div>', grid_start, nav_pos)
    
    # We replace from grid_start to air_branch_start with just a clean container or direct flow-card:
    before_grid = part5_patrol_clean[:grid_start]
    air_content = part5_patrol_clean[air_branch_start:grid_end].strip()
    after_grid = part5_patrol_clean[nav_pos:]
    
    part5_patrol_clean = before_grid + "<!-- AMENAZA AÉREA / AIRCRAFT (TABLAS OFICIALES A4 Y A2) -->\n          " + air_content + "\n\n          " + after_grid

# Also update title in flow card from "2. Amenaza Aérea" to "Amenaza Aérea"
part5_patrol_clean = part5_patrol_clean.replace('<span>2. Amenaza Aérea (Encuentro Aéreo)</span>', '<span>Amenaza Aérea y Combate Aeronaval [Regla 8.3]</span>')

# 7. 02_workflow_06_phase3_naval_combat.html
part6_p3 = "".join(lines[idx_p3:idx_p4])

# 8. 02_workflow_07_phase4_damage_repair.html
part7_p4 = "".join(lines[idx_p4:idx_p5])

# 9. 02_workflow_08_phase5_refit.html
part8_p5 = "".join(lines[idx_p5:idx_p5_end])

# 10. 02_workflow_09_modals_footer.html
part9_modals = "".join(lines[idx_p5_end:])

files_to_write = [
    ('02_workflow_00_header_stepper.html', part0_text),
    ('02_workflow_01_phase0_commission.html', part1_p0),
    ('02_workflow_02_phase_school.html', part2_school),
    ('02_workflow_03_phase1_departure.html', part3_p1),
    ('02_workflow_04_phase2_transit.html', part4_p2),
    ('02_workflow_05_phase_air_encounter.html', part5_patrol_clean),
    ('02_workflow_06_phase3_naval_combat.html', part6_p3),
    ('02_workflow_07_phase4_damage_repair.html', part7_p4),
    ('02_workflow_08_phase5_refit.html', part8_p5),
    ('02_workflow_09_modals_footer.html', part9_modals)
]

for fname, content in files_to_write:
    fpath = os.path.join('app', 'partials', fname)
    with open(fpath, 'w', encoding='utf-8') as out:
        out.write(content)
    print(f"Created {fname} ({len(content):,} chars)")

# Archive / remove 02_tab_workflow.html:
backup_path = os.path.join('app', 'partials', '_backup_02_tab_workflow.html.bak')
if os.path.exists(backup_path):
    os.remove(backup_path)
os.rename(src_file, backup_path)
print(f"Renamed {src_file} to backup {backup_path}")
