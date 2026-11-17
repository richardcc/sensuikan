import cv2
import numpy as np

# Load the real photo showing both cards side by side
img = cv2.imread('C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/.user_uploaded/media_1793982246007_c4dd6af2.jpg')
h, w = img.shape[:2]

# Let's create an annotated crop of the damage track area on both cards
# Left card damage track area
crop_left = img[int(h*0.48):int(h*0.68), int(w*0.0):int(w*0.45)].copy()
# Right card damage track + deck gun area
crop_right = img[int(h*0.48):int(h*0.68), int(w*0.42):int(w*0.87)].copy()

# Resize both to exact same size for direct comparison
target_w, target_h = 700, 300
crop_left_res = cv2.resize(crop_left, (target_w, target_h))
crop_right_res = cv2.resize(crop_right, (target_w, target_h))

# Annotate crop_left (Junsen J.2)
cv2.putText(crop_left_res, "LAYOUT 1 (Junsen J.2):", (20, 35), cv2.FONT_HERSHEY_DUPLEX, 0.8, (0, 255, 255), 2)
cv2.putText(crop_left_res, "- Damage Track empieza a la izquierda", (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)
cv2.putText(crop_left_res, "- SUNK termina a X = 182 mm (HAY ESPACIO HASTA EL CANON)", (20, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 255, 0), 2)
cv2.rectangle(crop_left_res, (target_w - 120, 120), (target_w - 20, 260), (0, 255, 0), 3)
cv2.putText(crop_left_res, "GAP LIBRE", (target_w - 115, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 0), 2)

# Annotate crop_right (Kaidai / 8 Tubes)
cv2.putText(crop_right_res, "LAYOUT 2 (Kaidai / 8 Tubos):", (20, 35), cv2.FONT_HERSHEY_DUPLEX, 0.8, (0, 255, 255), 2)
cv2.putText(crop_right_res, "- Damage Track DESPLAZADO 20mm a la DERECHA", (20, 70), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 100, 255), 2)
cv2.putText(crop_right_res, "- SUNK termina a X = 202 mm (¡INVADE LA ZONA DEL CANON!)", (20, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (0, 0, 255), 2)
cv2.rectangle(crop_right_res, (20, 120), (120, 260), (0, 0, 255), 3)
cv2.putText(crop_right_res, "SUNK", (30, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
cv2.putText(crop_right_res, "<- CRUZA EL CORTE!", (130, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

# Stack vertically with header
header = np.zeros((80, target_w, 3), dtype=np.uint8)
cv2.putText(header, "ANALISIS DEL PROBLEMA DE LOS DAMAGE TRACKS", (30, 35), cv2.FONT_HERSHEY_DUPLEX, 0.8, (0, 255, 255), 2)
cv2.putText(header, "Por que el corte vertical en X = 193 mm se rompe", (120, 65), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (200, 200, 200), 2)

final_img = np.vstack([header, crop_left_res, crop_right_res])
out_path = 'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/analisis_rotura_damage_track.jpg'
cv2.imwrite(out_path, final_img)
print('Saved', out_path)
