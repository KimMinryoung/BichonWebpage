#!/usr/bin/env node
// Audit CommuLingo content for model-token leakage: words in a writing system
// the site has no content in (threefold-war's definition_ko carried 'संघर्ष'
// for 전쟁, a Metaxas alias was spelled '메타كساس 체제', 2026-08-23), and the
// half-transliterated cousin where Hangul runs straight into lowercase Latin
// ('산acja 체제', '아프간tsy', '아isne 방어선').
//
// The write-time twin lives in the leninbot repo,
// runtime_tools/commulingo_people.py (_script_leak_problem), and rejects these
// at the tool gate; this audit is the safety net for content that arrives by
// any other path (bulk translation, manual imports, old rows).
//
// Usage (inside the frontend container):
//   node scripts/audit-script-leakage.js
// Exits 1 when flags remain, so it can gate a deploy.

require('dotenv').config();
const db = require('../config/database');

// Scripts whose presence anywhere in prose is leakage, not quotation. Cyrillic,
// Greek, Han, Kana, Hangul and the Caucasus scripts are NOT here: the site
// quotes them legitimately.
const FOREIGN_SCRIPTS = [
    ['Devanagari', /[ऀ-ॿ]/],
    ['Bengali', /[ঀ-৿]/],
    ['Gurmukhi/Gujarati/Oriya', /[਀-୿]/],
    ['Tamil/Telugu/Kannada/Malayalam/Sinhala', /[஀-෿]/],
    ['Thai/Lao', /[฀-໿]/],
    ['Tibetan/Myanmar', /[ༀ-႟]/],
    ['Khmer', /[ក-៿]/],
    ['Arabic', /[؀-ۿݐ-ݿࢠ-ࣿ]/],
];

// Three lowercase letters, not one: Korean glues short Latin units onto Hangul
// legitimately (2만km), and the acronym pattern (친PDPA, 중앙TV) is uppercase.
const HANGUL_LATIN_MIX = /[가-힯][a-z]{3}/;

// Columns that legitimately carry any script: native-name lines, a term's
// original native-script form, and source references (a work's own title
// stays in the work's own script).
const EXEMPT_KEYS = new Set([
    'cyrillic', 'cyrillic_patronymic', 'original', 'native',
    'sources', 'source_refs', 'url',
]);

// Judged exceptions, same contract as audit-korea-terminology.js: name the ref
// and the exact phrase, so an edit puts the row back in front of a human.
const KNOWN_OK = [];

const TABLES = [
    { table: 'commulingo_terms', ref: r => `term:${r.id}` },
    { table: 'commulingo_term_aliases', ref: r => `term-alias:${r.term_id}/${r.alias}` },
    { table: 'commulingo_people', ref: r => `person:${r.id}` },
    { table: 'commulingo_person_sections', ref: r => `section:${r.person_id}#${r.id}` },
    { table: 'commulingo_person_scenes', ref: r => `scene:${r.person_id}#${r.id}` },
    { table: 'commulingo_person_career_entries', ref: r => `career:${r.person_id}#${r.id}` },
    { table: 'commulingo_person_aliases', ref: r => `person-alias:${r.person_id}/${r.alias}` },
    { table: 'commulingo_person_patronymics', ref: r => `patronymic:${r.person_id}` },
    { table: 'commulingo_history_events', ref: r => `event:${r.id}` },
    { table: 'commulingo_history_event_people', ref: r => `eventperson:${r.event_id}.${r.person_id}` },
    { table: 'commulingo_offices', ref: r => `office:${r.id}` },
    { table: 'commulingo_office_rows', ref: r => `officerow:${r.id ?? r.office_id}` },
];

function* strings(node, key) {
    if (EXEMPT_KEYS.has(key)) return;
    if (typeof node === 'string') {
        yield { key, text: node };
    } else if (Array.isArray(node)) {
        for (const item of node) yield* strings(item, key);
    } else if (node && typeof node === 'object') {
        for (const [childKey, value] of Object.entries(node)) yield* strings(value, childKey);
    }
}

function excerpt(text, index, length) {
    const clipped = text.slice(Math.max(0, index - 40), index + length + 40);
    return clipped.replace(/\s+/g, ' ').trim();
}

function exempt(ref, hit) {
    return KNOWN_OK.some(item => item.ref === ref && hit.includes(item.phrase));
}

(async () => {
    try {
        const flags = [];
        let fields = 0;
        for (const { table, ref } of TABLES) {
            const result = await db.query(`SELECT to_jsonb(t) AS row FROM ${table} t`);
            for (const { row } of result.rows) {
                for (const { key, text } of strings(row, '')) {
                    fields += 1;
                    for (const [script, pattern] of FOREIGN_SCRIPTS) {
                        const m = pattern.exec(text);
                        if (m) {
                            const hit = excerpt(text, m.index, m[0].length);
                            if (!exempt(ref(row), hit)) {
                                flags.push({ ref: ref(row), key, kind: script, hit });
                            }
                        }
                    }
                    const mix = HANGUL_LATIN_MIX.exec(text);
                    if (mix) {
                        const hit = excerpt(text, mix.index, mix[0].length);
                        if (!exempt(ref(row), hit)) {
                            flags.push({ ref: ref(row), key, kind: 'hangul+lowercase-latin', hit });
                        }
                    }
                }
            }
        }

        if (!flags.length) {
            console.log(`OK: no foreign-script or mixed-script leakage in ${fields} fields.`);
            process.exit(0);
        }
        console.log(`Flagged ${flags.length} leaked word(s):`);
        for (const flag of flags) {
            console.log(`- ${flag.ref} .${flag.key} [${flag.kind}]`);
            console.log(`  …${flag.hit}…`);
        }
        process.exit(1);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(2);
    }
})();
