#!/usr/bin/env node
// Which bare family names the person index links, and which it refuses. Run it
// before and after touching the alias rules in people-linkify.js: the added
// list is exactly the new blue in every page's prose, and the refused list is
// what stays plain (ambiguous surnames, ordinary-word homographs, regnal
// numbers).
//
//   node scripts/audit-person-family-name-links.js [ko|en]

require('dotenv').config();
const { getLinkIndexes } = require('../data/commulingo/linkify');
const { loadLinkBlocklist, neverLinkAliases } = require('../data/commulingo/link-blocklist');

const lang = process.argv[2] === 'en' ? 'en' : 'ko';

// The same part the index offers as a bare alias.
function familyNameOf(person) {
    return String((person.names && person.names.family) || '').trim();
}

(async () => {
    const { person: index, standardized } = await getLinkIndexes(lang);
    await loadLinkBlocklist(); // getLinkIndexes loads it too; explicit so the REFUSED reasons never silently blank

    const people = standardized.people;

    // How many people each name word belongs to — the ambiguity test the index
    // itself applies.
    const owners = {};
    people.forEach(p => {
        new Set([p.names && p.names.short, p.names && p.names.display, p.displayName]
            .filter(v => typeof v === 'string')
            .flatMap(v => v.trim().toLowerCase().split(/\s+/))
            .filter(Boolean))
            .forEach(word => { (owners[word] || (owners[word] = new Set())).add(p.id); });
    });

    const linked = [];
    const refused = [];
    people.forEach(p => {
        const family = familyNameOf(p);
        if (!family) return;
        const entry = index.byAlias[family];
        const declared = ((p.aliases && p.aliases[lang]) || []).includes(family);
        const row = {
            id: p.id, family, display: p.displayName, declared,
            owners: (owners[family.toLowerCase()] || new Set()).size,
        };
        if (entry && entry.id === p.id) linked.push(row); else refused.push({ ...row, target: entry ? entry.id : null });
    });

    const derived = linked.filter(row => !row.declared);
    console.log(`lang=${lang}  people=${people.length}`);
    console.log(`family names linking: ${linked.length}  (declared as an alias: ${linked.length - derived.length}, derived from the name: ${derived.length})`);
    console.log(`family names refused: ${refused.length}\n`);

    console.log('── DERIVED (new blue: these link now and did not before) ──');
    derived.forEach(row => console.log(`  ${row.family}\t← ${row.display}  [${row.id}]`));

    console.log('\n── REFUSED ──');
    const neverLink = neverLinkAliases(lang === 'en' ? 'en' : 'ko');
    refused.forEach(row => {
        const why = neverLink.includes(lang === 'en' ? row.family.toLowerCase() : row.family)
            ? 'never-link (ordinary word)'
            : row.owners > 1 ? `shared by ${row.owners} people`
                : row.target ? `claimed by ${row.target}` : 'not indexed';
        console.log(`  ${row.family}\t← ${row.display}  [${row.id}]  — ${why}`);
    });
    process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
