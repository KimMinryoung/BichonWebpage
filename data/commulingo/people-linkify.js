// Auto-links other people's names inside a person's prose (bio + detail
// sections) to their dictionary page. Mirrors the client-side aliasing in
// public/js/commulingo-decision.js so the two behave identically.
//
// Korean has no \b word boundary and names take trailing particles (레닌과,
// 레닌은), so a next-char guard is impossible there. Instead the match is
// guarded only on the PRECEDING char, and known compounds that merely contain
// an alias (레닌그라드, 스탈린주의) are listed in BLOCKED so the longest-first
// alternation consumes them first and the replacer passes them through
// untouched. English uses regex \b on both sides, which already keeps 'Lenin'
// out of 'Leningrad'.

const WORD_CHAR = /[0-9A-Za-z가-힣]/;

// Korean compounds that contain a person alias but must never link.
const BLOCKED_KO = ['레닌그라드', '스탈린그라드', '레닌주의', '스탈린주의', '마르크스주의', '트로츠키주의'];

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Builds an alias→person index and a matching regex from the standardized
// people list. The current person (excludeId) is left out so their own name
// never self-links inside their own description.
function buildPersonLinkIndex(people, options = {}) {
    const lang = options.lang || 'ko';
    const en = lang === 'en';
    const excludeId = options.excludeId || '';
    const byAlias = {};
    const tokens = [];
    (people || []).forEach(person => {
        if (!person || !person.id || person.id === excludeId) return;
        const candidates = [];
        if (person.names) {
            candidates.push(person.names.short, person.names.display);
        }
        candidates.push(person.displayName);
        const aliasList = person.aliases && person.aliases[lang];
        if (Array.isArray(aliasList)) aliasList.forEach(alias => candidates.push(alias));
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2) return;
            if (byAlias[alias]) return;
            byAlias[alias] = person;
            tokens.push(alias);
        });
    });
    if (!tokens.length) return null;
    // BLOCKED tokens join the alternation (Korean only) so they are consumed
    // before their inner alias; longest-first keeps multi-word names and
    // compounds ahead of their short forms.
    const all = (en ? tokens : BLOCKED_KO.concat(tokens)).slice().sort((a, b) => b.length - a.length);
    const alternation = all.map(escapeRegExp).join('|');
    const pattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    return { pattern, byAlias, en };
}

function makeReplacer(index) {
    return function replacer(match, _token, offset, source) {
        if (!index.en) {
            const prev = offset > 0 ? source.charAt(offset - 1) : '';
            if (WORD_CHAR.test(prev)) return match;
        }
        const person = index.byAlias[match];
        if (!person) return match;
        const label = person.displayName || person.name || match;
        const title = escapeHtml(person.epithet ? label + ': ' + person.epithet : label);
        return '<a class="commu-person-link" href="/commulingo/people/'
            + encodeURIComponent(person.id) + '" title="' + title + '">' + match + '</a>';
    };
}

// Escapes raw text, then links person names. Use for plain prose (e.g. bio).
function linkifyPlain(rawText, index) {
    const escaped = escapeHtml(rawText || '');
    if (!index) return escaped;
    return escaped.replace(index.pattern, makeReplacer(index));
}

// Links person names inside already-rendered HTML, skipping tag internals and
// text already wrapped in an anchor (so no nested links are produced).
function linkifyHtml(html, index) {
    if (!index || !html) return html || '';
    const replacer = makeReplacer(index);
    let anchorDepth = 0;
    return String(html).replace(/(<[^>]+>)|([^<]+)/g, function (_m, tag, textChunk) {
        if (tag) {
            const lower = tag.toLowerCase();
            if (/^<a[\s>]/.test(lower)) anchorDepth++;
            else if (/^<\/a\s*>/.test(lower)) anchorDepth = Math.max(0, anchorDepth - 1);
            return tag;
        }
        if (anchorDepth > 0) return textChunk;
        return textChunk.replace(index.pattern, replacer);
    });
}

module.exports = {
    BLOCKED_KO,
    buildPersonLinkIndex,
    linkifyPlain,
    linkifyHtml,
};
