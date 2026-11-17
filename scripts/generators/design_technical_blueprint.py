import cv2
import numpy as np
import json

# Physical dimensions
BOARD_W_MM = 280.0
BOARD_H_MM = 170.0

# 2D Blueprint rendering resolution: 4 pixels per mm -> 1120 x 680 pixels
DPI_SCALE = 4.0
w_px = int(BOARD_W_MM * DPI_SCALE) # 1120
h_px = int(BOARD_H_MM * DPI_SCALE) # 680

blueprint = np.full((h_px, w_px, 3), (28, 22, 18), dtype=np.uint8) # Dark technical slate background

# Draw background 10mm grid
for x in range(0, w_px, int(10 * DPI_SCALE)):
    cv2.line(blueprint, (x, 0), (x, h_px), (45, 38, 30), 1)
for y in range(0, h_px, int(10 * DPI_SCALE)):
    cv2.line(blueprint, (0, y), (w_px, y), (45, 38, 30), 1)

# Split coordinates in mm:
SPLIT_X_MM = 193.0
SPLIT_Y_MM = 92.5 # from bottom (77.5 mm from top)

split_x_px = int(SPLIT_X_MM * DPI_SCALE)
split_y_top_px = int((BOARD_H_MM - SPLIT_Y_MM) * DPI_SCALE)

# Draw pieces filled tints
# Piece 1: Left
cv2.rectangle(blueprint, (0, 0), (split_x_px, h_px), (45, 35, 20), -1)
# Piece 2: Top-Right
cv2.rectangle(blueprint, (split_x_px, 0), (w_px, split_y_top_px), (15, 35, 60), -1)
# Piece 3: Bottom-Right
cv2.rectangle(blueprint, (split_x_px, split_y_top_px), (w_px, h_px), (45, 15, 55), -1)

# Draw Piece 1 cutouts
scale_x = BOARD_W_MM / 525.0
scale_y = BOARD_H_MM / 408.0

def mm_to_bp(x_mm, y_mm):
    # in blueprint: x from 0, y from top (BOARD_H_MM - y_mm)
    return int(x_mm * DPI_SCALE), int((BOARD_H_MM - y_mm) * DPI_SCALE)

# Load grid_definition
with open('grid_definition.json') as f:
    grid = json.load(f)

# 1. Counter holes on Left (Piece 1)
half_box_px = int((13.2 / 2.0) * DPI_SCALE)
notch_r_px = int(1.6 * DPI_SCALE)

for sec in ['base_mission_port', 'patrol_track', 'damage_flooding', 'damage_hull', 'crew']:
    for b in grid.get(sec, []):
        px, py, pw, ph = b['box']
        cx_mm = (px + pw/2.0) * scale_x
        cy_mm = (408.0 - (py + ph/2.0)) * scale_y
        cx_bp, cy_bp = mm_to_bp(cx_mm, cy_mm)
        # Draw box
        cv2.rectangle(blueprint, (cx_bp - half_box_px, cy_bp - half_box_px), 
                      (cx_bp + half_box_px, cy_bp + half_box_px), (0, 220, 255), 1)
        # Draw notch
        cv2.circle(blueprint, (cx_bp + half_box_px, cy_bp), notch_r_px, (0, 220, 255), 1)

# 2. Windows on Left (Piece 1)
def draw_window(x0_mm, y0_mm, x1_mm, y1_mm, label):
    p0_x, p0_y = mm_to_bp(x0_mm, y1_mm)
    p1_x, p1_y = mm_to_bp(x1_mm, y0_mm)
    cv2.rectangle(blueprint, (p0_x, p0_y), (p1_x, p1_y), (255, 255, 255), 1)
    cv2.putText(blueprint, label, (p0_x + 6, p0_y + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (200, 200, 200), 1)

# Logo
draw_window(22.0*scale_x, (408-48)*scale_y, 130.0*scale_x, (408-16)*scale_y, "VENTANA LOGO")
# Title
draw_window(138.0*scale_x, (408-58)*scale_y, 312.0*scale_x, (408-20)*scale_y, "VENTANA CLASE Y FECHA")
# Silhouette
draw_window(100.0*scale_x, (408-118)*scale_y, 328.0*scale_x, (408-60)*scale_y, "VENTANA DIBUJO SUBMARINO (SILUETA)")
# Stats
draw_window(104.0*scale_x, (408-317)*scale_y, 342.0*scale_x, (408-295)*scale_y, "VENTANA ESTADISTICAS TECNICAS")

# 3. Piece 2 (Top-Right): Torpedos, Reloads, Aircraft
# Aircraft slots (Row 0):
for c_px in [384, 414, 444, 474]:
    cx_mm = (c_px + 14.0) * scale_x
    cy_mm = (408.0 - (23.0 + 14.0)) * scale_y
    cx_bp, cy_bp = mm_to_bp(cx_mm, cy_mm)
    cv2.rectangle(blueprint, (cx_bp - half_box_px, cy_bp - half_box_px), 
                  (cx_bp + half_box_px, cy_bp + half_box_px), (0, 160, 255), 1)
    cv2.circle(blueprint, (cx_bp + half_box_px, cy_bp), notch_r_px, (0, 160, 255), 1)

# Torpedo tubes (Rows 1 & 2):
for r_px in [57, 87]:
    for c_px in [384, 414, 444, 474]:
        cx_mm = (c_px + 14.0) * scale_x
        cy_mm = (408.0 - (r_px + 14.0)) * scale_y
        cx_bp, cy_bp = mm_to_bp(cx_mm, cy_mm)
        cv2.rectangle(blueprint, (cx_bp - half_box_px, cy_bp - half_box_px), 
                      (cx_bp + half_box_px, cy_bp + half_box_px), (0, 160, 255), 1)
        cv2.circle(blueprint, (cx_bp + half_box_px, cy_bp), notch_r_px, (0, 160, 255), 1)

# Reloads bin:
rcx_mm = (384.0 + 118.0 / 2.0) * scale_x
rcy_mm = (408.0 - (120.0 + 60.0 / 2.0)) * scale_y
bw_mm = 118.0 * scale_x
bh_mm = 60.0 * scale_y
bx0_bp, by0_bp = mm_to_bp(rcx_mm - bw_mm/2.0, rcy_mm + bh_mm/2.0)
bx1_bp, by1_bp = mm_to_bp(rcx_mm + bw_mm/2.0, rcy_mm - bh_mm/2.0)
cv2.rectangle(blueprint, (bx0_bp, by0_bp), (bx1_bp, by1_bp), (0, 180, 255), 1)
cv2.putText(blueprint, "CAJON RECARGAS TORPEDOS / MINAS", (bx0_bp + 6, by0_bp + 18), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.36, (0, 180, 255), 1)

# 4. Piece 3 (Bottom-Right): Guns, Kaiten & Systems Status
# Guns / Kaiten (Rows 4 & 5):
for r_px in [194, 223]:
    for c_px in [384, 414, 444, 474]:
        cx_mm = (c_px + 14.0) * scale_x
        cy_mm = (408.0 - (r_px + 14.0)) * scale_y
        cx_bp, cy_bp = mm_to_bp(cx_mm, cy_mm)
        cv2.rectangle(blueprint, (cx_bp - half_box_px, cy_bp - half_box_px), 
                      (cx_bp + half_box_px, cy_bp + half_box_px), (255, 50, 255), 1)
        cv2.circle(blueprint, (cx_bp + half_box_px, cy_bp), notch_r_px, (255, 50, 255), 1)

# Systems (Rows 6-10):
for r_px in [241, 271, 301, 331, 361]:
    for c_px in [384, 414, 444, 474]:
        cx_mm = (c_px + 14.0) * scale_x
        cy_mm = (408.0 - (r_px + 14.0)) * scale_y
        cx_bp, cy_bp = mm_to_bp(cx_mm, cy_mm)
        cv2.rectangle(blueprint, (cx_bp - half_box_px, cy_bp - half_box_px), 
                      (cx_bp + half_box_px, cy_bp + half_box_px), (255, 50, 255), 1)
        cv2.circle(blueprint, (cx_bp + half_box_px, cy_bp), notch_r_px, (255, 50, 255), 1)

# Draw boundary separation cuts with dashed lines / joints
cv2.line(blueprint, (split_x_px, 0), (split_x_px, h_px), (0, 255, 255), 2)
cv2.line(blueprint, (split_x_px, split_y_top_px), (w_px, split_y_top_px), (0, 255, 255), 2)

# Outer border
cv2.rectangle(blueprint, (0, 0), (w_px - 1, h_px - 1), (120, 120, 120), 1)

# Add large title banners
cv2.putText(blueprint, "PLANTA MODULAR 3 PIEZAS - SENSUIKAN", (20, h_px - 25), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
cv2.putText(blueprint, f"Dimension Total: {BOARD_W_MM:.1f} x {BOARD_H_MM:.1f} mm | Tolerancia ensamble: 0.20 mm", 
            (20, h_px - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 180, 180), 1)

# Section Headers
cv2.putText(blueprint, "PIEZA 1: MODULO IZQUIERDO COMUN", (25, 45), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 220, 255), 2)
cv2.putText(blueprint, f"193.0 x 170.0 mm (Comun a los 17 submarinos)", (25, 65), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.42, (200, 255, 255), 1)

cv2.putText(blueprint, "PIEZA 2: TORPEDOS / AVION", (split_x_px + 15, 30), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 160, 255), 2)
cv2.putText(blueprint, f"87.0 x 77.5 mm", (split_x_px + 15, 48), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 255, 255), 1)

cv2.putText(blueprint, "PIEZA 3: ARMAS / SISTEMAS", (split_x_px + 15, split_y_top_px + 28), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.48, (255, 50, 255), 2)
cv2.putText(blueprint, f"87.0 x 92.5 mm", (split_x_px + 15, split_y_top_px + 46), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 255, 255), 1)

cv2.imwrite("planta_3_piezas_tecnica.png", blueprint)
print("Saved planta_3_piezas_tecnica.png")
