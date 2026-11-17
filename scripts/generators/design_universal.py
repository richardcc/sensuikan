import cv2
import numpy as np
import json

# Let's inspect the exact layout of Junsen J.2 vs Sen-Toku
# In Junsen J.2:
# What are the exact boxes in grid_definition.json?
with open('grid_definition.json') as f:
    grid = json.load(f)

# Let's see all boxes on right side in J.2:
j2_boxes = []
for sec, b_list in grid.items():
    for b in b_list:
        px, py, pw, ph = b['box']
        if px > 340 and b.get('name') != 'Supplies':
            j2_boxes.append((px, py, pw, ph, b.get('name', '')))

print(f"J.2 right side boxes: {len(j2_boxes)}")

# Now let's examine what Sen-Toku, Type C.3, etc. have that J.2 does NOT have:
# 1. Aircraft row (y=23): J.2 has 1 aircraft (x=383) + Random Event 1 (444) + Random Event 2 (475).
#    Sen-Toku has 3 aircraft! It needs a box at x=414 as well!
#    Adding x=414, y=23 gives 4 boxes on row 0: covers all 3 Seiran aircraft + events.
# 2. Torpedo tubes (y=57, y=87): J.2 already has 4 tubes on row 1 (384, 414, 444, 475)
#    and row 2 has 4 slots (384, 414, 444, 475). That is 8 tubes total!
#    Sen-Toku has 8 tubes. J.2 has 6 tubes + 2 reloads in the same 8 slots. Perfect match!
# 3. Reloads Bin (y=120 to 180): J.2 has 118x60 mm bin.
#    All fleet subs use this bin for torpedo reloads or mines!
# 4. Weapons & Kaiten row (y=194, y=223):
#    J.2 has Deck gun (384, 194), Ammo (414, 194), AA gun (384, 223).
#    Type C.3 has 6 Kaiten: row at y=194 (x=384, 414, 444, 475) and row at y=223 (x=384, 414, 444, 475)!
# 5. Systems Grid (y=241, 271, 301, 331, 361):
#    4 columns: x = 384, 414, 444, 475.
#    5 rows: y = 241, 271, 301, 331, 361.
#    That is a 4x5 = 20 box matrix!
#    In J.2, 15 of these 20 boxes are used (Crane, Hangar, FTorp, AftTorp, Radio, DivePlanes, Diesels, Electrics, Batteries, etc.).
#    In other subs, up to 18-20 boxes are used (more diesels, radars, etc.).

# If we make the systems grid a complete 4x5 matrix:
# 4 cols x 5 rows = 20 boxes, every single system box of every submarine is covered!
