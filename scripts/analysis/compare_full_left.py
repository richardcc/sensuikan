import cv2
import numpy as np

j2 = cv2.imread("junsen_j2.png")
kd3 = cv2.imread("photos/thumb_12.jpg")

# Resize both to exact standard 525x408 space:
j2_std = cv2.resize(j2, (525, 408))
kd3_std = cv2.resize(kd3, (525, 408))

# Crop left half: x in [0, 360]
j2_left = j2_std[:, 0:360]
kd3_left = kd3_std[:, 0:360]

cv2.imwrite("full_left_j2.jpg", j2_left)
cv2.imwrite("full_left_kd3.jpg", kd3_left)

# Side-by-side
comp = np.hstack([j2_left, kd3_left])
cv2.imwrite("compare_full_left_j2_vs_kd3.jpg", comp)
print("Saved compare_full_left_j2_vs_kd3.jpg")
