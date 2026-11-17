import cv2
import numpy as np
import json

# Master 2D Architectural Sheet Resolution:
W_CANVAS = 1600
H_CANVAS = 1300
canvas = np.full((H_CANVAS, W_CANVAS, 3), (24, 20, 16), dtype=np.uint8)

BOARD_W_MM = 280.0
BOARD_H_MM = 170.0

SCALE_BP = 3.5
bp_w = int(BOARD_W_MM * SCALE_BP) # 980 px
bp_h = int(BOARD_H_MM * SCALE_BP) # 595 px

bp_x0 = 40
bp_y0 = 90

# REVISED EXACT DIMENSIONS IN MM:
# Pieza 1 (Top-Left): Shorter! 158.0 mm (ends right after class title, before Sen-Toku events)
SPLIT_X1_MM = 158.0 
# Lower Body Split: 193.0 mm (where torpedo tubes start)
SPLIT_X2_MM = 193.0

STRIP_H_MM = 23.3
MID_H_MM = 54.2
BOT_H_MM = 92.5
MAIN_LEFT_H_MM = 146.7

# Widths:
P1_W_MM = SPLIT_X1_MM # 158.0 mm
P2_W_MM = BOARD_W_MM - SPLIT_X1_MM # 122.0 mm
P5_W_MM = SPLIT_X2_MM # 193.0 mm
P3_W_MM = BOARD_W_MM - SPLIT_X2_MM # 87.0 mm
P4_W_MM = P3_W_MM # 87.0 mm

# Pixel positions on canvas
split_x1_px = int(SPLIT_X1_MM * SCALE_BP) # ~ 553 px
split_x2_px = int(SPLIT_X2_MM * SCALE_BP) # ~ 675 px
strip_h_px = int(STRIP_H_MM * SCALE_BP)   # ~ 81 px
split_y2_px = strip_h_px + int(MID_H_MM * SCALE_BP) # ~ 271 px

# Draw 10mm grid background on board area
for x in range(0, bp_w, int(10 * SCALE_BP)):
    cv2.line(canvas, (bp_x0 + x, bp_y0), (bp_x0 + x, bp_y0 + bp_h), (35, 30, 24), 1)
for y in range(0, bp_h, int(10 * SCALE_BP)):
    cv2.line(canvas, (bp_x0, bp_y0 + y), (bp_x0 + bp_w, bp_y0 + y), (35, 30, 24), 1)

# Tint regions:
# Piece 1: Top-Left (Yellow) - 158.0 x 23.3 mm
cv2.rectangle(canvas, (bp_x0, bp_y0), (bp_x0 + split_x1_px, bp_y0 + strip_h_px), (15, 45, 55), -1)
# Piece 2: Top-Right (Blue) - 122.0 x 23.3 mm
cv2.rectangle(canvas, (bp_x0 + split_x1_px, bp_y0), (bp_x0 + bp_w, bp_y0 + strip_h_px), (55, 30, 15), -1)
# Piece 3: Mid-Right (Orange) - 87.0 x 54.2 mm
cv2.rectangle(canvas, (bp_x0 + split_x2_px, bp_y0 + strip_h_px), (bp_x0 + bp_w, bp_y0 + split_y2_px), (15, 35, 60), -1)
# Piece 4: Bottom-Right (Pink) - 87.0 x 92.5 mm
cv2.rectangle(canvas, (bp_x0 + split_x2_px, bp_y0 + split_y2_px), (bp_x0 + bp_w, bp_y0 + bp_h), (45, 15, 55), -1)
# Piece 5: Main Left (Teal) - 193.0 x 146.7 mm
cv2.rectangle(canvas, (bp_x0, bp_y0 + strip_h_px), (bp_x0 + split_x2_px, bp_y0 + bp_h), (45, 35, 20), -1)

# Helper function
def mm_to_canvas(x_mm, y_mm_from_top):
    return bp_x0 + int(x_mm * SCALE_BP), bp_y0 + int(y_mm_from_top * SCALE_BP)

half_box_px = int((13.2 / 2.0) * SCALE_BP)
notch_r_px = int(1.6 * SCALE_BP)

scale_x_orig = BOARD_W_MM / 525.0
scale_y_orig = BOARD_H_MM / 408.0

# 1. PIECE 1 (Top-Left): Windows for Logo and Title (ENDS at 158.0 mm)
logo_x0, logo_y0 = mm_to_canvas(22.0 * scale_x_orig, 16.0 * scale_y_orig)
logo_x1, logo_y1 = mm_to_canvas(130.0 * scale_x_orig, 48.0 * scale_y_orig)
cv2.rectangle(canvas, (logo_x0, logo_y0), (logo_x1, logo_y1), (0, 230, 255), 1)
cv2.putText(canvas, "VENTANA LOGO", (logo_x0 + 6, logo_y0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 230, 255), 1)

title_x0, title_y0 = mm_to_canvas(138.0 * scale_x_orig, 20.0 * scale_y_orig)
title_x1, title_y1 = mm_to_canvas(285.0 * scale_x_orig, 52.0 * scale_y_orig)
cv2.rectangle(canvas, (title_x0, title_y0), (title_x1, title_y1), (0, 230, 255), 1)
cv2.putText(canvas, "VENTANA CLASE Y FECHA", (title_x0 + 8, title_y0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 230, 255), 1)

# 2. PIECE 5 (Main Left): Silhouette, Stats, and Tracks
with open('grid_definition.json') as f:
    grid = json.load(f)

# Silhouette window
sub_x0, sub_y0 = mm_to_canvas(100.0 * scale_x_orig, 60.0 * scale_y_orig)
sub_x1, sub_y1 = mm_to_canvas(328.0 * scale_x_orig, 118.0 * scale_y_orig)
cv2.rectangle(canvas, (sub_x0, sub_y0), (sub_x1, sub_y1), (255, 255, 255), 1)
cv2.putText(canvas, "VENTANA DIBUJO SUBMARINO (SILUETA)", (sub_x0 + 8, sub_y0 + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 255, 255), 1)

# Stats window
stats_x0, stats_y0 = mm_to_canvas(104.0 * scale_x_orig, 295.0 * scale_y_orig)
stats_x1, stats_y1 = mm_to_canvas(342.0 * scale_x_orig, 317.0 * scale_y_orig)
cv2.rectangle(canvas, (stats_x0, stats_y0), (stats_x1, stats_y1), (255, 255, 255), 1)
cv2.putText(canvas, "VENTANA ESTADISTICAS TECNICAS", (stats_x0 + 6, stats_y0 + 14), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (255, 255, 255), 1)

# Left Tracks
for sec in ['base_mission_port', 'patrol_track', 'damage_flooding', 'damage_hull', 'crew']:
    for b in grid.get(sec, []):
        px, py, pw, ph = b['box']
        cx_mm = (px + pw/2.0) * scale_x_orig
        cy_mm = (py + ph/2.0) * scale_y_orig
        cx_c, cy_c = mm_to_canvas(cx_mm, cy_mm)
        cv2.rectangle(canvas, (cx_c - half_box_px, cy_c - half_box_px), 
                      (cx_c + half_box_px, cy_c + half_box_px), (0, 220, 255), 1)
        cv2.circle(canvas, (cx_c + half_box_px, cy_c), notch_r_px, (0, 220, 255), 1)

# 3. PIECE 2A on main board: Starts at 158.0 mm!
# Aircraft text window
ac_x0, ac_y0 = mm_to_canvas(355.0 * scale_x_orig, 20.0 * scale_y_orig)
ac_x1, ac_y1 = mm_to_canvas(380.0 * scale_x_orig, 50.0 * scale_y_orig)
cv2.rectangle(canvas, (ac_x0, ac_y0), (ac_x1, ac_y1), (255, 120, 0), 1)
cv2.putText(canvas, "AIRCRAFT", (ac_x0 + 2, ac_y0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (255, 120, 0), 1)

# Planes + Events
for c_px in [384, 414, 444, 474]:
    cx_mm = (c_px + 14.0) * scale_x_orig
    cy_mm = (23.0 + 14.0) * scale_y_orig
    cx_c, cy_c = mm_to_canvas(cx_mm, cy_mm)
    cv2.rectangle(canvas, (cx_c - half_box_px, cy_c - half_box_px), 
                  (cx_c + half_box_px, cy_c + half_box_px), (255, 120, 0), 1)
    cv2.circle(canvas, (cx_c + half_box_px, cy_c), notch_r_px, (255, 120, 0), 1)

# 4. PIECE 3 (Mid-Right: Torpedos & Reloads)
for r_px in [57, 87]:
    for c_px in [384, 414, 444, 474]:
        cx_mm = (c_px + 14.0) * scale_x_orig
        cy_mm = (r_px + 14.0) * scale_y_orig
        cx_c, cy_c = mm_to_canvas(cx_mm, cy_mm)
        cv2.rectangle(canvas, (cx_c - half_box_px, cy_c - half_box_px), 
                      (cx_c + half_box_px, cy_c + half_box_px), (0, 160, 255), 1)
        cv2.circle(canvas, (cx_c + half_box_px, cy_c), notch_r_px, (0, 160, 255), 1)

# Reloads bin
rb_x0, rb_y0 = mm_to_canvas(384.0 * scale_x_orig, 120.0 * scale_y_orig)
rb_x1, rb_y1 = mm_to_canvas((384.0 + 118.0) * scale_x_orig, (120.0 + 60.0) * scale_y_orig)
cv2.rectangle(canvas, (rb_x0, rb_y0), (rb_x1, rb_y1), (0, 160, 255), 1)
cv2.putText(canvas, "CAJON RECARGAS TORPEDOS / MINAS", (rb_x0 + 8, rb_y0 + 18), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 160, 255), 1)

# 5. PIECE 4 (Bottom-Right: Guns & Systems)
for r_px in [194, 223]:
    for c_px in [384, 414, 444, 474]:
        cx_mm = (c_px + 14.0) * scale_x_orig
        cy_mm = (r_px + 14.0) * scale_y_orig
        cx_c, cy_c = mm_to_canvas(cx_mm, cy_mm)
        cv2.rectangle(canvas, (cx_c - half_box_px, cy_c - half_box_px), 
                      (cx_c + half_box_px, cy_c + half_box_px), (255, 50, 255), 1)
        cv2.circle(canvas, (cx_c + half_box_px, cy_c), notch_r_px, (255, 50, 255), 1)

for r_px in [241, 271, 301, 331, 361]:
    for c_px in [384, 414, 444, 474]:
        cx_mm = (c_px + 14.0) * scale_x_orig
        cy_mm = (r_px + 14.0) * scale_y_orig
        cx_c, cy_c = mm_to_canvas(cx_mm, cy_mm)
        cv2.rectangle(canvas, (cx_c - half_box_px, cy_c - half_box_px), 
                      (cx_c + half_box_px, cy_c + half_box_px), (255, 50, 255), 1)
        cv2.circle(canvas, (cx_c + half_box_px, cy_c), notch_r_px, (255, 50, 255), 1)

# Draw thick border cuts between modules
# Horizontal top cut
cv2.line(canvas, (bp_x0, bp_y0 + strip_h_px), (bp_x0 + bp_w, bp_y0 + strip_h_px), (255, 255, 255), 2)
# Top vertical cut (X = 158.0 mm)
cv2.line(canvas, (bp_x0 + split_x1_px, bp_y0), (bp_x0 + split_x1_px, bp_y0 + strip_h_px), (0, 255, 255), 3)
# Lower vertical cut (X = 193.0 mm)
cv2.line(canvas, (bp_x0 + split_x2_px, bp_y0 + strip_h_px), (bp_x0 + split_x2_px, bp_y0 + bp_h), (255, 255, 255), 2)
# Mid-right horizontal cut
cv2.line(canvas, (bp_x0 + split_x2_px, bp_y0 + split_y2_px), (bp_x0 + bp_w, bp_y0 + split_y2_px), (255, 255, 255), 2)

# Outer border
cv2.rectangle(canvas, (bp_x0, bp_y0), (bp_x0 + bp_w, bp_y0 + bp_h), (180, 180, 180), 2)

# Module badges on 2D Board
cv2.putText(canvas, f"PIEZA 1: TITULO Y LOGO ({P1_W_MM:.1f} x {STRIP_H_MM:.1f} mm) [MAS CORTA]", 
            (bp_x0 + 10, bp_y0 + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 230, 255), 1)
cv2.putText(canvas, f"PIEZA 2A: AVIACION ({P2_W_MM:.1f} x {STRIP_H_MM:.1f} mm)", 
            (bp_x0 + split_x1_px + 10, bp_y0 + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 120, 0), 1)
cv2.putText(canvas, f"PIEZA 3: TORPEDOS ({P3_W_MM:.1f} x {MID_H_MM:.1f} mm)", 
            (bp_x0 + split_x2_px + 10, bp_y0 + strip_h_px + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 160, 255), 1)
cv2.putText(canvas, f"PIEZA 4: ARMAS / SISTEMAS ({P4_W_MM:.1f} x {BOT_H_MM:.1f} mm)", 
            (bp_x0 + split_x2_px + 10, bp_y0 + split_y2_px + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 50, 255), 1)
cv2.putText(canvas, f"PIEZA 5: CUERPO PRINCIPAL IZQUIERDO ({P5_W_MM:.1f} x {MAIN_LEFT_H_MM:.1f} mm)", 
            (bp_x0 + 10, bp_y0 + strip_h_px + 22), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 220, 255), 1)

# Step indicator note
cv2.putText(canvas, "Escalon de apoyo (X=158 vs 193 mm)", (bp_x0 + split_x1_px + 6, bp_y0 + strip_h_px - 4), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.30, (0, 255, 255), 1)

# =========================================================================
# RIGHT SIDE DETAIL: COMPARISON OF PIEZA 2A VS PIEZA 2B (SEN-TOKU)
# =========================================================================
rx0 = bp_x0 + bp_w + 30
cv2.putText(canvas, f"DETALLE PIEZA 2 (Ancho: {P2_W_MM:.1f} mm): 2 VARIANTES", (rx0, 45), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.52, (255, 255, 255), 2)

# Card 2A box
cv2.rectangle(canvas, (rx0, 70), (rx0 + 510, 185), (35, 30, 20), -1)
cv2.rectangle(canvas, (rx0, 70), (rx0 + 510, 185), (255, 120, 0), 2)
cv2.putText(canvas, f"PIEZA 2A: FLOTA ESTANDAR ({P2_W_MM:.1f} x {STRIP_H_MM:.1f} mm)", (rx0 + 15, 95), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.48, (255, 120, 0), 2)
cv2.putText(canvas, "Sirve para 16 de los 17 submarinos (con o sin avion)", (rx0 + 15, 115), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.36, (200, 200, 200), 1)

# Draw 2A elements in box
# Window "Aircraft"
cv2.rectangle(canvas, (rx0 + 15, 130), (rx0 + 115, 170), (0, 255, 255), 1)
cv2.putText(canvas, "Ventana 'Aircraft'", (rx0 + 18, 154), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1)
# Plane 1
cv2.rectangle(canvas, (rx0 + 125, 130), (rx0 + 165, 170), (0, 255, 0), 1)
cv2.circle(canvas, (rx0 + 165, 150), 4, (0, 255, 0), 1)
cv2.putText(canvas, "Avion 1", (rx0 + 127, 153), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (0, 255, 0), 1)
# Plane 2
cv2.rectangle(canvas, (rx0 + 175, 130), (rx0 + 215, 170), (0, 255, 0), 1)
cv2.circle(canvas, (rx0 + 215, 150), 4, (0, 255, 0), 1)
cv2.putText(canvas, "Avion 2", (rx0 + 177, 153), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (0, 255, 0), 1)
# Event 1
cv2.rectangle(canvas, (rx0 + 225, 130), (rx0 + 265, 170), (0, 160, 255), 1)
cv2.circle(canvas, (rx0 + 265, 150), 4, (0, 160, 255), 1)
cv2.putText(canvas, "Evt 1", (rx0 + 230, 153), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (0, 160, 255), 1)
# Event 2
cv2.rectangle(canvas, (rx0 + 275, 130), (rx0 + 315, 170), (0, 160, 255), 1)
cv2.circle(canvas, (rx0 + 315, 150), 4, (0, 160, 255), 1)
cv2.putText(canvas, "Evt 2", (rx0 + 280, 153), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (0, 160, 255), 1)

# Card 2B box (Sen-Toku)
cv2.rectangle(canvas, (rx0, 205), (rx0 + 510, 320), (35, 30, 20), -1)
cv2.rectangle(canvas, (rx0, 205), (rx0 + 510, 320), (0, 255, 255), 2)
cv2.putText(canvas, f"PIEZA 2B: SEN-TOKU I-400 ({P2_W_MM:.1f} x {STRIP_H_MM:.1f} mm)", (rx0 + 15, 230), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.48, (0, 255, 255), 2)
cv2.putText(canvas, "Ahora los 2 eventos quedan DENTRO de la pieza 2B gracias al corte en 158 mm", (rx0 + 15, 250), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.34, (200, 200, 200), 1)

# Draw 2B elements: Evt 1, Evt 2, Ventana Aircraft, Seiran 1, Seiran 2, Seiran 3
cv2.rectangle(canvas, (rx0 + 15, 265), (rx0 + 55, 305), (0, 160, 255), 1)
cv2.circle(canvas, (rx0 + 55, 285), 4, (0, 160, 255), 1)
cv2.putText(canvas, "Evt 1", (rx0 + 20, 288), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (0, 160, 255), 1)

cv2.rectangle(canvas, (rx0 + 65, 265), (rx0 + 105, 305), (0, 160, 255), 1)
cv2.circle(canvas, (rx0 + 105, 285), 4, (0, 160, 255), 1)
cv2.putText(canvas, "Evt 2", (rx0 + 70, 288), cv2.FONT_HERSHEY_SIMPLEX, 0.32, (0, 160, 255), 1)

cv2.rectangle(canvas, (rx0 + 115, 265), (rx0 + 205, 305), (0, 255, 255), 1)
cv2.putText(canvas, "Ventana 'Aircraft'", (rx0 + 118, 288), cv2.FONT_HERSHEY_SIMPLEX, 0.33, (0, 255, 255), 1)

cv2.rectangle(canvas, (rx0 + 215, 265), (rx0 + 255, 305), (0, 255, 0), 1)
cv2.circle(canvas, (rx0 + 255, 285), 4, (0, 255, 0), 1)
cv2.putText(canvas, "Seiran 1", (rx0 + 216, 288), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (0, 255, 0), 1)

cv2.rectangle(canvas, (rx0 + 265, 265), (rx0 + 305, 305), (0, 255, 0), 1)
cv2.circle(canvas, (rx0 + 305, 285), 4, (0, 255, 0), 1)
cv2.putText(canvas, "Seiran 2", (rx0 + 266, 288), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (0, 255, 0), 1)

cv2.rectangle(canvas, (rx0 + 315, 265), (rx0 + 355, 305), (0, 255, 0), 1)
cv2.circle(canvas, (rx0 + 355, 285), 4, (0, 255, 0), 1)
cv2.putText(canvas, "Seiran 3", (rx0 + 316, 288), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (0, 255, 0), 1)

# Summary notes box on right
cv2.rectangle(canvas, (rx0, 340), (rx0 + 510, 480), (25, 35, 45), -1)
cv2.rectangle(canvas, (rx0, 340), (rx0 + 510, 480), (100, 150, 200), 1)
cv2.putText(canvas, "RESUMEN DE AJUSTES EN ESTA REVISION:", (rx0 + 15, 365), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.44, (255, 255, 255), 2)
cv2.putText(canvas, f"- Pieza 1 se acorta de 193.0 a {P1_W_MM:.1f} mm (no tapa eventos de Sen-Toku).", (rx0 + 15, 390), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1)
cv2.putText(canvas, f"- Pieza 2 se ensancha de 87.0 a {P2_W_MM:.1f} mm (aloja los eventos a la izq).", (rx0 + 15, 412), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1)
cv2.putText(canvas, f"- Pieza 5 (Cuerpo Izq.) se mantiene en {P5_W_MM:.1f} mm (apoyo escalonado).", (rx0 + 15, 434), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (220, 220, 220), 1)
cv2.putText(canvas, "- Total piezas necesarias: SOLO 6 piezas para toda la flota de 17.", (rx0 + 15, 456), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 0), 1)

# =========================================================================
# BOTTOM HALF: COMPLETE MAPPING TABLE OF ALL 17 FLEET SUBMARINES
# =========================================================================
table_y0 = bp_y0 + bp_h + 35
cv2.putText(canvas, "MAPEO EXACTO DE PIEZAS PARA CADA UNO DE LOS 17 SUBMARINOS", (bp_x0, table_y0), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

th_y = table_y0 + 20
cols_x = [bp_x0, bp_x0 + 50, bp_x0 + 250, bp_x0 + 440, bp_x0 + 660, bp_x0 + 860, bp_x0 + 1100, bp_x0 + 1520]

cv2.rectangle(canvas, (cols_x[0], th_y), (cols_x[-1], th_y + 30), (50, 40, 30), -1)
cv2.rectangle(canvas, (cols_x[0], th_y), (cols_x[-1], th_y + 30), (150, 150, 150), 1)

headers = ["#", "Clase Submarino", f"Pieza 1 ({P1_W_MM:.0f}mm)", f"Pieza 2 ({P2_W_MM:.0f}mm)", "Pieza 3 (Torpedos)", "Pieza 4 (Sistemas)", "Pieza 5 (Cuerpo Izq.)"]
for i, h_text in enumerate(headers):
    cv2.putText(canvas, h_text, (cols_x[i] + 8, th_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 255), 1)

subs_data = [
    ("01", "Junsen J. 2", "P1 Estandar", "Pieza 2A (1 Avion)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("02", "Junsen J. 1M", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("03", "Junsen J. 3", "P1 Estandar", "Pieza 2A (1 Avion)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("04", "Type A (Mando)", "P1 Estandar", "Pieza 2A (1 Avion)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("05", "Type A Modified", "P1 Estandar", "Pieza 2A (2 Aviones)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("06", "Type B", "P1 Estandar", "Pieza 2A (1 Avion)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("07", "Type B. 3", "P1 Estandar", "Pieza 2A (1 Avion)", "P3 Torpedos (6)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("08", "Sen-Toku (I-400)", "P1 Estandar", "PIEZA 2B (3 Seiran)", "P3 Torpedos (8)", "P4 Sistemas (Hangar)", "P5 Común 17"),
    ("09", "Type C", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (8)", "P4 Sistemas (Ataque)", "P5 Común 17"),
    ("10", "Type C. 3 (Kaiten)", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (6)", "P4 Sistemas (6 Kaiten)", "P5 Común 17"),
    ("11", "Kaidai KD. 3", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (8)", "P4 Sistemas (Ataque)", "P5 Común 17"),
    ("12", "Kaidai KD. 4", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (6)", "P4 Sistemas (Ataque)", "P5 Común 17"),
    ("13", "Kaidai KD. 5", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (6)", "P4 Sistemas (Ataque)", "P5 Común 17"),
    ("14", "Kaidai KD. 6", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (6)", "P4 Sistemas (Ataque)", "P5 Común 17"),
    ("15", "Kaidai KD. 7", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (6)", "P4 Sistemas (Ataque)", "P5 Común 17"),
    ("16", "Sen-Taka (STS)", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (4)", "P4 Sistemas (Baterias)", "P5 Común 17"),
    ("17", "Kirai-Sen (Minas)", "P1 Estandar", "Pieza 2A (Compatible)", "P3 Torpedos (Minas)", "P4 Sistemas (Ataque)", "P5 Común 17")
]

row_y = th_y + 30
for r_idx, row in enumerate(subs_data):
    bg_color = (32, 26, 22) if r_idx % 2 == 0 else (24, 20, 16)
    if "Sen-Toku" in row[1]:
        bg_color = (40, 35, 15)
    cv2.rectangle(canvas, (cols_x[0], row_y), (cols_x[-1], row_y + 26), bg_color, -1)
    cv2.rectangle(canvas, (cols_x[0], row_y), (cols_x[-1], row_y + 26), (60, 50, 40), 1)
    
    for c_idx, val in enumerate(row):
        txt_color = (200, 200, 200)
        if "PIEZA 2B" in val:
            txt_color = (0, 255, 255)
        elif "Pieza 2A" in val:
            txt_color = (255, 160, 50)
        elif c_idx == 1:
            txt_color = (255, 255, 255)
            
        cv2.putText(canvas, val, (cols_x[c_idx] + 8, row_y + 18), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.36, txt_color, 1)
    row_y += 26

# Overall title banner at top
cv2.rectangle(canvas, (0, 0), (W_CANVAS, 60), (35, 25, 20), -1)
cv2.line(canvas, (0, 60), (W_CANVAS, 60), (0, 200, 255), 2)
cv2.putText(canvas, "SENSUIKAN - PLANTA ARQUITECTONICA MODULAR Y MAPEO COMPLETO (REVISION PIEZA 1 CORTA)", 
            (40, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.85, (255, 255, 255), 2)

cv2.imwrite("sensuikan_master_2d_architecture.png", canvas)
print("Updated sensuikan_master_2d_architecture.png successfully!")
