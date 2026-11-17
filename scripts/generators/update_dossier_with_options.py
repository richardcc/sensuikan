import os

path = "scripts/generators/generate_master_design_dossier_pdf.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

target = """        # =========================================================================
        # SIMULACION DUAL-LAYER: MAPA DE OPERACIONES CON CUBIERTA 3D Y FICHAS
        # =========================================================================
        print("Page: Photorealistic Operations Map Dual-Layer Simulation...")
        fig_sim_op = plt.figure(figsize=(11.69, 8.27), dpi=150)
        fig_sim_op.patch.set_facecolor(DARK_NAVY)
        sim_op_path = os.path.join(PREV_DIR, "simulation_operations_map_dual_layer.jpg")
        if os.path.exists(sim_op_path):
            img_sop = Image.open(sim_op_path)
            ax_sop = fig_sim_op.add_axes([0.02, 0.02, 0.96, 0.96])
            ax_sop.imshow(img_sop)
            ax_sop.axis('off')
        pdf.savefig(fig_sim_op)
        fig_sim_op.savefig(os.path.join(PREV_DIR, "dossier_page_sim_operations_map.jpg"), dpi=150)
        plt.close(fig_sim_op)"""

replacement = """        # =========================================================================
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
        plt.close(fig_sim_op3)"""

assert target in text, "Target block not found in file!"
text = text.replace(target, replacement, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Dossier updated successfully with Options 2 and 3!")
