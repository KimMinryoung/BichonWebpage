# Assemble a clean text from OCR line ranges + overrides + regex fixes.
# usage: assemble.py <ocr.txt> <spec.py> <out.txt>
import re, sys, runpy
src = open(sys.argv[1], encoding='utf-8').read().split('\n')
spec = runpy.run_path(sys.argv[2])
over = spec.get('OVERRIDE', {})
def line(n):
    return over[n] if n in over else src[n-1]
def join(items):
    out = ''
    for it in items:
        if isinstance(it, int): t = line(it)
        elif isinstance(it, tuple): t = None; [ (out := add(out, line(k))) for k in range(it[0], it[1]+1)]; continue
        else: t = it
        out = add(out, t)
    return out
def add(out, t):
    t = t.strip()
    if not t: return out
    if not out: return t
    if out.endswith('­') or re.search(r'[а-яА-Яa-z]-$', out):
        return out.rstrip('­').rstrip('-') + t
    return out + ' ' + t
paras = [join(p) for p in spec['PARAS']]
text = '\n'.join(paras)
for a, b in spec.get('FIX', []):
    n = len(re.findall(a, text))
    if n == 0: print('FIX NO MATCH:', a)
    text = re.sub(a, b, text)
text = re.sub(r'[ \t]+', ' ', text)
open(sys.argv[3], 'w', encoding='utf-8').write(spec.get('HEADER', '') + text + '\n')
print(len(paras), 'paras,', len(text), 'chars')
