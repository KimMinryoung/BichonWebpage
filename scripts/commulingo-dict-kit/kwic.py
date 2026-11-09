# python3 -I kwic.py <regex> <width> <file> [file ...]: keyword in context, first 4 hits per file.
# Use this instead of grep with {m,n} context patterns (the bundled grep blocks large bounded repeats).
import sys, re
pat, w, files = re.compile(sys.argv[1]), int(sys.argv[2]), sys.argv[3:]
for f in files:
    s = open(f, encoding='utf-8').read()
    for m in list(pat.finditer(s))[:4]:
        print(f'>> {f}:{m.start()}', s[max(0, m.start() - w):m.end() + w].replace('\n', ' ¶ '))
