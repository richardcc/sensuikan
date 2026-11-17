import os
from PIL import Image
import numpy as np

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

results = []

for fn in vassal_files:
    p = os.path.join('images/vassal', fn)
    im = Image.open(p)
    w, h = im.size
    
    # 1. Damage Track
    # Crop Flooding row (y from 0.45 to 0.52)
    # The boxes are located starting at ~x=0.10
    # Let's detect vertical black border lines of the boxes in the Flooding row!
    fld_crop = im.crop((int(w * 0.08), int(h * 0.46), int(w * 0.65), int(h * 0.52)))
    arr_fld = np.array(fld_crop.convert('L'))
    # black borders: columns with low intensity across the row
    col_min = arr_fld.min(axis=0)
    col_mean = arr_fld.mean(axis=0)
    
    # Let's save a clear cropped image of both damage and crew
    dmg_p = f'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/audit_vassal_{fn[:10]}.png'
    combo = im.crop((int(w * 0.08), int(h * 0.44), int(w * 0.65), int(h * 0.84)))
    combo.save(dmg_p)

print('Saved audit images!')
