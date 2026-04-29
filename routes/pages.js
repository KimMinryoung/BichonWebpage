const express = require('express');
const router = express.Router();
const seo = require('../utils/seo');
const { fetchWithTimeout } = require('../utils/http');

const CHAT_API_URL = process.env.CHAT_API_URL || 'http://host.docker.internal:8000';

// slug guard — mirror backend validation (alphanumeric + dash only)
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

// GET /p/:slug — static page (HTML body is sanitized client-side via DOMPurify)
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    if (!SLUG_RE.test(slug)) {
        return res.status(404).render('layouts/main', {
            pageTitle: '404',
            body: '<div class="box"><h1>404</h1><p>잘못된 페이지 경로입니다.</p><a href="/">대문으로</a></div>'
        });
    }
    const pagePath = `/p/${slug}`;
    try {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const response = await fetchWithTimeout(`${CHAT_API_URL}/pages/${encodeURIComponent(slug)}?lang=${lang}`, { timeoutMs: 5000 });
        if (!response.ok) {
            return res.status(404).render('layouts/main', {
                pageTitle: '404',
                body: '<div class="box"><h1>404</h1><p>페이지를 찾을 수 없습니다.</p><a href="/">대문으로</a></div>'
            });
        }
        const data = await response.json();
        res.render('public/page-view', {
            slug: data.slug,
            pageTitle: data.title,
            pageDescription: data.summary || seo.excerpt(data.html_body || '', 160),
            summary: data.summary || '',
            htmlBody: data.html_body || '',
            updatedAt: data.updated_at || null,
            pagePath,
            ogType: 'article',
            jsonLd: seo.pageJsonLd({
                type: 'Article',
                title: data.title,
                description: data.summary || seo.excerpt(data.html_body || '', 160),
                path: pagePath,
                dateModified: data.updated_at || null,
                authorName: 'Cyber-Lenin',
            }),
        });
    } catch (error) {
        console.error('Error fetching static page:', error);
        res.status(500).render('layouts/main', {
            pageTitle: 'Error',
            body: '<div class="box"><h1>Error</h1><p>페이지를 불러올 수 없습니다.</p><a href="/">대문으로</a></div>'
        });
    }
});

module.exports = router;
