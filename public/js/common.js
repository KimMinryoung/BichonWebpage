// Date formatting follows the page language instead of always forcing Korean.
var documentLocale = document.documentElement.lang === 'en' ? 'en-US' : 'ko-KR';
document.querySelectorAll('.local-date').forEach(function(el) {
    var d = new Date(el.getAttribute('datetime'));
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = d.toLocaleDateString(documentLocale, { year: 'numeric', month: 'long', day: 'numeric' }) + suffix;
});
document.querySelectorAll('.local-date-short').forEach(function(el) {
    var d = new Date(el.getAttribute('datetime'));
    el.textContent = d.toLocaleDateString(documentLocale);
});

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
    var icon = btn.querySelector('.theme-toggle-icon') || btn;
    var isEnglish = html.lang === 'en';

    function getTheme() {
        return html.getAttribute('data-theme') || 'dark';
    }

    function setIcon() {
        var theme = getTheme();
        var isLight = theme === 'light';
        icon.textContent = isLight ? '\u263C' : '\u263E';
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
