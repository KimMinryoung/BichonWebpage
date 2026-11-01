const assert = require('node:assert/strict');
const fs = require('node:fs');
const ejs = require('ejs');
const { normalizeLifeDate, resolveLifeDates, lifeDatesLabel } = require('../../data/commulingo/person-life-dates');
const { parseLifeYears } = require('../../data/commulingo/person-life-years');
const { normalizeCommuLingoPeople } = require('../../data/commulingo/people-standard');
const { validateEditorial } = require('../../data/commulingo/person-editorial-policy');

// A date needs the month; a year alone stays in years.
assert.deepEqual(normalizeLifeDate([1945, 4, 21], 'death'), [1945, 4, 21]);
assert.deepEqual(normalizeLifeDate([1945, 4], 'death'), [1945, 4]);
assert.equal(normalizeLifeDate(null, 'death'), null);
for (const bad of [[1945], [1945, 13], [1945, 2, 29], [1945, 4, 0], ['1945', 4], [1945, 4, 21, 1], '1945-04-21']) {
    assert.throws(() => normalizeLifeDate(bad, 'death'), { status: 400 }, JSON.stringify(bad));
}
assert.deepEqual(normalizeLifeDate([1944, 2, 29], 'birth'), [1944, 2, 29]);

// The year must be the exact year in years; omitted sides keep the stored date.
const model = parseLifeYears('1891–1945');
assert.deepEqual(resolveLifeDates({ death: [1945, 4, 21] }, { birth: [1891, 1, 24], death: null }, model), { birth: [1891, 1, 24], death: [1945, 4, 21] });
assert.deepEqual(resolveLifeDates(null, { birth: [1891, 1, 24], death: null }, model), { birth: null, death: null });
assert.throws(() => resolveLifeDates({ death: [1944, 4, 21] }, null, model), /does not match years/);
// A years change that orphans a stored date is refused.
assert.throws(() => resolveLifeDates(undefined, { birth: [1891, 1, 24], death: null }, parseLifeYears('1890–1945')), /does not match years/);
assert.throws(() => resolveLifeDates({ birth: [1891, 1] }, null, parseLifeYears('c. 1891–1945')), /does not match years/);
assert.throws(() => resolveLifeDates({ born: [1891, 1] }, null, model), /unknown lifeDates key/);

// Page label: each dated side shows its date, the other its years part.
assert.equal(lifeDatesLabel('1891–1945', { birth: [1891, 1, 24], death: [1945, 4, 21] }, 'ko'), '1891년 1월 24일 – 1945년 4월 21일');
assert.equal(lifeDatesLabel('1891–1945', { birth: null, death: [1945, 4, 21] }, 'en'), '1891 – 21 April 1945');
assert.equal(lifeDatesLabel('1891–1945?', { birth: [1891, 1], death: null }, 'en'), 'January 1891 – 1945?');
assert.equal(lifeDatesLabel('1987–', { birth: [1987, 3, 5], death: null }, 'ko'), '1987년 3월 5일 –');
assert.equal(lifeDatesLabel('1891–1945', { birth: null, death: null }, 'ko'), '');
assert.equal(lifeDatesLabel('1891–1945', undefined, 'ko'), '');

// Dates are a fact: they need evidence; null (clearing) does not.
const base = { sources: ['Record'] };
assert.throws(() => validateEditorial({ ...base, lifeDates: { death: [1945, 4, 21] } }), /supporting lifeDates/);
validateEditorial({ ...base, lifeDates: { death: [1945, 4, 21] }, evidence: [{ field: 'lifeDates', claim: 'Died 21 April 1945', source: 'Record', locator: 'Entry' }] });
validateEditorial({ ...base, lifeDates: null });

// Only the person page shows the dates; the card keeps the years.
const raw = { id: 'walter-model', years: '1891–1945', lifeDates: { birth: [1891, 1, 24], death: [1945, 4, 21] } };
const metaPath = require.resolve('../../views/partials/commulingo-person-meta.ejs');
const meta = fs.readFileSync(metaPath, 'utf8');
for (const [lang, label] of [['ko', '1891년 1월 24일 – 1945년 4월 21일'], ['en', '24 January 1891 – 21 April 1945']]) {
    const person = normalizeCommuLingoPeople({ people: [raw] }, { lang }).peopleById['walter-model'];
    assert.equal(person.years, '1891–1945');
    assert.equal(person.lifeDatesLabel, label);
    const render = extra => ejs.render(meta, { person, strings: { commuLingoViews: { personCard: {} } }, ...extra }, { filename: metaPath });
    assert(render({ showLifeDates: true }).includes(label));
    assert(!render({}).includes(label));
    assert(render({}).includes('1891–1945'));
}
console.log('person life dates: validation, years agreement, evidence, page-only label OK');
