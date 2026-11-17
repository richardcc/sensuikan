import cv2
import numpy as np
import json
from shapely.geometry import box, Point, Polygon, MultiPolygon
from shapely.ops import unary_union, orient
import mapbox_earcut as earcut
import struct
import os

from sensuikan_generator import extrude_polygon_to_stl, make_dovetail_cut

def build_midget_overlay(width_mm=280.0, height_mm=170.0, counter_size_mm=13.2, notch_radius_mm=1.6):
    img_w, img_h = 525.0, 408.0
    scale_x = width_mm / img_w
    scale_y = height_mm / img_h
    
    main_board = box(0, 0, width_mm, height_mm)
    holes = []
    half_size = counter_size_mm / 2.0
    
    # 1. Title Window
    title_x0 = 120.0 * scale_x
    title_x1 = 340.0 * scale_x
    title_y0 = (img_h - 45.0) * scale_y
    title_y1 = (img_h - 15.0) * scale_y
    holes.append(box(title_x0, title_y0, title_x1, title_y1))
    
    # 2. Large Submarine Cutaway Window
    # The Midget illustration is large: spans x: 60 to 425, y: 45 to 182
    sub_x0 = 60.0 * scale_x
    sub_x1 = 425.0 * scale_x
    sub_y0 = (img_h - 182.0) * scale_y
    sub_y1 = (img_h - 48.0) * scale_y
    holes.append(box(sub_x0, sub_y0, sub_x1, sub_y1))
    
    # 3. Logo Window
    logo_x0 = 18.0 * scale_x
    logo_x1 = 110.0 * scale_x
    logo_y0 = (img_h - 45.0) * scale_y
    logo_y1 = (img_h - 15.0) * scale_y
    holes.append(box(logo_x0, logo_y0, logo_x1, logo_y1))

    # 4. Counter Slots on Midget
    # Attack track:
    attack_boxes = [
        (194, 190), (219, 191), (245, 192), (271, 193),
        (218, 217), (245, 217), (271, 217)
    ]
    # Torpedoes & Crew:
    torp_crew_boxes = [
        (63, 294), (90, 295),
        (142, 324), (170, 325), (197, 325)
    ]
    # Systems matrix (Batteries, Motor, Rudder, Periscope):
    systems_boxes = [
        (432, 248), (457, 248),
        (407, 274), (433, 275), (457, 275),
        (407, 302), (433, 302), (458, 303),
        (408, 329), (434, 330), (460, 330)
    ]
    
    all_slot_coords = attack_boxes + torp_crew_boxes + systems_boxes
    for px, py in all_slot_coords:
        cx_mm = (px + 13.0) * scale_x
        cy_mm = (img_h - (py + 13.0)) * scale_y
        hole_poly = box(cx_mm - half_size, cy_mm - half_size, cx_mm + half_size, cy_mm + half_size)
        notch = Point(cx_mm + half_size, cy_mm).buffer(notch_radius_mm, resolution=8)
        holes.append(hole_poly.union(notch))

    all_holes = unary_union(holes)
    board = main_board.difference(all_holes)
    return board

def generate_midget_stls():
    WIDTH = 280.0
    HEIGHT = 170.0
    TOP_THICKNESS = 2.5
    
    print("Generating Midget Overlay...")
    overlay = build_midget_overlay(WIDTH, HEIGHT)
    extrude_polygon_to_stl(overlay, 0.0, TOP_THICKNESS, "sensuikan_top_overlay_midget_full.stl")
    
    # Split at X = 194.0 mm with dovetails
    split_x = 194.0
    dovetail_y = [160.0, 110.0, 50.0, 10.0]
    tabs = make_dovetail_cut(split_x, dovetail_y, tab_width=11.0, tab_depth=5.0)
    tabs_clearance = tabs.buffer(0.20)
    
    left_cutter = box(-10, -10, split_x, HEIGHT + 10).union(tabs)
    right_cutter = box(split_x, -10, WIDTH + 10, HEIGHT + 10).difference(tabs_clearance)
    
    overlay_left = overlay.intersection(left_cutter)
    overlay_right = overlay.intersection(right_cutter)
    
    extrude_polygon_to_stl(overlay_left, 0.0, TOP_THICKNESS, "sensuikan_top_overlay_midget_left.stl")
    extrude_polygon_to_stl(overlay_right, 0.0, TOP_THICKNESS, "sensuikan_top_overlay_midget_right.stl")
    print("Midget STLs generated successfully!")

if __name__ == "__main__":
    generate_midget_stls()
