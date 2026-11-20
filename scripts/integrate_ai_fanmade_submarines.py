import os
import shutil
from PIL import Image, ImageDraw
import numpy as np

print("Integrating AI-Generated Submarine Profiles & Player Cards...")

profiles_dir = "app/assets/submarines_profiles"
cards_dir = "app/assets/submarines_cards"
backup_profiles_dir = "data/backup_assets/submarines_custom"
os.makedirs(profiles_dir, exist_ok=True)
os.makedirs(cards_dir, exist_ok=True)
os.makedirs(backup_profiles_dir, exist_ok=True)

# 1. Source AI images from subagent output
fanmade_subs = [
    {
        "key": "Type_B2_Class",
        "name_es": "Clase Type B2 (Serie I-40)",
        "name_en": "Type B2 Class (I-40 Series)",
        "source": r"C:\Users\Richard\.gemini\antigravity\brain\0975d495-1000-4c1e-ba39-9c738d974976\fanmade_sub_type_b2_1795126678338.jpg"
    },
    {
        "key": "Type_C2_Class",
        "name_es": "Clase Type C2 (Serie I-46)",
        "name_en": "Type C2 Class (I-46 Series)",
        "source": r"C:\Users\Richard\.gemini\antigravity\brain\0975d495-1000-4c1e-ba39-9c738d974976\fanmade_sub_type_c2_1795126692026.jpg"
    },
    {
        "key": "Type_A2_Class",
        "name_es": "Clase Type A2 (Serie I-13 / Seiran)",
        "name_en": "Type A2 Class (I-13 Series / Seiran)",
        "source": r"C:\Users\Richard\.gemini\antigravity\brain\0975d495-1000-4c1e-ba39-9c738d974976\fanmade_sub_type_a2_1795126704403.jpg"
    },
    {
        "key": "Type_D1_Class",
        "name_es": "Clase Type D1 (Sen-Yu-Sho / Daihatsu)",
        "name_en": "Type D1 Class (Sen-Yu-Sho / Daihatsu)",
        "source": r"C:\Users\Richard\.gemini\antigravity\brain\0975d495-1000-4c1e-ba39-9c738d974976\fanmade_sub_type_d1_1795126717157.jpg"
    },
    {
        "key": "Kaichu_VII_Class",
        "name_es": "Clase Kaichu VII (Serie Ro-35)",
        "name_en": "Kaichu VII Class (Ro-35 Series)",
        "source": r"C:\Users\Richard\.gemini\antigravity\brain\0975d495-1000-4c1e-ba39-9c738d974976\fanmade_sub_type_kaichu_vii_1795126746225.jpg"
    },
    {
        "key": "Junsen_J1_Class",
        "name_es": "Clase Junsen J1 (Doble Cañón 140mm)",
        "name_en": "Junsen J1 Class (Twin 140mm Guns)",
        "source": r"C:\Users\Richard\.gemini\antigravity\brain\0975d495-1000-4c1e-ba39-9c738d974976\fanmade_sub_type_junsen_j1_1795126761926.jpg"
    }
]

def make_seamless_profile(img_path, target_size=(1226, 273), bg_target=(239, 226, 210)):
    im = Image.open(img_path).convert('RGB')
    arr = np.array(im, dtype=float)
    bg_sample = (arr[5:25, 5:25].mean(axis=(0, 1)) + arr[5:25, -25:-5].mean(axis=(0, 1))) / 2.0
    diff = np.sqrt(np.sum((arr - bg_sample) ** 2, axis=-1))
    
    active_rows = np.where(np.sum(diff > 35, axis=1) > 20)[0]
    y_min, y_max = active_rows.min(), active_rows.max()
    active_cols = np.where(np.sum(diff[y_min:y_max+1] > 35, axis=0) > 3)[0]
    x_min, x_max = active_cols.min(), active_cols.max()
    
    pad_x = 10
    pad_y = 6
    x0, x1 = max(0, x_min - pad_x), min(im.width, x_max + pad_x)
    y0, y1 = max(0, y_min - pad_y), min(im.height, y_max + pad_y)
    
    crop_arr = arr[y0:y1, x0:x1]
    crop_diff = diff[y0:y1, x0:x1]
    alpha = np.clip((crop_diff - 12) / 30.0, 0.0, 1.0)[:, :, np.newaxis]
    target_arr = np.full_like(crop_arr, bg_target)
    blended_crop = (crop_arr * alpha + target_arr * (1.0 - alpha)).astype(np.uint8)
    
    sub_crop = Image.fromarray(blended_crop)
    target_w, target_h = target_size[0] - 50, target_size[1] - 30
    scale = min(target_w / sub_crop.width, target_h / sub_crop.height)
    new_w, new_h = int(sub_crop.width * scale), int(sub_crop.height * scale)
    resized_sub = sub_crop.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    canvas = Image.new('RGB', target_size, bg_target)
    paste_x = (target_size[0] - new_w) // 2
    paste_y = (target_size[1] - new_h) // 2
    canvas.paste(resized_sub, (paste_x, paste_y))
    return canvas

# Process each fanmade submarine
for sub in fanmade_subs:
    key = sub["key"]
    src = sub["source"]
    
    # 1. Generate standard 1226x273 profile image
    prof = make_seamless_profile(src, target_size=(1226, 273), bg_target=(239, 226, 210))
    prof_out = os.path.join(profiles_dir, f"{key}.png")
    prof.save(prof_out, format="PNG")
    prof.save(os.path.join(backup_profiles_dir, f"{key}.png"), format="PNG")
    print(f"✓ Created Profile: {prof_out} (1226x273)")
    
    # 2. Update player cards in ES and EN
    target_w = 900
    target_h = 138
    scale = min(target_w / prof.width, target_h / prof.height)
    card_w = int(prof.width * scale)
    card_h = int(prof.height * scale)
    resized_for_card = prof.resize((card_w, card_h), Image.Resampling.LANCZOS)
    
    px = 160 + (target_w - card_w) // 2
    py = 230 + (target_h - card_h) // 2
    
    for lang in ["es", "en"]:
        card_file = os.path.join(cards_dir, f"{key}_{lang}.webp")
        if os.path.exists(card_file):
            card = Image.open(card_file).convert("RGB")
            bg_card = card.getpixel((300, 240))
            draw = ImageDraw.Draw(card)
            # Clear old sub silhouette
            draw.rectangle([160, 232, 1060, 368], fill=bg_card)
            # Paste new profile
            card.paste(resized_for_card, (px, py))
            card.save(card_file, format="WEBP", quality=92)
            print(f"  ✓ Updated Card: {card_file}")

print("\nAll Fanmade Submarine Images & Cards updated successfully!")
