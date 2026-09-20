// Shared text handling for dictionary and person search.
window.__commuSearch = (function() {
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

    function terms(query) {
        return query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    }
    function pattern(query) {
        var words = terms(query).sort(function(a, b) { return b.length - a.length; });
        return words.length ? new RegExp('(' + words.map(escapeRegExp).join('|') + ')', 'gi') : null;
    }
    return { terms: terms, pattern: pattern, highlight: highlight, clearHighlights: clearHighlights };
})();
