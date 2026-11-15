// A page's own name→person choices (migration 379): `person_links` on an
// event, term or person row, [{lang, text, personId, reason}]. A bare name two
// cards share (알렉세이 이사예프) links on a page only when its related people
// settle it; where they do not, the page names its bearer. The stores keep the
// well-formed entries without the reason (that stays in the row for whoever
// edits it); the page's linker reads them as `pagePeople` (linkify.js).
function personLinksOf(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(link => link && ['ko', 'en'].includes(link.lang)
        && typeof link.text === 'string' && link.text.trim().length >= 2
        && typeof link.personId === 'string' && /^[a-z0-9-]+$/.test(link.personId))
        .map(link => ({ lang: link.lang, text: link.text.trim(), personId: link.personId }));
}

// The entries for one screen language, as the linker takes them.
function pagePeopleFor(personLinks, lang) {
    return (personLinks || []).filter(link => link.lang === lang);
}

module.exports = { personLinksOf, pagePeopleFor };
