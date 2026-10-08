const db = require('./database');
const { likePatterns, likeClause } = require('../utils/text-search');

function hasEnglish(row) {
    if (!row) return false;
    if (typeof row.has_en_body === 'boolean') return row.has_en_body;
    return Boolean(row.html_body_en && row.html_body_en.trim());
}

function localize(row, lang = 'ko', includeBody = true) {
    if (!row) return null;
    const useEnglish = lang === 'en' && hasEnglish(row);
    const page = {
        slug: row.slug,
        title: (useEnglish ? row.title_en : row.title) || row.title || row.slug,
        summary: (useEnglish ? row.summary_en : row.summary) || row.summary || '',
        updated_at: row.updated_at,
        created_at: row.created_at,
        requested_language: lang === 'en' ? 'en' : 'ko',
        language: useEnglish ? 'en' : 'ko',
        has_translation: hasEnglish(row),
        available_languages: hasEnglish(row) ? ['ko', 'en'] : ['ko'],
    };
    if (includeBody) {
        page.html_body = (useEnglish ? row.html_body_en : row.html_body) || row.html_body || '';
    }
    return page;
}

async function listPages(lang = 'ko') {
    // List consumers never render bodies (localize includeBody=false), so keep
    // the TOASTed html columns out of the query and derive the flag in SQL.
    const { rows } = await db.query(
        `SELECT slug, title, summary, title_en, summary_en,
                created_at, updated_at,
                btrim(COALESCE(html_body_en, '')) <> '' AS has_en_body
           FROM static_pages
          ORDER BY updated_at DESC, slug ASC`
    );
    return rows.map(row => localize(row, lang, false));
}

async function getPage(slug, lang = 'ko') {
    if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug || '')) return null;
    const { rows } = await db.query(
        `SELECT slug, title, summary, html_body, title_en, summary_en, html_body_en,
                created_at, updated_at
           FROM static_pages
          WHERE slug = $1
          LIMIT 1`,
        [slug]
    );
    return localize(rows[0], lang, true);
}

// Pages whose shown title, summary or body contains every search term, with
// a stretch of the body around the first term (see searchResearchDocuments).
async function searchPages(lang, terms) {
    if (!terms.length) return [];
    const localized = column => `CASE WHEN use_en THEN COALESCE(NULLIF(${column}_en, ''), ${column}) ELSE ${column} END`;
    const params = likePatterns(terms);
    const { rows } = await db.query(
        `SELECT slug,
                substring(body FROM greatest(1, strpos(lower(body), $${params.length + 1}) - 150) FOR 600) AS body_window
           FROM (SELECT slug,
                        concat_ws(' ', ${localized('title')}, ${localized('summary')}) AS head,
                        COALESCE(${localized('html_body')}, '') AS body
                   FROM (SELECT *, $${params.length + 2} = 'en' AND btrim(COALESCE(html_body_en, '')) <> '' AS use_en
                           FROM static_pages) page) page
          WHERE ${likeClause("concat_ws(' ', head, body)", terms)}`,
        [...params, terms[0], lang === 'en' ? 'en' : 'ko']
    );
    return rows;
}

module.exports = {
    listPages,
    getPage,
    searchPages,
};
