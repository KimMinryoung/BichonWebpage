// The site's loading placeholder (style.css .site-loading): long translucent
// bars where the content will land, with a hidden status line for screen
// readers. `count` bars; `options.head` makes the first a short heading bar,
// `options.compact` thin bars for small spaces like a search dropdown.
window.siteLoading = {
    bars: function(count, options) {
        options = options || {};
        var en = document.documentElement.lang === 'en';
        var box = document.createElement('div');
        box.className = 'site-loading' + (options.compact ? ' is-compact' : '') + (options.className ? ' ' + options.className : '');
        var status = document.createElement('p');
        status.className = 'visually-hidden';
        status.setAttribute('role', 'status');
        status.textContent = options.label || (en ? 'Loading…' : '불러오는 중…');
        for (var i = 0; i < (count || 5); i++) {
            var bar = document.createElement('span');
            bar.setAttribute('aria-hidden', 'true');
            if (i === 0 && options.head) bar.className = 'is-head';
            else if (i === (count || 5) - 1) bar.className = 'is-short';
            box.appendChild(bar);
        }
        box.appendChild(status);
        return box;
    }
};

// The server writes each date in Asia/Seoul (utils/local-date.js); this
// redraws it in the page language and the viewer's own zone, touching the
// text only when it differs. Rows a search draws later have no text yet
// (commulingo-dict-search.js calls this on them).
var documentLocale = document.documentElement.lang === 'en' ? 'en-US' : 'ko-KR';
window.formatLocalDates = function(root) {
    function put(el, text) { if (el.textContent !== text) el.textContent = text; }
    root.querySelectorAll('.local-date').forEach(function(el) {
        var d = new Date(el.getAttribute('datetime'));
        if (isNaN(d)) return;
        var suffix = el.getAttribute('data-suffix') || '';
        put(el, d.toLocaleDateString(documentLocale, { year: 'numeric', month: 'long', day: 'numeric' }) + suffix);
    });
    root.querySelectorAll('.local-date-short').forEach(function(el) {
        var d = new Date(el.getAttribute('datetime'));
        if (isNaN(d)) return;
        put(el, d.toLocaleDateString(documentLocale));
    });
};
window.formatLocalDates(document);

// Confirm dialog via data-confirm attribute on forms
document.addEventListener('submit', function(e) {
    var msg = e.target.getAttribute('data-confirm');
    if (msg && !confirm(msg)) {
        e.preventDefault();
    }
});

// Theme toggle
(function() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var html = document.documentElement;
    var isEnglish = html.lang === 'en';
    // partials/theme-init sets the first theme (saved choice, else the
    // system's) and owns saving; a page without it falls back to the attribute.
    var theme = window.siteTheme || {
        current: function () { return html.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; },
        choose: function (t) {
            html.setAttribute('data-theme', t);
            try { localStorage.setItem('theme', t); } catch (e) {}
        }
    };

    function getTheme() {
        return theme.current();
    }

    function setIcon() {
        var theme = getTheme();
        var isLight = theme === 'light';
        btn.setAttribute('aria-pressed', String(isLight));
        btn.setAttribute('aria-label', isLight
            ? (isEnglish ? 'Switch to dark mode' : '다크 모드로 전환')
            : (isEnglish ? 'Switch to light mode' : '라이트 모드로 전환'));
    }
    setIcon();
    // The system setting can change the theme while no choice is saved.
    document.addEventListener('site-themechange', setIcon);

    btn.addEventListener('click', function() {
        theme.choose(getTheme() === 'dark' ? 'light' : 'dark');
        setIcon();
    });
})();

// People filter links with more than one condition (a card's affiliation
// badge, a person's activity rows): a Cloudflare rule challenges such URLs
// unless the people explorer's fetch marks them (X-Commu-Swap), so a click
// goes through that fetch — in place on the explorer, and from other pages
// by opening the explorer with a #filter= handoff it fetches on load.
(function() {
    var PEOPLE = /^(\/en)?\/commulingo\/people\/?$/;
    function filterUrl(event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (!link || link.target) return null;
        var url = new URL(link.href, location.href);
        if (url.origin !== location.origin || !PEOPLE.test(url.pathname) || url.search.indexOf('&') < 0 || url.hash) return null;
        return url;
    }
    function handoff(url) { return url.pathname + '#filter=' + encodeURIComponent(url.search.slice(1)); }
    document.addEventListener('click', function(event) {
        if (event.defaultPrevented || event.button !== 0 || event.altKey) return;
        var url = filterUrl(event);
        if (!url) return;
        var modified = event.metaKey || event.ctrlKey || event.shiftKey;
        // The explorer swaps its own facet and pager links; it takes the rest.
        if (!modified && window.__commuPeopleSwap) {
            if (window.__commuPeopleSwap(url.href, event.target.closest('a'))) event.preventDefault();
            return;
        }
        event.preventDefault();
        if (modified) window.open(handoff(url), '_blank', 'noopener');
        else location.href = handoff(url);
    }, true);
    document.addEventListener('auxclick', function(event) {
        var url = event.button === 1 && filterUrl(event);
        if (!url) return;
        event.preventDefault();
        window.open(handoff(url), '_blank', 'noopener');
    }, true);
})();

// Drag to scroll with a mouse: maps, the genealogy chart and the war boards.
// A touch screen pans these boxes natively; a mouse had only the scrollbars,
// which sit at the far edge of a tall drawing or are hidden altogether.
// `data-drag-scroll` marks a box that scrolls; the value "page-y" hands the
// vertical part of the drag to the page for a box that only scrolls sideways.
// The battle grid of the war games is rebuilt on every render, so it is named
// here by class instead. A press that moves less than 5px stays a click.
(function() {
    var SELECTOR = '[data-drag-scroll], .cw-grid-scroll';
    var drag = null;
    var suppressClick = false;
    function scrollsOn(box, axis) {
        var style = window.getComputedStyle(box);
        var mode = axis === 'x' ? style.overflowX : style.overflowY;
        if (mode !== 'auto' && mode !== 'scroll') return false;
        return axis === 'x' ? box.scrollWidth > box.clientWidth + 1 : box.scrollHeight > box.clientHeight + 1;
    }
    document.addEventListener('pointerdown', function(event) {
        suppressClick = false;
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        var target = event.target;
        if (!target || !target.closest || target.closest('input, textarea, select, [contenteditable]')) return;
        var box = target.closest(SELECTOR);
        if (!box) return;
        var pageY = box.getAttribute('data-drag-scroll') === 'page-y';
        var x = scrollsOn(box, 'x');
        var y = scrollsOn(box, 'y');
        if (!x && !y) return;
        drag = { box: box, x: event.clientX, y: event.clientY, moved: false, boxY: y, pageY: pageY && !y };
    }, true);
    window.addEventListener('pointermove', function(event) {
        if (!drag) return;
        var dx = event.clientX - drag.x;
        var dy = event.clientY - drag.y;
        if (!drag.moved) {
            if (Math.abs(dx) + Math.abs(dy) < 5) return;
            drag.moved = true;
            drag.box.classList.add('is-dragging');
            if (window.getSelection) { var selection = window.getSelection(); if (selection && selection.removeAllRanges) selection.removeAllRanges(); }
        }
        drag.box.scrollLeft -= dx;
        if (drag.boxY) drag.box.scrollTop -= dy;
        else if (drag.pageY) window.scrollBy(0, -dy);
        drag.x = event.clientX;
        drag.y = event.clientY;
        event.preventDefault();
    });
    function end() {
        if (!drag) return;
        suppressClick = drag.moved;
        drag.box.classList.remove('is-dragging');
        drag = null;
    }
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    // A link or image under the pointer would otherwise start a native drag.
    document.addEventListener('dragstart', function(event) {
        if (drag) event.preventDefault();
    });
    // The click that ends a drag must not act on what lies under it.
    document.addEventListener('click', function(event) {
        if (!suppressClick) return;
        suppressClick = false;
        event.preventDefault();
        event.stopPropagation();
    }, true);
})();
