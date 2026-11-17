import cv2
import numpy as np

# Load stacked_cards.png
img = cv2.imread("stacked_cards.png")
# Let's see: on each card, where does the title text end?
# Let's crop x in [0, 600] for each card and visualize with a grid:
# In stacked_cards.png:
# Card 1: J. 1M
# Card 2: Type A Modified
# Card 3: Sen-Toku

vis = img.copy()
for x in range(0, img.shape[1], 25):
    cv2.line(vis, (x, 0), (x, img.shape[0]), (0, 255, 0), 1)
    if x % 50 == 0:
        cv2.putText(vis, str(x), (x + 2, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 255, 0), 1)

cv2.imwrite("stacked_cards_grid.png", vis)
print("Saved stacked_cards_grid.png")
