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
    menu.addEventListener('click', function(e) {
        if (e.target.dataset.lang) {
            e.preventDefault();
            var url = new URL(location.href);
            url.searchParams.set('lang', e.target.dataset.lang);
            location.assign(url.toString());
        }
    });

    // When the nav overflows (narrow screens), keep the current page's link in view
    var links = document.querySelector('nav .nav-links');
    var current = links && links.querySelector('a[aria-current="page"]');
    if (links && current && links.scrollWidth > links.clientWidth) {
        links.scrollLeft = current.offsetLeft - (links.clientWidth - current.offsetWidth) / 2;
    }
})();
