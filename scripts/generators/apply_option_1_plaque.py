with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's locate draw_card_slot typography section
# We replaced it with Style C previously
target_start = "    # Typography: Estilo C (Grabado Imperial Oro/Latón con relieve y sombra fina) for realistic counters"
target_end = "def draw_nautical_chart_border"

start_idx = code.find(target_start)
end_idx = code.find(target_end)

if start_idx == -1 or end_idx == -1:
    print("ERROR: Could not find target section in generate_canonical_player_cards.py")
else:
    print(f"Found target section from {start_idx} to {end_idx}")
    
    new_typography_code = '''    # Typography: Opción 1 (Cartela Naval Técnica Inferior Azul Marino + Dorado con micro-remaches)
    if real_img is not None:
        # Realistic counter: draw dedicated technical lower plaque to keep artwork 100% visible
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
                # Torpedo tube numerals (1..8): circular brass/navy naval badge
                badge_r = 2.9 * BROTHER_COMP
                badge_y = cy - 3.8 * BROTHER_COMP
                ax.add_patch(patches.Circle((cx, badge_y), badge_r, facecolor='#0D1520', edgecolor='#C5A059', lw=0.9 * BROTHER_COMP, zorder=4.5))
                ax.add_patch(patches.Circle((cx, badge_y), badge_r - 0.45 * BROTHER_COMP, facecolor='none', edgecolor='#9E782F', lw=0.4 * BROTHER_COMP, zorder=4.6))
                ax.text(cx, badge_y, lines[0], fontsize=9.5, weight='bold', color='#FFE082', ha='center', va='center', zorder=5)
            else:
                # Lower rectangular technical plaque with gold rim and micro-rivets
                w_p = w_img - 0.4 * BROTHER_COMP
                x0 = cx - w_p / 2.0
                y0 = cy - img_hw + 0.2 * BROTHER_COMP
                h_p = (4.1 if len(lines) == 1 else (5.3 if len(lines) == 2 else 6.3)) * BROTHER_COMP
                
                # Dark navy body with brass trim
                ax.add_patch(patches.Rectangle((x0, y0), w_p, h_p, facecolor='#0D1520', edgecolor='#C5A059', lw=0.75 * BROTHER_COMP, alpha=0.94, zorder=4.5))
                # 4 micro gold corner rivets
                rivet_r = 0.20 * BROTHER_COMP
                for rx, ry in [(x0 + 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                               (x0 + w_p - 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                               (x0 + 0.8*BROTHER_COMP, y0 + h_p - 0.8*BROTHER_COMP),
                               (x0 + w_p - 0.8*BROTHER_COMP, y0 + h_p - 0.8*BROTHER_COMP)]:
                    ax.add_patch(patches.Circle((rx, ry), rivet_r, facecolor='#E2B765', edgecolor='#45300E', lw=0.2*BROTHER_COMP, zorder=4.8))
                
                y_center = y0 + h_p / 2.0
                if len(lines) == 1:
                    f_size = 5.2 if len(lines[0]) <= 7 else (4.5 if len(lines[0]) <= 11 else 3.8)
                    ax.text(cx, y_center, lines[0], fontsize=f_size, weight='bold', color='#FAF6ED', ha='center', va='center', zorder=5)
                else:
                    line_spacing = 2.1 * BROTHER_COMP
                    y_start = y_center + (len(lines) - 1) * (line_spacing / 2.0)
                    for l_i, l_text in enumerate(lines):
                        f_size = 4.4 if len(l_text) <= 8 else 3.7
                        c_col = '#FAF6ED' if l_i == 0 else '#E2B765'
                        ax.text(cx, y_start - l_i * line_spacing, l_text, fontsize=f_size, weight='bold', color=c_col, ha='center', va='center', zorder=5)
    else:
        # Pure technical / abstract slots (Flooding, Hull Damage, Surface, Sunk, Empty)
        font_effects = [patheffects.withStroke(linewidth=2.2 * BROTHER_COMP, foreground='#FFFFFF')]
        cur_text_color = text_color
        cur_subcolor = subcolor
        if label:
            if '\\n' in label:
                lines = label.split('\\n')
                line_count = len(lines)
                font_s = 5.0 if line_count == 2 else 3.9
                line_spacing = 2.9 * BROTHER_COMP
                y_start = cy + (line_count - 1) * (line_spacing / 2.0)
                for idx, l_text in enumerate(lines):
                    ax.text(cx, y_start - idx * line_spacing, l_text, fontsize=font_s, ha='center', va='center',
                            weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
            elif sublabel:
                ax.text(cx, cy + 2.3*BROTHER_COMP, label, fontsize=4.9, ha='center', va='center',
                        weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                ax.text(cx, cy - 2.7*BROTHER_COMP, sublabel, fontsize=3.8, ha='center', va='center',
                        weight='bold', color=cur_subcolor, zorder=5, path_effects=font_effects)
            else:
                if label.isdigit():
                    ax.text(cx, cy, label, fontsize=10.5, ha='center', va='center',
                            weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                else:
                    words = label.split()
                    if len(words) >= 2 and len(label) > 9:
                        mid = len(words) // 2
                        line1 = " ".join(words[:mid])
                        line2 = " ".join(words[mid:])
                        font_s = 4.7 if len(label) <= 15 else 3.9
                        line_spacing = 2.8 * BROTHER_COMP
                        ax.text(cx, cy + line_spacing / 2.0, line1, fontsize=font_s, ha='center', va='center',
                                weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                        ax.text(cx, cy - line_spacing / 2.0, line2, fontsize=font_s, ha='center', va='center',
                                weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                    else:
                        font_s = 5.3 if len(label) <= 6 else (4.6 if len(label) <= 10 else 3.9)
                        ax.text(cx, cy, label, fontsize=font_s, ha='center', va='center',
                                weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)

'''
    updated_code = code[:start_idx] + new_typography_code + code[end_idx:]
    
    # Also adjust alpha of real_img to 0.92 for vivid illustrations
    updated_code = updated_code.replace("alpha=0.86", "alpha=0.92")
    
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.write(updated_code)
    print("SUCCESS: generate_canonical_player_cards.py updated with Option 1 Navy Plaque!")
