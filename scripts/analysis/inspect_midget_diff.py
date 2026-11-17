import cv2
import numpy as np

midget = cv2.imread("photos/thumb_01.jpg")
j2 = cv2.imread("junsen_j2.png")

# Let's save a clean comparison between Midget and J2
midget_res = cv2.resize(midget, (j2.shape[1], j2.shape[0]))
cv2.imwrite("midget_vs_j2.jpg", np.vstack([j2, midget_res]))
print("Saved midget_vs_j2.jpg")
