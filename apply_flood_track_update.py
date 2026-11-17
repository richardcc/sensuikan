with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Flooding Track loop
old_flood_loop = '''            # Flooding Track: Flooding on every slot, then Surface, then clean inactive
            for i in range(9):
                if i < max_fld:
                    level = (i + 1) / float(max_fld + 1)
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label="Flooding", bg='#F1F5F8', border='#385C7E', text_color='#1B3654',
                                   water_level=level)
                elif i == max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label="Surface", bg='#DFEEF5', border='#2A6788', text_color='#13445C')
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)'''

new_flood_loop = '''            # Flooding Track: Progressive AI Flooding Artworks (1..8) + Emergency Surface (9), then clean inactive
            for i in range(9):
                if i < max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label=f"Flood {i+1}", sublabel="",
                                   bg='#0D1520', border='#385C7E', text_color='#68B2DF')
                elif i == max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label="Surface", sublabel="",
                                   bg='#0D1520', border='#C5A059', text_color='#FFE082')
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)'''

assert old_flood_loop in text, 'old_flood_loop not found'
text = text.replace(old_flood_loop, new_flood_loop)

# 2. Update badge logic in draw_card_slot
old_badge_check = 'if len(lines) == 1 and lines[0].isdigit():'
new_badge_check = '''spec = match_counter_spec(label, sublabel)
            is_digit_tube = len(lines) == 1 and lines[0].isdigit()
            is_flood_badge = bool(spec and spec.get('badge_number'))
            
            if is_digit_tube or is_flood_badge:
                badge_txt = spec.get('badge_number') if is_flood_badge else lines[0]
                badge_edge = '#385C7E' if is_flood_badge else '#C5A059'
                badge_col = '#68B2DF' if is_flood_badge else '#FFE082'
                badge_r = 2.3 * BROTHER_COMP
                bx = cx - img_hw + 2.5 * BROTHER_COMP
                by = cy + img_hw - 2.5 * BROTHER_COMP
                ax.add_patch(patches.Circle((bx, by), badge_r, facecolor='#0D1520', edgecolor=badge_edge, lw=0.8 * BROTHER_COMP, zorder=4.5))
                ax.add_patch(patches.Circle((bx, by), badge_r - 0.35 * BROTHER_COMP, facecolor='none', edgecolor=badge_edge, lw=0.35 * BROTHER_COMP, zorder=4.6))
                ax.text(bx, by, badge_txt, fontsize=8.0, weight='bold', color=badge_col, ha='center', va='center', zorder=5)'''

# Find the badge block in draw_card_slot
target_badge_block = '''            if len(lines) == 1 and lines[0].isdigit():
                # Torpedo tube numerals (1..8): circular brass/navy badge placed in TOP-LEFT corner!
                badge_r = 2.3 * BROTHER_COMP
                bx = cx - img_hw + 2.5 * BROTHER_COMP
                by = cy + img_hw - 2.5 * BROTHER_COMP
                ax.add_patch(patches.Circle((bx, by), badge_r, facecolor='#0D1520', edgecolor='#C5A059', lw=0.8 * BROTHER_COMP, zorder=4.5))
                ax.add_patch(patches.Circle((bx, by), badge_r - 0.35 * BROTHER_COMP, facecolor='none', edgecolor='#9E782F', lw=0.35 * BROTHER_COMP, zorder=4.6))
                ax.text(bx, by, lines[0], fontsize=8.0, weight='bold', color='#FFE082', ha='center', va='center', zorder=5)'''

assert target_badge_block in text, 'target_badge_block not found'
text = text.replace(target_badge_block, new_badge_check)

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated generate_canonical_player_cards.py with progressive AI flooding track!')
