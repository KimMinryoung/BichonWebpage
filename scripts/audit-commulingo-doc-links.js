#!/usr/bin/env node
// Proposes `terms` / `events` for reference documents in
// data/commulingo/docs/manifest.json that have none, using the evidence in
// the document itself: a glossary term or history event is proposed only when
// the document's own text names it, found with the same mention scanner the
// report cross-linking and the term-link audit use.
//
//   node scripts/audit-commulingo-doc-links.js           # report + write the patch file
//   node scripts/audit-commulingo-doc-links.js --all     # also docs that already have some links
//   node scripts/audit-commulingo-doc-links.js --apply   # merge a reviewed patch into manifest.json
//
// The patch goes to temp_dev/commulingo-doc-links.patch.json as
// { docId: { terms: [...], events: [...] } }; edit it by hand (the scanner is
// precise about spelling, not about whether a passing mention deserves a
// link), then --apply. Needs the DB for the link indexes: run inside the
// container, `docker exec leninbot-frontend node /app/scripts/audit-commulingo-doc-links.js`.
require('./lib/bootstrap');
const fs = require('fs');
const path = require('path');
const { getReportLinkContext, findEntityMentions } = require('../data/commulingo/report-links');
const { normalizeSiteDoc } = require('./lib/commulingo-source-text');

const MANIFEST = path.join(__dirname, '..', 'data', 'commulingo', 'docs', 'manifest.json');
const DOCS_DIR = path.dirname(MANIFEST);
const PATCH = path.join(__dirname, '..', 'temp_dev', 'commulingo-doc-links.patch.json');
const MAX_TERMS = 8;
const MAX_EVENTS = 6;
// The site's own name ends in a person's name; harmless here but kept in step
// with audit-commulingo-term-links.js.
const SELF_NAME = /Cyber-Lenin|사이버 레닌|사이버레닌/g;

function countMentions(text, ids, context) {
    // The scanner reports each id once; rank by how many of the document's
    // paragraphs mention it so a passing reference sorts below a subject.
    const counts = new Map(ids.map(id => [id, 0]));
    if (!ids.length) return counts;
    for (const para of text.split(/(?<=[.!?。])\s+/)) {
        const found = findEntityMentions(para, context);
        for (const id of [...found.termIds, ...found.eventIds]) {
            if (counts.has(id)) counts.set(id, counts.get(id) + 1);
        }
    }
    return counts;
}

async function main() {
    const args = new Set(process.argv.slice(2));
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

    if (args.has('--apply')) {
        const patch = JSON.parse(fs.readFileSync(PATCH, 'utf8'));
        let changed = 0;
        for (const doc of manifest.docs) {
            const add = patch[doc.id];
            if (!add) continue;
            for (const kind of ['terms', 'events']) {
                const have = new Set(doc[kind] || []);
                const extra = (add[kind] || []).filter(id => !have.has(id));
                if (!extra.length) continue;
                doc[kind] = [...(doc[kind] || []), ...extra];
                changed += extra.length;
            }
        }
        fs.writeFileSync(MANIFEST + '.tmp', JSON.stringify(manifest, null, 2) + '\n');
        fs.renameSync(MANIFEST + '.tmp', MANIFEST);
        console.log(`applied ${changed} link(s) to manifest.json`);
        return;
    }

    const contexts = { ko: await getReportLinkContext('ko'), en: await getReportLinkContext('en') };
    const patch = {};
    const report = [];
    for (const doc of manifest.docs) {
        const lang = doc.docLang === 'en' ? 'en' : 'ko';
        const needTerms = !(doc.terms || []).length;
        const needEvents = !(doc.events || []).length;
        if (!args.has('--all') && !needTerms && !needEvents) continue;
        const file = path.join(DOCS_DIR, doc.file);
        if (!fs.existsSync(file)) { console.error(`missing file for ${doc.id}: ${doc.file}`); continue; }
        const text = normalizeSiteDoc(fs.readFileSync(file, 'utf8')).replace(SELF_NAME, '');
        const found = findEntityMentions(text, contexts[lang]);
        const skip = new Set(doc.noAutoLink || []);
        const haveTerms = new Set(doc.terms || []);
        const haveEvents = new Set(doc.events || []);
        const termIds = [...found.termIds].filter(id => !haveTerms.has(id) && !skip.has(id));
        const eventIds = [...found.eventIds].filter(id => !haveEvents.has(id) && !skip.has(id));
        const counts = countMentions(text, [...termIds, ...eventIds], contexts[lang]);
        const rank = ids => ids.sort((a, b) => (counts.get(b) - counts.get(a)) || a.localeCompare(b));
        const terms = (needTerms || args.has('--all')) ? rank(termIds).slice(0, MAX_TERMS) : [];
        const events = (needEvents || args.has('--all')) ? rank(eventIds).slice(0, MAX_EVENTS) : [];
        if (!terms.length && !events.length) continue;
        patch[doc.id] = { terms, events };
        report.push({
            doc: doc.id,
            hasTerms: haveTerms.size,
            hasEvents: haveEvents.size,
            addTerms: terms.map(id => `${id}(${counts.get(id)})`).join(', '),
            addEvents: events.map(id => `${id}(${counts.get(id)})`).join(', '),
        });
    }
    console.table(report);
    fs.mkdirSync(path.dirname(PATCH), { recursive: true });
    fs.writeFileSync(PATCH, JSON.stringify(patch, null, 2) + '\n');
    const totals = Object.values(patch).reduce((acc, p) => ({ terms: acc.terms + p.terms.length, events: acc.events + p.events.length }), { terms: 0, events: 0 });
    console.log(`${report.length} docs with proposals: ${totals.terms} term links, ${totals.events} event links -> ${path.relative(process.cwd(), PATCH)}`);
}

main().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
