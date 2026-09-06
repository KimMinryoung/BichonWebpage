const { walk, attributes } = require('./html-fragments');
const { escapeHtml } = require('./people-linkify');
const { absoluteUrl } = require('../../utils/seo');

const BUCKET = { person: 'people', term: 'terms', event: 'events', doc: 'docs', role: 'topics', office: 'topics' };
const ROUTES = { people: 'person', terms: 'term', events: 'event', docs: 'doc', roles: 'role', offices: 'office' };
const registryMemo = new WeakMap();
function registryFor(indexes) {
    if (registryMemo.has(indexes)) return registryMemo.get(indexes);
    const registry = new Map();
    for (const kind of ['person', 'term', 'event', 'doc', 'topic']) {
        const index = indexes[kind];
        if (!index) continue;
        for (const entry of [...Object.values(index.byId || {}), ...Object.values(index.byAlias || {})]) {
            if (entry) registry.set((kind === 'topic' ? entry.kind : kind) + ':' + entry.id, entry);
        }
    }
    registryMemo.set(indexes, registry);
    return registry;
}

// This is an HTML-link collector, not a name/mention matcher. Manual and
// automatic links follow identical rules and point at actual anchor locations.
function collectLinkedEntities(html, indexes, { anchors = false } = {}) {
    const found = { people: [], terms: [], events: [], docs: [], topics: [] };
    const links = [];
    if (!indexes) return { html, ...found, links };
    const registry = registryFor(indexes);
    const origin = new URL(absoluteUrl('/')).origin;
    const ids = new Set();
    walk(html, text => text, (raw, tag) => {
        if (!tag.close) { const id = attributes(raw).id; if (id) ids.add(id); }
        return raw;
    });
    const seen = new Set();
    const out = walk(html, text => text, (raw, tag, context) => {
        if (context.literal || tag.name !== 'a' || tag.close) return raw;
        const attrs = attributes(raw);
        if (!attrs.href) return raw;
        let url;
        try { url = new URL(attrs.href, origin); } catch { return raw; }
        if (url.origin !== origin) return raw;
        const path = url.pathname.match(/^\/(?:en\/)?commulingo\/(people|terms|events|docs|roles|offices)\/([^/]+)\/?$/);
        if (!path) return raw;
        let id;
        try { id = decodeURIComponent(path[2]); } catch { return raw; }
        const kind = ROUTES[path[1]], key = kind + ':' + id;
        const entry = registry.get(key);
        if (!entry) return raw;
        let anchorId = attrs.id || '';
        if (anchors && !anchorId) {
            const base = 'mention-' + (kind === 'person' ? '' : kind + '-') + id;
            anchorId = base;
            let suffix = 2;
            while (ids.has(anchorId)) anchorId = base + '-' + suffix++;
            ids.add(anchorId);
            raw = raw.replace(/>$/, ' id="' + escapeHtml(anchorId) + '">');
        }
        links.push({ kind, id, href: attrs.href, anchorId });
        if (!seen.has(key)) {
            seen.add(key);
            found[BUCKET[kind]].push(entry);
        }
        return raw;
    });
    return { html: out, ...found, links };
}

module.exports = { collectLinkedEntities };
