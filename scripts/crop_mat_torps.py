import os, cv2

# Let's crop the text area above/around reloads for all mats to read them clearly!
vassal_dir = 'images/vassal'
mats = [
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

out_dir = 'C:/Users/Richard/.gemini/antigravity/brain/c08a1950-d03a-4ae3-aef2-f14946ddab17/mat_torp_inspect'
os.makedirs(out_dir, exist_ok=True)

for m in mats:
    p = os.path.join(vassal_dir, m)
    if not os.path.exists(p):
        print(f"Missing {m}")
        continue
    img = cv2.imread(p)
    h, w = img.shape[:2]
    # Torpedo section is roughly x: 0.6*w to w, y: 0.15*h to 0.7*h
    crop = img[int(0.18*h):int(0.68*h), int(0.58*w):int(0.98*w)]
    base = os.path.splitext(m)[0].replace(' ', '_')
    cv2.imwrite(os.path.join(out_dir, f"{base}.jpg"), crop)

print("Saved all 18 torpedo section crops!")
