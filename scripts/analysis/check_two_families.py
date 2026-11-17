import cv2
import numpy as np

# Let's inspect the entire board for each of the 17 submarines:
# We know the two families:
# Familia 1 (Cruceros con Aviacion):
#   - Junsen J. 2
#   - Junsen J. 1M
#   - Junsen J. 3
#   - Type A
#   - Type A Modified
#   - Type B
#   - Type B. 3
#   - Sen-Toku (I-400)
# Familia 2 (Submarinos de Ataque Puro):
#   - Kaidai KD. 3
#   - Kaidai KD. 4
#   - Kaidai KD. 5
#   - Kaidai KD. 6
#   - Kaidai KD. 7
#   - Type C
#   - Type C. 3
#   - Sen-Taka
#   - Kirai-Sen

# Let's verify if ALL 8 Cruisers have Damage Layout 1, and ALL 9 Attack subs have Damage Layout 2!
print("Comparing Damage Tracks layout across the two main families...")
