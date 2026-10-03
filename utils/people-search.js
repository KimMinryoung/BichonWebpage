// Search-only text stays in the server index, not in card HTML.
function searchFields(person) {
    const nameSearch = [
        person.names && person.names.ko,
        person.names && person.names.en,
        person.displayName,
        person.cyrillic
    ].concat(
        (person.aliases && person.aliases.ko) || [],
        (person.aliases && person.aliases.en) || [],
        (person.linkExpressions || []).filter(function(item) { return item.role !== 'related'; }).map(function(item) { return item.text; })
    ).filter(Boolean).join(' ').toLowerCase();
    const roleSearch = [
        person.role && person.role.label,
        (person.activities || []).map(a => [a.label, a.affiliationLabel].filter(Boolean).join(' ')).join(' ')
    ].concat(
        (person.career || []).map(function(item) { return item.r; }),
        (person.institutionRoles || []).map(function(item) { return (item.role || '') + ' ' + (item.officeTitle || ''); })
    ).filter(Boolean).join(' ').toLowerCase();
    const descSearch = [
        person.epithet,
        person.moment,
        person.bio,
        (person.linkExpressions || []).filter(function(item) { return item.role === 'related'; }).map(function(item) { return item.text; }).join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
    return { name: nameSearch, role: roleSearch, desc: descSearch };
}

// A name hit is ranked by how much of the person's own name the query is:
// the whole name or surname, then whole words of it, then whole words of an
// alias, then word prefixes, then any substring. '루카' finds 바실레 루카 (family
// name) before a man whose pseudonym was 루카 and before 루카치.
const WORD_SPLIT = /[\s\-‐–—·.,()'"«»「」]+/;
function words(texts) {
    return texts.filter(Boolean).join(' ').toLowerCase().split(WORD_SPLIT).filter(Boolean);
}
function nameRankFields(person, allNames) {
    const n = person.names || {};
    const primary = [n.ko, n.en, n.display, n.short, n.family, person.displayName, person.cyrillic].filter(Boolean).map(t => t.toLowerCase());
    return {
        primaryFull: new Set(primary.concat(primary.map(t => t.split(WORD_SPLIT).filter(Boolean).join(' ')))),
        primaryWords: words(primary),
        nameWords: allNames.split(WORD_SPLIT).filter(Boolean),
    };
}
function nameRank(row, phrase, terms) {
    if (row.primaryFull.has(phrase)) return 0;
    if (terms.every(term => row.primaryWords.includes(term))) return 1;
    if (terms.every(term => row.nameWords.includes(term))) return 2;
    if (terms.every(term => row.primaryWords.some(word => word.startsWith(term)))) return 3;
    if (terms.every(term => row.nameWords.some(word => word.startsWith(term)))) return 4;
    return 5;
}

const indexes = new WeakMap();
function searchPeople(standardized, query, sortPeople) {
    const hits = { name: [], role: [], desc: [] };
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return hits;
    let index = indexes.get(standardized);
    if (!index) {
        index = standardized.groups.flatMap(group => sortPeople(group.people).map(person => {
            const fields = searchFields(person);
            const role = fields.name + ' ' + fields.role;
            return { person, name: fields.name, role, desc: role + ' ' + fields.desc, ...nameRankFields(person, fields.name) };
        }));
        indexes.set(standardized, index);
    }
    const phrase = terms.join(' ');
    const named = [];
    for (const row of index) {
        for (const key of ['name', 'role', 'desc']) {
            if (terms.every(term => row[key].includes(term))) {
                if (key === 'name') named.push({ person: row.person, rank: nameRank(row, phrase, terms) });
                else hits[key].push(row.person);
                break;
            }
        }
    }
    // Stable: people of equal rank keep the chronological order.
    hits.name = named.sort((a, b) => a.rank - b.rank).map(hit => hit.person);
    return hits;
}

// The alias a name hit came through, when the headword itself does not carry
// the query: the card then says why it turned up (모스크빈 → 미하일 트릴리세르).
// The page language's aliases come first, then the other's, then link forms.
function matchedAlias(person, query, lang) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return '';
    const n = person.names || {};
    const primary = [n.ko, n.en, n.display, n.short, n.family, person.displayName, person.cyrillic].filter(Boolean).join(' ').toLowerCase();
    if (terms.every(term => primary.includes(term))) return '';
    const aliases = person.aliases || {};
    const other = lang === 'en' ? 'ko' : 'en';
    const candidates = [].concat(aliases[lang] || [], aliases[other] || [],
        (person.linkExpressions || []).filter(item => item.role !== 'related').map(item => item.text));
    return candidates.find(text => text && terms.every(term => text.toLowerCase().includes(term))) || '';
}

module.exports = { searchFields, searchPeople, matchedAlias };
