import cv2
import numpy as np

subs = [
    {"id": "j2", "name": "Junsen J. 2"},
    {"id": "c3", "name": "Type C. 3"},
    {"id": "type_a", "name": "Type A"},
    {"id": "sentoku", "name": "Sen-Toku (I-400)"},
    {"id": "j1m", "name": "Junsen J. 1M"},
    {"id": "type_a_mod", "name": "Type A Modified"},
    {"id": "type_b", "name": "Type B"},
    {"id": "type_b3", "name": "Type B. 3"},
    {"id": "type_c", "name": "Type C"},
    {"id": "kd6", "name": "Kaidai KD. 6"},
    {"id": "sentaka", "name": "Sen-Taka"},
    {"id": "j3", "name": "Junsen J. 3"},
    {"id": "kd3", "name": "Kaidai KD. 3"},
    {"id": "kd4", "name": "Kaidai KD. 4"},
    {"id": "kd7", "name": "Kaidai KD. 7"},
    {"id": "kiraisen", "name": "Kirai-Sen (Minelayer)"},
    {"id": "kd5", "name": "Kaidai KD. 5"}
]

p2_tiles = []
for s in subs:
    p2 = cv2.imread(f"photos/sub_{s['id']}_p2.png")
    p2 = cv2.resize(p2, (200, 150))
    cv2.putText(p2, s['name'], (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
    p2_tiles.append(p2)

blank_p2 = np.zeros_like(p2_tiles[0])
r1 = np.hstack(p2_tiles[0:6])
r2 = np.hstack(p2_tiles[6:12])
r3 = np.hstack(p2_tiles[12:17] + [blank_p2])
collage_p2 = np.vstack([r1, r2, r3])
cv2.imwrite("p2_all_17_collage.jpg", collage_p2)

p3_tiles = []
for s in subs:
    p3 = cv2.imread(f"photos/sub_{s['id']}_p3.png")
    p3 = cv2.resize(p3, (200, 180))
    cv2.putText(p3, s['name'], (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
    p3_tiles.append(p3)

blank_p3 = np.zeros_like(p3_tiles[0])
r1 = np.hstack(p3_tiles[0:6])
r2 = np.hstack(p3_tiles[6:12])
r3 = np.hstack(p3_tiles[12:17] + [blank_p3])
collage_p3 = np.vstack([r1, r2, r3])
cv2.imwrite("p3_all_17_collage.jpg", collage_p3)

print("Saved p2_all_17_collage.jpg and p3_all_17_collage.jpg successfully")
