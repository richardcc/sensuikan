import cv2
import numpy as np
import os

def process_subs():
    subs = [
        ('Junsen_J2', 'images/subs/subs_07112026_upright.png', 89),
        ('Junsen_J3', 'images/subs/subs_07112026_0001_upright.png', 88)
    ]
    
    for name, path, left_px in subs:
        raw = cv2.imread(path)
        # Crop exactly to physical card bounds
        # Card width is from left_px to 1717 (w ~ 1629 px)
        card_raw = raw[0:1204, left_px:1717]
        W_px = card_raw.shape[1]
        px_per_mm = W_px / 280.0 # ~ 5.815 px/mm
        full_h_px = int(round(215.0 * px_per_mm))
        
        card_bgr = np.zeros((full_h_px, W_px, 3), dtype=np.uint8)
        card_bgr[0:1204, :] = card_raw
        card_bgr[1204:, :] = np.median(card_raw[-30:, :, :], axis=(0, 1)).astype(np.uint8)
        
        H, W, _ = card_bgr.shape
        
        def to_px(x_mm, y_mm):
            return int(round(x_mm * px_per_mm)), int(round(y_mm * px_per_mm))
        
        def to_box_px(x_mm, y_mm, w_mm, h_mm):
            x1, y1 = to_px(x_mm, y_mm)
            x2, y2 = to_px(x_mm + w_mm, y_mm + h_mm)
            return x1, y1, x2, y2

        # Create CAD layer
        layer_cad = np.zeros_like(card_bgr)
        alpha = np.zeros((H, W), dtype=np.float32)

        def draw_slot(img, cx_mm, cy_mm):
            size_mm = 15.0
            r_mm = 1.8
            x1, y1 = to_px(cx_mm - size_mm/2.0, cy_mm - size_mm/2.0)
            x2, y2 = to_px(cx_mm + size_mm/2.0, cy_mm + size_mm/2.0)
            cv2.rectangle(img, (x1, y1), (x2, y2), (255, 255, 255), -1)
            r_px = int(round(r_mm * px_per_mm))
            cx_px, cy_px = to_px(cx_mm, cy_mm)
            cv2.circle(img, (cx_px, y1), r_px, (255, 255, 255), -1)
            cv2.circle(img, (cx_px, y2), r_px, (255, 255, 255), -1)
            alpha[max(0, y1 - r_px):min(H, y2 + r_px), x1:x2] = 0.0

        SPLIT_X_TOP = 158.0
        SPLIT_Y_TOP = 21.5
        SPLIT_X_MID = 184.0 # Extended jog to enclose submarine, patrol track & SUNK box!
        SPLIT_Y_MID = 95.0

        # --- PIEZA 1 (Top-Left: 0 to 158 mm, 0 to 21.5 mm) ---
        x1, y1, x2, y2 = to_box_px(0, 0, SPLIT_X_TOP, SPLIT_Y_TOP)
        layer_cad[y1:y2, x1:x2] = (160, 220, 170) # Soft Emerald
        alpha[y1:y2, x1:x2] = 0.50
        
        # Windows P1:
        # Logo:
        wx1, wy1, wx2, wy2 = to_box_px(6.5, 2.0, 61.5, 18.0)
        layer_cad[wy1:wy2, wx1:wx2] = 0
        alpha[wy1:wy2, wx1:wx2] = 0.0
        # Title:
        wx1, wy1, wx2, wy2 = to_box_px(70.0, 3.5, 88.0, 17.5)
        layer_cad[wy1:wy2, wx1:wx2] = 0
        alpha[wy1:wy2, wx1:wx2] = 0.0

        # --- PIEZA 2A (Top-Right: 158 to 280 mm, 0 to 21.5 mm) ---
        x1, y1, x2, y2 = to_box_px(SPLIT_X_TOP, 0, 280.0 - SPLIT_X_TOP, SPLIT_Y_TOP)
        layer_cad[y1:y2, x1:x2] = (235, 205, 160) # Soft Sky Blue
        alpha[y1:y2, x1:x2] = 0.50
        
        # Aircraft window:
        wx1, wy1, wx2, wy2 = to_box_px(188.5, 7.5, 19.5, 11.5)
        layer_cad[wy1:wy2, wx1:wx2] = 0
        alpha[wy1:wy2, wx1:wx2] = 0.0
        
        # Slots in P2A:
        draw_slot(layer_cad, 217.54, 11.78) # Yokosuka
        draw_slot(layer_cad, 252.12, 11.78) # EVT 1
        draw_slot(layer_cad, 269.17, 11.78) # EVT 2

        # --- PIEZA 5 (Main Left Module: with JOG to X=184 mm to cleanly wrap Sub & Damage tracks!) ---
        # Zone A: from X=0 to 184 mm, Y=21.5 to 148 mm
        x1, y1, x2, y2 = to_box_px(0, SPLIT_Y_TOP, SPLIT_X_MID, 148.0 - SPLIT_Y_TOP)
        layer_cad[y1:y2, x1:x2] = (225, 195, 215) # Soft Lavender
        alpha[y1:y2, x1:x2] = 0.45
        
        # Zone B: bottom crew area (X=0 to 158 mm, Y=148 to 215 mm)
        x1, y1, x2, y2 = to_box_px(0, 148.0, SPLIT_X_TOP, 215.0 - 148.0)
        layer_cad[y1:y2, x1:x2] = (225, 195, 215)
        alpha[y1:y2, x1:x2] = 0.45

        # SUBMARINE PROFILE CUTOUT WINDOW (EXACT FRAME: 48.5 to 180.0 mm, Y=23.6 to 56.7 mm):
        sub_x1, sub_y1, sub_x2, sub_y2 = to_box_px(48.5, 23.6, 131.5, 33.1)
        layer_cad[sub_y1:sub_y2, sub_x1:sub_x2] = 0
        alpha[sub_y1:sub_y2, sub_x1:sub_x2] = 0.0

        # Base / Mission / Port slots:
        for cy in [31.2, 52.8, 74.5]:
            draw_slot(layer_cad, 13.8, cy)

        # Patrol Track (ALL 7 SLOTS, fully inside Pieza 5!):
        for cx in [63.67, 80.65, 97.63, 114.61, 131.58, 148.52, 165.58]:
            draw_slot(layer_cad, cx, 74.9)

        # Damage tracks (ALL 10 COLUMNS fully inside Pieza 5!):
        for cy in [118.4, 135.4]:
            draw_slot(layer_cad, 26.26, cy) # Marker
            for cx in [43.1, 60.1, 77.1, 94.1, 111.1, 128.1, 145.1, 162.1]:
                draw_slot(layer_cad, cx, cy)
        draw_slot(layer_cad, 179.16, 118.4) # SUNK

        # --- PIEZA 3 & 4 (Right modules) ---
        # P3: Torpedos and Guns
        x1, y1, x2, y2 = to_box_px(SPLIT_X_MID, SPLIT_Y_TOP, 280.0 - SPLIT_X_MID, SPLIT_Y_MID - SPLIT_Y_TOP)
        layer_cad[y1:y2, x1:x2] = (140, 200, 245)
        alpha[y1:y2, x1:x2] = 0.45
        for cx in [218.18, 235.15, 252.12, 269.17]:
            draw_slot(layer_cad, cx, 31.27)
        for cx in [218.18, 235.15]:
            draw_slot(layer_cad, cx, 48.15)

        # P4: Kaiten and Systems
        x1, y1, x2, y2 = to_box_px(SPLIT_X_TOP, 148.0, 280.0 - SPLIT_X_TOP, 215.0 - 148.0)
        layer_cad[y1:y2, x1:x2] = (180, 180, 245)
        alpha[y1:y2, x1:x2] = 0.45
        for cy in [108.0, 124.5, 151.0, 168.0, 185.0]:
            for cx in [218.0, 235.0, 252.0, 269.0]:
                draw_slot(layer_cad, cx, cy)

        # Blend
        alpha_3d = np.repeat(alpha[:, :, np.newaxis], 3, axis=2)
        blended = (card_bgr * (1.0 - alpha_3d) + layer_cad * alpha_3d).astype(np.uint8)

        # Draw Crisp Borders
        def draw_slot_border(img, cx_mm, cy_mm):
            size_mm = 15.0
            r_mm = 1.8
            x1, y1 = to_px(cx_mm - size_mm/2.0, cy_mm - size_mm/2.0)
            x2, y2 = to_px(cx_mm + size_mm/2.0, cy_mm + size_mm/2.0)
            cv2.rectangle(img, (x1, y1), (x2, y2), (20, 20, 20), 2)
            r_px = int(round(r_mm * px_per_mm))
            cx_px, cy_px = to_px(cx_mm, cy_mm)
            cv2.circle(img, (cx_px, y1), r_px, (20, 20, 20), 2)
            cv2.circle(img, (cx_px, y2), r_px, (20, 20, 20), 2)

        # Draw borders for all slots:
        for cx in [217.54, 252.12, 269.17]: draw_slot_border(blended, cx, 11.78)
        for cx in [218.18, 235.15, 252.12, 269.17]: draw_slot_border(blended, cx, 31.27)
        for cx in [218.18, 235.15]: draw_slot_border(blended, cx, 48.15)
        for cy in [118.4, 135.4]:
            draw_slot_border(blended, 26.26, cy)
            for cx in [43.1, 60.1, 77.1, 94.1, 111.1, 128.1, 145.1, 162.1]: draw_slot_border(blended, cx, cy)
        draw_slot_border(blended, 179.16, 118.4)
        for cy in [31.2, 52.8, 74.5]: draw_slot_border(blended, 13.8, cy)
        for cx in [63.67, 80.65, 97.63, 114.61, 131.58, 148.52, 165.58]: draw_slot_border(blended, cx, 74.9)
        for cy in [108.0, 124.5, 151.0, 168.0, 185.0]:
            for cx in [218.0, 235.0, 252.0, 269.0]: draw_slot_border(blended, cx, cy)

        # Draw Submarine Window Border (bold blue)
        cv2.rectangle(blended, (sub_x1, sub_y1), (sub_x2, sub_y2), (255, 120, 0), 3)
        cv2.putText(blended, f"VENTANA SUBMARINO (131.5 x 33.1 mm): {name}", (sub_x1 + 10, sub_y1 + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 120, 0), 2, cv2.LINE_AA)

        # Draw Jog Cutline in bright red
        # From top split (X=158, Y=21.5) -> to (X=184, Y=21.5) -> down to Y=148 -> in to X=158 -> down to Y=215
        pA = to_px(SPLIT_X_TOP, 0)
        pB = to_px(SPLIT_X_TOP, SPLIT_Y_TOP)
        pC = to_px(SPLIT_X_MID, SPLIT_Y_TOP)
        pD = to_px(SPLIT_X_MID, 148.0)
        pE = to_px(SPLIT_X_TOP, 148.0)
        pF = to_px(SPLIT_X_TOP, 215.0)
        
        pts = np.array([pA, pB, pC, pD, pE, pF], np.int32)
        cv2.polylines(blended, [pts], False, (0, 0, 255), 3)

        out_path = f'images/subs/overlay_{name}.png'
        cv2.imwrite(out_path, blended)
        cv2.imwrite(f'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/overlay_{name}.png', blended)
        print(f'Saved overlay for {name}: {out_path}')

        # Crop submarine detail
        crop_sub = blended[sub_y1 - 10:sub_y2 + 20, sub_x1 - 10:sub_x2 + 10]
        cv2.imwrite(f'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/detail_sub_{name}.png', crop_sub)

if __name__ == '__main__':
    process_subs()
