with open('scripts/generators/generate_canonical_player_cards.py', 'rb') as f:
    data = f.read()

# Replace the broken string
target = b'norm = (lbl + " " + sub).replace("\r\n", " ").strip()'
if target in data:
    data = data.replace(target, b'norm = (lbl + " " + sub).replace("\\n", " ").strip()')
    print("Replaced CRLF broken target!")
else:
    target2 = b'norm = (lbl + " " + sub).replace("\n", " ").strip()'
    if target2 in data:
        data = data.replace(target2, b'norm = (lbl + " " + sub).replace("\\n", " ").strip()')
        print("Replaced LF broken target!")
    else:
        print("Target not found directly, let's regex search")
        import re
        data = re.sub(b'norm = \\(lbl \\+ " " \\+ sub\\)\\.replace\\("[^"]*?", " "\\)\\.strip\\(\\)',
                      b'norm = (lbl + " " + sub).replace("\\\\n", " ").strip()', data)

with open('scripts/generators/generate_canonical_player_cards.py', 'wb') as f:
    f.write(data)

print("Fixed line 89.")
