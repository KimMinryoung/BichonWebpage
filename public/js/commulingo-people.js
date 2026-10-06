// People explorer: era shelves with paged group cards, #p-<id> deep links,
// facet panels, and the in-place swap of #people-browser for every filter,
// pager, sort and search change (each of which is also a plain link).

(function() {
    'use strict';
    var ROOT = 'people-browser';
    var en = document.documentElement.lang === 'en';
    var shell = document.querySelector('.commu-people-shell');
    var PAGE_SIZE = parseInt(shell && shell.getAttribute('data-page-size'), 10) || 24;
    var langPrefix = location.pathname.indexOf('/en/') === 0 ? '/en' : '';

    function browser() { return document.getElementById(ROOT); }

    // ── Era shelves ─────────────────────────────────────────────────────
    // Opening a group fetches one page of its cards
    // (/commulingo/people/cards?group=<id>&page=N, with the site's pager
    // appended) instead of the whole group — the largest group is 900KB of
    // markup — and the pager under the grid fetches the next.
    var cardPages = {};
    var groupEls = [];

    // Card-shaped placeholders while a group's grid downloads, aria-hidden,
    // with a visually hidden status line carrying the same news.
    function makeSkeleton() {
        var wrap = document.createElement('div');
        wrap.className = 'commu-people-skeleton';
        wrap.setAttribute('aria-hidden', 'true');
        for (var i = 0; i < 4; i++) {
            var card = document.createElement('div');
            card.className = 'commu-person-skel';
            ['is-name', 'is-line', 'is-line-mid', 'is-line-short'].forEach(function(kind) {
                var bar = document.createElement('span');
                bar.className = kind;
                card.appendChild(bar);
            });
            wrap.appendChild(card);
        }
        return wrap;
    }

    function failNotice(grid) {
        var failed = document.createElement('p');
        failed.className = 'commu-people-loading';
        failed.setAttribute('role', 'status');
        failed.textContent = en ? 'Failed to load — reopen to retry' : '불러오지 못했습니다 — 다시 열면 재시도합니다';
        if (grid) grid.appendChild(failed);
        setTimeout(function() { failed.remove(); }, 4000);
    }

    function fetchGroup(id, page) {
        var key = id + ':' + page;
        if (cardPages[key]) return cardPages[key];
        // Under /en/… the fragment comes from /en/… too, so its card links
        // carry the English prefix instead of costing a redirect per click.
        var url = langPrefix + '/commulingo/people/cards?group=' + encodeURIComponent(id) + '&page=' + page;
        cardPages[key] = fetch(url, { credentials: 'same-origin' })
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function(html) {
                var holder = document.createElement('template');
                holder.innerHTML = html;
                var pager = null;
                var cards = Array.prototype.filter.call(holder.content.children, function(node) {
                    if (node.hasAttribute('data-commu-list-pager')) { pager = node; return false; }
                    return true;
                });
                return { cards: cards, pager: pager };
            })
            .catch(function(err) { delete cardPages[key]; throw err; });
        return cardPages[key];
    }

    function showPage(group, page) {
        var grid = group.querySelector('.commu-people-grid');
        if (!grid) return Promise.resolve();
        var requestId = group.__requestId = (group.__requestId || 0) + 1;
        if (group.__page === page) return Promise.resolve();
        var skeleton = makeSkeleton();
        var status = document.createElement('p');
        status.className = 'commu-sr-only';
        status.setAttribute('role', 'status');
        status.textContent = en ? 'Loading…' : '불러오는 중…';
        if (!group.hasAttribute('data-loaded')) {
            grid.appendChild(skeleton);
            grid.appendChild(status);
        }
        return fetchGroup(group.getAttribute('data-group-id'), page).then(function(result) {
            skeleton.remove();
            status.remove();
            if (requestId !== group.__requestId) return;
            if (group.__pager) group.__pager.remove();
            // Cached nodes may be shown again later; show copies.
            grid.replaceChildren.apply(grid, result.cards.map(function(node) { return node.cloneNode(true); }));
            group.__page = page;
            group.__pager = result.pager && result.pager.cloneNode(true);
            if (group.__pager) group.appendChild(group.__pager);
            group.setAttribute('data-loaded', '');
        }, function(err) {
            skeleton.remove();
            status.remove();
            if (requestId === group.__requestId) failNotice(grid);
            throw err;
        });
    }

    function initShelves(root) {
        groupEls = Array.prototype.slice.call(root.querySelectorAll('details.commu-people-group[data-group-id]'));
        groupEls.forEach(function(group) {
            group.addEventListener('click', function(event) {
                var link = event.target.closest('[data-commu-list-pager] a[href]');
                if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                var match = /[?&]page=(\d+)/.exec(link.getAttribute('href') || '');
                if (!match) return;
                event.preventDefault();
                event.stopPropagation();
                showPage(group, parseInt(match[1], 10)).then(function() {
                    group.scrollIntoView({ block: 'start' });
                }).catch(function() {});
            });
            group.addEventListener('toggle', function() {
                if (group.open && !group.hasAttribute('data-loaded')) showPage(group, 1).catch(function() {});
            });
        });
    }

    function groupFor(personId) {
        for (var i = 0; i < groupEls.length; i++) {
            var ids = ' ' + (groupEls[i].getAttribute('data-people') || '') + ' ';
            if (ids.indexOf(' ' + personId + ' ') !== -1) return groupEls[i];
        }
        return null;
    }

    // Brings one person's card onto the page for #p-<id> arrivals: data-people
    // is in card order, so the position gives the page.
    function revealPerson(personId) {
        var group = groupFor(personId);
        if (!group) return Promise.resolve();
        var index = (group.getAttribute('data-people') || '').split(' ').indexOf(personId);
        return index < 0 ? Promise.resolve() : showPage(group, Math.floor(index / PAGE_SIZE) + 1);
    }

    function focusCard(personId) {
        var card = document.getElementById('p-' + personId);
        if (!card) return;
        var group = card.closest('details.commu-people-group');
        if (group) group.open = true;
        document.querySelectorAll('.commu-person-card.is-focused').forEach(function(el) { el.classList.remove('is-focused'); });
        card.classList.add('is-focused');
        window.requestAnimationFrame(function() { card.scrollIntoView({ block: 'start' }); });
    }

    function focusHash() {
        var hash = window.location.hash;
        if (!hash) return;
        if (hash.indexOf('#p-') !== 0) return;
        var personId = hash.slice(3);
        revealPerson(personId).then(function() { focusCard(personId); }).catch(function() {});
    }

    // ── Facet panels ────────────────────────────────────────────────────
    // One panel open at a time; a click outside or Escape closes it. The
    // long panels (affiliations, citizenship) get a filter box.
    function closeFacets(except) {
        var root = browser();
        if (!root) return;
        root.querySelectorAll('details.commu-people-facet[open]').forEach(function(facet) {
            if (facet !== except) facet.open = false;
        });
    }

    function initFacetSearch(root) {
        var norm = function(text) { return text.normalize('NFKC').toLocaleLowerCase(); };
        root.querySelectorAll('[data-facet-search]').forEach(function(input) {
            var panel = input.closest('.commu-people-facet-panel');
            var status = panel.querySelector('[data-facet-search-status]');
            var groups = Array.prototype.map.call(panel.querySelectorAll('[data-facet-group]'), function(node) {
                var head = node.querySelector('h4');
                return { node: node, title: head ? head.textContent : '', chips: Array.prototype.slice.call(node.querySelectorAll('a')) };
            });
            input.hidden = false;
            input.addEventListener('input', function() {
                var query = norm(input.value.trim());
                var count = 0;
                groups.forEach(function(group) {
                    // A country name match keeps its whole group.
                    var groupHit = query && group.title && norm(group.title).includes(query);
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
                status.textContent = en ? count + ' matches' : count + '개 일치';
            });
        });
        root.querySelectorAll('details.commu-people-facet').forEach(function(facet) {
            facet.addEventListener('toggle', function() {
                if (!facet.open) return;
                closeFacets(facet);
                var input = facet.querySelector('[data-facet-search]');
                // Phones would raise the keyboard over the panel.
                if (input && window.matchMedia('(min-width: 641px)').matches) input.focus({ preventScroll: true });
            });
        });
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('details.commu-people-facet')) closeFacets(null);
    });
    document.addEventListener('keydown', function(event) {
        if (event.key !== 'Escape') return;
        var open = document.querySelector('details.commu-people-facet[open]');
        if (!open) return;
        open.open = false;
        open.querySelector('summary').focus();
    });

    // ── Search box ──────────────────────────────────────────────────────
    var form = document.querySelector('[data-people-search]');
    var searchInput = form && form.querySelector('input[name="q"]');
    var clearBtn = form && form.querySelector('.commu-people-search-clear');
    var typingTimer = null;

    function highlight(root) {
        var query = searchInput ? searchInput.value.trim() : '';
        var re = query && window.__commuSearch ? window.__commuSearch.pattern(query) : null;
        if (!re) return;
        root.querySelectorAll('.commu-person-card').forEach(function(card) { window.__commuSearch.highlightPerson(card, re); });
        root.querySelectorAll('.commu-people-row-name strong, .commu-people-row-alias, .commu-people-row-epithet').forEach(function(part) {
            window.__commuSearch.highlight(part, re);
        });
    }

    // ── Swap ────────────────────────────────────────────────────────────
    var pending = null;

    function isExplorerUrl(url) {
        return url.origin === location.origin && url.pathname.replace(/^\/en(?=\/)/, '').replace(/\/$/, '') === '/commulingo/people';
    }

    function initBrowser(root) {
        initShelves(root);
        initFacetSearch(root);
        highlight(root);
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
                if (options.push) history.pushState({ people: true }, '', url);
                else if (options.replace) history.replaceState({ people: true }, '', url);
                initBrowser(next);
                // Typing keeps the caret and the page where they are; otherwise
                // bring the results head into view when it is off screen.
                var results = next.querySelector('#people-results');
                if (results && !options.typing) {
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
        if (!link || !root || !root.contains(link) || link.closest('.commu-person-card, .commu-people-row, .commu-people-group')) return;
        var url = new URL(link.href, location.href);
        if (!isExplorerUrl(url) || url.hash) return;
        event.preventDefault();
        if (searchInput) syncSearch(url.searchParams.get('q') || '');
        swap(url.href, { push: true, scrollToResults: !!link.closest('[data-commu-list-pager]') });
    });

    window.addEventListener('popstate', function() {
        if (searchInput) syncSearch(new URL(location.href).searchParams.get('q') || '');
        swap(location.href, { push: false });
    });

    function syncSearch(value) {
        searchInput.value = value;
        clearBtn.hidden = !value;
    }
    function searchUrl() {
        var url = new URL(location.href);
        var query = searchInput.value.trim();
        if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
        url.searchParams.delete('page');
        // A new query ranks by relevance; a sort picked for the old one goes.
        url.searchParams.delete('sort');
        url.hash = '';
        return url.href;
    }
    function runSearch(options) {
        clearTimeout(typingTimer);
        clearBtn.hidden = !searchInput.value;
        var url = searchUrl();
        if (url !== location.href) swap(url, options);
        else if (options.scrollToResults) {
            var results = document.getElementById('people-results');
            if (results) results.scrollIntoView({ block: 'start' });
        }
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

    if (browser()) initBrowser(browser());
    window.addEventListener('hashchange', focusHash);
    focusHash();
})();
