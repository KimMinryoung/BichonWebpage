const assert = require('node:assert/strict');
// No database is needed: stub the pool the link modules pull in.
const databasePath = require.resolve('../config/database');
require.cache[databasePath] = { id: databasePath, filename: databasePath, loaded: true, exports: { query: async () => ({ rows: [] }) } };
const { familyFirstPartsProblem, resolveNameParts } = require('../data/commulingo/people-admin-validation');
const { buildPersonLinkIndex } = require('../data/commulingo/people-linkify');

const parts = (given, family) => ({ given, family });

// A fused Korean-text name is still stored as family + given, like its English.
assert.equal(familyFirstPartsProblem(parts('쩌둥', '마오'), parts('Zedong', 'Mao'), 'china'), '');
assert.match(familyFirstPartsProblem(parts('', '마오쩌둥'), parts('Zedong', 'Mao'), 'china'), /disagree/);
// The legacy full name alone cannot split 마오쩌둥, so the write is refused.
const legacy = { name: { ko: '마오쩌둥', en: 'Mao Zedong' } };
assert.match(familyFirstPartsProblem(resolveNameParts(legacy, 'ko', 'china'), resolveNameParts(legacy, 'en', 'china'), 'china'), /disagree/);
// A mononym or pen name keeps the whole name in family in both languages.
assert.equal(familyFirstPartsProblem(parts('', '푸이'), parts('', 'Puyi'), 'china'), '');
assert.equal(familyFirstPartsProblem(parts('', '또흐우'), parts('', 'Tố Hữu'), 'vietnam'), '');
// A Korean name always has a surname to split off.
assert.match(familyFirstPartsProblem(parts('', '허가이'), parts('', 'Ho Ka-i'), 'north-korea'), /surname/);
assert.equal(familyFirstPartsProblem(parts('가이', '허'), parts('Ka-i', 'Ho'), 'north-korea'), '');
// Other name orders are not this rule's business.
assert.equal(familyFirstPartsProblem(parts('', '히로히토'), parts('', 'Hirohito'), 'japan'), '');
assert.equal(familyFirstPartsProblem(parts('', '카모'), parts('', 'Kamo'), 'soviet'), '');

// Korean, Chinese and Vietnamese surnames never link bare; others still do.
const person = (id, code, given, family, display) => ({
    id, citizenship: { code }, names: { given, family, short: display, display }, displayName: display, aliases: { ko: [], en: [] },
});
const en = buildPersonLinkIndex([
    person('mao-zedong', 'china', 'Zedong', 'Mao', 'Mao Zedong'),
    person('truong-chinh', 'vietnam', 'Chinh', 'Trường', 'Trường Chinh'),
    person('sen-katayama', 'japan', 'Sen', 'Katayama', 'Sen Katayama'),
    person('genrikh-lyushkov', 'soviet', 'Genrikh', 'Lyushkov', 'Genrikh Lyushkov'),
], { lang: 'en' });
assert.ok(en.byAlias['Mao Zedong'], 'full name links');
assert.ok(!en.byAlias.Mao, 'Mao alone never links');
assert.ok(!en.byAlias['Trường'], 'Trường alone never links');
assert.ok(en.byAlias.Katayama, 'a Japanese family name still links');
assert.ok(en.byAlias.Lyushkov, 'a Western family name still links');
const ko = buildPersonLinkIndex([person('mao-zedong', 'china', '쩌둥', '마오', '마오쩌둥')], { lang: 'ko' });
assert.ok(ko.byAlias['마오쩌둥'], 'fused full name links');
assert.ok(!ko.byAlias['마오'], '마오 alone never links');
console.log('family-first names split into parts; their bare surnames never link');
