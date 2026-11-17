import cv2
import numpy as np

# Let's inspect the 18 classes in detail.
# Let's write an inspection script that checks specific pixel regions where boxes appear.
# In junsen_j2:
# Aircraft row: y around 20-50, x around 380-510
# Torpedo tubes row 1: y around 55-85, x around 384-500 (Fwd 1, 2, 3, 4)
# Torpedo tubes row 2: y around 85-115, x around 384-440 (Fwd 5, 6, Aft 1, 2)
# Forward Reloads bin: y around 120-180, x around 384-502
# Guns row: y around 190-225, x around 384-475 (Deck gun, Gun ammo, AA gun)
# Systems rows: y around 240-390, x around 380-500 (4 cols x 5 rows)

# Let's check how the other 17 classes compare to this layout!
# Let's write a script to check if the boxes fall into the same grid slots.

# Let's load the high-res original photos or thumbs and check each of the 18 classes.
