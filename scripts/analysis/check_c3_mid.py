import cv2
import numpy as np

# Load thumb_00.jpg (Type C.3 Kaiten carrier)
c3 = cv2.imread("photos/thumb_00.jpg")
c3 = cv2.resize(c3, (525, 408))

# Let's save the middle and guns region of Type C.3
crop_c3_mid = c3[110:250, 360:510]
cv2.imwrite("c3_mid_crop.png", crop_c3_mid)

# Let's also inspect thumb_01.jpg (Midget) and thumb_15.jpg (Kirai-Sen)
kirai = cv2.imread("photos/thumb_15.jpg")
kirai = cv2.resize(kirai, (525, 408))
cv2.imwrite("kirai_mid_crop.png", kirai[110:250, 360:510])

midget = cv2.imread("photos/thumb_01.jpg")
midget = cv2.resize(midget, (525, 408))
cv2.imwrite("midget_mid_crop.png", midget[110:250, 360:510])

print("Saved mid crops")
