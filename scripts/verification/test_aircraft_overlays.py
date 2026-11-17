import cv2
import numpy as np

# Load the user's uploaded photo of stacked cards
img = cv2.imread("stacked_cards.png")
# img has size (320, 1024, 3)

# Let's inspect the two regions:
# Region 2 (Type A Modified): y in [105, 175], x in [480, 850]
# Region 3 (Sen-Toku): y in [185, 255], x in [480, 850]

c2_strip = img[105:175, 480:850].copy()
c3_strip = img[185:255, 480:850].copy()

# Let's design the 2D overlay for Option 2 (Type A Modified / Estándar)
# Dimensions of c2_strip: 70 x 370 px
vis2 = c2_strip.copy()
overlay2 = np.zeros_like(vis2)
cv2.rectangle(overlay2, (0, 0), (vis2.shape[1], vis2.shape[0]), (35, 30, 25), -1)

# In Option 2:
# 1. "Aircraft" window: x in [80, 155], y in [12, 58]
cv2.rectangle(overlay2, (80, 12), (155, 58), (0, 0, 0), -1)
cv2.rectangle(vis2, (80, 12), (155, 58), (0, 255, 255), 2)
cv2.putText(vis2, "VENTANA 'Aircraft'", (75, 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1)

# 2. Plane 1 slot: x in [165, 215], y in [12, 58]
cv2.rectangle(overlay2, (165, 12), (215, 58), (0, 0, 0), -1)
cv2.circle(overlay2, (215, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis2, (165, 12), (215, 58), (0, 255, 0), 2)

# 3. Plane 2 slot: x in [218, 268], y in [12, 58]
cv2.rectangle(overlay2, (218, 12), (268, 58), (0, 0, 0), -1)
cv2.circle(overlay2, (268, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis2, (218, 12), (268, 58), (0, 255, 0), 2)

# 4. Random Event 1 slot: x in [270, 316], y in [12, 58]
cv2.rectangle(overlay2, (270, 12), (316, 58), (0, 0, 0), -1)
cv2.circle(overlay2, (316, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis2, (270, 12), (316, 58), (0, 255, 0), 2)

# 5. Random Event 2 slot: x in [320, 365], y in [12, 58]
cv2.rectangle(overlay2, (320, 12), (365, 58), (0, 0, 0), -1)
cv2.circle(overlay2, (365, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis2, (320, 12), (365, 58), (0, 255, 0), 2)

mask2 = (overlay2 > 0).any(axis=2)
vis2[mask2] = cv2.addWeighted(vis2, 0.30, overlay2, 0.70, 0)[mask2]

# Let's design the 2D overlay for Option 3 (Sen-Toku Class)
vis3 = c3_strip.copy()
overlay3 = np.zeros_like(vis3)
cv2.rectangle(overlay3, (0, 0), (vis3.shape[1], vis3.shape[0]), (35, 30, 25), -1)

# In Option 3:
# 1. Random Event 1: x in [56, 102], y in [12, 58]
cv2.rectangle(overlay3, (56, 12), (102, 58), (0, 0, 0), -1)
cv2.circle(overlay3, (102, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis3, (56, 12), (102, 58), (0, 255, 0), 2)

# 2. Random Event 2: x in [106, 152], y in [12, 58]
cv2.rectangle(overlay3, (106, 12), (152, 58), (0, 0, 0), -1)
cv2.circle(overlay3, (152, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis3, (106, 12), (152, 58), (0, 255, 0), 2)

# 3. "Aircraft" window: x in [158, 222], y in [12, 58]
cv2.rectangle(overlay3, (158, 12), (222, 58), (0, 0, 0), -1)
cv2.rectangle(vis3, (158, 12), (222, 58), (0, 255, 255), 2)
cv2.putText(vis3, "VENTANA 'Aircraft'", (152, 10), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (0, 255, 255), 1)

# 4. Seiran 1 slot: x in [228, 274], y in [12, 58]
cv2.rectangle(overlay3, (228, 12), (274, 58), (0, 0, 0), -1)
cv2.circle(overlay3, (274, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis3, (228, 12), (274, 58), (0, 255, 0), 2)

# 5. Seiran 2 slot: x in [277, 323], y in [12, 58]
cv2.rectangle(overlay3, (277, 12), (323, 58), (0, 0, 0), -1)
cv2.circle(overlay3, (323, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis3, (277, 12), (323, 58), (0, 255, 0), 2)

# 6. Seiran 3 slot: x in [325, 368], y in [12, 58]
cv2.rectangle(overlay3, (325, 12), (368, 58), (0, 0, 0), -1)
cv2.circle(overlay3, (368, 35), 6, (0, 0, 0), -1)
cv2.rectangle(vis3, (325, 12), (368, 58), (0, 255, 0), 2)

mask3 = (overlay3 > 0).any(axis=2)
vis3[mask3] = cv2.addWeighted(vis3, 0.30, overlay3, 0.70, 0)[mask3]

# Combine both into a comparison image
h2, w2 = vis2.shape[:2]
comp = np.zeros((h2 * 2 + 50, w2, 3), dtype=np.uint8)

cv2.putText(comp, "OPCION 2: FLOTA ESTANDAR (Ventana 'Aircraft' + 2 Aviones + 2 Eventos)", (10, 20),
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 255, 255), 1)
comp[25:25+h2, :] = vis2

cv2.putText(comp, "OPCION 3: SEN-TOKU I-400 (2 Eventos + Ventana 'Aircraft' + 3 Aviones Seiran)", (10, 35 + h2),
            cv2.FONT_HERSHEY_SIMPLEX, 0.40, (0, 255, 255), 1)
comp[40+h2:40+2*h2, :] = vis3

cv2.imwrite("comparativa_aviacion_opcion_2_3.png", comp)
print("Saved comparativa_aviacion_opcion_2_3.png")
