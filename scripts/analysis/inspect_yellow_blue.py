import cv2
import numpy as np

img_path = r"C:\Users\Richard\.gemini\antigravity\brain\1857cc84-1069-4de5-aff1-963f64c0c673\.user_uploaded\media_1793981188410_a0c5ed78.png"
img = cv2.imread(img_path)
cv2.imwrite("user_markup_yellow_blue.png", img)
print("Saved user_markup_yellow_blue.png, shape:", img.shape)

hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Yellow: H: 20-40, S > 150, V > 150
yellow_mask = cv2.inRange(hsv, np.array([20, 150, 150]), np.array([35, 255, 255]))
# Blue: H: 100-130, S > 150, V > 150
blue_mask = cv2.inRange(hsv, np.array([100, 150, 150]), np.array([130, 255, 255]))

cnts_yellow, _ = cv2.findContours(yellow_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
for c in cnts_yellow:
    x, y, w, h = cv2.boundingRect(c)
    if w > 100:
        print(f"Yellow box: x={x}, y={y}, w={w}, h={h}")

cnts_blue, _ = cv2.findContours(blue_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
for c in cnts_blue:
    x, y, w, h = cv2.boundingRect(c)
    if w > 100:
        print(f"Blue box: x={x}, y={y}, w={w}, h={h}")
