// Keyword search in a reference document (views/public/commulingo-doc.ejs).
//
// The panel in the sticky bar asks the server (data/commulingo/doc-search.js)
// for every match on every page and lists them by page. Picking one goes to
// ?p=<page>&q=<query>&hit=<n>; on arrival this script marks every match in the
// page body (.doc-body) and scrolls to the n-th. The find bar at the bottom
// steps through matches, crossing to the next page when a page runs out.
//
// The DOM text is normalised exactly as the server normalises the HTML — tags
// dropped without a space, each whitespace run one space, characters
// lower-cased one by one, matches not overlapping — so the server's "n-th
// match on page 4" is the n-th mark here.
(function () {
    var root = document.querySelector('[data-doc-search]');
    var body = document.querySelector('.doc-body');
    var bar = document.querySelector('[data-doc-find]');
    if (!root || !body || !bar) return;

    var strings = JSON.parse(root.getAttribute('data-strings') || '{}');
    var endpoint = root.getAttribute('data-endpoint');
    var currentPage = Number(root.getAttribute('data-page')) || 1;
    var totalPages = Number(root.getAttribute('data-total-pages')) || 1;
    var details = root.querySelector('details');
    var form = root.querySelector('.doc-search-form');
    var input = form.querySelector('input');
    var status = root.querySelector('.doc-search-status');
    var results = root.querySelector('.doc-search-results');
    var tocDetails = document.querySelector('.doc-toc-nav details');

    var state = { query: '', result: null, marks: [], index: -1 };

    function fill(template, values) {
        return String(template || '').replace(/\{(\w+)\}/g, function (all, key) {
            return values[key] !== undefined ? values[key] : all;
        });
    }

    function normalizeQuery(text) {
        var out = '';
        var lastSpace = false;
        Array.from(String(text || '').slice(0, 100)).forEach(function (ch) {
            if (/\s/.test(ch)) {
                if (!lastSpace) out += ' ';
                lastSpace = true;
            } else {
                var lower = ch.toLowerCase();
                out += lower.length === ch.length ? lower : ch;
                lastSpace = false;
            }
        });
        return out.trim();
    }

    // ---- marking matches in the page body ----

    function clearMarks() {
        state.marks.forEach(function (parts) {
            parts.forEach(function (mark) {
                var parent = mark.parentNode;
                if (!parent) return;
                while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
                parent.removeChild(mark);
                parent.normalize();
            });
        });
        state.marks = [];
        state.index = -1;
    }

    function markMatches(query) {
        clearMarks();
        if (!query) return;
        var walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var tag = node.parentNode && node.parentNode.nodeName;
                return tag === 'SCRIPT' || tag === 'STYLE' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            },
        });
        // norm[i] came from nodes[nodeAt[i]] at UTF-16 offset offAt[i], spanning lenAt[i] units.
        var norm = '';
        var nodes = [];
        var nodeAt = [];
        var offAt = [];
        var lenAt = [];
        var lastSpace = false;
        for (var node = walker.nextNode(); node; node = walker.nextNode()) {
            var text = node.nodeValue;
            var nodeIndex = nodes.push(node) - 1;
            var offset = 0;
            Array.from(text).forEach(function (ch) {
                var size = ch.length;
                if (/\s/.test(ch)) {
                    if (!lastSpace) {
                        norm += ' ';
                        nodeAt.push(nodeIndex); offAt.push(offset); lenAt.push(size);
                    }
                    lastSpace = true;
                } else {
                    var lower = ch.toLowerCase();
                    var out = lower.length === ch.length ? lower : ch;
                    norm += out;
                    // A surrogate pair is two string units on both sides.
                    for (var k = 0; k < out.length; k++) {
                        nodeAt.push(nodeIndex); offAt.push(offset + k); lenAt.push(1);
                    }
                    lastSpace = false;
                }
                offset += size;
            });
        }
        var ranges = [];
        for (var at = norm.indexOf(query); at !== -1; at = norm.indexOf(query, at + query.length)) {
            ranges.push([at, at + query.length]);
        }
        // Wrap from the last match back, so splitting a text node never moves
        // an offset that is still to be used.
        var marks = new Array(ranges.length);
        for (var r = ranges.length - 1; r >= 0; r--) {
            var start = ranges[r][0];
            var end = ranges[r][1];
            // Per text node: [from, to) offsets, collected then wrapped last-first.
            var pieces = [];
            for (var i = start; i < end; i++) {
                var last = pieces[pieces.length - 1];
                var from = offAt[i];
                var to = offAt[i] + lenAt[i];
                if (last && last.node === nodeAt[i]) last.to = to;
                else pieces.push({ node: nodeAt[i], from: from, to: to });
            }
            var parts = [];
            for (var p = pieces.length - 1; p >= 0; p--) {
                var piece = pieces[p];
                var target = nodes[piece.node];
                if (piece.to < target.nodeValue.length) target.splitText(piece.to);
                var middle = piece.from > 0 ? target.splitText(piece.from) : target;
                var mark = document.createElement('mark');
                mark.className = 'doc-hit';
                middle.parentNode.insertBefore(mark, middle);
                mark.appendChild(middle);
                parts.unshift(mark);
            }
            marks[r] = parts;
        }
        state.marks = marks;
    }

    // ---- positions across pages ----

    function pageOffset(page) {
        if (!state.result) return 0;
        var before = 0;
        state.result.pages.forEach(function (entry) {
            if (entry.page < page) before += entry.count;
        });
        return before;
    }

    function totalMatches() {
        return state.result ? state.result.total : state.marks.length;
    }

    function hitHref(page, n) {
        var params = new URLSearchParams();
        if (totalPages > 1) params.set('p', page);
        params.set('q', state.query);
        params.set('hit', n);
        return '?' + params.toString();
    }

    function showBar() {
        bar.hidden = false;
        bar.querySelector('.doc-find-query').textContent = '“' + state.query + '”';
        var total = totalMatches();
        var pos = state.index >= 0 ? pageOffset(currentPage) + state.index + 1 : 0;
        bar.querySelector('.doc-find-pos').textContent = total ? pos + ' / ' + total : '0';
    }

    function goLocal(n) {
        if (!state.marks.length) return;
        n = Math.max(0, Math.min(n, state.marks.length - 1));
        if (state.index >= 0 && state.marks[state.index]) {
            state.marks[state.index].forEach(function (mark) { mark.classList.remove('is-current'); });
        }
        state.index = n;
        state.marks[n].forEach(function (mark) { mark.classList.add('is-current'); });
        state.marks[n][0].scrollIntoView({ block: 'center' });
        var url = new URL(window.location.href);
        url.searchParams.set('q', state.query);
        url.searchParams.set('hit', n);
        url.hash = '';
        history.replaceState(null, '', url.pathname + url.search);
        showBar();
    }

    // Step through every match of the document: within the page while it
    // lasts, then to the next (or previous) page that has one.
    function step(delta) {
        var n = state.index + delta;
        if (n >= 0 && n < state.marks.length) return goLocal(n);
        if (!state.result || totalPages < 1) return;
        var pages = state.result.pages;
        var target = null;
        if (delta > 0) {
            target = pages.filter(function (entry) { return entry.page > currentPage; })[0] || pages[0];
            if (target) return go(target.page, 0);
        } else {
            var earlier = pages.filter(function (entry) { return entry.page < currentPage; });
            target = earlier[earlier.length - 1] || pages[pages.length - 1];
            if (target) return go(target.page, target.count - 1);
        }
    }

    function go(page, n) {
        if (page === currentPage) {
            if (normalizeQuery(state.query) !== state.marked) {
                markMatches(normalizeQuery(state.query));
                state.marked = normalizeQuery(state.query);
            }
            details.open = false;
            return goLocal(n);
        }
        window.location.href = hitHref(page, n);
    }

    // ---- the panel ----

    function renderResults(result) {
        results.textContent = '';
        if (!result.total) {
            status.textContent = strings.none;
            return;
        }
        var lines = [fill(totalPages > 1 ? strings.countPaged : strings.count, { total: result.total, pages: result.pages.length })];
        if (result.truncated) lines.push(fill(strings.truncated, { n: result.hits.length }));
        status.textContent = lines.join('\n');
        result.pages.forEach(function (entry) {
            var hits = result.hits.filter(function (hit) { return hit.page === entry.page; });
            if (!hits.length) return;
            var group = document.createElement('section');
            group.className = 'doc-search-group';
            if (totalPages > 1) {
                var head = document.createElement('h3');
                var label = document.createElement('span');
                label.className = 'doc-search-page';
                label.textContent = fill(strings.pageLabel, { page: entry.page });
                head.appendChild(label);
                var heading = document.createElement('span');
                heading.className = 'doc-search-heading';
                heading.textContent = entry.heading;
                head.appendChild(heading);
                var count = document.createElement('span');
                count.className = 'doc-search-count';
                count.textContent = fill(strings.pageCount, { n: entry.count });
                head.appendChild(count);
                group.appendChild(head);
            }
            var list = document.createElement('ol');
            hits.forEach(function (hit) {
                var item = document.createElement('li');
                var link = document.createElement('a');
                link.href = hitHref(hit.page, hit.n);
                link.setAttribute('data-page', hit.page);
                link.setAttribute('data-hit', hit.n);
                if (hit.section && hit.section !== entry.heading) {
                    var section = document.createElement('span');
                    section.className = 'doc-search-section';
                    section.textContent = hit.section;
                    link.appendChild(section);
                }
                var snippet = document.createElement('span');
                snippet.className = 'doc-search-snippet';
                snippet.appendChild(document.createTextNode(hit.before));
                var mark = document.createElement('mark');
                mark.textContent = hit.match;
                snippet.appendChild(mark);
                snippet.appendChild(document.createTextNode(hit.after));
                link.appendChild(snippet);
                item.appendChild(link);
                list.appendChild(item);
            });
            group.appendChild(list);
            results.appendChild(group);
        });
    }

    var pending = null;
    function search(query) {
        var normalized = normalizeQuery(query);
        state.query = String(query || '').trim();
        if (!normalized) {
            status.textContent = '';
            results.textContent = '';
            return Promise.resolve(null);
        }
        status.textContent = strings.searching;
        if (pending) pending.abort();
        pending = new AbortController();
        return fetch(endpoint + '?q=' + encodeURIComponent(state.query), { signal: pending.signal })
            .then(function (response) {
                if (!response.ok) throw new Error(String(response.status));
                return response.json();
            })
            .then(function (result) {
                state.result = result;
                renderResults(result);
                return result;
            })
            .catch(function (err) {
                if (err.name !== 'AbortError') status.textContent = strings.failed;
                return null;
            });
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        search(input.value);
    });

    results.addEventListener('click', function (event) {
        var link = event.target.closest('a[data-hit]');
        if (!link) return;
        var page = Number(link.getAttribute('data-page'));
        if (page !== currentPage) return; // a plain navigation to that page
        event.preventDefault();
        go(page, Number(link.getAttribute('data-hit')));
    });

    details.addEventListener('toggle', function () {
        if (!details.open) return;
        if (tocDetails) tocDetails.open = false;
        setTimeout(function () { input.focus(); }, 0);
    });
    if (tocDetails) {
        tocDetails.addEventListener('toggle', function () {
            if (tocDetails.open) details.open = false;
        });
    }

    bar.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-find]');
        if (!button) return;
        var action = button.getAttribute('data-find');
        if (action === 'next') step(1);
        else if (action === 'prev') step(-1);
        else {
            clearMarks();
            state.marked = '';
            bar.hidden = true;
            var url = new URL(window.location.href);
            url.searchParams.delete('q');
            url.searchParams.delete('hit');
            history.replaceState(null, '', url.pathname + url.search);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && details.open) details.open = false;
    });

    // Arrival from a search result: mark the page, go to the chosen match, and
    // load the document-wide counts so the find bar can cross pages.
    var params = new URLSearchParams(window.location.search);
    var arrived = params.get('q');
    if (arrived) {
        input.value = arrived;
        state.query = arrived.trim();
        state.marked = normalizeQuery(arrived);
        markMatches(state.marked);
        var hit = Number.parseInt(params.get('hit'), 10);
        if (state.marks.length) goLocal(Number.isFinite(hit) ? hit : 0);
        else showBar();
        search(arrived).then(function (result) { if (result) showBar(); });
    }
})();
