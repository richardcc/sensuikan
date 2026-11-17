import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import os
import shutil
import fitz

# Standard A4 Landscape: 297 mm x 210 mm
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0

# Base Tray Dimensions
CARD_W_MM = 280.0
CARD_H_MM = 170.0
CLEARANCE_MM = 0.6  # 0.3mm per side
INNER_W_MM = CARD_W_MM + CLEARANCE_MM  # 280.6 mm
INNER_H_MM = CARD_H_MM + CLEARANCE_MM  # 170.6 mm

WALL_W_MM = 3.0     # Outer rim
TOTAL_W_MM = INNER_W_MM + 2 * WALL_W_MM  # 286.6 mm
TOTAL_H_MM = INNER_H_MM + 2 * WALL_W_MM  # 176.6 mm

# Center splits
SPLIT_X_MM = TOTAL_W_MM / 2.0  # 143.3 mm
SPLIT_Y_MM = TOTAL_H_MM / 2.0  # 88.3 mm

OVERLAP = 15.0 # 15 mm overlap for easy taping

def draw_reg_mark(ax, cx, cy, label=""):
    r = 3.5
    circle = patches.Circle((cx, cy), r, edgecolor='#DC2626', facecolor='none', linewidth=0.8, zorder=12)
    ax.add_patch(circle)
    ax.plot([cx - 5.0, cx + 5.0], [cy, cy], color='#DC2626', linewidth=0.8, zorder=12)
    ax.plot([cx, cx], [cy - 5.0, cy + 5.0], color='#DC2626', linewidth=0.8, zorder=12)
    if label:
        ax.text(cx, cy + 5.0, label, fontsize=5.5, ha='center', va='bottom', color='#DC2626', weight='bold', zorder=12)

def draw_calibrated_ruler(ax, x0, y0, comp_factor=1.0):
    ruler_len = 100.0 * comp_factor
    ax.plot([x0, x0 + ruler_len], [y0, y0], color='black', linewidth=1.2, zorder=10)
    for i in range(11):
        x = x0 + i * 10.0 * comp_factor
        h_tick = 5.0 if i % 5 == 0 else 2.5
        ax.plot([x, x], [y0, y0 + h_tick], color='black', linewidth=0.9 if i%5==0 else 0.5, zorder=10)
        if i in [0, 5, 10]:
            ax.text(x, y0 - 3.8, f"{i*10}mm", fontsize=5.5, ha='center', va='top', weight='bold')
    ax.text(x0 + ruler_len/2.0, y0 + 7.5, "REGLA 100 mm (10 cm): Mide con una regla física. Debe medir exactamente 10.0 cm", 
            fontsize=6.0, weight='bold', color='#DC2626', ha='center', va='bottom')

# =========================================================================
# DRAW QUADRANT (Q1 to Q4)
# =========================================================================
def draw_quadrant(ax, quad_idx, comp_factor=1.0):
    """
    quad_idx:
      1: Top-Left     (X: 0 to 143.3,     Y: 88.3 to 176.6)
      2: Top-Right    (X: 143.3 to 286.6, Y: 88.3 to 176.6)
      3: Bottom-Left  (X: 0 to 143.3,     Y: 0 to 88.3)
      4: Bottom-Right (X: 143.3 to 286.6, Y: 0 to 88.3)
    """
    # Center quadrant on A4 landscape (297 x 210 mm)
    # Base size of quadrant = 143.3 mm x 88.3 mm
    # Margin X is roughly (297 - 160) / 2 = 68 mm!
    # Margin Y is roughly (210 - 105) / 2 = 52 mm!
    ox = 65.0
    oy = 55.0
    
    qw = SPLIT_X_MM * comp_factor   # ~143.3 mm
    qh = SPLIT_Y_MM * comp_factor   # ~88.3 mm
    ov = OVERLAP * comp_factor      # ~15.0 mm
    wall = WALL_W_MM * comp_factor  # ~3.0 mm
    
    titles = {
        1: ("CUADRANTE 1 DE 4: ARRIBA - IZQUIERDA (TOP-LEFT)", "Pega Solapes: Derecho hacia Q2, Inferior hacia Q3"),
        2: ("CUADRANTE 2 DE 4: ARRIBA - DERECHA (TOP-RIGHT)", "Pega Solape Inferior hacia Q4. Monta sobre solape de Q1"),
        3: ("CUADRANTE 3 DE 4: ABAJO - IZQUIERDA (BOTTOM-LEFT)", "Pega Solape Derecho hacia Q4. Monta sobre solape de Q1"),
        4: ("CUADRANTE 4 DE 4: ABAJO - DERECHA (BOTTOM-RIGHT)", "Monta sobre solapes de Q2 y Q3. Sin solapes salientes")
    }
    
    # Coordinates of outer box relative to quadrant origin (ox, oy):
    # In each quadrant, the outer corner of the tray is at an outer edge.
    outer_rect = patches.Rectangle((ox, oy), qw, qh, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#F8FAFC', zorder=1)
    ax.add_patch(outer_rect)
    
    # Draw Inner Card Pocket (Alojamiento de la carta de carton)
    # Inner pocket is inset by 'wall' from outer edges:
    # Q1: outer edges are Left and Top
    # Q2: outer edges are Right and Top
    # Q3: outer edges are Left and Bottom
    # Q4: outer edges are Right and Bottom
    if quad_idx == 1:
        px = ox + wall
        py = oy
        pw = qw - wall
        ph = qh - wall
    elif quad_idx == 2:
        px = ox
        py = oy
        pw = qw - wall
        ph = qh - wall
    elif quad_idx == 3:
        px = ox + wall
        py = oy + wall
        pw = qw - wall
        ph = qh - wall
    elif quad_idx == 4:
        px = ox
        py = oy + wall
        pw = qw - wall
        ph = qh - wall
        
    pocket_rect = patches.Rectangle((px, py), pw, ph, 
                                    linewidth=1.4, linestyle='--', edgecolor='#2563EB', facecolor='#FFFFFF', zorder=2)
    ax.add_patch(pocket_rect)
    
    # Shaded floor lip (apoyo de 12 mm del cartón)
    lip = 12.0 * comp_factor
    lip_x = px + (lip if quad_idx in [1, 3] else 0)
    lip_y = py + (lip if quad_idx in [3, 4] else 0)
    lip_w = pw - (lip if quad_idx in [1, 3] else 0) - (lip if quad_idx in [2, 4] else 0)
    lip_h = ph - (lip if quad_idx in [1, 2] else 0) - (lip if quad_idx in [3, 4] else 0)
    
    hollow = patches.Rectangle((lip_x, lip_y), lip_w, lip_h, 
                               linewidth=0.8, linestyle=':', edgecolor='#94A3B8', facecolor='#E2E8F0', alpha=0.5, zorder=2)
    ax.add_patch(hollow)
    ax.text(ox + qw/2.0, oy + qh/2.0, "APOYO INTERIOR / FONDO", fontsize=5.8, ha='center', va='center', color='#64748B', weight='bold')

    # OVERLAP TABS:
    # Q1 has overlap to the Right (toward Q2) and to the Bottom (toward Q3)
    if quad_idx == 1:
        # Right overlap
        ov_r = patches.Rectangle((ox + qw, oy), ov, qh, 
                                 linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_r)
        ax.text(ox + qw + ov/2.0, oy + qh/2.0, "SOLAPE DERECHO (Hacia Q2)", fontsize=5.0, ha='center', va='center', rotation=90, color='#991B1B', weight='bold')
        # Bottom overlap
        ov_b = patches.Rectangle((ox, oy - ov), qw + ov, ov, 
                                 linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_b)
        ax.text(ox + qw/2.0, oy - ov/2.0, "SOLAPE INFERIOR (Hacia Q3)", fontsize=5.0, ha='center', va='center', color='#991B1B', weight='bold')
        
    elif quad_idx == 2:
        # Bottom overlap
        ov_b = patches.Rectangle((ox, oy - ov), qw, ov, 
                                 linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_b)
        ax.text(ox + qw/2.0, oy - ov/2.0, "SOLAPE INFERIOR (Hacia Q4)", fontsize=5.0, ha='center', va='center', color='#991B1B', weight='bold')
        
    elif quad_idx == 3:
        # Right overlap
        ov_r = patches.Rectangle((ox + qw, oy), ov, qh, 
                                 linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
        ax.add_patch(ov_r)
        ax.text(ox + qw + ov/2.0, oy + qh/2.0, "SOLAPE DERECHO (Hacia Q4)", fontsize=5.0, ha='center', va='center', rotation=90, color='#991B1B', weight='bold')

    # SEAM CUT LINES (Líneas de unión en X=143.3 e Y=88.3 mm)
    if quad_idx in [1, 3]:
        # Right seam
        ax.plot([ox + qw, ox + qw], [oy, oy + qh], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    if quad_idx in [2, 4]:
        # Left seam
        ax.plot([ox, ox], [oy, oy + qh], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    if quad_idx in [1, 2]:
        # Bottom seam
        ax.plot([ox, ox + qw], [oy, oy], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    if quad_idx in [3, 4]:
        # Top seam
        ax.plot([ox, ox + qw], [oy + qh, oy + qh], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)

    # REGISTRATION CROSSHAIRS
    # Central intersection (where all 4 meet)
    cx_center = ox + (qw if quad_idx in [1, 3] else 0)
    cy_center = oy + (0 if quad_idx in [1, 2] else qh)
    draw_reg_mark(ax, cx_center, cy_center, "CENTRO")
    
    # Outer edge crosshairs
    if quad_idx in [1, 2]:
        # Top outer seam
        cx_top = ox + (qw if quad_idx == 1 else 0)
        cy_top = oy + qh
        draw_reg_mark(ax, cx_top, cy_top, "REG T")
    if quad_idx in [3, 4]:
        # Bottom outer seam
        cx_bot = ox + (qw if quad_idx == 3 else 0)
        cy_bot = oy
        draw_reg_mark(ax, cx_bot, cy_bot, "REG B")
    if quad_idx in [1, 3]:
        # Left outer seam
        cx_l = ox
        cy_l = oy + (0 if quad_idx == 1 else qh)
        draw_reg_mark(ax, cx_l, cy_l, "REG L")
    if quad_idx in [2, 4]:
        # Right outer seam
        cx_r = ox + qw
        cy_r = oy + (0 if quad_idx == 2 else qh)
        draw_reg_mark(ax, cx_r, cy_r, "REG R")

    # Dimensions annotations
    ax.text(ox + qw/2.0, oy + qh + 4.0, f"Ancho Cuadrante: {SPLIT_X_MM:.1f} mm", fontsize=5.8, color='#1E293B', weight='bold', ha='center')
    ax.text(ox - 5.0, oy + qh/2.0, f"Alto:\n{SPLIT_Y_MM:.1f} mm", fontsize=5.8, color='#1E293B', weight='bold', rotation=90, va='center', ha='center')

    # Header & Calibration Ruler
    main_title, sub_title = titles[quad_idx]
    ax.text(PAGE_W_MM/2.0, oy + qh + 24.0, f"SENSUIKAN: BANDEJA BASE INFERIOR - {main_title}", fontsize=10.5, weight='bold', color='#0F172A', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 18.0, sub_title, fontsize=6.5, color='#2563EB', weight='bold', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 12.0, f"Medida Total Ensamblada: {TOTAL_W_MM:.1f} x {TOTAL_H_MM:.1f} mm | Hueco Carta: {INNER_W_MM:.1f} x {INNER_H_MM:.1f} mm", fontsize=6.0, color='#475569', ha='center')
    
    draw_calibrated_ruler(ax, (PAGE_W_MM - 100.0*comp_factor)/2.0, 16.0, comp_factor)

# =========================================================================
# GENERATE PDF (EXACT 1:1 SCALE WITH COMP_FACTOR = 100/95 FOR BROTHER)
# =========================================================================
fig_w_in = PAGE_W_MM / 25.4
fig_h_in = PAGE_H_MM / 25.4

# Brother compensation factor: 100 / 95 = 1.05263158
BROTHER_COMP = 100.0 / 95.0

pdf_file = "sensuikan_base_inferior_4_hojas_laser.pdf"
pdf_artifact = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_base_inferior_4_hojas_laser.pdf"

with PdfPages(pdf_file) as pdf:
    for q in [1, 2, 3, 4]:
        fig = plt.figure(figsize=(fig_w_in, fig_h_in))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.set_aspect('equal'); ax.axis('off')
        # We apply the Brother 100/95 compensation directly so user can print with "Tamano Real / 100%"
        draw_quadrant(ax, q, comp_factor=BROTHER_COMP)
        pdf.savefig(fig)
        png_name = f"base_4_hojas_q{q}.png"
        fig.savefig(png_name, dpi=300)
        fig.savefig(f"C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/{png_name}", dpi=300)
        plt.close(fig)

shutil.copyfile(pdf_file, pdf_artifact)

# Verify with PyMuPDF
doc = fitz.open(pdf_file)
print(f"Verified {pdf_file}: Total Pages = {len(doc)}")
for i, page in enumerate(doc):
    r = page.rect
    w = r.width * 25.4 / 72.0
    h = r.height * 25.4 / 72.0
    print(f"  Page {i+1} (Q{i+1}): {w:.2f} x {h:.2f} mm")
