#!/usr/bin/env node
const { renderLinkedContent } = require('../data/commulingo/render-links');
// Proposes commulingo_term_people / commulingo_term_events rows for glossary
// entries that have none, using the evidence already in the text: a term is
// linked to a person or event only when its own definition or body names them,
// found with the same mention scanner the report cross-linking uses.
//
// Usage:
//   node scripts/audit-commulingo-term-links.js          # report
//   node scripts/audit-commulingo-term-links.js --sql    # emit INSERT statements
//
// Review the output before turning it into a migration: the scanner is precise
// about spelling, not about whether a passing mention deserves a link.

require('dotenv').config();
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { getReportLinkContext } = require('../data/commulingo/report-links');

function sqlQuote(value) {
    return "'" + String(value).replace(/'/g, "''") + "'";
}

// The site's own name ends in a person's name, so 'Cyber-Lenin's 2026 report'
// otherwise proposes Lenin as a related person.
const SELF_NAME = /Cyber-Lenin|사이버 레닌|사이버레닌/g;

async function main() {
    const emitSql = process.argv.includes('--sql');
    const terms = await loadCommuLingoTerms();
    const contexts = {
        ko: await getReportLinkContext('ko'),
        en: await getReportLinkContext('en'),
    };

    const peopleRows = [];
    const eventRows = [];
    const report = [];

    terms.forEach(term => {
        const havePeople = new Set((term.people || []).map(person => person.id));
        const haveEvents = new Set((term.events || []).map(event => event.id));
        const foundPeople = new Set();
        const foundEvents = new Set();

        ['ko', 'en'].forEach(lang => {
            const text = [
                (term.definition && term.definition[lang]) || '',
                (term.body && term.body[lang]) || '',
            ].join('\n').replace(SELF_NAME, '');
            if (!text.trim()) return;
            const mentions = renderLinkedContent(text, contexts[lang], { surface: 'term', exclude: { term: term.id, event: term.sameSubjectEvent?.id } });
            mentions.people.forEach(entry => foundPeople.add(entry.id));
            mentions.events.forEach(entry => foundEvents.add(entry.id));
        });

        const newPeople = [...foundPeople].filter(id => !havePeople.has(id)).sort();
        const newEvents = [...foundEvents].filter(id => !haveEvents.has(id)).sort();
        if (!newPeople.length && !newEvents.length) return;

        report.push({
            term: term.id,
            hasPeople: havePeople.size,
            hasEvents: haveEvents.size,
            addPeople: newPeople.join(', '),
            addEvents: newEvents.join(', '),
        });
        newPeople.forEach((id, index) => peopleRows.push(
            `(${sqlQuote(term.id)}, ${sqlQuote(id)}, ${havePeople.size + index})`));
        newEvents.forEach((id, index) => eventRows.push(
            `(${sqlQuote(term.id)}, ${sqlQuote(id)}, ${haveEvents.size + index})`));
    });

    if (!emitSql) {
        console.table(report);
        console.log(`${report.length} terms with proposals: `
            + `${peopleRows.length} person links, ${eventRows.length} event links`);
        return;
    }
    if (peopleRows.length) {
        console.log('INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES');
        console.log(peopleRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n');
    }
    if (eventRows.length) {
        console.log('INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES');
        console.log(eventRows.join(',\n') + '\nON CONFLICT DO NOTHING;\n');
    }
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
