import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")
h, w = img.shape[:2]

# Let's crop the top-left of the right card:
# The right card starts around x = 360 px
# Title is near the top
cv2.imwrite("title_right_card_photo.jpg", img[150:260, 360:750])
print("Saved title of right card")
