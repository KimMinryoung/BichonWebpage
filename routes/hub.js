const express = require('express');
const router = express.Router();
const hubStore = require('../config/hub-store');
const seo = require('../utils/seo');
const { clampInteger } = require('../utils/http');
const errorPage = require('../utils/error-page');

const PER_PAGE = 20;

// GET /hub — list of curations
// Shared by the success and failure branches of the list render.
function hubListLocals(pagePath) {
    return {
        paginationBase: '/hub?page=',
        pagePath,
        pageTitle: '큐레이션',
        pageDescription: '사이버-레닌이 선별한 진보적인 글과 선정 이유, 맥락을 모은 큐레이션입니다.',
    };
}

router.get('/', async (req, res) => {
    const currentPage = clampInteger(req.query.page, { fallback: 1, min: 1, max: 1000 });
    const pagePath = currentPage > 1 ? `/hub?page=${currentPage}` : '/hub';
    const offset = (currentPage - 1) * PER_PAGE;
    const lang = res.locals.lang === 'en' ? 'en' : 'ko';

    try {
        const [items, total] = await Promise.all([
            hubStore.listHubCurations({ limit: PER_PAGE, offset, lang }),
            hubStore.countHubCurations(),
        ]);
        const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

        res.render('public/hub', {
            ...hubListLocals(pagePath),
            items,
            currentPage,
            totalPages,
            jsonLd: seo.itemListJsonLd(
                items.map(item => ({ title: item.title, href: `/hub/${item.slug}` })),
                res.locals.urlLanguage),
        });
    } catch (error) {
        console.error('Error loading hub list:', error);
        res.render('public/hub', {
            ...hubListLocals(pagePath),
            items: [], currentPage: 1, totalPages: 1,
        });
    }
});

// GET /hub/:slug — single curation
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    const pagePath = `/hub/${slug}`;

    try {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const item = await hubStore.getHubCuration(slug, lang);
        if (!item) {
            return errorPage.notFound(res, { message: '큐레이션을 찾을 수 없습니다.', backHref: '/hub', backLabel: '큐레이션으로' });
        }
        const pageDescription = seo.excerpt(`${item.selection_rationale || ''} ${item.context || ''}`, 160);
        res.render('public/hub-view', {
            item,
            pageTitle: item.title,
            pageDescription,
            pagePath,
            hasEnglishVersion: item.has_translation,
            ogType: 'article',
            jsonLd: seo.graphJsonLd(
                seo.pageJsonLd({
                    type: 'Article',
                    title: item.title,
                    description: pageDescription,
                    path: pagePath,
                    datePublished: item.published_at,
                    authorName: 'Cyber-Lenin',
                    lang: res.locals.urlLanguage === 'en' && item.has_translation ? 'en' : 'ko',
                }),
                seo.breadcrumbJsonLd([
                    { name: lang === 'en' ? 'Home' : '홈', href: '/' },
                    { name: lang === 'en' ? 'Curations' : '큐레이션', href: '/hub' },
                    { name: item.title, href: pagePath },
                ], res.locals.urlLanguage === 'en' && item.has_translation ? 'en' : 'ko'),
            ),
        });
    } catch (error) {
        console.error('Error fetching hub entry:', error);
        errorPage.serverError(res, { message: '큐레이션을 불러올 수 없습니다.', backHref: '/hub', backLabel: '큐레이션으로' });
    }
});

module.exports = router;
