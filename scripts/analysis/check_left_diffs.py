import cv2
import numpy as np

j2_l = cv2.imread("full_left_j2.jpg")
kd3_l = cv2.imread("full_left_kd3.jpg")

# Let's inspect where elements are on kd3_l:
# 1. Base / Mission / Port:
#    In J2: x in [22, 50], y in [57, 85], [105, 133], [140, 168]
# 2. Patrol track:
#    In J2: y in [134, 163]
#    In KD3: where is patrol track?
# 3. Damage tracks:
#    In J2: y in [214, 271]
#    In KD3: where is damage tracks?
# 4. Crew status:
#    In J2: y in [331, 389]
#    In KD3: where is crew status?

# Let's detect all boxes in both images and list their Y ranges!
for name, im in [("Junsen J.2", j2_l), ("Kaidai KD.3", kd3_l)]:
    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 18 <= w <= 40 and 18 <= h <= 40:
            boxes.append((x, y, w, h))
    boxes = sorted(boxes, key=lambda b: (round(b[1]/15)*15, b[0]))
    clean = []
    for b in boxes:
        if not any(abs(b[0] - cb[0]) < 8 and abs(b[1] - cb[1]) < 8 for cb in clean):
            clean.append(b)
            
    print(f"=== {name} ({len(clean)} boxes on left) ===")
    rows = {}
    for b in clean:
        ry = round(b[1]/12)*12
        rows[ry] = rows.get(ry, []) + [b]
    for ry, b_list in sorted(rows.items()):
        print(f"  y~{ry:3d} ({len(b_list)} boxes): x={[b[0] for b in b_list]}")
