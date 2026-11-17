"""
Creates native multi-part 3MF files for Bambu Studio:
1. stl/sensuikan_top_overlay_dual_color_bambu.3mf
   - Combines Solid Plate (Part 1) and Embossed 3D Text (Part 2) into 1 grouped multi-part object
   - Rotated 90 degrees (Portrait: X=181.1, Y=237.6 mm) to fit build plate cleanly
   - Centered on Bambu bed (256x256 mm)
   - Ready for 1-click filament assignment (Slot 1 Black + Slot 2 White/Red)
"""

import os
import trimesh
import numpy as np

STL_DIR = os.path.abspath("stl")
os.makedirs(STL_DIR, exist_ok=True)

def create_bambu_3mf():
    print("Creating native Bambu Studio Multi-Part 3MF...")
    
    path_plate = os.path.join(STL_DIR, "sensuikan_top_overlay_solid_plate.stl")
    path_text = os.path.join(STL_DIR, "sensuikan_top_overlay_embossed_text.stl")
    
    m_plate = trimesh.load(path_plate)
    m_text = trimesh.load(path_text)
    
    # Rotate 90 degrees around Z axis so it sits in portrait orientation
    # (X = 181.1 mm, Y = 237.6 mm), perfectly avoiding the Bambu cutter exclusion zone!
    rot_z = trimesh.transformations.rotation_matrix(np.radians(90), [0, 0, 1])
    m_plate.apply_transform(rot_z)
    m_text.apply_transform(rot_z)
    
    # Center on Bambu 256x256 mm plate: Center is (128, 128, 0)
    # Get combined bounds
    b_min = np.minimum(m_plate.bounds[0], m_text.bounds[0])
    b_max = np.maximum(m_plate.bounds[1], m_text.bounds[1])
    current_center = (b_min + b_max) / 2.0
    target_center = np.array([128.0, 128.0, (b_max[2] - b_min[2])/2.0])
    shift = target_center - current_center
    shift[2] = 0.0 # Keep Z at 0
    
    m_plate.apply_translation(shift)
    m_text.apply_translation(shift)
    
    # Set metadata names for Bambu Studio object tree
    m_plate.metadata['name'] = 'Placa_Base_Overlay'
    m_text.metadata['name'] = 'Textos_En_Relieve_3D'
    
    scene = trimesh.Scene()
    scene.add_geometry(m_plate, node_name='Placa_Base_Negro')
    scene.add_geometry(m_text, node_name='Textos_Relieve_Blanco')
    
    out_3mf = os.path.join(STL_DIR, "sensuikan_top_overlay_dual_color_bambu.3mf")
    scene.export(out_3mf, file_type='3mf')
    
    print(f"Exported Multi-Part 3MF: {out_3mf}")
    print(f"  Plate triangles: {len(m_plate.faces)}")
    print(f"  Text triangles: {len(m_text.faces)}")
    print(f"  Combined size in Bambu Studio: X={b_max[1]-b_min[1]:.1f} mm, Y={b_max[0]-b_min[0]:.1f} mm, Z=2.6 mm")
    
    return out_3mf

if __name__ == "__main__":
    create_bambu_3mf()
