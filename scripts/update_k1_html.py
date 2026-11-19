import re
import os

token_map = {
    'token-optional': ('Blessings of the Emperor.jpg', 'Blessings of the Emperor'),
    'token-midget-torp': ('Midget Torpedo Gunnery.jpg', 'Midget Torpedo Gunnery'),
    'token-midget-boat': ('Boat Handling.jpg', 'Boat Handling'),
    'token-midget-comms': ('Superior Comms.jpg', 'Superior Comms'),
    'token-air1-weap': ('Weapons Expert.jpg', 'Weapons Expert'),
    'token-air1-maint': ('Aircraft Maint.jpg', 'Aircraft Maint'),
    'token-air1-acm': ('ACM.jpg', 'ACM'),
    'token-air1-nav': ('Aerial Navigation.jpg', 'Aerial Navigation'),
    'token-cap-shibumi': ('Shibumi.jpg', 'Shibumi'),
    'token-cap-leadership': ('Leadership.jpg', 'Leadership'),
    'token-cap-torp': ('Torpedo Gunnery.jpg', 'Torpedo Gunnery'),
    'token-rank': ('Rank.jpg', 'Rank'),
    'token-medal-gk4': ('Order of the Golden Kite 4th.jpg', 'Order of the Golden Kite 4th'),
    'token-medal-rising': ('Order of Rising Sun.jpg', 'Order of Rising Sun'),
    'token-medal-wound': ('Wound Badge.jpg', 'Wound Badge'),
    'token-medal-gea': ('Great East Asia War Medal.jpg', 'Great East Asia War Medal'),
    'token-medal-gk5': ('Order of the Golden Kite 5th.jpg', 'Order of the Golden Kite 5th'),
    'token-medal-sub': ('Submarine School Badge.jpg', 'Submarine School Badge'),
    'token-medal-sacred': ('Order of Sacred Treasure.jpg', 'Order of Sacred Treasure'),
    'token-sub-upgrades': ('New Sub Chance.jpg', 'New Sub Chance'),
    'token-penalty-promo': ('Promotion -2.jpg', 'Promotion -2'),
    'token-maneki-neko': ('Maneki Neko 1.jpg', 'Maneki Neko'),
    'token-at-port': ('Port Yokosuka.jpg', 'Port Yokosuka'),
    'token-air2-weap': ('Weapons Expert.jpg', 'Weapons Expert'),
    'token-air2-maint': ('Aircraft Maint.jpg', 'Aircraft Maint'),
    'token-air2-acm': ('ACM.jpg', 'ACM'),
    'token-air2-nav': ('Aerial Navigation.jpg', 'Aerial Navigation'),
    'token-air3-weap': ('Weapons Expert.jpg', 'Weapons Expert'),
    'token-air3-maint': ('Aircraft Maint.jpg', 'Aircraft Maint'),
    'token-air3-acm': ('ACM.jpg', 'ACM'),
    'token-air3-nav': ('Aerial Navigation.jpg', 'Aerial Navigation'),
    'token-xo-expert': ('Crew Expert - X0.jpg', 'Crew Expert - XO'),
    'token-xo-vigilant': ('Vigilant.jpg', 'Vigilant'),
    'token-xo-deckgun': ('Deck Gun Expert.jpg', 'Deck Gun Expert'),
    'token-xo-aagun': ('AA Expert.jpg', 'AA Expert'),
    'token-eng-expert': ('Crew Expert - Eng.jpg', 'Crew Expert - Eng'),
    'token-eng-mech': ('Mechanical Genius.jpg', 'Mechanical Genius'),
    'token-eng-keen': ('Keen Judgement.jpg', 'Keen Judgement'),
    'token-nav-expert': ('Crew Expert - Nav.jpg', 'Crew Expert - Nav'),
    'token-med-expert': ('Crew Expert - Med.jpg', 'Crew Expert - Med'),
    'token-kaiten-1': ('Kaiten-1.jpg', 'Kaiten Pilot 1'),
    'token-kaiten-2': ('Kaiten-2.jpg', 'Kaiten Pilot 2'),
    'token-kaiten-3': ('Kaiten-3.jpg', 'Kaiten Pilot 3'),
    'token-kaiten-4': ('Kaiten-4.jpg', 'Kaiten Pilot 4'),
    'token-kaiten-5': ('Kaiten-5.jpg', 'Kaiten Pilot 5'),
    'token-kaiten-6': ('Kaiten-6.jpg', 'Kaiten Pilot 6')
}

path = 'app/partials/03_tab_chart_k1.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    full_div = match.group(0)
    tid = match.group(1)
    attrs = match.group(2)
    inner = match.group(3).strip()

    if tid not in token_map:
        return full_div

    img_file, alt_text = token_map[tid]
    
    extra_id = ''
    if tid == 'token-rank':
        extra_id = ' id="k1-rank-chit-img"'
    elif tid.startswith('token-kaiten-'):
        k_num = tid.split('-')[-1]
        extra_id = f' id="img-kaiten-{k_num}"'

    img_tag = f'<img{extra_id} src="assets/tokens/{img_file}" class="k1-chit-img" alt="{alt_text}">'
    new_inner = f'\n              {img_tag}\n              <div class="k1-chit-label-wrap">\n                {inner}\n              </div>\n            '

    return f'<div id="{tid}"{attrs}>{new_inner}</div>'

pattern = re.compile(r'<div id="(token-[^"]+)"([^>]*)>(.*?)</div>', re.DOTALL)
new_content, count = pattern.subn(replacer, content)

print(f"Replaced {count} tokens in {path}.")

with open(path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Saved updated partial.")
