// A person's Wikidata item (migration 376, 2026-11-03). One QID maps the card
// to every Wikipedia article (sitelinks) and to Wikidata's own statements, so
// later data work (dates, names, offices) can look the person up directly
// instead of matching by name. Article URLs are not stored: they follow from
// the QID.

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

// 'Q123', 'q123' or 'https://www.wikidata.org/wiki/Q123' -> 'Q123'; null clears.
function normalizeWikidataId(value) {
    if (value === null || value === '') return null;
    const match = typeof value === 'string'
        && value.trim().match(/^(?:https?:\/\/(?:www\.|m\.)?wikidata\.org\/(?:wiki|entity)\/)?([Qq][1-9]\d{0,11})$/);
    if (!match) throw badRequest('wikidataId must be a Wikidata item id such as Q1394');
    return match[1].toUpperCase();
}

function wikidataUrl(qid) {
    return qid ? `https://www.wikidata.org/wiki/${qid}` : null;
}

module.exports = { normalizeWikidataId, wikidataUrl };
