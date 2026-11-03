#!/usr/bin/env node
// Dated figures (indicators.js): the indicator/<id> document shape, the
// derived figures computed from a series, token expansion in prose, and the
// write check that refuses a token naming no figure. The data-document store
// is stubbed over the database; nothing touches Postgres.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'commulingo-ind-'));
process.env.COMMULINGO_DATA_DOCUMENTS_SNAPSHOT = path.join(dir, 'snapshot.json');
process.env.COMMULINGO_ACTIVITY_CATALOG_FILE = '';
process.env.COMMULINGO_DATA_DOCUMENTS_REFRESH_MS = '0';

const series = {
    id: 'kr-base-rate', title: { ko: '한국은행 기준금리', en: 'Bank of Korea base rate' }, unit: 'percent', decimals: 2,
    source: { ko: '한국은행', en: 'Bank of Korea', url: 'https://www.bok.or.kr/' },
    values: [
        { from: '2024-10-11', value: 3.25, source: 'https://www.bok.or.kr/a' },
        { from: '2025-05-29', value: 2.5, source: 'https://www.bok.or.kr/b' },
    ],
};
const table = new Map([
    ['activity-catalog', { revision: 1, content: { version: 1, functions: [{ id: 'f' }], affiliations: [{ id: 'a' }] } }],
    ['indicator/kr-base-rate', { revision: 1, content: series }],
    ['indicator/us-fed-funds-rate', { revision: 1, content: {
        id: 'us-fed-funds-rate', title: { ko: '미국 연방기금금리', en: 'US federal funds rate' }, unit: 'percent', decimals: 2,
        source: { ko: '연준', en: 'Fed', url: 'https://www.federalreserve.gov/' },
        values: [{ from: '2026-09-17', value: [3.75, 4], source: 'https://www.federalreserve.gov/a' }],
    } }],
    ['indicator/kr-minimum-wage', { revision: 1, content: {
        id: 'kr-minimum-wage', title: { ko: '최저임금', en: 'Minimum wage' }, unit: 'krw-per-hour', decimals: 0,
        source: { ko: '최저임금위원회', en: 'Minimum Wage Commission', url: 'https://www.minimumwage.go.kr/' },
        values: [
            { from: '2026-01-01', value: 10320, source: 'https://www.minimumwage.go.kr/a' },
            { from: '2027-01-01', value: 10700, source: 'https://www.minimumwage.go.kr/a' },
        ],
    } }],
]);
const dbPath = require.resolve('../../config/database');
require.cache[dbPath] = { id: dbPath, filename: dbPath, loaded: true, exports: {
    query: async (sql, params) => {
        if (/pg_stat_user_tables/.test(sql)) return { rows: [{ writes: '1', tables: 1 }] };
        if (/SELECT key, revision FROM/.test(sql)) return { rows: [...table.keys()].sort().map(key => ({ key, revision: table.get(key).revision })) };
        if (/WHERE key = ANY/.test(sql)) {
            return { rows: params[0].filter(key => table.has(key)).map(key => ({ key, ...table.get(key), updated_at: '2026-11-03T00:00:00Z' })) };
        }
        throw new Error('unexpected query ' + sql);
    },
} };

(async () => {
    const dd = require('../../data/commulingo/data-documents');
    await dd.refreshDataDocuments();
    const ind = require('../../data/commulingo/indicators');

    // Document shape.
    dd.validateDataDocument('indicator/kr-base-rate', series);
    assert.throws(() => dd.validateDataDocument('indicator/kr-base-rate', { ...series, id: 'other' }), /id must match/);
    assert.throws(() => dd.validateDataDocument('indicator/kr-base-rate', { ...series, values: [...series.values].reverse() }), /date order/);
    assert.throws(() => dd.validateDataDocument('indicator/kr-base-rate',
        { ...series, values: [{ from: '2025-05-29', value: 2.5, source: 'http://x' }] }), /https/);
    assert.throws(() => dd.validateDataDocument('indicator/kr-jeonse-conversion-cap',
        { ...series, id: 'kr-jeonse-conversion-cap' }), /computed from kr-base-rate/);

    // Resolution: latest by default, the level in force on a date, derived figures.
    assert.equal(ind.resolveIndicator('kr-base-rate').value, 2.5);
    assert.equal(ind.resolveIndicator('kr-base-rate', '2025-01-01').value, 3.25);
    assert.equal(ind.resolveIndicator('kr-base-rate', '2020-01-01'), null);
    assert.equal(ind.resolveIndicator('kr-jeonse-conversion-cap').value, 4.5);
    assert.equal(ind.resolveIndicator('kr-jeonse-conversion-cap').from, '2025-05-29');
    assert.equal(ind.resolveIndicator('nope'), null);

    // Expansion in prose, both languages and all three forms.
    assert.equal(ind.expandIndicators('상한은 {{indicator:kr-jeonse-conversion-cap}}이다.', 'ko'), '상한은 연 4.50%(2025년 5월 29일 기준)이다.');
    assert.equal(ind.expandIndicators('{{indicator:kr-base-rate|value}}', 'ko'), '연 2.50%');
    assert.equal(ind.expandIndicators('{{indicator:kr-base-rate|date}}', 'ko'), '2025년 5월 29일');
    assert.equal(ind.expandIndicators('The cap is {{indicator:kr-jeonse-conversion-cap}}.', 'en'), 'The cap is 4.50% a year (as of 29 May 2025).');
    assert.equal(ind.expandIndicators('{{indicator:gone}}', 'ko'), '[?]');
    assert.equal(ind.expandIndicators('no tokens', 'ko'), 'no tokens');
    assert.deepEqual(ind.expandIndicatorPair({ ko: '{{indicator:kr-base-rate|value}}', en: '{{indicator:kr-base-rate|value}}' }),
        { ko: '연 2.50%', en: '2.50% a year' });

    // Writes refuse a token that names no figure.
    ind.assertKnownIndicators('body', { ko: '{{indicator:kr-base-rate}}', en: '{{indicator:kr-jeonse-conversion-cap|value}}' });
    assert.throws(() => ind.assertKnownIndicators('body', { ko: '{{indicator:kr-base-rat}}', en: '' }), /unknown indicator\(s\): kr-base-rat/);

    // Other units, ranges and a row announced ahead of its date. The clock is
    // fixed: 2026-12-31 15:00 UTC is already 1 January 2027 in Seoul.
    const realNow = Date.now;
    const at = iso => { Date.now = () => Date.parse(iso); };
    at('2026-12-31T14:59:00Z');
    assert.equal(ind.expandIndicators('{{indicator:us-fed-funds-rate|value}}', 'ko'), '연 3.75~4.00%');
    assert.equal(ind.expandIndicators('{{indicator:us-fed-funds-rate|value}}', 'en'), '3.75–4.00% a year');
    assert.equal(ind.expandIndicators('{{indicator:kr-minimum-wage}}', 'ko'), '시간당 10,320원(2026년 1월 1일 기준)');
    assert.equal(ind.expandIndicators('{{indicator:kr-minimum-wage|value}}', 'en'), 'KRW 10,320 an hour');
    assert.equal(ind.expandIndicators('{{indicator:kr-minimum-wage-monthly|value}}', 'ko'), '월 2,156,880원');
    assert.equal(ind.expandIndicators('{{indicator:kr-minimum-wage-monthly|value}}', 'en'), 'KRW 2,156,880 a month');
    const ref = ind.indicatorsRef();
    assert.equal(ind.indicatorsRef(), ref, 'the render-memo key is stable while nothing changes');
    at('2026-12-31T15:00:00Z');
    assert.equal(ind.expandIndicators('{{indicator:kr-minimum-wage|value}}', 'ko'), '시간당 10,700원');
    assert.equal(ind.expandIndicators('{{indicator:kr-minimum-wage-monthly|value}}', 'ko'), '월 2,236,300원');
    const flipped = ind.indicatorsRef();
    assert.notEqual(flipped, ref, 'a dated row coming into force changes the render-memo key');
    at('2027-01-02T00:00:00Z');
    assert.equal(ind.indicatorsRef(), flipped, 'a new day with no new row keeps the render-memo key');
    Date.now = realNow;

    assert.throws(() => dd.validateDataDocument('indicator/kr-base-rate', { ...series, unit: 'dollars' }), /unit must be one of/);
    assert.throws(() => dd.validateDataDocument('indicator/kr-base-rate',
        { ...series, values: [{ from: '2026-09-17', value: [4, 3.75], source: 'https://x' }] }), /number or \[low, high\]/);
    assert.throws(() => dd.validateDataDocument('indicator/kr-minimum-wage',
        { id: 'kr-minimum-wage', title: { ko: 'a', en: 'a' }, unit: 'krw-per-hour', values: [{ from: '2026-01-01', value: [1, 2], source: 'https://x' }] }), /only a percent series/);

    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Indicators: dated series, derived figures, token expansion and write checks');
    process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
