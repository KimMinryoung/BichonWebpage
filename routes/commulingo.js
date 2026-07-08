const express = require('express');
const db = require('../config/database');
const { loadCommuLingoCatalog, loadCommuLingoLesson } = require('../data/commulingo/shards');

const router = express.Router();

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

router.get('/book/:collectionId', (req, res) => {
    const collectionId = typeof req.params.collectionId === 'string' ? req.params.collectionId.trim() : '';
    const catalog = loadCommuLingoCatalog();
    const collection = (catalog.collections || []).find(item => item.id === collectionId);
    if (!collection) return res.redirect('/commulingo');

    const bookTitle = localize(collection.title, res.locals.lang);
    res.render('public/commulingo-book', {
        lessons: { version: catalog.version, collections: [collection] },
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
