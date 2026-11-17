with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = None
end_idx = None
for i, line in enumerate(lines):
    if 'is_midget = (' in line:
        start_idx = i + 2  # right after is_midget
    if 'box_x0 = to_x(8.0)' in line:
        end_idx = i - 2   # before # --- 7. SPECIAL RULES
        break

print(f'start_idx: {start_idx}, end_idx: {end_idx}')
print('First line to replace:', repr(lines[start_idx]))
print('Last line to replace:', repr(lines[end_idx]))

new_block = '''            if is_midget:
                # Ko-Hyoteki 2-man midget crew layout
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Petty Off", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="Midget\\nGunnery", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Superior\\nComms", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Boat\\nHandling", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2
                for ci in range(6):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            elif is_sentoku:
                # Sen-Toku Carrier Crew layout (3 Pilots!)
                # Row 1: Captain, Engineer, XO, Nav., Medic, Pilot, Pilot
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", sublabel="", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                
                # Row 2: Crew, Crew, Crew, Crew, Crew, Pilot, Crew Quality
                for ci in range(5):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", sublabel="", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                # Standard Fleet Submarines
                has_air = sub['has_aircraft']
                # Row 1: Captain, Engineer, XO, Nav., Medic, Pilot (if plane), Inactive
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", sublabel="", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                if has_air:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2: Enlisted Crew count (No #1..#5, exactly matching original game cards)
                num_crew = 5
                if key in ["Kaidai_KD3_Class", "Kaidai_KD4_Class", "Kaidai_KD5_Class", "Kirai_Sen_Class"]:
                    num_crew = 4
                elif key == "Sen_Taka_Class":
                    num_crew = 3
                
                for ci in range(5):
                    is_active_crew = (ci < num_crew)
                    if is_active_crew:
                        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2,
                                       label="Crew", sublabel="",
                                       bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                    else:
                        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')
'''

new_lines = lines[:start_idx] + [new_block + '\n'] + lines[end_idx+1:]
with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Successfully updated lines in generate_canonical_player_cards.py!')
