import os
from PIL import Image, ImageFilter
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def trim_outer_white(im, thresh=240):
    arr = np.array(im.convert('RGB'))
    h, w = arr.shape[:2]
    t, b, l, r = 0, h, 0, w
    while t < h // 5 and arr[t, :, :].mean() > thresh: t += 1
    while b > 4 * h // 5 and arr[b - 1, :, :].mean() > thresh: b -= 1
    while l < w // 5 and arr[:, l, :].mean() > thresh: l += 1
    while r > 4 * w // 5 and arr[:, r - 1, :].mean() > thresh: r -= 1
    # add small margin
    t = min(t + 2, h // 5)
    b = max(b - 2, 4 * h // 5)
    l = min(l + 2, w // 5)
    r = max(r - 2, 4 * w // 5)
    return im.crop((l, t, r, b))

def create_preprocessed_counter(orig_im, scale=0.72, y_top=30):
    """
    Creates a 1024x1024 preprocessed counter:
    - Subject fits in top 65% (ends before Y=665)
    - Full 1024 width filled with seamless background (NO WHITE BARS!)
    - Bottom 35% filled with matching background (for behind the plaque)
    """
    clean_im = trim_outer_white(orig_im)
    w_clean, h_clean = clean_im.size
    
    CANVAS_SIZE = 1024
    
    # 1. Background generation:
    # Scale clean_im to fill 1024x1024, apply bilateral or heavy gaussian blur so textures & colors match 100%
    bg = clean_im.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    bg_blurred = bg.filter(ImageFilter.GaussianBlur(radius=25))
    
    # 2. Foreground subject:
    # Scaled down to fit width and height
    fg_w = int(CANVAS_SIZE * scale)
    fg_h = int(h_clean * (fg_w / w_clean))
    
    # Check if fg_h + y_top exceeds 640 (we want subject to end by ~630-640)
    if fg_h + y_top > 640:
        fg_h = 640 - y_top
        fg_w = int(w_clean * (fg_h / h_clean))
        
    fg = clean_im.resize((fg_w, fg_h), Image.Resampling.LANCZOS)
    
    # 3. Create feather mask for fg to seamlessly blend into bg_blurred
    fg_arr = np.array(fg.convert('RGBA'))
    mask = np.ones((fg_h, fg_w), dtype=np.float32)
    
    # Soft feather on edges (15px)
    feather = 18
    for i in range(feather):
        factor = np.sin((i / feather) * np.pi / 2) # smooth sinusoidal fade
        mask[i, :] *= factor
        mask[fg_h - 1 - i, :] *= factor
        mask[:, i] *= factor
        mask[:, fg_w - 1 - i] *= factor
        
    mask_im = Image.fromarray((mask * 255).astype(np.uint8))
    
    # Paste centered horizontally
    pos_x = (CANVAS_SIZE - fg_w) // 2
    pos_y = y_top
    
    result = bg_blurred.copy()
    result.paste(fg, (pos_x, pos_y), mask_im)
    return result

test_files = [
    ('counter_kaiten_sub.jpg', 'Kaiten', 'Suicide Torpedo'),
    ('counter_aa_gun_25mm.jpg', '25mm Twin', 'Status #1'),
    ('counter_aircraft_crane.jpg', 'Crane', ''),
    ('counter_radio_transmitter.jpg', 'Radio', ''),
    ('counter_dive_planes.jpg', 'Dive', 'Planes'),
    ('counter_electric_motor.jpg', 'Electric', 'Motor 1'),
    ('counter_diesel_engine.jpg', 'Diesel', 'Engine 1'),
    ('counter_watertight_door.jpg', 'F. Torp.', 'Doors (Odd)')
]

fig, axes = plt.subplots(4, 4, figsize=(16, 16))

for idx, (fn, l1, l2) in enumerate(test_files):
    p = os.path.join('images/counters/ai', fn)
    if not os.path.exists(p): continue
    orig = Image.open(p)
    pre = create_preprocessed_counter(orig)
    
    # Helper to draw plaque
    def draw_slot_with_plaque(ax, im, title, color):
        ax.imshow(im)
        w, h = im.size
        # Plaque is bottom 35%
        p_h = int(h * 0.34)
        p_y = h - p_h - 10
        p_w = w - 24
        p_x = 12
        # Dark navy plaque with gold border & rivets
        ax.add_patch(patches.Rectangle((p_x, p_y), p_w, p_h, facecolor='#0D1520', edgecolor='#C5A059', lw=2, alpha=0.98))
        # rivets
        for rx, ry in [(p_x+10, p_y+10), (p_x+p_w-10, p_y+10), (p_x+10, p_y+p_h-10), (p_x+p_w-10, p_y+p_h-10)]:
            ax.add_patch(patches.Circle((rx, ry), 4, facecolor='#E2B765', edgecolor='#45300E', lw=0.8))
        
        # text
        if l2:
            ax.text(w/2, p_y + p_h*0.68, l1, color='#FAF6ED', ha='center', va='center', weight='bold', fontsize=11)
            ax.text(w/2, p_y + p_h*0.28, l2, color='#E2B765', ha='center', va='center', weight='bold', fontsize=9.5)
        else:
            ax.text(w/2, p_y + p_h*0.5, l1, color='#FAF6ED', ha='center', va='center', weight='bold', fontsize=12)
            
        # Draw 15x15 slot frame
        ax.add_patch(patches.Rectangle((0, 0), w-1, h-1, facecolor='none', edgecolor='#334155', lw=3))
        ax.set_title(title, fontsize=10, color=color, weight='bold')
        ax.axis('off')

    ax_orig = axes[idx // 2, (idx % 2) * 2]
    draw_slot_with_plaque(ax_orig, orig, f'ACTUAL: {l1}', 'red')
    
    ax_pre = axes[idx // 2, (idx % 2) * 2 + 1]
    draw_slot_with_plaque(ax_pre, pre, f'PREPROCESADO: {l1}', 'darkgreen')

plt.tight_layout()
plt.savefig('test_preview_comparison_plaque.png', dpi=150)
print('Saved test_preview_comparison_plaque.png')
