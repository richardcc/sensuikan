import os
import sys
import struct
import numpy as np
import shapely.geometry as sg
from shapely.geometry import Polygon, MultiPolygon, box
from shapely.ops import unary_union
from shapely.affinity import translate
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties
import trimesh

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'generators')))
from generate_canonical_models import extrude_polygon_to_triangles, write_binary_stl, make_clean_square_slot

def create_text_polygon(text, cx, cy, size, font_path=r'C:\Windows\Fonts\arialbd.ttf'):
    fp = FontProperties(fname=font_path)
    tp = TextPath((0, 0), text, size=size, prop=fp)
    raw_polys = [sg.Polygon(p) for p in tp.to_polygons() if len(p) >= 3]
    raw_polys.sort(key=lambda p: p.area, reverse=True)
    result = sg.MultiPolygon()
    for p in raw_polys:
        result = result.symmetric_difference(p)
    minx, miny, maxx, maxy = result.bounds
    tx = cx - (minx + maxx) / 2.0
    ty = cy - (miny + maxy) / 2.0
    return translate(result, xoff=tx, yoff=ty)

def generate_embossed_overlay():
    print("=" * 80)
    print("GENERATING DUAL-COLOR EMBOSSED TEXT TOP OVERLAY (SENSUlKAN)")
    print("SOLID BRIDGES (NO NARROW SLITS) + 3D EMBOSSED SECTION TITLES")
    print("=" * 80)

    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    stl_dir = os.path.join(repo_root, 'stl')
    preview_dir = os.path.join(repo_root, 'images', 'previews')
    os.makedirs(stl_dir, exist_ok=True)
    os.makedirs(preview_dir, exist_ok=True)

    card_w = 238.0
    card_h = 181.5
    overlay_w = card_w - 0.4 # 237.6 mm
    overlay_h = card_h - 0.4 # 181.1 mm
    overlay_plate = box(0, 0, overlay_w, overlay_h)

    def to_bot_y(y_top):
        return overlay_h - y_top

    # 1. Counter Slots
    slots_list = []
    # Left Base slots (3 slots at X = 10.0: Base, Mission, Port)
    for y_top in [28.5, 46.5, 64.5]:
        slots_list.append(make_clean_square_slot(10.0, to_bot_y(y_top)))

    # Patrol track (9 universal slots, Y = 64.5)
    for x in np.linspace(28.0, 156.0, 9):
        slots_list.append(make_clean_square_slot(x, to_bot_y(64.5)))

    # Damage tracks (2 x 10 = 20 slots)
    slots_list.append(make_clean_square_slot(10.0, to_bot_y(82.5)))
    slots_list.append(make_clean_square_slot(10.0, to_bot_y(99.5)))
    for x in np.linspace(28.0, 156.0, 9):
        slots_list.append(make_clean_square_slot(x, to_bot_y(82.5)))
        slots_list.append(make_clean_square_slot(x, to_bot_y(99.5)))

    # Crew Status (2 rows of 7 slots = 14 slots)
    for x in np.linspace(28.0, 156.0, 7):
        slots_list.append(make_clean_square_slot(x, to_bot_y(119.5)))
        slots_list.append(make_clean_square_slot(x, to_bot_y(136.5)))

    # Right block: 4 standard columns
    col_x = [178.5, 195.0, 211.5, 228.0]

    # Row 0: Aircraft & Events (Y = 14.0)
    for tx in col_x:
        slots_list.append(make_clean_square_slot(tx, to_bot_y(14.0)))

    # Row 1: Torpedo Tubes 1..4 (Y = 33.0)
    for x in col_x:
        slots_list.append(make_clean_square_slot(x, to_bot_y(33.0)))

    # Row 2: Torpedo Tubes 5..8 / Reloads (Y = 49.8)
    for x in col_x:
        slots_list.append(make_clean_square_slot(x, to_bot_y(49.8)))

    # Row 3: Artillery & Weapons (Y = 69.0)
    for x in col_x:
        slots_list.append(make_clean_square_slot(x, to_bot_y(69.0)))

    # Row 4: Columns 0 & 1 only (Y = 85.8)
    slots_list.append(make_clean_square_slot(col_x[0], to_bot_y(85.8)))
    slots_list.append(make_clean_square_slot(col_x[1], to_bot_y(85.8)))

    # Row 5: Columns 0 & 1 only (Y = 102.6)
    slots_list.append(make_clean_square_slot(col_x[0], to_bot_y(102.6)))
    slots_list.append(make_clean_square_slot(col_x[1], to_bot_y(102.6)))

    # 2x2 FORWARD RELOADS & SUPPLIES BAY
    bay_cx = (col_x[2] + col_x[3]) / 2.0
    bay_cy = (85.8 + 102.6) / 2.0
    bay_w = 31.5
    bay_h = 31.8
    bay_box = box(bay_cx - bay_w/2.0, to_bot_y(bay_cy + bay_h/2.0),
                  bay_cx + bay_w/2.0, to_bot_y(bay_cy - bay_h/2.0))
    slots_list.append(bay_box)

    # Systems Status: 16 slots (4 cols x 4 rows)
    for y_top in [122.0, 138.5, 155.0, 171.5]:
        for x in col_x:
            slots_list.append(make_clean_square_slot(x, to_bot_y(y_top)))

    # 2. Large Information Windows (3 Big Cutouts Only - NO Slit Windows!)
    win_title_block = box(2.5, to_bot_y(18.5), 163.5, to_bot_y(2.5))
    win_sub = box(20.5, to_bot_y(52.0), 163.5, to_bot_y(21.0))
    win_rules = box(8.0, to_bot_y(179.0), 163.5, to_bot_y(147.5))

    all_holes = unary_union(slots_list + [win_title_block, win_sub, win_rules])
    overlay_solid_plate = overlay_plate.difference(all_holes)

    # 3. Create 3D Embossed Text Titles (Positioned on the solid bridges)
    titles_config = [
        # (Text, Center X, Center Y_top, Font Size in mm)
        ('PATROL TRACK (TRANSIT & ON-STATION)', 92.0, 54.5, 2.3),
        ('DAMAGE TRACKS (FLOODING & HULL DAMAGE)', 92.0, 73.5, 1.9),
        ('CREW STATUS & CREW QUALITY', 92.0, 109.5, 2.5),
        ('AIRCRAFT & TACTICAL EVENTS', 203.25, 3.8, 2.2),
        ('TORPEDO ARMAMENT & RELOADS', 203.25, 23.5, 2.2),
        ('ARTILLERY & SPECIAL WEAPONS', 203.25, 59.4, 2.2),
        ('SYSTEMS STATUS', 203.25, 112.3, 2.4)
    ]

    text_polys = []
    for title, cx, y_top, sz in titles_config:
        p = create_text_polygon(title, cx, to_bot_y(y_top), sz)
        text_polys.append(p)
    text_union = unary_union(text_polys)

    # 4. Extrude Triangles
    # A. Solid Base Plate: Z = 0.0 to 2.0 mm
    tris_plate = []
    for p in (overlay_solid_plate.geoms if isinstance(overlay_solid_plate, MultiPolygon) else [overlay_solid_plate]):
        tris_plate.extend(extrude_polygon_to_triangles(p, 0.0, 2.0))

    # B. 3D Embossed Text: Z = 2.0 to 2.6 mm (+0.6 mm emboss height, exactly 3 layers at 0.20mm)
    tris_text = []
    for p in (text_union.geoms if isinstance(text_union, MultiPolygon) else [text_union]):
        tris_text.extend(extrude_polygon_to_triangles(p, 2.0, 2.6))

    # C. Combined Mesh (Plate + Text)
    tris_combined = tris_plate + tris_text

    # 5. Export STLs
    path_plate = os.path.join(stl_dir, 'sensuikan_top_overlay_solid_plate.stl')
    path_text = os.path.join(stl_dir, 'sensuikan_top_overlay_embossed_text.stl')
    path_combined = os.path.join(stl_dir, 'sensuikan_top_overlay_with_raised_text.stl')

    write_binary_stl(tris_plate, path_plate)
    write_binary_stl(tris_text, path_text)
    write_binary_stl(tris_combined, path_combined)

    print(f"  [1/3] Solid Plate STL: {path_plate} ({len(tris_plate)} tris)")
    print(f"  [2/3] Embossed Text STL: {path_text} ({len(tris_text)} tris)")
    print(f"  [3/3] Combined Multi-Color STL: {path_combined} ({len(tris_combined)} tris)")

    # 6. Verify watertightness of meshes
    def verify_watertight(tris, label):
        verts, faces, v_dict = [], [], {}
        for t in tris:
            f = []
            for pt in t:
                pt_round = tuple(np.round(pt, 5))
                if pt_round not in v_dict:
                    v_dict[pt_round] = len(verts)
                    verts.append(pt_round)
                f.append(v_dict[pt_round])
            faces.append(f)
        m = trimesh.Trimesh(vertices=verts, faces=faces)
        print(f"  -> {label} Watertight: {m.is_watertight}, Volume: {m.volume:.2f} mm^3")
        return m

    verify_watertight(tris_plate, "Solid Plate")
    verify_watertight(tris_text, "Embossed Text")

    # 7. Render 2D Top View Preview with Color Contrast
    import matplotlib.pyplot as plt
    import matplotlib.patches as patches
    fig, ax = plt.subplots(figsize=(12, 9), dpi=200)
    ax.set_facecolor('#14181c')
    fig.patch.set_facecolor('#0f1215')

    # Draw solid plate
    for p in (overlay_solid_plate.geoms if isinstance(overlay_solid_plate, MultiPolygon) else [overlay_solid_plate]):
        ext_coords = np.array(p.exterior.coords)
        ax.fill(ext_coords[:, 0], ext_coords[:, 1], facecolor='#2a3038', edgecolor='#3a424e', linewidth=0.5)
        for interior in p.interiors:
            int_coords = np.array(interior.coords)
            ax.fill(int_coords[:, 0], int_coords[:, 1], facecolor='#14181c', edgecolor='#455060', linewidth=0.5)

    # Draw embossed text in vibrant gold
    for p in (text_union.geoms if isinstance(text_union, MultiPolygon) else [text_union]):
        ext_coords = np.array(p.exterior.coords)
        ax.fill(ext_coords[:, 0], ext_coords[:, 1], facecolor='#ffd700', edgecolor='#ffa500', linewidth=0.3)
        for interior in p.interiors:
            int_coords = np.array(interior.coords)
            ax.fill(int_coords[:, 0], int_coords[:, 1], facecolor='#2a3038', edgecolor='#ffa500', linewidth=0.3)

    ax.set_xlim(-5, overlay_w + 5)
    ax.set_ylim(-5, overlay_h + 5)
    ax.set_aspect('equal')
    ax.set_title('SENSUlKAN - CANONICAL 3D TOP OVERLAY WITH EMBOSSED DUAL-COLOR TEXT\n(Solid Plastic Bridges + 0.6mm Raised Titles in Bambu Studio / AMS)', color='#d4af37', fontsize=12, pad=15)
    ax.axis('off')

    preview_path = os.path.join(preview_dir, 'preview_canonical_overlay_embossed_text.png')
    plt.tight_layout()
    plt.savefig(preview_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"  [Preview] Saved 2D color preview: {preview_path}")

if __name__ == '__main__':
    generate_embossed_overlay()
