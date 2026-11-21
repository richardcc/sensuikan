import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

def get_parchment_crop(target_w, target_h, seed=1):
    bg_path = 'images/mats/vintage_naval_parchment_bg.png'
    if not os.path.exists(bg_path):
        bg_path = 'images/mats/real_antique_parchment_bg.png'
    
    bg = Image.open(bg_path)
    bw, bh = bg.size
    
    # Crop a clean section avoiding edges
    np.random.seed(seed)
    max_x = max(0, bw - target_w)
    max_y = max(0, bh - target_h)
    x = int(max_x * 0.2)
    y = int(max_y * 0.2)
    
    crop = bg.crop((x, y, x + target_w, y + target_h))
    return crop

def add_vintage_border(draw, w, h, title_text, subtitle_text, map_code):
    margin = 28
    # Double line border
    draw.rectangle([margin, margin, w - margin, h - margin], outline=(27, 42, 65), width=3)
    draw.rectangle([margin + 8, margin + 8, w - margin - 8, h - margin - 8], outline=(45, 65, 95), width=1)
    
    # Marginal coordinate ticks
    for xi in np.linspace(margin + 20, w - margin - 20, 16):
        draw.line([xi, margin, xi, margin + 8], fill=(27, 42, 65), width=1)
        draw.line([xi, h - margin - 8, xi, h - margin], fill=(27, 42, 65), width=1)
    for yi in np.linspace(margin + 20, h - margin - 20, 20):
        draw.line([margin, yi, margin + 8, yi], fill=(27, 42, 65), width=1)
        draw.line([w - margin - 8, yi, w - margin, yi], fill=(27, 42, 65), width=1)
        
    # Title Cartouche Box
    cw, ch = int(w * 0.44), int(h * 0.13)
    cx = w - margin - cw - 15
    cy = h - margin - ch - 15
    
    draw.rectangle([cx, cy, cx + cw, cy + ch], fill=(244, 238, 226, 240), outline=(27, 42, 65), width=2)
    draw.rectangle([cx + 4, cy + 4, cx + cw - 4, cy + ch - 4], outline=(71, 85, 105), width=1)
    
    # Text inside cartouche
    # Use default bitmap font with scaled positioning
    draw.text((cx + cw // 2, cy + 18), title_text, fill=(15, 23, 42), anchor="mm")
    draw.text((cx + cw // 2, cy + 42), subtitle_text, fill=(51, 65, 85), anchor="mm")
    draw.text((cx + cw // 2, cy + 68), f"{map_code} • 1942 PACIFIC THEATER", fill=(71, 85, 105), anchor="mm")
    draw.text((cx + cw // 2, cy + 92), "CONFIDENTIAL - MILITARY RECONNAISSANCE ONLY", fill=(136, 19, 55), anchor="mm")

def draw_compass_rose(draw, cx, cy, radius=55):
    # Outer rings
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], outline=(27, 42, 65), width=2)
    draw.ellipse([cx - radius + 5, cy - radius + 5, cx + radius - 5, cy + radius - 5], outline=(58, 77, 107), width=1)
    
    # 8 points
    for angle in range(0, 360, 45):
        rad = math.radians(angle)
        rad_left = math.radians(angle - 15)
        rad_right = math.radians(angle + 15)
        
        r_tip = radius * (1.15 if angle == 0 else 0.9)
        r_base = radius * 0.25
        
        x_tip = cx + r_tip * math.sin(rad)
        y_tip = cy - r_tip * math.cos(rad)
        
        x_l = cx + r_base * math.sin(rad_left)
        y_l = cy - r_base * math.cos(rad_left)
        x_r = cx + r_base * math.sin(rad_right)
        y_r = cy - r_base * math.cos(rad_right)
        
        # Two-tone star points (dark / light)
        draw.polygon([(cx, cy), (x_l, y_l), (x_tip, y_tip)], fill=(22, 37, 61), outline=(10, 17, 28))
        draw.polygon([(cx, cy), (x_r, y_r), (x_tip, y_tip)], fill=(230, 223, 209), outline=(10, 17, 28))
        
    draw.text((cx, cy - radius - 14), "N", fill=(10, 17, 28), anchor="mm")

def add_coordinate_grid(draw, w, h):
    for gx in np.linspace(w * 0.15, w * 0.85, 5):
        draw.line([gx, 30, gx, h - 30], fill=(62, 79, 104, 60), width=1)
    for gy in np.linspace(h * 0.15, h * 0.85, 7):
        draw.line([30, gy, w - 30, gy], fill=(62, 79, 104, 60), width=1)

def add_soundings(draw, soundings_list):
    for sx, sy, sval in soundings_list:
        draw.text((sx, sy), str(sval), fill=(74, 114, 156), anchor="mm")

# =========================================================================
# 1. MAPA P11: PANAMA CANAL (MIRAFLORES LOCKS & PACIFIC ENTRANCE)
# =========================================================================
def build_panama_canal_map():
    w, h = 896, 1200
    base = get_parchment_crop(w, h, seed=42)
    
    # Layer for drawing water with rich watercolor gradient
    water_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(water_layer)
    
    # Pacific Ocean polygon in bottom & bottom-right
    ocean_poly = [
        (int(w * 0.44), h),
        (int(w * 0.42), int(h * 0.78)),
        (int(w * 0.40), int(h * 0.62)),
        (int(w * 0.46), int(h * 0.54)),
        (int(w * 0.54), int(h * 0.50)),
        (int(w * 0.62), int(h * 0.46)),
        (int(w * 0.72), int(h * 0.44)),
        (int(w * 0.82), int(h * 0.48)),
        (int(w * 0.92), int(h * 0.40)),
        (w, int(h * 0.36)),
        (w, h)
    ]
    
    # Canal Channel cutting inland northwest from (0.50, 0.50) to (0.18, 0.0)
    canal_poly = [
        # East bank
        (int(w * 0.54), int(h * 0.50)),
        (int(w * 0.48), int(h * 0.60)),
        (int(w * 0.43), int(h * 0.68)),
        (int(w * 0.38), int(h * 0.76)),
        (int(w * 0.32), int(h * 0.84)),
        (int(w * 0.26), int(h * 0.94)),
        (int(w * 0.22), h),
        # West bank
        (int(w * 0.12), h),
        (int(w * 0.17), int(h * 0.92)),
        (int(w * 0.22), int(h * 0.82)),
        (int(w * 0.28), int(h * 0.72)),
        (int(w * 0.34), int(h * 0.60)),
        (int(w * 0.38), int(h * 0.48)),
        (int(w * 0.41), int(h * 0.38)),
        (int(w * 0.44), h)
    ]
    
    # Invert Y coordinate so ocean is at bottom (Pacific entry) and canal goes UP into land
    canal_poly_up = [
        # East bank heading UP north
        (int(w * 0.52), int(h * 0.54)),
        (int(w * 0.48), int(h * 0.46)),
        (int(w * 0.44), int(h * 0.38)),
        (int(w * 0.39), int(h * 0.28)),
        (int(w * 0.35), int(h * 0.20)),
        (int(w * 0.30), int(h * 0.10)),
        (int(w * 0.24), 0),
        # West bank heading DOWN south
        (int(w * 0.16), 0),
        (int(w * 0.22), int(h * 0.10)),
        (int(w * 0.27), int(h * 0.20)),
        (int(w * 0.31), int(h * 0.28)),
        (int(w * 0.36), int(h * 0.38)),
        (int(w * 0.40), int(h * 0.46)),
        (int(w * 0.44), int(h * 0.54)),
        (int(w * 0.42), int(h * 0.68)),
        (int(w * 0.46), h),
        (w, h),
        (w, int(h * 0.60)),
        (int(w * 0.88), int(h * 0.56)),
        (int(w * 0.78), int(h * 0.52)),
        (int(w * 0.65), int(h * 0.54))
    ]
    
    # Draw deep water fill
    wd.polygon(canal_poly_up, fill=(18, 42, 70, 245), outline=(10, 24, 40, 255))
    
    # Miraflores Lake wideness
    lake_poly = [
        (int(w * 0.30), int(h * 0.28)),
        (int(w * 0.36), int(h * 0.24)),
        (int(w * 0.43), int(h * 0.26)),
        (int(w * 0.45), int(h * 0.31)),
        (int(w * 0.38), int(h * 0.33)),
        (int(w * 0.32), int(h * 0.31))
    ]
    wd.polygon(lake_poly, fill=(22, 52, 85, 245), outline=(10, 24, 40, 255))
    
    # Island in entrance
    taboga_island = [
        (int(w * 0.68), int(h * 0.78)),
        (int(w * 0.73), int(h * 0.75)),
        (int(w * 0.77), int(h * 0.80)),
        (int(w * 0.72), int(h * 0.84))
    ]
    wd.polygon(taboga_island, fill=(215, 202, 178, 255), outline=(30, 45, 65, 255))
    
    # Composite water on parchment
    base.paste(water_layer, (0, 0), water_layer)
    draw = ImageDraw.Draw(base)
    
    # Coastline highlight lines
    draw.line(canal_poly_up, fill=(10, 25, 45), width=2)
    
    # Lock structures (Miraflores Locks at y: 25-28%)
    lx, ly = int(w * 0.36), int(h * 0.27)
    draw.rectangle([lx - 16, ly - 6, lx + 16, ly + 6], fill=(220, 225, 235), outline=(15, 23, 42), width=2)
    draw.rectangle([lx - 20, ly + 14, lx + 12, ly + 26], fill=(220, 225, 235), outline=(15, 23, 42), width=2)
    draw.text((lx + 45, ly), "MIRAFLORES LOCKS", fill=(185, 28, 28), anchor="lm")
    draw.text((lx + 45, ly + 18), "(TARGET ZONE)", fill=(185, 28, 28), anchor="lm")
    
    # Pedro Miguel Locks at y: 15%
    pmx, pmy = int(w * 0.28), int(h * 0.16)
    draw.rectangle([pmx - 14, pmy - 5, pmx + 14, pmy + 5], fill=(220, 225, 235), outline=(15, 23, 42), width=2)
    draw.text((pmx - 25, pmy), "Pedro Miguel Locks", fill=(30, 41, 59), anchor="rm")
    
    # Balboa Naval Docks at y: 50%
    bx, by = int(w * 0.54), int(h * 0.50)
    draw.text((bx + 15, by), "BALBOA NAVAL BASE", fill=(15, 23, 42), anchor="lm")
    
    # Albrook Airfield (runway)
    draw.line([int(w * 0.56), int(h * 0.40), int(w * 0.60), int(h * 0.32)], fill=(45, 55, 72), width=4)
    draw.text((int(w * 0.62), int(h * 0.36)), "Albrook Field", fill=(51, 65, 85), anchor="lm")
    
    # Panama City urban zone
    draw.text((int(w * 0.74), int(h * 0.48)), "PANAMA CITY", fill=(30, 41, 59), anchor="mm")
    
    # Topography contours in land
    for r in [80, 130, 180, 240]:
        draw.arc([int(w * 0.05), int(h * 0.35), int(w * 0.35), int(h * 0.75)], 270, 90, fill=(160, 145, 125), width=1)
        draw.arc([int(w * 0.60), int(h * 0.10), int(w * 0.95), int(h * 0.45)], 90, 270, fill=(160, 145, 125), width=1)
        
    # Soundings in Pacific
    soundings = [
        (int(w * 0.75), int(h * 0.65), 45), (int(w * 0.85), int(h * 0.75), 68),
        (int(w * 0.60), int(h * 0.70), 32), (int(w * 0.52), int(h * 0.85), 54),
        (int(w * 0.48), int(h * 0.62), 22), (int(w * 0.44), int(h * 0.45), 14),
        (int(w * 0.38), int(h * 0.36), 12), (int(w * 0.32), int(h * 0.22), 15),
        (int(w * 0.24), int(h * 0.08), 16)
    ]
    add_soundings(draw, soundings)
    
    # Compass Rose & Grids
    draw_compass_rose(draw, int(w * 0.82), int(h * 0.18), radius=55)
    add_coordinate_grid(draw, w, h)
    
    # Border & Title Cartouche
    add_vintage_border(draw, w, h, "PANAMA CANAL", "PACIFIC ENTRANCE & MIRAFLORES LOCKS", "MAP NO. P11")
    
    base.save('app/assets/maps/map_p11_panama_canal.jpg', quality=95)
    print("Built Panama Canal chart: app/assets/maps/map_p11_panama_canal.jpg")

# =========================================================================
# 2. MAPA P10: OREGON COAST & MOUNT EMILY (BROOKINGS / CHETCO RIVER)
# =========================================================================
def build_oregon_map():
    w, h = 896, 1200
    base = get_parchment_crop(w, h, seed=88)
    
    water_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(water_layer)
    
    # Pacific Ocean occupies left side (0 to 35-45% width)
    ocean_poly = [
        (0, 0),
        (int(w * 0.22), 0),
        (int(w * 0.26), int(h * 0.15)),
        (int(w * 0.30), int(h * 0.30)),
        (int(w * 0.34), int(h * 0.45)),  # Chetco River mouth
        (int(w * 0.38), int(h * 0.60)),
        (int(w * 0.44), int(h * 0.78)),
        (int(w * 0.52), h),
        (0, h)
    ]
    wd.polygon(ocean_poly, fill=(16, 38, 65, 245), outline=(10, 24, 40, 255))
    
    # Chetco River winding eastward inland into mountains
    chetco_river = [
        (int(w * 0.34), int(h * 0.45)),
        (int(w * 0.42), int(h * 0.42)),
        (int(w * 0.48), int(h * 0.38)),
        (int(w * 0.56), int(h * 0.41)),
        (int(w * 0.65), int(h * 0.35)),
        (int(w * 0.72), int(h * 0.28)),
        (int(w * 0.80), int(h * 0.24)),
        (int(w * 0.88), int(h * 0.22))
    ]
    for i in range(len(chetco_river) - 1):
        wd.line([chetco_river[i], chetco_river[i+1]], fill=(22, 54, 88, 245), width=8)
        
    base.paste(water_layer, (0, 0), water_layer)
    draw = ImageDraw.Draw(base)
    draw.line(ocean_poly, fill=(10, 25, 45), width=2)
    
    # Brookings town
    bx, by = int(w * 0.40), int(h * 0.48)
    draw.text((bx, by), "BROOKINGS", fill=(30, 41, 59), anchor="lm")
    draw.text((bx + 10, by + 18), "Chetco River Mouth", fill=(71, 85, 105), anchor="lm")
    
    # Mount Emily Target Zone (Nobuo Fujita firebombing zone)
    mx, my = int(w * 0.74), int(h * 0.28)
    draw.ellipse([mx - 25, my - 25, mx + 25, my + 25], outline=(185, 28, 28), width=2)
    draw.ellipse([mx - 15, my - 15, mx + 15, my + 15], outline=(220, 38, 38), width=1)
    draw.line([mx - 32, my, mx + 32, my], fill=(185, 28, 28), width=1)
    draw.line([mx, my - 32, mx, my + 32], fill=(185, 28, 28), width=1)
    draw.text((mx, my + 30), "MOUNT EMILY", fill=(185, 28, 28), anchor="mt")
    draw.text((mx, my + 46), "(TARGET ZONE)", fill=(185, 28, 28), anchor="mt")
    
    # Redwood/Pine forest texture hatching
    for fy in range(int(h * 0.15), int(h * 0.85), 30):
        for fx in range(int(w * 0.45), int(w * 0.90), 35):
            draw.text((fx, fy), "▲", fill=(95, 125, 90, 140), anchor="mm")
            
    # Mountain contours around Mount Emily
    for cr in [50, 90, 140, 200, 270]:
        draw.arc([mx - cr, my - cr, mx + cr, my + cr], 0, 360, fill=(155, 140, 120), width=1)
        
    # Soundings in Pacific
    soundings = [
        (int(w * 0.15), int(h * 0.25), 58), (int(w * 0.22), int(h * 0.40), 34),
        (int(w * 0.12), int(h * 0.60), 65), (int(w * 0.25), int(h * 0.75), 42),
        (int(w * 0.35), int(h * 0.90), 28), (int(w * 0.08), int(h * 0.85), 82)
    ]
    add_soundings(draw, soundings)
    
    draw_compass_rose(draw, int(w * 0.82), int(h * 0.82), radius=55)
    add_coordinate_grid(draw, w, h)
    add_vintage_border(draw, w, h, "OREGON COAST SECTOR", "BROOKINGS & MT. EMILY VICINITY", "MAP NO. P10")
    
    base.save('app/assets/maps/map_p10_oregon.jpg', quality=95)
    print("Built Oregon chart: app/assets/maps/map_p10_oregon.jpg")

# =========================================================================
# 3. MAPA P12: ALEUTIANS & DUTCH HARBOR (UNALASKA BAY / AMALNAK ISLAND)
# =========================================================================
def build_aleutians_map():
    w, h = 896, 1200
    base = get_parchment_crop(w, h, seed=77)
    
    water_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(water_layer)
    
    # Subarctic northern ocean waters fill central and bottom bays
    water_poly = [
        (0, 0),
        (w, 0),
        (w, int(h * 0.70)),
        (int(w * 0.88), int(h * 0.65)),
        (int(w * 0.76), int(h * 0.55)),
        (int(w * 0.66), int(h * 0.48)),
        (int(w * 0.54), int(h * 0.58)),
        (int(w * 0.44), int(h * 0.65)),
        (int(w * 0.34), int(h * 0.52)),
        (int(w * 0.22), int(h * 0.58)),
        (int(w * 0.12), int(h * 0.72)),
        (0, int(h * 0.80))
    ]
    wd.polygon(water_poly, fill=(14, 34, 58, 245), outline=(8, 20, 36, 255))
    
    # Amaknak Island in the center of Unalaska Bay
    amaknak_island = [
        (int(w * 0.48), int(h * 0.36)),
        (int(w * 0.56), int(h * 0.32)),
        (int(w * 0.60), int(h * 0.40)),
        (int(w * 0.58), int(h * 0.48)),
        (int(w * 0.50), int(h * 0.46)),
        (int(w * 0.46), int(h * 0.40))
    ]
    wd.polygon(amaknak_island, fill=(215, 205, 185, 255), outline=(25, 40, 60, 255))
    
    # Dutch Harbor Naval Operating Base on Amaknak
    base.paste(water_layer, (0, 0), water_layer)
    draw = ImageDraw.Draw(base)
    draw.line(water_poly, fill=(10, 25, 45), width=2)
    draw.line(amaknak_island + [amaknak_island[0]], fill=(10, 25, 45), width=2)
    
    # Dutch Harbor Airstrip
    draw.line([int(w * 0.50), int(h * 0.38), int(w * 0.56), int(h * 0.44)], fill=(45, 55, 72), width=4)
    draw.text((int(w * 0.53), int(h * 0.48)), "DUTCH HARBOR", fill=(185, 28, 28), anchor="mt")
    draw.text((int(w * 0.53), int(h * 0.51)), "NAVAL BASE", fill=(185, 28, 28), anchor="mt")
    
    # Captains Bay & Unalaska Village
    draw.text((int(w * 0.38), int(h * 0.62)), "Captains Bay", fill=(71, 85, 105), anchor="mm")
    draw.text((int(w * 0.68), int(h * 0.60)), "Unalaska Village", fill=(51, 65, 85), anchor="mm")
    
    # Rugged subarctic fjords & volcanic contours
    for cx, cy in [(int(w * 0.20), int(h * 0.75)), (int(w * 0.82), int(h * 0.70))]:
        for cr in [50, 90, 140, 210]:
            draw.arc([cx - cr, cy - cr, cx + cr, cy + cr], 0, 360, fill=(155, 140, 120), width=1)
            
    # Soundings
    soundings = [
        (int(w * 0.25), int(h * 0.25), 65), (int(w * 0.45), int(h * 0.18), 84),
        (int(w * 0.75), int(h * 0.22), 92), (int(w * 0.38), int(h * 0.42), 35),
        (int(w * 0.64), int(h * 0.36), 42), (int(w * 0.52), int(h * 0.56), 28)
    ]
    add_soundings(draw, soundings)
    
    draw_compass_rose(draw, int(w * 0.85), int(h * 0.20), radius=55)
    add_coordinate_grid(draw, w, h)
    add_vintage_border(draw, w, h, "ALEUTIAN ISLANDS", "DUTCH HARBOR & UNALASKA BAY", "MAP NO. P12")
    
    base.save('app/assets/maps/map_p12_aleutians.jpg', quality=95)
    print("Built Aleutians chart: app/assets/maps/map_p12_aleutians.jpg (896x1200)")

def build_sydney_harbor_map():
    w, h = 896, 1200
    base = get_parchment_crop(w, h, seed=99)
    
    water_layer = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    wd = ImageDraw.Draw(water_layer)
    
    # Port Jackson water body
    ocean_water = [
        (int(w * 0.72), 0),
        (w, 0),
        (w, int(h * 0.70)),
        (int(w * 0.76), int(h * 0.70)),
        (int(w * 0.72), int(h * 0.52)),
        (int(w * 0.68), int(h * 0.46)),
        (int(w * 0.65), int(h * 0.42)),
        (int(w * 0.68), int(h * 0.36)),
        (int(w * 0.72), int(h * 0.32)),
        (int(w * 0.76), 0)
    ]
    wd.polygon(ocean_water, fill=(16, 42, 70, 245), outline=(10, 26, 44, 255))
    
    main_channel = [
        (int(w * 0.65), int(h * 0.42)),
        (int(w * 0.62), int(h * 0.48)),
        (int(w * 0.58), int(h * 0.58)),
        (int(w * 0.52), int(h * 0.66)),
        (int(w * 0.48), int(h * 0.62)),
        (int(w * 0.44), int(h * 0.56)),
        (int(w * 0.38), int(h * 0.56)),
        (int(w * 0.32), int(h * 0.54)),
        (int(w * 0.24), int(h * 0.50)),
        (int(w * 0.18), int(h * 0.46)),
        (int(w * 0.18), int(h * 0.40)),
        (int(w * 0.28), int(h * 0.42)),
        (int(w * 0.36), int(h * 0.40)),
        (int(w * 0.44), int(h * 0.42)),
        (int(w * 0.50), int(h * 0.38)),
        (int(w * 0.56), int(h * 0.36)),
        (int(w * 0.54), int(h * 0.28)),
        (int(w * 0.46), int(h * 0.22)),
        (int(w * 0.50), int(h * 0.18)),
        (int(w * 0.58), int(h * 0.24)),
        (int(w * 0.62), int(h * 0.34)),
        (int(w * 0.65), int(h * 0.42))
    ]
    wd.polygon(main_channel, fill=(20, 50, 82, 245), outline=(12, 30, 50, 255))
    
    fort_denison = [(int(w * 0.35), int(h * 0.47)), (int(w * 0.37), int(h * 0.46)), (int(w * 0.37), int(h * 0.48)), (int(w * 0.35), int(h * 0.48))]
    wd.polygon(fort_denison, fill=(215, 205, 185, 255), outline=(25, 40, 60, 255))
    shark_island = [(int(w * 0.50), int(h * 0.52)), (int(w * 0.53), int(h * 0.51)), (int(w * 0.53), int(h * 0.54)), (int(w * 0.50), int(h * 0.54))]
    wd.polygon(shark_island, fill=(215, 205, 185, 255), outline=(25, 40, 60, 255))
    
    base.paste(water_layer, (0, 0), water_layer)
    draw = ImageDraw.Draw(base)
    draw.line(ocean_water, fill=(10, 25, 45), width=2)
    draw.line(main_channel, fill=(10, 25, 45), width=2)
    
    # Submarine Anti-Torpedo Boom Net barrier (Georges Head to Green Point)
    boom_start = (int(w * 0.56), int(h * 0.37))
    boom_end = (int(w * 0.61), int(h * 0.47))
    draw.line([boom_start, boom_end], fill=(185, 28, 28), width=3)
    draw.text((int(w * 0.58), int(h * 0.41)), "BOOM DEFENCE NET", fill=(185, 28, 28), anchor="lb")
    draw.text((int(w * 0.58), int(h * 0.43)), "(Submarine Barrier)", fill=(185, 28, 28), anchor="lt")
    
    # Naval Fleet Anchorage / Garden Island
    draw.rectangle([int(w * 0.28), int(h * 0.49), int(w * 0.38), int(h * 0.54)], outline=(185, 28, 28), width=2)
    draw.text((int(w * 0.33), int(h * 0.51)), "FLEET ANCHORAGE", fill=(185, 28, 28), anchor="mm")
    draw.text((int(w * 0.33), int(h * 0.535)), "(HMAS Canberra / USS Chicago)", fill=(220, 38, 38), anchor="mm")
    
    # Strategic points
    draw.text((int(w * 0.72), int(h * 0.30)), "NORTH HEAD", fill=(30, 41, 59), anchor="mm")
    draw.text((int(w * 0.72), int(h * 0.50)), "SOUTH HEAD", fill=(30, 41, 59), anchor="mm")
    draw.text((int(w * 0.52), int(h * 0.64)), "Rose Bay", fill=(71, 85, 105), anchor="mm")
    draw.text((int(w * 0.44), int(h * 0.40)), "Bradleys Head", fill=(71, 85, 105), anchor="mm")
    draw.text((int(w * 0.20), int(h * 0.44)), "Sydney Harbour Bridge", fill=(71, 85, 105), anchor="mm")
    draw.text((int(w * 0.50), int(h * 0.20)), "Middle Harbour", fill=(71, 85, 105), anchor="mm")
    
    # Soundings
    soundings = [
        (int(w * 0.85), int(h * 0.35), 45), (int(w * 0.75), int(h * 0.42), 26),
        (int(w * 0.64), int(h * 0.43), 18), (int(w * 0.54), int(h * 0.45), 14),
        (int(w * 0.40), int(h * 0.48), 12), (int(w * 0.30), int(h * 0.51), 9),
        (int(w * 0.52), int(h * 0.60), 6),  (int(w * 0.50), int(h * 0.25), 8)
    ]
    add_soundings(draw, soundings)
    
    draw_compass_rose(draw, int(w * 0.20), int(h * 0.20), radius=55)
    add_coordinate_grid(draw, w, h)
    add_vintage_border(draw, w, h, "SYDNEY HARBOUR", "PORT JACKSON & FLEET ANCHORAGE", "MAP NO. P8")
    
    base.save('app/assets/maps/map_p8_sydney_harbor.jpg', quality=95)
    print("Built Sydney Harbor chart: app/assets/maps/map_p8_sydney_harbor.jpg (896x1200)")

if __name__ == '__main__':
    build_panama_canal_map()
    build_oregon_map()
    build_aleutians_map()
    build_sydney_harbor_map()
