import cv2
import numpy as np

subs = [
    ("Junsen J. 2", "junsen_j2.png"),
    ("Type C. 3", "photos/thumb_00.jpg"),
    ("Type A", "photos/thumb_02.jpg"),
    ("Sen-Toku (I-400)", "photos/thumb_03.jpg"),
    ("Junsen J. 1M", "photos/thumb_04.jpg"),
    ("Type A Modified", "photos/thumb_05.jpg"),
    ("Type B", "photos/thumb_06.jpg"),
    ("Type B. 3", "photos/thumb_07.jpg"),
    ("Type C", "photos/thumb_08.jpg"),
    ("Kaidai KD. 6", "photos/thumb_09.jpg"),
    ("Sen-Taka", "photos/thumb_10.jpg"),
    ("Junsen J. 3", "photos/thumb_11.jpg"),
    ("Kaidai KD. 3", "photos/thumb_12.jpg"),
    ("Kaidai KD. 4", "photos/thumb_13.jpg"),
    ("Kaidai KD. 7", "photos/thumb_14.jpg"),
    ("Kirai-Sen", "photos/thumb_15.jpg"),
    ("Kaidai KD. 5", "photos/thumb_16.jpg")
]

results = []
for name, f in subs:
    im = cv2.imread(f)
    if im is None:
        continue
    im_norm = cv2.resize(im, (2800, 1700))
    zone = im_norm[600:1100, 1400:2200]
    b, g, r = cv2.split(zone)
    # Red mask: R high, G and B low
    red_mask = (r > 120) & (g < 80) & (b < 80)
    cnts, _ = cv2.findContours(red_mask.astype(np.uint8)*255, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    sunk_boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if 60 <= w <= 220 and 60 <= h <= 220:
            sunk_boxes.append((x + 1400, y + 600, w, h))
            
    if sunk_boxes:
        # Take the rightmost red box if multiple
        sunk_boxes.sort(key=lambda b: b[0], reverse=True)
        sb = sunk_boxes[0]
        x_start_mm = sb[0] / 10.0
        x_end_mm = (sb[0] + sb[2]) / 10.0
        y_center_mm = (sb[1] + sb[3]/2.0) / 10.0
        results.append((name, x_start_mm, x_end_mm, y_center_mm))
    else:
        results.append((name, None, None, None))

print(f"{'Submarine':25s} | {'SUNK X Start':12s} | {'SUNK X End':10s} | {'Y Center':8s}")
print("-" * 65)
for r in results:
    if r[1] is not None:
        print(f"{r[0]:25s} | {r[1]:10.1f} mm | {r[2]:8.1f} mm | {r[3]:6.1f} mm")
    else:
        print(f"{r[0]:25s} | NOT FOUND")
