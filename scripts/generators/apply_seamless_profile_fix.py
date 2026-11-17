with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# Find the Section 3: Submarine Panoramic Illustration Window
old_sec3 = text[text.find('# --- 3. SUBMARINE PANORAMIC ILLUSTRATION WINDOW ---'):text.find('# --- 4. PATROL TRACK')]

new_sec3 = """# --- 3. SUBMARINE PANORAMIC ILLUSTRATION WINDOW ---
            # Spans X in [20.5, 163.5] (width 143.0 mm) and Y in [21.0, 52.0] (height 31.0 mm)
            win_x0 = to_x(20.5)
            win_w = 143.0 * BROTHER_COMP
            win_h = 31.0 * BROTHER_COMP
            win_y0 = to_y(52.0)
            
            prof_path = sub.get('profile_image_path', '')
            prof_img = None
            bg_color_hex = '#FAF8F3'
            
            if os.path.exists(prof_path):
                raw_img = cv2.imread(prof_path)
                if raw_img is not None:
                    gray = cv2.cvtColor(raw_img, cv2.COLOR_BGR2GRAY)
                    dark_rows = np.where((gray < 185).any(axis=1))[0]
                    dark_cols = np.where((gray < 185).any(axis=0))[0]
                    if len(dark_rows) > 0 and len(dark_cols) > 0:
                        y_min, y_max = dark_rows.min(), dark_rows.max()
                        pad_y = 16
                        y0 = max(0, y_min - pad_y)
                        y1 = min(raw_img.shape[0], y_max + pad_y)
                        h = y1 - y0
                        target_ratio = 143.0 / 31.0  # 4.6129
                        w_target = int(h * target_ratio)
                        sub_crop = raw_img[y0:y1, :]
                        if w_target > sub_crop.shape[1]:
                            diff = w_target - sub_crop.shape[1]
                            left_pad = diff // 2
                            right_pad = diff - left_pad
                            # Replicate exact border background to eliminate 100% of color mismatch/leftover seams!
                            prof_img = cv2.copyMakeBorder(sub_crop, 0, 0, left_pad, right_pad, cv2.BORDER_REPLICATE)
                        else:
                            start_x = (sub_crop.shape[1] - w_target) // 2
                            prof_img = sub_crop[:, start_x:start_x + w_target]
                    else:
                        prof_img = raw_img
                        
                    # Sample corner background color so outer window rectangle matches 100%
                    bg_bgr = prof_img[0, 0]
                    bg_color_hex = '#{:02x}{:02x}{:02x}'.format(bg_bgr[2], bg_bgr[1], bg_bgr[0])

            # Museum Parchment Background & Double Technical Border (0% color mismatch seams!)
            outer_win = patches.Rectangle((win_x0, win_y0), win_w, win_h, linewidth=0.8*BROTHER_COMP,
                                          edgecolor='#1E293B', facecolor=bg_color_hex, zorder=2)
            ax.add_patch(outer_win)
            
            win_d = 0.5 * BROTHER_COMP
            inner_win = patches.Rectangle((win_x0 + win_d, win_y0 + win_d), win_w - 2*win_d, win_h - 2*win_d,
                                          linewidth=0.3*BROTHER_COMP, edgecolor='#64748B', facecolor='none', zorder=2.4)
            ax.add_patch(inner_win)
            
            if prof_img is not None:
                prof_rgb = cv2.cvtColor(prof_img, cv2.COLOR_BGR2RGB)
                ax.imshow(prof_rgb, extent=(win_x0 + win_d, win_x0 + win_w - win_d, win_y0 + win_d, win_y0 + win_h - win_d), zorder=2.3)
            
            # Subtle technical blueprint grid (lines every 10 mm and 5 mm)
            for gx in np.arange(25.0, 163.0, 10.0):
                ax.plot([to_x(gx), to_x(gx)], [win_y0 + win_d, win_y0 + win_h - win_d],
                        color='#0F172A', lw=0.25*BROTHER_COMP, alpha=0.035, zorder=2.35)
            for gy in np.arange(25.0, 52.0, 5.0):
                ax.plot([win_x0 + win_d, win_x0 + win_w - win_d], [to_y(gy), to_y(gy)],
                        color='#0F172A', lw=0.25*BROTHER_COMP, alpha=0.035, zorder=2.35)

            """

text = text.replace(old_sec3, new_sec3)

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Section 3 in generate_canonical_player_cards.py successfully!")
