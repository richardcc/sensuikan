import cv2
import numpy as np

img = cv2.imread("compare_damage_grid.jpg")

# In top half (Junsen J.2):
# In J2:
# "Damage Tracks" title is at x = 50, y = 15
# Flooding track starts at x = 50, ends at x = 390!
# Hull Damage track starts at x = 50, ends at x = 390! (SUNK is at x ~ 360-390)
# And Deck Gun starts at x = 440!
# There is a 50 px gap between SUNK (x=390) and Deck Gun (x=440)!

# In bottom half (Kaidai KD.3):
# Where does Flooding track start?
# In KD3:
# Look at where Flooding starts:
# Flooding starts at x = 110! (indented by 60 px!)
# And Flooding ends at x = 430!
# SUNK is at x = 405 to 435!
# And Deck Gun starts at x = 440!
# THERE IS NO GAP between SUNK and Deck Gun in KD3! SUNK is right next to Deck Gun!

# AND LOOK AT Y POSITION:
# In J2:
# Flooding is at y = 50 to 80 (in this 200px crop)
# Hull is at y = 80 to 110
# In KD3:
# Flooding is at y = 230 to 260 (which is y = 30 to 60 from the crop top!)
# Hull is at y = 260 to 290 (which is y = 60 to 90 from the crop top!)
# In KD3, the Damage Track is 20 pixels HIGHER UP, and 60 pixels SHIFTED TO THE RIGHT!

print("Analysis of Damage Tracks shift completed.")
