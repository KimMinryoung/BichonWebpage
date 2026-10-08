// posts and ai_diary are the same shape (id, title, content, title_en,
// content_en, created_at) served through the same pipeline: paged
// COUNT(*) OVER() query → entry by id with its older/newer neighbours →
// sanitize + CommuLingo entity links. Read straight from the local Postgres
// (about 1 ms each); a Redis copy saved under 2 ms and needed every writer,
// including the leninbot backend, to delete its keys. The two routers differed only in names
// (table, views, locals keys, author), so both are built from this
// factory.
const db = require('../config/database');
const seo = require('../utils/seo');
const errorPage = require('../utils/error-page');
const { clampInteger, markDegraded } = require('../utils/http');
const { getReportLinkContext, linkifyReportHtml } = require('../data/commulingo/report-links');
const { searchTerms, likePatterns, likeClause, matchSnippet } = require('../utils/text-search');
const { librarySearchRoute, libraryPagination } = require('../utils/library-search-route');

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
    perPage,
    listView,           // 'public/posts'
    itemsView,          // 'partials/library-entry-items' — the list's <li> rows
    deletable,          // rows carry the admin delete form (diary)
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
    // One page of entries, newest first; with a query, only the entries
    // whose title or body (in the shown language) contains every word.
    async function findEntries(lang, query, page) {
        const terms = searchTerms(query);
        const title = lang === 'en' ? "COALESCE(NULLIF(btrim(title_en), ''), title)" : 'title';
        const content = lang === 'en' ? "COALESCE(NULLIF(btrim(content_en), ''), content)" : 'content';
        const where = terms.length ? `WHERE ${likeClause(`concat_ws(' ', ${title}, ${content})`, terms)}` : '';
        const params = likePatterns(terms);
        const { rows } = await db.query(
            `SELECT id, title, content, title_en, content_en, created_at, COUNT(*) OVER() AS total_count
               FROM ${table} ${where} ORDER BY created_at DESC, id DESC
              LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
            [...params, perPage, (page - 1) * perPage]
        );
        const total = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
        const entries = rows.map(({ total_count, ...row }) => {
            const entry = localizedEntry(row, lang);
            return terms.length ? { ...entry, searchExcerpt: matchSnippet(entry.content, terms) } : entry;
        });
        return { entries, total };
    }

    async function list(req, res) {
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        const currentPage = clampInteger(req.query.page, { fallback: 1, min: 1, max: 1000 });
        const query = typeof req.query.q === 'string' ? req.query.q.slice(0, 200) : '';
        const baseLocals = {
            pagePath: currentPage > 1 ? `${listBasePath}?page=${currentPage}` : listBasePath,
            pageTitle: listTitle(res),
            pageDescription: listDescription(res),
            searchValue: query,
        };
        const itemList = entries => seo.itemListJsonLd(
            (entries || []).map(entry => ({ title: entry.title, href: `${detailPathPrefix}${entry.id}` })),
            res.locals.urlLanguage);
        try {
            const { entries, total } = await findEntries(lang, query, currentPage);
            const totalPages = Math.ceil(total / perPage);
            const pagination = libraryPagination(listBasePath, query, currentPage, totalPages);
            const pageData = { [listKey]: entries, pagination };

            res.render(listView, { ...pageData, ...baseLocals, jsonLd: itemList(entries) });
        } catch (error) {
            console.error(`Error fetching ${logLabel}:`, error);
            markDegraded(res, { empty: true });
            res.render(listView, { [listKey]: [], pagination: libraryPagination(listBasePath, '', 1, 1), loadFailed: true, ...baseLocals });
        }
    }

    const search = librarySearchRoute({
        view: itemsView,
        target: '#library-list',
        logLabel,
        load: async (req, res, { query, page }) => {
            const lang = res.locals.lang === 'en' ? 'en' : 'ko';
            const { entries, total } = await findEntries(lang, query, page);
            return {
                locals: { entries, hrefPrefix: detailPathPrefix, deletable },
                pagination: libraryPagination(listBasePath, query, page, Math.ceil(total / perPage)),
                matched: total,
            };
        },
    });

    async function detail(req, res) {
        try {
            const lang = res.locals.lang === 'en' ? 'en' : 'ko';
            // "12abc" must not resolve to entry 12; 9 digits stay inside an int4 id.
            if (!/^\d{1,9}$/.test(req.params.id)) return errorPage.notFound(res, notFoundOpts);
            const id = Number(req.params.id);

            // The entry plus its neighbours in the list order (newest first):
            // prev is the next older entry, next the next newer one.
            const { rows } = await db.query(
                `SELECT e.*,
                        (SELECT o.id FROM ${table} o WHERE (o.created_at, o.id) < (e.created_at, e.id)
                          ORDER BY o.created_at DESC, o.id DESC LIMIT 1) AS nav_prev_id,
                        (SELECT n.id FROM ${table} n WHERE (n.created_at, n.id) > (e.created_at, e.id)
                          ORDER BY n.created_at ASC, n.id ASC LIMIT 1) AS nav_next_id
                   FROM ${table} e WHERE e.id = $1`,
                [id]
            );
            if (rows.length === 0) return errorPage.notFound(res, notFoundOpts);
            const { nav_prev_id: prevId, nav_next_id: nextId, ...row } = rows[0];
            const entry = localizedEntry(row, lang);

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
                jsonLd: seo.graphJsonLd(
                    seo.pageJsonLd({
                        type: 'BlogPosting',
                        title: entry.title,
                        description: plainText,
                        path,
                        datePublished: entry.created_at,
                        dateModified: entry.updated_at || entry.created_at,
                        authorName,
                        lang: contentUrlLanguage,
                    }),
                    seo.breadcrumbJsonLd([
                        { name: contentUrlLanguage === 'en' ? 'Home' : '홈', href: '/' },
                        { name: listTitle(res), href: listBasePath },
                        { name: entry.title, href: path },
                    ], contentUrlLanguage),
                ),
            });
        } catch (error) {
            console.error(`Error fetching ${logLabel}:`, error);
            errorPage.serverError(res, serverErrorOpts);
        }
    }

    return { list, detail, search };
}

module.exports = { createEntryRoutes, localizedEntry };
