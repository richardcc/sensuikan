import cv2
import numpy as np

st = cv2.imread("photos/thumb_10.jpg")
ks = cv2.imread("photos/thumb_15.jpg")

cv2.imwrite("st_dmg.jpg", st[int(st.shape[0]*0.4):int(st.shape[0]*0.75), :int(st.shape[1]*0.7)])
cv2.imwrite("ks_dmg.jpg", ks[int(ks.shape[0]*0.4):int(ks.shape[0]*0.75), :int(ks.shape[1]*0.7)])

print("Saved st_dmg.jpg and ks_dmg.jpg")
