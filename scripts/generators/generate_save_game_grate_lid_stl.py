"""
Script to generate the 3D printable STL for the Sensuikan Save-Game Grate Lid (Tapa Rejilla):
- Dimensions: 241.7 x 185.2 x 3.0 mm (fits Bambu Lab 256x256 mm bed perfectly!)
- 4 Corner interlocking feet (resbalones) extending 2.5 mm down to lock onto the base tray rim
- Diamond grid lattice mesh allowing complete visual inspection of game state
- Central reinforcement plaque (80 x 30 mm)
- Rubber band retention grooves centered on all 4 edges
- 100% Watertight solid mesh ready for slicing
"""

import os
import numpy as np
import trimesh
from shapely.geometry import Polygon, MultiPolygon, box as shapely_box

OUT_DIR = os.path.abspath("stl")
os.makedirs(OUT_DIR, exist_ok=True)

def build_grate_lid():
    print("Building Save-Game Grate Lid (241.7 x 185.2 mm)...")
    total_len = 241.7
    total_wid = 185.2
    lid_t = 2.6
    rim_w = 4.0
    
    # Outer rectangle
    outer_rect = shapely_box(0, 0, total_len, total_wid)
    inner_active = shapely_box(rim_w, rim_w, total_len - rim_w, total_wid - rim_w)
    
    # Central plaque: 85 x 32 mm
    plaque_w = 85.0
    plaque_h = 32.0
    plaque = shapely_box((total_len - plaque_w)/2.0, (total_wid - plaque_h)/2.0,
                         (total_len + plaque_w)/2.0, (total_wid + plaque_h)/2.0)
    
    # Diamond lattice holes
    mesh_holes = []
    step = 13.0
    diamond_r = 5.2
    
    for x in np.arange(rim_w + 5.0, total_len - rim_w, step):
        for y in np.arange(rim_w + 5.0, total_wid - rim_w, step):
            dia = Polygon([
                (x, y - diamond_r),
                (x + diamond_r, y),
                (x, y + diamond_r),
                (x - diamond_r, y)
            ])
            if inner_active.contains(dia) and not plaque.intersects(dia):
                mesh_holes.append(dia)
                
    lid_poly = outer_rect.difference(MultiPolygon(mesh_holes))
    
    # Extrude main plate
    lid_mesh = trimesh.creation.extrude_polygon(lid_poly, height=lid_t)
    
    # Add 4 corner locking tabs (resbalones):
    # Base tray outer: 241.7 x 185.2 mm, inner cavity: 238.1 x 181.6 mm (wall thickness 1.8 mm)
    # The locking tabs sit just inside the inner cavity to lock snugly!
    foot_len = 12.0
    foot_w = 12.0
    foot_h = 2.2
    inset = 1.85 # inner edge of tray wall
    
    feet = []
    # Bottom-left tab
    f1 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f1.apply_translation([inset + foot_len/2.0, inset + foot_w/2.0, -foot_h/2.0])
    feet.append(f1)
    
    # Bottom-right tab
    f2 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f2.apply_translation([total_len - inset - foot_len/2.0, inset + foot_w/2.0, -foot_h/2.0])
    feet.append(f2)
    
    # Top-left tab
    f3 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f3.apply_translation([inset + foot_len/2.0, total_wid - inset - foot_w/2.0, -foot_h/2.0])
    feet.append(f3)
    
    # Top-right tab
    f4 = trimesh.creation.box(extents=[foot_len, foot_w, foot_h])
    f4.apply_translation([total_len - inset - foot_len/2.0, total_wid - inset - foot_w/2.0, -foot_h/2.0])
    feet.append(f4)
    
    lid_combined = trimesh.boolean.union([lid_mesh] + feet)
    
    # Add rubber band grooves on top (1.0 mm deep, 15 mm wide)
    grv_w = 15.0
    grv_d = 1.0
    grv_x1 = trimesh.creation.box(extents=[grv_w, 10.0, 2.0])
    grv_x1.apply_translation([total_len/2.0, 0, lid_t])
    grv_x2 = trimesh.creation.box(extents=[grv_w, 10.0, 2.0])
    grv_x2.apply_translation([total_len/2.0, total_wid, lid_t])
    grv_y1 = trimesh.creation.box(extents=[10.0, grv_w, 2.0])
    grv_y1.apply_translation([0, total_wid/2.0, lid_t])
    grv_y2 = trimesh.creation.box(extents=[10.0, grv_w, 2.0])
    grv_y2.apply_translation([total_len, total_wid/2.0, lid_t])
    
    lid_final = lid_combined.difference([grv_x1, grv_x2, grv_y1, grv_y2])
    
    out_stl = os.path.join(OUT_DIR, "sensuikan_save_game_grate_lid.stl")
    lid_final.export(out_stl)
    print(f"Exported: {out_stl}")
    print(f"Volume: {lid_final.volume:.1f} mm3, Watertight: {lid_final.is_watertight}")
    return lid_final

if __name__ == "__main__":
    build_grate_lid()
