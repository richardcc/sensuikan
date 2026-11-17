import cv2
import numpy as np

# Let's inspect sim_detail_j2.png and sim_detail_sentoku.png
# Let's check how many boxes on each card are accurately framed by the green rectangles!
j2_det = cv2.imread("sim_detail_j2.png")
sentoku_det = cv2.imread("sim_detail_sentoku.png")
c3_det = cv2.imread("sim_detail_c3.png")
kaidai_det = cv2.imread("sim_detail_kaidai.png")

# Combine all 4 side-by-side for comparison
comp = np.hstack([j2_det, sentoku_det, c3_det, kaidai_det])
cv2.imwrite("sim_detail_all4.png", comp)
print("Saved sim_detail_all4.png (size:", comp.shape, ")")
