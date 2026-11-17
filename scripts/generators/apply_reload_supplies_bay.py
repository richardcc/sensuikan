import re

with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Define RELOAD_CAPACITIES and draw_reload_supplies_bay right before draw_armament_slot
bay_code = '''
RELOAD_CAPACITIES = {
    'Kaidai_KD3_Class': 8,
    'Kaidai_KD4_Class': 6,
    'Kaidai_KD5_Class': 6,
    'Kaidai_KD6_Class': 6,
    'Kaidai_KD7_Class': 6,
    'Kirai_Sen_Class': 8,
    'Junsen_J_IM_Class': 12,
    'Junsen_J2_Class': 9,
    'Junsen_J3_Class': 15,
    'Type_A_Class': 12,
    'Type_B_Class': 11,
    'Type_B_3_Class': 13,
    'Type_C_Class': 12,
    'Type_C3_Class': 13,
    'Type_A_Modified': 12,
    'Sen_Toku_Class': 12,
    'Sen_Taka_Class': 6,
    'Type_A_Midget_Submarine___Ko_Hyoteki': 0
}

def draw_reload_supplies_bay(ax, cx, cy, capacity=8):
    w_bay = 31.5 * BROTHER_COMP
    h_bay = 31.8 * BROTHER_COMP
    x0 = cx - w_bay / 2.0
    y0 = cy - h_bay / 2.0
    
    # Outer container box (warm drafting parchment with brass/steel technical border)
    ax.add_patch(patches.Rectangle((x0, y0), w_bay, h_bay,
                                   linewidth=1.1 * BROTHER_COMP, edgecolor='#9E782F',
                                   facecolor='#FAF5EA', zorder=2.8))
    # Inner subtle technical border
    inner_gap = 0.5 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((x0 + inner_gap, y0 + inner_gap), w_bay - 2*inner_gap, h_bay - 2*inner_gap,
                                   linewidth=0.4 * BROTHER_COMP, edgecolor='#C5A059',
                                   facecolor='none', zorder=2.9))
    
    # 4 Quadrant Ghost Guides (dashed lines dividing into 4 individual 15x15 counter zones)
    mid_x = cx
    mid_y = cy
    ax.plot([mid_x, mid_x], [y0 + 1.0*BROTHER_COMP, y0 + h_bay - 1.0*BROTHER_COMP],
            color='#C5A059', lw=0.6*BROTHER_COMP, linestyle='--', zorder=3.1, alpha=0.7)
    ax.plot([x0 + 1.0*BROTHER_COMP, x0 + w_bay - 1.0*BROTHER_COMP], [mid_y, mid_y],
            color='#C5A059', lw=0.6*BROTHER_COMP, linestyle='--', zorder=3.1, alpha=0.7)
            
    # Watermarks in quadrants:
    qw = w_bay / 4.0
    qh = h_bay / 4.0
    draw_watermark(ax, cx - qw, cy + qh - 1.5*BROTHER_COMP, "twin_torpedoes_rack", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
    draw_watermark(ax, cx + qw, cy + qh - 1.5*BROTHER_COMP, "twin_torpedoes_rack", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
    draw_watermark(ax, cx - qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
    draw_watermark(ax, cx + qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)

    # Header technical plaque at the top:
    plaque_h = 4.6 * BROTHER_COMP
    plaque_y = y0 + h_bay - plaque_h - 0.4 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((x0 + 0.6*BROTHER_COMP, plaque_y), w_bay - 1.2*BROTHER_COMP, plaque_h,
                                   facecolor='#0D1520', edgecolor='#C5A059', lw=0.75*BROTHER_COMP, alpha=0.95, zorder=4.5))
    # 4 micro gold rivets
    rivet_r = 0.18 * BROTHER_COMP
    for rx, ry in [(x0 + 1.3*BROTHER_COMP, plaque_y + 0.7*BROTHER_COMP),
                   (x0 + w_bay - 1.3*BROTHER_COMP, plaque_y + 0.7*BROTHER_COMP),
                   (x0 + 1.3*BROTHER_COMP, plaque_y + plaque_h - 0.7*BROTHER_COMP),
                   (x0 + w_bay - 1.3*BROTHER_COMP, plaque_y + plaque_h - 0.7*BROTHER_COMP)]:
        ax.add_patch(patches.Circle((rx, ry), rivet_r, facecolor='#E2B765', edgecolor='#45300E', lw=0.2*BROTHER_COMP, zorder=4.8))
        
    ax.text(cx, plaque_y + plaque_h/2.0, "FORWARD RELOADS & SUPPLIES",
            fontsize=4.4, weight='bold', color='#FAF6ED', ha='center', va='center', zorder=5)
            
    # Central Capacity Badge
    ax.text(cx, cy - 1.0 * BROTHER_COMP, f"CAPACITY: {capacity} COUNTERS",
            fontsize=5.0, weight='bold', color='#784B05', ha='center', va='center', zorder=3.8)
    ax.text(cx, cy - 5.0 * BROTHER_COMP, "(4 Quadrants • Stacks to Capacity)",
            fontsize=3.6, weight='bold', color='#64748B', ha='center', va='center', zorder=3.8)

def draw_armament_slot'''

code = code.replace("def draw_armament_slot", bay_code, 1)

# 2. Update SUBMARINE_ARMAMENT_MAP
new_armament_map = '''SUBMARINE_ARMAMENT_MAP = {
    "Kaidai_KD3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld"), None, None],
        "r4": [("120mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD4_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("120mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD5_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("100mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD6_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("100mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("Daihatsu", "Landing", "cargo"), ("13.1mm\\nStatus", "", "aa"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD7_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("25mm AA\\nStatus #1", "", "aa"), ("25mm AA\\nStatus #2", "", "aa")],
        "r3": [("120mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Kirai_Sen_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("Aft Mine\\nDoors", "", "mine_door"), ("Mines\\nx42", "", "mines"), None, None],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Mine Tunnels", "Mine Handling", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Junsen_J_IM_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\\nStatus #2", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r3": [("140mm\\nStatus #1", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Junsen_J2_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\\nReload", "", "rld"), ("Aft\\nReload", "", "rld")],
        "r3": [("127mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("13.1mm\\nStatus", "", "aa"), None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Catapult", "Hangar", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Aft Torp Doors", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Batteries", "Periscope", "Hydrophones", None]
    },
    "Junsen_J3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r3": [("13.1mm\\nStatus #1", "", "aa"), ("13.1mm\\nStatus #2", "", "aa"), None, None],
        "r4": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "sys": ["Catapult", "Hangar", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Aft Torp Doors", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Batteries", "Periscope", "Hydrophones", None]
    },
    "Type_A_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Type_B_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r3": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), None, None],
        "r4": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_B_3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r3": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), None, None],
        "r4": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "sys": ["Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Type_C_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), None, None],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "sys": ["Type 22 Radar", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_C3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\\nStatus #2", "", "gun"), ("Ammo\\nx5", "", "ammo")],
        "r3": [("140mm\\nStatus #1", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm Twin\\nStatus #1", "", "aa"), ("25mm Twin\\nStatus #2", "", "aa"), None, None],
        "r5": [("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai"), ("Kaiten\\nSuicide Torpedo", "", "kai")],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Type_A_Modified": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("25mm Single\\nStatus", "", "aa"), None],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm Triple\\nStatus #1", "", "aa"), ("25mm Triple\\nStatus #2", "", "aa"), None, None],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Sen_Toku_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("140mm\\nStatus", "", "gun"), ("Ammo\\nx5", "", "ammo"), None, None],
        "r4": [("25mm Triple\\nStatus #1", "", "aa"), ("25mm Triple\\nStatus #2", "", "aa"), None, None],
        "r5": [("25mm Triple\\nStatus #3", "", "aa"), ("25mm Single\\nStatus", "", "aa"), ("Mk 3 M1\\nAir Srch Radar", "", "radar"), ("Mk 2 M2\\nSea Srch Radar", "", "radar")],
        "sys": ["Crane", "Hangar", "Radio", "Periscope",
                "Hydrophones", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes",
                "Batteries", "Fuel Tanks", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Diesel Engine 3", "Diesel Engine 4"]
    },
    "Sen_Taka_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [None, None, None, None],
        "r3": [("25mm Single\\nStatus", "", "aa"), None, None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Snorkel", "Radar", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), None, None],
        "r2": [None, None, None, None],
        "r3": [None, None, None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Periscope", "Rudder Control", "Batteries", "Electric Motor",
                "Gyro Compass", "Trim Tanks", "Air System", "Ballast",
                None, None, None, None,
                None, None, None, None]
    }
}'''

# Replace SUBMARINE_ARMAMENT_MAP in code
# Find start of SUBMARINE_ARMAMENT_MAP and end of it
map_start = code.find("SUBMARINE_ARMAMENT_MAP = {")
map_end = code.find("def draw_nautical_chart_border")

if map_start != -1 and map_end != -1:
    code = code[:map_start] + new_armament_map + "\n\n" + code[map_end:]
    print("Replaced SUBMARINE_ARMAMENT_MAP successfully!")
else:
    print("ERROR finding SUBMARINE_ARMAMENT_MAP bounds")

# 3. Update the drawing loop for Row 3 & Row 4:
loop_target = """            # Row 3: (Y = 69.0 mm)
            y_r3 = to_y(69.0)
            for i, item in enumerate(arm_cfg.get('r3', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r3, item)

            # Row 4: (Y = 85.8 mm)
            y_r4 = to_y(85.8)
            for i, item in enumerate(arm_cfg.get('r4', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r4, item)"""

loop_replacement = """            # Row 3: (Y = 69.0 mm) & Row 4: (Y = 85.8 mm)
            y_r3 = to_y(69.0)
            y_r4 = to_y(85.8)
            
            capacity = RELOAD_CAPACITIES.get(key, 0)
            if capacity > 0:
                # 2x2 Square Bay for Forward Reloads & Supplies (occupying Columns 3 & 4 across Rows 3 & 4)
                area_cx = (col_x[2] + col_x[3]) / 2.0
                area_cy = (y_r3 + y_r4) / 2.0
                draw_reload_supplies_bay(ax, area_cx, area_cy, capacity=capacity)

            # Draw row 3 items (only columns 0 and 1 if square bay is present)
            for i, item in enumerate(arm_cfg.get('r3', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r3, item)

            # Draw row 4 items (only columns 0 and 1 if square bay is present)
            for i, item in enumerate(arm_cfg.get('r4', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r4, item)"""

if loop_target in code:
    code = code.replace(loop_target, loop_replacement)
    print("Replaced loop for Row 3 & Row 4 successfully!")
else:
    print("ERROR finding loop target for Row 3 & Row 4")

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("Saved generate_canonical_player_cards.py with Square Bay for Reloads & Supplies!")
