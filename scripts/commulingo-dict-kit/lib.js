'use strict';
// Shared helpers for CommuLingo dictionary jobs (terms + cards + link reviews).
// Usage in a job directory (scripts/content/<job>/):
//   const kit = require('../../commulingo-dict-kit/lib')({ dir: __dirname, sources: require('./sources') });
//   kit.ev('enX', 'verbatim excerpt', 'claim', 'body')   -> evidence item checked against source/<file>
//   kit.evp(...)                                         -> the same without stance, for person cards
//   kit.quote('enX', 'original sentence')                -> the sentence, checked against the source
//   kit.lint(id, ko, en)                                 -> house-style checks
//   kit.finish()                                         -> prints the miss count, sets exit code
// sources.js maps keys to { url, file, loc? }; kit.W(lang, title) builds a Wikipedia entry
// whose file is what fetch-wiki.py writes.
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const wikiUrl = (lang, t) => `https://${lang}.wikipedia.org/wiki/`
    + encodeURIComponent(t.replace(/ /g, '_')).replace(/%2C/g, ',').replace(/%28/g, '(').replace(/%29/g, ')');
const W = (lang, t) => ({ url: wikiUrl(lang, t), file: `${lang}-${t.replace(/\//g, '_')}.txt` });

module.exports = function kit({ dir, sources = {}, sourceDir = 'source', accessed = new Date().toISOString().slice(0, 10) }) {
    const cache = {}; let bad = 0;
    const src = key => { const s = sources[key]; if (!s) throw new Error(`unknown source key ${key}`); return s; };
    const text = file => cache[file] ??= fs.readFileSync(path.join(dir, sourceDir, file), 'utf8');
    const sha = file => crypto.createHash('sha256').update(text(file)).digest('hex');
    const miss = (...a) => { console.log(...a); bad++; };

    // One evidence item; the excerpt must occur verbatim in the saved source file.
    function ev(key, excerpt, claim, field, stance = 'supports') {
        const s = src(key), x = text(s.file), at = x.indexOf(excerpt);
        if (at < 0) miss('MISS', key, '|', excerpt.slice(0, 140));
        return { ...(field ? { field } : {}), claim, source: s.url, excerpt, stance,
            locator: `${s.loc || 'plain-text extract'} characters ${at}:${at + excerpt.length}; accessed ${accessed}; sha256 ${sha(s.file)}` };
    }
    // Person cards (people_upsert) refuse the stance key: use evp there.
    const evp = (...a) => { const { stance, ...e } = ev(...a); return e; };
    // Rows [field, key, excerpt, claim] -> evidence items.
    const evs = rows => rows.map(([field, key, excerpt, claim]) => ev(key, excerpt, claim, field));
    function quote(key, s) {
        const x = text(src(key).file).replace(/\s+/g, ' ');
        if (!x.includes(s.replace(/\s+/g, ' '))) miss('QUOTE MISS', key, s.slice(0, 100));
        return s;
    }
    // House style: no em dash in prose (quotes exempt), 『자본』 not 자본론, no self-citation,
    // no internal field names or assumption tags in public text.
    function lint(id, ...strs) {
        for (const b of strs.filter(Boolean)) {
            const prose = b.split('\n').filter(l => !l.startsWith('> ')).join('\n');
            const at = prose.indexOf('—');
            if (at >= 0) miss('EMDASH', id, prose.slice(Math.max(0, at - 40), at + 20));
            if (/자본론/.test(b)) miss('자본론', id);
            if (/cyber-lenin/i.test(b)) miss('SELF', id);
            if (/\b(startYear|endYear|period|sortOrder)\b|이 항목은|설명용 가정|illustrative assumption/.test(prose)) miss('META', id);
        }
    }
    const sourcesOf = evidence => [...new Set(evidence.map(e => e.source))];
    function finish() { console.log('misses', bad); process.exitCode = bad ? 1 : 0; return bad; }
    return { ev, evp, evs, quote, lint, text, sources, sourcesOf, finish, bad: () => bad, W };
};
module.exports.W = W;
module.exports.wikiUrl = wikiUrl;
