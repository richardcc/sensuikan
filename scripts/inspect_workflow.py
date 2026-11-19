with open('app/partials/02_tab_workflow.html', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if any(term in line for term in ['id="tab-', 'id="phase-', 'class="phase-', 'switchPhase', 'data-phase', 'FASE ']):
            print(f'{i+1}: {line.strip()[:110]}')
