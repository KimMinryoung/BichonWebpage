(function() {
    var btn = document.getElementById('langBtn');
    var menu = document.getElementById('langMenu');
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('show');
    });
    document.addEventListener('click', function() {
        menu.classList.remove('show');
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
