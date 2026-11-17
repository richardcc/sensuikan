import cv2
import numpy as np

# Load Junsen J.2 image
j2 = cv2.imread("junsen_j2.png")
h, w = j2.shape[:2] # 408, 525

# Physical dimensions
BOARD_W_MM = 280.0
BOARD_H_MM = 170.0
scale_x = BOARD_W_MM / w
scale_y = BOARD_H_MM / h

# Strip top: y in [0, 56]
STRIP_Y_PX = 56
STRIP_H_MM = STRIP_Y_PX * scale_y # ~ 23.3 mm

# Split X for the right column: x = 362
SPLIT_X_PX = 362
SPLIT_X_MM = SPLIT_X_PX * scale_x # ~ 193.0 mm

# Split Y for the right column: y = 186
SPLIT_Y_PX = 186
MID_H_MM = (SPLIT_Y_PX - STRIP_Y_PX) * scale_y # ~ 54.2 mm
BOT_H_MM = (h - SPLIT_Y_PX) * scale_y # ~ 92.5 mm

# Create visual plan
plan = j2.copy()
overlay = np.zeros_like(plan)

# Color each of the 4 modules:
# 1. Top Strip (Red outline / tint)
cv2.rectangle(overlay, (0, 0), (w, STRIP_Y_PX), (0, 0, 220), -1)

# 2. Main Left Board (Teal tint)
cv2.rectangle(overlay, (0, STRIP_Y_PX), (SPLIT_X_PX, h), (180, 100, 30), -1)

# 3. Mid-Right Torpedoes & Reloads (Orange tint)
cv2.rectangle(overlay, (SPLIT_X_PX, STRIP_Y_PX), (w, SPLIT_Y_PX), (20, 130, 240), -1)

# 4. Bottom-Right Guns & Systems (Magenta tint)
cv2.rectangle(overlay, (SPLIT_X_PX, SPLIT_Y_PX), (w, h), (180, 50, 220), -1)

blended = cv2.addWeighted(plan, 0.65, overlay, 0.35, 0)

# Draw distinct cut lines
# Horizontal top cut
cv2.line(blended, (0, STRIP_Y_PX), (w, STRIP_Y_PX), (0, 255, 255), 2)
# Vertical right cut
cv2.line(blended, (SPLIT_X_PX, STRIP_Y_PX), (SPLIT_X_PX, h), (0, 255, 255), 2)
# Horizontal mid-right cut
cv2.line(blended, (SPLIT_X_PX, SPLIT_Y_PX), (w, SPLIT_Y_PX), (0, 255, 255), 2)

# Borders
cv2.rectangle(blended, (0, 0), (w, STRIP_Y_PX), (0, 0, 255), 2)
cv2.rectangle(blended, (0, STRIP_Y_PX), (SPLIT_X_PX, h), (255, 200, 0), 2)
cv2.rectangle(blended, (SPLIT_X_PX, STRIP_Y_PX), (w, SPLIT_Y_PX), (0, 140, 255), 2)
cv2.rectangle(blended, (SPLIT_X_PX, SPLIT_Y_PX), (w, h), (255, 0, 255), 2)

# Add text labels with millimeter dimensions
cv2.putText(blended, "MODULO 1 (SUPERIOR): TIRA DE IDENTIFICACION Y AVIACION (280.0 x 23.3 mm)", 
            (15, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 2)
cv2.putText(blended, "Logo + Clase/Fecha + Hidroavion / Eventos", 
            (15, 42), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (200, 255, 255), 1)

cv2.putText(blended, "MODULO 2: TABLERO PRINCIPAL IZQUIERDO", (20, STRIP_Y_PX + 25), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.50, (255, 255, 255), 2)
cv2.putText(blended, f"193.0 x 146.7 mm (Silueta + Patrulla + Danos + Tripulacion)", (20, STRIP_Y_PX + 45), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 255, 255), 1)

cv2.putText(blended, "MODULO 3: TORPEDOS Y RECARGAS", (SPLIT_X_PX + 8, STRIP_Y_PX + 20), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 180, 255), 2)
cv2.putText(blended, f"87.0 x 54.2 mm", (SPLIT_X_PX + 8, STRIP_Y_PX + 36), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

cv2.putText(blended, "MODULO 4: ARMAS Y SISTEMAS", (SPLIT_X_PX + 8, SPLIT_Y_PX + 25), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 100, 255), 2)
cv2.putText(blended, f"87.0 x 92.5 mm", (SPLIT_X_PX + 8, SPLIT_Y_PX + 42), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

cv2.imwrite("planta_nueva_4_modulos.png", blended)
print("Saved planta_nueva_4_modulos.png")
