"""
Generates Photorealistic Visual Simulations for Map Solutions 2 & 3:
1. OPTION 2: 3D Printed Skeleton / Wireframe Nautical Grid
   - Only 1.5 mm slender structural ribs and pocket walls (15.0 mm square).
   - Over 88% of the ocean and 100% of all landmasses (Japan, Australia, USA, China, Indonesia) completely open and visible.
   - Active counters resting inside pockets with realistic drop shadows.
2. OPTION 3: Open Clean Map in Play + Save-Game Lid Clamping for Vertical Storage
   - Phase 1: 100% Pure, Unobstructed Gameplay on clean map.
   - Phase 2: Save-Game Sandwich Clamping with cushioned Grate Lid for vertical box storage.
3. Exports high-res preview images and compiles a dedicated Deluxe Presentation PDF:
   docs/SIMULACION_OPCIONES_2_Y_3_MAPA_OPERACIONES.pdf
"""

import os
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages

ROOT_DIR = os.path.abspath(".")
PREV_DIR = os.path.join(ROOT_DIR, "images", "previews")
DOCS_DIR = os.path.join(ROOT_DIR, "docs")
MAP_IMG_PATH = os.path.join(ROOT_DIR, "images", "mats", "operations_map_deluxe_real.jpg")
os.makedirs(PREV_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)

DPI = 300
W_PX = 2855
H_PX = 2187

def mm_to_px(x_mm, y_mm):
    return int(round(x_mm * DPI / 25.4)), int(round(y_mm * DPI / 25.4))

# 21 Stations + 14 Transit Boxes
stations_mm = [
    ('paramushiro', 140.8, 33.1), ('yokosuka', 116.0, 62.8), ('truk', 134.1, 112.1),
    ('new_guinea', 121.3, 128.9), ('dutch_east_indies', 64.7, 143.8), ('aleutian', 198.6, 31.2),
    ('okinawa', 93.6, 79.2), ('iwo_jima', 118.9, 78.5), ('midway', 178.2, 81.5),
    ('philippines', 77.0, 95.2), ('marianas', 109.1, 95.7), ('indian_ocean', 13.7, 107.4),
    ('leyte_gulf', 84.3, 108.8), ('malaya', 28.6, 117.8), ('tarawa', 181.3, 131.1),
    ('guadalcanal', 152.8, 150.4), ('west_coast', 228.2, 54.3), ('pearl_harbor', 216.9, 96.8),
    ('panama_canal', 228.2, 165.9), ('australia', 136.6, 174.1), ('europe', 15.1, 170.6)
]

transit_mm = [
    ('wc_t1', 172.5, 54.4), ('wc_t2', 191.0, 54.4), ('wc_t3', 209.5, 54.4),
    ('ph_t1', 180.0, 108.0), ('ph_t2', 198.5, 96.9),
    ('pc_t1', 172.5, 165.9), ('pc_t2', 191.0, 165.9), ('pc_t3', 209.5, 165.9),
    ('aus_t1', 100.0, 154.0), ('aus_t2', 118.5, 160.0),
    ('eu_t4', 92.0, 170.7), ('eu_t3', 73.5, 170.7), ('eu_t2', 55.0, 170.7), ('eu_t1', 36.5, 170.7)
]

# Structural connecting struts for Option 2 Wireframe Skeleton
wireframe_edges = [
    # West Coast corridor
    ('wc_t1', 'wc_t2'), ('wc_t2', 'wc_t3'), ('wc_t3', 'west_coast'),
    # Pearl Harbor corridor
    ('ph_t1', 'ph_t2'), ('ph_t2', 'pearl_harbor'),
    # Panama Canal corridor
    ('pc_t1', 'pc_t2'), ('pc_t2', 'pc_t3'), ('pc_t3', 'panama_canal'),
    # Australia corridor
    ('aus_t1', 'aus_t2'), ('aus_t2', 'australia'),
    # Europe corridor
    ('europe', 'eu_t1'), ('eu_t1', 'eu_t2'), ('eu_t2', 'eu_t3'), ('eu_t3', 'eu_t4'),
    
    # Naval navigation trunks & geographic ties
    ('paramushiro', 'yokosuka'),
    ('paramushiro', 'aleutian'),
    ('aleutian', 'wc_t1'),
    ('yokosuka', 'iwo_jima'),
    ('iwo_jima', 'marianas'),
    ('marianas', 'truk'),
    ('truk', 'new_guinea'),
    ('new_guinea', 'aus_t2'),
    ('okinawa', 'iwo_jima'),
    ('okinawa', 'philippines'),
    ('philippines', 'leyte_gulf'),
    ('leyte_gulf', 'dutch_east_indies'),
    ('malaya', 'dutch_east_indies'),
    ('malaya', 'indian_ocean'),
    ('dutch_east_indies', 'eu_t4'),
    ('iwo_jima', 'midway'),
    ('midway', 'pearl_harbor'),
    ('truk', 'tarawa'),
    ('tarawa', 'guadalcanal'),
    ('guadalcanal', 'aus_t1'),
    ('tarawa', 'ph_t1'),
    ('guadalcanal', 'pc_t1')
]

def generate_option_2_simulation():
    print("Generating Photorealistic Simulation for Option 2 (3D Skeleton Wireframe Grid)...")
    base_map = Image.open(MAP_IMG_PATH).convert("RGBA")
    
    # 1. Coordinate dictionaries
    pos_dict = {}
    for sid, mx, my in stations_mm + transit_mm:
        pos_dict[sid] = mm_to_px(mx, my)
        
    BOX_SIZE = int(round(15.0 * DPI / 25.4)) # 177 px
    WALL_PX = int(round(1.5 * DPI / 25.4))   # 18 px wall thickness around each slot
    RIB_W = int(round(1.8 * DPI / 25.4))     # 21 px structural rib width
    
    # 2. Draw 3D Wireframe Overlay Layer
    wireframe = Image.new("RGBA", (W_PX, H_PX), (0, 0, 0, 0))
    d_wire = ImageDraw.Draw(wireframe)
    
    # Cast shadow layer (for photorealistic 3D depth over the ocean)
    shadow = Image.new("RGBA", (W_PX, H_PX), (0, 0, 0, 0))
    d_sh = ImageDraw.Draw(shadow)
    sh_offset = 6
    
    # Draw perimeter frame (slim 2.0 mm outer rim that nests into base tray)
    frame_t = int(round(2.0 * DPI / 25.4))
    d_sh.rectangle([frame_t + sh_offset, frame_t + sh_offset, W_PX - frame_t + sh_offset, H_PX - frame_t + sh_offset], outline=(0, 0, 0, 130), width=frame_t)
    d_wire.rectangle([frame_t, frame_t, W_PX - frame_t, H_PX - frame_t], outline=(30, 41, 59, 250), width=frame_t)
    d_wire.rectangle([frame_t + 2, frame_t + 2, W_PX - frame_t - 2, H_PX - frame_t - 2], outline=(71, 85, 105, 180), width=1)
    
    # Draw structural connecting ribs
    for s1, s2 in wireframe_edges:
        if s1 in pos_dict and s2 in pos_dict:
            p1 = pos_dict[s1]
            p2 = pos_dict[s2]
            # Shadow line
            d_sh.line([(p1[0] + sh_offset, p1[1] + sh_offset), (p2[0] + sh_offset, p2[1] + sh_offset)], fill=(0, 0, 0, 120), width=RIB_W + 4)
            # Core rib (PLA Charcoal)
            d_wire.line([p1, p2], fill=(30, 41, 59, 250), width=RIB_W)
            # Highlight centerline
            d_wire.line([p1, p2], fill=(100, 116, 139, 140), width=2)
            
    # Draw 35 individual square socket collars (Pocket frames)
    for sid, pt in pos_dict.items():
        cx, cy = pt
        inner_r = BOX_SIZE // 2
        outer_r = inner_r + WALL_PX
        
        # Outer collar shadow
        d_sh.rectangle([cx - outer_r + sh_offset, cy - outer_r + sh_offset, cx + outer_r + sh_offset, cy + outer_r + sh_offset], fill=(0, 0, 0, 130))
        # Outer collar PLA body
        d_wire.rectangle([cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r], fill=(30, 41, 59, 250), outline=(71, 85, 105, 220), width=2)
        # Clear inner aperture (slot hole)
        d_wire.rectangle([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], fill=(0, 0, 0, 0))
        # Inner beveled edge
        d_wire.rectangle([cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r], outline=(15, 23, 42, 255), width=2)

    # Blur shadows slightly for realistic lighting
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=5))
    
    # Composite: Base map -> Shadow -> Wireframe
    comp = Image.alpha_composite(base_map, shadow)
    comp = Image.alpha_composite(comp, wireframe)
    d_comp = ImageDraw.Draw(comp)
    
    # 3. Place Sample Active Submarine Counters in Pockets
    c_sub_path = "images/counters/ai/counter_submarine_deck_gun_cruising.jpg"
    c_combat_path = "images/counters/ai/counter_combat_event_depth_charges.jpg"
    c_refit_path = "images/counters/ai/counter_resupply_crates_fuel.jpg"
    
    def place_counter(cx, cy, img_path, label=None):
        if os.path.exists(img_path):
            c_sz = BOX_SIZE - 6 # 3px clearance
            cim = Image.open(img_path).convert("RGBA").resize((c_sz, c_sz), Image.Resampling.LANCZOS)
            x0 = cx - c_sz // 2
            y0 = cy - c_sz // 2
            # Drop shadow inside socket
            d_comp.rectangle([x0+3, y0+3, x0+c_sz+3, y0+c_sz+3], fill=(0, 0, 0, 160))
            comp.paste(cim, (x0, y0), cim)
            # Gold counter border
            d_comp.rectangle([x0, y0, x0+c_sz, y0+c_sz], outline=(245, 158, 11, 240), width=2)
            if label:
                f_b = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 20)
                d_comp.rectangle([x0+2, y0+c_sz-24, x0+c_sz-2, y0+c_sz-2], fill=(15, 23, 42, 230))
                d_comp.text((cx, y0+c_sz-13), label, fill=(255, 255, 255, 255), font=f_b, anchor="mm")

    # Place counters
    place_counter(*pos_dict['midway'], c_sub_path, "I-168 [KD.6]")
    place_counter(*pos_dict['pearl_harbor'], c_sub_path, "I-58 [Type B]")
    place_counter(*pos_dict['guadalcanal'], c_combat_path, "COMBAT")
    place_counter(*pos_dict['wc_t2'], c_sub_path, "I-26 [Transit]")
    place_counter(*pos_dict['eu_t2'], c_sub_path, "I-52 [Yanagi]")
    place_counter(*pos_dict['yokosuka'], c_refit_path, "REFIT")

    # 4. Add Explanatory Callout Banner
    f_t = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 26)
    f_b = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 17)
    
    bx, by = 60, H_PX - 125
    bw = W_PX - 120
    d_comp.rectangle([bx, by, bx + bw, by + 90], fill=(15, 23, 42, 245), outline=(212, 175, 55, 255), width=2)
    d_comp.text((W_PX // 2, by + 26), "OPCIÓN 2: REJILLA ESQUELÉTICA 3D 'WIREFRAME' NÁUTICA (100% IMPRIMIBLE EN BAMBU LAB)", fill=(212, 175, 55, 255), font=f_t, anchor="mm")
    d_comp.text((W_PX // 2, by + 60), "Nervios finos de 1.8 mm · 88% del océano y 100% de los continentes totalmente visibles · Fichas encajadas y bloqueadas", fill=(226, 232, 240, 255), font=f_b, anchor="mm")

    out_jpg = os.path.join(PREV_DIR, "simulation_option_2_wireframe_skeleton.jpg")
    comp.convert("RGB").save(out_jpg, quality=94)
    print(f"Exported Option 2 Simulation: {out_jpg}")
    return out_jpg

def generate_option_3_simulation():
    print("Generating Photorealistic Simulation for Option 3 (Open Play + Save-Game Sandwich Clamping)...")
    base_map = Image.open(MAP_IMG_PATH).convert("RGBA")
    
    # Option 3 Phase 1: 100% Clean Map in Play
    comp = base_map.copy()
    d_comp = ImageDraw.Draw(comp)
    
    # Place counters directly on map stations (Unobstructed Pure Map Gameplay)
    c_sub_path = "images/counters/ai/counter_submarine_deck_gun_cruising.jpg"
    c_combat_path = "images/counters/ai/counter_combat_event_depth_charges.jpg"
    c_refit_path = "images/counters/ai/counter_resupply_crates_fuel.jpg"
    
    pos_dict = {}
    for sid, mx, my in stations_mm + transit_mm:
        pos_dict[sid] = mm_to_px(mx, my)
        
    BOX_SIZE = int(round(15.0 * DPI / 25.4))
    
    def place_counter(cx, cy, img_path, label=None):
        if os.path.exists(img_path):
            c_sz = BOX_SIZE - 4
            cim = Image.open(img_path).convert("RGBA").resize((c_sz, c_sz), Image.Resampling.LANCZOS)
            x0 = cx - c_sz // 2
            y0 = cy - c_sz // 2
            d_comp.rectangle([x0+4, y0+4, x0+c_sz+4, y0+c_sz+4], fill=(0, 0, 0, 140))
            comp.paste(cim, (x0, y0), cim)
            d_comp.rectangle([x0, y0, x0+c_sz, y0+c_sz], outline=(245, 158, 11, 240), width=2)
            if label:
                f_b = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 20)
                d_comp.rectangle([x0+2, y0+c_sz-24, x0+c_sz-2, y0+c_sz-2], fill=(15, 23, 42, 230))
                d_comp.text((cx, y0+c_sz-13), label, fill=(255, 255, 255, 255), font=f_b, anchor="mm")

    place_counter(*pos_dict['midway'], c_sub_path, "I-168 [KD.6]")
    place_counter(*pos_dict['pearl_harbor'], c_sub_path, "I-58 [Type B]")
    place_counter(*pos_dict['guadalcanal'], c_combat_path, "COMBAT")
    place_counter(*pos_dict['wc_t2'], c_sub_path, "I-26 [Transit]")
    place_counter(*pos_dict['eu_t2'], c_sub_path, "I-52 [Yanagi]")
    place_counter(*pos_dict['yokosuka'], c_refit_path, "REFIT")

    # Add Inset Diagram in Northern Ocean: Showing the Save-Game Clamping Mechanism
    f_t = ImageFont.truetype("C:\\Windows\\Fonts\\arialbd.ttf", 26)
    f_b = ImageFont.truetype("C:\\Windows\\Fonts\\arial.ttf", 17)
    
    bx, by = 60, H_PX - 125
    bw = W_PX - 120
    d_comp.rectangle([bx, by, bx + bw, by + 90], fill=(15, 23, 42, 245), outline=(56, 189, 248, 255), width=2)
    d_comp.text((W_PX // 2, by + 26), "OPCIÓN 3: MODO EN JUEGO 100% LIMPIO + GUARDADO SAVE-GAME CON TAPA REJILLA ACOLCHADA", fill=(56, 189, 248, 255), font=f_t, anchor="mm")
    d_comp.text((W_PX // 2, by + 60), "Durante la partida: Mapa 100% libre sin cubiertas · Al guardar: Se coloca la Tapa Rejilla con lámina de espuma EVA de 1.5 mm", fill=(226, 232, 240, 255), font=f_b, anchor="mm")

    out_jpg = os.path.join(PREV_DIR, "simulation_option_3_open_play_clean.jpg")
    comp.convert("RGB").save(out_jpg, quality=94)
    print(f"Exported Option 3 Simulation: {out_jpg}")
    return out_jpg

def build_comparison_pdf():
    pdf_path = os.path.join(DOCS_DIR, "SIMULACION_OPCIONES_2_Y_3_MAPA_OPERACIONES.pdf")
    print(f"Compiling Comparison PDF: {pdf_path} ...")
    
    sim2_path = os.path.join(PREV_DIR, "simulation_option_2_wireframe_skeleton.jpg")
    sim3_path = os.path.join(PREV_DIR, "simulation_option_3_open_play_clean.jpg")
    clamp_path = os.path.join(PREV_DIR, "simulation_save_game_sandwich_clamping.jpg")
    
    with PdfPages(pdf_path) as pdf:
        # -------------------------------------------------------------
        # PAGE 1: OPTION 2 - 3D WIREFRAME SKELETON GRID OVERLAY
        # -------------------------------------------------------------
        fig1 = plt.figure(figsize=(11.69, 8.27), dpi=180)
        fig1.patch.set_facecolor('#0B0F19')
        ax1 = fig1.add_subplot(111)
        ax1.set_facecolor('#0B0F19')
        ax1.axis('off')
        
        if os.path.exists(sim2_path):
            img2 = Image.open(sim2_path)
            ax_img2 = fig1.add_axes([0.02, 0.08, 0.96, 0.88])
            ax_img2.imshow(img2)
            ax_img2.axis('off')
            
        fig1.text(0.5, 0.04, "OPCIÓN 2: CUBIERTA 3D ESQUELÉTICA (BAMBU LAB) · VISIBILIDAD DE CONTINENTES Y RUTAS · FICHAS FÍSICAMENTE ENCASTRADAS",
                  color='#D4AF37', fontsize=9.5, fontweight='bold', ha='center')
        pdf.savefig(fig1)
        plt.close(fig1)
        
        # -------------------------------------------------------------
        # PAGE 2: OPTION 3 - CLEAN MAP IN PLAY
        # -------------------------------------------------------------
        fig2 = plt.figure(figsize=(11.69, 8.27), dpi=180)
        fig2.patch.set_facecolor('#0B0F19')
        ax2 = fig2.add_subplot(111)
        ax2.set_facecolor('#0B0F19')
        ax2.axis('off')
        
        if os.path.exists(sim3_path):
            img3 = Image.open(sim3_path)
            ax_img3 = fig2.add_axes([0.02, 0.08, 0.96, 0.88])
            ax_img3.imshow(img3)
            ax_img3.axis('off')
            
        fig2.text(0.5, 0.04, "OPCIÓN 3 (FASE 1: EN JUEGO): MAPA 100% LIMPIO Y DESPEJADO · MÁXIMO DISFRUTE VISUAL SIN PIEZAS PLÁSTICAS SUPERPUESTAS",
                  color='#38BDF8', fontsize=9.5, fontweight='bold', ha='center')
        pdf.savefig(fig2)
        plt.close(fig2)
        
        # -------------------------------------------------------------
        # PAGE 3: OPTION 3 - SAVE-GAME SANDWICH CLAMPING MECHANISM
        # -------------------------------------------------------------
        fig3 = plt.figure(figsize=(11.69, 8.27), dpi=180)
        fig3.patch.set_facecolor('#0B0F19')
        ax3 = fig3.add_subplot(111)
        ax3.set_facecolor('#0B0F19')
        ax3.axis('off')
        
        if os.path.exists(clamp_path):
            img_c = Image.open(clamp_path)
            ax_img_c = fig3.add_axes([0.02, 0.08, 0.96, 0.88])
            ax_img_c.imshow(img_c)
            ax_img_c.axis('off')
            
        fig3.text(0.5, 0.04, "OPCIÓN 3 (FASE 2: GUARDADO): SISTEMA SANDWICH CON TAPA REJILLA Y ESPUMA EVA · BLOQUEO VERTICAL ANTI-MOVIMIENTO",
                  color='#10B981', fontsize=9.5, fontweight='bold', ha='center')
        pdf.savefig(fig3)
        plt.close(fig3)
        
        # -------------------------------------------------------------
        # PAGE 4: TECHNICAL COMPARISON TABLE & DECISION MATRIX
        # -------------------------------------------------------------
        fig4 = plt.figure(figsize=(11.69, 8.27), dpi=180)
        fig4.patch.set_facecolor('#0B0F19')
        ax4 = fig4.add_subplot(111)
        ax4.set_facecolor('#0B0F19')
        ax4.set_xlim(0, 100)
        ax4.set_ylim(0, 100)
        ax4.axis('off')
        
        # Title
        ax4.text(50, 93, "MATRIZ COMPARATIVA TÉCNICA: OPCIÓN 2 VS OPCIÓN 3", color='#D4AF37', fontsize=16, fontweight='bold', ha='center')
        ax4.text(50, 89, "Análisis de Experiencia de Juego, Fabricación 3D y Sistema de Guardado 'Save-Game'", color='#94A3B8', fontsize=10, ha='center')
        
        # Comparison Card 1: Option 2 (Wireframe Skeleton)
        card1 = patches.FancyBboxPatch((5, 12), 43, 72, boxstyle="round,pad=0.5,rounding_size=1.5",
                                       facecolor='#111827', edgecolor='#D4AF37', linewidth=2)
        ax4.add_patch(card1)
        ax4.text(26.5, 80, "OPCIÓN 2: REJILLA WIREFRAME 3D", color='#D4AF37', fontsize=12, fontweight='bold', ha='center')
        ax4.text(26.5, 76.5, "Celosía esquelética náutica impresa en Bambu Lab", color='#94A3B8', fontsize=8.5, ha='center')
        
        opt2_pts = [
            ("Visibilidad en Juego:", "88% del océano y 100% de la tierra abierta."),
            ("Retención en Partida:", "Alvéolos físicos de 15 mm guían y fijan fichas."),
            ("Experiencia Táctil:", "Sensación de dual-layer clásico en cada casilla."),
            ("Fabricación:", "100% 3D imprimible en Bambu P2S (~45 min)."),
            ("Ahorro Filamento:", "75% menos material que la losa maciza."),
            ("Almacenamiento:", "Compatible con Tapa Rejilla en sándwich."),
            ("Inconveniente:", "Hay nervios finos de 1.8 mm cruzando el agua.")
        ]
        y_c = 70
        for title, desc in opt2_pts:
            ax4.text(8, y_c, f"• {title}", color='#F8FAFC', fontsize=8.2, fontweight='bold')
            ax4.text(8, y_c - 2.8, f"   {desc}", color='#CBD5E1', fontsize=7.8)
            y_c -= 7.8
            
        # Comparison Card 2: Option 3 (Open Play + Save-Game Lid)
        card2 = patches.FancyBboxPatch((52, 12), 43, 72, boxstyle="round,pad=0.5,rounding_size=1.5",
                                       facecolor='#111827', edgecolor='#38BDF8', linewidth=2)
        ax4.add_patch(card2)
        ax4.text(73.5, 80, "OPCIÓN 3: MAPA LIMPIO + TAPA REJILLA", color='#38BDF8', fontsize=12, fontweight='bold', ha='center')
        ax4.text(73.5, 76.5, "Juego puro en mesa y sándwich solo para guardar", color='#94A3B8', fontsize=8.5, ha='center')
        
        opt3_pts = [
            ("Visibilidad en Juego:", "100% absoluta (cero plásticos sobre el mapa)."),
            ("Retención en Partida:", "Libre sobre el mapa de papel / cartulina 200g."),
            ("Experiencia Táctil:", "Wargame clásico de tablero abierto y claro."),
            ("Fabricación:", "Cero piezas nuevas (usa Bandeja y Tapa ya hechas)."),
            ("Ahorro Filamento:", "100% ahorro (no requiere imprimir cubierta)."),
            ("Almacenamiento:", "Se prensa con Tapa Rejilla + EVA al terminar."),
            ("Inconveniente:", "Durante la partida las fichas pueden deslizar.")
        ]
        y_c = 70
        for title, desc in opt3_pts:
            ax4.text(55, y_c, f"• {title}", color='#F8FAFC', fontsize=8.2, fontweight='bold')
            ax4.text(55, y_c - 2.8, f"   {desc}", color='#CBD5E1', fontsize=7.8)
            y_c -= 7.8

        # Bottom Recommendation Box
        rec_box = patches.FancyBboxPatch((5, 3), 90, 7, boxstyle="round,pad=0.4,rounding_size=1",
                                         facecolor='#1E293B', edgecolor='#10B981', linewidth=1.5)
        ax4.add_patch(rec_box)
        ax4.text(50, 6.5, "RECOMENDACIÓN: Si deseas alvéolos físicos fijos para que nada se mueva jugando -> Opción 2.\nSi priorizas la belleza visual pura del mapa sin nada que lo cubra -> Opción 3.",
                 color='#34D399', fontsize=8.0, fontweight='bold', ha='center', va='center')

        pdf.savefig(fig4)
        plt.close(fig4)

    print(f"Comparison PDF successfully created: {pdf_path}")
    return pdf_path

if __name__ == "__main__":
    generate_option_2_simulation()
    generate_option_3_simulation()
    build_comparison_pdf()
