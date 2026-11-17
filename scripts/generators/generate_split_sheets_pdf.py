import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import json
import os
import shutil

# Standard A4 Landscape: 297 mm x 210 mm
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0

BOARD_W_MM = 280.0
BOARD_H_MM = 170.0

# Split parameters:
# We divide the board into Left Sheet (X from 0 to 195mm + 25mm overlap)
# and Right Sheet (X from 170mm to 280mm)
# In each sheet, we center the content horizontally on the A4 page!

SLOT_SIZE = 13.2
NOTCH_R = 1.6

def draw_counter_slot(ax, cx, cy, label=None):
    half = SLOT_SIZE / 2.0
    rect = patches.Rectangle((cx - half, cy - half), SLOT_SIZE, SLOT_SIZE, 
                             linewidth=0.8, edgecolor='black', facecolor='#F0F4F8', zorder=3)
    ax.add_patch(rect)
    top_notch = patches.Wedge((cx, cy + half), NOTCH_R, 0, 180, 
                              edgecolor='black', facecolor='#D0E0EE', linewidth=0.6, zorder=4)
    bot_notch = patches.Wedge((cx, cy - half), NOTCH_R, 180, 360, 
                              edgecolor='black', facecolor='#D0E0EE', linewidth=0.6, zorder=4)
    ax.add_patch(top_notch)
    ax.add_patch(bot_notch)
    ax.plot([cx - 1.5, cx + 1.5], [cy, cy], color='#888888', linewidth=0.5, zorder=5)
    ax.plot([cx, cx], [cy - 1.5, cy + 1.5], color='#888888', linewidth=0.5, zorder=5)
    if label:
        ax.text(cx, cy, label, fontsize=4.2, ha='center', va='center', color='#111111', weight='bold', zorder=6)

def draw_window(ax, x0, y0, w, h, label, color='#FFF5EB'):
    rect = patches.Rectangle((x0, y0), w, h, linewidth=0.9, linestyle='--',
                             edgecolor='#D97706', facecolor=color, alpha=0.8, zorder=2)
    ax.add_patch(rect)
    ax.text(x0 + w/2.0, y0 + h/2.0, label, fontsize=6.2, ha='center', va='center', color='#92400E', weight='bold', zorder=5)

def draw_reg_mark(ax, cx, cy, label=""):
    """Draws a registration crosshair target for perfect 2-sheet alignment."""
    r = 3.5
    circle = patches.Circle((cx, cy), r, edgecolor='#DC2626', facecolor='none', linewidth=0.8, zorder=12)
    ax.add_patch(circle)
    ax.plot([cx - 5.0, cx + 5.0], [cy, cy], color='#DC2626', linewidth=0.8, zorder=12)
    ax.plot([cx, cx], [cy - 5.0, cy + 5.0], color='#DC2626', linewidth=0.8, zorder=12)
    if label:
        ax.text(cx, cy + 5.5, label, fontsize=5.0, ha='center', va='bottom', color='#DC2626', weight='bold', zorder=12)

def draw_calibrated_ruler(ax, x0, y0):
    """Draws 100mm calibration ruler with 10mm ticks."""
    ax.plot([x0, x0 + 100.0], [y0, y0], color='black', linewidth=1.2, zorder=10)
    for i in range(11):
        x = x0 + i * 10.0
        h_tick = 5.0 if i % 5 == 0 else 2.5
        ax.plot([x, x], [y0, y0 + h_tick], color='black', linewidth=0.9 if i%5==0 else 0.5, zorder=10)
        if i in [0, 5, 10]:
            ax.text(x, y0 - 3.8, f"{i*10}mm", fontsize=5.5, ha='center', va='top', weight='bold')
    ax.text(x0 + 106.0, y0 + 1.5, "REGLA 100 mm (10 cm): Mide esta barra para verificar escala 1:1 exacta", 
            fontsize=6.0, weight='bold', color='#DC2626', va='center')
    ax.text(x0 + 106.0, y0 - 3.0, "En tu impresora: Selecciona 'Tamano Real' / 'Escala 100%' (NUNCA 'Ajustar')", 
            fontsize=5.2, color='#444444', va='center')

# =========================================================================
# HOJA 1: PARTE IZQUIERDA (LAYOUT A)
# X de 0 a 193 mm + 20 mm de solape (hasta 213 mm)
# =========================================================================
def draw_sheet_left(ax, is_layout_b=False):
    # Center 215mm on 297mm page -> margin left: (297 - 215)/2 = 41 mm!
    ox = 35.0 # Very safe margin for ANY laser printer!
    oy = 20.0 # 20 mm bottom margin
    bh = BOARD_H_MM
    
    # Board perimeter for left side (from 0 to 193mm + 20mm overlap)
    w_vis = 193.0
    w_overlap = 20.0
    
    # Background
    board_rect = patches.Rectangle((ox, oy), w_vis, bh, linewidth=1.5, edgecolor='black', facecolor='#FAFAFA', zorder=1)
    ax.add_patch(board_rect)
    
    # Shaded overlap strip (from 193 to 213mm)
    overlap_rect = patches.Rectangle((ox + w_vis, oy), w_overlap, bh, 
                                     linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
    ax.add_patch(overlap_rect)
    ax.text(ox + w_vis + w_overlap/2.0, oy + bh/2.0, "ZONA DE SOLAPE\n(Pega la Hoja Derecha encima de esta franja)", 
            fontsize=5.5, ha='center', va='center', rotation=90, color='#991B1B', weight='bold', zorder=5)
    
    # Cut line between P1 and P5
    y_strip = oy + (bh - 23.3)
    ax.plot([ox, ox + w_vis + w_overlap], [y_strip, y_strip], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # Cut line between P1 and P2 (at 158.0mm)
    ax.plot([ox + 158.0, ox + 158.0], [y_strip, oy + bh], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # Main split line at 193mm
    if not is_layout_b:
        ax.plot([ox + 193.0, ox + 193.0], [oy, y_strip], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.text(ox + 191.0, oy + bh - 30.0, "LINEA DE CORTE / UNION X = 193 mm", fontsize=5.8, color='#2563EB', weight='bold', rotation=90, va='top')
    else:
        # Stepped Jog line
        y_jtop = oy + (bh - 92.0)
        y_jbot = oy + (bh - 112.0)
        ax.plot([ox + 193.0, ox + 193.0], [y_jtop, y_strip], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([ox + 193.0, ox + 205.0], [y_jtop, y_jtop], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([ox + 205.0, ox + 205.0], [y_jbot, y_jtop], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([ox + 205.0, ox + 193.0], [y_jbot, y_jbot], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([ox + 193.0, ox + 193.0], [oy, y_jbot], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.text(ox + 207.0, (y_jtop + y_jbot)/2.0, "ESCALON JOG (X=205)", fontsize=5.2, color='#2563EB', weight='bold', va='center')

    # Registration Crosshairs (+)
    draw_reg_mark(ax, ox + 193.0, oy + bh - 10.0, "REG 1")
    draw_reg_mark(ax, ox + 193.0, oy + 10.0, "REG 2")
    
    # Piece Badges
    ax.text(ox + 4, oy + bh - 4, "PIEZA 1: TITULO Y LOGO (158.0 x 23.3 mm)", fontsize=6.2, weight='bold', color='#0284C7', va='top')
    p5_label = "PIEZA 5A: CUERPO IZQUIERDO (CRUCEROS)" if not is_layout_b else "PIEZA 5B: CUERPO IZQUIERDO (KAIDAI CON JOG)"
    ax.text(ox + 4, y_strip - 4, p5_label, fontsize=6.2, weight='bold', color='#059669', va='top')
    
    # Windows
    draw_window(ax, ox + 12.0, y_strip + 3.0, 140.0, 17.5, "VENTANA: TITULO Y LOGO")
    draw_window(ax, ox + 50.0, oy + 104.0, 130.0, 35.0, "VENTANA: SILUETA NAVAL", color='#F0FDF4')
    
    # Slots: Base, Mission, Port
    draw_counter_slot(ax, ox + 19.2, oy + (bh - 29.6), "Base")
    draw_counter_slot(ax, ox + 19.2, oy + (bh - 45.8), "Miss")
    draw_counter_slot(ax, ox + 19.2, oy + (bh - 62.0), "Port")
    
    # Patrol Track
    for i, plabel in enumerate(["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit"]):
        draw_counter_slot(ax, ox + 58.7 + i * 16.5, oy + (bh - 61.9), plabel)
        
    if not is_layout_b:
        # Damage Layout A (Junsen)
        for i in range(9):
            draw_counter_slot(ax, ox + 29.9 + i * 16.1, oy + (bh - 95.0), f"Fld {i+1}")
        draw_counter_slot(ax, ox + 29.9 + 9 * 16.1, oy + (bh - 95.0), "Surf")
        for i in range(9):
            draw_counter_slot(ax, ox + 29.9 + i * 16.1, oy + (bh - 107.1), f"Hull {i+1}")
        draw_counter_slot(ax, ox + 29.9 + 9 * 16.1, oy + (bh - 107.1), "SUNK")
        
        # Crew Layout A
        for i, cname in enumerate(["Capt", "Eng", "XO", "Nav", "Medic", "Pilot"]):
            draw_counter_slot(ax, ox + 19.2 + i * 16.1, oy + (bh - 143.8), cname)
        for i, cname in enumerate(["Crew", "Crew", "Crew", "Crew", "Crew"]):
            draw_counter_slot(ax, ox + 19.2 + i * 16.1, oy + (bh - 159.8), cname)
        draw_counter_slot(ax, ox + 115.8, oy + (bh - 151.8), "Qual")
    else:
        # Damage Layout B (Kaidai)
        for i in range(9):
            draw_counter_slot(ax, ox + 48.0 + i * 16.2, oy + (bh - 95.0), f"Fld {i+1}")
        draw_counter_slot(ax, ox + 48.0 + 9 * 16.2, oy + (bh - 95.0), "Surf")
        for i in range(9):
            draw_counter_slot(ax, ox + 48.0 + i * 16.2, oy + (bh - 107.1), f"Hull {i+1}")
        draw_counter_slot(ax, ox + 48.0 + 9 * 16.2, oy + (bh - 107.1), "SUNK")
        
        # Crew Layout B (middle)
        for i, cname in enumerate(["Capt", "Eng", "XO", "Nav", "Medic", "Pilot"]):
            draw_counter_slot(ax, ox + 19.2 + i * 16.1, oy + (bh - 126.0), cname)
        for i, cname in enumerate(["Crew", "Crew", "Crew", "Crew", "Crew"]):
            draw_counter_slot(ax, ox + 19.2 + i * 16.1, oy + (bh - 142.0), cname)
        draw_counter_slot(ax, ox + 115.8, oy + (bh - 134.0), "Qual")

    # Header & Calibration Ruler
    title_ly = "LAYOUT A (Cruceros)" if not is_layout_b else "LAYOUT B (Ataque / Kaidai)"
    ax.text(ox, oy + bh + 12.0, f"SENSUIKAN 1:1 - HOJA 1 DE 2: PARTE IZQUIERDA - {title_ly}", fontsize=11, weight='bold', color='#1E293B')
    ax.text(ox, oy + bh + 7.0, "Instrucciones: Imprime esta hoja y la Hoja 2 al 100%. Alinea las cruces (+) y solapa la franja roja.", fontsize=6.2, color='#475569')
    draw_calibrated_ruler(ax, ox, 8.0)

# =========================================================================
# HOJA 2: PARTE DERECHA (LAYOUT A / B)
# X de 170 mm a 280 mm (110 mm)
# =========================================================================
def draw_sheet_right(ax, is_layout_b=False):
    # Center 130mm on 297mm page -> margin left: (297 - 130)/2 = 83 mm!
    # Super safe margins (80 mm left/right)!
    ox = 80.0
    oy = 20.0
    bh = BOARD_H_MM
    
    # In full board coordinates: this sheet covers X from 173.0 to 280.0 mm
    # So X_origin in full board is 173.0 mm!
    # ox corresponds to X = 173.0 mm.
    # Therefore, for any point with full-board coordinate X_full:
    # x_draw = ox + (X_full - 173.0)
    
    w_draw = 280.0 - 173.0 # 107.0 mm
    
    # Board perimeter for right side
    board_rect = patches.Rectangle((ox + (193.0 - 173.0), oy), 280.0 - 193.0, bh, 
                                   linewidth=1.5, edgecolor='black', facecolor='#FAFAFA', zorder=1)
    ax.add_patch(board_rect)
    
    # The extension tab to the left (from 173 to 193 mm) that overlaps Sheet 1
    overlap_tab = patches.Rectangle((ox, oy), 193.0 - 173.0, bh, 
                                    linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
    ax.add_patch(overlap_tab)
    ax.text(ox + (193.0 - 173.0)/2.0, oy + bh/2.0, "SOLAPE PARA PEGAR CON HOJA 1", 
            fontsize=5.5, ha='center', va='center', rotation=90, color='#991B1B', weight='bold', zorder=5)

    y_strip = oy + (bh - 23.3)
    ax.plot([ox, ox + w_draw], [y_strip, y_strip], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # P1/P2 cut is at X = 158mm (to the left of 173mm), so top strip here is 100% Piece 2
    # Vertical cut line at X = 193 mm:
    x_193 = ox + (193.0 - 173.0)
    
    if not is_layout_b:
        y_split_p3_p4 = oy + (bh - 77.5)
        ax.plot([x_193, ox + w_draw], [y_split_p3_p4, y_split_p3_p4], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
        ax.plot([x_193, x_193], [oy, y_strip], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    else:
        y_split_p3_p4 = oy + (bh - 88.0)
        ax.plot([x_193, ox + w_draw], [y_split_p3_p4, y_split_p3_p4], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
        
        # Stepped jog on right piece
        y_jtop = oy + (bh - 92.0)
        y_jbot = oy + (bh - 112.0)
        x_205 = ox + (205.0 - 173.0)
        ax.plot([x_193, x_193], [y_jtop, y_strip], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([x_193, x_205], [y_jtop, y_jtop], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([x_205, x_205], [y_jbot, y_jtop], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([x_205, x_193], [y_jbot, y_jbot], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
        ax.plot([x_193, x_193], [oy, y_jbot], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)

    # Registration Crosshairs (+)
    draw_reg_mark(ax, x_193, oy + bh - 10.0, "REG 1")
    draw_reg_mark(ax, x_193, oy + 10.0, "REG 2")
    
    # Piece Badges
    p2_badge = "PIEZA 2A: AVIACION (122.0 x 23.3 mm)" if not is_layout_b else "PIEZA 2A: EVENTOS (122.0 x 23.3 mm)"
    ax.text(x_193 + 4, oy + bh - 4, p2_badge, fontsize=6.2, weight='bold', color='#D97706', va='top')
    p3_badge = "PIEZA 3A: TUBOS Y RECARGAS (87x54mm)" if not is_layout_b else "PIEZA 3B: 8 TUBOS ATAQUE (87x65mm)"
    ax.text(x_193 + 4, y_strip - 4, p3_badge, fontsize=6.2, weight='bold', color='#2563EB', va='top')
    p4_badge = "PIEZA 4A: SISTEMAS CRUCERO (87x93mm)" if not is_layout_b else "PIEZA 4B: SISTEMAS ATAQUE (RETRANQUEO)"
    ax.text(x_193 + 4, y_split_p3_p4 - 4, p4_badge, fontsize=6.2, weight='bold', color='#7C3AED', va='top')
    
    # Windows
    if not is_layout_b:
        draw_window(ax, ox + (158.0 + 3.0 - 173.0), y_strip + 3.0, 36.0, 17.5, "VENTANA AIRCRAFT")
        draw_window(ax, x_193 + 3.0, y_split_p3_p4 + 4.0, 81.0, 24.0, "VENTANA RECARGAS (9)")
    else:
        draw_window(ax, x_193 + 3.0, y_split_p3_p4 + 3.0, 81.0, 17.0, "VENTANA RECARGAS (8)")
        
    # SLOTS ON RIGHT SIDE:
    # Events
    draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 15.4), "Evt 1")
    draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 15.4), "Evt 2")
    if not is_layout_b:
        draw_counter_slot(ax, ox + (211.7 - 173.0), oy + (bh - 15.2), "Avion")
        
    # Torpedo Tubes
    for i in range(4):
        draw_counter_slot(ax, ox + (212.3 + i * 16.0 - 173.0), oy + (bh - 29.6), f"Torp {i+1}")
        
    if not is_layout_b:
        # Row 2 (Torp 5-6, Reloads)
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 45.6), "Torp 5")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 45.6), "Torp 6")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 45.6), "Aft Rel")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 45.6), "Aft Rel")
        
        # Guns
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 86.7), "127mm")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 86.7), "Ammo")
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 104.2), "13mm AA")
        
        # Systems (Crane / Hangar)
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 106.2), "Crane")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 106.2), "Hangar")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 120.2), "F.Odd")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 120.2), "F.Even")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 134.2), "Radio")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 134.2), "DivePl")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 134.2), "AftDoor")
        # Row 4 & 5
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 148.2), "Mot 1")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 148.2), "Mot 2")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 148.2), "Eng 1")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 148.2), "Eng 2")
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 162.2), "Fuel")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 162.2), "Hydro")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 162.2), "Batt")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 162.2), "Peris")
    else:
        # Layout B (8 Tubes: 3 rows)
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 45.0), "Torp 5")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 45.0), "Torp 6")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 45.0), "Aft Rel")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 45.0), "Aft Rel")
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 60.5), "Torp 7")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 60.5), "Torp 8")
        
        # Guns (120mm Gun, Ammo)
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 95.0), "120mm")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 95.0), "Ammo")
        
        # Systems (4 rows without Crane/Hangar)
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 106.2), "F.Odd")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 106.2), "F.Even")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 120.2), "Radio")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 120.2), "DivePl")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 120.2), "AftDoor")
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 134.2), "Mot 1")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 134.2), "Mot 2")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 134.2), "Eng 1")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 134.2), "Eng 2")
        draw_counter_slot(ax, ox + (212.3 - 173.0), oy + (bh - 148.2), "Fuel")
        draw_counter_slot(ax, ox + (228.3 - 173.0), oy + (bh - 148.2), "Hydro")
        draw_counter_slot(ax, ox + (244.3 - 173.0), oy + (bh - 148.2), "Batt")
        draw_counter_slot(ax, ox + (260.3 - 173.0), oy + (bh - 148.2), "Peris")

    # Header & Calibration Ruler
    title_ly = "LAYOUT A (Cruceros)" if not is_layout_b else "LAYOUT B (Ataque / Kaidai)"
    ax.text(ox, oy + bh + 12.0, f"SENSUIKAN 1:1 - HOJA 2 DE 2: PARTE DERECHA - {title_ly}", fontsize=11, weight='bold', color='#1E293B')
    ax.text(ox, oy + bh + 7.0, "Instrucciones: Recorta por la linea de puntos de solape y pega alineando las cruces (+).", fontsize=6.2, color='#475569')
    draw_calibrated_ruler(ax, ox, 8.0)

# =========================================================================
# GENERATE MULTI-PAGE PDF & PNGS
# =========================================================================
fig_w_in = PAGE_W_MM / 25.4
fig_h_in = PAGE_H_MM / 25.4

pdf_file = "sensuikan_planta_dividida_2_hojas_impresion.pdf"
pdf_artifact = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_planta_dividida_2_hojas_impresion.pdf"

with PdfPages(pdf_file) as pdf:
    # Page 1: Layout A Left
    fig1 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax1 = fig1.add_axes([0, 0, 1, 1])
    ax1.set_xlim(0, PAGE_W_MM); ax1.set_ylim(0, PAGE_H_MM); ax1.set_aspect('equal'); ax1.axis('off')
    draw_sheet_left(ax1, is_layout_b=False)
    pdf.savefig(fig1)
    fig1.savefig("hoja1_layout_a_izq.png", dpi=300)
    fig1.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/hoja1_layout_a_izq.png", dpi=300)
    plt.close(fig1)

    # Page 2: Layout A Right
    fig2 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax2 = fig2.add_axes([0, 0, 1, 1])
    ax2.set_xlim(0, PAGE_W_MM); ax2.set_ylim(0, PAGE_H_MM); ax2.set_aspect('equal'); ax2.axis('off')
    draw_sheet_right(ax2, is_layout_b=False)
    pdf.savefig(fig2)
    fig2.savefig("hoja2_layout_a_der.png", dpi=300)
    fig2.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/hoja2_layout_a_der.png", dpi=300)
    plt.close(fig2)

    # Page 3: Layout B Left (Kaidai with Jog)
    fig3 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax3 = fig3.add_axes([0, 0, 1, 1])
    ax3.set_xlim(0, PAGE_W_MM); ax3.set_ylim(0, PAGE_H_MM); ax3.set_aspect('equal'); ax3.axis('off')
    draw_sheet_left(ax3, is_layout_b=True)
    pdf.savefig(fig3)
    fig3.savefig("hoja3_layout_b_izq.png", dpi=300)
    fig3.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/hoja3_layout_b_izq.png", dpi=300)
    plt.close(fig3)

    # Page 4: Layout B Right (Kaidai with Jog)
    fig4 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax4 = fig4.add_axes([0, 0, 1, 1])
    ax4.set_xlim(0, PAGE_W_MM); ax4.set_ylim(0, PAGE_H_MM); ax4.set_aspect('equal'); ax4.axis('off')
    draw_sheet_right(ax4, is_layout_b=True)
    pdf.savefig(fig4)
    fig4.savefig("hoja4_layout_b_der.png", dpi=300)
    fig4.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/hoja4_layout_b_der.png", dpi=300)
    plt.close(fig4)

shutil.copyfile(pdf_file, pdf_artifact)
print("SUCCESS: Generated 2-sheet split PDF and high-res PNGs in project and artifact folders!")
