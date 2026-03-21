// Date formatting for .local-date and .local-date-short elements
document.querySelectorAll('.local-date').forEach(function(el) {
    var d = new Date(el.getAttribute('datetime'));
    var suffix = el.getAttribute('data-suffix') || '';
    el.textContent = d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) + suffix;
});
document.querySelectorAll('.local-date-short').forEach(function(el) {
    var d = new Date(el.getAttribute('datetime'));
    el.textContent = d.toLocaleDateString('ko-KR');
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

    function setIcon() {
        var theme = html.getAttribute('data-theme');
        btn.textContent = theme === 'light' ? '\u263C' : '\u263E';
        btn.title = theme === 'light' ? 'Dark mode' : 'Light mode';
    }
    setIcon();

    btn.addEventListener('click', function() {
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        setIcon();
    });
})();
