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

fig, axes = plt.subplots(18, 1, figsize=(16, 24))

for idx, fn in enumerate(vassal_files):
    p = os.path.join('images/vassal', fn)
    im = Image.open(p)
    w, h = im.size
    # Crop crew status
    crew_crop = im.crop((int(w * 0.08), int(h * 0.65), int(w * 0.65), int(h * 0.82)))
    axes[idx].imshow(crew_crop)
    axes[idx].set_ylabel(fn.replace('.jpg', ''), fontsize=8, rotation=0, labelpad=80, va='center', weight='bold')
    axes[idx].set_xticks([])
    axes[idx].set_yticks([])

plt.tight_layout()
out_p = 'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/all_18_vassal_crew_tracks.png'
plt.savefig(out_p, dpi=150)
print('Saved all_18_vassal_crew_tracks.png!')
