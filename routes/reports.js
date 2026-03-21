const express = require('express');
const router = express.Router();

const CHAT_API_URL = process.env.CHAT_API_URL || 'https://leninbot.duckdns.org';
const REPORTS_PER_PAGE = 20;

// 리포트 목록
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * REPORTS_PER_PAGE;

        const response = await fetch(
            `${CHAT_API_URL}/reports?limit=${REPORTS_PER_PAGE}&offset=${offset}`
        );
        if (!response.ok) throw new Error(`API ${response.status}`);

        const data = await response.json();
        const totalPages = Math.ceil(data.total / REPORTS_PER_PAGE);

        res.render('public/reports', {
            reports: data.reports || [],
            currentPage,
            totalPages,
            paginationBase: '/reports?page='
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.render('public/reports', {
            reports: [], currentPage: 1, totalPages: 0
        });
    }
});

// 리포트 개별 조회
router.get('/:id', async (req, res) => {
    try {
        const response = await fetch(
            `${CHAT_API_URL}/reports/${req.params.id}`
        );
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리포트를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const report = data.report;

        // 이전/다음 리포트 ID 조회 (목록에서 offset으로 계산하는 대신 API 응답에 포함시키는 게 이상적이지만, 현재는 생략)
        res.render('public/report-view', { report });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>리포트를 불러올 수 없습니다.</p><a href="/reports">목록으로</a></div>'
        });
    }
});

module.exports = router;
