#!/usr/bin/env node
/*
 * Import an arbitrary .html file as a CommuLingo reference document (stored
 * in commulingo_docs). Thin CLI over data/commulingo/docs-import.js — the admin
 * API (POST /commulingo/admin/api/docs) does the same thing over HTTP. See
 * data/commulingo/docs/README.md. To edit documents already published, use
 * scripts/commulingo-docs (export → edit → put).
 *
 * Needs the database: run in the container, the file on stdin (`-`):
 *   docker exec -i leninbot-frontend node /app/scripts/import-commulingo-doc.js - --id <slug> [options] < input.html
 *
 * Options:
 *   --id <slug>          URL slug / fragment filename (required)
 *   --title-ko / --title-en    Title (default: <title> tag or first <h1>)
 *   --desc-ko / --desc-en      Description shown on the index card
 *   --kind-ko / --kind-en      Category label, one of docs/README.md's seven kinds (default: 저작·연설 / Writings & speeches)
 *   --source "<citation>"      Original-work citation for the colophon
 *   --lang <ko|en>             Body language (default: ko)
 *   --person <id=이름ko|NameEn>  Related person (repeatable)
 *   --term <id=이름ko|NameEn>    Related glossary term (repeatable)
 *   --event <id=이름ko|NameEn>   Related history event (repeatable)
 *   --dry-run            Print what would be written without writing
 *   --actor <who>        Recorded as the writer (default: import-commulingo-doc)
 *   --force              Overwrite an existing doc with the same id
 */
require('./lib/bootstrap');
const fs = require('fs');
const { importDoc } = require('../data/commulingo/docs-import');

function fail(msg) {
    console.error(`error: ${msg}`);
    process.exit(1);
}

const REF_FLAGS = { person: 'people', term: 'terms', event: 'events' };

function parseArgs(argv) {
    const args = { people: [], terms: [], events: [], input: null };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--dry-run') args.dryRun = true;
        else if (a === '--force') args.force = true;
        else if (a.startsWith('--')) {
            const key = a.slice(2);
            const value = argv[++i];
            if (value === undefined) fail(`missing value for --${key}`);
            if (REF_FLAGS[key]) args[REF_FLAGS[key]].push(value);
            else args[key.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = value;
        } else if (!args.input) args.input = a;
        else fail(`unexpected argument: ${a}`);
    }
    return args;
}

function parseRefs(specs, flag) {
    return specs.map(spec => {
        const m = spec.match(/^([a-z0-9-]+)=([^|]*)\|?(.*)$/);
        if (!m) fail(`--${flag} format is id=이름ko|NameEn (got "${spec}")`);
        return { id: m[1], name: { ko: m[2], en: m[3] || m[2] } };
    });
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.input) fail('usage: import-commulingo-doc.js <input.html> --id <slug> [options]');
    if (!args.id) fail('--id <slug> is required');

    let result;
    try {
        result = await importDoc({
            actor: args.actor || 'import-commulingo-doc',
            rawHtml: fs.readFileSync(args.input === '-' ? 0 : args.input, 'utf8'),
            id: args.id,
            dryRun: args.dryRun,
            force: args.force,
            overrides: {
                docLang: args.lang,
                title: { ko: args.titleKo, en: args.titleEn },
                description: { ko: args.descKo, en: args.descEn },
                kind: args.kindKo || args.kindEn ? { ko: args.kindKo, en: args.kindEn } : undefined,
                source: args.source,
                people: parseRefs(args.people, 'person'),
                terms: parseRefs(args.terms, 'term'),
                events: parseRefs(args.events, 'event'),
            },
        });
    } catch (err) {
        fail(err.message);
    }

    const { entry, warnings, toc, fragmentBytes } = result;
    console.log(`fragment: ${entry.id} (${(fragmentBytes / 1024).toFixed(0)}KB)`);
    console.log(`toc: ${toc.filter(t => t.level === 1).length} part(s), ${toc.filter(t => t.level === 2).length} chapter(s)`);
    toc.slice(0, 12).forEach(t => console.log(`  ${t.level === 1 ? '■' : ' ·'} ${t.text}`));
    if (toc.length > 12) console.log(`  … ${toc.length - 12} more`);
    warnings.forEach(w => console.log(`warning: ${w}`));
    console.log('person-link audit:');
    console.log(JSON.stringify(result.linkAudit, null, 2));
    console.log('manifest entry:');
    console.log(JSON.stringify(entry, null, 2));

    if (args.dryRun) {
        console.log('\n(dry run — nothing written)');
        return;
    }
    console.log('\nwritten. next steps:');
    console.log('  1. Fill in title.en / description / source via PATCH or scripts/commulingo-docs (and tocExclude if the TOC preview shows junk headings).');
    console.log(`  2. Check /commulingo/docs/${entry.id} (live within a minute; no commit, no deploy).`);
    console.log(`  3. Link it from a person section as /commulingo/docs/${entry.id}`);
}

const finish = code => Promise.all([
    new Promise(resolve => process.stdout.write('', resolve)),
    new Promise(resolve => process.stderr.write('', resolve)),
]).then(() => process.exit(code));
main().then(() => finish(0), err => { console.error(err); return finish(1); });
