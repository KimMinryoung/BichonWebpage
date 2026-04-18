const express = require('express');
const router = express.Router();

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const PER_PAGE = 20;

// GET /hub — list of curations
router.get('/', async (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const pagePath = currentPage > 1 ? `/hub?page=${currentPage}` : '/hub';
    const offset = (currentPage - 1) * PER_PAGE;

    try {
        const response = await fetch(`${CHAT_API_URL}/hub?limit=${PER_PAGE}&offset=${offset}`);
        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        const totalPages = Math.max(1, Math.ceil((data.total || 0) / PER_PAGE));

        res.render('public/hub', {
            items: data.items || [],
            currentPage,
            totalPages,
            paginationBase: '/hub?page=',
            pagePath,
        });
    } catch (error) {
        console.error('Error fetching hub list:', error);
        res.render('public/hub', {
            items: [], currentPage: 1, totalPages: 1,
            paginationBase: '/hub?page=', pagePath,
        });
    }
});

// GET /hub/:slug — single curation
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const pagePath = `/hub/${slug}`;

    try {
        const response = await fetch(`${CHAT_API_URL}/hub/${encodeURIComponent(slug)}`);
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>큐레이션을 찾을 수 없습니다.</p><a href="/hub">큐레이션으로</a></div>'
            });
        }
        const item = await response.json();
        res.render('public/hub-view', { item, pageTitle: item.title, pagePath });
    } catch (error) {
        console.error('Error fetching hub entry:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>큐레이션을 불러올 수 없습니다.</p><a href="/hub">큐레이션으로</a></div>'
        });
    }
});

module.exports = router;
