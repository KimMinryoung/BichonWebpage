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
            document.cookie = 'lang=' + e.target.dataset.lang + ';path=/;max-age=31536000';
            location.reload();
        }
    });
})();
