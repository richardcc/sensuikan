"""
Generates the 3D Printed Deluxe Top Overlay Grid for the Operations Map (Sensuikan):
- Converts the Operations Map into an authentic Dual-Layer Board with Save-Game capability!
- Precision cutouts for:
  * 21 Stations (Paramushiro, Yokosuka, Truk, Midway, Pearl Harbor...) with 15.3 x 15.3 mm pockets.
  * 14 Discrete Transit Pockets with 15.3 x 15.3 mm pockets.
  * Window for Northern Cartouche (Player Aid Doctrine & Combat Procedure).
  * Window for Header Bar (Sensuikan Logo & Official Title).
  * Window for Imperial Classified Seals (Red Wax Seal & Hanko).
  * Ergonomic thumb notch (R=12 mm) for effortless removal.
- Dimensions: 237.6 x 181.1 x 2.5 mm (exact canonical fit into base tray).
- 100% compatible with the Save-Game Grate Lid (sensuikan_save_game_grate_lid.stl)!
- Watertight solid boolean union via manifold3d.
"""

import os
import sys
import numpy as np
import shapely.geometry as sg
from shapely.geometry import box, Polygon, Point, MultiPolygon
from shapely.ops import unary_union
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import trimesh
from manifold3d import Manifold, Mesh

STL_DIR = os.path.abspath("stl")
PREV_DIR = os.path.abspath("images/previews")
DOCS_DIR = os.path.abspath("docs")
os.makedirs(STL_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

sys.path.append(os.path.abspath("scripts/generators"))
from generate_canonical_models import extrude_polygon_to_triangles

def build_operations_map_overlay():
    print("Designing 3D Dual-Layer Overlay Grid for Operations Map...")
    
    MAP_W, MAP_H = 241.7, 185.2
    OV_W, OV_H = 237.6, 181.1
    TOTAL_H = 2.5  # 2.5 mm thickness (standard dual-layer counter depth)
    
    shift_x = (MAP_W - OV_W) / 2.0  # 2.05 mm
    shift_y = (MAP_H - OV_H) / 2.0  # 2.05 mm
    
    def map_to_3d(x_map, y_map):
        x_3d = x_map - shift_x
        y_3d = OV_H - (y_map - shift_y)
        return x_3d, y_3d

    # 1. Base Plate & Perimeter Frame
    plate_poly = box(0.0, 0.0, OV_W, OV_H)
    
    # Ergonomic thumb notches (top and bottom edges)
    notch_r = 12.0
    bot_notch = Point(OV_W / 2.0, 0.0).buffer(notch_r, resolution=32)
    top_notch = Point(OV_W / 2.0, OV_H).buffer(notch_r, resolution=32)
    
    # 2. Define All 21 Stations (Matching calibrated Operations Map)
    stations_mm = [
        ('paramushiro', 140.7, 33.2, "Paramushiro"),
        ('yokosuka', 116.1, 58.5, "Yokosuka"),
        ('truk', 134.1, 112.2, "Truk"),
        ('new_guinea', 116.0, 132.0, "New Guinea"),
        ('dutch_east_indies', 64.8, 143.8, "Dutch E. Indies"),
        ('aleutian', 198.6, 31.2, "Aleutian Is."),
        ('okinawa', 93.8, 77.0, "Okinawa"),
        ('iwo_jima', 119.0, 81.6, "Iwo Jima"),
        ('midway', 178.3, 81.6, "Midway"),
        ('philippines', 72.5, 91.0, "Philippines"),
        ('marianas', 112.0, 99.0, "Marianas"),
        ('indian_ocean', 13.7, 107.6, "Indian Ocean"),
        ('leyte_gulf', 87.5, 113.0, "Leyte Gulf"),
        ('malaya', 28.7, 120.0, "Malaya"),
        ('tarawa', 181.3, 131.2, "Tarawa"),
        ('guadalcanal', 154.0, 150.4, "Guadalcanal"),
        ('west_coast', 228.3, 54.4, "West Coast US"),
        ('pearl_harbor', 216.9, 96.9, "Pearl Harbor"),
        ('panama_canal', 228.3, 165.9, "Panama Canal"),
        ('australia', 136.7, 174.2, "Australia"),
        ('europe', 17.9, 170.7, "Europe"),
    ]
    
    # 3. Define All 14 Discrete Transit Boxes
    transit_boxes_mm = [
        # West Coast (3)
        ('wc_t1', 172.5, 54.4, "WC Transit 1"),
        ('wc_t2', 191.0, 54.4, "WC Transit 2"),
        ('wc_t3', 209.5, 54.4, "WC Transit 3"),
        # Pearl Harbor (2)
        ('ph_t1', 180.0, 108.0, "PH Transit 1"),
        ('ph_t2', 198.5, 96.9, "PH Transit 2"),
        # Panama Canal (3)
        ('pc_t1', 172.5, 165.9, "PC Transit 1"),
        ('pc_t2', 191.0, 165.9, "PC Transit 2"),
        ('pc_t3', 209.5, 165.9, "PC Transit 3"),
        # Australia (2)
        ('aus_t1', 100.0, 154.0, "Aus Transit 1"),
        ('aus_t2', 118.5, 160.0, "Aus Transit 2"),
        # Europe (4)
        ('eu_t4', 92.0, 170.7, "EU Transit 4"),
        ('eu_t3', 73.5, 170.7, "EU Transit 3"),
        ('eu_t2', 55.0, 170.7, "EU Transit 2"),
        ('eu_t1', 36.5, 170.7, "EU Transit 1"),
    ]
    
    POCKET_SZ = 15.3  # Precision counter pocket size with +0.3 mm clearance
    cutouts = []
    
    # Add station pockets
    for sid, mx, my, sname in stations_mm:
        cx, cy = map_to_3d(mx, my)
        p = box(cx - POCKET_SZ/2.0, cy - POCKET_SZ/2.0, cx + POCKET_SZ/2.0, cy + POCKET_SZ/2.0)
        cutouts.append(p)
        
    # Add transit pockets
    for tid, mx, my, tname in transit_boxes_mm:
        cx, cy = map_to_3d(mx, my)
        p = box(cx - POCKET_SZ/2.0, cy - POCKET_SZ/2.0, cx + POCKET_SZ/2.0, cy + POCKET_SZ/2.0)
        cutouts.append(p)

    # 4. Large Windows for Map Features
    # A. Player Aid Cartouche (Northern China / Siberia)
    # Map coords: X: 4.15 to 92.2 mm, Y: 12.8 to 50.5 mm
    cart_x0, cart_y0 = map_to_3d(4.15, 50.5)
    cart_x1, cart_y1 = map_to_3d(92.2, 12.8)
    cart_win = box(max(2.0, cart_x0), cart_y0, cart_x1, cart_y1)
    cutouts.append(cart_win)
    
    # B. Header Bar Window (Sensuikan Logo & Official Title)
    # Map coords: X: 2.1 to 239.6 mm, Y: 2.2 to 12.8 mm
    head_x0, head_y0 = map_to_3d(2.1, 12.8)
    head_x1, head_y1 = map_to_3d(239.6, 2.2)
    head_win = box(max(2.0, head_x0), head_y0, min(OV_W - 2.0, head_x1), min(OV_H - 1.0, head_y1))
    cutouts.append(head_win)
    
    # C. Classified Stamps Window under Pearl Harbor
    # Map coords: X: 193 to 223 mm, Y: 112 to 127 mm
    st_x0, st_y0 = map_to_3d(193.0, 127.0)
    st_x1, st_y1 = map_to_3d(223.0, 112.0)
    stamps_win = box(st_x0, st_y0, st_x1, st_y1)
    cutouts.append(stamps_win)
    
    # Union all cutouts and thumb notches
    all_cutouts = unary_union(cutouts + [bot_notch, top_notch])
    
    # 5. Subtract cutouts from plate to get final 2D polygon
    grid_2d = plate_poly.difference(all_cutouts)
    print(f"Computed 2D Overlay Polygon: {grid_2d.geom_type}")
    
    # 6. Extrude to 3D Mesh
    print("Extruding 2D polygon to 3D mesh via earcut...")
    tris = []
    for poly in (grid_2d.geoms if isinstance(grid_2d, MultiPolygon) else [grid_2d]):
        tris.extend(extrude_polygon_to_triangles(poly, 0.0, TOTAL_H))
        
    pts = np.array([p for t in tris for p in t], dtype=np.float32)
    verts, faces = np.unique(pts, axis=0, return_inverse=True)
    faces = faces.reshape(-1, 3)
    
    # Convert to Manifold for 100% watertight verification
    print("Ensuring 100% watertight manifold volume...")
    m_manifold = Manifold(Mesh(vert_properties=verts, tri_verts=faces))
    mesh_out = m_manifold.to_mesh()
    mesh_tri = trimesh.Trimesh(vertices=mesh_out.vert_properties[:, :3], faces=mesh_out.tri_verts)
    
    print(f"Overlay Mesh Result: is_volume={mesh_tri.is_volume}, watertight={mesh_tri.is_watertight}, faces={len(mesh_tri.faces)}")
    
    out_stl = os.path.join(STL_DIR, "sensuikan_operations_map_top_overlay.stl")
    mesh_tri.export(out_stl)
    print(f"Exported Operations Map Overlay STL: {out_stl}")
    
    # 7. Generate Visual Diagram Preview
    print("Generating visual preview diagram...")
    fig = plt.figure(figsize=(10, 7.6), dpi=180)
    fig.patch.set_facecolor('#0B1120')
    ax = fig.add_subplot(111)
    ax.set_facecolor('#0B1120')
    ax.set_xlim(-8, OV_W + 8)
    ax.set_ylim(-8, OV_H + 8)
    ax.axis('off')
    
    # Base grid
    for geom in (grid_2d.geoms if isinstance(grid_2d, MultiPolygon) else [grid_2d]):
        gx, gy = geom.exterior.xy
        ax.fill(gx, gy, color='#1E293B', alpha=0.92)
        ax.plot(gx, gy, color='#38BDF8', lw=0.7)
        for interior in geom.interiors:
            ix, iy = interior.xy
            ax.fill(ix, iy, color='#0B1120')
            ax.plot(ix, iy, color='#F59E0B', lw=0.6)
            
    # Labels for stations
    for sid, mx, my, sname in stations_mm:
        cx, cy = map_to_3d(mx, my)
        ax.text(cx, cy, sname, color='#FCD34D', fontsize=4.2, fontweight='bold', ha='center', va='center')
        
    # Labels for transit
    for tid, mx, my, tname in transit_boxes_mm:
        cx, cy = map_to_3d(mx, my)
        ax.text(cx, cy, tname.replace("Transit ", "T"), color='#38BDF8', fontsize=4.0, ha='center', va='center')

    ax.text(OV_W / 2.0, OV_H - 7, "CUBIERTA TROQUELADA 3D PARA MAPA DE OPERACIONES (SAVE-GAME DUAL-LAYER)", 
            color='#FCD34D', fontsize=9.5, fontweight='bold', ha='center')
    ax.text(OV_W / 2.0, 5, "237.6 × 181.1 × 2.5 MM · 35 ALVÉOLOS INDIVIDUALES DE 15.3 MM · COMPATIBLE CON TAPA REJILLA", 
            color='#38BDF8', fontsize=7.0, ha='center')

    out_prev = os.path.join(PREV_DIR, "preview_operations_map_overlay.jpg")
    fig.savefig(out_prev, bbox_inches='tight', facecolor='#0B1120')
    plt.close(fig)
    print(f"Exported Visual Preview: {out_prev}")
    
    return out_stl, out_prev

if __name__ == "__main__":
    build_operations_map_overlay()
