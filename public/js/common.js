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
