// Date formatting follows the page language instead of always forcing Korean.
var documentLocale = document.documentElement.lang === 'en' ? 'en-US' : 'ko-KR';
// Also run over list rows a search draws later (commulingo-dict-search.js).
window.formatLocalDates = function(root) {
    root.querySelectorAll('.local-date').forEach(function(el) {
        var d = new Date(el.getAttribute('datetime'));
        var suffix = el.getAttribute('data-suffix') || '';
        el.textContent = d.toLocaleDateString(documentLocale, { year: 'numeric', month: 'long', day: 'numeric' }) + suffix;
    });
    root.querySelectorAll('.local-date-short').forEach(function(el) {
        var d = new Date(el.getAttribute('datetime'));
        el.textContent = d.toLocaleDateString(documentLocale);
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

    function getTheme() {
        return html.getAttribute('data-theme') || 'dark';
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

    btn.addEventListener('click', function() {
        var next = getTheme() === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
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
