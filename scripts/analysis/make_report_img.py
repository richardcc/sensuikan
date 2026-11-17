import cv2
import numpy as np

# Load our simulation and comparison images and create a master visual report
sim = cv2.imread("universal_overlay_simulation.jpg")

# Add a banner on top of the simulation
header = np.zeros((80, sim.shape[1], 3), dtype=np.uint8)
cv2.putText(header, "SENSUIKAN - MODULAR DUAL-LAYER PLAYER BOARD (UNIVERSAL SUPERSET)", (30, 35), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)
cv2.putText(header, "1 Universal Left Module + 1 Universal Right Module covers ALL 18 Submarine Classes!", (30, 65), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 255), 1)

full_report_img = np.vstack([header, sim])
cv2.imwrite("universal_system_overview.jpg", full_report_img)
print("Saved universal_system_overview.jpg")
