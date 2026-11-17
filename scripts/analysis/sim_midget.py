import cv2
import numpy as np

m = cv2.imread("photos/thumb_01.jpg")
m_std = cv2.resize(m, (525, 408))

# Let's draw the Midget overlay on the Midget card
vis = m_std.copy()
overlay_layer = np.zeros_like(vis)

# Base dark overlay
cv2.rectangle(overlay_layer, (0, 0), (525, 408), (35, 30, 25), -1)

# Cutouts:
# 1. Logo
cv2.rectangle(overlay_layer, (18, 15), (110, 45), (0, 0, 0), -1)
cv2.rectangle(vis, (18, 15), (110, 45), (0, 255, 255), 2)

# 2. Title
cv2.rectangle(overlay_layer, (120, 15), (340, 45), (0, 0, 0), -1)
cv2.rectangle(vis, (120, 15), (340, 45), (0, 255, 255), 2)

# 3. Large Submarine Cutaway Window
cv2.rectangle(overlay_layer, (60, 48), (425, 182), (0, 0, 0), -1)
cv2.rectangle(vis, (60, 48), (425, 182), (0, 255, 255), 2)

# 4. Slots
attack_boxes = [(194, 190), (219, 191), (245, 192), (271, 193), (218, 217), (245, 217), (271, 217)]
torp_crew_boxes = [(63, 294), (90, 295), (142, 324), (170, 325), (197, 325)]
systems_boxes = [
    (432, 248), (457, 248),
    (407, 274), (433, 275), (457, 275),
    (407, 302), (433, 302), (458, 303),
    (408, 329), (434, 330), (460, 330)
]

for px, py in attack_boxes + torp_crew_boxes + systems_boxes:
    cv2.rectangle(overlay_layer, (px, py), (px + 26, py + 26), (0, 0, 0), -1)
    cv2.circle(overlay_layer, (px + 26, py + 13), 4, (0, 0, 0), -1)
    cv2.rectangle(vis, (px, py), (px + 26, py + 26), (0, 255, 0), 1)
    cv2.circle(vis, (px + 26, py + 13), 3, (0, 255, 0), 1)

mask = (overlay_layer > 0).any(axis=2)
vis[mask] = cv2.addWeighted(vis, 0.35, overlay_layer, 0.65, 0)[mask]
cv2.putText(vis, "TYPE A MIDGET (KO-HYOTEKI) - DEDICATED OVERLAY", (20, 395), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)

cv2.imwrite("midget_overlay_simulation.jpg", vis)
print("Saved midget_overlay_simulation.jpg")
