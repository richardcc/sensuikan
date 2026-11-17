with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

target_start = "    # Realistic 3D Illustrated Counter Art (or Vector Watermark Fallback)"
target_end = "    else:\n        # Pure technical / abstract slots"

start_idx = code.find(target_start)
end_idx = code.find(target_end)

if start_idx == -1 or end_idx == -1:
    print(f"ERROR: Could not find target section ({start_idx}, {end_idx})")
else:
    new_section = '''    # Realistic 3D Illustrated Counter Art (or Vector Watermark Fallback)
    real_img = get_realistic_counter_img(label, sublabel) if (not is_sunk and (water_level is None or water_level == 0)) else None
    if real_img is not None:
        img_hw = (SLOT_SIZE - 2*inner) / 2.0
        is_digit_tube = bool(label and label.strip().isdigit())
        
        if is_digit_tube:
            # Torpedo tubes: full size illustration, number placed in TOP-LEFT
            ax.imshow(real_img, extent=(cx - img_hw, cx + img_hw, cy - img_hw, cy + img_hw), zorder=3.4, alpha=0.95)
        else:
            # Counters with text: scale illustration slightly (88%) and place in upper portion above plaque
            art_scale = 0.88
            art_hw = img_hw * art_scale
            lines_chk = label.split('\\n') if (label and '\\n' in label) else ([label, sublabel] if sublabel else [label or ''])
            h_p_chk = (3.8 if len(lines_chk) <= 1 else 4.8) * BROTHER_COMP
            y_plaque_chk = cy - img_hw + 0.2 * BROTHER_COMP
            top_y_chk = cy + img_hw - 0.2 * BROTHER_COMP
            art_cy = (y_plaque_chk + h_p_chk + top_y_chk) / 2.0
            
            # Dark navy backing panel + fine frame
            ax.add_patch(patches.Rectangle((cx - art_hw, art_cy - art_hw), 2*art_hw, 2*art_hw, facecolor='#0D1520', zorder=3.3))
            ax.imshow(real_img, extent=(cx - art_hw, cx + art_hw, art_cy - art_hw, art_cy + art_hw), zorder=3.4, alpha=0.96)
            ax.add_patch(patches.Rectangle((cx - art_hw, art_cy - art_hw), 2*art_hw, 2*art_hw, facecolor='none', edgecolor='#64748B', lw=0.4*BROTHER_COMP, alpha=0.7, zorder=3.5))
    else:
        ic_name, ic_col, ic_alp = get_icon_for_slot(label, sublabel)
        if icon is not None: ic_name = icon
        if icon_color is not None: ic_col = icon_color
        if icon_alpha is not None: ic_alp = icon_alpha
        if ic_name and not is_sunk and (water_level is None or water_level == 0):
            draw_watermark(ax, cx, cy, ic_name, ic_col, alpha=ic_alp or 0.15, size=SLOT_SIZE * 0.62)
        
    # Typography: Opción 1 (Cartela Naval Técnica Inferior Azul Marino + Dorado con micro-remaches)
    if real_img is not None:
        w_img = 2.0 * img_hw
        
        # Prepare lines
        if label:
            if '\\n' in label:
                lines = label.split('\\n')
            elif sublabel:
                lines = [label, sublabel]
            else:
                words = label.split()
                if len(words) >= 2 and len(label) > 9:
                    mid = len(words) // 2
                    lines = [" ".join(words[:mid]), " ".join(words[mid:])]
                else:
                    lines = [label]
        else:
            lines = [sublabel] if sublabel else []
            
        if lines:
            if len(lines) == 1 and lines[0].isdigit():
                # Torpedo tube numerals (1..8): circular brass/navy badge placed in TOP-LEFT corner!
                badge_r = 2.3 * BROTHER_COMP
                bx = cx - img_hw + 2.5 * BROTHER_COMP
                by = cy + img_hw - 2.5 * BROTHER_COMP
                ax.add_patch(patches.Circle((bx, by), badge_r, facecolor='#0D1520', edgecolor='#C5A059', lw=0.8 * BROTHER_COMP, zorder=4.5))
                ax.add_patch(patches.Circle((bx, by), badge_r - 0.35 * BROTHER_COMP, facecolor='none', edgecolor='#9E782F', lw=0.35 * BROTHER_COMP, zorder=4.6))
                ax.text(bx, by, lines[0], fontsize=8.0, weight='bold', color='#FFE082', ha='center', va='center', zorder=5)
            else:
                # Lower rectangular technical plaque with gold rim and micro-rivets
                w_p = w_img - 0.4 * BROTHER_COMP
                x0 = cx - w_p / 2.0
                y0 = cy - img_hw + 0.2 * BROTHER_COMP
                h_p = (3.8 if len(lines) == 1 else (4.8 if len(lines) == 2 else 5.8)) * BROTHER_COMP
                
                # Dark navy body with brass trim
                ax.add_patch(patches.Rectangle((x0, y0), w_p, h_p, facecolor='#0D1520', edgecolor='#C5A059', lw=0.75 * BROTHER_COMP, alpha=0.95, zorder=4.5))
                # 4 micro gold corner rivets
                rivet_r = 0.18 * BROTHER_COMP
                for rx, ry in [(x0 + 0.7*BROTHER_COMP, y0 + 0.7*BROTHER_COMP),
                               (x0 + w_p - 0.7*BROTHER_COMP, y0 + 0.7*BROTHER_COMP),
                               (x0 + 0.7*BROTHER_COMP, y0 + h_p - 0.7*BROTHER_COMP),
                               (x0 + w_p - 0.7*BROTHER_COMP, y0 + h_p - 0.7*BROTHER_COMP)]:
                    ax.add_patch(patches.Circle((rx, ry), rivet_r, facecolor='#E2B765', edgecolor='#45300E', lw=0.2*BROTHER_COMP, zorder=4.8))
                
                y_center = y0 + h_p / 2.0
                if len(lines) == 1:
                    f_size = 5.0 if len(lines[0]) <= 7 else (4.4 if len(lines[0]) <= 11 else 3.8)
                    ax.text(cx, y_center, lines[0], fontsize=f_size, weight='bold', color='#FAF6ED', ha='center', va='center', zorder=5)
                else:
                    line_spacing = 2.0 * BROTHER_COMP
                    y_start = y_center + (len(lines) - 1) * (line_spacing / 2.0)
                    for l_i, l_text in enumerate(lines):
                        f_size = 4.0 if len(l_text) <= 8 else 3.5
                        c_col = '#FAF6ED' if l_i == 0 else '#E2B765'
                        ax.text(cx, y_start - l_i * line_spacing, l_text, fontsize=f_size, weight='bold', color=c_col, ha='center', va='center', zorder=5)
'''
    code = code[:start_idx] + new_section + code[end_idx:]
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS: generate_canonical_player_cards.py updated with top-left numbers and scaled art!")
