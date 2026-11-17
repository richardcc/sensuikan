import cv2
import numpy as np

img_path = r"C:\Users\Richard\.gemini\antigravity\brain\1857cc84-1069-4de5-aff1-963f64c0c673\.user_uploaded\media_1793982246007_c4dd6af2.jpg"
img = cv2.imread(img_path)
print("Image shape:", img.shape)
cv2.imwrite("two_layouts_photo.jpg", img)
print("Saved two_layouts_photo.jpg")
