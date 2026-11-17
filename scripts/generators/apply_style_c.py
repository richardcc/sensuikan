import re

with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

target_str = """    # Typography with Master Micro-Halo for 100% Guaranteed Contrast & Legibility
    halo = [patheffects.withStroke(linewidth=2.2 * BROTHER_COMP, foreground='#FFFFFF')]
    if label:
        if '\\n' in label:
            lines = label.split('\\n')
            line_count = len(lines)
            font_s = 5.0 if line_count == 2 else 3.9
            line_spacing = 2.9 * BROTHER_COMP
            y_start = cy + (line_count - 1) * (line_spacing / 2.0)
            for idx, l_text in enumerate(lines):
                ax.text(cx, y_start - idx * line_spacing, l_text, fontsize=font_s, ha='center', va='center',
                        weight='bold', color=text_color, zorder=5, path_effects=halo)
        elif sublabel:
            ax.text(cx, cy + 2.3*BROTHER_COMP, label, fontsize=4.9, ha='center', va='center',
                    weight='bold', color=text_color, zorder=5, path_effects=halo)
            ax.text(cx, cy - 2.7*BROTHER_COMP, sublabel, fontsize=3.8, ha='center', va='center',
                    weight='bold', color=subcolor, zorder=5, path_effects=halo)
        else:
            # Single line label
            if label.isdigit():
                # Torpedo tube numerals (1..8) in authentic bold large font!
                ax.text(cx, cy, label, fontsize=10.5, ha='center', va='center',
                        weight='bold', color=text_color, zorder=5, path_effects=halo)
            else:
                words = label.split()
                if len(words) >= 2 and len(label) > 9:
                    mid = len(words) // 2
                    line1 = " ".join(words[:mid])
                    line2 = " ".join(words[mid:])
                    font_s = 4.7 if len(label) <= 15 else 3.9
                    line_spacing = 2.8 * BROTHER_COMP
                    ax.text(cx, cy + line_spacing / 2.0, line1, fontsize=font_s, ha='center', va='center',
                            weight='bold', color=text_color, zorder=5, path_effects=halo)
                    ax.text(cx, cy - line_spacing / 2.0, line2, fontsize=font_s, ha='center', va='center',
                            weight='bold', color=text_color, zorder=5, path_effects=halo)
                else:
                    font_s = 5.3 if len(label) <= 6 else (4.6 if len(label) <= 10 else 3.9)
                    ax.text(cx, cy, label, fontsize=font_s, ha='center', va='center',
                            weight='bold', color=text_color, zorder=5, path_effects=halo)"""

replacement_str = """    # Typography: Estilo C (Grabado Imperial Oro/Latón con relieve y sombra fina) for realistic counters
    if real_img is not None:
        font_effects = [
            patheffects.withStroke(linewidth=1.2 * BROTHER_COMP, foreground='#0A0F14'),
            patheffects.SimplePatchShadow(offset=(0.35 * BROTHER_COMP, -0.35 * BROTHER_COMP), shadow_rgbFace='#000000', alpha=0.65)
        ]
        cur_text_color = '#FFE082' if (label and label.isdigit()) else '#FBE29D'
        cur_subcolor = '#FBE29D'
        cur_weight = 'heavy'
    else:
        font_effects = [patheffects.withStroke(linewidth=2.2 * BROTHER_COMP, foreground='#FFFFFF')]
        cur_text_color = text_color
        cur_subcolor = subcolor
        cur_weight = 'bold'

    if label:
        if '\\n' in label:
            lines = label.split('\\n')
            line_count = len(lines)
            font_s = 5.2 if line_count == 2 else 4.0
            line_spacing = 2.9 * BROTHER_COMP
            y_start = cy + (line_count - 1) * (line_spacing / 2.0)
            for idx, l_text in enumerate(lines):
                ax.text(cx, y_start - idx * line_spacing, l_text, fontsize=font_s, ha='center', va='center',
                        weight=cur_weight, color=cur_text_color, zorder=5, path_effects=font_effects)
        elif sublabel:
            ax.text(cx, cy + 2.3*BROTHER_COMP, label, fontsize=4.9, ha='center', va='center',
                    weight=cur_weight, color=cur_text_color, zorder=5, path_effects=font_effects)
            ax.text(cx, cy - 2.7*BROTHER_COMP, sublabel, fontsize=3.8, ha='center', va='center',
                    weight=cur_weight, color=cur_subcolor, zorder=5, path_effects=font_effects)
        else:
            # Single line label
            if label.isdigit():
                # Torpedo tube numerals (1..8) in authentic bold large font!
                ax.text(cx, cy, label, fontsize=12.0, ha='center', va='center',
                        weight='heavy', color=cur_text_color, zorder=5, path_effects=font_effects)
            else:
                words = label.split()
                if len(words) >= 2 and len(label) > 9:
                    mid = len(words) // 2
                    line1 = " ".join(words[:mid])
                    line2 = " ".join(words[mid:])
                    font_s = 4.7 if len(label) <= 15 else 3.9
                    line_spacing = 2.8 * BROTHER_COMP
                    ax.text(cx, cy + line_spacing / 2.0, line1, fontsize=font_s, ha='center', va='center',
                            weight=cur_weight, color=cur_text_color, zorder=5, path_effects=font_effects)
                    ax.text(cx, cy - line_spacing / 2.0, line2, fontsize=font_s, ha='center', va='center',
                            weight=cur_weight, color=cur_text_color, zorder=5, path_effects=font_effects)
                else:
                    font_s = 5.3 if len(label) <= 6 else (4.6 if len(label) <= 10 else 3.9)
                    ax.text(cx, cy, label, fontsize=font_s, ha='center', va='center',
                            weight=cur_weight, color=cur_text_color, zorder=5, path_effects=font_effects)"""

# Also update alpha to 0.86
code = code.replace("ax.imshow(real_img, extent=(cx - img_hw, cx + img_hw, cy - img_hw, cy + img_hw), zorder=3.4, alpha=0.82)",
                    "ax.imshow(real_img, extent=(cx - img_hw, cx + img_hw, cy - img_hw, cy + img_hw), zorder=3.4, alpha=0.86)")

code_norm = code.replace("\r\n", "\n")
target_norm = target_str.replace("\r\n", "\n")

if target_norm in code_norm:
    code_norm = code_norm.replace(target_norm, replacement_str)
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.write(code_norm)
    print("SUCCESS: generate_canonical_player_cards.py updated with Style C!")
else:
    print("ERROR: Target string not found in normalized code")
