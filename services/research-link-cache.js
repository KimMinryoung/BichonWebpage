// Report render dependencies. Check literal occurrences conservatively, then
// let the shared linker decide boundaries, collisions, context and anchors.
// False positives cost one render; a newly added expression must never be
// missed just because it did not produce a link in the previous generation.
const { createHash } = require('crypto');
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
            // The report result includes the entry object, so even metadata-only
            // edits refresh affected reports, without invalidating other names.
            if (!entries.has(entry)) entries.set(entry, signature(entry));
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
        if (generation && generation.indexes === indexes) return generation.entries;
        const next = snapshot(indexes);
        if (!generation) generation = { entries: new Map() };
        const needles = changedNeedles(generation.snapshot, next);
        if (needles === null) generation.entries.clear();
        else if (needles.length) {
            for (const [key, cached] of generation.entries) {
                if (needles.some(needle => cached.text.includes(needle))) generation.entries.delete(key);
            }
        }
        generation.indexes = indexes;
        generation.snapshot = next;
        this.generations.set(lang, generation);
        return generation.entries;
    }
    put(entries, key, html, result) {
        if (entries.size >= this.limit) entries.delete(entries.keys().next().value);
        entries.set(key, { text: searchableHtml(html), result });
    }
}

module.exports = { ResearchLinkCache };
