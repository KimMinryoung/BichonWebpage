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

function normalize(row) {
    if (!row) return null;
    return {
        ...row,
        tags: normalizeTags(row.tags),
    };
}

async function listHubCurations({ limit = 20, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 200);
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);
    const { rows } = await db.query(
        `SELECT id, slug, title, source_url, source_title, source_author,
                source_publication, source_published_at,
                selection_rationale, context, tags, published_at
           FROM hub_curations
          ORDER BY published_at DESC, id DESC
          LIMIT $1 OFFSET $2`,
        [safeLimit, safeOffset]
    );
    return rows.map(normalize);
}

async function countHubCurations() {
    const { rows } = await db.query('SELECT COUNT(*)::int AS total FROM hub_curations');
    return rows[0] ? parseInt(rows[0].total, 10) : 0;
}

async function getHubCuration(slug) {
    if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(slug || '')) return null;
    const { rows } = await db.query(
        `SELECT id, slug, title, source_url, source_title, source_author,
                source_publication, source_published_at,
                selection_rationale, context, tags, published_at
           FROM hub_curations
          WHERE slug = $1
          LIMIT 1`,
        [slug]
    );
    return normalize(rows[0]);
}

module.exports = {
    listHubCurations,
    countHubCurations,
    getHubCuration,
};
