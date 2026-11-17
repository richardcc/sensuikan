import cv2
import numpy as np

img = cv2.imread("stacked_cards.png")
h, w = img.shape[:2]

# Let's crop the 3 strips:
# Card 1 (Junsen J. 1M): roughly y from 50 to 110
# Card 2 (Type A Modified): roughly y from 110 to 180
# Card 3 (Sen-Toku): roughly y from 180 to 260

cv2.imwrite("crop_card1_j1m.png", img[45:115, :])
cv2.imwrite("crop_card2_type_a_mod.png", img[110:185, :])
cv2.imwrite("crop_card3_sentoku.png", img[180:265, :])

print("Saved crops of all 3 stacked cards")
