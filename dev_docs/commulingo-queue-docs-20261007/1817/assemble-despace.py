# Re-join OCR words split by spurious spaces using pymorphy3 dictionary (greedy longest known match).
# usage: despace.py <ocr.txt> <from> <to>   -> prints lines joined into one stream with paragraph markers kept by line
import sys, re, pymorphy3
m = pymorphy3.MorphAnalyzer()
src = open(sys.argv[1], encoding='utf-8').read().split('\n')
a, b = int(sys.argv[2]), int(sys.argv[3])
# 1) join hyphenated line breaks (soft hyphen or '-') first
text = ''
for ln in src[a-1:b]:
    t = ln.strip()
    if text.endswith('­') or re.search(r'[а-яА-Я]-$', text):
        text = text.rstrip('­').rstrip('-') + t
    else:
        text += ('\n' if text else '') + t
def known(w):
    w2 = w.lower().replace('ё','е')
    return bool(re.fullmatch(r'[а-я]+', w2)) and m.word_is_known(w2)
out_lines = []
for line in text.split('\n'):
    toks = line.split(' ')
    toks = [t for t in toks if t != '']
    res = []; i = 0
    while i < len(toks):
        best = 1
        for j in range(min(len(toks), i+7), i+1, -1):
            parts = toks[i:j]
            core = ''.join(parts)
            m2 = re.fullmatch(r'([«(]?)([А-Яа-яЁё]+)([.,;:»)]*)', core)
            if not m2: continue
            # only inner parts may not carry punctuation
            if any(re.search(r'[.,;:»)]', p) for p in parts[:-1]): continue
            if known(m2.group(2)):
                # avoid merging two independently-known long words
                if all(known(re.sub(r'[^А-Яа-яЁё]', '', p)) and len(re.sub(r'[^А-Яа-яЁё]','',p))>3 for p in parts): continue
                best = j - i; break
        res.append(''.join(toks[i:i+best])); i += best
    out_lines.append(' '.join(res))
print('\n'.join(out_lines))
