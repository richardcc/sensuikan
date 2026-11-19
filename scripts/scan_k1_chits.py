import os

src_dir = r"C:\Users\Richard\OneDrive - UNED\EnBackup\Richard\Juegos Mesa\_Wargames\Sensuikan\Sensuikan-Japanese_Fleet_Submarines_in_WW2_Ver_1.0.0 - copia\images"
files = os.listdir(src_dir)

# Keywords of interest
keywords = [
    'shibumi', 'leader', 'torp', 'gun', 'expert', 'aa', 'acm', 'aerial', 'nav', 'maint', 'weapon',
    'boat', 'comm', 'kite', 'rising', 'sun', 'sacred', 'treasure', 'east asia', 'wound', 'badge',
    'rank', 'promo', 'sub', 'midget', 'seiran', 'kaiten', 'vigilant', 'mech', 'keen', 'scrounger',
    'bold', 'agressive', 'killer', 'blessing', 'emperor', 'hachimaki', 'sennin', 'maneki', 'port'
]

matched = []
for f in files:
    f_low = f.lower()
    for kw in keywords:
        if kw in f_low:
            matched.append(f)
            break

matched.sort()
print(f"Total matched: {len(matched)}")
for m in matched:
    print(m)
