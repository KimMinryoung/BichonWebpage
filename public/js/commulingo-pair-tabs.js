// Switches between the two halves of one subject — the glossary entry and the
// history entry — without leaving the page. Both panels are rendered server
// side, so this only moves the `hidden` attribute and repaints the tab.
//
// The tabs are ordinary links to each half's own URL. Without JavaScript they
// still work as navigation; with it they stay on the page and the address bar
// is updated so a reload, a bookmark, or a shared link opens the half you were
// reading.
(function () {
    'use strict';
    var nav = document.querySelector('.commu-pair-tabs');
    if (!nav) return;
    var tabs = Array.prototype.slice.call(nav.querySelectorAll('.commu-pair-tab'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.commu-pair-panel'));
    if (tabs.length < 2 || panels.length < 2) return;

    var backLinks = Array.prototype.slice.call(document.querySelectorAll('[data-pair-back]'));

    // The back link belongs to whichever half is open, not to the URL the
    // reader happened to arrive on: reading the glossary panel and being
    // offered '← 역사 사건' points at the wrong shelf.
    function updateBackLinks(tab) {
        var href = tab.getAttribute('data-back-href');
        var label = tab.getAttribute('data-back-label');
        if (!href || !label) return;
        backLinks.forEach(function (link) {
            link.setAttribute('href', href);
            link.textContent = '← ' + label;
        });
    }

    function show(key, href, push) {
        panels.forEach(function (panel) {
            var active = panel.getAttribute('data-panel') === key;
            panel.hidden = !active;
            panel.classList.toggle('is-active', active);
        });
        tabs.forEach(function (tab) {
            var active = tab.getAttribute('data-panel') === key;
            tab.classList.toggle('is-active', active);
            if (active) {
                tab.setAttribute('aria-current', 'page');
                updateBackLinks(tab);
            } else {
                tab.removeAttribute('aria-current');
            }
        });
        nav.setAttribute('data-active', key);
        if (push && href && window.history && window.history.pushState) {
            window.history.pushState({ pairPanel: key }, '', href);
        }
    }

    tabs.forEach(function (tab) {
        tab.addEventListener('click', function (event) {
            // Let modified clicks open the counterpart in a new tab as usual.
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            event.preventDefault();
            show(tab.getAttribute('data-panel'), tab.getAttribute('href'), true);
            // The switched-in panel starts at its own heading rather than
            // wherever the reader had scrolled to in the other one.
            nav.scrollIntoView({ block: 'start' });
        });
    });

    // Back and forward move between the halves, matching the pushed URLs.
    window.addEventListener('popstate', function (event) {
        var key = (event.state && event.state.pairPanel)
            || (location.pathname.indexOf('/commulingo/events/') === 0 ? 'event' : 'term');
        show(key, null, false);
    });
})();
