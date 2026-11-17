import cv2
import numpy as np

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

# In each card, let's look at the photo:
# Let's inspect two cards in high-res:
# 1. Junsen J.2 (or the one in two_layouts_photo.jpg on the left)
# 2. The card on the right of two_layouts_photo.jpg (Kaidai KD.3)
# In two_layouts_photo.jpg:
# Look at the bottom left:
# On the LEFT card: Damage tracks have "Flooding" (light blue) and "Hull Damage" (orange/red)
# On the RIGHT card: Look at the text:
# In two_layouts_photo.jpg, look at the left edge of the right card!
# It says: "Surface" and "SUNK" at y ~ 530!
# Wait! In the right card, "Surface" and "SUNK" are shifted! Where are they?
# Let's inspect two_layouts_photo.jpg on the boundary between left card and right card!

img = cv2.imread("two_layouts_photo.jpg")
h, w = img.shape[:2]

# Let's crop the damage tracks visible in two_layouts_photo.jpg:
# Left card damage track: x in [0, 150], y in [480, 600]
# Right card damage track: x in [350, 520], y in [480, 600]
dt_left = img[480:600, 0:150]
dt_right = img[480:600, 350:520]

cv2.imwrite("dt_left_visible.jpg", dt_left)
cv2.imwrite("dt_right_visible.jpg", dt_right)

print("Saved dt_left and dt_right visible crops")
