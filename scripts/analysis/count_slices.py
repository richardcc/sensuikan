import cv2
import numpy as np

for name in ["Midget", "KiraiSen", "TypeC3", "SenToku"]:
    rtop = cv2.imread(f"{name}_slice_rtop.jpg")
    rmid = cv2.imread(f"{name}_slice_rmid.jpg")
    rbot = cv2.imread(f"{name}_slice_rbot.jpg")
    
    print(f"=== {name} ===")
    for s_name, s_img in [("rtop", rtop), ("rmid", rmid), ("rbot", rbot)]:
        gray = cv2.cvtColor(s_img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 4)
        cnts, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        b_cnt = 0
        for c in cnts:
            x, y, w, h = cv2.boundingRect(c)
            if 15 <= w <= 50 and 15 <= h <= 50:
                b_cnt += 1
        print(f"  {s_name}: ~{b_cnt} box contours")
