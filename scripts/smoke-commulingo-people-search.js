const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { searchFields, searchPeople } = require('../utils/people-search');
const person = {
    id: 'lenin', names: { ko: '레닌', en: 'Vladimir Lenin' }, displayName: '레닌',
    cyrillic: 'Ленин', aliases: { ko: ['울리야노프'], en: ['Ulyanov'] },
    linkExpressions: [{ text: '일리치', role: 'identity' }, { text: '볼셰비키', role: 'related' }],
    role: { label: '혁명가' }, career: [{ r: '의장' }], institutionRoles: [{ role: '지도자', officeTitle: '인민위원회' }],
    epithet: '혁명의 지도자', moment: '10월 혁명', bio: '러시아',
};
// Guard against drift from the existing card's search contract.
const template = fs.readFileSync('views/partials/commulingo-person-card.ejs', 'utf8');
const fieldsCode = template.slice(template.indexOf('var nameSearch'), template.indexOf('%>'));
const context = { person };
vm.runInNewContext(fieldsCode, context);
assert.deepEqual(searchFields(person), { name: context.nameSearch, role: context.roleSearch, desc: context.descSearch });
const other = { ...person, id: 'other', names: { en: 'Someone' }, displayName: 'Someone', cyrillic: '', aliases: {}, linkExpressions: [], bio: 'Lenin' };
const snapshot = { groups: [{ people: [person, other] }] };
const sort = rows => rows;
const ids = hits => Object.fromEntries(Object.entries(hits).map(([key, rows]) => [key, rows.map(row => row.id)]));
assert.deepEqual(ids(searchPeople(snapshot, ' LENIN ', sort)), { name: ['lenin'], role: [], desc: ['other'] });
assert.deepEqual(ids(searchPeople(snapshot, '울리야노프 의장', sort)), { name: [], role: ['lenin'], desc: [] });
assert.deepEqual(ids(searchPeople(snapshot, '일리치 볼셰비키', sort)), { name: [], role: [], desc: ['lenin'] });
assert.equal(searchPeople(snapshot, 'ЛЕНИН', sort).name[0].id, 'lenin');
assert.deepEqual(ids(searchPeople(snapshot, ' ', sort)), { name: [], role: [], desc: [] });
assert.deepEqual(ids(searchPeople(snapshot, 'missing', sort)), { name: [], role: [], desc: [] });
const updated = { groups: [{ people: [{ ...person, aliases: { ko: ['새별칭'] } }] }] };
assert.equal(searchPeople(updated, '새별칭', sort).name.length, 1);
assert.equal(searchPeople(snapshot, '새별칭', sort).name.length, 0);
console.log('people search: ranking, bilingual aliases, AND matching, card parity, snapshot refresh passed');
