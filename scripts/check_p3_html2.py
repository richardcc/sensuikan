with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Paso 4: Asignación y Disparo')
print(text[idx+700:idx+1600])
