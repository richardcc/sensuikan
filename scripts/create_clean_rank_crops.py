import os
from PIL import Image, ImageDraw, ImageFont

orig_dir = r"C:\Users\Richard\OneDrive - UNED\EnBackup\Richard\Juegos Mesa\_Wargames\Sensuikan\Sensuikan-Japanese_Fleet_Submarines_in_WW2_Ver_1.0.0 - copia\images"
tokens_dir = r"app/assets/tokens"

# 1. Clean crops from original files
im_rank0 = Image.open(os.path.join(orig_dir, "Rank.jpg")).crop((0, 0, 68, 68))
im_rank1 = Image.open(os.path.join(orig_dir, "Rank1.jpg")).crop((0, 0, 68, 68))
im_rank2 = Image.open(os.path.join(orig_dir, "Rank2.jpg")).crop((0, 0, 68, 68))
im_rank3 = Image.open(os.path.join(orig_dir, "Rank3.jpg")).crop((0, 0, 68, 68))

im_rank0.save(os.path.join(tokens_dir, "Rank.jpg"), quality=95)
im_rank1.save(os.path.join(tokens_dir, "Rank1.jpg"), quality=95)
im_rank2.save(os.path.join(tokens_dir, "Rank2.jpg"), quality=95)
im_rank3.save(os.path.join(tokens_dir, "Rank3.jpg"), quality=95)

# Also save to base copies
im_rank1.save(os.path.join(tokens_dir, "Rank_LtCdr.jpg"), quality=95)
im_rank2.save(os.path.join(tokens_dir, "Rank_Commander.jpg"), quality=95)
im_rank3.save(os.path.join(tokens_dir, "Rank_Captain.jpg"), quality=95)

print("Saved clean original crops for Rank, Rank1, Rank2, Rank3")
