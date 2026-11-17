import cv2
import numpy as np

# In thumb_12.jpg (Kaidai KD.3):
kd3 = cv2.imread("photos/thumb_12.jpg")
cv2.imwrite("kd3_full_photo.jpg", kd3)
print("Saved kd3_full_photo.jpg, size:", kd3.shape)

# Let's inspect thumb_12 Damage Tracks:
# Where are the Damage Tracks in thumb_12?
# Let's crop the Damage Tracks of thumb_12:
h, w = kd3.shape[:2]
cv2.imwrite("kd3_damage_track_crop.jpg", kd3[int(h*0.4):int(h*0.75), 0:int(w*0.8)])
