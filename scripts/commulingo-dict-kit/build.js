'use strict';
// Build an editorial_batch spec for new/updated terms and the matching link-review manifest.
//   require('../../commulingo-dict-kit/build')({ kit, job, scope, note, terms, extraItems })
// Each term: { r: { id, ko, en, original, category, region, period, aliases:{ko,en}, people, events },
//              definition: [ko, en], body: [ko, en], cites: [[field, sourceKey, excerpt, claim], ...],
//              why: { ko, en }            // what the headword names, for the review notes
//              search: ['bare form', ...] // forms reviewed as search-only (ambiguous, generic)
//              special: { 'form': 'note' } // per-form review note overriding the default
//              skipReview: ['form']        // forms deliberately left unreviewed }
// Writes <job dir>/terms-batch.json and scripts/reviews/commulingo-links-<date>-<job>.json,
// pre-checking what the write gates refuse (see README "Write gates").
const fs = require('fs'), path = require('path');
const TERM = require('../../data/commulingo/term-editorial-contract.json');

module.exports = function build({ kit, dir, job, scope, note, terms = [], extraItems = [], reviewName }) {
    const items = [], decisions = [], seen = new Set();
    const fail = msg => { console.log('GATE', msg); kit.bad && kit.bad(); process.exitCode = 1; };
    for (const t of terms) {
        const { r, definition, body, cites = [] } = t;
        kit.lint(r.id, ...(definition || []), ...(body || []));
        const evidence = kit.evs(cites);
        for (const f of TERM.factFields) {
            const present = f === 'period' ? r.period != null : (f === 'definition' ? definition : body);
            if (present && !evidence.some(e => e.field === f)) fail(`${r.id}: evidence required for ${f}`);
        }
        // limits.definition is [ko max, en max] in characters (term-editorial-service.js), not a range.
        if (definition) for (const [i, lang] of [[0, 'ko'], [1, 'en']]) {
            const n = [...definition[i]].length, max = TERM.limits.definition[i];
            if (n > max) fail(`${r.id}: definition.${lang} ${n} exceeds ${max}`);
        }
        for (const e of evidence) if (/cyber-lenin\.com/.test(e.source)) fail(`${r.id}: cite external sources, not this dictionary`);
        const fields = { term: { ko: r.ko, en: r.en }, category: r.category, region: r.region ?? null, original: r.original,
            period: r.period, definition: definition && { ko: definition[0], en: definition[1] },
            body: body && { ko: body[0], en: body[1] }, aliases: r.aliases || { ko: [], en: [] },
            people: r.people || [], events: r.events || [], evidence };
        if (r.parentId !== undefined) fields.parentId = r.parentId;
        if (r.expectedRevision) fields.expectedRevision = r.expectedRevision;
        for (const k of Object.keys(fields)) if (fields[k] === undefined) delete fields[k];
        items.push({ command: 'submit', target: 'term', request: { action: r.action || 'create', id: r.id, directApply: true,
            sources: kit.sourcesOf(evidence), fields } });
        if (r.action === 'update' && !t.why) continue;
        const forms = [['ko', r.ko, 1], ['en', r.en, 1], ...(r.aliases?.ko || []).map(a => ['ko', a, 0]), ...(r.aliases?.en || []).map(a => ['en', a, 0])];
        for (const [lang, text, head] of forms) {
            if ((t.skipReview || []).includes(text)) continue;
            const key = `${r.id}|${lang}|${text}`; if (seen.has(key)) { console.log('DUP form', key); continue; } seen.add(key);
            const policy = (t.search || []).includes(text) ? 'search' : 'auto';
            const reason = t.special?.[text] || (lang === 'ko' ? `${head ? '표제어' : '별칭'}, ${t.why.ko}` : `${head ? 'headword' : 'alias'}, ${t.why.en}`);
            const n = (note?.[lang] || '') + reason;
            if (n.trim().length < 12) fail(`${key}: review note under 12 characters`);
            decisions.push({ kind: 'term', id: r.id, lang, text, role: 'identity', policy, note: n });
        }
        console.log(r.id, 'def', definition?.map(s => s.length).join('/'), 'body', body?.map(s => s.length).join('/'), 'ev', evidence.length);
    }
    items.push(...extraItems);
    fs.writeFileSync(path.join(dir, 'terms-batch.json'), JSON.stringify({ items }, null, 1) + '\n');
    const date = job.match(/(\d{8})/)?.[1] || new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const name = reviewName || `commulingo-links-${date}-${job.replace(/-?\d{8}-?/, '')}.json`;
    const reviewPath = path.join(__dirname, '..', 'reviews', name);
    fs.writeFileSync(reviewPath, JSON.stringify({ scope, references: [path.relative(path.join(__dirname, '..', '..'), dir) + '/'], decisions }, null, 1) + '\n');
    console.log('items', items.length, 'decisions', decisions.length, '->', 'content/' + path.relative(path.join(__dirname, '..', 'content'), dir) + '/terms-batch.json', 'reviews/' + name);
    return { items, decisions, reviewPath };
};
