import cv2
import numpy as np

# Load stacked_cards.png
img = cv2.imread("stacked_cards.png")
# In stacked_cards.png:
# Card width spans from x=90 to x=825 (735 px = 280 mm -> 2.625 px/mm)
# Split at X = 158 mm -> 90 + 158 * 2.625 = 90 + 414.7 = x = 505 px!

# Let's inspect where x = 505 px falls on all 3 cards in stacked_cards.png:
# On Card 1 (Junsen J. 1M): Title ends at x ~ 490 -> x=505 is right after the title, before the events!
# On Card 2 (Type A Modified): Title ends at x ~ 480 -> x=505 is right after title, before "Aircraft"!
# On Card 3 (Sen-Toku): Title ends at x ~ 480 -> x=505 is right after title, before "Random Event 1" (which starts at x=525)!

vis = img.copy()
# Draw the new split line at x = 505 px (X = 158.0 mm)
cv2.line(vis, (505, 0), (505, img.shape[0]), (0, 0, 255), 3)
cv2.putText(vis, "NUEVA DIVISION PIEZA 1 / PIEZA 2 (X = 158.0 mm)", (320, 25), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 0, 255), 2)

# Also draw previous split line at x = 596 px (X = 193.0 mm)
cv2.line(vis, (596, 0), (596, img.shape[0]), (255, 0, 0), 2)
cv2.putText(vis, "Anterior (193 mm - tapaba eventos Sen-Toku)", (580, 50), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 0, 0), 1)

cv2.imwrite("verificacion_corte_158mm.png", vis)
print("Saved verificacion_corte_158mm.png")
