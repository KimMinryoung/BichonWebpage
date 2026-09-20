// A snapshot owns its normalized index. A refreshed snapshot automatically
// drops the previous index; query strings never accumulate in a result cache.
const indexes = new WeakMap();
const text = values => values.filter(Boolean).join(' ');
const fields = {
    terms: item => {
        const title = text([item.original, item.term, item.termOther, item.aliasSearchText]);
        return { title, text: text([title, item.period, item.definition]), category: item.category || '__none__' };
    },
    docs: item => ({ title: item.searchTitleText, text: item.searchText, category: item.kindId }),
    events: item => ({ title: item.title, text: text([item.period, item.title, item.summary, item.searchExpressions]) }),
};

function searchDictionary(items, kind, query = '', category = '', accepts = () => true) {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let index = indexes.get(items);
    if (!index) {
        index = items.map(item => {
            const values = fields[kind](item);
            return { item, category: values.category, title: (values.title || '').toLocaleLowerCase(), text: (values.text || '').toLocaleLowerCase() };
        });
        indexes.set(items, index);
    }
    const tiers = [[], [], []];
    for (const row of index) {
        if ((category && category !== row.category) || !accepts(row.item)) continue;
        if (!terms.every(term => row.text.includes(term))) continue;
        const hits = terms.filter(term => row.title.includes(term)).length;
        const tier = !terms.length || hits === terms.length ? 0 : hits ? 1 : 2;
        tiers[tier].push(row.item);
    }
    return tiers.flat();
}
module.exports = { searchDictionary };
