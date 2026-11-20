// entry.bibliography: validation, the stored form, and the reader drawing the
// 번역·편집 정보 boxes from it (dev_docs/commulingo-doc-bibliography.md).
const assert = require('node:assert/strict');
const { normalizeBibliography, applyBibliography, missingAnchors } = require('../../data/commulingo/doc-bibliography');
const { canonicalEntry, mergeDocMeta } = require('../../data/commulingo/docs-import');
const { inspectDocStructure } = require('../../data/commulingo/doc-structure');

const bibliography = normalizeBibliography({ parts: [
    { created: { text: '1914년 2월~5월', date: [1914, 2] },
      published: { label: '최초 발표', text: '잡지 『프로스베셰니예』', date: [1914] },
      sourceText: ['러시아어 원문 <a href="https://ru.wikisource.org/x">위키문헌</a>'],
      notes: ['주석 [1]~[15]는 원문의 각주다'] },
    { anchor: 'decree-2', adopted: { label: '공포', text: '1918년 1월', date: [1918, 1] } },
] });

// Stored in the smallest form: a label equal to the field's own is dropped.
assert.deepEqual(bibliography.parts[0].published, [{ text: '잡지 『프로스베셰니예』', date: [1914] }]);
assert.equal(bibliography.parts[1].adopted[0].label, '공포');

for (const bad of [
    { parts: [] },
    { parts: [{ notes: ['<script>x</script>'] }] },
    { parts: [{ notes: ['<a href="javascript:alert(1)">x</a>'] }] },
    { parts: [{ notes: ['<em>open'] }] },
    { parts: [{ created: { text: 'x', date: [1914, 13] } }] },
    { parts: [{ sourceText: [{ text: 'x', date: [1914] }] }] }, // not a dated field
    { parts: [{ unknownField: 'x' }] },
    { parts: [{ anchor: 'a', notes: ['x'] }, { anchor: 'a', notes: ['y'] }] },
    { parts: [{ anchor: 'a' }] },
]) assert.throws(() => normalizeBibliography(bad), { status: 400 }, JSON.stringify(bad));

const html = '<aside class="doc-editorial"><p>해제</p><details class="doc-edition"><summary>번역·편집 정보</summary><p>옛 상자</p></details></aside>'
    + '<h2 id="decree-2">둘째 포고</h2><aside class="doc-editorial"><p>둘째 해제</p></aside><p>본문</p>';

// The document part replaces the body's own box; the piece's box is added.
const ko = applyBibliography(html, bibliography, { lang: 'ko' });
assert.ok(!ko.includes('옛 상자'));
assert.match(ko, /<details class="doc-edition"><summary>번역·편집 정보<\/summary><p>주석 \[1\]~\[15\]는 원문의 각주다<\/p><table class="doc-edition-fields"><tbody><tr><th scope="row">집필<\/th><td>1914년 2월~5월<\/td><\/tr><tr><th scope="row">최초 발표<\/th><td>잡지/);
assert.match(ko, /둘째 해제<\/p><details class="doc-edition">[^]*<th scope="row">공포<\/th><td>1918년 1월<\/td>[^]*<\/details><\/aside><p>본문/);
assert.equal((ko.match(/class="doc-edition"/g) || []).length, 2);

// A page without the opening leaves the document part for page 1; English
// names the fields in English.
const later = applyBibliography(html, bibliography, { lang: 'en', opening: false });
assert.ok(later.includes('옛 상자'));
assert.match(later, /<th scope="row">Adopted<\/th><td>1918년 1월<\/td>/);
assert.equal(applyBibliography(html, undefined), html);

// Entry round trip: stored by canonicalEntry, kept by a patch that does not
// name it, dropped by null.
const entry = canonicalEntry({ id: 'd', title: { ko: '문헌' }, bibliography });
assert.deepEqual(entry.bibliography, bibliography);
assert.deepEqual(mergeDocMeta(entry, { title: { ko: '새 제목' } }).bibliography, bibliography);
assert.equal(mergeDocMeta(entry, { bibliography: null }).bibliography, undefined);
assert.throws(() => canonicalEntry({ id: 'd', title: { ko: '문헌' }, bibliography: { parts: [{ notes: ['<img src=x>'] }] } }), { status: 400 });

// Structure: the box may come from the entry; an anchor must name a heading.
const body = '<article><h1>문헌</h1><p class="doc-byline"><strong>저자</strong></p><aside class="doc-editorial"><p class="doc-editorial-label">해제</p><p>해제 문단</p></aside><h2 id="decree-2">둘째</h2><p>본문</p></article>';
const codes = result => [...result.errors, ...result.warnings].map(issue => issue.code);
assert.ok(codes(inspectDocStructure(body, { entry: {} })).includes('edition-missing'));
assert.ok(!codes(inspectDocStructure(body, { entry: { bibliography } })).includes('edition-missing'));
const typo = normalizeBibliography({ parts: [{ notes: ['x'] }, { anchor: 'decree-9', notes: ['y'] }] });
assert.ok(codes(inspectDocStructure(body, { entry: { bibliography: typo } })).includes('bibliography-anchor-missing'));
assert.deepEqual(missingAnchors(typo, new Set(['decree-2'])), ['decree-9']);

// Consecutive values with one label share a row, a line each.
const two = applyBibliography(html, normalizeBibliography({ parts: [{ sourceText: ['판본 A', '판본 B'], rights: 'PD' }] }), { lang: 'ko' });
assert.match(two, /<tr><th scope="row">번역 저본<\/th><td>판본 A<br>판본 B<\/td><\/tr><tr><th scope="row">저작권<\/th>/);

// A footnote reference inside the box keeps its back-link target.
const withNote = body.replace('<p>본문</p>', '<p>본문</p><section class="notes"><ol class="notes-list"><li id="note-1"><a class="back-link" href="#ref-1">↩</a> 주</li></ol></section>');
const noted = normalizeBibliography({ parts: [{ notes: ['저본 설명<a class="note-ref" id="ref-1" href="#note-1">[1]</a>'] }] });
assert.ok(!codes(inspectDocStructure(withNote, { entry: { bibliography: noted } })).includes('back-link-dangling'));
assert.ok(codes(inspectDocStructure(withNote, { entry: {} })).includes('back-link-dangling'));

// A published original: one bibliography per language, original labels.
const { normalizeOriginalBibliography } = require('../../data/commulingo/doc-bibliography');
const orig = normalizeOriginalBibliography({ ko: { parts: [{ sourceText: ['MEW 19'], editing: ['1891년 맞춤법 유지'] }] }, en: { parts: [{ sourceText: ['MEW 19'], editing: ['1891 spelling kept'] }] } });
const origKo = applyBibliography('<aside class="doc-editorial" lang="ko"><p>해제</p></aside>', orig.ko, { lang: 'ko', role: 'original' });
assert.match(origKo, /<summary>원문·편집 정보<\/summary>[^]*<th scope="row">원문 저본<\/th><td>MEW 19<\/td>[^]*<th scope="row">편집<\/th>/);
const origEn = applyBibliography('<aside class="doc-editorial" lang="en"><p>Intro</p></aside>', orig.en, { lang: 'en', role: 'original' });
assert.match(origEn, /<summary>Source and editing<\/summary>[^]*<th scope="row">Source text<\/th>[^]*<td>1891 spelling kept<\/td>/);
assert.throws(() => normalizeOriginalBibliography({ fr: { parts: [{ notes: ['x'] }] } }), { status: 400 });
assert.equal(normalizeOriginalBibliography(null), null);

console.log('commulingo-doc-bibliography: ok');

// 「이 문헌 인용하기」 ends the document part's box; pieces get none.
{
    const B = require('../../data/commulingo/doc-bibliography');
    assert.equal(B.citationText({ title: '마르크스, 『고타강령 비판』', url: 'https://cyber-lenin.com/commulingo/docs/x' }),
        '마르크스, 『고타강령 비판』. CommuLingo 참고 문헌. https://cyber-lenin.com/commulingo/docs/x');
    const bib = { parts: [{ sourceText: ['A'] }, { anchor: 'p2', sourceText: ['B'] }] };
    const html = '<aside class="doc-editorial"><p>x</p></aside><h2 id="p2">p</h2><aside class="doc-editorial"><p>y</p></aside>';
    const out = B.applyBibliography(html, bib, { citation: 'C & D' });
    assert.equal((out.match(/doc-edition-cite/g) || []).length, 1);
    assert.match(out, /<th scope="row">인용<\/th><td>C &amp; D<\/td>/);
    const ld = B.documentJsonLd({ originalTitle: '<i>Kritik</i>', author: 'Karl Marx', created: { date: [1875, 5], text: '1875년 5월' },
        published: { date: [1891], text: '1891' }, rights: '퍼블릭 도메인' },
        { title: '고타강령 비판', url: 'u', inLanguage: 'ko', other: { url: 'o', inLanguage: 'de' } });
    assert.equal(ld['@type'], 'CreativeWork');
    // Dated fields take one value per piece; an older single value still reads.
    const two = B.normalizeBibliography({ parts: [{ created: [{ text: '런던, 1859년 4월 19일', date: [1859, 4, 19] }, { text: '맨체스터, 1859년 5월 18일', date: [1859, 5, 18] }] }] });
    assert.equal(two.parts[0].created.length, 2);
    assert.match(B.renderPart(two.parts[0], 'ko'), /<th scope="row">집필<\/th><td>런던, 1859년 4월 19일<br>맨체스터, 1859년 5월 18일<\/td>/);
    assert.equal(B.documentJsonLd(two.parts[0], { title: 't' }).dateCreated, '1859-04-19');
    assert.match(B.renderPart({ created: { text: '옛 값', date: [1900] } }, 'ko'), /<td>옛 값<\/td>/);
    assert.equal(B.documentJsonLd({ originalTitle: 'Randglossen (여백 논평)' }, { title: 't' }).alternateName, 'Randglossen');
    assert.equal(B.documentJsonLd({ originalTitle: '한국어 제목' }, { title: 't' }).alternateName, undefined);
    assert.equal(ld.alternateName, 'Kritik');
    assert.equal(ld.dateCreated, '1875-05');
    assert.equal(ld.datePublished, '1891');
    assert.deepEqual(ld.translationOfWork, { '@type': 'CreativeWork', url: 'o', inLanguage: 'de' });
    assert.equal(B.documentJsonLd(null, { title: 't', url: 'u', inLanguage: 'de', other: { url: 'k' }, isOriginal: true }).workTranslation.url, 'k');
}
