const assert = require('node:assert/strict');
// No database is needed: stub the pool the link modules pull in.
const databasePath = require.resolve('../config/database');
require.cache[databasePath] = { id: databasePath, filename: databasePath, loaded: true, exports: { query: async () => ({ rows: [] }) } };
const { familyNameOf } = require('../data/commulingo/family-name');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');

// Monarchs link only by the combined form (니콜라이 2세); the regnal number
// alone — 2세, II, 'II of Greece' — is never a family name to index.
for (const family of ['2세', '16세', 'II', 'XVI', 'II of Greece', 'I']) {
    assert.equal(familyNameOf({ names: { family } }), '', family);
}
assert.equal(familyNameOf({ names: { family: '케네디' } }), '케네디');

const monarch = (id, given, family, display) => ({ id, names: { given, family, short: display, display }, displayName: display, aliases: { ko: [], en: [] } });
const ko = buildPersonLinkIndex([monarch('nicholas-ii', '니콜라이', '2세', '니콜라이 2세'), monarch('alexander-ii', '알렉산드르', '2세', '알렉산드르 2세')], { lang: 'ko' });
assert.ok(ko.byAlias['니콜라이 2세'], 'combined form links');
assert.ok(!ko.byAlias['2세'], 'bare regnal number never links');
const en = buildPersonLinkIndex([monarch('george-ii-of-greece', 'George', 'II of Greece', 'George II of Greece')], { lang: 'en' });
assert.ok(!Object.keys(en.byAlias).some(a => /^ii of greece$/i.test(a)), 'II of Greece alone never links');
console.log('regnal numbers link only as part of the full monarch name');
