import os
import re

card_script_path = 'scripts/generators/generate_canonical_player_cards.py'
with open(card_script_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update draw_card_slot text formatting:
old_slot_text = """    # Typography with Master Micro-Halo for 100% Guaranteed Contrast & Legibility (Enlarged Fonts)
    halo = [patheffects.withStroke(linewidth=2.2 * BROTHER_COMP, foreground='#FFFFFF')]
    if label:
        if sublabel:
            ax.text(cx, cy + 2.3*BROTHER_COMP, label, fontsize=4.9, ha='center', va='center',
                    weight='bold', color=text_color, zorder=5, path_effects=halo)
            ax.text(cx, cy - 2.7*BROTHER_COMP, sublabel, fontsize=3.8, ha='center', va='center',
                    weight='bold', color=subcolor, zorder=5, path_effects=halo)
        else:
            ax.text(cx, cy, label, fontsize=5.3, ha='center', va='center',
                    weight='bold', color=text_color, zorder=5, path_effects=halo)"""

new_slot_text = """    # Typography with Master Micro-Halo for 100% Guaranteed Contrast & Legibility
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

if old_slot_text in code:
    code = code.replace(old_slot_text, new_slot_text)
    print("Replaced draw_card_slot text formatting")
else:
    print("WARNING: old_slot_text not found")

# 2. Update Top Row (Aircraft & Events):
old_top_row = """            is_sentoku = ("Sen-Toku" in sub['class_name'])
            if is_sentoku:
                draw_card_slot(ax, to_x(178.5), top_y, label="M6A1", sublabel="#1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(195.0), top_y, label="M6A1", sublabel="#2", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(211.5), top_y, label="M6A1", sublabel="#3", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(228.0), top_y, label="EVT 1", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                if sub['has_aircraft']:
                    draw_card_slot(ax, to_x(178.5), top_y, label="AVION", sublabel="Status", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(178.5), top_y, is_inactive=True)
                draw_card_slot(ax, to_x(195.0), top_y, is_inactive=True)
                draw_card_slot(ax, to_x(211.5), top_y, label="EVT 1", bg='#FAF2E1', border='#C08420', text_color='#784B05')
                draw_card_slot(ax, to_x(228.0), top_y, label="EVT 2", bg='#FAF2E1', border='#C08420', text_color='#784B05')"""

new_top_row = """            is_sentoku = ("Sen-Toku" in sub['class_name'])
            if is_sentoku:
                draw_card_slot(ax, to_x(178.5), top_y, label="Aichi M6A1\\nStatus", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(195.0), top_y, label="Aichi M6A1\\nStatus", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(211.5), top_y, label="Aichi M6A1\\nStatus", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(228.0), top_y, label="Random\\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                if sub['has_aircraft']:
                    air_name = "Yokosuka\\nE14Y1 Status" if ("Glen" in str(sub.get('aircraft_type', '')) or "E14Y1" in str(sub.get('aircraft_type', ''))) else "Aircraft\\nStatus"
                    draw_card_slot(ax, to_x(178.5), top_y, label=air_name, bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(178.5), top_y, is_inactive=True)
                draw_card_slot(ax, to_x(195.0), top_y, is_inactive=True)
                draw_card_slot(ax, to_x(211.5), top_y, label="Random\\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
                draw_card_slot(ax, to_x(228.0), top_y, label="Random\\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')"""

if old_top_row in code:
    code = code.replace(old_top_row, new_top_row)
    print("Replaced top row aircraft & events")
else:
    print("WARNING: old_top_row not found")

# 3. Update Base Slots:
old_base = """            # --- 2. LEFT COLUMN: BASE SLOTS ---
            base_xs = to_x(10.0)
            draw_card_slot(ax, base_xs, to_y(28.5), label="Base", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(46.5), label="Mission", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(64.5), label="Port", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')"""

new_base = """            # --- 2. LEFT COLUMN: BASE SLOTS ---
            base_xs = to_x(10.0)
            draw_card_slot(ax, base_xs, to_y(28.5), label="Current\\nBase", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(46.5), label="Mission", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(64.5), label="At\\nPort", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')"""

if old_base in code:
    code = code.replace(old_base, new_base)
    print("Replaced base slots")
else:
    print("WARNING: old_base not found")

# 4. Update Patrol Track:
old_patrol = """                if p_name == "Transit":
                    lbl = "Transit"
                    sublbl = "Start" if i == 0 else "End"
                    draw_card_slot(ax, to_x(p_center), pat_y, label=lbl, sublabel=sublbl,
                                   bg='#E2EAF0', border='#3B5B75', text_color='#1E3547')
                elif p_name.startswith("Stat"):
                    parts = p_name.split()
                    sub_num = parts[1] if len(parts) > 1 else ""
                    draw_card_slot(ax, to_x(p_center), pat_y, label="On Stat", sublabel=sub_num,
                                   bg='#F4F2EB', border='#64748B', text_color='#2A3A4A')
                elif p_name in ["Penetrate", "Attack", "Egress", "Recover"]:
                    draw_card_slot(ax, to_x(p_center), pat_y, label=p_name, sublabel="Phase",
                                   bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
                else: # Inactive slot
                    draw_card_slot(ax, to_x(p_center), pat_y, is_inactive=True)"""

new_patrol = """                if p_name == "Transit":
                    draw_card_slot(ax, to_x(p_center), pat_y, label="Transit",
                                   bg='#E2EAF0', border='#3B5B75', text_color='#1E3547')
                elif p_name.startswith("Stat"):
                    draw_card_slot(ax, to_x(p_center), pat_y, label="On\\nStation",
                                   bg='#F4F2EB', border='#64748B', text_color='#2A3A4A')
                elif p_name in ["Penetrate", "Attack", "Egress", "Recover"]:
                    draw_card_slot(ax, to_x(p_center), pat_y, label=p_name,
                                   bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
                else: # Inactive slot
                    draw_card_slot(ax, to_x(p_center), pat_y, is_inactive=True)"""

if old_patrol in code:
    code = code.replace(old_patrol, new_patrol)
    print("Replaced patrol track")
else:
    print("WARNING: old_patrol not found")

# 5. Update Damage Tracks:
old_dmg = """            # Markers (Col 0 at X = 10.0 mm, vertically aligned with Base/Mission/Port)
            draw_card_slot(ax, base_xs, dmg_y_flood, label="Flood M", bg='#EBF1F5', border='#385C7E', text_color='#1B3654')
            draw_card_slot(ax, base_xs, dmg_y_hull, label="Hull M", bg='#F5EDE7', border='#8C4332', text_color='#5C1E12')
            
            # 9 Slots from X = 20.5 to X = 163.5 (Centers: 28.0 to 156.0)
            dmg_centers = np.linspace(28.0, 156.0, 9)
            dmg_cap = sub.get("damage_capacity", {"flooding": 8, "hull": 8})
            max_fld = dmg_cap.get("flooding", 8)
            max_hull = dmg_cap.get("hull", 8)

            # Flooding Track: 1..max_fld, then Surface, then clean inactive
            for i in range(9):
                if i < max_fld:
                    level = (i + 1) / float(max_fld + 1)
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label=f"Fld {i+1}", bg='#F1F5F8', border='#385C7E', text_color='#1B3654',
                                   water_level=level)
                elif i == max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label="Surface", bg='#DFEEF5', border='#2A6788', text_color='#13445C')
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)
            
            # Hull Damage Track: 1..max_hull (heat progression), then SUNK, then clean inactive
            if max_hull == 8:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#CA866D', '#B9634E', '#A53E30', '#881A1A']
            elif max_hull == 6:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#B9634E', '#881A1A']
            elif max_hull == 2:
                hull_palette = ['#EEDCC8', '#A53E30']
            else:
                hull_palette = ['#EEDCC8'] * max_hull

            for i in range(9):
                if i < max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull,
                                   label=f"Hull {i+1}", bg=hull_palette[i], border='#8C3524', text_color='#4A150C')
                elif i == max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull,
                                   label="SUNK", bg='#FCE8E8', border='#7A1818', text_color='#7A1818', is_sunk=True)
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, is_inactive=True)"""

new_dmg = """            # Markers (Col 0 at X = 10.0 mm, vertically aligned with Base/Mission/Port)
            draw_card_slot(ax, base_xs, dmg_y_flood, label="Flooding\\nMarker", bg='#EBF1F5', border='#385C7E', text_color='#1B3654')
            draw_card_slot(ax, base_xs, dmg_y_hull, label="Hull Damage\\nMarker", bg='#F5EDE7', border='#8C4332', text_color='#5C1E12')
            
            # 9 Slots from X = 20.5 to X = 163.5 (Centers: 28.0 to 156.0)
            dmg_centers = np.linspace(28.0, 156.0, 9)
            dmg_cap = sub.get("damage_capacity", {"flooding": 8, "hull": 8})
            max_fld = dmg_cap.get("flooding", 8)
            max_hull = dmg_cap.get("hull", 8)

            # Flooding Track: Flooding on every slot, then Surface, then clean inactive
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
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)
            
            # Hull Damage Track: Hull Damage on every slot, then SUNK, then clean inactive
            if max_hull == 8:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#CA866D', '#B9634E', '#A53E30', '#881A1A']
            elif max_hull == 6:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#B9634E', '#881A1A']
            elif max_hull == 2:
                hull_palette = ['#EEDCC8', '#A53E30']
            else:
                hull_palette = ['#EEDCC8'] * max_hull

            for i in range(9):
                if i < max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull,
                                   label="Hull\\nDamage", bg=hull_palette[i], border='#8C3524', text_color='#4A150C')
                elif i == max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull,
                                   label="SUNK", bg='#FCE8E8', border='#7A1818', text_color='#7A1818', is_sunk=True)
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, is_inactive=True)"""

if old_dmg in code:
    code = code.replace(old_dmg, new_dmg)
    print("Replaced damage tracks")
else:
    print("WARNING: old_dmg not found")

# 6. Update Crew Status:
old_crew = """            if is_midget:
                # Ko-Hyoteki 2-man midget crew layout
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Officer", sublabel="Captain", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Petty Off", sublabel="Crewman", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="Midget", sublabel="Gunnery", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Superior", sublabel="Comms", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Boat", sublabel="Handling", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2
                for ci in range(6):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew", sublabel="Quality", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            elif is_sentoku:
                # Sen-Toku Carrier Crew layout (3 Pilots!)
                # Row 1: Captain, Engineer, XO, Nav, Medic, Pilot 1, Pilot 2
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="Officer", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", sublabel="Officer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", sublabel="Officer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", sublabel="Officer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", sublabel="Officer", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot #1", sublabel="Aichi M6A1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, label="Pilot #2", sublabel="Aichi M6A1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                
                # Row 2: Crew 1..5, Pilot 3, Crew Quality
                for ci in range(5):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", sublabel=f"#{ci+1}", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, label="Pilot #3", sublabel="Aichi M6A1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew", sublabel="Quality", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                # Standard Fleet Submarines
                has_air = sub['has_aircraft']
                # Row 1: Captain, Engineer, XO, Nav, Medic, Pilot (if plane), N/A
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="Officer", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", sublabel="Officer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", sublabel="Officer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", sublabel="Officer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", sublabel="Officer", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                if has_air:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", sublabel="Officer", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2: Crew 1..4, N/A, N/A, Crew Quality
                for ci in range(4):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", sublabel=f"#{ci+1}", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew", sublabel="Quality", bg='#FAF2E1', border='#C08420', text_color='#784B05')"""

new_crew = """            if is_midget:
                # Ko-Hyoteki 2-man midget crew layout
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Petty Off", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="Midget", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Superior", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Boat", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2
                for ci in range(6):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            elif is_sentoku:
                # Sen-Toku Carrier Crew layout (3 Pilots!)
                # Row 1: Captain, Engineer, XO, Nav., Medic, Pilot #1, Pilot #2
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot #1", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, label="Pilot #2", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                
                # Row 2: Crew, Crew, Crew, Crew, Crew, Pilot #3, Crew Quality
                for ci in range(5):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, label="Pilot #3", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                # Standard Fleet Submarines
                has_air = sub['has_aircraft']
                # Row 1: Captain, Engineer, XO, Nav., Medic, Pilot (if plane), N/A
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                if has_air:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2: Crew, Crew, Crew, Crew, N/A, N/A, Crew Quality
                for ci in range(4):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", bg='#FAF2E1', border='#C08420', text_color='#784B05')"""

if old_crew in code:
    code = code.replace(old_crew, new_crew)
    print("Replaced crew status")
else:
    print("WARNING: old_crew not found")

# 7. Update Systems drawing (remove sublabel='Status'):
old_sys_draw = """                    draw_card_slot(ax, cx, to_y(y_val), label=item, sublabel="Status",
                                   bg='#FBF7E9' if is_errata_box else '#F4F5F7',
                                   border='#9E782F' if is_errata_box else '#475569',
                                   text_color='#543D10' if is_errata_box else '#1E293B')"""

new_sys_draw = """                    draw_card_slot(ax, cx, to_y(y_val), label=item, sublabel="",
                                   bg='#FBF7E9' if is_errata_box else '#F4F5F7',
                                   border='#9E782F' if is_errata_box else '#475569',
                                   text_color='#543D10' if is_errata_box else '#1E293B')"""

if old_sys_draw in code:
    code = code.replace(old_sys_draw, new_sys_draw)
    print("Replaced systems drawing")
else:
    print("WARNING: old_sys_draw not found")

with open(card_script_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("All exact Vassal text updates applied successfully!")
