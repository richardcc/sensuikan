import re

with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Cover Sheet margin text
text = re.sub(
    r'Sensuikan: Ficha T.*?cnica de Control Naval.*?Oficial',
    'Sensuikan: Submarine Anatomy & Technical Control Sheet • Dai-Nippon Teikoku Kaigun (1941–1945) • Official Tactical Reference & Master Cover Sheet',
    text
)

# Replace Sheet / Hoja in duplex header and footer
text = re.sub(
    r'f"Hoja \{dp\[\'sheet_number\'\]\}/9',
    'f"Sheet {dp[\'sheet_number\']}/9',
    text
)

# Replace footer text
text = re.sub(
    r'Sensuikan Canonical Board.*?Escala 100%',
    "Sensuikan Canonical Board • Sheet {dp['sheet_number']}/9 • {dp['side']} (Page {dp['page_number']:02d}/18) • {dp['family']} • Reverse: {dp['paired_with']} • Double-Sided Print (Flip on Long Edge) • 100% Scale",
    text
)

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated generate_canonical_player_cards.py with English margin texts!')
