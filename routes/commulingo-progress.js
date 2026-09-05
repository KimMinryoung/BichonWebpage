const express = require('express');
const { requireUser } = require('../middleware/auth');
const db = require('../config/database');

// Per-account lesson progress (commulingo_progress) and per-question answer
// history (commulingo_question_progress, migration 163). GET is open (answers
// authenticated:false for visitors); the POSTs need a site account. The
// browser keeps the same data in localStorage and is the source of truth for
// the review schedule; the server stores whichever record is newer.

const router = express.Router();

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

const MAX_ANSWER_BATCH = 200;

function normalizeAnswer(raw) {
    const lessonId = typeof raw.lessonId === 'string' ? raw.lessonId.trim() : '';
    const questionId = typeof raw.questionId === 'string' ? raw.questionId.trim() : '';
    const count = value => {
        const n = Number.parseInt(value, 10);
        return Number.isFinite(n) && n >= 0 ? Math.min(n, 100000) : 0;
    };
    const stamp = value => {
        const t = Date.parse(value);
        return Number.isFinite(t) ? new Date(t) : null;
    };
    return {
        lessonId,
        questionId,
        right: count(raw.right),
        wrong: count(raw.wrong),
        streak: count(raw.streak),
        lastCorrect: raw.lastCorrect === true || raw.lastCorrect === 'true',
        lastAt: stamp(raw.lastAt),
        due: raw.due ? stamp(raw.due) : null,
    };
}

router.get('/progress', async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
        return res.json({ authenticated: false, progress: [], answers: {} });
    }

    try {
        const { rows } = await db.query(
            `SELECT lesson_id, completed, score, total_questions, updated_at
             FROM commulingo_progress
             WHERE user_id = $1
             ORDER BY updated_at DESC`,
            [req.session.user.id]
        );
        const answerRows = (await db.query(
            `SELECT lesson_id, question_id, right_count, wrong_count, streak, last_correct, last_at, due_at
             FROM commulingo_question_progress
             WHERE user_id = $1`,
            [req.session.user.id]
        )).rows;
        const answers = {};
        for (const row of answerRows) {
            answers[row.lesson_id + '/' + row.question_id] = {
                right: row.right_count,
                wrong: row.wrong_count,
                streak: row.streak,
                lastCorrect: row.last_correct,
                lastAt: row.last_at,
                due: row.due_at,
            };
        }
        res.json({
            authenticated: true,
            progress: rows.map(row => ({
                lessonId: row.lesson_id,
                completed: row.completed,
                score: row.score,
                totalQuestions: row.total_questions,
                updatedAt: row.updated_at,
            })),
            answers,
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

// Batch upsert of answer records. The newer `lastAt` wins per question, so a
// device that was offline for a while cannot roll back a schedule advanced
// elsewhere; counts travel with the record rather than being summed.
router.post('/progress/answers', requireUser, async (req, res) => {
    const list = Array.isArray(req.body && req.body.answers) ? req.body.answers : [];
    const items = list.slice(0, MAX_ANSWER_BATCH).map(normalizeAnswer)
        .filter(item => item.lessonId && item.lessonId.length <= 120 && /^q\d{1,3}$/.test(item.questionId) && item.lastAt);
    if (!items.length) return res.status(400).json({ error: 'no answers' });

    try {
        for (const item of items) {
            await db.query(
                `INSERT INTO commulingo_question_progress
                    (user_id, lesson_id, question_id, right_count, wrong_count, streak, last_correct, last_at, due_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                 ON CONFLICT (user_id, lesson_id, question_id)
                 DO UPDATE SET
                    right_count = EXCLUDED.right_count,
                    wrong_count = EXCLUDED.wrong_count,
                    streak = EXCLUDED.streak,
                    last_correct = EXCLUDED.last_correct,
                    last_at = EXCLUDED.last_at,
                    due_at = EXCLUDED.due_at
                 WHERE EXCLUDED.last_at > commulingo_question_progress.last_at`,
                [req.session.user.id, item.lessonId, item.questionId, item.right, item.wrong, item.streak, item.lastCorrect, item.lastAt, item.due]
            );
        }
        res.json({ saved: items.length });
    } catch (err) {
        console.error('commulingo save answers:', err);
        res.status(500).json({ error: 'failed to save answers' });
    }
});

module.exports = router;
