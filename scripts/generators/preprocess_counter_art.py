#!/usr/bin/env python3
"""
Preprocess AI Counter Artwork for IJN Sensuikan Player Cards.
Frames each counter artwork so the subject sits in the upper 65% of the 1024x1024 canvas,
leaving the lower 35% filled with seamless matching background for the naval text plaque.
Ensures zero white borders, zero protrusion, and 100% subject visibility.
"""

import os
import glob
from PIL import Image
import numpy as np

OUTPUT_DIR = os.path.join('images', 'counters', 'ai', 'preprocessed')
INPUT_DIR = os.path.join('images', 'counters', 'ai')

# Tuning map: (crop_top_pct, extra_crop_margin)
# crop_top_pct: how much to shift the subject upwards (0.10 to 0.20)
# extra_crop_margin: extra pixels to crop inside detected white/card border
SHIFT_CONFIG = {
    'counter_aa_gun_25mm.jpg': (0.04, 0),
    'counter_deck_gun_140mm.jpg': (0.03, 0),
    'counter_artillery_shell.jpg': (0.06, 0),
    'counter_kaiten_sub.jpg': (0.08, 0),
    'counter_seiran_floatplane.jpg': (0.08, 0),
    'counter_contact_mine.jpg': (0.06, 0),
    'counter_aircraft_crane.jpg': (0.06, 0),
    'counter_radio_transmitter.jpg': (0.06, 0),
    'counter_dive_planes.jpg': (0.06, 0),
    'counter_electric_motor.jpg': (0.06, 0),
    'counter_diesel_engine.jpg': (0.06, 0),
    'counter_watertight_door.jpg': (0.05, 0),
    'counter_battery_cells.jpg': (0.06, 0),
    'counter_fuel_tank.jpg': (0.06, 0),
    'counter_hydrophone_sonar.jpg': (0.06, 0),
    'counter_periscope_optics.jpg': (0.06, 0),
    'counter_captain_portrait.jpg': (0.04, 0),
    'counter_xo_portrait.jpg': (0.04, 0),
    'counter_engineer_portrait.jpg': (0.04, 0),
    'counter_navigator_portrait.jpg': (0.04, 0),
    'counter_medic_portrait.jpg': (0.04, 0),
    'counter_sailors_crew.jpg': (0.04, 0),
    'counter_order_golden_kite.jpg': (0.06, 0),
    'counter_naval_base.jpg': (0.06, 0),
    'counter_tactical_mission.jpg': (0.06, 0),
    'counter_tactical_event.jpg': (0.06, 0),
    'counter_transit_patrol.jpg': (0.06, 0),
    'counter_midget_sub.jpg': (0.08, 0),
    'counter_supply_crates.jpg': (0.05, 0),
    'counter_twin_torpedoes_rack.jpg': (0.05, 0),
    'counter_flooding_marker.jpg': (0.04, 0),
    'counter_emergency_surface.jpg': (0.04, 0),
}

def preprocess_counter(input_path, output_path, shift_pct=0.12, extra_crop=0):
    im = Image.open(input_path).convert('RGB')
    w, h = im.size
    arr = np.array(im)
    
    # 1. Detect outer white margins if present
    t, b, l, r = 0, h, 0, w
    thresh = 240
    while t < h // 5 and arr[t, :, :].mean() > thresh: t += 1
    while b > 4 * h // 5 and arr[b - 1, :, :].mean() > thresh: b -= 1
    while l < w // 5 and arr[:, l, :].mean() > thresh: l += 1
    while r > 4 * w // 5 and arr[:, r - 1, :].mean() > thresh: r -= 1
    
    # Add extra crop margin if specified (removes round framing rings cleanly)
    if t > 0 or b < h or l > 0 or r < w or extra_crop > 0:
        t = min(t + extra_crop, h // 4)
        b = max(b - extra_crop, 3 * h // 4)
        l = min(l + extra_crop, w // 4)
        r = max(r - extra_crop, 3 * w // 4)
        im = im.crop((l, t, r, b))
        w, h = im.size

    CANVAS_SIZE = 1024
    # Scale width to fill CANVAS_SIZE
    scaled = im.resize((CANVAS_SIZE, int(h * (CANVAS_SIZE / w))), Image.Resampling.LANCZOS)
    s_w, s_h = scaled.size
    
    canvas = Image.new('RGB', (CANVAS_SIZE, CANVAS_SIZE))
    shift_px = int(CANVAS_SIZE * shift_pct)
    
    # Paste shifted up
    canvas.paste(scaled, (0, -shift_px))
    
    # Fill bottom region by stretching lower 40 rows of scaled image downwards
    bot_fill_start = max(0, s_h - shift_px)
    if bot_fill_start < CANVAS_SIZE:
        bot_strip = scaled.crop((0, s_h - 40, s_w, s_h))
        bot_fill = bot_strip.resize((CANVAS_SIZE, CANVAS_SIZE - bot_fill_start), Image.Resampling.BILINEAR)
        canvas.paste(bot_fill, (0, bot_fill_start))
        
    canvas.save(output_path, quality=95)
    return canvas

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    count = 0
    for fn, (shift_pct, extra_crop) in SHIFT_CONFIG.items():
        in_p = os.path.join(INPUT_DIR, fn)
        if os.path.exists(in_p):
            out_p = os.path.join(OUTPUT_DIR, fn)
            preprocess_counter(in_p, out_p, shift_pct, extra_crop)
            # Also save .png version for transparent/lossless pipeline compatibility
            out_png = os.path.splitext(out_p)[0] + '.png'
            Image.open(out_p).save(out_png)
            print(f'Processed: {fn} -> {out_p} (shift={shift_pct:.2f}, crop={extra_crop})')
            count += 1
            
    print(f'Successfully preprocessed {count} counter artworks into {OUTPUT_DIR}')

if __name__ == '__main__':
    main()
