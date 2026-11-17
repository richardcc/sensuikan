with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

target = """            # Header Bar
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
                        fontsize=4.0, weight='bold', color='#881A1A', va='top', zorder=3)"""

replacement = """            # Header Bar
            header_txt = "SPECIAL RULES & HISTORICAL NOTES:"
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(152.0), header_txt, fontsize=6.0, weight='bold', color='#1E293B', zorder=3)
            
            # Subtle warm brass divider rule under header
            ax.plot([box_x0 + 3.0*BROTHER_COMP, box_x0 + box_w - 3.0*BROTHER_COMP], [to_y(153.8), to_y(153.8)],
                    color='#C08420', lw=0.6*BROTHER_COMP, zorder=2.5)
            
            # Clean Rules Text (Wrapped cleanly with textwrap to strictly fit box margins!)
            clean_rules = sub['special_rules'].replace('[ERRATA] ', '').replace('[ERRATA]', '').strip()
            wrapped_rules = textwrap.fill(clean_rules, width=82)
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(156.5), wrapped_rules,
                    fontsize=5.3, color='#1E293B', va='top', linespacing=1.45, zorder=3)
            if sub.get('kaiten_note'):
                wrapped_kaiten = textwrap.fill(f"Kaiten Conversion: {sub['kaiten_note']}", width=82)
                ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(168.5), wrapped_kaiten,
                        fontsize=4.8, weight='bold', color='#881A1A', va='top', linespacing=1.4, zorder=3)"""

if target in code:
    code = code.replace(target, replacement)
    with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
        f.write(code)
    print("SUCCESS: Special rules font size increased!")
else:
    print("ERROR: Target not found")
