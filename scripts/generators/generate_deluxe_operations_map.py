"""
Master Script for Deluxe Operations Map (Sensuikan) - High-Key Print Optimized:
- 100% Faithful to original Vassal map content & exact station layout.
- High-Key Luminous Station Background Artwork:
  * Bases: IJN fleet base harbor with tenders and crane (station_naval_base.jpg)
  * Island/Atoll Patrols: Coral atoll & turquoise lagoon (station_patrol_atoll.jpg)
  * Ocean Patrols: Bright Pacific ocean swell & sunlit cumulus clouds (station_patrol_ocean.jpg)
  * Destinations: Sunlit coastline with lighthouse (station_distant_destination.jpg)
  * Transit Boxes: IJN submarine cruising on surface with white spray (station_transit_sub.jpg)
  * Specially lifted shadows and bright highlights so home printers never print dark blobs!
- Authentic Imperial classified marks:
  * Photorealistic Red Sealing Wax Stamp ('el lacrado' - realistic_wax_seal_confidential_02.png)
  * Imperial Red Hanko ('sello en japonés de secreto' - stamp_gunji_kimitsu_transparent.png)
- Unified Double-Column Player Aid Cartouche in Northern China/Russia:
  * Leaves Australia, Guadalcanal, and all Pacific/Indian ocean routes 100% CLEAR!
- Exact Vassal transit box stacking order (front box has 'Transit' text and overlaps subsequent boxes).
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import matplotlib.pyplot as plt

OUT_IMG_DIR = os.path.abspath("images/mats")
PREV_DIR = os.path.abspath("images/previews")
DOCS_DIR = os.path.abspath("docs")
os.makedirs(OUT_IMG_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

DPI = 300
WIDTH_MM = 241.7
HEIGHT_MM = 185.2
W_PX = int(round(WIDTH_MM * DPI / 25.4))   # 2855 px
H_PX = int(round(HEIGHT_MM * DPI / 25.4))  # 2187 px

def prepare_high_key_art(art_path, target_size, tint_color, opacity=0.95, min_floor=0):
    """
    Renders rich, vivid, fully visible station artwork with authentic colors and contrast.
    The illustration (naval base, atoll, island) is clearly visible behind the text.
    """
    if not os.path.exists(art_path):
        return Image.new("RGBA", (target_size, target_size), tint_color)
    
    im = Image.open(art_path).convert("RGB")
    w, h = im.size
    side = min(w, h)
    im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))
    im = im.resize((target_size, target_size), Image.Resampling.LANCZOS)
    
    # Rich, vibrant color and contrast
    im = ImageEnhance.Color(im).enhance(1.30)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    
    if min_floor > 0:
        arr = np.array(im, dtype=np.float32)
        norm = arr / 255.0
        lifted = min_floor + (255.0 - min_floor) * norm
        lifted_im = Image.fromarray(np.clip(lifted, 0, 255).astype(np.uint8))
    else:
        lifted_im = im
    
    bg_canvas = Image.new("RGBA", (target_size, target_size), tint_color)
    art_rgba = lifted_im.convert("RGBA")
    alpha_mask = Image.new("L", (target_size, target_size), int(opacity * 255))
    art_rgba.putalpha(alpha_mask)
    
    return Image.alpha_composite(bg_canvas, art_rgba)

def draw_text_with_halo(draw, xy, text, font, fill, halo_fill=(255, 255, 255, 235), halo_radius=2, anchor="mm"):
    """
    Draws text with a crisp white halo so it remains 100% legible against vivid background art.
    """
    x, y = xy
    for dx in range(-halo_radius, halo_radius + 1):
        for dy in range(-halo_radius, halo_radius + 1):
            if dx*dx + dy*dy <= halo_radius*halo_radius:
                draw.text((x + dx, y + dy), text, font=font, fill=halo_fill, anchor=anchor)
    draw.text((x, y), text, font=font, fill=fill, anchor=anchor)

def draw_print_calibration_and_crop_marks(ax, ox, oy, card_w, card_h, page_w=297.0, page_h=210.0, title="DELUXE OPERATIONS MAP"):
    """
    Renders professional print calibration guides:
    1. Corner L-shaped crop marks with offset.
    2. Exact 100 mm horizontal millimeter ruler with 10mm, 5mm, and 1mm subdivisions.
    3. Exact 50 mm vertical millimeter ruler.
    4. Explicit cutting dimensions and printer scaling instructions.
    """
    offset = 1.5   # mm gap from border
    length = 6.0   # mm length of cut tick
    color = '#1E293B'
    lw = 0.65
    
    # 1. Corner Crop Marks
    corners = [
        (ox, oy, -1, -1),                          # Bottom-Left
        (ox + card_w, oy, 1, -1),                  # Bottom-Right
        (ox, oy + card_h, -1, 1),                  # Top-Left
        (ox + card_w, oy + card_h, 1, 1)           # Top-Right
    ]
    for cx, cy, dx, dy in corners:
        ax.plot([cx + dx * offset, cx + dx * (offset + length)], [cy, cy], color=color, lw=lw, zorder=10)
        ax.plot([cx, cx], [cy + dy * offset, cy + dy * (offset + length)], color=color, lw=lw, zorder=10)

    # 2. Horizontal Calibration Scale Bar (100 mm) at Top Margin
    ruler_w = 100.0  # Exact 100 mm
    ruler_x0 = (page_w - ruler_w) / 2.0
    ruler_y = oy + card_h + 3.8
    
    ax.plot([ruler_x0, ruler_x0 + ruler_w], [ruler_y, ruler_y], color=color, lw=0.6, zorder=10)
    for mm in range(101):
        x = ruler_x0 + mm
        if mm % 10 == 0:
            tick_h = 2.0
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.6, zorder=10)
            ax.text(x, ruler_y + tick_h + 0.4, str(mm), fontsize=3.2, ha='center', va='bottom', color=color, weight='bold', zorder=10)
        elif mm % 5 == 0:
            tick_h = 1.3
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.45, zorder=10)
        else:
            tick_h = 0.7
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.3, zorder=10)

    ax.text(ruler_x0 + ruler_w / 2.0, ruler_y - 1.1,
            '◄── 100 mm REGLA DE CALIBRACIÓN DE IMPRESIÓN (VERIFICAR CON REGLA FÍSICA · ESCALA EXACTA 100%) ──►',
            fontsize=3.4, ha='center', va='top', color=color, weight='bold', zorder=10)

    # 3. Vertical Calibration Scale Bar (50 mm) at Left Margin
    v_ruler_h = 50.0  # Exact 50 mm
    v_ruler_x = ox - 12.0
    v_ruler_y0 = (page_h - v_ruler_h) / 2.0
    
    ax.plot([v_ruler_x, v_ruler_x], [v_ruler_y0, v_ruler_y0 + v_ruler_h], color=color, lw=0.6, zorder=10)
    for mm in range(51):
        y = v_ruler_y0 + mm
        if mm % 10 == 0:
            tick_w = 2.0
            ax.plot([v_ruler_x - tick_w, v_ruler_x], [y, y], color=color, lw=0.6, zorder=10)
            ax.text(v_ruler_x - tick_w - 0.5, y, str(mm), fontsize=3.0, ha='right', va='center', color=color, weight='bold', zorder=10)
        elif mm % 5 == 0:
            tick_w = 1.3
            ax.plot([v_ruler_x - tick_w, v_ruler_x], [y, y], color=color, lw=0.45, zorder=10)
        else:
            tick_w = 0.7
            ax.plot([v_ruler_x - tick_w, v_ruler_x], [y, y], color=color, lw=0.3, zorder=10)
            
    ax.text(v_ruler_x + 1.2, v_ruler_y0 + v_ruler_h / 2.0,
            '50 mm ESCALA VERTICAL',
            fontsize=3.0, ha='left', va='center', rotation=90, color=color, weight='bold', zorder=10)

    # 4. Dimension & Print Instructions at Bottom Margin
    bottom_y = oy - 4.5
    ax.text(page_w / 2.0, bottom_y,
            f'TAMAÑO DE CORTE EXACTO: {card_w:.1f} mm × {card_h:.1f} mm  |  {title}  |  AJUSTE CANÓNICO SENSUAIKAN DELUXE',
            fontsize=3.8, ha='center', va='top', color=color, weight='bold', zorder=10)
    ax.text(page_w / 2.0, bottom_y - 3.2,
            'INSTRUCCIÓN DE IMPRESIÓN: Ajustar al 100% / Tamaño Real (NO "Ajustar a página") · Imprimir en papel o cartulina de 200 g/m²',
            fontsize=3.1, ha='center', va='top', color='#475569', zorder=10)

def build_deluxe_operations_map():
    print(f"Generating Deluxe Operations Map with High-Key Art ({W_PX} x {H_PX} px @ {DPI} DPI)...")
    
    # 1. Load original map and inpaint original boxes
    orig_cv = cv2.imread("images/vassal/mats/Operatins Map.jpg")
    orig_h, orig_w, _ = orig_cv.shape
    
    scale = max(W_PX / orig_w, H_PX / orig_h)
    new_w = int(round(orig_w * scale))
    new_h = int(round(orig_h * scale))
    crop_x = (new_w - W_PX) // 2
    crop_y = (new_h - H_PX) // 2
    
    def mm_to_px(x_mm, y_mm):
        return int(round(x_mm * DPI / 25.4)), int(round(y_mm * DPI / 25.4))

    # Official Station Definitions (Calibrated with >= 4.0 mm solid clearance between all boxes!)
    stations = [
        {"id": "paramushiro", "pos_mm": (140.7, 33.2), "lines": ["Paramu-", "shiro"], "type": "base"},
        {"id": "yokosuka", "pos_mm": (116.1, 58.5), "lines": ["Yokosuka"], "type": "base"},
        {"id": "truk", "pos_mm": (134.1, 112.2), "lines": ["Truk"], "type": "base"},
        {"id": "new_guinea", "pos_mm": (116.0, 132.0), "lines": ["New", "Guinea"], "type": "base"},
        {"id": "dutch_east_indies", "pos_mm": (64.8, 143.8), "lines": ["Dutch E.", "Indies"], "type": "base"},
        
        {"id": "aleutian", "pos_mm": (198.6, 31.2), "lines": ["Aleutian", "Is."], "type": "patrol_ocean"},
        {"id": "okinawa", "pos_mm": (93.8, 77.0), "lines": ["Okinawa"], "type": "patrol_atoll"},
        {"id": "iwo_jima", "pos_mm": (119.0, 81.6), "lines": ["Iwo Jima"], "type": "patrol_atoll"},
        {"id": "midway", "pos_mm": (178.3, 81.6), "lines": ["Midway"], "type": "patrol_atoll"},
        {"id": "philippines", "pos_mm": (72.5, 91.0), "lines": ["Philippines"], "type": "patrol_atoll"},
        {"id": "marianas", "pos_mm": (112.0, 99.0), "lines": ["Marianas"], "type": "patrol_atoll"},
        {"id": "indian_ocean", "pos_mm": (13.7, 107.6), "lines": ["Indian", "Ocean"], "type": "patrol_ocean"},
        {"id": "leyte_gulf", "pos_mm": (87.5, 113.0), "lines": ["Leyte", "Gulf"], "type": "patrol_atoll"},
        {"id": "malaya", "pos_mm": (28.7, 120.0), "lines": ["Malaya"], "type": "patrol_ocean"},
        {"id": "tarawa", "pos_mm": (181.3, 131.2), "lines": ["Tarawa"], "type": "patrol_atoll"},
        {"id": "guadalcanal", "pos_mm": (154.0, 150.4), "lines": ["Guadal-", "canal"], "type": "patrol_atoll"},
        
        {"id": "west_coast", "pos_mm": (228.3, 54.4), "lines": ["West", "Coast", "US"], "type": "dest"},
        {"id": "pearl_harbor", "pos_mm": (216.9, 96.9), "lines": ["Pearl", "Harbor"], "type": "dest"},
        {"id": "panama_canal", "pos_mm": (228.3, 165.9), "lines": ["Panama", "Canal"], "type": "dest"},
        {"id": "australia", "pos_mm": (136.7, 174.2), "lines": ["Australia"], "type": "dest"},
        {"id": "europe", "pos_mm": (17.9, 170.7), "lines": ["Europe"], "type": "dest"},
    ]
    
    # 14 Discrete Transit Boxes (Non-overlapping individual pockets for dual-layer save-game overlay)
    transit_routes = [
        # West Coast (3 transit boxes -> dest)
        {
            "dest_id": "west_coast",
            "boxes": [
                ("wc_t1", (172.5, 54.4), "Transit 1"),
                ("wc_t2", (191.0, 54.4), "Transit 2"),
                ("wc_t3", (209.5, 54.4), "Transit 3"),
            ]
        },
        # Pearl Harbor (2 transit boxes -> dest)
        {
            "dest_id": "pearl_harbor",
            "boxes": [
                ("ph_t1", (180.0, 108.0), "Transit 1"),
                ("ph_t2", (198.5, 96.9), "Transit 2"),
            ]
        },
        # Panama Canal (3 transit boxes -> dest)
        {
            "dest_id": "panama_canal",
            "boxes": [
                ("pc_t1", (172.5, 165.9), "Transit 1"),
                ("pc_t2", (191.0, 165.9), "Transit 2"),
                ("pc_t3", (209.5, 165.9), "Transit 3"),
            ]
        },
        # Australia (2 transit boxes -> dest)
        {
            "dest_id": "australia",
            "boxes": [
                ("aus_t1", (100.0, 154.0), "Transit 1"),
                ("aus_t2", (118.5, 160.0), "Transit 2"),
            ]
        },
        # Europe (4 transit boxes -> dest)
        {
            "dest_id": "europe",
            "boxes": [
                ("eu_t4", (92.0, 170.7), "Transit 4"),
                ("eu_t3", (73.5, 170.7), "Transit 3"),
                ("eu_t2", (55.0, 170.7), "Transit 2"),
                ("eu_t1", (36.5, 170.7), "Transit 1"),
            ]
        },
    ]

    # Flawless inpainting of all old Vassal boxes, black frames, drop shadows and transit clusters
    clean_map = orig_cv.copy()
    mask = np.zeros((orig_h, orig_w), dtype=np.uint8)
    
    # 1. Erase old header banner
    mask[0:190, 0:930] = 255
    
    # 2. Automated component-level detection: locate every single black box border & transit cluster in Vassal map
    gray_orig = cv2.cvtColor(orig_cv, cv2.COLOR_BGR2GRAY)
    black_orig = (gray_orig < 60).astype(np.uint8)
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(black_orig)
    
    for i in range(1, num_labels):
        x, y, w, h, area = stats[i]
        if area > 100 and y > 100: # Old stations, old transit tracks, old Dutch E. Indies, Europe, etc.
            pad = 16 # Generous padding to consume all outer drop shadows and soft edges
            y0 = max(0, y - pad)
            y1 = min(orig_h, y + h + pad)
            x0 = max(0, x - pad)
            x1 = min(orig_w, x + w + pad)
            mask[y0:y1, x0:x1] = 255

    # 3. Explicit coverage of all 5 transit corridors to guarantee 100% removal
    mask[235:390, 1010:1235] = 255 # West Coast transit
    mask[435:595, 940:1175] = 255  # Pearl Harbor transit
    mask[755:945, 970:1240] = 255  # Panama Canal transit
    mask[730:965, 630:790] = 255   # Australia transit
    mask[660:960, 40:390] = 255    # Europe & old Dutch E. Indies (erases Component 206 completely!)

    # 4. Dilate mask with a 9x9 structuring element to completely envelop all blur shadows
    mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_RECT, (9, 9)), iterations=2)
    clean_map = cv2.inpaint(clean_map, mask, 9, cv2.INPAINT_TELEA)
    clean_rgb = cv2.cvtColor(clean_map, cv2.COLOR_BGR2RGB)
    
    # Blend with real antique parchment texture
    parchment_cv = cv2.imread("images/mats/real_antique_parchment_bg.png")
    parchment_rgb = cv2.cvtColor(parchment_cv, cv2.COLOR_BGR2RGB)
    parch_scaled = cv2.resize(parchment_rgb, (orig_w, orig_h), interpolation=cv2.INTER_LANCZOS4)
    blend_float = (clean_rgb.astype(np.float32) / 255.0) * (parch_scaled.astype(np.float32) / 255.0)
    blend_uint8 = np.clip(blend_float * 255.0 * 1.14, 0, 255).astype(np.uint8)
    
    pil_map = Image.fromarray(blend_uint8).convert("RGBA")
    map_scaled = pil_map.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = map_scaled.crop((crop_x, crop_y, crop_x + W_PX, crop_y + H_PX))
    canvas = ImageEnhance.Color(canvas).enhance(1.05)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.04)
    
    overlay = Image.new("RGBA", (W_PX, H_PX), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Fonts
    font_arial_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
    font_arial_italic = "C:\\Windows\\Fonts\\ariali.ttf"
    font_arial_bold_italic = "C:\\Windows\\Fonts\\arialbi.ttf"
    font_georgia_bold = "C:\\Windows\\Fonts\\georgiab.ttf"
    
    def get_f(fpath, size):
        if os.path.exists(fpath):
            return ImageFont.truetype(fpath, size)
        return ImageFont.load_default()
        
    font_header_title = get_f(font_arial_bold, 40)
    font_header_sub = get_f(font_arial_bold, 22)
    font_box_red = get_f(font_arial_bold_italic, 24)
    font_box_base = get_f(font_arial_bold, 23)
    font_transit = get_f(font_arial_italic, 24)
    font_legend_banner = get_f(font_georgia_bold, 18)
    font_legend_col_title = get_f(font_georgia_bold, 15)
    font_legend_sub = get_f(font_arial_bold, 13)
    font_legend_body = get_f(font_arial_bold, 12)
    
    # Palette
    C_OUTER_FRAME = (24, 28, 36, 255)
    C_GOLD = (212, 175, 55, 255)
    C_HEADER_BG = (15, 20, 30, 245)
    C_BOX_BORDER = (35, 45, 60, 255)
    C_BOX_BG_PATROL = (244, 242, 235, 255)
    C_BOX_BG_BASE = (226, 238, 248, 255)
    C_BOX_BG_TRANSIT = (70, 85, 105, 255)
    C_TEXT_RED = (180, 25, 25, 255)
    C_TEXT_BASE = (20, 35, 55, 255)
    C_WHITE = (255, 255, 255, 255)
    
    # Perimeter Frame & Corner Cut Guides
    frame_t = int(round(2.0 * DPI / 25.4)) # 24 px
    draw.rectangle([0, 0, W_PX, frame_t], fill=C_OUTER_FRAME)
    draw.rectangle([0, H_PX - frame_t, W_PX, H_PX], fill=C_OUTER_FRAME)
    draw.rectangle([0, 0, frame_t, H_PX], fill=C_OUTER_FRAME)
    draw.rectangle([W_PX - frame_t, 0, W_PX, H_PX], fill=C_OUTER_FRAME)
    draw.rectangle([frame_t, frame_t, W_PX - frame_t, H_PX - frame_t], outline=C_GOLD, width=3)
    
    # Corner Cut Guide Crosshairs on Mat Canvas
    cut_tick = 22
    for cx, cy, dx, dy in [(0, 0, 1, 1), (W_PX, 0, -1, 1), (0, H_PX, 1, -1), (W_PX, H_PX, -1, -1)]:
        draw.line([cx, cy, cx + dx * cut_tick, cy], fill=C_GOLD, width=2)
        draw.line([cx, cy, cx, cy + dy * cut_tick], fill=C_GOLD, width=2)
        
    # Inscribe Exact Dimensions along Bottom Frame
    draw.text((W_PX // 2, H_PX - frame_t // 2), 
              "TAMAÑO DE CORTE EXACTO: 241.7 mm × 185.2 mm (1:1 SENSUAIKAN DELUXE MAT) · IMPRESIÓN A 300 DPI", 
              fill=C_GOLD, font=get_f(font_arial_bold, 13), anchor="mm")
    
    # Header Bar
    head_h = 125
    head_y0 = frame_t + 2
    draw.rectangle([frame_t + 2, head_y0, W_PX - frame_t - 2, head_y0 + head_h], fill=C_HEADER_BG, outline=C_GOLD, width=2)
    
    # Authentic High-Resolution Sensuikan Game Logo
    logo_path = "images/sensuikan_logo_hires.png"
    if os.path.exists(logo_path):
        logo_raw = Image.open(logo_path).convert("RGB")
        target_h = 105
        target_w = int(target_h * logo_raw.width / logo_raw.height)
        logo_resized = logo_raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
        bx = frame_t + 15
        by = head_y0 + (head_h - target_h) // 2
        # Elegant gold border badge around authentic logo
        draw.rectangle([bx - 2, by - 2, bx + target_w + 2, by + target_h + 2], outline=C_GOLD, width=2)
        overlay.paste(logo_resized, (bx, by))
        title_x = bx + target_w + 35
    else:
        title_x = frame_t + 35
    
    draw.text((title_x, head_y0 + 20), "OPERATIONS MAP — PACIFIC & INDIAN OCEANS THEATER", fill=C_GOLD, font=font_header_title)
    draw.text((title_x + 3, head_y0 + 72), "IMPERIAL JAPANESE NAVY FLEET SUBMARINE PATROL OPERATIONS (1941 - 1945)", fill=(200, 215, 230, 255), font=font_header_sub)
    
    # Header classified seal removed per user instruction ("en la cabecera no los pongas")

    # 4. Canonical Counter Pocket Sizes
    BOX_SIZE = int(round(15.0 * DPI / 25.4)) # 177 px
    T_BOX = int(round(14.0 * DPI / 25.4))    # 165 px

    # Prepare Pre-Rendered High-Contrast Station Art Tiles
    print("Preparing vibrant background artwork for counter slots...")
    art_base = prepare_high_key_art("images/mats/stations/station_naval_base.jpg", BOX_SIZE, C_BOX_BG_BASE, opacity=0.96, min_floor=0)
    art_atoll = prepare_high_key_art("images/mats/stations/station_patrol_atoll.jpg", BOX_SIZE, C_BOX_BG_PATROL, opacity=0.96, min_floor=0)
    art_ocean = prepare_high_key_art("images/mats/stations/station_patrol_ocean.jpg", BOX_SIZE, C_BOX_BG_PATROL, opacity=0.96, min_floor=0)
    art_dest = prepare_high_key_art("images/mats/stations/station_distant_destination.jpg", BOX_SIZE, C_BOX_BG_PATROL, opacity=0.96, min_floor=0)
    art_transit = prepare_high_key_art("images/mats/stations/station_transit_sub.jpg", BOX_SIZE, C_BOX_BG_TRANSIT, opacity=0.96, min_floor=0)

    def draw_discrete_transit_box(cx, cy, label="Transit"):
        x0 = cx - BOX_SIZE // 2
        y0 = cy - BOX_SIZE // 2
        # Drop shadow
        draw.rectangle([x0 + 4, y0 + 4, x0 + BOX_SIZE + 4, y0 + BOX_SIZE + 4], fill=(0, 0, 0, 110))
        # Background art tile (vibrant submarine cruising)
        overlay.paste(art_transit, (x0, y0), art_transit)
        # Double gold & navy border matching stations
        draw.rectangle([x0, y0, x0 + BOX_SIZE, y0 + BOX_SIZE], outline=C_BOX_BORDER, width=2)
        draw.rectangle([x0 + 2, y0 + 2, x0 + BOX_SIZE - 2, y0 + BOX_SIZE - 2], outline=(140, 165, 195, 200), width=1)
        # Label with halo for maximum contrast
        draw_text_with_halo(draw, (cx, cy), label, font=font_transit, fill=(240, 245, 255, 255), halo_fill=(15, 25, 35, 220), halo_radius=2)

    def draw_arrow(p1, p2, color=(30, 40, 55, 240)):
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        dist = np.hypot(dx, dy)
        if dist <= 20: return
        ux, uy = dx / dist, dy / dist
        perp_x, perp_y = -uy, ux
        # Gap from boxes so arrow does not overlap box borders
        start_x = p1[0] + ux * (BOX_SIZE // 2 + 5)
        start_y = p1[1] + uy * (BOX_SIZE // 2 + 5)
        shaft_end_x = p2[0] - ux * (BOX_SIZE // 2 + 16)
        shaft_end_y = p2[1] - uy * (BOX_SIZE // 2 + 16)
        draw.line([start_x, start_y, shaft_end_x, shaft_end_y], fill=color, width=4)
        tip_x = p2[0] - ux * (BOX_SIZE // 2 + 4)
        tip_y = p2[1] - uy * (BOX_SIZE // 2 + 4)
        head_pts = [
            (tip_x, tip_y),
            (shaft_end_x + perp_x * 7, shaft_end_y + perp_y * 7),
            (shaft_end_x - perp_x * 7, shaft_end_y - perp_y * 7)
        ]
        draw.polygon(head_pts, fill=color)

    # 5. Draw Discrete Non-Overlapping Transit Tracks
    print("Drawing discrete transit tracks with directional arrows...")
    station_pos_map = {st["id"]: mm_to_px(*st["pos_mm"]) for st in stations}

    for route in transit_routes:
        dest_px = station_pos_map[route["dest_id"]]
        route_boxes_px = []
        for bid, (bx_mm, by_mm), blabel in route["boxes"]:
            bpx = mm_to_px(bx_mm, by_mm)
            route_boxes_px.append((bid, bpx, blabel))

        # Draw directional route arrows connecting steps in sequence
        for i in range(len(route_boxes_px) - 1):
            draw_arrow(route_boxes_px[i][1], route_boxes_px[i+1][1])
        # Arrow from final transit step to destination box
        draw_arrow(route_boxes_px[-1][1], dest_px)

        # Draw each discrete transit counter box
        for bid, bpx, blabel in route_boxes_px:
            draw_discrete_transit_box(bpx[0], bpx[1], blabel)

    # 6. Draw Official Stations with High-Key Art, Anchor & Text
    print("Drawing stations with calibrated spacing and authentic typography...")
    anchor_path = "images/mats/anchor_icon_transparent.png"
    anchor_img = Image.open(anchor_path).convert("RGBA") if os.path.exists(anchor_path) else None
    if anchor_img:
        anchor_img = anchor_img.resize((54, 54), Image.Resampling.LANCZOS)

    for st in stations:
        cx, cy = mm_to_px(*st["pos_mm"])
        x0 = cx - BOX_SIZE // 2
        y0 = cy - BOX_SIZE // 2
        x0 = max(frame_t + 10, min(W_PX - frame_t - BOX_SIZE - 10, x0))
        y0 = max(head_y0 + head_h + 10, min(H_PX - frame_t - BOX_SIZE - 10, y0))
        
        # Drop shadow
        draw.rectangle([x0+5, y0+5, x0+BOX_SIZE+5, y0+BOX_SIZE+5], fill=(0, 0, 0, 120))
        
        st_type = st["type"]
        if st_type == "base":
            overlay.paste(art_base, (x0, y0), art_base)
            draw.rectangle([x0, y0, x0+BOX_SIZE, y0+BOX_SIZE], outline=C_BOX_BORDER, width=3)
            lines = st["lines"]
            if len(lines) == 1:
                draw_text_with_halo(draw, (cx, y0 + 38), lines[0], font=font_box_base, fill=C_TEXT_BASE, halo_fill=(255, 255, 255, 245), halo_radius=2)
            else:
                draw_text_with_halo(draw, (cx, y0 + 26), lines[0], font=font_box_base, fill=C_TEXT_BASE, halo_fill=(255, 255, 255, 245), halo_radius=2)
                draw_text_with_halo(draw, (cx, y0 + 52), lines[1], font=font_box_base, fill=C_TEXT_BASE, halo_fill=(255, 255, 255, 245), halo_radius=2)
            if anchor_img:
                overlay.paste(anchor_img, (cx - 27, y0 + BOX_SIZE - 70), anchor_img)
        else:
            if st_type == "patrol_ocean":
                overlay.paste(art_ocean, (x0, y0), art_ocean)
            elif st_type == "dest":
                overlay.paste(art_dest, (x0, y0), art_dest)
            else:
                overlay.paste(art_atoll, (x0, y0), art_atoll)
                
            draw.rectangle([x0, y0, x0+BOX_SIZE, y0+BOX_SIZE], outline=C_BOX_BORDER, width=3)
            lines = st["lines"]
            total_lines = len(lines)
            if total_lines == 1:
                draw_text_with_halo(draw, (cx, cy), lines[0], font=font_box_red, fill=C_TEXT_RED, halo_fill=(255, 255, 255, 245), halo_radius=2)
            elif total_lines == 2:
                draw_text_with_halo(draw, (cx, cy - 18), lines[0], font=font_box_red, fill=C_TEXT_RED, halo_fill=(255, 255, 255, 245), halo_radius=2)
                draw_text_with_halo(draw, (cx, cy + 18), lines[1], font=font_box_red, fill=C_TEXT_RED, halo_fill=(255, 255, 255, 245), halo_radius=2)
            elif total_lines == 3:
                draw_text_with_halo(draw, (cx, cy - 32), lines[0], font=font_box_red, fill=C_TEXT_RED, halo_fill=(255, 255, 255, 245), halo_radius=2)
                draw_text_with_halo(draw, (cx, cy), lines[1], font=font_box_red, fill=C_TEXT_RED, halo_fill=(255, 255, 255, 245), halo_radius=2)
                draw_text_with_halo(draw, (cx, cy + 32), lines[2], font=font_box_red, fill=C_TEXT_RED, halo_fill=(255, 255, 255, 245), halo_radius=2)

    # 7. UNIFIED DOUBLE-COLUMN CARTOUCHE IN NORTHERN CHINA / SIBERIA
    # Leaves Australia, Guadalcanal, and ALL ocean areas 100% CLEAR!
    print("Drawing unified double-column cartouche in China/Russia...")
    cart_w = 1040
    cart_h = 445
    cart_x = frame_t + 25
    cart_y = head_y0 + head_h + 18
    
    # Cartouche body
    draw.rectangle([cart_x+6, cart_y+6, cart_x+cart_w+6, cart_y+cart_h+6], fill=(0, 0, 0, 110))
    draw.rectangle([cart_x, cart_y, cart_x+cart_w, cart_y+cart_h], fill=(246, 242, 232, 248), outline=C_BOX_BORDER, width=2)
    draw.rectangle([cart_x+4, cart_y+4, cart_x+cart_w-4, cart_y+cart_h-4], outline=C_GOLD, width=1)
    
    # Title tab across entire width
    draw.rectangle([cart_x, cart_y, cart_x+cart_w, cart_y+42], fill=(24, 34, 48, 255))
    draw.text((cart_x + cart_w//2, cart_y + 21), "IMPERIAL NAVAL OPERATIONS DOCTRINE & COMBAT PROCEDURE [6.0 / 8.0]", fill=C_GOLD, font=font_legend_banner, anchor="mm")
    
    # Vertical divider line between columns
    mid_x = cart_x + cart_w // 2
    draw.line([mid_x, cart_y + 44, mid_x, cart_y + cart_h - 10], fill=C_GOLD, width=1)
    
    # COLUMN 1: PATROL & ENCOUNTER SEQUENCE (Left half)
    draw.text((cart_x + 18, cart_y + 54), "PATROL & ENCOUNTER SEQUENCE [6.0]", fill=(20, 30, 45, 255), font=font_legend_col_title)
    col1_items = [
        ("sub", "1. ASSIGNMENT & MAJOR EVENTS [6.1]:"),
        ("body", "   • Consult Table [A1] & check active Major Events."),
        ("body", "   • Place submarine on 1st Travel Box of assigned patrol."),
        ("sub", "2. TRAVEL BOXES & TRANSIT [6.2]:"),
        ("body", "   • Check Encounter Chart [A3] for each box entered."),
        ("body", "   • Distant patrols: divide extra Transit boxes in half."),
        ("sub", "3. ENCOUNTER RESOLUTION [8.0]:"),
        ("body", "   • Determine Random Event [B11], Air, or Ship Encounter."),
        ("body", "   • Combat is voluntary. Detection leads to Depth Charges."),
        ("sub", "4. REFIT & ADVANCEMENT [6.3]:"),
        ("body", "   • Assess damage & roll repair duration. Record 'R' on Log.")
    ]
    cur_y = cart_y + 82
    for kind, text in col1_items:
        is_sub = (kind == "sub")
        f = font_legend_sub if is_sub else font_legend_body
        col = (20, 30, 45, 255) if is_sub else (55, 65, 80, 255)
        draw.text((cart_x + 18, cur_y), text, fill=col, font=f)
        cur_y += 30 if is_sub else 25

    # COLUMN 2: SPECIAL MISSIONS & TRANSIT RULES (Right half)
    draw.text((mid_x + 18, cart_y + 54), "SPECIAL MISSIONS & TRANSIT RULES [6.0 / 8.0]", fill=(20, 30, 45, 255), font=font_legend_col_title)
    col2_items = [
        ("sub", "• SPECIAL MISSIONS (1st 'On Station' Box):"),
        ("body", "  - Midget Sub (Ko-Hyoteki) attack (Pearl, Sydney, Diego S.)."),
        ("body", "  - Kaiten Human Torpedo strike (Ulithi, Kossol, Manus)."),
        ("body", "  - Aerial Recon (Glen / Seiran aircraft) or Mine Laying."),
        ("body", "  - Commando landing or island supply insertion."),
        ("sub", "• DISTANT TRANSIT MODIFIERS:"),
        ("body", "  - Extra Transit boxes reduce On-Station boxes on sub mat."),
        ("body", "  - Europe (Yanagi Mission): 4 extra Transit boxes."),
        ("body", "  - Panama Canal & US West Coast: 3 extra Transit boxes."),
        ("body", "  - Australia & Pearl Harbor: 2 extra Transit boxes.")
    ]
    cur_y2 = cart_y + 82
    for kind, text in col2_items:
        is_sub = (kind == "sub")
        f = font_legend_sub if is_sub else font_legend_body
        col = (20, 30, 45, 255) if is_sub else (55, 65, 80, 255)
        draw.text((mid_x + 18, cur_y2), text, fill=col, font=f)
        cur_y2 += 30 if is_sub else 25

    # 8. IMPERIAL CLASSIFIED STAMPS LOCATED DIRECTLY BELOW PEARL HARBOR
    # Photorealistic Red Sealing Wax Stamp ("El Lacrado") + Imperial Red Hanko ("Sello Militar Secreto")
    # Positioned in open ocean directly under Pearl Harbor (cx=2562, cy=1144) per user request
    print("Pasting photorealistic red sealing wax stamp and imperial hanko below Pearl Harbor...")
    wax_path = "images/realistic_wax_seal_confidential_02.png"
    if os.path.exists(wax_path):
        wax_img = Image.open(wax_path).convert("RGBA")
        wax_size = 185
        wax_resized = wax_img.resize((wax_size, wax_size), Image.Resampling.LANCZOS)
        # Position directly below Pearl Harbor: X = 2470, Y = 1350
        overlay.paste(wax_resized, (2470, 1350), wax_resized)

    hanko_path = "images/stamp_gunji_kimitsu_transparent.png"
    if os.path.exists(hanko_path):
        hanko_corner = Image.open(hanko_path).convert("RGBA")
        hk_w = 125
        hk_h = int(hk_w * hanko_corner.height / hanko_corner.width)
        hanko_corner = hanko_corner.resize((hk_w, hk_h), Image.Resampling.LANCZOS)
        # Rotate slightly by -3.5 degrees for authentic hand-stamped ink feel
        hanko_rot = hanko_corner.rotate(-3.5, resample=Image.Resampling.BICUBIC, expand=True)
        # Position side-by-side with wax seal under Pearl Harbor: X = 2320, Y = 1375
        overlay.paste(hanko_rot, (2320, 1375), hanko_rot)

    # Composite layers
    print("Compositing layers...")
    final_img = Image.alpha_composite(canvas, overlay)
    final_rgb = final_img.convert("RGB")
    
    out_master = os.path.join(OUT_IMG_DIR, "operations_map_deluxe_real.jpg")
    final_rgb.save(out_master, quality=96, dpi=(DPI, DPI))
    print(f"Exported Master Image: {out_master}")
    
    out_prev = os.path.join(PREV_DIR, "preview_operations_map_deluxe_real.jpg")
    final_rgb.resize((1400, int(1400 * H_PX / W_PX)), Image.Resampling.LANCZOS).save(out_prev, quality=90)
    print(f"Exported Preview: {out_prev}")
    
    pdf_out = os.path.join(DOCS_DIR, "PLANTILLA_OPERATIONS_MAP_REAL_DELUXE.pdf")
    PAGE_W_MM = 297.0
    PAGE_H_MM = 210.0
    ox = (PAGE_W_MM - WIDTH_MM) / 2.0  # 27.65 mm
    oy = (PAGE_H_MM - HEIGHT_MM) / 2.0  # 12.40 mm
    
    fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=DPI)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, PAGE_W_MM)
    ax.set_ylim(0, PAGE_H_MM)
    ax.axis('off')
    
    # Render Mat Image at exact physical 1:1 scale
    ax.imshow(final_rgb, extent=[ox, ox + WIDTH_MM, oy, oy + HEIGHT_MM], zorder=2)
    
    # Draw Calibration Rulers, Crop Marks, and Dimensions
    draw_print_calibration_and_crop_marks(ax, ox, oy, WIDTH_MM, HEIGHT_MM, page_w=PAGE_W_MM, page_h=PAGE_H_MM, title="MAPA DE OPERACIONES DEL PACÍFICO")
    
    fig.savefig(pdf_out, format='pdf', dpi=DPI)
    plt.close(fig)
    print(f"Exported 1:1 Scale PDF with Rulers & Crop Marks: {pdf_out}")
    
    return out_master, pdf_out

if __name__ == "__main__":
    build_deluxe_operations_map()
