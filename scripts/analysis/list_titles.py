import os
import glob

# Print titles list from previous session or read them
titles = [
    "Type C. 3",               # 00
    "Type A Midget Ko-Hyoteki", # 01
    "Type A",                  # 02
    "Sen-Toku (I-400)",        # 03
    "Junsen J. 1M",            # 04
    "Type A Modified",         # 05
    "Type B",                  # 06
    "Type B. 3",               # 07
    "Type C",                  # 08
    "Kaidai KD. 6",            # 09
    "Sen-Taka",                # 10
    "Junsen J. 3",             # 11
    "Kaidai KD. 3",            # 12
    "Kaidai KD. 4",            # 13
    "Kaidai KD. 7",            # 14
    "Kirai-Sen",               # 15 (Minelayer)
    "Kaidai KD. 5",            # 16
    "Junsen J. 2"              # base image (junsen_j2.png)
]

for idx, t in enumerate(titles):
    print(f"Class {idx:02d}: {t}")
