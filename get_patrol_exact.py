with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    wf = f.read()

idx1 = wf.find('id="phase-content-patrol"')
idx2 = wf.find('<!-- PHASE 3: COMBATE TÁCTICO')
print(wf[idx1:idx2])
