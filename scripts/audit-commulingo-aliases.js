#!/usr/bin/env node
// Read-only: inspect the local dictionary snapshots, never require a live DB.
const fs = require('fs');
const path = require('path');
const { assertHeadword, assertAliases } = require('../data/commulingo/headword-validation');
const root = path.join(__dirname, '../data/commulingo');
const load = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const sources = {
    person: load('people-snapshot.json').people,
    term: load('terms-snapshot.json'),
    event: load('history-events-snapshot.json'),
    doc: load('docs/manifest.json').docs,
};
const problems = [];
const owners = new Map();
for (const [kind, entries] of Object.entries(sources)) {
    for (const entry of entries) {
        const ref = `${kind}:${entry.id}`;
        if (entry.aliases !== undefined) {
            try { assertAliases(entry.aliases); } catch (error) { problems.push({ ref, problem: error.message }); }
        }
        for (const lang of ['ko', 'en']) {
            const headword = (entry.term || entry.title || entry.name || {})[lang];
            if (headword) {
                try { assertHeadword(headword, lang); } catch (error) { problems.push({ ref, problem: error.message }); }
            }
            const aliases = entry.aliases && entry.aliases[lang];
            const values = [...(Array.isArray(aliases) ? aliases : []), ...(kind !== 'doc' && headword ? [headword] : [])];
            for (const value of new Set(values)) {
                if (typeof value !== 'string') continue;
                const key = `${lang}:${value.normalize('NFC').trim().replace(/\s+/g, ' ')}`;
                if (!owners.has(key)) owners.set(key, new Set());
                owners.get(key).add(ref);
            }
        }
    }
}
const collisions = [...owners].filter(([, refs]) => refs.size > 1)
    .map(([spelling, refs]) => ({ spelling, entries: [...refs] }));
console.log(JSON.stringify({
    note: 'Registration collisions for review, not proof of incorrect links. Includes search-only/blocked aliases; event EXTRA_TERMS and derived person names require the runtime policy tests.',
    syntaxProblems: problems, collisions,
}, null, 2));
// Existing snapshots are evidence, not writable sources. --strict is useful
// after cleaning historical formatting; ordinary audits remain read-only.
if (process.argv.includes('--strict') && problems.length) process.exitCode = 1;
