import cv2
import numpy as np

type_c = cv2.imread("photos/thumb_08.jpg")
type_c3 = cv2.imread("photos/thumb_00.jpg")
kaidai6 = cv2.imread("photos/thumb_09.jpg")

cv2.imwrite("check_type_c_right.png", type_c[:, int(type_c.shape[1]*0.6):])
cv2.imwrite("check_type_c3_right.png", type_c3[:, int(type_c3.shape[1]*0.6):])
cv2.imwrite("check_kaidai6_right.png", kaidai6[:, int(kaidai6.shape[1]*0.6):])

print("Saved Type C and Kaidai crops for inspection")
