with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = 0
end = 0
for i, l in enumerate(lines):
    if 'id="phase-content-2"' in l:
        start = i + 1
    if 'id="phase-content-patrol"' in l:
        end = i + 1

print(f"phase-content-2 runs from line {start} to {end}")
