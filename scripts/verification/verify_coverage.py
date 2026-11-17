import cv2
import numpy as np

# Let's inspect if any printed text/box on each card is covered by solid plastic instead of a cutout
# In our simulation, the cutouts are where mask is black (0, 0, 0), and plastic is darkened overlay

img_j2 = cv2.imread("junsen_j2.png")
img_sentoku = cv2.resize(cv2.imread("photos/thumb_03.jpg"), (525, 408))
img_c3 = cv2.resize(cv2.imread("photos/thumb_00.jpg"), (525, 408))

# Let's check each slot
# For J.2, all 30 boxes in grid_definition.json:
# Are their centers inside our universal slots?
import json
with open('grid_definition.json') as f:
    grid = json.load(f)

cols = [384, 414, 444, 474]
row_aircraft = [23]
rows_tubes = [57, 87]
bin_rect = (384, 120, 118, 60)
rows_weapons = [194, 223]
rows_systems = [241, 271, 301, 331, 361]

universal_slots = []
for c in cols:
    universal_slots.append((c, row_aircraft[0]))
for r in rows_tubes:
    for c in cols:
        universal_slots.append((c, r))
for r in rows_weapons:
    for c in cols:
        universal_slots.append((c, r))
for r in rows_systems:
    for c in cols:
        universal_slots.append((c, r))

# Check coverage for J.2
covered = 0
uncovered = []
for sec, b_list in grid.items():
    for b in b_list:
        px, py, pw, ph = b['box']
        if px > 340 and b.get('name') != 'Supplies':
            cx = px + pw/2
            cy = py + ph/2
            # Is it in bin?
            bx, by, bw, bh = bin_rect
            if bx <= cx <= bx + bw and by <= cy <= by + bh:
                covered += 1
                continue
            # Is it near any universal slot?
            found = False
            for ux, uy in universal_slots:
                if abs(cx - (ux + 13)) < 10 and abs(cy - (uy + 13)) < 10:
                    found = True
                    break
            if found:
                covered += 1
            else:
                uncovered.append((b.get('name'), px, py))

print(f"J.2 right side boxes covered: {covered}/30")
if uncovered:
    print(f"Uncovered boxes: {uncovered}")
