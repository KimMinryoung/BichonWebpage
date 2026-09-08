#!/usr/bin/env node
// One-time rollout: preserve existing expressions. Never approve later additions.
const { db } = require('./lib/bootstrap');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const { catalogue, builders } = require('../data/commulingo/link-review-catalog');
const { loadLinkBlocklist } = require('../data/commulingo/link-blocklist');
const { reviewMap } = require('../data/commulingo/link-review-policy');
const assert = require('assert');
(async () => {
    const records = { term: await loadCommuLingoTerms({ fresh: true }), event: await loadCommuLingoHistoryEvents({ fresh: true }), doc: listCommuLingoDocs() };
    await loadLinkBlocklist();
    const rows = catalogue(records).map(row => ({ kind: row.kind, entity_id: row.id, lang: row.lang, expression: row.text,
        source_signature: row.sourceSignature, role: row.sourceRole, policy: row.sourcePolicy,
        note: '기존 연결 보존용 초기 이관. 의미 검토 완료를 뜻하지 않음.', reviewed_by: 'migration-178' }));
    const reviews = reviewMap(rows);
    for (const kind of ['term', 'event', 'doc']) for (const lang of ['ko', 'en']) {
        const build = builders[kind]['build' + kind[0].toUpperCase() + kind.slice(1) + 'LinkIndex'];
        const before = build(records[kind], { lang, legacyReview: true });
        const after = build(records[kind], { lang, reviews });
        assert.deepStrictEqual(after, before, kind + '/' + lang + ' index changed');
    }
    console.log(JSON.stringify({ expressions: rows.length, indexesUnchanged: 6, apply: process.argv.includes('--apply') }));
    if (!process.argv.includes('--apply')) return;
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-link-review'))");
        if (Number((await client.query('SELECT count(*) FROM commulingo_link_reviews')).rows[0].count)) throw new Error('Already seeded: refusing to approve later additions');
        await client.query(`INSERT INTO commulingo_link_reviews (kind,entity_id,lang,expression,source_signature,role,policy,note,reviewed_by)
            SELECT kind,entity_id,lang,expression,source_signature,role,policy,note,reviewed_by
            FROM jsonb_to_recordset($1::jsonb) AS r(kind text,entity_id text,lang text,expression text,source_signature text,role text,policy text,note text,reviewed_by text)`, [JSON.stringify(rows)]);
        await client.query('COMMIT');
        await require('../data/commulingo/link-reviews-store').refreshLinkReviews();
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
})().then(() => db.end()).catch(error => { console.error(error); process.exitCode = 1; return db.end(); });
