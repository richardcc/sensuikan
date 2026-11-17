import cv2
import numpy as np

# Let's inspect the torpedo tubes and systems rows of all 17 classes
# Let's classify each of the 17 classes as either:
# Layout Alpha (Cruiser/Aviation: 2 rows of tubes, higher bin, Crane/Hangar, AA gun)
# Layout Beta (Attack/Kaidai: 3 rows of tubes, lower bin, no Crane/Hangar, no AA gun)
# Layout Gamma (Kaiten / Special)

# Let's inspect every single photo from thumb_00 to thumb_16 + j2:
import glob

# In each thumb, check if it has 3 rows of tubes or 2 rows of tubes:
# Row 1 of tubes: y ~ 20-25%
# Row 2 of tubes: y ~ 28-32%
# Row 3 of tubes: y ~ 35-40% -> If boxes exist at y ~ 35-40%, it's Layout Beta (3 rows)!

# Let's test this!
results = {}
for idx in range(18):
    if idx == 1:
        continue # Midget excluded
    if idx < 17:
        im = cv2.imread(f"photos/thumb_{idx:02d}.jpg")
    else:
        im = cv2.imread("junsen_j2.png")
    h, w = im.shape[:2]
    # Crop right 35%, y from 20% to 45%
    tube_area = im[int(h*0.20):int(h*0.45), int(w*0.65):]
    # detect boxes
    gray = cv2.cvtColor(tube_area, cv2.COLOR_BGR2GRAY)
    thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
    cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    # check if boxes exist in the lower third of tube_area (which corresponds to row 3 of tubes)
    th_h = tube_area.shape[0]
    has_row3 = False
    for c in cnts:
        bx, by, bw, bh = cv2.boundingRect(c)
        if 15 <= bw <= 45 and 15 <= bh <= 45:
            if by > th_h * 0.60:
                has_row3 = True
                break
    results[idx] = "Layout Beta (3 Filas Tubos)" if has_row3 else "Layout Alpha (2 Filas Tubos)"

names = {
    0: "Type C. 3 (Kaiten)",
    2: "Type A",
    3: "Sen-Toku (I-400)",
    4: "Junsen J. 1M",
    5: "Type A Modified",
    6: "Type B",
    7: "Type B. 3",
    8: "Type C",
    9: "Kaidai KD. 6",
    10: "Sen-Taka",
    11: "Junsen J. 3",
    12: "Kaidai KD. 3",
    13: "Kaidai KD. 4",
    14: "Kaidai KD. 7",
    15: "Kirai-Sen",
    16: "Kaidai KD. 5",
    17: "Junsen J. 2"
}

print("=== CLASSIFICATION OF THE 17 SUBMARINES BY RIGHT LAYOUT ===")
for idx in sorted(results.keys()):
    print(f"Card {idx:02d} ({names[idx]:25s}): {results[idx]}")
