const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isConnectionError } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const cache = require('../config/diary-cache');
const seo = require('../utils/seo');

const DIARIES_PER_PAGE = 20;

// AI 일기장 메인 페이지 - 글 목록 (페이지네이션 적용)
router.get('/', async (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pagePath = currentPage > 1 ? `/ai-diary?page=${currentPage}` : '/ai-diary';
    try {
        const offset = (currentPage - 1) * DIARIES_PER_PAGE;
        const cacheKey = `page:${currentPage}`;

        // Check index cache
        const cached = await cache.getIndex();
        if (cached && cached[cacheKey]) {
            return res.render('public/ai-diary', {
                ...cached[cacheKey],
                pagePath,
                pageTitle: '사이버-레닌 일기장',
                pageDescription: '사이버-레닌이 스스로 작성한 일기와 운영 회고 목록입니다.',
                jsonLd: seo.itemListJsonLd((cached[cacheKey].diaries || []).map(diary => ({ title: diary.title, href: `/ai-diary/${diary.id}` }))),
            });
        }

        const { rows } = await db.query(
            'SELECT id, title, content, created_at, COUNT(*) OVER() AS total_count FROM ai_diary ORDER BY created_at DESC LIMIT $1 OFFSET $2',
            [DIARIES_PER_PAGE, offset]
        );

        const totalDiaries = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
        const totalPages = Math.ceil(totalDiaries / DIARIES_PER_PAGE);
        const diaries = rows.map(({ total_count, ...d }) => d);

        // Cache individual entries
        for (const d of diaries) {
            await cache.setEntry(d);
        }

        const pageData = { diaries, currentPage, totalPages, paginationBase: '/ai-diary?page=' };

        // Cache index (TTL-based)
        const indexData = cached || {};
        indexData[cacheKey] = pageData;
        await cache.setIndex(indexData);

        res.render('public/ai-diary', {
            ...pageData,
            pagePath,
            pageTitle: '사이버-레닌 일기장',
            pageDescription: '사이버-레닌이 스스로 작성한 일기와 운영 회고 목록입니다.',
            jsonLd: seo.itemListJsonLd(diaries.map(diary => ({ title: diary.title, href: `/ai-diary/${diary.id}` }))),
        });
    } catch (error) {
        console.error('Error fetching diaries:', error);
        res.render('public/ai-diary', {
            diaries: [],
            currentPage: 1,
            totalPages: 0,
            pagePath,
            pageTitle: '사이버-레닌 일기장',
            pageDescription: '사이버-레닌이 스스로 작성한 일기와 운영 회고 목록입니다.',
        });
    }
});

// 일기 읽기 (조회만 가능)
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Check entry cache
        let diary = await cache.getEntry(id);
        if (!diary) {
            const { rows } = await db.query('SELECT * FROM ai_diary WHERE id = $1', [id]);
            if (rows.length === 0) {
                return res.status(404).render('layouts/main', {
                    pageTitle: '404',
                    body: '<div class="box"><h1>404</h1><p>일기를 찾을 수 없습니다.</p><a href="/ai-diary">목록으로</a></div>'
                });
            }
            diary = rows[0];
            await cache.setEntry(diary);
        }

        // prev/next navigation from cached sorted ID list
        let nav = await cache.getNav();
        if (!nav) {
            const { rows } = await db.query('SELECT id FROM ai_diary ORDER BY created_at DESC');
            nav = rows.map(r => r.id);
            await cache.setNav(nav);
        }
        const idx = nav.indexOf(id);
        const prevId = idx >= 0 && idx < nav.length - 1 ? nav[idx + 1] : null;
        const nextId = idx > 0 ? nav[idx - 1] : null;

        const plainText = seo.excerpt(diary.content || '', 160);
        res.render('public/ai-diary-view', {
            diary, prevId, nextId,
            pageTitle: diary.title,
            pageDescription: plainText,
            pagePath: `/ai-diary/${diary.id}`,
            ogType: 'article',
            jsonLd: seo.pageJsonLd({
                type: 'BlogPosting',
                title: diary.title,
                description: plainText,
                path: `/ai-diary/${diary.id}`,
                datePublished: diary.created_at,
                dateModified: diary.updated_at || diary.created_at,
                authorName: 'Cyber-Lenin',
            }),
        });
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
