import os
import trimesh

def check_stl_health(stl_path):
    if not os.path.exists(stl_path):
        print(f"STL: {stl_path} | NOT FOUND")
        return False
        
    mesh = trimesh.load(stl_path)
    
    # Check edges
    edges = {}
    for face in mesh.faces:
        for e in [(face[0], face[1]), (face[1], face[2]), (face[2], face[0])]:
            edges[e] = edges.get(e, 0) + 1

    undirected = {}
    for (a, b), cnt in edges.items():
        pair = tuple(sorted([a, b]))
        undirected[pair] = undirected.get(pair, 0) + cnt

    non_manifold_edges = [pair for pair, count in undirected.items() if count != 2]
    open_edges = [e for e, count in edges.items() if (e[1], e[0]) not in edges]
    
    is_clean = len(non_manifold_edges) == 0 and len(open_edges) == 0 and mesh.is_watertight and mesh.is_volume
    status = "PASSED (100% Manifold Solid)" if is_clean else f"FAILED (Non-manifold: {len(non_manifold_edges)}, Open: {len(open_edges)})"
    
    print(f"STL: {os.path.basename(stl_path):<48}")
    print(f"  Dimensions (X, Y, Z): {mesh.extents[0]:.1f} x {mesh.extents[1]:.1f} x {mesh.extents[2]:.1f} mm")
    print(f"  Faces: {len(mesh.faces):<6} | Watertight: {str(mesh.is_watertight):<5} | Is Volume: {str(mesh.is_volume):<5}")
    print(f"  Non-manifold edges: {len(non_manifold_edges):<2} | Open boundary edges: {len(open_edges):<2}")
    print(f"  -> Result: {status}\n")
    return is_clean

files = [
    "stl/sensuikan_canonical_base_tray_monolithic.stl",
    "stl/sensuikan_canonical_top_overlay_monolithic.stl",
]

print("=" * 80)
print("SENSUAIKAN 3D STL HEALTH & MANIFOLD VERIFICATION (BAMBU STUDIO READY)")
print("=" * 80)

all_ok = True
for f in files:
    ok = check_stl_health(f)
    if not ok:
        all_ok = False

print("-" * 80)
print(f"ALL MONOLITHIC STLS 100% HEALTHY, MANIFOLD & WATERTIGHT? -> {all_ok}")
print("=" * 80)
