import os
import numpy as np
import cv2
from scipy.ndimage import gaussian_filter

OUT_DIR = 'images/counters/realistic'
os.makedirs(OUT_DIR, exist_ok=True)

def render_phong(height_map, base_rgb, light_dir=np.array([-0.55, -0.65, 0.75]),
                 spec_power=32.0, spec_strength=0.6, amb=0.40, diff_strength=0.60):
    h, w = height_map.shape
    light_dir = light_dir / np.linalg.norm(light_dir)
    view_dir = np.array([0.0, 0.0, 1.0])
    half_vec = (light_dir + view_dir) / np.linalg.norm(light_dir + view_dir)
    
    gy, gx = np.gradient(height_map.astype(np.float32))
    scale = 2.5
    normals = np.stack([-gx * scale, -gy * scale, np.ones((h, w), dtype=np.float32)], axis=2)
    norm = np.linalg.norm(normals, axis=2, keepdims=True)
    norm[norm == 0] = 1.0
    normals /= norm
    
    n_dot_l = np.clip(np.sum(normals * light_dir, axis=2), 0.0, 1.0)
    n_dot_h = np.clip(np.sum(normals * half_vec, axis=2), 0.0, 1.0)
    specular = (n_dot_h ** spec_power) * spec_strength * 255.0
    diffuse = amb + diff_strength * n_dot_l
    
    shaded_rgb = np.clip(base_rgb.astype(np.float32) * diffuse[:, :, None] + specular[:, :, None], 0, 255).astype(np.uint8)
    return shaded_rgb

def generate_naval_pressure_gauge(size=360):
    # Authentic analog submarine depth / flooding pressure gauge with bronze bezel
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    r_outer = size // 2 - 12
    r_bezel_inner = r_outer - 28
    r_dial = r_bezel_inner - 6
    
    y, x = np.ogrid[:size, :size]
    d2 = (x - cx)**2 + (y - cy)**2
    dist = np.sqrt(d2)
    
    # Outer Bezel (Heavily curved bronze/brass)
    bezel_mask = (dist <= r_outer) & (dist >= r_bezel_inner)
    hmap[bezel_mask] = np.sin((r_outer - dist[bezel_mask]) / (r_outer - r_bezel_inner) * np.pi) * 35.0
    # Bronze/brass base color
    rgb[bezel_mask] = [185, 145, 75]
    alpha[dist <= r_outer] = 255
    
    # Bezel bolts/rivets (8 rivets)
    for a in np.linspace(0, 2*np.pi, 8, endpoint=False):
        bx = int(cx + (r_outer - 14) * np.cos(a))
        by = int(cy + (r_outer - 14) * np.sin(a))
        bdist = np.sqrt((x - bx)**2 + (y - by)**2)
        bmask = bdist <= 6
        hmap[bmask] += np.cos(bdist[bmask] / 6.0 * (np.pi/2)) * 15.0
        rgb[bmask] = [215, 175, 95]
        
    # Dial face (Aged naval white enamel)
    dial_mask = dist < r_bezel_inner
    hmap[dial_mask] = 8.0
    # Aged warm ivory
    rgb[dial_mask] = [242, 238, 225]
    
    # Graduations and arc (Deep naval blue/black)
    for deg in range(-140, 141, 10):
        rad = np.radians(deg - 90)
        len_tick = 14 if (deg % 30 == 0) else 8
        r0 = r_dial - len_tick
        r1 = r_dial
        x0, y0 = int(cx + r0 * np.cos(rad)), int(cy + r0 * np.sin(rad))
        x1, y1 = int(cx + r1 * np.cos(rad)), int(cy + r1 * np.sin(rad))
        thick = 3 if (deg % 30 == 0) else 1
        cv2.line(rgb, (x0, y0), (x1, y1), (30, 45, 65), thick, cv2.LINE_AA)
        
    # Inner water level wash (Bottom half tinted aquatic deep blue)
    water_y = cy + 15
    water_mask = dial_mask & (y > water_y)
    rgb[water_mask] = np.clip(rgb[water_mask].astype(np.float32) * [0.65, 0.82, 0.95], 0, 255).astype(np.uint8)
    
    # Gauge Needle (Red painted steel pointing to warning zone)
    needle_rad = np.radians(45 - 90)
    nx = int(cx + (r_dial - 18) * np.cos(needle_rad))
    ny = int(cy + (r_dial - 18) * np.sin(needle_rad))
    cv2.line(rgb, (cx, cy), (nx, ny), (180, 30, 25), 4, cv2.LINE_AA)
    # Center brass cap
    cv2.circle(rgb, (cx, cy), 12, (200, 160, 80), -1, cv2.LINE_AA)
    cv2.circle(rgb, (cx, cy), 5, (120, 90, 40), -1, cv2.LINE_AA)
    hmap[dist <= 12] += 18.0
    
    shaded = render_phong(hmap, rgb, spec_power=28.0, spec_strength=0.7)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_naval_pressure_gauge.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_hull_stress_dial(size=360):
    # Industrial hull compression / stress dial with warning arc and cracked glass
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    r_outer = size // 2 - 12
    r_bezel_inner = r_outer - 26
    r_dial = r_bezel_inner - 6
    
    y, x = np.ogrid[:size, :size]
    dist = np.sqrt((x - cx)**2 + (y - cy)**2)
    
    # Outer Bezel: Heavy gunmetal / cast iron
    bezel_mask = (dist <= r_outer) & (dist >= r_bezel_inner)
    hmap[bezel_mask] = np.sin((r_outer - dist[bezel_mask]) / (r_outer - r_bezel_inner) * np.pi) * 32.0
    rgb[bezel_mask] = [75, 80, 88]
    alpha[dist <= r_outer] = 255
    
    # Rivets
    for a in np.linspace(0, 2*np.pi, 6, endpoint=False):
        bx = int(cx + (r_outer - 13) * np.cos(a))
        by = int(cy + (r_outer - 13) * np.sin(a))
        bdist = np.sqrt((x - bx)**2 + (y - by)**2)
        bmask = bdist <= 6
        hmap[bmask] += 16.0
        rgb[bmask] = [120, 125, 135]
        
    # Dial Face: Aged zinc / cream
    dial_mask = dist < r_bezel_inner
    hmap[dial_mask] = 8.0
    rgb[dial_mask] = [238, 232, 222]
    
    # Red Warning Zone (Rupture Danger) from 30 deg to 140 deg
    for deg in range(30, 141):
        rad = np.radians(deg - 90)
        p0 = (int(cx + (r_dial - 16) * np.cos(rad)), int(cy + (r_dial - 16) * np.sin(rad)))
        p1 = (int(cx + r_dial * np.cos(rad)), int(cy + r_dial * np.sin(rad)))
        cv2.line(rgb, p0, p1, (210, 50, 40), 3, cv2.LINE_AA)
        
    # Ticks
    for deg in range(-140, 141, 10):
        rad = np.radians(deg - 90)
        len_t = 12 if (deg % 30 == 0) else 6
        p0 = (int(cx + (r_dial - len_t) * np.cos(rad)), int(cy + (r_dial - len_t) * np.sin(rad)))
        p1 = (int(cx + r_dial * np.cos(rad)), int(cy + r_dial * np.sin(rad)))
        cv2.line(rgb, p0, p1, (40, 45, 50), 2 if deg % 30 == 0 else 1, cv2.LINE_AA)
        
    # Submarine Hull Needle pointing deep in the red zone
    n_rad = np.radians(110 - 90)
    nx = int(cx + (r_dial - 16) * np.cos(n_rad))
    ny = int(cy + (r_dial - 16) * np.sin(n_rad))
    cv2.line(rgb, (cx, cy), (nx, ny), (180, 20, 20), 4, cv2.LINE_AA)
    
    # Center heavy hub
    cv2.circle(rgb, (cx, cy), 13, (90, 95, 105), -1, cv2.LINE_AA)
    cv2.circle(rgb, (cx, cy), 6, (40, 45, 50), -1, cv2.LINE_AA)
    hmap[dist <= 13] += 16.0
    
    # Cracked Glass overlay
    cv2.line(rgb, (cx - 50, cy - 80), (cx + 20, cy - 20), (255, 255, 255), 1, cv2.LINE_AA)
    cv2.line(rgb, (cx + 20, cy - 20), (cx + 60, cy + 40), (255, 255, 255), 1, cv2.LINE_AA)
    cv2.line(rgb, (cx + 20, cy - 20), (cx + 80, cy - 50), (255, 255, 255), 1, cv2.LINE_AA)
    
    shaded = render_phong(hmap, rgb, spec_power=30.0, spec_strength=0.75)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_hull_stress_dial.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_order_golden_kite(size=360):
    # Order of the Golden Kite (Kinshi Kunsho) military enamel medal
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    
    # 1. Red & White Ribbon on top
    ribbon_w = 110
    ribbon_h = 90
    rx0, ry0 = cx - ribbon_w // 2, 25
    cv2.rectangle(rgb, (rx0, ry0), (rx0 + ribbon_w, ry0 + ribbon_h), (45, 110, 75), -1) # Imperial green ribbon
    cv2.rectangle(rgb, (rx0 + 20, ry0), (rx0 + ribbon_w - 20, ry0 + ribbon_h), (220, 220, 220), -1) # White center
    cv2.rectangle(rgb, (rx0 + 40, ry0), (rx0 + ribbon_w - 40, ry0 + ribbon_h), (180, 30, 30), -1) # Crimson red
    alpha[ry0:ry0+ribbon_h, rx0:rx0+ribbon_w] = 255
    hmap[ry0:ry0+ribbon_h, rx0:rx0+ribbon_w] = 12.0
    
    # 2. Eight-pointed starburst / red enamel rays
    ray_cy = cy + 35
    for a in np.linspace(0, 2*np.pi, 16, endpoint=False):
        r_tip = 110
        r_base = 35
        p_tip = (int(cx + r_tip * np.cos(a)), int(ray_cy + r_tip * np.sin(a)))
        p_l = (int(cx + r_base * np.cos(a - 0.2)), int(ray_cy + r_base * np.sin(a - 0.2)))
        p_r = (int(cx + r_base * np.cos(a + 0.2)), int(ray_cy + r_base * np.sin(a + 0.2)))
        pts = np.array([p_tip, p_l, p_r], dtype=np.int32)
        color = (195, 30, 35) if (int(np.degrees(a)) % 45 == 0) else (225, 185, 65)
        cv2.fillPoly(rgb, [pts], color)
        cv2.fillPoly(alpha, [pts], 255)
        
    y, x = np.ogrid[:size, :size]
    ray_dist = np.sqrt((x - cx)**2 + (y - ray_cy)**2)
    hmap[ray_dist <= 110] = np.maximum(hmap[ray_dist <= 110], (110 - ray_dist[ray_dist <= 110]) * 0.25)
    
    # 3. Golden Kite (Eagle/Falcon) Relief in Center
    kite_pts = np.array([
        (cx, ray_cy - 48), # Beak
        (cx + 18, ray_cy - 35), (cx + 52, ray_cy - 20), (cx + 70, ray_cy + 10), # Right wingtip
        (cx + 42, ray_cy + 15), (cx + 25, ray_cy + 30), (cx + 14, ray_cy + 52), # Right tail
        (cx, ray_cy + 42), # Tail center
        (cx - 14, ray_cy + 52), (cx - 25, ray_cy + 30), (cx - 42, ray_cy + 15),
        (cx - 70, ray_cy + 10), (cx - 52, ray_cy - 20), (cx - 18, ray_cy - 35) # Left wingtip
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [kite_pts], (235, 195, 75))
    cv2.fillPoly(alpha, [kite_pts], 255)
    
    mask_kite = np.zeros((size, size), dtype=np.uint8)
    cv2.fillPoly(mask_kite, [kite_pts], 255)
    hmap[mask_kite > 0] += 26.0
    hmap = gaussian_filter(hmap, sigma=1.5)
    
    shaded = render_phong(hmap, rgb, spec_power=35.0, spec_strength=0.9, amb=0.45)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_order_golden_kite.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_long_lance_torpedo(size=360):
    # Shaded steel and bronze Type 93 / Type 95 Long Lance submarine torpedo
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    # Torpedo spans horizontally
    t_w = 280
    t_h = 58
    x0 = (size - t_w) // 2
    y0 = cy - t_h // 2
    
    # Warhead (Dark burnished steel ellipse at left)
    wh_w = 70
    cv2.ellipse(rgb, (x0 + wh_w // 2, cy), (wh_w // 2, t_h // 2), 0, 90, 270, (45, 52, 60), -1)
    cv2.ellipse(alpha, (x0 + wh_w // 2, cy), (wh_w // 2, t_h // 2), 0, 90, 270, 255, -1)
    
    # Body cylinder (Shaded steel / oxygen flask)
    cv2.rectangle(rgb, (x0 + wh_w // 2, y0), (x0 + t_w - 55, y0 + t_h), (95, 110, 125), -1)
    cv2.rectangle(alpha, (x0 + wh_w // 2, y0), (x0 + t_w - 55, y0 + t_h), 255, -1)
    
    # Afterbody & Tail Cone (Tapers down to tail)
    tail_pts = np.array([
        (x0 + t_w - 55, y0), (x0 + t_w - 18, cy - 10), (x0 + t_w - 18, cy + 10), (x0 + t_w - 55, y0 + t_h)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [tail_pts], (85, 95, 105))
    cv2.fillPoly(alpha, [tail_pts], 255)
    
    # Dual Contra-rotating Propellers (Brass)
    for px in [x0 + t_w - 14, x0 + t_w - 6]:
        cv2.line(rgb, (px, cy - 24), (px, cy + 24), (205, 160, 65), 5, cv2.LINE_AA)
        cv2.line(alpha, (px, cy - 24), (px, cy + 24), 255, 5, cv2.LINE_AA)
        
    # Tail fins (Cross fins)
    cv2.line(rgb, (x0 + t_w - 45, cy - 32), (x0 + t_w - 20, cy - 10), (60, 70, 80), 4, cv2.LINE_AA)
    cv2.line(rgb, (x0 + t_w - 45, cy + 32), (x0 + t_w - 20, cy + 10), (60, 70, 80), 4, cv2.LINE_AA)
    cv2.line(alpha, (x0 + t_w - 45, cy - 32), (x0 + t_w - 20, cy - 10), 255, 4, cv2.LINE_AA)
    cv2.line(alpha, (x0 + t_w - 45, cy + 32), (x0 + t_w - 20, cy + 10), 255, 4, cv2.LINE_AA)
    
    # Cylindrical heightmap for realistic metallic specular sheen
    y_grid = np.arange(size)[:, None]
    dy = np.abs(y_grid - cy).astype(np.float32)
    dy_2d = np.repeat(dy, size, axis=1)
    cyl_mask = (alpha > 0)
    hmap[cyl_mask] = np.sqrt(np.maximum(0.0, (t_h / 2.0)**2 - dy_2d[cyl_mask]**2)) * 1.5
    
    # Body panel seams
    for sx in [x0 + wh_w // 2, x0 + 120, x0 + 175, x0 + t_w - 55]:
        cv2.line(rgb, (sx, y0), (sx, y0 + t_h), (35, 40, 48), 2, cv2.LINE_AA)
        
    shaded = render_phong(hmap, rgb, spec_power=36.0, spec_strength=0.85, amb=0.40)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_long_lance_torpedo.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_deck_gun(size=360):
    # 14cm/40 11th Year Type naval submarine deck gun with shield and rifled barrel
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2 + 30
    
    # Deck Mount Base Pedestal
    ped_pts = np.array([(cx - 70, cy + 70), (cx + 70, cy + 70), (cx + 45, cy + 20), (cx - 45, cy + 20)], dtype=np.int32)
    cv2.fillPoly(rgb, [ped_pts], (75, 82, 92))
    cv2.fillPoly(alpha, [ped_pts], 255)
    
    # Turret Shield (Curved armored plate)
    shield_pts = np.array([
        (cx - 55, cy + 20), (cx + 55, cy + 20), (cx + 40, cy - 50), (cx - 40, cy - 50)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [shield_pts], (100, 110, 122))
    cv2.fillPoly(alpha, [shield_pts], 255)
    
    # Rifled Long Barrel (pointing up-right at 25 degrees)
    b_ang = np.radians(-24)
    b_len = 200
    b_thick = 16
    bx0, by0 = cx - 10, cy - 25
    bx1 = int(bx0 + b_len * np.cos(b_ang))
    by1 = int(by0 + b_len * np.sin(b_ang))
    cv2.line(rgb, (bx0, by0), (bx1, by1), (55, 62, 70), b_thick, cv2.LINE_AA)
    cv2.line(alpha, (bx0, by0), (bx1, by1), 255, b_thick, cv2.LINE_AA)
    
    # Muzzle ring
    cv2.circle(rgb, (bx1, by1), b_thick // 2 + 3, (85, 95, 105), -1, cv2.LINE_AA)
    cv2.circle(alpha, (bx1, by1), b_thick // 2 + 3, 255, -1, cv2.LINE_AA)
    
    # Recoil cylinders & Breech block
    cv2.rectangle(rgb, (bx0 - 35, by0 - 15), (bx0 + 25, by0 + 15), (45, 50, 58), -1)
    cv2.rectangle(alpha, (bx0 - 35, by0 - 15), (bx0 + 25, by0 + 15), 255, -1)
    
    # Elevation handwheel
    cv2.circle(rgb, (cx - 25, cy), 16, (175, 140, 60), 3, cv2.LINE_AA)
    cv2.circle(alpha, (cx - 25, cy), 16, 255, 3, cv2.LINE_AA)
    
    hmap[alpha > 0] = 18.0
    hmap = gaussian_filter(hmap, sigma=2.0)
    
    shaded = render_phong(hmap, rgb, spec_power=28.0, spec_strength=0.7)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_deck_gun_140mm.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_diesel_engine(size=360):
    # Kampon naval diesel engine block with cylinder heads, manifold pipes, and flywheel
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2 + 15
    
    # Main Engine Block (Heavy cast iron)
    block_w = 230
    block_h = 130
    bx0, by0 = cx - block_w // 2, cy - block_h // 2
    cv2.rectangle(rgb, (bx0, by0), (bx0 + block_w, by0 + block_h), (60, 68, 76), -1)
    cv2.rectangle(alpha, (bx0, by0), (bx0 + block_w, by0 + block_h), 255, -1)
    hmap[by0:by0+block_h, bx0:bx0+block_w] = 22.0
    
    # 6 Inline Cylinder Heads on top
    cyl_w = 30
    cyl_h = 42
    for i in range(6):
        cx_i = bx0 + 14 + i * 35
        cy_i = by0 - cyl_h + 4
        cv2.rectangle(rgb, (cx_i, cy_i), (cx_i + cyl_w, cy_i + cyl_h), (85, 96, 108), -1)
        cv2.rectangle(alpha, (cx_i, cy_i), (cx_i + cyl_w, cy_i + cyl_h), 255, -1)
        hmap[cy_i:cy_i+cyl_h, cx_i:cx_i+cyl_w] = 28.0
        # Cylinder valve covers
        cv2.circle(rgb, (cx_i + cyl_w//2, cy_i + 8), 6, (180, 145, 65), -1)
        
    # Heavy Steel Flywheel at left
    fw_cx = bx0 - 15
    fw_cy = cy
    cv2.ellipse(rgb, (fw_cx, fw_cy), (20, 85), 0, 0, 360, (45, 50, 58), -1)
    cv2.ellipse(alpha, (fw_cx, fw_cy), (20, 85), 0, 0, 360, 255, -1)
    hmap[max(0, fw_cy-85):min(size, fw_cy+85), max(0, fw_cx-20):min(size, fw_cx+20)] = 25.0
    
    # Exhaust Manifold Pipe (Bronze/copper along length)
    cv2.line(rgb, (bx0 + 15, by0 + 20), (bx0 + block_w - 15, by0 + 20), (165, 105, 55), 10, cv2.LINE_AA)
    cv2.line(alpha, (bx0 + 15, by0 + 20), (bx0 + block_w - 15, by0 + 20), 255, 10, cv2.LINE_AA)
    
    hmap = gaussian_filter(hmap, sigma=1.8)
    shaded = render_phong(hmap, rgb, spec_power=26.0, spec_strength=0.65)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_diesel_engine.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_periscope_optics(size=360):
    # Reticulated optical submarine periscope crosshair lens with range graduation marks
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    r_outer = size // 2 - 15
    r_inner = r_outer - 24
    
    y, x = np.ogrid[:size, :size]
    dist = np.sqrt((x - cx)**2 + (y - cy)**2)
    
    # Outer brass / bronze periscope collar
    collar_mask = (dist <= r_outer) & (dist >= r_inner)
    hmap[collar_mask] = 25.0
    rgb[collar_mask] = [175, 138, 70]
    alpha[dist <= r_outer] = 255
    
    # Lens Glass (Subtle coated green/blue optic reflection)
    lens_mask = dist < r_inner
    hmap[lens_mask] = 10.0
    rgb[lens_mask] = [228, 238, 235]
    
    # Reticle Crosshairs (Thin optical lines)
    cv2.line(rgb, (cx - r_inner + 10, cy), (cx + r_inner - 10, cy), (35, 45, 55), 2, cv2.LINE_AA)
    cv2.line(rgb, (cx, cy - r_inner + 10), (cx, cy + r_inner - 10), (35, 45, 55), 2, cv2.LINE_AA)
    
    # Range graduation marks (Mils scale)
    for tick_x in np.arange(cx - 100, cx + 101, 20):
        if tick_x != cx:
            cv2.line(rgb, (int(tick_x), cy - 6), (int(tick_x), cy + 6), (35, 45, 55), 1, cv2.LINE_AA)
    for tick_y in np.arange(cy - 100, cy + 101, 20):
        if tick_y != cy:
            cv2.line(rgb, (cx - 6, int(tick_y)), (cx + 6, int(tick_y)), (35, 45, 55), 1, cv2.LINE_AA)
            
    # Range stadia rings
    cv2.circle(rgb, (cx, cy), 50, (65, 80, 95), 1, cv2.LINE_AA)
    cv2.circle(rgb, (cx, cy), 95, (65, 80, 95), 1, cv2.LINE_AA)
    
    shaded = render_phong(hmap, rgb, spec_power=32.0, spec_strength=0.7)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_periscope_optics.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_hydrophone_sonar(size=360):
    # Acoustic hydrophone sonar sensor with concentric listening pulses
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2 + 40
    
    # Hydrophone Bronze Dome at bottom
    cv2.ellipse(rgb, (cx, cy), (75, 45), 0, 0, 360, (185, 142, 65), -1)
    cv2.ellipse(alpha, (cx, cy), (75, 45), 0, 0, 360, 255, -1)
    
    # Concentric Acoustic Waves expanding upwards
    for r in [70, 110, 150, 190]:
        cv2.ellipse(rgb, (cx, cy), (r, r), 0, 205, 335, (65, 125, 175), 5, cv2.LINE_AA)
        cv2.ellipse(alpha, (cx, cy), (r, r), 0, 205, 335, 255, 5, cv2.LINE_AA)
        
    hmap[alpha > 0] = 20.0
    hmap = gaussian_filter(hmap, sigma=1.5)
    
    shaded = render_phong(hmap, rgb, spec_power=28.0, spec_strength=0.65)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_hydrophone_sonar.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_captain_portrait(size=360):
    # Imperial Japanese Naval Submarine Commander Portrait with peaked cap and gold anchor insignia
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    
    # Naval Service Jacket Shoulders
    body_pts = np.array([
        (cx - 120, size - 20), (cx + 120, size - 20), (cx + 85, cy + 50), (cx - 85, cy + 50)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [body_pts], (32, 42, 54)) # Deep IJN Navy Blue
    cv2.fillPoly(alpha, [body_pts], 255)
    
    # Collar & Gold Cherry Blossom / Anchor rank badges
    cv2.rectangle(rgb, (cx - 28, cy + 42), (cx + 28, cy + 78), (240, 235, 225), -1) # White shirt/cravat
    cv2.circle(rgb, (cx - 45, cy + 62), 8, (215, 175, 65), -1) # Gold badge left
    cv2.circle(rgb, (cx + 45, cy + 62), 8, (215, 175, 65), -1) # Gold badge right
    
    # Face (Chiseled jaw)
    face_pts = np.array([
        (cx - 36, cy - 25), (cx + 36, cy - 25), (cx + 30, cy + 35), (cx, cy + 50), (cx - 30, cy + 35)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [face_pts], (225, 185, 150))
    cv2.fillPoly(alpha, [face_pts], 255)
    
    # Imperial Naval Officer Peaked Cap
    cap_top_pts = np.array([
        (cx - 75, cy - 55), (cx + 75, cy - 55), (cx + 90, cy - 95), (cx, cy - 110), (cx - 90, cy - 95)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [cap_top_pts], (245, 245, 245)) # IJN White Summer Cap Cover
    cv2.fillPoly(alpha, [cap_top_pts], 255)
    
    # Black Cap Band with Gold Oak Leaves & Cherry Blossom / Anchor Emblem
    cv2.rectangle(rgb, (cx - 75, cy - 55), (cx + 75, cy - 35), (25, 28, 35), -1)
    cv2.circle(rgb, (cx, cy - 45), 10, (225, 185, 65), -1) # Gold imperial emblem
    
    # Polished Black Visor (Patent leather with specular highlight)
    visor_pts = np.array([
        (cx - 65, cy - 35), (cx + 65, cy - 35), (cx + 45, cy - 18), (cx - 45, cy - 18)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [visor_pts], (20, 22, 26))
    cv2.fillPoly(alpha, [visor_pts], 255)
    
    hmap[alpha > 0] = 20.0
    hmap = gaussian_filter(hmap, sigma=1.8)
    
    shaded = render_phong(hmap, rgb, spec_power=26.0, spec_strength=0.6)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_captain_portrait.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

def generate_watertight_door(size=360):
    # Circular submarine watertight bulkhead hatch with locking dogs and handwheel
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    
    cx, cy = size // 2, size // 2
    r_outer = size // 2 - 15
    r_door = r_outer - 25
    
    y, x = np.ogrid[:size, :size]
    dist = np.sqrt((x - cx)**2 + (y - cy)**2)
    
    # Outer Steel Bulkhead Frame
    frame_mask = (dist <= r_outer) & (dist >= r_door)
    hmap[frame_mask] = 22.0
    rgb[frame_mask] = [70, 78, 88]
    alpha[dist <= r_outer] = 255
    
    # Steel Hatch Door
    door_mask = dist < r_door
    hmap[door_mask] = 16.0
    rgb[door_mask] = [105, 115, 128]
    
    # 8 Locking Dogs / Latches around perimeter
    for a in np.linspace(0, 2*np.pi, 8, endpoint=False):
        dx0 = int(cx + (r_door - 14) * np.cos(a))
        dy0 = int(cy + (r_door - 14) * np.sin(a))
        dx1 = int(cx + (r_door + 12) * np.cos(a))
        dy1 = int(cy + (r_door + 12) * np.sin(a))
        cv2.line(rgb, (dx0, dy0), (dx1, dy1), (195, 155, 65), 7, cv2.LINE_AA) # Heavy brass dog
        
    # Central Handwheel for dogging the hatch
    cv2.circle(rgb, (cx, cy), 48, (185, 145, 60), 8, cv2.LINE_AA) # Brass wheel rim
    for a in np.linspace(0, 2*np.pi, 4, endpoint=False): # 4 Spokes
        sx = int(cx + 46 * np.cos(a))
        sy = int(cy + 46 * np.sin(a))
        cv2.line(rgb, (cx, cy), (sx, sy), (185, 145, 60), 6, cv2.LINE_AA)
    cv2.circle(rgb, (cx, cy), 14, (60, 68, 76), -1, cv2.LINE_AA) # Center hub
    
    hmap = gaussian_filter(hmap, sigma=1.8)
    shaded = render_phong(hmap, rgb, spec_power=28.0, spec_strength=0.7)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    cv2.imwrite(os.path.join(OUT_DIR, 'counter_watertight_door.png'), cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))

if __name__ == '__main__':
    print("Generating suite of photorealistic counter art...")
    generate_naval_pressure_gauge()
    generate_hull_stress_dial()
    generate_order_golden_kite()
    generate_long_lance_torpedo()
    generate_deck_gun()
    generate_diesel_engine()
    generate_periscope_optics()
    generate_hydrophone_sonar()
    generate_captain_portrait()
    generate_watertight_door()
    print("All photorealistic counter art successfully generated in:", OUT_DIR)
