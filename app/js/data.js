
// =========================================================================
// IJN COMMANDER RANKS HIERARCHY
// =========================================================================
const RANKS = [
  "Sub-Lt (中尉)",
  "Lieutenant (大尉)",
  "LT Cdr (少佐)",
  "Commander (中佐)",
  "Captain (大佐)",
  "Rear Admiral (少将)"
];
window.RANKS = RANKS;

// =========================================================================
// SENSUiKAN: STATIC GAME DATABASES & CHART TEMPLATES
// =========================================================================
const SUB_DB = {"metadata": {"game_title": "Sensuikan: Japanese Fleet Submarines, 1941-45", "publisher": "Compass Games", "errata_version": "Official Errata and Clarifications (as of 31 Aug 2026)", "official_errata_applied": ["Submarine Mats (correction): Junsen J.3 includes Aft Torpedo Doors damage box in Systems Status.", "Submarine Mats - Sen-Toku (correction): All 8 tubes are Forward (none aft). Aft torpedo damage hits treated as No Effect.", "Submarine Patrol Log (correction): Sen-Toku availability updated to December 1944 (not September 1944).", "Submarine Mats - Kaiten Installation (clarification): Conversion occurs automatically on date (typically removes deck gun), but Kaiten carried ONLY on Kaiten missions.", "Countersheet (clarification): Daihatsu landing craft counter used on Transport Missions [7.4] as reminder."], "canonical_dimensions_mm": {"card_width": 240.0, "card_height": 198.0, "tray_outer_width": 247.6, "tray_outer_height": 205.6, "tray_pocket_width": 240.6, "tray_pocket_height": 198.6, "slot_size": 15.0, "sub_profile_frame_mm": {"x": 48.5, "y": 23.6, "width": 131.5, "height": 33.1}}, "canonical_duplex_structure": [{"sheet_number": 1, "family": "Kaidai (Inicios)", "pairing_logic": "Primeros submarinos de flota de entreguerras.", "side_a_key": "Kaidai KD3 Class", "side_b_key": "Kaidai KD4 Class"}, {"sheet_number": 2, "family": "Kaidai (Evolución)", "pairing_logic": "Estandarización de la espina dorsal de la flota.", "side_a_key": "Kaidai KD5 Class", "side_b_key": "Kaidai KD6 Class"}, {"sheet_number": 3, "family": "Kaidai Final & Especial", "pairing_logic": "Último Kaidai de la guerra + el único minador especializado.", "side_a_key": "Kaidai KD7 Class", "side_b_key": "Kirai-Sen Class"}, {"sheet_number": 4, "family": "Junsen (Cruceros I)", "pairing_logic": "Submarinos de crucero de gran alcance con hidroavión.", "side_a_key": "Junsen J IM Class", "side_b_key": "Junsen J2 Class"}, {"sheet_number": 5, "family": "Junsen II & Mando", "pairing_logic": "Submarinos insignia de escuadrilla de largo radio.", "side_a_key": "Junsen J3 Class", "side_b_key": "Type A Class"}, {"sheet_number": 6, "family": "Familia Type B", "pairing_logic": "Submarinos oceánicos con hidroavión (versión inicial y tardía).", "side_a_key": "Type B Class", "side_b_key": "Type B-3 Class"}, {"sheet_number": 7, "family": "Ataque Pesado (Nodrizas)", "pairing_logic": "El Type C (nodriza del Midget) emparejado con mando tardío.", "side_a_key": "Type C Class", "side_b_key": "Type A Modified"}, {"sheet_number": 8, "family": "Supertecnología 44-45", "pairing_logic": "Los 2 colosos finales: el superportaviones I-400 y el de alta velocidad.", "side_a_key": "Sen-Toku Class", "side_b_key": "Sen-Taka Class"}, {"sheet_number": 9, "family": "Operaciones Especiales", "pairing_logic": "La pareja oficial perfecta sin conflicto de mesa.", "side_a_key": "Type C3 Class", "side_b_key": "Type A Midget Submarine - Ko-Hyoteki"}], "total_classes": 18, "total_physical_sheets": 9}, "submarines": {"Kaidai_KD3_Class": {"class_name": "Kaidai KD3 Class", "full_title": "Kaidai KD3a / KD3b Class", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 6, "aft": 2, "reloads_fwd": 8, "reloads_aft": 2}, "deck_guns": {"main": "100mm Status", "ammo": 5, "aa": "13.1mm MG Status (x1)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Aft.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "330 Feet (100.6m)", "displacement": "1,800 tons", "speed": "20 knots", "range": "10,000 nm", "crew": 60, "produced": 9}, "special_rules": "Fast fleet attack submarine without aircraft. 8 total torpedo tubes (6 forward, 2 aft), 10 reloads (8 forward, 2 aft). Total capacity: 18 torpedoes.", "vassal_filename": "Kaidai KD3 Class.jpg", "vassal_image_path": "images/vassal/Kaidai KD3 Class.jpg", "profile_image_path": "images/subs/remastered/01_Kaidai_KD3.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 7, "hull": 7}, "crew_counters": 4, "duplex_print": {"sheet_number": 1, "side": "Side A (Front)", "page_number": 1, "family": "Early Kaidai Fleet Submarines", "paired_with": "Kaidai KD4 Class", "pairing_logic": "Primeros submarinos de flota de entreguerras."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["7", "", "tube"], ["8", "", "tube"]], "r3": [["Aft\nReload", "", "rld"], ["Aft\nReload", "", "rld"], null, null], "r4": [["120mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r5": [null, null, null, null], "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null]}, "shipyard_metadata": {"title": "KAIDAI  KD.3  CLASS", "subtitle": "FLEET SUBMARINE  |  KD3A / KD3B TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-53..I-60, I-63"]}, "reload_capacity": 10, "kaiten_note": null}, "Kaidai_KD4_Class": {"class_name": "Kaidai KD4 Class", "full_title": "Kaidai KD4 Class", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 6, "reloads_aft": 2}, "deck_guns": {"main": "100mm Status", "ammo": 5, "aa": "13.1mm MG Status (x1)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Aft.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "320 Feet (97.5m)", "displacement": "1,720 tons", "speed": "20 knots", "range": "10,000 nm", "crew": 58, "produced": 3}, "special_rules": "Compact Kaidai variant. 6 torpedo tubes total (4 forward, 2 aft), 8 reloads (6 forward, 2 aft). Total capacity: 14 torpedoes.", "vassal_filename": "Kaidai KD4 Class.jpg", "vassal_image_path": "images/vassal/Kaidai KD4 Class.jpg", "profile_image_path": "images/subs/remastered/02_Kaidai_KD4.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 7, "hull": 7}, "crew_counters": 4, "duplex_print": {"sheet_number": 1, "side": "Side B (Reverse)", "page_number": 2, "family": "Early Kaidai Fleet Submarines", "paired_with": "Kaidai KD3 Class", "pairing_logic": "Primeros submarinos de flota de entreguerras."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["Aft\nReload", "", "rld"], ["Aft\nReload", "", "rld"]], "r3": [["120mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null]}, "shipyard_metadata": {"title": "KAIDAI  KD.4  CLASS", "subtitle": "FLEET SUBMARINE  |  KD4 TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-61, I-62, I-64"]}, "reload_capacity": 8, "kaiten_note": null}, "Kaidai_KD5_Class": {"class_name": "Kaidai KD5 Class", "full_title": "Kaidai KD5 Class", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 6, "reloads_aft": 2}, "deck_guns": {"main": "100mm Status", "ammo": 5, "aa": "13.1mm MG Status (x1)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Aft.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "320 Feet (97.5m)", "displacement": "1,730 tons", "speed": "20.5 knots", "range": "10,000 nm", "crew": 62, "produced": 3}, "special_rules": "Improved diving depth (75m). High speed fleet attack boat. 6 torpedo tubes (4 forward, 2 aft), 8 reloads (6 forward, 2 aft). Total capacity: 14 torpedoes.", "vassal_filename": "Kaidai KD5 Class.jpg", "vassal_image_path": "images/vassal/Kaidai KD5 Class.jpg", "profile_image_path": "images/subs/remastered/03_Kaidai_KD5.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 7, "hull": 7}, "crew_counters": 4, "duplex_print": {"sheet_number": 2, "side": "Side A (Front)", "page_number": 3, "family": "Evolved Kaidai Fleet Submarines", "paired_with": "Kaidai KD6 Class", "pairing_logic": "Estandarización de la espina dorsal de la flota."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["Aft\nReload", "", "rld"], ["Aft\nReload", "", "rld"]], "r3": [["100mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "r5": [null, null, null, null], "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null]}, "shipyard_metadata": {"title": "KAIDAI  KD.5  CLASS", "subtitle": "FLEET SUBMARINE  |  KD5 TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-65..I-67"]}, "reload_capacity": 8, "kaiten_note": "In 4/45 Kaiten may be installed. If so, remove deck gun. Kaiten carried ONLY on Kaiten missions."}, "Kaidai_KD6_Class": {"class_name": "Kaidai KD6 Class", "full_title": "Kaidai KD6a / KD6b Class", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 6, "reloads_aft": 2}, "deck_guns": {"main": "100mm Status", "ammo": 5, "aa": "13.1mm MG Status (x1)"}, "has_kaiten": true, "kaiten_note": "In 1945 may convert to Kaiten carrier (removes deck gun). Kaiten carried ONLY on Kaiten missions.", "systems_status": ["F.Doors", "Aft.Doors", "Radio", "Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "344 Feet (104.9m)", "displacement": "1,400 tons", "speed": "23 knots", "range": "14,000 nm", "crew": 70, "produced": 8}, "special_rules": "Fastest pre-war IJN submarines (23 knots surface). 6 torpedo tubes (4 forward, 2 aft), 8 reloads (6 forward, 2 aft). Total capacity: 14 torpedoes.\nCargo Conversion: In 1/43, conversion to a cargo submarine may occur and a Daihatsu landing craft carried. If so, remove the deck gun.", "vassal_filename": "Kaidai KD6 Class.jpg", "vassal_image_path": "images/vassal/Kaidai KD6 Class.jpg", "profile_image_path": "images/subs/remastered/04_Kaidai_KD6.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 7, "hull": 7}, "crew_counters": 4, "duplex_print": {"sheet_number": 2, "side": "Side B (Reverse)", "page_number": 4, "family": "Evolved Kaidai Fleet Submarines", "paired_with": "Kaidai KD5 Class", "pairing_logic": "Estandarización de la espina dorsal de la flota."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["Aft\nReload", "", "rld"], ["Aft\nReload", "", "rld"]], "r3": [["100mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [["Daihatsu", "Landing", "cargo"], ["13.1mm\nStatus", "", "aa"], null, null], "r5": [null, null, null, null], "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null]}, "shipyard_metadata": {"title": "KAIDAI  KD.6  CLASS", "subtitle": "FLEET SUBMARINE  |  KD6A / KD6B TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-68..I-75, I-176"]}, "reload_capacity": 8}, "Kaidai_KD7_Class": {"class_name": "Kaidai KD7 Class", "full_title": "Kaidai KD7 Class", "available_date": "Available 1942", "patrol_length": "2 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 6, "reloads_aft": 0}, "deck_guns": {"main": "120mm Status", "ammo": 5, "aa": "25mm AA Status (x2)"}, "has_kaiten": true, "kaiten_note": null, "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "346 Feet (105.5m)", "displacement": "1,630 tons", "speed": "23 knots", "range": "8,000 nm", "crew": 86, "produced": 10}, "special_rules": "Wartime standardized attack class. 6 torpedo tubes (4 forward, 2 aft), 6 forward reloads. Total capacity: 12 torpedoes. Powerful 25mm AA guns.", "vassal_filename": "Kaidai KD7 Class.jpg", "vassal_image_path": "images/vassal/Kaidai KD7 Class.jpg", "profile_image_path": "images/subs/remastered/05_Kaidai_KD7.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 7, "hull": 7}, "crew_counters": 4, "duplex_print": {"sheet_number": 3, "side": "Side A (Front)", "page_number": 5, "family": "Late Kaidai & Minelayer Class", "paired_with": "Kirai-Sen Class", "pairing_logic": "Último Kaidai de la guerra + el único minador especializado."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["25mm AA\nStatus #1", "", "aa"], ["25mm AA\nStatus #2", "", "aa"]], "r3": [["120mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null, null]}, "shipyard_metadata": {"title": "KAIDAI  KD.7  CLASS", "subtitle": "FINAL FLEET SUBMARINE  |  KD7 TYPE", "badges": ["AVAILABLE: SEP 1942", "PATROLS: 2 MONTHS", "HULLS: I-177..I-185"]}, "reload_capacity": 6}, "Kirai_Sen_Class": {"class_name": "Kirai-Sen Class", "full_title": "Kirai-Sen Submarine Minelayer (I-121 Class)", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 4, "aft": 0, "reloads_fwd": 8, "reloads_aft": 0}, "mines": {"dispensers": "Aft Mine Dispenser Tubes", "doors": "Aft Mine Doors", "capacity": 42}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "None"}, "has_kaiten": false, "systems_status": ["F.Doors (Odd)", "F.Doors (Even)", "Radio", "Dive Planes", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "279.5 Feet (85.2m)", "displacement": "1,383 tons", "speed": "14.5 knots", "range": "10,500 nm", "crew": 75, "produced": 4}, "special_rules": "Specialized minelayer (I-121..I-124). 4 bow torpedo tubes + 8 forward reloads (12 torpedoes total). Carries 42 naval mines in aft internal tubes. Every patrol is automatically a minelaying mission.\nSpecial Damage Routing: Damage to 'Aft Torpedo Doors' on Chart [E6] instead causes damage to the Aft Mine Doors.", "vassal_filename": "Kirai-Sen Class.jpg", "vassal_image_path": "images/vassal/Kirai-Sen Class.jpg", "profile_image_path": "images/subs/remastered/06_Kirai_Sen.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 4, "duplex_print": {"sheet_number": 3, "side": "Side B (Reverse)", "page_number": 6, "family": "Late Kaidai & Minelayer Class", "paired_with": "Kaidai KD7 Class", "pairing_logic": "Último Kaidai de la guerra + el único minador especializado."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["Aft Mine\nDoors", "", "mine_door"], ["Mines\nx42", "", "mines"], null, null], "r3": [["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["Mine Tunnels", "Mine Handling", "Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null, null]}, "shipyard_metadata": {"title": "KIRAI-SEN  CLASS  (I-121)", "subtitle": "SUBMARINE MINELAYER  |  KRS TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-121, 122, 123, 124"]}, "reload_capacity": 8, "kaiten_note": null}, "Junsen_J_IM_Class": {"class_name": "Junsen J. 1M Class", "full_title": "Junsen J. 1 Modified Class", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": true, "aircraft_type": "Yokosuka E14Y1 Glen", "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 12, "reloads_aft": 2}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "13.1mm MG Status (x1)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "320 Feet (97.5m)", "displacement": "2,135 tons", "speed": "18 knots", "range": "14,000 nm", "crew": 80, "produced": 1}, "special_rules": "Junsen I modified with seaplane hangar. 6 torpedo tubes (4 forward, 2 aft), 14 reloads (12 forward, 2 aft). Total capacity: 20 torpedoes. Twin 140mm deck guns.", "vassal_filename": "Junsen J IM Class.jpg", "vassal_image_path": "images/vassal/Junsen J IM Class.jpg", "profile_image_path": "images/subs/remastered/07_Junsen_J1M.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 4, "side": "Side A (Front)", "page_number": 7, "family": "Junsen Cruiser Submarines I", "paired_with": "Junsen J2 Class", "pairing_logic": "Submarinos de crucero de gran alcance con hidroavión."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["Aft\nReload", "", "rld"], ["Aft\nReload", "", "rld"]], "r3": [["140mm\nStatus #1", "", "gun"], ["Ammo\nx5", "", "ammo"], ["140mm\nStatus #2", "", "gun"], ["Ammo\nx5", "", "ammo"]], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["Radio", "Dive Planes", "Hangar", "Crane", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null, null]}, "shipyard_metadata": {"title": "JUNSEN  J.1M  CLASS  (I-5)", "subtitle": "AIRCRAFT CRUISER SUBMARINE  |  J1M TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-5 (MODIFIED)"]}, "reload_capacity": 14, "kaiten_note": null}, "Junsen_J2_Class": {"class_name": "Junsen J. 2 Class", "full_title": "Junsen J. 2 Class (I-6)", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": true, "aircraft_type": "Watanabe E9W1 Slim / Yokosuka E14Y1", "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 9, "reloads_aft": 2}, "deck_guns": {"main": "127mm Gun Status", "ammo": 5, "aa": "13.1mm MG Status (x1)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Aft.Doors", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "323 Feet (98.5m)", "displacement": "2,243 tons", "speed": "20 knots", "range": "20,000 nm", "crew": 92, "produced": 1}, "special_rules": "Equipped with aircraft hangar forward of conning tower. 6 torpedo tubes (4 forward, 2 aft), 11 reloads (9 forward, 2 aft). Total capacity: 17 torpedoes. 127mm dual-purpose deck gun.", "vassal_filename": "Junsen J2 Class.jpg", "vassal_image_path": "images/vassal/Junsen J2 Class.jpg", "profile_image_path": "images/subs/remastered/08_Junsen_J2.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 4, "side": "Side B (Reverse)", "page_number": 8, "family": "Junsen Cruiser Submarines I", "paired_with": "Junsen J IM Class", "pairing_logic": "Submarinos de crucero de gran alcance con hidroavión."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["Aft\nReload", "", "rld"], ["Aft\nReload", "", "rld"]], "r3": [["127mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [["13.1mm\nStatus", "", "aa"], null, null, null], "r5": [null, null, null, null], "sys": ["Crane", "Hangar", "Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null]}, "shipyard_metadata": {"title": "JUNSEN  J.2  CLASS  (I-6)", "subtitle": "AIRCRAFT CRUISER SUBMARINE  |  J2 TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-6"]}, "reload_capacity": 11, "kaiten_note": null}, "Junsen_J3_Class": {"class_name": "Junsen J. 3 Class", "full_title": "Junsen J. 3 Class (I-7, I-8)", "available_date": "Available December 1941", "patrol_length": "2 month patrols", "has_aircraft": true, "aircraft_type": "Yokosuka E14Y1 Status", "torpedo_tubes": {"fwd": 4, "aft": 2, "reloads_fwd": 15, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "13.1mm MG Status (x2)"}, "has_kaiten": true, "kaiten_note": "In 10/44 Kaiten may be installed. If so, remove aircraft. Kaiten carried ONLY on Kaiten missions.", "systems_status": ["F.Doors", "Aft.Doors", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "323 Feet (98.5m)", "displacement": "2,243 tons", "speed": "23 knots", "range": "14,000 nm", "crew": 100, "produced": 2}, "special_rules": "Equipped with aircraft hangar forward of conning tower. 6 torpedo tubes (4 forward, 2 aft), 15 forward reloads. Total capacity: 21 torpedoes. Systems Status includes Aft Torpedo Doors damage box.", "vassal_filename": "Junsen J3 Class.jpg", "vassal_image_path": "images/vassal/Junsen J3 Class.jpg", "profile_image_path": "images/subs/remastered/09_Junsen_J3.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 5, "side": "Side A (Front)", "page_number": 9, "family": "Junsen II & Command Submarines", "paired_with": "Type A Class", "pairing_logic": "Submarinos insignia de escuadrilla de largo radio."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"]], "r3": [["13.1mm\nStatus #1", "", "aa"], ["13.1mm\nStatus #2", "", "aa"], null, null], "r4": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "r5": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "sys": ["Crane", "Hangar", "Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null]}, "shipyard_metadata": {"title": "JUNSEN  J.3  CLASS  (I-7)", "subtitle": "FLAGSHIP CRUISER SUBMARINE  |  J3 TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-7, I-8"]}, "reload_capacity": 15}, "Type_A_Class": {"class_name": "Type A Class", "full_title": "Type A (Ko-gata) Command Submarine (I-9 Class)", "available_date": "Available December 1941", "patrol_length": "3 month patrols", "has_aircraft": true, "aircraft_type": "Yokosuka E14Y1 Glen", "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 12, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm Twin AA (x2)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "373 Feet (113.7m)", "displacement": "2,434 tons", "speed": "23.5 knots", "range": "16,000 nm", "crew": 104, "produced": 3}, "special_rules": "Squadron flagship with extended command facilities, scout seaplane, and 140mm deck gun. 6 forward torpedo tubes, 12 forward reloads. Total capacity: 18 torpedoes.", "vassal_filename": "Type A Class.jpg", "vassal_image_path": "images/vassal/Type A Class.jpg", "profile_image_path": "images/subs/remastered/10_Type_A.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 5, "side": "Side B (Reverse)", "page_number": 10, "family": "Junsen II & Command Submarines", "paired_with": "Junsen J3 Class", "pairing_logic": "Submarinos insignia de escuadrilla de largo radio."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["25mm Twin\nStatus #1", "", "aa"], ["25mm Twin\nStatus #2", "", "aa"]], "r3": [["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["Radio", "Dive Planes", "Hangar", "Crane", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null, null]}, "shipyard_metadata": {"title": "TYPE  A  CLASS  (I-9)", "subtitle": "SQUADRON FLAGSHIP SUBMARINE  |  KO-GATA TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 3 MONTHS", "HULLS: I-9, I-10, I-11"]}, "reload_capacity": 12, "kaiten_note": null}, "Type_B_Class": {"class_name": "Type B Class", "full_title": "Type B (Otsu-gata) Cruiser Submarine (I-15 Class)", "available_date": "Available December 1941", "patrol_length": "3 month patrols", "has_aircraft": true, "aircraft_type": "Yokosuka E14Y1 Glen", "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 11, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm Twin AA (x2)"}, "has_kaiten": true, "kaiten_note": "In 12/44 Kaiten may be installed with a second 25mm Twin AA Gun. If so, remove Deck Gun and aircraft. Kaiten carried ONLY on Kaiten missions.", "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "357 Feet (108.7m)", "displacement": "2,198 tons", "speed": "23.6 knots", "range": "14,000 nm", "crew": 94, "produced": 20}, "special_rules": "Most numerous and successful Japanese cruiser submarine class. Carries 1 Yokosuka E14Y1 scout seaplane. 6 forward torpedo tubes, 11 forward reloads. Total capacity: 17 torpedoes.", "vassal_filename": "Type B Class.jpg", "vassal_image_path": "images/vassal/Type B Class.jpg", "profile_image_path": "images/subs/remastered/12_Type_B.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 6, "side": "Side A (Front)", "page_number": 11, "family": "Type B Fleet Submarines", "paired_with": "Type B-3 Class", "pairing_logic": "Submarinos oceánicos con hidroavión (versión inicial y tardía)."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"]], "r3": [["25mm Twin\nStatus #1", "", "aa"], ["25mm Twin\nStatus #2", "", "aa"], null, null], "r4": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "r5": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "sys": ["Radio", "Dive Planes", "Hangar", "Crane", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null]}, "shipyard_metadata": {"title": "TYPE  B  CLASS  (I-15)", "subtitle": "OCEAN CRUISER SUBMARINE  |  OTSU-GATA TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 3 MONTHS", "HULLS: I-15..I-39 (20 BUILT)"]}, "reload_capacity": 11}, "Type_B_3_Class": {"class_name": "Type B-3 Class", "full_title": "Type B-3 Cruiser Submarine (I-56 / I-58 Class)", "available_date": "Available 1944", "patrol_length": "3 month patrols", "has_aircraft": true, "aircraft_type": "Yokosuka E14Y1 / 6 Kaiten", "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 13, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm Triple AA (x2)"}, "has_kaiten": true, "kaiten_note": "In 12/44 Kaiten may be installed with a second 25mm Twin AA Gun. If so, remove Deck Gun and aircraft. Kaiten carried ONLY on Kaiten missions.", "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "357 Feet (108.7m)", "displacement": "2,144 tons", "speed": "17.7 knots", "range": "21,000 nm", "crew": 94, "produced": 3}, "special_rules": "Late-war Kaiten carrier. Famous for sinking USS Indianapolis (I-58). 6 forward torpedo tubes, 13 forward reloads. Total capacity: 19 torpedoes. Equipped with Type 22 Radar.", "vassal_filename": "Type B-3 Class.jpg", "vassal_image_path": "images/vassal/Type B-3 Class.jpg", "profile_image_path": "images/subs/remastered/13_Type_B3.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 6, "side": "Side B (Reverse)", "page_number": 12, "family": "Type B Fleet Submarines", "paired_with": "Type B Class", "pairing_logic": "Submarinos oceánicos con hidroavión (versión inicial y tardía)."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"]], "r3": [["25mm Twin\nStatus #1", "", "aa"], ["25mm Twin\nStatus #2", "", "aa"], ["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"]], "r4": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "r5": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "sys": ["Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null, null]}, "shipyard_metadata": {"title": "TYPE  B.3  CLASS  (I-56)", "subtitle": "LATE CRUISER SUBMARINE  |  OTSU-KAI TYPE", "badges": ["AVAILABLE: JUL 1944", "PATROLS: 3 MONTHS", "HULLS: I-56, I-58"]}, "reload_capacity": 13}, "Type_C_Class": {"class_name": "Type C Class", "full_title": "Type C (Hei-gata) Attack Submarine (I-16 Class)", "available_date": "Available December 1941", "patrol_length": "3 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 8, "aft": 0, "reloads_fwd": 12, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm Twin AA (x2)"}, "has_kaiten": true, "kaiten_note": null, "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "358 Feet (109.3m)", "displacement": "2,184 tons", "speed": "23.6 knots", "range": "14,000 nm", "crew": 95, "produced": 8}, "special_rules": "Heavy torpedo attack boat: 8 forward torpedo tubes, 12 forward reloads (20 Type 95 torpedoes total). Carries 1 Type A Midget Submarine (Ko-Hyoteki) with 2 Type 97 midget torpedoes on aft deck.\nRadar: Type 22 AS/SS Radar available Dec. 1944 onwards.", "vassal_filename": "Type C Class.jpg", "vassal_image_path": "images/vassal/Type C Class.jpg", "profile_image_path": "images/subs/remastered/14_Type_C.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 7, "side": "Side A (Front)", "page_number": 13, "family": "Heavy Attack & Carrier Submarines", "paired_with": "Type A Modified", "pairing_logic": "El Type C (nodriza del Midget) emparejado con mando tardío."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["7", "", "tube"], ["8", "", "tube"]], "r3": [["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], ["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"]], "r4": [["25mm Twin\nStatus #1", "", "aa"], ["25mm Twin\nStatus #2", "", "aa"], null, null], "r5": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "sys": ["Type 22 Radar", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null]}, "shipyard_metadata": {"title": "TYPE  C  CLASS  (I-16)", "subtitle": "HEAVY ATTACK SUBMARINE  |  HEI-GATA TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: 3 MONTHS", "HULLS: I-16, 18, 20, 22, 24"]}, "reload_capacity": 12}, "Type_A_Modified": {"class_name": "Type A Modified", "full_title": "Type A Modified 2 (I-12 Class)", "available_date": "Available 1943", "patrol_length": "3 month patrols", "has_aircraft": true, "aircraft_type": "Yokosuka E14Y1 Glen", "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 6, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm AA (x2)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "373 Feet (113.7m)", "displacement": "2,934 tons", "speed": "17.7 knots", "range": "22,000 nm", "crew": 110, "produced": 1}, "special_rules": "Extended long-range cruiser submarine with enlarged hangar for 2 Aichi M6A1 Seiran bombers. 6 forward torpedo tubes, 6 forward reloads. Total capacity: 12 torpedoes. Equipped with Type 22 Radar.", "vassal_filename": "Type A Modified.jpg", "vassal_image_path": "images/vassal/Type A Modified.jpg", "profile_image_path": "images/subs/remastered/11_Type_A_Mod.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 7, "side": "Side B (Reverse)", "page_number": 14, "family": "Heavy Attack & Carrier Submarines", "paired_with": "Type C Class", "pairing_logic": "El Type C (nodriza del Midget) emparejado con mando tardío."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["25mm Single\nStatus", "", "aa"], null], "r3": [["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], null, null], "r4": [["25mm Triple\nStatus #1", "", "aa"], ["25mm Triple\nStatus #2", "", "aa"], null, null], "r5": [null, null, null, null], "sys": ["Radio", "Dive Planes", "Hangar", "Crane", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null, null]}, "shipyard_metadata": {"title": "TYPE  A  MODIFIED  (I-12)", "subtitle": "LATE COMMAND SUBMARINE  |  KO-GATA MOD TYPE", "badges": ["AVAILABLE: MAY 1945", "PATROLS: 3 MONTHS", "HULLS: I-12, I-13, I-14"]}, "reload_capacity": 6, "kaiten_note": null}, "Sen_Toku_Class": {"class_name": "Sen-Toku Class", "full_title": "Sen-Toku Submarine Aircraft Carrier (I-400 Class)", "available_date": "Available December 1944", "patrol_length": "4 month patrols", "has_aircraft": true, "aircraft_type": "Aichi M6A1 Seiran (x3)", "torpedo_tubes": {"fwd": 8, "aft": 0, "reloads_fwd": 12, "reloads_aft": 0}, "deck_guns": {"main": "140mm Status", "ammo": 5, "aa": "25mm Triple AA (x3)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Crane", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "400 Feet (122.0m)", "displacement": "5,223 tons", "speed": "18.7 knots", "range": "37,500 nm", "crew": 144, "produced": 3}, "special_rules": "Availability December 1944. Massive aircraft carrier submarine carrying 3 Aichi M6A1 Seiran bombers.\nArmament: All 8 torpedo tubes are Forward (12 forward reloads, 20 torpedoes total); any aft torpedo tube damage hits on Chart [E6] are treated as No Effect. Heavy gun armament with Ammo x6, 4x 25mm Triple AA guns, Mk 3 M1 Air Search and Mk 2 M2 Sea Search Radar.", "vassal_filename": "Sen-Toku Class.jpg", "vassal_image_path": "images/vassal/Sen-Toku Class.jpg", "profile_image_path": "images/subs/remastered/16_Sen_Toku.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Stat 7", "Transit"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 8, "side": "Side A (Front)", "page_number": 15, "family": "Advanced Naval Technology (1944–1945)", "paired_with": "Sen-Taka Class", "pairing_logic": "Los 2 colosos finales: el superportaviones I-400 y el de alta velocidad."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["7", "", "tube"], ["8", "", "tube"]], "r3": [["140mm\nStatus", "", "gun"], ["Ammo\nx5", "", "ammo"], ["Mk 3 M1\nAir Srch Radar", "", "radar"], ["Mk 2 M2\nSea Srch Radar", "", "radar"]], "r4": [["25mm Triple\nStatus #1", "", "aa"], ["25mm Triple\nStatus #2", "", "aa"], null, null], "r5": [["25mm Triple\nStatus #3", "", "aa"], ["25mm Single\nStatus", "", "aa"], null, null], "sys": ["Crane", "Hangar", "Radio", "Periscope", "Hydrophones", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes", "Batteries", "Fuel Tanks", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Diesel Engine 3", "Diesel Engine 4"]}, "shipyard_metadata": {"title": "SEN-TOKU  CLASS  (I-400)", "subtitle": "SUBMARINE AIRCRAFT CARRIER  |  STO TYPE", "badges": ["AVAILABLE: DEC 1944", "PATROLS: 4 MONTHS", "HULLS: I-400, I-401, I-402"]}, "reload_capacity": 12, "kaiten_note": null}, "Sen_Taka_Class": {"class_name": "Sen-Taka Class", "full_title": "Sen-Taka High-Speed Submarine (I-201 Class)", "available_date": "Available 1945", "patrol_length": "1 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 4, "aft": 0, "reloads_fwd": 6, "reloads_aft": 0}, "deck_guns": {"main": "None", "ammo": 0, "aa": "25mm AA Status (x2)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Snorkel", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "259 Feet (79.0m)", "displacement": "1,291 tons", "speed": "19 knots (Submerged!)", "range": "5,800 nm", "crew": 31, "produced": 3}, "special_rules": "Revolutionary high-speed submarine (19 knots submerged). 4 forward torpedo tubes, 6 forward reloads (10 torpedoes total). Streamlined hull, snorkel, high capacity batteries.\n• High Speed Underwater: Due to very high underwater speed, this class never gets a +1 modifier for previous detection.\n• Electric Motor Hits: Second Electric Motor 1 hit goes against Electric Motor 3; second Electric Motor 2 hit goes against Electric Motor 4. All penalties for electric motor hits on Chart [E3] are reduced by 1.\n• Battery Damage: Does not suffer a +1 drm for battery damage until all three have been damaged.", "vassal_filename": "Sen-Taka Class.jpg", "vassal_image_path": "images/vassal/Sen-Taka Class.jpg", "profile_image_path": "images/subs/remastered/17_Sen_Taka.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 6, "hull": 6}, "crew_counters": 4, "duplex_print": {"sheet_number": 8, "side": "Side B (Reverse)", "page_number": 16, "family": "Advanced Naval Technology (1944–1945)", "paired_with": "Sen-Toku Class", "pairing_logic": "Los 2 colosos finales: el superportaviones I-400 y el de alta velocidad."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [null, null, null, null], "r3": [["25mm Single\nStatus", "", "aa"], null, null, null], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["Snorkel", "Radar", "Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries", "Periscope", "Hydrophones", null, null]}, "shipyard_metadata": {"title": "SEN-TAKA  CLASS  (I-201)", "subtitle": "HIGH-SPEED SUBMARINE  |  STK TYPE", "badges": ["AVAILABLE: JUL 1945", "PATROLS: 1 MONTH", "HULLS: I-201, I-202, I-203"]}, "reload_capacity": 6, "kaiten_note": null}, "Type_C3_Class": {"class_name": "Type C-3 Class", "full_title": "Type C-3 Heavy Attack Submarine (I-52 Class)", "available_date": "Available 1943", "patrol_length": "4 month patrols", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 6, "aft": 0, "reloads_fwd": 13, "reloads_aft": 0}, "deck_guns": {"main": "140mm Twin Status", "ammo": 5, "aa": "25mm Triple AA (x2)"}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Cargo", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "356 Feet (108.7m)", "displacement": "2,095 tons", "speed": "17.7 knots", "range": "27,000 nm", "crew": 94, "produced": 3}, "special_rules": "Extra long-range cargo submarine (Yanagi missions to Germany). 6 forward torpedo tubes, 13 forward reloads (19 torpedoes total). Twin 140mm deck guns.\nRadar: Type 22 AS/SS Radar available Dec. 1944 onwards.", "vassal_filename": "Type C3 Class.jpg", "vassal_image_path": "images/vassal/Type C3 Class.jpg", "profile_image_path": "images/subs/remastered/15_Type_C3.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Transit", "N/A", "N/A"], "damage_capacity": {"flooding": 8, "hull": 8}, "crew_counters": 5, "duplex_print": {"sheet_number": 9, "side": "Side A (Front)", "page_number": 17, "family": "Special Operations Submersibles", "paired_with": "Type A Midget Submarine - Ko-Hyoteki", "pairing_logic": "La pareja oficial perfecta sin conflicto de mesa."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], ["3", "", "tube"], ["4", "", "tube"]], "r2": [["5", "", "tube"], ["6", "", "tube"], ["140mm\nStatus #2", "", "gun"], ["Ammo\nx5", "", "ammo"]], "r3": [["140mm\nStatus #1", "", "gun"], ["Ammo\nx5", "", "ammo"], ["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"]], "r4": [["25mm Twin\nStatus #1", "", "aa"], ["25mm Twin\nStatus #2", "", "aa"], null, null], "r5": [["Kaiten\nSuicide Torpedo", "", "kai"], ["Kaiten\nSuicide Torpedo", "", "kai"], null, null], "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries", "Periscope", null, null, null, null]}, "shipyard_metadata": {"title": "TYPE  C.3  CLASS  (I-52)", "subtitle": "OCEAN CARGO ATTACK SUBMARINE  |  HEI-KAI TYPE", "badges": ["AVAILABLE: MAY 1944", "PATROLS: 4 MONTHS", "HULLS: I-52, I-53, I-55"]}, "reload_capacity": 13, "kaiten_note": "In 12/44 Kaiten are installed. Remove second Deck Gun and its ammunition. Kaiten carried ONLY on Kaiten missions."}, "Type_A_Midget_Submarine___Ko_Hyoteki": {"class_name": "Type A Midget Submarine", "full_title": "Ko-Hyoteki Type A Midget Carrier Submarine", "available_date": "Available December 1941", "patrol_length": "Special Operations", "has_aircraft": false, "aircraft_type": null, "torpedo_tubes": {"fwd": 2, "aft": 0, "reloads_fwd": 0, "reloads_aft": 0}, "deck_guns": {"main": null, "ammo": 0, "aa": null}, "has_kaiten": false, "systems_status": ["F.Doors", "Planes", "Radio", "Clamp", "Mtr 1", "Mtr 2", "Eng 1", "Eng 2", "Fuel", "Hydro", "Batt", "Perisc"], "stats": {"length": "78.5 Feet (23.9m)", "displacement": "46 tons", "speed": "19 knots (Subm)", "range": "100 nm (Batt)", "crew": 2, "produced": "100+"}, "special_rules": "Two-man midget submarine carried by fleet submarine mothership for harbour penetration missions [7.16]. 2 forward torpedo tubes, 0 reloads (2x Type 97 45cm torpedoes total). Specialized 600 hp electric drive with forward and aft battery banks, gyro compass, and hull wire cutters.", "vassal_filename": "Type A Midget Submarine - Ko-Hyoteki.jpg", "vassal_image_path": "images/vassal/Type A Midget Submarine - Ko-Hyoteki.jpg", "profile_image_path": "images/subs/remastered/18_Type_A_Midget_Ko_Hyoteki.jpg", "is_remastered": true, "patrol_phases": ["Transit", "Penetrate", "Attack", "Egress", "Recover", "N/A", "N/A", "N/A", "N/A"], "damage_capacity": {"flooding": 2, "hull": 2}, "crew_counters": 0, "duplex_print": {"sheet_number": 9, "side": "Side B (Reverse)", "page_number": 18, "family": "Special Operations Submersibles", "paired_with": "Type C3 Class", "pairing_logic": "La pareja oficial perfecta sin conflicto de mesa."}, "armament_layout": {"r1": [["1", "", "tube"], ["2", "", "tube"], null, null], "r2": [null, null, null, null], "r3": [null, null, null, null], "r4": [null, null, null, null], "r5": [null, null, null, null], "sys": ["Periscope", "Rudder Control", "Batteries", "Electric Motor", "Gyro Compass", "Trim Tanks", "Air System", "Ballast", null, null, null, null, null, null, null, null]}, "shipyard_metadata": {"title": "TYPE  A  MIDGET  (KO-HYOTEKI)", "subtitle": "SPECIAL ATTACK SUBMERSIBLE  |  TARGET A TYPE", "badges": ["AVAILABLE: DEC 1941", "PATROLS: SPECIAL OPS", "HULLS: HA-19 ETC. (100+ BUILT)"]}, "reload_capacity": 0, "kaiten_note": null}}};

    // Bilingual Dictionary
    // i18n is defined in i18n.js
    

const MISSION_CHITS = [
      // FICHAS OPERATIVAS (1941)
      { id: "pearl_1241", cat: "mission", redTitle: "Pearl Harbor", redDate: "12/41", redImg: "Pearl Harbor 12-41.jpg", whiteImg: "Midget 1 Recon 7 Patrol.jpg", whiteLines: ["Midget 1", "Recon 7", "Patrol"], validMonths: ["1941-12"], desc: "Operación Z (Dic-41): Ataque de 5 mini-submarinos Ko-hyoteki Ha-19 (Mapa M1) y vuelo nocturno de reconocimiento con hidroavión Glen (Tabla P1)." },
      { id: "malaya_1241", cat: "mission", redTitle: "Malaya", redDate: "12/41", redImg: "Malaya 12-41.jpg", whiteImg: "Minelay Picket Recon 12.jpg", whiteLines: ["Minelay.", "Picket", "Recon 12"], validMonths: ["1941-12"], desc: "Invasión de Malasia (Dic-41): Minado de accesos a Singapur, línea de piquete contra la 'Force Z' británica o reconocimiento aéreo." },
      { id: "philippines_1241", cat: "mission", redTitle: "Philippines", redDate: "12/41", redImg: "Philippenes 12-41.jpg", whiteImg: "Minelay.jpg", whiteLines: ["Minelay."], validMonths: ["1941-12"], desc: "Invasión de Filipinas (Dic-41): Minado ofensivo de los estrechos de San Bernardino y accesos a Manila y Lingayen." },
      { id: "dutch_1241_0342", cat: "mission", redTitle: "Dutch E. Indies", redDate: "12/41-3/42", redImg: "Dutch E Indies 12-41 - 3-42.jpg", whiteImg: "Patrol.jpg", whiteLines: ["Patrol"], validMonths: ["1941-12", "1942-01", "1942-02", "1942-03"], desc: "Campaña de las Indias Orientales Holandesas: Caza del convoy aliado ABDACOM en el Mar de Java y estrecho de Sunda." },
      { id: "uswest_0142", cat: "mission", redTitle: "US West Coast", redDate: "1/42", redImg: "US West Coast 1-42.jpg", whiteImg: "Shore Bombardment.jpg", whiteLines: ["Shore-Bombard."], validMonths: ["1942-01"], desc: "Ataque a la Costa Oeste de EE. UU. (Ene-42): Bombardeo nocturno con cañón de 140 mm contra la refinería de petróleo de Ellwood (Santa Bárbara, CA) o Fort Stevens." },

      // FICHAS OPERATIVAS (1942)
      { id: "indianocean_0342_0442", cat: "mission", redTitle: "Indian Ocean", redDate: "3/42-4/42", redImg: "Indian Ocean 3-42 - 4-42.jpg", whiteImg: "Recon 9 Picket.jpg", whiteLines: ["Recon 9", "Picket"], validMonths: ["1942-03", "1942-04"], desc: "Incursión del Océano Índico: Reconocimiento aéreo previo con hidroavión sobre Colombo y Trincomalee (Ceilán), apoyando la incursión de Nagumo." },
      { id: "indianocean_0542", cat: "mission", redTitle: "Indian Ocean", redDate: "5/42", redImg: "Indian Ocean 5-42.jpg", whiteImg: "Midget 3 Patrol.jpg", whiteLines: ["Midget 3", "Patrol"], validMonths: ["1942-05"], desc: "Ataque a Madagascar / Diego Suárez (May-42): Los submarinos I-16 e I-20 lanzan mini-submarinos Ko-hyoteki, torpedeando al acorazado HMS Ramillies (Mapa M3)." },
      { id: "australia_0542", cat: "mission", redTitle: "Australia", redDate: "5/42", redImg: "Australia 5-42.jpg", whiteImg: "Recon 8 Midget 2 Patrol.jpg", whiteLines: ["Recon 8", "Midget 2", "Patrol"], validMonths: ["1942-05"], desc: "Ataque a la Bahía de Sydney (May-42): Vuelo de reconocimiento aéreo con hidroavión sobre Sydney y penetración de 3 mini-submarinos Ko-hyoteki (Mapa M2)." },
      { id: "aleutians_0542_0642", cat: "mission", redTitle: "Aleutians", redDate: "5/42-6/42", redImg: "Aleutians 5-42 - 6-42.jpg", whiteImg: "Recon 12 Patrol.jpg", whiteLines: ["Recon 12", "Patrol"], validMonths: ["1942-05", "1942-06"], desc: "Operación AL (Islas Aleutianas): Reconocimiento y patrulla de apoyo a la invasión y ocupación de Attu y Kiska." },
      { id: "midway_0642", cat: "mission", redTitle: "Midway", redDate: "6/42", redImg: "Midway 6-42.jpg", whiteImg: "Picket.jpg", whiteLines: ["Picket"], validMonths: ["1942-06"], desc: "Batalla de Midway (Jun-42): Línea de piquete submarino de vigilancia. El I-168 localiza y hunde al portaaviones USS Yorktown y al destructor Hammann." },
      { id: "uswest_0642_0742", cat: "mission", redTitle: "US West Coast", redDate: "6/42-7/42", redImg: "US West Coast 6-42 - 7-42.jpg", whiteImg: "Bomb 10 Patrol.jpg", whiteLines: ["Bomb 10", "Patrol"], validMonths: ["1942-06", "1942-07"], desc: "Ataque Lookout (Jun/Jul-42): El hidroavión Glen del I-25 lanza bombas incendiarias sobre los bosques de Oregón, provocando incendios forestales." },
      { id: "guadalcanal_0842_1242", cat: "mission", redTitle: "Guadalcanal", redDate: "8/42-12/42", redImg: "Guadalcanal 8-42 - 12-42.jpg", whiteImg: "Midget 4 Picket Transport.jpg", whiteLines: ["Midget 4", "Picket", "Transport"], validMonths: ["1942-08", "1942-09", "1942-10", "1942-11", "1942-12"], desc: "Campaña de Guadalcanal: Midget 4 en cabo Esperanza (Mapa M4), piquete de portaaviones (I-19 hunde al USS Wasp) o misiones Tokio Express." },
      { id: "indianocean_0842_1142", cat: "mission", redTitle: "Indian Ocean", redDate: "8/42-11/42", redImg: "Indian Ocean 8-42 - 11-42.jpg", whiteImg: "Patrol.jpg", whiteLines: ["Patrol"], validMonths: ["1942-08", "1942-09", "1942-10", "1942-11"], desc: "Guerra de corso en el Océano Índico: Interdicción del tráfico comercial británico y petroleros en el Golfo de Adén y costa de África." },

      // FICHAS OPERATIVAS (1943)
      { id: "australia_0343", cat: "mission", redTitle: "Australia", redDate: "3/43", redImg: "Australia 3-43.jpg", whiteImg: "Recon 8 Minelay Patrol.jpg", whiteLines: ["Recon 8", "Minelay.", "Patrol"], validMonths: ["1943-03"], desc: "Operaciones en costa oriental de Australia (Mar-43): Reconocimiento, sembrado de minas en rutas mercantes de Sydney a Brisbane o patrulla." },
      { id: "nguinea_0343", cat: "mission", redTitle: "New Guinea", redDate: "3/43", redImg: "New Guinea 3-43.jpg", whiteImg: "Passanger.jpg", whiteLines: ["Passngr."], validMonths: ["1943-03"], desc: "Transporte de Pasajeros / Estado Mayor a Nueva Guinea tras la batalla del Mar de Bismarck (inserción de oficiales clave y pilotos)." },
      { id: "nguinea_0343_0643", cat: "mission", redTitle: "New Guinea", redDate: "3/43-6/43", redImg: "New Guinea 3-43 - 6-43.jpg", whiteImg: "Transport.jpg", whiteLines: ["Transport"], validMonths: ["1943-03", "1943-04", "1943-05", "1943-06"], desc: "Misión de Transporte Submarino Tokio Express: Suministro nocturno de arroz, munición y barcazas Daihatsu a las tropas aisladas en Lae." },
      { id: "guadalcanal_0443_0643", cat: "mission", redTitle: "Guadalcanal", redDate: "4/43-6/43", redImg: "Guadalcanal 4-43 - 6-43.jpg", whiteImg: "Patrol.jpg", whiteLines: ["Patrol"], validMonths: ["1943-04", "1943-05", "1943-06"], desc: "Patrulla de interdicción en las Salomón Centrales (estrechos de Nueva Georgia y Bougainville)." },
      { id: "aleutians_0643", cat: "mission", redTitle: "Aleutians", redDate: "6/43", redImg: "Aleutians 6-43.jpg", whiteImg: "Evac.jpg", whiteLines: ["Evac."], validMonths: ["1943-06"], desc: "Operación de Evacuación de Kiska (Jun-43): Rescate submarino de la guarnición imperial aislada en las Aleutianas bajo densa niebla." },
      { id: "pearl_1043_1143", cat: "mission", redTitle: "Pearl Harbor", redDate: "10/43-11/43", redImg: "Pearl Harbor 10-43 - 11-43.jpg", whiteImg: "Recon 7 Patrol.jpg", whiteLines: ["Recon 7", "Patrol"], validMonths: ["1943-10", "1943-11"], desc: "Reconocimiento Aéreo Glen de largo alcance sobre Oahu para espiar las concentraciones de la Flota del Pacífico de Nimitz." },
      { id: "tarawa_1143_1243", cat: "mission", redTitle: "Tarawa", redDate: "11/43-12/43", redImg: "Tarawa 11-43 - 12-43.jpg", whiteImg: "Picket.jpg", whiteLines: ["Picket"], validMonths: ["1943-11", "1943-12"], desc: "Operación Galvánic (Islas Gilbert): Despliegue de piquetes defensivos de intercepción durante la invasión de Tarawa y Makin." },
      { id: "indianocean_1243", cat: "mission", redTitle: "Indian Ocean", redDate: "12/43", redImg: "Indian Ocean 12-43.jpg", whiteImg: "Passanger.jpg", whiteLines: ["Passngr."], validMonths: ["1943-12"], desc: "Transporte de Pasajeros Especiales: Enlace con agentes y líderes nacionalistas (como Subhas Chandra Bose) entre Penang y Sabang." },

      // FICHAS OPERATIVAS (1944)
      { id: "europe_0444", cat: "mission", redTitle: "Europe", redDate: "4/44", redImg: "Europe 4-44.jpg", whiteImg: "Strat Supplies.jpg", whiteLines: ["Strat. Supplies"], validMonths: ["1944-04"], desc: "Misión Yanagi (Alemania / Lorient): Misión transoceánica con el Type C-3 (I-52) transportando caucho, opio y wolframio; retorno con radar y tecnología." },
      { id: "marianas_0644", cat: "mission", redTitle: "Marianas", redDate: "6/44", redImg: "Marianas 6-44.jpg", whiteImg: "Picket.jpg", whiteLines: ["Picket"], validMonths: ["1944-06"], desc: "Operación A-Go (Batalla del Mar de Filipinas): Cordón de submarinos de vigilancia NA. Desastre táctico ante las fuerzas antisubmarinas aliadas." },
      { id: "leyte_1044", cat: "mission", redTitle: "Leyte Gulf", redDate: "10/44", redImg: "Leyte Gulf 10-44.jpg", whiteImg: "Picket.jpg", whiteLines: ["Picket"], validMonths: ["1944-10"], desc: "Operación Shō-Gō 1 (Batalla del Golfo de Leyte): Cordón de choque contra la flota de invasión del general MacArthur." },
      { id: "marianas_1144_0445", cat: "mission", redTitle: "Marianas", redDate: "11/44-4/45", redImg: "Marianas 11-44 - 4-45.jpg", whiteImg: "Kaiten 2.jpg", whiteLines: ["Kaiten 2"], validMonths: ["1944-11", "1944-12", "1945-01", "1945-02", "1945-03", "1945-04"], desc: "Grupo de Ataque Especial Kaiten (Kikusui / Kongō): Ataques con torpedos tripulados suicidas en Ulithi y Kossol Passage." },

      // FICHAS OPERATIVAS (1945)
      { id: "panama_0145_0745", cat: "mission", redTitle: "Panama Canal", redDate: "1-7/45", redImg: "Panama Canal 1-7 - 45.jpg", whiteImg: "Bomb 11.jpg", whiteLines: ["Bomb 11"], validMonths: ["1945-01", "1945-02", "1945-03", "1945-04", "1945-05", "1945-06", "1945-07"], desc: "Operación secreta con los super-submarinos I-400 e I-401 armados con hidroaviones Seiran para bombardear las esclusas del Canal de Panamá." },
      { id: "iwojima_0245", cat: "mission", redTitle: "Iwo Jima", redDate: "2/45", redImg: "Iwo Jima 2-45.jpg", whiteImg: "Kaiten 3 Patrol.jpg", whiteLines: ["Kaiten 3", "Patrol"], validMonths: ["1945-02"], desc: "Batalla de Iwo Jima: Ataques suicidas Kaiten y patrulla de hostigamiento contra la fuerza expedicionaria de marines y acorazados." },
      { id: "okinawa_0445_0545", cat: "mission", redTitle: "Okinawa", redDate: "4/45-5/45", redImg: "Okinawa 4-45 - 5-45.jpg", whiteImg: "Kaiten 3 Patrol.jpg", whiteLines: ["Kaiten 3", "Patrol"], validMonths: ["1945-04", "1945-05"], desc: "Operación Ten-Go (Batalla de Okinawa): Misiones de choque Kaiten contra la armada de invasión de Kerama Retto." }
    ];

    let currentChitsFilter = 'month'; // 'month', 'all', or 'ports'
    let allChitsFlipped = false;

    

const CHART_H2_SURNAMES = {
      "1-1": "Araki",     "1-2": "Arimoto",   "1-3": "Asaeda",    "1-4": "Daigo",     "1-5": "Endo",      "1-6": "Fujii",
      "2-1": "Fujimoto",  "2-2": "Fukaya",    "2-3": "Harada",    "2-4": "Hashimoto", "2-5": "Hishitani", "2-6": "Hoshino",
      "3-1": "Ichimura",  "3-2": "Imaizumi",  "3-3": "Inoue",     "3-4": "Ishii",     "3-5": "Izu",       "3-6": "Jinbo",
      "4-1": "Kato",      "4-2": "Kawaguchi", "4-3": "Kobayashi", "4-4": "Kurita",    "4-5": "Masata",    "4-6": "Matsuoka",
      "5-1": "Mori",      "5-2": "Nakagawa",  "5-3": "Nakamura",  "5-4": "Nomura",    "5-5": "Orita",     "5-6": "Shiba",
      "6-1": "Takahashi", "6-2": "Tanaka",    "6-3": "Usuka",     "6-4": "Watanabe",  "6-5": "Yoshitomi", "6-6": "Yuchi"
    };

    const CHART_H2_FIRSTNAMES = {
      "1-1": "Asakichi",  "1-2": "Bunichi",   "1-3": "Chimaki",   "1-4": "Denshichi", "1-5": "Hakue",     "1-6": "Hinomoto",
      "2-1": "Hiroshi",   "2-2": "Ichiro",    "2-3": "Ikuo",      "2-4": "Isamu",     "2-5": "Jinsaku",   "2-6": "Jiro",
      "3-1": "Junzo",     "3-2": "Kanichi",   "3-3": "Kazuaki",   "3-4": "Kenji",     "3-5": "Kiyosuke",  "3-6": "Kiyota",
      "4-1": "Mitsuma",   "4-2": "Miyoshi",   "4-3": "Mochitsura","4-4": "Naoshi",    "4-5": "Osamu",     "4-6": "Otoya",
      "5-1": "Ryoichi",   "5-2": "Saburo",    "5-3": "Setsuzo",   "5-4": "Shinji",    "5-5": "Shuichiro", "5-6": "Shuzo",
      "6-1": "Sokichi",   "6-2": "Takashi",   "6-3": "Takeo",     "6-4": "Tetsushiro","6-5": "Toshio",    "6-6": "Yoshio"
    };

    

const CHART_A1_DATA = {
      "1941": { 2: "Philippines", 3: "Dutch East Indies", 4: "US West Coast", 5: "Dutch East Indies", 6: "Pearl Harbor", 7: "Pearl Harbor", 8: "Pearl Harbor", 9: "Pearl Harbor", 10: "Malaya", 11: "Dutch East Indies", 12: "Philippines" },
      "1942 Jan-Jun": { 2: "Australia", 3: "Aleutians", 4: "Midway", 5: "Indian Ocean", 6: "Dutch East Indies", 7: "Midway", 8: "Indian Ocean", 9: "Indian Ocean", 10: "Midway", 11: "US West Coast", 12: "Australia" },
      "1942 Jul-Dec": { 2: "US West Coast", 3: "Indian Ocean", 4: "US West Coast", 5: "Guadalcanal", 6: "Indian Ocean", 7: "Indian Ocean", 8: "Indian Ocean", 9: "US West Coast", 10: "Guadalcanal", 11: "Guadalcanal", 12: "US West Coast" },
      "1943 Jan-Jun": { 2: "Aleutians", 3: "New Guinea", 4: "Pearl Harbor", 5: "Indian Ocean", 6: "Guadalcanal", 7: "New Guinea", 8: "Indian Ocean", 9: "Pearl Harbor", 10: "Guadalcanal", 11: "Australia", 12: "Indian Ocean" },
      "1943 Jul-Dec": { 2: "Pearl Harbor", 3: "Indian Ocean", 4: "Marianas", 5: "Tarawa", 6: "Tarawa", 7: "New Guinea", 8: "New Guinea", 9: "Tarawa", 10: "Marianas", 11: "Indian Ocean", 12: "Pearl Harbor" },
      "1944 Jan-Jun": { 2: "Europe*", 3: "Indian Ocean", 4: "Marianas", 5: "Marianas", 6: "Marianas", 7: "Indian Ocean", 8: "Marianas", 9: "New Guinea", 10: "Marianas", 11: "Indian Ocean", 12: "Europe*" },
      "1944 Jul-Dec": { 2: "Indian Ocean", 3: "Indian Ocean", 4: "Philippines", 5: "Marianas", 6: "Leyte Gulf", 7: "Leyte Gulf", 8: "Leyte Gulf", 9: "Marianas", 10: "Philippines", 11: "New Guinea", 12: "Philippines" },
      "1945 Jan-Jul": { 2: "Panama Canal**", 3: "Iwo Jima", 4: "Okinawa", 5: "Iwo Jima", 6: "Okinawa", 7: "Iwo Jima", 8: "Okinawa", 9: "Iwo Jima", 10: "Marianas", 11: "Iwo Jima", 12: "Panama Canal**" }
    };

    const CHART_A3_DATA = {
      "Transit": { 2: "Aircraft *", 3: "--", 4: "--", 5: "--", 6: "--", 7: "--", 8: "--", 9: "--", 10: "--", 11: "--", 12: "Ship*" },
      "W. Coast/Indian Ocean": { 2: "Capital Ship", 3: "Aircraft", 4: "Warship", 5: "-- (R)", 6: "Two Ships + Escort", 7: "--", 8: "Ship", 9: "--", 10: "--", 11: "Convoy", 12: "Aircraft" },
      "Philippines/Aleutians": { 2: "Warship *", 3: "Ship + Escort *", 4: "--", 5: "-- (R)", 6: "--", 7: "--", 8: "--", 9: "Ship", 10: "--", 11: "--", 12: "Aircraft" },
      "Midway": { 2: "Capital Ship", 3: "Warship", 4: "Ship + Escort", 5: "-- (R)", 6: "--", 7: "--", 8: "Warship", 9: "Ship + Escort", 10: "--", 11: "Warship", 12: "Aircraft" },
      "Marianas / Australia": { 2: "Warship", 3: "Ship", 4: "--", 5: "-- (R)", 6: "Two Ships + Escort", 7: "Warship *", 8: "--", 9: "--", 10: "--", 11: "Convoy", 12: "Aircraft" },
      "Pearl Harbor": { 2: "Aircraft", 3: "Capital Ship", 4: "--", 5: "-- (R)", 6: "--", 7: "Ship + Escort", 8: "--", 9: "--", 10: "Warship", 11: "--", 12: "Aircraft" },
      "New Guinea/Guadalcanal": { 2: "Aircraft", 3: "Two Ships + Escort", 4: "Warship", 5: "-- (R)", 6: "--", 7: "--", 8: "Ship + Escort *", 9: "Warship", 10: "--", 11: "Warship", 12: "Minefield" },
      "Okinawa/Iwo Jima": { 2: "Minefield *", 3: "Capital Ship", 4: "Warship", 5: "-- (R)", 6: "--", 7: "--", 8: "--", 9: "Warship", 10: "--", 11: "Ship + Escort", 12: "Aircraft" },
      "Tarawa (Marshalls)": { 2: "Capital Ship", 3: "Warship", 4: "--", 5: "-- (R)", 6: "--", 7: "--", 8: "--", 9: "--", 10: "--", 11: "Warship", 12: "Aircraft" },
      "Dutch East Indies/Malaya": { 2: "Minefield *", 3: "Warship", 4: "--", 5: "-- (R)", 6: "Ship", 7: "--", 8: "--", 9: "Ship+Escort", 10: "Convoy", 11: "Ship+Escort", 12: "Aircraft" },
      "Special Mission": { 2: "Escort", 3: "Aircraft", 4: "--", 5: "--", 6: "--", 7: "--", 8: "--", 9: "--", 10: "--", 11: "--", 12: "--" },
      "Minefield": { 2: "Sub Lost", 3: "Sub Lost", 4: "Sub Lost", 5: "Sub Lost", 6: "--", 7: "--", 8: "--", 9: "--", 10: "--", 11: "--", 12: "--" }
    };

    

const CANONICAL_BASES = {
      "Yokosuka": {
        id: "Yokosuka",
        rule: "4.7.1",
        name: "Yokosuka",
        label: "Yokosuka [4.7.1] (At Port / Base Principal)",
        labelEn: "Yokosuka [4.7.1] (Home Port / Main Base)",
        chit: "assets/chits/Port Yokosuka.jpg",
        desc: "Base naval principal metropolitana (Bahía de Tokio). Todos los buques iniciales comienzan aquí [4.7.1]. Activa toda la guerra.",
        descEn: "Main metropolitan naval base (Tokyo Bay). All starting boats begin here [4.7.1]. Active throughout the war.",
        activeCheck: (m) => ({ active: true })
      },
      "Paramushiro": {
        id: "Paramushiro",
        rule: "4.7.2",
        name: "Paramushiro",
        label: "Paramushiro [4.7.2] (Kuriles / Base Pacífico Norte)",
        labelEn: "Paramushiro [4.7.2] (Kuriles / North Pacific Base)",
        chit: "assets/chits/Port Parama-Shiro.jpg",
        desc: "Base del norte para patrullas en las Islas Aleutianas [4.7.2]. Una vez asignado aquí, todas las patrullas subsiguientes serán a Aleutianas hasta 7/43 (momento en el cual es reasignado a Truk). Inmune a ataques aéreos en puerto [4.7.6].",
        descEn: "Northern base for Aleutian Islands patrols [4.7.2]. Once assigned here, all subsequent patrols go to the Aleutians until 7/43, when the boat is reassigned to Truk. Immune to port air raids [4.7.6].",
        activeCheck: (m) => {
          if (m >= "1943-07") return { active: false, reason: "Reasignada a Truk en 7/43 [4.7.2]" };
          return { active: true };
        }
      },
      "Truk": {
        id: "Truk",
        rule: "4.7.3",
        name: "Truk",
        label: "Truk [4.7.3] (Base Avanzada Pacífico Central)",
        labelEn: "Truk [4.7.3] (Central Pacific Forward Base)",
        chit: "assets/chits/Port Truk.jpg",
        desc: "Fondeadero clave de la 6ª Flota en las Carolinas. Cesa de operar en 3/44; cualquier submarino allí destacado debe rebasarse a Yokosuka. Si está en Refit al ocurrir 3/44, el buque se considera perdido [4.7.3].",
        descEn: "Key 6th Fleet anchorage in the Carolines. Ceases operations in 3/44; boats based there must relocate to Yokosuka. A boat in Refit when 3/44 occurs is considered lost [4.7.3].",
        activeCheck: (m) => {
          if (m >= "1944-03") return { active: false, reason: "Cesa como base en 3/44 [4.7.3]" };
          return { active: true };
        }
      },
      "New Guinea": {
        id: "New Guinea",
        rule: "4.7.4",
        name: "New Guinea",
        label: "New Guinea [4.7.4] (Rabaul / Shortland)",
        labelEn: "New Guinea [4.7.4] (Rabaul / Shortland)",
        chit: "assets/chits/Port N Guinea.jpg",
        desc: "Bases en el área de Nueva Guinea (Rabaul y Shortland) [4.7.4]. Eludidas por la estrategia aliada de saltos de isla en isla; permanecen activas hasta el fin de la guerra.",
        descEn: "Bases in the New Guinea area (Rabaul and Shortland) [4.7.4]. Bypassed by Allied island-hopping strategy; remain active until the end of the war.",
        activeCheck: (m) => ({ active: true })
      },
      "Dutch East Indies": {
        id: "Dutch East Indies",
        rule: "4.7.5",
        name: "Dutch East Indies (DEI)",
        label: "Dutch East Indies (DEI) [4.7.5] (Singapur / Penang / Sabang)",
        labelEn: "Dutch East Indies (DEI) [4.7.5] (Singapore / Penang / Sabang)",
        chit: "assets/chits/Port Dutch E Indies.jpg",
        desc: "Bases en Indias Orientales Holandesas [4.7.5] para incursiones en el Océano Índico y Golfo de Bengala. Activas durante toda la guerra.",
        descEn: "Bases in the Dutch East Indies [4.7.5] for operations in the Indian Ocean and Bay of Bengal. Active throughout the war.",
        activeCheck: (m) => ({ active: true })
      }
    };

    

const CHART_B6_TABLE = {
      11: (en) => en ? "Batteries" : "Baterías",
      12: (en) => en ? "Flooding" : "Inundación",
      13: "Radar",
      14: (en) => en ? "Periscope" : "Periscopio",
      15: (en) => en ? "Dive Planes" : "Planos de Inmersión",
      16: (en) => en ? "Electric Motor 1" : "Motor Eléctrico 1",
      21: (en) => en ? "Flooding" : "Inundación",
      22: (en) => en ? "Electric Motor 2" : "Motor Eléctrico 2",
      23: (en) => en ? "Diesel Engine 1" : "Motor Diésel 1",
      24: (en) => en ? "Floatplane Hangar" : "Hangar de Hidroavión",
      25: (en) => en ? "Diesel Engine 2" : "Motor Diésel 2",
      26: (en) => en ? "Floatplane Crane" : "Grúa de Hidroavión",
      31: (en) => en ? "Flooding" : "Inundación",
      32: (en) => en ? "Midget Sub / Daihatsu" : "Minisubmarino Ko-Hyoteki / Daihatsu",
      33: (en) => en ? "Hull" : "Casco Estructural",
      34: (en) => en ? "Crew Injury" : "Baja en Tripulación",
      35: (en) => en ? "Hull" : "Casco Estructural",
      36: (en) => en ? "Deck Gun / Kaiten" : "Cañón de Cubierta / Kaiten",
      41: (en) => en ? "Hull" : "Casco Estructural",
      42: "Radio",
      43: (en) => en ? "Flooding" : "Inundación",
      44: (en) => en ? "Flooding" : "Inundación",
      45: (en) => en ? "Hull" : "Casco Estructural",
      46: (en) => en ? "AA Gun" : "Artillería Antiaérea",
      51: (en) => en ? "Flooding" : "Inundación",
      52: (en) => en ? "Hull" : "Casco Estructural",
      53: (en) => en ? "Crew Injury x2" : "Bajas en Tripulación x2",
      54: (en) => en ? "Flooding x2" : "Inundación Doble",
      55: (en) => en ? "Hull" : "Casco Estructural",
      56: (en) => en ? "Deck Gun / Kaiten" : "Cañón de Cubierta / Kaiten",
      61: (en) => en ? "Hydrophones" : "Hidrófonos",
      62: (en) => en ? "Aft Torpedo Door" : "Compuerta Torpedo Popa",
      63: (en) => en ? "Fwd Torpedo Doors (Odd)" : "Compuertas Torpedo Proa Impares",
      64: (en) => en ? "Fwd Torpedo Doors (Even)" : "Compuertas Torpedo Proa Pares",
      65: (en) => en ? "Hull x2" : "Casco Doble Daño",
      66: (en) => en ? "Fuel Tank" : "Tanque de Combustible"
    };

    // RESOLVE TORPEDO SALVO (CHARTS B1, B2, B3)
    

const CHART_M6_EVENTS = {
      2: "Varada (Run Aground): El minisubmarino choca con un obstáculo no cartografiado. Sufre 1 daño de casco y 2 impactos.",
      3: "Interceptación Ultra: Criptoanalistas aliados alertaron del ataque. Ignora cualquier encuentro con Buques Capitales.",
      4: "Salida Involuntaria a Superficie (Broached): Tira detección 2d6: con 10+, destruido por baterías costeras o ASV.",
      5: "Avería Mecánica (Malfunction): Tira 1 punto aleatorio de avería y aplícalo de inmediato.",
      6: "Vía de Agua (Leak): Marca 1 casilla de inundación (no se produce inundación adicional).",
      7: "Desorientado Temporalmente: Pasa 1 turno adicional en el círculo actual de tránsito u objetivo.",
      8: "Desorientado Temporalmente: Pasa 1 turno adicional en el círculo actual de tránsito u objetivo.",
      9: "Navegación Superior: Otorga +1 DRM en Chart [M7] para la recuperación por el submarino nodriza.",
      10: "Maniobra Impecable (Perfect Boat Handling): Mueve inmediatamente al círculo que elijas. Ignora redes y bucles de detección.",
      11: "Torpedos Superiores: No efectúes tiradas de duds (torpedos defectuosos) en esta misión.",
      12: "ASV Cercano: Tira detección en Chart [B4] a distancia media. Si eres detectado, sufres contraataque normal."
    };

    const CHART_M8_TABLE = {
      11: "Inundación (Flooding)", 12: "Timón Vertical", 13: "Daño Menor (Sin efecto)",
      14: "Timón Horizontal", 15: "Casco (Hull)", 16: "Hélice (+1 detección ASV)",
      21: "Inundación (Flooding)", 22: "Daño Menor (Sin efecto)", 23: "Casco (Hull)",
      24: "Motor Eléctrico", 25: "Motor Eléctrico", 26: "Batería de Popa",
      31: "Casco (Hull)", 32: "Baja en Tripulación (Crew Injury)", 33: "Periscopio",
      34: "Inundación (Flooding)", 35: "Daño Menor (Sin efecto)", 36: "Baja en Tripulación (Crew Injury)",
      41: "Batería de Proa", 42: "Girocompás (-3 cita rescate)", 43: "Casco (Hull)",
      44: "Daño Menor (Sin efecto)", 45: "Baja en Tripulación (Crew Injury)", 46: "Inundación (Flooding)",
      51: "Hidrófono", 52: "Daño Menor (Sin efecto)", 53: "Inundación (Flooding)",
      54: "Baja en Tripulación (Crew Injury)", 55: "Casco (Hull)", 56: "Radio (+1 rescate)",
      61: "Cortarredes (-3 cruce red)", 62: "Tubo Lanzatorpedos 1", 63: "Daño Menor (Sin efecto)",
      64: "Tubo Lanzatorpedos 2", 65: "Inundación (Flooding)", 66: "Casco (Hull)"
    };

    



// ====================================================================
// CHARTS P3 - P6: FLOAT-PLANE MODULE (RECONNAISSANCE & BOMBING) [RULE 7.17]
// ====================================================================
const CHART_P3_DATA = {
  2: { transit: "--", recon: "Aircraft", targetRecon: "Capital Ship", targetBombing: "Aircraft" },
  3: { transit: "Aircraft", recon: "Ship", targetRecon: "Warship", targetBombing: "--" },
  4: { transit: "--", recon: "--", targetRecon: "CA + DD x6", targetBombing: "--" },
  5: { transit: "--", recon: "--", targetRecon: "DD x6", targetBombing: "AA*" },
  6: { transit: "--", recon: "--", targetRecon: "DD x3", targetBombing: "--" },
  7: { transit: "--", recon: "Ship", targetRecon: "DD", targetBombing: "AA*" },
  8: { transit: "--", recon: "--", targetRecon: "CL + DD x3", targetBombing: "--" },
  9: { transit: "--", recon: "--", targetRecon: "Tanker", targetBombing: "AA*" },
  10: { transit: "--", recon: "--", targetRecon: "CL", targetBombing: "--" },
  11: { transit: "--", recon: "Ship Group", targetRecon: "Ship Group", targetBombing: "--" },
  12: { transit: "Aircraft", recon: "Aircraft", targetRecon: "Capital Ship", targetBombing: "Aircraft*" }
};

const CHART_P6_DATA = {
  "1-2": { result: "Miss (Fallo)", desc: "La bomba cae en el agua sin causar daños estructurales.", color: "#94a3b8" },
  "3-5": { result: "Moderate Damage (Daño Moderado)", desc: "Impacto cercano o directo con daños de consideración en el objetivo.", color: "#fde047" },
  "6": { result: "Heavy Damage (Daño Severo)", desc: "¡Impacto directo devastador! Daño masivo en la infraestructura del objetivo.", color: "#4ade80" }
};

const CHART_P4_AIR_COMBAT = {
  matrix: {
    1: { 1: 3, 2: 2, 3: 0, 4: 'E', 5: 1, 6: 2 },
    2: { 1: 2, 2: 3, 3: 2, 4: 0, 5: 'E', 6: 1 },
    3: { 1: 1, 2: 0, 3: 3, 4: 2, 5: 1, 6: 'E' },
    4: { 1: 'E', 2: 1, 3: 0, 4: 3, 5: 2, 6: 1 },
    5: { 1: 1, 2: 'E', 3: 1, 4: 0, 5: 3, 6: 2 },
    6: { 1: 2, 2: 1, 3: 'E', 4: 1, 5: 0, 6: 3 }
  },
  rearGun: {
    2: { hits: 3, desc: "3 hits (DE) - Caza Derribado (Destroyed)", color: "#4ade80" },
    3: { hits: 2, desc: "2 hits - Daño Crítico en Caza", color: "#6ee7b7" },
    4: { hits: 2, desc: "2 hits - Daño Crítico en Caza", color: "#6ee7b7" },
    5: { hits: 1, desc: "1 hit - Daño Leve en Caza", color: "#fde047" },
    6: { hits: 1, desc: "1 hit - Daño Leve en Caza", color: "#fde047" },
    7: { hits: 0, desc: "Miss - Ráfaga fallida", color: "#94a3b8" },
    8: { hits: 0, desc: "Miss - Ráfaga fallida", color: "#94a3b8" },
    9: { hits: 0, desc: "Miss - Ráfaga fallida", color: "#94a3b8" },
    10: { hits: 0, desc: "Miss - Ráfaga fallida", color: "#94a3b8" },
    11: { hits: 0, desc: "Miss - Ráfaga fallida", color: "#94a3b8" },
    12: { hits: 0, desc: "Miss - Ráfaga fallida", color: "#94a3b8" }
  }
};

const CHART_P5_DATA = {
  2: { result: "Ineffective", desc: "Fuego antiaéreo disperso, sin efecto.", dmg: 0, color: "#94a3b8" },
  3: { result: "Ineffective", desc: "Fuego antiaéreo disperso, sin efecto.", dmg: 0, color: "#94a3b8" },
  4: { result: "Ineffective", desc: "Fuego antiaéreo disperso, sin efecto.", dmg: 0, color: "#94a3b8" },
  5: { result: "Ineffective", desc: "Fuego antiaéreo disperso, sin efecto.", dmg: 0, color: "#94a3b8" },
  6: { result: "Ineffective", desc: "Fuego antiaéreo disperso, sin efecto.", dmg: 0, color: "#94a3b8" },
  7: { result: "Ineffective", desc: "Fuego antiaéreo disperso, sin efecto.", dmg: 0, color: "#94a3b8" },
  8: { result: "1 pt. Damage", desc: "Close call (Impacto leve / metralla cercana)", dmg: 1, color: "#fde047" },
  9: { result: "1 pt. Damage", desc: "Tirada de herida en tripulación (gravedad según B8: 1-3 piloto, 4-6 observador)", dmg: 1, crewCheck: true, color: "#fb923c" },
  10: { result: "2 pts. Damage", desc: "Daño estructural severo en fuselaje/alas", dmg: 2, color: "#f87171" },
  11: { result: "2 pts. Damage", desc: "Tirada de herida en tripulación (gravedad según B8: 1-3 piloto, 4-6 observador)", dmg: 2, crewCheck: true, color: "#ef4444" },
  12: { result: "3 pts. Damage", desc: "Direct hit; ¡Hidroavión destruido en el aire!", dmg: 3, destroyed: true, color: "#b91c1c" }
};



// =========================================================================
// SUBMARINE START DATES & 46 HISTORICAL PATROL MONTHS
// =========================================================================
const SUB_START_MONTHS = {
  "Kaidai_KD3_Class": "1941-12",
  "Kaidai_KD4_Class": "1941-12",
  "Kaidai_KD5_Class": "1941-12",
  "Kaidai_KD6_Class": "1941-12",
  "Kaidai_KD7_Class": "1942-09",
  "Kirai_Sen_Class": "1941-12",
  "Junsen_J_IM_Class": "1941-12",
  "Junsen_J2_Class": "1941-12",
  "Junsen_J3_Class": "1941-12",
  "Type_A_Class": "1941-12",
  "Type_B_Class": "1941-12",
  "Type_B_3_Class": "1944-06",
  "Type_C_Class": "1941-12",
  "Type_C3_Class": "1944-05",
  "Type_A_Modified": "1945-05",
  "Sen_Toku_Class": "1944-12",
  "Sen_Taka_Class": "1945-07",
  "Type_A_Midget_Submarine___Ko_Hyoteki": "1941-12"
};

function getSubmarineStartMonth(subKey) {
  return SUB_START_MONTHS[subKey] || "1941-12";
}

// 46 Months
const MONTHS = [
  { id: "1941-12", short: "Dec-41", label: "1941年12月", milestone: "Kaidai KD.3-6, Junsen J.1m-J.3, Kirai-sen, Type A-C", divider: false },
  { id: "1942-01", short: "Jan-42", label: "1942年1月", milestone: "", divider: false },
  { id: "1942-02", short: "Feb-42", label: "1942年2月", milestone: "", divider: false },
  { id: "1942-03", short: "Mar-42", label: "1942年3月", milestone: "", divider: true },
  { id: "1942-04", short: "Apr-42", label: "1942年4月", milestone: "", divider: false },
  { id: "1942-05", short: "May-42", label: "1942年5月", milestone: "", divider: false },
  { id: "1942-06", short: "Jun-42", label: "1942年6月", milestone: "Old Torps gone", divider: false },
  { id: "1942-07", short: "Jul-42", label: "1942年7月", milestone: "", divider: false },
  { id: "1942-08", short: "Aug-42", label: "1942年8月", milestone: "", divider: false },
  { id: "1942-09", short: "Sep-42", label: "1942年9月", milestone: "Type KD.7", divider: true },
  { id: "1942-10", short: "Oct-42", label: "1942年10月", milestone: "", divider: false },
  { id: "1942-11", short: "Nov-42", label: "1942年11月", milestone: "", divider: false },
  { id: "1942-12", short: "Dec-42", label: "1942年12月", milestone: "", divider: false },
  { id: "1943-01", short: "Jan-43", label: "1943年1月", milestone: "", divider: false },
  { id: "1943-02", short: "Feb-43", label: "1943年2月", milestone: "", divider: false },
  { id: "1943-03", short: "Mar-43", label: "1943年3月", milestone: "", divider: true },
  { id: "1943-04", short: "Apr-43", label: "1943年4月", milestone: "", divider: false },
  { id: "1943-05", short: "May-43", label: "1943年5月", milestone: "", divider: false },
  { id: "1943-06", short: "Jun-43", label: "1943年6月", milestone: "", divider: false },
  { id: "1943-07", short: "Jul-43", label: "1943年7月", milestone: "Aleutians -> Truk", divider: false },
  { id: "1943-08", short: "Aug-43", label: "1943年8月", milestone: "", divider: false },
  { id: "1943-09", short: "Sep-43", label: "1943年9月", milestone: "", divider: true },
  { id: "1943-10", short: "Oct-43", label: "1943年10月", milestone: "", divider: false },
  { id: "1943-11", short: "Nov-43", label: "1943年11月", milestone: "", divider: false },
  { id: "1943-12", short: "Dec-43", label: "1943年12月", milestone: "", divider: false },
  { id: "1944-01", short: "Jan-44", label: "1944年1月", milestone: "", divider: false },
  { id: "1944-02", short: "Feb-44", label: "1944年2月", milestone: "", divider: false },
  { id: "1944-03", short: "Mar-44", label: "1944年3月", milestone: "Truk -> Yokosuka", divider: true },
  { id: "1944-04", short: "Apr-44", label: "1944年4月", milestone: "", divider: false },
  { id: "1944-05", short: "May-44", label: "1944年5月", milestone: "Type C.3", divider: false },
  { id: "1944-06", short: "Jun-44", label: "1944年6月", milestone: "", divider: false },
  { id: "1944-07", short: "Jul-44", label: "1944年7月", milestone: "Type B.3", divider: false },
  { id: "1944-08", short: "Aug-44", label: "1944年8月", milestone: "", divider: false },
  { id: "1944-09", short: "Sep-44", label: "1944年9月", milestone: "Sen-Toku", divider: true },
  { id: "1944-10", short: "Oct-44", label: "1944年10月", milestone: "", divider: false },
  { id: "1944-11", short: "Nov-44", label: "1944年11月", milestone: "", divider: false },
  { id: "1944-12", short: "Dec-44", label: "1944年12月", milestone: "Sen-Toku (Dec-44 Errata)", divider: false },
  { id: "1945-01", short: "Jan-45", label: "1945年1月", milestone: "", divider: false },
  { id: "1945-02", short: "Feb-45", label: "1945年2月", milestone: "", divider: false },
  { id: "1945-03", short: "Mar-45", label: "1945年3月", milestone: "", divider: true },
  { id: "1945-04", short: "Apr-45", label: "1945年4月", milestone: "", divider: false },
  { id: "1945-05", short: "May-45", label: "1945年5月", milestone: "Type A Mod.", divider: false },
  { id: "1945-06", short: "Jun-45", label: "1945年6月", milestone: "", divider: false },
  { id: "1945-07", short: "Jul-45", label: "1945年7月", milestone: "Sen-Taka", divider: false },
  { id: "1945-08", short: "Aug-45", label: "1945年8月", milestone: "", divider: false },
  { id: "1945-09", short: "Sep-45", label: "1945年9月", milestone: "", divider: true }
];

// SUBMARINES BILINGUAL DESCRIPTIONS DICTIONARY
const SUB_DESCRIPTIONS = {
  "Kaidai_KD3_Class": {
    "es": "Submarino de ataque de flota de alta velocidad sin hidroavión. Cuenta con 8 tubos lanzatorpedos en total (6 a proa y 2 a popa).",
    "en": "Fast fleet attack submarine without aircraft. 8 total torpedo tubes (6 forward, 2 aft)."
  },
  "Kaidai_KD4_Class": {
    "es": "Variante Kaidai compacta y maniobrable. Cuenta con 6 tubos lanzatorpedos en total (4 a proa y 2 a popa).",
    "en": "Compact Kaidai variant. 6 torpedo tubes total (4 forward, 2 aft)."
  },
  "Kaidai_KD5_Class": {
    "es": "Profundidad de inmersión mejorada (75 m). Submarino de ataque de flota de alta velocidad.",
    "en": "Improved diving depth (75m). High speed fleet attack boat."
  },
  "Kaidai_KD6_Class": {
    "es": "Los submarinos más rápidos de la IJN antes de la guerra (23 nudos en superficie). Gran reserva de torpedos.\\nConversión a Transporte: En 1/43 puede convertirse en submarino de carga transportando una barcaza de desembarco Daihatsu. De ser así, se retira el cañón de cubierta.",
    "en": "Fastest pre-war IJN submarines (23 knots surface). High torpedo endurance.\\nCargo Conversion: In 1/43, conversion to a cargo submarine may occur and a Daihatsu landing craft carried. If so, remove the deck gun."
  },
  "Kaidai_KD7_Class": {
    "es": "Clase de ataque estandarizada en tiempo de guerra. 6 tubos lanzatorpedos (4 a proa y 2 a popa) con 6 recargas a proa (12 torpedos en total), y potente artillería antiaérea de 25 mm.",
    "en": "Wartime standardized attack class. 6 torpedo tubes (4 forward, 2 aft) with 6 forward reloads (12 torpedoes total), powerful 25mm AA guns."
  },
  "Kirai_Sen_Class": {
    "es": "Minador especializado (I-121 a I-124). Transporta 42 minas navales en tubos internos de popa. Cada patrulla es automáticamente una misión de minado.\\nAsignación Especial de Averías: El daño a 'Compuertas de Torpedos de Popa' en la Tabla [E6] se aplica a las Compuertas de Minas de Popa.",
    "en": "Specialized minelayer (I-121..I-124). Carries 42 naval mines in aft internal tubes. Every patrol is automatically a minelaying mission.\\nSpecial Damage Routing: Damage to 'Aft Torpedo Doors' on Chart [E6] instead causes damage to the Aft Mine Doors."
  },
  "Junsen_J_IM_Class": {
    "es": "Junsen I modificado con hangar para hidroavión de exploración. 6 tubos lanzatorpedos (4 a proa y 2 a popa) con 14 recargas (12 a proa y 2 a popa, 20 torpedos en total). Cañones gemelos de cubierta de 140 mm.",
    "en": "Junsen I modified with seaplane hangar. 6 torpedo tubes (4 forward, 2 aft) with 14 reloads (12 forward, 2 aft, 20 torpedoes total). Twin 140mm deck guns."
  },
  "Junsen_J2_Class": {
    "es": "Equipado con hangar de hidroavión a proa de la vela. Recargas dedicadas de popa en los tubos 3 y 4. Cañón de cubierta de doble propósito de 127 mm.",
    "en": "Equipped with aircraft hangar forward of conning tower. Dedicated aft reloads on tubes 3 & 4. 127mm dual-purpose deck gun."
  },
  "Junsen_J3_Class": {
    "es": "Equipado con hangar de hidroavión a proa de la vela. El estado de sistemas incluye casilla de avería para Compuertas de Torpedos de Popa.",
    "en": "Equipped with aircraft hangar forward of conning tower. Systems Status includes Aft Torpedo Doors damage box."
  },
  "Type_A_Class": {
    "es": "Buque insignia de escuadrilla con amplias instalaciones de mando, hidroavión de reconocimiento y cañón de cubierta de 140 mm.",
    "en": "Squadron flagship with extended command facilities, scout seaplane, and 140mm deck gun."
  },
  "Type_B_Class": {
    "es": "La clase de submarino de crucero más numerosa y exitosa de Japón. Transporta 1 hidroavión de exploración Yokosuka E14Y1.",
    "en": "Most numerous and successful Japanese cruiser submarine class. Carries 1 Yokosuka E14Y1 scout seaplane."
  },
  "Type_B_3_Class": {
    "es": "Portador de Kaiten de finales de la guerra. Famoso por hundir al USS Indianapolis (I-58). Equipado con Radar Tipo 22.",
    "en": "Late-war Kaiten carrier. Famous for sinking USS Indianapolis (I-58). Equipped with Type 22 Radar."
  },
  "Type_C_Class": {
    "es": "Submarino pesado de ataque con torpedos: 8 tubos lanzatorpedos a proa y 20 torpedos Tipo 95. Transporta 1 minisubmarino Tipo A (Ko-Hyoteki) con 2 torpedos Tipo 97 en cubierta de popa.\\nRadar: Radar AS/SS Tipo 22 disponible a partir de diciembre de 1944.",
    "en": "Heavy torpedo attack boat: 8 forward torpedo tubes and 20 Type 95 torpedoes. Carries 1 Type A Midget Submarine (Ko-Hyoteki) with 2 Type 97 midget torpedoes on aft deck.\\nRadar: Type 22 AS/SS Radar available Dec. 1944 onwards."
  },
  "Type_A_Modified": {
    "es": "Submarino de crucero de alcance extendido con mayor autonomía diésel, hangar ampliado para 2 hidroaviones de ataque Seiran, 6 tubos lanzatorpedos a proa y 6 recargas (12 torpedos en total) y montajes antiaéreos de 25 mm. Equipado con Radar Tipo 22.",
    "en": "Extended long-range cruiser submarine with enlarged hangar for 2 Aichi M6A1 Seiran bombers, 6 forward torpedo tubes and 6 forward reloads (12 torpedoes total), and 25mm AA suites. Type 22 Radar equipped."
  },
  "Sen_Toku_Class": {
    "es": "Disponible en diciembre de 1944. Submarino portaaviones colosal capaz de transportar 3 bombarderos de ataque Aichi M6A1 Seiran.\\nArmamento: Los 8 tubos lanzatorpedos están a proa; cualquier impacto a tubos de popa en la Tabla [E6] se considera Sin Efecto. Potente artillería con Munición x6, 4 montajes triples AA de 25 mm, y Radares de búsqueda aérea Mk 3 M1 y de superficie Mk 2 M2.",
    "en": "Availability December 1944. Massive aircraft carrier submarine carrying 3 Aichi M6A1 Seiran bombers.\\nArmament: All 8 torpedo tubes are Forward; any aft torpedo tube damage hits on Chart [E6] are treated as No Effect. Heavy gun armament with Ammo x6, 4x 25mm Triple AA guns, Mk 3 M1 Air Search and Mk 2 M2 Sea Search Radar."
  },
  "Sen_Taka_Class": {
    "es": "Submarino revolucionario de muy alta velocidad bajo el agua (19 nudos en inmersión). Casco hidrodinámico, esnórquel y baterías de gran capacidad.\\n• Gran Velocidad Submarina: Nunca recibe penalizador de +1 por detección previa.\\n• Impactos en Motores Eléctricos: El segundo impacto en Motor 1 pasa al Motor 3; el segundo en Motor 2 pasa al Motor 4. Todas las penalizaciones de motores en la Tabla [E3] se reducen en 1.\\n• Avería de Baterías: No sufre el modificador de +1 hasta que las tres baterías estén dañadas.",
    "en": "Revolutionary high-speed submarine (19 knots submerged). Streamlined hull, snorkel, high capacity batteries.\\n• High Speed Underwater: Due to very high underwater speed, this class never gets a +1 modifier for previous detection.\\n• Electric Motor Hits: Second Electric Motor 1 hit goes against Electric Motor 3; second Electric Motor 2 hit goes against Electric Motor 4. All penalties for electric motor hits on Chart [E3] are reduced by 1.\\n• Battery Damage: Does not suffer a +1 drm for battery damage until all three have been damaged."
  },
  "Type_C3_Class": {
    "es": "Submarino de carga de alcance ultralargo (misiones Yanagi hacia Alemania). Cañones dobles de cubierta de 140 mm.\\nRadar: Radar AS/SS Tipo 22 disponible a partir de diciembre de 1944.",
    "en": "Extra long-range cargo submarine (Yanagi missions to Germany). Twin 140mm deck guns.\\nRadar: Type 22 AS/SS Radar available Dec. 1944 onwards."
  },
  "Type_A_Midget_Submarine___Ko_Hyoteki": {
    "es": "Minisubmarino de 2 tripulantes transportado por un submarino nodriza para incursiones de penetración en puertos enemigos [7.16]. Propulsión eléctrica especializada de 600 CV con bancos de baterías a proa y popa, girocompás y cortacables de casco. Armado con dos torpedos Tipo 97 de 45 cm.",
    "en": "Two-man midget submarine carried by fleet submarine mothership for harbour penetration missions [7.16]. Specialized 600 hp electric drive with forward and aft battery banks, gyro compass, and hull wire cutters. Carries two 45cm Type 97 torpedoes."
  }
};

if (typeof window !== 'undefined') {
  window.SUB_DB = SUB_DB;
  window.SUBMARINES_DB = SUB_DB.submarines;
  window.SUB_DESCRIPTIONS = SUB_DESCRIPTIONS;
}

