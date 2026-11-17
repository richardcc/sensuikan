import cv2
import numpy as np

# Let's inspect right side layout characteristics
# We can make a collage of right sides with labels
right_imgs = []
names = [
    "00: Type C.3 (Kaiten)",
    "01: Type A Midget",
    "02: Type A",
    "03: Sen-Toku (I-400)",
    "04: Junsen J.1M",
    "05: Type A Mod",
    "06: Type B",
    "07: Type B.3",
    "08: Type C",
    "09: Kaidai KD.6",
    "10: Sen-Taka",
    "11: Junsen J.3",
    "12: Kaidai KD.3",
    "13: Kaidai KD.4",
    "14: Kaidai KD.7",
    "15: Kirai-Sen (Mine)",
    "16: Kaidai KD.5",
    "17: Junsen J.2"
]

for idx in range(17):
    img = cv2.imread(f"photos/right_detail_{idx:02d}.png")
    img = cv2.resize(img, (240, 360))
    cv2.putText(img, names[idx], (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
    right_imgs.append(img)

j2_img = cv2.imread("photos/right_detail_17_j2.png")
j2_img = cv2.resize(j2_img, (240, 360))
cv2.putText(j2_img, names[17], (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
right_imgs.append(j2_img)

# 3 rows of 6
row1 = np.hstack(right_imgs[0:6])
row2 = np.hstack(right_imgs[6:12])
row3 = np.hstack(right_imgs[12:18])
grid = np.vstack([row1, row2, row3])
cv2.imwrite("right_comparison_grid.jpg", grid)
print("Saved right_comparison_grid.jpg")
