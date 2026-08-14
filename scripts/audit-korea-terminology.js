#!/usr/bin/env node
// Audit CommuLingo's Korean prose for '한국' used about a time when no such
// country existed. Korea was 조선 (대한제국 from 1897) until the two states of
// 1948; 'Korea' translated without that distinction turns Yalta's subject into
// 한국 and a colonial-era grammar into 한국어 문법. The detection rule lives in
// data/commulingo/korean-terminology.js next to the 그루지야 one.
//
// Usage (inside the frontend container):
//   node scripts/audit-korea-terminology.js
// Exits 1 when flags remain, so it can gate a deploy.

require('dotenv').config();
const db = require('../config/database');
const {
    findKoreaAnachronisms,
    periodEndYear,
    latestYear,
    DIVISION_YEAR,
} = require('../data/commulingo/korean-terminology');

// Judged exceptions: mentions the date rule reaches but a reader would keep.
// Each names the field and the exact phrase, so an edit to the sentence puts it
// back in front of a human instead of staying silently exempt.
const KNOWN_OK = [
    // A quotation from Andrei Lankov, where 'Korean history' is the whole sweep
    // of it, not the 1945 moment the sentence happens to date.
    { ref: 'person:terentii-shtykov.moment', phrase: '한국 역사에 큰 영향' },
    // Modern naming practice, in a sentence that also dates Liebknecht's 1896.
    { ref: 'term:state-socialism.definition', phrase: '한국에서는 나치의' },
];

function exempt(ref, excerpt) {
    return KNOWN_OK.some(item => item.ref === ref && excerpt.includes(item.phrase));
}

(async () => {
    try {
        const sources = [];
        const push = (ref, text, year) => { if (text) sources.push({ ref, text, year }); };

        const events = await db.query(
            `SELECT id, period_label, summary_ko, outcome_ko, body_ko, timeline
               FROM commulingo_history_events ORDER BY id`
        );
        const eventYear = new Map();
        for (const row of events.rows) {
            const year = periodEndYear(row.period_label);
            eventYear.set(row.id, year);
            push(`event:${row.id}.summary`, row.summary_ko, year);
            push(`event:${row.id}.outcome`, row.outcome_ko, year);
            push(`event:${row.id}.body`, row.body_ko, year);
            (row.timeline || []).forEach((item, i) => {
                const dated = latestYear(item && item.date) || year;
                push(`event:${row.id}.timeline[${i}]`, item && item.body && item.body.ko, dated);
            });
        }

        const people = await db.query(
            `SELECT id, death_year, birth_year, bio_ko, moment_ko
               FROM commulingo_people ORDER BY id`
        );
        const personYear = new Map();
        for (const row of people.rows) {
            // A card about a life that reached the division needs no fallback:
            // its undated sentences may well be about the modern country.
            const year = row.death_year || (row.birth_year ? row.birth_year + 80 : null);
            personYear.set(row.id, year);
            push(`person:${row.id}.bio`, row.bio_ko, year);
            push(`person:${row.id}.moment`, row.moment_ko, year);
        }

        const sections = await db.query(
            `SELECT id, person_id, body_ko FROM commulingo_person_sections
              ORDER BY person_id, id`
        );
        for (const row of sections.rows) {
            push(`section:${row.person_id}.${row.id}`, row.body_ko,
                personYear.get(row.person_id) ?? null);
        }

        const terms = await db.query(
            `SELECT id, period_ko, definition_ko, body_ko FROM commulingo_terms ORDER BY id`
        );
        for (const row of terms.rows) {
            const year = periodEndYear(row.period_ko);
            push(`term:${row.id}.definition`, row.definition_ko, year);
            push(`term:${row.id}.body`, row.body_ko, year);
        }

        const notes = await db.query(
            `SELECT event_id, person_id, note_ko FROM commulingo_history_event_people
              ORDER BY event_id, person_id`
        );
        for (const row of notes.rows) {
            push(`eventperson:${row.event_id}.${row.person_id}`, row.note_ko,
                eventYear.get(row.event_id) ?? null);
        }

        const flags = [];
        for (const item of sources) {
            for (const hit of findKoreaAnachronisms(item.text, item.year)) {
                if (!exempt(item.ref, hit.excerpt)) flags.push({ ref: item.ref, ...hit });
            }
        }

        if (!flags.length) {
            console.log(`OK: no pre-${DIVISION_YEAR} '한국' in ${sources.length} Korean fields.`);
            process.exit(0);
        }

        console.log(`Flagged ${flags.length} '한국' mention(s) in a pre-${DIVISION_YEAR} context.`);
        console.log('Korea before the two states of 1948 is 조선 (대한제국 from 1897);');
        console.log('the language and the people of that period are 조선어 and 조선인.\n');
        for (const flag of flags) {
            const basis = flag.dated ? `${flag.year} in the prose` : `entry period ends ${flag.year}`;
            console.log(`- ${flag.ref}  (${basis})`);
            console.log(`  …${flag.excerpt}…`);
        }
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
