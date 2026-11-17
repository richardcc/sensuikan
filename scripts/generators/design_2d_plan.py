import cv2
import numpy as np

# Load Junsen J.2 image
j2 = cv2.imread("junsen_j2.png")
h, w = j2.shape[:2] # 408, 525

# Physical dimensions
WIDTH_MM = 280.0
HEIGHT_MM = 170.0
scale_x = WIDTH_MM / w  # mm per pixel X
scale_y = HEIGHT_MM / h # mm per pixel Y

# Split X:
# The user's orange and pink boxes start at x = 360 px in 525x408 space!
# 360 px * (280 / 525) = 192.0 mm!
SPLIT_X_PX = 362
SPLIT_X_MM = SPLIT_X_PX * scale_x # ~ 193.1 mm

# Split Y between Orange (Piece 2) and Pink (Piece 3):
# Orange box contains:
# - Aircraft (y ~ 22)
# - Forward Tubes (y ~ 57)
# - Aft Tubes (y ~ 87)
# - Forward Reloads Bin (y ~ 120 to 180)
# Pink box starts at Deck Gun (y ~ 190 to 194)
# So the split line Y is between y=182 and y=190: let's place it at y = 186 px!
# 186 px * (170 / 408) = 77.5 mm from the top!
SPLIT_Y_PX = 186
SPLIT_Y_MM = (h - SPLIT_Y_PX) * scale_y # measured from bottom: ~ 92.5 mm

# Create an architectural blueprint layout visualization
plan = j2.copy()

# Dim background slightly
overlay = np.zeros_like(plan)

# 1. Piece 1: Left Module (0 to SPLIT_X_PX, 0 to h)
cv2.rectangle(overlay, (0, 0), (SPLIT_X_PX, h), (180, 100, 30), -1) # Blueish-teal tint

# 2. Piece 2: Top-Right Module (SPLIT_X_PX to w, 0 to SPLIT_Y_PX)
cv2.rectangle(overlay, (SPLIT_X_PX, 0), (w, SPLIT_Y_PX), (20, 120, 240), -1) # Orange tint

# 3. Piece 3: Bottom-Right Module (SPLIT_X_PX to w, SPLIT_Y_PX to h)
cv2.rectangle(overlay, (SPLIT_X_PX, SPLIT_Y_PX), (w, h), (180, 50, 220), -1) # Pink / Magenta tint

# Blend overlay with 35% opacity
plan_colored = cv2.addWeighted(plan, 0.65, overlay, 0.35, 0)

# Draw thick separation cut lines
# Vertical cut: Piece 1 vs (Piece 2 + 3)
cv2.line(plan_colored, (SPLIT_X_PX, 0), (SPLIT_X_PX, h), (0, 255, 255), 2)
# Horizontal cut: Piece 2 vs Piece 3
cv2.line(plan_colored, (SPLIT_X_PX, SPLIT_Y_PX), (w, SPLIT_Y_PX), (0, 255, 255), 2)

# Draw perimeter borders
cv2.rectangle(plan_colored, (0, 0), (SPLIT_X_PX, h), (255, 200, 0), 2)
cv2.rectangle(plan_colored, (SPLIT_X_PX, 0), (w, SPLIT_Y_PX), (0, 140, 255), 2)
cv2.rectangle(plan_colored, (SPLIT_X_PX, SPLIT_Y_PX), (w, h), (255, 0, 255), 2)

# Add clear labels and dimensions
cv2.putText(plan_colored, "PIEZA 1: MODULO IZQUIERDO", (20, 30), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
cv2.putText(plan_colored, f"193 x 170 mm (Comun 17 submarinos)", (20, 50), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 255, 255), 1)

cv2.putText(plan_colored, "PIEZA 2: TORPEDOS / AVION", (SPLIT_X_PX + 8, 20), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 180, 255), 2)
cv2.putText(plan_colored, f"87 x 78 mm", (SPLIT_X_PX + 8, 38), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 255), 1)

cv2.putText(plan_colored, "PIEZA 3: ARMAS / SISTEMAS", (SPLIT_X_PX + 8, SPLIT_Y_PX + 25), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 100, 255), 2)
cv2.putText(plan_colored, f"87 x 92 mm", (SPLIT_X_PX + 8, SPLIT_Y_PX + 42), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 255), 1)

# Save plan
cv2.imwrite("planta_3_piezas_overview.png", plan_colored)
print("Saved planta_3_piezas_overview.png")
