import cv2
import numpy as np

# Let's inspect the Damage Tracks on several cards:
# 1. Junsen J.2 (or thumb_06: Type B)
# 2. Kaidai KD.3 (thumb_12)
# 3. Kaidai KD.7 (thumb_14)
# 4. Type C (thumb_08)
# 5. Sen-Toku (thumb_03)

for idx, name in [(17, "Junsen_J2"), (12, "Kaidai_KD3"), (14, "Kaidai_KD7"), (8, "Type_C"), (3, "Sen_Toku"), (6, "Type_B")]:
    if idx == 17:
        im = cv2.imread("junsen_j2.png")
    else:
        im = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    h, w = im.shape[:2]
    # Crop the damage tracks and surroundings: y: 40% to 75%, x: 0% to 75%
    dmg = im[int(h*0.42):int(h*0.75), 0:int(w*0.75)]
    cv2.imwrite(f"dmg_{name}.jpg", dmg)

print("Saved detailed damage track crops")
