import os
import sys
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
from PIL import Image

print("=========================================================================")
print("GENERATING 100% HOMOGENEOUS PRINTABLE PDFs FOR ALL SUBMARINES (1:1 SCALE)")
print("=========================================================================")

PAGE_W_MM = 297.0
PAGE_H_MM = 210.0
CARD_W_MM = 238.0
CARD_H_MM = 180.4

# Margins
OX = (PAGE_W_MM - CARD_W_MM) / 2.0  # 29.5 mm
OY = (PAGE_H_MM - CARD_H_MM) / 2.0  # 14.8 mm

with open('scripts/subs_catalog.json', 'r', encoding='utf-8') as f:
    SUBS_CATALOG = json.load(f)

print(f"Loaded {len(SUBS_CATALOG)} submarines from catalog.")

def draw_crop_and_calibration_marks(ax, ox, oy, w, h, lang='es'):
    mark_len = 6.0
    gap = 2.0
    lw = 0.5
    col = '#0f172a'

    # Corner ticks
    corners = [(ox, oy), (ox + w, oy), (ox, oy + h), (ox + w, oy + h)]
    for (cx, cy) in corners:
        sx = -1 if cx == ox else 1
        sy = -1 if cy == oy else 1
        # Horizontal mark
        ax.plot([cx + sx * gap, cx + sx * (gap + mark_len)], [cy, cy], color=col, lw=lw)
        # Vertical mark
        ax.plot([cx, cx], [cy + sy * gap, cy + sy * (gap + mark_len)], color=col, lw=lw)

    # Scale calibration label
    legend_text = (
        f"Sensuikan • Armada Imperial Japonesa 1941–45 • Escala 100% (1:1) • Tamaño Tablero: {w} × {h} mm • Ajustar a escala 'Ninguna / 100%' al imprimir"
        if lang == 'es' else
        f"Sensuikan • Imperial Japanese Navy Submarines 1941–45 • 100% Scale (1:1) • Board Size: {w} × {h} mm • Set print scale to 'None / 100%'"
    )
    ax.text(PAGE_W_MM / 2.0, oy - 4.5,
            legend_text,
            ha='center', va='center', fontsize=5.0, color='#64748b', fontfamily='sans-serif', weight='bold')

def render_sub_page(sub_info, lang='es'):
    fig = plt.figure(figsize=(PAGE_W_MM / 25.4, PAGE_H_MM / 25.4), dpi=150)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, PAGE_W_MM)
    ax.set_ylim(0, PAGE_H_MM)
    ax.axis('off')

    # Load high-resolution rendered player card (1686 x 1278)
    card_path = f"app/assets/submarines_cards/{sub_info['key']}_{lang}.webp"
    if os.path.exists(card_path):
        card_img = Image.open(card_path).convert('RGB')
        ax.imshow(card_img, extent=(OX, OX + CARD_W_MM, OY, OY + CARD_H_MM), aspect='auto', zorder=2)
    else:
        print(f"Warning: Missing card image {card_path}")
        ax.add_patch(patches.Rectangle((OX, OY), CARD_W_MM, CARD_H_MM, facecolor='#FAF7F0', edgecolor='#1e293b', lw=1, zorder=1))

    # Outer border & crop marks
    ax.add_patch(patches.Rectangle((OX, OY), CARD_W_MM, CARD_H_MM, fill=False, edgecolor='#1e293b', lw=0.8, zorder=5))
    draw_crop_and_calibration_marks(ax, OX, OY, CARD_W_MM, CARD_H_MM, lang=lang)

    # Header badge outside top
    is_fan = sub_info.get('is_fanmade', False)
    badge_prefix = (
        ("[VARIANTE HISTÓRICA REAL (FANMADE)]" if is_fan else "[HOJA CANÓNICA OFICIAL COMPASS GAMES]")
        if lang == 'es' else
        ("[REAL HISTORICAL VARIANT (FANMADE)]" if is_fan else "[OFFICIAL COMPASS GAMES CANONICAL SHEET]")
    )
    title_text = sub_info.get('title') or sub_info.get('name')
    date_text = sub_info.get('date', '')

    badge_str = f"{badge_prefix} • {title_text}"
    if date_text:
        badge_str += f" • {date_text}"

    ax.text(PAGE_W_MM / 2.0, OY + CARD_H_MM + 5.0,
            badge_str,
            ha='center', va='center', fontsize=6.2, color='#1e293b', fontfamily='sans-serif', weight='bold')

    return fig

def main():
    os.makedirs('pdf', exist_ok=True)

    fanmade_catalog = [s for s in SUBS_CATALOG if s.get('is_fanmade')]
    print(f"Total submarines: {len(SUBS_CATALOG)} (Official: {len(SUBS_CATALOG) - len(fanmade_catalog)}, Fanmade: {len(fanmade_catalog)})")

    # 1. Complete Universal 24 Submarines - Spanish
    pdf_univ_es = 'pdf/sensuikan_canonical_player_cards_universal_ES_24subs.pdf'
    print(f"\n1. Generating '{pdf_univ_es}' (24 pages)...")
    with PdfPages(pdf_univ_es) as pdf:
        for s in SUBS_CATALOG:
            fig = render_sub_page(s, lang='es')
            pdf.savefig(fig, dpi=150)
            plt.close(fig)
            print(f"  + Page ES: {s['name']}")

    # 2. Complete Universal 24 Submarines - English
    pdf_univ_en = 'pdf/sensuikan_canonical_player_cards_universal_EN_24subs.pdf'
    print(f"\n2. Generating '{pdf_univ_en}' (24 pages)...")
    with PdfPages(pdf_univ_en) as pdf:
        for s in SUBS_CATALOG:
            fig = render_sub_page(s, lang='en')
            pdf.savefig(fig, dpi=150)
            plt.close(fig)
            print(f"  + Page EN: {s['name']}")

    # 3. Fanmade 6 Submarines - Spanish
    pdf_fan_es = 'pdf/sensuikan_canonical_player_cards_fanmade_ES_6subs.pdf'
    print(f"\n3. Generating '{pdf_fan_es}' (6 pages)...")
    with PdfPages(pdf_fan_es) as pdf:
        for s in fanmade_catalog:
            fig = render_sub_page(s, lang='es')
            pdf.savefig(fig, dpi=150)
            plt.close(fig)

    # 4. Fanmade 6 Submarines - English
    pdf_fan_en = 'pdf/sensuikan_canonical_player_cards_fanmade_EN_6subs.pdf'
    print(f"\n4. Generating '{pdf_fan_en}' (6 pages)...")
    with PdfPages(pdf_fan_en) as pdf:
        for s in fanmade_catalog:
            fig = render_sub_page(s, lang='en')
            pdf.savefig(fig, dpi=150)
            plt.close(fig)

    # 5. Combined Fanmade Edition (6 ES + 6 EN = 12 pages)
    pdf_fan_comb = 'pdf/sensuikan_canonical_player_cards_fanmade_6subs.pdf'
    print(f"\n5. Generating '{pdf_fan_comb}' (12 pages)...")
    with PdfPages(pdf_fan_comb) as pdf:
        for s in fanmade_catalog:
            fig = render_sub_page(s, lang='es')
            pdf.savefig(fig, dpi=150)
            plt.close(fig)
        for s in fanmade_catalog:
            fig = render_sub_page(s, lang='en')
            pdf.savefig(fig, dpi=150)
            plt.close(fig)

    print("\n=========================================================================")
    print("ALL 5 SUBMARINE COLLECTION PDFs GENERATED WITH 100% HOMOGENEOUS PRECISION!")
    print("=========================================================================")

if __name__ == '__main__':
    main()
