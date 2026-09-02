const cache = require('../config/report-cache');
const researchStore = require('../config/research-store');

// The published research list (Redis-warm, DB otherwise), the slug set the
// renderer links against, and the series (연재) prev/next navigation.

function researchSeriesIdentity(item) {
    const episode = Number(item && item.series_order);
    if (!item || !item.series_slug || !Number.isInteger(episode) || episode < 1) return null;
    return {
        episode,
        label: item.series_title || item.series_slug,
        key: item.series_slug,
    };
}

function buildResearchSeriesNav({ current, items, lang }) {
    const currentIdentity = researchSeriesIdentity(current);
    if (!currentIdentity) return null;

    const seriesItems = (items || [])
        .map(item => {
            const identity = researchSeriesIdentity(item);
            if (!identity || identity.key !== currentIdentity.key) return null;
            const slug = item.slug || String(item.filename || '').replace(/\.md$/, '');
            return {
                title: item.title || slug.replace(/[-_]+/g, ' '),
                href: `/reports/research/${slug}`,
                episode: identity.episode,
                modified: (item.modified_at || 0) * 1000,
                current: slug === current.slug,
            };
        })
        .filter(Boolean)
        .sort((a, b) => (a.episode - b.episode) || (a.modified - b.modified) || a.title.localeCompare(b.title, lang));

    if (seriesItems.length < 2 || !seriesItems.some(item => item.current)) return null;

    const currentIndex = seriesItems.findIndex(item => item.current);
    return {
        title: currentIdentity.label || (lang === 'en' ? 'Series' : '연재'),
        items: seriesItems,
        previous: currentIndex > 0 ? seriesItems[currentIndex - 1] : null,
        next: currentIndex < seriesItems.length - 1 ? seriesItems[currentIndex + 1] : null,
    };
}

// The full published list, from Redis when it is warm (10 minute TTL, shared
// with the listing page) and from the database otherwise. Three call sites want
// it: the series nav, the listing, and the slug set below.
async function cachedResearchList(lang) {
    const cached = await cache.getResearchList(lang);
    if (cached) return cached;
    const items = await researchStore.listResearch(lang);
    await cache.setResearchList(items, lang);
    return items;
}

// Slugs a report may link to. Reports reference their predecessors by slug and
// slugs get renamed or never published, so the renderer checks against this
// before emitting an anchor. Undefined when the list cannot be loaded, which
// leaves the links exactly as written.
async function publishedReportSlugs(lang) {
    try {
        const items = await cachedResearchList(lang);
        const slugs = new Set();
        (items || []).forEach(item => {
            if (!item) return;
            // Links in the corpus use either form, and the route resolves both.
            if (item.slug) slugs.add(String(item.slug).replace(/\.md$/, ''));
            if (item.filename) slugs.add(String(item.filename).replace(/\.md$/, ''));
        });
        return slugs;
    } catch (err) {
        console.error('[reports] published slug list failed:', err.message);
        return undefined;
    }
}

async function researchSeriesNavFor(current, lang) {
    return buildResearchSeriesNav({ current, items: await cachedResearchList(lang), lang });
}

module.exports = { cachedResearchList, publishedReportSlugs, researchSeriesNavFor };
