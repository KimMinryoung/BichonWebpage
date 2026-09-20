const assert = require('node:assert/strict');
const path = require('node:path');
const ejs = require('ejs');
const { searchDictionary } = require('../utils/dictionary-search');
const { dictionarySearchRoute } = require('../utils/dictionary-search-route');
const docs = [
    { id: 'body', searchTitleText: 'Other', searchText: 'Other Lenin revolution', kindId: 'book' },
    { id: 'partial', searchTitleText: 'Lenin', searchText: 'Lenin revolution', kindId: 'book' },
    { id: 'title', searchTitleText: 'Lenin revolution', searchText: 'Lenin revolution', kindId: 'book' },
    { id: 'other-kind', searchTitleText: 'Lenin revolution', searchText: 'Lenin revolution', kindId: 'article' },
];
assert.deepEqual(searchDictionary(docs, 'docs', 'LENIN revolution', 'book').map(x => x.id), ['title', 'partial', 'body']);
assert.deepEqual(searchDictionary(docs, 'docs', '', 'book').map(x => x.id), ['body', 'partial', 'title']);
assert.equal(searchDictionary(docs, 'docs', 'missing').length, 0);
const terms = [{ term: '신경제정책', termOther: 'New Economic Policy', original: 'НЭП', aliasSearchText: 'NEP 네프', definition: '혼합 경제', period: '1921', category: 'economy' }];
assert.equal(searchDictionary(terms, 'terms', 'nep 경제', 'economy').length, 1);
assert.equal(searchDictionary(terms, 'terms', 'нэп 1921').length, 1);
assert.equal(searchDictionary(terms, 'terms', 'nep', '__none__').length, 0);
const events = [{ id: 'fr', title: '혁명', period: '1789', summary: '프랑스', searchExpressions: 'French Revolution' }, { id: 'ru', title: '혁명', period: '1917', summary: '러시아' }];
assert.deepEqual(searchDictionary(events, 'events', '혁명', '', item => item.id === 'fr').map(x => x.id), ['fr']);
assert.equal(searchDictionary(events, 'events', 'French 1789').length, 1);
const refreshed = [{ ...terms[0], aliasSearchText: '새별칭' }];
assert.equal(searchDictionary(refreshed, 'terms', '새별칭').length, 1);
assert.equal(searchDictionary(terms, 'terms', '새별칭').length, 0);

const many = Array.from({ length: 60 }, (_, n) => ({ id: 'doc-' + n, title: 'Title ' + n, description: 'Description', kind: 'Book', kindId: 'book', searchTitleText: 'Title ' + n, searchText: 'Title ' + n }));
let loads = 0;
const handler = dictionarySearchRoute({ kind: 'docs', view: 'partials/commulingo-docs-cards', target: '#commu-doc-list', load: async () => { loads++; return { items: many }; } });
async function request(query, lang = 'ko') {
    let code = 200, body;
    await handler({ query, app: { render: (view, locals, callback) => ejs.renderFile(path.resolve('views', view + '.ejs'), locals, callback) } }, {
        locals: { lang }, setHeader() {}, status(value) { code = value; return this; }, json(value) { body = value; },
    });
    return { code, body };
}
(async () => {
    const first = await request({ q: 'Title' }, 'en');
    assert.equal(first.code, 200);
    assert.equal(first.body.total, 60);
    assert.equal((first.body.html.match(/class="commu-event-card"/g) || []).length, 24);
    assert(first.body.html.includes('href="/en/commulingo/docs/doc-0"'));
    assert(!first.body.html.includes('data-search'));
    const second = await request({ q: 'Title', page: '2' });
    assert(second.body.html.includes('/doc-24"'));
    assert(!second.body.html.includes('/doc-0"'));
    const last = await request({ q: 'Title', page: '999' });
    assert.equal(last.body.page, 3);
    assert.equal((last.body.html.match(/class="commu-event-card"/g) || []).length, 12);
    const empty = await request({ q: 'missing' });
    assert.equal(empty.body.total, 0);
    assert(!empty.body.html.includes('commu-event-card'));
    const before = loads;
    for (const invalid of [{ q: ['bad'] }, { q: 'x'.repeat(201) }, { page: '-1' }, { page: '1.5' }, { kind: {} }]) {
        assert.equal((await request(invalid)).code, 400);
    }
    assert.equal(loads, before);
    assert(many.every(doc => !Object.hasOwn(doc, 'onPage')));
    console.log('dictionary search: ranking, aliases, filters, refresh, pagination, English links, validation passed');
})().catch(err => { console.error(err); process.exitCode = 1; });
