import os

files = sorted(os.listdir('images/vassal'))
print("Vassal cards found:")
for f in files:
    if f.endswith('.jpg') or f.endswith('.png'):
        print(" ", f)
