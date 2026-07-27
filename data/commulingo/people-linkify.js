// The person alias index, plus the HTML-walking and escaping helpers every
// index shares. Who links where, in what order, and how one link is written is
// linkify.js; this file only answers which strings belong to which person.
// Mirrors the client-side aliasing in public/js/commulingo-decision.js so the
// two behave identically.
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
const BLOCKED_KO = [
    '레닌그라드', '스탈린그라드', '레닌주의', '스탈린주의', '마르크스주의', '트로츠키주의',
    '마르크스-레닌주의', '라살레주의', '라살레파',
    '탈레반', '넵스키 대로', '로마노프 왕조', '사이버-레닌', '사이버 레닌',
];

// Bare aliases that are also ordinary Korean words or word+josa homographs
// (카스트로 = 카스트+로, 보스, 미신) must never auto-link on their own; the
// person still links via longer aliases like the full name.
const NEVER_LINK_ALIAS_KO = ['카스트로', '보스', '미신', '레비'];
const NEVER_LINK_ALIAS_EN = ['levi'];

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
    const list = people || [];

    // Canonical-name words per person, and how many distinct people share each
    // word. Used to (a) trust only aliases that are part of the person's own
    // name, and (b) refuse to link a bare word owned by more than one person —
    // a generic given name (안드레이, 알렉산드르) or a shared surname
    // (야코블레프) can't disambiguate, so it must never auto-link.
    const canonicalWordsById = {};
    const wordOwners = {};
    list.forEach(person => {
        if (!person || !person.id) return;
        const words = new Set();
        [person.names && person.names.short, person.names && person.names.display, person.displayName]
            .forEach(value => {
                if (typeof value !== 'string') return;
                value.trim().toLowerCase().split(/\s+/).forEach(word => { if (word) words.add(word); });
            });
        canonicalWordsById[person.id] = words;
        words.forEach(word => { (wordOwners[word] || (wordOwners[word] = new Set())).add(person.id); });
    });

    const byAlias = {};
    const tokens = [];
    list.forEach(person => {
        if (!person || !person.id || person.id === excludeId) return;
        const canonicalWords = canonicalWordsById[person.id] || new Set();
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
            if (!en && NEVER_LINK_ALIAS_KO.includes(alias)) return;
            if (en && NEVER_LINK_ALIAS_EN.includes(alias.toLowerCase())) return;
            const words = alias.toLowerCase().split(/\s+/).filter(Boolean);
            // Only link aliases made of this person's own canonical-name words…
            if (!words.every(word => canonicalWords.has(word))) return;
            // …and never link a single word shared by two or more people.
            if (words.length === 1) {
                const owners = wordOwners[words[0]];
                if (!owners || owners.size > 1) return;
            }
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

// Tags whose text content must never be linkified: existing anchors (no nested
// links) and literal/code contexts.
const SKIP_TAGS = ['a', 'code', 'pre', 'script', 'style'];

// Walks already-rendered HTML and applies mapText to every text chunk that is
// not inside a skip tag. Tag internals pass through untouched.
function mapLinkableText(html, mapText) {
    const depth = {};
    SKIP_TAGS.forEach(name => { depth[name] = 0; });
    let skipping = 0;
    return String(html).replace(/(<[^>]+>)|([^<]+)/g, function (_m, tag, textChunk) {
        if (tag) {
            const match = tag.match(/^<\s*(\/?)\s*([a-zA-Z0-9]+)/);
            if (match && SKIP_TAGS.includes(match[2].toLowerCase())) {
                const name = match[2].toLowerCase();
                if (match[1]) {
                    if (depth[name] > 0) { depth[name]--; skipping--; }
                } else if (!/\/\s*>$/.test(tag)) {
                    depth[name]++; skipping++;
                }
            }
            return tag;
        }
        if (skipping > 0) return textChunk;
        return mapText(textChunk);
    });
}

module.exports = {
    BLOCKED_KO,
    NEVER_LINK_ALIAS_KO,
    NEVER_LINK_ALIAS_EN,
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    buildPersonLinkIndex,
    mapLinkableText,
};
