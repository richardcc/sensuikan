import cv2
import numpy as np

# In dt_right_hires.png:
# Look at where "Deck Gun" is:
# On the right card:
# The words "...rface" (Surface) and "SUNK" are right under the Deck Gun or to the left of Deck Gun?
# In dt_right_hires.png:
# Look at x ~ 370 to 520, y ~ 450 to 600 in two_layouts_photo.jpg:

img = cv2.imread("two_layouts_photo.jpg")
crop = img[480:600, 380:520]

# Let's see the text in crop:
# Let's save resized to 600x400
cv2.imwrite("dt_right_crop_zoom.png", cv2.resize(crop, (600, 400)))
print("Saved dt_right_crop_zoom.png")
