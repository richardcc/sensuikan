import cv2
import numpy as np

# Let's inspect what boxes are detected on Midget across the whole card!
midget = cv2.imread("photos/thumb_01.jpg")
h, w = midget.shape[:2]
gray = cv2.cvtColor(midget, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in contours:
    x, y, bw, bh = cv2.boundingRect(c)
    if 18 <= bw <= 60 and 18 <= bh <= 60:
        boxes.append((x, y, bw, bh))

print(f"Total candidate boxes found on Midget: {len(boxes)}")
boxes = sorted(boxes, key=lambda b: (round(b[1]/20)*20, b[0]))
for b in boxes:
    print(f"  x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
