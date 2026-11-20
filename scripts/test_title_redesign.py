import os
from PIL import Image, ImageDraw, ImageFont

cards_dir = "app/assets/submarines_cards"
artifact_dir = "C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17"

# Load base clean card
im = Image.open(os.path.join(cards_dir, "Type_B_Class_es.webp")).convert("RGB")
draw = ImageDraw.Draw(im)

# Title area in base card is x=328..815, y=28..125
# Let's inspect background color in title area
bg_color = (250, 248, 243) # exact shipyard paper cream

font_title = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 26)
font_sub = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 13)
font_badge = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 10)

# 1. Fill title area (without touching Sensuikan logo on left or specs plaque on right)
draw.rectangle([330, 28, 815, 122], fill=bg_color)

# 2. Draw Title Text
draw.text((345, 38), "CLASE TYPE B2 (SERIE I-40)", fill=(15, 23, 42), font=font_title)
draw.text((345, 74), "CRUCERO SUBMARINO | TIPO OTSU-GATA MOD.", fill=(71, 85, 105), font=font_sub)

# 3. Add small gold fanmade badge
badge_box = [345, 96, 480, 116]
draw.rectangle(badge_box, fill=(245, 158, 11), outline=(180, 110, 10), width=1)
draw.text(((badge_box[0]+badge_box[2])//2, 106), "★ REAL HISTORICAL [FANMADE]", fill=(15, 23, 42), font=font_badge, anchor="mm")

# Crop and save inspection
crop = im.crop((30, 20, 1150, 140))
crop.save(os.path.join(artifact_dir, "test_clean_title_b2.png"))
print("Saved test_clean_title_b2.png")
