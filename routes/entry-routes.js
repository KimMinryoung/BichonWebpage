// posts and ai_diary are the same shape (id, title, content, title_en,
// content_en, created_at) served through the same pipeline: per-page index
// cache → paged COUNT(*) OVER() query → per-entry cache → prev/next nav list →
// sanitize + CommuLingo entity links. The two routers differed only in names
// (table, cache, views, locals keys, author), so both are built from this
// factory.
const db = require('../config/database');
const seo = require('../utils/seo');
const errorPage = require('../utils/error-page');
const { getReportLinkContext, linkifyReportHtml } = require('../data/commulingo/report-links');

function localizedEntry(row, lang) {
    if (!row || lang !== 'en') return row;
    const titleEn = row.title_en && row.title_en.trim();
    const contentEn = row.content_en && row.content_en.trim();
    return {
        ...row,
        title: titleEn || row.title,
        content: contentEn || row.content,
        language: titleEn || contentEn ? 'en' : 'ko',
        has_translation: Boolean(titleEn || contentEn),
    };
}

function createEntryRoutes({
    table,              // SQL table name ('posts' / 'ai_diary')
    cache,              // config/post-cache or config/diary-cache
    perPage,
    listView,           // 'public/posts'
    listKey,            // locals key the list view iterates ('posts' / 'diaries')
    listBasePath,       // '/posts' / '/ai-diary'
    detailView,         // 'public/post'
    detailKey,          // locals key the detail view reads ('post' / 'diary')
    detailPathPrefix,   // '/post/' / '/ai-diary/'
    listTitle,          // res => localized list page title
    listDescription,    // res => localized list page description
    sanitize,           // content sanitizer for the detail body
    authorName,         // JSON-LD author
    logLabel,           // 'posts' / 'diaries' in error logs
    notFoundOpts,       // errorPage.notFound options (undefined → defaults)
    serverErrorOpts,    // errorPage.serverError options (undefined → defaults)
}) {
    async function list(req, res) {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const currentPage = parseInt(req.query.page, 10) || 1;
        const baseLocals = {
            pagePath: currentPage > 1 ? `${listBasePath}?page=${currentPage}` : listBasePath,
            pageTitle: listTitle(res),
            pageDescription: listDescription(res),
        };
        const itemList = entries => seo.itemListJsonLd(
            (entries || []).map(entry => ({ title: entry.title, href: `${detailPathPrefix}${entry.id}` })),
            res.locals.urlLanguage);
        try {
            const cached = await cache.getIndexPage(currentPage, lang);
            if (cached) {
                return res.render(listView, { ...cached, ...baseLocals, jsonLd: itemList(cached[listKey]) });
            }

            const offset = (currentPage - 1) * perPage;
            const { rows } = await db.query(
                `SELECT id, title, content, title_en, content_en, created_at, COUNT(*) OVER() AS total_count
                   FROM ${table} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
                [perPage, offset]
            );
            const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
            const totalPages = Math.ceil(total / perPage);
            const entries = rows.map(({ total_count, ...row }) => localizedEntry(row, lang));

            await Promise.all(entries.map(entry => cache.setEntry(entry, lang)));
            const pageData = { [listKey]: entries, currentPage, totalPages, paginationBase: `${listBasePath}?page=` };
            await cache.setIndexPage(currentPage, pageData, lang);

            res.render(listView, { ...pageData, ...baseLocals, jsonLd: itemList(entries) });
        } catch (error) {
            console.error(`Error fetching ${logLabel}:`, error);
            res.render(listView, { [listKey]: [], currentPage: 1, totalPages: 0, ...baseLocals });
        }
    }

    async function detail(req, res) {
        try {
            const lang = res.locals.lang === 'en' ? 'en' : 'ko';
            const id = parseInt(req.params.id);

            let entry = await cache.getEntry(id, lang);
            if (!entry) {
                const { rows } = await db.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
                if (rows.length === 0) return errorPage.notFound(res, notFoundOpts);
                entry = localizedEntry(rows[0], lang);
                await cache.setEntry(entry, lang);
            }

            // prev/next navigation from cached sorted ID list
            let nav = await cache.getNav();
            if (!nav) {
                const { rows } = await db.query(`SELECT id FROM ${table} ORDER BY created_at DESC`);
                nav = rows.map(r => r.id);
                await cache.setNav(nav);
            }
            const idx = nav.indexOf(id);
            const prevId = idx >= 0 && idx < nav.length - 1 ? nav[idx + 1] : null;
            const nextId = idx > 0 ? nav[idx - 1] : null;

            // CommuLingo entity links (inline only — these entries stay out of
            // the reverse report-mentions index). Failure only costs the links.
            let contentHtml = sanitize(entry.content || '').replace(/\n/g, '<br>');
            try {
                contentHtml = linkifyReportHtml(contentHtml, await getReportLinkContext(lang)).html;
            } catch (e) {
                console.error(`${logLabel} entity links:`, e);
            }

            const plainText = seo.excerpt(entry.content || '', 160);
            const path = `${detailPathPrefix}${entry.id}`;
            const hasEnglishVersion = Boolean(entry.has_translation || entry.title_en || entry.content_en);
            const contentUrlLanguage = res.locals.urlLanguage === 'en' && hasEnglishVersion ? 'en' : 'ko';
            res.render(detailView, {
                [detailKey]: entry, contentHtml, prevId, nextId,
                pageTitle: entry.title,
                pageDescription: plainText,
                pagePath: path,
                hasEnglishVersion,
                ogType: 'article',
                jsonLd: seo.pageJsonLd({
                    type: 'BlogPosting',
                    title: entry.title,
                    description: plainText,
                    path,
                    datePublished: entry.created_at,
                    dateModified: entry.updated_at || entry.created_at,
                    authorName,
                    lang: contentUrlLanguage,
                }),
            });
        } catch (error) {
            console.error(`Error fetching ${logLabel}:`, error);
            errorPage.serverError(res, serverErrorOpts);
        }
    }

    return { list, detail };
}

module.exports = { createEntryRoutes, localizedEntry };
