import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")

# In two_layouts_photo.jpg:
# Left card damage track: x in [0, 200], y in [480, 620]
# Right card damage track: x in [300, 520], y in [480, 620]

crop_left = img[480:630, 0:250]
crop_right = img[480:630, 320:550]

cv2.imwrite("dt_left_card_photo.jpg", crop_left)
cv2.imwrite("dt_right_card_photo.jpg", crop_right)

print("Saved dt_left_card_photo.jpg and dt_right_card_photo.jpg")
