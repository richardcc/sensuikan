import cv2
import numpy as np

m = cv2.imread("photos/thumb_01.jpg")
m_std = cv2.resize(m, (525, 408))
gray = cv2.cvtColor(m_std, cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

vis = m_std.copy()
midget_slots = []
for c in cnts:
    x, y, w, h = cv2.boundingRect(c)
    # Counter boxes in 525x408 are ~24 to 29 px
    if 21 <= w <= 32 and 21 <= h <= 32:
        midget_slots.append((x, y, w, h))
        cv2.rectangle(vis, (x, y), (x+w, y+h), (0, 0, 255), 2)

print(f"Midget counter slots found: {len(midget_slots)}")
# Filter out overlapping/duplicate boxes
clean_slots = []
for b in sorted(midget_slots, key=lambda b: (b[1], b[0])):
    duplicate = False
    for cb in clean_slots:
        if abs(b[0] - cb[0]) < 8 and abs(b[1] - cb[1]) < 8:
            duplicate = True
            break
    if not duplicate:
        clean_slots.append(b)

print(f"Clean unique slots: {len(clean_slots)}")
for b in clean_slots:
    print(f"  x={b[0]:3d}, y={b[1]:3d}, w={b[2]:2d}, h={b[3]:2d}")
    cv2.rectangle(vis, (b[0], b[1]), (b[0]+b[2], b[1]+b[3]), (0, 255, 0), 2)

cv2.imwrite("midget_detected_slots.jpg", vis)
