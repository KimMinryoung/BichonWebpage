const assert = require('node:assert/strict');
const fs = require('node:fs');
const ejs = require('ejs');
const { summarizeBooks, groupBooks } = require('../data/commulingo/book-summary');
const { buildListCss } = require('./build-commulingo-list-css');
const strings = require('../config/strings');
const catalog = { collections: [
    { id: 'capital', volumeNumber: 1, title: { ko: '<자본>', en: 'Capital' }, chapters: [{ lessons: [{ id: 'l1', questionCount: 1 }] }] },
    { id: 'history-test', volumeNumber: 9, title: { ko: '역사', en: 'History' }, format: 'decision-history', decisionTimeline: { eras: [{ episodes: [{}, {}] }] } },
    { id: 'engels-test', volumeNumber: 2, title: { ko: '엥겔스', en: 'Engels' }, format: 'concept-graph', conceptGraph: { nodes: [{}, {}, {}] } },
] };
const books = summarizeBooks(catalog);
assert.equal(summarizeBooks(catalog), books);
assert.notEqual(summarizeBooks({ ...catalog }), books);
for (const lang of ['ko', 'en']) {
    const groups = groupBooks(books, strings[lang].commuLingo, lang);
    assert.deepEqual(groups.map(group => group.books[0].id), ['history-test', 'capital', 'engels-test']);
    const html = ejs.render(fs.readFileSync('views/partials/commulingo-book-groups.ejs', 'utf8'), { bookGroups: groups, strings: strings[lang], lang });
    assert.equal((html.match(/class="commu-book-card"/g) || []).length, 3);
    assert.match(html, /href="\/commulingo\/book\/capital"/);
    assert.match(html, lang === 'ko' ? /&lt;자본&gt;/ : /Capital/);
    assert.match(html, lang === 'ko' ? /갈림길 2개/ : /2 turning points/);
    assert.match(html, lang === 'ko' ? /노드 3개/ : /3 nodes/);
}
const css = buildListCss();
assert.equal(fs.readFileSync('public/css/commulingo-lists.css', 'utf8'), css);
assert.match(css, /@keyframes commu-skel-pulse/);
assert.match(css, /\.commu-person-more/);
assert.match(css, /\.commu-flag \{/);
assert.match(css, /\.commu-search-hl/);
assert.ok(css.includes('[class*="pos-"]'));
assert.match(css, /@media \(max-width: 540px\) \{\s*\.commu-people-grid \{\s*grid-template-columns: minmax\(0, 1fr\)/);


assert.doesNotMatch(css, /\.commu-quiz|\.commu-world-map|\.commu-dc/);
console.log('landing SSR: localized groups, card formats, escaping, snapshot memo and list CSS OK');
