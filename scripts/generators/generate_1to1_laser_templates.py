import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import json
import numpy as np

# A4 Landscape dimensions in mm: 297 x 210
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0

# Board dimensions in mm: 280 x 170
BOARD_W_MM = 280.0
BOARD_H_MM = 170.0

# Centering on A4 sheet
OFFSET_X = (PAGE_W_MM - BOARD_W_MM) / 2.0 # 8.5 mm
OFFSET_Y = (PAGE_H_MM - BOARD_H_MM) / 2.0 # 20.0 mm

# Slot standard: 13.2 x 13.2 mm square, 1.6 mm radius nail notch
SLOT_SIZE = 13.2
NOTCH_R = 1.6

# Load detected grid coordinates from JSON
with open('grid_definition.json') as f:
    grid = json.load(f)

scale_x = BOARD_W_MM / 525.0
scale_y = BOARD_H_MM / 408.0

def draw_counter_slot(ax, cx, cy, label=None):
    """Draws a 13.2 x 13.2 mm square slot with 1.6 mm nail notches at top and bottom."""
    half = SLOT_SIZE / 2.0
    x0 = cx - half
    y0 = cy - half
    
    # Square slot outline
    rect = patches.Rectangle((x0, y0), SLOT_SIZE, SLOT_SIZE, 
                             linewidth=0.8, edgecolor='black', facecolor='#F0F4F8', zorder=3)
    ax.add_patch(rect)
    
    # Nail notches: top and bottom semicircles
    top_notch = patches.Wedge((cx, cy + half), NOTCH_R, 0, 180, 
                              edgecolor='black', facecolor='#D0E0EE', linewidth=0.6, zorder=4)
    bot_notch = patches.Wedge((cx, cy - half), NOTCH_R, 180, 360, 
                              edgecolor='black', facecolor='#D0E0EE', linewidth=0.6, zorder=4)
    ax.add_patch(top_notch)
    ax.add_patch(bot_notch)
    
    # Center crosshair
    ax.plot([cx - 1.5, cx + 1.5], [cy, cy], color='#888888', linewidth=0.5, zorder=5)
    ax.plot([cx, cx], [cy - 1.5, cy + 1.5], color='#888888', linewidth=0.5, zorder=5)
    
    if label:
        ax.text(cx, cy, label, fontsize=4.2, ha='center', va='center', 
                color='#111111', weight='bold', zorder=6)

def draw_window(ax, x0, y0, w, h, label, color='#FFF5EB'):
    """Draws an open viewing window."""
    rect = patches.Rectangle((x0, y0), w, h, linewidth=0.9, linestyle='--',
                             edgecolor='#D97706', facecolor=color, alpha=0.8, zorder=2)
    ax.add_patch(rect)
    ax.text(x0 + w/2.0, y0 + h/2.0, label, fontsize=6.5, ha='center', va='center', 
            color='#92400E', weight='bold', zorder=5)

def draw_scale_ruler(ax):
    """Draws a calibrated 100 mm verification ruler with 10 mm and 1 mm ticks."""
    rx0 = 20.0
    ry0 = 10.0 # Bottom margin (Y = 10 mm)
    
    # 100 mm bar
    ax.plot([rx0, rx0 + 100.0], [ry0, ry0], color='black', linewidth=1.5, zorder=10)
    
    # 10 mm ticks and numbers
    for i in range(11):
        x = rx0 + i * 10.0
        h_tick = 4.0 if i % 5 == 0 else 2.5
        if i == 0 or i == 5 or i == 10:
            h_tick = 5.5
            ax.text(x, ry0 - 4.5, f"{i*10}mm", fontsize=6, ha='center', va='top', weight='bold')
        ax.plot([x, x], [ry0, ry0 + h_tick], color='black', linewidth=1.0 if i%5==0 else 0.6, zorder=10)
        
    # 1 mm ticks for the first 10 mm
    for j in range(10):
        x = rx0 + j * 1.0
        ax.plot([x, x], [ry0, ry0 + 1.2], color='black', linewidth=0.4, zorder=10)
        
    # Ruler label
    ax.text(rx0 + 108.0, ry0 + 1.5, 
            "REGLA DE CALIBRACION 100 mm (10 cm): Comprueba con una regla fisica que mida exactamente 100 mm.", 
            fontsize=6.5, ha='left', va='center', weight='bold', color='red', zorder=10)
    ax.text(rx0 + 108.0, ry0 - 3.5, 
            "Al imprimir en tu impresora laser: selecciona 'Tamano Real' o 'Escala 100%' (NUNCA 'Ajustar a pagina').", 
            fontsize=5.5, ha='left', va='center', color='#333333', zorder=10)

def draw_crop_marks(ax, bx, by, bw, bh):
    """Draws printer crop marks at the 4 corners of the board."""
    mark_len = 8.0
    mark_gap = 2.0
    corners = [(bx, by), (bx + bw, by), (bx, by + bh), (bx + bw, by + bh)]
    for cx, cy in corners:
        # horizontal mark
        dx = -1 if cx == bx else 1
        ax.plot([cx + dx*mark_gap, cx + dx*(mark_gap + mark_len)], [cy, cy], color='black', linewidth=0.8)
        # vertical mark
        dy = -1 if cy == by else 1
        ax.plot([cx, cx], [cy + dy*mark_gap, cy + dy*(mark_gap + mark_len)], color='black', linewidth=0.8)

# =========================================================================
# GENERATE LAYOUT A (CRUISERS / AVIATION)
# =========================================================================
def build_page_layout_a(ax):
    bx = OFFSET_X
    by = OFFSET_Y
    bw = BOARD_W_MM
    bh = BOARD_H_MM
    
    # Outer board outline
    outer = patches.Rectangle((bx, by), bw, bh, linewidth=1.8, edgecolor='black', facecolor='#FAFAFA', zorder=1)
    ax.add_patch(outer)
    
    draw_crop_marks(ax, bx, by, bw, bh)
    draw_scale_ruler(ax)
    
    # Title & Metadata on top margin
    ax.text(bx, by + bh + 13.0, "SENSUIKAN: PLANTA REAL 1:1 - LAYOUT A (Cruceros con Aviacion)", 
            fontsize=12, weight='bold', color='#1E293B')
    ax.text(bx, by + bh + 8.5, 
            "Compatible con: Junsen J.2, J.1M, J.3, Type A, Type A Mod, Type B, Type B.3, Sen-Toku | Tamano: 280 x 170 mm", 
            fontsize=7, color='#475569')
    ax.text(bx + bw, by + bh + 8.5, "IMPRESION ESCALA 100% (1:1)", 
            fontsize=8, weight='bold', ha='right', color='#DC2626')
    
    # CUT LINES:
    # 1. Top strip cut at Y = 170 - 23.3 = 146.7 mm from bottom
    y_cut_strip = by + (bh - 23.3)
    ax.plot([bx, bx + bw], [y_cut_strip, y_cut_strip], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # 2. P1 vs P2 cut at X = 158.0 mm
    x_cut_p1 = bx + 158.0
    ax.plot([x_cut_p1, x_cut_p1], [y_cut_strip, by + bh], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # 3. P5 vs (P3/P4) vertical cut at X = 193.0 mm (straight line)
    x_cut_p5 = bx + 193.0
    ax.plot([x_cut_p5, x_cut_p5], [by, y_cut_strip], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # 4. P3A vs P4A horizontal cut at Y = 170 - 77.5 = 92.5 mm from bottom
    y_cut_p3_p4 = by + (bh - 77.5)
    ax.plot([x_cut_p5, bx + bw], [y_cut_p3_p4, y_cut_p3_p4], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # Piece Badges
    ax.text(bx + 4, by + bh - 4, "PIEZA 1: TITULO Y LOGO (158.0 x 23.3 mm)", fontsize=6.5, weight='bold', color='#0284C7', va='top')
    ax.text(x_cut_p1 + 4, by + bh - 4, "PIEZA 2A: AVIACION (122.0 x 23.3 mm)", fontsize=6.5, weight='bold', color='#D97706', va='top')
    ax.text(x_cut_p5 + 4, y_cut_strip - 4, "PIEZA 3A: TUBOS Y RECARGAS (87.0 x 54.2 mm)", fontsize=6.5, weight='bold', color='#2563EB', va='top')
    ax.text(x_cut_p5 + 4, y_cut_p3_p4 - 4, "PIEZA 4A: SISTEMAS CRUCERO (87.0 x 92.5 mm)", fontsize=6.5, weight='bold', color='#7C3AED', va='top')
    ax.text(bx + 4, y_cut_strip - 4, "PIEZA 5A: CUERPO IZQUIERDO CRUCEROS (193.0 x 146.7 mm)", fontsize=6.5, weight='bold', color='#059669', va='top')
    
    # VIEWING WINDOWS:
    # Title & Logo Window (in Piece 1)
    draw_window(ax, bx + 12.0, y_cut_strip + 3.0, 140.0, 17.5, "VENTANA: TITULO DEL SUBMARINO Y LOGO SENSUIKAN")
    # Submarine Silhouette Window (in Piece 5)
    draw_window(ax, bx + 50.0, by + 104.0, 130.0, 35.0, "VENTANA: SILUETA NAVAL DEL SUBMARINO", color='#F0FDF4')
    # Forward Reloads Window (in Piece 3A)
    draw_window(ax, x_cut_p5 + 3.0, y_cut_p3_p4 + 4.0, 81.0, 24.0, "VENTANA: RECARGAS (9)", color='#EFF6FF')
    # Aircraft Window (in Piece 2A)
    draw_window(ax, x_cut_p1 + 3.0, y_cut_strip + 3.0, 36.0, 17.5, "VENTANA AIRCRAFT")
    
    # COUNTER SLOTS LAYOUT A:
    # 1. Base / Mission / Port (Left column)
    draw_counter_slot(ax, bx + 19.2, by + (bh - 29.6), "Base")
    draw_counter_slot(ax, bx + 19.2, by + (bh - 45.8), "Miss")
    draw_counter_slot(ax, bx + 19.2, by + (bh - 62.0), "Port")
    
    # 2. Patrol Track (8 slots)
    patrol_labels = ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit"]
    for i, plabel in enumerate(patrol_labels):
        cx = bx + 58.7 + i * 16.5
        cy = by + (bh - 61.9)
        draw_counter_slot(ax, cx, cy, plabel)
        
    # 3. Aircraft & Events (Piece 2A)
    draw_counter_slot(ax, bx + 211.7, by + (bh - 15.2), "Avion")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 15.4), "Evt 1")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 15.4), "Evt 2")
    
    # 4. Torpedo Tubes (Piece 3A: 2 rows: 4+2)
    # Row 1 (Forward 1-4)
    for i in range(4):
        draw_counter_slot(ax, bx + 212.3 + i * 16.0, by + (bh - 29.6), f"Torp {i+1}")
    # Row 2 (Aft 5-6, Reloads)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 45.6), "Torp 5")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 45.6), "Torp 6")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 45.6), "Aft Rel")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 45.6), "Aft Rel")
    
    # 5. Guns (Piece 4A)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 86.7), "127mm")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 86.7), "Ammo")
    draw_counter_slot(ax, bx + 212.3, by + (bh - 104.2), "13mm AA")
    
    # 6. Damage Tracks (Piece 5A)
    # Flooding (10 slots)
    for i in range(9):
        draw_counter_slot(ax, bx + 29.9 + i * 16.1, by + (bh - 95.0), f"Fld {i+1}")
    draw_counter_slot(ax, bx + 29.9 + 9 * 16.1, by + (bh - 95.0), "Surf")
    # Hull Damage (10 slots)
    for i in range(9):
        draw_counter_slot(ax, bx + 29.9 + i * 16.1, by + (bh - 107.1), f"Hull {i+1}")
    draw_counter_slot(ax, bx + 29.9 + 9 * 16.1, by + (bh - 107.1), "SUNK")
    
    # 7. Systems (Piece 4A: 5 rows with Crane/Hangar)
    draw_counter_slot(ax, bx + 244.3, by + (bh - 106.2), "Crane")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 106.2), "Hangar")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 120.2), "F.Odd")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 120.2), "F.Even")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 134.2), "Radio")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 134.2), "DivePl")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 134.2), "AftDoor")
    # Row 4 (Electric & Diesel)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 148.2), "Mot 1")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 148.2), "Mot 2")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 148.2), "Eng 1")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 148.2), "Eng 2")
    # Row 5 (Fuel, Hydro, Batt, Peri)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 162.2), "Fuel")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 162.2), "Hydro")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 162.2), "Batt")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 162.2), "Peris")
    
    # 8. Crew Status (Piece 5A)
    crew_r1 = ["Capt", "Eng", "XO", "Nav", "Medic", "Pilot"]
    for i, cname in enumerate(crew_r1):
        draw_counter_slot(ax, bx + 19.2 + i * 16.1, by + (bh - 143.8), cname)
    crew_r2 = ["Crew", "Crew", "Crew", "Crew", "Crew"]
    for i, cname in enumerate(crew_r2):
        draw_counter_slot(ax, bx + 19.2 + i * 16.1, by + (bh - 159.8), cname)
    draw_counter_slot(ax, bx + 115.8, by + (bh - 151.8), "Qual")

# =========================================================================
# GENERATE LAYOUT B (ATTACK SUBS / KAIDAI WITH STEPPED JOG CUT)
# =========================================================================
def build_page_layout_b(ax):
    bx = OFFSET_X
    by = OFFSET_Y
    bw = BOARD_W_MM
    bh = BOARD_H_MM
    
    # Outer board outline
    outer = patches.Rectangle((bx, by), bw, bh, linewidth=1.8, edgecolor='black', facecolor='#FAFAFA', zorder=1)
    ax.add_patch(outer)
    
    draw_crop_marks(ax, bx, by, bw, bh)
    draw_scale_ruler(ax)
    
    # Title & Metadata on top margin
    ax.text(bx, by + bh + 13.0, "SENSUIKAN: PLANTA REAL 1:1 - LAYOUT B (Submarinos de Ataque / Kaidai)", 
            fontsize=12, weight='bold', color='#1E293B')
    ax.text(bx, by + bh + 8.5, 
            "Compatible con: Kaidai KD.3 a KD.7, Type C, Type C.3, Sen-Taka, Kirai-Sen | Tamano: 280 x 170 mm", 
            fontsize=7, color='#475569')
    ax.text(bx + bw, by + bh + 8.5, "IMPRESION ESCALA 100% (1:1)", 
            fontsize=8, weight='bold', ha='right', color='#DC2626')
    
    # CUT LINES:
    # 1. Top strip cut at Y = 170 - 23.3 = 146.7 mm from bottom
    y_cut_strip = by + (bh - 23.3)
    ax.plot([bx, bx + bw], [y_cut_strip, y_cut_strip], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # 2. P1 vs P2 cut at X = 158.0 mm
    x_cut_p1 = bx + 158.0
    ax.plot([x_cut_p1, x_cut_p1], [y_cut_strip, by + bh], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # 3. P3B vs P4B horizontal cut at Y = 170 - 88.0 = 82.0 mm from bottom
    y_cut_p3_p4 = by + (bh - 88.0)
    x_cut_p5_base = bx + 193.0
    ax.plot([x_cut_p5_base, bx + bw], [y_cut_p3_p4, y_cut_p3_p4], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # 4. STEPPED JOG CUT LINE between P5B and (P3B/P4B):
    # From top strip down to Y = 88.0 mm (from top): straight line at X = 193.0 mm
    ax.plot([x_cut_p5_base, x_cut_p5_base], [y_cut_p3_p4, y_cut_strip], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # Between Y = 88.0 and Y = 92.0 (from top): straight at X = 193.0 mm
    y_jog_top = by + (bh - 92.0)
    ax.plot([x_cut_p5_base, x_cut_p5_base], [y_jog_top, y_cut_p3_p4], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # Horizontal jog quiebro 1 (from X = 193.0 to X = 205.0 mm at Y = 92.0 mm)
    x_jog = bx + 205.0
    ax.plot([x_cut_p5_base, x_jog], [y_jog_top, y_jog_top], color='#DC2626', linestyle='--', linewidth=1.5, zorder=8)
    
    # Vertical jog step down to Y = 112.0 mm at X = 205.0 mm
    y_jog_bot = by + (bh - 112.0)
    ax.plot([x_jog, x_jog], [y_jog_bot, y_jog_top], color='#DC2626', linestyle='--', linewidth=1.5, zorder=8)
    
    # Horizontal jog quiebro 2 (from X = 205.0 to X = 193.0 mm at Y = 112.0 mm)
    ax.plot([x_jog, x_cut_p5_base], [y_jog_bot, y_jog_bot], color='#DC2626', linestyle='--', linewidth=1.5, zorder=8)
    
    # Straight down to board bottom at X = 193.0 mm
    ax.plot([x_cut_p5_base, x_cut_p5_base], [by, y_jog_bot], color='#DC2626', linestyle='--', linewidth=1.2, zorder=8)
    
    # Piece Badges
    ax.text(bx + 4, by + bh - 4, "PIEZA 1: TITULO Y LOGO (158.0 x 23.3 mm)", fontsize=6.5, weight='bold', color='#0284C7', va='top')
    ax.text(x_cut_p1 + 4, by + bh - 4, "PIEZA 2A: EVENTOS (122.0 x 23.3 mm)", fontsize=6.5, weight='bold', color='#D97706', va='top')
    ax.text(x_cut_p5_base + 4, y_cut_strip - 4, "PIEZA 3B: 8 TUBOS ATAQUE (87.0 x 64.7 mm)", fontsize=6.5, weight='bold', color='#2563EB', va='top')
    ax.text(x_jog + 4, y_cut_p3_p4 - 4, "PIEZA 4B: SISTEMAS (CON RETRANQUEO)", fontsize=6.5, weight='bold', color='#7C3AED', va='top')
    ax.text(bx + 4, y_cut_strip - 4, "PIEZA 5B: CUERPO IZQUIERDO KAIDAI (CON PESTANA SUNK)", fontsize=6.5, weight='bold', color='#059669', va='top')
    
    # VIEWING WINDOWS:
    draw_window(ax, bx + 12.0, y_cut_strip + 3.0, 140.0, 17.5, "VENTANA: TITULO DEL SUBMARINO Y LOGO SENSUIKAN")
    draw_window(ax, bx + 50.0, by + 104.0, 130.0, 35.0, "VENTANA: SILUETA NAVAL DEL SUBMARINO", color='#F0FDF4')
    # Forward Reloads Window (in Piece 3B - lower down)
    draw_window(ax, x_cut_p5_base + 3.0, y_cut_p3_p4 + 3.0, 81.0, 17.0, "VENTANA: RECARGAS (8)", color='#EFF6FF')
    
    # COUNTER SLOTS LAYOUT B:
    # 1. Base / Mission / Port
    draw_counter_slot(ax, bx + 19.2, by + (bh - 29.6), "Base")
    draw_counter_slot(ax, bx + 19.2, by + (bh - 45.8), "Miss")
    draw_counter_slot(ax, bx + 19.2, by + (bh - 62.0), "Port")
    
    # 2. Patrol Track (8 slots)
    patrol_labels = ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Transit"]
    for i, plabel in enumerate(patrol_labels):
        cx = bx + 58.7 + i * 16.5
        cy = by + (bh - 61.9)
        draw_counter_slot(ax, cx, cy, plabel)
        
    # 3. Events (Piece 2A)
    draw_counter_slot(ax, bx + 244.3, by + (bh - 15.4), "Evt 1")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 15.4), "Evt 2")
    
    # 4. Torpedo Tubes (Piece 3B: 3 rows: 4+2+2 = 8 tubes)
    # Row 1 (Fwd 1-4)
    for i in range(4):
        draw_counter_slot(ax, bx + 212.3 + i * 16.0, by + (bh - 29.6), f"Torp {i+1}")
    # Row 2 (Fwd 5-6, Aft Reloads)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 45.0), "Torp 5")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 45.0), "Torp 6")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 45.0), "Aft Rel")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 45.0), "Aft Rel")
    # Row 3 (Aft 7-8)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 60.5), "Torp 7")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 60.5), "Torp 8")
    
    # 5. Guns (Piece 4B: 120mm Gun, Ammo x5)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 95.0), "120mm")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 95.0), "Ammo")
    
    # 6. Damage Tracks in Kaidai (Shifted right: X = 45 to 202 mm, Y = 95 to 110 mm)
    # Notice that SUNK sits in the JOG area inside Piece 5B!
    for i in range(9):
        draw_counter_slot(ax, bx + 48.0 + i * 16.2, by + (bh - 95.0), f"Fld {i+1}")
    draw_counter_slot(ax, bx + 48.0 + 9 * 16.2, by + (bh - 95.0), "Surf") # X = 193.8 mm
    
    for i in range(9):
        draw_counter_slot(ax, bx + 48.0 + i * 16.2, by + (bh - 107.1), f"Hull {i+1}")
    # SUNK at X = 193.8 mm (inside the jog extension to X = 205 mm!)
    draw_counter_slot(ax, bx + 48.0 + 9 * 16.2, by + (bh - 107.1), "SUNK")
    
    # Highlight SUNK in Jog
    ax.text(bx + 48.0 + 9 * 16.2, by + (bh - 107.1) - 10.0, "SUNK alojado en el Jog", 
            fontsize=5.5, ha='center', color='red', weight='bold')
    
    # 7. Systems (Piece 4B: 4 rows without Crane/Hangar)
    draw_counter_slot(ax, bx + 244.3, by + (bh - 106.2), "F.Odd")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 106.2), "F.Even")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 120.2), "Radio")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 120.2), "DivePl")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 120.2), "AftDoor")
    # Row 3 (Electric & Diesel)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 134.2), "Mot 1")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 134.2), "Mot 2")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 134.2), "Eng 1")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 134.2), "Eng 2")
    # Row 4 (Fuel, Hydro, Batt, Peri)
    draw_counter_slot(ax, bx + 212.3, by + (bh - 148.2), "Fuel")
    draw_counter_slot(ax, bx + 228.3, by + (bh - 148.2), "Hydro")
    draw_counter_slot(ax, bx + 244.3, by + (bh - 148.2), "Batt")
    draw_counter_slot(ax, bx + 260.3, by + (bh - 148.2), "Peris")
    
    # 8. Crew Status in Kaidai (In the middle / above stats)
    crew_r1 = ["Capt", "Eng", "XO", "Nav", "Medic", "Pilot"]
    for i, cname in enumerate(crew_r1):
        draw_counter_slot(ax, bx + 19.2 + i * 16.1, by + (bh - 126.0), cname)
    crew_r2 = ["Crew", "Crew", "Crew", "Crew", "Crew"]
    for i, cname in enumerate(crew_r2):
        draw_counter_slot(ax, bx + 19.2 + i * 16.1, by + (bh - 142.0), cname)
    draw_counter_slot(ax, bx + 115.8, by + (bh - 134.0), "Qual")

# =========================================================================
# RUN AND EXPORT PDF AND HIGH-RES PNGS
# =========================================================================
fig_w_in = PAGE_W_MM / 25.4
fig_h_in = PAGE_H_MM / 25.4

pdf_path = "sensuikan_plantillas_1a1_impresion_laser.pdf"
pdf_artifact = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_plantillas_1a1_impresion_laser.pdf"

with PdfPages(pdf_path) as pdf:
    # Page 1: Layout A
    fig1, ax1 = plt.subplots(figsize=(fig_w_in, fig_h_in))
    ax1.set_xlim(0, PAGE_W_MM)
    ax1.set_ylim(0, PAGE_H_MM)
    ax1.set_aspect('equal')
    ax1.axis('off')
    build_page_layout_a(ax1)
    pdf.savefig(fig1, dpi=300)
    fig1.savefig("sensuikan_planta_1a1_layout_a.png", dpi=300)
    fig1.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_planta_1a1_layout_a.png", dpi=300)
    plt.close(fig1)
    
    # Page 2: Layout B
    fig2, ax2 = plt.subplots(figsize=(fig_w_in, fig_h_in))
    ax2.set_xlim(0, PAGE_W_MM)
    ax2.set_ylim(0, PAGE_H_MM)
    ax2.set_aspect('equal')
    ax2.axis('off')
    build_page_layout_b(ax2)
    pdf.savefig(fig2, dpi=300)
    fig2.savefig("sensuikan_planta_1a1_layout_b.png", dpi=300)
    fig2.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_planta_1a1_layout_b.png", dpi=300)
    plt.close(fig2)

# Copy PDF to artifact folder as well
import shutil
shutil.copyfile(pdf_path, pdf_artifact)

print("SUCCESS: Generated 1:1 Vector PDF and 300 DPI PNGs successfully!")
