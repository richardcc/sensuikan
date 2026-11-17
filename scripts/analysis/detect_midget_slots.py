import cv2
import numpy as np

# Let's inspect all boxes on Midget in detail:
# Where are all the boxes on Midget?
m = cv2.imread("photos/thumb_01.jpg")
h, w = m.shape[:2]

# Let's resize Midget to (525, 408) - exactly 280x170 mm space:
m_std = cv2.resize(m, (525, 408))

# Let's detect all boxes on Midget
gray = cv2.cvtColor(m_std, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in cnts:
    x, y, bw, bh = cv2.boundingRect(c)
    if 18 <= bw <= 45 and 18 <= bh <= 45:
        boxes.append((x, y, bw, bh))

print(f"Total counter slots on Midget (std space): {len(boxes)}")
boxes = sorted(boxes, key=lambda b: (round(b[1]/20)*20, b[0]))
for b in boxes:
    print(f"  x={b[0]:3d}, y={b[1]:3d}, w={b[2]:2d}, h={b[3]:2d}")
