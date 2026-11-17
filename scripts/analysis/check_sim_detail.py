import cv2
import numpy as np

# Let's inspect the alignment on each quadrant of universal_overlay_simulation.jpg
sim = cv2.imread("universal_overlay_simulation.jpg")
h, w = sim.shape[:2]

# Quadrant 1: J.2
q1 = sim[0:h//2, 0:w//2]
# Quadrant 2: SenToku
q2 = sim[0:h//2, w//2:]
# Quadrant 3: Type C.3
q3 = sim[h//2:, 0:w//2]
# Quadrant 4: Kaidai KD.6
q4 = sim[h//2:, w//2:]

# Let's crop the right side of each quadrant to inspect closely
cv2.imwrite("sim_detail_j2.png", q1[:, 330:])
cv2.imwrite("sim_detail_sentoku.png", q2[:, 330:])
cv2.imwrite("sim_detail_c3.png", q3[:, 330:])
cv2.imwrite("sim_detail_kaidai.png", q4[:, 330:])
print("Saved sim details")
