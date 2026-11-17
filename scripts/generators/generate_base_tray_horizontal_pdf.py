import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import os
import shutil
import fitz

# Standard A4 LANDSCAPE (HORIZONTAL): 297 mm wide x 210 mm tall
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0

# Base Tray Dimensions
CARD_W_MM = 280.0
CARD_H_MM = 170.0
CLEARANCE_MM = 0.6
INNER_W_MM = CARD_W_MM + CLEARANCE_MM  # 280.6 mm
INNER_H_MM = CARD_H_MM + CLEARANCE_MM  # 170.6 mm

WALL_W_MM = 3.0
TOTAL_W_MM = INNER_W_MM + 2 * WALL_W_MM  # 286.6 mm
TOTAL_H_MM = INNER_H_MM + 2 * WALL_W_MM  # 176.6 mm

SPLIT_X_MM = TOTAL_W_MM / 2.0  # 143.3 mm each half!

def draw_reg_mark(ax, cx, cy, label=""):
    r = 3.5
    circle = patches.Circle((cx, cy), r, edgecolor='#DC2626', facecolor='none', linewidth=0.8, zorder=12)
    ax.add_patch(circle)
    ax.plot([cx - 5.0, cx + 5.0], [cy, cy], color='#DC2626', linewidth=0.8, zorder=12)
    ax.plot([cx, cx], [cy - 5.0, cy + 5.0], color='#DC2626', linewidth=0.8, zorder=12)
    if label:
        ax.text(cx, cy + 5.0, label, fontsize=5.5, ha='center', va='bottom', color='#DC2626', weight='bold', zorder=12)

def draw_calibrated_ruler(ax, x0, y0):
    ax.plot([x0, x0 + 100.0], [y0, y0], color='black', linewidth=1.2, zorder=10)
    for i in range(11):
        x = x0 + i * 10.0
        h_tick = 5.0 if i % 5 == 0 else 2.5
        ax.plot([x, x], [y0, y0 + h_tick], color='black', linewidth=0.9 if i%5==0 else 0.5, zorder=10)
        if i in [0, 5, 10]:
            ax.text(x, y0 - 3.8, f"{i*10}mm", fontsize=5.5, ha='center', va='top', weight='bold')
    ax.text(x0 + 106.0, y0 + 1.5, "REGLA 100 mm (10 cm): Debe medir 10.0 cm exactos con una regla real", 
            fontsize=6.0, weight='bold', color='#DC2626', va='center')
    ax.text(x0 + 106.0, y0 - 3.0, "Imprimir en Acrobat: 'Tamano Real' (100%) y Orientacion: 'Horizontal'", 
            fontsize=5.2, color='#333333', va='center')

# =========================================================================
# HOJA 1 HORIZONTAL: BANDEJA BASE - MITAD IZQUIERDA
# =========================================================================
def draw_base_tray_left_horizontal(ax):
    # Page is 297mm wide x 210mm tall (Horizontal)
    # Drawing width is 143.3 mm + 20 mm overlap = 163.3 mm
    # ox = (297 - 163.3) / 2 = 66.85 mm -> use ox = 60.0 mm (leaving 60mm left, 73mm right)
    ox = 60.0
    # Drawing height is 176.6 mm
    # oy = (210 - 176.6) / 2 = 16.7 mm -> use oy = 20.0 mm
    oy = 20.0
    
    half_w = SPLIT_X_MM # 143.3 mm
    overlap_w = 20.0
    
    # 1. Outer rim box (Left half)
    outer_rect = patches.Rectangle((ox, oy), half_w, TOTAL_H_MM, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#F1F5F9', zorder=1)
    ax.add_patch(outer_rect)
    
    # 2. Overlap strip to the right (for taping/gluing)
    overlap_rect = patches.Rectangle((ox + half_w, oy), overlap_w, TOTAL_H_MM, 
                                     linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
    ax.add_patch(overlap_rect)
    ax.text(ox + half_w + overlap_w/2.0, oy + TOTAL_H_MM/2.0, "ZONA DE SOLAPE\n(Pega la Mitad Derecha aqui)", 
            fontsize=6.0, ha='center', va='center', rotation=90, color='#991B1B', weight='bold', zorder=5)

    # 3. Inner card pocket (Alojamiento interior de la carta de carton)
    pocket_left = ox + WALL_W_MM
    pocket_bot = oy + WALL_W_MM
    pocket_w = half_w - WALL_W_MM # 140.3 mm
    pocket_h = INNER_H_MM # 170.6 mm
    
    inner_rect = patches.Rectangle((pocket_left, pocket_bot), pocket_w, pocket_h, 
                                   linewidth=1.4, linestyle='--', edgecolor='#2563EB', facecolor='#FFFFFF', zorder=2)
    ax.add_patch(inner_rect)
    
    # Floor ledge / Lip (apoyo interior de 12 mm donde reposa el cartón)
    lip_w = 12.0
    ledge_rect = patches.Rectangle((pocket_left + lip_w, pocket_bot + lip_w), 
                                   pocket_w - lip_w, pocket_h - 2*lip_w, 
                                   linewidth=0.8, linestyle=':', edgecolor='#94A3B8', facecolor='#E2E8F0', alpha=0.5, zorder=2)
    ax.add_patch(ledge_rect)
    ax.text(pocket_left + pocket_w/2.0, pocket_bot + pocket_h/2.0, 
            "FONDO ALIGERADO\n(Abertura inferior para empujar\nla carta hacia arriba con el dedo)", 
            fontsize=6.5, ha='center', va='center', color='#475569', weight='bold', zorder=4)

    # Dimensions
    ax.annotate(f"Pared {WALL_W_MM:.1f}mm", 
                xy=(ox + WALL_W_MM/2.0, oy + TOTAL_H_MM - 6.0), 
                xytext=(ox - 22.0, oy + TOTAL_H_MM - 6.0),
                fontsize=5.5, weight='bold', color='#1E293B',
                arrowprops=dict(arrowstyle="->", color='#1E293B', lw=0.8))
                
    ax.text(pocket_left + 15.0, pocket_bot + 12.0, f"Hueco Interior: Alto = {INNER_H_MM:.1f} mm (Carta {CARD_H_MM:.0f}mm + 0.6mm)", 
            fontsize=5.5, color='#2563EB', weight='bold')

    # Split cut line
    ax.plot([ox + half_w, ox + half_w], [oy, oy + TOTAL_H_MM], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    ax.text(ox + half_w - 3.0, oy + TOTAL_H_MM - 15.0, f"CORTE CENTRAL X = {SPLIT_X_MM:.1f} mm", 
            fontsize=6.0, color='#2563EB', weight='bold', rotation=90, va='top')

    # Registration Crosshairs (+)
    draw_reg_mark(ax, ox + half_w, oy + TOTAL_H_MM - 12.0, "REG 1")
    draw_reg_mark(ax, ox + half_w, oy + 12.0, "REG 2")

    # Header & Calibration Ruler
    ax.text(ox, oy + TOTAL_H_MM + 8.0, "BANDEJA BASE INFERIOR (CAPA DE ABAJO) - MITAD IZQUIERDA (1:1 HORIZONTAL)", fontsize=10, weight='bold', color='#0F172A')
    ax.text(ox, oy + TOTAL_H_MM + 3.0, f"Medidas Totales Exteriores: {TOTAL_W_MM:.1f} x {TOTAL_H_MM:.1f} mm | Hueco Carta: {INNER_W_MM:.1f} x {INNER_H_MM:.1f} mm", 
            fontsize=6.0, color='#334155')
    draw_calibrated_ruler(ax, ox, 6.0)

# =========================================================================
# HOJA 2 HORIZONTAL: BANDEJA BASE - MITAD DERECHA
# =========================================================================
def draw_base_tray_right_horizontal(ax):
    ox = 60.0
    oy = 20.0
    
    half_w = SPLIT_X_MM # 143.3 mm
    overlap_w = 20.0
    
    # 1. Overlap tab to the left (pegar sobre Hoja 1)
    overlap_tab = patches.Rectangle((ox, oy), overlap_w, TOTAL_H_MM, 
                                    linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
    ax.add_patch(overlap_tab)
    ax.text(ox + overlap_w/2.0, oy + TOTAL_H_MM/2.0, "SOLAPE PARA PEGAR CON MITAD IZQ.", 
            fontsize=6.0, ha='center', va='center', rotation=90, color='#991B1B', weight='bold', zorder=5)

    # 2. Outer rim box (Right half)
    x_split = ox + overlap_w
    outer_rect = patches.Rectangle((x_split, oy), half_w, TOTAL_H_MM, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#F1F5F9', zorder=1)
    ax.add_patch(outer_rect)
    
    # 3. Inner card pocket (Alojamiento interior)
    pocket_left = x_split
    pocket_bot = oy + WALL_W_MM
    pocket_w = half_w - WALL_W_MM # 140.3 mm
    pocket_h = INNER_H_MM # 170.6 mm
    
    inner_rect = patches.Rectangle((pocket_left, pocket_bot), pocket_w, pocket_h, 
                                   linewidth=1.4, linestyle='--', edgecolor='#2563EB', facecolor='#FFFFFF', zorder=2)
    ax.add_patch(inner_rect)
    
    # Floor ledge / Lip
    lip_w = 12.0
    ledge_rect = patches.Rectangle((pocket_left + lip_w, pocket_bot + lip_w), 
                                   pocket_w - lip_w, pocket_h - 2*lip_w, 
                                   linewidth=0.8, linestyle=':', edgecolor='#94A3B8', facecolor='#E2E8F0', alpha=0.5, zorder=2)
    ax.add_patch(ledge_rect)
    ax.text(pocket_left + pocket_w/2.0, pocket_bot + pocket_h/2.0, 
            "FONDO ALIGERADO\n(Abertura inferior para empujar\nla carta hacia arriba con el dedo)", 
            fontsize=6.5, ha='center', va='center', color='#475569', weight='bold', zorder=4)

    # Dimension callout
    ax.annotate("", xy=(x_split, oy - 4.0), xytext=(x_split + half_w, oy - 4.0),
                arrowprops=dict(arrowstyle="<->", color='#1E293B', lw=1.0))
    ax.text(x_split + half_w/2.0, oy - 7.5, f"Mitad Derecha: {half_w:.1f} mm (Cama P1S/X1C compatible)", 
            fontsize=5.5, color='#1E293B', weight='bold', ha='center')

    # Split cut line
    ax.plot([x_split, x_split], [oy, oy + TOTAL_H_MM], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    ax.text(x_split + 4.0, oy + TOTAL_H_MM - 15.0, f"LINEA DE UNION X = {SPLIT_X_MM:.1f} mm", 
            fontsize=6.0, color='#2563EB', weight='bold', rotation=90, va='top')

    # Registration Crosshairs (+)
    draw_reg_mark(ax, x_split, oy + TOTAL_H_MM - 12.0, "REG 1")
    draw_reg_mark(ax, x_split, oy + 12.0, "REG 2")

    # Header & Calibration Ruler
    ax.text(x_split, oy + TOTAL_H_MM + 8.0, "BANDEJA BASE INFERIOR (CAPA DE ABAJO) - MITAD DERECHA (1:1 HORIZONTAL)", fontsize=10, weight='bold', color='#0F172A')
    ax.text(x_split, oy + TOTAL_H_MM + 3.0, "Instrucciones: Recorta el borde izquierdo de esta hoja y pegalo alineando las cruces (+)", 
            fontsize=6.0, color='#334155')
    draw_calibrated_ruler(ax, ox, 6.0)

# =========================================================================
# GENERATE PDF & HIGH-RES PNGS IN PURE LANDSCAPE (297 x 210 mm)
# =========================================================================
fig_w_in = PAGE_W_MM / 25.4 # 297 / 25.4 = 11.693 in
fig_h_in = PAGE_H_MM / 25.4 # 210 / 25.4 = 8.268 in

pdf_file = "sensuikan_base_inferior_HORIZONTAL_1a1.pdf"
pdf_artifact = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_base_inferior_HORIZONTAL_1a1.pdf"

with PdfPages(pdf_file) as pdf:
    # Page 1: Left Base Tray Horizontal
    fig1 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax1 = fig1.add_axes([0, 0, 1, 1])  # ZERO MARGIN: 100% exact 1:1 scale
    ax1.set_xlim(0, PAGE_W_MM)
    ax1.set_ylim(0, PAGE_H_MM)
    ax1.set_aspect('equal')
    ax1.axis('off')
    draw_base_tray_left_horizontal(ax1)
    pdf.savefig(fig1)
    fig1.savefig("base_inferior_horizontal_hoja1.png", dpi=300)
    fig1.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/base_inferior_horizontal_hoja1.png", dpi=300)
    plt.close(fig1)

    # Page 2: Right Base Tray Horizontal
    fig2 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax2 = fig2.add_axes([0, 0, 1, 1])  # ZERO MARGIN: 100% exact 1:1 scale
    ax2.set_xlim(0, PAGE_W_MM)
    ax2.set_ylim(0, PAGE_H_MM)
    ax2.set_aspect('equal')
    ax2.axis('off')
    draw_base_tray_right_horizontal(ax2)
    pdf.savefig(fig2)
    fig2.savefig("base_inferior_horizontal_hoja2.png", dpi=300)
    fig2.savefig("C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/base_inferior_horizontal_hoja2.png", dpi=300)
    plt.close(fig2)

shutil.copyfile(pdf_file, pdf_artifact)

doc = fitz.open(pdf_file)
print(f"Verified {pdf_file}: Pages={len(doc)}")
for i, page in enumerate(doc):
    r = page.rect
    w_mm = r.width * 25.4 / 72.0
    h_mm = r.height * 25.4 / 72.0
    print(f"  Page {i+1}: {w_mm:.2f} x {h_mm:.2f} mm (HORIZONTAL)")
    for d in page.get_drawings():
        for item in d['items']:
            if item[0] == 'l':
                p1, p2 = item[1], item[2]
                dx = abs(p2.x - p1.x) * 25.4 / 72.0
                if 99.0 < dx < 101.0:
                    print(f"    Ruler on page {i+1} = {dx:.4f} mm")
