#!/usr/bin/env node
// Fetches (once) the marxists.org page a Capital chapter's `sourceUrl` points
// at and writes the chapter's plain text plus its section anchors to
// temp_dev/commulingo-rewrite/marxists/<chapterId>.json for the rewrite
// harness and the gate. The raw HTML is cached next to it by
// scripts/lib/commulingo-source-text.js so the excerpt checker shares it.
//   node scripts/commulingo-rewrite/fetch_chapter.js capital-v1-ch01 [more ids…]
//   node scripts/commulingo-rewrite/fetch_chapter.js --volume 1
const fs = require('fs');
const path = require('path');
const { loadCommuLingoBundle } = require('../../data/commulingo');
const text = require('../lib/commulingo-source-text');

const OUT_DIR = text.MARXISTS_CACHE_DIR;

function chapterList(args) {
    const bundle = loadCommuLingoBundle().bundle;
    const all = [];
    for (const collection of bundle.collections) for (const chapter of collection.chapters || []) all.push({ collection, chapter });
    if (args[0] === '--volume') {
        const vol = Number(args[1]);
        return all.filter(x => x.collection.id === 'capital-vol' + vol);
    }
    const wanted = new Set(args);
    return all.filter(x => wanted.has(x.chapter.id));
}

// Section anchors: <a name="S1"> style ids paired with the heading text that
// follows them, so the model can cite "#S2" and the reviewer can read it.
function sections(html) {
    const out = [];
    // The anchor sits in an <h3>SECTION n</h3>; the section's name is the
    // <h4> right after it, so take both up to the end of that h4.
    const re = /<a\s+(?:name|id)="(S\d+)"[^>]*>([\s\S]{0,800}?<\/h4>|[\s\S]{0,400}?<\/h3>)/gi;
    let m;
    while ((m = re.exec(html))) {
        const title = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        out.push({ anchor: m[1], title });
    }
    if (!out.length) {
        for (const a of text.anchorsOf(html)) if (/^S\d+$/.test(a)) out.push({ anchor: a, title: '' });
    }
    return out;
}

async function main() {
    const targets = chapterList(process.argv.slice(2));
    if (!targets.length) { console.error('no chapters matched'); process.exit(2); }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    for (const { chapter } of targets) {
        const url = chapter.sourceUrl;
        const html = await text.fetchCached(url, { fetch: true });
        const body = text.normalizeMarxists(html);
        const payload = {
            chapterId: chapter.id,
            url,
            fetchedAt: new Date().toISOString().slice(0, 10),
            chars: body.length,
            sections: sections(html),
            anchors: [...text.anchorsOf(html)],
            text: body,
        };
        const file = path.join(OUT_DIR, chapter.id + '.json');
        fs.writeFileSync(file + '.tmp', JSON.stringify(payload, null, 1));
        fs.renameSync(file + '.tmp', file);
        console.log(`${chapter.id}: ${body.length} chars, ${payload.sections.length} sections -> ${path.relative(process.cwd(), file)}`);
    }
}

main().catch(err => { console.error(err); process.exit(1); });
