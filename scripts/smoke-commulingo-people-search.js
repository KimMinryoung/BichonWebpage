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
    desc: '혁명의 지도자 10월 혁명 러시아 볼셰비키 의장 인민위원회',
});
// Empty searches must not build/sort an index.
assert.deepEqual(searchPeople({ groups: [{ people: [person] }] }, ' ', () => { throw new Error('Unexpected sort'); }), { name: [], desc: [] });
const other = { ...person, id: 'other', names: { en: 'Someone' }, displayName: 'Someone', cyrillic: '', aliases: {}, linkExpressions: [], bio: 'Lenin' };
const snapshot = { groups: [{ people: [person, other] }] };
const sort = rows => rows;
const ids = hits => Object.fromEntries(Object.entries(hits).map(([key, rows]) => [key, rows.map(row => row.id)]));
assert.deepEqual(ids(searchPeople(snapshot, ' LENIN ', sort)), { name: ['lenin'], desc: ['other'] });
assert.deepEqual(ids(searchPeople(snapshot, '울리야노프 의장', sort)), { name: [], desc: ['lenin'] });
// Activity labels are filtered on the activities page, not searched.
assert.deepEqual(ids(searchPeople(snapshot, '혁명가', sort)), { name: [], desc: [] });
assert.deepEqual(ids(searchPeople(snapshot, '일리치 볼셰비키', sort)), { name: [], desc: ['lenin'] });
assert.equal(searchPeople(snapshot, 'ЛЕНИН', sort).name[0].id, 'lenin');
assert.deepEqual(ids(searchPeople(snapshot, ' ', sort)), { name: [], desc: [] });
assert.deepEqual(ids(searchPeople(snapshot, 'missing', sort)), { name: [], desc: [] });
const updated = { groups: [{ people: [{ ...person, aliases: { ko: ['새별칭'] } }] }] };
assert.equal(searchPeople(updated, '새별칭', sort).name.length, 1);
assert.equal(searchPeople(snapshot, '새별칭', sort).name.length, 0);
// Name hits rank by how much of the person's own name the query is, not by era:
// a pseudonym alias and a longer surname come after the exact family name.
const luca = (id, ko, family, aliases = []) => ({ id, names: { ko, family }, displayName: ko, aliases: { ko: aliases }, linkExpressions: [] });
const lucaSnapshot = { groups: [{ people: [
    luca('ksenofontov', '이반 크세노폰토비치 크세노폰토프', '크세노폰토프', ['루카']),
    luca('lukacs', '루카치 죄르지', '루카치'),
    luca('vasile-luca', '바실레 루카', '루카'),
    luca('lucas', '존 P. 루카스', '루카스'),
] }] };
assert.deepEqual(searchPeople(lucaSnapshot, '루카', sort).name.map(p => p.id), ['vasile-luca', 'ksenofontov', 'lukacs', 'lucas']);
assert.deepEqual(searchPeople(lucaSnapshot, '바실레 루카', sort).name.map(p => p.id), ['vasile-luca']);
console.log('people search: ranking, bilingual aliases, AND matching, search fields, snapshot refresh passed');
