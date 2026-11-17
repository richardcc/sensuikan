import os
from PIL import Image
import numpy as np

# Let's inspect Kaidai KD3..KD7 specifically first
kaidai_files = [
    'Kaidai KD3 Class.jpg',
    'Kaidai KD4 Class.jpg',
    'Kaidai KD5 Class.jpg',
    'Kaidai KD6 Class.jpg',
    'Kaidai KD7 Class.jpg'
]

# Let's check each Kaidai file
for fn in kaidai_files:
    p = os.path.join('images/vassal', fn)
    im = Image.open(p)
    w, h = im.size
    
    # In Kaidai:
    # Damage Track:
    # Flooding row is at y ~ 480 to 530 (out of 992)
    # Let's sample horizontal strip across y=500
    strip_fld = np.array(im.crop((0, 480, w, 530)).convert('L'))
    # Hull row is at y ~ 530 to 580
    strip_hull = np.array(im.crop((0, 530, w, 580)).convert('L'))
    # Crew row is at y ~ 690 to 760
    strip_crew = np.array(im.crop((0, 690, w, 760)).convert('L'))
    
    print(f'=== {fn} ===')
    # Save a high-res crop of the damage track and crew area
    sub_crop = im.crop((int(w * 0.08), int(h * 0.44), int(w * 0.65), int(h * 0.85)))
    sub_crop.save(f'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/audit_{fn[:10]}.png')

print('Done!')
