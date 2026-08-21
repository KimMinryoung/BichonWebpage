#!/usr/bin/env node
// Wrap fictionalized character names in a reference-document fragment with
// tappable marks that reveal the real historical person.
//
//   node scripts/wrap-fic-names.js <names.json> <in.html> <out.html>
//
// names.json: [{ "surfaces": ["니콜레타", ...], "real": "니콜라이 예조프",
//                "person": "yezhov" | null }, ...]
//
// Each surface occurrence in linkable text becomes
//   <a class="fic-name" data-real="니콜라이 예조프" href="/commulingo/people/yezhov">니콜레타</a>
// (href omitted when person is null). Anchors are what linkify.js skips, so
// the marks also keep the dictionary auto-linker from double-linking the same
// text; without JS the href degrades to a plain person-card link. The reader's
// popover JS lives in views/public/commulingo-doc.ejs (.fic-name handler).
//
// The whole fragment is wrapped, appendix included: the mapping table's
// 작중 이름 cells are plain fic surfaces, and left bare they were mis-linked
// by the person pass (울리야노바 → 마리야 울리야노바, 카메네바 → 올가
// 카메네바). The real-name column links by hand inside <a> and is skipped.
//
// Longest surface wins at a given position, and a match glued to a preceding
// word character is refused (리코바 must not surrender its …코바), mirroring
// the Korean-alias rules in people-linkify.js.

const fs = require('fs');
const path = require('path');
const { WORD_CHAR, escapeRegExp, mapLinkableText } = require('../data/commulingo/people-linkify');

function main() {
    const [namesPath, inPath, outPath] = process.argv.slice(2);
    if (!namesPath || !inPath || !outPath) {
        console.error('usage: wrap-fic-names.js <names.json> <in.html> <out.html>');
        process.exit(1);
    }
    const entries = JSON.parse(fs.readFileSync(namesPath, 'utf8'));
    const bySurface = new Map();
    for (const entry of entries) {
        for (const surface of entry.surfaces) {
            if (bySurface.has(surface)) {
                throw new Error(`surface "${surface}" mapped twice`);
            }
            bySurface.set(surface, entry);
        }
    }
    const alternation = [...bySurface.keys()]
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExp)
        .join('|');
    const pattern = new RegExp('(' + alternation + ')', 'g');

    const html = fs.readFileSync(inPath, 'utf8');

    let count = 0;
    const wrapped = mapLinkableText(html, text =>
        text.replace(pattern, (match, _m, offset, source) => {
            const prev = offset > 0 ? source.charAt(offset - 1) : '';
            if (WORD_CHAR.test(prev)) return match;
            const entry = bySurface.get(match);
            count++;
            const href = entry.person ? ` href="/commulingo/people/${entry.person}"` : '';
            return `<a class="fic-name" data-real="${entry.real}"${href}>${match}</a>`;
        }));
    fs.writeFileSync(outPath, wrapped);
    console.log(`${path.basename(outPath)}: wrapped ${count} name occurrences`);
}

main();
