(function() {
    var btn = document.getElementById('langBtn');
    var menu = document.getElementById('langMenu');
    if (!btn || !menu) return;

    function setOpen(open) {
        menu.classList.toggle('show', open);
        btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        setOpen(!menu.classList.contains('show'));
    });
    document.addEventListener('click', function() {
        setOpen(false);
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('show')) {
            setOpen(false);
            btn.focus();
        }
    });
    // When the nav overflows (narrow screens), keep the current page's link in view
    var links = document.querySelector('nav .nav-links');
    var current = links && links.querySelector('a[aria-current="page"]');
    if (links && current && links.scrollWidth > links.clientWidth) {
        links.scrollLeft = current.offsetLeft - (links.clientWidth - current.offsetWidth) / 2;
    }
})();

// One page view for the site menu this page belongs to (routes/menu-views.js
// maps the path; edge-cached pages never reach the server otherwise).
(function() {
    if (!window.fetch) return;
    try {
        fetch('/metrics/menu-view', {
            method: 'POST', credentials: 'same-origin', keepalive: true,
            headers: { 'Content-Type': 'application/json', 'x-commulingo-measurement': '1' },
            body: JSON.stringify({ path: location.pathname })
        }).catch(function() {});
    } catch (e) {}
})();
