import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")

# Let's crop both right columns and align them side by side
# In the photo:
# Card Left (Cruiser Sub - Junsen J.2): x in [80, 360], y in [200, 800]
# Card Right (Attack Sub - Kaidai): x in [410, 680], y in [180, 800]

c_left = img[200:800, 80:360]
c_right = img[180:780, 410:680]

# Resize both to exact same height (600 px) and width (280 px)
c_left = cv2.resize(c_left, (280, 600))
c_right = cv2.resize(c_right, (280, 600))

# Draw horizontal alignment lines across both
comp = np.hstack([c_left, c_right])
for y in range(0, 600, 30):
    cv2.line(comp, (0, y), (560, y), (0, 255, 0), 1)

cv2.imwrite("comparison_aligned_layouts.jpg", comp)
print("Saved comparison_aligned_layouts.jpg")
