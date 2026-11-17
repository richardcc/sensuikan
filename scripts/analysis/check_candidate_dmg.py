import cv2
import numpy as np

# Let's count Flooding and Hull damage boxes in all cards:
# Let's inspect the cards from photos/thumb_*.jpg
import glob

# In thumb_*.jpg, let's find the card that has the 120mm deck gun (Kaidai KD.3, Kaidai KD.4, Kaidai KD.7)
# Let's inspect thumb_12 (Kaidai KD.3) and thumb_14 (Kaidai KD.7)
kd3 = cv2.imread("photos/thumb_12.jpg")
kd7 = cv2.imread("photos/thumb_14.jpg")
kd4 = cv2.imread("photos/thumb_13.jpg")

for name, im in [("KD3", kd3), ("KD4", kd4), ("KD7", kd7)]:
    # Find text "Damage Tracks"
    cv2.imwrite(f"crop_{name}_dmg_full.jpg", im[int(im.shape[0]*0.4):int(im.shape[0]*0.75), :])

print("Saved candidate damage crops")
