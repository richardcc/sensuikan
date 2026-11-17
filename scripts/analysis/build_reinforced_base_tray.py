import os
import struct
import numpy as np
import shapely
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union, orient
import mapbox_earcut as earcut

def _extrude_to_list(p, z_min, z_max, target_list):
    p = orient(p, sign=1.0)
    z_min_f32 = np.float32(z_min)
    z_max_f32 = np.float32(z_max)
    
    ext_coords = [tuple(np.float32(pt)) for pt in list(p.exterior.coords)[:-1]]
    rings = [len(ext_coords)]
    verts = list(ext_coords)
    for interior in p.interiors:
        int_coords = [tuple(np.float32(pt)) for pt in list(interior.coords)[:-1]]
        verts.extend(int_coords)
        rings.append(len(verts))

    verts_np = np.array(verts, dtype=np.float64)
    rings_np = np.array(rings, dtype=np.uint32)
    indices = earcut.triangulate_float64(verts_np, rings_np)
    tris_2d = verts_np[indices].reshape(-1, 3, 2).astype(np.float32)
    
    for t in tris_2d:
        target_list.append(((t[0, 0], t[0, 1], z_max_f32), (t[1, 0], t[1, 1], z_max_f32), (t[2, 0], t[2, 1], z_max_f32)))
        target_list.append(((t[0, 0], t[0, 1], z_min_f32), (t[2, 0], t[2, 1], z_min_f32), (t[1, 0], t[1, 1], z_min_f32)))
        
    directed_edges = {}
    for t in tris_2d:
        for i in range(3):
            p1 = (round(float(t[i, 0]), 3), round(float(t[i, 1]), 3))
            p2 = (round(float(t[(i+1)%3, 0]), 3), round(float(t[(i+1)%3, 1]), 3))
            directed_edges[(p1, p2)] = directed_edges.get((p1, p2), 0) + 1
            
    boundary_edges = [(p1, p2) for (p1, p2), count in directed_edges.items() if (p2, p1) not in directed_edges]
    for p1, p2 in boundary_edges:
        A = (p1[0], p1[1], z_min_f32)
        B = (p2[0], p2[1], z_min_f32)
        C = (p2[0], p2[1], z_max_f32)
        D = (p1[0], p1[1], z_max_f32)
        target_list.append((A, B, C))
        target_list.append((A, C, D))

def _write_stl(triangles, filename):
    with open(filename, 'wb') as f:
        header = f"Antigravity Sensuikan Watertight 3D - {os.path.basename(filename)}".encode('utf-8')
        f.write(header.ljust(80, b'\0'))
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
    print(f"  Successfully written: {filename} ({len(triangles)} triangles)")

def make_dovetail_pair(split_x, y_positions, tab_width=16.0, tab_depth=7.0, clearance=0.20):
    male_tabs = []
    female_pockets = []
    for cy in y_positions:
        wb_m = tab_width * 0.75
        wt_m = tab_width * 1.10
        p_male = Polygon([
            (split_x, cy - wb_m / 2.0),
            (split_x + tab_depth, cy - wt_m / 2.0),
            (split_x + tab_depth, cy + wt_m / 2.0),
            (split_x, cy + wb_m / 2.0)
        ])
        male_tabs.append(p_male)
        
        wb_f = wb_m + 2.0 * clearance
        wt_f = wt_m + 2.0 * clearance
        d_f = tab_depth + clearance
        p_female = Polygon([
            (split_x - 0.05, cy - wb_f / 2.0),
            (split_x + d_f, cy - wt_f / 2.0),
            (split_x + d_f, cy + wt_f / 2.0),
            (split_x - 0.05, cy + wb_f / 2.0)
        ])
        female_pockets.append(p_female)
        
    return unary_union(male_tabs), unary_union(female_pockets)

def generate_reinforced_base_tray():
    card_w = 280.0
    card_h = 215.0
    clearance = 0.6
    inner_w = card_w + clearance # 280.6 mm
    inner_h = card_h + clearance # 215.6 mm
    wall_w = 3.5 # Reinforced wall thickness
    
    total_w = inner_w + 2 * wall_w # 287.6 mm
    total_h = inner_h + 2 * wall_w # 222.6 mm
    
    # Reinforced Z dimensions:
    floor_h = 1.6 # 8 layers @ 0.20mm (ultra solid base)
    sub_relief_h = 0.6 # Additional 3D bas-relief height for the submarine!
    sub_top_z = floor_h + sub_relief_h # 2.2 mm
    
    pocket_h = 1.2 # Card recess
    rim_h = 3.2 # Total rim height from floor
    total_z = floor_h + pocket_h + rim_h # 6.0 mm total height!
    
    cx = total_w / 2.0
    cy = total_h / 2.0
    
    outer_box = box(0, 0, total_w, total_h)
    inner_pocket = box(wall_w, wall_w, wall_w + inner_w, wall_w + inner_h)
    rim_poly = outer_box.difference(inner_pocket)
    
    lip_w = 14.0 # 14mm solid perimeter shelf for card support
    hollow_area = box(lip_w, lip_w, total_w - lip_w, total_h - lip_w)
    
    # Submarine silhouette (wider and higher relief)
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
    for rx in [cx - 95, cx - 50, cx, cx + 50, cx + 95]:
        ribs.append(box(rx - 2.5, lip_w, rx + 2.5, total_h - lip_w))
    ribs.append(box(lip_w, cy - 2.5, total_w - lip_w, cy + 2.5))
    # Diagonal corner gussets for anti-flex rigidity
    gusset_l1 = Polygon([(lip_w, lip_w), (lip_w + 35, lip_w), (lip_w, lip_w + 35)])
    gusset_l2 = Polygon([(lip_w, total_h - lip_w), (lip_w + 35, total_h - lip_w), (lip_w, total_h - lip_w - 35)])
    gusset_r1 = Polygon([(total_w - lip_w, lip_w), (total_w - lip_w - 35, lip_w), (total_w - lip_w, lip_w + 35)])
    gusset_r2 = Polygon([(total_w - lip_w, total_h - lip_w), (total_w - lip_w - 35, total_h - lip_w), (total_w - lip_w, total_h - lip_w - 35)])
    
    solid_pattern = unary_union([sub_full] + ribs + [gusset_l1, gusset_l2, gusset_r1, gusset_r2])
    cutouts = hollow_area.difference(solid_pattern)
    lightweight_floor = outer_box.difference(cutouts)
    
    # 4 Dovetail Locks along the seam (222.6 mm seam)
    split_x = total_w / 2.0 # 143.8 mm
    dovetail_y = [total_h * 0.85, total_h * 0.62, total_h * 0.38, total_h * 0.15]
    male_tabs, female_pockets = make_dovetail_pair(split_x, dovetail_y, tab_width=16.0, tab_depth=7.0, clearance=0.20)
    
    # Cutters for Left and Right halves
    left_cutter = box(-10, -10, split_x, total_h + 10).union(male_tabs)
    right_cutter = box(split_x, -10, total_w + 10, total_h + 10).difference(female_pockets)
    
    # Floor base (Z = 0 to 1.6mm)
    floor_left = lightweight_floor.intersection(left_cutter)
    floor_right = lightweight_floor.intersection(right_cutter)
    
    # Submarine 3D Raised Relief (Z = 1.6 to 2.2mm)
    sub_left = sub_full.intersection(left_cutter)
    sub_right = sub_full.intersection(right_cutter)
    
    # Perimeter Rim (Z = 1.6 to 6.0mm)
    rim_left = rim_poly.intersection(left_cutter)
    rim_right = rim_poly.intersection(right_cutter)
    
    print("Building Left Base Tray (Reinforced + Submarine Relief + 4 Dovetails)...")
    all_l = []
    # 1. Floor base
    for p in (floor_left.geoms if isinstance(floor_left, MultiPolygon) else [floor_left]):
        _extrude_to_list(p, 0.0, floor_h, all_l)
    # 2. Raised submarine relief
    for p in (sub_left.geoms if isinstance(sub_left, MultiPolygon) else [sub_left]):
        _extrude_to_list(p, floor_h, sub_top_z, all_l)
    # 3. Perimeter retention rim
    for p in (rim_left.geoms if isinstance(rim_left, MultiPolygon) else [rim_left]):
        _extrude_to_list(p, floor_h, total_z, all_l)
    _write_stl(all_l, "sensuikan_base_tray_280x215_left.stl")
    
    print("Building Right Base Tray (Reinforced + Submarine Relief + 4 Dovetails)...")
    all_r = []
    # 1. Floor base
    for p in (floor_right.geoms if isinstance(floor_right, MultiPolygon) else [floor_right]):
        _extrude_to_list(p, 0.0, floor_h, all_r)
    # 2. Raised submarine relief
    for p in (sub_right.geoms if isinstance(sub_right, MultiPolygon) else [sub_right]):
        _extrude_to_list(p, floor_h, sub_top_z, all_r)
    # 3. Perimeter retention rim
    for p in (rim_right.geoms if isinstance(rim_right, MultiPolygon) else [rim_right]):
        _extrude_to_list(p, floor_h, total_z, all_r)
    _write_stl(all_r, "sensuikan_base_tray_280x215_right.stl")

if __name__ == "__main__":
    generate_reinforced_base_tray()
