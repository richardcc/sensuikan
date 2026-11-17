import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import shutil
import fitz

# Standard A4 LANDSCAPE (HORIZONTAL): 297 mm wide x 210 mm tall
PAGE_W_MM = 297.0
PAGE_H_MM = 210.0

# Scale compensation factor: 100.0 / 95.0 = 1.05263158
SCALE_COMP = 100.0 / 95.0 # ~1.0526

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
    r = 3.5 * SCALE_COMP
    circle = patches.Circle((cx, cy), r, edgecolor='#DC2626', facecolor='none', linewidth=0.8, zorder=12)
    ax.add_patch(circle)
    ax.plot([cx - 5.0*SCALE_COMP, cx + 5.0*SCALE_COMP], [cy, cy], color='#DC2626', linewidth=0.8, zorder=12)
    ax.plot([cx, cx], [cy - 5.0*SCALE_COMP, cy + 5.0*SCALE_COMP], color='#DC2626', linewidth=0.8, zorder=12)
    if label:
        ax.text(cx, cy + 5.0*SCALE_COMP, label, fontsize=5.5, ha='center', va='bottom', color='#DC2626', weight='bold', zorder=12)

def draw_calibrated_ruler(ax, x0, y0):
    ruler_len = 100.0 * SCALE_COMP # Will print as 100mm on user printer!
    ax.plot([x0, x0 + ruler_len], [y0, y0], color='black', linewidth=1.2, zorder=10)
    for i in range(11):
        x = x0 + i * 10.0 * SCALE_COMP
        h_tick = 5.0 if i % 5 == 0 else 2.5
        ax.plot([x, x], [y0, y0 + h_tick], color='black', linewidth=0.9 if i%5==0 else 0.5, zorder=10)
        if i in [0, 5, 10]:
            ax.text(x, y0 - 3.8, f"{i*10}mm", fontsize=5.5, ha='center', va='top', weight='bold')
    ax.text(x0 + ruler_len/2.0, y0 + 7.0, "REGLA COMPENSADA PARA TU IMPRESORA (DEBE MEDIR 10.0 cm EXACTOS)", 
            fontsize=6.0, weight='bold', color='#DC2626', ha='center', va='bottom')

# =========================================================================
# HOJA 1 COMPENSADA: BANDEJA BASE - MITAD IZQUIERDA
# =========================================================================
def draw_base_tray_left_comp(ax):
    ox = 50.0
    oy = (PAGE_H_MM - TOTAL_H_MM * SCALE_COMP) / 2.0 # ~12 mm
    
    half_w = SPLIT_X_MM * SCALE_COMP
    overlap_w = 20.0 * SCALE_COMP
    tot_h = TOTAL_H_MM * SCALE_COMP
    
    # 1. Outer rim box
    outer_rect = patches.Rectangle((ox, oy), half_w, tot_h, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#F1F5F9', zorder=1)
    ax.add_patch(outer_rect)
    
    # 2. Overlap strip
    overlap_rect = patches.Rectangle((ox + half_w, oy), overlap_w, tot_h, 
                                     linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
    ax.add_patch(overlap_rect)
    ax.text(ox + half_w + overlap_w/2.0, oy + tot_h/2.0, "ZONA DE SOLAPE\n(Pega la Mitad Derecha aqui)", 
            fontsize=6.0, ha='center', va='center', rotation=90, color='#991B1B', weight='bold', zorder=5)

    # 3. Inner card pocket
    pocket_left = ox + WALL_W_MM * SCALE_COMP
    pocket_bot = oy + WALL_W_MM * SCALE_COMP
    pocket_w = half_w - WALL_W_MM * SCALE_COMP
    pocket_h = INNER_H_MM * SCALE_COMP
    
    inner_rect = patches.Rectangle((pocket_left, pocket_bot), pocket_w, pocket_h, 
                                   linewidth=1.4, linestyle='--', edgecolor='#2563EB', facecolor='#FFFFFF', zorder=2)
    ax.add_patch(inner_rect)
    
    # Lip
    lip_w = 12.0 * SCALE_COMP
    ledge_rect = patches.Rectangle((pocket_left + lip_w, pocket_bot + lip_w), 
                                   pocket_w - lip_w, pocket_h - 2*lip_w, 
                                   linewidth=0.8, linestyle=':', edgecolor='#94A3B8', facecolor='#E2E8F0', alpha=0.5, zorder=2)
    ax.add_patch(ledge_rect)
    ax.text(pocket_left + pocket_w/2.0, pocket_bot + pocket_h/2.0, 
            "FONDO ALIGERADO\n(Abertura para empujar la carta con el dedo)", 
            fontsize=6.5, ha='center', va='center', color='#475569', weight='bold', zorder=4)

    # Cut line
    ax.plot([ox + half_w, ox + half_w], [oy, oy + tot_h], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    ax.text(ox + half_w - 3.0, oy + tot_h - 15.0, f"CORTE CENTRAL X = {SPLIT_X_MM:.1f} mm", 
            fontsize=6.0, color='#2563EB', weight='bold', rotation=90, va='top')

    draw_reg_mark(ax, ox + half_w, oy + tot_h - 12.0*SCALE_COMP, "REG 1")
    draw_reg_mark(ax, ox + half_w, oy + 12.0*SCALE_COMP, "REG 2")

    # Header & Ruler
    ax.text(ox, oy + tot_h + 6.0, "BANDEJA BASE (COMPENSADA PARA BROTHER) - MITAD IZQUIERDA", fontsize=9.5, weight='bold', color='#0F172A')
    draw_calibrated_ruler(ax, ox, 4.0)

# =========================================================================
# HOJA 2 COMPENSADA: BANDEJA BASE - MITAD DERECHA
# =========================================================================
def draw_base_tray_right_comp(ax):
    ox = 50.0
    oy = (PAGE_H_MM - TOTAL_H_MM * SCALE_COMP) / 2.0
    
    half_w = SPLIT_X_MM * SCALE_COMP
    overlap_w = 20.0 * SCALE_COMP
    tot_h = TOTAL_H_MM * SCALE_COMP
    
    # 1. Overlap tab
    overlap_tab = patches.Rectangle((ox, oy), overlap_w, tot_h, 
                                    linewidth=0.8, linestyle=':', edgecolor='#DC2626', facecolor='#FEE2E2', alpha=0.6, zorder=1)
    ax.add_patch(overlap_tab)
    ax.text(ox + overlap_w/2.0, oy + tot_h/2.0, "SOLAPE PARA PEGAR CON MITAD IZQ.", 
            fontsize=6.0, ha='center', va='center', rotation=90, color='#991B1B', weight='bold', zorder=5)

    # 2. Outer rim box
    x_split = ox + overlap_w
    outer_rect = patches.Rectangle((x_split, oy), half_w, tot_h, 
                                   linewidth=1.8, edgecolor='#1E293B', facecolor='#F1F5F9', zorder=1)
    ax.add_patch(outer_rect)
    
    # 3. Inner card pocket
    pocket_left = x_split
    pocket_bot = oy + WALL_W_MM * SCALE_COMP
    pocket_w = half_w - WALL_W_MM * SCALE_COMP
    pocket_h = INNER_H_MM * SCALE_COMP
    
    inner_rect = patches.Rectangle((pocket_left, pocket_bot), pocket_w, pocket_h, 
                                   linewidth=1.4, linestyle='--', edgecolor='#2563EB', facecolor='#FFFFFF', zorder=2)
    ax.add_patch(inner_rect)
    
    # Lip
    lip_w = 12.0 * SCALE_COMP
    ledge_rect = patches.Rectangle((pocket_left + lip_w, pocket_bot + lip_w), 
                                   pocket_w - lip_w, pocket_h - 2*lip_w, 
                                   linewidth=0.8, linestyle=':', edgecolor='#94A3B8', facecolor='#E2E8F0', alpha=0.5, zorder=2)
    ax.add_patch(ledge_rect)
    ax.text(pocket_left + pocket_w/2.0, pocket_bot + pocket_h/2.0, 
            "FONDO ALIGERADO\n(Abertura para empujar la carta con el dedo)", 
            fontsize=6.5, ha='center', va='center', color='#475569', weight='bold', zorder=4)

    # Cut line
    ax.plot([x_split, x_split], [oy, oy + tot_h], color='#2563EB', linestyle='-', linewidth=1.5, zorder=9)
    ax.text(x_split + 4.0, oy + tot_h - 15.0, f"LINEA DE UNION X = {SPLIT_X_MM:.1f} mm", 
            fontsize=6.0, color='#2563EB', weight='bold', rotation=90, va='top')

    draw_reg_mark(ax, x_split, oy + tot_h - 12.0*SCALE_COMP, "REG 1")
    draw_reg_mark(ax, x_split, oy + 12.0*SCALE_COMP, "REG 2")

    # Header & Ruler
    ax.text(x_split, oy + tot_h + 6.0, "BANDEJA BASE (COMPENSADA PARA BROTHER) - MITAD DERECHA", fontsize=9.5, weight='bold', color='#0F172A')
    draw_calibrated_ruler(ax, ox, 4.0)

fig_w_in = PAGE_W_MM / 25.4
fig_h_in = PAGE_H_MM / 25.4

pdf_file = "sensuikan_base_inferior_COMPENSADA_laser.pdf"
pdf_artifact = "C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_base_inferior_COMPENSADA_laser.pdf"

with PdfPages(pdf_file) as pdf:
    # Page 1
    fig1 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax1 = fig1.add_axes([0, 0, 1, 1])
    ax1.set_xlim(0, PAGE_W_MM); ax1.set_ylim(0, PAGE_H_MM); ax1.set_aspect('equal'); ax1.axis('off')
    draw_base_tray_left_comp(ax1)
    pdf.savefig(fig1)
    plt.close(fig1)

    # Page 2
    fig2 = plt.figure(figsize=(fig_w_in, fig_h_in))
    ax2 = fig2.add_axes([0, 0, 1, 1])
    ax2.set_xlim(0, PAGE_W_MM); ax2.set_ylim(0, PAGE_H_MM); ax2.set_aspect('equal'); ax2.axis('off')
    draw_base_tray_right_comp(ax2)
    pdf.savefig(fig2)
    plt.close(fig2)

shutil.copyfile(pdf_file, pdf_artifact)
print("SUCCESS: Generated pre-compensated PDF (sensuikan_base_inferior_COMPENSADA_laser.pdf)!")
