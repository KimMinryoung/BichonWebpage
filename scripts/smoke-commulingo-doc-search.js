const assert = require('node:assert/strict');
const { searchDocContent, indexPage } = require('../data/commulingo/doc-search');

// The server's text must be what the page's DOM text normalises to (see
// public/js/commulingo-doc-search.js): tags vanish without a space, entities
// decode, whitespace runs collapse, case folds.
const page = indexPage('<h2 id="a">첫 <b>절</b></h2>\n<p>Lenin &amp; <a href="#">Trot</a>sky\n\n  met.</p><!-- note --><script>var Lenin;</script>');
assert.equal(page.norm, '첫 절\nlenin & trotsky met.'.replace(/\s+/g, ' '));
assert.deepEqual(page.headings, [{ at: 0, text: '첫 절' }]);

const content = {
    html: '<h1>제목 레닌</h1><p>레닌과 레닌레닌.</p><h2 id="x">둘째</h2><p>LENIN lenin</p>',
    paged: null,
};
// The title h1 renders above the body and is not searched.
const korean = searchDocContent(content, '레닌');
assert.equal(korean.total, 3);
assert.deepEqual(korean.hits.map(hit => hit.n), [0, 1, 2]);
assert.equal(korean.hits[0].match, '레닌');
// Matches do not overlap, so 레닌레닌 is two and 닌레 inside it is not counted again.
assert.equal(searchDocContent(content, '레닌레닌').total, 1);
const latin = searchDocContent(content, '  Lenin ');
assert.equal(latin.query, 'lenin');
assert.equal(latin.total, 2);
assert.equal(latin.hits[0].section, '둘째');
assert.equal(latin.hits[0].match, 'LENIN');
assert.equal(searchDocContent(content, '   ').total, 0);

// A paginated document counts per page, with the page's own heading.
const paged = { html: '', paged: { pages: [{ html: '<p>a b a</p>', heading: '1부' }, { html: '<p>none</p>', heading: '2부' }, { html: '<p>A</p>', heading: '3부' }] } };
const result = searchDocContent(paged, 'a');
assert.deepEqual(result.pages, [{ page: 1, heading: '1부', count: 2 }, { page: 3, heading: '3부', count: 1 }]);
assert.deepEqual(result.hits.map(hit => [hit.page, hit.n]), [[1, 0], [1, 1], [3, 0]]);
console.log('doc search: DOM-equivalent normalisation, title excluded, non-overlapping per-page counts');
