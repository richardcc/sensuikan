with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update draw_section_header_plaque to support optional fontsize
old_def = """def draw_section_header_plaque(ax, x0, y_mid, text, width, h=3.6*BROTHER_COMP):
    y0 = y_mid - h/2.0
    # Technical plate background
    ax.add_patch(patches.Rectangle((x0, y0), width, h, linewidth=0.45*BROTHER_COMP,
                                   edgecolor='#5A6B7C', facecolor='#EAE5DB', zorder=2.8))
    # 4 corner micro-rivets
    r_rivet = 0.32 * BROTHER_COMP
    for rx, ry in [(x0 + 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                   (x0 + width - 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                   (x0 + 0.8*BROTHER_COMP, y0 + h - 0.8*BROTHER_COMP),
                   (x0 + width - 0.8*BROTHER_COMP, y0 + h - 0.8*BROTHER_COMP)]:
        ax.add_patch(patches.Circle((rx, ry), r_rivet, facecolor='#78716C', edgecolor='#292524', lw=0.2*BROTHER_COMP, zorder=2.9))
        ax.add_patch(patches.Circle((rx - 0.08*BROTHER_COMP, ry + 0.08*BROTHER_COMP), 0.09*BROTHER_COMP, facecolor='#FFFFFF', edgecolor='none', zorder=3.0))
    # Text centered
    ax.text(x0 + width/2.0, y_mid, text, fontsize=4.2, weight='bold', color='#1E293B', ha='center', va='center', zorder=3.1)"""

new_def = """def draw_section_header_plaque(ax, x0, y_mid, text, width, h=3.6*BROTHER_COMP, fontsize=None):
    y0 = y_mid - h/2.0
    # Technical plate background
    ax.add_patch(patches.Rectangle((x0, y0), width, h, linewidth=0.45*BROTHER_COMP,
                                   edgecolor='#5A6B7C', facecolor='#EAE5DB', zorder=2.8))
    # 4 corner micro-rivets
    r_rivet = 0.32 * BROTHER_COMP
    for rx, ry in [(x0 + 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                   (x0 + width - 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                   (x0 + 0.8*BROTHER_COMP, y0 + h - 0.8*BROTHER_COMP),
                   (x0 + width - 0.8*BROTHER_COMP, y0 + h - 0.8*BROTHER_COMP)]:
        ax.add_patch(patches.Circle((rx, ry), r_rivet, facecolor='#78716C', edgecolor='#292524', lw=0.2*BROTHER_COMP, zorder=2.9))
        ax.add_patch(patches.Circle((rx - 0.08*BROTHER_COMP, ry + 0.08*BROTHER_COMP), 0.09*BROTHER_COMP, facecolor='#FFFFFF', edgecolor='none', zorder=3.0))
    # Text centered
    fs = fontsize if fontsize is not None else (4.2 if h >= 3.0*BROTHER_COMP else 3.8)
    ax.text(x0 + width/2.0, y_mid, text, fontsize=fs, weight='bold', color='#1E293B', ha='center', va='center', zorder=3.1)"""

if old_def in text:
    text = text.replace(old_def, new_def)
    print("Updated draw_section_header_plaque definition.")
else:
    print("Warning: old_def not matched directly.")

# 2. Update Patrol Track header
old_patrol = 'ax.text(to_x(20.5), to_y(56.2), "PATROL TRACK (TRANSIT & ON-STATION PHASES):", fontsize=4.4, weight=\'bold\', color=\'#1E293B\', zorder=3)'
new_patrol = 'draw_section_header_plaque(ax, to_x(20.5), to_y(54.5), "PATROL TRACK (TRANSIT & ON-STATION PHASES)", width=143.0*BROTHER_COMP, h=3.0*BROTHER_COMP)'

if old_patrol in text:
    text = text.replace(old_patrol, new_patrol)
    print("Updated Patrol Track header plaque.")
else:
    print("Warning: old_patrol not matched.")

# 3. Update Damage Tracks header
old_dmg = 'ax.text(to_x(20.5), to_y(74.0), "DAMAGE TRACKS  (FLOODING & HULL DAMAGE)", fontsize=4.4, weight=\'bold\', color=\'#1E293B\', zorder=3)'
new_dmg = 'draw_section_header_plaque(ax, to_x(20.5), to_y(73.5), "DAMAGE TRACKS (FLOODING & HULL DAMAGE)", width=143.0*BROTHER_COMP, h=2.5*BROTHER_COMP)'

if old_dmg in text:
    text = text.replace(old_dmg, new_dmg)
    print("Updated Damage Tracks header plaque.")
else:
    print("Warning: old_dmg not matched.")

# 4. Update Crew Status header
old_crew = 'ax.text(to_x(20.5), to_y(109.8), "CREW STATUS & CREW QUALITY", fontsize=4.8, weight=\'bold\', color=\'#1E293B\', zorder=3)'
new_crew = 'draw_section_header_plaque(ax, to_x(20.5), to_y(109.5), "CREW STATUS & CREW QUALITY", width=143.0*BROTHER_COMP, h=3.0*BROTHER_COMP)'

if old_crew in text:
    text = text.replace(old_crew, new_crew)
    print("Updated Crew Status header plaque.")
else:
    print("Warning: old_crew not matched.")

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("generate_canonical_player_cards.py updated with all boxed section headers!")
