#!/usr/bin/env node
/*
 * Import an arbitrary .html file as a CommuLingo reference document
 * (data/commulingo/docs/). Strips document chrome (head, styles, scripts),
 * extracts the body content as an <article> fragment, and registers it in
 * manifest.json. See data/commulingo/docs/README.md for the format.
 *
 * No host node binary — run via docker:
 *   docker run --rm -v /home/grass/frontend:/app -w /app node:20-alpine \
 *     node scripts/import-commulingo-doc.js <input.html> --id <slug> [options]
 *
 * Options:
 *   --id <slug>          URL slug / fragment filename (required)
 *   --title-ko / --title-en    Title (default: <title> tag or first <h1>)
 *   --desc-ko / --desc-en      Description shown on the index card
 *   --kind-ko / --kind-en      Category label (default: 전문 / Full text)
 *   --source "<citation>"      Original-work citation for the colophon
 *   --lang <ko|en>             Body language (default: ko)
 *   --person <id=이름ko|NameEn>  Related person (repeatable)
 *   --dry-run            Print what would be written without writing
 *   --force              Overwrite an existing doc with the same id
 */
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'data', 'commulingo', 'docs');
const MANIFEST_PATH = path.join(DOCS_DIR, 'manifest.json');

function fail(msg) {
    console.error(`error: ${msg}`);
    process.exit(1);
}

function parseArgs(argv) {
    const args = { people: [], input: null };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--dry-run') args.dryRun = true;
        else if (a === '--force') args.force = true;
        else if (a.startsWith('--')) {
            const key = a.slice(2);
            const value = argv[++i];
            if (value === undefined) fail(`missing value for --${key}`);
            if (key === 'person') args.people.push(value);
            else args[key.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = value;
        } else if (!args.input) args.input = a;
        else fail(`unexpected argument: ${a}`);
    }
    return args;
}

function stripTags(html) {
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Pull the readable content out of a full HTML document: body inner if
// present, minus styles/scripts/head noise, unwrapped from <main>.
function extractFragment(raw) {
    const warnings = [];
    let html = raw.replace(/\r\n/g, '\n');

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) html = bodyMatch[1];

    const drops = [
        [/<style[\s\S]*?<\/style>/gi, 'style block'],
        [/<script[\s\S]*?<\/script>/gi, 'script block'],
        [/<link[^>]*>/gi, 'link tag'],
        [/<meta[^>]*>/gi, 'meta tag'],
    ];
    drops.forEach(([re, label]) => {
        const found = html.match(re);
        if (found) {
            warnings.push(`removed ${found.length} ${label}(s)`);
            html = html.replace(re, '');
        }
    });

    // Unwrap a single top-level <main> (the old static docs used one).
    const mainMatch = html.match(/^\s*<main[^>]*>([\s\S]*)<\/main>\s*$/i);
    if (mainMatch) html = mainMatch[1];

    ['nav', 'header', 'footer'].forEach(tag => {
        if (new RegExp(`<${tag}[\\s>]`, 'i').test(html)) {
            warnings.push(`contains a <${tag}> element — check it belongs to the document, not site chrome`);
        }
    });
    const inlineStyles = html.match(/\sstyle="/g);
    if (inlineStyles) warnings.push(`contains ${inlineStyles.length} inline style attribute(s) — reader CSS may not apply cleanly`);

    html = html.trim();
    if (!/^<article[\s>]/i.test(html)) {
        html = `<article>\n${html}\n</article>`;
        warnings.push('content was not wrapped in <article> — wrapped it');
    }
    return { html: `${html}\n`, warnings };
}

function harvestToc(html) {
    const toc = [];
    let seenTitle = false;
    html.replace(/<h([12])[^>]*>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
        if (level === '1' && !seenTitle) {
            seenTitle = true;
            return match;
        }
        toc.push({ level: Number(level), text: stripTags(inner) });
        return match;
    });
    return toc;
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.input) fail('usage: import-commulingo-doc.js <input.html> --id <slug> [options]');
    if (!args.id) fail('--id <slug> is required');
    if (!/^[a-z0-9-]+$/.test(args.id)) fail('--id must be lowercase letters, digits, and hyphens');

    const raw = fs.readFileSync(args.input, 'utf8');
    const { html, warnings } = extractFragment(raw);

    const titleTag = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const firstH1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const fallbackTitle = titleTag ? stripTags(titleTag[1]) : firstH1 ? stripTags(firstH1[1]) : args.id;

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const existing = manifest.docs.findIndex(doc => doc.id === args.id);
    if (existing !== -1 && !args.force) fail(`doc "${args.id}" already exists in manifest.json (use --force to overwrite)`);

    const entry = {
        id: args.id,
        file: `${args.id}.html`,
        docLang: args.lang || 'ko',
        title: { ko: args.titleKo || fallbackTitle, en: args.titleEn || '' },
        description: { ko: args.descKo || '', en: args.descEn || '' },
        kind: { ko: args.kindKo || '전문', en: args.kindEn || 'Full text' },
        source: args.source || '',
        people: args.people.map(spec => {
            const m = spec.match(/^([a-z0-9-]+)=([^|]*)\|?(.*)$/);
            if (!m) fail(`--person format is id=이름ko|NameEn (got "${spec}")`);
            return { id: m[1], name: { ko: m[2], en: m[3] || m[2] } };
        }),
        addedAt: new Date().toISOString().slice(0, 10),
    };

    const toc = harvestToc(html);
    const fragmentPath = path.join(DOCS_DIR, entry.file);

    console.log(`fragment: ${path.relative(process.cwd(), fragmentPath)} (${(html.length / 1024).toFixed(0)}KB)`);
    console.log(`toc: ${toc.filter(t => t.level === 1).length} part(s), ${toc.filter(t => t.level === 2).length} chapter(s)`);
    toc.slice(0, 12).forEach(t => console.log(`  ${t.level === 1 ? '■' : ' ·'} ${t.text}`));
    if (toc.length > 12) console.log(`  … ${toc.length - 12} more`);
    warnings.forEach(w => console.log(`warning: ${w}`));
    console.log('manifest entry:');
    console.log(JSON.stringify(entry, null, 2));

    if (args.dryRun) {
        console.log('\n(dry run — nothing written)');
        return;
    }

    fs.writeFileSync(fragmentPath, html);
    if (existing !== -1) manifest.docs[existing] = entry;
    else manifest.docs.push(entry);
    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log('\nwritten. next steps:');
    console.log('  1. Fill in title.en / description / source in manifest.json (and tocExclude if the TOC preview shows junk headings).');
    console.log(`  2. Check the page locally, then commit & push — data-only, no deploy needed.`);
    console.log(`  3. Link it from a person section as /commulingo/docs/${entry.id}`);
}

main();
