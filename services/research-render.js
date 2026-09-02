const seo = require('../utils/seo');
const { downgradeUnknownReportLinks, renderMarkdown, stripFirstHeading, titleFromMarkdown } = require('../utils/markdown');
const { sanitizeRich } = require('../utils/sanitize');
const { getReportLinkContext, linkifyReportHtml } = require('../data/commulingo/report-links');
const { publishedReportSlugs } = require('./research-series');

// Rendering a research report: markdown → sanitized HTML → CommuLingo
// links, memoized per link-index generation, then res.render with the
// related-entries panel data.

function researchMarkdown(data) {
    return data && (data.content || data.markdown || data.body || data.text || '');
}

function researchHtmlBody(data, markdown, knownSlugs) {
    // A report links its predecessors by slug, and slugs get renamed or never
    // published, so an unresolvable one renders as plain text instead of a link
    // that 404s. knownSlugs is undefined when the lookup failed, and then the
    // links are left exactly as written.
    const isKnownReport = knownSlugs ? slug => knownSlugs.has(slug) : undefined;
    const prerendered = data && (data.html_body || data.htmlBody);
    const html = prerendered
        ? downgradeUnknownReportLinks(prerendered, isKnownReport)
        : renderMarkdown(stripFirstHeading(markdown), { isKnownReport });
    return sanitizeRich(html);
}

// Rendered report bodies: markdown render + sanitize + linkify cost ~54ms per
// request on a 30KB report and are a pure function of (document, link
// indexes, known slugs), so the result is memoized until the document is
// updated, the dictionaries refresh, or the published-slug set changes size.
// Keyed on the link-index object (like personBodyMemo) so a rotated index set
// releases its whole generation of rendered bodies. A plain Map holding an
// indexesRef per report pinned old generations — each with its standardized
// people and every memo tree hung off it — until that report was next hit.
const NO_INDEXES = {}; // WeakMap key for renders done without link indexes
const researchRenderMemo = new WeakMap(); // indexes -> Map(`${filename}:${lang}` -> { updatedAt, slugCount, body })
const RESEARCH_RENDER_MEMO_MAX = 500;

async function renderResearch(res, { filename, slug, pagePath, data, seriesNav = null }) {
    const markdown = researchMarkdown(data);
    const title = data.title || titleFromMarkdown(markdown, slug.replace(/_/g, ' '));
    const lang = res.locals.lang === 'en' ? 'en' : 'ko';

    const knownSlugs = await publishedReportSlugs(lang);
    const indexes = await getReportLinkContext(lang).catch(() => null);
    const memoKey = `${filename}:${lang}`;
    const updatedAt = String(data.updated_at || data.published_at || '');
    const slugCount = knownSlugs ? knownSlugs.size : -1;
    let generation = researchRenderMemo.get(indexes || NO_INDEXES);
    if (!generation) {
        generation = new Map();
        researchRenderMemo.set(indexes || NO_INDEXES, generation);
    }
    let rendered = generation.get(memoKey);
    if (!rendered || rendered.updatedAt !== updatedAt || rendered.slugCount !== slugCount) {
        const descriptionSource = markdown || data.summary || data.excerpt || data.html_body || data.htmlBody || '';
        // Cross-link CommuLingo entities: first occurrence of each known person /
        // history-event name becomes a dictionary link, and the found entities feed
        // the related-entries panel under the body. Failure only costs the links.
        let htmlBody = researchHtmlBody(data, markdown, knownSlugs);
        let linked = { people: [], events: [], topics: [], terms: [], docs: [] };
        try {
            if (indexes) {
                linked = linkifyReportHtml(htmlBody, indexes);
                htmlBody = linked.html;
            }
        } catch (e) {
            console.error('Error linking commulingo entities:', e);
        }
        rendered = {
            updatedAt,
            slugCount,
            body: {
                htmlBody,
                pageDescription: seo.excerpt(descriptionSource, 160),
                relatedPeople: linked.people,
                relatedEvents: linked.events,
                relatedTopics: linked.topics,
                relatedTerms: linked.terms,
                relatedDocs: linked.docs,
            },
        };
        if (generation.size >= RESEARCH_RENDER_MEMO_MAX) generation.clear();
        generation.set(memoKey, rendered);
    }
    const { htmlBody, pageDescription, relatedPeople, relatedEvents, relatedTopics, relatedTerms, relatedDocs } = rendered.body;
    const hasEnglishVersion = Boolean(data.has_translation || (data.available_languages || []).includes('en'));
    const contentUrlLanguage = res.locals.urlLanguage === 'en' && hasEnglishVersion ? 'en' : 'ko';

    return res.render('public/research-view', {
        filename,
        isPrivate: Boolean(data.private),
        markdown: stripFirstHeading(markdown),
        htmlBody,
        relatedPeople,
        relatedEvents,
        relatedTopics,
        relatedTerms,
        relatedDocs,
        markdownUrl: `${pagePath}.md`,
        seriesNav,
        pageTitle: title,
        pageDescription,
        pagePath,
        hasEnglishVersion,
        robotsMeta: data.private ? 'noindex, nofollow' : undefined,
        ogType: 'article',
        jsonLd: seo.graphJsonLd(
            seo.pageJsonLd({
                type: 'Article',
                title,
                description: pageDescription,
                path: pagePath,
                datePublished: data.published_at || null,
                dateModified: data.updated_at || data.published_at || null,
                authorName: 'Cyber-Lenin',
                authorUrl: seo.absoluteUrl('/'),
                lang: contentUrlLanguage,
            }),
            seo.breadcrumbJsonLd([
                { name: contentUrlLanguage === 'en' ? 'Home' : '홈', href: '/' },
                { name: contentUrlLanguage === 'en' ? 'Reports' : '보고서', href: '/reports' },
                { name: title, href: pagePath },
            ], contentUrlLanguage),
        ),
    });
}

module.exports = { renderResearch, researchMarkdown };
