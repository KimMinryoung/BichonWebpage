// Page cuts for the CommuLingo list pages (reference library, historical
// events, genealogy charts). Every card is still rendered — the search box
// filters client-side and needs them all — and the ones off the requested
// page carry `hidden`. The server draws the first view from ?page= (and, for
// the library, ?kind=) so the pager works as plain links and a filtered page
// can be shared; commulingo-dict-search.js then redraws the same pager over
// whatever the search and chips leave matched (data-page-size on the list).
const PAGE_SIZE = 24;

// `matched` is the subset of `items` the URL's filters keep (all of them when
// the page has no filter); `items` are all marked with `onPage`. `baseUrl` is
// what views/partials/pagination.ejs appends the page number to.
// Options: `pageSize`; `mark` (default true) stamps `onPage` on every item for
// templates that render the whole list — pass false for shared objects (the
// people dictionary's standardized records) and use `pageItems` instead.
function paginateList(items, matched, query, baseUrl, options = {}) {
    const pageSize = options.pageSize || PAGE_SIZE;
    const total = Math.max(1, Math.ceil(matched.length / pageSize));
    let current = Number.parseInt(query && query.page, 10);
    if (!Number.isFinite(current) || current < 1) current = 1;
    if (current > total) current = total;
    const pageItems = matched.slice((current - 1) * pageSize, current * pageSize);
    if (options.mark !== false) {
        const onPage = new Set(pageItems);
        items.forEach(item => { item.onPage = onPage.has(item); });
    }
    return { current, total, matched: matched.length, baseUrl, pageSize, pageItems };
}

module.exports = { paginateList, PAGE_SIZE };
