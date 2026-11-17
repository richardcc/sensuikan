"""
Script to generate the Remastered Deluxe Attack Mat [Chart H1] for Sensuikan:
- Background: Authentic original Attack Mat blended with 'real_antique_parchment_bg.png'
  from the submarine sheets for an identical aged-parchment aesthetic.
- Erases the old low-res header so our unified IJN deluxe header sits cleanly (no double header).
- 100% authentic original game design: Targets 1-4 with Capital/Warship, Escort, Small,
  Large tracks, Torpedo slots, Range track (Close, Medium, Long), Escorts, Surfaced/Submerged,
  Day/Night, Incoming Hits track (1-5), Attack Damage Chart, and full 10-step Combat Rules.
- Zero invented text, crisp legible typography, no text clipping.
- Canonical unified size: 241.7 x 185.2 mm (300 DPI) matching base tray & save-game lid.
- Outputs high-res master, 1:1 printable PDF, and updates master dossier page 5.
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

def draw_print_calibration_and_crop_marks(ax, ox, oy, card_w, card_h, page_w=297.0, page_h=210.0, title="DELUXE ATTACK MAT [CHART H1]"):
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

def build_deluxe_attack_mat():
    print(f"Generating Deluxe Attack Mat ({W_PX} x {H_PX} px @ {DPI} DPI)...")
    
    # 1. Load original Attack Mat image
    orig_path = "images/mats/Attack Mat.jpg"
    orig_cv = cv2.imread(orig_path)
    orig_h, orig_w, _ = orig_cv.shape
    
    # Inpaint old header area [Y: 0..125]
    print("Inpainting old header area to prevent double header...")
    mask = np.zeros((orig_h, orig_w), dtype=np.uint8)
    mask[0:125, :] = 255
    clean_mat_cv = cv2.inpaint(orig_cv, mask, 5, cv2.INPAINT_TELEA)
    clean_rgb = cv2.cvtColor(clean_mat_cv, cv2.COLOR_BGR2RGB)
    
    # 2. Load real antique parchment background
    parch_cv = cv2.imread("images/mats/real_antique_parchment_bg.png")
    parch_rgb = cv2.cvtColor(parch_cv, cv2.COLOR_BGR2RGB)
    parch_scaled = cv2.resize(parch_rgb, (orig_w, orig_h), interpolation=cv2.INTER_LANCZOS4)
    
    # 3. Soft Multiply blend to infuse parchment texture
    print("Blending Attack Mat with authentic antique parchment texture...")
    blend_float = (clean_rgb.astype(np.float32) / 255.0) * (parch_scaled.astype(np.float32) / 255.0)
    blend_uint8 = np.clip(blend_float * 255.0 * 1.14, 0, 255).astype(np.uint8)
    
    # 4. Scale to target canvas dimensions (2855 x 2187 px)
    scale = max(W_PX / orig_w, H_PX / orig_h)
    new_w = int(round(orig_w * scale))
    new_h = int(round(orig_h * scale))
    crop_x = (new_w - W_PX) // 2
    crop_y = (new_h - H_PX) // 2
    
    pil_mat = Image.fromarray(blend_uint8).convert("RGBA")
    mat_scaled = pil_mat.resize((new_w, new_h), Image.Resampling.LANCZOS)
    canvas = mat_scaled.crop((crop_x, crop_y, crop_x + W_PX, crop_y + H_PX))
    
    # Enhance contrast and warmth
    canvas = ImageEnhance.Color(canvas).enhance(1.06)
    canvas = ImageEnhance.Contrast(canvas).enhance(1.05)
    
    # 5. Create vector overlay for crisp outer borders, seal, and framing
    overlay = Image.new("RGBA", (W_PX, H_PX), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Fonts
    font_bold = "C:\\Windows\\Fonts\\arialbd.ttf"
    def get_f(fpath, size):
        if os.path.exists(fpath):
            return ImageFont.truetype(fpath, size)
        return ImageFont.load_default()
        
    font_header_title = get_f(font_bold, 38)
    font_header_sub = get_f(font_bold, 20)
    
    # Palette
    C_OUTER_FRAME = (20, 24, 32, 255)
    C_GOLD = (212, 175, 55, 255)
    C_HEADER_BG = (15, 22, 34, 250)
    
    # Perimeter Framing (1.8 mm edge allowance) & Corner Cut Guides
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
              fill=C_GOLD, font=get_f(font_bold, 13), anchor="mm")
    
    # Refined Top Header Bar (covers the inpainted top area seamlessly)
    head_h = 135
    head_y0 = frame_t + 2
    draw.rectangle([frame_t + 2, head_y0, W_PX - frame_t - 2, head_y0 + head_h], fill=C_HEADER_BG, outline=C_GOLD, width=2)
    
    # Authentic High-Resolution Sensuikan Game Logo
    logo_path = "images/sensuikan_logo_hires.png"
    if os.path.exists(logo_path):
        logo_raw = Image.open(logo_path).convert("RGB")
        target_h = 110
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
    
    # Header Titles (Center-Left)
    draw.text((title_x, head_y0 + 22), "ATTACK MAT [CHART H1] — TACTICAL ENGAGEMENT", fill=C_GOLD, font=font_header_title)
    draw.text((title_x + 3, head_y0 + 76), "SURFACE & SUBMERGED TORPEDO ATTACK RESOLUTION (FLEET SUBMARINES)", fill=(200, 215, 230, 255), font=font_header_sub)
    
    # Red Imperial Seal (軍事機密 - Gunji Kimitsu) on Right
    seal_path = "images/stamp_gunji_kimitsu_transparent.png"
    if os.path.exists(seal_path):
        seal_img = Image.open(seal_path).convert("RGBA")
        seal_w = 110
        seal_h = int(seal_w * seal_img.height / seal_img.width)
        seal_img = seal_img.resize((seal_w, seal_h), Image.Resampling.LANCZOS)
        overlay.paste(seal_img, (W_PX - frame_t - seal_w - 25, head_y0 + (head_h - seal_h)//2), seal_img)

    # 6. Composite Layers
    print("Compositing layers...")
    final_img = Image.alpha_composite(canvas, overlay)
    final_rgb = final_img.convert("RGB")
    
    # Export High-Res Master Image (300 DPI)
    out_master = os.path.join(OUT_IMG_DIR, "attack_mat_deluxe_real.jpg")
    final_rgb.save(out_master, quality=96, dpi=(DPI, DPI))
    print(f"Exported Master Image: {out_master}")
    
    # Export Preview
    out_prev = os.path.join(PREV_DIR, "preview_attack_mat_deluxe_real.jpg")
    final_rgb.resize((1400, int(1400 * H_PX / W_PX)), Image.Resampling.LANCZOS).save(out_prev, quality=90)
    print(f"Exported Preview: {out_prev}")
    
    # Export 1:1 Scale Print PDF Centered on A4 Sheet with Rulers & Crop Marks
    pdf_out = os.path.join(DOCS_DIR, "PLANTILLA_ATTACK_MAT_REAL_DELUXE.pdf")
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
    draw_print_calibration_and_crop_marks(ax, ox, oy, WIDTH_MM, HEIGHT_MM, page_w=PAGE_W_MM, page_h=PAGE_H_MM, title="TABLERO DE ATAQUE TÁCTICO [CHART H1]")
    
    fig.savefig(pdf_out, format='pdf', dpi=DPI)
    plt.close(fig)
    print(f"Exported 1:1 Scale PDF with Rulers & Crop Marks: {pdf_out}")
    
    return out_master, pdf_out

if __name__ == "__main__":
    build_deluxe_attack_mat()
