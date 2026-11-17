import cv2
import numpy as np

img = cv2.imread("two_layouts_photo.jpg")
h, w = img.shape[:2]

# Let's create an annotated comparison from the user's real photo
# Left sub: x in [80, 360], y in [220, 780]
# Right sub: x in [410, 680], y in [220, 780]

c_l = img[220:780, 80:360].copy()
c_r = img[220:780, 410:680].copy()

# Resize both to exact standard display dimensions: 320 x 560
c_l = cv2.resize(c_l, (320, 560))
c_r = cv2.resize(c_r, (320, 560))

# Annotate Left Card (Layout 1: Crucero con Aviacion)
# 1. 2 rows of tubes
cv2.rectangle(c_l, (130, 45), (310, 115), (0, 255, 0), 2)
cv2.putText(c_l, "2 FILAS TUBOS (4+2)", (5, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 255, 0), 1)

# 2. Reloads bin (high)
cv2.rectangle(c_l, (130, 125), (310, 195), (0, 255, 255), 2)
cv2.putText(c_l, "CAJON ALTO", (30, 160), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 255, 255), 1)

# 3. Deck Gun + AA Gun
cv2.rectangle(c_l, (130, 205), (250, 275), (255, 100, 255), 2)
cv2.putText(c_l, "CANON + AA GUN", (5, 240), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 100, 255), 1)

# 4. Systems with Crane & Hangar
cv2.rectangle(c_l, (220, 280), (310, 325), (255, 255, 0), 2)
cv2.putText(c_l, "GRUA + HANGAR", (85, 305), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (255, 255, 0), 1)

# Annotate Right Card (Layout 2: Ataque 8 Tubos)
# 1. 3 rows of tubes
cv2.rectangle(c_r, (130, 40), (310, 145), (0, 255, 0), 2)
cv2.putText(c_r, "3 FILAS TUBOS (4+2+2)", (5, 95), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 255, 0), 1)

# 2. Reloads bin (low)
cv2.rectangle(c_r, (130, 155), (310, 225), (0, 255, 255), 2)
cv2.putText(c_r, "CAJON BAJO", (30, 190), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 255, 255), 1)

# 3. Deck Gun only (NO AA Gun)
cv2.rectangle(c_r, (130, 235), (250, 275), (255, 100, 255), 2)
cv2.putText(c_r, "CANON SOLO (NO AA)", (5, 255), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (255, 100, 255), 1)

# 4. Systems without Crane & Hangar
cv2.line(c_r, (220, 290), (310, 290), (0, 0, 255), 2)
cv2.putText(c_r, "SIN GRUA NI HANGAR", (70, 295), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 0, 255), 1)

# Headers
banner_l = np.zeros((40, 320, 3), dtype=np.uint8)
cv2.putText(banner_l, "LAYOUT 1: CRUCERO (Junsen/Tipo B)", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
card_l_final = np.vstack([banner_l, c_l])

banner_r = np.zeros((40, 320, 3), dtype=np.uint8)
cv2.putText(banner_r, "LAYOUT 2: ATAQUE (Kaidai/Tipo C)", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
card_r_final = np.vstack([banner_r, c_r])

comp_final = np.hstack([card_l_final, card_r_final])
cv2.imwrite("comparativa_layout_1_vs_2_real.jpg", comp_final)
print("Saved comparativa_layout_1_vs_2_real.jpg")
