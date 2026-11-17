import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from matplotlib import patheffects

def draw_watermark(ax, cx, cy, icon_name, color, alpha=0.30, size=9.0):
    s = size / 2.0 # half size
    z = 3.3
    lw = 1.2
    
    if icon_name == "anchor_sakura": # Captain
        # Shank (vertical)
        ax.plot([cx, cx], [cy - 0.7*s, cy + 0.6*s], color=color, lw=lw*1.3, alpha=alpha, zorder=z)
        # Stock (horizontal crossbar)
        ax.plot([cx - 0.5*s, cx + 0.5*s], [cy + 0.35*s, cy + 0.35*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Ring at top
        ring = patches.Circle((cx, cy + 0.65*s), 0.2*s, edgecolor=color, facecolor='none', lw=lw, alpha=alpha, zorder=z)
        ax.add_patch(ring)
        # Curved flukes
        t = np.linspace(-np.pi*0.8, -np.pi*0.2, 25)
        ax.plot(cx + 0.7*s*np.cos(t), cy + 0.05*s + 0.7*s*np.sin(t), color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        # Sakura flower / star in center
        ax.plot([cx - 0.15*s, cx + 0.15*s], [cy - 0.05*s, cy - 0.05*s], color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        ax.plot([cx, cx], [cy - 0.2*s, cy + 0.1*s], color=color, lw=lw*1.5, alpha=alpha, zorder=z)

    elif icon_name == "gear_wrench": # Engineer
        # Gear wheel outer circle
        gear = patches.Circle((cx, cy), 0.5*s, edgecolor=color, facecolor='none', lw=lw*1.2, alpha=alpha, zorder=z)
        ax.add_patch(gear)
        hub = patches.Circle((cx, cy), 0.2*s, edgecolor=color, facecolor='none', lw=lw, alpha=alpha, zorder=z)
        ax.add_patch(hub)
        # 6 teeth
        for ang in np.linspace(0, 2*np.pi, 7)[:-1]:
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx + 0.45*s*dx, cx + 0.68*s*dx], [cy + 0.45*s*dy, cy + 0.68*s*dy], color=color, lw=lw*1.8, alpha=alpha, zorder=z)
        # Wrench crossing diagonally
        ax.plot([cx - 0.6*s, cx + 0.6*s], [cy - 0.6*s, cy + 0.6*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.plot([cx + 0.45*s, cx + 0.65*s], [cy + 0.65*s, cy + 0.45*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)

    elif icon_name == "ship_wheel": # XO
        # Inner & outer rings
        ax.add_patch(patches.Circle((cx, cy), 0.55*s, edgecolor=color, facecolor='none', lw=lw*1.3, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.2*s, edgecolor=color, facecolor='none', lw=lw*1.3, alpha=alpha, zorder=z))
        # 8 spokes with extending handles
        for ang in np.linspace(0, 2*np.pi, 9)[:-1]:
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx, cx + 0.78*s*dx], [cy, cy + 0.78*s*dy], color=color, lw=lw, alpha=alpha, zorder=z)

    elif icon_name == "sextant": # Nav
        # Curved arc at bottom
        t = np.linspace(-np.pi*0.75, -np.pi*0.25, 25)
        ax.plot(cx + 0.7*s*np.cos(t), cy + 0.4*s + 0.7*s*np.sin(t), color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Pivot point at top
        pivot_y = cy + 0.4*s
        ax.plot([cx, cx - 0.45*s], [pivot_y, cy - 0.2*s], color=color, lw=lw, alpha=alpha, zorder=z)
        ax.plot([cx, cx + 0.45*s], [pivot_y, cy - 0.2*s], color=color, lw=lw, alpha=alpha, zorder=z)
        # Index arm
        ax.plot([cx, cx], [pivot_y, cy - 0.3*s], color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        # Small mirror/sight
        ax.plot([cx - 0.2*s, cx + 0.2*s], [cy + 0.1*s, cy + 0.1*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)

    elif icon_name == "medical_cross_anchor": # Medic
        # Bold medical cross (+)
        cw = 0.22*s
        cl = 0.65*s
        # Vertical bar
        v_bar = patches.Rectangle((cx - cw/2, cy - cl/2), cw, cl, facecolor=color, edgecolor='none', alpha=alpha*1.2, zorder=z)
        # Horizontal bar
        h_bar = patches.Rectangle((cx - cl/2, cy - cw/2), cl, cw, facecolor=color, edgecolor='none', alpha=alpha*1.2, zorder=z)
        ax.add_patch(v_bar)
        ax.add_patch(h_bar)
        # Thin circle border around it
        ax.add_patch(patches.Circle((cx, cy), 0.6*s, edgecolor=color, facecolor='none', lw=lw*0.8, alpha=alpha, zorder=z))

    elif icon_name == "sailors_trio": # Crew
        # Three sailor caps & heads stepped
        positions = [(-0.35*s, -0.1*s), (0.0, 0.1*s), (0.35*s, -0.1*s)]
        for ox, oy in positions:
            # Head circle
            ax.add_patch(patches.Circle((cx + ox, cy + oy), 0.22*s, facecolor=color, edgecolor='none', alpha=alpha*0.9, zorder=z))
            # Sailor cap brim
            ax.plot([cx + ox - 0.28*s, cx + ox + 0.28*s], [cy + oy + 0.1*s, cy + oy + 0.1*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
            # Body shoulders
            t_body = np.linspace(0, np.pi, 15)
            ax.plot(cx + ox + 0.25*s*np.cos(t_body), cy + oy - 0.25*s + 0.15*s*np.sin(t_body), color=color, lw=lw, alpha=alpha, zorder=z)

    elif icon_name == "chevrons": # Crew Quality
        # 3 stacked chevrons
        for dy in [-0.35*s, 0.0, 0.35*s]:
            ax.plot([cx - 0.5*s, cx, cx + 0.5*s], [cy + dy + 0.15*s, cy + dy - 0.15*s, cy + dy + 0.15*s],
                    color=color, lw=lw*2.0, alpha=alpha*1.3, zorder=z)

    elif icon_name == "pilot_wings": # Pilot
        # Central propeller / circle
        ax.add_patch(patches.Circle((cx, cy), 0.18*s, facecolor=color, edgecolor='none', alpha=alpha*1.3, zorder=z))
        # Wings extending left & right
        ax.plot([cx - 0.8*s, cx - 0.15*s, cx, cx + 0.15*s, cx + 0.8*s],
                [cy + 0.2*s, cy + 0.05*s, cy, cy + 0.05*s, cy + 0.2*s], color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        ax.plot([cx - 0.75*s, cx - 0.15*s, cx, cx + 0.15*s, cx + 0.75*s],
                [cy - 0.05*s, cy - 0.05*s, cy, cy - 0.05*s, cy - 0.05*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)

    elif icon_name == "torpedo_long_lance": # T-1..T-8
        # Horizontal torpedo body
        # Rounded nose
        t = np.linspace(-np.pi/2, np.pi/2, 15)
        ax.plot(cx + 0.5*s + 0.18*s*np.cos(t), cy + 0.18*s*np.sin(t), color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        # Cylinder body lines
        ax.plot([cx - 0.5*s, cx + 0.5*s], [cy + 0.18*s, cy + 0.18*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.plot([cx - 0.5*s, cx + 0.5*s], [cy - 0.18*s, cy - 0.18*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Warhead separation band
        ax.plot([cx + 0.25*s, cx + 0.25*s], [cy - 0.18*s, cy + 0.18*s], color=color, lw=lw*1.0, alpha=alpha, zorder=z)
        # Tail fins
        ax.plot([cx - 0.5*s, cx - 0.7*s], [cy + 0.18*s, cy + 0.35*s], color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        ax.plot([cx - 0.5*s, cx - 0.7*s], [cy - 0.18*s, cy - 0.35*s], color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        # Twin propellers
        ax.plot([cx - 0.7*s, cx - 0.7*s], [cy - 0.25*s, cy + 0.25*s], color=color, lw=lw*1.8, alpha=alpha, zorder=z)

    elif icon_name == "twin_torpedoes_rack": # Rld Fwd / Rld Aft
        for dy in [-0.28*s, 0.28*s]:
            ax.plot([cx - 0.6*s, cx + 0.45*s], [cy + dy, cy + dy], color=color, lw=lw*2.2, alpha=alpha, zorder=z)
            ax.plot([cx + 0.45*s, cx + 0.65*s], [cy + dy, cy + dy], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Vertical rack stanchions
        ax.plot([cx - 0.3*s, cx - 0.3*s], [cy - 0.45*s, cy + 0.45*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        ax.plot([cx + 0.2*s, cx + 0.2*s], [cy - 0.45*s, cy + 0.45*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)

    elif icon_name == "contact_mine": # Mines
        # Spherical body
        ax.add_patch(patches.Circle((cx, cy + 0.05*s), 0.38*s, edgecolor=color, facecolor='none', lw=lw*1.4, alpha=alpha, zorder=z))
        # 6 contact horns
        for ang in np.linspace(0, 2*np.pi, 7)[:-1]:
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx + 0.38*s*dx, cx + 0.65*s*dx], [cy + 0.05*s + 0.38*s*dy, cy + 0.05*s + 0.65*s*dy],
                    color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        # Mooring shackle at bottom
        ax.plot([cx - 0.15*s, cx + 0.15*s], [cy - 0.38*s, cy - 0.38*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.plot([cx, cx], [cy - 0.38*s, cy - 0.6*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)

    elif icon_name == "watertight_hatch": # Mine Door / Doors
        # Outer heavy hatch rim
        ax.add_patch(patches.Circle((cx, cy), 0.65*s, edgecolor=color, facecolor='none', lw=lw*1.5, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.45*s, edgecolor=color, facecolor='none', lw=lw*0.9, alpha=alpha, zorder=z))
        # Handwheel spokes (3 spokes at 120 deg)
        for ang in [0, 2*np.pi/3, 4*np.pi/3]:
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx, cx + 0.45*s*dx], [cy, cy + 0.45*s*dy], color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        # Central locking hub
        ax.add_patch(patches.Circle((cx, cy), 0.12*s, facecolor=color, edgecolor='none', alpha=alpha*1.4, zorder=z))

    elif icon_name == "deck_gun_140mm": # Main Gun
        # Turntable mount base
        ax.plot([cx - 0.5*s, cx + 0.3*s], [cy - 0.45*s, cy - 0.45*s], color=color, lw=lw*2.2, alpha=alpha, zorder=z)
        # Gun carriage / shield
        ax.plot([cx - 0.4*s, cx - 0.1*s, cx + 0.1*s, cx - 0.2*s, cx - 0.4*s],
                [cy - 0.45*s, cy + 0.1*s, cy + 0.1*s, cy - 0.45*s, cy - 0.45*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Cannon barrel elevated at ~30 degrees
        ang = np.radians(32)
        blen = 0.95*s
        ax.plot([cx - 0.05*s, cx - 0.05*s + blen*np.cos(ang)],
                [cy, cy + blen*np.sin(ang)], color=color, lw=lw*2.2, alpha=alpha, zorder=z)
        # Recoil cylinder
        ax.plot([cx - 0.05*s, cx - 0.05*s + 0.4*s*np.cos(ang)],
                [cy - 0.08*s, cy - 0.08*s + 0.4*s*np.sin(ang)], color=color, lw=lw*1.4, alpha=alpha, zorder=z)

    elif icon_name == "artillery_shell": # Ammo
        # Artillery cartridge & shell
        # Shell ogive (pointed tip)
        ax.plot([cx - 0.2*s, cx, cx + 0.2*s], [cy + 0.25*s, cy + 0.7*s, cy + 0.25*s], color=color, lw=lw*1.5, alpha=alpha, zorder=z)
        # Case body
        ax.plot([cx - 0.22*s, cx - 0.24*s, cx + 0.24*s, cx + 0.22*s, cx - 0.22*s],
                [cy + 0.25*s, cy - 0.6*s, cy - 0.6*s, cy + 0.25*s, cy + 0.25*s], color=color, lw=lw*1.3, alpha=alpha, zorder=z)
        # Rimmed primer base
        ax.plot([cx - 0.3*s, cx + 0.3*s], [cy - 0.6*s, cy - 0.6*s], color=color, lw=lw*2.2, alpha=alpha, zorder=z)

    elif icon_name == "aa_gun_25mm": # AA 1 / AA 2
        # Pedestal base
        ax.plot([cx - 0.35*s, cx + 0.15*s], [cy - 0.5*s, cy - 0.5*s], color=color, lw=lw*2.0, alpha=alpha, zorder=z)
        # Twin elevated barrels at 60 deg
        ang = np.radians(60)
        for offset in [-0.08*s, 0.08*s]:
            bx = cx - 0.1*s + offset * np.sin(ang)
            by = cy - 0.1*s - offset * np.cos(ang)
            ax.plot([bx, bx + 0.85*s*np.cos(ang)], [by, by + 0.85*s*np.sin(ang)], color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        # Flash suppressors
        ax.plot([cx - 0.1*s + 0.85*s*np.cos(ang) - 0.12*s*np.sin(ang), cx - 0.1*s + 0.85*s*np.cos(ang) + 0.12*s*np.sin(ang)],
                [cy - 0.1*s + 0.85*s*np.sin(ang) + 0.12*s*np.cos(ang), cy - 0.1*s + 0.85*s*np.sin(ang) - 0.12*s*np.cos(ang)],
                color=color, lw=lw*2.0, alpha=alpha, zorder=z)

    elif icon_name == "floatplane_topview": # Avion
        # Fuselage
        ax.plot([cx, cx], [cy - 0.65*s, cy + 0.65*s], color=color, lw=lw*1.8, alpha=alpha, zorder=z)
        # Main wing
        ax.plot([cx - 0.75*s, cx + 0.75*s], [cy + 0.15*s, cy + 0.15*s], color=color, lw=lw*2.0, alpha=alpha, zorder=z)
        # Tailplane
        ax.plot([cx - 0.35*s, cx + 0.35*s], [cy - 0.5*s, cy - 0.5*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Twin floats
        for fx in [-0.3*s, 0.3*s]:
            ax.plot([cx + fx, cx + fx], [cy - 0.2*s, cy + 0.45*s], color=color, lw=lw*1.6, alpha=alpha, zorder=z)

    elif icon_name == "diesel_engine_pistons": # Eng 1 / Eng 2
        # Engine block outline
        ax.plot([cx - 0.55*s, cx + 0.55*s, cx + 0.55*s, cx - 0.55*s, cx - 0.55*s],
                [cy - 0.45*s, cy - 0.45*s, cy + 0.45*s, cy + 0.45*s, cy - 0.45*s], color=color, lw=lw*1.3, alpha=alpha, zorder=z)
        # 3 cylinder heads
        for ix in [-0.32*s, 0.0, 0.32*s]:
            ax.plot([cx + ix - 0.1*s, cx + ix + 0.1*s], [cy + 0.55*s, cy + 0.55*s], color=color, lw=lw*1.8, alpha=alpha, zorder=z)
            ax.plot([cx + ix, cx + ix], [cy + 0.45*s, cy + 0.55*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Crankshaft / flywheel line
        ax.plot([cx - 0.55*s, cx + 0.55*s], [cy - 0.15*s, cy - 0.15*s], color=color, lw=lw*1.0, alpha=alpha, zorder=z)

    elif icon_name == "electric_motor_rotor": # Mtr 1 / Mtr 2
        # Stator circle
        ax.add_patch(patches.Circle((cx, cy), 0.55*s, edgecolor=color, facecolor='none', lw=lw*1.4, alpha=alpha, zorder=z))
        # Inner rotor hub
        ax.add_patch(patches.Circle((cx, cy), 0.22*s, edgecolor=color, facecolor='none', lw=lw*1.0, alpha=alpha, zorder=z))
        # Electric lightning bolt
        lx = [cx - 0.1*s, cx + 0.15*s, cx - 0.05*s, cx + 0.15*s]
        ly = [cy + 0.4*s, cy + 0.05*s, cy, cy - 0.4*s]
        ax.plot(lx, ly, color=color, lw=lw*1.6, alpha=alpha*1.3, zorder=z)

    elif icon_name == "battery_cells": # Batt
        # Battery casing
        ax.plot([cx - 0.6*s, cx + 0.6*s, cx + 0.6*s, cx - 0.6*s, cx - 0.6*s],
                [cy - 0.4*s, cy - 0.4*s, cy + 0.35*s, cy + 0.35*s, cy - 0.4*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Terminal posts (+ and -)
        ax.plot([cx - 0.35*s, cx - 0.35*s], [cy + 0.35*s, cy + 0.52*s], color=color, lw=lw*2.0, alpha=alpha, zorder=z)
        ax.plot([cx + 0.35*s, cx + 0.35*s], [cy + 0.35*s, cy + 0.52*s], color=color, lw=lw*2.0, alpha=alpha, zorder=z)
        # +/- signs
        ax.plot([cx - 0.4*s, cx - 0.3*s], [cy + 0.15*s, cy + 0.15*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        ax.plot([cx - 0.35*s, cx - 0.35*s], [cy + 0.1*s, cy + 0.2*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        ax.plot([cx + 0.3*s, cx + 0.4*s], [cy + 0.15*s, cy + 0.15*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Electrode plates
        for px in [-0.15*s, 0.0, 0.15*s]:
            ax.plot([cx + px, cx + px], [cy - 0.25*s, cy + 0.2*s], color=color, lw=lw*1.0, alpha=alpha, zorder=z)

    elif icon_name == "fuel_drop_tank": # Fuel
        # Stylized fluid droplet
        # Pointed tip at top
        ax.plot([cx, cx - 0.3*s], [cy + 0.55*s, cy], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.plot([cx, cx + 0.3*s], [cy + 0.55*s, cy], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Rounded bulb at bottom
        t = np.linspace(-np.pi, 0, 20)
        ax.plot(cx + 0.3*s*np.cos(t), cy + 0.3*s*np.sin(t), color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Liquid surface waves
        ax.plot([cx - 0.2*s, cx + 0.2*s], [cy - 0.1*s, cy - 0.1*s], color=color, lw=lw*1.0, alpha=alpha, zorder=z)

    elif icon_name == "radio_antenna_waves": # Radio
        # Center antenna mast
        ax.plot([cx, cx], [cy - 0.55*s, cy + 0.55*s], color=color, lw=lw*1.8, alpha=alpha, zorder=z)
        # Top sphere
        ax.add_patch(patches.Circle((cx, cy + 0.55*s), 0.1*s, facecolor=color, edgecolor='none', alpha=alpha*1.4, zorder=z))
        # Concentric wave arcs left & right
        for r in [0.28*s, 0.5*s, 0.72*s]:
            t_left = np.linspace(np.pi*0.65, np.pi*1.35, 15)
            ax.plot(cx + r*np.cos(t_left), cy + 0.4*s + r*np.sin(t_left), color=color, lw=lw*1.2, alpha=alpha, zorder=z)
            t_right = np.linspace(-np.pi*0.35, np.pi*0.35, 15)
            ax.plot(cx + r*np.cos(t_right), cy + 0.4*s + r*np.sin(t_right), color=color, lw=lw*1.2, alpha=alpha, zorder=z)

    elif icon_name == "hydrophone_sonar_cone": # Hydro
        # Acoustic sensor dome
        ax.add_patch(patches.Circle((cx - 0.35*s, cy), 0.22*s, facecolor=color, edgecolor='none', alpha=alpha*1.3, zorder=z))
        # Concentric sonar pulses expanding rightward
        for r in [0.35*s, 0.6*s, 0.85*s]:
            t = np.linspace(-np.pi*0.3, np.pi*0.3, 15)
            ax.plot(cx - 0.35*s + r*np.cos(t), cy + r*np.sin(t), color=color, lw=lw*1.5, alpha=alpha, zorder=z)

    elif icon_name == "periscope_crosshair": # Perisc
        # Reticle circle
        ax.add_patch(patches.Circle((cx, cy), 0.6*s, edgecolor=color, facecolor='none', lw=lw*1.4, alpha=alpha, zorder=z))
        # Inner circle
        ax.add_patch(patches.Circle((cx, cy), 0.2*s, edgecolor=color, facecolor='none', lw=lw*0.8, alpha=alpha, zorder=z))
        # Crosshairs
        ax.plot([cx - 0.75*s, cx + 0.75*s], [cy, cy], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        ax.plot([cx, cx], [cy - 0.75*s, cy + 0.75*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Azimuth graduation ticks
        for ang in np.linspace(0, 2*np.pi, 13)[:-1]:
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx + 0.53*s*dx, cx + 0.6*s*dx], [cy + 0.53*s*dy, cy + 0.6*s*dy], color=color, lw=lw*1.0, alpha=alpha, zorder=z)

    elif icon_name == "dive_planes_arrows": # Dive Planes / Planes
        # Horizontal hydrofoil wing
        ax.plot([cx - 0.65*s, cx + 0.65*s], [cy, cy], color=color, lw=lw*2.4, alpha=alpha, zorder=z)
        # Up arrow (emersion)
        ax.plot([cx - 0.35*s, cx - 0.35*s], [cy, cy + 0.5*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.plot([cx - 0.45*s, cx - 0.35*s, cx - 0.25*s], [cy + 0.35*s, cy + 0.5*s, cy + 0.35*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Down arrow (immersion)
        ax.plot([cx + 0.35*s, cx + 0.35*s], [cy, cy - 0.5*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.plot([cx + 0.25*s, cx + 0.35*s, cx + 0.45*s], [cy - 0.35*s, cy - 0.5*s, cy - 0.35*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)

    elif icon_name == "tactical_question_shield": # EVT 1 / EVT 2
        # Tactical shield / diamond
        ax.plot([cx, cx + 0.6*s, cx, cx - 0.6*s, cx],
                [cy + 0.6*s, cy, cy - 0.6*s, cy, cy + 0.6*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        # Stylized question mark
        t = np.linspace(-np.pi*0.4, np.pi*1.2, 15)
        ax.plot(cx + 0.15*s*np.cos(t), cy + 0.25*s + 0.15*s*np.sin(t), color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        ax.plot([cx, cx], [cy + 0.1*s, cy - 0.05*s], color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        ax.add_patch(patches.Circle((cx, cy - 0.25*s), 0.06*s, facecolor=color, edgecolor='none', alpha=alpha*1.4, zorder=z))

    elif icon_name == "supply_crates": # Supplies
        # Two wooden cargo crates with bands
        # Lower crate
        ax.plot([cx - 0.55*s, cx + 0.15*s, cx + 0.15*s, cx - 0.55*s, cx - 0.55*s],
                [cy - 0.55*s, cy - 0.55*s, cy + 0.05*s, cy + 0.05*s, cy - 0.55*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        # Cross diagonal straps
        ax.plot([cx - 0.55*s, cx + 0.15*s], [cy - 0.55*s, cy + 0.05*s], color=color, lw=lw*0.8, alpha=alpha, zorder=z)
        # Upper crate offset
        ax.plot([cx - 0.15*s, cx + 0.55*s, cx + 0.55*s, cx - 0.15*s, cx - 0.15*s],
                [cy - 0.05*s, cy - 0.05*s, cy + 0.55*s, cy + 0.55*s, cy - 0.05*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        ax.plot([cx - 0.15*s, cx + 0.55*s], [cy + 0.55*s, cy - 0.05*s], color=color, lw=lw*0.8, alpha=alpha, zorder=z)

    elif icon_name == "anchored_anchor": # Base / Port
        # Heavy admiralty anchor
        ax.plot([cx, cx], [cy - 0.65*s, cy + 0.55*s], color=color, lw=lw*1.6, alpha=alpha, zorder=z)
        ax.plot([cx - 0.5*s, cx + 0.5*s], [cy + 0.3*s, cy + 0.3*s], color=color, lw=lw*1.4, alpha=alpha, zorder=z)
        ax.add_patch(patches.Circle((cx, cy + 0.6*s), 0.18*s, edgecolor=color, facecolor='none', lw=lw*1.1, alpha=alpha, zorder=z))
        t = np.linspace(-np.pi*0.8, -np.pi*0.2, 25)
        ax.plot(cx + 0.7*s*np.cos(t), cy + 0.05*s + 0.7*s*np.sin(t), color=color, lw=lw*1.8, alpha=alpha, zorder=z)

    elif icon_name == "tactical_target_grid": # Mission
        # Radar target circle & compass
        ax.add_patch(patches.Circle((cx, cy), 0.6*s, edgecolor=color, facecolor='none', lw=lw*1.3, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.3*s, edgecolor=color, facecolor='none', lw=lw*0.9, alpha=alpha, zorder=z))
        ax.plot([cx - 0.75*s, cx + 0.75*s], [cy, cy], color=color, lw=lw*1.0, alpha=alpha, zorder=z)
        ax.plot([cx, cx], [cy - 0.75*s, cy + 0.75*s], color=color, lw=lw*1.0, alpha=alpha, zorder=z)

    elif icon_name == "submarine_wake": # Transit / On Stat
        # Small submarine top silhouette
        ax.plot([cx, cx], [cy - 0.4*s, cy + 0.45*s], color=color, lw=lw*2.2, alpha=alpha*1.3, zorder=z)
        # Expanding V wake waves
        for dy, w in [(0.2*s, 0.35*s), (-0.05*s, 0.55*s), (-0.3*s, 0.75*s)]:
            ax.plot([cx - w, cx, cx + w], [cy + dy - 0.2*s, cy + dy, cy + dy - 0.2*s],
                    color=color, lw=lw*1.0, alpha=alpha, zorder=z)

    elif icon_name == "naval_pressure_gauge": # Flood Marker / Pressure Gauge
        ax.add_patch(patches.Circle((cx, cy), 0.6*s, edgecolor=color, facecolor='none', lw=lw*1.6, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.52*s, edgecolor=color, facecolor='none', lw=lw*0.8, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.1*s, facecolor=color, edgecolor='none', alpha=alpha*1.5, zorder=z))
        for ang in np.linspace(-np.pi*0.75, np.pi*0.75, 11):
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx + 0.4*s*dx, cx + 0.5*s*dx], [cy + 0.4*s*dy, cy + 0.5*s*dy], color=color, lw=lw*1.0, alpha=alpha, zorder=z)
        nang = np.radians(45)
        ax.plot([cx - 0.1*s*np.cos(nang), cx + 0.48*s*np.cos(nang)],
                [cy - 0.1*s*np.sin(nang), cy + 0.48*s*np.sin(nang)], color=color, lw=lw*2.0, alpha=alpha*1.4, zorder=z)

    elif icon_name == "hull_stress_dial": # Hull Marker / Depth Stress Dial
        ax.add_patch(patches.Circle((cx, cy), 0.62*s, edgecolor=color, facecolor='none', lw=lw*1.8, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.52*s, edgecolor=color, facecolor='none', lw=lw*0.8, alpha=alpha, zorder=z))
        ax.add_patch(patches.Circle((cx, cy), 0.1*s, facecolor=color, edgecolor='none', alpha=alpha*1.5, zorder=z))
        # Cracked glass spiderweb lines
        ax.plot([cx, cx + 0.4*s], [cy, cy + 0.35*s], color=color, lw=lw*1.2, alpha=alpha*1.2, zorder=z)
        ax.plot([cx + 0.2*s, cx + 0.45*s], [cy + 0.17*s, cy + 0.05*s], color=color, lw=lw*0.8, alpha=alpha, zorder=z)
        ax.plot([cx, cx - 0.4*s], [cy, cy - 0.3*s], color=color, lw=lw*1.2, alpha=alpha*1.2, zorder=z)
        ax.plot([cx - 0.18*s, cx - 0.35*s], [cy - 0.13*s, cy + 0.1*s], color=color, lw=lw*0.8, alpha=alpha, zorder=z)
        # Submarine silhouette needle
        ax.plot([cx - 0.45*s, cx + 0.45*s], [cy, cy], color=color, lw=lw*2.2, alpha=alpha*1.4, zorder=z)
        ax.plot([cx - 0.05*s, cx + 0.05*s], [cy + 0.18*s, cy + 0.18*s], color=color, lw=lw*1.5, alpha=alpha*1.4, zorder=z)
        ax.plot([cx, cx], [cy, cy + 0.18*s], color=color, lw=lw*1.2, alpha=alpha*1.4, zorder=z)

    elif icon_name == "medal_golden_kite": # Crew Quality / Order of the Golden Kite
        # Ribbon bar top
        ax.plot([cx - 0.35*s, cx + 0.35*s, cx + 0.35*s, cx - 0.35*s, cx - 0.35*s],
                [cy + 0.18*s, cy + 0.18*s, cy + 0.65*s, cy + 0.65*s, cy + 0.18*s], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
        ax.plot([cx - 0.12*s, cx - 0.12*s], [cy + 0.18*s, cy + 0.65*s], color=color, lw=lw*0.8, alpha=alpha, zorder=z)
        ax.plot([cx + 0.12*s, cx + 0.12*s], [cy + 0.18*s, cy + 0.65*s], color=color, lw=lw*0.8, alpha=alpha, zorder=z)
        ax.add_patch(patches.Circle((cx, cy + 0.13*s), 0.07*s, edgecolor=color, facecolor='none', lw=lw*0.9, alpha=alpha, zorder=z))
        # Medallion circle
        ax.add_patch(patches.Circle((cx, cy - 0.22*s), 0.36*s, edgecolor=color, facecolor='none', lw=lw*1.4, alpha=alpha, zorder=z))
        # Golden Kite / Imperial 8-ray star
        for ang in np.linspace(0, 2*np.pi, 9)[:-1]:
            dx = np.cos(ang)
            dy = np.sin(ang)
            ax.plot([cx, cx + 0.28*s*dx], [cy - 0.22*s, cy - 0.22*s + 0.28*s*dy], color=color, lw=lw*1.2, alpha=alpha, zorder=z)
