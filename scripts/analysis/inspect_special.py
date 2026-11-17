import cv2
import numpy as np

# Let's inspect the actual photos for Midget, Kirai-Sen, Type C.3, Sen-Taka, Type B, Kaidai KD.6
files_to_inspect = [
    ("01_Midget", "photos/thumb_01.jpg"),
    ("15_KiraiSen", "photos/thumb_15.jpg"),
    ("00_Type_C3", "photos/thumb_00.jpg"),
    ("10_SenTaka", "photos/thumb_10.jpg"),
    ("06_Type_B", "photos/thumb_06.jpg"),
    ("09_Kaidai_KD6", "photos/thumb_09.jpg"),
    ("03_SenToku", "photos/thumb_03.jpg"),
    ("17_Junsen_J2", "junsen_j2.png")
]

imgs = []
for label, path in files_to_inspect:
    im = cv2.imread(path)
    im = cv2.resize(im, (600, 450))
    cv2.putText(im, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 2)
    imgs.append(im)

# Save 2x4 grid
row1 = np.hstack(imgs[0:4])
row2 = np.hstack(imgs[4:8])
grid = np.vstack([row1, row2])
cv2.imwrite("special_types_grid.jpg", grid)
print("Saved special_types_grid.jpg")
