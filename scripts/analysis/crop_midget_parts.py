import cv2
import numpy as np

# Let's inspect the text and elements in Midget
# Where are the boxes and drawing in Midget?
img = cv2.imread("photos/thumb_01.jpg")
h, w = img.shape[:2]

# Let's crop various regions of Midget to see what is where:
# In Midget:
# Is the drawing in the middle? How big is it?
# Let's crop:
# y: 50 to 250, x: 50 to 350
cv2.imwrite("midget_sub_area.jpg", img[40:240, 50:400])
# What is on the left?
cv2.imwrite("midget_left.jpg", img[:, :200])
# What is on the right?
cv2.imwrite("midget_right.jpg", img[:, 350:])
# What is in the center?
cv2.imwrite("midget_center.jpg", img[:, 150:400])

print("Saved Midget sub areas")
