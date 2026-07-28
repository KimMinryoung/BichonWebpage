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
        list.addEventListener('commu-cards-changed', function() {
            rescanCards();
            if (input.value.trim() || category) apply();
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

        function apply() {
            var terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
            var searching = terms.length > 0;
            var categorized = category !== '';

            highlighted.forEach(clearHighlights);
            highlighted = [];

            if (!searching && !categorized) {
                cards.forEach(function(card) { card.hidden = false; });
                list.classList.remove('is-filtering');
                list.classList.remove('is-ungrouped');
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

            var visible = 0;
            cards.forEach(function(card) {
                var matches = !categorized || card.getAttribute('data-category') === category;
                if (matches && searching) {
                    var haystack = (card.getAttribute('data-search') || '').toLocaleLowerCase();
                    matches = terms.every(function(term) { return haystack.indexOf(term) !== -1; });
                }
                card.hidden = !matches;
                if (matches) visible++;
            });

            if (visible && searching) {
                var re = new RegExp('(' + terms.slice().sort(function(a, b) { return b.length - a.length; })
                    .map(escapeRegExp).join('|') + ')', 'gi');
                cards.forEach(function(card) {
                    if (card.hidden) return;
                    highlight(card, re);
                    highlighted.push(card);
                });
            }
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
