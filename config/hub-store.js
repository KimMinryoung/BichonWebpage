const db = require('./database');

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

function normalize(row, lang = 'ko') {
    if (!row) return null;
    const useEnglish = lang === 'en' && Boolean(row.title_en || row.selection_rationale_en || row.context_en);
    return {
        ...row,
        title: (useEnglish ? row.title_en : row.title) || row.title,
        source_title: (useEnglish ? row.source_title_en : row.source_title) || row.source_title,
        selection_rationale: (useEnglish ? row.selection_rationale_en : row.selection_rationale) || row.selection_rationale,
        context: (useEnglish ? row.context_en : row.context) || row.context,
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

async function countHubCurations() {
    const { rows } = await db.query('SELECT COUNT(*)::int AS total FROM hub_curations');
    return rows[0] ? parseInt(rows[0].total, 10) : 0;
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
    countHubCurations,
    getHubCuration,
};
