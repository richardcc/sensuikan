import cv2
import numpy as np

# Let's inspect the boxes in each damage track:
for name in ["Junsen_J2", "Kaidai_KD3", "Kaidai_KD7", "Type_C", "Sen_Toku", "Type_B"]:
    im = cv2.imread(f"dmg_{name}.jpg")
    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    # Filter boxes
    boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 18 <= w <= 45 and 18 <= h <= 45:
            boxes.append((x, y, w, h))
            
    # Group by row (y coordinate)
    # The damage tracks have 2 rows: Flooding (top) and Hull Damage (bottom)
    boxes = sorted(boxes, key=lambda b: (round(b[1]/20)*20, b[0]))
    clean = []
    for b in boxes:
        if not any(abs(b[0] - cb[0]) < 8 and abs(b[1] - cb[1]) < 8 for cb in clean):
            clean.append(b)
            
    # cluster by row
    rows = {}
    for b in clean:
        ry = round(b[1]/15)*15
        rows[ry] = rows.get(ry, []) + [b]
        
    print(f"=== {name} ===")
    for ry, b_list in sorted(rows.items()):
        print(f"  Row at y~{ry}: {len(b_list)} boxes (x from {b_list[0][0]} to {b_list[-1][0]})")
