import os
import cv2
import numpy as np
from PIL import Image

print("=========================================================================")
print("BUILDING 100% CLEAN HOMOGENEOUS PROFILE BANNERS FOR 6 FANMADE SUBMARINES")
print("=========================================================================")

profiles_dir = "app/assets/submarines_profiles"
remastered_dir = "images/subs/remastered"
os.makedirs(profiles_dir, exist_ok=True)
os.makedirs(remastered_dir, exist_ok=True)

# 1. Base template frame and background from Type_C3_Class.png
c3_img = Image.open(os.path.join(profiles_dir, "Type_C3_Class.png")).convert('RGB')
c3_arr = np.array(c3_img)

# Extract Imperial Wax Seal with clean alpha & solid interior
seal_crop = c3_img.crop((1055, 15, 1205, 145)).convert('RGBA')
s_arr = np.array(seal_crop, dtype=np.uint8)
red_mask = ((s_arr[:, :, 0] > 105) & (s_arr[:, :, 1] < 65) & (s_arr[:, :, 2] < 65)).astype(np.uint8)
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
closed_mask = cv2.morphologyEx(red_mask, cv2.MORPH_CLOSE, kernel)
contours, _ = cv2.findContours(closed_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
solid_mask = np.zeros_like(red_mask)
for cnt in contours:
    if cv2.contourArea(cnt) > 1000:
        cv2.drawContours(solid_mask, [cnt], -1, 255, -1)
solid_mask = cv2.GaussianBlur(solid_mask, (3, 3), 0)
s_arr[:, :, 3] = solid_mask
seal_img = Image.fromarray(s_arr, mode='RGBA')

# Create clean base canvas: 1226x273 with warm parchment and nautical border
# Frame at row 3 and col 3, border width 2px
clean_base = Image.new('RGB', (1226, 273), (242, 233, 219))
# Copy border from c3_img
clean_arr = np.array(clean_base)
clean_arr[:6, :] = c3_arr[:6, :]
clean_arr[-6:, :] = c3_arr[-6:, :]
clean_arr[:, :6] = c3_arr[:, :6]
clean_arr[:, -6:] = c3_arr[:, -6:]
clean_base = Image.fromarray(clean_arr)

# 2. Specs for the 6 fanmade classes
fanmade_meta = [
    {
        "key": "Junsen_J1_Class",
        "remastered_key": "19_Junsen_J1",
        "scratch_file": "scratch/Junsen_J1_Class_profile.png",
        "crop_box": (50, 15, 1170, 255),
        "target_w": 980,
        "target_h": 225
    },
    {
        "key": "Kaichu_VII_Class",
        "remastered_key": "20_Kaichu_VII",
        "scratch_file": "scratch/Kaichu_VII_Class_profile.png",
        "crop_box": (50, 15, 1175, 255),
        "target_w": 940,
        "target_h": 225
    },
    {
        "key": "Type_A2_Class",
        "remastered_key": "24_Type_A2",
        "scratch_file": "scratch/Type_A2_Class_profile.png",
        "crop_box": (30, 25, 1200, 245),
        "target_w": 1020,
        "target_h": 225
    },
    {
        "key": "Type_B2_Class",
        "remastered_key": "21_Type_B2",
        "scratch_file": "scratch/Type_B2_Class_profile.png",
        "crop_box": (30, 30, 1195, 240),
        "target_w": 1010,
        "target_h": 220
    },
    {
        "key": "Type_C2_Class",
        "remastered_key": "22_Type_C2",
        "scratch_file": "scratch/Type_C2_Class_profile.png",
        "crop_box": (392, 58, 835, 175), # actual sub bounding box
        "target_w": 1000,
        "target_h": 225
    },
    {
        "key": "Type_D1_Class",
        "remastered_key": "23_Type_D1",
        "scratch_file": "scratch/Type_D1_Class_profile.png",
        "crop_box": (245, 28, 978, 205),
        "target_w": 920,
        "target_h": 220
    }
]

for meta in fanmade_meta:
    key = meta["key"]
    scratch_p = meta["scratch_file"]
    
    src = Image.open(scratch_p).convert('RGB')
    sub_crop = src.crop(meta["crop_box"])
    
    # Extract sub silhouette with alpha
    sub_arr = np.array(sub_crop, dtype=float)
    # Background in scratch is approx (242, 233, 219) or (239, 226, 210)
    # Check corners to get background color
    bg_col = sub_arr[0, 0, :3]
    d = np.sqrt(np.sum((sub_arr[:, :, :3] - bg_col) ** 2, axis=-1))
    
    # Exclude seal if present
    h_c, w_c = sub_arr.shape[:2]
    d[:int(h_c * 0.4), int(w_c * 0.8):] = np.where(d[:int(h_c * 0.4), int(w_c * 0.8):] < 120, 0, d[:int(h_c * 0.4), int(w_c * 0.8):])
    
    alpha = np.clip((d - 10) / 18.0, 0.0, 1.0) * 255.0
    rgba = np.dstack([sub_arr[:, :, :3], alpha]).astype(np.uint8)
    sub_trans = Image.fromarray(rgba, mode='RGBA')
    
    # Resize proportionally to fit target dimensions
    scale = min(meta["target_w"] / sub_trans.width, meta["target_h"] / sub_trans.height)
    new_w = int(sub_trans.width * scale)
    new_h = int(sub_trans.height * scale)
    sub_resized = sub_trans.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Build clean profile banner
    banner = clean_base.copy()
    
    # Center submarine in banner:
    # X from 50 to 1100 (seal is at 1055, so sub center around 570)
    paste_x = 50 + (1000 - new_w) // 2
    paste_y = 15 + (240 - new_h) // 2
    
    banner.paste(sub_resized, (paste_x, paste_y), sub_resized)
    
    # Paste clean Imperial Wax Seal at top-right
    banner.paste(seal_img, (1055, 18), seal_img)
    
    # Save into app/assets/submarines_profiles/
    out_profile = os.path.join(profiles_dir, f"{key}.png")
    banner.save(out_profile, format='PNG')
    
    print(f"✓ Created clean profile banner: {out_profile} (Sub size: {new_w}x{new_h}, with Imperial Seal)")

print("\nAll 6 Fanmade Submarine Profiles Created with 100% Homogeneity!")
