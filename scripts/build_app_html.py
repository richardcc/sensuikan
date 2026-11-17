import os

def build_html():
    partials_dir = os.path.join('app', 'partials')
    if not os.path.exists(partials_dir):
        return False
    
    partial_files = sorted([f for f in os.listdir(partials_dir) if f.endswith('.html')])
    if not partial_files:
        return False
    
    parts = []
    for fname in partial_files:
        p = os.path.join(partials_dir, fname)
        with open(p, 'r', encoding='utf-8') as f:
            parts.append(f.read())
            
    full_html = "".join(parts)
    out_path = os.path.join('app', 'index.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    print(f"Built 'app/index.html' from {len(partial_files)} modular partials ({len(full_html):,} bytes).")
    return True

if __name__ == '__main__':
    build_html()
