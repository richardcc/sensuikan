with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="phase-content-0"')
print(text[idx:idx+1200])
