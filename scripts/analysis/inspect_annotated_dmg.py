import cv2
import numpy as np

# Let's inspect the damage tracks:
# What are the labels and boxes in each?
for name in ["Junsen_J2", "Kaidai_KD3", "Kaidai_KD7", "Type_C", "Sen_Toku", "Type_B"]:
    im = cv2.imread(f"dmg_{name}.jpg")
    print(f"=== {name} ===")
    # Let's print the size
    print("  Image size:", im.shape)
    # Let's save a resized version to easily inspect
    cv2.imwrite(f"annotated_{name}.jpg", cv2.resize(im, (600, 300)))

print("Saved annotated images")
