const allStrings = require('../../config/strings');
const { renderAppView } = require('../../utils/render-app-view');
const { paginateList } = require('./list-pagination');
const { getLinkIndexes, createLinker, createCardTextLinker } = require('./linkify');
const { roleIconSvg, roleHubHref } = require('./role-icons');
const { flagImg } = require('./flag-icons');
const { nationalityHubHref } = require('./nationality-filter');
const { sortPeopleChronologically, localizedPersonSections } = require('./people-view');

// Card prose (epithet, moment, bio) on the list and hub pages. Person names
// only — see the `card` surface in linkify.js — with one seen-set per card, and
// a fresh set of linkers per request.
async function cardTextLinker(res) {
    return createCardTextLinker(await getLinkIndexes(res.locals.lang));
}

// /people is served as a light shell (search box, institution index, group
// headers) — ~8MB of person-card markup no longer ships with the page. The
// cards load per group on demand from /people/cards?group=<id>; each group
// fragment is memoized per (standardized, link indexes), so it is rendered
// once per data refresh per language, not per request.
const peopleGroupCardsMemo = new WeakMap(); // standardized -> { indexesRef, byGroup: Map }

// The people snapshot and link indexes both determine the rendered body.
const personBodyMemo = new WeakMap(); // snapshot -> WeakMap(indexes -> Map(personId -> body))

// `page` cuts the group to one page of cards (list-pagination.js) and appends
// the site's pager, which the people shell redraws the group from; without
// it the whole group is returned for existing fragment consumers.
const PEOPLE_CARDS_BASE = group => `/commulingo/people/cards?group=${encodeURIComponent(group.id)}&page=`;

async function peopleGroupCardsHtml(req, standardized, lang, group, page, baseUrl) {
    const indexes = await getLinkIndexes(lang);
    let memo = peopleGroupCardsMemo.get(standardized);
    if (!memo || memo.indexesRef !== indexes) {
        memo = { indexesRef: indexes, byGroup: new Map() };
        peopleGroupCardsMemo.set(standardized, memo);
    }
    const sorted = sortPeopleChronologically(group.people);
    const pagerBase = baseUrl || PEOPLE_CARDS_BASE(group);
    const pagination = page
        ? paginateList(sorted, sorted, { page }, pagerBase, { mark: false })
        : null;
    const key = pagination ? `${group.id}\0${pagination.current}\0${pagerBase}` : group.id;
    let html = memo.byGroup.get(key);
    if (!html) {
        // req.app.render knows app.locals only, so the per-language string
        // table every view otherwise gets from res.locals is passed by hand.
        html = await renderAppView(req, 'partials/commulingo-people-group-cards', {
            strings: allStrings[lang],
            people: pagination ? pagination.pageItems : sorted,
            groupId: group.id,
            en: lang === 'en',
            roleIconSvg,
            roleHubHref,
            flagImg,
            nationalityHubHref,
            linkifyPersonText: createCardTextLinker(indexes),
        });
        if (pagination) {
            html += await renderAppView(req, 'partials/commulingo-list-pager', {
                strings: allStrings[lang],
                pagination,
                target: `.commu-people-group.is-${group.id} .commu-people-grid`,
                en: lang === 'en',
            });
        }
        memo.byGroup.set(key, html);
    }
    return html;
}

async function personBody(personId, person, loaded, lang) {
    // Link the intro and sections once for each snapshot and index generation.
    const indexes = await getLinkIndexes(lang);
    let byIndexes = personBodyMemo.get(loaded.data);
    if (!byIndexes) {
        byIndexes = new WeakMap();
        personBodyMemo.set(loaded.data, byIndexes);
    }
    let personPages = byIndexes.get(indexes);
    if (!personPages) {
        personPages = new Map();
        byIndexes.set(indexes, personPages);
    }
    let body = personPages.get(personId);
    if (!body) {
        const rawSections = (loaded.data.sections || {})[personId] || [];
        const sections = localizedPersonSections(rawSections, lang);
        // One linker and seen-set for the whole page; exclude the person itself.
        const link = createLinker(indexes, {
            surface: 'person',
            exclude: { person: person.id },
        });
        const introContext = { contextText: [person.epithet, person.moment, person.bio].filter(Boolean).join(' ') };
        const epithetHtml = link.plain(person.epithet, introContext);
        const momentHtml = link.plain(person.moment, introContext);
        const bioHtml = link.plain(person.bio, introContext);
        sections.forEach(section => {
            section.bodyHtml = link.html(section.bodyHtml);
        });
        body = { epithetHtml, momentHtml, bioHtml, sections };
        personPages.set(personId, body);
    }
    return body;
}

// The API payload is large; serialization changes only with the snapshot or source.
const peopleApiMemo = new WeakMap(); // standardized -> Map(source -> JSON string)

function peopleApiBody(loaded, standardized) {
    let bySource = peopleApiMemo.get(standardized);
    if (!bySource) {
        bySource = new Map();
        peopleApiMemo.set(standardized, bySource);
    }
    let body = bySource.get(loaded.source);
    if (!body) {
        body = JSON.stringify({
            schemaVersion: standardized.schemaVersion,
            source: loaded.source,
            lang: standardized.lang,
            peopleCount: standardized.people.length,
            people: standardized.people,
            groups: standardized.groups.map(group => ({
                id: group.id,
                range: group.range,
                title: group.title,
                blurb: group.blurb,
                people: group.people.map(person => person.id),
            })),
        });
        bySource.set(loaded.source, body);
    }
    return body;
}

module.exports = { cardTextLinker, peopleGroupCardsHtml, personBody, peopleApiBody };
