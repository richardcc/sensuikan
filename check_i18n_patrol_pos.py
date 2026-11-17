with open('app/js/i18n_ui.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('elPPatrolT')
print(code[idx-50:idx+300])
