import os
import sys
import json
import textwrap
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import cv2

sys.path.insert(0, os.path.abspath('.'))
from scripts.generators.generate_canonical_player_cards import (
    BROTHER_COMP, PAGE_W_MM, PAGE_H_MM, CARD_W_MM, CARD_H_MM, VERTICAL_OFFSET_MM,
    SLOT_SIZE, draw_card_slot, draw_nautical_chart_border, draw_print_calibration_and_crop_marks,
    draw_confidential_stamp, draw_imperial_hanko, draw_section_header_plaque,
    draw_armament_slot, SHIPYARD_METADATA
)

# 18 Submarines: Complete Universal Layout (Opción 1: Recargas en Columna Derecha, Sistemas Abajo)
UNIVERSAL_ARMAMENT_MAP = {
    "Kaidai_KD3_Class": {
        "bow_tubes": 6,
        "aft_r3": [("7", "Stern / Popa", "tube"), ("8", "Stern / Popa", "tube"), ("Aft\nReload", "Popa", "rld"), ("Aft\nReload", "Popa", "rld")],
        "artillery": [("120mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus", "AA Gun", "aa"), None],
        "fwd_reloads": 8,
        "sys": ["F. Doors", "Aft Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Kaidai_KD4_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "Stern / Popa", "tube"), ("6", "Stern / Popa", "tube"), ("Aft\nReload", "Popa", "rld"), ("Aft\nReload", "Popa", "rld")],
        "artillery": [("120mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus", "AA Gun", "aa"), None],
        "fwd_reloads": 6,
        "sys": ["F. Doors", "Aft Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Kaidai_KD5_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "Stern / Popa", "tube"), ("6", "Stern / Popa", "tube"), ("Aft\nReload", "Popa", "rld"), ("Aft\nReload", "Popa", "rld")],
        "artillery": [("100mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus", "AA Gun", "aa"), ("Kaiten\nCarrier", "Especial", "kai")],
        "fwd_reloads": 6,
        "sys": ["F. Doors", "Aft Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Kaidai_KD6_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "Stern / Popa", "tube"), ("6", "Stern / Popa", "tube"), ("Aft\nReload", "Popa", "rld"), ("Aft\nReload", "Popa", "rld")],
        "artillery": [("100mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus", "AA Gun", "aa"), ("Daihatsu\nLanding", "Carga", "cargo")],
        "fwd_reloads": 6,
        "sys": ["F. Doors", "Aft Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Kaidai_KD7_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("120mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm AA\nStatus #1", "AA Gun", "aa"), ("25mm AA\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 6,
        "sys": ["F. Doors", None, "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Kirai_Sen_Class": {
        "bow_tubes": 4,
        "aft_r3": [("Aft Mine\nDoors", "Popa", "mine_door"), ("Mines\nx42", "Carga", "mines"), None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), None, None],
        "fwd_reloads": 8,
        "sys": ["F. Doors", "Mine Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Mine Handling"]
    },
    "Junsen_J_IM_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus", "AA Gun", "aa"), None],
        "fwd_reloads": 12,
        "sys": ["F. Doors", "Crane", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Junsen_J2_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "Stern / Popa", "tube"), ("6", "Stern / Popa", "tube"), ("Aft\nReload", "Popa", "rld"), ("Aft\nReload", "Popa", "rld")],
        "artillery": [("127mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus", "AA Gun", "aa"), None],
        "fwd_reloads": 9,
        "sys": ["F. Doors", "Aft Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Junsen_J3_Class": {
        "bow_tubes": 4,
        "aft_r3": [("5", "Stern / Popa", "tube"), ("6", "Stern / Popa", "tube"), ("Aft\nReload", "Popa", "rld"), ("Aft\nReload", "Popa", "rld")],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("13.1mm\nStatus #1", "AA Gun", "aa"), ("13.1mm\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 15,
        "sys": ["F. Doors", "Aft Doors", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Crane"]
    },
    "Type_A_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm Twin\nStatus #1", "AA Gun", "aa"), ("25mm Twin\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 12,
        "sys": ["F. Doors", "Crane", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Type_B_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm Twin\nStatus #1", "AA Gun", "aa"), ("25mm Twin\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 11,
        "sys": ["F. Doors", "Crane", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Type_B_3_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm Trip.\nStatus #1", "AA Gun", "aa"), ("25mm Trip.\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 13,
        "sys": ["F. Doors", "Kaiten", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Type_C_Class": {
        "bow_tubes": 8,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm Twin\nStatus #1", "AA Gun", "aa"), ("25mm Twin\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 12,
        "sys": ["F. Doors", None, "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Type_A_Modified": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm AA\nStatus #1", "AA Gun", "aa"), ("25mm AA\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 12,
        "sys": ["F. Doors", "Crane", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Sen_Toku_Class": {
        "bow_tubes": 8,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm Trip.\nStatus #1", "AA Gun", "aa"), ("25mm Trip.\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 12,
        "sys": ["F. Doors", "Crane", "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Sen_Taka_Class": {
        "bow_tubes": 4,
        "aft_r3": [None, None, None, None],
        "artillery": [None, None, ("25mm AA\nStatus #1", "AA Gun", "aa"), ("25mm AA\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 6,
        "sys": ["F. Doors", None, "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Type_C3_Class": {
        "bow_tubes": 6,
        "aft_r3": [None, None, None, None],
        "artillery": [("140mm Twin\nStatus", "Deck Gun", "gun"), ("Ammo\nx5", "Mun.", "ammo"), ("25mm Trip.\nStatus #1", "AA Gun", "aa"), ("25mm Trip.\nStatus #2", "AA Gun", "aa")],
        "fwd_reloads": 13,
        "sys": ["F. Doors", None, "Periscope", "Radio", "Dive Planes",
                "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries", "Hydrophones"]
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "bow_tubes": 2,
        "aft_r3": [None, None, None, None],
        "artillery": [None, None, None, None],
        "fwd_reloads": 0,
        "sys": ["F. Doors", None, "Periscope", "Radio", "Dive Planes",
                None, "Elec. Motors", None, "Batteries", "Hydrophones"]
    }
}

def generate_all_canonical_cards():
    db_path = 'data/submarines_database.json'
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)

    subs = db['submarines']
    print(f"Generating Universal Canonical Cards for all {len(subs)} submarines (Opción 1: Recargas en Columna, Sistemas Abajo)...")

    pdf_out = 'pdf/sensuikan_canonical_player_cards_universal_18subs.pdf'
    os.makedirs(os.path.dirname(pdf_out), exist_ok=True)
    try:
        test_f = open(pdf_out, 'ab')
        test_f.close()
    except PermissionError:
        pdf_out = 'pdf/sensuikan_canonical_player_cards_universal_v2_18subs.pdf'
        print(f"Note: Target PDF was locked by an open viewer; saving to alternate path: '{pdf_out}'")

    with PdfPages(pdf_out) as pdf:
        for key, sub in subs.items():
            fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(0, PAGE_W_MM)
            ax.set_ylim(0, PAGE_H_MM)
            ax.axis('off')

            ox = (PAGE_W_MM - CARD_W_MM) / 2.0
            oy = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM

            card_bg = patches.Rectangle((ox, oy), CARD_W_MM, CARD_H_MM, facecolor='#FAF7F0', edgecolor='none', zorder=1)
            ax.add_patch(card_bg)

            bg_img_path = 'images/mats/real_antique_parchment_bg.png'
            if os.path.exists(bg_img_path):
                parchment_bgr = cv2.imread(bg_img_path)
                if parchment_bgr is not None:
                    parchment_rgb = cv2.cvtColor(parchment_bgr, cv2.COLOR_BGR2RGB)
                    ax.imshow(parchment_rgb, extent=(ox, ox + CARD_W_MM, oy, oy + CARD_H_MM), zorder=1.1, aspect='auto')

            draw_nautical_chart_border(ax, ox, oy, CARD_W_MM, CARD_H_MM)
            draw_print_calibration_and_crop_marks(ax, ox, oy, CARD_W_MM, CARD_H_MM)

            def to_y(y_top_mm):
                return oy + CARD_H_MM - (y_top_mm * BROTHER_COMP)

            def to_x(x_mm):
                return ox + (x_mm * BROTHER_COMP)

            arm_cfg = UNIVERSAL_ARMAMENT_MAP.get(key, {})

            # 1. SHIPYARD TITLE BLOCK
            tb_x0 = to_x(2.5)
            tb_y0 = to_y(18.5)
            tb_w = 161.0 * BROTHER_COMP
            tb_h = 16.0 * BROTHER_COMP
            ax.add_patch(patches.Rectangle((tb_x0, tb_y0), tb_w, tb_h, linewidth=0.8*BROTHER_COMP,
                                           edgecolor='#1E293B', facecolor='#FAF8F3', zorder=2))
            tb_d = 0.5 * BROTHER_COMP
            ax.add_patch(patches.Rectangle((tb_x0 + tb_d, tb_y0 + tb_d), tb_w - 2*tb_d, tb_h - 2*tb_d,
                                           linewidth=0.3*BROTHER_COMP, edgecolor='#475569', facecolor='none', zorder=2.1))

            div_x1 = to_x(46.2)
            div_x2 = to_x(113.5)
            ax.plot([div_x1, div_x1], [tb_y0, tb_y0 + tb_h], color='#94A3B8', lw=0.4*BROTHER_COMP, zorder=2.2)
            ax.plot([div_x2, div_x2], [tb_y0, tb_y0 + tb_h], color='#94A3B8', lw=0.4*BROTHER_COMP, zorder=2.2)

            logo_path = 'images/sensuikan_logo_hires.png'
            if os.path.exists(logo_path):
                logo_bgr = cv2.imread(logo_path)
                if logo_bgr is not None:
                    logo_gray = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2GRAY)
                    logo_rgba = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2RGBA)
                    alpha = np.ones_like(logo_gray, dtype=np.uint8) * 255
                    white_mask = logo_gray > 235
                    alpha[white_mask] = np.clip((255 - logo_gray[white_mask]) * (255.0 / 20.0), 0, 255).astype(np.uint8)
                    logo_rgba[:, :, 3] = alpha
                    logo_w_box = 40.0
                    logo_h_box = logo_w_box / 3.437
                    lx0 = to_x(2.5 + (43.7 - logo_w_box) / 2.0)
                    ly_center = 10.5
                    ly0 = to_y(ly_center + logo_h_box / 2.0)
                    ly1 = to_y(ly_center - logo_h_box / 2.0)
                    ax.imshow(logo_rgba, extent=(lx0, lx0 + logo_w_box * BROTHER_COMP, ly0, ly1), zorder=2.3)

            meta = SHIPYARD_METADATA.get(key, {
                'title': sub['class_name'].upper(),
                'subtitle': sub['full_title'].upper(),
                'badges': [f"AVAILABLE: {sub['available_date'].upper()}", f"PATROLS: {sub['patrol_length'].upper()}", "FLEET SUBMARINE"]
            })

            title_txt = meta['title']
            ax.text(to_x(48.5), to_y(7.0), title_txt,
                    fontsize=9.2 if len(title_txt) > 24 else 10.8,
                    weight='bold', color='#0F172A', va='center', zorder=2.5)

            ax.text(to_x(48.5), to_y(10.8), meta['subtitle'],
                    fontsize=4.4, weight='bold', color='#475569', va='center', zorder=2.5)

            curr_bx = to_x(48.5)
            badge_y = to_y(16.5)
            badge_h = 3.6 * BROTHER_COMP
            for badge_txt in meta['badges'][:2]:
                badge_w = (len(badge_txt) * 1.55 + 5.0) * BROTHER_COMP
                b_rect = patches.Rectangle((curr_bx, badge_y), badge_w, badge_h, linewidth=0.3*BROTHER_COMP,
                                           edgecolor='#94A3B8', facecolor='#F1EFEA', zorder=2.5)
                ax.add_patch(b_rect)
                ax.text(curr_bx + badge_w / 2.0, badge_y + badge_h / 2.0, badge_txt,
                        fontsize=3.2, weight='bold', color='#1E293B', ha='center', va='center', zorder=3)
                curr_bx += badge_w + 2.5 * BROTHER_COMP

            # Specs Plaque
            px0 = to_x(113.5)
            py0 = to_y(17.5)
            pw = 49.0 * BROTHER_COMP
            ph = 14.0 * BROTHER_COMP
            ax.add_patch(patches.Rectangle((px0, py0), pw, ph, linewidth=0.5*BROTHER_COMP,
                                           edgecolor='#A8A29E', facecolor='#F4F1EA', zorder=2.3))
            p_strip_h = 3.2 * BROTHER_COMP
            ax.add_patch(patches.Rectangle((px0, py0 + ph - p_strip_h), pw, p_strip_h, linewidth=0.4*BROTHER_COMP,
                                           edgecolor='#A8A29E', facecolor='#E7E2D8', zorder=2.4))
            ax.text(px0 + pw / 2.0, py0 + ph - p_strip_h / 2.0, 'VESSEL PARTICULARS & SPECIFICATIONS',
                    fontsize=3.2, weight='bold', color='#292524', ha='center', va='center', zorder=2.6)

            stats = sub['stats']
            hulls_str = meta['badges'][2].replace('HULLS: ', '') if len(meta['badges']) > 2 else f"{stats.get('produced', 'N/A')} built"
            col1_lbl_x = px0 + 1.8 * BROTHER_COMP
            col1_val_x = px0 + 9.5 * BROTHER_COMP
            col2_lbl_x = px0 + 25.0 * BROTHER_COMP
            col2_val_x = px0 + 32.8 * BROTHER_COMP

            ax.text(col1_lbl_x, to_y(9.1), 'LEN:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col1_val_x, to_y(9.1), stats['length'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)
            ax.text(col2_lbl_x, to_y(9.1), 'SPD:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col2_val_x, to_y(9.1), stats['speed'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)

            ax.text(col1_lbl_x, to_y(12.2), 'DISP:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col1_val_x, to_y(12.2), stats['displacement'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)
            ax.text(col2_lbl_x, to_y(12.2), 'RNG:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col2_val_x, to_y(12.2), stats['range'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)

            crew_val = f"{stats['crew']} men"
            ax.text(col1_lbl_x, to_y(15.3), 'CREW:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col1_val_x, to_y(15.3), crew_val, fontsize=3.3, weight='bold', color='#0F172A', zorder=3)
            ax.text(col2_lbl_x, to_y(15.3), 'HULLS:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col2_val_x, to_y(15.3), hulls_str, fontsize=3.0 if len(hulls_str) > 20 else 3.2, weight='bold', color='#0F172A', zorder=3)

            # 2. LEFT COLUMN: BASE SLOTS
            base_xs = to_x(10.0)
            draw_card_slot(ax, base_xs, to_y(28.5), label="Current\nBase", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(46.5), label="Mission", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(64.5), label="At\nPort", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')

            # 3. SUB PROFILE
            win_x0 = to_x(20.5)
            win_w = 143.0 * BROTHER_COMP
            win_h = 31.0 * BROTHER_COMP
            win_y0 = to_y(52.0)
            draw_confidential_stamp(ax, to_x(153.0), to_y(30.5), size_mm=17.0*BROTHER_COMP)

            prof_path = sub.get('profile_image_path', '')
            if os.path.exists(prof_path):
                raw_img = cv2.imread(prof_path)
                if raw_img is not None:
                    gray = cv2.cvtColor(raw_img, cv2.COLOR_BGR2GRAY)
                    dark_rows = np.where((gray < 185).any(axis=1))[0]
                    dark_cols = np.where((gray < 185).any(axis=0))[0]
                    if len(dark_rows) > 0 and len(dark_cols) > 0:
                        y_min, y_max = dark_rows.min(), dark_rows.max()
                        y0 = max(0, y_min - 16)
                        y1 = min(raw_img.shape[0], y_max + 16)
                        h = y1 - y0
                        w_target = int(h * (143.0 / 31.0))
                        sub_crop = raw_img[y0:y1, :]
                        if w_target > sub_crop.shape[1]:
                            diff = w_target - sub_crop.shape[1]
                            prof_img = cv2.copyMakeBorder(sub_crop, 0, 0, diff // 2, diff - diff // 2, cv2.BORDER_REPLICATE)
                        else:
                            start_x = (sub_crop.shape[1] - w_target) // 2
                            prof_img = sub_crop[:, start_x:start_x + w_target]
                    else:
                        prof_img = raw_img
                    bg_bgr = prof_img[0, 0]
                    bg_color_hex = '#{:02x}{:02x}{:02x}'.format(bg_bgr[2], bg_bgr[1], bg_bgr[0])
                    outer_win = patches.Rectangle((win_x0, win_y0), win_w, win_h, linewidth=0.8*BROTHER_COMP,
                                                  edgecolor='#1E293B', facecolor=bg_color_hex, zorder=2)
                    ax.add_patch(outer_win)
                    win_d = 0.5 * BROTHER_COMP
                    inner_win = patches.Rectangle((win_x0 + win_d, win_y0 + win_d), win_w - 2*win_d, win_h - 2*win_d,
                                                  linewidth=0.3*BROTHER_COMP, edgecolor='#64748B', facecolor='none', zorder=2.4)
                    ax.add_patch(inner_win)
                    prof_rgb = cv2.cvtColor(prof_img, cv2.COLOR_BGR2RGB)
                    ax.imshow(prof_rgb, extent=(win_x0 + win_d, win_x0 + win_w - win_d, win_y0 + win_d, win_y0 + win_h - win_d), zorder=2.3)

                    # Technical Armament Strip inside Submarine Dossier Window (100% visible through 3D overlay window)
                    art_cfg = arm_cfg.get("artillery", [None]*4)
                    dg_item = art_cfg[0]
                    main_gun_str = dg_item[0].replace('\n', ' ').replace(' Status', '') if dg_item else "None"
                    aa_item = art_cfg[2] if (len(art_cfg) > 2 and art_cfg[2] and art_cfg[2][2] == "aa") else None
                    aa_str = aa_item[0].replace('\n', ' ').replace(' Status', '') if aa_item else "None"
                    fwd_tubes = arm_cfg.get("bow_tubes", 6)
                    aft_tubes = sum(1 for it in arm_cfg.get("aft_r3", []) if it and it[2] == "tube")
                    fwd_rld_count = arm_cfg.get("fwd_reloads", 0)

                    if key == "Type_A_Midget_Submarine___Ko_Hyoteki":
                        arm_badge_txt = "ARMAMENT: 2x 45cm (18\") Bow Torpedo Tubes (No Deck Gun / No AA / 0 Reloads)"
                    else:
                        arm_badge_txt = f"ARMAMENT: Deck Gun: {main_gun_str} • AA: {aa_str} • Tubes: {fwd_tubes} Bow / {aft_tubes} Stern • Reloads: {fwd_rld_count}"

                    ax.text(win_x0 + 3.0 * BROTHER_COMP, to_y(25.0), arm_badge_txt,
                            fontsize=5.6, weight='bold', color='#F8FAFC', zorder=2.7, va='center',
                            bbox=dict(boxstyle='square,pad=0.35', facecolor='#0F172A', edgecolor='#D97706', lw=0.7, alpha=0.92))

            # 4. PATROL TRACK
            draw_section_header_plaque(ax, to_x(20.5), to_y(54.5), "PATROL TRACK (TRANSIT & ON-STATION PHASES)", width=143.0*BROTHER_COMP, h=3.0*BROTHER_COMP)
            patrol_centers = np.linspace(28.0, 156.0, 9)
            phases = sub.get("patrol_phases", ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"])
            pat_y = to_y(64.5)
            for i, p_center in enumerate(patrol_centers):
                p_name = phases[i] if i < len(phases) else "N/A"
                if p_name == "Transit":
                    draw_card_slot(ax, to_x(p_center), pat_y, label="Transit", bg='#E2EAF0', border='#3B5B75', text_color='#1E3547')
                elif p_name.startswith("Stat"):
                    draw_card_slot(ax, to_x(p_center), pat_y, label="On\nStation", bg='#F4F2EB', border='#64748B', text_color='#2A3A4A')
                elif p_name in ["Penetrate", "Attack", "Egress", "Recover"]:
                    draw_card_slot(ax, to_x(p_center), pat_y, label=p_name, bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
                else:
                    draw_card_slot(ax, to_x(p_center), pat_y, is_inactive=True)

            # 5. DAMAGE TRACKS
            draw_section_header_plaque(ax, to_x(20.5), to_y(73.5), "DAMAGE TRACKS (FLOODING & HULL DAMAGE)", width=143.0*BROTHER_COMP, h=2.5*BROTHER_COMP)
            dmg_y_flood = to_y(82.5)
            dmg_y_hull = to_y(99.5)
            draw_card_slot(ax, base_xs, dmg_y_flood, label="Flooding\nMarker", bg='#EBF1F5', border='#385C7E', text_color='#1B3654')
            draw_card_slot(ax, base_xs, dmg_y_hull, label="Hull Damage\nMarker", bg='#F5EDE7', border='#8C4332', text_color='#5C1E12')

            dmg_centers = np.linspace(28.0, 156.0, 9)
            dmg_cap = sub.get("damage_capacity", {"flooding": 8, "hull": 8})
            max_fld = dmg_cap.get("flooding", 8)
            max_hull = dmg_cap.get("hull", 8)

            for i in range(9):
                if i < max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, label=f"Flood {i+1}", bg='#0D1520', border='#385C7E', text_color='#68B2DF')
                elif i == max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, label="Surface", bg='#0D1520', border='#C5A059', text_color='#FFE082')
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)

            for i in range(9):
                if i < max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, label=f"Hull {i+1}", bg='#0D1520', border='#8C4332', text_color='#F28B82')
                elif i == max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, label="Sunk", is_sunk=True, bg='#0D1520', border='#E11D48', text_color='#EF4444')
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, is_inactive=True)

            # 6. CREW STATUS & CREW QUALITY (SHIFTED 1 COLUMN LEFT: 5 COLUMNS x 2 ROWS)
            cols9 = np.linspace(28.0, 156.0, 9)
            crew_centers = [10.0] + list(cols9[:4])  # [10.0, 28.0, 44.0, 60.0, 76.0]
            crew_y1 = to_y(119.5)
            crew_y2 = to_y(136.5)

            draw_section_header_plaque(ax, to_x(2.5), to_y(109.5), "CREW STATUS & QUALITY", width=81.0*BROTHER_COMP, h=2.5*BROTHER_COMP)

            draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", bg='#F8F9FA', border='#334155', text_color='#0F172A')
            draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", bg='#F8F9FA', border='#334155', text_color='#0F172A')
            draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", bg='#F8F9FA', border='#334155', text_color='#0F172A')
            draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", bg='#F8F9FA', border='#334155', text_color='#0F172A')
            draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", bg='#F8F9FA', border='#334155', text_color='#0F172A')

            is_midget = (key == "Type_A_Midget_Submarine___Ko_Hyoteki")
            is_sentoku = (key == "Sen_Toku_Class")
            crew_count = 1 if is_midget else sub.get("crew_counters", 4)

            for ci in range(4):
                if ci < crew_count:
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", bg='#F8F9FA', border='#334155', text_color='#0F172A')
                else:
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
            draw_card_slot(ax, to_x(crew_centers[4]), crew_y2, label="Crew\nQuality", bg='#FAF2E1', border='#C08420', text_color='#784B05')

            # 7. SYSTEMS STATUS (MOVED UP BESIDE CREW STATUS: 4 COLUMNS x 2 ROWS)
            sys_centers = cols9[5:]  # [108.0, 124.0, 140.0, 156.0]
            draw_section_header_plaque(ax, to_x(100.5), to_y(109.5), "⚙ SYSTEMS STATUS", width=63.0*BROTHER_COMP, h=2.5*BROTHER_COMP)

            sys_list_all = arm_cfg.get('sys', [None]*10)
            # Pick the 8 most critical systems for this submarine
            has_aft = (arm_cfg.get('aft_r3') and any(it for it in arm_cfg.get('aft_r3') if it and it[2] == 'tube'))
            if has_aft:
                sys_8 = ["F. Doors", "Aft Doors", "Periscope", "Radio",
                         "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries"]
            else:
                sys_8 = ["F. Doors", "Periscope", "Radio", "Dive Planes",
                         "Diesel Eng.", "Elec. Motors", "Fuel Tanks", "Batteries"]
            if key == "Kirai_Sen_Class":
                sys_8[1] = "Mine Doors"
                sys_8[7] = "Mine Handling"

            for s_idx in range(8):
                c_i = s_idx % 4
                r_i = s_idx // 4
                cx = to_x(sys_centers[c_i])
                cy = crew_y1 if r_i == 0 else crew_y2
                item = sys_8[s_idx]
                draw_card_slot(ax, cx, cy, label=item, sublabel="", bg='#F1F5F9', border='#334155', text_color='#0F172A')

            # =========================================================================
            # --- 8. BOTTOM AREA: SPECIAL RULES & HISTORICAL NOTES (ALIGNED TO CHITS AT Y=164.0)
            # =========================================================================
            box_x0 = to_x(8.0)
            box_w = 155.5 * BROTHER_COMP
            box_h = 18.5 * BROTHER_COMP
            box_y0 = to_y(164.0)

            panel_bg = patches.Rectangle((box_x0, box_y0), box_w, box_h, linewidth=0.8*BROTHER_COMP,
                                         edgecolor='#5A6B7C', facecolor='#FAF8F2', zorder=2)
            ax.add_patch(panel_bg)
            ax.add_patch(patches.Rectangle((box_x0 + 0.5*BROTHER_COMP, box_y0 + 0.5*BROTHER_COMP),
                                           box_w - 1.0*BROTHER_COMP, box_h - 1.0*BROTHER_COMP,
                                           linewidth=0.3*BROTHER_COMP, edgecolor='#94A3B8', facecolor='none', zorder=2.1))
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(148.5), "SPECIAL RULES & HISTORICAL NOTES:", fontsize=5.6, weight='bold', color='#1E293B', zorder=3)
            ax.plot([box_x0 + 3.0*BROTHER_COMP, box_x0 + box_w - 3.0*BROTHER_COMP], [to_y(150.0), to_y(150.0)],
                    color='#C08420', lw=0.5*BROTHER_COMP, zorder=2.5)
            
            # Sello Hanko IJN auténtico en esquina inferior derecha
            draw_imperial_hanko(ax, box_x0 + box_w - 7.5*BROTHER_COMP, to_y(156.5), r_mm=4.0*BROTHER_COMP, angle=3.5)

            rules_raw = sub.get('special_rules', '').replace('\x95', '•').replace('[ERRATA] ', '').replace('[ERRATA]', '').strip()
            kaiten_raw = sub.get('kaiten_note', '').replace('[ERRATA] ', '').replace('[ERRATA]', '').strip() if sub.get('kaiten_note') else None
            total_chars = len(rules_raw) + (len(kaiten_raw) if kaiten_raw else 0)
            if total_chars > 280:
                font_s, line_h_mm, wrap_w = 3.9, 1.65, 126
            elif total_chars > 160:
                font_s, line_h_mm, wrap_w = 4.3, 1.85, 118
            else:
                font_s, line_h_mm, wrap_w = 4.8, 2.05, 110

            curr_y_mm = 152.8
            for para in rules_raw.split('\n'):
                para = para.strip()
                if not para:
                    continue
                wrapped = textwrap.fill(para, width=wrap_w)
                for line in wrapped.split('\n'):
                    if curr_y_mm > 162.5: break
                    is_bold_lead = (line.startswith('•') or line.startswith('Cargo Conversion:') or 
                                    line.startswith('Radar:') or line.startswith('Armament:') or 
                                    line.startswith('Special Damage Routing:') or line.startswith('Special Rules:'))
                    ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(curr_y_mm), line,
                            fontsize=font_s, weight='bold' if is_bold_lead else 'normal',
                            color='#1E293B', va='top', zorder=3)
                    curr_y_mm += line_h_mm
                curr_y_mm += 0.25

            if kaiten_raw and curr_y_mm < 162.0:
                curr_y_mm += 0.2
                wrapped_k = textwrap.fill(f"Kaiten Conversion: {kaiten_raw}", width=wrap_w)
                for line in wrapped_k.split('\n'):
                    if curr_y_mm > 162.5: break
                    ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(curr_y_mm), line,
                            fontsize=font_s, weight='bold', color='#881A1A', va='top', zorder=3)
                    curr_y_mm += line_h_mm

            # =========================================================================
            # --- 8. RE-ENGINEERED UNIVERSAL RIGHT BLOCK (16 FORWARD RELOADS!) ---
            # =========================================================================
            col_x = [to_x(x) for x in [178.5, 195.0, 211.5, 228.0]]

            # 1. AIRCRAFT & TACTICAL EVENT RECORD
            draw_section_header_plaque(ax, to_x(171.0), to_y(3.5), "✈ AIRCRAFT & TACTICAL EVENT RECORD", width=64.5*BROTHER_COMP, h=2.8*BROTHER_COMP)
            y_r0 = to_y(13.5)
            if is_sentoku:
                draw_card_slot(ax, col_x[0], y_r0, label="Aichi M6A1\nStatus #1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, col_x[1], y_r0, label="Aichi M6A1\nStatus #2", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, col_x[2], y_r0, label="Aichi M6A1\nStatus #3", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, col_x[3], y_r0, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                if sub['has_aircraft']:
                    air_name = "Yokosuka\nE14Y1 Status" if ("Glen" in str(sub.get('aircraft_type', '')) or "E14Y1" in str(sub.get('aircraft_type', ''))) else "Aircraft\nStatus"
                    draw_card_slot(ax, col_x[0], y_r0, label=air_name, bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, col_x[0], y_r0, is_inactive=True)
                draw_card_slot(ax, col_x[1], y_r0, is_inactive=True)
                draw_card_slot(ax, col_x[2], y_r0, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
                draw_card_slot(ax, col_x[3], y_r0, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')

            # 2. FORWARD TORPEDO TUBES (1–8) — PROA
            draw_section_header_plaque(ax, to_x(171.0), to_y(23.2), "▲ FORWARD TORPEDO TUBES / PROA (1–8)", width=64.5*BROTHER_COMP, h=2.8*BROTHER_COMP)
            y_r1 = to_y(32.7)
            y_r2 = to_y(49.2)
            n_bow = arm_cfg.get("bow_tubes", 6)

            for i in range(4):
                if i < n_bow:
                    draw_card_slot(ax, col_x[i], y_r1, label=str(i+1), sublabel="Bow / Proa", bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
                else:
                    draw_card_slot(ax, col_x[i], y_r1, is_inactive=True)

            for i in range(4):
                tube_idx = i + 5
                if tube_idx <= n_bow:
                    draw_card_slot(ax, col_x[i], y_r2, label=str(tube_idx), sublabel="Bow / Proa", bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
                else:
                    draw_card_slot(ax, col_x[i], y_r2, is_inactive=True)

            # 3. AFT TORPEDO TUBES & RELOADS — POPA
            draw_section_header_plaque(ax, to_x(171.0), to_y(58.9), "▼ AFT TUBES & RELOADS / POPA: TUBOS Y RECARGAS", width=64.5*BROTHER_COMP, h=2.8*BROTHER_COMP)
            y_r3 = to_y(68.4)
            aft_items = arm_cfg.get("aft_r3", [None]*4)
            for i in range(4):
                draw_armament_slot(ax, col_x[i], y_r3, aft_items[i], sub_key=key, sub_data=sub)

            # 4. ARTILLERY & DECK WEAPONS (ROW 4: 4 SLOTS)
            draw_section_header_plaque(ax, to_x(171.0), to_y(78.1), "⚔ ARTILLERY & DECK WEAPONS / ARTILLERÍA", width=64.5*BROTHER_COMP, h=2.8*BROTHER_COMP)
            y_r4 = to_y(87.6)
            art_items = arm_cfg.get("artillery", [None]*4)
            for i in range(4):
                draw_armament_slot(ax, col_x[i], y_r4, art_items[i], sub_key=key, sub_data=sub)

            # 5. FORWARD TORPEDO RELOADS (ROWS 5, 6, 7, 8: 16 SLOTS!)
            draw_section_header_plaque(ax, to_x(171.0), to_y(97.5), "▲ FORWARD TORPEDO RELOADS / RECARGAS PROA (1–16)", width=64.5*BROTHER_COMP, h=2.8*BROTHER_COMP)
            rld_y_rows = [to_y(107.0), to_y(123.5), to_y(140.0), to_y(156.5)]
            fwd_rld_total = arm_cfg.get("fwd_reloads", 0)

            for idx in range(16):
                r_i = idx // 4
                c_i = idx % 4
                cy = rld_y_rows[r_i]
                cx = col_x[c_i]
                rld_num = idx + 1
                if rld_num <= fwd_rld_total:
                    draw_card_slot(ax, cx, cy, label=f"Reload {rld_num}", sublabel="Proa / T-95",
                                   bg='#F4F7FA', border='#2A5682', text_color='#102A45')
                else:
                    draw_card_slot(ax, cx, cy, is_inactive=True)

            # Duplex Footer
            dp = sub.get('duplex_print')
            if dp:
                ax.text(to_x(235.0), to_y(-1.5), f"Sheet {dp['sheet_number']}/9 • {dp['side']}",
                        fontsize=3.2, ha='right', va='bottom', color='#64748B', zorder=4)
                ax.text(PAGE_W_MM / 2.0, oy - 4.5,
                        f"Sensuikan Canonical Board • Sheet {dp['sheet_number']}/9 • {dp['side']} (Page {dp['page_number']:02d}/18) • {dp['family']} • Reverse: {dp['paired_with']} • Double-Sided Print (Flip on Long Edge) • 100% Scale",
                        fontsize=3.5, ha='center', va='center', color='#64748B')

            pdf.savefig(fig, dpi=150)

            # Generate high-res verification preview PNGs
            if key in ["Kaidai_KD3_Class", "Kaidai_KD4_Class", "Kaidai_KD7_Class", "Junsen_J2_Class", "Junsen_J3_Class", "Type_B_Class", "Type_C_Class", "Sen_Toku_Class", "Kirai_Sen_Class", "Type_A_Midget_Submarine___Ko_Hyoteki"]:
                art_png = f'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/preview_{key}.png'
                fig.savefig(art_png, dpi=150)

            plt.close(fig)

    print(f"SUCCESS: Generated 18-page universal PDF at '{pdf_out}'")

if __name__ == '__main__':
    generate_all_canonical_cards()
