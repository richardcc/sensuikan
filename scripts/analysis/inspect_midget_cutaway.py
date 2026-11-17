import cv2
import numpy as np

# Let's inspect where the drawing is on Midget:
# What are the coordinates of the drawing of the submarine on Midget?
# In Midget:
# Let's crop the drawing:
m = cv2.imread("photos/thumb_01.jpg")
h, w = m.shape[:2]

# Let's inspect where the large cutaway drawing of Midget is:
# Let's write an analysis of the drawing boundary:
# Let's save crops of Midget:
cv2.imwrite("midget_cutaway.jpg", m[40:220, 80:400])
# And what are the tracks below it?
cv2.imwrite("midget_tracks.jpg", m[180:320, :])
# And what is at the bottom?
cv2.imwrite("midget_bottom_boxes.jpg", m[300:, :])

print("Saved cutaway and tracks")
