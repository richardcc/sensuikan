with open('app/js/i18n_ui.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('applyKeyedTranslations')
print("i18n_ui.js around applyKeyedTranslations:")
print(code[max(0, idx-100):idx+800])

with open('app/i18n.js', 'r', encoding='utf-8') as f:
    code2 = f.read()

idx2 = code2.find('applyKeyedTranslations')
print("i18n.js around applyKeyedTranslations:")
print(code2[max(0, idx2-100):idx2+1200])
