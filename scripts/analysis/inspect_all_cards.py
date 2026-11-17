import cv2
import numpy as np
import glob

# Let's inspect all 18 cards!
# Where is the submarine drawing on each?
# Where are the patrol tracks, damage tracks, etc.?

# Let's write a script that crops the central area of each of the 18 cards:
# y: 10% to 40%, x: 15% to 70%
# This is where the submarine silhouette is located.

crops = []
names = [
    "00: Type C.3",
    "01: Type A Midget",
    "02: Type A",
    "03: Sen-Toku",
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
    "15: Kirai-Sen",
    "16: Kaidai KD.5",
    "17: Junsen J.2"
]

for idx in range(18):
    if idx < 17:
        im = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    else:
        im = cv2.imread("junsen_j2.png")
    im = cv2.resize(im, (600, 450))
    # Let's crop the whole card scaled to 300x225
    small = cv2.resize(im, (300, 225))
    cv2.putText(small, names[idx], (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
    crops.append(small)

# Create 3 images with 6 cards each so we can clearly see ALL 18 cards
for set_idx in range(3):
    row1 = np.hstack(crops[set_idx*6 : set_idx*6 + 3])
    row2 = np.hstack(crops[set_idx*6 + 3 : set_idx*6 + 6])
    full_set = np.vstack([row1, row2])
    cv2.imwrite(f"cards_set_{set_idx+1}.jpg", full_set)

print("Saved cards_set_1.jpg, cards_set_2.jpg, cards_set_3.jpg")
