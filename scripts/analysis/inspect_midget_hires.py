import cv2
import numpy as np

# Load high-res Midget photo
# Find the original WhatsApp photo corresponding to thumb_01.jpg
# In our previous session:
# thumb_01 was created from one of the WhatsApp images. Let's find out which one!

import glob
for w_img in sorted(glob.glob("photos/WhatsApp*.jpeg")):
    # check if title matches Type A Midget
    im = cv2.imread(w_img)
    # let's find the original
    pass

# We have thumb_01.jpg, let's inspect it in full size
m = cv2.imread("photos/thumb_01.jpg")
print(f"thumb_01 size: {m.shape}")

# Let's save slices of Midget with text clearly readable
h, w = m.shape[:2]
cv2.imwrite("midget_detail_top.jpg", cv2.resize(m[:int(h*0.5), :], (1000, 400)))
cv2.imwrite("midget_detail_bottom.jpg", cv2.resize(m[int(h*0.5):, :], (1000, 400)))
print("Saved midget details")
