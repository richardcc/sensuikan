import cv2
import numpy as np

# Master Blueprint v4: Architectural 2D Plan with Stepped "Jog" Cut for Layout B
W_CANVAS = 1750
H_CANVAS = 1450
canvas = np.full((H_CANVAS, W_CANVAS, 3), (22, 18, 14), dtype=np.uint8)

BOARD_W_MM = 280.0
BOARD_H_MM = 170.0
SCALE_BP = 2.7
bp_w = int(BOARD_W_MM * SCALE_BP) # 756 px
bp_h = int(BOARD_H_MM * SCALE_BP) # 459 px

def mm_to_canvas(bx, by, x_mm, y_mm):
    return bx + int(x_mm * SCALE_BP), by + int(y_mm * SCALE_BP)

# -------------------------------------------------------------
# DRAW MASTER BOARDS
# -------------------------------------------------------------
def draw_blueprint_board(bx0, by0, title_board, is_layout_b=False):
    split_x1 = 158.0 # Top strip split
    split_x2 = 193.0 # Main vertical split
    strip_h = 23.3
    split_y2 = 88.0 if is_layout_b else 77.5
    
    # 10mm grid
    for x in range(0, bp_w, int(10 * SCALE_BP)):
        cv2.line(canvas, (bx0 + x, by0), (bx0 + x, by0 + bp_h), (38, 32, 26), 1)
    for y in range(0, bp_h, int(10 * SCALE_BP)):
        cv2.line(canvas, (bx0, by0 + y), (bx0 + bp_w, by0 + y), (38, 32, 26), 1)
        
    sx1 = int(split_x1 * SCALE_BP)
    sx2 = int(split_x2 * SCALE_BP)
    sh = int(strip_h * SCALE_BP)
    sy2 = int(split_y2 * SCALE_BP)
    
    # Colors: BGR
    # P1 (Top Left): Teal-Grey
    cv2.rectangle(canvas, (bx0, by0), (bx0 + sx1, by0 + sh), (35, 55, 45), -1)
    # P2 (Top Right): Slate Blue
    cv2.rectangle(canvas, (bx0 + sx1, by0), (bx0 + bp_w, by0 + sh), (65, 45, 25), -1)
    
    if not is_layout_b:
        # LAYOUT A: Straight cuts
        # P3A: Amber/Orange
        cv2.rectangle(canvas, (bx0 + sx2, by0 + sh), (bx0 + bp_w, by0 + sy2), (20, 50, 80), -1)
        # P4A: Magenta/Wine
        cv2.rectangle(canvas, (bx0 + sx2, by0 + sy2), (bx0 + bp_w, by0 + bp_h), (60, 25, 70), -1)
        # P5A: Deep Teal
        cv2.rectangle(canvas, (bx0, by0 + sh), (bx0 + sx2, by0 + bp_h), (50, 45, 25), -1)
        
        # Cut lines
        cv2.line(canvas, (bx0, by0 + sh), (bx0 + bp_w, by0 + sh), (255, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx1, by0), (bx0 + sx1, by0 + sh), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx2, by0 + sh), (bx0 + sx2, by0 + bp_h), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx2, by0 + sy2), (bx0 + bp_w, by0 + sy2), (0, 255, 255), 2)
        
        # P5A Damage Track representation
        dt_x0, dt_y0 = mm_to_canvas(bx0, by0, 23.0, 78.0)
        dt_x1, dt_y1 = mm_to_canvas(bx0, by0, 182.0, 106.0)
        cv2.rectangle(canvas, (dt_x0, dt_y0), (dt_x1, dt_y1), (0, 180, 255), 1)
        cv2.putText(canvas, "Damage Track (Flooding + Hull)", (dt_x0 + 8, dt_y0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 200, 255), 1)
        # SUNK box
        sunk_x0, sunk_y0 = mm_to_canvas(bx0, by0, 168.0, 92.0)
        sunk_x1, sunk_y1 = mm_to_canvas(bx0, by0, 182.0, 106.0)
        cv2.rectangle(canvas, (sunk_x0, sunk_y0), (sunk_x1, sunk_y1), (0, 0, 255), -1)
        cv2.putText(canvas, "SUNK", (sunk_x0 + 3, sunk_y0 + 11), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (255, 255, 255), 1)
        
        # Gap indicator
        cv2.arrowedLine(canvas, (sunk_x1 + 3, (sunk_y0 + sunk_y1)//2), (bx0 + sx2 - 3, (sunk_y0 + sunk_y1)//2), (0, 255, 0), 1, tipLength=0.3)
        cv2.putText(canvas, "Gap 11mm", (sunk_x1 + 5, sunk_y0 - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (0, 255, 0), 1)
        
    else:
        # LAYOUT B: STEPPED JOG CUT
        # Jog coordinates:
        # Between Y = 92.0mm and Y = 112.0mm, X steps from 193.0 to 205.0mm
        jog_x = int(205.0 * SCALE_BP)
        jog_y_start = int(92.0 * SCALE_BP)
        jog_y_end = int(112.0 * SCALE_BP)
        
        # P3B: Amber/Orange
        cv2.rectangle(canvas, (bx0 + sx2, by0 + sh), (bx0 + bp_w, by0 + sy2), (20, 50, 80), -1)
        
        # P4B polygon (with jog cutout on the left)
        pts_p4b = np.array([
            [bx0 + sx2, by0 + sy2],
            [bx0 + bp_w, by0 + sy2],
            [bx0 + bp_w, by0 + bp_h],
            [bx0 + sx2, by0 + bp_h],
            [bx0 + sx2, by0 + jog_y_end],
            [bx0 + jog_x, by0 + jog_y_end],
            [bx0 + jog_x, by0 + jog_y_start],
            [bx0 + sx2, by0 + jog_y_start]
        ], np.int32)
        cv2.fillPoly(canvas, [pts_p4b], (60, 25, 70))
        
        # P5B polygon (with jog tongue extending to the right)
        pts_p5b = np.array([
            [bx0, by0 + sh],
            [bx0 + sx2, by0 + sh],
            [bx0 + sx2, by0 + jog_y_start],
            [bx0 + jog_x, by0 + jog_y_start],
            [bx0 + jog_x, by0 + jog_y_end],
            [bx0 + sx2, by0 + jog_y_end],
            [bx0 + sx2, by0 + bp_h],
            [bx0, by0 + bp_h]
        ], np.int32)
        cv2.fillPoly(canvas, [pts_p5b], (50, 45, 25))
        
        # Cut lines
        cv2.line(canvas, (bx0, by0 + sh), (bx0 + bp_w, by0 + sh), (255, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx1, by0), (bx0 + sx1, by0 + sh), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx2, by0 + sh), (bx0 + sx2, by0 + sy2), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx2, by0 + sy2), (bx0 + bp_w, by0 + sy2), (0, 255, 255), 2)
        
        # The stepped jog line
        cv2.line(canvas, (bx0 + sx2, by0 + sy2), (bx0 + sx2, by0 + jog_y_start), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx2, by0 + jog_y_start), (bx0 + jog_x, by0 + jog_y_start), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + jog_x, by0 + jog_y_start), (bx0 + jog_x, by0 + jog_y_end), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + jog_x, by0 + jog_y_end), (bx0 + sx2, by0 + jog_y_end), (0, 255, 255), 2)
        cv2.line(canvas, (bx0 + sx2, by0 + jog_y_end), (bx0 + sx2, by0 + bp_h), (0, 255, 255), 2)
        
        # P5B Damage Track representation (Shifted right by 20mm and up)
        dt_x0, dt_y0 = mm_to_canvas(bx0, by0, 45.0, 93.0)
        dt_x1, dt_y1 = mm_to_canvas(bx0, by0, 202.0, 111.0)
        cv2.rectangle(canvas, (dt_x0, dt_y0), (dt_x1, dt_y1), (0, 180, 255), 1)
        cv2.putText(canvas, "Damage Track Desplazado (Kaidai)", (dt_x0 + 8, dt_y0 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 200, 255), 1)
        # SUNK box extending to X = 202mm!
        sunk_x0, sunk_y0 = mm_to_canvas(bx0, by0, 188.0, 95.0)
        sunk_x1, sunk_y1 = mm_to_canvas(bx0, by0, 202.0, 109.0)
        cv2.rectangle(canvas, (sunk_x0, sunk_y0), (sunk_x1, sunk_y1), (0, 0, 255), -1)
        cv2.putText(canvas, "SUNK", (sunk_x0 + 2, sunk_y0 + 10), cv2.FONT_HERSHEY_SIMPLEX, 0.28, (255, 255, 255), 1)
        
        # Jog label
        cv2.putText(canvas, "ESCALON 'JOG'", (bx0 + jog_x + 6, by0 + jog_y_start + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.34, (0, 255, 255), 1)
        cv2.putText(canvas, "X=205mm (Abraza SUNK)", (bx0 + jog_x + 6, by0 + jog_y_start + 32), cv2.FONT_HERSHEY_SIMPLEX, 0.30, (0, 255, 0), 1)

    # Outer border
    cv2.rectangle(canvas, (bx0, by0), (bx0 + bp_w, by0 + bp_h), (220, 220, 220), 2)
    # Title
    cv2.putText(canvas, title_board, (bx0 + 10, by0 - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.54, (255, 255, 255), 2)

    # General labels
    cv2.putText(canvas, "P1: TITULO/LOGO (158x23.3mm) [UNIVERSAL]", (bx0 + 8, by0 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.33, (0, 230, 255), 1)
    
# Draw Boards
draw_blueprint_board(50, 70, "LAYOUT A: CRUCEROS CON AVIACION (Corte Recto X = 193 mm)", is_layout_b=False)
# Annotations Layout A
cv2.putText(canvas, "P2A: AVIACION ESTANDAR (122x23.3mm)", (50 + int(158*SCALE_BP) + 6, 70 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.31, (255, 120, 0), 1)
cv2.putText(canvas, "P3A: 2 FILAS TUBOS (4+2) + RECARGAS (87x54.2mm)", (50 + int(193*SCALE_BP) + 6, 70 + int(23.3*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.29, (0, 160, 255), 1)
cv2.putText(canvas, "P4A: CANON 127mm + AA + SISTEMAS GRUA/HANGAR (87x92.5mm)", (50 + int(193*SCALE_BP) + 6, 70 + int(77.5*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.27, (255, 80, 255), 1)
cv2.putText(canvas, "P5A: CUERPO IZQUIERDO CRUCEROS (193x146.7mm)", (50 + 10, 70 + int(23.3*SCALE_BP) + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (0, 220, 255), 1)

draw_blueprint_board(920, 70, "LAYOUT B: SUBMARINOS DE ATAQUE (Corte Escalonado Jog X = 205 mm)", is_layout_b=True)
# Annotations Layout B
cv2.putText(canvas, "P2A: COMPATIBLE (122x23.3mm)", (920 + int(158*SCALE_BP) + 6, 70 + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.31, (255, 120, 0), 1)
cv2.putText(canvas, "P3B: 3 FILAS TUBOS (4+2+2) + RECARGAS (87x64.7mm)", (920 + int(193*SCALE_BP) + 6, 70 + int(23.3*SCALE_BP) + 16), cv2.FONT_HERSHEY_SIMPLEX, 0.29, (0, 160, 255), 1)
cv2.putText(canvas, "P4B: CANON 120mm + SISTEMAS SIN HANGAR (CON RETRANQUEO)", (920 + int(205*SCALE_BP) - 130, 70 + int(88.0*SCALE_BP) - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.27, (255, 80, 255), 1)
cv2.putText(canvas, "P5B: CUERPO IZQ. KAIDAI CON PESTANA SUNK", (920 + 10, 70 + int(23.3*SCALE_BP) + 18), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (0, 220, 255), 1)

# -------------------------------------------------------------
# DETAILED CALLOUT / ZOOM OF THE STEPPED JOG CUT (MIDDLE ROW)
# -------------------------------------------------------------
zy0 = 570
cv2.rectangle(canvas, (50, zy0), (1700, zy0 + 220), (28, 24, 20), -1)
cv2.rectangle(canvas, (50, zy0), (1700, zy0 + 220), (100, 90, 80), 1)
cv2.putText(canvas, "DETALLE TECNICO DE INGENIERIA: UNION ESCALONADA ('JOG') ENTRE PIEZA 5B Y PIEZA 4B", (70, zy0 + 30), cv2.FONT_HERSHEY_DUPLEX, 0.62, (0, 255, 255), 2)

# Diagram of the jog cut
jx0 = 150
jy0 = zy0 + 60
z_scale = 12.0 # High zoom scale

# Baseline X = 193mm
# Jog at X = 205mm (delta = 12mm -> 144px)
# Y from 80mm to 120mm (delta = 40mm -> 480px)
# Y jog start at 92mm, end at 112mm (20mm -> 240px)

x_base = jx0 + 100
x_jog = x_base + int(12 * z_scale)
y_top = jy0 + 10
y_jstart = y_top + int(12 * z_scale)
y_jend = y_jstart + int(20 * z_scale)
y_bot = y_jend + int(15 * z_scale)

# Draw P5B area (left)
pts_p5b_zoom = np.array([
    [jx0, y_top],
    [x_base, y_top],
    [x_base, y_jstart],
    [x_jog, y_jstart],
    [x_jog, y_jend],
    [x_base, y_jend],
    [x_base, y_bot],
    [jx0, y_bot]
], np.int32)
cv2.fillPoly(canvas, [pts_p5b_zoom], (50, 45, 25))

# Draw P4B area (right)
pts_p4b_zoom = np.array([
    [x_base, y_top],
    [jx0 + 550, y_top],
    [jx0 + 550, y_bot],
    [x_base, y_bot],
    [x_base, y_jend],
    [x_jog, y_jend],
    [x_jog, y_jstart],
    [x_base, y_jstart]
], np.int32)
cv2.fillPoly(canvas, [pts_p4b_zoom], (60, 25, 70))

# Seam line
cv2.line(canvas, (x_base, y_top), (x_base, y_jstart), (0, 255, 255), 3)
cv2.line(canvas, (x_base, y_jstart), (x_jog, y_jstart), (0, 255, 255), 3)
cv2.line(canvas, (x_jog, y_jstart), (x_jog, y_jend), (0, 255, 255), 3)
cv2.line(canvas, (x_jog, y_jend), (x_base, y_jend), (0, 255, 255), 3)
cv2.line(canvas, (x_base, y_jend), (x_base, y_bot), (0, 255, 255), 3)

# Inside P5B: Draw SUNK box (X = 188 to 202 mm, Y = 95 to 109 mm)
sunk_zx0 = x_base - int(5 * z_scale)
sunk_zx1 = x_base + int(9 * z_scale)
sunk_zy0 = y_jstart + int(3 * z_scale)
sunk_zy1 = y_jend - int(3 * z_scale)
cv2.rectangle(canvas, (sunk_zx0, sunk_zy0), (sunk_zx1, sunk_zy1), (0, 0, 255), -1)
cv2.rectangle(canvas, (sunk_zx0, sunk_zy0), (sunk_zx1, sunk_zy1), (255, 255, 255), 2)
cv2.putText(canvas, "CASILLA 'SUNK' (Kaidai)", (sunk_zx0 - 140, sunk_zy0 + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
cv2.putText(canvas, "Llega a X = 202 mm", (sunk_zx0 - 140, sunk_zy0 + 60), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (200, 200, 200), 1)

# Inside P4B: Draw Deck Gun 120mm slot (starts at X = 208 mm)
gun_zx0 = x_jog + int(3 * z_scale)
gun_zx1 = gun_zx0 + int(14 * z_scale)
gun_zy0 = y_jstart + int(2 * z_scale)
gun_zy1 = gun_zy0 + int(14 * z_scale)
cv2.rectangle(canvas, (gun_zx0, gun_zy0), (gun_zx1, gun_zy1), (0, 200, 255), 1)
cv2.putText(canvas, "120mm Gun Status", (gun_zx0 + 6, gun_zy0 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 200, 255), 1)
cv2.putText(canvas, "X = 208 mm", (gun_zx0 + 6, gun_zy0 + 40), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 255, 255), 1)

# Annotations on the right side of the zoom box
tx = 760
cv2.putText(canvas, "COTAS EXACTAS DEL ESCALON (JOG):", (tx, zy0 + 70), cv2.FONT_HERSHEY_DUPLEX, 0.52, (255, 255, 255), 1)
cv2.putText(canvas, "1. Linea base superior: X = 193.0 mm (desde Y = 88.0 hasta Y = 92.0 mm)", (tx, zy0 + 100), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (200, 200, 200), 1)
cv2.putText(canvas, "2. Quiebro horizontal: Avance de +12.0 mm hacia la derecha (de X = 193.0 a X = 205.0 mm en Y = 92.0 mm)", (tx, zy0 + 125), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (0, 255, 255), 1)
cv2.putText(canvas, "3. Paso del dano: Tramo vertical a X = 205.0 mm (desde Y = 92.0 hasta Y = 112.0 mm) -> Altura = 20.0 mm", (tx, zy0 + 150), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (0, 255, 255), 1)
cv2.putText(canvas, "4. Retorno horizontal: Retroceso de -12.0 mm hacia la izquierda (de X = 205.0 a X = 193.0 mm en Y = 112.0 mm)", (tx, zy0 + 175), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (0, 255, 255), 1)
cv2.putText(canvas, "5. Linea base inferior: X = 193.0 mm (desde Y = 112.0 hasta Y = 170.0 mm hasta la base)", (tx, zy0 + 200), cv2.FONT_HERSHEY_SIMPLEX, 0.44, (200, 200, 200), 1)

# -------------------------------------------------------------
# BOTTOM HALF: UPDATED 17-SUBMARINE MAPPING TABLE
# -------------------------------------------------------------
ty0 = 820
cv2.putText(canvas, "MAPEO ARQUITECTONICO COMPLETO: LAS 17 CLASES DE SUBMARINOS", (50, ty0), cv2.FONT_HERSHEY_DUPLEX, 0.70, (0, 255, 255), 2)
cv2.putText(canvas, "Cada barco se ensambla seleccionando sus 5 piezas moduladas (Tamano final 280x170mm)", (50, ty0 + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.46, (200, 200, 200), 1)

cols = [
    ("N", 35),
    ("Clase de Submarino", 240),
    ("Familia / Tipo", 180),
    ("Pieza 1 (Titulo)", 180),
    ("Pieza 2 (Avion/Event)", 190),
    ("Pieza 3 (Tubos/Rec)", 210),
    ("Pieza 4 (Canon/Sis)", 280),
    ("Pieza 5 (Cuerpo Izq)", 310)
]

# Table Header
x_cur = 50
th_y = ty0 + 45
cv2.rectangle(canvas, (50, th_y), (1700, th_y + 30), (45, 38, 30), -1)
cv2.rectangle(canvas, (50, th_y), (1700, th_y + 30), (120, 100, 80), 1)

for title, w_col in cols:
    cv2.putText(canvas, title, (x_cur + 8, th_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 255, 255), 1)
    cv2.line(canvas, (x_cur + w_col, th_y), (x_cur + w_col, th_y + 30), (100, 90, 80), 1)
    x_cur += w_col

subs_data = [
    (1, "Junsen J. 2", "Crucero de Flota", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (2, "Type C. 3", "Ataque Pesado", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (3, "Type A", "Crucero de Mando", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (4, "Sen-Toku (I-400)", "Portaaviones Sub.", "P1 (158x23mm)", "P2B (3 Seiran)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (5, "Junsen J. 1M", "Crucero de Flota", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (6, "Type A Modified", "Crucero de Mando", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (7, "Type B", "Crucero con Avion", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (8, "Type B. 3", "Crucero con Avion", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (9, "Type C", "Ataque Pesado", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (10, "Kaidai KD. 6", "Ataque Rapido", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (11, "Sen-Taka", "Alta Velocidad", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (12, "Junsen J. 3", "Crucero de Flota", "P1 (158x23mm)", "P2A (Estandar)", "P3A (6 Tubos/Alto)", "P4A (Canon+AA+Grua/Hangar)", "P5A (Corte Recto X=193)"),
    (13, "Kaidai KD. 3", "Ataque Kaidai", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (14, "Kaidai KD. 4", "Ataque Kaidai", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (15, "Kaidai KD. 7", "Ataque Kaidai", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (16, "Kirai-Sen", "Minador Submarino", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)"),
    (17, "Kaidai KD. 5", "Ataque Kaidai", "P1 (158x23mm)", "P2A (Estandar)", "P3B (8 Tubos/Bajo)", "P4B (Canon 120/Jog X=205)", "P5B (Kaidai con Pestana)")
]

r_y = th_y + 30
row_h = 29
for row in subs_data:
    idx, name, ftype, p1, p2, p3, p4, p5 = row
    bg_color = (30, 26, 20) if idx % 2 == 0 else (22, 18, 14)
    cv2.rectangle(canvas, (50, r_y), (1700, r_y + row_h), bg_color, -1)
    cv2.line(canvas, (50, r_y + row_h), (1700, r_y + row_h), (55, 45, 35), 1)
    
    x_c = 50
    vals = [str(idx), name, ftype, p1, p2, p3, p4, p5]
    for i, (v, (t, w_col)) in enumerate(zip(vals, cols)):
        color = (255, 255, 255)
        if i == 0: color = (160, 160, 160)
        elif i == 1: color = (0, 255, 255)
        elif i == 4 and "P2B" in v: color = (0, 200, 255) # Special Sen-Toku
        elif i == 5 and "P3B" in v: color = (0, 160, 255) # 8 Tubes
        elif i == 6 and "Jog" in v: color = (255, 100, 255) # Jog
        elif i == 7 and "P5B" in v: color = (0, 255, 100) # Pestana Kaidai
        cv2.putText(canvas, v, (x_c + 8, r_y + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.38, color, 1)
        cv2.line(canvas, (x_c + w_col, r_y), (x_c + w_col, r_y + row_h), (55, 45, 35), 1)
        x_c += w_col
    r_y += row_h

# Outer border table
cv2.rectangle(canvas, (50, th_y), (1700, r_y), (120, 100, 80), 2)

# Save Blueprint
out_file = "sensuikan_master_blueprint_v4.png"
cv2.imwrite(out_file, canvas)
artifact_file = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_master_blueprint_v4.png"
cv2.imwrite(artifact_file, canvas)
print("Saved blueprint v4 successfully to", out_file, "and", artifact_file)
