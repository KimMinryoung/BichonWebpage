#!/usr/bin/env node
// Chapter data for the Python harness, as JSON on stdout.
//   node scripts/commulingo-rewrite/dump_chapter.js --list            # every Capital chapter: id, collection, part, chapterNumber
//   node scripts/commulingo-rewrite/dump_chapter.js capital-v1-ch07   # one chapter with its collection id and part title
const { loadCommuLingoBundle } = require('../../data/commulingo');

const bundle = loadCommuLingoBundle().bundle;
const arg = process.argv[2];
if (arg === '--list') {
    const rows = [];
    for (const collection of bundle.collections) {
        if (!/^capital-vol\d$/.test(collection.id)) continue;
        for (const chapter of collection.chapters) {
            rows.push({ id: chapter.id, collection: collection.id, volume: collection.volumeNumber, part: chapter.partNumber, chapterNumber: chapter.chapterNumber, title: chapter.title });
        }
    }
    console.log(JSON.stringify(rows));
} else {
    for (const collection of bundle.collections) {
        const chapter = (collection.chapters || []).find(c => c.id === arg);
        if (chapter) {
            console.log(JSON.stringify({ collection: collection.id, collectionTitle: collection.title, chapter }));
            process.exit(0);
        }
    }
    console.error('unknown chapter ' + arg);
    process.exit(2);
}
