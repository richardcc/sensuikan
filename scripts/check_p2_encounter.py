with open('app/js/gameflow_phase2.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function rollBoxEncounter')
print(text[idx:idx+1500])
