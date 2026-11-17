import cv2
import numpy as np

def create_superposition_overlay():
    # Load calibrated 280 x 215 mm card image (exact edge at x=0)
    card_bgr = cv2.imread('images/cards/card_full_280x215.png')
    H, W, _ = card_bgr.shape
    px_per_mm = W / 280.0 # 11.6321 px/mm
    
    layer_cad = np.zeros_like(card_bgr)
    alpha = np.zeros((H, W), dtype=np.float32)

    def to_px(x_mm, y_mm):
        return int(round(x_mm * px_per_mm)), int(round(y_mm * px_per_mm))
    
    def to_box_px(x_mm, y_mm, w_mm, h_mm):
        x1, y1 = to_px(x_mm, y_mm)
        x2, y2 = to_px(x_mm + w_mm, y_mm + h_mm)
        return x1, y1, x2, y2

    # Draw Slot with 15x15 mm and nail notches
    def draw_slot(img, cx_mm, cy_mm):
        size_mm = 15.0
        r_mm = 1.8
        x1, y1 = to_px(cx_mm - size_mm/2.0, cy_mm - size_mm/2.0)
        x2, y2 = to_px(cx_mm + size_mm/2.0, cy_mm + size_mm/2.0)
        # Clear slot area (transparent cut)
        cv2.rectangle(img, (x1, y1), (x2, y2), (255, 255, 255), -1)
        r_px = int(round(r_mm * px_per_mm))
        cx_px, cy_px = to_px(cx_mm, cy_mm)
        cv2.circle(img, (cx_px, y1), r_px, (255, 255, 255), -1)
        cv2.circle(img, (cx_px, y2), r_px, (255, 255, 255), -1)
        # Clear alpha mask
        alpha[max(0, y1 - r_px):min(H, y2 + r_px), x1:x2] = 0.0

    # Cut definitions
    SPLIT_X1 = 158.0   # Vertical split separating Left and Right modules
    SPLIT_Y_TOP = 21.5 # Horizontal split separating Top strips from lower modules
    SPLIT_Y_MID = 95.0 # Horizontal split between P3 and P4 on the right
    
    # -------------------------------------------------------------------------
    # 1. PIEZA 1 (Top-Left: 0 to 158 mm, 0 to 21.5 mm)
    # -------------------------------------------------------------------------
    x1, y1, x2, y2 = to_box_px(0, 0, SPLIT_X1, SPLIT_Y_TOP)
    layer_cad[y1:y2, x1:x2] = (160, 220, 170)
    alpha[y1:y2, x1:x2] = 0.55
    
    # Cut-out window: Logo Sensuikan (adjusted to physical card edge)
    wx1, wy1, wx2, wy2 = to_box_px(6.5, 2.0, 61.5, 18.0)
    layer_cad[wy1:wy2, wx1:wx2] = 0
    alpha[wy1:wy2, wx1:wx2] = 0.0
    
    # Cut-out window: Submarine Title
    wx1, wy1, wx2, wy2 = to_box_px(70.0, 3.5, 88.0, 17.5)
    layer_cad[wy1:wy2, wx1:wx2] = 0
    alpha[wy1:wy2, wx1:wx2] = 0.0

    # -------------------------------------------------------------------------
    # 2. PIEZA 2A (Top-Right: 158 to 280 mm, 0 to 21.5 mm)
    # -------------------------------------------------------------------------
    x1, y1, x2, y2 = to_box_px(SPLIT_X1, 0, 280.0 - SPLIT_X1, SPLIT_Y_TOP)
    layer_cad[y1:y2, x1:x2] = (235, 205, 160)
    alpha[y1:y2, x1:x2] = 0.55
    
    # Cut-out window: "Aircraft" text
    wx1, wy1, wx2, wy2 = to_box_px(188.5, 7.5, 19.5, 11.5)
    layer_cad[wy1:wy2, wx1:wx2] = 0
    alpha[wy1:wy2, wx1:wx2] = 0.0

    # Slots in P2A:
    # Yokosuka E14Y1 Status (Center X ~ 217.5)
    draw_slot(layer_cad, 217.54, 11.78)
    # EVT 1 (Center X ~ 252.1)
    draw_slot(layer_cad, 252.12, 11.78)
    # EVT 2 (Center X ~ 269.1)
    draw_slot(layer_cad, 269.17, 11.78)

    # -------------------------------------------------------------------------
    # 3. PIEZA 3 (Right Mid: 158 to 280 mm, 21.5 to 95.0 mm)
    # -------------------------------------------------------------------------
    x1, y1, x2, y2 = to_box_px(SPLIT_X1, SPLIT_Y_TOP, 280.0 - SPLIT_X1, SPLIT_Y_MID - SPLIT_Y_TOP)
    layer_cad[y1:y2, x1:x2] = (140, 200, 245)
    alpha[y1:y2, x1:x2] = 0.50

    # Slots in P3:
    # Torpedo tubes 1..4 (Y=31.27 mm)
    for cx in [218.18, 235.15, 252.12, 269.17]:
        draw_slot(layer_cad, cx, 31.27)
    # Torpedo tubes 5..6 (Y=48.15 mm)
    for cx in [218.18, 235.15]:
        draw_slot(layer_cad, cx, 48.15)

    # -------------------------------------------------------------------------
    # 4. PIEZA 4 (Right Bottom: 158 to 280 mm, 95.0 to 215.0 mm)
    # -------------------------------------------------------------------------
    x1, y1, x2, y2 = to_box_px(SPLIT_X1, SPLIT_Y_MID, 280.0 - SPLIT_X1, 215.0 - SPLIT_Y_MID)
    layer_cad[y1:y2, x1:x2] = (180, 180, 245)
    alpha[y1:y2, x1:x2] = 0.50
    
    # Kaiten slots: Y=108.0, 124.5
    for cy in [108.0, 124.5]:
        for cx in [218.0, 235.0, 252.0, 269.0]:
            draw_slot(layer_cad, cx, cy)

    # Systems Status slots: Y=151.0, 168.0, 185.0
    for cy in [151.0, 168.0, 185.0]:
        for cx in [218.0, 235.0, 252.0, 269.0]:
            draw_slot(layer_cad, cx, cy)

    # -------------------------------------------------------------------------
    # 5. PIEZA 5 (Main Left Module: 0 to 158 mm, 21.5 to 215.0 mm)
    # -------------------------------------------------------------------------
    x1, y1, x2, y2 = to_box_px(0, SPLIT_Y_TOP, SPLIT_X1, 215.0 - SPLIT_Y_TOP)
    layer_cad[y1:y2, x1:x2] = (225, 195, 215)
    alpha[y1:y2, x1:x2] = 0.50
    
    # Submarine profile cutout window:
    wx1, wy1, wx2, wy2 = to_box_px(28.0, 25.0, 128.0, 38.0)
    layer_cad[wy1:wy2, wx1:wx2] = 0
    alpha[wy1:wy2, wx1:wx2] = 0.0
    
    # Left base/mission/port slots (centered on printed boxes at X=13.8 mm):
    for cy in [31.2, 52.8, 74.5]:
        draw_slot(layer_cad, 13.8, cy)

    # Patrol track slots (ALL 7 SLOTS, including Transit end at X=165.58):
    patrol_cx_list = [63.67, 80.65, 97.63, 114.61, 131.58, 148.52, 165.58]
    for cx in patrol_cx_list:
        draw_slot(layer_cad, cx, 74.9)

    # Damage Tracks:
    # Flooding line (Y=118.4)
    draw_slot(layer_cad, 26.26, 118.4)
    for cx in [43.1, 60.1, 77.1, 94.1, 111.1, 128.1, 145.1, 162.1]:
        draw_slot(layer_cad, cx, 118.4)
    # SUNK box:
    draw_slot(layer_cad, 179.16, 118.4)

    # Hull Damage line (Y=135.4)
    draw_slot(layer_cad, 26.26, 135.4)
    for cx in [43.1, 60.1, 77.1, 94.1, 111.1, 128.1, 145.1, 162.1]:
        draw_slot(layer_cad, cx, 135.4)

    # -------------------------------------------------------------------------
    # BLEND CAD LAYER OVER SCANNED CARD
    # -------------------------------------------------------------------------
    alpha_3d = np.repeat(alpha[:, :, np.newaxis], 3, axis=2)
    blended = (card_bgr * (1.0 - alpha_3d) + layer_cad * alpha_3d).astype(np.uint8)
    
    # -------------------------------------------------------------------------
    # DRAW CRISP CAD BOUNDARIES & CUTLINES
    # -------------------------------------------------------------------------
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

    # Top strip slots
    for cx in [217.54, 252.12, 269.17]:
        draw_slot_border(blended, cx, 11.78)
        
    # Torpedo slots
    for cx in [218.18, 235.15, 252.12, 269.17]:
        draw_slot_border(blended, cx, 31.27)
    for cx in [218.18, 235.15]:
        draw_slot_border(blended, cx, 48.15)
        
    # Damage tracks
    for cy in [118.4, 135.4]:
        draw_slot_border(blended, 26.26, cy)
        for cx in [43.1, 60.1, 77.1, 94.1, 111.1, 128.1, 145.1, 162.1]:
            draw_slot_border(blended, cx, cy)
    draw_slot_border(blended, 179.16, 118.4)

    # Kaiten & Systems
    for cy in [108.0, 124.5, 151.0, 168.0, 185.0]:
        for cx in [218.0, 235.0, 252.0, 269.0]:
            draw_slot_border(blended, cx, cy)

    # Base & Patrol (ALL 7 SLOTS)
    for cy in [31.2, 52.8, 74.5]:
        draw_slot_border(blended, 13.8, cy)
    for cx in patrol_cx_list:
        draw_slot_border(blended, cx, 74.9)

    # Cutout Windows
    def draw_window_rect(img, x_mm, y_mm, w_mm, h_mm, color=(0, 180, 0), label=""):
        x1, y1, x2, y2 = to_box_px(x_mm, y_mm, w_mm, h_mm)
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)
        if label:
            cv2.putText(img, label, (x1 + 10, y1 + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2, cv2.LINE_AA)

    draw_window_rect(blended, 6.5, 2.0, 61.5, 18.0, (200, 100, 0), "VENTANA: LOGO SENSUIKAN")
    draw_window_rect(blended, 70.0, 3.5, 88.0, 17.5, (0, 160, 0), "VENTANA: TITULO JUNSEN J.3")
    draw_window_rect(blended, 188.5, 7.5, 19.5, 11.5, (220, 80, 0), "AIRCRAFT")
    draw_window_rect(blended, 28.0, 25.0, 128.0, 38.0, (0, 120, 220), "VENTANA: SILUETA SUBMARINO")

    # Split lines
    sx_px = to_px(SPLIT_X1, 0)[0]
    cv2.line(blended, (sx_px, 0), (sx_px, H), (255, 0, 255), 4)
    cv2.putText(blended, "CORTE X = 158.0 mm (DIVISION MODULAR)", (sx_px - 450, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 255), 2, cv2.LINE_AA)
    
    sy_top_px = to_px(0, SPLIT_Y_TOP)[1]
    cv2.line(blended, (0, sy_top_px), (W, sy_top_px), (0, 0, 255), 4)
    cv2.putText(blended, "CORTE Y = 21.5 mm (FRANJA LIBRE ENTRE AVION Y TUBOS)", (100, sy_top_px - 15), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2, cv2.LINE_AA)

    # Outer Board Frame (280 x 215 mm)
    cv2.rectangle(blended, (0, 0), (W - 1, H - 1), (0, 255, 255), 4)

    # Save output
    output_path = 'images/analysis/overlay_real_scan_junsen_j3.png'
    cv2.imwrite(output_path, blended)
    artifact_path = 'C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/overlay_real_scan_junsen_j3.png'
    cv2.imwrite(artifact_path, blended)
    
    # Save zoomed crop of Left Margin:
    crop_left_margin = blended[0:to_px(0, 80)[1], 0:to_px(40, 0)[0]]
    cv2.imwrite('C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/overlay_crop_left_margin.png', crop_left_margin)

    # Save zoomed crop of Patrol Track (showing all 7 boxes):
    crop_patrol_track = blended[to_px(0, 60)[1]:to_px(0, 90)[1], to_px(50, 0)[0]:to_px(180, 0)[0]]
    cv2.imwrite('C:/Users/Richard/.gemini/antigravity/brain/1857cc84-1069-4de5-aff1-963f64c0c673/overlay_crop_patrol_7boxes.png', crop_patrol_track)

    print('Successfully re-generated overlay with exact physical edge and all 7 patrol boxes!')

if __name__ == '__main__':
    create_superposition_overlay()
