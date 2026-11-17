import cv2
import numpy as np

# Let's inspect the layout similarity of all 18 cards against Junsen J.2:
# For each card, let's check:
# 1. Does it have the standard Patrol Track at y in [120, 160], x in [90, 340]?
# 2. Does it have the Damage Tracks at y in [200, 260], x in [40, 340]?
# 3. Does it have Crew at y in [320, 380], x in [20, 340]?

# Let's write a script to check where boxes are on each of the 18 cards:
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

j2 = cv2.imread("junsen_j2.png")
h_std, w_std = 408, 525

print("ANALYSIS OF ALL 18 CARDS:")
for i in range(18):
    if i < 17:
        im = cv2.imread(f"photos/thumb_{i:02d}.jpg")
    else:
        im = cv2.imread("junsen_j2.png")
    im = cv2.resize(im, (w_std, h_std))
    
    # Check left side boxes (x < 340)
    gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray[:, :340], 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    # Count boxes in patrol track area (y in [120, 160], x in [80, 330])
    patrol_cnt = 0
    damage_cnt = 0
    crew_cnt = 0
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 18 <= w <= 36 and 18 <= h <= 36:
            if 115 <= y <= 165 and 80 <= x <= 330:
                patrol_cnt += 1
            elif 200 <= y <= 270 and 35 <= x <= 330:
                damage_cnt += 1
            elif 310 <= y <= 380 and 15 <= x <= 330:
                crew_cnt += 1
                
    print(f"Card {i:02d} ({titles[i]:25s}): Patrol boxes={patrol_cnt:2d}, Damage boxes={damage_cnt:2d}, Crew boxes={crew_cnt:2d}")
