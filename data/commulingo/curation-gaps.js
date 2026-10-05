// Curation gaps: entries an editor's text needed that the dictionaries lack
// (filed by leninbot's event curator through the admin MCP `gap_file`, picked
// up by the enrichment pipeline planner). Ported from leninbot
// commulingo/people.py _file_gaps/_already_covered, 2026-10-05.
const db = require('../../config/database');
const { listCommuLingoDocs } = require('./docs-store');

const PAREN = /[（(][^）)]*[)）]/g;

// The label itself, the label without its bracket, and the bracket's own
// contents (often the registered alias), each also without spaces: 「소브나르호스
// (국민경제회의)」 is `sovnarkhoz` behind a gloss, 「국가비상사태위원회 (GKChP)」 is `gkchp`.
function labelVariants(label) {
    const raw = String(label || '').trim();
    if (!raw) return [];
    const candidates = [raw, raw.replace(PAREN, ' ').trim(),
        ...[...raw.matchAll(/[（(]([^）)]*)[)）]/g)].map(m => m[1].trim())];
    const forms = [];
    for (const candidate of candidates) {
        for (const form of [candidate, candidate.replaceAll(' ', '')]) {
            if (form && !forms.includes(form)) forms.push(form);
        }
    }
    return forms;
}

// Document names wear title marks inconsistently; the marks carry no identity.
const DOC_MARKS = /[『』「」《》〈〉<>"'“”‘’ ]/g;
const docKey = value => String(value || '').trim().toLowerCase().replace(DOC_MARKS, '');

function docIndex() {
    const index = new Map();
    for (const doc of listCommuLingoDocs()) {
        const names = [doc.id];
        for (const field of ['title', 'aliases']) {
            for (const lang of ['ko', 'en']) {
                const value = (doc[field] || {})[lang];
                names.push(...(Array.isArray(value) ? value : [value || '']));
            }
        }
        for (const name of names) {
            const key = docKey(name);
            if (key && !index.has(key)) index.set(key, doc.id);
        }
    }
    return index;
}

const ENTRY_SQL = {
    person: `SELECT p.id FROM commulingo_people p
        WHERE replace(lower(p.name_ko), ' ', '') = replace(lower($1), ' ', '') OR replace(lower(p.name_en), ' ', '') = replace(lower($1), ' ', '')
        UNION SELECT a.person_id FROM commulingo_person_aliases a WHERE replace(lower(a.alias), ' ', '') = replace(lower($1), ' ', '') LIMIT 1`,
    term: `SELECT t.id FROM commulingo_terms t
        WHERE replace(lower(t.term_ko), ' ', '') = replace(lower($1), ' ', '') OR replace(lower(t.term_en), ' ', '') = replace(lower($1), ' ', '')
        UNION SELECT a.term_id FROM commulingo_term_aliases a WHERE replace(lower(a.alias), ' ', '') = replace(lower($1), ' ', '') LIMIT 1`,
};
// A history event is not a glossary term: an event's own name filed as a
// missing concept is answered as 'event:<id>'.
const EVENT_SQL = `SELECT e.id FROM commulingo_history_events e
    WHERE replace(lower(e.title_ko), ' ', '') = replace(lower($1), ' ', '') OR replace(lower(e.title_en), ' ', '') = replace(lower($1), ' ', '') LIMIT 1`;

// The id of an existing entry a gap is asking for, or ''.
async function alreadyCovered(kind, label, targetId, client = db) {
    if (targetId) return ''; // an explicit target means "this exists but is too thin"
    const ko = String(label.ko || '').trim(), en = String(label.en || '').trim();
    if (!(ko || en)) return '';
    let probe;
    if (kind === 'doc') {
        const index = docIndex();
        probe = async value => index.get(docKey(value)) || '';
    } else if (ENTRY_SQL[kind]) {
        probe = async value => {
            const row = (await client.query(ENTRY_SQL[kind], [value])).rows[0];
            if (row) return String(row.id);
            if (kind !== 'term') return '';
            const event = (await client.query(EVENT_SQL, [value])).rows[0];
            return event ? `event:${event.id}` : '';
        };
    } else {
        return '';
    }
    // The whole label first; a hit from a stripped form must agree across
    // languages when both are given (인민전선 (소련 말기) is not the 1930s Popular Front).
    for (const whole of [ko, en].filter(Boolean)) {
        const found = await probe(whole);
        if (found) return found;
    }
    const hits = {};
    for (const [lang, raw] of [['ko', ko], ['en', en]]) {
        for (const form of labelVariants(raw).slice(1)) {
            const found = await probe(form);
            if (found) {
                hits[lang] = found;
                break;
            }
        }
    }
    const langs = Object.keys(hits);
    if (langs.length === 2) return hits.ko === hits.en ? hits.ko : '';
    if (langs.length === 1 && !(ko && en)) return hits[langs[0]];
    if (langs.length === 1) {
        // One language resolved and the other said nothing: accept only when the
        // silent side has no headword of its own to contradict with.
        const other = langs[0] === 'ko' ? en : ko;
        return (await probe(other)) ? '' : hits[langs[0]];
    }
    return '';
}

// File gaps for one event. A re-file is a no-op (partial unique index), so two
// sections needing the same person do not queue that person twice.
async function fileGaps(gaps, eventId, createdBy) {
    const filed = [], duplicates = [], covered = [];
    for (const gap of gaps) {
        const label = gap.label || {};
        const name = label.ko || label.en || '?';
        const existing = await alreadyCovered(gap.kind, label, String(gap.target_id || '').trim());
        if (existing) {
            covered.push(`${name} -> ${existing}`);
            continue;
        }
        const { rows } = await db.query(`INSERT INTO commulingo_curation_gaps
                (kind, event_id, target_id, label_ko, label_en, reason, priority, created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING RETURNING id`,
        [gap.kind, eventId, String(gap.target_id || '').trim(), String(label.ko || '').trim(), String(label.en || '').trim(),
            String(gap.reason || '').trim(), Number.parseInt(gap.priority, 10) || 0, createdBy]);
        (rows.length ? filed : duplicates).push(name);
    }
    return { filed, already_queued: duplicates, already_covered: covered };
}

module.exports = { labelVariants, docKey, alreadyCovered, fileGaps };
