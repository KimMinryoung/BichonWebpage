const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const cache = require('../config/diary-cache');
const { sanitizeBasic } = require('../utils/sanitize');
const { createEntryRoutes } = require('./entry-routes');

const diaryRoutes = createEntryRoutes({
    table: 'ai_diary',
    cache,
    perPage: 20,
    listView: 'public/ai-diary',
    listKey: 'diaries',
    listBasePath: '/ai-diary',
    detailView: 'public/ai-diary-view',
    detailKey: 'diary',
    detailPathPrefix: '/ai-diary/',
    listTitle: res => res.locals.strings.nav.diary,
    listDescription: res => res.locals.strings.home.diaryDesc,
    sanitize: sanitizeBasic,
    authorName: 'Cyber-Lenin',
    logLabel: 'diaries',
    notFoundOpts: { message: '일기를 찾을 수 없습니다.', backHref: '/ai-diary', backLabel: '목록으로' },
    serverErrorOpts: { message: '일기를 불러올 수 없습니다.', backHref: '/ai-diary', backLabel: '목록으로' },
});

// AI 일기장 메인 페이지 - 글 목록 (페이지네이션 적용)
router.get('/', diaryRoutes.list);

// 일기 읽기 (조회만 가능)
router.get('/:id', diaryRoutes.detail);

// 일기 삭제 (관리자만)
router.post('/:id/delete', requireAuth, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('DELETE FROM ai_diary WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.redirect('/ai-diary?message=일기를 찾을 수 없습니다.&type=error');
        }

        await cache.deleteEntry(id);
        res.redirect('/ai-diary?message=일기가 삭제되었습니다.');
    } catch (error) {
        console.error('Error deleting diary:', error);
        res.redirect('/ai-diary?message=일기 삭제에 실패했습니다.&type=error');
    }
});

module.exports = router;
