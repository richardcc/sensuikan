import cv2
import numpy as np

img_path = r"C:\Users\Richard\.gemini\antigravity\brain\1857cc84-1069-4de5-aff1-963f64c0c673\.user_uploaded\media_1793981436504_b33f95df.png"
img = cv2.imread(img_path)
cv2.imwrite("stacked_cards.png", img)
print("Saved stacked_cards.png, shape:", img.shape)
