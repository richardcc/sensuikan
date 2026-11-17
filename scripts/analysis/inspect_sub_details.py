import cv2
import numpy as np

# Let's inspect the specific features of each of the 17 submarines
subs = [
    {"id": "j2", "name": "Junsen J. 2", "file": "junsen_j2.png"},
    {"id": "c3", "name": "Type C. 3", "file": "photos/thumb_00.jpg"},
    {"id": "type_a", "name": "Type A", "file": "photos/thumb_02.jpg"},
    {"id": "sentoku", "name": "Sen-Toku (I-400)", "file": "photos/thumb_03.jpg"},
    {"id": "j1m", "name": "Junsen J. 1M", "file": "photos/thumb_04.jpg"},
    {"id": "type_a_mod", "name": "Type A Modified", "file": "photos/thumb_05.jpg"},
    {"id": "type_b", "name": "Type B", "file": "photos/thumb_06.jpg"},
    {"id": "type_b3", "name": "Type B. 3", "file": "photos/thumb_07.jpg"},
    {"id": "type_c", "name": "Type C", "file": "photos/thumb_08.jpg"},
    {"id": "kd6", "name": "Kaidai KD. 6", "file": "photos/thumb_09.jpg"},
    {"id": "sentaka", "name": "Sen-Taka", "file": "photos/thumb_10.jpg"},
    {"id": "j3", "name": "Junsen J. 3", "file": "photos/thumb_11.jpg"},
    {"id": "kd3", "name": "Kaidai KD. 3", "file": "photos/thumb_12.jpg"},
    {"id": "kd4", "name": "Kaidai KD. 4", "file": "photos/thumb_13.jpg"},
    {"id": "kd7", "name": "Kaidai KD. 7", "file": "photos/thumb_14.jpg"},
    {"id": "kiraisen", "name": "Kirai-Sen", "file": "photos/thumb_15.jpg"},
    {"id": "kd5", "name": "Kaidai KD. 5", "file": "photos/thumb_16.jpg"}
]

# For each submarine, inspect:
# 1. P2 aircraft boxes (y in [15, 45])
# 2. P2 torpedo boxes (y in [50, 115])
# 3. P3 kaiten boxes (y in [190, 240])
# 4. P3 crane/hangar vs systems (y in [235, 275])

report = []
for s in subs:
    im = cv2.imread(s['file'])
    im_std = cv2.resize(im, (525, 408))
    gray = cv2.cvtColor(im_std, cv2.COLOR_BGR2GRAY)
    
    # Aircraft area: y in [15, 50], x in [375, 505]
    ac_area = gray[15:50, 375:505]
    # Torpedo tubes: y in [50, 115], x in [375, 505]
    tt_area = gray[50:115, 375:505]
    # Guns / Kaiten area: y in [185, 240], x in [375, 505]
    gk_area = gray[185:240, 375:505]
    # Systems area: y in [240, 390], x in [375, 505]
    sys_area = gray[240:390, 375:505]
    
    report.append({
        "name": s['name'],
        "id": s['id']
    })

print("Submarine detailed inspection script ready.")
