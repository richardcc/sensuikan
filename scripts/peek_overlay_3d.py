import numpy as np
from PIL import Image

im = Image.open('app/assets/submarines_cards/overlay_3d_en.webp')
arr = np.array(im)
alpha = arr[:, :, 3]
print("Total pixels:", alpha.size)
print("Opaque pixels (alpha > 200):", np.sum(alpha > 200))
print("Semi-transparent pixels (0 < alpha <= 200):", np.sum((alpha > 0) & (alpha <= 200)))
print("Transparent pixels (alpha == 0):", np.sum(alpha == 0))

# Where are non-transparent pixels located?
rows = np.where(np.sum(alpha > 0, axis=1) > 0)[0]
cols = np.where(np.sum(alpha > 0, axis=0) > 0)[0]
if len(rows) > 0 and len(cols) > 0:
    print(f"Non-transparent bounds: x=[{cols.min()}, {cols.max()}], y=[{rows.min()}, {rows.max()}]")
