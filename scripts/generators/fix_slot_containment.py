with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

target = """        if is_digit_tube:
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
            ax.add_patch(patches.Rectangle((cx - art_hw, art_cy - art_hw), 2*art_hw, 2*art_hw, facecolor='none', edgecolor='#64748B', lw=0.4*BROTHER_COMP, alpha=0.7, zorder=3.5))"""

replacement = """        # Dark navy naval background inside slot so ZERO white on sides
        ax.add_patch(patches.Rectangle((cx - img_hw, cy - img_hw), 2*img_hw, 2*img_hw, facecolor='#0D1520', zorder=3.1))
        
        y_bot_slot = cy - img_hw + 0.2 * BROTHER_COMP
        y_top_slot = cy + img_hw - 0.2 * BROTHER_COMP
        
        if is_digit_tube:
            # Torpedo tubes: full width, strictly contained inside 15x15
            ax.imshow(real_img, extent=(cx - img_hw, cx + img_hw, y_bot_slot, y_top_slot), zorder=3.4, alpha=0.96)
        else:
            # Counters with text:
            # Crop bottom 12% so subject is framed higher up without distortion,
            # and display across FULL WIDTH [cx - img_hw, cx + img_hw] and strictly inside [y_bot_slot, y_top_slot]!
            # ZERO white on sides, ZERO protrusion on top!
            crop_h = int(real_img.shape[0] * 0.88)
            cropped_img = real_img[:crop_h, :, :]
            ax.imshow(cropped_img, extent=(cx - img_hw, cx + img_hw, y_bot_slot, y_top_slot), zorder=3.4, alpha=0.96)"""

code_norm = code.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
rep_norm = replacement.replace('\r\n', '\n')

if target_norm in code_norm:
    code_norm = code_norm.replace(target_norm, rep_norm, 1)
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.write(code_norm)
    print("SUCCESS: Slot containment updated perfectly!")
else:
    print("ERROR: Target section not found")
