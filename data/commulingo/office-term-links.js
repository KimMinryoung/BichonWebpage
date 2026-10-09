const { loadCommuLingoTerms } = require('./terms-store');
const { localize } = require('./localize');
const { availableBodies } = require('./politburo-store');

// The links between the office pages (and Central Committee rosters) and the
// glossary. An office names its entries in commulingo_offices.term_ids, a
// roster in party-bodies.js termIds; the first is the page's own entry. An id
// with no glossary entry is skipped, so a page can name an entry before it is
// written.

// The glossary entries an office or roster page links to.
async function glossaryLinksFor(termIds, lang) {
    if (!termIds || !termIds.length) return [];
    const byId = new Map((await loadCommuLingoTerms()).map(raw => [raw.id, raw]));
    return termIds.map(id => byId.get(id)).filter(Boolean).map(raw => ({
        id: raw.id,
        term: localize(raw.term, lang),
        href: `/commulingo/terms/${encodeURIComponent(raw.id)}`,
    }));
}

// The rosters and office pages naming a glossary entry: rosters first, then
// the offices in index order (standardized.officeOrder).
function officePagesForTerm(termId, standardized, lang) {
    const order = new Map((standardized.officeOrder || []).map((id, index) => [id, index]));
    const rosters = availableBodies(lang)
        .filter(body => body.termIds.includes(termId))
        .map(body => ({ href: body.href, title: body.title, range: body.range }));
    const offices = (standardized.offices || [])
        .filter(office => (office.termIds || []).includes(termId))
        .sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999))
        .map(office => ({ href: `/commulingo/offices/${office.id}`, title: office.title, range: office.range }));
    return rosters.concat(offices);
}

module.exports = { glossaryLinksFor, officePagesForTerm };
