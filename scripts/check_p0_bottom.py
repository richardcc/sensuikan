with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx0 = text.find('id="phase-content-0"')
idx1 = text.find('id="phase-content-school"')
if idx1 == -1:
    idx1 = text.find('id="phase-content-1"')

print(text[idx1-600:idx1])
