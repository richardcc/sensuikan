import cv2
import numpy as np

# In 525x408 image space, let's define the universal master grid for the right side:
# Columns (4 columns):
# Col 0: cx = 398 (left x: 384, width: 28)
# Col 1: cx = 428 (left x: 414, width: 28)
# Col 2: cx = 458 (left x: 444, width: 28)
# Col 3: cx = 489 (left x: 475, width: 28)

# Rows:
# Row 0 (Top / Aircraft / Events): y = 23 (centers: cy = 37) -> Col 0, 1, 2, 3
# Row 1 (Torpedo Tubes 1-4): y = 57 (centers: cy = 71) -> Col 0, 1, 2, 3
# Row 2 (Torpedo Tubes 5-8): y = 87 (centers: cy = 101) -> Col 0, 1, 2, 3
# Row 3 (Forward Reloads Bin): y in [120, 180] (large bin spanning cols 0 to 3)
# Row 4 (Guns & Weapons / Kaiten row 1): y = 194 (centers: cy = 208) -> Col 0, 1, 2, 3
# Row 5 (AA Guns / Kaiten row 2 / Systems row 1): y = 223 / 241
# Row 6 (Systems row 2): y = 271
# Row 7 (Systems row 3): y = 301
# Row 8 (Systems row 4): y = 331
# Row 9 (Systems row 5): y = 361

# Let's test if an overlay containing:
# - Row 0: 4 boxes (Aircraft 1, 2, 3 + Events)
# - Rows 1 & 2: 8 boxes (Tubes 1-8)
# - Row 3: Forward Reloads Bin
# - Row 4: 4 boxes (Deck Guns / Kaiten 1-4)
# - Rows 5-9: 4x5 = 20 boxes (Systems matrix + AA gun)
# covers EVERY counter in all 18 classes!

cols = [384, 414, 444, 475]
rows_top = [23, 57, 87]
bin_box = [384, 120, 119, 60]
rows_mid = [194, 224]
rows_bot = [255, 285, 315, 345, 375] # or 241, 271, 301, 331, 361

print("Universal Master Grid structure initialized")
