import cv2
import numpy as np
import glob

# Let's inspect the damage tracks of all 17 cards in high resolution:
# Let's make an image that shows the damage track of each card clearly:
# We will crop: y in [35%, 70%], x in [0%, 65%] of each card.

crops = []
names = [
    "00_Type_C3", "02_Type_A", "03_SenToku", "04_Junsen_J1M", "05_Type_A_Mod",
    "06_Type_B", "07_Type_B3", "08_Type_C", "09_Kaidai_KD6", "10_SenTaka",
    "11_Junsen_J3", "12_Kaidai_KD3", "13_Kaidai_KD4", "14_Kaidai_KD7",
    "15_KiraiSen", "16_Kaidai_KD5", "17_Junsen_J2"
]

files = [
    "photos/thumb_00.jpg", "photos/thumb_02.jpg", "photos/thumb_03.jpg",
    "photos/thumb_04.jpg", "photos/thumb_05.jpg", "photos/thumb_06.jpg",
    "photos/thumb_07.jpg", "photos/thumb_08.jpg", "photos/thumb_09.jpg",
    "photos/thumb_10.jpg", "photos/thumb_11.jpg", "photos/thumb_12.jpg",
    "photos/thumb_13.jpg", "photos/thumb_14.jpg", "photos/thumb_15.jpg",
    "photos/thumb_16.jpg", "junsen_j2.png"
]

for idx, (n, f) in enumerate(zip(names, files)):
    im = cv2.imread(f)
    h, w = im.shape[:2]
    dt_crop = im[int(h*0.42):int(h*0.68), int(w*0.04):int(w*0.68)]
    dt_res = cv2.resize(dt_crop, (400, 100))
    cv2.putText(dt_res, n, (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
    crops.append(dt_res)

# Save in 3 images of 6, 6, 5
cv2.imwrite("dt_collage_1.jpg", np.vstack(crops[0:6]))
cv2.imwrite("dt_collage_2.jpg", np.vstack(crops[6:12]))
cv2.imwrite("dt_collage_3.jpg", np.vstack(crops[12:17]))

print("Saved dt_collage_1, 2, 3")
