with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="f1-cap-btn"')
print(text[idx-200:idx+600])
