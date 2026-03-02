const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isConnectionError } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const paginationHelper = require('../config/paginationHelper');

const DIARIES_PER_PAGE = 20;

// AI 일기장 메인 페이지 - 글 목록 (페이지네이션 적용)
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * DIARIES_PER_PAGE;

        // 총 일기 수 조회
        const { rows: countResult } = await db.query('SELECT COUNT(*) as count FROM ai_diary');
        const totalDiaries = parseInt(countResult[0].count);
        const totalPages = Math.ceil(totalDiaries / DIARIES_PER_PAGE);

        // 일기 목록 조회 (페이지네이션 적용)
        const { rows: diaries } = await db.query(
            'SELECT id, title, content, created_at FROM ai_diary ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [DIARIES_PER_PAGE, offset]
        );

        res.render('public/ai-diary', {
            diaries,
            currentPage,
            totalPages,
            paginationBase: '/ai-diary?page='
        });
    } catch (error) {
        console.error('Error fetching diaries:', error);
        res.render('public/ai-diary', { diaries: [], currentPage: 1, totalPages: 0 });
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

        const diary = diaries[0];

        // 이전 글 (더 오래된 글) / 다음 글 (더 새로운 글) 조회
        // AND id != $2: JS Date의 밀리초 정밀도와 PostgreSQL 마이크로초 정밀도 차이로 자기 자신이 매칭되는 것을 방지
        const [prevResult, nextResult] = await Promise.all([
            db.query('SELECT id FROM ai_diary WHERE created_at < $1 AND id != $2 ORDER BY created_at DESC LIMIT 1', [diary.created_at, diary.id]),
            db.query('SELECT id FROM ai_diary WHERE created_at > $1 AND id != $2 ORDER BY created_at ASC LIMIT 1', [diary.created_at, diary.id])
        ]);

        const prevId = prevResult.rows.length > 0 ? prevResult.rows[0].id : null;
        const nextId = nextResult.rows.length > 0 ? nextResult.rows[0].id : null;

        res.render('public/ai-diary-view', { diary, prevId, nextId });
    } catch (error) {
        console.error('Error fetching diary:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>일기를 불러올 수 없습니다.</p><a href="/ai-diary">목록으로</a></div>'
        });
    }
});

// 일기 삭제 (관리자만)
router.post('/:id/delete', requireAuth, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM ai_diary WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.redirect('/ai-diary?message=일기를 찾을 수 없습니다.&type=error');
        }

        res.redirect('/ai-diary?message=일기가 삭제되었습니다.');
    } catch (error) {
        console.error('Error deleting diary:', error);
        res.redirect('/ai-diary?message=일기 삭제에 실패했습니다.&type=error');
    }
});

module.exports = router;
