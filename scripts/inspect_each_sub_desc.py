with open('app/js/data.js', 'r', encoding='utf-8') as f:
    c = f.read()

import re

# Find each submarine key
keys = [
    'Kaidai_KD3_Class', 'Kaidai_KD4_Class', 'Kaidai_KD5_Class', 'Kaidai_KD6_Class',
    'Kaidai_KD7_Class', 'Kirai_Sen_Class', 'Junsen_J_IM_Class', 'Junsen_J2_Class',
    'Junsen_J3_Class', 'Type_A_Class', 'Type_B_Class', 'Type_B_3_Class',
    'Type_C_Class', 'Type_A_Modified', 'Sen_Toku_Class', 'Sen_Taka_Class',
    'Type_C3_Class', 'Type_A_Midget_Submarine___Ko_Hyoteki'
]

for k in keys:
    pos = c.find(f'"{k}":')
    if pos != -1:
        chunk = c[pos:pos+1500]
        # extract special_rules or notes
        sr = re.search(r'"special_rules":\s*"([^"]+)"', chunk)
        sre = re.search(r'"special_rules_en":\s*"([^"]+)"', chunk)
        sres = re.search(r'"special_rules_es":\s*"([^"]+)"', chunk)
        print(f"\n=== {k} ===")
        print("special_rules:", sr.group(1) if sr else "NONE")
        print("special_rules_en:", sre.group(1) if sre else "NONE")
        print("special_rules_es:", sres.group(1) if sres else "NONE")
