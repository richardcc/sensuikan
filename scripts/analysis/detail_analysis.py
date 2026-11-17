import cv2
import numpy as np

# Let's write an HTML report or inspect each photo's right half
# We will create an image that lists:
# [Class Index & Name] | [Aircraft area] | [Tubes area] | [Reloads area] | [Guns/Kaiten area] | [Systems area]

titles = [
    "Type C.3 (Kaiten)",         # 00
    "Type A Midget",             # 01
    "Type A",                    # 02
    "Sen-Toku (I-400)",          # 03
    "Junsen J.1M",               # 04
    "Type A Mod",                # 05
    "Type B",                    # 06
    "Type B.3",                  # 07
    "Type C",                    # 08
    "Kaidai KD.6",               # 09
    "Sen-Taka",                  # 10
    "Junsen J.3",                # 11
    "Kaidai KD.3",               # 12
    "Kaidai KD.4",               # 13
    "Kaidai KD.7",               # 14
    "Kirai-Sen (Minelayer)",     # 15
    "Kaidai KD.5",               # 16
    "Junsen J.2"                 # 17
]

# Let's inspect the differences across the sheets
# Let's save a clean image for each of the 18 classes right half at 400x500
for i in range(17):
    img = cv2.imread(f"photos/thumb_{i:02d}.jpg")
    img = cv2.resize(img, (525, 408))
    right = img[:, 340:]
    cv2.putText(right, titles[i], (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
    cv2.imwrite(f"photos/class_right_{i:02d}.png", right)

j2 = cv2.imread("junsen_j2.png")
right_j2 = j2[:, 340:]
cv2.putText(right_j2, titles[17], (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 1)
cv2.imwrite("photos/class_right_17.png", right_j2)
print("Saved 18 class right crops.")
