"""
Master Pristine Operations Map Generator:
- 100% Pure Historical Map Geography (ZERO INPAINTING, ZERO BLUR).
- Every letter ("D U T C H   E A S T   I N D I E S", "Kuril Is.", "Bering Sea", "South China Sea", "Indo-China", "Mongolia", "Manchuria", "Japan", "Australia") is razor sharp!
- 300 DPI Lanczos4 super-resolution upscale blended with authentic antique parchment.
- Official Sensuikan High-Res Header with gold badge and authentic rising sun emblem.
- Official Naval Operations Doctrine Cartouche in China/Russia.
- Photorealistic Red Sealing Wax Stamp + Imperial Red Hanko below Pearl Harbor.
- Perimeter Frame with 100mm horizontal ruler, 50mm vertical ruler, and corner crop marks for 1:1 scale verification.
"""

import os
import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import matplotlib.patches as patches

ROOT_DIR = os.path.abspath(".")
OUT_IMG_DIR = os.path.join(ROOT_DIR, "images", "mats")
PREV_DIR = os.path.join(ROOT_DIR, "images", "previews")
DOCS_DIR = os.path.join(ROOT_DIR, "docs")
os.makedirs(OUT_IMG_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

DPI = 300
W_PX = 2855
H_PX = 2187
W_MM = 241.7
H_MM = 185.2

def draw_rulers_and_crop_marks(ax, ox, oy, card_w, card_h, page_w=297.0, page_h=210.0, title="OPERATIONS MAP"):
    color = '#1E293B'
    tick_len = 5.0
    for cx, cy, dx, dy in [(ox, oy, -1, -1), (ox + card_w, oy, 1, -1),
                           (ox, oy + card_h, -1, 1), (ox + card_w, oy + card_h, 1, 1)]:
        ax.plot([cx, cx + dx * tick_len], [cy, cy], color=color, lw=0.6, zorder=10)
        ax.plot([cx, cx], [cy, cy + dy * tick_len], color=color, lw=0.6, zorder=10)
        
    ruler_w = 100.0
    ruler_x0 = (page_w - ruler_w) / 2.0
    ruler_y = oy + card_h + 3.8
    ax.plot([ruler_x0, ruler_x0 + ruler_w], [ruler_y, ruler_y], color=color, lw=0.6, zorder=10)
    for mm in range(101):
        x = ruler_x0 + mm
        if mm % 10 == 0:
            tick_h = 2.0
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.6, zorder=10)
            ax.text(x, ruler_y + tick_h + 0.6, str(mm), fontsize=3.0, ha='center', va='bottom', color=color, weight='bold', zorder=10)
        elif mm % 5 == 0:
            tick_h = 1.3
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.45, zorder=10)
        else:
            tick_h = 0.7
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.3, zorder=10)
    ax.text(page_w / 2.0, ruler_y - 1.8, '100 mm REGLA DE CALIBRACIÓN DE IMPRESIÓN (VERIFICAR CON REGLA FÍSICA - ESCALA EXACTA 100%)',
            fontsize=3.2, ha='center', va='top', color=color, weight='bold', zorder=10)

    v_ruler_h = 50.0
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
    ax.text(v_ruler_x + 1.2, v_ruler_y0 + v_ruler_h / 2.0, '50 mm ESCALA VERTICAL',
            fontsize=3.0, ha='left', va='center', rotation=90, color=color, weight='bold', zorder=10)

    bottom_y = oy - 4.5
    ax.text(page_w / 2.0, bottom_y,
            f'TAMAÑO DE CORTE EXACTO: {card_w:.1f} mm × {card_h:.1f} mm  |  {title}  |  AJUSTE CANÓNICO SENSUAIKAN DELUXE',
            fontsize=3.8, ha='center', va='top', color=color, weight='bold', zorder=10)
    ax.text(page_w / 2.0, bottom_y - 3.2,
            'INSTRUCCIÓN DE IMPRESIÓN: Ajustar al 100% / Tamaño Real (NO "Ajustar a página") · Imprimir en papel o cartulina de 200 g/m²',
            fontsize=3.1, ha='center', va='top', color='#475569', zorder=10)

def build_pristine_map():
    print(f"Generating Pristine Operations Map (ZERO Inpaint, 100% Crisp) {W_PX}x{H_PX} px @ {DPI} DPI...")
    
    orig_cv = cv2.imread("images/vassal/mats/Operatins Map.jpg")
    orig_h, orig_w, _ = orig_cv.shape
    
    scale = max(W_PX / orig_w, H_PX / orig_h)
    new_w = int(round(orig_w * scale))
    new_h = int(round(orig_h * scale))
    crop_x = (new_w - W_PX) // 2
    crop_y = (new_h - H_PX) // 2
    
    # 1. Pure High-Resolution 300 DPI Scaling (ZERO Inpainting)
    orig_rgb = cv2.cvtColor(orig_cv, cv2.COLOR_BGR2RGB)
    map_scaled = cv2.resize(orig_rgb, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
    canvas_raw = map_scaled[crop_y:crop_y + H_PX, crop_x:crop_x + W_PX]
    
    # 2. Blend with Real Antique Parchment Texture
    parchment_cv = cv2.imread("images/mats/real_antique_parchment_bg.png")
    parchment_rgb = cv2.cvtColor(parchment_cv, cv2.COLOR_BGR2RGB)
    parch_scaled = cv2.resize(parchment_rgb, (W_PX, H_PX), interpolation=cv2.INTER_LANCZOS4)
    
    blend_float = (canvas_raw.astype(np.float32) / 255.0) * (parch_scaled.astype(np.float32) / 255.0)
    blend_uint8 = np.clip(blend_float * 255.0 * 1.14, 0, 255).astype(np.uint8)
    
    canvas = Image.fromarray(blend_uint8).convert("RGBA")
    canvas = ImageEnhance.Color(canvas).enhance(1.15)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.08)
    
    overlay = Image.new("RGBA", (W_PX, H_PX), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Palette
    C_OUTER_FRAME = (24, 28, 36, 255)
    C_GOLD = (212, 175, 55, 255)
    C_HEADER_BG = (15, 20, 30, 250)
    
    # Fonts
    font_arial_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
    font_georgia_bold = "C:\\Windows\\Fonts\\georgiab.ttf"
    def get_f(fpath, size):
        if os.path.exists(fpath):
            return ImageFont.truetype(fpath, size)
        return ImageFont.load_default()
        
    font_header_title = get_f(font_arial_bold, 40)
    font_header_sub = get_f(font_arial_bold, 22)
    font_legend_banner = get_f(font_georgia_bold, 18)
    font_legend_col_title = get_f(font_georgia_bold, 15)
    font_legend_sub = get_f(font_arial_bold, 13)
    font_legend_body = get_f(font_arial_bold, 12)

    # 3. Perimeter Frame & Corner Cut Guides
    frame_t = int(round(2.0 * DPI / 25.4)) # 24 px
    draw.rectangle([0, 0, W_PX, frame_t], fill=C_OUTER_FRAME)
    draw.rectangle([0, H_PX - frame_t, W_PX, H_PX], fill=C_OUTER_FRAME)
    draw.rectangle([0, 0, frame_t, H_PX], fill=C_OUTER_FRAME)
    draw.rectangle([W_PX - frame_t, 0, W_PX, H_PX], fill=C_OUTER_FRAME)
    draw.rectangle([frame_t, frame_t, W_PX - frame_t, H_PX - frame_t], outline=C_GOLD, width=3)
    
    # Inscribe Exact Dimensions along Bottom Frame
    draw.text((W_PX // 2, H_PX - frame_t // 2), 
              "TAMAÑO DE CORTE EXACTO: 241.7 mm × 185.2 mm (1:1 SENSUAIKAN DELUXE MAT) · IMPRESIÓN A 300 DPI", 
              fill=C_GOLD, font=get_f(font_arial_bold, 13), anchor="mm")

    # 4. Official Sensuikan Header Bar
    head_h = 125
    head_y0 = frame_t + 2
    draw.rectangle([frame_t + 2, head_y0, W_PX - frame_t - 2, head_y0 + head_h], fill=C_HEADER_BG, outline=C_GOLD, width=2)
    
    logo_path = "images/sensuikan_logo_hires.png"
    if os.path.exists(logo_path):
        logo_raw = Image.open(logo_path).convert("RGB")
        target_h = 105
        target_w = int(target_h * logo_raw.width / logo_raw.height)
        logo_resized = logo_raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
        bx = frame_t + 15
        by = head_y0 + (head_h - target_h) // 2
        draw.rectangle([bx - 2, by - 2, bx + target_w + 2, by + target_h + 2], outline=C_GOLD, width=2)
        overlay.paste(logo_resized, (bx, by))
        title_x = bx + target_w + 35
    else:
        title_x = frame_t + 35
        
    draw.text((title_x, head_y0 + 32), "OPERATIONS MAP — PACIFIC & INDIAN OCEANS THEATER", fill=C_GOLD, font=font_header_title)
    draw.text((title_x, head_y0 + 80), "IMPERIAL JAPANESE NAVY FLEET SUBMARINE PATROL OPERATIONS (1941 - 1945)", fill=(215, 225, 235, 255), font=font_header_sub)
    
    # Imperial Naval Crest at Far Right of Header
    crest_path = "images/crest_gold_transparent.png"
    if os.path.exists(crest_path):
        crest_img = Image.open(crest_path).convert("RGBA")
        cr_size = 95
        crest_resized = crest_img.resize((cr_size, cr_size), Image.Resampling.LANCZOS)
        cx = W_PX - frame_t - cr_size - 25
        cy = head_y0 + (head_h - cr_size) // 2
        overlay.paste(crest_resized, (cx, cy), crest_resized)

    # 5. Official Cartouche in China/Russia
    cart_w = 1040
    cart_h = 445
    cart_x = frame_t + 25
    cart_y = head_y0 + head_h + 18
    
    draw.rectangle([cart_x+6, cart_y+6, cart_x+cart_w+6, cart_y+cart_h+6], fill=(0, 0, 0, 110))
    draw.rectangle([cart_x, cart_y, cart_x+cart_w, cart_y+cart_h], fill=(246, 242, 232, 248), outline=(35, 45, 60, 255), width=2)
    draw.rectangle([cart_x+4, cart_y+4, cart_x+cart_w-4, cart_y+cart_h-4], outline=C_GOLD, width=1)
    
    draw.rectangle([cart_x, cart_y, cart_x+cart_w, cart_y+42], fill=(24, 34, 48, 255))
    draw.text((cart_x + cart_w//2, cart_y + 21), "IMPERIAL NAVAL OPERATIONS DOCTRINE & COMBAT PROCEDURE [6.0 / 8.0]", fill=C_GOLD, font=font_legend_banner, anchor="mm")
    
    mid_x = cart_x + cart_w // 2
    draw.line([mid_x, cart_y + 44, mid_x, cart_y + cart_h - 10], fill=C_GOLD, width=1)
    
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

    draw.text((mid_x + 18, cart_y + 54), "SPECIAL MISSIONS & TRANSIT RULES [6.0 / 8.0]", fill=(20, 30, 45, 255), font=font_legend_col_title)
    col2_items = [
        ("sub", "• SPECIAL MISSIONS (1st 'On-Station' Box):"),
        ("body", "   - Midget Sub (Ko-Hyoteki) attack (Pearl, Sydney, Diego S.)."),
        ("body", "   - Kaiten Human Torpedo strike (Ulithi, Kossol, Manus)."),
        ("body", "   - Aerial Recon (Glen / Seiran aircraft) or Mine Laying."),
        ("body", "   - Commando landing or island supply insertion."),
        ("sub", "• DISTANT TRANSIT MODIFIERS:"),
        ("body", "   - Extra Transit boxes reduce On-Station boxes on sub mat."),
        ("body", "   - Europe (Yanagi Mission): 4 extra Transit boxes."),
        ("body", "   - Panama Canal & US West Coast: 3 extra Transit boxes."),
        ("body", "   - Australia & Pearl Harbor: 2 extra Transit boxes.")
    ]
    cur_y = cart_y + 82
    for kind, text in col2_items:
        is_sub = (kind == "sub")
        f = font_legend_sub if is_sub else font_legend_body
        col = (20, 30, 45, 255) if is_sub else (55, 65, 80, 255)
        draw.text((mid_x + 18, cur_y), text, fill=col, font=f)
        cur_y += 30 if is_sub else 25

    # 6. Photorealistic Red Sealing Wax Stamp + Imperial Red Hanko
    wax_path = "images/realistic_wax_seal_confidential_02.png"
    if os.path.exists(wax_path):
        wax_img = Image.open(wax_path).convert("RGBA")
        wax_size = 185
        wax_resized = wax_img.resize((wax_size, wax_size), Image.Resampling.LANCZOS)
        overlay.paste(wax_resized, (2470, 1350), wax_resized)

    hanko_path = "images/stamp_gunji_kimitsu_transparent.png"
    if os.path.exists(hanko_path):
        hanko_corner = Image.open(hanko_path).convert("RGBA")
        hk_w = 125
        hk_h = int(hk_w * hanko_corner.height / hanko_corner.width)
        hanko_corner = hanko_corner.resize((hk_w, hk_h), Image.Resampling.LANCZOS)
        hanko_rot = hanko_corner.rotate(-3.5, resample=Image.Resampling.BICUBIC, expand=True)
        overlay.paste(hanko_rot, (2320, 1375), hanko_rot)

    # 7. Final Composite
    final_img = Image.alpha_composite(canvas, overlay)
    final_rgb = final_img.convert("RGB")
    
    out_master = os.path.join(OUT_IMG_DIR, "operations_map_deluxe_real.jpg")
    final_rgb.save(out_master, quality=96, dpi=(DPI, DPI))
    print(f"Exported Pristine Master Image: {out_master}")
    
    out_prev = os.path.join(PREV_DIR, "preview_operations_map_deluxe_real.jpg")
    prev_w = 1200
    prev_h = int(round(prev_w * H_PX / W_PX))
    prev_img = final_rgb.resize((prev_w, prev_h), Image.Resampling.LANCZOS)
    prev_img.save(out_prev, quality=92)
    print(f"Exported Preview: {out_prev}")
    
    # 8. Export 1:1 Scale Printable PDF with Rulers & Crop Marks
    out_pdf = os.path.join(DOCS_DIR, "PLANTILLA_OPERATIONS_MAP_REAL_DELUXE.pdf")
    PAGE_W_MM = 297.0
    PAGE_H_MM = 210.0
    ox = (PAGE_W_MM - W_MM) / 2.0
    oy = (PAGE_H_MM - H_MM) / 2.0
    
    fig, ax = plt.subplots(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax.set_xlim(0, PAGE_W_MM)
    ax.set_ylim(0, PAGE_H_MM)
    ax.axis('off')
    
    ax.imshow(final_rgb, extent=(ox, ox + W_MM, oy, oy + H_MM), zorder=2)
    draw_rulers_and_crop_marks(ax, ox, oy, W_MM, H_MM, page_w=PAGE_W_MM, page_h=PAGE_H_MM, title="OPERATIONS MAP (100% PRISTINE)")
    
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
    fig.savefig(out_pdf, format='pdf', dpi=300)
    plt.close(fig)
    print(f"Exported 1:1 Scale PDF: {out_pdf}")

if __name__ == "__main__":
    build_pristine_map()
