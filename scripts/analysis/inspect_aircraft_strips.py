import cv2
import numpy as np

c2 = cv2.imread("crop_card2_type_a_mod.png")
c3 = cv2.imread("crop_card3_sentoku.png")

# Let's inspect the right side of c2 (x > 500)
# and c3 (x > 500)
c2_right = c2[:, 500:]
c3_right = c3[:, 500:]

cv2.imwrite("c2_right.png", c2_right)
cv2.imwrite("c3_right.png", c3_right)

print("Saved c2_right.png and c3_right.png")
