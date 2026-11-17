"""
Technical Blueprint & Diagram: Modular Sandwich System for 2 Active Submarines + 16 Reserves (Sensuikan)
Updated with:
- Exact 200g/m2 cardstock thickness calculation:
  1 sheet of 200g = ~0.24 mm (caliper)
  17 sheets of 200g = ~4.08 mm (barely 4.1 mm, NOT 9.5 mm!)
  Depot interior depth = 4.5 mm (compact & ultra light!)
- Dual Active Submarine System:
  Layer 1: Base Tray Support
  Layer 2: Active Submarine #1 + PLA Grid Overlay with live counters
  Layer 3: Reserve Depot Tray for remaining 16 submarine cards (with thumb notches)
  Layer 4: Active Submarine #2 + 2nd PLA Grid Overlay with live counters (for dual-sub missions!)
  Layer 5: Save-Game Grate Lid (locks all counters in both active boards)
Total Stack Height: only ~14.5 mm!
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages

DOCS_DIR = os.path.abspath("docs")
PREV_DIR = os.path.abspath("images/previews")
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)

def create_sandwich_blueprint():
    print("Generating Updated 2-Active Submarines Sandwich Blueprint (200g Cardstock)...")
    
    pdf_path = os.path.join(DOCS_DIR, "SISTEMA_SANDWICH_18_SUBMARINOS_DELUXE.pdf")
    
    DPI = 300
    DARK_NAVY = '#0a0e17'
    CARD_BG = '#121824'
    ACCENT_GOLD = '#d4af37'
    IJN_RED = '#b81d24'
    GRID_CYAN = '#38bdf8'
    TEXT_LIGHT = '#f1f5f9'
    TEXT_MUTED = '#94a3b8'
    LINE_BORDER = '#334155'
    GREEN_OK = '#10b981'
    
    with PdfPages(pdf_path) as pdf:
        fig = plt.figure(figsize=(11.69, 8.27), dpi=DPI)
        ax = fig.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        # Outer border
        ax.add_patch(patches.Rectangle((1.5, 1.5), 97.0, 97.0, facecolor='none', edgecolor=ACCENT_GOLD, linewidth=2))
        ax.add_patch(patches.Rectangle((2.2, 2.2), 95.6, 95.6, facecolor='none', edgecolor=LINE_BORDER, linewidth=0.8))
        
        # Header Bar
        ax.add_patch(patches.Rectangle((2.2, 88.5), 95.6, 9.3, facecolor='#151d2d', edgecolor=ACCENT_GOLD, linewidth=1.5))
        ax.text(50, 94.7, "TORRE SÁNDWICH: 2 SUBMARINOS ACTIVOS + DEPÓSITO 16 RESERVAS", 
                color=ACCENT_GOLD, fontsize=13.5, fontweight='bold', ha='center', va='center')
        ax.text(50, 90.7, "Calibrado para Cartulina de 200g/m² | Submarino 1 + Hangar Flota + Submarino 2 + Tapa Save-Game", 
                color=TEXT_LIGHT, fontsize=9.2, ha='center', va='center')
        
        # ---------------------------------------------------------------------
        # LEFT PANEL: EXPLODED VIEW (DESPIECE VERTICAL POR CAPAS)
        # ---------------------------------------------------------------------
        panel_l = patches.FancyBboxPatch((3.5, 5.0), 45.0, 81.5, boxstyle="round,pad=0.5,rounding_size=1",
                                         facecolor=CARD_BG, edgecolor=ACCENT_GOLD, linewidth=1.2)
        ax.add_patch(panel_l)
        ax.text(26.0, 83.5, "DESPIECE EXPLODED (5 NIVELES VERTICALES)", color=ACCENT_GOLD, fontsize=10.5, fontweight='bold', ha='center')
        
        layers = [
            {
                "num": "5",
                "title": "TAPA REJILLA DE GUARDADO (SAVE-GAME LID)",
                "desc": "Espesor 2.8 mm | Malla de diamante 13 mm + Ranuras goma en cruz.\nPestañas perimetrales que abrazan y bloquean todas las fichas superiores.",
                "color": '#1e293b', "edge": '#f59e0b', "y": 68.5, "h": 10.5
            },
            {
                "num": "4",
                "title": "SUBMARINO ACTIVO #2 + 2ª CUBIERTA OVERLAY PLA",
                "desc": "Espesor 2.5 mm | ¡Para misiones de 2 submarinos simultáneos!\nCartón 200g + Rejilla troquelada idéntica a la Capa 2 con sus fichas activas.",
                "color": '#161e2e', "edge": IJN_RED, "y": 54.0, "h": 10.5
            },
            {
                "num": "3",
                "title": "BANDEJA DEPÓSITO (16 SUBMARINOS RESERVA)",
                "desc": "Espesor 5.5 mm | Hueco útil de 4.5 mm (16 hojas x 0.24 mm = 3.8 mm).\nUñeros laterales ergonómicos para sacar y guardar cartones rápidamente.",
                "color": '#1e2230', "edge": '#ec4899', "y": 38.0, "h": 12.0
            },
            {
                "num": "2",
                "title": "SUBMARINO ACTIVO #1 + 1ª CUBIERTA OVERLAY PLA",
                "desc": "Espesor 2.5 mm | La rejilla troquelada que ya tienes impresa en PLA negro.\nHuecos de 15x15 mm que encierran las fichas del 1er submarino en campaña.",
                "color": '#161e2e', "edge": IJN_RED, "y": 23.5, "h": 10.5
            },
            {
                "num": "1",
                "title": "BASE INFERIOR SOPORTE (BASE TRAY #1)",
                "desc": "Espesor 1.2 mm | Base plana con labio perimetral de autocentrado.\nSoporta el cartón del 1er submarino y recibe los pines de apilado sin deslizamiento.",
                "color": '#0f172a', "edge": ACCENT_GOLD, "y": 9.0, "h": 10.5
            }
        ]
        
        for lyr in layers:
            y = lyr["y"]
            h = lyr["h"]
            box = patches.FancyBboxPatch((5.2, y), 41.5, h, boxstyle="round,pad=0.3,rounding_size=0.8",
                                         facecolor=lyr["color"], edgecolor=lyr["edge"], linewidth=1.5)
            ax.add_patch(box)
            ax.add_patch(patches.Circle((8.0, y + h - 3.2), 2.0, facecolor=lyr["edge"], edgecolor='none'))
            ax.text(8.0, y + h - 3.2, lyr["num"], color='black', fontsize=8.5, fontweight='bold', ha='center', va='center')
            ax.text(11.2, y + h - 3.2, lyr["title"], color=TEXT_LIGHT, fontsize=7.2, fontweight='bold', va='center')
            ax.text(6.8, y + 2.5, lyr["desc"], color=TEXT_MUTED, fontsize=6.5, va='bottom')
            
        for arrow_y in [65.5, 51.0, 35.0, 20.5]:
            ax.annotate('', xy=(26.0, arrow_y - 1.0), xytext=(26.0, arrow_y + 1.5),
                        arrowprops=dict(arrowstyle="->", color=ACCENT_GOLD, lw=1.5))
                         
        # ---------------------------------------------------------------------
        # RIGHT PANEL TOP: CÁLCULO DE ESPESORES & CORTE DE ELEVACIÓN
        # ---------------------------------------------------------------------
        panel_rt = patches.FancyBboxPatch((51.0, 43.0), 45.5, 43.5, boxstyle="round,pad=0.5,rounding_size=1",
                                          facecolor=CARD_BG, edgecolor=ACCENT_GOLD, linewidth=1.2)
        ax.add_patch(panel_rt)
        ax.text(73.75, 83.5, "CÁLCULO EXACTO DE ESPESORES (CARTULINA 200g)", color=ACCENT_GOLD, fontsize=10.5, fontweight='bold', ha='center')
        
        # Exact paper calculation badge
        calc_box = patches.FancyBboxPatch((53.0, 70.0), 41.5, 10.5, boxstyle="round,pad=0.3,rounding_size=0.8",
                                          facecolor='#0b1d16', edgecolor=GREEN_OK, linewidth=1.2)
        ax.add_patch(calc_box)
        ax.text(54.5, 78.0, "¿CUÁNTO OCUPAN 17 HOJAS DE 200g? -> ¡NO SON 9.5 mm!", color=GREEN_OK, fontsize=7.2, fontweight='bold')
        ax.text(54.5, 74.8, "• Calibre típico cartulina 200 g/m²: 0.22 a 0.24 mm por hoja.", color=TEXT_LIGHT, fontsize=6.5)
        ax.text(54.5, 71.8, "• 17 cartones x 0.24 mm = ~4.08 mm totales (apenas 4 mm!).", color='#fde047', fontsize=6.8, fontweight='bold')
        ax.text(54.5, 68.8, "• Hueco útil del depósito: 4.5 mm | Grosor total bandeja: 5.5 mm.", color=TEXT_LIGHT, fontsize=6.5)
        
        base_x = 54.0
        stack_w = 30.0
        cur_y = 47.0
        
        # 1. Base tray (1.2mm)
        h1 = 1.8
        ax.add_patch(patches.Rectangle((base_x, cur_y), stack_w, h1, facecolor='#0f172a', edgecolor=ACCENT_GOLD, lw=1.2))
        ax.text(base_x + stack_w/2, cur_y + h1/2, "1. Base Soporte (1.2 mm)", color=TEXT_LIGHT, fontsize=6.0, ha='center', va='center', fontweight='bold')
        ax.text(base_x + stack_w + 1.2, cur_y + h1/2, "1.2 mm", color=ACCENT_GOLD, fontsize=6.0, va='center')
        cur_y += h1
        
        # 2. Submarino 1 + Cubierta PLA (2.5mm)
        h2 = 3.6
        ax.add_patch(patches.Rectangle((base_x, cur_y), stack_w, h2, facecolor='#161e2e', edgecolor=IJN_RED, lw=1.5))
        for pk_x in [base_x + 2.5, base_x + 8.5, base_x + 14.5, base_x + 20.5, base_x + 25.5]:
            ax.add_patch(patches.Rectangle((pk_x, cur_y + 0.6), 4.2, 2.4, facecolor='#2a1215', edgecolor='#f87171', lw=0.8))
        ax.text(base_x + stack_w/2, cur_y + h2/2, "2. Submarino 1 + Cubierta PLA (Fichas)", color=TEXT_LIGHT, fontsize=6.0, ha='center', va='center', fontweight='bold')
        ax.text(base_x + stack_w + 1.2, cur_y + h2/2, "2.5 mm", color=IJN_RED, fontsize=6.0, va='center')
        cur_y += h2
        
        # 3. Depósito 16 Reservas (5.5mm con 4.5mm útil)
        h3 = 7.5
        ax.add_patch(patches.Rectangle((base_x, cur_y), stack_w, h3, facecolor='#1e2230', edgecolor='#ec4899', lw=1.5))
        for s_idx in range(6):
            s_y = cur_y + 1.0 + s_idx * 0.95
            ax.plot([base_x + 2, base_x + stack_w - 2], [s_y, s_y], color='#f472b6', lw=0.9, alpha=0.8)
        ax.add_patch(patches.Arc((base_x + 1.2, cur_y + h3/2), 2.2, 3.0, angle=0, theta1=270, theta2=90, color='#f472b6', lw=1.2))
        ax.text(base_x + stack_w/2, cur_y + h3/2, "3. Depósito 16 Submarinos Reserva (200g)\n(Espacio interior: 4.5 mm con uñeros)", 
                color=TEXT_LIGHT, fontsize=6.0, ha='center', va='center', fontweight='bold')
        ax.text(base_x + stack_w + 1.2, cur_y + h3/2, "5.5 mm", color='#ec4899', fontsize=6.0, va='center')
        cur_y += h3
        
        # 4. Submarino 2 + 2ª Cubierta PLA (2.5mm)
        h4 = 3.6
        ax.add_patch(patches.Rectangle((base_x, cur_y), stack_w, h4, facecolor='#161e2e', edgecolor=IJN_RED, lw=1.5))
        for pk_x in [base_x + 2.5, base_x + 8.5, base_x + 14.5, base_x + 20.5, base_x + 25.5]:
            ax.add_patch(patches.Rectangle((pk_x, cur_y + 0.6), 4.2, 2.4, facecolor='#2a1215', edgecolor='#f87171', lw=0.8))
        ax.text(base_x + stack_w/2, cur_y + h4/2, "4. Submarino 2 + 2ª Cubierta PLA (Fichas)", color=TEXT_LIGHT, fontsize=6.0, ha='center', va='center', fontweight='bold')
        ax.text(base_x + stack_w + 1.2, cur_y + h4/2, "2.5 mm", color=IJN_RED, fontsize=6.0, va='center')
        cur_y += h4
        
        # 5. Tapa Rejilla Save-Game (2.8mm)
        h5 = 3.6
        ax.add_patch(patches.Rectangle((base_x, cur_y), stack_w, h5, facecolor='#1e293b', edgecolor='#f59e0b', lw=1.5))
        for mx in range(int(base_x + 2), int(base_x + stack_w - 2), 4):
            ax.plot([mx, mx + 2], [cur_y, cur_y + h5], color='#f59e0b', lw=0.8, alpha=0.7)
            ax.plot([mx + 2, mx], [cur_y, cur_y + h5], color='#f59e0b', lw=0.8, alpha=0.7)
        ax.text(base_x + stack_w/2, cur_y + h5/2, "5. Tapa Rejilla Save-Game", color=TEXT_LIGHT, fontsize=6.0, ha='center', va='center', fontweight='bold')
        ax.text(base_x + stack_w + 1.2, cur_y + h5/2, "2.8 mm", color='#f59e0b', fontsize=6.0, va='center')
        cur_y += h5
        
        # Dimension Line on Right
        dim_x = base_x + stack_w + 7.5
        ax.plot([dim_x, dim_x], [47.0, cur_y], color=ACCENT_GOLD, lw=1.5)
        ax.plot([dim_x - 0.8, dim_x + 0.8], [47.0, 47.0], color=ACCENT_GOLD, lw=1.5)
        ax.plot([dim_x - 0.8, dim_x + 0.8], [cur_y, cur_y], color=ACCENT_GOLD, lw=1.5)
        ax.text(dim_x + 1.2, (47.0 + cur_y)/2, "ALTURA\nTOTAL:\n~14.5 mm", color=ACCENT_GOLD, fontsize=6.5, fontweight='bold', va='center')
        
        # ---------------------------------------------------------------------
        # RIGHT PANEL BOTTOM: INTEGRACIÓN EN CAJA & BENEFICIOS
        # ---------------------------------------------------------------------
        panel_rb = patches.FancyBboxPatch((51.0, 5.0), 45.5, 36.5, boxstyle="round,pad=0.5,rounding_size=1",
                                          facecolor=CARD_BG, edgecolor=ACCENT_GOLD, linewidth=1.2)
        ax.add_patch(panel_rb)
        ax.text(73.75, 38.5, "VENTAJAS DEL SISTEMA DUAL EN CAJA DE 55 mm", color=ACCENT_GOLD, fontsize=10.5, fontweight='bold', ha='center')
        
        features = [
            ("1. Solo 14.5 mm de Altura Total:", "Ocupa apenas el 26% de la altura de la caja (deja 40.5 mm libres)."),
            ("2. Dos Submarinos Simultáneos:", "Permite jugar misiones históricas con 2 submarinos activos con fichas."),
            ("3. Uñeros Ergonómicos:", "Bandeja depósito de 5.5 mm con 2 uñeros (R=12 mm) para sacar cartones."),
            ("4. Persistencia Total (Save-State):", "La Tapa Rejilla superior sella todo el sándwich con goma elástica en cruz."),
            ("5. Espacio de Sobra en la Caja:", "Las 4 bandejas apiladas de fichas (28 mm) caben al lado con +12 mm libres.")
        ]
        
        f_y = 35.0
        for f_title, f_desc in features:
            ax.text(53.0, f_y, f_title, color=ACCENT_GOLD, fontsize=6.8, fontweight='bold')
            ax.text(53.0, f_y - 2.1, f_desc, color=TEXT_MUTED, fontsize=6.0)
            f_y -= 5.1
            
        pdf.savefig(fig)
        fig.savefig(os.path.join(PREV_DIR, "preview_sistema_sandwich_18_submarinos.jpg"), dpi=150)
        plt.close(fig)
        
    print(f"Exported Blueprint PDF: {pdf_path}")
    print(f"Exported Preview Image: {os.path.join(PREV_DIR, 'preview_sistema_sandwich_18_submarinos.jpg')}")
    return pdf_path

if __name__ == "__main__":
    create_sandwich_blueprint()
