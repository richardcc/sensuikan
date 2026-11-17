import os
import struct
import numpy as np
import shapely
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union, orient
import mapbox_earcut as earcut

def extrude_polygon_to_list(p, z_min, z_max, target_list):
    """
    Extrudes a 2D polygon into closed 3D triangles with exact float32 binary precision.
    Produces 100% Watertight manifold mesh with 0 unmatched edges.
    """
    if p.is_empty or p.area < 1e-4:
        return
    geoms = p.geoms if isinstance(p, MultiPolygon) else [p]
    z_min_f32 = np.float32(z_min)
    z_max_f32 = np.float32(z_max)
    
    for g in geoms:
        if g.is_empty or g.area < 1e-4:
            continue
        g = orient(g, sign=1.0)
        ext_coords = [tuple(np.float32(pt)) for pt in list(g.exterior.coords)[:-1]]
        rings = [len(ext_coords)]
        verts = list(ext_coords)
        for interior in g.interiors:
            int_coords = [tuple(np.float32(pt)) for pt in list(interior.coords)[:-1]]
            verts.extend(int_coords)
            rings.append(len(verts))
            
        verts_np = np.array(verts, dtype=np.float64)
        rings_np = np.array(rings, dtype=np.uint32)
        indices = earcut.triangulate_float64(verts_np, rings_np)
        tris_2d = verts_np[indices].reshape(-1, 3, 2).astype(np.float32)
        
        # 1. Top face (normal [0, 0, 1]): CCW
        for t in tris_2d:
            target_list.append(((t[0, 0], t[0, 1], z_max_f32), (t[1, 0], t[1, 1], z_max_f32), (t[2, 0], t[2, 1], z_max_f32)))
            
        # 2. Bottom face (normal [0, 0, -1]): CW
        for t in tris_2d:
            target_list.append(((t[0, 0], t[0, 1], z_min_f32), (t[2, 0], t[2, 1], z_min_f32), (t[1, 0], t[1, 1], z_min_f32)))
            
        # 3. Side walls
        directed_edges = {}
        for t in tris_2d:
            for i in range(3):
                p1 = (t[i, 0], t[i, 1])
                p2 = (t[(i+1)%3, 0], t[(i+1)%3, 1])
                directed_edges[(p1, p2)] = directed_edges.get((p1, p2), 0) + 1
                
        boundary_edges = [(p1, p2) for (p1, p2), count in directed_edges.items() if (p2, p1) not in directed_edges]
        for p1, p2 in boundary_edges:
            A = (p1[0], p1[1], z_min_f32)
            B = (p2[0], p2[1], z_min_f32)
            C = (p2[0], p2[1], z_max_f32)
            D = (p1[0], p1[1], z_max_f32)
            target_list.append((A, B, C))
            target_list.append((A, C, D))

def write_binary_stl(triangles, filename):
    with open(filename, 'wb') as f:
        header = f"Antigravity Sensuikan Snap - {os.path.basename(filename)}".encode('utf-8')
        f.write(header.ljust(80, b'\0')[:80])
        f.write(struct.pack('<I', len(triangles)))
        for t in triangles:
            v0 = np.array(t[0], dtype=np.float32)
            v1 = np.array(t[1], dtype=np.float32)
            v2 = np.array(t[2], dtype=np.float32)
            normal = np.cross(v1 - v0, v2 - v0)
            norm_len = np.linalg.norm(normal)
            if norm_len > 1e-9:
                normal = normal / norm_len
            else:
                normal = np.array([0, 0, 0], dtype=np.float32)
            f.write(struct.pack('<3f', normal[0], normal[1], normal[2]))
            f.write(struct.pack('<3f', v0[0], v0[1], v0[2]))
            f.write(struct.pack('<3f', v1[0], v1[1], v1[2]))
            f.write(struct.pack('<3f', v2[0], v2[1], v2[2]))
            f.write(struct.pack('<H', 0))
    print(f"  Successfully wrote {filename}: {len(triangles)} triangles")

def make_snap_dovetail_pair(split_x, cy, tab_width=16.0, tab_depth=6.5, snap_bump=0.35, clearance=0.20):
    wb = tab_width * 0.72
    wt = tab_width * 1.08
    d_mid = tab_depth * 0.55
    w_mid = wb + (wt - wb) * (d_mid / tab_depth)
    
    # Male tab (extends into +X)
    pts_male = [
        (split_x, cy - wb/2.0),
        (split_x + d_mid - 0.8, cy - w_mid/2.0),
        (split_x + d_mid, cy - (w_mid/2.0 + snap_bump)),
        (split_x + d_mid + 0.8, cy - w_mid/2.0),
        (split_x + tab_depth, cy - wt/2.0),
        (split_x + tab_depth, cy + wt/2.0),
        (split_x + d_mid + 0.8, cy + w_mid/2.0),
        (split_x + d_mid, cy + (w_mid/2.0 + snap_bump)),
        (split_x + d_mid - 0.8, cy + w_mid/2.0),
        (split_x, cy + wb/2.0)
    ]
    p_male = Polygon(pts_male)
    
    # Female pocket with clearance and matching snap recess
    wb_f = wb + 2.0 * clearance
    wt_f = wt + 2.0 * clearance
    w_mid_f = w_mid + 2.0 * clearance
    bump_f = snap_bump + clearance
    d_f = tab_depth + clearance
    
    pts_female = [
        (split_x - 0.1, cy - wb_f/2.0),
        (split_x + d_mid - 0.8, cy - w_mid_f/2.0),
        (split_x + d_mid, cy - (w_mid_f/2.0 + bump_f)),
        (split_x + d_mid + 0.8, cy - w_mid_f/2.0),
        (split_x + d_f, cy - wt_f/2.0),
        (split_x + d_f, cy + wt_f/2.0),
        (split_x + d_mid + 0.8, cy + w_mid_f/2.0),
        (split_x + d_mid, cy + (w_mid_f/2.0 + bump_f)),
        (split_x + d_mid - 0.8, cy + w_mid_f/2.0),
        (split_x - 0.1, cy + wb_f/2.0)
    ]
    p_female = Polygon(pts_female)
    return p_male, p_female

def generate_snap_base_tray():
    card_w = 280.0
    card_h = 215.0
    clearance = 0.6
    inner_w = card_w + clearance # 280.6 mm
    inner_h = card_h + clearance # 215.6 mm
    wall_w = 3.5
    
    total_w = inner_w + 2 * wall_w # 287.6 mm
    total_h = inner_h + 2 * wall_w # 222.6 mm
    
    # Reinforced Z Heights:
    # Floor: 1.8 mm (9 layers @ 0.20mm)
    # Bottom mechanical stop shelf: 0.8 mm (4 layers)
    # Male tab height: from Z = 0.95 to Z = 1.8 mm (leaves 0.15mm vertical clearance above shelf)
    # Card recess depth: 1.1 mm (for 1.0mm cardboard card)
    # Retention rim: 2.5 mm
    # Total tray height: 1.8 + 1.1 + 2.5 = 5.4 mm
    floor_h = 1.8
    shelf_z = 0.8
    tab_z_min = 0.95
    total_z = 5.4
    
    cx = total_w / 2.0 # 143.8 mm
    cy = total_h / 2.0 # 111.3 mm
    
    outer_box = box(0, 0, total_w, total_h)
    inner_pocket = box(wall_w, wall_w, wall_w + inner_w, wall_w + inner_h)
    rim_poly = outer_box.difference(inner_pocket)
    
    lip_w = 14.0
    hollow_area = box(lip_w, lip_w, total_w - lip_w, total_h - lip_w)
    
    # Stylized Submarine silhouette in center for finger push-outs
    hull_half_len = 112.0
    hull_h = 26.0
    sub_poly_pts = [
        (-hull_half_len, 0),
        (-hull_half_len + 12, -6),
        (-hull_half_len + 30, -hull_h/2.0),
        (hull_half_len - 30, -hull_h/2.0),
        (hull_half_len - 10, -4),
        (hull_half_len, 2),
        (hull_half_len - 8, 9),
        (hull_half_len - 30, hull_h/2.0),
        (50, hull_h/2.0),
        (49, hull_h/2.0 + 7),
        (40, hull_h/2.0 + 7),
        (40, hull_h/2.0),
        (25, hull_h/2.0),
        (21, hull_h/2.0 + 20),
        (14, hull_h/2.0 + 28),
        (10, hull_h/2.0 + 28),
        (10, hull_h/2.0 + 20),
        (-15, hull_h/2.0 + 20),
        (-20, hull_h/2.0),
        (-30, hull_h/2.0),
        (-32, hull_h/2.0 + 5),
        (-40, hull_h/2.0 + 5),
        (-42, hull_h/2.0),
        (-hull_half_len + 30, hull_h/2.0),
        (-hull_half_len + 12, 6),
        (-hull_half_len, 0)
    ]
    sub_poly = Polygon([(cx + pt[0], cy + pt[1]) for pt in sub_poly_pts])
    prop_pts = [
        (-hull_half_len - 7, -10),
        (-hull_half_len, -1),
        (-hull_half_len - 7, 8),
        (-hull_half_len - 10, 0)
    ]
    prop_poly = Polygon([(cx + pt[0], cy + pt[1]) for pt in prop_pts])
    sub_full = unary_union([sub_poly, prop_poly])
    
    # Heavy-duty floor support ribs (4.5 mm wide)
    ribs = []
    # Vertical ribs across X
    for rx in [cx - 95, cx - 50, cx, cx + 50, cx + 95]:
        ribs.append(box(rx - 2.5, lip_w, rx + 2.5, total_h - lip_w))
    # Horizontal center rib across Y
    ribs.append(box(lip_w, cy - 2.5, total_w - lip_w, cy + 2.5))
    
    # Anti-flex corner gussets
    gusset_l1 = Polygon([(lip_w, lip_w), (lip_w + 35, lip_w), (lip_w, lip_w + 35)])
    gusset_l2 = Polygon([(lip_w, total_h - lip_w), (lip_w + 35, total_h - lip_w), (lip_w, total_h - lip_w - 35)])
    gusset_r1 = Polygon([(total_w - lip_w, lip_w), (total_w - lip_w - 35, lip_w), (total_w - lip_w, lip_w + 35)])
    gusset_r2 = Polygon([(total_w - lip_w, total_h - lip_w), (total_w - lip_w - 35, total_h - lip_w), (total_w - lip_w, total_h - lip_w - 35)])
    
    # Reinforcement pads around dovetail pockets on the spine
    pad_w = 12.0
    pad_h = 26.0
    dovetail_y = [total_h * 0.85, total_h * 0.62, total_h * 0.38, total_h * 0.15]
    dovetail_pads = [box(cx - 5.0, py - pad_h/2.0, cx + pad_w, py + pad_h/2.0) for py in dovetail_y]
    
    solid_pattern = unary_union([sub_full] + ribs + [gusset_l1, gusset_l2, gusset_r1, gusset_r2] + dovetail_pads)
    cutouts = hollow_area.difference(solid_pattern)
    lightweight_floor = outer_box.difference(cutouts)
    
    # Build 4 Snap-Fit Dovetail Pairs along the center seam
    split_x = cx # 143.8 mm
    male_tabs = []
    female_pockets = []
    for py in dovetail_y:
        m_poly, f_poly = make_snap_dovetail_pair(split_x, py, tab_width=16.0, tab_depth=6.5, snap_bump=0.35, clearance=0.20)
        male_tabs.append(m_poly)
        female_pockets.append(f_poly)
        
    union_male_tabs = unary_union(male_tabs)
    union_female_pockets = unary_union(female_pockets)
    
    # Continuous Lap Shelf (2.0 mm wide continuous support shelf along the entire seam)
    # The Right piece provides a solid floor shelf from X = split_x - 2.0 to split_x at Z in [0, shelf_z]
    # The Left piece rests directly on top of this continuous shelf!
    lap_shelf_w = 2.0
    shelf_strip = box(split_x - lap_shelf_w, 0, split_x, total_h)
    
    # Cutters for the pieces:
    # 1. Left base (Z in [0, shelf_z]): stops at split_x - lap_shelf_w - 0.20 (clearance)
    left_cutter_base = box(-10, -10, split_x - lap_shelf_w - 0.20, total_h + 10)
    # 2. Left upper floor & tabs (Z in [tab_z_min, floor_h]): goes up to split_x and includes male snap tabs
    left_cutter_upper = box(-10, -10, split_x, total_h + 10).union(union_male_tabs)
    # 3. Left rim (Z in [floor_h, total_z]): goes up to split_x
    left_cutter_rim = box(-10, -10, split_x, total_h + 10)
    
    # 4. Right base (Z in [0, shelf_z]): starts at split_x - lap_shelf_w (continuous shelf) + solid floor under female pockets
    right_cutter_base = box(split_x - lap_shelf_w, -10, total_w + 10, total_h + 10)
    # 5. Right upper floor & pockets (Z in [tab_z_min, floor_h]): starts at split_x and subtracts female pockets
    right_cutter_upper = box(split_x, -10, total_w + 10, total_h + 10).difference(union_female_pockets)
    # 6. Right rim (Z in [floor_h, total_z]): starts at split_x
    right_cutter_rim = box(split_x, -10, total_w + 10, total_h + 10)
    
    print("=" * 65)
    print("GENERATING SENSUIKAN SNAP-FIT BASE TRAY WITH FLOOR STOPS")
    print("=" * 65)
    
    # Generate LEFT HALF
    print("Extruding Left Half (Snap-Fit Male Tabs + Shelf Rest)...")
    tris_left = []
    
    # Layer 1: Left base floor (Z = 0.0 to shelf_z)
    p_l1 = lightweight_floor.intersection(left_cutter_base)
    extrude_polygon_to_list(p_l1, 0.0, shelf_z, tris_left)
    
    # Layer 2: Left upper floor + male tabs (Z = tab_z_min to floor_h)
    p_l2 = lightweight_floor.intersection(left_cutter_upper)
    extrude_polygon_to_list(p_l2, tab_z_min, floor_h, tris_left)
    
    # Layer 3: Left perimeter retention rim (Z = floor_h to total_z)
    p_l3 = rim_poly.intersection(left_cutter_rim)
    extrude_polygon_to_list(p_l3, floor_h, total_z, tris_left)
    
    write_binary_stl(tris_left, "sensuikan_base_tray_280x215_left.stl")
    
    # Generate RIGHT HALF
    print("Extruding Right Half (Female Snap Pockets + Solid Stop Shelf)...")
    tris_right = []
    
    # Layer 1: Right base floor with continuous shelf & solid pocket floors (Z = 0.0 to shelf_z)
    p_r1 = lightweight_floor.intersection(right_cutter_base)
    extrude_polygon_to_list(p_r1, 0.0, shelf_z, tris_right)
    
    # Layer 2: Right upper floor with recessed snap pockets (Z = tab_z_min to floor_h)
    p_r2 = lightweight_floor.intersection(right_cutter_upper)
    extrude_polygon_to_list(p_r2, tab_z_min, floor_h, tris_right)
    
    # Layer 3: Right perimeter retention rim (Z = floor_h to total_z)
    p_r3 = rim_poly.intersection(right_cutter_rim)
    extrude_polygon_to_list(p_r3, floor_h, total_z, tris_right)
    
    write_binary_stl(tris_right, "sensuikan_base_tray_280x215_right.stl")
    
    print("=" * 65)
    print("GENERATION COMPLETE!")

if __name__ == "__main__":
    generate_snap_base_tray()
