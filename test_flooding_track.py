import os, json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import numpy as np

# Copy images to preprocessed
for i in range(1, 9):
    fn = f'counter_flood_level_{i}.jpg'
    src = os.path.join('images/counters/ai', fn)
    dst_jpg = os.path.join('images/counters/ai/preprocessed', fn)
    dst_png = os.path.join('images/counters/ai/preprocessed', f'counter_flood_level_{i}.png')
    im = Image.open(src)
    im.save(dst_jpg, quality=95)
    im.save(dst_png)

# Test rendering a damage track row of 9 slots
fig, ax = plt.subplots(figsize=(15, 2.5), dpi=150)
ax.set_facecolor('#FAF6ED')

SLOT_SIZE = 15.0
inner = 0.5
img_hw = (SLOT_SIZE - 2*inner) / 2.0

centers = np.linspace(15, 145, 9)

for i in range(8):
    cx = centers[i]
    cy = 12.0
    im = Image.open(f'images/counters/ai/counter_flood_level_{i+1}.jpg')
    # slot frame
    ax.add_patch(patches.Rectangle((cx - 7.5, cy - 7.5), 15, 15, facecolor='#0D1520', edgecolor='#385C7E', lw=1.2))
    # art
    ax.imshow(im, extent=(cx - img_hw, cx + img_hw, cy - img_hw, cy + img_hw), zorder=3.4)
    # top-left naval badge with level number
    bx = cx - img_hw + 2.5
    by = cy + img_hw - 2.5
    ax.add_patch(patches.Circle((bx, by), 2.3, facecolor='#0D1520', edgecolor='#385C7E', lw=0.8, zorder=4.5))
    ax.text(bx, by, str(i+1), fontsize=8, weight='bold', color='#68B2DF', ha='center', va='center', zorder=5)

# Slot 9: Emergency Surface
cx = centers[8]
cy = 12.0
im_surf = Image.open('images/counters/ai/counter_emergency_surface.jpg')
ax.add_patch(patches.Rectangle((cx - 7.5, cy - 7.5), 15, 15, facecolor='#0D1520', edgecolor='#C5A059', lw=1.2))
ax.imshow(im_surf, extent=(cx - img_hw, cx + img_hw, cy - img_hw, cy + img_hw), zorder=3.4)
# Lower plaque: Surface
p_w = 2 * img_hw - 0.4
p_h = 3.8
px = cx - p_w / 2.0
py = cy - img_hw + 0.2
ax.add_patch(patches.Rectangle((px, py), p_w, p_h, facecolor='#0D1520', edgecolor='#C5A059', lw=0.75, zorder=4.5))
ax.text(cx, py + p_h/2.0, "SURFACE", fontsize=4.8, weight='bold', color='#FFE082', ha='center', va='center', zorder=5)

ax.set_xlim(0, 160)
ax.set_ylim(0, 24)
ax.set_aspect('equal')
ax.axis('off')

plt.tight_layout()
plt.savefig('C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/test_flooding_track_ai.png', dpi=150)
print('Saved test_flooding_track_ai.png to brain!')
