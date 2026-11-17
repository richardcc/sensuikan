with open('app/partials/02_tab_workflow.html', 'r', encoding='utf-8') as f:
    text = f.read()

for btn_id in ['f1-cap-btn', 'f1-xo-btn', 'f1-eng-btn', 'btn-f2-torp', 'btn-f2-comms', 'btn-f2-net']:
    idx = text.find(f'id="{btn_id}"')
    if idx != -1:
        print(f"Found {btn_id} at {idx:,}:")
        print(text[idx-20:idx+250])
    else:
        # Try finding button by onclick
        print(f"NOT FOUND by id: {btn_id}")
