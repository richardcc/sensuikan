import cv2
import os

p = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/test_kd3_canonical_rethought.png'
img = cv2.imread(p)
h, w, c = img.shape
print(f"Full image: {w}x{h}")

# Crop the right block
# Right block X is roughly from 0.65*w to 0.95*w
x0 = int(0.60 * w)
x1 = int(0.98 * w)
right_crop = img[:, x0:x1]
out_p = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/test_kd3_right_block.png'
cv2.imwrite(out_p, right_crop)
print("Saved right block crop!")
