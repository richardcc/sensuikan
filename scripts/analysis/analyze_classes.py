import cv2
import numpy as np
import glob
import os

files = sorted(glob.glob("photos/thumb_*.jpg"))
print(f"Found {len(files)} thumbs.")

# Let's inspect the dimensions and titles
for f in files:
    img = cv2.imread(f)
    print(f, img.shape)
