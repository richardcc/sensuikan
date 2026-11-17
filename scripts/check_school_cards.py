with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="f1-title"')
if idx == -1:
    idx = text.find('ESCUELA DE SUBMARINOS (KURE)')
if idx == -1:
    idx = text.find('CHART [F1]')

print(text[idx:idx+1500])
