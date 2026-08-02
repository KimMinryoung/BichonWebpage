const express = require('express');
const errorPage = require('../utils/error-page');
const { genealogyLinksFor } = require('../data/commulingo/genealogy-links');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');
const { listCommuLingoDocsFor } = require('../data/commulingo/docs-store');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { getReportsForEvent } = require('../services/report-mentions');
const { getLinkIndexes, createLinker } = require('../data/commulingo/linkify');

const router = express.Router();

// Reference documents (참고 문헌) linked to this event via the docs manifest.
// Failure only costs the section, never the page.
function relatedDocsForEvent(eventId, lang) {
    try {
        return listCommuLingoDocsFor('events', eventId).map(doc => ({
            id: doc.id,
            title: localize(doc.title, lang),
            kind: localize(doc.kind, lang),
        }));
    } catch (e) {
        console.error('commulingo event related docs:', e);
        return [];
    }
}

// Glossary entries that name this event. The term page has always listed its
// events; the event page listed nothing back, so a reader on 대숙청 had no way
// through to 예조프시나 or 모스크바 재판. Children are folded under their
// parent so one campaign does not spread across six sibling chips.
async function pairedTermIdFor(eventId) {
    try {
        const terms = await loadCommuLingoTerms();
        const term = terms.find(item => item.sameSubjectEvent && item.sameSubjectEvent.id === eventId);
        return term ? term.id : null;
    } catch (e) {
        console.error('commulingo event paired term:', e);
        return null;
    }
}

async function relatedTermsForEvent(eventId, lang) {
    try {
        const terms = await loadCommuLingoTerms();
        const linked = terms.filter(term => (term.events || []).some(event => event.id === eventId));
        const linkedIds = new Set(linked.map(term => term.id));
        return linked
            // The paired term is a whole panel of its own on this page, and
            // its nested entries ride along inside it.
            .filter(term => !(term.sameSubjectEvent && term.sameSubjectEvent.id === eventId))
            .filter(term => !(term.parent && linkedIds.has(term.parent.id)))
            .map(term => ({
                id: term.id,
                term: localize(term.term, lang),
                children: (term.children || [])
                    .filter(child => linkedIds.has(child.id))
                    .map(child => ({ id: child.id, term: localize(child.term, lang) })),
            }));
    } catch (e) {
        console.error('commulingo event related terms:', e);
        return [];
    }
}

function localize(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.ko || value.en || '';
}

// Related people are grouped by manner of involvement instead of one arbitrary
// list. Order runs perpetrators → leadership → participants → opposition →
// targets → witnesses → unclassified; unknown kinds fall through to the end.
// 'unclassified' is the neutral bucket for auto-linked people whose role has not
// been classified yet — never silently treat a missing kind as a victim.
const KIND_ORDER = ['executor', 'leader', 'participant', 'opponent', 'target', 'witness', 'unclassified'];
const KIND_LABELS = {
    executor: { ko: '주도 · 집행', en: 'Drivers & enforcers' },
    leader: { ko: '지도부', en: 'Leadership' },
    participant: { ko: '참여', en: 'Participants' },
    opponent: { ko: '반대 · 저항', en: 'Opposition & resistance' },
    target: { ko: '대상 · 피해', en: 'Targets & victims' },
    witness: { ko: '목격 · 증언', en: 'Witnesses' },
    unclassified: { ko: '관련 · 미분류', en: 'Involved · unclassified' },
};

function groupEventPeople(people, lang) {
    const buckets = {};
    people.forEach(person => {
        const kind = person.kind || 'unclassified';
        (buckets[kind] || (buckets[kind] = [])).push(person);
    });
    const groups = [];
    const seen = new Set();
    KIND_ORDER.forEach(kind => {
        if (buckets[kind] && buckets[kind].length) {
            groups.push({ kind, label: localize(KIND_LABELS[kind], lang), people: buckets[kind] });
            seen.add(kind);
        }
    });
    Object.keys(buckets).forEach(kind => {
        if (seen.has(kind)) return;
        groups.push({ kind, label: KIND_LABELS[kind] ? localize(KIND_LABELS[kind], lang) : kind, people: buckets[kind] });
    });
    return groups;
}

function presentEvent(raw, lang) {
    const people = (raw.people || []).map(person => ({
        ...person,
        name: localize(person.name, lang), relation: localize(person.relation, lang), note: localize(person.note, lang),
    }));
    return {
        ...raw,
        title: localize(raw.title, lang),
        question: localize(raw.question, lang),
        summary: localize(raw.summary, lang),
        outcome: localize(raw.outcome, lang),
        timeline: (raw.timeline || []).map(item => ({
            date: item.date || '', title: localize(item.title, lang), body: localize(item.body, lang),
        })),
        people,
        peopleGroups: groupEventPeople(people, lang),
    };
}

// Dictionary links inside the event's own prose, on the shared policy
// (linkify.js). One linker for the whole page, so a term named in the summary
// and again in four timeline entries is a link once, at its first mention. The
// event itself is excluded, and so is the glossary entry that is the same
// subject: that entry's panel is the other half of this page, so linking its
// name would point the reader at the tab they are already on.
async function makeEventLinkifier(lang, eventId, excludeTermId) {
    const link = createLinker(await getLinkIndexes(lang), {
        surface: 'event',
        exclude: { event: eventId, term: excludeTermId || '' },
    });
    return text => link.plain(text);
}

// Everything the event half of a page needs. Exported so the glossary route can
// render this panel beside its own when the two entries are the same subject:
// the reader switches between concept and narrative without leaving the page,
// and nothing has to be copied from one record into the other.
async function buildEventPanel(eventId, lang) {
    const events = await loadCommuLingoHistoryEvents();
    const index = events.findIndex(event => event.id === eventId);
    if (index === -1) return null;
    let relatedReports = [];
    try {
        relatedReports = await getReportsForEvent(eventId, lang);
    } catch (e) {
        console.error('commulingo event related reports:', e);
    }
    const neighbor = offset => {
        const item = events[index + offset];
        return item ? { id: item.id, period: item.period, title: localize(item.title, lang) } : null;
    };
    const terms = await loadCommuLingoTerms();
    const paired = terms.find(item => item.sameSubjectEvent && item.sameSubjectEvent.id === eventId);
    const link = await makeEventLinkifier(lang, eventId, paired ? paired.id : null);
    const event = presentEvent(events[index], lang);
    // Reading order, so the first mention that links is the first one a reader
    // reaches: question, summary, timeline, consequences.
    // These four carry the rendered prose the panel prints with <%- %>. The
    // panel has no escaped fallback on purpose: a caller that forgets them
    // should show 'undefined', not print the raw text unescaped.
    event.questionHtml = link(event.question);
    event.summaryHtml = link(event.summary);
    event.timeline = event.timeline.map(item => ({ ...item, bodyHtml: link(item.body) }));
    event.outcomeHtml = link(event.outcome);
    return {
        event,
        relatedTerms: await relatedTermsForEvent(eventId, lang),
        relatedDocs: relatedDocsForEvent(eventId, lang),
        genealogies: genealogyLinksFor('event', eventId, lang),
        relatedReports,
        prevEvent: neighbor(-1),
        nextEvent: neighbor(1),
    };
}

router.get('/', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const events = (await loadCommuLingoHistoryEvents()).map(event => presentEvent(event, lang));
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        res.render('public/commulingo-events', {
            events,
            pageTitle: lang === 'en' ? 'Historical Events — CommuLingo' : '역사 사건 — CommuLingo',
            pageDescription: lang === 'en' ? 'Events, institutions, and people in connected Soviet and revolutionary history.' : '혁명과 소련사의 사건·기관·인물을 연결해 읽는 페이지.',
            pagePath: '/commulingo/events',
        });
    } catch (err) {
        console.error('commulingo events:', err);
        res.status(500).send('Failed to load history events');
    }
});

router.get('/:eventId', async (req, res) => {
    try {
        const lang = res.locals.lang;
        const eventId = typeof req.params.eventId === 'string' ? req.params.eventId.trim() : '';
        const panel = await buildEventPanel(eventId, lang);
        if (!panel) return errorPage.notFound(res, {
            message: lang === 'en' ? 'Historical event not found.' : '역사 사건을 찾을 수 없습니다.',
            backHref: '/commulingo/events', backLabel: lang === 'en' ? 'Historical events' : '역사 사건',
        });
        const event = panel.event;
        res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
        // The glossary half, when the two entries are the same subject. Required
        // here rather than at the top of the file: the two routes reach into
        // each other and a top-level require would be a cycle.
        const { buildTermPanel } = require('./commulingo-terms');
        const pairedTerm = await pairedTermIdFor(eventId);
        res.render('public/commulingo-event', {
            ...panel,
            event,
            termPanel: pairedTerm ? await buildTermPanel(pairedTerm, lang) : null,
            activePanel: 'event',
            pageTitle: lang === 'en' ? `${event.title} — Historical Events` : `${event.title} — 역사 사건`,
            pageDescription: event.summary,
            pagePath: `/commulingo/events/${event.id}`,
        });
    } catch (err) {
        console.error('commulingo event detail:', err);
        errorPage.serverError(res, {
            message: res.locals.lang === 'en' ? 'Failed to load historical event.' : '역사 사건 정보를 불러올 수 없습니다.',
            backHref: '/commulingo/events', backLabel: res.locals.lang === 'en' ? 'Historical events' : '역사 사건',
        });
    }
});

module.exports = router;
// Attached to the router so the glossary route can build this panel. See the
// lazy require in the detail handler for why this is not a shared module.
module.exports.buildEventPanel = buildEventPanel;
