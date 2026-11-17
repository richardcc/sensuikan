with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    c = f.read()

target = "shutil.copy(pdf_out, pdf_target)"
replacement = "shutil.copy(pdf_out, pdf_target)\n        shutil.copy(pdf_out, 'pdf/SENSUAIKAN_CARTAS_18_SUBMARINOS_FINAL_IA.pdf')"
if target in c and 'SENSUAIKAN_CARTAS_18_SUBMARINOS_FINAL_IA.pdf' not in c:
    c = c.replace(target, replacement)
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Added copy successfully")
else:
    print("Already added or target not found")
