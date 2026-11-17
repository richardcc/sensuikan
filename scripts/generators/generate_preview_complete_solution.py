"""
Script to generate a comprehensive visual presentation of:
1. The new Cards & Dice Caddy + Lid
2. The Save-Game Grate Lid for the 3 game boards
3. The complete 3D box packing diagram in the Compass Games box (incorporating the user's 4 trays)
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

PREV_DIR = os.path.abspath("images/previews")
os.makedirs(PREV_DIR, exist_ok=True)

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 14), dpi=150)
fig.patch.set_facecolor('#1e2124')

# Palette
DARK_BG = '#282b30'
ACCENT_GOLD = '#d4af37'
IJN_STEEL = '#424549'
CHIT_BG = '#36393e'
GRID_COLOR = '#7289da'
RED_ACCENT = '#e74c3c'
GREEN_ACCENT = '#2ecc71'

# -------------------------------------------------------------
# Panel 1: Cards & Dice Caddy Layout (145 x 115 mm)
# -------------------------------------------------------------
ax1.set_facecolor(DARK_BG)
ax1.set_xlim(-10, 155)
ax1.set_ylim(-10, 125)
ax1.set_aspect('equal')
ax1.set_title("1. CADDY MODULAR: CARTAS ENFUNDADAS + DADOS (145 x 115 x 22 mm)", color='white', fontsize=11, fontweight='bold', pad=12)

# Outer body
rect_outer = patches.FancyBboxPatch((0, 0), 145, 115, boxstyle="round,pad=0,rounding_size=3",
                                    facecolor='#18191c', edgecolor=ACCENT_GOLD, linewidth=2)
ax1.add_patch(rect_outer)

# Cavity 1: Sleeved Cards
rect_cards = patches.Rectangle((2.5, 2.5), 98, 72, facecolor='#2f3136', edgecolor='#5865f2', linewidth=1.5)
ax1.add_patch(rect_cards)
# Finger notch
thumb = patches.Circle((2.5 + 49, 2.5), 10, facecolor='#18191c', edgecolor='#5865f2', linewidth=1)
ax1.add_patch(thumb)
ax1.text(2.5 + 49, 2.5 + 36, "HUECO CARTAS ENFUNDADAS\n72 x 98 mm (Profundidad 20 mm)\n(Sequence of Play + Historical Cards)",
         color='white', fontsize=8, ha='center', va='center', fontweight='bold')

# Cavity 2: Dice Tray
rect_dice = patches.Rectangle((2.5, 76.5), 98, 36, facecolor='#2f3136', edgecolor=RED_ACCENT, linewidth=1.5)
ax1.add_patch(rect_dice)
# Mockup 5 dice
dice_names = ['1d10', 'd6', 'd6', 'd6', 'd6']
dice_cols = [RED_ACCENT, RED_ACCENT, RED_ACCENT, 'white', 'white']
dice_txt_cols = ['white', 'white', 'white', 'black', 'black']
for i in range(5):
    d_x = 8.0 + i * 18.0
    d_y = 83.5
    d_rect = patches.FancyBboxPatch((d_x, d_y), 15, 15, boxstyle="round,pad=0,rounding_size=2",
                                    facecolor=dice_cols[i], edgecolor='black', linewidth=1)
    ax1.add_patch(d_rect)
    ax1.text(d_x + 7.5, d_y + 7.5, dice_names[i], color=dice_txt_cols[i], fontsize=7, ha='center', va='center', fontweight='bold')
ax1.text(2.5 + 49, 106, "HUECO DADOS (36 x 98 mm - 1d10 + 4d6)", color='#aaa', fontsize=7, ha='center', va='center')

# Cavity 3: Aux / Mission Chits
rect_aux = patches.Rectangle((102.5, 2.5), 40, 110, facecolor='#2f3136', edgecolor=GREEN_ACCENT, linewidth=1.5)
ax1.add_patch(rect_aux)
ax1.text(102.5 + 20, 2.5 + 55, "HUECO AUXILIAR\n40 x 110 mm\n(Lápiz, peanas,\nmarcadores\nextra)",
         color='white', fontsize=8, ha='center', va='center', fontweight='bold')

# Rubber band notches
ax1.plot([145/2 - 7, 145/2 + 7], [0, 0], color=ACCENT_GOLD, linewidth=4)
ax1.plot([145/2 - 7, 145/2 + 7], [115, 115], color=ACCENT_GOLD, linewidth=4)
ax1.plot([0, 0], [115/2 - 7, 115/2 + 7], color=ACCENT_GOLD, linewidth=4)
ax1.plot([145, 145], [115/2 - 7, 115/2 + 7], color=ACCENT_GOLD, linewidth=4)
ax1.text(145/2, -6, "Ranura para goma elástica", color=ACCENT_GOLD, fontsize=8, ha='center')

# -------------------------------------------------------------
# Panel 2: Tapa Rejilla Save-Game (241.7 x 185.2 mm)
# -------------------------------------------------------------
ax2.set_facecolor(DARK_BG)
ax2.set_xlim(-10, 255)
ax2.set_ylim(-10, 195)
ax2.set_aspect('equal')
ax2.set_title("2. TAPA REJILLA SAVE-GAME TABLEROS (241.7 x 185.2 x 3.0 mm)", color='white', fontsize=11, fontweight='bold', pad=12)

# Outer lid frame
lid_outer = patches.Rectangle((0, 0), 241.7, 185.2, facecolor='#18191c', edgecolor=ACCENT_GOLD, linewidth=2)
ax2.add_patch(lid_outer)

# Diamond mesh representation
for x in np.arange(10, 235, 14):
    for y in np.arange(10, 175, 14):
        # Exclude central plaque area [78..163, 76..108]
        if not (75 <= x <= 165 and 72 <= y <= 112):
            dia = patches.RegularPolygon((x, y), numVertices=4, radius=4.5, orientation=0,
                                         facecolor='#2f3136', edgecolor='#555', linewidth=0.8)
            ax2.add_patch(dia)

# Central plaque
plaque = patches.FancyBboxPatch((78.3, 76.6), 85, 32, boxstyle="round,pad=0,rounding_size=3",
                                facecolor='#111', edgecolor=ACCENT_GOLD, linewidth=1.5)
ax2.add_patch(plaque)
ax2.text(120.8, 92.6, "SENSUÍKAN\nSAVE-GAME STATE", color=ACCENT_GOLD, fontsize=8, ha='center', va='center', fontweight='bold')

# Corner feet (resbalones) callouts
for cx, cy in [(5, 5), (236.7, 5), (5, 180.2), (236.7, 180.2)]:
    cf = patches.Rectangle((cx-4, cy-4), 8, 8, facecolor=RED_ACCENT, edgecolor='white', linewidth=1)
    ax2.add_patch(cf)
ax2.text(120.8, 178, "Pestañas en las 4 esquinas (resbalón) para encastrar y apilar", color='white', fontsize=7.5, ha='center')

# -------------------------------------------------------------
# Panel 3: Disposición en Caja - Capa Inferior (Save-Game Boards)
# -------------------------------------------------------------
ax3.set_facecolor(DARK_BG)
ax3.set_xlim(-15, 315)
ax3.set_ylim(-15, 250)
ax3.set_aspect('equal')
ax3.set_title("3. CAJA COMPASS (FONDO - CAPA 1): TABLEROS APILADOS", color='white', fontsize=11, fontweight='bold', pad=12)

# Box interior (298 x 234 mm)
box_rect1 = patches.Rectangle((0, 0), 298, 234, facecolor='#111315', edgecolor='#888', linewidth=2.5, linestyle='--')
ax3.add_patch(box_rect1)
ax3.text(149, 238, "CAJA COMPASS GAMES (Interior: 298 x 234 mm)", color='#aaa', fontsize=9, ha='center')

# Stack of 3 boards: Submarine Board + Attack Mat + Operations Map
board_stack = patches.Rectangle((5, 5), 241.7, 185.2, facecolor='#202225', edgecolor='#7289da', linewidth=2)
ax3.add_patch(board_stack)
ax3.text(5 + 120.8, 5 + 92.6, "3 TABLEROS APILADOS (241.7 x 185.2 mm)\n\n1. Tablero Submarino (Paper Doll)\n2. Attack Mat [H1]\n3. Operations Map (Patrol Zones)\n\n+ Tapa Rejilla Save-Game con gomas\n(Espesor total: ~22 mm)",
         color='white', fontsize=9, ha='center', va='center', fontweight='bold')

# Remaining side and top gaps
gap_right = patches.Rectangle((251.7, 5), 41.3, 185.2, facecolor='#1e2124', edgecolor='#444', linestyle=':')
ax3.add_patch(gap_right)
ax3.text(251.7 + 20.6, 97.6, "Canal lateral libre\n(41 x 185 mm)\nPara peanas, reglas\no bolsa de dados", color='#777', fontsize=7, ha='center', va='center', rotation=-90)

gap_top = patches.Rectangle((5, 195.2), 288, 33.8, facecolor='#1e2124', edgecolor='#444', linestyle=':')
ax3.add_patch(gap_top)
ax3.text(149, 212.1, "Canal superior libre (288 x 34 mm) - Para lápices y accesorios largos", color='#777', fontsize=7.5, ha='center', va='center')

# -------------------------------------------------------------
# Panel 4: Disposición en Caja - Capa Superior (Bandejas + Caddy)
# -------------------------------------------------------------
ax4.set_facecolor(DARK_BG)
ax4.set_xlim(-15, 315)
ax4.set_ylim(-15, 250)
ax4.set_aspect('equal')
ax4.set_title("4. CAJA COMPASS (SUPERIOR - CAPA 2): 4 BANDEJAS + CADDY", color='white', fontsize=11, fontweight='bold', pad=12)

# Box interior
box_rect2 = patches.Rectangle((0, 0), 298, 234, facecolor='#111315', edgecolor='#888', linewidth=2.5, linestyle='--')
ax4.add_patch(box_rect2)

# The 4 Counter Trays (215 x 145 mm) placed horizontally or vertically
# In photo 3: tray length ~215 mm is horizontal, width 145 mm is vertical
tray_stack = patches.Rectangle((5, 84), 215, 145, facecolor='#2f3136', edgecolor=ACCENT_GOLD, linewidth=2)
ax4.add_patch(tray_stack)
# Show 10 rows mockup
for r in range(1, 10):
    ax4.plot([5, 220], [84 + r*14.5, 84 + r*14.5], color='#444', linewidth=0.8)
# Yellow cross rubber band
ax4.plot([5 + 107.5, 5 + 107.5], [84, 229], color='#f1c40f', linewidth=3)
ax4.plot([5, 220], [84 + 72.5, 84 + 72.5], color='#f1c40f', linewidth=3)
ax4.text(5 + 107.5, 84 + 72.5, "4 BANDEJAS APILADAS CON GOMAS\n(Todas las fichas del juego ordenadas)",
         color='white', fontsize=8.5, ha='center', va='center', fontweight='bold',
         bbox=dict(boxstyle="round,pad=0.3", fc="#111", ec="#f1c40f", lw=1))

# Cards & Dice Caddy in lower bay (145 x 115 mm)
caddy_in_box = patches.Rectangle((5, 5), 145, 74, facecolor='#202225', edgecolor=GREEN_ACCENT, linewidth=2)
ax4.add_patch(caddy_in_box)
ax4.text(5 + 72.5, 5 + 37, "CADDY DADOS Y CARTAS\n(Cartas enfundadas + 5 Dados)",
         color='white', fontsize=8, ha='center', va='center', fontweight='bold')

# Remaining area next to caddy (for Rulebook, Manual, Mission log)
manual_area = patches.Rectangle((155, 5), 138, 74, facecolor='#18191c', edgecolor='#888', linestyle='--')
ax4.add_patch(manual_area)
ax4.text(155 + 69, 5 + 37, "LIBRETOS Y HOJAS DE PATRULLA\n(Rulebook + Mission Log)\no Peanas / Ayudas",
         color='#bbb', fontsize=7.5, ha='center', va='center')

plt.tight_layout()
out_png = os.path.join(PREV_DIR, "preview_solucion_completa_deluxificacion.jpg")
plt.savefig(out_png, dpi=150)
plt.close()
print(f"Generated preview: {out_png}")
