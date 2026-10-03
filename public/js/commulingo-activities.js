(function() {
    'use strict';
    // Activity browser: every filter chip and pager link is a real URL. With
    // script, a click fetches that page and swaps #activity-browser in place
    // (no reload, no jump to the top); back/forward replays the same swap.
    var ROOT = 'activity-browser';
    var en = document.documentElement.lang === 'en';
    var pending = null;

    function browser() { return document.getElementById(ROOT); }

    function initSearch(root) {
        var picker = root.querySelector('[data-affiliation-picker]');
        var input = root.querySelector('[data-affiliation-search]');
        var status = root.querySelector('[data-affiliation-search-status]');
        if (!picker || !input || !status) return;
        input.hidden = false;
        var groups = Array.from(root.querySelectorAll('[data-affiliation-group]')).map(function(node) {
            var title = node.querySelector('h3').textContent;
            return { node: node, title: title, chips: Array.from(node.querySelectorAll('a')) };
        });
        var norm = function(text) { return text.normalize('NFKC').toLocaleLowerCase(); };
        input.addEventListener('input', function() {
            var query = norm(input.value.trim());
            var count = 0;
            groups.forEach(function(group) {
                // A country name match keeps its whole group.
                var groupHit = query && norm(group.title).includes(query);
                var shown = 0;
                group.chips.forEach(function(chip) {
                    var hit = !query || groupHit || norm(chip.textContent).includes(query);
                    chip.hidden = !hit;
                    if (hit) shown++;
                });
                group.node.hidden = !shown;
                count += shown;
            });
            status.hidden = !query;
            status.textContent = en ? count + ' matching affiliations' : '일치하는 소속 ' + count + '개';
        });
        picker.addEventListener('toggle', function() { if (picker.open) input.focus({ preventScroll: true }); });
    }

    function swap(url, options) {
        var root = browser();
        if (!root) { location.href = url; return; }
        if (pending) pending.abort();
        var controller = pending = new AbortController();
        root.setAttribute('aria-busy', 'true');
        fetch(url, { signal: controller.signal, credentials: 'same-origin' })
            .then(function(res) { if (!res.ok) throw new Error(res.status); return res.text(); })
            .then(function(html) {
                var doc = new window.DOMParser().parseFromString(html, 'text/html');
                var next = doc.getElementById(ROOT);
                if (!next) throw new Error('missing browser');
                // Chip rows scroll sideways on phones; keep each row where the
                // reader left it instead of snapping back to its start.
                var offsets = {};
                root.querySelectorAll('[data-facet]').forEach(function(row) { offsets[row.dataset.facet] = row.scrollLeft; });
                root.replaceWith(next);
                next.querySelectorAll('[data-facet]').forEach(function(row) {
                    if (offsets[row.dataset.facet]) row.scrollLeft = offsets[row.dataset.facet];
                    var active = row.querySelector('.is-active');
                    if (!active) return;
                    var box = row.getBoundingClientRect(), chip = active.getBoundingClientRect();
                    if (chip.left < box.left) row.scrollLeft -= box.left - chip.left + 16;
                    else if (chip.right > box.right) row.scrollLeft += chip.right - box.right + 16;
                });
                document.title = doc.title;
                if (options.push) history.pushState({ activities: true }, '', url);
                else if (options.replace) history.replaceState({ activities: true }, '', url);
                initSearch(next);
                highlightCards(next);
                var results = next.querySelector('#activity-results');
                // Typing in the search box keeps the caret and the page where they are.
                if (results && !options.typing) {
                    // Keep the reader where they were, unless the results head
                    // is off screen (e.g. after paging from the bottom).
                    var top = results.getBoundingClientRect().top;
                    if (options.scrollToResults || top < 0 || top > window.innerHeight) results.scrollIntoView({ block: 'start' });
                    results.focus({ preventScroll: true });
                }
            })
            .catch(function(error) { if (error.name !== 'AbortError') location.href = url; })
            .finally(function() { if (pending === controller) pending = null; });
    }

    document.addEventListener('click', function(event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var link = event.target.closest('a[href]');
        var root = browser();
        if (!link || !root || !root.contains(link) || link.closest('.commu-person-card')) return;
        var url = new URL(link.href, location.href);
        if (url.origin !== location.origin || url.pathname !== '/commulingo/activities') return;
        event.preventDefault();
        swap(url.href, { push: true, scrollToResults: !!link.closest('[data-commu-list-pager]') });
    });

    window.addEventListener('popstate', function() {
        if (searchInput) syncSearch(new URL(location.href).searchParams.get('q') || '');
        swap(location.href, { push: false });
    });

    // People search: the dictionary's search box narrows the filtered people
    // (server ?q=, ranked like /commulingo/people). Typing replaces the history
    // entry; Enter and the clear button add one.
    var form = document.querySelector('[data-activity-search]');
    var searchInput = form && form.querySelector('input[name="q"]');
    var clearBtn = form && form.querySelector('.commu-people-search-clear');
    var typingTimer = null;

    function highlightCards(root) {
        var query = searchInput ? searchInput.value.trim() : '';
        var re = query && window.__commuSearch ? window.__commuSearch.pattern(query) : null;
        if (!re) return;
        root.querySelectorAll('.commu-person-card').forEach(function(card) { window.__commuSearch.highlightPerson(card, re); });
    }
    function syncSearch(value) {
        searchInput.value = value;
        clearBtn.hidden = !value;
    }
    function searchUrl() {
        var url = new URL(location.href);
        var query = searchInput.value.trim();
        if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
        url.searchParams.delete('page');
        return url.href;
    }
    function runSearch(options) {
        clearTimeout(typingTimer);
        clearBtn.hidden = !searchInput.value;
        var url = searchUrl();
        if (url !== location.href) swap(url, options);
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearBtn.hidden = !searchInput.value;
            clearTimeout(typingTimer);
            typingTimer = setTimeout(function() { runSearch({ replace: true, typing: true }); }, 250);
        });
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && searchInput.value) {
                event.preventDefault();
                syncSearch('');
                runSearch({ replace: true, typing: true });
            }
        });
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            runSearch({ push: true, scrollToResults: true });
        });
        clearBtn.addEventListener('click', function() {
            syncSearch('');
            runSearch({ push: true, typing: true });
            searchInput.focus();
        });
    }

    if (browser()) {
        initSearch(browser());
        highlightCards(browser());
    }
})();
