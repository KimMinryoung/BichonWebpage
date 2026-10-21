const assert = require('node:assert/strict');
const path = require('node:path');
const ejs = require('ejs');
const { renderMarkdown } = require('../utils/markdown');
const { placeEventDocExcerpts } = require('../data/commulingo/event-doc-excerpts');

const excerpts = ['first', 'letter', 'last'].map(docId => ({ docId, anchor: '*', title: docId, docLang: 'ko', html: '<p>Text</p>' }));
const markdown = '## Before\n\nContext.\n\n[[doc-excerpt:letter]]\n\nNext paragraph.\n\n## After\n\nConclusion.';
const placed = placeEventDocExcerpts(renderMarkdown(markdown), excerpts, 'ko');
assert.equal(placed.parts.length, 3);
assert.match(placed.parts[0].html, /Context\./);
assert.equal(placed.parts[1].excerpt.docId, 'letter');
assert.match(placed.parts[2].html, /^\s*<p>Next paragraph/);
assert.match(placed.parts[2].html, /<h2>After<\/h2>/);
assert.deepEqual(placed.trailing.map(part => part.index), [0, 2]);

const strings = { commuLingoViews: { termPanel: {
    primaryText: '원문', readInLibrary: '참고 문헌에서 읽기', libraryShort: '참고 문헌',
    expandText: '전문 펼치기', collapseText: '접기',
} } };
const template = path.join(__dirname, '../views/partials/commulingo-doc-excerpts.ejs');
function render(part, inline) {
    return ejs.renderFile(template, { excerpts: [part.excerpt], startIndex: part.index, inline, idPrefix: 'event-excerpt', strings });
}

(async () => {
    const inline = await render(placed.parts[1], true);
    assert.match(inline, /<h3 id="event-excerpt-1">/);
    assert.match(inline, /aria-controls="event-excerpt-body-1"/);
    assert(!inline.includes('commu-person-detail-section'));
    const trailing = await Promise.all(placed.trailing.map(part => render(part, false)));
    const ids = [...[inline, ...trailing].join('').matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'inline and trailing readers keep distinct heading/control IDs');
    assert(trailing.every(html => html.includes('<h2 ') && html.includes('commu-person-detail-section')));

    const ordinary = placeEventDocExcerpts('<p>Unchanged.</p>', excerpts, 'ko');
    assert.deepEqual(ordinary.parts, [{ html: '<p>Unchanged.</p>' }]);
    assert.equal(ordinary.trailing.length, 3);
    const repeated = placeEventDocExcerpts(renderMarkdown('[[doc-excerpt:letter]]\n\n[[doc-excerpt:letter]]\n\n[[doc-excerpt:undeclared]]'), excerpts, 'en');
    assert.equal(repeated.parts.filter(part => part.excerpt).length, 1);
    const fallbacks = repeated.parts.filter(part => part.html?.includes('Read in the reference library'));
    assert.equal(fallbacks.length, 2);
    assert.match(fallbacks[1].html, /href="\/commulingo\/docs\/undeclared"/);
    assert.equal(placeEventDocExcerpts(renderMarkdown('`[[doc-excerpt:letter]]`'), excerpts, 'ko').trailing.length, 3);
    assert.equal(placeEventDocExcerpts(renderMarkdown('```\n[[doc-excerpt:letter]]\n```'), excerpts, 'ko').trailing.length, 3);
    assert(!placeEventDocExcerpts('<p>[[doc-excerpt:letter]]</p>', [], 'ko').parts[0].html.includes('[['));
    assert.deepEqual(placeEventDocExcerpts('', excerpts, 'ko').trailing.map(part => part.index), [0, 1, 2]);
    assert.deepEqual(excerpts.map(excerpt => excerpt.docId), ['first', 'letter', 'last'], 'input readers are not mutated');
    console.log('Event readers: narrative placement, fallback, no duplicates, stable controls and ordinary pages passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
