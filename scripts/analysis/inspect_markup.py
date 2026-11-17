import cv2
import numpy as np

img_path = r"C:\Users\Richard\.gemini\antigravity\brain\1857cc84-1069-4de5-aff1-963f64c0c673\.user_uploaded\media_1793980657952_915f09de.png"
img = cv2.imread(img_path)
print("Image shape:", img.shape)

# Let's save a clean copy to workspace to analyze
cv2.imwrite("user_markup.png", img)
print("Saved user_markup.png")
