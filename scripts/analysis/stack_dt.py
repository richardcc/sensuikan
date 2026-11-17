import cv2
import numpy as np

# Stack all dt_compare crops
names = ["Junsen_J2", "Kaidai_KD3", "Sen_Toku", "Type_B", "Type_C"]
imgs = [cv2.imread(f"dt_compare_{n}.jpg") for n in names]

stacked = np.vstack(imgs)
cv2.imwrite("stacked_damage_tracks.jpg", stacked)
print("Saved stacked_damage_tracks.jpg")
