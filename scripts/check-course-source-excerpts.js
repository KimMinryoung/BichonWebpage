#!/usr/bin/env node
// Verifies the original-text excerpts questions attach as `question.source`
// (see data/commulingo/courses/marx-wages-and-programme.js for the shape).
//
// Site documents (`/commulingo/docs/<id>#anchor`): the Korean quote must
// appear verbatim in the document on disk and the anchor must exist. The
// English quotes there come from editions not in this repo and are checked
// once by hand when written.
//
// marxists.org chapters (`https://www.marxists.org/...#anchor`, used by
// Capital, whose text is not on the site): the ENGLISH quote must appear
// verbatim in the fetched chapter and the anchor must exist; the Korean quote
// is the site's own translation and is only shape-checked by the validator.
// Pages are cached under temp_dev/commulingo-rewrite/marxists/ and never
// fetched unless --fetch is given, so a run without the cache fails loudly
// instead of touching the network.
//
//   node scripts/check-course-source-excerpts.js            # offline, cache only
//   node scripts/check-course-source-excerpts.js --fetch    # fill the cache as needed
//
// Collections in REQUIRE_SOURCE must carry a source on every question; the
// rest are checked only where a source is present.
const fs = require('fs');
const path = require('path');
const { loadCommuLingoBundle } = require('../data/commulingo');
const text = require('./lib/commulingo-source-text');

const REQUIRE_SOURCE = new Set(['marx-wages-and-programme', 'marx-wage-labour-capital']);
const DOCS_DIR = path.join(__dirname, '..', 'data', 'commulingo', 'docs');
const doFetch = process.argv.includes('--fetch');

const docCache = new Map();
function siteDoc(docId) {
    if (!docCache.has(docId)) {
        const file = path.join(DOCS_DIR, `${docId}.html`);
        if (!fs.existsSync(file)) { docCache.set(docId, null); return null; }
        const raw = fs.readFileSync(file, 'utf8');
        docCache.set(docId, { text: text.normalizeSiteDoc(raw), ids: text.anchorsOf(raw) });
    }
    return docCache.get(docId);
}

const pageCache = new Map();
async function marxistsPage(url) {
    const key = url.replace(/#.*$/, '');
    if (!pageCache.has(key)) {
        try {
            const raw = await text.fetchCached(key, { fetch: doFetch });
            pageCache.set(key, { text: text.normalizeMarxists(raw), ids: text.anchorsOf(raw) });
        } catch (err) {
            pageCache.set(key, { error: err.message });
        }
    }
    return pageCache.get(key);
}

async function main() {
    let failures = 0;
    let checked = 0;
    const bundle = loadCommuLingoBundle().bundle;
    for (const collection of bundle.collections || []) {
        const required = REQUIRE_SOURCE.has(collection.id);
        for (const chapter of collection.chapters || []) {
            for (const lesson of chapter.lessons || []) {
                for (const [index, question] of (lesson.questions || []).entries()) {
                    const where = `${lesson.id} q${index + 1}`;
                    const source = question.source;
                    if (!source) {
                        if (required) { console.log(`MISSING ${where}: no source`); failures += 1; }
                        continue;
                    }
                    const href = String(source.href || '');
                    const site = /^\/commulingo\/docs\/([^#]+)#(.+)$/.exec(href);
                    const external = /^https:\/\/www\.marxists\.org\/[^#]+(?:#(.+))?$/.exec(href);
                    let page;
                    let locale;
                    let anchor;
                    if (site) {
                        page = siteDoc(site[1]);
                        if (!page) { console.log(`BAD DOC ${where}: ${site[1]} not on disk`); failures += 1; continue; }
                        locale = 'ko';
                        anchor = site[2];
                    } else if (external) {
                        page = await marxistsPage(href);
                        if (page.error) { console.log(`UNAVAILABLE ${where}: ${page.error}`); failures += 1; continue; }
                        locale = 'en';
                        anchor = external[1];
                    } else {
                        console.log(`BAD HREF ${where}: ${href}`); failures += 1; continue;
                    }
                    if (anchor && !page.ids.has(anchor)) { console.log(`BAD ANCHOR ${where}: #${anchor} not in ${href.replace(/#.*$/, '')}`); failures += 1; }
                    const quote = source.quote && source.quote[locale];
                    if (!quote) { console.log(`MISSING ${where}: no ${locale} quote`); failures += 1; continue; }
                    for (const piece of text.quotePieces(quote)) {
                        checked += 1;
                        if (!page.text.includes(piece)) {
                            console.log(`NOT VERBATIM ${where} (${href.replace(/#.*$/, '')}): ${piece.slice(0, 40)}…`);
                            failures += 1;
                        }
                    }
                }
            }
        }
    }
    console.log(`${checked} pieces checked, ${failures} problem(s)`);
    process.exit(failures ? 1 : 0);
}

main().catch(function(err) { console.error(err); process.exit(2); });
