import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")
h, w = img.shape[:2]

# Left card is roughly x in [0, 360], y in [180, 800]
# Right card is roughly x in [360, 700], y in [180, 800]
card_left = img[180:800, 0:380]
card_right = img[180:800, 370:700]

cv2.imwrite("layout_left_sub.jpg", card_left)
cv2.imwrite("layout_right_sub.jpg", card_right)

print("Saved layout crops")
