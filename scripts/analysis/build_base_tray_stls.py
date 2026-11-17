import os
import struct
import numpy as np
import shapely
from shapely.geometry import Polygon, MultiPolygon, Point, box
from shapely.ops import unary_union, orient
import mapbox_earcut as earcut

def extrude_polygon_to_stl(poly, z_min, z_max, filename):
    """
    Extrudes 2D polygon into a 100% Manifold Watertight 3D mesh (Unmatched edges = 0).
    Uses float32 precision and earcut triangulation.
    """
    if poly.is_empty:
        print(f"Warning: polygon is empty, skipping {filename}")
        return

    geoms = poly.geoms if isinstance(poly, MultiPolygon) else [poly]
    all_triangles_3d = []
    z_min_f32 = np.float32(z_min)
    z_max_f32 = np.float32(z_max)
    
    for p in geoms:
        p = orient(p, sign=1.0)
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
        
        # 1. Top face (normal [0, 0, 1]): CCW
        for tri in tris_2d:
            p0 = (tri[0][0], tri[0][1], z_max_f32)
            p1 = (tri[1][0], tri[1][1], z_max_f32)
            p2 = (tri[2][0], tri[2][1], z_max_f32)
            all_triangles_3d.append((p0, p1, p2))
            
        # 2. Bottom face (normal [0, 0, -1]): CW (flip order)
        for tri in tris_2d:
            p0 = (tri[0][0], tri[0][1], z_min_f32)
            p1 = (tri[2][0], tri[2][1], z_min_f32)
            p2 = (tri[1][0], tri[1][1], z_min_f32)
            all_triangles_3d.append((p0, p1, p2))

        # 3. Side walls from 2D triangulation boundary edges
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
                    # Two triangles for the vertical wall quad
                    all_triangles_3d.append((pA_bot, pB_bot, pB_top))
                    all_triangles_3d.append((pA_bot, pB_top, pA_top))

    # Write binary STL
    with open(filename, 'wb') as f:
        header = f"Antigravity Sensuikan 100% Watertight - {os.path.basename(filename)}".encode('utf-8')
        f.write(header.ljust(80, b'\0'))
        f.write(struct.pack('<I', len(all_triangles_3d)))
        for t in all_triangles_3d:
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

def make_dovetail_cut(split_x, y_positions, tab_width=14.0, tab_depth=6.0):
    tabs = []
    for cy in y_positions:
        w_base = tab_width * 0.75
        w_tip = tab_width * 1.05
        poly = Polygon([
            (split_x, cy - w_base / 2.0),
            (split_x + tab_depth, cy - w_tip / 2.0),
            (split_x + tab_depth, cy + w_tip / 2.0),
            (split_x, cy + w_base / 2.0)
        ])
        tabs.append(poly)
    return unary_union(tabs)

def generate_base_tray_280x215():
    """
    Generates the Left and Right Base Tray STLs for the real 280 x 215 mm card.
    Floor: 1.2 mm
    Pocket depth: 1.1 mm (for 1.0mm cardboard card)
    Rim: 2.5 mm (for retention)
    Total Z: 4.8 mm
    """
    card_w = 280.0
    card_h = 215.0
    clearance = 0.6
    inner_w = card_w + clearance # 280.6 mm
    inner_h = card_h + clearance # 215.6 mm
    wall_w = 3.0
    
    total_w = inner_w + 2 * wall_w # 286.6 mm
    total_h = inner_h + 2 * wall_w # 221.6 mm
    
    floor_h = 1.2
    pocket_h = 1.1
    rim_h = 2.5
    total_z = floor_h + pocket_h + rim_h # 4.8 mm
    
    cx = total_w / 2.0
    cy = total_h / 2.0
    
    outer_box = box(0, 0, total_w, total_h)
    inner_pocket = box(wall_w, wall_w, wall_w + inner_w, wall_w + inner_h)
    rim_poly = outer_box.difference(inner_pocket)
    
    lip_w = 12.0
    hollow_area = box(lip_w, lip_w, total_w - lip_w, total_h - lip_w)
    
    # Stylized Submarine silhouette in center for finger push-out
    hull_half_len = 110.0
    hull_h = 22.0
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
    
    # Support ribs across the floor
    ribs = []
    for rx in [cx - 90, cx - 45, cx, cx + 45, cx + 90]:
        ribs.append(box(rx - 3.5, lip_w, rx + 3.5, total_h - lip_w))
    ribs.append(box(lip_w, cy - 3.5, total_w - lip_w, cy + 3.5))
    
    solid_pattern = unary_union([sub_full] + ribs)
    cutouts = hollow_area.difference(solid_pattern)
    lightweight_floor = outer_box.difference(cutouts)
    
    # Dovetail split in center
    split_x = total_w / 2.0 # 143.3 mm
    dovetail_y = [total_h * 0.82, total_h * 0.50, total_h * 0.18]
    tabs = make_dovetail_cut(split_x, dovetail_y, tab_width=15.0, tab_depth=6.0)
    tabs_clearance = tabs.buffer(0.20)
    
    left_cutter = box(-10, -10, split_x, total_h + 10).union(tabs)
    right_cutter = box(split_x, -10, total_w + 10, total_h + 10).difference(tabs_clearance)
    
    floor_left = lightweight_floor.intersection(left_cutter)
    rim_left = rim_poly.intersection(left_cutter)
    floor_right = lightweight_floor.intersection(right_cutter)
    rim_right = rim_poly.intersection(right_cutter)
    
    print("Generating Left Base Tray STL...")
    extrude_polygon_to_stl(floor_left, 0.0, floor_h, "temp_floor_l.stl")
    extrude_polygon_to_stl(rim_left, floor_h, total_z, "temp_rim_l.stl")
    
    # Combine floor and rim for left piece
    combine_stls("temp_floor_l.stl", "temp_rim_l.stl", "sensuikan_base_tray_280x215_left.stl")
    
    print("Generating Right Base Tray STL...")
    extrude_polygon_to_stl(floor_right, 0.0, floor_h, "temp_floor_r.stl")
    extrude_polygon_to_stl(rim_right, floor_h, total_z, "temp_rim_r.stl")
    combine_stls("temp_floor_r.stl", "temp_rim_r.stl", "sensuikan_base_tray_280x215_right.stl")
    
    # Clean up temp files
    for tmp in ["temp_floor_l.stl", "temp_rim_l.stl", "temp_floor_r.stl", "temp_rim_r.stl"]:
        if os.path.exists(tmp): os.remove(tmp)

def combine_stls(file1, file2, outfile):
    with open(file1, 'rb') as f1:
        f1.seek(80)
        n1 = struct.unpack('<I', f1.read(4))[0]
        data1 = f1.read()
    with open(file2, 'rb') as f2:
        f2.seek(80)
        n2 = struct.unpack('<I', f2.read(4))[0]
        data2 = f2.read()
        
    with open(outfile, 'wb') as fout:
        header = f"Antigravity Sensuikan Watertight - {outfile}".encode('utf-8')
        fout.write(header.ljust(80, b'\0'))
        fout.write(struct.pack('<I', n1 + n2))
        fout.write(data1)
        fout.write(data2)
    print(f"  Successfully created {outfile} ({n1 + n2} triangles)")

if __name__ == "__main__":
    generate_base_tray_280x215()
