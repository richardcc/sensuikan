import os
import json
import textwrap
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib import patheffects, transforms
from PIL import Image
import cv2
import sys
sys.path.insert(0, os.path.abspath('.'))
from scripts.generators.counter_watermarks import draw_watermark

# Native 1:1 Scale for Epson Color / Standard 100% Print (No shrink compensation needed)
BROTHER_COMP = 1.0
PAGE_W_MM = 297.0 # Standard A4 Landscape
PAGE_H_MM = 210.0 # Standard A4 Landscape

# Canonical Dimensions with Full Crew Status: 238.0 mm wide x 184.0 mm high
# Scaled for Brother Laser: 250.5 mm x 193.7 mm (fits standard A4 with 23mm H / 8mm V margins!)
CARD_W_MM = 238.0 * BROTHER_COMP
CARD_H_MM = 181.5 * BROTHER_COMP # Equal margins: top == bottom == lateral == 2.5mm
VERTICAL_OFFSET_MM = 0.0 # Perfectly centered vertically on A4 page (top == bottom == 9.47mm)

SLOT_SIZE = 15.0 * BROTHER_COMP

_COUNTERS_DB = None
def get_counters_db():
    global _COUNTERS_DB
    if _COUNTERS_DB is None:
        db_path = 'data/counters_database.json'
        if os.path.exists(db_path):
            with open(db_path, 'r', encoding='utf-8') as f:
                _COUNTERS_DB = json.load(f)
        else:
            _COUNTERS_DB = {'counters': {}}
    return _COUNTERS_DB

def match_counter_spec(label, sublabel):
    lbl = (label or '').strip()
    sub = (sublabel or '').strip()
    norm = (lbl + ' ' + sub).replace('\n', ' ').strip().lower()
    lbl_clean = lbl.replace('\n', ' ').strip().lower()

    db = get_counters_db()
    counters = db.get('counters', {})

    # 1. Torpedo tube digits
    if lbl.strip().isdigit() and 1 <= int(lbl.strip()) <= 8:
        return counters.get('torpedo_tube')
    if lbl_clean.startswith('t-') or lbl_clean.startswith('tube'):
        return counters.get('torpedo_tube')

    # 2. Exact flood level stages 1..8 ("flood 1" .. "flood 8")
    if lbl_clean.startswith('flood '):
        num_part = lbl_clean.replace('flood ', '').strip()
        if num_part.isdigit() and f'flood_level_{num_part}' in counters:
            return counters[f'flood_level_{num_part}']

    # 3. Exact hull damage stages 1..8 ("hull 1" .. "hull 8")
    if lbl_clean.startswith('hull '):
        num_part = lbl_clean.replace('hull ', '').strip()
        if num_part.isdigit() and f'hull_damage_level_{num_part}' in counters:
            return counters[f'hull_damage_level_{num_part}']

    # 4. Match via parameterized keywords (pick longest/most specific keyword)
    best_match = None
    best_len = 0
    for cid, spec in counters.items():
        if cid == 'torpedo_tube' or cid.startswith('flood_level_') or cid.startswith('hull_damage_level_'):
            continue
        for kw in spec.get('keywords', []):
            kw_low = kw.lower()
            if kw_low in norm and len(kw_low) > best_len:
                best_match = spec
                best_len = len(kw_low)
    return best_match

def get_icon_for_slot(label, sublabel):
    lbl = (label or '').strip()
    if lbl in ['N/A', '• N/A •']:
        return None, None, None
    spec = match_counter_spec(label, sublabel)
    if spec:
        return spec.get('icon'), spec.get('icon_tint', '#3E4A56'), 0.32
    return None, None, None

_REALISTIC_COUNTER_IMGS = {}

def get_realistic_counter_img(label, sublabel):
    spec = match_counter_spec(label, sublabel)
    if not spec:
        return None
    target_file = spec.get('image_file')
    if not target_file:
        return None

    if target_file not in _REALISTIC_COUNTER_IMGS:
        base_name = os.path.splitext(target_file)[0]
        # Always pick the newest available artwork (sorted by last modification time)
        candidates = [
            os.path.join('images/counters/ai', base_name + '.jpg'),
            os.path.join('images/counters/ai', base_name + '.png'),
            os.path.join('images/counters/ai/preprocessed', base_name + '.jpg'),
            os.path.join('images/counters/ai/preprocessed', base_name + '.png'),
            os.path.join('images/counters/realistic', target_file),
            os.path.join('images/counters/realistic', base_name + '.jpg')
        ]
        existing = [c for c in candidates if os.path.exists(c)]
        chosen_path = max(existing, key=os.path.getmtime) if existing else None
        if chosen_path:
            _REALISTIC_COUNTER_IMGS[target_file] = np.array(Image.open(chosen_path).convert('RGBA'))
        else:
            _REALISTIC_COUNTER_IMGS[target_file] = None
    return _REALISTIC_COUNTER_IMGS[target_file]

def draw_card_slot(ax, cx, cy, label="", sublabel="", bg='#F8FAFC', border='#334155',
                   text_color='#0F172A', water_level=None, is_sunk=False, subcolor='#475569',
                   icon=None, icon_color=None, icon_alpha=None, is_inactive=False):
    half = SLOT_SIZE / 2.0

    if is_inactive:
        # Pristine inactive/empty slot: subtle technical guide box, 0% distracting text
        inact_rect = patches.Rectangle((cx - half, cy - half), SLOT_SIZE, SLOT_SIZE,
                                       linewidth=0.4 * BROTHER_COMP, edgecolor='#CBD5E1',
                                       facecolor='#F3EFE6', linestyle='--', alpha=0.6, zorder=2.5)
        ax.add_patch(inact_rect)
        return

    # Clean, crisp rectangular counter box (NO circular notches on printed card!)
    rect = patches.Rectangle((cx - half, cy - half), SLOT_SIZE, SLOT_SIZE,
                             linewidth=0.9, edgecolor=border, facecolor=bg, zorder=3)
    ax.add_patch(rect)

    # Subtle inner bevel
    inner = 0.5 * BROTHER_COMP
    in_rect = patches.Rectangle((cx - half + inner, cy - half + inner),
                                SLOT_SIZE - 2*inner, SLOT_SIZE - 2*inner,
                                linewidth=0.4, edgecolor=border, facecolor='none', alpha=0.35, zorder=4)
    ax.add_patch(in_rect)

    # Authentic rising water level graphic for Flooding (Warm deep naval wash)
    if water_level is not None and water_level > 0:
        w_h = (SLOT_SIZE - 2*inner) * water_level
        w_rect = patches.Rectangle((cx - half + inner, cy - half + inner),
                                   SLOT_SIZE - 2*inner, w_h,
                                   facecolor='#3B6B94', edgecolor='none', alpha=0.50, zorder=3.5)
        ax.add_patch(w_rect)

    # Realistic 3D Illustrated Counter Art (or Vector Watermark Fallback)
    real_img = get_realistic_counter_img(label, sublabel) if (water_level is None or water_level == 0) else None

    # SUNK hazard cross (fallback only if no realistic art)
    if is_sunk and real_img is None:
        ax.plot([cx - half + 1.2, cx + half - 1.2], [cy - half + 1.2, cy + half - 1.2],
                color='#7A1818', linewidth=1.4, zorder=3.8, alpha=0.7)
        ax.plot([cx - half + 1.2, cx + half - 1.2], [cy + half - 1.2, cy - half + 1.2],
                color='#7A1818', linewidth=1.4, zorder=3.8, alpha=0.7)
    if real_img is not None:
        img_hw = (SLOT_SIZE - 2*inner) / 2.0
        is_digit_tube = bool(label and label.strip().isdigit())

        # Dark navy naval background inside slot so ZERO white on sides
        ax.add_patch(patches.Rectangle((cx - img_hw, cy - img_hw), 2*img_hw, 2*img_hw, facecolor='#0D1520', zorder=3.1))

        y_bot_slot = cy - img_hw + 0.2 * BROTHER_COMP
        y_top_slot = cy + img_hw - 0.2 * BROTHER_COMP

        # Both torpedo tubes and counters with text:
        # Full width [cx - img_hw, cx + img_hw] and strictly inside slot [y_bot_slot, y_top_slot]
        # ZERO white on sides, ZERO protrusion on top, and subject preprocessed 100% above plaque!
        ax.imshow(real_img, extent=(cx - img_hw, cx + img_hw, y_bot_slot, y_top_slot), zorder=3.4, alpha=0.98)
    else:
        ic_name, ic_col, ic_alp = get_icon_for_slot(label, sublabel)
        if icon is not None: ic_name = icon
        if icon_color is not None: ic_col = icon_color
        if icon_alpha is not None: ic_alp = icon_alpha
        if ic_name and not is_sunk and (water_level is None or water_level == 0):
            draw_watermark(ax, cx, cy, ic_name, ic_col, alpha=ic_alp or 0.15, size=SLOT_SIZE * 0.62)

    # Typography: Opción 1 (Cartela Naval Técnica Inferior Azul Marino + Dorado con micro-remaches)
    if real_img is not None:
        w_img = 2.0 * img_hw

        # Prepare lines
        if label:
            if '\n' in label:
                lines = label.split('\n')
            elif sublabel:
                lines = [label, sublabel]
            else:
                words = label.split()
                if len(words) >= 2 and len(label) > 9:
                    mid = len(words) // 2
                    lines = [" ".join(words[:mid]), " ".join(words[mid:])]
                else:
                    lines = [label]
        else:
            lines = [sublabel] if sublabel else []

        if lines:
            # Lower rectangular technical plaque with gold rim and micro-rivets (0% circular badges)
            w_p = w_img - 0.4 * BROTHER_COMP
            x0 = cx - w_p / 2.0
            y0 = cy - img_hw + 0.2 * BROTHER_COMP
            h_p = (3.8 if len(lines) == 1 else (4.8 if len(lines) == 2 else 5.8)) * BROTHER_COMP

            # Dark navy body with brass or crimson trim
            edge_col = '#8C2E24' if is_sunk else '#C5A059'
            ax.add_patch(patches.Rectangle((x0, y0), w_p, h_p, facecolor='#0D1520', edgecolor=edge_col, lw=0.75 * BROTHER_COMP, alpha=0.95, zorder=4.5))
            # 4 micro gold corner rivets
            rivet_r = 0.18 * BROTHER_COMP
            rivet_col = '#C25E50' if is_sunk else '#E2B765'
            for rx, ry in [(x0 + 0.7*BROTHER_COMP, y0 + 0.7*BROTHER_COMP),
                           (x0 + w_p - 0.7*BROTHER_COMP, y0 + 0.7*BROTHER_COMP),
                           (x0 + 0.7*BROTHER_COMP, y0 + h_p - 0.7*BROTHER_COMP),
                           (x0 + w_p - 0.7*BROTHER_COMP, y0 + h_p - 0.7*BROTHER_COMP)]:
                ax.add_patch(patches.Circle((rx, ry), rivet_r, facecolor=rivet_col, edgecolor='#45300E', lw=0.2*BROTHER_COMP, zorder=4.8))

            y_center = y0 + h_p / 2.0
            if len(lines) == 1:
                f_size = 5.0 if len(lines[0]) <= 7 else (4.4 if len(lines[0]) <= 11 else 3.8)
                txt_col = '#FCA5A5' if is_sunk else '#FAF6ED'
                ax.text(cx, y_center, lines[0], fontsize=f_size, weight='bold', color=txt_col, ha='center', va='center', zorder=5)
            else:
                line_spacing = 2.0 * BROTHER_COMP
                y_start = y_center + (len(lines) - 1) * (line_spacing / 2.0)
                for l_i, l_text in enumerate(lines):
                    f_size = 4.0 if len(l_text) <= 8 else 3.5
                    c_col = '#FAF6ED' if l_i == 0 else '#E2B765'
                    ax.text(cx, y_start - l_i * line_spacing, l_text, fontsize=f_size, weight='bold', color=c_col, ha='center', va='center', zorder=5)
    else:
        # Pure technical / abstract slots (Flooding, Hull Damage, Surface, Sunk, Empty)
        font_effects = [patheffects.withStroke(linewidth=2.2 * BROTHER_COMP, foreground='#FFFFFF')]
        cur_text_color = text_color
        cur_subcolor = subcolor
        if label:
            if '\n' in label:
                lines = label.split('\n')
                line_count = len(lines)
                font_s = 5.0 if line_count == 2 else 3.9
                line_spacing = 2.9 * BROTHER_COMP
                y_start = cy + (line_count - 1) * (line_spacing / 2.0)
                for idx, l_text in enumerate(lines):
                    ax.text(cx, y_start - idx * line_spacing, l_text, fontsize=font_s, ha='center', va='center',
                            weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
            elif sublabel:
                ax.text(cx, cy + 2.3*BROTHER_COMP, label, fontsize=4.9, ha='center', va='center',
                        weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                ax.text(cx, cy - 2.7*BROTHER_COMP, sublabel, fontsize=3.8, ha='center', va='center',
                        weight='bold', color=cur_subcolor, zorder=5, path_effects=font_effects)
            else:
                if label.isdigit():
                    ax.text(cx, cy, label, fontsize=10.5, ha='center', va='center',
                            weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                else:
                    words = label.split()
                    if len(words) >= 2 and len(label) > 9:
                        mid = len(words) // 2
                        line1 = " ".join(words[:mid])
                        line2 = " ".join(words[mid:])
                        font_s = 4.7 if len(label) <= 15 else 3.9
                        line_spacing = 2.8 * BROTHER_COMP
                        ax.text(cx, cy + line_spacing / 2.0, line1, fontsize=font_s, ha='center', va='center',
                                weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                        ax.text(cx, cy - line_spacing / 2.0, line2, fontsize=font_s, ha='center', va='center',
                                weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)
                    else:
                        font_s = 5.3 if len(label) <= 6 else (4.6 if len(label) <= 10 else 3.9)
                        ax.text(cx, cy, label, fontsize=font_s, ha='center', va='center',
                                weight='bold', color=cur_text_color, zorder=5, path_effects=font_effects)

def draw_nautical_chart_border(ax, ox, oy, w, h, rw=1.5*BROTHER_COMP, seg_len=5.0*BROTHER_COMP):
    # Outer solid technical border
    ax.add_patch(patches.Rectangle((ox, oy), w, h, linewidth=0.9*BROTHER_COMP,
                                   edgecolor='#1E293B', facecolor='none', zorder=8))
    # Inner solid technical border
    ax.add_patch(patches.Rectangle((ox + rw, oy + rw), w - 2*rw, h - 2*rw, linewidth=0.45*BROTHER_COMP,
                                   edgecolor='#1E293B', facecolor='none', zorder=8))

    # Solid corner blocks
    for cx_c, cy_c in [(ox, oy), (ox + w - rw, oy), (ox, oy + h - rw), (ox + w - rw, oy + h - rw)]:
        ax.add_patch(patches.Rectangle((cx_c, cy_c), rw, rw, facecolor='#1E293B', edgecolor='none', zorder=8.1))

    # Horizontal segments (top & bottom)
    xs = np.arange(ox + rw, ox + w - rw, seg_len)
    for i, x in enumerate(xs):
        seg_w = min(seg_len, (ox + w - rw) - x)
        color = '#1E293B' if (i % 2 == 0) else '#FAF8F3'
        ax.add_patch(patches.Rectangle((x, oy), seg_w, rw, facecolor=color, edgecolor='none', zorder=7.5))
        ax.add_patch(patches.Rectangle((x, oy + h - rw), seg_w, rw, facecolor=color, edgecolor='none', zorder=7.5))

    # Vertical segments (left & right)
    ys = np.arange(oy + rw, oy + h - rw, seg_len)
    for i, y in enumerate(ys):
        seg_h = min(seg_len, (oy + h - rw) - y)
        color = '#1E293B' if (i % 2 == 0) else '#FAF8F3'
        ax.add_patch(patches.Rectangle((ox, y), rw, seg_h, facecolor=color, edgecolor='none', zorder=7.5))
        ax.add_patch(patches.Rectangle((ox + w - rw, y), rw, seg_h, facecolor=color, edgecolor='none', zorder=7.5))


def draw_print_calibration_and_crop_marks(ax, ox, oy, card_w, card_h, page_w=297.0, page_h=210.0):
    # 1. Corner Crop Marks (Guias de Corte de Esquinas)
    offset = 1.5 # mm gap from card border so lines do not touch card
    length = 6.0 # mm length of cut tick
    color = '#1E293B'
    lw = 0.55
    
    corners = [
        (ox, oy, -1, -1),                          # Bottom-Left
        (ox + card_w, oy, 1, -1),                  # Bottom-Right
        (ox, oy + card_h, -1, 1),                  # Top-Left
        (ox + card_w, oy + card_h, 1, 1)           # Top-Right
    ]
    
    for cx, cy, dx, dy in corners:
        ax.plot([cx + dx * offset, cx + dx * (offset + length)], [cy, cy], color=color, lw=lw, zorder=10)
        ax.plot([cx, cx], [cy + dy * offset, cy + dy * (offset + length)], color=color, lw=lw, zorder=10)

    # 2. Horizontal Calibration Scale Bar (100 mm) at Top Margin
    ruler_w = 100.0 # Exact 100 mm
    ruler_x0 = (page_w - ruler_w) / 2.0 # Centered horizontally at 148.5 mm
    ruler_y = oy + card_h + 4.2 # Placed in top margin
    
    ax.plot([ruler_x0, ruler_x0 + ruler_w], [ruler_y, ruler_y], color=color, lw=0.6, zorder=10)
    
    for mm in range(101):
        x = ruler_x0 + mm
        if mm % 10 == 0:
            tick_h = 2.0
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.6, zorder=10)
            ax.text(x, ruler_y + tick_h + 0.4, str(mm), fontsize=3.2, ha='center', va='bottom', color=color, weight='bold', zorder=10)
        elif mm % 5 == 0:
            tick_h = 1.3
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.45, zorder=10)
        else:
            tick_h = 0.7
            ax.plot([x, x], [ruler_y, ruler_y + tick_h], color=color, lw=0.3, zorder=10)

    ax.text(ruler_x0 + ruler_w / 2.0, ruler_y - 1.2,
            '◄── 100 mm PRINT CALIBRATION SCALE (VERIFY WITH PHYSICAL RULER • EXACT 100% SCALE) ──►',
            fontsize=3.4, ha='center', va='top', color=color, weight='bold', zorder=10)

    # 3. Vertical Calibration Scale Bar (50 mm) at Left Margin
    v_ruler_h = 50.0 # Exact 50 mm
    v_ruler_x = ox - 11.0 # Centered in left white margin
    v_ruler_y0 = (page_h - v_ruler_h) / 2.0 # Centered vertically at 80 mm
    
    ax.plot([v_ruler_x, v_ruler_x], [v_ruler_y0, v_ruler_y0 + v_ruler_h], color=color, lw=0.6, zorder=10)
    for mm in range(51):
        y = v_ruler_y0 + mm
        if mm % 10 == 0:
            tick_w = 2.0
            ax.plot([v_ruler_x - tick_w, v_ruler_x], [y, y], color=color, lw=0.6, zorder=10)
            ax.text(v_ruler_x - tick_w - 0.5, y, str(mm), fontsize=3.0, ha='right', va='center', color=color, weight='bold', zorder=10)
        elif mm % 5 == 0:
            tick_w = 1.3
            ax.plot([v_ruler_x - tick_w, v_ruler_x], [y, y], color=color, lw=0.45, zorder=10)
        else:
            tick_w = 0.7
            ax.plot([v_ruler_x - tick_w, v_ruler_x], [y, y], color=color, lw=0.3, zorder=10)
            
    ax.text(v_ruler_x + 1.2, v_ruler_y0 + v_ruler_h / 2.0,
            '50 mm VERTICAL SCALE',
            fontsize=3.0, ha='left', va='center', rotation=90, color=color, weight='bold', zorder=10)

_WAX_SEAL_IMG = None

def draw_confidential_stamp(ax, cx, cy, size_mm=17.0*BROTHER_COMP):
    global _WAX_SEAL_IMG
    wax_path = 'images/realistic_wax_seal_confidential_02.png'
    if _WAX_SEAL_IMG is None and os.path.exists(wax_path):
        _WAX_SEAL_IMG = np.array(Image.open(wax_path).convert('RGBA'))

    if _WAX_SEAL_IMG is not None:
        hw = size_mm / 2.0
        ax.imshow(_WAX_SEAL_IMG, extent=(cx - hw, cx + hw, cy - hw, cy + hw), zorder=3.8)
    else:
        # Fallback to vector stamp box
        w_mm = 22.0 * BROTHER_COMP
        h_mm = 8.5 * BROTHER_COMP
        hw = w_mm / 2.0
        hh = h_mm / 2.0
        ax.add_patch(patches.Rectangle((cx - hw, cy - hh), w_mm, h_mm,
                                       linewidth=0.85*BROTHER_COMP, edgecolor='#991B1B', facecolor='#FEF2F2',
                                       alpha=0.85, zorder=3.8))
        ax.text(cx, cy + 1.2*BROTHER_COMP, 'CONFIDENTIAL', fontsize=3.8, weight='bold',
                color='#991B1B', ha='center', va='center', zorder=4.0, alpha=0.90)
        ax.text(cx, cy - 1.8*BROTHER_COMP, 'TOP SECRET', fontsize=3.5, weight='bold',
                color='#991B1B', ha='center', va='center', zorder=4.0, alpha=0.90)

_STAMP_KIMITSU_IMG = None

def draw_imperial_hanko(ax, cx, cy, r_mm=5.5*BROTHER_COMP, angle=4.0):
    global _STAMP_KIMITSU_IMG
    stamp_path = 'images/stamp_gunji_kimitsu_transparent.png'
    if _STAMP_KIMITSU_IMG is None and os.path.exists(stamp_path):
        _STAMP_KIMITSU_IMG = Image.open(stamp_path).convert('RGBA')

    if _STAMP_KIMITSU_IMG is not None:
        # Rotate slightly for authentic hand-stamped ink feel
        rot = _STAMP_KIMITSU_IMG.rotate(-angle, resample=Image.BICUBIC, expand=True)
        rot_arr = np.array(rot)
        w_mm = r_mm * 2.0
        h_mm = w_mm * (rot.size[1] / float(rot.size[0]))
        hw = w_mm / 2.0
        hh = h_mm / 2.0
        ax.imshow(rot_arr, extent=(cx - hw, cx + hw, cy - hh, cy + hh), zorder=3.8, alpha=0.85)
    else:
        t = transforms.Affine2D().rotate_deg_around(cx, cy, angle) + ax.transData
        ax.add_patch(patches.Circle((cx, cy), r_mm, linewidth=0.8*BROTHER_COMP,
                                    edgecolor='#991B1B', facecolor='#FEF2F2', alpha=0.68, transform=t, zorder=3.8))
        ax.add_patch(patches.Circle((cx, cy), r_mm - 0.5*BROTHER_COMP, linewidth=0.35*BROTHER_COMP,
                                    edgecolor='#991B1B', facecolor='none', alpha=0.68, transform=t, zorder=3.8))

def draw_section_header_plaque(ax, x0, y_mid, text, width, h=3.6*BROTHER_COMP, fontsize=None):
    y0 = y_mid - h/2.0
    # Technical plate background
    ax.add_patch(patches.Rectangle((x0, y0), width, h, linewidth=0.45*BROTHER_COMP,
                                   edgecolor='#5A6B7C', facecolor='#EAE5DB', zorder=2.8))
    # 4 corner micro-rivets
    r_rivet = 0.32 * BROTHER_COMP
    for rx, ry in [(x0 + 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                   (x0 + width - 0.8*BROTHER_COMP, y0 + 0.8*BROTHER_COMP),
                   (x0 + 0.8*BROTHER_COMP, y0 + h - 0.8*BROTHER_COMP),
                   (x0 + width - 0.8*BROTHER_COMP, y0 + h - 0.8*BROTHER_COMP)]:
        ax.add_patch(patches.Circle((rx, ry), r_rivet, facecolor='#78716C', edgecolor='#292524', lw=0.2*BROTHER_COMP, zorder=2.9))
        ax.add_patch(patches.Circle((rx - 0.08*BROTHER_COMP, ry + 0.08*BROTHER_COMP), 0.09*BROTHER_COMP, facecolor='#FFFFFF', edgecolor='none', zorder=3.0))
    # Text centered
    fs = fontsize if fontsize is not None else (4.2 if h >= 3.0*BROTHER_COMP else 3.8)
    ax.text(x0 + width/2.0, y_mid, text, fontsize=fs, weight='bold', color='#1E293B', ha='center', va='center', zorder=3.1)

SHIPYARD_METADATA = {
    "Kaidai_KD3_Class": {
        "title": "KAIDAI  KD.3  CLASS",
        "subtitle": "FLEET SUBMARINE  |  KD3A / KD3B TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-53..I-60, I-63"]
    },
    "Kaidai_KD4_Class": {
        "title": "KAIDAI  KD.4  CLASS",
        "subtitle": "FLEET SUBMARINE  |  KD4 TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-61, I-62, I-64"]
    },
    "Kaidai_KD5_Class": {
        "title": "KAIDAI  KD.5  CLASS",
        "subtitle": "FLEET SUBMARINE  |  KD5 TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-65..I-67"]
    },
    "Kaidai_KD6_Class": {
        "title": "KAIDAI  KD.6  CLASS",
        "subtitle": "FLEET SUBMARINE  |  KD6A / KD6B TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-68..I-75, I-176"]
    },
    "Kaidai_KD7_Class": {
        "title": "KAIDAI  KD.7  CLASS",
        "subtitle": "FINAL FLEET SUBMARINE  |  KD7 TYPE",
        "badges": ["AVAILABLE: SEP 1942", "PATROLS: 2 MONTHS", "HULLS: I-177..I-185"]
    },
    "Kirai_Sen_Class": {
        "title": "KIRAI-SEN  CLASS  (I-121)",
        "subtitle": "SUBMARINE MINELAYER  |  KRS TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-121, 122, 123, 124"]
    },
    "Junsen_J_IM_Class": {
        "title": "JUNSEN  J.1M  CLASS  (I-5)",
        "subtitle": "AIRCRAFT CRUISER SUBMARINE  |  J1M TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-5 (MODIFIED)"]
    },
    "Junsen_J2_Class": {
        "title": "JUNSEN  J.2  CLASS  (I-6)",
        "subtitle": "AIRCRAFT CRUISER SUBMARINE  |  J2 TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-6"]
    },
    "Junsen_J3_Class": {
        "title": "JUNSEN  J.3  CLASS  (I-7)",
        "subtitle": "FLAGSHIP CRUISER SUBMARINE  |  J3 TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 2 MONTHS", "HULLS: I-7, I-8"]
    },
    "Type_A_Class": {
        "title": "TYPE  A  CLASS  (I-9)",
        "subtitle": "SQUADRON FLAGSHIP SUBMARINE  |  KO-GATA TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 3 MONTHS", "HULLS: I-9, I-10, I-11"]
    },
    "Type_B_Class": {
        "title": "TYPE  B  CLASS  (I-15)",
        "subtitle": "OCEAN CRUISER SUBMARINE  |  OTSU-GATA TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 3 MONTHS", "HULLS: I-15..I-39 (20 BUILT)"]
    },
    "Type_B_3_Class": {
        "title": "TYPE  B.3  CLASS  (I-56)",
        "subtitle": "LATE CRUISER SUBMARINE  |  OTSU-KAI TYPE",
        "badges": ["AVAILABLE: JUL 1944", "PATROLS: 3 MONTHS", "HULLS: I-56, I-58"]
    },
    "Type_C_Class": {
        "title": "TYPE  C  CLASS  (I-16)",
        "subtitle": "HEAVY ATTACK SUBMARINE  |  HEI-GATA TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: 3 MONTHS", "HULLS: I-16, 18, 20, 22, 24"]
    },
    "Type_A_Modified": {
        "title": "TYPE  A  MODIFIED  (I-12)",
        "subtitle": "LATE COMMAND SUBMARINE  |  KO-GATA MOD TYPE",
        "badges": ["AVAILABLE: MAY 1945", "PATROLS: 3 MONTHS", "HULLS: I-12, I-13, I-14"]
    },
    "Sen_Toku_Class": {
        "title": "SEN-TOKU  CLASS  (I-400)",
        "subtitle": "SUBMARINE AIRCRAFT CARRIER  |  STO TYPE",
        "badges": ["AVAILABLE: DEC 1944", "PATROLS: 4 MONTHS", "HULLS: I-400, I-401, I-402"]
    },
    "Sen_Taka_Class": {
        "title": "SEN-TAKA  CLASS  (I-201)",
        "subtitle": "HIGH-SPEED SUBMARINE  |  STK TYPE",
        "badges": ["AVAILABLE: JUL 1945", "PATROLS: 1 MONTH", "HULLS: I-201, I-202, I-203"]
    },
    "Type_C3_Class": {
        "title": "TYPE  C.3  CLASS  (I-52)",
        "subtitle": "OCEAN CARGO ATTACK SUBMARINE  |  HEI-KAI TYPE",
        "badges": ["AVAILABLE: MAY 1944", "PATROLS: 4 MONTHS", "HULLS: I-52, I-53, I-55"]
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "title": "TYPE  A  MIDGET  (KO-HYOTEKI)",
        "subtitle": "SPECIAL ATTACK SUBMERSIBLE  |  TARGET A TYPE",
        "badges": ["AVAILABLE: DEC 1941", "PATROLS: SPECIAL OPS", "HULLS: HA-19 ETC. (100+ BUILT)"]
    }
}

SUBMARINE_ARMAMENT_MAP = {
    "Kaidai_KD3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("Aft\nReload", "", "rld"), ("Aft\nReload", "", "rld"), None, None],
        "r4": [("120mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD4_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\nReload", "", "rld"), ("Aft\nReload", "", "rld")],
        "r3": [("120mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD5_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\nReload", "", "rld"), ("Aft\nReload", "", "rld")],
        "r3": [("100mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD6_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\nReload", "", "rld"), ("Aft\nReload", "", "rld")],
        "r3": [("100mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("Daihatsu", "Landing", "cargo"), ("13.1mm\nStatus", "", "aa"), None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Aft Torp Doors", "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1",
                "Diesel Engine 2", "Fuel Tanks", "Hydrophones", "Batteries",
                "Periscope", None, None, None]
    },
    "Kaidai_KD7_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("25mm AA\nStatus #1", "", "aa"), ("25mm AA\nStatus #2", "", "aa")],
        "r3": [("120mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Kirai_Sen_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("Aft Mine\nDoors", "", "mine_door"), ("Mines\nx42", "", "mines"), None, None],
        "r3": [("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Mine Tunnels", "Mine Handling", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Junsen_J_IM_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\nStatus #2", "", "gun"), ("Ammo\nx5", "", "ammo")],
        "r3": [("140mm\nStatus #1", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Junsen_J2_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("Aft\nReload", "", "rld"), ("Aft\nReload", "", "rld")],
        "r3": [("127mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("13.1mm\nStatus", "", "aa"), None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Crane", "Hangar", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Aft Torp Doors", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Batteries", "Periscope", "Hydrophones", None]
    },
    "Junsen_J3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo")],
        "r3": [("13.1mm\nStatus #1", "", "aa"), ("13.1mm\nStatus #2", "", "aa"), None, None],
        "r4": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), None, None],
        "sys": ["Crane", "Hangar", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Aft Torp Doors", "Electric Motor 1",
                "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks",
                "Batteries", "Periscope", "Hydrophones", None]
    },
    "Type_A_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("25mm Twin\nStatus #1", "", "aa"), ("25mm Twin\nStatus #2", "", "aa")],
        "r3": [("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Type_B_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo")],
        "r3": [("25mm Twin\nStatus #1", "", "aa"), ("25mm Twin\nStatus #2", "", "aa"), None, None],
        "r4": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_B_3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo")],
        "r3": [("25mm Twin\nStatus #1", "", "aa"), ("25mm Twin\nStatus #2", "", "aa"), None, None],
        "r4": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), None, None],
        "r5": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai")],
        "sys": ["Radio", "Dive Planes", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Type_C_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("25mm Twin\nStatus #1", "", "aa"), ("25mm Twin\nStatus #2", "", "aa"), None, None],
        "r5": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai")],
        "sys": ["Type 22 Radar", "Hangar", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)",
                "Radio", "Dive Planes", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Hydrophones",
                "Batteries", "Periscope", None, None]
    },
    "Type_C3_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("140mm\nStatus #2", "", "gun"), ("Ammo\nx5", "", "ammo")],
        "r3": [("140mm\nStatus #1", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("25mm Twin\nStatus #1", "", "aa"), ("25mm Twin\nStatus #2", "", "aa"), None, None],
        "r5": [("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai"), ("Kaiten\nSuicide Torpedo", "", "kai")],
        "sys": ["F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Radio", "Dive Planes",
                "Electric Motor 1", "Electric Motor 2", "Diesel Engine 1", "Diesel Engine 2",
                "Fuel Tanks", "Hydrophones", "Batteries", "Periscope",
                None, None, None, None]
    },
    "Type_A_Modified": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("25mm Single\nStatus", "", "aa"), None],
        "r3": [("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("25mm Triple\nStatus #1", "", "aa"), ("25mm Triple\nStatus #2", "", "aa"), None, None],
        "r5": [None, None, None, None],
        "sys": ["Radio", "Dive Planes", "Hangar", "Crane",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Sen_Toku_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [("5", "", "tube"), ("6", "", "tube"), ("7", "", "tube"), ("8", "", "tube")],
        "r3": [("140mm\nStatus", "", "gun"), ("Ammo\nx5", "", "ammo"), None, None],
        "r4": [("25mm Triple\nStatus #1", "", "aa"), ("25mm Triple\nStatus #2", "", "aa"), None, None],
        "r5": [("25mm Triple\nStatus #3", "", "aa"), ("25mm Single\nStatus", "", "aa"), ("Mk 3 M1\nAir Srch Radar", "", "radar"), ("Mk 2 M2\nSea Srch Radar", "", "radar")],
        "sys": ["Crane", "Hangar", "Radio", "Periscope",
                "Hydrophones", "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Dive Planes",
                "Batteries", "Fuel Tanks", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Diesel Engine 3", "Diesel Engine 4"]
    },
    "Sen_Taka_Class": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), ("3", "", "tube"), ("4", "", "tube")],
        "r2": [None, None, None, None],
        "r3": [("25mm Single\nStatus", "", "aa"), None, None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Snorkel", "Radar", "Radio", "Dive Planes",
                "F. Torp. Doors (Odd)", "F. Torp. Doors (Even)", "Electric Motor 1", "Electric Motor 2",
                "Diesel Engine 1", "Diesel Engine 2", "Fuel Tanks", "Batteries",
                "Periscope", "Hydrophones", None, None]
    },
    "Type_A_Midget_Submarine___Ko_Hyoteki": {
        "r1": [("1", "", "tube"), ("2", "", "tube"), None, None],
        "r2": [None, None, None, None],
        "r3": [None, None, None, None],
        "r4": [None, None, None, None],
        "r5": [None, None, None, None],
        "sys": ["Periscope", "Rudder Control", "Batteries", "Electric Motor",
                "Gyro Compass", "Trim Tanks", "Air System", "Ballast",
                None, None, None, None,
                None, None, None, None]
    }
}

RELOAD_CAPACITIES = {
    'Kaidai_KD3_Class': 8,
    'Kaidai_KD4_Class': 6,
    'Kaidai_KD5_Class': 6,
    'Kaidai_KD6_Class': 6,
    'Kaidai_KD7_Class': 6,
    'Kirai_Sen_Class': 8,
    'Junsen_J_IM_Class': 12,
    'Junsen_J2_Class': 9,
    'Junsen_J3_Class': 15,
    'Type_A_Class': 12,
    'Type_B_Class': 11,
    'Type_B_3_Class': 13,
    'Type_C_Class': 12,
    'Type_C3_Class': 13,
    'Type_A_Modified': 12,
    'Sen_Toku_Class': 12,
    'Sen_Taka_Class': 6,
    'Type_A_Midget_Submarine___Ko_Hyoteki': 0
}

def draw_reload_supplies_bay(ax, cx, cy, capacity=8):
    w_bay = 31.5 * BROTHER_COMP
    h_bay = 31.8 * BROTHER_COMP
    x0 = cx - w_bay / 2.0
    y0 = cy - h_bay / 2.0

    # Outer container box (warm drafting parchment with brass/steel technical border)
    ax.add_patch(patches.Rectangle((x0, y0), w_bay, h_bay,
                                   linewidth=1.1 * BROTHER_COMP, edgecolor='#9E782F',
                                   facecolor='#FAF5EA', zorder=2.8))
    # Inner subtle technical border
    inner_gap = 0.5 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((x0 + inner_gap, y0 + inner_gap), w_bay - 2*inner_gap, h_bay - 2*inner_gap,
                                   linewidth=0.4 * BROTHER_COMP, edgecolor='#C5A059',
                                   facecolor='none', zorder=2.9))

    # 4 Quadrant Ghost Guides (dashed lines dividing into 4 individual 15x15 counter zones)
    mid_x = cx
    mid_y = cy
    ax.plot([mid_x, mid_x], [y0 + 1.0*BROTHER_COMP, y0 + h_bay - 1.0*BROTHER_COMP],
            color='#C5A059', lw=0.6*BROTHER_COMP, linestyle='--', zorder=3.1, alpha=0.7)
    ax.plot([x0 + 1.0*BROTHER_COMP, x0 + w_bay - 1.0*BROTHER_COMP], [mid_y, mid_y],
            color='#C5A059', lw=0.6*BROTHER_COMP, linestyle='--', zorder=3.1, alpha=0.7)

    # Realistic AI artwork in quadrants:
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
        draw_watermark(ax, cx + qw, cy - qh, "supply_crates", "#8C6D37", alpha=0.20, size=11.0*BROTHER_COMP)

    # Header technical plaque at the top:
    plaque_h = 4.6 * BROTHER_COMP
    plaque_y = y0 + h_bay - plaque_h - 0.4 * BROTHER_COMP
    ax.add_patch(patches.Rectangle((x0 + 0.6*BROTHER_COMP, plaque_y), w_bay - 1.2*BROTHER_COMP, plaque_h,
                                   facecolor='#0D1520', edgecolor='#C5A059', lw=0.75*BROTHER_COMP, alpha=0.95, zorder=4.5))
    # 4 micro gold rivets
    rivet_r = 0.18 * BROTHER_COMP
    for rx, ry in [(x0 + 1.3*BROTHER_COMP, plaque_y + 0.7*BROTHER_COMP),
                   (x0 + w_bay - 1.3*BROTHER_COMP, plaque_y + 0.7*BROTHER_COMP),
                   (x0 + 1.3*BROTHER_COMP, plaque_y + plaque_h - 0.7*BROTHER_COMP),
                   (x0 + w_bay - 1.3*BROTHER_COMP, plaque_y + plaque_h - 0.7*BROTHER_COMP)]:
        ax.add_patch(patches.Circle((rx, ry), rivet_r, facecolor='#E2B765', edgecolor='#45300E', lw=0.2*BROTHER_COMP, zorder=4.8))

    ax.text(cx, plaque_y + plaque_h/2.0, "FORWARD RELOADS & SUPPLIES",
            fontsize=4.4, weight='bold', color='#FAF6ED', ha='center', va='center', zorder=5)

    # Central Capacity Badge
    ax.text(cx, cy - 1.0 * BROTHER_COMP, f"CAPACITY: {capacity} COUNTERS",
            fontsize=5.0, weight='bold', color='#784B05', ha='center', va='center', zorder=3.8)
    ax.text(cx, cy - 5.0 * BROTHER_COMP, "(4 Quadrants • Stacks to Capacity)",
            fontsize=3.6, weight='bold', color='#64748B', ha='center', va='center', zorder=3.8)

def draw_armament_slot(ax, cx, cy, item, sub_key=None, sub_data=None):
    if item is None:
        draw_card_slot(ax, cx, cy, is_inactive=True)
        return
    lbl, sublbl, itype = item
    if itype == "tube":
        tube_lbl = f"Tube {lbl}" if lbl.isdigit() else lbl
        # Identify Bow / Forward (Proa) vs Stern / Aft (Popa)
        tube_sublbl = sublbl
        if not tube_sublbl and lbl.isdigit():
            tube_num = int(lbl)
            fwd_count = 6
            aft_count = 0
            if sub_data and "torpedo_tubes" in sub_data:
                tt = sub_data["torpedo_tubes"]
                fwd_count = tt.get("fwd", 6)
                aft_count = tt.get("aft", 0)
            elif sub_key:
                # Fallback database lookup
                db = get_counters_db() # or known table
                if sub_key in ["Kaidai_KD3_Class"]:
                    fwd_count, aft_count = 6, 2
                elif sub_key in ["Kaidai_KD4_Class", "Kaidai_KD5_Class", "Kaidai_KD6_Class", "Junsen_J2_Class", "Junsen_J3_Class"]:
                    fwd_count, aft_count = 4, 2
                elif sub_key in ["Kirai_Sen_Class", "Sen_Taka_Class"]:
                    fwd_count, aft_count = 4, 0
                elif sub_key in ["Type_C_Class", "Sen_Toku_Class"]:
                    fwd_count, aft_count = 8, 0
                elif sub_key in ["Type_A_Midget_Submarine___Ko_Hyoteki"]:
                    fwd_count, aft_count = 2, 0
                else:
                    fwd_count, aft_count = 6, 0
            
            if aft_count > 0 and tube_num > fwd_count:
                tube_sublbl = "Stern / Popa"
            else:
                tube_sublbl = "Bow / Proa"

        draw_card_slot(ax, cx, cy, label=tube_lbl, sublabel=tube_sublbl, bg='#F0F4F8', border='#1F3A60', text_color='#132644')
    elif itype == "rld":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F4F7FA', border='#3A5675', text_color='#1B3654')
    elif itype in ["sup", "cargo"]:
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F8F2E2', border='#9E7B34', text_color='#5E4413')
    elif itype in ["gun", "ammo", "aa"]:
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F9F8F5', border='#3E4C59', text_color='#1E252D')
    elif itype == "kai":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#FDF2F0', border='#881A1A', text_color='#6D1212')
    elif itype == "midget":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#EFF4F8', border='#2B5278', text_color='#163250')
    elif itype == "torp":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F0F4F8', border='#1F3A60', text_color='#132644')
    elif itype == "mine_door":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#FAF0EC', border='#943825', text_color='#662012')
    elif itype == "mines":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F0F4F8', border='#28486E', text_color='#132644')
    elif itype == "radar":
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F3F1F7', border='#5B4A78', text_color='#362452')
    else:
        draw_card_slot(ax, cx, cy, label=lbl, sublabel=sublbl, bg='#F4F5F7', border='#475569', text_color='#1E293B')

def generate_canonical_cards():
    db_path = 'data/submarines_database.json'
    with open(db_path, 'r', encoding='utf-8') as f:
        db = json.load(f)

    subs = db['submarines']
    print(f"Generating Canonical Cards with FULL CREW STATUS for {len(subs)} submarines...")

    pdf_out = 'pdf/sensuikan_canonical_player_cards_compact_18subs.pdf'
    try:
        test_f = open(pdf_out, 'ab')
        test_f.close()
    except Exception:
        pdf_out = 'pdf/sensuikan_canonical_player_cards_compact_18subs_new.pdf'
    os.makedirs('pdf', exist_ok=True)
    # Prepare High-Res Sensuikan Logo with Transparent Background (NO white sticker boundary!)
    logo_bgr = cv2.imread('images/sensuikan_logo_hires.png')
    logo_gray = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2GRAY)
    logo_rgba = cv2.cvtColor(logo_bgr, cv2.COLOR_BGR2RGBA)
    alpha = np.ones_like(logo_gray, dtype=np.uint8) * 255
    white_mask = logo_gray > 235
    alpha[white_mask] = np.clip((255 - logo_gray[white_mask]) * (255.0 / 20.0), 0, 255).astype(np.uint8)
    logo_rgba[:, :, 3] = alpha

    with PdfPages(pdf_out) as pdf:
        for sub_idx, (key, sub) in enumerate(subs.items()):
            fig, ax = plt.subplots(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
            ax.set_xlim(0, PAGE_W_MM)
            ax.set_ylim(0, PAGE_H_MM)
            ax.set_aspect('equal')
            ax.axis('off')
            fig.subplots_adjust(left=0, right=1, top=1, bottom=0)

            # Center on A4 sheet
            ox = (PAGE_W_MM - CARD_W_MM) / 2.0
            oy = (PAGE_H_MM - CARD_H_MM) / 2.0 + VERTICAL_OFFSET_MM

            # Background: Warm Historical Naval Ivory / Linen Canvas
            card_bg = patches.Rectangle((ox, oy), CARD_W_MM, CARD_H_MM, linewidth=0.5*BROTHER_COMP,
                                        edgecolor='#1E293B', facecolor='#F7F5EE', zorder=1)
            ax.add_patch(card_bg)

            # Textured Historical Naval Technical Drafting Paper / Parchment Background
            bg_img_path = 'images/mats/real_antique_parchment_bg.png'
            if os.path.exists(bg_img_path):
                parchment_bgr = cv2.imread(bg_img_path)
                if parchment_bgr is not None:
                    parchment_rgb = cv2.cvtColor(parchment_bgr, cv2.COLOR_BGR2RGB)
                    ax.imshow(parchment_rgb, extent=(ox, ox + CARD_W_MM, oy, oy + CARD_H_MM), zorder=1.1, aspect='auto')

            # Nautical Chart Graduated Ruler Border!
            draw_nautical_chart_border(ax, ox, oy, CARD_W_MM, CARD_H_MM)
            draw_print_calibration_and_crop_marks(ax, ox, oy, CARD_W_MM, CARD_H_MM)

            def to_y(y_top_mm):
                return oy + CARD_H_MM - (y_top_mm * BROTHER_COMP)

            def to_x(x_mm):
                return ox + (x_mm * BROTHER_COMP)

            # --- 1. SHIPYARD TITLE & EMBLEM ("Anatomy of the Ship" Technical Title Block) ---
            # Spans from X in [2.5, 163.5] (161.0 mm) and Y in [2.5, 18.5] (16.0 mm)
            tb_x0 = to_x(2.5)
            tb_y0 = to_y(18.5)
            tb_w = 161.0 * BROTHER_COMP
            tb_h = 16.0 * BROTHER_COMP

            # Outer & Inner Technical Frames for Cartela
            ax.add_patch(patches.Rectangle((tb_x0, tb_y0), tb_w, tb_h, linewidth=0.8*BROTHER_COMP,
                                           edgecolor='#1E293B', facecolor='#FAF8F3', zorder=2))
            tb_d = 0.5 * BROTHER_COMP
            ax.add_patch(patches.Rectangle((tb_x0 + tb_d, tb_y0 + tb_d), tb_w - 2*tb_d, tb_h - 2*tb_d,
                                           linewidth=0.3*BROTHER_COMP, edgecolor='#475569', facecolor='none', zorder=2.1))

            # Technical Double Vertical Divider separating Sensuikan Logo from Class Name (at X = 46.5 mm)
            div_x1 = to_x(46.2)
            div_x2 = to_x(46.8)
            ax.plot([div_x1, div_x1], [tb_y0 + tb_d, tb_y0 + tb_h - tb_d], color='#475569', lw=0.3*BROTHER_COMP, zorder=2.2)
            ax.plot([div_x2, div_x2], [tb_y0 + tb_d, tb_y0 + tb_h - tb_d], color='#475569', lw=0.3*BROTHER_COMP, zorder=2.2)

            # Left Compartment: Undistorted Sensuikan Logo Banner (Wide 3.44:1 natural aspect ratio!)
            # Inside X in [2.5, 46.0] (43.5 mm width), Y in [2.5, 18.5] (16.0 mm height)
            logo_w_box = 40.0
            logo_h_box = logo_w_box / 3.437 # 11.64 mm
            lx0 = to_x(2.5 + (43.7 - logo_w_box) / 2.0)
            ly_center = 10.5
            ly0 = to_y(ly_center + logo_h_box / 2.0)
            ly1 = to_y(ly_center - logo_h_box / 2.0)
            ax.imshow(logo_rgba, extent=(lx0, lx0 + logo_w_box * BROTHER_COMP, ly0, ly1), zorder=2.3)

            # Middle Compartment: Submarine Class Identity (X in [48.5, 110.0])
            meta = sub.get("shipyard_metadata") or SHIPYARD_METADATA.get(key, {
                "title": sub['class_name'].upper(),
                "subtitle": f"{sub['full_title'].upper()}  |  IJN SUBMARINE",
                "badges": [f"AVAILABLE: {sub['available_date'].replace('Available ', '').upper()}",
                           f"PATROLS: {sub['patrol_length'].upper()}",
                           f"HULLS: {sub['stats'].get('produced', 'N/A')} BUILT"]
            })

            text_x = to_x(49.0)
            # Row 1: Title in Large Majestic Serif Uppercase (10.0 pt)
            ax.text(text_x, to_y(6.8), meta['title'], fontsize=10.0, weight='bold', family='serif', color='#0F172A', zorder=3)

            # Row 2: Subtitle in Naval Sepia/Slate (4.8 pt)
            ax.text(text_x, to_y(10.8), meta['subtitle'], fontsize=4.8, weight='bold', color='#5A4D41', zorder=3)

            # Row 3: Tactical Badges (Capsules) - Scaled to never collide with Specifications Plaque!
            curr_bx = text_x
            badge_y = to_y(16.5)
            badge_h = 3.3 * BROTHER_COMP
            op_badges = meta['badges'][:2] # Available & Patrols
            for badge_txt in op_badges:
                badge_w = (len(badge_txt) * 0.85 + 4.0) * BROTHER_COMP
                b_rect = patches.Rectangle((curr_bx, badge_y), badge_w, badge_h, linewidth=0.4*BROTHER_COMP,
                                           edgecolor='#B8AEA5', facecolor='#EDE8E1', zorder=2.5)
                ax.add_patch(b_rect)
                ax.text(curr_bx + badge_w / 2.0, badge_y + badge_h / 2.0, badge_txt,
                        fontsize=3.2, weight='bold', color='#1E293B', ha='center', va='center', zorder=3)
                curr_bx += badge_w + 2.5 * BROTHER_COMP

            # Right Compartment: Astillero Specifications Plaque (X in [113.5, 162.5], width 49.0 mm, height 14.0 mm)
            px0 = to_x(113.5)
            py0 = to_y(17.5)
            pw = 49.0 * BROTHER_COMP
            ph = 14.0 * BROTHER_COMP

            # Plate box background and border
            ax.add_patch(patches.Rectangle((px0, py0), pw, ph, linewidth=0.5*BROTHER_COMP,
                                           edgecolor='#A8A29E', facecolor='#F4F1EA', zorder=2.3))
            # Header strip
            p_strip_h = 3.2 * BROTHER_COMP
            ax.add_patch(patches.Rectangle((px0, py0 + ph - p_strip_h), pw, p_strip_h, linewidth=0.4*BROTHER_COMP,
                                           edgecolor='#A8A29E', facecolor='#E7E2D8', zorder=2.4))
            ax.text(px0 + pw / 2.0, py0 + ph - p_strip_h / 2.0, 'VESSEL PARTICULARS & SPECIFICATIONS',
                    fontsize=3.2, weight='bold', color='#292524', ha='center', va='center', zorder=2.6)

            # Vessel Specs Grid (2 columns x 3 rows)
            stats = sub['stats']
            hulls_str = meta['badges'][2].replace('HULLS: ', '') if len(meta['badges']) > 2 else f"{stats.get('produced', 'N/A')} built"

            col1_lbl_x = px0 + 1.8 * BROTHER_COMP
            col1_val_x = px0 + 9.5 * BROTHER_COMP
            col2_lbl_x = px0 + 25.0 * BROTHER_COMP
            col2_val_x = px0 + 32.8 * BROTHER_COMP

            y_r1 = to_y(9.1)
            y_r2 = to_y(12.2)
            y_r3 = to_y(15.3)

            # Row 1: Length & Speed
            ax.text(col1_lbl_x, y_r1, 'LEN:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col1_val_x, y_r1, stats['length'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)
            ax.text(col2_lbl_x, y_r1, 'SPD:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col2_val_x, y_r1, stats['speed'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)

            # Row 2: Displacement & Range
            ax.text(col1_lbl_x, y_r2, 'DISP:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col1_val_x, y_r2, stats['displacement'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)
            ax.text(col2_lbl_x, y_r2, 'RNG:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col2_val_x, y_r2, stats['range'], fontsize=3.3, weight='bold', color='#0F172A', zorder=3)

            # Row 3: Complement (Crew) & Hulls / Production
            crew_val = f"{stats['crew']} men"
            ax.text(col1_lbl_x, y_r3, 'CREW:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            ax.text(col1_val_x, y_r3, crew_val, fontsize=3.3, weight='bold', color='#0F172A', zorder=3)
            ax.text(col2_lbl_x, y_r3, 'HULLS:', fontsize=3.2, weight='bold', color='#78716C', zorder=3)
            hulls_font_size = 3.0 if len(hulls_str) > 20 else 3.2
            ax.text(col2_val_x, y_r3, hulls_str, fontsize=hulls_font_size, weight='bold', color='#0F172A', zorder=3)

            # Top Slots coordinates: 4 standard columns at [178.5, 195.0, 211.5, 228.0]
            top_y = to_y(14.0)
            # Section Header: Aircraft & Events (Spacious breathing room under border!)
            draw_section_header_plaque(ax, to_x(171.0), to_y(4.5), "AIRCRAFT & TACTICAL EVENT RECORD", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)
            # Photorealistic Red Sealing Wax Stamp in Submarine Dossier Window (Authentic classified wax seal!)
            draw_confidential_stamp(ax, to_x(153.0), to_y(30.5), size_mm=17.0*BROTHER_COMP)
            is_sentoku = ("Sen-Toku" in sub['class_name'])
            if is_sentoku:
                draw_card_slot(ax, to_x(178.5), top_y, label="Aichi M6A1\nStatus", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(195.0), top_y, label="Aichi M6A1\nStatus", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(211.5), top_y, label="Aichi M6A1\nStatus", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(228.0), top_y, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                if sub['has_aircraft']:
                    air_name = "Yokosuka\nE14Y1 Status" if ("Glen" in str(sub.get('aircraft_type', '')) or "E14Y1" in str(sub.get('aircraft_type', ''))) else "Aircraft\nStatus"
                    draw_card_slot(ax, to_x(178.5), top_y, label=air_name, bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(178.5), top_y, is_inactive=True)
                draw_card_slot(ax, to_x(195.0), top_y, is_inactive=True)
                draw_card_slot(ax, to_x(211.5), top_y, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')
                draw_card_slot(ax, to_x(228.0), top_y, label="Random\nEvent", bg='#FAF2E1', border='#C08420', text_color='#784B05')

            # --- 2. LEFT COLUMN: BASE SLOTS ---
            base_xs = to_x(10.0)
            draw_card_slot(ax, base_xs, to_y(28.5), label="Current\nBase", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(46.5), label="Mission", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')
            draw_card_slot(ax, base_xs, to_y(64.5), label="At\nPort", bg='#EBF1F5', border='#3B5670', text_color='#1C344A')

            # --- 3. SUBMARINE PANORAMIC ILLUSTRATION WINDOW ---
            # Spans X in [20.5, 163.5] (width 143.0 mm) and Y in [21.0, 52.0] (height 31.0 mm)
            win_x0 = to_x(20.5)
            win_w = 143.0 * BROTHER_COMP
            win_h = 31.0 * BROTHER_COMP
            win_y0 = to_y(52.0)

            prof_path = sub.get('profile_image_path', '')
            prof_img = None
            bg_color_hex = '#FAF8F3'

            if os.path.exists(prof_path):
                raw_img = cv2.imread(prof_path)
                if raw_img is not None:
                    gray = cv2.cvtColor(raw_img, cv2.COLOR_BGR2GRAY)
                    dark_rows = np.where((gray < 185).any(axis=1))[0]
                    dark_cols = np.where((gray < 185).any(axis=0))[0]
                    if len(dark_rows) > 0 and len(dark_cols) > 0:
                        y_min, y_max = dark_rows.min(), dark_rows.max()
                        pad_y = 16
                        y0 = max(0, y_min - pad_y)
                        y1 = min(raw_img.shape[0], y_max + pad_y)
                        h = y1 - y0
                        target_ratio = 143.0 / 31.0  # 4.6129
                        w_target = int(h * target_ratio)
                        sub_crop = raw_img[y0:y1, :]
                        if w_target > sub_crop.shape[1]:
                            diff = w_target - sub_crop.shape[1]
                            left_pad = diff // 2
                            right_pad = diff - left_pad
                            # Replicate exact border background to eliminate 100% of color mismatch/leftover seams!
                            prof_img = cv2.copyMakeBorder(sub_crop, 0, 0, left_pad, right_pad, cv2.BORDER_REPLICATE)
                        else:
                            start_x = (sub_crop.shape[1] - w_target) // 2
                            prof_img = sub_crop[:, start_x:start_x + w_target]
                    else:
                        prof_img = raw_img

                    # Sample corner background color so outer window rectangle matches 100%
                    bg_bgr = prof_img[0, 0]
                    bg_color_hex = '#{:02x}{:02x}{:02x}'.format(bg_bgr[2], bg_bgr[1], bg_bgr[0])

            # Museum Parchment Background & Double Technical Border (0% color mismatch seams!)
            outer_win = patches.Rectangle((win_x0, win_y0), win_w, win_h, linewidth=0.8*BROTHER_COMP,
                                          edgecolor='#1E293B', facecolor=bg_color_hex, zorder=2)
            ax.add_patch(outer_win)

            win_d = 0.5 * BROTHER_COMP
            inner_win = patches.Rectangle((win_x0 + win_d, win_y0 + win_d), win_w - 2*win_d, win_h - 2*win_d,
                                          linewidth=0.3*BROTHER_COMP, edgecolor='#64748B', facecolor='none', zorder=2.4)
            ax.add_patch(inner_win)

            if prof_img is not None:
                prof_rgb = cv2.cvtColor(prof_img, cv2.COLOR_BGR2RGB)
                ax.imshow(prof_rgb, extent=(win_x0 + win_d, win_x0 + win_w - win_d, win_y0 + win_d, win_y0 + win_h - win_d), zorder=2.3)

            # Subtle technical blueprint grid (lines every 10 mm and 5 mm)
            for gx in np.arange(25.0, 163.0, 10.0):
                ax.plot([to_x(gx), to_x(gx)], [win_y0 + win_d, win_y0 + win_h - win_d],
                        color='#0F172A', lw=0.25*BROTHER_COMP, alpha=0.035, zorder=2.35)
            for gy in np.arange(25.0, 52.0, 5.0):
                ax.plot([win_x0 + win_d, win_x0 + win_w - win_d], [to_y(gy), to_y(gy)],
                        color='#0F172A', lw=0.25*BROTHER_COMP, alpha=0.035, zorder=2.35)

            # --- 4. PATROL TRACK (9 UNIVERSAL SLOTS AT X in [20.5, 163.5], FIT TO GENERIC 3D BOARD!) ---
            draw_section_header_plaque(ax, to_x(20.5), to_y(54.5), "PATROL TRACK (TRANSIT & ON-STATION PHASES)", width=143.0*BROTHER_COMP, h=3.0*BROTHER_COMP)
            patrol_centers = np.linspace(28.0, 156.0, 9)
            phases = sub.get("patrol_phases", ["Transit", "Stat 1", "Stat 2", "Stat 3", "Stat 4", "Transit", "N/A", "N/A", "N/A"])
            pat_y = to_y(64.5)
            for i, p_center in enumerate(patrol_centers):
                p_name = phases[i] if i < len(phases) else "N/A"
                if p_name == "Transit":
                    draw_card_slot(ax, to_x(p_center), pat_y, label="Transit",
                                   bg='#E2EAF0', border='#3B5B75', text_color='#1E3547')
                elif p_name.startswith("Stat"):
                    draw_card_slot(ax, to_x(p_center), pat_y, label="On\nStation",
                                   bg='#F4F2EB', border='#64748B', text_color='#2A3A4A')
                elif p_name in ["Penetrate", "Attack", "Egress", "Recover"]:
                    draw_card_slot(ax, to_x(p_center), pat_y, label=p_name,
                                   bg='#FBF3DC', border='#B08224', text_color='#6E4D0C')
                else: # Inactive slot
                    draw_card_slot(ax, to_x(p_center), pat_y, is_inactive=True)

            # --- 5. DAMAGE TRACKS (10 SLOTS DYNAMICALLY CONFIGURED BY CLASS DAMAGE CAPACITY) ---
            draw_section_header_plaque(ax, to_x(20.5), to_y(73.5), "DAMAGE TRACKS (FLOODING & HULL DAMAGE)", width=143.0*BROTHER_COMP, h=2.5*BROTHER_COMP)

            dmg_y_flood = to_y(82.5)
            dmg_y_hull = to_y(99.5)

            # Markers (Col 0 at X = 10.0 mm, vertically aligned with Base/Mission/Port)
            draw_card_slot(ax, base_xs, dmg_y_flood, label="Flooding\nMarker", bg='#EBF1F5', border='#385C7E', text_color='#1B3654')
            draw_card_slot(ax, base_xs, dmg_y_hull, label="Hull Damage\nMarker", bg='#F5EDE7', border='#8C4332', text_color='#5C1E12')

            # 9 Slots from X = 20.5 to X = 163.5 (Centers: 28.0 to 156.0)
            dmg_centers = np.linspace(28.0, 156.0, 9)
            dmg_cap = sub.get("damage_capacity", {"flooding": 8, "hull": 8})
            max_fld = dmg_cap.get("flooding", 8)
            max_hull = dmg_cap.get("hull", 8)

            # Flooding Track: Progressive AI Flooding Artworks (1..8) + Emergency Surface (9), then clean inactive
            for i in range(9):
                if i < max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label=f"Flood {i+1}", sublabel="",
                                   bg='#0D1520', border='#385C7E', text_color='#68B2DF')
                elif i == max_fld:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood,
                                   label="Surface", sublabel="",
                                   bg='#0D1520', border='#C5A059', text_color='#FFE082')
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_flood, is_inactive=True)

            # Hull Damage Track: Hull Damage on every slot, then SUNK, then clean inactive
            if max_hull == 8:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#CA866D', '#B9634E', '#A53E30', '#881A1A']
            elif max_hull == 7:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#CA866D', '#B9634E', '#881A1A']
            elif max_hull == 6:
                hull_palette = ['#F5EFE6', '#EEDCC8', '#E3C4AA', '#D7A78C', '#B9634E', '#881A1A']
            elif max_hull == 2:
                hull_palette = ['#EEDCC8', '#A53E30']
            else:
                hull_palette = ['#EEDCC8'] * max_hull

            for i in range(9):
                if i < max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull,
                                   label=f"Hull {i+1}", sublabel="", bg='#0D1520', border='#8C3524', text_color='#FCA5A5')
                elif i == max_hull:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull,
                                   label="SUNK", bg='#0D1520', border='#8C2E24', text_color='#FCA5A5', is_sunk=True)
                else:
                    draw_card_slot(ax, to_x(dmg_centers[i]), dmg_y_hull, is_inactive=True)

            # --- 6. CREW STATUS SECTION (2 ROWS OF 7 SLOTS AT X in [20.5, 163.5]) ---
            draw_section_header_plaque(ax, to_x(20.5), to_y(109.5), "CREW STATUS & CREW QUALITY", width=143.0*BROTHER_COMP, h=3.0*BROTHER_COMP)

            crew_centers = np.linspace(28.0, 156.0, 7)
            crew_y1 = to_y(119.5)
            crew_y2 = to_y(136.5)

            is_midget = ("Ko-Hyoteki" in sub['full_title'] or "Midget" in sub['class_name'])

            if is_midget:
                # Ko-Hyoteki 2-man midget crew layout
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Officer", sublabel="", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Petty Officer", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="Midget\nGunnery", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Superior\nComms", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Boat\nHandling", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)

                # Row 2
                for ci in range(6):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            elif is_sentoku:
                # Sen-Toku Carrier Crew layout (3 Pilots!)
                # Row 1: Captain, Engineer, XO, Nav., Medic, Pilot, Pilot
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", sublabel="", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')

                # Row 2: Crew, Crew, Crew, Crew, Crew, Pilot, Crew Quality
                for ci in range(5):
                    draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, label="Crew", sublabel="", bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')
            else:
                # Standard Fleet Submarines
                has_air = sub['has_aircraft']
                # Row 1: Captain, Engineer, XO, Nav., Medic, Pilot (if plane), Inactive
                draw_card_slot(ax, to_x(crew_centers[0]), crew_y1, label="Captain", sublabel="", bg='#FBF7E9', border='#9E782F', text_color='#543D10')
                draw_card_slot(ax, to_x(crew_centers[1]), crew_y1, label="Engineer", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[2]), crew_y1, label="XO", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[3]), crew_y1, label="Nav.", sublabel="", bg='#F5F6F8', border='#4B5D70', text_color='#1E2D3D')
                draw_card_slot(ax, to_x(crew_centers[4]), crew_y1, label="Medic", sublabel="", bg='#F0F4F8', border='#3B6B94', text_color='#163B60')
                if has_air:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Pilot", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                elif key == "Type_C_Class":
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, label="Midget\nSub Crew", sublabel="", bg='#EEF4FA', border='#2A5682', text_color='#183758')
                else:
                    draw_card_slot(ax, to_x(crew_centers[5]), crew_y1, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y1, is_inactive=True)

                # Row 2: Enlisted Crew count (No #1..#5, exactly matching original game cards)
                if "crew_counters" in sub:
                    num_crew = sub["crew_counters"]
                else:
                    num_crew = 5
                    if key in ["Kaidai_KD3_Class", "Kaidai_KD4_Class", "Kaidai_KD5_Class", "Kaidai_KD6_Class", "Kaidai_KD7_Class", "Kirai_Sen_Class", "Sen_Taka_Class"]:
                        num_crew = 4

                for ci in range(5):
                    is_active_crew = (ci < num_crew)
                    if is_active_crew:
                        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2,
                                       label="Crew", sublabel="",
                                       bg='#F9FAFB', border='#5A6B7C', text_color='#1E293B')
                    else:
                        draw_card_slot(ax, to_x(crew_centers[ci]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[5]), crew_y2, is_inactive=True)
                draw_card_slot(ax, to_x(crew_centers[6]), crew_y2, label="Crew\nQuality", sublabel="", bg='#FAF2E1', border='#C08420', text_color='#784B05')

            # --- 7. SPECIAL RULES & HISTORICAL NOTES BOX (Clean, 0% Errata Clutter) ---
            # Perfectly aligned with Systems Status on the right (Y in [147.5, 179.0])
            box_x0 = to_x(8.0)
            box_w = 155.5 * BROTHER_COMP
            box_h = 31.5 * BROTHER_COMP
            box_y0 = to_y(179.0)

            # Outer & Inner Frames for Rules Box
            panel_bg = patches.Rectangle((box_x0, box_y0), box_w, box_h, linewidth=0.9*BROTHER_COMP,
                                         edgecolor='#5A6B7C', facecolor='#FAF8F2', zorder=2)
            ax.add_patch(panel_bg)
            ax.add_patch(patches.Rectangle((box_x0 + 0.5*BROTHER_COMP, box_y0 + 0.5*BROTHER_COMP),
                                           box_w - 1.0*BROTHER_COMP, box_h - 1.0*BROTHER_COMP,
                                           linewidth=0.3*BROTHER_COMP, edgecolor='#94A3B8', facecolor='none', zorder=2.1))

            # Header Bar
            header_txt = "SPECIAL RULES & HISTORICAL NOTES:"
            ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(152.0), header_txt, fontsize=6.0, weight='bold', color='#1E293B', zorder=3)

            # Subtle warm brass divider rule under header
            ax.plot([box_x0 + 3.0*BROTHER_COMP, box_x0 + box_w - 3.0*BROTHER_COMP], [to_y(153.8), to_y(153.8)],
                    color='#C08420', lw=0.6*BROTHER_COMP, zorder=2.5)

                        # Authentic Imperial Japanese Naval Hanko Seal in Special Rules Box
            draw_imperial_hanko(ax, box_x0 + box_w - 9.5*BROTHER_COMP, to_y(169.5), r_mm=6.2*BROTHER_COMP, angle=3.5)

            # Rules Text Rendering (Adaptive sizing and line spacing)
            rules_raw = sub.get('special_rules', '').replace('\x95', '•').replace('[ERRATA] ', '').replace('[ERRATA]', '').strip()
            kaiten_raw = sub.get('kaiten_note', '').replace('[ERRATA] ', '').replace('[ERRATA]', '').strip() if sub.get('kaiten_note') else None

            total_chars = len(rules_raw) + (len(kaiten_raw) if kaiten_raw else 0)
            if total_chars > 280:
                font_s = 4.4
                line_h_mm = 2.00
                wrap_w = 112
            elif total_chars > 160:
                font_s = 4.7
                line_h_mm = 2.15
                wrap_w = 104
            else:
                font_s = 5.1
                line_h_mm = 2.40
                wrap_w = 95

            curr_y_mm = 156.0
            for para in rules_raw.split('\n'):
                para = para.strip()
                if not para:
                    continue
                wrapped = textwrap.fill(para, width=wrap_w)
                for line in wrapped.split('\n'):
                    is_bold_lead = (line.startswith('•') or line.startswith('Cargo Conversion:') or 
                                    line.startswith('Radar:') or line.startswith('Armament:') or 
                                    line.startswith('Special Damage Routing:') or line.startswith('Special Rules:'))
                    ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(curr_y_mm), line,
                            fontsize=font_s, weight='bold' if is_bold_lead else 'normal',
                            color='#1E293B', va='top', zorder=3)
                    curr_y_mm += line_h_mm
                curr_y_mm += 0.35

            if kaiten_raw:
                curr_y_mm += 0.35
                wrapped_k = textwrap.fill(f"Kaiten Conversion: {kaiten_raw}", width=wrap_w)
                for line in wrapped_k.split('\n'):
                    ax.text(box_x0 + 3.0*BROTHER_COMP, to_y(curr_y_mm), line,
                            fontsize=font_s, weight='bold', color='#881A1A', va='top', zorder=3)
                    curr_y_mm += line_h_mm

            # --- 8. RIGHT BLOCK: CLASS-SPECIFIC ARMAMENT & SYSTEMS (4 COLUMNS AT X in [178.5, 195.0, 211.5, 228.0]) ---
            col_x = [to_x(x) for x in [178.5, 195.0, 211.5, 228.0]]
            arm_cfg = sub.get("armament_layout") or SUBMARINE_ARMAMENT_MAP.get(key, {})

            # Section Header: Torpedo Armament & Reloads
            draw_section_header_plaque(ax, to_x(171.0), to_y(23.5), "TORPEDO ARMAMENT & RELOADS", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)

            # Row 1: (Y = 33.0 mm)
            y_r1 = to_y(33.0)
            for i, item in enumerate(arm_cfg.get('r1', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r1, item, sub_key=key, sub_data=sub)

            # Row 2: (Y = 49.8 mm)
            y_r2 = to_y(49.8)
            for i, item in enumerate(arm_cfg.get('r2', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r2, item, sub_key=key, sub_data=sub)

            # Section Header: Artillery & Special Weapons
            draw_section_header_plaque(ax, to_x(171.0), to_y(59.4), "ARTILLERY & SPECIAL WEAPONS", width=64.5*BROTHER_COMP, h=3.0*BROTHER_COMP)

            # Rows 3, 4, 5 of Artillery & Special Weapons
            y_r3 = to_y(69.0)
            y_r4 = to_y(85.8)
            y_r5 = to_y(102.6)

            capacity = sub.get("reload_capacity", RELOAD_CAPACITIES.get(key, 0))
            if capacity > 0:
                # 2x2 Square Bay for Forward Reloads & Supplies placed BOTTOM RIGHT (Rows 4 & 5, Columns 2 & 3)
                area_cx = (col_x[2] + col_x[3]) / 2.0
                area_cy = (y_r4 + y_r5) / 2.0
                draw_reload_supplies_bay(ax, area_cx, area_cy, capacity=capacity)

            # Draw Row 3 items across all 4 columns (above the 2x2 bay)
            for i, item in enumerate(arm_cfg.get('r3', [None]*4)):
                draw_armament_slot(ax, col_x[i], y_r3, item, sub_key=key, sub_data=sub)

            # Draw Row 4 items (only columns 0 and 1; columns 2 & 3 occupied by top of 2x2 bay)
            for i, item in enumerate(arm_cfg.get('r4', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r4, item, sub_key=key, sub_data=sub)

            # Draw Row 5 items (only columns 0 and 1; columns 2 & 3 occupied by bottom of 2x2 bay)
            for i, item in enumerate(arm_cfg.get('r5', [None]*4)):
                if capacity > 0 and i >= 2:
                    continue
                draw_armament_slot(ax, col_x[i], y_r5, item, sub_key=key, sub_data=sub)

            # Section Header: Systems Status
            draw_section_header_plaque(ax, to_x(171.0), to_y(112.3), "SYSTEMS STATUS", width=64.5*BROTHER_COMP, h=3.2*BROTHER_COMP)

            # Rows 6..9: Systems Status (16 slots: 4 cols x 4 rows, Y in [122.0, 138.5, 155.0, 171.5])
            sys_list = arm_cfg.get('sys', [None]*16)
            for idx in range(16):
                r_idx = idx // 4
                c_idx = idx % 4
                y_val = [122.0, 138.5, 155.0, 171.5][r_idx]
                cx = col_x[c_idx]
                item = sys_list[idx] if idx < len(sys_list) else None
                is_errata_box = (key == "Junsen_J3_Class" and item in ["Aft Torp Doors", "Aft.Doors"])
                if item == "N/A" or item is None:
                    draw_card_slot(ax, cx, to_y(y_val), is_inactive=True)
                else:
                    draw_card_slot(ax, cx, to_y(y_val), label=item, sublabel="",
                                   bg='#FBF7E9' if is_errata_box else '#F4F5F7',
                                   border='#9E782F' if is_errata_box else '#475569',
                                   text_color='#543D10' if is_errata_box else '#1E293B')

            # --- 9. DUPLEX FOOTER & REGISTRATION MARKS ---
            dp = sub.get('duplex_print')
            if dp:
                ax.text(to_x(235.0), to_y(-1.5), f"Sheet {dp['sheet_number']}/9 • {dp['side']}",
                        fontsize=3.2, ha='right', va='bottom', color='#64748B', zorder=4)
                ax.text(PAGE_W_MM / 2.0, oy - 4.5,
                        f"Sensuikan Canonical Board • Sheet {dp['sheet_number']}/9 • {dp['side']} (Page {dp['page_number']:02d}/18) • {dp['family']} • Reverse: {dp['paired_with']} • Double-Sided Print (Flip on Long Edge) • 100% Scale",
                        fontsize=3.5, ha='center', va='center', color='#64748B')

            pdf.savefig(fig, dpi=150)

            # Save previews
            if key in ["Kaidai_KD3_Class", "Kaidai_KD4_Class", "Kaidai_KD7_Class", "Junsen_J2_Class", "Junsen_J3_Class", "Type_B_Class", "Sen_Toku_Class", "Kirai_Sen_Class", "Type_A_Midget_Submarine___Ko_Hyoteki"]:
                preview_png = f'images/subs/preview_canonical_{key}.png'
                fig.savefig(preview_png, dpi=150)
                for art_brain in ['C:/Users/Richard/.gemini/antigravity/brain/6141b515-295a-4787-8231-4ba78bfcbeea', 'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673', 'C:/Users/Richard/.gemini/antigravity/brain/0975d495-1000-4c1e-ba39-9c738d974976']:
                    try:
                        if os.path.exists(art_brain):
                            fig.savefig(os.path.join(art_brain, f'preview_canonical_{key}.png'), dpi=150)
                    except Exception:
                        pass
                print(f"  Saved preview: {preview_png}")
            plt.close(fig)

    print(f"Successfully generated all {len(subs)} Canonical sheets with Watermarks & Micro-Halo in: {pdf_out}")
    # Copy only to brain artifact directory for user access
    import shutil
    for brain_dest in [
        'C:/Users/Richard/.gemini/antigravity/brain/6141b515-295a-4787-8231-4ba78bfcbeea/sensuikan_canonical_player_cards_compact_18subs.pdf',
        'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/sensuikan_canonical_player_cards_compact_18subs.pdf',
        'C:/Users/Richard/.gemini/antigravity/brain/0975d495-1000-4c1e-ba39-9c738d974976/sensuikan_canonical_player_cards_compact_18subs.pdf'
    ]:
        try:
            shutil.copy(pdf_out, brain_dest)
        except Exception:
            pass

if __name__ == '__main__':
    generate_canonical_cards()
