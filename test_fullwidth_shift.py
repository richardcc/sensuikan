import os
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def crop_and_shift_up(im, crop_top_pct=0.18, scale_subject=0.88):
    """
    Intelligently frames the artwork for a counter with a bottom plaque:
    - Removes artificial outer white generation borders.
    - Shifts/scales the subject into the upper 65% of the 1024x1024 canvas.
    - Preserves full horizontal width edge-to-edge (no fake borders, no blur halo).
    - Extends the lower background texture smoothly downwards behind the plaque.
    """
    im = im.convert('RGB')
    w, h = im.size
    arr = np.array(im)
    
    # 1. Trim outer white border if present (e.g. Kaiten, 25mm gun)
    t, b, l, r = 0, h, 0, w
    thresh = 240
    while t < h // 5 and arr[t, :, :].mean() > thresh: t += 1
    while b > 4 * h // 5 and arr[b - 1, :, :].mean() > thresh: b -= 1
    while l < w // 5 and arr[:, l, :].mean() > thresh: l += 1
    while r > 4 * w // 5 and arr[:, r - 1, :].mean() > thresh: r -= 1
    
    # If trimmed, crop it
    if t > 0 or b < h or l > 0 or r < w:
        im = im.crop((min(l+2, w//5), min(t+2, h//5), max(r-2, 4*w//5), max(b-2, 4*h//5)))
        w, h = im.size
        
    # Also if the image has an inner card frame (like Kaiten or 25mm gun):
    # Let's detect if there is a card border around row/col 40-50
    # Let's test on 1024 canvas:
    CANVAS_SIZE = 1024
    
    # We want the subject to sit from Y ~ 30 to Y ~ 640.
    # Total available height = 610.
    # In original image, subject spans Y_start to Y_end.
    # If we scale original image so its width is CANVAS_SIZE (1024):
    # Then scaled height is CANVAS_SIZE (1024).
    # If we crop the top excess (e.g. top 120-180 px of sky/parchment) and position the rest starting at Y ~ 20:
    # Then row Y in original becomes Y - crop_top.
    # And at the bottom, we need rows up to 1024 to be filled with the bottom edge texture / replication / stretch.
    
    # Let's test scaling by scale_subject (e.g. 0.88 to 0.92) to give nice breathing room,
    # centered horizontally, and aligned so bottom of subject is <= 630.
    
    # Let's test dynamic positioning:
    # Scale width to 1024
    scaled = im.resize((CANVAS_SIZE, int(h * (CANVAS_SIZE / w))), Image.Resampling.LANCZOS)
    s_w, s_h = scaled.size
    
    # Now create canvas
    canvas = Image.new('RGB', (CANVAS_SIZE, CANVAS_SIZE))
    
    # Y-offset: we want to shift up by shift_px
    # If we shift up by shift_px:
    # The image is pasted at (0, -shift_px).
    # What about the bottom area (from s_h - shift_px to 1024)?
    # We replicate or extend the bottom rows of `scaled` downward!
    shift_px = int(CANVAS_SIZE * crop_top_pct)
    
    # If shifting up leaves a gap at the bottom:
    # First, paste scaled at (0, -shift_px)
    canvas.paste(scaled, (0, -shift_px))
    
    # The bottom region from (s_h - shift_px) to 1024 needs to be filled.
    # Take the last 30 rows of scaled and stretch them down to 1024!
    bot_fill_start = max(0, s_h - shift_px)
    if bot_fill_start < CANVAS_SIZE:
        bot_strip = scaled.crop((0, s_h - 40, s_w, s_h))
        bot_fill = bot_strip.resize((CANVAS_SIZE, CANVAS_SIZE - bot_fill_start), Image.Resampling.BILINEAR)
        canvas.paste(bot_fill, (0, bot_fill_start))
        
    return canvas

# Let's test this approach with different crop_top_pct
test_files = [
    ('counter_kaiten_sub.jpg', 'Kaiten', 'Suicide Torpedo', 0.16),
    ('counter_aa_gun_25mm.jpg', '25mm Twin', 'Status #1', 0.18),
    ('counter_aircraft_crane.jpg', 'Crane', '', 0.18),
    ('counter_radio_transmitter.jpg', 'Radio', '', 0.16),
    ('counter_dive_planes.jpg', 'Dive', 'Planes', 0.15),
    ('counter_electric_motor.jpg', 'Electric', 'Motor 1', 0.12),
    ('counter_diesel_engine.jpg', 'Diesel', 'Engine 1', 0.14),
    ('counter_watertight_door.jpg', 'F. Torp.', 'Doors (Odd)', 0.10)
]

fig, axes = plt.subplots(4, 4, figsize=(16, 16))

for idx, (fn, l1, l2, pct) in enumerate(test_files):
    p = os.path.join('images/counters/ai', fn)
    if not os.path.exists(p): continue
    orig = Image.open(p)
    pre = crop_and_shift_up(orig, crop_top_pct=pct)
    
    def draw_slot_with_plaque(ax, im, title, color):
        ax.imshow(im)
        w, h = im.size
        p_h = int(h * 0.34)
        p_y = h - p_h - 10
        p_w = w - 24
        p_x = 12
        ax.add_patch(patches.Rectangle((p_x, p_y), p_w, p_h, facecolor='#0D1520', edgecolor='#C5A059', lw=2, alpha=0.98))
        for rx, ry in [(p_x+10, p_y+10), (p_x+p_w-10, p_y+10), (p_x+10, p_y+p_h-10), (p_x+p_w-10, p_y+p_h-10)]:
            ax.add_patch(patches.Circle((rx, ry), 4, facecolor='#E2B765', edgecolor='#45300E', lw=0.8))
        if l2:
            ax.text(w/2, p_y + p_h*0.68, l1, color='#FAF6ED', ha='center', va='center', weight='bold', fontsize=11)
            ax.text(w/2, p_y + p_h*0.28, l2, color='#E2B765', ha='center', va='center', weight='bold', fontsize=9.5)
        else:
            ax.text(w/2, p_y + p_h*0.5, l1, color='#FAF6ED', ha='center', va='center', weight='bold', fontsize=12)
        ax.add_patch(patches.Rectangle((0, 0), w-1, h-1, facecolor='none', edgecolor='#334155', lw=3))
        ax.set_title(title, fontsize=10, color=color, weight='bold')
        ax.axis('off')

    ax_orig = axes[idx // 2, (idx % 2) * 2]
    draw_slot_with_plaque(ax_orig, orig, f'ACTUAL: {l1}', 'red')
    
    ax_pre = axes[idx // 2, (idx % 2) * 2 + 1]
    draw_slot_with_plaque(ax_pre, pre, f'PREPROCESADO FULL-WIDTH: {l1}', 'darkgreen')

plt.tight_layout()
plt.savefig('C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/test_fullwidth_comparison.png', dpi=150)
print('Saved test_fullwidth_comparison.png to brain!')
