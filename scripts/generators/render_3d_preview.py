import struct
import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

def load_stl_triangles(filename):
    with open(filename, 'rb') as f:
        f.seek(80)
        num_triangles = struct.unpack('<I', f.read(4))[0]
        triangles = []
        for _ in range(num_triangles):
            f.read(12) # skip normal
            v0 = struct.unpack('<3f', f.read(12))
            v1 = struct.unpack('<3f', f.read(12))
            v2 = struct.unpack('<3f', f.read(12))
            f.read(2) # skip attribute
            triangles.append([v0, v1, v2])
    return triangles

tris_l = load_stl_triangles('sensuikan_base_tray_280x215_left.stl')
tris_r = load_stl_triangles('sensuikan_base_tray_280x215_right.stl')

fig = plt.figure(figsize=(14, 10), facecolor='#16191E')
ax = fig.add_subplot(111, projection='3d', facecolor='#16191E')

# Colors: Left piece slate-teal, Right piece amber-slate
mesh_l = Poly3DCollection(tris_l, facecolors='#0EA5E9', edgecolors='#0284C7', linewidths=0.25, alpha=0.92)
mesh_r = Poly3DCollection(tris_r, facecolors='#F59E0B', edgecolors='#D97706', linewidths=0.25, alpha=0.92)

ax.add_collection3d(mesh_l)
ax.add_collection3d(mesh_r)

ax.set_xlim(0, 290)
ax.set_ylim(0, 230)
ax.set_zlim(0, 30)

ax.view_init(elev=50, azim=-60)
ax.axis('off')

# Title & Info
plt.title("SENSUIKAN: BANDEJA BASE INFERIOR 3D (280 x 215 mm)\nMitad Izquierda (Azul) + Mitad Derecha (Naranja) con Colas de Milano y Fondo Aligerado", 
          color='white', fontsize=13, weight='bold', pad=20)

plt.tight_layout()
preview_path = "preview_3d_base_tray_280x215.png"
plt.savefig(preview_path, dpi=300, facecolor='#16191E')
plt.savefig(f"C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/{preview_path}", dpi=300, facecolor='#16191E')
plt.close()

print(f"Saved 3D isometric preview: {preview_path}")
