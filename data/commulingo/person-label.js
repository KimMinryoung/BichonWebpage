// The one place a person's name is labelled for lists: the name plus the
// card's disambiguating qualifier, 「오토 브라운 (프로이센 총리)」. The stored
// name_ko/name_en is only the composition of the parts (the store writes it
// through composeFromParts and rejects parentheses); the qualifier lives in
// name_qualifier_ko/en (migration 360). The person page heads with the bare
// name and prints the qualifier under it, so it does not use this.
function personLabel(name, qualifier) {
    const base = String(name || '').trim();
    const extra = String(qualifier || '').trim();
    return base && extra ? `${base} (${extra})` : base;
}

// Both languages of a row's name and qualifier columns, for the stores that
// read commulingo_people by SQL (event people, term people, rosters).
function personLabels(row) {
    return {
        ko: personLabel(row.name_ko, row.name_qualifier_ko),
        en: personLabel(row.name_en, row.name_qualifier_en),
    };
}

module.exports = { personLabel, personLabels };
