import cv2, os, numpy as np

crops_dir = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/mat_torp_inspect'
files = sorted([f for f in os.listdir(crops_dir) if f.endswith('.jpg')])

for f in files:
    img = cv2.imread(os.path.join(crops_dir, f))
    h, w = img.shape[:2]
    # Let's write out high-res crops of just the text / numbers
    # Save a small composite or examine dimensions
    print(f"Loaded {f}: shape={img.shape}")
