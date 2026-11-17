import cv2
import numpy as np
import glob

# Detect bounding boxes on the right side of each normalized sheet
w_std, h_std = 525, 408

for idx in range(18):
    if idx < 17:
        img = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    else:
        img = cv2.imread("junsen_j2.png")
    
    img = cv2.resize(img, (w_std, h_std))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # We focus on the right side: x > 340
    right_gray = gray[:, 340:]
    # edges / threshold
    thresh = cv2.adaptiveThreshold(right_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    boxes = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        # Counter boxes are roughly 22-32 px wide and 22-32 px high
        if 20 <= w <= 36 and 20 <= h <= 36:
            boxes.append((x + 340, y, w, h))
            
    print(f"Class {idx:02d}: found {len(boxes)} counter-sized boxes on right side")
