# python3 -I fetch-wiki.py <outdir> lang:Title [lang:Title ...]
# Plain-text Wikipedia extracts -> <outdir>/<lang>-<Title>.txt (first line = resolved title).
# Also: wd:Q123 -> <outdir>/wd-Q123.json (Wikidata entity: labels, P569/P570 dates, sitelinks).
# Sequential with retries; skips files that already exist (use -f to refetch).
import json, sys, time, urllib.parse, urllib.request, os
UA = {'User-Agent': 'CommuLingo/1.0 (https://cyber-lenin.com)'}
args = sys.argv[1:]; force = '-f' in args; args = [a for a in args if a != '-f']
out_dir, specs = args[0], args[1:]
os.makedirs(out_dir, exist_ok=True)
def get(url):
    for i in range(5):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
        except Exception as e:
            if i == 4: raise
            time.sleep(3 * (i + 1))
for spec in specs:
    lang, t = spec.split(':', 1)
    if lang == 'wd':
        out = os.path.join(out_dir, 'wd-%s.json' % t)
        if os.path.exists(out) and not force: print('HAVE', out); continue
        try:
            d = get('https://www.wikidata.org/wiki/Special:EntityData/%s.json' % t)['entities'][t]
            keep = {'id': t, 'labels': {k: v['value'] for k, v in d.get('labels', {}).items() if k in ('ko', 'en', 'de', 'ru', 'fr', 'da')},
                    'claims': {p: [c['mainsnak'].get('datavalue', {}).get('value') for c in d['claims'].get(p, [])] for p in ('P569', 'P570', 'P19', 'P20', 'P27', 'P21')},
                    'sitelinks': {k: v['title'] for k, v in d.get('sitelinks', {}).items() if k in ('kowiki', 'enwiki', 'dewiki', 'ruwiki', 'frwiki', 'dawiki')}}
            open(out, 'w', encoding='utf-8').write(json.dumps(keep, ensure_ascii=False, indent=1)); print(out)
        except Exception as e: print('FAIL', spec, e)
        continue
    out = os.path.join(out_dir, '%s-%s.txt' % (lang, t.replace('/', '_')))
    if os.path.exists(out) and not force: print('HAVE', out); continue
    q = urllib.parse.urlencode({'action': 'query', 'prop': 'extracts', 'explaintext': 1, 'redirects': 1, 'format': 'json', 'titles': t})
    try:
        p = list(get('https://%s.wikipedia.org/w/api.php?%s' % (lang, q))['query']['pages'].values())[0]
        if p.get('extract'):
            open(out, 'w', encoding='utf-8').write(p['title'] + '\n' + p['extract']); print(out, len(p['extract']))
        else: print('NONE', spec)
    except Exception as e: print('FAIL', spec, e)
