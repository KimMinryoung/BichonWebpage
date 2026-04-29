const db = require('./database');

function hasEnglish(row) {
    return Boolean(row && row.html_body_en && row.html_body_en.trim());
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
    const { rows } = await db.query(
        `SELECT slug, title, summary, html_body, title_en, summary_en, html_body_en,
                created_at, updated_at
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

module.exports = {
    listPages,
    getPage,
};
