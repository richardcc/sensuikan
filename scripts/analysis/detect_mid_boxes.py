import cv2
import numpy as np

for name, fname in [("Type C.3", "c3_mid_crop.png"), ("Kirai-Sen", "kirai_mid_crop.png"), ("Midget", "midget_mid_crop.png")]:
    img = cv2.imread(fname)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    print(f"=== {name} ===")
    boxes = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if 18 <= w <= 50 and 18 <= h <= 50:
            boxes.append((x + 360, y + 110, w, h))
    boxes = sorted(boxes, key=lambda b: (round(b[1]/15)*15, b[0]))
    for b in boxes:
        print(f"  x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
