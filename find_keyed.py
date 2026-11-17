import glob
for fn in glob.glob('app/js/*.js') + glob.glob('app/*.js'):
    with open(fn, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'applyKeyedTranslations' in c:
        print('Found applyKeyedTranslations in:', fn)
