// The library list (views/public/commulingo-docs.ejs): a card for a document
// the reader left in the middle (localStorage written by commulingo-doc.js
// readingPosition) gets a 「읽던 문헌 · n쪽」 mark. The search box replaces
// the cards, so the marks are redone whenever the list changes.
(function () {
    var list = document.getElementById('commu-doc-list');
    if (!list) return;
    var badge = list.getAttribute('data-reading-badge') || '';
    var pageLabel = list.getAttribute('data-reading-page') || '{page}';
    var PREFIX = 'commulingo-doc-reading:';

    function saved(pathname) {
        try { return JSON.parse(localStorage.getItem(PREFIX + pathname) || 'null'); } catch (e) { return null; }
    }
    function mark() {
        var cards = list.querySelectorAll('a.commu-event-card[href]');
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (card.querySelector('.commu-doc-card-reading')) continue;
            var pathname;
            try { pathname = new URL(card.getAttribute('href'), window.location.href).pathname; } catch (e) { continue; }
            var position = saved(pathname);
            if (!position || !(position.page > 1 || position.anchor)) continue;
            var span = document.createElement('span');
            span.className = 'commu-doc-card-reading';
            span.textContent = badge + (position.page > 1 ? ' · ' + pageLabel.replace('{page}', position.page) : '');
            var period = card.querySelector('.commu-event-period');
            if (period) period.insertAdjacentElement('afterend', span); else card.insertBefore(span, card.firstChild);
        }
    }
    mark();
    if (typeof MutationObserver !== 'undefined') new MutationObserver(mark).observe(list, { childList: true });
})();
