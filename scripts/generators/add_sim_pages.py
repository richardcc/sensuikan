import os

path = "scripts/generators/generate_master_design_dossier_pdf.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

sub_insert = """        pdf.savefig(fig3)
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
        plt.close(fig_sim_sub)"""

target_sub = """        pdf.savefig(fig3)
        fig3.savefig(os.path.join(PREV_DIR, "dossier_page_3_sub_board.jpg"), dpi=150)
        plt.close(fig3)"""

op_insert = """        pdf.savefig(fig4)
        fig4.savefig(os.path.join(PREV_DIR, "dossier_page_4_operations_map.jpg"), dpi=150)
        plt.close(fig4)

        # =========================================================================
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

target_op = """        pdf.savefig(fig4)
        fig4.savefig(os.path.join(PREV_DIR, "dossier_page_4_operations_map.jpg"), dpi=150)
        plt.close(fig4)"""

lid_insert = """        pdf.savefig(fig6)
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
        plt.close(fig_sim_clamp)"""

target_lid = """        pdf.savefig(fig6)
        fig6.savefig(os.path.join(PREV_DIR, "dossier_page_6_tapa_rejilla.jpg"), dpi=150)
        plt.close(fig6)"""

text = text.replace(target_sub, sub_insert, 1)
text = text.replace(target_op, op_insert, 1)
text = text.replace(target_lid, lid_insert, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("Script updated successfully!")
