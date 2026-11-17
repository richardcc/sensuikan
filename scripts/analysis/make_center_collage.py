import cv2
import numpy as np

# Create collage of center areas
titles = [
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

crops = []
for i in range(17):
    c = cv2.imread(f"photos/center_{i:02d}.jpg")
    c = cv2.resize(c, (200, 100))
    cv2.putText(c, titles[i], (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
    crops.append(c)

j2 = cv2.imread("junsen_j2.png")
j2 = cv2.resize(j2, (600, 450))
c_j2 = j2[50:200, 80:380]
c_j2 = cv2.resize(c_j2, (200, 100))
cv2.putText(c_j2, titles[17], (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
crops.append(c_j2)

row1 = np.hstack(crops[0:6])
row2 = np.hstack(crops[6:12])
row3 = np.hstack(crops[12:18])
collage = np.vstack([row1, row2, row3])
cv2.imwrite("centers_collage.jpg", collage)
print("Saved centers_collage.jpg")
