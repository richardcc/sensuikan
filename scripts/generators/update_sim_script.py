import os

script_path = "scripts/generators/generate_overlay_simulations.py"
with open(script_path, "r", encoding="utf-8") as f:
    text = f.read()

old_func_start = "def generate_submarine_overlay_simulation():"
old_func_end = "return out_sub_jpg"

idx0 = text.find(old_func_start)
idx1 = text.find(old_func_end, idx0) + len(old_func_end)

new_func = '''def generate_submarine_overlay_simulation():
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
    f_title = ImageFont.truetype("C:\\\\Windows\\\\Fonts\\\\arialbd.ttf", 20)
    f_sub = ImageFont.truetype("C:\\\\Windows\\\\Fonts\\\\arial.ttf", 13)

    bx, by = card_x0 + 10, H - 75
    bw_b = card_x1 - card_x0 - 20
    d_sim.rectangle([bx, by, bx + bw_b, by + 60], fill=(15, 23, 42, 240), outline=(212, 175, 55, 255), width=2)
    d_sim.text((bx + bw_b//2, by + 18), 'SIMULACIÓN REALISTA: CUBIERTA 3D DUAL-LAYER SOBRE TABLERO DE SUBMARINO', fill=(212, 175, 55, 255), font=f_title, anchor='mm')
    d_sim.text((bx + bw_b//2, by + 42), 'Rejilla 3D PLA Negro (2.5 mm) · 73 Alvéolos con rebaje biselado · Fichas encajadas y protegidas contra desplazamiento accidental', fill=(226, 232, 240, 255), font=f_sub, anchor='mm')

    out_sub_jpg = os.path.join(PREV_DIR, "simulation_submarine_dual_layer.jpg")
    sim_board.convert("RGB").save(out_sub_jpg, quality=94)
    print(f"Exported Submarine Dual-Layer Simulation: {out_sub_jpg}")
    return out_sub_jpg'''

text = text[:idx0] + new_func + text[idx1:]
with open(script_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated generate_overlay_simulations.py successfully!")
