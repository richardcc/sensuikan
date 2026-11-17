import cv2
import numpy as np
import json

# Let's map all elements of Type A Midget in standard 525x408 space (280x170 mm)
m = cv2.imread("photos/thumb_01.jpg")
m_std = cv2.resize(m, (525, 408))

# Save image with grid to pinpoint exact coordinates
vis = m_std.copy()
for x in range(0, 525, 25):
    cv2.line(vis, (x, 0), (x, 408), (0, 255, 0), 1)
    if x % 50 == 0:
        cv2.putText(vis, str(x), (x + 2, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 0), 1)

for y in range(0, 408, 25):
    cv2.line(vis, (0, y), (525, y), (0, 255, 0), 1)
    if y % 50 == 0:
        cv2.putText(vis, str(y), (2, y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 0), 1)

cv2.imwrite("midget_measured_grid.jpg", vis)
print("Saved midget_measured_grid.jpg")
