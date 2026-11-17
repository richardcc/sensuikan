import cv2
import numpy as np

# Let's inspect the sections in Midget, Kirai-Sen, Type C.3, and Sen-Toku
# What are the headings / titles on each?
# We can extract text bounding boxes or inspect specific areas.

for name, filename in [("Midget", "crop_midget_full.jpg"), 
                       ("KiraiSen", "crop_kirai_full.jpg"), 
                       ("TypeC3", "crop_c3_full.jpg"), 
                       ("SenToku", "crop_sentoku_full.jpg")]:
    img = cv2.imread(filename)
    h, w = img.shape[:2]
    # save slices:
    # 1. Left top (Class & logo)
    cv2.imwrite(f"{name}_slice_title.jpg", img[0:int(h*0.2), 0:int(w*0.6)])
    # 2. Right top (Aircraft / Torpedoes)
    cv2.imwrite(f"{name}_slice_rtop.jpg", img[0:int(h*0.35), int(w*0.6):])
    # 3. Right mid (Reloads / Guns / Kaiten / Mines)
    cv2.imwrite(f"{name}_slice_rmid.jpg", img[int(h*0.35):int(h*0.65), int(w*0.6):])
    # 4. Right bot (Systems)
    cv2.imwrite(f"{name}_slice_rbot.jpg", img[int(h*0.65):, int(w*0.6):])

print("Saved all slices for inspection")
