import cv2
import numpy as np

# Let's inspect the original WhatsApp photos for Sen-Toku (03), Type C.3 (00), etc.
# In photos/, what are the original photos?
# Let's map thumb index to original file:

files = [
    ("00_Type_C3", "photos/thumb_00.jpg"),
    ("01_Midget", "photos/thumb_01.jpg"),
    ("02_Type_A", "photos/thumb_02.jpg"),
    ("03_SenToku", "photos/thumb_03.jpg"),
    ("04_Junsen_J1M", "photos/thumb_04.jpg"),
    ("05_Type_A_Mod", "photos/thumb_05.jpg"),
    ("06_Type_B", "photos/thumb_06.jpg"),
    ("07_Type_B3", "photos/thumb_07.jpg"),
    ("08_Type_C", "photos/thumb_08.jpg"),
    ("09_Kaidai_KD6", "photos/thumb_09.jpg"),
    ("10_SenTaka", "photos/thumb_10.jpg"),
    ("11_Junsen_J3", "photos/thumb_11.jpg"),
    ("12_Kaidai_KD3", "photos/thumb_12.jpg"),
    ("13_Kaidai_KD4", "photos/thumb_13.jpg"),
    ("14_Kaidai_KD7", "photos/thumb_14.jpg"),
    ("15_KiraiSen", "photos/thumb_15.jpg"),
    ("16_Kaidai_KD5", "photos/thumb_16.jpg")
]

# Let's check what boxes exist on SenToku (03)
# SenToku has 3 aircraft:
# Let's inspect row 0 (y=22):
# Does Sen-Toku have aircraft at x=384, 414, 444?
sentoku = cv2.imread("photos/thumb_03.jpg")
sentoku = cv2.resize(sentoku, (525, 408))

# Let's inspect what's at y in [15, 60], x in [380, 510] in Sen-Toku:
crop_top = sentoku[15:60, 375:515]
cv2.imwrite("sentoku_top_crop.png", crop_top)

# Let's inspect guns row: y in [185, 235], x in [375, 515] in Sen-Toku:
crop_guns = sentoku[185:235, 375:515]
cv2.imwrite("sentoku_guns_crop.png", crop_guns)

# Let's inspect systems: y in [235, 400], x in [375, 515] in Sen-Toku:
crop_sys = sentoku[235:400, 375:515]
cv2.imwrite("sentoku_sys_crop.png", crop_sys)

print("Saved Sen-Toku crops")
