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
assert.deepEqual(bibliography.parts[0].published, { text: '잡지 『프로스베셰니예』', date: [1914] });
assert.equal(bibliography.parts[1].adopted.label, '공포');

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

// A footnote reference inside the box keeps its back-link target.
const withNote = body.replace('<p>본문</p>', '<p>본문</p><section class="notes"><ol class="notes-list"><li id="note-1"><a class="back-link" href="#ref-1">↩</a> 주</li></ol></section>');
const noted = normalizeBibliography({ parts: [{ notes: ['저본 설명<a class="note-ref" id="ref-1" href="#note-1">[1]</a>'] }] });
assert.ok(!codes(inspectDocStructure(withNote, { entry: { bibliography: noted } })).includes('back-link-dangling'));
assert.ok(codes(inspectDocStructure(withNote, { entry: {} })).includes('back-link-dangling'));

console.log('commulingo-doc-bibliography: ok');
