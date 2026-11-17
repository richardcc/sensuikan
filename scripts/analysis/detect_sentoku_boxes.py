import cv2
import numpy as np

# Let's inspect the boxes in Sen-Toku (03)
sentoku = cv2.imread("photos/thumb_03.jpg")
sentoku = cv2.resize(sentoku, (525, 408))
gray = cv2.cvtColor(sentoku, cv2.COLOR_BGR2GRAY)

right_gray = gray[:, 340:]
thresh = cv2.adaptiveThreshold(right_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in contours:
    x, y, w, h = cv2.boundingRect(c)
    if 20 <= w <= 36 and 20 <= h <= 36:
        boxes.append((x + 340, y, w, h))

boxes = sorted(boxes, key=lambda b: (round(b[1]/20)*20, b[0]))
print(f"Sen-Toku detected {len(boxes)} boxes:")
for b in boxes:
    print(f"  x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
