import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")

# In two_layouts_photo.jpg:
# Left card damage track:
# Right card damage track:
cv2.imwrite("dt_left_hires.png", img[400:650, 0:250])
cv2.imwrite("dt_right_hires.png", img[400:650, 250:520])

print("Saved hires crops of both damage tracks from the user's photo")
