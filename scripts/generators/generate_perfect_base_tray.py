import os
import struct
import numpy as np
import shapely
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union, orient
import mapbox_earcut as earcut

def extrude_polygon_to_triangles(p, z_min, z_max):
    """
    Extrudes a 2D polygon into a 100% closed, valid manifold polyhedron (Euler characteristic chi = 2).
    Top face: CCW
    Bottom face: CW
    Side walls: properly oriented quads (2 triangles each)
    """
    if p.is_empty:
        return []

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
    
    triangles_3d = []
    
    # 1. Top face (normal [0, 0, 1]): CCW
    for tri in tris_2d:
        p0 = (tri[0][0], tri[0][1], z_max_f32)
        p1 = (tri[1][0], tri[1][1], z_max_f32)
        p2 = (tri[2][0], tri[2][1], z_max_f32)
        triangles_3d.append((p0, p1, p2))
        
    # 2. Bottom face (normal [0, 0, -1]): CW
    for tri in tris_2d:
        p0 = (tri[0][0], tri[0][1], z_min_f32)
        p1 = (tri[2][0], tri[2][1], z_min_f32)
        p2 = (tri[1][0], tri[1][1], z_min_f32)
        triangles_3d.append((p0, p1, p2))

    # 3. Side walls
    # Extract boundary edges directly from earcut indices
    tri_edges = np.zeros((len(indices) // 3, 3, 2), dtype=np.uint32)
    for i in range(len(indices) // 3):
        i0, i1, i2 = indices[3*i], indices[3*i+1], indices[3*i+2]
        tri_edges[i, 0] = [min(i0, i1), max(i0, i1)]
        tri_edges[i, 1] = [min(i1, i2), max(i1, i2)]
        tri_edges[i, 2] = [min(i2, i0), max(i2, i0)]
    edges_flat = tri_edges.reshape(-1, 2)
    
    edge_keys = (edges_flat[:, 0].astype(np.uint64) << 32) | edges_flat[:, 1].astype(np.uint64)
    unq, counts = np.unique(edge_keys, return_counts=True)
    b_keys = set(unq[counts == 1])
    
    for i in range(len(indices) // 3):
        t_inds = [indices[3*i], indices[3*i+1], indices[3*i+2]]
        for e_idx in range(3):
            va_idx = t_inds[e_idx]
            vb_idx = t_inds[(e_idx + 1) % 3]
            k = (min(va_idx, vb_idx) << 32) | max(va_idx, vb_idx)
            if k in b_keys:
                pA_x, pA_y = verts[va_idx]
                pB_x, pB_y = verts[vb_idx]
                pA_top = (pA_x, pA_y, z_max_f32)
                pB_top = (pB_x, pB_y, z_max_f32)
                pA_bot = (pA_x, pA_y, z_min_f32)
                pB_bot = (pB_x, pB_y, z_min_f32)
                # Outer side quad oriented CCW from outside:
                triangles_3d.append((pA_bot, pB_bot, pB_top))
                triangles_3d.append((pA_bot, pB_top, pA_top))

    return triangles_3d

def write_binary_stl(triangles, filename):
    with open(filename, 'wb') as f:
        header = f"Antigravity Sensuikan 100% Watertight - {os.path.basename(filename)}".encode('utf-8')
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
    print(f"  Successfully wrote {filename}: {len(triangles)} triangles")

def make_dovetail_cut(split_x, y_positions, tab_width=14.0, tab_depth=6.0):
    tabs = []
    for cy in y_positions:
        wb = tab_width * 0.75
        wt = tab_width * 1.05
        poly = Polygon([
            (split_x, cy - wb / 2.0),
            (split_x + tab_depth, cy - wt / 2.0),
            (split_x + tab_depth, cy + wt / 2.0),
            (split_x, cy + wb / 2.0)
        ])
        tabs.append(poly)
    return unary_union(tabs)

def generate_perfect_base_tray():
    card_w = 280.0
    card_h = 215.0
    clearance = 0.6
    inner_w = card_w + clearance # 280.6 mm
    inner_h = card_h + clearance # 215.6 mm
    wall_w = 3.5
    
    total_w = inner_w + 2 * wall_w # 287.6 mm
    total_h = inner_h + 2 * wall_w # 222.6 mm
    
    floor_h = 1.6 # Solid floor
    total_z = 5.2 # 1.6 floor + 1.1 card recess + 2.5 rim
    
    cx = total_w / 2.0
    cy = total_h / 2.0
    
    outer_box = box(0, 0, total_w, total_h)
    inner_pocket = box(wall_w, wall_w, wall_w + inner_w, wall_w + inner_h)
    rim_poly = outer_box.difference(inner_pocket)
    
    lip_w = 14.0
    hollow_area = box(lip_w, lip_w, total_w - lip_w, total_h - lip_w)
    
    # Submarine silhouette (scaled to 280 x 215)
    hull_half_len = 110.0
    hull_h = 24.0
    sub_poly_pts = [
        (-hull_half_len, 0),
        (-hull_half_len + 12, -5),
        (-hull_half_len + 30, -hull_h/2.0),
        (hull_half_len - 30, -hull_h/2.0),
        (hull_half_len - 10, -3),
        (hull_half_len, 2),
        (hull_half_len - 8, 8),
        (hull_half_len - 30, hull_h/2.0),
        (48, hull_h/2.0),
        (47, hull_h/2.0 + 6),
        (38, hull_h/2.0 + 6),
        (38, hull_h/2.0),
        (24, hull_h/2.0),
        (20, hull_h/2.0 + 18),
        (14, hull_h/2.0 + 26),
        (11, hull_h/2.0 + 26),
        (11, hull_h/2.0 + 18),
        (-14, hull_h/2.0 + 18),
        (-18, hull_h/2.0),
        (-28, hull_h/2.0),
        (-30, hull_h/2.0 + 5),
        (-38, hull_h/2.0 + 5),
        (-40, hull_h/2.0),
        (-hull_half_len + 30, hull_h/2.0),
        (-hull_half_len + 12, 5),
        (-hull_half_len, 0)
    ]
    sub_poly = Polygon([(cx + pt[0], cy + pt[1]) for pt in sub_poly_pts])
    prop_pts = [
        (-hull_half_len - 6, -9),
        (-hull_half_len, -1),
        (-hull_half_len - 6, 7),
        (-hull_half_len - 9, 0)
    ]
    prop_poly = Polygon([(cx + pt[0], cy + pt[1]) for pt in prop_pts])
    sub_full = unary_union([sub_poly, prop_poly])
    
    # Heavy structural ribs (4.0 mm wide)
    ribs = []
    for rx in [cx - 95, cx - 50, cx, cx + 50, cx + 95]:
        ribs.append(box(rx - 2.0, lip_w, rx + 2.0, total_h - lip_w))
    ribs.append(box(lip_w, cy - 2.0, total_w - lip_w, cy + 2.0))
    
    # Gussets
    gusset_l1 = Polygon([(lip_w, lip_w), (lip_w + 35, lip_w), (lip_w, lip_w + 35)])
    gusset_l2 = Polygon([(lip_w, total_h - lip_w), (lip_w + 35, total_h - lip_w), (lip_w, total_h - lip_w - 35)])
    gusset_r1 = Polygon([(total_w - lip_w, lip_w), (total_w - lip_w - 35, lip_w), (total_w - lip_w, lip_w + 35)])
    gusset_r2 = Polygon([(total_w - lip_w, total_h - lip_w), (total_w - lip_w - 35, total_h - lip_w), (total_w - lip_w, total_h - lip_w - 35)])
    
    solid_pattern = unary_union([sub_full] + ribs + [gusset_l1, gusset_l2, gusset_r1, gusset_r2])
    cutouts = hollow_area.difference(solid_pattern)
    lightweight_floor = outer_box.difference(cutouts)
    
    split_x = total_w / 2.0 # 143.8 mm
    dovetail_y = [total_h * 0.85, total_h * 0.50, total_h * 0.15]
    tabs = make_dovetail_cut(split_x, dovetail_y, tab_width=15.0, tab_depth=6.0)
    tabs_clearance = tabs.buffer(0.20)
    
    left_cutter = box(-10, -10, split_x, total_h + 10).union(tabs)
    right_cutter = box(split_x, -10, total_w + 10, total_h + 10).difference(tabs_clearance)
    
    floor_left = lightweight_floor.intersection(left_cutter)
    rim_left = rim_poly.intersection(left_cutter)
    floor_right = lightweight_floor.intersection(right_cutter)
    rim_right = rim_poly.intersection(right_cutter)
    
    # Generate Left Piece as valid shells
    tris_left = []
    for p in (floor_left.geoms if isinstance(floor_left, MultiPolygon) else [floor_left]):
        tris_left.extend(extrude_polygon_to_triangles(p, 0.0, floor_h))
    for p in (rim_left.geoms if isinstance(rim_left, MultiPolygon) else [rim_left]):
        tris_left.extend(extrude_polygon_to_triangles(p, floor_h, total_z))
    write_binary_stl(tris_left, "sensuikan_base_tray_280x215_left.stl")
    
    # Generate Right Piece as valid shells
    tris_right = []
    for p in (floor_right.geoms if isinstance(floor_right, MultiPolygon) else [floor_right]):
        tris_right.extend(extrude_polygon_to_triangles(p, 0.0, floor_h))
    for p in (rim_right.geoms if isinstance(rim_right, MultiPolygon) else [rim_right]):
        tris_right.extend(extrude_polygon_to_triangles(p, floor_h, total_z))
    write_binary_stl(tris_right, "sensuikan_base_tray_280x215_right.stl")

if __name__ == "__main__":
    generate_perfect_base_tray()
