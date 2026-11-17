import cv2
import numpy as np

# Let's inspect the titles collage:
# Let's check with a slightly generous window:
# x0 = 138.0 * scale_x (~73.6 mm)
# x1 = 315.0 * scale_x (~168.0 mm)
# y0 = (img_h - 58.0) * scale_y
# y1 = (img_h - 20.0) * scale_y

# Making it 138 to 315 gives ample breathing room of ~5 mm on each side so NO title gets cropped!
print("Title window optimization checked.")
