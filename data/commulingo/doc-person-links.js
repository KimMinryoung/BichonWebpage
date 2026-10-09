// Reference texts have their own cast. A dictionary's famous bearer of a
// surname is not evidence that the same spelling in an archive denotes them.
const { buildAliasPattern } = require('./people-linkify');
const { blockedPhrases } = require('./link-blocklist');
const { attributes, decode, walk } = require('./html-fragments');
const { parseLifeYears } = require('./person-life-years');
const { createLinker } = require('./linkify');
const nameContext = require('../../public/js/commulingo-name-context');
const { ERA_MARGIN, lifeOf, PLACE_AFTER, FAMILY_AFTER, precededByName } = require('./person-page-links');

function invalid(message) {
    const error = new Error('personLinks: ' + message);
    error.status = 400;
    throw error;
}

function validatePersonLinks(policy) {
    if (policy === undefined) return;
    if (!policy || typeof policy !== 'object' || Array.isArray(policy)) invalid('must be an object');
    const id = /^[a-z0-9-]+$/;
    for (const key of Object.keys(policy)) if (!['allowedPeople', 'names', 'period'].includes(key)) invalid('unknown field ' + key);
    if (policy.allowedPeople !== undefined && (!Array.isArray(policy.allowedPeople)
        || policy.allowedPeople.some(value => typeof value !== 'string' || !id.test(value)))) invalid('allowedPeople must be person ids');
    if (policy.names !== undefined && !Array.isArray(policy.names)) invalid('names must be an array');
    const keys = new Set();
    for (const name of policy.names || []) {
        if (!name || typeof name.text !== 'string' || name.text.length < 2 || name.text.length > 300 || name.text !== name.text.trim()
            || /[<>\n\r]/.test(name.text)) invalid('each name needs plain text');
        if (!['ko', 'en'].includes(name.lang)) invalid('each name needs lang ko/en');
        if (name.personId !== null && (typeof name.personId !== 'string' || !id.test(name.personId))) invalid('personId must be an id or null');
        if (!['identity', 'surname'].includes(name.kind)) invalid('kind must be identity/surname');
        if (name.section !== undefined && (typeof name.section !== 'string' || !name.section.trim())) invalid('section must be a heading id');
        if (typeof name.reason !== 'string' || !name.reason.trim()) invalid('each mapping needs a reason');
        const key = JSON.stringify([name.lang, name.section || '', name.text.toLowerCase()]);
        if (keys.has(key)) invalid('duplicate name mapping ' + name.text);
        keys.add(key);
    }
    if (policy.period !== undefined) {
        const { start, end } = policy.period || {};
        if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > 9999) invalid('period needs ordered start/end years');
    }
}

// h1/h2 delimit a source/chapter. Paragraphs and inline formatting do not
// erase an introduction, but a different chapter never inherits it. Use the
// whole fragment even when rendering one pagination slice.
function sectionsOf(html) {
    const sections = [];
    // Tokenize with the same quoted-attribute-safe walker, collecting exact
    // fragments rather than reserializing an archival text through a DOM.
    let start = 0;
    const tags = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g;
    let literal = 0, sectionId = '';
    for (const m of html.matchAll(tags)) {
        const info = m[0].match(/^<(\/?)\s*(\w+)/);
        if (!info) continue;
        const close = Boolean(info[1]), name = info[2].toLowerCase();
        if (!literal && !close && /^h[12]$/.test(name)) {
            if (m.index > start) sections.push({ id: sectionId, html: html.slice(start, m.index) });
            start = m.index;
            sectionId = attributes(m[0]).id || '';
        }
        if (['pre', 'code', 'script', 'style', 'textarea'].includes(name)) literal = Math.max(0, literal + (close ? -1 : 1));
    }
    if (start < html.length) sections.push({ id: sectionId, html: html.slice(start) });
    return sections;
}

function plainText(html) {
    const parts = [];
    walk(html, text => text, undefined, text => parts.push(decode(text)));
    return parts.join(' ').replace(/\s+/g, ' ');
}

function chronology(person, policy, raw) {
    const year = Number(String(raw.date || '').slice(0, 4));
    const period = policy.period || (year ? { start: year, end: year } : null);
    if (!period || !person) return [];
    const years = person.life || parseLifeYears(person.years || '');
    const birth = person.birthYear ?? years.birthYear;
    const death = person.deathYear ?? years.deathYear;
    const out = [];
    if (birth && birth > period.end) out.push('born-after-period');
    if (death && death < period.start) out.push('died-before-period');
    return out;
}

function placeQualifier(text, end) {
    const after = text.slice(end);
    return /^(?:\s*)(?:대로|거리|시(?:\s|[,.]|$)|도시|마을|공장|역(?:\s|[,.]|$)|광산|대학|학교|주(?:\s|[,.]|$)|군(?:\s|[,.]|$)|재단|은행)/.test(after)
        || /^(?:\s+)(?:Street|Avenue|Road|Boulevard|City|Factory|Station|University|School|Foundation|Bank)\b/i.test(after);
}

function renderDocPersonLinks(html, raw, indexes, { audit = false, sourceHtml = html, relatedPeople = new Set() } = {}) {
    const policy = raw.personLinks || {};
    validatePersonLinks(raw.personLinks);
    const allowed = new Set(policy.allowedPeople ?? raw.people ?? []);
    const base = indexes.person;
    if (!base) return { html, mentions: [], warnings: [], truncated: false };
    const lang = indexes.lang || (base.en ? 'en' : 'ko');
    const normalize = text => base.en ? text.toLowerCase() : text;
    const names = (policy.names || []).filter(name => name.lang === lang);
    for (const personId of policy.allowedPeople || []) if (!base.byId[personId]) invalid('unknown allowed person ' + personId);
    for (const name of policy.names || []) if (name.personId !== null && (!base.byId[name.personId] || !allowed.has(name.personId))) invalid('mapped person must exist and be allowed: ' + name.personId);
    const sections = sectionsOf(html);
    const sourceSections = sectionsOf(sourceHtml);
    for (const name of policy.names || []) if (name.section && !sourceSections.some(section => section.id === name.section)) invalid('missing section ' + name.section);
    const candidates = new Map();
    const add = (text, personId, full) => {
        if (!text || text.length < 2) return;
        const key = normalize(text);
        if (!candidates.has(key)) candidates.set(key, { text, ids: new Set(), full });
        const value = candidates.get(key);
        value.ids.add(personId);
        value.full ||= full;
    };
    // Include even globally blocked surnames for diagnostics and explicit
    // document approvals. They can only pass this document's stricter gate.
    for (const person of Object.values(base.byId)) {
        for (const name of [person.displayName, person.names?.display, person.names?.short]) {
            add(name, person.id, Boolean(name && /\s/.test(name)));
        }
        add(person.names?.family, person.id, false);
    }
    for (const [text, person] of Object.entries(base.byAlias)) if (person) add(text, person.id, /\s/.test(text) && text !== person.names?.family);
    for (const name of names) if (!candidates.has(normalize(name.text))) candidates.set(normalize(name.text), { text: name.text, ids: new Set(), full: name.kind === 'identity' });
    // Global surname bans are reconsidered here, but compounds that merely
    // contain a name (레닌그라드, 스탈린상) are never that person.
    const pattern = buildAliasPattern([...candidates.values()].map(value => value.text), blockedPhrases(lang), base.en);
    const defaultAliases = Object.create(null), defaultExpressions = Object.create(null);
    for (const candidate of candidates.values()) {
        const ids = candidate.full ? [...candidate.ids] : [...candidate.ids].filter(id => allowed.has(id));
        // Keep the original target for rejected candidates in the audit, but
        // a shared surname can resolve to this document's one approved bearer.
        const personId = ids.length === 1 ? ids[0] : candidate.ids.size === 1 ? [...candidate.ids][0] : null;
        if (!personId) continue;
        defaultAliases[candidate.text] = base.byId[personId];
        defaultExpressions[personId + ':' + candidate.text] = { policy: 'auto', role: 'identity' };
    }
    const mentions = [], warnings = [];
    const shorts = {}, byPerson = {}, defaultFullNames = {}, nameDataCache = new Map();
    for (const person of Object.values(base.byId)) {
        const family = person.names?.family;
        byPerson[person.id] = family ? [family] : [];
        if (family) (shorts[family] ||= []).push(person.id);
    }
    for (const candidate of candidates.values()) if (candidate.full) defaultFullNames[candidate.text] = [...candidate.ids];
    let truncated = false;
    // A curated document (any personLinks: a cast list or name mappings) keeps
    // the closed rules above. Every other document is open like the dictionary pages: people outside
    // raw.people link by a full name, or by a surname the dictionary itself
    // links (unique, not blocked) that fits the document's date, and a surname
    // whose full name the document gave in an earlier section links too.
    const open = raw.personLinks === undefined;
    const year = Number(String(raw.date || '').slice(0, 4));
    const period = policy.period || (year ? { start: year, end: year } : null);
    const docIntroduced = new Set();
    const familyOf = id => base.byId[id]?.names?.family;
    const notName = (text, start, end, entry) => {
        const after = text.slice(end), before = text.slice(0, start);
        if (!nameContext.boundary(text, start, end, base.en)) return true;
        if (PLACE_AFTER.test(after) || FAMILY_AFTER.test(after) || /^\s*(?:\d+\s*세|[IVX]+\b)/u.test(after)) return true;
        if (base.context && nameContext.followedByName(text, end, base.context, [entry.id])) return true;
        // Someone else's whole name: a patronymic before (표도르 니키포로비치
        // 고르시코프), or in English an unknown capitalised word around it.
        return base.en ? /^\s+\p{Lu}/u.test(after) || precededByName(before) : /(?:비치|브나)\s+$/u.test(before);
    };
    function openReason({ match, entry, start, text, full, candidate, protectedSpan }) {
        const end = start + match.length;
        if (!open || !entry || protectedSpan || notName(text, start, end, entry)) return null;
        const life = lifeOf(entry);
        if (full) {
            if (!candidate || candidate.ids.size !== 1) return null;
            if (/(?:비치|브나)$/u.test(match) && /^\s+[가-힣]/u.test(text.slice(end))) return null;
            if (period && life.birth && life.birth > period.end + ERA_MARGIN) return null;
            return 'linked-full-name';
        }
        const family = familyOf(entry.id);
        if ([...docIntroduced].some(id => id !== entry.id && familyOf(id) === family)) return null;
        if (docIntroduced.has(entry.id)) return 'linked-doc-identity';
        // A surname the document never gives in full links only like an event
        // page's: a surname (not a first name: 피델), unique in the dictionary,
        // for someone tied to the document — its cast or the people of its
        // history events — or named that way in any era (anyEra). Archive
        // lists of common Russian surnames otherwise find a namesake born
        // decades later (1937 troika 니키틴 ≠ Vladilen Nikitin, b. 1936).
        const expression = base.expressions?.[entry.id + ':' + match];
        if (base.byAlias[match]?.id !== entry.id || (base.en && match.length <= 4)) return null;
        if (match !== family && !['identity', 'short'].includes(expression?.role)) return null;
        if (/(?:^|[\s(])[\p{L}]{1,2}\.\s*$/u.test(text.slice(0, start))) return null;
        if (!allowed.has(entry.id) && !relatedPeople.has(entry.id) && !expression?.anyEra) return null;
        // Adult when the document was written; long dead only with anyEra.
        if (period && life.birth && life.birth + 18 > period.end) return null;
        if (period && life.death && life.death < period.start - ERA_MARGIN && !expression?.anyEra) return null;
        return 'linked-dictionary';
    }
    const rendered = sections.map(section => {
        const mappings = new Map(names.filter(name => !name.section || name.section === section.id).map(name => [normalize(name.text), name]));
        // Section-specific decisions override the document-wide map.
        for (const name of names.filter(name => name.section === section.id)) mappings.set(normalize(name.text), name);
        if (audit) for (const link of section.html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
            const href = attributes('<a ' + link[1] + '>').href || '';
            const idMatch = href.match(/^\/(?:en\/)?commulingo\/people\/([a-z0-9-]+)(?:[?#]|$)/);
            if (!idMatch) continue;
            const personId = idMatch[1], person = base.byId[personId], text = plainText(link[2]).trim();
            const mapping = mappings.get(normalize(text));
            const codes = chronology(person, policy, raw);
            if (!person) codes.push('manual-unknown-person');
            if (!allowed.has(personId)) codes.push('manual-person-not-allowed');
            if (mapping && mapping.personId !== personId) codes.push('manual-target-conflicts-with-mapping');
            if (mentions.length < 1000) mentions.push({ text, personId, target: person?.displayName || '', section: section.id,
                surnameOnly: false, decision: 'manual-link', context: plainText(link[0]), warnings: codes, note: mapping?.reason || '' });
            else truncated = true;
            for (const code of codes) if (!warnings.some(w => w.personId === personId && w.code === code)) warnings.push({ personId, code });
        }
        const byAlias = Object.assign(Object.create(null), defaultAliases), expressions = { ...defaultExpressions };
        for (const mapping of mappings.values()) {
            const candidate = candidates.get(normalize(mapping.text));
            const personId = mapping.personId;
            if (personId) {
                byAlias[candidate.text] = base.byId[personId];
                expressions[personId + ':' + candidate.text] = { policy: 'auto', role: 'identity' };
            } else delete byAlias[candidate.text];
        }
        const personIndex = { ...base, byAlias, expressions, context: null,
            pattern };
        const introduced = new Set();
        const conflicting = new Set();
        const sectionText = plainText(section.html);
        const identityMappings = [...mappings.values()].filter(mapping => mapping.kind === 'identity');
        const dataKey = JSON.stringify(identityMappings);
        let nameData = nameDataCache.get(dataKey);
        if (!nameData) {
            const fullNames = { ...defaultFullNames };
            for (const mapping of identityMappings) fullNames[candidates.get(normalize(mapping.text)).text] = mapping.personId ? [mapping.personId] : [];
            nameData = nameContext.compile({ ...base.contextData, en: base.en, names: fullNames, shorts, byPerson });
            nameDataCache.set(dataKey, nameData);
        }
        const analysis = nameContext.analyze(sectionText, nameData);
        for (const personId of allowed) {
            const family = base.byId[personId]?.names?.family;
            const targets = family && analysis.targets.get(family);
            if (targets && (targets.size > 1 || !targets.has(personId))) conflicting.add(personId);
        }
        // Explicit unregistered names are evidence against assigning their
        // surname to the approved bearer elsewhere in the same section.
        for (const name of mappings.values()) {
            if (name.personId !== null || !sectionText.includes(name.text)) continue;
            for (const personId of allowed) {
                const family = base.byId[personId]?.names?.family;
                if (family && name.text.includes(family)) conflicting.add(personId);
            }
        }
        let lastText, paragraphAnalysis;
        const guard = ({ match, entry, start, text, alreadyLinked }) => {
            const key = normalize(match), mapping = mappings.get(key), candidate = candidates.get(key);
            // A blocked compound is consumed whole and is nobody's mention.
            if (!mapping && !candidate) return false;
            let full = mapping ? mapping.kind === 'identity' : candidate?.full;
            // A full name inside an existing anchor/inline element is still
            // an introduction; later evidence never licenses an earlier match.
            if (text !== lastText) { lastText = text; paragraphAnalysis = nameContext.analyze(text, nameData); }
            for (const evidence of paragraphAnalysis.evidence) {
                if (evidence.end <= start && evidence.ids.length === 1 && !placeQualifier(text, evidence.end)) {
                    if (allowed.has(evidence.ids[0])) introduced.add(evidence.ids[0]);
                    if (open) docIntroduced.add(evidence.ids[0]);
                }
                if (mapping?.kind !== 'identity' && entry && evidence.start <= start && evidence.end >= start + match.length
                    && evidence.ids.length === 1 && evidence.ids[0] === entry.id) full = true;
            }
            const place = placeQualifier(text, start + match.length);
            let reason;
            if ((raw.noAutoLink || []).includes(match)) reason = 'document-blocked';
            else if (mapping?.personId === null) reason = 'unregistered-name';
            else if (place) reason = 'place-or-institution';
            else if (!entry) reason = 'ambiguous-surname';
            else if (!allowed.has(entry.id)) reason = 'person-not-allowed';
            else if (!full && conflicting.has(entry.id)) reason = 'conflicting-name-in-section';
            else if (!full && !introduced.has(entry.id)) reason = 'surname-without-prior-identity';
            else reason = 'linked';
            if (reason === 'person-not-allowed' || reason === 'surname-without-prior-identity') {
                const protectedSpan = !full && paragraphAnalysis.protectedNames.some(span => start >= span.start && start + match.length <= span.end
                    && !(span.ids.length === 1 && span.ids[0] === entry.id));
                reason = openReason({ match, entry, start, text, full, candidate, protectedSpan }) || reason;
            }
            const linked = reason.startsWith('linked');
            if (linked && full) { introduced.add(entry.id); if (open) docIntroduced.add(entry.id); }
            if (linked && alreadyLinked) reason = 'already-linked';
            const timeWarnings = chronology(entry, policy, raw);
            if (audit) {
                if (mentions.length < 1000) mentions.push({ text: decode(match), personId: entry?.id || mapping?.personId || null,
                    target: entry?.displayName || '', section: section.id, surnameOnly: !full, decision: reason,
                    context: decode(text.slice(Math.max(0, start - 65), start + match.length + 65)), warnings: timeWarnings,
                    note: mapping?.reason || '' });
                else truncated = true;
                for (const warning of timeWarnings) if (!warnings.some(w => w.personId === entry.id && w.code === warning)) warnings.push({ personId: entry.id, code: warning });
            }
            return reason.startsWith('linked') || reason === 'already-linked';
        };
        return createLinker({ ...indexes, person: personIndex }, { surface: 'doc', exclude: { doc: raw.id },
            blockStrings: raw.noAutoLink, personGuard: guard, personAfterContext: text => {
                for (const evidence of nameContext.analyze(text, nameData).evidence) {
                    if (evidence.ids.length !== 1 || placeQualifier(text, evidence.end)) continue;
                    if (allowed.has(evidence.ids[0])) introduced.add(evidence.ids[0]);
                    if (open) docIntroduced.add(evidence.ids[0]);
                }
            } }).html(section.html);
    });
    return { html: rendered.join(''), mentions, warnings, truncated };
}

// People of the history events a document is filed under (raw.events).
async function docRelatedPeople(raw) {
    const ids = new Set(raw?.events || []);
    if (!ids.size) return new Set();
    let events = [];
    try {
        events = await require('./history-events-store').loadCommuLingoHistoryEvents();
    } catch (err) {
        console.error('commulingo doc related people:', err);
    }
    return new Set(events.filter(event => ids.has(event.id)).flatMap(event => event.people.map(person => person.id)));
}

async function inspectDocPersonLinks(html, raw) {
    const { getLinkIndexes } = require('./linkify');
    return renderDocPersonLinks(html, raw, await getLinkIndexes(raw.docLang === 'en' ? 'en' : 'ko'),
        { audit: true, relatedPeople: await docRelatedPeople(raw) });
}

module.exports = { validatePersonLinks, renderDocPersonLinks, inspectDocPersonLinks, docRelatedPeople, sectionsOf };
