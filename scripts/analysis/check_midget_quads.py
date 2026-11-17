import cv2
import numpy as np

# Let's inspect the text and structure on Midget (thumb_01.jpg)
# We will crop slices of Midget and analyze them:
m = cv2.imread("photos/thumb_01.jpg")
h, w = m.shape[:2]

# Let's save 4 quadrants:
cv2.imwrite("midget_q1_topleft.jpg", m[0:h//2, 0:w//2])
cv2.imwrite("midget_q2_topright.jpg", m[0:h//2, w//2:])
cv2.imwrite("midget_q3_botleft.jpg", m[h//2:, 0:w//2])
cv2.imwrite("midget_q4_botright.jpg", m[h//2:, w//2:])

print("Saved Midget quadrants")
