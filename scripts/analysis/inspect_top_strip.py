import cv2
import numpy as np

img_path = r"C:\Users\Richard\.gemini\antigravity\brain\1857cc84-1069-4de5-aff1-963f64c0c673\.user_uploaded\media_1793981022248_11be0e6c.png"
img = cv2.imread(img_path)
cv2.imwrite("user_markup_top_strip.png", img)
print("Saved user_markup_top_strip.png, shape:", img.shape)

# Let's find the red bounding box
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
# Red in HSV wraps around 0/180
red_mask1 = cv2.inRange(hsv, np.array([0, 150, 150]), np.array([10, 255, 255]))
red_mask2 = cv2.inRange(hsv, np.array([170, 150, 150]), np.array([180, 255, 255]))
red_mask = red_mask1 | red_mask2

cnts, _ = cv2.findContours(red_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
for c in cnts:
    x, y, w, h = cv2.boundingRect(c)
    if w > 100:
        print(f"Red box: x={x}, y={y}, w={w}, h={h}")
