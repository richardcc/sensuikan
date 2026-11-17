import cv2
import numpy as np

tc = cv2.imread("check_type_c_right.png")
tc3 = cv2.imread("check_type_c3_right.png")
kd6 = cv2.imread("check_kaidai6_right.png")

# Let's see: on Type C:
# Does Type C have 8 tubes in 2 rows or 3 rows?
# Let's save resized copies to inspect
cv2.imwrite("tc_detail.jpg", cv2.resize(tc, (300, 450)))
cv2.imwrite("tc3_detail.jpg", cv2.resize(tc3, (300, 450)))
cv2.imwrite("kd6_detail.jpg", cv2.resize(kd6, (300, 450)))
print("Saved details")
