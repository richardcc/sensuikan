import os

cards_dir = 'app/assets/submarines_cards'

all_subs = [
    'Kaidai_KD3_Class', 'Kaidai_KD4_Class', 'Kaidai_KD5_Class', 'Kaidai_KD6_Class', 'Kaidai_KD7_Class',
    'Kirai_Sen_Class', 'Junsen_J_IM_Class', 'Junsen_J2_Class', 'Junsen_J3_Class',
    'Type_A_Class', 'Type_B_Class', 'Type_B_3_Class', 'Type_C_Class', 'Type_A_Modified',
    'Sen_Toku_Class', 'Sen_Taka_Class', 'Type_C3_Class', 'Type_A_Midget_Submarine___Ko_Hyoteki',
    'Type_B2_Class', 'Type_C2_Class', 'Type_A2_Class', 'Type_D1_Class', 'Kaichu_VII_Class', 'Junsen_J1_Class'
]

print(f"Total submarines to check: {len(all_subs)}")
missing = []
for sub in all_subs:
    for lang in ['es', 'en']:
        f = os.path.join(cards_dir, f"{sub}_{lang}.webp")
        if not os.path.exists(f):
            missing.append(f)

if missing:
    print(f"Missing {len(missing)} card files:", missing)
else:
    print("✅ All 24 submarines have BOTH 'es' and 'en' .webp card files in app/assets/submarines_cards/!")
