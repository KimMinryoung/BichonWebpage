const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');
const { loadCommuLingoCatalog, loadCommuLingoLesson } = require('../data/commulingo/shards');

const router = express.Router();

const PEOPLE_PATH = path.join(__dirname, '..', 'data', 'commulingo', 'people.js');
let peopleCache = null;

function loadCommuLingoPeople() {
    let mtimeMs = 0;
    try {
        mtimeMs = fs.statSync(PEOPLE_PATH).mtimeMs;
    } catch (err) {
        return { groups: [], people: [] };
    }
    if (peopleCache && peopleCache.mtimeMs === mtimeMs) return peopleCache.data;
    delete require.cache[require.resolve(PEOPLE_PATH)];
    const data = require(PEOPLE_PATH);
    peopleCache = { mtimeMs, data };
    return data;
}

function setPublicDataCache(req, res, version) {
    if (req.query && req.query.v === version) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return;
    }
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
}

function requireUser(req, res, next) {
    if (req.session.user && req.session.user.id) return next();
    return res.status(401).json({ error: 'login required' });
}

function normalizeProgress(raw) {
    const lessonId = typeof raw.lessonId === 'string' ? raw.lessonId.trim() : '';
    const score = Number.parseInt(raw.score, 10);
    const totalQuestions = Number.parseInt(raw.totalQuestions, 10);
    return {
        lessonId,
        completed: raw.completed === true || raw.completed === 'true',
        score: Number.isFinite(score) && score >= 0 ? score : 0,
        totalQuestions: Number.isFinite(totalQuestions) && totalQuestions >= 0 ? totalQuestions : 0,
    };
}

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

function summarizeBooks(catalog) {
    return (catalog.collections || []).map(collection => {
        const chapters = collection.chapters || [];
        const lessonIds = [];
        chapters.forEach(chapter => {
            (chapter.lessons || []).forEach(lesson => {
                if (lesson && lesson.id && Number(lesson.questionCount) > 0) lessonIds.push(lesson.id);
            });
        });
        const graph = collection.conceptGraph;
        const timeline = collection.decisionTimeline;
        const episodeCount = timeline && Array.isArray(timeline.eras)
            ? timeline.eras.reduce((sum, era) => sum + (Array.isArray(era.episodes) ? era.episodes.length : 0), 0)
            : 0;
        return {
            id: collection.id,
            volumeNumber: collection.volumeNumber,
            title: collection.title,
            badge: collection.badge,
            description: collection.description,
            format: collection.format,
            chapterCount: chapters.length,
            nodeCount: graph && Array.isArray(graph.nodes) ? graph.nodes.length : 0,
            episodeCount,
            lessonIds,
        };
    });
}

router.get('/', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    res.render('public/commulingo-index', {
        books: { version: catalog.version, collections: summarizeBooks(catalog) },
        pageTitle: res.locals.strings.commuLingo.title,
        pageDescription: res.locals.strings.commuLingo.description,
        pagePath: '/commulingo',
        extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
    });
});

router.get('/people', (req, res) => {
    const lang = res.locals.lang;
    const data = loadCommuLingoPeople();
    const catalog = loadCommuLingoCatalog();

    const sceneIndex = {};
    (catalog.collections || []).forEach(collection => {
        const timeline = collection.decisionTimeline;
        if (!timeline) return;
        (timeline.eras || []).forEach(era => {
            (era.episodes || []).forEach(episode => {
                sceneIndex[`${collection.id}/${episode.id}`] = {
                    bookId: collection.id,
                    episodeId: episode.id,
                    title: localize(episode.title, lang),
                    bookTitle: localize(collection.bookTitle || collection.title, lang),
                };
            });
        });
    });

    const people = (data.people || []).map(person => ({
        id: person.id,
        group: person.group,
        initial: person.initial,
        cyrillic: person.cyrillic,
        name: localize(person.name, lang),
        years: person.years,
        epithet: localize(person.epithet, lang),
        bio: localize(person.bio, lang),
        fateKind: person.fate ? person.fate.kind : '',
        fateLabel: person.fate ? localize(person.fate.label, lang) : '',
        career: ((data.careers || {})[person.id] || []).map(entry => ({
            y: entry.y,
            r: localize(entry.r, lang),
        })),
        scenes: (person.scenes || [])
            .map(scene => sceneIndex[`${scene[0]}/${scene[1]}`])
            .filter(Boolean),
    }));

    const groups = (data.groups || []).map(group => ({
        id: group.id,
        range: group.range || '',
        title: localize(group.title, lang),
        blurb: localize(group.blurb, lang),
        people: people.filter(person => person.group === group.id),
    })).filter(group => group.people.length);

    res.render('public/commulingo-people', {
        groups,
        peopleCount: people.length,
        pageTitle: lang === 'en' ? 'People of the Revolution and the USSR' : '인물 사전 — 혁명과 소련의 사람들',
        pageDescription: lang === 'en'
            ? 'The people who stood at the forks of the two decision-simulation history books.'
            : '두 권의 결정 시뮬레이션 역사책, 그 갈림길에 서 있던 사람들.',
        pagePath: '/commulingo/people',
        extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
    });
});

router.get('/book/:collectionId', (req, res) => {
    const collectionId = typeof req.params.collectionId === 'string' ? req.params.collectionId.trim() : '';
    const catalog = loadCommuLingoCatalog();
    const collection = (catalog.collections || []).find(item => item.id === collectionId);
    if (!collection) return res.redirect('/commulingo');

    let decisionPeople = [];
    if (collection.format === 'decision-history') {
        decisionPeople = (loadCommuLingoPeople().people || []).map(person => ({
            id: person.id,
            name: localize(person.name, res.locals.lang),
            epithet: localize(person.epithet, res.locals.lang),
            aliases: (person.aliases && person.aliases[res.locals.lang]) || [],
        })).filter(person => person.aliases.length);
    }

    const bookTitle = localize(collection.title, res.locals.lang);
    res.render('public/commulingo-book', {
        lessons: { version: catalog.version, collections: [collection] },
        decisionPeople,
        bookFormat: collection.format || 'quiz',
        bookTitle,
        bookDescription: localize(collection.description, res.locals.lang),
        pageTitle: bookTitle,
        pageDescription: localize(collection.description, res.locals.lang) || res.locals.strings.commuLingo.description,
        pagePath: `/commulingo/book/${collection.id}`,
        extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
    });
});

router.get('/catalog.json', (req, res) => {
    const catalog = loadCommuLingoCatalog();
    setPublicDataCache(req, res, catalog.version);
    res.json(catalog);
});

router.get('/lesson/:lessonId', (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const payload = loadCommuLingoLesson(lessonId);
    if (!payload) return res.status(404).json({ error: 'lesson not found' });
    setPublicDataCache(req, res, payload.version);
    res.json(payload);
});

router.get('/progress', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.json({ authenticated: false, progress: [] });
    }

    try {
        const { rows } = await db.query(
            `SELECT lesson_id, completed, score, total_questions, updated_at
             FROM commulingo_progress
             WHERE user_id = $1
             ORDER BY updated_at DESC`,
            [req.session.user.id]
        );
        res.json({
            authenticated: true,
            progress: rows.map(row => ({
                lessonId: row.lesson_id,
                completed: row.completed,
                score: row.score,
                totalQuestions: row.total_questions,
                updatedAt: row.updated_at,
            })),
        });
    } catch (err) {
        console.error('commulingo progress:', err);
        res.status(500).json({ error: 'failed to load progress' });
    }
});

router.post('/progress', requireUser, async (req, res) => {
    const progress = normalizeProgress(req.body || {});
    if (!progress.lessonId || progress.lessonId.length > 120) {
        return res.status(400).json({ error: 'invalid lesson id' });
    }
    if (progress.score > progress.totalQuestions && progress.totalQuestions > 0) {
        return res.status(400).json({ error: 'invalid score' });
    }

    try {
        await db.query(
            `INSERT INTO commulingo_progress
                (user_id, lesson_id, completed, score, total_questions, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (user_id, lesson_id)
             DO UPDATE SET
                completed = commulingo_progress.completed OR EXCLUDED.completed,
                score = GREATEST(commulingo_progress.score, EXCLUDED.score),
                total_questions = GREATEST(commulingo_progress.total_questions, EXCLUDED.total_questions),
                updated_at = NOW()`,
            [
                req.session.user.id,
                progress.lessonId,
                progress.completed,
                progress.score,
                progress.totalQuestions,
            ]
        );
        res.json({ saved: true });
    } catch (err) {
        console.error('commulingo save progress:', err);
        res.status(500).json({ error: 'failed to save progress' });
    }
});

module.exports = router;
