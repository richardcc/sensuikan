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

def save_counter(name, hmap, rgb, alpha, spec_power=28.0, spec_strength=0.65):
    hmap = gaussian_filter(hmap, sigma=1.5)
    shaded = render_phong(hmap, rgb, spec_power=spec_power, spec_strength=spec_strength)
    rgba = cv2.cvtColor(shaded, cv2.COLOR_RGB2RGBA)
    rgba[:, :, 3] = alpha
    p = os.path.join(OUT_DIR, f'{name}.png')
    cv2.imwrite(p, cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
    print(f'  Generated: {name}.png')

# 1. XO (Executive Officer / Segundo de a Bordo)
def generate_xo_portrait(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Body (Navy Blue Service Tunic)
    body_pts = np.array([(cx - 110, size - 15), (cx + 110, size - 15), (cx + 80, cy + 45), (cx - 80, cy + 45)], dtype=np.int32)
    cv2.fillPoly(rgb, [body_pts], (34, 44, 56))
    cv2.fillPoly(alpha, [body_pts], 255)
    
    # Head & Cap (Turned slightly left, looking through binoculars)
    cv2.ellipse(rgb, (cx, cy - 20), (38, 48), 0, 0, 360, (222, 182, 145), -1)
    cv2.ellipse(alpha, (cx, cy - 20), (38, 48), 0, 0, 360, 255, -1)
    
    # Naval Cap
    cap_top = np.array([(cx - 70, cy - 50), (cx + 70, cy - 50), (cx + 85, cy - 90), (cx, cy - 105), (cx - 85, cy - 90)], dtype=np.int32)
    cv2.fillPoly(rgb, [cap_top], (242, 242, 242))
    cv2.fillPoly(alpha, [cap_top], 255)
    cv2.rectangle(rgb, (cx - 70, cy - 50), (cx + 70, cy - 32), (24, 26, 32), -1)
    cv2.circle(rgb, (cx, cy - 41), 9, (215, 175, 65), -1) # Gold anchor badge
    
    # Brass Marine Binoculars held in front
    b_y = cy + 5
    cv2.circle(rgb, (cx - 26, b_y), 20, (185, 145, 65), -1)
    cv2.circle(rgb, (cx + 26, b_y), 20, (185, 145, 65), -1)
    cv2.circle(rgb, (cx - 26, b_y), 15, (40, 55, 70), -1) # Optical lens
    cv2.circle(rgb, (cx + 26, b_y), 15, (40, 55, 70), -1)
    cv2.line(rgb, (cx - 10, b_y), (cx + 10, b_y), (145, 110, 45), 6, cv2.LINE_AA) # Bridge
    cv2.circle(alpha, (cx - 26, b_y), 20, 255, -1)
    cv2.circle(alpha, (cx + 26, b_y), 20, 255, -1)
    
    hmap[alpha > 0] = 18.0
    hmap[b_y-20:b_y+20, cx-46:cx+46] += 12.0
    save_counter('counter_xo_portrait', hmap, rgb, alpha)

# 2. Engineer (Chief Engineer / Jefe de Máquinas)
def generate_engineer_portrait(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Body (Work tunic with leather apron / coveralls)
    body_pts = np.array([(cx - 110, size - 15), (cx + 110, size - 15), (cx + 80, cy + 45), (cx - 80, cy + 45)], dtype=np.int32)
    cv2.fillPoly(rgb, [body_pts], (48, 55, 62))
    cv2.fillPoly(alpha, [body_pts], 255)
    
    # Head & Engineer Field Cap
    cv2.ellipse(rgb, (cx, cy - 20), (36, 46), 0, 0, 360, (218, 178, 140), -1)
    cv2.ellipse(alpha, (cx, cy - 20), (36, 46), 0, 0, 360, 255, -1)
    # Khaki naval work cap
    cap_pts = np.array([(cx - 65, cy - 42), (cx + 65, cy - 42), (cx + 70, cy - 80), (cx, cy - 95), (cx - 70, cy - 80)], dtype=np.int32)
    cv2.fillPoly(rgb, [cap_pts], (155, 135, 105))
    cv2.fillPoly(alpha, [cap_pts], 255)
    cv2.circle(rgb, (cx, cy - 60), 7, (200, 160, 50), -1)
    
    # Crossed Steel Wrench & Brass Gear in front
    # Brass Gear behind wrench
    cv2.circle(rgb, (cx + 35, cy + 30), 32, (185, 145, 65), -1)
    cv2.circle(rgb, (cx + 35, cy + 30), 14, (48, 55, 62), -1)
    cv2.circle(alpha, (cx + 35, cy + 30), 32, 255, -1)
    # Heavy Steel Wrench
    w_pts = np.array([(cx - 65, cy + 65), (cx + 45, cy - 15)], dtype=np.int32)
    cv2.line(rgb, tuple(w_pts[0]), tuple(w_pts[1]), (130, 140, 150), 12, cv2.LINE_AA)
    cv2.line(alpha, tuple(w_pts[0]), tuple(w_pts[1]), 255, 12, cv2.LINE_AA)
    # Wrench open jaw at top
    cv2.circle(rgb, (cx - 65, cy + 65), 16, (130, 140, 150), -1)
    cv2.circle(rgb, (cx - 65, cy + 65), 8, (48, 55, 62), -1)
    cv2.circle(alpha, (cx - 65, cy + 65), 16, 255, -1)
    
    hmap[alpha > 0] = 18.0
    save_counter('counter_engineer_portrait', hmap, rgb, alpha)

# 3. Navigator (Oficial de Derrota) with Marine Sextant
def generate_navigator_portrait(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Brass Nautical Sextant in center
    # Arc of the sextant
    cv2.ellipse(rgb, (cx, cy - 40), (120, 120), 0, 45, 135, (195, 155, 65), 16, cv2.LINE_AA)
    cv2.ellipse(alpha, (cx, cy - 40), (120, 120), 0, 45, 135, 255, 16, cv2.LINE_AA)
    # Silver vernier scale
    cv2.ellipse(rgb, (cx, cy - 40), (116, 116), 0, 48, 132, (230, 230, 235), 4, cv2.LINE_AA)
    # Frame Arms
    p_top = (cx, cy - 40)
    p_l = (int(cx + 120 * np.cos(np.radians(135))), int(cy - 40 + 120 * np.sin(np.radians(135))))
    p_r = (int(cx + 120 * np.cos(np.radians(45))), int(cy - 40 + 120 * np.sin(np.radians(45))))
    cv2.line(rgb, p_top, p_l, (175, 135, 55), 10, cv2.LINE_AA)
    cv2.line(rgb, p_top, p_r, (175, 135, 55), 10, cv2.LINE_AA)
    cv2.line(alpha, p_top, p_l, 255, 10, cv2.LINE_AA)
    cv2.line(alpha, p_top, p_r, 255, 10, cv2.LINE_AA)
    # Index Arm & Mirror
    cv2.line(rgb, p_top, (cx, cy + 80), (195, 155, 65), 12, cv2.LINE_AA)
    cv2.line(alpha, p_top, (cx, cy + 80), 255, 12, cv2.LINE_AA)
    # Telescope Tube
    cv2.line(rgb, (cx - 40, cy - 10), (cx + 50, cy - 10), (70, 80, 90), 14, cv2.LINE_AA)
    cv2.line(alpha, (cx - 40, cy - 10), (cx + 50, cy - 10), 255, 14, cv2.LINE_AA)
    
    hmap[alpha > 0] = 22.0
    save_counter('counter_navigator_portrait', hmap, rgb, alpha)

# 4. Medic (Medical Officer / Médico)
def generate_medic_portrait(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Red Cross on White Enamel Shield
    # Shield shape
    sh_pts = np.array([(cx - 95, cy - 110), (cx + 95, cy - 110), (cx + 95, cy + 20), (cx, cy + 120), (cx - 95, cy + 20)], dtype=np.int32)
    cv2.fillPoly(rgb, [sh_pts], (245, 245, 248))
    cv2.fillPoly(alpha, [sh_pts], 255)
    # Gold Beveled Border
    cv2.polylines(rgb, [sh_pts], True, (195, 155, 65), 12, cv2.LINE_AA)
    
    # Geneva Red Cross in center
    arm_w = 40
    arm_l = 85
    cv2.rectangle(rgb, (cx - arm_w//2, cy - arm_l), (cx + arm_w//2, cy + arm_l), (195, 25, 30), -1)
    cv2.rectangle(rgb, (cx - arm_l, cy - arm_w//2), (cx + arm_l, cy + arm_w//2), (195, 25, 30), -1)
    
    # Naval Anchor behind cross
    cv2.circle(rgb, (cx, cy - 100), 16, (195, 155, 65), 5, cv2.LINE_AA)
    
    hmap[alpha > 0] = 16.0
    mask_cross = (rgb[:, :, 0] > 160) & (rgb[:, :, 2] < 50)
    hmap[mask_cross] += 12.0
    save_counter('counter_medic_portrait', hmap, rgb, alpha)

# 5. Sailors Crew Trio (Tripulación de Cubierta y Torpedos)
def generate_sailors_crew(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # 3 Sailors silhouettes with IJN sailor caps and life vests
    for offset_x, offset_y, scale in [(-75, 25, 0.85), (75, 25, 0.85), (0, -15, 1.0)]:
        scx = cx + offset_x
        scy = cy + offset_y
        # Kapok Life Vest (Orange/brown)
        cv2.rectangle(rgb, (int(scx - 45*scale), int(scy + 20*scale)), (int(scx + 45*scale), size - 10), (185, 95, 45), -1)
        cv2.rectangle(alpha, (int(scx - 45*scale), int(scy + 20*scale)), (int(scx + 45*scale), size - 10), 255, -1)
        # Head
        cv2.ellipse(rgb, (scx, int(scy - 20*scale)), (int(26*scale), int(34*scale)), 0, 0, 360, (215, 175, 140), -1)
        cv2.ellipse(alpha, (scx, int(scy - 20*scale)), (int(26*scale), int(34*scale)), 0, 0, 360, 255, -1)
        # IJN Sailor Round Cap with ribbon
        cv2.ellipse(rgb, (scx, int(scy - 42*scale)), (int(36*scale), int(14*scale)), 0, 0, 360, (245, 245, 245), -1)
        cv2.ellipse(alpha, (scx, int(scy - 42*scale)), (int(36*scale), int(14*scale)), 0, 0, 360, 255, -1)
        cv2.rectangle(rgb, (int(scx - 34*scale), int(scy - 40*scale)), (int(scx + 34*scale), int(scy - 32*scale)), (25, 28, 35), -1)
        
    hmap[alpha > 0] = 18.0
    save_counter('counter_sailors_crew', hmap, rgb, alpha)

# 6. Twin Torpedoes Rack (Rld Fwd / Rld Aft)
def generate_twin_torpedoes_rack(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # 2 Torpedoes stacked on storage cradle
    for ty in [cy - 50, cy + 50]:
        # Warhead
        cv2.ellipse(rgb, (cx - 100, ty), (35, 22), 0, 90, 270, (48, 55, 62), -1)
        cv2.ellipse(alpha, (cx - 100, ty), (35, 22), 0, 90, 270, 255, -1)
        # Steel Body
        cv2.rectangle(rgb, (cx - 100, ty - 22), (cx + 90, ty + 22), (95, 110, 125), -1)
        cv2.rectangle(alpha, (cx - 100, ty - 22), (cx + 90, ty + 22), 255, -1)
        # Tail cone
        tail = np.array([(cx + 90, ty - 22), (cx + 125, ty - 8), (cx + 125, ty + 8), (cx + 90, ty + 22)], dtype=np.int32)
        cv2.fillPoly(rgb, [tail], (75, 85, 95))
        cv2.fillPoly(alpha, [tail], 255)
        # Brass Propellers
        cv2.line(rgb, (cx + 128, ty - 18), (cx + 128, ty + 18), (195, 155, 65), 5, cv2.LINE_AA)
        cv2.line(alpha, (cx + 128, ty - 18), (cx + 128, ty + 18), 255, 5, cv2.LINE_AA)
        
    # Vertical Chain Hoist & Loading Cradle Straps
    for sx in [cx - 45, cx + 45]:
        cv2.line(rgb, (sx, 20), (sx, size - 20), (165, 130, 60), 8, cv2.LINE_AA) # Bronze hoist chains
        cv2.line(alpha, (sx, 20), (sx, size - 20), 255, 8, cv2.LINE_AA)
        
    hmap[alpha > 0] = 22.0
    save_counter('counter_twin_torpedoes_rack', hmap, rgb, alpha)

# 7. Naval Artillery Shell (Ammo)
def generate_artillery_shell(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2 + 10
    
    # Heavy 140mm Cartridge Case (Polished Brass)
    case_w = 70
    case_h = 160
    cv2.rectangle(rgb, (cx - case_w//2, cy - 40), (cx + case_w//2, cy + case_h), (215, 175, 75), -1)
    cv2.rectangle(alpha, (cx - case_w//2, cy - 40), (cx + case_w//2, cy + case_h), 255, -1)
    # Rim base
    cv2.rectangle(rgb, (cx - case_w//2 - 6, cy + case_h - 10), (cx + case_w//2 + 6, cy + case_h), (185, 145, 55), -1)
    cv2.rectangle(alpha, (cx - case_w//2 - 6, cy + case_h - 10), (cx + case_w//2 + 6, cy + case_h), 255, -1)
    
    # Projectile / Shell Head (Dark burnished steel with copper rotating band)
    cv2.rectangle(rgb, (cx - case_w//2 + 2, cy - 110), (cx + case_w//2 - 2, cy - 40), (60, 68, 76), -1)
    cv2.rectangle(alpha, (cx - case_w//2 + 2, cy - 110), (cx + case_w//2 - 2, cy - 40), 255, -1)
    # Copper driving band
    cv2.rectangle(rgb, (cx - case_w//2 + 2, cy - 55), (cx + case_w//2 - 2, cy - 42), (185, 95, 45), -1)
    # Ogive / Pointed ballistic cap
    ogive_pts = np.array([(cx - case_w//2 + 2, cy - 110), (cx + case_w//2 - 2, cy - 110), (cx, cy - 170)], dtype=np.int32)
    cv2.fillPoly(rgb, [ogive_pts], (45, 52, 60))
    cv2.fillPoly(alpha, [ogive_pts], 255)
    # Brass nose fuse
    cv2.circle(rgb, (cx, cy - 165), 5, (215, 175, 75), -1)
    
    hmap[alpha > 0] = 25.0
    save_counter('counter_artillery_shell', hmap, rgb, alpha, spec_power=36.0, spec_strength=0.85)

# 8. AA Autocannon (25mm Type 96 Twin)
def generate_aa_gun_25mm(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2 + 35
    
    # Pedestal Mount
    cv2.rectangle(rgb, (cx - 35, cy + 40), (cx + 35, size - 15), (65, 72, 80), -1)
    cv2.rectangle(alpha, (cx - 35, cy + 40), (cx + 35, size - 15), 255, -1)
    
    # Twin Barrels pointing up-right at 40 degrees
    ang = np.radians(-42)
    b_len = 210
    for offset in [-12, 12]:
        bx0 = int(cx + offset * np.cos(ang + np.pi/2))
        by0 = int(cy + offset * np.sin(ang + np.pi/2))
        bx1 = int(bx0 + b_len * np.cos(ang))
        by1 = int(by0 + b_len * np.sin(ang))
        cv2.line(rgb, (bx0, by0), (bx1, by1), (50, 58, 66), 8, cv2.LINE_AA)
        cv2.line(alpha, (bx0, by0), (bx1, by1), 255, 8, cv2.LINE_AA)
        # Flash hiders
        cv2.circle(rgb, (bx1, by1), 7, (80, 90, 100), -1)
        cv2.circle(alpha, (bx1, by1), 7, 255, -1)
        
    # Ribbed Magazine Drums on top
    cv2.ellipse(rgb, (cx - 20, cy - 25), (28, 16), 40, 0, 360, (40, 46, 52), -1)
    cv2.ellipse(alpha, (cx - 20, cy - 25), (28, 16), 40, 0, 360, 255, -1)
    
    hmap[alpha > 0] = 20.0
    save_counter('counter_aa_gun_25mm', hmap, rgb, alpha)

# 9. Moored Contact Mine (Mines / Mine Door)
def generate_contact_mine(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2 - 15
    r_mine = 85
    
    # Spherical Mine Body (Gunmetal / Dark cast iron)
    cv2.circle(rgb, (cx, cy), r_mine, (45, 52, 60), -1)
    cv2.circle(alpha, (cx, cy), r_mine, 255, -1)
    
    # Lead Chemical Hertz Horns radiating outwards (6 horns)
    for a in np.linspace(0, 2*np.pi, 6, endpoint=False):
        hx0 = int(cx + (r_mine - 5) * np.cos(a))
        hy0 = int(cy + (r_mine - 5) * np.sin(a))
        hx1 = int(cx + (r_mine + 35) * np.cos(a))
        hy1 = int(cy + (r_mine + 35) * np.sin(a))
        cv2.line(rgb, (hx0, hy0), (hx1, hy1), (135, 145, 155), 10, cv2.LINE_AA)
        cv2.line(alpha, (hx0, hy0), (hx1, hy1), 255, 10, cv2.LINE_AA)
        cv2.circle(rgb, (hx1, hy1), 7, (165, 175, 185), -1)
        cv2.circle(alpha, (hx1, hy1), 7, 255, -1)
        
    # Mooring Cable / Chain at bottom
    cv2.line(rgb, (cx, cy + r_mine), (cx, size - 10), (125, 130, 135), 8, cv2.LINE_AA)
    cv2.line(alpha, (cx, cy + r_mine), (cx, size - 10), 255, 8, cv2.LINE_AA)
    
    # Spherical heightmap
    y, x = np.ogrid[:size, :size]
    d2 = (x - cx)**2 + (y - cy)**2
    mask = d2 <= r_mine**2
    hmap[mask] = np.sqrt(r_mine**2 - d2[mask]) * 0.45
    hmap[alpha > 0] = np.maximum(hmap[alpha > 0], 12.0)
    
    save_counter('counter_contact_mine', hmap, rgb, alpha, spec_power=32.0, spec_strength=0.75)

# 10. Kaiten Human Torpedo (K-1..K-6)
def generate_kaiten_sub(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Kaiten Hull (Long sleek black/dark naval grey craft)
    kw = 290
    kh = 48
    x0 = cx - kw // 2
    y0 = cy - kh // 2
    
    # Warhead (1,550 kg explosive nose)
    cv2.ellipse(rgb, (x0 + 40, cy), (40, kh // 2), 0, 90, 270, (35, 40, 48), -1)
    cv2.ellipse(alpha, (x0 + 40, cy), (40, kh // 2), 0, 90, 270, 255, -1)
    
    # Main Body Tube
    cv2.rectangle(rgb, (x0 + 40, y0), (x0 + kw - 45, y0 + kh), (55, 62, 70), -1)
    cv2.rectangle(alpha, (x0 + 40, y0), (x0 + kw - 45, y0 + kh), 255, -1)
    
    # Pilot Conning Hatch & Periscope
    hatch_x = cx - 10
    cv2.rectangle(rgb, (hatch_x - 18, y0 - 24), (hatch_x + 18, y0), (35, 40, 48), -1)
    cv2.rectangle(alpha, (hatch_x - 18, y0 - 24), (hatch_x + 18, y0), 255, -1)
    cv2.line(rgb, (hatch_x + 4, y0 - 45), (hatch_x + 4, y0), (140, 145, 155), 4, cv2.LINE_AA) # Periscope
    cv2.line(alpha, (hatch_x + 4, y0 - 45), (hatch_x + 4, y0), 255, 4, cv2.LINE_AA)
    
    # Wooden Deck Saddles (Holding craft to sub deck)
    for sx in [x0 + 70, x0 + kw - 90]:
        cv2.rectangle(rgb, (sx - 8, y0 + kh), (sx + 8, y0 + kh + 22), (135, 95, 55), -1)
        cv2.rectangle(alpha, (sx - 8, y0 + kh), (sx + 8, y0 + kh + 22), 255, -1)
        
    hmap[alpha > 0] = 20.0
    save_counter('counter_kaiten_sub', hmap, rgb, alpha)

# 11. Seiran Attack Floatplane (M6A1 / Avion)
def generate_seiran_floatplane(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Top-view Aichi M6A1 Seiran in IJN Dark Green with Twin Floats
    # Fuselage
    cv2.ellipse(rgb, (cx, cy), (18, 110), 0, 0, 360, (42, 68, 52), -1)
    cv2.ellipse(alpha, (cx, cy), (18, 110), 0, 0, 360, 255, -1)
    
    # Main Wings (swept back)
    wing_pts = np.array([
        (cx - 130, cy + 10), (cx + 130, cy + 10), (cx + 115, cy - 25), (cx, cy - 35), (cx - 115, cy - 25)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [wing_pts], (48, 78, 58))
    cv2.fillPoly(alpha, [wing_pts], 255)
    
    # Red Hinomaru Roundels on Wings
    cv2.circle(rgb, (cx - 85, cy - 8), 18, (195, 30, 35), -1)
    cv2.circle(rgb, (cx + 85, cy - 8), 18, (195, 30, 35), -1)
    
    # Twin Pontoons / Floats (Light grey under wings)
    for fx in [cx - 45, cx + 45]:
        cv2.ellipse(rgb, (fx, cy + 5), (10, 85), 0, 0, 360, (185, 190, 195), -1)
        cv2.ellipse(alpha, (fx, cy + 5), (10, 85), 0, 0, 360, 255, -1)
        
    # Yellow Leading Edge ID Bands
    cv2.line(rgb, (cx - 120, cy - 25), (cx - 40, cy - 32), (225, 185, 45), 5, cv2.LINE_AA)
    cv2.line(rgb, (cx + 40, cy - 32), (cx + 120, cy - 25), (225, 185, 45), 5, cv2.LINE_AA)
    
    hmap[alpha > 0] = 18.0
    save_counter('counter_seiran_floatplane', hmap, rgb, alpha)

# 12. Supply Crates (Supplies / Cargo / Daihatsu)
def generate_supply_crates(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2 + 10
    
    # Wooden Naval Cargo Crates (Stacked in 3D isometric view)
    # Bottom Crate
    cv2.rectangle(rgb, (cx - 110, cy - 10), (cx + 40, cy + 100), (165, 120, 65), -1)
    cv2.rectangle(alpha, (cx - 110, cy - 10), (cx + 40, cy + 100), 255, -1)
    cv2.rectangle(rgb, (cx - 105, cy - 5), (cx + 35, cy + 95), (145, 105, 55), 4) # Framing
    # Top Crate
    cv2.rectangle(rgb, (cx - 20, cy - 90), (cx + 110, cy + 30), (175, 130, 75), -1)
    cv2.rectangle(alpha, (cx - 20, cy - 90), (cx + 110, cy + 30), 255, -1)
    cv2.rectangle(rgb, (cx - 15, cy - 85), (cx + 105, cy + 25), (155, 115, 65), 4)
    
    # Steel Corner Brackets & Cargo Rope Netting
    for bx, by in [(cx - 110, cy - 10), (cx + 40, cy - 10), (cx - 20, cy - 90), (cx + 110, cy - 90)]:
        cv2.rectangle(rgb, (bx - 5, by - 5), (bx + 15, by + 15), (75, 80, 85), -1)
    # Cargo tie-down ropes
    cv2.line(rgb, (cx - 90, cy - 10), (cx + 20, cy + 100), (85, 65, 45), 3, cv2.LINE_AA)
    cv2.line(rgb, (cx + 20, cy - 10), (cx - 90, cy + 100), (85, 65, 45), 3, cv2.LINE_AA)
    
    hmap[alpha > 0] = 22.0
    save_counter('counter_supply_crates', hmap, rgb, alpha)

# 13. Electric Motor (Mtr 1 / Mtr 2)
def generate_electric_motor(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    r_outer = 110
    
    # Heavy Cast Steel Motor Stator Ring
    cv2.circle(rgb, (cx, cy), r_outer, (65, 72, 82), -1)
    cv2.circle(alpha, (cx, cy), r_outer, 255, -1)
    cv2.circle(rgb, (cx, cy), r_outer - 22, (45, 50, 58), -1)
    
    # Copper Stator Windings / Poles (12 poles)
    for a in np.linspace(0, 2*np.pi, 12, endpoint=False):
        px = int(cx + (r_outer - 11) * np.cos(a))
        py = int(cy + (r_outer - 11) * np.sin(a))
        cv2.circle(rgb, (px, py), 12, (195, 115, 45), -1) # Bright copper coil
        
    # Rotor Armature & Central Steel Driveshaft
    cv2.circle(rgb, (cx, cy), 58, (110, 120, 130), -1)
    cv2.circle(rgb, (cx, cy), 22, (185, 145, 65), -1) # Brass commutator
    cv2.circle(rgb, (cx, cy), 12, (40, 45, 52), -1) # Shaft center
    
    hmap[alpha > 0] = 22.0
    save_counter('counter_electric_motor', hmap, rgb, alpha)

# 14. Battery Bank (Batt)
def generate_battery_cells(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Rows of Heavy Hard-Rubber Submarine Cells
    cw, ch = 55, 95
    for r in range(2):
        for c in range(3):
            cell_x = cx - 110 + c * 80
            cell_y = cy - 85 + r * 105
            # Black hard rubber jar
            cv2.rectangle(rgb, (cell_x, cell_y), (cell_x + cw, cell_y + ch), (32, 35, 40), -1)
            cv2.rectangle(alpha, (cell_x, cell_y), (cell_x + cw, cell_y + ch), 255, -1)
            # Inspection cap (amber glass)
            cv2.circle(rgb, (cell_x + cw//2, cell_y + 18), 8, (215, 160, 45), -1)
            
    # Heavy Copper Terminal Busbars connecting cells
    cv2.line(rgb, (cx - 90, cy - 67), (cx + 90, cy - 67), (205, 125, 45), 10, cv2.LINE_AA)
    cv2.line(rgb, (cx - 90, cy + 38), (cx + 90, cy + 38), (205, 125, 45), 10, cv2.LINE_AA)
    
    hmap[alpha > 0] = 20.0
    save_counter('counter_battery_cells', hmap, rgb, alpha)

# 15. Ballast Fuel Tank (Fuel)
def generate_fuel_tank(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Heavy Cylindrical Riveted Tank
    tw, th = 220, 140
    cv2.rectangle(rgb, (cx - tw//2, cy - th//2), (cx + tw//2, cy + th//2), (75, 85, 96), -1)
    cv2.rectangle(alpha, (cx - tw//2, cy - th//2), (cx + tw//2, cy + th//2), 255, -1)
    
    # Rivet lines along perimeter
    for rx in np.arange(cx - tw//2 + 15, cx + tw//2, 22):
        cv2.circle(rgb, (int(rx), cy - th//2 + 10), 4, (120, 130, 142), -1)
        cv2.circle(rgb, (int(rx), cy + th//2 - 10), 4, (120, 130, 142), -1)
        
    # Heavy Brass Gate Valve Handwheel in center
    cv2.circle(rgb, (cx, cy), 34, (195, 155, 65), 7, cv2.LINE_AA) # Handwheel rim
    for a in np.linspace(0, 2*np.pi, 4, endpoint=False):
        cv2.line(rgb, (cx, cy), (int(cx + 32*np.cos(a)), int(cy + 32*np.sin(a))), (195, 155, 65), 5, cv2.LINE_AA)
    cv2.circle(rgb, (cx, cy), 10, (50, 58, 66), -1)
    
    hmap[alpha > 0] = 22.0
    save_counter('counter_fuel_tank', hmap, rgb, alpha)

# 16. Radio Transmitter (Radio)
def generate_radio_transmitter(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Transmitter Panel Cabinet (IJN Grey Steel)
    cv2.rectangle(rgb, (cx - 105, cy - 95), (cx + 105, cy + 95), (55, 64, 72), -1)
    cv2.rectangle(alpha, (cx - 105, cy - 95), (cx + 105, cy + 95), 255, -1)
    
    # Frequency Tuning Dial (Circular with needle)
    cv2.circle(rgb, (cx - 45, cy - 35), 32, (235, 230, 215), -1)
    cv2.circle(rgb, (cx - 45, cy - 35), 32, (185, 145, 65), 4)
    cv2.line(rgb, (cx - 45, cy - 35), (cx - 28, cy - 50), (180, 30, 30), 3, cv2.LINE_AA)
    
    # Glowing Vacuum Tubes (2 glass tubes at right)
    for tx in [cx + 25, cx + 65]:
        cv2.ellipse(rgb, (tx, cy - 35), (14, 28), 0, 0, 360, (235, 165, 65), -1) # Warm glowing orange filament
        cv2.ellipse(rgb, (tx, cy - 35), (14, 28), 0, 0, 360, (215, 215, 220), 2)
        
    # Morse Telegraph Key at bottom
    cv2.rectangle(rgb, (cx - 60, cy + 45), (cx + 60, cy + 65), (35, 40, 46), -1)
    cv2.circle(rgb, (cx + 35, cy + 50), 12, (20, 22, 26), -1) # Ebonite knob
    
    hmap[alpha > 0] = 20.0
    save_counter('counter_radio_transmitter', hmap, rgb, alpha)

# 17. Diving Planes (Dive Planes / Planes)
def generate_dive_planes(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Submarine Bow Hydrofoil Plane (Angled down for diving)
    plane_pts = np.array([
        (cx - 110, cy - 15), (cx + 80, cy - 45), (cx + 110, cy + 25), (cx - 80, cy + 55)
    ], dtype=np.int32)
    cv2.fillPoly(rgb, [plane_pts], (72, 82, 94))
    cv2.fillPoly(alpha, [plane_pts], 255)
    
    # Hydraulic Angle Indicator Arc & Arrows
    cv2.ellipse(rgb, (cx - 60, cy + 10), (75, 75), 0, -45, 45, (195, 155, 65), 5, cv2.LINE_AA)
    cv2.ellipse(alpha, (cx - 60, cy + 10), (75, 75), 0, -45, 45, 255, 5, cv2.LINE_AA)
    
    hmap[alpha > 0] = 20.0
    save_counter('counter_dive_planes', hmap, rgb, alpha)

# 18. Aircraft Recovery Crane (Crane / Hangar)
def generate_aircraft_crane(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Lattice Steel Derrick Boom (Angled at 45 deg)
    p_base = (cx - 70, size - 25)
    p_tip = (cx + 70, 35)
    cv2.line(rgb, p_base, p_tip, (75, 85, 96), 16, cv2.LINE_AA)
    cv2.line(alpha, p_base, p_tip, 255, 16, cv2.LINE_AA)
    
    # Cable & Heavy Forged Steel Hook hanging down
    cv2.line(rgb, p_tip, (cx + 70, cy + 20), (145, 150, 155), 4, cv2.LINE_AA)
    cv2.line(alpha, p_tip, (cx + 70, cy + 20), 255, 4, cv2.LINE_AA)
    # Hook curve
    cv2.ellipse(rgb, (cx + 60, cy + 40), (18, 24), 0, 0, 200, (55, 62, 70), 8, cv2.LINE_AA)
    cv2.ellipse(alpha, (cx + 60, cy + 40), (18, 24), 0, 0, 200, 255, 8, cv2.LINE_AA)
    
    hmap[alpha > 0] = 20.0
    save_counter('counter_aircraft_crane', hmap, rgb, alpha)

# 19. Naval Base & Mooring Pier (Base / Port)
def generate_naval_base(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Heavy Cast Steel Mooring Bollard
    cv2.rectangle(rgb, (cx - 40, cy - 20), (cx + 40, cy + 85), (55, 62, 72), -1)
    cv2.rectangle(alpha, (cx - 40, cy - 20), (cx + 40, cy + 85), 255, -1)
    # Bollard Top Crosshead
    cv2.ellipse(rgb, (cx, cy - 20), (60, 22), 0, 0, 360, (75, 84, 96), -1)
    cv2.ellipse(alpha, (cx, cy - 20), (60, 22), 0, 0, 360, 255, -1)
    
    # Heavy Mooring Hawser Rope coiled around bollard
    for hy in [cy + 10, cy + 35]:
        cv2.ellipse(rgb, (cx, hy), (52, 16), 0, 0, 360, (175, 135, 75), 8, cv2.LINE_AA)
        cv2.ellipse(alpha, (cx, hy), (52, 16), 0, 0, 360, 255, 8, cv2.LINE_AA)
        
    hmap[alpha > 0] = 22.0
    save_counter('counter_naval_base', hmap, rgb, alpha)

# 20. Tactical Mission Grid (Mission)
def generate_tactical_mission(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    r_target = 105
    
    # Tactical Target Reticle & Compass Rose
    cv2.circle(rgb, (cx, cy), r_target, (185, 145, 65), 5, cv2.LINE_AA)
    cv2.circle(rgb, (cx, cy), r_target - 35, (185, 145, 65), 3, cv2.LINE_AA)
    cv2.circle(alpha, (cx, cy), r_target, 255, -1)
    
    # 4-pointed Compass Star in center
    for a in [0, np.pi/2, np.pi, 3*np.pi/2]:
        p_tip = (int(cx + (r_target - 10) * np.cos(a)), int(cy + (r_target - 10) * np.sin(a)))
        p_l = (int(cx + 18 * np.cos(a - np.pi/4)), int(cy + 18 * np.sin(a - np.pi/4)))
        p_r = (int(cx + 18 * np.cos(a + np.pi/4)), int(cy + 18 * np.sin(a + np.pi/4)))
        cv2.fillPoly(rgb, [np.array([p_tip, p_l, (cx, cy)], dtype=np.int32)], (195, 35, 35))
        cv2.fillPoly(rgb, [np.array([p_tip, p_r, (cx, cy)], dtype=np.int32)], (225, 185, 65))
        
    hmap[alpha > 0] = 18.0
    save_counter('counter_tactical_mission', hmap, rgb, alpha)

# 21. Transit & Patrol Sea Wake (Transit / On Stat)
def generate_transit_patrol(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Deep Naval Ocean Blue Background
    cv2.rectangle(rgb, (20, 20), (size - 20, size - 20), (32, 54, 76), -1)
    cv2.rectangle(alpha, (20, 20), (size - 20, size - 20), 255, -1)
    
    # Submarine Hull Silhouette surfacing
    cv2.ellipse(rgb, (cx, cy - 25), (14, 85), 0, 0, 360, (18, 24, 32), -1)
    # Conning tower
    cv2.rectangle(rgb, (cx - 10, cy - 40), (cx + 10, cy - 15), (18, 24, 32), -1)
    
    # Foaming White Bow Waves & Wake (V-shaped foaming spray)
    wake_l = np.array([(cx - 8, cy - 10), (cx - 95, cy + 85), (cx - 65, cy + 95)], dtype=np.int32)
    wake_r = np.array([(cx + 8, cy - 10), (cx + 95, cy + 85), (cx + 65, cy + 95)], dtype=np.int32)
    cv2.fillPoly(rgb, [wake_l], (215, 230, 242))
    cv2.fillPoly(rgb, [wake_r], (215, 230, 242))
    
    hmap[alpha > 0] = 16.0
    save_counter('counter_transit_patrol', hmap, rgb, alpha)

# 22. Tactical Event Dossier (EVT 1 / EVT 2)
def generate_tactical_event(size=360):
    hmap = np.zeros((size, size), dtype=np.float32)
    rgb = np.zeros((size, size, 3), dtype=np.uint8)
    alpha = np.zeros((size, size), dtype=np.uint8)
    cx, cy = size // 2, size // 2
    
    # Manila / Aged Japanese Naval Classified Dossier Folder
    fw, fh = 180, 210
    cv2.rectangle(rgb, (cx - fw//2, cy - fh//2), (cx + fw//2, cy + fh//2), (218, 195, 145), -1)
    cv2.rectangle(alpha, (cx - fw//2, cy - fh//2), (cx + fw//2, cy + fh//2), 255, -1)
    
    # Crimson Diagonal Classification Band
    cv2.line(rgb, (cx - fw//2, cy + 40), (cx + 40, cy - fh//2), (185, 30, 35), 24, cv2.LINE_AA)
    
    # Imperial Gold Chrysanthemum / Anchor Seal in Center
    cv2.circle(rgb, (cx, cy + 20), 28, (215, 175, 65), -1)
    cv2.circle(rgb, (cx, cy + 20), 22, (185, 30, 35), -1) # Red center
    cv2.circle(rgb, (cx, cy + 20), 8, (215, 175, 65), -1)
    
    hmap[alpha > 0] = 20.0
    save_counter('counter_tactical_event', hmap, rgb, alpha)

if __name__ == '__main__':
    print("Generating comprehensive suite of 22 extended realistic counter artworks...")
    generate_xo_portrait()
    generate_engineer_portrait()
    generate_navigator_portrait()
    generate_medic_portrait()
    generate_sailors_crew()
    generate_twin_torpedoes_rack()
    generate_artillery_shell()
    generate_aa_gun_25mm()
    generate_contact_mine()
    generate_kaiten_sub()
    generate_seiran_floatplane()
    generate_supply_crates()
    generate_electric_motor()
    generate_battery_cells()
    generate_fuel_tank()
    generate_radio_transmitter()
    generate_dive_planes()
    generate_aircraft_crane()
    generate_naval_base()
    generate_tactical_mission()
    generate_transit_patrol()
    generate_tactical_event()
    print("All 22 extended photorealistic counter artworks generated successfully!")
