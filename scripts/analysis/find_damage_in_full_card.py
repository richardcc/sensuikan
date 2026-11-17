import cv2
import numpy as np

# In two_layouts_photo.jpg:
# Let's find the right card's left edge!
# In two_layouts_photo.jpg, the left card is lying ON TOP of the right card!
# So the left card's right edge covers the middle of the right card!
# Let's find the original photo of that submarine in photos/thumb_*.jpg where the entire card is visible!

# Which card has 120mm Gun, no AA gun, and 3 rows of tubes?
# Let's check:
# Kaidai KD.3: 120mm Gun
# Kaidai KD.4: 120mm Gun
# Kaidai KD.7: 120mm Gun

for idx, name in [(12, "KD3"), (13, "KD4"), (14, "KD7")]:
    im = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    # Let's crop the entire Damage Track and Deck Gun of this card
    # In 600x450 image space:
    h, w = im.shape[:2]
    crop = im[int(h*0.35):int(h*0.75), :]
    cv2.imwrite(f"full_middle_{name}.jpg", crop)

print("Saved full middle crops of KD3, KD4, KD7")
