#!/usr/bin/env node
// Reference-document structure (data/commulingo/doc-structure.js): the save-time
// check the README's 서두 틀 and 주석 양식 used to rely on people for, the
// ratchet that lets documents stored before it keep saving, heading ids frozen
// to the numbers the reader already serves, and parser-based block cutting.
//   node scripts/smoke-commulingo-doc-structure.js
const assert = require('node:assert/strict');
const path = require('node:path');

function stub(file, value) {
    const resolved = require.resolve(path.join(__dirname, '..', file));
    require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports: value };
}

const {
    freezeHeadingIds, inspectDocStructure, introducedErrors, removeBlocks, isNotesSection, isEditorial,
} = require('../data/commulingo/doc-structure');

const GOOD = `<article>
<h1>문헌 제목</h1>
<p class="doc-byline"><strong>저자</strong>, 원제</p>
<aside class="doc-editorial">
<p class="doc-editorial-label">해제</p>
<p>무엇을 다루는지.</p>
<details class="doc-edition"><summary>번역·편집 정보</summary><ul><li>번역 저본: …</li></ul></details>
</aside>
<h2 id="part-1">첫째 절</h2>
<p>상비군을 없앤다<a class="note-ref" id="ref-3" href="#note-3">[3]</a>.</p>
<h3>작은 제목</h3>
<p>본문<a class="note-ref" id="ref-3-2" href="#note-3">[3]</a>.</p>
<section class="notes" aria-labelledby="notes-heading">
<h2 id="notes-heading">주석</h2>
<ol class="notes-list">
<li id="note-3"><span class="note-text">주석 본문.</span> <a class="back-link" href="#ref-3" aria-label="본문으로 돌아가기">↩</a></li>
</ol>
</section>
</article>`;
const codes = result => result.errors.map(issue => issue.code).sort();

// A body laid out as the README asks has nothing to report.
{
    const result = inspectDocStructure(GOOD, { entry: { excerpts: { terms: { army: 'part-1' }, events: { e: '*' } } } });
    assert.deepEqual(result.errors, []);
    assert.deepEqual(result.warnings, []);
}

// Each error the check exists for.
{
    const cases = [
        ['title-not-first', GOOD.replace('<h1>문헌 제목</h1>', '<p>머리말</p><h1>문헌 제목</h1>')],
        ['byline-missing', GOOD.replace('<p class="doc-byline"><strong>저자</strong>, 원제</p>', '')],
        ['editorial-missing', GOOD.replace(/<aside class="doc-editorial">[\s\S]*?<\/aside>/, '')],
        ['duplicate-id', GOOD.replace('id="part-1"', 'id="note-3"')],
        ['notes-list-missing', GOOD.replace('<ol class="notes-list">', '<ol>')],
        ['note-ref-dangling', GOOD.replace('href="#note-3">[3]</a>.</p>\n<h3>', 'href="#note-9">[3]</a>.</p>\n<h3>')],
        ['back-link-dangling', GOOD.replace('href="#ref-3" aria-label', 'href="#ref-7" aria-label')],
        ['nested-block', GOOD.replace('<p>무엇을 다루는지.</p>', '<aside><p>퍼 해설</p></aside>')],
    ];
    for (const [code, html] of cases) {
        const found = codes(inspectDocStructure(html));
        // A missing title takes the byline check with it; only the named code matters.
        assert.ok(found.includes(code), `${code}: got ${found.join(', ') || 'nothing'}`);
    }
    // excerpts must name a heading that exists (on the translation an error, on an original a warning).
    const entry = { excerpts: { terms: { army: ['part-1', { heading: 'gone', lead: true }] } } };
    assert.deepEqual(codes(inspectDocStructure(GOOD, { entry })), ['excerpt-target-missing']);
    const original = inspectDocStructure(GOOD.replace(/<p class="doc-byline">.*<\/p>/, ''), { role: 'original', entry });
    assert.deepEqual(codes(original), [], 'an original is not held to the byline');
    assert.ok(original.warnings.some(issue => issue.code === 'excerpt-target-missing'));
}

// Warnings render but are worth fixing.
{
    const warned = inspectDocStructure(GOOD
        .replace(/<details class="doc-edition">[\s\S]*?<\/details>/, '')
        .replace('</aside>\n<h2', '</aside>\n<hr>\n<h2')
        .replace('<p>무엇을 다루는지.</p>', '<p>무엇을 <a href="#nowhere">다루는지</a>.</p>'));
    assert.deepEqual(warned.errors, []);
    assert.deepEqual(warned.warnings.map(issue => issue.code).sort(), ['edition-missing', 'fragment-link-dangling', 'hr-after-editorial']);
}

// A malformed percent escape in a fragment link is reported, not thrown.
{
    const odd = inspectDocStructure(GOOD.replace('<p>무엇을 다루는지.</p>', '<p>무엇을 <a href="#100%">다루는지</a>.</p>'));
    assert.deepEqual(odd.errors, []);
    assert.deepEqual(odd.warnings.map(issue => issue.code), ['fragment-link-dangling']);
}

// The ratchet: an error already stored does not block a save; a new one does.
{
    const legacy = inspectDocStructure(GOOD.replace('<ol class="notes-list">', '<ol>'));
    const stillLegacy = inspectDocStructure(GOOD.replace('<ol class="notes-list">', '<ol>').replace('첫째 절', '첫째 절(고침)'));
    assert.deepEqual(introducedErrors(legacy, stillLegacy), []);
    const worse = inspectDocStructure(GOOD.replace('<ol class="notes-list">', '<ol>').replace('href="#ref-3" aria', 'href="#ref-0" aria'));
    assert.deepEqual(introducedErrors(legacy, worse).map(issue => issue.code), ['back-link-dangling']);
    assert.deepEqual(introducedErrors(null, legacy).map(issue => issue.code), ['notes-list-missing'], 'a new document meets every rule');
    const fixed = inspectDocStructure(GOOD);
    assert.deepEqual(introducedErrors(legacy, fixed), []);
}

// Frozen heading ids are the ones the reader was already numbering.
{
    const { annotateHeadings } = require('../data/commulingo/docs-store');
    const legacy = '<article><h1>T</h1><h2>가</h2><h2 id="x">나</h2><h1>부</h1><h2>다</h2><h3>라</h3></article>';
    const served = [...annotateHeadings(legacy).html.matchAll(/<h[12] id="([^"]+)"/g)].map(m => m[1]);
    const frozen = freezeHeadingIds(legacy);
    assert.deepEqual([...frozen.matchAll(/<h[12] id="([^"]+)"/g)].map(m => m[1]), served);
    assert.deepEqual(served, ['sec-1', 'x', 'sec-2', 'sec-3']);
    assert.match(frozen, /<h3 id="sub-1" data-auto-id>라<\/h3>/);
    assert.match(frozen, /<h1>T<\/h1>/, 'the title keeps no id');
    assert.equal(freezeHeadingIds(frozen), frozen, 'freezing twice changes nothing');
    const { sanitizeDocHtml } = require('../data/commulingo/doc-sanitize');
    assert.equal(sanitizeDocHtml(frozen), frozen, 'the sanitizer keeps frozen ids as written (put re-sanitizes edited bodies)');
    // After freezing, a new heading takes the next number and nothing moves.
    const edited = freezeHeadingIds(frozen.replace('<h2 id="sec-1"', '<h2>새 절</h2><h2 id="sec-1"'));
    assert.match(edited, /<h2 id="sec-4" data-auto-id>새 절<\/h2><h2 id="sec-1"/);
    // The reader still treats frozen ids as numbered, not chosen (the
    // translation/original switch only trusts ids an editor wrote).
    const { generated, toc } = annotateHeadings(frozen);
    assert.deepEqual([...generated].sort(), ['sec-1', 'sec-2', 'sec-3']);
    assert.deepEqual(toc.map(item => item.id), ['sec-1', 'x', 'sec-2', 'sec-3']);
    // Nor does the version switch take a frozen h3 (sub-N) for a shared anchor.
    const { getCommuLingoDocAnchorPages } = require('../data/commulingo/docs-store');
    assert.deepEqual(getCommuLingoDocAnchorPages({ html: frozen, generated }), { x: 1 });
}

// Blocks are cut by the parser, nesting included.
{
    const html = '<p>a</p><aside class="doc-editorial"><aside>퍼 해설</aside>꼬리</aside><p>b</p><section class="notes"><section><ol></ol></section>끝</section><p>c</p>';
    assert.equal(removeBlocks(html, node => isEditorial(node) || isNotesSection(node)), '<p>a</p><p>b</p><p>c</p>');
    assert.equal(removeBlocks('<p>x</p>', isEditorial), '<p>x</p>');
}

// writeDocs refuses a write that adds an error, unless told otherwise, and
// stores the body with its ids frozen.
(async () => {
    const stored = { id: 'demo', revision: 3, entry: { docLang: 'ko', title: { ko: '문헌' } }, body: GOOD, body_sha256: 'old', sort_order: 1 };
    const writes = [];
    const client = {
        async query(sql, params = []) {
            if (/FROM commulingo_docs WHERE id = \$1 FOR UPDATE/.test(sql)) return { rows: params[0] === 'demo' ? [stored] : [] };
            if (/^\s*UPDATE commulingo_docs/.test(sql) || /INSERT INTO commulingo_docs /.test(sql)) writes.push(params);
            if (/COALESCE\(MAX/.test(sql)) return { rows: [{ n: 1 }] };
            return { rows: [] };
        },
        release() {},
    };
    stub('config/database.js', { connect: async () => client, query: client.query });
    stub('data/commulingo/doc-person-links.js', { inspectDocPersonLinks: async () => ({ mentions: [], warnings: [], truncated: false }) });
    const { writeDocs } = require('../data/commulingo/docs-db');
    const broken = GOOD.replace('href="#ref-3" aria', 'href="#ref-0" aria');
    await assert.rejects(
        writeDocs({ upserts: [{ id: 'demo', entry: stored.entry, body: broken, expectedRevision: 3 }] }, { actor: 't', client }),
        err => err.status === 422 && /back-link-dangling/.test(err.message));
    // (The refusal throws inside the write transaction, which rolls back what the loop wrote.)
    writes.length = 0;
    const forced = await writeDocs({ upserts: [{ id: 'demo', entry: stored.entry, body: broken, expectedRevision: 3 }] },
        { actor: 't', client, allowStructureIssues: true });
    assert.equal(forced.structure[0].introduced[0].code, 'back-link-dangling');
    const ok = await writeDocs({ upserts: [{ id: 'demo', entry: stored.entry, body: GOOD.replace('첫째', '첫 번째'), expectedRevision: 3 }] }, { actor: 't', client });
    assert.deepEqual(ok.structure[0].introduced, []);
    assert.match(writes.at(-1)[4], /<h3 id="sub-1" data-auto-id>작은 제목<\/h3>/, 'stored with frozen ids');
    // A new document must meet every rule.
    await assert.rejects(
        writeDocs({ upserts: [{ id: 'fresh', entry: stored.entry, body: '<article><h1>새 문헌</h1><p>본문</p></article>' }] }, { actor: 't', client }),
        err => /byline-missing/.test(err.message) && /editorial-missing/.test(err.message));
    console.log('smoke-commulingo-doc-structure: ok');
})().catch(err => {
    console.error(err);
    process.exit(1);
});
