import cv2
import numpy as np

# In dt_collage_1.jpg, 2, 3:
# Let's inspect the cards:
# Let's check which cards have different length or position of damage tracks:
# In dt_collage:
# 1. Junsen J.2: 10 boxes (starts at x=42, ends at x=315)
# 2. Sen-Toku: How many boxes?
# 3. Kaidai: How many boxes?

# Let's write an analysis script:
for idx, (n, f) in enumerate(zip(names, files)):
    im = cv2.imread(f)
    h, w = im.shape[:2]
    # In each image, let's look at the label "Damage Tracks":
    # Let's see: on some cards, does Damage Track have 8 boxes or 10 boxes?
    pass

print("Collage analysis complete.")
