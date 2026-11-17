import cv2
import numpy as np

# Let's inspect the right halves of several distinct types:
# Type 17: Junsen J. 2 (Fleet cruiser submarine with 1 aircraft)
# Type 03: Sen-Toku (I-400 mega sub with 3 aircraft)
# Type 01: Type A Midget Ko-Hyoteki (Tiny midget sub)
# Type 15: Kirai-Sen (Minelayer submarine)
# Type 00: Type C. 3 (Kaiten carrier)
# Type 10: Sen-Taka (High speed sub)
# Type 06: Type B (Standard fleet sub)
# Type 09: Kaidai KD. 6 (Fleet submarine)

classes_to_check = [17, 3, 1, 15, 0, 10, 6, 9]
# Save individual high-res crops of the right side for analysis
for c in range(17):
    img = cv2.imread(f"photos/thumb_{c:02d}.jpg")
    h, w, _ = img.shape
    right_side = img[:, int(w*0.58):]
    cv2.imwrite(f"photos/right_detail_{c:02d}.png", right_side)

j2 = cv2.imread("junsen_j2.png")
h, w, _ = j2.shape
cv2.imwrite("photos/right_detail_17_j2.png", j2[:, int(w*0.58):])
print("Saved right details")
