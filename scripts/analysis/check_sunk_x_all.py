import cv2
import numpy as np

subs = [
    {"id": "j2", "name": "Junsen J. 2", "file": "junsen_j2.png"},
    {"id": "j1m", "name": "Junsen J. 1M", "file": "photos/thumb_04.jpg"},
    {"id": "j3", "name": "Junsen J. 3", "file": "photos/thumb_11.jpg"},
    {"id": "type_a", "name": "Type A", "file": "photos/thumb_02.jpg"},
    {"id": "type_a_mod", "name": "Type A Modified", "file": "photos/thumb_05.jpg"},
    {"id": "type_b", "name": "Type B", "file": "photos/thumb_06.jpg"},
    {"id": "type_b3", "name": "Type B. 3", "file": "photos/thumb_07.jpg"},
    {"id": "sentoku", "name": "Sen-Toku (I-400)", "file": "photos/thumb_03.jpg"},
    {"id": "type_c", "name": "Type C", "file": "photos/thumb_08.jpg"},
    {"id": "type_c3", "name": "Type C. 3", "file": "photos/thumb_00.jpg"},
    {"id": "kd3", "name": "Kaidai KD. 3", "file": "photos/thumb_12.jpg"},
    {"id": "kd4", "name": "Kaidai KD. 4", "file": "photos/thumb_13.jpg"},
    {"id": "kd5", "name": "Kaidai KD. 5", "file": "photos/thumb_16.jpg"},
    {"id": "kd6", "name": "Kaidai KD. 6", "file": "photos/thumb_09.jpg"},
    {"id": "kd7", "name": "Kaidai KD. 7", "file": "photos/thumb_14.jpg"},
    {"id": "sentaka", "name": "Sen-Taka", "file": "photos/thumb_10.jpg"},
    {"id": "kiraisen", "name": "Kirai-Sen", "file": "photos/thumb_15.jpg"}
]

crops_fam1 = []
crops_fam2 = []

for s in subs:
    im = cv2.imread(s['file'])
    im_std = cv2.resize(im, (525, 408))
    # Crop damage track region: y in [170, 275], x in [20, 360]
    dmg_area = im_std[170:275, 20:360]
    dmg_area = cv2.resize(dmg_area, (300, 90))
    cv2.putText(dmg_area, s['name'], (8, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 0, 255), 1)
    
    # Check if SUNK is shifted to the right (x > 250 in 300px crop)
    hsv = cv2.cvtColor(dmg_area, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, np.array([0, 120, 120]), np.array([10, 255, 255])) | cv2.inRange(hsv, np.array([170, 120, 120]), np.array([180, 255, 255]))
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    sunk_x = max([cv2.boundingRect(c)[0] for c in cnts], default=0)
    
    is_shifted = sunk_x > 240
    print(f"  {s['name']:25s} -> SUNK at x={sunk_x} -> {'Tipo 2 (Desplazado Derecha)' if is_shifted else 'Tipo 1 (Estándar Izq)'}")
