# python3 -I scripts/commulingo-dict-kit/fetch-web.py <outdir> key=url [key=url ...]
#   Fetch non-Wikipedia pages one at a time (curl default headers, 60 s timeout, 2 s apart) and save
#   <key>.html plus plain text <key>.txt; a PDF is saved as <key>.pdf (then use pdf2txt.py). Skips keys already fetched.
# python3 -I scripts/commulingo-dict-kit/fetch-web.py --text in.html out.txt   (convert a saved page only)
import sys, os, subprocess, html, re, time
from html.parser import HTMLParser

class T(HTMLParser):
    def __init__(self):
        super().__init__(); self.out = []; self.skip = 0
    def handle_starttag(self, tag, a):
        if tag in ('script', 'style', 'noscript', 'svg'): self.skip += 1
        if tag in ('p', 'br', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'tr', 'td', 'section', 'article', 'blockquote'): self.out.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'noscript', 'svg') and self.skip: self.skip -= 1
    def handle_data(self, d):
        if not self.skip: self.out.append(d)

def to_text(raw):
    try: s = raw.decode('utf-8')
    except UnicodeDecodeError:
        m = re.search(rb'charset=["\']?([\w-]+)', raw[:3000])
        try: s = raw.decode(m.group(1).decode() if m else 'cp1250', 'replace')
        except LookupError: s = raw.decode('utf-8', 'replace')
    p = T(); p.feed(s)
    txt = re.sub(r'[ \t\r\f\v\xa0]+', ' ', ''.join(p.out))
    return re.sub(r'\n\s*\n+', '\n', txt).strip()

if sys.argv[1] == '--text':
    txt = to_text(open(sys.argv[2], 'rb').read()); open(sys.argv[3], 'w', encoding='utf-8').write(txt); print(sys.argv[3], len(txt)); sys.exit()
out_dir = sys.argv[1]; os.makedirs(out_dir, exist_ok=True)
for spec in sys.argv[2:]:
    key, url = spec.split('=', 1)
    h, t = os.path.join(out_dir, key + '.html'), os.path.join(out_dir, key + '.txt')
    if os.path.exists(t) or os.path.exists(os.path.join(out_dir, key + '.pdf')): print('HAVE', key); continue
    r = subprocess.run(['curl', '-sL', '--max-time', '60', '-o', h, '-w', '%{http_code}', url], capture_output=True, text=True)
    code = r.stdout.strip()
    if code != '200' or not os.path.exists(h): print('FAIL', key, code); continue
    raw = open(h, 'rb').read()
    if raw[:5] == b'%PDF-':
        os.rename(h, os.path.join(out_dir, key + '.pdf')); print('PDF', key); continue
    txt = to_text(raw)
    open(t, 'w', encoding='utf-8').write(txt); print(key, code, len(txt))
    time.sleep(2)
