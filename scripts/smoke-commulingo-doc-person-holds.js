const assert = require('assert');
const { docHoldsForPerson } = require('../data/commulingo/doc-person-holds');

(async () => {
    let params;
    const client = { query: async (sql, values) => {
        params = values;
        return { rows: [{ doc_id: 'sukhanovka-annin-1989', lang: 'ko', text: '예브게니 그네딘', reason: '미등록 인물' }] };
    } };
    const gnedin = { id: 'evgeny-gnedin', name: { ko: '예브게니 그네딘', en: 'Evgeny Gnedin' },
        givenName: { ko: '예브게니', en: 'Evgeny' }, familyName: { ko: '그네딘', en: 'Gnedin' },
        patronymic: { ko: '알렉산드로비치', en: 'Aleksandrovich' }, aliases: { ko: ['그네딘'], en: ['Yevgeny Gnedin'] } };
    const holds = await docHoldsForPerson(client, gnedin);
    assert.deepStrictEqual(holds, [{ docId: 'sukhanovka-annin-1989', lang: 'ko', text: '예브게니 그네딘', reason: '미등록 인물' }]);
    // Full names with and without the patronymic and multi-word aliases; a lone surname is not asked about.
    assert.deepStrictEqual(JSON.parse(params[0]), [
        { lang: 'ko', text: '예브게니 그네딘' }, { lang: 'ko', text: '예브게니 알렉산드로비치 그네딘' },
        { lang: 'en', text: 'Evgeny Gnedin' }, { lang: 'en', text: 'Evgeny Aleksandrovich Gnedin' }, { lang: 'en', text: 'Yevgeny Gnedin' },
    ]);
    // A single-word name has nothing to ask, so no query runs.
    params = undefined;
    assert.deepStrictEqual(await docHoldsForPerson(client, { name: { ko: '푸이', en: 'Puyi' }, aliases: { ko: [], en: [] } }), []);
    assert.strictEqual(params, undefined);
    console.log('doc person holds: ok');
})().catch(err => { console.error(err); process.exit(1); });
