import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
import fitz # PyMuPDF to export preview images

def generate_unified_templates_pdf():
    pdf_path = os.path.join('docs', 'DISENO_PLANTILLAS_OPERATIONS_Y_ATTACK_MATS.pdf')
    os.makedirs('docs', exist_ok=True)
    os.makedirs('images/previews', exist_ok=True)

    card_w = 238.0
    card_h = 181.5

    with PdfPages(pdf_path) as pdf:
        # =====================================================================
        # PAGE 1: CANONICAL OPERATIONS MAP (MAPA ESTRATÉGICO DEL PACÍFICO)
        # =====================================================================
        fig1, ax1 = plt.subplots(figsize=(11.69, 8.27), dpi=300) # Landscape A4 (297 x 210 mm)
        fig1.patch.set_facecolor('#0d1115')
        ax1.set_facecolor('#0d1115')

        ox = (297.0 - card_w) / 2.0
        oy = (210.0 - card_h) / 2.0

        # Background parchment mat (unified 238 x 181.5 mm)
        mat_bg = patches.Rectangle((ox, oy), card_w, card_h, facecolor='#131c26', edgecolor='#d4af37', linewidth=1.5, zorder=1)
        ax1.add_patch(mat_bg)
        
        # Subtle nautical map grid lines (lat/long)
        for gx in np.linspace(ox + 10, ox + card_w - 10, 8):
            ax1.plot([gx, gx], [oy + 10, oy + card_h - 10], color='#1b2838', linewidth=0.6, linestyle=':', zorder=2)
        for gy in np.linspace(oy + 10, oy + card_h - 10, 6):
            ax1.plot([ox + 10, ox + card_w - 10], [gy, gy], color='#1b2838', linewidth=0.6, linestyle=':', zorder=2)

        # Header Title Plaque
        header_box = patches.FancyBboxPatch((ox + 4, oy + card_h - 22), 170.0, 18.0,
                                            boxstyle="round,pad=0.5,rounding_size=2.0",
                                            facecolor='#182330', edgecolor='#d4af37', linewidth=1.2, zorder=4)
        ax1.add_patch(header_box)
        ax1.text(ox + 8, oy + card_h - 10, 'SENSUlKAN  ·  IMPERIAL JAPANESE NAVY OPERATIONS MAP', 
                 color='#d4af37', fontsize=9.5, fontweight='bold', zorder=5)
        ax1.text(ox + 8, oy + card_h - 17, 'CANONICAL PACIFIC THEATRE  |  STANDARDIZED FORMAT: 238.0 x 181.5 MM', 
                 color='#8fa5b8', fontsize=6.2, zorder=5)

        # Red Military Seal (Gunji Kimitsu) top right
        seal_box = patches.Circle((ox + card_w - 18, oy + card_h - 13), 8.0, facecolor='#221418', edgecolor='#c0392b', linewidth=1.2, zorder=4)
        ax1.add_patch(seal_box)
        ax1.text(ox + card_w - 18, oy + card_h - 13, '軍事\n機密', color='#c0392b', fontsize=4.5, fontweight='bold', ha='center', va='center', zorder=5)

        # Major Naval Bases (Kure, Yokosuka, Truk, Penang)
        bases = [
            ('YOKOSUKA NAVAL BASE', ox + 38, oy + 128, '#ffcc00', 'HOME PORT'),
            ('KURE NAVAL DISTRICT', ox + 22, oy + 115, '#ffcc00', 'SUB SCHOOL'),
            ('TRUK LAGOON ATOLL', ox + 65, oy + 78, '#ffaa00', 'FORWARD BASE'),
            ('PENANG (MALAYA)', ox + 18, oy + 45, '#ffaa00', 'INDIAN OCEAN BASE')
        ]
        for name, bx, by, col, note in bases:
            ax1.add_patch(patches.Circle((bx, by), 4.0, facecolor='#2a1f10', edgecolor=col, linewidth=1.5, zorder=6))
            ax1.add_patch(patches.Circle((bx, by), 1.8, facecolor=col, zorder=7))
            ax1.text(bx + 6, by + 1.5, name, color='#ffffff', fontsize=6.5, fontweight='bold', zorder=8)
            ax1.text(bx + 6, by - 3.5, note, color=col, fontsize=5.0, zorder=8)

        # Patrol Areas with Standardized 15x15 mm Counter Slots
        # Area definitions: (Area Name, Box Center X, Box Center Y, Extra Transit Boxes, Code)
        patrol_zones = [
            ('HAWAII / PEARL HARBOR', ox + 185, oy + 115, 2, 'AREA 1 · HAWAII [+2 TRANSIT]'),
            ('US WEST COAST', ox + 215, oy + 140, 3, 'AREA 2 · US COAST [+3 TRANSIT]'),
            ('MARSHALL ISLANDS', ox + 115, oy + 95, 0, 'AREA 3 · CENTRAL PACIFIC'),
            ('SOLOMON ISLANDS / GUADALCANAL', ox + 95, oy + 55, 1, 'AREA 4 · SOUTH PACIFIC [+1 TRANSIT]'),
            ('AUSTRALIA / CORAL SEA', ox + 115, oy + 25, 2, 'AREA 5 · AUSTRALIA [+2 TRANSIT]'),
            ('DUTCH EAST INDIES', ox + 50, oy + 30, 0, 'AREA 6 · JAVA SEA / OIL ROUTE'),
            ('INDIAN OCEAN', ox + 18, oy + 18, 1, 'AREA 7 · COMMERCE RAIDING [+1]'),
            ('MIDWAY ATOLL', ox + 140, oy + 130, 1, 'AREA 8 · NORTH PACIFIC [+1]')
        ]

        # Draw patrol zone boxes and standardized 15x15 mm slots
        slot_sz = 15.0
        for name, zx, zy, transit_bonus, label in patrol_zones:
            # Main Slot for Submarine Marker (15x15 mm)
            slot = patches.Rectangle((zx - slot_sz/2.0, zy - slot_sz/2.0), slot_sz, slot_sz, 
                                     facecolor='#1e2a38', edgecolor='#33cc66', linewidth=1.2, zorder=6)
            ax1.add_patch(slot)
            # Slot inner crosshair
            ax1.plot([zx - 3, zx + 3], [zy, zy], color='#33cc66', linewidth=0.6, zorder=7)
            ax1.plot([zx, zx], [zy - 3, zy + 3], color='#33cc66', linewidth=0.6, zorder=7)

            # Zone label plaque
            ax1.text(zx, zy + slot_sz/2.0 + 3.0, name, color='#e0ecf8', fontsize=5.5, fontweight='bold', ha='center', zorder=8)
            ax1.text(zx, zy - slot_sz/2.0 - 3.5, label, color='#ffaa33', fontsize=4.5, ha='center', zorder=8)

            # Extra Transit track if applicable
            if transit_bonus > 0:
                for tb in range(transit_bonus):
                    tbx = zx - (tb + 1) * 9.0
                    tby = zy - (tb + 1) * 3.5
                    ax1.add_patch(patches.Circle((tbx, tby), 3.0, facecolor='#202d3d', edgecolor='#456585', linewidth=0.8, zorder=5))
                    ax1.text(tbx, tby, 'T', color='#8fa5b8', fontsize=3.5, ha='center', va='center', zorder=6)

        # Shipping Routes / Patrol Lanes (dashed gold lines connecting bases to zones)
        routes = [
            ((ox + 38, oy + 128), (ox + 185, oy + 115)), # Yokosuka -> Pearl Harbor
            ((ox + 38, oy + 128), (ox + 140, oy + 130)), # Yokosuka -> Midway
            ((ox + 38, oy + 128), (ox + 115, oy + 95)),  # Yokosuka -> Marshalls
            ((ox + 38, oy + 128), (ox + 65, oy + 78)),   # Yokosuka -> Truk
            ((ox + 65, oy + 78), (ox + 95, oy + 55)),    # Truk -> Solomons
            ((ox + 65, oy + 78), (ox + 115, oy + 25)),   # Truk -> Australia
            ((ox + 22, oy + 115), (ox + 50, oy + 30)),   # Kure -> Dutch East Indies
            ((ox + 18, oy + 45), (ox + 18, oy + 18))     # Penang -> Indian Ocean
        ]
        for p1, p2 in routes:
            ax1.plot([p1[0], p2[0]], [p1[1], p2[1]], color='#c09838', linewidth=0.8, linestyle='--', alpha=0.6, zorder=3)

        # Decorative Compass Rose in mid ocean
        cr_x, cr_y = ox + 155, oy + 45
        for ang in range(0, 360, 45):
            rad = np.radians(ang)
            rad2 = np.radians(ang + 22.5)
            r_outer = 16.0 if ang % 90 == 0 else 11.0
            ax1.plot([cr_x, cr_x + r_outer*np.cos(rad)], [cr_y, cr_y + r_outer*np.sin(rad)], color='#d4af37', linewidth=1.0, zorder=3)
        ax1.add_patch(patches.Circle((cr_x, cr_y), 4.0, facecolor='#131c26', edgecolor='#d4af37', linewidth=1.0, zorder=4))
        ax1.text(cr_x, cr_y + 19, 'N', color='#d4af37', fontsize=6.5, fontweight='bold', ha='center', zorder=5)

        # Legend and Notes
        ax1.text(ox + 6, oy + 6, '■ CASILLAS DE POSICIÓN: 15.0 x 15.0 mm (Compatibles con Bandeja y Fichas IA)\n■ RUTAS MARÍTIMAS: Tránsito de ida y vuelta a Yokosuka/Kure\n■ CÍRCULOS (T): Cajas de tránsito adicional para zonas lejanas', 
                 color='#8fa5b8', fontsize=5.5, bbox=dict(boxstyle='square,pad=0.4', facecolor='#10161e', edgecolor='#2d3e50', linewidth=0.8), zorder=8)

        ax1.set_xlim(0, 297.0)
        ax1.set_ylim(0, 210.0)
        ax1.set_aspect('equal')
        ax1.axis('off')
        pdf.savefig(fig1)
        plt.close(fig1)

        # =====================================================================
        # PAGE 2: CANONICAL ATTACK MAT [H1] (TAPETE TÁCTICO DE COMBATE)
        # =====================================================================
        fig2, ax2 = plt.subplots(figsize=(11.69, 8.27), dpi=300)
        fig2.patch.set_facecolor('#0d1115')
        ax2.set_facecolor('#0d1115')

        # Mat background
        mat_bg2 = patches.Rectangle((ox, oy), card_w, card_h, facecolor='#121a24', edgecolor='#d4af37', linewidth=1.5, zorder=1)
        ax2.add_patch(mat_bg2)

        # Header Title Plaque
        header_box2 = patches.FancyBboxPatch((ox + 4, oy + card_h - 22), 170.0, 18.0,
                                             boxstyle="round,pad=0.5,rounding_size=2.0",
                                             facecolor='#182330', edgecolor='#d4af37', linewidth=1.2, zorder=4)
        ax2.add_patch(header_box2)
        ax2.text(ox + 8, oy + card_h - 10, 'SENSUlKAN  ·  SUBMARINE ATTACK MAT [H1]', 
                 color='#d4af37', fontsize=9.5, fontweight='bold', zorder=5)
        ax2.text(ox + 8, oy + card_h - 17, 'STANDARDIZED TACTICAL COMBAT DISPLAY  |  FORMAT: 238.0 x 181.5 MM', 
                 color='#8fa5b8', fontsize=6.2, zorder=5)

        # Red Military Seal top right
        seal_box2 = patches.Circle((ox + card_w - 18, oy + card_h - 13), 8.0, facecolor='#221418', edgecolor='#c0392b', linewidth=1.2, zorder=4)
        ax2.add_patch(seal_box2)
        ax2.text(ox + card_w - 18, oy + card_h - 13, '軍事\n機密', color='#c0392b', fontsize=4.5, fontweight='bold', ha='center', va='center', zorder=5)

        # -------------------------------------------------------------
        # 1. ESCORTS SECTION (TOP ROW: ESCORT 1, ESCORT 2, ESCORT 3)
        # -------------------------------------------------------------
        escort_y = oy + card_h - 38.0
        ax2.add_patch(patches.Rectangle((ox + 6, escort_y - 12), card_w - 12, 22.0, facecolor='#1a2432', edgecolor='#3a4d62', linewidth=0.8, zorder=2))
        ax2.text(ox + 10, escort_y + 6.0, 'CONVOY ESCORTS & SUBMARINE HUNTERS (CHART B4 / B5)', color='#ff6666', fontsize=6.5, fontweight='bold', zorder=4)

        for i, ex in enumerate([ox + 55, ox + 115, ox + 175]):
            slot = patches.Rectangle((ex - slot_sz/2.0, escort_y - slot_sz/2.0 - 2.0), slot_sz, slot_sz, 
                                     facecolor='#261518', edgecolor='#ff4444', linewidth=1.2, zorder=4)
            ax2.add_patch(slot)
            ax2.text(ex, escort_y - 2.0, f'E{i+1}', color='#ff8888', fontsize=7.0, ha='center', va='center', fontweight='bold', zorder=5)
            ax2.text(ex, escort_y - 12.0, f'ESCORT {i+1}', color='#ffaaaa', fontsize=5.0, ha='center', zorder=5)

        # -------------------------------------------------------------
        # 2. RANGE TRACKS (LONG, MEDIUM, CLOSE RANGE COLUMNS)
        # -------------------------------------------------------------
        range_y_top = oy + card_h - 58.0
        range_h = 70.0
        range_cols = [
            ('LONG RANGE\n(2d6 to Hit: 2)', ox + 6, 70.0, '#1c2838', '#45607e'),
            ('MEDIUM RANGE\n(2d6 to Hit: 2-3)', ox + 80, 75.0, '#1a2a3c', '#4a6f95'),
            ('CLOSE RANGE\n(2d6 to Hit: 1-4 | Escort Risk)', ox + 160, 72.0, '#26222c', '#8a5c68')
        ]
        for title, rx, rw, bg_col, edge_col in range_cols:
            ax2.add_patch(patches.Rectangle((rx, range_y_top - range_h), rw, range_h, facecolor=bg_col, edgecolor=edge_col, linewidth=0.8, zorder=2))
            ax2.text(rx + rw/2.0, range_y_top - 6.0, title, color='#ffffff', fontsize=6.0, fontweight='bold', ha='center', va='center', zorder=4)

        # Target slots inside Range Tracks (Target 1, Target 2, Target 3 / Fast Ships)
        for row_idx, r_offset in enumerate([18.0, 36.0, 54.0]):
            ty = range_y_top - r_offset
            # Slot in Close Range, Medium, Long
            for c_idx, rx_center in enumerate([ox + 41.0, ox + 117.5, ox + 196.0]):
                slot = patches.Rectangle((rx_center - slot_sz/2.0, ty - slot_sz/2.0), slot_sz, slot_sz,
                                         facecolor='#141c26', edgecolor='#ffcc00' if c_idx==2 else '#4a90e2', linewidth=1.0, zorder=4)
                ax2.add_patch(slot)
                ax2.text(rx_center, ty, f'T{row_idx+1}', color='#ffffff', fontsize=6.5, ha='center', va='center', fontweight='bold', zorder=5)
                # Label
                if c_idx == 0:
                    ax2.text(rx_center + slot_sz/2.0 + 3, ty, f'TARGET {row_idx+1}', color='#8fa5b8', fontsize=5.0, va='center', zorder=5)

        # -------------------------------------------------------------
        # 3. TORPEDO ASSIGNMENT TRACK (BOTTOM: TUBES 1..8 & IMPACT BOXES)
        # -------------------------------------------------------------
        torp_y = oy + 32.0
        ax2.add_patch(patches.Rectangle((ox + 6, torp_y - 20), card_w - 12, 38.0, facecolor='#16202c', edgecolor='#3a4d62', linewidth=0.8, zorder=2))
        ax2.text(ox + 10, torp_y + 14.0, 'FIRED TORPEDOES TRACK (CHART B1 / B6 IMPACT RESOLUTION)', color='#d4af37', fontsize=6.5, fontweight='bold', zorder=4)

        # 8 Torpedo slots along bottom
        torp_xs = np.linspace(ox + 20, ox + card_w - 20, 8)
        for i, tx in enumerate(torp_xs):
            slot = patches.Rectangle((tx - slot_sz/2.0, torp_y - slot_sz/2.0 - 2.0), slot_sz, slot_sz,
                                     facecolor='#111822', edgecolor='#33cc66', linewidth=1.0, zorder=4)
            ax2.add_patch(slot)
            ax2.text(tx, torp_y - 2.0, f'T{i+1}', color='#33cc66', fontsize=6.0, ha='center', va='center', fontweight='bold', zorder=5)
            ax2.text(tx, torp_y - 12.0, f'TUBE {i+1}', color='#8fa5b8', fontsize=4.8, ha='center', zorder=5)

        # Bottom Notes
        ax2.text(ox + 6, oy + 4, '■ REGLA 8.2: Decisión de distancia (Close / Medium / Long) antes del disparo de torpedos\n■ ESCOLTAS: Ataque de cargas de profundidad automático si se detecta a corta distancia\n■ RANURAS ESTANDARIZADAS: 15.0 x 15.0 mm compatibles con la bandeja y fichas IA',
                 color='#8fa5b8', fontsize=5.5, zorder=5)

        ax2.set_xlim(0, 297.0)
        ax2.set_ylim(0, 210.0)
        ax2.set_aspect('equal')
        ax2.axis('off')
        pdf.savefig(fig2)
        plt.close(fig2)

    print(f'Unified templates PDF saved to: {pdf_path}')

    # Render PDF pages to images using PyMuPDF
    doc = fitz.open(pdf_path)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        img_out = f'images/previews/preview_plantilla_{"operations_map" if i==0 else "attack_mat"}.jpg'
        pix.save(img_out)
        print(f'Saved preview image: {img_out}')

if __name__ == '__main__':
    generate_unified_templates_pdf()
