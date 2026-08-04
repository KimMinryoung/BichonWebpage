// Reverse index from CommuLingo entities to the public research reports that
// mention them, powering the "related reports" sections on person and event
// pages. Built by scanning every public report's markdown (both languages) with
// the same link indexes report bodies use, so the two directions always agree.
//
// The scan costs one research_documents full-text query plus regex passes, so
// it runs at most once per REFRESH_MS: the built index is served from memory
// and refreshed in the background, mirroring the commulingo snapshot stores.
// Only the very first request after a process start awaits the build.

const researchStore = require('../config/research-store');
const { getReportLinkContext, findEntityMentions, mentionAnchor } = require('../data/commulingo/report-links');

const REFRESH_MS = Number.parseInt(process.env.REPORT_MENTIONS_REFRESH_MS || '600000', 10);
const MAX_REPORTS_PER_ENTITY = 12;

let memory = null;   // { byPerson: Map, byEvent: Map, at }
let pending = null;  // coalesced in-flight build

function dateLabel(value) {
    if (!value) return '';
    const time = new Date(value);
    if (!Number.isFinite(time.getTime())) return '';
    return time.getFullYear() + '.' + String(time.getMonth() + 1).padStart(2, '0');
}

function docEntry(row) {
    const slug = row.slug || String(row.filename || '').replace(/\.md$/, '');
    return {
        slug,
        href: `/reports/research/${slug}`,
        title: { ko: row.title || slug, en: row.title_en || row.title || slug },
        dateLabel: dateLabel(row.published_at || row.updated_at),
    };
}

async function buildIndex() {
    const [rows, ctxKo, ctxEn] = await Promise.all([
        researchStore.listResearchTexts(),
        getReportLinkContext('ko'),
        getReportLinkContext('en'),
    ]);
    const byPerson = new Map();
    const byEvent = new Map();
    const byTopic = new Map();  // keyed 'role:<id>' / 'office:<id>'
    const byTerm = new Map();
    const add = (map, id, doc) => {
        if (!map.has(id)) map.set(id, []);
        map.get(id).push(doc);
    };
    // Scanning all reports in one go blocked the event loop for ~3s (measured:
    // 172 docs × ~18ms of regex passes). Yield between docs so in-flight
    // requests interleave; the build is coalesced and served stale-while-
    // refreshing, so the longer wall-clock completion is invisible.
    for (let i = 0; i < rows.length; i++) {
        if (i > 0) await new Promise(resolve => setImmediate(resolve));
        const row = rows[i];
        const doc = docEntry(row);
        const ko = findEntityMentions(row.markdown, ctxKo);
        const en = findEntityMentions(row.markdown_en, ctxEn);
        new Set([...ko.personIds, ...en.personIds]).forEach(id => add(byPerson, id, doc));
        new Set([...ko.eventIds, ...en.eventIds]).forEach(id => add(byEvent, id, doc));
        new Set([...ko.topicIds, ...en.topicIds]).forEach(id => add(byTopic, id, doc));
        new Set([...ko.termIds, ...en.termIds]).forEach(id => add(byTerm, id, doc));
    }
    return { byPerson, byEvent, byTopic, byTerm, at: Date.now() };
}

function refresh() {
    if (pending) return pending;
    pending = buildIndex()
        .then(index => { memory = index; return index; })
        .finally(() => { pending = null; });
    return pending;
}

async function getMentionsIndex() {
    if (memory) {
        if (Date.now() - memory.at >= REFRESH_MS) refresh().catch(() => {});
        return memory;
    }
    return refresh();
}

// anchor deep-links each report to the entity's first mention (the id that
// linkifyReportHtml stamps on the link). If the mention only exists in the
// other language's text, the fragment simply has no target and the page opens
// at the top — harmless.
function present(list, lang, anchor) {
    return (list || []).slice(0, MAX_REPORTS_PER_ENTITY).map(doc => ({
        slug: doc.slug,
        href: anchor ? doc.href + '#' + anchor : doc.href,
        title: (lang === 'en' ? doc.title.en : doc.title.ko) || doc.title.ko,
        dateLabel: doc.dateLabel,
    }));
}

async function getReportsForPerson(personId, lang) {
    const id = typeof personId === 'string' ? personId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byPerson.get(id), lang, mentionAnchor('', id));
}

async function getReportsForEvent(eventId, lang) {
    const id = typeof eventId === 'string' ? eventId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byEvent.get(id), lang, mentionAnchor('event', id));
}

// kind: 'role' | 'office' (classification pages, see topic-linkify.js)
async function getReportsForTopic(kind, topicId, lang) {
    const id = typeof topicId === 'string' ? topicId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byTopic.get(kind + ':' + id), lang, mentionAnchor(kind, id));
}

async function getReportsForTerm(termId, lang) {
    const id = typeof termId === 'string' ? termId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byTerm.get(id), lang, mentionAnchor('term', id));
}

// Startup warm-up (server.js): build the index in the background so the first
// person/event page request after a restart doesn't wait the ~2.5s full-text
// query. Coalesced with any request-triggered build.
function warmReportMentions() {
    refresh().catch(err => console.error('report mentions warm-up failed:', err.message));
}

module.exports = {
    getReportsForPerson,
    getReportsForEvent,
    getReportsForTopic,
    getReportsForTerm,
    warmReportMentions,
};
