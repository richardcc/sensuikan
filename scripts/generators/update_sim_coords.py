import os

script_path = "scripts/generators/generate_map_options_simulation.py"
with open(script_path, "r", encoding="utf-8") as f:
    text = f.read()

old_stations = """stations_mm = [
    ('paramushiro', 140.7, 33.2), ('yokosuka', 116.1, 58.5), ('truk', 134.1, 112.2),
    ('new_guinea', 116.0, 132.0), ('dutch_east_indies', 64.8, 143.8), ('aleutian', 198.6, 31.2),
    ('okinawa', 93.8, 77.0), ('iwo_jima', 119.0, 81.6), ('midway', 178.3, 81.6),
    ('philippines', 72.5, 91.0), ('marianas', 112.0, 99.0), ('indian_ocean', 13.7, 107.6),
    ('leyte_gulf', 87.5, 113.0), ('malaya', 28.7, 120.0), ('tarawa', 181.3, 131.2),
    ('guadalcanal', 154.0, 150.4), ('west_coast', 228.3, 54.4), ('pearl_harbor', 216.9, 96.9),
    ('panama_canal', 228.3, 165.9), ('australia', 136.7, 174.2), ('europe', 17.9, 170.7)
]"""

new_stations = """stations_mm = [
    ('paramushiro', 140.8, 33.1), ('yokosuka', 116.0, 62.8), ('truk', 134.1, 112.1),
    ('new_guinea', 121.3, 128.9), ('dutch_east_indies', 64.7, 143.8), ('aleutian', 198.6, 31.2),
    ('okinawa', 93.6, 79.2), ('iwo_jima', 118.9, 78.5), ('midway', 178.2, 81.5),
    ('philippines', 77.0, 95.2), ('marianas', 109.1, 95.7), ('indian_ocean', 13.7, 107.4),
    ('leyte_gulf', 84.3, 108.8), ('malaya', 28.6, 117.8), ('tarawa', 181.3, 131.1),
    ('guadalcanal', 152.8, 150.4), ('west_coast', 228.2, 54.3), ('pearl_harbor', 216.9, 96.8),
    ('panama_canal', 228.2, 165.9), ('australia', 136.6, 174.1), ('europe', 15.1, 170.6)
]"""

assert old_stations in text, "old_stations not found in simulation script!"
text = text.replace(old_stations, new_stations, 1)

with open(script_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Updated generate_map_options_simulation.py with exact canonical coordinates!")
