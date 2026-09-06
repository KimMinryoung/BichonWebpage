const assert = require('node:assert/strict');
const fs = require('node:fs');
const ejs = require('ejs');
const { parseLifeYears, personLifeProblems } = require('../data/commulingo/person-life-years');
const { normalizeCommuLingoPeople } = require('../data/commulingo/people-standard');
const adminFields = require('../data/commulingo/people-admin-fields');
// No live database is needed for the rejection tests below.
const databasePath = require.resolve('../config/database');
require.cache[databasePath] = { id: databasePath, filename: databasePath, loaded: true, exports: {} };
const { createPersonAdmin, updatePersonAdmin } = require('../data/commulingo/people-admin-store');

const fate = { kind: 'natural', label: { ko: '생존', en: 'Living' } };
for (const years of ['1987–', '1987-', '?–', '1979?–']) {
    assert.equal(parseLifeYears(years).isLiving, true);
    assert.deepEqual(personLifeProblems(years, null), []);
    assert(personLifeProblems(years, fate).length);
    assert(personLifeProblems(years, { kind: 'natural', label: {} }).length);
    assert(personLifeProblems(years, { kind: '', label: { en: 'Died' } }).length);
}
for (const years of ['현재', '현대', '1987–현재', '1987–present', '20세기–현재', 'b. 1987', 1987]) {
    assert(personLifeProblems(years, null).length, String(years));
}
for (const years of ['1889–1958?', '?–1938', 'c. 1953–2001', '1856/1857–1882', '1893–1937/1938?', '1879 – 1944 이후', '?–?', '1885–?', '']) {
    assert.equal(parseLifeYears(years).isLiving, false, years);
    assert.deepEqual(personLifeProblems(years, { kind: 'executed', label: { ko: '처형', en: 'Executed' } }), []);
}
assert.deepEqual(adminFields.parseLifeYears('1987–'), { birthYear: 1987, deathYear: null });
assert.deepEqual(adminFields.parseLifeYears('?–1938'), { birthYear: null, deathYear: 1938 });
assert.deepEqual(adminFields.parseLifeYears('1889–1958?'), { birthYear: 1889, deathYear: null });
assert.deepEqual(personLifeProblems('1894–1920', { kind: 'executed', label: { en: 'Burned alive in a locomotive firebox' } }), []);
assert(personLifeProblems('', { kind: 'natural', label: { en: 'Active scholar' } }).length);

// Legacy snapshots must be safe even before the background refresh arrives.
const card = fs.readFileSync(require.resolve('../views/partials/commulingo-person-card.ejs'), 'utf8');
for (const lang of ['ko', 'en']) {
    for (const years of ['현재', '현대', '1987–현재', '1979?–', '?–']) {
        const person = normalizeCommuLingoPeople({ people: [{ id: 'test-person', years, fate }] }, { lang }).peopleById['test-person'];
        assert.equal(person.fateKind, '');
        assert.equal(person.fateLabel, '');
        assert.deepEqual(person.fate, { kind: '', label: '' });
        assert(!/현재|현대/.test(person.years));
        const html = ejs.render(card, { person, groupId: '', strings: { commuLingoViews: { personCard: {} } }, roleIconSvg: () => '', linkifyPersonText: text => text });
        assert(!html.includes('class="commu-fate'));
    }
}

// Exercise API integration and PATCH's merged stored/incoming state. A patch
// of just one field must not bypass validation of its counterpart.
async function main() {
    await assert.rejects(createPersonAdmin({ years: '현재' }), { status: 400 });
    await assert.rejects(createPersonAdmin({ years: '1987–', fate }), { status: 400 });
    const stored = { id: 'test-person', years_label: '1987–', fate_kind: '', fate_label_ko: '', fate_label_en: '' };
    const client = { query: async sql => {
        assert(/^\s*SELECT/.test(sql), 'invalid input must not write');
        return { rows: /FROM commulingo_people\s+WHERE/.test(sql) ? [stored] : [] };
    } };
    await assert.rejects(updatePersonAdmin('test-person', { fate }, { client }), { status: 400 });
    await assert.rejects(updatePersonAdmin('test-person', { years: '1987–현재' }, { client }), { status: 400 });
    stored.years_label = '1889–1958';
    stored.fate_kind = 'natural';
    stored.fate_label_ko = '사망';
    await assert.rejects(updatePersonAdmin('test-person', { years: '1889–' }, { client }), { status: 400 });
    console.log('person life years: parser, living/unknown distinction, legacy rendering, create and merged PATCH validation OK');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
