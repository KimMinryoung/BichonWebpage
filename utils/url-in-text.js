// Pull a URL out of free text such as a citation line or a source entry.
// Wikipedia titles carry parentheses ('…/ВКП(б)', '…_(Bolsheviks)'), so ')'
// stays in the URL while it closes a '(' there; an unmatched ')' belongs to
// the surrounding text ('Title (https://…)'), as does trailing punctuation.
const URL_PATTERN = /https?:\/\/[^\s<>]+/;

function trimUrl(value = '') {
    let url = String(value);
    for (;;) {
        const next = url.replace(/[.,;:]+$/, '');
        if (next.endsWith(')') && next.split(')').length > next.split('(').length) {
            url = next.slice(0, -1);
        } else if (next !== url) {
            url = next;
        } else {
            return url;
        }
    }
}

// The first URL in the text and where it starts, or null.
function findUrl(text = '') {
    const match = String(text).match(URL_PATTERN);
    return match ? { url: trimUrl(match[0]), index: match.index } : null;
}

module.exports = { findUrl, trimUrl };
