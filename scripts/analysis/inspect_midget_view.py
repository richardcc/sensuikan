import cv2
import numpy as np

# Let's inspect thumb_01.jpg (Type A Midget Ko-Hyoteki)
midget = cv2.imread("photos/thumb_01.jpg")
cv2.imwrite("midget_full_view.jpg", midget)

# What are all the text headers in Midget?
# Let's inspect the sections in Midget:
# Top left: logo?
# Top mid: Title?
# Drawing: Where is it?
print("Midget view saved")
