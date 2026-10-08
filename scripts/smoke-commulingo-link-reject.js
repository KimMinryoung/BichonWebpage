// Rejecting a link expression removes only aliases and explicit link
// expressions, never a headword or title, and records the reason.
const assert = require('node:assert/strict');
const path = require('node:path');
function stub(file, value) {
    const resolved = require.resolve(path.join(__dirname, '..', file));
    require.cache[resolved] = { id: resolved, filename: resolved, loaded: true, exports: value };
}
let queries = [];
let terms = {}, events = {}, docs = [], docPatches = [];
const client = {
    async query(sql, params = []) {
        queries.push({ sql, params });
        if (/FROM commulingo_terms WHERE id=\$1 FOR UPDATE/.test(sql)) return { rows: terms[params[0]] ? [terms[params[0]].row] : [] };
        if (/SELECT alias FROM commulingo_term_aliases/.test(sql)) return { rows: (terms[params[0]]?.aliases[params[1]] || []).map(alias => ({ alias })) };
        if (/FROM commulingo_history_events WHERE id=\$1 FOR UPDATE/.test(sql)) return { rows: events[params[0]] ? [events[params[0]]] : [] };
        if (/DELETE FROM commulingo_link_reviews/.test(sql)) return { rows: [{ policy: 'search' }] };
        return { rows: [] };
    },
    release() {},
};
stub('config/database.js', { connect: async () => client, query: client.query });
stub('data/commulingo/terms-store.js', { loadCommuLingoTerms: async () => [] });
stub('data/commulingo/history-events-store.js', { loadCommuLingoHistoryEvents: async () => [] });
stub('data/commulingo/people-store.js', { loadCommuLingoPeople: async () => ({ data: {} }), clearCommuLingoPeopleCache() {} });
stub('data/commulingo/docs-store.js', { listCommuLingoDocs: () => docs, getCommuLingoDocContent: () => null, refreshCommuLingoDocs: async () => {} });
stub('data/commulingo/docs-import.js', { updateDocMeta: (id, patch) => docPatches.push({ id, patch }) });
stub('data/commulingo/link-reviews-store.js', { loadLinkReviews: async () => new Map(), refreshLinkReviews: async () => new Map() });
const { rejectExpression } = require('../data/commulingo/link-review-service');
const note = '표준 번역어가 따로 있어 별칭에서 뺍니다.';
const ran = pattern => queries.some(q => pattern.test(q.sql));

(async () => {
    terms['abm-treaty'] = {
        row: { term_ko: 'ABM 조약', term_en: 'ABM Treaty', link_expressions: [{ lang: 'ko', text: '반탄도탄미사일 조약', role: 'short', policy: 'search' }] },
        aliases: { ko: ['ABM 조약', '반탄도탄미사일 조약'] },
    };
    await rejectExpression({ kind: 'term', id: 'abm-treaty', lang: 'ko', text: '반탄도탄미사일 조약', note }, 'tester');
    const deleted = queries.find(q => /DELETE FROM commulingo_term_aliases/.test(q.sql));
    assert.deepEqual(deleted.params, ['abm-treaty', 'ko', '반탄도탄미사일 조약']);
    assert.deepEqual(JSON.parse(queries.find(q => /UPDATE commulingo_terms SET link_expressions/.test(q.sql)).params[1]), []);
    assert.ok(ran(/INSERT INTO commulingo_people_revisions/) && ran(/INSERT INTO commulingo_link_review_history/) && ran(/^COMMIT$/));
    const history = queries.find(q => /INSERT INTO commulingo_link_review_history/.test(q.sql));
    assert.equal(JSON.parse(history.params[5]).note, note);

    queries = [];
    await assert.rejects(rejectExpression({ kind: 'term', id: 'abm-treaty', lang: 'ko', text: 'ABM 조약', note }, 'tester'), /표제어/);
    assert.ok(!ran(/DELETE FROM commulingo_term_aliases/) && ran(/^ROLLBACK$/), 'a headword is never removed');
    await assert.rejects(rejectExpression({ kind: 'term', id: 'abm-treaty', lang: 'ko', text: '반탄도탄미사일 조약', note: '짧음' }, 'tester'), /12~2000/);

    queries = [];
    events['coup'] = { link_expressions: [{ lang: 'en', text: 'the putsch', role: 'short', policy: 'search' }] };
    await assert.rejects(rejectExpression({ kind: 'event', id: 'coup', lang: 'en', text: 'August Coup', note }, 'tester'), /제목/);
    queries = [];
    await rejectExpression({ kind: 'event', id: 'coup', lang: 'en', text: 'the putsch', note }, 'tester');
    assert.deepEqual(JSON.parse(queries.find(q => /UPDATE commulingo_history_events/.test(q.sql)).params[1]), []);

    docs = [{ id: 'law', aliases: { ko: ['주르당 법', '징병법'] }, linkExpressions: [] }];
    await rejectExpression({ kind: 'doc', id: 'law', lang: 'ko', text: '주르당 법', note }, 'tester');
    assert.deepEqual(docPatches[0], { id: 'law', patch: { aliases: { ko: ['징병법'] } } });
    await assert.rejects(rejectExpression({ kind: 'doc', id: 'law', lang: 'ko', text: '주르당-델브렐 징병법', note }, 'tester'), /제목/);
    assert.equal(docPatches.length, 1, 'a failed rejection leaves the document alone');
    console.log('link expression rejection: aliases and expressions removed with history; headwords and titles kept');
})().catch(err => { console.error(err); process.exitCode = 1; });
