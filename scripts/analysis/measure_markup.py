import cv2
import numpy as np

img = cv2.imread("user_markup.png")
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

# Orange outline
# Pink outline
# Let's find contours of colored lines:
# Orange line is roughly H: 10-25, S > 150, V > 150
# Pink line is roughly H: 140-170, S > 100, V > 150

orange_mask = cv2.inRange(hsv, np.array([5, 150, 150]), np.array([25, 255, 255]))
pink_mask = cv2.inRange(hsv, np.array([140, 80, 150]), np.array([175, 255, 255]))

cnts_orange, _ = cv2.findContours(orange_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
cnts_pink, _ = cv2.findContours(pink_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

print("Orange boxes:")
for c in cnts_orange:
    x, y, w, h = cv2.boundingRect(c)
    if w > 50 and h > 50:
        print(f"  Orange: x={x}, y={y}, w={w}, h={h}")

print("Pink boxes:")
for c in cnts_pink:
    x, y, w, h = cv2.boundingRect(c)
    if w > 50 and h > 50:
        print(f"  Pink: x={x}, y={y}, w={w}, h={h}")

# Also find the main game board corners inside the screenshot
# The blue board
blue_mask = cv2.inRange(hsv, np.array([95, 50, 50]), np.array([130, 255, 255]))
cnts_board, _ = cv2.findContours(blue_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
largest = max(cnts_board, key=cv2.contourArea)
bx, by, bw, bh = cv2.boundingRect(largest)
print(f"Main board area: x={bx}, y={by}, w={bw}, h={bh}")
