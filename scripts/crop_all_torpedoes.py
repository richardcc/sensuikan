import cv2, os

vassal_dir = 'images/vassal'
files = [f for f in os.listdir(vassal_dir) if f.endswith('.jpg') and not f.startswith('Kaiten')]

out_dir = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/mat_crops'
os.makedirs(out_dir, exist_ok=True)

for fname in sorted(files):
    p = os.path.join(vassal_dir, fname)
    img = cv2.imread(p)
    if img is None:
        continue
    h, w = img.shape[:2]
    # On Sensuikan mats, torpedo layout is in the upper right / middle right quadrant
    # roughly x: 0.55*w to w, y: 0 to 0.65*h
    crop = img[int(0.0*h):int(0.65*h), int(0.52*w):int(1.0*w)]
    base = os.path.splitext(fname)[0].replace(' ', '_')
    out_crop = os.path.join(out_dir, f"{base}_torps.jpg")
    cv2.imwrite(out_crop, crop)

print(f"Generated {len(files)} crops in {out_dir}")
