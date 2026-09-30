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
                root.replaceWith(next);
                document.title = doc.title;
                if (options.push) history.pushState({ activities: true }, '', url);
                initSearch(next);
                var results = next.querySelector('#activity-results');
                if (results) {
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

    window.addEventListener('popstate', function() { swap(location.href, { push: false }); });

    if (browser()) initSearch(browser());
})();
