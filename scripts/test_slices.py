with open('app/partials/02_tab_workflow.html', encoding='utf-8') as f:
    lines = f.readlines()

def find_line(pattern, start=0):
    for idx in range(start, len(lines)):
        if pattern in lines[idx]:
            return idx
    return -1

idx_phase0 = find_line('id="phase-content-0"')
idx_school = find_line('id="phase-content-school"')
idx_phase1 = find_line('id="phase-content-1"')
idx_phase2 = find_line('id="phase-content-2"')
idx_patrol = find_line('id="phase-content-patrol"')
idx_phase3 = find_line('id="phase-content-3"')
idx_phase4 = find_line('id="phase-content-4"')
idx_phase5 = find_line('id="phase-content-5"')
idx_modals = find_line('id="modal-sub-upgrade"')

print(f"phase0: {idx_phase0+1}")
print(f"school: {idx_school+1}")
print(f"phase1: {idx_phase1+1}")
print(f"phase2: {idx_phase2+1}")
print(f"patrol: {idx_patrol+1}")
print(f"phase3: {idx_phase3+1}")
print(f"phase4: {idx_phase4+1}")
print(f"phase5: {idx_phase5+1}")
print(f"modals: {idx_modals+1}")
