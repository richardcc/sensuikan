import cv2
import numpy as np
import json

# Let's inspect the positions of all boxes detected in Class 03 (Sen-Toku), Class 17 (Junsen J.2), Class 06 (Type B), etc.
# We will draw a density / heat map of box centers across all 18 classes!

w_std, h_std = 525, 408
density_map = np.zeros((h_std, w_std), dtype=np.float32)

all_class_boxes = []

for idx in range(18):
    if idx < 17:
        img = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    else:
        img = cv2.imread("junsen_j2.png")
    
    img = cv2.resize(img, (w_std, h_std))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    right_gray = gray[:, 340:]
    thresh = cv2.adaptiveThreshold(right_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    boxes = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if 20 <= w <= 36 and 20 <= h <= 36:
            cx = x + 340 + w // 2
            cy = y + h // 2
            boxes.append((cx, cy))
            density_map[max(0, cy-5):min(h_std, cy+5), max(0, cx-5):min(w_std, cx+5)] += 1.0
            
    all_class_boxes.append(boxes)

# Save density map visualization
density_vis = cv2.normalize(density_map, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
density_color = cv2.applyColorMap(density_vis, cv2.COLORMAP_JET)

# Overlay on top of Junsen J.2
j2 = cv2.imread("junsen_j2.png")
blended = cv2.addWeighted(j2, 0.6, density_color, 0.4, 0)
cv2.imwrite("box_density_heatmap.png", blended)
print("Saved box_density_heatmap.png")
