import json
with open('grid_definition.json') as f:
    grid = json.load(f)

for section, boxes in grid.items():
    print(f"Section {section}: {len(boxes)} boxes")
    if boxes:
        print(f"  Sample box: {boxes[0]}")
