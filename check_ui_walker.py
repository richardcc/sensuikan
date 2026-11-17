with open('app/js/i18n_ui.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('UI_TRANSLATIONS_ES_TO_EN')
print(code[idx:idx+1500])
