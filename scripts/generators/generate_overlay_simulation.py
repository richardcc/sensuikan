import os
import sys
import numpy as np
import cv2
import pymupdf # fitz
from PIL import Image, ImageDraw, ImageFont, ImageFilter

repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
p1 = os.path.join(repo_root, 'pdf', 'sensuikan_canonical_player_cards_universal_18subs.pdf')
p2 = os.path.join(repo_root, 'pdf', 'sensuikan_canonical_player_cards_universal_v2_18subs.pdf')
pdf_path = p1 if not os.path.exists(p2) or os.path.getmtime(p1) >= os.path.getmtime(p2) else p2

out_dir = r'C:\Users\Richard\.gemini\antigravity\brain\c08a1950-d03a-4ae3-aef2-f14946ddab17'
os.makedirs(out_dir, exist_ok=True)

# 1. Render Page 0 (Kaidai KD.3) from PDF at 240 DPI
doc = pymupdf.open(pdf_path)
page = doc[0]
dpi = 240
pix = page.get_pixmap(dpi=dpi)
img_paper = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

pw_mm, ph_mm = 297.0, 210.0
scale_x = pix.width / pw_mm
scale_y = pix.height / ph_mm

card_w = 238.0
card_h = 181.5
ox_mm = (pw_mm - card_w) / 2.0
oy_mm = (ph_mm - card_h) / 2.0

overlay_w = 237.6
overlay_h = 181.1
overlay_x0 = ox_mm + 0.2
overlay_y0 = oy_mm + 0.2

mask_holes = Image.new('L', (pix.width, pix.height), 0)
draw_holes = ImageDraw.Draw(mask_holes)

def mm_to_px(x_mm, y_top_mm):
    px = (overlay_x0 + x_mm) * scale_x
    py = (overlay_y0 + y_top_mm) * scale_y
    return px, py

def add_hole_rect(x_mm, y_top_mm, w_mm, h_mm):
    x0, y0 = mm_to_px(x_mm, y_top_mm)
    x1, y1 = mm_to_px(x_mm + w_mm, y_top_mm + h_mm)
    draw_holes.rectangle([x0, y0, x1, y1], fill=255)

def add_slot(cx_mm, cy_top_mm, size=15.0):
    add_hole_rect(cx_mm - size/2.0, cy_top_mm - size/2.0, size, size)

# 1. Base slots (left column)
for y_top in [28.5, 46.5, 64.5]:
    add_slot(10.0, y_top)

# 2. Patrol track (9 slots)
cols9 = np.linspace(28.0, 156.0, 9)
for x in cols9:
    add_slot(x, 64.5)

# 3. Damage tracks
add_slot(10.0, 82.5)
add_slot(10.0, 99.5)
for x in cols9:
    add_slot(x, 82.5)
    add_slot(x, 99.5)

# 4. Middle band: Crew Status (Shifted 1 column left: 10.0 + cols 0..3) + Systems Status (cols 5..8)
for x in [10.0] + list(cols9[:4]):
    add_slot(x, 119.5)
    add_slot(x, 136.5)

for x in cols9[5:]:
    add_slot(x, 119.5)
    add_slot(x, 136.5)

# 5. Right block: 10 rows x 4 columns!
col_x = [178.5, 195.0, 211.5, 228.0]
# Row 0: Aircraft & Events
for x in col_x: add_slot(x, 13.5)
# Row 1: Bow tubes 1..4
for x in col_x: add_slot(x, 32.7)
# Row 2: Bow tubes 5..8
for x in col_x: add_slot(x, 49.2)
# Row 3: Stern tubes & reloads
for x in col_x: add_slot(x, 68.4)
# Row 4: Artillery & AA (4 slots)
for x in col_x: add_slot(x, 87.6)
# Rows 5, 6, 7, 8: 16 Forward Torpedo Reloads!
for ry in [107.0, 123.5, 140.0, 156.5]:
    for x in col_x:
        add_slot(x, ry)

# 3 Large Observation Windows
add_hole_rect(2.5, 2.5, 161.0, 16.0)      # Title block
add_hole_rect(20.5, 21.0, 143.0, 31.0)    # Submarine dossier & specs
add_hole_rect(8.0, 145.5, 155.5, 18.5)    # Special rules & historical notes (aligned with chits at Y=164.0)

# Build realistic 3D plastic overlay layer
plate_color = (26, 32, 44)
plastic_layer = Image.new('RGBA', (pix.width, pix.height), (0, 0, 0, 0))

ox0_px = overlay_x0 * scale_x
oy0_px = overlay_y0 * scale_y
ox1_px = (overlay_x0 + overlay_w) * scale_x
oy1_px = (overlay_y0 + overlay_h) * scale_y

draw_plastic = ImageDraw.Draw(plastic_layer)
draw_plastic.rectangle([ox0_px, oy0_px, ox1_px, oy1_px], fill=(*plate_color, 248))

plastic_arr = np.array(plastic_layer)
holes_arr = np.array(mask_holes)
plastic_arr[holes_arr > 0, 3] = 0

# Bevel shadow
shadow_mask = mask_holes.filter(ImageFilter.GaussianBlur(radius=2.5))
shadow_arr = np.array(shadow_mask)
bevel_layer = Image.new('RGBA', (pix.width, pix.height), (0, 0, 0, 0))
bevel_arr = np.array(bevel_layer)
edge_shadow = np.clip((shadow_arr.astype(float) - holes_arr.astype(float) * 0.4), 0, 255).astype(np.uint8)
bevel_arr[..., 3] = (edge_shadow * 0.6).astype(np.uint8)

comp = Image.alpha_composite(img_paper.convert('RGBA'), Image.fromarray(bevel_arr))
comp = Image.alpha_composite(comp, Image.fromarray(plastic_arr))

draw_comp = ImageDraw.Draw(comp)

try:
    font_sec = ImageFont.truetype("arialbd.ttf", int(scale_y * 2.2))
    font_slot = ImageFont.truetype("arialbd.ttf", int(scale_y * 1.7))
    font_mini = ImageFont.truetype("arialbd.ttf", int(scale_y * 1.5))
except:
    font_sec = ImageFont.load_default()
    font_slot = font_sec
    font_mini = font_sec

gold_col = (250, 204, 21, 255)
white_col = (241, 245, 249, 255)
cyan_col = (56, 189, 248, 255)

def draw_engraved_text(x_mm, y_top_mm, text, font, color=gold_col, align='center'):
    px, py = mm_to_px(x_mm, y_top_mm)
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = px - tw/2.0 if align == 'center' else px
    ty = py - th/2.0
    draw_comp.text((tx+1, ty+1), text, font=font, fill=(10, 15, 20, 220))
    draw_comp.text((tx, ty), text, font=font, fill=color)

# Section Headers on 3D Plastic:
draw_engraved_text(92.0, 54.5, "PATROL TRACK (TRANSIT & ON-STATION PHASES)", font_sec, gold_col)
draw_engraved_text(92.0, 73.5, "DAMAGE TRACKS (FLOODING & HULL DAMAGE)", font_sec, gold_col)
draw_engraved_text(43.0, 109.5, "CREW STATUS & QUALITY", font_sec, gold_col)
draw_engraved_text(132.0, 109.5, "⚙ SYSTEMS STATUS", font_sec, cyan_col)

# Right Column Sections on 3D Plastic:
draw_engraved_text(203.2, 3.5, "✈ AIRCRAFT & TACTICAL EVENT", font_sec, gold_col)
draw_engraved_text(203.2, 23.2, "▲ FORWARD TORPEDO TUBES (1–8)", font_sec, gold_col)
draw_engraved_text(203.2, 58.9, "▼ AFT TUBES & RELOADS", font_sec, gold_col)
draw_engraved_text(203.2, 78.1, "⚔ ARTILLERY & DECK WEAPONS", font_sec, gold_col)

# Slots row 4 labels
draw_engraved_text(col_x[0], 79.5, "DECK GUN", font_mini, white_col)
draw_engraved_text(col_x[1], 79.5, "AMMO", font_mini, white_col)
draw_engraved_text(col_x[2], 79.5, "AA GUN", font_mini, white_col)
draw_engraved_text(col_x[3], 79.5, "SPECIAL", font_mini, white_col)

# 16 Reloads header
draw_engraved_text(203.2, 97.5, "▲ FORWARD TORPEDO RELOADS (1–16)", font_sec, gold_col)

# Save the full superimposed board
out_full = os.path.join(out_dir, 'simulation_superimposed_board_kd3.png')
comp.save(out_full, quality=95)
print(f'Full superimposed board simulation saved to: {out_full}')

# 2. Macro Close-Up: Middle Band (Crew + Systems) and Full-Width Special Rules
x0_crop, y0_crop = mm_to_px(5.0, 95.0)
x1_crop, y1_crop = mm_to_px(237.0, 182.0)

crop_detail = comp.crop((int(x0_crop), int(y0_crop), int(x1_crop), int(y1_crop)))
draw_detail = ImageDraw.Draw(crop_detail)

out_detail = os.path.join(out_dir, 'simulation_detail_reloads_and_rules.png')
crop_detail.save(out_detail, quality=95)
print(f'Detail close-up simulation saved to: {out_detail}')
