"""
Master Dossier PDF Generator for Sensuikan Deluxification & Save-State System
Compiles all engineering blueprints, unified mats, box packing diagrams,
modular caddy, save-game grate lids, and real physical photos into an 8-page
executive technical dossier.
Uses the ACTUAL, FROZEN, AND VERIFIED Submarine Sheet (Kaidai KD3 Class).
"""

import os
import sys
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.backends.backend_pdf import PdfPages

DOCS_DIR = os.path.abspath("docs")
PREV_DIR = os.path.abspath("images/previews")
MEDIA_DIR = os.path.abspath(r"C:\Users\Richard\.gemini\antigravity\brain\18446ce2-bf5f-4871-953f-de7abe125628\.user_uploaded")
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)

PDF_OUT = os.path.join(DOCS_DIR, "DOSSIER_DISENO_COMPLETO_SENSUIKAN_DELUXE.pdf")
try:
    if os.path.exists(PDF_OUT):
        with open(PDF_OUT, "a"):
            pass
except Exception:
    PDF_OUT = os.path.join(DOCS_DIR, "DOSSIER_DISENO_COMPLETO_SENSUIKAN_DELUXE_ACTUALIZADO.pdf")

# Visual Palette
DARK_NAVY = '#141c2b'
DARK_CARD = '#1e2638'
ACCENT_GOLD = '#d4af37'
IJN_RED = '#b22222'
STEEL_GRAY = '#4a5568'
LIGHT_TEXT = '#f7fafc'
GRID_CYAN = '#38b2ac'
GREEN_ACC = '#38a169'

def create_dossier():
    print(f"Generating Master Design Dossier PDF: {PDF_OUT} ...")
    
    with PdfPages(PDF_OUT) as pdf:
        
        # =========================================================================
        # PAGE 1: PORTADA & RESUMEN EJECUTIVO
        # =========================================================================
        print("Page 1: Cover & Executive Overview...")
        fig1 = plt.figure(figsize=(11.69, 8.27), dpi=150) # A4 Landscape
        fig1.patch.set_facecolor(DARK_NAVY)
        ax = fig1.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        # Header banner
        header_rect = patches.Rectangle((0, 82), 100, 18, facecolor='#0d131f', edgecolor=ACCENT_GOLD, linewidth=2)
        ax.add_patch(header_rect)
        ax.text(50, 93, "SENSUÍKAN: FLEET SUBMARINES IN WWII", color=ACCENT_GOLD, fontsize=18, fontweight='bold', ha='center', va='center')
        ax.text(50, 86, "SISTEMA INTEGRAL DE DELUXIFICACIÓN & GUARDADO DE PARTIDA (SAVE-GAME STATE)", color='white', fontsize=11, ha='center', va='center')
        
        # Left column: Specs & Inventory
        spec_box = patches.FancyBboxPatch((3, 6), 44, 73, boxstyle="round,pad=0.5,rounding_size=1.5",
                                          facecolor=DARK_CARD, edgecolor=STEEL_GRAY, linewidth=1.5)
        ax.add_patch(spec_box)
        ax.text(25, 75, "ESPECIFICACIONES DEL PROYECTO", color=ACCENT_GOLD, fontsize=12, fontweight='bold', ha='center')
        
        specs_text = (
            "• Caja Objetivo: Compass Games Estándar (298 x 234 x 55 mm)\n"
            "• Impresora 3D: Cama 256 x 256 mm (Bambu Lab P1S/X1C/A1)\n"
            "• Huella Unificada Tableros: 241.7 x 185.2 mm (100% encastrable)\n"
            "• Almacenamiento Fichas: 4 Bandejas Rejilla 10 filas (215 x 145 mm)\n"
            "• Cartas: Caddy dedicado para cartas enfundadas (72 x 98 mm)\n"
            "• Dados: Compartimento integrado para 1d10 + 4d6 (36 x 98 mm)\n"
            "• Tapas Save-Game: Rejilla diamante con resbalones de esquina\n"
            "• Retención: Sistema de gomas elásticas en cruz"
        )
        ax.text(5, 59, specs_text, color=LIGHT_TEXT, fontsize=9, va='top', linespacing=1.6)
        
        ax.text(25, 34, "COMPONENTES DISEÑADOS & LISTOS", color=ACCENT_GOLD, fontsize=10, fontweight='bold', ha='center')
        comp_summary = (
            "1. Tablero Base Universal Monolítico STL (241.7 x 185.2 mm)\n"
            "2. Overlay Dual-Layer con Texto 3D en Relieve (Sin rendijas frágiles)\n"
            "3. Tapa Rejilla Save-Game con Resbalones de Esquina STL\n"
            "4. Caddy Modular de Cartas Enfundadas y Dados STL + Tapa Rejilla\n"
            "5. Plantilla Vectorial Remasterizada: Operations Map 1:1\n"
            "6. Plantilla Vectorial Remasterizada: Attack Mat [H1] 1:1\n"
            "7. Set Completo de 40 Fichas IA Fotorrealistas Remasterizadas"
        )
        ax.text(5, 31, comp_summary, color='#cbd5e0', fontsize=8, va='top', linespacing=1.5)
        
        # Right column: Physical Print Photos Showcase
        photo_box = patches.FancyBboxPatch((50, 6), 47, 73, boxstyle="round,pad=0.5,rounding_size=1.5",
                                           facecolor=DARK_CARD, edgecolor=ACCENT_GOLD, linewidth=1.5)
        ax.add_patch(photo_box)
        ax.text(73.5, 75, "VERIFICACIÓN FÍSICA EN CAJA REAL", color=ACCENT_GOLD, fontsize=12, fontweight='bold', ha='center')
        
        photo_sub_path = os.path.join(MEDIA_DIR, "media_1794130376146_cbc2e02f.jpg")
        if os.path.exists(photo_sub_path):
            img_sub = Image.open(photo_sub_path)
            ax_img1 = fig1.add_axes([0.52, 0.40, 0.43, 0.38])
            ax_img1.imshow(img_sub)
            ax_img1.axis('off')
            ax_img1.set_title("Tablero Submarino impreso con fichas IA dentro de la caja Compass", color='white', fontsize=8, pad=3)
            
        photo_box_path = os.path.join(MEDIA_DIR, "media_1794130292692_c6f6d246.jpg")
        if os.path.exists(photo_box_path):
            img_trays = Image.open(photo_box_path)
            ax_img2 = fig1.add_axes([0.52, 0.10, 0.43, 0.27])
            ax_img2.imshow(img_trays)
            ax_img2.axis('off')
            ax_img2.set_title("Disposición actual: 4 bandejas apiladas con goma en la mitad de la caja", color='white', fontsize=8, pad=3)
            
        pdf.savefig(fig1)
        fig1.savefig(os.path.join(PREV_DIR, "dossier_page_1_portada.jpg"), dpi=150)
        plt.close(fig1)
        
        # =========================================================================
        # PAGE 2: DISPOSICIÓN INTEGRAL DE LA CAJA COMPASS (PLAN DE EMPAQUE)
        # =========================================================================
        print("Page 2: Box Organization & Packing Blueprint...")
        fig2 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig2.patch.set_facecolor(DARK_NAVY)
        ax = fig2.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        ax.text(50, 95, "PLAN DE INTEGRACIÓN & DISPOSICIÓN EN CAJA COMPASS GAMES", color=ACCENT_GOLD, fontsize=15, fontweight='bold', ha='center')
        ax.text(50, 91, "Caja Interior: 298 x 234 x 55 mm | Distribución en 2 Niveles Verticales con Cierre a Ras", color='white', fontsize=9.5, ha='center')
        
        # Left: Layer 1
        box_l = patches.FancyBboxPatch((3, 30), 45, 58, boxstyle="round,pad=0.5,rounding_size=1", facecolor='#111622', edgecolor=ACCENT_GOLD, linewidth=1.5)
        ax.add_patch(box_l)
        ax.text(25.5, 84, "CAPA 1: FONDO DE CAJA (SAVE-GAME BOARDS)", color=ACCENT_GOLD, fontsize=10, fontweight='bold', ha='center')
        
        ax.add_patch(patches.Rectangle((6, 33), 39, 48, facecolor='#1a202c', edgecolor='#888', linestyle='--', linewidth=1))
        ax.add_patch(patches.Rectangle((7, 34), 31.5, 38, facecolor='#2d3748', edgecolor=GRID_CYAN, linewidth=1.5))
        ax.text(22.7, 53, "3 TABLEROS APILADOS\n(241.7 x 185.2 mm)\n• Tablero Submarino\n• Attack Mat [H1]\n• Operations Map\n+ Tapa Rejilla Save-Game",
                color='white', fontsize=7.5, ha='center', va='center', fontweight='bold')
        ax.add_patch(patches.Rectangle((39.5, 34), 4.5, 38, facecolor='#232a3b', edgecolor='#555', linestyle=':'))
        ax.text(41.7, 53, "Canal Lateral\n(41 mm)", color='#a0aec0', fontsize=6.5, ha='center', va='center', rotation=-90)
        ax.add_patch(patches.Rectangle((7, 73), 37, 7, facecolor='#232a3b', edgecolor='#555', linestyle=':'))
        ax.text(25.5, 76.5, "Canal Superior (34 mm) - Lápices, peanas, reglas", color='#a0aec0', fontsize=6.5, ha='center', va='center')
        
        # Right: Layer 2
        box_r = patches.FancyBboxPatch((52, 30), 45, 58, boxstyle="round,pad=0.5,rounding_size=1", facecolor='#111622', edgecolor=ACCENT_GOLD, linewidth=1.5)
        ax.add_patch(box_r)
        ax.text(74.5, 84, "CAPA 2: SUPERIOR (BANDEJAS + CADDY)", color=ACCENT_GOLD, fontsize=10, fontweight='bold', ha='center')
        
        ax.add_patch(patches.Rectangle((55, 33), 39, 48, facecolor='#1a202c', edgecolor='#888', linestyle='--', linewidth=1))
        ax.add_patch(patches.Rectangle((56, 54), 28, 25, facecolor='#2b3240', edgecolor=ACCENT_GOLD, linewidth=1.5))
        ax.plot([56 + 14, 56 + 14], [54, 79], color='#f1c40f', linewidth=2)
        ax.plot([56, 84], [54 + 12.5, 54 + 12.5], color='#f1c40f', linewidth=2)
        ax.text(70, 66.5, "4 BANDEJAS APILADAS\nCON GOMA EN CRUZ\n(215 x 145 mm)", color='white', fontsize=7, ha='center', va='center', fontweight='bold')
        
        ax.add_patch(patches.Rectangle((56, 34), 19, 18, facecolor='#1e293b', edgecolor=GREEN_ACC, linewidth=1.5))
        ax.text(65.5, 43, "CADDY DADOS\n& CARTAS\n(145 x 115 mm)", color='white', fontsize=7, ha='center', va='center', fontweight='bold')
        
        ax.add_patch(patches.Rectangle((76, 34), 17, 18, facecolor='#232a3b', edgecolor='#888', linestyle='--'))
        ax.text(84.5, 43, "LIBRETOS &\nMISSION LOGS\n(A4 / Carta)", color='#cbd5e0', fontsize=6.5, ha='center', va='center')
        
        # Bottom: Elevation
        elev_box = patches.FancyBboxPatch((3, 3), 94, 24, boxstyle="round,pad=0.5,rounding_size=1", facecolor='#0d131f', edgecolor=STEEL_GRAY, linewidth=1.5)
        ax.add_patch(elev_box)
        ax.text(50, 24, "CORTE TRANSVERSAL DE ALTURA (ELEVACIÓN EN CAJA DE 55 mm)", color=ACCENT_GOLD, fontsize=10, fontweight='bold', ha='center')
        
        ax.add_patch(patches.Rectangle((8, 7), 84, 14, facecolor='#182030', edgecolor='#777', linewidth=1.5))
        ax.add_patch(patches.Rectangle((10, 8), 45, 5.5, facecolor='#2d3748', edgecolor=GRID_CYAN, linewidth=1))
        ax.text(32.5, 10.7, "Capa 1: 3 Tableros con Tapa Save-Game (Altura: 22 mm)", color='white', fontsize=7.5, ha='center', va='center')
        ax.add_patch(patches.Rectangle((10, 14.5), 45, 6, facecolor='#3d4a60', edgecolor=ACCENT_GOLD, linewidth=1))
        ax.text(32.5, 17.5, "Capa 2: 4 Bandejas Fichas + Caddy (Altura: 28 mm)", color='white', fontsize=7.5, ha='center', va='center')
        ax.plot([58, 58], [8, 20.5], color=ACCENT_GOLD, linewidth=1.5)
        ax.text(60, 14.2, "Altura Total: ~50-52 mm\n(Holgura de seguridad de 3 mm respecto a la tapa de 55 mm)", color=ACCENT_GOLD, fontsize=8, va='center')
        
        pdf.savefig(fig2)
        fig2.savefig(os.path.join(PREV_DIR, "dossier_page_2_disposicion_caja.jpg"), dpi=150)
        plt.close(fig2)
        
        # =========================================================================
        # PAGE 3: TABLERO REAL Y FINALIZADO DE SUBMARINO (KAIDAI KD.3 CLASS)
        # =========================================================================
        print("Page 3: Actual Finalized Submarine Board (Kaidai KD.3 Class)...")
        fig3 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig3.patch.set_facecolor(DARK_NAVY)
        ax = fig3.add_axes([0, 0, 1, 1])
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        # Header banner at top
        ax.add_patch(patches.Rectangle((0, 88), 100, 12, facecolor='#0d131f', edgecolor=ACCENT_GOLD, linewidth=1.5))
        ax.text(50, 95.5, "TABLERO DUAL-LAYER DE SUBMARINO: DISEÑO OFICIAL Y DEFINITIVO", color=ACCENT_GOLD, fontsize=14, fontweight='bold', ha='center')
        ax.text(50, 91.0, "Lámina Remasterizada + Overlay 3D con Títulos en Relieve | Medidas Exactas: 241.7 x 185.2 mm", color='white', fontsize=9.0, ha='center')
        
        # Top Left: Actual 2D Print Sheet (Kaidai KD.3)
        kd3_path = "images/subs/preview_canonical_Kaidai_KD3_Class.png"
        if os.path.exists(kd3_path):
            img_kd3 = Image.open(kd3_path)
            ax_kd3 = fig3.add_axes([0.04, 0.44, 0.52, 0.40])
            ax_kd3.imshow(img_kd3)
            ax_kd3.axis('off')
            # title
            
        # Top Right: Actual 3D Top Overlay with Embossed Text
        overlay_path = "images/previews/preview_canonical_overlay_embossed_text.png"
        if os.path.exists(overlay_path):
            img_ov = Image.open(overlay_path)
            ax_ov = fig3.add_axes([0.58, 0.44, 0.38, 0.40])
            ax_ov.imshow(img_ov)
            ax_ov.axis('off')
            # title

        # Bottom Left: Technical Specs
        info_box = patches.FancyBboxPatch((3, 3), 60, 37, boxstyle="round,pad=0.5,rounding_size=1",
                                          facecolor=DARK_CARD, edgecolor=STEEL_GRAY, linewidth=1.5)
        ax.add_patch(info_box)
        ax.text(33, 37, "ESTRUCTURA DEL TABLERO DE SUBMARINO (DISEÑO VALIDADO)", color=ACCENT_GOLD, fontsize=9.5, fontweight='bold', ha='center')
        
        sub_specs_text = (
            "• SECCIÓN PRINCIPAL (IZQUIERDA):\n"
            "  - Cabecera IJN con especificaciones técnicas y perfil del submarino Kaidai KD.3.\n"
            "  - Patrol Track: Tránsito y 4 casillas 'On Station' con arte marino.\n"
            "  - Damage Tracks: Inundación (Flood 1..7 + Superficie) y Casco (Hull 1..7 + Hundido).\n"
            "  - Crew Status: 10 oficiales y tripulantes + Medalla de Calidad de Tripulación.\n"
            "  - Notas históricas, reglas especiales y sello imperial Gunji Kimitsu (Top Secret).\n\n"
            "• COLUMNA DERECHA (SISTEMAS Y ARMAMENTO):\n"
            "  - Aircraft & Tactical Events: Eventos aleatorios (2 casillas).\n"
            "  - Torpedo Armament: Tubos lanzatorpedos 1 a 8 numerados.\n"
            "  - Artillery & Supplies: Cañón de 120mm, munición x5, recargas y pañol.\n"
            "  - Systems Status: Motores diésel, eléctricos, timones, radio, periscopio e hidrofonía."
        )
        ax.text(5, 33.5, sub_specs_text, color=LIGHT_TEXT, fontsize=7.2, va='top', linespacing=1.35)

        # Bottom Right: Real Photo of Submarine Board in the Box
        real_box = patches.FancyBboxPatch((65, 3), 32, 37, boxstyle="round,pad=0.5,rounding_size=1",
                                          facecolor=DARK_CARD, edgecolor=ACCENT_GOLD, linewidth=1.5)
        ax.add_patch(real_box)
        ax.text(81, 37, "RESULTADO FÍSICO REAL IMPRESO", color=ACCENT_GOLD, fontsize=9.0, fontweight='bold', ha='center')
        
        if os.path.exists(photo_sub_path):
            img_real_sub = Image.open(photo_sub_path)
            ax_rsub = fig3.add_axes([0.665, 0.05, 0.29, 0.30])
            ax_rsub.imshow(img_real_sub)
            ax_rsub.axis('off')

        pdf.savefig(fig3)
        fig3.savefig(os.path.join(PREV_DIR, "dossier_page_3_sub_board.jpg"), dpi=150)
        plt.close(fig3)

        # =========================================================================
        # SIMULACION DUAL-LAYER: SUBMARINO KAIDAI KD.3 CON FICHAS 3D
        # =========================================================================
        print("Page: Photorealistic Submarine Dual-Layer Simulation...")
        fig_sim_sub = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig_sim_sub.patch.set_facecolor(DARK_NAVY)
        sim_sub_path = os.path.join(PREV_DIR, "simulation_submarine_dual_layer.jpg")
        if os.path.exists(sim_sub_path):
            img_ssub = Image.open(sim_sub_path)
            ax_ssub = fig_sim_sub.add_axes([0.02, 0.02, 0.96, 0.96])
            ax_ssub.imshow(img_ssub)
            ax_ssub.axis('off')
        pdf.savefig(fig_sim_sub)
        fig_sim_sub.savefig(os.path.join(PREV_DIR, "dossier_page_sim_sub.jpg"), dpi=150)
        plt.close(fig_sim_sub)

        # =========================================================================
        # PAGE 4: SISTEMA SANDWICH MODULAR PARA 18 SUBMARINOS
        # =========================================================================
        print("Page 4: Modular Sandwich System for 18 Submarines...")
        fig_sand = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig_sand.patch.set_facecolor(DARK_NAVY)
        ax_s = fig_sand.add_subplot(111)
        ax_s.set_facecolor(DARK_NAVY)
        ax_s.set_xlim(0, 100)
        ax_s.set_ylim(0, 100)
        ax_s.axis('off')

        sand_prev_path = os.path.join(PREV_DIR, "preview_sistema_sandwich_18_submarinos.jpg")
        if os.path.exists(sand_prev_path):
            img_sand = Image.open(sand_prev_path)
            ax_s_img = fig_sand.add_axes([0.02, 0.02, 0.96, 0.96])
            ax_s_img.imshow(img_sand)
            ax_s_img.axis('off')

        pdf.savefig(fig_sand)
        fig_sand.savefig(os.path.join(PREV_DIR, "dossier_page_4_sandwich_system.jpg"), dpi=150)
        plt.close(fig_sand)
        
        # =========================================================================
        # PAGE 4: PLANTILLA REMASTERIZADA - OPERATIONS MAP REAL
        # =========================================================================
        print("Page 4: Operations Map Standardized Template...")
        fig4 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig4.patch.set_facecolor(DARK_NAVY)
        ax = fig4.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        op_path = os.path.join(PREV_DIR, "preview_operations_map_deluxe_real.jpg")
        if os.path.exists(op_path):
            img_op = Image.open(op_path)
            ax_op = fig4.add_axes([0.04, 0.04, 0.92, 0.92])
            ax_op.imshow(img_op)
            ax_op.axis('off')
            
        pdf.savefig(fig4)
        fig4.savefig(os.path.join(PREV_DIR, "dossier_page_4_operations_map.jpg"), dpi=150)
        plt.close(fig4)

        # =========================================================================
        # SIMULACION MAPA - OPCION 2: REJILLA WIREFRAME 3D ESQUELETICA
        # =========================================================================
        print("Page: Option 2 Simulation (3D Wireframe Skeleton Grid)...")
        fig_sim_op2 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig_sim_op2.patch.set_facecolor(DARK_NAVY)
        sim_op2_path = os.path.join(PREV_DIR, "simulation_option_2_wireframe_skeleton.jpg")
        if os.path.exists(sim_op2_path):
            img_sop2 = Image.open(sim_op2_path)
            ax_sop2 = fig_sim_op2.add_axes([0.02, 0.02, 0.96, 0.96])
            ax_sop2.imshow(img_sop2)
            ax_sop2.axis('off')
        pdf.savefig(fig_sim_op2)
        fig_sim_op2.savefig(os.path.join(PREV_DIR, "dossier_page_sim_option_2_wireframe.jpg"), dpi=150)
        plt.close(fig_sim_op2)

        # =========================================================================
        # SIMULACION MAPA - OPCION 3: MODO EN JUEGO 100% LIMPIO
        # =========================================================================
        print("Page: Option 3 Simulation (100 percent Clean Map in Play)...")
        fig_sim_op3 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig_sim_op3.patch.set_facecolor(DARK_NAVY)
        sim_op3_path = os.path.join(PREV_DIR, "simulation_option_3_open_play_clean.jpg")
        if os.path.exists(sim_op3_path):
            img_sop3 = Image.open(sim_op3_path)
            ax_sop3 = fig_sim_op3.add_axes([0.02, 0.02, 0.96, 0.96])
            ax_sop3.imshow(img_sop3)
            ax_sop3.axis('off')
        pdf.savefig(fig_sim_op3)
        fig_sim_op3.savefig(os.path.join(PREV_DIR, "dossier_page_sim_option_3_clean.jpg"), dpi=150)
        plt.close(fig_sim_op3)
        
        # =========================================================================
        # PAGE 5: PLANTILLA REMASTERIZADA - ATTACK MAT [H1]
        # =========================================================================
        print("Page 5: Attack Mat [H1] Standardized Template...")
        fig5 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig5.patch.set_facecolor(DARK_NAVY)
        ax = fig5.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        at_path = os.path.join(PREV_DIR, "preview_attack_mat_deluxe_real.jpg")
        if os.path.exists(at_path):
            img_at = Image.open(at_path)
            ax_at = fig5.add_axes([0.04, 0.04, 0.92, 0.92])
            ax_at.imshow(img_at)
            ax_at.axis('off')
            
        pdf.savefig(fig5)
        fig5.savefig(os.path.join(PREV_DIR, "dossier_page_5_attack_mat.jpg"), dpi=150)
        plt.close(fig5)
        
        # =========================================================================
        # PAGE 6: TAPA REJILLA SAVE-GAME CON RESBALONES Y GOMAS
        # =========================================================================
        print("Page 6: Save-Game Grate Lid Blueprint...")
        fig6 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig6.patch.set_facecolor(DARK_NAVY)
        ax = fig6.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        ax.text(50, 95, "TAPA REJILLA 'SAVE-GAME' CON RESBALONES Y RETENCIÓN POR GOMAS", color=ACCENT_GOLD, fontsize=15, fontweight='bold', ha='center')
        ax.text(50, 91, "sensuikan_save_game_grate_lid.stl (241.7 x 185.2 x 3.0 mm) | Cierre Hermético Anti-Deslizamiento", color='white', fontsize=9.5, ha='center')
        
        lid_box = patches.Rectangle((8, 12), 84, 72, facecolor='#111622', edgecolor=ACCENT_GOLD, linewidth=2)
        ax.add_patch(lid_box)
        
        for gx in np.arange(13, 87, 4.5):
            for gy in np.arange(17, 79, 4.5):
                if not (36 <= gx <= 64 and 38 <= gy <= 58):
                    dia = patches.RegularPolygon((gx, gy), numVertices=4, radius=1.6, orientation=0,
                                                 facecolor='#1e2638', edgecolor='#555', linewidth=0.6)
                    ax.add_patch(dia)
                    
        plaque = patches.FancyBboxPatch((36, 40), 28, 16, boxstyle="round,pad=0.5,rounding_size=1",
                                        facecolor='#0a0e17', edgecolor=ACCENT_GOLD, linewidth=1.5)
        ax.add_patch(plaque)
        ax.text(50, 48, "SENSUÍKAN\nSAVE-GAME STATE", color=ACCENT_GOLD, fontsize=8.5, fontweight='bold', ha='center', va='center')
        
        for cx, cy in [(9.5, 13.5), (82.5, 13.5), (9.5, 80.5), (82.5, 80.5)]:
            rf = patches.Rectangle((cx-2.5, cy-2.5), 5, 5, facecolor=IJN_RED, edgecolor='white', linewidth=1)
            ax.add_patch(rf)
            
        ax.text(12, 85, "Pestaña de esquina\n(Resbalón para encastre)\nEvita desplazamiento X/Y", color='#feb2b2', fontsize=7.5, va='bottom')
        ax.text(88, 85, "Pestaña de esquina\nPermite apilar tableros\ncon fichas protegidas", color='#feb2b2', fontsize=7.5, ha='right', va='bottom')
        
        ax.plot([50-3, 50+3], [12, 12], color=ACCENT_GOLD, linewidth=4)
        ax.plot([50-3, 50+3], [84, 84], color=ACCENT_GOLD, linewidth=4)
        ax.plot([8, 8], [48-3, 48+3], color=ACCENT_GOLD, linewidth=4)
        ax.plot([92, 92], [48-3, 48+3], color=ACCENT_GOLD, linewidth=4)
        ax.text(50, 8, "Muescas perimetrales para goma elástica (15 mm de paso)", color=ACCENT_GOLD, fontsize=8, ha='center')
        
        pdf.savefig(fig6)
        fig6.savefig(os.path.join(PREV_DIR, "dossier_page_6_tapa_rejilla.jpg"), dpi=150)
        plt.close(fig6)

        # =========================================================================
        # ENSAMBLAJE SAVE-GAME SANDWICH Y CLAMPING DE RETENCION TOTAL
        # =========================================================================
        print("Page: Save-Game Clamping Sandwich Assembly Diagram...")
        fig_sim_clamp = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig_sim_clamp.patch.set_facecolor(DARK_NAVY)
        sim_clamp_path = os.path.join(PREV_DIR, "simulation_save_game_sandwich_clamping.jpg")
        if os.path.exists(sim_clamp_path):
            img_sclamp = Image.open(sim_clamp_path)
            ax_sclamp = fig_sim_clamp.add_axes([0.02, 0.02, 0.96, 0.96])
            ax_sclamp.imshow(img_sclamp)
            ax_sclamp.axis('off')
        pdf.savefig(fig_sim_clamp)
        fig_sim_clamp.savefig(os.path.join(PREV_DIR, "dossier_page_sim_sandwich_clamping.jpg"), dpi=150)
        plt.close(fig_sim_clamp)
        
        # =========================================================================
        # PAGE 7: CADDY MODULAR PARA CARTAS ENFUNDADAS Y DADOS
        # =========================================================================
        print("Page 7: Modular Cards & Dice Caddy Blueprint...")
        fig7 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig7.patch.set_facecolor(DARK_NAVY)
        ax = fig7.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        ax.text(50, 95, "CADDY MODULAR PARA CARTAS ENFUNDADAS Y DADOS", color=ACCENT_GOLD, fontsize=15, fontweight='bold', ha='center')
        ax.text(50, 91, "sensuikan_cards_and_dice_caddy.stl (145 x 115 x 22 mm) | Modular con Bandejas de Fichas", color='white', fontsize=9.5, ha='center')
        
        caddy_base = patches.FancyBboxPatch((6, 12), 42, 72, boxstyle="round,pad=0.5,rounding_size=1.5",
                                            facecolor='#111622', edgecolor=GREEN_ACC, linewidth=2)
        ax.add_patch(caddy_base)
        ax.text(27, 80, "BASE COMPARTIMENTADA", color=GREEN_ACC, fontsize=10, fontweight='bold', ha='center')
        
        ax.add_patch(patches.Rectangle((8, 38), 26, 38, facecolor='#1e2638', edgecolor='#4299e1', linewidth=1.5))
        ax.add_patch(patches.Circle((8 + 13, 38), 3.5, facecolor='#111622', edgecolor='#4299e1'))
        ax.text(21, 57, "CARTAS\nENFUNDADAS\n72 x 98 mm\nProfundidad 20 mm\n(Con uñero)", color='white', fontsize=7.5, ha='center', va='center', fontweight='bold')
        
        ax.add_patch(patches.Rectangle((8, 15), 26, 20, facecolor='#1e2638', edgecolor=IJN_RED, linewidth=1.5))
        ax.text(21, 25, "HUECO DADOS\n36 x 98 mm\n(1d10 + 4d6)", color='white', fontsize=7.5, ha='center', va='center', fontweight='bold')
        
        ax.add_patch(patches.Rectangle((36, 15), 10, 61, facecolor='#1e2638', edgecolor='#ecc94b', linewidth=1.5))
        ax.text(41, 45.5, "HUECO AUXILIAR\n40 x 110 mm\n(Lápiz, peanas,\nmarcadores)", color='white', fontsize=7, ha='center', va='center', rotation=-90)
        
        caddy_lid = patches.FancyBboxPatch((52, 12), 42, 72, boxstyle="round,pad=0.5,rounding_size=1.5",
                                           facecolor='#111622', edgecolor=ACCENT_GOLD, linewidth=2)
        ax.add_patch(caddy_lid)
        ax.text(73, 80, "TAPA CON REJILLA DIAMANTE & GOMAS", color=ACCENT_GOLD, fontsize=10, fontweight='bold', ha='center')
        
        for gx in np.arange(55, 91, 4.5):
            for gy in np.arange(16, 76, 4.5):
                if not (60 <= gx <= 86 and 40 <= gy <= 52):
                    dia = patches.RegularPolygon((gx, gy), numVertices=4, radius=1.6, orientation=0,
                                                 facecolor='#1e2638', edgecolor='#555', linewidth=0.6)
                    ax.add_patch(dia)
        lp = patches.FancyBboxPatch((60, 42), 26, 8, boxstyle="round,pad=0.3,rounding_size=1",
                                    facecolor='#0a0e17', edgecolor=ACCENT_GOLD, linewidth=1)
        ax.add_patch(lp)
        ax.text(73, 46, "CARDS & DICE", color=ACCENT_GOLD, fontsize=7.5, fontweight='bold', ha='center', va='center')
        
        ax.plot([73-3, 73+3], [12, 12], color=ACCENT_GOLD, linewidth=4)
        ax.plot([73-3, 73+3], [84, 84], color=ACCENT_GOLD, linewidth=4)
        ax.plot([52, 52], [48-3, 48+3], color=ACCENT_GOLD, linewidth=4)
        ax.plot([94, 94], [48-3, 48+3], color=ACCENT_GOLD, linewidth=4)
        
        pdf.savefig(fig7)
        fig7.savefig(os.path.join(PREV_DIR, "dossier_page_7_caddy_cartas_dados.jpg"), dpi=150)
        plt.close(fig7)
        
        # =========================================================================
        # PAGE 8: CATÁLOGO DE FICHAS DELUXE IA & PARÁMETROS DE IMPRESIÓN
        # =========================================================================
        print("Page 8: Deluxe AI Counters & Slicer Parameters...")
        fig8 = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig8.patch.set_facecolor(DARK_NAVY)
        ax = fig8.add_subplot(111)
        ax.set_facecolor(DARK_NAVY)
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 100)
        ax.axis('off')
        
        ax.text(50, 95, "CATÁLOGO DE FICHAS DELUXE IA & PARÁMETROS DE IMPRESIÓN 3D", color=ACCENT_GOLD, fontsize=15, fontweight='bold', ha='center')
        ax.text(50, 91, "40 Marcadores Fotorrealistas Remasterizados (15 x 15 mm) | Configuración Óptima para Bambu Lab", color='white', fontsize=9.5, ha='center')
        
        ai_box = patches.FancyBboxPatch((3, 8), 52, 78, boxstyle="round,pad=0.5,rounding_size=1.5",
                                        facecolor='#111622', edgecolor=ACCENT_GOLD, linewidth=1.5)
        ax.add_patch(ai_box)
        ax.text(29, 82, "MUESTRA DE FICHAS REMASTERIZADAS (IA GENERATIVA NATIVA)", color=ACCENT_GOLD, fontsize=9, fontweight='bold', ha='center')
        
        sample_counters = [
            ("counter_captain.jpg", "CAPTAIN"),
            ("counter_officers.jpg", "OFFICERS"),
            ("counter_crew.jpg", "CREW"),
            ("counter_flooding.jpg", "FLOODING"),
            ("counter_hull_damage_marker.jpg", "HULL DAMAGE"),
            ("counter_periscope_optics.jpg", "PERISCOPE"),
            ("counter_aircraft_hangar.jpg", "SEIRAN HANGAR"),
            ("counter_sunk.jpg", "SUNK!"),
        ]
        
        c_idx = 0
        for r in range(4):
            for c in range(2):
                if c_idx < len(sample_counters):
                    fname, label = sample_counters[c_idx]
                    fpath = os.path.join("images/counters/ai", fname)
                    if os.path.exists(fpath):
                        img_c = Image.open(fpath)
                        ax_thumb = fig8.add_axes([0.05 + c*0.25, 0.12 + (3-r)*0.17, 0.22, 0.14])
                        ax_thumb.imshow(img_c)
                        ax_thumb.axis('off')
                        ax_thumb.set_title(label, color='white', fontsize=7, pad=2)
                    c_idx += 1
                    
        print_box = patches.FancyBboxPatch((58, 8), 39, 78, boxstyle="round,pad=0.5,rounding_size=1.5",
                                          facecolor='#111622', edgecolor=GRID_CYAN, linewidth=1.5)
        ax.add_patch(print_box)
        ax.text(77.5, 82, "GUÍA DE PARÁMETROS DE SLICER", color=GRID_CYAN, fontsize=10, fontweight='bold', ha='center')
        
        guide_text = (
            "• Material Recomendado:\n"
            "  - PLA Negro Mate o Gris Carbón para Base y Tapas\n"
            "  - PLA Blanco / Oro / Rojo para Texto en Relieve\n\n"
            "• Altura de Capa:\n"
            "  - 0.20 mm Estándar (o 0.16 mm para texto nítido)\n\n"
            "• Boquilla (Nozzle):\n"
            "  - 0.40 mm Estándar\n\n"
            "• Relleno (Infill):\n"
            "  - 15% Gyroid o Rectilinear (sólido y ligero)\n\n"
            "• Paredes / Perímetros:\n"
            "  - 3 líneas de pared (0.8 - 1.2 mm)\n\n"
            "• Adherencia a la Cama:\n"
            "  - Cama PEI texturizada a 55-60°C\n"
            "  - Sin balsa (raft) ni borde (brim) necesario\n\n"
            "• Multimaterial (AMS / Cambio de Capa):\n"
            "  - Overlay de texto: Imprimir base en negro hasta Z=2.0 mm\n"
            "  - Cambiar a color secundario en Z=2.0 a 2.6 mm\n"
            "  - Da como resultado títulos en alto relieve legibles\n"
            "    sin debilitar la estructura plástica"
        )
        ax.text(60, 77, guide_text, color=LIGHT_TEXT, fontsize=8.5, va='top', linespacing=1.45)
        
        pdf.savefig(fig8)
        fig8.savefig(os.path.join(PREV_DIR, "dossier_page_8_catalogo_fichas.jpg"), dpi=150)
        plt.close(fig8)
        
    print(f"Successfully generated 8-page Master Dossier: {PDF_OUT}")

if __name__ == "__main__":
    create_dossier()
