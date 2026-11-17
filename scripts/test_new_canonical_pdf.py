import os
import sys
import json
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
    draw_reload_supplies_bay, draw_armament_slot, SHIPYARD_METADATA, RELOAD_CAPACITIES
)

def test_kd3_card():
    db_path = 'data/submarines_database.json'
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)

    sub = db['submarines']['Kaidai_KD3_Class']
    key = 'Kaidai_KD3_Class'

    fig, ax = plt.subplots(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax.set_xlim(0, PAGE_W_MM)
    ax.set_ylim(0, PAGE_H_MM)
    ax.set_aspect('equal')
    ax.axis('off')
    fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

    ox = (PAGE_W_MM - CARD_W_MM) / 2.0
    oy = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM

    # Background
    card_bg = patches.Rectangle((ox, oy), CARD_W_MM, CARD_H_MM, linewidth=0.5*BROTHER_COMP,
                                edgecolor='#1E293B', facecolor='#F7F5EE', zorder=1)
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
    div_x2 = to_x(46.8)
    ax.plot([div_x1, div_x1], [tb_y0 + tb_d, tb_y0 + tb_h - tb_d], color='#475569', lw=0.3*BROTHER_COMP, zorder=2.2)
    ax.plot([div_x2, div_x2], [tb_y0 + tb_d, tb_y0 + tb_h - tb_d], color='#475569', lw=0.3*BROTHER_COMP, zorder=2.2)

    logo_bgr = cv2.imread('images/sensuikan_logo_hires.png')
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

    meta = sub.get("shipyard_metadata") or SHIPYARD_METADATA.get(key)
    text_x = to_x(49.0)
    ax.text(text_x, to_y(6.8), meta['title'], fontsize=10.0, weight='bold', family='serif', color='#0F172A', zorder=3)
    ax.text(text_x, to_y(10.8), meta['subtitle'], fontsize=4.8, weight='bold', color='#5A4D41', zorder=3)

    curr_bx = text_x
    badge_y = to_y(16.5)
    badge_h = 3.3 * BROTHER_COMP
    for badge_txt in meta['badges'][:2]:
        badge_w = (len(badge_txt) * 0.85 + 4.0) * BROTHER_COMP
        b_rect = patches.Rectangle((curr_bx, badge_y), badge_w, badge_h, linewidth=0.4*BROTHER_COMP,
                                   edgecolor='#B8AEA5', facecolor='#EDE8E1', zorder=2.5)
        ax.add_patch(b_rect)
        ax.text(curr_bx + badge_w / 2.0, badge_y + badge_h / 2.0, badge_txt,
                fontsize=3.2, weight='bold', color='#1E293B', ha='center', va='center', zorder=3)
        curr_bx += badge_w + 2.5 * BROTHER_COMP

    # Specs plaque
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
    ax.text(col2_val_x, to_y(15.3), hulls_str, fontsize=3.0, weight='bold', color='#0F172A', zorder=3)

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
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, label=f"Hull {i+1}", bg='#0D1520', border='#8C3524', text_color='#FCA5A5')
        elif i == max_hull:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, label="SUNK", bg='#0D1520', border='#8C2E24', text_color='#FCA5A5', is_sunk=True)
        else:
            draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, is_inactive=True)

    # 6. CREW STATUS
    draw_section_header_plaque(ax, to_x(20.5), to_y(109.5), "CREW STATUS & CREW QUALITY", width=143.0*BROTHER_COMP, h=3.0*BROTHER_COMP)
    crew_centers = np.linspace(28.0, 156.0, 7)
    crew_y1 = to_y(119.5)
    crew_y2 = to_y(136.5)

    draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
    draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
    draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
    draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
    draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
    draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)

    for ci in range(4):
        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
    draw_card_slot(ax, to_x(crew_centers[4]), crew_y2, is_inactive=True)
    draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, is_inactive=True)
    draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\nQuality", bg='#FAF2E1', border='#C08420', text_color='#784B05')

    # 7. SPECIAL RULES & HISTORICAL NOTES (100% PRESERVED IN ORIGINAL SPOT!)
    box_x0 = to_x(8.0)
    box_w = 155.5 * BROTHER_COMP
    box_h = 31.5 * BROTHER_COMP
    box_y0 = to_y(179.0)

    panel_bg = patches.Rectangle((box_x0, box_y0), box_w, box_h, linewidth=0.9*BROTHER_COMP,
                                 edgecolor='#5A6B7C', facecolor='#FAF8F2', zorder=2)
    ax.add_patch(panel_bg)
    ax.add_patch(patches.Rectangle((box_x0 + 0.5*BROTHER_COMP, box_y0 + 0.5*BROTHER_COMP),
                                   box_w - 1.0*BROTHER_COMP, box_h - 1.0*BROTHER_COMP,
                                   linewidth=0.3*BROTHER_COMP, edgecolor='#94A3B8', facecolor='none', zorder=2.1))
    ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(152.0), "SPECIAL RULES & HISTORICAL NOTES:", fontsize=6.0, weight='bold', color='#1E293B', zorder=3)
    ax.plot([box_x0 + 3.0*BROTHER_COMP, box_x0 + box_w - 3.0*BROTHER_COMP], [to_y(153.8), to_y(153.8)],
            color='#C08420', lw=0.6*BROTHER_COMP, zorder=2.5)
    draw_imperial_hanko(ax, box_x0 + box_w - 9.5*BROTHER_COMP, to_y(169.5), r_mm=6.2*BROTHER_COMP, angle=3.5)

    rules_text = sub.get('special_rules', '').strip()
    ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(157.0), rules_text, fontsize=5.1, color='#1E293B', va='top', zorder=3)

    # =========================================================================
    # --- 8. RE-ENGINEERED UNIVERSAL RIGHT BLOCK (CLEAR ROTULATED HEADERS!) ---
    # =========================================================================
    col_x = [to_x(x) for x in [178.5, 195.0, 211.5, 228.0]]

    # 1. AIRCRAFT & TACTICAL EVENT RECORD
    draw_section_header_plaque(ax, to_x(171.0), to_y(3.5), "✈ AIRCRAFT & TACTICAL EVENT RECORD", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)
    y_r0 = to_y(13.5)
    draw_card_slot(ax, col_x[0], y_r0, is_inactive=True)
    draw_card_slot(ax, col_x[1], y_r0, is_inactive=True)
    draw_card_slot(ax, col_x[2], y_r0, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
    draw_card_slot(ax, col_x[3], y_r0, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')

    # 2. FORWARD TORPEDO TUBES (BOW / PROA 1–8)
    draw_section_header_plaque(ax, to_x(171.0), to_y(23.2), "▲ FORWARD TORPEDO TUBES / TUBOS DE PROA (1–8)", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)
    y_r1 = to_y(32.7)
    y_r2 = to_y(49.2)
    # Row 1: Tubes 1-4 (All Bow)
    for i in range(4):
        draw_card_slot(ax, col_x[i], y_r1, label=str(i+1), sublabel="Bow / Proa", bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
    # Row 2: Tubes 5-6 (Bow), 7-8 (Inactive for KD3 because KD3 only has 6 Bow Tubes!)
    draw_card_slot(ax, col_x[0], y_r2, label="5", sublabel="Bow / Proa", bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
    draw_card_slot(ax, col_x[1], y_r2, label="6", sublabel="Bow / Proa", bg='#E8F1F5', border='#3B6B94', text_color='#0F172A')
    draw_card_slot(ax, col_x[2], y_r2, is_inactive=True)
    draw_card_slot(ax, col_x[3], y_r2, is_inactive=True)

    # 3. AFT TORPEDO TUBES & RELOADS (STERN / POPA)
    draw_section_header_plaque(ax, to_x(171.0), to_y(58.9), "▼ AFT TUBES & RELOADS / POPA: TUBOS Y RECARGAS", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)
    y_r3 = to_y(68.4)
    # Col 0: Stern Tube 7, Col 1: Stern Tube 8, Col 2: Aft Reload 1, Col 3: Aft Reload 2
    draw_card_slot(ax, col_x[0], y_r3, label="7", sublabel="Stern / Popa", bg='#EAE8F5', border='#5B4A78', text_color='#2E1E4A')
    draw_card_slot(ax, col_x[1], y_r3, label="8", sublabel="Stern / Popa", bg='#EAE8F5', border='#5B4A78', text_color='#2E1E4A')
    draw_card_slot(ax, col_x[2], y_r3, label="Aft\nReload", sublabel="Popa", bg='#F3F1F7', border='#5B4A78', text_color='#362452')
    draw_card_slot(ax, col_x[3], y_r3, label="Aft\nReload", sublabel="Popa", bg='#F3F1F7', border='#5B4A78', text_color='#362452')

    # 4. ARTILLERY, DECK GUNS & FORWARD RELOADS
    draw_section_header_plaque(ax, to_x(171.0), to_y(78.1), "⚔ ARTILLERY & RELOADS / ARTILLERÍA Y RECARGAS PROA", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)
    y_r4 = to_y(87.6)
    y_r5 = to_y(104.1)

    # Deck Gun & Ammo in Cols 0 and 1
    draw_card_slot(ax, col_x[0], y_r4, label="120mm\nStatus", sublabel="Deck Gun", bg='#FBF7EE', border='#8C6D3B', text_color='#4A3414')
    draw_card_slot(ax, col_x[0], y_r5, label="Ammo\nx5", sublabel="Mun.", bg='#FAF2E1', border='#C08420', text_color='#784B05')
    draw_card_slot(ax, col_x[1], y_r4, is_inactive=True)
    draw_card_slot(ax, col_x[1], y_r5, is_inactive=True)

    # Forward Reloads Bay in Cols 2 & 3 (Center = mean(col_x[2], col_x[3]), mean(y_r4, y_r5))
    area_cx = (col_x[2] + col_x[3]) / 2.0
    area_cy = (y_r4 + y_r5) / 2.0
    draw_reload_supplies_bay(ax, area_cx, area_cy, capacity=8)

    # 5. SYSTEMS STATUS (16 SLOTS - 4x4)
    draw_section_header_plaque(ax, to_x(171.0), to_y(113.8), "⚙ SYSTEMS STATUS / ESTADO DE SISTEMAS", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)
    sys_list = [
        "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
        "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
        "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
        "Periscope", None, None, None
    ]
    sys_y = [to_y(123.3), to_y(139.8), to_y(156.3), to_y(172.8)]
    for idx, sys_item in enumerate(sys_list):
        r_i = idx // 4
        c_i = idx % 4
        cy = sys_y[r_i]
        cx = col_x[c_i]
        if sys_item:
            draw_card_slot(ax, cx, cy, label=sys_item, sublabel="",
                           bg='#F4F5F7', border='#475569', text_color='#1E293B')
        else:
            draw_card_slot(ax, cx, cy, is_inactive=True)

    out_pdf = 'scratch/test_kd3_canonical_rethought.pdf'
    os.makedirs('scratch', exist_ok=True)
    plt.savefig(out_pdf, format='pdf', dpi=200)
    out_png = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/test_kd3_canonical_rethought.png'
    plt.savefig(out_png, format='png', dpi=200)
    plt.close()
    print("SUCCESS! Saved test KD3 PDF and PNG.")

test_kd3_card()
