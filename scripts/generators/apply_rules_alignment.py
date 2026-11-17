with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Update Special Rules box coordinates
old_rules = """            # --- 7. SPECIAL RULES & HISTORICAL NOTES BOX (Clean, 0% Errata Clutter) ---
            box_x0 = to_x(8.0)
            box_w = 155.5 * BROTHER_COMP
            box_h = 32.0 * BROTHER_COMP
            box_y0 = to_y(180.0)
            
            # Outer & Inner Frames for Rules Box
            panel_bg = patches.Rectangle((box_x0, box_y0), box_w, box_h, linewidth=0.9*BROTHER_COMP,
                                         edgecolor='#5A6B7C', facecolor='#FAF8F2', zorder=2)
            ax.add_patch(panel_bg)
            ax.add_patch(patches.Rectangle((box_x0 + 0.5*BROTHER_COMP, box_y0 + 0.5*BROTHER_COMP),
                                           box_w - 1.0*BROTHER_COMP, box_h - 1.0*BROTHER_COMP,
                                           linewidth=0.3*BROTHER_COMP, edgecolor='#94A3B8', facecolor='none', zorder=2.1))
            
            # Header Bar
            header_txt = "SPECIAL RULES & HISTORICAL NOTES:"
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(152.8), header_txt, fontsize=5.0, weight='bold', color='#1E293B', zorder=3)
            
            # Subtle warm brass divider rule under header
            ax.plot([box_x0 + 3.0*BROTHER_COMP, box_x0 + box_w - 3.0*BROTHER_COMP], [to_y(154.5), to_y(154.5)],
                    color='#C08420', lw=0.6*BROTHER_COMP, zorder=2.5)
            
            # Clean Rules Text (Wrapped cleanly with textwrap to strictly fit box margins!)
            clean_rules = sub['special_rules'].replace('[ERRATA] ', '').replace('[ERRATA]', '').strip()
            wrapped_rules = textwrap.fill(clean_rules, width=102)
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(157.2), wrapped_rules,
                    fontsize=4.2, color='#1E293B', va='top', linespacing=1.35, zorder=3)
            if sub.get('kaiten_note'):
                wrapped_kaiten = textwrap.fill(f"Kaiten Conversion: {sub['kaiten_note']}", width=102)
                ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(173.5), wrapped_kaiten,
                        fontsize=4.0, weight='bold', color='#881A1A', va='top', zorder=3)
            
            # Authentic Imperial Japanese Naval Hanko Seal in Special Rules Box
            draw_imperial_hanko(ax, box_x0 + box_w - 9.0*BROTHER_COMP, to_y(171.5), angle=4.0)"""

new_rules = """            # --- 7. SPECIAL RULES & HISTORICAL NOTES BOX (Clean, 0% Errata Clutter) ---
            # Perfectly aligned with Systems Status on the right (Y in [147.5, 179.0])
            box_x0 = to_x(8.0)
            box_w = 155.5 * BROTHER_COMP
            box_h = 31.5 * BROTHER_COMP
            box_y0 = to_y(179.0)
            
            # Outer & Inner Frames for Rules Box
            panel_bg = patches.Rectangle((box_x0, box_y0), box_w, box_h, linewidth=0.9*BROTHER_COMP,
                                         edgecolor='#5A6B7C', facecolor='#FAF8F2', zorder=2)
            ax.add_patch(panel_bg)
            ax.add_patch(patches.Rectangle((box_x0 + 0.5*BROTHER_COMP, box_y0 + 0.5*BROTHER_COMP),
                                           box_w - 1.0*BROTHER_COMP, box_h - 1.0*BROTHER_COMP,
                                           linewidth=0.3*BROTHER_COMP, edgecolor='#94A3B8', facecolor='none', zorder=2.1))
            
            # Header Bar
            header_txt = "SPECIAL RULES & HISTORICAL NOTES:"
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(152.3), header_txt, fontsize=5.0, weight='bold', color='#1E293B', zorder=3)
            
            # Subtle warm brass divider rule under header
            ax.plot([box_x0 + 3.0*BROTHER_COMP, box_x0 + box_w - 3.0*BROTHER_COMP], [to_y(154.0), to_y(154.0)],
                    color='#C08420', lw=0.6*BROTHER_COMP, zorder=2.5)
            
            # Clean Rules Text (Wrapped cleanly with textwrap to strictly fit box margins!)
            clean_rules = sub['special_rules'].replace('[ERRATA] ', '').replace('[ERRATA]', '').strip()
            wrapped_rules = textwrap.fill(clean_rules, width=102)
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(156.7), wrapped_rules,
                    fontsize=4.2, color='#1E293B', va='top', linespacing=1.35, zorder=3)
            if sub.get('kaiten_note'):
                wrapped_kaiten = textwrap.fill(f"Kaiten Conversion: {sub['kaiten_note']}", width=102)
                ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(172.5), wrapped_kaiten,
                        fontsize=4.0, weight='bold', color='#881A1A', va='top', zorder=3)
            
            # Authentic Imperial Japanese Naval Hanko Seal in Special Rules Box
            draw_imperial_hanko(ax, box_x0 + box_w - 9.0*BROTHER_COMP, to_y(170.5), angle=4.0)"""

if old_rules in text:
    text = text.replace(old_rules, new_rules)
    print("Replaced Special Rules coordinates cleanly!")
else:
    print("Warning: old_rules not matched directly, checking whitespace")
    # Try normalized replacement
    import re
    text = re.sub(r'# --- 7\. SPECIAL RULES & HISTORICAL NOTES BOX.*?draw_imperial_hanko\(.*?\)',
                  new_rules.strip(), text, flags=re.DOTALL)
    print("Replaced via regex!")

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated generate_canonical_player_cards.py.")
