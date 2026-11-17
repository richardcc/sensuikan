"""
Generates the Deluxe Reserve Fleet Depot Tray (Sensuikan):
- Motif: Imperial Japanese Navy Anchor & Sakura Crest (桜に錨) + Navigational Compass Rose
- Floor relief: Structural navigational rays and embossed IJN naval crest
- Fits 16-17 sheets of 200g cardstock (depth 4.5 mm) with 2 ergonomic thumb notches (R=12mm)
- Exports:
  1. stl/sensuikan_canonical_reserve_depot_tray_monolithic.stl (watertight solid)
  2. stl/sensuikan_reserve_depot_tray_dual_color_bambu.3mf (Multi-part AMS ready, rotated 90 deg, zero error)
  3. images/previews/preview_reserve_depot_tray_art.jpg (2D/3D visual preview)
"""

import os
import sys
import numpy as np
import shapely.geometry as sg
from shapely.geometry import Polygon, Point, box, MultiPolygon
from shapely.ops import unary_union
import trimesh
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'generators')))
from generate_canonical_models import extrude_polygon_to_triangles, write_binary_stl

STL_DIR = os.path.abspath("stl")
PREV_DIR = os.path.abspath("images/previews")
os.makedirs(STL_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)

def generate_deluxe_reserve_depot():
    print("Designing Deluxe Reserve Fleet Depot Tray with IJN Sakura & Anchor Motif...")
    
    TRAY_W = 241.7
    TRAY_H = 185.2
    TOTAL_H = 5.5
    FLOOR_H = 1.0
    POCKET_DEPTH = 4.5
    
    POCKET_W = 238.2
    POCKET_H = 181.7
    p_x0 = (TRAY_W - POCKET_W) / 2.0
    p_y0 = (TRAY_H - POCKET_H) / 2.0
    
    cx = TRAY_W / 2.0  # 120.85
    cy = TRAY_H / 2.0  # 92.60
    
    # -------------------------------------------------------------------------
    # 1. IJN NAVAL CREST: SAKURA & ANCHOR (桜に錨)
    # -------------------------------------------------------------------------
    # Shank (Vertical shaft)
    shank = box(cx - 3.2, cy - 36.0, cx + 3.2, cy + 28.0)
    
    # Top Ring (Shackle)
    ring = Point(cx, cy + 34.0).buffer(11.0, resolution=32).difference(Point(cx, cy + 34.0).buffer(5.5, resolution=32))
    
    # Stock (Crossbar near ring)
    stock = box(cx - 28.0, cy + 18.0, cx + 28.0, cy + 23.5)
    ball_l = Point(cx - 28.0, cy + 20.75).buffer(4.2, resolution=24)
    ball_r = Point(cx + 28.0, cy + 20.75).buffer(4.2, resolution=24)
    
    # Curved Flukes (Arms)
    angles = np.linspace(-np.pi * 0.82, -np.pi * 0.18, 60)
    fluke_r = 40.0
    pts_outer = [(cx + fluke_r * np.cos(a), cy - 4.0 + fluke_r * np.sin(a)) for a in angles]
    pts_inner = [(cx + (fluke_r - 6.5) * np.cos(a), cy - 4.0 + (fluke_r - 6.5) * np.sin(a)) for a in reversed(angles)]
    flukes_body = Polygon(pts_outer + pts_inner)
    
    # Triangular Fluke Tips
    tip_l = Polygon([(pts_outer[0][0], pts_outer[0][1]), 
                     (pts_inner[-1][0], pts_inner[-1][1]), 
                     (pts_outer[0][0] - 5.0, pts_outer[0][1] + 10.0)])
    tip_r = Polygon([(pts_outer[-1][0], pts_outer[-1][1]), 
                     (pts_inner[0][0], pts_inner[0][1]), 
                     (pts_outer[-1][0] + 5.0, pts_outer[-1][1] + 10.0)])
                     
    # Sakura Blossom (Imperial 5-petaled Cherry Blossom)
    petals = []
    for i in range(5):
        ang = i * (2.0 * np.pi / 5.0) - np.pi / 2.0
        pcx = cx + 11.5 * np.cos(ang)
        pcy = cy + 11.5 * np.sin(ang)
        petal_base = Point(pcx, pcy).buffer(7.2, resolution=24)
        cleft = Point(cx + 17.5 * np.cos(ang), cy + 17.5 * np.sin(ang)).buffer(2.2, resolution=16)
        petal = petal_base.difference(cleft)
        petals.append(petal)
        
    sakura_outer = unary_union(petals)
    sakura_hub = Point(cx, cy).buffer(4.8, resolution=24)
    sakura_final = unary_union([sakura_outer, sakura_hub])
    
    anchor_emblem = unary_union([shank, ring, stock, ball_l, ball_r, flukes_body, tip_l, tip_r, sakura_final])
    
    # -------------------------------------------------------------------------
    # 2. NAVIGATIONAL COMPASS ROSE RAYS & CONCENTRIC MARITIME RINGS
    # -------------------------------------------------------------------------
    ring_inner = Point(cx, cy).buffer(52.0, resolution=64).difference(Point(cx, cy).buffer(48.5, resolution=64))
    ring_outer = Point(cx, cy).buffer(68.0, resolution=64).difference(Point(cx, cy).buffer(65.0, resolution=64))
    
    ray_polys = []
    for r_idx in range(16):
        r_ang = r_idx * (2.0 * np.pi / 16.0)
        ray_len = 105.0 if (r_idx % 2 == 0) else 85.0
        w_half = 1.4 if (r_idx % 2 == 0) else 0.9
        
        dx = np.cos(r_ang)
        dy = np.sin(r_ang)
        px = -dy * w_half
        py = dx * w_half
        
        ray_pts = [
            (cx + 16.0 * dx + px, cy + 16.0 * dy + py),
            (cx + ray_len * dx + px, cy + ray_len * dy + py),
            (cx + ray_len * dx - px, cy + ray_len * dy - py),
            (cx + 16.0 * dx - px, cy + 16.0 * dy - py)
        ]
        ray_polys.append(Polygon(ray_pts))
        
    compass_rays = unary_union(ray_polys)
    pocket_bounds = box(p_x0 + 4.0, p_y0 + 4.0, p_x0 + POCKET_W - 4.0, p_y0 + POCKET_H - 4.0)
    maritime_pattern = unary_union([ring_inner, ring_outer, compass_rays]).intersection(pocket_bounds)
    
    floor_artwork = unary_union([anchor_emblem, maritime_pattern])
    
    # -------------------------------------------------------------------------
    # 3. BUILD 3D TRIANGLES VIA EARCUT
    # -------------------------------------------------------------------------
    outer_poly = box(0, 0, TRAY_W, TRAY_H)
    pocket_poly = box(p_x0, p_y0, p_x0 + POCKET_W, p_y0 + POCKET_H)
    
    notch_r = 12.0
    top_notch = Point(cx, TRAY_H).buffer(notch_r, resolution=32)
    bot_notch = Point(cx, 0.0).buffer(notch_r, resolution=32)
    pocket_with_notches = unary_union([pocket_poly, top_notch, bot_notch])
    
    # A. Floor: Z = 0.0 to 1.0 mm (Full solid base)
    tris_floor = extrude_polygon_to_triangles(outer_poly, 0.0, FLOOR_H)
    
    # B. Walls: Z = 1.0 to 5.5 mm (Outer box minus pocket with notches)
    wall_poly = outer_poly.difference(pocket_with_notches)
    tris_walls = []
    for p in (wall_poly.geoms if isinstance(wall_poly, MultiPolygon) else [wall_poly]):
        tris_walls.extend(extrude_polygon_to_triangles(p, FLOOR_H, TOTAL_H))
        
    # C. Floor Embossed Artwork: Z = 1.0 to 1.6 mm (+0.6 mm proud of floor)
    tris_art = []
    for p in (floor_artwork.geoms if isinstance(floor_artwork, MultiPolygon) else [floor_artwork]):
        tris_art.extend(extrude_polygon_to_triangles(p, FLOOR_H, FLOOR_H + 0.6))
        
    # Combine for Monolithic STL
    all_tris_monolithic = tris_floor + tris_walls + tris_art
    out_stl = os.path.join(STL_DIR, "sensuikan_canonical_reserve_depot_tray_monolithic.stl")
    write_binary_stl(all_tris_monolithic, out_stl)
    print(f"Exported Monolithic STL: {out_stl} ({len(all_tris_monolithic)} triangles)")
    
    # -------------------------------------------------------------------------
    # 4. NATIVE BAMBU MULTI-PART 3MF (Rotated 90 deg Portrait, Centered)
    # -------------------------------------------------------------------------
    # Convert triangles to Trimesh objects for 3MF packaging
    def tris_to_mesh(tri_list):
        tri_np = np.array(tri_list, dtype=np.float32)
        n = len(tri_list)
        vertices = tri_np.reshape(-1, 3)
        faces = np.arange(n * 3).reshape(-1, 3)
        m = trimesh.Trimesh(vertices=vertices, faces=faces)
        m.merge_vertices()
        return m
        
    m_tray_body = tris_to_mesh(tris_floor + tris_walls)
    m_art = tris_to_mesh(tris_art)
    
    rot_z = trimesh.transformations.rotation_matrix(np.radians(90), [0, 0, 1])
    m_tray_rot = m_tray_body.apply_transform(rot_z)
    m_art_rot = m_art.apply_transform(rot_z)
    
    # Center on Bambu 256x256 plate
    b_min = np.minimum(m_tray_rot.bounds[0], m_art_rot.bounds[0])
    b_max = np.maximum(m_tray_rot.bounds[1], m_art_rot.bounds[1])
    shift = np.array([128.0, 128.0, 0.0]) - np.array([(b_min[0]+b_max[0])/2.0, (b_min[1]+b_max[1])/2.0, 0.0])
    m_tray_rot.apply_translation(shift)
    m_art_rot.apply_translation(shift)
    
    m_tray_rot.metadata['name'] = 'Bandeja_Cuerpo_Negro'
    m_art_rot.metadata['name'] = 'Emblema_Sakura_Ancla_Rojo'
    
    scene = trimesh.Scene()
    scene.add_geometry(m_tray_rot, node_name='Bandeja_Cuerpo_Negro')
    scene.add_geometry(m_art_rot, node_name='Emblema_Sakura_Ancla_Rojo')
    
    out_3mf = os.path.join(STL_DIR, "sensuikan_reserve_depot_tray_dual_color_bambu.3mf")
    scene.export(out_3mf, file_type='3mf')
    print(f"Exported Native Bambu 3MF: {out_3mf}")
    
    # -------------------------------------------------------------------------
    # 5. GENERATE 2D PREVIEW IMAGE
    # -------------------------------------------------------------------------
    fig = plt.figure(figsize=(10, 7.6), dpi=180)
    fig.patch.set_facecolor('#0B1120')
    ax = fig.add_subplot(111)
    ax.set_facecolor('#0B1120')
    ax.set_xlim(-10, TRAY_W + 10)
    ax.set_ylim(-10, TRAY_H + 10)
    ax.axis('off')
    
    ax.add_patch(patches.Rectangle((0, 0), TRAY_W, TRAY_H, facecolor='#111827', edgecolor='#D4AF37', lw=2))
    ax.add_patch(patches.Rectangle((p_x0, p_y0), POCKET_W, POCKET_H, facecolor='#1F2937', edgecolor='#475569', lw=1.2, linestyle='--'))
    ax.add_patch(patches.Circle((cx, TRAY_H), notch_r, facecolor='#0B1120', edgecolor='#D4AF37', lw=1.5))
    ax.add_patch(patches.Circle((cx, 0), notch_r, facecolor='#0B1120', edgecolor='#D4AF37', lw=1.5))
    
    for geom in (floor_artwork.geoms if isinstance(floor_artwork, MultiPolygon) else [floor_artwork]):
        gx, gy = geom.exterior.xy
        ax.fill(gx, gy, color='#DC2626', alpha=0.9)
        ax.plot(gx, gy, color='#FBBF24', lw=1.0)
        for interior in geom.interiors:
            ix, iy = interior.xy
            ax.fill(ix, iy, color='#1F2937')
            ax.plot(ix, iy, color='#FBBF24', lw=0.8)
            
    ax.text(cx, TRAY_H - 12, "IJN FLEET SUBMARINE RESERVE DEPOT", color='#FCD34D', fontsize=11, fontweight='bold', ha='center')
    ax.text(cx, 12, "CAPACIDAD: 16-17 SUBMARINOS EN CARTULINA 200g | ESPACIO ÚTIL: 4.5 mm", color='#94A3B8', fontsize=8, ha='center')
    
    out_prev = os.path.join(PREV_DIR, "preview_reserve_depot_tray_art.jpg")
    fig.savefig(out_prev, bbox_inches='tight', facecolor='#0B1120')
    plt.close(fig)
    print(f"Exported Visual Preview: {out_prev}")
    
    return out_stl, out_3mf, out_prev

if __name__ == "__main__":
    generate_deluxe_reserve_depot()
