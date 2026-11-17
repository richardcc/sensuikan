import cv2
import numpy as np

# In compare_damage_layout_j2_vs_kd3.jpg:
# Top is Junsen J.2, Bottom is Kaidai KD.3:
# Let's inspect:
# In Junsen J.2:
# Damage Tracks has: Flooding (10 boxes), Hull (10 boxes)
# Where does it start? Where does it end?
# In Kaidai KD.3:
# Damage Tracks has: Flooding, Hull
# Where does it start? Where does it end?
# Let's write an OCR / box detector to print their exact bounds:

img = cv2.imread("compare_damage_layout_j2_vs_kd3.jpg")
j2_part = img[:200, :]
kd3_part = img[200:, :]

# Let's detect boxes in j2_part:
# In j2_part, Damage Track is at y in [30, 90]:
# In kd3_part, where is Damage Track?
# Let's draw vertical lines across both every 50 px to see the horizontal shift:
vis = img.copy()
for x in range(0, 600, 25):
    cv2.line(vis, (x, 0), (x, 400), (0, 255, 0), 1)
    if x % 50 == 0:
        cv2.putText(vis, str(x), (x + 2, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)
        cv2.putText(vis, str(x), (x + 2, 215), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

cv2.imwrite("compare_damage_grid.jpg", vis)
print("Saved compare_damage_grid.jpg")
