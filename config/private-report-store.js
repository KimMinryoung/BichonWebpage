const db = require('./database');

// Private (unpublished) research reports from research_documents, listed and
// fetched for the admin listing and the /reports/private/:slug reader.
// stripMarkdown/excerpt here differ from config/research-store.js's (no
// horizontal-rule stripping, different blank-line handling), so they stay
// separate rather than change the excerpts.

function timestampSeconds(value) {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? Math.floor(time / 1000) : 0;
}

function stripMarkdown(content) {
    return String(content || '')
        .replace(/^#\s+.+$/m, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*(작성자|작성일|Author|Date)\s*:.*$/gim, '')
        .replace(/^\s*>.*$/gm, '')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function excerpt(content, limit = 220) {
    const text = stripMarkdown(content);
    return text.length > limit ? text.substring(0, limit) + '...' : text;
}

function privateReportFromRow(row, includeContent = false) {
    if (!row) return null;
    const markdown = row.markdown || '';
    const data = {
        id: row.id,
        slug: row.slug,
        title: row.title || row.slug,
        summary: row.summary || '',
        excerpt: row.summary || (markdown ? excerpt(markdown) : ''),
        size: row.markdown_size || Buffer.byteLength(markdown, 'utf8'),
        modified_at: timestampSeconds(row.updated_at || row.created_at),
        created_at: row.created_at,
        updated_at: row.updated_at,
        content_sha256: row.content_sha256,
        source_task_id: row.source_task_id,
        published_research_id: row.published_research_id,
        private: true,
    };
    if (includeContent) {
        data.content = markdown;
        data.markdown = markdown;
    }
    return data;
}

async function listPrivateReports() {
    const { rows } = await db.query(
        `SELECT id, slug, title, summary, source_task_id,
                NULL::BIGINT AS published_research_id,
                content_sha256, published_at AS created_at, updated_at,
                OCTET_LENGTH(markdown) AS markdown_size
           FROM research_documents
          WHERE status = 'private'
          ORDER BY updated_at DESC, id DESC
          LIMIT 200`
    );
    return rows.map(row => privateReportFromRow(row, false));
}

async function getPrivateReport(slug) {
    const { rows } = await db.query(
        `SELECT id, slug, title, summary, markdown, source_task_id,
                NULL::BIGINT AS published_research_id,
                content_sha256, published_at AS created_at, updated_at
           FROM research_documents
          WHERE slug = $1 AND status = 'private'
          LIMIT 1`,
        [slug]
    );
    return privateReportFromRow(rows[0], true);
}

module.exports = { listPrivateReports, getPrivateReport };
