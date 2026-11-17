with open('app/js/gameflow_phase0.js', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('function commissionSubmarineAndProceed')
print(text[idx+400:idx+900])
