import os
import sys
import json
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

sys.path.insert(0, os.path.abspath('.'))
from scripts.generators.update_universal_player_cards import (
    CARD_W_MM, CARD_H_MM, PAGE_W_MM, PAGE_H_MM, VERTICAL_OFFSET_MM,
    COLS_9_X, RIGHT_COLS_X, I18N_UI, UNIVERSAL_ARMAMENT_MAP, draw_single_card
)

def export_all_cards_for_web():
    out_dir = os.path.join('app', 'assets', 'submarines_cards')
    os.makedirs(out_dir, exist_ok=True)
    
    db_path = 'data/submarines_database.json'
    with open(db_path, 'r', encoding='utf-8') as f:
        subs = json.load(f)['submarines']

    ox = (PAGE_W_MM - CARD_W_MM) / 2.0
    oy = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM

    dpi = 180
    w_px = int(CARD_W_MM / 25.4 * dpi)
    h_px = int(CARD_H_MM / 25.4 * dpi)
    scale_x = w_px / CARD_W_MM
    scale_y = h_px / CARD_H_MM

    print(f"Exporting 36 WebP Submarine Cards ({CARD_W_MM}x{CARD_H_MM}mm -> {w_px}x{h_px}px)...")

    for key, sub in subs.items():
        for lang in ['es', 'en']:
            out_file = os.path.join(out_dir, f"{key}_{lang}.webp")
            fig = plt.figure(figsize=(CARD_W_MM / 25.4, CARD_H_MM / 25.4), dpi=dpi)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(ox, ox + CARD_W_MM)
            ax.set_ylim(oy, oy + CARD_H_MM)
            ax.axis('off')

            draw_single_card(ax, key, sub, lang=lang)

            fig.canvas.draw()
            rgba_buf = np.asarray(fig.canvas.buffer_rgba())
            img = Image.fromarray(rgba_buf).convert('RGB')
            plt.close(fig)

            saved = False
            for attempt in range(5):
                try:
                    img.save(out_file, 'WEBP', quality=86)
                    saved = True
                    break
                except Exception as e:
                    import time
                    time.sleep(0.5)
            if not saved:
                tmp_file = out_file + '.tmp.webp'
                img.save(tmp_file, 'WEBP', quality=86)
                if os.path.exists(out_file):
                    try: os.remove(out_file)
                    except: pass
                os.replace(tmp_file, out_file)
            size_kb = os.path.getsize(out_file) / 1024
            print(f"  -> Saved {out_file} ({size_kb:.1f} KB)")

    # -------------------------------------------------------------
    # 2. UNIVERSAL 3D OVERLAY (ES & EN)
    # -------------------------------------------------------------
    print("\nGenerating Universal 3D Transparent Overlays (ES & EN)...")
    for lang in ['es', 'en']:
        mask_holes = Image.new('L', (w_px, h_px), 0)
        draw_holes = ImageDraw.Draw(mask_holes)

        def mm_to_px(x_mm, y_top_mm):
            return x_mm * scale_x, y_top_mm * scale_y

        def add_slot(cx_mm, cy_top_mm, size=15.0):
            x0, y0 = mm_to_px(cx_mm - size/2.0, cy_top_mm - size/2.0)
            x1, y1 = mm_to_px(cx_mm + size/2.0, cy_top_mm + size/2.0)
            draw_holes.rectangle([x0, y0, x1, y1], fill=255)

        for y_top in [26.0, 44.0, 62.5]: add_slot(10.0, y_top)
        for x in COLS_9_X: add_slot(x, 62.5)
        add_slot(10.0, 83.5); add_slot(10.0, 100.5)
        for x in COLS_9_X: add_slot(x, 83.5); add_slot(x, 100.5)
        for x in [10.0] + list(COLS_9_X[:5]): add_slot(x, 122.5); add_slot(x, 139.5)
        for sy in [122.5, 139.5, 156.5, 173.0]:
            for x in COLS_9_X[5:]: add_slot(x, sy)
        for ry in [14.4, 36.0, 53.4, 75.0, 96.6, 118.2, 135.6, 153.0, 170.4]:
            for tx in RIGHT_COLS_X: add_slot(tx, ry)

        # 3 Observation Windows
        x0, y0 = mm_to_px(2.5, 2.5); x1, y1 = mm_to_px(167.8, 18.5)
        draw_holes.rectangle([x0, y0, x1, y1], fill=255)
        x0, y0 = mm_to_px(20.0, 20.0); x1, y1 = mm_to_px(167.8, 48.5)
        draw_holes.rectangle([x0, y0, x1, y1], fill=255)
        x0, y0 = mm_to_px(3.5, 150.0); x1, y1 = mm_to_px(98.5, 178.5)
        draw_holes.rectangle([x0, y0, x1, y1], fill=255)

        np.random.seed(42)
        noise = np.random.normal(0, 4, (h_px, w_px)).astype(np.float32)
        base_gray = np.clip(32.0 + noise, 24, 45).astype(np.uint8)
        plastic_bgr = cv2.merge([base_gray, base_gray, base_gray])

        mask_arr = np.array(mask_holes)
        dist_out = cv2.distanceTransform(255 - mask_arr, cv2.DIST_L2, 5)
        dist_in = cv2.distanceTransform(mask_arr, cv2.DIST_L2, 5)

        bevel_arr = np.zeros((h_px, w_px, 4), dtype=np.uint8)
        highlight_mask = (dist_out > 0) & (dist_out <= 3.5)
        bevel_arr[highlight_mask] = [255, 255, 255, 60]
        shadow_mask = (dist_in > 0) & (dist_in <= 4.0)
        bevel_arr[shadow_mask] = [0, 0, 0, 140]

        plastic_alpha = np.where(mask_arr > 128, 0, 245).astype(np.uint8)
        plastic_rgba = cv2.cvtColor(plastic_bgr, cv2.COLOR_BGR2RGBA)
        plastic_rgba[:, :, 3] = plastic_alpha

        comp = Image.alpha_composite(Image.fromarray(plastic_rgba), Image.fromarray(bevel_arr))
        draw_comp = ImageDraw.Draw(comp)

        try:
            font_sec = ImageFont.truetype('arialbd.ttf', int(scale_y * 2.2))
        except:
            font_sec = ImageFont.load_default()

        def draw_engraved(x_mm, y_top_mm, text, color=(250, 204, 21, 255)):
            px, py = mm_to_px(x_mm, y_top_mm)
            bbox = font_sec.getbbox(text)
            tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
            tx, ty = px - tw/2.0, py - th/2.0
            draw_comp.text((tx+1, ty+1), text, font=font_sec, fill=(10, 15, 20, 230))
            draw_comp.text((tx, ty), text, font=font_sec, fill=color)

        ui = I18N_UI[lang]
        draw_engraved(93.9, 52.25, ui['patrol_header'])
        draw_engraved(93.9, 73.75, ui['damage_header'])
        draw_engraved(51.95, 111.75, ui['crew_header'])
        draw_engraved(135.4, 111.75, ui['systems_header'], color=(56, 189, 248, 255))
        draw_engraved(203.0, 3.9, ui['aircraft_header'])
        draw_engraved(203.0, 25.5, ui['fwd_tubes_header'])
        draw_engraved(203.0, 64.5, ui['aft_tubes_header'])
        draw_engraved(203.0, 86.1, ui['artillery_header'])
        draw_engraved(203.0, 107.7, ui['reloads_header'])

        out_3d = os.path.join(out_dir, f"overlay_3d_{lang}.webp")
        comp.save(out_3d, 'WEBP', quality=88)
        print(f"  -> Saved {out_3d} ({os.path.getsize(out_3d)/1024:.1f} KB)")

    # -------------------------------------------------------------
    # 3. CANONICAL SLOTS MAPPING JSON
    # -------------------------------------------------------------
    slots_meta = {
        "card_w_mm": CARD_W_MM,
        "card_h_mm": CARD_H_MM,
        "slot_size_mm": 15.0,
        "slot_w_pct": round((15.0 / CARD_W_MM) * 100.0, 4),
        "slot_h_pct": round((15.0 / CARD_H_MM) * 100.0, 4),
        "slots": []
    }

    def register_slot(id_name, cx_mm, cy_top_mm, category, label_es, label_en):
        x_pct = round(((cx_mm - 7.5) / CARD_W_MM) * 100.0, 4)
        y_pct = round(((cy_top_mm - 7.5) / CARD_H_MM) * 100.0, 4)
        slots_meta["slots"].append({
            "id": id_name,
            "category": category,
            "x_pct": x_pct,
            "y_pct": y_pct,
            "cx_mm": cx_mm,
            "cy_mm": cy_top_mm,
            "label_es": label_es,
            "label_en": label_en
        })

    # Base slots
    register_slot("slot-base-current", 10.0, 26.0, "base", "Base Actual", "Current Base")
    register_slot("slot-base-mission", 10.0, 44.0, "base", "Misión Asignada", "Assigned Mission")
    register_slot("slot-base-port", 10.0, 62.5, "base", "En Puerto", "At Port")

    # Patrol track
    for i, x in enumerate(COLS_9_X):
        register_slot(f"slot-patrol-{i+1}", x, 62.5, "patrol", f"Patrulla {i+1}", f"Patrol {i+1}")

    # Damage tracks
    register_slot("slot-flood-marker", 10.0, 83.5, "damage-flood", "Marcador Inundación", "Flooding Marker")
    for i, x in enumerate(COLS_9_X):
        lbl_es = "Superficie" if i == 7 else (f"Inundación {i+1}" if i < 7 else "Inactivo")
        lbl_en = "Surface" if i == 7 else (f"Flood {i+1}" if i < 7 else "Inactive")
        register_slot(f"slot-flood-{i+1}", x, 83.5, "damage-flood", lbl_es, lbl_en)

    register_slot("slot-hull-marker", 10.0, 100.5, "damage-hull", "Marcador Casco", "Hull Damage Marker")
    for i, x in enumerate(COLS_9_X):
        lbl_es = "Hundido" if i == 7 else (f"Casco {i+1}" if i < 7 else "Inactivo")
        lbl_en = "Sunk" if i == 7 else (f"Hull {i+1}" if i < 7 else "Inactive")
        register_slot(f"slot-hull-{i+1}", x, 100.5, "damage-hull", lbl_es, lbl_en)

    # Crew & Systems
    crew_x = [10.0] + list(COLS_9_X[:5])
    crew_r1 = [("capt", "Capitán", "Captain"), ("eng", "Jefe Máq.", "Engineer"), ("xo", "2.º Cmdte.", "XO"), ("nav", "Navegante", "Navigator"), ("med", "Médico", "Medic"), ("spec", "Especial / Piloto", "Specialist / Pilot")]
    crew_r2 = [("crew-1", "Dotación 1", "Crew 1"), ("crew-2", "Dotación 2", "Crew 2"), ("crew-3", "Dotación 3", "Crew 3"), ("crew-4", "Dotación 4", "Crew 4"), ("crew-5", "Dotación 5", "Crew 5"), ("quality", "Calidad Tripul.", "Crew Quality")]
    for idx, (cid, es_n, en_n) in enumerate(crew_r1):
        register_slot(f"slot-crew-{cid}", crew_x[idx], 122.5, "crew", es_n, en_n)
    for idx, (cid, es_n, en_n) in enumerate(crew_r2):
        register_slot(f"slot-crew-{cid}", crew_x[idx], 139.5, "crew", es_n, en_n)

    # Systems Status (16 Slots: 4 cols x 4 rows)
    sys_cols = COLS_9_X[5:]
    sys_y_rows = [122.5, 139.5, 156.5, 173.0]
    for idx in range(16):
        r_i = idx // 4
        c_i = idx % 4
        register_slot(f"slot-sys-{idx}", sys_cols[c_i], sys_y_rows[r_i], "system", f"Sistema {idx+1}", f"System {idx+1}")

    # Right block
    # Row 0: Aircraft / Events
    register_slot("slot-air-1", RIGHT_COLS_X[0], 14.4, "aircraft", "Hidroavión / Estado #1", "Aircraft Status #1")
    register_slot("slot-air-2", RIGHT_COLS_X[1], 14.4, "aircraft", "Hidroavión / Estado #2", "Aircraft Status #2")
    register_slot("slot-event-1", RIGHT_COLS_X[2], 14.4, "event", "Evento Aleatorio #1", "Random Event #1")
    register_slot("slot-event-2", RIGHT_COLS_X[3], 14.4, "event", "Evento Aleatorio #2", "Random Event #2")

    # Forward Torpedo Tubes (1..8)
    for i in range(4):
        register_slot(f"slot-tube-{i+1}", RIGHT_COLS_X[i], 36.0, "tube-fwd", f"Tubo Proa {i+1}", f"Bow Tube {i+1}")
    for i in range(4):
        register_slot(f"slot-tube-{i+5}", RIGHT_COLS_X[i], 53.4, "tube-fwd", f"Tubo Proa {i+5}", f"Bow Tube {i+5}")

    # Aft Tubes & Reloads
    for i in range(4):
        register_slot(f"slot-aft-{i+1}", RIGHT_COLS_X[i], 75.0, "tube-aft", f"Popa / Recarga {i+1}", f"Stern / Reload {i+1}")

    # Artillery & Deck Weapons
    art_names_es = ["Cañón Principal", "Munición (x5)", "Antiaéreo 1", "Antiaéreo 2 / Esp."]
    art_names_en = ["Deck Gun", "Ammo (x5)", "AA Gun 1", "AA Gun 2 / Spec"]
    for i in range(4):
        register_slot(f"slot-artillery-{i+1}", RIGHT_COLS_X[i], 96.6, "artillery", art_names_es[i], art_names_en[i])

    # Reloads (1..16)
    rld_y_rows = [118.2, 135.6, 153.0, 170.4]
    for idx in range(16):
        r_i = idx // 4
        c_i = idx % 4
        register_slot(f"slot-reload-{idx+1}", RIGHT_COLS_X[c_i], rld_y_rows[r_i], "reload", f"Recarga {idx+1}", f"Reload {idx+1}")

    slots_json_path = os.path.join('app', 'js', 'submarines_canonical_slots.json')
    with open(slots_json_path, 'w', encoding='utf-8') as f:
        json.dump(slots_meta, f, indent=2)
    print(f"\nSaved slots metadata: {slots_json_path} ({len(slots_meta['slots'])} slots).")

    slots_js_path = os.path.join('app', 'js', 'submarines_canonical_slots.js')
    with open(slots_js_path, 'w', encoding='utf-8') as f:
        f.write('// CANONICAL SUBMARINE SLOTS EMBEDDED DATA\nconst CANONICAL_SLOTS_DATA = ' + json.dumps(slots_meta) + ';\nif (typeof window !== "undefined") { window.CANONICAL_SLOTS_DATA = CANONICAL_SLOTS_DATA; }\n')
    print(f"Saved slots JS: {slots_js_path}.")

if __name__ == '__main__':
    export_all_cards_for_web()
