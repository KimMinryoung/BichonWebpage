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
// out of 'Leningrad' — but not out of 'Leonid Pasternak', so it has a blocked
// list of its own for the names one surname sits inside.

const { blockedPhrases, neverLinkAliases } = require('./link-blocklist');

const WORD_CHAR = /[0-9A-Za-z가-힣]/;

// Strings that contain a person alias but must never link to it — 레닌그라드,
// 유리 주코프 — now rows in commulingo_link_blocklist rather than two arrays
// here, because the list grows every time a new card collides with a name
// already in the dictionary. Entries were found firing in real prose by
// scripts/audit-family-name-collisions.js, which runs the shipping index over
// every published passage; none of them are guesses.
//
// Korean has no \b, so the guard is the alternation itself: the blocked phrase
// is longer than the alias inside it and sorts ahead of it, so it is consumed
// first and passes through untouched. English has \b on both sides, which
// already keeps 'Lenin' out of 'Leningrad' — but not out of 'Leonid Pasternak',
// so it needs the same treatment for namesakes who are not in the dictionary.

// Bare aliases that are also ordinary Korean words or word+josa homographs
// (카스트로 = 카스트+로, 보스, 미신) must never auto-link on their own; the
// person still links via longer aliases like the full name.
//
// The second row is family names, which the index offers on its own since
// 2026-07-27. Three kinds are refused: ordinary loanwords a report will use in
// its plain sense (스트롱 달러, 논의를 리드, ROSTA 포스터, 퍼스트레이디, 피크
// 아웃), verb forms (빠르게 팔린 책, 풀어 보시지), and famous surnames a second
// bearer outside the dictionary shares — 캐롤 보이스 데이비스 is not Angela
// Davis, 르로이 존스 is not Claudia Jones, 제임스 보그스 is not Grace Lee Boggs.
// Each was found in real prose by scripts/audit-family-name-collisions.js.
// A fourth kind: a surname whose famous bearer is NOT the dictionary entry.
// Every 푸시킨 in this corpus is the poet, not Georgy Pushkin the diplomat;
// every 시테른 is Lina Stern or Lev Shternberg, not Grigory Shtern; and every
// 톨스토이 is Leo, not Alexei. Each of the three keeps their full name.
// Real-name forms a simplified display name leaves out. The canonical-word test
// in buildPersonLinkIndex exists to refuse the party pseudonyms people carry in
// their alias rows — 랴린, 키이, 야포네츠, 표트르 — which are ordinary words and
// would be dangerous to link on sight. That test also refuses a birth surname
// once the display name stops carrying it, which is not what you want: 오신스키
// is the pen name the dictionary shows, and prose that calls him 오볼렌스키 means
// the same person. Listing a form here trusts it; a single-word form still has
// to belong to nobody else's name.
const TRUSTED_NAME_FORMS = {
    osinsky: {
        ko: ['오볼렌스키', '발레리안 오볼렌스키'],
        en: ['Obolensky', 'Valerian Obolensky'],
    },
};

function trustedFormsFor(personId, lang) {
    const entry = TRUSTED_NAME_FORMS[personId];
    return (entry && entry[lang]) || [];
}

// One-word aliases that must never be indexed: the string belongs to someone or
// something else far more often than to the entry. 리보프 is the city of Lviv,
// 톨스토이 the novelist, 퍼스트 the ordinary word. Rows of kind='alias' in
// commulingo_link_blocklist — unlike the phrase rows, nothing can be consumed
// ahead of these, because the collision is the whole string.



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

// Regnal numbers are stored in the family-name field for monarchs but are never
// a name a reader looks up: '니콜라이 2세' must not put '2세' in the index, nor
// 'Nicholas II' an 'II'. Anything carrying brackets or a comma is a note that
// leaked into the field, not a name.
const NOT_A_FAMILY_NAME = /^(?:[ivxlcdm]+|\d+(?:세|st|nd|rd|th)?)$/i;
const NAME_PUNCTUATION = /[()[\]{}<>,;:"'`]/;

// The family name to offer as a bare alias, or '' when there is none to trust.
// Taken from the structured part rather than the last word of the display name,
// which is the given name in the naming orders Korean keeps (쿤 벨러).
function familyNameOf(person) {
    const name = String((person.names && person.names.family) || '').trim();
    if (!name || NOT_A_FAMILY_NAME.test(name) || NAME_PUNCTUATION.test(name)) return '';
    return name;
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
        // Prose calls people by the family name — 류시코프, not 겐리흐 류시코프 —
        // and only the few hundred with a hand-written alias row used to link
        // that way. The family name is offered as a candidate so the rest link
        // too, and the checks below still decide: one that two people share
        // (야코블레프) is refused as ambiguous, one that is also an ordinary word
        // (레비, 리드) is on the never-link list, and a compound containing one
        // (레닌그라드) is consumed by the blocklist first. Single-word names — 박헌영,
        // 마오쩌둥 — are their own family name field, so nothing changes for them.
        candidates.push(familyNameOf(person));
        candidates.forEach(raw => {
            const alias = typeof raw === 'string' ? raw.trim() : '';
            if (alias.length < 2) return;
            if (!en && neverLinkAliases('ko').includes(alias)) return;
            if (en && neverLinkAliases('en').includes(alias.toLowerCase())) return;
            const words = alias.toLowerCase().split(/\s+/).filter(Boolean);
            const trusted = trustedFormsFor(person.id, lang).includes(alias);
            // Only link aliases made of this person's own canonical-name words,
            // unless the alias is a declared real-name form (see
            // TRUSTED_NAME_FORMS) that the display name no longer carries.
            if (!trusted && !words.every(word => canonicalWords.has(word))) return;
            // …and never link a single word shared by two or more people. A
            // trusted form's word is in nobody's canonical name, so for it the
            // question is only whether the word turns out to be somebody else's.
            if (words.length === 1) {
                const owners = wordOwners[words[0]];
                if (trusted) {
                    if (owners && (owners.size > 1 || !owners.has(person.id))) return;
                } else if (!owners || owners.size > 1) return;
            }
            if (byAlias[alias]) return;
            byAlias[alias] = person;
            tokens.push(alias);
        });
    });
    if (!tokens.length) return null;
    // BLOCKED tokens join the alternation so they are consumed before the alias
    // inside them; longest-first keeps multi-word names and compounds ahead of
    // their short forms.
    const all = blockedPhrases(en ? 'en' : 'ko').concat(tokens).slice().sort((a, b) => b.length - a.length);
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
    WORD_CHAR,
    escapeHtml,
    escapeRegExp,
    buildPersonLinkIndex,
    mapLinkableText,
};
