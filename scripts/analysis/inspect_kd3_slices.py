import cv2
import numpy as np

im = cv2.imread("kd3_damage_track_crop.jpg")
h, w = im.shape[:2]

# Let's inspect where "Damage Tracks" is in Kaidai KD.3:
# Let's save slices of kd3_damage_track_crop.jpg:
cv2.imwrite("kd3_dt_slice1.jpg", im[0:int(h*0.5), :])
cv2.imwrite("kd3_dt_slice2.jpg", im[int(h*0.5):, :])
print("Saved slices of KD3 damage crop")
