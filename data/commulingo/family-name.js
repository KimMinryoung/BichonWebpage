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

module.exports = { familyNameOf };
