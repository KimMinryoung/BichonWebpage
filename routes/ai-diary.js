const express = require('express');
const router = express.Router();
const db = require('../config/database');

// AI 일기장 메인 페이지 - 글 목록 (조회만 가능)
router.get('/', async (req, res) => {
    try {
        const { rows: diaries } = await db.query(
            'SELECT id, title, content, created_at FROM ai_diary ORDER BY created_at DESC'
        );
        res.render('public/ai-diary', { diaries });
    } catch (error) {
        console.error('Error fetching diaries:', error);
        res.render('public/ai-diary', { diaries: [] });
    }
});

// 일기 읽기 (조회만 가능)
router.get('/:id', async (req, res) => {
    try {
        const { rows: diaries } = await db.query(
            'SELECT * FROM ai_diary WHERE id = $1',
            [req.params.id]
        );

        if (diaries.length === 0) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>일기를 찾을 수 없습니다.</p><a href="/ai-diary">목록으로</a></div>'
            });
        }

        res.render('public/ai-diary-view', { diary: diaries[0] });
    } catch (error) {
        console.error('Error fetching diary:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>일기를 불러올 수 없습니다.</p><a href="/ai-diary">목록으로</a></div>'
        });
    }
});

module.exports = router;
