import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# Canvas Setup: 238.0 mm wide x 181.5 mm high
BOARD_W = 238.0
BOARD_H = 181.5
SLOT_SZ = 15.0

fig, ax = plt.subplots(figsize=(16, 12.2), dpi=200)
ax.set_xlim(0, BOARD_W)
ax.set_ylim(0, BOARD_H)
ax.set_aspect('equal')
ax.invert_yaxis() # Top-down coordinates

# Colors: Dark tactical Sensuikan aesthetic
BG_COLOR = '#07101e'
PANEL_COLOR = '#0d1b2d'
SLOT_COLOR = '#162b45'
SLOT_BORDER = '#38bdf8'
TITLE_COLOR = '#fde047'
SUBTITLE_COLOR = '#94a3b8'
BOW_COLOR = '#38bdf8'
STERN_COLOR = '#f43f5e'
RELOAD_COLOR = '#22c55e'
GUN_COLOR = '#eab308'
SYS_COLOR = '#a855f7'

fig.patch.set_facecolor(BG_COLOR)
ax.set_facecolor(BG_COLOR)

# Remove axes ticks
ax.set_xticks([])
ax.set_yticks([])
for spine in ax.spines.values():
    spine.set_color('#334155')
    spine.set_linewidth(2)

def draw_slot(x, y, label, sublabel="", color=SLOT_COLOR, border=SLOT_BORDER, alpha=0.9):
    rect = patches.FancyBboxPatch(
        (x - SLOT_SZ/2, y - SLOT_SZ/2), SLOT_SZ, SLOT_SZ,
        boxstyle="round,pad=0.2,rounding_size=1.2",
        linewidth=1.2, edgecolor=border, facecolor=color, alpha=alpha
    )
    ax.add_patch(rect)
    if label:
        ax.text(x, y - (1.6 if sublabel else 0), label, ha='center', va='center',
                color='#ffffff', fontsize=7.2, fontweight='bold')
    if sublabel:
        ax.text(x, y + 2.4, sublabel, ha='center', va='center',
                color='#cbd5e1', fontsize=5.4)

def draw_header(x, y, text, color=TITLE_COLOR, fontsize=8.5):
    ax.text(x, y, text, ha='left', va='center', color=color, fontsize=fontsize, fontweight='bold',
            bbox=dict(boxstyle="square,pad=0.2", facecolor='#0b1523', edgecolor='none', alpha=0.8))

# =========================================================================
# LEFT SIDE: Profile, Tracks, Crew, and RELOCATED SYSTEMS STATUS
# =========================================================================

# 1. Title Block
ax.add_patch(patches.Rectangle((4, 3), 158, 16, linewidth=1, edgecolor='#475569', facecolor=PANEL_COLOR, alpha=0.8))
ax.text(10, 11, "SENSUiKAN • UNIVERSAL SUBMARINE TACTICAL BOARD", color=TITLE_COLOR, fontsize=11, fontweight='bold')
ax.text(10, 16, "RETHOUGHT LAYOUT: RELOCATED SYSTEM STATUS TO FREE FULL TORPEDO/GUN HEADERS", color=SUBTITLE_COLOR, fontsize=6.8)

# 2. Submarine Profile Window
ax.add_patch(patches.Rectangle((18, 22), 144, 30, linewidth=1, edgecolor='#38bdf8', facecolor='#081424', linestyle='--'))
ax.text(90, 37, "[ VENTANA PERFIL SUBMARINO / SILHOUETTE WINDOW (144 x 30 mm) ]", color='#38bdf8', ha='center', va='center', fontsize=7.5)

# 3. Patrol Track (9 slots)
draw_header(18, 56.5, "PATROL TRACK (TRANSIT & ON-STATION) [REGLAS 4.3 & 7.0]")
track_xs = np.linspace(24.0, 156.0, 9)
track_labels = ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Stat 5", "Stat 6", "Stat 7", "Transit"]
for i, tx in enumerate(track_xs):
    draw_slot(tx, 66.0, track_labels[i], f"P{i+1}", border='#38bdf8')

# 4. Damage Tracks (Flooding & Hull Damage, 10 slots each)
draw_header(18, 77.0, "DAMAGE TRACKS: FLOODING & HULL INTEGRITY [TABLA E1 / REGLAS 8.5]")
dmg_xs = [8.0] + list(np.linspace(24.0, 156.0, 9))
dmg_labels = ["SUNK", "Flood 1", "Flood 2", "Flood 3", "Flood 4", "Flood 5", "Flood 6", "Flood 7", "Flood 8", "Safe"]
hull_labels = ["SUNK", "Hull 1", "Hull 2", "Hull 3", "Hull 4", "Hull 5", "Hull 6", "Hull 7", "Hull 8", "Intact"]
for i, dx in enumerate(dmg_xs):
    b_color = '#ef4444' if i == 0 else ('#38bdf8' if i == 9 else '#0ea5e9')
    draw_slot(dx, 86.5, dmg_labels[i], color='#1e293b', border=b_color)
for i, dx in enumerate(dmg_xs):
    b_color = '#ef4444' if i == 0 else ('#22c55e' if i == 9 else '#f59e0b')
    draw_slot(dx, 103.5, hull_labels[i], color='#1e293b', border=b_color)

# 5. Crew Status (2 rows of 7 slots = 14 slots)
draw_header(18, 114.5, "CREW STATUS & DECORATIONS [TABLA H2 / REGLA 8.8]")
crew_xs = np.linspace(24.0, 156.0, 7)
crew_r1 = ["Capt 1", "Capt 2", "XO/Nav 1", "XO/Nav 2", "Eng 1", "Eng 2", "Gunnery 1"]
crew_r2 = ["Gunnery 2", "Medic", "Torp 1", "Torp 2", "Radio 1", "Radio 2", "Morale"]
for i, cx in enumerate(crew_xs):
    draw_slot(cx, 124.0, crew_r1[i], border='#eab308')
    draw_slot(cx, 140.5, crew_r2[i], border='#eab308')

# 6. RELOCATED SYSTEM STATUS (2 rows of 8 slots = 16 slots!)
# Occupies the previous "Special Rules" zone at Y = 150 to 180 mm!
draw_header(18, 151.0, "★ ESTADO DE SISTEMAS / SYSTEM STATUS (16 CASILLAS REUBICADAS) [TABLA E6]", color='#c084fc')
sys_xs = np.linspace(14.0, 158.0, 8)
sys_r1 = ["F.Doors (1)", "F.Doors (2)", "Aft Doors", "Radio", "Planes", "Gyro/Rud", "Hangar", "Cargo/Clp"]
sys_r2 = ["Motor 1", "Motor 2", "Diesel 1", "Diesel 2", "Fuel Tank", "Batteries", "Periscope", "Hydro/Rad"]
for i, sx in enumerate(sys_xs):
    draw_slot(sx, 160.5, sys_r1[i], color='#2e1065', border='#a855f7')
    draw_slot(sx, 175.5, sys_r2[i], color='#2e1065', border='#a855f7')

# =========================================================================
# RIGHT SIDE: 4 COLUMNS (X = 175.0, 192.5, 210.0, 227.5)
# WITH DEDICATED HEADERS & DEDICATED BOW VS STERN ZONES!
# =========================================================================
col_x = [175.0, 192.5, 210.0, 227.5]

# Section A: Aircraft & Tactical Events (Row 0)
draw_header(167.0, 7.0, "AERONAVES Y EVENTOS / AIR & EVENTS", color=TITLE_COLOR, fontsize=7.2)
draw_slot(col_x[0], 17.0, "Avión 1", "Seiran/Glen", border='#38bdf8')
draw_slot(col_x[1], 17.0, "Avión 2", "Seiran", border='#38bdf8')
draw_slot(col_x[2], 17.0, "Evento 1", "Random", border='#f59e0b')
draw_slot(col_x[3], 17.0, "Evento 2", "Random", border='#f59e0b')

# Section B: FORWARD TORPEDO TUBES (8 TUBES = 2 ROWS OF 4)
draw_header(167.0, 28.5, "▲ PROA / BOW: TUBOS 1–8 [MÁX. 8 PROA]", color=BOW_COLOR, fontsize=7.8)
for i, tx in enumerate(col_x):
    draw_slot(tx, 39.0, f"Tubo {i+1}", "Proa / Bow", color='#0c2a4a', border=BOW_COLOR)
for i, tx in enumerate(col_x):
    draw_slot(tx, 55.5, f"Tubo {i+5}", "Proa / Bow", color='#0c2a4a', border=BOW_COLOR)

# Section C: AFT TORPEDO TUBES & AFT RELOADS (1 ROW OF 4)
draw_header(167.0, 67.5, "▼ POPA / STERN: TUBOS Y RECARGAS", color=STERN_COLOR, fontsize=7.8)
draw_slot(col_x[0], 78.0, "Tubo Popa 1", "Stern #1", color='#4c0519', border=STERN_COLOR)
draw_slot(col_x[1], 78.0, "Tubo Popa 2", "Stern #2", color='#4c0519', border=STERN_COLOR)
draw_slot(col_x[2], 78.0, "Recarga P1", "Aft Rld 1", color='#14532d', border=RELOAD_COLOR)
draw_slot(col_x[3], 78.0, "Recarga P2", "Aft Rld 2", color='#14532d', border=RELOAD_COLOR)

# Section D: FORWARD RELOADS BAY / PAÑOL DE RECARGAS DE PROA
draw_header(167.0, 90.5, "◆ RECARGAS DE PROA / FORWARD RELOADS", color=RELOAD_COLOR, fontsize=7.8)
# Deep storage bay: 68 mm wide x 36 mm high!
bay_w = 68.0
bay_h = 36.0
bay_rect = patches.FancyBboxPatch(
    (166.0, 96.0), bay_w, bay_h,
    boxstyle="round,pad=0.2,rounding_size=2.0",
    linewidth=1.8, edgecolor=RELOAD_COLOR, facecolor='#062312', alpha=0.95
)
ax.add_patch(bay_rect)
ax.text(166.0 + bay_w/2, 96.0 + 8.0, "PAÑOL DE RECARGAS DE PROA", ha='center', color='#86efac', fontsize=8.2, fontweight='bold')
ax.text(166.0 + bay_w/2, 96.0 + 17.0, "Capacidad: hasta 15 torpedos + Suministros (Supplies)", ha='center', color='#cbd5e1', fontsize=6.5)
ax.text(166.0 + bay_w/2, 96.0 + 26.0, "• 12x Type 89 / Type 6 en recarga\n• Opciones Kaiten / Minas de Proa", ha='center', color='#94a3b8', fontsize=5.8)

# Section E: ARTILLERY, DECK GUNS & AA (2 ROWS OF 4)
draw_header(167.0, 137.5, "⚔ CAÑONES Y ARTILLERÍA / GUNS & AA", color=GUN_COLOR, fontsize=7.8)
draw_slot(col_x[0], 148.5, "Cañón 1", "140/120/100", color='#3a2a05', border=GUN_COLOR)
draw_slot(col_x[1], 148.5, "Munición 1", "Ammo x5", color='#3a2a05', border=GUN_COLOR)
draw_slot(col_x[2], 148.5, "Cañón 2", "140mm Gemelo", color='#3a2a05', border=GUN_COLOR)
draw_slot(col_x[3], 148.5, "Munición 2", "Ammo x5", color='#3a2a05', border=GUN_COLOR)

draw_slot(col_x[0], 165.5, "AA Gun 1", "25mm / 13mm", color='#334155', border='#cbd5e1')
draw_slot(col_x[1], 165.5, "AA Gun 2", "25mm Doble", color='#334155', border='#cbd5e1')
draw_slot(col_x[2], 165.5, "Kaiten 1", "O Minisub", color='#4a044e', border='#f472b6')
draw_slot(col_x[3], 165.5, "Kaiten 2", "O Carga", color='#4a044e', border='#f472b6')

# Separator line between Left and Right
ax.axvline(x=164.5, color='#334155', linestyle='-', linewidth=1.5)

plt.tight_layout()
out_dir = r"C:\Users\Richard\.gemini\antigravity\brain\c08a1950-d03a-4ae3-aef2-f14946ddab17"
out_img = os.path.join(out_dir, "universal_board_rethought_plan.png")
plt.savefig(out_img, bbox_inches='tight', dpi=200)
print(f"Generated {out_img} successfully!")
