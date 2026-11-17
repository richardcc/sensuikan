import cv2
import numpy as np

# Coordinates of windows in 525x408 image space:
# 1. Title Window:
#   title_x0 = 145.0, title_x1 = 295.0, title_y0 = 22.0, title_y1 = 55.0 (in image py: 22 to 55)
# 2. Submarine Silhouette:
#   sub_x0 = 100.0, sub_x1 = 328.0, sub_y0 = 60.0, sub_y1 = 118.0 (in image py: 60 to 118)
# 3. Vessel Stats:
#   stats_x0 = 104.0, stats_x1 = 342.0, stats_y0 = 295.0, stats_y1 = 317.0 (in image py: 295 to 317)
# 4. Logo:
#   logo_x0 = 22.0, logo_x1 = 130.0, logo_y0 = 16.0, logo_y1 = 48.0 (in image py: 16 to 48)

# Let's inspect the titles collage and see if any title extends beyond x=295 or y=55!
# In check_thumbs, let's test all 17 thumbs:
titles_fit = []
for i in range(17):
    img = cv2.imread(f"photos/thumb_{i:02d}.jpg")
    img = cv2.resize(img, (525, 408))
    # Crop title area [20:60, 140:305]
    title_crop = img[20:60, 140:305]
    # Check if there is text cutting off at borders
    titles_fit.append(title_crop)

# Save collage of all 17 title crops inside our window
row1 = np.hstack(titles_fit[0:6])
row2 = np.hstack(titles_fit[6:12])
row3 = np.hstack(titles_fit[12:17] + [np.zeros_like(titles_fit[0])])
grid_titles = np.vstack([row1, row2, row3])
cv2.imwrite("all_titles_in_window.jpg", grid_titles)
print("Saved all_titles_in_window.jpg")
