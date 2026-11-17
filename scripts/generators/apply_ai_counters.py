with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """    if target_file:
        if target_file not in _REALISTIC_COUNTER_IMGS:
            p = os.path.join('images/counters/realistic', target_file)
            if os.path.exists(p):
                _REALISTIC_COUNTER_IMGS[target_file] = np.array(Image.open(p).convert('RGBA'))
            else:
                _REALISTIC_COUNTER_IMGS[target_file] = None
        return _REALISTIC_COUNTER_IMGS[target_file]
    return None"""

new_block = """    if target_file:
        if target_file not in _REALISTIC_COUNTER_IMGS:
            base_name = os.path.splitext(target_file)[0]
            # Prioritize AI high-definition realistic artwork from images/counters/ai
            ai_candidates = [
                os.path.join('images/counters/ai', base_name + '.jpg'),
                os.path.join('images/counters/ai', base_name + '.png'),
                os.path.join('images/counters/realistic', target_file),
                os.path.join('images/counters/realistic', base_name + '.jpg')
            ]
            chosen_path = next((c for c in ai_candidates if os.path.exists(c)), None)
            if chosen_path:
                _REALISTIC_COUNTER_IMGS[target_file] = np.array(Image.open(chosen_path).convert('RGBA'))
            else:
                _REALISTIC_COUNTER_IMGS[target_file] = None
        return _REALISTIC_COUNTER_IMGS[target_file]
    return None"""

# Normalize CRLF
if old_block in text:
    text = text.replace(old_block, new_block)
    print("Replaced with LF!")
elif old_block.replace('\n', '\r\n') in text:
    text = text.replace(old_block.replace('\n', '\r\n'), new_block.replace('\n', '\r\n'))
    print("Replaced with CRLF!")
else:
    import re
    text = re.sub(r'if target_file:.*?return None\n', new_block + '\n', text, flags=re.DOTALL)
    print("Replaced via regex!")

# Also let's check alpha in draw_card_slot:
text = text.replace('alpha=0.75)', 'alpha=0.82)')

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("generate_canonical_player_cards.py successfully updated to use AI counter images!")
