import os
import shutil
from PIL import Image

orig_dir = r"C:\Users\Richard\OneDrive - UNED\EnBackup\Richard\Juegos Mesa\_Wargames\Sensuikan\Sensuikan-Japanese_Fleet_Submarines_in_WW2_Ver_1.0.0 - copia\images"
artifact_dir = r"C:\Users\Richard\.gemini\antigravity\brain\c08a1950-d03a-4ae3-aef2-f14946ddab17"

for f in ['Rank.jpg', 'Rank1.jpg', 'Rank2.jpg', 'Rank3.jpg']:
    src = os.path.join(orig_dir, f)
    dst = os.path.join(artifact_dir, f"orig_{f}")
    shutil.copyfile(src, dst)
    im = Image.open(src)
    print(f, im.size)
