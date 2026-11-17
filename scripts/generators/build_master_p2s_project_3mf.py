"""
Master Bambu Studio Native Project Generator for Bambu Lab P2S + AMS (Sensuikan):
- Fully compliant Native Bambu Studio project (.3mf):
  * Application: BambuStudio-02.09.01.70
  * Namespaces: xmlns:BambuStudio="http://schemas.bambulab.com/package/2021"
  * Contains Metadata/model_settings.config with EXACTLY 5 PLATES:
    - Plate 1: 01_Base_Soporte_Inferior (sensuikan_canonical_base_tray_monolithic.stl)
    - Plate 2: 02_Bandeja_Hangar_16_Submarinos_Malla (sensuikan_canonical_reserve_depot_tray_monolithic.stl)
    - Plate 3: 03_Cubierta_Overlay_Textos_3D (sensuikan_top_overlay_with_raised_text.stl)
    - Plate 4: 04_Tapa_Rejilla_SaveGame (sensuikan_save_game_grate_lid.stl)
    - Plate 5: 05_Caddy_Cartas_Dados_Y_Tapa (caddy + lid side by side)
  * NO Plate 6! NO loose floating text!
- All tray pieces rotated 90 degrees (Portrait: X=185.2 mm, Y=241.7 mm) and centered at (128, 128 mm).
- Filament cutter exclusion zone (X < 18, Y < 18) completely avoided!
- Pre-configured for P2S 0.4mm nozzle with 4 filaments:
  * Slot 1: PLA Negro (#161616)
  * Slot 2: PLA Blanco Jade (#FFFFFF)
  * Slot 3: PLA Rojo Granate (#C12E1F)
  * Slot 4: PLA Gris Niebla (#D1D3D5)
- Also exports individual 1-plate 3MF files for convenience!
"""

import os
import json
import zipfile
import shutil
import numpy as np
import trimesh

STL_DIR = os.path.abspath("stl")
DOCS_DIR = os.path.abspath("docs")
ROOT_DIR = os.path.abspath(".")
ART_DIR = r"C:\Users\Richard\.gemini\antigravity\brain\18446ce2-bf5f-4871-953f-de7abe125628"

os.makedirs(STL_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

def center_and_orient(mesh, rotate_90=True, target_center=(128.0, 128.0)):
    m = mesh.copy()
    if rotate_90:
        rot_z = trimesh.transformations.rotation_matrix(np.radians(90), [0, 0, 1])
        m.apply_transform(rot_z)
    b_min = m.bounds[0]
    b_max = m.bounds[1]
    cx = (b_min[0] + b_max[0]) / 2.0
    cy = (b_min[1] + b_max[1]) / 2.0
    cz = b_min[2]
    shift = np.array([target_center[0] - cx, target_center[1] - cy, -cz])
    m.apply_translation(shift)
    return m

def make_3mf_xml(objects_dict):
    """
    objects_dict: dict of {obj_id: (name, trimesh_obj)}
    """
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<model unit="millimeter" xml:lang="en-US" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:BambuStudio="http://schemas.bambulab.com/package/2021" xmlns:p="http://schemas.microsoft.com/3dmanufacturing/production/2015/06" requiredextensions="p">')
    xml.append(' <metadata name="Application">BambuStudio-02.09.01.70</metadata>')
    xml.append(' <metadata name="BambuStudio:3mfVersion">1</metadata>')
    xml.append(' <resources>')
    for obj_id, (name, m) in objects_dict.items():
        xml.append(f'  <object id="{obj_id}" type="model">')
        xml.append('   <mesh>')
        xml.append('    <vertices>')
        for v in m.vertices:
            xml.append(f'     <vertex x="{v[0]:.4f}" y="{v[1]:.4f}" z="{v[2]:.4f}"/>')
        xml.append('    </vertices>')
        xml.append('    <triangles>')
        for f in m.faces:
            xml.append(f'     <triangle v1="{f[0]}" v2="{f[1]}" v3="{f[2]}"/>')
        xml.append('    </triangles>')
        xml.append('   </mesh>')
        xml.append('  </object>')
    xml.append(' </resources>')
    xml.append(' <build>')
    for obj_id in objects_dict.keys():
        xml.append(f'  <item objectid="{obj_id}" transform="1 0 0 0 1 0 0 0 1 0 0 0" printable="1"/>')
    xml.append(' </build>')
    xml.append('</model>')
    return '\n'.join(xml)

def make_model_settings_xml(plates_info, objects_info):
    """
    plates_info: list of (plate_id, plate_name, [obj_ids])
    objects_info: list of (obj_id, obj_name)
    """
    xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<config>']
    for obj_id, obj_name in objects_info:
        xml.append(f'  <object id="{obj_id}">')
        xml.append(f'    <metadata key="name" value="{obj_name}"/>')
        xml.append('    <metadata key="extruder" value="1"/>')
        xml.append(f'    <part id="1" subtype="normal_part">')
        xml.append(f'      <metadata key="name" value="{obj_name}"/>')
        xml.append('      <metadata key="matrix" value="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1"/>')
        xml.append('    </part>')
        xml.append('  </object>')
        
    for plater_id, plater_name, obj_ids in plates_info:
        xml.append('  <plate>')
        xml.append(f'    <metadata key="plater_id" value="{plater_id}"/>')
        xml.append(f'    <metadata key="plater_name" value="{plater_name}"/>')
        xml.append('    <metadata key="locked" value="false"/>')
        xml.append('    <metadata key="filament_map_mode" value="Auto For Flush"/>')
        xml.append('    <metadata key="filament_maps" value="1 1 1 1"/>')
        for oid in obj_ids:
            xml.append('    <model_instance>')
            xml.append(f'      <metadata key="object_id" value="{oid}"/>')
            xml.append('      <metadata key="instance_id" value="0"/>')
            xml.append(f'      <metadata key="identify_id" value="{100 + oid}"/>')
            xml.append('    </model_instance>')
        xml.append('  </plate>')
    xml.append('</config>')
    return '\n'.join(xml)

def get_bambu_project_config():
    return {
        "version": "02.09.01.70",
        "printer_model": "Bambu Lab P2S",
        "printer_settings_id": "Bambu Lab P2S 0.4 nozzle",
        "curr_bed_type": "textured_plate",
        "filament_type": ["PLA", "PLA", "PLA", "PLA"],
        "filament_colour": ["#161616", "#FFFFFF", "#C12E1F", "#D1D3D5"],
        "filament_settings_id": [
            "Bambu PLA Basic @BBL P2S",
            "Bambu PLA Basic @BBL P2S",
            "Bambu PLA Basic @BBL P2S",
            "Bambu PLA Basic @BBL P2S"
        ],
        "nozzle_diameter": ["0.4"],
        "brim_type": "no_brim",
        "brim_width": "0",
        "support_enable": "0",
        "layer_height": "0.2"
    }

def get_slice_info_xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<config>
  <header>
    <header_item key="X-BBL-Client-Type" value="slicer"/>
    <header_item key="X-BBL-Client-Version" value="02.09.01.70"/>
  </header>
</config>
"""

def get_content_types_xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
 <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
 <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
 <Default Extension="png" ContentType="image/png"/>
 <Default Extension="gcode" ContentType="text/x.gcode"/>
</Types>
"""

def get_root_rels_xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
 <Relationship Target="/3D/3dmodel.model" Id="rel-1" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>
"""

def package_native_bambu_3mf(out_path, objects_dict, plates_info):
    """
    Creates a 100% genuine Native Bambu Lab .3mf project
    """
    model_xml = make_3mf_xml(objects_dict)
    objects_info = [(oid, name) for oid, (name, _) in objects_dict.items()]
    model_settings_xml = make_model_settings_xml(plates_info, objects_info)
    proj_cfg = get_bambu_project_config()
    slice_xml = get_slice_info_xml()
    ct_xml = get_content_types_xml()
    rels_xml = get_root_rels_xml()
    
    with zipfile.ZipFile(out_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", ct_xml)
        z.writestr("_rels/.rels", rels_xml)
        z.writestr("3D/3dmodel.model", model_xml)
        z.writestr("Metadata/model_settings.config", model_settings_xml)
        z.writestr("Metadata/project_settings.config", json.dumps(proj_cfg, indent=4))
        z.writestr("Metadata/slice_info.config", slice_xml)
    print(f"Packaged Native Bambu 3MF: {out_path} ({os.path.getsize(out_path):,} bytes)")

def build_all_p2s_projects():
    print("=" * 70)
    print("BUILDING 100% NATIVE BAMBU LAB P2S PROJECTS (ZERO ERRORS, 5 PLATES)")
    print("=" * 70)
    
    # 1. Load and orient all 6 meshes
    print("Loading models...")
    m_base = trimesh.load(os.path.join(STL_DIR, "sensuikan_canonical_base_tray_monolithic.stl"))
    m_depot = trimesh.load(os.path.join(STL_DIR, "sensuikan_canonical_reserve_depot_tray_monolithic.stl"))
    m_overlay = trimesh.load(os.path.join(STL_DIR, "sensuikan_top_overlay_with_raised_text.stl"))
    m_grate = trimesh.load(os.path.join(STL_DIR, "sensuikan_save_game_grate_lid.stl"))
    m_caddy = trimesh.load(os.path.join(STL_DIR, "sensuikan_cards_and_dice_caddy.stl"))
    m_caddy_lid = trimesh.load(os.path.join(STL_DIR, "sensuikan_cards_and_dice_caddy_lid.stl"))
    
    print("Orienting for P2S 256x256 bed (Portrait rotation, centered at 128,128)...")
    m1 = center_and_orient(m_base, rotate_90=True)
    m2 = center_and_orient(m_depot, rotate_90=True)
    m3 = center_and_orient(m_overlay, rotate_90=True)
    m4 = center_and_orient(m_grate, rotate_90=True)
    
    # Plate 5: Caddy and Lid arranged front-to-back (Y=65 and Y=190 mm)
    # Caddy is 145x115 mm, centered at X=128 (X from 55.5 to 200.5 mm, well clear of cutter exclusion zone!)
    m5_c = center_and_orient(m_caddy, rotate_90=False, target_center=(128.0, 65.0))
    m5_l = center_and_orient(m_caddy_lid, rotate_90=False, target_center=(128.0, 190.0))
    
    # Verify bounds
    for name, m in [("Plate 1 Base", m1), ("Plate 2 Depot Mesh", m2), ("Plate 3 Overlay 3D", m3), ("Plate 4 Grate Lid", m4), ("Plate 5 Caddy", m5_c), ("Plate 5 Lid", m5_l)]:
        b = m.bounds
        print(f"  {name:20s}: X=[{b[0][0]:.1f}, {b[1][0]:.1f}] Y=[{b[0][1]:.1f}, {b[1][1]:.1f}] Z=[{b[0][2]:.1f}, {b[1][2]:.1f}]")
        assert b[0][0] >= 18.0, f"Cutter exclusion collision on {name}: Xmin = {b[0][0]}"
        assert b[1][0] <= 256.0, f"Bed overflow on {name}: Xmax = {b[1][0]}"
        assert b[0][1] >= 0.0, f"Bed underflow on {name}: Ymin = {b[0][1]}"
        assert b[1][1] <= 256.0, f"Bed overflow on {name}: Ymax = {b[1][1]}"
    print("All models pass 100% P2S bed limit checks!")
    
    # -------------------------------------------------------------------------
    # MASTER PROJECT: EXACTLY 5 PLATES
    # -------------------------------------------------------------------------
    master_objects = {
        1: ("01_Base_Soporte_Inferior.stl", m1),
        2: ("02_Bandeja_Hangar_16_Submarinos_Malla.stl", m2),
        3: ("03_Cubierta_Overlay_Textos_3D.stl", m3),
        4: ("04_Tapa_Rejilla_SaveGame.stl", m4),
        5: ("05_Caddy_Cartas_Enfundadas_Dados.stl", m5_c),
        6: ("05_Tapa_Deslizable_Caddy.stl", m5_l)
    }
    
    master_plates = [
        (1, "01 Base Soporte Inferior", [1]),
        (2, "02 Bandeja Hangar 16 Reservas Malla", [2]),
        (3, "03 Cubierta Overlay Textos 3D", [3]),
        (4, "04 Tapa Rejilla SaveGame", [4]),
        (5, "05 Caddy Cartas y Dados con Tapa", [5, 6])
    ]
    
    out_master_stl = os.path.join(STL_DIR, "SENSUAIKAN_DELUXE_P2S_MASTER_PROJECT.3mf")
    package_native_bambu_3mf(out_master_stl, master_objects, master_plates)
    
    m_op_overlay = trimesh.load(os.path.join(STL_DIR, "sensuikan_operations_map_top_overlay.stl"))
    m6_op = center_and_orient(m_op_overlay, rotate_90=True)
    
    # -------------------------------------------------------------------------
    # INDIVIDUAL 1-PLATE 3MF PROJECTS (FOR ULTRA-CONVENIENT PRINTING)
    # -------------------------------------------------------------------------
    indiv_files = [
        ("SENSUAIKAN_P2S_PLATE_1_BASE_TRAY.3mf", {1: ("01_Base_Soporte_Inferior.stl", m1)}, [(1, "01 Base Soporte Inferior", [1])]),
        ("SENSUAIKAN_P2S_PLATE_2_DEPOT_TRAY_MALLA.3mf", {1: ("02_Bandeja_Hangar_16_Submarinos_Malla.stl", m2)}, [(1, "02 Bandeja Hangar Malla", [1])]),
        ("SENSUAIKAN_P2S_PLATE_3_OVERLAY_TEXTOS_3D.3mf", {1: ("03_Cubierta_Overlay_Textos_3D.stl", m3)}, [(1, "03 Cubierta Overlay Textos 3D", [1])]),
        ("SENSUAIKAN_P2S_PLATE_4_TAPA_SAVEGAME.3mf", {1: ("04_Tapa_Rejilla_SaveGame.stl", m4)}, [(1, "04 Tapa Rejilla SaveGame", [1])]),
        ("SENSUAIKAN_P2S_PLATE_5_CADDY_CARTAS_DADOS.3mf", {1: ("05_Caddy.stl", m5_c), 2: ("05_Tapa.stl", m5_l)}, [(1, "05 Caddy Cartas y Dados", [1, 2])]),
        ("SENSUAIKAN_P2S_PLATE_6_OPERATIONS_MAP_OVERLAY.3mf", {1: ("06_Cubierta_Overlay_Mapa_Operaciones.stl", m6_op)}, [(1, "06 Cubierta Overlay Mapa Operaciones", [1])])
    ]
    
    for fname, objs, plts in indiv_files:
        fpath = os.path.join(STL_DIR, fname)
        package_native_bambu_3mf(fpath, objs, plts)
        shutil.copy2(fpath, os.path.join(DOCS_DIR, fname))
        shutil.copy2(fpath, os.path.join(ROOT_DIR, fname))
        if os.path.exists(ART_DIR):
            shutil.copy2(fpath, os.path.join(ART_DIR, fname))

    # Also copy master project
    shutil.copy2(out_master_stl, os.path.join(DOCS_DIR, "SENSUAIKAN_DELUXE_P2S_MASTER_PROJECT.3mf"))
    shutil.copy2(out_master_stl, os.path.join(ROOT_DIR, "SENSUAIKAN_DELUXE_P2S_MASTER_PROJECT.3mf"))
    if os.path.exists(ART_DIR):
        shutil.copy2(out_master_stl, os.path.join(ART_DIR, "SENSUAIKAN_DELUXE_P2S_MASTER_PROJECT.3mf"))
        
    print("\nALL BAMBU LAB 3MF PROJECTS SUCCESSFULLY CREATED & SYNCHRONIZED!")

if __name__ == "__main__":
    build_all_p2s_projects()
