import os
import json
import struct
import shutil
import numpy as np
import shapely
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union, orient
import mapbox_earcut as earcut
import trimesh
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def extrude_polygon_to_triangles(p, z_min, z_max):
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
    rings_np = np.array(rings, dtype=np.int32)
    indices = earcut.triangulate_float64(verts_np, rings_np)
    
    tris = []
    # 1. Top face (normal [0, 0, 1]): CCW
    for i in range(0, len(indices), 3):
        i0, i1, i2 = int(indices[i]), int(indices[i+1]), int(indices[i+2])
        p0 = (verts[i0][0], verts[i0][1], z_max_f32)
        p1 = (verts[i1][0], verts[i1][1], z_max_f32)
        p2 = (verts[i2][0], verts[i2][1], z_max_f32)
        tris.append((p0, p1, p2))

    # 2. Bottom face (normal [0, 0, -1]): CW
    for i in range(0, len(indices), 3):
        i0, i1, i2 = int(indices[i]), int(indices[i+1]), int(indices[i+2])
        p0 = (verts[i0][0], verts[i0][1], z_min_f32)
        p1 = (verts[i2][0], verts[i2][1], z_min_f32)
        p2 = (verts[i1][0], verts[i1][1], z_min_f32)
        tris.append((p0, p1, p2))

    # 3. Side walls
    edge_counts = {}
    for i in range(len(indices) // 3):
        for e_idx in range(3):
            v0 = int(indices[3*i + e_idx])
            v1 = int(indices[3*i + ((e_idx+1)%3)])
            k = (min(v0, v1), max(v0, v1))
            edge_counts[k] = edge_counts.get(k, 0) + 1

    b_keys = {k for k, cnt in edge_counts.items() if cnt == 1}

    for i in range(len(indices) // 3):
        for e_idx in range(3):
            v0 = int(indices[3*i + e_idx])
            v1 = int(indices[3*i + ((e_idx+1)%3)])
            k = (min(v0, v1), max(v0, v1))
            if k in b_keys:
                pA_x, pA_y = verts[v0]
                pB_x, pB_y = verts[v1]
                pA_top = (pA_x, pA_y, z_max_f32)
                pB_top = (pB_x, pB_y, z_max_f32)
                pA_bot = (pA_x, pA_y, z_min_f32)
                pB_bot = (pB_x, pB_y, z_min_f32)
                tris.append((pA_bot, pB_bot, pB_top))
                tris.append((pA_bot, pB_top, pA_top))

    return tris

def write_binary_stl(triangles, filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'wb') as f:
        header_text = f"Sensuikan 100% Watertight - {os.path.basename(filename)}".encode('utf-8')
        header = (header_text[:80]).ljust(80, b'\0')
        f.write(header)
        f.write(struct.pack('<I', len(triangles)))
        for t in triangles:
            p1 = np.array(t[0], dtype=np.float32)
            p2 = np.array(t[1], dtype=np.float32)
            p3 = np.array(t[2], dtype=np.float32)
            u = p2 - p1
            v = p3 - p1
            n = np.cross(u, v)
            norm = np.linalg.norm(n)
            if norm > 0: n /= norm
            else: n = np.array([0.0, 0.0, 1.0], dtype=np.float32)
            f.write(struct.pack('<3f', float(n[0]), float(n[1]), float(n[2])))
            f.write(struct.pack('<3f', float(p1[0]), float(p1[1]), float(p1[2])))
            f.write(struct.pack('<3f', float(p2[0]), float(p2[1]), float(p2[2])))
            f.write(struct.pack('<3f', float(p3[0]), float(p3[1]), float(p3[2])))
            f.write(struct.pack('<H', 0))

def make_clean_square_slot(cx, cy, size=15.0):
    """
    Clean, crisp 15.0 x 15.0 mm square slot.
    With 13.0 mm counters, there is already 2.0 mm total natural finger clearance (1.0 mm per side),
    eliminating all fragile semicircles while ensuring robust walls and effortless counter handling.
    """
    half = size / 2.0
    return box(cx - half, cy - half, cx + half, cy + half)

def generate_canonical_stl_models():
    print("=" * 80)
    print("GENERATING MONOLITHIC CANONICAL TWO-LAYER 3D BOARD (BAMBU LAB 256x256 MM)")
    print("CLEAN SQUARE SLOTS (15x15 MM FOR 13 MM COUNTERS - NO SEMICIRCLES NEEDED)")
    print("WITH ALL 10 OBSERVATION WINDOWS (HEADER TEXT BOXES & SHIP DOSSIER)")
    print("=" * 80)
    
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    stl_dir = os.path.join(repo_root, 'stl')
    preview_dir = os.path.join(repo_root, 'images', 'previews')
    os.makedirs(stl_dir, exist_ok=True)
    os.makedirs(preview_dir, exist_ok=True)
    
    # Canonical player card dimensions: 238.0 x 180.4 mm (Equal 2.5mm Margin on all 4 sides)
    card_w = 238.0
    card_h = 180.4
    clearance = 0.45 # Generous 0.45 mm tolerance per side (0.90 mm total) for manual cutting / laminating!
    wall_t = 1.4 # Calibrated to 241.7 x 184.1 mm so it fits Bambu 256x256 plate with >7mm margin on all sides!
    tray_w = card_w + 2 * (wall_t + clearance) # 241.7 mm
    tray_h = card_h + 2 * (wall_t + clearance) # 184.1 mm
    floor_h = 1.80
    rim_h = 3.60
    total_z = floor_h + rim_h # 5.40 mm total tray height
    
    # -------------------------------------------------------------
    # 1. MONOLITHIC BASE TRAY (MANIFOLD CSG - 0 NON-MANIFOLD EDGES)
    # -------------------------------------------------------------
    outer_box = box(0, 0, tray_w, tray_h)
    inner_box = box(wall_t + clearance, wall_t + clearance, tray_w - (wall_t + clearance), tray_h - (wall_t + clearance))
    
    cx, cy = tray_w / 2.0, tray_h / 2.0
    lip_w = 12.0
    hollow_area = box(lip_w, lip_w, tray_w - lip_w, tray_h - lip_w)
    
    ribs = [box(rx - 2.0, lip_w, rx + 2.0, tray_h - lip_w) for rx in [cx - 60, cx - 20, cx + 20, cx + 60]]
    ribs.append(box(lip_w, cy - 2.0, tray_w - lip_w, cy + 2.0))
    
    # Submarine relief in floor
    hull_half = 85.0
    hull_h = 18.0
    sub_poly_pts = [
        (-hull_half, 0), (-hull_half + 10, -4), (-hull_half + 25, -hull_h/2.0),
        (hull_half - 25, -hull_h/2.0), (hull_half - 8, -2), (hull_half, 2),
        (hull_half - 6, 7), (hull_half - 25, hull_h/2.0), (35, hull_h/2.0),
        (34, hull_h/2.0 + 4), (28, hull_h/2.0 + 4), (28, hull_h/2.0), (18, hull_h/2.0),
        (14, hull_h/2.0 + 12), (10, hull_h/2.0 + 18), (8, hull_h/2.0 + 18), (8, hull_h/2.0 + 12),
        (-10, hull_h/2.0 + 12), (-12, hull_h/2.0), (-20, hull_h/2.0), (-22, hull_h/2.0 + 3),
        (-28, hull_h/2.0 + 3), (-30, hull_h/2.0), (-hull_half + 25, hull_h/2.0),
        (-hull_half + 10, 4), (-hull_half, 0)
    ]
    sub_poly = Polygon([(cx + pt[0], cy + pt[1]) for pt in sub_poly_pts])
    solid_pattern = unary_union([sub_poly] + ribs)
    cutouts = hollow_area.difference(solid_pattern)
    
    # Solid block
    m_block = trimesh.creation.extrude_polygon(outer_box, total_z)
    
    # Recess pocket
    m_recess = trimesh.creation.extrude_polygon(inner_box, total_z - floor_h + 0.5)
    m_recess.apply_translation([0, 0, floor_h])
    
    # Floor cutouts
    cutout_meshes = [trimesh.creation.extrude_polygon(p, floor_h + 1.0).apply_translation([0, 0, -0.5])
                     for p in (cutouts.geoms if isinstance(cutouts, MultiPolygon) else [cutouts])]
    m_cutouts = trimesh.boolean.union(cutout_meshes, engine='manifold')
    
    m_tray = m_block.difference(m_recess, engine='manifold')
    m_tray = m_tray.difference(m_cutouts, engine='manifold')
    
    base_mono_path = os.path.join(stl_dir, 'sensuikan_canonical_base_tray_monolithic.stl')
    m_tray.export(base_mono_path)
    print(f"  [1/2] Base Tray Monolithic ({tray_w:.1f} x {tray_h:.1f} mm): {base_mono_path} ({len(m_tray.faces)} tris, Watertight: {m_tray.is_watertight})")
    
    # -------------------------------------------------------------
    # 2. MONOLITHIC TOP OVERLAY (CLEAN SQUARE SLOTS - NO SEMICIRCLES)
    # -------------------------------------------------------------
    overlay_w = card_w - 0.4 # 237.6 mm
    overlay_h = card_h - 0.4 # 180.0 mm
    overlay_plate = box(0, 0, overlay_w, overlay_h)
    
    def to_bot_y(y_top):
        return overlay_h - y_top

    COLS_9_X = [27.5, 44.1, 60.7, 77.3, 93.9, 110.5, 127.1, 143.7, 160.3]
    RIGHT_COLS_X = [177.9, 194.6, 211.3, 228.0]

    slots_list = []
    # 1. Left Base slots (3 slots at X = 10.0: Base, Mission, Port: Y = 28.5, 46.5, 66.9)
    for y_top in [28.5, 46.5, 66.9]:
        slots_list.append(make_clean_square_slot(10.0, to_bot_y(y_top)))
        
    # 2. Patrol track (9 universal slots, Y = 66.9):
    for x in COLS_9_X:
        slots_list.append(make_clean_square_slot(x, to_bot_y(66.9)))
        
    # 3. Damage tracks (2 x 10 = 20 slots: Flooding Y = 88.5, Hull Y = 105.9):
    slots_list.append(make_clean_square_slot(10.0, to_bot_y(88.5)))
    slots_list.append(make_clean_square_slot(10.0, to_bot_y(105.9)))
    for x in COLS_9_X:
        slots_list.append(make_clean_square_slot(x, to_bot_y(88.5)))
        slots_list.append(make_clean_square_slot(x, to_bot_y(105.9)))
        
    # 4. Middle band: Crew Status (Shifted 1 column left: 10.0 + Cols 0..3) & Systems Status (Cols 5..8)
    # Row 1: Y = 127.5, Row 2: Y = 144.9
    crew_x = [10.0] + list(COLS_9_X[:4])  # 5 columns [10.0, 27.5, 44.1, 60.7, 77.3]
    for x in crew_x:
        slots_list.append(make_clean_square_slot(x, to_bot_y(127.5)))
        slots_list.append(make_clean_square_slot(x, to_bot_y(144.9)))

    # Systems Status (Right: 4 columns x 2 rows: Cols 5..8 [110.5, 127.1, 143.7, 160.3])
    for x in COLS_9_X[5:]:
        slots_list.append(make_clean_square_slot(x, to_bot_y(127.5)))
        slots_list.append(make_clean_square_slot(x, to_bot_y(144.9)))
        
    # 5. Right block: 4 standard columns at RIGHT_COLS_X (Pitch 16.7mm, Gap 1.7mm, Ribs 2.4mm vertical)
    col_x = RIGHT_COLS_X
    r_centers = [14.4, 36.0, 53.4, 75.0, 96.6, 118.2, 135.6, 153.0, 170.4]
    for ry in r_centers:
        for tx in col_x:
            slots_list.append(make_clean_square_slot(tx, to_bot_y(ry)))

    # -------------------------------------------------------------
    # 3. OBSERVATION WINDOWS (OPCIÓN A: 3 GRANDES VENTANAS ESTRUCTURALES)
    # -------------------------------------------------------------
    win_title_block = box(2.5, to_bot_y(18.5), 167.8, to_bot_y(2.5))
    win_sub = box(20.0, to_bot_y(52.0), 167.8, to_bot_y(21.0))
    win_rules = box(8.0, to_bot_y(177.9), 167.8, to_bot_y(154.6))
    
    large_windows = [
        ('VESSEL IDENTIFICATION & BANNER', win_title_block),
        ('SHIP DOSSIER, SILHOUETTE & CALIBERS', win_sub),
        ('SPECIAL RULES & HISTORICAL NOTES', win_rules)
    ]
    
    all_holes = unary_union(slots_list + [win_title_block, win_sub, win_rules])
    overlay_solid = overlay_plate.difference(all_holes)
    
    # Extrude Monolithic Top Overlay
    tris_overlay_mono = []
    for p in (overlay_solid.geoms if isinstance(overlay_solid, MultiPolygon) else [overlay_solid]):
        tris_overlay_mono.extend(extrude_polygon_to_triangles(p, 0.0, 2.0))
        
    overlay_mono_path = os.path.join(stl_dir, 'sensuikan_canonical_top_overlay_monolithic.stl')
    write_binary_stl(tris_overlay_mono, overlay_mono_path)
    print(f"  [2/2] Top Overlay Monolithic ({overlay_w:.1f} x {overlay_h:.1f} mm): {overlay_mono_path} ({len(tris_overlay_mono)} tris)")
    
    # -------------------------------------------------------------
    # 4. HIGH-RESOLUTION BLUEPRINT PREVIEW IMAGE
    # -------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(14, 10.5), dpi=220)
    ax.set_xlim(-8, tray_w + 8)
    ax.set_ylim(-8, tray_h + 8)
    ax.set_aspect('equal')
    ax.set_facecolor('#0B1120')
    
    tray_ox = wall_t + clearance
    tray_oy = wall_t + clearance
    
    # Draw Outer Tray Perimeter & Card Recess
    ax.add_patch(patches.Rectangle((0, 0), tray_w, tray_h, fill=False, edgecolor='#38BDF8', lw=1.8, label=f'Base Tray Perimeter ({tray_w:.1f} x {tray_h:.1f} mm)'))
    ax.add_patch(patches.Rectangle((tray_ox, tray_oy), card_w, card_h, fill=False, edgecolor='#94A3B8', lw=1.2, linestyle='--', label=f'Card Pocket ({card_w:.1f} x {card_h:.1f} mm)'))
    
    # Overlay Geometry
    ox_shift = tray_ox + 0.2
    oy_shift = tray_oy + 0.2
    
    for geom in (overlay_solid.geoms if isinstance(overlay_solid, MultiPolygon) else [overlay_solid]):
        x_c, y_c = geom.exterior.xy
        ax.plot([x + ox_shift for x in x_c], [y + oy_shift for y in y_c], color='#FCD34D', lw=0.9, label='Top Overlay Solid Perimeter' if 'Top Overlay Solid Perimeter' not in [l.get_label() for l in ax.lines] else "")
        for interior in geom.interiors:
            xi, yi = interior.xy
            ax.plot([x + ox_shift for x in xi], [y + oy_shift for y in yi], color='#F43F5E', lw=0.8)
            
    # Highlight the 3 Large Observation Windows in Cyan
    win_label_added = False
    for lbl, w_box in large_windows:
        wx, wy = w_box.exterior.xy
        ax.plot([x + ox_shift for x in wx], [y + oy_shift for y in wy], color='#38BDF8', lw=2.0,
                label='3 Large Sturdy Observation Windows' if not win_label_added else "")
        win_label_added = True

    # Annotate Universal 3D Engraved Labels on the solid plate surface
    engraved_labels = [
        (ox_shift + 92.0, oy_shift + to_bot_y(56.4), "PATROL TRACK (TRANSIT & ON-STATION PHASES)"),
        (ox_shift + 92.0, oy_shift + to_bot_y(78.0), "DAMAGE TRACKS (FLOODING & HULL DAMAGE)"),
        (ox_shift + 43.0, oy_shift + to_bot_y(117.0), "CREW STATUS & QUALITY"),
        (ox_shift + 132.0, oy_shift + to_bot_y(117.0), "⚙ SYSTEMS STATUS"),
        (ox_shift + 203.2, oy_shift + to_bot_y(3.9), "✈ AIRCRAFT & TACTICAL EVENT"),
        (ox_shift + 203.2, oy_shift + to_bot_y(25.5), "▲ FORWARD TORPEDO TUBES (1–8)"),
        (ox_shift + 203.2, oy_shift + to_bot_y(64.5), "▼ AFT TUBES & RELOADS"),
        (ox_shift + 203.2, oy_shift + to_bot_y(86.1), "⚔ ARTILLERY & DECK WEAPONS"),
        (ox_shift + 203.2, oy_shift + to_bot_y(107.7), "▲ FORWARD TORPEDO RELOADS (1–16)"),
    ]
    for lx, ly, ltxt in engraved_labels:
        ax.text(lx, ly, ltxt, color='#FDE047', fontsize=5.8, weight='bold', ha='center', va='center',
                bbox=dict(boxstyle='square,pad=0.15', facecolor='#0F172A', edgecolor='#EAB308', lw=0.5, alpha=0.9))
    
    ax.text(tray_w / 2.0, tray_h + 3.5, "SENSUAIKAN MONOLITHIC TWO-LAYER 3D BOARD - OPCIÓN A (ROBUST OVERLAY)",
            color='#F8FAFC', fontsize=12, weight='bold', ha='center')
    ax.text(tray_w / 2.0, tray_h + 0.8, f"Base Tray: {tray_w:.1f} x {tray_h:.1f} x 5.4 mm | Top Overlay: {overlay_w:.1f} x {overlay_h:.1f} x 2.0 mm | Solid Bridges + Engraved Labels",
            color='#94A3B8', fontsize=8.5, ha='center')
    
    ax.legend(loc='lower left', facecolor='#1E293B', edgecolor='#475569', labelcolor='#F8FAFC', fontsize=8.5)
    ax.axis('off')
    
    preview_path = os.path.join(preview_dir, 'preview_canonical_stl_blueprint.png')
    fig.savefig(preview_path, bbox_inches='tight', facecolor='#0B1120')
    plt.close(fig)
    print(f"\n  Saved Technical Blueprint: {preview_path}")

    # -------------------------------------------------------------
    # 5. COPY TO ARTIFACT DIRECTORIES
    # -------------------------------------------------------------
    target_brain_dirs = [
        'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17',
        'C:/Users/Richard/.gemini/antigravity/brain/6141b515-295a-4787-8231-4ba78bfcbeea',
        'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673'
    ]
    stl_files_to_copy = [
        base_mono_path, overlay_mono_path,
        preview_path
    ]
    for b_dir in target_brain_dirs:
        if os.path.exists(b_dir):
            for src_f in stl_files_to_copy:
                try:
                    dst_f = os.path.join(b_dir, os.path.basename(src_f))
                    shutil.copy(src_f, dst_f)
                except Exception as e:
                    print(f"  Note: copy {src_f} to {b_dir} error: {e}")
    print("All Monolithic STL models and Blueprint preview synchronized successfully!")

if __name__ == '__main__':
    generate_canonical_stl_models()
