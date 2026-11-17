import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages
from shapely.geometry import Polygon, MultiPolygon, box, LineString
from shapely.ops import unary_union

def build_pdf_design():
    pdf_path = os.path.join('docs', 'DISENO_TAPA_REJILLA_SAVE_GAME.pdf')
    os.makedirs('docs', exist_ok=True)
    
    # Dimensions in mm
    tray_w = 241.7
    tray_h = 185.2
    box_w = 300.0
    box_h = 234.0
    
    with PdfPages(pdf_path) as pdf:
        # =====================================================================
        # PAGE 1: FULL 1:1 TECHNICAL SCHEMATIC OF THE SAVE-GAME GRATE LID
        # =====================================================================
        # Convert mm to inches for matplotlib figure: 241.7mm = 9.51in, 185.2mm = 7.29in
        # We use landscape A4: 297 x 210 mm -> 11.69 x 8.27 in
        fig, ax = plt.subplots(figsize=(11.69, 8.27), dpi=300)
        fig.patch.set_facecolor('#101418')
        ax.set_facecolor('#101418')
        
        # Center the tray on the A4 page
        ox = (297.0 - tray_w) / 2.0
        oy = (210.0 - tray_h) / 2.0
        
        # 1. Outer rim of the Lid
        rim_outer = patches.Rectangle((ox, oy), tray_w, tray_h, linewidth=1.5, edgecolor='#d4af37', facecolor='#1c232b', zorder=1)
        ax.add_patch(rim_outer)
        
        # 2. Outer chamfer / bevel lip (4mm border)
        border_t = 6.0
        rim_inner = patches.Rectangle((ox + border_t, oy + border_t), tray_w - 2*border_t, tray_h - 2*border_t, 
                                      linewidth=1.0, edgecolor='#4a5868', facecolor='#141920', zorder=2)
        ax.add_patch(rim_inner)
        
        # 3. Corner Stacking Feet (Resaltes en las 4 esquinas para apilar)
        foot_size = 14.0
        foot_t = 3.5
        corners = [
            (ox, oy), # Bottom-Left
            (ox + tray_w - foot_size, oy), # Bottom-Right
            (ox, oy + tray_h - foot_size), # Top-Left
            (ox + tray_w - foot_size, oy + tray_h - foot_size) # Top-Right
        ]
        for cx, cy in corners:
            foot_patch = patches.Rectangle((cx, cy), foot_size, foot_size, linewidth=1.2, 
                                           edgecolor='#ffcc00', facecolor='#2c3642', alpha=0.9, zorder=6)
            ax.add_patch(foot_patch)
            # Corner triangle guide
            ax.plot([cx, cx + foot_size], [cy, cy + foot_size], color='#ffcc00', linewidth=0.8, zorder=7)

        # 4. Elastic Band Grooves (Muescas para gomas elásticas)
        band_w = 24.0
        groove_depth = 1.6
        # Left and Right grooves (centered vertically)
        groove_ly = oy + (tray_h - band_w) / 2.0
        # Draw groove markers
        ax.add_patch(patches.Rectangle((ox, groove_ly), groove_depth, band_w, facecolor='#ff4444', edgecolor='#ff6666', linewidth=1.0, zorder=8))
        ax.add_patch(patches.Rectangle((ox + tray_w - groove_depth, groove_ly), groove_depth, band_w, facecolor='#ff4444', edgecolor='#ff6666', linewidth=1.0, zorder=8))
        
        # Top and Bottom grooves (two vertical bands)
        for bx in [ox + tray_w*0.28, ox + tray_w*0.72]:
            ax.add_patch(patches.Rectangle((bx - band_w/2.0, oy), band_w, groove_depth, facecolor='#ff4444', edgecolor='#ff6666', linewidth=1.0, zorder=8))
            ax.add_patch(patches.Rectangle((bx - band_w/2.0, oy + tray_h - groove_depth), band_w, groove_depth, facecolor='#ff4444', edgecolor='#ff6666', linewidth=1.0, zorder=8))

        # 5. Diamond Grid (Celosía naval ligera)
        grid_min_x = ox + border_t + 2.0
        grid_max_x = ox + tray_w - border_t - 2.0
        grid_min_y = oy + border_t + 2.0
        grid_max_y = oy + tray_h - border_t - 2.0
        
        step = 12.0 # Grid pitch in mm
        # Diagonal lines 45 deg and -45 deg
        for offset in np.arange(-tray_w - tray_h, tray_w + tray_h, step):
            # Line y = x + offset
            p1_x = max(grid_min_x, grid_min_y - offset)
            p1_y = p1_x + offset
            p2_x = min(grid_max_x, grid_max_y - offset)
            p2_y = p2_x + offset
            if p1_x < p2_x and grid_min_y <= p1_y <= grid_max_y and grid_min_y <= p2_y <= grid_max_y:
                ax.plot([p1_x, p2_x], [p1_y, p2_y], color='#283340', linewidth=0.7, zorder=3)
                
            # Line y = -x + offset
            p1_x = max(grid_min_x, offset - grid_max_y)
            p1_y = -p1_x + offset
            p2_x = min(grid_max_x, offset - grid_min_y)
            p2_y = -p2_x + offset
            if p1_x < p2_x and grid_min_y <= p1_y <= grid_max_y and grid_min_y <= p2_y <= grid_max_y:
                ax.plot([p1_x, p2_x], [p1_y, p2_y], color='#283340', linewidth=0.7, zorder=3)

        # 6. Central Emblem: IJN Submarine Silhouette & Plaque
        center_x = ox + tray_w / 2.0
        center_y = oy + tray_h / 2.0
        
        plaque_w = 175.0
        plaque_h = 42.0
        plaque = patches.FancyBboxPatch((center_x - plaque_w/2.0, center_y - plaque_h/2.0), plaque_w, plaque_h,
                                        boxstyle="round,pad=1.5,rounding_size=3.0",
                                        facecolor='#182028', edgecolor='#d4af37', linewidth=1.5, zorder=4)
        ax.add_patch(plaque)
        
        # Submarine Silhouette points (centered on plaque)
        hull_half = 72.0
        hull_h = 10.0
        sub_pts = [
            (-hull_half, 0), (-hull_half + 8, -3), (-hull_half + 20, -hull_h/2.0),
            (hull_half - 20, -hull_h/2.0), (hull_half - 6, -1.5), (hull_half, 1.5),
            (hull_half - 5, 5), (hull_half - 20, hull_h/2.0), (28, hull_h/2.0),
            (27, hull_h/2.0 + 3), (22, hull_h/2.0 + 3), (22, hull_h/2.0), (14, hull_h/2.0),
            (11, hull_h/2.0 + 9), (8, hull_h/2.0 + 14), (6, hull_h/2.0 + 14), (6, hull_h/2.0 + 9),
            (-8, hull_h/2.0 + 9), (-10, hull_h/2.0), (-16, hull_h/2.0), (-18, hull_h/2.0 + 2.5),
            (-23, hull_h/2.0 + 2.5), (-25, hull_h/2.0), (-hull_half + 20, hull_h/2.0),
            (-hull_half + 8, 3), (-hull_half, 0)
        ]
        sub_poly_scaled = [(center_x + pt[0], center_y + 4.0 + pt[1]*0.8) for pt in sub_pts]
        sub_patch = patches.Polygon(sub_poly_scaled, closed=True, facecolor='#d4af37', edgecolor='#ffffff', linewidth=0.5, zorder=5)
        ax.add_patch(sub_patch)
        
        # Plaque text in gold
        ax.text(center_x, center_y - 12.0, 'SENSUlKAN  ·  SUBMARINE PATROL LOG', 
                color='#d4af37', fontsize=9, fontweight='bold', ha='center', va='center', zorder=5)
        ax.text(center_x, center_y - 16.5, 'FLEET SUBMARINE CAMPAIGN SAVE-STATE TRAY', 
                color='#8ba0b5', fontsize=6.5, ha='center', va='center', zorder=5)

        # Title & Technical Labels
        ax.text(20, 200, 'SENSUlKAN - TAPA DE REJILLA "SAVE-GAME" CON BLOQUEO', color='#d4af37', fontsize=13, fontweight='bold')
        ax.text(20, 194, 'Diseño técnico a escala real (241.7 x 185.2 mm) con celosía naval, esquinas de apilado y muescas para bandas elásticas', color='#9fb2c5', fontsize=8)

        # Dimension annotations
        ax.annotate('', xy=(ox, oy - 8), xytext=(ox + tray_w, oy - 8),
                    arrowprops=dict(arrowstyle='<->', color='#d4af37', lw=1.0))
        ax.text(ox + tray_w/2.0, oy - 12, f'{tray_w:.1f} mm (Ancho Tapa / Compatible Cama 256 mm)', color='#d4af37', fontsize=7.5, ha='center')

        ax.annotate('', xy=(ox - 8, oy), xytext=(ox - 8, oy + tray_h),
                    arrowprops=dict(arrowstyle='<->', color='#d4af37', lw=1.0))
        ax.text(ox - 12, oy + tray_h/2.0, f'{tray_h:.1f} mm', color='#d4af37', fontsize=7.5, va='center', rotation=90)

        # Legend boxes
        ax.text(ox + 8, oy + 8, '■ Esquinas de apilado (14x14 mm, resalte 1.5mm)\n■ Muescas rojas: Guiado de gomas elásticas\n■ Ventilación y visibilidad: Celosía de rombos 12mm', 
                color='#a0b4c8', fontsize=6.5, bbox=dict(boxstyle='square,pad=0.5', facecolor='#161d24', edgecolor='#2e3c4a'))

        ax.set_xlim(0, 297.0)
        ax.set_ylim(0, 210.0)
        ax.set_aspect('equal')
        ax.axis('off')
        pdf.savefig(fig)
        plt.close(fig)

        # =====================================================================
        # PAGE 2: EXPLODED VIEW & COMPASS GAMES BOX INTEGRATION
        # =====================================================================
        fig2, ax2 = plt.subplots(figsize=(11.69, 8.27), dpi=300)
        fig2.patch.set_facecolor('#101418')
        ax2.set_facecolor('#101418')

        ax2.text(20, 200, 'SENSUlKAN - INTEGRACIÓN EN CAJA COMPASS GAMES (300 x 234 mm) Y SISTEMA DE CAPAS', color='#d4af37', fontsize=13, fontweight='bold')
        ax2.text(20, 194, 'Esquema de distribución interior de la caja y corte transversal del sándwich de guardado de partida', color='#9fb2c5', fontsize=8)

        # 1. Box Layout (Left Half)
        box_ox = 20.0
        box_oy = 25.0
        # Scale to fit page: 1.0 scale fits nicely
        ax2.add_patch(patches.Rectangle((box_ox, box_oy), box_w*0.5, box_h*0.5, linewidth=2.0, edgecolor='#c09838', facecolor='#181e26'))
        ax2.text(box_ox + 5, box_oy + box_h*0.5 - 8, 'INTERIOR CAJA COMPASS (300 x 234 mm)', color='#c09838', fontsize=8, fontweight='bold')

        # Inside the box: The 3 Stacked Trays footprint
        tray_scaled_w = tray_w * 0.5
        tray_scaled_h = tray_h * 0.5
        ax2.add_patch(patches.Rectangle((box_ox + 6, box_oy + 6), tray_scaled_w, tray_scaled_h, linewidth=1.5, edgecolor='#33cc66', facecolor='#203028'))
        ax2.text(box_ox + 12, box_oy + 16, 'PACK 3 BANDEJAS APILADAS\n(Submarine + Operations + Attack)', color='#33cc66', fontsize=7.5, fontweight='bold')
        ax2.text(box_ox + 12, box_oy + 8, f'{tray_w:.1f} x {tray_h:.1f} mm', color='#88bb99', fontsize=6.5)

        # Extra free space in box
        free_w = (box_w - tray_w) * 0.5
        free_ox = box_ox + 6 + tray_scaled_w + 5
        ax2.add_patch(patches.Rectangle((free_ox, box_oy + 6), free_w - 15, tray_scaled_h, linewidth=1.0, edgecolor='#607080', facecolor='#151b22', linestyle='--'))
        ax2.text(free_ox + 3, box_oy + tray_scaled_h/2.0, 'ESPACIO LIBRE\nPARA CAJAS\nDE DADOS,\nMANUALES Y\nHOGAS LOG\n(~58 x 234 mm)', color='#8098b0', fontsize=6.5, ha='left', va='center')

        # 2. Cross Section View (Right Half)
        cs_x = 185.0
        cs_y = 135.0
        cs_w = 95.0
        
        ax2.text(cs_x, cs_y + 45, 'CORTE TRANSVERSAL: SÁNDWICH DE BLOQUEO', color='#d4af37', fontsize=9.5, fontweight='bold')

        # Layer 1: Save-Lid Grate (Top)
        ax2.add_patch(patches.Rectangle((cs_x, cs_y + 24), cs_w, 6, facecolor='#2a3542', edgecolor='#d4af37', linewidth=1.2))
        ax2.text(cs_x + cs_w + 3, cs_y + 27, '1. Tapa Rejilla Save-Game (2.2 mm)\n   (Esquinas de apilado + rejilla)', color='#d4af37', fontsize=6.5, va='center')

        # Retaining ribs pointing down to press counters
        for rib_x in [cs_x + 12, cs_x + 35, cs_x + 60, cs_x + 82]:
            ax2.add_patch(patches.Rectangle((rib_x, cs_y + 21), 4, 3, facecolor='#d4af37', edgecolor='none'))

        # Layer 2: Dual Layer Top Overlay
        ax2.add_patch(patches.Rectangle((cs_x, cs_y + 11), cs_w, 8, facecolor='#1f2630', edgecolor='#455568', linewidth=1.0))
        # Slots cutouts in dual layer with counters inside
        for cx_slot in [cs_x + 10, cs_x + 33, cs_x + 58, cs_x + 80]:
            ax2.add_patch(patches.Rectangle((cx_slot, cs_y + 11), 8, 8, facecolor='#101418', edgecolor='#607080', linewidth=0.5))
            # Counter inside slot!
            ax2.add_patch(patches.Rectangle((cx_slot + 0.5, cs_y + 11.5), 7, 7, facecolor='#aa3333', edgecolor='#ff6666', linewidth=0.8))
            ax2.text(cx_slot + 4, cs_y + 15, 'C', color='#ffffff', fontsize=5.5, ha='center', va='center', fontweight='bold')
        ax2.text(cs_x + cs_w + 3, cs_y + 15, '2. Tapa Dual-Layer (2.0 mm)\n   (Retiene los counters en XY)', color='#8ba0b5', fontsize=6.5, va='center')

        # Layer 3: Paper Mat (Submarine Sheet)
        ax2.add_patch(patches.Rectangle((cs_x, cs_y + 7.5), cs_w, 1.5, facecolor='#f5ecd8', edgecolor='#c8b898', linewidth=0.5))
        ax2.text(cs_x + cs_w + 3, cs_y + 8, '3. Hoja Submarino (Papel/Cartulina)', color='#f5ecd8', fontsize=6.5, va='center')

        # Layer 4: Base Tray
        ax2.add_patch(patches.Rectangle((cs_x, cs_y), cs_w, 6.0, facecolor='#252e38', edgecolor='#405060', linewidth=1.2))
        # Outer rim holding the sandwich
        ax2.add_patch(patches.Rectangle((cs_x - 3, cs_y), 3, 30, facecolor='#252e38', edgecolor='#d4af37', linewidth=1.0))
        ax2.add_patch(patches.Rectangle((cs_x + cs_w, cs_y), 3, 30, facecolor='#252e38', edgecolor='#d4af37', linewidth=1.0))
        ax2.text(cs_x + cs_w + 8, cs_y + 2, '4. Bandeja Base con Pared (5.4 mm)', color='#8ba0b5', fontsize=6.5, va='center')

        # Rubber band arrow
        ax2.annotate('Banda Elástica Exterior\n(Presiona todo el sándwich en Z)', xy=(cs_x - 5, cs_y + 15), xytext=(cs_x - 45, cs_y + 15),
                     arrowprops=dict(arrowstyle='->', color='#ff4444', lw=1.5), color='#ff6666', fontsize=7.0, va='center', fontweight='bold')

        # Summary box
        summary_text = (
            "VENTAJAS DEL SISTEMA:\n"
            "• Presión en Z constante: Las fichas no pueden salirse de sus celdas aunque la caja se ponga en vertical.\n"
            "• Tamaño estándar: Todas las bandejas (Submarine, Map, Attack) comparten idéntica huella (241.7 x 185.2 mm).\n"
            "• Apilado perfecto: Las esquinas traban cada nivel para que no deslicen dentro de la caja.\n"
            "• Compatible 100%: Entra en cama de 256x256 mm y deja 58 mm libres en la caja Compass para accesorios."
        )
        ax2.text(185.0, 30.0, summary_text, color='#d4af37', fontsize=6.8,
                 bbox=dict(boxstyle='round,pad=0.8', facecolor='#161d25', edgecolor='#d4af37', linewidth=1.0))

        ax2.set_xlim(0, 297.0)
        ax2.set_ylim(0, 210.0)
        ax2.set_aspect('equal')
        ax2.axis('off')
        pdf.savefig(fig2)
        plt.close(fig2)

    print(f'PDF generated successfully at: {pdf_path}')

if __name__ == '__main__':
    build_pdf_design()
