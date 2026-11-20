import os
import cv2
import numpy as np
from PIL import Image

print("=========================================================================")
print("GENERATING PRISTINE REMASTERED IMAGES FOR 6 FANMADE SUBMARINES (1376x768)")
print("NO BORDER • NO SEAL (DRAWN DYNAMICALLY) • 100% UNIFORM PARCHMENT • 1:1 SCALE")
print("=========================================================================")

remastered_dir = "images/subs/remastered"
os.makedirs(remastered_dir, exist_ok=True)

fanmade_specs = [
    {
        "key": "Junsen_J1_Class",
        "remastered_file": "19_Junsen_J1.jpg",
        "scratch_file": "scratch/Junsen_J1_Class_profile.png",
        "crop_box": (50, 15, 1170, 255),
        "target_w": 1330
    },
    {
        "key": "Kaichu_VII_Class",
        "remastered_file": "20_Kaichu_VII.jpg",
        "scratch_file": "scratch/Kaichu_VII_Class_profile.png",
        "crop_box": (50, 15, 1175, 255),
        "target_w": 1280
    },
    {
        "key": "Type_A2_Class",
        "remastered_file": "24_Type_A2.jpg",
        "scratch_file": "scratch/Type_A2_Class_profile.png",
        "crop_box": (30, 25, 1200, 245),
        "target_w": 1340
    },
    {
        "key": "Type_B2_Class",
        "remastered_file": "21_Type_B2.jpg",
        "scratch_file": "scratch/Type_B2_Class_profile.png",
        "crop_box": (30, 30, 1195, 240),
        "target_w": 1340
    },
    {
        "key": "Type_C2_Class",
        "remastered_file": "22_Type_C2.jpg",
        "scratch_file": "scratch/Type_C2_Class_profile.png",
        "crop_box": (392, 58, 835, 175), # pure sub crop
        "target_w": 1340
    },
    {
        "key": "Type_D1_Class",
        "remastered_file": "23_Type_D1.jpg",
        "scratch_file": "scratch/Type_D1_Class_profile.png",
        "crop_box": (245, 28, 978, 205),
        "target_w": 1280
    }
]

for item in fanmade_specs:
    src_img = Image.open(item["scratch_file"]).convert('RGB')
    sub_crop = src_img.crop(item["crop_box"])
    
    # Clean alpha: remove parchment background from crop
    sub_arr = np.array(sub_crop, dtype=float)
    bg_col = sub_arr[0, 0, :3]
    d = np.sqrt(np.sum((sub_arr[:, :, :3] - bg_col) ** 2, axis=-1))
    
    # Exclude any seal or border pixels
    h_c, w_c = sub_arr.shape[:2]
    # top right area seal removal
    d[:int(h_c * 0.45), int(w_c * 0.78):] = np.where(d[:int(h_c * 0.45), int(w_c * 0.78):] < 130, 0, d[:int(h_c * 0.45), int(w_c * 0.78):])
    
    alpha = np.clip((d - 10) / 18.0, 0.0, 1.0) * 255.0
    rgba = np.dstack([sub_arr[:, :, :3], alpha]).astype(np.uint8)
    sub_trans = Image.fromarray(rgba, mode='RGBA')
    
    # Scale proportionally to target_w
    scale = item["target_w"] / sub_trans.width
    # If height exceeds 320, limit by height
    if sub_trans.height * scale > 320:
        scale = 320 / sub_trans.height
    new_w = int(sub_trans.width * scale)
    new_h = int(sub_trans.height * scale)
    sub_resized = sub_trans.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create pure parchment canvas (1376 x 768)
    canvas = Image.new('RGB', (1376, 768), (242, 233, 219))
    
    # Center submarine horizontally and vertically around y=384 (same as official 12_Type_B.jpg)
    paste_x = (1376 - new_w) // 2
    paste_y = (768 - new_h) // 2
    
    canvas.paste(sub_resized, (paste_x, paste_y), sub_resized)
    
    out_path = os.path.join(remastered_dir, item["remastered_file"])
    canvas.save(out_path, format='JPEG', quality=96)
    
    # Verify dark_rows and dark_cols
    check_img = cv2.imread(out_path)
    gray = cv2.cvtColor(check_img, cv2.COLOR_BGR2GRAY)
    dark_rows = np.where((gray < 185).any(axis=1))[0]
    dark_cols = np.where((gray < 185).any(axis=0))[0]
    print(f"✓ {item['key']:20s} -> {item['remastered_file']} ({new_w}x{new_h}): dark_rows={dark_rows.min()}..{dark_rows.max()} (h={dark_rows.max()-dark_rows.min()}), dark_cols={dark_cols.min()}..{dark_cols.max()} (w={dark_cols.max()-dark_cols.min()})")

print("\nAll 6 Remastered Submarines Successfully Generated!")
