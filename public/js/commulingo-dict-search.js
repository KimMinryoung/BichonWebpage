(function() {
    'use strict';

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
        var nodes = [];
        var node;
        while ((node = walker.nextNode())) nodes.push(node);
        nodes.forEach(function(textNode) {
            var text = textNode.nodeValue;
            re.lastIndex = 0;
            if (!re.test(text)) return;
            re.lastIndex = 0;
            var fragment = document.createDocumentFragment();
            var last = 0;
            var match;
            while ((match = re.exec(text))) {
                if (match.index > last) fragment.appendChild(document.createTextNode(text.slice(last, match.index)));
                var mark = document.createElement('mark');
                mark.className = 'commu-search-hl';
                mark.textContent = match[0];
                fragment.appendChild(mark);
                last = match.index + match[0].length;
                if (re.lastIndex === match.index) re.lastIndex++;
            }
            if (last < text.length) fragment.appendChild(document.createTextNode(text.slice(last)));
            textNode.parentNode.replaceChild(fragment, textNode);
        });
    }

    function initialize(root) {
        var input = root.querySelector('[data-commu-dict-search-input]');
        var clearButton = root.querySelector('[data-commu-dict-search-clear]');
        var status = root.querySelector('[data-commu-dict-search-status]');
        var target = root.getAttribute('data-target');
        var list = document.querySelector(target);
        if (!input || !clearButton || !status || !list) return;

        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-search]'));
        var highlighted = [];
        // A list marked data-lazy loads its cards in groups (see the glossary
        // shell). Filtering needs every card, so those paths wait on the
        // page's loader; a list without the attribute resolves immediately.
        var lazyPending = list.hasAttribute('data-lazy');
        function rescanCards() {
            cards = Array.prototype.slice.call(list.querySelectorAll('[data-search]'));
        }
        function ensureLoaded() {
            if (!lazyPending || typeof window.__commuDictLazyLoad !== 'function') {
                return Promise.resolve();
            }
            return window.__commuDictLazyLoad().then(function() {
                lazyPending = false;
                rescanCards();
            });
        }
        // Groups also stream in while the reader just scrolls; keep the card
        // list current and re-run any active filter over the newcomers.
        // Engaging search pulls in every remaining group, so this fires 25 times
        // in a row; coalesce them into one pass rather than re-filtering the
        // whole list once per arrival.
        var restyle = null;
        list.addEventListener('commu-cards-changed', function() {
            rescanCards();
            if (!(input.value.trim() || category)) return;
            if (restyle) cancelAnimationFrame(restyle);
            restyle = requestAnimationFrame(function() { restyle = null; apply(); });
        });
        // Engaging the search box prefetches the rest of the list, so the
        // cards are usually in place before the first keystroke settles.
        input.addEventListener('focus', function() { ensureLoaded(); }, { once: true });
        // Optional category chips over the same list (glossary only). Query and
        // category are one filter with two inputs, so they share this state and
        // one visibility pass; two independent scripts toggling .hidden would
        // fight over the same cards.
        var chipRoot = document.querySelector('[data-commu-dict-chips][data-target="' + target + '"]');
        var chips = chipRoot ? Array.prototype.slice.call(chipRoot.querySelectorAll('[data-category]')) : [];
        var category = '';

        // ── Chunked reveal ────────────────────────────────────────────────
        // Showing a card costs style, layout and paint, and that is the whole
        // cost of filtering this list: 209 matches take 503ms and clearing back
        // to all 470 takes 1185ms, while the matching itself is a few ms. So
        // only the first chunk is unhidden and a sentinel below the last one
        // pulls in the next as it nears the viewport. The status line still
        // reports the full number of matches.
        var CHUNK = 60;
        var MARGIN_PX = 800;
        var queue = [];      // matched-but-not-yet-shown, in document order
        var activeRe = null; // highlight pattern for cards revealed later
        var sentinel = document.createElement('div');
        sentinel.className = 'commu-chunk-sentinel';
        sentinel.setAttribute('aria-hidden', 'true');
        var observer = null;
        var settle = null;

        function revealChunk() {
            var slice = queue.splice(0, CHUNK);
            slice.forEach(function(item) {
                item.hidden = false;
                if (activeRe && item.hasAttribute('data-search')) {
                    highlight(item, activeRe);
                    highlighted.push(item);
                }
            });
            if (!queue.length) retire();
        }

        function retire() {
            if (observer) { observer.disconnect(); observer = null; }
            if (sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
        }

        // The sentinel sits after every card, but hidden cards have no box, so
        // in practice it trails whatever is currently shown. A reader who flings
        // straight past it would otherwise strand the rest, and
        // IntersectionObserver only reports entering — hence the settle check.
        function topUp() {
            if (!queue.length) return retire();
            if (!sentinel.parentNode || sentinel.offsetParent === null) return;
            if (sentinel.getBoundingClientRect().top < window.innerHeight + MARGIN_PX) revealChunk();
        }
        window.addEventListener('scroll', function() {
            if (settle) clearTimeout(settle);
            settle = setTimeout(topUp, 150);
        }, { passive: true });

        // Reveals `items` out of `all`, a chunk at a time. `re` is the highlight
        // pattern, or null when nothing is being searched. Only cards whose
        // visibility actually changes are written to: blanket-hiding all 470 and
        // building back up cost more than the reveal saved on a category chip,
        // where most of the list was hidden already.
        function showChunked(all, items, re) {
            retire();
            activeRe = re;
            var first = items.slice(0, CHUNK);
            queue = items.slice(CHUNK);
            first.forEach(function(item) { item.__chunkShow = true; });
            all.forEach(function(item) {
                var show = item.__chunkShow === true;
                if (item.hidden === show) item.hidden = !show;
            });
            first.forEach(function(item) {
                item.__chunkShow = false;
                if (re && item.hasAttribute('data-search')) {
                    highlight(item, re);
                    highlighted.push(item);
                }
            });
            list.appendChild(sentinel);
            if (!queue.length) retire();
            if (queue.length && 'IntersectionObserver' in window) {
                observer = new IntersectionObserver(function(entries) {
                    if (entries.some(function(entry) { return entry.isIntersecting; })) revealChunk();
                }, { rootMargin: MARGIN_PX + 'px 0px' });
                observer.observe(sentinel);
            } else if (queue.length) {
                while (queue.length) revealChunk();
            }
        }

        // Everything the browsing view shows, headings included, in the order it
        // shows them — so a revealed heading always arrives with its cards
        // rather than standing over an empty stretch.
        function browseItems() {
            return Array.prototype.filter.call(list.children, function(child) {
                return child !== sentinel;
            });
        }

        function apply() {
            var terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
            var searching = terms.length > 0;
            var categorized = category !== '';

            highlighted.forEach(clearHighlights);
            highlighted = [];

            if (!searching && !categorized) {
                list.classList.remove('is-filtering');
                list.classList.remove('is-ungrouped');
                // Before the whole list has been fetched, the page's own group
                // loader is still revealing it a group at a time as the reader
                // scrolls; chunking on top of that would fight it for which
                // heading may load next. Once everything is in — which is what
                // clearing a search returns to — this owns the reveal.
                if (lazyPending) {
                    retire();
                    cards.forEach(function(card) { card.hidden = false; });
                } else {
                    var all = browseItems();
                    showChunked(all, all, null);
                }
                clearButton.hidden = true;
                status.hidden = true;
                status.textContent = '';
                return;
            }

            // is-filtering lets card CSS drop the preview clamp so a highlight
            // can't hide in the overflow; both classes hide the group headings,
            // which would otherwise label sections that filtered down to empty.
            list.classList.toggle('is-filtering', searching);
            list.classList.toggle('is-ungrouped', categorized);
            clearButton.hidden = !searching;

            var matched = cards.filter(function(card) {
                var matches = !categorized || card.getAttribute('data-category') === category;
                if (matches && searching) {
                    var haystack = (card.getAttribute('data-search') || '').toLocaleLowerCase();
                    matches = terms.every(function(term) { return haystack.indexOf(term) !== -1; });
                }
                return matches;
            });
            var visible = matched.length;

            // Highlighting is handed to the reveal, so a card that arrives with
            // a later chunk is marked up the same as one in the first.
            var re = (visible && searching)
                ? new RegExp('(' + terms.slice().sort(function(a, b) { return b.length - a.length; })
                    .map(escapeRegExp).join('|') + ')', 'gi')
                : null;
            // The headings are hidden by is-filtering/is-ungrouped, so only the
            // cards take part; browseItems() would drag them back in.
            showChunked(cards, matched, re);

            if (visible) {
                var separator = document.documentElement.lang.indexOf('ko') === 0 ? '' : ' ';
                status.textContent = visible + separator + (visible === 1
                    ? root.getAttribute('data-result-one')
                    : root.getAttribute('data-result-many'));
            } else {
                status.textContent = root.getAttribute('data-result-empty');
            }
            status.classList.toggle('is-empty', visible === 0);
            status.hidden = false;
        }

        var frame = null;
        input.addEventListener('input', function() {
            ensureLoaded().then(function() {
                if (frame) cancelAnimationFrame(frame);
                frame = requestAnimationFrame(apply);
            });
        });
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && input.value) {
                event.preventDefault();
                input.value = '';
                apply();
            } else if (event.key === 'Enter') {
                ensureLoaded().then(function() {
                    var first = cards.find(function(card) { return !card.hidden; });
                    if (first && input.value.trim()) window.location.href = first.href;
                });
            }
        });
        clearButton.addEventListener('click', function() {
            input.value = '';
            apply();
            input.focus();
        });
        chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                var next = chip.getAttribute('data-category') || '';
                // Clicking the active chip clears the filter, same as 'All'.
                category = category === next ? '' : next;
                chips.forEach(function(other) {
                    var active = (other.getAttribute('data-category') || '') === category;
                    other.classList.toggle('is-active', active);
                    other.setAttribute('aria-pressed', active ? 'true' : 'false');
                });
                ensureLoaded().then(apply);
            });
        });
        if (input.value.trim()) apply();
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-commu-dict-search]'), initialize);
})();
