const { compileResearchBody, restoreResearchCache, saveResearchCache } = require('./research-body');
const { publishedReportSlugs } = require('./research-series');
// Reverse index from CommuLingo entities to the public research reports that
// link to them, powering the "related reports" sections on person and event
// pages. Built from the same compiled HTML/link result used by report pages.
// No name scanner or independently guessed mention anchors.
//
// Full texts refresh at most once per REFRESH_MS. Dictionary changes reuse
// those rows and unchanged report renders; only changed report contributions
// are removed/added to the reverse index. All work stays in the background.
// Requests never await a full build, including after startup or dictionary edits.
// Until a matching index is ready, only the optional related reports are omitted.

const researchStore = require('../config/research-store');
const { getReportLinkContext } = require('../data/commulingo/report-links');

const REFRESH_MS = Number.parseInt(process.env.REPORT_MENTIONS_REFRESH_MS || '600000', 10);
const MAX_REPORTS_PER_ENTITY = 12;

let memory = null;   // { byPerson: {ko,en}, byEvent: {ko,en}, …, at }
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
    await restoreResearchCache();
    const previous = memory;
    const fetchRows = !previous || Date.now() - previous.rowsAt >= REFRESH_MS;
    const [rows, ctxKo, ctxEn, slugsKo, slugsEn] = await Promise.all([
        fetchRows ? researchStore.listResearchTexts() : previous.rows,
        getReportLinkContext('ko'),
        getReportLinkContext('en'),
        publishedReportSlugs('ko'),
        publishedReportSlugs('en'),
    ]);
    // Kept per language rather than unioned. A report is listed on the page the
    // reader is actually on only if that language's text names the entity, so
    // the mention anchor always has something to land on — and a name the
    // Korean text never uses stops claiming to be in the Korean report. The
    // union let 172 reports' English bylines put Lenin on 165 of them.
    const maps = {};
    for (const name of ['byPerson', 'byEvent', 'byTopic', 'byTerm']) {
        maps[name] = { ko: new Map(previous?.[name].ko), en: new Map(previous?.[name].en) };
    }
    const byReport = new Map();
    const touched = new Set();
    const contributions = links => {
        const result = new Map();
        for (const link of links) {
            const mapName = { person: 'byPerson', event: 'byEvent', term: 'byTerm', role: 'byTopic', office: 'byTopic' }[link.kind];
            if (!mapName) continue;
            const id = ['role', 'office'].includes(link.kind) ? link.kind + ':' + link.id : link.id;
            const key = mapName + ':' + id;
            if (!result.has(key)) result.set(key, { mapName, id, anchorId: link.anchorId });
        }
        return [...result.values()];
    };
    const remove = record => {
        for (const { mapName, id } of record.contributions) {
            const map = maps[mapName][record.lang];
            const list = (map.get(id) || []).filter(doc => doc.slug !== record.doc.slug);
            if (list.length) map.set(id, list);
            else map.delete(id);
        }
    };
    let changedReports = 0;

    // Only affected reports pay for linkification. Yield between languages so
    // even a cold build does not monopolize the request loop for the corpus.
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const doc = docEntry(row);
        for (const lang of ['ko', 'en']) {
            await new Promise(resolve => setImmediate(resolve));
            const data = researchStore.localizeResearch(row, lang);
            const body = compileResearchBody(data, lang === 'ko' ? ctxKo : ctxEn, lang === 'ko' ? slugsKo : slugsEn);
            const key = lang + ':' + doc.slug;
            const old = previous?.byReport.get(key);
            const docSignature = JSON.stringify([doc, row.updated_at, row.published_at]);
            if (old && old.links === body.links && old.docSignature === docSignature) {
                byReport.set(key, old);
                continue;
            }
            changedReports++;
            if (old) remove(old);
            const record = { lang, doc, docSignature, links: body.links, contributions: contributions(body.links) };
            byReport.set(key, record);
            for (const { mapName, id, anchorId } of record.contributions) {
                const map = maps[mapName][lang];
                map.set(id, [...(map.get(id) || []), { ...doc, anchorId }]);
                touched.add(mapName + ':' + lang + ':' + id);
            }
        }
    }
    for (const [key, old] of previous?.byReport || []) {
        if (!byReport.has(key)) { remove(old); changedReports++; }
    }
    // Preserve the DB's newest-first ordering after edits/additions, without
    // mutating arrays still served by the previous completed index.
    const rank = new Map(rows.map((row, i) => [docEntry(row).slug, i]));
    for (const key of touched) {
        const [mapName, lang, ...parts] = key.split(':');
        const map = maps[mapName][lang], id = parts.join(':');
        if (map.has(id)) map.set(id, [...map.get(id)].sort((a, b) => rank.get(a.slug) - rank.get(b.slug)));
    }
    await saveResearchCache();
    console.log(`[report mentions] updated ${changedReports}/${rows.length * 2} report-language contributions`);
    return { ...maps, byReport, rows, rowsAt: fetchRows ? Date.now() : previous.rowsAt,
        contexts: [ctxKo, ctxEn], at: Date.now() };
}

function refresh() {
    if (pending) return pending;
    pending = buildIndex()
        .then(index => { memory = index; return index; })
        .finally(() => { pending = null; });
    return pending;
}

// An old index can contain anchors invalidated by an editorial link change.
// Omit that optional section until the replacement is ready, without making
// the main article wait for every report in both languages to be compiled.
const emptyIndex = {
    byPerson: { ko: new Map(), en: new Map() },
    byEvent: { ko: new Map(), en: new Map() },
    byTopic: { ko: new Map(), en: new Map() },
    byTerm: { ko: new Map(), en: new Map() },
};

async function getMentionsIndex() {
    const contexts = await Promise.all([getReportLinkContext('ko'), getReportLinkContext('en')]);
    const matching = memory && contexts.every((context, i) => context === memory.contexts[i]);
    if (!matching || Date.now() - memory.rowsAt >= REFRESH_MS) {
        refresh().catch(err => console.error('report mentions refresh failed:', err.message));
    }
    return matching ? memory : emptyIndex;
}

// anchor deep-links each report to the entity's first mention (the id that
// linkifyReportHtml stamps on the link). The index is keyed by language, so the
// mention that put the report in this list is in the text the reader will see.
function langOf(lang) {
    return lang === 'en' ? 'en' : 'ko';
}

function present(list, lang) {
    return (list || []).slice(0, MAX_REPORTS_PER_ENTITY).map(doc => ({
        slug: doc.slug,
        href: doc.anchorId ? doc.href + '#' + encodeURIComponent(doc.anchorId) : doc.href,
        title: (lang === 'en' ? doc.title.en : doc.title.ko) || doc.title.ko,
        dateLabel: doc.dateLabel,
    }));
}

async function getReportsForPerson(personId, lang) {
    const id = typeof personId === 'string' ? personId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byPerson[langOf(lang)].get(id), lang);
}

async function getReportsForEvent(eventId, lang) {
    const id = typeof eventId === 'string' ? eventId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byEvent[langOf(lang)].get(id), lang);
}

// kind: 'role' | 'office' (classification pages, see topic-linkify.js)
async function getReportsForTopic(kind, topicId, lang) {
    const id = typeof topicId === 'string' ? topicId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byTopic[langOf(lang)].get(kind + ':' + id), lang);
}

async function getReportsForTerm(termId, lang) {
    const id = typeof termId === 'string' ? termId.trim() : '';
    if (!id) return [];
    const index = await getMentionsIndex();
    return present(index.byTerm[langOf(lang)].get(id), lang);
}

// Startup warm-up, coalesced with any request-triggered build.
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
