"""
Script to generate the 3D printable STL for the Sensuikan Cards & Dice Caddy:
- Compartment 1: Sleeved Cards (72x98 mm, fits cards in premium sleeves up to 70x96 mm) with thumb notches
- Compartment 2: Dice Tray (36x98 mm, holds 1d10 + 4d6 with room to spare)
- Compartment 3: Aux / Mission Chits Tray (110x37 mm)
- Outer dimensions: 145 x 115 x 22 mm (modular with the 145 mm counter trays!)
- Features rubber band grooves for transport security
- Generates matching Diamond Mesh Lid
"""

import os
import numpy as np
import trimesh
from shapely.geometry import Polygon, MultiPolygon, Point, box as shapely_box

OUT_DIR = os.path.abspath("stl")
os.makedirs(OUT_DIR, exist_ok=True)

def build_caddy():
    print("Building Cards & Dice Caddy Base...")
    # Outer bounds: X: [0, 145], Y: [0, 115], Z: [0, 22]
    total_len = 145.0
    total_wid = 115.0
    total_h = 22.0
    floor_t = 2.0
    wall_t = 2.5
    div_t = 2.0
    
    # Outer box
    outer_box = trimesh.creation.box(extents=[total_len, total_wid, total_h])
    outer_box.apply_translation([total_len/2.0, total_wid/2.0, total_h/2.0])
    
    # Cavity 1: Sleeved Cards
    # In Y from wall_t to wall_t + 72 = 2.5 to 74.5
    # In X from wall_t to wall_t + 98 = 2.5 to 100.5
    card_len = 98.0
    card_wid = 72.0
    card_x0 = wall_t
    card_y0 = wall_t
    
    card_cavity = trimesh.creation.box(extents=[card_len, card_wid, total_h - floor_t + 1.0])
    card_cavity.apply_translation([card_x0 + card_len/2.0, card_y0 + card_wid/2.0, floor_t + (total_h - floor_t + 1.0)/2.0])
    
    # Thumb scoops for cards (cylinders along X at card_y0 and card_y0 + card_wid)
    scoop_r = 12.0
    # Left scoop at card_x0 + card_len/2, card_y0
    scoop_1 = trimesh.creation.cylinder(radius=scoop_r, height=total_h)
    scoop_1.apply_translation([card_x0 + card_len/2.0, card_y0, total_h/2.0 + floor_t])
    
    # Cavity 2: Dice
    # In Y from card_y0 + card_wid + div_t = 74.5 + 2.0 = 76.5 to 76.5 + 36 = 112.5 (leaves 2.5 wall)
    # In X from wall_t to wall_t + 98 = 2.5 to 100.5
    dice_len = 98.0
    dice_wid = 36.0
    dice_x0 = wall_t
    dice_y0 = card_y0 + card_wid + div_t
    
    dice_cavity = trimesh.creation.box(extents=[dice_len, dice_wid, total_h - floor_t + 1.0])
    dice_cavity.apply_translation([dice_x0 + dice_len/2.0, dice_y0 + dice_wid/2.0, floor_t + (total_h - floor_t + 1.0)/2.0])
    
    # Cavity 3: Aux Tokens / Mission Markers / Salvaged Chits
    # In X from card_x0 + card_len + div_t = 100.5 + 2.0 = 102.5 to 102.5 + 40 = 142.5 (leaves 2.5 wall)
    # In Y from wall_t = 2.5 to total_wid - wall_t = 112.5 (width 110.0)
    aux_x0 = card_x0 + card_len + div_t
    aux_y0 = wall_t
    aux_len = total_len - wall_t - aux_x0
    aux_wid = total_wid - 2 * wall_t
    
    aux_cavity = trimesh.creation.box(extents=[aux_len, aux_wid, total_h - floor_t + 1.0])
    aux_cavity.apply_translation([aux_x0 + aux_len/2.0, aux_y0 + aux_wid/2.0, floor_t + (total_h - floor_t + 1.0)/2.0])
    
    # Rubber band grooves on top rim (1.2 mm deep, 14 mm wide)
    groove_w = 14.0
    groove_d = 1.2
    # Grooves along X at Y=0 and Y=total_wid
    grv_x1 = trimesh.creation.box(extents=[groove_w, 10.0, groove_d*2])
    grv_x1.apply_translation([total_len/2.0, 0, total_h])
    grv_x2 = trimesh.creation.box(extents=[groove_w, 10.0, groove_d*2])
    grv_x2.apply_translation([total_len/2.0, total_wid, total_h])
    
    # Grooves along Y at X=0 and X=total_len
    grv_y1 = trimesh.creation.box(extents=[10.0, groove_w, groove_d*2])
    grv_y1.apply_translation([0, total_wid/2.0, total_h])
    grv_y2 = trimesh.creation.box(extents=[10.0, groove_w, groove_d*2])
    grv_y2.apply_translation([total_len, total_wid/2.0, total_h])
    
    # Difference
    print("Performing boolean difference for cavities...")
    caddy = outer_box.difference([card_cavity, scoop_1, dice_cavity, aux_cavity, grv_x1, grv_x2, grv_y1, grv_y2])
    
    out_stl = os.path.join(OUT_DIR, "sensuikan_cards_and_dice_caddy.stl")
    caddy.export(out_stl)
    print(f"Exported: {out_stl}")
    print(f"Volume: {caddy.volume:.1f} mm3, Watertight: {caddy.is_watertight}")
    return caddy

def build_caddy_lid():
    print("Building Cards & Dice Caddy Lid with Diamond Mesh...")
    total_len = 145.0
    total_wid = 115.0
    lid_t = 2.4
    rim_w = 4.0
    
    # 2D base polygon: outer rectangle minus diamond holes
    outer_rect = shapely_box(0, 0, total_len, total_wid)
    inner_active = shapely_box(rim_w, rim_w, total_len - rim_w, total_wid - rim_w)
    
    # Central plaque for text: 80 x 24 mm in center
    plaque_w = 84.0
    plaque_h = 24.0
    plaque = shapely_box((total_len - plaque_w)/2.0, (total_wid - plaque_h)/2.0,
                         (total_len + plaque_w)/2.0, (total_wid + plaque_h)/2.0)
    
    # Generate diamond grid holes
    mesh_holes = []
    step = 10.0
    diamond_r = 4.0
    
    for x in np.arange(rim_w + 3.0, total_len - rim_w, step):
        for y in np.arange(rim_w + 3.0, total_wid - rim_w, step):
            # Diamond polygon (rotated square)
            dia = Polygon([
                (x, y - diamond_r),
                (x + diamond_r, y),
                (x, y + diamond_r),
                (x - diamond_r, y)
            ])
            # Check if strictly inside inner_active and doesn't overlap plaque
            if inner_active.contains(dia) and not plaque.intersects(dia):
                mesh_holes.append(dia)
                
    lid_poly = outer_rect.difference(MultiPolygon(mesh_holes))
    
    # Extrude 2D poly
    lid_mesh = trimesh.creation.extrude_polygon(lid_poly, height=lid_t)
    
    # Add locking corner feet (resbalones) going down by 2.5 mm to hug inside of caddy rim
    foot_w = 7.0
    foot_len = 7.0
    foot_h = 2.5
    foot_inset = 2.5 # wall thickness of base
    
    # 4 corner tabs:
    feet = []
    # Bottom-left
    f1 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f1.apply_translation([foot_inset + foot_len/2.0, foot_inset + foot_w/2.0, -foot_h/2.0])
    feet.append(f1)
    
    # Bottom-right
    f2 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f2.apply_translation([total_len - foot_inset - foot_len/2.0, foot_inset + foot_w/2.0, -foot_h/2.0])
    feet.append(f2)
    
    # Top-left
    f3 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f3.apply_translation([foot_inset + foot_len/2.0, total_wid - foot_inset - foot_w/2.0, -foot_h/2.0])
    feet.append(f3)
    
    # Top-right
    f4 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f4.apply_translation([total_len - foot_inset - foot_len/2.0, total_wid - foot_inset - foot_w/2.0, -foot_h/2.0])
    feet.append(f4)
    
    lid_full = trimesh.boolean.union([lid_mesh] + feet)
    
    # Grooves on top of lid for rubber bands (1.0 mm deep, 14 mm wide)
    grv_x1 = trimesh.creation.box(extents=[14.0, 10.0, 2.0])
    grv_x1.apply_translation([total_len/2.0, 0, lid_t])
    grv_x2 = trimesh.creation.box(extents=[14.0, 10.0, 2.0])
    grv_x2.apply_translation([total_len/2.0, total_wid, lid_t])
    grv_y1 = trimesh.creation.box(extents=[10.0, 14.0, 2.0])
    grv_y1.apply_translation([0, total_wid/2.0, lid_t])
    grv_y2 = trimesh.creation.box(extents=[10.0, 14.0, 2.0])
    grv_y2.apply_translation([total_len, total_wid/2.0, lid_t])
    
    lid_final = lid_full.difference([grv_x1, grv_x2, grv_y1, grv_y2])
    
    out_stl = os.path.join(OUT_DIR, "sensuikan_cards_and_dice_caddy_lid.stl")
    lid_final.export(out_stl)
    print(f"Exported: {out_stl}")
    print(f"Volume: {lid_final.volume:.1f} mm3, Watertight: {lid_final.is_watertight}")
    return lid_final

if __name__ == "__main__":
    build_caddy()
    build_caddy_lid()
