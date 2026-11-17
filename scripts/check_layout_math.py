# Compute exact Y positions for Right Block
# CARD_H = 181.5 mm, oy = 0
# y_top ranges from 0 to 181.5 mm from top

plaque_h = 3.0
slot_h = 15.0

# 1. Aircraft & Events
y_p1 = 3.5 # plaque 1 center
y_r0 = 13.5 # Row 0 center (top = 6.0, bot = 21.0)

# 2. Forward Torpedo Tubes (1-8)
y_p2 = 23.2 # plaque 2 center
y_r1 = 32.7 # Row 1 center (top = 25.2, bot = 40.2)
y_r2 = 49.2 # Row 2 center (top = 41.7, bot = 56.7)

# 3. Aft Tubes & Reloads
y_p3 = 58.9 # plaque 3 center
y_r3 = 68.4 # Row 3 center (top = 60.9, bot = 75.9)

# 4. Artillery & Forward Reloads
y_p4 = 78.1 # plaque 4 center
y_r4 = 87.6 # Row 4 center (top = 80.1, bot = 95.1)
y_r5 = 104.1 # Row 5 center (top = 96.6, bot = 111.6)
# (Bay across Cols 2&3 covers Y from 80.1 to 111.6 -> height = 31.5 mm!)

# 5. Systems Status (4x4 = 16 slots)
y_p5 = 113.8 # plaque 5 center
y_r6 = 123.3 # Row 6 center (top = 115.8, bot = 130.8)
y_r7 = 139.8 # Row 7 center (top = 132.3, bot = 147.3)
y_r8 = 156.3 # Row 8 center (top = 148.8, bot = 163.8)
y_r9 = 172.8 # Row 9 center (top = 165.3, bot = 180.3)

print(f"Top of Row 0: {y_r0 - 7.5} mm")
print(f"Bottom of Row 9: {y_r9 + 7.5} mm")
print(f"Card Height: 181.5 mm -> Margin at bottom: {181.5 - (y_r9 + 7.5):.2f} mm")
