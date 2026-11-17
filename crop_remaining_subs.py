import os
from PIL import Image

subs = [
    'Kirai-Sen Class.jpg',
    'Junsen J IM Class.jpg',
    'Junsen J2 Class.jpg',
    'Junsen J3 Class.jpg',
    'Type A Class.jpg',
    'Type B Class.jpg',
    'Type B-3 Class.jpg',
    'Type C Class.jpg',
    'Type A Modified.jpg',
    'Sen-Toku Class.jpg',
    'Sen-Taka Class.jpg',
    'Type C3 Class.jpg',
    'Type A Midget Submarine - Ko-Hyoteki.jpg'
]

for fn in subs:
    p = 'images/vassal/' + fn
    im = Image.open(p)
    w, h = im.size
    crop = im.crop((int(w * 0.08), int(h * 0.44), int(w * 0.65), int(h * 0.85)))
    tag = fn.replace(' Class.jpg', '').replace('.jpg', '').replace(' ', '_').replace('-', '_')
    out = f'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/exact_{tag}.png'
    crop.save(out)
    print(f'Saved {out}')
