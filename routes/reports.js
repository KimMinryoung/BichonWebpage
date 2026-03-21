const express = require('express');
const router = express.Router();

const CHAT_API_URL = process.env.CHAT_API_URL || 'https://leninbot.duckdns.org';
const REPORTS_PER_PAGE = 20;

// ── In-memory cache ─────────────────────────────────────────
// Reports rarely change; cache indefinitely until manual purge.
const _listCache = new Map();   // "page:N" → { data, ts }
const _reportCache = new Map(); // id → report object
const LIST_TTL_MS = 10 * 60 * 1000; // list cache: 10 min (new reports appear)

// POST /cache/clear — manual cache purge
router.post('/cache/clear', (req, res) => {
    if (!req.session.isAuthenticated) return res.status(403).send('Forbidden');
    _listCache.clear();
    _reportCache.clear();
    res.json({ cleared: true });
});

// 리포트 목록
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * REPORTS_PER_PAGE;
        const cacheKey = `page:${currentPage}`;

        // Check list cache
        const cached = _listCache.get(cacheKey);
        if (cached && (Date.now() - cached.ts) < LIST_TTL_MS) {
            return res.render('public/reports', cached.data);
        }

        const response = await fetch(
            `${CHAT_API_URL}/reports?limit=${REPORTS_PER_PAGE}&offset=${offset}`
        );
        if (!response.ok) throw new Error(`API ${response.status}`);

        const data = await response.json();
        const totalPages = Math.ceil(data.total / REPORTS_PER_PAGE);

        // Cache individual reports from list response (full result included)
        for (const r of data.reports || []) {
            _reportCache.set(r.id, r);
        }

        const viewData = {
            reports: data.reports || [],
            currentPage,
            totalPages,
            paginationBase: '/reports?page='
        };
        _listCache.set(cacheKey, { data: viewData, ts: Date.now() });

        res.render('public/reports', viewData);
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
        const id = parseInt(req.params.id);

        // Check report cache (no TTL — reports don't change)
        const cached = _reportCache.get(id);
        if (cached) {
            return res.render('public/report-view', { report: cached });
        }

        const response = await fetch(
            `${CHAT_API_URL}/reports/${id}`
        );
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리포트를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const report = data.report;
        _reportCache.set(id, report);

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
