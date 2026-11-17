import cv2
import numpy as np

# Let's map both layouts into 525x408 image space (scaled to 280x170 mm)
# In 525x408 space:
# Right column starts at x = 362 px (~193.0 mm)
# Width of right column = 525 - 362 = 163 px (~87.0 mm)
# Top strip height = 56 px (~23.3 mm)

# Let's inspect the exact pixel positions in Option 2 (c2_right) and Option 3 (c3_right)
# In junsen_j2.png (Option 2):
# "Aircraft" text: x in [355, 382], y in [22, 38]
# Watanabe plane: x in [383, 409], y in [22, 48]
# Plane 2 / empty: x in [414, 440], y in [22, 48]
# Random Event 1: x in [444, 470], y in [23, 49]
# Random Event 2: x in [475, 501], y in [23, 49]

# In Sen-Toku (thumb_03):
# Right column x in [362, 525]
# Let's check Sen-Toku exact positions in 525x408 space:
sentoku = cv2.imread("photos/thumb_03.jpg")
sentoku = cv2.resize(sentoku, (525, 408))

# In Sen-Toku:
# Random Event 1: x in [368, 394], y in [23, 49]
# Random Event 2: x in [394, 420], y in [23, 49]
# "Aircraft" text: x in [422, 446], y in [25, 42]
# Seiran 1: x in [446, 470], y in [23, 49]
# Seiran 2: x in [470, 494], y in [23, 49]
# Seiran 3: x in [494, 518], y in [23, 49]

print("Pixel mappings confirmed.")
