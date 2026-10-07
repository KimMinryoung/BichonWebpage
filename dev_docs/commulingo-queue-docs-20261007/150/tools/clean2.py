import json,re,sys
D=sys.argv[1]
pages=[]
for i in range(1765972,1765998):
    t=json.load(open(f'{D}/p{i}.json'))['text'].replace('﻿','').replace('\t',' ')
    L=t.split('\n')
    # strip head line
    k=0
    while not L[k].strip(): k+=1
    L=L[k+1:]
    while L and not L[-1].strip(): L.pop()
    if re.fullmatch(r'\s*\d{3}\s*',L[-1]): L.pop()
    L=[l for l in L if not re.search(r'КПСС м революциях',l)]
    while L and not L[-1].strip(): L.pop()
    pages.append(L)
pages[0]=pages[0][[j for j,l in enumerate(pages[0]) if l.startswith('ОСНОВНЫЕ ПОЛОЖЕНИЯ')][0]:]
lines=[]
for p in pages:
    lines+= [l.rstrip() for l in p]+['<<PB>>']
# build paragraphs
paras=[];cur=[];pending_pb=False
for l in lines:
    if l=='<<PB>>':
        pending_pb=True; continue
    if not l.strip():
        if cur and not pending_pb: paras.append(cur); cur=[]
        continue
    if pending_pb:
        pending_pb=False
        if cur and (cur[-1].endswith('-') or not re.search(r'[.;:!?]\s*$',cur[-1])):
            pass  # continue paragraph
        elif cur:
            paras.append(cur); cur=[]
    cur.append(l.strip())
if cur: paras.append(cur)
words=set(re.findall(r'[А-Яа-яЁё-]+',' '.join(' '.join(p) for p in paras)))
amb=[]
res=[]
for p in paras:
    s=p[0]
    for l in p[1:]:
        if s.endswith('-'):
            m=re.search(r'([А-Яа-яЁё]+)-$',s); n=re.match(r'-?([А-Яа-яЁё]+)',l)
            a=m.group(1) if m else ''; b=n.group(1) if n else ''
            if l.startswith('-'):
                s=s[:-1]+l; continue
            joined=a+b; hyph=a+'-'+b
            if joined in words or joined.lower() in words: s=s[:-1]+l
            elif hyph in words: s=s+l
            elif re.search(r'(о|е)$',a) and len(a)>=5 and re.match(r'[а-яё]+(ий|ый|ой|ая|ое|ые|ых|ым|ыми|их|ими|его|ого|ому|ему|ую|юю|ом|ем)$',b):
                s=s+l; amb.append(('KEEP',hyph))
            else:
                s=s[:-1]+l; amb.append(('JOIN',joined))
        else:
            s=s+' '+l
    s=re.sub(r'\s+',' ',s).strip()
    res.append(s)
open(sys.argv[2],'w').write('\n\n'.join(res)+'\n')
for a in amb: print(*a)
print(len(res), sum(len(x) for x in res), file=sys.stderr)
