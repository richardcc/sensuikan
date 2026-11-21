import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.path import Path
from PIL import Image, ImageFilter, ImageEnhance

def create_parchment_texture(width, height):
    np.random.seed(42)
    # Base parchment color in RGB (approx 232, 222, 198)
    base = np.zeros((height, width, 3), dtype=np.float32)
    base[:, :, 0] = 0.91 + 0.05 * (np.random.rand(height, width) - 0.5)
    base[:, :, 1] = 0.87 + 0.05 * (np.random.rand(height, width) - 0.5)
    base[:, :, 2] = 0.77 + 0.06 * (np.random.rand(height, width) - 0.5)
    
    # Add subtle vignette
    y, x = np.ogrid[:height, :width]
    cx, cy = width / 2.0, height / 2.0
    dist = np.sqrt((x - cx)**2 + (y - cy)**2) / np.sqrt(cx**2 + cy**2)
    vignette = 1.0 - 0.18 * (dist ** 2.2)
    base = base * vignette[:, :, np.newaxis]
    base = np.clip(base * 255.0, 0, 255).astype(np.uint8)
    img = Image.fromarray(base)
    img = img.filter(ImageFilter.GaussianBlur(1.2))
    return img

def draw_compass_rose(ax, x, y, size=0.12):
    # Outer ring
    circle = plt.Circle((x, y), size, fill=False, edgecolor='#1b2a41', linewidth=1.5, zorder=25)
    inner_circle = plt.Circle((x, y), size * 0.85, fill=False, edgecolor='#3a4d6b', linewidth=0.8, linestyle=':', zorder=25)
    ax.add_patch(circle)
    ax.add_patch(inner_circle)
    
    # 8-point star
    pts_main = [(0, 1), (0.28, 0.28), (1, 0), (0.28, -0.28), (0, -1), (-0.28, -0.28), (-1, 0), (-0.28, 0.28)]
    pts_sec = [(0.15, 0.65), (0.65, 0.15), (0.65, -0.15), (0.15, -0.65), (-0.15, -0.65), (-0.65, -0.15), (-0.65, 0.15), (-0.15, 0.65)]
    
    # Draw North arrow tip
    north_pts = np.array([[x, y], [x - size*0.25, y + size*0.2], [x, y + size*1.2], [x + size*0.25, y + size*0.2]])
    poly_n1 = patches.Polygon([[x, y], [x - size*0.22, y + size*0.2], [x, y + size*1.2]], closed=True, facecolor='#16253d', edgecolor='#0a111c', linewidth=1, zorder=26)
    poly_n2 = patches.Polygon([[x, y], [x + size*0.22, y + size*0.2], [x, y + size*1.2]], closed=True, facecolor='#e6dfd1', edgecolor='#0a111c', linewidth=1, zorder=26)
    ax.add_patch(poly_n1)
    ax.add_patch(poly_n2)
    
    # Other cardinal points
    for angle, col in [(90, '#1b2a41'), (180, '#1b2a41'), (270, '#1b2a41')]:
        rad = np.radians(angle)
        dx, dy = np.sin(rad) * size, -np.cos(rad) * size
        ax.plot([x, x + dx], [y, y + dy], color='#1b2a41', linewidth=1.5, zorder=26)
        
    ax.text(x, y + size * 1.35, "N", color='#0a111c', fontsize=12, fontweight='bold', ha='center', va='center', zorder=27, fontfamily='serif')

def draw_map_frame(ax, width, height, title, subtitle, map_no="MAP NO. 23B"):
    # Outer double border
    ax.add_patch(patches.Rectangle((0.015, 0.015), 0.97, 0.97, fill=False, edgecolor='#1b2a41', linewidth=2.5, zorder=30))
    ax.add_patch(patches.Rectangle((0.022, 0.022), 0.956, 0.956, fill=False, edgecolor='#1b2a41', linewidth=1.0, zorder=30))
    
    # Coordinate tick marks around the border
    for xi in np.linspace(0.05, 0.95, 10):
        ax.plot([xi, xi], [0.015, 0.022], color='#1b2a41', linewidth=1.2, zorder=31)
        ax.plot([xi, xi], [0.978, 0.985], color='#1b2a41', linewidth=1.2, zorder=31)
    for yi in np.linspace(0.05, 0.95, 12):
        ax.plot([0.015, 0.022], [yi, yi], color='#1b2a41', linewidth=1.2, zorder=31)
        ax.plot([0.978, 0.985], [yi, yi], color='#1b2a41', linewidth=1.2, zorder=31)
        
    # Title Cartouche in bottom right
    cx, cy, cw, ch = 0.56, 0.035, 0.40, 0.125
    ax.add_patch(patches.Rectangle((cx, cy), cw, ch, facecolor='#f4ece1', edgecolor='#1b2a41', linewidth=1.8, zorder=35))
    ax.add_patch(patches.Rectangle((cx+0.005, cy+0.005), cw-0.01, ch-0.01, fill=False, edgecolor='#475569', linewidth=0.6, zorder=36))
    
    ax.text(cx + cw/2, cy + ch*0.78, title, fontsize=11, fontweight='bold', ha='center', va='center', color='#0f172a', zorder=37, fontfamily='serif')
    ax.text(cx + cw/2, cy + ch*0.55, subtitle, fontsize=8, ha='center', va='center', color='#334155', zorder=37, fontfamily='serif')
    ax.text(cx + cw/2, cy + ch*0.35, f"{map_no} • 1942 PACIFIC OPERATIONS", fontsize=6.8, ha='center', va='center', color='#475569', zorder=37, fontfamily='sans-serif')
    ax.text(cx + cw/2, cy + ch*0.16, "RESTRICTED - MILITARY RECONNAISSANCE ONLY", fontsize=6.2, fontweight='bold', ha='center', va='center', color='#881337', zorder=37, fontfamily='sans-serif')

def generate_panama_canal_map():
    fig, ax = plt.subplots(figsize=(9, 12), dpi=150)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis('off')
    
    # 1. Base land color
    ax.add_patch(patches.Rectangle((0, 0), 1, 1, facecolor='#dccfb6', zorder=1))
    
    # 2. Draw Topography contours (land terrain)
    np.random.seed(101)
    grid_x, grid_y = np.mgrid[0:1:100j, 0:1:100j]
    elevation = (
        np.sin(grid_x * 4.5) * np.cos(grid_y * 3.8) * 0.4 +
        np.cos(grid_x * 8.2 + grid_y * 5.1) * 0.2 +
        (1.0 - grid_y) * 0.3
    )
    # Cut out channel from elevation
    ch_mask = (np.abs(grid_x - (0.35 + 0.3 * (1 - grid_y))) < 0.08) & (grid_y > 0.35)
    elevation[ch_mask] -= 0.5
    cs = ax.contour(grid_x, grid_y, elevation, levels=14, colors='#a89b80', linewidths=0.65, alpha=0.6, zorder=3)
    
    # 3. Pacific Ocean at bottom right & entrance
    # Create smooth Pacific Ocean polygon
    ocean_pts = [
        (0.48, 0.0), (0.45, 0.22), (0.42, 0.38), (0.45, 0.48), (0.52, 0.52),
        (0.56, 0.44), (0.64, 0.42), (0.72, 0.46), (0.84, 0.38), (0.92, 0.28),
        (1.0, 0.25), (1.0, 0.0)
    ]
    poly_ocean = patches.Polygon(ocean_pts, closed=True, facecolor='#122842', edgecolor='#0a1829', linewidth=2.0, zorder=5)
    ax.add_patch(poly_ocean)
    
    # Ocean soundings lines
    for off in [0.02, 0.045, 0.075]:
        shallow_pts = [(p[0] + off, max(0, p[1] - off*0.5)) for p in ocean_pts if p[0] + off < 1.0]
        if len(shallow_pts) > 2:
            ax.plot([p[0] for p in shallow_pts], [p[1] for p in shallow_pts], color='#29486b', linewidth=0.7, linestyle='--', zorder=6)
            
    # 4. Canal Channel cutting inland
    # Channel connects from Pacific Entrance (0.48, 0.45) up through Balboa, Miraflores Locks, to Pedro Miguel
    canal_pts = [
        # East bank
        (0.52, 0.50), (0.47, 0.58), (0.42, 0.68), (0.39, 0.76), (0.34, 0.86), (0.28, 0.94), (0.22, 1.0),
        # West bank top
        (0.14, 1.0), (0.20, 0.92), (0.26, 0.82), (0.31, 0.72), (0.35, 0.62), (0.39, 0.54), (0.41, 0.42),
        (0.45, 0.28), (0.48, 0.0)
    ]
    poly_canal = patches.Polygon(canal_pts, closed=True, facecolor='#163354', edgecolor='#0b1a2e', linewidth=1.8, zorder=5)
    ax.add_patch(poly_canal)
    
    # Miraflores Lake (between locks)
    lake_pts = [
        (0.31, 0.74), (0.35, 0.78), (0.42, 0.80), (0.44, 0.76), (0.40, 0.72), (0.35, 0.70)
    ]
    poly_lake = patches.Polygon(lake_pts, closed=True, facecolor='#193c63', edgecolor='#0c1e33', linewidth=1.5, zorder=6)
    ax.add_patch(poly_lake)
    
    # 5. Lock Structures (Miraflores Locks & Pedro Miguel)
    # Miraflores Locks gates
    ax.add_patch(patches.Rectangle((0.36, 0.71), 0.045, 0.015, angle=-35, facecolor='#cbd5e1', edgecolor='#0f172a', linewidth=1.2, zorder=12))
    ax.add_patch(patches.Rectangle((0.34, 0.74), 0.045, 0.015, angle=-35, facecolor='#cbd5e1', edgecolor='#0f172a', linewidth=1.2, zorder=12))
    ax.text(0.48, 0.74, "MIRAFLORES\nLOCKS", color='#f8fafc', fontsize=8.5, fontweight='bold', ha='left', va='center', zorder=20, fontfamily='serif', bbox=dict(boxstyle='square,pad=0.2', facecolor='#0f172a', alpha=0.8, edgecolor='#38bdf8', lw=1))
    
    # Pedro Miguel Locks
    ax.add_patch(patches.Rectangle((0.27, 0.88), 0.04, 0.015, angle=-42, facecolor='#cbd5e1', edgecolor='#0f172a', linewidth=1.2, zorder=12))
    ax.text(0.12, 0.88, "PEDRO MIGUEL\nLOCKS", color='#f8fafc', fontsize=7.5, fontweight='bold', ha='right', va='center', zorder=20, fontfamily='serif', bbox=dict(boxstyle='square,pad=0.2', facecolor='#0f172a', alpha=0.8, edgecolor='#e2e8f0', lw=0.8))
    
    # Balboa Naval Port
    ax.text(0.53, 0.54, "BALBOA PORT", color='#f1f5f9', fontsize=7.8, fontweight='bold', zorder=20, fontfamily='serif', bbox=dict(boxstyle='round,pad=0.15', facecolor='#1e293b', alpha=0.85, edgecolor='#94a3b8', lw=0.8))
    
    # Albrook Airfield (runway)
    ax.plot([0.55, 0.58], [0.60, 0.68], color='#334155', linewidth=3.5, zorder=10)
    ax.plot([0.55, 0.58], [0.60, 0.68], color='#e2e8f0', linewidth=1.0, linestyle='--', zorder=11)
    ax.text(0.60, 0.65, "Albrook AAF", color='#334155', fontsize=7, fontstyle='italic', zorder=20)
    
    # Panama City urban grid hatching
    for gy in np.linspace(0.44, 0.52, 7):
        ax.plot([0.65, 0.82], [gy, gy], color='#85755b', linewidth=0.6, alpha=0.7, zorder=4)
    for gx in np.linspace(0.65, 0.82, 9):
        ax.plot([gx, gx], [0.44, 0.52], color='#85755b', linewidth=0.6, alpha=0.7, zorder=4)
    ax.text(0.74, 0.53, "PANAMA CITY", color='#292524', fontsize=8, fontweight='bold', ha='center', zorder=20, fontfamily='serif')

    # Water depth soundings (numbers in the water)
    soundings = [
        (0.60, 0.30, '45'), (0.70, 0.22, '62'), (0.80, 0.15, '78'), (0.55, 0.12, '84'),
        (0.75, 0.32, '35'), (0.88, 0.22, '50'), (0.48, 0.35, '28'), (0.45, 0.52, '18'),
        (0.40, 0.60, '14'), (0.36, 0.68, '12'), (0.30, 0.82, '14'), (0.24, 0.94, '15')
    ]
    for sx, sy, sval in soundings:
        ax.text(sx, sy, sval, color='#4a729c', fontsize=6.5, fontfamily='serif', ha='center', va='center', zorder=7)

    # 6. Coordinate Grid Lines
    for gx in [0.2, 0.4, 0.6, 0.8]:
        ax.plot([gx, gx], [0.02, 0.98], color='#3e4f68', linewidth=0.5, linestyle=':', alpha=0.45, zorder=22)
    for gy in [0.2, 0.4, 0.6, 0.8]:
        ax.plot([0.02, 0.98], [gy, gy], color='#3e4f68', linewidth=0.5, linestyle=':', alpha=0.45, zorder=22)

    # 7. Compass rose
    draw_compass_rose(ax, 0.84, 0.84, size=0.08)
    
    # 8. Frame & Title Cartouche
    draw_map_frame(ax, 9, 12, "PANAMA CANAL", "PACIFIC ENTRANCE & MIRAFLORES LOCKS", "MAP NO. P11")

    # Save to buffer
    out_path = 'app/assets/maps/map_p11_panama_canal.jpg'
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
    plt.savefig(out_path, dpi=150, facecolor='#e8dfca')
    plt.close()
    print("Generated Panama Canal map at:", out_path)

generate_panama_canal_map()
