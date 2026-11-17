import cv2
import numpy as np

# Let's inspect thumb_01.jpg (Type A Midget Ko-Hyoteki)
midget = cv2.imread("photos/thumb_01.jpg")
j2 = cv2.imread("junsen_j2.png")

# Let's inspect where the drawing is in Midget:
# Let's find contours in Midget vs J2:
gray = cv2.cvtColor(midget, cv2.COLOR_BGR2GRAY)
# Let's print out what text and boxes are in Midget
# Let's save a clean full resolution image of Midget with a grid
h, w = midget.shape[:2]
m_annotated = midget.copy()

# draw grid lines every 50 px
for y in range(0, h, 50):
    cv2.line(m_annotated, (0, y), (w, y), (0, 255, 0), 1)
    cv2.putText(m_annotated, str(y), (5, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)
for x in range(0, w, 50):
    cv2.line(m_annotated, (x, 0), (x, h), (0, 255, 0), 1)
    cv2.putText(m_annotated, str(x), (x + 2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

cv2.imwrite("midget_grid.jpg", m_annotated)
print("Saved midget_grid.jpg")
