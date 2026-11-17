import cv2
import numpy as np

# Let's inspect the layout of Damage Tracks in each of the 5 cards:
# 1. Junsen J.2:
#    Where is "Damage Tracks"?
#    Where is Flooding Marker?
#    Where is Hull Damage Marker?
# 2. Kaidai KD.3:
#    Where is Damage Tracks?
# 3. Sen-Toku:
#    Where is Damage Tracks?

# Let's print out what text is where in each crop:
for name in ["Junsen_J2", "Kaidai_KD3", "Sen_Toku", "Type_B", "Type_C"]:
    im = cv2.imread(f"dt_compare_{name}.jpg")
    # Let's detect where the red "SUNK" box is!
    # In HSV: Red is H in [0, 10] or [170, 180], S > 100, V > 100
    hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    mask1 = cv2.inRange(hsv, np.array([0, 120, 120]), np.array([10, 255, 255]))
    mask2 = cv2.inRange(hsv, np.array([170, 120, 120]), np.array([180, 255, 255]))
    mask = mask1 | mask2
    cnts, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"=== {name} ===")
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 15 <= w <= 60 and 15 <= h <= 60:
            print(f"  Red box (SUNK or Hull) at x={x}, y={y}, w={w}, h={h}")
