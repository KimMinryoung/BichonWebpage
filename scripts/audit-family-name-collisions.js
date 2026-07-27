#!/usr/bin/env node
// Where would the bare family names actually fire? Runs the person index over
// every piece of dictionary prose and reports each match of a family name that
// no curator declared as an alias, with its sentence — so a name that is also an
// ordinary word (조린 국물), or one that is the head of a longer proper noun
// (만네르헤임), shows itself instead of going live unread.
//
//   node scripts/audit-family-name-collisions.js [ko|en]

require('dotenv').config();
const { getLinkIndexes } = require('../data/commulingo/linkify');
const { loadCommuLingoPeople } = require('../data/commulingo/people-store');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');

const lang = process.argv[2] === 'en' ? 'en' : 'ko';
const WORD_CHAR = /[0-9A-Za-z가-힣]/;
const HANGUL = /[가-힣]/;

(async () => {
    const { person: index, standardized } = await getLinkIndexes(lang);

    // The bare family names the index links but no curator declared.
    const derived = new Map();
    standardized.people.forEach(p => {
        const family = String((p.names && p.names.family) || '').trim();
        if (!family || ((p.aliases && p.aliases[lang]) || []).includes(family)) return;
        const entry = index.byAlias[family];
        if (entry && entry.id === p.id) derived.set(family, p.id);
    });

    // Every piece of prose the dictionaries publish.
    const passages = [];
    const loaded = await loadCommuLingoPeople();
    (loaded.data.people || []).forEach(p => {
        ['epithet', 'moment', 'bio'].forEach(field => {
            const value = p[field] && p[field][lang];
            if (value) passages.push({ where: `person:${p.id}/${field}`, owner: p.id, text: value });
        });
    });
    Object.entries(loaded.data.sections || {}).forEach(([personId, sections]) => {
        (sections || []).forEach(section => {
            const value = section.body && section.body[lang];
            if (value) passages.push({ where: `person:${personId}/${section.slug}`, owner: personId, text: value });
        });
    });
    (await loadCommuLingoTerms()).forEach(term => {
        ['definition', 'body'].forEach(field => {
            const value = term[field] && term[field][lang];
            if (value) passages.push({ where: `term:${term.id}/${field}`, owner: null, text: value });
        });
    });
    (await loadCommuLingoHistoryEvents()).forEach(event => {
        ['summary', 'outcome', 'question'].forEach(field => {
            const value = event[field] && event[field][lang];
            if (value) passages.push({ where: `event:${event.id}/${field}`, owner: null, text: value });
        });
        (event.timeline || []).forEach((item, i) => {
            const value = item.body && item.body[lang];
            if (value) passages.push({ where: `event:${event.id}/timeline[${i}]`, owner: null, text: value });
        });
    });

    const hits = new Map();
    derived.forEach((personId, alias) => hits.set(alias, { personId, matches: [] }));

    // Run the shipping pattern, not a substring search: the alternation is
    // longest-first and carries BLOCKED_KO, so a name that only ever appears
    // inside a longer word (만네르 in 만네르헤임) never reaches the replacer and
    // must not be reported as if it did.
    passages.forEach(passage => {
        passage.text.replace(index.pattern, (match, _token, offset, source) => {
            if (!index.en) {
                const prev = offset > 0 ? source.charAt(offset - 1) : '';
                if (WORD_CHAR.test(prev)) return match;
            }
            const entry = index.byAlias[match];
            const hit = hits.get(match);
            if (!entry || !hit || entry.id !== hit.personId) return match;
            const next = source.charAt(offset + match.length) || '';
            hit.matches.push({
                where: passage.where,
                self: passage.owner === entry.id,
                glued: HANGUL.test(next), // a longer word may start here
                context: source.slice(Math.max(0, offset - 30), offset + match.length + 30).replace(/\s+/g, ' '),
            });
            return match;
        });
    });

    const elsewhere = [...hits.entries()]
        .map(([alias, hit]) => ({ alias, ...hit, others: hit.matches.filter(m => !m.self) }))
        .filter(row => row.others.length);

    console.log(`lang=${lang}  derived family names: ${derived.size}  passages scanned: ${passages.length}`);
    console.log(`names that fire outside their own entry: ${elsewhere.length}\n`);

    const glued = elsewhere.filter(row => row.others.some(m => m.glued));
    console.log(`── HEAD OF A LONGER KOREAN WORD (${glued.length}) — read these first ──`);
    glued.forEach(row => {
        row.others.filter(m => m.glued).slice(0, 3).forEach(m => {
            console.log(`  ${row.alias} [${row.personId}]  ${m.where}\n      …${m.context}…`);
        });
    });

    console.log(`\n── FIRES ELSEWHERE (${elsewhere.length}) ──`);
    elsewhere.forEach(row => {
        console.log(`  ${row.alias} [${row.personId}] — ${row.others.length} match(es)`);
        row.others.slice(0, 2).forEach(m => console.log(`      ${m.where}: …${m.context}…`));
    });
    process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
