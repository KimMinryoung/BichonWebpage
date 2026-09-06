const nameContext = require('../../public/js/commulingo-name-context');
// The one linking policy for every CommuLingo surface: the person, glossary,
// and history dictionaries, learning content, person cards, and research
// reports.
//
// Each surface used to carry its own pipeline. The person page linked
// documents, people, and terms; the glossary and history pages linked documents
// and terms only; learning content linked four kinds in a fourth order; reports
// linked events, terms, topics, and people and no documents at all. A reader met
// a different rule on every page, and adding an entry meant remembering four
// separate wirings — the Winter War entry went live linked from exactly one of
// them.
//
// What now holds everywhere:
//   * Passes retain KIND_ORDER for compatibility. This is not a semantic or
//     string-length ranking: expression policy and person context gate matches.
//     Later passes skip anchor contents, preserving explicit links.
//   * The first mention of an entry links and later ones stay plain, per linker.
//     One linker covers one reading unit: a person page's bio and all its
//     sections, a term's definition and body, an event's summary and timeline,
//     one lesson passage, one card, one report.
//   * Korean refuses a match glued to a preceding word character (no \b), the
//     guard the per-kind indexes were already built around.
//   * A page never links to itself, and never to the other half of a
//     same-subject pair it is already showing (exclude).
//   * Text inside <a>, <code>, <pre>, <script>, <style> is never touched.
//
// A surface may differ in four declared ways and nothing else — which kinds it
// links, whether links open in a new tab, whether first mentions carry a
// mention-anchor id, and whether linked entries are collected for a
// related-entries panel. Those differences live in SURFACES below, and adding a
// fifth kind of difference should feel like the mistake it is.

const {
    WORD_CHAR,
    escapeHtml,
    mapLinkableText,
    buildPersonLinkIndex,
} = require('./people-linkify');
const { buildEventLinkIndex } = require('./event-linkify');
const { buildTermLinkIndex } = require('./term-linkify');
const { buildDocLinkIndex } = require('./doc-linkify');
const { buildTopicLinkIndex } = require('./topic-linkify');
const { loadCommuLingoPeople } = require('./people-store');
const { loadCommuLingoTerms } = require('./terms-store');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { listCommuLingoDocs } = require('./docs-store');
const { loadCommuLingoCatalog } = require('./shards');
const { normalizeCommuLingoPeople } = require('./people-standard');
const { loadLinkBlocklist, blocklistRef, blockedPhrases } = require('./link-blocklist');

// Historical pass order; cross-dictionary collisions still require review.
const KIND_ORDER = ['doc', 'event', 'term', 'topic', 'person'];

// How each kind renders one link, and the plural bucket its entries collect
// into. The entry shapes are whatever the per-kind index builders already hand
// out; this table is the only place that reads their fields.
const KIND_SPECS = {
    doc: {
        className: 'commu-doc-link',
        collect: 'docs',
        anchorKind: () => 'doc',
        href: entry => entry.href,
        title: entry => (entry.note ? entry.label + ' · ' + entry.note : entry.label),
    },
    event: {
        className: 'commu-event-link',
        collect: 'events',
        anchorKind: () => 'event',
        href: entry => '/commulingo/events/' + encodeURIComponent(entry.id),
        title: entry => (entry.period ? entry.period + ' · ' + entry.title : entry.title),
    },
    term: {
        className: 'commu-term-link',
        collect: 'terms',
        anchorKind: () => 'term',
        href: entry => entry.href,
        title: entry => (entry.original ? entry.label + ' · ' + entry.original : entry.label),
    },
    topic: {
        // Role categories and offices share one kind here and split by
        // entry.kind ('role' / 'office') in their anchor ids and hrefs.
        className: 'commu-topic-link',
        collect: 'topics',
        anchorKind: entry => entry.kind,
        href: entry => entry.href,
        title: entry => entry.label,
    },
    person: {
        className: 'commu-person-link',
        collect: 'people',
        // People carry the bare 'mention-<id>' anchor, the form
        // services/report-mentions.js has been deep-linking to since before the
        // other kinds had anchors at all.
        anchorKind: () => '',
        href: entry => '/commulingo/people/' + encodeURIComponent(entry.id),
        title: entry => {
            const label = entry.displayName || entry.name || '';
            return entry.epithet ? label + ': ' + entry.epithet : label;
        },
    },
};

// The per-surface differences, in full.
//
//   kinds   — which dictionaries this surface's prose points at.
//   newTab  — learning content only. A reader who follows a name out of a
//             concept brief has to come back to the lesson they were in, and the
//             book is a single page whose quiz position and answered state do
//             not survive a navigation.
//   anchors — reports only. The first mention carries an id so a person or event
//             page can deep-link into the report at the spot that names it
//             (services/report-mentions.js).
//
// Every linker reports what it linked in `.found`, whether or not the caller
// reads it: the report page builds its related-entries panel from it, and the
// book page its dictionary chips. Neither has to re-parse the HTML it was just
// handed.
//
// Cards are the one surface that links a single kind: they are three-line
// snippets rendered a few hundred to a page, where a full pass would cost a
// grid of blue and the card's job is to move the reader between people anyway.
const SURFACES = {
    person: { kinds: KIND_ORDER },
    term: { kinds: KIND_ORDER },
    event: { kinds: KIND_ORDER },
    learning: { kinds: KIND_ORDER, newTab: true },
    report: { kinds: KIND_ORDER, anchors: true },
    // Reference-library full texts. A reader meeting 체르보네츠 or 가위차 inside a
    // 1923 document needs the glossary exactly there, the same as on any other
    // prose surface — the topbar's curated list only covers what the manifest
    // declares. Signatory names the fragment links by hand are already inside
    // anchors, which every pass skips.
    doc: { kinds: KIND_ORDER },
    card: { kinds: ['person'] },
};

// Anchor ids marking an entity's first mention: person 'mention-<id>', event
// 'mention-event-<id>', classification 'mention-<role|office>-<id>'.
function mentionAnchor(kind, id) {
    return 'mention-' + (kind ? kind + '-' : '') + id;
}

const ENTITY_ANCHOR_RE = /<a class="commu-(?:person|term|event|doc|topic)-link"/g;

function openEntityLinksInNewTab(html) {
    return String(html || '').replace(
        ENTITY_ANCHOR_RE, match => match.replace('<a ', '<a target="_blank" rel="noopener" '),
    );
}

// normalizeCommuLingoPeople (500+ people) and the person link index are pure
// functions of the people snapshot + catalog, which change only on the store's
// ~10-min refresh. Memoized by those object references so every caller — the
// dictionary routes, the report linker, this module's index builder — shares one
// copy and rebuilds at most once per refresh. A fresh snapshot (?fresh=1) is a
// new reference and invalidates the memo by itself.
let stdMemo = { dataRef: null, catalogRef: null, blocklistRef: null, byLang: {} };

function standardizedFor(data, catalog, lang) {
    // personIndex is built from the blocklist, so a changed blocklist is a
    // changed index — the same reason the data and catalog references are here.
    const blocklist = blocklistRef();
    if (stdMemo.dataRef !== data || stdMemo.catalogRef !== catalog
        || stdMemo.blocklistRef !== blocklist) {
        stdMemo = { dataRef: data, catalogRef: catalog, blocklistRef: blocklist, byLang: {} };
    }
    let entry = stdMemo.byLang[lang];
    if (!entry) {
        const standardized = normalizeCommuLingoPeople(data, { lang, catalog });
        // One index over all people, with no excludeId: self-links are dropped
        // at replace time so the same index serves every person's page.
        entry = stdMemo.byLang[lang] = {
            standardized,
            personIndex: buildPersonLinkIndex(standardized.people, { lang }),
        };
    }
    return entry;
}

// One index set per language, memoized against the five source references.
let indexMemo = {
    peopleRef: null, catalogRef: null, termsRef: null, eventsRef: null, docsRef: null,
    blocklistRef: null, byLang: {},
};

async function getLinkIndexes(lang) {
    const safeLang = lang === 'en' ? 'en' : 'ko';
    const catalog = loadCommuLingoCatalog();
    const docs = listCommuLingoDocs();
    const [loaded, terms, events, blocklist] = await Promise.all([
        loadCommuLingoPeople(),
        loadCommuLingoTerms(),
        loadCommuLingoHistoryEvents(),
        loadLinkBlocklist(),
    ]);
    if (indexMemo.peopleRef !== loaded.data || indexMemo.catalogRef !== catalog
        || indexMemo.termsRef !== terms || indexMemo.eventsRef !== events
        || indexMemo.docsRef !== docs || indexMemo.blocklistRef !== blocklist) {
        indexMemo = {
            peopleRef: loaded.data, catalogRef: catalog, termsRef: terms,
            eventsRef: events, docsRef: docs, blocklistRef: blocklist, byLang: {},
        };
    }
    let entry = indexMemo.byLang[safeLang];
    if (!entry) {
        const { standardized, personIndex } = standardizedFor(loaded.data, catalog, safeLang);
        entry = indexMemo.byLang[safeLang] = {
            lang: safeLang,
            standardized,
            doc: buildDocLinkIndex(docs, { lang: safeLang }),
            event: buildEventLinkIndex(events, { lang: safeLang }),
            term: buildTermLinkIndex(terms, { lang: safeLang }),
            topic: buildTopicLinkIndex(standardized, { lang: safeLang }),
            person: personIndex,
        };
    }
    return entry;
}

// One linker = one reading unit. `exclude` is keyed by kind
// ({ person: 'stalin', term: 'nep', event: 'new-economic-policy' }): the entry
// the page is already showing, and the same-subject twin it is showing beside
// it.
//
// `blockStrings` is an array of exact strings this reading unit refuses to
// auto-link in any pass — the per-page escape hatch for words that are right
// almost everywhere but wrong here. 임시정부 fires 199 times in this corpus and
// is the Russian Provisional Government in essentially all of them, so it stays
// in the index; the one French document where it means the GPRF declares
// `noAutoLink: ["임시정부"]` in docs/manifest.json instead of the corpus losing
// the alias. (Strings that are wrong almost everywhere belong in
// commulingo_link_blocklist, not here.)
function createLinker(indexes, options = {}) {
    const surface = SURFACES[options.surface];
    if (!surface) throw new Error('linkify: unknown surface ' + options.surface);
    const exclude = options.exclude || {};
    const blockStrings = new Set(options.blockStrings || []);
    const seen = new Set();
    const found = { docs: [], events: [], terms: [], topics: [], people: [] };
    const foundKeys = new Set();
    const links = [];
    let lastPersonText, lastPersonContext;
    const passes = surface.kinds
        .map(kind => ({ kind, spec: KIND_SPECS[kind], index: indexes && indexes[kind] }))
        .filter(pass => pass.index);

    function replacerFor({ kind, spec, index }, context, extraContext) {
        const contextText = extraContext || context.text;
        const localOffset = extraContext ? extraContext.indexOf(context.text) : 0;
        if (kind === 'person' && index.context && contextText !== lastPersonText) {
            lastPersonText = contextText;
            lastPersonContext = nameContext.analyze(contextText, index.context);
        }
        const personContext = kind === 'person' && index.context
            ? lastPersonContext : null;
        const identities = new Set();
        if (index.identityAliases) {
            contextText.replace(index.pattern, (match, _token, offset) => {
                const id = index.identityAliases[match];
                const expression = id && index.expressions?.[id + ':' + match];
                if (id && index.byAlias[match]?.id === id && expression?.policy !== 'context' && nameContext.boundary(contextText, offset, offset + match.length, index.en)) identities.add(id);
                return match;
            });
        }
        return function replacer(match, _token, offset, source) {
            // No \b in Korean: refuse a match glued to a preceding word char, so
            // 블라디미르 does not link its trailing …미르.
            if (!index.en) {
                const prev = offset > 0 ? source.charAt(offset - 1) : '';
                if (WORD_CHAR.test(prev)) return match;
            }
            let entry = index.byAlias[match];
            let expression = entry && index.expressions?.[entry.id + ':' + match];
            if (personContext) {
                const start = Math.max(0, localOffset) + context.offset + offset;
                const id = nameContext.resolve(match, entry && entry.id, start, contextText,
                    index.context, personContext, expression?.policy);
                entry = id && index.byId[id];
                expression = entry && index.expressions?.[entry.id + ':' + match];
            } else if (expression?.policy === 'context' && !identities.has(entry.id)) return match;
            if (!entry || expression?.policy === 'search') return match;
            if (blockStrings.has(match)) return match;
            if (exclude[kind] && exclude[kind] === entry.id) return match;
            const key = kind + ':' + (kind === 'topic' ? entry.kind + ':' : '') + entry.id;
            if (seen.has(key)) return match;
            seen.add(key);
            return '<a class="' + spec.className + '"'
                + ' href="' + spec.href(entry)
                + '" title="' + escapeHtml(spec.title(entry)) + '">' + match + '</a>';
        };
    }

    function run(html, textOptions = {}) {
        let out = html;
        passes.forEach(pass => {
            out = mapLinkableText(out, (text, context) => text.replace(pass.index.pattern,
                replacerFor(pass, context, textOptions.contextText && escapeHtml(textOptions.contextText))));
        });
        const collected = require('./linked-entities').collectLinkedEntities(out, indexes, { anchors: surface.anchors });
        for (const bucket of Object.keys(found)) {
            for (const entry of collected[bucket]) {
                const key = bucket + ':' + (bucket === 'topics' ? entry.kind + ':' : '') + entry.id;
                if (!foundKeys.has(key)) { foundKeys.add(key); found[bucket].push(entry); }
            }
        }
        links.push(...collected.links);
        return surface.newTab ? openEntityLinksInNewTab(collected.html) : collected.html;
    }

    return {
        // Raw prose in, linked HTML out: escapes first, so the passes never see
        // markup they did not create.
        plain(text, textOptions) {
            return run(escapeHtml(text || ''), textOptions);
        },
        // Already-rendered HTML in (a markdown body, a report), linked HTML out.
        html(value) {
            return value ? run(String(value)) : '';
        },
        found,
        links,
    };
}

// Cards share one seen-set per person, so a name used in the epithet and again
// in the bio below it links once. Returns the (text, personId) => html callback
// the card partial calls.
// Card prose links identically on every card surface (people list, office,
// role, and nationality pages) and only changes when the dictionaries do, so
// the rendered HTML is memoized per (indexes, personId, text) — built once
// per data refresh instead of ~3600 regex passes per request.
const cardTextMemo = new WeakMap(); // indexes -> Map('personId\0text' -> html)

function createCardTextLinker(indexes) {
    let rendered = cardTextMemo.get(indexes);
    if (!rendered) {
        rendered = new Map();
        cardTextMemo.set(indexes, rendered);
    }
    const byPerson = new Map();
    return function linkCardText(text, personId) {
        const key = personId + '\0' + (text || '');
        let html = rendered.get(key);
        if (html === undefined) {
            let linker = byPerson.get(personId);
            if (!linker) {
                linker = createLinker(indexes, { surface: 'card', exclude: { person: personId } });
                byPerson.set(personId, linker);
            }
            const person = indexes.person?.byId?.[personId];
            const contextText = person && [person.epithet, person.moment, person.bio].filter(Boolean).join(' ');
            html = linker.plain(text, { contextText });
            rendered.set(key, html);
        }
        return html;
    };
}

// The decision-history book renders its episodes in the browser
// (public/js/commulingo-decision.js), so it cannot call a linker — it gets the
// index shipped to it instead. Aliases here have already been through
// buildPersonLinkIndex, so the client applies this policy rather than keeping a
// hand-synced copy of it; `blocked` is the Korean compound list the client's
// alternation still has to consume first.
const clientPayloadMemo = new WeakMap(); // indexes -> payload

function clientPersonLinkPayload(indexes) {
    const index = indexes && indexes.person;
    if (!index) return { blocked: [], people: [] };
    const cached = clientPayloadMemo.get(indexes);
    if (cached) return cached;
    const byId = new Map();
    Object.keys(index.byAlias).forEach(alias => {
        const entry = index.byAlias[alias];
        if (!entry) return;
        let person = byId.get(entry.id);
        if (!person) {
            person = {
                id: entry.id,
                name: entry.displayName || entry.name || '',
                epithet: entry.epithet || '',
                aliases: [],
            };
            byId.set(entry.id, person);
        }
        person.aliases.push(alias);
    });
    Object.values(index.contextData?.shorts || {}).flat().forEach(id => {
        if (byId.has(id) || !index.byId[id]) return;
        const entry = index.byId[id];
        byId.set(id, { id, name: entry.displayName || entry.name || '', epithet: entry.epithet || '', aliases: [] });
    });
    const payload = { blocked: index.en ? [] : blockedPhrases('ko'), people: [...byId.values()], contextData: index.contextData, expressions: index.expressions };
    clientPayloadMemo.set(indexes, payload);
    return payload;
}


module.exports = {
    KIND_ORDER,
    KIND_SPECS,
    SURFACES,
    mentionAnchor,
    openEntityLinksInNewTab,
    standardizedFor,
    getLinkIndexes,
    createLinker,
    createCardTextLinker,
    clientPersonLinkPayload,
};
