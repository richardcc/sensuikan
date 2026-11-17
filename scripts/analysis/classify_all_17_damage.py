import cv2
import numpy as np

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

# For each card, check the y position of the Flooding damage track:
# Test whether boxes exist at y in [180, 205] (Layout 2 - Alto) or y in [210, 235] (Layout 1 - Bajo)
print("=== CLASSIFYING ALL 17 SUBMARINES BY DAMAGE TRACK LAYOUT ===")

dmg_classes = {}
for s in subs:
    im = cv2.imread(s['file'])
    im_std = cv2.resize(im, (525, 408))
    gray = cv2.cvtColor(im_std, cv2.COLOR_BGR2GRAY)
    
    # Area 1: y in [180, 205], x in [80, 320] (Layout 2 Alto)
    a_high = gray[180:205, 80:320]
    # Area 2: y in [210, 235], x in [40, 280] (Layout 1 Bajo)
    a_low = gray[210:235, 40:280]
    
    # Check edges / contours in high vs low
    t_high = cv2.adaptiveThreshold(a_high, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts_h, _ = cv2.findContours(t_high, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    box_h = sum(1 for c in cnts_h if 18 <= cv2.boundingRect(c)[2] <= 35 and 18 <= cv2.boundingRect(c)[3] <= 35)
    
    t_low = cv2.adaptiveThreshold(a_low, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts_l, _ = cv2.findContours(t_low, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    box_l = sum(1 for c in cnts_l if 18 <= cv2.boundingRect(c)[2] <= 35 and 18 <= cv2.boundingRect(c)[3] <= 35)
    
    # Also check if SUNK is near y=60 (High) or y=85 (Low) in the damage crop
    # In J2, it's Low. In KD3, it's High.
    # Let's save a crop for visual confirmation
    crop = im_std[170:270, 30:350]
    
    is_high = box_h > box_l or box_h >= 4
    layout_name = "Damage Layout 2 (Alto, y~192)" if is_high else "Damage Layout 1 (Bajo, y~216)"
    dmg_classes[s['name']] = layout_name
    print(f"  {s['name']:25s} -> {layout_name} (high_boxes={box_h}, low_boxes={box_l})")

print("Classification completed.")
