import cv2
import numpy as np

# In full_middle_KD3.jpg:
# Let's inspect where the Damage Track is located relative to Deck Gun:
kd3_mid = cv2.imread("full_middle_KD3.jpg")
j2_mid = cv2.imread("junsen_j2.png")
h_j2, w_j2 = j2_mid.shape[:2]
j2_mid_crop = j2_mid[int(h_j2*0.35):int(h_j2*0.75), :]

# Resize both to exact standard size: 600 x 200 px
kd3_res = cv2.resize(kd3_mid, (600, 200))
j2_res = cv2.resize(j2_mid_crop, (600, 200))

# Save side by side
cv2.imwrite("compare_damage_layout_j2_vs_kd3.jpg", np.vstack([j2_res, kd3_res]))
print("Saved compare_damage_layout_j2_vs_kd3.jpg")
