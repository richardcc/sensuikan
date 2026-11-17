import cv2
import numpy as np

# Let's inspect the entire left side from below the patrol track down to crew status
# In 525x408 space: y in [160, 340], x in [0, 360]

for name, fname in [("Junsen_J2", "junsen_j2.png"), 
                    ("Kaidai_KD3", "photos/thumb_12.jpg"), 
                    ("Sen_Toku", "photos/thumb_03.jpg"), 
                    ("Type_B", "photos/thumb_06.jpg"),
                    ("Type_C", "photos/thumb_08.jpg")]:
    im = cv2.imread(fname)
    im_std = cv2.resize(im, (525, 408))
    crop = im_std[160:340, 0:360]
    cv2.putText(crop, name, (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
    cv2.imwrite(f"dt_compare_{name}.jpg", crop)

print("Saved dt_compare crops")
