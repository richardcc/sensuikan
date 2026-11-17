with open('scripts/generators/generate_canonical_player_cards.py', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update get_realistic_counter_img to map Surface and Flooding Marker
target_damage_section = """    # 7. Damage Gauges & Markers
    elif "flooding" in norm_lower or "flood" in norm_lower:
        target_file = "counter_naval_pressure_gauge.png"
    elif "hull" in norm_lower:
        target_file = "counter_hull_stress_dial.png" """

# Let's find damage section using regex or search
old_target = """    # 7. Damage Gauges & Markers
    elif "flooding" in norm_lower or "flood" in norm_lower:
        target_file = "counter_naval_pressure_gauge.png"
    elif "hull" in norm_lower:
        target_file = "counter_hull_stress_dial.png" """

replacement_damage = """    # 7. Damage Gauges & Markers
    elif "flooding" in norm_lower or "flood" in norm_lower:
        target_file = "counter_flooding_marker.png"
    elif "surface" in norm_lower:
        target_file = "counter_emergency_surface.png"
    elif "hull" in norm_lower:
        target_file = "counter_hull_stress_dial.png" """

code_norm = code.replace('\r\n', '\n')
old_norm = old_target.replace('\r\n', '\n')
rep_norm = replacement_damage.replace('\r\n', '\n')

if old_norm in code_norm:
    code_norm = code_norm.replace(old_norm, rep_norm, 1)
    print("Updated get_realistic_counter_img with Flooding Marker & Surface!")
else:
    print("Trying alternative search for damage section...")
    code_norm = code_norm.replace('target_file = "counter_naval_pressure_gauge.png"',
                                  'target_file = "counter_flooding_marker.png"\n    elif "surface" in norm_lower:\n        target_file = "counter_emergency_surface.png"')
    print("Replaced pressure gauge with flooding marker and added surface!")

# 2. Update draw_reload_supplies_bay with realistic images in quadrants
old_bay_watermarks = """    # Watermarks in quadrants:
    qw = w_bay / 4.0
    qh = h_bay / 4.0
    draw_watermark(ax, cx - qw, cy + qh - 1.5*BROTHER_COMP, "twin_torpedoes_rack", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
    draw_watermark(ax, cx + qw, cy + qh - 1.5*BROTHER_COMP, "twin_torpedoes_rack", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
    draw_watermark(ax, cx - qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
    draw_watermark(ax, cx + qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)"""

new_bay_art = """    # Realistic AI artwork in quadrants:
    qw = w_bay / 4.0
    qh = h_bay / 4.0
    half_q = 6.2 * BROTHER_COMP
    
    img_rack = get_realistic_counter_img("reload", "")
    img_supp = get_realistic_counter_img("supplies", "")
    
    if img_rack is not None:
        ax.imshow(img_rack, extent=(cx - qw - half_q, cx - qw + half_q, cy + qh - 1.2*BROTHER_COMP - half_q, cy + qh - 1.2*BROTHER_COMP + half_q), zorder=3.0, alpha=0.55)
        ax.imshow(img_rack, extent=(cx + qw - half_q, cx + qw + half_q, cy + qh - 1.2*BROTHER_COMP - half_q, cy + qh - 1.2*BROTHER_COMP + half_q), zorder=3.0, alpha=0.55)
    else:
        draw_watermark(ax, cx - qw, cy + qh - 1.5*BROTHER_COMP, "twin_torpedoes_rack", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
        draw_watermark(ax, cx + qw, cy + qh - 1.5*BROTHER_COMP, "twin_torpedoes_rack", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
        
    if img_supp is not None:
        ax.imshow(img_supp, extent=(cx - qw - half_q, cx - qw + half_q, cy - qh - half_q, cy - qh + half_q), zorder=3.0, alpha=0.55)
        ax.imshow(img_supp, extent=(cx + qw - half_q, cx + qw + half_q, cy - qh - half_q, cy - qh + half_q), zorder=3.0, alpha=0.55)
    else:
        draw_watermark(ax, cx - qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)
        draw_watermark(ax, cx + qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)"""

if old_bay_watermarks in code_norm:
    code_norm = code_norm.replace(old_bay_watermarks, new_bay_art)
    print("Updated draw_reload_supplies_bay with realistic AI art!")
else:
    print("Could not find old_bay_watermarks in normalized code")

with open('scripts/generators/generate_canonical_player_cards.py', 'w', encoding='utf-8') as f:
    f.write(code_norm)

print("Saved generate_canonical_player_cards.py with new AI counters!")
