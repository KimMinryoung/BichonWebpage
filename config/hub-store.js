const db = require('./database');
const { searchTerms, likePatterns, likeClause, matchSnippet } = require('../utils/text-search');

function normalizeTags(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }
    return [];
}

// pg returns DATE columns as a JS Date; the view prints the value verbatim.
function isoDate(value) {
    if (!value) return value;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
    return String(value).slice(0, 10);
}

function normalize(row, lang = 'ko') {
    if (!row) return null;
    const useEnglish = lang === 'en' && Boolean(row.title_en || row.selection_rationale_en || row.context_en);
    return {
        ...row,
        title: (useEnglish ? row.title_en : row.title) || row.title,
        source_title: (useEnglish ? row.source_title_en : row.source_title) || row.source_title,
        selection_rationale: (useEnglish ? row.selection_rationale_en : row.selection_rationale) || row.selection_rationale,
        context: (useEnglish ? row.context_en : row.context) || row.context,
        source_published_at: isoDate(row.source_published_at),
        language: useEnglish ? 'en' : 'ko',
        has_translation: Boolean(row.title_en || row.selection_rationale_en || row.context_en),
        tags: normalizeTags(row.tags),
    };
}

async function listHubCurations({ limit = 20, offset = 0, lang = 'ko' } = {}) {
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);
    const { rows } = await db.query(
        `SELECT id, slug, title, source_url, source_title, source_author,
                source_publication, source_published_at,
                selection_rationale, context,
                title_en, source_title_en, selection_rationale_en, context_en,
                tags, published_at
           FROM hub_curations
          ORDER BY published_at DESC, id DESC
          LIMIT $1 OFFSET $2`,
        [safeLimit, safeOffset]
    );
    return rows.map(row => normalize(row, lang));
}

// One page of the list, newest first, with the total; a query keeps the
// curations whose shown title, source, notes or tags contain every word.
// `use_en` mirrors normalize(): English only when the curation has it.
async function searchHubCurations({ query = '', limit = 20, offset = 0, lang = 'ko' } = {}) {
    const terms = searchTerms(query);
    const localized = column => `CASE WHEN use_en THEN COALESCE(NULLIF(${column}_en, ''), ${column}) ELSE ${column} END`;
    const text = `concat_ws(' ', ${['title', 'source_title', 'selection_rationale', 'context'].map(localized).join(', ')},
                           source_author, source_publication, tags::text)`;
    const params = likePatterns(terms);
    const { rows } = await db.query(
        `SELECT id, slug, title, source_url, source_title, source_author,
                source_publication, source_published_at,
                selection_rationale, context,
                title_en, source_title_en, selection_rationale_en, context_en,
                tags, published_at, COUNT(*) OVER() AS total_count
           FROM (SELECT *, $${params.length + 1} = 'en'
                        AND (COALESCE(title_en, '') <> '' OR COALESCE(selection_rationale_en, '') <> ''
                             OR COALESCE(context_en, '') <> '') AS use_en
                   FROM hub_curations) curation
          ${terms.length ? `WHERE ${likeClause(text, terms)}` : ''}
          ORDER BY published_at DESC, id DESC
          LIMIT $${params.length + 2} OFFSET $${params.length + 3}`,
        [...params, lang === 'en' ? 'en' : 'ko', limit, offset]
    );
    const total = rows.length ? parseInt(rows[0].total_count, 10) : 0;
    const items = rows.map(({ total_count, ...row }) => {
        const item = normalize(row, lang);
        // The list shows the context; a match only in the rationale shows that.
        if (terms.length) {
            const lower = String(item.context || '').toLocaleLowerCase();
            const source = terms.some(term => lower.includes(term)) || !item.selection_rationale ? item.context : item.selection_rationale;
            item.searchExcerpt = matchSnippet(source, terms, 220);
        }
        return item;
    });
    return { items, total };
}

async function getHubCuration(slug, lang = 'ko') {
    if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(slug || '')) return null;
    const { rows } = await db.query(
        `SELECT id, slug, title, source_url, source_title, source_author,
                source_publication, source_published_at,
                selection_rationale, context,
                title_en, source_title_en, selection_rationale_en, context_en,
                tags, published_at
           FROM hub_curations
          WHERE slug = $1
          LIMIT 1`,
        [slug]
    );
    return normalize(rows[0], lang);
}

module.exports = {
    listHubCurations,
    searchHubCurations,
    getHubCuration,
};
