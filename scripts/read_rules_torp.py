import pypdf

reader = pypdf.PdfReader('Sensuikan KS Rules Download.pdf')
for p in [7, 8, 9, 28, 29, 30]:
    if p <= len(reader.pages):
        print(f"--- PAGE {p} ---")
        txt = reader.pages[p-1].extract_text()
        for line in txt.split('\n'):
            if any(term in line.lower() for term in ['torpedo', 'reload', 'tube', 'kd', 'junsen', 'type', 'sen-']):
                print(line)
