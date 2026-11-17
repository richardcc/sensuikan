from check_watertight import check_watertight

midget_files = [
    "sensuikan_top_overlay_midget_full.stl",
    "sensuikan_top_overlay_midget_left.stl",
    "sensuikan_top_overlay_midget_right.stl"
]

all_ok = True
for f in midget_files:
    ok = check_watertight(f)
    if not ok:
        all_ok = False

print(f"Midget STLs Watertight? -> {all_ok}")
