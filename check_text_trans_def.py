with open('app/i18n.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('const TEXT_TRANSLATIONS = {')
print("idx:", idx)
print(code[idx:idx+500])
