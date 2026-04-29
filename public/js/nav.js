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
            var secure = location.protocol === 'https:' ? ';Secure' : '';
            document.cookie = 'lang=' + e.target.dataset.lang + ';Path=/;Max-Age=31536000;SameSite=Lax' + secure;
            location.reload();
        }
    });
})();
