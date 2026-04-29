const db = require('./database');

function stripMarkdown(content) {
    if (!content) return '';
    return content
        .replace(/^#\s+.+$/m, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/^\s*(작성자|작성일|Author|Date)\s*:.*$/gim, '')
        .replace(/^\s*>.*$/gm, '')
        .replace(/^\s*-{3,}\s*$/gm, '')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        .replace(/\n{2,}/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function excerpt(content, limit = 220) {
    const text = stripMarkdown(content);
    return text.length > limit ? text.substring(0, limit) + '...' : text;
}

function titleFromMarkdown(content, fallback) {
    const match = (content || '').match(/^#\s+(.+)/m);
    return match ? match[1].trim() : fallback;
}

function timestampSeconds(value) {
    if (!value) return 0;
    const time = new Date(value).getTime();
    return Number.isFinite(time) ? Math.floor(time / 1000) : 0;
}

function localize(row, lang = 'ko', includeContent = true) {
    if (!row) return null;
    const hasEnglish = Boolean(row.has_markdown_en || (row.markdown_en && row.markdown_en.trim()));
    const useEnglish = lang === 'en' && hasEnglish;
    const markdown = useEnglish ? row.markdown_en : row.markdown;
    const title = (useEnglish ? row.title_en : row.title) || row.title || titleFromMarkdown(markdown, row.filename);
    const summary = (useEnglish ? row.summary_en : row.summary) || row.summary || '';
    const fallbackExcerpt = summary || (markdown ? excerpt(markdown) : '');

    const document = {
        filename: row.filename,
        slug: row.slug || row.filename.replace(/\.md$/, ''),
        title,
        summary,
        excerpt: fallbackExcerpt,
        size: row.markdown_size || Buffer.byteLength(markdown || '', 'utf8'),
        modified_at: timestampSeconds(row.updated_at || row.published_at),
        published_at: row.published_at,
        updated_at: row.updated_at,
        language: useEnglish ? 'en' : 'ko',
        has_translation: hasEnglish,
        available_languages: hasEnglish ? ['ko', 'en'] : ['ko'],
    };

    if (includeContent) {
        document.content = markdown || '';
        document.markdown = markdown || '';
    }

    return document;
}

async function listResearch(lang = 'ko', { limit } = {}) {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 200) : null;
    const params = [];
    let limitSql = '';
    if (safeLimit) {
        params.push(safeLimit);
        limitSql = ' LIMIT $1';
    }
    const { rows } = await db.query(
        `SELECT filename, slug, title, summary, title_en, summary_en,
                published_at, updated_at,
                OCTET_LENGTH(markdown) AS markdown_size,
                COALESCE(BTRIM(markdown_en), '') <> '' AS has_markdown_en
           FROM research_documents
          WHERE status = 'public'
          ORDER BY updated_at DESC, id DESC${limitSql}`,
        params
    );
    return rows.map(row => localize(row, lang, false));
}

async function getResearch(filenameOrSlug, lang = 'ko') {
    const raw = String(filenameOrSlug || '').trim();
    const filename = raw.endsWith('.md') ? raw : `${raw}.md`;
    const slug = raw.replace(/\.md$/, '');
    const { rows } = await db.query(
        `SELECT filename, slug, title, summary, markdown, title_en, summary_en, markdown_en,
                published_at, updated_at
           FROM research_documents
          WHERE status = 'public'
            AND (filename = $1 OR slug = $2)
          LIMIT 1`,
        [filename, slug]
    );
    return localize(rows[0], lang, true);
}

module.exports = {
    listResearch,
    getResearch,
};
