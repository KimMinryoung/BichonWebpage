/* global module */
// One person-context policy, used by the server and the decision-book client.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.CommuLingoNameContext = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const word = /[\p{L}\p{M}\p{N}]/u;
    const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const normalize = value => value.normalize('NFC').toLowerCase().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
    // A following word is not part of a surname. Korean particles are allowed;
    // unknown compound tails are withheld, rather than guessed to be particles.
    const particle = /^(?:(?:으로부터|으로서|으로써|에게서|한테서|이라고|이라는|이라며|이라도|이라면|이라서|이어서|이었|였다|이다|입니다|이었다|이란|라는|라고|라며|라도|라면|라서|란|이며|이고|에게|한테|에서|부터|까지|처럼|보다|조차|마저|으로|하고|이라|이든|든지|의|은|는|인|이|가|을|를|와|과|도|만|에|로|나|랑|며|든|요|다|서|께))+$/;
    function boundary(text, start, end, en) {
        if (start && word.test(text[start - 1])) return false;
        const tail = (text.slice(end).match(/^[\p{L}\p{M}\p{N}]+/u) || [''])[0];
        if (!tail) return true;
        if (en) return false;
        return /^[가-힣]+$/.test(tail) && (particle.test(tail) || /^(?:기|식|파|계|군|적)$/.test(tail) || (/^(?:기|식|파|계|군|적)/.test(tail) && particle.test(tail.slice(1))));
    }
    function compile(data) {
        if (!data) return null;
        const names = data.names || {};
        const shorts = data.shorts || {};
        const fullTokens = Object.keys(names).sort((a, b) => b.length - a.length);
        const shortTokens = Object.keys(shorts).sort((a, b) => b.length - a.length);
        return {
            ...data,
            given: new Set(data.given || []),
            own: Object.fromEntries(Object.entries(data.own || {}).map(([id, values]) => [id, new Set(values)])),
            fullPattern: fullTokens.length ? new RegExp(fullTokens.map(escape).join('|'), 'gu') : null,
            shortPattern: shortTokens.length ? new RegExp(shortTokens.map(escape).join('|'), 'gu') : null,
        };
    }
    function analyze(text, data) {
        const targets = new Map();
        const protectedNames = [];
        const evidence = [];
        const add = (alias, id) => {
            if (!targets.has(alias)) targets.set(alias, new Set());
            targets.get(alias).add(id);
        };
        if (!data) return { targets, protectedNames, evidence };
        if (data.fullPattern) {
            data.fullPattern.lastIndex = 0;
            for (const m of text.matchAll(data.fullPattern)) {
                if (!boundary(text, m.index, m.index + m[0].length, data.en)) continue;
                const ids = data.names[m[0]];
                protectedNames.push({ start: m.index, end: m.index + m[0].length, ids });
                evidence.push({ start: m.index, end: m.index + m[0].length, ids });
                for (const id of ids) for (const alias of data.byPerson[id] || []) add(alias, id);
            }
        }
        if (data.shortPattern) {
            data.shortPattern.lastIndex = 0;
            for (const m of text.matchAll(data.shortPattern)) {
                const start = m.index, end = start + m[0].length;
                if (!boundary(text, start, end, data.en)) continue;
                if (protectedNames.some(span => start >= span.start && end <= span.end)) continue;
                const before = text.slice(0, start);
                const previous = (before.match(/([\p{L}\p{M}][\p{L}\p{M}.'’\-]*)\s+$/u) || [])[1];
                if (!previous) continue;
                const first = normalize(previous);
                const initial = /^[A-ZА-Я]\.$/u.test(previous);
                if (!data.given.has(first) && !initial) continue;
                const candidates = data.shorts[m[0]];
                const compatible = candidates.filter(id => initial
                    ? (data.initials?.[id] || []).includes(first)
                    : data.own[id] && data.own[id].has(first));
                if (compatible.length) {
                    for (const id of compatible) add(m[0], id);
                    const span = { start: start - previous.length - (before.match(/\s+$/) || [''])[0].length, end, ids: compatible };
                    protectedNames.push(span);
                    evidence.push(span);
                }
                else {
                    add(m[0], null);
                    protectedNames.push({ start: start - previous.length - (before.match(/\s+$/) || [''])[0].length, end, ids: [] });
                }
            }
        }
        return { targets, protectedNames, evidence };
    }
    function resolve(alias, entryId, start, text, data, context, policy) {
        const end = start + alias.length;
        // A recognized whole name, including a registered but unlinked alias,
        // cannot be split up and rebound to a different person.
        const containing = context.protectedNames.find(span => start >= span.start && end <= span.end);
        if (containing) {
            if (containing.ids.length !== 1) return null;
            const id = containing.ids[0];
            if (id === entryId || (data?.shorts[alias] || []).includes(id)) return id;
            return null;
        }
        const isShort = Boolean(data && data.shorts[alias]);
        if (!isShort) return policy === 'context' && !context.protectedNames.some(span => span.ids.includes(entryId)) ? null : entryId;
        if (!boundary(text, start, end, data.en)) return null;
        const targets = context.targets.get(alias);
        if (targets && targets.size) {
            if (targets.size !== 1) return null;
            const id = [...targets][0];
            // Later evidence may veto a wrong existing link, but cannot assign
            // an earlier ambiguous surname to a newly introduced person.
            if (!entryId && !(context.evidence || []).some(span => span.end <= start && span.ids.includes(id))) return null;
            return id && data.shorts[alias].includes(id) ? id : null;
        }
        return policy === 'context' ? null : entryId;
    }
    return { compile, analyze, resolve, boundary, normalize };
});
