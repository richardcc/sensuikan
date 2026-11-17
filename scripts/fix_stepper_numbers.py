# -*- coding: utf-8 -*-
"""
Fix repeated step numbers in phase-stepper navigation bar.
"""

def fix_workflow_partial():
    path = 'app/partials/02_tab_workflow.html'
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace('<span id="lbl-step0">0: Submarino</span>', '<span id="lbl-step0">Submarino</span>')
    c = c.replace('<span id="lbl-step1">1: Zarpe</span>', '<span id="lbl-step1">Zarpe</span>')
    c = c.replace('<span id="lbl-step2">2: Trayecto</span>', '<span id="lbl-step2">Trayecto</span>')
    c = c.replace('<span id="lbl-step3">3: Combate</span>', '<span id="lbl-step3">Combate</span>')
    c = c.replace('<span id="lbl-step4">4: Averías</span>', '<span id="lbl-step4">Averías</span>')
    c = c.replace('<span id="lbl-step5">5: Refit</span>', '<span id="lbl-step5">Refit</span>')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Updated {path}")

def fix_i18n():
    path = 'app/i18n.js'
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # Spanish phase pills
    old_es = '''    // Phase Pills
    step0: "0: Submarino",
    stepSchool: "Escuelas",
    step1: "1: Zarpe",
    step2: "2: Trayecto",
    step3: "3: Combate",
    step4: "4: Averías",
    step5: "5: Refit",'''

    new_es = '''    // Phase Pills
    step0: "Submarino",
    stepSchool: "Escuelas",
    step1: "Zarpe",
    step2: "Trayecto",
    step3: "Combate",
    step4: "Averías",
    step5: "Refit",'''

    # English phase pills
    old_en = '''    // Phase Pills
    step0: "0: Submarine",
    stepSchool: "Schools",
    step1: "1: Sortie",
    step2: "2: Transit",
    step3: "3: Combat",
    step4: "4: Damage",
    step5: "5: Refit",'''

    new_en = '''    // Phase Pills
    step0: "Submarine",
    stepSchool: "Schools",
    step1: "Sortie",
    step2: "Transit",
    step3: "Combat",
    step4: "Damage",
    step5: "Refit",'''

    if old_es in c:
        c = c.replace(old_es, new_es, 1)
        print("Updated Spanish phase pills in i18n.js")
    else:
        print("ERROR: old_es not found in i18n.js")

    if old_en in c:
        c = c.replace(old_en, new_en, 1)
        print("Updated English phase pills in i18n.js")
    else:
        print("ERROR: old_en not found in i18n.js")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Updated {path}")

if __name__ == '__main__':
    fix_workflow_partial()
    fix_i18n()
