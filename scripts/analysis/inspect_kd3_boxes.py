import cv2
import numpy as np

# Let's inspect view_KD3_dmg.jpg
im = cv2.imread("view_KD3_dmg.jpg")
# Where are the Flooding and Hull boxes in KD3?
# Let's find contours and print their bounding boxes
gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in cnts:
    x, y, w, h = cv2.boundingRect(c)
    if 25 <= w <= 65 and 25 <= h <= 65:
        boxes.append((x, y, w, h))

boxes = sorted(boxes, key=lambda b: (round(b[1]/30)*30, b[0]))
clean = []
for b in boxes:
    if not any(abs(b[0] - cb[0]) < 12 and abs(b[1] - cb[1]) < 12 for cb in clean):
        clean.append(b)

print(f"KD3 boxes found: {len(clean)}")
for b in clean:
    print(f"  x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
