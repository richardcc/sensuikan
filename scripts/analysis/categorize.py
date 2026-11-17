import cv2
import numpy as np
import glob

# Let's inspect the layout of each right side by extracting horizontal slices
# Slice 1: y in [0, 60] (Top row: Aircraft / Kaiten / Tubes?)
# Slice 2: y in [50, 110] (Tubes / Aircraft?)
# Slice 3: y in [110, 190] (Reloads bin / Mines / etc.)
# Slice 4: y in [180, 240] (Deck gun / AA gun / Kaiten)
# Slice 5: y in [230, 400] (Systems matrix)

files = sorted(glob.glob("photos/thumb_*.jpg"))

# Let's write an inspection script to inspect what each class has on the right side:
classes_info = []

# Let's inspect what makes them different
for idx in range(17):
    img = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    img = cv2.resize(img, (525, 408))
    # We can inspect key regions
    # Top-right (x: 360-515, y: 15-55): Aircraft / Special
    # Mid-top-right (x: 360-515, y: 55-115): Torpedo tubes
    # Mid-right (x: 360-515, y: 115-185): Forward Reloads Bin
    # Mid-bottom-right (x: 360-515, y: 185-235): Guns / Kaiten
    # Bottom-right (x: 360-515, y: 235-400): Systems
    pass

print("Done")
