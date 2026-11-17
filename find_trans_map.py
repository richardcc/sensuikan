import glob
for fn in glob.glob('app/js/*.js'):
    with open(fn, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'UI_TRANSLATIONS' in c:
        print('Found UI_TRANSLATIONS in:', fn)
    if 'getTranslatedText' in c:
        print('Found getTranslatedText in:', fn)
