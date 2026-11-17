import cv2
import numpy as np

# Let's inspect the 17 cards:
# Let's list the classification clearly
classes_info = [
    {
        "id": "j2",
        "name": "Junsen J. 2",
        "type": "Crucero con Aviación",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "j1m",
        "name": "Junsen J. 1M",
        "type": "Crucero con Aviación",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "j3",
        "name": "Junsen J. 3",
        "type": "Crucero con Aviación",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "type_a",
        "name": "Type A",
        "type": "Crucero Mando con Aviación",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "type_a_mod",
        "name": "Type A Modified",
        "type": "Crucero Mando con Aviación",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "type_b",
        "name": "Type B",
        "type": "Submarino Flota con Aviación",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "type_b3",
        "name": "Type B. 3",
        "type": "Submarino Flota con Aviación / Kaiten",
        "planes": 1,
        "tubes": 6,
        "kaiten": 0, # or optional kaiten
        "hangar": True
    },
    {
        "id": "sentoku",
        "name": "Sen-Toku (I-400)",
        "type": "Mega-Submarino Portaaviones",
        "planes": 3,
        "tubes": 8,
        "kaiten": 0,
        "hangar": True
    },
    {
        "id": "type_c",
        "name": "Type C",
        "type": "Submarino Ataque Pesado",
        "planes": 0,
        "tubes": 8,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "c3",
        "name": "Type C. 3",
        "type": "Portador de Kaiten",
        "planes": 0,
        "tubes": 6,
        "kaiten": 6,
        "hangar": False
    },
    {
        "id": "kd3",
        "name": "Kaidai KD. 3",
        "type": "Submarino Flota Ataque",
        "planes": 0,
        "tubes": 8,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "kd4",
        "name": "Kaidai KD. 4",
        "type": "Submarino Flota Ataque",
        "planes": 0,
        "tubes": 6,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "kd5",
        "name": "Kaidai KD. 5",
        "type": "Submarino Flota Ataque",
        "planes": 0,
        "tubes": 6,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "kd6",
        "name": "Kaidai KD. 6",
        "type": "Submarino Flota Ataque",
        "planes": 0,
        "tubes": 6,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "kd7",
        "name": "Kaidai KD. 7",
        "type": "Submarino Flota Ataque",
        "planes": 0,
        "tubes": 6,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "sentaka",
        "name": "Sen-Taka",
        "type": "Submarino Alta Velocidad",
        "planes": 0,
        "tubes": 4,
        "kaiten": 0,
        "hangar": False
    },
    {
        "id": "kiraisen",
        "name": "Kirai-Sen",
        "type": "Submarino Minador",
        "planes": 0,
        "tubes": 4,
        "kaiten": 0,
        "hangar": False
    }
]

print("Classes defined:")
for c in classes_info:
    print(f"  {c['name']:25s} | Planes: {c['planes']} | Tubes: {c['tubes']} | Kaiten: {c['kaiten']} | Hangar: {c['hangar']}")
