import cv2
import numpy as np

midget = cv2.imread("photos/thumb_01.jpg")
h, w = midget.shape[:2]

# Let's crop:
# 1. Top half
cv2.imwrite("midget_top.jpg", midget[0:int(h*0.5), :])
# 2. Bottom half
cv2.imwrite("midget_bottom.jpg", midget[int(h*0.5):, :])
# 3. Submarine drawing area in J2 vs Midget
# In J2, submarine drawing is at y in [60, 118], x in [100, 328]
print(f"Midget original dimensions: {w}x{h}")
