with open('app/partials/06_tab_compendium.html', 'r', encoding='utf-8') as f:
    c = f.read()

keys = [
    'comp-sec2-main-title', 'comp-b1-title', 'comp-b2-title', 'comp-b3-title',
    'comp-b4-title', 'comp-b5-title', 'comp-b7-crew-injury-title', 'comp-b7-crew-station',
    'comp-t1-title', 'comp-t1-subtitle', 'comp-t4-title', 'comp-t4-subtitle',
    'comp-t4-leg-nopoint', 'comp-t4-leg-1point', 'comp-t4-leg-2point'
]
for k in keys:
    print(f'id="{k}" in compendium.html: {k in c}')
