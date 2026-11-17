import re

with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update get_realistic_counter_img
new_get_realistic = '''def get_realistic_counter_img(label, sublabel):
    lbl = (label or "").strip()
    sub = (sublabel or "").strip()
    norm = (lbl + " " + sub).replace("\\n", " ").strip()
    norm_lower = norm.lower()
    
    target_file = None
    
    # 1. Command & Crew
    if "captain" in norm_lower:
        target_file = "counter_captain_portrait.png"
    elif "xo" in norm_lower:
        target_file = "counter_xo_portrait.png"
    elif "engineer" in norm_lower:
        target_file = "counter_engineer_portrait.png"
    elif "nav." in norm_lower or "navigator" in norm_lower:
        target_file = "counter_navigator_portrait.png"
    elif "medic" in norm_lower:
        target_file = "counter_medic_portrait.png"
    elif "quality" in norm_lower:
        target_file = "counter_order_golden_kite.png"
    elif "pilot" in norm_lower or "seiran" in norm_lower or "m6a1" in norm_lower or "e14y1" in norm_lower:
        target_file = "counter_seiran_floatplane.png"
    elif "crew" in norm_lower or "petty off" in norm_lower or "sailor" in norm_lower:
        target_file = "counter_sailors_crew.png"
        
    # 2. Torpedo tubes (digits 1..8 or T-1..T-8)
    elif lbl in ["1", "2", "3", "4", "5", "6", "7", "8"] or (lbl.isdigit() and 1 <= int(lbl) <= 8) or lbl.startswith("T-"):
        target_file = "counter_long_lance_torpedo.png"
        
    # 3. Reloads & Kaiten
    elif "reload" in norm_lower or "rld" in norm_lower:
        target_file = "counter_twin_torpedoes_rack.png"
    elif "kaiten" in norm_lower:
        target_file = "counter_kaiten_sub.png"
        
    # 4. Artillery, Ammo & AA
    elif "ammo" in norm_lower or "shell" in norm_lower:
        target_file = "counter_artillery_shell.png"
    elif any(g in norm_lower for g in ["140mm", "120mm", "100mm", "gun", "artillery"]):
        target_file = "counter_deck_gun_140mm.png"
    elif any(a in norm_lower for a in ["25mm", "13.1mm", "aa", "mg", "radar"]):
        target_file = "counter_aa_gun_25mm.png"
        
    # 5. Logistics, Cargo & Events
    elif "base" in norm_lower or "port" in norm_lower:
        target_file = "counter_naval_base.png"
    elif "mission" in norm_lower:
        target_file = "counter_tactical_mission.png"
    elif "event" in norm_lower or "evt" in norm_lower:
        target_file = "counter_tactical_event.png"
    elif any(s in norm_lower for s in ["supplies", "cargo", "daihatsu"]):
        target_file = "counter_supply_crates.png"
        
    # 6. Patrol & Operations
    elif "transit" in norm_lower or "station" in norm_lower or "on stat" in norm_lower:
        target_file = "counter_transit_patrol.png"
        
    # 7. Damage Gauges & Markers
    elif "flooding" in norm_lower or "flood" in norm_lower:
        target_file = "counter_naval_pressure_gauge.png"
    elif "hull" in norm_lower:
        target_file = "counter_hull_stress_dial.png"
        
    # 8. Mines & Mine doors
    elif "mine" in norm_lower and "door" not in norm_lower:
        target_file = "counter_contact_mine.png"
        
    # 9. Mechanical Systems
    elif "door" in norm_lower:
        target_file = "counter_watertight_door.png"
    elif "perisc" in norm_lower:
        target_file = "counter_periscope_optics.png"
    elif "hydro" in norm_lower:
        target_file = "counter_hydrophone_sonar.png"
    elif "radio" in norm_lower:
        target_file = "counter_radio_transmitter.png"
    elif "batt" in norm_lower:
        target_file = "counter_battery_cells.png"
    elif "fuel" in norm_lower:
        target_file = "counter_fuel_tank.png"
    elif "crane" in norm_lower or "hangar" in norm_lower:
        target_file = "counter_aircraft_crane.png"
    elif "plane" in norm_lower:
        target_file = "counter_dive_planes.png"
    elif "motor" in norm_lower or "mtr" in norm_lower:
        target_file = "counter_electric_motor.png"
    elif "engine" in norm_lower or "eng" in norm_lower or "diesel" in norm_lower:
        target_file = "counter_diesel_engine.png"
        
    if target_file:
        if target_file not in _REALISTIC_COUNTER_IMGS:
            p = os.path.join('images/counters/realistic', target_file)
            if os.path.exists(p):
                _REALISTIC_COUNTER_IMGS[target_file] = np.array(Image.open(p).convert('RGBA'))
            else:
                _REALISTIC_COUNTER_IMGS[target_file] = None
        return _REALISTIC_COUNTER_IMGS[target_file]
    return None'''

content = re.sub(r'def get_realistic_counter_img\(.*?\n(?=def )', new_get_realistic + '\n\n', content, flags=re.DOTALL)

# 2. Update Crew Section in generate_canonical_cards
crew_target = """            if is_midget:
                # Ko-Hyoteki 2-man midget crew layout
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="Officer", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
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
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", sublabel="Scout", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)
                
                # Row 2: Enlisted Crew count
                num_crew = 5
                if key in ["Kaidai_KD3_Class", "Kaidai_KD4_Class", "Kaidai_KD5_Class", "Kirai_Sen_Class"]:
                    num_crew = 4
                elif key == "Sen_Taka_Class":
                    num_crew = 3
                
                for ci in range(5):
                    is_active_crew = (ci < num_crew)
                    if is_active_crew:
                        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2,
                                       label="Crew", sublabel=f"#{ci+1}",
                                       bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                    else:
                        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew", sublabel="Quality", bg='#FAF2E1', border='#C08420', text_color='#784B05')"""

crew_replacement = """            if is_midget:
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
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')"""

if crew_target in content:
    content = content.replace(crew_target, crew_replacement)
    print("Crew section replaced successfully!")
else:
    print("WARNING: crew_target not found in content!")

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("generate_canonical_player_cards.py updated successfully.")
