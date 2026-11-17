# -*- coding: utf-8 -*-
"""
Script to remove all references to assets/charts across app files and bundlers.
"""
import re

def clean_bundlers():
    for script_path in ['scripts/bundle_single_file.py', 'scripts/bundle_ultracompact_protected.py']:
        with open(script_path, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace(
            "target_dirs = ['chits', 'tokens', 'submarines_profiles', 'charts', 'tracks', 'branding']",
            "target_dirs = ['chits', 'tokens', 'submarines_profiles', 'tracks', 'branding']"
        )
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f"Updated {script_path}")

def clean_workflow_partial():
    path = 'app/partials/02_tab_workflow.html'
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    # Replacements in workflow
    c = c.replace("'assets/charts/Chart_B1_B6_Combat_Tables.jpg', 'B1'", "'', 'B1'")
    c = c.replace("'assets/charts/Chart_B1_B6_Combat_Tables.jpg'", "'', 'B1_B6'")
    c = c.replace("'assets/charts/Chart_F1_Submarine_School.jpg', 'F1'", "'', 'F1'")
    c = c.replace("'assets/charts/Chart_B7_Submarine_Damage_Listings.jpg'", "'', 'B7'")
    c = c.replace("assets/charts/Chart_B1_B6_Combat_Tables.jpg", "")
    c = c.replace("assets/charts/Chart_B7_Submarine_Damage_Listings.jpg", "")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Cleaned {path}")

def clean_compendium_partial():
    path = 'app/partials/06_tab_compendium.html'
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace("'assets/charts/Chart_B7_Submarine_Damage_Listings.jpg'", "'', 'B7'")
    c = c.replace("assets/charts/Chart_B7_Submarine_Damage_Listings.jpg", "")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Cleaned {path}")

def clean_data_ocr():
    path = 'app/js/data_ocr.js'
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    c = c.replace("'assets/charts/Chart_B1_B6_Combat_Tables.jpg'", "''")
    c = c.replace("'assets/charts/Chart_M5_M7_Midget_Sub_Encounters.jpg'", "''")
    c = re.sub(r'assets/charts/[a-zA-Z0-9_\.]+', '', c)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f"Cleaned {path}")

if __name__ == '__main__':
    clean_bundlers()
    clean_workflow_partial()
    clean_compendium_partial()
    clean_data_ocr()
