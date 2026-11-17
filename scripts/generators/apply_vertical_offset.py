with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add VERTICAL_OFFSET_MM definition after CARD_H_MM
target_card_h = "CARD_H_MM = 184.0 * BROTHER_COMP"
replacement_card_h = "CARD_H_MM = 184.0 * BROTHER_COMP\nVERTICAL_OFFSET_MM = -1.5 * BROTHER_COMP # Equalize top and bottom margins"

if target_card_h in code and 'VERTICAL_OFFSET_MM' not in code:
    code = code.replace(target_card_h, replacement_card_h, 1)
    print("Added VERTICAL_OFFSET_MM")

# 2. Update oy_c
target_oy_c = "oy_c = (PAGE_H_MM - CARD_H_MM) / 2.0"
replacement_oy_c = "oy_c = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM"
if target_oy_c in code:
    code = code.replace(target_oy_c, replacement_oy_c, 1)
    print("Updated oy_c")

# 3. Update oy
target_oy = "oy = (PAGE_H_MM - CARD_H_MM) / 2.0"
replacement_oy = "oy = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM"
if target_oy in code:
    code = code.replace(target_oy, replacement_oy, 1)
    print("Updated oy")

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved generate_canonical_player_cards.py with vertical offset equalization!")
