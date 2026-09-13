#!/usr/bin/env python3
"""Assemble this full-text batch's reviewed paragraphs, tables and source notes.

Run after translate-course-fulltext.py. This writes private reviewed artifacts;
it does not publish or change the production registry.
"""
import html
import json
import re
import sys
from pathlib import Path
from bs4 import BeautifulSoup

sys.path.insert(0, '/home/grass/leninbot')
from runtime_tools.archival_translation import core

BASE = Path(__file__).resolve().parents[1] / 'dev_docs/commulingo-fulltext-20260913'
REVIEWED = BASE / 'reviewed'
REVIEWED.mkdir(exist_ok=True)

EDITS = {
 'owen-new-view-society': {
  '무지의 가장 wild한 상상': '무지에서 나온 가장 터무니없는 상상',
  '그 오류들을 드러낼 감히 하지 못했다': '그 오류들을 감히 드러내지 못했다',
  '그 모든 실질적 이점이 인류 대중에게서 더 오래 withheld되어야 하는가?': '인류 대중이 그 모든 실질적 이점을 누리지 못하는 상태가 왜 더 오래 지속되어야 하는가?',
  '것이 surely 그만큼 더 바람직하다': '것이 분명 그만큼 더 바람직하다',
 },
 'bakunin-statism-anarchy-excerpts-1873': {
  '소슈лях타': '하급 슐라흐타', '슈лях타': '슐라흐타',
  '아이лер트': '아일레르트', '들이 либо 너무 약해서': '들이 너무 약해서',
  '이 involuntary 동맹': '이 내키지 않는 동맹',
  'Wo ist das deutsche Vaterland': '독일인의 조국은 어디인가',
  '《Volksstaat》': '《인민국가》',
 },
 'marx-bakunin-notes-1874-1875': {
  'étrange Pologne': '기이한 폴란드', 'energische한 표명': '적극적인 표명',
  'представлено(전달될)': '전달될', 'коренная(원래의, 뿌리에 속하는) 불의': '뿌리 깊은 불의',
 },
 'gouges-rights-of-woman-1791': {
  '여성의 권리라는 대의의 비상을 무겁게 하고': '여성의 권리 신장에 힘을 실어 주고',
  '도청 재판소': '데파르트망 재판소',
 },
 'france-law-22-prairial-1794': {'손-쉬르-손(Châlons-sur-Saône)': '샬롱쉬르손(Châlons-sur-Saône)'},
 'bernstein-preconditions-socialism-excerpts-1899': {
  '"physical force men"': '"물리력 투쟁파"',
  'P. u. T. Coats': 'P. 및 T. 코츠',
  '미국의 Statistical Abstract': '미국의 《통계초록》',
  '노동 참여체 – labour partnership –': '노동 참여체(labour partnership)',
  '"producere"(산출)': '"산출"(producere)',
  '《Labour Co-partnership》': '《노동 공동경영》',
  'namely 5,454명': '즉 5,454명', 'T. Lipton': 'T. 립턴',
  'Spiers & Pond': '스피어스 앤드 폰드', 'British Review': '《브리티시 리뷰》',
  '2331/3퍼센트': '233과 3분의 1퍼센트',
 },
}

TITLES_EN = {
 'owen-new-view-society': 'Robert Owen, A New View of Society',
 'bakunin-statism-anarchy-excerpts-1873': 'Bakunin, Statism and Anarchy',
 'bernstein-preconditions-socialism-excerpts-1899': 'Bernstein, The Preconditions of Socialism and the Tasks of Social Democracy',
 'marx-bakunin-notes-1874-1875': 'Marx, Notes on Bakunin’s Statism and Anarchy',
 'gouges-rights-of-woman-1791': 'Olympe de Gouges, The Rights of Woman (1791)',
 'robespierre-political-morality-1794': 'Robespierre, Report on the Principles of Political Morality',
 'robespierre-subsistence-1792': 'Robespierre, Opinion on Subsistence',
 'france-law-22-prairial-1794': 'Decree of 22 Prairial, Year II',
}

def norm(text):
    return re.sub(r'\s+', '', text)

def render(block, lines, quote=False):
    tag = core._DEFAULT_TAG_MAP.get(block['tag'], 'p')
    if block['tag'] in ('h1', 'h2'): tag = 'h2'
    if block['tag'] == 'table':
        assert len(lines) == len(block['lines']), 'table vocabulary length mismatch'
        vocab = dict(zip(block['lines'], lines))
        rows = ''.join('<tr>'+''.join('<td>'+html.escape(vocab.get(c,c))+'</td>' for c in row)+'</tr>' for row in block['rows'])
        return '<div class="table-scroll"><table class="source-table">'+rows+'</table></div>'
    if tag in ('h1','h2','h3','h4'):
        # The document has one title. Source part titles belong below it.
        tag = 'h2' if tag == 'h1' else tag
        return f'<{tag}>'+html.escape(' '.join(lines))+f'</{tag}>'
    # Subdividing a long paragraph for transport must not split its display.
    if len(block['lines']) == 1:
        lines = [' '.join(lines)]
    text = ''.join('<p>'+html.escape(line)+'</p>' for line in lines)
    return '<blockquote>'+text+'</blockquote>' if quote or tag == 'blockquote' else text

def reviewed_doc(path):
    spec = json.loads(path.read_text())
    id = spec['id']
    result = json.loads((BASE/'translations'/(id+'.result.json')).read_text())
    assert result.get('output') and not result['failures'], f'{id}: incomplete'
    docs = core.slice_documents(spec)
    got, hashes = {}, {}
    cache = BASE/'translations'/(id+'.deepseek.cache.jsonl')
    for line in cache.read_text().splitlines():
        row = json.loads(line)
        got.update({int(k): v for k,v in row['blocks'].items()})
        hashes.update({int(k):v for k,v in row.get('sourceHashes',{}).items()})
    spec['bylineNote'] = TITLES_EN[id]
    spec['postEdits'] = EDITS.get(id,{})
    if id == 'marx-bakunin-notes-1874-1875':
        spec['title'] = '마르크스, 바쿠닌의 국가성과 아나키 독서 노트'
    if id == 'owen-new-view-society':
        credit = '한국어 전문 번역: CommuLingo, DeepSeek Flash (2026).'
        if credit not in spec['bibliography']: spec['bibliography'].append(credit)
    # Use the shared heading/editorial shell.
    shell = BeautifulSoup(core.assemble(spec, [], {}), 'html.parser')
    article = shell.article
    counts = {'sourceBlocks':0,'translatedBlocks':0,'tables':0,'notes':0,'quotes':0}
    corrections = []
    for doc_index, doc in enumerate(docs):
        prefix = f'd{doc_index}'
        body, notes = [], []
        in_notes = False
        note_numbers = []
        quote_texts = []
        if id == 'marx-bakunin-notes-1874-1875':
            raw = BeautifulSoup(Path(doc['source']['path']).read_text(), 'lxml')
            quote_texts = [norm(x.get_text()) for x in raw.select('blockquote')]
        for i,block in enumerate(doc['blocks']):
            idx = doc['offset']+i
            source = ' '.join(block['lines'])
            counts['sourceBlocks'] += 1
            if block['lines']: assert idx in got, f'{id}: missing block {idx}'
            if block['lines']:
                expected_hash = core._block_source_hashes([(idx, block)])[str(idx)]
                assert hashes.get(idx) == expected_hash, f'{id}: source/cache mismatch {idx}'
            lines = got.get(idx,[])
            if block['tag'] == 'table':
                assert len(lines) == len(block['lines']), f'{id}: table {idx} lost cells'
                counts['tables'] += 1
            for a,z in EDITS.get(id,{}).items():
                if any(a in line for line in lines): corrections.append({'block':idx,'before':a,'after':z})
            lines = core.apply_post_edits(lines,spec)
            counts['translatedBlocks'] += 1
            if id.startswith('gouges'):
                roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII']
                if source == 'Article premier.' or source.rstrip('.') in roman:
                    number = 1 if source == 'Article premier.' else roman.index(source.rstrip('.'))+1
                    block = {**block,'tag':'h4'}
                    lines = [f'제{number}조']
                elif source == 'POSTAMBULE.':
                    block = {**block,'tag':'h3'};lines=['후기']
                elif source == 'Préambule.':
                    lines=['서문']
                elif source == 'DÉCLARATION DES DROITS DE LA':
                    lines=['여성과 여성 시민의 권리 선언']
                elif source == 'FEMME ET DE LA CITOYENNE,':
                    continue # Joined to the immediately preceding source title.
                elif block['tag'].startswith('h') and len(source)>180:
                    block={**block,'tag':'p'}
            if id.startswith('bernstein') and source == 'Anmerkungen der Herausgeber':
                corrections.append({'block':idx,'excluded':'heading for omitted modern editorial notes'})
                continue
            note_heading = block['tag'].startswith('h') and source in ('Fußnote','Fußnoten','Notes','Anmerkungen des Verfassers')
            first_tail_note = (id.startswith('bakunin') and source.startswith('[1] ')) or (id.startswith('gouges') and source.strip() == '1.')
            if note_heading:
                in_notes = True
                continue
            if first_tail_note: in_notes = True
            if id.startswith('bernstein'):
                lines = [re.sub(r'\[\d+\*\]', '', x) for x in lines]
                if source.startswith('.] 1899'):
                    source = '7. 1899 geschrieben.'
                    lines = ['7. 1899년에 작성했다.']
                    corrections.append({'block':idx,'before':'.]','after':'7.','reason':'source anchor f7'})
            quote = any(norm(source) in text for text in quote_texts) if source else False
            if quote: counts['quotes'] += 1
            if in_notes:
                match = re.match(r'^(?:\[(\d+)\]|(\d+)\.)\s*',source)
                if match:
                    number = match[1] or match[2]
                    assert number not in note_numbers, (id,'duplicate note',number)
                    note_numbers.append(number)
                    lines = list(lines)
                    if lines: lines[0] = re.sub(r'^(?:\[\d+\]|\d+\.)\s*','',lines[0])
                    notes.append([number,[]])
                assert notes, (id,'note continuation has no parent',source)
                if any(lines) or block['tag']=='table': notes[-1][1].append(render(block,lines,quote))
            else:
                body.append(render(block,lines,quote))
        # Restore each source note's number and a unique round-trip link.
        all_refs = {}
        def refs(text):
            def link(m):
                n=m[1]
                if n not in note_numbers: return m[0]
                seen=all_refs.get(n,0)+1;all_refs[n]=seen
                suffix='' if seen==1 else f'-{seen}'
                return f'<a class="note-ref" id="ref-{prefix}-{n}{suffix}" href="#note-{prefix}-{n}">[{n}]</a>'
            return re.sub(r'\[(\d{1,3})\]',link,text)
        content=refs('\n'.join(body))
        if notes:
            counts['notes'] += len(notes)
            content+='<section class="notes" aria-label="주석"><h3>주석</h3><ol class="notes-list">'
            for n,items in notes:
                back=f' <a class="back-link" href="#ref-{prefix}-{n}" aria-label="본문으로 돌아가기">↩</a>' if n in all_refs else ''
                content+=f'<li id="note-{prefix}-{n}"><div class="note-text">'+''.join(items)+'</div>'+back+'</li>'
            content+='</ol></section>'
        for node in list(BeautifulSoup(content,'html.parser').contents):article.append(node)
    assert counts['sourceBlocks']==counts['translatedBlocks']
    ids=[x['id'] for x in article.select('[id]')]
    assert len(ids)==len(set(ids)), f'{id}: duplicate anchor'
    for a in article.select('a[href^="#"]'):assert a['href'][1:] in ids,(id,a['href'])
    text=str(article)+'\n'
    assert not re.search(r'\[\[\d+\||번역 실패|MISSING BLOCK|cite',text)
    (REVIEWED/(id+'.html')).write_text(text)
    (REVIEWED/(id+'.review.json')).write_text(json.dumps({
        'id':id,'model':'deepseek-flash','counts':counts,'corrections':corrections,
        'scope':'All source blocks present; table vocabulary and cells checked; notes and quotation boundaries restored; flagged terms and key passages checked against the source. Not a professional line-by-line copyedit.'
    },ensure_ascii=False,indent=2)+'\n')
    path.write_text(json.dumps(spec,ensure_ascii=False,indent=2)+'\n')
    print(id,counts,flush=True)

for path in sorted((BASE/'specs').glob('*.json')): reviewed_doc(path)
