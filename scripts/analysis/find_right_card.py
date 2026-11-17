import glob
import cv2

# Search which card has 120mm gun
# Let's inspect the original WhatsApp images
for f in sorted(glob.glob("photos/WhatsApp*.jpeg")):
    im = cv2.imread(f)
    # let's inspect titles or features
    pass

# We have thumb_00 to thumb_16. Let's find which one matches the card on the right!
# In thumb_00 to thumb_16:
# Card 12 is Kaidai KD. 3
# Card 13 is Kaidai KD. 4
# Card 14 is Kaidai KD. 7
# Card 16 is Kaidai KD. 5
# Card 09 is Kaidai KD. 6

for idx in [12, 13, 14, 15, 16, 9, 8]:
    im = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    cv2.imwrite(f"check_sub_{idx}.jpg", im)

print("Saved candidate cards")
