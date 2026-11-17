# Gera src/i18n/{pt,es,en,fr,de}.json a partir de tr/*.py e tr/m*.txt (correr na raiz do projeto)
import json, re
g = json.load(open('tr/g_src.json'))          # textos PT dos guias (ordem dos ficheiros g1..g5)
mk = json.load(open('tr/mock_keys.json'))     # textos PT das maquetas (ordem de m1/m2)
G = {}
for i in range(1, 6):
    d = {}; exec(open(f'tr/g{i}.py', encoding='utf-8').read(), d); G.update(d['G'])
M = {}
for f in ['tr/m1.txt', 'tr/m2.txt']:
    for line in open(f, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line: continue
        i, rest = line.split(':', 1); parts = rest.split('|')
        if len(parts) == 8: parts = [parts[k] + '|' + parts[k + 1] for k in range(0, 8, 2)]
        M[int(i)] = parts
CAPS = [l.rstrip('\n').split('|') for l in open('tr/m3.txt', encoding='utf-8') if l.strip()]
langs = ['es', 'en', 'fr', 'de']
# Só exporta os textos de guias que ainda existem no código (marcas retiradas deixam de pesar nos JSON)
SRC = open('src/engine.js', encoding='utf-8').read() + open('src/Guia.jsx', encoding='utf-8').read()
used = lambda t: t in SRC or json.dumps(t, ensure_ascii=False)[1:-1] in SRC
for code in ['pt'] + langs:
    d = {}; exec(open(f'tr/ui_{code}.py', encoding='utf-8').read(), d)
    out = {'ui': d['UI'], 'g': {}, 'm': {}}
    if code != 'pt':
        j = langs.index(code)
        out['g'] = {g[i]: G[i][j] for i in range(len(g)) if used(g[i])}
        out['m'] = {mk[k]: v[j] for k, v in M.items()}
        out['m'].update({r[0]: r[j + 1] for r in CAPS})
    json.dump(out, open(f'src/i18n/{code}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('ok')
