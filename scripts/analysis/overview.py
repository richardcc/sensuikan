import cv2
import numpy as np
import glob
import os

files = sorted(glob.glob("photos/thumb_*.jpg"))

# Let's crop the title and the right side of each image
# In 600x450 image:
# Left side is x: 0 to ~380
# Right side is x: 380 to 600
# Title is roughly y: 10 to 60, x: 150 to 350

crops = []
for idx, f in enumerate(files):
    img = cv2.imread(f)
    h, w, _ = img.shape
    # right half
    right_part = img[:, int(w*0.62):]
    title_part = img[int(h*0.03):int(h*0.14), int(w*0.25):int(w*0.55)]
    # resize right_part to 200x300
    r_small = cv2.resize(right_part, (200, 300))
    t_small = cv2.resize(title_part, (200, 60))
    card = np.vstack([t_small, r_small])
    # add text with index
    cv2.putText(card, f"#{idx:02d}", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    crops.append(card)

# Combine into a grid of 3x6 or 4x5
row1 = np.hstack(crops[0:6])
row2 = np.hstack(crops[6:12])
# remaining 5 + 1 blank
blank = np.zeros_like(crops[0])
row3 = np.hstack(crops[12:17] + [blank])

grid = np.vstack([row1, row2, row3])
cv2.imwrite("right_sides_overview.jpg", grid)
print("Saved right_sides_overview.jpg")
