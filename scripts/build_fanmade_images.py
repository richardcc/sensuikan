import os
import shutil
from PIL import Image, ImageDraw, ImageFont

print("Generating Fanmade submarine images (Profiles + Counter Chits)...")

# =========================================================================
# 1. COUNTER CHITS (64x64)
# =========================================================================
chits_dir = "app/assets/chits"
font_path = "C:/Windows/Fonts/timesbd.ttf"
if not os.path.exists(font_path):
    font_path = "C:/Windows/Fonts/arialbd.ttf"

font = ImageFont.truetype(font_path, 10)

fanmade_chits = [
    {
        "base": "Submarine - Type B.jpg",
        "output": "Submarine - Type B.2.jpg",
        "label": "Type B.2"
    },
    {
        "base": "Submarine - Type C.jpg",
        "output": "Submarine - Type C.2.jpg",
        "label": "Type C.2"
    },
    {
        "base": "Submarine - Type A.jpg",
        "output": "Submarine - Type A.2.jpg",
        "label": "Type A.2"
    },
    {
        "base": "Submarine - Type C.3.jpg",
        "output": "Submarine - Type D.1.jpg",
        "label": "Type D.1"
    },
    {
        "base": "Submarine - KD.6.jpg",
        "output": "Submarine - Kaichu VII.jpg",
        "label": "Ro-35"
    },
    {
        "base": "Submarine - Junsen J1M.jpg",
        "output": "Submarine - Junsen J1.jpg",
        "label": "Junsen J1"
    }
]

for item in fanmade_chits:
    base_path = os.path.join(chits_dir, item["base"])
    out_path = os.path.join(chits_dir, item["output"])
    
    im = Image.open(base_path).convert("RGB")
    draw = ImageDraw.Draw(im)
    
    # White out the top text zone (x: 4..60, y: 7..21)
    # Sampling background color at (32, 5)
    bg_color = im.getpixel((32, 5))
    draw.rectangle([4, 7, 59, 21], fill=bg_color)
    
    # Calculate text bounding box to center it perfectly
    bbox = draw.textbbox((0, 0), item["label"], font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    text_x = int((64 - text_w) / 2)
    text_y = int(14 - (text_h / 2))
    
    # Draw crisp black text
    draw.text((text_x, text_y), item["label"], fill=(0, 0, 0), font=font)
    
    im.save(out_path, quality=98)
    print(f"✓ Created Chit: {item['output']} (Label: '{item['label']}')")

# =========================================================================
# 2. PROFILE BLUEPRINTS (1226x273)
# =========================================================================
profiles_dir = "app/assets/submarines_profiles"
backup_profiles_dir = "data/backup_assets/submarines_custom"

fanmade_profiles = [
    {
        "base": "Type_B_Class.png",
        "output": "Type_B2_Class.png",
        "class_name": "Type B2 Class"
    },
    {
        "base": "Type_C_Class.png",
        "output": "Type_C2_Class.png",
        "class_name": "Type C2 Class"
    },
    {
        "base": "Type_A_Modified.png",
        "output": "Type_A2_Class.png",
        "class_name": "Type A2 Class"
    },
    {
        "base": "Type_C3_Class.png",
        "output": "Type_D1_Class.png",
        "class_name": "Type D1 Class"
    },
    {
        "base": "Kaidai_KD6_Class.png",
        "output": "Kaichu_VII_Class.png",
        "class_name": "Kaichu VII Class"
    },
    {
        "base": "Junsen_J_IM_Class.png",
        "output": "Junsen_J1_Class.png",
        "class_name": "Junsen J1 Class"
    }
]

for item in fanmade_profiles:
    base_path = os.path.join(profiles_dir, item["base"])
    out_path = os.path.join(profiles_dir, item["output"])
    out_backup = os.path.join(backup_profiles_dir, item["output"])
    
    im = Image.open(base_path).convert("RGB")
    
    # Save high-res profile PNG
    im.save(out_path, format="PNG")
    if os.path.exists(backup_profiles_dir):
        im.save(out_backup, format="PNG")
        
    print(f"✓ Created Profile: {item['output']} from {item['base']}")

print("\nAll Fanmade images generated successfully!")
