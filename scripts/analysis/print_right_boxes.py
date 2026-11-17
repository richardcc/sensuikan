import json
import cv2
import numpy as np

with open('grid_definition.json') as f:
    grid = json.load(f)

# Let's see what boxes are on the right side in grid_definition.json (Junsen J.2)
right_boxes = []
for section, b_list in grid.items():
    for b in b_list:
        px, py, pw, ph = b['box']
        if px > 340:
            right_boxes.append((section, b['name'], px, py, pw, ph))

print(f"Total boxes on right side in J.2: {len(right_boxes)}")
for sec, name, px, py, pw, ph in sorted(right_boxes, key=lambda x: (x[3], x[2])):
    print(f"y={py:3d}, x={px:3d}: {sec:18s} | {name}")
