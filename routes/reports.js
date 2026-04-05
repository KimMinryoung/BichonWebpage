const express = require('express');
const router = express.Router();
const cache = require('../config/report-cache');

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const REPORTS_PER_PAGE = 20;

// POST /cache/clear — manual cache purge
router.post('/cache/clear', async (req, res) => {
    if (!req.session.isAuthenticated) return res.status(403).send('Forbidden');
    await cache.clearAll();
    res.json({ cleared: true });
});

// 리포트 목록 (research + task reports)
router.get('/', async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * REPORTS_PER_PAGE;

        // Fetch task reports (with cache)
        let taskData = await cache.getList(currentPage);
        if (!taskData) {
            const response = await fetch(
                `${CHAT_API_URL}/reports?limit=${REPORTS_PER_PAGE}&offset=${offset}`
            );
            if (!response.ok) throw new Error(`API ${response.status}`);

            const data = await response.json();
            const totalPages = Math.ceil(data.total / REPORTS_PER_PAGE);

            for (const r of data.reports || []) {
                await cache.setReport(r);
            }

            taskData = {
                reports: data.reports || [],
                currentPage,
                totalPages,
                paginationBase: '/reports?page='
            };
            await cache.setList(currentPage, taskData);
        }

        // Fetch research list (with cache)
        let researchFiles = await cache.getResearchList();
        if (!researchFiles) {
            researchFiles = [];
            try {
                const rRes = await fetch(`${CHAT_API_URL}/research`);
                if (rRes.ok) {
                    const rData = await rRes.json();
                    const files = (rData.files || []).sort((a, b) => b.modified_at - a.modified_at);

                    await Promise.all(files.map(async (f) => {
                        // Check file cache first
                        const cached = await cache.getResearch(f.filename);
                        if (cached && cached.title) {
                            f.title = cached.title;
                            return;
                        }
                        try {
                            const r = await fetch(`${CHAT_API_URL}/research/${encodeURIComponent(f.filename)}`);
                            if (r.ok) {
                                const d = await r.json();
                                const match = (d.content || '').match(/^#\s+(.+)/m);
                                if (match) f.title = match[1];
                                await cache.setResearch(f.filename, { content: d.content, title: f.title || f.filename });
                            }
                        } catch (_) {}
                    }));

                    researchFiles = files;
                    await cache.setResearchList(researchFiles);
                }
            } catch (e) {
                console.error('Error fetching research list:', e);
            }
        }

        res.render('public/reports', {
            ...taskData,
            researchFiles
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.render('public/reports', {
            reports: [], currentPage: 1, totalPages: 0, researchFiles: []
        });
    }
});

// Research 개별 조회 (must be before /:id to avoid conflict)
router.get('/research/:filename', async (req, res) => {
    try {
        const filename = req.params.filename;

        // Check file cache
        const cached = await cache.getResearch(filename);
        if (cached && cached.content) {
            return res.render('public/research-view', { filename, markdown: cached.content });
        }

        const response = await fetch(`${CHAT_API_URL}/research/${encodeURIComponent(filename)}`);
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리서치를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const markdown = data.content || '';
        const match = markdown.match(/^#\s+(.+)/m);
        await cache.setResearch(filename, { content: markdown, title: match ? match[1] : filename });

        res.render('public/research-view', { filename, markdown });
    } catch (error) {
        console.error('Error fetching research:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>리서치를 불러올 수 없습니다.</p><a href="/reports">목록으로</a></div>'
        });
    }
});

// 리포트 개별 조회
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Check file cache (permanent — reports don't change)
        const cached = await cache.getReport(id);
        if (cached) {
            return res.render('public/report-view', { report: cached });
        }

        const response = await fetch(`${CHAT_API_URL}/reports/${id}`);
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>리포트를 찾을 수 없습니다.</p><a href="/reports">목록으로</a></div>'
            });
        }

        const data = await response.json();
        const report = data.report;
        await cache.setReport(report);

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
