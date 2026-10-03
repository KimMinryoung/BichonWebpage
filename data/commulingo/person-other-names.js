// The aliases a reader can find a person by, minus the ones that only repeat
// the headword. Search matches every alias, so the detail page names the rest:
// a search for 모스크빈 lands on 미하일 트릴리세르, whose head then says why.
// An alias drops out when each of its words is already a word of the headword
// or of a longer alias kept (레닌 in 블라디미르 레닌, 울리야노프 in 블라디미르
// 울리야노프); an initial (V.) counts as the word it abbreviates.
const WORD_SPLIT = /[\s\-‐–—·,()'"«»「」]+/;

function words(text) {
    return String(text || '').toLowerCase().split(WORD_SPLIT).map(w => w.replace(/\.+$/, '')).filter(Boolean);
}

function covered(aliasWords, known) {
    return aliasWords.every(word => known.some(k => k === word || (word.length === 1 && k.startsWith(word))));
}

function otherNames(person, lang) {
    const aliases = (person.aliases && person.aliases[lang]) || [];
    const headword = words([person.displayName, person.names && person.names.display].join(' '));
    const kept = [];
    // Longer aliases first, so a full alias absorbs its own surname.
    const ordered = aliases
        .map((text, i) => ({ text: String(text || '').trim(), i, w: words(text) }))
        .filter(a => a.w.length)
        .sort((a, b) => b.w.length - a.w.length || a.i - b.i);
    for (const alias of ordered) {
        const known = headword.concat(...kept.map(k => k.w));
        if (covered(alias.w, known)) continue;
        if (kept.some(k => k.text.toLowerCase() === alias.text.toLowerCase())) continue;
        kept.push(alias);
    }
    return kept.sort((a, b) => a.i - b.i).map(a => a.text);
}

module.exports = { otherNames };
