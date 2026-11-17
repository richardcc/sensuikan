import cv2
import numpy as np

# Let's inspect thumb_01.jpg (Midget Ko-Hyoteki)
midget = cv2.imread("photos/thumb_01.jpg")
cv2.imwrite("crop_midget_full.jpg", cv2.resize(midget, (700, 500)))

# Let's inspect thumb_15.jpg (Kirai-Sen)
kirai = cv2.imread("photos/thumb_15.jpg")
cv2.imwrite("crop_kirai_full.jpg", cv2.resize(kirai, (700, 500)))

# Let's inspect thumb_00.jpg (Type C.3)
c3 = cv2.imread("photos/thumb_00.jpg")
cv2.imwrite("crop_c3_full.jpg", cv2.resize(c3, (700, 500)))

# Let's inspect thumb_03.jpg (Sen-Toku)
sentoku = cv2.imread("photos/thumb_03.jpg")
cv2.imwrite("crop_sentoku_full.jpg", cv2.resize(sentoku, (700, 500)))

print("Saved detailed inspection images")
