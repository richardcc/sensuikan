import cv2
import numpy as np

# Let's inspect all boxes in KD3
im = cv2.imread("photos/thumb_12.jpg")
h, w = im.shape[:2]

# Let's detect all boxes in KD3 that are between y: 40% and 75%
crop = im[int(h*0.40):int(h*0.75), :]
gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in cnts:
    x, y, bw, bh = cv2.boundingRect(c)
    if 18 <= bw <= 45 and 18 <= bh <= 45:
        boxes.append((x, y, bw, bh))

print(f"Boxes found in KD3 mid section: {len(boxes)}")
boxes = sorted(boxes, key=lambda b: (round(b[1]/20)*20, b[0]))
clean = []
for b in boxes:
    if not any(abs(b[0] - cb[0]) < 8 and abs(b[1] - cb[1]) < 8 for cb in clean):
        clean.append(b)

for b in clean:
    print(f"  x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
