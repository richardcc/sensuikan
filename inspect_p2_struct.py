with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1012, min(1215, len(lines))):
    line = lines[i]
    for pattern in ['flow-card', '<h4', '<h2', 'action-bar-nav', '<details', 'p2-a2-title', 'p2-a4-title', 'btn-engage-combat', 'p2-btn-next']:
        if pattern in line:
            print(f"{i+1}: {line.strip()[:100]}")
            break
