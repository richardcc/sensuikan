with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = '''            # Row 3: (Y = 69.0 mm) & Row 4: (Y = 85.8 mm)
            y_r3 = to_y(69.0)
            y_r4 = to_y(85.8)
            
            capacity = sub.get("reload_capacity", RELOAD_CAPACITIES.get(key, 0))
            if capacity > 0:
                # 2x2 Square Bay for Forward Reloads & Supplies (occupying Columns 3 & 4 across Rows 3 & 4)
                area_cx = (col_x[2] + col_x[3]) / 2.0
                area_cy = (y_r3 + y_r4) / 2.0
                draw_reload_supplies_bay(ax, area_cx, area_cy, capacity=capacity)

            # Draw row 3 items (only columns 0 and 1 if square bay is present)
            for i, item in enumerate(arm_cfg.get('r3', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r3, item)

            # Draw row 4 items (only columns 0 and 1 if square bay is present)
            for i, item in enumerate(arm_cfg.get('r4', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r4, item)

            # Row 5: (Y = 102.6 mm)
            y_r5 = to_y(102.6)
            for i, item in enumerate(arm_cfg.get('r5', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r5, item)'''

new_block = '''            # Rows 3, 4, 5 of Artillery & Special Weapons
            y_r3 = to_y(69.0)
            y_r4 = to_y(85.8)
            y_r5 = to_y(102.6)
            
            capacity = sub.get("reload_capacity", RELOAD_CAPACITIES.get(key, 0))
            if capacity > 0:
                # 2x2 Square Bay for Forward Reloads & Supplies placed BOTTOM RIGHT (Rows 4 & 5, Columns 2 & 3)
                area_cx = (col_x[2] + col_x[3]) / 2.0
                area_cy = (y_r4 + y_r5) / 2.0
                draw_reload_supplies_bay(ax, area_cx, area_cy, capacity=capacity)

            # Draw Row 3 items across all 4 columns (above the 2x2 bay)
            for i, item in enumerate(arm_cfg.get('r3', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r3, item)

            # Draw Row 4 items (only columns 0 and 1; columns 2 & 3 occupied by top of 2x2 bay)
            for i, item in enumerate(arm_cfg.get('r4', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r4, item)

            # Draw Row 5 items (only columns 0 and 1; columns 2 & 3 occupied by bottom of 2x2 bay)
            for i, item in enumerate(arm_cfg.get('r5', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r5, item)'''

assert old_block in text, 'old_block not found'
text = text.replace(old_block, new_block)

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated 2x2 bay to bottom right in generate_canonical_player_cards.py!')
