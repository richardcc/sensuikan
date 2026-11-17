import cv2
import numpy as np

for name, fname in [("Type A Mod (Option 2)", "c2_right.png"), ("Sen-Toku (Option 3)", "c3_right.png")]:
    img = cv2.imread(fname)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"=== {name} ===")
    boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 25 <= w <= 55 and 25 <= h <= 65:
            boxes.append((x + 500, y, w, h))
            
    boxes = sorted(boxes, key=lambda b: b[0])
    # remove overlapping
    clean = []
    for b in boxes:
        if not any(abs(b[0] - cb[0]) < 10 for cb in clean):
            clean.append(b)
            
    for b in clean:
        print(f"  Box at x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
