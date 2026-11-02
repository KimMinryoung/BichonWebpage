// The toolbar magnifier opens the search as a dialog that shows results as
// one types (GET <search path>/suggest, routes/search.js); Enter opens the
// full search page. "/" (outside a text field) and Ctrl/⌘+K open it from
// anywhere. Without this script the magnifier is a link to the search page.
(function () {
    var dialog = document.getElementById('siteSearchDialog');
    var opener = document.querySelector('.toolbar-search-btn');
    if (!dialog || !opener || typeof dialog.showModal !== 'function' || !window.fetch) return;
    var form = dialog.querySelector('form');
    var input = dialog.querySelector('input[name="q"]');
    var results = dialog.querySelector('.site-search-dialog-results');
    var prefix = location.pathname.indexOf('/en/') === 0 || location.pathname === '/en' ? '/en' : '';
    var searchPath = form.getAttribute('action');
    form.setAttribute('action', prefix + searchPath);

    var timer = null;
    var controller = null;
    var shown = '';

    function open() {
        if (dialog.open) { input.focus(); return; }
        dialog.showModal();
        input.focus();
        input.select();
    }

    function close() {
        if (dialog.open) dialog.close();
    }

    function show(query) {
        if (query === shown) return;
        if (controller) controller.abort();
        if (!query) {
            shown = '';
            results.innerHTML = '';
            return;
        }
        controller = window.AbortController ? new AbortController() : null;
        fetch(prefix + searchPath + '/suggest?q=' + encodeURIComponent(query), {
            signal: controller ? controller.signal : undefined,
            headers: { Accept: 'application/json' }
        }).then(function (res) {
            return res.ok ? res.json() : null;
        }).then(function (data) {
            if (!data || input.value.trim() !== query) return;
            shown = query;
            results.innerHTML = data.html || '';
        }).catch(function () {});
    }

    opener.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        open();
    });

    input.addEventListener('input', function () {
        clearTimeout(timer);
        var query = input.value.trim();
        timer = setTimeout(function () { show(query); }, query ? 180 : 0);
    });

    // Down from the box moves into the results; up from the first result
    // returns to the box.
    dialog.addEventListener('keydown', function (event) {
        // A search input eats the first Escape to clear itself; close at once.
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        var links = Array.prototype.slice.call(results.querySelectorAll('a'));
        if (!links.length) return;
        var at = links.indexOf(document.activeElement);
        if (event.target === input && event.key === 'ArrowDown') {
            event.preventDefault();
            links[0].focus();
        } else if (at !== -1) {
            event.preventDefault();
            if (event.key === 'ArrowDown') links[Math.min(at + 1, links.length - 1)].focus();
            else if (at === 0) input.focus();
            else links[at - 1].focus();
        }
    });

    dialog.addEventListener('click', function (event) {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === dialog || event.target.closest('[data-search-close]')) close();
    });

    function typing(target) {
        if (!target || !target.tagName) return false;
        var tag = target.tagName;
        return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    }

    document.addEventListener('keydown', function (event) {
        if (event.defaultPrevented || event.isComposing) return;
        var key = (event.key || '').toLowerCase();
        if (key === 'k' && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
            event.preventDefault();
            open();
        } else if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !typing(event.target)) {
            event.preventDefault();
            open();
        }
    });
})();
