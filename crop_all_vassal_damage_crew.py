import os
import matplotlib.pyplot as plt
from PIL import Image

vassal_files = [
    'Kaidai KD3 Class.jpg',
    'Kaidai KD4 Class.jpg',
    'Kaidai KD5 Class.jpg',
    'Kaidai KD6 Class.jpg',
    'Kaidai KD7 Class.jpg',
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

# Let's write an audit script that crops the exact Damage Track and Crew Status for each sub
out_dir = 'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/audit_vassal_all'
os.makedirs(out_dir, exist_ok=True)

for fn in vassal_files:
    p = os.path.join('images/vassal', fn)
    if not os.path.exists(p):
        print(f'Missing: {p}')
        continue
    im = Image.open(p)
    w, h = im.size
    
    # 1. Damage track: x from 0.05 to 0.70, y from 0.40 to 0.65
    dt_crop = im.crop((int(w * 0.08), int(h * 0.45), int(w * 0.68), int(h * 0.62)))
    # 2. Crew status: x from 0.08 to 0.55, y from 0.62 to 0.88
    crew_crop = im.crop((int(w * 0.08), int(h * 0.62), int(w * 0.55), int(h * 0.88)))
    
    base = os.path.splitext(fn)[0].replace(' ', '_').replace('-', '_')
    dt_crop.save(os.path.join(out_dir, f'{base}_damage.png'))
    crew_crop.save(os.path.join(out_dir, f'{base}_crew.png'))

print('Cropped all 18 Vassal cards!')
