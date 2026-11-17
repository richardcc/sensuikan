import cv2
import numpy as np

# Let's count how many boxes are in the Flooding and Hull damage tracks for every single one of the 17 cards!
subs = [
    {"id": "j2", "idx": 17, "name": "Junsen J. 2", "file": "junsen_j2.png"},
    {"id": "c3", "idx": 0, "name": "Type C. 3", "file": "photos/thumb_00.jpg"},
    {"id": "type_a", "idx": 2, "name": "Type A", "file": "photos/thumb_02.jpg"},
    {"id": "sentoku", "idx": 3, "name": "Sen-Toku (I-400)", "file": "photos/thumb_03.jpg"},
    {"id": "j1m", "idx": 4, "name": "Junsen J. 1M", "file": "photos/thumb_04.jpg"},
    {"id": "type_a_mod", "idx": 5, "name": "Type A Modified", "file": "photos/thumb_05.jpg"},
    {"id": "type_b", "idx": 6, "name": "Type B", "file": "photos/thumb_06.jpg"},
    {"id": "type_b3", "idx": 7, "name": "Type B. 3", "file": "photos/thumb_07.jpg"},
    {"id": "type_c", "idx": 8, "name": "Type C", "file": "photos/thumb_08.jpg"},
    {"id": "kd6", "idx": 9, "name": "Kaidai KD. 6", "file": "photos/thumb_09.jpg"},
    {"id": "sentaka", "idx": 10, "name": "Sen-Taka", "file": "photos/thumb_10.jpg"},
    {"id": "j3", "idx": 11, "name": "Junsen J. 3", "file": "photos/thumb_11.jpg"},
    {"id": "kd3", "idx": 12, "name": "Kaidai KD. 3", "file": "photos/thumb_12.jpg"},
    {"id": "kd4", "idx": 13, "name": "Kaidai KD. 4", "file": "photos/thumb_13.jpg"},
    {"id": "kd7", "idx": 14, "name": "Kaidai KD. 7", "file": "photos/thumb_14.jpg"},
    {"id": "kiraisen", "idx": 15, "name": "Kirai-Sen", "file": "photos/thumb_15.jpg"},
    {"id": "kd5", "idx": 16, "name": "Kaidai KD. 5", "file": "photos/thumb_16.jpg"}
]

print("=== DAMAGE TRACK BOX COUNTS ACROSS ALL 17 SUBMARINES ===")
for s in subs:
    im = cv2.imread(s['file'])
    im_std = cv2.resize(im, (525, 408))
    # Area around damage track: y in [190, 275], x in [20, 360]
    dmg_area = im_std[190:275, 20:360]
    gray = cv2.cvtColor(dmg_area, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    # filter square boxes
    boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 18 <= w <= 36 and 18 <= h <= 36:
            boxes.append((x, y, w, h))
            
    clean = []
    for b in sorted(boxes, key=lambda b: b[0]):
        if not any(abs(b[0] - cb[0]) < 8 and abs(b[1] - cb[1]) < 8 for cb in clean):
            clean.append(b)
            
    # split into top row (flooding) and bottom row (hull)
    # y < 40 is top row, y >= 40 is bottom row
    top_row = [b for b in clean if b[1] < 45]
    bot_row = [b for b in clean if b[1] >= 45]
    
    print(f"  {s['name']:25s} -> Flooding boxes: {len(top_row):2d} | Hull boxes: {len(bot_row):2d} | Total: {len(clean):2d}")
