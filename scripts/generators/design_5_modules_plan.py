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

# Splits
STRIP_Y_PX = 56
SPLIT_X_PX = 362
SPLIT_Y_PX = 186

W_LEFT_MM = SPLIT_X_PX * scale_x # ~ 193.0 mm
W_RIGHT_MM = (w - SPLIT_X_PX) * scale_x # ~ 87.0 mm

H_TOP_MM = STRIP_Y_PX * scale_y # ~ 23.3 mm
H_MID_MM = (SPLIT_Y_PX - STRIP_Y_PX) * scale_y # ~ 54.2 mm
H_BOT_MM = (h - SPLIT_Y_PX) * scale_y # ~ 92.5 mm
H_LEFT_MAIN_MM = (h - STRIP_Y_PX) * scale_y # ~ 146.7 mm

# Create visual plan
plan = j2.copy()
overlay = np.zeros_like(plan)

# 1. Module 1: Top-Left (Yellow)
cv2.rectangle(overlay, (0, 0), (SPLIT_X_PX, STRIP_Y_PX), (0, 230, 255), -1)

# 2. Module 2: Top-Right (Blue)
cv2.rectangle(overlay, (SPLIT_X_PX, 0), (w, STRIP_Y_PX), (240, 100, 20), -1)

# 3. Module 3: Mid-Right (Orange)
cv2.rectangle(overlay, (SPLIT_X_PX, STRIP_Y_PX), (w, SPLIT_Y_PX), (20, 130, 255), -1)

# 4. Module 4: Bottom-Right (Pink / Magenta)
cv2.rectangle(overlay, (SPLIT_X_PX, SPLIT_Y_PX), (w, h), (180, 50, 230), -1)

# 5. Module 5: Main Left (Teal / Cyan)
cv2.rectangle(overlay, (0, STRIP_Y_PX), (SPLIT_X_PX, h), (180, 120, 20), -1)

# Blend
blended = cv2.addWeighted(plan, 0.62, overlay, 0.38, 0)

# Cut lines (White / Yellow)
cv2.line(blended, (0, STRIP_Y_PX), (w, STRIP_Y_PX), (255, 255, 255), 2)
cv2.line(blended, (SPLIT_X_PX, 0), (SPLIT_X_PX, h), (255, 255, 255), 2)
cv2.line(blended, (SPLIT_X_PX, SPLIT_Y_PX), (w, SPLIT_Y_PX), (255, 255, 255), 2)

# Borders
cv2.rectangle(blended, (0, 0), (SPLIT_X_PX, STRIP_Y_PX), (0, 220, 255), 2)
cv2.rectangle(blended, (SPLIT_X_PX, 0), (w, STRIP_Y_PX), (255, 120, 0), 2)
cv2.rectangle(blended, (SPLIT_X_PX, STRIP_Y_PX), (w, SPLIT_Y_PX), (0, 140, 255), 2)
cv2.rectangle(blended, (SPLIT_X_PX, SPLIT_Y_PX), (w, h), (255, 50, 255), 2)
cv2.rectangle(blended, (0, STRIP_Y_PX), (SPLIT_X_PX, h), (255, 220, 0), 2)

# Labels
# 1. Top-Left (Yellow)
cv2.putText(blended, "1. TITULO Y LOGO (Amarillo)", (12, 22), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.44, (0, 0, 0), 2)
cv2.putText(blended, f"{W_LEFT_MM:.1f} x {H_TOP_MM:.1f} mm", (12, 42), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 0, 0), 1)

# 2. Top-Right (Blue)
cv2.putText(blended, "2. AVIACION (Azul)", (SPLIT_X_PX + 8, 22), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 2)
cv2.putText(blended, f"{W_RIGHT_MM:.1f} x {H_TOP_MM:.1f} mm", (SPLIT_X_PX + 8, 42), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.36, (255, 255, 255), 1)

# 3. Mid-Right (Orange)
cv2.putText(blended, "3. TORPEDOS (Naranja)", (SPLIT_X_PX + 8, STRIP_Y_PX + 22), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 0, 0), 2)
cv2.putText(blended, f"{W_RIGHT_MM:.1f} x {H_MID_MM:.1f} mm", (SPLIT_X_PX + 8, STRIP_Y_PX + 40), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 0, 0), 1)

# 4. Bottom-Right (Pink)
cv2.putText(blended, "4. ARMAS / SISTEMAS (Rosa)", (SPLIT_X_PX + 8, SPLIT_Y_PX + 25), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 255), 2)
cv2.putText(blended, f"{W_RIGHT_MM:.1f} x {H_BOT_MM:.1f} mm", (SPLIT_X_PX + 8, SPLIT_Y_PX + 44), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

# 5. Main Left (Teal)
cv2.putText(blended, "5. CUERPO PRINCIPAL IZQUIERDO (Comun a los 17)", (20, STRIP_Y_PX + 28), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.50, (255, 255, 255), 2)
cv2.putText(blended, f"{W_LEFT_MM:.1f} x {H_LEFT_MAIN_MM:.1f} mm (Silueta + Patrulla + Danos + Tripulacion)", 
            (20, STRIP_Y_PX + 48), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (220, 255, 255), 1)

cv2.imwrite("planta_5_modulos_arquitectura.png", blended)
print("Saved planta_5_modulos_arquitectura.png")
