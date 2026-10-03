#!/usr/bin/env node
// Carry link reviews after an event or document was renamed by other means
// (a script, a manifest edit). Terms do this inside the edit itself with
// fields.carryLinkReviews. Run in the app container after the rename:
//   docker exec leninbot-frontend node scripts/commulingo-carry-link-reviews.js \
//     <term|event|doc> <id> <lang> "<old name>" [--apply]
// Without --apply it lists what would be carried and changes nothing.
const db = require('../config/database');
const { carryLinkReviews } = require('../data/commulingo/link-review-carry');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const [kind, id, lang, oldName] = process.argv.slice(2);
const apply = process.argv.includes('--apply');
(async () => {
    if (!['term', 'event', 'doc'].includes(kind) || !id || !['ko', 'en'].includes(lang) || !oldName) {
        throw new Error('usage: <term|event|doc> <id> <ko|en> "<old name>" [--apply]');
    }
    const records = kind === 'term' ? await loadCommuLingoTerms({ fresh: true })
        : kind === 'event' ? await loadCommuLingoHistoryEvents({ fresh: true }) : listCommuLingoDocs();
    const record = records.find(item => item.id === id);
    if (!record) throw new Error(`${kind} ${id} not found`);
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query("SELECT pg_advisory_xact_lock(hashtext('commulingo-link-review'))");
        const carried = await carryLinkReviews(client, kind, record, { [lang]: oldName }, 'carry-link-reviews-cli');
        console.log(JSON.stringify({ apply, carried }, null, 2));
        await client.query(apply ? 'COMMIT' : 'ROLLBACK');
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => db.end());
