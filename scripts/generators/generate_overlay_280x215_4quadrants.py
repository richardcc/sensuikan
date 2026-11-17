import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import os
import shutil
import fitz
import json

PAGE_W_MM = 297.0
PAGE_H_MM = 210.0
BROTHER_COMP = 100.0 / 95.0

CARD_W_MM = 280.0
CARD_H_MM = 215.0
SPLIT_X_MM = CARD_W_MM / 2.0  # 140.0 mm
SPLIT_Y_MM = CARD_H_MM / 2.0  # 107.5 mm
OVERLAP = 15.0

SLOT_SIZE = 13.2
NOTCH_R = 1.6

scale_x = CARD_W_MM / 525.0 # ~0.5333
scale_y = CARD_H_MM / 408.0 # ~0.5270

def draw_reg_mark(ax, cx, cy, label=""):
    r = 3.5 * BROTHER_COMP
    circle = patches.Circle((cx, cy), r, edgecolor='#DC2626', facecolor='none', linewidth=0.8, zorder=12)
    ax.add_patch(circle)
    ax.plot([cx - 5.0*BROTHER_COMP, cx + 5.0*BROTHER_COMP], [cy, cy], color='#DC2626', linewidth=0.8, zorder=12)
    ax.plot([cx, cx], [cy - 5.0*BROTHER_COMP, cy + 5.0*BROTHER_COMP], color='#DC2626', linewidth=0.8, zorder=12)
    if label:
        ax.text(cx, cy + 5.0*BROTHER_COMP, label, fontsize=5.5, ha='center', va='bottom', color='#DC2626', weight='bold', zorder=12)

def draw_calibrated_ruler(ax, x0, y0):
    ruler_len = 100.0 * BROTHER_COMP
    ax.plot([x0, x0 + ruler_len], [y0, y0], color='black', linewidth=1.2, zorder=10)
    for i in range(11):
        x = x0 + i * 10.0 * BROTHER_COMP
        h_tick = 5.0 if i % 5 == 0 else 2.5
        ax.plot([x, x], [y0, y0 + h_tick], color='black', linewidth=0.9 if i%5==0 else 0.5, zorder=10)
        if i in [0, 5, 10]:
            ax.text(x, y0 - 3.8, f"{i*10}mm", fontsize=5.5, ha='center', va='top', weight='bold')
    ax.text(x0 + ruler_len/2.0, y0 + 7.5, "REGLA DE CALIBRACION 100 mm (10 cm): Debe medir 10.0 cm exactos", 
            fontsize=6.0, weight='bold', color='#DC2626', ha='center', va='bottom')

with open('grid_definition.json') as f:
    grid = json.load(f)

def draw_overlay_quadrant(ax, quad_idx, is_layout_b=False):
    qw = SPLIT_X_MM * BROTHER_COMP   # ~147.4 mm
    qh = SPLIT_Y_MM * BROTHER_COMP   # ~113.2 mm
    ov = OVERLAP * BROTHER_COMP      # ~15.8 mm
    
    ox = 65.0
    oy = 45.0
    
    titles = {
        1: ("CUADRANTE 1: ARRIBA - IZQUIERDA", "Contiene: Titulo/Logo, Silueta Naval, Base/Mision"),
        2: ("CUADRANTE 2: ARRIBA - DERECHA", "Contiene: Aviacion, Eventos, Tubos de Torpedos"),
        3: ("CUADRANTE 3: ABAJO - IZQUIERDA", "Contiene: Damage Tracks, Tripulacion"),
        4: ("CUADRANTE 4: ABAJO - DERECHA", "Contiene: Canones, Sistemas de a bordo")
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

    # Crosshairs
    cx_center = ox + (qw if quad_idx in [1, 3] else 0)
    cy_center = oy + (0 if quad_idx in [1, 2] else qh)
    draw_reg_mark(ax, cx_center, cy_center, "CENTRO")
    
    # Draw slots and cutouts for this quadrant:
    # Full card X range:
    x_min_full = 0.0 if quad_idx in [1, 3] else SPLIT_X_MM
    x_max_full = SPLIT_X_MM if quad_idx in [1, 3] else CARD_W_MM
    # Full card Y range (from bottom of card):
    y_min_full = SPLIT_Y_MM if quad_idx in [1, 2] else 0.0
    y_max_full = CARD_H_MM if quad_idx in [1, 2] else SPLIT_Y_MM
    
    # Draw all boxes from grid
    for sec in grid:
        for b in grid[sec]:
            px, py, pw, ph = b['box']
            cx_full = (px + pw/2.0) * scale_x
            cy_full = (408.0 - (py + ph/2.0)) * scale_y
            
            # Check if box is inside this quadrant
            if x_min_full - 5.0 <= cx_full <= x_max_full + 5.0 and y_min_full - 5.0 <= cy_full <= y_max_full + 5.0:
                # Map to quadrant display coordinates:
                cx_quad = ox + (cx_full - x_min_full) * BROTHER_COMP
                cy_quad = oy + (cy_full - y_min_full) * BROTHER_COMP
                
                half = (SLOT_SIZE / 2.0) * BROTHER_COMP
                rect = patches.Rectangle((cx_quad - half, cy_quad - half), SLOT_SIZE*BROTHER_COMP, SLOT_SIZE*BROTHER_COMP,
                                         linewidth=0.8, edgecolor='black', facecolor='#F0F4F8', zorder=3)
                ax.add_patch(rect)
                
                # Semicircular notches
                nr = NOTCH_R * BROTHER_COMP
                top_notch = patches.Wedge((cx_quad, cy_quad + half), nr, 0, 180, edgecolor='black', facecolor='#D0E0EE', linewidth=0.6, zorder=4)
                bot_notch = patches.Wedge((cx_quad, cy_quad - half), nr, 180, 360, edgecolor='black', facecolor='#D0E0EE', linewidth=0.6, zorder=4)
                ax.add_patch(top_notch)
                ax.add_patch(bot_notch)
                
                # Label
                lbl = b.get('name', '')[:4]
                ax.text(cx_quad, cy_quad, lbl, fontsize=3.8, ha='center', va='center', weight='bold', zorder=5)

    # Header & Ruler
    main_title, sub_title = titles[quad_idx]
    ax.text(PAGE_W_MM/2.0, oy + qh + 23.0, f"SENSUIKAN: CAPA SUPERIOR (ALTO REAL 215 mm) - {main_title}", fontsize=10.0, weight='bold', color='#0F172A', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 17.0, sub_title, fontsize=6.2, color='#2563EB', weight='bold', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 11.0, f"Medida Real de la Carta: {CARD_W_MM:.1f} x {CARD_H_MM:.1f} mm (11x8.5 pulgadas)", fontsize=5.8, color='#475569', ha='center')
    draw_calibrated_ruler(ax, (PAGE_W_MM - 100.0*BROTHER_COMP)/2.0, 14.0)

fig_w_in = PAGE_W_MM / 25.4
fig_h_in = PAGE_H_MM / 25.4

pdf_file_overlay = "sensuikan_planta_superior_280x215_4hojas.pdf"
pdf_artifact_overlay = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_planta_superior_280x215_4hojas.pdf"

with PdfPages(pdf_file_overlay) as pdf:
    for q in [1, 2, 3, 4]:
        fig = plt.figure(figsize=(fig_w_in, fig_h_in))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.set_aspect('equal'); ax.axis('off')
        draw_overlay_quadrant(ax, q)
        pdf.savefig(fig)
        plt.close(fig)

shutil.copyfile(pdf_file_overlay, pdf_artifact_overlay)
print("SUCCESS: Generated sensuikan_planta_superior_280x215_4hojas.pdf!")
