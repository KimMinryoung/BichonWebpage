// A new person must be named by its evidence; a task or prompt is no source (2026-11-22).
const assert = require('node:assert/strict');
const { assertIdentityEvidence, sourcesFor } = require('../../data/commulingo/person-editorial-policy');
const card = { familyName: { ko: '코즐롭스키', en: 'Kozlovsky' }, givenName: { ko: '미하일', en: 'Mikhail' }, cyrillic: 'Михаил Козловский' };
const check = evidence => assertIdentityEvidence({ ...card, evidence }, []);
assert.throws(() => check([{ excerpt: 'Zyryanov and Matrosov headed the GUPV', source: 'https://example.org/gupv.htm' }]), /names them/);
assert.throws(() => check([{ excerpt: 'Mikhail Suslov was a deputy', source: 'https://example.org/x' }]), /names them/);
check([{ excerpt: 'назначен генерал Михаил Козловского', source: 'https://example.org/x' }]);
check([{ excerpt: '1898 – 1976', source: 'https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B7%D0%BB%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9' }]);
check([{ excerpt: 'Mikhaïl Kozlovski', source: '' }]);
assert.throws(() => sourcesFor({ sources: ['Task-specified institutional data: Deputy Chairman of KGB'] }), /not the task or prompt/);
assert.throws(() => sourcesFor({ sources: ['dates from task pre-verification'] }), /not the task or prompt/);
assert.deepEqual(sourcesFor({ sources: ['https://en.wikipedia.org/wiki/Lenin'] }), ['https://en.wikipedia.org/wiki/Lenin']);
console.log('person identity evidence and task-source refusal OK');
