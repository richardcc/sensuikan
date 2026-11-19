with open('app/partials/02_tab_workflow.html', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
patterns = [
    'id="tab-workflow"',
    'id="phase-content-0"',
    'id="phase-content-school"',
    'id="phase-content-1"',
    'id="phase-content-2"',
    'id="phase-content-patrol"',
    'id="phase-content-3"',
    'id="phase-content-4"',
    'id="phase-content-5"',
    'id="modal-',
]

for i, line in enumerate(lines):
    for p in patterns:
        if p in line:
            print(f"Line {i+1}: {p} -> {line.strip()[:60]}")
