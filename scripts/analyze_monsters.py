import os

def analyze_file(path):
    print(f"\n=================== {path} ({os.path.getsize(path):,} bytes) ===================")
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    print(f"Total lines: {len(lines):,}")
    
    # Check top-level comments or sections
    sections = []
    for idx, line in enumerate(lines):
        if line.startswith('// ===') or line.startswith('/* ===') or line.startswith('function ') or line.startswith('const ') or line.startswith('let ') or line.startswith('var '):
            if any(k in line for k in ['===', 'function', 'const', 'let', 'var']):
                if len(line.strip()) < 80:
                    sections.append((idx+1, line.strip()))
    
    print(f"Found {len(sections)} major declarations/sections. Top 25:")
    for lno, text in sections[:25]:
        print(f"  L{lno:4}: {text}")

analyze_file('app/js/gameflow_phase2.js')
analyze_file('app/js/data.js')
analyze_file('app/i18n.js')
analyze_file('app/js/state.js')
