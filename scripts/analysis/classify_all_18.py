import cv2
import numpy as np

# Let's inspect each of the 18 cards and print:
# - Title
# - Silhouette/Drawing location and size
# - Patrol track location and length
# - Damage tracks
# - Right half layout

# Let's write a script to inspect which cards are Fleet Submarines, and which cards are different!
titles = [
    "Type C. 3",               # 00
    "Type A Midget Ko-Hyoteki", # 01
    "Type A",                  # 02
    "Sen-Toku (I-400)",        # 03
    "Junsen J. 1M",            # 04
    "Type A Modified",         # 05
    "Type B",                  # 06
    "Type B. 3",               # 07
    "Type C",                  # 08
    "Kaidai KD. 6",            # 09
    "Sen-Taka",                # 10
    "Junsen J. 3",             # 11
    "Kaidai KD. 3",            # 12
    "Kaidai KD. 4",            # 13
    "Kaidai KD. 7",            # 14
    "Kirai-Sen",               # 15
    "Kaidai KD. 5",            # 16
    "Junsen J. 2"              # 17
]

# Let's compare each card with Junsen J.2 by computing difference in the left half and right half
j2 = cv2.imread("junsen_j2.png")
j2 = cv2.resize(j2, (600, 450))

print("Comparing each card with Junsen J.2 standard layout:")
for i in range(17):
    im = cv2.imread(f"photos/thumb_{i:02d}.jpg")
    im = cv2.resize(im, (600, 450))
    # Let's check similarity in the silhouette area: y in [60, 130], x in [100, 360]
    # And check similarity in patrol track: y in [130, 180]
    # Let's save a thumbnail of each card's center area:
    center_area = im[50:200, 80:380]
    cv2.imwrite(f"photos/center_{i:02d}.jpg", center_area)

print("Saved center areas")
