import cv2
import numpy as np

for name in ["KD3", "KD4", "KD7"]:
    im = cv2.imread(f"crop_{name}_dmg_full.jpg")
    print(f"=== {name} ===")
    # Let's save resized to 800x400
    cv2.imwrite(f"view_{name}_dmg.jpg", cv2.resize(im, (800, 400)))

print("Saved views")
