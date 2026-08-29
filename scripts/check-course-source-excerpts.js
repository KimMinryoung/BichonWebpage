#!/usr/bin/env node
// Verifies the original-text excerpts a course attaches to its questions
// (`question.source`, see data/commulingo/courses/marx-wages-and-programme.js):
// every Korean quote must appear verbatim in the site's document the link
// points at, and every link anchor must exist there. The English quotes come
// from Marx's English editions, which are not in this repo, so they are
// checked once by hand when written. A quote may skip text with ' … '; each
// piece is checked on its own.
//   node scripts/check-course-source-excerpts.js
const fs = require('fs');
const path = require('path');

const COURSES = ['marx-wages-and-programme'];
const DOCS_DIR = path.join(__dirname, '..', 'data', 'commulingo', 'docs');

function normalize(text) {
    return String(text || '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<a class="note-ref"[^>]*>[\s\S]*?<\/a>/g, '')
        .replace(/<\/(?:p|h\d|li|blockquote|div|summary)>/g, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

const docCache = new Map();
function docText(docId) {
    if (!docCache.has(docId)) {
        const raw = fs.readFileSync(path.join(DOCS_DIR, `${docId}.html`), 'utf8');
        docCache.set(docId, { text: normalize(raw), ids: new Set([...raw.matchAll(/\bid="([^"]+)"/g)].map(m => m[1])) });
    }
    return docCache.get(docId);
}

let failures = 0;
let checked = 0;
for (const courseId of COURSES) {
    const course = require(path.join('..', 'data', 'commulingo', 'courses', `${courseId}.js`));
    for (const chapter of course.chapters || []) {
        for (const lesson of chapter.lessons || []) {
            (lesson.questions || []).forEach((question, index) => {
                const where = `${lesson.id} q${index + 1}`;
                const source = question.source;
                if (!source) { console.log(`MISSING ${where}: no source`); failures += 1; return; }
                const m = /^\/commulingo\/docs\/([^#]+)#(.+)$/.exec(source.href || '');
                if (!m) { console.log(`BAD HREF ${where}: ${source.href}`); failures += 1; return; }
                const doc = docText(m[1]);
                if (!doc.ids.has(m[2])) { console.log(`BAD ANCHOR ${where}: #${m[2]} not in ${m[1]}`); failures += 1; }
                const ko = source.quote && source.quote.ko;
                if (!ko) { console.log(`MISSING ${where}: no ko quote`); failures += 1; return; }
                for (const piece of ko.split(' … ')) {
                    checked += 1;
                    if (!doc.text.includes(normalize(piece))) {
                        console.log(`NOT VERBATIM ${where} (${m[1]}): ${piece.slice(0, 40)}…`);
                        failures += 1;
                    }
                }
            });
        }
    }
}
console.log(`${checked} pieces checked, ${failures} problem(s)`);
process.exit(failures ? 1 : 0);
