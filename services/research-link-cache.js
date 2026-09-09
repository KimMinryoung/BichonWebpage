// Report render dependencies. Check literal occurrences conservatively, then
// let the shared linker decide boundaries, collisions, context and anchors.
// False positives cost one render; a newly added expression must never be
// missed just because it did not produce a link in the previous generation.
const { createHash } = require('crypto');
const { registryFor } = require('../data/commulingo/linked-entities');
const { walk, decode, attributes } = require('../data/commulingo/html-fragments');
const KINDS = ['doc', 'event', 'term', 'topic', 'person'];
const ROUTES = { doc: 'docs', event: 'events', term: 'terms', person: 'people', role: 'roles', office: 'offices' };
const signature = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function snapshot(indexes) {
    const tokens = new Map();
    const entities = new Map();
    const globals = [];
    for (const kind of KINDS) {
        const index = indexes?.[kind];
        if (!index) continue;
        // Unknown/custom regex implementations cannot safely use literal diffs.
        if (!Array.isArray(index.pattern?.linkTokens)) return null;
        globals.push([kind, index.en, index.pattern.flags]);
        const entries = new Map();
        for (const entry of [...Object.values(index.byId || {}), ...Object.values(index.byAlias || {})]) {
            if (!entry) continue;
            // Person prose is not used to render a link. Keep only its visible
            // label/tooltip in the dependency; refresh full entries separately.
            if (!entries.has(entry)) entries.set(entry, signature(kind === 'person'
                ? [entry.id, entry.displayName, entry.name, entry.epithet] : entry));
            const route = ROUTES[kind === 'topic' ? entry.kind : kind];
            entities.set('/commulingo/' + route + '/' + encodeURIComponent(entry.id), entries.get(entry));
        }
        const expressions = new Map();
        for (const [key, value] of Object.entries(index.expressions || {})) {
            const token = key.slice(key.indexOf(':') + 1);
            if (!expressions.has(token)) expressions.set(token, []);
            expressions.get(token).push([key, value]);
        }
        // Full names can veto a surname match even when the full name itself
        // is not linkable. Include all context evidence in token dependencies.
        const context = index.contextData;
        const literals = new Set([...index.pattern.linkTokens,
            ...Object.keys(context?.names || {}), ...Object.keys(context?.shorts || {})]);
        for (const token of literals) {
            const ids = new Set([...(context?.names?.[token] || []), ...(context?.shorts?.[token] || [])]);
            const contextEntries = [...ids].map(id => [id, context.byPerson?.[id], context.own?.[id], context.initials?.[id], entries.get(index.byId?.[id])]);
            tokens.set(kind + ':' + token, { text: token, value: signature([
                entries.get(index.byAlias?.[token]), expressions.get(token), index.identityAliases?.[token],
                context?.names?.[token], context?.shorts?.[token], contextEntries,
            ]) });
        }
        // Recognition of another person's given name can veto a surname. Use
        // normalized text below, including added AND removed given names.
        for (const given of context?.given || []) tokens.set('given:' + given, { text: given, value: 'given' });
    }
    return { tokens, entities, globals: JSON.stringify(globals) };
}

function changedNeedles(before, after) {
    if (!before || !after || before.globals !== after.globals) return null;
    const changed = new Set();
    for (const key of new Set([...before.tokens.keys(), ...after.tokens.keys()])) {
        const old = before.tokens.get(key), next = after.tokens.get(key);
        if (old?.value !== next?.value) changed.add((next || old).text);
    }
    for (const href of new Set([...before.entities.keys(), ...after.entities.keys()])) {
        if (before.entities.get(href) !== after.entities.get(href)) {
            changed.add(href);
            changed.add(decodeURIComponent(href));
            changed.add(href.replace('/commulingo/', '/en/commulingo/'));
        }
    }
    return [...changed].map(text => text.normalize('NFC').toLowerCase());
}

function searchableHtml(html) {
    let text = '';
    // Use the same tokenizer and entity decoder as the linker. Raw markup
    // also covers manual hrefs (including entries unknown to the old index).
    walk(html, value => { text += value; return value; }, (raw, tag) => {
        if (tag.name === 'a' && !tag.close) {
            try {
                const href = attributes(raw).href;
                if (href) text += '\n' + decodeURIComponent(new URL(href, 'https://report.invalid/').pathname);
            } catch { /* Malformed URLs are also ignored by the entity collector. */ }
        }
        return raw;
    });
    return (decode(html) + '\n' + text).normalize('NFC').toLowerCase();
}

class ResearchLinkCache {
    constructor(limit = 500) {
        this.limit = limit;
        this.generations = new Map();
    }
    forIndexes(indexes) {
        const lang = indexes?.lang || (indexes?.person?.en ? 'en' : 'ko');
        let generation = this.generations.get(lang);
        if (generation && Object.hasOwn(generation, 'indexes') && generation.indexes === indexes) return generation.entries;
        const next = snapshot(indexes);
        if (!generation) generation = { entries: new Map() };
        const needles = changedNeedles(generation.snapshot, next);
        if (needles === null) generation.entries.clear();
        else if (needles.length) {
            for (const [key, cached] of generation.entries) {
                if (needles.some(needle => cached.text.includes(needle))) generation.entries.delete(key);
            }
        }
        if (indexes) {
            const registry = registryFor(indexes);
            for (const cached of generation.entries.values()) {
                for (const [bucket, kind] of Object.entries({ people: 'person', terms: 'term', events: 'event', docs: 'doc', topics: 'topic' })) {
                    cached.result[bucket] = cached.result[bucket].map(entry =>
                        registry.get((kind === 'topic' ? entry.kind : kind) + ':' + entry.id)).filter(Boolean);
                }
            }
        }
        generation.indexes = indexes;
        generation.snapshot = next;
        this.generations.set(lang, generation);
        return generation.entries;
    }
    export() {
        return [...this.generations].filter(([, generation]) => generation.snapshot).map(([lang, generation]) => ({
            lang,
            snapshot: { ...generation.snapshot, tokens: [...generation.snapshot.tokens], entities: [...generation.snapshot.entities] },
            entries: [...generation.entries].filter(([, item]) => item.persistable).map(([key, item]) => [key, {
                text: item.text, reportStates: item.reportStates, persistable: true,
                result: Object.fromEntries(Object.entries(item.result).map(([name, value]) => [name,
                    ['people', 'terms', 'events', 'docs', 'topics'].includes(name)
                        ? value.map(entry => ({ id: entry.id, kind: entry.kind })) : value])),
            }]),
        }));
    }
    import(data) {
        // Validate all generations before installing any; a damaged cache is a miss.
        const restored = new Map();
        for (const generation of data) {
            const { lang, snapshot: saved, entries } = generation;
            if (!['ko', 'en'].includes(lang) || !saved || typeof saved.globals !== 'string'
                || !Array.isArray(saved.tokens) || !Array.isArray(saved.entities) || !Array.isArray(entries)) throw new Error('Invalid report cache generation');
            const snapshot = { ...saved, tokens: new Map(saved.tokens), entities: new Map(saved.entities) };
            for (const [key, token] of snapshot.tokens) if (typeof key !== 'string' || typeof token?.text !== 'string' || typeof token?.value !== 'string') throw new Error('Invalid report cache token');
            for (const [key, value] of snapshot.entities) if (typeof key !== 'string' || typeof value !== 'string') throw new Error('Invalid report cache entity');
            for (const [key, item] of entries) {
                if (typeof key !== 'string' || typeof item?.text !== 'string' || typeof item?.result?.html !== 'string'
                    || !Array.isArray(item.reportStates) || !Array.isArray(item.result.links)) throw new Error('Invalid report cache entry');
                for (const state of item.reportStates) if (!Array.isArray(state) || typeof state[0] !== 'string' || typeof state[1] !== 'boolean') throw new Error('Invalid report dependency');
                for (const bucket of ['people', 'terms', 'events', 'docs', 'topics']) {
                    if (!Array.isArray(item.result[bucket]) || item.result[bucket].some(entry => typeof entry?.id !== 'string')) throw new Error('Invalid report cache references');
                }
                for (const link of item.result.links) if (typeof link?.kind !== 'string' || typeof link?.id !== 'string' || typeof link?.href !== 'string' || typeof link?.anchorId !== 'string') throw new Error('Invalid cached link');
            }
            restored.set(lang, { snapshot, entries: new Map(entries.slice(-this.limit)) });
        }
        // A real request may have populated a generation while disk I/O ran.
        for (const [lang, generation] of restored) if (!this.generations.has(lang)) this.generations.set(lang, generation);
    }

    put(entries, key, html, result, reportStates = [], persistable = true) {
        if (entries.size >= this.limit) entries.delete(entries.keys().next().value);
        entries.set(key, { text: searchableHtml(html), result, reportStates, persistable });
    }
}

module.exports = { ResearchLinkCache };
