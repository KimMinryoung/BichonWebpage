const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../config/database');

const router = express.Router();
const LESSONS_PATH = path.join(__dirname, '..', 'data', 'commulingo', 'lessons.json');
const PUBLIC_CHAPTER_LIMITS = {
    'capital-vol1': 33,
    'capital-vol2': 21,
    'capital-vol3': 52,
};

let lessonsCache = null;

function readLessons() {
    const stat = fs.statSync(LESSONS_PATH);
    if (lessonsCache && lessonsCache.mtimeMs === stat.mtimeMs) return lessonsCache.bundle;
    const raw = fs.readFileSync(LESSONS_PATH, 'utf8');
    const bundle = JSON.parse(raw);
    lessonsCache = {
        mtimeMs: stat.mtimeMs,
        version: String(Math.trunc(stat.mtimeMs)),
        bundle,
        publicBundle: null,
        catalog: null,
        lessonsById: null,
    };
    return bundle;
}

function currentVersion() {
    readLessons();
    return lessonsCache.version;
}

function publicLessons(bundle) {
    readLessons();
    if (lessonsCache.publicBundle) return lessonsCache.publicBundle;
    lessonsCache.publicBundle = {
        ...bundle,
        version: currentVersion(),
        collections: (bundle.collections || [])
            .map(collection => {
                const chapterLimit = PUBLIC_CHAPTER_LIMITS[collection.id] || 0;
                return {
                    ...collection,
                    chapters: (collection.chapters || []).filter(chapter => (
                        chapterLimit > 0 && Number(chapter.chapterNumber) <= chapterLimit
                    )),
                };
            })
            .filter(collection => collection.chapters.length > 0),
    };
    return lessonsCache.publicBundle;
}

function lessonQuestionCount(lesson) {
    return Array.isArray(lesson.questions) ? lesson.questions.length : 0;
}

function publicCatalog(bundle) {
    readLessons();
    if (lessonsCache.catalog) return lessonsCache.catalog;
    const publicBundle = publicLessons(bundle);
    lessonsCache.catalog = {
        version: publicBundle.version,
        collections: (publicBundle.collections || []).map(collection => ({
            id: collection.id,
            volumeNumber: collection.volumeNumber,
            title: collection.title,
            description: collection.description,
            bookTitle: collection.bookTitle,
            chapters: (collection.chapters || []).map(chapter => ({
                id: chapter.id,
                volumeNumber: chapter.volumeNumber,
                chapterNumber: chapter.chapterNumber,
                partNumber: chapter.partNumber,
                partTitle: chapter.partTitle,
                title: chapter.title,
                summary: chapter.summary,
                sourceUrl: chapter.sourceUrl,
                learningFocus: chapter.learningFocus,
                lessons: (chapter.lessons || []).map(lesson => ({
                    id: lesson.id,
                    level: lesson.level,
                    title: lesson.title,
                    questionCount: lessonQuestionCount(lesson),
                })),
            })),
        })),
    };
    return lessonsCache.catalog;
}

function publicLessonsById(bundle) {
    readLessons();
    if (lessonsCache.lessonsById) return lessonsCache.lessonsById;
    const byId = new Map();
    const publicBundle = publicLessons(bundle);
    (publicBundle.collections || []).forEach(collection => {
        (collection.chapters || []).forEach(chapter => {
            (chapter.lessons || []).forEach(lesson => {
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
                    conceptMap: chapter.conceptMap,
                    questions: lesson.questions || [],
                });
            });
        });
    });
    lessonsCache.lessonsById = byId;
    return byId;
}

function setPublicDataCache(req, res) {
    if (req.query && req.query.v === currentVersion()) {
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

router.get('/', (req, res) => {
    const lessons = publicCatalog(readLessons());
    res.render('public/commulingo', {
        lessons,
        pageTitle: res.locals.strings.commuLingo.title,
        pageDescription: res.locals.strings.commuLingo.description,
        pagePath: '/commulingo',
        extraCss: `/css/commulingo.css?v=${res.locals.assetVersion}`,
    });
});

router.get('/catalog.json', (req, res) => {
    setPublicDataCache(req, res);
    res.json(publicCatalog(readLessons()));
});

router.get('/lesson/:lessonId', (req, res) => {
    const lessonId = typeof req.params.lessonId === 'string' ? req.params.lessonId.trim() : '';
    const lesson = publicLessonsById(readLessons()).get(lessonId);
    if (!lesson) return res.status(404).json({ error: 'lesson not found' });
    setPublicDataCache(req, res);
    res.json({ version: currentVersion(), lesson });
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
