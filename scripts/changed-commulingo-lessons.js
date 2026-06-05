#!/usr/bin/env node

const { execFileSync } = require('child_process');
const { loadCommuLingoBundle } = require('../data/commulingo');

const BASE_COLLECTION_IDS = new Set(['capital-vol1', 'capital-vol2', 'capital-vol3']);

function usage() {
    console.log(`Usage:
  node scripts/changed-commulingo-lessons.js <old-ref> <new-ref>

Prints CommuLingo lesson ids whose public lesson payload changed.`);
}

function git(args, options = {}) {
    return execFileSync('git', args, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', options.allowError ? 'ignore' : 'pipe'],
    });
}

function gitMaybe(args) {
    try {
        return git(args, { allowError: true });
    } catch (err) {
        return '';
    }
}

function parseJson(value, fallback) {
    try {
        return JSON.parse(value);
    } catch (err) {
        return fallback;
    }
}

function changedPaths(oldRef, newRef) {
    return git([
        'diff',
        '--name-only',
        oldRef,
        newRef,
        '--',
        'data/commulingo/lessons.json',
        'data/commulingo/courses',
    ]).split(/\r?\n/).filter(Boolean);
}

function publicLessonPayloads(collections) {
    const byId = new Map();
    for (const collection of collections || []) {
        for (const chapter of collection.chapters || []) {
            for (const lesson of chapter.lessons || []) {
                if (!lesson || !lesson.id) continue;
                byId.set(lesson.id, {
                    id: lesson.id,
                    collectionId: collection.id,
                    collectionTitle: collection.title,
                    chapterNumber: chapter.chapterNumber,
                    chapterTitle: chapter.title,
                    title: lesson.title,
                    level: lesson.level,
                    summary: chapter.summary,
                    focus: chapter.learningFocus,
                    conceptBrief: chapter.conceptBrief,
                    conceptMap: chapter.conceptMap,
                    questions: lesson.questions || [],
                });
            }
        }
    }
    return byId;
}

function courseLessonIdsFromCurrentBundle(paths) {
    if (!paths.some(path => path.startsWith('data/commulingo/courses/'))) return [];
    const bundle = loadCommuLingoBundle().bundle;
    const ids = [];
    for (const collection of bundle.collections || []) {
        if (BASE_COLLECTION_IDS.has(collection.id)) continue;
        for (const chapter of collection.chapters || []) {
            for (const lesson of chapter.lessons || []) {
                if (lesson && lesson.id) ids.push(lesson.id);
            }
        }
    }
    return ids;
}

function baseLessonIdsChanged(oldRef) {
    const oldRaw = gitMaybe(['show', `${oldRef}:data/commulingo/lessons.json`]);
    const oldBase = parseJson(oldRaw, { collections: [] });
    const currentBase = parseJson(require('fs').readFileSync('data/commulingo/lessons.json', 'utf8'), { collections: [] });
    const oldLessons = publicLessonPayloads(oldBase.collections || []);
    const currentLessons = publicLessonPayloads(currentBase.collections || []);
    const ids = new Set([...oldLessons.keys(), ...currentLessons.keys()]);
    const changed = [];

    for (const id of ids) {
        const before = oldLessons.has(id) ? JSON.stringify(oldLessons.get(id)) : '';
        const after = currentLessons.has(id) ? JSON.stringify(currentLessons.get(id)) : '';
        if (before !== after) changed.push(id);
    }

    return changed;
}

function main() {
    const [oldRef, newRef] = process.argv.slice(2);
    if (!oldRef || !newRef || oldRef === '--help' || oldRef === '-h') {
        usage();
        process.exit(oldRef ? 0 : 2);
    }

    const paths = changedPaths(oldRef, newRef);
    const ids = new Set();

    if (paths.includes('data/commulingo/lessons.json')) {
        for (const id of baseLessonIdsChanged(oldRef)) ids.add(id);
    }

    for (const id of courseLessonIdsFromCurrentBundle(paths)) ids.add(id);

    for (const id of [...ids].sort()) console.log(id);
}

main();
