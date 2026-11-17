import cv2
import numpy as np
import glob

# Let's inspect the Damage Tracks across all 17 fleet submarine cards!
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
    {"id": "kiraisen", "idx": 15, "name": "Kirai-Sen", "file": "photos/thumb_15.jpg"},
    {"id": "kd5", "idx": 16, "name": "Kaidai KD. 5", "file": "photos/thumb_16.jpg"}
]

# Let's crop the Damage Tracks region of each of the 17 cards:
# In 525x408 space:
# Damage tracks are roughly y in [180, 280], x in [30, 360]

crops = []
for s in subs:
    im = cv2.imread(s['file'])
    im_std = cv2.resize(im, (525, 408))
    # Damage area
    dmg_area = im_std[180:280, 30:350]
    dmg_res = cv2.resize(dmg_area, (250, 75))
    cv2.putText(dmg_res, s['name'], (5, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 0, 255), 1)
    crops.append(dmg_res)

# Save collage of damage tracks
blank = np.zeros_like(crops[0])
r1 = np.hstack(crops[0:3])
r2 = np.hstack(crops[3:6])
r3 = np.hstack(crops[6:9])
r4 = np.hstack(crops[9:12])
r5 = np.hstack(crops[12:15])
r6 = np.hstack(crops[15:17] + [blank])

collage = np.vstack([r1, r2, r3, r4, r5, r6])
cv2.imwrite("damage_tracks_all_17.jpg", collage)
print("Saved damage_tracks_all_17.jpg")
