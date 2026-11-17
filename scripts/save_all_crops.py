import os, cv2, numpy as np

# Let's inspect each vassal mat image in images/vassal/
# Specifically the right-hand area where tubes and reloads are drawn
vassal_dir = 'images/vassal'
files = [
    'Kaidai KD3 Class.jpg',
    'Kaidai KD4 Class.jpg',
    'Kaidai KD5 Class.jpg',
    'Kaidai KD6 Class.jpg',
    'Kaidai KD7 Class.jpg',
    'Kirai-Sen Class.jpg',
    'Junsen J IM Class.jpg',
    'Junsen J2 Class.jpg',
    'Junsen J3 Class.jpg',
    'Type A Class.jpg',
    'Type B Class.jpg',
    'Type B-3 Class.jpg',
    'Type C Class.jpg',
    'Type A Modified.jpg',
    'Sen-Toku Class.jpg',
    'Sen-Taka Class.jpg',
    'Type C3 Class.jpg',
    'Type A Midget Submarine - Ko-Hyoteki.jpg'
]

# We can crop the tube & reload section of each and save as an artifact or small images
out_dir = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/torpedo_audit'
os.makedirs(out_dir, exist_ok=True)

for fname in files:
    p = os.path.join(vassal_dir, fname)
    if not os.path.exists(p):
        continue
    img = cv2.imread(p)
    h, w = img.shape[:2]
    # Torpedo section on full mat (approx):
    # x: 62% to 98%, y: 22% to 75%
    c = img[int(h*0.20):int(h*0.75), int(w*0.62):int(w*0.98)]
    base = os.path.splitext(fname)[0].replace(' ', '_').replace('-', '_')
    cv2.imwrite(os.path.join(out_dir, f"{base}.png"), c)

print("Saved 18 crops in torpedo_audit/")
