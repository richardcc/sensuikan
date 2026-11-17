import os
from PIL import Image, ImageFilter
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def trim_white_edges(im, thresh=242):
    arr = np.array(im)
    h, w = arr.shape[:2]
    top, bottom, left, right = 0, h, 0, w
    while top < h // 4 and arr[top, :, :].mean() > thresh:
        top += 1
    while bottom > 3 * h // 4 and arr[bottom - 1, :, :].mean() > thresh:
        bottom -= 1
    while left < w // 4 and arr[:, left, :].mean() > thresh:
        left += 1
    while right > 3 * w // 4 and arr[:, right - 1, :].mean() > thresh:
        right -= 1
    if top > 0 or bottom < h or left > 0 or right < w:
        top = min(top + 2, h // 4)
        bottom = max(bottom - 2, 3 * h // 4)
        left = min(left + 2, w // 4)
        right = max(right - 2, 3 * w // 4)
        im = im.crop((left, top, right, bottom))
    return im

def preprocess_image(im, scale=0.72, y_offset=0.03):
    """
    Given a PIL image:
    1. Trim white margin.
    2. Resize canvas to 1024x1024.
    3. Scale content so subject fits nicely in top 65% of canvas (above Y=670).
    4. Fill background seamlessly so there are no white borders or gaps.
    """
    im = trim_white_edges(im)
    w_orig, h_orig = im.size
    
    CANVAS_W, CANVAS_H = 1024, 1024
    
    # Method 1:
    # Scale image to (int(1024 * scale), int(1024 * scale))
    # Place at ( (1024 - new_w)//2, int(1024 * y_offset) )
    # Create background by extending the border pixels of the image or blurred version
    new_w = int(CANVAS_W * scale)
    new_h = int(CANVAS_H * scale)
    scaled = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Base background: sample dominant edge color or blurred stretch
    # We can take im, blur it heavily with GaussianBlur(40), and resize to (1024, 1024)
    blurred_bg = im.resize((1024, 1024), Image.Resampling.BILINEAR).filter(ImageFilter.GaussianBlur(35))
    
    # Paste scaled subject on top
    pos_x = (CANVAS_W - new_w) // 2
    pos_y = int(CANVAS_H * y_offset)
    
    # Create smooth blend mask around scaled image edges so it seamlessly merges with background
    mask = Image.new('L', (new_w, new_h), 255)
    # Feather mask edges
    mask_arr = np.ones((new_h, new_w), dtype=np.float32)
    feather = 20
    for i in range(feather):
        f = i / feather
        mask_arr[i, :] *= f
        mask_arr[new_h - 1 - i, :] *= f
        mask_arr[:, i] *= f
        mask_arr[:, new_w - 1 - i] *= f
    mask = Image.fromarray((mask_arr * 255).astype(np.uint8))
    
    canvas = blurred_bg.copy()
    canvas.paste(scaled, (pos_x, pos_y), mask)
    
    return canvas

# Let's test on 8 images
test_files = [
    'counter_kaiten_sub.jpg',
    'counter_aa_gun_25mm.jpg',
    'counter_aircraft_crane.jpg',
    'counter_radio_transmitter.jpg',
    'counter_dive_planes.jpg',
    'counter_electric_motor.jpg',
    'counter_diesel_engine.jpg',
    'counter_watertight_door.jpg'
]

fig, axes = plt.subplots(4, 4, figsize=(16, 16))

for idx, fn in enumerate(test_files):
    p = os.path.join('images/counters/ai', fn)
    if not os.path.exists(p): continue
    orig = Image.open(p)
    pre = preprocess_image(orig)
    
    # Original
    ax_orig = axes[idx // 2, (idx % 2) * 2]
    ax_orig.imshow(orig)
    h, w = orig.size[1], orig.size[0]
    plaque_h = int(h * 0.35)
    ax_orig.add_patch(patches.Rectangle((0, h - plaque_h), w, plaque_h, facecolor='#0D1520', alpha=0.95))
    ax_orig.text(w/2, h - plaque_h/2, 'TEXT PLAQUE', color='#FFE082', ha='center', va='center', weight='bold', fontsize=12)
    ax_orig.set_title(f'ORIGINAL: {fn}', fontsize=10, color='red')
    ax_orig.axis('off')
    
    # Preprocessed
    ax_pre = axes[idx // 2, (idx % 2) * 2 + 1]
    ax_pre.imshow(pre)
    h2, w2 = pre.size[1], pre.size[0]
    plaque_h2 = int(h2 * 0.35)
    ax_pre.add_patch(patches.Rectangle((0, h2 - plaque_h2), w2, plaque_h2, facecolor='#0D1520', alpha=0.95))
    ax_pre.text(w2/2, h2 - plaque_h2/2, 'TEXT PLAQUE', color='#FFE082', ha='center', va='center', weight='bold', fontsize=12)
    ax_pre.set_title(f'PREPROCESSED: {fn}', fontsize=10, color='green')
    ax_pre.axis('off')

plt.tight_layout()
plt.savefig('test_preprocess_comparison.png', dpi=150)
print('Saved test_preprocess_comparison.png')
