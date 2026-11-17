import cv2
import numpy as np
import json

# Master grid definition in 525x408 image space
scale_x = 280.0 / 525.0
scale_y = 170.0 / 408.0

cols = [384, 414, 444, 474]
row_aircraft = [23]
rows_tubes = [57, 87]
bin_rect = (384, 120, 118, 60)
rows_weapons = [194, 223]
rows_systems = [241, 271, 301, 331, 361]

# Build universal slot list
universal_slots = []
# Row 0: Aircraft & Events (4 boxes)
for c in cols:
    universal_slots.append(('aircraft_events', c, row_aircraft[0]))

# Rows 1 & 2: Torpedo tubes (8 boxes)
for r in rows_tubes:
    for c in cols:
        universal_slots.append(('torpedo_tubes', c, r))

# Rows 4 & 5: Weapons & Kaiten (8 boxes)
for r in rows_weapons:
    for c in cols:
        universal_slots.append(('weapons_kaiten', c, r))

# Rows 6-10: Systems matrix (20 boxes)
for r in rows_systems:
    for c in cols:
        universal_slots.append(('systems', c, r))

print(f"Total Universal Counter Slots: {len(universal_slots)} + 1 Reloads Bin")

# Let's test overlaying on multiple classes
def draw_overlay_on_image(img, title_str):
    vis = img.copy()
    overlay_layer = np.zeros_like(vis)
    
    # Draw dark overlay background on right side (x > 360)
    cv2.rectangle(overlay_layer, (355, 0), (vis.shape[1], vis.shape[0]), (35, 30, 25), -1)
    
    # Cut out holes
    # 1. Reloads bin
    bx, by, bw, bh = bin_rect
    cv2.rectangle(overlay_layer, (bx, by), (bx + bw, by + bh), (0, 0, 0), -1)
    cv2.rectangle(vis, (bx, by), (bx + bw, by + bh), (0, 255, 255), 2)
    
    # 2. Counter holes
    for sec, cx, cy in universal_slots:
        # box 28x28
        cv2.rectangle(overlay_layer, (cx, cy), (cx + 26, cy + 26), (0, 0, 0), -1)
        # notch
        cv2.circle(overlay_layer, (cx + 26, cy + 13), 4, (0, 0, 0), -1)
        # border on vis
        cv2.rectangle(vis, (cx, cy), (cx + 26, cy + 26), (0, 255, 0), 1)
        cv2.circle(vis, (cx + 26, cy + 13), 3, (0, 255, 0), 1)
        
    mask = (overlay_layer > 0).any(axis=2)
    vis[mask] = cv2.addWeighted(vis, 0.35, overlay_layer, 0.65, 0)[mask]
    cv2.putText(vis, title_str, (20, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    return vis

# Test on 4 key types:
j2 = cv2.imread("junsen_j2.png")
sentoku = cv2.resize(cv2.imread("photos/thumb_03.jpg"), (525, 408))
c3 = cv2.resize(cv2.imread("photos/thumb_00.jpg"), (525, 408))
kaidai = cv2.resize(cv2.imread("photos/thumb_09.jpg"), (525, 408))

v1 = draw_overlay_on_image(j2, "Junsen J.2 (Standard Cruiser Sub)")
v2 = draw_overlay_on_image(sentoku, "Sen-Toku I-400 (Carrier Sub - 3 Aircraft)")
v3 = draw_overlay_on_image(c3, "Type C.3 (Kaiten Carrier Sub)")
v4 = draw_overlay_on_image(kaidai, "Kaidai KD.6 (Fleet Submarine)")

# Save 2x2 comparison grid
row1 = np.hstack([v1, v2])
row2 = np.hstack([v3, v4])
full_sim = np.vstack([row1, row2])
cv2.imwrite("universal_overlay_simulation.jpg", full_sim)
print("Saved universal_overlay_simulation.jpg successfully!")
