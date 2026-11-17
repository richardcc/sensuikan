import cv2
import numpy as np
import glob

# Let's inspect each photo.
# Let's see what is written or visible in each class right side.
# Let's save a mosaic with higher resolution (e.g. 500x700 per class right side)
# We can do 3 rows of 6:

tiles = []
for i in range(18):
    if i < 17:
        img = cv2.imread(f"photos/thumb_{i:02d}.jpg")
    else:
        img = cv2.imread("junsen_j2.png")
    h, w = img.shape[:2]
    # Crop right 40%
    r = img[:, int(w*0.60):]
    r = cv2.resize(r, (300, 420))
    tiles.append(r)

# Let's save in 3 sets of 6
set1 = np.hstack(tiles[0:6])
set2 = np.hstack(tiles[6:12])
set3 = np.hstack(tiles[12:18])

cv2.imwrite("right_set_1.jpg", set1)
cv2.imwrite("right_set_2.jpg", set2)
cv2.imwrite("right_set_3.jpg", set3)
print("Saved right sets")
