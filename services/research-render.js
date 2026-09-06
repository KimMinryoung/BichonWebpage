const { compileResearchBody, researchMarkdown } = require('./research-body');
const seo = require('../utils/seo');
const { stripFirstHeading, titleFromMarkdown } = require('../utils/markdown');
const { getReportLinkContext } = require('../data/commulingo/report-links');
const { publishedReportSlugs } = require('./research-series');

// Rendering a research report: markdown → sanitized HTML → CommuLingo
// links, memoized per link-index generation, then res.render with the
// related-entries panel data.

async function renderResearch(res, { filename, slug, pagePath, data, seriesNav = null }) {
    const markdown = researchMarkdown(data);
    const title = data.title || titleFromMarkdown(markdown, slug.replace(/_/g, ' '));
    const lang = res.locals.lang === 'en' ? 'en' : 'ko';

    const knownSlugs = await publishedReportSlugs(lang);
    const indexes = await getReportLinkContext(lang).catch(() => null);
    const linked = compileResearchBody(data, indexes, knownSlugs);
    const htmlBody = linked.html;
    const relatedPeople = linked.people;
    const relatedEvents = linked.events;
    const relatedTopics = linked.topics;
    const relatedTerms = linked.terms;
    const relatedDocs = linked.docs;
    const pageDescription = seo.excerpt(markdown || data.summary || data.excerpt || data.html_body || data.htmlBody || '', 160);
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
