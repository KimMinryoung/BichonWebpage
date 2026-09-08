const assert = require('node:assert/strict');
const { planCollectionEdits } = require('../data/commulingo/people-collection-edits');
const before = {
    aliases: { ko: ['이전 별칭'], en: ['Original alias'] },
    scenes: [['collection', 'episode']],
    career: [{ id: '100', y: '1920–1925', r: { ko: '연구원', en: 'Researcher' } }],
};
const plan = planCollectionEdits(before, {
    aliasEdits: [{ op: 'update', lang: 'ko', value: '이전 별칭', replacement: '새 별칭' }],
    careerEdits: [{ op: 'update', id: '100', entry: { r: { ko: '주임 연구원' } } }],
    sceneEdits: [{ op: 'update', scene: ['collection', 'episode'], replacement: ['collection', 'episode-2'] }],
});
assert.deepEqual(plan.aliases, { ko: ['새 별칭'], en: ['Original alias'] });
assert.deepEqual(plan.scenes, [['collection', 'episode-2']]);
assert.deepEqual(plan.career.entries[0], { id: '100', y: '1920–1925', r: { ko: '주임 연구원', en: 'Researcher' } });
assert.equal(before.career[0].r.ko, '연구원');
assert.equal(before.aliases.ko[0], '이전 별칭');
const invalid = [
    { aliases: {}, aliasEdits: [] },
    { career: [], careerEdits: [] },
    { scenes: [], sceneEdits: [] },
    { aliasEdits: [{ op: 'add', lang: 'en', value: 'Original alias' }] },
    { aliasEdits: [{ op: 'remove', lang: 'ko', value: '없는 별칭' }] },
    { aliasEdits: [{ op: 'remove', lang: 'ko', value: '이전 별칭', typo: true }] },
    { sceneEdits: [{ op: 'add', scene: ['collection', 'episode'] }] },
    { sceneEdits: [{ op: 'update', scene: ['collection', 'episode'] }] },
    { careerEdits: [{ op: 'update', id: '999', entry: { y: '1930' } }] },
    { careerEdits: [{ op: 'add', entry: { r: { ko: '직책' } } }] },
    { careerEdits: [{ op: 'update', id: '100', entry: { period: {} } }] },
    { careerEdits: [{ op: 'remove', id: true }] },
    { careerEdits: Array(101).fill({ op: 'remove', id: '100' }) },
];
for (const patch of invalid) assert.throws(() => planCollectionEdits(before, patch), { status: 400 });
console.log('collection operations preserve other records and reject duplicates, foreign IDs, typos and mixed replacement');
