import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")

# In two_layouts_photo.jpg:
# Let's crop from Deck Gun down to the bottom for both cards:
# Left card Deck gun to bottom:
# Right card Deck gun to bottom:

# Let's detect the boxes on both sides:
# Left card: x in [80, 360], y in [450, 780]
# Right card: x in [420, 680], y in [450, 780]

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)

cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes_left = []
boxes_right = []
for c in cnts:
    x, y, w, h = cv2.boundingRect(c)
    if 18 <= w <= 50 and 18 <= h <= 50:
        if 80 <= x <= 360 and y >= 250:
            boxes_left.append((x, y, w, h))
        elif 420 <= x <= 680 and y >= 250:
            boxes_right.append((x, y, w, h))

print(f"Boxes found in Left Card: {len(boxes_left)}")
print(f"Boxes found in Right Card: {len(boxes_right)}")

# Let's cluster by Y
def cluster_y(boxes):
    rows = {}
    for b in sorted(boxes, key=lambda b: b[1]):
        found = False
        for ry in rows:
            if abs(b[1] - ry) < 12:
                rows[ry].append(b)
                found = True
                break
        if not found:
            rows[b[1]] = [b]
    return rows

rows_l = cluster_y(boxes_left)
rows_r = cluster_y(boxes_right)

print("\n--- LEFT CARD ROWS ---")
for ry, b_list in sorted(rows_l.items()):
    print(f"  y={ry:3d} ({len(b_list)} boxes): x={[b[0] for b in b_list]}")

print("\n--- RIGHT CARD ROWS ---")
for ry, b_list in sorted(rows_r.items()):
    print(f"  y={ry:3d} ({len(b_list)} boxes): x={[b[0] for b in b_list]}")
