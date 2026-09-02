// People dictionary page (views/public/commulingo-people.ejs): chunked card
// reveal, lazy per-group card loading, #p-<id> deep links, and live search.
// Was four inline <script> blocks on a no-cache page; as a versioned file it
// is immutable-cached. PAGE_SIZE comes from data-page-size on the shell.

// Chunked reveal, shared by the group grids and the search results.
//
// A person card costs about 5.3ms of style, layout and paint, and that
// is essentially the whole cost of both slow paths: a CPU profile of one
// keystroke spent 15,460ms of 15,833ms inside the engine and under
// 400ms in script. Rendering 368 cards to open a group, or 883 to show
// what 'ㄹ' matches, is therefore seconds of work for a screenful the
// reader can actually see. So cards are appended a chunk at a time, with
// the rest held off-DOM, and a sentinel below the last one pulls in the
// next chunk as it comes into view.
//
// Note this is not content-visibility: the cards below simply do not
// exist yet, so nothing is holding a guessed height and nothing snaps
// when they arrive. The page only grows downwards, past what the reader
// is looking at.
window.__commuChunk = (function() {
    var CHUNK = 40;
    // 600px of runway, so the next chunk is usually in place before the
    // reader reaches the end of the current one.
    var MARGIN_PX = 600;
    var MARGIN = MARGIN_PX + 'px 0px';

    // A sentinel the reader flings straight past never re-enters the
    // viewport, and IntersectionObserver only reports entering — so the
    // list under it would be stranded. The result view stacks three
    // grids, so this is reachable in ordinary use: jumping to the foot
    // of the page skips the first two sentinels entirely. After a scroll
    // settles, top up anything now above the fold.
    var live = [];
    var settle = null;
    function pump() {
        for (var i = live.length - 1; i >= 0; i--) {
            var handle = live[i];
            if (handle.exhausted()) { live.splice(i, 1); continue; }
            if (handle.sentinelTop() < window.innerHeight + MARGIN_PX) handle.append();
        }
    }
    function onScroll() {
        if (settle) clearTimeout(settle);
        settle = setTimeout(pump, 150);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Appends `items` into `target` a chunk at a time, `onAppend` firing
    // with each slice so a caller can highlight what just landed. The
    // items not yet appended stay detached: they keep their attributes,
    // so search can still read them without their costing a single
    // frame of layout.
    function reveal(target, items, onAppend) {
        var next = 0;
        var sentinel = document.createElement('div');
        sentinel.className = 'commu-chunk-sentinel';
        sentinel.setAttribute('aria-hidden', 'true');
        var observer = null;

        function append() {
            if (next >= items.length) return void retire();
            var slice = items.slice(next, next + CHUNK);
            next += slice.length;
            var frag = document.createDocumentFragment();
            slice.forEach(function(node) { frag.appendChild(node); });
            target.insertBefore(frag, sentinel);
            if (onAppend) onAppend(slice);
            if (next >= items.length) retire();
        }

        // Everything is shown; the sentinel has no more work to do.
        function retire() {
            if (observer) { observer.disconnect(); observer = null; }
            if (sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
            var at = live.indexOf(handle);
            if (at !== -1) live.splice(at, 1);
        }

        function watch() {
            if (next >= items.length) return;
            if ('IntersectionObserver' in window) {
                observer = new IntersectionObserver(function(entries) {
                    if (entries.some(function(e) { return e.isIntersecting; })) append();
                }, { rootMargin: MARGIN });
                observer.observe(sentinel);
            } else {
                // No observer: show everything rather than strand cards
                // the reader has no way to reach.
                while (next < items.length) append();
            }
        }

        var handle = {
            items: items,
            append: append,
            exhausted: function() { return next >= items.length; },
            sentinelTop: function() {
                // A sentinel inside a closed <details> or a hidden group
                // has no box, and its rect reads as 0 — which the scroll
                // top-up would take for "above the fold" and drain the
                // whole list into a grid nobody is looking at. Anything
                // without layout is simply not due yet.
                if (!sentinel.parentNode || sentinel.offsetParent === null) return Infinity;
                return sentinel.getBoundingClientRect().top;
            },
            // Detaches the whole list, for a target being rebuilt.
            clear: function() {
                retire();
                items.forEach(function(node) {
                    if (node.parentNode) node.parentNode.removeChild(node);
                });
                next = 0;
            },
            // Appends chunks until `node` is on the page. Used by
            // #p-<id> deep links, which may point past the first chunk.
            revealNode: function(node) {
                var index = items.indexOf(node);
                if (index < 0) return false;
                while (next <= index) append();
                return true;
            }
        };

        target.appendChild(sentinel);
        live.push(handle);
        append();
        watch();
        return handle;
    }

    return { reveal: reveal, CHUNK: CHUNK };
})();

// Lazy card loading, a page at a time. Opening a group fetches one page
// of its cards (/commulingo/people/cards?group=<id>&page=N, with the
// site's pager appended) instead of the whole group — the largest group
// is 900KB of markup — and the pager under the grid fetches the next.
// Search needs every card of every group, so it keeps a second,
// detached corpus per group (the same endpoint without `page`), which
// never touches the page view: clearing a search leaves each group on
// the page it was showing.
(function() {
    var en = document.documentElement.lang === 'en';
    var PAGE_SIZE = parseInt(document.querySelector('.commu-people-shell').getAttribute('data-page-size'), 10) || 24;
    var pending = {};
    var groupEls = Array.prototype.slice.call(
        document.querySelectorAll('details.commu-people-group[data-group-id]'));

    // Card-shaped placeholders while a group's grid downloads: the open
    // group keeps the shape it is about to have, instead of dropping a
    // bare line of text into an empty grid. aria-hidden, with a visually
    // hidden status line carrying the same news to screen readers.
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

    // Fetches one group's markup (a page, or everything) and splits it
    // into its cards and, when paged, the pager block that follows them.
    function fetchGroup(id, page) {
        var key = id + (page ? ':' + page : '');
        if (pending[key]) return pending[key];
        // Under /en/… the fragment must come from /en/… too, so its
        // card links carry the English prefix instead of costing a
        // redirect on every click.
        var langPrefix = location.pathname.indexOf('/en/') === 0 ? '/en' : '';
        var url = langPrefix + '/commulingo/people/cards?group=' + encodeURIComponent(id) + (page ? '&page=' + page : '');
        pending[key] = fetch(url, { credentials: 'same-origin' })
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function(html) {
                var holder = document.createElement('template');
                holder.innerHTML = html;
                var nodes = Array.prototype.slice.call(holder.content.children);
                var pager = null;
                var cards = nodes.filter(function(node) {
                    if (node.hasAttribute('data-commu-list-pager')) { pager = node; return false; }
                    return true;
                });
                return { cards: cards, pager: pager };
            })
            .catch(function(err) { delete pending[key]; throw err; });
        return pending[key];
    }

    // Shows page `page` of a group: the grid is rebuilt from the page's
    // cards and the pager is placed under it, wired to fetch the next.
    function showPage(group, page) {
        var id = group.getAttribute('data-group-id');
        var grid = group.querySelector('.commu-people-grid');
        if (!grid) return Promise.resolve();
        if (group.__page === page) return Promise.resolve();
        var skeleton = makeSkeleton();
        var status = document.createElement('p');
        status.className = 'commu-sr-only';
        status.setAttribute('role', 'status');
        status.textContent = en ? 'Loading…' : '불러오는 중…';
        if (!group.__view) {
            grid.appendChild(skeleton);
            grid.appendChild(status);
        }
        return fetchGroup(id, page).then(function(result) {
            skeleton.remove();
            status.remove();
            if (group.__view) group.__view.clear();
            if (group.__pager) group.__pager.remove();
            group.__view = window.__commuChunk.reveal(grid, result.cards);
            group.__page = page;
            group.__pager = result.pager;
            if (result.pager) {
                group.appendChild(result.pager);
                result.pager.addEventListener('click', function(event) {
                    var link = event.target.closest('a[href]');
                    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
                    var match = /[?&]page=(\d+)/.exec(link.getAttribute('href') || '');
                    if (!match) return;
                    event.preventDefault();
                    showPage(group, parseInt(match[1], 10)).then(function() {
                        group.scrollIntoView({ block: 'start' });
                    }).catch(function() {});
                });
            }
            group.setAttribute('data-loaded', '');
        }, function(err) {
            skeleton.remove();
            status.remove();
            failNotice(grid);
            throw err;
        });
    }

    function loadGroup(group) {
        if (!group || group.hasAttribute('data-loaded')) return Promise.resolve();
        return showPage(group, 1);
    }

    // The search corpus: every card of the group, detached. Loaded on
    // the first search and kept; search reads attributes off these and
    // moves matches into the result grids.
    function loadCorpus(group) {
        if (group.__corpus) return Promise.resolve(group.__corpus);
        var id = group.getAttribute('data-group-id');
        return fetchGroup(id, 0).then(function(result) {
            group.__corpus = result.cards;
            return group.__corpus;
        });
    }

    groupEls.forEach(function(group) {
        group.addEventListener('toggle', function() {
            if (group.open) loadGroup(group).catch(function() {});
        });
    });

    window.__commuPeopleCards = {
        loadGroup: loadGroup,
        skeleton: makeSkeleton,
        loadAll: function() {
            return Promise.all(groupEls.map(function(group) { return loadCorpus(group); }));
        },
        groupFor: function(personId) {
            for (var i = 0; i < groupEls.length; i++) {
                var ids = ' ' + (groupEls[i].getAttribute('data-people') || '') + ' ';
                if (ids.indexOf(' ' + personId + ' ') !== -1) return groupEls[i];
            }
            return null;
        },
        // Every card of every group's search corpus, revealed or not.
        // Search matches against these attributes without rendering.
        allCards: function() {
            var out = [];
            groupEls.forEach(function(group) {
                if (group.__corpus) out.push.apply(out, group.__corpus);
            });
            return out;
        },
        // The page views were never touched by a search (it draws from
        // the corpus), so there is nothing to put back.
        restoreGroups: function() {},
        // Brings one person's card onto the page, for #p-<id> arrivals:
        // data-people is in card order, so the position gives the page.
        revealPerson: function(group, personId) {
            if (!group) return Promise.resolve();
            var ids = (group.getAttribute('data-people') || '').split(' ');
            var index = ids.indexOf(personId);
            if (index < 0) return Promise.resolve();
            return showPage(group, Math.floor(index / PAGE_SIZE) + 1);
        }
    };
})();

// Highlight the card targeted by the URL hash (arriving from a book's
// name link), fetching its group's cards first if needed.
(function() {
    function focusCard(personId) {
        var card = document.getElementById('p-' + personId);
        if (!card) return;
        var group = card.closest('details.commu-people-group');
        if (group) group.open = true;
        document.querySelectorAll('.commu-person-card.is-focused').forEach(function(el) {
            el.classList.remove('is-focused');
        });
        card.classList.add('is-focused');
        window.requestAnimationFrame(function() {
            card.scrollIntoView({ block: 'start' });
        });
    }
    function focusHash() {
        var hash = window.location.hash;
        if (!hash) return;
        if (hash.indexOf('#office-') === 0) {
            var office = document.getElementById(hash.slice(1));
            var officeIndex = document.querySelector('details.commu-office-index');
            if (officeIndex) officeIndex.open = true;
            if (office && office.tagName === 'DETAILS') {
                office.open = true;
                window.requestAnimationFrame(function() {
                    office.scrollIntoView({ block: 'start' });
                });
            }
            return;
        }
        if (hash.indexOf('#p-') !== 0) return;
        var personId = hash.slice(3);
        var group = window.__commuPeopleCards.groupFor(personId);
        // The card may sit on a later page of its group, so ask for it
        // by name; the group fetches that page if it is not showing it.
        window.__commuPeopleCards.revealPerson(group, personId)
            .then(function() { focusCard(personId); })
            .catch(function() {});
    }
    window.addEventListener('hashchange', focusHash);
    focusHash();
})();

// Live person search. Each card carries three haystacks: data-name
// (identity), data-role (category/career/institution), data-desc (prose).
// Terms are AND-matched and bucketed most-identity-first into three
// result containers: name → role → description. Matched cards are moved
// into the result grids (restored on clear) and the matched substrings
// are wrapped in <mark> for highlighting.
(function() {
    var input = document.getElementById('commu-people-search-input');
    var clearBtn = document.getElementById('commu-people-search-clear');
    if (!input) return;
    var en = document.documentElement.lang === 'en';
    var results = document.getElementById('commu-people-results');
    var emptyMsg = document.getElementById('commu-people-result-empty');
    var buckets = ['name', 'role', 'desc'].map(function(key) {
        return {
            key: key,
            section: document.getElementById('commu-people-result-' + key),
            grid: document.getElementById('commu-people-result-' + key + '-grid'),
            count: document.getElementById('commu-people-result-' + key + '-count')
        };
    });
    var groups = Array.prototype.slice.call(document.querySelectorAll('details.commu-people-group'));
    var chrome = Array.prototype.slice.call(document.querySelectorAll(
        'details.commu-office-index, .commu-people-shelf'));
    // Cards load lazily. allCards() hands back every card of every
    // loaded group, including the ones still detached behind a chunk
    // sentinel — matching only reads their attributes, so an unrevealed
    // card is searchable without costing a frame of layout.
    var cards = [];
    var cardsReady = null;
    var emptyText = emptyMsg.textContent;
    function ensureCards() {
        if (!cardsReady) {
            cardsReady = window.__commuPeopleCards.loadAll().then(function() {
                cards = window.__commuPeopleCards.allCards();
            });
        }
        return cardsReady;
    }
    // Start the download as soon as the reader engages the search box,
    // so the cards are usually there before the first keystroke lands.
    input.addEventListener('focus', function() { ensureCards(); }, { once: true });
    var highlighted = [];

    function countText(n) {
        if (en) return n + (n === 1 ? ' person' : ' people');
        return n + '명';
    }
    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    // Skeleton shown in the results panel while the first search waits
    // for the card download. It exists only during that wait: apply()
    // and reset() both tear it down first, so a finished search shows
    // results or the empty message and never a leftover placeholder.
    var searchSkel = null;
    function showSearchSkeleton() {
        if (searchSkel) return;
        searchSkel = document.createElement('div');
        searchSkel.className = 'commu-people-grid commu-people-search-skel';
        searchSkel.appendChild(window.__commuPeopleCards.skeleton());
        var status = document.createElement('p');
        status.className = 'commu-sr-only';
        status.setAttribute('role', 'status');
        status.textContent = en ? 'Loading people…' : '인물 데이터를 불러오는 중…';
        searchSkel.appendChild(status);
        results.insertBefore(searchSkel, emptyMsg);
    }
    function hideSearchSkeleton() {
        if (searchSkel) {
            searchSkel.remove();
            searchSkel = null;
        }
    }
    // Reveal handles for the three result grids, so a new query can tear
    // down the previous one's sentinels before building its own.
    var shown = [];
    function clearResults() {
        shown.forEach(function(handle) { handle.clear(); });
        shown = [];
    }
    function clearHighlights(card) {
        var marks = card.querySelectorAll('mark.commu-search-hl');
        for (var i = 0; i < marks.length; i++) {
            var mark = marks[i];
            var parent = mark.parentNode;
            while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
            parent.removeChild(mark);
            parent.normalize();
        }
    }
    function highlight(card, re) {
        var walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT, {
            acceptNode: function(node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var nodes = [], n;
        while ((n = walker.nextNode())) nodes.push(n);
        nodes.forEach(function(node) {
            var text = node.nodeValue;
            re.lastIndex = 0;
            if (!re.test(text)) return;
            re.lastIndex = 0;
            var frag = document.createDocumentFragment();
            var last = 0, match;
            while ((match = re.exec(text))) {
                if (match.index > last) frag.appendChild(document.createTextNode(text.slice(last, match.index)));
                var mark = document.createElement('mark');
                mark.className = 'commu-search-hl';
                mark.textContent = match[0];
                frag.appendChild(mark);
                last = match.index + match[0].length;
                if (re.lastIndex === match.index) re.lastIndex++;
            }
            if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
            node.parentNode.replaceChild(frag, node);
        });
    }

    function reset() {
        hideSearchSkeleton();
        highlighted.forEach(clearHighlights);
        highlighted = [];
        clearResults();
        window.__commuPeopleCards.restoreGroups();
        results.hidden = true;
        groups.forEach(function(group) { group.hidden = false; group.open = false; });
        chrome.forEach(function(el) { el.hidden = false; });
        clearBtn.hidden = true;
    }

    function apply(query) {
        var terms = query.split(/\s+/).filter(Boolean);
        if (!terms.length) { reset(); return; }
        hideSearchSkeleton();
        emptyMsg.textContent = emptyText;
        highlighted.forEach(clearHighlights);
        highlighted = [];
        // Detach the previous query's results rather than walking all
        // 1341 cards home: only what is on screen has to be undone.
        clearResults();
        clearBtn.hidden = false;
        groups.forEach(function(group) { group.hidden = true; });
        chrome.forEach(function(el) { el.hidden = true; });

        var hits = { name: [], role: [], desc: [] };
        cards.forEach(function(card) {
            var nameHay = card.getAttribute('data-name') || '';
            var roleHay = nameHay + ' ' + (card.getAttribute('data-role') || '');
            var descHay = roleHay + ' ' + (card.getAttribute('data-desc') || '');
            function all(hay) { return terms.every(function(t) { return hay.indexOf(t) !== -1; }); }
            if (all(nameHay)) hits.name.push(card);
            else if (all(roleHay)) hits.role.push(card);
            else if (all(descHay)) hits.desc.push(card);
        });

        var re = new RegExp('(' + terms.slice().sort(function(a, b) { return b.length - a.length; })
            .map(escapeRegExp).join('|') + ')', 'gi');
        var total = 0;
        buckets.forEach(function(bucket) {
            var list = hits[bucket.key];
            bucket.section.hidden = list.length === 0;
            // The count stays the full match count — the reader is told
            // how many there are, and scrolling brings them in.
            bucket.count.textContent = countText(list.length);
            total += list.length;
            if (!list.length) return;
            shown.push(window.__commuChunk.reveal(bucket.grid, list, function(slice) {
                slice.forEach(function(card) {
                    highlight(card, re);
                    highlighted.push(card);
                });
            }));
        });
        emptyMsg.hidden = total > 0;
        results.hidden = false;
    }

    var raf = null;
    function onInput() {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function() {
            var query = input.value.trim().toLowerCase();
            if (!query) { apply(query); return; }
            if (cards.length) {
                ensureCards().then(function() { apply(input.value.trim().toLowerCase()); });
                return;
            }
            // First search before the cards arrived: lay skeleton cards
            // in the results panel, then run the query once the grids
            // are in — apply() clears the skeleton before it renders,
            // so a query with no matches shows only the empty message.
            groups.forEach(function(group) { group.hidden = true; });
            chrome.forEach(function(el) { el.hidden = true; });
            buckets.forEach(function(bucket) { bucket.section.hidden = true; });
            emptyMsg.hidden = true;
            showSearchSkeleton();
            results.hidden = false;
            clearBtn.hidden = false;
            ensureCards().then(function() {
                apply(input.value.trim().toLowerCase());
            }).catch(function() {
                hideSearchSkeleton();
                emptyMsg.textContent = en ? 'Failed to load people data' : '인물 데이터를 불러오지 못했습니다';
                emptyMsg.hidden = false;
            });
        });
    }
    input.addEventListener('input', onInput);
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && input.value) {
            event.preventDefault();
            input.value = '';
            reset();
        } else if (event.key === 'Enter') {
            var first = results.querySelector('.commu-person-card[data-person-href]');
            if (first) window.location.href = first.getAttribute('data-person-href');
        }
    });
    clearBtn.addEventListener('click', function() {
        input.value = '';
        reset();
        input.focus();
    });
    // Restore filtering if the browser repopulates the field on back-nav.
    if (input.value.trim()) onInput();
})();
