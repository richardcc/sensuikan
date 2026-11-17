import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")

# In two_layouts_photo.jpg:
# The right card is underneath the left card.
# But let's look at the card on the right:
# In the damage track of the right card:
# What words are visible?
# Let's crop x in [350, 480], y in [490, 600]:
crop_dmg_text = img[490:600, 350:490]
cv2.imwrite("dmg_text_right_card.png", crop_dmg_text)
print("Saved dmg_text_right_card.png")
