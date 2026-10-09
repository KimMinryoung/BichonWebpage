#!/usr/bin/env node
// Inventory of the automatic links CommuLingo actually renders, read from a
// running server, so a change to the link engine or its data can be judged by
// what readers see rather than by regex estimates (audit-link-fires.js).
//
//   node scripts/audit-commulingo-rendered-links.js [--base URL] [--kinds people,terms,events,docs]
//        [--lang ko|en|both] [--limit N] [--out file.json]
//   node scripts/audit-commulingo-rendered-links.js --diff before.json after.json [--json]
//
// The page list comes from the server's sitemap. Paged reference documents are
// followed through ?p=. Only the engine's own anchors (class commu-*-link)
// are collected; curated lists and hand-written links are not automatic links.
'use strict';

const fs = require('fs');

const KINDS = ['people', 'terms', 'events', 'docs'];
const ANCHOR_RE = /<a\b([^>]*\bclass="commu-(person|term|event|doc|topic)-link"[^>]*)>([\s\S]*?)<\/a>/g;
const CONTEXT = 40;

function arg(name, fallback) {
    const i = process.argv.indexOf(name);
    return i === -1 ? fallback : process.argv[i + 1];
}

function decode(text) {
    return text.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (m, e) => (
        { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'", nbsp: ' ' }[e]));
}

function plain(html) {
    return decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ');
}

// The body column only: navigation, footers and scripts are not prose.
function mainHtml(html) {
    const start = html.indexOf('<main');
    const end = html.lastIndexOf('</main>');
    const body = start === -1 ? html : html.slice(start, end === -1 ? undefined : end);
    return body.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '');
}

function extractLinks(page, html) {
    const body = mainHtml(html);
    const out = [];
    for (const m of body.matchAll(ANCHOR_RE)) {
        const href = (m[1].match(/\bhref="([^"]+)"/) || [])[1] || '';
        const target = href.replace(/^\/en(?=\/)/, '').replace(/^\/commulingo\//, '');
        const before = plain(body.slice(Math.max(0, m.index - 400), m.index)).slice(-CONTEXT);
        const after = plain(body.slice(m.index + m[0].length, m.index + m[0].length + 400)).slice(0, CONTEXT);
        out.push({ page, kind: m[2], target, text: plain(m[3]), before, after });
    }
    return out;
}

async function fetchText(url) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(url, { redirect: 'manual' });
            if (res.status !== 200) return { status: res.status, text: '' };
            return { status: 200, text: await res.text() };
        } catch (err) {
            if (attempt === 2) return { status: 0, text: '', error: err.message };
            await new Promise(r => setTimeout(r, 500));
        }
    }
    return { status: 0, text: '' };
}

async function pageList(base, kinds, langs) {
    const { text } = await fetchText(base + '/sitemap.xml');
    const paths = new Set();
    for (const m of text.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)) {
        const match = m[1].match(/^(\/en)?\/commulingo\/(people|terms|events|docs)\/[^/?#]+$/);
        if (!match || !kinds.includes(match[2])) continue;
        if (!langs.includes(match[1] ? 'en' : 'ko')) continue;
        paths.add(m[1]);
    }
    return [...paths].sort();
}

async function crawl() {
    const base = arg('--base', 'http://127.0.0.1:3000').replace(/\/$/, '');
    const kinds = arg('--kinds', KINDS.join(',')).split(',');
    const langArg = arg('--lang', 'both');
    const langs = langArg === 'both' ? ['ko', 'en'] : [langArg];
    const limit = Number(arg('--limit', 0));
    const concurrency = Number(arg('--concurrency', 4));
    const outFile = arg('--out', '');
    let paths = await pageList(base, kinds, langs);
    if (limit) paths = paths.slice(0, limit);
    const links = [];
    const failures = [];
    let next = 0, done = 0;
    async function visit(path) {
        const first = await fetchText(base + path);
        if (first.status !== 200) { failures.push({ path, status: first.status }); return; }
        links.push(...extractLinks(path, first.text));
        // Paged documents: the pager carries ?p=N links up to the last page.
        const pages = [...first.text.matchAll(/[?&]p=(\d+)/g)].map(m => Number(m[1]));
        const total = pages.length ? Math.max(...pages) : 1;
        for (let p = 2; p <= total; p++) {
            const res = await fetchText(base + path + '?p=' + p);
            if (res.status !== 200) { failures.push({ path: path + '?p=' + p, status: res.status }); continue; }
            links.push(...extractLinks(path + '?p=' + p, res.text));
        }
    }
    async function worker() {
        while (next < paths.length) {
            const path = paths[next++];
            await visit(path);
            if (++done % 500 === 0) process.stderr.write(`${done}/${paths.length}\n`);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    links.sort((a, b) => a.page.localeCompare(b.page) || a.target.localeCompare(b.target) || a.text.localeCompare(b.text));
    const report = { base, generatedAt: new Date().toISOString(), pages: paths.length, failures, links };
    const json = JSON.stringify(report);
    if (outFile) fs.writeFileSync(outFile + '.tmp', json), fs.renameSync(outFile + '.tmp', outFile);
    else process.stdout.write(json + '\n');
    process.stderr.write(`pages=${paths.length} links=${links.length} failures=${failures.length}\n`);
}

// A link is identified by where it is and what it points at; its context only
// helps the reviewer.
function diff(beforeFile, afterFile) {
    const load = file => JSON.parse(fs.readFileSync(file, 'utf8'));
    const key = l => [l.page, l.target, l.text].join('\t');
    const before = load(beforeFile), after = load(afterFile);
    // Repeated links (one per document section) are told apart by their order.
    const keyed = links => {
        const count = new Map();
        return new Map(links.map(l => {
            const k = key(l), n = (count.get(k) || 0) + 1;
            count.set(k, n);
            return [k + '\t' + n, l];
        }));
    };
    const a = keyed(before.links), b = keyed(after.links);
    const removed = [...a].filter(([k]) => !b.has(k)).map(([, l]) => l);
    const added = [...b].filter(([k]) => !a.has(k)).map(([, l]) => l);
    if (process.argv.includes('--json')) {
        process.stdout.write(JSON.stringify({ removed, added }) + '\n');
        return;
    }
    const show = l => `  ${l.page}  [${l.text} → ${l.target}]  …${l.before}⟨${l.text}⟩${l.after}…`;
    console.log(`before=${before.links.length} after=${after.links.length} removed=${removed.length} added=${added.length}`);
    console.log('removed:'); removed.forEach(l => console.log(show(l)));
    console.log('added:'); added.forEach(l => console.log(show(l)));
}

if (process.argv.includes('--diff')) {
    const i = process.argv.indexOf('--diff');
    diff(process.argv[i + 1], process.argv[i + 2]);
} else {
    crawl().catch(err => { console.error(err); process.exit(1); });
}
