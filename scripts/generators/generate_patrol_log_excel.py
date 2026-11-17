"""
Master Generator for Sensuikan Deluxe: Official Canonical Submarine Patrol Log Suite (Excel .xlsx)
Recreates the EXACT 44-month historical chronological timeline (Dec-41 to Jul-45)
matching the official Compass Games Patrol Log Sheet with complete milestone annotations:
- Jun-42: Old Torps gone
- Sep-42: Type KD.7
- May-44: Type C.3
- Jul-44: Type B.3
- Sep-44 / Dec-44: Sen-Toku (Official Errata)
- May-45: Type A Mod.
- Jul-45: Sen-Taka
"""

import json
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.formatting.rule import CellIsRule

def build_canonical_suite(output_path="Sensuikan_Patrol_Log_Sheet.xlsx"):
    wb = openpyxl.Workbook()
    wb.remove(wb.active)  # Remove default blank sheet

    # Load submarines database
    db_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "submarines_database.json")
    with open(db_path, "r", encoding="utf-8") as f:
        db = json.load(f)

    # -------------------------------------------------------------
    # STYLES DEFINITION (Imperial IJN Canonical Palette)
    # -------------------------------------------------------------
    font_title = Font(name="Segoe UI", size=15, bold=True, color="FFFFFF")
    font_subtitle = Font(name="Segoe UI", size=9.5, italic=True, color="E2E8F0")
    font_section = Font(name="Segoe UI", size=10.5, bold=True, color="FFFFFF")
    font_table_hdr = Font(name="Segoe UI", size=9.5, bold=True, color="FFFFFF")
    font_kpi_label = Font(name="Segoe UI", size=8, bold=True, color="475569")
    font_kpi_val = Font(name="Segoe UI", size=13, bold=True, color="0F172A")
    font_data = Font(name="Segoe UI", size=9, color="1E293B")
    font_data_bold = Font(name="Segoe UI", size=9, bold=True, color="1E293B")
    font_milestone = Font(name="Segoe UI", size=8.5, italic=True, bold=True, color="854D0E")
    font_date = Font(name="Segoe UI", size=9, bold=True, color="0F172A")

    # Fills
    fill_navy = PatternFill("solid", fgColor="1B2A4A")       # Primary IJN Deep Navy
    fill_gold = PatternFill("solid", fgColor="C5A059")       # Imperial Gold
    fill_subhdr = PatternFill("solid", fgColor="24385C")     # Table subheader
    fill_kpi = PatternFill("solid", fgColor="F1F5F9")        # KPI card bg
    fill_kpi_val = PatternFill("solid", fgColor="E0F2FE")    # KPI value bg (Sky light)
    fill_kpi_gold = PatternFill("solid", fgColor="FEF08A")   # KPI victory rating
    fill_white = PatternFill("solid", fgColor="FFFFFF")      # Pure white
    fill_grey = PatternFill("solid", fgColor="E2E8F0")       # Canonical light grey alternate row
    fill_milestone = PatternFill("solid", fgColor="FEF9C3")  # Soft yellow highlight for historical milestone
    fill_input = PatternFill("solid", fgColor="FEFCE8")      # Warm light cream for user inputs
    fill_spec_val = PatternFill("solid", fgColor="F0FDF4")   # Soft green tint for auto-populated specs

    # Borders
    border_thin_grey = Side(border_style="thin", color="94A3B8")
    border_med_dark = Side(border_style="medium", color="0F172A")
    border_thick_divider = Side(border_style="medium", color="0F172A")  # Dividing line between seasonal blocks

    box_data = Border(left=border_thin_grey, right=border_thin_grey, top=border_thin_grey, bottom=border_thin_grey)
    box_header = Border(left=border_thin_grey, right=border_thin_grey, top=border_med_dark, bottom=border_med_dark)
    box_total = Border(top=border_med_dark, bottom=border_med_dark, left=border_thin_grey, right=border_thin_grey)

    # Alignments
    align_center = Alignment(horizontal="center", vertical="center", wrap_text=True)
    align_left = Alignment(horizontal="left", vertical="center", wrap_text=True)
    align_right = Alignment(horizontal="right", vertical="center", wrap_text=True)
    align_title = Alignment(horizontal="center", vertical="center")
    align_header = Alignment(horizontal="center", vertical="center", wrap_text=True)


    # =========================================================================
    # SHEET 7: LOOKUPS (Master Data Validation Lists & Defined Names)
    # =========================================================================
    ws_lookups = wb.create_sheet(title="LOOKUPS")
    ws_lookups.views.sheetView[0].showGridLines = True

    sub_classes = [s["class_name"] for s in db.get("submarines", {}).values()]
    bases = ["Yokosuka", "Kure", "Truk", "Penang", "Surabaya", "Paramushiro", "Rabaul", "Kwajalein", "New Guinea"]
    zones = [
        "Pearl Harbor", "West Coast US", "Midway", "Aleutian Is.", "Indian Ocean",
        "Malaya", "Philippines", "Leyte Gulf", "Marianas", "Guadalcanal", "Tarawa",
        "Okinawa", "Iwo Jima", "Australia", "Panama Canal", "Europe"
    ]
    missions = [
        "War Patrol", "Fleet Support", "Special Recon", "Transport / Supply",
        "Kaiten Strike", "Minelaying", "Midget Sub Launch", "Yanagi Voyage", "Refit"
    ]
    ranks = ["Ensign", "Sub-Lieutenant", "Lieutenant", "Lt. Commander", "Commander", "Captain"]
    skills = [
        "Torpedo Specialist (+1 Hit)", "Expert Watch (+1 Sight)", "Aggressive (+1 Close)",
        "Damage Control Expert", "Evasive Maneuvers", "Silent Running",
        "Night Combat Specialist", "Leadership & High Morale", "None"
    ]
    career_status = [
        "Active - In War Patrols", "In Port - Refit / Repairs",
        "Drydock Overhaul", "Decommissioned / Training", "Lost in Action (KIA)"
    ]
    damage_states = [
        "None", "Light Damage (Repaired)", "Moderate Damage",
        "Heavy Flooding / In Hull", "Escaped DC (Undamaged)", "Sunk by Escort (KIA)"
    ]
    floatplane_sorties = [
        "No Sortie", "Recon Success (+1 Contact)", "Recon Sighted Task Force",
        "Floatplane Shot Down", "Floatplane Damaged", "Night Periscope Recon", "No Aircraft Fitted"
    ]
    target_cats = [
        "Merchant", "Tanker", "Small Escort", "Destroyer",
        "Light Cruiser", "Heavy Cruiser", "Escort Carrier", "Fleet Carrier", "Battleship"
    ]
    target_nations = ["USA", "Great Britain", "Australia", "Netherlands", "USSR", "Other"]
    attack_modes = [
        "Submerged Day Torpedo", "Submerged Night Torpedo", "Night Surface Attack",
        "Surfaced Gun Action", "Periscope Long Range", "Kaiten Suicide Strike", "Midget Sub Launch"
    ]
    combat_results = ["Sunk", "Damaged", "Missed", "Escaped"]
    escort_attacks = [
        "No escorts present", "Evaded with decoys", "Minor Depth Charge (Undamaged)",
        "Escaped DC (Light Damage)", "Violent DC (Moderate Damage)",
        "Catastrophic DC (Heavy Damage)", "Submarine Sunk (KIA)"
    ]
    crew_qualities = ["Green", "Trained", "Veteran", "Crack / Elite"]
    crew_statuses = [
        "Fit for Duty", "Lightly Wounded", "Seriously Wounded",
        "Killed in Action (KIA)", "Hospitalized", "Transferred"
    ]
    patrol_months = ["1", "2", "3", "4", "5"]
    refit_months = ["0", "1", "2", "3", "4", "5", "6"]

    lookups_map = [
        ("A", "SUB_CLASSES", sub_classes, "LIST_SUB_CLASSES"),
        ("B", "BASES", bases, "LIST_BASES"),
        ("C", "ZONES", zones, "LIST_ZONES"),
        ("D", "MISSIONS", missions, "LIST_MISSIONS"),
        ("E", "RANKS", ranks, "LIST_RANKS"),
        ("F", "SKILLS", skills, "LIST_SKILLS"),
        ("G", "CAREER_STATUS", career_status, "LIST_STATUS"),
        ("H", "DAMAGE_STATES", damage_states, "LIST_DAMAGE"),
        ("I", "FLOATPLANE", floatplane_sorties, "LIST_FLOATPLANE"),
        ("J", "TARGET_CATS", target_cats, "LIST_TARGETS"),
        ("K", "TARGET_NATIONS", target_nations, "LIST_NATIONS"),
        ("L", "ATTACK_MODES", attack_modes, "LIST_ATTACK_MODES"),
        ("M", "COMBAT_RESULTS", combat_results, "LIST_RESULTS"),
        ("N", "ESCORT_ATTACKS", escort_attacks, "LIST_ESCORT"),
        ("O", "CREW_QUALITIES", crew_qualities, "LIST_CREW_QUAL"),
        ("P", "CREW_STATUSES", crew_statuses, "LIST_CREW_STAT"),
        ("Q", "PATROL_MONTHS", patrol_months, "LIST_PATROL_MONTHS"),
        ("R", "REFIT_MONTHS", refit_months, "LIST_REFIT_MONTHS"),
    ]

    for col_let, title, val_list, def_name in lookups_map:
        ws_lookups[f"{col_let}1"] = title
        ws_lookups[f"{col_let}1"].font = font_table_hdr
        ws_lookups[f"{col_let}1"].fill = fill_navy
        ws_lookups.column_dimensions[col_let].width = 26
        for idx, val in enumerate(val_list):
            r_idx = idx + 2
            cell = ws_lookups[f"{col_let}{r_idx}"]
            cell.value = val
            cell.font = font_data
        
        max_r = len(val_list) + 1
        d_name_obj = DefinedName(def_name, attr_text=f"'LOOKUPS'!${col_let}$2:${col_let}${max_r}")
        wb.defined_names.add(d_name_obj)


    # =========================================================================
    # SHEET 5: SUBMARINE SPECIFICATIONS (Expanded Technical Database)
    # =========================================================================
    ws_specs = wb.create_sheet(title="SUBMARINE SPECIFICATIONS")
    ws_specs.views.sheetView[0].showGridLines = True
    ws_specs.page_setup.orientation = ws_specs.ORIENTATION_LANDSCAPE
    ws_specs.page_setup.paperSize = ws_specs.PAPERSIZE_A4
    ws_specs.page_setup.fitToPage = True
    ws_specs.page_setup.fitToWidth = 1
    ws_specs.page_setup.fitToHeight = 0

    ws_specs.merge_cells("A1:S1")
    ws_specs["A1"] = "SENSUlKAN: IMPERIAL JAPANESE NAVY FLEET SUBMARINES TECHNICAL REGISTRY"
    ws_specs["A1"].font = font_title
    ws_specs["A1"].fill = fill_navy
    ws_specs["A1"].alignment = align_title

    ws_specs.merge_cells("A2:S2")
    ws_specs["A2"] = "CANONICAL DATABASE OF ALL 18 SUBMARINE CLASSES, ARMAMENT, PATROL PROFILE, KAITEN, HULL & AIRCRAFT SPECS"
    ws_specs["A2"].font = font_subtitle
    ws_specs["A2"].fill = fill_subhdr
    ws_specs["A2"].alignment = align_title

    ws_specs.row_dimensions[1].height = 25
    ws_specs.row_dimensions[2].height = 17

    sub_headers = [
        ("A", "Class Name\n(Clase)", 20),
        ("B", "Full Designation\n(Denominación Oficial)", 28),
        ("C", "Service Date\n(Entrada Servicio)", 18),
        ("D", "Patrol Length\n(Duración Patrulla)", 18),
        ("E", "Displacement\n(Desplazamiento)", 18),
        ("F", "Speed / Range\n(Velocidad / Alcance)", 24),
        ("G", "Crew\n(Dotación)", 10),
        ("H", "Produced\n(Unidades)", 11),
        ("I", "Torpedo Tubes\n(Fwd / Aft + Reloads)", 22),
        ("J", "Deck Guns & AA\n(Artillería de Cubierta)", 24),
        ("K", "Aircraft\n(Hidroavión)", 16),
        ("L", "Kaiten Capable\n(Porta-Kaiten)", 16),
        ("M", "Vassal Template\nReference", 20),
        ("N", "Historical Role & Operational Notes\n(Notas Tácticas e Históricas)", 46),
        ("O", "Hull Hits\nCapacity", 12),
        ("P", "Flooding\nCapacity", 12),
        ("Q", "Total Torpedo\nPayload", 18),
        ("R", "Aircraft Model\n& Hangar", 22),
        ("S", "Station Track Architecture\n(Secuencia de Fases)", 32),
    ]

    for col_letter, hdr_text, col_w in sub_headers:
        cell = ws_specs[f"{col_letter}4"]
        cell.value = hdr_text
        cell.font = font_table_hdr
        cell.fill = fill_navy
        cell.alignment = align_header
        cell.border = box_header
        ws_specs.column_dimensions[col_letter].width = col_w

    row_sub = 5
    for sub_k, sub_data in db.get("submarines", {}).items():
        ws_specs.row_dimensions[row_sub].height = 24
        row_fill = fill_grey if row_sub % 2 == 0 else fill_white

        c_name = sub_data.get("class_name", sub_k)
        f_title = sub_data.get("full_title", "")
        av_date = sub_data.get("available_date", "")
        p_len = sub_data.get("patrol_length", "")
        stats = sub_data.get("stats", {})
        displ = stats.get("displacement", "")
        speed_rng = f"{stats.get('speed', '')} / {stats.get('range', '')}"
        crew = stats.get("crew", "")
        prod = stats.get("produced", "")

        tt = sub_data.get("torpedo_tubes", {})
        fwd_t = tt.get('fwd', 0)
        aft_t = tt.get('aft', 0)
        rel_fwd = tt.get('reloads_fwd', 0)
        tt_str = f"{fwd_t} Fwd / {aft_t} Aft (+{rel_fwd}R)"
        total_torp = fwd_t + aft_t + rel_fwd

        guns = sub_data.get("deck_guns", {})
        gun_str = f"{guns.get('main', 'None')} ({guns.get('ammo', 0)}r) | {guns.get('aa', 'None')}"

        has_ac = "Yes (E14Y Glen)" if sub_data.get("has_aircraft") else "No"
        if "Sen-Toku" in c_name:
            ac_model = "3x Aichi M6A1 Seiran Attack Bombers"
            has_ac = "Yes (3x M6A1 Seiran)"
        elif sub_data.get("has_aircraft"):
            ac_model = "Yokosuka E14Y 'Glen' Recon Floatplane"
        else:
            ac_model = "None (No Hangar / Catapult)"

        has_k = "Yes (1944+)" if sub_data.get("has_kaiten") else "No"
        vassal = sub_data.get("vassal_filename", "")
        notes = sub_data.get("special_rules", "")

        dmg = sub_data.get("damage_capacity", {})
        hull_cap = dmg.get("hull", 8)
        flood_cap = dmg.get("flooding", 8)

        phases = [p for p in sub_data.get("patrol_phases", []) if p != "N/A"]
        track_str = " -> ".join(phases) if phases else "Standard Transit -> Stations"

        vals = [
            c_name, f_title, av_date, p_len, displ, speed_rng, crew, prod,
            tt_str, gun_str, has_ac, has_k, vassal, notes,
            f"{hull_cap} Hits", f"{flood_cap} Levels", f"{total_torp} Torpedoes",
            ac_model, track_str
        ]

        for c_idx, val in enumerate(vals):
            col_letter = get_column_letter(c_idx + 1)
            cell = ws_specs[f"{col_letter}{row_sub}"]
            cell.value = val
            cell.font = font_data
            cell.fill = row_fill
            cell.border = box_data

            if col_letter in ["A", "C", "D", "G", "H", "K", "L", "O", "P", "Q"]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

        row_sub += 1

    ws_specs.freeze_panes = "A5"


    # =========================================================================
    # SHEET 1: SUBMARINE COMMISSIONING (Interactive Sub Selector & Setup)
    # =========================================================================
    ws0 = wb.create_sheet(title="SUBMARINE COMMISSIONING")
    ws0.views.sheetView[0].showGridLines = True
    ws0.page_setup.orientation = ws0.ORIENTATION_LANDSCAPE
    ws0.page_setup.paperSize = ws0.PAPERSIZE_A4
    ws0.page_setup.fitToPage = True
    ws0.page_setup.fitToWidth = 1
    ws0.page_setup.fitToHeight = 0

    ws0.merge_cells("A1:Q1")
    ws0["A1"] = "SENSUlKAN: FLEET SUBMARINE COMMISSIONING DOCK & SELECTOR"
    ws0["A1"].font = font_title
    ws0["A1"].fill = fill_navy
    ws0["A1"].alignment = align_title

    ws0.merge_cells("A2:Q2")
    ws0["A2"] = "STEP 1: CHOOSE YOUR SUBMARINE CLASS & COMMISSION YOUR COMMANDER (大日本帝國海軍 潜水艦就役記録)"
    ws0["A2"].font = font_subtitle
    ws0["A2"].fill = fill_subhdr
    ws0["A2"].alignment = align_title

    ws0.row_dimensions[1].height = 26
    ws0.row_dimensions[2].height = 18

    ws0.merge_cells("A4:Q4")
    ws0["A4"] = "FLEET SUBMARINE SELECTION & TECHNICAL SPECIFICATIONS DOCK"
    ws0["A4"].font = font_section
    ws0["A4"].fill = fill_gold
    ws0["A4"].alignment = align_left
    ws0.row_dimensions[4].height = 22

    ws0.row_dimensions[5].height = 28
    ws0.merge_cells("A5:C5")
    ws0["A5"] = "SELECT SUBMARINE CLASS:"
    ws0["A5"].font = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
    ws0["A5"].fill = fill_navy
    ws0["A5"].alignment = align_right
    for c in ws0["A5:C5"][0]:
        c.border = box_data
        c.fill = fill_navy

    ws0.merge_cells("D5:G5")
    ws0["D5"] = "Type B-3 Class"
    ws0["D5"].font = Font(name="Segoe UI", size=11, bold=True, color="0F172A")
    ws0["D5"].fill = PatternFill("solid", fgColor="FEF08A")
    ws0["D5"].alignment = align_center
    for c in ws0["D5:G5"][0]: c.border = box_data

    ws0.merge_cells("H5:Q5")
    ws0["H5"] = "◄ USE THE DROPDOWN TO SELECT ANY OF THE 18 IJN CLASSES (ALL SPECIFICATIONS AUTO-UPDATE BELOW)"
    ws0["H5"].font = font_milestone
    ws0["H5"].fill = fill_kpi
    ws0["H5"].alignment = align_left
    for c in ws0["H5:Q5"][0]: c.border = box_data

    spec_fields = [
        (7, "Full Official Designation:", "C7:G7", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 2, FALSE), \"\")",
            "Displacement (Surf / Subm):", "J7:L7", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 5, FALSE), \"\")",
            "Speed & Operational Range:", "O7:Q7", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 6, FALSE), \"\")"),
        (8, "Service Date Available:", "C8:G8", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 3, FALSE), \"\")",
            "Standard Crew Complement:", "J8:L8", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 7, FALSE), \"\")",
            "Historical Units Produced:", "O8:Q8", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 8, FALSE), \"\")"),
        (9, "Patrol Duration Profile:", "C9:G9", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 4, FALSE), \"\")",
            "Aviation Hangar / Catapult:", "J9:L9", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 18, FALSE), \"\")",
            "Kaiten Suicide Carrier Conversion:", "O9:Q9", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 12, FALSE), \"\")"),
        (10, "Torpedo Tubes & Reloads:", "C10:G10", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 9, FALSE), \"\")",
            "Deck Gun Armament:", "J10:L10", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 10, FALSE), \"\")",
            "Total Torpedo Payload:", "O10:Q10", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 17, FALSE), \"\")"),
        (11, "Hull Damage Hits Capacity:", "C11:G11", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 15, FALSE) & \" before sinking\", \"\")",
            "Flooding Levels Capacity:", "J11:L11", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 16, FALSE) & \" before foundering\", \"\")",
            "Station Track Architecture:", "O11:Q11", "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 19, FALSE), \"\")"),
    ]

    for r, l1, r1, f1, l2, r2, f2, l3, r3, f3 in spec_fields:
        ws0.row_dimensions[r].height = 21
        ws0.merge_cells(f"A{r}:B{r}")
        ws0[f"A{r}"] = l1
        ws0[f"A{r}"].font = font_data_bold
        ws0[f"A{r}"].fill = fill_kpi
        ws0[f"A{r}"].alignment = align_right
        for c in ws0[f"A{r}:B{r}"][0]: c.border = box_data

        ws0.merge_cells(r1)
        start1 = r1.split(":")[0]
        ws0[start1] = f1
        ws0[start1].font = font_data
        ws0[start1].fill = fill_spec_val
        ws0[start1].alignment = align_left
        for c in ws0[r1][0]: c.border = box_data

        ws0[f"H{r}"].border = Border()

        ws0[f"I{r}"] = l2
        ws0[f"I{r}"].font = font_data_bold
        ws0[f"I{r}"].fill = fill_kpi
        ws0[f"I{r}"].alignment = align_right
        ws0[f"I{r}"].border = box_data

        ws0.merge_cells(r2)
        start2 = r2.split(":")[0]
        ws0[start2] = f2
        ws0[start2].font = font_data
        ws0[start2].fill = fill_spec_val
        ws0[start2].alignment = align_left
        for c in ws0[r2][0]: c.border = box_data

        ws0.merge_cells(f"M{r}:N{r}")
        ws0[f"M{r}"] = l3
        ws0[f"M{r}"].font = font_data_bold
        ws0[f"M{r}"].fill = fill_kpi
        ws0[f"M{r}"].alignment = align_right
        for c in ws0[f"M{r}:N{r}"][0]: c.border = box_data

        ws0.merge_cells(r3)
        start3 = r3.split(":")[0]
        ws0[start3] = f3
        ws0[start3].font = font_data
        ws0[start3].fill = fill_spec_val
        ws0[start3].alignment = align_left
        for c in ws0[r3][0]: c.border = box_data

    ws0.row_dimensions[12].height = 18
    ws0.row_dimensions[13].height = 36
    ws0.merge_cells("A12:B13")
    ws0["A12"] = "Tactical Role &\nOperational Notes:"
    ws0["A12"].font = font_data_bold
    ws0["A12"].fill = fill_kpi
    ws0["A12"].alignment = align_right
    for row in ws0["A12:B13"]:
        for c in row: c.border = box_data

    ws0.merge_cells("C12:Q13")
    ws0["C12"] = "=IFERROR(VLOOKUP(D5, 'SUBMARINE SPECIFICATIONS'!$A$5:$S$22, 14, FALSE), \"\")"
    ws0["C12"].font = font_data
    ws0["C12"].fill = fill_spec_val
    ws0["C12"].alignment = align_left
    for row in ws0["C12:Q13"]:
        for c in row: c.border = box_data

    # Section B: Commissioning Form (User Input) (Rows 15-18)
    ws0.merge_cells("A15:E15")
    ws0["A15"] = "SUBMARINE COMMISSIONING DATA"
    ws0["A15"].font = font_section
    ws0["A15"].fill = fill_gold
    ws0["A15"].alignment = align_left

    ws0.merge_cells("G15:K15")
    ws0["G15"] = "COMMANDER & INITIAL ASSIGNMENT"
    ws0["G15"].font = font_section
    ws0["G15"].fill = fill_gold
    ws0["G15"].alignment = align_left

    ws0.merge_cells("M15:Q15")
    ws0["M15"] = "COMMANDER SPECIAL ABILITIES"
    ws0["M15"].font = font_section
    ws0["M15"].fill = fill_gold
    ws0["M15"].alignment = align_left
    ws0.row_dimensions[15].height = 22

    comm_inputs = [
        (16, "Submarine Hull No. / Name:", "C16:E16", "I-58", "Commander Name:", "I16:K16", "Kenjiro Takahashi", "Primary Special Skill:", "O16:Q16", "Torpedo Specialist (+1 Hit)"),
        (17, "Assigned Squadron / Div:", "C17:E17", "1st Submarine Squadron", "Commander Starting Rank:", "I17:K17", "Lt. Commander", "Secondary Special Skill:", "O17:Q17", "Expert Watch (+1 Sight)"),
        (18, "Home Naval Base / Port:", "C18:E18", "Kure", "Commissioning Date:", "I18:K18", "December 1941", "Career Operational Status:", "O18:Q18", "Active - In War Patrols"),
    ]

    for r, l1, r1, v1, l2, r2, v2, l3, r3, v3 in comm_inputs:
        ws0.row_dimensions[r].height = 22
        ws0.merge_cells(f"A{r}:B{r}")
        ws0[f"A{r}"] = l1
        ws0[f"A{r}"].font = font_data_bold
        ws0[f"A{r}"].alignment = align_right
        ws0[f"A{r}"].fill = fill_kpi
        for c in ws0[f"A{r}:B{r}"][0]: c.border = box_data

        ws0.merge_cells(r1)
        st1 = r1.split(":")[0]
        ws0[st1] = v1
        ws0[st1].font = Font(name="Segoe UI", size=10, bold=True, color="1E293B")
        ws0[st1].fill = fill_input
        ws0[st1].alignment = align_left
        for c in ws0[r1][0]: c.border = box_data

        ws0[f"F{r}"].border = Border()

        ws0.merge_cells(f"G{r}:H{r}")
        ws0[f"G{r}"] = l2
        ws0[f"G{r}"].font = font_data_bold
        ws0[f"G{r}"].alignment = align_right
        ws0[f"G{r}"].fill = fill_kpi
        for c in ws0[f"G{r}:H{r}"][0]: c.border = box_data

        ws0.merge_cells(r2)
        st2 = r2.split(":")[0]
        ws0[st2] = v2
        ws0[st2].font = Font(name="Segoe UI", size=10, bold=True, color="1E293B")
        ws0[st2].fill = fill_input
        ws0[st2].alignment = align_left
        for c in ws0[r2][0]: c.border = box_data

        ws0[f"L{r}"].border = Border()

        ws0.merge_cells(f"M{r}:N{r}")
        ws0[f"M{r}"] = l3
        ws0[f"M{r}"].font = font_data_bold
        ws0[f"M{r}"].alignment = align_right
        ws0[f"M{r}"].fill = fill_kpi
        for c in ws0[f"M{r}:N{r}"][0]: c.border = box_data

        ws0.merge_cells(r3)
        st3 = r3.split(":")[0]
        ws0[st3] = v3
        ws0[st3].font = Font(name="Segoe UI", size=10, bold=True, color="1E293B")
        ws0[st3].fill = fill_input
        ws0[st3].alignment = align_left
        for c in ws0[r3][0]: c.border = box_data

    # Section C: LIVE CAREER EVALUATION & INTELLIGENCE BADGES (Rows 20-21)
    ws0.merge_cells("A20:Q20")
    ws0["A20"] = "LIVE CAREER INTELLIGENCE & COMMANDER MERIT EVALUATION (CALCULADO AUTOMÁTICAMENTE)"
    ws0["A20"].font = font_section
    ws0["A20"].fill = fill_navy
    ws0["A20"].alignment = align_left
    ws0.row_dimensions[20].height = 22

    ws0.row_dimensions[21].height = 24
    ws0.merge_cells("A21:E21")
    ws0["A21"] = '=IF(\'PATROL LOG SHEET\'!$F$56>=60000, "CAPTAIN (大佐) — ELIGIBLE FOR FLEET ADMIRALTY", IF(\'PATROL LOG SHEET\'!$F$56>=35000, "CAPTAIN (大佐) — PROMOTION EARNED", IF(\'PATROL LOG SHEET\'!$F$56>=15000, "COMMANDER (中佐) — PROMOTION EARNED", I17 & " (INITIAL RANK)")))'
    ws0["A21"].font = font_data_bold
    ws0["A21"].fill = fill_kpi_gold
    ws0["A21"].alignment = align_center
    for c in ws0["A21:E21"][0]: c.border = box_data

    ws0.merge_cells("G21:K21")
    ws0["G21"] = '=IF(\'PATROL LOG SHEET\'!$F$56>=100000, "Grand Cordon Rising Sun (Grand Fleet Ace)", IF(\'PATROL LOG SHEET\'!$F$56>=60000, "Order of the Golden Kite, 2nd Class", IF(\'PATROL LOG SHEET\'!$F$56>=35000, "Order of the Golden Kite, 3rd Class", IF(\'PATROL LOG SHEET\'!$F$56>=20000, "Order of the Sacred Treasure", IF(\'PATROL LOG SHEET\'!$D$56>=1, "Naval Campaign Medal (Active Veteran)", "Awaiting First Confirmed Sinking")))))'
    ws0["G21"].font = font_data_bold
    ws0["G21"].fill = PatternFill("solid", fgColor="E0F2FE")
    ws0["G21"].alignment = align_center
    for c in ws0["G21:K21"][0]: c.border = box_data

    ws0.merge_cells("M21:Q21")
    ws0["M21"] = '="Career Total: " & \'PATROL LOG SHEET\'!$D$56 & " Patrols | Sunk: " & TEXT(\'PATROL LOG SHEET\'!$F$56, "#,##0") & " tons"'
    ws0["M21"].font = font_data_bold
    ws0["M21"].fill = fill_spec_val
    ws0["M21"].alignment = align_center
    for c in ws0["M21:Q21"][0]: c.border = box_data

    # Section D: Directory of All 18 Submarines Quick Reference (Rows 23+)
    ws0.merge_cells("A23:Q23")
    ws0["A23"] = "FLEET SUBMARINES DIRECTORY — ALL 18 IMPERIAL JAPANESE NAVY CLASSES (CATÁLOGO RÁPIDO)"
    ws0["A23"].font = font_section
    ws0["A23"].fill = fill_gold
    ws0["A23"].alignment = align_left
    ws0.row_dimensions[23].height = 22

    dir_headers = [
        ("A", "Class Name", 16),
        ("B", "Full Designation", 24),
        ("C", "Service Date", 14),
        ("D", "Patrol Duration", 14),
        ("E", "Displacement", 15),
        ("F", "Speed / Range", 20),
        ("G", "Crew", 8),
        ("H", "Units", 8),
        ("I", "Torpedo Tubes", 18),
        ("J", "Deck Guns", 20),
        ("K", "Aircraft", 12),
        ("L", "Kaiten", 11),
        ("M", "Historical Role & Operational Highlight", 40),
    ]

    ws0.row_dimensions[24].height = 24
    for col_l, hdr_t, col_w in dir_headers:
        if col_l == "M":
            ws0.merge_cells(f"M24:Q24")
            c = ws0["M24"]
            c.value = hdr_t
            c.font = font_table_hdr
            c.fill = fill_navy
            c.alignment = align_header
            for cell in ws0["M24:Q24"][0]: cell.border = box_header
        else:
            c = ws0[f"{col_l}24"]
            c.value = hdr_t
            c.font = font_table_hdr
            c.fill = fill_navy
            c.alignment = align_header
            c.border = box_header

    r_dir = 25
    for sub_k, sub_data in db.get("submarines", {}).items():
        ws0.row_dimensions[r_dir].height = 20
        row_fill = fill_grey if r_dir % 2 == 0 else fill_white

        c_name = sub_data.get("class_name", sub_k)
        f_title = sub_data.get("full_title", "")
        av_date = sub_data.get("available_date", "")
        p_len = sub_data.get("patrol_length", "")
        stats = sub_data.get("stats", {})
        displ = stats.get("displacement", "")
        speed_rng = f"{stats.get('speed', '')} / {stats.get('range', '')}"
        crew = stats.get("crew", "")
        prod = stats.get("produced", "")

        tt = sub_data.get("torpedo_tubes", {})
        tt_str = f"{tt.get('fwd', 0)}F / {tt.get('aft', 0)}A (+{tt.get('reloads_fwd', 0)}R)"

        guns = sub_data.get("deck_guns", {})
        gun_str = f"{guns.get('main', 'None')} | {guns.get('aa', 'None')}"

        has_ac = "Yes" if sub_data.get("has_aircraft") else "No"
        has_k = "Yes" if sub_data.get("has_kaiten") else "No"
        notes = sub_data.get("special_rules", "")

        d_vals = [c_name, f_title, av_date, p_len, displ, speed_rng, crew, prod, tt_str, gun_str, has_ac, has_k]
        for c_idx, val in enumerate(d_vals):
            col_letter = get_column_letter(c_idx + 1)
            cell = ws0[f"{col_letter}{r_dir}"]
            cell.value = val
            cell.font = font_data
            cell.fill = row_fill
            cell.border = box_data
            if col_letter in ["A", "C", "D", "G", "H", "K", "L"]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

        ws0.merge_cells(f"M{r_dir}:Q{r_dir}")
        ws0[f"M{r_dir}"] = notes
        ws0[f"M{r_dir}"].font = font_data
        ws0[f"M{r_dir}"].fill = row_fill
        ws0[f"M{r_dir}"].alignment = align_left
        for cell in ws0[f"M{r_dir}:Q{r_dir}"][0]: cell.border = box_data

        r_dir += 1

    # Data Validations on Sheet 0
    dv_sub_sel = DataValidation(type="list", formula1="=LIST_SUB_CLASSES", allow_blank=True)
    ws0.add_data_validation(dv_sub_sel)
    dv_sub_sel.add("D5")

    dv_base_sel = DataValidation(type="list", formula1="=LIST_BASES", allow_blank=True)
    ws0.add_data_validation(dv_base_sel)
    dv_base_sel.add("C18")

    dv_rank_sel = DataValidation(type="list", formula1="=LIST_RANKS", allow_blank=True)
    ws0.add_data_validation(dv_rank_sel)
    dv_rank_sel.add("I17")

    dv_stat_sel = DataValidation(type="list", formula1="=LIST_STATUS", allow_blank=True)
    ws0.add_data_validation(dv_stat_sel)
    dv_stat_sel.add("O18")

    dv_skill_sel = DataValidation(type="list", formula1="=LIST_SKILLS", allow_blank=True)
    ws0.add_data_validation(dv_skill_sel)
    dv_skill_sel.add("O16")
    dv_skill_sel.add("O17")


    # =========================================================================
    # SHEET 2: PATROL LOG SHEET (SENSUIKAN ROGU BUKKU - 潜水艦ログブック)
    # Faithful reproduction of User's Authentic Japanese / Bilingual Log Book
    # =========================================================================
    ws1 = wb.create_sheet(title="PATROL LOG SHEET")
    ws1.views.sheetView[0].showGridLines = True
    ws1.page_setup.orientation = ws1.ORIENTATION_LANDSCAPE
    ws1.page_setup.paperSize = ws1.PAPERSIZE_A4
    ws1.page_setup.fitToPage = True
    ws1.page_setup.fitToWidth = 1
    ws1.page_setup.fitToHeight = 0

    # Set Column Widths (A to G)
    col_widths = {
        "A": 15,    # Hidzuke
        "B": 17,    # Patorōru bangō
        "C": 28,    # Misshon no shōsai
        "D": 22,    # ichi
        "E": 52,    # Chinbotsu shita senpaku  Chūki
        "F": 15,    # Tonsū
        "G": 18,    # Sōtonsū
    }
    for col_l, w in col_widths.items():
        ws1.column_dimensions[col_l].width = w

    # Row 1: Title Banner
    ws1.merge_cells("A1:G1")
    ws1["A1"] = "SENSUIKAN ROGU BUKKU (潜水艦ログブック — SUBMARINE PATROL LOG)"
    ws1["A1"].font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
    ws1["A1"].fill = fill_navy
    ws1["A1"].alignment = align_title
    ws1.row_dimensions[1].height = 26
    for c in ws1["A1:G1"][0]: c.border = box_header

    # Row 2: Submarine & Commander Identification
    ws1.row_dimensions[2].height = 22
    r2_items = [
        ("A2", "Kayaptun:", font_data_bold, fill_kpi, align_right),
        ("B2", "='SUBMARINE COMMISSIONING'!I16", font_data_bold, fill_input, align_left),
        ("C2", "Ranku:", font_data_bold, fill_kpi, align_right),
        ("D2", "='SUBMARINE COMMISSIONING'!I17", font_data_bold, fill_input, align_left),
        ("E2", "Taipu:", font_data_bold, fill_kpi, align_right),
        ("F2", "='SUBMARINE COMMISSIONING'!D5", font_data_bold, fill_input, align_left),
        ("G2", '="Shitei: " & \'SUBMARINE COMMISSIONING\'!C16', font_data_bold, fill_kpi_gold, align_center),
    ]
    for cell_ref, val, f, bg, al in r2_items:
        c = ws1[cell_ref]
        c.value = val
        c.font = f
        c.fill = bg
        c.alignment = al
        c.border = box_data

    # Row 3: Officers & Specialists
    ws1.row_dimensions[3].height = 21
    r3_items = [
        ("A3", "Keiken: Kayaptun:", font_data_bold, fill_kpi, align_right),
        ("B3", "Veteran (+1 Attack)", font_data, fill_input, align_left),
        ("C3", "Enjinia:", font_data_bold, fill_kpi, align_right),
        ("D3", "Lt. Kenji Sato", font_data, fill_input, align_left),
        ("E3", "Shikkō yakuin:", font_data_bold, fill_kpi, align_right),
        ("F3", "Lt. Hiroshi Tanaka", font_data, fill_input, align_left),
        ("G3", "Nabigētā: Kato | Isei-hei: Yamada", font_data, fill_kpi_val, align_center),
    ]
    for cell_ref, val, f, bg, al in r3_items:
        c = ws1[cell_ref]
        c.value = val
        c.font = f
        c.fill = bg
        c.alignment = al
        c.border = box_data

    # Row 4: Special Craft & Aviation
    ws1.row_dimensions[4].height = 21
    ws1["A4"] = "Pairotto:"
    ws1["A4"].font = font_data_bold
    ws1["A4"].fill = fill_kpi
    ws1["A4"].alignment = align_right
    ws1["A4"].border = box_data

    ws1["B4"] = "WO Isamu Mori (E14Y)"
    ws1["B4"].font = font_data
    ws1["B4"].fill = fill_input
    ws1["B4"].alignment = align_left
    ws1["B4"].border = box_data

    ws1["C4"] = "Kaiten Taiin:"
    ws1["C4"].font = font_data_bold
    ws1["C4"].fill = fill_kpi
    ws1["C4"].alignment = align_right
    ws1["C4"].border = box_data

    ws1["D4"] = "Sub-Lt. Sekio Nishina"
    ws1["D4"].font = font_data
    ws1["D4"].fill = fill_input
    ws1["D4"].alignment = align_left
    ws1["D4"].border = box_data

    ws1["E4"] = "Kogata sensui-tei:"
    ws1["E4"].font = font_data_bold
    ws1["E4"].fill = fill_kpi
    ws1["E4"].alignment = align_right
    ws1["E4"].border = box_data

    ws1.merge_cells("F4:G4")
    ws1["F4"] = "Lt. Naoji Iwasa (Type A Ko-hyoteki Midget Sub)"
    ws1["F4"].font = font_data
    ws1["F4"].fill = fill_input
    ws1["F4"].alignment = align_center
    for c in ws1["F4:G4"][0]: c.border = box_data

    # Row 5: Legend / Combat notation
    ws1.row_dimensions[5].height = 20
    ws1["A5"] = "STATUS LEGEND:"
    ws1["A5"].font = Font(name="Segoe UI", size=8.5, bold=True, color="475569")
    ws1["A5"].fill = fill_kpi
    ws1["A5"].alignment = align_center
    ws1["A5"].border = box_data

    ws1["B5"] = "Sunk (s)"
    ws1["B5"].font = Font(name="Segoe UI", size=9, bold=True, color="166534")
    ws1["B5"].fill = PatternFill("solid", fgColor="DCFCE7")
    ws1["B5"].alignment = align_center
    ws1["B5"].border = box_data

    ws1["C5"] = "Damaged (d)"
    ws1["C5"].font = Font(name="Segoe UI", size=9, bold=True, color="92400E")
    ws1["C5"].fill = PatternFill("solid", fgColor="FEF3C7")
    ws1["C5"].alignment = align_center
    ws1["C5"].border = box_data

    ws1["D5"] = "missed (m)"
    ws1["D5"].font = Font(name="Segoe UI", size=9, bold=True, color="475569")
    ws1["D5"].fill = PatternFill("solid", fgColor="F1F5F9")
    ws1["D5"].alignment = align_center
    ws1["D5"].border = box_data

    ws1.merge_cells("E5:G5")
    ws1["E5"] = 'Notation: e.g. "SS Iron Knight (s), USS Wasp (d)" | Historical arrivals pre-loaded'
    ws1["E5"].font = Font(name="Segoe UI", size=8.5, italic=True, color="64748B")
    ws1["E5"].fill = fill_grey
    ws1["E5"].alignment = align_center
    for c in ws1["E5:G5"][0]: c.border = box_data

    def write_table_headers(row_num):
        ws1.row_dimensions[row_num].height = 22
        headers = [
            ("A", "Hidzuke\n(\u65e5\u4ed8)"),
            ("B", "Pator\u014dru bang\u014d\n(\u30d1\u30c8\u30ed\u30fc\u30eb\u756a\u53f7)"),
            ("C", "Misshon no sh\u014dsai\n(\u30df\u30c3\u30b7\u30e7\u30f3\u306e\u8a73\u7d30)"),
            ("D", "ichi\n(\u4f4d\u7f6e / \u6d77\u57df)"),
            ("E", "Chinbotsu shita senpaku  Ch\u016bki\n(\u6c88\u6ca1\u3057\u305f\u8239\u8236\u30fb\u6ce8\u8a18\u30fb\u5c31\u5f79)"),
            ("F", "Tons\u016b\n(\u9813\u6570 - Sunk)"),
            ("G", "S\u014dtons\u016b\n(\u7dcf\u30c8\u30f3\u6570 - Total)"),
        ]
        for c_let, text in headers:
            cell = ws1[f"{c_let}{row_num}"]
            cell.value = text
            cell.font = font_table_hdr
            cell.fill = fill_navy
            cell.alignment = align_header
            cell.border = box_header

    # Write Initial Header (Row 6)
    write_table_headers(6)

    # Table Blocks
    blocks_data = [
        # Block 1
        (7, [
            ("1941年12月", "Kaidai KD.3 to 6, Junsen J.1m to J.3, KIRAi-sen, type A to C, Sen-Toku"),
            ("1942年1月", ""),
            ("1942年2月", ""),
            ("1942年3月", ""),
            ("1942年4月", ""),
            ("1942年5月", ""),
            ("1942年6月", ""),
            ("1942年7月", "Torpedo changes"),
            ("1942年8月", ""),
        ]),
        # Block 2
        (17, [
            ("1942年9月", "Kaidai KD.7"),
            ("1942年10月", ""),
            ("1942年11月", ""),
            ("1942年12月", ""),
            ("1943年1月", ""),
            ("1943年2月", ""),
            ("1943年3月", ""),
            ("1943年4月", ""),
            ("1943年5月", ""),
            ("1943年6月", ""),
            ("1943年7月", ""),
            ("1943年8月", ""),
            ("1943年9月", ""),
        ]),
        # Block 3
        (31, [
            ("1943年10月", ""),
            ("1943年11月", ""),
            ("1943年12月", ""),
            ("1944年1月", ""),
            ("1944年2月", ""),
            ("1944年3月", ""),
            ("1944年4月", ""),
            ("1944年5月", "Type C.3"),
            ("1944年6月", "Type B.3"),
            ("1944年7月", ""),
            ("1944年8月", ""),
            ("1944年9月", ""),
        ]),
        # Block 4
        (44, [
            ("1944年10月", ""),
            ("1944年11月", ""),
            ("1944年12月", "Sen-toku"),
            ("1945年1月", ""),
            ("1945年2月", ""),
            ("1945年3月", ""),
            ("1945年4月", ""),
            ("1945年5月", "Type A(Mod)"),
            ("1945年6月", ""),
            ("1945年7月", "Sen-taka"),
            ("1945年8月", ""),
            ("1945年9月", ""),
        ]),
    ]

    # Write repeating headers at rows 16, 30, 43
    write_table_headers(16)
    write_table_headers(30)
    write_table_headers(43)

    for start_r, month_rows in blocks_data:
        for idx, (m_date, m_note) in enumerate(month_rows):
            r = start_r + idx
            ws1.row_dimensions[r].height = 18
            row_fill = fill_grey if idx % 2 == 1 else fill_white

            # Col A: Hidzuke
            ca = ws1[f"A{r}"]
            ca.value = m_date
            ca.font = font_date
            ca.fill = row_fill
            ca.alignment = align_center
            ca.border = box_data

            # Col B: Patorōru bangō
            cb = ws1[f"B{r}"]
            cb.value = ""
            cb.font = font_data_bold
            cb.fill = row_fill
            cb.alignment = align_center
            cb.border = box_data

            # Col C: Misshon no shōsai
            cc = ws1[f"C{r}"]
            cc.value = ""
            cc.font = font_data
            cc.fill = row_fill
            cc.alignment = align_left
            cc.border = box_data

            # Col D: ichi
            cd = ws1[f"D{r}"]
            cd.value = ""
            cd.font = font_data
            cd.fill = row_fill
            cd.alignment = align_left
            cd.border = box_data

            # Col E: Chinbotsu shita senpaku  Chūki
            ce = ws1[f"E{r}"]
            ce.value = m_note
            ce.font = font_milestone if m_note else font_data
            ce.fill = fill_milestone if m_note else row_fill
            ce.alignment = align_left
            ce.border = box_data

            # Col F: Tonsū (Tonnage sunk input)
            cf = ws1[f"F{r}"]
            cf.value = ""
            cf.font = font_data_bold
            cf.fill = row_fill
            cf.alignment = align_right
            cf.number_format = "#,##0"
            cf.border = box_data

            # Col G: Sōtonsū (Cumulative tonnage formula)
            cg = ws1[f"G{r}"]
            cg.value = f'=IF(OR(F{r}<>"", B{r}<>""), SUM($F$7:F{r}), "")'
            cg.font = font_data_bold
            cg.fill = row_fill
            cg.alignment = align_right
            cg.number_format = '#,##0 "tons"'
            cg.border = box_data

    # Row 56: Summary Row
    ws1.row_dimensions[56].height = 24
    ws1.merge_cells("A56:C56")
    ws1["A56"] = "Jisshi sa reta patorōru no sōsū: (Total Patrols)"
    ws1["A56"].font = font_table_hdr
    ws1["A56"].fill = fill_navy
    ws1["A56"].alignment = align_right
    for c in ws1["A56:C56"][0]: c.border = box_total

    ws1["D56"] = '=COUNTIF(B7:B15, "<>")+COUNTIF(B17:B29, "<>")+COUNTIF(B31:B42, "<>")+COUNTIF(B44:B55, "<>")'
    ws1["D56"].font = font_kpi_val
    ws1["D56"].fill = fill_kpi_gold
    ws1["D56"].alignment = align_center
    ws1["D56"].number_format = '0 "Patrols"'
    ws1["D56"].border = box_total

    ws1["E56"] = "Chinbotsu-sen no sōtonsū: (Total Sunk Tonnage)"
    ws1["E56"].font = font_table_hdr
    ws1["E56"].fill = fill_navy
    ws1["E56"].alignment = align_right
    ws1["E56"].border = box_total

    ws1.merge_cells("F56:G56")
    ws1["F56"] = '=SUM(F7:F15)+SUM(F17:F29)+SUM(F31:F42)+SUM(F44:F55)'
    ws1["F56"].font = font_kpi_val
    ws1["F56"].fill = fill_kpi_gold
    ws1["F56"].alignment = align_center
    ws1["F56"].number_format = '#,##0 "tons"'
    for c in ws1["F56:G56"][0]: c.border = box_total

    # Row 58: Career Header
    ws1.row_dimensions[58].height = 22
    ws1.merge_cells("A58:G58")
    ws1["A58"] = "Shokureki kyaria no Hensen (職歴・キャリアの変遷 — COMMANDER CAREER PROGRESSION & DOSSIER)"
    ws1["A58"].font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
    ws1["A58"].fill = fill_navy
    ws1["A58"].alignment = align_title
    for c in ws1["A58:G58"][0]: c.border = box_header

    # Row 59: Commander Profile
    ws1.row_dimensions[59].height = 22
    ws1["A59"] = "Namae:"
    ws1["A59"].font = font_data_bold
    ws1["A59"].fill = fill_kpi
    ws1["A59"].alignment = align_right
    ws1["A59"].border = box_data

    ws1.merge_cells("B59:D59")
    ws1["B59"] = "Kenjiro Takahashi (高橋 健二郎)"
    ws1["B59"].font = Font(name="Segoe UI", size=10.5, bold=True, color="1E293B")
    ws1["B59"].fill = fill_input
    ws1["B59"].alignment = align_left
    for c in ws1["B59:D59"][0]: c.border = box_data

    ws1["E59"] = "Ranku:"
    ws1["E59"].font = font_data_bold
    ws1["E59"].fill = fill_kpi
    ws1["E59"].alignment = align_right
    ws1["E59"].border = box_data

    ws1.merge_cells("F59:G59")
    ws1["F59"] = '=IF(F56>=100000, "Rear Admiral (少将)", IF(F56>=60000, "Captain (大佐 - Decisive)", IF(F56>=35000, "Captain (大佐 - Promoted)", IF(F56>=15000, "Commander (中佐)", \'SUBMARINE COMMISSIONING\'!I17))))'
    ws1["F59"].font = Font(name="Segoe UI", size=10, bold=True, color="1E293B")
    ws1["F59"].fill = fill_kpi_gold
    ws1["F59"].alignment = align_center
    for c in ws1["F59:G59"][0]: c.border = box_data

    # Row 61: Biography Header
    ws1.row_dimensions[61].height = 20
    ws1.merge_cells("A61:G61")
    ws1["A61"] = "Baiogurafī (バイオグラフィー — OFFICIAL IMPERIAL JAPANESE NAVY DOSSIER)"
    ws1["A61"].font = font_subtitle
    ws1["A61"].fill = fill_subhdr
    ws1["A61"].alignment = align_title
    for c in ws1["A61:G61"][0]: c.border = box_header

    # Rows 62-67: Full Biography Text
    bio_text = (
        "Born to a family of traditional fishermen, Takahashi developed an early fascination with the sea before entering the naval academy in Etajima.\n\n"
        "He volunteered for the fledgling submarine service in the late 1920s, viewing undersea warfare as the vanguard of the empire's naval strategy. "
        "In 1937 he served as a torpedo lieutenant during the Second Sino-Japanese War, gaining vital experience in coastal patrols and night manoeuvres.\n\n"
        "His father Daisuke Takahashi is a stern, third-generation master fisherman from Maizuru. He passed down an intimate knowledge of ocean currents and weather patterns, which later aided Kenjiro's navigation skills. "
        "His mother, Emi Takahashi is the daughter of a local Shinto priest. She instilled in Takahashi a profound sense of duty, spiritual discipline, and devotion to the Emperor.\n\n"
        "He is married to Chiyo Takahashi, with a son, Isamu (born 1934) and daughter, Mariko (born 1938)."
    )
    ws1.merge_cells("A62:G67")
    ws1["A62"] = bio_text
    ws1["A62"].font = Font(name="Segoe UI", size=9, color="1E293B")
    ws1["A62"].fill = PatternFill("solid", fgColor="F8FAFC")
    ws1["A62"].alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
    for row in ws1["A62:G67"]:
        for c in row: c.border = box_data

    # Row 69: Promotions & Awards Headers
    ws1.row_dimensions[69].height = 20
    ws1.merge_cells("A69:B69")
    ws1["A69"] = "Puromōshon (Promotion)"
    ws1["A69"].font = font_table_hdr
    ws1["A69"].fill = fill_navy
    ws1["A69"].alignment = align_header
    for c in ws1["A69:B69"][0]: c.border = box_header

    ws1["C69"] = "Hidzuke (Date)"
    ws1["C69"].font = font_table_hdr
    ws1["C69"].fill = fill_navy
    ws1["C69"].alignment = align_header
    ws1["C69"].border = box_header

    ws1["D69"] = ""
    ws1["D69"].border = Border()

    ws1.merge_cells("E69:F69")
    ws1["E69"] = "Shō (Awards & Decorations)"
    ws1["E69"].font = font_table_hdr
    ws1["E69"].fill = fill_navy
    ws1["E69"].alignment = align_header
    for c in ws1["E69:F69"][0]: c.border = box_header

    ws1["G69"] = "Hidzuke (Date)"
    ws1["G69"].font = font_table_hdr
    ws1["G69"].fill = fill_navy
    ws1["G69"].alignment = align_header
    ws1["G69"].border = box_header

    # Career Progression Rows (70 to 76)
    career_progression = [
        (70, "Ensign (少尉 - Shōi)", "1932 (Etajima Graduation)", "Naval Service Commendation Ribbon", "Active Campaign Ribbon"),
        (71, "Sub-Lieutenant (中尉 - Chūi)", "1935 (Submarine School)", "Order of the Sacred Treasure, 5th Class", "[20,000 tons]"),
        (72, "Lieutenant (大尉 - Taii)", "1937 (Sino-Japanese War)", "Order of the Golden Kite, 3rd Class", "[35,000 tons]"),
        (73, "Lt. Commander (少佐 - Shōsa)", "1941年12月 (Campaign Start)", "Order of the Golden Kite, 2nd Class", "[60,000 tons]"),
        (74, "Commander (中佐 - Chūsa)", "[Target: 15,000 tons / Merit]", "Grand Cordon of the Order of the Rising Sun", "[100,000 tons]"),
        (75, "Captain (大佐 - Taisa)", "[Target: 35,000 tons / Decisive]", "Kaiten Special Operation Citation", "[Special Mission]"),
        (76, "Rear Admiral (少将 - Shōshō)", "[Target: 100,000 tons / Fleet Ace]", "Posthumous Double Promotion (KIA)", "[Lost in Action]"),
    ]

    for r_p, p_rank, p_dt, a_med, a_dt in career_progression:
        ws1.row_dimensions[r_p].height = 19
        row_fill = fill_grey if r_p % 2 == 1 else fill_white

        # Left: Promotion
        ws1.merge_cells(f"A{r_p}:B{r_p}")
        ws1[f"A{r_p}"] = p_rank
        ws1[f"A{r_p}"].font = font_data_bold
        ws1[f"A{r_p}"].fill = row_fill
        ws1[f"A{r_p}"].alignment = align_left
        for c in ws1[f"A{r_p}:B{r_p}"][0]: c.border = box_data

        ws1[f"C{r_p}"] = p_dt
        ws1[f"C{r_p}"].font = font_data
        ws1[f"C{r_p}"].fill = fill_input if "[" in p_dt else row_fill
        ws1[f"C{r_p}"].alignment = align_center
        ws1[f"C{r_p}"].border = box_data

        ws1[f"D{r_p}"] = ""
        ws1[f"D{r_p}"].border = Border()

        # Right: Awards
        ws1.merge_cells(f"E{r_p}:F{r_p}")
        ws1[f"E{r_p}"] = a_med
        ws1[f"E{r_p}"].font = font_data_bold
        ws1[f"E{r_p}"].fill = row_fill
        ws1[f"E{r_p}"].alignment = align_left
        for c in ws1[f"E{r_p}:F{r_p}"][0]: c.border = box_data

        ws1[f"G{r_p}"] = a_dt
        ws1[f"G{r_p}"].font = font_data
        ws1[f"G{r_p}"].fill = fill_input if "[" in a_dt else row_fill
        ws1[f"G{r_p}"].alignment = align_center
        ws1[f"G{r_p}"].border = box_data

    # Data Validations on ws1
    dv_missions = DataValidation(type="list", formula1="=LIST_MISSIONS", allow_blank=True)
    ws1.add_data_validation(dv_missions)

    dv_zones = DataValidation(type="list", formula1="=LIST_ZONES", allow_blank=True)
    ws1.add_data_validation(dv_zones)

    for r_range in ["C7:C15", "C17:C29", "C31:C42", "C44:C55"]:
        dv_missions.add(r_range)

    for r_range in ["D7:D15", "D17:D29", "D31:D42", "D44:D55"]:
        dv_zones.add(r_range)

    ws1.freeze_panes = "A7"

    # =========================================================================
    # SHEET 3: COMBAT & ENCOUNTERS (Tactical Contact Log)
    # =========================================================================
    ws2 = wb.create_sheet(title="COMBAT & ENCOUNTERS")
    ws2.views.sheetView[0].showGridLines = True
    ws2.page_setup.orientation = ws2.ORIENTATION_LANDSCAPE
    ws2.page_setup.paperSize = ws2.PAPERSIZE_A4
    ws2.page_setup.fitToPage = True
    ws2.page_setup.fitToWidth = 1
    ws2.page_setup.fitToHeight = 0

    ws2.merge_cells("A1:N1")
    ws2["A1"] = "SENSUlKAN: TARGET ENGAGEMENTS & COMBAT ENCOUNTER LOG"
    ws2["A1"].font = font_title
    ws2["A1"].fill = fill_navy
    ws2["A1"].alignment = align_title

    ws2.merge_cells("A2:N2")
    ws2["A2"] = "DETAILED TACTICAL ACTION RECORD: TORPEDO / DECK GUN / KAITEN / MIDGET SUB ATTACKS & ESCORT RETALIATION"
    ws2["A2"].font = font_subtitle
    ws2["A2"].fill = fill_subhdr
    ws2["A2"].alignment = align_title

    ws2.row_dimensions[1].height = 25
    ws2.row_dimensions[2].height = 17

    ws2.row_dimensions[4].height = 24
    combat_kpis = [
        ("A", "B", "TOTAL TARGETS ENGAGED", '=COUNTIF(F7:F60, "<>")', '#,##0 "ships"'),
        ("C", "D", "CONFIRMED SUNK", '=COUNTIF(J7:J60, "Sunk")', '#,##0 "sunk"'),
        ("E", "F", "TOTAL TONNAGE SUNK", '=SUMIF(J7:J60, "Sunk", H7:H60)', '#,##0 "tons"'),
        ("G", "H", "MERCHANT TONNAGE", '=SUMIFS(H7:H60, J7:J60, "Sunk", E7:E60, "Merchant") + SUMIFS(H7:H60, J7:J60, "Sunk", E7:E60, "Tanker")', '#,##0 "tons"'),
        ("I", "J", "WARSHIP TONNAGE", '=SUMIFS(H7:H60, J7:J60, "Sunk", E7:E60, "<>Merchant", E7:E60, "<>Tanker")', '#,##0 "tons"'),
        ("K", "L", "TORPEDO HIT RATIO", '=IFERROR(SUM(K7:K60)/SUM(L7:L60), 0)', '0.0%'),
        ("M", "N", "MAJOR WARSHIPS SUNK", '=COUNTIF(E7:E60, "Fleet Carrier") + COUNTIF(E7:E60, "Battleship") + COUNTIF(E7:E60, "Heavy Cruiser") + COUNTIF(E7:E60, "Light Cruiser")', '#,##0'),
    ]
    for c1, c2, title, formula, num_fmt in combat_kpis:
        rng = f"{c1}4:{c2}4"
        ws2.merge_cells(rng)
        ws2[f"{c1}4"] = formula
        ws2[f"{c1}4"].font = font_data_bold
        ws2[f"{c1}4"].fill = fill_spec_val if "TONNAGE" in title else PatternFill("solid", fgColor="E2E8F0")
        ws2[f"{c1}4"].alignment = align_center
        ws2[f"{c1}4"].number_format = num_fmt
        for cell in ws2[rng][0]: cell.border = box_data

    ws2.row_dimensions[6].height = 28
    c_headers = [
        ("A", "Patrol\n#", 8),
        ("B", "Encounter\n#", 11),
        ("C", "Date /\nMonth", 12),
        ("D", "Operational Zone /\nStation Box", 22),
        ("E", "Target Ship Category\n(Merchant / Warship)", 22),
        ("F", "Ship Name / Identification\n(Historical or Convoys)", 26),
        ("G", "Target\nNation", 13),
        ("H", "Tonnage\n(GRT / Tons)", 15),
        ("I", "Attack Mode\n(Submerged / Surface / Night)", 22),
        ("J", "Engagement Result\n(Sunk / Damaged / Missed)", 18),
        ("K", "Torpedoes\nHit", 12),
        ("L", "Torpedoes\nFired / Duds", 14),
        ("M", "Escort Depth Charge\nAttack & Countermeasure", 28),
        ("N", "Tactical Observations & Narrative Notes", 44),
    ]

    for col_letter, hdr_text, col_w in c_headers:
        cell = ws2[f"{col_letter}6"]
        cell.value = hdr_text
        cell.font = font_table_hdr
        cell.fill = fill_navy
        cell.alignment = align_header
        cell.border = box_header
        ws2.column_dimensions[col_letter].width = col_w

    for idx in range(1, 55):
        r = 6 + idx
        ws2.row_dimensions[r].height = 22
        row_fill = fill_grey if idx % 2 == 0 else fill_white
        e_vals = ["", idx, "", "", "Merchant", "", "USA", 0, "Submerged Day Torpedo", "Sunk", 0, 0, "No escorts present", ""]

        for c_idx, val in enumerate(e_vals):
            col_letter = get_column_letter(c_idx + 1)
            cell = ws2[f"{col_letter}{r}"]
            cell.value = val
            cell.font = font_data
            cell.fill = row_fill
            cell.border = box_data

            if col_letter in ["A", "B", "C", "G", "K", "L"]:
                cell.alignment = align_center
            elif col_letter in ["H"]:
                cell.alignment = align_right
                cell.number_format = "#,##0"
            else:
                cell.alignment = align_left

    fill_sunk = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
    font_sunk = Font(name="Segoe UI", size=9, bold=True, color="166534")
    rule_sunk = CellIsRule(operator="equal", formula=['"Sunk"'], fill=fill_sunk, font=font_sunk)
    ws2.conditional_formatting.add("J7:J60", rule_sunk)

    fill_dmg = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
    font_dmg = Font(name="Segoe UI", size=9, bold=True, color="92400E")
    rule_dmg = CellIsRule(operator="equal", formula=['"Damaged"'], fill=fill_dmg, font=font_dmg)
    ws2.conditional_formatting.add("J7:J60", rule_dmg)

    ws2.freeze_panes = "A7"


    # =========================================================================
    # SHEET 4: CREW & OFFICERS ROSTER (Personal y Dotación)
    # =========================================================================
    ws3 = wb.create_sheet(title="CREW & OFFICERS ROSTER")
    ws3.views.sheetView[0].showGridLines = True
    ws3.page_setup.orientation = ws3.ORIENTATION_LANDSCAPE
    ws3.page_setup.paperSize = ws3.PAPERSIZE_A4
    ws3.page_setup.fitToPage = True
    ws3.page_setup.fitToWidth = 1
    ws3.page_setup.fitToHeight = 0

    ws3.merge_cells("A1:K1")
    ws3["A1"] = "SENSUlKAN: IMPERIAL NAVY SUBMARINE CREW ROSTER"
    ws3["A1"].font = font_title
    ws3["A1"].fill = fill_navy
    ws3["A1"].alignment = align_title

    ws3.merge_cells("A2:K2")
    ws3["A2"] = "OFFICERS, SPECIALISTS & CREW SECTIONS STATUS, EXPERIENCE & CASUALTY TRACKER"
    ws3["A2"].font = font_subtitle
    ws3["A2"].fill = fill_subhdr
    ws3["A2"].alignment = align_title

    ws3.row_dimensions[1].height = 25
    ws3.row_dimensions[2].height = 17

    ws3.row_dimensions[4].height = 26
    crew_headers = [
        ("A", "Position / Duty\n(Puesto)", 24),
        ("B", "Rank\n(Rango Naval)", 18),
        ("C", "Name\n(Nombre del Oficial / Marino)", 24),
        ("D", "Crew Quality\n(Veteranía)", 16),
        ("E", "Special Skill / Trait\n(Habilidad Especial)", 26),
        ("F", "Physical Status\n(Estado de Salud)", 20),
        ("G", "Patrols\nCompleted", 11),
        ("H", "Wounds\nTaken", 9),
        ("I", "Decorations & Honors\n(Medallas y Citaciones)", 28),
        ("J", "Kaiten / Aircraft Pilot\nDesignation (Si Aplica)", 24),
        ("K", "Personnel Career Notes & Fate\n(Destino / Sustituciones)", 38),
    ]

    for col_letter, hdr_text, col_w in crew_headers:
        cell = ws3[f"{col_letter}4"]
        cell.value = hdr_text
        cell.font = font_table_hdr
        cell.fill = fill_navy
        cell.alignment = align_header
        cell.border = box_header
        ws3.column_dimensions[col_letter].width = col_w

    roster_template = [
        ("Captain (CO - 艦長)", "Commander", "='SUBMARINE COMMISSIONING'!I16", "Veteran", "='SUBMARINE COMMISSIONING'!O16", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "='SUBMARINE COMMISSIONING'!G21", "N/A", "Skipper throughout campaign."),
        ("Executive Officer (XO - 副長)", "Lieutenant", "Takashi Tanaka", "Veteran", "Damage Control Expert", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Rising Sun 6th Class", "N/A", "Ready to assume command."),
        ("Chief Engineer (機関長)", "Lieutenant", "Hiroshi Sato", "Crack / Elite", "Evasive Maneuvers", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Sacred Treasure 6th Class", "N/A", "Superb diesel mechanic."),
        ("Navigator (航海長)", "Sub-Lieutenant", "Kenji Suzuki", "Trained", "Expert Watch (+1 Sight)", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Naval Campaign Medal", "N/A", "Calculates star sights."),
        ("Medical Officer (軍医長)", "Lieutenant", "Doctor Kato", "Trained", "None", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Naval Medical Ribbon", "N/A", "Equipped sickbay."),
        ("Chief of Boat (先任下士官)", "Lieutenant", "Osamu Takahashi", "Veteran", "Leadership & High Morale", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Long Service Medal", "N/A", "Leads the ratings."),
        ("Torpedo Section (水雷科)", "Sub-Lieutenant", "Crew Section A", "Veteran", "Torpedo Specialist (+1 Hit)", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Torpedo Proficiency Badge", "N/A", "Bow torpedo room crew."),
        ("Deck Gun Section (砲術科)", "Ensign", "Crew Section B", "Trained", "None", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Gunner Badge", "N/A", "Manning 140mm gun."),
        ("Diesel & Motor Dept (機関科)", "Ensign", "Crew Section C", "Veteran", "Damage Control Expert", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Engineering Badge", "N/A", "Stokehold & electric motors."),
        ("Lookout / Watch Section (見張科)", "Ensign", "Crew Section D", "Crack / Elite", "Expert Watch (+1 Sight)", "Fit for Duty", "='PATROL LOG SHEET'!$D$56", 0, "Lookout Citation", "N/A", "Bridge binoculars team."),
        ("E14Y Glen Recon Pilot (航空搭乗員)", "Sub-Lieutenant", "Nobuo Fujita", "Veteran", "Silent Running", "Fit for Duty", 0, 0, "Aviation Wings", "E14Y Floatplane", "Catapult recon missions."),
        ("Kaiten Pilot 1 (回天特攻隊)", "Sub-Lieutenant", "Kiyoshi Ishikawa", "Crack / Elite", "Aggressive (+1 Close)", "Fit for Duty", 0, 0, "Special Attack Ribbon", "Kaiten Pilot #1", "Awaiting operational order."),
        ("Kaiten Pilot 2 (回天特攻隊)", "Ensign", "Shoji Murata", "Trained", "Aggressive (+1 Close)", "Fit for Duty", 0, 0, "Special Attack Ribbon", "Kaiten Pilot #2", "Awaiting operational order."),
        ("Kaiten Pilot 3 (回天特攻隊)", "Ensign", "Kazuo Watanabe", "Trained", "Aggressive (+1 Close)", "Fit for Duty", 0, 0, "Special Attack Ribbon", "Kaiten Pilot #3", "Awaiting operational order."),
        ("Kaiten Pilot 4 (回天特攻隊)", "Ensign", "Toshio Saito", "Trained", "Aggressive (+1 Close)", "Fit for Duty", 0, 0, "Special Attack Ribbon", "Kaiten Pilot #4", "Awaiting operational order."),
        ("Reserve Crew / Replacements (予備員)", "Ensign", "Replacements Depot", "Green", "None", "Fit for Duty", 0, 0, "None", "Reserve Pool", "Reinforcements from Kure depot."),
    ]

    for idx, member in enumerate(roster_template):
        r = 4 + idx + 1
        ws3.row_dimensions[r].height = 22
        row_fill = fill_grey if idx % 2 == 0 else fill_white

        for c_idx, val in enumerate(member):
            col_letter = get_column_letter(c_idx + 1)
            cell = ws3[f"{col_letter}{r}"]
            cell.value = val
            cell.font = font_data
            cell.fill = row_fill
            cell.border = box_data

            if col_letter in ["B", "D", "F", "G", "H", "J"]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

    fill_kia = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
    font_kia = Font(name="Segoe UI", size=9, bold=True, color="991B1B")
    rule_kia = CellIsRule(operator="equal", formula=['"Killed in Action (KIA)"'], fill=fill_kia, font=font_kia)
    ws3.conditional_formatting.add("F5:F25", rule_kia)

    ws3.freeze_panes = "A5"


    # =========================================================================
    # SHEET 6: CAMPAIGN SCORING & RULES (Guía y Puntuación)
    # =========================================================================
    ws5 = wb.create_sheet(title="CAMPAIGN SCORING & RULES")
    ws5.views.sheetView[0].showGridLines = True
    ws5.page_setup.orientation = ws5.ORIENTATION_LANDSCAPE
    ws5.page_setup.paperSize = ws5.PAPERSIZE_A4
    ws5.page_setup.fitToPage = True
    ws5.page_setup.fitToWidth = 1
    ws5.page_setup.fitToHeight = 0

    ws5.merge_cells("A1:I1")
    ws5["A1"] = "SENSUlKAN: CAMPAIGN SCORING, HISTORICAL ACES & PLAYER AIDS"
    ws5["A1"].font = font_title
    ws5["A1"].fill = fill_navy
    ws5["A1"].alignment = align_title

    ws5.merge_cells("A2:I2")
    ws5["A2"] = "CAREER VICTORY TIERS, TOP IJN COMMANDER RECORDS, OFFICIAL ERRATA & SEQUENCE OF PLAY"
    ws5["A2"].font = font_subtitle
    ws5["A2"].fill = fill_subhdr
    ws5["A2"].alignment = align_title

    ws5.row_dimensions[1].height = 25
    ws5.row_dimensions[2].height = 17

    ws5.merge_cells("A4:D4")
    ws5["A4"] = "CAREER VICTORY LEVEL ASSESSMENT"
    ws5["A4"].font = font_section
    ws5["A4"].fill = fill_gold
    ws5["A4"].alignment = align_left

    victory_tiers = [
        ("Tonnage Sunk\n(GRT)", "Career Result", "Historical Outcome & Evaluation", "Honor Awarded"),
        ("100,000+ tons", "LEGENDARY FLEET ACE", "Surpassed all historical IJN submarine commanders. Decisive strategic impact on the war.", "Grand Cordon Order of the Rising Sun"),
        ("60,000 - 99,999 tons", "DECISIVE VICTORY", "Outstanding tactical mastery. Among the top 1% of the Imperial Japanese Navy.", "Order of the Golden Kite, 2nd Class"),
        ("35,000 - 59,999 tons", "SUBSTANTIAL VICTORY", "Exceeded historical average. Highly successful combat patrols throughout the war.", "Order of the Golden Kite, 3rd Class"),
        ("20,000 - 34,999 tons", "HISTORICAL AVERAGE", "Matches historical submarine achievements under severe Allied ASW pressure.", "Order of the Sacred Treasure"),
        ("5,000 - 19,999 tons", "MARGINAL PERFORMANCE", "Limited combat success; frequent evasions or mechanical breakdowns.", "Naval Service Commendation"),
        ("< 5,000 tons (Survived)", "SURVIVOR", "Brought submarine and crew home alive despite overwhelming Allied superiority.", "Naval Defense Ribbon"),
        ("Submarine Sunk (KIA)", "LOST IN ACTION", "Eternal rest in the Pacific depths. Enshrined at Yasukuni Jinja.", "Posthumous Double Promotion (戰死特進)"),
    ]

    for idx, (c1, c2, c3, c4) in enumerate(victory_tiers):
        r = 5 + idx
        ws5.row_dimensions[r].height = 26 if idx > 0 else 24
        is_hdr = (idx == 0)
        for c_idx, val in enumerate([c1, c2, c3, c4]):
            col_letter = get_column_letter(c_idx + 1)
            cell = ws5[f"{col_letter}{r}"]
            cell.value = val
            cell.border = box_data
            if is_hdr:
                cell.font = font_table_hdr
                cell.fill = fill_navy
                cell.alignment = align_header
            else:
                cell.font = font_data
                cell.fill = fill_grey if idx % 2 == 0 else fill_white
                if c_idx < 2:
                    cell.alignment = align_center
                else:
                    cell.alignment = align_left

    ws5.column_dimensions["E"].width = 3

    ws5.merge_cells("F4:I4")
    ws5["F4"] = "HISTORICAL TOP IJN SUBMARINE ACES (BENCHMARK)"
    ws5["F4"].font = font_section
    ws5["F4"].fill = fill_gold
    ws5["F4"].alignment = align_left

    aces = [
        ("Commander Name", "Submarine(s)", "Tonnage Sunk", "Notable Combat Actions"),
        ("Cdr. Matsumura Kanji", "I-21", "44,000 tons", "Most successful IJN sub patrol off Australia & Noumea; sank SS Iron Knight & Hobart tankers."),
        ("Lt. Cdr. Hashimoto Mochitsura", "I-58", "19,800 tons", "Sunk heavy cruiser USS Indianapolis (CA-35) with conventional Type 95 torpedoes."),
        ("Cdr. Tonozuka Kinzo", "I-168", "16,290 tons", "Midway: Torpedoed and sank fleet carrier USS Yorktown (CV-5) and destroyer Hammann."),
        ("Cdr. Kinashi Takakazu", "I-19", "25,000 tons", "Guadalcanal: Single 6-torpedo salvo sank USS Wasp (CV-7) & damaged USS North Carolina (BB-55)."),
        ("Cdr. Yokota Minoru", "I-26", "23,500 tons", "Damaged aircraft carrier USS Saratoga (CV-3); sank light cruiser USS Juneau (CL-52)."),
        ("Lt. Cdr. Tabata Noriyuki", "I-180", "13,500 tons", "Aggressive convoy attacks along Australian eastern coast; sunk Australian hospital ship Centaur."),
    ]

    for idx, (c1, c2, c3, c4) in enumerate(aces):
        r = 5 + idx
        ws5.row_dimensions[r].height = 26 if idx > 0 else 24
        is_hdr = (idx == 0)
        for c_idx, val in enumerate([c1, c2, c3, c4]):
            col_letter = get_column_letter(c_idx + 6)
            cell = ws5[f"{col_letter}{r}"]
            cell.value = val
            cell.border = box_data
            if is_hdr:
                cell.font = font_table_hdr
                cell.fill = fill_navy
                cell.alignment = align_header
            else:
                cell.font = font_data
                cell.fill = fill_grey if idx % 2 == 0 else fill_white
                if c_idx in [1, 2]:
                    cell.alignment = align_center
                else:
                    cell.alignment = align_left

    # REAL-TIME ACE BENCHMARK EVALUATOR CARD (Row 13)
    ws5.row_dimensions[13].height = 24
    ws5.merge_cells("A13:D13")
    ws5["A13"] = "YOUR CURRENT FLEET STANDING:"
    ws5["A13"].font = font_data_bold
    ws5["A13"].fill = fill_navy
    ws5["A13"].alignment = align_right
    for c in ws5["A13:D13"][0]:
        c.border = box_data
        c.fill = fill_navy
        c.font = Font(name="Segoe UI", size=9.5, bold=True, color="FFFFFF")

    ws5.merge_cells("F13:I13")
    ws5["F13"] = '=IF(\'PATROL LOG SHEET\'!$F$56>=44000, "★ SUPREME FLEET ACE — Exceeded Cdr. Matsumura Kanji (I-21: 44,000 tons)", IF(\'PATROL LOG SHEET\'!$K$49>=25000, "★ ELITE FLEET ACE — Exceeded Cdr. Kinashi Takakazu (I-19: 25,000 tons)", IF(\'PATROL LOG SHEET\'!$K$49>=23500, "★ SENIOR FLEET ACE — Exceeded Cdr. Yokota Minoru (I-26: 23,500 tons)", IF(\'PATROL LOG SHEET\'!$K$49>=19800, "★ FAMOUS ACE — Exceeded Lt. Cdr. Hashimoto Mochitsura (I-58: 19,800 tons)", IF(\'PATROL LOG SHEET\'!$K$49>=16290, "★ COMBAT ACE — Exceeded Cdr. Tonozuka Kinzo (I-168: 16,290 tons)", IF(\'PATROL LOG SHEET\'!$K$49>=13500, "★ RISING ACE — Exceeded Lt. Cdr. Tabata Noriyuki (I-180: 13,500 tons)", "MIDGET / PROVISIONAL — Striving towards the 13,500 tons ace threshold"))))))'
    ws5["F13"].font = font_data_bold
    ws5["F13"].fill = PatternFill("solid", fgColor="FEF08A")
    ws5["F13"].alignment = align_center
    for c in ws5["F13:I13"][0]: c.border = box_data

    ws5.column_dimensions["A"].width = 18
    ws5.column_dimensions["B"].width = 24
    ws5.column_dimensions["C"].width = 46
    ws5.column_dimensions["D"].width = 34
    ws5.column_dimensions["E"].width = 3
    ws5.column_dimensions["F"].width = 28
    ws5.column_dimensions["G"].width = 14
    ws5.column_dimensions["H"].width = 16
    ws5.column_dimensions["I"].width = 54

    # Section 3: Official Errata & Rules Clarifications (Rows 15-22)
    ws5.merge_cells("A15:I15")
    ws5["A15"] = "OFFICIAL SENSUlKAN ERRATA & CLARIFICATIONS (Incorporated in this Suite)"
    ws5["A15"].font = font_section
    ws5["A15"].fill = fill_navy
    ws5["A15"].alignment = align_left
    ws5.row_dimensions[15].height = 24

    errata_list = [
        ("• Submarine Patrol Log:", "Sen-Toku availability updated to December 1944 (not September 1944)."),
        ("• Submarine Mats - Sen-Toku:", "All 8 torpedo tubes are Forward (none aft). Aft torpedo damage hits treated as No Effect."),
        ("• Submarine Mats - Junsen J.3:", "Includes Aft Torpedo Doors damage box in Systems Status."),
        ("• Kaiten Installation:", "Conversion occurs automatically on date (typically removes deck gun), but Kaiten carried ONLY on Kaiten missions."),
        ("• Countersheet Reminder:", "Daihatsu landing craft counter used on Transport Missions [7.4] as reminder counter."),
        ("• Special Missions:", "Extra Transit boxes reduce On-Station boxes on submarine mat for distant deployment."),
    ]

    for idx, (topic, rule_text) in enumerate(errata_list):
        r = 16 + idx
        ws5.row_dimensions[r].height = 24

        ws5.merge_cells(f"A{r}:B{r}")
        ws5[f"A{r}"] = topic
        ws5[f"A{r}"].font = font_data_bold
        ws5[f"A{r}"].fill = fill_grey if idx % 2 == 0 else fill_white
        ws5[f"A{r}"].alignment = align_left
        for cell in ws5[f"A{r}:B{r}"][0]: cell.border = box_data

        ws5.merge_cells(f"C{r}:I{r}")
        ws5[f"C{r}"] = rule_text
        ws5[f"C{r}"].font = font_data
        ws5[f"C{r}"].fill = fill_grey if idx % 2 == 0 else fill_white
        ws5[f"C{r}"].alignment = align_left
        for cell in ws5[f"C{r}:I{r}"][0]: cell.border = box_data

    # Section 4: Sequence of Play (Rows 24-31)
    ws5.merge_cells("A24:I24")
    ws5["A24"] = "SENSUlKAN: PATROL SEQUENCE OF PLAY (Resumen de Secuencia de Juego)"
    ws5["A24"].font = font_section
    ws5["A24"].fill = fill_navy
    ws5["A24"].alignment = align_left
    ws5.row_dimensions[24].height = 24

    sop = [
        ("PHASE 1: PATROL PREPARATION", "Select Submarine class & crew. Outfit torpedoes (Type 95 / Type 93 / Type 89), deck gun ammo (5 rounds), and check Kaiten / E14Y floatplane availability. Determine assigned Patrol Zone & Mission from Operations Map."),
        ("PHASE 2: OUTBOUND TRANSIT", "Check for transit encounters (air attacks, shallow water reefs, enemy submarine patrols). If damaged, choose whether to abort or continue. Transit boxes reduce on-station time if sailing to distant zones (US West Coast, Indian Ocean, Europe)."),
        ("PHASE 3: PATROL STATIONS", "Advance counter along Station track (1 to 7 stations depending on sub class). Roll on Station Encounter Table for contacts: merchants, escorted convoys, task forces, or aircraft. Optional: Launch E14Y floatplane for reconnaissance contact boost."),
        ("PHASE 4: TACTICAL ENGAGEMENT", "Choose approach mode: Submerged Periscope Day, Surface Night, Long Range Salvo, Kaiten Human Torpedo strike, or Midget Sub launch. Allocate torpedo tubes, roll for hits & duds, check target damage / sinking tonnage."),
        ("PHASE 5: ESCORT COUNTERATTACK", "If attacking escorted targets, surviving escorts roll for counterattack. Execute evasive maneuvers, silent running, deep diving, and false targets (bubbles/oil). Roll on Depth Charge Damage Table for hull hits, flooding, or equipment failure."),
        ("PHASE 6: DAMAGE CONTROL & INBOUND", "Attempt crew repairs on flooded compartments and disabled diesel/electric motors. Sail through Inbound Transit. Return to base (Yokosuka, Kure, Truk, Penang). Check for Captain promotions, medals, and mandatory refit time."),
    ]

    for idx, (title, desc) in enumerate(sop):
        r = 25 + idx
        ws5.row_dimensions[r].height = 30
        ws5[f"A{r}"] = title
        ws5[f"A{r}"].font = font_data_bold
        ws5[f"A{r}"].fill = fill_kpi
        ws5[f"A{r}"].alignment = align_left
        ws5.merge_cells(f"A{r}:B{r}")
        for cell in ws5[f"A{r}:B{r}"][0]:
            cell.border = box_data
            cell.fill = fill_kpi

        ws5.merge_cells(f"C{r}:I{r}")
        ws5[f"C{r}"] = desc
        ws5[f"C{r}"].font = font_data
        ws5[f"C{r}"].fill = fill_grey if idx % 2 == 0 else fill_white
        ws5[f"C{r}"].alignment = align_left
        for cell in ws5[f"C{r}:I{r}"][0]: cell.border = box_data


    # =========================================================================
    # DATA VALIDATIONS ON SHEETS 3 & 4
    # =========================================================================
    # Sheet 3: COMBAT & ENCOUNTERS
    dv_tgt_ws2 = DataValidation(type="list", formula1="=LIST_TARGETS", allow_blank=True)
    ws2.add_data_validation(dv_tgt_ws2)
    dv_tgt_ws2.add("E7:E60")

    dv_nat_ws2 = DataValidation(type="list", formula1="=LIST_NATIONS", allow_blank=True)
    ws2.add_data_validation(dv_nat_ws2)
    dv_nat_ws2.add("G7:G60")

    dv_atk_ws2 = DataValidation(type="list", formula1="=LIST_ATTACK_MODES", allow_blank=True)
    ws2.add_data_validation(dv_atk_ws2)
    dv_atk_ws2.add("I7:I60")

    dv_res_ws2 = DataValidation(type="list", formula1="=LIST_RESULTS", allow_blank=True)
    ws2.add_data_validation(dv_res_ws2)
    dv_res_ws2.add("J7:J60")

    dv_esc_ws2 = DataValidation(type="list", formula1="=LIST_ESCORT", allow_blank=True)
    ws2.add_data_validation(dv_esc_ws2)
    dv_esc_ws2.add("M7:M60")

    dv_zone_ws2 = DataValidation(type="list", formula1="=LIST_ZONES", allow_blank=True)
    ws2.add_data_validation(dv_zone_ws2)
    dv_zone_ws2.add("D7:D60")

    # Sheet 4: CREW & OFFICERS ROSTER
    dv_rank_ws3 = DataValidation(type="list", formula1="=LIST_RANKS", allow_blank=True)
    ws3.add_data_validation(dv_rank_ws3)
    dv_rank_ws3.add("B5:B25")

    dv_qual_ws3 = DataValidation(type="list", formula1="=LIST_CREW_QUAL", allow_blank=True)
    ws3.add_data_validation(dv_qual_ws3)
    dv_qual_ws3.add("D5:D25")

    dv_skill_ws3 = DataValidation(type="list", formula1="=LIST_SKILLS", allow_blank=True)
    ws3.add_data_validation(dv_skill_ws3)
    dv_skill_ws3.add("E5:E25")

    dv_stat_ws3 = DataValidation(type="list", formula1="=LIST_CREW_STAT", allow_blank=True)
    ws3.add_data_validation(dv_stat_ws3)
    dv_stat_ws3.add("F5:F25")


    # =========================================================================
    # REORDER SHEETS: SUBMARINE COMMISSIONING must be the FIRST tab!
    # =========================================================================
    desired_order = [
        "SUBMARINE COMMISSIONING",
        "PATROL LOG SHEET",
        "COMBAT & ENCOUNTERS",
        "CREW & OFFICERS ROSTER",
        "SUBMARINE SPECIFICATIONS",
        "CAMPAIGN SCORING & RULES",
        "LOOKUPS",
    ]
    wb._sheets = [wb[sname] for sname in desired_order]

    # Save Primary Workbook
    try:
        wb.save(output_path)
        print(f"Patrol Log Sheet successfully generated at: {output_path}")
    except PermissionError:
        print(f"WARNING: File {output_path} is currently locked by another application.")

    # docs copy disabled to avoid lock conflicts
    except PermissionError:
        pass

if __name__ == "__main__":
    build_canonical_suite()
