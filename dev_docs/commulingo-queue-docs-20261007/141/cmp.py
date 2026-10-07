import re,sys,difflib
a=open(sys.argv[1]).read()
b=open(sys.argv[2]).read().split('\n')
lo,hi=int(sys.argv[3]),int(sys.argv[4])
b='\n'.join(b[lo-1:hi])
b=re.sub(r'=== PAGE \d+ ===','',b)
b=re.sub(r'[­¬-]\s*\n\s*','',b)  # soft hyphen line breaks
def tok(s):
    s=s.lower().replace('ё','е')
    return re.findall(r'[а-яa-z0-9]+',s)
A,B=tok(a),tok(b)
sm=difflib.SequenceMatcher(None,A,B,autojunk=False)
n=0
for op,i1,i2,j1,j2 in sm.get_opcodes():
    if op=='equal': continue
    x=' '.join(A[i1:i2]); y=' '.join(B[j1:j2])
    if len(x)+len(y)<1: continue
    n+=1
    print(f'{op} A[{i1}] «{x[:300]}» | B «{y[:300]}»')
print('ratio',sm.ratio(),'ops',n,len(A),len(B),file=sys.stderr)
