import os
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def crop_and_shift_up(im, crop_top_pct=0.15):
    im = im.convert('RGB')
    w, h = im.size
    arr = np.array(im)
    
    # 1. Trim outer white border
    t, b, l, r = 0, h, 0, w
    thresh = 240
    while t < h // 5 and arr[t, :, :].mean() > thresh: t += 1
    while b > 4 * h // 5 and arr[b - 1, :, :].mean() > thresh: b -= 1
    while l < w // 5 and arr[:, l, :].mean() > thresh: l += 1
    while r > 4 * w // 5 and arr[:, r - 1, :].mean() > thresh: r -= 1
    
    # Also trim if there is a card border (like Kaiten or 25mm gun or Deck gun)
    # Check if there's a frame:
    crop_m = 0
    if t > 0 or b < h or l > 0 or r < w:
        crop_m = 25 # extra margin to remove round frame remnants
        
    t = min(t + crop_m, h // 4)
    b = max(b - crop_m, 3 * h // 4)
    l = min(l + crop_m, w // 4)
    r = max(r - crop_m, 3 * w // 4)
    im = im.crop((l, t, r, b))
    w, h = im.size

    CANVAS_SIZE = 1024
    scaled = im.resize((CANVAS_SIZE, int(h * (CANVAS_SIZE / w))), Image.Resampling.LANCZOS)
    s_w, s_h = scaled.size
    
    canvas = Image.new('RGB', (CANVAS_SIZE, CANVAS_SIZE))
    shift_px = int(CANVAS_SIZE * crop_top_pct)
    
    canvas.paste(scaled, (0, -shift_px))
    
    bot_fill_start = max(0, s_h - shift_px)
    if bot_fill_start < CANVAS_SIZE:
        bot_strip = scaled.crop((0, s_h - 40, s_w, s_h))
        bot_fill = bot_strip.resize((CANVAS_SIZE, CANVAS_SIZE - bot_fill_start), Image.Resampling.BILINEAR)
        canvas.paste(bot_fill, (0, bot_fill_start))
        
    return canvas

batch2 = [
    ('counter_deck_gun_140mm.jpg', '140mm', 'Status', 0.18),
    ('counter_artillery_shell.jpg', 'Ammo', 'x5', 0.14),
    ('counter_seiran_floatplane.jpg', 'Seiran', 'M6A1', 0.16),
    ('counter_contact_mine.jpg', 'Mines', 'x42', 0.15),
    ('counter_battery_cells.jpg', 'Battery', 'Bank 1', 0.12),
    ('counter_fuel_tank.jpg', 'Fuel', 'Tanks', 0.14),
    ('counter_hydrophone_sonar.jpg', 'Hydrophone', 'Sonar', 0.14),
    ('counter_periscope_optics.jpg', 'Periscope', '#1', 0.12),
    ('counter_captain_portrait.jpg', 'Captain', '', 0.10),
    ('counter_xo_portrait.jpg', 'XO', '1st Off.', 0.10),
    ('counter_engineer_portrait.jpg', 'Chief', 'Eng.', 0.10),
    ('counter_navigator_portrait.jpg', 'Navigator', '', 0.10),
]

fig, axes = plt.subplots(6, 4, figsize=(16, 24))

for idx, (fn, l1, l2, pct) in enumerate(batch2):
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
    draw_slot_with_plaque(ax_pre, pre, f'PREPROCESADO: {l1}', 'darkgreen')

plt.tight_layout()
plt.savefig('C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/test_batch2_comparison.png', dpi=150)
print('Saved test_batch2_comparison.png to brain!')
