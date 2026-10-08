const assert = require('node:assert/strict');
const path = require('node:path');
const ejs = require('ejs');
const { searchDictionary } = require('../utils/dictionary-search');
const { dictionarySearchRoute } = require('../utils/dictionary-search-route');
const { eventPeriodYears, parseEventPeriodQuery } = require('../utils/event-period-search');
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
const periodEvents = [
    { id: 'fr', title: '프랑스 혁명', period: '1789–1799', summary: '프랑스', searchExpressions: 'French Revolution' },
    { id: 'wars', title: '프랑스 혁명 전쟁', period: '1792–1802', summary: '' },
    { id: 'haiti', title: '아이티 혁명', period: '1791–1804', summary: '' },
    { id: 'single', title: '단일 사건', period: '1798', summary: '' },
    { id: 'mention', title: '이후 사건', period: '1800–1801', summary: '1798 프랑스 French' },
    { id: 'unknown', title: '연도 불명', period: '미상', summary: '1798' },
    { id: 'months', title: '월 범위', period: '1917.02–07', summary: '' },
    { id: 'cross', title: '해를 넘는 월 범위', period: '1917.10–1918.01', summary: '' },
];
const ids = q => searchDictionary(periodEvents, 'events', q).map(x => x.id);
assert.deepEqual(ids('1798'), ['fr', 'wars', 'haiti', 'single']);
assert.deepEqual(ids('1798년'), ids('1798'));
assert.deepEqual(ids('1789'), ['fr']);
assert.deepEqual(ids('1799'), ['fr', 'wars', 'haiti']);
assert.deepEqual(ids('1800'), ['wars', 'haiti', 'mention']);
assert.deepEqual(ids('1803'), ['haiti']);
assert.deepEqual(ids('프랑스 1798'), ['fr', 'wars']);
assert.deepEqual(ids('French 1798'), ['fr']);
assert.deepEqual(ids('1790 – 1800'), ['fr', 'wars', 'haiti', 'single', 'mention']);
assert.deepEqual(ids('1800~1790'), ids('1790 – 1800'));
assert.deepEqual(ids('1790년~1800년'), ids('1790 – 1800'));
assert.deepEqual(ids('1917'), ['months', 'cross']);
assert.deepEqual(ids('1918'), ['cross']);
assert.deepEqual(ids('1919'), []);
assert.deepEqual(searchDictionary(periodEvents, 'events', '1798', '', e => e.id === 'haiti').map(x => x.id), ['haiti']);
assert.deepEqual(eventPeriodYears('1917.02–07'), { startYear: 1917, endYear: 1917 });
assert.deepEqual(eventPeriodYears('1917.10–1918.01'), { startYear: 1917, endYear: 1918 });
assert.deepEqual(eventPeriodYears('1945.08'), { startYear: 1945, endYear: 1945 });
for (const label of ['미상', '', '1799–1789', '0000', '1917.13', '1798년대 이후']) {
    assert.deepEqual(eventPeriodYears(label), { startYear: null, endYear: null });
}
// Explicit stored years take precedence, while old snapshots use the label.
assert.equal(searchDictionary([{ title: 'Event', period: '미상', startYear: 1789, endYear: 1799 }], 'events', '1798').length, 1);
assert.deepEqual(parseEventPeriodQuery('프랑스 1790 – 1800 혁명'), {
    periods: [{ startYear: 1790, endYear: 1800 }], keywords: '프랑스  혁명',
});
const refreshed = [{ ...terms[0], aliasSearchText: '새별칭' }];
assert.equal(searchDictionary(refreshed, 'terms', '새별칭').length, 1);
assert.equal(searchDictionary(terms, 'terms', '새별칭').length, 0);

const many = Array.from({ length: 60 }, (_, n) => ({ id: 'doc-' + n, title: 'Title ' + n, description: 'Description', kind: 'Book', kindId: 'book', searchTitleText: 'Title ' + n, searchText: 'Title ' + n }));
let loads = 0;
const handler = dictionarySearchRoute({ kind: 'docs', view: 'partials/commulingo-docs-cards', target: '#commu-doc-list', load: async () => { loads++; return { items: many }; } });
async function request(query, lang = 'ko', route = handler) {
    let code = 200, body;
    await route({ query, app: { render: (view, locals, callback) => ejs.renderFile(path.resolve('views', view + '.ejs'), locals, callback) } }, {
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
    assert(first.body.pager.includes('q=Title'));
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
    const eventRoute = dictionarySearchRoute({ kind: 'events', view: 'partials/commulingo-events-cards', target: '#commu-event-list',
        load: async () => ({ items: periodEvents }) });
    const yearResults = await request({ q: '1798' }, 'ko', eventRoute);
    assert.equal(yearResults.body.total, 4);
    assert.equal(yearResults.body.highlightQuery, '');
    assert(yearResults.body.html.includes('/fr"'));
    const englishResults = await request({ q: 'French 1798년' }, 'en', eventRoute);
    assert.equal(englishResults.body.total, 1);
    assert.equal(englishResults.body.highlightQuery, 'French');
    assert(englishResults.body.html.includes('/en/commulingo/events/fr"'));
    const noYears = await request({ q: '1700' }, 'ko', eventRoute);
    assert.equal(noYears.body.total, 0);
    console.log('dictionary search: ranking, aliases, filters, refresh, pagination, English links, validation passed');
})().catch(err => { console.error(err); process.exitCode = 1; });
