import cv2
import numpy as np

img = cv2.imread("stacked_cards_grid.png")
# In stacked_cards.png:
# Logo is at x from ~100 to ~260
# Title starts at x ~ 290
# Title ends:
# Card 1 (Junsen J. 1M): ends around x = 490
# Card 2 (Type A Modified): ends around x = 480
# Card 3 (Sen-Toku Class): ends around x = 480
# In Card 3 (Sen-Toku), "Random Event" 1 starts at x = 525!
# "Random Event" 2 starts at x = 570!
# "Aircraft" text is at x = 625!
# Seiran 1 is at x = 685!
# Seiran 2 is at x = 735!
# Seiran 3 is at x = 785!

# Now let's calculate the ratio:
# In stacked_cards.png:
# Total card width:
# The logo starts at x = 90
# The right edge of the card is at x = 825!
# So card width in this image is: 825 - 90 = 735 px!
# And 1 mm corresponds to: 735 / 280 = 2.625 px/mm!

# The title ends at x ~ 485:
# (485 - 90) / 2.625 = 395 / 2.625 = 150.5 mm!
# And Sen-Toku's Random Event 1 starts at x = 525:
# (525 - 90) / 2.625 = 435 / 2.625 = 165.7 mm!

# That means the boundary between Pieza 1 and Pieza 2 should be at around X = 158 - 162 mm!
# Not 193 mm!
print(f"Title ends at ~ 150.5 mm")
print(f"Sen-Toku Random Event starts at ~ 165.7 mm")
print(f"Optimal split between Pieza 1 and Pieza 2: X ~ 158.0 - 160.0 mm!")
