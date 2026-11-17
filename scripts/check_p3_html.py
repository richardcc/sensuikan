with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Paso 4: Asignación y Disparo')
if idx == -1:
    idx = text.find('Asignación y Disparo de Torpedos')

print(text[idx-50:idx+1200])
