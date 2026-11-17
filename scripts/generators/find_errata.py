import os

keywords = ['errata', 'erratas', 'erratum']
found = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or '.gemini' in root or '__pycache__' in root:
        continue
    for f in files:
        if f.endswith(('.txt', '.md', '.json', '.py')):
            p = os.path.join(root, f)
            try:
                with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                    content = fp.read()
                    for kw in keywords:
                        if kw in content.lower():
                            found.append(p)
                            break
            except Exception:
                pass

for f in sorted(found):
    print(f)
