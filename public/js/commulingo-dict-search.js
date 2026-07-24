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
        var list = document.querySelector(root.getAttribute('data-target'));
        if (!input || !clearButton || !status || !list) return;

        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-search]'));
        var highlighted = [];

        function reset() {
            highlighted.forEach(clearHighlights);
            highlighted = [];
            cards.forEach(function(card) { card.hidden = false; });
            clearButton.hidden = true;
            status.hidden = true;
            status.textContent = '';
        }

        function apply(query) {
            var terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);
            if (!terms.length) {
                reset();
                return;
            }

            highlighted.forEach(clearHighlights);
            highlighted = [];
            clearButton.hidden = false;
            var visible = 0;
            cards.forEach(function(card) {
                var haystack = (card.getAttribute('data-search') || '').toLocaleLowerCase();
                var matches = terms.every(function(term) { return haystack.indexOf(term) !== -1; });
                card.hidden = !matches;
                if (matches) visible++;
            });

            if (visible) {
                var re = new RegExp('(' + terms.slice().sort(function(a, b) { return b.length - a.length; })
                    .map(escapeRegExp).join('|') + ')', 'gi');
                cards.forEach(function(card) {
                    if (card.hidden) return;
                    highlight(card, re);
                    highlighted.push(card);
                });
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
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(function() { apply(input.value.trim()); });
        });
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && input.value) {
                event.preventDefault();
                input.value = '';
                reset();
            } else if (event.key === 'Enter') {
                var first = cards.find(function(card) { return !card.hidden; });
                if (first && input.value.trim()) window.location.href = first.href;
            }
        });
        clearButton.addEventListener('click', function() {
            input.value = '';
            reset();
            input.focus();
        });
        if (input.value.trim()) apply(input.value.trim());
    }

    Array.prototype.forEach.call(document.querySelectorAll('[data-commu-dict-search]'), initialize);
})();
