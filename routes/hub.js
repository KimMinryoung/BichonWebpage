const express = require('express');
const router = express.Router();
const seo = require('../utils/seo');
const { fetchWithTimeout, clampInteger } = require('../utils/http');

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';
const PER_PAGE = 20;

// GET /hub — list of curations
router.get('/', async (req, res) => {
    const currentPage = clampInteger(req.query.page, { fallback: 1, min: 1, max: 1000 });
    const pagePath = currentPage > 1 ? `/hub?page=${currentPage}` : '/hub';
    const offset = (currentPage - 1) * PER_PAGE;

    try {
        const response = await fetchWithTimeout(`${CHAT_API_URL}/hub?limit=${PER_PAGE}&offset=${offset}`, { timeoutMs: 5000 });
        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        const totalPages = Math.max(1, Math.ceil((data.total || 0) / PER_PAGE));

        res.render('public/hub', {
            items: data.items || [],
            currentPage,
            totalPages,
            paginationBase: '/hub?page=',
            pagePath,
            pageTitle: '큐레이션',
            pageDescription: '사이버-레닌이 선별한 한국어권 진보 글과 선정 이유, 맥락을 모은 큐레이션입니다.',
            jsonLd: seo.itemListJsonLd((data.items || []).map(item => ({ title: item.title, href: `/hub/${item.slug}` }))),
        });
    } catch (error) {
        console.error('Error fetching hub list:', error);
        res.render('public/hub', {
            items: [], currentPage: 1, totalPages: 1,
            paginationBase: '/hub?page=', pagePath,
            pageTitle: '큐레이션',
            pageDescription: '사이버-레닌이 선별한 한국어권 진보 글과 선정 이유, 맥락을 모은 큐레이션입니다.',
        });
    }
});

// GET /hub/:slug — single curation
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const pagePath = `/hub/${slug}`;

    try {
        const response = await fetchWithTimeout(`${CHAT_API_URL}/hub/${encodeURIComponent(slug)}`, { timeoutMs: 5000 });
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>큐레이션을 찾을 수 없습니다.</p><a href="/hub">큐레이션으로</a></div>'
            });
        }
        const item = await response.json();
        const pageDescription = seo.excerpt(`${item.selection_rationale || ''} ${item.context || ''}`, 160);
        res.render('public/hub-view', {
            item,
            pageTitle: item.title,
            pageDescription,
            pagePath,
            ogType: 'article',
            jsonLd: seo.pageJsonLd({
                type: 'Article',
                title: item.title,
                description: pageDescription,
                path: pagePath,
                datePublished: item.published_at,
                authorName: 'Cyber-Lenin',
            }),
        });
    } catch (error) {
        console.error('Error fetching hub entry:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>큐레이션을 불러올 수 없습니다.</p><a href="/hub">큐레이션으로</a></div>'
        });
    }
});

module.exports = router;
