import cv2
import numpy as np

# Let's crop individual high-res regions of thumb_03 (Sen-Toku) and thumb_00 (Type C.3)
sentoku = cv2.imread("photos/thumb_03.jpg")
c3 = cv2.imread("photos/thumb_00.jpg")
kiraisen = cv2.imread("photos/thumb_15.jpg")
midget = cv2.imread("photos/thumb_01.jpg")

# Let's save Sen-Toku sections:
# Top: aircraft (Seiran 1, Seiran 2, Seiran 3)
# Torpedo tubes:
# Reloads:
# Deck gun / AA gun:
# Systems:
cv2.imwrite("sentoku_right.png", sentoku[:, 350:])
cv2.imwrite("c3_right.png", c3[:, 350:])
cv2.imwrite("kiraisen_right.png", kiraisen[:, 350:])
cv2.imwrite("midget_right.png", midget[:, 350:])

print("Saved detailed right crops")
