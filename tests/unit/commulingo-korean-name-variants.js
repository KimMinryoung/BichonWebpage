const assert = require('node:assert/strict');
const { separatedForms } = require('../../data/commulingo/korean-name-variants');
const { buildPersonLinkIndex } = require('../../data/commulingo/people-linkify');
const { searchFields, matchedAlias } = require('../../utils/people-search');

assert.ok(separatedForms('Kim Ilsung').includes('Kim Il-sung'));
assert.ok(separatedForms('Park Chunghee').includes('Park Chung Hee'));
assert.ok(separatedForms('O Seongryun').includes('O Seong-ryun'));
assert.deepEqual(separatedForms('Syngman Rhee'), []);

const person = (id, en, code = 'south-korea') => {
    const [family, given] = en.split(' ');
    return { id, displayName: en, names: { en, display: en, short: family, family, given }, citizenship: { code }, aliases: { ko: [], en: [] } };
};
const people = [person('park-chung-hee', 'Park Chunghee'), person('x-ilsan', 'Vass Ilsung', 'hungary')];
const index = buildPersonLinkIndex(people, { lang: 'en' });
for (const form of ['Park Chunghee', 'Park Chung-hee', 'Park Chung Hee']) assert.equal(index.byAlias[form].id, 'park-chung-hee');
assert.equal(index.byAlias['Vass Il-sung'], undefined);
// A stored name of another card outranks a computed form.
const other = buildPersonLinkIndex([people[0], person('other', 'Park Chung-hee')], { lang: 'en' });
assert.equal(other.byAlias['Park Chung-hee'].id, 'other');

assert.ok(searchFields(people[0]).name.includes('park chung-hee'));
assert.equal(matchedAlias(people[0], 'Park Chung-hee', 'en'), '');
console.log('korean name variants ok');
