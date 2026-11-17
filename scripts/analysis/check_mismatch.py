import cv2
import numpy as np
import json

# Let's compare Junsen J.2 and Kaidai KD.3 in exact 525x408 space:
j2 = cv2.imread("junsen_j2.png")
kd3 = cv2.imread("photos/thumb_12.jpg")
kd3_std = cv2.resize(kd3, (525, 408))

# Load J.2 holes from grid_definition.json
with open('grid_definition.json') as f:
    grid = json.load(f)

# Draw J.2 damage holes on KD3 image to show the mismatch!
vis = kd3_std.copy()
for b in grid.get('damage_flooding', []) + grid.get('damage_hull', []):
    x, y, w, h = b['box']
    x, y, w, h = int(x), int(y), int(w), int(h)
    cv2.rectangle(vis, (x, y), (x+w, y+h), (0, 0, 255), 2)
    cv2.putText(vis, "J2", (x+2, y+14), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)

# Now also draw the actual KD3 damage boxes in GREEN
# In KD3, Flooding is around y = 192 (not 216!)
# Hull is around y = 216 (not 240!)
for c_px in [98, 125, 153, 180, 207, 234, 260, 284, 313]:
    cv2.rectangle(vis, (c_px, 192), (c_px + 24, 192 + 24), (0, 255, 0), 2)
    cv2.rectangle(vis, (c_px, 216), (c_px + 24, 216 + 24), (0, 255, 0), 2)

# Save visualization of mismatch
cv2.imwrite("mismatch_damage_tracks_j2_vs_kd3.png", vis)
print("Saved mismatch_damage_tracks_j2_vs_kd3.png")
