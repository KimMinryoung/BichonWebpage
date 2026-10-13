#!/usr/bin/env node
// Audit CommuLingo's Korean prose for typewriter quotes. Korean text follows
// the NIKL punctuation rules (“ ” and ‘ ’, data/commulingo/korean-quotes.js),
// which every editorial store applies on write. A field the normalizer would
// still change was written past those stores (raw SQL, an old script) and
// fails the audit. Straight quotes the normalizer cannot pair ('80년대,
// Den' poezii, a quote left open across paragraphs) are counted; --leftovers
// lists them for a person to fix or leave.
//
// Usage (inside the frontend container):
//   node scripts/audit-korean-quotes.js [--leftovers]
// Exits 1 when a field needs normalizing, 2 on error.

require('dotenv').config();
const db = require('../config/database');
const { normalizeKoreanQuotes, normalizeKoreanQuotesHtml, normalizeKoreanTree, straightQuoteLeftovers } = require('../data/commulingo/korean-quotes');

const TEXT = [
    ['commulingo_people', 'id', ['bio_ko', 'epithet_ko', 'moment_ko', 'fate_label_ko']],
    ['commulingo_person_career_entries', 'id', ['role_ko']],
    ['commulingo_person_sections', 'id', ['heading_ko', 'body_ko']],
    ['commulingo_terms', 'id', ['definition_ko', 'body_ko', 'period_note_ko']],
    ['commulingo_history_events', 'id', ['question_ko', 'summary_ko', 'body_ko', 'outcome_ko']],
    ['commulingo_history_event_people', "event_id || '/' || person_id", ['relation_ko', 'note_ko']],
    ['commulingo_offices', 'id', ['blurb_ko']],
    ['commulingo_office_rows', 'id', ['body_ko', 'note_ko']],
    ['commulingo_people_groups', 'id', ['blurb_ko']],
    ['commulingo_person_collections', 'id', ['intro_ko']],
];

(async () => {
    try {
        const stale = [];
        const leftovers = [];
        let fields = 0;
        const check = (ref, text, normalized, html = false) => {
            fields++;
            if (normalized !== text) stale.push(ref);
            for (const l of straightQuoteLeftovers(text, { html })) leftovers.push(`${ref}: …${l}…`);
        };
        for (const [table, key, cols] of TEXT) {
            const { rows } = await db.query(`SELECT ${key} AS ref, ${cols.join(', ')} FROM ${table}`);
            for (const row of rows) for (const c of cols) {
                if (typeof row[c] === 'string' && /["']/.test(row[c])) check(`${table}:${row.ref}.${c}`, row[c], normalizeKoreanQuotes(row[c]));
            }
        }
        const events = await db.query('SELECT id, timeline, sides, focus FROM commulingo_history_events');
        for (const row of events.rows) for (const c of ['timeline', 'sides', 'focus']) {
            if (row[c] && JSON.stringify(normalizeKoreanTree(row[c])) !== JSON.stringify(row[c])) stale.push(`commulingo_history_events:${row.id}.${c}`);
        }
        const docs = await db.query("SELECT id, body FROM commulingo_docs WHERE COALESCE(entry->>'docLang', 'ko') = 'ko'");
        for (const row of docs.rows) if (/["']/.test(row.body)) check(`doc:${row.id}`, row.body, normalizeKoreanQuotesHtml(row.body), true);
        const data = await db.query('SELECT key, content FROM commulingo_data_documents');
        for (const row of data.rows) {
            if (JSON.stringify(normalizeKoreanTree(row.content)) !== JSON.stringify(row.content)) stale.push(`data:${row.key}`);
        }

        console.log(`${fields} Korean fields with straight quotes checked; ${leftovers.length} unpairable straight quote(s) left as typed.`);
        if (process.argv.includes('--leftovers')) leftovers.forEach(l => console.log(`  ${l}`));
        if (!stale.length) {
            console.log('OK: every Korean field already follows the quote rules.');
            process.exit(0);
        }
        console.log(`${stale.length} field(s) were written past the stores and still need korean-quotes.js:`);
        stale.forEach(ref => console.log(`- ${ref}`));
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
