import cv2
import numpy as np

# Load stacked_cards.png
img = cv2.imread("stacked_cards.png")
# Let's inspect the x coordinates of the text "Sen-Toku Class" and "Random Event"
# In stacked_cards.png, the Sen-Toku row is around y: 180 to 260

sentoku_strip = img[180:260, :]
cv2.imwrite("sentoku_full_strip.png", sentoku_strip)

# Let's also inspect thumb_03.jpg (Sen-Toku) in 525x408 space:
sentoku = cv2.imread("photos/thumb_03.jpg")
sentoku = cv2.resize(sentoku, (525, 408))

# Let's find where "Random Event" 1 starts in Sen-Toku:
# In Sen-Toku:
# Title is "Sen-Toku Class" (available December 1944) 4 month patrols
# Right after the subtitle "(available December 1944)", Random Event 1 begins!
# Where does Random Event 1 start in 525x408 space?
# Let's detect boxes in y in [10, 60] of Sen-Toku:
gray = cv2.cvtColor(sentoku[10:60, :], cv2.COLOR_BGR2GRAY)
thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

boxes = []
for c in cnts:
    x, y, w, h = cv2.boundingRect(c)
    if 20 <= w <= 40 and 20 <= h <= 40:
        boxes.append((x, y + 10, w, h))

boxes = sorted(boxes, key=lambda b: b[0])
print("Sen-Toku top row boxes in 525x408 space:")
for b in boxes:
    print(f"  x={b[0]}, y={b[1]}, w={b[2]}, h={b[3]}")
