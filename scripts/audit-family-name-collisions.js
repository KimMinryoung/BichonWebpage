#!/usr/bin/env node
// Where do the one-word person aliases actually fire? Runs the person index over
// every piece of dictionary prose and reports each match of a single-word alias
// with its sentence — so a name that is also an ordinary word (조린 국물), or one
// that is the head of a longer proper noun (비테 inside 비테프스크), shows itself
// instead of going live unread.
//
// Both kinds of one-word alias are covered, the family names the index derives
// and the short forms curators wrote by hand: the collision risk is the same
// either way, and 비테 was a hand-written one that had been linking inside
// 비테프스크 for as long as it existed.
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

    // Every one-word alias the index links, however it got there.
    const derived = new Map();
    const declaredBy = new Map();
    standardized.people.forEach(p => {
        const declared = (p.aliases && p.aliases[lang]) || [];
        const family = String((p.names && p.names.family) || '').trim();
        new Set([...declared, family].filter(Boolean)).forEach(alias => {
            if (/\s/.test(alias)) return; // one word only: the rest cannot collide
            const entry = index.byAlias[alias];
            if (!entry || entry.id !== p.id) return;
            derived.set(alias, p.id);
            if (declared.includes(alias)) declaredBy.set(alias, true);
        });
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

    // Every word of a person's own names and aliases, to tell a legitimate
    // given name in front of the match from a stranger's. `givenNames` is the
    // corpus's stock of given-name words — everything that is somebody's name
    // but not their family name — which keeps the check to words that plausibly
    // introduce a person and out of ordinary prose (그해 비테는).
    const givenNames = new Set();
    const ownWords = new Map();
    standardized.people.forEach(p => {
        const words = new Set();
        [p.displayName, p.names && p.names.short, p.names && p.names.display, p.names && p.names.family]
            .concat((p.aliases && p.aliases[lang]) || [])
            .forEach(value => {
                if (typeof value !== 'string') return;
                value.trim().toLowerCase().split(/\s+/).forEach(word => {
                    const clean = word.replace(/[^가-힣a-z]/g, '');
                    if (clean) words.add(clean);
                });
            });
        ownWords.set(p.id, words);
    });
    // A word counts as a given name only if it is nobody's family name: 말리놉스키
    // in a list of commanders is a surname, not an introduction.
    const familyWords = new Set();
    standardized.people.forEach(p => {
        const family = String((p.names && p.names.family) || '').trim().toLowerCase();
        if (family) family.split(/\s+/).forEach(word => familyWords.add(word.replace(/[^가-힣a-z]/g, '')));
    });
    standardized.people.forEach(p => {
        const family = String((p.names && p.names.family) || '').trim().toLowerCase();
        (ownWords.get(p.id) || new Set()).forEach(word => {
            if (word && word !== family && !familyWords.has(word)) givenNames.add(word);
        });
    });

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
            // The word in front of the match. When it looks like a given name
            // that is not this person's — 리나 시테른 against 그리고리 시테른,
            // 캐롤 보이스 데이비스 against 앤절라 데이비스 — the sentence is
            // about someone else who shares the surname and is not in the
            // dictionary, and the link is wrong however well-formed it is.
            const before = source.slice(Math.max(0, offset - 40), offset).trim().split(/\s+/).pop() || '';
            const prevWord = before.replace(/[^가-힣A-Za-z]/g, '');
            hit.matches.push({
                where: passage.where,
                self: passage.owner === entry.id,
                glued: HANGUL.test(next), // a longer word may start here
                stranger: prevWord.length >= 2
                    && givenNames.has(prevWord.toLowerCase())
                    && !(ownWords.get(entry.id) || new Set()).has(prevWord.toLowerCase()),
                context: source.slice(Math.max(0, offset - 30), offset + match.length + 30).replace(/\s+/g, ' '),
            });
            return match;
        });
    });

    const elsewhere = [...hits.entries()]
        .map(([alias, hit]) => ({ alias, ...hit, others: hit.matches.filter(m => !m.self) }))
        .filter(row => row.others.length);

    console.log(`lang=${lang}  one-word aliases: ${derived.size} `
        + `(hand-written ${declaredBy.size}, derived from the family name ${derived.size - declaredBy.size})`
        + `  passages scanned: ${passages.length}`);
    console.log(`names that fire outside their own entry: ${elsewhere.length}\n`);

    const strangers = elsewhere.filter(row => row.others.some(m => m.stranger));
    console.log(`── PRECEDED BY SOMEONE ELSE'S GIVEN NAME (${strangers.length}) — read these first ──`);
    strangers.forEach(row => {
        row.others.filter(m => m.stranger).slice(0, 2).forEach(m => {
            console.log(`  ${row.alias} [${row.personId}]  ${m.where}\n      …${m.context}…`);
        });
    });

    const glued = elsewhere.filter(row => row.others.some(m => m.glued));
    console.log('');
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
