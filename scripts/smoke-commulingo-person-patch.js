const assert = require('node:assert/strict');
const { mergeLocalizedPatch, mergePersonPatch } = require('../data/commulingo/people-patch');

const text = { ko: '한국어', en: 'English' };
assert.deepEqual(mergeLocalizedPatch(text, { ko: '수정' }), { ko: '수정', en: 'English' });
assert.deepEqual(mergeLocalizedPatch(text, '수정'), { ko: '수정', en: 'English' });
assert.deepEqual(mergeLocalizedPatch(text, {}), text);
assert.deepEqual(mergeLocalizedPatch(text, { en: '' }), { ko: '한국어', en: '' });
assert.deepEqual(mergeLocalizedPatch(text, null), { ko: '', en: '' });
for (const invalid of [[], 1, true, { en: null }, { ko: [] }, { fr: 'bonjour' }]) {
    assert.throws(() => mergeLocalizedPatch(text, invalid), { status: 400 });
}
const before = {
    bio: text,
    fate: { kind: 'natural', label: text },
    aliases: { ko: ['원문'], en: ['Original'] },
    citizenship: { code: 'soviet', label: { ko: '소련', en: 'USSR' } },
};
const patch = mergePersonPatch(before, {
    bio: { ko: '수정' }, fate: { label: { ko: '옥사' } }, aliases: { ko: [] },
    citizenship: { label: { en: 'Soviet Union' } },
});
assert.equal(patch.bio.en, 'English');
assert.deepEqual(patch.fate, { kind: 'natural', label: { ko: '옥사', en: 'English' } });
assert.deepEqual(patch.aliases, { ko: [], en: ['Original'] });
assert.deepEqual(patch.citizenship, { code: 'soviet', label: { ko: '소련', en: 'Soviet Union' } });
assert.deepEqual(mergePersonPatch(before, { citizenship: { code: 'hungary' } }).citizenship,
    { code: 'hungary', label: { ko: '', en: '' } });
assert.deepEqual(before.bio, text, 'merge never mutates the revision before-state');
assert.deepEqual(before.aliases.ko, ['원문']);
console.log('person patches preserve omitted languages, explicit clears, and the before-state');
