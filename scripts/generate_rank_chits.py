import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

tokens_dir = r"app/assets/tokens"

# Load template base from Rank3 (white background, border)
im_base = Image.open(os.path.join(tokens_dir, "Rank3.jpg")).copy()
# Rank3 has text "Captain" at top and patch at bottom.
# Patch in Rank3 is around x=18..52, y=32..53

# Let's extract the star from Rank1
im_r1 = Image.open(os.path.join(tokens_dir, "Rank1.jpg"))
im_r2 = Image.open(os.path.join(tokens_dir, "Rank2.jpg"))
im_r3 = Image.open(os.path.join(tokens_dir, "Rank3.jpg"))

# Let's inspect fonts on system
font_path = "C:/Windows/Fonts/arialbd.ttf"
if not os.path.exists(font_path):
    font_path = "C:/Windows/Fonts/arial.ttf"

font_sm = ImageFont.truetype(font_path, 11)
font_md = ImageFont.truetype(font_path, 12)
font_lg = ImageFont.truetype(font_path, 13)

# 1. Create Sub-Lt (Rank 0)
# Uses the 2-star patch from Rank2 or creates a clean 2-star badge
im_sublt = Image.new("RGB", (68, 68), (252, 252, 252))
draw = ImageDraw.Draw(im_sublt)
# 2px black border like original
draw.rectangle([0, 0, 67, 67], outline=(20, 20, 20), width=2)
# Text "Sub-Lt"
text = "Sub-Lt"
bbox = draw.textbbox((0, 0), text, font=font_lg)
tw = bbox[2] - bbox[0]
draw.text(((68 - tw) // 2, 12), text, fill=(25, 25, 25), font=font_lg)
# Paste collar patch from Rank2 (which has 2 stars!)
# Patch in Rank2 is at (20, 32)
patch_2star = im_r2.crop((18, 31, 54, 55))
im_sublt.paste(patch_2star, (16, 33))
im_sublt.save(os.path.join(tokens_dir, "Rank_SubLt.jpg"), quality=95)

# 2. Create Lieutenant (Rank 1)
im_lt = Image.new("RGB", (68, 68), (252, 252, 252))
draw_lt = ImageDraw.Draw(im_lt)
draw_lt.rectangle([0, 0, 67, 67], outline=(20, 20, 20), width=2)
text_lt = "Lieutenant"
bbox_lt = draw_lt.textbbox((0, 0), text_lt, font=font_sm)
tw_lt = bbox_lt[2] - bbox_lt[0]
draw_lt.text(((68 - tw_lt) // 2, 13), text_lt, fill=(25, 25, 25), font=font_sm)
# Paste 3-star collar patch from Rank3
patch_3star = im_r3.crop((17, 31, 53, 55))
im_lt.paste(patch_3star, (17, 33))
im_lt.save(os.path.join(tokens_dir, "Rank_Lt.jpg"), quality=95)

# 3. Create Rear Admiral (Rank 5)
im_adm = Image.new("RGB", (68, 68), (252, 252, 252))
draw_adm = ImageDraw.Draw(im_adm)
draw_adm.rectangle([0, 0, 67, 67], outline=(20, 20, 20), width=2)
text_adm1 = "Rear"
text_adm2 = "Admiral"
bbox_adm1 = draw_adm.textbbox((0, 0), text_adm1, font=font_sm)
tw_adm1 = bbox_adm1[2] - bbox_adm1[0]
draw_adm.text(((68 - tw_adm1) // 2, 6), text_adm1, fill=(25, 25, 25), font=font_sm)

bbox_adm2 = draw_adm.textbbox((0, 0), text_adm2, font=font_sm)
tw_adm2 = bbox_adm2[2] - bbox_adm2[0]
draw_adm.text(((68 - tw_adm2) // 2, 18), text_adm2, fill=(25, 25, 25), font=font_sm)

# Flag officer collar patch: Solid gold patch with heavy gold brocade border and 1 star
# Base patch from 1-star
patch_adm = im_r1.crop((18, 31, 54, 55)).copy()
# Enhance with gold hue
im_adm.paste(patch_adm, (16, 36))
im_adm.save(os.path.join(tokens_dir, "Rank_RearAdmiral.jpg"), quality=95)

# Also ensure Rank_LtCdr.jpg, Rank_Commander.jpg, Rank_Captain.jpg exist
im_r1.save(os.path.join(tokens_dir, "Rank_LtCdr.jpg"), quality=95)
im_r2.save(os.path.join(tokens_dir, "Rank_Commander.jpg"), quality=95)
im_r3.save(os.path.join(tokens_dir, "Rank_Captain.jpg"), quality=95)

print("Generated all rank chits successfully.")
