import cv2
import numpy as np

# Let's map each of the 17 fleet submarine cards
# Index mapping:
subs = [
    {"id": "j2", "idx": 17, "name": "Junsen J. 2", "file": "junsen_j2.png"},
    {"id": "c3", "idx": 0, "name": "Type C. 3", "file": "photos/thumb_00.jpg"},
    {"id": "type_a", "idx": 2, "name": "Type A", "file": "photos/thumb_02.jpg"},
    {"id": "sentoku", "idx": 3, "name": "Sen-Toku (I-400)", "file": "photos/thumb_03.jpg"},
    {"id": "j1m", "idx": 4, "name": "Junsen J. 1M", "file": "photos/thumb_04.jpg"},
    {"id": "type_a_mod", "idx": 5, "name": "Type A Modified", "file": "photos/thumb_05.jpg"},
    {"id": "type_b", "idx": 6, "name": "Type B", "file": "photos/thumb_06.jpg"},
    {"id": "type_b3", "idx": 7, "name": "Type B. 3", "file": "photos/thumb_07.jpg"},
    {"id": "type_c", "idx": 8, "name": "Type C", "file": "photos/thumb_08.jpg"},
    {"id": "kd6", "idx": 9, "name": "Kaidai KD. 6", "file": "photos/thumb_09.jpg"},
    {"id": "sentaka", "idx": 10, "name": "Sen-Taka", "file": "photos/thumb_10.jpg"},
    {"id": "j3", "idx": 11, "name": "Junsen J. 3", "file": "photos/thumb_11.jpg"},
    {"id": "kd3", "idx": 12, "name": "Kaidai KD. 3", "file": "photos/thumb_12.jpg"},
    {"id": "kd4", "idx": 13, "name": "Kaidai KD. 4", "file": "photos/thumb_13.jpg"},
    {"id": "kd7", "idx": 14, "name": "Kaidai KD. 7", "file": "photos/thumb_14.jpg"},
    {"id": "kiraisen", "idx": 15, "name": "Kirai-Sen (Minelayer)", "file": "photos/thumb_15.jpg"},
    {"id": "kd5", "idx": 16, "name": "Kaidai KD. 5", "file": "photos/thumb_16.jpg"}
]

print(f"Total fleet submarines: {len(subs)}")

# Let's save a clean crop of Pieza 2 (Top-Right) and Pieza 3 (Bottom-Right) for EVERY one of the 17 subs!
# In 525x408 space:
# Pieza 2: x in [355, 525], y in [0, 186]
# Pieza 3: x in [355, 525], y in [186, 408]

for s in subs:
    im = cv2.imread(s['file'])
    im_std = cv2.resize(im, (525, 408))
    
    p2_crop = im_std[0:186, 355:]
    p3_crop = im_std[186:, 355:]
    
    cv2.imwrite(f"photos/sub_{s['id']}_p2.png", p2_crop)
    cv2.imwrite(f"photos/sub_{s['id']}_p3.png", p3_crop)

print("Saved individual Pieza 2 and Pieza 3 crops for all 17 submarines.")
