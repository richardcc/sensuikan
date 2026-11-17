with open('app/i18n.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('TEXT_TRANSLATIONS_BY_LANGUAGE')
print("idx of TEXT_TRANSLATIONS_BY_LANGUAGE:", idx)
print(code[idx:idx+1500])
