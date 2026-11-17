import cv2
import numpy as np
import json

# Master Blueprint v3: Complete 2D Technical Architecture with Pareja A & Pareja B
W_CANVAS = 1650
H_CANVAS = 1350
canvas = np.full((H_CANVAS, W_CANVAS, 3), (24, 20, 16), dtype=np.uint8)

BOARD_W_MM = 280.0
BOARD_H_MM = 170.0

SCALE_BP = 2.6
bp_w = int(BOARD_W_MM * SCALE_BP) # 728 px
bp_h = int(BOARD_H_MM * SCALE_BP) # 442 px

# Helper function
def mm_to_canvas(bx, by, x_mm, y_mm_from_top):
    return bx + int(x_mm * SCALE_BP), by + int(y_mm_from_top * SCALE_BP)

# Render two boards on the top:
# Board 1: Layout A (Cruceros con Aviacion) at (40, 80)
# Board 2: Layout B (Submarinos de Ataque) at (840, 80)

def draw_base_board(bx0, by0, title_board, is_layout_b=False):
    # Dimensions in mm:
    split_x1 = 158.0 # Top strip split
    split_x2 = 193.0 # Lower body split
    strip_h = 23.3
    
    # In Layout A: split_y between P3 and P4 is at 77.5 mm from top
    # In Layout B: split_y between P3 and P4 is lower, at ~ 88.0 mm from top (because 3rd tube row pushed reloads down)
    split_y2 = 88.0 if is_layout_b else 77.5
    
    sx1_px = int(split_x1 * SCALE_BP)
    sx2_px = int(split_x2 * SCALE_BP)
    sh_px = int(strip_h * SCALE_BP)
    sy2_px = int(split_y2 * SCALE_BP)
    
    # 10mm grid
    for x in range(0, bp_w, int(10 * SCALE_BP)):
        cv2.line(canvas, (bx0 + x, by0), (bx0 + x, by0 + bp_h), (35, 30, 24), 1)
    for y in range(0, bp_h, int(10 * SCALE_BP)):
        cv2.line(canvas, (bx0, by0 + y), (bx0 + bp_w, by0 + y), (35, 30, 24), 1)
        
    # Tints
    # P1 (Yellow)
    cv2.rectangle(canvas, (bx0, by0), (bx0 + sx1_px, by0 + sh_px), (15, 45, 55), -1)
    # P2 (Blue)
    cv2.rectangle(canvas, (bx0 + sx1_px, by0), (bx0 + bp_w, by0 + sh_px), (55, 30, 15), -1)
    # P3 (Orange)
    cv2.rectangle(canvas, (bx0 + sx2_px, by0 + sh_px), (bx0 + bp_w, by0 + sy2_px), (15, 35, 60), -1)
    # P4 (Pink)
    cv2.rectangle(canvas, (bx0 + sx2_px, by0 + sy2_px), (bx0 + bp_w, by0 + bp_h), (45, 15, 55), -1)
    # P5 (Teal)
    cv2.rectangle(canvas, (bx0, by0 + sh_px), (bx0 + sx2_px, by0 + bp_h), (45, 35, 20), -1)
    
    # Outer & Cut borders
    cv2.line(canvas, (bx0, by0 + sh_px), (bx0 + bp_w, by0 + sh_px), (255, 255, 255), 2)
    cv2.line(canvas, (bx0 + sx1_px, by0), (bx0 + sx1_px, by0 + sh_px), (0, 255, 255), 2)
    cv2.line(canvas, (bx0 + sx2_px, by0 + sh_px), (bx0 + sx2_px, by0 + bp_h), (255, 255, 255), 2)
    cv2.line(canvas, (bx0 + sx2_px, by0 + sy2_px), (bx0 + bp_w, by0 + sy2_px), (255, 255, 255), 2)
    cv2.rectangle(canvas, (bx0, by0), (bx0 + bp_w, by0 + bp_h), (180, 180, 180), 2)
    
    # Board Title
    cv2.putText(canvas, title_board, (bx0 + 10, by0 - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (255, 255, 255), 2)
    
    # P1 Windows
    scale_x = BOARD_W_MM / 525.0
    scale_y = BOARD_H_MM / 408.0
    
    # Logo
    lx0, ly0 = mm_to_canvas(bx0, by0, 22.0 * scale_x, 16.0 * scale_y)
    lx1, ly1 = mm_to_canvas(bx0, by0, 130.0 * scale_x, 48.0 * scale_y)
    cv2.rectangle(canvas, (lx0, ly0), (lx1, ly1), (0, 230, 255), 1)
    
    # Title
    tx0, ty0 = mm_to_canvas(bx0, by0, 138.0 * scale_x, 20.0 * scale_y)
    tx1, ty1 = mm_to_canvas(bx0, by0, 285.0 * scale_x, 52.0 * scale_y)
    cv2.rectangle(canvas, (tx0, ty0), (tx1, ty1), (0, 230, 255), 1)
    
    # P5 Silhouette
    sx0, sy0 = mm_to_canvas(bx0, by0, 100.0 * scale_x, 60.0 * scale_y)
    sx1, sy1 = mm_to_canvas(bx0, by0, 328.0 * scale_x, 118.0 * scale_y)
    cv2.rectangle(canvas, (sx0, sy0), (sx1, sy1), (255, 255, 255), 1)
    cv2.putText(canvas, "SILUETA BUQUE", (sx0 + 8, sy0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)
    
    # Labels inside board
    cv2.putText(canvas, "P1: TITULO/LOGO (158x23mm)", (bx0 + 8, by0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.34, (0, 230, 255), 1)
    cv2.putText(canvas, "P5: CUERPO IZQUIERDO (193x147mm) [COMUN]", (bx0 + 8, by0 + sh_px + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (0, 220, 255), 1)

# Draw Board A (Layout 1: Cruceros con Aviacion)
draw_base_board(40, 80, "LAYOUT A: CRUCEROS CON AVIACION (Junsen, Tipo A, Tipo B, Sen-Toku)", is_layout_b=False)

# Add Layout A specific details
# P2A: Aircraft window + 2 planes + 2 events
cv2.putText(canvas, "P2A: AVIACION (122x23mm)", (40 + int(158*SCALE_BP) + 6, 80 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (255, 120, 0), 1)
# P3A: Torpedos Crucero (2 filas + cajon alto)
cv2.putText(canvas, "P3A: TORPEDOS CRUCERO (87x54mm)", (40 + int(193*SCALE_BP) + 6, 80 + int(23.3*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (0, 160, 255), 1)
cv2.putText(canvas, "2 Filas Tubos (4+2) + Cajon Alto", (40 + int(193*SCALE_BP) + 6, 80 + int(23.3*SCALE_BP) + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (200, 200, 200), 1)
# P4A: Sistemas Crucero (Canon + AA + Grua/Hangar + 5 filas)
cv2.putText(canvas, "P4A: SISTEMAS CRUCERO (87x93mm)", (40 + int(193*SCALE_BP) + 6, 80 + int(77.5*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (255, 50, 255), 1)
cv2.putText(canvas, "Canon + AA + Grua/Hangar (5 Filas)", (40 + int(193*SCALE_BP) + 6, 80 + int(77.5*SCALE_BP) + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (200, 200, 200), 1)

# Draw Board B (Layout 2: Submarinos de Ataque de 8 Tubos)
draw_base_board(860, 80, "LAYOUT B: SUBMARINOS DE ATAQUE (Kaidai KD.3 a 7, Tipo C, Sen-Taka)", is_layout_b=True)

# Add Layout B specific details
# P2A (Compatible)
cv2.putText(canvas, "P2A: COMPATIBLE (122x23mm)", (860 + int(158*SCALE_BP) + 6, 80 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (255, 120, 0), 1)
# P3B: Torpedos Ataque (3 filas + cajon bajo)
cv2.putText(canvas, "P3B: TORPEDOS ATAQUE (87x65mm)", (860 + int(193*SCALE_BP) + 6, 80 + int(23.3*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (0, 160, 255), 1)
cv2.putText(canvas, "3 Filas Tubos (4+2+2) + Cajon Bajo", (860 + int(193*SCALE_BP) + 6, 80 + int(23.3*SCALE_BP) + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (200, 200, 200), 1)
# P4B: Sistemas Ataque (Canon 120mm sin AA + Sin Grua/Hangar + 4 filas)
cv2.putText(canvas, "P4B: SISTEMAS ATAQUE (87x82mm)", (860 + int(193*SCALE_BP) + 6, 80 + int(88.0*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (255, 50, 255), 1)
cv2.putText(canvas, "Canon Solo (NO AA) + Sin Hangar (4 Filas)", (860 + int(193*SCALE_BP) + 6, 80 + int(88.0*SCALE_BP) + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (200, 200, 200), 1)

# =========================================================================
# BOTTOM HALF: UPDATED 17-SUBMARINE MAPPING TABLE
# =========================================================================
table_y0 = 80 + bp_h + 40
cv2.putText(canvas, "MAPEO ACTUALIZADO DE PIEZAS (CON PAREJA A Y PAREJA B)", (40, table_y0), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

th_y = table_y0 + 20
cols_x = [40, 90, 290, 480, 710, 940, 1170, 1580]

cv2.rectangle(canvas, (cols_x[0], th_y), (cols_x[-1], th_y + 30), (50, 40, 30), -1)
cv2.rectangle(canvas, (cols_x[0], th_y), (cols_x[-1], th_y + 30), (150, 150, 150), 1)

headers = ["#", "Clase Submarino", "Pieza 1 (Titulo)", "Pieza 2 (Aviacion)", "Pieza 3 (Torpedos)", "Pieza 4 (Sistemas)", "Pieza 5 (Cuerpo Izq.)"]
for i, h_text in enumerate(headers):
    cv2.putText(canvas, h_text, (cols_x[i] + 8, th_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 255), 1)

# Grouped data:
subs_data = [
    # GRUPO A: CRUCEROS CON AVIACION (Usan Pareja 3A + 4A)
    ("01", "Junsen J. 2", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("02", "Junsen J. 1M", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("03", "Junsen J. 3", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("04", "Type A (Mando)", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("05", "Type A Modified", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("06", "Type B", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("07", "Type B. 3", "P1 (158x23mm)", "Pieza 2A (Avion)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    ("08", "Sen-Toku (I-400)", "P1 (158x23mm)", "PIEZA 2B (3 Seiran)", "Pieza 3A (Crucero)", "Pieza 4A (Grua/Hangar)", "P5 Común 17"),
    # GRUPO B: ATAQUE PURO Y 8 TUBOS (Usan Pareja 3B + 4B)
    ("09", "Type C", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("10", "Type C. 3 (Kaiten)", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (6 Kaiten)", "P5 Común 17"),
    ("11", "Kaidai KD. 3", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("12", "Kaidai KD. 4", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("13", "Kaidai KD. 5", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("14", "Kaidai KD. 6", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("15", "Kaidai KD. 7", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("16", "Sen-Taka (STS)", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Ataque 8t)", "Pieza 4B (Sin Hangar)", "P5 Común 17"),
    ("17", "Kirai-Sen (Minas)", "P1 (158x23mm)", "Pieza 2A (Sin avion)", "Pieza 3B (Minas)", "Pieza 4B (Sin Hangar)", "P5 Común 17")
]

row_y = th_y + 30
for r_idx, row in enumerate(subs_data):
    bg_color = (32, 26, 22) if r_idx % 2 == 0 else (24, 20, 16)
    if "Sen-Toku" in row[1]:
        bg_color = (40, 35, 15)
    elif r_idx >= 8:
        # Subtle tint for group B
        bg_color = (25, 28, 35) if r_idx % 2 == 0 else (20, 22, 28)
        
    cv2.rectangle(canvas, (cols_x[0], row_y), (cols_x[-1], row_y + 26), bg_color, -1)
    cv2.rectangle(canvas, (cols_x[0], row_y), (cols_x[-1], row_y + 26), (60, 50, 40), 1)
    
    for c_idx, val in enumerate(row):
        txt_color = (200, 200, 200)
        if "PIEZA 2B" in val:
            txt_color = (0, 255, 255)
        elif "Pieza 3B" in val or "Pieza 4B" in val:
            txt_color = (100, 200, 255)
        elif "Pieza 3A" in val or "Pieza 4A" in val:
            txt_color = (255, 150, 200)
        elif c_idx == 1:
            txt_color = (255, 255, 255)
            
        cv2.putText(canvas, val, (cols_x[c_idx] + 8, row_y + 18), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.36, txt_color, 1)
    row_y += 26

# Overall title banner at top
cv2.rectangle(canvas, (0, 0), (W_CANVAS, 55), (35, 25, 20), -1)
cv2.line(canvas, (0, 55), (W_CANVAS, 55), (0, 200, 255), 2)
cv2.putText(canvas, "SENSUIKAN - PLANTA MAESTRA 2D Y MAPEO DE FLOTA (LAYOUT A: CRUCEROS vs LAYOUT B: ATAQUE)", 
            (40, 38), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)

cv2.imwrite("sensuikan_master_blueprint_v3.png", canvas)
print("Saved sensuikan_master_blueprint_v3.png successfully!")
