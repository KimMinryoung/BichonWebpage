const assert = require('node:assert/strict');
const { searchFields, searchPeople } = require('../utils/people-search');
const person = {
    id: 'lenin', names: { ko: '레닌', en: 'Vladimir Lenin' }, displayName: '레닌',
    cyrillic: 'Ленин', aliases: { ko: ['울리야노프'], en: ['Ulyanov'] },
    linkExpressions: [{ text: '일리치', role: 'identity' }, { text: '볼셰비키', role: 'related' }],
    role: { label: '혁명가' }, career: [{ r: '의장' }], institutionRoles: [{ role: '지도자', officeTitle: '인민위원회' }],
    epithet: '혁명의 지도자', moment: '10월 혁명', bio: '러시아',
};
assert.deepEqual(searchFields(person), {
    name: '레닌 vladimir lenin 레닌 Ленин 울리야노프 ulyanov 일리치'.toLowerCase(),
    role: '혁명가 의장 지도자 인민위원회',
    desc: '혁명의 지도자 10월 혁명 러시아 볼셰비키',
});
// Empty searches must not build/sort an index.
assert.deepEqual(searchPeople({ groups: [{ people: [person] }] }, ' ', () => { throw new Error('Unexpected sort'); }), { name: [], role: [], desc: [] });
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
console.log('people search: ranking, bilingual aliases, AND matching, search fields, snapshot refresh passed');
