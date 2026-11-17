import json

with open('grid_definition.json') as f:
    grid = json.load(f)

scale_x = 280.0 / 525.0
scale_y = 170.0 / 408.0

print(f"Scale factors: x={scale_x:.4f}, y={scale_y:.4f}")
for sec in grid:
    print(f"=== {sec} (total {len(grid[sec])}) ===")
    for b in grid[sec][:2]:
        px, py, pw, ph = b['box']
        cx_mm = (px + pw/2.0) * scale_x
        cy_mm_from_top = (py + ph/2.0) * scale_y
        name = b.get('name', 'box')
        print(f"  {name}: center=({cx_mm:.1f}, {cy_mm_from_top:.1f}) mm, size=({pw*scale_x:.1f}, {ph*scale_y:.1f}) mm")
