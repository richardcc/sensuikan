import os
import json
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import fitz # pymupdf
import shutil

# =============================================================================
# CONSTANTS & SCALING
# =============================================================================
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0
BROTHER_COMP = 100.0 / 95.0 # ~1.05263158 (calibrated for Brother DCP-L2520DW)

CARD_W_MM = 280.0
CARD_H_MM = 215.0

# User specified: 15x15 mm slots for the entire design
SLOT_SIZE = 15.0
NOTCH_R = 1.8

scale_x = CARD_W_MM / 525.0 # ~0.5333
scale_y = CARD_H_MM / 408.0 # ~0.5270

# Modular split boundaries
SPLIT_X1 = 158.0   # Split between P1 and P2
SPLIT_X2 = 193.1   # Main vertical split between P5 and P3/P4
STRIP_H  = 29.5    # Height of top strip (P1 and P2)
SPLIT_Y2_A = 77.5  # Split between P3 and P4 (Layout A)
SPLIT_Y2_B = 88.0  # Split between P3 and P4 (Layout B)
JOG_X = 205.0      # Stepped Jog cut for Layout B (P4B / P5B)
JOG_Y_START = 92.0
JOG_Y_END = 112.0

grid_path = 'data/grid_definition.json' if os.path.exists('data/grid_definition.json') else 'grid_definition.json'
with open(grid_path) as f:
    grid = json.load(f)

# =============================================================================
# DRAWING HELPERS WITH DIMENSIONS (COTAS)
# =============================================================================
def draw_dim_h(ax, x0, x1, y, text, color='#2563EB', offset=2.5, lw=0.75):
    """Draws a horizontal engineering dimension arrow with text."""
    ax.annotate('', xy=(x0, y), xytext=(x1, y),
                arrowprops=dict(arrowstyle='<->', color=color, lw=lw, shrinkA=0, shrinkB=0))
    ax.plot([x0, x0], [y - 1.5*BROTHER_COMP, y + 1.5*BROTHER_COMP], color=color, lw=lw*0.8)
    ax.plot([x1, x1], [y - 1.5*BROTHER_COMP, y + 1.5*BROTHER_COMP], color=color, lw=lw*0.8)
    ax.text((x0+x1)/2.0, y + offset*BROTHER_COMP, text, fontsize=5.2, color=color, ha='center', va='bottom', weight='bold')

def draw_dim_v(ax, x, y0, y1, text, color='#2563EB', offset=2.5, lw=0.75):
    """Draws a vertical engineering dimension arrow with text."""
    ax.annotate('', xy=(x, y0), xytext=(x, y1),
                arrowprops=dict(arrowstyle='<->', color=color, lw=lw, shrinkA=0, shrinkB=0))
    ax.plot([x - 1.5*BROTHER_COMP, x + 1.5*BROTHER_COMP], [y0, y0], color=color, lw=lw*0.8)
    ax.plot([x - 1.5*BROTHER_COMP, x + 1.5*BROTHER_COMP], [y1, y1], color=color, lw=lw*0.8)
    ax.text(x + offset*BROTHER_COMP, (y0+y1)/2.0, text, fontsize=5.2, color=color, ha='left', va='center', weight='bold')

def draw_calibrated_ruler(ax, x0, y0):
    ruler_len = 100.0 * BROTHER_COMP
    ax.plot([x0, x0 + ruler_len], [y0, y0], color='black', linewidth=1.2, zorder=10)
    for i in range(11):
        x = x0 + i * 10.0 * BROTHER_COMP
        h_tick = 5.0 if i % 5 == 0 else 2.5
        ax.plot([x, x], [y0, y0 + h_tick], color='black', linewidth=0.9 if i%5==0 else 0.5, zorder=10)
        if i in [0, 5, 10]:
            ax.text(x, y0 - 3.8, f"{i*10}mm", fontsize=5.5, ha='center', va='top', weight='bold')
    ax.text(x0 + ruler_len/2.0, y0 + 7.5, "REGLA DE CALIBRACION 100 mm (10 cm): Debe medir exactamente 10.0 cm con una regla física", 
            fontsize=6.2, weight='bold', color='#DC2626', ha='center', va='bottom')

def draw_slot_15x15(ax, cx, cy, label='', bg='#F1F5F9', border='black'):
    half = (SLOT_SIZE / 2.0) * BROTHER_COMP
    rect = patches.Rectangle((cx - half, cy - half), SLOT_SIZE*BROTHER_COMP, SLOT_SIZE*BROTHER_COMP,
                             linewidth=0.8, edgecolor=border, facecolor=bg, zorder=4)
    ax.add_patch(rect)
    # Semicircular nail notches
    nr = NOTCH_R * BROTHER_COMP
    top_notch = patches.Wedge((cx, cy + half), nr, 0, 180, edgecolor=border, facecolor='#E2E8F0', linewidth=0.55, zorder=5)
    bot_notch = patches.Wedge((cx, cy - half), nr, 180, 360, edgecolor=border, facecolor='#E2E8F0', linewidth=0.55, zorder=5)
    ax.add_patch(top_notch)
    ax.add_patch(bot_notch)
    if label:
        ax.text(cx, cy, label[:5], fontsize=4.2, ha='center', va='center', weight='bold', color='#0F172A', zorder=6)

# =============================================================================
# PAGE 1: PIECE 5 (MAIN LEFT MODULE - P5A and P5B) WITH DIMENSIONS
# =============================================================================
def draw_page_1(ax):
    ox = 50.0
    oy = 15.0
    
    w_p5 = SPLIT_X2 * BROTHER_COMP # 193.1 * comp = ~203.3 mm
    h_p5 = (CARD_H_MM - STRIP_H) * BROTHER_COMP # 185.5 * comp = ~195.3 mm
    
    # Outer cut border P5A (straight cut)
    rect_p5 = patches.Rectangle((ox, oy), w_p5, h_p5, linewidth=1.5, edgecolor='#0F172A', facecolor='#F8FAFC', zorder=1)
    ax.add_patch(rect_p5)
    
    # Jog tongue for P5B (extends into X=205mm between Y=92 and 112 from top)
    jog_y0_canvas = oy + h_p5 - JOG_Y_END * BROTHER_COMP + STRIP_H * BROTHER_COMP
    jog_y1_canvas = oy + h_p5 - JOG_Y_START * BROTHER_COMP + STRIP_H * BROTHER_COMP
    jog_w_extra = (JOG_X - SPLIT_X2) * BROTHER_COMP
    
    jog_poly = patches.Rectangle((ox + w_p5, jog_y0_canvas), jog_w_extra, jog_y1_canvas - jog_y0_canvas,
                                 linewidth=1.2, linestyle='--', edgecolor='#2563EB', facecolor='#EFF6FF', alpha=0.85, zorder=2)
    ax.add_patch(jog_poly)
    ax.text(ox + w_p5 + jog_w_extra/2.0, (jog_y0_canvas + jog_y1_canvas)/2.0, "LENGÜETA JOG\n(P5B Flota)", 
            fontsize=5.0, weight='bold', color='#2563EB', ha='center', va='center', zorder=3)
    
    # Submarine Silhouette Central Window (Troquelado para ver submarino)
    sub_w = 118.0 * BROTHER_COMP
    sub_h = 24.0 * BROTHER_COMP
    sub_x = ox + 32.0 * BROTHER_COMP
    sub_y = oy + 65.0 * BROTHER_COMP
    sub_win = patches.Rectangle((sub_x, sub_y), sub_w, sub_h, linewidth=1.2, linestyle='-.', 
                                edgecolor='#D97706', facecolor='#FEF3C7', alpha=0.7, zorder=3)
    ax.add_patch(sub_win)
    ax.text(sub_x + sub_w/2.0, sub_y + sub_h/2.0, "VENTANA TROQUELADA: ILUSTRACION DEL SUBMARINO\n(Recortar para ver el submarino en el cartón)", 
            fontsize=6.0, weight='bold', color='#B45309', ha='center', va='center', zorder=4)

    # Slots in P5 (all 15x15 mm)
    for sec, boxes in grid.items():
        for b in boxes:
            px, py, pw, ph = b['box']
            cx_full = (px + pw/2.0) * scale_x
            cy_from_top = (py + ph/2.0) * scale_y
            
            if cx_full < SPLIT_X2 and cy_from_top >= STRIP_H:
                cx_c = ox + cx_full * BROTHER_COMP
                cy_c = oy + h_p5 - (cy_from_top - STRIP_H) * BROTHER_COMP
                
                is_sunk = 'sunk' in b['name'].lower() or ('damage' in sec and '10' in b['name'])
                bg = '#FEE2E2' if is_sunk else '#F1F5F9'
                border = '#DC2626' if is_sunk else '#334155'
                draw_slot_15x15(ax, cx_c, cy_c, label=b['name'], bg=bg, border=border)
    
    # COTAS DE LA PIEZA 5
    draw_dim_h(ax, ox, ox + w_p5, oy - 5.0*BROTHER_COMP, "Ancho P5A: 193.1 mm")
    draw_dim_h(ax, ox, ox + w_p5 + jog_w_extra, oy - 11.0*BROTHER_COMP, "Ancho P5B (con Jog): 205.0 mm", color='#059669')
    draw_dim_v(ax, ox - 6.0*BROTHER_COMP, oy, oy + h_p5, "Alto: 185.5 mm")
    draw_dim_h(ax, ox + 15.0*BROTHER_COMP, ox + 30.0*BROTHER_COMP, oy + h_p5 + 3.0*BROTHER_COMP, "Hueco: 15.0 mm", color='#DC2626')
    draw_dim_v(ax, ox + w_p5 + jog_w_extra + 3.0*BROTHER_COMP, jog_y0_canvas, jog_y1_canvas, "Jog: 20.0 mm", color='#2563EB')

    # Header & Titles
    ax.text(ox + w_p5/2.0, oy + h_p5 + 9.0*BROTHER_COMP, "PIEZA 5 (MODULO PRINCIPAL IZQUIERDO) - COTAS Y HUECOS 15x15 mm", 
            fontsize=10.0, weight='bold', color='#0F172A', ha='center')
    ax.text(ox + w_p5/2.0, oy + h_p5 + 4.0*BROTHER_COMP, "Cotas: 193.1 x 185.5 mm | Línea continua: P5A (Cruceros) | Línea azul discontinua: P5B (Flota)", 
            fontsize=6.2, color='#2563EB', weight='bold', ha='center')
    
    draw_calibrated_ruler(ax, 5.0, 50.0)

# =============================================================================
# PAGE 2: TOP STRIPS P1 & P2 (P1, P2A, P2B) WITH DIMENSIONS
# =============================================================================
def draw_page_2(ax):
    # -------------------------------------------------------------
    # PIEZA 1 (Top-Left)
    # -------------------------------------------------------------
    p1_ox = 30.0
    p1_oy = 145.0
    p1_w = SPLIT_X1 * BROTHER_COMP # 158.0 mm
    p1_h = STRIP_H * BROTHER_COMP  # 29.5 mm
    
    rect_p1 = patches.Rectangle((p1_ox, p1_oy), p1_w, p1_h, linewidth=1.5, edgecolor='#0F172A', facecolor='#F8FAFC', zorder=1)
    ax.add_patch(rect_p1)
    
    # 1. Ventana izquierda: LOGO DEL JUEGO
    # Horizontal: de 5.0 mm a 68.0 mm (ancho = 63.0 mm)
    # Vertical: de 2.0 mm a 24.0 mm desde el borde superior (alto = 22.0 mm, margen inf = 5.5 mm)
    logo_x = p1_ox + 5.0 * BROTHER_COMP
    logo_w = (68.0 - 5.0) * BROTHER_COMP # 63.0 mm
    logo_top = p1_oy + (STRIP_H - 2.0) * BROTHER_COMP
    logo_h = (24.0 - 2.0) * BROTHER_COMP # 22.0 mm
    logo_y = logo_top - logo_h           # 5.5 mm desde abajo
    
    win_logo = patches.Rectangle((logo_x, logo_y), logo_w, logo_h,
                                 linewidth=1.0, linestyle='-.', edgecolor='#0284C7', facecolor='#F0F9FF', zorder=2)
    ax.add_patch(win_logo)
    ax.text(logo_x + logo_w/2.0, logo_y + logo_h/2.0, 
            "VENTANA LOGO DEL JUEGO (5 a 68 mm | Alto: 22 mm)", 
            fontsize=5.2, weight='bold', color='#0369A1', ha='center', va='center', zorder=3)

    # 2. Ventana derecha: TITULO / SUBMARINO
    # Horizontal: de 70.0 mm a 158.0 mm (ancho = 88.0 mm)
    # Vertical: de 4.0 mm a 22.0 mm desde el borde superior (alto = 18.0 mm, margen inf = 7.5 mm)
    # Entre ambas ventanas queda un nervio vertical de 2.0 mm (de 68 a 70 mm)
    win_x = p1_ox + 70.0 * BROTHER_COMP
    win_w = (158.0 - 70.0) * BROTHER_COMP # 88.0 mm
    win_top = p1_oy + (STRIP_H - 4.0) * BROTHER_COMP
    win_h = (22.0 - 4.0) * BROTHER_COMP   # 18.0 mm exactos
    win_y = win_top - win_h               # margen inferior = 7.5 mm
    
    win_p1 = patches.Rectangle((win_x, win_y), win_w, win_h,
                               linewidth=1.0, linestyle='-.', edgecolor='#059669', facecolor='#ECFDF5', zorder=2)
    ax.add_patch(win_p1)
    ax.text(win_x + win_w/2.0, win_y + win_h/2.0, 
            "VENTANA TITULO / SUBMARINO (70 a 158 mm | Alto: 18 mm)", 
            fontsize=5.2, weight='bold', color='#047857', ha='center', va='center', zorder=3)
    
    # Cotas P1
    draw_dim_h(ax, p1_ox, p1_ox + p1_w, p1_oy + p1_h + 3.0*BROTHER_COMP, "Ancho P1: 158.0 mm")
    draw_dim_v(ax, p1_ox - 5.0*BROTHER_COMP, p1_oy, p1_oy + p1_h, "29.5 mm")
    # Cotas Logo
    draw_dim_h(ax, p1_ox, logo_x, p1_oy - 6.0*BROTHER_COMP, "5.0", color='#0284C7')
    draw_dim_h(ax, logo_x, logo_x + logo_w, p1_oy - 6.0*BROTHER_COMP, "Logo: 63.0 mm", color='#0284C7')
    draw_dim_h(ax, logo_x + logo_w, win_x, p1_oy - 6.0*BROTHER_COMP, "Nervio: 2 mm", color='#334155')
    # Cotas Titulo
    draw_dim_h(ax, win_x, p1_ox + p1_w, p1_oy - 6.0*BROTHER_COMP, "Titulo: 88.0 mm (hasta 158)", color='#059669')
    # Cotas verticales
    draw_dim_v(ax, logo_x - 3.0*BROTHER_COMP, logo_top, p1_oy + p1_h, "2.0", color='#0284C7', offset=1.0)
    draw_dim_v(ax, logo_x - 3.0*BROTHER_COMP, logo_y, logo_top, "22.0", color='#0284C7', offset=1.0)
    draw_dim_v(ax, logo_x - 3.0*BROTHER_COMP, p1_oy, logo_y, "5.5", color='#0284C7', offset=1.0)

    ax.text(p1_ox + p1_w/2.0, p1_oy + p1_h + 8.0*BROTHER_COMP, "PIEZA 1 (TIRA SUPERIOR IZQUIERDA): 158.0 x 29.5 mm", fontsize=8.5, weight='bold', color='#0F172A', ha='center')

    # -------------------------------------------------------------
    # PIEZA 2A (Top-Right With Aircraft & 15x15 slots)
    # -------------------------------------------------------------
    p2_ox = 30.0
    p2_oy = 82.0
    p2_w = (CARD_W_MM - SPLIT_X1) * BROTHER_COMP # 122.0 mm
    p2_h = STRIP_H * BROTHER_COMP                # 29.5 mm
    
    rect_p2a = patches.Rectangle((p2_ox, p2_oy), p2_w, p2_h, linewidth=1.5, edgecolor='#0F172A', facecolor='#EFF6FF', zorder=1)
    ax.add_patch(rect_p2a)
    
    # Altura vertical común para huecos: 7.0 mm margen superior, 7.5 mm inferior -> centro a Y = 15.0 mm
    slot_y_center = p2_oy + (7.5 + SLOT_SIZE/2.0) * BROTHER_COMP # 15.0 mm desde abajo
    
    # 1. Ventana de texto "Aircraft" (a la izquierda de Avion):
    # Lado izquierdo a 95.0 mm del margen derecho -> local X = 122.0 - 95.0 = 27.0 mm
    aw_w = 13.0 * BROTHER_COMP # ancho 13.0 mm
    aw_h = 15.0 * BROTHER_COMP # alto 15.0 mm (mismo alto que las casillas)
    aw_x = p2_ox + (122.0 - 95.0) * BROTHER_COMP # 27.0 mm local
    aw_y = p2_oy + 7.5 * BROTHER_COMP            # alineado con las casillas (7.0 mm margen superior)
    rect_aw = patches.Rectangle((aw_x, aw_y), aw_w, aw_h, linewidth=1.0, linestyle='--', edgecolor='#1D4ED8', facecolor='#BFDBFE', zorder=3)
    ax.add_patch(rect_aw)
    ax.text(aw_x + aw_w/2.0, aw_y + aw_h/2.0, "Aircraft", fontsize=5.5, ha='center', va='center', weight='bold', color='#1E40AF', zorder=4)
    
    # 2. Hueco AVIÓN (15x15 mm):
    # Lado izquierdo a 72.5 mm del margen derecho -> local X = 122.0 - 72.5 = 49.5 mm
    ac_cx = p2_ox + (122.0 - 72.5 + SLOT_SIZE/2.0) * BROTHER_COMP # local X centro = 57.0 mm
    ac_cy = slot_y_center
    draw_slot_15x15(ax, ac_cx, ac_cy, label="AVION", bg='#DBEAFE', border='#1D4ED8')
    
    # 3. EVT 2 (15x15 mm):
    # Margen derecho = 6.0 mm del borde derecho -> local X borde derecho = 122.0 - 6.0 = 116.0 mm -> centro = 108.5 mm
    ev2_cx = p2_ox + (122.0 - 6.0 - SLOT_SIZE/2.0) * BROTHER_COMP # local X centro = 108.5 mm
    ev2_cy = slot_y_center
    draw_slot_15x15(ax, ev2_cx, ev2_cy, label="EVT 2", bg='#F1F5F9', border='#334155')

    # 4. EVT 1 (15x15 mm):
    # Provisionalmente a paso estándar de 16.5 mm respecto a EVT 2 (centro = 108.5 - 16.5 = 92.0 mm local)
    ev1_cx = p2_ox + (108.5 - 16.5) * BROTHER_COMP
    ev1_cy = slot_y_center
    draw_slot_15x15(ax, ev1_cx, ev1_cy, label="EVT 1", bg='#F1F5F9', border='#334155')

    # Cotas Pieza 2A
    draw_dim_h(ax, p2_ox, p2_ox + p2_w, p2_oy + p2_h + 3.0*BROTHER_COMP, "Ancho P2A: 122.0 mm")
    draw_dim_v(ax, p2_ox - 5.0*BROTHER_COMP, p2_oy, p2_oy + p2_h, "29.5 mm")
    
    # Cota desde margen derecho a Aircraft izq (95 mm) y Avion izq (72.5 mm)
    draw_dim_h(ax, aw_x, p2_ox + p2_w, p2_oy + p2_h + 8.0*BROTHER_COMP, "Aircraft izq: 95.0 mm al margen der", color='#1D4ED8')
    draw_dim_h(ax, ac_cx - (SLOT_SIZE/2.0)*BROTHER_COMP, p2_ox + p2_w, p2_oy - 6.0*BROTHER_COMP, "Avion izq: 72.5 mm al margen der", color='#1D4ED8')
    draw_dim_h(ax, ev2_cx + (SLOT_SIZE/2.0)*BROTHER_COMP, p2_ox + p2_w, p2_oy - 6.0*BROTHER_COMP, "6.0 mm", color='#334155')
    draw_dim_v(ax, p2_ox + p2_w + 3.0*BROTHER_COMP, p2_oy + p2_h - 7.0*BROTHER_COMP, p2_oy + p2_h, "7.0", color='#64748B', offset=1.0)
    draw_dim_v(ax, p2_ox + p2_w + 3.0*BROTHER_COMP, p2_oy, p2_oy + 7.5*BROTHER_COMP, "7.5", color='#64748B', offset=1.0)

    ax.text(p2_ox + p2_w/2.0, p2_oy + p2_h + 14.0*BROTHER_COMP, "PIEZA 2A (CON HIDROAVION / RECON): 122.0 x 29.5 mm | Huecos 15x15 mm", fontsize=8.2, weight='bold', color='#1D4ED8', ha='center')
    ax.text(p2_ox + p2_w + 12.0, p2_oy + p2_h/2.0, "Uso: Junsen I Mod, J.2, J.3,\nTipo A, A1, A2, B, B1, B2,\nB3, Sentoku I-400", fontsize=5.5, color='#475569', va='center')

    # -------------------------------------------------------------
    # PIEZA 2B (Top-Right Generic / Without Aircraft)
    # -------------------------------------------------------------
    p2b_ox = 30.0
    p2b_oy = 25.0
    rect_p2b = patches.Rectangle((p2b_ox, p2b_oy), p2_w, p2_h, linewidth=1.5, edgecolor='#0F172A', facecolor='#F8FAFC', zorder=1)
    ax.add_patch(rect_p2b)
    
    # Event slots (15x15 mm) in identical position
    draw_slot_15x15(ax, p2b_ox + (108.5 - 16.5)*BROTHER_COMP, p2b_oy + (7.5 + SLOT_SIZE/2.0)*BROTHER_COMP, label="EVT 1", bg='#F1F5F9', border='#334155')
    draw_slot_15x15(ax, p2b_ox + (122.0 - 6.0 - SLOT_SIZE/2.0)*BROTHER_COMP, p2b_oy + (7.5 + SLOT_SIZE/2.0)*BROTHER_COMP, label="EVT 2", bg='#F1F5F9', border='#334155')
    
    # Blind zone text
    ax.text(p2b_ox + 40.0*BROTHER_COMP, p2b_oy + p2_h/2.0, "ZONA CIEGA / CERRADA\n(Submarinos sin avión: KD3, Kaichu, Kirai, Tipo C)", 
            fontsize=5.5, color='#64748B', ha='center', va='center', weight='bold')

    # Cotas Pieza 2B
    draw_dim_h(ax, p2b_ox, p2b_ox + p2_w, p2b_oy + p2_h + 3.0*BROTHER_COMP, "Ancho P2B: 122.0 mm")
    draw_dim_h(ax, p2b_ox, p2b_ox + (244.3 - SPLIT_X1)*BROTHER_COMP, p2b_oy - 4.0*BROTHER_COMP, "Panel ciego: 86.3 mm", color='#64748B')
    
    ax.text(p2b_ox + p2_w/2.0, p2b_oy + p2_h + 8.0*BROTHER_COMP, "PIEZA 2B (ESTANDAR SIN AVION): 122.0 x 29.5 mm | Huecos 15x15 mm", fontsize=8.2, weight='bold', color='#0F172A', ha='center')

    draw_calibrated_ruler(ax, (PAGE_W_MM - 100.0*BROTHER_COMP)/2.0, 8.0)

# =============================================================================
# PAGE 3: RIGHT MODULES P3 & P4 WITH COTAS & 15x15 SLOTS
# =============================================================================
def draw_page_3(ax):
    # -------------------------------------------------------------
    # PIEZA 3A (Mid Right Layout A)
    # -------------------------------------------------------------
    p3_ox = 25.0
    p3_oy = 135.0
    p3_w = (CARD_W_MM - SPLIT_X2) * BROTHER_COMP # 86.9 mm
    p3_h = (SPLIT_Y2_A - STRIP_H) * BROTHER_COMP  # 48.0 mm
    
    rect_p3a = patches.Rectangle((p3_ox, p3_oy), p3_w, p3_h, linewidth=1.5, edgecolor='#0F172A', facecolor='#FEF3C7', zorder=1)
    ax.add_patch(rect_p3a)
    
    # Slots in P3 (15x15 mm)
    for sec, boxes in grid.items():
        for b in boxes:
            px, py, pw, ph = b['box']
            cx_full = (px + pw/2.0) * scale_x
            cy_from_top = (py + ph/2.0) * scale_y
            if cx_full >= SPLIT_X2 and STRIP_H <= cy_from_top < SPLIT_Y2_A:
                cx_c = p3_ox + (cx_full - SPLIT_X2) * BROTHER_COMP
                cy_c = p3_oy + p3_h - (cy_from_top - STRIP_H) * BROTHER_COMP
                draw_slot_15x15(ax, cx_c, cy_c, label=b['name'], bg='#FFFBEB', border='#D97706')
                
    draw_dim_h(ax, p3_ox, p3_ox + p3_w, p3_oy + p3_h + 3.0*BROTHER_COMP, "Ancho: 86.9 mm")
    draw_dim_v(ax, p3_ox - 5.0*BROTHER_COMP, p3_oy, p3_oy + p3_h, "Alto: 48.0 mm")
    ax.text(p3_ox + p3_w/2.0, p3_oy + p3_h + 7.5*BROTHER_COMP, "PIEZA 3A (MEDIO DERECHA - CRUCEROS): 86.9 x 48.0 mm | Huecos 15x15", fontsize=7.5, weight='bold', color='#B45309', ha='center')

    # -------------------------------------------------------------
    # PIEZA 4A (Bottom Right Straight)
    # -------------------------------------------------------------
    p4_ox = 25.0
    p4_oy = 15.0
    p4_w = (CARD_W_MM - SPLIT_X2) * BROTHER_COMP # 86.9 mm
    p4_h = (CARD_H_MM - SPLIT_Y2_A) * BROTHER_COMP # 137.5 mm
    
    rect_p4a = patches.Rectangle((p4_ox, p4_oy), p4_w, p4_h, linewidth=1.5, edgecolor='#0F172A', facecolor='#F3E8FF', zorder=1)
    ax.add_patch(rect_p4a)
    
    for sec, boxes in grid.items():
        for b in boxes:
            px, py, pw, ph = b['box']
            cx_full = (px + pw/2.0) * scale_x
            cy_from_top = (py + ph/2.0) * scale_y
            if cx_full >= SPLIT_X2 and cy_from_top >= SPLIT_Y2_A:
                cx_c = p4_ox + (cx_full - SPLIT_X2) * BROTHER_COMP
                cy_c = p4_oy + p4_h - (cy_from_top - SPLIT_Y2_A) * BROTHER_COMP
                draw_slot_15x15(ax, cx_c, cy_c, label=b['name'], bg='#FAF5FF', border='#7E22CE')

    draw_dim_h(ax, p4_ox, p4_ox + p4_w, p4_oy - 4.0*BROTHER_COMP, "Ancho P4A: 86.9 mm")
    draw_dim_v(ax, p4_ox - 5.0*BROTHER_COMP, p4_oy, p4_oy + p4_h, "Alto P4A: 137.5 mm")
    ax.text(p4_ox + p4_w/2.0, p4_oy + p4_h + 4.0*BROTHER_COMP, "PIEZA 4A (INFERIOR DERECHA RECTA): 86.9 x 137.5 mm", fontsize=7.5, weight='bold', color='#7E22CE', ha='center')

    # -------------------------------------------------------------
    # PIEZA 4B (Bottom Right With Stepped Jog Cutout)
    # -------------------------------------------------------------
    p4b_ox = 150.0
    p4b_oy = 25.0
    p4b_w = p4_w
    p4b_h = (CARD_H_MM - SPLIT_Y2_B) * BROTHER_COMP # 127.0 mm
    
    jog_y0 = p4b_oy + p4b_h - (JOG_Y_END - SPLIT_Y2_B) * BROTHER_COMP
    jog_y1 = p4b_oy + p4b_h - (JOG_Y_START - SPLIT_Y2_B) * BROTHER_COMP
    jog_w = (JOG_X - SPLIT_X2) * BROTHER_COMP
    
    pts_p4b = [
        (p4b_ox, p4b_oy),
        (p4b_ox + p4b_w, p4b_oy),
        (p4b_ox + p4b_w, p4b_oy + p4b_h),
        (p4b_ox, p4b_oy + p4b_h),
        (p4b_ox, jog_y1),
        (p4b_ox + jog_w, jog_y1),
        (p4b_ox + jog_w, jog_y0),
        (p4b_ox, jog_y0)
    ]
    poly_p4b = patches.Polygon(pts_p4b, closed=True, linewidth=1.5, edgecolor='#0F172A', facecolor='#FCE7F3', zorder=1)
    ax.add_patch(poly_p4b)
    
    ax.text(p4b_ox + jog_w/2.0, (jog_y0 + jog_y1)/2.0, "ESCALON\nJOG", fontsize=4.8, color='#BE185D', ha='center', va='center', weight='bold')
    
    for sec, boxes in grid.items():
        for b in boxes:
            px, py, pw, ph = b['box']
            cx_full = (px + pw/2.0) * scale_x
            cy_from_top = (py + ph/2.0) * scale_y
            if cx_full >= SPLIT_X2 and cy_from_top >= SPLIT_Y2_B:
                if JOG_Y_START <= cy_from_top <= JOG_Y_END and cx_full < JOG_X:
                    continue
                cx_c = p4b_ox + (cx_full - SPLIT_X2) * BROTHER_COMP
                cy_c = p4b_oy + p4b_h - (cy_from_top - SPLIT_Y2_B) * BROTHER_COMP
                draw_slot_15x15(ax, cx_c, cy_c, label=b['name'], bg='#FDF2F8', border='#BE185D')
                
    draw_dim_h(ax, p4b_ox, p4b_ox + p4b_w, p4b_oy - 4.0*BROTHER_COMP, "Ancho P4B: 86.9 mm")
    draw_dim_v(ax, p4b_ox + p4b_w + 3.0*BROTHER_COMP, p4b_oy, p4b_oy + p4b_h, "Alto P4B: 127.0 mm")
    draw_dim_h(ax, p4b_ox, p4b_ox + jog_w, jog_y1 + 2.5*BROTHER_COMP, "11.9 mm", color='#BE185D')

    ax.text(p4b_ox + p4b_w/2.0, p4b_oy + p4b_h + 4.0*BROTHER_COMP, "PIEZA 4B (CON CORTE JOG ESCALONADO): 86.9 x 127.0 mm", fontsize=7.2, weight='bold', color='#BE185D', ha='center')
    ax.text(p4b_ox + p4b_w/2.0, p4b_oy + p4b_h + 8.5*BROTHER_COMP, "Para Submarinos de Flota con Damage Tracks largos (KD3, Kaichu, Kirai)", fontsize=5.5, color='#475569', ha='center')

    draw_calibrated_ruler(ax, 160.0, 175.0)

# =============================================================================
# PART 2: 4 ASSEMBLED QUADRANTS (PAGES 4 TO 7) WITH 15x15 SLOTS
# =============================================================================
def draw_overlay_quadrant(ax, quad_idx):
    SPLIT_X_MM = CARD_W_MM / 2.0  # 140.0 mm
    SPLIT_Y_MM = CARD_H_MM / 2.0  # 107.5 mm
    OVERLAP = 15.0
    
    qw = SPLIT_X_MM * BROTHER_COMP   # ~147.4 mm
    qh = SPLIT_Y_MM * BROTHER_COMP   # ~113.2 mm
    ov = OVERLAP * BROTHER_COMP      # ~15.8 mm
    
    ox = 65.0
    oy = 45.0
    
    titles = {
        1: ("CUADRANTE 1: ARRIBA - IZQUIERDA", "Contiene: Título, Silueta Naval, Base, Misión, Patrullas"),
        2: ("CUADRANTE 2: ARRIBA - DERECHA", "Contiene: Aviación, Eventos, Tubos de Torpedos"),
        3: ("CUADRANTE 3: ABAJO - IZQUIERDA", "Contiene: Damage Tracks, Inundación, Casco, SUNK"),
        4: ("CUADRANTE 4: ABAJO - DERECHA", "Contiene: Cañones, Sistemas, Munición, Suministros")
    }
    
    outer_rect = patches.Rectangle((ox, oy), qw, qh, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#FAFAFA', zorder=1)
    ax.add_patch(outer_rect)
    
    # Overlap tabs
    if quad_idx == 1:
        ov_r = patches.Rectangle((ox + qw, oy), ov, qh, linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_r)
        ov_b = patches.Rectangle((ox, oy - ov), qw + ov, ov, linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_b)
    elif quad_idx == 2:
        ov_b = patches.Rectangle((ox, oy - ov), qw, ov, linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_b)
    elif quad_idx == 3:
        ov_r = patches.Rectangle((ox + qw, oy), ov, qh, linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_r)

    # Ruler
    draw_calibrated_ruler(ax, (PAGE_W_MM - 100.0*BROTHER_COMP)/2.0, 14.0)

    x_min_full = 0.0 if quad_idx in [1, 3] else SPLIT_X_MM
    x_max_full = SPLIT_X_MM if quad_idx in [1, 3] else CARD_W_MM
    y_min_full = SPLIT_Y_MM if quad_idx in [1, 2] else 0.0
    y_max_full = CARD_H_MM if quad_idx in [1, 2] else SPLIT_Y_MM
    
    for sec in grid:
        for b in grid[sec]:
            px, py, pw, ph = b['box']
            cx_full = (px + pw/2.0) * scale_x
            cy_full = (408.0 - (py + ph/2.0)) * scale_y
            
            if x_min_full - 5.0 <= cx_full <= x_max_full + 5.0 and y_min_full - 5.0 <= cy_full <= y_max_full + 5.0:
                cx_quad = ox + (cx_full - x_min_full) * BROTHER_COMP
                cy_quad = oy + (cy_full - y_min_full) * BROTHER_COMP
                draw_slot_15x15(ax, cx_quad, cy_quad, label=b['name'][:5])

    main_title, sub_title = titles[quad_idx]
    ax.text(PAGE_W_MM/2.0, oy + qh + 23.0, f"SENSUIKAN: PLANTA COMPLETA ENSAMBLADA - {main_title}", fontsize=10.0, weight='bold', color='#0F172A', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 17.0, sub_title, fontsize=6.2, color='#2563EB', weight='bold', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 11.0, f"Medida Real Carta: {CARD_W_MM:.1f} x {CARD_H_MM:.1f} mm | Huecos Counters 15x15 mm", fontsize=5.8, color='#475569', ha='center')

# =============================================================================
# MAIN EXPORT SCRIPT
# =============================================================================
def generate_all():
    pdf_filename = "sensuikan_piezas_superiores_1a1_laser.pdf"
    output_pdf_path = os.path.join("pdf", pdf_filename)
    os.makedirs("pdf", exist_ok=True)
    os.makedirs("images/previews", exist_ok=True)
    
    print(f"Generating full 1:1 real-scale PDF with 15x15 slots & Cotas: {output_pdf_path}...")
    
    fig_w_in = PAGE_W_MM / 25.4
    fig_h_in = PAGE_H_MM / 25.4
    
    with PdfPages(output_pdf_path) as pdf:
        # PAGE 1: Piece 5
        print("  Generating Page 1: Piece 5 (Main Left Module with Cotas)...")
        fig = plt.figure(figsize=(fig_w_in, fig_h_in))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.axis('off')
        draw_page_1(ax)
        pdf.savefig(fig, dpi=300)
        plt.close()
        
        # PAGE 2: Pieces 1 & 2
        print("  Generating Page 2: Pieces 1 & 2 (Top Strips with Cotas)...")
        fig = plt.figure(figsize=(fig_w_in, fig_h_in))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.axis('off')
        draw_page_2(ax)
        pdf.savefig(fig, dpi=300)
        plt.close()
        
        # PAGE 3: Pieces 3 & 4
        print("  Generating Page 3: Pieces 3 & 4 (Right Modules with Cotas)...")
        fig = plt.figure(figsize=(fig_w_in, fig_h_in))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.axis('off')
        draw_page_3(ax)
        pdf.savefig(fig, dpi=300)
        plt.close()

        # PAGES 4 TO 7: Assembled 4 Quadrants
        for q in [1, 2, 3, 4]:
            print(f"  Generating Page {q+3}: Quadrant {q} with 15x15 slots...")
            fig = plt.figure(figsize=(fig_w_in, fig_h_in))
            ax = fig.add_axes([0, 0, 1, 1])
            ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.axis('off')
            draw_overlay_quadrant(ax, q)
            pdf.savefig(fig, dpi=300)
            plt.close()

    print(f"Successfully generated: {output_pdf_path}")
    
    # Copy to root and artifacts directory
    dest_dir = r"C:\Users\Richard\.gemini\antigravity\brain\1857cc84-1069-4de5-aff1-963f64c0c673"
    dest_pdf = os.path.join(dest_dir, pdf_filename)
    shutil.copy2(output_pdf_path, dest_pdf)
    
    try:
        shutil.copy2(output_pdf_path, pdf_filename)
    except Exception:
        pass
    print(f"Copied to brain artifacts: {dest_pdf}")
    
    # Render preview images
    doc = fitz.open(output_pdf_path)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        png_name = f"preview_pieza_page_{i+1}.png"
        preview_dest = os.path.join("images", "previews", png_name)
        pix.save(preview_dest)
        shutil.copy2(preview_dest, os.path.join(dest_dir, png_name))
        print(f"Saved preview: {preview_dest}")

if __name__ == "__main__":
    generate_all()
