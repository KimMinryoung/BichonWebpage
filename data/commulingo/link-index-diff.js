// What changed between two link-index generations, as literal needles: a
// cached rendering (a report, a course passage) whose text contains none of
// them links exactly as before and can be reused. Shared by the report render
// cache and the course chapter index; snapshots are memoized per index object.
const { createHash } = require('crypto');
const KINDS = ['doc', 'event', 'term', 'topic', 'person'];
const ROUTES = { doc: 'docs', event: 'events', term: 'terms', person: 'people', role: 'roles', office: 'offices' };
const signature = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

function computeSnapshot(indexes) {
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

const snapshots = new WeakMap();
function snapshot(indexes) {
    if (!indexes || typeof indexes !== 'object') return computeSnapshot(indexes);
    if (!snapshots.has(indexes)) snapshots.set(indexes, computeSnapshot(indexes));
    return snapshots.get(indexes);
}

module.exports = { snapshot, changedNeedles };
