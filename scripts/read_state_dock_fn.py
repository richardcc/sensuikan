with open('app/js/state.js', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('function applyDockLanguage')
print(c[idx:idx+1500])
