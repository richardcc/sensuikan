"""
Generates Photorealistic Visual Simulations of the 3D Dual-Layer Overlays over Maps:
1. Operations Map Dual-Layer Simulation:
   - 3D Charcoal PLA Overlay Grid (2.5 mm) with bevels and inner drop shadows.
   - Recessed counter slots showing real station artwork inside.
   - Active Submarine Counters placed in slots (Midway, Pearl, Guadalcanal, Transit...).
   - Large viewing windows for Header, Cartouche Rules, and Classified Seals.
2. Submarine Board Dual-Layer Simulation:
   - Kaidai KD.3 Submarine Sheet with 3D Overlay Grid and raised 3D text.
   - Recessed AI counters (Torpedoes, Flooding, Hull Damage, Crew portraits, Periscope).
3. Save-Game Grate Lid Clamping Demonstration:
   - Shows how the Grate Lid physically locks counters in place for vertical box storage.
Exports high-res simulation renders and embeds them into the Master Design Dossier.
"""

import os
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import matplotlib.pyplot as plt
import matplotlib.patches as patches

MAP_IMG_PATH = "images/mats/operations_map_deluxe_real.jpg"
PREV_DIR = os.path.abspath("images/previews")
DOCS_DIR = os.path.abspath("docs")
os.makedirs(PREV_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

DPI = 300
WIDTH_MM = 241.7
HEIGHT_MM = 185.2
W_PX = int(round(WIDTH_MM * DPI / 25.4))  # 2855 px
H_PX = int(round(HEIGHT_MM * DPI / 25.4)) # 2187 px

def mm_to_px(x_mm, y_mm):
    return int(round(x_mm * DPI / 25.4)), int(round(y_mm * DPI / 25.4))

def create_recessed_pocket_mask(img_w, img_h, pockets_rects, shadow_depth=16):
    """
    Creates an inner shadow mask simulating a 2.5 mm deep pocket recess.
    """
    shadow_layer = Image.new("RGBA", (img_w, img_h), (0, 0, 0, 0))
    d_sh = ImageDraw.Draw(shadow_layer)
    
    for x0, y0, x1, y1 in pockets_rects:
        # Cast inner shadow from top and left inside wall of pocket
        for step in range(shadow_depth):
            alpha = int(140 * (1.0 - step / shadow_depth))
            # Top inner shadow
            d_sh.line([(x0 + step, y0 + step), (x1 - step, y0 + step)], fill=(0, 0, 0, alpha), width=1)
            # Left inner shadow
            d_sh.line([(x0 + step, y0 + step), (x0 + step, y1 - step)], fill=(0, 0, 0, alpha), width=1)
            
        # Subtle light highlight on bottom and right inside edge
        d_sh.line([(x0, y1), (x1, y1)], fill=(255, 255, 255, 90), width=2)
        d_sh.line([(x1, y0), (x1, y1)], fill=(255, 255, 255, 90), width=2)
        
    return shadow_layer

def generate_operations_map_simulation():
    print("Generating Photorealistic Dual-Layer Simulation for Operations Map...")
    
    # 1. Load the finalized Operations Map as base layer
    base_map = Image.open(MAP_IMG_PATH).convert("RGBA")
    
    # 2. Define All 35 Pockets (21 stations + 14 transit steps)
    stations_mm = [
        ('paramushiro', 140.7, 33.2), ('yokosuka', 116.1, 58.5), ('truk', 134.1, 112.2),
        ('new_guinea', 116.0, 132.0), ('dutch_east_indies', 64.8, 143.8), ('aleutian', 198.6, 31.2),
        ('okinawa', 93.8, 77.0), ('iwo_jima', 119.0, 81.6), ('midway', 178.3, 81.6),
        ('philippines', 72.5, 91.0), ('marianas', 112.0, 99.0), ('indian_ocean', 13.7, 107.6),
        ('leyte_gulf', 87.5, 113.0), ('malaya', 28.7, 120.0), ('tarawa', 181.3, 131.2),
        ('guadalcanal', 154.0, 150.4), ('west_coast', 228.3, 54.4), ('pearl_harbor', 216.9, 96.9),
        ('panama_canal', 228.3, 165.9), ('australia', 136.7, 174.2), ('europe', 17.9, 170.7)
    ]
    
    transit_mm = [
        ('wc_t1', 172.5, 54.4), ('wc_t2', 191.0, 54.4), ('wc_t3', 209.5, 54.4),
        ('ph_t1', 180.0, 108.0), ('ph_t2', 198.5, 96.9),
        ('pc_t1', 172.5, 165.9), ('pc_t2', 191.0, 165.9), ('pc_t3', 209.5, 165.9),
        ('aus_t1', 100.0, 154.0), ('aus_t2', 118.5, 160.0),
        ('eu_t4', 92.0, 170.7), ('eu_t3', 73.5, 170.7), ('eu_t2', 55.0, 170.7), ('eu_t1', 36.5, 170.7)
    ]
    
    BOX_SIZE = int(round(15.0 * DPI / 25.4)) # 177 px
    
    pockets_rects = []
    pockets_centers = []
    for sid, mx, my in stations_mm:
        cx, cy = mm_to_px(mx, my)
        pockets_centers.append((sid, cx, cy, "station"))
        pockets_rects.append((cx - BOX_SIZE//2, cy - BOX_SIZE//2, cx + BOX_SIZE//2, cy + BOX_SIZE//2))
        
    for tid, mx, my in transit_mm:
        cx, cy = mm_to_px(mx, my)
        pockets_centers.append((tid, cx, cy, "transit"))
        pockets_rects.append((cx - BOX_SIZE//2, cy - BOX_SIZE//2, cx + BOX_SIZE//2, cy + BOX_SIZE//2))

    # 3. Create 3D PLA Overlay Grid Layer (Matte Dark Charcoal PLA #181E2A)
    # The overlay covers the ocean but leaves open windows for:
    # - Header banner
    # - Player Aid Cartouche
    # - Classified Stamps
    # - And all 35 counter pockets
    overlay_pla = Image.new("RGBA", (W_PX, H_PX), (22, 28, 40, 240))
    d_pla = ImageDraw.Draw(overlay_pla)
    
    # Outer frame bevel
    frame_t = int(round(2.0 * DPI / 25.4))
    d_pla.rectangle([0, 0, W_PX, frame_t], fill=(12, 16, 24, 255))
    d_pla.rectangle([0, H_PX - frame_t, W_PX, H_PX], fill=(12, 16, 24, 255))
    d_pla.rectangle([0, 0, frame_t, H_PX], fill=(12, 16, 24, 255))
    d_pla.rectangle([W_PX - frame_t, 0, W_PX, H_PX], fill=(12, 16, 24, 255))
    
    # Cutout Header Window
    head_h = 135
    head_y0 = frame_t + 2
    d_pla.rectangle([frame_t + 10, head_y0, W_PX - frame_t - 10, head_y0 + head_h], fill=(0, 0, 0, 0))
    
    # Cutout Cartouche Window (Northern China / Siberia)
    cart_x = frame_t + 25
    cart_y = head_y0 + head_h + 18
    cart_w = 1040
    cart_h = 445
    d_pla.rectangle([cart_x, cart_y, cart_x + cart_w, cart_y + cart_h], fill=(0, 0, 0, 0))
    
    # Cutout Classified Stamps Window (under Pearl Harbor)
    d_pla.rectangle([2260, 1310, 2680, 1540], fill=(0, 0, 0, 0))
    
    # Cutout all 35 counter pockets from PLA overlay
    for x0, y0, x1, y1 in pockets_rects:
        d_pla.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, 0))
        
    # Draw beveled grid edges around pockets in PLA
    for x0, y0, x1, y1 in pockets_rects:
        d_pla.rectangle([x0-2, y0-2, x1+2, y1+2], outline=(55, 75, 105, 255), width=2)
        d_pla.rectangle([x0-4, y0-4, x1+4, y1+4], outline=(212, 175, 55, 160), width=1)

    # 4. Composite Overlay on Top of Map
    sim_base = Image.alpha_composite(base_map, overlay_pla)
    
    # 5. Apply Inner Recess Shadows (Simulating 2.5 mm physical depth)
    shadow_layer = create_recessed_pocket_mask(W_PX, H_PX, pockets_rects, shadow_depth=14)
    sim_recessed = Image.alpha_composite(sim_base, shadow_layer)
    
    # 6. Place Active Submarine Counters Inside Selected Pockets to show Save-Game
    print("Placing sample active submarine counters into pockets...")
    draw_sim = ImageDraw.Draw(sim_recessed)
    
    # Counter art samples
    counter_sub_path = "images/counters/ai/counter_transit_patrol.jpg"
    counter_attack_path = "images/counters/ai/counter_patrol_attack.jpg"
    counter_event_path = "images/counters/ai/counter_tactical_event.jpg"
    counter_refit_path = "images/counters/ai/counter_supply_crates.jpg"
    
    def place_counter(cx, cy, img_path, label=""):
        c_sz = BOX_SIZE - 10 # 2mm smaller than pocket
        x0 = cx - c_sz // 2
        y0 = cy - c_sz // 2
        
        # Counter drop shadow inside pocket
        draw_sim.rectangle([x0+4, y0+4, x0+c_sz+4, y0+c_sz+4], fill=(0, 0, 0, 140))
        
        if os.path.exists(img_path):
            c_im = Image.open(img_path).convert("RGBA").resize((c_sz, c_sz), Image.Resampling.LANCZOS)
            sim_recessed.paste(c_im, (x0, y0), c_im)
        else:
            draw_sim.rectangle([x0, y0, x0+c_sz, y0+c_sz], fill=(220, 38, 38, 255))
            
        # Counter border
        draw_sim.rectangle([x0, y0, x0+c_sz, y0+c_sz], outline=(245, 158, 11, 240), width=2)
        if label:
            f_badge = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 20)
            # Small identification badge
            draw_sim.rectangle([x0+2, y0+c_sz-26, x0+c_sz-2, y0+c_sz-2], fill=(15, 23, 42, 230))
            draw_sim.text((cx, y0+c_sz-14), label, fill=(255, 255, 255, 255), font=f_badge, anchor="mm")

    # Place counters in specific active positions:
    # 1. I-168 Submarine at Midway
    cx_mid, cy_mid = mm_to_px(178.3, 81.6)
    place_counter(cx_mid, cy_mid, counter_sub_path, "I-168 [KD.6]")
    
    # 2. I-58 Submarine at Pearl Harbor
    cx_ph, cy_ph = mm_to_px(216.9, 96.9)
    place_counter(cx_ph, cy_ph, counter_attack_path, "I-58 [Type B]")
    
    # 3. Patrol Combat Event at Guadalcanal
    cx_gc, cy_gc = mm_to_px(154.0, 150.4)
    place_counter(cx_gc, cy_gc, counter_event_path, "COMBAT")
    
    # 4. Transit Submarine at West Coast Transit 2
    cx_wc2, cy_wc2 = mm_to_px(191.0, 54.4)
    place_counter(cx_wc2, cy_wc2, counter_sub_path, "I-26 [Transit]")
    
    # 5. Yanagi Mission Submarine at Europe Transit 2
    cx_eu2, cy_eu2 = mm_to_px(55.0, 170.7)
    place_counter(cx_eu2, cy_eu2, counter_sub_path, "I-52 [Yanagi]")
    
    # 6. Fleet Base Tender at Yokosuka
    cx_yo, cy_yo = mm_to_px(116.1, 58.5)
    place_counter(cx_yo, cy_yo, counter_refit_path, "REFIT")

    # 7. Add Explanatory Banner Callouts
    f_callout = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 26)
    f_sub = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 18)
    
    # Callout 1: 3D Dual-Layer Overlay Indicator (Bottom Left)
    bx0, by0 = 60, H_PX - 130
    draw_sim.rectangle([bx0, by0, bx0 + 820, by0 + 95], fill=(15, 23, 42, 245), outline=(212, 175, 55, 255), width=2)
    draw_sim.text((bx0 + 20, by0 + 16), "CUBIERTA TROQUELADA 3D 'DUAL-LAYER' EN POSICIÓN", fill=(212, 175, 55, 255), font=f_callout)
    draw_sim.text((bx0 + 20, by0 + 52), "Grosor 2.5 mm PLA Negro · 35 Alvéolos con rebaje · Fichas bloqueadas contra movimiento", fill=(226, 232, 240, 255), font=f_sub)

    # Callout 2: Save-Game Compatibility Indicator (Bottom Right)
    bx1, by1 = W_PX - 880, H_PX - 130
    draw_sim.rectangle([bx1, by1, bx1 + 820, by1 + 95], fill=(15, 23, 42, 245), outline=(56, 189, 248, 255), width=2)
    draw_sim.text((bx1 + 20, by1 + 16), "SISTEMA 'SAVE-GAME': CIERRE CON TAPA REJILLA", fill=(56, 189, 248, 255), font=f_callout)
    draw_sim.text((bx1 + 20, by1 + 52), "La tapa rejilla presiona las fichas en sus alvéolos permitiendo guardar en vertical", fill=(226, 232, 240, 255), font=f_sub)

    out_sim_jpg = os.path.join(PREV_DIR, "simulation_operations_map_dual_layer.jpg")
    sim_recessed.convert("RGB").save(out_sim_jpg, quality=92)
    print(f"Exported Operations Map Dual-Layer Simulation: {out_sim_jpg}")
    return out_sim_jpg

def generate_submarine_overlay_simulation():
    print("Generating Photorealistic Dual-Layer Simulation for Submarine Board...")
    
    # 1. Load the Kaidai KD.3 Preview Sheet
    kd3_path = "images/subs/preview_canonical_Kaidai_KD3_Class.png"
    if not os.path.exists(kd3_path):
        import fitz
        doc = fitz.open("pdf/sensuikan_canonical_player_cards_compact_18subs.pdf")
        pix = doc[0].get_pixmap(dpi=150)
        pix.save(kd3_path)
        
    base_img = Image.open(kd3_path).convert("RGBA")
    W, H = base_img.size
    dpi = 150

    def mm_to_px(x_mm, y_mm):
        px = int(round((29.5 + x_mm) * dpi / 25.4))
        py = int(round((14.25 + y_mm) * dpi / 25.4))
        return px, py

    slot_sz = int(round(15.0 * dpi / 25.4)) # 89 px

    # Collect all cutout rects matching the 3D printed overlay STL
    slots = []
    windows = []

    # Left base slots (3 slots at X = 10.0: Base, Mission, Port)
    for y in [28.5, 46.5, 64.5]:
        cx, cy = mm_to_px(10.0, y)
        slots.append(('base', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))

    # Patrol track (9 slots)
    for x in np.linspace(28.0, 156.0, 9):
        cx, cy = mm_to_px(x, 64.5)
        slots.append(('patrol', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))

    # Damage tracks (Flood + Hull: 20 slots)
    for x in [10.0] + list(np.linspace(28.0, 156.0, 9)):
        cx, cy = mm_to_px(x, 82.5)
        slots.append(('flood', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))
        cx2, cy2 = mm_to_px(x, 99.5)
        slots.append(('hull', cx2, cy2, cx2 - slot_sz//2, cy2 - slot_sz//2, cx2 + slot_sz//2, cy2 + slot_sz//2))

    # Crew track (14 slots)
    for x in np.linspace(28.0, 156.0, 7):
        cx, cy = mm_to_px(x, 119.5)
        slots.append(('crew1', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))
        cx2, cy2 = mm_to_px(x, 136.5)
        slots.append(('crew2', cx2, cy2, cx2 - slot_sz//2, cy2 - slot_sz//2, cx2 + slot_sz//2, cy2 + slot_sz//2))

    # Right block (Armament, Reloads, Systems)
    col_x = [178.5, 195.0, 211.5, 228.0]
    for y in [14.0, 33.0, 49.8, 69.0]:
        for x in col_x:
            cx, cy = mm_to_px(x, y)
            slots.append(('arm', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))

    for y in [85.8, 102.6]:
        for x in col_x[:2]:
            cx, cy = mm_to_px(x, y)
            slots.append(('arm_sub', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))

    # Forward bay (2x2 reload counters)
    bay_cx, bay_cy = mm_to_px(219.75, 94.2)
    bw = int(round(31.5 * dpi / 25.4))
    bh = int(round(31.8 * dpi / 25.4))
    slots.append(('bay', bay_cx, bay_cy, bay_cx - bw//2, bay_cy - bh//2, bay_cx + bw//2, bay_cy + bh//2))

    # Systems Status (16 slots)
    for y in [122.0, 138.5, 155.0, 171.5]:
        for x in col_x:
            cx, cy = mm_to_px(x, y)
            slots.append(('sys', cx, cy, cx - slot_sz//2, cy - slot_sz//2, cx + slot_sz//2, cy + slot_sz//2))

    # 10 Observation Windows matching STL
    windows_mm = [
        (2.5, 2.5, 163.5, 18.5),       # Title & Specifications
        (20.5, 21.0, 163.5, 52.0),     # Submarine Profile Drawing
        (8.0, 147.5, 163.5, 179.0),    # Special Rules & Notes
        (20.5, 53.2, 163.5, 55.8),     # Patrol Header Bar
        (20.5, 72.6, 163.5, 74.4),     # Damage Header Bar
        (20.5, 108.0, 163.5, 111.0),   # Crew Header Bar
        (171.0, 3.2, 235.5, 5.8),      # Air & Events Header Bar
        (171.0, 22.2, 235.5, 24.8),    # Torpedo Header Bar
        (171.0, 58.1, 235.5, 60.7),    # Artillery Header Bar
        (171.0, 110.9, 235.5, 113.7)   # Systems Header Bar
    ]

    for x0, y0, x1, y1 in windows_mm:
        px0, py0 = mm_to_px(x0, y0)
        px1, py1 = mm_to_px(x1, y1)
        windows.append((px0, py0, px1, py1))

    # Card bounds
    card_x0, card_y0 = mm_to_px(0.0, 0.0)
    card_x1, card_y1 = mm_to_px(238.0, 181.5)

    # 2. Render 3D PLA Overlay Grid Layer (Matte Dark Charcoal PLA)
    overlay_pla = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_pla = ImageDraw.Draw(overlay_pla)
    d_pla.rectangle([card_x0, card_y0, card_x1, card_y1], fill=(24, 30, 42, 246))
    d_pla.rectangle([card_x0, card_y0, card_x1, card_y1], outline=(15, 20, 30, 255), width=3)

    # Clear all cutouts (slots + windows)
    all_cutouts = [(s[3], s[4], s[5], s[6]) for s in slots] + windows
    for x0, y0, x1, y1 in all_cutouts:
        d_pla.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, 0))

    # 3. Render 3D Beveled Inner Drop Shadows (2.5 mm depth effect)
    shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d_sh = ImageDraw.Draw(shadow_layer)
    depth_px = 6

    for x0, y0, x1, y1 in all_cutouts:
        for step in range(depth_px):
            alpha = int(140 * (1.0 - step / depth_px))
            d_sh.line([(x0 + step, y0 + step), (x1 - step, y0 + step)], fill=(0, 0, 0, alpha), width=1)
            d_sh.line([(x0 + step, y0 + step), (x0 + step, y1 - step)], fill=(0, 0, 0, alpha), width=1)
        d_sh.line([(x0, y1), (x1, y1)], fill=(255, 255, 255, 70), width=1)
        d_sh.line([(x1, y0), (x1, y1)], fill=(255, 255, 255, 70), width=1)

    # Composite layers
    sim_board = Image.alpha_composite(base_img, overlay_pla)
    sim_board = Image.alpha_composite(sim_board, shadow_layer)
    d_sim = ImageDraw.Draw(sim_board)

    # 4. Place Sample Active AI Counters into Exact Recessed Slots (Proper 1:1 Scale)
    c_torpedo = "images/counters/ai/counter_twin_torpedoes_rack.jpg"
    c_flood = "images/counters/ai/counter_flood_level_2.jpg"
    c_hull = "images/counters/ai/counter_hull_damage_level_3.jpg"
    c_captain = "images/counters/ai/counter_captain_portrait.jpg"
    c_xo = "images/counters/ai/counter_engineer_portrait.jpg"
    c_peri = "images/counters/ai/counter_periscope.jpg"

    def place_sub_counter(cx, cy, img_path):
        if os.path.exists(img_path):
            c_sz = slot_sz - 4 # 2px gap around counter
            cim = Image.open(img_path).convert("RGBA").resize((c_sz, c_sz), Image.Resampling.LANCZOS)
            x0 = cx - c_sz // 2
            y0 = cy - c_sz // 2
            d_sim.rectangle([x0+2, y0+2, x0+c_sz+2, y0+c_sz+2], fill=(0, 0, 0, 160))
            sim_board.paste(cim, (x0, y0), cim)
            d_sim.rectangle([x0, y0, x0+c_sz, y0+c_sz], outline=(245, 158, 11, 230), width=1)

    # Tubes 1 & 2 loaded
    place_sub_counter(*mm_to_px(col_x[0], 33.0), c_torpedo)
    place_sub_counter(*mm_to_px(col_x[1], 33.0), c_torpedo)

    # Flood 1 & Hull 1
    place_sub_counter(*mm_to_px(np.linspace(28.0, 156.0, 9)[0], 82.5), c_flood)
    place_sub_counter(*mm_to_px(np.linspace(28.0, 156.0, 9)[0], 99.5), c_hull)

    # Captain & XO in crew slots
    crew_x = np.linspace(28.0, 156.0, 7)
    place_sub_counter(*mm_to_px(crew_x[0], 119.5), c_captain)
    place_sub_counter(*mm_to_px(crew_x[1], 119.5), c_xo)

    # Periscope in Systems Status
    place_sub_counter(*mm_to_px(col_x[0], 171.5), c_peri)

    # 5. Technical Callout Banner
    f_title = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 20)
    f_sub = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 13)

    bx, by = card_x0 + 10, H - 75
    bw_b = card_x1 - card_x0 - 20
    d_sim.rectangle([bx, by, bx + bw_b, by + 60], fill=(15, 23, 42, 240), outline=(212, 175, 55, 255), width=2)
    d_sim.text((bx + bw_b//2, by + 18), 'SIMULACIÓN REALISTA: CUBIERTA 3D DUAL-LAYER SOBRE TABLERO DE SUBMARINO', fill=(212, 175, 55, 255), font=f_title, anchor='mm')
    d_sim.text((bx + bw_b//2, by + 42), 'Rejilla 3D PLA Negro (2.5 mm) · 73 Alvéolos con rebaje biselado · Fichas encajadas y protegidas contra desplazamiento accidental', fill=(226, 232, 240, 255), font=f_sub, anchor='mm')

    out_sub_jpg = os.path.join(PREV_DIR, "simulation_submarine_dual_layer.jpg")
    sim_board.convert("RGB").save(out_sub_jpg, quality=94)
    print(f"Exported Submarine Dual-Layer Simulation: {out_sub_jpg}")
    return out_sub_jpg

def generate_sandwich_assembly_diagram():
    print("Generating Comprehensive Save-Game Sandwich Assembly Diagram...")
    
    fig = plt.figure(figsize=(11.69, 8.27), dpi=180)
    fig.patch.set_facecolor('#0B1120')
    ax = fig.add_subplot(111)
    ax.set_facecolor('#0B1120')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    
    ax.text(50, 95.5, "SISTEMA SANDWICH DUAL-LAYER: MAPA DE OPERACIONES Y SUBMARINOS", color='#F59E0B', fontsize=14, fontweight='bold', ha='center')
    ax.text(50, 91.5, "Arquitectura de 5 Capas Compatibles con la Tapa Rejilla Save-Game (sensuikan_save_game_grate_lid.stl)", color='#94A3B8', fontsize=9.0, ha='center')
    
    # Left Column: Operations Map Dual Layer (0 to 48)
    sim_op_path = os.path.join(PREV_DIR, "simulation_operations_map_dual_layer.jpg")
    if os.path.exists(sim_op_path):
        im_op = Image.open(sim_op_path)
        ax_op = fig.add_axes([0.04, 0.40, 0.44, 0.46])
        ax_op.imshow(im_op)
        ax_op.axis('off')
        
    ax.text(26, 36.5, "1. MAPA DE OPERACIONES (SAVE-GAME)", color='#FCD34D', fontsize=11, fontweight='bold', ha='center')
    op_desc = (
        "• Bandeja Base Inferior (1.2 mm suelo + pestaña perimetral).\n"
        "• Lámina de Mapa Impresa a 300 DPI (241.7 x 185.2 mm).\n"
        "• Cubierta Troquelada 3D (sensuikan_operations_map_top_overlay.stl):\n"
        "  - 35 Alvéolos cuadrados de 15.3 mm para submarinos y tránsitos.\n"
        "  - Ventanas de lectura para Doctrina de Combate y Sellos.\n"
        "• Tapa Rejilla Save-Game con gomas elásticas: bloquea las 35 fichas."
    )
    ax.text(6, 32.5, op_desc, color='#E2E8F0', fontsize=7.8, va='top')
    
    # Right Column: Submarine Board Dual Layer (52 to 96)
    sim_sub_path = os.path.join(PREV_DIR, "simulation_submarine_dual_layer.jpg")
    if os.path.exists(sim_sub_path):
        im_sb = Image.open(sim_sub_path)
        ax_sb = fig.add_axes([0.52, 0.40, 0.44, 0.46])
        ax_sb.imshow(im_sb)
        ax_sb.axis('off')
        
    ax.text(74, 36.5, "2. TABLERO DE SUBMARINO ACTIVO (SAVE-GAME)", color='#FCD34D', fontsize=11, fontweight='bold', ha='center')
    sub_desc = (
        "• Ficha de Submarino en Cartulina 200g (241.7 x 185.2 mm).\n"
        "• Cubierta Troquelada Monolítica (sensuikan_top_overlay_with_raised_text.stl):\n"
        "  - Alvéolos de 2.5 mm con textos 3D en relieve integrados.\n"
        "  - Huecos para torpedos, tubos, daños, inundación y oficiales.\n"
        "• Compatibilidad Total: Ambas cubiertas usan el mismo perímetro exterior,\n"
        "  permitiendo cerrar indistintamente cualquier tablero con la tapa rejilla."
    )
    ax.text(54, 32.5, sub_desc, color='#E2E8F0', fontsize=7.8, va='top')
    
    # Bottom Banner: Total Height and Box Storage
    ax.add_patch(patches.Rectangle((4, 3), 92, 10, facecolor='#111827', edgecolor='#D4AF37', lw=1.5))
    ax.text(50, 9.2, "ALTURA TOTAL CON TAPA 'SAVE-GAME': 8.8 mm | MARGEN DISPONIBLE EN CAJA: 46.2 mm", color='#38BDF8', fontsize=9.2, fontweight='bold', ha='center')
    ax.text(50, 5.5, "Almacenamiento seguro garantizado en posición vertical en la estantería: ¡Cero deslizamiento de fichas!", color='#E2E8F0', fontsize=7.5, ha='center')
    
    out_sandwich_jpg = os.path.join(PREV_DIR, "simulation_save_game_sandwich_clamping.jpg")
    fig.savefig(out_sandwich_jpg, bbox_inches='tight', facecolor='#0B1120')
    plt.close(fig)
    print(f"Exported Sandwich Assembly Diagram: {out_sandwich_jpg}")
    return out_sandwich_jpg

if __name__ == "__main__":
    generate_operations_map_simulation()
    generate_submarine_overlay_simulation()
    generate_sandwich_assembly_diagram()
