import cv2
import numpy as np
import json

# Let's inspect the positions of all sections on the right side in Sen-Toku (03), Type C.3 (00), Kirai-Sen (15), Midget (01), and J.2 (17)
# Let's map each section:

# 1. Row 0: Aircraft / Events
# Junsen J.2:
#   Aircraft: x=383, y=22
#   Random Event 1: x=444, y=23
#   Random Event 2: x=475, y=23
# Sen-Toku (I-400):
#   Aircraft 1 (Seiran 1): x=384, y=22?
#   Aircraft 2 (Seiran 2): x=414, y=22?
#   Aircraft 3 (Seiran 3): x=444, y=22?
#   Random Event: x=475, y=22?
# What about a row with 4 slots at y=22: x in [384, 414, 444, 475]?
# That accommodates 1, 2, or 3 Aircraft + Random Events!

# 2. Rows 1 & 2: Torpedo Tubes
# Row 1 (y=57): Tubes 1, 2, 3, 4 (x = 384, 414, 444, 475)
# Row 2 (y=87): Tubes 5, 6, 7, 8 (or Aft 1, 2, Aft Reload 1, 2) (x = 384, 414, 444, 475)
# A 2x4 grid of 8 tube slots covers ALL 4-tube, 6-tube, and 8-tube submarines!

# 3. Row 3 (y=120 to 180): Forward Reloads Bin / Mines
# In J.2: x = 384 to 502, y = 120 to 180 (118 x 60 px)
# In Kirai-Sen: Mines are stored here! A wide bin accommodates torpedo reloads OR mines!
# In Sen-Toku: Torpedo reloads stored here!

# 4. Row 4 (y=194): Guns & Kaiten
# In J.2: Deck Gun (x=384), Gun Ammo (x=414), AA Gun (x=384, y=223)
# In Type C.3 (Kaiten): Kaiten 1, 2, 3, 4, 5, 6!
# Where are Kaiten located in Type C.3?
# Let's check where Kaiten boxes are located in Type C.3 (00)!

