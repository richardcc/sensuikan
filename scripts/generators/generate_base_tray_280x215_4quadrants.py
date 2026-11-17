import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import os
import shutil
import fitz

# Standard A4 Landscape: 297 mm x 210 mm
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0

# Scale compensation factor for Brother laser printer: 100.0 / 95.0
BROTHER_COMP = 100.0 / 95.0 # ~1.05263

# REAL Compass Games Card Dimensions: 280 x 215 mm (US Letter 11" x 8.5")
CARD_W_MM = 280.0
CARD_H_MM = 215.0
CLEARANCE_MM = 0.6  # 0.3mm per side
INNER_W_MM = CARD_W_MM + CLEARANCE_MM  # 280.6 mm
INNER_H_MM = CARD_H_MM + CLEARANCE_MM  # 215.6 mm

WALL_W_MM = 3.0     # Outer rim
TOTAL_W_MM = INNER_W_MM + 2 * WALL_W_MM  # 286.6 mm
TOTAL_H_MM = INNER_H_MM + 2 * WALL_W_MM  # 221.6 mm

# Center splits for the 4 quadrants
SPLIT_X_MM = TOTAL_W_MM / 2.0  # 143.3 mm
SPLIT_Y_MM = TOTAL_H_MM / 2.0  # 110.8 mm

OVERLAP = 15.0 # 15 mm overlap for easy taping

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

# =========================================================================
# DRAW 280 x 215 QUADRANT (Q1 to Q4)
# =========================================================================
def draw_quadrant_280x215(ax, quad_idx):
    qw = SPLIT_X_MM * BROTHER_COMP   # ~150.8 mm
    qh = SPLIT_Y_MM * BROTHER_COMP   # ~116.6 mm
    ov = OVERLAP * BROTHER_COMP      # ~15.8 mm
    wall = WALL_W_MM * BROTHER_COMP  # ~3.15 mm
    
    # Center on A4 landscape (297 x 210 mm)
    # Available margins:
    # X: (297 - (qw + ov)) / 2 = (297 - 166.6) / 2 = 65.2 mm!
    # Y: (210 - (qh + ov)) / 2 = (210 - 132.4) / 2 = 38.8 mm!
    ox = 65.0
    oy = 45.0
    
    titles = {
        1: ("CUADRANTE 1 DE 4: ARRIBA - IZQUIERDA (TOP-LEFT)", "Pega Solapes: Derecho hacia Q2, Inferior hacia Q3"),
        2: ("CUADRANTE 2 DE 4: ARRIBA - DERECHA (TOP-RIGHT)", "Pega Solape Inferior hacia Q4. Monta sobre solape de Q1"),
        3: ("CUADRANTE 3 DE 4: ABAJO - IZQUIERDA (BOTTOM-LEFT)", "Pega Solape Derecho hacia Q4. Monta sobre solape de Q1"),
        4: ("CUADRANTE 4 DE 4: ABAJO - DERECHA (BOTTOM-RIGHT)", "Monta sobre solapes de Q2 y Q3. Sin solapes salientes")
    }
    
    # Outer box
    outer_rect = patches.Rectangle((ox, oy), qw, qh, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#F8FAFC', zorder=1)
    ax.add_patch(outer_rect)
    
    # Inner Card Pocket (Alojamiento para carta de 280 x 215 mm)
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
    
    # Floor ledge / Lip (apoyo de 12 mm)
    lip = 12.0 * BROTHER_COMP
    lip_x = px + (lip if quad_idx in [1, 3] else 0)
    lip_y = py + (lip if quad_idx in [3, 4] else 0)
    lip_w = pw - (lip if quad_idx in [1, 3] else 0) - (lip if quad_idx in [2, 4] else 0)
    lip_h = ph - (lip if quad_idx in [1, 2] else 0) - (lip if quad_idx in [3, 4] else 0)
    
    hollow = patches.Rectangle((lip_x, lip_y), lip_w, lip_h, 
                               linewidth=0.8, linestyle=':', edgecolor='#94A3B8', facecolor='#E2E8F0', alpha=0.5, zorder=2)
    ax.add_patch(hollow)
    ax.text(ox + qw/2.0, oy + qh/2.0, "FONDO ALIGERADO\n(Apoyo para carta de 280 x 215 mm)", 
            fontsize=5.8, ha='center', va='center', color='#64748B', weight='bold')

    # OVERLAP TABS
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

    # SEAM CUT LINES
    if quad_idx in [1, 3]:
        ax.plot([ox + qw, ox + qw], [oy, oy + qh], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    if quad_idx in [2, 4]:
        ax.plot([ox, ox], [oy, oy + qh], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    if quad_idx in [1, 2]:
        ax.plot([ox, ox + qw], [oy, oy], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    if quad_idx in [3, 4]:
        ax.plot([ox, ox + qw], [oy + qh, oy + qh], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)

    # REGISTRATION CROSSHAIRS
    cx_center = ox + (qw if quad_idx in [1, 3] else 0)
    cy_center = oy + (0 if quad_idx in [1, 2] else qh)
    draw_reg_mark(ax, cx_center, cy_center, "CENTRO")
    
    if quad_idx in [1, 2]:
        draw_reg_mark(ax, ox + (qw if quad_idx == 1 else 0), oy + qh, "REG T")
    if quad_idx in [3, 4]:
        draw_reg_mark(ax, ox + (qw if quad_idx == 3 else 0), oy, "REG B")
    if quad_idx in [1, 3]:
        draw_reg_mark(ax, ox, oy + (0 if quad_idx == 1 else qh), "REG L")
    if quad_idx in [2, 4]:
        draw_reg_mark(ax, ox + qw, oy + (0 if quad_idx == 2 else qh), "REG R")

    # Dimensions
    ax.text(ox + qw/2.0, oy + qh + 4.0, f"Ancho Cuadrante: {SPLIT_X_MM:.1f} mm", fontsize=5.8, color='#1E293B', weight='bold', ha='center')
    ax.text(ox - 5.0, oy + qh/2.0, f"Alto:\n{SPLIT_Y_MM:.1f} mm", fontsize=5.8, color='#1E293B', weight='bold', rotation=90, va='center', ha='center')

    # Header & Calibration Ruler
    main_title, sub_title = titles[quad_idx]
    ax.text(PAGE_W_MM/2.0, oy + qh + 23.0, f"SENSUIKAN: BANDEJA BASE (ALTO REAL 215 mm) - {main_title}", fontsize=10.0, weight='bold', color='#0F172A', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 17.0, sub_title, fontsize=6.2, color='#2563EB', weight='bold', ha='center')
    ax.text(PAGE_W_MM/2.0, oy + qh + 11.0, f"Medida Total Ensamblada: {TOTAL_W_MM:.1f} x {TOTAL_H_MM:.1f} mm | Hueco Carta: {INNER_W_MM:.1f} x {INNER_H_MM:.1f} mm", fontsize=5.8, color='#475569', ha='center')
    
    draw_calibrated_ruler(ax, (PAGE_W_MM - 100.0*BROTHER_COMP)/2.0, 14.0)

# =========================================================================
# GENERATE PDF & HIGH-RES PNGS
# =========================================================================
fig_w_in = PAGE_W_MM / 25.4
fig_h_in = PAGE_H_MM / 25.4

pdf_file = "sensuikan_base_inferior_280x215_4hojas.pdf"
pdf_artifact = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_base_inferior_280x215_4hojas.pdf"

with PdfPages(pdf_file) as pdf:
    for q in [1, 2, 3, 4]:
        fig = plt.figure(figsize=(fig_w_in, fig_h_in))
        ax = fig.add_axes([0, 0, 1, 1])
        ax.set_xlim(0, PAGE_W_MM); ax.set_ylim(0, PAGE_H_MM); ax.set_aspect('equal'); ax.axis('off')
        draw_quadrant_280x215(ax, q)
        pdf.savefig(fig)
        png_name = f"base_280x215_q{q}.png"
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
