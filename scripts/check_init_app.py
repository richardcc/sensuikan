with open('app/js/ui.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function initApp')
print(text[idx:idx+800])
