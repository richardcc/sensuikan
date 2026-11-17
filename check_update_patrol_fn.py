with open('app/js/gameflow_phase2.js', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('function updatePatrolPhaseUI()')
print(code[idx:])
