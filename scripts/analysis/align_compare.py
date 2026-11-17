import cv2
import numpy as np

# Let's inspect the right side sections across the 18 classes:
# 1. Torpedo Tubes & Reloads:
#    - Where are they located?
# 2. Guns & Kaiten:
#    - Where are they?
# 3. Aircraft:
#    - Sen-Toku (03) has 3 aircraft (Seiran 1, 2, 3). Junsen J.2 has 1 aircraft. Type B has 1 aircraft. Type C has Kaiten.
# 4. Systems:
#    - Let's check how many rows/cols of systems exist across all 18.

# Let's write an analysis script that compares the right side of Junsen J.2 with:
# - Sen-Toku (03)
# - Type C.3 (00)
# - Kaidai KD.6 (09)
# - Kirai-Sen (15)
# - Type A Midget (01)

j2 = cv2.imread("junsen_j2.png")
sentoku = cv2.imread("photos/thumb_03.jpg")
type_c3 = cv2.imread("photos/thumb_00.jpg")
kaidai = cv2.imread("photos/thumb_09.jpg")
kiraisen = cv2.imread("photos/thumb_15.jpg")
midget = cv2.imread("photos/thumb_01.jpg")

# Let's resize all to (525, 408) - exactly standard size of junsen_j2
h_std, w_std = 408, 525

for name, img in [("SenToku", sentoku), ("TypeC3", type_c3), ("Kaidai", kaidai), ("KiraiSen", kiraisen), ("Midget", midget)]:
    resized = cv2.resize(img, (w_std, h_std))
    # Right half comparison with j2
    diff = cv2.absdiff(j2[:, 320:], resized[:, 320:])
    # create side by side
    comp = np.hstack([j2[:, 320:], resized[:, 320:]])
    cv2.imwrite(f"compare_right_{name}.png", comp)

print("Saved compare_right_*.png")
