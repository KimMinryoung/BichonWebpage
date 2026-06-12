const express = require('express');
const router = express.Router();
const pageStore = require('../config/page-store');
const seo = require('../utils/seo');
const errorPage = require('../utils/error-page');

// slug guard — mirror backend validation (alphanumeric + dash only)
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

// GET /p/:slug — static page (HTML body is sanitized client-side via DOMPurify)
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    if (!SLUG_RE.test(slug)) {
        return errorPage.notFound(res, { message: '잘못된 페이지 경로입니다.', backLabel: '대문으로' });
    }
    const pagePath = `/p/${slug}`;
    try {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const data = await pageStore.getPage(slug, lang);
        if (!data) {
            return errorPage.notFound(res, { message: '페이지를 찾을 수 없습니다.', backLabel: '대문으로' });
        }
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
        errorPage.serverError(res, { message: '페이지를 불러올 수 없습니다.', backLabel: '대문으로' });
    }
});

module.exports = router;
