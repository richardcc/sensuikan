import glob
import cv2
import numpy as np

# Let's inspect all WhatsApp photos in photos/
# Let's see which card has 120mm gun and 8 torpedo tubes (1-4, 5-6, 7-8)
files = sorted(glob.glob("photos/WhatsApp*.jpeg"))

for f in files:
    im = cv2.imread(f)
    # save a thumbnail of right half
    h, w = im.shape[:2]
    # check right half
    pass

# We have thumb_00 to thumb_16
# Let's check thumb_12 (Kaidai KD.3)
kd3 = cv2.imread("photos/thumb_12.jpg")
cv2.imwrite("test_kd3_right.jpg", kd3[:, int(kd3.shape[1]*0.6):])

# Let's check thumb_13 (Kaidai KD.4)
kd4 = cv2.imread("photos/thumb_13.jpg")
cv2.imwrite("test_kd4_right.jpg", kd4[:, int(kd4.shape[1]*0.6):])

# Let's check thumb_14 (Kaidai KD.7)
kd7 = cv2.imread("photos/thumb_14.jpg")
cv2.imwrite("test_kd7_right.jpg", kd7[:, int(kd7.shape[1]*0.6):])

# Let's check thumb_09 (Kaidai KD.6)
kd6 = cv2.imread("photos/thumb_09.jpg")
cv2.imwrite("test_kd6_right.jpg", kd6[:, int(kd6.shape[1]*0.6):])

# Let's check thumb_08 (Type C)
tc = cv2.imread("photos/thumb_08.jpg")
cv2.imwrite("test_tc_right.jpg", tc[:, int(tc.shape[1]*0.6):])

print("Saved test crops")
