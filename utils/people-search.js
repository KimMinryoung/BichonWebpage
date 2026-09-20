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
        person.role && person.role.label
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
            return { person, name: fields.name, role, desc: role + ' ' + fields.desc };
        }));
        indexes.set(standardized, index);
    }
    for (const row of index) {
        for (const key of ['name', 'role', 'desc']) {
            if (terms.every(term => row[key].includes(term))) {
                hits[key].push(row.person);
                break;
            }
        }
    }
    return hits;
}
module.exports = { searchFields, searchPeople };
