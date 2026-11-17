import cv2
import numpy as np

c_l = cv2.imread("dt_left_card_photo.jpg")
c_r = cv2.imread("dt_right_card_photo.jpg")

# In two_layouts_photo.jpg:
# Look at c_r:
# It shows:
# "...rface" (Surface) and "SUNK" (red box)!
# To the right of "Surface" is "Deck Gun 120mm Status"!
# And to the left of "Surface" is "Flooding Flooding Flooding..."!
# But look at the Y position:
# In c_l: "Surface" is at y ~ 530, SUNK is at y ~ 570
# In c_r: "Surface" is at y ~ 535, SUNK is at y ~ 575!
# BUT LOOK AT X POSITION:
# In c_l: Surface ends at x ~ 130! And the right column starts at x ~ 160!
# In c_r: Surface EXTENDS TO x ~ 490! And Deck Gun starts at x ~ 500!
# The Damage Track on the RIGHT card extends further to the right!
# Or the left card has fewer damage boxes?!

print("Inspecting damage track boxes...")
