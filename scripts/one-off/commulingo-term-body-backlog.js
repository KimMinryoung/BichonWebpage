#!/usr/bin/env node
// Ranks the glossary terms that have a definition but no long-form body, so
// the leninbot enrich lane (or a person) can work down the list from the
// terms the site leans on most. Score = reference documents that list the
// term + linked people + linked events + genealogy nodes that point at it +
// lessons whose prose mentions the headword. Reads the on-disk snapshots and
// the course bundle only; no DB.
//   node scripts/one-off/commulingo-term-body-backlog.js
// Writes temp_dev/commulingo-term-body-backlog.json (gitignored) and prints
// the top of the list.
const fs = require('fs');
const path = require('path');
const { loadCommuLingoBundle } = require('../../data/commulingo');

const ROOT = path.join(__dirname, '..', '..');
const terms = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/commulingo/terms-snapshot.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/commulingo/docs/manifest.json'), 'utf8')).docs;
const genealogyDir = path.join(ROOT, 'data/commulingo/genealogy');
const charts = fs.readdirSync(genealogyDir).filter(n => n.endsWith('.json')).map(n => JSON.parse(fs.readFileSync(path.join(genealogyDir, n), 'utf8')));

const docRefs = new Map();
for (const doc of manifest) for (const id of doc.terms || []) docRefs.set(id, (docRefs.get(id) || 0) + 1);
const genRefs = new Map();
for (const chart of charts) for (const node of chart.nodes) if (node.ref && node.ref.type === 'term') genRefs.set(node.ref.id, (genRefs.get(node.ref.id) || 0) + 1);

// Every string of lesson prose, one blob per lesson, for headword mentions.
const lessonTexts = [];
for (const collection of loadCommuLingoBundle().bundle.collections) {
    for (const chapter of collection.chapters || []) {
        const parts = [];
        const walk = v => { if (typeof v === 'string') parts.push(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
        walk({ summary: chapter.summary, learningFocus: chapter.learningFocus, conceptBrief: chapter.conceptBrief, conceptMap: chapter.conceptMap, lessons: chapter.lessons });
        lessonTexts.push(parts.join('\n'));
    }
}
function lessonMentions(term) {
    const heads = [term.term && term.term.ko, term.term && term.term.en].filter(s => s && s.length >= 3);
    if (!heads.length) return 0;
    return lessonTexts.filter(text => heads.some(h => text.includes(h))).length;
}

const backlog = terms
    .filter(t => !t.body || !String(t.body.ko || '').trim())
    .map(t => {
        const docs = docRefs.get(t.id) || 0;
        const people = (t.people || []).length;
        const events = (t.events || []).length;
        const genealogy = genRefs.get(t.id) || 0;
        const lessons = lessonMentions(t);
        return { id: t.id, term: t.term && t.term.ko, category: t.category, docs, people, events, genealogy, lessons, score: docs * 3 + genealogy * 3 + lessons * 2 + people + events };
    })
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

const out = path.join(ROOT, 'temp_dev', 'commulingo-term-body-backlog.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), count: backlog.length, terms: backlog }, null, 2) + '\n');
console.log(`${backlog.length} terms without a body -> ${path.relative(process.cwd(), out)}`);
console.table(backlog.slice(0, 25).map(({ id, category, docs, people, events, genealogy, lessons, score }) => ({ id, category, docs, people, events, genealogy, lessons, score })));
const byCat = {};
for (const t of backlog) byCat[t.category] = (byCat[t.category] || 0) + 1;
console.log('by category:', JSON.stringify(byCat));
